import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import session from 'express-session';

// express-session ????μ₯
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
      return true; // ??  ?κ΅¬?¬ν­???μΌλ©??΅κ³Ό
    }

    const request = context.switchToHttp().getRequest<RequestWithSession>();
    const user = request.session?.user;

    if (!user) {
      throw new ForbiddenException('?Έμ¦???μ?©λ??');
    }

    // ?¬μ©??κΆν ?μΈ
    const hasRole = requiredRoles.some((role) => {
      // κ΄λ¦¬μ κΆν (AUTH_CD = '30')
      if (role === 'ADMIN' && user.authCd === '30') {
        return true;
      }
      // ?Όλ° ?¬μ©??κΆν
      if (role === 'USER' && user.authCd) {
        return true;
      }
      return false;
    });

    if (!hasRole) {
      throw new ForbiddenException('?κ·Ό κΆν???μ΅?λ€.');
    }

    return true;
  }
}


