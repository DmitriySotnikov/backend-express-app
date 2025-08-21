import { configService } from '../../config/config.service';

/**
 * Predefined User Roles
 *
 * Defines the standard user roles used throughout the application
 * for access control and authorization purposes.
 *
 * @constant
 * @type {string}
 */
export const USER = 'USER';
export const ADMIN = 'ADMIN';

/**
 * Environment Mode Constants
 *
 * Defines the standard environment modes for application configuration
 * and runtime behavior differentiation.
 *
 * @constant
 * @type {string}
 */
export const PRODUCTION = 'production';
export const DEVELOPMENT = 'development';
export const TEST = 'test';

/**
 * Allowed User Roles
 *
 * A readonly array of valid user roles that can be assigned in the system.
 * Provides type safety and a centralized definition of permitted roles.
 *
 * @constant
 * @type {readonly string[]}
 */
export const allowedRoles = [ADMIN, USER] as const;

/**
 * Type definition for Allowed Roles
 *
 * Creates a type that represents the union of allowed role names.
 * Enables type-safe role assignments and checks.
 *
 * @type {type}
 */
export type AllowedRoles = (typeof allowedRoles)[number];

/**
 * Logger Color Configuration
 *
 * Defines color mappings for different log levels in the console output.
 * Enhances log readability by associating colors with log severity.
 *
 * @constant
 * @type {Object}
 */
export const loggerColors = {
  error: 'red', // Errors and critical issues
  warn: 'yellow', // Warning messages
  info: 'green', // Informational messages
  http: 'magenta', // HTTP request logs
  debug: 'white', // Debugging information
};

/**
 * Logger Level Numerical Mapping
 *
 * Assigns numerical priorities to different log levels.
 * Lower numbers indicate higher severity.
 *
 * @constant
 * @type {Object}
 */
export const loggerLevels = {
  error: 0 as const, // Highest priority
  warn: 1 as const,
  info: 2 as const,
  http: 3 as const,
  debug: 4 as const, // Lowest priority
};

/**
 * Determines the appropriate logging level based on the current environment
 *
 * @returns {string} The log level ('debug' for development, 'warn' for production)
 */
export const loggerLevel = () => {
  return configService.isDevelopment ? 'debug' : 'warn';
};

/**
 * Winston Transport File Names
 *
 * Defines the log file paths for different logging transports.
 * Separates error logs from general application logs.
 *
 * @constant
 * @type {Object}
 */
export const winstonTransportsFileNames = {
  error: 'logs/error.log', // Dedicated file for error logs
  all: 'logs/all.log', // Comprehensive log file
};

/**
 * Logging Level Constants
 *
 * Provides string constants for different logging levels
 * to ensure consistency across the logging system.
 *
 * @constant
 * @type {string}
 */
export const DEBUG_LEVEL = 'debug';
export const INFO_LEVEL = 'info';
export const ERROR_LEVEL = 'error';
