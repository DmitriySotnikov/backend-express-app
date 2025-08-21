import { Router } from 'express';
import { ADMIN } from '../../infrastructure/constants';
import {
  authenticate,
  authorize,
} from '../../infrastructure/middlewares/auth.middleware';
import UserController from '../controllers/user.controller';

/**
 * @function createUserRouter
 * @description Creates and configures an Express router for user-related routes.
 *
 * This function sets up the following user endpoints:
 * - GET /users/{id}: Retrieve user information
 * - GET /users: List all users (admin-only)
 * - POST /users/{id}/ban: Ban a user
 * - POST /users/{id}/unban: Unban a user (admin-only)
 *
 * Key Features:
 * - Uses authentication middleware for all routes
 * - Implements role-based access control
 * - Supports dependency injection of UserController
 * - Provides OpenAPI (Swagger) documentation for each endpoint
 *
 * @param {UserController} userController - The controller handling user-related logic
 * @returns {Router} Configured Express router for user routes
 */
export const createUserRouter = (userController: UserController): Router => {
  const router = Router();

  /**
   * @description User information retrieval route.
   *
   * Endpoint: GET /users/{id}
   * Retrieves detailed information for a specific user
   *
   * Authentication:
   * - Requires valid authentication token
   * - User can only access their own information or requires admin role
   *
   * Request Parameters:
   * - id: Numeric ID of the user to retrieve
   *
   * Response:
   * - 200: Successfully retrieved user information
   * - 401: Unauthorized (no valid token)
   * - 404: User not found
   */

  /**
   * @openapi
   * /users/{id}:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get user information by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *           format: int64
   *         description: The ID of the user to retrieve.
   *     responses:
   *       '200':
   *         description: OK. The user data was successfully retrieved.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponseDto'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  router.get('/:id', authenticate, userController.info);

  /**
   * @description List all users route.
   *
   * Endpoint: GET /users
   * Retrieves a list of all users in the system
   *
   * Authentication:
   * - Requires valid authentication token
   * - Restricted to users with ADMIN role
   *
   * Response:
   * - 200: Successfully retrieved list of users
   * - 401: Unauthorized (no valid token)
   * - 403: Forbidden (insufficient permissions)
   */

  /**
   * @openapi
   * /users:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get a list of all users
   *     description: Retrieves a list of all users. Requires ADMIN role.
   *     responses:
   *       '200':
   *         description: OK. A list of users was successfully retrieved.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserListResponseDto'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   */
  router.get('/', authenticate, authorize([ADMIN]), userController.getList);

  /**
   * @description User ban route.
   *
   * Endpoint: POST /users/{id}/ban
   * Allows banning a specific user
   *
   * Authentication:
   * - Requires valid authentication token
   * - User can ban themselves or requires admin role
   *
   * Request Parameters:
   * - id: Numeric ID of the user to ban
   *
   * Response:
   * - 200: User successfully banned
   * - 401: Unauthorized (no valid token)
   * - 403: Forbidden (insufficient permissions)
   * - 404: User not found
   * - 500: Internal server error
   */

  /**
   * @openapi
   * /users/{id}/ban:
   *   post:
   *     tags:
   *       - Users
   *     summary: Ban User by ID
   *     description: Ban a user by their ID. Requires authentication.
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *           format: int64
   *         required: true
   *         description: Numeric ID of the user to ban.
   *     responses:
   *       200:
   *         description: User successfully banned.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponseDto'
   *
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   *
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.post('/:id/ban', authenticate, userController.ban);

  /**
   * @description User unban route.
   *
   * Endpoint: POST /users/{id}/unban
   * Allows unbanning a specific user
   *
   * Authentication:
   * - Requires valid authentication token
   * - Restricted to users with ADMIN role
   *
   * Request Parameters:
   * - id: Numeric ID of the user to unban
   *
   * Response:
   * - 200: User successfully unbanned
   * - 401: Unauthorized (no valid token)
   * - 403: Forbidden (insufficient permissions)
   * - 404: User not found
   * - 500: Internal server error
   */

  /**
   * @openapi
   * /users/{id}/unban:
   *   post:
   *     tags:
   *       - Users
   *     summary: Unban User by ID
   *     description: Unban a user by their ID. Requires authentication and Admin role.
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *           format: int64
   *         required: true
   *         description: Numeric ID of the user to unban.
   *     responses:
   *       200:
   *         description: User successfully unbanned.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponseDto'
   *
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   *
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.post(
    '/:id/unban',
    authenticate,
    authorize([ADMIN]),
    userController.unban,
  );

  return router;
};
