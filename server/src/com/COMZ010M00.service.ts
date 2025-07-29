import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import { toCamelCase } from '../utils/toCamelCase';

@Injectable()
export class COMZ010M00Service {
  private readonly logger = new Logger(COMZ010M00Service.name);
  constructor(private readonly oracleService: OracleService) {}

  async handleCodeMgmt(body: { SP: string; PARAM: string }) {
    try {
      const { SP, PARAM } = body;
      // SP?ì„œ ?„ë¡œ?œì?ëª…ë§Œ ì¶”ì¶œ (ê´„í˜¸ ?„ê¹Œì§€)
      const procName = SP.split('(')[0];
      // ?Œë¼ë¯¸í„° ë¶„ë¦¬ (| êµ¬ë¶„)
      const params = PARAM.split('|');
      
      // PROCNAME: ?™ì  ?„ë¡œ?œì?ëª?(SP ?Œë¼ë¯¸í„°?ì„œ ì¶”ì¶œ)
      // OracleService??executeProcedure ë©”ì„œ???¬ìš©
      const result = await this.oracleService.executeProcedure(procName, params);
      
      // ê²°ê³¼ë¥?ì¹´ë©œì¼€?´ìŠ¤ë¡?ë³€?˜í•˜??ë°˜í™˜
      return toCamelCase(result);
    } catch (error) {
      this.logger.error('?œìŠ¤?œì½”?œê?ë¦??„ë¡œ?œì? ?¸ì¶œ ?¤ë¥˜:', error);
      throw new InternalServerErrorException('?œìŠ¤?œì½”?œê?ë¦??„ë¡œ?œì? ?¸ì¶œ ?¤ë¥˜');
    }
  }
} 

