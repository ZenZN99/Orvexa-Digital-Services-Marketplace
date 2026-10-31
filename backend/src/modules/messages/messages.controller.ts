import type { SpongHandler } from 'riser-bob';
import { getPagination } from '../../utilities/pagination';
import type { MessagesService } from './messages.service';
import type { AuthenticationUser } from '../users/schemas/user.schema';

export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  readonly create: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;
    const { contractId } = spongReq.params;

    if (!contractId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Contract ID is required',
      });
    }

    const formData = await spongReq.formData();

    const result = await this.messagesService.create(
      userId,
      contractId,
      formData,
    );

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

    return spongRes.SpongCreated({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  };

  readonly findAll: SpongHandler = async (spongReq, spongRes) => {
    const { page, limit, offset } = getPagination(spongReq);

    const result = await this.messagesService.findAll(page, limit, offset);

    return spongRes.SpongOK({
      success: result.success,
      data: {
        messages: result.data,
        pagination: result.pagination,
      },
    });
  };

  readonly findMe: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;
    const { contractId } = spongReq.params;

    if (!contractId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Contract ID is required',
      });
    }

    const result = await this.messagesService.findMe(userId, contractId);

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

  readonly delete: SpongHandler = async (spongReq, spongRes) => {
    const currentUser = spongReq.user!;
    const { messageId } = spongReq.params;

    if (!messageId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Message ID is required',
      });
    }

    const result = await this.messagesService.delete(
      currentUser as AuthenticationUser,
      messageId,
    );

    if ('error' in result) {
      if (result.statusCode === 404) {
        return spongRes.SpongNotFound({
          success: false,
          message: result.message,
        });
      }

      if (result.statusCode === 403) {
        return spongRes.SpongForbidden({
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
    });
  };
}
