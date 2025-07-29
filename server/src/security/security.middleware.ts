import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);
  private readonly suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /union\s+select/gi,
    /drop\s+table/gi,
    /delete\s+from/gi,
    /insert\s+into/gi,
    /update\s+set/gi,
    /exec\s*\(/gi,
    /eval\s*\(/gi,
  ];

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, url, headers, body, query } = req;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = headers['user-agent'] || '';

    // 의심스러운 요청 패턴 감지
    const isSuspicious = this.detectSuspiciousActivity(req);

    if (isSuspicious) {
      this.logger.warn(`🚨 의심스러운 요청 감지: ${method} ${url} from ${ip}`, {
        method,
        url,
        ip,
        userAgent: userAgent.substring(0, 100),
        timestamp: new Date().toISOString(),
        suspiciousPattern: isSuspicious,
      });

      // 보안 이벤트 로깅 (실제 운영환경에서는 별도 보안 로그 시스템으로 전송)
      this.logSecurityEvent('suspicious_request', {
        method,
        url,
        ip,
        userAgent,
        pattern: isSuspicious,
      });
    }

    // 요청 헤더 검증
    this.validateHeaders(headers);

    next();
  }

  private detectSuspiciousActivity(req: Request): string | null {
    const { url, query, body, headers } = req;

    // URL에서 의심스러운 패턴 검사
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(url)) {
        return `URL 패턴: ${pattern.source}`;
      }
    }

    // 쿼리 파라미터에서 의심스러운 패턴 검사
    const queryString = JSON.stringify(query);
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(queryString)) {
        return `쿼리 패턴: ${pattern.source}`;
      }
    }

    // 요청 본문에서 의심스러운 패턴 검사
    if (body) {
      const bodyString = JSON.stringify(body);
      for (const pattern of this.suspiciousPatterns) {
        if (pattern.test(bodyString)) {
          return `본문 패턴: ${pattern.source}`;
        }
      }
    }

    // User-Agent 스푸핑 감지
    const userAgent = headers['user-agent'] || '';
    if (
      userAgent.toLowerCase().includes('sqlmap') ||
      userAgent.toLowerCase().includes('nikto') ||
      userAgent.toLowerCase().includes('nmap')
    ) {
      return `의심스러운 User-Agent: ${userAgent}`;
    }

    return null;
  }

  private validateHeaders(headers: any): void {
    // 필수 헤더 검증
    const requiredHeaders = ['host', 'user-agent'];

    for (const header of requiredHeaders) {
      if (!headers[header]) {
        this.logger.warn(`필수 헤더 누락: ${header}`);
      }
    }

    // Content-Type 검증
    if (
      headers['content-type'] &&
      !headers['content-type'].includes('application/json')
    ) {
      this.logger.warn(`예상치 못한 Content-Type: ${headers['content-type']}`);
    }
  }

  private logSecurityEvent(eventType: string, data: any): void {
    // 실제 운영환경에서는 보안 정보 및 이벤트 관리(SIEM) 시스템으로 전송
    const securityEvent = {
      eventType,
      timestamp: new Date().toISOString(),
      data,
      severity: 'warning',
    };

    this.logger.log(`🔒 보안 이벤트: ${eventType}`, securityEvent);
  }
}
