import { RawWeatherResponse } from '../../src/client/dto/raw-weather.dto';
import { Weather } from '../../src/client/entities/weather.entity';
import OpenWeatherNormalizedResponse from './openWeatherNormalizeResponse.json';
import openWeatherRawResponse from './openWeatherRawResponse.json';

export const normalizedOpenWeatherResponse =
  OpenWeatherNormalizedResponse as Weather[];
export const rawOpenWeatheResponse =
  openWeatherRawResponse as unknown as RawWeatherResponse;
