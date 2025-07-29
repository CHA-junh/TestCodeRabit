import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { CodeService } from './code.service';
import { CodeSearchRequestDto, CodeSearchResponseDto } from './dto/code.dto';

// express-session ?�???�장
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('코드 관�?)
@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post('search')
  @ApiOperation({ 
    summary: '코드 조회',
    description: '?�분류코드???�당?�는 ?�분�?코드?�을 조회?�니??'
  })
  @ApiBody({ type: CodeSearchRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: '코드 조회 ?�공',
    type: CodeSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?�션???�효?��? ?�습?�다.' })
  @ApiResponse({ status: 500, description: '코드 조회 �??�류가 발생?�습?�다.' })
  async searchCodes(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: CodeSearchRequestDto) {
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
      const result = await this.codeService.searchCodes(body.largeCategoryCode);
      return res.json({ 
        success: true, 
        data: result.data,
        procedureInfo: result.procedureInfo,
        totalCount: result.totalCount
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '코드 조회 �??�류가 발생?�습?�다.', error: err });
    }
  }
} 

