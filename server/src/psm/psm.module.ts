/**
 * PSM (Personnel System Management) ëª¨ë
 *
 * ?¸ì¬ê´ë¦??ì¤?ì ?µì¬ ëª¨ëë¡? ?¬ì ?ë³´ ê´ë¦? ê²½ë ¥ ê´ë¦? ?¸ì¬ë°ë ¹ ?±ì ê¸°ë¥???ê³µ?©ë??
 * AS-IS MXML ?ì¤?ì PSM ëª¨ë??TO-BE NestJS ?ì¤?ì¼ë¡?ë§ì´ê·¸ë ?´ì??ëª¨ë?ë??
 *
 * ì£¼ì ê¸°ë¥:
 * - ?¬ì ?ë³´ ê´ë¦?(?±ë¡, ì¡°í, ?ì , ?? )
 * - ?¬ì ê²??ë°??ì¸ ì¡°í
 * - ê²½ë ¥ ê³ì° ë°?ê´ë¦?
 * - ?¸ì¬ë°ë ¹ ê´ë¦?(ê°ë³/?¼ê´)
 * - ?ë¡??ê´ë¦?(?±ë¡, ì¡°í, ?ì , ?? )
 * - ê¸°ì ?±ê¸ ?´ë ¥ ì¡°í
 * - ê³µíµ ì½ë ì¡°í (ë³¸ë?ë³?ë¶????
 *
 * ?í¤?ì²:
 * - Controller: HTTP ?ì²­ ì²ë¦¬ ë°??¼ì°??
 * - Service: ë¹ì¦?ì¤ ë¡ì§ ì²ë¦¬ ë°?Oracle ?ë¡?ì? ?¸ì¶ (PsmService)
 * - Database: Oracle DB ?°ê²° ë°??ë¡?ì? ?¤í
 *
 * ?ë¡?ì? ?¸ì¶ ë°©ì:
 * - OracleServiceë¥??µí ì§ì  ?ë¡?ì? ?¸ì¶
 * - ?ë ?¸ë?? ê´ë¦?(COMMIT/ROLLBACK)
 * - ?ì??ë ?ëµ ?ì
 *
 * @author BIST Development Team
 * @since 2024
 * @version 1.0
 */
import { Module } from '@nestjs/common';
import { PsmController } from './psm.controller';

import { PsmService } from './psm.service';

/**
 * PSM ëª¨ë ?¤ì 
 *
 * ëª¨ë êµ¬ì±:
 * - imports: DatabaseModule (Oracle DB ?°ê²° ë°?OracleService ?ê³µ)
 * - controllers: PsmController (HTTP API ?ë?¬ì¸??ì²ë¦¬)
 * - providers: PsmService, OracleService (ë¹ì¦?ì¤ ë¡ì§ ë°?DB ?ë¹??
 * - exports: PsmService (?¤ë¥¸ ëª¨ë?ì ?¬ì© ê°?¥í?ë¡ export)
 */
@Module({
  imports: [
    // DatabaseModule, // ?ê±°
    // ... ê¸°ì¡´ imports ? ì?
  ],
  controllers: [PsmController],
  providers: [PsmService],
  exports: [PsmService],
})
export class PsmModule {
  /**
   * PSM ëª¨ë ?´ë??
   *
   * ?¸ì¬ê´ë¦??ì¤?ì ëª¨ë  ê¸°ë¥???ê³µ?ë NestJS ëª¨ë?ë??
   *
   * ì£¼ì ?¹ì§:
   * - ?ì¡´??ì£¼ì???µí ì»´í¬?í¸ ê´ë¦?
   * - ëª¨ë?ë ?í¤?ì²ë¡?? ì?ë³´ì???¥ì
   * - AS-IS MXML ?ì¤?ê³¼ ?ì¼??ë¹ì¦?ì¤ ë¡ì§ ?ê³µ
   * - ?ì??ë API ?ëµ ?ì
   *
   * ?¬ì© ?ì:
   * ```typescript
   * // ?¤ë¥¸ ëª¨ë?ì PSM ?ë¹???¬ì©
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


