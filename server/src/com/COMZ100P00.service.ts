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
      
      // UserEntity 형태로 변환
      const users = rows.map((row: any) => ({
        // 실제 DB 컬럼들
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
      
      // DB에서 실시간으로 프로시저 정보 가져오기
      const procedureInfo = await this.getProcedureInfo('USR_01_0201_S');
      
      const response = new UserSearchResponseDto();
      response.data = users;
      response.procedureInfo = procedureInfo;
      response.totalCount = users.length;
      
      return response;
    } catch (error: any) {
      console.error('사용자 조회 오류:', error);
      throw new Error(`사용자 조회 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      await connection.close();
    }
  }

  /**
   * DB에서 실시간으로 프로시저 정보 조회
   */
  private async getProcedureInfo(procedureName: string): Promise<ProcedureInfoDto> {
    try {
      const procedureInfo = await this.procedureDbParser.getProcedureInfoFromDb(procedureName);
      
      const dto = new ProcedureInfoDto();
      dto.name = procedureInfo.name;
      dto.originalCommentLines = procedureInfo.originalCommentLines;
      
      return dto;
    } catch (error) {
      console.error(`프로시저 정보 조회 오류 (${procedureName}):`, error);
      
      // 오류 발생 시 기본 정보 반환
      const dto = new ProcedureInfoDto();
      dto.name = procedureName;
      dto.originalCommentLines = ['프로시저 정보를 조회할 수 없습니다.'];
      
      return dto;
    }
  }
} 