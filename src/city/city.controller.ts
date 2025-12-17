import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CityService } from './city.service.js';
import { FavoriteCityDto } from './dto/favorite-city.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('weather')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCityDto: FavoriteCityDto) {
    return this.cityService.favorite(createCityDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.cityService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.cityService.unfavorite(+id);
  }
}
