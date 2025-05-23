import 'dotenv/config';
import './instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import AllExceptionsFilter from './filters/allExceptions.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bufferLogs: false,
    rawBody: true,
  });
  app.use(helmet());
  app.set('trust proxy', 'loopback'); // Trust requests from the loopback address

  app.useGlobalFilters(new I18nValidationExceptionFilter());
  app.useGlobalPipes(new I18nValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Template API')
    .setDescription('The template API description')
    .setVersion('1.0')
    .addTag('template')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

void bootstrap();
