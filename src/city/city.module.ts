import { Module } from '@nestjs/common';
import { CityService } from './city.service.js';
import { CityController } from './city.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { OpenWeatherModule } from '../client/openWeather.module.js';

@Module({
  imports: [OpenWeatherModule, PrismaModule, AuthModule],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
