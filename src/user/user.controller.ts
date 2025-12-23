import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Inject,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto, UpdateUserResponseDto } from './dto/update-user.dto.js';
import { UserPublicDto } from './dto/user-public.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { AuthResponseDto } from './dto/auth-user.dto.js';
import { deleteUserResponseDto as DeleteUserResponseDto } from './dto/delete-user.dto.js';

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    return this.userService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async profile(@Request() req: ExpressRequest): Promise<UserPublicDto> {
    return this.userService.findProfile(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: ExpressRequest,
  ): Promise<UpdateUserResponseDto> {
    if (!updateUserDto.name && !updateUserDto.password) {
      throw new BadRequestException('Informe dados a serem atualizados');
    }

    return this.userService.update(req.user.id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: ExpressRequest): Promise<DeleteUserResponseDto> {
    return this.userService.remove(req.user.id);
  }
}
