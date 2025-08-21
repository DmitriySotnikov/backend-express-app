import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

/**
 * @abstract
 * @class BaseEntity
 * @description Abstract base class for ORM entities providing common database tracking fields.
 *
 * This class adds standard tracking columns to all entities:
 * - `id`: Unique primary key, auto-generated
 * - `createdAt`: Timestamp of entity creation
 * - `updatedAt`: Timestamp of last entity update
 * - `deletedAt`: Timestamp of soft deletion
 *
 * Features:
 * - Uses TypeORM decorators for automatic column management
 * - Supports soft delete functionality
 * - Provides automatic timestamp tracking
 */
export abstract class BaseEntity {
  /**
   * @description Unique identifier for the entity.
   * Automatically generated primary key column.
   * @type {number}
   * @column Primary generated column
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @description Timestamp of when the entity was created.
   * Automatically set to current timestamp on entity creation.
   * @type {Date}
   * @column Create date column with default current timestamp
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  /**
   * @description Timestamp of the last update to the entity.
   * Automatically updated to current timestamp when the entity is modified.
   * @type {Date}
   * @column Update date column with automatic updates
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  /**
   * @description Timestamp of soft deletion.
   * Allows for logical (soft) deletion without removing the record from the database.
   * @type {Date}
   * @column Delete date column for soft delete functionality
   */
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
  })
  deletedAt: Date;
}
