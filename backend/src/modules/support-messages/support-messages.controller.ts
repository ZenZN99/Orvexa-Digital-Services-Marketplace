import type { SpongHandler } from "riser-bob";
import type { SupportMessagesService } from "./support-messages.service";

export class SupportMessagesController {
  constructor(
    private readonly supportMessagesService: SupportMessagesService,
  ) {}

  readonly create: SpongHandler = async (spongReq, spongRes) => {
    const currentUser = spongReq.user!;
    const { conversationId } = spongReq.params;

    if (!conversationId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: "Support conversation ID is required",
      });
    }

    const formData = await spongReq.formData();

    const result = await this.supportMessagesService.create(
      currentUser,
      conversationId,
      formData,
    );

    if ("error" in result) {
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
    const currentUser = spongReq.user!;
    const { conversationId } = spongReq.params;

    if (!conversationId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: "Support conversation ID is required",
      });
    }

    const result = await this.supportMessagesService.findAll(
      currentUser,
      conversationId,
    );

    if ("error" in result) {
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

  readonly markAllAsRead: SpongHandler = async (spongReq, spongRes) => {
    const currentUser = spongReq.user!;
    const { conversationId } = spongReq.params;

    if (!conversationId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: "Support conversation ID is required",
      });
    }

    const result = await this.supportMessagesService.markAllAsRead(
      currentUser,
      conversationId,
    );

    if ("error" in result) {
      return spongRes.SpongNotFound({
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

  readonly delete: SpongHandler = async (spongReq, spongRes) => {
    const { conversationId, messageId } = spongReq.params;

    if (!conversationId || !messageId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: "Support conversation ID and message ID are required.",
      });
    }

    const result = await this.supportMessagesService.delete(
      conversationId,
      messageId,
    );

    if ("error" in result) {
      return spongRes.SpongNotFound({
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
