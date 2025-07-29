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
      console.error('?��? ?�???�류:', error);
      throw new Error(`?��? ?�??�??�류가 발생?�습?�다: ${error.message}`);
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
      console.error('?��? ??�� ?�류:', error);
      throw new Error(`?��? ??�� �??�류가 발생?�습?�다: ${error.message}`);
    } finally {
      await connection.close();
    }
  }

  /**
   * DB?�서 ?�시간으�??�로?��? ?�보 조회
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
      console.error(`?�로?��? ?�보 조회 ?�류 (${procedureName}):`, error);

      // ?�류 발생 ??기본 ?�보 반환
      const dto = new ProcedureInfoDto();
      dto.name = procedureName;
      dto.originalCommentLines = ['?�로?��? ?�보�?조회?????�습?�다.'];

      return dto;
    }
  }
}


