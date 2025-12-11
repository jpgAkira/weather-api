import { jest } from '@jest/globals';
import openWeatherRawResponse from '../../test/fixtures/openWeatherRawResponse.json' with { type: 'json' };
import openWeatherNormalizedResponse from '../../test/fixtures/openWeatherNormalizeResponse.json' with { type: 'json' };
import { OpenWeatherService } from './openWeather.js';
import * as HTTPUtil from '../utils/request.js';
import { FakeAxiosError } from '../mocks/createAxiosError.js';
import {
  langParams,
  OpenWeatherOptionsDto,
  unitsParams,
} from './dto/weather-params.dto.js';

jest.mock('../utils/request');

describe('OpenWeatherService', () => {
  const defaultCityName = 'London';
  const baseOptions: OpenWeatherOptionsDto = {
    langParam: langParams.en,
    units: unitsParams.celsius,
  };

  const request = new HTTPUtil.Request();

  it('should return normalized forecast from OpenWeather service', async () => {
    jest
      .spyOn(request, 'get')
      .mockResolvedValue({ data: openWeatherRawResponse } as HTTPUtil.Response);

    const weather = new OpenWeatherService(request);

    const response = await weather.fetchCityForecast(defaultCityName);

    expect(response).toEqual(openWeatherNormalizedResponse[0]);
  });

  it('should return a 404 error for an invalid city', async () => {
    const invalidCityName = 'invalid-name';

    jest.spyOn(request, 'get').mockRejectedValue(
      new FakeAxiosError({
        status: 404,
        data: { message: 'city not found' },
      }),
    );

    jest
      .spyOn(HTTPUtil.Request, 'isRequestError')
      .mockImplementation(() => true);
    jest.spyOn(HTTPUtil.Request, 'extractErrorData').mockImplementation(() => ({
      data: { cod: '404', message: 'city not found' },
      status: 404,
    }));

    const openWeather = new OpenWeatherService(request);

    await expect(
      openWeather.fetchCityForecast(invalidCityName, baseOptions),
    ).rejects.toThrow('city not found');
  });

  it('should return a 500 generic error for an unknown error', async () => {
    jest.spyOn(request, 'get').mockRejectedValue('Network Error');

    await expect(
      new OpenWeatherService(request).fetchCityForecast(
        defaultCityName,
        baseOptions,
      ),
    ).rejects.toThrow('Network Error');
  });
});
