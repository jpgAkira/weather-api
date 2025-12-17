import clientResponses from '../../test/fixtures/openWeatherNormalizeResponse.json' with { type: 'json' };
import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { CityService } from './city.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { OpenWeatherService } from '../client/openWeather.js';
import { Weather } from '../client/entities/weather.entity.js';
import { FavoriteCityDto } from './dto/favorite-city.dto.js';
import dotenv from 'dotenv';

describe('CityService', () => {
  const now = new Date();

  let cityService: CityService;
  let db: PrismaService;
  let clientService: OpenWeatherService;

  beforeEach(async () => {
    dotenv.config();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        CityService,
        {
          provide: OpenWeatherService,
          useValue: {
            fetchCityForecast: jest.fn(),
          },
        },
      ],
    }).compile();

    cityService = module.get<CityService>(CityService);
    db = module.get<PrismaService>(PrismaService);
    clientService = module.get<OpenWeatherService>(OpenWeatherService);
  });

  it('should save a city favored by user', async () => {
    const dbResponse = {
      id: 'fake-id',
      name: 'fake-name',
      userId: 'fake-user-id',
      createdAt: now,
      updatedAt: now,
    };

    const favoriteCityDto: FavoriteCityDto = {
      cityName: 'Viamão',
      userId: 'fake-user-id',
    };

    jest
      .spyOn(clientService, 'fetchCityForecast')
      .mockResolvedValue(clientResponses[0] as Weather);

    jest.spyOn(db.city, 'create').mockResolvedValue(dbResponse);

    const city = await cityService.favorite(favoriteCityDto);

    expect(city).toEqual({
      message: 'Cidade adicionada aos favoritos com sucesso',
      weather: clientResponses[0],
    });
  });
});
