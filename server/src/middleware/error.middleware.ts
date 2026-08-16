import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string = 'INTERNAL_ERROR',
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    logger.warn({ path: req.path, issues: err.issues }, 'Validation Error');
    return sendError(
      res,
      'Validation Error',
      422,
      'VALIDATION_ERROR',
      err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))
    );
  }

  if (err instanceof AppError) {
    logger.warn(
      { path: req.path, statusCode: err.statusCode, code: err.code, message: err.message },
      'Operational Error'
    );
    return sendError(res, err.message, err.statusCode, err.code, err.details);
  }

  logger.error({ err, path: req.path, stack: err.stack }, 'Unhandled Server Error');
  return sendError(
    res,
    'Internal Server Error',
    500,
    'INTERNAL_SERVER_ERROR'
  );
}
