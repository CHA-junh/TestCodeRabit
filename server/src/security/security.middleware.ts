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

    // ?˜ì‹¬?¤ëŸ¬???”ì²­ ?¨í„´ ê°ì?
    const isSuspicious = this.detectSuspiciousActivity(req);

    if (isSuspicious) {
      this.logger.warn(`?š¨ ?˜ì‹¬?¤ëŸ¬???”ì²­ ê°ì?: ${method} ${url} from ${ip}`, {
        method,
        url,
        ip,
        userAgent: userAgent.substring(0, 100),
        timestamp: new Date().toISOString(),
        suspiciousPattern: isSuspicious,
      });

      // ë³´ì•ˆ ?´ë²¤??ë¡œê¹… (?¤ì œ ?´ì˜?˜ê²½?ì„œ??ë³„ë„ ë³´ì•ˆ ë¡œê·¸ ?œìŠ¤?œìœ¼ë¡??„ì†¡)
      this.logSecurityEvent('suspicious_request', {
        method,
        url,
        ip,
        userAgent,
        pattern: isSuspicious,
      });
    }

    // ?”ì²­ ?¤ë” ê²€ì¦?
    this.validateHeaders(headers);

    next();
  }

  private detectSuspiciousActivity(req: Request): string | null {
    const { url, query, body, headers } = req;

    // URL?ì„œ ?˜ì‹¬?¤ëŸ¬???¨í„´ ê²€??
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(url)) {
        return `URL ?¨í„´: ${pattern.source}`;
      }
    }

    // ì¿¼ë¦¬ ?Œë¼ë¯¸í„°?ì„œ ?˜ì‹¬?¤ëŸ¬???¨í„´ ê²€??
    const queryString = JSON.stringify(query);
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(queryString)) {
        return `ì¿¼ë¦¬ ?¨í„´: ${pattern.source}`;
      }
    }

    // ?”ì²­ ë³¸ë¬¸?ì„œ ?˜ì‹¬?¤ëŸ¬???¨í„´ ê²€??
    if (body) {
      const bodyString = JSON.stringify(body);
      for (const pattern of this.suspiciousPatterns) {
        if (pattern.test(bodyString)) {
          return `ë³¸ë¬¸ ?¨í„´: ${pattern.source}`;
        }
      }
    }

    // User-Agent ?¤í‘¸??ê°ì?
    const userAgent = headers['user-agent'] || '';
    if (
      userAgent.toLowerCase().includes('sqlmap') ||
      userAgent.toLowerCase().includes('nikto') ||
      userAgent.toLowerCase().includes('nmap')
    ) {
      return `?˜ì‹¬?¤ëŸ¬??User-Agent: ${userAgent}`;
    }

    return null;
  }

  private validateHeaders(headers: any): void {
    // ?„ìˆ˜ ?¤ë” ê²€ì¦?
    const requiredHeaders = ['host', 'user-agent'];

    for (const header of requiredHeaders) {
      if (!headers[header]) {
        this.logger.warn(`?„ìˆ˜ ?¤ë” ?„ë½: ${header}`);
      }
    }

    // Content-Type ê²€ì¦?
    if (
      headers['content-type'] &&
      !headers['content-type'].includes('application/json')
    ) {
      this.logger.warn(`?ˆìƒì¹?ëª»í•œ Content-Type: ${headers['content-type']}`);
    }
  }

  private logSecurityEvent(eventType: string, data: any): void {
    // ?¤ì œ ?´ì˜?˜ê²½?ì„œ??ë³´ì•ˆ ?•ë³´ ë°??´ë²¤??ê´€ë¦?SIEM) ?œìŠ¤?œìœ¼ë¡??„ì†¡
    const securityEvent = {
      eventType,
      timestamp: new Date().toISOString(),
      data,
      severity: 'warning',
    };

    this.logger.log(`?”’ ë³´ì•ˆ ?´ë²¤?? ${eventType}`, securityEvent);
  }
}


