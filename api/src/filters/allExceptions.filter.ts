import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  PreconditionFailedException,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import { Response } from 'express';
import { I18nValidationException } from 'nestjs-i18n';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    console.error(exception);
    console.error(exception.message);

    if (
      exception instanceof NotFoundException ||
      exception instanceof ForbiddenException ||
      exception instanceof UnauthorizedException ||
      exception instanceof BadRequestException ||
      exception instanceof ConflictException ||
      exception instanceof ThrottlerException ||
      exception instanceof PreconditionFailedException ||
      exception instanceof I18nValidationException ||
      exception.code === 'ValidationException'
    ) {
      return res.status(exception.getStatus()).json({
        isError: true,
        url: request.url,
        requestId: request.requestId,
        statusCode: exception.getStatus(),
        message: exception.response,
        error: exception.error,
        exception: exception,
      });
    }

    return res.status(500).json({
      isError: true,
      statusCode: 500,
      message: 'InternalServerError',
      error: exception.message,
      exception: exception,
    });
  }
}
