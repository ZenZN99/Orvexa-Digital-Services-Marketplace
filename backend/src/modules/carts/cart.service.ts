import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './schema/cart.schema.js';
import { ServiceStatus } from '../../common/enums/service.enum.js';
import { messages } from '../../common/libs/messages.js';
import { CartItem } from './schema/cart-item.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { response } from '../../common/libs/response.js';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private readonly cartModel: typeof Cart,

    @InjectModel(CartItem)
    private readonly cartItemModel: typeof CartItem,

    @InjectModel(Service)
    private readonly serviceModel: typeof Service,
  ) {}

  async findMe(userId: string) {
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

  async addItem(userId: string, serviceId: string) {
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

  async removeItem(userId: string, serviceId: string) {
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

  async clearCart(userId: string) {
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
}
