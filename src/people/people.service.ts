import { Injectable } from '@nestjs/common';
import { SwapiService } from '../common/swapi.service';
import {
  SwapiCommonResponse,
  SwapiFilmResponse,
  SwapiPeopleResponse,
  SwapiPerson,
  SwapiPersonResponse,
} from 'src/common/interfaces/swapi.interface';
import { DetailedPerson, Person } from './interfaces/people.interface';

@Injectable()
export class PeopleService {
  constructor(private readonly swapi: SwapiService) {}

  swapiPersonToPerson(person: SwapiPerson): Person {
    return {
      name: person.properties.name,
      height: person.properties.height,
      mass: person.properties.mass,
      hair_color: person.properties.hair_color,
      skin_color: person.properties.skin_color,
      eye_color: person.properties.eye_color,
      birth_year: person.properties.birth_year,
      gender: person.properties.gender,
      id: person.uid,
    };
  }

  async getPeople(): Promise<Person[]> {
    const res = await this.swapi.fetch<SwapiPeopleResponse>(
      `${this.swapi.baseUrl}/people/?expanded=true`,
    );
    return res.results.map((swapiPerson) =>
      this.swapiPersonToPerson(swapiPerson),
    );
  }

  async getPersonById(id: string): Promise<DetailedPerson> {
    const response = await this.swapi.fetch<SwapiPersonResponse>(
      `${this.swapi.baseUrl}/people/${id}`,
    );
    console.log(response.result);
    const person = this.swapiPersonToPerson(response.result);
    const filmsResponse = await this.swapi.fetch<SwapiFilmResponse>(
      `${this.swapi.baseUrl}/films`,
    );
    const filmsForPerson = filmsResponse.result.filter((film) =>
      film.properties.characters.some((character) =>
        character.endsWith(`/${id}`),
      ),
    );
    const allVehicles = filmsForPerson
      .map((film) => film.properties.vehicles)
      .flat();
    const allStarships = filmsForPerson
      .map((film) => film.properties.starships)
      .flat();

    const [homeworld, vehicles, starships] = await Promise.all([
      this.swapi.fetch<SwapiCommonResponse>(
        response.result.properties.homeworld,
      ),
      this.swapi.fetchMultiple<SwapiCommonResponse>([...new Set(allVehicles)]),
      this.swapi.fetchMultiple<SwapiCommonResponse>([...new Set(allStarships)]),
    ]);

    return {
      ...person,
      homeworld: homeworld.result.properties.name,
      films: filmsForPerson.map((film) => film.properties.title),
      vehicles: vehicles.map((vehicle) => vehicle.result.properties.name),
      starships: starships.map((starship) => starship.result.properties.name),
    };
  }
}
