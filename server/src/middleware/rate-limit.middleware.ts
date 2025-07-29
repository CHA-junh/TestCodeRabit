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
  ); // 15ë¶?
  private readonly maxRequests = parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || '100',
  );

  use(req: Request, res: Response, next: NextFunction): void {
    const key = this.getClientKey(req);
    const now = Date.now();

    // ?´ë¼?´ì–¸?¸ë³„ ?”ì²­ ê¸°ë¡ ì´ˆê¸°???ëŠ” ?•ì¸
    if (!this.store[key] || now > this.store[key].resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
    } else {
      this.store[key].count++;
    }

    // ?”ì²­ ?œí•œ ?•ì¸
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
          message: '?”ì²­???ˆë¬´ ë§ŽìŠµ?ˆë‹¤. ? ì‹œ ???¤ì‹œ ?œë„?´ì£¼?¸ìš”.',
          retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // ?‘ë‹µ ?¤ë”???œí•œ ?•ë³´ ì¶”ê?
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
    // IP ì£¼ì†Œ ê¸°ë°˜ ???ì„±
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    // User-Agent??ê³ ë ¤ (? íƒ?¬í•­)
    const userAgent = req.headers['user-agent'] || 'unknown';

    return `${ip}-${userAgent.substring(0, 50)}`;
  }

  // ì£¼ê¸°?ìœ¼ë¡?ë§Œë£Œ??ê¸°ë¡ ?•ë¦¬ (ë©”ëª¨ë¦??„ìˆ˜ ë°©ì?)
  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }

  // 1?œê°„ë§ˆë‹¤ ?•ë¦¬ ?‘ì—… ?¤í–‰
  constructor() {
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }
}


