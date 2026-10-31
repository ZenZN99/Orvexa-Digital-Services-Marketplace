import { Validator, type SpongHandler } from "riser-bob";
import type { FreelancerSchema } from "./schemas/freelancer.schema";
import type { JobTitle, Skills } from "./schemas/enums/freelancers.enum";
import { UpdateFreelancerRule } from "./rules/update.rule";

export class FreelancersController {
  constructor(private readonly freelancerSchema: typeof FreelancerSchema) {}
  readonly findMe: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user?.id;

    const freelancer = await this.freelancerSchema.findOne({
      where: { userId },
    });

    if (!freelancer) {
      return spongRes.SpongNotFound({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    return spongRes.SpongOK({
      success: true,
      data: freelancer,
    });
  };

  readonly findOne: SpongHandler = async (spongReq, spongRes) => {
    const { id } = spongReq.params;

    const freelancer = await this.freelancerSchema.findOne({
      where: { userId: id },
    });

    if (!freelancer) {
      return spongRes.SpongNotFound({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    return spongRes.SpongOK({
      success: true,
      data: freelancer,
    });
  };

  readonly update: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user?.id;

    const freelancer = await this.freelancerSchema.findOne({
      where: { userId },
    });

    if (!freelancer) {
      return spongRes.SpongNotFound({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    const body = await spongReq.json<{
      jobTitle?: JobTitle;
      about?: string;
      skills?: Skills[];
      website?: string;
    }>();

    const validation = Validator.validate(body, UpdateFreelancerRule);

    if (!validation.valid) {
      return spongRes.SpongUnprocessableContent({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const data = validation.data as FreelancerSchema;

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );

    await freelancer.update(updateData);

    return spongRes.SpongOK({
      success: true,
      message: "Freelancer profile updated successfully",
      data: freelancer,
    });
  };
}
