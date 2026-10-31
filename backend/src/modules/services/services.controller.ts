import { type SpongHandler } from 'riser-bob';
import { ServiceStatus } from './schemas/enums/service.enum';
import { getPagination } from '../../utilities/pagination';
import type { ServicesService } from './services.service';
import type { AuthenticationUser } from '../users/schemas/user.schema';

export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  readonly create: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;
    const formData = await spongReq.formData();

    const result = await this.servicesService.create(userId, formData);

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
        ...('errors' in result ? { errors: result.errors } : {}),
      });
    }

    return spongRes.SpongCreated({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  };

  readonly findAll: SpongHandler = async (spongReq, spongRes) => {
    const { page, limit, offset } = getPagination(spongReq);

    const result = await this.servicesService.findAll(page, limit, offset);

    return spongRes.SpongOK({
      success: result.success,
      data: {
        services: result.data,
        pagination: result.pagination,
      },
    });
  };

  readonly findMe: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;

    const result = await this.servicesService.findMe(userId);

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

  readonly findByFreelancer: SpongHandler = async (spongReq, spongRes) => {
    const { userId } = spongReq.params;

    if (!userId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'User ID is required',
      });
    }

    const result = await this.servicesService.findByFreelancer(userId);

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

  readonly findOne: SpongHandler = async (spongReq, spongRes) => {
    const { serviceId } = spongReq.params;

    if (!serviceId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Service ID is required',
      });
    }

    const result = await this.servicesService.findOne(serviceId);

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

  readonly findPending: SpongHandler = async (spongReq, spongRes) => {
    const { page, limit, offset } = getPagination(spongReq);

    const result = await this.servicesService.findPending(page, limit, offset);

    return spongRes.SpongOK({
      success: result.success,
      data: {
        services: result.data,
        pagination: result.pagination,
      },
    });
  };

  readonly update: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;
    const { serviceId } = spongReq.params;

    if (!serviceId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Service ID is required',
      });
    }

    const formData = await spongReq.formData();

    const result = await this.servicesService.update(
      userId,
      serviceId,
      formData,
    );

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
        ...('errors' in result ? { errors: result.errors } : {}),
      });
    }

    return spongRes.SpongOK({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  };

  readonly updateStatus: SpongHandler = async (spongReq, spongRes) => {
    const adminId = spongReq.user!.id;
    const { serviceId } = spongReq.params;

    if (!serviceId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Service ID is required',
      });
    }

    const body = await spongReq.json<{
      status: ServiceStatus;
      reason: string;
    }>();

    const result = await this.servicesService.updateStatus(
      adminId,
      serviceId,
      body.status,
      body.reason,
    );

    if ('error' in result) {
      if (result.statusCode === 404) {
        return spongRes.SpongNotFound({
          success: false,
          message: result.message,
        });
      }

      if (result.statusCode === 422) {
        return spongRes.SpongUnprocessableContent({
          success: false,
          message: result.message,
          errors: result.errors,
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

  readonly delete: SpongHandler = async (spongReq, spongRes) => {
    const currentUser = spongReq.user;
    const { serviceId } = spongReq.params;

    if (!serviceId) {
      return spongRes.SpongBadRequest({
        success: false,
        message: 'Service ID is required',
      });
    }

    const result = await this.servicesService.delete(
      currentUser as AuthenticationUser,
      serviceId,
    );

    if ('error' in result) {
      if (result.statusCode === 404) {
        return spongRes.SpongNotFound({
          success: false,
          message: result.message,
        });
      }

      if (result.statusCode === 403) {
        return spongRes.SpongForbidden({
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
    });
  };
}
