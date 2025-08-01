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
      console.log('? ?ฌ์๋ฒํธ ๊ฒ???๋น???คํ');
      console.log('? ?๋ผ๋ฏธํฐ:', params);

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
        hqCd, // ALL ๊ฐ์ ๊ทธ๋?๋ก??๋ฌ
        deptCd, // ALL ๊ฐ์ ๊ทธ๋?๋ก??๋ฌ
        userNm === 'ALL' ? null : userNm,
        loginId || null,
      ];

      console.log('? ?๋ก?์? ?๋ผ๋ฏธํฐ:', procedureParams);
      console.log('? ๊ฒ?๊ตฌ๋ถ?', searchDiv, '๋ณธ๋?:', hqCd, '๋ถ??', deptCd, '?ฌ์ฉ??', userNm);

      // PROCNAME: COM_02_0101_S (?ฌ์๋ฒํธ ๊ฒ??
      const result = await this.oracleService.executeProcedure('COM_02_0101_S', procedureParams);

      console.log('???ฌ์๋ฒํธ ๊ฒ??๊ฒฐ๊ณผ:', result);

      // ๊ฒฐ๊ณผ๋ฅ?์นด๋ฉ์ผ?ด์ค๋ก?๋ณ?ํ??๋ฐํ
      const camelCaseResult = toCamelCase(result.data || []);
      
      return {
        success: true,
        data: camelCaseResult,
        totalCount: result.totalCount || 0,
        message: '๊ฒ?์ด ?๋ฃ?์?ต๋??'
      };
    } catch (error) {
      console.error('???ฌ์๋ฒํธ ๊ฒ???๋น???ค๋ฅ:', error);
      return {
        success: false,
        data: [],
        totalCount: 0,
        message: error.message || '๊ฒ??์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.'
      };
    }
  }
} 

