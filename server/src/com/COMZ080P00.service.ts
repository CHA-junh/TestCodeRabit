import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import { EmployeeEntity } from './entities/COMZ080P00.entity';
import { EmployeeDto, EmployeeSearchRequestDto, EmployeeSearchResponseDto, ProcedureInfoDto } from './dto/COMZ080P00.dto';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';

@Injectable()
export class COMZ080P00Service {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly procedureDbParser: ProcedureDbParser
  ) {}

  async searchEmployees(params: EmployeeSearchRequestDto): Promise<EmployeeSearchResponseDto> {
    const connection = await (this.dataSource.driver as any).oracle.getConnection();
    
    try {
      const result = await connection.execute(
        `
        BEGIN
          COM_02_0411_S(
            :cursor,
            :kb,
            :empNo,
            :empNm,
            :ownOutsDiv,
            :retirYn
          );
        END;
        `,
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          kb: params.kb || '1',
          empNo: params.empNo || null,
          empNm: params.empNm || null,
          ownOutsDiv: params.ownOutsDiv || null,
          retirYn: params.retirYn || 'Y'
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT
        }
      ) as { outBinds: { cursor: oracledb.ResultSet<any> } };
      
      const rs = result.outBinds.cursor;
      const rows = await rs.getRows(100);
      await rs.close();
      
      if (!rows || rows.length === 0) {
        const response = new EmployeeSearchResponseDto();
        response.data = [];
        response.procedureInfo = await this.getProcedureInfo('COM_02_0411_S');
        response.totalCount = 0;
        return response;
      }
      
      // Entity ?ïÌÉúÎ°?Î≥Ä??
      const employeeDtos: EmployeeDto[] = rows.map((row: any, idx: number) => ({
        LIST_NO: String(idx + 1),
        OWN_OUTS_NM: row.OWN_OUTS_NM,
        EMP_NM: row.EMP_NM,
        EMP_NO: row.EMP_NO,
        DUTY_CD_NM: row.DUTY_CD_NM,
        TCN_GRD_NM: row.TCN_GRD_NM,
        PARTY_NM: row.PARTY_NM,
        ENTR_DT: row.ENTR_DT,
        EXEC_IN_STRT_DT: row.EXEC_IN_STRT_DT,
        EXEC_IN_END_DT: row.EXEC_IN_END_DT,
        WKG_ST_DIV_NM: row.WKG_ST_DIV_NM,
        EXEC_ING_BSN_NM: row.EXEC_ING_BSN_NM,
        HQ_DIV_CD: row.HQ_DIV_CD,
        DEPT_DIV_CD: row.DEPT_DIV_CD,
        CSF_CO_CD: row.CSF_CO_CD,
        WKG_ST_DIV: row.WKG_ST_DIV,
        EXEC_ING_YN: row.EXEC_ING_YN,
        OWN_OUTS_DIV: row.OWN_OUTS_DIV,
        OUTS_FIX_YN: row.OUTS_FIX_YN,
        IN_FIX_DT: row.IN_FIX_DT,
        IN_FIX_PRJT: row.IN_FIX_PRJT,
        DUTY_CD: row.DUTY_CD,
        DUTY_DIV_CD: row.DUTY_DIV_CD,
        TCN_GRD: row.TCN_GRD,
      }));
      
      // DB?êÏÑú ?§ÏãúÍ∞ÑÏúºÎ°??ÑÎ°ú?úÏ? ?ïÎ≥¥ Í∞Ä?∏Ïò§Í∏?
      const procedureInfo = await this.getProcedureInfo('COM_02_0411_S');
      
      const response = new EmployeeSearchResponseDto();
      response.data = employeeDtos;
      response.procedureInfo = procedureInfo;
      response.totalCount = employeeDtos.length;
      
      return response;
    } catch (error: any) {
      console.error('ÏßÅÏõê Ï°∞Ìöå ?§Î•ò:', error);
      throw new Error(`ÏßÅÏõê Ï°∞Ìöå Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§: ${error.message}`);
    } finally {
      await connection.close();
    }
  }

  /**
   * DB?êÏÑú ?§ÏãúÍ∞ÑÏúºÎ°??ÑÎ°ú?úÏ? ?ïÎ≥¥ Ï°∞Ìöå
   */
  private async getProcedureInfo(procedureName: string): Promise<ProcedureInfoDto> {
    try {
      const procedureInfo = await this.procedureDbParser.getProcedureInfoFromDb(procedureName);
      
      const dto = new ProcedureInfoDto();
      dto.name = procedureInfo.name;
      dto.originalCommentLines = procedureInfo.originalCommentLines;
      
      return dto;
    } catch (error) {
      console.error(`?ÑÎ°ú?úÏ? ?ïÎ≥¥ Ï°∞Ìöå ?§Î•ò (${procedureName}):`, error);
      
      // ?§Î•ò Î∞úÏÉù ??Í∏∞Î≥∏ ?ïÎ≥¥ Î∞òÌôò
      const dto = new ProcedureInfoDto();
      dto.name = procedureName;
      dto.originalCommentLines = ['?ÑÎ°ú?úÏ? ?ïÎ≥¥Î•?Ï°∞Ìöå?????ÜÏäµ?àÎã§.'];
      
      return dto;
    }
  }
} 

