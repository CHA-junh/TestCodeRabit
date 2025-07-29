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

// express-session ?�???�장
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
   * 로그???�도 ?�한 ?�인
   */
  private checkLoginAttempts(empNo: string): boolean {
    const attempts = this.loginAttempts.get(empNo);
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15�?

    if (!attempts) {
      this.loginAttempts.set(empNo, { count: 1, lastAttempt: now });
      return true;
    }

    // ?�간 창이 지?�으�?초기??
    if (now - attempts.lastAttempt > windowMs) {
      this.loginAttempts.set(empNo, { count: 1, lastAttempt: now });
      return true;
    }

    // 5???�상 ?�도 ??차단
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

      // ?�력 검�?
      if (!empNo || !password) {
        throw new BadRequestException('?�원번호?� 비�?번호�??�력?�주?�요.');
      }

      // 로그???�도 ?�한 ?�인
      if (!this.checkLoginAttempts(empNo)) {
        throw new UnauthorizedException(
          '로그???�도가 ?�무 많습?�다. 15�????�시 ?�도?�주?�요.',
        );
      }

      // 1. ?�용??존재 ?��? ?�인
      const userExists = await this.userService.userExists(empNo);
      if (!userExists) {
        throw new UnauthorizedException('존재?��? ?�는 ?�용?�입?�다.');
      }

      // 2. DB�??�용??비�?번호 검�?
      const isPasswordValid = await this.userService.validateUserPassword(
        empNo,
        password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('비�?번호가 ?�치?��? ?�습?�다.');
      }

      // 3. ?�용???�보 조회 (부?�명 ?�함)
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        throw new BadRequestException('?�용???�보 조회???�패?�습?�다.');
      }

      if (!userInfo.usrRoleId) {
        throw new BadRequestException(
          '권한 ?�보가 ?�습?�다. 관리자?�게 문의?�세??',
        );
      }

      // 비�?번호가 ?�번�??�일?��? ?�인
      const needsPasswordChange = password === empNo;

      if (needsPasswordChange) {
        return {
          success: false,
          needsPasswordChange: true,
          user: { needsPasswordChange: true },
          message:
            '초기 비�?번호?�니?? 비�?번호�?변경해??로그?�할 ???�습?�다.',
        };
      }

      // ?�� ?�션 보안 강화: 로그???�공 ???�션 ?�생??
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) {
            reject(
              new BadRequestException('?�션 ?�성 �??�류가 발생?�습?�다.'),
            );
            return;
          }

          // ?�션???�용???�보 ?�??
          req.session.user = { ...userInfo, needsPasswordChange };

          // 로그???�도 기록 초기??
          this.loginAttempts.delete(empNo);

          resolve();
        });
      });

      // 메뉴?� ?�로그램 ?�이??로드
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
        console.warn('메뉴/?�로그램 ?�이??로드 ?�패:', error.message);
      }

      return {
        success: true,
        message: '로그???�공',
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
      throw new BadRequestException('로그??�??�류가 발생?�습?�다.');
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

      // needsPasswordChange가 true??경우 ?�션???�효?��? ?�음?�로 처리
      if (userInfo.needsPasswordChange) {
        return { success: false, user: null, needsPasswordChange: true };
      }

      // 메뉴?� ?�로그램 ?�이??로드
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
          '?�션 체크 ??메뉴/?�로그램 ?�이??로드 ?�패:',
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

      // ?�션???�는 경우 ?�재 로그?�한 ?�용?�만 비�?번호 변�?가??
      if (currentUser && currentUser.userId !== userId) {
        throw new UnauthorizedException(
          '?�신??비�?번호�?변경할 ???�습?�다.',
        );
      }

      const isSuccess = await this.userService.updatePassword(
        userId,
        newPassword,
      );

      if (isSuccess) {
        // 비�?번호 변�??�공 ???�션???�으�?needsPasswordChange ?�거
        if (currentUser) {
          req.session.user = { ...currentUser, needsPasswordChange: false };
        }

        return {
          success: true,
          message: '비�?번호가 ?�공?�으�?변경되?�습?�다.',
        };
      } else {
        throw new BadRequestException('비�?번호 변경에 ?�패?�습?�다.');
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('비�?번호 변�?�??�류가 발생?�습?�다.');
    }
  }

  @Post('logout')
  async logout(
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ): Promise<any> {
    try {
      return new Promise((resolve) => {
        // ?�션 ?�이???�전 초기??
        req.session.user = null;

        // ?�션 ?�전 ??��
        req.session.destroy((err) => {
          if (err) {
            console.error('?�션 ??�� ?�류:', err);
            // 쿠키 ??�� (path 명시)
            res.clearCookie('bist-session', { path: '/' });
            res.clearCookie('connect.sid', { path: '/' });
            res.clearCookie('sessionId', { path: '/' });
            resolve({
              success: false,
              message: '로그?�웃 �??�류가 발생?�습?�다.',
            });
          } else {
            // 모든 쿠키 ?�전 ??�� (path 명시)
            res.clearCookie('bist-session', { path: '/' });
            res.clearCookie('connect.sid', { path: '/' });
            res.clearCookie('sessionId', { path: '/' });

            // 캐시 방�? ?�더 ?�정
            res.setHeader(
              'Cache-Control',
              'no-cache, no-store, must-revalidate, private',
            );
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            console.log('?�� 로그?�웃 ?�료: ?�션 �?쿠키 ?�전 ??��??);
            resolve({ success: true, message: '로그?�웃?�었?�니??' });
          }
        });
      });
    } catch (error) {
      console.error('로그?�웃 처리 ?�류:', error);
      // ?�러가 발생?�도 모든 쿠키 ??�� (path 명시)
      res.clearCookie('bist-session', { path: '/' });
      res.clearCookie('connect.sid', { path: '/' });
      res.clearCookie('sessionId', { path: '/' });
      return { success: false, message: '로그?�웃 �??�류가 발생?�습?�다.' };
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

      // 관리자 권한 ?�인
      if (currentUser.authCd !== '30') {
        throw new UnauthorizedException('관리자 권한???�요?�니??');
      }

      // ?�스??로그???�???�용???�보 조회
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        throw new BadRequestException('존재?��? ?�는 ?�용?�입?�다.');
      }

      // ?�스??로그?�을 ?�한 ?�시 ?�션 ?�성
      const originalUser = currentUser; // ?�래 ?�용???�보 보존
      req.session.user = { ...userInfo, isTestLogin: true, originalUser };

      return {
        success: true,
        message: `?�스??로그???�공: ${empNo} (${userInfo.userName})`,
        user: userInfo,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('?�스??로그??�??�류가 발생?�습?�다.');
    }
  }
}


