/**
 * SYS1003M00Service - ?�용????�� 관�??�비??
 *
 * 주요 기능:
 * - ?�용????�� 목록 조회 �?관�?
 * - ?�로그램 그룹�??�용????�� ?�결 관�?
 * - 메뉴 ?�보 조회
 * - ?�용????�� 복사 기능
 *
 * ?��? ?�이�?
 * - TBL_USER_ROLE: ?�용????�� ?�보
 * - TBL_USER_ROLE_PGM_GRP: ?�용????���??�로그램 그룹 ?�결
 * - TBL_PGM_GRP_INF: ?�로그램 그룹 ?�보
 * - TBL_MENU_INF: 메뉴 ?�보
 * - TBL_USER_INF: ?�용???�보 (?�용????카운?�용)
 *
 * ?��? ?�로?��?:
 * - ?�음 (TypeORM 쿼리�??��?
 *
 * ?�용 ?�면:
 * - SYS1003M00: ?�용????�� 관�??�면
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
 * ?�용????�� ?�?�용 ?�이로드 ?�터?�이??
 *
 * @description
 * - createdRows: ?�규 ?�성???�용????�� 목록
 * - updatedRows: ?�정???�용????�� 목록
 * - deletedRows: ??��???�용????�� 목록
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
   * 모든 메뉴 ?�보 조회
   *
   * @description
   * - ?�용?��?가 'Y'??메뉴�?조회?�니??
   * - 메뉴ID ?�으�??�렬?�여 반환?�니??
   *
   * @returns Promise<TblMenuInf[]> - 메뉴 ?�보 목록
   * @example
   * const menus = await sysService.findAllMenus();
   * // 결과: [{ menuId: "M001", menuNm: "?�용??관�?, useYn: "Y" }]
   *
   * @throws Error - DB 조회 ?�패 ??
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
   * ?�용????�� 목록 조회 (?�용?????�함)
   *
   * @description
   * - ?�용????��별로 ?�당 ??��??가�??�용???��? ?�께 조회?�니??
   * - 메뉴 ?�보?� ?�용???�보�?LEFT JOIN?�여 조회?�니??
   * - 검??조건(usrRoleId, useYn)???�용?????�습?�다.
   * - 결과??camelCase�?변?�하??반환?�니??
   *
   * @param usrRoleId - ?�용????�� ID (부�?검??가??
   * @param useYn - ?�용?��? ('Y'/'N')
   * @returns Promise<TblUserRole[]> - ?�용????�� 목록 (?�용?????�함)
   * @example
   * const roles = await sysService.findAllUserRoles('A25', 'Y');
   * // 결과: [{ usrRoleId: "A250715001", usrRoleNm: "?�반?�용??, cnt: 5 }]
   *
   * @throws Error - DB 조회 ?�패 ??
   */
  async findAllUserRoles(
    usrRoleId?: string,
    useYn?: string,
  ): Promise<TblUserRole[]> {
    try {
      console.log('=== ?�용?�역??조회 ?�작 ===');
      console.log('?�력 ?�라미터:', { usrRoleId, useYn });
      console.log('usrRoleId ?�??', typeof usrRoleId, '�?', usrRoleId);
      console.log('useYn ?�??', typeof useYn, '�?', useYn);

      // 메뉴 ?�보?� ?�용???�보�?JOIN?�여 ?�용????���??�용????조회
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
          'p.pgmNm as BASE_OUTPUT_SCRN_PGM_NM_CTT', // ?�로그램�?조인
        ]);

      // 조회 조건 ?�용 (GROUP BY ?�전???�용)
      if (usrRoleId && usrRoleId.trim()) {
        queryBuilder.andWhere(
          '(ur.usrRoleId LIKE :usrRoleId OR ur.usrRoleNm LIKE :usrRoleNm)',
          {
            usrRoleId: `${usrRoleId}%`,
            usrRoleNm: `%${usrRoleId}%`,
          },
        );
        console.log('?�용?�역?�코??�?조건 ?�용:', usrRoleId);
      }

      if (useYn && useYn.trim()) {
        queryBuilder.andWhere('ur.useYn = :useYn', { useYn });
        console.log('?�용?��? 조건 ?�용:', useYn);
      }

      // 기본 쿼리 결과 ?�인 (조건 ?�용 ??
      const allRows = await this.userRoleRepository.manager
        .createQueryBuilder(TblUserRole, 'ur')
        .select(['ur.usrRoleId', 'ur.usrRoleNm', 'ur.useYn'])
        .getRawMany();
      console.log('=== ?�체 ?�용?�역???�이??(조건 ?�용 ?? ===');
      console.log('�?개수:', allRows.length);
      console.log(
        'useYn 값들:',
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

      // 쿼리 결과 로그 출력
      console.log('?�용?�역??조회 조건:', { usrRoleId, useYn });
      console.log('?�용?�역??쿼리 결과 개수:', rawRows.length);
      console.log('?�용?�역??쿼리 결과 (처음 3�?:', rawRows.slice(0, 3));

      return toCamelCase(rawRows);
    } catch (error) {
      console.error('Error finding all user roles:', error);
      throw error;
    }
  }

  /**
   * ?�용????�� ?�??(?�규/?�정/??��)
   *
   * @description
   * - ?�랜??��???�용?�여 ?�규 ?�성, ?�정, ??���??�전?�게 처리?�니??
   * - ?�규 ?�성 ??@BeforeInsert ?�코?�이?��? ?�동?�로 usrRoleId�??�성?�니??
   * - ?�정 ??@BeforeUpdate ?�코?�이?��? ?�동?�로 변경일?��? ?�정?�니??
   * - ?�재 로그?�한 ?�용?�의 ?�션 ?�보�??�용?�여 ?�록??변경자 ?�보�??�정?�니??
   *
   * @param payload - ?�?�할 ?�용????�� ?�이??
   * @param currentUserId - ?�재 로그?�한 ?�용??ID (?�션?�서 ?�달)
   * @returns Promise<TblUserRole[]> - ?�?�된 ?�용????�� 목록
   * @example
   * const result = await sysService.saveUserRoles({
   *   createdRows: [newRole],
   *   updatedRows: [updatedRole],
   *   deletedRows: [deletedRole]
   * }, "E001");
   *
   * @throws Error - ?�랜??�� ?�패 ??
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

      // ??�� 처리
      if (deletedRows && deletedRows.length > 0) {
        const deleteIds = deletedRows.map((row) => row.usrRoleId);
        await queryRunner.manager.delete(TblUserRole, deleteIds);
      }

      // ?�티?�의 @BeforeInsert ?�코?�이?�에???�동?�로 usrRoleId ?�성
      const processedCreatedRows = createdRows;

      const upsertRows = [...processedCreatedRows, ...updatedRows];
      if (upsertRows && upsertRows.length > 0) {
        // ?�티???�스?�스�?변?�하??@BeforeInsert ?�코?�이?��? ?�작?�도�???
        const entityInstances = upsertRows.map((row) => {
          const entity = new TblUserRole();
          Object.assign(entity, row);

          // ?�규 ?�성 ?�에�??�록?�시 ?�정
          if (!row.usrRoleId || row.usrRoleId.trim() === '') {
            entity.regDttm = ''; // @BeforeInsert?�서 ?�동 ?�정
            entity.chngrId = currentUserId; // ?�재 로그?�한 ?�용??ID
          } else {
            // ?�정 ??변경일???�정
            entity.chngDttm = ''; // @BeforeUpdate?�서 ?�동 ?�정
            entity.chngrId = currentUserId; // ?�재 로그?�한 ?�용??ID
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
   * ?�정 ??��???�로그램 그룹 목록 조회
   *
   * @description
   * - ?�정 ?�용????��???�결???�로그램 그룹 목록??조회?�니??
   * - �??�로그램 그룹별로 ?�당 그룹???�용?�는 ?�용???�도 ?�께 조회?�니??
   * - 결과??camelCase�?변?�하??반환?�니??
   *
   * @param usrRoleId - ?�용????�� ID
   * @returns Promise<any[]> - ?�로그램 그룹 목록 (?�용?????�함)
   * @example
   * const pgmGrps = await sysService.findProgramGroupsByRoleId('A250715001');
   * // 결과: [{ pgmGrpId: "PG001", pgmGrpNm: "?�용?��?�?, cnt: 3 }]
   *
   * @throws Error - DB 조회 ?�패 ??
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
        'pg.USE_YN as PGM_GRP_USE_YN', // ?�로그램그룹 ?�체???�용?��?
        'urpg.USR_ROLE_ID as USR_ROLE_ID',
        'urpg.USE_YN as USE_YN',
        'COUNT(DISTINCT u.userId) as CNT',
      ])
      .groupBy(
        'pg.PGM_GRP_ID, pg.PGM_GRP_NM, pg.USE_YN, urpg.USR_ROLE_ID, urpg.USE_YN',
      )
      .orderBy('pg.PGM_GRP_ID')
      .getRawMany();

    // 쿼리 결과 로그 출력
    console.log('?�로그램그룹 쿼리 결과:', rawRows);

    // key�?camelCase�?변?�해??반환
    return toCamelCase(rawRows);
  }

  /**
   * 모든 ?�로그램 그룹 조회 (?�규 ??�� ?�성 ???�용)
   *
   * @description
   * - 모든 ?�로그램 그룹 목록??조회?�니??
   * - �??�로그램 그룹별로 ?�당 그룹???�용?�는 ?�용???�도 ?�께 조회?�니??
   * - ?�규 ?�용????�� ?�성 ???�로그램 그룹 ?�택?�으�??�용?�니??
   *
   * @returns Promise<any[]> - ?�체 ?�로그램 그룹 목록 (?�용?????�함)
   * @example
   * const allPgmGrps = await sysService.findAllProgramGroups();
   * // 결과: [{ pgmGrpId: "PG001", pgmGrpNm: "?�용?��?�?, cnt: 5 }]
   *
   * @throws Error - DB 조회 ?�패 ??
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
        'pg.USE_YN as PGM_GRP_USE_YN', // ?�로그램그룹 ?�체???�용?��?
        'COUNT(DISTINCT u.userId) as CNT',
      ])
      .groupBy('pg.PGM_GRP_ID, pg.PGM_GRP_NM, pg.USE_YN')
      .orderBy('pg.PGM_GRP_ID')
      .getRawMany();

    // 쿼리 결과 로그 출력
    console.log('?�체 ?�로그램그룹 쿼리 결과:', rawRows);

    // key�?camelCase�?변?�해??반환
    return toCamelCase(rawRows);
  }

  /**
   * ?�정 ??��???�로그램 그룹 ?�결 ?�보 ?�??
   *
   * @description
   * - ?�정 ?�용????��???�결???�로그램 그룹 ?�보�??�?�합?�다.
   * - 기존 ?�결 ?�보�?모두 ??��?????�로???�결 ?�보�??�?�합?�다.
   * - ?�랜??��???�용?�여 ?�전?�게 처리?�니??
   * - ?�재 로그?�한 ?�용?�의 ?�션 ?�보�??�용?�여 ?�록??변경자 ?�보�??�정?�니??
   *
   * @param usrRoleId - ?�용????�� ID
   * @param pgmGrps - ?�?�할 ?�로그램 그룹 ?�결 ?�보 목록
   * @param currentUserId - ?�재 로그?�한 ?�용??ID (?�션?�서 ?�달)
   * @returns Promise<void>
   * @example
   * await sysService.saveProgramGroupsForRole('A250715001', [
   *   { pgmGrpId: 'PG001', useYn: 'Y' },
   *   { pgmGrpId: 'PG002', useYn: 'N' }
   * ], "E001");
   *
   * @throws Error - ?�랜??�� ?�패 ??
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
      // 1. ?�당 ??��??기존 ?�로그램 그룹 ?�결??모두 ??��
      await queryRunner.manager.delete(TblUserRolePgmGrp, { usrRoleId });

      // 2. ?�로???�로그램 그룹 목록???�??(pgmGrps가 비어?��? ?��? 경우)
      if (pgmGrps && pgmGrps.length > 0) {
        // ?�티???�스?�스�?변?�하??@BeforeInsert ?�코?�이?��? ?�작?�도�???
        const entitiesToSave = pgmGrps.map((p) => {
          const entity = new TblUserRolePgmGrp();
          Object.assign(entity, {
            ...p,
            usrRoleId,
            chngrId: currentUserId, // ?�재 로그?�한 ?�용??ID
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
   * ?�용????�� 복사
   *
   * @description
   * - 기존 ?�용????��??복사?�여 ?�로????��???�성?�니??
   * - ?�로????�� ID??'A' + YYMMDD + 3?�리 ?�번 ?�식?�로 ?�동 ?�성?�니??
   * - ?�본 ??��???�로그램 그룹 ?�결 ?�보???�께 복사?�니??
   * - ?�랜??��???�용?�여 ?�전?�게 처리?�니??
   * - ?�재 로그?�한 ?�용?�의 ?�션 ?�보�??�용?�여 ?�록??변경자 ?�보�??�정?�니??
   *
   * @param originalRoleId - 복사???�본 ??�� ID
   * @param currentUserId - ?�재 로그?�한 ?�용??ID (?�션?�서 ?�달)
   * @returns Promise<TblUserRole> - ?�로 ?�성???�용????��
   * @example
   * const newRole = await sysService.copyUserRole('A250715001', "E001");
   * // 결과: { usrRoleId: "A250715002", usrRoleNm: "?�반?�용??복사�? }
   *
   * @throws Error - ?�본 ??��???�거???�랜??�� ?�패 ??
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
      // 1. ?�본 ??�� ?�보 조회
      const originalRole = await queryRunner.manager.findOne(TblUserRole, {
        where: { usrRoleId: originalRoleId },
      });
      if (!originalRole) {
        throw new Error('복사???�본 ??��??찾을 ???�습?�다.');
      }

      // 2. ?�로????�� ID ?�성 (기존 ?�턴: A + YYMMDD + 3?�리 ?�번)
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const timestamp = Date.now().toString().slice(-3);

      const newRoleId = `A${year}${month}${day}${timestamp}`;

      // 3. ??�� ?�보 복사 �??�??(?�티???�스?�스�?변?�하??@BeforeInsert ?�코?�이?��? ?�작?�도�???
      const newRoleEntity = new TblUserRole();
      Object.assign(newRoleEntity, {
        ...originalRole,
        usrRoleId: newRoleId,
        usrRoleNm: `${originalRole.usrRoleNm}_복사�?,
        regDttm: undefined, // @BeforeInsert?�서 ?�동 ?�정
        chngDttm: undefined, // @BeforeInsert?�서 ?�동 ?�정
        chngrId: currentUserId, // ?�재 로그?�한 ?�용??ID
      });

      const savedRole = await queryRunner.manager.save(
        TblUserRole,
        newRoleEntity,
      );

      // 4. ?�본 ??��???�로그램 그룹 ?�결 ?�보 조회 �?복사
      const originalPgmGrps = await queryRunner.manager.find(
        TblUserRolePgmGrp,
        { where: { usrRoleId: originalRoleId } },
      );
      if (originalPgmGrps.length > 0) {
        // ?�티???�스?�스�?변?�하??@BeforeInsert ?�코?�이?��? ?�작?�도�???
        const newPgmGrps = originalPgmGrps.map((p) => {
          const entity = new TblUserRolePgmGrp();
          Object.assign(entity, {
            ...p,
            usrRoleId: newRoleId,
            chngrId: currentUserId, // ?�재 로그?�한 ?�용??ID
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


