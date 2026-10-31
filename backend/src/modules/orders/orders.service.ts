import type { Sequelize } from 'sequelize';
import type { OrderSchema } from './schemas/order.schema';
import type { CartSchema } from '../carts/schemas/cart.schema';
import type { CartItemSchema } from '../carts/schemas/cart-item.schema';
import { OrderStatus } from './schemas/enums/order.enum';
import { UserProfileSchema } from '../user-profiles/schemas/user-profile.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { FreelancerSchema } from '../freelancers/schemas/freelancer.schema';
import { ServiceStatus } from '../services/schemas/enums/service.enum';
import { ServiceSchema } from '../services/schemas/service.schema';
import { buildPagination } from '../../utilities/pagination';

export class OrdersService {
  constructor(
    private readonly orderSchema: typeof OrderSchema,
    private readonly cartSchema: typeof CartSchema,
    private readonly cartItemSchema: typeof CartItemSchema,
    private readonly sequelize: Sequelize,
  ) {}

  async create(userId: string) {
    const transaction = await this.sequelize.transaction();
    try {
      const cart = await this.cartSchema.findOne({
        where: {
          userId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!cart) {
        await transaction.rollback();
        return {
          error: true,
          statusCode: 404,
          message: 'Cart not found',
        } as const;
      }

      const cartItems = await this.cartItemSchema.findAll({
        where: {
          cartId: cart.id,
        },
        include: [
          {
            model: ServiceSchema,
            as: 'service',
            where: {
              status: ServiceStatus.PUBLISHED,
            },
            include: [
              {
                model: FreelancerSchema,
                as: 'freelancer',
                include: [
                  {
                    model: UserSchema,
                    as: 'user',
                    include: [
                      {
                        model: UserProfileSchema,
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
        await transaction.rollback();
        return {
          error: true,
          statusCode: 400,
          message: 'Your cart is empty.',
        } as const;
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

      const order = await this.orderSchema.create(
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

      await this.cartItemSchema.destroy({
        where: {
          cartId: cart.id,
        },
        transaction,
      });

      await transaction.commit();

      return {
        success: true,
        message: 'Order created successfully',
        data: order,
      } as const;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async findAll(page = 1, limit = 10, offset = (page - 1) * limit) {
    const { rows: orders, count: total } =
      await this.orderSchema.findAndCountAll({
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
        ],
        order: [['createdAt', 'DESC']],
        distinct: true,
      });

    return {
      success: true,
      data: orders,
      pagination: buildPagination(total, page, limit),
    } as const;
  }

  async findMe(clientId: string) {
    const orders = await this.orderSchema.findAll({
      where: { clientId },
      order: [['createdAt', 'DESC']],
    });

    return {
      success: true,
      data: orders,
    } as const;
  }

  async findOne(clientId: string, orderId: string) {
    const order = await this.orderSchema.findOne({
      where: {
        id: orderId,
        clientId,
      },
    });

    if (!order) {
      return {
        error: true,
        message: 'Order not found',
      } as const;
    }

    return {
      success: true,
      data: order,
    } as const;
  }

  async delete(clientId: string, orderId: string) {
    const order = await this.orderSchema.findOne({
      where: {
        id: orderId,
        clientId,
      },
    });

    if (!order) {
      return {
        error: true,
        statusCode: 404,
        message: 'Order not found',
      } as const;
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      return {
        error: true,
        statusCode: 400,
        message: 'Only orders awaiting payment can be deleted.',
      } as const;
    }

    await order.destroy();

    return {
      success: true,
      message: 'Order deleted successfully',
    } as const;
  }
}
