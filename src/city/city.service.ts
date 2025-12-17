import { Inject, Injectable } from '@nestjs/common';
import {
  FavoriteCityDto,
  FavoriteCityResponseDto,
} from './dto/favorite-city.dto.js';
import { OpenWeatherService } from '../client/openWeather.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ServiceErrorValidation } from '../utils/error/serviceErrorsValidation.js';

@Injectable()
export class CityService {
  @Inject()
  private readonly db: PrismaService;

  @Inject()
  private readonly OpenWeatherClient: OpenWeatherService;

  async favorite({
    cityName,
    userId,
  }: FavoriteCityDto): Promise<FavoriteCityResponseDto | void> {
    try {
      const cityWeather =
        await this.OpenWeatherClient.fetchCityForecast(cityName);

      await this.db.city.create({ data: { name: cityName, userId } });

      return {
        message: 'Cidade adicionada aos favoritos com sucesso',
        weather: cityWeather,
      };
    } catch (error: unknown) {
      return ServiceErrorValidation.tratament(error);
    }
  }

  findAll() {
    return `This action returns all city`;
  }

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  unfavorite(id: number) {
    return `This action removes a #${id} city`;
  }
}
