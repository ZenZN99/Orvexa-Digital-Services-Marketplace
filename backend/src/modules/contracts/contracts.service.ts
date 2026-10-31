import { Op, type Sequelize } from 'sequelize';
import type { RedisManager } from '../../config/db/redis/redis';
import { FreelancerSchema } from '../freelancers/schemas/freelancer.schema';
import { OrderSchema } from '../orders/schemas/order.schema';
import type { PlatformWalletSchema } from '../platform-wallets/schemas/platform-wallet.schema';
import { ServiceSchema } from '../services/schemas/service.schema';
import { UserSchema } from '../users/schemas/user.schema';
import type { ContractSchema } from './schemas/contract.schema';
import { buildPagination } from '../../utilities/pagination';
import { UserProfileSchema } from '../user-profiles/schemas/user-profile.schema';
import { ContractStatus } from './schemas/enums/contract.enum';
import { OrderStatus } from '../orders/schemas/enums/order.enum';
import { PaymentStatus } from '../payments/schemas/enums/payment.enum';
import type { PaymentSchema } from '../payments/schemas/payment.schema';
import type { NotificationsService } from '../notifications/notifications.service';
import { UserRole } from '../users/schemas/enums/users.enum';
import { NotificationType } from '../notifications/schemas/enums/notification.enum';

export class ContractsService {
  constructor(
    private readonly contractSchema: typeof ContractSchema,
    private readonly userSchema: typeof UserSchema,
    private readonly freelancerSchema: typeof FreelancerSchema,
    private readonly orderSchema: typeof OrderSchema,
    private readonly serviceSchema: typeof ServiceSchema,
    private readonly platformWalletSchema: typeof PlatformWalletSchema,
    private readonly paymentSchema: typeof PaymentSchema,
    private readonly notificationsService: NotificationsService,
    private readonly redisManager: RedisManager,
    private readonly sequelize: Sequelize,
  ) {}

