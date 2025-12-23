import { Inject, Injectable } from '@nestjs/common';
import {
  FavoriteCityDbDto,
  FavoriteCityResponseDto,
} from './dto/favorite-city.dto.js';
import { OpenWeatherService } from '../client/openWeather.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ServiceErrorValidation } from '../utils/error/serviceErrorsValidation.js';
import { FindAllCityResponseDto } from './dto/find-city.dto.js';
import { Weather } from '../client/entities/weather.entity.js';
import { UnfavoriteCityDto } from './dto/unfavorite-city.dto.js';

@Injectable()
export class CityService {
  @Inject()
  private readonly db: PrismaService;

  @Inject()
  private readonly OpenWeatherClient: OpenWeatherService;

  async favorite({
    cityName,
    userId,
  }: FavoriteCityDbDto): Promise<FavoriteCityResponseDto> {
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

  async findAll(
    userId: string,
  ): Promise<FindAllCityResponseDto[] | { message: string }> {
    try {
      const cities = await this.db.city.findMany({
        where: { userId },
        omit: { createdAt: true, updatedAt: true, userId: true },
      });

      if (cities.length === 0) {
        return { message: 'Você não tem cidades favoritas.' };
      }

      return cities;
    } catch (error) {
      return ServiceErrorValidation.tratament(error);
    }
  }

  async findOne(cityId: string): Promise<Weather> {
    try {
      const city = await this.db.city.findUnique({
        where: { id: cityId },
        omit: { createdAt: true, updatedAt: true, userId: true },
      });

      if (!city) {
        throw new Error('Informe um id válido');
      }

      const weather = await this.OpenWeatherClient.fetchCityForecast(city.name);

      return weather;
    } catch (error) {
      return ServiceErrorValidation.tratament(error);
    }
  }

  async unfavorite(data: UnfavoriteCityDto): Promise<void> {
    try {
      const city = await this.db.city.findUnique({
        where: { id: data.cityId },
        include: { user: true },
      });

      if (city?.userId !== data.userId) {
        throw new Error('Usuário não autorizado.');
      }

      await this.db.city.delete({ where: { id: city.id } });

      return;
    } catch (error) {
      return ServiceErrorValidation.tratament(error);
    }
  }
}
