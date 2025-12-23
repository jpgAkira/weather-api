import { IsString } from 'class-validator';
import { Weather } from '../../client/entities/weather.entity.js';

export class FavoriteCityDto {
  @IsString({ message: 'Informe uma cidade' })
  cityName: string;
}

export class FavoriteCityDbDto {
  cityName: string;
  userId: string;
}

export class FavoriteCityResponseDto {
  message: string;
  weather: Weather;
}
