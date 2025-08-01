/**
 * UsrController - ?¬ì©??ê´ë¦?API ì»¨í¸ë¡¤ë¬
 *
 * ì£¼ì ê¸°ë¥:
 * - ?¬ì©??ëª©ë¡ ì¡°í ë°?ê²??
 * - ?¬ì©???ë³´ ???(? ê·/?ì )
 * - ?¬ì©???ë¬´ê¶í ê´ë¦?
 * - ë¹ë?ë²í¸ ì´ê¸°??
 * - ?¹ì¸ê²°ì¬??ê²??
 * - ?¬ì©????  ê´ë¦?
 *
 * API ?ë?¬ì¸??
 * - GET /api/usr/list - ?¬ì©??ëª©ë¡ ì¡°í
 * - GET /api/usr/work-auth/:userId - ?¬ì©???ë¬´ê¶í ì¡°í
 * - POST /api/usr/save - ?¬ì©???ë³´ ???
 * - POST /api/usr/password-init - ë¹ë?ë²í¸ ì´ê¸°??
 * - GET /api/usr/approver-search - ?¹ì¸ê²°ì¬??ê²??
 * - GET /api/usr/roles - ?¬ì©????  ëª©ë¡ ì¡°í
 *
 * ?°ê? ?ë¹??
 * - UsrService: ?¬ì©??ê´ë¦?ë¹ì¦?ì¤ ë¡ì§
 *
 * ?¬ì© ?ë©´:
 * - USR2010M00: ?¬ì©??ê´ë¦??ë©´
 */
