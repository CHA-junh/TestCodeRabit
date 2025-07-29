import { Injectable } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import { toCamelCase } from '../utils/toCamelCase';

interface BusinessSearchParams {
  bsnNo: string;
  startYear: string;
  progressStateDiv: string;
  searchDiv: string;
  hqCd: string;
  deptCd: string;
  userNm: string;
  loginId: string;
}

@Injectable()
export class COMZ040P00Service {
  constructor(private readonly oracleService: OracleService) {}

  async searchBusiness(params: BusinessSearchParams) {
    try {
      console.log('?” ?¬ì—…ë²ˆí˜¸ ê²€???œë¹„???¤í–‰');
      console.log('?“‹ ?Œë¼ë¯¸í„°:', params);

      const {
        bsnNo,
        startYear,
        progressStateDiv,
        searchDiv,
        hqCd,
        deptCd,
        userNm,
        loginId,
      } = params;

      const procedureParams = [
        bsnNo || null,
        startYear === 'ALL' ? null : startYear,
        progressStateDiv || null,
        searchDiv || null,
        hqCd, // ALL ê°’ì„ ê·¸ë?ë¡??„ë‹¬
        deptCd, // ALL ê°’ì„ ê·¸ë?ë¡??„ë‹¬
        userNm === 'ALL' ? null : userNm,
        loginId || null,
      ];

      console.log('?” ?„ë¡œ?œì? ?Œë¼ë¯¸í„°:', procedureParams);
      console.log('?” ê²€?‰êµ¬ë¶?', searchDiv, 'ë³¸ë?:', hqCd, 'ë¶€??', deptCd, '?¬ìš©??', userNm);

      // PROCNAME: COM_02_0101_S (?¬ì—…ë²ˆí˜¸ ê²€??
      const result = await this.oracleService.executeProcedure('COM_02_0101_S', procedureParams);

      console.log('???¬ì—…ë²ˆí˜¸ ê²€??ê²°ê³¼:', result);

      // ê²°ê³¼ë¥?ì¹´ë©œì¼€?´ìŠ¤ë¡?ë³€?˜í•˜??ë°˜í™˜
      const camelCaseResult = toCamelCase(result.data || []);
      
      return {
        success: true,
        data: camelCaseResult,
        totalCount: result.totalCount || 0,
        message: 'ê²€?‰ì´ ?„ë£Œ?˜ì—ˆ?µë‹ˆ??'
      };
    } catch (error) {
      console.error('???¬ì—…ë²ˆí˜¸ ê²€???œë¹„???¤ë¥˜:', error);
      return {
        success: false,
        data: [],
        totalCount: 0,
        message: error.message || 'ê²€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }
} 

