/* eslint-disable @typescript-eslint/no-require-imports */

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const aws = require('@aws-sdk/client-secrets-manager');

dotenvExpand.expand(dotenv.config());

const getSettings = async () => {
  const client = new aws.SecretsManagerClient({
    region: 'us-east-1',
  });

  const response = await client.send(
    new aws.GetSecretValueCommand({
      SecretId: process.env.AWS_SECRET_NAME,
    }),
  );
  const config = JSON.parse(response.SecretString);

  return {
    username: config.databaseUser,
    password: config.databasePassword,
    database: config.databaseDbName,
    host: config.databaseHost,
    port: config.databasePort,
  };
};

module.exports = async () => {
  return {
    development: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: {
        bigNumberStrings: true,
      },
    },
    test: {
      host: process.env.TEST_DATABASE_HOST,
      port: process.env.TEST_DATABASE_PORT,
      username: process.env.TEST_DATABASE_USER,
      password: process.env.TEST_DATABASE_PASSWORD,
      database: process.env.TEST_DATABASE_NAME,
      dialect: 'postgres',
      dialectOptions: {
        bigNumberStrings: true,
      },
    },
    production: {
      ...(process.env.NODE_ENV === 'production' ? await getSettings() : {}),
      dialect: 'postgres',
      dialectOptions: {
        bigNumberStrings: true,
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },
  };
};
