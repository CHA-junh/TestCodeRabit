/**
 * SysController - ?¬ìš©????•  ê´€ë¦?API ì»¨íŠ¸ë¡¤ëŸ¬
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ ë°?ê´€ë¦?
 * - ?„ë¡œê·¸ë¨ ê·¸ë£¹ë³??¬ìš©????•  ?°ê²° ê´€ë¦?
 * - ë©”ë‰´ ?•ë³´ ì¡°íšŒ
 * - ?¬ìš©????•  ë³µì‚¬ ê¸°ëŠ¥
 *
 * API ?”ë“œ?¬ì¸??
 * - GET /api/sys/menus - ë©”ë‰´ ëª©ë¡ ì¡°íšŒ
 * - GET /api/sys/user-roles - ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ
 * - POST /api/sys/user-roles - ?¬ìš©????•  ?€??
 * - GET /api/sys/user-roles/:usrRoleId/program-groups - ??• ë³??„ë¡œê·¸ë¨ ê·¸ë£¹ ì¡°íšŒ
 * - GET /api/sys/program-groups - ?„ì²´ ?„ë¡œê·¸ë¨ ê·¸ë£¹ ì¡°íšŒ
 * - POST /api/sys/user-roles/:usrRoleId/program-groups - ??• ë³??„ë¡œê·¸ë¨ ê·¸ë£¹ ?€??
 * - POST /api/sys/user-roles/:usrRoleId/copy - ?¬ìš©????•  ë³µì‚¬
 *
 * ?°ê? ?œë¹„??
 * - SysService: ?¬ìš©????•  ê´€ë¦?ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 *
 * ?¬ìš© ?”ë©´:
 * - SYS1003M00: ?¬ìš©????•  ê´€ë¦??”ë©´
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

// express-session ?€???•ì¥
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

/**
 * ?¬ìš©????•  ?€?¥ìš© ?˜ì´ë¡œë“œ ?¸í„°?˜ì´??
 *
 * @description
 * - createdRows: ? ê·œ ?ì„±???¬ìš©????•  ëª©ë¡
 * - updatedRows: ?˜ì •???¬ìš©????•  ëª©ë¡
 * - deletedRows: ?? œ???¬ìš©????•  ëª©ë¡
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
   * ë©”ë‰´ ëª©ë¡ ì¡°íšŒ (GET)
   *
   * @description
   * - ?¬ìš©?¬ë?ê°€ 'Y'??ë©”ë‰´ ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - ë©”ë‰´ID ?œìœ¼ë¡??•ë ¬?˜ì—¬ ë°˜í™˜?©ë‹ˆ??
   *
   * @returns Promise<TblMenuInf[]> - ë©”ë‰´ ëª©ë¡
   * @example
   * GET /api/sys/menus
   * Response: [{ "menuId": "M001", "menuNm": "?¬ìš©??ê´€ë¦?, "useYn": "Y" }]
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Get('menus')
  async findAllMenus() {
    return this.userRoleService.findAllMenus();
  }

  /**
   * ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ (GET)
   *
   * @description
   * - ?¬ìš©????•  ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - ê²€??ì¡°ê±´(usrRoleId, useYn)???ìš©?????ˆìŠµ?ˆë‹¤.
   * - ê°???• ë³„ë¡œ ?´ë‹¹ ??• ??ê°€ì§??¬ìš©???˜ë„ ?¨ê»˜ ì¡°íšŒ?©ë‹ˆ??
   *
   * @param usrRoleId - ?¬ìš©????•  ID (ì¿¼ë¦¬ ?Œë¼ë¯¸í„°, ë¶€ë¶?ê²€??
   * @param useYn - ?¬ìš©?¬ë? (ì¿¼ë¦¬ ?Œë¼ë¯¸í„°, 'Y'/'N')
   * @param request - Express ?”ì²­ ê°ì²´ (?”ë²„ê¹…ìš©)
   * @returns Promise<TblUserRole[]> - ?¬ìš©????•  ëª©ë¡ (?¬ìš©?????¬í•¨)
   * @example
   * GET /api/sys/user-roles?usrRoleId=A25&useYn=Y
   * Response: [{ "usrRoleId": "A250715001", "usrRoleNm": "?¼ë°˜?¬ìš©??, "cnt": 5 }]
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Get('user-roles')
  async findAllUserRoles(
    @Query('usrRoleId') usrRoleId?: string,
    @Query('useYn') useYn?: string,
    @Req() request?: Request,
  ): Promise<TblUserRole[]> {
    console.log('=== ì»¨íŠ¸ë¡¤ëŸ¬?ì„œ ë°›ì? ì¿¼ë¦¬ ?Œë¼ë¯¸í„° ===');
    console.log('usrRoleId:', usrRoleId, '?€??', typeof usrRoleId);
    console.log('useYn:', useYn, '?€??', typeof useYn);
    console.log('?„ì²´ ì¿¼ë¦¬ ê°ì²´:', { usrRoleId, useYn });
    console.log('request.query:', request?.query);
    console.log('request.url:', request?.url);
    return this.userRoleService.findAllUserRoles(usrRoleId, useYn);
  }

  /**
   * ?¬ìš©????•  ?€??(POST)
   *
   * @description
   * - ?¬ìš©????• ??? ê·œ ?ì„±, ?˜ì •, ?? œ?©ë‹ˆ??
   * - ?¸ëœ??…˜???¬ìš©?˜ì—¬ ?ˆì „?˜ê²Œ ì²˜ë¦¬?©ë‹ˆ??
   * - ? ê·œ ?ì„± ??@BeforeInsert ?°ì½”?ˆì´?°ê? ?ë™?¼ë¡œ usrRoleIdë¥??ì„±?©ë‹ˆ??
   * - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©?ì˜ ?¸ì…˜ ?•ë³´ë¥??œìš©?˜ì—¬ ?±ë¡??ë³€ê²½ì ?•ë³´ë¥??¤ì •?©ë‹ˆ??
   *
   * @param payload - ?€?¥í•  ?¬ìš©????•  ?°ì´??(?”ì²­ ë³¸ë¬¸)
   * @param req - Express ?”ì²­ ê°ì²´ (?¸ì…˜ ?•ë³´ ?¬í•¨)
   * @param res - Express ?‘ë‹µ ê°ì²´
   * @returns HTTP ?‘ë‹µ
   * @example
   * POST /api/sys/user-roles
   * Body: {
   *   "createdRows": [newRole],
   *   "updatedRows": [updatedRole],
   *   "deletedRows": [deletedRole]
   * }
   * Response: {
   *   "message": "?€?¥ë˜?ˆìŠµ?ˆë‹¤.",
   *   "savedRoles": [...]
   * }
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Post('user-roles')
  async saveUserRoles(
    @Body() payload: SaveUserRolesPayload,
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©???¸ì…˜ ?•ë³´ ?•ì¸
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'ë¡œê·¸?¸ì´ ?„ìš”?©ë‹ˆ??',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('?” ?„ì¬ ë¡œê·¸???¬ìš©??', currentUserId);

      const savedRoles = await this.userRoleService.saveUserRoles(
        payload,
        currentUserId,
      );
      return res.status(HttpStatus.OK).json({
        message: '?€?¥ë˜?ˆìŠµ?ˆë‹¤.',
        savedRoles: savedRoles,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.', error: errorMessage });
    }
  }

  /**
   * ?¹ì • ??• ???„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ ì¡°íšŒ (GET)
   *
   * @description
   * - ?¹ì • ?¬ìš©????• ???°ê²°???„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - ê°??„ë¡œê·¸ë¨ ê·¸ë£¹ë³„ë¡œ ?´ë‹¹ ê·¸ë£¹???¬ìš©?˜ëŠ” ?¬ìš©???˜ë„ ?¨ê»˜ ì¡°íšŒ?©ë‹ˆ??
   *
   * @param usrRoleId - ?¬ìš©????•  ID (ê²½ë¡œ ?Œë¼ë¯¸í„°)
   * @returns Promise<TblUserRolePgmGrp[]> - ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ (?¬ìš©?????¬í•¨)
   * @example
   * GET /api/sys/user-roles/A250715001/program-groups
   * Response: [{ "pgmGrpId": "PG001", "pgmGrpNm": "?¬ìš©?ê?ë¦?, "cnt": 3 }]
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Get('user-roles/:usrRoleId/program-groups')
  async findProgramGroupsByRoleId(
    @Param('usrRoleId') usrRoleId: string,
  ): Promise<TblUserRolePgmGrp[]> {
    return this.userRoleService.findProgramGroupsByRoleId(usrRoleId);
  }

  /**
   * ?„ì²´ ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ ì¡°íšŒ (GET)
   *
   * @description
   * - ëª¨ë“  ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - ê°??„ë¡œê·¸ë¨ ê·¸ë£¹ë³„ë¡œ ?´ë‹¹ ê·¸ë£¹???¬ìš©?˜ëŠ” ?¬ìš©???˜ë„ ?¨ê»˜ ì¡°íšŒ?©ë‹ˆ??
   * - ? ê·œ ?¬ìš©????•  ?ì„± ???„ë¡œê·¸ë¨ ê·¸ë£¹ ? íƒ?©ìœ¼ë¡??¬ìš©?©ë‹ˆ??
   *
   * @returns Promise<any[]> - ?„ì²´ ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ (?¬ìš©?????¬í•¨)
   * @example
   * GET /api/sys/program-groups
   * Response: [{ "pgmGrpId": "PG001", "pgmGrpNm": "?¬ìš©?ê?ë¦?, "cnt": 5 }]
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Get('program-groups')
  async findAllProgramGroups(): Promise<any[]> {
    return this.userRoleService.findAllProgramGroups();
  }

  /**
   * ?¹ì • ??• ???„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²° ?•ë³´ ?€??(POST)
   *
   * @description
   * - ?¹ì • ?¬ìš©????• ???°ê²°???„ë¡œê·¸ë¨ ê·¸ë£¹ ?•ë³´ë¥??€?¥í•©?ˆë‹¤.
   * - ê¸°ì¡´ ?°ê²° ?•ë³´ë¥?ëª¨ë‘ ?? œ?????ˆë¡œ???°ê²° ?•ë³´ë¥??€?¥í•©?ˆë‹¤.
   * - ?¸ëœ??…˜???¬ìš©?˜ì—¬ ?ˆì „?˜ê²Œ ì²˜ë¦¬?©ë‹ˆ??
   * - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©?ì˜ ?¸ì…˜ ?•ë³´ë¥??œìš©?˜ì—¬ ?±ë¡??ë³€ê²½ì ?•ë³´ë¥??¤ì •?©ë‹ˆ??
   *
   * @param usrRoleId - ?¬ìš©????•  ID (ê²½ë¡œ ?Œë¼ë¯¸í„°)
   * @param pgmGrps - ?€?¥í•  ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²° ?•ë³´ ëª©ë¡ (?”ì²­ ë³¸ë¬¸)
   * @param req - Express ?”ì²­ ê°ì²´ (?¸ì…˜ ?•ë³´ ?¬í•¨)
   * @param res - Express ?‘ë‹µ ê°ì²´
   * @returns HTTP ?‘ë‹µ
   * @example
   * POST /api/sys/user-roles/A250715001/program-groups
   * Body: [
   *   { "pgmGrpId": "PG001", "useYn": "Y" },
   *   { "pgmGrpId": "PG002", "useYn": "N" }
   * ]
   * Response: { "message": "?„ë¡œê·¸ë¨ ê·¸ë£¹???€?¥ë˜?ˆìŠµ?ˆë‹¤." }
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Post('user-roles/:usrRoleId/program-groups')
  async saveProgramGroupsForRole(
    @Param('usrRoleId') usrRoleId: string,
    @Body() pgmGrps: TblUserRolePgmGrp[],
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©???¸ì…˜ ?•ë³´ ?•ì¸
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'ë¡œê·¸?¸ì´ ?„ìš”?©ë‹ˆ??',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('?” ?„ì¬ ë¡œê·¸???¬ìš©??', currentUserId);

      await this.userRoleService.saveProgramGroupsForRole(
        usrRoleId,
        pgmGrps,
        currentUserId,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: '?„ë¡œê·¸ë¨ ê·¸ë£¹???€?¥ë˜?ˆìŠµ?ˆë‹¤.' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.', error: errorMessage });
    }
  }

  /**
   * ?¬ìš©????•  ë³µì‚¬ (POST)
   *
   * @description
   * - ê¸°ì¡´ ?¬ìš©????• ??ë³µì‚¬?˜ì—¬ ?ˆë¡œ????• ???ì„±?©ë‹ˆ??
   * - ?ˆë¡œ????•  ID??'A' + YYMMDD + 3?ë¦¬ ?œë²ˆ ?•ì‹?¼ë¡œ ?ë™ ?ì„±?©ë‹ˆ??
   * - ?ë³¸ ??• ???„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²° ?•ë³´???¨ê»˜ ë³µì‚¬?©ë‹ˆ??
   * - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©?ì˜ ?¸ì…˜ ?•ë³´ë¥??œìš©?˜ì—¬ ?±ë¡??ë³€ê²½ì ?•ë³´ë¥??¤ì •?©ë‹ˆ??
   *
   * @param originalRoleId - ë³µì‚¬???ë³¸ ??•  ID (ê²½ë¡œ ?Œë¼ë¯¸í„°)
   * @param req - Express ?”ì²­ ê°ì²´ (?¸ì…˜ ?•ë³´ ?¬í•¨)
   * @param res - Express ?‘ë‹µ ê°ì²´
   * @returns HTTP ?‘ë‹µ
   * @example
   * POST /api/sys/user-roles/A250715001/copy
   * Response: {
   *   "message": "?¬ìš©????• ??ë³µì‚¬?˜ì—ˆ?µë‹ˆ??",
   *   "newRole": { "usrRoleId": "A250715002", "usrRoleNm": "?¼ë°˜?¬ìš©??ë³µì‚¬ë³? }
   * }
   *
   * @throws Error - ?ë³¸ ??• ???†ê±°???œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Post('user-roles/:usrRoleId/copy')
  async copyUserRole(
    @Param('usrRoleId') originalRoleId: string,
    @Req() req: RequestWithSession,
    @Res() res: Response,
  ) {
    try {
      // ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©???¸ì…˜ ?•ë³´ ?•ì¸
      if (!req.session.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'ë¡œê·¸?¸ì´ ?„ìš”?©ë‹ˆ??',
        });
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('?” ?„ì¬ ë¡œê·¸???¬ìš©??', currentUserId);

      const newRole = await this.userRoleService.copyUserRole(
        originalRoleId,
        currentUserId,
      );
      return res.status(HttpStatus.OK).json({
        message: '?¬ìš©????• ??ë³µì‚¬?˜ì—ˆ?µë‹ˆ??',
        newRole: newRole,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '??•  ë³µì‚¬???¤íŒ¨?ˆìŠµ?ˆë‹¤.', error: errorMessage });
    }
  }
}


