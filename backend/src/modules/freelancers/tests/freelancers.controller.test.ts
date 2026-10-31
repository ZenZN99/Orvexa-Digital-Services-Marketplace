import { afterEach, beforeEach, describe, expect, it, mock, spyOn, type Mock } from "bun:test";
import { Validator, type SpongHandler } from "riser-bob";
import { FreelancersController } from "../freelancers.controller";
import { JobTitle } from "../schemas/enums/freelancers.enum";
import type { FreelancerSchema } from "../schemas/freelancer.schema";
import { UpdateFreelancerRule } from "../rules/update.rule";

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];
type ValidationResult = ReturnType<typeof Validator.validate>;

interface FakeFreelancer {
  id: string;
  userId: string;
  update: Mock<(data: Record<string, unknown>) => Promise<void>>;
}

interface FakeFreelancerSchema {
  findOne: Mock<(options: unknown) => Promise<FakeFreelancer | null>>;
}

interface Tagged {
  type: string;
  payload: unknown;
}

interface FakeSpongRes {
  SpongOK: Mock<(payload: unknown) => Tagged>;
  SpongNotFound: Mock<(payload: unknown) => Tagged>;
  SpongUnprocessableContent: Mock<(payload: unknown) => Tagged>;
}

// ───────────────────────── helpers ─────────────────────────

const userId = "user-1";

const makeFreelancer = (): FakeFreelancer => ({
  id: "freelancer-1",
  userId,
  update: mock(async (_data: Record<string, unknown>): Promise<void> => {}),
});

const makeReq = (
  options: { params?: { id?: string }; body?: unknown } = {},
) => {
  const json = mock(async (): Promise<unknown> => options.body);
  const req = {
    user: { id: userId },
    params: options.params ?? {},
    json,
  } as unknown as SpongReq;

  return { req, json };
};

const tagged = (type: string) =>
  mock((payload: unknown): Tagged => ({ type, payload }));

const asValidation = (result: {
  valid: boolean;
  data?: unknown;
  errors?: unknown;
}): ValidationResult => result as unknown as ValidationResult;

// Handlers are typed as returning `void | Response`; in these tests they return the
// tagged objects produced by the fake SpongRes.
const asTagged = (result: unknown): Tagged => result as Tagged;

const notFoundPayload = {
  success: false,
  message: "Freelancer profile not found",
};

// ───────────────────────── tests ─────────────────────────

describe("FreelancersController", () => {
  let freelancerSchema: FakeFreelancerSchema;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: FreelancersController;
  let validateSpy: Mock<typeof Validator.validate>;

  beforeEach(() => {
    freelancerSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeFreelancer | null> => null,
      ),
    };
    spongRes = {
      SpongOK: tagged("ok"),
      SpongNotFound: tagged("not-found"),
      SpongUnprocessableContent: tagged("unprocessable"),
    };
    res = spongRes as unknown as SpongRes;

    validateSpy = spyOn(Validator, "validate");

    controller = new FreelancersController(
      freelancerSchema as unknown as typeof FreelancerSchema,
    );
  });

  afterEach(() => {
    validateSpy.mockRestore();
  });

  // ───────────────────────── findMe ─────────────────────────
  describe("findMe", () => {
    it("returns 404 when the user has no freelancer profile", async () => {
      const result = await controller.findMe(makeReq().req, res);

      expect(freelancerSchema.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: notFoundPayload,
      });
    });

    it("returns the current user's freelancer profile", async () => {
      const freelancer = makeFreelancer();
      freelancerSchema.findOne.mockResolvedValue(freelancer);

      const result = await controller.findMe(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: "ok",
        payload: { success: true, data: freelancer },
      });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe("findOne", () => {
    it("returns 404 when the profile doesn't exist", async () => {
      const result = await controller.findOne(
        makeReq({ params: { id: "other-user" } }).req,
        res,
      );

      expect(freelancerSchema.findOne).toHaveBeenCalledWith({
        where: { userId: "other-user" },
      });
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: notFoundPayload,
      });
    });

    it("returns the profile looked up by the user id param", async () => {
      const freelancer = makeFreelancer();
      freelancerSchema.findOne.mockResolvedValue(freelancer);

      const result = await controller.findOne(
        makeReq({ params: { id: "other-user" } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: "ok",
        payload: { success: true, data: freelancer },
      });
    });
  });

  // ───────────────────────── update ─────────────────────────
  describe("update", () => {
    const body = {
      jobTitle: JobTitle.NO_JOB_TITLE,
      about: "Backend engineer",
      skills: [],
      website: "https://zenallaham.com",
    };

    it("returns 404 without reading the body when the profile doesn't exist", async () => {
      const { req, json } = makeReq({ body });

      const result = await controller.update(req, res);

      expect(freelancerSchema.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(json).not.toHaveBeenCalled();
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: notFoundPayload,
      });
    });

    it("returns 422 with the validation errors", async () => {
      const errors = { jobTitle: ["Invalid job title"] };
      freelancerSchema.findOne.mockResolvedValue(makeFreelancer());
      validateSpy.mockReturnValue(asValidation({ valid: false, errors }));

      const result = await controller.update(makeReq({ body }).req, res);

      expect(validateSpy).toHaveBeenCalledWith(body, UpdateFreelancerRule);
      expect(asTagged(result)).toEqual({
        type: "unprocessable",
        payload: { success: false, message: "Validation failed", errors },
      });
    });

    it("updates the profile with the validated fields only (undefined ones are dropped)", async () => {
      const freelancer = makeFreelancer();
      freelancerSchema.findOne.mockResolvedValue(freelancer);
      validateSpy.mockReturnValue(
        asValidation({
          valid: true,
          data: {
            jobTitle: JobTitle.NO_JOB_TITLE,
            about: undefined,
            skills: [],
            website: "https://zenallaham.com",
          },
        }),
      );

      const result = await controller.update(makeReq({ body }).req, res);

      expect(freelancer.update).toHaveBeenCalledTimes(1);
      const payload = freelancer.update.mock.calls[0]?.[0] ?? {};
      expect(Object.keys(payload).sort()).toEqual([
        "jobTitle",
        "skills",
        "website",
      ]);
      expect(spongRes.SpongOK).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Freelancer profile updated successfully",
          data: freelancer,
        }),
      );
      expect(asTagged(result).type).toBe("ok");
    });

    it.todo("responds with success: true after a successful update");
  });
});