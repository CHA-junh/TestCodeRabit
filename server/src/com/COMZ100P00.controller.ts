import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMZ100P00Service } from './COMZ100P00.service';
import { UserSearchParams, UserSearchResponseDto } from './dto/COMZ100P00.dto';

// express-session ????μ₯
interface RequestWithSession extends Request {
  session: any;
}

@ApiTags('?¬μ©??κ΄λ¦?)
@Controller('COMZ100P00')
export class COMZ100P00Controller {
  constructor(private readonly usersService: COMZ100P00Service) {}

  @Post('search')
  @ApiOperation({ 
    summary: '?¬μ©??κ²??,
    description: '?¬μ©?λͺ?Όλ‘ ?¬μ©?λ? κ²?ν©?λ€.'
  })
  @ApiResponse({ 
    status: 200, 
    description: '?¬μ©??κ²???±κ³΅',
    type: UserSearchResponseDto
  })
  @ApiResponse({ status: 401, description: '?Έμ??? ν¨?μ? ?μ΅?λ€.' })
  @ApiResponse({ status: 500, description: '?¬μ©??μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.' })
  async searchUsers(@Req() req: RequestWithSession, @Res() res: Response, @Body() body: UserSearchParams) {
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
        .json({ success: false, message: '?¬μ©??μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.', error: err });
    }
  }
} 

