import { User } from './user';
import { BaseEntity } from './base';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

/**
 * @class Session
 * @description ORM entity representing user authentication sessions.
 *
 * This entity defines the structure of user sessions in the database:
 * - Extends BaseEntity for common tracking fields
 * - Stores session-specific information
 * - Establishes relationship with the User entity
 *
 * Key Features:
 * - Unique refresh token and device ID
 * - Tracks session activity status
 * - Supports cascading deletion with associated user
 * - Inherits tracking capabilities from BaseEntity
 */
@Entity('sessions')
export class Session extends BaseEntity {
  /**
   * @description Refresh token associated with the session.
   * Ensures uniqueness to prevent token reuse.
   * @type {string}
   * @column Unique varchar column for refresh token
   */
  @Column({
    name: 'refresh_token',
    type: 'varchar',
    unique: true,
  })
  refreshToken: string;

  /**
   * @description Unique identifier for the device associated with the session.
   * Helps in tracking and managing user sessions across different devices.
   * @type {string}
   * @column Unique varchar column for device identification
   */
  @Column({
    name: 'device_id',
    type: 'varchar',
    unique: true,
  })
  deviceId: string;

  /**
   * @description Indicates whether the session is currently active.
   * Allows for session management and invalidation.
   * @type {boolean}
   * @column Boolean column with default true
   */
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  /**
   * @description Foreign key referencing the associated user.
   * Stores the unique identifier of the user for this session.
   * @type {number}
   * @column Integer column for user reference
   */
  @Column({
    name: 'user_id',
    type: 'integer',
  })
  userId: number;

  /**
   * @description Associated user for this session.
   * Establishes a many-to-one relationship with the User entity.
   * Configured to cascade delete when the user is deleted.
   * @type {User}
   * @column Many-to-one relationship with Users
   */
  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
