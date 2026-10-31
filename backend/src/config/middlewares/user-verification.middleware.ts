import type { SpongRequest, SpongResponse } from "riser-bob";
import type { UserVerificationSchema } from "../../modules/user-verifications/schemas/user-verification.schema";
import { UserVerificationStatus } from "../../modules/user-verifications/schemas/enums/user-verification.enum";

export class UserVerificationMiddleware {
  constructor(
    private readonly userVerificationSchema: typeof UserVerificationSchema,
  ) {}

  readonly middleware = async (
    spongReq: SpongRequest,
    spongRes: SpongResponse,
    spongNext: () => Promise<Response>,
  ): Promise<Response> => {
    if (!spongReq.user) {
      return spongRes.SpongUnauthorized({
        success: false,
        message: "You are not authenticated",
      });
    }

    const verification = await this.userVerificationSchema.findOne({
      where: {
        userId: spongReq.user.id,
        status: UserVerificationStatus.APPROVED,
      },
    });

    if (!verification) {
      return spongRes.SpongForbidden({
        success: false,
        message: "User verification is required",
      });
    }

    return spongNext();
  };
}
