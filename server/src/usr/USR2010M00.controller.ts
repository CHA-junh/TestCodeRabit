/**
 * UsrController - 사용자 관리 API 컨트롤러
 *
 * 주요 기능:
 * - 사용자 목록 조회 및 검색
 * - 사용자 정보 저장 (신규/수정)
 * - 사용자 업무권한 관리
 * - 비밀번호 초기화
 * - 승인결재자 검색
 * - 사용자 역할 관리
 *
 * API 엔드포인트:
 * - GET /api/usr/list - 사용자 목록 조회
 * - GET /api/usr/work-auth/:userId - 사용자 업무권한 조회
 * - POST /api/usr/save - 사용자 정보 저장
 * - POST /api/usr/password-init - 비밀번호 초기화
 * - GET /api/usr/approver-search - 승인결재자 검색
 * - GET /api/usr/roles - 사용자 역할 목록 조회
 *
 * 연관 서비스:
 * - UsrService: 사용자 관리 비즈니스 로직
 *
 * 사용 화면:
 * - USR2010M00: 사용자 관리 화면
 */
import { Controller, Get, Post, Body, Query, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import session from 'express-session';
import { UsrService } from './USR2010M00.service';

// express-session 타입 확장
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Controller('usr')
export class UsrController {
  constructor(private readonly usrService: UsrService) {}

  /**
   * 사용자 목록 조회 (GET)
   *
   * @description
   * - 본부, 부서, 사용자명 조건으로 사용자 목록을 조회합니다.
   * - TypeORM 쿼리를 사용하여 복잡한 JOIN으로 사용자 정보와 권한 정보를 함께 조회합니다.
   * - 검색 조건이 없으면 전체 사용자를 조회합니다.
   *
   * @param hqDiv - 본부구분코드 (쿼리 파라미터, ALL=전체)
   * @param deptDiv - 부서구분코드 (쿼리 파라미터, ALL=전체)
   * @param userNm - 사용자명 (쿼리 파라미터, 부분 검색)
   * @returns { success: boolean, data?: UserData[], message?: string }
   * @example
   * GET /api/usr/list?hqDiv=1000&deptDiv=1100&userNm=홍길동
   * Response: {
   *   "success": true,
   *   "data": [{ "empNo": "E001", "empNm": "홍길동", "hqDivNm": "디지털영업본부" }]
   * }
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Get('list')
  async getUserList(
    @Query('hqDiv') hqDiv?: string,
    @Query('deptDiv') deptDiv?: string,
    @Query('userNm') userNm?: string,
  ) {
    console.log('🔍 사용자 목록 조회 요청:', { hqDiv, deptDiv, userNm });

    try {
      const result = await this.usrService.getUserList(hqDiv, deptDiv, userNm);
      console.log('✅ 사용자 목록 조회 성공:', result.length + '건');
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ 사용자 목록 조회 실패:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * 사용자 업무권한 목록 조회 (GET)
   *
   * @description
   * - 특정 사용자의 업무권한 목록을 조회합니다.
   * - USR_01_0202_S 프로시저를 호출하여 업무별 사용권한 정보를 가져옵니다.
   * - 업무구분코드, 업무구분명, 사용권한여부 등을 반환합니다.
   *
   * @param userId - 사용자 ID (경로 파라미터, 사번)
   * @returns { success: boolean, data?: WorkAuthData[], message?: string }
   * @example
   * GET /api/usr/work-auth/E001
   * Response: {
   *   "success": true,
   *   "data": [{ "smlCsfCd": "01", "smlCsfNm": "사업관리", "wrkUseYn": "1" }]
   * }
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Get('work-auth/:userId')
  async getWorkAuthList(@Param('userId') userId: string) {
    console.log('🔍 사용자 업무권한 목록 조회 요청:', userId);

    try {
      const result = await this.usrService.getWorkAuthList(userId);
      console.log('✅ 사용자 업무권한 목록 조회 성공:', result.length + '건');
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ 사용자 업무권한 목록 조회 실패:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * 사용자 정보 저장 (POST)
   *
   * @description
   * - 사용자 정보를 신규 생성하거나 수정합니다.
   * - USR_01_0204_T 프로시저를 호출하여 사용자 정보와 업무권한을 함께 저장합니다.
   * - 트랜잭션을 사용하여 안전하게 처리합니다.
   * - 사용자역할(USR_ROLE_ID) 정보도 함께 저장됩니다.
   * - 현재 로그인한 사용자의 세션 정보를 활용하여 등록자/변경자 정보를 설정합니다.
   *
   * @param userData - 저장할 사용자 정보 (요청 본문)
   * @param req - Express 요청 객체 (세션 정보 포함)
   * @returns { success: boolean, data?: string, message?: string }
   * @example
   * POST /api/usr/save
   * Body: {
   *   "empNo": "E001",
   *   "empNm": "홍길동",
   *   "hqDivCd": "1000",
   *   "deptDivCd": "1100",
   *   "workAuthList": [{ "smlCsfCd": "01", "wrkUseYn": "1" }]
   * }
   * Response: {
   *   "success": true,
   *   "data": "저장되었습니다."
   * }
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Post('save')
  async saveUser(@Body() userData: any, @Req() req: RequestWithSession) {
    console.log('💾 사용자 정보 저장 요청:', userData);

    try {
      // 현재 로그인한 사용자 세션 정보 확인
      if (!req.session.user) {
        return {
          success: false,
          message: '로그인이 필요합니다.',
        };
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('🔍 현재 로그인 사용자:', currentUserId);

      const result = await this.usrService.saveUser(userData, currentUserId);
      console.log('✅ 사용자 정보 저장 성공:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ 사용자 정보 저장 실패:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * 비밀번호 초기화 (POST)
   *
   * @description
   * - 사용자의 비밀번호를 사용자ID(사번)로 초기화합니다 (기존 Flex 방식과 동일).
   * - MD5 해시를 사용하여 비밀번호를 암호화합니다.
   * - 비밀번호 변경일시를 현재 시간으로 설정합니다.
   * - 현재 로그인한 사용자의 세션 정보를 확인하여 권한을 검증합니다.
   *
   * @param data - 비밀번호 초기화할 사용자 정보 (요청 본문)
   * @param data.userId - 사용자 ID (사번)
   * @param req - Express 요청 객체 (세션 정보 포함)
   * @returns { success: boolean, data?: string, message?: string }
   * @example
   * POST /api/usr/password-init
   * Body: { "userId": "E001" }
   * Response: {
   *   "success": true,
   *   "data": "비밀번호가 초기화되었습니다."
   * }
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Post('password-init')
  async initPassword(
    @Body() data: { userId: string },
    @Req() req: RequestWithSession,
  ) {
    console.log('🔑 비밀번호 초기화 요청:', data.userId);

    try {
      // 현재 로그인한 사용자 세션 정보 확인
      if (!req.session.user) {
        return {
          success: false,
          message: '로그인이 필요합니다.',
        };
      }

      const currentUser = req.session.user;
      console.log(
        '🔍 현재 로그인 사용자:',
        currentUser.empNo || currentUser.userId,
      );

      // 관리자 권한 확인 (권한코드 A 또는 특정 역할)
      const isAdmin =
        currentUser.authCd === 'A' ||
        currentUser.usrRoleId === 'A250715005' ||
        currentUser.usrRoleId === 'A250715001';

      if (!isAdmin) {
        return {
          success: false,
          message: '비밀번호 초기화 권한이 없습니다.',
        };
      }

      const result = await this.usrService.initPassword(data.userId);
      console.log('✅ 비밀번호 초기화 성공:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ 비밀번호 초기화 실패:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * 승인결재자 검색 (GET)
   *
   * @description
   * - 승인결재자를 사용자명으로 검색합니다.
   * - USR_01_0201_S 프로시저를 호출하여 승인결재자 목록을 조회합니다.
   * - 사용자명으로 부분 검색이 가능합니다.
   * - 최대 100개까지 조회 가능합니다.
   *
   * @param approverNm - 승인결재자명 (쿼리 파라미터, 부분 검색)
   * @returns { success: boolean, data?: UserData[], message?: string }
   * @example
   * GET /api/usr/approver-search?approverNm=홍길동
   * Response: {
   *   "success": true,
   *   "data": [{ "empNo": "E001", "empNm": "홍길동", "authCd": "10" }]
   * }
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Get('approver-search')
  async searchApprover(@Query('approverNm') approverNm: string) {
    console.log('🔍 승인결재자 검색 요청:', approverNm);

    try {
      const result = await this.usrService.searchApprover(approverNm);
      console.log('✅ 승인결재자 검색 성공:', result.length + '건');
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ 승인결재자 검색 실패:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * 사용자 역할 목록 조회 (GET)
   *
   * @description
   * - 사용여부가 'Y'인 사용자 역할 목록을 조회합니다.
   * - 역할명 순으로 정렬하여 반환합니다.
   * - 사용자 관리 화면에서 사용자역할 콤보박스용으로 사용됩니다.
   *
   * @returns { success: boolean, data?: TblUserRole[], message?: string }
   * @example
   * GET /api/usr/roles
   * Response: {
   *   "success": true,
   *   "data": [{ "usrRoleId": "A250715001", "usrRoleNm": "일반사용자" }]
   * }
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Get('roles')
  async getUserRoles() {
    console.log('🔍 사용자 역할 목록 조회 요청');

    try {
      const result = await this.usrService.getUserRoles();
      console.log('✅ 사용자 역할 목록 조회 성공:', result.length + '건');
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ 사용자 역할 목록 조회 실패:', error);
      return { success: false, message: (error as Error).message };
    }
  }
}
