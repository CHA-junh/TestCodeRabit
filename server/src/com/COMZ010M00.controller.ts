import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';  
import { COMZ010M00Service } from './COMZ010M00.service';

@ApiTags('?œìŠ¤?œì½”?œê?ë¦?)
@Controller('COMZ010M00')
export class COMZ010M00Controller {
  constructor(private readonly comz010m00Service: COMZ010M00Service) {}

  @Post('search')
  @ApiOperation({ summary: '?œìŠ¤?œì½”??ì¡°íšŒ', description: '?€/?Œë¶„ë¥?ì½”ë“œ ì¡°íšŒ' })
  async searchCode(@Body() body: { SP: string; PARAM: string }) {
    return this.comz010m00Service.handleCodeMgmt(body);
  }

  @Post('save')
  @ApiOperation({ summary: '?œìŠ¤?œì½”???€??, description: '?€/?Œë¶„ë¥?ì½”ë“œ ?±ë¡/?˜ì •' })
  async saveCode(@Body() body: { SP: string; PARAM: string }) {
    return this.comz010m00Service.handleCodeMgmt(body);
  }

  @Post('delete')
  @ApiOperation({ summary: '?œìŠ¤?œì½”???? œ', description: '?€/?Œë¶„ë¥?ì½”ë“œ ?? œ' })
  async deleteCode(@Body() body: { SP: string; PARAM: string }) {
    return this.comz010m00Service.handleCodeMgmt(body);
  }
} 

