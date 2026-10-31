import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';
import type { SpongHandler } from 'riser-bob';
import { getPagination } from '../../../utilities/pagination';
import type { AuthenticationUser } from '../../users/schemas/user.schema';
import { OrdersController } from '../orders.controller';
import type { OrdersService } from '../orders.service';

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];

type ServiceError<Code extends number = never> = [Code] extends [never]
  ? { error: true; message: string }
  : { error: true; statusCode: Code; message: string };

interface FakeOrdersService {
  create: Mock<
    (
      userId: string,
    ) => Promise<
      | ServiceError<404 | 400>
      | { success: true; message: string; data: unknown }
    >
  >;
  findAll: Mock<
    (
      page?: number,
      limit?: number,
      offset?: number,
    ) => Promise<{ success: true; data: unknown[]; pagination: unknown }>
  >;
  findMe: Mock<
    (clientId: string) => Promise<{ success: true; data: unknown[] }>
  >;
  findOne: Mock<
    (
      clientId: string,
      orderId: string,
    ) => Promise<ServiceError | { success: true; data: unknown }>
  >;
  delete: Mock<
    (
      clientId: string,
      orderId: string,
    ) => Promise<ServiceError<404 | 400> | { success: true; message: string }>
  >;
}

interface Tagged {
  type: string;
  payload: unknown;
}

interface FakeSpongRes {
  SpongOK: Mock<(payload: unknown) => Tagged>;
  SpongCreated: Mock<(payload: unknown) => Tagged>;
  SpongBadRequest: Mock<(payload: unknown) => Tagged>;
  SpongNotFound: Mock<(payload: unknown) => Tagged>;
}

// ───────────────────────── helpers ─────────────────────────

const orderId = 'order-1';

const currentUser = { id: 'user-1' } as unknown as AuthenticationUser;

const makeReq = (
  options: {
    params?: { orderId?: string };
    query?: URLSearchParams;
  } = {},
) =>
  ({
    user: currentUser,
    params: options.params ?? {},
    query: options.query ?? new URLSearchParams(),
  }) as unknown as SpongReq;

const tagged = (type: string) =>
  mock((payload: unknown): Tagged => ({ type, payload }));

// Handlers are typed as returning `void | Response`; in these tests they return the
// tagged objects produced by the fake SpongRes.
const asTagged = (result: unknown): Tagged => result as Tagged;

const missingIdPayload = {
  success: false,
  message: 'Order ID is required',
};

// ───────────────────────── tests ─────────────────────────

describe('OrdersController', () => {
  let ordersService: FakeOrdersService;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: OrdersController;

  beforeEach(() => {
    ordersService = {
      create: mock(
        async (
          _userId: string,
        ): Promise<
          | ServiceError<404 | 400>
          | { success: true; message: string; data: unknown }
        > => ({ success: true, message: 'created', data: null }),
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
          _clientId: string,
        ): Promise<{ success: true; data: unknown[] }> => ({
          success: true,
          data: [],
        }),
      ),
      findOne: mock(
        async (
          _clientId: string,
          _orderId: string,
        ): Promise<ServiceError | { success: true; data: unknown }> => ({
          success: true,
          data: null,
        }),
      ),
      delete: mock(
        async (
          _clientId: string,
          _orderId: string,
        ): Promise<
          ServiceError<404 | 400> | { success: true; message: string }
        > => ({ success: true, message: 'deleted' }),
      ),
    };

    spongRes = {
      SpongOK: tagged('ok'),
      SpongCreated: tagged('created'),
      SpongBadRequest: tagged('bad-request'),
      SpongNotFound: tagged('not-found'),
    };
    res = spongRes as unknown as SpongRes;

    controller = new OrdersController(
      ordersService as unknown as OrdersService,
    );
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    it('returns 404 when the service reports a missing cart', async () => {
      ordersService.create.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'Cart not found',
      });

      const result = await controller.create(makeReq(), res);

      expect(ordersService.create).toHaveBeenCalledWith(currentUser.id);
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Cart not found' },
      });
    });

    it('returns 400 when the service reports an empty cart', async () => {
      ordersService.create.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Your cart is empty.',
      });

      const result = await controller.create(makeReq(), res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: { success: false, message: 'Your cart is empty.' },
      });
    });

    it('returns 201 with the created order', async () => {
      const data = { id: orderId };
      ordersService.create.mockResolvedValue({
        success: true,
        message: 'Order created successfully',
        data,
      });

      const result = await controller.create(makeReq(), res);

      expect(asTagged(result)).toEqual({
        type: 'created',
        payload: {
          success: true,
          message: 'Order created successfully',
          data,
        },
      });
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('passes the request pagination to the service and returns it with the orders', async () => {
      const req = makeReq({
        query: new URLSearchParams({
          page: '2',
          limit: '20',
        }),
      });

      const data = [{ id: orderId }];
      const pagination = { total: 1, page: 2, limit: 20 };

      ordersService.findAll.mockResolvedValue({
        success: true,
        data,
        pagination,
      });

      const result = await controller.findAll(req, res);

      expect(ordersService.findAll).toHaveBeenCalledWith(2, 20, 20);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          data: {
            orders: data,
            pagination,
          },
        },
      });
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it("returns the current user's orders", async () => {
      const data = [{ id: orderId }];
      ordersService.findMe.mockResolvedValue({ success: true, data });

      const result = await controller.findMe(makeReq(), res);

      expect(ordersService.findMe).toHaveBeenCalledWith(currentUser.id);
      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('returns 400 when the order id is missing', async () => {
      const result = await controller.findOne(makeReq(), res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: missingIdPayload,
      });
      expect(ordersService.findOne).not.toHaveBeenCalled();
    });

    it('returns 404 when the service reports an error', async () => {
      ordersService.findOne.mockResolvedValue({
        error: true,
        message: 'Order not found',
      });

      const result = await controller.findOne(
        makeReq({ params: { orderId } }),
        res,
      );

      expect(ordersService.findOne).toHaveBeenCalledWith(
        currentUser.id,
        orderId,
      );
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Order not found' },
      });
    });

    it('returns the order on success', async () => {
      const data = { id: orderId };
      ordersService.findOne.mockResolvedValue({ success: true, data });

      const result = await controller.findOne(
        makeReq({ params: { orderId } }),
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── delete ─────────────────────────
  describe('delete', () => {
    it('returns 400 when the order id is missing', async () => {
      const result = await controller.delete(makeReq(), res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: missingIdPayload,
      });
      expect(ordersService.delete).not.toHaveBeenCalled();
    });

    it('returns 404 when the service answers with statusCode 404', async () => {
      ordersService.delete.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'Order not found',
      });

      const result = await controller.delete(
        makeReq({ params: { orderId } }),
        res,
      );

      expect(ordersService.delete).toHaveBeenCalledWith(
        currentUser.id,
        orderId,
      );
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Order not found' },
      });
    });

    it("returns 400 when the order can't be deleted in its current status", async () => {
      ordersService.delete.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Only orders awaiting payment can be deleted.',
      });

      const result = await controller.delete(
        makeReq({ params: { orderId } }),
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: {
          success: false,
          message: 'Only orders awaiting payment can be deleted.',
        },
      });
    });

    it('returns 200 after deleting the order', async () => {
      ordersService.delete.mockResolvedValue({
        success: true,
        message: 'Order deleted successfully',
      });

      const result = await controller.delete(
        makeReq({ params: { orderId } }),
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, message: 'Order deleted successfully' },
      });
    });
  });
});
