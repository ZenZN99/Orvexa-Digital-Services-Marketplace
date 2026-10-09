import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Payment } from './schema/payment.schema.js';
import { PaymentStatus } from '../../common/enums/payment.enum.js';
import { Order } from '../orders/schema/order.schema.js';
import { OrderStatus } from '../../common/enums/order.enum.js';
import { User } from '../users/schema/user.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { ContractStatus } from '../../common/enums/contract.enum.js';
import { Service } from '../services/schema/service.schema.js';
import { InjectModel } from '@nestjs/sequelize';
import { messages } from '../../common/libs/messages.js';
import { response } from '../../common/libs/response.js';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
import { NotificationType } from '../../common/enums/notification.enum.js';
import { NotificationService } from '../notifications/notification.service.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment) private readonly paymentModel: typeof Payment,
    @InjectModel(Order) private readonly orderModel: typeof Order,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Service) private readonly serviceModel: typeof Service,
    @InjectModel(Contract) private readonly contractModel: typeof Contract,
    @InjectQueue('contracts') private readonly contractQueue: Queue,
    private readonly notificationService: NotificationService,
    private readonly sequelize: Sequelize,
  ) {}

  async pay(userId: string, orderId: string) {
    const transaction = await this.sequelize.transaction();

    // Store created contracts so we can enqueue jobs after commit
    const createdContracts: Contract[] = [];

    let committed = false;

    try {
      // 1. Lock the order
      const order = await this.orderModel.findOne({
        where: {
          id: orderId,
          clientId: userId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!order) {
        throw new NotFoundException(messages.order.notFound);
      }

      // 2. Make sure the order can still be paid
      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw new BadRequestException(messages.payment.orderAlreadyProcessed);
      }

      // 3. Lock the user's balance row
      const user = await this.userModel.findByPk(userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!user) {
        throw new NotFoundException(messages.user.notFound);
      }

      const amount = Number(order.totalAmount);
      const balance = Number(user.balance);

      // 4. Check balance
      if (balance < amount) {
        throw new BadRequestException(messages.payment.insufficientBalance);
      }

      // 5. Make sure there isn't already a successful payment
      const existingPayment = await this.paymentModel.findOne({
        where: {
          orderId,
          status: PaymentStatus.COMPLETED,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (existingPayment) {
        throw new BadRequestException(messages.payment.alreadyPaid);
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
      const payment = await this.paymentModel.create(
        {
          orderId,
          userId,
          amount,
          status: PaymentStatus.COMPLETED,
          paidAt: new Date(),
        },
        {
          transaction,
        },
      );

      // 8. Get services from the order
      const services = await this.serviceModel.findAll({
        where: {
          id: order.services.map((service) => service.id),
        },
        include: [
          {
            model: Freelancer,
            attributes: ['id', 'userId'],
          },
        ],
        transaction,
      });
      if (services.length !== order.services.length) {
        throw new BadRequestException(messages.payment.serviceUnavailable);
      }

      // 9. Create contracts
      for (const service of services) {
        const orderService = order.services.find(
          (item) => item.id === service.id,
        );

        if (!orderService) {
          throw new BadRequestException(messages.payment.serviceUnavailable);
        }

        const deadline = new Date();
        deadline.setDate(deadline.getDate() + orderService.deliveryDays);

        const contract = await this.contractModel.create(
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

        await this.notificationService.create({
          senderId: userId,
          receiverId: service.freelancer.userId,
          targetId: contract.id,
          type: NotificationType.PAYMENT,
          message: `A client has purchased your service "${service.title}".`,
          link: `/contract/${contract.id}`,
        });
      }

      /**
       * 14. Add BullMQ jobs AFTER database commit
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

      return response(payment, messages.payment.success);
    } catch (error) {
      if (!committed) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows: payments, count: total } =
      await this.paymentModel.findAndCountAll({
        limit,
        offset,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            include: [
              {
                model: UserProfile,
                as: 'profile',
                attributes: ['avatar'],
              },
            ],
          },
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'totalAmount', 'status', 'createdAt'],
          },
        ],
        order: [['createdAt', 'DESC']],
        distinct: true,
      });

    const totalPages = Math.ceil(total / limit);

    return response(
      {
        payments,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      null,
    );
  }

  async findMe(userId: string) {
    const payments = await this.paymentModel.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'totalAmount', 'status', 'createdAt'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return response(payments, null);
  }

  async findOne(userId: string, paymentId: string) {
    const payment = await this.paymentModel.findOne({
      where: {
        id: paymentId,
        userId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'totalAmount', 'status', 'createdAt'],
        },
      ],
    });

    if (!payment) {
      throw new NotFoundException(messages.payment.notFound);
    }

    return response(payment, null);
  }

  async rechargeBalance(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException(
        messages.payment.rechargeBalance.invalidAmount,
      );
    }

    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(messages.user.notFound);
    }

    user.balance = Number(user.balance) + Number(amount);

    await user.save();

    return response(
      {
        amount,
        balance: user.balance,
      },
      messages.payment.rechargeBalance.success,
    );
  }
}
