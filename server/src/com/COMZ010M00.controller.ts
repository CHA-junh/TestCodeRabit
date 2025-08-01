import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';  
import { COMZ010M00Service } from './COMZ010M00.service';

@ApiTags('?μ€?μ½?κ?λ¦?)
@Controller('COMZ010M00')
export class COMZ010M00Controller {
  constructor(private readonly comz010m00Service: COMZ010M00Service) {}

  @Post('search')
  @ApiOperation({ summary: '?μ€?μ½??μ‘°ν', description: '?/?λΆλ₯?μ½λ μ‘°ν' })
  async searchCode(@Body() body: { SP: string; PARAM: string }) {
    return this.comz010m00Service.handleCodeMgmt(body);
  }

  @Post('save')
  @ApiOperation({ summary: '?μ€?μ½?????, description: '?/?λΆλ₯?μ½λ ?±λ‘/?μ ' })
  async saveCode(@Body() body: { SP: string; PARAM: string }) {
    return this.comz010m00Service.handleCodeMgmt(body);
  }

  @Post('delete')
  @ApiOperation({ summary: '?μ€?μ½???? ', description: '?/?λΆλ₯?μ½λ ?? ' })
  async deleteCode(@Body() body: { SP: string; PARAM: string }) {
    return this.comz010m00Service.handleCodeMgmt(body);
  }
} 