import { Controller, Get, Post, Body, Query, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import session from 'express-session';
import { UsrService } from './USR2010M00.service';

// express-session ????ì¥
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Controller('usr')
export class UsrController {
  constructor(private readonly usrService: UsrService) {}

  /**
   * ?¬ì©??ëª©ë¡ ì¡°í (GET)
   *
   * @description
   * - ë³¸ë?, ë¶?? ?¬ì©?ëª ì¡°ê±´?¼ë¡ ?¬ì©??ëª©ë¡??ì¡°í?©ë??
   * - TypeORM ì¿¼ë¦¬ë¥??¬ì©?ì¬ ë³µì¡??JOIN?¼ë¡ ?¬ì©???ë³´? ê¶í ?ë³´ë¥??¨ê» ì¡°í?©ë??
   * - ê²??ì¡°ê±´???ì¼ë©??ì²´ ?¬ì©?ë? ì¡°í?©ë??
   *
   * @param hqDiv - ë³¸ë?êµ¬ë¶ì½ë (ì¿¼ë¦¬ ?ë¼ë¯¸í°, ALL=?ì²´)
   * @param deptDiv - ë¶?êµ¬ë¶ì½??(ì¿¼ë¦¬ ?ë¼ë¯¸í°, ALL=?ì²´)
   * @param userNm - ?¬ì©?ëª (ì¿¼ë¦¬ ?ë¼ë¯¸í°, ë¶ë¶?ê²??
   * @returns { success: boolean, data?: UserData[], message?: string }
   * @example
   * GET /api/usr/list?hqDiv=1000&deptDiv=1100&userNm=?ê¸¸??
   * Response: {
   *   "success": true,
   *   "data": [{ "empNo": "E001", "empNm": "?ê¸¸??, "hqDivNm": "?ì??¸ì?ë³¸ë¶" }]
   * }
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Get('list')
  async getUserList(
    @Query('hqDiv') hqDiv?: string,
    @Query('deptDiv') deptDiv?: string,
    @Query('userNm') userNm?: string,
  ) {
    console.log('? ?¬ì©??ëª©ë¡ ì¡°í ?ì²­:', { hqDiv, deptDiv, userNm });

    try {
      const result = await this.usrService.getUserList(hqDiv, deptDiv, userNm);
      console.log('???¬ì©??ëª©ë¡ ì¡°í ?±ê³µ:', result.length + 'ê±?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???¬ì©??ëª©ë¡ ì¡°í ?¤í¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?¬ì©???ë¬´ê¶í ëª©ë¡ ì¡°í (GET)
   *
   * @description
   * - ?¹ì  ?¬ì©?ì ?ë¬´ê¶í ëª©ë¡??ì¡°í?©ë??
   * - USR_01_0202_S ?ë¡?ì?ë¥??¸ì¶?ì¬ ?ë¬´ë³??¬ì©ê¶í ?ë³´ë¥?ê°?¸ìµ?ë¤.
   * - ?ë¬´êµ¬ë¶ì½ë, ?ë¬´êµ¬ë¶ëª? ?¬ì©ê¶í?¬ë? ?±ì ë°í?©ë??
   *
   * @param userId - ?¬ì©??ID (ê²½ë¡ ?ë¼ë¯¸í°, ?¬ë²)
   * @returns { success: boolean, data?: WorkAuthData[], message?: string }
   * @example
   * GET /api/usr/work-auth/E001
   * Response: {
   *   "success": true,
   *   "data": [{ "smlCsfCd": "01", "smlCsfNm": "?¬ìê´ë¦?, "wrkUseYn": "1" }]
   * }
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Get('work-auth/:userId')
  async getWorkAuthList(@Param('userId') userId: string) {
    console.log('? ?¬ì©???ë¬´ê¶í ëª©ë¡ ì¡°í ?ì²­:', userId);

    try {
      const result = await this.usrService.getWorkAuthList(userId);
      console.log('???¬ì©???ë¬´ê¶í ëª©ë¡ ì¡°í ?±ê³µ:', result.length + 'ê±?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???¬ì©???ë¬´ê¶í ëª©ë¡ ì¡°í ?¤í¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?¬ì©???ë³´ ???(POST)
   *
   * @description
   * - ?¬ì©???ë³´ë¥?? ê· ?ì±?ê±°???ì ?©ë??
   * - USR_01_0204_T ?ë¡?ì?ë¥??¸ì¶?ì¬ ?¬ì©???ë³´? ?ë¬´ê¶í???¨ê» ??¥í©?ë¤.
   * - ?¸ë?????¬ì©?ì¬ ?ì ?ê² ì²ë¦¬?©ë??
   * - ?¬ì©?ì­??USR_ROLE_ID) ?ë³´???¨ê» ??¥ë©?ë¤.
   * - ?ì¬ ë¡ê·¸?¸í ?¬ì©?ì ?¸ì ?ë³´ë¥??ì©?ì¬ ?±ë¡??ë³ê²½ì ?ë³´ë¥??¤ì ?©ë??
   *
   * @param userData - ??¥í  ?¬ì©???ë³´ (?ì²­ ë³¸ë¬¸)
   * @param req - Express ?ì²­ ê°ì²´ (?¸ì ?ë³´ ?¬í¨)
   * @returns { success: boolean, data?: string, message?: string }
   * @example
   * POST /api/usr/save
   * Body: {
   *   "empNo": "E001",
   *   "empNm": "?ê¸¸??,
   *   "hqDivCd": "1000",
   *   "deptDivCd": "1100",
   *   "workAuthList": [{ "smlCsfCd": "01", "wrkUseYn": "1" }]
   * }
   * Response: {
   *   "success": true,
   *   "data": "??¥ë?ìµ?ë¤."
   * }
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Post('save')
  async saveUser(@Body() userData: any, @Req() req: RequestWithSession) {
    console.log('?¾ ?¬ì©???ë³´ ????ì²­:', userData);

    try {
      // ?ì¬ ë¡ê·¸?¸í ?¬ì©???¸ì ?ë³´ ?ì¸
      if (!req.session.user) {
        return {
          success: false,
          message: 'ë¡ê·¸?¸ì´ ?ì?©ë??',
        };
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('? ?ì¬ ë¡ê·¸???¬ì©??', currentUserId);

      const result = await this.usrService.saveUser(userData, currentUserId);
      console.log('???¬ì©???ë³´ ????±ê³µ:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('???¬ì©???ë³´ ????¤í¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ë¹ë?ë²í¸ ì´ê¸°??(POST)
   *
   * @description
   * - ?¬ì©?ì ë¹ë?ë²í¸ë¥??¬ì©?ID(?¬ë²)ë¡?ì´ê¸°?í©?ë¤ (ê¸°ì¡´ Flex ë°©ìê³??ì¼).
   * - MD5 ?´ìë¥??¬ì©?ì¬ ë¹ë?ë²í¸ë¥??í¸?í©?ë¤.
   * - ë¹ë?ë²í¸ ë³ê²½ì¼?ë? ?ì¬ ?ê°?¼ë¡ ?¤ì ?©ë??
   * - ?ì¬ ë¡ê·¸?¸í ?¬ì©?ì ?¸ì ?ë³´ë¥??ì¸?ì¬ ê¶í??ê²ì¦í©?ë¤.
   *
   * @param data - ë¹ë?ë²í¸ ì´ê¸°?í  ?¬ì©???ë³´ (?ì²­ ë³¸ë¬¸)
   * @param data.userId - ?¬ì©??ID (?¬ë²)
   * @param req - Express ?ì²­ ê°ì²´ (?¸ì ?ë³´ ?¬í¨)
   * @returns { success: boolean, data?: string, message?: string }
   * @example
   * POST /api/usr/password-init
   * Body: { "userId": "E001" }
   * Response: {
   *   "success": true,
   *   "data": "ë¹ë?ë²í¸ê° ì´ê¸°?ë?ìµ?ë¤."
   * }
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Post('password-init')
  async initPassword(
    @Body() data: { userId: string },
    @Req() req: RequestWithSession,
  ) {
    console.log('? ë¹ë?ë²í¸ ì´ê¸°???ì²­:', data.userId);

    try {
      // ?ì¬ ë¡ê·¸?¸í ?¬ì©???¸ì ?ë³´ ?ì¸
      if (!req.session.user) {
        return {
          success: false,
          message: 'ë¡ê·¸?¸ì´ ?ì?©ë??',
        };
      }

      const currentUser = req.session.user;
      console.log(
        '? ?ì¬ ë¡ê·¸???¬ì©??',
        currentUser.empNo || currentUser.userId,
      );

      // ê´ë¦¬ì ê¶í ?ì¸ (ê¶íì½ë A ?ë ?¹ì  ?? )
      const isAdmin =
        currentUser.authCd === 'A' ||
        currentUser.usrRoleId === 'A250715005' ||
        currentUser.usrRoleId === 'A250715001';

      if (!isAdmin) {
        return {
          success: false,
          message: 'ë¹ë?ë²í¸ ì´ê¸°??ê¶í???ìµ?ë¤.',
        };
      }

      const result = await this.usrService.initPassword(data.userId);
      console.log('??ë¹ë?ë²í¸ ì´ê¸°???±ê³µ:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('??ë¹ë?ë²í¸ ì´ê¸°???¤í¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?¹ì¸ê²°ì¬??ê²??(GET)
   *
   * @description
   * - ?¹ì¸ê²°ì¬?ë? ?¬ì©?ëª?¼ë¡ ê²?í©?ë¤.
   * - USR_01_0201_S ?ë¡?ì?ë¥??¸ì¶?ì¬ ?¹ì¸ê²°ì¬??ëª©ë¡??ì¡°í?©ë??
   * - ?¬ì©?ëª?¼ë¡ ë¶ë¶?ê²?ì´ ê°?¥í©?ë¤.
   * - ìµë? 100ê°ê¹ì§ ì¡°í ê°?¥í©?ë¤.
   *
   * @param approverNm - ?¹ì¸ê²°ì¬?ëª (ì¿¼ë¦¬ ?ë¼ë¯¸í°, ë¶ë¶?ê²??
   * @returns { success: boolean, data?: UserData[], message?: string }
   * @example
   * GET /api/usr/approver-search?approverNm=?ê¸¸??
   * Response: {
   *   "success": true,
   *   "data": [{ "empNo": "E001", "empNm": "?ê¸¸??, "authCd": "10" }]
   * }
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Get('approver-search')
  async searchApprover(@Query('approverNm') approverNm: string) {
    console.log('? ?¹ì¸ê²°ì¬??ê²???ì²­:', approverNm);

    try {
      const result = await this.usrService.searchApprover(approverNm);
      console.log('???¹ì¸ê²°ì¬??ê²???±ê³µ:', result.length + 'ê±?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???¹ì¸ê²°ì¬??ê²???¤í¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?¬ì©????  ëª©ë¡ ì¡°í (GET)
   *
   * @description
   * - ?¬ì©?¬ë?ê° 'Y'???¬ì©????  ëª©ë¡??ì¡°í?©ë??
   * - ?? ëª??ì¼ë¡??ë ¬?ì¬ ë°í?©ë??
   * - ?¬ì©??ê´ë¦??ë©´?ì ?¬ì©?ì­??ì½¤ë³´ë°ì¤?©ì¼ë¡??¬ì©?©ë??
   *
   * @returns { success: boolean, data?: TblUserRole[], message?: string }
   * @example
   * GET /api/usr/roles
   * Response: {
   *   "success": true,
   *   "data": [{ "usrRoleId": "A250715001", "usrRoleNm": "?¼ë°?¬ì©?? }]
   * }
   *
   * @throws Error - ?ë¹???¸ì¶ ?¤í¨ ??
   */
  @Get('roles')
  async getUserRoles() {
    console.log('? ?¬ì©????  ëª©ë¡ ì¡°í ?ì²­');

    try {
      const result = await this.usrService.getUserRoles();
      console.log('???¬ì©????  ëª©ë¡ ì¡°í ?±ê³µ:', result.length + 'ê±?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???¬ì©????  ëª©ë¡ ì¡°í ?¤í¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }
}


