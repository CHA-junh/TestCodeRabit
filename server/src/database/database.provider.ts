import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OracleService implements OnModuleInit, OnModuleDestroy {
  private pool: oracledb.Pool | null = null;
  private static isInitialized = false; // ì¤‘ë³µ ì´ˆê¸°??ë°©ì?

  // ?Ÿ¡ ?˜ê²½ë³€???•ì¸
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

  // ??NestJSê°€ ?œì‘?????ë™?¼ë¡œ ?¤í–‰??
  async onModuleInit() {
    // ì¤‘ë³µ ì´ˆê¸°??ë°©ì?
    if (OracleService.isInitialized) {
      console.log('?¹ï¸ Oracle ì»¤ë„¥???€???´ë? ì´ˆê¸°?”ë˜?ˆìŠµ?ˆë‹¤.');
      return;
    }

    try {
      const envCheck = this.checkEnvironmentVariables();
      if (!envCheck.valid) {
        throw new Error(
          `?˜ê²½ ë³€?˜ê? ?„ë½?˜ì—ˆ?µë‹ˆ?? ${envCheck.missing.join(', ')}`,
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
      console.log('??Oracle ì»¤ë„¥???€ ?ì„± ?„ë£Œ');
    } catch (error) {
      console.error('??ì»¤ë„¥???€ ?ì„± ?¤íŒ¨:', error);
      throw error;
    }
  }

  // ?”„ ì»¤ë„¥??ê°€?¸ì˜¤ê¸?
  async getConnection(): Promise<oracledb.Connection> {
    if (!this.pool) {
      throw new Error('??ì»¤ë„¥???€???„ì§ ?ì„±?˜ì? ?Šì•˜?µë‹ˆ??');
    }

    return await this.pool.getConnection();
  }

  // ?” ì»¤ë„¥???€ ?ì„± ?¬ë? ?•ì¸
  isConnected(): boolean {
    return this.pool !== null;
  }

  // ?“‹ ?„ë¡œ?œì? ?¤í–‰
  async executeProcedure(
    procedureName: string,
    params: any[] = [],
  ): Promise<any> {
    const connection = await this.getConnection();

    // OUT ?Œë¼ë¯¸í„° ?€??ë¶„ê¸°: ì¡°íšŒ(_S)ë©?CURSOR, ?„ë‹ˆë©?STRING
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
          // ì¡°íšŒ ?„ë¡œ?œì?: CURSOR ë°˜í™˜ (?€?©ëŸ‰ ?ˆì „, getRow ë£¨í”„)
          const cursor = outBinds.o_result;
          let rows: any[] = [];
          let row;
          while ((row = await cursor.getRow())) {
            rows.push(row);
          }
          await cursor.close();
          return { data: rows, totalCount: rows.length };
        } else {
          // ?¼ë°˜ ?„ë¡œ?œì?: STRING ë°˜í™˜ + COMMIT ì²˜ë¦¬
          await connection.commit();
          return { result: outBinds.o_result };
        }
      }

      // ê²°ê³¼ê°€ ?†ëŠ” ê²½ìš°?ë„ C/U/D ?„ë¡œ?œì???COMMIT ì²˜ë¦¬
      if (!isSelectProc) {
        await connection.commit();
      }

      return isSelectProc ? { data: [], totalCount: 0 } : { result: null };
    } catch (error) {
      // ?„ë¡œ?œì? ?¤í–‰ ?¤íŒ¨ ??ROLLBACK ì²˜ë¦¬
      if (!isSelectProc) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error('ROLLBACK ?¤íŒ¨:', rollbackError);
        }
      }
      throw error;
    } finally {
      await connection.close();
    }
  }

  // ?”Œ NestJS ì¢…ë£Œ ???ë™ ?¸ì¶œ
  async onModuleDestroy() {
    try {
      if (this.pool && OracleService.isInitialized) {
        await this.pool.close(10); // 10ì´??ˆì— ?ˆì „?˜ê²Œ ì¢…ë£Œ
        OracleService.isInitialized = false;
        console.log('?”Œ Oracle ì»¤ë„¥???€ ì¢…ë£Œ ?„ë£Œ');
      }
    } catch (error) {
      console.error('??ì»¤ë„¥???€ ì¢…ë£Œ ?¤íŒ¨:', error);
      throw error;
    }
  }
}


