/**
 * SYS1003M00Service - 사용자 역할 관리 서비스
 *
 * 주요 기능:
 * - 사용자 역할 목록 조회 및 관리
 * - 프로그램 그룹별 사용자 역할 연결 관리
 * - 메뉴 정보 조회
 * - 사용자 역할 복사 기능
 *
 * 연관 테이블:
 * - TBL_USER_ROLE: 사용자 역할 정보
 * - TBL_USER_ROLE_PGM_GRP: 사용자 역할별 프로그램 그룹 연결
 * - TBL_PGM_GRP_INF: 프로그램 그룹 정보
 * - TBL_MENU_INF: 메뉴 정보
 * - TBL_USER_INF: 사용자 정보 (사용자 수 카운트용)
 *
 * 연관 프로시저:
 * - 없음 (TypeORM 쿼리로 대체)
 *
 * 사용 화면:
 * - SYS1003M00: 사용자 역할 관리 화면
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
 * 사용자 역할 저장용 페이로드 인터페이스
 *
 * @description
 * - createdRows: 신규 생성할 사용자 역할 목록
 * - updatedRows: 수정할 사용자 역할 목록
 * - deletedRows: 삭제할 사용자 역할 목록
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
   * 모든 메뉴 정보 조회
   *
   * @description
   * - 사용여부가 'Y'인 메뉴만 조회합니다.
   * - 메뉴ID 순으로 정렬하여 반환합니다.
   *
   * @returns Promise<TblMenuInf[]> - 메뉴 정보 목록
   * @example
   * const menus = await sysService.findAllMenus();
   * // 결과: [{ menuId: "M001", menuNm: "사용자 관리", useYn: "Y" }]
   *
   * @throws Error - DB 조회 실패 시
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
   * 사용자 역할 목록 조회 (사용자 수 포함)
   *
   * @description
   * - 사용자 역할별로 해당 역할을 가진 사용자 수를 함께 조회합니다.
   * - 메뉴 정보와 사용자 정보를 LEFT JOIN하여 조회합니다.
   * - 검색 조건(usrRoleId, useYn)을 적용할 수 있습니다.
   * - 결과는 camelCase로 변환하여 반환합니다.
   *
   * @param usrRoleId - 사용자 역할 ID (부분 검색 가능)
   * @param useYn - 사용여부 ('Y'/'N')
   * @returns Promise<TblUserRole[]> - 사용자 역할 목록 (사용자 수 포함)
   * @example
   * const roles = await sysService.findAllUserRoles('A25', 'Y');
   * // 결과: [{ usrRoleId: "A250715001", usrRoleNm: "일반사용자", cnt: 5 }]
   *
   * @throws Error - DB 조회 실패 시
   */
  async findAllUserRoles(
    usrRoleId?: string,
    useYn?: string,
  ): Promise<TblUserRole[]> {
    try {
      console.log('=== 사용자역할 조회 시작 ===');
      console.log('입력 파라미터:', { usrRoleId, useYn });
      console.log('usrRoleId 타입:', typeof usrRoleId, '값:', usrRoleId);
      console.log('useYn 타입:', typeof useYn, '값:', useYn);

      // 메뉴 정보와 사용자 정보를 JOIN하여 사용자 역할별 사용자 수 조회
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
          'p.pgmNm as BASE_OUTPUT_SCRN_PGM_NM_CTT', // 프로그램명 조인
        ]);

      // 조회 조건 적용 (GROUP BY 이전에 적용)
      if (usrRoleId && usrRoleId.trim()) {
        queryBuilder.andWhere(
          '(ur.usrRoleId LIKE :usrRoleId OR ur.usrRoleNm LIKE :usrRoleNm)',
          {
            usrRoleId: `${usrRoleId}%`,
            usrRoleNm: `%${usrRoleId}%`,
          },
        );
        console.log('사용자역할코드/명 조건 적용:', usrRoleId);
      }

      if (useYn && useYn.trim()) {
        queryBuilder.andWhere('ur.useYn = :useYn', { useYn });
        console.log('사용여부 조건 적용:', useYn);
      }

      // 기본 쿼리 결과 확인 (조건 적용 전)
      const allRows = await this.userRoleRepository.manager
        .createQueryBuilder(TblUserRole, 'ur')
        .select(['ur.usrRoleId', 'ur.usrRoleNm', 'ur.useYn'])
        .getRawMany();
      console.log('=== 전체 사용자역할 데이터 (조건 적용 전) ===');
      console.log('총 개수:', allRows.length);
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
      console.log('사용자역할 조회 조건:', { usrRoleId, useYn });
      console.log('사용자역할 쿼리 결과 개수:', rawRows.length);
      console.log('사용자역할 쿼리 결과 (처음 3개):', rawRows.slice(0, 3));

      return toCamelCase(rawRows);
    } catch (error) {
      console.error('Error finding all user roles:', error);
      throw error;
    }
  }

  /**
   * 사용자 역할 저장 (신규/수정/삭제)
   *
   * @description
   * - 트랜잭션을 사용하여 신규 생성, 수정, 삭제를 안전하게 처리합니다.
   * - 신규 생성 시 @BeforeInsert 데코레이터가 자동으로 usrRoleId를 생성합니다.
   * - 수정 시 @BeforeUpdate 데코레이터가 자동으로 변경일시를 설정합니다.
   * - 현재 로그인한 사용자의 세션 정보를 활용하여 등록자/변경자 정보를 설정합니다.
   *
   * @param payload - 저장할 사용자 역할 데이터
   * @param currentUserId - 현재 로그인한 사용자 ID (세션에서 전달)
   * @returns Promise<TblUserRole[]> - 저장된 사용자 역할 목록
   * @example
   * const result = await sysService.saveUserRoles({
   *   createdRows: [newRole],
   *   updatedRows: [updatedRole],
   *   deletedRows: [deletedRole]
   * }, "E001");
   *
   * @throws Error - 트랜잭션 실패 시
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

      // 삭제 처리
      if (deletedRows && deletedRows.length > 0) {
        const deleteIds = deletedRows.map((row) => row.usrRoleId);
        await queryRunner.manager.delete(TblUserRole, deleteIds);
      }

      // 엔티티의 @BeforeInsert 데코레이터에서 자동으로 usrRoleId 생성
      const processedCreatedRows = createdRows;

      const upsertRows = [...processedCreatedRows, ...updatedRows];
      if (upsertRows && upsertRows.length > 0) {
        // 엔티티 인스턴스로 변환하여 @BeforeInsert 데코레이터가 동작하도록 함
        const entityInstances = upsertRows.map((row) => {
          const entity = new TblUserRole();
          Object.assign(entity, row);

          // 신규 생성 시에만 등록일시 설정
          if (!row.usrRoleId || row.usrRoleId.trim() === '') {
            entity.regDttm = ''; // @BeforeInsert에서 자동 설정
            entity.chngrId = currentUserId; // 현재 로그인한 사용자 ID
          } else {
            // 수정 시 변경일시 설정
            entity.chngDttm = ''; // @BeforeUpdate에서 자동 설정
            entity.chngrId = currentUserId; // 현재 로그인한 사용자 ID
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
   * 특정 역할의 프로그램 그룹 목록 조회
   *
   * @description
   * - 특정 사용자 역할에 연결된 프로그램 그룹 목록을 조회합니다.
   * - 각 프로그램 그룹별로 해당 그룹을 사용하는 사용자 수도 함께 조회합니다.
   * - 결과는 camelCase로 변환하여 반환합니다.
   *
   * @param usrRoleId - 사용자 역할 ID
   * @returns Promise<any[]> - 프로그램 그룹 목록 (사용자 수 포함)
   * @example
   * const pgmGrps = await sysService.findProgramGroupsByRoleId('A250715001');
   * // 결과: [{ pgmGrpId: "PG001", pgmGrpNm: "사용자관리", cnt: 3 }]
   *
   * @throws Error - DB 조회 실패 시
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
        'pg.USE_YN as PGM_GRP_USE_YN', // 프로그램그룹 자체의 사용여부
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
    console.log('프로그램그룹 쿼리 결과:', rawRows);

    // key를 camelCase로 변환해서 반환
    return toCamelCase(rawRows);
  }

  /**
   * 모든 프로그램 그룹 조회 (신규 역할 생성 시 사용)
   *
   * @description
   * - 모든 프로그램 그룹 목록을 조회합니다.
   * - 각 프로그램 그룹별로 해당 그룹을 사용하는 사용자 수도 함께 조회합니다.
   * - 신규 사용자 역할 생성 시 프로그램 그룹 선택용으로 사용됩니다.
   *
   * @returns Promise<any[]> - 전체 프로그램 그룹 목록 (사용자 수 포함)
   * @example
   * const allPgmGrps = await sysService.findAllProgramGroups();
   * // 결과: [{ pgmGrpId: "PG001", pgmGrpNm: "사용자관리", cnt: 5 }]
   *
   * @throws Error - DB 조회 실패 시
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
        'pg.USE_YN as PGM_GRP_USE_YN', // 프로그램그룹 자체의 사용여부
        'COUNT(DISTINCT u.userId) as CNT',
      ])
      .groupBy('pg.PGM_GRP_ID, pg.PGM_GRP_NM, pg.USE_YN')
      .orderBy('pg.PGM_GRP_ID')
      .getRawMany();

    // 쿼리 결과 로그 출력
    console.log('전체 프로그램그룹 쿼리 결과:', rawRows);

    // key를 camelCase로 변환해서 반환
    return toCamelCase(rawRows);
  }

  /**
   * 특정 역할의 프로그램 그룹 연결 정보 저장
   *
   * @description
   * - 특정 사용자 역할에 연결된 프로그램 그룹 정보를 저장합니다.
   * - 기존 연결 정보를 모두 삭제한 후 새로운 연결 정보를 저장합니다.
   * - 트랜잭션을 사용하여 안전하게 처리합니다.
   * - 현재 로그인한 사용자의 세션 정보를 활용하여 등록자/변경자 정보를 설정합니다.
   *
   * @param usrRoleId - 사용자 역할 ID
   * @param pgmGrps - 저장할 프로그램 그룹 연결 정보 목록
   * @param currentUserId - 현재 로그인한 사용자 ID (세션에서 전달)
   * @returns Promise<void>
   * @example
   * await sysService.saveProgramGroupsForRole('A250715001', [
   *   { pgmGrpId: 'PG001', useYn: 'Y' },
   *   { pgmGrpId: 'PG002', useYn: 'N' }
   * ], "E001");
   *
   * @throws Error - 트랜잭션 실패 시
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
      // 1. 해당 역할의 기존 프로그램 그룹 연결을 모두 삭제
      await queryRunner.manager.delete(TblUserRolePgmGrp, { usrRoleId });

      // 2. 새로운 프로그램 그룹 목록을 저장 (pgmGrps가 비어있지 않은 경우)
      if (pgmGrps && pgmGrps.length > 0) {
        // 엔티티 인스턴스로 변환하여 @BeforeInsert 데코레이터가 동작하도록 함
        const entitiesToSave = pgmGrps.map((p) => {
          const entity = new TblUserRolePgmGrp();
          Object.assign(entity, {
            ...p,
            usrRoleId,
            chngrId: currentUserId, // 현재 로그인한 사용자 ID
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
   * 사용자 역할 복사
   *
   * @description
   * - 기존 사용자 역할을 복사하여 새로운 역할을 생성합니다.
   * - 새로운 역할 ID는 'A' + YYMMDD + 3자리 순번 형식으로 자동 생성됩니다.
   * - 원본 역할의 프로그램 그룹 연결 정보도 함께 복사됩니다.
   * - 트랜잭션을 사용하여 안전하게 처리합니다.
   * - 현재 로그인한 사용자의 세션 정보를 활용하여 등록자/변경자 정보를 설정합니다.
   *
   * @param originalRoleId - 복사할 원본 역할 ID
   * @param currentUserId - 현재 로그인한 사용자 ID (세션에서 전달)
   * @returns Promise<TblUserRole> - 새로 생성된 사용자 역할
   * @example
   * const newRole = await sysService.copyUserRole('A250715001', "E001");
   * // 결과: { usrRoleId: "A250715002", usrRoleNm: "일반사용자_복사본" }
   *
   * @throws Error - 원본 역할이 없거나 트랜잭션 실패 시
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
      // 1. 원본 역할 정보 조회
      const originalRole = await queryRunner.manager.findOne(TblUserRole, {
        where: { usrRoleId: originalRoleId },
      });
      if (!originalRole) {
        throw new Error('복사할 원본 역할을 찾을 수 없습니다.');
      }

      // 2. 새로운 역할 ID 생성 (기존 패턴: A + YYMMDD + 3자리 순번)
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const timestamp = Date.now().toString().slice(-3);

      const newRoleId = `A${year}${month}${day}${timestamp}`;

      // 3. 역할 정보 복사 및 저장 (엔티티 인스턴스로 변환하여 @BeforeInsert 데코레이터가 동작하도록 함)
      const newRoleEntity = new TblUserRole();
      Object.assign(newRoleEntity, {
        ...originalRole,
        usrRoleId: newRoleId,
        usrRoleNm: `${originalRole.usrRoleNm}_복사본`,
        regDttm: undefined, // @BeforeInsert에서 자동 설정
        chngDttm: undefined, // @BeforeInsert에서 자동 설정
        chngrId: currentUserId, // 현재 로그인한 사용자 ID
      });

      const savedRole = await queryRunner.manager.save(
        TblUserRole,
        newRoleEntity,
      );

      // 4. 원본 역할의 프로그램 그룹 연결 정보 조회 및 복사
      const originalPgmGrps = await queryRunner.manager.find(
        TblUserRolePgmGrp,
        { where: { usrRoleId: originalRoleId } },
      );
      if (originalPgmGrps.length > 0) {
        // 엔티티 인스턴스로 변환하여 @BeforeInsert 데코레이터가 동작하도록 함
        const newPgmGrps = originalPgmGrps.map((p) => {
          const entity = new TblUserRolePgmGrp();
          Object.assign(entity, {
            ...p,
            usrRoleId: newRoleId,
            chngrId: currentUserId, // 현재 로그인한 사용자 ID
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
