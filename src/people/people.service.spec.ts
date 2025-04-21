import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { SwapiService } from '../common/swapi.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  SwapiPeopleResponse,
  SwapiPerson,
  SwapiPlanet,
  SwapiFilm,
  SwapiVehicle,
  SwapiStarship,
} from 'src/common/interfaces/swapi.interface';

describe('PeopleService', () => {
  let service: PeopleService;
  let swapiService: jest.Mocked<SwapiService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: SwapiService,
          useValue: {
            fetch: jest.fn(),
            fetchMultiple: jest.fn(),
            baseUrl: 'https://swapi.test/api',
          },
        },
      ],
    }).compile();

    service = module.get(PeopleService);
    swapiService = module.get(SwapiService);
  });

  describe('getPeople', () => {
    it('should return paginated people with calculated pages', async () => {
      const response: SwapiPeopleResponse = {
        count: 20,
        results: [
          {
            name: 'Luke Skywalker',
            url: 'https://swapi.test/api/people/1',
          } as SwapiPerson,
          {
            name: 'Leia Organa',
            url: 'https://swapi.test/api/people/5',
          } as SwapiPerson,
        ],
        previous: '',
        next: '',
      };

      swapiService.fetch.mockResolvedValue(response);

      const result = await service.getPeople(1);

      expect(result.count).toBe(20);
      expect(result.pages).toBe(2);
      expect(result.results[0].id).toBe('1');
      expect(result.results[1].id).toBe('5');
    });

    it('should throw InternalServerErrorException on fetch error', async () => {
      swapiService.fetch.mockRejectedValue(new Error('API failure'));

      await expect(service.getPeople(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getPersonById', () => {
    it('should return a detailed person with related data', async () => {
      const person: SwapiPerson = {
        name: 'Luke Skywalker',
        homeworld: 'https://swapi.test/api/planets/1',
        films: ['https://swapi.test/api/films/1'],
        vehicles: ['https://swapi.test/api/vehicles/14'],
        starships: ['https://swapi.test/api/starships/12'],
        url: 'https://swapi.test/api/people/1',
      } as SwapiPerson;

      swapiService.fetch.mockImplementation((url: string) => {
        if (url.includes('/people/')) return Promise.resolve(person);
        if (url.includes('/planets/'))
          return Promise.resolve({ name: 'Tatooine' } as SwapiPlanet);
        throw new Error('Unexpected URL');
      });

      swapiService.fetchMultiple.mockImplementation((urls: string[]) => {
        return Promise.resolve(
          urls.map((url) => {
            if (url.includes('/films/'))
              return { title: 'A New Hope' } as SwapiFilm;
            if (url.includes('/vehicles/'))
              return { name: 'Snowspeeder' } as SwapiVehicle;
            if (url.includes('/starships/'))
              return { name: 'X-wing' } as SwapiStarship;
            return null;
          }),
        );
      });

      const result = await service.getPersonById('1');

      expect(result.id).toBe('1');
      expect(result.homeworld).toBe('Tatooine');
      expect(result.films).toEqual(['A New Hope']);
      expect(result.vehicles).toEqual(['Snowspeeder']);
      expect(result.starships).toEqual(['X-wing']);
    });

    it('should throw NotFoundException when person is not found', async () => {
      swapiService.fetch.mockRejectedValue(new Error('Not found'));

      await expect(service.getPersonById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
