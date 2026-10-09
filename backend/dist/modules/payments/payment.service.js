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
let PaymentService = class PaymentService {
    paymentModel;
    orderModel;
    userModel;
    serviceModel;
    contractModel;
    contractQueue;
    notificationService;
    sequelize;
    constructor(paymentModel, orderModel, userModel, serviceModel, contractModel, contractQueue, notificationService, sequelize) {
        this.paymentModel = paymentModel;
        this.orderModel = orderModel;
        this.userModel = userModel;
        this.serviceModel = serviceModel;
        this.contractModel = contractModel;
        this.contractQueue = contractQueue;
        this.notificationService = notificationService;
        this.sequelize = sequelize;
    }
    async pay(userId, orderId) {
        const transaction = await this.sequelize.transaction();
        const createdContracts = [];
        let committed = false;
        try {
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
            if (order.status !== OrderStatus.PENDING_PAYMENT) {
                throw new BadRequestException(messages.payment.orderAlreadyProcessed);
            }
            const user = await this.userModel.findByPk(userId, {
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!user) {
                throw new NotFoundException(messages.user.notFound);
            }
            const amount = Number(order.totalAmount);
            const balance = Number(user.balance);
            if (balance < amount) {
                throw new BadRequestException(messages.payment.insufficientBalance);
            }
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
            user.balance = balance - amount;
            user.frozenBalance = Number(user.frozenBalance) + amount;
            await user.save({
                transaction,
            });
            const payment = await this.paymentModel.create({
                orderId,
                userId,
                amount,
                status: PaymentStatus.COMPLETED,
                paidAt: new Date(),
            }, {
                transaction,
            });
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
            for (const service of services) {
                const orderService = order.services.find((item) => item.id === service.id);
                if (!orderService) {
                    throw new BadRequestException(messages.payment.serviceUnavailable);
                }
                const deadline = new Date();
                deadline.setDate(deadline.getDate() + orderService.deliveryDays);
                const contract = await this.contractModel.create({
                    orderId: order.id,
                    serviceId: service.id,
                    freelancerId: service.freelancerId,
                    clientId: userId,
                    amount: orderService.price,
                    deliveryDays: orderService.deliveryDays,
                    deadline,
                    status: ContractStatus.IN_PROGRESS,
                }, {
                    transaction,
                });
                createdContracts.push(contract);
            }
            order.status = OrderStatus.IN_PROGRESS;
            await order.save({
                transaction,
            });
            await transaction.commit();
            committed = true;
            for (const contract of createdContracts) {
                const service = services.find((item) => item.id === contract.serviceId);
                if (!service)
                    continue;
                await this.notificationService.create({
                    senderId: userId,
                    receiverId: service.freelancer.userId,
                    targetId: contract.id,
                    type: NotificationType.PAYMENT,
                    message: `A client has purchased your service "${service.title}".`,
                    link: `/contract/${contract.id}`,
                });
            }
            for (const contract of createdContracts) {
                await this.contractQueue.add('expire-contract', {
                    contractId: contract.id,
                }, {
                    delay: Math.max(0, contract.deadline.getTime() - Date.now()),
                    jobId: `expire-contract-${contract.id}`,
                });
            }
            return response(payment, messages.payment.success);
        }
        catch (error) {
            if (!committed) {
                await transaction.rollback();
            }
            throw error;
        }
    }
    async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const { rows: payments, count: total } = await this.paymentModel.findAndCountAll({
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
        return response({
            payments,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        }, null);
    }
    async findMe(userId) {
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
    async findOne(userId, paymentId) {
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
    async rechargeBalance(userId, amount) {
        if (amount <= 0) {
            throw new BadRequestException(messages.payment.rechargeBalance.invalidAmount);
        }
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new NotFoundException(messages.user.notFound);
        }
        user.balance = Number(user.balance) + Number(amount);
        await user.save();
        return response({
            amount,
            balance: user.balance,
        }, messages.payment.rechargeBalance.success);
    }
};
PaymentService = __decorate([
    Injectable(),
    __param(0, InjectModel(Payment)),
    __param(1, InjectModel(Order)),
    __param(2, InjectModel(User)),
    __param(3, InjectModel(Service)),
    __param(4, InjectModel(Contract)),
    __param(5, InjectQueue('contracts')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Queue,
        NotificationService,
        Sequelize])
], PaymentService);
export { PaymentService };
//# sourceMappingURL=payment.service.js.map