import httpStatus from 'http-status';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ApiError } from '../utils/common.utils';
import { configService } from '../../config/config.service';
import { JwtDomainService } from '../../domain/services/jwt.service';

/**
 * @description Represents the payload of a JWT token.
 * @interface JwtPayload
 * @property {number} userId - The unique identifier of the user.
 * @property {string} deviceId - Unique identifier of the user's device.
 * @property {string} roles - Comma-separated string of user roles.
 */
export interface JwtPayload {
  userId: number;
  deviceId: string;
  roles: string;
}

/**
 * @class JwtService
 * @description Infrastructure implementation of the JwtDomainService.
 * Provides JWT token creation and verification using jsonwebtoken library.
 * @implements {JwtDomainService}
 */
export class JwtService implements JwtDomainService {
  /**
   * @description Creates a JWT token for user authorization.
   * @param {Object} params - The parameters for token creation.
   * @param {number} params.userId - The unique identifier of the user.
   * @param {string} params.deviceId - Unique identifier of the user's device.
   * @param {string} params.roles - Comma-separated string of user roles.
   * @param {string} params.time - Token expiration time.
   * @returns {string} The generated JWT token.
   * @throws {ApiError} If token creation fails.
   */
  public createToken({
    userId,
    deviceId,
    roles,
    time,
  }: {
    userId: number;
    deviceId: string;
    roles: string;
    time: string;
  }): string {
    try {
      return jwt.sign(
        {
          userId,
          deviceId,
          roles,
        },
        configService.get('JWT_SECRET'),
        {
          expiresIn: time,
        } as SignOptions,
      ) as string; // Supported algorithms: 'HS256', 'RS256'
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Error creating token!',
      );
    }
  }

  /**
   * @description Verifies the authenticity and validity of a JWT token.
   * @param {Object} params - The parameters for token verification.
   * @param {string} params.token - The JWT token to verify.
   * @param {string} params.secret - The secret key used to verify the token.
   * @returns {JwtPayload | null} The decoded token payload, or null if verification fails.
   */
  public verifyJWT({
    token,
    secret,
  }: {
    token: string;
    secret: string;
  }): JwtPayload | null {
    try {
      return jwt.verify(token, secret) as JwtPayload | null;
    } catch (error) {
      return null;
    }
  }
}
