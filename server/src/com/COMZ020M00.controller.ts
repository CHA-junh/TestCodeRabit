import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ020M00Service } from './COMZ020M00.service';
import { 
  UnitPriceSaveParams, 
  UnitPriceDeleteParams
} from './dto/COMZ020M00.dto';

// express-session ????μ₯
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('?¨κ? κ΄λ¦?)
@Controller('COMZ020M00')
export class COMZ020M00Controller {
  constructor(private readonly unitPriceService: COMZ020M00Service) {}



  @Post('save')
  @ApiOperation({ 
    summary: '?¨κ? ???,
    description: '?±κΈλ³??¨κ?λ₯???₯ν©?λ€. κΈ°μ‘΄ ?¨κ?κ° ?μΌλ©??λ°?΄νΈ?κ³ , ?μΌλ©??λ‘ ?μ±?©λ??'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?¨κ? ????±κ³΅',
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
  @ApiResponse({ status: 401, description: '?Έμ??? ν¨?μ? ?μ΅?λ€.' })
  @ApiResponse({ status: 500, description: '?¨κ? ???μ€??€λ₯κ° λ°μ?μ΅?λ€.' })
  async saveUnitPrice(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceSaveParams) {
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
      const result = await this.unitPriceService.saveUnitPrice(body);
      return res.json({ success: true, data: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '?¨κ? ???μ€??€λ₯κ° λ°μ?μ΅?λ€.', error: err });
    }
  }

  @Post('delete')
  @ApiOperation({ 
    summary: '?¨κ? ?? ',
    description: '?±κΈλ³??¨κ?λ₯??? ?©λ?? μ§?λ μ‘°κ±΄???¨κ?κ° μ‘΄μ¬?λ©΄ ?? ?©λ??'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?¨κ? ??  ?±κ³΅',
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
  @ApiResponse({ status: 401, description: '?Έμ??? ν¨?μ? ?μ΅?λ€.' })
  @ApiResponse({ status: 500, description: '?¨κ? ??  μ€??€λ₯κ° λ°μ?μ΅?λ€.' })
  async deleteUnitPrice(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceDeleteParams) {
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
      const result = await this.unitPriceService.deleteUnitPrice(body);
      return res.json({ success: true, data: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '?¨κ? ??  μ€??€λ₯κ° λ°μ?μ΅?λ€.', error: err });
    }
  }
} 

