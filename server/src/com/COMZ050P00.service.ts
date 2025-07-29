import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import { COMZ050P00RequestDto, COMZ050P00ResponseDto, COMZ050P00ResultDto } from './dto/COMZ050P00.dto';
import { toCamelCase } from '../utils/toCamelCase';

@Injectable()
export class COMZ050P00Service {
  private readonly logger = new Logger(COMZ050P00Service.name);
  constructor(private readonly oracleService: OracleService) {}

  async searchBusinessNames(sp: string, param: string): Promise<COMZ050P00ResponseDto> {
    this.logger.log(`executeProcedure called: sp=${sp}, param=${param}`);
    try {
      
      if (!sp) {
        this.logger.error('필수 파라미터(sp)가 누락되었습니다.');
        throw new InternalServerErrorException('필수 파라미터(sp)가 누락되었습니다.');
      }

      // param이 JSON 문자열인 경우 파싱
      let parsedParam: any;
      try {
        parsedParam = typeof param === 'string' ? JSON.parse(param) : param;
      } catch (parseError) {
        this.logger.error('파라미터 파싱 오류:', parseError);
        throw new InternalServerErrorException('파라미터 형식이 올바르지 않습니다.');
      }

      // COM_02_0201_S 프로시저 파라미터 순서에 맞게 변환
      // I_BSN_NM, I_STRT_YEAR, I_PGRS_ST_DIV, I_LOGIN_ID
      const procedureParams = [
        parsedParam.bsnNm || '',           // 사업명
        parsedParam.startYear || 'ALL',    // 시작년도
        parsedParam.progressStateDiv || 'ALL', // 진행상태구분
        parsedParam.loginId || null        // 로그인사용자ID
      ];

      this.logger.log(`프로시저 파라미터: ${JSON.stringify(procedureParams)}`);

      const spName = sp.replace(/\(.*\)/, '');
      
      // OracleService의 executeProcedure 메서드 사용
      const result = await this.oracleService.executeProcedure(spName, procedureParams);
      
      // 결과를 카멜케이스로 변환하여 반환
      return toCamelCase(result);
    } catch (error) {
      this.logger.error('사업명 검색 중 오류', error);
      throw new InternalServerErrorException('사업명 검색 중 오류가 발생했습니다.');
    }
  }
} 