import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';
import type { SpongHandler } from 'riser-bob';
import { buildPagination, getPagination } from '../../../utilities/pagination';
import type { AuthenticationUser } from '../../users/schemas/user.schema';
import { UserVerificationStatus } from '../schemas/enums/user-verification.enum';
import { UserVerificationsController } from '../user-verifications.controller';
import type { UserVerificationsService } from '../user-verifications.service';

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];

interface ErrorResult {
  error: true;
  statusCode: number;
  message: string;
  errors?: unknown;
}

interface FakeUserVerificationsService {
  create: Mock<
    (
      userId: string,
      formData: FormData,
    ) => Promise<
      ErrorResult | { type: 'created' | 'resubmitted'; data: unknown }
    >
  >;
  findPending: Mock<
    (
      page?: number,
      limit?: number,
      offset?: number,
    ) => Promise<{
      verifications: unknown[];
      total: number;
      page: number;
      limit: number;
    }>
  >;
  tryAgain: Mock<(userId: string) => Promise<ErrorResult | { data: unknown }>>;
  update: Mock<
    (
      adminId: string,
      verificationId: string,
      body: {
        status: UserVerificationStatus | null;
        rejectionReason: string | null;
      },
    ) => Promise<ErrorResult | { data: unknown }>
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
  SpongUnprocessableContent: Mock<(payload: unknown) => Tagged>;
}

// ───────────────────────── helpers ─────────────────────────

const verificationId = 'verification-1';

const currentUser = { id: 'user-1' } as unknown as AuthenticationUser;

const makeReq = (
  options: {
    params?: { verificationId?: string };
    query?: URLSearchParams;
    body?: unknown;
  } = {},
) => {
  const formData = new FormData();
  const json = mock(async (): Promise<unknown> => options.body);
  const readFormData = mock(async (): Promise<FormData> => formData);

  const req = {
    user: currentUser,
    params: options.params ?? {},
    query: options.query ?? new URLSearchParams(),
    json,
    formData: readFormData,
  } as unknown as SpongReq;

  return { req, json, readFormData, formData };
};

const tagged = (type: string) =>
  mock((payload: unknown): Tagged => ({ type, payload }));

// Handlers are typed as returning `void | Response`; in these tests they return the
// tagged objects produced by the fake SpongRes.
const asTagged = (result: unknown): Tagged => result as Tagged;

// ───────────────────────── tests ─────────────────────────

