import { DeepPartial } from 'typeorm';
import { RoleMapper } from './role.mapper';
import { User as OrmUser } from '../orm/entities/user';
import { User as DomainUser } from '../../domain/entities/user.entity';

/**
 * @class UserMapper
 * @description Provides static methods for mapping between ORM and domain user entities.
 * Facilitates translation of user data between different layers of the application.
 */
export class UserMapper {
  /**
   * @description Transforms an ORM user entity to a domain user entity.
   * Converts all relevant properties, including nested role entities.
   * @param {OrmUser} ormUser - The ORM user entity to be converted.
   * @returns {DomainUser} A new domain user entity with mapped properties.
   * @throws {Error} If mapping fails due to invalid input.
   */
  public static toDomain(ormUser: OrmUser): DomainUser {
    return new DomainUser({
      id: ormUser.id,
      createdAt: ormUser.createdAt,
      updatedAt: ormUser.updatedAt,
      deletedAt: ormUser.deletedAt,
      firstname: ormUser.firstname,
      lastname: ormUser.lastname,
      surname: ormUser.surname,
      email: ormUser.email,
      password: ormUser.password,
      birthDate: ormUser.birthDate,
      isBanned: ormUser.isBanned,
      roles: ormUser.roles ? ormUser.roles.map(RoleMapper.toDomain) : [],
    });
  }

  /**
   * @description Transforms a domain user entity to a partial ORM user entity.
   * Prepares the entity for database creation or update operations.
   * Converts nested role entities and handles password persistence.
   * @param {DomainUser} user - The domain user entity to be converted.
   * @returns {DeepPartial<OrmUser>} A partial ORM user entity suitable for database operations.
   * @throws {Error} If mapping fails due to invalid input.
   */
  public static toOrmEntity(user: DomainUser): DeepPartial<OrmUser> {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      surname: user.surname,
      email: user.email,
      password: user.passwordForPersistence as string,
      birthDate: user.birthDate,
      isBanned: user.isBanned,
      roles: user.roles ? user.roles.map(RoleMapper.toOrmEntity) : [],
    };
  }
}
