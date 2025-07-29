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
        this.logger.error('?�수 ?�라미터(sp)가 ?�락?�었?�니??');
        throw new InternalServerErrorException('?�수 ?�라미터(sp)가 ?�락?�었?�니??');
      }

      // param??JSON 문자?�인 경우 ?�싱
      let parsedParam: any;
      try {
        parsedParam = typeof param === 'string' ? JSON.parse(param) : param;
      } catch (parseError) {
        this.logger.error('?�라미터 ?�싱 ?�류:', parseError);
        throw new InternalServerErrorException('?�라미터 ?�식???�바르�? ?�습?�다.');
      }

      // COM_02_0201_S ?�로?��? ?�라미터 ?�서??맞게 변??
      // I_BSN_NM, I_STRT_YEAR, I_PGRS_ST_DIV, I_LOGIN_ID
      const procedureParams = [
        parsedParam.bsnNm || '',           // ?�업�?
        parsedParam.startYear || 'ALL',    // ?�작?�도
        parsedParam.progressStateDiv || 'ALL', // 진행?�태구분
        parsedParam.loginId || null        // 로그?�사?�자ID
      ];

      this.logger.log(`?�로?��? ?�라미터: ${JSON.stringify(procedureParams)}`);

      const spName = sp.replace(/\(.*\)/, '');
      
      // OracleService??executeProcedure 메서???�용
      const result = await this.oracleService.executeProcedure(spName, procedureParams);
      
      // 결과�?카멜케?�스�?변?�하??반환
      return toCamelCase(result);
    } catch (error) {
      this.logger.error('?�업�?검??�??�류', error);
      throw new InternalServerErrorException('?�업�?검??�??�류가 발생?�습?�다.');
    }
  }
} 

