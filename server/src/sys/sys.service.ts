import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TblMenuInf } from '../entities/tbl-menu-inf.entity';
import { TblPgmGrpInf } from '../entities/tbl-pgm-grp-inf.entity';
import { TblPgmGrpPgm } from '../entities/tbl-pgm-grp-pgm.entity';
import { ProgramEntity } from '../entities/program.entity';
import { toCamelCase } from '../utils/toCamelCase';

@Injectable()
export class SysService {
  constructor(
    @InjectRepository(TblMenuInf)
    private menuInfRepository: Repository<TblMenuInf>,
    @InjectRepository(ProgramEntity)
    private programRepository: Repository<ProgramEntity>,
    @InjectRepository(TblPgmGrpInf)
    private pgmGrpInfRepository: Repository<TblPgmGrpInf>,
    @InjectRepository(TblPgmGrpPgm)
    private pgmGrpPgmRepository: Repository<TblPgmGrpPgm>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  // ===== SYS1002M00: 메뉴 관�?=====
  
  async findAllMenus(query: any = {}): Promise<any[]> {
    try {
      let sql = `
        SELECT T1.MENU_ID
             , T1.MENU_NM
             , T1.USE_YN
             , T1.CHNG_DTTM
             , T1.CHBGR_ID
             , NVL(T2.USER_CNT, 0) AS USER_CNT
             , (SELECT USER_NM FROM TBL_USER_INF WHERE USER_ID = T1.CHBGR_ID) AS CHNGR_NM
          FROM TBL_MENU_INF T1
          LEFT JOIN (
              SELECT B.MENU_ID
                   , COUNT(B.MENU_ID) AS USER_CNT
                FROM TBL_USER_INF A
                INNER JOIN TBL_USER_ROLE B
                   ON A.USR_ROLE_ID = B.USR_ROLE_ID
              GROUP BY B.MENU_ID
          ) T2
          ON T1.MENU_ID = T2.MENU_ID
         WHERE 1=1
      `;
      
      const params: string[] = [];
      
      if (query.MENU_KWD) {
        sql += ` AND (T1.MENU_ID LIKE :${params.length + 1} OR T1.MENU_NM LIKE :${params.length + 2})`;
        params.push(`%${query.MENU_KWD}%`, `%${query.MENU_KWD}%`);
      }
      
      if (query.USE_YN) {
        sql += ` AND T1.USE_YN = :${params.length + 1}`;
        params.push(query.USE_YN);
      }
      
      sql += ` ORDER BY T1.MENU_ID ASC`;
      
      return await this.dataSource.query(sql, params);
    } catch (error) {
      console.error('Error finding all menus:', error);
      throw error;
    }
  }

  async findMenuById(menuId: string): Promise<TblMenuInf> {
    try {
      const result = await this.dataSource.query(`
        SELECT * FROM TBL_MENU_INF 
        WHERE MENU_ID = :1
      `, [menuId]);
      
      if (result.length === 0) {
        throw new Error('메뉴�?찾을 ???�습?�다.');
      }
      
      return result[0];
    } catch (error) {
      console.error('Error finding menu by ID:', error);
      throw error;
    }
  }

  async addProgramsToGroup(groupId: string, programIds: string[]): Promise<number> {
    let count = 0;
    for (const pgmId of programIds) {
      // ?��? ?�록???�로그램?� ?�외
      const exists = await this.dataSource.query(
        `SELECT 1 FROM TBL_PGM_GRP_PGM WHERE PGM_GRP_ID = :1 AND PGM_ID = :2`,
        [groupId, pgmId]
      );
      if (exists.length === 0) {
        await this.dataSource.query(
          `INSERT INTO TBL_PGM_GRP_PGM (PGM_GRP_ID, PGM_ID) VALUES (:1, :2)`,
          [groupId, pgmId]
        );
        count++;
      }
    }
    return count;
  }

  async createMenu(menuData: any): Promise<TblMenuInf> {
    try {
      const now = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      
      // MENU_ID ?�동 ?�성: M + ?�월???�리(YYMMDD) + 같�? ?�월???�이?�의 ??3?�리 max+1
      const datePrefix = now.slice(2, 8); // YYMMDD
      const existingMenus = await this.dataSource.query(`
        SELECT MENU_ID FROM TBL_MENU_INF 
        WHERE MENU_ID LIKE :1 
        ORDER BY MENU_ID DESC
      `, [`M${datePrefix}%`]);
      
      let sequence = 1;
      if (existingMenus.length > 0) {
        const lastMenuId = existingMenus[0].MENU_ID;
        const lastSequence = parseInt(lastMenuId.slice(-3));
        sequence = lastSequence + 1;
      }
      
      const menuId = `M${datePrefix}${sequence.toString().padStart(3, '0')}`;
      
      await this.dataSource.query(`
        INSERT INTO TBL_MENU_INF (
          MENU_ID, MENU_NM, USE_YN, REG_DTTM, CHNG_DTTM, CHBGR_ID
        ) VALUES (:1, :2, :3, :4, :5, :6)
      `, [
        menuId,
        menuData.MENU_NM || menuData.menuNm,
        menuData.USE_YN || menuData.useYn || 'Y',
        now,
        now,
        menuData.CHNGR_ID || menuData.chngrId || 'SYSTEM'
      ]);

      return this.findMenuById(menuId);
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  }

  async updateMenu(menuId: string, menuData: any): Promise<TblMenuInf> {
    try {
      const now = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      
      await this.dataSource.query(`
        UPDATE TBL_MENU_INF 
        SET MENU_NM = :1, USE_YN = :2, CHNG_DTTM = :3, CHBGR_ID = :4
        WHERE MENU_ID = :5
      `, [
        menuData.MENU_NM || menuData.menuNm,
        menuData.USE_YN || menuData.useYn,
        now,
        menuData.CHNGR_ID || menuData.chngrId || 'SYSTEM',
        menuId
      ]);

      return this.findMenuById(menuId);
    } catch (error) {
      console.error('Error updating menu:', error);
      throw error;
    }
  }

  async deleteMenu(menuId: string): Promise<void> {
    try {
      // 메뉴 ?�세 ?�보 먼�? ??��
      await this.dataSource.query(`
        DELETE FROM TBL_MENU_DTL 
        WHERE MENU_ID = :1
      `, [menuId]);
      
      // 메뉴 ?�보 ??��
      await this.dataSource.query(`
        DELETE FROM TBL_MENU_INF 
        WHERE MENU_ID = :1
      `, [menuId]);
    } catch (error) {
      console.error('Error deleting menu:', error);
      throw error;
    }
  }

  async copyMenu(originalMenuId: string, newMenuName: string): Promise<any> {
    try {
      console.log('=== copyMenu ?�출??===');
      console.log('?�본 메뉴 ID:', originalMenuId);
      console.log('??메뉴�?', newMenuName);

      // 1. ?�로??메뉴 ID ?�성
      const now = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      const datePrefix = now.slice(2, 8); // YYMMDD
      const existingMenus = await this.dataSource.query(`
        SELECT MENU_ID FROM TBL_MENU_INF 
        WHERE MENU_ID LIKE :1 
        ORDER BY MENU_ID DESC
      `, [`M${datePrefix}%`]);
      
      let sequence = 1;
      if (existingMenus.length > 0) {
        const lastMenuId = existingMenus[0].MENU_ID;
        const lastSequence = parseInt(lastMenuId.slice(-3));
        sequence = lastSequence + 1;
      }
      
      const newMenuId = `M${datePrefix}${sequence.toString().padStart(3, '0')}`;
      console.log('?�성????메뉴 ID:', newMenuId);

      // 2. ?�본 메뉴 ?�보 조회
      const originalMenu = await this.dataSource.query(`
        SELECT * FROM TBL_MENU_INF 
        WHERE MENU_ID = :1
      `, [originalMenuId]);

      if (originalMenu.length === 0) {
        throw new Error('?�본 메뉴�?찾을 ???�습?�다.');
      }

      const menuInfo = originalMenu[0];
      console.log('?�본 메뉴 ?�보:', menuInfo);

      // 3. ??메뉴 ?�보 ?�??
      const newMenuNameWithCopy = `${newMenuName}_COPY`;
      await this.dataSource.query(`
        INSERT INTO TBL_MENU_INF (
          MENU_ID, MENU_NM, USE_YN, REG_DTTM, CHNG_DTTM, CHBGR_ID
        ) VALUES (:1, :2, :3, :4, :5, :6)
      `, [
        newMenuId,
        newMenuNameWithCopy,
        'Y', // 복사??메뉴??기본?�으�??�용
        now,
        now,
        'SYSTEM'
      ]);

      console.log('??메뉴 ?�보 ?�???�료');

      // 4. 메뉴 ?�세(?�로그램) 복사
      const menuDetails = await this.dataSource.query(`
        SELECT * FROM TBL_MENU_DTL 
        WHERE MENU_ID = :1
        ORDER BY MENU_SEQ
      `, [originalMenuId]);

      console.log('복사??메뉴 ?�세 개수:', menuDetails.length);

      for (const detail of menuDetails) {
        await this.dataSource.query(`
          INSERT INTO TBL_MENU_DTL (
            MENU_ID, MENU_SEQ, PGM_ID, HGRK_MENU_SEQ, MENU_DSP_NM, 
            MENU_SHP_DVCD, SORT_SEQ, USE_YN, REG_DTTM, CHNG_DTTM, CHNGR_ID
          ) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11)
        `, [
          newMenuId,
          detail.MENU_SEQ,
          detail.PGM_ID,
          detail.HGRK_MENU_SEQ,
          detail.MENU_DSP_NM,
          detail.MENU_SHP_DVCD,
          detail.SORT_SEQ,
          detail.USE_YN || 'Y',
          now,
          now,
          'SYSTEM'
        ]);
      }

      console.log('메뉴 ?�세 복사 ?�료');

      // 5. 결과 반환
      const result = {
        MENU_ID: newMenuId,
        MENU_NM: newMenuNameWithCopy
      };

      console.log('복사 ?�료 결과:', result);
      return result;

    } catch (error) {
      console.error('Error copying menu:', error);
      throw error;
    }
  }

  // ?�체 메뉴 ?�리 조회 (SEIZE_TO_BIST 방식)
  async getMenuTree(): Promise<any[]> {
    try {
      // 먼�? 기본 메뉴 ?�이?��? ?�는지 ?�인
      const menuCount = await this.dataSource.query(`
        SELECT COUNT(*) as CNT FROM TBL_MENU_INF WHERE USE_YN = 'Y'
      `);
      
      console.log('메뉴 개수:', menuCount[0]?.CNT);
      
      // 메뉴 ?�이?��? ?�으�?�?배열 반환
      if (menuCount[0]?.CNT === 0) {
        console.log('메뉴 ?�이?��? ?�습?�다.');
        return [];
      }
      
      // SEIZE_TO_BIST 방식???��? CTE 쿼리
      const result = await this.dataSource.query(`
        WITH HierarchicalMenu (MENU_DSP_NM, HGRK_MENU_SEQ, MENU_SEQ, MENU_ID, SORT_SEQ, MENU_SHP_DVCD, PGM_ID, USE_YN) AS (
          -- 루트 ?�드 (HGRK_MENU_SEQ = '0')
          SELECT 
            A1.MENU_DSP_NM,
            NVL(A1.HGRK_MENU_SEQ, 0) || '' AS HGRK_MENU_SEQ,
            A1.MENU_SEQ,
            A1.MENU_ID,
            A1.SORT_SEQ,
            A1.MENU_SHP_DVCD,
            A1.PGM_ID,
            A1.USE_YN
          FROM TBL_MENU_DTL A1
          INNER JOIN TBL_MENU_INF A2 ON A1.MENU_ID = A2.MENU_ID
          WHERE A1.USE_YN = 'Y'
            AND A1.MENU_SHP_DVCD = 'M'  -- 메뉴 ?�태가 'M'(메뉴)??것만
            AND A2.USE_YN = 'Y'         -- 메뉴 ?�보???�용 중인 것만
            AND A1.HGRK_MENU_SEQ = '0'  -- 루트 ?�드�?

          UNION ALL

          -- ?�위 ?�드??(?��?)
          SELECT 
            child.MENU_DSP_NM,
            NVL(child.HGRK_MENU_SEQ, 0) || '' AS HGRK_MENU_SEQ,
            child.MENU_SEQ,
            child.MENU_ID,
            child.SORT_SEQ,
            child.MENU_SHP_DVCD,
            child.PGM_ID,
            child.USE_YN
          FROM TBL_MENU_DTL child
          INNER JOIN TBL_MENU_INF A2 ON child.MENU_ID = A2.MENU_ID
          JOIN HierarchicalMenu parent ON child.HGRK_MENU_SEQ = parent.MENU_SEQ
          WHERE child.USE_YN = 'Y'
            AND child.MENU_SHP_DVCD = 'M'  -- 메뉴 ?�태가 'M'(메뉴)??것만
            AND A2.USE_YN = 'Y'         -- 메뉴 ?�보???�용 중인 것만
        )
        SELECT 
          MENU_DSP_NM,
          HGRK_MENU_SEQ,
          MENU_SEQ,
          MENU_ID,
          SORT_SEQ,
          MENU_SHP_DVCD,
          PGM_ID,
          USE_YN
        FROM HierarchicalMenu
        ORDER BY HGRK_MENU_SEQ, SORT_SEQ
      `);
      
      console.log('?�리 조회 결과:', result.length, '�?);
      return result;
    } catch (error) {
      console.error('Error getting menu tree:', error);
      throw error;
    }
  }

  // ?�정 메뉴 기�??�로 ?�리 조회 (SEIZE_TO_BIST 방식)
  async getMenuTreeByMenu(menuId: string): Promise<any[]> {
    try {
      const query = `
        WITH HierarchicalMenu (MENU_DSP_NM, HGRK_MENU_SEQ, MENU_SEQ, MENU_ID, SORT_SEQ, MENU_SHP_DVCD, PGM_ID, USE_YN) AS (
          -- 루트 ?�드 (HGRK_MENU_SEQ = '0')
          SELECT 
            A1.MENU_DSP_NM,
            NVL(A1.HGRK_MENU_SEQ, 0) || '' AS HGRK_MENU_SEQ,
            A1.MENU_SEQ,
            A1.MENU_ID,
            A1.SORT_SEQ,
            A1.MENU_SHP_DVCD,
            A1.PGM_ID,
            A1.USE_YN
          FROM TBL_MENU_DTL A1
          INNER JOIN TBL_MENU_INF A2 ON A1.MENU_ID = A2.MENU_ID
          WHERE A2.MENU_ID = :1
            AND A1.USE_YN = 'Y'
            AND A1.MENU_SHP_DVCD = 'M'  -- 메뉴 ?�태가 'M'(메뉴)??것만
            AND A2.USE_YN = 'Y'         -- 메뉴 ?�보???�용 중인 것만
            AND A1.HGRK_MENU_SEQ = '0'  -- 루트 ?�드�?

          UNION ALL

          -- ?�위 ?�드??(?��?)
          SELECT 
            child.MENU_DSP_NM,
            NVL(child.HGRK_MENU_SEQ, 0) || '' AS HGRK_MENU_SEQ,
            child.MENU_SEQ,
            child.MENU_ID,
            child.SORT_SEQ,
            child.MENU_SHP_DVCD,
            child.PGM_ID,
            child.USE_YN
          FROM TBL_MENU_DTL child
          INNER JOIN TBL_MENU_INF A2 ON child.MENU_ID = A2.MENU_ID
          JOIN HierarchicalMenu parent ON child.HGRK_MENU_SEQ = parent.MENU_SEQ
          WHERE A2.MENU_ID = :2
            AND child.USE_YN = 'Y'
            AND child.MENU_SHP_DVCD = 'M'  -- 메뉴 ?�태가 'M'(메뉴)??것만
            AND A2.USE_YN = 'Y'         -- 메뉴 ?�보???�용 중인 것만
        )
        SELECT 
          MENU_DSP_NM,
          HGRK_MENU_SEQ,
          MENU_SEQ,
          MENU_ID,
          SORT_SEQ,
          MENU_SHP_DVCD,
          PGM_ID,
          USE_YN
        FROM HierarchicalMenu
        ORDER BY HGRK_MENU_SEQ, SORT_SEQ
      `;
      
      const result = await this.dataSource.query(query, [menuId, menuId]);
      return result;
    } catch (error) {
      console.error('Error getting menu tree by menu:', error);
      throw error;
    }
  }

  // 메뉴 ?�세 조회
  async getMenuDetails(menuId: string, parentMenuSeq: number): Promise<any[]> {
    try {
      const result = await this.dataSource.query(`
        SELECT 
          A.MENU_SEQ,
          A.MENU_DSP_NM,
          A.MENU_SHP_DVCD,
          A.PGM_ID,
          A.USE_YN,
          A.SORT_SEQ,
          B.PGM_NM
        FROM TBL_MENU_DTL A
        LEFT JOIN TBL_PGM_INF B ON A.PGM_ID = B.PGM_ID
        WHERE A.MENU_ID = :1
          AND A.HGRK_MENU_SEQ = :2
        ORDER BY A.SORT_SEQ ASC
      `, [menuId, parentMenuSeq]);
      
      return result;
    } catch (error) {
      console.error('Error getting menu details:', error);
      throw error;
    }
  }

  // 메뉴�??�로그램 목록 조회 (SEIZE_TO_BIST 방식)
  async getMenuPrograms(menuId: string, menuSeq?: number): Promise<any[]> {
    try {
      let query: string;
      let params: any[];
      
      if (menuSeq !== undefined) {
        // SEIZE_TO_BIST 방식: ?�정 메뉴???�위 메뉴?�만 조회
        query = `
          SELECT 
            A.MENU_SEQ,
            A.MENU_DSP_NM,
            A.MENU_SHP_DVCD,
            A.PGM_ID,
            A.USE_YN,
            A.SORT_SEQ,
            B.PGM_NM,
            A.HGRK_MENU_SEQ,
            NVL(CSF.SML_CSF_NM, A.MENU_SHP_DVCD) AS MENU_SHP_DVCD_NM
          FROM TBL_MENU_DTL A
          LEFT JOIN TBL_PGM_INF B ON A.PGM_ID = B.PGM_ID
          LEFT JOIN TBL_SML_CSF_CD CSF ON CSF.LRG_CSF_CD = '304' AND CSF.SML_CSF_CD = A.MENU_SHP_DVCD
          WHERE A.MENU_ID = :1 AND A.HGRK_MENU_SEQ = :2
          ORDER BY A.SORT_SEQ ASC
        `;
        params = [menuId, menuSeq];
      } else {
        // 기존 방식: ?�체 메뉴??모든 ?�로그램 조회
        query = `
          SELECT 
            A.MENU_SEQ,
            A.MENU_DSP_NM,
            A.MENU_SHP_DVCD,
            A.PGM_ID,
            A.USE_YN,
            A.SORT_SEQ,
            B.PGM_NM,
            A.HGRK_MENU_SEQ,
            NVL(CSF.SML_CSF_NM, A.MENU_SHP_DVCD) AS MENU_SHP_DVCD_NM
          FROM TBL_MENU_DTL A
          LEFT JOIN TBL_PGM_INF B ON A.PGM_ID = B.PGM_ID
          LEFT JOIN TBL_SML_CSF_CD CSF ON CSF.LRG_CSF_CD = '304' AND CSF.SML_CSF_CD = A.MENU_SHP_DVCD
          WHERE A.MENU_ID = :1
          ORDER BY A.HGRK_MENU_SEQ ASC, A.SORT_SEQ ASC
        `;
        params = [menuId];
      }
      
      console.log('?�� 메뉴�??�로그램 조회 쿼리:');
      console.log('?�� SQL:', query);
      console.log('?�� ?�라미터:', params);
      
      const result = await this.dataSource.query(query, params);
      
      console.log('??조회 결과:', result);
      console.log('?�� 조회???�이??개수:', result?.length || 0);
      
      return result;
    } catch (error) {
      console.error('Error getting menu programs:', error);
      throw error;
    }
  }

  // ?�로그램 검??
  async searchPrograms(keyword: string): Promise<any[]> {
    try {
      console.log('=== searchPrograms ?�출 ===');
      console.log('검???�워??', keyword);
      
      let sql = `
        SELECT 
          PGM_ID,
          PGM_NM,
          PGM_DIV_CD,
          BIZ_DIV_CD,
          USE_YN,
          LINK_PATH
        FROM TBL_PGM_INF
        WHERE USE_YN = 'Y'
      `;
      
      const params: any[] = [];
      let paramIndex = 1;
      
      // ?�워?��? ?�을 ?�만 LIKE 조건 추�?
      if (keyword && keyword.trim() !== '') {
        sql += ` AND (PGM_ID LIKE :${paramIndex} OR PGM_NM LIKE :${paramIndex + 1})`;
        params.push(`%${keyword}%`, `%${keyword}%`);
        paramIndex += 2;
      }
      
      sql += ` ORDER BY PGM_ID ASC`;
      
      console.log('검??쿼리:', sql);
      console.log('검???�라미터:', params);
      
      const result = await this.dataSource.query(sql, params);
      
      console.log('검??결과:', result.length + '�?);
      console.log('검??결과 ?�이??', result);
      
      return result;
    } catch (error) {
      console.error('Error searching programs:', error);
      throw error;
    }
  }

  // 메뉴???�로그램 추�?
  async addMenuProgram(menuId: string, programData: any): Promise<void> {
    try {
      const now = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      
      // ?�음 MENU_SEQ 계산
      const maxSeqResult = await this.dataSource.query(`
        SELECT MAX(MENU_SEQ) as MAX_SEQ
        FROM TBL_MENU_DTL
        WHERE MENU_ID = :1
      `, [menuId]);
      
      const nextSeq = (maxSeqResult[0]?.MAX_SEQ || 0) + 1;
      
      await this.dataSource.query(`
        INSERT INTO TBL_MENU_DTL (
          MENU_ID, MENU_SEQ, PGM_ID, HGRK_MENU_SEQ, MENU_DSP_NM, 
          MENU_SHP_DVCD, SORT_SEQ, USE_YN, REG_DTTM, CHNG_DTTM, CHNGR_ID
        ) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11)
      `, [
        menuId,
        nextSeq,
        programData.pgmId,
        programData.hgrkMenuSeq || 0,
        programData.menuDspNm,
        programData.menuShpDvcd || 'P', // 304 ?�분류 코드???�분�?코드
        programData.sortSeq, // 받�? ?�라미터 값으�?
        programData.useYn || 'Y',
        now,
        now,
        programData.chngrId || 'SYSTEM'
      ]);
    } catch (error) {
      console.error('Error adding menu program:', error);
      throw error;
    }
  }

  // 메뉴 ?�로그램 ??��
  async deleteMenuProgram(menuId: string, menuSeq: number): Promise<void> {
    try {
      await this.dataSource.query(`
        DELETE FROM TBL_MENU_DTL 
        WHERE MENU_ID = :1 AND MENU_SEQ = :2
      `, [menuId, menuSeq]);
    } catch (error) {
      console.error('Error deleting menu program:', error);
      throw error;
    }
  }

  // 메뉴 ?�로그램 ?�??(SEIZE_TO_BIST 방식)
  async saveMenuPrograms(menuId: string, programs: any[]): Promise<void> {
    try {
      console.log('?�� saveMenuPrograms ?�출 - 메뉴ID:', menuId);
      console.log('?�� ?�?�할 ?�로그램 ?�이??', programs);

      // ?�랜??�� ?�작
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (let i = 0; i < programs.length; i++) {
          const program = programs[i];
          
          if (program.MENU_SEQ && program.MENU_SEQ !== '') {
            // 기존 ??�� ?�데?�트
            await queryRunner.query(`
              UPDATE TBL_MENU_DTL 
              SET 
                MENU_DSP_NM = :1,
                MENU_SHP_DVCD = :2,
                PGM_ID = :3,
                USE_YN = :4,
                SORT_SEQ = :5,
                CHNG_DTTM = SYSDATE,
                CHNGR_ID = 'SYSTEM'
              WHERE MENU_ID = :6 AND MENU_SEQ = :7
            `, [
              program.MENU_DSP_NM,
              program.MENU_SHP_DVCD || 'P', // 304 ?�분류 코드???�분�?코드
              program.PGM_ID || null,
              program.USE_YN,
              program.SORT_SEQ,
              menuId,
              program.MENU_SEQ
            ]);
          } else {
            // ????�� 추�?
            // 1. ?�재 MENU_ID?�서 가????MENU_SEQ 조회
            const maxSeqResult = await queryRunner.query(
              `SELECT NVL(MAX(MENU_SEQ), 0) AS MAX_SEQ FROM TBL_MENU_DTL WHERE MENU_ID = :1`,
              [menuId]
            );
            const nextSeq = (maxSeqResult[0]?.MAX_SEQ || 0) + 1;

            // 2. INSERT ??nextSeq�?MENU_SEQ�??�용
            console.log('INSERT 쿼리:', `INSERT INTO TBL_MENU_DTL (\n  MENU_ID, MENU_SEQ, MENU_DSP_NM, MENU_SHP_DVCD, PGM_ID, \n  USE_YN, SORT_SEQ, HGRK_MENU_SEQ,\n  REG_DTTM, CHNG_DTTM, CHNGR_ID\n) VALUES (\n  :1, :2, :3, :4, :5, :6, :7, :8,\n  SYSDATE, SYSDATE, 'SYSTEM'\n)`);
            console.log('INSERT ?�라미터:', [
              menuId,
              nextSeq,
              program.MENU_DSP_NM,
              program.MENU_SHP_DVCD || 'P',
              program.PGM_ID || null,
              program.USE_YN,
              program.SORT_SEQ,
              program.HGRK_MENU_SEQ
            ]);
            await queryRunner.query(
              `INSERT INTO TBL_MENU_DTL (
                MENU_ID, MENU_SEQ, MENU_DSP_NM, MENU_SHP_DVCD, PGM_ID, 
                USE_YN, SORT_SEQ, HGRK_MENU_SEQ,
                REG_DTTM, CHNG_DTTM, CHNGR_ID
              ) VALUES (
                :1, :2, :3, :4, :5, :6, :7, :8,
                SYSDATE, SYSDATE, 'SYSTEM'
              )`,
              [
                menuId,
                nextSeq, // ??반드??고유??�?
                program.MENU_DSP_NM,
                program.MENU_SHP_DVCD || 'P', // 304 ?�분류 코드???�분�?코드
                program.PGM_ID || null,
                program.USE_YN,
                program.SORT_SEQ, // 받�? ?�라미터 값으�?
                program.HGRK_MENU_SEQ
              ]
            );
          }
        }

        await queryRunner.commitTransaction();
        console.log('??메뉴 ?�로그램 ?�???�료');
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('??메뉴 ?�로그램 ?�???�패:', error);
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error('Error saving menu programs:', error);
      throw error;
    }
  }

  // 메뉴 ?�리 ?�서 ?�데?�트 (SEIZE_TO_BIST 방식)
  async updateMenuTreeOrder(menuId: string, treeData: any[]): Promise<void> {
    try {
      for (const item of treeData) {
        await this.dataSource.query(`
          UPDATE TBL_MENU_DTL
          SET HGRK_MENU_SEQ = :1, SORT_SEQ = :2, CHNG_DTTM = :3, CHNGR_ID = :4
          WHERE MENU_ID = :5 AND MENU_SEQ = :6
        `, [
          item.HGRK_MENU_SEQ,
          item.SORT_SEQ,
          new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14),
          'SYSTEM',
          menuId,
          item.MENU_SEQ
        ]);
      }
    } catch (error) {
      console.error('Error updating menu tree order:', error);
      throw error;
    }
  }

  // ?�플 메뉴 ?�리 ?�이???�성 (?�스?�용)
  async createSampleMenuTree(): Promise<void> {
    try {
      const now = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      
      // 1. 메뉴 기본 ?�보 ?�성
      await this.dataSource.query(`
        INSERT INTO TBL_MENU_INF (MENU_ID, MENU_NM, USE_YN, REG_DTTM, CHNG_DTTM, CHBGR_ID)
        VALUES ('M250723001', '?�스??관�?, 'Y', :1, :2, 'SYSTEM')
      `, [now, now]);

      await this.dataSource.query(`
        INSERT INTO TBL_MENU_INF (MENU_ID, MENU_NM, USE_YN, REG_DTTM, CHNG_DTTM, CHBGR_ID)
        VALUES ('M250723002', '?�용??관�?, 'Y', :1, :2, 'SYSTEM')
      `, [now, now]);

      // 2. 메뉴 ?�세 ?�보 ?�성 (?�리 구조)
      // 루트 메뉴
      await this.dataSource.query(`
        INSERT INTO TBL_MENU_DTL (MENU_ID, MENU_SEQ, MENU_DSP_NM, MENU_SHP_DVCD, HGRK_MENU_SEQ, SORT_SEQ, USE_YN, REG_DTTM, CHNG_DTTM, CHNGR_ID)
        VALUES ('M250723001', 1, '?�스??관�?, 'M', 0, 1, 'Y', :1, :2, 'SYSTEM')
      `, [now, now]);

      // ?�위 메뉴??
      await this.dataSource.query(`
        INSERT INTO TBL_MENU_DTL (MENU_ID, MENU_SEQ, MENU_DSP_NM, MENU_SHP_DVCD, HGRK_MENU_SEQ, SORT_SEQ, USE_YN, REG_DTTM, CHNG_DTTM, CHNGR_ID)
        VALUES ('M250723001', 2, '메뉴 관�?, 'M', 1, 1, 'Y', :1, :2, 'SYSTEM')
      `, [now, now]);

      await this.dataSource.query(`
        INSERT INTO TBL_MENU_DTL (MENU_ID, MENU_SEQ, MENU_DSP_NM, MENU_SHP_DVCD, HGRK_MENU_SEQ, SORT_SEQ, USE_YN, REG_DTTM, CHNG_DTTM, CHNGR_ID)
        VALUES ('M250723001', 3, '?�로그램 관�?, 'M', 1, 2, 'Y', :1, :2, 'SYSTEM')
      `, [now, now]);

      await this.dataSource.query(`
        INSERT INTO TBL_MENU_DTL (MENU_ID, MENU_SEQ, MENU_DSP_NM, MENU_SHP_DVCD, HGRK_MENU_SEQ, SORT_SEQ, USE_YN, REG_DTTM, CHNG_DTTM, CHNGR_ID)
        VALUES ('M250723001', 4, '?�용??관�?, 'M', 0, 2, 'Y', :1, :2, 'SYSTEM')
      `, [now, now]);

      await this.dataSource.query(`
        INSERT INTO TBL_MENU_DTL (MENU_ID, MENU_SEQ, MENU_DSP_NM, MENU_SHP_DVCD, HGRK_MENU_SEQ, SORT_SEQ, USE_YN, REG_DTTM, CHNG_DTTM, CHNGR_ID)
        VALUES ('M250723001', 5, '?�용???�록', 'M', 4, 1, 'Y', :1, :2, 'SYSTEM')
      `, [now, now]);

      await this.dataSource.query(`
        INSERT INTO TBL_MENU_DTL (MENU_ID, MENU_SEQ, MENU_DSP_NM, MENU_SHP_DVCD, HGRK_MENU_SEQ, SORT_SEQ, USE_YN, REG_DTTM, CHNG_DTTM, CHNGR_ID)
        VALUES ('M250723001', 6, '?�용??조회', 'M', 4, 2, 'Y', :1, :2, 'SYSTEM')
      `, [now, now]);

      console.log('?�플 메뉴 ?�리 ?�이?��? ?�성?�었?�니??');
    } catch (error) {
      console.error('Error creating sample menu tree:', error);
      throw error;
    }
  }

  async deleteMenuProgramsHierarchical(menuId: string, menuSeqs: number[]): Promise<void> {
    if (!menuId || !menuSeqs || menuSeqs.length === 0) return;
    // Oracle: START WITH ... CONNECT BY �??�위까�? 모두 ??��
    // ?�러 개의 menuSeqs�???번에 처리
    for (const menuSeq of menuSeqs) {
      // 1. ?�로그램 ?�세(?? TBL_MENU_DTL, TBL_MENU_PGM ?? ??��
      await this.dataSource.query(`
        DELETE FROM TBL_MENU_DTL
         WHERE MENU_ID = :1
           AND MENU_SEQ IN (
             SELECT MENU_SEQ FROM TBL_MENU_DTL
              START WITH MENU_SEQ = :2
              CONNECT BY PRIOR MENU_SEQ = HGRK_MENU_SEQ
           )
      `, [menuId, menuSeq]);
      // 2. ?�요???�로그램-?�로그램 ?�결 ?�이�??�도 추�? ??��
      // await this.dataSource.query(...);
    }
  }


  // ===== SYS1001M00: ?�로그램 그룹 관�?=====
  
  /**
   * ?�로그램 그룹 ID ?�동 ?�성 (P + YYMMDD + 3?�리 ?�번)
   */
  async generateProgramGroupId(): Promise<string> {
    try {
      console.log('=== generateProgramGroupId ?�출??===');
      
      // ?�재 ?�짜�?YYMMDD ?�식?�로 ?�성
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2); // YY
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // MM
      const day = now.getDate().toString().padStart(2, '0'); // DD
      const today = `${year}${month}${day}`; // YYMMDD
      
      console.log('?�재 ?�짜 ?�보:', {
        year,
        month,
        day,
        today,
        fullDate: now.toISOString()
      });
      
      const prefix = `P${today}`;
      console.log('?�성??prefix:', prefix);
      
      // 같�? ?�짜??최�? ?�번 조회
      const maxSeqQuery = `
        SELECT MAX(SUBSTR(PGM_GRP_ID, 8, 3)) as MAX_SEQ
        FROM TBL_PGM_GRP_INF 
        WHERE PGM_GRP_ID LIKE :1
      `;
      
      console.log('최�? ?�번 조회 쿼리:', maxSeqQuery);
      console.log('쿼리 ?�라미터:', `${prefix}%`);
      
      const maxSeqResult = await this.dataSource.query(maxSeqQuery, [`${prefix}%`]);
      const maxSeq = maxSeqResult[0]?.MAX_SEQ || '000';
      
      console.log('조회??최�? ?�번:', maxSeq);
      
      // ?�음 ?�번 계산 (3?�리 0?�딩)
      const nextSeq = (parseInt(maxSeq) + 1).toString().padStart(3, '0');
      
      const newGroupId = `${prefix}${nextSeq}`;
      console.log('최종 ?�성??그룹 ID:', newGroupId, '(?�짜:', today, ', ?�번:', nextSeq, ')');
      
      return newGroupId;
    } catch (error) {
      console.error('Error generating program group ID:', error);
      throw error;
    }
  }
  
  async findAllProgramGroups(searchCondition?: any): Promise<any[]> {
    try {
      console.log('=== findAllProgramGroups ?�출??===');
      console.log('검??조건:', searchCondition);
      
      let query = `
        SELECT 
          PGM_GRP_ID,
          PGM_GRP_NM,
          USE_YN,
          REG_DTTM,
          CHNG_DTTM,
          CHNGR_ID
        FROM TBL_PGM_GRP_INF 
        WHERE 1=1
      `;
      const queryParams: any[] = [];
      let paramIndex = 1;

      if (searchCondition?.PGM_GRP_NM && searchCondition.PGM_GRP_NM.trim()) {
        query += ` AND (PGM_GRP_ID LIKE :${paramIndex} OR PGM_GRP_NM LIKE :${paramIndex + 1})`;
        queryParams.push(`%${searchCondition.PGM_GRP_NM}%`, `%${searchCondition.PGM_GRP_NM}%`);
        paramIndex += 2;
      }

      if (searchCondition?.USE_YN && searchCondition.USE_YN !== '') {
        query += ` AND USE_YN = :${paramIndex}`;
        queryParams.push(searchCondition.USE_YN);
        paramIndex++;
      }

      query += ` ORDER BY PGM_GRP_ID ASC`;

      console.log('=== ?�로그램 그룹 조회 쿼리 ===');
      console.log('SQL:', query);
      console.log('?�라미터:', queryParams);

      const result = await this.dataSource.query(query, queryParams);
      
      console.log('=== ?�로그램 그룹 조회 결과 ===');
      console.log('조회???�코????', result.length);
      if (result.length > 0) {
        console.log('�?번째 ?�코???�플:', result[0]);
      }
      
      return result.map(toCamelCase);
    } catch (error) {
      console.error('Error finding all program groups:', error);
      throw error;
    }
  }

  async findProgramGroupById(groupId: string): Promise<any> {
    try {
      const result = await this.dataSource.query(`
        SELECT 
          PGM_GRP_ID,
          PGM_GRP_NM,
          USE_YN,
          REG_DTTM,
          CHNG_DTTM,
          CHNGR_ID
        FROM TBL_PGM_GRP_INF 
        WHERE PGM_GRP_ID = :1
      `, [groupId]);
      
      if (result.length === 0) {
        throw new Error('?�로그램 그룹??찾을 ???�습?�다.');
      }
      
      return toCamelCase(result[0]);
    } catch (error) {
      console.error('Error finding program group by ID:', error);
      throw error;
    }
  }

  async findProgramsByGroup(groupId: string): Promise<any[]> {
    try {
      const result = await this.dataSource.query(`
        SELECT 
          pgp.PGM_GRP_ID,
          pgp.PGM_ID,
          p.PGM_NM,
          p.PGM_DIV_CD,
          p.BIZ_DIV_CD,
          p.USE_YN,
          p.LINK_PATH,
          p.REG_DTTM,
          p.CHNG_DTTM,
          p.CHNGR_ID,
          NVL(CSF1.SML_CSF_NM, p.PGM_DIV_CD) AS PGM_DIV_NM,
          NVL(CSF2.SML_CSF_NM, p.BIZ_DIV_CD) AS BIZ_DIV_NM
        FROM TBL_PGM_GRP_PGM pgp
        LEFT JOIN TBL_PGM_INF p ON pgp.PGM_ID = p.PGM_ID
        LEFT JOIN TBL_SML_CSF_CD CSF1 ON CSF1.LRG_CSF_CD = '305' AND CSF1.SML_CSF_CD = p.PGM_DIV_CD
        LEFT JOIN TBL_SML_CSF_CD CSF2 ON CSF2.LRG_CSF_CD = '303' AND CSF2.SML_CSF_CD = p.BIZ_DIV_CD
        WHERE pgp.PGM_GRP_ID = :1
        ORDER BY pgp.PGM_ID ASC
      `, [groupId]);
      
      return result.map(toCamelCase);
    } catch (error) {
      console.error('Error finding programs by group:', error);
      throw error;
    }
  }

  async copyProgramGroup(originalGroupId: string): Promise<any> {
    try {
      // ?�본 ?�로그램 그룹 조회
      const originalGroup = await this.findProgramGroupById(originalGroupId);
      if (!originalGroup) {
        throw new Error('?�본 ?�로그램 그룹??찾을 ???�습?�다.');
      }

      // ??그룹 ID ?�동 ?�성
      const newGroupId = await this.generateProgramGroupId();
      
      // ?�재 ?�간
      const now = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);

      // ???�로그램 그룹 ?�성
      await this.dataSource.query(`
        INSERT INTO TBL_PGM_GRP_INF (
          PGM_GRP_ID, PGM_GRP_NM, USE_YN, REG_DTTM, CHNG_DTTM, CHNGR_ID
        ) VALUES (:1, :2, :3, :4, :5, :6)
      `, [
        newGroupId,
        originalGroup.pgmGrpNm + '_COPY',
        'Y',
        now,
        now,
        'SYSTEM'
      ]);

      // ?�본 그룹???�로그램??복사
      const originalPrograms = await this.findProgramsByGroup(originalGroupId);
      for (const program of originalPrograms) {
        await this.dataSource.query(`
          INSERT INTO TBL_PGM_GRP_PGM (PGM_GRP_ID, PGM_ID)
          VALUES (:1, :2)
        `, [newGroupId, program.pgmId]);
      }

      return this.findProgramGroupById(newGroupId);
    } catch (error) {
      console.error('Error copying program group:', error);
      throw error;
    }
  }

  async createProgramGroup(programGroupData: any): Promise<any> {
    try {
      const now = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      
      // 그룹 ID가 비어?�으�??�동 ?�성
      let groupId = programGroupData.pgmGrpId;
      if (!groupId || groupId.trim() === '') {
        groupId = await this.generateProgramGroupId();
      }
      
      await this.dataSource.query(`
        INSERT INTO TBL_PGM_GRP_INF (
          PGM_GRP_ID, PGM_GRP_NM, USE_YN, REG_DTTM, CHNG_DTTM, CHNGR_ID
        ) VALUES (:1, :2, :3, :4, :5, :6)
      `, [
        groupId,
        programGroupData.pgmGrpNm,
        programGroupData.useYn || 'Y',
        now,
        now,
        programGroupData.chngrId || 'SYSTEM'
      ]);

      return this.findProgramGroupById(groupId);
    } catch (error) {
      console.error('Error creating program group:', error);
      throw error;
    }
  }

  async updateProgramGroup(groupId: string, programGroupData: any): Promise<any> {
    try {
      const now = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      
      await this.dataSource.query(`
        UPDATE TBL_PGM_GRP_INF 
        SET PGM_GRP_NM = :1, USE_YN = :2, CHNG_DTTM = :3, CHNGR_ID = :4
        WHERE PGM_GRP_ID = :5
      `, [
        programGroupData.pgmGrpNm,
        programGroupData.useYn,
        now,
        programGroupData.chngrId || 'SYSTEM',
        groupId
      ]);

      return this.findProgramGroupById(groupId);
    } catch (error) {
      console.error('Error updating program group:', error);
      throw error;
    }
  }

  async removeProgramsFromGroup(groupId: string, programIds: string[]): Promise<number> {
    try {
      if (programIds.length === 0) {
        return 0;
      }

      const placeholders = programIds.map((_, index) => `:${index + 2}`).join(',');
      const result = await this.dataSource.query(`
        DELETE FROM TBL_PGM_GRP_PGM 
        WHERE PGM_GRP_ID = :1 AND PGM_ID IN (${placeholders})
      `, [groupId, ...programIds]);

      return result.affectedRows || 0;
    } catch (error) {
      console.error('Error removing programs from group:', error);
      throw error;
    }
  }

  // ===== SYS1000M00: ?�로그램 관�?=====
  
  async findPrograms(params?: any): Promise<any[]> {
    try {
      console.log('=== findPrograms ?�출??===');
      console.log('검???�라미터:', params);
      
      let query = `
        SELECT 
          PGM.PGM_ID,
          PGM.PGM_NM,
          PGM.PGM_DIV_CD,
          PGM.BIZ_DIV_CD,
          PGM.USE_YN,
          PGM.LINK_PATH,
          PGM.PGM_WDTH,
          PGM.PGM_HGHT,
          PGM.PGM_PSN_TOP,
          PGM.PGM_PSN_LFT,
          PGM.REG_DTTM,
          PGM.CHNG_DTTM,
          PGM.CHNGR_ID,
          NVL(CSF1.SML_CSF_NM, PGM.PGM_DIV_CD) AS PGM_DIV_NM,
          NVL(CSF2.SML_CSF_NM, PGM.BIZ_DIV_CD) AS BIZ_DIV_NM
        FROM TBL_PGM_INF PGM
        LEFT JOIN TBL_SML_CSF_CD CSF1 ON CSF1.LRG_CSF_CD = '305' AND CSF1.SML_CSF_CD = PGM.PGM_DIV_CD
        LEFT JOIN TBL_SML_CSF_CD CSF2 ON CSF2.LRG_CSF_CD = '303' AND CSF2.SML_CSF_CD = PGM.BIZ_DIV_CD
        WHERE 1=1
      `;
      const queryParams: any[] = [];
      let paramIndex = 1;

      if (params?.pgmKwd) {
        query += ` AND (PGM.PGM_ID LIKE :${paramIndex} OR PGM.PGM_NM LIKE :${paramIndex + 1})`;
        queryParams.push(`%${params.pgmKwd}%`, `%${params.pgmKwd}%`);
        paramIndex += 2;
      }

      if (params?.pgmDivCd) {
        query += ` AND PGM.PGM_DIV_CD = :${paramIndex}`;
        queryParams.push(params.pgmDivCd);
        paramIndex++;
      }

      if (params?.useYn) {
        query += ` AND PGM.USE_YN = :${paramIndex}`;
        queryParams.push(params.useYn);
        paramIndex++;
      }

      if (params?.bizDivCd) {
        query += ` AND PGM.BIZ_DIV_CD = :${paramIndex}`;
        queryParams.push(params.bizDivCd);
        paramIndex++;
      }

      query += ` ORDER BY PGM.PGM_ID ASC`;

      console.log('=== 조회 쿼리 ===');
      console.log('SQL:', query);
      console.log('?�라미터:', queryParams);

      const result = await this.dataSource.query(query, queryParams);
      
      console.log('=== 조회 결과 ===');
      console.log('조회???�코????', result.length);
      if (result.length > 0) {
        console.log('�?번째 ?�코???�플:', result[0]);
      }
      
      return result.map(toCamelCase);
    } catch (error) {
      console.error('Error finding programs:', error);
      throw error;
    }
  }

  async createProgram(programData: any): Promise<ProgramEntity> {
    try {
      const now = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      
      const insertQuery = `
        INSERT INTO TBL_PGM_INF (
          PGM_ID, PGM_NM, PGM_DIV_CD, BIZ_DIV_CD, USE_YN, LINK_PATH, PGM_WDTH, PGM_HGHT,
          PGM_PSN_TOP, PGM_PSN_LFT, REG_DTTM, CHNG_DTTM, CHNGR_ID
        ) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13)
      `;
      
      const insertParams = [
        programData.pgmId,
        programData.pgmNm,
        programData.pgmDivCd,
        programData.bizDivCd,
        programData.useYn || 'Y',
        programData.linkPath,
        programData.pgmWdth || null,
        programData.pgmHght || null,
        programData.pgmPsnTop || null,
        programData.pgmPsnLft || null,
        now,
        now,
        programData.chngrId || 'SYSTEM'
      ];
      
      await this.dataSource.query(insertQuery, insertParams);

      const result = await this.programRepository.findOne({ where: { pgmId: programData.pgmId } });
      if (!result) {
        throw new Error('?�성???�로그램??찾을 ???�습?�다.');
      }
      return result;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  }

  async updateProgram(pgmId: string, programData: any): Promise<ProgramEntity> {
    try {
      const now = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      
      const updateQuery = `
        UPDATE TBL_PGM_INF 
        SET PGM_NM = :1, PGM_DIV_CD = :2, BIZ_DIV_CD = :3, USE_YN = :4, 
            LINK_PATH = :5, PGM_WDTH = :6, PGM_HGHT = :7, PGM_PSN_TOP = :8, PGM_PSN_LFT = :9,
            CHNG_DTTM = :10, CHNGR_ID = :11
        WHERE PGM_ID = :12
      `;
      
      const updateParams = [
        programData.pgmNm,
        programData.pgmDivCd,
        programData.bizDivCd,
        programData.useYn,
        programData.linkPath,
        programData.pgmWdth || null,
        programData.pgmHght || null,
        programData.pgmPsnTop || null,
        programData.pgmPsnLft || null,
        now,
        programData.chngrId || 'SYSTEM',
        pgmId
      ];
      
      await this.dataSource.query(updateQuery, updateParams);

      const result = await this.programRepository.findOne({ where: { pgmId } });
      if (!result) {
        throw new Error('?�정???�로그램??찾을 ???�습?�다.');
      }
      return result;
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  }

  // SYS1000 - ?�로그램 관�?관??메서?�들

  /**
   * ?�로그램 목록 조회
   */
  async getProgramList(searchCondition: any): Promise<any[]> {
    console.log('=== SYS1000 ?�로그램 목록 조회 ===');
    console.log('검??조건:', searchCondition);

    const query = `
      SELECT A.PGM_ID                                        /* ?�로그램 ID */
           , A.PGM_NM                                        /* ?�로그램�?*/
           , A.PGM_DIV_CD                                    /* ?�로그램구분코드 */
           , A.BIZ_DIV_CD                                    /* ?�무구분코드 */
           , A.USE_YN                                        /* ?�용?��? */
           , A.LINK_PATH                                     /* 링크경로 */
           , A.PGM_WDTH                                      /* ?�로그램 ?�이 */
           , A.PGM_HGHT                                      /* ?�로그램 ?�이 */
           , A.PGM_PSN_TOP                                   /* ?�로그램 ?�치 TOP */
           , A.PGM_PSN_LFT                                   /* ?�로그램 ?�치 LEFT */
           , A.REG_DTTM                                      /* ?�록?�시 */
           , A.CHNG_DTTM                                     /* 변경일??*/
           , A.CHNGR_ID                                      /* 변경자ID */
        FROM TBL_PGM_INF A
       WHERE 1=1
    `;

    const params: any[] = [];

    // 검??조건 추�?
    let whereConditions = '';
    let paramIndex = 1;

    if (searchCondition.pgmKwd && searchCondition.pgmKwd.trim()) {
      whereConditions += ` AND (A.PGM_ID LIKE '%' || :${paramIndex} || '%' OR UPPER(A.PGM_NM) LIKE '%' || UPPER(:${paramIndex + 1}) || '%')`;
      params.push(searchCondition.pgmKwd, searchCondition.pgmKwd);
      paramIndex += 2;
    }

    if (searchCondition.pgmDivCd && searchCondition.pgmDivCd.length > 0) {
      const placeholders = searchCondition.pgmDivCd.map(() => `:${paramIndex++}`).join(',');
      whereConditions += ` AND A.PGM_DIV_CD IN (${placeholders})`;
      params.push(...searchCondition.pgmDivCd);
    }

    if (searchCondition.useYn && searchCondition.useYn !== '') {
      whereConditions += ` AND A.USE_YN = :${paramIndex++}`;
      params.push(searchCondition.useYn);
    }

    if (searchCondition.bizDivCd && searchCondition.bizDivCd.length > 0) {
      const placeholders = searchCondition.bizDivCd.map(() => `:${paramIndex++}`).join(',');
      whereConditions += ` AND A.BIZ_DIV_CD IN (${placeholders})`;
      params.push(...searchCondition.bizDivCd);
    }

    const finalQuery = query + whereConditions + ` ORDER BY A.PGM_ID ASC`;

    console.log('=== SYS1000 조회 쿼리 ===');
    console.log('SQL:', finalQuery);
    console.log('?�라미터:', params);

    const result = await this.dataSource.query(finalQuery, params);
    
    console.log('=== SYS1000 조회 결과 ===');
    console.log('조회???�코????', result.length);
    if (result.length > 0) {
      console.log('�?번째 ?�코???�플:', result[0]);
    }

    return result;
  }

  /**
   * ?�로그램 ?�어 목록 조회
   */
  async getProgramLanguageList(pgmId: string): Promise<any[]> {
    console.log('=== SYS1000 ?�로그램 ?�어 목록 조회 ===');
    console.log('?�로그램 ID:', pgmId);

    const query = `
      SELECT :1 AS PGM_ID
           , A.LNGG_CD
           , A.LNGG_NM
           , B.PGM_NM
        FROM (
              SELECT SMLCLAS_CD AS LNGG_CD
                   , SMLCLAS_CD_NM AS LNGG_NM
                   , SRT_SEQ
                FROM STSYSZ004C
               WHERE SYS_CD = :2
                 AND LRGCLAS_CD = 'LNGG_CD'
                 AND USE_YN = 'Y'
               ORDER BY SRT_SEQ
            ) A
        LEFT JOIN STSYS1016D B
             ON A.LNGG_CD = B.LNGG_CD
            AND B.PGM_ID = :3
        ORDER BY A.SRT_SEQ
    `;

    const params = [pgmId, 'BIST', pgmId];

    console.log('?�행 쿼리:', query);
    console.log('?�라미터:', params);

    try {
      const result = await this.dataSource.query(query, params);
      console.log('?�어 목록 조회 결과:', result);
      return result;
    } catch (error) {
      console.error('?�로그램 ?�어 목록 조회 ?�류:', error);
      throw error;
    }
  }

  /**
   * ?�로그램 ?�보 ?�???�정
   */
  async saveProgram(programData: any): Promise<any> {
    console.log('=== SYS1000 ?�로그램 ?�보 ?�???�정 ===');
    console.log('?�체 ?�???�이??', JSON.stringify(programData, null, 2));

    const { isNew, lnggMsg, ...program } = programData;

    // ?�업 ?�기 관???�이???�세 로깅
    console.log('=== ?�업 ?�기 ?�이???�인 ===');
    console.log('pgmWdth (?�본):', program.pgmWdth, '?�??', typeof program.pgmWdth);
    console.log('pgmHght (?�본):', program.pgmHght, '?�??', typeof program.pgmHght);
    
    // �?문자?�을 null�?변??
    const pgmWdth = (program.pgmWdth === '' || program.pgmWdth === null || program.pgmWdth === undefined) ? null : program.pgmWdth;
    const pgmHght = (program.pgmHght === '' || program.pgmHght === null || program.pgmHght === undefined) ? null : program.pgmHght;
    
    console.log('pgmWdth (처리??:', pgmWdth);
    console.log('pgmHght (처리??:', pgmHght);

    try {
      // 메인 ?�로그램 ?�보 ?�???�정
      if (isNew) {
        // ?�규 ?�록
        const insertQuery = `
          INSERT INTO STSYS1001M (
            SYS_CD, PGM_ID, PGM_NM, SCRN_DVCD, BIZ_DVCD, SRT_SEQ, USE_YN,
            HGRK_PGM_ID, LINK_PATH_NM, PGM_HGHT, PGM_WDTH, PGM_PSN_TOP, PGM_PSN_LT,
            POUP_MONI, TGT_MDI_DVCD, SZ_UPD_USE_YN,
            REG_DTM, REG_USER_ID, UPD_DTM, UPD_USER_ID
          ) VALUES (
            :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16,
            SYSDATE, :17, SYSDATE, :18
          )
        `;

        const insertParams = [
          'BIST',                    // SYS_CD
          program.pgmId,             // PGM_ID
          program.pgmNm,             // PGM_NM
          program.scrnDvcd,          // SCRN_DVCD
          program.bsnType,           // BIZ_DVCD
          program.srtSeq || null,    // SRT_SEQ
          program.useYn,             // USE_YN
          program.hgrkPgmId || null, // HGRK_PGM_ID
          program.linkPathNm,        // LINK_PATH_NM
          pgmHght,                   // PGM_HGHT (?�정??변???�용)
          pgmWdth,                   // PGM_WDTH (?�정??변???�용)
          program.pgmPsnTop,         // PGM_PSN_TOP
          program.pgmPsnLt,          // PGM_PSN_LT
          program.poupMoni,          // POUP_MONI
          program.tgtMdiDvcd,        // TGT_MDI_DVCD
          program.szUpdUseYn,        // SZ_UPD_USE_YN
          'SYSTEM',                  // REG_USER_ID
          'SYSTEM'                   // UPD_USER_ID
        ];

        console.log('?�규 ?�록 쿼리:', insertQuery);
        console.log('?�규 ?�록 ?�라미터:', insertParams);
        console.log('PGM_WDTH ?�라미터 ?�치:', insertParams[10]);
        console.log('PGM_HGHT ?�라미터 ?�치:', insertParams[9]);

        await this.dataSource.query(insertQuery, insertParams);
      } else {
        // ?�정
        const updateQuery = `
          UPDATE STSYS1001M
             SET PGM_NM = :1
               , SCRN_DVCD = :2
               , BIZ_DVCD = :3
               , SRT_SEQ = :4
               , USE_YN = :5
               , HGRK_PGM_ID = :6
               , LINK_PATH_NM = :7
               , PGM_HGHT = :8
               , PGM_WDTH = :9
               , PGM_PSN_TOP = :10
               , PGM_PSN_LT = :11
               , POUP_MONI = :12
               , TGT_MDI_DVCD = :13
               , SZ_UPD_USE_YN = :14
               , UPD_DTM = SYSDATE
               , UPD_USER_ID = :15
           WHERE SYS_CD = :16
             AND PGM_ID = :17
        `;

        const updateParams = [
          program.pgmNm,             // PGM_NM
          program.scrnDvcd,          // SCRN_DVCD
          program.bsnType,           // BIZ_DVCD
          program.srtSeq || null,    // SRT_SEQ
          program.useYn,             // USE_YN
          program.hgrkPgmId || null, // HGRK_PGM_ID
          program.linkPathNm,        // LINK_PATH_NM
          pgmHght,                   // PGM_HGHT (?�정??변???�용)
          pgmWdth,                   // PGM_WDTH (?�정??변???�용)
          program.pgmPsnTop,         // PGM_PSN_TOP
          program.pgmPsnLt,          // PGM_PSN_LT
          program.poupMoni,          // POUP_MONI
          program.tgtMdiDvcd,        // TGT_MDI_DVCD
          program.szUpdUseYn,        // SZ_UPD_USE_YN
          'SYSTEM',                  // UPD_USER_ID
          'BIST',                    // SYS_CD
          program.pgmId              // PGM_ID
        ];

        console.log('?�정 쿼리:', updateQuery);
        console.log('?�정 ?�라미터:', updateParams);
        console.log('PGM_WDTH ?�라미터 ?�치:', updateParams[8]);
        console.log('PGM_HGHT ?�라미터 ?�치:', updateParams[7]);

        await this.dataSource.query(updateQuery, updateParams);
      }

      // ?�국???�보 ?�???�정
      if (lnggMsg && lnggMsg.length > 0) {
        for (const langData of lnggMsg) {
          const langQuery = `
            MERGE INTO STSYS1016D
            USING DUAL
               ON (SYS_CD = :1 AND PGM_ID = :2 AND LNGG_CD = :3)
             WHEN MATCHED THEN
                UPDATE SET PGM_NM = :4, UPD_DTM = SYSDATE, UPD_USER_ID = :5
             WHEN NOT MATCHED THEN
                INSERT (SYS_CD, PGM_ID, LNGG_CD, PGM_NM, REG_DTM, REG_USER_ID, UPD_DTM, UPD_USER_ID)
                VALUES (:6, :7, :8, :9, SYSDATE, :10, SYSDATE, :11)
          `;

          const langParams = [
            'BIST',              // SYS_CD (MATCHED)
            langData.pgmId,      // PGM_ID (MATCHED)
            langData.lnggCd,     // LNGG_CD (MATCHED)
            langData.pgmNm,      // PGM_NM (UPDATE)
            'SYSTEM',            // UPD_USER_ID (UPDATE)
            'BIST',              // SYS_CD (INSERT)
            langData.pgmId,      // PGM_ID (INSERT)
            langData.lnggCd,     // LNGG_CD (INSERT)
            langData.pgmNm,      // PGM_NM (INSERT)
            'SYSTEM',            // REG_USER_ID (INSERT)
            'SYSTEM'             // UPD_USER_ID (INSERT)
          ];

          console.log('?�국???�??쿼리:', langQuery);
          console.log('?�국???�???�라미터:', langParams);

          await this.dataSource.query(langQuery, langParams);
        }
      }

      console.log('?�로그램 ?�보 ?�???�료');
      return { success: true, message: '?�?�되?�습?�다.' };
    } catch (error) {
      console.error('?�로그램 ?�보 ?�???�류:', error);
      throw error;
    }
  }

  /**
   * ?�로그램 ID 중복 체크
   */
  async checkProgramIdExists(pgmId: string): Promise<boolean> {
    console.log('=== SYS1000 ?�로그램 ID 중복 체크 ===');
    console.log('?�로그램 ID:', pgmId);

    const query = `
      SELECT COUNT(*) AS CNT
        FROM STSYS1001M
       WHERE SYS_CD = :1
         AND PGM_ID = :2
    `;

    const params = ['BIST', pgmId];

    console.log('중복 체크 쿼리:', query);
    console.log('중복 체크 ?�라미터:', params);

    try {
      const result = await this.dataSource.query(query, params);
      const exists = result[0]?.CNT > 0;
      console.log('중복 체크 결과:', exists);
      return exists;
    } catch (error) {
      console.error('?�로그램 ID 중복 체크 ?�류:', error);
      throw error;
    }
  }

  // ===== SYS1012R00: 메뉴 미리보기 =====
  async getMenuPreview(menuId: string): Promise<any[]> {
    try {
      console.log('=== SYS1012R00 메뉴 미리보기 조회 ?�작 ===');
      console.log('메뉴 ID:', menuId);
      
      // 먼�? ?�당 메뉴 ID???�이?��? ?�는지 ?�인
      const checkSql = `
        SELECT COUNT(*) as CNT 
        FROM TBL_MENU_DTL 
        WHERE MENU_ID = :1 AND USE_YN = 'Y'
      `;
      
      const checkResult = await this.dataSource.query(checkSql, [menuId]);
      console.log('메뉴 ?�세 ?�이??개수:', checkResult[0]?.CNT);
      
      if (checkResult[0]?.CNT === 0) {
        console.log('?�당 메뉴 ID???�이?��? ?�습?�다.');
        return [];
      }
      
      // BIST_NEW DB ?�키마에 맞게 ?�정??쿼리
      const sql = `
        SELECT A.MENU_DSP_NM
             , A.PGM_ID AS PGM_ID
             , A.MENU_SHP_DVCD
             , A.HGRK_MENU_SEQ
             , A.MENU_SEQ
             , CONNECT_BY_ISLEAF AS FLAG
             , A.USE_YN AS MENU_USE_YN
             , LEVEL AS MENU_LVL
             , A.MENU_DSP_NM AS MAP_TITLE
          FROM (
            SELECT B.MENU_DSP_NM
                 , NVL(B.HGRK_MENU_SEQ,0)||'' AS HGRK_MENU_SEQ
                 , B.MENU_SEQ ||'' AS MENU_SEQ
                 , B.MENU_ID
                 , B.SORT_SEQ
                 , B.MENU_SHP_DVCD
                 , B.PGM_ID
                 , B.USE_YN
              FROM TBL_MENU_DTL B
             WHERE B.MENU_ID = :1
               AND B.USE_YN = 'Y'
          ) A
         START WITH A.HGRK_MENU_SEQ = 0
         CONNECT BY PRIOR A.MENU_SEQ = A.HGRK_MENU_SEQ
         ORDER SIBLINGS BY A.SORT_SEQ
      `;
      
      console.log('메뉴 미리보기 쿼리:', sql);
      console.log('메뉴 미리보기 ?�라미터:', [menuId]);
      
      const result = await this.dataSource.query(sql, [menuId]);
      console.log('메뉴 미리보기 조회 ?�료:', result.length + '�?);
      console.log('메뉴 미리보기 결과:', result);
      
      return result;
    } catch (error) {
      console.error('메뉴 미리보기 조회 ?�패:', error);
      throw error;
    }
  }

  // ===== SYS1010D00: ?�로그램 찾기 조회 =====
  async findProgramsForSearch(searchCondition: any): Promise<any[]> {
    try {
      console.log('=== SYS1010D00 ?�로그램 찾기 조회 ?�작 ===');
      console.log('검??조건:', searchCondition);
      
      let sql = `
        SELECT 
          PGM.PGM_ID,
          PGM.PGM_NM,
          PGM.PGM_DIV_CD,
          PGM.BIZ_DIV_CD,
          PGM.USE_YN,
          PGM.SORT_SEQ,
          NVL(CSF.SML_CSF_NM, PGM.PGM_DIV_CD) AS PGM_DIV_NM
        FROM TBL_PGM_INF PGM
        LEFT JOIN TBL_SML_CSF_CD CSF ON CSF.LRG_CSF_CD = '305' AND CSF.SML_CSF_CD = PGM.PGM_DIV_CD
        WHERE PGM.USE_YN = 'Y'
      `;
      
      const params: any[] = [];
      let paramIndex = 1;
      
      // ?�로그램 ID/�?검??
      if (searchCondition.PGM_KWD && searchCondition.PGM_KWD.trim() !== '') {
        sql += ` AND (PGM.PGM_ID LIKE :${paramIndex} OR PGM.PGM_NM LIKE :${paramIndex + 1})`;
        params.push(`%${searchCondition.PGM_KWD}%`, `%${searchCondition.PGM_KWD}%`);
        paramIndex += 2;
      }
      
      // ?�로그램 구분 검??
      if (searchCondition.PGM_DIV_CD && searchCondition.PGM_DIV_CD.trim() !== '') {
        sql += ` AND PGM.PGM_DIV_CD = :${paramIndex}`;
        params.push(searchCondition.PGM_DIV_CD);
        paramIndex += 1;
      }
      
      // ?�무 구분 검??
      if (searchCondition.BIZ_DIV_CD && searchCondition.BIZ_DIV_CD.trim() !== '') {
        sql += ` AND PGM.BIZ_DIV_CD = :${paramIndex}`;
        params.push(searchCondition.BIZ_DIV_CD);
        paramIndex += 1;
      }
      
      // ?�로그램 그룹???��? ?�록???�로그램 ?�외
      if (searchCondition.PGM_GRP_ID && searchCondition.PGM_GRP_ID.trim() !== '') {
        sql += ` AND PGM.PGM_ID NOT IN (
          SELECT PGM_ID FROM TBL_PGM_GRP_PGM 
          WHERE PGM_GRP_ID = :${paramIndex}
        )`;
        params.push(searchCondition.PGM_GRP_ID);
        paramIndex += 1;
      }
      
      sql += ` ORDER BY PGM.SORT_SEQ ASC, PGM.PGM_ID ASC`;
      
      console.log('?�로그램 찾기 쿼리:', sql);
      console.log('?�로그램 찾기 ?�라미터:', params);
      
      const result = await this.dataSource.query(sql, params);
      console.log('?�로그램 찾기 조회 ?�료:', result.length + '�?);
      console.log('?�로그램 찾기 결과:', result);
      
      return result;
    } catch (error) {
      console.error('?�로그램 찾기 조회 ?�패:', error);
      throw error;
    }
  }
}


