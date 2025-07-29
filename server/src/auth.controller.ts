import { Controller, Post, Body, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { Request, Response } from 'express';
import session from 'express-session';

// express-session ?�???�장
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}
// express-session 기반 ?�션 관리로 변�?

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
      // ?�력 검�?
      if (!empNo || !password) {
        return {
          success: false,
          message: '?�원번호?� 비�?번호�??�력?�주?�요.',
        };
      }
      // ?�용??존재 ?�인
      const userExists = await this.userService.userExists(empNo);
      if (!userExists) {
        return {
          success: false,
          message: '존재?��? ?�는 ?�용?�입?�다.',
        };
      }
      // DB 비�?번호 검�?
      const isPasswordValid = await this.userService.validateUserPassword(
        empNo,
        password,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: '비�?번호가 ?�치?��? ?�습?�다.',
        };
      }
      // ?�용???�보 조회
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        return {
          success: false,
          message: '?�용???�보 조회???�패?�습?�다.',
        };
      }
      // 비�?번호가 ?�번�??�일?��? 체크
      const needsPasswordChange = password === empNo;
      // express-session ?�션???�용???�보 ?�??
      req.session.user = { ...userInfo, needsPasswordChange };
      // 쿠키??express-session???�동?�로 관리하므�?별도 ?�정 불필??
      return {
        success: true,
        message: '로그???�공',
        user: { ...userInfo, needsPasswordChange },
      };
    } catch (error) {
      // 로그 ?�전 ?�거 - 보안??민감???�보 ?�출 방�?
      return {
        success: false,
        message: '로그??�??�류가 발생?�습?�다.',
      };
    }
  }

  @Get('session')
  async session(@Req() req: RequestWithSession): Promise<any> {
    try {
      // express-session 기반 ?�션 ?�인
      if (!req.session.user) {
        return { success: false, user: null };
      }
      return {
        success: true,
        user: req.session.user,
      };
    } catch (error) {
      console.error('???�션 ?�인 ?�류:', error);
      // ?�류 발생 ?�에??쿠키 ??��
      return { success: false, user: null };
    }
  }

  @Post('logout')
  async logout(@Req() req: RequestWithSession): Promise<any> {
    try {
      // express-session ?�션 ??��
      return new Promise((resolve) => {
        req.session.destroy((err) => {
          if (err) {
            console.error('로그?�웃 ?�류:', err);
            resolve({ success: false });
          } else {
            resolve({ success: true });
          }
        });
      });
    } catch (error) {
      console.error('로그?�웃 ?�류:', error);
      return { success: false };
    }
  }
}


