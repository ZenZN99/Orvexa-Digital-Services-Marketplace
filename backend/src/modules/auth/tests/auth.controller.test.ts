import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  type Mock,
} from 'bun:test';
import type { SpongHandler, SpongRequest } from 'riser-bob';
import { UserRole } from '../../users/schemas/enums/users.enum';
import type { AuthenticationUser } from '../../users/schemas/user.schema';
import type { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';

// ───────────────────────── types ─────────────────────────

type RegisterBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
};

type LoginBody = {
  email: string;
  password: string;
};

type ServiceResult = {
  success: boolean;
  message: string;
  data?: unknown;
};

type ErrorResult = {
  error: true;
  statusCode?: number;
  message: string;
  errors?: unknown;
};

interface FakeSpongRequest {
  json: Mock<() => Promise<unknown>>;
  user?: AuthenticationUser;
}

interface FakeSpongResponse {
  SpongOK: Mock<(body: unknown) => unknown>;
  SpongBadRequest: Mock<(body: unknown) => unknown>;
  SpongUnprocessableContent: Mock<(body: unknown) => unknown>;
  SpongUnauthorized: Mock<(body: unknown) => unknown>;
}

interface FakeAuthService {
  register: Mock<(body: RegisterBody, req: SpongRequest) => Promise<unknown>>;
  login: Mock<(body: LoginBody, req: SpongRequest) => Promise<unknown>>;
  logout: Mock<(req: SpongRequest) => Promise<unknown>>;
  me: Mock<(user: AuthenticationUser) => Promise<ServiceResult>>;
  refreshToken: Mock<(req: SpongRequest) => Promise<unknown>>;
}

// ───────────────────────── helpers ─────────────────────────

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

const currentUser = {
  id: 1,
  firstName: 'Zen',
  lastName: 'Allaham',
  email: 'zen@example.com',
  role: UserRole.FREELANCER,
  isActive: true,
} as unknown as AuthenticationUser;

const successResult: ServiceResult = {
  success: true,
  message: 'Operation successful',
  data: { id: 1, email: 'zen@example.com' },
};

const makeRequest = (): FakeSpongRequest => ({
  json: mock(async (): Promise<unknown> => registerBody),
  user: currentUser,
});

const makeResponse = (): FakeSpongResponse => ({
  SpongOK: mock((body: unknown) => ({
    status: 200,
    body,
  })),
  SpongBadRequest: mock((body: unknown) => ({
    status: 400,
    body,
  })),
  SpongUnprocessableContent: mock((body: unknown) => ({
    status: 422,
    body,
  })),
  SpongUnauthorized: mock((body: unknown) => ({
    status: 401,
    body,
  })),
});

// ───────────────────────── tests ─────────────────────────

