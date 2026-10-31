import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';
import type { SpongHandler } from 'riser-bob';
import { getPagination } from '../../../utilities/pagination';
import type { AuthenticationUser } from '../../users/schemas/user.schema';
import { PaymentsController } from '../payments.controller';
import type { PaymentsService } from '../payments.service';

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];

interface StatusError {
  error: true;
  statusCode: 404 | 400;
  message: string;
}

interface ValidationError {
  error: true;
  statusCode: 422;
  message: string;
  errors: unknown;
}

interface FakePaymentsService {
  pay: Mock<
    (
      userId: string,
      orderId: string,
    ) => Promise<
      StatusError | { success: true; message: string; data: unknown }
    >
  >;
  findAll: Mock<
    (
      page?: number,
      limit?: number,
      offset?: number,
    ) => Promise<{ success: true; data: unknown[]; pagination: unknown }>
  >;
  findMe: Mock<(userId: string) => Promise<{ success: true; data: unknown[] }>>;
  findOne: Mock<
    (
      userId: string,
      paymentId: string,
    ) => Promise<
      { error: true; message: string } | { success: true; data: unknown }
    >
  >;
  rechargeBalance: Mock<
    (
      userId: string,
      amount: number,
    ) => Promise<
      | StatusError
      | ValidationError
      | { success: true; message: string; data: unknown }
    >
  >;
}

interface Tagged {
  type: string;
  payload: unknown;
}

interface FakeSpongRes {
  SpongOK: Mock<(payload: unknown) => Tagged>;
  SpongBadRequest: Mock<(payload: unknown) => Tagged>;
  SpongNotFound: Mock<(payload: unknown) => Tagged>;
  SpongUnprocessableContent: Mock<(payload: unknown) => Tagged>;
}

// ───────────────────────── helpers ─────────────────────────

const orderId = 'order-1';
const paymentId = 'payment-1';

const currentUser = { id: 'user-1' } as unknown as AuthenticationUser;

const makeReq = (
  options: {
    params?: { orderId?: string; paymentId?: string };
    query?: URLSearchParams;
    body?: unknown;
  } = {},
) => {
  const json = mock(async (): Promise<unknown> => options.body);

  const req = {
    user: currentUser,
    params: options.params ?? {},
    query: options.query ?? new URLSearchParams(),
    json,
  } as unknown as SpongReq;

  return { req, json };
};

const tagged = (type: string) =>
  mock((payload: unknown): Tagged => ({ type, payload }));

// Handlers are typed as returning `void | Response`; in these tests they return the
// tagged objects produced by the fake SpongRes.
const asTagged = (result: unknown): Tagged => result as Tagged;

const missingOrderIdPayload = {
  success: false,
  message: 'Order ID is required',
};

const missingPaymentIdPayload = {
  success: false,
  message: 'Payment ID is required',
};

// ───────────────────────── tests ─────────────────────────

