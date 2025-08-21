/**
 * ApiError Class
 *
 * A standardized error class for managing API-related errors.
 * Provides a consistent way to handle and propagate errors across the application.
 *
 * Key Features:
 * - Captures HTTP status code
 * - Distinguishes between operational and non-operational errors
 * - Supports additional error details
 * - Generates stack trace for debugging
 *
 * @class ApiError
 * @extends Error
 *
 * @property {number} statusCode - HTTP status code associated with the error
 * @property {boolean} isOperational - Indicates if the error is an expected operational error
 * @property {any[]} errors - Additional error details or validation errors
 *
 * @example
 * // Throw an API error with a 404 status
 * throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
 *
 * @example
 * // Throw an API error with validation errors
 * throw new ApiError(
 *   httpStatus.BAD_REQUEST,
 *   'Validation failed',
 *   validationErrors
 * );
 */
export class ApiError extends Error {
  /**
   * HTTP status code associated with the error
   * @type {number}
   */
  public readonly statusCode: number;

  /**
   * Indicates if the error is an expected operational error
   * @type {boolean}
   */
  public readonly isOperational: boolean;

  /**
   * Additional error details or validation errors
   * @type {any[]}
   */
  public readonly errors: any[];

  /**
   * Creates an instance of ApiError
   *
   * @param {number} statusCode - HTTP status code for the error
   * @param {string} message - Error message describing the issue
   * @param {any[]} [errors=[]] - Optional array of additional error details
   * @param {boolean} [isOperational=true] - Whether the error is operational
   * @param {string} [stack=''] - Optional custom stack trace
   */
  constructor(
    statusCode: number,
    message: string,
    errors: any[] = [],
    isOperational = true,
    stack = '',
  ) {
    // Call parent Error constructor with the message
    super(message);

    // Set error properties
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    // Handle stack trace
    if (stack) {
      this.stack = stack;
    } else {
      // Capture stack trace, excluding constructor from stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
