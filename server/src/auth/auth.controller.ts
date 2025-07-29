import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpStatus,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from '../user/dto/user-info.dto';
import session from 'express-session';
import { MenuService } from '../menu/menu.service';
import { ProgramService } from '../entities/program.service';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';

// express-session ?€???•ì¥
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Controller('auth')
export class AuthController {
  private loginAttempts = new Map<
    string,
    { count: number; lastAttempt: number }
  >();

  constructor(
    private readonly userService: UserService,
    private readonly menuService: MenuService,
    private readonly programService: ProgramService,
  ) {}

  /**
   * ë¡œê·¸???œë„ ?œí•œ ?•ì¸
   */
  private checkLoginAttempts(empNo: string): boolean {
    const attempts = this.loginAttempts.get(empNo);
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15ë¶?

    if (!attempts) {
      this.loginAttempts.set(empNo, { count: 1, lastAttempt: now });
      return true;
    }

    // ?œê°„ ì°½ì´ ì§€?¬ìœ¼ë©?ì´ˆê¸°??
    if (now - attempts.lastAttempt > windowMs) {
      this.loginAttempts.set(empNo, { count: 1, lastAttempt: now });
      return true;
    }

    // 5???´ìƒ ?œë„ ??ì°¨ë‹¨
    if (attempts.count >= 5) {
      return false;
    }

    attempts.count++;
    attempts.lastAttempt = now;
    return true;
  }

