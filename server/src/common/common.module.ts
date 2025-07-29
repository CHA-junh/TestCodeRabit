import { Module } from '@nestjs/common';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
// import { DatabaseModule } from '../database/database.module'; // 제거

/**
 * Common 모듈
 *
 * @description
 * - 공통 기능을 제공하는 모듈
 * - 여러 화면에서 공통으로 사용되는 코드, 부서 정보 등을 관리
 * - 재사용 가능한 공통 서비스들을 제공
 *
 * @controllers
 * - CommonController: 공통 API 엔드포인트 제공
 *   - GET /api/common/dept-div-codes: 부서구분코드 목록 조회
 *   - POST /api/common/dept-by-hq: 본부별 부서 목록 조회
 *
 * @providers
 * - CommonService: 공통 비즈니스 로직
 *   - getDeptDivCodes(): 부서구분코드 목록 조회 (TBL_SML_CSF_CD)
 *   - getDeptByHq(hqCd): 본부별 부서 목록 조회 (TBL_DEPT)
 *
 * @exports
 * - CommonService: 다른 모듈에서 공통 서비스 사용 가능
 *
 * @tables
 * - TBL_SML_CSF_CD: 소분류 코드 (부서구분코드 등)
 * - TBL_DEPT: 부서 정보
 *
 * @example
 * ```typescript
 * // 다른 모듈에서 CommonService 사용
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
    // DatabaseModule, // 제거
    // ... 기존 imports 유지
  ],
  controllers: [CommonController],
  providers: [ProcedureDbParser, CommonService],
  exports: [CommonService],
})
export class CommonModule {}
