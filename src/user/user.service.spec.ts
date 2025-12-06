import { TestingModule, Test } from '@nestjs/testing';
import { UserService } from './user.service.js';
import { jest } from '@jest/globals';
import { AuthService } from '../auth/auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { createPrismaError } from '../mocks/createPrismaError.js';
import { PrismaErrorCode } from '../prisma/prisma.types.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

describe('User Service Unit spec', () => {
  const now = new Date();
  let userService: UserService;
  let db: jest.Mocked<PrismaService>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: AuthService,
          useValue: {
            hashingPassword: jest.fn(),
            createToken: jest.fn(),
            isMatchPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    db = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;
  });

  describe('Create user', () => {
    it('should create a user and return with token', async () => {
      const dto = {
        name: 'Akira',
        email: 'akira@email.com',
        password: '123456',
      };

      const hashedPassword = 'hashed12356';
      const createdUser = {
        ...dto,
        password: hashedPassword,
        id: '1',
        createdAt: now,
        updatedAt: now,
      };
      const token = 'fake-token';

      jest
        .spyOn(authService, 'hashingPassword')
        .mockResolvedValue(hashedPassword);

      jest.spyOn(db.user, 'create').mockResolvedValue({
        ...createdUser,
        password: hashedPassword,
      });

      jest.spyOn(authService, 'createToken').mockResolvedValue(token);

      expect(await userService.create(dto)).toEqual({ token });
    });

    it('should return a error when user send email in use', async () => {
      const first_dto = {
        name: 'Akira',
        email: 'akira@email.com',
        password: '123456',
      };

      const second_dto = {
        name: 'AkiraTravessuras',
        email: 'akira@email.com',
        password: '654321',
      };

      const hashedPassword = 'hashed12356';
      const createdUser = {
        ...first_dto,
        password: hashedPassword,
        id: '1',
        createdAt: now,
        updatedAt: now,
      };

      jest
        .spyOn(authService, 'hashingPassword')
        .mockResolvedValue(hashedPassword);

      jest.spyOn(db.user, 'create').mockResolvedValue({
        ...createdUser,
        password: hashedPassword,
      });

      await userService.create(first_dto);

      const error = createPrismaError(PrismaErrorCode.UNIQUE_CONSTRAINT);

      jest.spyOn(db.user, 'create').mockRejectedValue(error);

      await expect(userService.create(second_dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return a error when user missing some input', async () => {
      const dto = {
        name: 'Akira',
        email: 'akira@email.com',
      } as CreateUserDto;

      const error = createPrismaError(PrismaErrorCode.REQUIRED_PATH);

      jest.spyOn(db.user, 'create').mockRejectedValue(error);

      await expect(userService.create(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a error if a hashing password failed', async () => {
      const dto = {
        name: 'Akira',
        email: 'akira@email.com',
      } as CreateUserDto;

      jest.spyOn(authService, 'hashingPassword').mockRejectedValue('');

      await expect(userService.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Login user', () => {
    it('should login of user ', async () => {
      const loginDto = { email: 'akira@email.com', password: 'Akira123' };

      const fakeResult = {
        ...loginDto,
        id: 'fake-id',
        name: 'akira',
        createdAt: now,
        updatedAt: now,
      };

      const token = 'fake-token';

      jest.spyOn(db.user, 'findUnique').mockResolvedValue(fakeResult);
      jest.spyOn(authService, 'isMatchPassword').mockResolvedValue(true);
      jest.spyOn(authService, 'createToken').mockResolvedValue(token);

      const loginUser = await userService.login(loginDto);

      expect(loginUser).toEqual({ token });
    });

    it('should return a error  if the user informe incorrect data', async () => {
      const loginDto = { email: 'akira@email.com', password: 'akira123' };

      const fakeResult = {
        id: 'fake-id',
        email: loginDto.email,
        password: 'Akira123',
        name: 'Akira',
        createdAt: now,
        updatedAt: now,
      };

      jest.spyOn(db.user, 'findUnique').mockResolvedValue(fakeResult);
      jest.spyOn(authService, 'isMatchPassword').mockResolvedValue(false);

      await expect(userService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('Get profile of user', () => {
    it('should return the profile of user if be logged', async () => {
      const fakeUser = {
        id: 'fake-id',
        email: 'fake-email',
        name: 'fake-name',
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(db.user, 'findUnique').mockResolvedValue(fakeUser as any);

      const user = await userService.findProfile(fakeUser.id);

      expect(user).toEqual(fakeUser);
    });

    it('should throw an error if user inform invalid token', async () => {
      jest.spyOn(db.user, 'findUnique').mockResolvedValue(null);

      await expect(userService.findProfile('fake-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('Update user', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'fake-name',
      password: 'fake-password',
    };

    it('should update a user with informed data', async () => {
      const resolvedValue = {
        email: 'fake-email',
        name: 'fake-name',
        id: 'fake-id',
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(db.user, 'update').mockResolvedValue(resolvedValue as any);

      const updatedUser = await userService.update(
        resolvedValue.id,
        updateUserDto,
      );

      expect(updatedUser).toEqual({
        message: 'Atualizado com sucesso.',
        user: resolvedValue,
      });
    });

    it('should throw an error if a user not pass id', async () => {
      const prismaError = createPrismaError(PrismaErrorCode.MISSING_ID);

      jest.spyOn(db.user, 'update').mockRejectedValue(prismaError);

      await expect(userService.update('1', updateUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an error if a failed hashing password', async () => {
      jest.spyOn(authService, 'hashingPassword').mockRejectedValue(null);

      await expect(userService.update('1', updateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Delete user', () => {
    it('should delete a user', async () => {
      const fakeData = {
        email: 'fake-email',
        name: 'fake-name',
        updatedAt: now,
        createdAt: now,
        password: 'fake-pass',
        id: 'fake-id',
      };

      jest.spyOn(db.user, 'delete').mockResolvedValue(fakeData);

      const deletedUser = await userService.remove(fakeData.id);

      expect(deletedUser).toEqual({
        message: 'Usuário deletado com sucesso.',
        userId: 'fake-id',
      });
    });

    it('should throw an error if the id invalid', async () => {
      const prismaError = createPrismaError(PrismaErrorCode.MISSING_ID);

      jest.spyOn(db.user, 'delete').mockRejectedValue(prismaError);

      await expect(userService.remove('fake-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
