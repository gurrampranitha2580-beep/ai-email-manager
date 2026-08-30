import { validationResult } from 'express-validator';

import { AppError, ERROR_CODES } from './errorHandler.js';

export function handleValidation(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    next();
    return;
  }

  const details = result.array().map((issue) => ({
    field: issue.path,
    message: issue.msg,
  }));

  next(
    new AppError(
      ERROR_CODES.INVALID_INPUT,
      'Some of the information you provided is not valid.',
      400,
      details
    )
  );
}
