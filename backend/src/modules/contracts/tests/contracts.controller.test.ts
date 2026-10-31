import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';
import type { SpongHandler } from 'riser-bob';
import { getPagination } from '../../../utilities/pagination';
import { ContractsController } from '../contracts.controller';
import type { ContractsService } from '../contracts.service';

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];

interface ServiceError {
  error: true;
  statusCode: number;
  message: string;
}

interface ActionSuccess {
  success: true;
  message: string;
  data: unknown;
}

interface FakeContractsService {
  findMe: Mock<
    (userId: string) => Promise<{ success: boolean; data: unknown }>
  >;
  findAll: Mock<
    (
      page: number,
      limit: number,
      offset: number,
    ) => Promise<{ success: boolean; data: unknown; pagination: unknown }>
  >;
  findOne: Mock<
    (
      userId: string,
      contractId: string,
    ) => Promise<
      { error: true; message: string } | { success: true; data: unknown }
    >
  >;
  expireContract: Mock<(contractId: string) => Promise<unknown>>;
  complete: Mock<
    (
      userId: string,
      contractId: string,
    ) => Promise<ServiceError | ActionSuccess>
  >;
  deliver: Mock<
    (
      userId: string,
      contractId: string,
    ) => Promise<ServiceError | ActionSuccess>
  >;
}

interface Tagged {
  type: string;
  payload: unknown;
}

interface FakeSpongRes {
  SpongOK: Mock<(payload: unknown) => Tagged>;
  SpongBadRequest: Mock<(payload: unknown) => Tagged>;
  SpongNotFound: Mock<(payload: unknown) => Tagged>;
}

// ───────────────────────── helpers ─────────────────────────

const userId = 'user-1';
const contractId = 'contract-1';

const makeReq = (
  options: {
    params?: { contractId?: string };
    query?: URLSearchParams;
  } = {},
): SpongReq =>
  ({
    user: { id: userId },
    params: options.params ?? {},
    query: options.query ?? new URLSearchParams(),
  }) as unknown as SpongReq;

const tagged = (type: string) =>
  mock((payload: unknown): Tagged => ({ type, payload }));

// Handlers are typed as returning `void | Response`; in these tests they return the
// tagged objects produced by the fake SpongRes.
const asTagged = (result: unknown): Tagged => result as Tagged;

const missingIdPayload = {
  success: false,
  message: 'Contract ID is required',
};

// ───────────────────────── tests ─────────────────────────

