/**
 * CommonService - ê³µí†µ ê¸°ëŠ¥ ?œë¹„??
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ê³µí†µ ì½”ë“œ ì¡°íšŒ (?€ë¶„ë¥˜ì½”ë“œë³??Œë¶„ë¥˜ì½”??
 * - ë¶€?œêµ¬ë¶„ì½”??ì¡°íšŒ (ì§ì ‘ DB ì¡°íšŒ)
 * - ë³¸ë?ë³?ë¶€??ì½”ë“œ ì¡°íšŒ (?„ë¡œ?œì? ?¸ì¶œ)
 *
 * ?°ê? ?„ë¡œ?œì?:
 * - COM_03_0101_S: ê³µí†µì½”ë“œ ì¡°íšŒ (?€ë¶„ë¥˜ì½”ë“œë³??Œë¶„ë¥˜ì½”??
 * - COM_03_0201_S: ë³¸ë?ë³?ë¶€??ì½”ë“œ ì¡°íšŒ
 *
 * ?°ê? ?Œì´ë¸?
 * - TBL_SML_CSF_CD: ?Œë¶„ë¥˜ì½”???Œì´ë¸?
 *   - LRG_CSF_CD: ?€ë¶„ë¥˜ì½”ë“œ (112=ë¶€?œêµ¬ë¶? 113=ë³¸ë?êµ¬ë¶„, 101=ê¶Œí•œêµ¬ë¶„)
 *   - SML_CSF_CD: ?Œë¶„ë¥˜ì½”??
 *   - SML_CSF_NM: ?Œë¶„ë¥˜ëª…
 *
 * ?˜ì¡´??
 * - OracleService: Oracle DB ?°ê²° ê´€ë¦?
 * - ProcedureDbParser: ?„ë¡œ?œì? ?•ë³´ ?Œì‹±
 */
import { Injectable } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import * as oracledb from 'oracledb';
import {
  CodeDto,
  CodeSearchRequestDto,
  CodeSearchResponseDto,
} from '../com/dto/code.dto';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';
import { DeptDivCodeDto } from '../com/dto/common.dto';

// toCamelCase ? í‹¸ë¦¬í‹° ?¨ìˆ˜
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => {
        const camelKey = key.toLowerCase();
        return {
          ...result,
          [camelKey]: toCamelCase(obj[key]),
        };
      },
      {},
    );
  }
  return obj;
};

@Injectable()
export class CommonService {
  constructor(
    private readonly oracle: OracleService,
    private readonly procedureDbParser: ProcedureDbParser,
  ) {}

  /**
   * ë¶€?œêµ¬ë¶„ì½”??ëª©ë¡ ì¡°íšŒ
   *
   * @description
   * - ë¶€?œêµ¬ë¶„ì½”??112)???´ë‹¹?˜ëŠ” ëª¨ë“  ë¶€??ëª©ë¡??ì§ì ‘ DB ì¿¼ë¦¬ë¡?ì¡°íšŒ?©ë‹ˆ??
   * - ?„ë¡œ?œì? ?¸ì¶œ ?†ì´ ?¨ìˆœ SELECT ì¿¼ë¦¬ë§??˜í–‰?˜ì—¬ ë¹ ë¥¸ ?‘ë‹µ???œê³µ?©ë‹ˆ??
   * - TBL_SML_CSF_CD ?Œì´ë¸”ì—??LRG_CSF_CD = '112' ì¡°ê±´?¼ë¡œ ì¡°íšŒ?©ë‹ˆ??
   *
   * @returns Promise<DeptDivCodeDto[]> - ë¶€?œêµ¬ë¶„ì½”??ëª©ë¡
   * @example
   * const deptCodes = await commonService.getDeptDivCodes();
   * // ê²°ê³¼: [
   * //   { code: "1000", name: "?¬ë‚´ê³µí†µ(25)" },
   * //   { code: "1100", name: "?”ì??¸ì˜?…ë³¸ë¶€(25)" }
   * // ]
   *
   * @throws Error - DB ?°ê²° ?¤íŒ¨ ?ëŠ” ì¿¼ë¦¬ ?¤í–‰ ?¤ë¥˜ ??
   */
  async getDeptDivCodes(): Promise<DeptDivCodeDto[]> {
    const conn = await this.oracle.getConnection();
    try {
      // ë¶€?œêµ¬ë¶„ì½”??112)???´ë‹¹?˜ëŠ” ?Œë¶„ë¥˜ì½”??ì¡°íšŒ
      const result = await conn.execute(
        `SELECT SML_CSF_CD as code, SML_CSF_NM as name 
         FROM TBL_SML_CSF_CD 
         WHERE LRG_CSF_CD = '112' 
         ORDER BY SML_CSF_CD`,
        [],
        { outFormat: require('oracledb').OUT_FORMAT_OBJECT },
      );
      return toCamelCase(result.rows || []);
    } finally {
      await conn.close();
    }
  }

