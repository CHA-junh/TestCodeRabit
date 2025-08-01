import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { COMZ080P00Service } from './COMZ080P00.service';
import { EmployeeSearchRequestDto, EmployeeSearchResponseDto } from './dto/COMZ080P00.dto';

// express-session ????μ₯
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('μ§μ κ΄λ¦?)
@Controller('COMZ080P00')
export class COMZ080P00Controller {
  constructor(private readonly employeeService: COMZ080P00Service) {}

  @Post('search')
  @ApiOperation({ 
    summary: 'μ§μ κ²??,
    description: '?¬μ(μ§μ)??κ²?ν©?λ€.'
  })
  @ApiBody({ type: EmployeeSearchRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'μ§μ κ²???±κ³΅',
    type: EmployeeSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?Έμ??? ν¨?μ? ?μ΅?λ€.' })
  @ApiResponse({ status: 500, description: 'μ§μ μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.' })
  async searchEmployees(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: EmployeeSearchRequestDto) {
    // ?Έμ μ²΄ν¬ μ£Όμ μ²λ¦¬ (Swagger UI ?μ€?Έμ©)
    /*
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '?Έμ??? ν¨?μ? ?μ΅?λ€.' });
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
        .json({ success: false, message: 'μ§μ μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.', error: err });
    }
  }
} 

