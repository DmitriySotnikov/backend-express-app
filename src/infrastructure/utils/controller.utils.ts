import { Response } from 'express';
import httpStatus from 'http-status';
import { ApiError } from './common.utils';
import { Role } from '../../domain/entities/role.entity';
import { configService } from '../../config/config.service';
import { IAuthRequest } from '../../infrastructure/types/request.types';

/**
 * Sets an HTTP-only secure cookie for authentication
 *
 * @description Configures and sets a secure, HTTP-only cookie with the authentication token
 *
 * Key Features:
 * - HTTP-only to prevent client-side script access
 * - Secure flag for HTTPS-only transmission
 * - SameSite protection against CSRF
 * - Configurable expiration time
 *
 * @param {Object} params - Cookie setting parameters
 * @param {Response} params.res - Express response object
 * @param {string} params.token - Authentication token to be stored in the cookie
 *
 * @example
 * setCookie({
 *   res: response,
 *   token: 'user_authentication_token'
 * });
 */
export const setCookie = ({ res, token }: { res: Response; token: string }) => {
  res.cookie(configService.get('COOKIE_TOKEN'), token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: configService.get('COOKIE_EXPIRES_IN'), // 604800000, // 7 days
  });
};

/**
 * Converts an array of roles to a comma-separated string of role names
 *
 * @description Transforms Role entities into a string representation
 *
 * @param {Role[] | readonly Role[]} roles - Array of Role entities
 * @returns {string} Comma-separated string of role names
 *
 * @example
 * const roleNames = rolesToString([
 *   { name: 'ADMIN' },
 *   { name: 'USER' }
 * ]);
 * // Returns: 'ADMIN,USER'
 */
export const rolesToString = (roles: Role[] | readonly Role[]) =>
  roles.map((role: Role) => role.name).join(',');

/**
 * Extracts the actor (user) information from an authenticated request
 *
 * @description Retrieves the current user's ID and roles from the request
 *
 * @param {IAuthRequest} req - Authenticated request object
 * @returns {Object} Object containing user ID and roles
 *
 * @example
 * const actor = getActor(request);
 * // Returns: { id: 123, roles: ['ADMIN', 'USER'] }
 */
export const getActor = (req: IAuthRequest) => ({
  id: req.user.id,
  roles: req.user.roles.split(','),
});

/**
 * Extracts and validates the target user ID from request parameters
 *
 * @description Parses the user ID from request parameters and validates it
 *
 * Key Features:
 * - Converts ID parameter to integer
 * - Validates that the ID is a valid number
 * - Throws an ApiError for invalid IDs
 *
 * @param {IAuthRequest} req - Authenticated request object
 * @returns {number} Validated user ID
 * @throws {ApiError} If the ID is not a valid number
 *
 * @example
 * try {
 *   const targetId = getTargetId(request);
 *   // Use the validated target ID
 * } catch (error) {
 *   // Handle invalid ID error
 * }
 */
export const getTargetId = (req: IAuthRequest) => {
  const targetUserId = parseInt(req.params.id, 10);
  if (isNaN(targetUserId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User ID must be a valid number.',
    );
  }
  return targetUserId;
};
