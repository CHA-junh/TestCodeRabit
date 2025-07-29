/**
 * USR2010M00Service - ?¬ìš©??ê´€ë¦??œë¹„??
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ìš©??ëª©ë¡ ì¡°íšŒ ë°?ê²€??
 * - ?¬ìš©???•ë³´ ?€??(? ê·œ/?˜ì •)
 * - ?¬ìš©???…ë¬´ê¶Œí•œ ê´€ë¦?
 * - ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
 * - ?¹ì¸ê²°ì¬??ê²€??
 * - ?¬ìš©????•  ê´€ë¦?
 *
 * ?°ê? ?Œì´ë¸?
 * - TBL_EMP_INF: ì§ì› ?•ë³´ (?¬ìš©??ê¸°ë³¸ ?•ë³´)
 * - TBL_USER_INF: ?¬ìš©???•ë³´ (ê¶Œí•œ, ?¹ì¸ê²°ì¬????
 * - TBL_WRKBY_USE_AUTH: ?…ë¬´ë³??¬ìš©ê¶Œí•œ
 * - TBL_USER_ROLE: ?¬ìš©????• 
 * - TBL_SML_CSF_CD: ?Œë¶„ë¥˜ì½”??(ë³¸ë?, ë¶€?? ê¶Œí•œ, ì§ì±… ??
 *
 * ?°ê? ?„ë¡œ?œì?:
 * - USR_01_0201_S: ?¬ìš©??ëª©ë¡ ì¡°íšŒ (TypeORM ì¿¼ë¦¬ë¡??€ì²?
 * - USR_01_0202_S: ?…ë¬´ë³??¬ìš©ê¶Œí•œ ëª©ë¡ ì¡°íšŒ
 * - USR_01_0204_T: ?¬ìš©???•ë³´ ?€??(? ê·œ/?˜ì •)
 * - USR_01_0104_T: ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
 *
 * ?¬ìš© ?”ë©´:
 * - USR2010M00: ?¬ìš©??ê´€ë¦??”ë©´
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as oracledb from 'oracledb';
import * as crypto from 'crypto';
import { User } from '../entities/user.entity';
import { TblEmpInf } from '../entities/tbl-emp-inf.entity';
import { TblWrkbyUseAuth } from '../entities/tbl-wrkby-use-auth.entity';
import { TblUserRole } from '../entities/tbl-user-role.entity';
import { TblSmlCsfCd } from '../entities/tbl-sml-csf-cd.entity';
import { CodeService } from '../com/code.service';
import { OracleService } from '../database/database.provider';

/**
 * ?¬ìš©???°ì´???¸í„°?˜ì´??
 *
 * @description
 * ?¬ìš©??ëª©ë¡ ì¡°íšŒ ??ë°˜í™˜?˜ëŠ” ?¬ìš©???•ë³´ êµ¬ì¡°
 */
export interface UserData {
  empNo: string; // ?¬ì›ë²ˆí˜¸
  ownOutsDiv: string; // ?ì‚¬?¸ì£¼êµ¬ë¶„
  entrNo: string; // ?…ì²´ë²ˆí˜¸
  empNm: string; // ?¬ì›?±ëª…
  entrDt: string; // ?…ì‚¬?¼ì
  retirDt: string; // ?´ì‚¬?¼ì
  hqDivCd: string; // ë³¸ë?êµ¬ë¶„ì½”ë“œ
  hqDivNm: string; // ë³¸ë?ëª?
  deptDivCd: string; // ë¶€?œêµ¬ë¶„ì½”??
  deptDivNm: string; // ë¶€?œëª…
  dutyCd: string; // ì§ì±…ì½”ë“œ
  dutyNm: string; // ì§ì±…ëª?
  wmailYn: string; // ?¹ë©”?¼ë“±ë¡ì—¬ë¶€
  authCd: string; // ê¶Œí•œì½”ë“œ
  authCdNm: string; // ê¶Œí•œëª?
  dutyDivCd: string; // ì§ì±…êµ¬ë¶„ì½”ë“œ
  dutyDivCdNm: string; // ì§ì±…êµ¬ë¶„ëª?
  apvApofId: string; // ?¹ì¸ê²°ì¬?ID
  apvApofNm: string; // ?¹ì¸ê²°ì¬?ëª…
  wrkCnt: string; // ?¬ìš©ê¶Œí•œ?…ë¬´ê°?ˆ˜
  lastWrk: string; // ìµœì¢…?±ë¡?œì—…ë¬?
  bsnUseYn: string; // ?¬ì—…/?„ë¡œ?íŠ¸ ?¬ìš©? ë¬´
  wpcUseYn: string; // ?…ë¬´ì¶”ì§„ë¹??¬ìš©? ë¬´
  psmUseYn: string; // ?¸ì‚¬/ë³µë¦¬ ?¬ìš©? ë¬´
  emailAddr: string; // ?´ë©”?¼ì£¼??
  usrRoleId: string; // ?¬ìš©?ì—­? ID
  usrRoleNm: string; // ?¬ìš©?ì—­? ëª…
}

/**
 * ?…ë¬´ê¶Œí•œ ?°ì´???¸í„°?˜ì´??
 *
 * @description
 * ?¬ìš©?ë³„ ?…ë¬´ê¶Œí•œ ?•ë³´ êµ¬ì¡°
 */
