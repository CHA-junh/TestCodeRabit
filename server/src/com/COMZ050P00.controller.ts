import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { COMZ050P00Service } from './COMZ050P00.service';
import { COMZ050P00ResponseDto } from './dto/COMZ050P00.dto';

@ApiTags('사업명검색')
@Controller('COMZ050P00')
export class COMZ050P00Controller {
  constructor(private readonly businessNameSearchService: COMZ050P00Service) {}

  @Post('search')
  @ApiOperation({ summary: '사업명 검색', description: '사업명, 시작년도, 진행상태 등으로 사업 리스트를 조회합니다.' })
  @ApiResponse({ status: 200, description: '검색 성공', type: COMZ050P00ResponseDto })
  @ApiResponse({ status: 500, description: '서버 오류' })
  async searchBusinessNames(
    @Body() requestBody: any,
  ): Promise<{ success: boolean; data: any[]; message?: string }> {
    try {
      if (!requestBody.sp || !requestBody.param) {
        throw new HttpException('필수 파라미터가 누락되었습니다.', HttpStatus.BAD_REQUEST);
      }

      const result = await this.businessNameSearchService.searchBusinessNames(
        requestBody.sp, 
        requestBody.param
      );

      return {
        success: true,
        data: result.data || [],
        message: `${result.data?.length || 0}건의 사업이 검색되었습니다.`
      };
    } catch (error) {
      throw new HttpException(
        error.message || '사업명 검색 중 오류가 발생했습니다.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 