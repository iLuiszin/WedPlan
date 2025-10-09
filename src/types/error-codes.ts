export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DB_ERROR = 'DB_ERROR',
  INVALID_LINK = 'INVALID_LINK',
  EXPORT_ERROR = 'EXPORT_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}
