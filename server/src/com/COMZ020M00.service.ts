import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import { UnitPriceEntity } from './entities/COMZ020M00.entity';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';
import {
  UnitPriceSaveParams,
  UnitPriceDeleteParams,
  ProcedureInfoDto,
} from './dto/COMZ020M00.dto';

@Injectable()
export class COMZ020M00Service {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly procedureDbParser: ProcedureDbParser,
  ) {}



  async saveUnitPrice(params: any): Promise<{ rtn: string }> {
    const connection = await (
      this.dataSource.driver as any
    ).oracle.getConnection();

    try {
      const result = (await connection.execute(
        `
        BEGIN
          COM_01_0202_T(
            :rtn,
            :ownOutsDiv,
            :year,
            :tcnGrd,
            :dutyCd,
            :unitPrice
          );
        END;
        `,
        {
          rtn: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1000 },
          ownOutsDiv: params.ownOutsDiv,
          year: params.year,
          tcnGrd: params.tcnGrd,
          dutyCd: params.dutyCd,
          unitPrice: params.unitPrice,
        },
      )) as { outBinds: { rtn: string } };

      return { rtn: result.outBinds.rtn };
    } catch (error: any) {
      console.error('?¨κ? ????€λ₯:', error);
      throw new Error(`?¨κ? ???μ€??€λ₯κ° λ°μ?μ΅?λ€: ${error.message}`);
    } finally {
      await connection.close();
    }
  }

  async deleteUnitPrice(params: any): Promise<{ rtn: string }> {
    const connection = await (
      this.dataSource.driver as any
    ).oracle.getConnection();

    try {
      const result = (await connection.execute(
        `
        BEGIN
          COM_01_0203_D(
            :rtn,
            :ownOutsDiv,
            :year,
            :tcnGrd,
            :dutyCd
          );
        END;
        `,
        {
          rtn: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1000 },
          ownOutsDiv: params.ownOutsDiv,
          year: params.year,
          tcnGrd: params.tcnGrd,
          dutyCd: params.dutyCd,
        },
      )) as { outBinds: { rtn: string } };

      return { rtn: result.outBinds.rtn };
    } catch (error: any) {
      console.error('?¨κ? ??  ?€λ₯:', error);
      throw new Error(`?¨κ? ??  μ€??€λ₯κ° λ°μ?μ΅?λ€: ${error.message}`);
    } finally {
      await connection.close();
    }
  }

  /**
   * DB?μ ?€μκ°μΌλ‘??λ‘?μ? ?λ³΄ μ‘°ν
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
      console.error(`?λ‘?μ? ?λ³΄ μ‘°ν ?€λ₯ (${procedureName}):`, error);

      // ?€λ₯ λ°μ ??κΈ°λ³Έ ?λ³΄ λ°ν
      const dto = new ProcedureInfoDto();
      dto.name = procedureName;
      dto.originalCommentLines = ['?λ‘?μ? ?λ³΄λ₯?μ‘°ν?????μ΅?λ€.'];

      return dto;
    }
  }
}


