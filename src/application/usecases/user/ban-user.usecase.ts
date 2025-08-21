import httpStatus from 'http-status';
import { ADMIN } from '../../../infrastructure/constants';
import { ApiError } from '../../../infrastructure/utils/common.utils';
import { UserDomainRepository } from '../../../domain/repositories/user.repository';

/**
 * @class BanUserUsecase
 * @description Use case for handling user banning process.
 * Responsible for validating permissions and performing user ban action.
 */
export class BanUserUsecase {
  /**
   * @constructor
   * @description Creates an instance of BanUserUsecase.
   * @param {UserDomainRepository} userRepository - Repository for user domain operations.
   */
  constructor(private readonly userRepository: UserDomainRepository) {}

  /**
   * @description Executes the user banning process.
   * @param {Object} params - The parameters for banning a user.
   * @param {number} params.actorId - The unique identifier of the user performing the ban action.
   * @param {string[]} params.actorRoles - The roles of the user performing the ban action.
   * @param {number} params.targetUserId - The unique identifier of the user to be banned.
   * @returns {Promise<User>} The updated user domain model after banning.
   * @throws {ApiError} If the target user is not found, or the actor lacks permission to ban.
   */
  public async execute({
    actorId,
    actorRoles,
    targetUserId,
  }: {
    actorId: number;
    actorRoles: string[];
    targetUserId: number;
  }) {
    // Find the user to be banned
    const targetUser = await this.userRepository.getById({ id: targetUserId });
    if (!targetUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User to be banned not found.');
    }

    // Check if the actor has permission to ban
    const canBan = actorRoles.includes(ADMIN) || actorId === targetUserId;

    if (!canBan) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You do not have permission to perform this action.',
      );
    }

    // Additional security measure: prevent admin from banning another admin
    if (actorId !== targetUserId && targetUser.hasRole(ADMIN)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'An administrator cannot ban another administrator.',
      );
    }

    // Execute business logic to ban the user
    targetUser.ban();

    // Persist changes to the user
    const updatedUser = await this.userRepository.save(targetUser);
    return updatedUser;
  }
}
