import { JwtPayload } from 'jsonwebtoken';

/**
 * @abstract
 * @class JwtDomainService
 * @description Abstract service for JSON Web Token (JWT) operations.
 * Defines the contract for token creation and verification.
 */
export abstract class JwtDomainService {
  /**
   * @description Creates a new JWT token with the provided payload.
   * @param {Object} payload - The token payload containing user information.
   * @param {number} payload.userId - The unique identifier of the user.
   * @param {string} payload.deviceId - Unique identifier of the user's device.
   * @param {string} payload.roles - Comma-separated string of user roles.
   * @param {string} payload.time - Token expiration time.
   * @returns {string} The generated JWT token.
   * @throws {Error} If token creation fails.
   */
  abstract createToken(payload: {
    userId: number;
    deviceId: string;
    roles: string;
    time: string;
  }): string;

  /**
   * @description Verifies the authenticity and validity of a JWT token.
   * @param {Object} params - The parameters for token verification.
   * @param {string} params.token - The JWT token to verify.
   * @param {string} params.secret - The secret key used to verify the token.
   * @returns {JwtPayload | string | null} The decoded token payload, or null if verification fails.
   * @throws {Error} If token verification encounters an unexpected error.
   */
  abstract verifyJWT(params: {
    token: string;
    secret: string;
  }): JwtPayload | string | null;
}
