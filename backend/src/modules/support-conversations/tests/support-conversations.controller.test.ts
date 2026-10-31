import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';
import type { SpongHandler } from 'riser-bob';
import { buildPagination, getPagination } from '../../../utilities/pagination';
import type { AuthenticationUser } from '../../users/schemas/user.schema';
import { SupportConversationsController } from '../support-conversations.controller';
import type { SupportConversationsService } from '../support-conversations.service';

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

interface FakeSupportConversationsService {
  create: Mock<
    (userId: string) => Promise<ErrorResult | { conversation: unknown }>
  >;
  findAll: Mock<
    (
      page?: number,
      limit?: number,
      offset?: number,
    ) => Promise<{ conversations: unknown[]; total: number }>
  >;
  findMe: Mock<(userId: string) => Promise<{ conversations: unknown[] }>>;
  findOne: Mock<
    (
      userId: string,
      conversationId: string,
    ) => Promise<NotFoundResult | { conversation: unknown }>
  >;
  toggle: Mock<
    (
      adminId: string,
      conversationId: string,
    ) => Promise<
      NotFoundResult | { success: true; message: string; data: unknown }
    >
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

const conversationId = 'conversation-1';

const currentUser = { id: 'user-1' } as unknown as AuthenticationUser;

const makeReq = (
  options: {
    params?: { conversationId?: string };
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
  message: 'Support conversation ID is required.',
};

// ───────────────────────── tests ─────────────────────────

describe('SupportConversationsController', () => {
  let supportConversationsService: FakeSupportConversationsService;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: SupportConversationsController;

  beforeEach(() => {
    supportConversationsService = {
      create: mock(
        async (
          _userId: string,
        ): Promise<ErrorResult | { conversation: unknown }> => ({
          conversation: null,
        }),
      ),
      findAll: mock(
        async (
          _page?: number,
          _limit?: number,
          _offset?: number,
        ): Promise<{ conversations: unknown[]; total: number }> => ({
          conversations: [],
          total: 0,
        }),
      ),
      findMe: mock(
        async (_userId: string): Promise<{ conversations: unknown[] }> => ({
          conversations: [],
        }),
      ),
      findOne: mock(
        async (
          _userId: string,
          _conversationId: string,
        ): Promise<NotFoundResult | { conversation: unknown }> => ({
          conversation: null,
        }),
      ),
      toggle: mock(
        async (
          _adminId: string,
          _conversationId: string,
        ): Promise<
          NotFoundResult | { success: true; message: string; data: unknown }
        > => ({ success: true, message: 'toggled', data: null }),
      ),
    };

    spongRes = {
      SpongOK: tagged('ok'),
      SpongCreated: tagged('created'),
      SpongBadRequest: tagged('bad-request'),
      SpongNotFound: tagged('not-found'),
    };
    res = spongRes as unknown as SpongRes;

    controller = new SupportConversationsController(
      supportConversationsService as unknown as SupportConversationsService,
    );
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    it('returns 404 when the service answers with statusCode 404', async () => {
      supportConversationsService.create.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'User not found',
      });

      const result = await controller.create(makeReq(), res);

      expect(supportConversationsService.create).toHaveBeenCalledWith(
        currentUser.id,
      );
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'User not found' },
      });
    });

    it('returns 400 for any other service error', async () => {
      supportConversationsService.create.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'You already have an open support conversation',
      });

      const result = await controller.create(makeReq(), res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: {
          success: false,
          message: 'You already have an open support conversation',
        },
      });
    });

    it('returns 201 with the created conversation', async () => {
      const conversation = { id: conversationId };
      supportConversationsService.create.mockResolvedValue({ conversation });

      const result = await controller.create(makeReq(), res);

      expect(asTagged(result)).toEqual({
        type: 'created',
        payload: {
          success: true,
          message: 'Support conversation created succssfully',
          data: conversation,
        },
      });
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('passes the request pagination to the service and builds the pagination from the total', async () => {
      const req = makeReq({
        query: new URLSearchParams({
          page: '2',
          limit: '5',
        }),
      });

      const conversations = [{ id: conversationId }];

      supportConversationsService.findAll.mockResolvedValue({
        conversations,
        total: 12,
      });

      const result = await controller.findAll(req, res);

      expect(supportConversationsService.findAll).toHaveBeenCalledWith(2, 5, 5);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          data: {
            conversations,
            pagination: buildPagination(12, 2, 5),
          },
        },
      });
    });
  });
  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it("returns the current user's conversations", async () => {
      const conversations = [{ id: conversationId }];
      supportConversationsService.findMe.mockResolvedValue({ conversations });

      const result = await controller.findMe(makeReq(), res);

      expect(supportConversationsService.findMe).toHaveBeenCalledWith(
        currentUser.id,
      );
      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data: conversations },
      });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('returns 400 when the conversation id is missing', async () => {
      const result = await controller.findOne(makeReq(), res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: missingIdPayload,
      });
      expect(supportConversationsService.findOne).not.toHaveBeenCalled();
    });

    it('returns 404 when the service reports an error', async () => {
      supportConversationsService.findOne.mockResolvedValue({
        error: true,
        message: 'Conversation not found',
      });

      const result = await controller.findOne(
        makeReq({ params: { conversationId } }),
        res,
      );

      expect(supportConversationsService.findOne).toHaveBeenCalledWith(
        currentUser.id,
        conversationId,
      );
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Conversation not found' },
      });
    });

    it('returns the conversation on success', async () => {
      const conversation = { id: conversationId };
      supportConversationsService.findOne.mockResolvedValue({ conversation });

      const result = await controller.findOne(
        makeReq({ params: { conversationId } }),
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data: conversation },
      });
    });
  });

  // ───────────────────────── toggle ─────────────────────────
  describe('toggle', () => {
    it('returns 400 when the conversation id is missing', async () => {
      const result = await controller.toggle(makeReq(), res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: missingIdPayload,
      });
      expect(supportConversationsService.toggle).not.toHaveBeenCalled();
    });

    it('returns 404 when the service reports an error', async () => {
      supportConversationsService.toggle.mockResolvedValue({
        error: true,
        message: 'Conversation not found',
      });

      const result = await controller.toggle(
        makeReq({ params: { conversationId } }),
        res,
      );

      expect(supportConversationsService.toggle).toHaveBeenCalledWith(
        currentUser.id,
        conversationId,
      );
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Conversation not found' },
      });
    });

    it('returns the toggled conversation with the service message', async () => {
      const data = { id: conversationId };
      supportConversationsService.toggle.mockResolvedValue({
        success: true,
        message: 'Support conversation closed successfully',
        data,
      });

      const result = await controller.toggle(
        makeReq({ params: { conversationId } }),
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          message: 'Support conversation closed successfully',
          data,
        },
      });
    });
  });
});
