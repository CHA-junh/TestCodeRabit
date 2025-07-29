import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { COMZ050P00Service } from './COMZ050P00.service';
import { COMZ050P00ResponseDto } from './dto/COMZ050P00.dto';

@ApiTags('?¬μ—…λª…κ???)
@Controller('COMZ050P00')
export class COMZ050P00Controller {
  constructor(private readonly businessNameSearchService: COMZ050P00Service) {}

  @Post('search')
  @ApiOperation({ summary: '?¬μ—…λª?κ²€??, description: '?¬μ—…λª? ?μ‘?„λ„, μ§„ν–‰?νƒ ?±μΌλ΅??¬μ—… λ¦¬μ¤?Έλ? μ΅°ν?©λ‹??' })
  @ApiResponse({ status: 200, description: 'κ²€???±κ³µ', type: COMZ050P00ResponseDto })
  @ApiResponse({ status: 500, description: '?λ²„ ?¤λ¥' })
  async searchBusinessNames(
    @Body() requestBody: any,
  ): Promise<{ success: boolean; data: any[]; message?: string }> {
    try {
      if (!requestBody.sp || !requestBody.param) {
        throw new HttpException('?„μ ?λΌλ―Έν„°κ°€ ?„λ½?μ—?µλ‹??', HttpStatus.BAD_REQUEST);
      }

      const result = await this.businessNameSearchService.searchBusinessNames(
        requestBody.sp, 
        requestBody.param
      );

      return {
        success: true,
        data: result.data || [],
        message: `${result.data?.length || 0}κ±΄μ ?¬μ—…??κ²€?‰λ?μµ?λ‹¤.`
      };
    } catch (error) {
      throw new HttpException(
        error.message || '?¬μ—…λª?κ²€??μ¤??¤λ¥κ°€ λ°μƒ?μµ?λ‹¤.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 

