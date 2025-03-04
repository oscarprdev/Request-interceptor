export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchOptions {
  url: string;
  method?: HttpMethod;
  body?: SafeBody;
  headers?: Record<string, string>;
  timeout?: number;
}

export type SafeBody = unknown | null;
