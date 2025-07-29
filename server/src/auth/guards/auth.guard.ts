import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import session from 'express-session';

// express-session ?�???�장
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithSession>();

    if (!request.session?.user) {
      throw new UnauthorizedException(
        '로그?�이 ?�요?�니?? ?�션??만료?�었거나 ?�증?��? ?�았?�니??',
      );
    }

    return true;
  }
}


