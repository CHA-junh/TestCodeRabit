import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ030P00Service } from './COMZ030P00.service';
import { 
  UnitPriceSearchParams, 
  UnitPriceSearchResponseDto 
} from './dto/COMZ030P00.dto';

// express-session ????์ฅ
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('?จ๊? ๊ฒ??)
@Controller('COMZ030P00')
export class COMZ030P00Controller {
  constructor(private readonly comz030p00Service: COMZ030P00Service) {}

  @Post('search')
  @ApiOperation({ 
    summary: '?จ๊? ๊ฒ??,
    description: '?ฑ๊ธ๋ณ??จ๊?๋ฅ?๊ฒ?ํฉ?๋ค.'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?จ๊? ๊ฒ???ฑ๊ณต',
    type: UnitPriceSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?ธ์??? ํจ?์? ?์ต?๋ค.' })
  @ApiResponse({ status: 500, description: '?จ๊? ์กฐํ ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.' })
  async searchUnitPrices(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceSearchParams) {
    // ?ธ์ ์ฒดํฌ ์ฃผ์ ์ฒ๋ฆฌ (Swagger UI ?์ค?ธ์ฉ)
    /*
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '?ธ์??? ํจ?์? ?์ต?๋ค.' });
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
        .json({ success: false, message: '?จ๊? ์กฐํ ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.', error: err });
    }
  }
} 

