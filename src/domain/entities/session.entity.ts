import { User } from './user.entity';
import { BaseEntity } from './base.entity';

/**
 * @class Session
 * @description Represents a user session in the system, extending the base entity.
 * Tracks user authentication sessions across different devices.
 * @extends {BaseEntity}
 */
export class Session extends BaseEntity {
  /**
   * @description The refresh token associated with this session.
   * @type {string}
   */
  public refreshToken: string;

  /**
   * @description Unique identifier for the device associated with this session.
   * @type {string}
   * @readonly
   */
  public readonly deviceId: string;

  /**
   * @description Optional associated user for this session.
   * @type {User}
   * @readonly
   */
  public readonly user?: User;

  /**
   * @description Indicates whether the session is currently active.
   * @type {boolean}
   */
  public isActive: boolean;

  /**
   * @description The unique identifier of the user associated with this session.
   * @type {number}
   * @readonly
   */
  public readonly userId: number;

  /**
   * @constructor
   * @description Creates a new Session instance.
   * @param {Object} params - The parameters for creating a session.
   * @param {number} [params.id] - Optional unique identifier for the session.
   * @param {Date} [params.createdAt] - Optional timestamp of session creation.
   * @param {Date} [params.updatedAt] - Optional timestamp of last session update.
   * @param {Date} [params.deletedAt] - Optional timestamp of session deletion.
   * @param {string} params.refreshToken - The refresh token for the session.
   * @param {string} params.deviceId - Unique identifier for the device.
   * @param {User} [params.user] - Optional associated user.
   * @param {boolean} params.isActive - Whether the session is active.
   * @param {number} params.userId - The unique identifier of the associated user.
   */
  constructor({
    id,
    createdAt,
    updatedAt,
    deletedAt,
    refreshToken,
    deviceId,
    user,
    isActive,
    userId,
  }: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    refreshToken: string;
    deviceId: string;
    user?: User;
    isActive: boolean;
    userId: number;
  }) {
    super({ id, createdAt, updatedAt, deletedAt });
    this.refreshToken = refreshToken;
    this.deviceId = deviceId;
    this.user = user ?? undefined;
    this.isActive = isActive;
    this.userId = userId;
  }

  /**
   * @description Static method to create a new Session instance.
   * @param {Object} params - The parameters for creating a session.
   * @param {number} params.userId - The unique identifier of the user.
   * @param {string} params.refreshToken - The refresh token for the session.
   * @param {string} params.deviceId - Unique identifier for the device.
   * @returns {Session} A new Session instance with default active status.
   */
  public static create({
    userId,
    refreshToken,
    deviceId,
  }: {
    userId: number;
    refreshToken: string;
    deviceId: string;
  }): Session {
    const session = new Session({
      userId,
      refreshToken,
      deviceId,
      isActive: true,
    });
    return session;
  }

  /**
   * @description Updates the refresh token for an existing session.
   * @param {string} newRefreshToken - The new refresh token.
   * @returns {Session} A new Session instance with the updated refresh token.
   */
  public updateRefreshToken(newRefreshToken: string): Session {
    return new Session({
      ...this,
      refreshToken: newRefreshToken,
      isActive: true,
    });
  }
}
