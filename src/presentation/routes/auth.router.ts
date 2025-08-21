import { Router } from 'express';
import AuthUserController from '../controllers/auth.controller';
import { SignInDto, SignUpDto } from '../../infrastructure/types/dto.types';
import { signInSchema, signUpSchema } from '../../infrastructure/dtos/auth.dto';
import { validate } from '../../infrastructure/middlewares/validation.middleware';

/**
 * @function createAuthRouter
 * @description Creates and configures an Express router for authentication-related routes.
 *
 * This function sets up the following authentication endpoints:
 * - POST /signin: User sign-in
 * - POST /refresh: Token refresh
 * - POST /signup: User registration
 * - POST /logout: User logout
 *
 * Key Features:
 * - Uses validation middleware for request body validation
 * - Supports dependency injection of AuthUserController
 * - Provides OpenAPI (Swagger) documentation for each endpoint
 *
 * @param {AuthUserController} authController - The controller handling authentication logic
 * @returns {Router} Configured Express router for authentication routes
 */
export const createAuthRouter = (
  authController: AuthUserController,
): Router => {
  const router = Router();

  /**
   * @description Sign-in route for user authentication.
   *
   * Endpoint: POST /auth/signin
   * Validates sign-in request body using Joi schema
   * Calls the signin method of the AuthUserController
   *
   * Request Validation:
   * - Validates request body against signInSchema
   * - Ensures email, password, and deviceId are present and valid
   *
   * Response:
   * - 200: Successful authentication with access and refresh tokens
   * - 401: Authentication failed
   */

  /**
   * @openapi
   * /auth/signin:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: User Sign In
   *     description: Authenticate a user and generate access tokens.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SignInDto'
   *     responses:
   *       200:
   *         description: Successful authentication.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessAuthResponseDto'
   *       401:
   *         description: Authentication failed.
   */
  router.post(
    '/signin',
    validate<SignInDto>(signInSchema),
    authController.signin,
  );

  /**
   * @description Token refresh route.
   *
   * Endpoint: POST /auth/refresh
   * Allows clients to obtain a new access token using a refresh token
   *
   * Response:
   * - 200: Successfully refreshed tokens
   * - 401: Unauthorized (invalid or expired refresh token)
   */

  /**
   * @openapi
   * /auth/refresh:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Refresh Access Token
   *     description: Generate a new access token using a refresh token.
   *     responses:
   *       200:
   *         description: Token successfully refreshed.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessAuthResponseDto'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   */
  router.post('/refresh', authController.refreshToken);

  /**
   * @description User registration route.
   *
   * Endpoint: POST /auth/signup
   * Validates signup request body using Joi schema
   * Calls the signup method of the AuthUserController
   *
   * Request Validation:
   * - Validates request body against signUpSchema
   * - Ensures all required user registration fields are present and valid
   *
   * Response:
   * - 200: Successful registration with access and refresh tokens
   * - 400: Bad request (validation error)
   * - 500: Internal server error
   */

  /**
   * @openapi
   * /auth/signup:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Register a new user
   *     description: Creates a new user account and returns a pair of access and refresh tokens.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SignUpDto'
   *     responses:
   *       200:
   *         description: Successful registration. Returns tokens.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessAuthResponseDto'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   *     security: []
   */
  router.post(
    '/signup',
    validate<SignUpDto>(signUpSchema),
    authController.signup,
  );

  /**
   * @description User logout route.
   *
   * Endpoint: POST /auth/logout
   * Invalidates the user's current session by deleting the refresh token
   *
   * Response:
   * - 200: Successfully logged out
   * - 401: Unauthorized (no valid token)
   */

  /**
   * @openapi
   * /auth/logout:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Logout user
   *     description: Invalidates the user's session by deleting the refresh token. Requires authentication.
   *     responses:
   *       200:
   *         description: Successfully logged out.
   *         content:
   *           application/json:
   *             schema:
   *               # --- ВОТ ИСПРАВЛЕНИЕ ---
   *               $ref: '#/components/schemas/LogoutResponseDto'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *     security:
   *       - bearerAuth: []
   */
  router.post('/logout', authController.logout);

  return router;
};