  /**
   * ë³¸ë?êµ¬ë¶„ì½”ë“œ ëª©ë¡ ì¡°íšŒ
   *
   * @description
   * - ë³¸ë?êµ¬ë¶„ì½”ë“œ(113)???´ë‹¹?˜ëŠ” ëª¨ë“  ë³¸ë? ëª©ë¡??ì§ì ‘ DB ì¿¼ë¦¬ë¡?ì¡°íšŒ?©ë‹ˆ??
   * - ?„ë¡œ?œì? ?¸ì¶œ ?†ì´ ?¨ìˆœ SELECT ì¿¼ë¦¬ë§??˜í–‰?˜ì—¬ ë¹ ë¥¸ ?‘ë‹µ???œê³µ?©ë‹ˆ??
   * - TBL_SML_CSF_CD ?Œì´ë¸”ì—??LRG_CSF_CD = '113' ì¡°ê±´?¼ë¡œ ì¡°íšŒ?©ë‹ˆ??
   *
   * @returns Promise<DeptDivCodeDto[]> - ë³¸ë?êµ¬ë¶„ì½”ë“œ ëª©ë¡
   * @example
   * const hqCodes = await commonService.getHqDivCodes();
   * // ê²°ê³¼: [
   * //   { code: "01", name: "ê²½ì˜ì§€?ë³¸ë¶€" },
   * //   { code: "02", name: "?ì—…ë³¸ë?" }
   * // ]
   *
   * @throws Error - DB ?°ê²° ?¤íŒ¨ ?ëŠ” ì¿¼ë¦¬ ?¤í–‰ ?¤ë¥˜ ??
   */
  async getHqDivCodes(): Promise<DeptDivCodeDto[]> {
    const conn = await this.oracle.getConnection();
    try {
      // ë³¸ë?êµ¬ë¶„ì½”ë“œ(113)???´ë‹¹?˜ëŠ” ?Œë¶„ë¥˜ì½”??ì¡°íšŒ
      const result = await conn.execute(
        `SELECT SML_CSF_CD as code, SML_CSF_NM as name 
         FROM TBL_SML_CSF_CD 
         WHERE LRG_CSF_CD = '113' 
         AND USE_YN = 'Y'
         ORDER BY SML_CSF_CD`,
        [],
        { outFormat: require('oracledb').OUT_FORMAT_OBJECT },
      );
      return toCamelCase(result.rows || []);
    } finally {
      await conn.close();
    }
  }

