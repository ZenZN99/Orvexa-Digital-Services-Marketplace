import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Contract } from './schema/contract.schema.js';
import { User } from '../users/schema/user.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { response } from '../../common/libs/response.js';
import { messages } from '../../common/libs/messages.js';
import { ContractStatus } from '../../common/enums/contract.enum.js';
import { Op } from 'sequelize';
import { PlatformWallet } from '../platform-wallets/schema/platform-wallet.schema.js';
import { NotificationService } from '../notifications/notification.service.js';
import { NotificationType } from '../../common/enums/notification.enum.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { RedisHelper } from '../../infrastructure/database/redis/redis.helper.js';
import { Sequelize } from 'sequelize-typescript';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
import { Order } from '../orders/schema/order.schema.js';
import { OrderStatus } from '../../common/enums/order.enum.js';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Freelancer)
    private readonly freelancerModel: typeof Freelancer,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Service)
    private readonly serviceModel: typeof Service,
    @InjectModel(PlatformWallet)
    private readonly platformWalletModel: typeof PlatformWallet,
    private readonly sequelize: Sequelize,
    private readonly notificationService: NotificationService,
    private readonly redis: RedisHelper,
  ) {}

  async findMe(userId: string) {
    // Create a unique cache key for the current user's contracts.
    const cacheKey = `contracts:me:${userId}`;

    // Try to get the user's contracts from Redis first.
    const cachedContracts = await this.redis.getJSON(cacheKey);

    // Return cached contracts when they exist.
    if (cachedContracts) {
      return response(cachedContracts, null);
    }
    const contracts = await this.contractModel.findAll({
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
          model: Service,
          attributes: ['id', 'title', 'images'],
        },
        {
          model: Freelancer,
          attributes: ['id', 'userId', 'jobTitle', 'ratingAverage'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Cache the user's contracts for 5 minutes.
    await this.redis.set(cacheKey, contracts, 5 * 60);

    return response(contracts, null);
  }

  async findOne(userId: string, contractId: string) {
    // Create a unique cache key for this user's access to this contract.
    const cacheKey = `contracts:one:${userId}:${contractId}`;

    // Try to get the contract from Redis first.
    const cachedContract = await this.redis.getJSON(cacheKey);

    if (cachedContract) {
      return response(cachedContract, null);
    }

    const contract = await this.contractModel.findOne({
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
          model: Service,
          attributes: ['id', 'title', 'description', 'images'],
        },

        {
          model: Freelancer,
          attributes: ['id', 'userId', 'jobTitle', 'about', 'ratingAverage'],
          include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'email'],
              include: [
                {
                  model: UserProfile,
                  attributes: ['avatar'],
                },
              ],
            },
          ],
        },

        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [
            {
              model: UserProfile,
              attributes: ['avatar'],
            },
          ],
        },
      ],
    });

    if (!contract) {
      throw new NotFoundException(messages.contract.notFound);
    }

    await this.redis.set(cacheKey, contract, 60);

    return response(contract, null);
  }

  async findAll(page = 1, limit = 10) {
    const cacheKey = `contracts:all:${page}:${limit}`;

    const cachedContracts = await this.redis.getJSON(cacheKey);

    if (cachedContracts) {
      return response(cachedContracts, null);
    }

    const offset = (page - 1) * limit;

    const { rows: contracts, count: total } =
      await this.contractModel.findAndCountAll({
        limit,
        offset,
        include: [
          {
            model: User,
            as: 'client',
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
            model: Freelancer,
            attributes: ['id', 'userId', 'jobTitle', 'ratingAverage'],
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
            ],
          },

          {
            model: Service,
            attributes: ['id', 'title'],
          },

          {
            model: Order,
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

    const totalPages = Math.ceil(total / limit);

    const result = {
      contracts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    await this.redis.set(cacheKey, result, 5 * 60);

    return response(result, null);
  }

  async expire(contractId: string) {
    const tag = `[EXPIRE][${contractId}]`;

    console.log(`${tag} ▶ Job started at ${new Date().toISOString()}`);

    const transaction = await this.sequelize.transaction();
    let committed = false;

    try {
      // Lock the contract row only (no include, to avoid the outer join lock error)
      const contract = await this.contractModel.findByPk(contractId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!contract) {
        console.log(`${tag} ✖ Contract not found`);
        throw new NotFoundException(messages.contract.notFound);
      }

      console.log(
        `${tag} Contract loaded | status=${contract.status} | deadline=${new Date(contract.deadline).toISOString()} | amount=${contract.amount}`,
      );

      // Already delivered / completed / expired / cancelled
      if (contract.status !== ContractStatus.IN_PROGRESS) {
        await transaction.commit();
        committed = true;

        console.log(
          `${tag} ⏭ Skipped: status is "${contract.status}" (not IN_PROGRESS)`,
        );

        return response(contract, messages.contract.expire.alreadyProcessed);
      }

      // Deadline not reached yet
      if (new Date(contract.deadline) > new Date()) {
        await transaction.commit();
        committed = true;

        console.log(
          `${tag} ⏭ Skipped: deadline not reached yet (${new Date(contract.deadline).toISOString()})`,
        );

        return response(contract, messages.contract.expire.notDue);
      }

      // Load the freelancer separately (no lock needed, we only read userId)
      const freelancer = await this.freelancerModel.findByPk(
        contract.freelancerId,
        {
          attributes: ['id', 'userId'],
          transaction,
        },
      );

      if (!freelancer) {
        console.log(`${tag} ✖ Freelancer not found (${contract.freelancerId})`);
        throw new NotFoundException(messages.freelancer.notFound);
      }

      const client = await this.userModel.findByPk(contract.clientId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!client) {
        console.log(`${tag} ✖ Client not found (${contract.clientId})`);
        throw new NotFoundException(messages.user.notFound);
      }

      const amount = Number(contract.amount);

      console.log(
        `${tag} Client BEFORE | balance=${client.balance} | frozenBalance=${client.frozenBalance}`,
      );

      client.balance = Number(client.balance) + amount;
      client.frozenBalance = Number(client.frozenBalance) - amount;

      await client.save({ transaction });

      console.log(
        `${tag} Client AFTER  | balance=${client.balance} | frozenBalance=${client.frozenBalance} | refunded=${amount}`,
      );

      contract.status = ContractStatus.EXPIRED;

      await contract.save({ transaction });

      await transaction.commit();
      committed = true;

      console.log(`${tag} ✔ Transaction committed | status=EXPIRED`);

      // Everything below is AFTER commit: failures here must not undo the refund
      try {
        await Promise.all([
          this.redis.del(`contracts:me:${contract.clientId}`),
          this.redis.del(`contracts:me:${freelancer.userId}`),
          this.redis.del(`contracts:one:${contract.clientId}:${contract.id}`),
          this.redis.del(`contracts:one:${freelancer.userId}:${contract.id}`),
        ]);

        console.log(`${tag} ✔ Redis cache invalidated`);

        const admin = await this.userModel.findOne({
          where: { role: UserRole.ADMIN },
        });

        if (!admin) {
          console.log(`${tag} ⚠ No admin user found, notifications skipped`);
        } else {
          await this.notificationService.create({
            senderId: admin.id,
            receiverId: contract.clientId,
            targetId: contract.id,
            type: NotificationType.CONTRACT_EXPIRED,
            message:
              'Your payment has been refunded because the service was not delivered within the specified deadline.',
            link: `/contract/${contract.id}`,
          });

          console.log(`${tag} ✔ Client notification sent`);

          await this.notificationService.create({
            senderId: admin.id,
            receiverId: freelancer.userId,
            targetId: contract.id,
            type: NotificationType.CONTRACT_EXPIRED,
            message:
              'The contract has been terminated because the service was not delivered within the specified deadline.',
            link: `/contract/${contract.id}`,
          });

          console.log(`${tag} ✔ Freelancer notification sent`);
        }
      } catch (postCommitError) {
        console.error(
          `${tag} ⚠ Post-commit step failed (refund is already saved):`,
          postCommitError,
        );
      }

      console.log(`${tag} ■ Finished successfully`);

      return response(contract, messages.contract.expire.success);
    } catch (error) {
      if (!committed) {
        await transaction.rollback();
        console.error(`${tag} ✖ FAILED, transaction rolled back:`, error);
      } else {
        console.error(`${tag} ✖ Error after commit:`, error);
      }

      throw error;
    }
  }
  async complete(userId: string, contractId: string) {
    const transaction = await this.sequelize.transaction();

    try {
      const contract = await this.contractModel.findOne({
        where: {
          id: contractId,
          clientId: userId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!contract) {
        throw new NotFoundException(messages.contract.notFound);
      }

      if (contract.status !== ContractStatus.DELIVERED) {
        throw new BadRequestException(messages.contract.complete.invalidStatus);
      }

      const order = await this.orderModel.findByPk(contract.orderId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!order) {
        throw new NotFoundException(messages.order.notFound);
      }

      const service = await this.serviceModel.findByPk(contract.serviceId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!service) {
        throw new NotFoundException(messages.service.notFound);
      }

      const client = await this.userModel.findByPk(contract.clientId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!client) {
        throw new NotFoundException(messages.user.notFound);
      }

      const freelancer = await this.freelancerModel.findByPk(
        contract.freelancerId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        },
      );

      if (!freelancer) {
        throw new NotFoundException(messages.freelancer.notFound);
      }

      const freelancerUser = await this.userModel.findByPk(freelancer.userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!freelancerUser) {
        throw new NotFoundException(messages.user.notFound);
      }

      let platformWallet = await this.platformWalletModel.findOne({
        where: { key: 'platform' },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!platformWallet) {
        platformWallet = await this.platformWalletModel.create(
          {
            key: 'platform',
            balance: 0,
          },
          { transaction },
        );
      }

      const amount = Number(contract.amount);

      const commission = amount * 0.05;
      const freelancerAmount = amount - commission;

      const frozenBalance = Number(client.frozenBalance);

      if (frozenBalance < amount) {
        throw new BadRequestException(
          messages.contract.complete.insufficientFrozenBalance,
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

      await client.save({ transaction });
      await freelancerUser.save({ transaction });
      await freelancer.save({ transaction });
      await platformWallet.save({ transaction });
      await order.save({ transaction });
      await service.save({ transaction });
      await contract.save({ transaction });

      await transaction.commit();

      const admin = await this.userModel.findOne({
        where: {
          role: UserRole.ADMIN,
        },
      });

      if (admin) {
        await this.notificationService.create({
          senderId: admin.id,
          receiverId: freelancerUser.id,
          targetId: contract.id,
          type: NotificationType.CONTRACT_COMPLETED,
          message:
            'Your project has been completed successfully and the payment has been added to your balance.',
        });

        await this.notificationService.create({
          senderId: admin.id,
          receiverId: client.id,
          targetId: contract.id,
          type: NotificationType.CONTRACT_COMPLETED,
          message:
            'Your service has been received successfully. The contract has been completed.',
          link: `/contract/${contract.id}`,
        });
      }

      return response(contract, messages.contract.complete.success);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deliver(userId: string, contractId: string) {
    const contract = await this.contractModel.findOne({
      where: {
        id: contractId,
      },
      include: [
        {
          model: Freelancer,
          where: {
            userId,
          },
        },
      ],
    });

    if (!contract) {
      throw new NotFoundException(messages.contract.notFound);
    }

    if (contract.status !== ContractStatus.IN_PROGRESS) {
      throw new BadRequestException(messages.contract.deliver.invalidStatus);
    }

    // Prevent delivery after the deadline.
    if (new Date(contract.deadline).getTime() <= Date.now()) {
      throw new BadRequestException(
        'The contract deadline has expired. Delivery is no longer allowed.',
      );
    }

    contract.status = ContractStatus.DELIVERED;
    contract.deliveredAt = new Date();

    await contract.save();

    await this.notificationService.create({
      senderId: userId,
      receiverId: contract.clientId,
      targetId: contract.id,
      type: NotificationType.CONTRACT_DELIVERED,
      message:
        'Your service is ready for review. Please review and accept the delivery.',
      link: `/contract/${contract.id}`,
    });

    return response(contract, messages.contract.deliver.success);
  }
}
