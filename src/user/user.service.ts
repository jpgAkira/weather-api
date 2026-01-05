import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto, UpdateUserResponseDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserPublicDto } from './dto/user-public.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AuthResponseDto } from './dto/auth-user.dto.js';
import { AuthService } from '../auth/auth.service.js';
import { deleteUserResponseDto as DeleteUserResponseDto } from './dto/delete-user.dto.js';
import { ServiceErrorValidation } from '../utils/error/serviceErrorsValidation.js';

@Injectable()
export class UserService {
  @Inject()
  private readonly db: PrismaService;
  @Inject()
  private readonly authService: AuthService;

  async create(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    try {
      const hashedPassword = await this.authService.hashingPassword(
        createUserDto.password,
      );

      const newUser = await this.db.user.create({
        data: { ...createUserDto, password: hashedPassword },
        omit: {
          email: true,
          name: true,
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const token = await this.authService.createToken(newUser.id);

      return { token };
    } catch (error: unknown) {
      return ServiceErrorValidation.tratament(error);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    try {
      const user = await this.db.user.findUnique({
        where: { email: loginUserDto.email },
        include: {
          citys: true,
        },
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      });

      if (
        !user ||
        !(await this.authService.isMatchPassword(
          loginUserDto.password,
          user.password,
        ))
      ) {
        throw new Error('Confira seus dados e tente novamente');
      }

      const token = await this.authService.createToken(user.id);

      return { token };
    } catch (error: unknown) {
      return ServiceErrorValidation.tratament(error);
    }
  }

  async findProfile(id: string): Promise<UserPublicDto> {
    try {
      const user = await this.db.user.findUnique({
        where: { id },
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error('Token inválido');
      }

      return user;
    } catch (error) {
      return ServiceErrorValidation.tratament(error);
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    try {
      if (updateUserDto.password) {
        const hashPassword = await this.authService.hashingPassword(
          updateUserDto.password,
        );

        updateUserDto = { ...updateUserDto, password: hashPassword };
      }

      const updatedUser = await this.db.user.update({
        where: { id },
        data: updateUserDto,
        omit: {
          createdAt: true,
          updatedAt: true,
          password: true,
        },
      });

      return { user: updatedUser, message: 'Atualizado com sucesso.' };
    } catch (error: unknown) {
      return ServiceErrorValidation.tratament(error);
    }
  }

  async remove(id: string): Promise<DeleteUserResponseDto> {
    try {
      await this.db.user.delete({ where: { id } });

      return { message: 'Usuário deletado com sucesso.', userId: id };
    } catch (error) {
      return ServiceErrorValidation.tratament(error);
    }
  }
}
