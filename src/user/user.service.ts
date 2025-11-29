import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
// import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserPublicDto } from './dto/user-public.dto.js';
import { LoginUserDto, LoginUserResponseDto } from './dto/login-user.dto.js';
import { AuthService } from '../auth/auth.service.js';

@Injectable()
export class UserService {
  @Inject()
  private readonly db: PrismaService;
  @Inject()
  private readonly authService: AuthService;

  async create(createUserDto: CreateUserDto): Promise<UserPublicDto> {
    const hashedPassword = await this.authService.hashingPassword(
      createUserDto.password,
    );

    const newUser = await this.db.user.create({
      data: { ...createUserDto, password: hashedPassword },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = await this.authService.createToken(newUser.id);

    return {
      ...newUser,
      token,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
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
      throw new UnauthorizedException(
        'Verifique seus dados e tente novamente.',
      );
    }

    const token = await this.authService.createToken(user.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...responseUser } = user;

    return {
      ...responseUser,
      token,
    };
  }

  async findAll(): Promise<UserPublicDto[]> {
    return await this.db.user.findMany({
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
        email: true,
      },
    });
  }

  async findOne(id: string): Promise<UserPublicDto | { message: string }> {
    const user = await this.db.user.findUnique({
      where: { id },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
        email: true,
      },
    });

    return !user
      ? {
          message: 'Nenhum usuário foi encontrado.',
        }
      : user;
  }

  // async update(id: string, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // async remove(id: string) {
  //   return `This action removes a #${id} user`;
  // }
}
