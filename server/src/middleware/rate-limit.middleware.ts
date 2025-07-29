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
  ); // 15분
  private readonly maxRequests = parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || '100',
  );

  use(req: Request, res: Response, next: NextFunction): void {
    const key = this.getClientKey(req);
    const now = Date.now();

    // 클라이언트별 요청 기록 초기화 또는 확인
    if (!this.store[key] || now > this.store[key].resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
    } else {
      this.store[key].count++;
    }

    // 요청 제한 확인
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
          message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
          retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 응답 헤더에 제한 정보 추가
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
    // IP 주소 기반 키 생성
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    // User-Agent도 고려 (선택사항)
    const userAgent = req.headers['user-agent'] || 'unknown';

    return `${ip}-${userAgent.substring(0, 50)}`;
  }

  // 주기적으로 만료된 기록 정리 (메모리 누수 방지)
  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }

  // 1시간마다 정리 작업 실행
  constructor() {
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }
}
