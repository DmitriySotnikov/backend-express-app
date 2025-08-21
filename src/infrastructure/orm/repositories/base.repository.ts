import {
  DeepPartial,
  EntityManager,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  ObjectLiteral,
} from 'typeorm';
import { DataSource } from 'typeorm';
import { als } from '../typeorm/transaction.manager';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * @class BaseRepository
 * @description Abstract base repository providing common database operations.
 *
 * This generic repository class offers a set of standard CRUD operations:
 * - Supports transactional and non-transactional database operations
 * - Provides methods for creating, reading, updating, and deleting entities
 * - Handles repository retrieval within and outside of transactions
 *
 * Key Features:
 * - Generic type support for different entity types
 * - Automatic repository management
 * - Supports pagination
 * - Soft delete functionality
 *
 * @template T The type of the entity managed by this repository
 */
export class BaseRepository<T extends ObjectLiteral> {
  /**
   * @description TypeORM repository for the specific entity type.
   * @protected
   * @type {Repository<T>}
   */
  protected repository: Repository<T>;

  /**
   * @description Constructor function for the entity type.
   * @protected
   * @type {new () => T}
   */
  protected entityClass: new () => T;

  /**
   * @description TypeORM DataSource for database connections.
   * @protected
   * @type {DataSource}
   */
  protected dataSource: DataSource;

  /**
   * @constructor
   * @description Creates an instance of BaseRepository.
   * @param {new () => T} Entity - The entity class constructor
   * @param {DataSource} dataSource - The TypeORM DataSource for database operations
   */
  constructor(Entity: new () => T, dataSource: DataSource) {
    this.entityClass = Entity;
    this.dataSource = dataSource;
    this.repository = this.dataSource.getRepository(Entity);
  }

  /**
   * @description Retrieves the appropriate repository, considering active transactions.
   * Ensures that operations within a transaction use the transactional entity manager.
   * @protected
   * @returns {Repository<T>} The repository to use for database operations
   */
  protected getRepository(): Repository<T> {
    const transactionalManager = als.getStore()?.manager;
    return transactionalManager
      ? transactionalManager.getRepository(this.entityClass)
      : this.repository;
  }

  /**
   * @description Saves a new entity to the database.
   * Creates the entity and then saves it, returning the saved entity.
   * @protected
   * @param {DeepPartial<T>} data - Partial entity data to save
   * @returns {Promise<T>} The saved entity
   */
  protected async saveEntity(data: DeepPartial<T>): Promise<T> {
    const repository = this.getRepository();
    const entity = repository.create(data);
    return repository.save(entity as any);
  }

  /**
   * @description Finds a single entity by given search options.
   * @protected
   * @param {FindOneOptions<T>} options - Options for finding the entity
   * @returns {Promise<T | null>} The found entity or null
   */
  protected async findOne(options: FindOneOptions<T>): Promise<T | null> {
    const repository = this.getRepository();
    return await repository.findOne(options);
  }

  /**
   * @description Finds entities with optional pagination.
   * @protected
   * @param {{ skip?: number; take?: number }} [options] - Pagination options
   * @returns {Promise<T[]>} Array of found entities
   */
  protected async findAllPagination(options?: {
    skip?: number;
    take?: number;
  }): Promise<T[]> {
    const repository = this.getRepository();
    const { skip, take } = options || {};
    return repository.find({
      skip,
      take,
    });
  }

  /**
   * @description Finds all entities of the repository.
   * @protected
   * @param {EntityManager} [manager] - Optional entity manager
   * @returns {Promise<T[]>} Array of all entities
   */
  protected async findAll(manager?: EntityManager): Promise<T[]> {
    const repository = this.getRepository();
    return repository.find();
  }

  /**
   * @description Updates an existing entity in the database.
   * @protected
   * @param {string | number} id - The ID of the entity to update
   * @param {QueryDeepPartialEntity<T>} entity - Partial entity with updated values
   * @returns {Promise<T | null>} The updated entity or null if not found
   */
  protected async updateEntiy(
    id: string | number,
    entity: QueryDeepPartialEntity<T>,
  ): Promise<T | null> {
    const repository = this.getRepository();
    await repository.update(id, entity);
    return this.findOne({ where: { id } as any });
  }

  /**
   * @description Deletes an entity by given conditions.
   * @protected
   * @param {FindOptionsWhere<T>} options - Conditions for deleting the entity
   * @returns {Promise<void>}
   */
  protected async delete(options: FindOptionsWhere<T>): Promise<void> {
    const repository = this.getRepository();
    await repository.delete(options);
  }

  /**
   * @description Soft deletes an entity by given conditions.
   * Marks the entity as deleted without removing it from the database.
   * @protected
   * @param {FindOptionsWhere<T>} options - Conditions for soft deleting the entity
   * @returns {Promise<void>}
   */
  protected async softDelete(options: FindOptionsWhere<T>): Promise<void> {
    const repository = this.getRepository();
    await repository.softDelete(options);
  }
}
