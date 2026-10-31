import type { SpongRequest, SpongResponse } from "riser-bob";

export class UserActiveMiddleware {
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

    if (!spongReq.user.isActive) {
      return spongRes.SpongForbidden({
        success: false,
        message: "Your account is inactive",
      });
    }

    return spongNext();
  };
}
