import 'dotenv/config';
import * as Joi from 'joi';
import { EnvConfig } from '../infrastructure/types/env.types';

/**
 * Configuration Service
 *
 * Centralized service for managing application configuration.
 * Provides robust environment variable validation, type safety,
 * and centralized configuration access.
 *
 * Key Features:
 * - Environment variable validation using Joi
 * - Type-safe configuration retrieval
 * - Development mode detection
 * - Flexible configuration management
 *
 * @class ConfigService
 *
 * @example
 * // Accessing configuration values
 * const port = configService.get('PORT');
 * const isDev = configService.isDevelopment;
 */
class ConfigService {
  /**
   * Validated and type-safe environment configuration
   * Stores the parsed and validated environment variables
   *
   * @private
   * @type {EnvConfig}
   */
  private readonly envConfig: EnvConfig;

  /**
   * Constructor for ConfigService
   *
   * Initializes the configuration by:
   * - Validating environment variables
   * - Transforming process.env to a type-safe configuration object
   *
   * @throws {Error} If environment configuration validation fails
   */
  constructor() {
    this.envConfig = this.validateInput(process.env);
  }

  /**
   * Validates and transforms environment variables
   *
   * Uses Joi schema validation to:
   * - Ensure required variables are present
   * - Provide default values for optional configurations
   * - Convert and validate variable types
   *
   * @param {NodeJS.ProcessEnv} envConfig - Raw environment variables from process.env
   * @returns {EnvConfig} Validated and type-safe configuration object
   *
   * @throws {Error} If configuration validation fails
   *
   * Validation Rules:
   * - Allows unknown environment variables
   * - Converts string values to appropriate types
   * - Provides sensible defaults
   * - Enforces required configuration parameters
   */
  private validateInput(envConfig: NodeJS.ProcessEnv): EnvConfig {
    // Joi schema for comprehensive environment variable validation
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      // Environment mode validation
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),

      // Server configuration
      PORT: Joi.number().default(5000),
      SERVER_HOST: Joi.string().default('http://localhost'),
      API_PREFIX: Joi.string().default('api'),

      // OpenAPI/Swagger configuration
      OPEN_API_URL: Joi.string().default('http://localhost:5000/api'),

      // Database connection parameters
      DB_HOST: Joi.string().required(),
      DB_PORT: Joi.number().required(),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_DATABASE: Joi.string().required(),
      DB_SSL: Joi.boolean().default(false),

      // Authentication configuration
      JWT_SECRET: Joi.string().required(),
      ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('15m'),
      REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),

      // Cookie configuration
      COOKIE_TOKEN: Joi.string().default('token'),
      COOKIE_EXPIRES_IN: Joi.number().required().default(604800000),
    });

    // Validate environment configuration
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
      {
        // Allow additional environment variables
        allowUnknown: true,
        // Convert string values to appropriate types
        convert: true,
      },
    );

    // Throw error if validation fails
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig as EnvConfig;
  }

  /**
   * Retrieves a specific configuration value
   *
   * Provides type-safe access to environment configuration
   *
   * @template T - The key type from EnvConfig
   * @param {T} key - The configuration key to retrieve
   * @returns {EnvConfig[T]} The value associated with the specified key
   *
   * @example
   * const port = configService.get('PORT'); // Returns number
   * const host = configService.get('SERVER_HOST'); // Returns string
   */
  get<T extends keyof EnvConfig>(key: T): EnvConfig[T] {
    return this.envConfig[key];
  }

  /**
   * Checks if the application is running in development mode
   *
   * Provides a convenient way to determine the current environment
   *
   * @returns {boolean} True if in development mode, false otherwise
   *
   * @example
   * if (configService.isDevelopment) {
   *   // Enable additional logging or development features
   * }
   */
  get isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development';
  }
}

// Export a singleton instance of the ConfigService
// Ensures a single, consistent configuration across the application
export const configService = new ConfigService();
