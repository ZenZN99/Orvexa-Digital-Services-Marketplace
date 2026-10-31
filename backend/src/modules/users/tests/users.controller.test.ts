import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';
import type { SpongHandler } from 'riser-bob';
import { getPagination } from '../../../utilities/pagination';
import { UserRole } from '../schemas/enums/users.enum';
import type { AuthenticationUser } from '../schemas/user.schema';
import { UsersController } from '../users.controller';
import type { UsersService } from '../users.service';

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];

interface ErrorResult {
  error: true;
  statusCode: number;
  message: string;
}

interface NotFoundResult {
  error: true;
  message: string;
}

interface FakeUsersService {
  findAll: Mock<
    (
      page?: number,
      limit?: number,
      offset?: number,
    ) => Promise<{
      success: true;
      safeUsers: unknown[];
      pagination: unknown;
    }>
  >;
  findOne: Mock<
    (id: string) => Promise<NotFoundResult | { success: true; data: unknown }>
  >;
  updateRole: Mock<
    (
      id: string,
      role: UserRole,
    ) => Promise<ErrorResult | { success: true; message: string }>
  >;
  block: Mock<
    (
      adminId: string,
      userId: string,
    ) => Promise<NotFoundResult | { success: true; message: string }>
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
}

// ───────────────────────── helpers ─────────────────────────

const targetId = 'user-2';

const currentUser = { id: 'admin-1' } as unknown as AuthenticationUser;

const makeReq = (
  options: {
    params?: { id?: string };
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

const missingIdPayload = {
  type: 'not-found',
  payload: { success: false, message: 'User ID is required' },
};

// ───────────────────────── tests ─────────────────────────

describe('UsersController', () => {
  let usersService: FakeUsersService;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: UsersController;

  beforeEach(() => {
    usersService = {
      findAll: mock(
        async (
          _page?: number,
          _limit?: number,
          _offset?: number,
        ): Promise<{
          success: true;
          safeUsers: unknown[];
          pagination: unknown;
        }> => ({ success: true, safeUsers: [], pagination: {} }),
      ),
      findOne: mock(
        async (
          _id: string,
        ): Promise<NotFoundResult | { success: true; data: unknown }> => ({
          success: true,
          data: null,
        }),
      ),
      updateRole: mock(
        async (
          _id: string,
          _role: UserRole,
        ): Promise<ErrorResult | { success: true; message: string }> => ({
          success: true,
          message: 'updated',
        }),
      ),
      block: mock(
        async (
          _adminId: string,
          _userId: string,
        ): Promise<NotFoundResult | { success: true; message: string }> => ({
          success: true,
          message: 'blocked',
        }),
      ),
    };

    spongRes = {
      SpongOK: tagged('ok'),
      SpongBadRequest: tagged('bad-request'),
      SpongNotFound: tagged('not-found'),
    };
    res = spongRes as unknown as SpongRes;

    controller = new UsersController(usersService as unknown as UsersService);
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('passes the request pagination to the service and returns it with the users', async () => {
      const { req } = makeReq({
        query: new URLSearchParams({
          page: '2',
          limit: '20',
        }),
      });

      const safeUsers = [{ id: targetId }];
      const pagination = { total: 1, page: 2, limit: 20 };

      usersService.findAll.mockResolvedValue({
        success: true,
        safeUsers,
        pagination,
      });

      const result = await controller.findAll(req, res);

      expect(usersService.findAll).toHaveBeenCalledWith(2, 20, 20);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          data: {
            users: safeUsers,
            pagination,
          },
        },
      });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('returns 404 when the user id is missing', async () => {
      const result = await controller.findOne(makeReq().req, res);

      expect(asTagged(result)).toEqual(missingIdPayload);
      expect(usersService.findOne).not.toHaveBeenCalled();
    });

    it('returns 404 when the service reports an error', async () => {
      usersService.findOne.mockResolvedValue({
        error: true,
        message: 'User not found',
      });

      const result = await controller.findOne(
        makeReq({ params: { id: targetId } }).req,
        res,
      );

      expect(usersService.findOne).toHaveBeenCalledWith(targetId);
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'User not found' },
      });
    });

    it('returns the user on success', async () => {
      const data = { id: targetId };
      usersService.findOne.mockResolvedValue({ success: true, data });

      const result = await controller.findOne(
        makeReq({ params: { id: targetId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── updateRole ─────────────────────────
  describe('updateRole', () => {
    const body = { role: UserRole.SUPPORT };

    it('returns 404 when the user id is missing', async () => {
      const result = await controller.updateRole(makeReq({ body }).req, res);

      expect(asTagged(result)).toEqual(missingIdPayload);
      expect(usersService.updateRole).not.toHaveBeenCalled();
    });

    it('passes the user id and the parsed role to the service', async () => {
      const { req, json } = makeReq({ params: { id: targetId }, body });

      await controller.updateRole(req, res);

      expect(json).toHaveBeenCalledTimes(1);
      expect(usersService.updateRole).toHaveBeenCalledWith(
        targetId,
        UserRole.SUPPORT,
      );
    });

    it('returns 404 when the service answers with statusCode 404', async () => {
      usersService.updateRole.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'User not found',
      });

      const result = await controller.updateRole(
        makeReq({ params: { id: targetId }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'User not found' },
      });
    });

    it('returns 400 for any other service error', async () => {
      usersService.updateRole.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Invalid user role',
      });

      const result = await controller.updateRole(
        makeReq({ params: { id: targetId }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: { success: false, message: 'Invalid user role' },
      });
    });

    it('returns 200 after updating the role', async () => {
      usersService.updateRole.mockResolvedValue({
        success: true,
        message: 'User role updated successfully',
      });

      const result = await controller.updateRole(
        makeReq({ params: { id: targetId }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, message: 'User role updated successfully' },
      });
    });
  });

  // ───────────────────────── block ─────────────────────────
  describe('block', () => {
    it('returns 404 when the user id is missing', async () => {
      const result = await controller.block(makeReq().req, res);

      expect(asTagged(result)).toEqual(missingIdPayload);
      expect(usersService.block).not.toHaveBeenCalled();
    });

    it('returns 404 when the service reports an error', async () => {
      usersService.block.mockResolvedValue({
        error: true,
        message: 'User not found',
      });

      const result = await controller.block(
        makeReq({ params: { id: targetId } }).req,
        res,
      );

      expect(usersService.block).toHaveBeenCalledWith(currentUser.id, targetId);
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'User not found' },
      });
    });

    it('returns 200 after blocking the user', async () => {
      usersService.block.mockResolvedValue({
        success: true,
        message: 'User blocked successfully',
      });

      const result = await controller.block(
        makeReq({ params: { id: targetId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, message: 'User blocked successfully' },
      });
    });
  });
});
