/**
 * UsrController - ?¬ìš©??ê´€ë¦?API ì»¨íŠ¸ë¡¤ëŸ¬
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ìš©??ëª©ë¡ ì¡°íšŒ ë°?ê²€??
 * - ?¬ìš©???•ë³´ ?€??(? ê·œ/?˜ì •)
 * - ?¬ìš©???…ë¬´ê¶Œí•œ ê´€ë¦?
 * - ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
 * - ?¹ì¸ê²°ì¬??ê²€??
 * - ?¬ìš©????•  ê´€ë¦?
 *
 * API ?”ë“œ?¬ì¸??
 * - GET /api/usr/list - ?¬ìš©??ëª©ë¡ ì¡°íšŒ
 * - GET /api/usr/work-auth/:userId - ?¬ìš©???…ë¬´ê¶Œí•œ ì¡°íšŒ
 * - POST /api/usr/save - ?¬ìš©???•ë³´ ?€??
 * - POST /api/usr/password-init - ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
 * - GET /api/usr/approver-search - ?¹ì¸ê²°ì¬??ê²€??
 * - GET /api/usr/roles - ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ
 *
 * ?°ê? ?œë¹„??
 * - UsrService: ?¬ìš©??ê´€ë¦?ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 *
 * ?¬ìš© ?”ë©´:
 * - USR2010M00: ?¬ìš©??ê´€ë¦??”ë©´
 */
