import { PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity.js';
import { CityCreateNestedManyWithoutUserInput } from 'src/generated/prisma/models.js';

export class UserPublicDto extends PartialType(User) {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  citys?: CityCreateNestedManyWithoutUserInput;
  token?: string;
}
