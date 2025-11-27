import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;
  const defaultPassword = 'test';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a password with encryption', async () => {
    const hashedPasswordRegex = /\$2b\$10\$.+/;

    const hash = await service.hashingPassword(defaultPassword);

    expect(hash).toMatch(hashedPasswordRegex);
  });

  it('should compare a hashed password with a password informed by user', async () => {
    const hash = await service.hashingPassword(defaultPassword);

    expect(await service.isMatchPassword(defaultPassword, hash)).toBeTruthy();
    expect(await service.isMatchPassword('1234', hash)).toBeFalsy();
  });
});
