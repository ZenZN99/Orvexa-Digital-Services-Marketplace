import { describe, expect, it, mock, spyOn } from 'bun:test';
import { ReviewsService } from '../reviews.service';
import { ContractStatus } from '../../contracts/schemas/enums/contract.enum';

type Deps = ConstructorParameters<typeof ReviewsService>;

const makeTransaction = () => ({
  LOCK: { UPDATE: 'UPDATE' },
  commit: mock(async () => undefined),
  rollback: mock(async () => undefined),
});

const makeRedis = () => {
  const store = new Map<string, unknown>();

  return {
    store,
    getJSON: mock(async (key: string) => store.get(key) ?? null),
    set: mock(async (key: string, value: unknown) => {
      store.set(key, value);
    }),
  };
};

const buildService = (options: {
  contract?: Record<string, unknown> | null;
  notificationFails?: boolean;
}) => {
  const transaction = makeTransaction();
  const redis = makeRedis();

  const contract =
    options.contract === undefined
      ? {
          id: 'c1',
          orderId: 'o1',
          serviceId: 's1',
          freelancerId: 'f1',
          status: ContractStatus.COMPLETED,
        }
      : options.contract;

  const reviewSchema = {
    findOne: mock(async () => null),
    create: mock(async () => ({ id: 'r1', serviceId: 's1' })),
    findAll: mock(async () => [{ rating: 5 }]),
    findAndCountAll: mock(async () => ({ rows: [{ id: 'r1' }], count: 1 })),
    findByPk: mock(async () => ({ id: 'r1' })),
  };

  const notificationsService = {
    create: mock(async () => {
      if (options.notificationFails) {
        throw new Error('notification down');
      }
    }),
  };

  const service = new ReviewsService(
    reviewSchema as unknown as Deps[0],
    { findOne: mock(async () => contract) } as unknown as Deps[1],
    {
      findByPk: mock(async () => ({ id: 'u1', firstName: 'A', lastName: 'B' })),
    } as unknown as Deps[2],
    { findOne: mock(async () => ({ id: 'p1' })) } as unknown as Deps[3],
    { update: mock(async () => [1]) } as unknown as Deps[4],
    {
      findByPk: mock(async () => ({ id: 'f1', userId: 'u2' })),
      findOne: mock(async () => ({ id: 'f1' })),
      update: mock(async () => [1]),
    } as unknown as Deps[5],
    notificationsService as unknown as Deps[6],
    redis as unknown as Deps[7],
    { transaction: mock(async () => transaction) } as unknown as Deps[8],
  );

  return { service, transaction, redis, reviewSchema, notificationsService };
};

const validBody = { rating: 5, comment: 'Great service, thank you!' };

describe('ReviewsService.create', () => {
  it('rolls back when the contract is not found', async () => {
    const { service, transaction } = buildService({ contract: null });

    const result = await service.create('u1', 'c1', validBody);

    expect(result).toMatchObject({ error: true, statusCode: 404 });
    expect(transaction.rollback).toHaveBeenCalledTimes(1);
    expect(transaction.commit).not.toHaveBeenCalled();
  });

  it('returns 422 and rolls back on validation failure', async () => {
    const { service, transaction, reviewSchema } = buildService({});

    const result = await service.create('u1', 'c1', {
      rating: 9,
      comment: 'short',
    });

    expect(result).toMatchObject({ error: true, statusCode: 422 });
    expect(transaction.rollback).toHaveBeenCalledTimes(1);
    expect(reviewSchema.create).not.toHaveBeenCalled();
  });

  it('commits, invalidates caches and notifies on success', async () => {
    const { service, transaction, redis, notificationsService } = buildService(
      {},
    );

    const result = await service.create('u1', 'c1', validBody);

    expect(result).toMatchObject({ success: true });
    expect(transaction.commit).toHaveBeenCalledTimes(1);
    expect(transaction.rollback).not.toHaveBeenCalled();
    expect(redis.store.has('reviews:version:service:s1')).toBe(true);
    expect(redis.store.has('reviews:version:freelancer:f1')).toBe(true);
    expect(notificationsService.create).toHaveBeenCalledTimes(1);
  });

  it('does not roll back or throw when the notification fails after commit', async () => {
    const errorSpy = spyOn(console, 'error').mockImplementation(() => {});

    try {
      const { service, transaction, notificationsService } = buildService({
        notificationFails: true,
      });

      const result = await service.create('u1', 'c1', validBody);

      expect(result).toMatchObject({ success: true });
      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();

      expect(notificationsService.create).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        'Failed to create review notification:',
        expect.any(Error),
      );
    } finally {
      errorSpy.mockRestore();
    }
  });
});

describe('ReviewsService read shapes', () => {
  it('findAllByService returns the same shape on miss and on cache hit', async () => {
    const { service, reviewSchema } = buildService({});

    const miss = await service.findAllByService('s1', 1, 10, 0);
    const hit = await service.findAllByService('s1', 1, 10, 0);

    expect(reviewSchema.findAndCountAll).toHaveBeenCalledTimes(1);
    expect(Object.keys(miss).sort()).toEqual(Object.keys(hit).sort());
    expect(JSON.stringify(hit)).toBe(JSON.stringify(miss));
  });

  it('findMe returns { success, data: { reviews, pagination } }', async () => {
    const { service } = buildService({});

    const result = await service.findMe('u2', 1, 10, 0);

    if ('error' in result) {
      throw new Error('unexpected error result');
    }

    expect(result.success).toBe(true);
    expect(Array.isArray(result.data.reviews)).toBe(true);
    expect(result.data.pagination).toBeDefined();
  });

  it('findOne exposes `review` on both DB and cache paths', async () => {
    const { service, reviewSchema } = buildService({});

    const miss = await service.findOne('r1');
    const hit = await service.findOne('r1');

    expect(reviewSchema.findByPk).toHaveBeenCalledTimes(1);
    expect('review' in miss).toBe(true);
    expect('review' in hit).toBe(true);
  });
});
