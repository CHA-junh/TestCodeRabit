import { Controller, Get } from '@nestjs/common';
import { OracleService } from './database/database.provider';

@Controller()
export class AppController {
  constructor(private readonly oracleService: OracleService) {}

  @Get()
  getHello(): string {
    return 'BIST_NEW API ?œë²„ê°€ ?•ìƒ?ìœ¼ë¡??¤í–‰ ì¤‘ì…?ˆë‹¤! ??';
  }

  @Get('health')
  async getHealth() {
    const isConnected = this.oracleService.isConnected();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: isConnected,
        message: isConnected ? 'DB ?°ê²°?? : 'DB ?°ê²° ?ˆë¨',
      },
    };
  }

  @Get('db-test')
  async testDatabase() {
    try {
      const connection = await this.oracleService.getConnection();
      const result = await connection.execute('SELECT 1 as test FROM DUAL');
      await connection.close();

      return {
        success: true,
        message: 'DB ?°ê²° ?ŒìŠ¤???±ê³µ!',
        data: result.rows,
      };
    } catch (error) {
      return {
        success: false,
        message: 'DB ?°ê²° ?ŒìŠ¤???¤íŒ¨',
        error: error.message,
      };
    }
  }
}


