/**
 * SYS1003M00Service - ?¬ìš©????•  ê´€ë¦??œë¹„??
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ ë°?ê´€ë¦?
 * - ?„ë¡œê·¸ë¨ ê·¸ë£¹ë³??¬ìš©????•  ?°ê²° ê´€ë¦?
 * - ë©”ë‰´ ?•ë³´ ì¡°íšŒ
 * - ?¬ìš©????•  ë³µì‚¬ ê¸°ëŠ¥
 *
 * ?°ê? ?Œì´ë¸?
 * - TBL_USER_ROLE: ?¬ìš©????•  ?•ë³´
 * - TBL_USER_ROLE_PGM_GRP: ?¬ìš©????• ë³??„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²°
 * - TBL_PGM_GRP_INF: ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?•ë³´
 * - TBL_MENU_INF: ë©”ë‰´ ?•ë³´
 * - TBL_USER_INF: ?¬ìš©???•ë³´ (?¬ìš©????ì¹´ìš´?¸ìš©)
 *
 * ?°ê? ?„ë¡œ?œì?:
 * - ?†ìŒ (TypeORM ì¿¼ë¦¬ë¡??€ì²?
 *
 * ?¬ìš© ?”ë©´:
 * - SYS1003M00: ?¬ìš©????•  ê´€ë¦??”ë©´
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TblUserRole } from '../entities/tbl-user-role.entity';
import { TblUserRolePgmGrp } from '../entities/tbl-user-role-pgm-grp.entity';
import { TblPgmGrp } from '../entities/tbl-pgm-grp.entity';
import { TblMenuInf } from '../entities/tbl-menu-inf.entity';
import { TblPgmGrpInf } from '../entities/tbl-pgm-grp-inf.entity';
import { toCamelCase } from '../utils/toCamelCase';

/**
 * ?¬ìš©????•  ?€?¥ìš© ?˜ì´ë¡œë“œ ?¸í„°?˜ì´??
 *
 * @description
 * - createdRows: ? ê·œ ?ì„±???¬ìš©????•  ëª©ë¡
 * - updatedRows: ?˜ì •???¬ìš©????•  ëª©ë¡
 * - deletedRows: ?? œ???¬ìš©????•  ëª©ë¡
 */
