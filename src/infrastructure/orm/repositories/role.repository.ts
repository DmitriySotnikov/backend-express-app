import { DataSource, In } from 'typeorm';
import { AllowedRoles } from '../../constants';
import { BaseRepository } from './base.repository';
import { Role as OrmRole } from '../entities/role';
import { RoleMapper } from '../../mappers/role.mapper';
import { Role as DomainRole } from '../../../domain/entities/role.entity';
import { RoleDomainRepository } from '../../../domain/repositories/role.repository';

/**
 * @class RoleRepository
 * @description Infrastructure implementation of the RoleDomainRepository.
 *
 * This repository handles role-related database operations:
 * - Extends BaseRepository for common database methods
 * - Implements RoleDomainRepository interface
 * - Provides methods for finding, creating, and retrieving roles
 *
 * Key Features:
 * - Efficient role lookup using 'In' operator
 * - Mapping between ORM and domain role entities
 * - Supports retrieving roles by name
 */
export class RoleRepository
  extends BaseRepository<OrmRole>
  implements RoleDomainRepository
{
  /**
   * @constructor
   * @description Creates an instance of RoleRepository.
   * @param {DataSource} dataSource - The TypeORM DataSource for database operations
   */
  constructor(dataSource: DataSource) {
    super(OrmRole, dataSource);
  }

  /**
   * @description Finds roles by their names using an efficient database query.
   * Uses the 'In' operator to retrieve multiple roles in a single query.
   *
   * @param {{ names: AllowedRoles[] }} param - Object containing an array of role names
   * @returns {Promise<DomainRole[]>} A promise that resolves to an array of found role domain entities
   * @throws {Error} If there's an issue retrieving roles from the database
   */
  async findByName(param: { names: AllowedRoles[] }): Promise<DomainRole[]> {
    const ormRoles = await this.repository.find({
      where: {
        name: In(param.names), // Use 'In' operator for efficient multi-role lookup
      },
    });
    return ormRoles.map(RoleMapper.toDomain);
  }

  /**
   * @description Retrieves all roles from the database.
   *
   * @returns {Promise<DomainRole[]>} A promise that resolves to an array of all role domain entities
   * @throws {Error} If there's an issue retrieving roles from the database
   */
  async getAll(): Promise<DomainRole[]> {
    const allOrmRoles = await super.findAll();
    return allOrmRoles.map(RoleMapper.toDomain);
  }

  /**
   * @description Creates a new role in the database.
   * Converts the domain role to an ORM entity, saves it, and returns the created domain role.
   *
   * @param {{ role: DomainRole }} param - Object containing the role to create
   * @returns {Promise<DomainRole>} A promise that resolves to the created role domain entity
   * @throws {Error} If there's an issue creating the role in the database
   */
  async create(param: { role: DomainRole }): Promise<DomainRole> {
    const ormRoleToCreate = RoleMapper.toOrmEntity(param.role);
    const createdOrmRole = await super.saveEntity(ormRoleToCreate);
    return RoleMapper.toDomain(createdOrmRole);
  }
}
