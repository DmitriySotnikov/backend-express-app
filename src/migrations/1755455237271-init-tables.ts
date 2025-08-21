import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Database Migration: Initialize Core Tables
 *
 * This migration sets up the fundamental database schema for the application,
 * creating essential tables for user management, authentication, and authorization.
 *
 * @class InitTables1755455237271
 * @implements {MigrationInterface}
 *
 * Tables Created:
 * - roles: Stores user role definitions
 * - users: Stores user profile and authentication information
 * - sessions: Manages user authentication sessions
 * - user_roles: Manages many-to-many relationship between users and roles
 *
 * Key Features:
 * - Implements database normalization
 * - Establishes referential integrity with foreign key constraints
 * - Supports soft deletion with timestamp columns
 *
 * Migration Details:
 * - Timestamp: 1755455237271 (unique identifier)
 * - Direction: Supports both forward (up) and complete rollback (down) operations
 *
 * @see {@link https://typeorm.io/migrations TypeORM Migrations Documentation}
 */
export class InitTables1755455237271 implements MigrationInterface {
  /**
   * Applies the migration by creating the core database tables
   *
   * This method:
   * - Creates roles table with unique name and timestamps
   * - Creates users table with comprehensive user information
   * - Creates sessions table with user authentication details
   * - Creates user_roles junction table for role assignment
   *
   * @param {QueryRunner} queryRunner - TypeORM query runner for database operations
   * @returns {Promise<void>}
   *
   * @throws {Error} If table creation fails
   *
   * @example
   * // Automatically called during migration process
   * await migrationInstance.up(queryRunner);
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles table with unique constraints and timestamps
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL NOT NULL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP
      );
    `);

    // Create users table with comprehensive user information
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL NOT NULL PRIMARY KEY,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        firstname VARCHAR NOT NULL,
        lastname VARCHAR NOT NULL,
        surname VARCHAR,
        birth_date DATE NOT NULL,
        is_Banned BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP
      );
    `);

    // Create sessions table with user authentication tracking
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL NOT NULL PRIMARY KEY,
        refresh_token VARCHAR NOT NULL UNIQUE,
        device_id VARCHAR NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP,
        user_id INTEGER NOT NULL,
        CONSTRAINT FK_sessions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create user_roles junction table for many-to-many role assignment
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id INTEGER NOT NULL,
        role_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, role_id),
        CONSTRAINT FK_user_roles_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT FK_user_roles_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
      );
    `);
  }

  /**
   * Reverts the migration by dropping all created tables
   *
   * This method:
   * - Drops user_roles table
   * - Drops sessions table
   * - Drops users table
   * - Drops roles table
   *
   * Uses CASCADE to remove dependent objects
   *
   * @param {QueryRunner} queryRunner - TypeORM query runner for database operations
   * @returns {Promise<void>}
   *
   * @throws {Error} If table deletion fails
   *
   * @example
   * // Automatically called during migration rollback
   * await migrationInstance.down(queryRunner);
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_roles CASCADE;`);
    await queryRunner.query(`DROP TABLE sessions CASCADE;`);
    await queryRunner.query(`DROP TABLE users CASCADE;`);
    await queryRunner.query(`DROP TABLE roles CASCADE;`);
  }
}
