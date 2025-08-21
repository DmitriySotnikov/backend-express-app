import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager } from 'typeorm';

/**
 * @description Provides AsyncLocalStorage for managing transaction-specific entity managers.
 * Allows tracking the current transaction's entity manager across async operations.
 * @type {AsyncLocalStorage<{ manager: EntityManager }>}
 */
export const als = new AsyncLocalStorage<{ manager: EntityManager }>();

/**
 * @class TransactionManager
 * @description Manages database transactions using TypeORM's transaction mechanism.
 *
 * Key Features:
 * - Provides a method to run operations within a database transaction
 * - Uses AsyncLocalStorage to maintain transaction context
 * - Ensures atomic database operations
 *
 * Transaction Behavior:
 * - Automatically rolls back the transaction if an error occurs
 * - Provides a consistent way to run complex database operations
 */
export class TransactionManager {
  /**
   * @constructor
   * @description Creates an instance of TransactionManager.
   * @param {DataSource} dataSource - The TypeORM DataSource for creating transactions
   */
  constructor(private readonly dataSource: DataSource) {}

  /**
   * @description Runs a callback function within a database transaction.
   *
   * This method:
   * - Starts a new database transaction
   * - Runs the provided callback within the transaction
   * - Automatically commits the transaction if successful
   * - Automatically rolls back the transaction if an error occurs
   *
   * @template T The return type of the callback function
   * @param {() => Promise<T>} callback - The function to execute within the transaction
   * @returns {Promise<T>} The result of the callback function
   * @throws {Error} If the transaction fails or the callback throws an error
   */
  async runInTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.dataSource.manager.transaction(async (manager) => {
      return als.run({ manager }, callback);
    });
  }
}