  /**
   * ê³µí†µ ì½”ë“œ ì¡°íšŒ (?„ë¡œ?œì? ?¸ì¶œ)
   *
   * @description
   * - COM_03_0101_S ?„ë¡œ?œì?ë¥??¸ì¶œ?˜ì—¬ ?€ë¶„ë¥˜ì½”ë“œ???´ë‹¹?˜ëŠ” ?Œë¶„ë¥?ì½”ë“œ?¤ì„ ì¡°íšŒ?©ë‹ˆ??
   * - ?„ë¡œ?œì? ?•ë³´?€ ?¨ê»˜ ?‘ë‹µ??ë°˜í™˜?©ë‹ˆ??
   * - ?ëŸ¬ ë°œìƒ ???ì„¸???ëŸ¬ ë©”ì‹œì§€ë¥??¬í•¨?˜ì—¬ ?ˆì™¸ë¥?ë°œìƒ?œí‚µ?ˆë‹¤.
   *
   * @param param - ?€ë¶„ë¥˜ì½”ë“œ (?? '113'=ë³¸ë?êµ¬ë¶„, '112'=ë¶€?œêµ¬ë¶? '101'=ê¶Œí•œêµ¬ë¶„)
   * @returns Promise<CodeSearchResponseDto> - ì½”ë“œ ëª©ë¡ ë°??„ë¡œ?œì? ?•ë³´
   * @example
   * const codes = await commonService.searchCodes('113');
   * // ê²°ê³¼: {
   * //   data: [{ codeId: "1000", codeNm: "?¬ë‚´ê³µí†µ(25)" }],
   * //   procedureInfo: { name: "COM_03_0101_S" },
   * //   totalCount: 1
   * // }
   *
   * @throws Error - ?„ë¡œ?œì? ?¸ì¶œ ?¤íŒ¨ ?ëŠ” DB ?¤ë¥˜ ??
   */
  async searchCodes(param: string): Promise<CodeSearchResponseDto> {
    const conn = await this.oracle.getConnection();
    try {
      // COM_03_0101_S ?„ë¡œ?œì? ?¸ì¶œ
      const result = (await conn.execute(
        `
        BEGIN
          COM_03_0101_S(
            :cursor,
            :I_LRG_CSF_CD
          );
        END;
        `,
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          I_LRG_CSF_CD: param,
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      )) as { outBinds: { cursor: oracledb.ResultSet<any> } };

      const rs = result.outBinds.cursor;
      const rows = await rs.getRows(100); // ìµœë? 100ê°???ì¡°íšŒ
      await rs.close();

      // ?°ì´?°ê? ?†ëŠ” ê²½ìš° ë¹??‘ë‹µ ë°˜í™˜
      if (!rows || rows.length === 0) {
        const response = new CodeSearchResponseDto();
        response.data = [];
        response.procedureInfo =
          await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0101_S');
        response.totalCount = 0;
        return response;
      }

      // ê²°ê³¼ ?°ì´??ë§¤í•‘ (?€?Œë¬¸??êµ¬ë¶„ ?†ì´ ì²˜ë¦¬)
      const codes = rows.map((code: any) => ({
        codeId: code.DATA || code.data,
        codeNm: code.LABEL || code.label,
        useYn: code.USE_YN || code.use_yn,
        sortSeq: code.SORT_SEQ || code.sort_seq,
      }));

      // ?„ë¡œ?œì? ?•ë³´ ì¡°íšŒ ë°??‘ë‹µ êµ¬ì„±
      const procedureInfo =
        await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0101_S');
      const response = new CodeSearchResponseDto();
      response.data = codes;
      response.procedureInfo = procedureInfo;
      response.totalCount = codes.length;
      return response;
    } catch (error: any) {
      console.error('ì½”ë“œ ì¡°íšŒ ?¤ë¥˜:', error);
      throw new Error(`ì½”ë“œ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ${error.message}`);
    } finally {
      await conn.close();
    }
  }

  /**
   * ë³¸ë?ë³?ë¶€??ì½”ë“œ ì¡°íšŒ (?„ë¡œ?œì? ?¸ì¶œ)
   *
   * @description
   * - COM_03_0201_S ?„ë¡œ?œì?ë¥??¸ì¶œ?˜ì—¬ ?¹ì • ë³¸ë????í•œ ë¶€??ì½”ë“œ?¤ì„ ì¡°íšŒ?©ë‹ˆ??
   * - ë³¸ë?ì½”ë“œê°€ 'ALL'??ê²½ìš° ?„ì²´ ë¶€?œë? ì¡°íšŒ?©ë‹ˆ??
   * - ?„ë¡œ?œì? ?•ë³´?€ ?¨ê»˜ ?‘ë‹µ??ë°˜í™˜?©ë‹ˆ??
   *
   * @param hqDivCd - ë³¸ë?êµ¬ë¶„ì½”ë“œ (?? '1000', 'ALL'=?„ì²´ë¶€??
   * @param allYn - ?„ì²´?¬í•¨?¬ë? (ê¸°ë³¸ê°? 'Y')
   * @returns Promise<CodeSearchResponseDto> - ë¶€??ì½”ë“œ ëª©ë¡ ë°??„ë¡œ?œì? ?•ë³´
   * @example
   * const deptCodes = await commonService.searchDeptCodesByHq('1000', 'Y');
   * // ê²°ê³¼: {
   * //   data: [{ codeId: "1100", codeNm: "?”ì??¸ì˜?…ë³¸ë¶€(25)" }],
   * //   procedureInfo: { name: "COM_03_0201_S" },
   * //   totalCount: 1
   * // }
   *
   * @throws Error - ?„ë¡œ?œì? ?¸ì¶œ ?¤íŒ¨ ?ëŠ” DB ?¤ë¥˜ ??
   */
  async searchDeptCodesByHq(
    hqDivCd: string,
    allYn: string = 'Y',
  ): Promise<CodeSearchResponseDto> {
    const conn = await this.oracle.getConnection();
    try {
      // ë³¸ë?ì½”ë“œ???°ë¥¸ ê²€???€???¤ì •
      let schType = '2'; // ?¹ì • ë³¸ë? ê²€??
      let hqDivParam = hqDivCd;
      if (hqDivCd === 'ALL') {
        schType = '1'; // ?„ì²´ ë¶€??ê²€??
        hqDivParam = '';
      }

      // COM_03_0201_S ?„ë¡œ?œì? ?¸ì¶œ
      const result = (await conn.execute(
        `
        BEGIN
          COM_03_0201_S(
            :cursor,
            :I_SCH_TYPE,
            :I_ALL_YN,
            :I_HQ_DIV_CD
          );
        END;
        `,
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          I_SCH_TYPE: schType,
          I_ALL_YN: allYn,
          I_HQ_DIV_CD: hqDivParam,
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      )) as { outBinds: { cursor: oracledb.ResultSet<any> } };

      const rs = result.outBinds.cursor;
      const rows = await rs.getRows(100); // ìµœë? 100ê°???ì¡°íšŒ
      await rs.close();

      // ?°ì´?°ê? ?†ëŠ” ê²½ìš° ë¹??‘ë‹µ ë°˜í™˜
      if (!rows || rows.length === 0) {
        const response = new CodeSearchResponseDto();
        response.data = [];
        response.procedureInfo =
          await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0201_S');
        response.totalCount = 0;
        return response;
      }

      // ê²°ê³¼ ?°ì´??ë§¤í•‘ (?€?Œë¬¸??êµ¬ë¶„ ?†ì´ ì²˜ë¦¬)
      const codes = rows.map((code: any) => ({
        codeId: code.DATA || code.data,
        codeNm: code.LABEL || code.label,
        useYn: code.USE_YN || code.use_yn,
        sortSeq: code.SORT_SEQ || code.sort_seq,
      }));

      // ?„ë¡œ?œì? ?•ë³´ ì¡°íšŒ ë°??‘ë‹µ êµ¬ì„±
      const procedureInfo =
        await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0201_S');
      const response = new CodeSearchResponseDto();
      response.data = codes;
      response.procedureInfo = procedureInfo;
      response.totalCount = codes.length;
      return response;
    } catch (error: any) {
      console.error('ë³¸ë?ë³?ë¶€??ì½”ë“œ ì¡°íšŒ ?¤ë¥˜:', error);
      throw new Error(
        `ë³¸ë?ë³?ë¶€??ì½”ë“œ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ${error.message}`,
      );
    } finally {
      await conn.close();
    }
  }

