import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { CodeService } from './code.service';
import { CodeSearchRequestDto, CodeSearchResponseDto } from './dto/code.dto';

// express-session 타입 확장
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('코드 관리')
@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post('search')
  @ApiOperation({ 
    summary: '코드 조회',
    description: '대분류코드에 해당하는 소분류 코드들을 조회합니다.'
  })
  @ApiBody({ type: CodeSearchRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: '코드 조회 성공',
    type: CodeSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '세션이 유효하지 않습니다.' })
  @ApiResponse({ status: 500, description: '코드 조회 중 오류가 발생했습니다.' })
  async searchCodes(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: CodeSearchRequestDto) {
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
        .json({ success: false, message: '코드 조회 중 오류가 발생했습니다.', error: err });
    }
  }
} 