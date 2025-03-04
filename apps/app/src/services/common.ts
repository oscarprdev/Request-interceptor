export type SafeResult<T> = Promise<[{ error: true; message: string } | null, T | null]>;
