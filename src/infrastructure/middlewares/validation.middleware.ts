import Joi from 'joi';
import httpStatus from 'http-status';
import { ApiError } from '../utils/common.utils';
import { Request, Response, NextFunction } from 'express';

/**
 * @function validate
 * @description Middleware for validating request data using Joi schemas.
 *
 * This middleware performs the following key functions:
 * 1. Selectively picks validation schemas for params, query, and body
 * 2. Compiles and validates the request data against the specified schema
 * 3. Transforms the request object with validated data
 * 4. Passes validation errors to the error handling middleware
 *
 * Validation Features:
 * - Supports validation of params, query, and body
 * - Provides detailed error messages for validation failures
 * - Aborts validation on first error to prevent multiple error messages
 * - Assigns validated and transformed data back to the request object
 *
 * @template T The type of the schema being validated
 * @param {Joi.ObjectSchema<T>} schema - The Joi schema to validate against
 * @returns {Function} Express middleware function for request validation
 * @throws {ApiError} If validation fails, with a BAD_REQUEST status and error details
 */
export const validate =
  <T>(schema: Joi.ObjectSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    // Select validation schemas for params, query, and body
    const validSchema = pick(schema, ['params', 'query', 'body']);

    // Pick corresponding request data for validation
    const object = pick(req, Object.keys(validSchema));

    // Compile and validate the schema
    const { value, error } = Joi.compile(validSchema)
      .prefs({
        errors: { label: 'key' }, // Use key names in error messages
        abortEarly: false, // Collect all validation errors
      })
      .validate(object);

    // Handle validation errors
    if (error) {
      // Combine all error messages into a single string
      const errorMessage = error.details
        .map((details) => details.message)
        .join(', ');

      // Pass validation error to error handling middleware
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    // Assign validated and transformed data back to request
    Object.assign(req, value);
    return next();
  };

/**
 * @function pick
 * @description Utility function to selectively pick properties from an object.
 *
 * This function creates a new object with only the specified keys from the source object.
 *
 * @param {Record<string, any>} object - The source object to pick properties from
 * @param {string[]} keys - An array of keys to select from the source object
 * @returns {Record<string, any>} A new object containing only the selected properties
 */
const pick = (object: Record<string, any>, keys: string[]) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};
