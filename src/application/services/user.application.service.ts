import { BanUserUsecase } from '../usecases/user/ban-user.usecase';
import { UnbanUserUsecase } from '../usecases/user/unban-user.usecase';
import { UserPresenter } from '../../presentation/presenters/user.presenter';
import { GetAllUsersUsecase } from '../usecases/user/get-all-users.usecase';
import { GetUserByIdUsecase } from '../usecases/user/get-user-by-id.usecase';
import { TransactionManager } from '../../infrastructure/orm/typeorm/transaction.manager';

/**
 * @description Represents the actor (user) performing an action.
 * @typedef {Object} Actor
 * @property {number} id - The unique identifier of the actor.
 * @property {string[]} roles - The roles assigned to the actor.
 */
type Actor = { id: number; roles: string[] };

/**
 * @class UserApplicationService
 * @description Application service for managing user-related operations.
 * Acts as an orchestrator for user-related use cases, providing a single entry point
 * for controllers and managing transactions.
 */
export class UserApplicationService {
  /**
   * @constructor
   * @description Creates an instance of UserApplicationService.
   * @param {TransactionManager} transactionManager - Manager for handling database transactions.
   * @param {GetUserByIdUsecase} getUserByIdUsecase - Use case for retrieving a user by ID.
   * @param {GetAllUsersUsecase} getAllUsersUsecase - Use case for retrieving all users.
   * @param {BanUserUsecase} banUserUsecase - Use case for banning a user.
   * @param {UnbanUserUsecase} unbanUserUsecase - Use case for unbanning a user.
   */
  constructor(
    private readonly transactionManager: TransactionManager,
    private readonly getUserByIdUsecase: GetUserByIdUsecase,
    private readonly getAllUsersUsecase: GetAllUsersUsecase,
    private readonly banUserUsecase: BanUserUsecase,
    private readonly unbanUserUsecase: UnbanUserUsecase,
  ) {}

  /**
   * @description Retrieves user information for a specific user.
   * @param {Actor} actor - The user performing the request.
   * @param {number} targetUserId - The ID of the user whose information is being requested.
   * @returns {Promise<Object>} Transformed user information response.
   * @throws {Error} If the user cannot be retrieved or the actor lacks permissions.
   */
  public async getUserInfo(actor: Actor, targetUserId: number) {
    const userDomainModel = await this.getUserByIdUsecase.execute({
      actorId: actor.id,
      actorRoles: actor.roles,
      targetUserId,
    });

    return UserPresenter.toResponse(userDomainModel);
  }

  /**
   * @description Retrieves a list of all users with optional pagination.
   * @param {Object} [pagination] - Optional pagination parameters.
   * @param {number} [pagination.skip] - Number of users to skip.
   * @param {number} [pagination.take] - Number of users to retrieve.
   * @returns {Promise<Object[]>} Transformed list of user information responses.
   * @throws {Error} If users cannot be retrieved.
   */
  public async getAllUsers(pagination?: { skip?: number; take?: number }) {
    const userDomainModels = await this.getAllUsersUsecase.execute(pagination);
    return UserPresenter.toListResponse(userDomainModels);
  }

  /**
   * @description Bans a user by their ID.
   * @param {Actor} actor - The user performing the ban action.
   * @param {number} targetUserId - The ID of the user to be banned.
   * @returns {Promise<Object>} Transformed response of the updated user.
   * @throws {Error} If the user cannot be banned or the actor lacks permissions.
   */
  public async banUser(actor: Actor, targetUserId: number) {
    const updatedUserDomainModel =
      await this.transactionManager.runInTransaction(() => {
        return this.banUserUsecase.execute({
          actorId: actor.id,
          actorRoles: actor.roles,
          targetUserId,
        });
      });
    return UserPresenter.toResponse(updatedUserDomainModel);
  }

  /**
   * @description Unbans a user by their ID.
   * @param {Actor} actor - The user performing the unban action.
   * @param {number} targetUserId - The ID of the user to be unbanned.
   * @returns {Promise<Object>} Transformed response of the updated user.
   * @throws {Error} If the user cannot be unbanned or the actor lacks permissions.
   */
  public async unbanUser(actor: Actor, targetUserId: number) {
    const updatedUserDomainModel =
      await this.transactionManager.runInTransaction(() => {
        return this.unbanUserUsecase.execute({
          actorRoles: actor.roles,
          targetUserId,
        });
      });
    return UserPresenter.toResponse(updatedUserDomainModel);
  }
}
