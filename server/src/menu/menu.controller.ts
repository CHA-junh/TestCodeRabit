import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MenuService } from './menu.service';
import { ProgramService } from '../entities/program.service';

// express-session ?€???•ì¥
// ê¸°ì¡´: session: { user?: any } - TypeScript ?¤ë¥˜ ë°œìƒ
// ?˜ì •: session: any - express-session??ëª¨ë“  ?ì„±???ˆìš©?˜ì—¬ ?€??ì¶©ëŒ ?´ê²°
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
        .json({ success: false, message: '?¸ì…˜??? íš¨?˜ì? ?ŠìŠµ?ˆë‹¤.' });
    }
    const usrRoleId = userInfo.usrRoleId;
    if (!usrRoleId) {
      return res
        .status(403)
        .json({ success: false, message: 'ê¶Œí•œ ?•ë³´ê°€ ?†ìŠµ?ˆë‹¤.' });
    }
    try {
      const menus = await this.menuService.getMenuListByRole(usrRoleId);
      return res.json({ success: true, data: menus });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: 'DB ?¤ë¥˜', error: err });
    }
  }

  @Get('menus')
  async getMenus(@Req() req: RequestWithSession, @Res() res: Response) {
    // /menus ?”ë“œ?¬ì¸?¸ëŠ” /tree?€ ?™ì¼??ê¸°ëŠ¥ ?œê³µ (?´ë¼?´ì–¸???¸í™˜??
    return this.getMenuTree(req, res);
  }

  @Get('programs')
  async getPrograms(@Req() req: RequestWithSession, @Res() res: Response) {
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '?¸ì…˜??? íš¨?˜ì? ?ŠìŠµ?ˆë‹¤.' });
    }
    const usrRoleId = userInfo.usrRoleId;
    if (!usrRoleId) {
      return res
        .status(403)
        .json({ success: false, message: 'ê¶Œí•œ ?•ë³´ê°€ ?†ìŠµ?ˆë‹¤.' });
    }
    try {
      const programs =
        await this.programService.getProgramListByRole(usrRoleId);
      return res.json({ success: true, data: programs });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: 'DB ?¤ë¥˜', error: err });
    }
  }

  @Get('search')
  async searchMenu(@Req() req: RequestWithSession, @Res() res: Response) {
    // (?ëµ: ì¶”í›„ ?„ìš”??ORM ë°©ì‹?¼ë¡œ êµ¬í˜„)
    return res.json({ success: true, data: [] });
  }
}


