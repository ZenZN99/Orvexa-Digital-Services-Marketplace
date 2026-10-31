import type { SpongHandler } from "riser-bob";
import { getPagination } from "../../utilities/pagination";
import type { ReviewsService } from "./reviews.service";

export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  readonly create: SpongHandler = async (spongReq, spongRes) => {
    const clientId = spongReq.user!.id;
    const { contractId } = spongReq.params;

    if (!contractId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: "Contract ID is required",
      });
    }

    const body = await spongReq.json<{
      rating: number;
      comment: string | null;
    }>();

    const result = await this.reviewsService.create(clientId, contractId, body);

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

  readonly findMe: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;
    const { page, limit, offset } = getPagination(spongReq);

    const result = await this.reviewsService.findMe(
      userId,
      page,
      limit,
      offset,
    );

    if ("error" in result) {
      return spongRes.SpongNotFound({
        success: false,
        message: result.message,
      });
    }

    return spongRes.SpongOK(result);
  };

  readonly findByFreelancer: SpongHandler = async (spongReq, spongRes) => {
    const { userId } = spongReq.params;
    const { page, limit, offset } = getPagination(spongReq);

    if (!userId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await this.reviewsService.findByFreelancer(
      userId,
      page,
      limit,
      offset,
    );

    if ("error" in result) {
      return spongRes.SpongNotFound({
        success: false,
        message: result.message,
      });
    }

    return spongRes.SpongOK(result);
  };

  readonly findAllByService: SpongHandler = async (spongReq, spongRes) => {
    const { serviceId } = spongReq.params;
    const { page, limit, offset } = getPagination(spongReq);

    if (!serviceId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: "Service ID is required",
      });
    }

    const result = await this.reviewsService.findAllByService(
      serviceId,
      page,
      limit,
      offset,
    );

    return spongRes.SpongOK(result);
  };

  readonly findOne: SpongHandler = async (spongReq, spongRes) => {
    const { reviewId } = spongReq.params;

    if (!reviewId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: "Review ID is required",
      });
    }

    const result = await this.reviewsService.findOne(reviewId);

    if ("error" in result) {
      return spongRes.SpongNotFound({
        success: false,
        message: result.message,
      });
    }

    // Return the review.
    return spongRes.SpongOK(result.review);
  };
}
