import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import { UnitPriceEntity } from './entities/COMZ030P00.entity';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';
import {
  UnitPriceSearchParams,
  UnitPriceSearchResponseDto,
  ProcedureInfoDto,
} from './dto/COMZ030P00.dto';

@Injectable()
export class COMZ030P00Service {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly procedureDbParser: ProcedureDbParser,
  ) {}

  async searchUnitPrices(
    ownOutsDiv: string,
    year: string,
    bsnNo?: string,
  ): Promise<UnitPriceSearchResponseDto> {
    const connection = await (
      this.dataSource.driver as any
    ).oracle.getConnection();

    try {
      const result = (await connection.execute(
        `
        BEGIN
          COM_01_0201_S(
            :cursor,
            :ownOutsDiv,
            :year,
            :bsnNo
          );
        END;
        `,
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          ownOutsDiv: ownOutsDiv || 'A',
          year: year,
          bsnNo: bsnNo || null,
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        },
      )) as { outBinds: { cursor: oracledb.ResultSet<any> } };

      const rs = result.outBinds.cursor;
      const rows = await rs.getRows(100);
      await rs.close();

      if (!rows || rows.length === 0) {
        const response = new UnitPriceSearchResponseDto();
        response.data = [];
        response.procedureInfo = await this.getProcedureInfo('COM_01_0201_S');
        response.totalCount = 0;
        return response;
      }

      // UnitPriceEntity ?ïÌÉúÎ°?Î≥Ä??
      const unitPrices = rows.map((row: any) => {
        return {
          OWN_OUTS_DIV:
            row.OWN_OUTS_DIV ||
            row.ownOutsDiv ||
            row.OWN_OUTS_DIV_CD ||
            row.ownOutsDivCd ||
            '',
          OWN_OUTS_DIV_NM:
            (row.OWN_OUTS_DIV ||
              row.ownOutsDiv ||
              row.OWN_OUTS_DIV_CD ||
              row.ownOutsDivCd) === '1'
              ? '?êÏÇ¨'
              : '?∏Ï£º',
          YR: row.YR || row.YEAR || row.year || row.YR_CD || row.yrCd || '',
          TCN_GRD:
            row.TCN_GRD || row.tcnGrd || row.TCN_GRD_CD || row.tcnGrdCd || '',
          TCN_GRD_NM:
            row.TCN_GRD_NM ||
            row.tcnGrdNm ||
            row.TCN_GRD_NM_CD ||
            row.tcnGrdNmCd ||
            '',
          DUTY_CD:
            row.DUTY_CD || row.dutyCd || row.DUTY_CD_CD || row.dutyCdCd || '',
          DUTY_NM:
            row.DUTY_NM || row.dutyNm || row.DUTY_NM_CD || row.dutyNmCd || '',
          UPRC:
            row.UPRC ||
            row.UNIT_PRICE ||
            row.unitPrice ||
            row.UPRC_CD ||
            row.uprcCd ||
            '',
        };
      });

      // DB?êÏÑú ?§ÏãúÍ∞ÑÏúºÎ°??ÑÎ°ú?úÏ? ?ïÎ≥¥ Í∞Ä?∏Ïò§Í∏?
      const procedureInfo = await this.getProcedureInfo('COM_01_0201_S');

      const response = new UnitPriceSearchResponseDto();
      response.data = unitPrices;
      response.procedureInfo = procedureInfo;
      response.totalCount = unitPrices.length;

      return response;
    } catch (error: any) {
      console.error('?®Í? Ï°∞Ìöå ?§Î•ò:', error);
      throw new Error(`?®Í? Ï°∞Ìöå Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§: ${error.message}`);
    } finally {
      await connection.close();
    }
  }

  /**
   * DB?êÏÑú ?§ÏãúÍ∞ÑÏúºÎ°??ÑÎ°ú?úÏ? ?ïÎ≥¥ Ï°∞Ìöå
   */
  private async getProcedureInfo(
    procedureName: string,
  ): Promise<ProcedureInfoDto> {
    try {
      const procedureInfo =
        await this.procedureDbParser.getProcedureInfoFromDb(procedureName);

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

