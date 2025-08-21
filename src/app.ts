/**
 * Main application entry point for the Express server.
 *
 * This module sets up and configures the entire Express application,
 * including database initialization, middleware setup, routing,
 * and server startup.
 *
 * Key Components:
 * - Database initialization
 * - Middleware configuration
 * - API route registration
 * - Swagger documentation
 * - Error handling
 * - Server startup
 *
 * @module App
 */

import 'dotenv/config';
import cors from 'cors';
import { createServer } from 'http';
import { corsOptions } from './config';
import cookieParser from 'cookie-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import logger from './infrastructure/logger/logger';
import { configService } from './config/config.service';
// @ts-ignore
import { container } from './infrastructure/di/container';
import AppDataSource from './infrastructure/orm/typeorm/data-source';
import { createAuthRouter } from './presentation/routes/auth.router';
import { createUserRouter } from './presentation/routes/user.router';
import UserController from './presentation/controllers/user.controller';
import { swaggerOptions } from './infrastructure/swagger/swagger.options';
import AuthUserController from './presentation/controllers/auth.controller';
import { errorHandler } from './infrastructure/middlewares/error.middleware';
import { httpLogger } from './infrastructure/middlewares/http-logger.middleware';
import { notFoundHandler } from './infrastructure/middlewares/not-found-handler.middleware';


/**
 * Create the main Express application instance.
 * This is the core of the server that will be configured with
 * middleware, routes, and other essential settings.
 */
const app: Express = express();

/**
 * Initialize the database connection.
 *
 * This block sets up the TypeORM data source, establishing
 * a connection to the database before the server starts.
 * Logs success or failure of the initialization process.
 *
 * @throws {Error} If database initialization fails
 */
AppDataSource.initialize()
  .then(() => logger.info('Data Source has been initialized!'))
  .catch((err) => logger.error('Error during Data Source initialization', err));

/**
 * Configure core application middleware.
 *
 * Sets up essential middleware for:
 * - Proxy trust (for correct IP detection)
 * - CORS handling
 * - Cookie parsing
 * - JSON and URL-encoded body parsing
 *
 * Middleware is applied in a specific order to ensure
 * proper request preprocessing.
 */
app.set('trust proxy', 1);
app.enable('trust proxy');
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

/**
 * Set up HTTP request logging middleware.
 *
 * Adds a middleware to log all incoming HTTP requests,
 * providing visibility into server traffic and request details.
 */
app.use(httpLogger);

/**
 * Initialize controllers and routers.
 *
 * Creates controller instances and sets up routers for
 * authentication and user-related operations.
 * Provides a clean separation of concerns between
 * controllers, routes, and application logic.
 */
const authController = new AuthUserController();
const userController = new UserController();
const authRouter = createAuthRouter(authController);
const userRouter = createUserRouter(userController);

/**
 * Set up Swagger documentation.
 *
 * Generates OpenAPI specification and sets up
 * Swagger UI endpoint for API documentation.
 * Allows interactive exploration of the API endpoints.
 */
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Register API routes with versioned prefix.
 *
 * Mounts authentication and user routes under a
 * configurable API prefix, enabling versioning
 * and namespace separation.
 */
const apiPrefix = configService.get('API_PREFIX');
app.use(`/${apiPrefix}/auth`, authRouter);
app.use(`/${apiPrefix}/users`, userRouter);

/**
 * Configure final error handling middleware.
 *
 * Adds middleware for:
 * - Handling requests to non-existent routes (404)
 * - Centralized error handling for all other errors
 *
 * Ensures consistent error responses across the application.
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Start the HTTP server.
 *
 * Creates and starts the HTTP server, listening
 * on the configured port and logging the startup.
 */
const port = configService.get('PORT');
const httpServer = createServer(app);
httpServer.listen(port, () => logger.info(`Server started on port ${port}`));

export default app;
