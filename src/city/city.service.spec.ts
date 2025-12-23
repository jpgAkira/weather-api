import clientResponses from '../../test/fixtures/openWeatherNormalizeResponse.json' with { type: 'json' };
import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { CityService } from './city.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { OpenWeatherService } from '../client/openWeather.js';
import { Weather } from '../client/entities/weather.entity.js';
import { FavoriteCityDbDto } from './dto/favorite-city.dto.js';
import dotenv from 'dotenv';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { createPrismaError } from '../mocks/createPrismaError.js';
import { PrismaErrorCode } from '../prisma/prisma.types.js';

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

    const favoriteCityDto: FavoriteCityDbDto = {
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

  it('should return an error if a city name invalid', async () => {
    const favoriteCityDto: FavoriteCityDbDto = {
      cityName: 'fake-city',
      userId: 'fake-user-id',
    };

    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: { message: 'city not found' },
      },
    } as AxiosError;

    jest.spyOn(clientService, 'fetchCityForecast').mockRejectedValue(error);

    await expect(cityService.favorite(favoriteCityDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should find all favorited cities of user', async () => {
    const dbResponse = [
      { id: 'fake-id', name: 'fake-name' },
      { id: 'fake-id-2', name: 'fake-name-2' },
    ];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    jest.spyOn(db.city, 'findMany').mockResolvedValue(dbResponse);

    const city = await cityService.findAll('fake-id');

    expect(city).toEqual(dbResponse);
  });

  it('should return an message for user without favorited cities', async () => {
    jest.spyOn(db.city, 'findMany').mockResolvedValue([]);

    const cities = await cityService.findAll('fake-id');

    expect(cities).toEqual({ message: 'Você não tem cidades favoritas.' });
  });

  it('should return an error if a invalid user id', async () => {
    jest
      .spyOn(db.city, 'findMany')
      .mockRejectedValue(createPrismaError(PrismaErrorCode.MISSING_ID));

    await expect(cityService.findAll('fake-user-id')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should find favorited city informed by user', async () => {
    const dbResponse = { id: 'fake-id', name: 'fake-name' };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    jest.spyOn(db.city, 'findUnique').mockResolvedValue(dbResponse);

    jest
      .spyOn(clientService, 'fetchCityForecast')
      .mockResolvedValue(clientResponses[0] as Weather);

    const city = await cityService.findOne('fake-id');

    expect(city).toEqual(clientResponses[0]);
  });

  it('should return an error if a user informed invalid id', async () => {
    jest.spyOn(db.city, 'findUnique').mockResolvedValue(null);

    await expect(cityService.findOne('fake-id')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should remove a city of favorites of user', async () => {
    const dbResponse = {
      name: 'fake-name',
      id: 'fake-id',
      createdAt: now,
      updatedAt: now,
      userId: 'fake-user-id',
      user: {
        id: 'fake-user-id',
        email: 'fake-email',
        name: 'fake-user-name',
        password: 'fake-password',
        createdAt: now,
        updatedAt: now,
      },
    };

    jest.spyOn(db.city, 'findUnique').mockResolvedValue(dbResponse);
    jest.spyOn(db.city, 'delete').mockResolvedValue(dbResponse);

    const unfavoritedCity = await cityService.unfavorite({
      userId: 'fake-user-id',
      cityId: 'fake-id',
    });

    expect(unfavoritedCity).toEqual(undefined);
  });

  it('should return an error if a user try remove a city belonging to another user', async () => {
    const dbResponse = {
      name: 'fake-name',
      id: 'fake-id',
      createdAt: now,
      updatedAt: now,
      userId: 'user-id',
      user: {
        id: 'user-id',
        email: 'fake-email',
        name: 'fake-user-name',
        password: 'fake-password',
        createdAt: now,
        updatedAt: now,
      },
    };

    jest.spyOn(db.city, 'findUnique').mockResolvedValue(dbResponse);

    await expect(
      cityService.unfavorite({ userId: 'fake-user-id', cityId: 'fake-id' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
