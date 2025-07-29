import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // ÎØºÍ∞ê???ïÎ≥¥ ?úÏô∏???îÏ≤≠ Î°úÍπÖ
    const logData = {
      method,
      url,
      ip,
      userAgent: userAgent.substring(0, 100), // User-Agent Í∏∏Ïù¥ ?úÌïú
      timestamp: new Date().toISOString(),
    };

    // this.logger.log(`?ì• ?îÏ≤≠ ?úÏûë: ${method} ${url}`, logData);

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // ?ëÎãµ Î°úÍπÖ (ÎØºÍ∞ê???∞Ïù¥???úÏô∏)
        const responseData = {
          statusCode: response.statusCode,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        };

        // this.logger.log(
        //   `?ì§ ?ëÎãµ ?ÑÎ£å: ${method} ${url} - ${response.statusCode} (${duration}ms)`,
        //   responseData,
        // );
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // ?êÎü¨ Î°úÍπÖ (?ÅÏÑ∏ ?ïÎ≥¥ ?úÏô∏)
        const errorData = {
          statusCode: error.status || 500,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
          errorType: error.constructor.name,
        };

        // this.logger.error(
        //   `???îÏ≤≠ ?§Ìå®: ${method} ${url} - ${errorData.statusCode} (${duration}ms)`,
        //   errorData,
        // );

        throw error;
      }),
    );
  }
}


