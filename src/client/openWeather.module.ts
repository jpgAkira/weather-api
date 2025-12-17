import { Module } from '@nestjs/common';
import { OpenWeatherService } from './openWeather.js';

@Module({
  providers: [OpenWeatherService],
})
export class OpenWeatherModule {}
