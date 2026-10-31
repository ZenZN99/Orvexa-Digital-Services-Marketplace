import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';
import type { SpongHandler } from 'riser-bob';
import { getPagination } from '../../../utilities/pagination';
import type { AuthenticationUser } from '../../users/schemas/user.schema';
import { ServiceStatus } from '../schemas/enums/service.enum';
import { ServicesController } from '../services.controller';
import type { ServicesService } from '../services.service';

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];

interface ErrorResult {
  error: true;
  statusCode: number;
  message: string;
  errors?: unknown;
}

interface NotFoundResult {
  error: true;
  message: string;
}

interface PagedResult {
  success: true;
  data: unknown[];
  pagination: unknown;
}

interface FakeServicesService {
  create: Mock<
    (
      userId: string,
      formData: FormData,
    ) => Promise<
      ErrorResult | { success: true; message: string; data: unknown }
    >
  >;
  findAll: Mock<
    (page?: number, limit?: number, offset?: number) => Promise<PagedResult>
  >;
  findMe: Mock<
    (
      userId: string,
    ) => Promise<NotFoundResult | { success: true; data: unknown[] }>
  >;
  findByFreelancer: Mock<
    (
      userId: string,
    ) => Promise<NotFoundResult | { success: true; data: unknown[] }>
  >;
  findOne: Mock<
    (
      serviceId: string,
    ) => Promise<NotFoundResult | { success: true; data: unknown }>
  >;
  findPending: Mock<
    (page?: number, limit?: number, offset?: number) => Promise<PagedResult>
  >;
  update: Mock<
    (
      userId: string,
      serviceId: string,
      formData: FormData,
    ) => Promise<
      ErrorResult | { success: true; message: string; data: unknown }
    >
  >;
  updateStatus: Mock<
    (
      adminId: string,
      serviceId: string,
      status: ServiceStatus,
      reason: string,
    ) => Promise<
      ErrorResult | { success: true; message: string; data: unknown }
    >
  >;
  delete: Mock<
    (
      currentUser: AuthenticationUser,
      serviceId: string,
    ) => Promise<ErrorResult | { success: true; message: string }>
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
  SpongForbidden: Mock<(payload: unknown) => Tagged>;
  SpongUnprocessableContent: Mock<(payload: unknown) => Tagged>;
}

// ───────────────────────── helpers ─────────────────────────

const serviceId = 'service-1';

const currentUser = { id: 'user-1' } as unknown as AuthenticationUser;

