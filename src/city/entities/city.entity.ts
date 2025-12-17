import { User } from '../../user/entities/user.entity.js';

export class City {
  id: string;
  name: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: User;
}
