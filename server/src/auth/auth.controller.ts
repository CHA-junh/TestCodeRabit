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

// express-session 타입 확장
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
   * 로그인 시도 제한 확인
   */
  private checkLoginAttempts(empNo: string): boolean {
    const attempts = this.loginAttempts.get(empNo);
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15분

    if (!attempts) {
      this.loginAttempts.set(empNo, { count: 1, lastAttempt: now });
      return true;
    }

    // 시간 창이 지났으면 초기화
    if (now - attempts.lastAttempt > windowMs) {
      this.loginAttempts.set(empNo, { count: 1, lastAttempt: now });
      return true;
    }

    // 5회 이상 시도 시 차단
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

      // 입력 검증
      if (!empNo || !password) {
        throw new BadRequestException('사원번호와 비밀번호를 입력해주세요.');
      }

      // 로그인 시도 제한 확인
      if (!this.checkLoginAttempts(empNo)) {
        throw new UnauthorizedException(
          '로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요.',
        );
      }

      // 1. 사용자 존재 여부 확인
      const userExists = await this.userService.userExists(empNo);
      if (!userExists) {
        throw new UnauthorizedException('존재하지 않는 사용자입니다.');
      }

      // 2. DB를 이용한 비밀번호 검증
      const isPasswordValid = await this.userService.validateUserPassword(
        empNo,
        password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      // 3. 사용자 정보 조회 (부서명 포함)
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        throw new BadRequestException('사용자 정보 조회에 실패했습니다.');
      }

      if (!userInfo.usrRoleId) {
        throw new BadRequestException(
          '권한 정보가 없습니다. 관리자에게 문의하세요.',
        );
      }

      // 비밀번호가 사번과 동일한지 확인
      const needsPasswordChange = password === empNo;

      if (needsPasswordChange) {
        return {
          success: false,
          needsPasswordChange: true,
          user: { needsPasswordChange: true },
          message:
            '초기 비밀번호입니다. 비밀번호를 변경해야 로그인할 수 있습니다.',
        };
      }

      // 🔒 세션 보안 강화: 로그인 성공 시 세션 재생성
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) {
            reject(
              new BadRequestException('세션 생성 중 오류가 발생했습니다.'),
            );
            return;
          }

          // 세션에 사용자 정보 저장
          req.session.user = { ...userInfo, needsPasswordChange };

          // 로그인 시도 기록 초기화
          this.loginAttempts.delete(empNo);

          resolve();
        });
      });

      // 메뉴와 프로그램 데이터 로드
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
        console.warn('메뉴/프로그램 데이터 로드 실패:', error.message);
      }

      return {
        success: true,
        message: '로그인 성공',
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
      throw new BadRequestException('로그인 중 오류가 발생했습니다.');
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

      // needsPasswordChange가 true인 경우 세션을 유효하지 않음으로 처리
      if (userInfo.needsPasswordChange) {
        return { success: false, user: null, needsPasswordChange: true };
      }

      // 메뉴와 프로그램 데이터 로드
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
          '세션 체크 시 메뉴/프로그램 데이터 로드 실패:',
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

      // 세션이 있는 경우 현재 로그인한 사용자만 비밀번호 변경 가능
      if (currentUser && currentUser.userId !== userId) {
        throw new UnauthorizedException(
          '자신의 비밀번호만 변경할 수 있습니다.',
        );
      }

      const isSuccess = await this.userService.updatePassword(
        userId,
        newPassword,
      );

      if (isSuccess) {
        // 비밀번호 변경 성공 시 세션이 있으면 needsPasswordChange 제거
        if (currentUser) {
          req.session.user = { ...currentUser, needsPasswordChange: false };
        }

        return {
          success: true,
          message: '비밀번호가 성공적으로 변경되었습니다.',
        };
      } else {
        throw new BadRequestException('비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('비밀번호 변경 중 오류가 발생했습니다.');
    }
  }

  @Post('logout')
  async logout(
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ): Promise<any> {
    try {
      return new Promise((resolve) => {
        // 세션 데이터 완전 초기화
        req.session.user = null;

        // 세션 완전 삭제
        req.session.destroy((err) => {
          if (err) {
            console.error('세션 삭제 오류:', err);
            // 쿠키 삭제 (path 명시)
            res.clearCookie('bist-session', { path: '/' });
            res.clearCookie('connect.sid', { path: '/' });
            res.clearCookie('sessionId', { path: '/' });
            resolve({
              success: false,
              message: '로그아웃 중 오류가 발생했습니다.',
            });
          } else {
            // 모든 쿠키 완전 삭제 (path 명시)
            res.clearCookie('bist-session', { path: '/' });
            res.clearCookie('connect.sid', { path: '/' });
            res.clearCookie('sessionId', { path: '/' });

            // 캐시 방지 헤더 설정
            res.setHeader(
              'Cache-Control',
              'no-cache, no-store, must-revalidate, private',
            );
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            console.log('🔒 로그아웃 완료: 세션 및 쿠키 완전 삭제됨');
            resolve({ success: true, message: '로그아웃되었습니다.' });
          }
        });
      });
    } catch (error) {
      console.error('로그아웃 처리 오류:', error);
      // 에러가 발생해도 모든 쿠키 삭제 (path 명시)
      res.clearCookie('bist-session', { path: '/' });
      res.clearCookie('connect.sid', { path: '/' });
      res.clearCookie('sessionId', { path: '/' });
      return { success: false, message: '로그아웃 중 오류가 발생했습니다.' };
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

      // 관리자 권한 확인
      if (currentUser.authCd !== '30') {
        throw new UnauthorizedException('관리자 권한이 필요합니다.');
      }

      // 테스트 로그인 대상 사용자 정보 조회
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        throw new BadRequestException('존재하지 않는 사용자입니다.');
      }

      // 테스트 로그인을 위한 임시 세션 생성
      const originalUser = currentUser; // 원래 사용자 정보 보존
      req.session.user = { ...userInfo, isTestLogin: true, originalUser };

      return {
        success: true,
        message: `테스트 로그인 성공: ${empNo} (${userInfo.userName})`,
        user: userInfo,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('테스트 로그인 중 오류가 발생했습니다.');
    }
  }
}
