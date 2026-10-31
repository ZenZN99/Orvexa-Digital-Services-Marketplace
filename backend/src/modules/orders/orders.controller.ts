import type { SpongHandler } from 'riser-bob';
import { getPagination } from '../../utilities/pagination';
import type { OrdersService } from './orders.service';

export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  readonly create: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;

    const result = await this.ordersService.create(userId);

    if ('error' in result) {
      if (result.statusCode === 404) {
        return spongRes.SpongNotFound({
          success: false,
          message: result.message,
        });
      }

      return spongRes.SpongBadRequest({
        success: false,
        message: result.message,
      });
    }

    return spongRes.SpongCreated({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  };

  readonly findAll: SpongHandler = async (spongReq, spongRes) => {
    const { page, limit, offset } = getPagination(spongReq);

    const result = await this.ordersService.findAll(page, limit, offset);

    return spongRes.SpongOK({
      success: result.success,
      data: {
        orders: result.data,
        pagination: result.pagination,
      },
    });
  };

  readonly findMe: SpongHandler = async (spongReq, spongRes) => {
    const clientId = spongReq.user!.id;

    const result = await this.ordersService.findMe(clientId);

    return spongRes.SpongOK({
      success: result.success,
      data: result.data,
    });
  };

  readonly findOne: SpongHandler = async (spongReq, spongRes) => {
    const clientId = spongReq.user!.id;
    const { orderId } = spongReq.params;

    if (!orderId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Order ID is required',
      });
    }

    const result = await this.ordersService.findOne(clientId, orderId);

    if ('error' in result) {
      return spongRes.SpongNotFound({
        success: false,
        message: result.message,
      });
    }

    return spongRes.SpongOK({
      success: result.success,
      data: result.data,
    });
  };

  readonly delete: SpongHandler = async (spongReq, spongRes) => {
    const clientId = spongReq.user!.id;
    const { orderId } = spongReq.params;

    if (!orderId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Order ID is required',
      });
    }

    const result = await this.ordersService.delete(clientId, orderId);

    if ('error' in result) {
      if (result.statusCode === 404) {
        return spongRes.SpongNotFound({
          success: false,
          message: result.message,
        });
      }

      return spongRes.SpongBadRequest({
        success: false,
        message: result.message,
      });
    }

    return spongRes.SpongOK({
      success: result.success,
      message: result.message,
    });
  };
}
