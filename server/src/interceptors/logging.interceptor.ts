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

    // 민감한 정보 제외한 요청 로깅
    const logData = {
      method,
      url,
      ip,
      userAgent: userAgent.substring(0, 100), // User-Agent 길이 제한
      timestamp: new Date().toISOString(),
    };

    // this.logger.log(`📥 요청 시작: ${method} ${url}`, logData);

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // 응답 로깅 (민감한 데이터 제외)
        const responseData = {
          statusCode: response.statusCode,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        };

        // this.logger.log(
        //   `📤 응답 완료: ${method} ${url} - ${response.statusCode} (${duration}ms)`,
        //   responseData,
        // );
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // 에러 로깅 (상세 정보 제외)
        const errorData = {
          statusCode: error.status || 500,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
          errorType: error.constructor.name,
        };

        // this.logger.error(
        //   `❌ 요청 실패: ${method} ${url} - ${errorData.statusCode} (${duration}ms)`,
        //   errorData,
        // );

        throw error;
      }),
    );
  }
}
