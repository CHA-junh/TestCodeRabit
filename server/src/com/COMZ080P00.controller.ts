import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { COMZ080P00Service } from './COMZ080P00.service';
import { EmployeeSearchRequestDto, EmployeeSearchResponseDto } from './dto/COMZ080P00.dto';

// express-session ?€???•ì¥
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('ì§ì› ê´€ë¦?)
@Controller('COMZ080P00')
export class COMZ080P00Controller {
  constructor(private readonly employeeService: COMZ080P00Service) {}

  @Post('search')
  @ApiOperation({ 
    summary: 'ì§ì› ê²€??,
    description: '?¬ì›(ì§ì›)??ê²€?‰í•©?ˆë‹¤.'
  })
  @ApiBody({ type: EmployeeSearchRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'ì§ì› ê²€???±ê³µ',
    type: EmployeeSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?¸ì…˜??? íš¨?˜ì? ?ŠìŠµ?ˆë‹¤.' })
  @ApiResponse({ status: 500, description: 'ì§ì› ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' })
  async searchEmployees(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: EmployeeSearchRequestDto) {
    // ?¸ì…˜ ì²´í¬ ì£¼ì„ ì²˜ë¦¬ (Swagger UI ?ŒìŠ¤?¸ìš©)
    /*
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '?¸ì…˜??? íš¨?˜ì? ?ŠìŠµ?ˆë‹¤.' });
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
        .json({ success: false, message: 'ì§ì› ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', error: err });
    }
  }
} 

