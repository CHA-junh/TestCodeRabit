import { Controller, Post, Body } from '@nestjs/common';
import { COMZ040P00Service } from './COMZ040P00.service';

@Controller('COMZ040P00')
export class COMZ040P00Controller {
  constructor(private readonly comz040p00Service: COMZ040P00Service) {}

  @Post('search')
  async searchBusinessNo(@Body() body: any): Promise<any> {
    return this.comz040p00Service.searchBusiness(body);
  }
}


