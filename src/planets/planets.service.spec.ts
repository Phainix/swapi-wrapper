import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsService } from './planets.service';
import { SwapiService } from '../common/swapi.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  SwapiFilm,
  SwapiPerson,
  SwapiPlanet,
} from 'src/common/interfaces/swapi.interface';

const mockPlanet = {
  name: 'Tatooine',
  url: 'https://swapi.dev/api/planets/1/',
  rotation_period: '23',
  orbital_period: '304',
  diameter: '10465',
  climate: 'arid',
  gravity: '1 standard',
  terrain: 'desert',
  surface_water: '1',
  population: '200000',
  films: [{ title: 'A New Hope' }],
  residents: [{ name: 'Luke Skywalker' }],
};

const mockSwapiPlanet: SwapiPlanet = {
  name: 'Tatooine',
  url: 'https://swapi.dev/api/planets/1/',
  rotation_period: '23',
  orbital_period: '304',
  diameter: '10465',
  climate: 'arid',
  gravity: '1 standard',
  terrain: 'desert',
  surface_water: '1',
  population: '200000',
  films: ['https://swapi.dev/api/films/1/'],
  residents: ['https://swapi.dev/api/people/1/'],
  created: '',
  edited: '',
};

const mockSwapiService = {
  fetch: jest.fn(),
  fetchMultiple: jest.fn(),
  baseUrl: 'https://swapi.dev/api',
};

describe('PlanetsService', () => {
  let service: PlanetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetsService,
        { provide: SwapiService, useValue: mockSwapiService },
      ],
    }).compile();

    service = module.get<PlanetsService>(PlanetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlanets', () => {
    it('should return a paginated list of planets', async () => {
      mockSwapiService.fetch.mockResolvedValue({
        count: 1,
        results: [mockPlanet],
      });

      const result = await service.getPlanets(1);
      expect(result.count).toBe(1);
      expect(result.pages).toBe(1);
      expect(result.results[0]).toHaveProperty('id', '1');
    });

    it('should throw InternalServerErrorException on failure', async () => {
      mockSwapiService.fetch.mockRejectedValueOnce(new Error('fail'));

      await expect(service.getPlanets(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getPlanetById', () => {
    it('should return detailed planet info', async () => {
      mockSwapiService.fetch.mockResolvedValue(mockSwapiPlanet);
      mockSwapiService.fetchMultiple.mockImplementation((urls: string[]) => {
        console.log(urls);
        return Promise.resolve(
          urls.map((url) => {
            if (url.includes('/films/'))
              return { title: 'A New Hope' } as SwapiFilm;
            if (url.includes('/people/'))
              return { name: 'Luke Skywalker' } as SwapiPerson;
            return null;
          }),
        );
      });

      const result = await service.getPlanetById('1');

      expect(result.name).toBe('Tatooine');
      expect(result.films).toContain('A New Hope');
      expect(result.residents).toContain('Luke Skywalker');
    });

    it('should throw NotFoundException when planet not found', async () => {
      mockSwapiService.fetch.mockRejectedValueOnce(new Error('not found'));

      await expect(service.getPlanetById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