  /**
   * ë³¸ë?ë³?ë¶€??ëª©ë¡ ì¡°íšŒ (ì§ì ‘ DB ì¡°íšŒ)
   *
   * @description
   * - ?¹ì • ë³¸ë????í•œ ë¶€??ëª©ë¡??ì§ì ‘ DB ì¿¼ë¦¬ë¡?ì¡°íšŒ?©ë‹ˆ??
   * - TBL_SML_CSF_CD ?Œì´ë¸”ì—??LINK_CD1 ì»¬ëŸ¼???¬ìš©?˜ì—¬ ë³¸ë?ë³??„í„°ë§í•©?ˆë‹¤.
   * - ?„ë¡œ?œì? ?¸ì¶œ ?†ì´ ?¨ìˆœ SELECT ì¿¼ë¦¬ë§??˜í–‰?˜ì—¬ ë¹ ë¥¸ ?‘ë‹µ???œê³µ?©ë‹ˆ??
   *
   * @param hqCd - ë³¸ë?êµ¬ë¶„ì½”ë“œ (?? '01', '02', '03', '04')
   * @returns Promise<DeptDivCodeDto[]> - ë³¸ë?ë³?ë¶€??ëª©ë¡
   * @example
   * const deptList = await commonService.getDeptByHq('01');
   * // ê²°ê³¼: [
   * //   { code: "1101", name: "ê²½ì˜ì§€?í?" },
   * //   { code: "1102", name: "?¸ì‚¬?€" }
   * // ]
   *
   * @throws Error - DB ?°ê²° ?¤íŒ¨ ?ëŠ” ì¿¼ë¦¬ ?¤í–‰ ?¤ë¥˜ ??
   */
  async getDeptByHq(hqCd: string): Promise<DeptDivCodeDto[]> {
    const conn = await this.oracle.getConnection();
    try {
      // ë³¸ë?ì½”ë“œê°€ ?†ê±°??'ALL'??ê²½ìš° ë¹?ë°°ì—´ ë°˜í™˜
      if (!hqCd || hqCd === 'ALL') {
        return [];
      }

      // ë³¸ë?ë³?ë¶€??ì¡°íšŒ (LINK_CD1 ?¬ìš©)
      const result = await conn.execute(
        `SELECT SML_CSF_CD as code, SML_CSF_NM as name 
         FROM TBL_SML_CSF_CD 
         WHERE LRG_CSF_CD = '112'
         AND LINK_CD1 = :hqCd
         AND USE_YN = 'Y'
         ORDER BY SML_CSF_CD`,
        [hqCd],
        { outFormat: require('oracledb').OUT_FORMAT_OBJECT },
      );
      return toCamelCase(result.rows || []);
    } finally {
      await conn.close();
    }
  }
}


