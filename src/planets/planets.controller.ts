import { Controller, HttpCode, Get, Param } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { Planet, DetailedPlanet } from './interfaces/planets.interface';

@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get('')
  @HttpCode(200)
  findAll(): Promise<Planet[]> {
    return this.planetsService.getPlanets();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DetailedPlanet> {
    return this.planetsService.getPlanetById(id);
  }
}
