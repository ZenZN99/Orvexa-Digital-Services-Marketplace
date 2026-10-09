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
import { Cart } from './schema/cart.schema.js';
import { ServiceStatus } from '../../common/enums/service.enum.js';
import { messages } from '../../common/libs/messages.js';
import { CartItem } from './schema/cart-item.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { response } from '../../common/libs/response.js';
let CartService = class CartService {
    cartModel;
    cartItemModel;
    serviceModel;
    constructor(cartModel, cartItemModel, serviceModel) {
        this.cartModel = cartModel;
        this.cartItemModel = cartItemModel;
        this.serviceModel = serviceModel;
    }
    async findMe(userId) {
        let cart = await this.cartModel.findOne({
            where: { userId },
            include: [
                {
                    association: 'items',
                    include: [
                        {
                            model: Service,
                            as: 'service',
                        },
                    ],
                },
            ],
        });
        if (!cart) {
            cart = await this.cartModel.create({
                userId,
            });
            cart = await this.cartModel.findOne({
                where: { id: cart.id },
                include: [
                    {
                        association: 'items',
                        include: [Service],
                    },
                ],
            });
        }
        return response(cart, null);
    }
    async addItem(userId, serviceId) {
        const service = await this.serviceModel.findOne({
            where: {
                id: serviceId,
                status: ServiceStatus.PUBLISHED,
            },
        });
        if (!service) {
            throw new NotFoundException(messages.service.notFound);
        }
        if (service.freelancerId === userId) {
            throw new BadRequestException(messages.cart.addItem.cannotAddOwnService);
        }
        let cart = await this.cartModel.findOne({
            where: { userId },
        });
        if (!cart) {
            cart = await this.cartModel.create({
                userId,
            });
        }
        const existingItem = await this.cartItemModel.findOne({
            where: {
                cartId: cart.id,
                serviceId,
            },
        });
        if (existingItem) {
            throw new BadRequestException(messages.cart.addItem.alreadyExists);
        }
        const cartItem = await this.cartItemModel.create({
            cartId: cart.id,
            serviceId,
        });
        return response(cartItem, messages.cart.addItem.success);
    }
    async removeItem(userId, serviceId) {
        const cart = await this.cartModel.findOne({
            where: { userId },
        });
        if (!cart) {
            throw new NotFoundException(messages.cart.notFound);
        }
        const cartItem = await this.cartItemModel.findOne({
            where: {
                cartId: cart.id,
                serviceId,
            },
        });
        if (!cartItem) {
            throw new NotFoundException(messages.cart.itemNotFound);
        }
        await cartItem.destroy();
        return response(null, messages.cart.removeItem.success);
    }
    async clearCart(userId) {
        const cart = await this.cartModel.findOne({
            where: { userId },
        });
        if (!cart) {
            throw new NotFoundException(messages.cart.notFound);
        }
        await this.cartItemModel.destroy({
            where: {
                cartId: cart.id,
            },
        });
        return response(null, messages.cart.clear.success);
    }
};
CartService = __decorate([
    Injectable(),
    __param(0, InjectModel(Cart)),
    __param(1, InjectModel(CartItem)),
    __param(2, InjectModel(Service)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CartService);
export { CartService };
//# sourceMappingURL=cart.service.js.map