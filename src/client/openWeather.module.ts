import { Module } from '@nestjs/common';
import { OpenWeatherService } from './openWeather.js';

@Module({
  providers: [OpenWeatherService],
  exports: [OpenWeatherService],
})
export class OpenWeatherModule {}
