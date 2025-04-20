import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  SwapiFilm,
  SwapiPerson,
  SwapiPlanet,
  SwapiPlanetsResponse,
} from 'src/common/interfaces/swapi.interface';
import {
  appendIdFromURL,
  calculateTotalPages,
  filterOutNulls,
} from 'src/common/utils';
import { SwapiService } from '../common/swapi.service';
import { DetailedPlanet, Planet } from './interfaces/planets.interface';
import { Paginated } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class PlanetsService {
  constructor(private readonly swapi: SwapiService) {}

  async getPlanets(page: number): Promise<Paginated<Planet>> {
    try {
      const res = await this.swapi.fetch<SwapiPlanetsResponse>(
        `${this.swapi.baseUrl}/planets/?page=${page}`,
      );
      return {
        results: res.results.map((swapiPlanet) => appendIdFromURL(swapiPlanet)),
        count: res.count,
        pages: calculateTotalPages(res.count, 10),
      };
    } catch {
      throw new InternalServerErrorException('Unable to fetch planets');
    }
  }

  async getPlanetById(id: string): Promise<DetailedPlanet> {
    let response: SwapiPlanet;
    try {
      response = await this.swapi.fetch<SwapiPlanet>(
        `${this.swapi.baseUrl}/planets/${id}`,
      );
    } catch {
      throw new NotFoundException('Planet not found');
    }
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
