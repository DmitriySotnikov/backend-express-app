import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import { AllowedRoles } from '../../infrastructure/constants';

/**
 * @class Role
 * @description Represents a role entity in the system, extending the base entity.
 * Roles define access levels and permissions for users.
 * @extends {BaseEntity}
 */
export class Role extends BaseEntity {
  /**
   * @description The name of the role, restricted to predefined allowed roles.
   * @type {AllowedRoles}
   * @readonly
   */
  public readonly name: AllowedRoles;

  /**
   * @description Optional array of users associated with this role.
   * @type {User[]}
   * @readonly
   */
  public readonly users?: User[];

  /**
   * @constructor
   * @description Creates a new Role instance.
   * @param {Object} params - The parameters for creating a role.
   * @param {number} [params.id] - Optional unique identifier for the role.
   * @param {Date} [params.createdAt] - Optional timestamp of role creation.
   * @param {Date} [params.updatedAt] - Optional timestamp of last role update.
   * @param {Date} [params.deletedAt] - Optional timestamp of role deletion.
   * @param {AllowedRoles} params.name - The name of the role.
   * @param {User[]} [params.users] - Optional array of users with this role.
   */
  constructor({
    id,
    createdAt,
    updatedAt,
    deletedAt,
    name,
    users,
  }: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    name: AllowedRoles;
    users?: User[];
  }) {
    super({ id, createdAt, updatedAt, deletedAt });
    this.name = name;
    this.users = users;
  }
}
