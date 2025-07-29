import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ030P00Service } from './COMZ030P00.service';
import { 
  UnitPriceSearchParams, 
  UnitPriceSearchResponseDto 
} from './dto/COMZ030P00.dto';

// express-session 타입 확장
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('단가 검색')
@Controller('COMZ030P00')
export class COMZ030P00Controller {
  constructor(private readonly comz030p00Service: COMZ030P00Service) {}

  @Post('search')
  @ApiOperation({ 
    summary: '단가 검색',
    description: '등급별 단가를 검색합니다.'
  })
  @ApiResponse({ 
    status: 200, 
    description: '단가 검색 성공',
    type: UnitPriceSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '세션이 유효하지 않습니다.' })
  @ApiResponse({ status: 500, description: '단가 조회 중 오류가 발생했습니다.' })
  async searchUnitPrices(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceSearchParams) {
    // 세션 체크 주석 처리 (Swagger UI 테스트용)
    /*
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '세션이 유효하지 않습니다.' });
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
        .json({ success: false, message: '단가 조회 중 오류가 발생했습니다.', error: err });
    }
  }
} 