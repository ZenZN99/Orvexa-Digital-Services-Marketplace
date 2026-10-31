import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test";
import type { SpongHandler } from "riser-bob";
import type { AuthenticationUser } from "../../users/schemas/user.schema";
import { NotificationsController } from "../notifications.controller";
import type { NotificationsService } from "../notifications.service";
import { NotificationType } from "../schemas/enums/notification.enum";

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];

interface CreateNotificationBody {
  senderId: string;
  receiverId: string;
  targetId?: string | null;
  type: NotificationType;
  message: string;
  link?: string | null;
}

interface FakeNotificationsService {
  create: Mock<
    (
      data: CreateNotificationBody,
    ) => Promise<{ success: true; message: string; data: unknown } | undefined>
  >;
  findMe: Mock<
    (
      currentUser: AuthenticationUser,
    ) => Promise<{ success: boolean; data: unknown }>
  >;
  markAsRead: Mock<
    (
      currentUser: AuthenticationUser,
      notificationId: string,
    ) => Promise<
      | { error: true; message: string }
      | { success: true; message: string; data: unknown }
    >
  >;
  markAllAsRead: Mock<
    (
      currentUser: AuthenticationUser,
    ) => Promise<{ success: boolean; message: string }>
  >;
  delete: Mock<
    (
      currentUser: AuthenticationUser,
      notificationId: string,
    ) => Promise<
      { error: true; message: string } | { success: true; message: string }
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

const notificationId = "notification-1";

const currentUser = { id: "user-1" } as unknown as AuthenticationUser;

const makeReq = (
  options: { params?: { notificationId?: string }; body?: unknown } = {},
) => {
  const json = mock(async (): Promise<unknown> => options.body);
  const req = {
    user: currentUser,
    params: options.params ?? {},
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
  success: false,
  message: "Notification ID is required",
};

// ───────────────────────── tests ─────────────────────────

describe("NotificationsController", () => {
  let notificationsService: FakeNotificationsService;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: NotificationsController;

  beforeEach(() => {
    notificationsService = {
      create: mock(
        async (
          _data: CreateNotificationBody,
        ): Promise<
          { success: true; message: string; data: unknown } | undefined
        > => ({ success: true, message: "created", data: null }),
      ),
      findMe: mock(
        async (
          _currentUser: AuthenticationUser,
        ): Promise<{ success: boolean; data: unknown }> => ({
          success: true,
          data: [],
        }),
      ),
      markAsRead: mock(
        async (
          _currentUser: AuthenticationUser,
          _notificationId: string,
        ): Promise<
          | { error: true; message: string }
          | { success: true; message: string; data: unknown }
        > => ({ success: true, message: "read", data: null }),
      ),
      markAllAsRead: mock(
        async (
          _currentUser: AuthenticationUser,
        ): Promise<{ success: boolean; message: string }> => ({
          success: true,
          message: "all read",
        }),
      ),
      delete: mock(
        async (
          _currentUser: AuthenticationUser,
          _notificationId: string,
        ): Promise<
          { error: true; message: string } | { success: true; message: string }
        > => ({ success: true, message: "deleted" }),
      ),
    };

    spongRes = {
      SpongOK: tagged("ok"),
      SpongCreated: tagged("created"),
      SpongBadRequest: tagged("bad-request"),
      SpongNotFound: tagged("not-found"),
    };
    res = spongRes as unknown as SpongRes;

    controller = new NotificationsController(
      notificationsService as unknown as NotificationsService,
    );
  });

  // ───────────────────────── create ─────────────────────────
  describe("create", () => {
    const body: CreateNotificationBody = {
      senderId: "sender-1",
      receiverId: "receiver-1",
      targetId: "target-1",
      type: NotificationType.CONTRACT_MESSAGE,
      message: "You have a new message.",
      link: "/contract/contract-1",
    };

    it("passes the parsed body to the service and returns 201 with its result", async () => {
      const data = { id: notificationId };
      notificationsService.create.mockResolvedValue({
        success: true,
        message: "Notification created successfully",
        data,
      });
      const { req, json } = makeReq({ body });

      const result = await controller.create(req, res);

      expect(json).toHaveBeenCalledTimes(1);
      expect(notificationsService.create).toHaveBeenCalledWith(body);
      expect(asTagged(result)).toEqual({
        type: "created",
        payload: {
          success: true,
          message: "Notification created successfully",
          data,
        },
      });
    });

    it("doesn't crash when the service skips creation (sender is the receiver)", async () => {
      notificationsService.create.mockResolvedValue(undefined);

      await controller.create(makeReq({ body }).req, res);

      expect(spongRes.SpongCreated).toHaveBeenCalledTimes(1);
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe("findMe", () => {
    it("returns the current user's notifications", async () => {
      const data = [{ id: notificationId }];
      notificationsService.findMe.mockResolvedValue({ success: true, data });

      const result = await controller.findMe(makeReq().req, res);

      expect(notificationsService.findMe).toHaveBeenCalledWith(currentUser);
      expect(asTagged(result).payload).toEqual({ success: true, data });
    });

    it.todo("responds with 200 (SpongOK) instead of 201 (SpongCreated)");
  });

  // ───────────────────────── markAsRead ─────────────────────────
  describe("markAsRead", () => {
    it("returns 400 when the notification id is missing", async () => {
      const result = await controller.markAsRead(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: "bad-request",
        payload: missingIdPayload,
      });
      expect(notificationsService.markAsRead).not.toHaveBeenCalled();
    });

    it("returns 404 when the service reports an error", async () => {
      notificationsService.markAsRead.mockResolvedValue({
        error: true,
        message: "Notification not found",
      });

      const result = await controller.markAsRead(
        makeReq({ params: { notificationId } }).req,
        res,
      );

      expect(notificationsService.markAsRead).toHaveBeenCalledWith(
        currentUser,
        notificationId,
      );
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: { success: false, message: "Notification not found" },
      });
    });

    it("returns the updated notification on success", async () => {
      const data = { id: notificationId, isRead: true };
      notificationsService.markAsRead.mockResolvedValue({
        success: true,
        message: "Notification marked as read successfully",
        data,
      });

      const result = await controller.markAsRead(
        makeReq({ params: { notificationId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: "ok",
        payload: {
          success: true,
          message: "Notification marked as read successfully",
          data,
        },
      });
    });
  });

  // ───────────────────────── markAllAsRead ─────────────────────────
  describe("markAllAsRead", () => {
    it("marks all notifications as read for the current user", async () => {
      notificationsService.markAllAsRead.mockResolvedValue({
        success: true,
        message: "All notifications marked as read successfully",
      });

      const result = await controller.markAllAsRead(makeReq().req, res);

      expect(notificationsService.markAllAsRead).toHaveBeenCalledWith(
        currentUser,
      );
      expect(asTagged(result)).toEqual({
        type: "ok",
        payload: {
          success: true,
          message: "All notifications marked as read successfully",
        },
      });
    });
  });

  // ───────────────────────── delete ─────────────────────────
  describe("delete", () => {
    it("returns 400 when the notification id is missing", async () => {
      const result = await controller.delete(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: "bad-request",
        payload: missingIdPayload,
      });
      expect(notificationsService.delete).not.toHaveBeenCalled();
    });

    it("returns 404 when the service reports an error", async () => {
      notificationsService.delete.mockResolvedValue({
        error: true,
        message: "Notification not found",
      });

      const result = await controller.delete(
        makeReq({ params: { notificationId } }).req,
        res,
      );

      expect(notificationsService.delete).toHaveBeenCalledWith(
        currentUser,
        notificationId,
      );
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: { success: false, message: "Notification not found" },
      });
    });

    it("returns 200 after deleting the notification", async () => {
      notificationsService.delete.mockResolvedValue({
        success: true,
        message: "Notification deleted successfully",
      });

      const result = await controller.delete(
        makeReq({ params: { notificationId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: "ok",
        payload: {
          success: true,
          message: "Notification deleted successfully",
        },
      });
    });

    it.todo(
      "returns 404 when the service answers { success: false } (what NotificationsService.delete returns today)",
    );
  });
});
