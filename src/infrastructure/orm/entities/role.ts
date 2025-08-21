import { User } from './user';
import { BaseEntity } from './base';
import { AllowedRoles } from '../../constants';
import { Column, Entity, ManyToMany } from 'typeorm';

/**
 * @class Role
 * @description ORM entity representing user roles in the system.
 *
 * This entity defines the structure of roles in the database:
 * - Extends BaseEntity for common tracking fields
 * - Stores role name with unique constraint
 * - Establishes many-to-many relationship with Users
 *
 * Key Features:
 * - Unique role names
 * - Supports multiple roles per user
 * - Inherits tracking capabilities from BaseEntity
 */
@Entity('roles')
export class Role extends BaseEntity {
  /**
   * @description Name of the role.
   * Restricted to predefined allowed roles with unique constraint.
   * @type {AllowedRoles}
   * @column Varchar column with unique constraint
   */
  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    unique: true,
  })
  name: AllowedRoles;

  /**
   * @description Users associated with this role.
   * Establishes a many-to-many relationship with the User entity.
   * @type {User[]}
   * @column Many-to-many relationship with Users
   */
  @ManyToMany(() => User, (user) => user.roles)
  users?: User[];
}
