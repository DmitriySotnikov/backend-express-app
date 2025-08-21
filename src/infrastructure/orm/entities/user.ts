import { Role } from './role';
import { Session } from './session';
import { BaseEntity } from './base';
import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';

/**
 * @class User
 * @description ORM entity representing users in the system.
 *
 * This entity defines the comprehensive structure of users in the database:
 * - Extends BaseEntity for common tracking fields
 * - Stores detailed user profile information
 * - Supports role-based access control
 * - Tracks user sessions
 *
 * Key Features:
 * - Unique email constraint
 * - Many-to-many relationship with roles
 * - One-to-many relationship with sessions
 * - Supports user banning
 * - Inherits tracking capabilities from BaseEntity
 */
@Entity('users')
export class User extends BaseEntity {
  /**
   * @description User's email address.
   * Unique identifier for user authentication and communication.
   * @type {string}
   * @column Unique, non-nullable varchar column for email
   */
  @Column({
    unique: true,
    name: 'email',
    nullable: false,
    type: 'varchar',
  })
  email: string;

  /**
   * @description User's password hash.
   * Securely stored for authentication purposes.
   * @type {string}
   * @column Non-nullable varchar column for password hash
   */
  @Column({
    name: 'password',
    nullable: false,
    type: 'varchar',
  })
  password: string;

  /**
   * @description User's first name.
   * @type {string}
   * @column Non-nullable varchar column for first name
   */
  @Column({
    name: 'firstname',
    nullable: false,
    type: 'varchar',
  })
  firstname: string;

  /**
   * @description User's last name.
   * @type {string}
   * @column Non-nullable varchar column for last name
   */
  @Column({
    name: 'lastname',
    nullable: false,
    type: 'varchar',
  })
  lastname: string;

  /**
   * @description User's surname or middle name.
   * Optional additional name information.
   * @type {string}
   * @column Nullable varchar column for surname
   */
  @Column({
    name: 'surname',
    nullable: true,
    type: 'varchar',
  })
  surname: string;

  /**
   * @description User's date of birth.
   * @type {string}
   * @column Non-nullable date column for birth date
   */
  @Column({
    name: 'birth_date',
    type: 'date',
    nullable: false,
  })
  birthDate: string;

  /**
   * @description Indicates whether the user is banned.
   * Allows for user account suspension without deletion.
   * @type {boolean}
   * @column Non-nullable boolean column with default false
   */
  @Column({
    name: 'is_banned',
    nullable: false,
    default: false,
    type: 'boolean',
  })
  isBanned: boolean;

  /**
   * @description Roles associated with the user.
   * Establishes a many-to-many relationship with Role entity.
   * Configured with eager loading and cascade operations.
   * @type {Role[]}
   * @column Many-to-many relationship with Roles
   */
  @ManyToMany(() => Role, (role) => role.users, { eager: true, cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  /**
   * @description User's authentication sessions.
   * Establishes a one-to-many relationship with Session entity.
   * @type {Session[]}
   * @column One-to-many relationship with Sessions
   */
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
