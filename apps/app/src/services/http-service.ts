import type { SafeResult } from './common';
import type { FetchOptions } from './http-service.types';

interface HttpService {
  safeFetch<T>(options: FetchOptions): SafeResult<T>;
  setBaseUrl(baseUrl: string): void;
  isServerAvailable(): Promise<boolean>;
}

export class DefaultHttpService implements HttpService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Safe fetch method that returns both error and data
   * Usage: const [error, data] = await safeFetch<ReturnType>({ url, method, body })
   */
  async safeFetch<T>({
    url,
    method = 'GET',
    body = null,
    headers = {},
    timeout = 10000,
  }: FetchOptions): SafeResult<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const options: RequestInit = {
        method,
        headers: { ...this.defaultHeaders, ...headers },
        signal: controller.signal,
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }

      const fullUrl = this.baseUrl ? `${this.baseUrl}${url}` : url;

      const response = await fetch(fullUrl, options);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage: string;

        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || `HTTP error ${response.status}`;
        } catch {
          errorMessage = errorText || `HTTP error ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      // Handle empty responses
      if (response.status === 204 || response.headers.get('Content-Length') === '0') {
        return [null, null];
      }

      const data = (await response.json()) as T;
      return [null, data];
    } catch (error) {
      if (error instanceof Error) {
        return [{ error: true, message: error.message }, null];
      }
      return [{ error: true, message: 'Unknown error occurred' }, null];
    }
  }

  /**
   * Set base URL for all requests
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  async isServerAvailable(): Promise<boolean> {
    const [error, data] = await this.safeFetch<{ status: string }>({
      url: '/health',
      method: 'GET',
    });
    return !error || data?.status === 'ok';
  }
}

export const httpService = new DefaultHttpService();