const makeReq = (
  options: {
    params?: Record<string, string>;
    query?: URLSearchParams;
    body?: unknown;
    formData?: FormData;
  } = {},
) => {
  const formData = options.formData ?? new FormData();
  const json = mock(async (): Promise<unknown> => options.body);
  const readFormData = mock(async (): Promise<FormData> => formData);

  const req = {
    user: currentUser,
    params: options.params ?? {},
    query: options.query ?? new URLSearchParams(),
    json,
    formData: readFormData,
  } as unknown as SpongReq;

  return { req, json, readFormData, formData };
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

describe('ServicesController', () => {
  let servicesService: FakeServicesService;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: ServicesController;

  beforeEach(() => {
    servicesService = {
      create: mock(
        async (
          _userId: string,
          _formData: FormData,
        ): Promise<
          ErrorResult | { success: true; message: string; data: unknown }
        > => ({ success: true, message: 'created', data: null }),
      ),
      findAll: mock(
        async (
          _page?: number,
          _limit?: number,
          _offset?: number,
        ): Promise<PagedResult> => ({
          success: true,
          data: [],
          pagination: {},
        }),
      ),
      findMe: mock(
        async (
          _userId: string,
        ): Promise<NotFoundResult | { success: true; data: unknown[] }> => ({
          success: true,
          data: [],
        }),
      ),
      findByFreelancer: mock(
        async (
          _userId: string,
        ): Promise<NotFoundResult | { success: true; data: unknown[] }> => ({
          success: true,
          data: [],
        }),
      ),
      findOne: mock(
        async (
          _serviceId: string,
        ): Promise<NotFoundResult | { success: true; data: unknown }> => ({
          success: true,
          data: null,
        }),
      ),
      findPending: mock(
        async (
          _page?: number,
          _limit?: number,
          _offset?: number,
        ): Promise<PagedResult> => ({
          success: true,
          data: [],
          pagination: {},
        }),
      ),
      update: mock(
        async (
          _userId: string,
          _serviceId: string,
          _formData: FormData,
        ): Promise<
          ErrorResult | { success: true; message: string; data: unknown }
        > => ({ success: true, message: 'updated', data: null }),
      ),
      updateStatus: mock(
        async (
          _adminId: string,
          _serviceId: string,
          _status: ServiceStatus,
          _reason: string,
        ): Promise<
          ErrorResult | { success: true; message: string; data: unknown }
        > => ({ success: true, message: 'status updated', data: null }),
      ),
      delete: mock(
        async (
          _currentUser: AuthenticationUser,
          _serviceId: string,
        ): Promise<ErrorResult | { success: true; message: string }> => ({
          success: true,
          message: 'deleted',
        }),
      ),
    };

    spongRes = {
      SpongOK: tagged('ok'),
      SpongCreated: tagged('created'),
      SpongBadRequest: tagged('bad-request'),
      SpongNotFound: tagged('not-found'),
      SpongForbidden: tagged('forbidden'),
      SpongUnprocessableContent: tagged('unprocessable'),
    };
    res = spongRes as unknown as SpongRes;

    controller = new ServicesController(
      servicesService as unknown as ServicesService,
    );
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    it('passes the user and the form data to the service', async () => {
      const { req, readFormData, formData } = makeReq();

      await controller.create(req, res);

      expect(readFormData).toHaveBeenCalledTimes(1);
      expect(servicesService.create).toHaveBeenCalledWith(
        currentUser.id,
        formData,
      );
    });

    it('returns 404 when the service answers with statusCode 404', async () => {
      servicesService.create.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'Freelancer not found',
      });

      const result = await controller.create(makeReq().req, res);

      expect(asTagged(result)).toEqual(notFound('Freelancer not found'));
    });

    it('returns 400 without errors when the service sends none', async () => {
      servicesService.create.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'At least one image is required.',
      });

      const result = await controller.create(makeReq().req, res);

      expect(asTagged(result)).toEqual(
        badRequest('At least one image is required.'),
      );
      expect(asTagged(result).payload).not.toHaveProperty('errors');
    });

    it('returns 400 with the validation errors', async () => {
      const errors = [{ field: 'title', message: 'Title is required' }];
      servicesService.create.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Validation failed',
        errors,
      });

      const result = await controller.create(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: { success: false, message: 'Validation failed', errors },
      });
    });

    it('returns 201 with the created service', async () => {
      const data = { id: serviceId };
      servicesService.create.mockResolvedValue({
        success: true,
        message: 'Service created successfully',
        data,
      });

      const result = await controller.create(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'created',
        payload: {
          success: true,
          message: 'Service created successfully',
          data,
        },
      });
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('passes the request pagination to the service and returns it with the services', async () => {
      const { req } = makeReq({
        query: new URLSearchParams({
          page: '2',
          limit: '5',
        }),
      });

      const data = [{ id: serviceId }];
      const pagination = { total: 1, page: 2, limit: 5 };

      servicesService.findAll.mockResolvedValue({
        success: true,
        data,
        pagination,
      });

      const result = await controller.findAll(req, res);

      expect(servicesService.findAll).toHaveBeenCalledWith(2, 5, 5);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          data: {
            services: data,
            pagination,
          },
        },
      });
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it('returns 404 when the service reports an error', async () => {
      servicesService.findMe.mockResolvedValue({
        error: true,
        message: 'Freelancer not found',
      });

      const result = await controller.findMe(makeReq().req, res);

      expect(servicesService.findMe).toHaveBeenCalledWith(currentUser.id);
      expect(asTagged(result)).toEqual(notFound('Freelancer not found'));
    });

    it("returns the current freelancer's services", async () => {
      const data = [{ id: serviceId }];
      servicesService.findMe.mockResolvedValue({ success: true, data });

      const result = await controller.findMe(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── findByFreelancer ─────────────────────────
  describe('findByFreelancer', () => {
    const freelancerUserId = 'freelancer-user-1';

    it('returns 400 when the user id is missing', async () => {
      const result = await controller.findByFreelancer(makeReq().req, res);

      expect(asTagged(result)).toEqual(badRequest('User ID is required'));
      expect(servicesService.findMe).not.toHaveBeenCalled();
      expect(servicesService.findByFreelancer).not.toHaveBeenCalled();
    });

    it('asks the service for the services of the user in the URL', async () => {
      await controller.findByFreelancer(
        makeReq({ params: { userId: freelancerUserId } }).req,
        res,
      );

      expect(servicesService.findByFreelancer).toHaveBeenCalledWith(
        freelancerUserId,
      );
      expect(servicesService.findMe).not.toHaveBeenCalled();
    });

    it('returns 404 when the service reports an error', async () => {
      servicesService.findByFreelancer.mockResolvedValue({
        error: true,
        message: 'Freelancer not found',
      });

      const result = await controller.findByFreelancer(
        makeReq({ params: { userId: freelancerUserId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual(notFound('Freelancer not found'));
    });

    it("returns the freelancer's services", async () => {
      const data = [{ id: serviceId }];
      servicesService.findByFreelancer.mockResolvedValue({
        success: true,
        data,
      });

      const result = await controller.findByFreelancer(
        makeReq({ params: { userId: freelancerUserId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('returns 400 when the service id is missing', async () => {
      const result = await controller.findOne(makeReq().req, res);

      expect(asTagged(result)).toEqual(badRequest('Service ID is required'));
      expect(servicesService.findOne).not.toHaveBeenCalled();
    });

    it('returns 404 when the service reports an error', async () => {
      servicesService.findOne.mockResolvedValue({
        error: true,
        message: 'Service not found',
      });

      const result = await controller.findOne(
        makeReq({ params: { serviceId } }).req,
        res,
      );

      expect(servicesService.findOne).toHaveBeenCalledWith(serviceId);
      expect(asTagged(result)).toEqual(notFound('Service not found'));
    });

    it('returns the service on success', async () => {
      const data = { id: serviceId };
      servicesService.findOne.mockResolvedValue({ success: true, data });

      const result = await controller.findOne(
        makeReq({ params: { serviceId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data },
      });
    });
  });

  // ───────────────────────── findPending ─────────────────────────
  describe('findPending', () => {
    it('passes the request pagination to the service and returns it with the services', async () => {
      const { req } = makeReq({
        query: new URLSearchParams({
          page: '2',
          limit: '5',
        }),
      });

      const data = [{ id: serviceId }];
      const pagination = { total: 1, page: 2, limit: 5 };

      servicesService.findPending.mockResolvedValue({
        success: true,
        data,
        pagination,
      });

      const result = await controller.findPending(req, res);

      expect(servicesService.findPending).toHaveBeenCalledWith(2, 5, 5);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          data: {
            services: data,
            pagination,
          },
        },
      });
    });
  });

  // ───────────────────────── update ─────────────────────────
  describe('update', () => {
    it('returns 400 when the service id is missing', async () => {
      const { req, readFormData } = makeReq();

      const result = await controller.update(req, res);

      expect(asTagged(result)).toEqual(badRequest('Service ID is required'));
      expect(readFormData).not.toHaveBeenCalled();
      expect(servicesService.update).not.toHaveBeenCalled();
    });

    it('passes the user, the service id and the form data to the service', async () => {
      const { req, formData } = makeReq({ params: { serviceId } });

      await controller.update(req, res);

      expect(servicesService.update).toHaveBeenCalledWith(
        currentUser.id,
        serviceId,
        formData,
      );
    });

    it('returns 404 when the service answers with statusCode 404', async () => {
      servicesService.update.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'Service not found',
      });

      const result = await controller.update(
        makeReq({ params: { serviceId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual(notFound('Service not found'));
    });

    it('returns 400 without errors when the service sends none', async () => {
      servicesService.update.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'You can upload a maximum of 5 images.',
      });

      const result = await controller.update(
        makeReq({ params: { serviceId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual(
        badRequest('You can upload a maximum of 5 images.'),
      );
      expect(asTagged(result).payload).not.toHaveProperty('errors');
    });

    it('returns 400 with the validation errors', async () => {
      const errors = [{ field: 'price', message: 'Price is invalid' }];
      servicesService.update.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Validation failed',
        errors,
      });

      const result = await controller.update(
        makeReq({ params: { serviceId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: { success: false, message: 'Validation failed', errors },
      });
    });

    it('returns 200 with the updated service', async () => {
      const data = { id: serviceId };
      servicesService.update.mockResolvedValue({
        success: true,
        message: 'Service updated successfully',
        data,
      });

      const result = await controller.update(
        makeReq({ params: { serviceId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          message: 'Service updated successfully',
          data,
        },
      });
    });
  });

  // ───────────────────────── updateStatus ─────────────────────────
  describe('updateStatus', () => {
    const body = { status: ServiceStatus.REJECTED, reason: 'Low quality' };

    it('returns 400 when the service id is missing', async () => {
      const { req, json } = makeReq({ body });

      const result = await controller.updateStatus(req, res);

      expect(asTagged(result)).toEqual(badRequest('Service ID is required'));
      expect(json).not.toHaveBeenCalled();
      expect(servicesService.updateStatus).not.toHaveBeenCalled();
    });

    it('passes the admin, the service id, the status and the reason to the service', async () => {
      const { req, json } = makeReq({ params: { serviceId }, body });

      await controller.updateStatus(req, res);

      expect(json).toHaveBeenCalledTimes(1);
      expect(servicesService.updateStatus).toHaveBeenCalledWith(
        currentUser.id,
        serviceId,
        ServiceStatus.REJECTED,
        'Low quality',
      );
    });

    it('returns 404 when the service answers with statusCode 404', async () => {
      servicesService.updateStatus.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'Service not found',
      });

      const result = await controller.updateStatus(
        makeReq({ params: { serviceId }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual(notFound('Service not found'));
    });

    it('returns 422 with the validation errors', async () => {
      const errors = [{ field: 'status', message: 'Status is invalid' }];
      servicesService.updateStatus.mockResolvedValue({
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors,
      });

      const result = await controller.updateStatus(
        makeReq({ params: { serviceId }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'unprocessable',
        payload: { success: false, message: 'Validation failed', errors },
      });
    });

    it('returns 400 for any other service error', async () => {
      servicesService.updateStatus.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Service already has this status.',
      });

      const result = await controller.updateStatus(
        makeReq({ params: { serviceId }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual(
        badRequest('Service already has this status.'),
      );
    });

    it('returns 200 with the updated service', async () => {
      const data = { id: serviceId };
      servicesService.updateStatus.mockResolvedValue({
        success: true,
        message: 'Service status updated successfully.',
        data,
      });

      const result = await controller.updateStatus(
        makeReq({ params: { serviceId }, body }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          message: 'Service status updated successfully.',
          data,
        },
      });
    });
  });

  // ───────────────────────── delete ─────────────────────────
  describe('delete', () => {
    it('returns 400 when the service id is missing', async () => {
      const result = await controller.delete(makeReq().req, res);

      expect(asTagged(result)).toEqual(badRequest('Service ID is required'));
      expect(servicesService.delete).not.toHaveBeenCalled();
    });

    it('passes the current user and the service id to the service', async () => {
      await controller.delete(makeReq({ params: { serviceId } }).req, res);

      expect(servicesService.delete).toHaveBeenCalledWith(
        currentUser,
        serviceId,
      );
    });

    it('returns 404 when the service answers with statusCode 404', async () => {
      servicesService.delete.mockResolvedValue({
        error: true,
        statusCode: 404,
        message: 'Service not found.',
      });

      const result = await controller.delete(
        makeReq({ params: { serviceId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual(notFound('Service not found.'));
    });

    it("returns 403 when the user can't delete the service", async () => {
      servicesService.delete.mockResolvedValue({
        error: true,
        statusCode: 403,
        message: 'You are not allowed to delete this service.',
      });

      const result = await controller.delete(
        makeReq({ params: { serviceId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'forbidden',
        payload: {
          success: false,
          message: 'You are not allowed to delete this service.',
        },
      });
    });

    it('returns 400 for any other service error', async () => {
      servicesService.delete.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Cannot delete a service pending review.',
      });

      const result = await controller.delete(
        makeReq({ params: { serviceId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual(
        badRequest('Cannot delete a service pending review.'),
      );
    });

    it('returns 200 after deleting the service', async () => {
      servicesService.delete.mockResolvedValue({
        success: true,
        message: 'Service deleted successfully.',
      });

      const result = await controller.delete(
        makeReq({ params: { serviceId } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          message: 'Service deleted successfully.',
        },
      });
    });
  });
});
