import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './schema/order.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { ServiceStatus } from '../../common/enums/service.enum.js';
import { OrderStatus } from '../../common/enums/order.enum.js';
import { messages } from '../../common/libs/messages.js';
import { response } from '../../common/libs/response.js';
import { Cart } from '../carts/schema/cart.schema.js';
import { CartItem } from '../carts/schema/cart-item.schema.js';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/schema/user.schema.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,

    @InjectModel(Cart)
    private readonly cartModel: typeof Cart,

    @InjectModel(CartItem)
    private readonly cartItemModel: typeof CartItem,

    private readonly sequelize: Sequelize,
  ) {}

  async create(userId: string) {
    const transaction = await this.sequelize.transaction();

    try {
      const cart = await this.cartModel.findOne({
        where: {
          userId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!cart) {
        throw new NotFoundException(messages.cart.notFound);
      }

      const cartItems = await this.cartItemModel.findAll({
        where: {
          cartId: cart.id,
        },
        include: [
          {
            model: Service,
            where: {
              status: ServiceStatus.PUBLISHED,
            },
            include: [
              {
                model: Freelancer,
                as: 'freelancer',
                include: [
                  {
                    model: User,
                    as: 'user',
                    include: [
                      {
                        model: UserProfile,
                        as: 'profile',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        transaction,
      });
      if (!cartItems.length) {
        throw new BadRequestException(messages.order.emptyCart);
      }

      const services = cartItems.map((item) => ({
        id: item.serviceId,
        title: item.service.title,
        description: item.service.description,
        price: Number(item.service.price),
        deliveryDays: item.service.deliveryDays,
        images: item.service.images,
        freelancer: {
          id: item.service.freelancerId,
          user: {
            id: item.service.freelancer.user.id,
            firstName: item.service.freelancer.user.firstName,
            lastName: item.service.freelancer.user.lastName,
            profile: {
              avatar: item.service.freelancer.user.profile?.avatar ?? null,
            },
          },
        },
      }));

      const totalAmount = cartItems.reduce(
        (total, item) => total + Number(item.service.price),
        0,
      );

      const order = await this.orderModel.create(
        {
          clientId: userId,
          services,
          totalAmount,
          status: OrderStatus.PENDING_PAYMENT,
        },
        {
          transaction,
        },
      );

      await this.cartItemModel.destroy({
        where: {
          cartId: cart.id,
        },
        transaction,
      });

      await transaction.commit();

      return response(order, messages.order.create.success);
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows: orders, count: total } =
      await this.orderModel.findAndCountAll({
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
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
        distinct: true,
      });

    const totalPages = Math.ceil(total / limit);

    return response(
      {
        orders,
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
    const orders = await this.orderModel.findAll({
      where: {
        clientId: userId,
      },

      order: [['createdAt', 'DESC']],
    });

    return response(orders, null);
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.orderModel.findOne({
      where: {
        id: orderId,
        clientId: userId,
      },
    });

    if (!order) {
      throw new NotFoundException(messages.order.notFound);
    }

    return response(order, null);
  }

  async destroy(userId: string, orderId: string) {
    const order = await this.orderModel.findOne({
      where: {
        id: orderId,
        clientId: userId,
      },
    });

    if (!order) {
      throw new NotFoundException(messages.order.notFound);
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(messages.order.cannotDelete);
    }

    await order.destroy();

    return response(null, messages.order.destroy.success);
  }
}
