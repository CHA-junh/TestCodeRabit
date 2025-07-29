import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OracleService implements OnModuleInit, OnModuleDestroy {
  private pool: oracledb.Pool | null = null;
  private static isInitialized = false; // 중복 초기??방�?

  // ?�� ?�경변???�인
  private checkEnvironmentVariables(): { valid: boolean; missing: string[] } {
    const requiredVars = [
      'DB_USER',
      'DB_PASSWORD',
      'DB_HOST',
      'DB_PORT',
      'DB_SERVICE',
    ];
    const missing: string[] = [];

    requiredVars.forEach((varName) => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  // ??NestJS가 ?�작?????�동?�로 ?�행??
  async onModuleInit() {
    // 중복 초기??방�?
    if (OracleService.isInitialized) {
      console.log('?�️ Oracle 커넥???�???��? 초기?�되?�습?�다.');
      return;
    }

    try {
      const envCheck = this.checkEnvironmentVariables();
      if (!envCheck.valid) {
        throw new Error(
          `?�경 변?��? ?�락?�었?�니?? ${envCheck.missing.join(', ')}`,
        );
      }

      this.pool = await oracledb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 1,
      });

      OracleService.isInitialized = true;
      console.log('??Oracle 커넥???� ?�성 ?�료');
    } catch (error) {
      console.error('??커넥???� ?�성 ?�패:', error);
      throw error;
    }
  }

  // ?�� 커넥??가?�오�?
  async getConnection(): Promise<oracledb.Connection> {
    if (!this.pool) {
      throw new Error('??커넥???�???�직 ?�성?��? ?�았?�니??');
    }

    return await this.pool.getConnection();
  }

  // ?�� 커넥???� ?�성 ?��? ?�인
  isConnected(): boolean {
    return this.pool !== null;
  }

  // ?�� ?�로?��? ?�행
  async executeProcedure(
    procedureName: string,
    params: any[] = [],
  ): Promise<any> {
    const connection = await this.getConnection();

    // OUT ?�라미터 ?�??분기: 조회(_S)�?CURSOR, ?�니�?STRING
    const isSelectProc = procedureName.endsWith('_S');

    try {
      const bindVars: any = {
        o_result: {
          type: isSelectProc ? oracledb.CURSOR : oracledb.STRING,
          dir: oracledb.BIND_OUT,
        },
      };

      params.forEach((param, i) => {
        bindVars[`p${i + 1}`] = param;
      });

      const result = await connection.execute(
        `BEGIN ${procedureName}(:o_result${params.length > 0 ? ', ' + params.map((_, i) => `:p${i + 1}`).join(', ') : ''}); END;`,
        bindVars,
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );

      const outBinds = result.outBinds as any;
      if (outBinds?.o_result) {
        if (isSelectProc) {
          // 조회 ?�로?��?: CURSOR 반환 (?�?�량 ?�전, getRow 루프)
          const cursor = outBinds.o_result;
          let rows: any[] = [];
          let row;
          while ((row = await cursor.getRow())) {
            rows.push(row);
          }
          await cursor.close();
          return { data: rows, totalCount: rows.length };
        } else {
          // ?�반 ?�로?��?: STRING 반환 + COMMIT 처리
          await connection.commit();
          return { result: outBinds.o_result };
        }
      }

      // 결과가 ?�는 경우?�도 C/U/D ?�로?��???COMMIT 처리
      if (!isSelectProc) {
        await connection.commit();
      }

      return isSelectProc ? { data: [], totalCount: 0 } : { result: null };
    } catch (error) {
      // ?�로?��? ?�행 ?�패 ??ROLLBACK 처리
      if (!isSelectProc) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error('ROLLBACK ?�패:', rollbackError);
        }
      }
      throw error;
    } finally {
      await connection.close();
    }
  }

  // ?�� NestJS 종료 ???�동 ?�출
  async onModuleDestroy() {
    try {
      if (this.pool && OracleService.isInitialized) {
        await this.pool.close(10); // 10�??�에 ?�전?�게 종료
        OracleService.isInitialized = false;
        console.log('?�� Oracle 커넥???� 종료 ?�료');
      }
    } catch (error) {
      console.error('??커넥???� 종료 ?�패:', error);
      throw error;
    }
  }
}