  async findMe(userId: string) {
    const contracts = await this.contractSchema.findAll({
      where: {
        [Op.or]: [
          {
            clientId: userId,
          },
          {
            '$freelancer.userId$': userId,
          },
        ],
      },
      include: [
        {
          model: ServiceSchema,
          as: 'service',
          attributes: ['id', 'title', 'images'],
        },
        {
          model: FreelancerSchema,
          as: 'freelancer',
          attributes: ['id', 'userId', 'jobTitle', 'ratingAverage'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return {
      success: true,
      data: contracts,
    } as const;
  }

  async findAll(page = 1, limit = 10, offset = (page - 1) * limit) {
    const { rows: contracts, count: total } =
      await this.contractSchema.findAndCountAll({
        limit,
        offset,
        include: [
          {
            model: UserSchema,
            as: 'client',
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
            model: FreelancerSchema,
            as: 'freelancer',
            attributes: ['id', 'userId', 'jobTitle', 'ratingAverage'],
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
            ],
          },

          {
            model: ServiceSchema,
            as: 'service',
            attributes: ['id', 'title'],
          },

          {
            model: OrderSchema,
            as: 'order',
            attributes: [
              'id',
              'clientId',
              'totalAmount',
              'status',
              'services',
              'createdAt',
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
        distinct: true,
      });

    return {
      success: true,
      data: contracts,
      pagination: buildPagination(total, page, limit),
    };
  }

  async findOne(userId: string, contractId: string) {
    const contract = await this.contractSchema.findOne({
      where: {
        id: contractId,
        [Op.or]: [
          {
            clientId: userId,
          },
          {
            '$freelancer.userId$': userId,
          },
        ],
      },

      include: [
        {
          model: ServiceSchema,
          as: 'service',
          attributes: ['id', 'title', 'description', 'images'],
        },

        {
          model: FreelancerSchema,
          as: 'freelancer',
          attributes: ['id', 'userId', 'jobTitle', 'about', 'ratingAverage'],
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
          ],
        },

        {
          model: UserSchema,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [
            {
              model: UserProfileSchema,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
      ],
    });

    if (!contract) {
      return {
        error: true,
        message: 'Contract not found',
      } as const;
    }

    return {
      success: true,
      data: contract,
    } as const;
  }

  async expireContract(contractId: string) {
    const tag = `[EXPIRE][${contractId}]`;

    console.log(`${tag} ▶ Job started at ${new Date().toISOString()}`);

    const transaction = await this.sequelize.transaction();
    let committed = false;

    try {
      const contract = await this.contractSchema.findByPk(contractId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!contract) {
        throw new Error('Contract not found');
      }

      if (contract.status !== ContractStatus.IN_PROGRESS) {
        await transaction.commit();
        committed = true;
        return contract;
      }

      if (new Date(contract.deadline) > new Date()) {
        await transaction.commit();
        committed = true;
        return contract;
      }

      const freelancer = await this.freelancerSchema.findByPk(
        contract.freelancerId,
        {
          attributes: ['id', 'userId'],
          transaction,
        },
      );

      if (!freelancer) {
        throw new Error('Freelancer not found');
      }

      const client = await this.userSchema.findByPk(contract.clientId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!client) {
        throw new Error('Client not found');
      }

      const order = await this.orderSchema.findByPk(contract.orderId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!order) {
        throw new Error('Order not found');
      }

      const payment = await this.paymentSchema.findOne({
        where: {
          orderId: order.id,
          userId: client.id,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      const amount = Number(contract.amount);
      const frozenBalance = Number(client.frozenBalance);

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('Invalid contract amount');
      }

      if (frozenBalance < amount) {
        throw new Error('Insufficient frozen balance for refund');
      }

      client.balance = Number(client.balance) + amount;
      client.frozenBalance = frozenBalance - amount;

      contract.status = ContractStatus.EXPIRED;
      payment.status = PaymentStatus.REFUNDED;
      order.status = OrderStatus.REFUNDED;

      await client.save({ transaction });
      await contract.save({ transaction });
      await payment.save({ transaction });
      await order.save({ transaction });

      await transaction.commit();
      committed = true;

      try {
        await Promise.all([
          this.redisManager.del(`contracts:me:${contract.clientId}`),
          this.redisManager.del(`contracts:me:${freelancer.userId}`),
          this.redisManager.del(
            `contracts:one:${contract.clientId}:${contract.id}`,
          ),
          this.redisManager.del(
            `contracts:one:${freelancer.userId}:${contract.id}`,
          ),
        ]);

        const admin = await this.userSchema.findOne({
          where: { role: UserRole.ADMIN },
        });

        if (admin) {
          await this.notificationsService.create({
            senderId: admin.id,
            receiverId: contract.clientId,
            targetId: contract.id,
            type: NotificationType.CONTRACT_EXPIRED,
            message:
              'Your payment has been refunded because the service was not delivered within the specified deadline.',
            link: `/contract/${contract.id}`,
          });

          await this.notificationsService.create({
            senderId: admin.id,
            receiverId: freelancer.userId,
            targetId: contract.id,
            type: NotificationType.CONTRACT_EXPIRED,
            message:
              'The contract has been terminated because the service was not delivered within the specified deadline.',
            link: `/contract/${contract.id}`,
          });
        }
      } catch (postCommitError) {
        console.error(
          `${tag} ⚠ Post-commit processing failed:`,
          postCommitError,
        );
      }

      console.log(`${tag} ✔ Finished successfully`);

      return contract;
    } catch (error) {
      if (!committed) {
        await transaction.rollback();
      }

      throw error;
    }
  }

  async complete(userId: string, contractId: string) {
    const transaction = await this.sequelize.transaction();
    let committed = false;

    try {
      const contract = await this.contractSchema.findOne({
        where: {
          id: contractId,
          clientId: userId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!contract) {
        return {
          error: true,
          statusCode: 404,
          message: 'Contract not found',
        } as const;
      }

      if (contract.status !== ContractStatus.DELIVERED) {
        return {
          error: true,
          statusCode: 400,
          message: 'Only delivered contracts can be completed.',
        } as const;
      }

      const order = await this.orderSchema.findByPk(contract.orderId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!order) {
        return {
          error: true,
          statusCode: 404,
          message: 'Order not found',
        } as const;
      }

      const service = await this.serviceSchema.findByPk(contract.serviceId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!service) {
        return {
          error: true,
          statusCode: 404,
          message: 'Service not found',
        } as const;
      }

      const client = await this.userSchema.findByPk(contract.clientId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!client) {
        return {
          error: true,
          statusCode: 404,
          message: 'Client not found',
        } as const;
      }

      const freelancer = await this.freelancerSchema.findByPk(
        contract.freelancerId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        },
      );

      if (!freelancer) {
        return {
          error: true,
          statusCode: 404,
          message: 'Freelancer not found',
        } as const;
      }

      const freelancerUser = await this.userSchema.findByPk(freelancer.userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!freelancerUser) {
        return {
          error: true,
          statusCode: 404,
          message: 'Freelancer user not found',
        } as const;
      }

      let platformWallet = await this.platformWalletSchema.findOne({
        where: { key: 'platform' },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!platformWallet) {
        platformWallet = await this.platformWalletSchema.create(
          {
            key: 'platform',
            balance: 0,
          },
          { transaction },
        );
      }

      const payment = await this.paymentSchema.findOne({
        where: {
          userId: client.id,
          orderId: order.id,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!payment) {
        return {
          error: true,
          statusCode: 404,
          message: 'Payment not found',
        } as const;
      }

      const amount = Number(contract.amount);

      if (!Number.isFinite(amount) || amount <= 0) {
        return {
          error: true,
          statusCode: 400,
          message: 'Invalid contract amount',
        } as const;
      }

      const commission = amount * 0.05;
      const freelancerAmount = amount - commission;
      const frozenBalance = Number(client.frozenBalance);

      if (frozenBalance < amount) {
        throw new Error(
          'Insufficient frozen balance to complete this operation.',
        );
      }

      client.frozenBalance = frozenBalance - amount;

      freelancerUser.balance =
        Number(freelancerUser.balance) + freelancerAmount;

      freelancer.completedOrders += 1;
      platformWallet.balance = Number(platformWallet.balance) + commission;

      contract.status = ContractStatus.COMPLETED;
      contract.completedAt = new Date();

      order.status = OrderStatus.COMPLETED;
      service.ordersCount += 1;
      payment.status = PaymentStatus.COMPLETED;

      await client.save({ transaction });
      await freelancerUser.save({ transaction });
      await freelancer.save({ transaction });
      await platformWallet.save({ transaction });
      await order.save({ transaction });
      await service.save({ transaction });
      await contract.save({ transaction });
      await payment.save({ transaction });

      await transaction.commit();
      committed = true;

      try {
        const admin = await this.userSchema.findOne({
          where: { role: UserRole.ADMIN },
        });

        if (admin) {
          await this.notificationsService.create({
            senderId: admin.id,
            receiverId: freelancerUser.id,
            targetId: contract.id,
            type: NotificationType.CONTRACT_COMPLETED,
            message:
              'Your project has been completed successfully and the payment has been added to your balance.',
          });

          await this.notificationsService.create({
            senderId: admin.id,
            receiverId: client.id,
            targetId: contract.id,
            type: NotificationType.CONTRACT_COMPLETED,
            message:
              'Your service has been received successfully. The contract has been completed.',
            link: `/contract/${contract.id}`,
          });
        }
      } catch (postCommitError) {
        console.error(
          `[COMPLETE][${contractId}] ⚠ Post-commit processing failed:`,
          postCommitError,
        );
      }

      return {
        success: true,
        message: 'Contract completed successfully',
        data: contract,
      } as const;
    } catch (error) {
      if (!committed) {
        await transaction.rollback();
      }

      throw error;
    }
  }

  async deliver(userId: string, contractId: string) {
    const contract = await this.contractSchema.findOne({
      where: {
        id: contractId,
      },
      include: [
        {
          model: FreelancerSchema,
          as: 'freelancer',
          where: {
            userId,
          },
        },
      ],
    });

    if (!contract) {
      return {
        error: true,
        statusCode: 404,
        message: 'Contract not found',
      } as const;
    }

    if (contract.status !== ContractStatus.IN_PROGRESS) {
      return {
        error: true,
        statusCode: 400,
        message: 'Only contracts in progress can be completed.',
      } as const;
    }
    // Prevent delivery after the deadline.
    if (new Date(contract.deadline).getTime() <= Date.now()) {
      return {
        error: true,
        statusCode: 400,
        message:
          'The contract deadline has expired. Delivery is no longer allowed.',
      } as const;
    }

    contract.status = ContractStatus.DELIVERED;
    contract.deliveredAt = new Date();

    await contract.save();

    await this.notificationsService.create({
      senderId: userId,
      receiverId: contract.clientId,
      targetId: contract.id,
      type: NotificationType.CONTRACT_DELIVERED,
      message:
        'Your service is ready for review. Please review and accept the delivery.',
      link: `/contract/${contract.id}`,
    });

    return {
      success: true,
      message: 'Contract delivered successfully.',
      data: contract,
    };
  }
}
