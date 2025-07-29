import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import { toCamelCase } from '../utils/toCamelCase';

@Injectable()
export class COMZ010M00Service {
  private readonly logger = new Logger(COMZ010M00Service.name);
  constructor(private readonly oracleService: OracleService) {}

  async handleCodeMgmt(body: { SP: string; PARAM: string }) {
    try {
      const { SP, PARAM } = body;
      // SP?�서 ?�로?��?명만 추출 (괄호 ?�까지)
      const procName = SP.split('(')[0];
      // ?�라미터 분리 (| 구분)
      const params = PARAM.split('|');
      
      // PROCNAME: ?�적 ?�로?��?�?(SP ?�라미터?�서 추출)
      // OracleService??executeProcedure 메서???�용
      const result = await this.oracleService.executeProcedure(procName, params);
      
      // 결과�?카멜케?�스�?변?�하??반환
      return toCamelCase(result);
    } catch (error) {
      this.logger.error('?�스?�코?��?�??�로?��? ?�출 ?�류:', error);
      throw new InternalServerErrorException('?�스?�코?��?�??�로?��? ?�출 ?�류');
    }
  }
} 

