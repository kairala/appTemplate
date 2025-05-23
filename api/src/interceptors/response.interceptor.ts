import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { v4 } from 'uuid';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextHttp = context.switchToHttp();
    const request = contextHttp.getRequest();
    request.requestId = request.requestId || v4();

    this.logger.log(`Initializing request with id: ${request.requestId}`);

    return next.handle().pipe(
      map((data) => ({
        isError: false,
        url: request.url,
        requestId: request.requestId,
        data,
      })),
    );
  }
}
