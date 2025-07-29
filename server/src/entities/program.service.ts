import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProgramEntity } from './program.entity';

@Injectable()
export class ProgramService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getProgramListByRole(usrRoleId: string): Promise<any[]> {
    return await this.dataSource.query(
      `
      SELECT A.PGM_ID AS PGM_ID
           , A.PGM_NM AS PGM_NM
           , A.PGM_ID || A.PGM_NM AS PGM_NM_TITLE
           , A.LINK_PATH AS LINK_PATH
           , A.PGM_DIV_CD AS PGM_SCRN_POP_TYPE
           , A.BIZ_DIV_CD AS BIZ_DIV_CD
           , A.PGM_HGHT AS SCRN_SZ_HEIGHT
           , A.PGM_WDTH AS SCRN_SZ_WIDTH
           , A.PGM_PSN_TOP AS SCRN_PSN_TOP
           , A.PGM_PSN_LFT AS SCRN_PSN_LEFT
           , NVL(A.TGT_MDI_DIV_CD, 'MAIN') AS TGT_MDI_DVCD
           , NVL(A.SZ_UPD_USE_YN, 'N') AS SZ_UPD_USE_YN
           , NVL(A.POPUP_SWT_USE_YN, 'N') AS POUP_SWT_USE_YN
           , '1' AS LOG_ATHT_FCTY
           , '1' AS MENU_ATHT_FCTY
           , '1' AS ETCT_ATHT_FCTY
        FROM TBL_PGM_INF A
       WHERE A.PGM_ID IN (
              SELECT GRP_DTL.PGM_ID
                FROM TBL_USER_ROLE_PGM_GRP ROLE
               INNER JOIN TBL_PGM_GRP_INF GRP ON ROLE.PGM_GRP_ID = GRP.PGM_GRP_ID AND GRP.USE_YN = 'Y'
               INNER JOIN TBL_PGM_GRP_PGM GRP_DTL ON ROLE.PGM_GRP_ID = GRP_DTL.PGM_GRP_ID
               WHERE ROLE.USR_ROLE_ID = :usrRoleId
                 AND ROLE.USE_YN = 'Y'
            )
         AND A.USE_YN = 'Y'
       ORDER BY A.PGM_ID
    `,
      [usrRoleId],
    );
  }
}
