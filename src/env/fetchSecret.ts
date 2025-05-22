import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { ConfigService } from '@nestjs/config';
import { ENV_TYPE } from './env.type';

export const fetchSecrets = async (secretName: string): Promise<ENV_TYPE> => {
  const configService = new ConfigService();

  const client = new SecretsManagerClient({
    region: configService.getOrThrow('AWS_REGION') || 'us-east-1',
  });

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
    }),
  );

  if (!response.SecretString) {
    throw new Error('SecretString is empty');
  }

  return JSON.parse(response.SecretString);
};
