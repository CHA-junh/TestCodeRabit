/**
 * UsrController - ?�용??관�?API 컨트롤러
 *
 * 주요 기능:
 * - ?�용??목록 조회 �?검??
 * - ?�용???�보 ?�??(?�규/?�정)
 * - ?�용???�무권한 관�?
 * - 비�?번호 초기??
 * - ?�인결재??검??
 * - ?�용????�� 관�?
 *
 * API ?�드?�인??
 * - GET /api/usr/list - ?�용??목록 조회
 * - GET /api/usr/work-auth/:userId - ?�용???�무권한 조회
 * - POST /api/usr/save - ?�용???�보 ?�??
 * - POST /api/usr/password-init - 비�?번호 초기??
 * - GET /api/usr/approver-search - ?�인결재??검??
 * - GET /api/usr/roles - ?�용????�� 목록 조회
 *
 * ?��? ?�비??
 * - UsrService: ?�용??관�?비즈?�스 로직
 *
 * ?�용 ?�면:
 * - USR2010M00: ?�용??관�??�면
 */
import { Controller, Get, Post, Body, Query, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import session from 'express-session';
import { UsrService } from './USR2010M00.service';

// express-session ?�???�장
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Controller('usr')
export class UsrController {
  constructor(private readonly usrService: UsrService) {}

  /**
   * ?�용??목록 조회 (GET)
   *
   * @description
   * - 본�?, 부?? ?�용?�명 조건?�로 ?�용??목록??조회?�니??
   * - TypeORM 쿼리�??�용?�여 복잡??JOIN?�로 ?�용???�보?� 권한 ?�보�??�께 조회?�니??
   * - 검??조건???�으�??�체 ?�용?��? 조회?�니??
   *
   * @param hqDiv - 본�?구분코드 (쿼리 ?�라미터, ALL=?�체)
   * @param deptDiv - 부?�구분코??(쿼리 ?�라미터, ALL=?�체)
   * @param userNm - ?�용?�명 (쿼리 ?�라미터, 부�?검??
   * @returns { success: boolean, data?: UserData[], message?: string }
   * @example
   * GET /api/usr/list?hqDiv=1000&deptDiv=1100&userNm=?�길??
   * Response: {
   *   "success": true,
   *   "data": [{ "empNo": "E001", "empNm": "?�길??, "hqDivNm": "?��??�영?�본부" }]
   * }
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Get('list')
  async getUserList(
    @Query('hqDiv') hqDiv?: string,
    @Query('deptDiv') deptDiv?: string,
    @Query('userNm') userNm?: string,
  ) {
    console.log('?�� ?�용??목록 조회 ?�청:', { hqDiv, deptDiv, userNm });

    try {
      const result = await this.usrService.getUserList(hqDiv, deptDiv, userNm);
      console.log('???�용??목록 조회 ?�공:', result.length + '�?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???�용??목록 조회 ?�패:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?�용???�무권한 목록 조회 (GET)
   *
   * @description
   * - ?�정 ?�용?�의 ?�무권한 목록??조회?�니??
   * - USR_01_0202_S ?�로?��?�??�출?�여 ?�무�??�용권한 ?�보�?가?�옵?�다.
   * - ?�무구분코드, ?�무구분�? ?�용권한?��? ?�을 반환?�니??
   *
   * @param userId - ?�용??ID (경로 ?�라미터, ?�번)
   * @returns { success: boolean, data?: WorkAuthData[], message?: string }
   * @example
   * GET /api/usr/work-auth/E001
   * Response: {
   *   "success": true,
   *   "data": [{ "smlCsfCd": "01", "smlCsfNm": "?�업관�?, "wrkUseYn": "1" }]
   * }
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Get('work-auth/:userId')
  async getWorkAuthList(@Param('userId') userId: string) {
    console.log('?�� ?�용???�무권한 목록 조회 ?�청:', userId);

    try {
      const result = await this.usrService.getWorkAuthList(userId);
      console.log('???�용???�무권한 목록 조회 ?�공:', result.length + '�?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???�용???�무권한 목록 조회 ?�패:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?�용???�보 ?�??(POST)
   *
   * @description
   * - ?�용???�보�??�규 ?�성?�거???�정?�니??
   * - USR_01_0204_T ?�로?��?�??�출?�여 ?�용???�보?� ?�무권한???�께 ?�?�합?�다.
   * - ?�랜??��???�용?�여 ?�전?�게 처리?�니??
   * - ?�용?�역??USR_ROLE_ID) ?�보???�께 ?�?�됩?�다.
   * - ?�재 로그?�한 ?�용?�의 ?�션 ?�보�??�용?�여 ?�록??변경자 ?�보�??�정?�니??
   *
   * @param userData - ?�?�할 ?�용???�보 (?�청 본문)
   * @param req - Express ?�청 객체 (?�션 ?�보 ?�함)
   * @returns { success: boolean, data?: string, message?: string }
   * @example
   * POST /api/usr/save
   * Body: {
   *   "empNo": "E001",
   *   "empNm": "?�길??,
   *   "hqDivCd": "1000",
   *   "deptDivCd": "1100",
   *   "workAuthList": [{ "smlCsfCd": "01", "wrkUseYn": "1" }]
   * }
   * Response: {
   *   "success": true,
   *   "data": "?�?�되?�습?�다."
   * }
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Post('save')
  async saveUser(@Body() userData: any, @Req() req: RequestWithSession) {
    console.log('?�� ?�용???�보 ?�???�청:', userData);

    try {
      // ?�재 로그?�한 ?�용???�션 ?�보 ?�인
      if (!req.session.user) {
        return {
          success: false,
          message: '로그?�이 ?�요?�니??',
        };
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('?�� ?�재 로그???�용??', currentUserId);

      const result = await this.usrService.saveUser(userData, currentUserId);
      console.log('???�용???�보 ?�???�공:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('???�용???�보 ?�???�패:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * 비�?번호 초기??(POST)
   *
   * @description
   * - ?�용?�의 비�?번호�??�용?�ID(?�번)�?초기?�합?�다 (기존 Flex 방식�??�일).
   * - MD5 ?�시�??�용?�여 비�?번호�??�호?�합?�다.
   * - 비�?번호 변경일?��? ?�재 ?�간?�로 ?�정?�니??
   * - ?�재 로그?�한 ?�용?�의 ?�션 ?�보�??�인?�여 권한??검증합?�다.
   *
   * @param data - 비�?번호 초기?�할 ?�용???�보 (?�청 본문)
   * @param data.userId - ?�용??ID (?�번)
   * @param req - Express ?�청 객체 (?�션 ?�보 ?�함)
   * @returns { success: boolean, data?: string, message?: string }
   * @example
   * POST /api/usr/password-init
   * Body: { "userId": "E001" }
   * Response: {
   *   "success": true,
   *   "data": "비�?번호가 초기?�되?�습?�다."
   * }
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Post('password-init')
  async initPassword(
    @Body() data: { userId: string },
    @Req() req: RequestWithSession,
  ) {
    console.log('?�� 비�?번호 초기???�청:', data.userId);

    try {
      // ?�재 로그?�한 ?�용???�션 ?�보 ?�인
      if (!req.session.user) {
        return {
          success: false,
          message: '로그?�이 ?�요?�니??',
        };
      }

      const currentUser = req.session.user;
      console.log(
        '?�� ?�재 로그???�용??',
        currentUser.empNo || currentUser.userId,
      );

      // 관리자 권한 ?�인 (권한코드 A ?�는 ?�정 ??��)
      const isAdmin =
        currentUser.authCd === 'A' ||
        currentUser.usrRoleId === 'A250715005' ||
        currentUser.usrRoleId === 'A250715001';

      if (!isAdmin) {
        return {
          success: false,
          message: '비�?번호 초기??권한???�습?�다.',
        };
      }

      const result = await this.usrService.initPassword(data.userId);
      console.log('??비�?번호 초기???�공:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('??비�?번호 초기???�패:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?�인결재??검??(GET)
   *
   * @description
   * - ?�인결재?��? ?�용?�명?�로 검?�합?�다.
   * - USR_01_0201_S ?�로?��?�??�출?�여 ?�인결재??목록??조회?�니??
   * - ?�용?�명?�로 부�?검?�이 가?�합?�다.
   * - 최�? 100개까지 조회 가?�합?�다.
   *
   * @param approverNm - ?�인결재?�명 (쿼리 ?�라미터, 부�?검??
   * @returns { success: boolean, data?: UserData[], message?: string }
   * @example
   * GET /api/usr/approver-search?approverNm=?�길??
   * Response: {
   *   "success": true,
   *   "data": [{ "empNo": "E001", "empNm": "?�길??, "authCd": "10" }]
   * }
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Get('approver-search')
  async searchApprover(@Query('approverNm') approverNm: string) {
    console.log('?�� ?�인결재??검???�청:', approverNm);

    try {
      const result = await this.usrService.searchApprover(approverNm);
      console.log('???�인결재??검???�공:', result.length + '�?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???�인결재??검???�패:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?�용????�� 목록 조회 (GET)
   *
   * @description
   * - ?�용?��?가 'Y'???�용????�� 목록??조회?�니??
   * - ??���??�으�??�렬?�여 반환?�니??
   * - ?�용??관�??�면?�서 ?�용?�역??콤보박스?�으�??�용?�니??
   *
   * @returns { success: boolean, data?: TblUserRole[], message?: string }
   * @example
   * GET /api/usr/roles
   * Response: {
   *   "success": true,
   *   "data": [{ "usrRoleId": "A250715001", "usrRoleNm": "?�반?�용?? }]
   * }
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Get('roles')
  async getUserRoles() {
    console.log('?�� ?�용????�� 목록 조회 ?�청');

    try {
      const result = await this.usrService.getUserRoles();
      console.log('???�용????�� 목록 조회 ?�공:', result.length + '�?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???�용????�� 목록 조회 ?�패:', error);
      return { success: false, message: (error as Error).message };
    }
  }
}


