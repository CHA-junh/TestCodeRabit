import { Controller, Post, Body, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { Request, Response } from 'express';
import session from 'express-session';

// express-session 타입 확장
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}
// express-session 기반 세션 관리로 변경

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
      // 입력 검증
      if (!empNo || !password) {
        return {
          success: false,
          message: '사원번호와 비밀번호를 입력해주세요.',
        };
      }
      // 사용자 존재 확인
      const userExists = await this.userService.userExists(empNo);
      if (!userExists) {
        return {
          success: false,
          message: '존재하지 않는 사용자입니다.',
        };
      }
      // DB 비밀번호 검증
      const isPasswordValid = await this.userService.validateUserPassword(
        empNo,
        password,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: '비밀번호가 일치하지 않습니다.',
        };
      }
      // 사용자 정보 조회
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        return {
          success: false,
          message: '사용자 정보 조회에 실패했습니다.',
        };
      }
      // 비밀번호가 사번과 동일한지 체크
      const needsPasswordChange = password === empNo;
      // express-session 세션에 사용자 정보 저장
      req.session.user = { ...userInfo, needsPasswordChange };
      // 쿠키는 express-session이 자동으로 관리하므로 별도 설정 불필요
      return {
        success: true,
        message: '로그인 성공',
        user: { ...userInfo, needsPasswordChange },
      };
    } catch (error) {
      // 로그 완전 제거 - 보안상 민감한 정보 노출 방지
      return {
        success: false,
        message: '로그인 중 오류가 발생했습니다.',
      };
    }
  }

  @Get('session')
  async session(@Req() req: RequestWithSession): Promise<any> {
    try {
      // express-session 기반 세션 확인
      if (!req.session.user) {
        return { success: false, user: null };
      }
      return {
        success: true,
        user: req.session.user,
      };
    } catch (error) {
      console.error('❌ 세션 확인 오류:', error);
      // 오류 발생 시에도 쿠키 삭제
      return { success: false, user: null };
    }
  }

  @Post('logout')
  async logout(@Req() req: RequestWithSession): Promise<any> {
    try {
      // express-session 세션 삭제
      return new Promise((resolve) => {
        req.session.destroy((err) => {
          if (err) {
            console.error('로그아웃 오류:', err);
            resolve({ success: false });
          } else {
            resolve({ success: true });
          }
        });
      });
    } catch (error) {
      console.error('로그아웃 오류:', error);
      return { success: false };
    }
  }
}
