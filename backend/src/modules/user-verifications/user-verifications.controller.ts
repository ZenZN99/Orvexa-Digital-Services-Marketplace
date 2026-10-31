import { type SpongHandler } from 'riser-bob';
import { UserVerificationStatus } from './schemas/enums/user-verification.enum';
import { buildPagination, getPagination } from '../../utilities/pagination';
import type { UserVerificationsService } from './user-verifications.service';

export class UserVerificationsController {
  constructor(
    private readonly userVerificationsService: UserVerificationsService,
  ) {}

  readonly create: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;

    const formData = await spongReq.formData();

    const result = await this.userVerificationsService.create(userId, formData);

    if ('error' in result) {
      return spongRes.SpongBadRequest({
        success: false,
        message: result.message,
      });
    }

    if (result.type === 'resubmitted') {
      return spongRes.SpongOK({
        success: true,
        message: 'Verification request resubmitted successfully',
        data: result.data,
      });
    }

    return spongRes.SpongCreated({
      success: true,
      message: 'Verification request submitted successfully.',
      data: result.data,
    });
  };

  readonly findPending: SpongHandler = async (spongReq, spongRes) => {
    const { page, limit, offset } = getPagination(spongReq);

    const result = await this.userVerificationsService.findPending(
      page,
      limit,
      offset,
    );

    return spongRes.SpongOK({
      success: true,
      data: {
        verifications: result.verifications,
        pagination: buildPagination(result.total, page, limit),
      },
    });
  };

  readonly tryAgain: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;

    const result = await this.userVerificationsService.tryAgain(userId);

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

    return spongRes.SpongOK({
      success: true,
      data: result.data,
    });
  };

  readonly update: SpongHandler = async (spongReq, spongRes) => {
    const adminId = spongReq.user!.id;
    const { verificationId } = spongReq.params;

    if (!verificationId) {
      return spongRes.SpongNotFound({
        success: false,
        message: 'Verification ID is required',
      });
    }

    const body = await spongReq.json<{
      status: UserVerificationStatus | null;
      rejectionReason: string | null;
    }>();

    const result = await this.userVerificationsService.update(
      adminId,
      verificationId,
      body,
    );

    if ('error' in result) {
      const response = {
        success: false,
        message: result.message,
        ...('errors' in result ? { errors: result.errors } : {}),
      };

      if (result.statusCode === 404) {
        return spongRes.SpongNotFound(response);
      }

      if (result.statusCode === 422) {
        return spongRes.SpongUnprocessableContent(response);
      }

      return spongRes.SpongBadRequest(response);
    }

    return spongRes.SpongOK({
      success: true,
      message: 'Verification request reviewed successfully.',
      data: result.data,
    });
  };
}
