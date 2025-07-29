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
   * 부서번호/년도/부서구분코드로 부서 리스트 조회
   */
  async searchDeptNo(sp: string, param: any[]): Promise<COMZ060P00ResponseDto> {
    this.logger.log(`executeProcedure called: sp=${sp}, param=${JSON.stringify(param)}`);
    
    try {
      const result = await this.oracleService.executeProcedure(sp, param);
      
      // 결과를 카멜케이스로 변환하여 반환
      return toCamelCase(result);
    } catch (error) {
      this.logger.error('부서번호 검색 중 오류:', error);
      throw new InternalServerErrorException('부서번호 검색 중 오류가 발생했습니다.');
    }
  }

} 