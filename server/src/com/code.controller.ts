import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { CodeService } from './code.service';
import { CodeSearchRequestDto, CodeSearchResponseDto } from './dto/code.dto';

// express-session ????μ₯
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('μ½λ κ΄λ¦?)
@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post('search')
  @ApiOperation({ 
    summary: 'μ½λ μ‘°ν',
    description: '?λΆλ₯μ½λ???΄λΉ?λ ?λΆλ₯?μ½λ?€μ μ‘°ν?©λ??'
  })
  @ApiBody({ type: CodeSearchRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'μ½λ μ‘°ν ?±κ³΅',
    type: CodeSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?Έμ??? ν¨?μ? ?μ΅?λ€.' })
  @ApiResponse({ status: 500, description: 'μ½λ μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.' })
  async searchCodes(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: CodeSearchRequestDto) {
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
        .json({ success: false, message: 'μ½λ μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.', error: err });
    }
  }
} 

