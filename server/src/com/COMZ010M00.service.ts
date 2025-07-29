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
      // SP에서 프로시저명만 추출 (괄호 전까지)
      const procName = SP.split('(')[0];
      // 파라미터 분리 (| 구분)
      const params = PARAM.split('|');
      
      // PROCNAME: 동적 프로시저명 (SP 파라미터에서 추출)
      // OracleService의 executeProcedure 메서드 사용
      const result = await this.oracleService.executeProcedure(procName, params);
      
      // 결과를 카멜케이스로 변환하여 반환
      return toCamelCase(result);
    } catch (error) {
      this.logger.error('시스템코드관리 프로시저 호출 오류:', error);
      throw new InternalServerErrorException('시스템코드관리 프로시저 호출 오류');
    }
  }
} 