import { DEVELOPMENT } from '../infrastructure/constants';

export const config = {
  NODE_ENV: process.env.NODE_ENV || DEVELOPMENT,
  PORT: process.env.PORT || 8080,
  PREFIX: 'api',
  OPEN_API_URL: process.env.OPEN_API_URL || 'http://localhost:5000/api',
};

export const corsOptions = {
  preflightContinue: false,
  optionsSuccessStatus: 204,
  origin: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Origin',
    'X-Requested-With',
    'Accept',
    'Authorization',
  ],
  exposedHeaders: ['Authorization'],
  credentials: true,
};

export const authConfig = {
  COOKIE_TOKEN: 'token',
  COOKIE_EXPIRES_IN: process.env.COOKIE_EXPIRES_IN || 604800000, // 7 day
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '10m',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  JWT_SECRET: process.env.JWT_SECRET || 'test-jwt-secret',
};
