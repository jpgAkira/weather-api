import { BadGatewayException, BadRequestException } from '@nestjs/common';
import * as HTTPUtil from '../utils/request.js';
import { LocalTimes, RawWeatherResponse } from './dto/raw-weather.dto.js';
import {
  OpenWeatherOptionsDto,
  UnitsParamValue,
  langParams,
  unitsParams,
} from './dto/weather-params.dto.js';
import { Weather } from './entities/weather.entity.js';

export class OpenWeatherService {
  private readonly apiKey = process.env.OPEN_WEATHER_KEY;
  private readonly apiUrl = process.env.API_URL;

  constructor(private readonly request = new HTTPUtil.Request()) {}

  public async fetchCityForecast(
    cityName: string,
    options: OpenWeatherOptionsDto = {
      langParam: langParams.en,
      units: unitsParams.celsius,
    },
  ): Promise<Weather> {
    try {
      const response = await this.request.get<RawWeatherResponse>(
        `${this.apiUrl}?q=${encodeURIComponent(cityName)}&lang=${
          options.langParam
        }&units=${options.units}&appid=${this.apiKey}`,
      );

      return this.normalizeResponse(response.data, options.units);
    } catch (error: unknown) {
      if (error instanceof Error && HTTPUtil.Request.isRequestError(error)) {
        const err = HTTPUtil.Request.extractErrorData(error);
        throw new BadGatewayException(err.data);
      }

      throw new BadRequestException(JSON.stringify(error));
    }
  }

  private normalizeResponse(
    weather: RawWeatherResponse,
    units: UnitsParamValue,
  ): Weather {
    const localTime = this.getLocalTime(weather);

    return {
      city: weather.name,
      clouds: weather.clouds.all,
      coords: { lat: weather.coord.lat, lng: weather.coord.lon },
      dt: localTime.dt,
      temperature: {
        degrees: units,
        current: weather.main.temp,
        max: weather.main.temp_max,
        min: weather.main.temp_min,
        feels_like: weather.main.feels_like,
        humidity: weather.main.humidity,
      },
      weather: {
        main: weather.weather[0].main,
        description: weather.weather[0].description,
        icon: weather.weather[0].icon,
      },
      visibility: weather.visibility,
      wind: { deg: weather.wind.deg, speed: weather.wind.speed },
      rain: weather.rain ? Object.values(weather.rain)[0] : 0,
      snow: weather.snow ? Object.values(weather.snow)[0] : 0,
      sys: { sunrise: localTime.sunrise, sunset: localTime.sunset },
      timezone: weather.timezone,
    };
  }

  private convertToLocalTime(timestamp: number, timezoneOffset: number): Date {
    return new Date((timestamp + timezoneOffset) * 1000);
  }

  private getLocalTime({ sys, dt, timezone }: RawWeatherResponse): LocalTimes {
    return {
      sunrise: this.convertToLocalTime(sys.sunrise, timezone).toISOString(),
      sunset: this.convertToLocalTime(sys.sunset, timezone).toISOString(),
      dt: this.convertToLocalTime(dt, timezone).toISOString(),
    };
  }
}
