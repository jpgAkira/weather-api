import { CityCreateNestedManyWithoutUserInput } from '../../generated/prisma/models/City.js';

export class UserPublicDto {
  id: string;
  name: string;
  email?: string;
  citys?: CityCreateNestedManyWithoutUserInput;
}
