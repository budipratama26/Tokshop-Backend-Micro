import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          return throwError(() => err);
        }
        const error = err.err ?? err;
        const status =
          error.status ?? error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message ?? 'Internal server error';
        return throwError(() => new HttpException(message, status));
      }),
    );
  }
}
