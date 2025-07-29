import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MenuEntity } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // ?ÑÏ≤¥ Î©îÎâ¥ Î¶¨Ïä§??
  async findAll(): Promise<MenuEntity[]> {
    return this.dataSource.query(`
      SELECT * FROM TBL_MENU_INF
    `);
  }

  async getMenuListByRole(usrRoleId: string): Promise<any[]> {
    // console.log('?îç getMenuListByRole ?∏Ï∂ú?? usrRoleId:', usrRoleId);

    const result = await this.dataSource.query(
      `
      SELECT A.MENU_DSP_NM
           , A.PGM_ID AS PGM_ID
           , A.MENU_SHP_DVCD
           , A.HGRK_MENU_SEQ
           , A.MENU_SEQ
           , CONNECT_BY_ISLEAF AS FLAG
           , A.USE_YN AS MENU_USE_YN
           , LEVEL AS MENU_LVL
           , A.MENU_DSP_NM AS MAP_TITLE
           , SUBSTR(SYS_CONNECT_BY_PATH(A.MENU_DSP_NM, ' > '), 4) MENU_PATH
        FROM (
          SELECT A1.MENU_DSP_NM
               , NVL(A1.HGRK_MENU_SEQ,0)||'' AS HGRK_MENU_SEQ
               , A1.MENU_SEQ
               , A1.MENU_ID
               , A1.SORT_SEQ
               , A1.MENU_SHP_DVCD
               , A1.PGM_ID
               , A1.USE_YN
            FROM TBL_MENU_DTL A1
            INNER JOIN TBL_MENU_INF A2 ON A1.MENU_ID = A2.MENU_ID
            INNER JOIN TBL_USER_ROLE A3 ON A1.MENU_ID = A3.MENU_ID
           WHERE A3.USR_ROLE_ID = :usrRoleId
             AND (
                 A1.MENU_SHP_DVCD = 'M'
                 OR
                 A1.PGM_ID IN (
                    SELECT GRP_DTL.PGM_ID
                      FROM TBL_USER_ROLE_PGM_GRP ROLE
                     INNER JOIN TBL_PGM_GRP_INF GRP ON ROLE.PGM_GRP_ID= GRP.PGM_GRP_ID AND GRP.USE_YN = 'Y'
                     INNER JOIN TBL_PGM_GRP_PGM GRP_DTL ON ROLE.PGM_GRP_ID = GRP_DTL.PGM_GRP_ID
                     WHERE ROLE.USR_ROLE_ID = :usrRoleId
                       AND ROLE.USE_YN = 'Y'
                  )
             )
             AND A1.USE_YN = 'Y'
        ) A
       START WITH A.HGRK_MENU_SEQ = 0
       CONNECT BY PRIOR A.MENU_SEQ = A.HGRK_MENU_SEQ
       ORDER SIBLINGS BY A.SORT_SEQ
    `,
      [usrRoleId, usrRoleId],
    );

    // console.log('?ìã Î©îÎâ¥ Ï°∞Ìöå Í≤∞Í≥º (Ï≤òÏùå 5Í∞?:', result.slice(0, 5));
    // console.log('?ìã ?ÑÏ≤¥ Î©îÎâ¥ Í∞úÏàò:', result.length);

    return result;
  }
}


