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
      // SP?์ ?๋ก?์?๋ช๋ง ์ถ์ถ (๊ดํธ ?๊น์ง)
      const procName = SP.split('(')[0];
      // ?๋ผ๋ฏธํฐ ๋ถ๋ฆฌ (| ๊ตฌ๋ถ)
      const params = PARAM.split('|');
      
      // PROCNAME: ?์  ?๋ก?์?๋ช?(SP ?๋ผ๋ฏธํฐ?์ ์ถ์ถ)
      // OracleService??executeProcedure ๋ฉ์???ฌ์ฉ
      const result = await this.oracleService.executeProcedure(procName, params);
      
      // ๊ฒฐ๊ณผ๋ฅ?์นด๋ฉ์ผ?ด์ค๋ก?๋ณ?ํ??๋ฐํ
      return toCamelCase(result);
    } catch (error) {
      this.logger.error('?์ค?์ฝ?๊?๋ฆ??๋ก?์? ?ธ์ถ ?ค๋ฅ:', error);
      throw new InternalServerErrorException('?์ค?์ฝ?๊?๋ฆ??๋ก?์? ?ธ์ถ ?ค๋ฅ');
    }
  }
} 

