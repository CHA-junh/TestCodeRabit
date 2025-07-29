/**
 * SysModule - ?œìŠ¤??ê´€ë¦?ëª¨ë“ˆ
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - SYS1000M00: ?„ë¡œê·¸ë¨ ê´€ë¦?(CRUD)
 * - SYS1001M00: ?„ë¡œê·¸ë¨ ê·¸ë£¹ ê´€ë¦?(CRUD)
 * - SYS1002M00: ë©”ë‰´ ê´€ë¦?(CRUD)
 * - SYS1003M00: ?¬ìš©????•  ê´€ë¦?(CRUD)
 *
 * ?¬í•¨??ì»´í¬?ŒíŠ¸:
 * - SysController: ?œìŠ¤??ê´€ë¦?API ì»¨íŠ¸ë¡¤ëŸ¬ (SYS1000M00, SYS1001M00, SYS1002M00)
 * - SYS1003M00Controller: ?¬ìš©????•  ê´€ë¦?API ì»¨íŠ¸ë¡¤ëŸ¬ (SYS1003M00)
 * - SysService: ?œìŠ¤??ê´€ë¦?ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§ (SYS1000M00, SYS1001M00, SYS1002M00)
 * - SYS1003M00Service: ?¬ìš©????•  ê´€ë¦?ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§ (SYS1003M00)
 *
 * ?°ê? ?”í‹°??
 * - ProgramEntity: ?„ë¡œê·¸ë¨ ?•ë³´ (SYS1000M00)
 * - TblPgmGrp: ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?•ë³´ (SYS1001M00)
 * - TblPgmGrpInf: ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?ì„¸ ?•ë³´ (SYS1001M00)
 * - TblPgmGrpPgm: ?„ë¡œê·¸ë¨ ê·¸ë£¹-?„ë¡œê·¸ë¨ ?°ê²° (SYS1001M00)
 * - TblMenuInf: ë©”ë‰´ ?•ë³´ (SYS1002M00)
 * - TblUserRole: ?¬ìš©????•  ?•ë³´ (SYS1003M00)
 * - TblUserRolePgmGrp: ?¬ìš©????• ë³??„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²° (SYS1003M00)
 *
 * API ?”ë“œ?¬ì¸??
 *
 * SYS1000M00 (?„ë¡œê·¸ë¨ ê´€ë¦?:
 * - GET /api/sys/programs - ?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ
 * - POST /api/sys/programs - ?„ë¡œê·¸ë¨ ?ì„±
 * - PUT /api/sys/programs/:pgmId - ?„ë¡œê·¸ë¨ ?˜ì •
 * - DELETE /api/sys/programs/:pgmId - ?„ë¡œê·¸ë¨ ?? œ
 *
 * SYS1001M00 (?„ë¡œê·¸ë¨ ê·¸ë£¹ ê´€ë¦?:
 * - GET /api/sys/program-groups - ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ ì¡°íšŒ
 * - POST /api/sys/program-groups - ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?ì„±
 * - PUT /api/sys/program-groups/:groupId - ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?˜ì •
 * - DELETE /api/sys/program-groups/:groupId - ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?? œ
 * - GET /api/sys/program-groups/:groupId/programs - ê·¸ë£¹ë³??„ë¡œê·¸ë¨ ì¡°íšŒ
 * - POST /api/sys/program-groups/:groupId/copy - ?„ë¡œê·¸ë¨ ê·¸ë£¹ ë³µì‚¬
 *
 * SYS1002M00 (ë©”ë‰´ ê´€ë¦?:
 * - GET /api/sys/menus - ë©”ë‰´ ëª©ë¡ ì¡°íšŒ
 *
 * SYS1003M00 (?¬ìš©????•  ê´€ë¦?:
 * - GET /api/sys/user-roles - ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ
 * - POST /api/sys/user-roles - ?¬ìš©????•  ?€??
 * - GET /api/sys/user-roles/:usrRoleId/program-groups - ??• ë³??„ë¡œê·¸ë¨ ê·¸ë£¹ ì¡°íšŒ
 * - POST /api/sys/user-roles/:usrRoleId/program-groups - ??• ë³??„ë¡œê·¸ë¨ ê·¸ë£¹ ?€??
 * - POST /api/sys/user-roles/:usrRoleId/copy - ?¬ìš©????•  ë³µì‚¬
 *
 * ?¬ìš© ?”ë©´:
 * - SYS1000M00: ?„ë¡œê·¸ë¨ ê´€ë¦??”ë©´
 * - SYS1001M00: ?„ë¡œê·¸ë¨ ê·¸ë£¹ ê´€ë¦??”ë©´
 * - SYS1002M00: ë©”ë‰´ ê´€ë¦??”ë©´
 * - SYS1003M00: ?¬ìš©????•  ê´€ë¦??”ë©´
 *
 * ?˜ì¡´??
 * - TypeORM: ?°ì´?°ë² ?´ìŠ¤ ORM
 * - NestJS Common: ê¸°ë³¸ NestJS ê¸°ëŠ¥
 * - DatabaseModule: ?°ì´?°ë² ?´ìŠ¤ ?°ê²° ëª¨ë“ˆ
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';

// ?”í‹°??imports
import { TblUserRole } from '../entities/tbl-user-role.entity';
import { TblUserRolePgmGrp } from '../entities/tbl-user-role-pgm-grp.entity';
import { TblMenuInf } from '../entities/tbl-menu-inf.entity';
import { TblMenuDtl } from '../entities/tbl-menu-dtl.entity';
import { ProgramEntity } from '../entities/program.entity';
import { TblPgmGrp } from '../entities/tbl-pgm-grp.entity';
import { TblPgmGrpInf } from '../entities/tbl-pgm-grp-inf.entity';
import { TblPgmGrpPgm } from '../entities/tbl-pgm-grp-pgm.entity';

// ?œë¹„??imports
import { SysService } from './sys.service';
import { UserRoleService } from './SYS1003M00.service';

// ì»¨íŠ¸ë¡¤ëŸ¬ imports
import { SysController } from './sys.controller';
import { UserRoleController } from './SYS1003M00.controller';

@Module({
  imports: [
    // TypeORM ?”í‹°???±ë¡
    TypeOrmModule.forFeature([
      // SYS1000M00: ?„ë¡œê·¸ë¨ ê´€ë¦?
      ProgramEntity,

      // SYS1001M00: ?„ë¡œê·¸ë¨ ê·¸ë£¹ ê´€ë¦?
      TblPgmGrp,
      TblPgmGrpInf,
      TblPgmGrpPgm,

      // SYS1002M00: ë©”ë‰´ ê´€ë¦?
      TblMenuInf,
      TblMenuDtl,

      // SYS1003M00: ?¬ìš©????•  ê´€ë¦?
      TblUserRole,
      TblUserRolePgmGrp,
    ]),
    DatabaseModule, // ?°ì´?°ë² ?´ìŠ¤ ?°ê²° ëª¨ë“ˆ
  ],
  controllers: [
    // SYS1000M00, SYS1001M00, SYS1002M00: ?œìŠ¤??ê´€ë¦?
    SysController,

    // SYS1003M00: ?¬ìš©????•  ê´€ë¦?
    UserRoleController,
  ],
  providers: [
    // SYS1000M00, SYS1001M00, SYS1002M00: ?œìŠ¤??ê´€ë¦?
    SysService,

    // SYS1003M00: ?¬ìš©????•  ê´€ë¦?
    UserRoleService,
  ],
  exports: [
    // ?¸ë? ëª¨ë“ˆ?ì„œ ?¬ìš©?????ˆë„ë¡?export
    SysService,
    UserRoleService,
  ],
})
export class SysModule {}


