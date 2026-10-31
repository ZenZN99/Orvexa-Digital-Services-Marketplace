import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
  type Mock,
} from 'bun:test';
import { Validator } from 'riser-bob';
import type { CloudinaryManager } from '../../../config/cloudinary/cloudinary';
import { buildPagination } from '../../../utilities/pagination';
import type { FreelancerSchema } from '../../freelancers/schemas/freelancer.schema';
import type { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../notifications/schemas/enums/notification.enum';
import { UserRole } from '../../users/schemas/enums/users.enum';
import type {
  AuthenticationUser,
  UserSchema,
} from '../../users/schemas/user.schema';
import { CreateServiceRule } from '../rules/create';
import { UpdateServiceRule } from '../rules/update';
import { UpdateServiceStatusRule } from '../rules/update-status';
import { ServiceStatus } from '../schemas/enums/service.enum';
import type { ServiceSchema } from '../schemas/service.schema';
import { ServicesService } from '../services.service';

// ───────────────────────── types ─────────────────────────

type ValidationResult = ReturnType<typeof Validator.validate>;

interface FakeImage {
  url: string;
  publicId: string;
}

interface FakeService {
  id: string;
  freelancerId: string;
  status: ServiceStatus;
  reason: string | null;
  images: FakeImage[];
  update: Mock<(values: Record<string, unknown>) => Promise<void>>;
  save: Mock<() => Promise<void>>;
  destroy: Mock<() => Promise<void>>;
}

interface FakeFreelancer {
  id: string;
  userId: string;
}

interface FakeServiceSchema {
  create: Mock<(data: unknown) => Promise<{ id: string }>>;
  count: Mock<(options: unknown) => Promise<number>>;
  findAndCountAll: Mock<
    (options: unknown) => Promise<{ rows: unknown[]; count: number }>
  >;
  findAll: Mock<(options: unknown) => Promise<unknown[]>>;
  findOne: Mock<(options: unknown) => Promise<FakeService | null>>;
  findByPk: Mock<(id: string) => Promise<FakeService | null>>;
}

interface FakeFreelancerSchema {
  findOne: Mock<(options: unknown) => Promise<FakeFreelancer | null>>;
  findByPk: Mock<(id: string) => Promise<FakeFreelancer | null>>;
}

interface FakeUserSchema {
  findAll: Mock<(options: unknown) => Promise<{ id: string }[]>>;
}

interface FakeNotificationsService {
  create: Mock<(data: unknown) => Promise<void>>;
}

interface FakeCloudinaryManager {
  upload: Mock<(file: File, folder: string) => Promise<FakeImage>>;
  destroy: Mock<(publicId: string) => Promise<void>>;
}

// ───────────────────────── helpers ─────────────────────────

const userId = 'user-1';
const serviceId = 'service-1';
const freelancerId = 'freelancer-1';
const adminId = 'admin-1';

const makeValidation = (
  valid: boolean,
  errors: unknown = [],
  data: unknown = {},
) => ({ valid, errors, data }) as unknown as ValidationResult;

const makeFreelancer = (
  overrides: Partial<FakeFreelancer> = {},
): FakeFreelancer => ({
  id: freelancerId,
  userId,
  ...overrides,
});

// Like a Sequelize instance, `update` assigns the new values onto the service.
const makeService = (overrides: Partial<FakeService> = {}): FakeService => {
  const fake: FakeService = {
    id: serviceId,
    freelancerId,
    status: ServiceStatus.PUBLISHED,
    reason: null,
    images: [{ url: 'old-1.png', publicId: 'old-1' }],
    update: mock(async (values: Record<string, unknown>): Promise<void> => {
      Object.assign(fake, values);
    }),
    save: mock(async (): Promise<void> => {}),
    destroy: mock(async (): Promise<void> => {}),
  };

  return Object.assign(fake, overrides);
};

const makeImage = (name: string, content = 'x') =>
  new File([content], name, { type: 'image/png' });

type FormFields = Record<string, string | string[]>;

// `create` reads features/keywords with `formData.getAll(...)` (one entry per value).
const defaultFields: FormFields = {
  category: 'design',
  title: 'Logo design',
  description: 'I design logos',
  price: '100',
  deliveryDays: '3',
  features: ['feature'],
  keywords: ['keyword'],
};

// `update` reads features/keywords with `JSON.parse(formData.get(...))`.
const updateFields: FormFields = {
  ...defaultFields,
  features: JSON.stringify(['feature']),
  keywords: JSON.stringify(['keyword']),
};

const makeFormData = (
  images: (File | string)[] = [makeImage('a.png')],
  fields: FormFields = defaultFields,
) => {
  const formData = new FormData();

  for (const [name, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        formData.append(name, item);
      }
    } else {
      formData.append(name, value);
    }
  }
  for (const image of images) {
    formData.append('images', image);
  }

  return formData;
};

