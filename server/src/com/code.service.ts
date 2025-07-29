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
    // Oracle ?�로?��? ?�출 방식 ?��?
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

      // Entity ?�태�?변??
      const codeEntities: CodeEntity[] = rows.map((code: any) => ({
        codeId: code.DATA || code.data,
        codeNm: code.LABEL || code.label,
        useYn: 'Y',
        sortSeq: 0
      }));

      // Entity�?DTO�?변??
      const codeDtos: CodeDto[] = codeEntities.map(entity => ({
        codeId: entity.codeId,
        codeNm: entity.codeNm,
        useYn: entity.useYn,
        sortSeq: entity.sortSeq
      }));

      // DB?�서 ?�시간으�??�로?��? ?�보 가?�오�?
      const procedureInfo = await this.getProcedureInfo('COM_03_0101_S');
      
      const response = new CodeSearchResponseDto();
      response.data = codeDtos;
      response.procedureInfo = procedureInfo;
      response.totalCount = codeDtos.length;
      
      return response;
    } catch (error: any) {
      console.error('코드 조회 ?�류:', error);
      throw new Error(`코드 조회 �??�류가 발생?�습?�다: ${error.message}`);
    } finally {
      await connection.close();
    }
  }

  /**
   * DB?�서 ?�시간으�??�로?��? ?�보 조회
   */
  private async getProcedureInfo(procedureName: string): Promise<ProcedureInfoDto> {
    try {
      const procedureInfo = await this.procedureDbParser.getProcedureInfoFromDb(procedureName);
      
      const dto = new ProcedureInfoDto();
      dto.name = procedureInfo.name;
      dto.originalCommentLines = procedureInfo.originalCommentLines;
      
      return dto;
    } catch (error) {
      console.error(`?�로?��? ?�보 조회 ?�류 (${procedureName}):`, error);
      
      // ?�류 발생 ??기본 ?�보 반환
      const dto = new ProcedureInfoDto();
      dto.name = procedureName;
      dto.originalCommentLines = ['?�로?��? ?�보�?조회?????�습?�다.'];
      
      return dto;
    }
  }
} 

