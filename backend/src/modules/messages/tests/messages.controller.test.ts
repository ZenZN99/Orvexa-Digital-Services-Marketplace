import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';
import type { SpongHandler } from 'riser-bob';
import { getPagination } from '../../../utilities/pagination';
import type { AuthenticationUser } from '../../users/schemas/user.schema';
import { MessagesController } from '../messages.controller';
import type { MessagesService } from '../messages.service';

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];

interface ServiceError {
  error: true;
  statusCode: number;
  message: string;
}

interface ServiceValidationError extends ServiceError {
  errors: unknown;
}

interface CreateSuccess {
  success: true;
  message: string;
  data: unknown;
}

interface FakeMessagesService {
  create: Mock<
    (
      userId: string,
      contractId: string,
      formData: FormData,
    ) => Promise<ServiceError | ServiceValidationError | CreateSuccess>
  >;
  findAll: Mock<
    (
      page: number,
      limit: number,
      offset: number,
    ) => Promise<{ success: boolean; data: unknown; pagination: unknown }>
  >;
  findMe: Mock<
    (
      userId: string,
      contractId: string,
    ) => Promise<
      { error: true; message: string } | { success: true; data: unknown }
    >
  >;
  delete: Mock<
    (
      currentUser: AuthenticationUser,
      messageId: string,
    ) => Promise<ServiceError | { success: true; message: string }>
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
  SpongForbidden: Mock<(payload: unknown) => Tagged>;
  SpongUnprocessableContent: Mock<(payload: unknown) => Tagged>;
}

// ───────────────────────── helpers ─────────────────────────

const userId = 'user-1';
const contractId = 'contract-1';
const messageId = 'message-1';

const currentUser = { id: userId } as unknown as AuthenticationUser;

const makeReq = (
  options: {
    params?: { contractId?: string; messageId?: string };
    query?: URLSearchParams;
  } = {},
  formData: FormData = new FormData(),
) => {
  const formDataMock = mock(async (): Promise<FormData> => formData);

  const req = {
    user: currentUser,
    params: options.params ?? {},
    query: options.query ?? new URLSearchParams(),
    formData: formDataMock,
  } as unknown as SpongReq;

  return { req, formData, formDataMock };
};

const tagged = (type: string) =>
  mock((payload: unknown): Tagged => ({ type, payload }));

// Handlers are typed as returning `void | Response`; in these tests they return the
// tagged objects produced by the fake SpongRes.
const asTagged = (result: unknown): Tagged => result as Tagged;

// ───────────────────────── tests ─────────────────────────

