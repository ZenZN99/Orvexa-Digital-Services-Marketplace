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
import type { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../notifications/schemas/enums/notification.enum';
import { UserRole } from '../../users/schemas/enums/users.enum';
import type { UserSchema } from '../../users/schemas/user.schema';
import { UpdateUserVerificationRule } from '../rules/update.rule';
import { UserVerificationStatus } from '../schemas/enums/user-verification.enum';
import type { UserVerificationSchema } from '../schemas/user-verification.schema';
import { UserVerificationsService } from '../user-verifications.service';

// ───────────────────────── types ─────────────────────────

type ValidationResult = ReturnType<typeof Validator.validate>;

interface FakeImage {
  url: string;
  publicId: string;
}

interface FakeVerification {
  id: string;
  userId: string;
  status: UserVerificationStatus | null;
  profileImage: FakeImage | null;
  identityDocument: FakeImage | null;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  submittedAt: Date | null;
  save: Mock<() => Promise<void>>;
}

interface FakeUserVerificationSchema {
  findOne: Mock<(options: unknown) => Promise<FakeVerification | null>>;
  findByPk: Mock<(id: string) => Promise<FakeVerification | null>>;
  create: Mock<(data: unknown) => Promise<{ id: string }>>;
  findAndCountAll: Mock<
    (options: unknown) => Promise<{ rows: unknown[]; count: number }>
  >;
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
const adminId = 'admin-1';
const verificationId = 'verification-1';

const makeValidation = (
  valid: boolean,
  errors: unknown = [],
  data: unknown = {},
) => ({ valid, errors, data }) as unknown as ValidationResult;

const makeVerification = (
  overrides: Partial<FakeVerification> = {},
): FakeVerification => ({
  id: verificationId,
  userId,
  status: UserVerificationStatus.PENDING,
  profileImage: null,
  identityDocument: null,
  rejectionReason: null,
  reviewedBy: null,
  reviewedAt: null,
  submittedAt: null,
  save: mock(async (): Promise<void> => {}),
  ...overrides,
});

const makeFile = (name: string) => new File(['x'], name, { type: 'image/png' });

const makeFormData = () => {
  const formData = new FormData();

  formData.append('profileImage', makeFile('face.png'));
  formData.append('identityDocument', makeFile('passport.png'));

  return formData;
};

const uploadedProfileImage = {
  url: 'https://cdn.test/face.png',
  publicId: 'public-face.png',
};

const uploadedIdentityDocument = {
  url: 'https://cdn.test/passport.png',
  publicId: 'public-passport.png',
};

// Compare results without fighting the service's narrow `as const` return types.
const plain = (value: unknown): unknown => value;

// ───────────────────────── tests ─────────────────────────

describe('UserVerificationsService', () => {
  let userVerificationSchema: FakeUserVerificationSchema;
  let userSchema: FakeUserSchema;
  let notificationsService: FakeNotificationsService;
  let cloudinaryManager: FakeCloudinaryManager;
  let service: UserVerificationsService;

  beforeEach(() => {
    spyOn(Validator, 'validate').mockReturnValue(makeValidation(true));

    userVerificationSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeVerification | null> => null,
      ),
      findByPk: mock(
        async (_id: string): Promise<FakeVerification | null> => null,
      ),
      create: mock(
        async (_data: unknown): Promise<{ id: string }> => ({
          id: verificationId,
        }),
      ),
      findAndCountAll: mock(
        async (
          _options: unknown,
        ): Promise<{ rows: unknown[]; count: number }> => ({
          rows: [],
          count: 0,
        }),
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

    service = new UserVerificationsService(
      userVerificationSchema as unknown as typeof UserVerificationSchema,
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
    beforeEach(() => {
      userSchema.findAll.mockResolvedValue([
        { id: 'admin-1' },
        { id: 'admin-2' },
      ]);
    });

    it('looks for an existing verification of the user', async () => {
      await service.create(userId, makeFormData());

      expect(userVerificationSchema.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('returns 400 when a request is already pending review', async () => {
      userVerificationSchema.findOne.mockResolvedValue(
        makeVerification({ status: UserVerificationStatus.PENDING }),
      );

      const result = await service.create(userId, makeFormData());

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Your verification request is already pending review.',
      });
      expect(cloudinaryManager.upload).not.toHaveBeenCalled();
    });

    it('returns 400 when the account is already verified', async () => {
      userVerificationSchema.findOne.mockResolvedValue(
        makeVerification({ status: UserVerificationStatus.APPROVED }),
      );

      const result = await service.create(userId, makeFormData());

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Your account has already been verified.',
      });
      expect(cloudinaryManager.upload).not.toHaveBeenCalled();
    });

    describe('first request', () => {
      it('uploads the profile image and the identity document to their folders', async () => {
        await service.create(userId, makeFormData());

        expect(cloudinaryManager.upload).toHaveBeenCalledTimes(2);
        expect(cloudinaryManager.upload).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'face.png' }),
          'verifications/profile',
        );
        expect(cloudinaryManager.upload).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'passport.png' }),
          'verifications/identity',
        );
      });

      it('creates a pending verification with the uploaded images', async () => {
        await service.create(userId, makeFormData());

        expect(userVerificationSchema.create).toHaveBeenCalledWith({
          userId,
          profileImage: uploadedProfileImage,
          identityDocument: uploadedIdentityDocument,
          status: UserVerificationStatus.PENDING,
          submittedAt: expect.any(Date),
        });
      });

      it('notifies every admin about the new request', async () => {
        userVerificationSchema.create.mockResolvedValue({ id: 'created-1' });

        await service.create(userId, makeFormData());

        expect(userSchema.findAll).toHaveBeenCalledWith({
          where: { role: UserRole.ADMIN },
        });
        expect(notificationsService.create).toHaveBeenCalledTimes(2);
        expect(notificationsService.create).toHaveBeenCalledWith({
          senderId: userId,
          receiverId: 'admin-1',
          targetId: 'created-1',
          type: NotificationType.USER_VERIFICATION,
          message: 'A new identity verification request has been submitted.',
          link: '/admin',
        });
        expect(notificationsService.create).toHaveBeenCalledWith(
          expect.objectContaining({ receiverId: 'admin-2' }),
        );
      });

      it('returns the created verification', async () => {
        const verification = { id: 'created-1' };
        userVerificationSchema.create.mockResolvedValue(verification);

        const result = await service.create(userId, makeFormData());

        expect(plain(result)).toEqual({
          type: 'created',
          data: verification,
        });
      });
    });

    describe('resubmission', () => {
      let existing: FakeVerification;

      beforeEach(() => {
        existing = makeVerification({
          status: UserVerificationStatus.REJECTED,
          profileImage: { url: 'old-face.png', publicId: 'old-face' },
          identityDocument: { url: 'old-id.png', publicId: 'old-id' },
          rejectionReason: 'Blurry photo',
          reviewedBy: adminId,
          reviewedAt: new Date('2026-01-01'),
        });
        userVerificationSchema.findOne.mockResolvedValue(existing);
      });

      it('deletes the images of the rejected request', async () => {
        await service.create(userId, makeFormData());

        expect(cloudinaryManager.destroy).toHaveBeenCalledTimes(2);
        expect(cloudinaryManager.destroy).toHaveBeenCalledWith('old-face');
        expect(cloudinaryManager.destroy).toHaveBeenCalledWith('old-id');
      });

      it('puts the new images back on the same request and sends it to review again', async () => {
        await service.create(userId, makeFormData());

        expect(existing.profileImage).toEqual(uploadedProfileImage);
        expect(existing.identityDocument).toEqual(uploadedIdentityDocument);
        expect(existing.status).toBe(UserVerificationStatus.PENDING);
        expect(existing.rejectionReason).toBeNull();
        expect(existing.reviewedBy).toBeNull();
        expect(existing.reviewedAt).toBeNull();
        expect(existing.submittedAt).toBeInstanceOf(Date);
        expect(existing.save).toHaveBeenCalledTimes(1);
        expect(userVerificationSchema.create).not.toHaveBeenCalled();
      });

      it('works for a request that was reset by tryAgain (no status, no images)', async () => {
        existing = makeVerification({ status: null });
        userVerificationSchema.findOne.mockResolvedValue(existing);

        const result = await service.create(userId, makeFormData());

        expect(cloudinaryManager.destroy).not.toHaveBeenCalled();
        expect(existing.status).toBe(UserVerificationStatus.PENDING);
        expect(plain(result)).toMatchObject({ type: 'resubmitted' });
      });

      it('notifies every admin that the request was resubmitted', async () => {
        await service.create(userId, makeFormData());

        expect(notificationsService.create).toHaveBeenCalledTimes(2);
        expect(notificationsService.create).toHaveBeenCalledWith({
          senderId: userId,
          receiverId: 'admin-1',
          targetId: verificationId,
          type: NotificationType.USER_VERIFICATION,
          message: 'A user has resubmitted an identity verification request.',
          link: '/admin',
        });
      });

      it('returns the updated verification', async () => {
        const result = await service.create(userId, makeFormData());

        expect(plain(result)).toEqual({
          type: 'resubmitted',
          data: existing,
        });
      });
    });

    it.todo(
      "returns 400 when the profile image or the identity document is missing or isn't a file (they are cast to File and sent to Cloudinary as they are)",
    );

    it.todo(
      'deletes the uploaded profile image when uploading the identity document fails (it stays on Cloudinary today)',
    );

    it.todo(
      'keeps the images of the rejected request until the new ones are uploaded and saved (they are deleted first)',
    );
  });

  // ───────────────────────── findPending ─────────────────────────
  describe('findPending', () => {
    it('lists pending requests with the default page and limit, oldest first', async () => {
      await service.findPending();

      expect(userVerificationSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: UserVerificationStatus.PENDING },
          include: [expect.objectContaining({ as: 'user' })],
          order: [['submittedAt', 'ASC']],
          limit: 10,
          offset: 0,
        }),
      );
    });

    it('derives the offset from the page and limit', async () => {
      await service.findPending(3, 5);

      expect(userVerificationSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5, offset: 10 }),
      );
    });

    it('returns the requests with the total, the page and the limit', async () => {
      const rows = [{ id: 'v1' }, { id: 'v2' }];
      userVerificationSchema.findAndCountAll.mockResolvedValue({
        rows,
        count: 12,
      });

      const result = await service.findPending(2, 5);

      expect(plain(result)).toEqual({
        verifications: rows,
        total: 12,
        page: 2,
        limit: 5,
      });
    });
  });

  // ───────────────────────── tryAgain ─────────────────────────
  describe('tryAgain', () => {
    it('returns 404 when the user has no request', async () => {
      userVerificationSchema.findOne.mockResolvedValue(null);

      const result = await service.tryAgain(userId);

      expect(userVerificationSchema.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'No verification request was found for this user.',
      });
    });

    it('returns 400 when the request is pending review', async () => {
      userVerificationSchema.findOne.mockResolvedValue(
        makeVerification({ status: UserVerificationStatus.PENDING }),
      );

      const result = await service.tryAgain(userId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Your verification request is already pending review.',
      });
    });

    it('returns 400 when the account is already verified', async () => {
      userVerificationSchema.findOne.mockResolvedValue(
        makeVerification({ status: UserVerificationStatus.APPROVED }),
      );

      const result = await service.tryAgain(userId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Your account has already been verified.',
      });
    });

    it('deletes the images and resets the rejected request', async () => {
      const verification = makeVerification({
        status: UserVerificationStatus.REJECTED,
        profileImage: { url: 'face.png', publicId: 'face' },
        identityDocument: { url: 'id.png', publicId: 'id' },
        rejectionReason: 'Blurry photo',
        reviewedBy: adminId,
        reviewedAt: new Date(),
        submittedAt: new Date(),
      });
      userVerificationSchema.findOne.mockResolvedValue(verification);

      const result = await service.tryAgain(userId);

      expect(cloudinaryManager.destroy).toHaveBeenCalledTimes(2);
      expect(cloudinaryManager.destroy).toHaveBeenCalledWith('face');
      expect(cloudinaryManager.destroy).toHaveBeenCalledWith('id');
      expect(verification.profileImage).toBeNull();
      expect(verification.identityDocument).toBeNull();
      expect(verification.status).toBeNull();
      expect(verification.rejectionReason).toBeNull();
      expect(verification.reviewedBy).toBeNull();
      expect(verification.reviewedAt).toBeNull();
      expect(verification.submittedAt).toBeNull();
      expect(verification.save).toHaveBeenCalledTimes(1);
      expect(plain(result)).toEqual({ data: verification });
    });
  });

  // ───────────────────────── update ─────────────────────────
  describe('update', () => {
    const approveBody = {
      status: UserVerificationStatus.APPROVED,
      rejectionReason: null,
    };
    const rejectBody = {
      status: UserVerificationStatus.REJECTED,
      rejectionReason: '  Blurry photo  ',
    };

    let verification: FakeVerification;

    // A pending request that the admin is reviewing; each test breaks one thing.
    beforeEach(() => {
      verification = makeVerification({
        status: UserVerificationStatus.PENDING,
      });
      userVerificationSchema.findByPk.mockResolvedValue(verification);
      spyOn(Validator, 'validate').mockReturnValue(
        makeValidation(true, [], approveBody),
      );
    });

    it("returns 404 when the request doesn't exist", async () => {
      userVerificationSchema.findByPk.mockResolvedValue(null);

      const result = await service.update(adminId, verificationId, approveBody);

      expect(userVerificationSchema.findByPk).toHaveBeenCalledWith(
        verificationId,
      );
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'No verification request was found for this user.',
      });
    });

    it("returns 400 when the request isn't pending review", async () => {
      userVerificationSchema.findByPk.mockResolvedValue(
        makeVerification({ status: UserVerificationStatus.APPROVED }),
      );

      const result = await service.update(adminId, verificationId, approveBody);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'This verification request is not pending review.',
      });
      expect(Validator.validate).not.toHaveBeenCalled();
    });

    it('validates the body with the update rule', async () => {
      await service.update(adminId, verificationId, approveBody);

      expect(Validator.validate).toHaveBeenCalledWith(
        approveBody,
        UpdateUserVerificationRule,
      );
    });

    it('returns 422 with the validation errors', async () => {
      const errors = [{ field: 'status', message: 'Status is invalid' }];
      spyOn(Validator, 'validate').mockReturnValue(
        makeValidation(false, errors),
      );

      const result = await service.update(adminId, verificationId, approveBody);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors,
      });
      expect(verification.save).not.toHaveBeenCalled();
    });

    it('returns 400 when rejecting without a reason', async () => {
      spyOn(Validator, 'validate').mockReturnValue(
        makeValidation(true, [], {
          status: UserVerificationStatus.REJECTED,
          rejectionReason: '   ',
        }),
      );

      const result = await service.update(adminId, verificationId, {
        status: UserVerificationStatus.REJECTED,
        rejectionReason: '   ',
      });

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message:
          'A rejection reason is required when rejecting a verification request.',
      });
      expect(verification.save).not.toHaveBeenCalled();
      expect(notificationsService.create).not.toHaveBeenCalled();
    });

    it('approves the request and records the reviewer', async () => {
      const result = await service.update(adminId, verificationId, approveBody);

      expect(verification.status).toBe(UserVerificationStatus.APPROVED);
      expect(verification.rejectionReason).toBe(
        'Congratulations! Your identity has been verified successfully.',
      );
      expect(verification.reviewedBy).toBe(adminId);
      expect(verification.reviewedAt).toBeInstanceOf(Date);
      expect(verification.save).toHaveBeenCalledTimes(1);
      expect(plain(result)).toEqual({ data: verification });
    });

    it('notifies the user that the request was approved', async () => {
      await service.update(adminId, verificationId, approveBody);

      expect(notificationsService.create).toHaveBeenCalledWith({
        senderId: adminId,
        receiverId: userId,
        targetId: verificationId,
        type: NotificationType.USER_VERIFICATION_APPROVED,
        message: 'Your identity verification has been approved.',
        link: '/identity-verification',
      });
    });

    it('rejects the request with the trimmed reason and records the reviewer', async () => {
      spyOn(Validator, 'validate').mockReturnValue(
        makeValidation(true, [], rejectBody),
      );

      await service.update(adminId, verificationId, rejectBody);

      expect(verification.status).toBe(UserVerificationStatus.REJECTED);
      expect(verification.rejectionReason).toBe('Blurry photo');
      expect(verification.reviewedBy).toBe(adminId);
      expect(verification.reviewedAt).toBeInstanceOf(Date);
      expect(verification.save).toHaveBeenCalledTimes(1);
    });

    it('notifies the user that the request was rejected', async () => {
      spyOn(Validator, 'validate').mockReturnValue(
        makeValidation(true, [], rejectBody),
      );

      await service.update(adminId, verificationId, rejectBody);

      expect(notificationsService.create).toHaveBeenCalledWith({
        senderId: adminId,
        receiverId: userId,
        targetId: verificationId,
        type: NotificationType.USER_VERIFICATION_REJECTED,
        message: 'Your identity verification has been rejected.',
        link: '/identity-verification',
      });
    });
  });
});
