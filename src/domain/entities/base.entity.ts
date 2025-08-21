/**
 * @abstract
 * @class BaseEntity
 * @description Abstract base class for domain entities, providing common properties
 * for tracking entity lifecycle and identification.
 */
export abstract class BaseEntity {
  /**
   * @description Unique identifier for the entity.
   * @type {number}
   * @readonly
   */
  public readonly id?: number;

  /**
   * @description Timestamp of when the entity was created.
   * @type {Date}
   * @readonly
   */
  public readonly createdAt?: Date;

  /**
   * @description Timestamp of the last update to the entity.
   * @type {Date}
   * @readonly
   */
  public readonly updatedAt?: Date;

  /**
   * @description Timestamp of when the entity was soft-deleted.
   * @type {Date}
   * @readonly
   */
  public readonly deletedAt?: Date;

  /**
   * @constructor
   * @description Creates a new BaseEntity instance.
   * @param {Object} params - The parameters for creating a base entity.
   * @param {number} [params.id] - Optional unique identifier for the entity.
   * @param {Date} [params.createdAt] - Optional timestamp of entity creation.
   * @param {Date} [params.updatedAt] - Optional timestamp of last entity update.
   * @param {Date} [params.deletedAt] - Optional timestamp of entity deletion.
   */
  constructor({
    id,
    createdAt,
    updatedAt,
    deletedAt,
  }: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
