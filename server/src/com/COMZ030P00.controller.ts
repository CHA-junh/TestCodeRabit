import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ030P00Service } from './COMZ030P00.service';
import { 
  UnitPriceSearchParams, 
  UnitPriceSearchResponseDto 
} from './dto/COMZ030P00.dto';

// express-session ?€???•ì¥
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('?¨ê? ê²€??)
@Controller('COMZ030P00')
export class COMZ030P00Controller {
  constructor(private readonly comz030p00Service: COMZ030P00Service) {}

  @Post('search')
  @ApiOperation({ 
    summary: '?¨ê? ê²€??,
    description: '?±ê¸‰ë³??¨ê?ë¥?ê²€?‰í•©?ˆë‹¤.'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?¨ê? ê²€???±ê³µ',
    type: UnitPriceSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?¸ì…˜??? íš¨?˜ì? ?ŠìŠµ?ˆë‹¤.' })
  @ApiResponse({ status: 500, description: '?¨ê? ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' })
  async searchUnitPrices(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceSearchParams) {
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
      const result = await this.comz030p00Service.searchUnitPrices(
        body.ownOutsDiv,
        body.year,
        body.bsnNo
      );
      return res.json({ 
        success: true, 
        data: result.data,
        procedureInfo: result.procedureInfo,
        totalCount: result.totalCount
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '?¨ê? ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', error: err });
    }
  }
} 

