import { Injectable } from '@nestjs/common';
import {
  SwapiFilm,
  SwapiPeopleResponse,
  SwapiPerson,
  SwapiPlanet,
  SwapiStarship,
  SwapiVehicle,
} from 'src/common/interfaces/swapi.interface';
import { appendIdFromURL } from 'src/common/utils';
import { SwapiService } from '../common/swapi.service';
import { DetailedPerson, Person } from './interfaces/people.interface';

@Injectable()
export class PeopleService {
  constructor(private readonly swapi: SwapiService) {}

  async getPeople(): Promise<Person[]> {
    const res = await this.swapi.fetch<SwapiPeopleResponse>(
      `${this.swapi.baseUrl}/people/?expanded=true`,
    );
    return res.results.map((swapiPerson) => appendIdFromURL(swapiPerson));
  }

  async getPersonById(id: string): Promise<DetailedPerson> {
    const response = await this.swapi.fetch<SwapiPerson>(
      `${this.swapi.baseUrl}/people/${id}`,
    );
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
      films: films.map((film) => film.title),
      vehicles: vehicles.map((vehicle) => vehicle.name),
      starships: starships.map((starship) => starship.name),
    };
  }
}
