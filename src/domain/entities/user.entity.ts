import { Role } from './role.entity';
import { BaseEntity } from './base.entity';
import { AllowedRoles } from '../../infrastructure/constants';

/**
 * @class User
 * @description Represents a user entity in the system, extending the base entity.
 * Manages user information, authentication, and role-based access.
 * @extends {BaseEntity}
 */
export class User extends BaseEntity {
  /**
   * @description User's first name.
   * @type {string}
   */
  public firstname: string;

  /**
   * @description User's last name.
   * @type {string}
   */
  public lastname: string;

  /**
   * @description User's email address.
   * @type {string}
   */
  public email: string;

  /**
   * @description User's surname or middle name.
   * @type {string}
   */
  public surname: string;

  /**
   * @description Private field for storing user's password.
   * @type {string | null}
   * @private
   */
  private _password: string | null;

  /**
   * @description User's birth date.
   * @type {string}
   */
  public birthDate: string;

  /**
   * @description Indicates whether the user is banned.
   * @type {boolean}
   */
  public isBanned: boolean;

  /**
   * @description Private field for storing user's roles.
   * @type {Role[]}
   * @private
   */
  private _roles: Role[];

  /**
   * @constructor
   * @description Creates a new User instance.
   * @param {Object} params - The parameters for creating a user.
   * @param {number} [params.id] - Optional unique identifier for the user.
   * @param {Date} [params.createdAt] - Optional timestamp of user creation.
   * @param {Date} [params.updatedAt] - Optional timestamp of last user update.
   * @param {Date} [params.deletedAt] - Optional timestamp of user deletion.
   * @param {string} params.firstname - User's first name.
   * @param {string} params.lastname - User's last name.
   * @param {string} params.surname - User's surname or middle name.
   * @param {string} params.email - User's email address.
   * @param {string} params.password - User's password.
   * @param {string} params.birthDate - User's birth date.
   * @param {boolean} params.isBanned - Whether the user is banned.
   * @param {Role[]} params.roles - User's roles.
   */
  constructor({
    id,
    createdAt,
    updatedAt,
    deletedAt,
    firstname,
    lastname,
    surname,
    email,
    password,
    birthDate,
    isBanned,
    roles,
  }: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    firstname: string;
    lastname: string;
    surname: string;
    email: string;
    password: string;
    birthDate: string;
    isBanned: boolean;
    roles: Role[];
  }) {
    super({ id, createdAt, updatedAt, deletedAt });
    this.firstname = firstname;
    this.lastname = lastname;
    this.surname = surname;
    this.email = email;
    this._password = password;
    this.birthDate = birthDate;
    this.isBanned = isBanned;
    this._roles = roles || [];
  }

  /**
   * @description Getter for password used in persistence operations.
   * @returns {string | null} The user's password or null.
   */
  get passwordForPersistence(): string | null {
    return this._password;
  }

  /**
   * @description Getter for user's roles as a read-only array.
   * @returns {ReadonlyArray<Role>} The user's roles.
   */
  get roles(): ReadonlyArray<Role> {
    return this._roles;
  }

  /**
   * @description Bans the user by setting isBanned to true.
   */
  ban() {
    this.isBanned = true;
  }

  /**
   * @description Unbans the user by setting isBanned to false.
   */
  unban() {
    this.isBanned = false;
  }

  /**
   * @description Static method to create a new User instance.
   * @param {Object} params - The parameters for creating a user.
   * @param {string} params.firstname - User's first name.
   * @param {string} params.lastname - User's last name.
   * @param {string} params.surname - User's surname or middle name.
   * @param {string} params.email - User's email address.
   * @param {string} params.password - User's password.
   * @param {string} params.birthDate - User's birth date.
   * @param {Role[]} params.roles - User's roles.
   * @returns {User} A new User instance with default unbanned status.
   */
  public static create({
    email,
    password,
    firstname,
    lastname,
    surname,
    birthDate,
    roles,
  }: {
    firstname: string;
    lastname: string;
    surname: string;
    email: string;
    password: string;
    birthDate: string;
    roles: Role[];
  }): User {
    const user = new User({
      email,
      password,
      firstname,
      lastname,
      surname,
      birthDate,
      isBanned: false,
      roles,
    });
    return user;
  }

  /**
   * @description Checks if the user has a specific role.
   * @param {AllowedRoles} roleName - The name of the role to check.
   * @returns {boolean} True if the user has the specified role, false otherwise.
   */
  public hasRole(roleName: AllowedRoles): boolean {
    return this.roles.some((role) => role.name === roleName);
  }
}
