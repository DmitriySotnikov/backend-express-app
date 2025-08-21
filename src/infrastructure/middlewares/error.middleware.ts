import httpStatus from 'http-status';
import { config } from '../../config';
import { ApiError } from '../utils/common.utils';
import logger from '../../infrastructure/logger/logger';
import { Request, Response, NextFunction } from 'express';
import { DEVELOPMENT } from '../../infrastructure/constants';

/**
 * @function errorHandler
 * @description Centralized error handling middleware for Express applications.
 *
 * This middleware performs the following key functions:
 * 1. Standardizes error responses across the application
 * 2. Differentiates between operational and unexpected errors
 * 3. Logs errors with different severity based on their type
 * 4. Provides detailed error information in development mode
 *
 * Error Handling Strategy:
 * - Operational Errors (ApiError with isOperational = true):
 *   - Logged as warnings
 *   - Predictable and expected errors (e.g., validation, authentication)
 * - Unexpected Errors (isOperational = false):
 *   - Logged as errors
 *   - Unhandled exceptions, potential bugs
 *
 * @param {Error | ApiError} err - The error object to be processed
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error: ApiError;

  // Transform unexpected errors into standardized ApiError
  if (!(err instanceof ApiError)) {
    error = new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An unexpected internal server error occurred.',
      [],
      false, // Mark as non-operational error
    );
    // Preserve original stack trace for logging
    error.stack = err.stack;
  } else {
    // Use existing ApiError without modification
    error = err;
  }

  // Extract error properties
  const { statusCode, message, errors } = error;

  // Log errors based on their operational status
  if (!error.isOperational) {
    // Log unexpected errors with full details
    logger.error('Unexpected Error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  } else {
    // Log operational errors as warnings
    logger.warn(
      `API Error: ${statusCode} - ${message} - URL: ${req.originalUrl} - Method: ${req.method} - IP: ${req.ip}`,
    );
  }

  // Prepare standardized error response
  const response: { statusCode: number; message: string; errors?: any[] } = {
    statusCode,
    message,
  };

  // Include additional error details if available
  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  // Include stack trace only in development mode for debugging
  if (config.NODE_ENV === DEVELOPMENT) {
    (response as any).stack = error.stack;
  }

  // Send error response with appropriate status code
  res.status(statusCode).json(response);
};
