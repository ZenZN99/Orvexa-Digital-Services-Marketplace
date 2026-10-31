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
import { Op } from 'sequelize';
import type { CloudinaryManager } from '../../../config/cloudinary/cloudinary';
import type { MessageGateway } from '../../../config/gateways/message.gateway';
import type { ContractSchema } from '../../contracts/schemas/contract.schema';
import { ContractStatus } from '../../contracts/schemas/enums/contract.enum';
import type { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../notifications/schemas/enums/notification.enum';
import { UserRole } from '../../users/schemas/enums/users.enum';
import type { AuthenticationUser } from '../../users/schemas/user.schema';
import { MessagesService } from '../messages.service';
import { CreateMessageRule } from '../rules/create';
import type { MessageSchema } from '../schemas/message.schema';

// ───────────────────────── types ─────────────────────────

type ValidationResult = ReturnType<typeof Validator.validate>;

interface FakeImage {
  url: string;
  publicId: string;
}

interface FakeContract {
  id: string;
  clientId: string;
  status: ContractStatus;
  freelancer: { id: string; userId: string };
}

interface FakeMessage {
  id: string;
  images: FakeImage[];
  sender: { id: string };
  contract: {
    id: string;
    status: ContractStatus;
    clientId: string;
    freelancerId: string;
    freelancer: { id: string; userId: string };
  };
  destroy: Mock<() => Promise<void>>;
}

interface FakeMessageSchema {
  create: Mock<(data: unknown) => Promise<FakeMessage>>;
  findAndCountAll: Mock<
    (options: unknown) => Promise<{ rows: unknown[]; count: number }>
  >;
  findAll: Mock<(options: unknown) => Promise<unknown[]>>;
  findOne: Mock<(options: unknown) => Promise<FakeMessage | null>>;
}

interface FakeContractSchema {
  findOne: Mock<(options: unknown) => Promise<FakeContract | null>>;
}

interface FakeCloudinary {
  upload: Mock<(file: File, folder: string) => Promise<FakeImage>>;
  destroy: Mock<(publicId: string) => Promise<void>>;
}

interface FakeNotificationsService {
  create: Mock<(data: unknown) => Promise<void>>;
}

interface FakeGateway {
  sendMessage: Mock<(payload: unknown) => void>;
  sendMessageDeleted: Mock<(payload: unknown) => void>;
}

// ───────────────────────── helpers ─────────────────────────

const userId = 'user-1';
const clientId = 'client-1';
const freelancerUserId = 'freelancer-user-1';
const contractId = 'contract-1';
const messageId = 'message-1';

const nonAdminRole = Object.values(UserRole).find(
  (role) => role !== UserRole.ADMIN,
) as UserRole;

const MB = 1024 * 1024;

const makeFile = (name: string, type: string, size = 10): File =>
  new File([new Uint8Array(size)], name, { type });

const makeFormData = (
  fields: { content?: string; images?: File[] } = {},
): FormData => {
  const formData = new FormData();
  if (fields.content !== undefined) formData.append('content', fields.content);
  for (const image of fields.images ?? []) formData.append('images', image);
  return formData;
};

const makeContract = (overrides: Partial<FakeContract> = {}): FakeContract => ({
  id: contractId,
  clientId,
  status: ContractStatus.IN_PROGRESS,
  freelancer: { id: 'freelancer-1', userId: freelancerUserId },
  ...overrides,
});

const makeMessage = (overrides: Partial<FakeMessage> = {}): FakeMessage => ({
  id: messageId,
  images: [
    { url: 'https://cdn/1.png', publicId: 'public-1' },
    { url: 'https://cdn/2.png', publicId: 'public-2' },
  ],
  sender: { id: userId },
  contract: {
    id: contractId,
    status: ContractStatus.IN_PROGRESS,
    clientId,
    freelancerId: 'freelancer-1',
    freelancer: { id: 'freelancer-1', userId: freelancerUserId },
  },
  destroy: mock(async (): Promise<void> => {}),
  ...overrides,
});

const makeUser = (id: string, role: UserRole): AuthenticationUser =>
  ({ id, role }) as unknown as AuthenticationUser;

const asValidation = (result: {
  valid: boolean;
  data?: unknown;
  errors?: unknown;
}): ValidationResult => result as unknown as ValidationResult;

// Compare results without fighting the service's narrow `as const` return types.
const plain = (value: unknown): unknown => value;

// ───────────────────────── tests ─────────────────────────

describe('MessagesService', () => {
  let messageSchema: FakeMessageSchema;
  let contractSchema: FakeContractSchema;
  let cloudinary: FakeCloudinary;
  let notificationsService: FakeNotificationsService;
  let messageGateway: FakeGateway;
  let service: MessagesService;
  let validateSpy: Mock<typeof Validator.validate>;

  beforeEach(() => {
    messageSchema = {
      create: mock(
        async (_data: unknown): Promise<FakeMessage> => makeMessage(),
      ),
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
        async (_options: unknown): Promise<FakeMessage | null> => null,
      ),
    };
    contractSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeContract | null> => null,
      ),
    };
    cloudinary = {
      upload: mock(
        async (file: File, _folder: string): Promise<FakeImage> => ({
          url: `https://cdn/${file.name}`,
          publicId: `public-${file.name}`,
        }),
      ),
      destroy: mock(async (_publicId: string): Promise<void> => {}),
    };
    notificationsService = {
      create: mock(async (_data: unknown): Promise<void> => {}),
    };
    messageGateway = {
      sendMessage: mock((_payload: unknown): void => {}),
      sendMessageDeleted: mock((_payload: unknown): void => {}),
    };

    validateSpy = spyOn(Validator, 'validate');
    validateSpy.mockReturnValue(asValidation({ valid: true }));

    service = new MessagesService(
      messageSchema as unknown as typeof MessageSchema,
      contractSchema as unknown as typeof ContractSchema,
      cloudinary as unknown as CloudinaryManager,
      notificationsService as unknown as NotificationsService,
      messageGateway as unknown as MessageGateway,
    );
  });

  afterEach(() => {
    validateSpy.mockRestore();
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    it("returns 404 when the user isn't a party of the contract", async () => {
      contractSchema.findOne.mockResolvedValue(null);

      const result = await service.create(
        userId,
        contractId,
        makeFormData({ content: 'Hello' }),
      );

      expect(contractSchema.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: contractId,
            [Op.or]: [{ clientId: userId }, { '$freelancer.userId$': userId }],
          },
        }),
      );
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'Contract not found.',
      });
    });

    it('returns 400 when the contract is not in progress', async () => {
      contractSchema.findOne.mockResolvedValue(
        makeContract({ status: ContractStatus.DELIVERED }),
      );

      const result = await service.create(
        userId,
        contractId,
        makeFormData({ content: 'Hello' }),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Cannot send messages in a closed contract.',
      });
      expect(validateSpy).not.toHaveBeenCalled();
    });

    it('validates the trimmed content and returns 422 on failure', async () => {
      const errors = { content: ['Too long'] };
      contractSchema.findOne.mockResolvedValue(makeContract());
      validateSpy.mockReturnValue(asValidation({ valid: false, errors }));

      const result = await service.create(
        userId,
        contractId,
        makeFormData({ content: '  Hello  ' }),
      );

      expect(validateSpy).toHaveBeenCalledWith(
        { content: 'Hello' },
        CreateMessageRule,
      );
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 422,
        message: 'Validation failed.',
        errors,
      });
      expect(messageSchema.create).not.toHaveBeenCalled();
    });

    it('validates null content when the text is blank', async () => {
      contractSchema.findOne.mockResolvedValue(makeContract());

      await service.create(
        userId,
        contractId,
        makeFormData({ content: '   ' }),
      );

      expect(validateSpy).toHaveBeenCalledWith(
        { content: null },
        CreateMessageRule,
      );
    });

    it('returns 400 when more than 5 images are sent', async () => {
      contractSchema.findOne.mockResolvedValue(makeContract());
      const images = Array.from({ length: 6 }, (_, index) =>
        makeFile(`image-${index}.png`, 'image/png'),
      );

      const result = await service.create(
        userId,
        contractId,
        makeFormData({ images }),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'You can upload a maximum of 5 images.',
      });
      expect(cloudinary.upload).not.toHaveBeenCalled();
    });

    it('returns 400 when an image is bigger than 5 MB', async () => {
      contractSchema.findOne.mockResolvedValue(makeContract());

      const result = await service.create(
        userId,
        contractId,
        makeFormData({
          images: [makeFile('big.png', 'image/png', 5 * MB + 1)],
        }),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Each image must be 5 MB or smaller.',
      });
      expect(cloudinary.upload).not.toHaveBeenCalled();
    });

    it("returns 400 when an image type isn't allowed", async () => {
      contractSchema.findOne.mockResolvedValue(makeContract());

      const result = await service.create(
        userId,
        contractId,
        makeFormData({ images: [makeFile('anim.gif', 'image/gif')] }),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Only JPEG, PNG, and WebP images are allowed.',
      });
      expect(cloudinary.upload).not.toHaveBeenCalled();
    });

    it('returns 400 when the message has neither text nor images', async () => {
      contractSchema.findOne.mockResolvedValue(makeContract());

      // No `content` field at all: the service reads it as `null`.
      const result = await service.create(userId, contractId, makeFormData());

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'A message must contain text or at least one image.',
      });
      expect(messageSchema.create).not.toHaveBeenCalled();
    });

    it('returns 400 when the content is an empty string and there are no images', async () => {
      contractSchema.findOne.mockResolvedValue(makeContract());

      const result = await service.create(
        userId,
        contractId,
        makeFormData({ content: '' }),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'A message must contain text or at least one image.',
      });
      expect(messageSchema.create).not.toHaveBeenCalled();
    });

    it.todo(
      'returns 400 when the content is only whitespace and there are no images (the service checks the untrimmed content, so a blank message is created today)',
    );

    it('creates a text-only message without uploading anything', async () => {
      contractSchema.findOne.mockResolvedValue(makeContract());
      const created = makeMessage({ id: 'new-message' });
      messageSchema.create.mockResolvedValue(created);

      const result = await service.create(
        userId,
        contractId,
        makeFormData({ content: 'Hello' }),
      );

      expect(cloudinary.upload).not.toHaveBeenCalled();
      expect(messageSchema.create).toHaveBeenCalledWith({
        contractId,
        senderId: userId,
        content: 'Hello',
        images: [],
      });
      expect(plain(result)).toEqual({
        success: true,
        message: 'Message created successfully.',
        data: created,
      });
    });

    it('uploads the images to the messages folder and stores their urls', async () => {
      contractSchema.findOne.mockResolvedValue(makeContract());
      const images = [
        makeFile('a.png', 'image/png'),
        makeFile('b.webp', 'image/webp'),
      ];

      await service.create(userId, contractId, makeFormData({ images }));

      expect(cloudinary.upload).toHaveBeenCalledTimes(2);
      expect(cloudinary.upload.mock.calls.map(([file]) => file.name)).toEqual([
        'a.png',
        'b.webp',
      ]);
      expect(cloudinary.upload.mock.calls.map(([, folder]) => folder)).toEqual([
        'messages',
        'messages',
      ]);
      expect(messageSchema.create).toHaveBeenCalledWith({
        contractId,
        senderId: userId,
        content: null,
        images: [
          { url: 'https://cdn/a.png', publicId: 'public-a.png' },
          { url: 'https://cdn/b.webp', publicId: 'public-b.webp' },
        ],
      });
    });

    it('notifies the freelancer and pushes the message when the client sends it', async () => {
      contractSchema.findOne.mockResolvedValue(makeContract());
      const created = makeMessage({ id: 'new-message' });
      messageSchema.create.mockResolvedValue(created);

      await service.create(
        clientId,
        contractId,
        makeFormData({ content: 'Hello' }),
      );

      expect(notificationsService.create).toHaveBeenCalledWith({
        senderId: clientId,
        receiverId: freelancerUserId,
        targetId: 'new-message',
        type: NotificationType.CONTRACT_MESSAGE,
        message: 'You have a new message.',
        link: `/contract/${contractId}`,
      });
      expect(messageGateway.sendMessage).toHaveBeenCalledWith({
        receiverId: freelancerUserId,
        message: created,
      });
    });

    it('notifies the client when the freelancer sends it', async () => {
      contractSchema.findOne.mockResolvedValue(makeContract());
      const created = makeMessage({ id: 'new-message' });
      messageSchema.create.mockResolvedValue(created);

      await service.create(
        freelancerUserId,
        contractId,
        makeFormData({ content: 'Hello' }),
      );

      expect(notificationsService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          senderId: freelancerUserId,
          receiverId: clientId,
        }),
      );
      expect(messageGateway.sendMessage).toHaveBeenCalledWith({
        receiverId: clientId,
        message: created,
      });
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('paginates the messages, newest first', async () => {
      const rows = [{ id: 'm1' }];
      messageSchema.findAndCountAll.mockResolvedValue({ rows, count: 25 });

      const result = await service.findAll(2, 5, 5);

      expect(messageSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 5,
          offset: 5,
          order: [['createdAt', 'DESC']],
        }),
      );
      expect(plain(result)).toMatchObject({ success: true, data: rows });
      expect(result.pagination).toBeDefined();
    });

    it('defaults to page 1 with a limit of 10', async () => {
      await service.findAll();

      expect(messageSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 0 }),
      );
    });

    it.todo(
      'builds the pagination with the same argument order as ContractsService (total, page, limit)',
    );
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it("returns an error when the user isn't a party of the contract", async () => {
      contractSchema.findOne.mockResolvedValue(null);

      const result = await service.findMe(userId, contractId);

      expect(contractSchema.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: contractId,
            [Op.or]: [{ clientId: userId }, { '$freelancer.userId$': userId }],
          },
        }),
      );
      expect(plain(result)).toEqual({
        error: true,
        message: 'Contract not found',
      });
      expect(messageSchema.findAll).not.toHaveBeenCalled();
    });

    it("returns the contract's messages, oldest first", async () => {
      const messages = [{ id: 'm1' }, { id: 'm2' }];
      contractSchema.findOne.mockResolvedValue(makeContract());
      messageSchema.findAll.mockResolvedValue(messages);

      const result = await service.findMe(userId, contractId);

      expect(messageSchema.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { contractId },
          order: [['createdAt', 'ASC']],
        }),
      );
      expect(plain(result)).toEqual({ success: true, data: messages });
    });
  });

  // ───────────────────────── delete ─────────────────────────
  describe('delete', () => {
    it("returns 404 when the message doesn't exist", async () => {
      messageSchema.findOne.mockResolvedValue(null);

      const result = await service.delete(
        makeUser(userId, nonAdminRole),
        messageId,
      );

      expect(messageSchema.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: messageId } }),
      );
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'Message not found',
      });
      expect(messageGateway.sendMessageDeleted).not.toHaveBeenCalled();
    });

    it("returns 403 when a non-admin deletes someone else's message", async () => {
      const message = makeMessage({ sender: { id: 'someone-else' } });
      messageSchema.findOne.mockResolvedValue(message);

      const result = await service.delete(
        makeUser(userId, nonAdminRole),
        messageId,
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 403,
        message: 'You are not allowed to perform this action',
      });
      expect(message.destroy).not.toHaveBeenCalled();
      expect(cloudinary.destroy).not.toHaveBeenCalled();
      expect(messageGateway.sendMessageDeleted).not.toHaveBeenCalled();
    });

    it("returns 400 when the owner deletes after the contract left 'in progress'", async () => {
      const base = makeMessage();
      const message = makeMessage({
        contract: { ...base.contract, status: ContractStatus.DELIVERED },
      });
      messageSchema.findOne.mockResolvedValue(message);

      const result = await service.delete(
        makeUser(userId, nonAdminRole),
        messageId,
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message:
          'Messages can only be managed while the contract is in progress',
      });
      expect(message.destroy).not.toHaveBeenCalled();
      expect(messageGateway.sendMessageDeleted).not.toHaveBeenCalled();
    });

    it('lets the owner delete the message and its images', async () => {
      const message = makeMessage();
      messageSchema.findOne.mockResolvedValue(message);

      const result = await service.delete(
        makeUser(userId, nonAdminRole),
        messageId,
      );

      expect(
        cloudinary.destroy.mock.calls.map(([publicId]) => publicId),
      ).toEqual(['public-1', 'public-2']);
      expect(message.destroy).toHaveBeenCalledTimes(1);
      expect(plain(result)).toEqual({
        success: true,
        message: 'Message deleted successfully',
      });
    });

    it('tells the client the message was deleted when the freelancer is the sender', async () => {
      const message = makeMessage({ sender: { id: userId } });
      messageSchema.findOne.mockResolvedValue(message);

      await service.delete(makeUser(userId, nonAdminRole), messageId);

      // The sender isn't the contract's client, so the client is the receiver.
      expect(messageGateway.sendMessageDeleted).toHaveBeenCalledTimes(1);
      expect(messageGateway.sendMessageDeleted).toHaveBeenCalledWith({
        receiverId: clientId,
        messageId: message.id,
      });
    });

    it('tells the freelancer the message was deleted when the client is the sender', async () => {
      const message = makeMessage({ sender: { id: clientId } });
      messageSchema.findOne.mockResolvedValue(message);

      await service.delete(makeUser(clientId, nonAdminRole), messageId);

      expect(messageGateway.sendMessageDeleted).toHaveBeenCalledTimes(1);
      expect(messageGateway.sendMessageDeleted).toHaveBeenCalledWith({
        receiverId: freelancerUserId,
        messageId: message.id,
      });
    });

    it('lets an admin delete any message, even in a closed contract', async () => {
      const base = makeMessage();
      const message = makeMessage({
        sender: { id: 'someone-else' },
        contract: { ...base.contract, status: ContractStatus.DELIVERED },
      });
      messageSchema.findOne.mockResolvedValue(message);

      const result = await service.delete(
        makeUser('admin-1', UserRole.ADMIN),
        messageId,
      );

      expect(cloudinary.destroy).toHaveBeenCalledTimes(2);
      expect(message.destroy).toHaveBeenCalledTimes(1);
      expect(messageGateway.sendMessageDeleted).toHaveBeenCalledTimes(1);
      expect(plain(result)).toEqual({
        success: true,
        message: 'Message deleted successfully',
      });
    });

    it('deletes a message without images without calling cloudinary', async () => {
      const message = makeMessage({ images: [] });
      messageSchema.findOne.mockResolvedValue(message);

      await service.delete(makeUser(userId, nonAdminRole), messageId);

      expect(cloudinary.destroy).not.toHaveBeenCalled();
      expect(message.destroy).toHaveBeenCalledTimes(1);
      expect(messageGateway.sendMessageDeleted).toHaveBeenCalledTimes(1);
    });
  });
});