describe('MessagesController', () => {
  let messagesService: FakeMessagesService;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: MessagesController;

  beforeEach(() => {
    messagesService = {
      create: mock(
        async (
          _userId: string,
          _contractId: string,
          _formData: FormData,
        ): Promise<ServiceError | ServiceValidationError | CreateSuccess> => ({
          success: true,
          message: 'created',
          data: null,
        }),
      ),
      findAll: mock(
        async (
          _page: number,
          _limit: number,
          _offset: number,
        ): Promise<{
          success: boolean;
          data: unknown;
          pagination: unknown;
        }> => ({
          success: true,
          data: [],
          pagination: {},
        }),
      ),
      findMe: mock(
        async (
          _userId: string,
          _contractId: string,
        ): Promise<
          { error: true; message: string } | { success: true; data: unknown }
        > => ({ success: true, data: [] }),
      ),
      delete: mock(
        async (
          _currentUser: AuthenticationUser,
          _messageId: string,
        ): Promise<ServiceError | { success: true; message: string }> => ({
          success: true,
          message: 'deleted',
        }),
      ),
    };

    spongRes = {
      SpongOK: tagged('ok'),
      SpongCreated: tagged('created'),
      SpongBadRequest: tagged('bad-request'),
      SpongNotFound: tagged('not-found'),
      SpongForbidden: tagged('forbidden'),
      SpongUnprocessableContent: tagged('unprocessable'),
    };
    res = spongRes as unknown as SpongRes;

    controller = new MessagesController(
      messagesService as unknown as MessagesService,
    );
  });

  const missingContractId = {
    success: false,
    message: 'Contract ID is required',
  };

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    it('returns 400 when the contract id is missing', async () => {
      const { req, formDataMock } = makeReq();

      const result = await controller.create(req, res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: missingContractId,
      });
      expect(formDataMock).not.toHaveBeenCalled();
      expect(messagesService.create).not.toHaveBeenCalled();
    });

    it('passes the user, contract id and form data to the service', async () => {
      const formData = new FormData();
      formData.append('content', 'Hello');
      const { req } = makeReq({ params: { contractId } }, formData);

      await controller.create(req, res);

      expect(messagesService.create).toHaveBeenCalledWith(
        userId,
        contractId,
        formData,
      );
    });

    it('maps 404 to SpongNotFound', async () => {
      messagesService.create.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'Contract not found.',
      });

      const result = await controller.create(
        makeReq({ params: { contractId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Contract not found.' },
      });
    });

    it('maps 422 to SpongUnprocessableContent with the errors', async () => {
      const errors = { content: ['Too long'] };
      messagesService.create.mockResolvedValue({
        error: true,
        statusCode: 422,
        message: 'Validation failed.',
        errors,
      });

      const result = await controller.create(
        makeReq({ params: { contractId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'unprocessable',
        payload: { success: false, message: 'Validation failed.', errors },
      });
    });

    it('maps any other error to SpongBadRequest', async () => {
      messagesService.create.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Cannot send messages in a closed contract.',
      });

      const result = await controller.create(
        makeReq({ params: { contractId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: {
          success: false,
          message: 'Cannot send messages in a closed contract.',
        },
      });
    });

    it('returns 201 with the created message', async () => {
      const data = { id: messageId };
      messagesService.create.mockResolvedValue({
        success: true,
        message: 'Message created successfully.',
        data,
      });

      const result = await controller.create(
        makeReq({ params: { contractId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'created',
        payload: {
          success: true,
          message: 'Message created successfully.',
          data,
        },
      });
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('passes the request pagination to the service and returns it with the messages', async () => {
      const { req } = makeReq({
        query: new URLSearchParams({
          page: '2',
          limit: '20',
        }),
      });

      const data = [{ id: messageId }];
      const pagination = { total: 1, page: 2, limit: 20 };

      messagesService.findAll.mockResolvedValue({
        success: true,
        data,
        pagination,
      });

      const result = await controller.findAll(req, res);

      expect(messagesService.findAll).toHaveBeenCalledWith(2, 20, 20);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          data: {
            messages: data,
            pagination,
          },
        },
      });
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it('returns 400 when the contract id is missing', async () => {
      const result = await controller.findMe(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: missingContractId,
      });
      expect(messagesService.findMe).not.toHaveBeenCalled();
    });

    it('returns 404 when the service reports an error', async () => {
      messagesService.findMe.mockResolvedValue({
        error: true,
        message: 'Contract not found',
      });

      const result = await controller.findMe(
        makeReq({ params: { contractId } }).req,
        res,
      );

      expect(messagesService.findMe).toHaveBeenCalledWith(userId, contractId);
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Contract not found' },
      });
    });

    it("returns the contract's messages on success", async () => {
      const data = [{ id: messageId }];
      messagesService.findMe.mockResolvedValue({ success: true, data });

      const result = await controller.findMe(
        makeReq({ params: { contractId } }).req,
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
    it('returns 400 when the message id is missing', async () => {
      const result = await controller.delete(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: { success: false, message: 'Message ID is required' },
      });
      expect(messagesService.delete).not.toHaveBeenCalled();
    });

    it('maps 404 to SpongNotFound', async () => {
      messagesService.delete.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'Message not found',
      });

      const result = await controller.delete(
        makeReq({ params: { messageId } }).req,
        res,
      );

      expect(messagesService.delete).toHaveBeenCalledWith(
        currentUser,
        messageId,
      );
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Message not found' },
      });
    });

    it('maps 403 to SpongForbidden', async () => {
      messagesService.delete.mockResolvedValue({
        error: true,
        statusCode: 403,
        message: 'You are not allowed to perform this action',
      });

      const result = await controller.delete(
        makeReq({ params: { messageId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'forbidden',
        payload: {
          success: false,
          message: 'You are not allowed to perform this action',
        },
      });
    });

    it('maps any other error to SpongBadRequest', async () => {
      messagesService.delete.mockResolvedValue({
        error: true,
        statusCode: 400,
        message:
          'Messages can only be managed while the contract is in progress',
      });

      const result = await controller.delete(
        makeReq({ params: { messageId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: {
          success: false,
          message:
            'Messages can only be managed while the contract is in progress',
        },
      });
      expect(spongRes.SpongNotFound).not.toHaveBeenCalled();
      expect(spongRes.SpongForbidden).not.toHaveBeenCalled();
    });

    it('returns 200 after deleting the message', async () => {
      messagesService.delete.mockResolvedValue({
        success: true,
        message: 'Message deleted successfully',
      });

      const result = await controller.delete(
        makeReq({ params: { messageId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, message: 'Message deleted successfully' },
      });
    });
  });
});