describe('PaymentsController', () => {
  let paymentsService: FakePaymentsService;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: PaymentsController;

  beforeEach(() => {
    paymentsService = {
      pay: mock(
        async (
          _userId: string,
          _orderId: string,
        ): Promise<
          StatusError | { success: true; message: string; data: unknown }
        > => ({ success: true, message: 'paid', data: null }),
      ),
      findAll: mock(
        async (
          _page?: number,
          _limit?: number,
          _offset?: number,
        ): Promise<{
          success: true;
          data: unknown[];
          pagination: unknown;
        }> => ({ success: true, data: [], pagination: {} }),
      ),
      findMe: mock(
        async (
          _userId: string,
        ): Promise<{ success: true; data: unknown[] }> => ({
          success: true,
          data: [],
        }),
      ),
      findOne: mock(
        async (
          _userId: string,
          _paymentId: string,
        ): Promise<
          { error: true; message: string } | { success: true; data: unknown }
        > => ({ success: true, data: null }),
      ),
      rechargeBalance: mock(
        async (
          _userId: string,
          _amount: number,
        ): Promise<
          | StatusError
          | ValidationError
          | { success: true; message: string; data: unknown }
        > => ({ success: true, message: 'recharged', data: null }),
      ),
    };

    spongRes = {
      SpongOK: tagged('ok'),
      SpongBadRequest: tagged('bad-request'),
      SpongNotFound: tagged('not-found'),
      SpongUnprocessableContent: tagged('unprocessable'),
    };
    res = spongRes as unknown as SpongRes;

    controller = new PaymentsController(
      paymentsService as unknown as PaymentsService,
    );
  });

  // ───────────────────────── pay ─────────────────────────
  describe('pay', () => {
    it('returns 400 when the order id is missing', async () => {
      const result = await controller.pay(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: missingOrderIdPayload,
      });
      expect(paymentsService.pay).not.toHaveBeenCalled();
    });

    it('returns 404 when the service answers with statusCode 404', async () => {
      paymentsService.pay.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'Order not found',
      });

      const result = await controller.pay(
        makeReq({ params: { orderId } }).req,
        res,
      );

      expect(paymentsService.pay).toHaveBeenCalledWith(currentUser.id, orderId);
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Order not found' },
      });
    });

    it('returns 400 for any other service error', async () => {
      paymentsService.pay.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Insufficient balance to complete this payment.',
      });

      const result = await controller.pay(
        makeReq({ params: { orderId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: {
          success: false,
          message: 'Insufficient balance to complete this payment.',
        },
      });
    });

    it('returns 200 with the payment on success', async () => {
      const data = { id: paymentId };
      paymentsService.pay.mockResolvedValue({
        success: true,
        message: 'Payment completed successfully',
        data,
      });

      const result = await controller.pay(
        makeReq({ params: { orderId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          message: 'Payment completed successfully',
          data,
        },
      });
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('passes the request pagination to the service and returns it with the payments', async () => {
      const { req } = makeReq({
        query: new URLSearchParams({
          page: '2',
          limit: '20',
        }),
      });

      const data = [{ id: paymentId }];
      const pagination = { total: 1, page: 2, limit: 20 };

      paymentsService.findAll.mockResolvedValue({
        success: true,
        data,
        pagination,
      });

      const result = await controller.findAll(req, res);

      expect(paymentsService.findAll).toHaveBeenCalledWith(2, 20, 20);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          data: {
            payments: data,
            pagination,
          },
        },
      });
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it("returns the current user's payments", async () => {
      const data = [{ id: paymentId }];
      paymentsService.findMe.mockResolvedValue({ success: true, data });

      const result = await controller.findMe(makeReq().req, res);

      expect(paymentsService.findMe).toHaveBeenCalledWith(currentUser.id);
      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('returns 400 when the payment id is missing', async () => {
      const result = await controller.findOne(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: missingPaymentIdPayload,
      });
      expect(paymentsService.findOne).not.toHaveBeenCalled();
    });

    it('returns 404 when the service reports an error', async () => {
      paymentsService.findOne.mockResolvedValue({
        error: true,
        message: 'Payment not found',
      });

      const result = await controller.findOne(
        makeReq({ params: { paymentId } }).req,
        res,
      );

      expect(paymentsService.findOne).toHaveBeenCalledWith(
        currentUser.id,
        paymentId,
      );
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Payment not found' },
      });
    });

    it('returns the payment on success', async () => {
      const data = { id: paymentId };
      paymentsService.findOne.mockResolvedValue({ success: true, data });

      const result = await controller.findOne(
        makeReq({ params: { paymentId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── rechargeBalance ─────────────────────────
  describe('rechargeBalance', () => {
    const body = { amount: 150 };

    it('passes the parsed amount to the service', async () => {
      const { req, json } = makeReq({ body });

      await controller.rechargeBalance(req, res);

      expect(json).toHaveBeenCalledTimes(1);
      expect(paymentsService.rechargeBalance).toHaveBeenCalledWith(
        currentUser.id,
        150,
      );
    });

    it('returns 404 when the service answers with statusCode 404', async () => {
      paymentsService.rechargeBalance.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'User not found',
      });

      const result = await controller.rechargeBalance(
        makeReq({ body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'User not found' },
      });
    });

    it('returns 422 with the validation errors', async () => {
      const errors = [{ field: 'amount', message: 'Amount is invalid' }];
      paymentsService.rechargeBalance.mockResolvedValue({
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors,
      });

      const result = await controller.rechargeBalance(
        makeReq({ body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'unprocessable',
        payload: { success: false, message: 'Validation failed', errors },
      });
    });

    it('returns 400 for any other service error', async () => {
      paymentsService.rechargeBalance.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Something went wrong.',
      });

      const result = await controller.rechargeBalance(
        makeReq({ body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: {
          success: false,
          message: 'Something went wrong.',
        },
      });
    });

    it('returns 200 with the new balance on success', async () => {
      const data = { amount: 150, balance: 650 };
      paymentsService.rechargeBalance.mockResolvedValue({
        success: true,
        message: 'The balance has been successfully topped up.',
        data,
      });

      const result = await controller.rechargeBalance(
        makeReq({ body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          message: 'The balance has been successfully topped up.',
          data,
        },
      });
    });
  });
});
