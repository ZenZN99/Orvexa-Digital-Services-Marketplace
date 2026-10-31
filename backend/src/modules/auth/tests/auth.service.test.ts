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
import bcrypt from 'bcryptjs';
import { CookieManager } from '@riser-bob/cookie';
import { Validator, type SpongRequest } from 'riser-bob';
import type { TokenManager } from '../../../config/token/token';
import { JobTitle } from '../../freelancers/schemas/enums/freelancers.enum';
import type { FreelancerSchema } from '../../freelancers/schemas/freelancer.schema';
import type { UserProfileSchema } from '../../user-profiles/schemas/user-profile.schema';
import type { UserVerificationSchema } from '../../user-verifications/schemas/user-verification.schema';
import { UserRole } from '../../users/schemas/enums/users.enum';
import type {
  AuthenticationUser,
  UserSchema,
} from '../../users/schemas/user.schema';
import { AuthService } from '../auth.service';

// ───────────────────────── types ─────────────────────────

type RegisterBody = Parameters<AuthService['register']>[0];
type LoginBody = Parameters<AuthService['login']>[0];

type ValidationResult = ReturnType<typeof Validator.validate>;
type CookieJar = ReturnType<typeof CookieManager.fromRequest>;

type HashMock = Mock<(value: string, salt: number) => Promise<string>>;
type CompareMock = Mock<(value: string, hash: string) => Promise<boolean>>;

interface TokenPayload {
  id: number;
  isActive: boolean;
  role: UserRole;
}

interface FakeUserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  refreshToken: string | null;
  lastLoginAt: Date | null;
}

interface FakeUser extends FakeUserData {
  save: Mock<() => Promise<void>>;
  // mimics Sequelize's `instance.get({ plain: true })`
  get: Mock<(options?: { plain?: boolean }) => FakeUserData>;
}

interface FakeUserSchema {
  findOne: Mock<(options: unknown) => Promise<FakeUser | null>>;
  findByPk: Mock<(id: number) => Promise<FakeUser | null>>;
  create: Mock<(data: unknown) => Promise<FakeUser>>;
}

interface FakeUserProfileSchema {
  create: Mock<(data: unknown) => Promise<object>>;
  findOne: Mock<(options: unknown) => Promise<object | null>>;
}

interface FakeFreelancerSchema {
  create: Mock<(data: unknown) => Promise<object>>;
}

interface FakeUserVerificationSchema {
  findOne: Mock<(options: unknown) => Promise<object | null>>;
}

interface FakeTokenManager {
  generateAccessToken: Mock<(payload: TokenPayload) => string>;
  generateRefreshToken: Mock<(payload: TokenPayload) => string>;
  verifyRefreshToken: Mock<(token: string) => { id: number } | null>;
}

interface FakeCookies {
  set: Mock<(name: string, value: string, options: unknown) => void>;
  get: Mock<(name: string) => string | undefined>;
  delete: Mock<(name: string, options: unknown) => void>;
  applyTo: Mock<(response: Response) => Response>;
}

interface AuthResponseBody {
  success: boolean;
  message: string;
  data?: { id: number; email: string };
}

// ───────────────────────── helpers ─────────────────────────

// any role different from FREELANCER (so the test doesn't depend on the enum's exact keys)
const otherRole = Object.values(UserRole).find(
  (role) => role !== UserRole.FREELANCER,
) as UserRole;

const registerBody: RegisterBody = {
  firstName: 'Zen',
  lastName: 'Allaham',
  email: 'zen@example.com',
  password: 'Password123!',
  role: UserRole.FREELANCER,
};

const loginBody: LoginBody = {
  email: 'zen@example.com',
  password: 'Password123!',
};

const unauthenticated = {
  error: true,
  message: 'You are not authenticated',
} as const;

const makeUser = (overrides: Partial<FakeUser> = {}): FakeUser => {
  const user: FakeUser = {
    id: 1,
    firstName: 'Zen',
    lastName: 'Allaham',
    email: 'zen@example.com',
    password: 'hashed-password',
    role: UserRole.FREELANCER,
    isActive: true,
    refreshToken: null,
    lastLoginAt: null,
    save: mock(async (): Promise<void> => {}),
    // returns the current state of the user (read lazily, so changes made
    // by the service after creation are reflected), without the methods
    get: mock((_options?: { plain?: boolean }): FakeUserData => {
      const { save: _save, get: _get, ...plain } = user;
      return plain;
    }),
    ...overrides,
  };
  return user;
};

