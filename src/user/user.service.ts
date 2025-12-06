import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto, UpdateUserResponseDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserPublicDto } from './dto/user-public.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AuthResponseDto } from './dto/auth-user.dto.js';
import { AuthService } from '../auth/auth.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaErrorCode } from '../prisma/prisma.types.js';
import { deleteUserResponseDto as DeleteUserResponseDto } from './dto/delete-user.dto.js';

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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
          throw new BadRequestException('O e-mail informado já está em uso');
        }

        if (error.code === PrismaErrorCode.REQUIRED_PATH) {
          throw new BadRequestException(
            'Por favor informe todos os campos obrigatórios',
          );
        }
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro inesperado, por favor tente novamente mais tarde',
      );
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
        throw new Error('Verifique seus dados e tente novamente.');
      }

      const token = await this.authService.createToken(user.id);

      return { token };
    } catch (error) {
      throw new UnauthorizedException((error as Error).message);
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
      throw new UnauthorizedException(error);
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.MISSING_ID) {
          throw new UnauthorizedException('Informe um id válido.');
        }
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro inesperado, por favor tente novamente mais tarde',
      );
    }
  }

  async remove(id: string): Promise<DeleteUserResponseDto> {
    try {
      await this.db.user.delete({ where: { id } });

      return { message: 'Usuário deletado com sucesso.', userId: id };
    } catch {
      throw new UnauthorizedException('Informe um id válido.');
    }
  }
}
