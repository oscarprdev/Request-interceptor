export type SafeResult<T> = Promise<[{ error: boolean; message: string } | null, T | null]>;

export const API_URL = 'http://localhost:8080/api/v1';
