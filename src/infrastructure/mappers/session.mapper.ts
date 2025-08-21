import { DeepPartial } from 'typeorm';
import { UserMapper } from './user.maper';
import { Session as OrmSession } from '../orm/entities/session';
import { Session as DomainSession } from '../../domain/entities/session.entity';

/**
 * @class SessionMapper
 * @description Provides static methods for mapping between ORM and domain session entities.
 * Facilitates translation of session data between different layers of the application.
 */
export class SessionMapper {
  /**
   * @description Transforms an ORM session entity to a domain session entity.
   * @param {OrmSession} ormSession - The ORM session entity to be converted.
   * @returns {DomainSession} A new domain session entity with mapped properties.
   * @throws {Error} If mapping fails due to invalid input.
   */
  public static toDomain(ormSession: OrmSession): DomainSession {
    return new DomainSession({
      id: ormSession.id,
      createdAt: ormSession.createdAt,
      updatedAt: ormSession.updatedAt,
      deletedAt: ormSession.deletedAt,
      refreshToken: ormSession.refreshToken,
      deviceId: ormSession.deviceId,
      isActive: ormSession.isActive,
      userId: ormSession.userId,
      user: ormSession.user ? UserMapper.toDomain(ormSession.user) : undefined,
    });
  }

  /**
   * @description Transforms a domain session entity to a partial ORM session entity.
   * @param {DomainSession} domainSession - The domain session entity to be converted.
   * @returns {DeepPartial<OrmSession>} A partial ORM session entity suitable for database operations.
   * @throws {Error} If mapping fails due to invalid input.
   */
  public static toOrmEntity(
    domainSession: DomainSession,
  ): DeepPartial<OrmSession> {
    const ormSession = new OrmSession();
    ormSession.id = domainSession.id;
    ormSession.refreshToken = domainSession.refreshToken;
    ormSession.deviceId = domainSession.deviceId;
    ormSession.isActive = domainSession.isActive;
    ormSession.userId = domainSession.userId;
    return ormSession;
  }
}
