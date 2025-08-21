import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { configService } from '../../../config/config.service';

/**
 * TypeORM DataSource Configuration
 *
 * Configures the database connection and ORM settings for the application.
 * Provides a flexible configuration that adapts to different environments.
 *
 * Key Features:
 * - PostgreSQL database connection
 * - Environment-specific entity and migration paths
 * - Configurable logging and SSL settings
 * - Strict synchronization control
 *
 * @constant
 * @type {DataSourceOptions}
 */
export const dataSourceOptions: DataSourceOptions = {
  /**
   * Database type
   * Specifies PostgreSQL as the database system
   * @type {string}
   */
  type: 'postgres',

  /**
   * Database connection parameters
   * Dynamically retrieved from configuration service
   * Supports environment-specific database credentials
   */
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),

  /**
   * ORM Synchronization and Logging Configuration
   *
   * - synchronize: Prevents automatic schema updates in production
   * - logging: Enables database query logging in development
   * - ssl: Configurable SSL connection for secure environments
   */
  synchronize: false, // Prevent automatic schema changes
  logging: configService.isDevelopment, // Log queries only in development
  ssl: configService.get('DB_SSL') ? { rejectUnauthorized: false } : false,

  /**
   * Entity and Migration Path Configuration
   *
   * Dynamically sets paths based on the current environment:
   * - Development: Uses TypeScript source files
   * - Production: Uses compiled JavaScript files
   */
  entities: [
    configService.isDevelopment
      ? 'src/infrastructure/orm/entities/**/*.ts'
      : 'dist_tsc/infrastructure/orm/entities/**/*.js',
  ],
  migrations: [
    configService.isDevelopment
      ? 'src/infrastructure/orm/migrations/**/*.ts'
      : 'dist_tsc/infrastructure/orm/migrations/**/*.js',
  ],

  /**
   * Migrations Table Name
   * Specifies the name of the table used to track applied migrations
   * @type {string}
   */
  migrationsTableName: 'migrations',
};

/**
 * Application DataSource Instance
 *
 * Creates a singleton DataSource instance with the configured options.
 * Used throughout the application for database interactions.
 *
 * @type {DataSource}
 */
const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
