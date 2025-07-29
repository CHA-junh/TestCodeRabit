import { Controller, Get } from '@nestjs/common';
import { OracleService } from './database/database.provider';

@Controller()
export class AppController {
  constructor(private readonly oracleService: OracleService) {}

  @Get()
  getHello(): string {
    return 'BIST_NEW API ?�버가 ?�상?�으�??�행 중입?�다! ??';
  }

  @Get('health')
  async getHealth() {
    const isConnected = this.oracleService.isConnected();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: isConnected,
        message: isConnected ? 'DB ?�결?? : 'DB ?�결 ?�됨',
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
        message: 'DB ?�결 ?�스???�공!',
        data: result.rows,
      };
    } catch (error) {
      return {
        success: false,
        message: 'DB ?�결 ?�스???�패',
        error: error.message,
      };
    }
  }
}


