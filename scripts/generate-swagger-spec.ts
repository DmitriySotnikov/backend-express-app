/**
 * OpenAPI Specification Generator Script
 *
 * This script generates an OpenAPI (Swagger) specification based on JSDoc annotations
 * in the project's source files. It creates a comprehensive API documentation file
 * that can be used for documentation, client generation, and API exploration.
 *
 * Key Features:
 * - Generates OpenAPI specification from source code annotations
 * - Writes specification to a JSON file in the project root
 * - Provides error handling for specification generation
 *
 * Usage:
 * Run this script during build or development to update API documentation
 *
 * @module SwaggerSpecGenerator
 * @requires fs
 * @requires path
 * @requires swagger-jsdoc
 */
import fs from 'fs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../src/infrastructure/swagger/swagger.options';

try {
  console.log('Generating OpenAPI specification...');

  // Generate specification using swagger-jsdoc configuration
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  // Determine the output path in the project root
  const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');

  // Write specification to file with pretty formatting
  fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

  console.log(`Specification successfully generated at: ${outputPath}`);
} catch (error) {
  console.error('Failed to generate OpenAPI specification:', error);
  process.exit(1); // Exit with error code if generation fails
}
