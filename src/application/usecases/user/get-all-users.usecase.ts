import { User } from '../../../domain/entities/user.entity';
import { UserDomainRepository } from '../../../domain/repositories/user.repository';

/**
 * @description Input parameters for retrieving users with pagination.
 * @typedef {Object} GetAllUsersInput
 * @property {number} [skip] - Number of users to skip (for pagination).
 * @property {number} [take] - Number of users to retrieve (for pagination).
 */
type GetAllUsersInput = {
  skip?: number;
  take?: number;
};

/**
 * @class GetAllUsersUsecase
 * @description Use case for retrieving a list of all users with optional pagination.
 * Provides a simple delegation to the user repository for fetching users.
 */
export class GetAllUsersUsecase {
  /**
   * @constructor
   * @description Creates an instance of GetAllUsersUsecase.
   * @param {UserDomainRepository} userRepository - Repository for user domain operations.
   */
  constructor(private readonly userRepository: UserDomainRepository) {}

  /**
   * @description Retrieves a list of all users with optional pagination.
   * @param {GetAllUsersInput} [pagination] - Pagination parameters.
   * @returns {Promise<User[]>} An array of user domain models.
   * @throws {Error} If there's an issue retrieving users from the repository.
   */
  public async execute(pagination?: GetAllUsersInput): Promise<User[]> {
    // Delegate to repository with no additional business logic
    return this.userRepository.getAll({ pagination });
  }
}
