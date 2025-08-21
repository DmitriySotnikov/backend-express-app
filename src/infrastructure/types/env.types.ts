/**
 * Environment Configuration Interface
 *
 * Defines the structure and types for all environment variables
 * used throughout the application. Provides type safety and
 * centralized configuration management.
 *
 * @interface EnvConfig
 *
 * Key Configuration Categories:
 * - Application Environment Settings
 * - Server Configuration
 * - Database Connection Parameters
 * - Authentication and Security
 * - Cookie and Session Management
 */
export interface EnvConfig {
  /**
   * Application Environment Mode
   * Determines the runtime behavior and configuration
   * @type {string}
   * @values 'development' | 'production' | 'test'
   */
  NODE_ENV: string;

  /**
   * Server Port Configuration
   * Specifies the port on which the application will run
   * @type {number}
   * @default 5000
   */
  PORT: number;

  /**
   * Server Host URL
   * Base URL for the application server
   * @type {string}
   * @default 'http://localhost'
   */
  SERVER_HOST: string;

  /**
   * API Route Prefix
   * Defines the base path for all API routes
   * @type {string}
   * @default 'api'
   */
  API_PREFIX: string;

  /**
   * OpenAPI (Swagger) Documentation URL
   * Endpoint for API documentation
   * @type {string}
   * @default 'http://localhost:5000/api'
   */
  OPEN_API_URL: string;

  /**
   * Database Host Configuration
   * Hostname or IP address of the database server
   * @type {string}
   * @required
   */
  DB_HOST: string;

  /**
   * Database Port
   * Port number for database connection
   * @type {number}
   * @required
   */
  DB_PORT: number;

  /**
   * Database Username
   * Credentials for database authentication
   * @type {string}
   * @required
   */
  DB_USERNAME: string;

  /**
   * Database Password
   * Credentials for database authentication
   * @type {string}
   * @required
   */
  DB_PASSWORD: string;

  /**
   * Database Name
   * Name of the database to connect to
   * @type {string}
   * @required
   */
  DB_DATABASE: string;

  /**
   * Database SSL Configuration
   * Enables secure SSL connection to the database
   * @type {boolean}
   * @default false
   */
  DB_SSL: boolean;

  /**
   * JWT Secret Key
   * Used for signing and verifying JSON Web Tokens
   * @type {string}
   * @required
   */
  JWT_SECRET: string;

  /**
   * Access Token Expiration
   * Defines how long access tokens remain valid
   * @type {string}
   * @default '15m'
   */
  ACCESS_TOKEN_EXPIRES_IN: string;

  /**
   * Refresh Token Expiration
   * Defines how long refresh tokens remain valid
   * @type {string}
   * @default '7d'
   */
  REFRESH_TOKEN_EXPIRES_IN: string;

  /**
   * Cookie Token Name
   * Name of the cookie used for token storage
   * @type {string}
   * @default 'token'
   */
  COOKIE_TOKEN: string;

  /**
   * Cookie Expiration Time
   * Defines how long cookies remain valid in milliseconds
   * @type {number}
   * @default 604800000 (7 days)
   */
  COOKIE_EXPIRES_IN: number;
}
