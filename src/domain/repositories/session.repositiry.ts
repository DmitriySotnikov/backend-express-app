import { Session } from '../entities/session.entity';

/**
 * @abstract
 * @class SessionDomainRepository
 * @description Abstract repository for managing session-related domain operations.
 * Defines the contract for session-related database interactions at the domain level.
 */
export abstract class SessionDomainRepository {
  /**
   * @description Finds a session by user ID and device ID.
   * @param {Object} param - The search parameters.
   * @param {number} param.userId - The unique identifier of the user.
   * @param {string} param.deviceId - The unique identifier of the device.
   * @returns {Promise<Session | null>} A promise that resolves to the found session or null if not found.
   * @throws {Error} If there's an issue retrieving the session from the data source.
   */
  abstract findByUserIdAndDeviceId(param: {
    userId: number;
    deviceId: string;
  }): Promise<Session | null>;

  /**
   * @description Creates a new session in the data source.
   * @param {Object} param - The parameter object containing the session to create.
   * @param {Session} param.session - The session domain entity to be created.
   * @returns {Promise<Session>} A promise that resolves to the created session.
   * @throws {Error} If there's an issue creating the session in the data source.
   */
  abstract create(param: { session: Session }): Promise<Session>;

  /**
   * @description Updates an existing session in the data source.
   * @param {Object} param - The parameter object containing the session to update.
   * @param {Session} param.session - The session domain entity with updated values.
   * @returns {Promise<Session | null>} A promise that resolves to the updated session or null if not found.
   * @throws {Error} If there's an issue updating the session in the data source.
   */
  abstract update(param: { session: Session }): Promise<Session | null>;

  /**
   * @description Deletes a session from the data source by its ID.
   * @param {Object} param - The parameter object containing the session ID to delete.
   * @param {number} param.id - The unique identifier of the session to delete.
   * @returns {Promise<void>} A promise that resolves when the session is deleted.
   * @throws {Error} If there's an issue deleting the session from the data source.
   */
  abstract delete(param: { id: number }): Promise<void>;
}
