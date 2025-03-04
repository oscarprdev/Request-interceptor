export type SafeResult<T> = Promise<[{ error: boolean; message: string } | null, T | null]>;
