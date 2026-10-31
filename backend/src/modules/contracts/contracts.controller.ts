import type { SpongHandler } from 'riser-bob';
import { getPagination } from '../../utilities/pagination';
import type { ContractsService } from './contracts.service';

export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}
  readonly findMe: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;

    const result = await this.contractsService.findMe(userId);

    return spongRes.SpongOK({
      success: result.success,
      data: result.data,
    });
  };

  readonly findAll: SpongHandler = async (spongReq, spongRes) => {
    const { page, limit, offset } = getPagination(spongReq);

    const result = await this.contractsService.findAll(page, limit, offset);

    return spongRes.SpongOK({
      success: result.success,
      data: {
        contracts: result.data,
        pagination: result.pagination,
      },
    });
  };

  readonly findOne: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;
    const { contractId } = spongReq.params;

    if (!contractId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Contract ID is required',
      });
    }

    const result = await this.contractsService.findOne(userId, contractId);

    if ('error' in result) {
      return spongRes.SpongNotFound({
        success: false,
        message: result.message,
      });
    }

    return spongRes.SpongOK({
      success: result.success,
      data: result.data,
    });
  };

  readonly expire: SpongHandler = async (spongReq, spongRes) => {
    const { contractId } = spongReq.params;

    if (!contractId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Contract ID is required',
      });
    }

    const contract = await this.contractsService.expireContract(contractId);

    return spongRes.SpongOK({
      success: true,
      message: 'Contract expired successfully',
      data: contract,
    });
  };

  readonly complete: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;
    const { contractId } = spongReq.params;

    if (!contractId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Contract ID is required',
      });
    }

    const result = await this.contractsService.complete(userId, contractId);

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
      success: result.success,
      message: result.message,
      data: result.data,
    });
  };

  readonly deliver: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;
    const { contractId } = spongReq.params;

    if (!contractId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Contract ID is required',
      });
    }

    const result = await this.contractsService.deliver(userId, contractId);

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
      success: result.success,
      message: result.message,
      data: result.data,
    });
  };
}
