import { Injectable } from '@nestjs/common';
import {
  SwapiFilm,
  SwapiPerson,
  SwapiPlanet,
  SwapiPlanetsResponse,
} from 'src/common/interfaces/swapi.interface';
import { appendIdFromURL, filterOutNulls } from 'src/common/utils';
import { SwapiService } from '../common/swapi.service';
import { DetailedPlanet, Planet } from './interfaces/planets.interface';

@Injectable()
export class PlanetsService {
  constructor(private readonly swapi: SwapiService) {}

  async getPlanets(): Promise<Planet[]> {
    const res = await this.swapi.fetch<SwapiPlanetsResponse>(
      `${this.swapi.baseUrl}/planets/?expanded=true`,
    );
    return res.results.map((swapiPlanet) => appendIdFromURL(swapiPlanet));
  }

  async getPlanetById(id: string): Promise<DetailedPlanet> {
    const response = await this.swapi.fetch<SwapiPlanet>(
      `${this.swapi.baseUrl}/planets/${id}`,
    );
    const planet = appendIdFromURL(response);

    const [films, residents] = await Promise.all([
      this.swapi.fetchMultiple<SwapiFilm>(response.films),
      this.swapi.fetchMultiple<SwapiPerson>(response.residents),
    ]);

    return {
      ...planet,
      films: filterOutNulls(films).map((film) => film.title),
      residents: filterOutNulls(residents).map((resident) => resident.name),
    };
  }
}
