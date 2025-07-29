/**
 * SysController - 사용자 역할 관리 API 컨트롤러
 *
 * 주요 기능:
 * - 사용자 역할 목록 조회 및 관리
 * - 프로그램 그룹별 사용자 역할 연결 관리
 * - 메뉴 정보 조회
 * - 사용자 역할 복사 기능
 *
 * API 엔드포인트:
 * - GET /api/sys/menus - 메뉴 목록 조회
 * - GET /api/sys/user-roles - 사용자 역할 목록 조회
 * - POST /api/sys/user-roles - 사용자 역할 저장
 * - GET /api/sys/user-roles/:usrRoleId/program-groups - 역할별 프로그램 그룹 조회
 * - GET /api/sys/program-groups - 전체 프로그램 그룹 조회
 * - POST /api/sys/user-roles/:usrRoleId/program-groups - 역할별 프로그램 그룹 저장
 * - POST /api/sys/user-roles/:usrRoleId/copy - 사용자 역할 복사
 *
 * 연관 서비스:
 * - SysService: 사용자 역할 관리 비즈니스 로직
 *
 * 사용 화면:
 * - SYS1003M00: 사용자 역할 관리 화면
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import session from 'express-session';
import { UserRoleService } from './SYS1003M00.service';
import { TblUserRole } from '../entities/tbl-user-role.entity';
import { TblUserRolePgmGrp } from '../entities/tbl-user-role-pgm-grp.entity';
import { Response } from 'express';

// express-session 타입 확장
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

/**
 * 사용자 역할 저장용 페이로드 인터페이스
 *
 * @description
 * - createdRows: 신규 생성할 사용자 역할 목록
 * - updatedRows: 수정할 사용자 역할 목록
 * - deletedRows: 삭제할 사용자 역할 목록
 */
interface SaveUserRolesPayload {
  createdRows: TblUserRole[];
  updatedRows: TblUserRole[];
  deletedRows: TblUserRole[];
}

