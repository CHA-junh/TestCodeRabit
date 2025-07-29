import { Controller, Get } from '@nestjs/common';
import { OracleService } from './database/database.provider';

@Controller()
export class AppController {
  constructor(private readonly oracleService: OracleService) {}

  @Get()
  getHello(): string {
    return 'BIST_NEW API 서버가 정상적으로 실행 중입니다! 🚀';
  }

  @Get('health')
  async getHealth() {
    const isConnected = this.oracleService.isConnected();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: isConnected,
        message: isConnected ? 'DB 연결됨' : 'DB 연결 안됨',
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
        message: 'DB 연결 테스트 성공!',
        data: result.rows,
      };
    } catch (error) {
      return {
        success: false,
        message: 'DB 연결 테스트 실패',
        error: error.message,
      };
    }
  }
}