describe('UserVerificationsController', () => {
  let userVerificationsService: FakeUserVerificationsService;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: UserVerificationsController;

  beforeEach(() => {
    userVerificationsService = {
      create: mock(
        async (
          _userId: string,
          _formData: FormData,
        ): Promise<
          ErrorResult | { type: 'created' | 'resubmitted'; data: unknown }
        > => ({ type: 'created', data: null }),
      ),
      findPending: mock(
        async (
          _page?: number,
          _limit?: number,
          _offset?: number,
        ): Promise<{
          verifications: unknown[];
          total: number;
          page: number;
          limit: number;
        }> => ({ verifications: [], total: 0, page: 1, limit: 10 }),
      ),
      tryAgain: mock(
        async (_userId: string): Promise<ErrorResult | { data: unknown }> => ({
          data: null,
        }),
      ),
      update: mock(
        async (
          _adminId: string,
          _verificationId: string,
          _body: {
            status: UserVerificationStatus | null;
            rejectionReason: string | null;
          },
        ): Promise<ErrorResult | { data: unknown }> => ({ data: null }),
      ),
    };

    spongRes = {
      SpongOK: tagged('ok'),
      SpongCreated: tagged('created'),
      SpongBadRequest: tagged('bad-request'),
      SpongNotFound: tagged('not-found'),
      SpongUnprocessableContent: tagged('unprocessable'),
    };
    res = spongRes as unknown as SpongRes;

    controller = new UserVerificationsController(
      userVerificationsService as unknown as UserVerificationsService,
    );
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    it('passes the user and the form data to the service', async () => {
      const { req, readFormData, formData } = makeReq();

      await controller.create(req, res);

      expect(readFormData).toHaveBeenCalledTimes(1);
      expect(userVerificationsService.create).toHaveBeenCalledWith(
        currentUser.id,
        formData,
      );
    });

    it('returns 400 for any service error', async () => {
      userVerificationsService.create.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Your verification request is already pending review.',
      });

      const result = await controller.create(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: {
          success: false,
          message: 'Your verification request is already pending review.',
        },
      });
    });

    it('returns 201 when a new request was submitted', async () => {
      const data = { id: verificationId };
      userVerificationsService.create.mockResolvedValue({
        type: 'created',
        data,
      });

      const result = await controller.create(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'created',
        payload: {
          success: true,
          message: 'Verification request submitted successfully.',
          data,
        },
      });
    });

    it('returns 200 when the request was resubmitted', async () => {
      const data = { id: verificationId };
      userVerificationsService.create.mockResolvedValue({
        type: 'resubmitted',
        data,
      });

      const result = await controller.create(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          message: 'Verification request resubmitted successfully',
          data,
        },
      });
    });
  });

  // ───────────────────────── findPending ─────────────────────────
  describe('findPending', () => {
    it('passes the request pagination to the service and builds the pagination from the total', async () => {
      const { req } = makeReq({
        query: new URLSearchParams({
          page: '2',
          limit: '5',
        }),
      });

      const verifications = [{ id: verificationId }];

      userVerificationsService.findPending.mockResolvedValue({
        verifications,
        total: 12,
        page: 2,
        limit: 5,
      });

      const result = await controller.findPending(req, res);

      expect(userVerificationsService.findPending).toHaveBeenCalledWith(
        2,
        5,
        5,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          data: {
            verifications,
            pagination: buildPagination(12, 2, 5),
          },
        },
      });
    });
  });

  // ───────────────────────── tryAgain ─────────────────────────
  describe('tryAgain', () => {
    it('returns 404 when the service answers with statusCode 404', async () => {
      userVerificationsService.tryAgain.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'No verification request was found for this user.',
      });

      const result = await controller.tryAgain(makeReq().req, res);

      expect(userVerificationsService.tryAgain).toHaveBeenCalledWith(
        currentUser.id,
      );
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: {
          success: false,
          message: 'No verification request was found for this user.',
        },
      });
    });

    it('returns 400 for any other service error', async () => {
      userVerificationsService.tryAgain.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Your account has already been verified.',
      });

      const result = await controller.tryAgain(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: {
          success: false,
          message: 'Your account has already been verified.',
        },
      });
    });

    it('returns the reset request', async () => {
      const data = { id: verificationId };
      userVerificationsService.tryAgain.mockResolvedValue({ data });

      const result = await controller.tryAgain(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── update ─────────────────────────
  describe('update', () => {
    const body = {
      status: UserVerificationStatus.REJECTED,
      rejectionReason: 'Blurry photo',
    };

    it('returns 404 when the verification id is missing', async () => {
      const { req, json } = makeReq({ body });

      const result = await controller.update(req, res);

      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Verification ID is required' },
      });
      expect(json).not.toHaveBeenCalled();
      expect(userVerificationsService.update).not.toHaveBeenCalled();
    });

    it('passes the admin, the verification id and the parsed body to the service', async () => {
      const { req, json } = makeReq({ params: { verificationId }, body });

      await controller.update(req, res);

      expect(json).toHaveBeenCalledTimes(1);
      expect(userVerificationsService.update).toHaveBeenCalledWith(
        currentUser.id,
        verificationId,
        body,
      );
    });

    it('returns 404 when the service answers with statusCode 404', async () => {
      userVerificationsService.update.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'No verification request was found for this user.',
      });

      const result = await controller.update(
        makeReq({ params: { verificationId }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: {
          success: false,
          message: 'No verification request was found for this user.',
        },
      });
    });

    it('returns 422 with the validation errors', async () => {
      const errors = [{ field: 'status', message: 'Status is invalid' }];
      userVerificationsService.update.mockResolvedValue({
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors,
      });

      const result = await controller.update(
        makeReq({ params: { verificationId }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'unprocessable',
        payload: { success: false, message: 'Validation failed', errors },
      });
    });

    it('returns 400 without errors for any other service error', async () => {
      userVerificationsService.update.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'This verification request is not pending review.',
      });

      const result = await controller.update(
        makeReq({ params: { verificationId }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: {
          success: false,
          message: 'This verification request is not pending review.',
        },
      });
      expect(asTagged(result).payload).not.toHaveProperty('errors');
    });

    it('returns 200 with the reviewed request', async () => {
      const data = { id: verificationId };
      userVerificationsService.update.mockResolvedValue({ data });

      const result = await controller.update(
        makeReq({ params: { verificationId }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          message: 'Verification request reviewed successfully.',
          data,
        },
      });
    });
  });
});
