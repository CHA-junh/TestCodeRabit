import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';  
import { COMZ060P00Service } from './COMZ060P00.service';
import { COMZ060P00ResponseDto } from './dto/COMZ060P00.dto';

/**
 * 부서번호 검색 관련 API 컨트롤러
 */
@Controller('COMZ060P00')
export class COMZ060P00Controller {
  constructor(private readonly deptNoSearchService: COMZ060P00Service) {}

  /**
   * 부서번호 검색
   * @param requestBody { sp: string, param: any[] }
   */
  @Post('search')
  @ApiOperation({ summary: '부서번호 검색', description: '부서번호 검색' })
  @ApiResponse({ status: 200, description: '부서번호 검색 성공', type: COMZ060P00ResponseDto })
  async executeProcedure(@Body() requestBody: { sp: string; param: any[] }): Promise<COMZ060P00ResponseDto> {
    return this.deptNoSearchService.searchDeptNo(requestBody.sp, requestBody.param);
  }
} 