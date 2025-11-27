import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserPublicDto } from './dto/user-public.dto.js';

@Injectable()
export class UserService {
  @Inject()
  private readonly db: PrismaService;

  async create(createUserDto: CreateUserDto): Promise<UserPublicDto> {
    return this.db.user.create({
      data: createUserDto,
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
