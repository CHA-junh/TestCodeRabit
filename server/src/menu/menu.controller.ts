import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MenuService } from './menu.service';
import { ProgramService } from '../entities/program.service';

// express-session ?�???�장
// 기존: session: { user?: any } - TypeScript ?�류 발생
// ?�정: session: any - express-session??모든 ?�성???�용?�여 ?�??충돌 ?�결
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
        .json({ success: false, message: '?�션???�효?��? ?�습?�다.' });
    }
    const usrRoleId = userInfo.usrRoleId;
    if (!usrRoleId) {
      return res
        .status(403)
        .json({ success: false, message: '권한 ?�보가 ?�습?�다.' });
    }
    try {
      const menus = await this.menuService.getMenuListByRole(usrRoleId);
      return res.json({ success: true, data: menus });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: 'DB ?�류', error: err });
    }
  }

  @Get('menus')
  async getMenus(@Req() req: RequestWithSession, @Res() res: Response) {
    // /menus ?�드?�인?�는 /tree?� ?�일??기능 ?�공 (?�라?�언???�환??
    return this.getMenuTree(req, res);
  }

  @Get('programs')
  async getPrograms(@Req() req: RequestWithSession, @Res() res: Response) {
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '?�션???�효?��? ?�습?�다.' });
    }
    const usrRoleId = userInfo.usrRoleId;
    if (!usrRoleId) {
      return res
        .status(403)
        .json({ success: false, message: '권한 ?�보가 ?�습?�다.' });
    }
    try {
      const programs =
        await this.programService.getProgramListByRole(usrRoleId);
      return res.json({ success: true, data: programs });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: 'DB ?�류', error: err });
    }
  }

  @Get('search')
  async searchMenu(@Req() req: RequestWithSession, @Res() res: Response) {
    // (?�략: 추후 ?�요??ORM 방식?�로 구현)
    return res.json({ success: true, data: [] });
  }
}