const makeUpdateFormData = (images: (File | string)[] = [makeImage('a.png')]) =>
  makeFormData(images, updateFields);

const parsedBody = {
  category: 'design',
  title: 'Logo design',
  description: 'I design logos',
  price: 100,
  deliveryDays: 3,
  features: ['feature'],
  keywords: ['keyword'],
};

const makeUser = (role: UserRole): AuthenticationUser =>
  ({ id: userId, role }) as unknown as AuthenticationUser;

// Compare results without fighting the service's narrow `as const` return types.
const plain = (value: unknown): unknown => value;

// ───────────────────────── tests ─────────────────────────

describe('ServicesService', () => {
  let serviceSchema: FakeServiceSchema;
  let freelancerSchema: FakeFreelancerSchema;
  let userSchema: FakeUserSchema;
  let notificationsService: FakeNotificationsService;
  let cloudinaryManager: FakeCloudinaryManager;
  let service: ServicesService;

  beforeEach(() => {
    spyOn(Validator, 'validate').mockReturnValue(
      makeValidation(true, [], parsedBody),
    );

    serviceSchema = {
      create: mock(
        async (_data: unknown): Promise<{ id: string }> => ({
          id: serviceId,
        }),
      ),
      count: mock(async (_options: unknown): Promise<number> => 0),
      findAndCountAll: mock(
        async (
          _options: unknown,
        ): Promise<{ rows: unknown[]; count: number }> => ({
          rows: [],
          count: 0,
        }),
      ),
      findAll: mock(async (_options: unknown): Promise<unknown[]> => []),
      findOne: mock(
        async (_options: unknown): Promise<FakeService | null> => null,
      ),
      findByPk: mock(async (_id: string): Promise<FakeService | null> => null),
    };
    freelancerSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeFreelancer | null> => null,
      ),
      findByPk: mock(
        async (_id: string): Promise<FakeFreelancer | null> => null,
      ),
    };
    userSchema = {
      findAll: mock(async (_options: unknown): Promise<{ id: string }[]> => []),
    };
    notificationsService = {
      create: mock(async (_data: unknown): Promise<void> => {}),
    };
    cloudinaryManager = {
      upload: mock(
        async (file: File, _folder: string): Promise<FakeImage> => ({
          url: `https://cdn.test/${file.name}`,
          publicId: `public-${file.name}`,
        }),
      ),
      destroy: mock(async (_publicId: string): Promise<void> => {}),
    };

    service = new ServicesService(
      serviceSchema as unknown as typeof ServiceSchema,
      freelancerSchema as unknown as typeof FreelancerSchema,
      userSchema as unknown as typeof UserSchema,
      notificationsService as unknown as NotificationsService,
      cloudinaryManager as unknown as CloudinaryManager,
    );
  });

  afterEach(() => {
    mock.restore();
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    // Everything is in place for a successful creation; each test breaks one thing.
    beforeEach(() => {
      freelancerSchema.findOne.mockResolvedValue(makeFreelancer());
      userSchema.findAll.mockResolvedValue([
        { id: 'admin-1' },
        { id: 'admin-2' },
      ]);
    });

    it("returns 404 when the user isn't a freelancer", async () => {
      freelancerSchema.findOne.mockResolvedValue(null);

      const result = await service.create(userId, makeFormData());

      expect(freelancerSchema.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'Freelancer not found',
      });
      expect(serviceSchema.count).not.toHaveBeenCalled();
    });

    it('returns 400 when the freelancer already has 15 services', async () => {
      serviceSchema.count.mockResolvedValue(15);

      const result = await service.create(userId, makeFormData());

      expect(serviceSchema.count).toHaveBeenCalledWith({
        where: { freelancerId },
      });
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'You have reached the maximum limit of 15 services.',
      });
      expect(Validator.validate).not.toHaveBeenCalled();
    });

    it('parses the form fields and validates them with the create service rule', async () => {
      await service.create(userId, makeFormData());

      expect(Validator.validate).toHaveBeenCalledWith(
        parsedBody,
        CreateServiceRule,
      );
    });

    it('collects every features and keywords value sent in the form', async () => {
      await service.create(
        userId,
        makeFormData([makeImage('a.png')], {
          ...defaultFields,
          features: ['feature-1', 'feature-2'],
          keywords: ['keyword-1', 'keyword-2'],
        }),
      );

      expect(Validator.validate).toHaveBeenCalledWith(
        expect.objectContaining({
          features: ['feature-1', 'feature-2'],
          keywords: ['keyword-1', 'keyword-2'],
        }),
        CreateServiceRule,
      );
    });

    it('defaults features and keywords to empty lists when the form has none', async () => {
      const {
        features: _features,
        keywords: _keywords,
        ...fields
      } = defaultFields;

      await service.create(userId, makeFormData([makeImage('a.png')], fields));

      expect(Validator.validate).toHaveBeenCalledWith(
        expect.objectContaining({ features: [], keywords: [] }),
        CreateServiceRule,
      );
    });

    it('returns 400 with the validation errors when the form is invalid', async () => {
      const errors = [{ field: 'title', message: 'Title is required' }];
      spyOn(Validator, 'validate').mockReturnValue(
        makeValidation(false, errors),
      );

      const result = await service.create(userId, makeFormData());

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Validation failed',
        errors,
      });
      expect(cloudinaryManager.upload).not.toHaveBeenCalled();
    });

    it('returns 400 when no image is sent', async () => {
      const result = await service.create(userId, makeFormData([]));

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'At least one image is required.',
      });
    });

    it('ignores empty files and text values when counting the images', async () => {
      const result = await service.create(
        userId,
        makeFormData([makeImage('empty.png', ''), 'not-a-file']),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'At least one image is required.',
      });
      expect(cloudinaryManager.upload).not.toHaveBeenCalled();
    });

    it('returns 400 when more than 5 images are sent', async () => {
      const images = Array.from({ length: 6 }, (_, index) =>
        makeImage(`image-${index}.png`),
      );

      const result = await service.create(userId, makeFormData(images));

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'You can upload a maximum of 5 images.',
      });
      expect(cloudinaryManager.upload).not.toHaveBeenCalled();
    });

    it('uploads every image to the services folder', async () => {
      const first = makeImage('a.png');
      const second = makeImage('b.png');

      await service.create(userId, makeFormData([first, second]));

      expect(cloudinaryManager.upload).toHaveBeenCalledTimes(2);
      expect(cloudinaryManager.upload).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'a.png' }),
        'services',
      );
      expect(cloudinaryManager.upload).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'b.png' }),
        'services',
      );
    });

    it('creates a pending service with the validated data and the uploaded images', async () => {
      await service.create(
        userId,
        makeFormData([makeImage('a.png'), makeImage('b.png')]),
      );

      expect(serviceSchema.create).toHaveBeenCalledWith({
        freelancerId,
        category: 'design',
        title: 'Logo design',
        description: 'I design logos',
        features: ['feature'],
        keywords: ['keyword'],
        price: 100,
        deliveryDays: 3,
        images: [
          { url: 'https://cdn.test/a.png', publicId: 'public-a.png' },
          { url: 'https://cdn.test/b.png', publicId: 'public-b.png' },
        ],
        status: ServiceStatus.PENDING,
      });
    });

    it('notifies every admin that a service is waiting for review', async () => {
      serviceSchema.create.mockResolvedValue({ id: 'created-service' });

      await service.create(userId, makeFormData());

      expect(userSchema.findAll).toHaveBeenCalledWith({
        where: { role: UserRole.ADMIN },
      });
      expect(notificationsService.create).toHaveBeenCalledTimes(2);
      expect(notificationsService.create).toHaveBeenCalledWith({
        senderId: userId,
        receiverId: 'admin-1',
        targetId: 'created-service',
        type: NotificationType.SERVICE_REVIEW,
        message: 'A new service is waiting for your review.',
        link: '/admin',
      });
      expect(notificationsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ receiverId: 'admin-2' }),
      );
    });

    it('returns the created service', async () => {
      const created = { id: 'created-service' };
      serviceSchema.create.mockResolvedValue(created);

      const result = await service.create(userId, makeFormData());

      expect(plain(result)).toEqual({
        success: true,
        message: 'Service created successfully',
        data: created,
      });
    });

    it('deletes the uploaded images and rethrows when creating the service fails', async () => {
      serviceSchema.create.mockRejectedValue(new Error('boom'));

      await expect(
        service.create(
          userId,
          makeFormData([makeImage('a.png'), makeImage('b.png')]),
        ),
      ).rejects.toThrow('boom');

      expect(cloudinaryManager.destroy).toHaveBeenCalledTimes(2);
      expect(cloudinaryManager.destroy).toHaveBeenCalledWith('public-a.png');
      expect(cloudinaryManager.destroy).toHaveBeenCalledWith('public-b.png');
    });

    it('deletes the images that were already uploaded when a later upload fails', async () => {
      cloudinaryManager.upload
        .mockResolvedValueOnce({
          url: 'https://cdn.test/a.png',
          publicId: 'public-a.png',
        })
        .mockRejectedValueOnce(new Error('boom'));

      await expect(
        service.create(
          userId,
          makeFormData([makeImage('a.png'), makeImage('b.png')]),
        ),
      ).rejects.toThrow('boom');

      expect(cloudinaryManager.destroy).toHaveBeenCalledTimes(1);
      expect(cloudinaryManager.destroy).toHaveBeenCalledWith('public-a.png');
      expect(serviceSchema.create).not.toHaveBeenCalled();
    });

    it('rethrows the original error even when deleting an image fails', async () => {
      serviceSchema.create.mockRejectedValue(new Error('boom'));
      cloudinaryManager.destroy.mockRejectedValue(new Error('cloudinary down'));

      await expect(service.create(userId, makeFormData())).rejects.toThrow(
        'boom',
      );
    });

    it.todo(
      'keeps the images of the created service when notifying the admins fails (they are deleted while the service still exists)',
    );
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('lists published services with the default page and limit', async () => {
      await service.findAll();

      expect(serviceSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: ServiceStatus.PUBLISHED },
          include: [expect.objectContaining({ as: 'freelancer' })],
          limit: 10,
          offset: 0,
          order: [['createdAt', 'DESC']],
        }),
      );
    });

    it('derives the offset from the page and limit', async () => {
      await service.findAll(3, 5);

      expect(serviceSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5, offset: 10 }),
      );
    });

    it('returns the services with their pagination', async () => {
      const rows = [{ id: 's1' }, { id: 's2' }];
      serviceSchema.findAndCountAll.mockResolvedValue({ rows, count: 12 });

      const result = await service.findAll(2, 5);

      expect(plain(result)).toEqual({
        success: true,
        data: rows,
        pagination: buildPagination(12, 2, 5),
      });
    });
  });

  // ───────────────────────── findMe / findByFreelancer ─────────────────────────
  for (const method of ['findMe', 'findByFreelancer'] as const) {
    describe(method, () => {
      it("returns an error when the user isn't a freelancer", async () => {
        freelancerSchema.findOne.mockResolvedValue(null);

        const result = await service[method](userId);

        expect(freelancerSchema.findOne).toHaveBeenCalledWith({
          where: { userId },
        });
        expect(plain(result)).toEqual({
          error: true,
          message: 'Freelancer not found',
        });
      });

      it("returns the freelancer's services, newest first", async () => {
        const services = [{ id: 's1' }, { id: 's2' }];
        freelancerSchema.findOne.mockResolvedValue(makeFreelancer());
        serviceSchema.findAll.mockResolvedValue(services);

        const result = await service[method](userId);

        expect(serviceSchema.findAll).toHaveBeenCalledWith({
          where: { freelancerId },
          order: [['createdAt', 'DESC']],
        });
        expect(plain(result)).toEqual({ success: true, data: services });
      });
    });
  }

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it("returns an error when the service isn't published or doesn't exist", async () => {
      serviceSchema.findOne.mockResolvedValue(null);

      const result = await service.findOne(serviceId);

      expect(serviceSchema.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: serviceId, status: ServiceStatus.PUBLISHED },
        }),
      );
      expect(plain(result)).toEqual({
        error: true,
        message: 'Service not found',
      });
    });

    it('returns the service', async () => {
      const found = makeService();
      serviceSchema.findOne.mockResolvedValue(found);

      const result = await service.findOne(serviceId);

      expect(plain(result)).toEqual({ success: true, data: found });
    });
  });

  // ───────────────────────── findPending ─────────────────────────
  describe('findPending', () => {
    it('lists pending services with the default page and limit', async () => {
      await service.findPending();

      expect(serviceSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: ServiceStatus.PENDING },
          limit: 10,
          offset: 0,
          order: [['createdAt', 'DESC']],
        }),
      );
    });

    it('derives the offset from the page and limit', async () => {
      await service.findPending(3, 5);

      expect(serviceSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5, offset: 10 }),
      );
    });

    it('returns the services with their pagination', async () => {
      const rows = [{ id: 's1' }];
      serviceSchema.findAndCountAll.mockResolvedValue({ rows, count: 7 });

      const result = await service.findPending(2, 5);

      expect(plain(result)).toEqual({
        success: true,
        data: rows,
        pagination: buildPagination(7, 2, 5),
      });
    });
  });

  // ───────────────────────── update ─────────────────────────
  describe('update', () => {
    let existing: FakeService;

    // Everything is in place for a successful update; each test breaks one thing.
    beforeEach(() => {
      existing = makeService();
      freelancerSchema.findOne.mockResolvedValue(makeFreelancer());
      serviceSchema.findOne.mockResolvedValue(existing);
      userSchema.findAll.mockResolvedValue([{ id: 'admin-1' }]);
    });

    it("returns 404 when the user isn't a freelancer", async () => {
      freelancerSchema.findOne.mockResolvedValue(null);

      const result = await service.update(
        userId,
        serviceId,
        makeUpdateFormData(),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'Freelancer not found',
      });
      expect(serviceSchema.findOne).not.toHaveBeenCalled();
    });

    it("returns 404 when the service isn't the freelancer's", async () => {
      serviceSchema.findOne.mockResolvedValue(null);

      const result = await service.update(
        userId,
        serviceId,
        makeUpdateFormData(),
      );

      expect(serviceSchema.findOne).toHaveBeenCalledWith({
        where: { id: serviceId, freelancerId },
      });
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'Service not found',
      });
    });

    it('parses features and keywords from JSON and validates with the update service rule', async () => {
      await service.update(userId, serviceId, makeUpdateFormData([]));

      expect(Validator.validate).toHaveBeenCalledWith(
        parsedBody,
        UpdateServiceRule,
      );
    });

    it('returns 400 with the validation errors when the form is invalid', async () => {
      const errors = [{ field: 'price', message: 'Price is invalid' }];
      spyOn(Validator, 'validate').mockReturnValue(
        makeValidation(false, errors),
      );

      const result = await service.update(
        userId,
        serviceId,
        makeUpdateFormData(),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Validation failed',
        errors,
      });
      expect(existing.update).not.toHaveBeenCalled();
    });

    it('returns 400 when the images field is sent without a valid file', async () => {
      const result = await service.update(
        userId,
        serviceId,
        makeUpdateFormData(['']),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'At least one image is required when updating images.',
      });
      expect(existing.update).not.toHaveBeenCalled();
    });

    it('returns 400 when more than 5 images are sent', async () => {
      const images = Array.from({ length: 6 }, (_, index) =>
        makeImage(`image-${index}.png`),
      );

      const result = await service.update(
        userId,
        serviceId,
        makeUpdateFormData(images),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'You can upload a maximum of 5 images.',
      });
      expect(cloudinaryManager.upload).not.toHaveBeenCalled();
    });

    it('updates only the defined fields and sends the service back to review', async () => {
      spyOn(Validator, 'validate').mockReturnValue(
        makeValidation(true, [], { title: 'New title', price: undefined }),
      );

      await service.update(userId, serviceId, makeUpdateFormData([]));

      expect(existing.update).toHaveBeenCalledTimes(1);

      const [values] = existing.update.mock.calls[0] ?? [];

      expect(values).toEqual({
        title: 'New title',
        status: ServiceStatus.PENDING,
        reason: null,
      });
      expect(values).not.toHaveProperty('price');
      expect(cloudinaryManager.upload).not.toHaveBeenCalled();
      expect(cloudinaryManager.destroy).not.toHaveBeenCalled();
    });

    it('uploads the new images to the services folder and saves them on the service', async () => {
      spyOn(Validator, 'validate').mockReturnValue(
        makeValidation(true, [], { title: 'New title' }),
      );

      await service.update(
        userId,
        serviceId,
        makeUpdateFormData([makeImage('a.png'), makeImage('b.png')]),
      );

      expect(cloudinaryManager.upload).toHaveBeenCalledTimes(2);
      expect(cloudinaryManager.upload).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'a.png' }),
        'services',
      );
      expect(existing.update).toHaveBeenCalledWith({
        title: 'New title',
        images: [
          { url: 'https://cdn.test/a.png', publicId: 'public-a.png' },
          { url: 'https://cdn.test/b.png', publicId: 'public-b.png' },
        ],
        status: ServiceStatus.PENDING,
        reason: null,
      });
    });

    it('notifies every admin that the service is waiting for review', async () => {
      await service.update(userId, serviceId, makeUpdateFormData([]));

      expect(userSchema.findAll).toHaveBeenCalledWith({
        where: { role: UserRole.ADMIN },
      });
      expect(notificationsService.create).toHaveBeenCalledWith({
        senderId: userId,
        receiverId: 'admin-1',
        targetId: serviceId,
        type: NotificationType.SERVICE_REVIEW,
        message: 'A new service is waiting for your review.',
        link: '/admin',
      });
    });

    it('returns the updated service', async () => {
      const result = await service.update(
        userId,
        serviceId,
        makeUpdateFormData([]),
      );

      expect(plain(result)).toEqual({
        success: true,
        message: 'Service updated successfully',
        data: existing,
      });
    });

    it('deletes the new images and rethrows when updating the service fails', async () => {
      existing.update.mockRejectedValue(new Error('boom'));

      await expect(
        service.update(
          userId,
          serviceId,
          makeUpdateFormData([makeImage('a.png'), makeImage('b.png')]),
        ),
      ).rejects.toThrow('boom');

      expect(cloudinaryManager.destroy).toHaveBeenCalledTimes(2);
      expect(cloudinaryManager.destroy).toHaveBeenCalledWith('public-a.png');
      expect(cloudinaryManager.destroy).toHaveBeenCalledWith('public-b.png');
    });

    it.todo(
      'deletes the replaced images from Cloudinary (service.images is already the new set after update(), so nothing is deleted today)',
    );

    it.todo(
      'keeps the new images when notifying the admins fails after the service was updated (they are deleted while the service uses them)',
    );
  });

  // ───────────────────────── updateStatus ─────────────────────────
  describe('updateStatus', () => {
    const rejectionReason = 'Low quality';

    it("returns 404 when the service doesn't exist", async () => {
      serviceSchema.findByPk.mockResolvedValue(null);

      const result = await service.updateStatus(
        adminId,
        serviceId,
        ServiceStatus.PUBLISHED,
        '',
      );

      expect(serviceSchema.findByPk).toHaveBeenCalledWith(serviceId);
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'Service not found',
      });
    });

    it('validates the status and the reason with the update status rule', async () => {
      serviceSchema.findByPk.mockResolvedValue(
        makeService({ status: ServiceStatus.PENDING }),
      );

      await service.updateStatus(
        adminId,
        serviceId,
        ServiceStatus.REJECTED,
        rejectionReason,
      );

      expect(Validator.validate).toHaveBeenCalledWith(
        { status: ServiceStatus.REJECTED, reason: rejectionReason },
        UpdateServiceStatusRule,
      );
    });

    it('returns 422 with the validation errors', async () => {
      const errors = [{ field: 'status', message: 'Status is invalid' }];
      serviceSchema.findByPk.mockResolvedValue(makeService());
      spyOn(Validator, 'validate').mockReturnValue(
        makeValidation(false, errors),
      );

      const result = await service.updateStatus(
        adminId,
        serviceId,
        ServiceStatus.PUBLISHED,
        '',
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors,
      });
    });

    it('returns 400 when the service already has that status', async () => {
      const found = makeService({ status: ServiceStatus.PUBLISHED });
      serviceSchema.findByPk.mockResolvedValue(found);

      const result = await service.updateStatus(
        adminId,
        serviceId,
        ServiceStatus.PUBLISHED,
        '',
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Service already has this status.',
      });
      expect(found.save).not.toHaveBeenCalled();
    });

    it('returns 400 when rejecting without a reason', async () => {
      const found = makeService({ status: ServiceStatus.PENDING });
      serviceSchema.findByPk.mockResolvedValue(found);

      const result = await service.updateStatus(
        adminId,
        serviceId,
        ServiceStatus.REJECTED,
        '',
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'A reason is required when rejecting a service.',
      });
      expect(found.save).not.toHaveBeenCalled();
    });

    it('publishes the service, clears the reason and notifies the freelancer', async () => {
      const found = makeService({
        status: ServiceStatus.PENDING,
        reason: 'Old reason',
      });
      serviceSchema.findByPk.mockResolvedValue(found);
      freelancerSchema.findByPk.mockResolvedValue(
        makeFreelancer({ userId: 'freelancer-user-1' }),
      );

      const result = await service.updateStatus(
        adminId,
        serviceId,
        ServiceStatus.PUBLISHED,
        '',
      );

      expect(found.status).toBe(ServiceStatus.PUBLISHED);
      expect(found.reason).toBeNull();
      expect(found.save).toHaveBeenCalledTimes(1);
      expect(freelancerSchema.findByPk).toHaveBeenCalledWith(freelancerId);
      expect(notificationsService.create).toHaveBeenCalledWith({
        senderId: adminId,
        receiverId: 'freelancer-user-1',
        targetId: serviceId,
        type: NotificationType.SERVICE_APPROVED,
        message: 'Your service has been approved and published.',
        link: '/services/status',
      });
      expect(plain(result)).toEqual({
        success: true,
        message: 'Service status updated successfully.',
        data: found,
      });
    });

    it('rejects the service with the reason and notifies the freelancer', async () => {
      const found = makeService({ status: ServiceStatus.PENDING });
      serviceSchema.findByPk.mockResolvedValue(found);
      freelancerSchema.findByPk.mockResolvedValue(
        makeFreelancer({ userId: 'freelancer-user-1' }),
      );

      await service.updateStatus(
        adminId,
        serviceId,
        ServiceStatus.REJECTED,
        rejectionReason,
      );

      expect(found.status).toBe(ServiceStatus.REJECTED);
      expect(found.reason).toBe(rejectionReason);
      expect(found.save).toHaveBeenCalledTimes(1);
      expect(notificationsService.create).toHaveBeenCalledWith({
        senderId: adminId,
        receiverId: 'freelancer-user-1',
        targetId: serviceId,
        type: NotificationType.SERVICE_REJECTED,
        message: `Your service has been rejected. Reason: ${rejectionReason}`,
        link: '/services/status',
      });
    });

    it("still succeeds without a notification when the freelancer doesn't exist", async () => {
      serviceSchema.findByPk.mockResolvedValue(
        makeService({ status: ServiceStatus.PENDING }),
      );
      freelancerSchema.findByPk.mockResolvedValue(null);

      const result = await service.updateStatus(
        adminId,
        serviceId,
        ServiceStatus.PUBLISHED,
        '',
      );

      expect(notificationsService.create).not.toHaveBeenCalled();
      expect(plain(result)).toMatchObject({ success: true });
    });
  });

  // ───────────────────────── delete ─────────────────────────
  describe('delete', () => {
    const owner = makeUser(
      Object.values(UserRole).find(
        (role) => role !== UserRole.ADMIN,
      ) as UserRole,
    );
    const admin = makeUser(UserRole.ADMIN);

    it("returns 404 when the service doesn't exist", async () => {
      serviceSchema.findByPk.mockResolvedValue(null);

      const result = await service.delete(owner, serviceId);

      expect(serviceSchema.findByPk).toHaveBeenCalledWith(serviceId);
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'Service not found.',
      });
    });

    it('returns 400 when the service is pending review', async () => {
      const found = makeService({ status: ServiceStatus.PENDING });
      serviceSchema.findByPk.mockResolvedValue(found);

      const result = await service.delete(admin, serviceId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Cannot delete a service pending review.',
      });
      expect(found.destroy).not.toHaveBeenCalled();
    });

    it("returns 404 when a non-admin user isn't a freelancer", async () => {
      serviceSchema.findByPk.mockResolvedValue(makeService());
      freelancerSchema.findOne.mockResolvedValue(null);

      const result = await service.delete(owner, serviceId);

      expect(freelancerSchema.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'Freelancer not found.',
      });
    });

    it('returns 403 when the service belongs to another freelancer', async () => {
      const found = makeService({ freelancerId: 'other-freelancer' });
      serviceSchema.findByPk.mockResolvedValue(found);
      freelancerSchema.findOne.mockResolvedValue(makeFreelancer());

      const result = await service.delete(owner, serviceId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 403,
        message: 'You are not allowed to delete this service.',
      });
      expect(found.destroy).not.toHaveBeenCalled();
      expect(cloudinaryManager.destroy).not.toHaveBeenCalled();
    });

    it('deletes the images and the service of its owner', async () => {
      const found = makeService({
        images: [
          { url: 'a.png', publicId: 'image-a' },
          { url: 'b.png', publicId: 'image-b' },
        ],
      });
      serviceSchema.findByPk.mockResolvedValue(found);
      freelancerSchema.findOne.mockResolvedValue(makeFreelancer());

      const result = await service.delete(owner, serviceId);

      expect(cloudinaryManager.destroy).toHaveBeenCalledTimes(2);
      expect(cloudinaryManager.destroy).toHaveBeenCalledWith('image-a');
      expect(cloudinaryManager.destroy).toHaveBeenCalledWith('image-b');
      expect(found.destroy).toHaveBeenCalledTimes(1);
      expect(plain(result)).toEqual({
        success: true,
        message: 'Service deleted successfully.',
      });
    });

    it('lets an admin delete any service without looking for a freelancer', async () => {
      const found = makeService({ freelancerId: 'other-freelancer' });
      serviceSchema.findByPk.mockResolvedValue(found);

      const result = await service.delete(admin, serviceId);

      expect(freelancerSchema.findOne).not.toHaveBeenCalled();
      expect(found.destroy).toHaveBeenCalledTimes(1);
      expect(plain(result)).toMatchObject({ success: true });
    });
  });
});
