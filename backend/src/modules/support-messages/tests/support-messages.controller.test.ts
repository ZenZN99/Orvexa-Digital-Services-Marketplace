import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test";
import type { SpongHandler } from "riser-bob";
import type { AuthenticationUser } from "../../users/schemas/user.schema";
import { SupportMessagesController } from "../support-messages.controller";
import type { SupportMessagesService } from "../support-messages.service";

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

interface FakeSupportMessagesService {
  create: Mock<
    (
      currentUser: AuthenticationUser,
      conversationId: string,
      formData: FormData,
    ) => Promise<
      ErrorResult | { success: true; message: string; data: unknown }
    >
  >;
  findAll: Mock<
    (
      currentUser: AuthenticationUser,
      conversationId: string,
    ) => Promise<NotFoundResult | { success: true; data: unknown }>
  >;
  markAllAsRead: Mock<
    (
      currentUser: AuthenticationUser,
      conversationId: string,
    ) => Promise<
      NotFoundResult | { success: true; message: string; data: unknown }
    >
  >;
  delete: Mock<
    (
      conversationId: string,
      messageId: string,
    ) => Promise<NotFoundResult | { success: true; message: string }>
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

const conversationId = "conversation-1";
const messageId = "message-1";

const currentUser = { id: "user-1" } as unknown as AuthenticationUser;

const makeReq = (
  options: { params?: { conversationId?: string; messageId?: string } } = {},
) => {
  const formData = new FormData();
  const readFormData = mock(async (): Promise<FormData> => formData);
  const req = {
    user: currentUser,
    params: options.params ?? {},
    formData: readFormData,
  } as unknown as SpongReq;

  return { req, readFormData, formData };
};

const tagged = (type: string) =>
  mock((payload: unknown): Tagged => ({ type, payload }));

// Handlers are typed as returning `void | Response`; in these tests they return the
// tagged objects produced by the fake SpongRes.
const asTagged = (result: unknown): Tagged => result as Tagged;

const missingIdPayload = {
  success: false,
  message: "Support conversation ID is required",
};

// ───────────────────────── tests ─────────────────────────

describe("SupportMessagesController", () => {
  let supportMessagesService: FakeSupportMessagesService;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: SupportMessagesController;

  beforeEach(() => {
    supportMessagesService = {
      create: mock(
        async (
          _currentUser: AuthenticationUser,
          _conversationId: string,
          _formData: FormData,
        ): Promise<
          ErrorResult | { success: true; message: string; data: unknown }
        > => ({ success: true, message: "created", data: null }),
      ),
      findAll: mock(
        async (
          _currentUser: AuthenticationUser,
          _conversationId: string,
        ): Promise<NotFoundResult | { success: true; data: unknown }> => ({
          success: true,
          data: [],
        }),
      ),
      markAllAsRead: mock(
        async (
          _currentUser: AuthenticationUser,
          _conversationId: string,
        ): Promise<
          NotFoundResult | { success: true; message: string; data: unknown }
        > => ({ success: true, message: "read", data: null }),
      ),
      delete: mock(
        async (
          _conversationId: string,
          _messageId: string,
        ): Promise<NotFoundResult | { success: true; message: string }> => ({
          success: true,
          message: "deleted",
        }),
      ),
    };

    spongRes = {
      SpongOK: tagged("ok"),
      SpongCreated: tagged("created"),
      SpongBadRequest: tagged("bad-request"),
      SpongNotFound: tagged("not-found"),
    };
    res = spongRes as unknown as SpongRes;

    controller = new SupportMessagesController(
      supportMessagesService as unknown as SupportMessagesService,
    );
  });

  // ───────────────────────── create ─────────────────────────
  describe("create", () => {
    it("returns 400 when the conversation id is missing", async () => {
      const { req, readFormData } = makeReq();

      const result = await controller.create(req, res);

      expect(asTagged(result)).toEqual({
        type: "bad-request",
        payload: missingIdPayload,
      });
      expect(readFormData).not.toHaveBeenCalled();
      expect(supportMessagesService.create).not.toHaveBeenCalled();
    });

    it("passes the current user, the conversation id and the form data to the service", async () => {
      const { req, formData } = makeReq({ params: { conversationId } });

      await controller.create(req, res);

      expect(supportMessagesService.create).toHaveBeenCalledWith(
        currentUser,
        conversationId,
        formData,
      );
    });

    it("returns 404 when the service answers with statusCode 404", async () => {
      supportMessagesService.create.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: "Support conversation not found",
      });

      const result = await controller.create(
        makeReq({ params: { conversationId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: {
          success: false,
          message: "Support conversation not found",
        },
      });
    });

    it("returns 400 for any other service error", async () => {
      supportMessagesService.create.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: "You can attach a maximum of 5 files",
      });

      const result = await controller.create(
        makeReq({ params: { conversationId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: "bad-request",
        payload: {
          success: false,
          message: "You can attach a maximum of 5 files",
        },
      });
    });

    it("returns 201 with the created message", async () => {
      const data = { id: messageId };
      supportMessagesService.create.mockResolvedValue({
        success: true,
        message: "Support message created successfully",
        data,
      });

      const result = await controller.create(
        makeReq({ params: { conversationId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: "created",
        payload: {
          success: true,
          message: "Support message created successfully",
          data,
        },
      });
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe("findAll", () => {
    it("returns 400 when the conversation id is missing", async () => {
      const result = await controller.findAll(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: "bad-request",
        payload: missingIdPayload,
      });
      expect(supportMessagesService.findAll).not.toHaveBeenCalled();
    });

    it("returns 404 when the service reports an error", async () => {
      supportMessagesService.findAll.mockResolvedValue({
        error: true,
        message: "Support conversation not found",
      });

      const result = await controller.findAll(
        makeReq({ params: { conversationId } }).req,
        res,
      );

      expect(supportMessagesService.findAll).toHaveBeenCalledWith(
        currentUser,
        conversationId,
      );
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: {
          success: false,
          message: "Support conversation not found",
        },
      });
    });

    it("returns the messages on success", async () => {
      const data = [{ id: messageId }];
      supportMessagesService.findAll.mockResolvedValue({
        success: true,
        data,
      });

      const result = await controller.findAll(
        makeReq({ params: { conversationId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: "ok",
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── markAllAsRead ─────────────────────────
  describe("markAllAsRead", () => {
    it("returns 400 when the conversation id is missing", async () => {
      const result = await controller.markAllAsRead(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: "bad-request",
        payload: missingIdPayload,
      });
      expect(supportMessagesService.markAllAsRead).not.toHaveBeenCalled();
    });

    it("returns 404 when the service reports an error", async () => {
      supportMessagesService.markAllAsRead.mockResolvedValue({
        error: true,
        message: "Support conversation not found",
      });

      const result = await controller.markAllAsRead(
        makeReq({ params: { conversationId } }).req,
        res,
      );

      expect(supportMessagesService.markAllAsRead).toHaveBeenCalledWith(
        currentUser,
        conversationId,
      );
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: {
          success: false,
          message: "Support conversation not found",
        },
      });
    });

    it("returns the service message and data on success", async () => {
      const data = [3];
      supportMessagesService.markAllAsRead.mockResolvedValue({
        success: true,
        message: "All support messages marked as read successfully",
        data,
      });

      const result = await controller.markAllAsRead(
        makeReq({ params: { conversationId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: "ok",
        payload: {
          success: true,
          message: "All support messages marked as read successfully",
          data,
        },
      });
    });
  });

  // ───────────────────────── delete ─────────────────────────
  describe("delete", () => {
    const missingIdsPayload = {
      success: false,
      message: "Support conversation ID and message ID are required.",
    };

    it("returns 400 when the conversation id is missing", async () => {
      const result = await controller.delete(
        makeReq({ params: { messageId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: "bad-request",
        payload: missingIdsPayload,
      });
      expect(supportMessagesService.delete).not.toHaveBeenCalled();
    });

    it("returns 400 when the message id is missing", async () => {
      const result = await controller.delete(
        makeReq({ params: { conversationId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: "bad-request",
        payload: missingIdsPayload,
      });
      expect(supportMessagesService.delete).not.toHaveBeenCalled();
    });

    it("returns 404 when the service reports an error", async () => {
      supportMessagesService.delete.mockResolvedValue({
        error: true,
        message: "Support message not found",
      });

      const result = await controller.delete(
        makeReq({ params: { conversationId, messageId } }).req,
        res,
      );

      expect(supportMessagesService.delete).toHaveBeenCalledWith(
        conversationId,
        messageId,
      );
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: { success: false, message: "Support message not found" },
      });
    });

    it("returns 200 after deleting the message", async () => {
      supportMessagesService.delete.mockResolvedValue({
        success: true,
        message: "Support message deleted successfully",
      });

      const result = await controller.delete(
        makeReq({ params: { conversationId, messageId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: "ok",
        payload: {
          success: true,
          message: "Support message deleted successfully",
        },
      });
    });
  });
});
