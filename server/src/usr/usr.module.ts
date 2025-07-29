/**
 * UsrModule - 사용자 관리 모듈
 *
 * 주요 기능:
 * - 사용자 목록 조회 및 검색
 * - 사용자 정보 저장 (신규/수정)
 * - 사용자 업무권한 관리
 * - 비밀번호 초기화
 * - 승인결재자 검색
 * - 사용자 역할 관리
 *
 * 포함된 컴포넌트:
 * - UsrController: 사용자 관리 API 컨트롤러
 * - UsrService: 사용자 관리 비즈니스 로직
 * - CodeService: 공통 코드 관리 서비스
 * - OracleService: Oracle DB 연결 관리
 * - ProcedureDbParser: 프로시저 정보 파싱
 *
 * 연관 엔티티:
 * - User: 사용자 기본 정보 (로그인, 비밀번호 등)
 * - TblEmpInf: 직원 정보 (사용자 기본 정보)
 * - TblWrkbyUseAuth: 업무별 사용권한
 * - TblUserRole: 사용자 역할
 * - TblSmlCsfCd: 소분류코드 (본부, 부서, 권한, 직책 등)
 *
 * API 엔드포인트:
 * - GET /api/usr/list - 사용자 목록 조회
 * - GET /api/usr/work-auth/:userId - 사용자 업무권한 조회
 * - POST /api/usr/save - 사용자 정보 저장
 * - POST /api/usr/password-init - 비밀번호 초기화
 * - GET /api/usr/approver-search - 승인결재자 검색
 * - GET /api/usr/roles - 사용자 역할 목록 조회
 *
 * 사용 화면:
 * - USR2010M00: 사용자 관리 화면
 *
 * 의존성:
 * - TypeORM: 데이터베이스 ORM
 * - NestJS Common: 기본 NestJS 기능
 * - Oracle DB: Oracle 데이터베이스 연결
 * - 프로시저 파싱: Oracle 프로시저 정보 추출
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsrController } from './USR2010M00.controller';
import { UsrService } from './USR2010M00.service';
import { User } from '../entities/user.entity';
import { TblEmpInf } from '../entities/tbl-emp-inf.entity';
import { TblWrkbyUseAuth } from '../entities/tbl-wrkby-use-auth.entity';
import { TblUserRole } from '../entities/tbl-user-role.entity';
import { TblSmlCsfCd } from '../entities/tbl-sml-csf-cd.entity';
import { CodeService } from '../com/code.service';
import { OracleService } from '../database/database.provider';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';

@Module({
  imports: [
    // TypeORM 엔티티 등록
    TypeOrmModule.forFeature([
      User, // 사용자 기본 정보 (로그인, 비밀번호 등)
      TblEmpInf, // 직원 정보 (사용자 기본 정보)
      TblWrkbyUseAuth, // 업무별 사용권한
      TblUserRole, // 사용자 역할
      TblSmlCsfCd, // 소분류코드 (본부, 부서, 권한, 직책 등)
    ]),
  ],
  controllers: [UsrController], // API 컨트롤러 등록
  providers: [
    UsrService, // 사용자 관리 비즈니스 로직
    CodeService, // 공통 코드 관리 서비스
    ProcedureDbParser, // 프로시저 정보 파싱
  ],
  exports: [UsrService], // 다른 모듈에서 UsrService 사용 가능하도록 export
})
export class UsrModule {}
