import httpStatus from 'http-status';
import { authConfig } from '../../config';
import { container } from '../di/container';
import { ApiError } from '../utils/common.utils';
import { JwtService } from '../jwt/jwt.service';
import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../../infrastructure/types/request.types';

/**
 * @function authenticate
 * @description Middleware to authenticate HTTP requests using JWT.
 *
 * This middleware performs the following steps:
 * 1. Extracts the access token from the Authorization header
 * 2. Validates the token format (Bearer token)
 * 3. Verifies the token's validity using the JWT service
 * 4. Attaches user information to the request object if token is valid
 *
 * @param {IAuthRequest} req - Express request object with extended authentication properties
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @throws {ApiError} If authentication fails due to missing or invalid token
 */
export const authenticate = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // Retrieve JWT service from dependency injection container
  const jwtService = container.get<JwtService>('JwtService');

  // Extract authorization token from request headers
  let token = req.headers.authorization;

  // Validate token presence and format
  if (!token || !token.startsWith('Bearer ')) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Authentication required: No token provided or token format is invalid.',
    );
  }

  // Remove 'Bearer ' prefix
  token = token.slice(7);

  // Verify JWT token
  const decoded = jwtService.verifyJWT({
    token,
    secret: authConfig.JWT_SECRET!,
  });

  // Check if token is valid and not expired
  if (!decoded) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
  }

  // Attach user information to the request object
  req.user = {
    id: decoded.userId,
    deviceId: decoded.deviceId,
    roles: decoded.roles,
  };

  next();
};

/**
 * @function authorize
 * @description Middleware to authorize requests based on user roles.
 *
 * This middleware performs the following steps:
 * 1. Checks if user information is present in the request
 * 2. Validates that the user has at least one of the required roles
 * 3. Allows or denies access based on role matching
 *
 * @param {string[]} requiredRoles - An array of roles that are allowed to access the resource
 * @returns {Function} Express middleware function for role-based authorization
 * @throws {ApiError} If user lacks required roles or user information is missing
 */
export const authorize = (requiredRoles: string[]) => {
  return (req: IAuthRequest, res: Response, next: NextFunction) => {
    // Verify user information is present
    if (!req.user || !req.user.roles) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Access denied: User roles not found.',
      );
    }

    // Split comma-separated roles and check for required roles
    const userRoles = req.user.roles.split(',');
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    // Deny access if no required roles are found
    if (!hasRequiredRole) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Access denied: Insufficient permissions.',
      );
    }

    next();
  };
};
