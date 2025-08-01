import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import session from 'express-session';

// express-session ????μ₯
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithSession>();

    if (!request.session?.user) {
      throw new UnauthorizedException(
        'λ‘κ·Έ?Έμ΄ ?μ?©λ?? ?Έμ??λ§λ£?μκ±°λ ?Έμ¦?μ? ?μ?΅λ??',
      );
    }

    return true;
  }
}


