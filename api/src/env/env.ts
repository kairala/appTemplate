import { ConfigService } from '@nestjs/config';
import { devEnv } from './dev.env';
import { fetchSecrets } from './fetchSecret';

export default async () => {
  const configService = new ConfigService();
  const nodeEnv = configService.get('NODE_ENV');

  if (nodeEnv === 'development') {
    return devEnv;
  }

  const secretName = configService.getOrThrow<string>('AWS_SECRET_NAME');
  return fetchSecrets(secretName);
};
