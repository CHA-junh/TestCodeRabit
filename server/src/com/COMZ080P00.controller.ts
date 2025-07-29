import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { COMZ080P00Service } from './COMZ080P00.service';
import { EmployeeSearchRequestDto, EmployeeSearchResponseDto } from './dto/COMZ080P00.dto';

// express-session ?�???�장
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('직원 관�?)
@Controller('COMZ080P00')
export class COMZ080P00Controller {
  constructor(private readonly employeeService: COMZ080P00Service) {}

  @Post('search')
  @ApiOperation({ 
    summary: '직원 검??,
    description: '?�원(직원)??검?�합?�다.'
  })
  @ApiBody({ type: EmployeeSearchRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: '직원 검???�공',
    type: EmployeeSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?�션???�효?��? ?�습?�다.' })
  @ApiResponse({ status: 500, description: '직원 조회 �??�류가 발생?�습?�다.' })
  async searchEmployees(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: EmployeeSearchRequestDto) {
    // ?�션 체크 주석 처리 (Swagger UI ?�스?�용)
    /*
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '?�션???�효?��? ?�습?�다.' });
    }
    */
    
    try {
      const result = await this.employeeService.searchEmployees(body);
      return res.json({ 
        success: true, 
        data: result.data,
        procedureInfo: result.procedureInfo,
        totalCount: result.totalCount
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '직원 조회 �??�류가 발생?�습?�다.', error: err });
    }
  }
} 

