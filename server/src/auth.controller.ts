import { Controller, Post, Body, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { Request, Response } from 'express';
import session from 'express-session';

// express-session ?€???•ì¥
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}
// express-session ê¸°ë°˜ ?¸ì…˜ ê´€ë¦¬ë¡œ ë³€ê²?

@Controller('api/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body() body: { empNo: string; password: string },
    @Req() req: RequestWithSession,
  ): Promise<any> {
    try {
      const { empNo, password } = body;
      // ?…ë ¥ ê²€ì¦?
      if (!empNo || !password) {
        return {
          success: false,
          message: '?¬ì›ë²ˆí˜¸?€ ë¹„ë?ë²ˆí˜¸ë¥??…ë ¥?´ì£¼?¸ìš”.',
        };
      }
      // ?¬ìš©??ì¡´ì¬ ?•ì¸
      const userExists = await this.userService.userExists(empNo);
      if (!userExists) {
        return {
          success: false,
          message: 'ì¡´ì¬?˜ì? ?ŠëŠ” ?¬ìš©?ì…?ˆë‹¤.',
        };
      }
      // DB ë¹„ë?ë²ˆí˜¸ ê²€ì¦?
      const isPasswordValid = await this.userService.validateUserPassword(
        empNo,
        password,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'ë¹„ë?ë²ˆí˜¸ê°€ ?¼ì¹˜?˜ì? ?ŠìŠµ?ˆë‹¤.',
        };
      }
      // ?¬ìš©???•ë³´ ì¡°íšŒ
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        return {
          success: false,
          message: '?¬ìš©???•ë³´ ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.',
        };
      }
      // ë¹„ë?ë²ˆí˜¸ê°€ ?¬ë²ˆê³??™ì¼?œì? ì²´í¬
      const needsPasswordChange = password === empNo;
      // express-session ?¸ì…˜???¬ìš©???•ë³´ ?€??
      req.session.user = { ...userInfo, needsPasswordChange };
      // ì¿ í‚¤??express-session???ë™?¼ë¡œ ê´€ë¦¬í•˜ë¯€ë¡?ë³„ë„ ?¤ì • ë¶ˆí•„??
      return {
        success: true,
        message: 'ë¡œê·¸???±ê³µ',
        user: { ...userInfo, needsPasswordChange },
      };
    } catch (error) {
      // ë¡œê·¸ ?„ì „ ?œê±° - ë³´ì•ˆ??ë¯¼ê°???•ë³´ ?¸ì¶œ ë°©ì?
      return {
        success: false,
        message: 'ë¡œê·¸??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.',
      };
    }
  }

  @Get('session')
  async session(@Req() req: RequestWithSession): Promise<any> {
    try {
      // express-session ê¸°ë°˜ ?¸ì…˜ ?•ì¸
      if (!req.session.user) {
        return { success: false, user: null };
      }
      return {
        success: true,
        user: req.session.user,
      };
    } catch (error) {
      console.error('???¸ì…˜ ?•ì¸ ?¤ë¥˜:', error);
      // ?¤ë¥˜ ë°œìƒ ?œì—??ì¿ í‚¤ ?? œ
      return { success: false, user: null };
    }
  }

  @Post('logout')
  async logout(@Req() req: RequestWithSession): Promise<any> {
    try {
      // express-session ?¸ì…˜ ?? œ
      return new Promise((resolve) => {
        req.session.destroy((err) => {
          if (err) {
            console.error('ë¡œê·¸?„ì›ƒ ?¤ë¥˜:', err);
            resolve({ success: false });
          } else {
            resolve({ success: true });
          }
        });
      });
    } catch (error) {
      console.error('ë¡œê·¸?„ì›ƒ ?¤ë¥˜:', error);
      return { success: false };
    }
  }
}


