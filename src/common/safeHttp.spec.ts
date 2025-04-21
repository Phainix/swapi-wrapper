import { of, throwError } from 'rxjs';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { safeHttp } from './safeHttp';

describe('safeHttp', () => {
  it('should return response when observable resolves', async () => {
    const mockResponse: AxiosResponse = {
      data: { message: 'ok' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders },
    };

    const observable$ = of(mockResponse);
    const result = await safeHttp(observable$);
    expect(result).toEqual(mockResponse);
  });

  it('should throw formatted error when observable throws Error', async () => {
    const observable$ = throwError(() => new Error('Request failed'));

    await expect(safeHttp(observable$)).rejects.toThrow(
      'HTTP error: Request failed',
    );
  });

  it('should rethrow unknown error types', async () => {
    const observable$ = throwError(() => 'Some unknown error');

    await expect(safeHttp(observable$)).rejects.toBe('Some unknown error');
  });
});
