/**
 * SysModule - 시스템 관리 모듈
 *
 * 주요 기능:
 * - SYS1000M00: 프로그램 관리 (CRUD)
 * - SYS1001M00: 프로그램 그룹 관리 (CRUD)
 * - SYS1002M00: 메뉴 관리 (CRUD)
 * - SYS1003M00: 사용자 역할 관리 (CRUD)
 *
 * 포함된 컴포넌트:
 * - SysController: 시스템 관리 API 컨트롤러 (SYS1000M00, SYS1001M00, SYS1002M00)
 * - SYS1003M00Controller: 사용자 역할 관리 API 컨트롤러 (SYS1003M00)
 * - SysService: 시스템 관리 비즈니스 로직 (SYS1000M00, SYS1001M00, SYS1002M00)
 * - SYS1003M00Service: 사용자 역할 관리 비즈니스 로직 (SYS1003M00)
 *
 * 연관 엔티티:
 * - ProgramEntity: 프로그램 정보 (SYS1000M00)
 * - TblPgmGrp: 프로그램 그룹 정보 (SYS1001M00)
 * - TblPgmGrpInf: 프로그램 그룹 상세 정보 (SYS1001M00)
 * - TblPgmGrpPgm: 프로그램 그룹-프로그램 연결 (SYS1001M00)
 * - TblMenuInf: 메뉴 정보 (SYS1002M00)
 * - TblUserRole: 사용자 역할 정보 (SYS1003M00)
 * - TblUserRolePgmGrp: 사용자 역할별 프로그램 그룹 연결 (SYS1003M00)
 *
 * API 엔드포인트:
 *
 * SYS1000M00 (프로그램 관리):
 * - GET /api/sys/programs - 프로그램 목록 조회
 * - POST /api/sys/programs - 프로그램 생성
 * - PUT /api/sys/programs/:pgmId - 프로그램 수정
 * - DELETE /api/sys/programs/:pgmId - 프로그램 삭제
 *
 * SYS1001M00 (프로그램 그룹 관리):
 * - GET /api/sys/program-groups - 프로그램 그룹 목록 조회
 * - POST /api/sys/program-groups - 프로그램 그룹 생성
 * - PUT /api/sys/program-groups/:groupId - 프로그램 그룹 수정
 * - DELETE /api/sys/program-groups/:groupId - 프로그램 그룹 삭제
 * - GET /api/sys/program-groups/:groupId/programs - 그룹별 프로그램 조회
 * - POST /api/sys/program-groups/:groupId/copy - 프로그램 그룹 복사
 *
 * SYS1002M00 (메뉴 관리):
 * - GET /api/sys/menus - 메뉴 목록 조회
 *
 * SYS1003M00 (사용자 역할 관리):
 * - GET /api/sys/user-roles - 사용자 역할 목록 조회
 * - POST /api/sys/user-roles - 사용자 역할 저장
 * - GET /api/sys/user-roles/:usrRoleId/program-groups - 역할별 프로그램 그룹 조회
 * - POST /api/sys/user-roles/:usrRoleId/program-groups - 역할별 프로그램 그룹 저장
 * - POST /api/sys/user-roles/:usrRoleId/copy - 사용자 역할 복사
 *
 * 사용 화면:
 * - SYS1000M00: 프로그램 관리 화면
 * - SYS1001M00: 프로그램 그룹 관리 화면
 * - SYS1002M00: 메뉴 관리 화면
 * - SYS1003M00: 사용자 역할 관리 화면
 *
 * 의존성:
 * - TypeORM: 데이터베이스 ORM
 * - NestJS Common: 기본 NestJS 기능
 * - DatabaseModule: 데이터베이스 연결 모듈
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';

// 엔티티 imports
import { TblUserRole } from '../entities/tbl-user-role.entity';
import { TblUserRolePgmGrp } from '../entities/tbl-user-role-pgm-grp.entity';
import { TblMenuInf } from '../entities/tbl-menu-inf.entity';
import { TblMenuDtl } from '../entities/tbl-menu-dtl.entity';
import { ProgramEntity } from '../entities/program.entity';
import { TblPgmGrp } from '../entities/tbl-pgm-grp.entity';
import { TblPgmGrpInf } from '../entities/tbl-pgm-grp-inf.entity';
import { TblPgmGrpPgm } from '../entities/tbl-pgm-grp-pgm.entity';

// 서비스 imports
import { SysService } from './sys.service';
import { UserRoleService } from './SYS1003M00.service';

// 컨트롤러 imports
import { SysController } from './sys.controller';
import { UserRoleController } from './SYS1003M00.controller';

@Module({
  imports: [
    // TypeORM 엔티티 등록
    TypeOrmModule.forFeature([
      // SYS1000M00: 프로그램 관리
      ProgramEntity,

      // SYS1001M00: 프로그램 그룹 관리
      TblPgmGrp,
      TblPgmGrpInf,
      TblPgmGrpPgm,

      // SYS1002M00: 메뉴 관리
      TblMenuInf,
      TblMenuDtl,

      // SYS1003M00: 사용자 역할 관리
      TblUserRole,
      TblUserRolePgmGrp,
    ]),
    DatabaseModule, // 데이터베이스 연결 모듈
  ],
  controllers: [
    // SYS1000M00, SYS1001M00, SYS1002M00: 시스템 관리
    SysController,

    // SYS1003M00: 사용자 역할 관리
    UserRoleController,
  ],
  providers: [
    // SYS1000M00, SYS1001M00, SYS1002M00: 시스템 관리
    SysService,

    // SYS1003M00: 사용자 역할 관리
    UserRoleService,
  ],
  exports: [
    // 외부 모듈에서 사용할 수 있도록 export
    SysService,
    UserRoleService,
  ],
})
export class SysModule {}
