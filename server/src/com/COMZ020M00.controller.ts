import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ020M00Service } from './COMZ020M00.service';
import { 
  UnitPriceSaveParams, 
  UnitPriceDeleteParams
} from './dto/COMZ020M00.dto';

// express-session ?�???�장
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('?��? 관�?)
@Controller('COMZ020M00')
export class COMZ020M00Controller {
  constructor(private readonly unitPriceService: COMZ020M00Service) {}



  @Post('save')
  @ApiOperation({ 
    summary: '?��? ?�??,
    description: '?�급�??��?�??�?�합?�다. 기존 ?��?가 ?�으�??�데?�트?�고, ?�으�??�로 ?�성?�니??'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?��? ?�???�공',
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
  @ApiResponse({ status: 401, description: '?�션???�효?��? ?�습?�다.' })
  @ApiResponse({ status: 500, description: '?��? ?�??�??�류가 발생?�습?�다.' })
  async saveUnitPrice(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceSaveParams) {
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
      const result = await this.unitPriceService.saveUnitPrice(body);
      return res.json({ success: true, data: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '?��? ?�??�??�류가 발생?�습?�다.', error: err });
    }
  }

  @Post('delete')
  @ApiOperation({ 
    summary: '?��? ??��',
    description: '?�급�??��?�???��?�니?? 지?�된 조건???��?가 존재?�면 ??��?�니??'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?��? ??�� ?�공',
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
  @ApiResponse({ status: 401, description: '?�션???�효?��? ?�습?�다.' })
  @ApiResponse({ status: 500, description: '?��? ??�� �??�류가 발생?�습?�다.' })
  async deleteUnitPrice(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceDeleteParams) {
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
      const result = await this.unitPriceService.deleteUnitPrice(body);
      return res.json({ success: true, data: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '?��? ??�� �??�류가 발생?�습?�다.', error: err });
    }
  }
} 

