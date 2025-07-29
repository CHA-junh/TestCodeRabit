import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { COMZ050P00Service } from './COMZ050P00.service';
import { COMZ050P00ResponseDto } from './dto/COMZ050P00.dto';

@ApiTags('?�업명�???)
@Controller('COMZ050P00')
export class COMZ050P00Controller {
  constructor(private readonly businessNameSearchService: COMZ050P00Service) {}

  @Post('search')
  @ApiOperation({ summary: '?�업�?검??, description: '?�업�? ?�작?�도, 진행?�태 ?�으�??�업 리스?��? 조회?�니??' })
  @ApiResponse({ status: 200, description: '검???�공', type: COMZ050P00ResponseDto })
  @ApiResponse({ status: 500, description: '?�버 ?�류' })
  async searchBusinessNames(
    @Body() requestBody: any,
  ): Promise<{ success: boolean; data: any[]; message?: string }> {
    try {
      if (!requestBody.sp || !requestBody.param) {
        throw new HttpException('?�수 ?�라미터가 ?�락?�었?�니??', HttpStatus.BAD_REQUEST);
      }

      const result = await this.businessNameSearchService.searchBusinessNames(
        requestBody.sp, 
        requestBody.param
      );

      return {
        success: true,
        data: result.data || [],
        message: `${result.data?.length || 0}건의 ?�업??검?�되?�습?�다.`
      };
    } catch (error) {
      throw new HttpException(
        error.message || '?�업�?검??�??�류가 발생?�습?�다.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 

