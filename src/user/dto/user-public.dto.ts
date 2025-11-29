import { PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity.js';
import { CityCreateNestedManyWithoutUserInput } from '../../generated/prisma/models/City.js';

export class UserPublicDto extends PartialType(User) {
  id: string;
  name: string;
  email?: string;
  citys?: CityCreateNestedManyWithoutUserInput;
  token?: string;
}