@Controller('sys/user-roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  /**
   * 메뉴 목록 조회 (GET)
   *
   * @description
   * - 사용여부가 'Y'인 메뉴 목록을 조회합니다.
   * - 메뉴ID 순으로 정렬하여 반환합니다.
   *
   * @returns Promise<TblMenuInf[]> - 메뉴 목록
   * @example
   * GET /api/sys/menus
   * Response: [{ "menuId": "M001", "menuNm": "사용자 관리", "useYn": "Y" }]
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Get('menus')
  async findAllMenus() {
    return this.userRoleService.findAllMenus();
  }

  /**
   * 사용자 역할 목록 조회 (GET)
   *
   * @description
   * - 사용자 역할 목록을 조회합니다.
   * - 검색 조건(usrRoleId, useYn)을 적용할 수 있습니다.
   * - 각 역할별로 해당 역할을 가진 사용자 수도 함께 조회합니다.
   *
   * @param usrRoleId - 사용자 역할 ID (쿼리 파라미터, 부분 검색)
   * @param useYn - 사용여부 (쿼리 파라미터, 'Y'/'N')
   * @param request - Express 요청 객체 (디버깅용)
   * @returns Promise<TblUserRole[]> - 사용자 역할 목록 (사용자 수 포함)
   * @example
   * GET /api/sys/user-roles?usrRoleId=A25&useYn=Y
   * Response: [{ "usrRoleId": "A250715001", "usrRoleNm": "일반사용자", "cnt": 5 }]
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Get('user-roles')
  async findAllUserRoles(
    @Query('usrRoleId') usrRoleId?: string,
    @Query('useYn') useYn?: string,
    @Req() request?: Request,
  ): Promise<TblUserRole[]> {
    console.log('=== 컨트롤러에서 받은 쿼리 파라미터 ===');
    console.log('usrRoleId:', usrRoleId, '타입:', typeof usrRoleId);
    console.log('useYn:', useYn, '타입:', typeof useYn);
    console.log('전체 쿼리 객체:', { usrRoleId, useYn });
    console.log('request.query:', request?.query);
    console.log('request.url:', request?.url);
    return this.userRoleService.findAllUserRoles(usrRoleId, useYn);
  }

  /**
   * 사용자 역할 저장 (POST)
   *
   * @description
   * - 사용자 역할을 신규 생성, 수정, 삭제합니다.
   * - 트랜잭션을 사용하여 안전하게 처리합니다.
   * - 신규 생성 시 @BeforeInsert 데코레이터가 자동으로 usrRoleId를 생성합니다.
   * - 현재 로그인한 사용자의 세션 정보를 활용하여 등록자/변경자 정보를 설정합니다.
   *
   * @param payload - 저장할 사용자 역할 데이터 (요청 본문)
   * @param req - Express 요청 객체 (세션 정보 포함)
   * @param res - Express 응답 객체
   * @returns HTTP 응답
   * @example
   * POST /api/sys/user-roles
   * Body: {
   *   "createdRows": [newRole],
   *   "updatedRows": [updatedRole],
   *   "deletedRows": [deletedRole]
   * }
   * Response: {
   *   "message": "저장되었습니다.",
   *   "savedRoles": [...]
   * }
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Post('user-roles')
  async saveUserRoles(
    @Body() payload: SaveUserRolesPayload,
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // 현재 로그인한 사용자 세션 정보 확인
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: '로그인이 필요합니다.',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('🔍 현재 로그인 사용자:', currentUserId);

      const savedRoles = await this.userRoleService.saveUserRoles(
        payload,
        currentUserId,
      );
      return res.status(HttpStatus.OK).json({
        message: '저장되었습니다.',
        savedRoles: savedRoles,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '저장에 실패했습니다.', error: errorMessage });
    }
  }

  /**
   * 특정 역할의 프로그램 그룹 목록 조회 (GET)
   *
   * @description
   * - 특정 사용자 역할에 연결된 프로그램 그룹 목록을 조회합니다.
   * - 각 프로그램 그룹별로 해당 그룹을 사용하는 사용자 수도 함께 조회합니다.
   *
   * @param usrRoleId - 사용자 역할 ID (경로 파라미터)
   * @returns Promise<TblUserRolePgmGrp[]> - 프로그램 그룹 목록 (사용자 수 포함)
   * @example
   * GET /api/sys/user-roles/A250715001/program-groups
   * Response: [{ "pgmGrpId": "PG001", "pgmGrpNm": "사용자관리", "cnt": 3 }]
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Get('user-roles/:usrRoleId/program-groups')
  async findProgramGroupsByRoleId(
    @Param('usrRoleId') usrRoleId: string,
  ): Promise<TblUserRolePgmGrp[]> {
    return this.userRoleService.findProgramGroupsByRoleId(usrRoleId);
  }

  /**
   * 전체 프로그램 그룹 목록 조회 (GET)
   *
   * @description
   * - 모든 프로그램 그룹 목록을 조회합니다.
   * - 각 프로그램 그룹별로 해당 그룹을 사용하는 사용자 수도 함께 조회합니다.
   * - 신규 사용자 역할 생성 시 프로그램 그룹 선택용으로 사용됩니다.
   *
   * @returns Promise<any[]> - 전체 프로그램 그룹 목록 (사용자 수 포함)
   * @example
   * GET /api/sys/program-groups
   * Response: [{ "pgmGrpId": "PG001", "pgmGrpNm": "사용자관리", "cnt": 5 }]
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Get('program-groups')
  async findAllProgramGroups(): Promise<any[]> {
    return this.userRoleService.findAllProgramGroups();
  }

  /**
   * 특정 역할의 프로그램 그룹 연결 정보 저장 (POST)
   *
   * @description
   * - 특정 사용자 역할에 연결된 프로그램 그룹 정보를 저장합니다.
   * - 기존 연결 정보를 모두 삭제한 후 새로운 연결 정보를 저장합니다.
   * - 트랜잭션을 사용하여 안전하게 처리합니다.
   * - 현재 로그인한 사용자의 세션 정보를 활용하여 등록자/변경자 정보를 설정합니다.
   *
   * @param usrRoleId - 사용자 역할 ID (경로 파라미터)
   * @param pgmGrps - 저장할 프로그램 그룹 연결 정보 목록 (요청 본문)
   * @param req - Express 요청 객체 (세션 정보 포함)
   * @param res - Express 응답 객체
   * @returns HTTP 응답
   * @example
   * POST /api/sys/user-roles/A250715001/program-groups
   * Body: [
   *   { "pgmGrpId": "PG001", "useYn": "Y" },
   *   { "pgmGrpId": "PG002", "useYn": "N" }
   * ]
   * Response: { "message": "프로그램 그룹이 저장되었습니다." }
   *
   * @throws Error - 서비스 호출 실패 시
   */
  @Post('user-roles/:usrRoleId/program-groups')
  async saveProgramGroupsForRole(
    @Param('usrRoleId') usrRoleId: string,
    @Body() pgmGrps: TblUserRolePgmGrp[],
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // 현재 로그인한 사용자 세션 정보 확인
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: '로그인이 필요합니다.',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('🔍 현재 로그인 사용자:', currentUserId);

      await this.userRoleService.saveProgramGroupsForRole(
        usrRoleId,
        pgmGrps,
        currentUserId,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: '프로그램 그룹이 저장되었습니다.' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '저장에 실패했습니다.', error: errorMessage });
    }
  }

  /**
   * 사용자 역할 복사 (POST)
   *
   * @description
   * - 기존 사용자 역할을 복사하여 새로운 역할을 생성합니다.
   * - 새로운 역할 ID는 'A' + YYMMDD + 3자리 순번 형식으로 자동 생성됩니다.
   * - 원본 역할의 프로그램 그룹 연결 정보도 함께 복사됩니다.
   * - 현재 로그인한 사용자의 세션 정보를 활용하여 등록자/변경자 정보를 설정합니다.
   *
   * @param originalRoleId - 복사할 원본 역할 ID (경로 파라미터)
   * @param req - Express 요청 객체 (세션 정보 포함)
   * @param res - Express 응답 객체
   * @returns HTTP 응답
   * @example
   * POST /api/sys/user-roles/A250715001/copy
   * Response: {
   *   "message": "사용자 역할이 복사되었습니다.",
   *   "newRole": { "usrRoleId": "A250715002", "usrRoleNm": "일반사용자_복사본" }
   * }
   *
   * @throws Error - 원본 역할이 없거나 서비스 호출 실패 시
   */
  @Post('user-roles/:usrRoleId/copy')
  async copyUserRole(
    @Param('usrRoleId') originalRoleId: string,
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // 현재 로그인한 사용자 세션 정보 확인
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: '로그인이 필요합니다.',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('🔍 현재 로그인 사용자:', currentUserId);

      const newRole = await this.userRoleService.copyUserRole(
        originalRoleId,
        currentUserId,
      );
      return res.status(HttpStatus.OK).json({
        message: '사용자 역할이 복사되었습니다.',
        newRole: newRole,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '역할 복사에 실패했습니다.', error: errorMessage });
    }
  }
}
