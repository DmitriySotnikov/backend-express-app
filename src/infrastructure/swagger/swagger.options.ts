import { config } from '../../config';
import { SwaggerOptions } from 'swagger-ui-express';

/**
 * Swagger configuration for API documentation.
 *
 * This configuration sets up Swagger UI with OpenAPI 3.0.0 specification,
 * defining the API's metadata, server information, and security schemes.
 *
 * Key features:
 * - Defines API title, version, and description
 * - Configures server URL from environment configuration
 * - Sets up JWT bearer authentication for all endpoints
 * - Specifies paths to route and DTO annotation files
 *
 * @see {@link https://swagger.io/specification/ OpenAPI Specification}
 * @see {@link https://github.com/scottie1984/swagger-ui-express swagger-ui-express}
 */
export const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express test project API',
      version: '1.0.0',
      description:
        'API documentation for the project, providing endpoints for authentication, user management, etc.',
    },
    servers: [
      {
        url: config.OPEN_API_URL,
        description: 'Express test server',
      },
    ],
    // Define components, for example, security schemes
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply this scheme to all endpoints by default
      },
    ],
  },
  // Path to files containing OpenAPI annotations (routes and DTOs)
  apis: ['./src/presentation/routes/*.ts', './src/infrastructure/dtos/*.ts'],
};