const tokenPayloadOf = (user: FakeUser): TokenPayload => ({
  id: user.id,
  isActive: user.isActive,
  role: user.role,
});

const makeCookies = (): FakeCookies => ({
  set: mock((_name: string, _value: string, _options: unknown): void => {}),
  get: mock((_name: string): string | undefined => undefined),
  delete: mock((_name: string, _options: unknown): void => {}),
  applyTo: mock((response: Response): Response => response),
});

const asValidation = (result: {
  valid: boolean;
  data?: unknown;
  errors?: unknown;
}): ValidationResult => result as unknown as ValidationResult;

const asResponse = (result: unknown): Response => {
  expect(result).toBeInstanceOf(Response);
  return result as Response;
};

const readJson = async <T>(response: Response): Promise<T> =>
  (await response.json()) as T;

// ───────────────────────── tests ─────────────────────────

describe('AuthService', () => {
  let service: AuthService;
  let userSchema: FakeUserSchema;
  let userProfileSchema: FakeUserProfileSchema;
  let freelancerSchema: FakeFreelancerSchema;
  let userVerificationSchema: FakeUserVerificationSchema;
  let tokenManager: FakeTokenManager;
  let cookies: FakeCookies;

  let validateSpy: Mock<typeof Validator.validate>;
  let fromRequestSpy: Mock<typeof CookieManager.fromRequest>;
  let hashSpy: HashMock;
  let compareSpy: CompareMock;

  const spongReq = {
    request: new Request('http://localhost/auth'),
  } as unknown as SpongRequest;

  beforeEach(() => {
    userSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeUser | null> => null,
      ),
      findByPk: mock(async (_id: number): Promise<FakeUser | null> => null),
      create: mock(async (_data: unknown): Promise<FakeUser> => makeUser()),
    };
    userProfileSchema = {
      create: mock(async (_data: unknown): Promise<object> => ({})),
      findOne: mock(async (_options: unknown): Promise<object | null> => null),
    };
    freelancerSchema = {
      create: mock(async (_data: unknown): Promise<object> => ({})),
    };
    userVerificationSchema = {
      findOne: mock(async (_options: unknown): Promise<object | null> => null),
    };
    tokenManager = {
      generateAccessToken: mock(
        (_payload: TokenPayload): string => 'access-token',
      ),
      generateRefreshToken: mock(
        (_payload: TokenPayload): string => 'refresh-token',
      ),
      verifyRefreshToken: mock((_token: string): { id: number } | null => null),
    };
    cookies = makeCookies();

    validateSpy = spyOn(Validator, 'validate');
    fromRequestSpy = spyOn(CookieManager, 'fromRequest');
    fromRequestSpy.mockReturnValue(cookies as unknown as CookieJar);

    hashSpy = spyOn(bcrypt, 'hash') as unknown as HashMock;
    hashSpy.mockResolvedValue('hashed-value');
    compareSpy = spyOn(bcrypt, 'compare') as unknown as CompareMock;
    compareSpy.mockResolvedValue(true);

    service = new AuthService(
      userSchema as unknown as typeof UserSchema,
      userProfileSchema as unknown as typeof UserProfileSchema,
      freelancerSchema as unknown as typeof FreelancerSchema,
      userVerificationSchema as unknown as typeof UserVerificationSchema,
      tokenManager as unknown as TokenManager,
    );
  });

  afterEach(() => {
    validateSpy.mockRestore();
    fromRequestSpy.mockRestore();
    hashSpy.mockRestore();
    compareSpy.mockRestore();
  });

  // ───────────────────────── register ─────────────────────────
  describe('register', () => {
    it('returns 422 when validation fails', async () => {
      const errors = { email: ['Invalid email'] };
      validateSpy.mockReturnValue(asValidation({ valid: false, errors }));

      const result = await service.register(registerBody, spongReq);

      expect(result).toEqual({
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors,
      });
      expect(userSchema.findOne).not.toHaveBeenCalled();
      expect(userSchema.create).not.toHaveBeenCalled();
    });

    it('returns 400 with a generic message when the email already exists', async () => {
      validateSpy.mockReturnValue(
        asValidation({ valid: true, data: registerBody }),
      );
      userSchema.findOne.mockResolvedValue(makeUser());

      const result = await service.register(registerBody, spongReq);

      expect(userSchema.findOne).toHaveBeenCalledWith({
        where: { email: registerBody.email },
      });
      expect(result).toEqual({
        error: true,
        statusCode: 400,
        message: 'Unable to complete registration',
      });
      expect(userSchema.create).not.toHaveBeenCalled();
      expect(hashSpy).not.toHaveBeenCalled();
    });

    it('creates user, profile and freelancer, then sets cookies and returns 201', async () => {
      const newUser = makeUser();
      validateSpy.mockReturnValue(
        asValidation({ valid: true, data: registerBody }),
      );
      hashSpy
        .mockResolvedValueOnce('hashed-password')
        .mockResolvedValueOnce('hashed-refresh');
      userSchema.create.mockResolvedValue(newUser);

      const response = asResponse(
        await service.register(registerBody, spongReq),
      );

      expect(hashSpy).toHaveBeenNthCalledWith(1, registerBody.password, 12);
      expect(userSchema.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Zen',
          lastName: 'Allaham',
          email: registerBody.email,
          password: 'hashed-password',
          role: UserRole.FREELANCER,
          isActive: true,
          balance: 0,
          frozenBalance: 0,
        }),
      );
      expect(userProfileSchema.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: newUser.id, bio: 'No bio yet.' }),
      );
      expect(freelancerSchema.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: newUser.id,
          jobTitle: JobTitle.NO_JOB_TITLE,
          skills: [],
          completedOrders: 0,
          ratingCount: 0,
          ratingAverage: 0,
        }),
      );

      // both tokens are generated from the id, the active flag and the role
      expect(tokenManager.generateAccessToken).toHaveBeenCalledWith(
        tokenPayloadOf(newUser),
      );
      expect(tokenManager.generateRefreshToken).toHaveBeenCalledWith(
        tokenPayloadOf(newUser),
      );

      // refresh token is stored hashed, never raw
      expect(hashSpy).toHaveBeenNthCalledWith(2, 'refresh-token', 12);
      expect(newUser.refreshToken).toBe('hashed-refresh');
      expect(newUser.save).toHaveBeenCalledTimes(1);

      expect(cookies.set).toHaveBeenCalledWith(
        'token',
        'access-token',
        expect.objectContaining({
          httpOnly: true,
          maxAge: 365 * 24 * 60 * 60 * 1000,
        }),
      );
      expect(cookies.set).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        }),
      );
      expect(cookies.applyTo).toHaveBeenCalledTimes(1);

      expect(response.status).toBe(201);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      const json = await readJson<AuthResponseBody>(response);
      expect(json.success).toBe(true);
      expect(json.message).toBe('Account created successfully');
      expect(json.data?.id).toBe(newUser.id);
      expect(json.data?.email).toBe(newUser.email);
    });

    it('defaults the role to FREELANCER when validation returns no role', async () => {
      const newUser = makeUser();
      validateSpy.mockReturnValue(
        asValidation({
          valid: true,
          data: { ...registerBody, role: undefined },
        }),
      );
      userSchema.create.mockResolvedValue(newUser);

      await service.register(registerBody, spongReq);

      expect(userSchema.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.FREELANCER }),
      );
      expect(freelancerSchema.create).toHaveBeenCalledTimes(1);
    });

    it('does not create a freelancer record for non-freelancer roles', async () => {
      const newUser = makeUser({ role: otherRole });
      validateSpy.mockReturnValue(
        asValidation({
          valid: true,
          data: { ...registerBody, role: otherRole },
        }),
      );
      userSchema.create.mockResolvedValue(newUser);

      const response = asResponse(
        await service.register({ ...registerBody, role: otherRole }, spongReq),
      );

      expect(userProfileSchema.create).toHaveBeenCalledTimes(1);
      expect(freelancerSchema.create).not.toHaveBeenCalled();
      expect(tokenManager.generateAccessToken).toHaveBeenCalledWith(
        expect.objectContaining({ role: otherRole }),
      );
      expect(response.status).toBe(201);
    });
  });

  // ───────────────────────── login ─────────────────────────
  describe('login', () => {
    it('returns 422 when validation fails', async () => {
      const errors = { password: ['Required'] };
      validateSpy.mockReturnValue(asValidation({ valid: false, errors }));

      const result = await service.login(loginBody, spongReq);

      expect(result).toEqual({
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors,
      });
      expect(userSchema.findOne).not.toHaveBeenCalled();
    });

    it('returns 400 when the user does not exist', async () => {
      validateSpy.mockReturnValue(
        asValidation({ valid: true, data: loginBody }),
      );
      userSchema.findOne.mockResolvedValue(null);

      const result = await service.login(loginBody, spongReq);

      expect(result).toEqual({
        error: true,
        statusCode: 400,
        message: 'Invalid email or password',
      });
      expect(compareSpy).not.toHaveBeenCalled();
    });

    it('returns the same 400 message when the password is wrong', async () => {
      const user = makeUser();
      validateSpy.mockReturnValue(
        asValidation({ valid: true, data: loginBody }),
      );
      userSchema.findOne.mockResolvedValue(user);
      compareSpy.mockResolvedValue(false);

      const result = await service.login(loginBody, spongReq);

      expect(compareSpy).toHaveBeenCalledWith(
        loginBody.password,
        user.password,
      );
      expect(result).toEqual({
        error: true,
        statusCode: 400,
        message: 'Invalid email or password',
      });
      expect(user.save).not.toHaveBeenCalled();
      expect(cookies.set).not.toHaveBeenCalled();
    });

    it('logs the user in, rotates the refresh token and sets cookies', async () => {
      const user = makeUser();
      validateSpy.mockReturnValue(
        asValidation({ valid: true, data: loginBody }),
      );
      userSchema.findOne.mockResolvedValue(user);
      compareSpy.mockResolvedValue(true);
      hashSpy.mockResolvedValue('hashed-refresh');

      const before = Date.now();
      const response = asResponse(await service.login(loginBody, spongReq));

      expect(userSchema.findOne).toHaveBeenCalledWith({
        where: { email: loginBody.email },
      });
      expect(tokenManager.generateAccessToken).toHaveBeenCalledWith(
        tokenPayloadOf(user),
      );
      expect(tokenManager.generateRefreshToken).toHaveBeenCalledWith(
        tokenPayloadOf(user),
      );
      expect(hashSpy).toHaveBeenCalledWith('refresh-token', 12);
      expect(user.refreshToken).toBe('hashed-refresh');
      expect(user.lastLoginAt).toBeInstanceOf(Date);
      expect(user.lastLoginAt?.getTime()).toBeGreaterThanOrEqual(before);
      expect(user.save).toHaveBeenCalledTimes(1);

      expect(cookies.set).toHaveBeenCalledWith(
        'token',
        'access-token',
        expect.any(Object),
      );
      expect(cookies.set).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.any(Object),
      );

      expect(response.status).toBe(200);
      const json = await readJson<AuthResponseBody>(response);
      expect(json.success).toBe(true);
      expect(json.message).toBe('Logged in successfully');
      expect(json.data?.id).toBe(user.id);
    });

    it.todo(
      'returns a sanitized user without the password and the refresh token (it serializes the whole user today)',
    );
  });

  // ───────────────────────── logout ─────────────────────────
  describe('logout', () => {
    it('deletes both cookies and returns 200', async () => {
      const response = asResponse(await service.logout(spongReq));

      expect(cookies.delete).toHaveBeenCalledWith(
        'token',
        expect.objectContaining({ maxAge: 0 }),
      );
      expect(cookies.delete).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({ path: '/' }),
      );
      expect(cookies.applyTo).toHaveBeenCalledTimes(1);

      expect(response.status).toBe(200);
      expect(await readJson<AuthResponseBody>(response)).toEqual({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });

  // ───────────────────────── me ─────────────────────────
  describe('me', () => {
    it('throws when the user no longer exists', async () => {
      const currentUser = makeUser();
      userSchema.findByPk.mockResolvedValue(null);

      await expect(
        service.me(currentUser as unknown as AuthenticationUser),
      ).rejects.toThrow('User not found');

      expect(userSchema.findByPk).toHaveBeenCalledWith(currentUser.id);
      expect(userProfileSchema.findOne).not.toHaveBeenCalled();
      expect(userVerificationSchema.findOne).not.toHaveBeenCalled();
    });

    it('returns the user together with profile and verification', async () => {
      const currentUser = makeUser();
      const profile = { id: 10, avatar: {}, cover: {}, bio: 'Hello' };
      const verification = {
        id: 20,
        status: 'pending',
        submittedAt: new Date(),
        rejectionReason: null,
      };
      userSchema.findByPk.mockResolvedValue(currentUser);
      userProfileSchema.findOne.mockResolvedValue(profile);
      userVerificationSchema.findOne.mockResolvedValue(verification);

      const result = await service.me(
        currentUser as unknown as AuthenticationUser,
      );

      expect(userSchema.findByPk).toHaveBeenCalledWith(currentUser.id);
      expect(userProfileSchema.findOne).toHaveBeenCalledWith({
        where: { userId: currentUser.id },
        attributes: ['id', 'avatar', 'cover', 'bio'],
      });
      expect(userVerificationSchema.findOne).toHaveBeenCalledWith({
        where: { userId: currentUser.id },
        attributes: ['id', 'status', 'submittedAt', 'rejectionReason'],
      });
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        id: currentUser.id,
        profile,
        verification,
      });
    });

    it("returns null profile/verification when they don't exist", async () => {
      const currentUser = makeUser();
      userSchema.findByPk.mockResolvedValue(currentUser);

      const result = await service.me(
        currentUser as unknown as AuthenticationUser,
      );

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        profile: null,
        verification: null,
      });
    });
  });

  // ───────────────────────── refreshToken ─────────────────────────
  describe('refreshToken', () => {
    it('fails when there is no refresh token cookie', async () => {
      cookies.get.mockReturnValue(undefined);

      const result = await service.refreshToken(spongReq);

      expect(result).toEqual(unauthenticated);
      expect(tokenManager.verifyRefreshToken).not.toHaveBeenCalled();
    });

    it('fails when the refresh token is invalid', async () => {
      cookies.get.mockReturnValue('bad-token');
      tokenManager.verifyRefreshToken.mockReturnValue(null);

      const result = await service.refreshToken(spongReq);

      expect(tokenManager.verifyRefreshToken).toHaveBeenCalledWith('bad-token');
      expect(result).toEqual(unauthenticated);
      expect(userSchema.findByPk).not.toHaveBeenCalled();
    });

    it('fails when the user does not exist', async () => {
      cookies.get.mockReturnValue('refresh-token');
      tokenManager.verifyRefreshToken.mockReturnValue({ id: 1 });
      userSchema.findByPk.mockResolvedValue(null);

      const result = await service.refreshToken(spongReq);

      expect(userSchema.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(unauthenticated);
    });

    it('fails when the user has no stored refresh token', async () => {
      cookies.get.mockReturnValue('refresh-token');
      tokenManager.verifyRefreshToken.mockReturnValue({ id: 1 });
      userSchema.findByPk.mockResolvedValue(makeUser({ refreshToken: null }));

      const result = await service.refreshToken(spongReq);

      expect(result).toEqual(unauthenticated);
      expect(compareSpy).not.toHaveBeenCalled();
    });

    it("fails when the refresh token doesn't match the stored hash", async () => {
      const user = makeUser({ refreshToken: 'stored-hash' });
      cookies.get.mockReturnValue('refresh-token');
      tokenManager.verifyRefreshToken.mockReturnValue({ id: 1 });
      userSchema.findByPk.mockResolvedValue(user);
      compareSpy.mockResolvedValue(false);

      const result = await service.refreshToken(spongReq);

      expect(compareSpy).toHaveBeenCalledWith('refresh-token', 'stored-hash');
      expect(result).toEqual(unauthenticated);
      expect(cookies.set).not.toHaveBeenCalled();
    });

    it('issues a new access token cookie on success', async () => {
      const user = makeUser({ refreshToken: 'stored-hash' });
      cookies.get.mockReturnValue('refresh-token');
      tokenManager.verifyRefreshToken.mockReturnValue({ id: 1 });
      userSchema.findByPk.mockResolvedValue(user);
      compareSpy.mockResolvedValue(true);

      const response = asResponse(await service.refreshToken(spongReq));

      expect(tokenManager.generateAccessToken).toHaveBeenCalledWith(
        tokenPayloadOf(user),
      );
      expect(tokenManager.generateRefreshToken).not.toHaveBeenCalled();
      expect(cookies.set).toHaveBeenCalledTimes(1);
      expect(cookies.set).toHaveBeenCalledWith(
        'token',
        'access-token',
        expect.any(Object),
      );

      expect(response.status).toBe(200);
      expect(await readJson<AuthResponseBody>(response)).toEqual({
        success: true,
        message: 'Access token refreshed successfully',
      });
    });
  });
});
