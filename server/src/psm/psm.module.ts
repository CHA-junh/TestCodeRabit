/**
 * PSM (Personnel System Management) ëª¨ë“ˆ
 *
 * ?¸ì‚¬ê´€ë¦??œìŠ¤?œì˜ ?µì‹¬ ëª¨ë“ˆë¡? ?¬ì› ?•ë³´ ê´€ë¦? ê²½ë ¥ ê´€ë¦? ?¸ì‚¬ë°œë ¹ ?±ì˜ ê¸°ëŠ¥???œê³µ?©ë‹ˆ??
 * AS-IS MXML ?œìŠ¤?œì˜ PSM ëª¨ë“ˆ??TO-BE NestJS ?œìŠ¤?œìœ¼ë¡?ë§ˆì´ê·¸ë ˆ?´ì…˜??ëª¨ë“ˆ?…ë‹ˆ??
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ì› ?•ë³´ ê´€ë¦?(?±ë¡, ì¡°íšŒ, ?˜ì •, ?? œ)
 * - ?¬ì› ê²€??ë°??ì„¸ ì¡°íšŒ
 * - ê²½ë ¥ ê³„ì‚° ë°?ê´€ë¦?
 * - ?¸ì‚¬ë°œë ¹ ê´€ë¦?(ê°œë³„/?¼ê´„)
 * - ?„ë¡œ??ê´€ë¦?(?±ë¡, ì¡°íšŒ, ?˜ì •, ?? œ)
 * - ê¸°ìˆ ?±ê¸‰ ?´ë ¥ ì¡°íšŒ
 * - ê³µí†µ ì½”ë“œ ì¡°íšŒ (ë³¸ë?ë³?ë¶€????
 *
 * ?„í‚¤?ì²˜:
 * - Controller: HTTP ?”ì²­ ì²˜ë¦¬ ë°??¼ìš°??
 * - Service: ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§ ì²˜ë¦¬ ë°?Oracle ?„ë¡œ?œì? ?¸ì¶œ (PsmService)
 * - Database: Oracle DB ?°ê²° ë°??„ë¡œ?œì? ?¤í–‰
 *
 * ?„ë¡œ?œì? ?¸ì¶œ ë°©ì‹:
 * - OracleServiceë¥??µí•œ ì§ì ‘ ?„ë¡œ?œì? ?¸ì¶œ
 * - ?ë™ ?¸ëœ??…˜ ê´€ë¦?(COMMIT/ROLLBACK)
 * - ?œì??”ëœ ?‘ë‹µ ?•ì‹
 *
 * @author BIST Development Team
 * @since 2024
 * @version 1.0
 */
import { Module } from '@nestjs/common';
import { PsmController } from './psm.controller';

import { PsmService } from './psm.service';

/**
 * PSM ëª¨ë“ˆ ?¤ì •
 *
 * ëª¨ë“ˆ êµ¬ì„±:
 * - imports: DatabaseModule (Oracle DB ?°ê²° ë°?OracleService ?œê³µ)
 * - controllers: PsmController (HTTP API ?”ë“œ?¬ì¸??ì²˜ë¦¬)
 * - providers: PsmService, OracleService (ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§ ë°?DB ?œë¹„??
 * - exports: PsmService (?¤ë¥¸ ëª¨ë“ˆ?ì„œ ?¬ìš© ê°€?¥í•˜?„ë¡ export)
 */
@Module({
  imports: [
    // DatabaseModule, // ?œê±°
    // ... ê¸°ì¡´ imports ? ì?
  ],
  controllers: [PsmController],
  providers: [PsmService],
  exports: [PsmService],
})
export class PsmModule {
  /**
   * PSM ëª¨ë“ˆ ?´ë˜??
   *
   * ?¸ì‚¬ê´€ë¦??œìŠ¤?œì˜ ëª¨ë“  ê¸°ëŠ¥???œê³µ?˜ëŠ” NestJS ëª¨ë“ˆ?…ë‹ˆ??
   *
   * ì£¼ìš” ?¹ì§•:
   * - ?˜ì¡´??ì£¼ì…???µí•œ ì»´í¬?ŒíŠ¸ ê´€ë¦?
   * - ëª¨ë“ˆ?”ëœ ?„í‚¤?ì²˜ë¡?? ì?ë³´ìˆ˜???¥ìƒ
   * - AS-IS MXML ?œìŠ¤?œê³¼ ?™ì¼??ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§ ?œê³µ
   * - ?œì??”ëœ API ?‘ë‹µ ?•ì‹
   *
   * ?¬ìš© ?ˆì‹œ:
   * ```typescript
   * // ?¤ë¥¸ ëª¨ë“ˆ?ì„œ PSM ?œë¹„???¬ìš©
   * import { PsmService } from './psm/psm.service';
   *
   * @Injectable()
   * export class SomeService {
   *   constructor(private readonly psmService: PsmService) {}
   *
   *   async someMethod() {
   *     const result = await this.psmService.searchEmployees({ empNo: '10001' });
   *   }
   * }
   * ```
   */
}


