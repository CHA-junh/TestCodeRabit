import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import { CodeEntity } from './entities/code.entity';
import { CodeDto, CodeSearchResponseDto, ProcedureInfoDto } from './dto/code.dto';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';

@Injectable()
export class CodeService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly procedureDbParser: ProcedureDbParser
  ) {}

  async searchCodes(largeCategoryCode: string): Promise<CodeSearchResponseDto> {
    // Oracle ?๋ก?์? ?ธ์ถ ๋ฐฉ์ ? ์?
    const connection = await (this.dataSource.driver as any).oracle.getConnection();
    
    try {
      const result = await connection.execute(
        `
        BEGIN
          COM_03_0101_S(
            :cursor,
            :I_LRG_CSF_CD
          );
        END;
        `,
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          I_LRG_CSF_CD: largeCategoryCode
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT
        }
      ) as { outBinds: { cursor: oracledb.ResultSet<any> } };

      const rs = result.outBinds.cursor;
      const rows = await rs.getRows(100);
      await rs.close();

      if (!rows || rows.length === 0) {
        const response = new CodeSearchResponseDto();
        response.data = [];
        response.procedureInfo = await this.getProcedureInfo('COM_03_0101_S');
        response.totalCount = 0;
        return response;
      }

      // Entity ?ํ๋ก?๋ณ??
      const codeEntities: CodeEntity[] = rows.map((code: any) => ({
        codeId: code.DATA || code.data,
        codeNm: code.LABEL || code.label,
        useYn: 'Y',
        sortSeq: 0
      }));

      // Entity๋ฅ?DTO๋ก?๋ณ??
      const codeDtos: CodeDto[] = codeEntities.map(entity => ({
        codeId: entity.codeId,
        codeNm: entity.codeNm,
        useYn: entity.useYn,
        sortSeq: entity.sortSeq
      }));

      // DB?์ ?ค์๊ฐ์ผ๋ก??๋ก?์? ?๋ณด ๊ฐ?ธ์ค๊ธ?
      const procedureInfo = await this.getProcedureInfo('COM_03_0101_S');
      
      const response = new CodeSearchResponseDto();
      response.data = codeDtos;
      response.procedureInfo = procedureInfo;
      response.totalCount = codeDtos.length;
      
      return response;
    } catch (error: any) {
      console.error('์ฝ๋ ์กฐํ ?ค๋ฅ:', error);
      throw new Error(`์ฝ๋ ์กฐํ ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค: ${error.message}`);
    } finally {
      await connection.close();
    }
  }

  /**
   * DB?์ ?ค์๊ฐ์ผ๋ก??๋ก?์? ?๋ณด ์กฐํ
   */
  private async getProcedureInfo(procedureName: string): Promise<ProcedureInfoDto> {
    try {
      const procedureInfo = await this.procedureDbParser.getProcedureInfoFromDb(procedureName);
      
      const dto = new ProcedureInfoDto();
      dto.name = procedureInfo.name;
      dto.originalCommentLines = procedureInfo.originalCommentLines;
      
      return dto;
    } catch (error) {
      console.error(`?๋ก?์? ?๋ณด ์กฐํ ?ค๋ฅ (${procedureName}):`, error);
      
      // ?ค๋ฅ ๋ฐ์ ??๊ธฐ๋ณธ ?๋ณด ๋ฐํ
      const dto = new ProcedureInfoDto();
      dto.name = procedureName;
      dto.originalCommentLines = ['?๋ก?์? ?๋ณด๋ฅ?์กฐํ?????์ต?๋ค.'];
      
      return dto;
    }
  }
} 

