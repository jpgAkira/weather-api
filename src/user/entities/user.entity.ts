import { Prisma } from 'src/generated/prisma/client.js';

export class User implements Prisma.UserCreateInput {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  citys: Prisma.CityCreateNestedManyWithoutUserInput;
}
