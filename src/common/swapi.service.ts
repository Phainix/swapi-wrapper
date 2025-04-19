import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { safeHttp } from './safeHttp';

@Injectable()
export class SwapiService {
  public readonly baseUrl = 'https://swapi.tech/api';

  constructor(private readonly httpService: HttpService) {}

  async fetch<T>(path: string): Promise<T> {
    try {
      const observableResponse = this.httpService.get<T>(path);
      const data = await safeHttp<T>(observableResponse);
      return data.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Request failed: ${error.message}`);
      }
      throw error;
    }
  }

  async fetchMultiple<T>(urls: string[]): Promise<T[]> {
    return Promise.all(
      urls.map(async (url) => {
        return await this.fetch<T>(url);
      }),
    );
  }
}
