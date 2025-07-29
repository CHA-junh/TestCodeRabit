import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import session from 'express-session';

// express-session 타입 확장
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
      return true; // 역할 요구사항이 없으면 통과
    }

    const request = context.switchToHttp().getRequest<RequestWithSession>();
    const user = request.session?.user;

    if (!user) {
      throw new ForbiddenException('인증이 필요합니다.');
    }

    // 사용자 권한 확인
    const hasRole = requiredRoles.some((role) => {
      // 관리자 권한 (AUTH_CD = '30')
      if (role === 'ADMIN' && user.authCd === '30') {
        return true;
      }
      // 일반 사용자 권한
      if (role === 'USER' && user.authCd) {
        return true;
      }
      return false;
    });

    if (!hasRole) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return true;
  }
}
