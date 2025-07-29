import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: RateLimitStore = {};
  private readonly windowMs = parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || '900000',
  ); // 15�?
  private readonly maxRequests = parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || '100',
  );

  use(req: Request, res: Response, next: NextFunction): void {
    const key = this.getClientKey(req);
    const now = Date.now();

    // ?�라?�언?�별 ?�청 기록 초기???�는 ?�인
    if (!this.store[key] || now > this.store[key].resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
    } else {
      this.store[key].count++;
    }

    // ?�청 ?�한 ?�인
    if (this.store[key].count > this.maxRequests) {
      const retryAfter = Math.ceil((this.store[key].resetTime - now) / 1000);

      res.setHeader('Retry-After', retryAfter.toString());
      res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader(
        'X-RateLimit-Reset',
        new Date(this.store[key].resetTime).toISOString(),
      );

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: '?�청???�무 많습?�다. ?�시 ???�시 ?�도?�주?�요.',
          retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // ?�답 ?�더???�한 ?�보 추�?
    res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
    res.setHeader(
      'X-RateLimit-Remaining',
      (this.maxRequests - this.store[key].count).toString(),
    );
    res.setHeader(
      'X-RateLimit-Reset',
      new Date(this.store[key].resetTime).toISOString(),
    );

    next();
  }

  private getClientKey(req: Request): string {
    // IP 주소 기반 ???�성
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    // User-Agent??고려 (?�택?�항)
    const userAgent = req.headers['user-agent'] || 'unknown';

    return `${ip}-${userAgent.substring(0, 50)}`;
  }

  // 주기?�으�?만료??기록 ?�리 (메모�??�수 방�?)
  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }

  // 1?�간마다 ?�리 ?�업 ?�행
  constructor() {
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }
}


