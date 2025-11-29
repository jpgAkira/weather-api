import { PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity.js';

export class LoginUserDto extends PartialType(User) {
  email: string;
  password: string;
}

export class LoginUserResponseDto {
  token: string;
}
