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
      console.log('🔍 사업번호 검색 서비스 실행');
      console.log('📋 파라미터:', params);

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
        hqCd, // ALL 값을 그대로 전달
        deptCd, // ALL 값을 그대로 전달
        userNm === 'ALL' ? null : userNm,
        loginId || null,
      ];

      console.log('🔍 프로시저 파라미터:', procedureParams);
      console.log('🔍 검색구분:', searchDiv, '본부:', hqCd, '부서:', deptCd, '사용자:', userNm);

      // PROCNAME: COM_02_0101_S (사업번호 검색)
      const result = await this.oracleService.executeProcedure('COM_02_0101_S', procedureParams);

      console.log('✅ 사업번호 검색 결과:', result);

      // 결과를 카멜케이스로 변환하여 반환
      const camelCaseResult = toCamelCase(result.data || []);
      
      return {
        success: true,
        data: camelCaseResult,
        totalCount: result.totalCount || 0,
        message: '검색이 완료되었습니다.'
      };
    } catch (error) {
      console.error('❌ 사업번호 검색 서비스 오류:', error);
      return {
        success: false,
        data: [],
        totalCount: 0,
        message: error.message || '검색 중 오류가 발생했습니다.'
      };
    }
  }
} 