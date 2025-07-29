import { Module } from '@nestjs/common';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
// import { DatabaseModule } from '../database/database.module'; // ?�거

/**
 * Common 모듈
 *
 * @description
 * - 공통 기능???�공?�는 모듈
 * - ?�러 ?�면?�서 공통?�로 ?�용?�는 코드, 부???�보 ?�을 관�?
 * - ?�사??가?�한 공통 ?�비?�들???�공
 *
 * @controllers
 * - CommonController: 공통 API ?�드?�인???�공
 *   - GET /api/common/dept-div-codes: 부?�구분코??목록 조회
 *   - POST /api/common/dept-by-hq: 본�?�?부??목록 조회
 *
 * @providers
 * - CommonService: 공통 비즈?�스 로직
 *   - getDeptDivCodes(): 부?�구분코??목록 조회 (TBL_SML_CSF_CD)
 *   - getDeptByHq(hqCd): 본�?�?부??목록 조회 (TBL_DEPT)
 *
 * @exports
 * - CommonService: ?�른 모듈?�서 공통 ?�비???�용 가??
 *
 * @tables
 * - TBL_SML_CSF_CD: ?�분�?코드 (부?�구분코????
 * - TBL_DEPT: 부???�보
 *
 * @example
 * ```typescript
 * // ?�른 모듈?�서 CommonService ?�용
 * import { CommonService } from '../common/common.service';
 *
 * @Injectable()
 * export class SomeService {
 *   constructor(private commonService: CommonService) {}
 *
 *   async someMethod() {
 *     const deptCodes = await this.commonService.getDeptDivCodes();
 *     // ...
 *   }
 * }
 * ```
 */
@Module({
  imports: [
    // DatabaseModule, // ?�거
    // ... 기존 imports ?��?
  ],
  controllers: [CommonController],
  providers: [ProcedureDbParser, CommonService],
  exports: [CommonService],
})
export class CommonModule {}


