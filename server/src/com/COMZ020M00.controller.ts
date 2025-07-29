import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ020M00Service } from './COMZ020M00.service';
import { 
  UnitPriceSaveParams, 
  UnitPriceDeleteParams
} from './dto/COMZ020M00.dto';

// express-session 타입 확장
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('단가 관리')
@Controller('COMZ020M00')
export class COMZ020M00Controller {
  constructor(private readonly unitPriceService: COMZ020M00Service) {}



  @Post('save')
  @ApiOperation({ 
    summary: '단가 저장',
    description: '등급별 단가를 저장합니다. 기존 단가가 있으면 업데이트하고, 없으면 새로 생성합니다.'
  })
  @ApiResponse({ 
    status: 200, 
    description: '단가 저장 성공',
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
  @ApiResponse({ status: 401, description: '세션이 유효하지 않습니다.' })
  @ApiResponse({ status: 500, description: '단가 저장 중 오류가 발생했습니다.' })
  async saveUnitPrice(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceSaveParams) {
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
      const result = await this.unitPriceService.saveUnitPrice(body);
      return res.json({ success: true, data: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '단가 저장 중 오류가 발생했습니다.', error: err });
    }
  }

  @Post('delete')
  @ApiOperation({ 
    summary: '단가 삭제',
    description: '등급별 단가를 삭제합니다. 지정된 조건의 단가가 존재하면 삭제합니다.'
  })
  @ApiResponse({ 
    status: 200, 
    description: '단가 삭제 성공',
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
  @ApiResponse({ status: 401, description: '세션이 유효하지 않습니다.' })
  @ApiResponse({ status: 500, description: '단가 삭제 중 오류가 발생했습니다.' })
  async deleteUnitPrice(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UnitPriceDeleteParams) {
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
      const result = await this.unitPriceService.deleteUnitPrice(body);
      return res.json({ success: true, data: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: '단가 삭제 중 오류가 발생했습니다.', error: err });
    }
  }
} 