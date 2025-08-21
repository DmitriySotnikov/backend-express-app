import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { ApiError } from '../utils/common.utils';

/**
 * @description Middleware for handling requests to non-existent routes.
 * Generates a 404 Not Found error and passes it to the centralized error handler.
 *
 * This middleware is the last resort for unmatched routes, ensuring
 * that any request to an undefined endpoint receives a standardized error response.
 *
 * Key features:
 * - Creates a standardized ApiError with 404 status code
 * - Passes error to next middleware for uniform error handling
 *
 * @param {Request} req - Express request object representing the incoming HTTP request.
 * @param {Response} res - Express response object for sending back the response.
 * @param {NextFunction} next - Express middleware function for passing control to the next handler.
 *
 * @throws {ApiError} Throws a 404 error for any unmatched route.
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new ApiError(
    httpStatus.NOT_FOUND,
    'The requested resource was not found on this server.',
  );
  next(error);
};
