import httpStatus from 'http-status';
import { ADMIN } from '../../../infrastructure/constants';
import { User } from '../../../domain/entities/user.entity';
import { ApiError } from '../../../infrastructure/utils/common.utils';
import { UserDomainRepository } from '../../../domain/repositories/user.repository';

/**
 * @description Input parameters for retrieving a user by ID.
 * @typedef {Object} GetUserInput
 * @property {number} actorId - The unique identifier of the user making the request.
 * @property {string[]} actorRoles - The roles of the user making the request.
 * @property {number} targetUserId - The unique identifier of the user being requested.
 */
type GetUserInput = {
  actorId: number; // The user making the request
  actorRoles: string[]; // Roles of the requesting user
  targetUserId: number; // The user being requested
};

/**
 * @class GetUserByIdUsecase
 * @description Use case for retrieving a user by their ID with permission validation.
 * Responsible for finding a user and checking access permissions.
 */
export class GetUserByIdUsecase {
  /**
   * @constructor
   * @description Creates an instance of GetUserByIdUsecase.
   * @param {UserDomainRepository} userRepository - Repository for user domain operations.
   */
  constructor(private readonly userRepository: UserDomainRepository) {}

  /**
   * @description Finds a user by ID and validates the requester's access permissions.
   * @param {GetUserInput} input - Parameters for user retrieval.
   * @param {number} input.actorId - The unique identifier of the user making the request.
   * @param {string[]} input.actorRoles - The roles of the user making the request.
   * @param {number} input.targetUserId - The unique identifier of the user being requested.
   * @returns {Promise<User>} The domain model of the found user.
   * @throws {ApiError} If the user is not found or the requester lacks access permissions.
   */
  public async execute({
    actorId,
    actorRoles,
    targetUserId,
  }: GetUserInput): Promise<User> {
    // Find the target user
    const targetUser = await this.userRepository.getById({ id: targetUserId });
    if (!targetUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check if the actor has access to view the user
    const canAccess = actorRoles.includes(ADMIN) || actorId === targetUserId;

    if (!canAccess) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You do not have permission to view this resource.',
      );
    }

    return targetUser;
  }
}
