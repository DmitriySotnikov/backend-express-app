# Express API Server Boilerplate

This project is a robust and scalable boilerplate for building API servers using Express.js and TypeScript. The architecture is founded on the principles of Clean Architecture, CQRS, and Domain-Driven Design (DDD), ensuring a clear separation of concerns, high testability, and ease of maintenance.

## 🌟 Features

- **Clean Architecture**: Strict separation into Presentation, Application, Domain, and Infrastructure layers.
- **TypeScript**: Strong typing for reliability and an enhanced developer experience.
- **Express.js 5**: Utilizes the latest version of the framework, featuring built-in asynchronous error handling.
- **TypeORM**: A powerful ORM for interacting with the PostgreSQL database.
- **CQRS (Command Query Responsibility Segregation)**: Operations are divided into "Commands" (state-changing) and "Queries" (data-reading) for improved code clarity.
- **Dependency Injection (DI)**: Centralized dependency management via a custom DI container.
- **JWT-Based Authentication**: Implemented a secure authentication system using `access` and `refresh` tokens stored in `httpOnly` cookies.
- **Automated API Documentation & Type Generation**:
  - **OpenAPI (Swagger)**: Documentation is generated directly from JSDoc annotations.
  - **Auto-Generated DTOs**: TypeScript types for DTOs are automatically created from the OpenAPI specification, ensuring a single source of truth.
- **Professional Logging**: Configured Winston for structured logging to both the console and files.
- **Centralized Error Handling**: A unified middleware to handle all application errors consistently.
- **Production-Ready Scripts**: Includes scripts for development, testing, and building the application using both `tsc` and `Webpack`.

## 🛠️ Tech Stack

- **Core Framework**: Express.js 5
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JSON Web Token (jsonwebtoken)
- **Validation**: Joi
- **Logging**: Winston
- **API Documentation**: OpenAPI 3.0 (swagger-jsdoc, swagger-ui-express)
- **Type Generation**: swagger-typescript-api
- **Build Tools**: TypeScript Compiler (`tsc`) / Webpack

## 🚀 Getting Started

### Prerequisites

- Node.js (`v22.12.0` or higher is recommended)
- PostgreSQL
- npm (or yarn/pnpm)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-folder-name>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

- Create a `.env` file in the root directory of the project.
- Copy the contents from **`.env.example`** and fill in your specific configuration details (database credentials, JWT secret, etc.).

### 4. Database Setup

- Ensure your PostgreSQL server is running.
- Create a new database with the name you specified in `DB_DATABASE` in your `.env` file.
- Apply the database migrations to create the necessary tables:

```bash
npm run typeorm:migration:run
```

### 5. Running the Application in Development Mode

This command starts the server with hot-reloading on file changes. It will also automatically regenerate the API documentation and TypeScript types.

```bash
npm run dev
```

After a successful launch, you will find:
- The server is running on `http://localhost:5000`
- The API is available at `http://localhost:5000/api`
- The interactive API documentation (Swagger UI) is available at **`http://localhost:5000/api-docs`**

## 📦 Available Scripts

- `npm run dev`: Starts the development server using `ts-node-dev`.
- `npm run build:tsc`: Compiles the project using the TypeScript compiler into the `/dist_tsc` directory.
- `npm run start:tsc`: Runs the `tsc`-compiled version of the application.
- `npm run build:webpack`: Bundles the project using Webpack into the `/dist/prod_webpack` directory.
- `npm run start:webpack`: Runs the Webpack-bundled version of the application.
- `npm run format`: Formats the entire codebase using Prettier.

### API Generation

- `npm run gen:swagger-spec`: Generates the `swagger-spec.json` file from JSDoc annotations.
- `npm run gen:api-types`: Generates TypeScript types (`dto.types.ts`) from the `swagger-spec.json` file.

### TypeORM Migrations

- `npm run typeorm:migration:generate -- -n YourMigrationName`: Generates a new migration file.
- `npm run typeorm:migration:run`: Applies all pending migrations.
- `npm run typeorm:migration:revert`: Reverts the last applied migration.

## 🏛️ Architecture Overview

The project is structured into four primary layers:

1.  **Domain**: Contains the core business logic. This includes entities, domain services, and repository interfaces. This layer has no external dependencies.
2.  **Application**: Orchestrates the business logic. It contains Use Cases (Commands and Queries) and Application Services. It depends only on the Domain layer.
3.  **Infrastructure**: Contains implementation details and integrations with external tools. This is where the ORM (TypeORM), database connection, repository implementations, logger (Winston), JWT handling, and other external dependencies reside.
4.  **Presentation**: The entry point for the application. This layer includes Express controllers, routes, and middleware.

This approach promotes loose coupling and high cohesion, making the code easy to test, refactor, and extend.