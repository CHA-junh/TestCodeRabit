import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import { UserEntity } from './entities/COMZ100P00.entity';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';
import { UserSearchParams, UserSearchResponseDto, ProcedureInfoDto } from './dto/COMZ100P00.dto';

@Injectable()
export class COMZ100P00Service {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly procedureDbParser: ProcedureDbParser
  ) {}

  async searchUsers(
    userNm: string, 
    hqDiv: string = 'ALL', 
    deptDiv: string = 'ALL'
  ): Promise<UserSearchResponseDto> {
    const connection = await (this.dataSource.driver as any).oracle.getConnection();
    
    try {
      const result = await connection.execute(
        `
        BEGIN
          USR_01_0201_S(
            :cursor,
            :hq,
            :dept,
            :name
          );
        END;
        `,
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          hq: hqDiv,
          dept: deptDiv,
          name: userNm || null
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT
        }
      ) as { outBinds: { cursor: oracledb.ResultSet<any> } };
      
      const rs = result.outBinds.cursor;
      const rows = await rs.getRows(100);
      await rs.close();
      
      if (!rows || rows.length === 0) {
        const response = new UserSearchResponseDto();
        response.data = [];
        response.procedureInfo = await this.getProcedureInfo('USR_01_0201_S');
        response.totalCount = 0;
        return response;
      }
      
      // UserEntity ?νλ‘?λ³??
      const users = rows.map((row: any) => ({
        // ?€μ  DB μ»¬λΌ??
        EMP_NO: row.EMP_NO,
        EMP_NM: row.EMP_NM,
        HQ_DIV_CD: row.HQ_DIV_CD,
        HQ_DIV_NM: row.HQ_DIV_NM,
        DEPT_DIV_CD: row.DEPT_DIV_CD,
        DEPT_DIV_NM: row.DEPT_DIV_NM,
        DUTY_CD: row.DUTY_CD,
        DUTY_NM: row.DUTY_NM,
        AUTH_CD: row.AUTH_CD,
        AUTH_CD_NM: row.AUTH_CD_NM,
        BSN_USE_YN: row.BSN_USE_YN,
        WPC_USE_YN: row.WPC_USE_YN,
        PSM_USE_YN: row.PSM_USE_YN,
        EMAIL_ADDR: row.EMAIL_ADDR,
        APV_APOF_ID: row.APV_APOF_ID,
        DUTY_DIV_CD: row.DUTY_DIV_CD,
        DUTY_DIV_CD_NM: row.DUTY_DIV_CD_NM,
        OWN_OUTS_DIV: row.OWN_OUTS_DIV,
        ENTR_NO: row.ENTR_NO,
        ENTR_DT: row.ENTR_DT,
        RETIR_DT: row.RETIR_DT,
        WMAIL_YN: row.WMAIL_YN,
        WRK_CNT: row.WRK_CNT,
        LAST_WRK: row.LAST_WRK
      }));
      
      // DB?μ ?€μκ°μΌλ‘??λ‘?μ? ?λ³΄ κ°?Έμ€κΈ?
      const procedureInfo = await this.getProcedureInfo('USR_01_0201_S');
      
      const response = new UserSearchResponseDto();
      response.data = users;
      response.procedureInfo = procedureInfo;
      response.totalCount = users.length;
      
      return response;
    } catch (error: any) {
      console.error('?¬μ©??μ‘°ν ?€λ₯:', error);
      throw new Error(`?¬μ©??μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€: ${error.message}`);
    } finally {
      await connection.close();
    }
  }

  /**
   * DB?μ ?€μκ°μΌλ‘??λ‘?μ? ?λ³΄ μ‘°ν
   */
  private async getProcedureInfo(procedureName: string): Promise<ProcedureInfoDto> {
    try {
      const procedureInfo = await this.procedureDbParser.getProcedureInfoFromDb(procedureName);
      
      const dto = new ProcedureInfoDto();
      dto.name = procedureInfo.name;
      dto.originalCommentLines = procedureInfo.originalCommentLines;
      
      return dto;
    } catch (error) {
      console.error(`?λ‘?μ? ?λ³΄ μ‘°ν ?€λ₯ (${procedureName}):`, error);
      
      // ?€λ₯ λ°μ ??κΈ°λ³Έ ?λ³΄ λ°ν
      const dto = new ProcedureInfoDto();
      dto.name = procedureName;
      dto.originalCommentLines = ['?λ‘?μ? ?λ³΄λ₯?μ‘°ν?????μ΅?λ€.'];
      
      return dto;
    }
  }
} 

