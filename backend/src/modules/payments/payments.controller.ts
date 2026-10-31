import type { SpongHandler } from 'riser-bob';
import type { PaymentsService } from './payments.service';
import { getPagination } from '../../utilities/pagination';

export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  readonly pay: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;
    const { orderId } = spongReq.params;

    if (!orderId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Order ID is required',
      });
    }

    const result = await this.paymentsService.pay(userId, orderId);

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
      data: result.data,
    });
  };

  readonly findAll: SpongHandler = async (spongReq, spongRes) => {
    const { page, limit, offset } = getPagination(spongReq);

    const result = await this.paymentsService.findAll(page, limit, offset);

    return spongRes.SpongOK({
      success: result.success,
      data: {
        payments: result.data,
        pagination: result.pagination,
      },
    });
  };

  readonly findMe: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;

    const result = await this.paymentsService.findMe(userId);

    return spongRes.SpongOK({
      success: result.success,
      data: result.data,
    });
  };

  readonly findOne: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;
    const { paymentId } = spongReq.params;

    if (!paymentId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Payment ID is required',
      });
    }

    const result = await this.paymentsService.findOne(userId, paymentId);

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

  readonly rechargeBalance: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;

    const { amount } = await spongReq.json<{ amount: number }>();

    const result = await this.paymentsService.rechargeBalance(userId, amount);

    if ('error' in result) {
      if (result.statusCode === 404) {
        return spongRes.SpongNotFound({
          success: false,
          message: result.message,
        });
      }

      if (result.statusCode === 422) {
        return spongRes.SpongUnprocessableContent({
          success: false,
          message: result.message,
          errors: result.errors,
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
      data: result.data,
    });
  };
}
