import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import session from 'express-session';

// express-session 타입 확장
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithSession>();

    if (!request.session?.user) {
      throw new UnauthorizedException(
        '로그인이 필요합니다. 세션이 만료되었거나 인증되지 않았습니다.',
      );
    }

    return true;
  }
}
