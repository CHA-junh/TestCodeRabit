import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MenuService } from './menu.service';
import { ProgramService } from '../entities/program.service';

// express-session 타입 확장
// 기존: session: { user?: any } - TypeScript 오류 발생
// 수정: session: any - express-session의 모든 속성을 허용하여 타입 충돌 해결
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
        .json({ success: false, message: '세션이 유효하지 않습니다.' });
    }
    const usrRoleId = userInfo.usrRoleId;
    if (!usrRoleId) {
      return res
        .status(403)
        .json({ success: false, message: '권한 정보가 없습니다.' });
    }
    try {
      const menus = await this.menuService.getMenuListByRole(usrRoleId);
      return res.json({ success: true, data: menus });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: 'DB 오류', error: err });
    }
  }

  @Get('menus')
  async getMenus(@Req() req: RequestWithSession, @Res() res: Response) {
    // /menus 엔드포인트는 /tree와 동일한 기능 제공 (클라이언트 호환성)
    return this.getMenuTree(req, res);
  }

  @Get('programs')
  async getPrograms(@Req() req: RequestWithSession, @Res() res: Response) {
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '세션이 유효하지 않습니다.' });
    }
    const usrRoleId = userInfo.usrRoleId;
    if (!usrRoleId) {
      return res
        .status(403)
        .json({ success: false, message: '권한 정보가 없습니다.' });
    }
    try {
      const programs =
        await this.programService.getProgramListByRole(usrRoleId);
      return res.json({ success: true, data: programs });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: 'DB 오류', error: err });
    }
  }

  @Get('search')
  async searchMenu(@Req() req: RequestWithSession, @Res() res: Response) {
    // (생략: 추후 필요시 ORM 방식으로 구현)
    return res.json({ success: true, data: [] });
  }
}
