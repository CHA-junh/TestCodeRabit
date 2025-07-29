import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import session from 'express-session';

// express-session ?€???•ì¥
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // ??•  ?”êµ¬?¬í•­???†ìœ¼ë©??µê³¼
    }

    const request = context.switchToHttp().getRequest<RequestWithSession>();
    const user = request.session?.user;

    if (!user) {
      throw new ForbiddenException('?¸ì¦???„ìš”?©ë‹ˆ??');
    }

    // ?¬ìš©??ê¶Œí•œ ?•ì¸
    const hasRole = requiredRoles.some((role) => {
      // ê´€ë¦¬ì ê¶Œí•œ (AUTH_CD = '30')
      if (role === 'ADMIN' && user.authCd === '30') {
        return true;
      }
      // ?¼ë°˜ ?¬ìš©??ê¶Œí•œ
      if (role === 'USER' && user.authCd) {
        return true;
      }
      return false;
    });

    if (!hasRole) {
      throw new ForbiddenException('?‘ê·¼ ê¶Œí•œ???†ìŠµ?ˆë‹¤.');
    }

    return true;
  }
}