import { Controller, Get, Post, Body, Query, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import session from 'express-session';
import { UsrService } from './USR2010M00.service';

// express-session ?€???•ì¥
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Controller('usr')
export class UsrController {
  constructor(private readonly usrService: UsrService) {}

  /**
   * ?¬ìš©??ëª©ë¡ ì¡°íšŒ (GET)
   *
   * @description
   * - ë³¸ë?, ë¶€?? ?¬ìš©?ëª… ì¡°ê±´?¼ë¡œ ?¬ìš©??ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - TypeORM ì¿¼ë¦¬ë¥??¬ìš©?˜ì—¬ ë³µì¡??JOIN?¼ë¡œ ?¬ìš©???•ë³´?€ ê¶Œí•œ ?•ë³´ë¥??¨ê»˜ ì¡°íšŒ?©ë‹ˆ??
   * - ê²€??ì¡°ê±´???†ìœ¼ë©??„ì²´ ?¬ìš©?ë? ì¡°íšŒ?©ë‹ˆ??
   *
   * @param hqDiv - ë³¸ë?êµ¬ë¶„ì½”ë“œ (ì¿¼ë¦¬ ?Œë¼ë¯¸í„°, ALL=?„ì²´)
   * @param deptDiv - ë¶€?œêµ¬ë¶„ì½”??(ì¿¼ë¦¬ ?Œë¼ë¯¸í„°, ALL=?„ì²´)
   * @param userNm - ?¬ìš©?ëª… (ì¿¼ë¦¬ ?Œë¼ë¯¸í„°, ë¶€ë¶?ê²€??
   * @returns { success: boolean, data?: UserData[], message?: string }
   * @example
   * GET /api/usr/list?hqDiv=1000&deptDiv=1100&userNm=?ê¸¸??
   * Response: {
   *   "success": true,
   *   "data": [{ "empNo": "E001", "empNm": "?ê¸¸??, "hqDivNm": "?”ì??¸ì˜?…ë³¸ë¶€" }]
   * }
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Get('list')
  async getUserList(
    @Query('hqDiv') hqDiv?: string,
    @Query('deptDiv') deptDiv?: string,
    @Query('userNm') userNm?: string,
  ) {
    console.log('?” ?¬ìš©??ëª©ë¡ ì¡°íšŒ ?”ì²­:', { hqDiv, deptDiv, userNm });

    try {
      const result = await this.usrService.getUserList(hqDiv, deptDiv, userNm);
      console.log('???¬ìš©??ëª©ë¡ ì¡°íšŒ ?±ê³µ:', result.length + 'ê±?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???¬ìš©??ëª©ë¡ ì¡°íšŒ ?¤íŒ¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?¬ìš©???…ë¬´ê¶Œí•œ ëª©ë¡ ì¡°íšŒ (GET)
   *
   * @description
   * - ?¹ì • ?¬ìš©?ì˜ ?…ë¬´ê¶Œí•œ ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - USR_01_0202_S ?„ë¡œ?œì?ë¥??¸ì¶œ?˜ì—¬ ?…ë¬´ë³??¬ìš©ê¶Œí•œ ?•ë³´ë¥?ê°€?¸ì˜µ?ˆë‹¤.
   * - ?…ë¬´êµ¬ë¶„ì½”ë“œ, ?…ë¬´êµ¬ë¶„ëª? ?¬ìš©ê¶Œí•œ?¬ë? ?±ì„ ë°˜í™˜?©ë‹ˆ??
   *
   * @param userId - ?¬ìš©??ID (ê²½ë¡œ ?Œë¼ë¯¸í„°, ?¬ë²ˆ)
   * @returns { success: boolean, data?: WorkAuthData[], message?: string }
   * @example
   * GET /api/usr/work-auth/E001
   * Response: {
   *   "success": true,
   *   "data": [{ "smlCsfCd": "01", "smlCsfNm": "?¬ì—…ê´€ë¦?, "wrkUseYn": "1" }]
   * }
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Get('work-auth/:userId')
  async getWorkAuthList(@Param('userId') userId: string) {
    console.log('?” ?¬ìš©???…ë¬´ê¶Œí•œ ëª©ë¡ ì¡°íšŒ ?”ì²­:', userId);

    try {
      const result = await this.usrService.getWorkAuthList(userId);
      console.log('???¬ìš©???…ë¬´ê¶Œí•œ ëª©ë¡ ì¡°íšŒ ?±ê³µ:', result.length + 'ê±?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???¬ìš©???…ë¬´ê¶Œí•œ ëª©ë¡ ì¡°íšŒ ?¤íŒ¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?¬ìš©???•ë³´ ?€??(POST)
   *
   * @description
   * - ?¬ìš©???•ë³´ë¥?? ê·œ ?ì„±?˜ê±°???˜ì •?©ë‹ˆ??
   * - USR_01_0204_T ?„ë¡œ?œì?ë¥??¸ì¶œ?˜ì—¬ ?¬ìš©???•ë³´?€ ?…ë¬´ê¶Œí•œ???¨ê»˜ ?€?¥í•©?ˆë‹¤.
   * - ?¸ëœ??…˜???¬ìš©?˜ì—¬ ?ˆì „?˜ê²Œ ì²˜ë¦¬?©ë‹ˆ??
   * - ?¬ìš©?ì—­??USR_ROLE_ID) ?•ë³´???¨ê»˜ ?€?¥ë©?ˆë‹¤.
   * - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©?ì˜ ?¸ì…˜ ?•ë³´ë¥??œìš©?˜ì—¬ ?±ë¡??ë³€ê²½ì ?•ë³´ë¥??¤ì •?©ë‹ˆ??
   *
   * @param userData - ?€?¥í•  ?¬ìš©???•ë³´ (?”ì²­ ë³¸ë¬¸)
   * @param req - Express ?”ì²­ ê°ì²´ (?¸ì…˜ ?•ë³´ ?¬í•¨)
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
   *   "data": "?€?¥ë˜?ˆìŠµ?ˆë‹¤."
   * }
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Post('save')
  async saveUser(@Body() userData: any, @Req() req: RequestWithSession) {
    console.log('?’¾ ?¬ìš©???•ë³´ ?€???”ì²­:', userData);

    try {
      // ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©???¸ì…˜ ?•ë³´ ?•ì¸
      if (!req.session.user) {
        return {
          success: false,
          message: 'ë¡œê·¸?¸ì´ ?„ìš”?©ë‹ˆ??',
        };
      }

      const currentUser = req.session.user;
      const currentUserId = currentUser.empNo || currentUser.userId;
      console.log('?” ?„ì¬ ë¡œê·¸???¬ìš©??', currentUserId);

      const result = await this.usrService.saveUser(userData, currentUserId);
      console.log('???¬ìš©???•ë³´ ?€???±ê³µ:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('???¬ìš©???•ë³´ ?€???¤íŒ¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??(POST)
   *
   * @description
   * - ?¬ìš©?ì˜ ë¹„ë?ë²ˆí˜¸ë¥??¬ìš©?ID(?¬ë²ˆ)ë¡?ì´ˆê¸°?”í•©?ˆë‹¤ (ê¸°ì¡´ Flex ë°©ì‹ê³??™ì¼).
   * - MD5 ?´ì‹œë¥??¬ìš©?˜ì—¬ ë¹„ë?ë²ˆí˜¸ë¥??”í˜¸?”í•©?ˆë‹¤.
   * - ë¹„ë?ë²ˆí˜¸ ë³€ê²½ì¼?œë? ?„ì¬ ?œê°„?¼ë¡œ ?¤ì •?©ë‹ˆ??
   * - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©?ì˜ ?¸ì…˜ ?•ë³´ë¥??•ì¸?˜ì—¬ ê¶Œí•œ??ê²€ì¦í•©?ˆë‹¤.
   *
   * @param data - ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°?”í•  ?¬ìš©???•ë³´ (?”ì²­ ë³¸ë¬¸)
   * @param data.userId - ?¬ìš©??ID (?¬ë²ˆ)
   * @param req - Express ?”ì²­ ê°ì²´ (?¸ì…˜ ?•ë³´ ?¬í•¨)
   * @returns { success: boolean, data?: string, message?: string }
   * @example
   * POST /api/usr/password-init
   * Body: { "userId": "E001" }
   * Response: {
   *   "success": true,
   *   "data": "ë¹„ë?ë²ˆí˜¸ê°€ ì´ˆê¸°?”ë˜?ˆìŠµ?ˆë‹¤."
   * }
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Post('password-init')
  async initPassword(
    @Body() data: { userId: string },
    @Req() req: RequestWithSession,
  ) {
    console.log('?”‘ ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°???”ì²­:', data.userId);

    try {
      // ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©???¸ì…˜ ?•ë³´ ?•ì¸
      if (!req.session.user) {
        return {
          success: false,
          message: 'ë¡œê·¸?¸ì´ ?„ìš”?©ë‹ˆ??',
        };
      }

      const currentUser = req.session.user;
      console.log(
        '?” ?„ì¬ ë¡œê·¸???¬ìš©??',
        currentUser.empNo || currentUser.userId,
      );

      // ê´€ë¦¬ì ê¶Œí•œ ?•ì¸ (ê¶Œí•œì½”ë“œ A ?ëŠ” ?¹ì • ??• )
      const isAdmin =
        currentUser.authCd === 'A' ||
        currentUser.usrRoleId === 'A250715005' ||
        currentUser.usrRoleId === 'A250715001';

      if (!isAdmin) {
        return {
          success: false,
          message: 'ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??ê¶Œí•œ???†ìŠµ?ˆë‹¤.',
        };
      }

      const result = await this.usrService.initPassword(data.userId);
      console.log('??ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°???±ê³µ:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('??ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°???¤íŒ¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?¹ì¸ê²°ì¬??ê²€??(GET)
   *
   * @description
   * - ?¹ì¸ê²°ì¬?ë? ?¬ìš©?ëª…?¼ë¡œ ê²€?‰í•©?ˆë‹¤.
   * - USR_01_0201_S ?„ë¡œ?œì?ë¥??¸ì¶œ?˜ì—¬ ?¹ì¸ê²°ì¬??ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - ?¬ìš©?ëª…?¼ë¡œ ë¶€ë¶?ê²€?‰ì´ ê°€?¥í•©?ˆë‹¤.
   * - ìµœë? 100ê°œê¹Œì§€ ì¡°íšŒ ê°€?¥í•©?ˆë‹¤.
   *
   * @param approverNm - ?¹ì¸ê²°ì¬?ëª… (ì¿¼ë¦¬ ?Œë¼ë¯¸í„°, ë¶€ë¶?ê²€??
   * @returns { success: boolean, data?: UserData[], message?: string }
   * @example
   * GET /api/usr/approver-search?approverNm=?ê¸¸??
   * Response: {
   *   "success": true,
   *   "data": [{ "empNo": "E001", "empNm": "?ê¸¸??, "authCd": "10" }]
   * }
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Get('approver-search')
  async searchApprover(@Query('approverNm') approverNm: string) {
    console.log('?” ?¹ì¸ê²°ì¬??ê²€???”ì²­:', approverNm);

    try {
      const result = await this.usrService.searchApprover(approverNm);
      console.log('???¹ì¸ê²°ì¬??ê²€???±ê³µ:', result.length + 'ê±?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???¹ì¸ê²°ì¬??ê²€???¤íŒ¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ (GET)
   *
   * @description
   * - ?¬ìš©?¬ë?ê°€ 'Y'???¬ìš©????•  ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - ??• ëª??œìœ¼ë¡??•ë ¬?˜ì—¬ ë°˜í™˜?©ë‹ˆ??
   * - ?¬ìš©??ê´€ë¦??”ë©´?ì„œ ?¬ìš©?ì—­??ì½¤ë³´ë°•ìŠ¤?©ìœ¼ë¡??¬ìš©?©ë‹ˆ??
   *
   * @returns { success: boolean, data?: TblUserRole[], message?: string }
   * @example
   * GET /api/usr/roles
   * Response: {
   *   "success": true,
   *   "data": [{ "usrRoleId": "A250715001", "usrRoleNm": "?¼ë°˜?¬ìš©?? }]
   * }
   *
   * @throws Error - ?œë¹„???¸ì¶œ ?¤íŒ¨ ??
   */
  @Get('roles')
  async getUserRoles() {
    console.log('?” ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ ?”ì²­');

    try {
      const result = await this.usrService.getUserRoles();
      console.log('???¬ìš©????•  ëª©ë¡ ì¡°íšŒ ?±ê³µ:', result.length + 'ê±?);
      return { success: true, data: result };
    } catch (error) {
      console.error('???¬ìš©????•  ëª©ë¡ ì¡°íšŒ ?¤íŒ¨:', error);
      return { success: false, message: (error as Error).message };
    }
  }
}


