import { User } from '../entities/user.entity';

/**
 * @abstract
 * @class UserDomainRepository
 * @description Abstract repository for managing user-related domain operations.
 * Defines the contract for user-related database interactions at the domain level.
 */
export abstract class UserDomainRepository {
  /**
   * @description Retrieves a single user by their ID.
   * @param {Object} param - The search parameters.
   * @param {number} param.id - The unique identifier of the user to find.
   * @returns {Promise<User | null>} A promise that resolves to the user domain entity or null if not found.
   * @throws {Error} If there's an issue retrieving the user from the data source.
   */
  abstract getById(param: { id: number }): Promise<User | null>;

  /**
   * @description Retrieves a single user by their email address.
   * @param {Object} param - The search parameters.
   * @param {string} param.email - The email address of the user to find.
   * @returns {Promise<User | null>} A promise that resolves to the user domain entity or null if not found.
   * @throws {Error} If there's an issue retrieving the user from the data source.
   */
  abstract getByEmail(param: { email: string }): Promise<User | null>;

  /**
   * @description Retrieves multiple users with optional pagination.
   * @param {Object} [param] - Optional parameters for retrieving users.
   * @param {Object} [param.pagination] - Pagination options.
   * @param {number} [param.pagination.skip] - Number of users to skip.
   * @param {number} [param.pagination.take] - Number of users to retrieve.
   * @returns {Promise<User[]>} A promise that resolves to an array of user domain entities.
   * @throws {Error} If there's an issue retrieving users from the data source.
   */
  abstract getAll(param?: {
    pagination?: { skip?: number; take?: number };
  }): Promise<User[]>;

  /**
   * @description Creates a new user in the data source.
   * @param {Object} param - The parameter object containing the user to create.
   * @param {User} param.user - The user domain entity to be created.
   * @returns {Promise<User>} A promise that resolves to the created user.
   * @throws {Error} If there's an issue creating the user in the data source.
   */
  abstract create(param: { user: User }): Promise<User>;

  /**
   * @description Saves a user in the data source.
   * Updates an existing user or creates a new user if they don't exist.
   *
   * @param {User} user - The user domain entity to be saved.
   * @returns {Promise<User>} A promise that resolves to the saved user.
   * @throws {Error} If there's an issue saving the user in the data source.
   */
  abstract save(user: User): Promise<User>;
}
