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

    // ?�심?�러???�청 ?�턴 감�?
    const isSuspicious = this.detectSuspiciousActivity(req);

    if (isSuspicious) {
      this.logger.warn(`?�� ?�심?�러???�청 감�?: ${method} ${url} from ${ip}`, {
        method,
        url,
        ip,
        userAgent: userAgent.substring(0, 100),
        timestamp: new Date().toISOString(),
        suspiciousPattern: isSuspicious,
      });

      // 보안 ?�벤??로깅 (?�제 ?�영?�경?�서??별도 보안 로그 ?�스?�으�??�송)
      this.logSecurityEvent('suspicious_request', {
        method,
        url,
        ip,
        userAgent,
        pattern: isSuspicious,
      });
    }

    // ?�청 ?�더 검�?
    this.validateHeaders(headers);

    next();
  }

  private detectSuspiciousActivity(req: Request): string | null {
    const { url, query, body, headers } = req;

    // URL?�서 ?�심?�러???�턴 검??
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(url)) {
        return `URL ?�턴: ${pattern.source}`;
      }
    }

    // 쿼리 ?�라미터?�서 ?�심?�러???�턴 검??
    const queryString = JSON.stringify(query);
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(queryString)) {
        return `쿼리 ?�턴: ${pattern.source}`;
      }
    }

    // ?�청 본문?�서 ?�심?�러???�턴 검??
    if (body) {
      const bodyString = JSON.stringify(body);
      for (const pattern of this.suspiciousPatterns) {
        if (pattern.test(bodyString)) {
          return `본문 ?�턴: ${pattern.source}`;
        }
      }
    }

    // User-Agent ?�푸??감�?
    const userAgent = headers['user-agent'] || '';
    if (
      userAgent.toLowerCase().includes('sqlmap') ||
      userAgent.toLowerCase().includes('nikto') ||
      userAgent.toLowerCase().includes('nmap')
    ) {
      return `?�심?�러??User-Agent: ${userAgent}`;
    }

    return null;
  }

  private validateHeaders(headers: any): void {
    // ?�수 ?�더 검�?
    const requiredHeaders = ['host', 'user-agent'];

    for (const header of requiredHeaders) {
      if (!headers[header]) {
        this.logger.warn(`?�수 ?�더 ?�락: ${header}`);
      }
    }

    // Content-Type 검�?
    if (
      headers['content-type'] &&
      !headers['content-type'].includes('application/json')
    ) {
      this.logger.warn(`?�상�?못한 Content-Type: ${headers['content-type']}`);
    }
  }

  private logSecurityEvent(eventType: string, data: any): void {
    // ?�제 ?�영?�경?�서??보안 ?�보 �??�벤??관�?SIEM) ?�스?�으�??�송
    const securityEvent = {
      eventType,
      timestamp: new Date().toISOString(),
      data,
      severity: 'warning',
    };

    this.logger.log(`?�� 보안 ?�벤?? ${eventType}`, securityEvent);
  }
}


