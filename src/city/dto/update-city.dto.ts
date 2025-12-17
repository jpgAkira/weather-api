import { PartialType } from '@nestjs/mapped-types';
import { FavoriteCityDto } from './favorite-city.dto.js';

export class UpdateCityDto extends PartialType(FavoriteCityDto) {
  id: string;
  name: string;
}
