import { lastValueFrom, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

export async function safeHttp<T>(
  observable: Observable<AxiosResponse<T>>,
): Promise<AxiosResponse<T>> {
  try {
    const response = await lastValueFrom(observable);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('HTTP error:', error.message);
      throw new Error(`HTTP error: ${error.message}`);
    }
    throw error;
  }
}
