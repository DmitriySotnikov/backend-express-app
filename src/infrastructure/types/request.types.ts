import { Request } from 'express';

/**
 * @interface IAuthRequest
 * @description Extended Express Request interface for authenticated requests.
 * Adds user information to the standard Express Request object.
 *
 * Used in authenticated routes to provide:
 * - User's unique identifier
 * - Device identifier
 * - User's roles
 */
export interface IAuthRequest extends Request {
  /**
   * @description User information attached to authenticated requests.
   * @property {number} id - Unique identifier of the authenticated user
   * @property {string} deviceId - Unique identifier of the user's device
   * @property {string} roles - Comma-separated string of user roles
   */
  user: {
    id: number;
    deviceId: string;
    roles: string;
  };
}
