import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Database Migration: Add Initial User Roles
 *
 * This migration adds the fundamental user roles to the roles table
 * in the database. It ensures that the basic role structure is in place
 * before any user registration or authorization processes begin.
 *
 * @class AddRoles1755624849328
 * @implements {MigrationInterface}
 *
 * Roles Added:
 * - 'USER': Standard user role with basic access
 * - 'ADMIN': Administrative role with elevated privileges
 *
 * Migration Details:
 * - Timestamp: 1755624849328 (unique identifier)
 * - Direction: Supports both forward (up) and rollback (down) operations
 *
 * @see {@link https://typeorm.io/migrations TypeORM Migrations Documentation}
 */
export class AddRoles1755624849328 implements MigrationInterface {
  /**
   * Applies the migration by inserting initial roles into the database
   *
   * This method:
   * - Adds 'USER' and 'ADMIN' roles to the roles table
   * - Ensures baseline role configuration is in place
   *
   * @param {QueryRunner} queryRunner - TypeORM query runner for database operations
   * @returns {Promise<void>}
   *
   * @throws {Error} If database insertion fails
   *
   * @example
   * // Automatically called during migration process
   * await migrationInstance.up(queryRunner);
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO roles (name) VALUES ('USER'), ('ADMIN');
    `);
  }

  /**
   * Reverts the migration by removing the initially added roles
   *
   * This method:
   * - Removes 'USER' and 'ADMIN' roles from the roles table
   * - Allows complete rollback of the role initialization
   *
   * @param {QueryRunner} queryRunner - TypeORM query runner for database operations
   * @returns {Promise<void>}
   *
   * @throws {Error} If database deletion fails
   *
   * @example
   * // Automatically called during migration rollback
   * await migrationInstance.down(queryRunner);
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM roles WHERE name IN ('USER', 'ADMIN');
    `);
  }
}
