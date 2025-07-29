/**
 * CommonService - 공통 기능 ?�비??
 *
 * 주요 기능:
 * - 공통 코드 조회 (?�분류코드�??�분류코??
 * - 부?�구분코??조회 (직접 DB 조회)
 * - 본�?�?부??코드 조회 (?�로?��? ?�출)
 *
 * ?��? ?�로?��?:
 * - COM_03_0101_S: 공통코드 조회 (?�분류코드�??�분류코??
 * - COM_03_0201_S: 본�?�?부??코드 조회
 *
 * ?��? ?�이�?
 * - TBL_SML_CSF_CD: ?�분류코???�이�?
 *   - LRG_CSF_CD: ?�분류코드 (112=부?�구�? 113=본�?구분, 101=권한구분)
 *   - SML_CSF_CD: ?�분류코??
 *   - SML_CSF_NM: ?�분류명
 *
 * ?�존??
 * - OracleService: Oracle DB ?�결 관�?
 * - ProcedureDbParser: ?�로?��? ?�보 ?�싱
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

// toCamelCase ?�틸리티 ?�수
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
   * 부?�구분코??목록 조회
   *
   * @description
   * - 부?�구분코??112)???�당?�는 모든 부??목록??직접 DB 쿼리�?조회?�니??
   * - ?�로?��? ?�출 ?�이 ?�순 SELECT 쿼리�??�행?�여 빠른 ?�답???�공?�니??
   * - TBL_SML_CSF_CD ?�이블에??LRG_CSF_CD = '112' 조건?�로 조회?�니??
   *
   * @returns Promise<DeptDivCodeDto[]> - 부?�구분코??목록
   * @example
   * const deptCodes = await commonService.getDeptDivCodes();
   * // 결과: [
   * //   { code: "1000", name: "?�내공통(25)" },
   * //   { code: "1100", name: "?��??�영?�본부(25)" }
   * // ]
   *
   * @throws Error - DB ?�결 ?�패 ?�는 쿼리 ?�행 ?�류 ??
   */
  async getDeptDivCodes(): Promise<DeptDivCodeDto[]> {
    const conn = await this.oracle.getConnection();
    try {
      // 부?�구분코??112)???�당?�는 ?�분류코??조회
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
   * 본�?구분코드 목록 조회
   *
   * @description
   * - 본�?구분코드(113)???�당?�는 모든 본�? 목록??직접 DB 쿼리�?조회?�니??
   * - ?�로?��? ?�출 ?�이 ?�순 SELECT 쿼리�??�행?�여 빠른 ?�답???�공?�니??
   * - TBL_SML_CSF_CD ?�이블에??LRG_CSF_CD = '113' 조건?�로 조회?�니??
   *
   * @returns Promise<DeptDivCodeDto[]> - 본�?구분코드 목록
   * @example
   * const hqCodes = await commonService.getHqDivCodes();
   * // 결과: [
   * //   { code: "01", name: "경영지?�본부" },
   * //   { code: "02", name: "?�업본�?" }
   * // ]
   *
   * @throws Error - DB ?�결 ?�패 ?�는 쿼리 ?�행 ?�류 ??
   */
  async getHqDivCodes(): Promise<DeptDivCodeDto[]> {
    const conn = await this.oracle.getConnection();
    try {
      // 본�?구분코드(113)???�당?�는 ?�분류코??조회
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
   * 공통 코드 조회 (?�로?��? ?�출)
   *
   * @description
   * - COM_03_0101_S ?�로?��?�??�출?�여 ?�분류코드???�당?�는 ?�분�?코드?�을 조회?�니??
   * - ?�로?��? ?�보?� ?�께 ?�답??반환?�니??
   * - ?�러 발생 ???�세???�러 메시지�??�함?�여 ?�외�?발생?�킵?�다.
   *
   * @param param - ?�분류코드 (?? '113'=본�?구분, '112'=부?�구�? '101'=권한구분)
   * @returns Promise<CodeSearchResponseDto> - 코드 목록 �??�로?��? ?�보
   * @example
   * const codes = await commonService.searchCodes('113');
   * // 결과: {
   * //   data: [{ codeId: "1000", codeNm: "?�내공통(25)" }],
   * //   procedureInfo: { name: "COM_03_0101_S" },
   * //   totalCount: 1
   * // }
   *
   * @throws Error - ?�로?��? ?�출 ?�패 ?�는 DB ?�류 ??
   */
  async searchCodes(param: string): Promise<CodeSearchResponseDto> {
    const conn = await this.oracle.getConnection();
    try {
      // COM_03_0101_S ?�로?��? ?�출
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
      const rows = await rs.getRows(100); // 최�? 100�???조회
      await rs.close();

      // ?�이?��? ?�는 경우 �??�답 반환
      if (!rows || rows.length === 0) {
        const response = new CodeSearchResponseDto();
        response.data = [];
        response.procedureInfo =
          await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0101_S');
        response.totalCount = 0;
        return response;
      }

      // 결과 ?�이??매핑 (?�?�문??구분 ?�이 처리)
      const codes = rows.map((code: any) => ({
        codeId: code.DATA || code.data,
        codeNm: code.LABEL || code.label,
        useYn: code.USE_YN || code.use_yn,
        sortSeq: code.SORT_SEQ || code.sort_seq,
      }));

      // ?�로?��? ?�보 조회 �??�답 구성
      const procedureInfo =
        await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0101_S');
      const response = new CodeSearchResponseDto();
      response.data = codes;
      response.procedureInfo = procedureInfo;
      response.totalCount = codes.length;
      return response;
    } catch (error: any) {
      console.error('코드 조회 ?�류:', error);
      throw new Error(`코드 조회 �??�류가 발생?�습?�다: ${error.message}`);
    } finally {
      await conn.close();
    }
  }

  /**
   * 본�?�?부??코드 조회 (?�로?��? ?�출)
   *
   * @description
   * - COM_03_0201_S ?�로?��?�??�출?�여 ?�정 본�????�한 부??코드?�을 조회?�니??
   * - 본�?코드가 'ALL'??경우 ?�체 부?��? 조회?�니??
   * - ?�로?��? ?�보?� ?�께 ?�답??반환?�니??
   *
   * @param hqDivCd - 본�?구분코드 (?? '1000', 'ALL'=?�체부??
   * @param allYn - ?�체?�함?��? (기본�? 'Y')
   * @returns Promise<CodeSearchResponseDto> - 부??코드 목록 �??�로?��? ?�보
   * @example
   * const deptCodes = await commonService.searchDeptCodesByHq('1000', 'Y');
   * // 결과: {
   * //   data: [{ codeId: "1100", codeNm: "?��??�영?�본부(25)" }],
   * //   procedureInfo: { name: "COM_03_0201_S" },
   * //   totalCount: 1
   * // }
   *
   * @throws Error - ?�로?��? ?�출 ?�패 ?�는 DB ?�류 ??
   */
  async searchDeptCodesByHq(
    hqDivCd: string,
    allYn: string = 'Y',
  ): Promise<CodeSearchResponseDto> {
    const conn = await this.oracle.getConnection();
    try {
      // 본�?코드???�른 검???�???�정
      let schType = '2'; // ?�정 본�? 검??
      let hqDivParam = hqDivCd;
      if (hqDivCd === 'ALL') {
        schType = '1'; // ?�체 부??검??
        hqDivParam = '';
      }

      // COM_03_0201_S ?�로?��? ?�출
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
      const rows = await rs.getRows(100); // 최�? 100�???조회
      await rs.close();

      // ?�이?��? ?�는 경우 �??�답 반환
      if (!rows || rows.length === 0) {
        const response = new CodeSearchResponseDto();
        response.data = [];
        response.procedureInfo =
          await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0201_S');
        response.totalCount = 0;
        return response;
      }

      // 결과 ?�이??매핑 (?�?�문??구분 ?�이 처리)
      const codes = rows.map((code: any) => ({
        codeId: code.DATA || code.data,
        codeNm: code.LABEL || code.label,
        useYn: code.USE_YN || code.use_yn,
        sortSeq: code.SORT_SEQ || code.sort_seq,
      }));

      // ?�로?��? ?�보 조회 �??�답 구성
      const procedureInfo =
        await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0201_S');
      const response = new CodeSearchResponseDto();
      response.data = codes;
      response.procedureInfo = procedureInfo;
      response.totalCount = codes.length;
      return response;
    } catch (error: any) {
      console.error('본�?�?부??코드 조회 ?�류:', error);
      throw new Error(
        `본�?�?부??코드 조회 �??�류가 발생?�습?�다: ${error.message}`,
      );
    } finally {
      await conn.close();
    }
  }

  /**
   * 본�?�?부??목록 조회 (직접 DB 조회)
   *
   * @description
   * - ?�정 본�????�한 부??목록??직접 DB 쿼리�?조회?�니??
   * - TBL_SML_CSF_CD ?�이블에??LINK_CD1 컬럼???�용?�여 본�?�??�터링합?�다.
   * - ?�로?��? ?�출 ?�이 ?�순 SELECT 쿼리�??�행?�여 빠른 ?�답???�공?�니??
   *
   * @param hqCd - 본�?구분코드 (?? '01', '02', '03', '04')
   * @returns Promise<DeptDivCodeDto[]> - 본�?�?부??목록
   * @example
   * const deptList = await commonService.getDeptByHq('01');
   * // 결과: [
   * //   { code: "1101", name: "경영지?��?" },
   * //   { code: "1102", name: "?�사?�" }
   * // ]
   *
   * @throws Error - DB ?�결 ?�패 ?�는 쿼리 ?�행 ?�류 ??
   */
  async getDeptByHq(hqCd: string): Promise<DeptDivCodeDto[]> {
    const conn = await this.oracle.getConnection();
    try {
      // 본�?코드가 ?�거??'ALL'??경우 �?배열 반환
      if (!hqCd || hqCd === 'ALL') {
        return [];
      }

      // 본�?�?부??조회 (LINK_CD1 ?�용)
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


