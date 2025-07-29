import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OracleService implements OnModuleInit, OnModuleDestroy {
  private pool: oracledb.Pool | null = null;
  private static isInitialized = false; // 중복 초기화 방지

  // 🟡 환경변수 확인
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

  // ✅ NestJS가 시작될 때 자동으로 실행됨
  async onModuleInit() {
    // 중복 초기화 방지
    if (OracleService.isInitialized) {
      console.log('ℹ️ Oracle 커넥션 풀이 이미 초기화되었습니다.');
      return;
    }

    try {
      const envCheck = this.checkEnvironmentVariables();
      if (!envCheck.valid) {
        throw new Error(
          `환경 변수가 누락되었습니다: ${envCheck.missing.join(', ')}`,
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
      console.log('✅ Oracle 커넥션 풀 생성 완료');
    } catch (error) {
      console.error('❌ 커넥션 풀 생성 실패:', error);
      throw error;
    }
  }

  // 🔄 커넥션 가져오기
  async getConnection(): Promise<oracledb.Connection> {
    if (!this.pool) {
      throw new Error('❗ 커넥션 풀이 아직 생성되지 않았습니다.');
    }

    return await this.pool.getConnection();
  }

  // 🔍 커넥션 풀 생성 여부 확인
  isConnected(): boolean {
    return this.pool !== null;
  }

  // 📋 프로시저 실행
  async executeProcedure(
    procedureName: string,
    params: any[] = [],
  ): Promise<any> {
    const connection = await this.getConnection();

    // OUT 파라미터 타입 분기: 조회(_S)면 CURSOR, 아니면 STRING
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
          // 조회 프로시저: CURSOR 반환 (대용량 안전, getRow 루프)
          const cursor = outBinds.o_result;
          let rows: any[] = [];
          let row;
          while ((row = await cursor.getRow())) {
            rows.push(row);
          }
          await cursor.close();
          return { data: rows, totalCount: rows.length };
        } else {
          // 일반 프로시저: STRING 반환 + COMMIT 처리
          await connection.commit();
          return { result: outBinds.o_result };
        }
      }

      // 결과가 없는 경우에도 C/U/D 프로시저는 COMMIT 처리
      if (!isSelectProc) {
        await connection.commit();
      }

      return isSelectProc ? { data: [], totalCount: 0 } : { result: null };
    } catch (error) {
      // 프로시저 실행 실패 시 ROLLBACK 처리
      if (!isSelectProc) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error('ROLLBACK 실패:', rollbackError);
        }
      }
      throw error;
    } finally {
      await connection.close();
    }
  }

  // 🔌 NestJS 종료 시 자동 호출
  async onModuleDestroy() {
    try {
      if (this.pool && OracleService.isInitialized) {
        await this.pool.close(10); // 10초 안에 안전하게 종료
        OracleService.isInitialized = false;
        console.log('🔌 Oracle 커넥션 풀 종료 완료');
      }
    } catch (error) {
      console.error('❌ 커넥션 풀 종료 실패:', error);
      throw error;
    }
  }
}
