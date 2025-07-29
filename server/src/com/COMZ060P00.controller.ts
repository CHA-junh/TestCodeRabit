import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';  
import { COMZ060P00Service } from './COMZ060P00.service';
import { COMZ060P00ResponseDto } from './dto/COMZ060P00.dto';

/**
 * 부?�번??검??관??API 컨트롤러
 */
@Controller('COMZ060P00')
export class COMZ060P00Controller {
  constructor(private readonly deptNoSearchService: COMZ060P00Service) {}

  /**
   * 부?�번??검??
   * @param requestBody { sp: string, param: any[] }
   */
  @Post('search')
  @ApiOperation({ summary: '부?�번??검??, description: '부?�번??검?? })
  @ApiResponse({ status: 200, description: '부?�번??검???�공', type: COMZ060P00ResponseDto })
  async executeProcedure(@Body() requestBody: { sp: string; param: any[] }): Promise<COMZ060P00ResponseDto> {
    return this.deptNoSearchService.searchDeptNo(requestBody.sp, requestBody.param);
  }
} 

