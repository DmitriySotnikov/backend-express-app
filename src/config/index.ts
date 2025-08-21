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
