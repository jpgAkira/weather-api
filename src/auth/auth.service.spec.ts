import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  const defaultPassword = 'test';
  const userId = '82ebda84-0060-417a-8234-e4554161dd67';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'TESTING SECRET',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should create a password with encryption', async () => {
    const hashedPasswordRegex = /\$2b\$10\$.+/;

    const hash = await authService.hashingPassword(defaultPassword);

    expect(hash).toMatch(hashedPasswordRegex);
  });

  it('should compare a hashed password with a password informed by user', async () => {
    const hash = await authService.hashingPassword(defaultPassword);

    expect(
      await authService.isMatchPassword(defaultPassword, hash),
    ).toBeTruthy();
    expect(await authService.isMatchPassword('1234', hash)).toBeFalsy();
  });

  it('should create a jwt token for user id', async () => {
    const token = await authService.createToken(userId);

    expect(typeof token).toBe('string');
  });

  it('should verify token and return a user id', async () => {
    const token = await authService.createToken(userId);

    const verify = await authService.verifyToken(token);

    expect(verify.id).toEqual(userId);
  });
});
