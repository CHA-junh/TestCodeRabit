/**
 * SysModule - ?�스??관�?모듈
 *
 * 주요 기능:
 * - SYS1000M00: ?�로그램 관�?(CRUD)
 * - SYS1001M00: ?�로그램 그룹 관�?(CRUD)
 * - SYS1002M00: 메뉴 관�?(CRUD)
 * - SYS1003M00: ?�용????�� 관�?(CRUD)
 *
 * ?�함??컴포?�트:
 * - SysController: ?�스??관�?API 컨트롤러 (SYS1000M00, SYS1001M00, SYS1002M00)
 * - SYS1003M00Controller: ?�용????�� 관�?API 컨트롤러 (SYS1003M00)
 * - SysService: ?�스??관�?비즈?�스 로직 (SYS1000M00, SYS1001M00, SYS1002M00)
 * - SYS1003M00Service: ?�용????�� 관�?비즈?�스 로직 (SYS1003M00)
 *
 * ?��? ?�티??
 * - ProgramEntity: ?�로그램 ?�보 (SYS1000M00)
 * - TblPgmGrp: ?�로그램 그룹 ?�보 (SYS1001M00)
 * - TblPgmGrpInf: ?�로그램 그룹 ?�세 ?�보 (SYS1001M00)
 * - TblPgmGrpPgm: ?�로그램 그룹-?�로그램 ?�결 (SYS1001M00)
 * - TblMenuInf: 메뉴 ?�보 (SYS1002M00)
 * - TblUserRole: ?�용????�� ?�보 (SYS1003M00)
 * - TblUserRolePgmGrp: ?�용????���??�로그램 그룹 ?�결 (SYS1003M00)
 *
 * API ?�드?�인??
 *
 * SYS1000M00 (?�로그램 관�?:
 * - GET /api/sys/programs - ?�로그램 목록 조회
 * - POST /api/sys/programs - ?�로그램 ?�성
 * - PUT /api/sys/programs/:pgmId - ?�로그램 ?�정
 * - DELETE /api/sys/programs/:pgmId - ?�로그램 ??��
 *
 * SYS1001M00 (?�로그램 그룹 관�?:
 * - GET /api/sys/program-groups - ?�로그램 그룹 목록 조회
 * - POST /api/sys/program-groups - ?�로그램 그룹 ?�성
 * - PUT /api/sys/program-groups/:groupId - ?�로그램 그룹 ?�정
 * - DELETE /api/sys/program-groups/:groupId - ?�로그램 그룹 ??��
 * - GET /api/sys/program-groups/:groupId/programs - 그룹�??�로그램 조회
 * - POST /api/sys/program-groups/:groupId/copy - ?�로그램 그룹 복사
 *
 * SYS1002M00 (메뉴 관�?:
 * - GET /api/sys/menus - 메뉴 목록 조회
 *
 * SYS1003M00 (?�용????�� 관�?:
 * - GET /api/sys/user-roles - ?�용????�� 목록 조회
 * - POST /api/sys/user-roles - ?�용????�� ?�??
 * - GET /api/sys/user-roles/:usrRoleId/program-groups - ??���??�로그램 그룹 조회
 * - POST /api/sys/user-roles/:usrRoleId/program-groups - ??���??�로그램 그룹 ?�??
 * - POST /api/sys/user-roles/:usrRoleId/copy - ?�용????�� 복사
 *
 * ?�용 ?�면:
 * - SYS1000M00: ?�로그램 관�??�면
 * - SYS1001M00: ?�로그램 그룹 관�??�면
 * - SYS1002M00: 메뉴 관�??�면
 * - SYS1003M00: ?�용????�� 관�??�면
 *
 * ?�존??
 * - TypeORM: ?�이?�베?�스 ORM
 * - NestJS Common: 기본 NestJS 기능
 * - DatabaseModule: ?�이?�베?�스 ?�결 모듈
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';

// ?�티??imports
import { TblUserRole } from '../entities/tbl-user-role.entity';
import { TblUserRolePgmGrp } from '../entities/tbl-user-role-pgm-grp.entity';
import { TblMenuInf } from '../entities/tbl-menu-inf.entity';
import { TblMenuDtl } from '../entities/tbl-menu-dtl.entity';
import { ProgramEntity } from '../entities/program.entity';
import { TblPgmGrp } from '../entities/tbl-pgm-grp.entity';
import { TblPgmGrpInf } from '../entities/tbl-pgm-grp-inf.entity';
import { TblPgmGrpPgm } from '../entities/tbl-pgm-grp-pgm.entity';

// ?�비??imports
import { SysService } from './sys.service';
import { UserRoleService } from './SYS1003M00.service';

// 컨트롤러 imports
import { SysController } from './sys.controller';
import { UserRoleController } from './SYS1003M00.controller';

@Module({
  imports: [
    // TypeORM ?�티???�록
    TypeOrmModule.forFeature([
      // SYS1000M00: ?�로그램 관�?
      ProgramEntity,

      // SYS1001M00: ?�로그램 그룹 관�?
      TblPgmGrp,
      TblPgmGrpInf,
      TblPgmGrpPgm,

      // SYS1002M00: 메뉴 관�?
      TblMenuInf,
      TblMenuDtl,

      // SYS1003M00: ?�용????�� 관�?
      TblUserRole,
      TblUserRolePgmGrp,
    ]),
    DatabaseModule, // ?�이?�베?�스 ?�결 모듈
  ],
  controllers: [
    // SYS1000M00, SYS1001M00, SYS1002M00: ?�스??관�?
    SysController,

    // SYS1003M00: ?�용????�� 관�?
    UserRoleController,
  ],
  providers: [
    // SYS1000M00, SYS1001M00, SYS1002M00: ?�스??관�?
    SysService,

    // SYS1003M00: ?�용????�� 관�?
    UserRoleService,
  ],
  exports: [
    // ?��? 모듈?�서 ?�용?????�도�?export
    SysService,
    UserRoleService,
  ],
})
export class SysModule {}


