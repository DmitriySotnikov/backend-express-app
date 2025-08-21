import { DataSource } from 'typeorm';
import httpStatus from 'http-status';
import { BaseRepository } from './base.repository';
import { ApiError } from '../../utils/common.utils';
import { Session as OrmSession } from '../entities/session';
import { SessionMapper } from '../../mappers/session.mapper';
import { Session as DomainSession } from '../../../domain/entities/session.entity';
import { SessionDomainRepository } from '../../../domain/repositories/session.repositiry';

/**
 * @class SessionRepository
 * @description Infrastructure implementation of the SessionDomainRepository.
 *
 * This repository handles session-related database operations:
 * - Extends BaseRepository for common database methods
 * - Implements SessionDomainRepository interface
 * - Provides methods for finding, creating, updating, and deleting sessions
 *
 * Key Features:
 * - Mapping between ORM and domain session entities
 * - Supports finding sessions by user and device
 * - Handles session creation, update, and deletion
 * - Provides error handling for session operations
 */
export class SessionRepository
  extends BaseRepository<OrmSession>
  implements SessionDomainRepository
{
  /**
   * @constructor
   * @description Creates an instance of SessionRepository.
   * @param {DataSource} dataSource - The TypeORM DataSource for database operations
   */
  constructor(dataSource: DataSource) {
    super(OrmSession, dataSource);
  }

  /**
   * @description Finds a session by user ID and device ID.
   * Retrieves a single session matching the specified user and device.
   *
   * @param {{ userId: number; deviceId: string }} param - Object containing user and device identifiers
   * @returns {Promise<DomainSession | null>} A promise that resolves to the session domain entity or null if not found
   * @throws {Error} If there's an issue retrieving the session from the database
   */
  async findByUserIdAndDeviceId(param: {
    userId: number;
    deviceId: string;
  }): Promise<DomainSession | null> {
    const ormSession = await this.findOne({
      where: { userId: param.userId, deviceId: param.deviceId },
    });
    return ormSession ? SessionMapper.toDomain(ormSession) : null;
  }

  /**
   * @description Creates a new session in the database.
   * Converts the domain session to an ORM entity, saves it, and returns the created domain session.
   *
   * @param {{ session: DomainSession }} param - Object containing the session to create
   * @returns {Promise<DomainSession>} A promise that resolves to the created session domain entity
   * @throws {Error} If there's an issue creating the session in the database
   */
  async create(param: { session: DomainSession }): Promise<DomainSession> {
    const ormSessionToCreate = SessionMapper.toOrmEntity(param.session);
    const createdOrmSession = await super.saveEntity(ormSessionToCreate);
    return SessionMapper.toDomain(createdOrmSession);
  }

  /**
   * @description Updates an existing session in the database.
   * Converts the domain session to an ORM entity and updates it.
   *
   * @param {{ session: DomainSession }} param - Object containing the session to update
   * @returns {Promise<DomainSession>} A promise that resolves to the updated session domain entity
   * @throws {ApiError} If the session is not found or cannot be updated
   */
  async update(param: { session: DomainSession }): Promise<DomainSession> {
    const ormSessionToUpdate = SessionMapper.toOrmEntity(param.session);
    const updatedOrmSession = await super.updateEntiy(
      ormSessionToUpdate.id as number,
      ormSessionToUpdate,
    );

    if (!updatedOrmSession) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
    }

    return SessionMapper.toDomain(updatedOrmSession);
  }

  /**
   * @description Soft deletes a session from the database.
   * Marks the session as deleted without permanently removing it.
   *
   * @param {{ id: number }} param - Object containing the session ID to delete
   * @returns {Promise<void>} A promise that resolves when the session is soft deleted
   * @throws {Error} If there's an issue soft deleting the session
   */
  async delete(param: { id: number }): Promise<void> {
    await this.softDelete({ id: param.id });
  }
}
