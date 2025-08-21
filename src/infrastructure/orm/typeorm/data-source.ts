import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PRODUCTION } from '../../../infrastructure/constants';

const isDevelopment = process.env.NODE_ENV === 'development';

// TODO: СДЕЛАТЬ КОНФИГ СЕРВИС
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  synchronize: false,
  logging: process.env.NODE_ENV !== PRODUCTION,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [
    isDevelopment
      ? 'src/infrastructure/orm/entities/**/*.ts'
      : 'dist_tsc/infrastructure/orm/entities/**/*.js',
  ],
  migrations: [
    isDevelopment
      ? 'src/infrastructure/orm/migrations/**/*.ts'
      : 'dist_tsc/infrastructure/orm/migrations/**/*.js',
  ],
  migrationsTableName: 'migrations',
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
