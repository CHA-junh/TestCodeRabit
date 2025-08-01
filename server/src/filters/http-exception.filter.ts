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
    let message = '?λ² ?΄λ? ?€λ₯κ° λ°μ?μ΅?λ€.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // κ°λ° ?κ²½?μλ§??μΈ ?λ¬ λ©μμ§ ?ΈμΆ
    if (process.env.NODE_ENV === 'development') {
      message =
        exception instanceof Error ? exception.message : '?????λ ?€λ₯';
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

    // λ‘κ·Έ ?λ²¨ κ²°μ : 401, 403, 404??WARN, ?λ¨Έμ§??ERROR
    const isClientError = status >= 400 && status < 500 && status !== 500;
    const isAuthError = status === 401 || status === 403;
    const isSessionCheck = request.url?.includes('/api/auth/session');

    // ?Έμ μ²΄ν¬ 401 ?λ¬??λ‘κ·Έ ?μΈ (?μ?μΈ ?μ)
    if (isAuthError && isSessionCheck) {
      // λ‘κ·Έ ?μ - ?μ?μΈ ?Έμ μ²΄ν¬ ?€ν¨
    } else if (isAuthError) {
      this.logger.warn(
        `? ?Έμ¦ ?€ν¨: ${request.method} ${request.url} from ${errorData.ip}`,
        errorData,
      );
    } else if (isClientError) {
      this.logger.warn(
        `? οΈ ?΄λΌ?΄μΈ???μ²­ ?€λ₯: ${request.method} ${request.url}`,
        errorData,
      );
    } else {
      this.logger.error(
        `??HTTP ?μΈ λ°μ: ${request.method} ${request.url}`,
        errorData,
      );
    }

    response.status(status).json(errorResponse);
  }
}


