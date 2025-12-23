import { City } from '../../city/entities/city.entity.js';

export class User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  citys: City[];
}
