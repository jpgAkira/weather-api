import { Weather } from '../../client/entities/weather.entity.js';

export class FavoriteCityDto {
  cityName: string;
  userId: string;
}

export class FavoriteCityResponseDto {
  message: string;
  weather: Weather;
}