export interface WorkAuthData {
  smlCsfCd: string; // ?…ë¬´êµ¬ë¶„ì½”ë“œ
  smlCsfNm: string; // ?…ë¬´êµ¬ë¶„ëª?
  wrkUseYn: string; // ?¬ìš©ê¶Œí•œ?¬ë?
  rmk?: string; // ë¹„ê³ 
  regDttm?: string; // ?±ë¡?¼ì‹œ
  chngrId?: string; // ë³€ê²½ìID
}

/**
 * ?¬ìš©???€???°ì´???¸í„°?˜ì´??
 *
 * @description
 * ?¬ìš©???•ë³´ ?€?????¬ìš©?˜ëŠ” ?°ì´??êµ¬ì¡°
 */
export interface UserSaveData {
  empNo: string;
  empNm: string;
  hqDivCd: string;
  deptDivCd: string;
  dutyCd: string;
  dutyDivCd: string;
  authCd: string;
  apvApofId: string;
  emailAddr: string;
  workAuthList: WorkAuthData[];
  regUserId: string;
  usrRoleId?: string; // ?¬ìš©?ì—­? ID (? íƒ?? ê¸°ë³¸ê°? 'A250715001')
}

@Injectable()
export class UsrService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TblEmpInf)
    private readonly empRepository: Repository<TblEmpInf>,
    @InjectRepository(TblWrkbyUseAuth)
    private readonly workAuthRepository: Repository<TblWrkbyUseAuth>,
    @InjectRepository(TblUserRole)
    private readonly userRoleRepository: Repository<TblUserRole>,
    @InjectRepository(TblSmlCsfCd)
    private readonly smlCsfCdRepository: Repository<TblSmlCsfCd>,
    private readonly codeService: CodeService,
    private readonly oracle: OracleService,
  ) {}

  /**
   * ?¬ìš©??ëª©ë¡ ì¡°íšŒ (TypeORM ì¿¼ë¦¬ë¡?ë³€ê²?
   *
   * @description
   * ê¸°ì¡´ USR_01_0201_S ?„ë¡œ?œì?ë¥?TypeORM ì¿¼ë¦¬ë¡??€ì²´í•œ ?´ìœ :
   * 1. ?„ë¡œ?œì? ?˜ì¡´???œê±°ë¡?? ì?ë³´ìˆ˜???¥ìƒ
   * 2. TypeORM???€???ˆì „?±ê³¼ ì¿¼ë¦¬ ë¹Œë” ?œìš©
   * 3. ?¬ìš©?ì—­??USR_ROLE_ID) ?•ë³´ ì¶”ê?ë¡??ˆë¡œ???”êµ¬?¬í•­ ë°˜ì˜
   * 4. ?ŒìŠ¤???©ì´??ë°??”ë²„ê¹??¸ì˜??ì¦ë?
   * 5. ë§ˆì´?¬ë¡œ?œë¹„???„í‚¤?ì²˜???í•©??êµ¬ì¡°ë¡??„í™˜
   *
   * ì¡°íšŒ ì¡°ê±´:
   * - ë³¸ë?êµ¬ë¶„ì½”ë“œ (hqDiv)
   * - ë¶€?œêµ¬ë¶„ì½”??(deptDiv)
   * - ?¬ìš©?ëª… (userNm, ë¶€ë¶?ê²€??
   *
   * @param hqDiv - ë³¸ë?êµ¬ë¶„ì½”ë“œ (ALL=?„ì²´)
   * @param deptDiv - ë¶€?œêµ¬ë¶„ì½”??(ALL=?„ì²´)
   * @param userNm - ?¬ìš©?ëª… (ë¶€ë¶?ê²€??
   * @returns Promise<UserData[]> - ?¬ìš©??ëª©ë¡
   * @example
   * const users = await usrService.getUserList('1000', '1100', '?ê¸¸??);
   * // ê²°ê³¼: [{ empNo: "E001", empNm: "?ê¸¸??, hqDivNm: "?”ì??¸ì˜?…ë³¸ë¶€" }]
   *
   * @throws Error - DB ì¡°íšŒ ?¤íŒ¨ ??
   */
  async getUserList(
    hqDiv?: string,
    deptDiv?: string,
    userNm?: string,
  ): Promise<UserData[]> {
    try {
      console.log('?¡ï¸ Executing raw SQL query for user list...');
      console.log('?” Query params:', { hqDiv, deptDiv, userNm });

      // ?™ì  WHERE ì¡°ê±´ êµ¬ì„±
      let whereConditions: string[] = [];
      let queryParams: any = {};

      // ?„ë¡œ?œì? ë¡œì§??ë§ê²Œ WHERE ì¡°ê±´ êµ¬ì„± (ëª¨ë“  ì¡°ê±´???™ì‹œ???ìš©)
      if (hqDiv && hqDiv.trim() && hqDiv !== 'ALL') {
        whereConditions.push('A.HQ_DIV_CD = :hqDiv');
        queryParams['hqDiv'] = hqDiv;
      }

      if (deptDiv && deptDiv.trim() && deptDiv !== 'ALL') {
        whereConditions.push('A.DEPT_DIV_CD = :deptDiv');
        queryParams['deptDiv'] = deptDiv;
      }

      if (userNm && userNm.trim()) {
        whereConditions.push('A.EMP_NM LIKE :userNm');
        queryParams['userNm'] = `%${userNm}%`;
      }

      console.log('?” Where conditions:', whereConditions);
      console.log('?” Query parameters object:', queryParams);

      // ë³µì¡??JOIN ì¿¼ë¦¬ë¡??¬ìš©???•ë³´?€ ê¶Œí•œ ?•ë³´ë¥??¨ê»˜ ì¡°íšŒ
      const query = `
        SELECT 
          A.EMP_NO as "empNo",
          A.OWN_OUTS_DIV as "ownOutsDiv",
          A.ENTR_NO as "entrNo",
          A.EMP_NM as "empNm",
          A.ENTR_DT as "entrDt",
          A.RETIR_DT as "retirDt",
          A.HQ_DIV_CD as "hqDivCd",
          A.DEPT_DIV_CD as "deptDivCd",
          A.DUTY_CD as "dutyCd",
          A.EMAIL_ADDR as "emailAddr",
          HQ.SML_CSF_NM as "hqDivNm",
          DEPT.SML_CSF_NM as "deptDivNm",
          DUTY.SML_CSF_NM as "dutyNm",
          DECODE(A.EMP_NO, NULL, 'N', 'Y') as "wmailYn",
          C.AUTH_CD as "authCd",
          AUTH.SML_CSF_NM as "authCdNm",
          C.DUTY_DIV_CD as "dutyDivCd",
          DUTY_DIV.SML_CSF_NM as "dutyDivCdNm",
          C.APV_APOF_ID as "apvApofId",
          D.EMP_NM as "apvApofNm",
          C.WRK_CNT as "wrkCnt",
          C.LAST_WRK as "lastWrk",
          DECODE(NVL(C.BSN_USE_YN,0)+NVL(C.PRJ_USE_YN,0),0,'0','1') as "bsnUseYn",
          DECODE(NVL(C.WPC_USE_YN,0),0,'0','1') as "wpcUseYn",
          DECODE(NVL(C.PSM_USE_YN,0),0,'0','1') as "psmUseYn",
          C.USR_ROLE_ID as "usrRoleId",
          UR.USR_ROLE_NM as "usrRoleNm"
        FROM TBL_EMP_INF A
        LEFT JOIN (
          SELECT 
            C1.USER_ID,
            C1.USER_NM,
            C1.DEPT_CD,
            C1.DUTY_CD,
            C1.DUTY_DIV_CD,
            C1.AUTH_CD,
            C1.WRK01_USE_YN,
            C1.WRK02_USE_YN,
            C1.APV_APOF_ID,
            C1.USR_ROLE_ID,
            SUM(DECODE(C2.USER_ID,NULL,0,1)) AS WRK_CNT,
            SUBSTR(MAX(NVL(REG_DTTM,'00000000000000') || NVL(WRK_DIV,'**')),15,2) AS LAST_WRK,
            SUM(DECODE(C2.WRK_DIV,'01',1,0)) AS BSN_USE_YN,
            SUM(DECODE(C2.WRK_DIV,'03',1,0)) AS PRJ_USE_YN,
            SUM(DECODE(C2.WRK_DIV,'02',1,0)) AS WPC_USE_YN,
            SUM(DECODE(C2.WRK_DIV,'05',1,'06',1,0)) AS PSM_USE_YN,
            SUM(DECODE(C2.WRK_DIV,'04',1,0)) AS SYS_USE_YN
          FROM TBL_USER_INF C1
          LEFT JOIN TBL_WRKBY_USE_AUTH C2 ON C1.USER_ID = C2.USER_ID
          GROUP BY 
            C1.USER_ID,
            C1.USER_NM,
            C1.DEPT_CD,
            C1.DUTY_CD,
            C1.DUTY_DIV_CD,
            C1.AUTH_CD,
            C1.WRK01_USE_YN,
            C1.WRK02_USE_YN,
            C1.APV_APOF_ID,
            C1.USR_ROLE_ID
        ) C ON A.EMP_NO = C.USER_ID
        LEFT JOIN TBL_EMP_INF D ON C.APV_APOF_ID = D.EMP_NO
        LEFT JOIN TBL_USER_ROLE UR ON C.USR_ROLE_ID = UR.USR_ROLE_ID
        LEFT JOIN TBL_SML_CSF_CD HQ ON HQ.LRG_CSF_CD = '113' AND HQ.SML_CSF_CD = A.HQ_DIV_CD
        LEFT JOIN TBL_SML_CSF_CD DEPT ON DEPT.LRG_CSF_CD = '112' AND DEPT.SML_CSF_CD = A.DEPT_DIV_CD
        LEFT JOIN TBL_SML_CSF_CD DUTY ON DUTY.LRG_CSF_CD = '116' AND DUTY.SML_CSF_CD = A.DUTY_CD
        LEFT JOIN TBL_SML_CSF_CD AUTH ON AUTH.LRG_CSF_CD = '101' AND AUTH.SML_CSF_CD = C.AUTH_CD
        LEFT JOIN TBL_SML_CSF_CD DUTY_DIV ON DUTY_DIV.LRG_CSF_CD = '114' AND DUTY_DIV.SML_CSF_CD = C.DUTY_DIV_CD
        WHERE A.OWN_OUTS_DIV = '1'
        AND A.ENTR_NO = '000000'
        AND (A.RETIR_DT IS NULL OR A.RETIR_DT >= TO_CHAR(SYSDATE,'YYYYMMDD'))
        ${whereConditions.length > 0 ? 'AND ' + whereConditions.join(' AND ') : ''}
        ORDER BY A.DUTY_CD, A.EMP_NM
      `;

      console.log('?” Final SQL Query:', query);
      console.log('?” Query Parameters:', queryParams);

      const result = await this.empRepository.query(
        query,
        Object.values(queryParams),
      );
      console.log('??Raw query result count:', result.length);

      // ê²°ê³¼ë¥?UserData ?¸í„°?˜ì´?¤ì— ë§ê²Œ ë³€??
      const userDataList: UserData[] = result.map((row: any) => ({
        empNo: row.empNo || '',
        ownOutsDiv: row.ownOutsDiv || '',
        entrNo: row.entrNo || '',
        empNm: row.empNm || '',
        entrDt: row.entrDt || '',
        retirDt: row.retirDt || '',
        hqDivCd: row.hqDivCd || '',
        hqDivNm: row.hqDivNm || '',
        deptDivCd: row.deptDivCd || '',
        deptDivNm: row.deptDivNm || '',
        dutyCd: row.dutyCd || '',
        dutyNm: row.dutyNm || '',
        wmailYn: row.wmailYn || '',
        authCd: row.authCd || '',
        authCdNm: row.authCdNm || '',
        dutyDivCd: row.dutyDivCd || '',
        dutyDivCdNm: row.dutyDivCdNm || '',
        apvApofId: row.apvApofId || '',
        apvApofNm: row.apvApofNm || '',
        wrkCnt: row.wrkCnt || '0',
        lastWrk: row.lastWrk || '',
        bsnUseYn: row.bsnUseYn || '',
        wpcUseYn: row.wpcUseYn || '',
        psmUseYn: row.psmUseYn || '',
        emailAddr: row.emailAddr || '',
        usrRoleId: row.usrRoleId || '',
        usrRoleNm: row.usrRoleNm || '',
      }));

      console.log('??Transformed user data count:', userDataList.length);
      return userDataList;
    } catch (error) {
      console.error('??Error in getUserList:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `?¬ìš©??ëª©ë¡ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ${errorMessage}`,
      );
    }
  }

  /**
   * ?¬ìš©???…ë¬´ê¶Œí•œ ëª©ë¡ ì¡°íšŒ
   *
   * @description
   * - USR_01_0202_S ?„ë¡œ?œì?ë¥??¸ì¶œ?˜ì—¬ ?¹ì • ?¬ìš©?ì˜ ?…ë¬´ê¶Œí•œ ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - ?…ë¬´êµ¬ë¶„ì½”ë“œ, ?…ë¬´êµ¬ë¶„ëª? ?¬ìš©ê¶Œí•œ?¬ë? ?±ì„ ë°˜í™˜?©ë‹ˆ??
   * - ìµœë? 100ê°œê¹Œì§€ ì¡°íšŒ ê°€?¥í•©?ˆë‹¤.
   *
   * @param userId - ?¬ìš©??ID (?¬ë²ˆ)
   * @returns Promise<WorkAuthData[]> - ?…ë¬´ê¶Œí•œ ëª©ë¡
   * @example
   * const workAuths = await usrService.getWorkAuthList('E001');
   * // ê²°ê³¼: [{ smlCsfCd: "01", smlCsfNm: "?¬ì—…ê´€ë¦?, wrkUseYn: "1" }]
   *
   * @throws Error - ?„ë¡œ?œì? ?¸ì¶œ ?¤íŒ¨ ??
   */
  async getWorkAuthList(userId: string): Promise<WorkAuthData[]> {
    try {
      console.log('?” ?¬ìš©???…ë¬´ê¶Œí•œ ì¡°íšŒ ?œì‘:', userId);

      // Oracle ?„ë¡œ?œì? ?¸ì¶œ???„í•œ ì»¤ë„¥??
      const conn = await this.oracle.getConnection();

      try {
        // USR_01_0202_S ?„ë¡œ?œì? ?¸ì¶œ
        const result = (await conn.execute(
          `
          BEGIN
            USR_01_0202_S(
              :cursor,           -- OUT: ê²°ê³¼ ì»¤ì„œ
              :I_USER_ID         -- IN: ?¬ìš©?ID
            );
          END;
          `,
          {
            cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            I_USER_ID: userId,
          },
          {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
          },
        )) as { outBinds: { cursor: oracledb.ResultSet<any> } };

        // ê²°ê³¼ ì»¤ì„œ?ì„œ ?°ì´??ì¶”ì¶œ
        const rs = result.outBinds.cursor;
        const rows = await rs.getRows(100); // ìµœë? 100ê°œê¹Œì§€ ì¡°íšŒ
        await rs.close();

        console.log('???…ë¬´ê¶Œí•œ ì¡°íšŒ ê²°ê³¼:', rows.length + 'ê±?);

        return rows.map((row: any) => ({
          smlCsfCd: row.SML_CSF_CD || '',
          smlCsfNm: row.SML_CSF_NM || '',
          wrkUseYn: row.WRK_USE_YN || '0',
          rmk: row.RMK || '',
          regDttm: row.REG_DTTM || '',
          chngrId: row.CHNGR_ID || '',
        }));
      } finally {
        // ?°ì´?°ë² ?´ìŠ¤ ?°ê²° ?´ì œ
        await conn.close();
      }
    } catch (error) {
      console.error('???…ë¬´ê¶Œí•œ ì¡°íšŒ ?¤ë¥˜:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`?…ë¬´ê¶Œí•œ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ${errorMessage}`);
    }
  }

  /**
   * ?¬ìš©???•ë³´ ?€??(? ê·œ/?˜ì •)
   *
   * @description
   * ê¸°ì¡´ USR_01_0203_T ?„ë¡œ?œì??ì„œ ?¬ìš©?ì—­??ê´€ë¦¬ê? ì¶”ê???USR_01_0204_T ?„ë¡œ?œì?ë¡?ë³€ê²?
   *
   * ?„ë¡œ?œì? ?Œë¼ë¯¸í„°:
   * - I_USER_ID: ?¬ìš©?ID
   * - I_USER_NM: ?¬ìš©?ì´ë¦?
   * - I_HQ_DIV_CD: ë³¸ë?êµ¬ë¶„ì½”ë“œ
   * - I_DEPT_DIV_CD: ë¶€?œêµ¬ë¶„ì½”??
   * - I_DUTY_CD: ì§ì±…ì½”ë“œ
   * - I_DUTY_DIV_CD: ì§ì±…êµ¬ë¶„ì½”ë“œ (?€ë¶„ë¥˜ì½”ë“œ:114)
   * - I_AUTH_CD: ê¶Œí•œì½”ë“œ
   * - I_APV_APOF_ID: ?¹ì¸ ê²°ì¬??ID
   * - I_EMAIL_ADDR: ?´ë©”?¼ì£¼??
   * - I_WORK_USE_AUTH: ?¬ìš©ê¶Œí•œ ë¶€?¬ë°›?€ ?…ë¬´ì½”ë“œ (?Œì´??|)ë¡?êµ¬ë¶„)
   * - I_REG_USER_ID: ?±ë¡?¬ìš©?ID (?„ì¬ ?¸ì…˜??ë¡œê·¸???¬ìš©??
   * - I_USR_ROLE_ID: ?¬ìš©?ì—­? ID (ê¸°ë³¸ê°? ?¼ë°˜?¬ìš©??'A250715001')
   *
   * @param userData - ?€?¥í•  ?¬ìš©???•ë³´
   * @param currentUserId - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©??ID (?¸ì…˜?ì„œ ?„ë‹¬)
   * @returns Promise<string> - ?€??ê²°ê³¼ ë©”ì‹œì§€
   * @example
   * const result = await usrService.saveUser({
   *   empNo: "E001",
   *   empNm: "?ê¸¸??,
   *   hqDivCd: "1000",
   *   deptDivCd: "1100",
   *   workAuthList: [{ smlCsfCd: "01", wrkUseYn: "1" }]
   * }, "E001");
   *
   * @throws Error - ?„ë¡œ?œì? ?¸ì¶œ ?¤íŒ¨ ??
   */
  async saveUser(
    userData: UserSaveData,
    currentUserId: string,
  ): Promise<string> {
    try {
      console.log('?’¾ ?¬ìš©???•ë³´ ?€???œì‘:', userData);

      // Oracle ?„ë¡œ?œì? ?¸ì¶œ???„í•œ ì»¤ë„¥??
      const conn = await this.oracle.getConnection();

      try {
        // ?€?????„ì¬ ?¬ìš©???•ë³´ ì¡°íšŒ
        console.log('?” ?€?????¬ìš©???•ë³´ ì¡°íšŒ...');
        const currentUser = await this.getUserList(
          'ALL',
          'ALL',
          userData.empNm,
        );
        if (currentUser.length > 0) {
          const user = currentUser.find((u) => u.empNo === userData.empNo);
          if (user) {
            console.log('?” ?€?????¬ìš©???•ë³´:', {
              empNo: user.empNo,
              usrRoleId: user.usrRoleId,
              usrRoleNm: user.usrRoleNm,
            });
          }
        }

        // ?…ë¬´ê¶Œí•œ ì½”ë“œ ë¬¸ì???ì„± (?Œì´??|)ë¡?êµ¬ë¶„, ë§?ë§ˆì?ë§‰ì—???Œì´??ì¶”ê?)
        const workAuthCodes = userData.workAuthList
          .filter((auth) => auth.wrkUseYn === '1' || auth.wrkUseYn === 'Y')
          .map((auth) => auth.smlCsfCd);

        const workAuthString =
          workAuthCodes.length > 0
            ? workAuthCodes.join('|') + '|' // ë§?ë§ˆì?ë§‰ì—???Œì´??ì¶”ê?
            : '';

        console.log('?” ?…ë¬´ê¶Œí•œ ì½”ë“œ:', workAuthString);

        // ?„ë¡œ?œì? ?¸ì¶œ ???Œë¼ë¯¸í„° ë¡œê·¸
        console.log('?” ?„ë¡œ?œì? ?Œë¼ë¯¸í„°:');
        console.log('  - I_USER_ID:', userData.empNo);
        console.log('  - I_USER_NM:', userData.empNm);
        console.log('  - I_HQ_DIV_CD:', userData.hqDivCd);
        console.log('  - I_DEPT_DIV_CD:', userData.deptDivCd);
        console.log('  - I_DUTY_CD:', userData.dutyCd);
        console.log('  - I_DUTY_DIV_CD:', userData.dutyDivCd);
        console.log('  - I_AUTH_CD:', userData.authCd);
        console.log('  - I_APV_APOF_ID:', userData.apvApofId);
        console.log('  - I_EMAIL_ADDR:', userData.emailAddr);
        console.log('  - I_WORK_USE_AUTH:', workAuthString);
        console.log('  - I_REG_USER_ID:', currentUserId);
        console.log('  - I_USR_ROLE_ID:', userData.usrRoleId || 'A250715001');

        // ?„ë¡œ?œì? ì¡´ì¬ ?¬ë? ?•ì¸ (???ì„¸???•ë³´)
        console.log('?” ?„ë¡œ?œì? ì¡´ì¬ ?¬ë? ?•ì¸...');

        // USR_01_0204_T ?„ë¡œ?œì? ?¸ì¶œ
        console.log('?” ?„ë¡œ?œì? ?¸ì¶œ ?œì‘...');
        const result = (await conn.execute(
          `
          BEGIN
            USR_01_0204_T(
              :O_RTN,              -- OUT: ê²°ê³¼ê°?(1: ?±ê³µ, ?ëŸ¬ë©”ì‹œì§€: ?¤íŒ¨)
              :I_USER_ID,          -- IN: ?¬ìš©?ID
              :I_USER_NM,          -- IN: ?¬ìš©?ì´ë¦?
              :I_HQ_DIV_CD,        -- IN: ë³¸ë?êµ¬ë¶„ì½”ë“œ
              :I_DEPT_DIV_CD,      -- IN: ë¶€?œêµ¬ë¶„ì½”??
              :I_DUTY_CD,          -- IN: ì§ì±…ì½”ë“œ
              :I_DUTY_DIV_CD,      -- IN: ì§ì±…êµ¬ë¶„ì½”ë“œ (?€ë¶„ë¥˜ì½”ë“œ:114)
              :I_AUTH_CD,          -- IN: ê¶Œí•œì½”ë“œ
              :I_APV_APOF_ID,      -- IN: ?¹ì¸ ê²°ì¬??ID
              :I_EMAIL_ADDR,       -- IN: ?´ë©”?¼ì£¼??
              :I_WORK_USE_AUTH,    -- IN: ?¬ìš©ê¶Œí•œ ë¶€?¬ë°›?€ ?…ë¬´ì½”ë“œ (?Œì´??|)ë¡?êµ¬ë¶„)
              :I_REG_USER_ID,      -- IN: ?±ë¡?¬ìš©?ID
              :I_USR_ROLE_ID       -- IN: ?¬ìš©?ì—­? ID
            );
          END;
          `,
          {
            O_RTN: {
              dir: oracledb.BIND_OUT,
              type: oracledb.STRING,
              maxSize: 4000,
            },
            I_USER_ID: userData.empNo,
            I_USER_NM: userData.empNm,
            I_HQ_DIV_CD: userData.hqDivCd,
            I_DEPT_DIV_CD: userData.deptDivCd,
            I_DUTY_CD: userData.dutyCd,
            I_DUTY_DIV_CD: userData.dutyDivCd,
            I_AUTH_CD: userData.authCd,
            I_APV_APOF_ID: userData.apvApofId,
            I_EMAIL_ADDR: userData.emailAddr,
            I_WORK_USE_AUTH: workAuthString,
            I_REG_USER_ID: currentUserId,
            I_USR_ROLE_ID: userData.usrRoleId || 'A250715001', // ê¸°ë³¸ê°? ?¼ë°˜?¬ìš©??
          },
        )) as { outBinds: { O_RTN: string } };

        console.log('?” ?„ë¡œ?œì? ?¸ì¶œ ?„ë£Œ');
        console.log('?” ?„ë¡œ?œì? ê²°ê³¼:', result);
        console.log('?” outBinds:', result.outBinds);

        const rtn = result.outBinds.O_RTN;
        console.log('?” ë°˜í™˜ê°?(O_RTN):', rtn);

        if (rtn === '1') {
          // ?„ë¡œ?œì? ?¸ì¶œ ?±ê³µ ??ì»¤ë°‹ ?˜í–‰
          console.log('?” ?¸ëœ??…˜ ì»¤ë°‹ ?œì‘...');
          await conn.commit();
          console.log('???¸ëœ??…˜ ì»¤ë°‹ ?„ë£Œ');

          console.log('???¬ìš©???•ë³´ ?€???„ë£Œ');

          // ?¤ì œ DB???€?¥ë˜?ˆëŠ”ì§€ ?•ì¸?˜ê¸° ?„í•´ ?¬ìš©???•ë³´ë¥??¤ì‹œ ì¡°íšŒ
          try {
            const savedUser = await this.getUserList(
              'ALL',
              'ALL',
              userData.empNm,
            );
            console.log('?” ?€?????¬ìš©??ì¡°íšŒ ê²°ê³¼:', savedUser);

            if (savedUser.length > 0) {
              const user = savedUser.find((u) => u.empNo === userData.empNo);
              if (user) {
                console.log('??DB???¤ì œë¡??€?¥ë¨ ?•ì¸:', {
                  empNo: user.empNo,
                  usrRoleId: user.usrRoleId,
                  usrRoleNm: user.usrRoleNm,
                });
              } else {
                console.warn('? ï¸ ?€?¥ëœ ?¬ìš©?ë? ì°¾ì„ ???†ìŒ');
              }
            }
          } catch (error) {
            console.error('???€?????¬ìš©??ì¡°íšŒ ?¤íŒ¨:', error);
          }

          return '?€?¥ë˜?ˆìŠµ?ˆë‹¤.';
        } else {
          // ?„ë¡œ?œì? ?¸ì¶œ ?¤íŒ¨ ??ë¡¤ë°± ?˜í–‰
          console.log('?” ?¸ëœ??…˜ ë¡¤ë°± ?œì‘...');
          await conn.rollback();
          console.log('???¸ëœ??…˜ ë¡¤ë°± ?„ë£Œ');

          console.error('???¬ìš©???•ë³´ ?€???¤íŒ¨:', rtn);
          throw new Error(`?€???¤íŒ¨: ${rtn}`);
        }
      } finally {
        // ?°ì´?°ë² ?´ìŠ¤ ?°ê²° ?´ì œ
        await conn.close();
      }
    } catch (error) {
      console.error('???¬ìš©???•ë³´ ?€???¤ë¥˜:', error);
      console.error('???¤ë¥˜ ?ì„¸ ?•ë³´:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        code: (error as any).code,
        errno: (error as any).errno,
      });
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `?¬ìš©???•ë³´ ?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ${errorMessage}`,
      );
    }
  }

  /**
   * ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??
   *
   * @description
   * - ?¬ìš©?ì˜ ë¹„ë?ë²ˆí˜¸ë¥??¬ìš©?IDë¡?ì´ˆê¸°?”í•©?ˆë‹¤ (ê¸°ì¡´ Flex ë°©ì‹ê³??™ì¼).
   * - SH1512 ?´ì‹œë¥??¬ìš©?˜ì—¬ ë¹„ë?ë²ˆí˜¸ë¥??”í˜¸?”í•©?ˆë‹¤.
   * - ë¹„ë?ë²ˆí˜¸ ë³€ê²½ì¼?œë? ?„ì¬ ?œê°„?¼ë¡œ ?¤ì •?©ë‹ˆ??
   *
   * ê¸°ì¡´ Flex ?„ë¡œ?œì?:
   * - USR_01_0104_T: ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°???„ë¡œ?œì?
   * - ?Œë¼ë¯¸í„°: I_USER_ID (?¬ìš©?ID), O_RTN (ê²°ê³¼ê°?
   * - ?‘ë‹µ: 1=?±ê³µ, ?ëŸ¬ë©”ì‹œì§€=?¤íŒ¨
   * - ì´ˆê¸°??ë¹„ë?ë²ˆí˜¸: ?¬ìš©?ID (?¬ë²ˆ)
   *
   * @param userId - ?¬ìš©??ID (?¬ë²ˆ)
   * @returns Promise<string> - ì´ˆê¸°??ê²°ê³¼ ë©”ì‹œì§€
   * @example
   * const result = await usrService.initPassword('E001');
   * // ê²°ê³¼: "ë¹„ë?ë²ˆí˜¸ê°€ ì´ˆê¸°?”ë˜?ˆìŠµ?ˆë‹¤."
   *
   * @throws Error - ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°???¤íŒ¨ ??
   */
  async initPassword(userId: string): Promise<string> {
    try {
      console.log('?”‘ ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°???œì‘:', userId);

      // ê¸°ì¡´ Flex ë°©ì‹ê³??™ì¼?˜ê²Œ ?¬ìš©?IDë¥?ë¹„ë?ë²ˆí˜¸ë¡??¤ì •
      // TO-BE SHE512 ?”í˜¸???ìš©??
      const defaultPassword = userId; // ?¬ìš©?ID (?¬ë²ˆ)ë¥?ë¹„ë?ë²ˆí˜¸ë¡??¬ìš©
      const hashedPassword = crypto
        .createHash('sha512')
        .update(defaultPassword)
        .digest('hex');

      // ?„ì¬ ?œê°„??14?ë¦¬ ë¬¸ì?´ë¡œ ë³€??(YYYYMMDDHHMMSS)
      const now = new Date();
      const pwdChngDttm =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');

      console.log('?” ë¹„ë?ë²ˆí˜¸ ë³€ê²½ì¼??(14?ë¦¬):', pwdChngDttm);
      console.log('?” ì´ˆê¸°??ë¹„ë?ë²ˆí˜¸:', defaultPassword);

      // ?¬ìš©???Œì´ë¸”ì— ë¹„ë?ë²ˆí˜¸ ?…ë°?´íŠ¸
      await this.userRepository.update(
        { userId: userId },
        {
          userPwd: hashedPassword,
          pwdChngDttm: pwdChngDttm,
        },
      );

      console.log('??ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°???„ë£Œ');
      return 'ë¹„ë?ë²ˆí˜¸ê°€ ì´ˆê¸°?”ë˜?ˆìŠµ?ˆë‹¤.';
    } catch (error) {
      console.error('??ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°???¤ë¥˜:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ${errorMessage}`,
      );
    }
  }

  /**
   * ?¹ì¸ê²°ì¬??ê²€??
   *
   * @description
   * - USR_01_0201_S ?„ë¡œ?œì?ë¥??¸ì¶œ?˜ì—¬ ?¹ì¸ê²°ì¬?ë? ê²€?‰í•©?ˆë‹¤.
   * - ?¬ìš©?ëª…?¼ë¡œ ë¶€ë¶?ê²€?‰ì´ ê°€?¥í•©?ˆë‹¤.
   * - ìµœë? 100ê°œê¹Œì§€ ì¡°íšŒ ê°€?¥í•©?ˆë‹¤.
   *
   * @param approverNm - ?¹ì¸ê²°ì¬?ëª… (ë¶€ë¶?ê²€??
   * @returns Promise<UserData[]> - ?¹ì¸ê²°ì¬??ëª©ë¡
   * @example
   * const approvers = await usrService.searchApprover('?ê¸¸??);
   * // ê²°ê³¼: [{ empNo: "E001", empNm: "?ê¸¸??, authCd: "10" }]
   *
   * @throws Error - ?„ë¡œ?œì? ?¸ì¶œ ?¤íŒ¨ ??
   */
  async searchApprover(approverNm: string): Promise<UserData[]> {
    try {
      console.log('?” ?¹ì¸ê²°ì¬??ê²€???œì‘:', approverNm);

      // Oracle ?„ë¡œ?œì? ?¸ì¶œ???„í•œ ì»¤ë„¥??
      const conn = await this.oracle.getConnection();

      try {
        // USR_01_0201_S ?„ë¡œ?œì? ?¸ì¶œ (?¹ì¸ê²°ì¬??ê²€?‰ìš©)
        const result = (await conn.execute(
          `
          BEGIN
            USR_01_0201_S(
              :cursor,           -- OUT: ê²°ê³¼ ì»¤ì„œ
              :I_HQ_DIV_CD,      -- IN: ë³¸ë?êµ¬ë¶„ì½”ë“œ (ë¹ˆê°’)
              :I_DEPT_DIV_CD,    -- IN: ë¶€?œêµ¬ë¶„ì½”??(ë¹ˆê°’)
              :I_USER_NM         -- IN: ?¬ìš©?ëª… (?¹ì¸ê²°ì¬?ëª…)
            );
          END;
          `,
          {
            cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            I_HQ_DIV_CD: '',
            I_DEPT_DIV_CD: '',
            I_USER_NM: approverNm,
          },
          {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
          },
        )) as { outBinds: { cursor: oracledb.ResultSet<any> } };

        // ê²°ê³¼ ì»¤ì„œ?ì„œ ?°ì´??ì¶”ì¶œ
        const rs = result.outBinds.cursor;
        const rows = await rs.getRows(100); // ìµœë? 100ê°œê¹Œì§€ ì¡°íšŒ
        await rs.close();

        console.log('???¹ì¸ê²°ì¬??ê²€??ê²°ê³¼:', rows.length + 'ê±?);

        return rows.map((row: any) => ({
          empNo: row.EMP_NO || '',
          empNm: row.EMP_NM || '',
          hqDivCd: row.HQ_DIV_CD || '',
          hqDivNm: row.HQ_DIV_NM || '',
          deptDivCd: row.DEPT_DIV_CD || '',
          deptDivNm: row.DEPT_DIV_NM || '',
          dutyCd: row.DUTY_CD || '',
          dutyNm: row.DUTY_NM || '',
          wmailYn: row.WMAIL_YN || '',
          authCd: row.AUTH_CD || '',
          authCdNm: row.AUTH_CD_NM || '',
          emailAddr: row.EMAIL_ADDR || '',
          // ?„ìˆ˜ ?„ë“œ?¤ì— ê¸°ë³¸ê°??¤ì •
          ownOutsDiv: row.OWN_OUTS_DIV || '',
          entrNo: row.ENTR_NO || '',
          entrDt: row.ENTR_DT || '',
          retirDt: row.RETIR_DT || '',
          dutyDivCd: row.DUTY_DIV_CD || '',
          dutyDivCdNm: row.DUTY_DIV_CD_NM || '',
          apvApofId: row.APV_APOF_ID || '',
          apvApofNm: row.APV_APOF_NM || '',
          wrkCnt: row.WRK_CNT || '0',
          lastWrk: row.LAST_WRK || '',
          bsnUseYn: row.BSN_USE_YN || '',
          wpcUseYn: row.WPC_USE_YN || '',
          psmUseYn: row.PSM_USE_YN || '',
          usrRoleId: row.USR_ROLE_ID || '',
          usrRoleNm: row.USR_ROLE_NM || '',
        }));
      } finally {
        // ?°ì´?°ë² ?´ìŠ¤ ?°ê²° ?´ì œ
        await conn.close();
      }
    } catch (error) {
      console.error('???¹ì¸ê²°ì¬??ê²€???¤ë¥˜:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `?¹ì¸ê²°ì¬??ê²€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ${errorMessage}`,
      );
    }
  }

  /**
   * ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ
   *
   * @description
   * - ?¬ìš©?¬ë?ê°€ 'Y'???¬ìš©????•  ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * - ??• ëª??œìœ¼ë¡??•ë ¬?˜ì—¬ ë°˜í™˜?©ë‹ˆ??
   *
   * @returns Promise<TblUserRole[]> - ?¬ìš©????•  ëª©ë¡
   * @example
   * const roles = await usrService.getUserRoles();
   * // ê²°ê³¼: [{ usrRoleId: "A250715001", usrRoleNm: "?¼ë°˜?¬ìš©?? }]
   *
   * @throws Error - DB ì¡°íšŒ ?¤íŒ¨ ??
   */
  async getUserRoles(): Promise<TblUserRole[]> {
    try {
      console.log('?” ?¬ìš©????•  ëª©ë¡ ì¡°íšŒ ?œì‘');

      const roles = await this.userRoleRepository.find({
        where: { useYn: 'Y' },
        order: { usrRoleNm: 'ASC' },
      });

      console.log('???¬ìš©????•  ëª©ë¡ ì¡°íšŒ ê²°ê³¼:', roles.length + 'ê±?);
      return roles;
    } catch (error) {
      console.error('???¬ìš©????•  ëª©ë¡ ì¡°íšŒ ?¤ë¥˜:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `?¬ìš©????•  ëª©ë¡ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ${errorMessage}`,
      );
    }
  }
}


