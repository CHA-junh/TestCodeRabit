/**
 * CommonService - 공통 기능 서비스
 *
 * 주요 기능:
 * - 공통 코드 조회 (대분류코드별 소분류코드)
 * - 부서구분코드 조회 (직접 DB 조회)
 * - 본부별 부서 코드 조회 (프로시저 호출)
 *
 * 연관 프로시저:
 * - COM_03_0101_S: 공통코드 조회 (대분류코드별 소분류코드)
 * - COM_03_0201_S: 본부별 부서 코드 조회
 *
 * 연관 테이블:
 * - TBL_SML_CSF_CD: 소분류코드 테이블
 *   - LRG_CSF_CD: 대분류코드 (112=부서구분, 113=본부구분, 101=권한구분)
 *   - SML_CSF_CD: 소분류코드
 *   - SML_CSF_NM: 소분류명
 *
 * 의존성:
 * - OracleService: Oracle DB 연결 관리
 * - ProcedureDbParser: 프로시저 정보 파싱
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

// toCamelCase 유틸리티 함수
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
   * 부서구분코드 목록 조회
   *
   * @description
   * - 부서구분코드(112)에 해당하는 모든 부서 목록을 직접 DB 쿼리로 조회합니다.
   * - 프로시저 호출 없이 단순 SELECT 쿼리만 수행하여 빠른 응답을 제공합니다.
   * - TBL_SML_CSF_CD 테이블에서 LRG_CSF_CD = '112' 조건으로 조회합니다.
   *
   * @returns Promise<DeptDivCodeDto[]> - 부서구분코드 목록
   * @example
   * const deptCodes = await commonService.getDeptDivCodes();
   * // 결과: [
   * //   { code: "1000", name: "사내공통(25)" },
   * //   { code: "1100", name: "디지털영업본부(25)" }
   * // ]
   *
   * @throws Error - DB 연결 실패 또는 쿼리 실행 오류 시
   */
  async getDeptDivCodes(): Promise<DeptDivCodeDto[]> {
    const conn = await this.oracle.getConnection();
    try {
      // 부서구분코드(112)에 해당하는 소분류코드 조회
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
   * 본부구분코드 목록 조회
   *
   * @description
   * - 본부구분코드(113)에 해당하는 모든 본부 목록을 직접 DB 쿼리로 조회합니다.
   * - 프로시저 호출 없이 단순 SELECT 쿼리만 수행하여 빠른 응답을 제공합니다.
   * - TBL_SML_CSF_CD 테이블에서 LRG_CSF_CD = '113' 조건으로 조회합니다.
   *
   * @returns Promise<DeptDivCodeDto[]> - 본부구분코드 목록
   * @example
   * const hqCodes = await commonService.getHqDivCodes();
   * // 결과: [
   * //   { code: "01", name: "경영지원본부" },
   * //   { code: "02", name: "영업본부" }
   * // ]
   *
   * @throws Error - DB 연결 실패 또는 쿼리 실행 오류 시
   */
  async getHqDivCodes(): Promise<DeptDivCodeDto[]> {
    const conn = await this.oracle.getConnection();
    try {
      // 본부구분코드(113)에 해당하는 소분류코드 조회
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
   * 공통 코드 조회 (프로시저 호출)
   *
   * @description
   * - COM_03_0101_S 프로시저를 호출하여 대분류코드에 해당하는 소분류 코드들을 조회합니다.
   * - 프로시저 정보와 함께 응답을 반환합니다.
   * - 에러 발생 시 상세한 에러 메시지를 포함하여 예외를 발생시킵니다.
   *
   * @param param - 대분류코드 (예: '113'=본부구분, '112'=부서구분, '101'=권한구분)
   * @returns Promise<CodeSearchResponseDto> - 코드 목록 및 프로시저 정보
   * @example
   * const codes = await commonService.searchCodes('113');
   * // 결과: {
   * //   data: [{ codeId: "1000", codeNm: "사내공통(25)" }],
   * //   procedureInfo: { name: "COM_03_0101_S" },
   * //   totalCount: 1
   * // }
   *
   * @throws Error - 프로시저 호출 실패 또는 DB 오류 시
   */
  async searchCodes(param: string): Promise<CodeSearchResponseDto> {
    const conn = await this.oracle.getConnection();
    try {
      // COM_03_0101_S 프로시저 호출
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
      const rows = await rs.getRows(100); // 최대 100개 행 조회
      await rs.close();

      // 데이터가 없는 경우 빈 응답 반환
      if (!rows || rows.length === 0) {
        const response = new CodeSearchResponseDto();
        response.data = [];
        response.procedureInfo =
          await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0101_S');
        response.totalCount = 0;
        return response;
      }

      // 결과 데이터 매핑 (대소문자 구분 없이 처리)
      const codes = rows.map((code: any) => ({
        codeId: code.DATA || code.data,
        codeNm: code.LABEL || code.label,
        useYn: code.USE_YN || code.use_yn,
        sortSeq: code.SORT_SEQ || code.sort_seq,
      }));

      // 프로시저 정보 조회 및 응답 구성
      const procedureInfo =
        await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0101_S');
      const response = new CodeSearchResponseDto();
      response.data = codes;
      response.procedureInfo = procedureInfo;
      response.totalCount = codes.length;
      return response;
    } catch (error: any) {
      console.error('코드 조회 오류:', error);
      throw new Error(`코드 조회 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      await conn.close();
    }
  }

  /**
   * 본부별 부서 코드 조회 (프로시저 호출)
   *
   * @description
   * - COM_03_0201_S 프로시저를 호출하여 특정 본부에 속한 부서 코드들을 조회합니다.
   * - 본부코드가 'ALL'인 경우 전체 부서를 조회합니다.
   * - 프로시저 정보와 함께 응답을 반환합니다.
   *
   * @param hqDivCd - 본부구분코드 (예: '1000', 'ALL'=전체부서)
   * @param allYn - 전체포함여부 (기본값: 'Y')
   * @returns Promise<CodeSearchResponseDto> - 부서 코드 목록 및 프로시저 정보
   * @example
   * const deptCodes = await commonService.searchDeptCodesByHq('1000', 'Y');
   * // 결과: {
   * //   data: [{ codeId: "1100", codeNm: "디지털영업본부(25)" }],
   * //   procedureInfo: { name: "COM_03_0201_S" },
   * //   totalCount: 1
   * // }
   *
   * @throws Error - 프로시저 호출 실패 또는 DB 오류 시
   */
  async searchDeptCodesByHq(
    hqDivCd: string,
    allYn: string = 'Y',
  ): Promise<CodeSearchResponseDto> {
    const conn = await this.oracle.getConnection();
    try {
      // 본부코드에 따른 검색 타입 설정
      let schType = '2'; // 특정 본부 검색
      let hqDivParam = hqDivCd;
      if (hqDivCd === 'ALL') {
        schType = '1'; // 전체 부서 검색
        hqDivParam = '';
      }

      // COM_03_0201_S 프로시저 호출
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
      const rows = await rs.getRows(100); // 최대 100개 행 조회
      await rs.close();

      // 데이터가 없는 경우 빈 응답 반환
      if (!rows || rows.length === 0) {
        const response = new CodeSearchResponseDto();
        response.data = [];
        response.procedureInfo =
          await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0201_S');
        response.totalCount = 0;
        return response;
      }

      // 결과 데이터 매핑 (대소문자 구분 없이 처리)
      const codes = rows.map((code: any) => ({
        codeId: code.DATA || code.data,
        codeNm: code.LABEL || code.label,
        useYn: code.USE_YN || code.use_yn,
        sortSeq: code.SORT_SEQ || code.sort_seq,
      }));

      // 프로시저 정보 조회 및 응답 구성
      const procedureInfo =
        await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0201_S');
      const response = new CodeSearchResponseDto();
      response.data = codes;
      response.procedureInfo = procedureInfo;
      response.totalCount = codes.length;
      return response;
    } catch (error: any) {
      console.error('본부별 부서 코드 조회 오류:', error);
      throw new Error(
        `본부별 부서 코드 조회 중 오류가 발생했습니다: ${error.message}`,
      );
    } finally {
      await conn.close();
    }
  }

  /**
   * 본부별 부서 목록 조회 (직접 DB 조회)
   *
   * @description
   * - 특정 본부에 속한 부서 목록을 직접 DB 쿼리로 조회합니다.
   * - TBL_SML_CSF_CD 테이블에서 LINK_CD1 컬럼을 사용하여 본부별 필터링합니다.
   * - 프로시저 호출 없이 단순 SELECT 쿼리만 수행하여 빠른 응답을 제공합니다.
   *
   * @param hqCd - 본부구분코드 (예: '01', '02', '03', '04')
   * @returns Promise<DeptDivCodeDto[]> - 본부별 부서 목록
   * @example
   * const deptList = await commonService.getDeptByHq('01');
   * // 결과: [
   * //   { code: "1101", name: "경영지원팀" },
   * //   { code: "1102", name: "인사팀" }
   * // ]
   *
   * @throws Error - DB 연결 실패 또는 쿼리 실행 오류 시
   */
  async getDeptByHq(hqCd: string): Promise<DeptDivCodeDto[]> {
    const conn = await this.oracle.getConnection();
    try {
      // 본부코드가 없거나 'ALL'인 경우 빈 배열 반환
      if (!hqCd || hqCd === 'ALL') {
        return [];
      }

      // 본부별 부서 조회 (LINK_CD1 사용)
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
