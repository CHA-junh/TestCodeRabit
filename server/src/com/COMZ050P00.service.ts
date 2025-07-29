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
        this.logger.error('?„μ ?λΌλ―Έν„°(sp)κ°€ ?„λ½?μ—?µλ‹??');
        throw new InternalServerErrorException('?„μ ?λΌλ―Έν„°(sp)κ°€ ?„λ½?μ—?µλ‹??');
      }

      // param??JSON λ¬Έμ?΄μΈ κ²½μ° ?μ‹±
      let parsedParam: any;
      try {
        parsedParam = typeof param === 'string' ? JSON.parse(param) : param;
      } catch (parseError) {
        this.logger.error('?λΌλ―Έν„° ?μ‹± ?¤λ¥:', parseError);
        throw new InternalServerErrorException('?λΌλ―Έν„° ?•μ‹???¬λ°”λ¥΄μ? ?μµ?λ‹¤.');
      }

      // COM_02_0201_S ?„λ΅?μ? ?λΌλ―Έν„° ?μ„??λ§κ² λ³€??
      // I_BSN_NM, I_STRT_YEAR, I_PGRS_ST_DIV, I_LOGIN_ID
      const procedureParams = [
        parsedParam.bsnNm || '',           // ?¬μ—…λª?
        parsedParam.startYear || 'ALL',    // ?μ‘?„λ„
        parsedParam.progressStateDiv || 'ALL', // μ§„ν–‰?νƒκµ¬λ¶„
        parsedParam.loginId || null        // λ΅κ·Έ?Έμ‚¬?©μID
      ];

      this.logger.log(`?„λ΅?μ? ?λΌλ―Έν„°: ${JSON.stringify(procedureParams)}`);

      const spName = sp.replace(/\(.*\)/, '');
      
      // OracleService??executeProcedure λ©”μ„???¬μ©
      const result = await this.oracleService.executeProcedure(spName, procedureParams);
      
      // κ²°κ³Όλ¥?μΉ΄λ©μΌ€?΄μ¤λ΅?λ³€?ν•??λ°ν™
      return toCamelCase(result);
    } catch (error) {
      this.logger.error('?¬μ—…λª?κ²€??μ¤??¤λ¥', error);
      throw new InternalServerErrorException('?¬μ—…λª?κ²€??μ¤??¤λ¥κ°€ λ°μƒ?μµ?λ‹¤.');
    }
  }
} 

