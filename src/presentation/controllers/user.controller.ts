import { Response } from 'express';
import { container } from '../../infrastructure/di/container';
import { IAuthRequest } from '../../infrastructure/types/request.types';
import {
  getActor,
  getTargetId,
} from '../../infrastructure/utils/controller.utils';
import { UserApplicationService } from '../../application/services/user.application.service';

/**
 * @class UserController
 * @description Controller for handling user-related HTTP requests.
 *
 * Provides endpoints for:
 * - Retrieving user information
 * - Listing users
 * - Banning and unbanning users
 *
 * Key Features:
 * - Uses dependency injection for user service
 * - Supports role-based access control
 * - Handles various user management operations
 */
export default class UserController {
  /**
   * @description User application service for handling user-related business logic.
   * @private
   * @type {UserApplicationService}
   */
  private userService: UserApplicationService;

  /**
   * @constructor
   * @description Creates an instance of UserController.
   * Retrieves UserApplicationService from the dependency injection container.
   */
  constructor() {
    this.userService = container.get<UserApplicationService>(
      'UserApplicationService',
    );
  }

  /**
   * @description Retrieves information for a specific user.
   *
   * This method:
   * - Extracts target user ID from the request
   * - Retrieves actor (requesting user) information
   * - Calls user service to get user information
   *
   * @param {IAuthRequest} req - The authenticated request object
   * @param {Response} res - The Express response object
   * @returns {Promise<Response>} HTTP response with user information
   */
  public info = async (req: IAuthRequest, res: Response) => {
    const targetUserId = getTargetId(req);
    const actor = getActor(req);
    const result = await this.userService.getUserInfo(actor, targetUserId);
    return res.send(result);
  };

  /**
   * @description Retrieves a list of all users.
   *
   * This method:
   * - Calls user service to get all users
   *
   * @param {IAuthRequest} req - The authenticated request object
   * @param {Response} res - The Express response object
   * @returns {Promise<Response>} HTTP response with list of users
   */
  public getList = async (req: IAuthRequest, res: Response) => {
    const result = await this.userService.getAllUsers();
    return res.send(result);
  };

  /**
   * @description Bans a specific user.
   *
   * This method:
   * - Extracts target user ID from the request
   * - Retrieves actor (requesting user) information
   * - Calls user service to ban the user
   *
   * @param {IAuthRequest} req - The authenticated request object
   * @param {Response} res - The Express response object
   * @returns {Promise<Response>} HTTP response with updated user information
   */
  public ban = async (req: IAuthRequest, res: Response) => {
    const targetUserId = getTargetId(req);
    const actor = getActor(req);
    const result = await this.userService.banUser(actor, targetUserId);
    return res.send(result);
  };

  /**
   * @description Unbans a specific user.
   *
   * This method:
   * - Extracts target user ID from the request
   * - Retrieves actor (requesting user) information
   * - Calls user service to unban the user
   *
   * @param {IAuthRequest} req - The authenticated request object
   * @param {Response} res - The Express response object
   * @returns {Promise<Response>} HTTP response with updated user information
   */
  public unban = async (req: IAuthRequest, res: Response) => {
    const targetUserId = getTargetId(req);
    const actor = getActor(req);
    const result = await this.userService.unbanUser(actor, targetUserId);
    return res.send(result);
  };
}
