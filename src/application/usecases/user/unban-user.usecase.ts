import httpStatus from 'http-status';
import { ADMIN } from '../../../infrastructure/constants';
import { ApiError } from '../../../infrastructure/utils/common.utils';
import { UserDomainRepository } from '../../../domain/repositories/user.repository';

/**
 * @class UnbanUserUsecase
 * @description Use case for handling user unbanning process.
 * Responsible for validating permissions and performing user unban action.
 */
export class UnbanUserUsecase {
  /**
   * @constructor
   * @description Creates an instance of UnbanUserUsecase.
   * @param {UserDomainRepository} userRepository - Repository for user domain operations.
   */
  constructor(private readonly userRepository: UserDomainRepository) {}

  /**
   * @description Executes the user unbanning process.
   * @param {Object} params - The parameters for unbanning a user.
   * @param {string[]} params.actorRoles - The roles of the user performing the unban action.
   * @param {number} params.targetUserId - The unique identifier of the user to be unbanned.
   * @returns {Promise<User>} The updated user domain model after unbanning.
   * @throws {ApiError} If the actor lacks permission or the target user is not found.
   */
  public async execute({
    actorRoles,
    targetUserId,
  }: {
    actorRoles: string[];
    targetUserId: number;
  }) {
    // Only an admin can unban a user
    if (!actorRoles.includes(ADMIN)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Only an administrator can unban a user.',
      );
    }

    // Find the user to be unbanned
    const targetUser = await this.userRepository.getById({ id: targetUserId });
    if (!targetUser) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'User to be unbanned not found.',
      );
    }

    // Execute business logic to unban the user
    targetUser.unban();

    // Persist changes to the user
    const savedUser = await this.userRepository.save(targetUser);
    return savedUser;
  }
}
