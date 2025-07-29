import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import { COMZ060P00ResultDto, COMZ060P00ResponseDto } from './dto/COMZ060P00.dto';
import { toCamelCase } from '../utils/toCamelCase';

const DEPT_NO_SEARCH_CONSTANTS = {
  MAX_ROWS: 100,
} as const;

@Injectable()
export class COMZ060P00Service {
  private readonly logger = new Logger(COMZ060P00Service.name);
  constructor(private readonly oracleService: OracleService) {}

  /**
   * 부?�번???�도/부?�구분코?�로 부??리스??조회
   */
  async searchDeptNo(sp: string, param: any[]): Promise<COMZ060P00ResponseDto> {
    this.logger.log(`executeProcedure called: sp=${sp}, param=${JSON.stringify(param)}`);
    
    try {
      const result = await this.oracleService.executeProcedure(sp, param);
      
      // 결과�?카멜케?�스�?변?�하??반환
      return toCamelCase(result);
    } catch (error) {
      this.logger.error('부?�번??검??�??�류:', error);
      throw new InternalServerErrorException('부?�번??검??�??�류가 발생?�습?�다.');
    }
  }

} 

