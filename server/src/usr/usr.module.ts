/**
 * UsrModule - ?�용??관�?모듈
 *
 * 주요 기능:
 * - ?�용??목록 조회 �?검??
 * - ?�용???�보 ?�??(?�규/?�정)
 * - ?�용???�무권한 관�?
 * - 비�?번호 초기??
 * - ?�인결재??검??
 * - ?�용????�� 관�?
 *
 * ?�함??컴포?�트:
 * - UsrController: ?�용??관�?API 컨트롤러
 * - UsrService: ?�용??관�?비즈?�스 로직
 * - CodeService: 공통 코드 관�??�비??
 * - OracleService: Oracle DB ?�결 관�?
 * - ProcedureDbParser: ?�로?��? ?�보 ?�싱
 *
 * ?��? ?�티??
 * - User: ?�용??기본 ?�보 (로그?? 비�?번호 ??
 * - TblEmpInf: 직원 ?�보 (?�용??기본 ?�보)
 * - TblWrkbyUseAuth: ?�무�??�용권한
 * - TblUserRole: ?�용????��
 * - TblSmlCsfCd: ?�분류코??(본�?, 부?? 권한, 직책 ??
 *
 * API ?�드?�인??
 * - GET /api/usr/list - ?�용??목록 조회
 * - GET /api/usr/work-auth/:userId - ?�용???�무권한 조회
 * - POST /api/usr/save - ?�용???�보 ?�??
 * - POST /api/usr/password-init - 비�?번호 초기??
 * - GET /api/usr/approver-search - ?�인결재??검??
 * - GET /api/usr/roles - ?�용????�� 목록 조회
 *
 * ?�용 ?�면:
 * - USR2010M00: ?�용??관�??�면
 *
 * ?�존??
 * - TypeORM: ?�이?�베?�스 ORM
 * - NestJS Common: 기본 NestJS 기능
 * - Oracle DB: Oracle ?�이?�베?�스 ?�결
 * - ?�로?��? ?�싱: Oracle ?�로?��? ?�보 추출
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
    // TypeORM ?�티???�록
    TypeOrmModule.forFeature([
      User, // ?�용??기본 ?�보 (로그?? 비�?번호 ??
      TblEmpInf, // 직원 ?�보 (?�용??기본 ?�보)
      TblWrkbyUseAuth, // ?�무�??�용권한
      TblUserRole, // ?�용????��
      TblSmlCsfCd, // ?�분류코??(본�?, 부?? 권한, 직책 ??
    ]),
  ],
  controllers: [UsrController], // API 컨트롤러 ?�록
  providers: [
    UsrService, // ?�용??관�?비즈?�스 로직
    CodeService, // 공통 코드 관�??�비??
    ProcedureDbParser, // ?�로?��? ?�보 ?�싱
  ],
  exports: [UsrService], // ?�른 모듈?�서 UsrService ?�용 가?�하?�록 export
})
export class UsrModule {}


