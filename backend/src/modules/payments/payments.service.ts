import type { Sequelize } from 'sequelize';
import type { ContractQueue } from '../contracts/queues/contracts.queue';
import type { ContractSchema } from '../contracts/schemas/contract.schema';
import { OrderSchema } from '../orders/schemas/order.schema';
import type { ServiceSchema } from '../services/schemas/service.schema';
import { UserSchema } from '../users/schemas/user.schema';
import type { PaymentSchema } from './schemas/payment.schema';
import { OrderStatus } from '../orders/schemas/enums/order.enum';
import { ContractStatus } from '../contracts/schemas/enums/contract.enum';
import { FreelancerSchema } from '../freelancers/schemas/freelancer.schema';
import { PaymentStatus } from './schemas/enums/payment.enum';
import { UserProfileSchema } from '../user-profiles/schemas/user-profile.schema';
import { buildPagination } from '../../utilities/pagination';
import { Validator } from 'riser-bob';
import { RechargeBalanceRule } from './rules/recharge-balance.rule';
import type { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/enums/notification.enum';

export class PaymentsService {
  constructor(
    private readonly paymentSchema: typeof PaymentSchema,
    private readonly orderSchema: typeof OrderSchema,
    private readonly userSchema: typeof UserSchema,
    private readonly serviceSchema: typeof ServiceSchema,
    private readonly contractSchema: typeof ContractSchema,
    private readonly notificationsService: NotificationsService,
    private readonly contractQueue: ContractQueue,
    private readonly sequelize: Sequelize,
  ) {}

  async pay(userId: string, orderId: string) {
    const transaction = await this.sequelize.transaction();

    const createdContracts: ContractSchema[] = [];

    let committed = false;

    try {
      // 1. Lock the order
      const order = await this.orderSchema.findOne({
        where: {
          id: orderId,
          clientId: userId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!order) {
        await transaction.rollback();
        return {
          error: true,
          statusCode: 404,
          message: 'Order not found',
        } as const;
      }

      // 2. Make sure the order can still be paid
      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        return {
          error: true,
          statusCode: 400,
          message: 'This order cannot be processed in its current status.',
        } as const;
      }

      // 3. Lock the user's balance row
      const user = await this.userSchema.findByPk(userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!user) {
        return {
          error: true,
          statusCode: 404,
          message: 'User not found',
        } as const;
      }

      const amount = Number(order.totalAmount);
      const balance = Number(user.balance);

      if (!Number.isFinite(amount) || amount <= 0) {
        return {
          error: true,
          statusCode: 400,
          message: 'Invalid order amount.',
        } as const;
      }

      // 4. Check balance
      if (balance < amount) {
        return {
          error: true,
          statusCode: 400,
          message: 'Insufficient balance to complete this payment.',
        } as const;
      }

      // 5. Make sure there isn't already a successful payment
      const existingPayment = await this.paymentSchema.findOne({
        where: {
          orderId,
          status: PaymentStatus.COMPLETED,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (existingPayment) {
        return {
          error: true,
          statusCode: 400,
          message: 'This order has already been paid for.',
        } as const;
      }

      /**
       * 6. Move money:
       * balance       -= amount
       * frozenBalance += amount
       */
      user.balance = balance - amount;
      user.frozenBalance = Number(user.frozenBalance) + amount;

      await user.save({
        transaction,
      });

      // 7. Create successful payment
      const payment = await this.paymentSchema.create(
        {
          orderId,
          userId,
          amount,
          status: PaymentStatus.HELD,
          paidAt: new Date(),
        },
        {
          transaction,
        },
      );

      // 8. Get services from the order
      const services = await this.serviceSchema.findAll({
        where: {
          id: order.services.map((service) => service.id),
        },
        include: [
          {
            model: FreelancerSchema,
            as: 'freelancer',
            attributes: ['id', 'userId'],
          },
        ],
        transaction,
      });
      if (services.length !== order.services.length) {
        return {
          error: true,
          statusCode: 404,
          message: 'One or more services in this order could not be found.',
        } as const;
      }

      // 9. Create contracts
      for (const service of services) {
        const orderService = order.services.find(
          (item) => item.id === service.id,
        );

        if (!orderService) {
          return {
            error: true,
            statusCode: 400,
            message: 'Service details are missing from this order.',
          } as const;
        }

        const deadline = new Date();
        deadline.setDate(deadline.getDate() + orderService.deliveryDays);

        const contract = await this.contractSchema.create(
          {
            orderId: order.id,
            serviceId: service.id,
            freelancerId: service.freelancerId,
            clientId: userId,

            // Snapshot price from Order
            amount: orderService.price,

            // Snapshot delivery time from Order
            deliveryDays: orderService.deliveryDays,

            deadline,
            status: ContractStatus.IN_PROGRESS,
          },
          {
            transaction,
          },
        );

        // Save contract for BullMQ after DB commit
        createdContracts.push(contract);
      }

      // 10. Update order status
      order.status = OrderStatus.IN_PROGRESS;

      await order.save({
        transaction,
      });

      /**
       * 11. Commit everything
       */
      await transaction.commit();
      committed = true;

      for (const contract of createdContracts) {
        const service = services.find((item) => item.id === contract.serviceId);

        if (!service) continue;

        await this.notificationsService.create({
          senderId: userId,
          receiverId: service.freelancer.userId,
          targetId: contract.id,
          type: NotificationType.PAYMENT,
          message: `A client has purchased your service "${service.title}".`,
          link: `/contract/${contract.id}`,
        });
      }

      /**
       * 12. Add BullMQ jobs AFTER database commit
       *
       * The database transaction is already committed,
       * so Redis/BullMQ cannot cause the DB transaction
       * to rollback.
       */
      for (const contract of createdContracts) {
        await this.contractQueue.add(
          'expire-contract',
          {
            contractId: contract.id,
          },
          {
            delay: Math.max(0, contract.deadline.getTime() - Date.now()),
            jobId: `expire-contract-${contract.id}`,
          },
        );
      }

      return {
        success: true,
        message: 'Payment completed successfully',
        data: payment,
      } as const;
    } catch (error) {
      if (!committed) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10, offset = (page - 1) * limit) {
    const { rows: payments, count: total } =
      await this.paymentSchema.findAndCountAll({
        limit,
        offset,
        include: [
          {
            model: UserSchema,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            include: [
              {
                model: UserProfileSchema,
                as: 'profile',
                attributes: ['avatar'],
              },
            ],
          },
          {
            model: OrderSchema,
            as: 'order',
            attributes: ['id', 'totalAmount', 'status', 'createdAt'],
          },
        ],
        order: [['createdAt', 'DESC']],
        distinct: true,
      });

    return {
      success: true,
      data: payments,
      pagination: buildPagination(total, page, limit),
    } as const;
  }

  async findMe(userId: string) {
    const payments = await this.paymentSchema.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: OrderSchema,
          as: 'order',
          attributes: ['id', 'totalAmount', 'status', 'createdAt'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return {
      success: true,
      data: payments,
    } as const;
  }

  async findOne(userId: string, paymentId: string) {
    const payment = await this.paymentSchema.findOne({
      where: {
        id: paymentId,
        userId,
      },
      include: [
        {
          model: UserSchema,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [
            {
              model: UserProfileSchema,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
        {
          model: OrderSchema,
          as: 'order',
          attributes: ['id', 'totalAmount', 'status', 'createdAt'],
        },
      ],
    });

    if (!payment) {
      return {
        error: true,
        message: 'Payment not found',
      } as const;
    }

    return {
      success: true,
      data: payment,
    } as const;
  }

  async rechargeBalance(userId: string, amount: number) {
    const validation = Validator.validate({ amount }, RechargeBalanceRule);

    if (!validation.valid) {
      return {
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors: validation.errors,
      } as const;
    }

    const transaction = await this.sequelize.transaction();

    try {
      console.log('[Recharge] Transaction started');

      const user = await this.userSchema.findByPk(userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      console.log('[Recharge] User fetched');

      if (!user) {
        await transaction.rollback();

        return {
          error: true,
          statusCode: 404,
          message: 'User not found',
        } as const;
      }

      user.balance = Number(user.balance) + amount;

      await user.save({ transaction });

      console.log('[Recharge] Balance saved');

      await transaction.commit();

      console.log('[Recharge] Transaction committed');

      return {
        success: true,
        message: 'The balance has been successfully topped up.',
        data: {
          amount,
          balance: user.balance,
        },
      } as const;
    } catch (error) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('[Recharge] Rollback failed:', rollbackError);
      }

      console.error('[Recharge] Failed:', error);
      throw error;
    }
  }
}
