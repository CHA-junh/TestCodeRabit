import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ020M00Service } from './COMZ020M00.service';
import { 
  UnitPriceSaveParams, 
  UnitPriceDeleteParams
} from './dto/COMZ020M00.dto';

// express-session ?€???•ì¥
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('?¨ê? ê´€ë¦?)
@Controller('COMZ020M00')
export class COMZ020M00Controller {
  constructor(private readonly unitPriceService: COMZ020M00Service) {}



  @Post('save')
  @ApiOperation({ 
    summary: '?¨ê? ?€??,
    description: '?±ê¸‰ë³??¨ê?ë¥??€?¥í•©?ˆë‹¤. ê¸°ì¡´ ?¨ê?ê°€ ?ˆìœ¼ë©??…ë°?´íŠ¸?˜ê³ , ?†ìœ¼ë©??ˆë¡œ ?ì„±?©ë‹ˆ??'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?¨ê? ?€???±ê³µ',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            rtn: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: '?¸ì…˜??? íš¨?˜ì? ?ŠìŠµ?ˆë‹¤.' })
  @ApiResponse({ status: 500, description: '?¨ê? ?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' })
  async saveUnitPrice(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceSaveParams) {
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
      const result = await this.unitPriceService.saveUnitPrice(body);
      return res.json({ success: true, data: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '?¨ê? ?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', error: err });
    }
  }

  @Post('delete')
  @ApiOperation({ 
    summary: '?¨ê? ?? œ',
    description: '?±ê¸‰ë³??¨ê?ë¥??? œ?©ë‹ˆ?? ì§€?•ëœ ì¡°ê±´???¨ê?ê°€ ì¡´ì¬?˜ë©´ ?? œ?©ë‹ˆ??'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?¨ê? ?? œ ?±ê³µ',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            rtn: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: '?¸ì…˜??? íš¨?˜ì? ?ŠìŠµ?ˆë‹¤.' })
  @ApiResponse({ status: 500, description: '?¨ê? ?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.' })
  async deleteUnitPrice(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceDeleteParams) {
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
      const result = await this.unitPriceService.deleteUnitPrice(body);
      return res.json({ success: true, data: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '?¨ê? ?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', error: err });
    }
  }
} 

