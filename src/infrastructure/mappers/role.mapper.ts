import { Role as OrmRole } from '../orm/entities/role';
import { Role as DomainRole } from '../../domain/entities/role.entity';

/**
 * @class RoleMapper
 * @description Provides static methods for mapping between ORM and domain role entities.
 * Facilitates translation of role data between different layers of the application.
 */
export class RoleMapper {
  /**
   * @description Transforms an ORM role entity to a domain role entity.
   * @param {OrmRole} ormRole - The ORM role entity to be converted.
   * @returns {DomainRole} A new domain role entity with mapped properties.
   * @throws {Error} If mapping fails due to invalid input.
   */
  public static toDomain(ormRole: OrmRole): DomainRole {
    return new DomainRole({
      id: ormRole.id,
      name: ormRole.name,
      createdAt: ormRole.createdAt,
      updatedAt: ormRole.updatedAt,
      deletedAt: ormRole.deletedAt,
    });
  }

  /**
   * @description Transforms a domain role entity to a partial ORM role entity.
   * @param {DomainRole} domainRole - The domain role entity to be converted.
   * @returns {Partial<OrmRole>} A partial ORM role entity suitable for database operations.
   * @throws {Error} If mapping fails due to invalid input.
   */
  public static toOrmEntity(domainRole: DomainRole): Partial<OrmRole> {
    const ormRole: Partial<OrmRole> = {
      id: domainRole.id,
      name: domainRole.name,
    };
    return ormRole;
  }
}
