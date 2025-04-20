import { Controller, HttpCode, Get, Param, Query } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { Planet, DetailedPlanet } from './interfaces/planets.interface';
import { Paginated } from 'src/common/interfaces/pagination.interface';
import { ApiQuery } from '@nestjs/swagger';

@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get('')
  @HttpCode(200)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  findAll(@Query('page') page = 1): Promise<Paginated<Planet>> {
    return this.planetsService.getPlanets(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DetailedPlanet> {
    return this.planetsService.getPlanetById(id);
  }
}
