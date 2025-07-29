import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';  
import { COMZ010M00Service } from './COMZ010M00.service';

@ApiTags('시스템코드관리')
@Controller('COMZ010M00')
export class COMZ010M00Controller {
  constructor(private readonly comz010m00Service: COMZ010M00Service) {}

  @Post('search')
  @ApiOperation({ summary: '시스템코드 조회', description: '대/소분류 코드 조회' })
  async searchCode(@Body() body: { SP: string; PARAM: string }) {
    return this.comz010m00Service.handleCodeMgmt(body);
  }

  @Post('save')
  @ApiOperation({ summary: '시스템코드 저장', description: '대/소분류 코드 등록/수정' })
  async saveCode(@Body() body: { SP: string; PARAM: string }) {
    return this.comz010m00Service.handleCodeMgmt(body);
  }

  @Post('delete')
  @ApiOperation({ summary: '시스템코드 삭제', description: '대/소분류 코드 삭제' })
  async deleteCode(@Body() body: { SP: string; PARAM: string }) {
    return this.comz010m00Service.handleCodeMgmt(body);
  }
} 