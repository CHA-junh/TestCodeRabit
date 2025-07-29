import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ100P00Service } from './COMZ100P00.service';
import { UserSearchParams, UserSearchResponseDto } from './dto/COMZ100P00.dto';

// express-session ?€???•ì¥
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('?¬ìš©??ê´€ë¦?)
@Controller('COMZ100P00')
export class COMZ100P00Controller {
  constructor(private readonly usersService: COMZ100P00Service) {}

  @Post('search')
  @ApiOperation({ 
    summary: '?¬ìš©??ê²€??,
    description: '?¬ìš©?ëª…?¼ë¡œ ?¬ìš©?ë? ê²€?‰í•©?ˆë‹¤.'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?¬ìš©??ê²€???±ê³µ',
    type: UserSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?¸ì…˜??? íš¨?˜ì? ?ŠìŠµ?ˆë‹¤.' })
  @ApiResponse({ status: 500, description: '?¬ìš©??ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' })
  async searchUsers(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UserSearchParams) {
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
      const result = await this.usersService.searchUsers(body.userNm, body.hqDiv, body.deptDiv);
      return res.json({ 
        success: true, 
        data: result.data,
        procedureInfo: result.procedureInfo,
        totalCount: result.totalCount
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '?¬ìš©??ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', error: err });
    }
  }
} 

