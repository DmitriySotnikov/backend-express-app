import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { configService } from '../../config/config.service';
import { container } from '../../infrastructure/di/container';
import { SignUpDto } from '../../infrastructure/types/dto.types';
import { ApiError } from '../../infrastructure/utils/common.utils';
import { setCookie } from '../../infrastructure/utils/controller.utils';
import { AuthApplicationService } from '../../application/services/auth.application.service';

/**
 * @class AuthUserController
 * @description Controller for handling authentication-related HTTP requests.
 *
 * Provides endpoints for:
 * - User sign-in
 * - Token refresh
 * - User registration
 * - User logout
 *
 * Key Features:
 * - Uses dependency injection for authentication service
 * - Manages authentication tokens via cookies
 * - Handles various authentication operations
 */
export default class AuthUserController {
  /**
   * @description Authentication application service for handling auth-related business logic.
   * @private
   * @type {AuthApplicationService}
   */
  private authService: AuthApplicationService;

  /**
   * @constructor
   * @description Creates an instance of AuthUserController.
   * Retrieves AuthApplicationService from the dependency injection container.
   */
  constructor() {
    this.authService = container.get<AuthApplicationService>(
      'AuthApplicationService',
    );
  }

  /**
   * @description Handles user sign-in process.
   *
   * This method:
   * - Extracts sign-in credentials from request body
   * - Calls authentication service to sign in the user
   * - Sets refresh token as an HTTP-only cookie
   * - Returns access token in the response
   *
   * @param {Request} req - The HTTP request object
   * @param {Response} res - The HTTP response object
   * @returns {Promise<void>} Sends HTTP response with access token
   * @throws {ApiError} If sign-in fails
   */
  public signin = async (req: Request, res: Response) => {
    const { email, password, deviceId } = req.body;
    const { accessToken, refreshToken } = await this.authService.signinUser({
      email,
      password,
      deviceId,
    });

    setCookie({ res, token: refreshToken });
    res.status(httpStatus.OK).json({ accessToken });
  };

  /**
   * @description Handles token refresh process.
   *
   * This method:
   * - Retrieves refresh token from cookies
   * - Throws an error if no token is present
   * - Calls authentication service to refresh tokens
   * - Sets new refresh token as an HTTP-only cookie
   * - Returns new access token in the response
   *
   * @param {Request} req - The HTTP request object
   * @param {Response} res - The HTTP response object
   * @returns {Promise<void>} Sends HTTP response with new access token
   * @throws {ApiError} If token refresh fails or no token is present
   */
  public refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies[configService.get('COOKIE_TOKEN')];
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token!');
    }
    const { accessToken, refreshToken } =
      await this.authService.refreshUserToken({ token });
    setCookie({ res, token: refreshToken });
    res.status(httpStatus.OK).json({ accessToken });
  };

  /**
   * @description Handles user registration process.
   *
   * This method:
   * - Extracts signup data from request body
   * - Calls authentication service to register the user
   * - Sets refresh token as an HTTP-only cookie
   * - Returns access token in the response
   *
   * @param {Request} req - The HTTP request object
   * @param {Response} res - The HTTP response object
   * @returns {Promise<void>} Sends HTTP response with access token
   * @throws {ApiError} If registration fails
   */
  public signup = async (req: Request, res: Response) => {
    const signupData = req.body as SignUpDto;

    const { accessToken, refreshToken } =
      await this.authService.signupUser(signupData);

    setCookie({ res, token: refreshToken });
    res.status(httpStatus.OK).json({ accessToken });
  };

  /**
   * @description Handles user logout process.
   *
   * This method:
   * - Retrieves refresh token from cookies
   * - Throws an error if no token is present
   * - Clears the refresh token cookie
   * - Calls authentication service to logout the user
   * - Returns logout result in the response
   *
   * @param {Request} req - The HTTP request object
   * @param {Response} res - The HTTP response object
   * @returns {Promise<void>} Sends HTTP response with logout result
   * @throws {ApiError} If logout fails or no token is present
   */
  public logout = async (req: Request, res: Response) => {
    const token = req.cookies[configService.get('COOKIE_TOKEN')];
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token!');
    }
    res.clearCookie(configService.get('COOKIE_TOKEN'), { httpOnly: true });
    const result = await this.authService.logoutUser({ token });
    res.status(httpStatus.OK).json(result);
  };
}
