import * as Sentry from '@sentry/nestjs';
// Ensure to call this before importing any other modules!

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  sendDefaultPii: true,
  tracesSampleRate: 0.2,
  enabled: Boolean(process.env.SENTRY_DSN),
});
