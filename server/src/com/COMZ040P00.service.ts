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
      console.log('?�� ?�업번호 검???�비???�행');
      console.log('?�� ?�라미터:', params);

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
        hqCd, // ALL 값을 그�?�??�달
        deptCd, // ALL 값을 그�?�??�달
        userNm === 'ALL' ? null : userNm,
        loginId || null,
      ];

      console.log('?�� ?�로?��? ?�라미터:', procedureParams);
      console.log('?�� 검?�구�?', searchDiv, '본�?:', hqCd, '부??', deptCd, '?�용??', userNm);

      // PROCNAME: COM_02_0101_S (?�업번호 검??
      const result = await this.oracleService.executeProcedure('COM_02_0101_S', procedureParams);

      console.log('???�업번호 검??결과:', result);

      // 결과�?카멜케?�스�?변?�하??반환
      const camelCaseResult = toCamelCase(result.data || []);
      
      return {
        success: true,
        data: camelCaseResult,
        totalCount: result.totalCount || 0,
        message: '검?�이 ?�료?�었?�니??'
      };
    } catch (error) {
      console.error('???�업번호 검???�비???�류:', error);
      return {
        success: false,
        data: [],
        totalCount: 0,
        message: error.message || '검??�??�류가 발생?�습?�다.'
      };
    }
  }
} 

