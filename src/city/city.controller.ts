import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CityService } from './city.service.js';
import {
  FavoriteCityDto,
  FavoriteCityResponseDto,
} from './dto/favorite-city.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import type { Request as ExpressRequest } from 'express';
import { Weather } from '../client/entities/weather.entity.js';
import { FindAllCityResponseDto } from './dto/find-city.dto.js';

@Controller('weather')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() { cityName }: FavoriteCityDto,
    @Request() req: ExpressRequest,
  ): Promise<FavoriteCityResponseDto> {
    return this.cityService.favorite({ cityName, userId: req.user.id });
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Request() req: ExpressRequest,
  ): Promise<FindAllCityResponseDto[] | { message: string }> {
    return this.cityService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<Weather> {
    return this.cityService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @Request() req: ExpressRequest,
  ): Promise<void> {
    return this.cityService.unfavorite({ cityId: id, userId: req.user.id });
  }
}
