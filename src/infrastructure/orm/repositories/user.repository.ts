import { DataSource } from 'typeorm';
import httpStatus from 'http-status';
import { User as OrmUser } from '../entities/user';
import { BaseRepository } from './base.repository';
import { UserMapper } from '../../mappers/user.maper';
import { ApiError } from '../../../infrastructure/utils/common.utils';
import { User as DomainUser } from '../../../domain/entities/user.entity';
import { UserDomainRepository } from '../../../domain/repositories/user.repository';

/**
 * @class UserRepository
 * @description Infrastructure implementation of the UserDomainRepository.
 *
 * This repository handles user-related database operations:
 * - Extends BaseRepository for common database methods
 * - Implements UserDomainRepository interface
 * - Provides methods for finding, creating, updating, and retrieving users
 *
 * Key Features:
 * - Mapping between ORM and domain user entities
 * - Supports finding users by email and ID
 * - Handles user creation, update, and retrieval
 * - Provides pagination for user retrieval
 * - Includes robust error handling
 */
export class UserRepository
  extends BaseRepository<OrmUser>
  implements UserDomainRepository
{
  /**
   * @constructor
   * @description Creates an instance of UserRepository.
   * @param {DataSource} dataSource - The TypeORM DataSource for database operations
   */
  constructor(dataSource: DataSource) {
    super(OrmUser, dataSource);
  }

  /**
   * @description Finds a user by their email address.
   * Retrieves a single user matching the specified email.
   *
   * @param {{ email: string }} param - Object containing the user's email
   * @returns {Promise<DomainUser | null>} A promise that resolves to the user domain entity or null if not found
   * @throws {Error} If there's an issue retrieving the user from the database
   */
  async getByEmail(param: { email: string }): Promise<DomainUser | null> {
    const ormUser = await this.findOne({ where: { email: param.email } });
    return ormUser ? UserMapper.toDomain(ormUser) : null;
  }

  /**
   * @description Finds a user by their unique identifier.
   * Retrieves a single user matching the specified ID.
   *
   * @param {{ id: number }} param - Object containing the user's ID
   * @returns {Promise<DomainUser | null>} A promise that resolves to the user domain entity or null if not found
   * @throws {Error} If there's an issue retrieving the user from the database
   */
  async getById(param: { id: number }): Promise<DomainUser | null> {
    const ormUser = await this.findOne({ where: { id: param.id } });
    return ormUser ? UserMapper.toDomain(ormUser) : null;
  }

  /**
   * @description Creates a new user in the database.
   * Converts the domain user to an ORM entity, saves it, and returns the created domain user.
   *
   * @param {{ user: DomainUser }} param - Object containing the user to create
   * @returns {Promise<DomainUser>} A promise that resolves to the created user domain entity
   * @throws {Error} If there's an issue creating the user in the database
   */
  async create(param: { user: DomainUser }): Promise<DomainUser> {
    const ormUserToCreate = UserMapper.toOrmEntity(param.user);
    const createdOrmUser = await super.saveEntity(ormUserToCreate);
    return UserMapper.toDomain(createdOrmUser);
  }

  /**
   * @description Retrieves all users with optional pagination.
   * Allows fetching a subset of users with skip and take parameters.
   *
   * @param {{ pagination?: { skip?: number; take?: number } }} [param] - Optional pagination parameters
   * @param {number} [param.pagination.skip] - Number of records to skip
   * @param {number} [param.pagination.take] - Number of records to retrieve
   * @returns {Promise<DomainUser[]>} A promise that resolves to an array of user domain entities
   * @throws {Error} If there's an issue retrieving users from the database
   */
  async getAll(param?: {
    pagination?: { skip?: number; take?: number };
  }): Promise<DomainUser[]> {
    const ormUsers = await this.findAllPagination({
      skip: param?.pagination?.skip,
      take: param?.pagination?.take,
    });
    return ormUsers.map(UserMapper.toDomain);
  }

  /**
   * @description Saves an existing user in the database.
   * Updates the user if they already exist, or creates a new user if they don't.
   *
   * @param {DomainUser} user - The user domain entity to be saved
   * @returns {Promise<DomainUser>} A promise that resolves to the saved user domain entity
   * @throws {ApiError} If there's an issue saving the user in the database
   * @throws {Error} For any unexpected database or mapping errors
   */
  async save(user: DomainUser): Promise<DomainUser> {
    const ormUserToSave = UserMapper.toOrmEntity(user);

    const savedOrmUser = await super.saveEntity(ormUserToSave);

    if (!savedOrmUser) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to save user.',
      );
    }

    return UserMapper.toDomain(savedOrmUser);
  }
}
