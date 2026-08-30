import { isProduction } from '../config/env.js';

export const ERROR_CODES = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_FAILED: 'AUTH_FAILED',
  GMAIL_NOT_CONNECTED: 'GMAIL_NOT_CONNECTED',
  GOOGLE_AUTH_FAILED: 'GOOGLE_AUTH_FAILED',
  GOOGLE_TOKEN_EXPIRED: 'GOOGLE_TOKEN_EXPIRED',
  GMAIL_API_ERROR: 'GMAIL_API_ERROR',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  AI_REQUEST_FAILED: 'AI_REQUEST_FAILED',
  AI_RESPONSE_INVALID: 'AI_RESPONSE_INVALID',
  RATE_LIMITED: 'RATE_LIMITED',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

export class AppError extends Error {
  constructor(code, message, statusCode = 400, details = undefined) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFoundHandler(req, res, next) {
  next(
    new AppError(
      ERROR_CODES.NOT_FOUND,
      `Route ${req.method} ${req.originalUrl} was not found.`,
      404
    )
  );
}

// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity
export function errorHandler(err, req, res, next) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : ERROR_CODES.INTERNAL_SERVER_ERROR;
  const message = isAppError
    ? err.message
    : 'Something went wrong. Please try again.';

  if (!isAppError || statusCode >= 500) {
    console.error(`[${code}]`, err.message);
  }

  const body = {
    success: false,
    error: { code, message },
  };

  if (isAppError && err.details) {
    body.error.details = err.details;
  }

  if (!isProduction && !isAppError) {
    body.error.debug = err.message;
  }

  res.status(statusCode).json(body);
}