describe('ContractsController', () => {
  let contractsService: FakeContractsService;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: ContractsController;

  beforeEach(() => {
    contractsService = {
      findMe: mock(
        async (
          _userId: string,
        ): Promise<{ success: boolean; data: unknown }> => ({
          success: true,
          data: [],
        }),
      ),
      findAll: mock(
        async (
          _page: number,
          _limit: number,
          _offset: number,
        ): Promise<{
          success: boolean;
          data: unknown;
          pagination: unknown;
        }> => ({
          success: true,
          data: [],
          pagination: {},
        }),
      ),
      findOne: mock(
        async (
          _userId: string,
          _contractId: string,
        ): Promise<
          { error: true; message: string } | { success: true; data: unknown }
        > => ({ success: true, data: null }),
      ),
      expireContract: mock(
        async (_contractId: string): Promise<unknown> => null,
      ),
      complete: mock(
        async (
          _userId: string,
          _contractId: string,
        ): Promise<ServiceError | ActionSuccess> => ({
          success: true,
          message: 'done',
          data: null,
        }),
      ),
      deliver: mock(
        async (
          _userId: string,
          _contractId: string,
        ): Promise<ServiceError | ActionSuccess> => ({
          success: true,
          message: 'done',
          data: null,
        }),
      ),
    };

    spongRes = {
      SpongOK: tagged('ok'),
      SpongBadRequest: tagged('bad-request'),
      SpongNotFound: tagged('not-found'),
    };
    res = spongRes as unknown as SpongRes;

    controller = new ContractsController(
      contractsService as unknown as ContractsService,
    );
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it("returns the current user's contracts", async () => {
      const data = [{ id: 'c1' }];
      contractsService.findMe.mockResolvedValue({ success: true, data });

      const result = await controller.findMe(makeReq(), res);

      expect(contractsService.findMe).toHaveBeenCalledWith(userId);
      expect(spongRes.SpongOK).toHaveBeenCalledWith({ success: true, data });
      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('passes the request pagination to the service and returns it with the contracts', async () => {
      const req = makeReq({
        query: new URLSearchParams({
          page: '2',
          limit: '20',
        }),
      });

      const data = [{ id: 'c1' }];
      const pagination = {
        total: 1,
        page: 2,
        limit: 20,
      };

      contractsService.findAll.mockResolvedValue({
        success: true,
        data,
        pagination,
      });

      const result = await controller.findAll(req, res);

      expect(contractsService.findAll).toHaveBeenCalledWith(2, 20, 20);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          data: {
            contracts: data,
            pagination,
          },
        },
      });
    });
  });
  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('returns 400 when the contract id is missing', async () => {
      const result = await controller.findOne(makeReq(), res);

      expect(spongRes.SpongBadRequest).toHaveBeenCalledWith(missingIdPayload);
      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: missingIdPayload,
      });
      expect(contractsService.findOne).not.toHaveBeenCalled();
    });

    it('returns 404 when the service reports an error', async () => {
      contractsService.findOne.mockResolvedValue({
        error: true,
        message: 'Contract not found',
      });

      const result = await controller.findOne(
        makeReq({ params: { contractId } }),
        res,
      );

      expect(contractsService.findOne).toHaveBeenCalledWith(userId, contractId);
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Contract not found' },
      });
    });

    it('returns the contract on success', async () => {
      const data = { id: contractId };
      contractsService.findOne.mockResolvedValue({ success: true, data });

      const result = await controller.findOne(
        makeReq({ params: { contractId } }),
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── expire ─────────────────────────
  describe('expire', () => {
    it('returns 400 when the contract id is missing', async () => {
      const result = await controller.expire(makeReq(), res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: missingIdPayload,
      });
      expect(contractsService.expireContract).not.toHaveBeenCalled();
    });

    it('expires the contract and returns it', async () => {
      const contract = { id: contractId, status: 'expired' };
      contractsService.expireContract.mockResolvedValue(contract);

      const result = await controller.expire(
        makeReq({ params: { contractId } }),
        res,
      );

      expect(contractsService.expireContract).toHaveBeenCalledWith(contractId);
      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          message: 'Contract expired successfully',
          data: contract,
        },
      });
    });
  });

  // ───────────────────────── complete / deliver ─────────────────────────
  // Both handlers share the same response mapping, so they're covered together.
  const actions = [
    { name: 'complete', call: 'complete' },
    { name: 'deliver', call: 'deliver' },
  ] as const;

  for (const { name, call } of actions) {
    describe(name, () => {
      it('returns 400 when the contract id is missing', async () => {
        const result = await controller[name](makeReq(), res);

        expect(asTagged(result)).toEqual({
          type: 'bad-request',
          payload: missingIdPayload,
        });
        expect(contractsService[call]).not.toHaveBeenCalled();
      });

      it('maps a 404 service error to SpongNotFound', async () => {
        contractsService[call].mockResolvedValue({
          error: true,
          statusCode: 404,
          message: 'Contract not found',
        });

        const result = await controller[name](
          makeReq({ params: { contractId } }),
          res,
        );

        expect(contractsService[call]).toHaveBeenCalledWith(userId, contractId);
        expect(asTagged(result)).toEqual({
          type: 'not-found',
          payload: { success: false, message: 'Contract not found' },
        });
      });

      it('maps any other service error to SpongBadRequest', async () => {
        contractsService[call].mockResolvedValue({
          error: true,
          statusCode: 400,
          message: 'Invalid state',
        });

        const result = await controller[name](
          makeReq({ params: { contractId } }),
          res,
        );

        expect(asTagged(result)).toEqual({
          type: 'bad-request',
          payload: { success: false, message: 'Invalid state' },
        });
        expect(spongRes.SpongNotFound).not.toHaveBeenCalled();
      });

      it('returns the service result on success', async () => {
        const data = { id: contractId };
        contractsService[call].mockResolvedValue({
          success: true,
          message: 'All good',
          data,
        });

        const result = await controller[name](
          makeReq({ params: { contractId } }),
          res,
        );

        expect(asTagged(result)).toEqual({
          type: 'ok',
          payload: { success: true, message: 'All good', data },
        });
      });
    });
  }
});