describe('AuthController', () => {
  let controller: AuthController;
  let authService: FakeAuthService;
  let spongReq: FakeSpongRequest;
  let spongRes: FakeSpongResponse;

  beforeEach(() => {
    authService = {
      register: mock(async () => successResult),
      login: mock(async () => successResult),
      logout: mock(async () => successResult),
      me: mock(async () => successResult),
      refreshToken: mock(async () => successResult),
    };

    spongReq = makeRequest();
    spongRes = makeResponse();

    controller = new AuthController(authService as unknown as AuthService);
  });

  afterEach(() => {
    mock.restore();
  });

  // ───────────────────────── register ─────────────────────────

  describe('register', () => {
    it('reads the request body and returns the service result', async () => {
      spongReq.json.mockResolvedValue(registerBody);

      const result = await controller.register(
        spongReq as unknown as Parameters<SpongHandler>[0],
        spongRes as unknown as Parameters<SpongHandler>[1],
      );

      expect(spongReq.json).toHaveBeenCalledTimes(1);
      expect(authService.register).toHaveBeenCalledWith(registerBody, spongReq);
      expect(result as unknown).toEqual({
        success: true,
        message: 'Operation successful',
        data: { id: 1, email: 'zen@example.com' },
      });
      expect(spongRes.SpongBadRequest).not.toHaveBeenCalled();
      expect(spongRes.SpongUnprocessableContent).not.toHaveBeenCalled();
    });

    it('returns 422 when validation fails', async () => {
      const errors = { email: ['Invalid email'] };

      authService.register.mockResolvedValue({
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors,
      } satisfies ErrorResult);

      const result = await controller.register(
        spongReq as unknown as Parameters<SpongHandler>[0],
        spongRes as unknown as Parameters<SpongHandler>[1],
      );

      expect(spongRes.SpongUnprocessableContent).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors,
      });

      expect(result as unknown).toEqual({
        status: 422,
        body: {
          success: false,
          message: 'Validation failed',
          errors,
        },
      });
    });

    it('returns 400 when registration fails', async () => {
      authService.register.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Unable to complete registration',
      } satisfies ErrorResult);

      const result = await controller.register(
        spongReq as unknown as Parameters<SpongHandler>[0],
        spongRes as unknown as Parameters<SpongHandler>[1],
      );

      expect(spongRes.SpongBadRequest).toHaveBeenCalledWith({
        success: false,
        message: 'Unable to complete registration',
      });

      expect(result as unknown).toEqual({
        status: 400,
        body: {
          success: false,
          message: 'Unable to complete registration',
        },
      });
    });
  });

  // ───────────────────────── login ─────────────────────────

  describe('login', () => {
    it('reads the request body and returns the service result', async () => {
      spongReq.json.mockResolvedValue(loginBody);

      const result = await controller.login(
        spongReq as unknown as Parameters<SpongHandler>[0],
        spongRes as unknown as Parameters<SpongHandler>[1],
      );

      expect(spongReq.json).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith(loginBody, spongReq);
      expect(result as unknown).toEqual({
        success: true,
        message: 'Operation successful',
        data: { id: 1, email: 'zen@example.com' },
      });
      expect(spongRes.SpongBadRequest).not.toHaveBeenCalled();
      expect(spongRes.SpongUnprocessableContent).not.toHaveBeenCalled();
    });

    it('returns 422 when validation fails', async () => {
      const errors = { password: ['Required'] };

      authService.login.mockResolvedValue({
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors,
      } satisfies ErrorResult);

      const result = await controller.login(
        spongReq as unknown as Parameters<SpongHandler>[0],
        spongRes as unknown as Parameters<SpongHandler>[1],
      );

      expect(spongRes.SpongUnprocessableContent).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors,
      });

      expect(result as unknown).toEqual({
        status: 422,
        body: {
          success: false,
          message: 'Validation failed',
          errors,
        },
      });
    });

    it('returns 400 when credentials are invalid', async () => {
      authService.login.mockResolvedValue({
        error: true,
        statusCode: 400,
        message: 'Invalid email or password',
      } satisfies ErrorResult);

      const result = await controller.login(
        spongReq as unknown as Parameters<SpongHandler>[0],
        spongRes as unknown as Parameters<SpongHandler>[1],
      );

      expect(spongRes.SpongBadRequest).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });

      expect(result as unknown).toEqual({
        status: 400,
        body: {
          success: false,
          message: 'Invalid email or password',
        },
      });
    });
  });

  // ───────────────────────── logout ─────────────────────────

  describe('logout', () => {
    it('returns the service result', async () => {
      const logoutResult = {
        success: true,
        message: 'Logged out successfully',
      };

      authService.logout.mockResolvedValue(logoutResult);

      const result = await controller.logout(
        spongReq as unknown as Parameters<SpongHandler>[0],
        spongRes as unknown as Parameters<SpongHandler>[1],
      );

      expect(authService.logout).toHaveBeenCalledWith(spongReq);

      expect(result as unknown).toEqual(logoutResult);
    });
  });

  // ───────────────────────── me ─────────────────────────

  describe('me', () => {
    it('passes the authenticated user to the service and returns 200', async () => {
      authService.me.mockResolvedValue(successResult);

      const result = await controller.me(
        spongReq as unknown as Parameters<SpongHandler>[0],
        spongRes as unknown as Parameters<SpongHandler>[1],
      );

      expect(authService.me).toHaveBeenCalledWith(currentUser);

      expect(spongRes.SpongOK).toHaveBeenCalledWith({
        success: true,
        data: successResult.data,
      });

      expect(result as unknown).toEqual({
        status: 200,
        body: {
          success: true,
          data: successResult.data,
        },
      });
    });
  });

  // ───────────────────────── refreshToken ─────────────────────────

  describe('refreshToken', () => {
    it('returns the service result when refresh succeeds', async () => {
      const refreshResult = {
        success: true,
        message: 'Access token refreshed successfully',
      };

      authService.refreshToken.mockResolvedValue(refreshResult);

      const result = await controller.refreshToken(
        spongReq as unknown as Parameters<SpongHandler>[0],
        spongRes as unknown as Parameters<SpongHandler>[1],
      );

      expect(authService.refreshToken).toHaveBeenCalledWith(spongReq);
      expect(result as unknown).toEqual(refreshResult);
      expect(spongRes.SpongUnauthorized).not.toHaveBeenCalled();
    });

    it('returns 401 when the refresh token is invalid', async () => {
      authService.refreshToken.mockResolvedValue({
        error: true,
        message: 'You are not authenticated',
      } satisfies ErrorResult);

      const result = await controller.refreshToken(
        spongReq as unknown as Parameters<SpongHandler>[0],
        spongRes as unknown as Parameters<SpongHandler>[1],
      );

      expect(spongRes.SpongUnauthorized).toHaveBeenCalledWith({
        success: false,
        message: 'You are not authenticated',
      });

      expect(result as unknown).toEqual({
        status: 401,
        body: {
          success: false,
          message: 'You are not authenticated',
        },
      });
    });
  });
});
