/**
 * PSM (Personnel System Management) 모듈
 *
 * 인사관리 시스템의 핵심 모듈로, 사원 정보 관리, 경력 관리, 인사발령 등의 기능을 제공합니다.
 * AS-IS MXML 시스템의 PSM 모듈을 TO-BE NestJS 시스템으로 마이그레이션한 모듈입니다.
 *
 * 주요 기능:
 * - 사원 정보 관리 (등록, 조회, 수정, 삭제)
 * - 사원 검색 및 상세 조회
 * - 경력 계산 및 관리
 * - 인사발령 관리 (개별/일괄)
 * - 프로필 관리 (등록, 조회, 수정, 삭제)
 * - 기술등급 이력 조회
 * - 공통 코드 조회 (본부별 부서 등)
 *
 * 아키텍처:
 * - Controller: HTTP 요청 처리 및 라우팅
 * - Service: 비즈니스 로직 처리 및 Oracle 프로시저 호출 (PsmService)
 * - Database: Oracle DB 연결 및 프로시저 실행
 *
 * 프로시저 호출 방식:
 * - OracleService를 통한 직접 프로시저 호출
 * - 자동 트랜잭션 관리 (COMMIT/ROLLBACK)
 * - 표준화된 응답 형식
 *
 * @author BIST Development Team
 * @since 2024
 * @version 1.0
 */
import { Module } from '@nestjs/common';
import { PsmController } from './psm.controller';

import { PsmService } from './psm.service';

/**
 * PSM 모듈 설정
 *
 * 모듈 구성:
 * - imports: DatabaseModule (Oracle DB 연결 및 OracleService 제공)
 * - controllers: PsmController (HTTP API 엔드포인트 처리)
 * - providers: PsmService, OracleService (비즈니스 로직 및 DB 서비스)
 * - exports: PsmService (다른 모듈에서 사용 가능하도록 export)
 */
@Module({
  imports: [
    // DatabaseModule, // 제거
    // ... 기존 imports 유지
  ],
  controllers: [PsmController],
  providers: [PsmService],
  exports: [PsmService],
})
export class PsmModule {
  /**
   * PSM 모듈 클래스
   *
   * 인사관리 시스템의 모든 기능을 제공하는 NestJS 모듈입니다.
   *
   * 주요 특징:
   * - 의존성 주입을 통한 컴포넌트 관리
   * - 모듈화된 아키텍처로 유지보수성 향상
   * - AS-IS MXML 시스템과 동일한 비즈니스 로직 제공
   * - 표준화된 API 응답 형식
   *
   * 사용 예시:
   * ```typescript
   * // 다른 모듈에서 PSM 서비스 사용
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
