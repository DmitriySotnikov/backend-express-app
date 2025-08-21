/**
 * Winston Logger Configuration Module
 *
 * This module sets up a comprehensive logging system using Winston,
 * providing flexible logging capabilities across different environments.
 *
 * Key Features:
 * - Configurable logging levels
 * - Color-coded console output
 * - Environment-specific logging transports
 * - Structured logging with timestamps
 * - Error stack trace handling
 *
 * @module Logger
 * @requires winston
 * @requires config
 */
import winston from 'winston';
import { config } from '../../config';
import {
  DEBUG_LEVEL,
  ERROR_LEVEL,
  INFO_LEVEL,
  loggerColors,
  loggerLevel,
  loggerLevels,
  PRODUCTION,
  winstonTransportsFileNames,
} from '../../infrastructure/constants';

// Apply custom colors to winston logger for enhanced console readability
winston.addColors(loggerColors);

/**
 * Configures console logging format for the application.
 *
 * Creates a standardized log format with:
 * - Timestamp
 * - Color-coded output
 * - Error stack trace support
 *
 * @type {winston.Logform.Format}
 */
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const logMessage = info.stack || info.message;
    return `${info.timestamp} ${info.level}: ${logMessage}`;
  }),
);

/**
 * Configures file logging format for the application.
 *
 * Uses JSON format for:
 * - Structured logging
 * - Easy parsing
 * - Comprehensive error tracking
 *
 * @type {winston.Logform.Format}
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

/**
 * Configures logging transports based on the current environment.
 *
 * Transport Configuration:
 * - Always logs to console in all environments
 * - In production, additional file logging is enabled
 *
 * @type {winston.transport[]}
 */
const transports: winston.transport[] = [
  new winston.transports.Console({
    level: DEBUG_LEVEL,
    format: consoleFormat,
  }),
];

// Add file transports in production environment
if (config.NODE_ENV === PRODUCTION) {
  transports.push(
    // Dedicated file for error logs
    new winston.transports.File({
      filename: winstonTransportsFileNames.error,
      level: ERROR_LEVEL,
      format: fileFormat,
    }),
    // General log file for all important logs
    new winston.transports.File({
      filename: winstonTransportsFileNames.all,
      level: INFO_LEVEL,
      format: fileFormat,
    }),
  );
}

/**
 * Creates a configured Winston logger instance.
 *
 * Initializes logger with:
 * - Dynamic log level based on environment
 * - Custom log levels
 * - Configured transports
 *
 * @type {winston.Logger}
 */
const logger = winston.createLogger({
  level: loggerLevel(),
  levels: loggerLevels,
  transports,
});

/**
 * Exports the configured logger for use across the application.
 *
 * Provides methods for logging at different severity levels:
 * - error
 * - warn
 * - info
 * - http
 * - debug
 *
 * @exports logger
 */
export default logger;
