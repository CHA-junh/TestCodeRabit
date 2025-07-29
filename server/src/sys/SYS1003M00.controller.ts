/**
 * SysController - ?�용????�� 관�?API 컨트롤러
 *
 * 주요 기능:
 * - ?�용????�� 목록 조회 �?관�?
 * - ?�로그램 그룹�??�용????�� ?�결 관�?
 * - 메뉴 ?�보 조회
 * - ?�용????�� 복사 기능
 *
 * API ?�드?�인??
 * - GET /api/sys/menus - 메뉴 목록 조회
 * - GET /api/sys/user-roles - ?�용????�� 목록 조회
 * - POST /api/sys/user-roles - ?�용????�� ?�??
 * - GET /api/sys/user-roles/:usrRoleId/program-groups - ??���??�로그램 그룹 조회
 * - GET /api/sys/program-groups - ?�체 ?�로그램 그룹 조회
 * - POST /api/sys/user-roles/:usrRoleId/program-groups - ??���??�로그램 그룹 ?�??
 * - POST /api/sys/user-roles/:usrRoleId/copy - ?�용????�� 복사
 *
 * ?��? ?�비??
 * - SysService: ?�용????�� 관�?비즈?�스 로직
 *
 * ?�용 ?�면:
 * - SYS1003M00: ?�용????�� 관�??�면
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

// express-session ?�???�장
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

/**
 * ?�용????�� ?�?�용 ?�이로드 ?�터?�이??
 *
 * @description
 * - createdRows: ?�규 ?�성???�용????�� 목록
 * - updatedRows: ?�정???�용????�� 목록
 * - deletedRows: ??��???�용????�� 목록
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
   * - ?�용?��?가 'Y'??메뉴 목록??조회?�니??
   * - 메뉴ID ?�으�??�렬?�여 반환?�니??
   *
   * @returns Promise<TblMenuInf[]> - 메뉴 목록
   * @example
   * GET /api/sys/menus
   * Response: [{ "menuId": "M001", "menuNm": "?�용??관�?, "useYn": "Y" }]
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Get('menus')
  async findAllMenus() {
    return this.userRoleService.findAllMenus();
  }

  /**
   * ?�용????�� 목록 조회 (GET)
   *
   * @description
   * - ?�용????�� 목록??조회?�니??
   * - 검??조건(usrRoleId, useYn)???�용?????�습?�다.
   * - �???��별로 ?�당 ??��??가�??�용???�도 ?�께 조회?�니??
   *
   * @param usrRoleId - ?�용????�� ID (쿼리 ?�라미터, 부�?검??
   * @param useYn - ?�용?��? (쿼리 ?�라미터, 'Y'/'N')
   * @param request - Express ?�청 객체 (?�버깅용)
   * @returns Promise<TblUserRole[]> - ?�용????�� 목록 (?�용?????�함)
   * @example
   * GET /api/sys/user-roles?usrRoleId=A25&useYn=Y
   * Response: [{ "usrRoleId": "A250715001", "usrRoleNm": "?�반?�용??, "cnt": 5 }]
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Get('user-roles')
  async findAllUserRoles(
    @Query('usrRoleId') usrRoleId?: string,
    @Query('useYn') useYn?: string,
    @Req() request?: Request,
  ): Promise<TblUserRole[]> {
    console.log('=== 컨트롤러?�서 받�? 쿼리 ?�라미터 ===');
    console.log('usrRoleId:', usrRoleId, '?�??', typeof usrRoleId);
    console.log('useYn:', useYn, '?�??', typeof useYn);
    console.log('?�체 쿼리 객체:', { usrRoleId, useYn });
    console.log('request.query:', request?.query);
    console.log('request.url:', request?.url);
    return this.userRoleService.findAllUserRoles(usrRoleId, useYn);
  }

  /**
   * ?�용????�� ?�??(POST)
   *
   * @description
   * - ?�용????��???�규 ?�성, ?�정, ??��?�니??
   * - ?�랜??��???�용?�여 ?�전?�게 처리?�니??
   * - ?�규 ?�성 ??@BeforeInsert ?�코?�이?��? ?�동?�로 usrRoleId�??�성?�니??
   * - ?�재 로그?�한 ?�용?�의 ?�션 ?�보�??�용?�여 ?�록??변경자 ?�보�??�정?�니??
   *
   * @param payload - ?�?�할 ?�용????�� ?�이??(?�청 본문)
   * @param req - Express ?�청 객체 (?�션 ?�보 ?�함)
   * @param res - Express ?�답 객체
   * @returns HTTP ?�답
   * @example
   * POST /api/sys/user-roles
   * Body: {
   *   "createdRows": [newRole],
   *   "updatedRows": [updatedRole],
   *   "deletedRows": [deletedRole]
   * }
   * Response: {
   *   "message": "?�?�되?�습?�다.",
   *   "savedRoles": [...]
   * }
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Post('user-roles')
  async saveUserRoles(
    @Body() payload: SaveUserRolesPayload,
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // ?�재 로그?�한 ?�용???�션 ?�보 ?�인
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: '로그?�이 ?�요?�니??',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('?�� ?�재 로그???�용??', currentUserId);

      const savedRoles = await this.userRoleService.saveUserRoles(
        payload,
        currentUserId,
      );
      return res.status(HttpStatus.OK).json({
        message: '?�?�되?�습?�다.',
        savedRoles: savedRoles,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '?�?�에 ?�패?�습?�다.', error: errorMessage });
    }
  }

  /**
   * ?�정 ??��???�로그램 그룹 목록 조회 (GET)
   *
   * @description
   * - ?�정 ?�용????��???�결???�로그램 그룹 목록??조회?�니??
   * - �??�로그램 그룹별로 ?�당 그룹???�용?�는 ?�용???�도 ?�께 조회?�니??
   *
   * @param usrRoleId - ?�용????�� ID (경로 ?�라미터)
   * @returns Promise<TblUserRolePgmGrp[]> - ?�로그램 그룹 목록 (?�용?????�함)
   * @example
   * GET /api/sys/user-roles/A250715001/program-groups
   * Response: [{ "pgmGrpId": "PG001", "pgmGrpNm": "?�용?��?�?, "cnt": 3 }]
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Get('user-roles/:usrRoleId/program-groups')
  async findProgramGroupsByRoleId(
    @Param('usrRoleId') usrRoleId: string,
  ): Promise<TblUserRolePgmGrp[]> {
    return this.userRoleService.findProgramGroupsByRoleId(usrRoleId);
  }

  /**
   * ?�체 ?�로그램 그룹 목록 조회 (GET)
   *
   * @description
   * - 모든 ?�로그램 그룹 목록??조회?�니??
   * - �??�로그램 그룹별로 ?�당 그룹???�용?�는 ?�용???�도 ?�께 조회?�니??
   * - ?�규 ?�용????�� ?�성 ???�로그램 그룹 ?�택?�으�??�용?�니??
   *
   * @returns Promise<any[]> - ?�체 ?�로그램 그룹 목록 (?�용?????�함)
   * @example
   * GET /api/sys/program-groups
   * Response: [{ "pgmGrpId": "PG001", "pgmGrpNm": "?�용?��?�?, "cnt": 5 }]
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Get('program-groups')
  async findAllProgramGroups(): Promise<any[]> {
    return this.userRoleService.findAllProgramGroups();
  }

  /**
   * ?�정 ??��???�로그램 그룹 ?�결 ?�보 ?�??(POST)
   *
   * @description
   * - ?�정 ?�용????��???�결???�로그램 그룹 ?�보�??�?�합?�다.
   * - 기존 ?�결 ?�보�?모두 ??��?????�로???�결 ?�보�??�?�합?�다.
   * - ?�랜??��???�용?�여 ?�전?�게 처리?�니??
   * - ?�재 로그?�한 ?�용?�의 ?�션 ?�보�??�용?�여 ?�록??변경자 ?�보�??�정?�니??
   *
   * @param usrRoleId - ?�용????�� ID (경로 ?�라미터)
   * @param pgmGrps - ?�?�할 ?�로그램 그룹 ?�결 ?�보 목록 (?�청 본문)
   * @param req - Express ?�청 객체 (?�션 ?�보 ?�함)
   * @param res - Express ?�답 객체
   * @returns HTTP ?�답
   * @example
   * POST /api/sys/user-roles/A250715001/program-groups
   * Body: [
   *   { "pgmGrpId": "PG001", "useYn": "Y" },
   *   { "pgmGrpId": "PG002", "useYn": "N" }
   * ]
   * Response: { "message": "?�로그램 그룹???�?�되?�습?�다." }
   *
   * @throws Error - ?�비???�출 ?�패 ??
   */
  @Post('user-roles/:usrRoleId/program-groups')
  async saveProgramGroupsForRole(
    @Param('usrRoleId') usrRoleId: string,
    @Body() pgmGrps: TblUserRolePgmGrp[],
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // ?�재 로그?�한 ?�용???�션 ?�보 ?�인
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: '로그?�이 ?�요?�니??',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('?�� ?�재 로그???�용??', currentUserId);

      await this.userRoleService.saveProgramGroupsForRole(
        usrRoleId,
        pgmGrps,
        currentUserId,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: '?�로그램 그룹???�?�되?�습?�다.' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '?�?�에 ?�패?�습?�다.', error: errorMessage });
    }
  }

  /**
   * ?�용????�� 복사 (POST)
   *
   * @description
   * - 기존 ?�용????��??복사?�여 ?�로????��???�성?�니??
   * - ?�로????�� ID??'A' + YYMMDD + 3?�리 ?�번 ?�식?�로 ?�동 ?�성?�니??
   * - ?�본 ??��???�로그램 그룹 ?�결 ?�보???�께 복사?�니??
   * - ?�재 로그?�한 ?�용?�의 ?�션 ?�보�??�용?�여 ?�록??변경자 ?�보�??�정?�니??
   *
   * @param originalRoleId - 복사???�본 ??�� ID (경로 ?�라미터)
   * @param req - Express ?�청 객체 (?�션 ?�보 ?�함)
   * @param res - Express ?�답 객체
   * @returns HTTP ?�답
   * @example
   * POST /api/sys/user-roles/A250715001/copy
   * Response: {
   *   "message": "?�용????��??복사?�었?�니??",
   *   "newRole": { "usrRoleId": "A250715002", "usrRoleNm": "?�반?�용??복사�? }
   * }
   *
   * @throws Error - ?�본 ??��???�거???�비???�출 ?�패 ??
   */
  @Post('user-roles/:usrRoleId/copy')
  async copyUserRole(
    @Param('usrRoleId') originalRoleId: string,
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // ?�재 로그?�한 ?�용???�션 ?�보 ?�인
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: '로그?�이 ?�요?�니??',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('?�� ?�재 로그???�용??', currentUserId);

      const newRole = await this.userRoleService.copyUserRole(
        originalRoleId,
        currentUserId,
      );
      return res.status(HttpStatus.OK).json({
        message: '?�용????��??복사?�었?�니??',
        newRole: newRole,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '??�� 복사???�패?�습?�다.', error: errorMessage });
    }
  }
}


