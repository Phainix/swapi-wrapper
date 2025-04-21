import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { safeHttp } from './safeHttp';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SwapiService {
  public readonly baseUrl = 'https://swapi.py4e.com/api';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async fetch<T>(path: string): Promise<T> {
    const cacheKey = `swapi:${path.trim().toLowerCase()}`;
    const cached = await this.cacheManager.get<T>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const observableResponse = this.httpService.get<T>(path);
      const data = await safeHttp<T>(observableResponse);

      await this.cacheManager.set(cacheKey, data.data);
      return data.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Request failed: ${error.message}`);
      }
      throw error;
    }
  }

  async fetchMultiple<T>(urls: string[]): Promise<(T | null)[]> {
    return await Promise.all(
      urls.map(async (url) => {
        try {
          return await this.fetch<T>(url);
        } catch {
          console.log('catching the error');
          return null;
        }
      }),
    );
  }
}
