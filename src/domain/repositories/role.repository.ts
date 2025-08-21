import { Role as DomainRole } from '../entities/role.entity';
import { AllowedRoles } from '../../infrastructure/constants';

/**
 * @abstract
 * @class RoleDomainRepository
 * @description Abstract repository for managing role-related domain operations.
 * Provides an interface for role-related database interactions at the domain level.
 */
export abstract class RoleDomainRepository {
  /**
   * @description Finds roles by their names in the system.
   * @param {Object} param - Parameter object containing role names.
   * @param {AllowedRoles[]} param.names - Array of role names to search for.
   * @returns {Promise<DomainRole[]>} Promise resolving to an array of found role domain entities.
   * @throws {Error} If there's an issue retrieving roles from the data source.
   */
  abstract findByName(param: { names: AllowedRoles[] }): Promise<DomainRole[]>;

  /**
   * @description Retrieves all available roles in the system.
   * @returns {Promise<DomainRole[]>} Promise resolving to an array of all role domain entities.
   * @throws {Error} If there's an issue retrieving roles from the data source.
   */
  abstract getAll(): Promise<DomainRole[]>;

  /**
   * @description Creates a new role in the system.
   * @param {Object} param - Parameter object containing the role to create.
   * @param {DomainRole} param.role - The domain role entity to be created.
   * @returns {Promise<DomainRole>} Promise resolving to the created role domain entity.
   * @throws {Error} If there's an issue creating the role in the data source.
   */
  abstract create(param: { role: DomainRole }): Promise<DomainRole>;
}
