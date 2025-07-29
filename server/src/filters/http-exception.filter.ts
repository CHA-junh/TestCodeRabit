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
    let message = '서버 내부 오류가 발생했습니다.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // 개발 환경에서만 상세 에러 메시지 노출
    if (process.env.NODE_ENV === 'development') {
      message =
        exception instanceof Error ? exception.message : '알 수 없는 오류';
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

    // 로그 레벨 결정: 401, 403, 404는 WARN, 나머지는 ERROR
    const isClientError = status >= 400 && status < 500 && status !== 500;
    const isAuthError = status === 401 || status === 403;
    const isSessionCheck = request.url?.includes('/api/auth/session');

    // 세션 체크 401 에러는 로그 제외 (정상적인 동작)
    if (isAuthError && isSessionCheck) {
      // 로그 없음 - 정상적인 세션 체크 실패
    } else if (isAuthError) {
      this.logger.warn(
        `🔒 인증 실패: ${request.method} ${request.url} from ${errorData.ip}`,
        errorData,
      );
    } else if (isClientError) {
      this.logger.warn(
        `⚠️ 클라이언트 요청 오류: ${request.method} ${request.url}`,
        errorData,
      );
    } else {
      this.logger.error(
        `❌ HTTP 예외 발생: ${request.method} ${request.url}`,
        errorData,
      );
    }

    response.status(status).json(errorResponse);
  }
}
