/**
 * SysController - ?¬ì©????  ê´ë¦?API ì»¨í¸ë¡¤ë¬
 *
 * ì£¼ì ê¸°ë¥:
 * - ?¬ì©????  ëª©ë¡ ì¡°í ë°?ê´ë¦?
 * - ?ë¡ê·¸ë¨ ê·¸ë£¹ë³??¬ì©????  ?°ê²° ê´ë¦?
 * - ë©ë´ ?ë³´ ì¡°í
 * - ?¬ì©????  ë³µì¬ ê¸°ë¥
 *
 * API ?ë?¬ì¸??
 * - GET /api/sys/menus - ë©ë´ ëª©ë¡ ì¡°í
 * - GET /api/sys/user-roles - ?¬ì©????  ëª©ë¡ ì¡°í
 * - POST /api/sys/user-roles - ?¬ì©????  ???
 * - GET /api/sys/user-roles/:usrRoleId/program-groups - ?? ë³??ë¡ê·¸ë¨ ê·¸ë£¹ ì¡°í
 * - GET /api/sys/program-groups - ?ì²´ ?ë¡ê·¸ë¨ ê·¸ë£¹ ì¡°í
 * - POST /api/sys/user-roles/:usrRoleId/program-groups - ?? ë³??ë¡ê·¸ë¨ ê·¸ë£¹ ???
 * - POST /api/sys/user-roles/:usrRoleId/copy - ?¬ì©????  ë³µì¬
 *
 * ?°ê? ?ë¹??
 * - SysService: ?¬ì©????  ê´ë¦?ë¹ì¦?ì¤ ë¡ì§
 *
 * ?¬ì© ?ë©´:
 * - SYS1003M00: ?¬ì©????  ê´ë¦??ë©´
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

// express-session ????ì¥
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

/**
 * ?¬ì©????  ??¥ì© ?ì´ë¡ë ?¸í°?ì´??
 *
 * @description
 * - createdRows: ? ê· ?ì±???¬ì©????  ëª©ë¡
 * - updatedRows: ?ì ???¬ì©????  ëª©ë¡
 * - deletedRows: ?? ???¬ì©????  ëª©ë¡
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
   * ë©ë´ ëª©ë¡ ì¡°í (GET)
   *
   * @description
   * - ?¬ì©?¬ë?ê° 'Y'??ë©ë´ ëª©ë¡??ì¡°í?©ë??
   * - ë©ë´ID ?ì¼ë¡??ë ¬?ì¬ ë°í?©ë??
   *
   * @returns Promise<TblMenuInf[]> - ë©ë´ ëª©ë¡
   * @example
   * GET /api/sys/menus
   * Response: [{ "menuId": "M001", "menuNm": "?¬ì©??ê´ë¦?, "useYn": "Y" }]
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Get('menus')
  async findAllMenus() {
    return this.userRoleService.findAllMenus();
  }

  /**
   * ?¬ì©????  ëª©ë¡ ì¡°í (GET)
   *
   * @description
   * - ?¬ì©????  ëª©ë¡??ì¡°í?©ë??
   * - ê²??ì¡°ê±´(usrRoleId, useYn)???ì©?????ìµ?ë¤.
   * - ê°??? ë³ë¡ ?´ë¹ ?? ??ê°ì§??¬ì©???ë ?¨ê» ì¡°í?©ë??
   *
   * @param usrRoleId - ?¬ì©????  ID (ì¿¼ë¦¬ ?ë¼ë¯¸í°, ë¶ë¶?ê²??
   * @param useYn - ?¬ì©?¬ë? (ì¿¼ë¦¬ ?ë¼ë¯¸í°, 'Y'/'N')
   * @param request - Express ?ì²­ ê°ì²´ (?ë²ê¹ì©)
   * @returns Promise<TblUserRole[]> - ?¬ì©????  ëª©ë¡ (?¬ì©?????¬í¨)
   * @example
   * GET /api/sys/user-roles?usrRoleId=A25&useYn=Y
   * Response: [{ "usrRoleId": "A250715001", "usrRoleNm": "?¼ë°?¬ì©??, "cnt": 5 }]
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Get('user-roles')
  async findAllUserRoles(
    @Query('usrRoleId') usrRoleId?: string,
    @Query('useYn') useYn?: string,
    @Req() request?: Request,
  ): Promise<TblUserRole[]> {
    console.log('=== ì»¨í¸ë¡¤ë¬?ì ë°ì? ì¿¼ë¦¬ ?ë¼ë¯¸í° ===');
    console.log('usrRoleId:', usrRoleId, '???', typeof usrRoleId);
    console.log('useYn:', useYn, '???', typeof useYn);
    console.log('?ì²´ ì¿¼ë¦¬ ê°ì²´:', { usrRoleId, useYn });
    console.log('request.query:', request?.query);
    console.log('request.url:', request?.url);
    return this.userRoleService.findAllUserRoles(usrRoleId, useYn);
  }

  /**
   * ?¬ì©????  ???(POST)
   *
   * @description
   * - ?¬ì©???? ??? ê· ?ì±, ?ì , ?? ?©ë??
   * - ?¸ë?????¬ì©?ì¬ ?ì ?ê² ì²ë¦¬?©ë??
   * - ? ê· ?ì± ??@BeforeInsert ?°ì½?ì´?°ê? ?ë?¼ë¡ usrRoleIdë¥??ì±?©ë??
   * - ?ì¬ ë¡ê·¸?¸í ?¬ì©?ì ?¸ì ?ë³´ë¥??ì©?ì¬ ?±ë¡??ë³ê²½ì ?ë³´ë¥??¤ì ?©ë??
   *
   * @param payload - ??¥í  ?¬ì©????  ?°ì´??(?ì²­ ë³¸ë¬¸)
   * @param req - Express ?ì²­ ê°ì²´ (?¸ì ?ë³´ ?¬í¨)
   * @param res - Express ?ëµ ê°ì²´
   * @returns HTTP ?ëµ
   * @example
   * POST /api/sys/user-roles
   * Body: {
   *   "createdRows": [newRole],
   *   "updatedRows": [updatedRole],
   *   "deletedRows": [deletedRole]
   * }
   * Response: {
   *   "message": "??¥ë?ìµ?ë¤.",
   *   "savedRoles": [...]
   * }
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Post('user-roles')
  async saveUserRoles(
    @Body() payload: SaveUserRolesPayload,
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // ?ì¬ ë¡ê·¸?¸í ?¬ì©???¸ì ?ë³´ ?ì¸
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'ë¡ê·¸?¸ì´ ?ì?©ë??',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('? ?ì¬ ë¡ê·¸???¬ì©??', currentUserId);

      const savedRoles = await this.userRoleService.saveUserRoles(
        payload,
        currentUserId,
      );
      return res.status(HttpStatus.OK).json({
        message: '??¥ë?ìµ?ë¤.',
        savedRoles: savedRoles,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '??¥ì ?¤í¨?ìµ?ë¤.', error: errorMessage });
    }
  }

  /**
   * ?¹ì  ?? ???ë¡ê·¸ë¨ ê·¸ë£¹ ëª©ë¡ ì¡°í (GET)
   *
   * @description
   * - ?¹ì  ?¬ì©???? ???°ê²°???ë¡ê·¸ë¨ ê·¸ë£¹ ëª©ë¡??ì¡°í?©ë??
   * - ê°??ë¡ê·¸ë¨ ê·¸ë£¹ë³ë¡ ?´ë¹ ê·¸ë£¹???¬ì©?ë ?¬ì©???ë ?¨ê» ì¡°í?©ë??
   *
   * @param usrRoleId - ?¬ì©????  ID (ê²½ë¡ ?ë¼ë¯¸í°)
   * @returns Promise<TblUserRolePgmGrp[]> - ?ë¡ê·¸ë¨ ê·¸ë£¹ ëª©ë¡ (?¬ì©?????¬í¨)
   * @example
   * GET /api/sys/user-roles/A250715001/program-groups
   * Response: [{ "pgmGrpId": "PG001", "pgmGrpNm": "?¬ì©?ê?ë¦?, "cnt": 3 }]
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Get('user-roles/:usrRoleId/program-groups')
  async findProgramGroupsByRoleId(
    @Param('usrRoleId') usrRoleId: string,
  ): Promise<TblUserRolePgmGrp[]> {
    return this.userRoleService.findProgramGroupsByRoleId(usrRoleId);
  }

  /**
   * ?ì²´ ?ë¡ê·¸ë¨ ê·¸ë£¹ ëª©ë¡ ì¡°í (GET)
   *
   * @description
   * - ëª¨ë  ?ë¡ê·¸ë¨ ê·¸ë£¹ ëª©ë¡??ì¡°í?©ë??
   * - ê°??ë¡ê·¸ë¨ ê·¸ë£¹ë³ë¡ ?´ë¹ ê·¸ë£¹???¬ì©?ë ?¬ì©???ë ?¨ê» ì¡°í?©ë??
   * - ? ê· ?¬ì©????  ?ì± ???ë¡ê·¸ë¨ ê·¸ë£¹ ? í?©ì¼ë¡??¬ì©?©ë??
   *
   * @returns Promise<any[]> - ?ì²´ ?ë¡ê·¸ë¨ ê·¸ë£¹ ëª©ë¡ (?¬ì©?????¬í¨)
   * @example
   * GET /api/sys/program-groups
   * Response: [{ "pgmGrpId": "PG001", "pgmGrpNm": "?¬ì©?ê?ë¦?, "cnt": 5 }]
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Get('program-groups')
  async findAllProgramGroups(): Promise<any[]> {
    return this.userRoleService.findAllProgramGroups();
  }

  /**
   * ?¹ì  ?? ???ë¡ê·¸ë¨ ê·¸ë£¹ ?°ê²° ?ë³´ ???(POST)
   *
   * @description
   * - ?¹ì  ?¬ì©???? ???°ê²°???ë¡ê·¸ë¨ ê·¸ë£¹ ?ë³´ë¥???¥í©?ë¤.
   * - ê¸°ì¡´ ?°ê²° ?ë³´ë¥?ëª¨ë ?? ?????ë¡???°ê²° ?ë³´ë¥???¥í©?ë¤.
   * - ?¸ë?????¬ì©?ì¬ ?ì ?ê² ì²ë¦¬?©ë??
   * - ?ì¬ ë¡ê·¸?¸í ?¬ì©?ì ?¸ì ?ë³´ë¥??ì©?ì¬ ?±ë¡??ë³ê²½ì ?ë³´ë¥??¤ì ?©ë??
   *
   * @param usrRoleId - ?¬ì©????  ID (ê²½ë¡ ?ë¼ë¯¸í°)
   * @param pgmGrps - ??¥í  ?ë¡ê·¸ë¨ ê·¸ë£¹ ?°ê²° ?ë³´ ëª©ë¡ (?ì²­ ë³¸ë¬¸)
   * @param req - Express ?ì²­ ê°ì²´ (?¸ì ?ë³´ ?¬í¨)
   * @param res - Express ?ëµ ê°ì²´
   * @returns HTTP ?ëµ
   * @example
   * POST /api/sys/user-roles/A250715001/program-groups
   * Body: [
   *   { "pgmGrpId": "PG001", "useYn": "Y" },
   *   { "pgmGrpId": "PG002", "useYn": "N" }
   * ]
   * Response: { "message": "?ë¡ê·¸ë¨ ê·¸ë£¹????¥ë?ìµ?ë¤." }
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Post('user-roles/:usrRoleId/program-groups')
  async saveProgramGroupsForRole(
    @Param('usrRoleId') usrRoleId: string,
    @Body() pgmGrps: TblUserRolePgmGrp[],
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // ?ì¬ ë¡ê·¸?¸í ?¬ì©???¸ì ?ë³´ ?ì¸
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'ë¡ê·¸?¸ì´ ?ì?©ë??',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('? ?ì¬ ë¡ê·¸???¬ì©??', currentUserId);

      await this.userRoleService.saveProgramGroupsForRole(
        usrRoleId,
        pgmGrps,
        currentUserId,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: '?ë¡ê·¸ë¨ ê·¸ë£¹????¥ë?ìµ?ë¤.' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '??¥ì ?¤í¨?ìµ?ë¤.', error: errorMessage });
    }
  }

  /**
   * ?¬ì©????  ë³µì¬ (POST)
   *
   * @description
   * - ê¸°ì¡´ ?¬ì©???? ??ë³µì¬?ì¬ ?ë¡???? ???ì±?©ë??
   * - ?ë¡????  ID??'A' + YYMMDD + 3?ë¦¬ ?ë² ?ì?¼ë¡ ?ë ?ì±?©ë??
   * - ?ë³¸ ?? ???ë¡ê·¸ë¨ ê·¸ë£¹ ?°ê²° ?ë³´???¨ê» ë³µì¬?©ë??
   * - ?ì¬ ë¡ê·¸?¸í ?¬ì©?ì ?¸ì ?ë³´ë¥??ì©?ì¬ ?±ë¡??ë³ê²½ì ?ë³´ë¥??¤ì ?©ë??
   *
   * @param originalRoleId - ë³µì¬???ë³¸ ??  ID (ê²½ë¡ ?ë¼ë¯¸í°)
   * @param req - Express ?ì²­ ê°ì²´ (?¸ì ?ë³´ ?¬í¨)
   * @param res - Express ?ëµ ê°ì²´
   * @returns HTTP ?ëµ
   * @example
   * POST /api/sys/user-roles/A250715001/copy
   * Response: {
   *   "message": "?¬ì©???? ??ë³µì¬?ì?µë??",
   *   "newRole": { "usrRoleId": "A250715002", "usrRoleNm": "?¼ë°?¬ì©??ë³µì¬ë³? }
   * }
   *
   * @throws Error - ?ë³¸ ?? ???ê±°???ë¹???¸ì¶ ?¤í¨ ??
   */
  @Post('user-roles/:usrRoleId/copy')
  async copyUserRole(
    @Param('usrRoleId') originalRoleId: string,
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // ?ì¬ ë¡ê·¸?¸í ?¬ì©???¸ì ?ë³´ ?ì¸
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'ë¡ê·¸?¸ì´ ?ì?©ë??',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('? ?ì¬ ë¡ê·¸???¬ì©??', currentUserId);

      const newRole = await this.userRoleService.copyUserRole(
        originalRoleId,
        currentUserId,
      );
      return res.status(HttpStatus.OK).json({
        message: '?¬ì©???? ??ë³µì¬?ì?µë??',
        newRole: newRole,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '??  ë³µì¬???¤í¨?ìµ?ë¤.', error: errorMessage });
    }
  }
}


