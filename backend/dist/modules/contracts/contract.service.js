var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
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
let ContractService = class ContractService {
    contractModel;
    userModel;
    freelancerModel;
    orderModel;
    serviceModel;
    platformWalletModel;
    sequelize;
    notificationService;
    redis;
    constructor(contractModel, userModel, freelancerModel, orderModel, serviceModel, platformWalletModel, sequelize, notificationService, redis) {
        this.contractModel = contractModel;
        this.userModel = userModel;
        this.freelancerModel = freelancerModel;
        this.orderModel = orderModel;
        this.serviceModel = serviceModel;
        this.platformWalletModel = platformWalletModel;
        this.sequelize = sequelize;
        this.notificationService = notificationService;
        this.redis = redis;
    }
    async findMe(userId) {
        const cacheKey = `contracts:me:${userId}`;
        const cachedContracts = await this.redis.getJSON(cacheKey);
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
        await this.redis.set(cacheKey, contracts, 5 * 60);
        return response(contracts, null);
    }
    async findOne(userId, contractId) {
        const cacheKey = `contracts:one:${userId}:${contractId}`;
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
        const { rows: contracts, count: total } = await this.contractModel.findAndCountAll({
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
    async expire(contractId) {
        const tag = `[EXPIRE][${contractId}]`;
        console.log(`${tag} ▶ Job started at ${new Date().toISOString()}`);
        const transaction = await this.sequelize.transaction();
        let committed = false;
        try {
            const contract = await this.contractModel.findByPk(contractId, {
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!contract) {
                console.log(`${tag} ✖ Contract not found`);
                throw new NotFoundException(messages.contract.notFound);
            }
            console.log(`${tag} Contract loaded | status=${contract.status} | deadline=${new Date(contract.deadline).toISOString()} | amount=${contract.amount}`);
            if (contract.status !== ContractStatus.IN_PROGRESS) {
                await transaction.commit();
                committed = true;
                console.log(`${tag} ⏭ Skipped: status is "${contract.status}" (not IN_PROGRESS)`);
                return response(contract, messages.contract.expire.alreadyProcessed);
            }
            if (new Date(contract.deadline) > new Date()) {
                await transaction.commit();
                committed = true;
                console.log(`${tag} ⏭ Skipped: deadline not reached yet (${new Date(contract.deadline).toISOString()})`);
                return response(contract, messages.contract.expire.notDue);
            }
            const freelancer = await this.freelancerModel.findByPk(contract.freelancerId, {
                attributes: ['id', 'userId'],
                transaction,
            });
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
            console.log(`${tag} Client BEFORE | balance=${client.balance} | frozenBalance=${client.frozenBalance}`);
            client.balance = Number(client.balance) + amount;
            client.frozenBalance = Number(client.frozenBalance) - amount;
            await client.save({ transaction });
            console.log(`${tag} Client AFTER  | balance=${client.balance} | frozenBalance=${client.frozenBalance} | refunded=${amount}`);
            contract.status = ContractStatus.EXPIRED;
            await contract.save({ transaction });
            await transaction.commit();
            committed = true;
            console.log(`${tag} ✔ Transaction committed | status=EXPIRED`);
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
                }
                else {
                    await this.notificationService.create({
                        senderId: admin.id,
                        receiverId: contract.clientId,
                        targetId: contract.id,
                        type: NotificationType.CONTRACT_EXPIRED,
                        message: 'Your payment has been refunded because the service was not delivered within the specified deadline.',
                        link: `/contract/${contract.id}`,
                    });
                    console.log(`${tag} ✔ Client notification sent`);
                    await this.notificationService.create({
                        senderId: admin.id,
                        receiverId: freelancer.userId,
                        targetId: contract.id,
                        type: NotificationType.CONTRACT_EXPIRED,
                        message: 'The contract has been terminated because the service was not delivered within the specified deadline.',
                        link: `/contract/${contract.id}`,
                    });
                    console.log(`${tag} ✔ Freelancer notification sent`);
                }
            }
            catch (postCommitError) {
                console.error(`${tag} ⚠ Post-commit step failed (refund is already saved):`, postCommitError);
            }
            console.log(`${tag} ■ Finished successfully`);
            return response(contract, messages.contract.expire.success);
        }
        catch (error) {
            if (!committed) {
                await transaction.rollback();
                console.error(`${tag} ✖ FAILED, transaction rolled back:`, error);
            }
            else {
                console.error(`${tag} ✖ Error after commit:`, error);
            }
            throw error;
        }
    }
    async complete(userId, contractId) {
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
            const freelancer = await this.freelancerModel.findByPk(contract.freelancerId, {
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
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
                platformWallet = await this.platformWalletModel.create({
                    key: 'platform',
                    balance: 0,
                }, { transaction });
            }
            const amount = Number(contract.amount);
            const commission = amount * 0.05;
            const freelancerAmount = amount - commission;
            const frozenBalance = Number(client.frozenBalance);
            if (frozenBalance < amount) {
                throw new BadRequestException(messages.contract.complete.insufficientFrozenBalance);
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
                    message: 'Your project has been completed successfully and the payment has been added to your balance.',
                });
                await this.notificationService.create({
                    senderId: admin.id,
                    receiverId: client.id,
                    targetId: contract.id,
                    type: NotificationType.CONTRACT_COMPLETED,
                    message: 'Your service has been received successfully. The contract has been completed.',
                    link: `/contract/${contract.id}`,
                });
            }
            return response(contract, messages.contract.complete.success);
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async deliver(userId, contractId) {
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
        if (new Date(contract.deadline).getTime() <= Date.now()) {
            throw new BadRequestException('The contract deadline has expired. Delivery is no longer allowed.');
        }
        contract.status = ContractStatus.DELIVERED;
        contract.deliveredAt = new Date();
        await contract.save();
        await this.notificationService.create({
            senderId: userId,
            receiverId: contract.clientId,
            targetId: contract.id,
            type: NotificationType.CONTRACT_DELIVERED,
            message: 'Your service is ready for review. Please review and accept the delivery.',
            link: `/contract/${contract.id}`,
        });
        return response(contract, messages.contract.deliver.success);
    }
};
ContractService = __decorate([
    Injectable(),
    __param(0, InjectModel(Contract)),
    __param(1, InjectModel(User)),
    __param(2, InjectModel(Freelancer)),
    __param(3, InjectModel(Order)),
    __param(4, InjectModel(Service)),
    __param(5, InjectModel(PlatformWallet)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Sequelize,
        NotificationService,
        RedisHelper])
], ContractService);
export { ContractService };
//# sourceMappingURL=contract.service.js.map