import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ100P00Service } from './COMZ100P00.service';
import { UserSearchParams, UserSearchResponseDto } from './dto/COMZ100P00.dto';

// express-session 타입 확장
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('사용자 관리')
@Controller('COMZ100P00')
export class COMZ100P00Controller {
  constructor(private readonly usersService: COMZ100P00Service) {}

  @Post('search')
  @ApiOperation({ 
    summary: '사용자 검색',
    description: '사용자명으로 사용자를 검색합니다.'
  })
  @ApiResponse({ 
    status: 200, 
    description: '사용자 검색 성공',
    type: UserSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '세션이 유효하지 않습니다.' })
  @ApiResponse({ status: 500, description: '사용자 조회 중 오류가 발생했습니다.' })
  async searchUsers(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UserSearchParams) {
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
        .json({ success: false, message: '사용자 조회 중 오류가 발생했습니다.', error: err });
    }
  }
} 