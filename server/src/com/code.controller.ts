import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { CodeService } from './code.service';
import { CodeSearchRequestDto, CodeSearchResponseDto } from './dto/code.dto';

// express-session ?€???•ì¥
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('ì½”ë“œ ê´€ë¦?)
@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post('search')
  @ApiOperation({ 
    summary: 'ì½”ë“œ ì¡°íšŒ',
    description: '?€ë¶„ë¥˜ì½”ë“œ???´ë‹¹?˜ëŠ” ?Œë¶„ë¥?ì½”ë“œ?¤ì„ ì¡°íšŒ?©ë‹ˆ??'
  })
  @ApiBody({ type: CodeSearchRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'ì½”ë“œ ì¡°íšŒ ?±ê³µ',
    type: CodeSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?¸ì…˜??? íš¨?˜ì? ?ŠìŠµ?ˆë‹¤.' })
  @ApiResponse({ status: 500, description: 'ì½”ë“œ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' })
  async searchCodes(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: CodeSearchRequestDto) {
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
        .json({ success: false, message: 'ì½”ë“œ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', error: err });
    }
  }
} 

