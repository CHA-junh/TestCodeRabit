import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MenuService } from './menu.service';
import { ProgramService } from '../entities/program.service';

// express-session ????μ₯
// κΈ°μ‘΄: session: { user?: any } - TypeScript ?€λ₯ λ°μ
// ?μ : session: any - express-session??λͺ¨λ  ?μ±???μ©?μ¬ ???μΆ©λ ?΄κ²°
interface RequestWithSession extends Request {
  session: any;
}

@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly programService: ProgramService,
  ) {}

  @Get('tree')
  async getMenuTree(@Req() req: RequestWithSession, @Res() res: Response) {
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '?Έμ??? ν¨?μ? ?μ΅?λ€.' });
    }
    const usrRoleId = userInfo.usrRoleId;
    if (!usrRoleId) {
      return res
        .status(403)
        .json({ success: false, message: 'κΆν ?λ³΄κ° ?μ΅?λ€.' });
    }
    try {
      const menus = await this.menuService.getMenuListByRole(usrRoleId);
      return res.json({ success: true, data: menus });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: 'DB ?€λ₯', error: err });
    }
  }

  @Get('menus')
  async getMenus(@Req() req: RequestWithSession, @Res() res: Response) {
    // /menus ?λ?¬μΈ?Έλ /tree? ?μΌ??κΈ°λ₯ ?κ³΅ (?΄λΌ?΄μΈ???Έν??
    return this.getMenuTree(req, res);
  }

  @Get('programs')
  async getPrograms(@Req() req: RequestWithSession, @Res() res: Response) {
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '?Έμ??? ν¨?μ? ?μ΅?λ€.' });
    }
    const usrRoleId = userInfo.usrRoleId;
    if (!usrRoleId) {
      return res
        .status(403)
        .json({ success: false, message: 'κΆν ?λ³΄κ° ?μ΅?λ€.' });
    }
    try {
      const programs =
        await this.programService.getProgramListByRole(usrRoleId);
      return res.json({ success: true, data: programs });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: 'DB ?€λ₯', error: err });
    }
  }

  @Get('search')
  async searchMenu(@Req() req: RequestWithSession, @Res() res: Response) {
    // (?λ΅: μΆν ?μ??ORM λ°©μ?Όλ‘ κ΅¬ν)
    return res.json({ success: true, data: [] });
  }
}


