import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  SwapiFilm,
  SwapiPeopleResponse,
  SwapiPerson,
  SwapiPlanet,
  SwapiStarship,
  SwapiVehicle,
} from 'src/common/interfaces/swapi.interface';
import {
  appendIdFromURL,
  calculateTotalPages,
  filterOutNulls,
} from 'src/common/utils';
import { SwapiService } from '../common/swapi.service';
import { DetailedPerson, Person } from './interfaces/people.interface';
import { Paginated } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class PeopleService {
  constructor(private readonly swapi: SwapiService) {}

  async getPeople(page: number, search?: string): Promise<Paginated<Person>> {
    try {
      const res = await this.swapi.fetch<SwapiPeopleResponse>(
        `${this.swapi.baseUrl}/people/?page=${page}&search=${search}`,
      );
      return {
        results: res.results.map((swapiPerson) => appendIdFromURL(swapiPerson)),
        count: res.count,
        pages: calculateTotalPages(res.count, 10),
      };
    } catch {
      throw new InternalServerErrorException('Unable to fetch people');
    }
  }

  async getPersonById(id: string): Promise<DetailedPerson> {
    let response: SwapiPerson;
    try {
      response = await this.swapi.fetch<SwapiPerson>(
        `${this.swapi.baseUrl}/people/${id}`,
      );
    } catch {
      throw new NotFoundException('Person not found');
    }
    const person = appendIdFromURL(response);

    const [homeworld, films, vehicles, starships] = await Promise.all([
      this.swapi.fetch<SwapiPlanet>(response.homeworld),
      this.swapi.fetchMultiple<SwapiFilm>(response.films),
      this.swapi.fetchMultiple<SwapiVehicle>(response.vehicles),
      this.swapi.fetchMultiple<SwapiStarship>(response.starships),
    ]);

    return {
      ...person,
      homeworld: homeworld.name,
      films: filterOutNulls(films).map((film) => film.title),
      vehicles: filterOutNulls(vehicles).map((vehicle) => vehicle?.name),
      starships: filterOutNulls(starships).map((starship) => starship.name),
    };
  }
}
