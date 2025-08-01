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

// express-session ????์ฅ
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
   * ๋ก๊ทธ???๋ ?ํ ?์ธ
   */
  private checkLoginAttempts(empNo: string): boolean {
    const attempts = this.loginAttempts.get(empNo);
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15๋ถ?

    if (!attempts) {
      this.loginAttempts.set(empNo, { count: 1, lastAttempt: now });
      return true;
    }

    // ?๊ฐ ์ฐฝ์ด ์ง?ฌ์ผ๋ฉ?์ด๊ธฐ??
    if (now - attempts.lastAttempt > windowMs) {
      this.loginAttempts.set(empNo, { count: 1, lastAttempt: now });
      return true;
    }

    // 5???ด์ ?๋ ??์ฐจ๋จ
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

      // ?๋ ฅ ๊ฒ์ฆ?
      if (!empNo || !password) {
        throw new BadRequestException('?ฌ์๋ฒํธ? ๋น๋?๋ฒํธ๋ฅ??๋ ฅ?ด์ฃผ?ธ์.');
      }

      // ๋ก๊ทธ???๋ ?ํ ?์ธ
      if (!this.checkLoginAttempts(empNo)) {
        throw new UnauthorizedException(
          '๋ก๊ทธ???๋๊ฐ ?๋ฌด ๋ง์ต?๋ค. 15๋ถ????ค์ ?๋?ด์ฃผ?ธ์.',
        );
      }

      // 1. ?ฌ์ฉ??์กด์ฌ ?ฌ๋? ?์ธ
      const userExists = await this.userService.userExists(empNo);
      if (!userExists) {
        throw new UnauthorizedException('์กด์ฌ?์? ?๋ ?ฌ์ฉ?์?๋ค.');
      }

      // 2. DB๋ฅ??ด์ฉ??๋น๋?๋ฒํธ ๊ฒ์ฆ?
      const isPasswordValid = await this.userService.validateUserPassword(
        empNo,
        password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('๋น๋?๋ฒํธ๊ฐ ?ผ์น?์? ?์ต?๋ค.');
      }

      // 3. ?ฌ์ฉ???๋ณด ์กฐํ (๋ถ?๋ช ?ฌํจ)
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        throw new BadRequestException('?ฌ์ฉ???๋ณด ์กฐํ???คํจ?์ต?๋ค.');
      }

      if (!userInfo.usrRoleId) {
        throw new BadRequestException(
          '๊ถํ ?๋ณด๊ฐ ?์ต?๋ค. ๊ด๋ฆฌ์?๊ฒ ๋ฌธ์?์ธ??',
        );
      }

      // ๋น๋?๋ฒํธ๊ฐ ?ฌ๋ฒ๊ณ??์ผ?์? ?์ธ
      const needsPasswordChange = password === empNo;

      if (needsPasswordChange) {
        return {
          success: false,
          needsPasswordChange: true,
          user: { needsPasswordChange: true },
          message:
            '์ด๊ธฐ ๋น๋?๋ฒํธ?๋?? ๋น๋?๋ฒํธ๋ฅ?๋ณ๊ฒฝํด??๋ก๊ทธ?ธํ  ???์ต?๋ค.',
        };
      }

      // ? ?ธ์ ๋ณด์ ๊ฐํ: ๋ก๊ทธ???ฑ๊ณต ???ธ์ ?ฌ์??
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) {
            reject(
              new BadRequestException('?ธ์ ?์ฑ ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.'),
            );
            return;
          }

          // ?ธ์???ฌ์ฉ???๋ณด ???
          req.session.user = { ...userInfo, needsPasswordChange };

          // ๋ก๊ทธ???๋ ๊ธฐ๋ก ์ด๊ธฐ??
          this.loginAttempts.delete(empNo);

          resolve();
        });
      });

      // ๋ฉ๋ด? ?๋ก๊ทธ๋จ ?ฐ์ด??๋ก๋
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
        console.warn('๋ฉ๋ด/?๋ก๊ทธ๋จ ?ฐ์ด??๋ก๋ ?คํจ:', error.message);
      }

      return {
        success: true,
        message: '๋ก๊ทธ???ฑ๊ณต',
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
      throw new BadRequestException('๋ก๊ทธ??์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.');
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

      // needsPasswordChange๊ฐ true??๊ฒฝ์ฐ ?ธ์??? ํจ?์? ?์?ผ๋ก ์ฒ๋ฆฌ
      if (userInfo.needsPasswordChange) {
        return { success: false, user: null, needsPasswordChange: true };
      }

      // ๋ฉ๋ด? ?๋ก๊ทธ๋จ ?ฐ์ด??๋ก๋
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
          '?ธ์ ์ฒดํฌ ??๋ฉ๋ด/?๋ก๊ทธ๋จ ?ฐ์ด??๋ก๋ ?คํจ:',
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

      // ?ธ์???๋ ๊ฒฝ์ฐ ?์ฌ ๋ก๊ทธ?ธํ ?ฌ์ฉ?๋ง ๋น๋?๋ฒํธ ๋ณ๊ฒ?๊ฐ??
      if (currentUser && currentUser.userId !== userId) {
        throw new UnauthorizedException(
          '?์ ??๋น๋?๋ฒํธ๋ง?๋ณ๊ฒฝํ  ???์ต?๋ค.',
        );
      }

      const isSuccess = await this.userService.updatePassword(
        userId,
        newPassword,
      );

      if (isSuccess) {
        // ๋น๋?๋ฒํธ ๋ณ๊ฒ??ฑ๊ณต ???ธ์???์ผ๋ฉ?needsPasswordChange ?๊ฑฐ
        if (currentUser) {
          req.session.user = { ...currentUser, needsPasswordChange: false };
        }

        return {
          success: true,
          message: '๋น๋?๋ฒํธ๊ฐ ?ฑ๊ณต?์ผ๋ก?๋ณ๊ฒฝ๋?์ต?๋ค.',
        };
      } else {
        throw new BadRequestException('๋น๋?๋ฒํธ ๋ณ๊ฒฝ์ ?คํจ?์ต?๋ค.');
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('๋น๋?๋ฒํธ ๋ณ๊ฒ?์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.');
    }
  }

  @Post('logout')
  async logout(
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ): Promise<any> {
    try {
      return new Promise((resolve) => {
        // ?ธ์ ?ฐ์ด???์  ์ด๊ธฐ??
        req.session.user = null;

        // ?ธ์ ?์  ?? 
        req.session.destroy((err) => {
          if (err) {
            console.error('?ธ์ ??  ?ค๋ฅ:', err);
            // ์ฟ ํค ??  (path ๋ช์)
            res.clearCookie('bist-session', { path: '/' });
            res.clearCookie('connect.sid', { path: '/' });
            res.clearCookie('sessionId', { path: '/' });
            resolve({
              success: false,
              message: '๋ก๊ทธ?์ ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.',
            });
          } else {
            // ๋ชจ๋  ์ฟ ํค ?์  ??  (path ๋ช์)
            res.clearCookie('bist-session', { path: '/' });
            res.clearCookie('connect.sid', { path: '/' });
            res.clearCookie('sessionId', { path: '/' });

            // ์บ์ ๋ฐฉ์? ?ค๋ ?ค์ 
            res.setHeader(
              'Cache-Control',
              'no-cache, no-store, must-revalidate, private',
            );
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            console.log('? ๋ก๊ทธ?์ ?๋ฃ: ?ธ์ ๋ฐ?์ฟ ํค ?์  ?? ??);
            resolve({ success: true, message: '๋ก๊ทธ?์?์?ต๋??' });
          }
        });
      });
    } catch (error) {
      console.error('๋ก๊ทธ?์ ์ฒ๋ฆฌ ?ค๋ฅ:', error);
      // ?๋ฌ๊ฐ ๋ฐ์?ด๋ ๋ชจ๋  ์ฟ ํค ??  (path ๋ช์)
      res.clearCookie('bist-session', { path: '/' });
      res.clearCookie('connect.sid', { path: '/' });
      res.clearCookie('sessionId', { path: '/' });
      return { success: false, message: '๋ก๊ทธ?์ ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.' };
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

      // ๊ด๋ฆฌ์ ๊ถํ ?์ธ
      if (currentUser.authCd !== '30') {
        throw new UnauthorizedException('๊ด๋ฆฌ์ ๊ถํ???์?ฉ๋??');
      }

      // ?์ค??๋ก๊ทธ??????ฌ์ฉ???๋ณด ์กฐํ
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        throw new BadRequestException('์กด์ฌ?์? ?๋ ?ฌ์ฉ?์?๋ค.');
      }

      // ?์ค??๋ก๊ทธ?ธ์ ?ํ ?์ ?ธ์ ?์ฑ
      const originalUser = currentUser; // ?๋ ?ฌ์ฉ???๋ณด ๋ณด์กด
      req.session.user = { ...userInfo, isTestLogin: true, originalUser };

      return {
        success: true,
        message: `?์ค??๋ก๊ทธ???ฑ๊ณต: ${empNo} (${userInfo.userName})`,
        user: userInfo,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('?์ค??๋ก๊ทธ??์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.');
    }
  }
}


