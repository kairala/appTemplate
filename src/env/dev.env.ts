import { ENV_TYPE } from './env.type';

export const devEnv: ENV_TYPE = {
  PORT: Number(process.env.PORT || 3030),
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  NODE_ENV: process.env.NODE_ENV || 'development',
  TZ: 'UTC',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: Number(process.env.DATABASE_PORT || 5432),
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'postgres',
  DATABASE_NAME: process.env.DATABASE_NAME || 'postgres',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_ACCESS_TOKEN_EXPIRES_IN: Number(
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || 60 * 60,
  ), // 1 hour
  JWT_REFRESH_TOKEN_EXPIRES_IN: Number(
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || 60 * 60 * 24 * 7,
  ), // 7 days
  EMAIL_USE_LOCAL_LOGGER: Boolean(process.env.EMAIL_USE_LOCAL_LOGGER),
  FROM_EMAIL: process.env.FROM_EMAIL || 'test@email.com',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  APP_URL: process.env.APP_URL || 'http://localhost:3030',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id',
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret',
  API_HOST: process.env.API_HOST || 'http://localhost:3030',
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || 'your_bucket_name',
  CLOUDFRONT_URL: process.env.CLOUDFRONT_URL || 'your_cloudfront_url',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key',
  STRIPE_WEBHOOK_SECRET:
    process.env.STRIPE_WEBHOOK_SECRET || 'your_stripe_webhook_secret',
};
