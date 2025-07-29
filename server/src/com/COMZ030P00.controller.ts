import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ030P00Service } from './COMZ030P00.service';
import { 
  UnitPriceSearchParams, 
  UnitPriceSearchResponseDto 
} from './dto/COMZ030P00.dto';

// express-session ?�???�장
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('?��? 검??)
@Controller('COMZ030P00')
export class COMZ030P00Controller {
  constructor(private readonly comz030p00Service: COMZ030P00Service) {}

  @Post('search')
  @ApiOperation({ 
    summary: '?��? 검??,
    description: '?�급�??��?�?검?�합?�다.'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?��? 검???�공',
    type: UnitPriceSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?�션???�효?��? ?�습?�다.' })
  @ApiResponse({ status: 500, description: '?��? 조회 �??�류가 발생?�습?�다.' })
  async searchUnitPrices(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceSearchParams) {
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
        .json({ success: false, message: '?��? 조회 �??�류가 발생?�습?�다.', error: err });
    }
  }
} 

