import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  const defaultPassword = 'test';

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
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
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
    const userId = '82ebda84-0060-417a-8234-e4554161dd67';

    const token = await jwtService.signAsync({ id: userId });

    expect(typeof token).toBe('string');
  });
});
