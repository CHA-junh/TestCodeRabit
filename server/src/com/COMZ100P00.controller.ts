import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ100P00Service } from './COMZ100P00.service';
import { UserSearchParams, UserSearchResponseDto } from './dto/COMZ100P00.dto';

// express-session ?�???�장
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('?�용??관�?)
@Controller('COMZ100P00')
export class COMZ100P00Controller {
  constructor(private readonly usersService: COMZ100P00Service) {}

  @Post('search')
  @ApiOperation({ 
    summary: '?�용??검??,
    description: '?�용?�명?�로 ?�용?��? 검?�합?�다.'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?�용??검???�공',
    type: UserSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?�션???�효?��? ?�습?�다.' })
  @ApiResponse({ status: 500, description: '?�용??조회 �??�류가 발생?�습?�다.' })
  async searchUsers(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UserSearchParams) {
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
        .json({ success: false, message: '?�용??조회 �??�류가 발생?�습?�다.', error: err });
    }
  }
} 

