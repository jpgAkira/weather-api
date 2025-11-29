import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserPublicDto } from './dto/user-public.dto.js';
import { LoginUserDto, LoginUserResponseDto } from './dto/login-user.dto.js';

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserPublicDto> {
    return await this.userService.create(createUserDto);
  }

  @Post('signin')
  async signin(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginUserResponseDto> {
    return await this.userService.login(loginUserDto);
  }

  @Get()
  async findAll(): Promise<UserPublicDto[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserPublicDto | object> {
    return await this.userService.findOne(id);
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
