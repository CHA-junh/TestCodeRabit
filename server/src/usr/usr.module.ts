/**
 * UsrModule - ?¬ìš©??ê´€ë¦?ëª¨ë“ˆ
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ìš©??ëª©ë¡ ì¡°íšŒ ë°?ê²€??
 * - ?¬ìš©???•ë³´ ?€??(? ê·œ/?˜ì •)
 * - ?¬ìš©???…ë¬´ê¶Œí•œ ê´€ë¦?
 * - ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
 * - ?¹ì¸ê²°ì¬??ê²€??
 * - ?¬ìš©????•  ê´€ë¦?
 *
 * ?¬í•¨??ì»´í¬?ŒíŠ¸:
 * - UsrController: ?¬ìš©??ê´€ë¦?API ì»¨íŠ¸ë¡¤ëŸ¬
 * - UsrService: ?¬ìš©??ê´€ë¦?ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 * - CodeService: ê³µí†µ ì½”ë“œ ê´€ë¦??œë¹„??
 * - OracleService: Oracle DB ?°ê²° ê´€ë¦?
 * - ProcedureDbParser: ?„ë¡œ?œì? ?•ë³´ ?Œì‹±
 *
 * ?°ê? ?”í‹°??
 * - User: ?¬ìš©??ê¸°ë³¸ ?•ë³´ (ë¡œê·¸?? ë¹„ë?ë²ˆí˜¸ ??
 * - TblEmpInf: ì§ì› ?•ë³´ (?¬ìš©??ê¸°ë³¸ ?•ë³´)
 * - TblWrkbyUseAuth: ?…ë¬´ë³??¬ìš©ê¶Œí•œ
 * - TblUserRole: ?¬ìš©????• 
 * - TblSmlCsfCd: ?Œë¶„ë¥˜ì½”??(ë³¸ë?, ë¶€?? ê¶Œí•œ, ì§ì±… ??
 *
 * API ?”ë“œ?¬ì¸??
 * - GET /api/usr/list - ?¬ìš©??ëª©ë¡ ì¡°íšŒ
 * - GET /api/usr/work-auth/:userId - ?¬ìš©???…ë¬´ê¶Œí•œ ì¡°íšŒ
 * - POST /api/usr/save - ?¬ìš©???•ë³´ ?€??
 * - POST /api/usr/password-init - ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
 * - GET /api/usr/approver-search - ?¹ì¸ê²°ì¬??ê²€??
 * - GET /api/usr/roles - ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ
 *
 * ?¬ìš© ?”ë©´:
 * - USR2010M00: ?¬ìš©??ê´€ë¦??”ë©´
 *
 * ?˜ì¡´??
 * - TypeORM: ?°ì´?°ë² ?´ìŠ¤ ORM
 * - NestJS Common: ê¸°ë³¸ NestJS ê¸°ëŠ¥
 * - Oracle DB: Oracle ?°ì´?°ë² ?´ìŠ¤ ?°ê²°
 * - ?„ë¡œ?œì? ?Œì‹±: Oracle ?„ë¡œ?œì? ?•ë³´ ì¶”ì¶œ
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
    // TypeORM ?”í‹°???±ë¡
    TypeOrmModule.forFeature([
      User, // ?¬ìš©??ê¸°ë³¸ ?•ë³´ (ë¡œê·¸?? ë¹„ë?ë²ˆí˜¸ ??
      TblEmpInf, // ì§ì› ?•ë³´ (?¬ìš©??ê¸°ë³¸ ?•ë³´)
      TblWrkbyUseAuth, // ?…ë¬´ë³??¬ìš©ê¶Œí•œ
      TblUserRole, // ?¬ìš©????• 
      TblSmlCsfCd, // ?Œë¶„ë¥˜ì½”??(ë³¸ë?, ë¶€?? ê¶Œí•œ, ì§ì±… ??
    ]),
  ],
  controllers: [UsrController], // API ì»¨íŠ¸ë¡¤ëŸ¬ ?±ë¡
  providers: [
    UsrService, // ?¬ìš©??ê´€ë¦?ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
    CodeService, // ê³µí†µ ì½”ë“œ ê´€ë¦??œë¹„??
    ProcedureDbParser, // ?„ë¡œ?œì? ?•ë³´ ?Œì‹±
  ],
  exports: [UsrService], // ?¤ë¥¸ ëª¨ë“ˆ?ì„œ UsrService ?¬ìš© ê°€?¥í•˜?„ë¡ export
})
export class UsrModule {}


