/**
 * PSM (Personnel System Management) 모듈
 *
 * ?�사관�??�스?�의 ?�심 모듈�? ?�원 ?�보 관�? 경력 관�? ?�사발령 ?�의 기능???�공?�니??
 * AS-IS MXML ?�스?�의 PSM 모듈??TO-BE NestJS ?�스?�으�?마이그레?�션??모듈?�니??
 *
 * 주요 기능:
 * - ?�원 ?�보 관�?(?�록, 조회, ?�정, ??��)
 * - ?�원 검??�??�세 조회
 * - 경력 계산 �?관�?
 * - ?�사발령 관�?(개별/?�괄)
 * - ?�로??관�?(?�록, 조회, ?�정, ??��)
 * - 기술?�급 ?�력 조회
 * - 공통 코드 조회 (본�?�?부????
 *
 * ?�키?�처:
 * - Controller: HTTP ?�청 처리 �??�우??
 * - Service: 비즈?�스 로직 처리 �?Oracle ?�로?��? ?�출 (PsmService)
 * - Database: Oracle DB ?�결 �??�로?��? ?�행
 *
 * ?�로?��? ?�출 방식:
 * - OracleService�??�한 직접 ?�로?��? ?�출
 * - ?�동 ?�랜??�� 관�?(COMMIT/ROLLBACK)
 * - ?��??�된 ?�답 ?�식
 *
 * @author BIST Development Team
 * @since 2024
 * @version 1.0
 */
import { Module } from '@nestjs/common';
import { PsmController } from './psm.controller';

import { PsmService } from './psm.service';

/**
 * PSM 모듈 ?�정
 *
 * 모듈 구성:
 * - imports: DatabaseModule (Oracle DB ?�결 �?OracleService ?�공)
 * - controllers: PsmController (HTTP API ?�드?�인??처리)
 * - providers: PsmService, OracleService (비즈?�스 로직 �?DB ?�비??
 * - exports: PsmService (?�른 모듈?�서 ?�용 가?�하?�록 export)
 */
@Module({
  imports: [
    // DatabaseModule, // ?�거
    // ... 기존 imports ?��?
  ],
  controllers: [PsmController],
  providers: [PsmService],
  exports: [PsmService],
})
export class PsmModule {
  /**
   * PSM 모듈 ?�래??
   *
   * ?�사관�??�스?�의 모든 기능???�공?�는 NestJS 모듈?�니??
   *
   * 주요 ?�징:
   * - ?�존??주입???�한 컴포?�트 관�?
   * - 모듈?�된 ?�키?�처�??��?보수???�상
   * - AS-IS MXML ?�스?�과 ?�일??비즈?�스 로직 ?�공
   * - ?��??�된 API ?�답 ?�식
   *
   * ?�용 ?�시:
   * ```typescript
   * // ?�른 모듈?�서 PSM ?�비???�용
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


