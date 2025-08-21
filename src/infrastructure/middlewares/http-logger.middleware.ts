import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';

/**
 * @description Middleware for structured HTTP request and response logging using Winston.
 * Logs method, URL, IP address, response status, and request execution time.
 *
 * This middleware captures detailed information about each incoming HTTP request,
 * providing comprehensive logging for monitoring and debugging purposes.
 *
 * Key features:
 * - Captures request metadata (method, URL, IP)
 * - Measures request processing time
 * - Logs request details with HTTP log level
 * - Non-blocking logging mechanism
 *
 * @param {Request} req - Express request object representing the incoming HTTP request.
 * @param {Response} res - Express response object for sending back the response.
 * @param {NextFunction} next - Express middleware function for passing control to the next handler.
 *
 * @remarks
 * Uses high-resolution time measurement for precise duration tracking.
 * Logs are written asynchronously to prevent performance overhead.
 */
export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3); // Duration in milliseconds
    const { statusCode } = res;

    // Metadata for logging
    const meta = {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      ip,
    };

    // Log with 'http' level
    logger.http('HTTP Request', meta);
  });

  next();
};
