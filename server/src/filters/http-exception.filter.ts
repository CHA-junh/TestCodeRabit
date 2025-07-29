import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '?�버 ?��? ?�류가 발생?�습?�다.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // 개발 ?�경?�서�??�세 ?�러 메시지 ?�출
    if (process.env.NODE_ENV === 'development') {
      message =
        exception instanceof Error ? exception.message : '?????�는 ?�류';
    }

    const errorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    const errorData = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      userAgent: request.headers['user-agent']?.substring(0, 100) || 'Unknown',
      ip: request.ip || request.connection.remoteAddress || 'Unknown',
    };

    // 로그 ?�벨 결정: 401, 403, 404??WARN, ?�머지??ERROR
    const isClientError = status >= 400 && status < 500 && status !== 500;
    const isAuthError = status === 401 || status === 403;
    const isSessionCheck = request.url?.includes('/api/auth/session');

    // ?�션 체크 401 ?�러??로그 ?�외 (?�상?�인 ?�작)
    if (isAuthError && isSessionCheck) {
      // 로그 ?�음 - ?�상?�인 ?�션 체크 ?�패
    } else if (isAuthError) {
      this.logger.warn(
        `?�� ?�증 ?�패: ${request.method} ${request.url} from ${errorData.ip}`,
        errorData,
      );
    } else if (isClientError) {
      this.logger.warn(
        `?�️ ?�라?�언???�청 ?�류: ${request.method} ${request.url}`,
        errorData,
      );
    } else {
      this.logger.error(
        `??HTTP ?�외 발생: ${request.method} ${request.url}`,
        errorData,
      );
    }

    response.status(status).json(errorResponse);
  }
}


