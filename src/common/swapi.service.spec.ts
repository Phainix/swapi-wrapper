import { Test, TestingModule } from '@nestjs/testing';
import { SwapiService } from './swapi.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('SwapiService', () => {
  let cacheManager: Cache;
  let service: SwapiService;
  let httpService: HttpService;

  beforeEach(async () => {
    const cache = {
      get: jest.fn(),
      set: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwapiService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: cache,
        },
      ],
    }).compile();

    service = module.get<SwapiService>(SwapiService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe('fetch', () => {
    it('should return data from the API', async () => {
      const mockResponse: AxiosResponse = {
        data: { name: 'Luke Skywalker' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as AxiosRequestHeaders },
      };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse));

      const result = await service.fetch<{ name: string }>(
        'https://swapi.py4e.com/api/people/1',
      );
      expect(result).toEqual({ name: 'Luke Skywalker' });
    });

    it('should throw an error on failure', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(() => new Error('Network error')));

      await expect(
        service.fetch<{ name: string }>('invalid-url'),
      ).rejects.toThrow('Request failed: HTTP error: Network error');
    });

    it('should return cached data if available', async () => {
      const mockGet = jest.fn();
      const cachedData = { name: 'Cached Luke' };
      (cacheManager.get as jest.Mock).mockResolvedValueOnce(cachedData);
      jest.spyOn(httpService, 'get').mockImplementationOnce(mockGet);

      const result = await service.fetch<{ name: string }>(
        'https://swapi.py4e.com/api/people/1',
      );

      expect(cacheManager.get).toHaveBeenCalledWith(
        'swapi:https://swapi.py4e.com/api/people/1',
      );
      expect(result).toEqual(cachedData);
      expect(mockGet).not.toHaveBeenCalled(); // Should not make an HTTP call
    });
  });

  describe('fetchMultiple', () => {
    it('should return multiple results', async () => {
      const mockResponse: AxiosResponse = {
        data: { name: 'Leia Organa' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as AxiosRequestHeaders },
      };

      jest.spyOn(service, 'fetch').mockResolvedValueOnce(mockResponse.data);

      const results = await service.fetchMultiple<{ name: string }>(['url-1']);
      expect(results).toEqual([{ name: 'Leia Organa' }]);
    });

    it('should return null if a fetch fails', async () => {
      jest.spyOn(service, 'fetch').mockRejectedValueOnce(new Error('fail'));

      const results = await service.fetchMultiple(['url-1']);
      expect(results).toEqual([null]);
    });
  });
});
