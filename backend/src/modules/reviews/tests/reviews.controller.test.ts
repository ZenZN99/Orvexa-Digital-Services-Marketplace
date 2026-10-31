import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';
import type { SpongHandler } from 'riser-bob';
import { getPagination } from '../../../utilities/pagination';
import type { AuthenticationUser } from '../../users/schemas/user.schema';
import { ReviewsController } from '../reviews.controller';
import type { ReviewsService } from '../reviews.service';

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];

interface ErrorResult {
  error: true;
  statusCode: number;
  message: string;
}

interface NotFoundResult {
  error: true;
  message: string;
}

type ListResult =
  | NotFoundResult
  | { result: unknown }
  | { cachedReviews: unknown };

interface FakeReviewsService {
  create: Mock<
    (
      clientId: string,
      contractId: string,
      body: { rating: number; comment: string | null },
    ) => Promise<
      ErrorResult | { success: true; message: string; data: unknown }
    >
  >;
  findMe: Mock<
    (
      userId: string,
      page?: number,
      limit?: number,
      offset?: number,
    ) => Promise<ListResult>
  >;
  findByFreelancer: Mock<
    (
      userId: string,
      page?: number,
      limit?: number,
      offset?: number,
    ) => Promise<ListResult>
  >;
  findAllByService: Mock<
    (
      serviceId: string,
      page?: number,
      limit?: number,
      offset?: number,
    ) => Promise<{ result: unknown } | { cachedReviews: unknown }>
  >;
  findOne: Mock<
    (
      reviewId: string,
    ) => Promise<
      NotFoundResult | { review: unknown } | { cachedReview: unknown }
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

const currentUser = { id: 'user-1' } as unknown as AuthenticationUser;

const makeReq = (
  options: {
    params?: Record<string, string>;
    query?: URLSearchParams;
    body?: unknown;
  } = {},
) => {
  const json = mock(async (): Promise<unknown> => options.body);

  const req = {
    user: currentUser,
    params: options.params ?? {},
    query: options.query ?? new URLSearchParams(),
    json,
  } as unknown as SpongReq;

  return { req, json };
};

const tagged = (type: string) =>
  mock((payload: unknown): Tagged => ({ type, payload }));

// Handlers are typed as returning `void | Response`; in these tests they return the
// tagged objects produced by the fake SpongRes.
const asTagged = (result: unknown): Tagged => result as Tagged;

const badRequest = (message: string) => ({
  type: 'bad-request',
  payload: { success: false, message },
});

const notFound = (message: string) => ({
  type: 'not-found',
  payload: { success: false, message },
});

// ───────────────────────── tests ─────────────────────────

describe('ReviewsController', () => {
  let reviewsService: FakeReviewsService;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: ReviewsController;

  beforeEach(() => {
    reviewsService = {
      create: mock(
        async (
          _clientId: string,
          _contractId: string,
          _body: { rating: number; comment: string | null },
        ): Promise<
          ErrorResult | { success: true; message: string; data: unknown }
        > => ({ success: true, message: 'created', data: null }),
      ),
      findMe: mock(
        async (
          _userId: string,
          _page?: number,
          _limit?: number,
          _offset?: number,
        ): Promise<ListResult> => ({ result: {} }),
      ),
      findByFreelancer: mock(
        async (
          _userId: string,
          _page?: number,
          _limit?: number,
          _offset?: number,
        ): Promise<ListResult> => ({ result: {} }),
      ),
      findAllByService: mock(
        async (
          _serviceId: string,
          _page?: number,
          _limit?: number,
          _offset?: number,
        ): Promise<{ result: unknown } | { cachedReviews: unknown }> => ({
          result: {},
        }),
      ),
      findOne: mock(
        async (
          _reviewId: string,
        ): Promise<
          NotFoundResult | { review: unknown } | { cachedReview: unknown }
        > => ({ review: null }),
      ),
    };

    spongRes = {
      SpongOK: tagged('ok'),
      SpongCreated: tagged('created'),
      SpongBadRequest: tagged('bad-request'),
      SpongNotFound: tagged('not-found'),
    };
    res = spongRes as unknown as SpongRes;

    controller = new ReviewsController(
      reviewsService as unknown as ReviewsService,
    );
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    const body = { rating: 5, comment: 'Great work' };

    it('returns 400 when the contract id is missing', async () => {
      const { req, json } = makeReq({ body });

      const result = await controller.create(req, res);

      expect(asTagged(result)).toEqual(badRequest('Contract ID is required'));
      expect(json).not.toHaveBeenCalled();
      expect(reviewsService.create).not.toHaveBeenCalled();
    });

    it('passes the client, the contract and the parsed body to the service', async () => {
      const { req, json } = makeReq({
        params: { contractId: 'contract-1' },
        body,
      });

      await controller.create(req, res);

      expect(json).toHaveBeenCalledTimes(1);
      expect(reviewsService.create).toHaveBeenCalledWith(
        currentUser.id,
        'contract-1',
        body,
      );
    });

    it('returns 404 when the service answers with statusCode 404', async () => {
      reviewsService.create.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'Contract not found',
      });

      const result = await controller.create(
        makeReq({ params: { contractId: 'contract-1' }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual(notFound('Contract not found'));
    });

    it('returns 400 for any other service error', async () => {
      reviewsService.create.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Only completed contracts can be reviewed',
      });

      const result = await controller.create(
        makeReq({ params: { contractId: 'contract-1' }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual(
        badRequest('Only completed contracts can be reviewed'),
      );
    });

    it('returns 201 with the created review', async () => {
      const data = { id: 'review-1' };
      reviewsService.create.mockResolvedValue({
        success: true,
        message: 'Review created successfully',
        data,
      });

      const result = await controller.create(
        makeReq({ params: { contractId: 'contract-1' }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'created',
        payload: {
          success: true,
          message: 'Review created successfully',
          data,
        },
      });
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it('passes the request pagination to the service', async () => {
      const { req } = makeReq({
        query: new URLSearchParams({
          page: '2',
          limit: '5',
        }),
      });

      await controller.findMe(req, res);

      expect(reviewsService.findMe).toHaveBeenCalledWith(
        currentUser.id,
        2,
        5,
        5,
      );
    });

    it('returns 404 when the service reports an error', async () => {
      reviewsService.findMe.mockResolvedValue({
        error: true,
        message: 'Freelancer not found',
      });

      const result = await controller.findMe(makeReq().req, res);

      expect(asTagged(result)).toEqual(notFound('Freelancer not found'));
    });

    it('returns the service result as it is', async () => {
      const serviceResult = {
        result: { success: true, data: [{ id: 'review-1' }] },
      };

      reviewsService.findMe.mockResolvedValue(serviceResult);

      const result = await controller.findMe(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: serviceResult,
      });
    });
  });
  // ───────────────────────── findByFreelancer ─────────────────────────
  describe('findByFreelancer', () => {
    it('returns 400 when the user id is missing', async () => {
      const result = await controller.findByFreelancer(makeReq().req, res);

      expect(asTagged(result)).toEqual(badRequest('User ID is required'));
      expect(reviewsService.findByFreelancer).not.toHaveBeenCalled();
    });

    it('passes the user id and the request pagination to the service', async () => {
      const { req } = makeReq({
        params: { userId: 'freelancer-user-1' },
        query: new URLSearchParams({
          page: '2',
          limit: '5',
        }),
      });

      await controller.findByFreelancer(req, res);

      expect(reviewsService.findByFreelancer).toHaveBeenCalledWith(
        'freelancer-user-1',
        2,
        5,
        5,
      );
    });

    it('returns 404 when the service reports an error', async () => {
      reviewsService.findByFreelancer.mockResolvedValue({
        error: true,
        message: 'Freelancer not found',
      });

      const result = await controller.findByFreelancer(
        makeReq({ params: { userId: 'freelancer-user-1' } }).req,
        res,
      );

      expect(asTagged(result)).toEqual(notFound('Freelancer not found'));
    });

    it('returns the service result as it is', async () => {
      const serviceResult = { cachedReviews: { success: true, data: [] } };

      reviewsService.findByFreelancer.mockResolvedValue(serviceResult);

      const result = await controller.findByFreelancer(
        makeReq({ params: { userId: 'freelancer-user-1' } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: serviceResult,
      });
    });
  });

  // ───────────────────────── findAllByService ─────────────────────────
  describe('findAllByService', () => {
    it('returns 400 when the service id is missing', async () => {
      const result = await controller.findAllByService(makeReq().req, res);

      expect(asTagged(result)).toEqual(badRequest('Service ID is required'));
      expect(reviewsService.findAllByService).not.toHaveBeenCalled();
    });

    it('passes the service id and the request pagination to the service', async () => {
      const { req } = makeReq({
        params: { serviceId: 'service-1' },
        query: new URLSearchParams({
          page: '2',
          limit: '5',
        }),
      });

      await controller.findAllByService(req, res);

      expect(reviewsService.findAllByService).toHaveBeenCalledWith(
        'service-1',
        2,
        5,
        5,
      );
    });

    it('returns the service result as it is', async () => {
      const serviceResult = { result: { success: true, data: [] } };
      reviewsService.findAllByService.mockResolvedValue(serviceResult);

      const result = await controller.findAllByService(
        makeReq({ params: { serviceId: 'service-1' } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: serviceResult,
      });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('returns 400 when the review id is missing', async () => {
      const result = await controller.findOne(makeReq().req, res);

      expect(asTagged(result)).toEqual(badRequest('Review ID is required'));
      expect(reviewsService.findOne).not.toHaveBeenCalled();
    });

    it('returns 404 when the service reports an error', async () => {
      reviewsService.findOne.mockResolvedValue({
        error: true,
        message: 'Review not found',
      });

      const result = await controller.findOne(
        makeReq({ params: { reviewId: 'review-1' } }).req,
        res,
      );

      expect(reviewsService.findOne).toHaveBeenCalledWith('review-1');
      expect(asTagged(result)).toEqual(notFound('Review not found'));
    });

    it('returns the review itself on success', async () => {
      const review = { id: 'review-1', rating: 5 };
      reviewsService.findOne.mockResolvedValue({ review });

      const result = await controller.findOne(
        makeReq({ params: { reviewId: 'review-1' } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({ type: 'ok', payload: review });
    });

    it.todo(
      'returns the cached review too (a cache hit answers { cachedReview }, so result.review is undefined today)',
    );
  });
});
