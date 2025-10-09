import type { ErrorCode } from './error-codes';

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: ErrorCode };
