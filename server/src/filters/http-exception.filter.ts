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
    let message = '?œë²„ ?´ë? ?¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // ê°œë°œ ?˜ê²½?ì„œë§??ì„¸ ?ëŸ¬ ë©”ì‹œì§€ ?¸ì¶œ
    if (process.env.NODE_ENV === 'development') {
      message =
        exception instanceof Error ? exception.message : '?????†ëŠ” ?¤ë¥˜';
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

    // ë¡œê·¸ ?ˆë²¨ ê²°ì •: 401, 403, 404??WARN, ?˜ë¨¸ì§€??ERROR
    const isClientError = status >= 400 && status < 500 && status !== 500;
    const isAuthError = status === 401 || status === 403;
    const isSessionCheck = request.url?.includes('/api/auth/session');

    // ?¸ì…˜ ì²´í¬ 401 ?ëŸ¬??ë¡œê·¸ ?œì™¸ (?•ìƒ?ì¸ ?™ìž‘)
    if (isAuthError && isSessionCheck) {
      // ë¡œê·¸ ?†ìŒ - ?•ìƒ?ì¸ ?¸ì…˜ ì²´í¬ ?¤íŒ¨
    } else if (isAuthError) {
      this.logger.warn(
        `?”’ ?¸ì¦ ?¤íŒ¨: ${request.method} ${request.url} from ${errorData.ip}`,
        errorData,
      );
    } else if (isClientError) {
      this.logger.warn(
        `? ï¸ ?´ë¼?´ì–¸???”ì²­ ?¤ë¥˜: ${request.method} ${request.url}`,
        errorData,
      );
    } else {
      this.logger.error(
        `??HTTP ?ˆì™¸ ë°œìƒ: ${request.method} ${request.url}`,
        errorData,
      );
    }

    response.status(status).json(errorResponse);
  }
}


