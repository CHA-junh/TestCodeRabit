import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import session from 'express-session';

// express-session ?€???•ì¥
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithSession>();

    if (!request.session?.user) {
      throw new UnauthorizedException(
        'ë¡œê·¸?¸ì´ ?„ìš”?©ë‹ˆ?? ?¸ì…˜??ë§Œë£Œ?˜ì—ˆê±°ë‚˜ ?¸ì¦?˜ì? ?Šì•˜?µë‹ˆ??',
      );
    }

    return true;
  }
}