interface SaveUserRolesPayload {
  createdRows: TblUserRole[];
  updatedRows: TblUserRole[];
  deletedRows: TblUserRole[];
}

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(TblUserRole)
    private userRoleRepository: Repository<TblUserRole>,
    @InjectRepository(TblUserRolePgmGrp)
    private pgmGrpRepository: Repository<TblUserRolePgmGrp>,
    @InjectRepository(TblMenuInf)
    private menuInfRepository: Repository<TblMenuInf>,
  ) {}

  /**
   * ëª¨ë“  ë©”ë‰´ ?•ë³´ ì¡°íšŒ
   *
   * @description
   * - ?¬ìš©?¬ë?ê°€ 'Y'??ë©”ë‰´ë§?ì¡°íšŒ?©ë‹ˆ??
   * - ë©”ë‰´ID ?œìœ¼ë¡??•ë ¬?˜ì—¬ ë°˜í™˜?©ë‹ˆ??
   *
   * @returns Promise<TblMenuInf[]> - ë©”ë‰´ ?•ë³´ ëª©ë¡
   * @example
   * const menus = await sysService.findAllMenus();
   * // ê²°ê³¼: [{ menuId: "M001", menuNm: "?¬ìš©??ê´€ë¦?, useYn: "Y" }]
   *
   * @throws Error - DB ì¡°íšŒ ?¤íŒ¨ ??
   */
  async findAllMenus(): Promise<TblMenuInf[]> {
    try {
      return await this.menuInfRepository.find({
        where: { useYn: 'Y' },
        order: {
          menuId: 'ASC',
        },
      });
    } catch (error) {
      console.error('Error finding all menus:', error);
      throw error;
    }
  }

  /**
   * ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ (?¬ìš©?????¬í•¨)
   *
   * @description
   * - ?¬ìš©????• ë³„ë¡œ ?´ë‹¹ ??• ??ê°€ì§??¬ìš©???˜ë? ?¨ê»˜ ì¡°íšŒ?©ë‹ˆ??
   * - ë©”ë‰´ ?•ë³´?€ ?¬ìš©???•ë³´ë¥?LEFT JOIN?˜ì—¬ ì¡°íšŒ?©ë‹ˆ??
   * - ê²€??ì¡°ê±´(usrRoleId, useYn)???ìš©?????ˆìŠµ?ˆë‹¤.
   * - ê²°ê³¼??camelCaseë¡?ë³€?˜í•˜??ë°˜í™˜?©ë‹ˆ??
   *
   * @param usrRoleId - ?¬ìš©????•  ID (ë¶€ë¶?ê²€??ê°€??
   * @param useYn - ?¬ìš©?¬ë? ('Y'/'N')
   * @returns Promise<TblUserRole[]> - ?¬ìš©????•  ëª©ë¡ (?¬ìš©?????¬í•¨)
   * @example
   * const roles = await sysService.findAllUserRoles('A25', 'Y');
   * // ê²°ê³¼: [{ usrRoleId: "A250715001", usrRoleNm: "?¼ë°˜?¬ìš©??, cnt: 5 }]
   *
   * @throws Error - DB ì¡°íšŒ ?¤íŒ¨ ??
   */
  async findAllUserRoles(
    usrRoleId?: string,
    useYn?: string,
  ): Promise<TblUserRole[]> {
    try {
      console.log('=== ?¬ìš©?ì—­??ì¡°íšŒ ?œì‘ ===');
      console.log('?…ë ¥ ?Œë¼ë¯¸í„°:', { usrRoleId, useYn });
      console.log('usrRoleId ?€??', typeof usrRoleId, 'ê°?', usrRoleId);
      console.log('useYn ?€??', typeof useYn, 'ê°?', useYn);

      // ë©”ë‰´ ?•ë³´?€ ?¬ìš©???•ë³´ë¥?JOIN?˜ì—¬ ?¬ìš©????• ë³??¬ìš©????ì¡°íšŒ
      const queryBuilder = this.userRoleRepository.manager
        .createQueryBuilder(TblUserRole, 'ur')
        .leftJoin('TBL_MENU_INF', 'm', 'ur.menuId = m.menuId')
        .leftJoin('TBL_USER_INF', 'u', 'ur.usrRoleId = u.usrRoleId')
        .leftJoin('TBL_PGM_INF', 'p', 'ur.baseOutputScrnPgmIdCtt = p.pgmId')
        .select([
          'ur.usrRoleId as USR_ROLE_ID',
          'ur.menuId as MENU_ID',
          'm.menuNm as MENU_NM',
          'ur.usrRoleNm as USR_ROLE_NM',
          'ur.athrGrdCd as ATHT_GRD_CD',
          'ur.useYn as USE_YN',
          'COUNT(u.userId) as CNT',
          'ur.orgInqRngCd as ORG_INQ_RANG_CD',
          'ur.baseOutputScrnPgmIdCtt as BASE_OUTPUT_SCRN_PGM_ID_CTT',
          'p.pgmNm as BASE_OUTPUT_SCRN_PGM_NM_CTT', // ?„ë¡œê·¸ë¨ëª?ì¡°ì¸
        ]);

      // ì¡°íšŒ ì¡°ê±´ ?ìš© (GROUP BY ?´ì „???ìš©)
      if (usrRoleId && usrRoleId.trim()) {
        queryBuilder.andWhere(
          '(ur.usrRoleId LIKE :usrRoleId OR ur.usrRoleNm LIKE :usrRoleNm)',
          {
            usrRoleId: `${usrRoleId}%`,
            usrRoleNm: `%${usrRoleId}%`,
          },
        );
        console.log('?¬ìš©?ì—­? ì½”??ëª?ì¡°ê±´ ?ìš©:', usrRoleId);
      }

      if (useYn && useYn.trim()) {
        queryBuilder.andWhere('ur.useYn = :useYn', { useYn });
        console.log('?¬ìš©?¬ë? ì¡°ê±´ ?ìš©:', useYn);
      }

      // ê¸°ë³¸ ì¿¼ë¦¬ ê²°ê³¼ ?•ì¸ (ì¡°ê±´ ?ìš© ??
      const allRows = await this.userRoleRepository.manager
        .createQueryBuilder(TblUserRole, 'ur')
        .select(['ur.usrRoleId', 'ur.usrRoleNm', 'ur.useYn'])
        .getRawMany();
      console.log('=== ?„ì²´ ?¬ìš©?ì—­???°ì´??(ì¡°ê±´ ?ìš© ?? ===');
      console.log('ì´?ê°œìˆ˜:', allRows.length);
      console.log(
        'useYn ê°’ë“¤:',
        allRows.map((row) => ({
          usrRoleId: row.ur_usrRoleId,
          usrRoleNm: row.ur_usrRoleNm,
          useYn: row.ur_useYn,
        })),
      );

      const rawRows = await queryBuilder
        .groupBy(
          'ur.usrRoleId, ur.menuId, m.menuNm, ur.usrRoleNm, ur.athrGrdCd, ur.useYn, ur.orgInqRngCd, ur.baseOutputScrnPgmIdCtt, p.pgmNm',
        )
        .orderBy('ur.usrRoleId')
        .getRawMany();

      // ì¿¼ë¦¬ ê²°ê³¼ ë¡œê·¸ ì¶œë ¥
      console.log('?¬ìš©?ì—­??ì¡°íšŒ ì¡°ê±´:', { usrRoleId, useYn });
      console.log('?¬ìš©?ì—­??ì¿¼ë¦¬ ê²°ê³¼ ê°œìˆ˜:', rawRows.length);
      console.log('?¬ìš©?ì—­??ì¿¼ë¦¬ ê²°ê³¼ (ì²˜ìŒ 3ê°?:', rawRows.slice(0, 3));

      return toCamelCase(rawRows);
    } catch (error) {
      console.error('Error finding all user roles:', error);
      throw error;
    }
  }

  /**
   * ?¬ìš©????•  ?€??(? ê·œ/?˜ì •/?? œ)
   *
   * @description
   * - ?¸ëœ??…˜???¬ìš©?˜ì—¬ ? ê·œ ?ì„±, ?˜ì •, ?? œë¥??ˆì „?˜ê²Œ ì²˜ë¦¬?©ë‹ˆ??
   * - ? ê·œ ?ì„± ??@BeforeInsert ?°ì½”?ˆì´?°ê? ?ë™?¼ë¡œ usrRoleIdë¥??ì„±?©ë‹ˆ??
   * - ?˜ì • ??@BeforeUpdate ?°ì½”?ˆì´?°ê? ?ë™?¼ë¡œ ë³€ê²½ì¼?œë? ?¤ì •?©ë‹ˆ??
   * - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©?ì˜ ?¸ì…˜ ?•ë³´ë¥??œìš©?˜ì—¬ ?±ë¡??ë³€ê²½ì ?•ë³´ë¥??¤ì •?©ë‹ˆ??
   *
   * @param payload - ?€?¥í•  ?¬ìš©????•  ?°ì´??
   * @param currentUserId - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©??ID (?¸ì…˜?ì„œ ?„ë‹¬)
   * @returns Promise<TblUserRole[]> - ?€?¥ëœ ?¬ìš©????•  ëª©ë¡
   * @example
   * const result = await sysService.saveUserRoles({
   *   createdRows: [newRole],
   *   updatedRows: [updatedRole],
   *   deletedRows: [deletedRole]
   * }, "E001");
   *
   * @throws Error - ?¸ëœ??…˜ ?¤íŒ¨ ??
   */
  async saveUserRoles(
    payload: SaveUserRolesPayload,
    currentUserId: string,
  ): Promise<TblUserRole[]> {
    const queryRunner =
      this.userRoleRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { createdRows, updatedRows, deletedRows } = payload;
      const savedRoles: TblUserRole[] = [];

      // ?? œ ì²˜ë¦¬
      if (deletedRows && deletedRows.length > 0) {
        const deleteIds = deletedRows.map((row) => row.usrRoleId);
        await queryRunner.manager.delete(TblUserRole, deleteIds);
      }

      // ?”í‹°?°ì˜ @BeforeInsert ?°ì½”?ˆì´?°ì—???ë™?¼ë¡œ usrRoleId ?ì„±
      const processedCreatedRows = createdRows;

      const upsertRows = [...processedCreatedRows, ...updatedRows];
      if (upsertRows && upsertRows.length > 0) {
        // ?”í‹°???¸ìŠ¤?´ìŠ¤ë¡?ë³€?˜í•˜??@BeforeInsert ?°ì½”?ˆì´?°ê? ?™ì‘?˜ë„ë¡???
        const entityInstances = upsertRows.map((row) => {
          const entity = new TblUserRole();
          Object.assign(entity, row);

          // ? ê·œ ?ì„± ?œì—ë§??±ë¡?¼ì‹œ ?¤ì •
          if (!row.usrRoleId || row.usrRoleId.trim() === '') {
            entity.regDttm = ''; // @BeforeInsert?ì„œ ?ë™ ?¤ì •
            entity.chngrId = currentUserId; // ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©??ID
          } else {
            // ?˜ì • ??ë³€ê²½ì¼???¤ì •
            entity.chngDttm = ''; // @BeforeUpdate?ì„œ ?ë™ ?¤ì •
            entity.chngrId = currentUserId; // ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©??ID
          }

          return entity;
        });

        const saved = await queryRunner.manager.save(
          TblUserRole,
          entityInstances,
        );
        savedRoles.push(...saved);
      }

      await queryRunner.commitTransaction();
      return savedRoles;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error saving user roles:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * ?¹ì • ??• ???„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ ì¡°íšŒ
   *
   * @description
   * - ?¹ì • ?¬ìš©????• ???°ê²°???„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - ê°??„ë¡œê·¸ë¨ ê·¸ë£¹ë³„ë¡œ ?´ë‹¹ ê·¸ë£¹???¬ìš©?˜ëŠ” ?¬ìš©???˜ë„ ?¨ê»˜ ì¡°íšŒ?©ë‹ˆ??
   * - ê²°ê³¼??camelCaseë¡?ë³€?˜í•˜??ë°˜í™˜?©ë‹ˆ??
   *
   * @param usrRoleId - ?¬ìš©????•  ID
   * @returns Promise<any[]> - ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ (?¬ìš©?????¬í•¨)
   * @example
   * const pgmGrps = await sysService.findProgramGroupsByRoleId('A250715001');
   * // ê²°ê³¼: [{ pgmGrpId: "PG001", pgmGrpNm: "?¬ìš©?ê?ë¦?, cnt: 3 }]
   *
   * @throws Error - DB ì¡°íšŒ ?¤íŒ¨ ??
   */
  async findProgramGroupsByRoleId(usrRoleId: string): Promise<any[]> {
    const rawRows = await this.pgmGrpRepository.manager
      .createQueryBuilder(TblPgmGrpInf, 'pg')
      .leftJoin(
        TblUserRolePgmGrp,
        'urpg',
        'pg.PGM_GRP_ID = urpg.PGM_GRP_ID AND urpg.USR_ROLE_ID = :usrRoleId',
        { usrRoleId },
      )
      .leftJoin(
        TblUserRolePgmGrp,
        'urpg_all',
        'pg.PGM_GRP_ID = urpg_all.PGM_GRP_ID',
      )
      .leftJoin('TBL_USER_INF', 'u', 'urpg_all.usrRoleId = u.usrRoleId')
      .select([
        'pg.PGM_GRP_ID as PGM_GRP_ID',
        'pg.PGM_GRP_NM as PGM_GRP_NM',
        'pg.USE_YN as PGM_GRP_USE_YN', // ?„ë¡œê·¸ë¨ê·¸ë£¹ ?ì²´???¬ìš©?¬ë?
        'urpg.USR_ROLE_ID as USR_ROLE_ID',
        'urpg.USE_YN as USE_YN',
        'COUNT(DISTINCT u.userId) as CNT',
      ])
      .groupBy(
        'pg.PGM_GRP_ID, pg.PGM_GRP_NM, pg.USE_YN, urpg.USR_ROLE_ID, urpg.USE_YN',
      )
      .orderBy('pg.PGM_GRP_ID')
      .getRawMany();

    // ì¿¼ë¦¬ ê²°ê³¼ ë¡œê·¸ ì¶œë ¥
    console.log('?„ë¡œê·¸ë¨ê·¸ë£¹ ì¿¼ë¦¬ ê²°ê³¼:', rawRows);

    // keyë¥?camelCaseë¡?ë³€?˜í•´??ë°˜í™˜
    return toCamelCase(rawRows);
  }

  /**
   * ëª¨ë“  ?„ë¡œê·¸ë¨ ê·¸ë£¹ ì¡°íšŒ (? ê·œ ??•  ?ì„± ???¬ìš©)
   *
   * @description
   * - ëª¨ë“  ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - ê°??„ë¡œê·¸ë¨ ê·¸ë£¹ë³„ë¡œ ?´ë‹¹ ê·¸ë£¹???¬ìš©?˜ëŠ” ?¬ìš©???˜ë„ ?¨ê»˜ ì¡°íšŒ?©ë‹ˆ??
   * - ? ê·œ ?¬ìš©????•  ?ì„± ???„ë¡œê·¸ë¨ ê·¸ë£¹ ? íƒ?©ìœ¼ë¡??¬ìš©?©ë‹ˆ??
   *
   * @returns Promise<any[]> - ?„ì²´ ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ (?¬ìš©?????¬í•¨)
   * @example
   * const allPgmGrps = await sysService.findAllProgramGroups();
   * // ê²°ê³¼: [{ pgmGrpId: "PG001", pgmGrpNm: "?¬ìš©?ê?ë¦?, cnt: 5 }]
   *
   * @throws Error - DB ì¡°íšŒ ?¤íŒ¨ ??
   */
  async findAllProgramGroups(): Promise<any[]> {
    const rawRows = await this.pgmGrpRepository.manager
      .createQueryBuilder(TblPgmGrpInf, 'pg')
      .leftJoin(
        TblUserRolePgmGrp,
        'urpg_all',
        'pg.PGM_GRP_ID = urpg_all.PGM_GRP_ID',
      )
      .leftJoin('TBL_USER_INF', 'u', 'urpg_all.usrRoleId = u.usrRoleId')
      .select([
        'pg.PGM_GRP_ID as PGM_GRP_ID',
        'pg.PGM_GRP_NM as PGM_GRP_NM',
        'pg.USE_YN as PGM_GRP_USE_YN', // ?„ë¡œê·¸ë¨ê·¸ë£¹ ?ì²´???¬ìš©?¬ë?
        'COUNT(DISTINCT u.userId) as CNT',
      ])
      .groupBy('pg.PGM_GRP_ID, pg.PGM_GRP_NM, pg.USE_YN')
      .orderBy('pg.PGM_GRP_ID')
      .getRawMany();

    // ì¿¼ë¦¬ ê²°ê³¼ ë¡œê·¸ ì¶œë ¥
    console.log('?„ì²´ ?„ë¡œê·¸ë¨ê·¸ë£¹ ì¿¼ë¦¬ ê²°ê³¼:', rawRows);

    // keyë¥?camelCaseë¡?ë³€?˜í•´??ë°˜í™˜
    return toCamelCase(rawRows);
  }

  /**
   * ?¹ì • ??• ???„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²° ?•ë³´ ?€??
   *
   * @description
   * - ?¹ì • ?¬ìš©????• ???°ê²°???„ë¡œê·¸ë¨ ê·¸ë£¹ ?•ë³´ë¥??€?¥í•©?ˆë‹¤.
   * - ê¸°ì¡´ ?°ê²° ?•ë³´ë¥?ëª¨ë‘ ?? œ?????ˆë¡œ???°ê²° ?•ë³´ë¥??€?¥í•©?ˆë‹¤.
   * - ?¸ëœ??…˜???¬ìš©?˜ì—¬ ?ˆì „?˜ê²Œ ì²˜ë¦¬?©ë‹ˆ??
   * - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©?ì˜ ?¸ì…˜ ?•ë³´ë¥??œìš©?˜ì—¬ ?±ë¡??ë³€ê²½ì ?•ë³´ë¥??¤ì •?©ë‹ˆ??
   *
   * @param usrRoleId - ?¬ìš©????•  ID
   * @param pgmGrps - ?€?¥í•  ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²° ?•ë³´ ëª©ë¡
   * @param currentUserId - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©??ID (?¸ì…˜?ì„œ ?„ë‹¬)
   * @returns Promise<void>
   * @example
   * await sysService.saveProgramGroupsForRole('A250715001', [
   *   { pgmGrpId: 'PG001', useYn: 'Y' },
   *   { pgmGrpId: 'PG002', useYn: 'N' }
   * ], "E001");
   *
   * @throws Error - ?¸ëœ??…˜ ?¤íŒ¨ ??
   */
  async saveProgramGroupsForRole(
    usrRoleId: string,
    pgmGrps: TblUserRolePgmGrp[],
    currentUserId: string,
  ): Promise<void> {
    const queryRunner =
      this.pgmGrpRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. ?´ë‹¹ ??• ??ê¸°ì¡´ ?„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²°??ëª¨ë‘ ?? œ
      await queryRunner.manager.delete(TblUserRolePgmGrp, { usrRoleId });

      // 2. ?ˆë¡œ???„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡???€??(pgmGrpsê°€ ë¹„ì–´?ˆì? ?Šì? ê²½ìš°)
      if (pgmGrps && pgmGrps.length > 0) {
        // ?”í‹°???¸ìŠ¤?´ìŠ¤ë¡?ë³€?˜í•˜??@BeforeInsert ?°ì½”?ˆì´?°ê? ?™ì‘?˜ë„ë¡???
        const entitiesToSave = pgmGrps.map((p) => {
          const entity = new TblUserRolePgmGrp();
          Object.assign(entity, {
            ...p,
            usrRoleId,
            chngrId: currentUserId, // ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©??ID
          });
          return entity;
        });
        await queryRunner.manager.save(TblUserRolePgmGrp, entitiesToSave);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error saving program groups for role:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * ?¬ìš©????•  ë³µì‚¬
   *
   * @description
   * - ê¸°ì¡´ ?¬ìš©????• ??ë³µì‚¬?˜ì—¬ ?ˆë¡œ????• ???ì„±?©ë‹ˆ??
   * - ?ˆë¡œ????•  ID??'A' + YYMMDD + 3?ë¦¬ ?œë²ˆ ?•ì‹?¼ë¡œ ?ë™ ?ì„±?©ë‹ˆ??
   * - ?ë³¸ ??• ???„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²° ?•ë³´???¨ê»˜ ë³µì‚¬?©ë‹ˆ??
   * - ?¸ëœ??…˜???¬ìš©?˜ì—¬ ?ˆì „?˜ê²Œ ì²˜ë¦¬?©ë‹ˆ??
   * - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©?ì˜ ?¸ì…˜ ?•ë³´ë¥??œìš©?˜ì—¬ ?±ë¡??ë³€ê²½ì ?•ë³´ë¥??¤ì •?©ë‹ˆ??
   *
   * @param originalRoleId - ë³µì‚¬???ë³¸ ??•  ID
   * @param currentUserId - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©??ID (?¸ì…˜?ì„œ ?„ë‹¬)
   * @returns Promise<TblUserRole> - ?ˆë¡œ ?ì„±???¬ìš©????• 
   * @example
   * const newRole = await sysService.copyUserRole('A250715001', "E001");
   * // ê²°ê³¼: { usrRoleId: "A250715002", usrRoleNm: "?¼ë°˜?¬ìš©??ë³µì‚¬ë³? }
   *
   * @throws Error - ?ë³¸ ??• ???†ê±°???¸ëœ??…˜ ?¤íŒ¨ ??
   */
  async copyUserRole(
    originalRoleId: string,
    currentUserId: string,
  ): Promise<TblUserRole> {
    const queryRunner =
      this.userRoleRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. ?ë³¸ ??•  ?•ë³´ ì¡°íšŒ
      const originalRole = await queryRunner.manager.findOne(TblUserRole, {
        where: { usrRoleId: originalRoleId },
      });
      if (!originalRole) {
        throw new Error('ë³µì‚¬???ë³¸ ??• ??ì°¾ì„ ???†ìŠµ?ˆë‹¤.');
      }

      // 2. ?ˆë¡œ????•  ID ?ì„± (ê¸°ì¡´ ?¨í„´: A + YYMMDD + 3?ë¦¬ ?œë²ˆ)
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const timestamp = Date.now().toString().slice(-3);

      const newRoleId = `A${year}${month}${day}${timestamp}`;

      // 3. ??•  ?•ë³´ ë³µì‚¬ ë°??€??(?”í‹°???¸ìŠ¤?´ìŠ¤ë¡?ë³€?˜í•˜??@BeforeInsert ?°ì½”?ˆì´?°ê? ?™ì‘?˜ë„ë¡???
      const newRoleEntity = new TblUserRole();
      Object.assign(newRoleEntity, {
        ...originalRole,
        usrRoleId: newRoleId,
        usrRoleNm: `${originalRole.usrRoleNm}_ë³µì‚¬ë³?,
        regDttm: undefined, // @BeforeInsert?ì„œ ?ë™ ?¤ì •
        chngDttm: undefined, // @BeforeInsert?ì„œ ?ë™ ?¤ì •
        chngrId: currentUserId, // ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©??ID
      });

      const savedRole = await queryRunner.manager.save(
        TblUserRole,
        newRoleEntity,
      );

      // 4. ?ë³¸ ??• ???„ë¡œê·¸ë¨ ê·¸ë£¹ ?°ê²° ?•ë³´ ì¡°íšŒ ë°?ë³µì‚¬
      const originalPgmGrps = await queryRunner.manager.find(
        TblUserRolePgmGrp,
        { where: { usrRoleId: originalRoleId } },
      );
      if (originalPgmGrps.length > 0) {
        // ?”í‹°???¸ìŠ¤?´ìŠ¤ë¡?ë³€?˜í•˜??@BeforeInsert ?°ì½”?ˆì´?°ê? ?™ì‘?˜ë„ë¡???
        const newPgmGrps = originalPgmGrps.map((p) => {
          const entity = new TblUserRolePgmGrp();
          Object.assign(entity, {
            ...p,
            usrRoleId: newRoleId,
            chngrId: currentUserId, // ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©??ID
          });
          return entity;
        });
        await queryRunner.manager.save(TblUserRolePgmGrp, newPgmGrps);
      }

      await queryRunner.commitTransaction();
      return savedRole;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error copying user role:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}