  @Post('login')
  async login(
    @Body() body: { empNo: string; password: string },
    @Req() req: RequestWithSession,
  ): Promise<any> {
    try {
      const { empNo, password } = body;

      // ?…ë ¥ ê²€ì¦?
      if (!empNo || !password) {
        throw new BadRequestException('?¬ì›ë²ˆí˜¸?€ ë¹„ë?ë²ˆí˜¸ë¥??…ë ¥?´ì£¼?¸ìš”.');
      }

      // ë¡œê·¸???œë„ ?œí•œ ?•ì¸
      if (!this.checkLoginAttempts(empNo)) {
        throw new UnauthorizedException(
          'ë¡œê·¸???œë„ê°€ ?ˆë¬´ ë§ìŠµ?ˆë‹¤. 15ë¶????¤ì‹œ ?œë„?´ì£¼?¸ìš”.',
        );
      }

      // 1. ?¬ìš©??ì¡´ì¬ ?¬ë? ?•ì¸
      const userExists = await this.userService.userExists(empNo);
      if (!userExists) {
        throw new UnauthorizedException('ì¡´ì¬?˜ì? ?ŠëŠ” ?¬ìš©?ì…?ˆë‹¤.');
      }

      // 2. DBë¥??´ìš©??ë¹„ë?ë²ˆí˜¸ ê²€ì¦?
      const isPasswordValid = await this.userService.validateUserPassword(
        empNo,
        password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('ë¹„ë?ë²ˆí˜¸ê°€ ?¼ì¹˜?˜ì? ?ŠìŠµ?ˆë‹¤.');
      }

      // 3. ?¬ìš©???•ë³´ ì¡°íšŒ (ë¶€?œëª… ?¬í•¨)
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        throw new BadRequestException('?¬ìš©???•ë³´ ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
      }

      if (!userInfo.usrRoleId) {
        throw new BadRequestException(
          'ê¶Œí•œ ?•ë³´ê°€ ?†ìŠµ?ˆë‹¤. ê´€ë¦¬ì?ê²Œ ë¬¸ì˜?˜ì„¸??',
        );
      }

      // ë¹„ë?ë²ˆí˜¸ê°€ ?¬ë²ˆê³??™ì¼?œì? ?•ì¸
      const needsPasswordChange = password === empNo;

      if (needsPasswordChange) {
        return {
          success: false,
          needsPasswordChange: true,
          user: { needsPasswordChange: true },
          message:
            'ì´ˆê¸° ë¹„ë?ë²ˆí˜¸?…ë‹ˆ?? ë¹„ë?ë²ˆí˜¸ë¥?ë³€ê²½í•´??ë¡œê·¸?¸í•  ???ˆìŠµ?ˆë‹¤.',
        };
      }

      // ?”’ ?¸ì…˜ ë³´ì•ˆ ê°•í™”: ë¡œê·¸???±ê³µ ???¸ì…˜ ?¬ìƒ??
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) {
            reject(
              new BadRequestException('?¸ì…˜ ?ì„± ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'),
            );
            return;
          }

          // ?¸ì…˜???¬ìš©???•ë³´ ?€??
          req.session.user = { ...userInfo, needsPasswordChange };

          // ë¡œê·¸???œë„ ê¸°ë¡ ì´ˆê¸°??
          this.loginAttempts.delete(empNo);

          resolve();
        });
      });

      // ë©”ë‰´?€ ?„ë¡œê·¸ë¨ ?°ì´??ë¡œë“œ
      let menuList: any[] = [];
      let programList: any[] = [];

      try {
        if (userInfo.usrRoleId) {
          menuList = await this.menuService.getMenuListByRole(
            userInfo.usrRoleId,
          );
          programList = await this.programService.getProgramListByRole(
            userInfo.usrRoleId,
          );
        }
      } catch (error) {
        console.warn('ë©”ë‰´/?„ë¡œê·¸ë¨ ?°ì´??ë¡œë“œ ?¤íŒ¨:', error.message);
      }

      return {
        success: true,
        message: 'ë¡œê·¸???±ê³µ',
        user: {
          ...userInfo,
          needsPasswordChange,
          menuList,
          programList,
        },
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('ë¡œê·¸??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.');
    }
  }

  @Get('session')
  @UseGuards(AuthGuard)
  async checkSession(@Req() req: RequestWithSession): Promise<any> {
    try {
      if (!req.session.user) {
        return { success: false, user: null };
      }

      const userInfo = req.session.user;

      // needsPasswordChangeê°€ true??ê²½ìš° ?¸ì…˜??? íš¨?˜ì? ?ŠìŒ?¼ë¡œ ì²˜ë¦¬
      if (userInfo.needsPasswordChange) {
        return { success: false, user: null, needsPasswordChange: true };
      }

      // ë©”ë‰´?€ ?„ë¡œê·¸ë¨ ?°ì´??ë¡œë“œ
      let menuList: any[] = [];
      let programList: any[] = [];

      try {
        if (userInfo.usrRoleId) {
          menuList = await this.menuService.getMenuListByRole(
            userInfo.usrRoleId,
          );
          programList = await this.programService.getProgramListByRole(
            userInfo.usrRoleId,
          );
        }
      } catch (error) {
        console.warn(
          '?¸ì…˜ ì²´í¬ ??ë©”ë‰´/?„ë¡œê·¸ë¨ ?°ì´??ë¡œë“œ ?¤íŒ¨:',
          error.message,
        );
      }

      return {
        success: true,
        user: {
          ...userInfo,
          menuList,
          programList,
        },
      };
    } catch (error) {
      return { success: false, user: null };
    }
  }

  @Post('change-password')
  async changePassword(
    @Body() body: { userId: string; newPassword: string },
    @Req() req: RequestWithSession,
  ): Promise<any> {
    try {
      const { userId, newPassword } = body;
      const currentUser = req.session.user;

      // ?¸ì…˜???ˆëŠ” ê²½ìš° ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©?ë§Œ ë¹„ë?ë²ˆí˜¸ ë³€ê²?ê°€??
      if (currentUser && currentUser.userId !== userId) {
        throw new UnauthorizedException(
          '?ì‹ ??ë¹„ë?ë²ˆí˜¸ë§?ë³€ê²½í•  ???ˆìŠµ?ˆë‹¤.',
        );
      }

      const isSuccess = await this.userService.updatePassword(
        userId,
        newPassword,
      );

      if (isSuccess) {
        // ë¹„ë?ë²ˆí˜¸ ë³€ê²??±ê³µ ???¸ì…˜???ˆìœ¼ë©?needsPasswordChange ?œê±°
        if (currentUser) {
          req.session.user = { ...currentUser, needsPasswordChange: false };
        }

        return {
          success: true,
          message: 'ë¹„ë?ë²ˆí˜¸ê°€ ?±ê³µ?ìœ¼ë¡?ë³€ê²½ë˜?ˆìŠµ?ˆë‹¤.',
        };
      } else {
        throw new BadRequestException('ë¹„ë?ë²ˆí˜¸ ë³€ê²½ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.');
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('ë¹„ë?ë²ˆí˜¸ ë³€ê²?ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.');
    }
  }

  @Post('logout')
  async logout(
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ): Promise<any> {
    try {
      return new Promise((resolve) => {
        // ?¸ì…˜ ?°ì´???„ì „ ì´ˆê¸°??
        req.session.user = null;

        // ?¸ì…˜ ?„ì „ ?? œ
        req.session.destroy((err) => {
          if (err) {
            console.error('?¸ì…˜ ?? œ ?¤ë¥˜:', err);
            // ì¿ í‚¤ ?? œ (path ëª…ì‹œ)
            res.clearCookie('bist-session', { path: '/' });
            res.clearCookie('connect.sid', { path: '/' });
            res.clearCookie('sessionId', { path: '/' });
            resolve({
              success: false,
              message: 'ë¡œê·¸?„ì›ƒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.',
            });
          } else {
            // ëª¨ë“  ì¿ í‚¤ ?„ì „ ?? œ (path ëª…ì‹œ)
            res.clearCookie('bist-session', { path: '/' });
            res.clearCookie('connect.sid', { path: '/' });
            res.clearCookie('sessionId', { path: '/' });

            // ìºì‹œ ë°©ì? ?¤ë” ?¤ì •
            res.setHeader(
              'Cache-Control',
              'no-cache, no-store, must-revalidate, private',
            );
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            console.log('?”’ ë¡œê·¸?„ì›ƒ ?„ë£Œ: ?¸ì…˜ ë°?ì¿ í‚¤ ?„ì „ ?? œ??);
            resolve({ success: true, message: 'ë¡œê·¸?„ì›ƒ?˜ì—ˆ?µë‹ˆ??' });
          }
        });
      });
    } catch (error) {
      console.error('ë¡œê·¸?„ì›ƒ ì²˜ë¦¬ ?¤ë¥˜:', error);
      // ?ëŸ¬ê°€ ë°œìƒ?´ë„ ëª¨ë“  ì¿ í‚¤ ?? œ (path ëª…ì‹œ)
      res.clearCookie('bist-session', { path: '/' });
      res.clearCookie('connect.sid', { path: '/' });
      res.clearCookie('sessionId', { path: '/' });
      return { success: false, message: 'ë¡œê·¸?„ì›ƒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' };
    }
  }

  @Post('test-login')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  async testLogin(
    @Body() body: { empNo: string },
    @Req() req: RequestWithSession,
  ): Promise<any> {
    try {
      const { empNo } = body;
      const currentUser = req.session.user;

      // ê´€ë¦¬ì ê¶Œí•œ ?•ì¸
      if (currentUser.authCd !== '30') {
        throw new UnauthorizedException('ê´€ë¦¬ì ê¶Œí•œ???„ìš”?©ë‹ˆ??');
      }

      // ?ŒìŠ¤??ë¡œê·¸???€???¬ìš©???•ë³´ ì¡°íšŒ
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        throw new BadRequestException('ì¡´ì¬?˜ì? ?ŠëŠ” ?¬ìš©?ì…?ˆë‹¤.');
      }

      // ?ŒìŠ¤??ë¡œê·¸?¸ì„ ?„í•œ ?„ì‹œ ?¸ì…˜ ?ì„±
      const originalUser = currentUser; // ?ë˜ ?¬ìš©???•ë³´ ë³´ì¡´
      req.session.user = { ...userInfo, isTestLogin: true, originalUser };

      return {
        success: true,
        message: `?ŒìŠ¤??ë¡œê·¸???±ê³µ: ${empNo} (${userInfo.userName})`,
        user: userInfo,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('?ŒìŠ¤??ë¡œê·¸??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.');
    }
  }
}


