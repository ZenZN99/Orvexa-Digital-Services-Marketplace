import type { SpongHandler } from 'riser-bob';
import { buildPagination, getPagination } from '../../utilities/pagination';
import type { SupportConversationsService } from './support-conversations.service';

export class SupportConversationsController {
  constructor(
    private readonly supportConversationsService: SupportConversationsService,
  ) {}
  readonly create: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;

    const result = await this.supportConversationsService.create(userId);

    if ('error' in result) {
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
      success: true,
      message: 'Support conversation created succssfully',
      data: result.conversation,
    });
  };

  readonly findAll: SpongHandler = async (spongReq, spongRes) => {
    const { page, limit, offset } = getPagination(spongReq);

    const result = await this.supportConversationsService.findAll(
      page,
      limit,
      offset,
    );

    return spongRes.SpongOK({
      success: true,
      data: {
        conversations: result.conversations,
        pagination: buildPagination(result.total, page, limit),
      },
    });
  };

  readonly findMe: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;

    const result = await this.supportConversationsService.findMe(userId);

    return spongRes.SpongOK({
      success: true,
      data: result.conversations,
    });
  };

  readonly findOne: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;
    const { conversationId } = spongReq.params;

    if (!conversationId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Support conversation ID is required.',
      });
    }
    const result = await this.supportConversationsService.findOne(
      userId,
      conversationId,
    );

    if ('error' in result) {
      return spongRes.SpongNotFound({
        success: false,
        message: result.message,
      });
    }
    return spongRes.SpongOK({
      success: true,
      data: result.conversation,
    });
  };

  readonly toggle: SpongHandler = async (spongReq, spongRes) => {
    const adminId = spongReq.user!.id;
    const { conversationId } = spongReq.params;

    if (!conversationId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Support conversation ID is required.',
      });
    }

    const result = await this.supportConversationsService.toggle(
      adminId,
      conversationId,
    );

    if ('error' in result) {
      return spongRes.SpongNotFound({
        success: false,
        message: result.message,
      });
    }

    return spongRes.SpongOK({
      success: true,
      message: result.message,
      data: result.data,
    });
  };
}
