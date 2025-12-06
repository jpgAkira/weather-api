import { TestingModule, Test } from '@nestjs/testing';
import { AuthGuard } from './auth.guard.js';
import { Request } from 'express';
import { JwtModule } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthModule } from './auth.module.js';
import { AuthService } from './auth.service.js';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let token: string;

  const createFakeContext = (req: Request): ExecutionContext => {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      switchToHttp: () => ({ getRequest: () => req }),
    };
  };

  const createFakeRequest = (auth?: string): Request => {
    return {
      headers: {
        authorization: auth ? `Bearer ${auth}` : '',
      },
    } as Request;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'TESTING SECRET',
          signOptions: { expiresIn: '3660s' },
        }),
        AuthModule,
      ],
      providers: [AuthGuard],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    authService = module.get<AuthService>(AuthService);

    token = await authService.createToken(
      '82ebda84-0060-417a-8234-e4554161dd67',
    );
  });

  it('should verify if a user is logged using the request token', async () => {
    const req = createFakeRequest(token);
    const fakeContext = createFakeContext(req);
    const verify = await authGuard.canActivate(fakeContext);

    expect(verify).toEqual(true);
  });

  it('should throw an error if a token does not come with request', async () => {
    const req = createFakeRequest();
    const fakeContext = createFakeContext(req);

    await expect(authGuard.canActivate(fakeContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw an error if a token not it', async () => {
    const req = createFakeRequest('fake-token');
    const fakeContext = createFakeContext(req);

    await expect(authGuard.canActivate(fakeContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
