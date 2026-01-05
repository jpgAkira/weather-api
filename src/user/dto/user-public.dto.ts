import { City } from '../../city/entities/city.entity.js';

export class UserPublicDto {
  id: string;
  name: string;
  email?: string;
  citys?: City[];
}
