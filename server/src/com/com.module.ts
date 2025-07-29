import { Module } from '@nestjs/common';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';
// import { DatabaseModule } from '../database/database.module'; // ?œê±°

// COM ê´€??ì»¨íŠ¸ë¡¤ëŸ¬??
import { COMZ080P00Controller } from './COMZ080P00.controller';
import { COMZ100P00Controller } from './COMZ100P00.controller';
import { CodeController } from './code.controller';
import { COMZ010M00Controller } from './COMZ010M00.controller';
import { COMZ020M00Controller } from './COMZ020M00.controller';
import { COMZ030P00Controller } from './COMZ030P00.controller';
import { COMZ040P00Controller } from './COMZ040P00.controller';
import { COMZ050P00Controller } from './COMZ050P00.controller';
import { COMZ060P00Controller } from './COMZ060P00.controller';

// COM ê´€???œë¹„?¤ë“¤
import { COMZ080P00Service } from './COMZ080P00.service';
import { COMZ100P00Service } from './COMZ100P00.service';
import { CodeService } from './code.service';
import { COMZ010M00Service } from './COMZ010M00.service';
import { COMZ020M00Service } from './COMZ020M00.service';
import { COMZ030P00Service } from './COMZ030P00.service';
import { COMZ040P00Service } from './COMZ040P00.service';
import { COMZ050P00Service } from './COMZ050P00.service';
import { COMZ060P00Service } from './COMZ060P00.service';

/**
 * COM ëª¨ë“ˆ
 *
 * @description
 * - COM ê´€??ëª¨ë“  ì»¨íŠ¸ë¡¤ëŸ¬?€ ?œë¹„?¤ë? ê´€ë¦¬í•˜??ëª¨ë“ˆ
 * - ?¬ì—…ê´€ë¦? ?¬ìš©?ê?ë¦? ì½”ë“œê´€ë¦? ?¨ê?ê´€ë¦???COM ê¸°ëŠ¥?¤ì„ ?¬í•¨
 * - ?”ë©´ë³?ì»¨íŠ¸ë¡¤ëŸ¬/?œë¹„?? COMZ010M00, COMZ020M00, COMZ030P00, COMZ040P00, COMZ050P00, COMZ060P00
 * - ê³µí†µ ê¸°ëŠ¥: Employee, Users, UnitPrice, Code
 *
 * @controllers
 * - COMZ080P00Controller: ì§ì› ê´€ë¦?
 * - COMZ100P00Controller: ?¬ìš©??ê´€ë¦?
 * - CodeController: ì½”ë“œ ê´€ë¦?
 * - COMZ010M00Controller: ?œìŠ¤?œì½”?œê?ë¦?
 * - COMZ020M00Controller: ?¨ê? ê´€ë¦?
 * - COMZ030P00Controller: ?¨ê? ê²€??
 * - COMZ040P00Controller: ?¬ì—…ë²ˆí˜¸ê²€??
 * - COMZ050P00Controller: ?¬ì—…ëª…ê???
 * - COMZ060P00Controller: ë¶€?œë²ˆ?¸ê???
 *
 * @providers
 * - COMZ080P00Service: ì§ì› ê´€??ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 * - COMZ100P00Service: ?¬ìš©??ê´€??ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 * - CodeService: ì½”ë“œ ê´€??ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 * - COMZ010M00Service: ?œìŠ¤?œì½”?œê?ë¦?ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 * - COMZ020M00Service: ?¨ê? ê´€ë¦?ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 * - COMZ030P00Service: ?¨ê? ê²€??ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 * - COMZ040P00Service: ?¬ì—…ë²ˆí˜¸ê²€??ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 * - COMZ050P00Service: ?¬ì—…ëª…ê???ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 * - COMZ060P00Service: ë¶€?œë²ˆ?¸ê???ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§
 */
@Module({
  imports: [
    // DatabaseModule, // ?œê±°
    // ... ê¸°ì¡´ imports ? ì?
  ],
  controllers: [
    COMZ080P00Controller,
    COMZ100P00Controller,
    CodeController,
    COMZ010M00Controller,
    COMZ020M00Controller,
    COMZ030P00Controller,
    COMZ040P00Controller,
    COMZ050P00Controller,
    COMZ060P00Controller,
  ],
  providers: [
    ProcedureDbParser,
    COMZ080P00Service,
    COMZ100P00Service,
    CodeService,
    COMZ010M00Service,
    COMZ020M00Service,
    COMZ030P00Service,
    COMZ040P00Service,
    COMZ050P00Service,
    COMZ060P00Service,
  ],
  exports: [
    COMZ080P00Service,
    COMZ100P00Service,
    CodeService,
    COMZ010M00Service,
    COMZ020M00Service,
    COMZ030P00Service,
    COMZ040P00Service,
    COMZ050P00Service,
    COMZ060P00Service,
  ],
})
export class ComModule {}


