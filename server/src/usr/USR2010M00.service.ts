/**
 * USR2010M00Service - ?�용??관�??�비??
 *
 * 주요 기능:
 * - ?�용??목록 조회 �?검??
 * - ?�용???�보 ?�??(?�규/?�정)
 * - ?�용???�무권한 관�?
 * - 비�?번호 초기??
 * - ?�인결재??검??
 * - ?�용????�� 관�?
 *
 * ?��? ?�이�?
 * - TBL_EMP_INF: 직원 ?�보 (?�용??기본 ?�보)
 * - TBL_USER_INF: ?�용???�보 (권한, ?�인결재????
 * - TBL_WRKBY_USE_AUTH: ?�무�??�용권한
 * - TBL_USER_ROLE: ?�용????��
 * - TBL_SML_CSF_CD: ?�분류코??(본�?, 부?? 권한, 직책 ??
 *
 * ?��? ?�로?��?:
 * - USR_01_0201_S: ?�용??목록 조회 (TypeORM 쿼리�??��?
 * - USR_01_0202_S: ?�무�??�용권한 목록 조회
 * - USR_01_0204_T: ?�용???�보 ?�??(?�규/?�정)
 * - USR_01_0104_T: 비�?번호 초기??
 *
 * ?�용 ?�면:
 * - USR2010M00: ?�용??관�??�면
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
 * ?�용???�이???�터?�이??
 *
 * @description
 * ?�용??목록 조회 ??반환?�는 ?�용???�보 구조
 */
export interface UserData {
  empNo: string; // ?�원번호
  ownOutsDiv: string; // ?�사?�주구분
  entrNo: string; // ?�체번호
  empNm: string; // ?�원?�명
  entrDt: string; // ?�사?�자
  retirDt: string; // ?�사?�자
  hqDivCd: string; // 본�?구분코드
  hqDivNm: string; // 본�?�?
  deptDivCd: string; // 부?�구분코??
  deptDivNm: string; // 부?�명
  dutyCd: string; // 직책코드
  dutyNm: string; // 직책�?
  wmailYn: string; // ?�메?�등록여부
  authCd: string; // 권한코드
  authCdNm: string; // 권한�?
  dutyDivCd: string; // 직책구분코드
  dutyDivCdNm: string; // 직책구분�?
  apvApofId: string; // ?�인결재?�ID
  apvApofNm: string; // ?�인결재?�명
  wrkCnt: string; // ?�용권한?�무�?��
  lastWrk: string; // 최종?�록?�업�?
  bsnUseYn: string; // ?�업/?�로?�트 ?�용?�무
  wpcUseYn: string; // ?�무추진�??�용?�무
  psmUseYn: string; // ?�사/복리 ?�용?�무
  emailAddr: string; // ?�메?�주??
  usrRoleId: string; // ?�용?�역?�ID
  usrRoleNm: string; // ?�용?�역?�명
}

/**
 * ?�무권한 ?�이???�터?�이??
 *
 * @description
 * ?�용?�별 ?�무권한 ?�보 구조
 */
export interface WorkAuthData {
  smlCsfCd: string; // ?�무구분코드
  smlCsfNm: string; // ?�무구분�?
  wrkUseYn: string; // ?�용권한?��?
  rmk?: string; // 비고
  regDttm?: string; // ?�록?�시
  chngrId?: string; // 변경자ID
}

/**
 * ?�용???�???�이???�터?�이??
 *
 * @description
 * ?�용???�보 ?�?????�용?�는 ?�이??구조
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
  usrRoleId?: string; // ?�용?�역?�ID (?�택?? 기본�? 'A250715001')
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
   * ?�용??목록 조회 (TypeORM 쿼리�?변�?
   *
   * @description
   * 기존 USR_01_0201_S ?�로?��?�?TypeORM 쿼리�??�체한 ?�유:
   * 1. ?�로?��? ?�존???�거�??��?보수???�상
   * 2. TypeORM???�???�전?�과 쿼리 빌더 ?�용
   * 3. ?�용?�역??USR_ROLE_ID) ?�보 추�?�??�로???�구?�항 반영
   * 4. ?�스???�이??�??�버�??�의??증�?
   * 5. 마이?�로?�비???�키?�처???�합??구조�??�환
   *
   * 조회 조건:
   * - 본�?구분코드 (hqDiv)
   * - 부?�구분코??(deptDiv)
   * - ?�용?�명 (userNm, 부�?검??
   *
   * @param hqDiv - 본�?구분코드 (ALL=?�체)
   * @param deptDiv - 부?�구분코??(ALL=?�체)
   * @param userNm - ?�용?�명 (부�?검??
   * @returns Promise<UserData[]> - ?�용??목록
   * @example
   * const users = await usrService.getUserList('1000', '1100', '?�길??);
   * // 결과: [{ empNo: "E001", empNm: "?�길??, hqDivNm: "?��??�영?�본부" }]
   *
   * @throws Error - DB 조회 ?�패 ??
   */
  async getUserList(
    hqDiv?: string,
    deptDiv?: string,
    userNm?: string,
  ): Promise<UserData[]> {
    try {
      console.log('?�️ Executing raw SQL query for user list...');
      console.log('?�� Query params:', { hqDiv, deptDiv, userNm });

      // ?�적 WHERE 조건 구성
      let whereConditions: string[] = [];
      let queryParams: any = {};

      // ?�로?��? 로직??맞게 WHERE 조건 구성 (모든 조건???�시???�용)
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

      console.log('?�� Where conditions:', whereConditions);
      console.log('?�� Query parameters object:', queryParams);

      // 복잡??JOIN 쿼리�??�용???�보?� 권한 ?�보�??�께 조회
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

      console.log('?�� Final SQL Query:', query);
      console.log('?�� Query Parameters:', queryParams);

      const result = await this.empRepository.query(
        query,
        Object.values(queryParams),
      );
      console.log('??Raw query result count:', result.length);

      // 결과�?UserData ?�터?�이?�에 맞게 변??
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
        `?�용??목록 조회 �??�류가 발생?�습?�다: ${errorMessage}`,
      );
    }
  }

  /**
   * ?�용???�무권한 목록 조회
   *
   * @description
   * - USR_01_0202_S ?�로?��?�??�출?�여 ?�정 ?�용?�의 ?�무권한 목록??조회?�니??
   * - ?�무구분코드, ?�무구분�? ?�용권한?��? ?�을 반환?�니??
   * - 최�? 100개까지 조회 가?�합?�다.
   *
   * @param userId - ?�용??ID (?�번)
   * @returns Promise<WorkAuthData[]> - ?�무권한 목록
   * @example
   * const workAuths = await usrService.getWorkAuthList('E001');
   * // 결과: [{ smlCsfCd: "01", smlCsfNm: "?�업관�?, wrkUseYn: "1" }]
   *
   * @throws Error - ?�로?��? ?�출 ?�패 ??
   */
  async getWorkAuthList(userId: string): Promise<WorkAuthData[]> {
    try {
      console.log('?�� ?�용???�무권한 조회 ?�작:', userId);

      // Oracle ?�로?��? ?�출???�한 커넥??
      const conn = await this.oracle.getConnection();

      try {
        // USR_01_0202_S ?�로?��? ?�출
        const result = (await conn.execute(
          `
          BEGIN
            USR_01_0202_S(
              :cursor,           -- OUT: 결과 커서
              :I_USER_ID         -- IN: ?�용?�ID
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

        // 결과 커서?�서 ?�이??추출
        const rs = result.outBinds.cursor;
        const rows = await rs.getRows(100); // 최�? 100개까지 조회
        await rs.close();

        console.log('???�무권한 조회 결과:', rows.length + '�?);

        return rows.map((row: any) => ({
          smlCsfCd: row.SML_CSF_CD || '',
          smlCsfNm: row.SML_CSF_NM || '',
          wrkUseYn: row.WRK_USE_YN || '0',
          rmk: row.RMK || '',
          regDttm: row.REG_DTTM || '',
          chngrId: row.CHNGR_ID || '',
        }));
      } finally {
        // ?�이?�베?�스 ?�결 ?�제
        await conn.close();
      }
    } catch (error) {
      console.error('???�무권한 조회 ?�류:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`?�무권한 조회 �??�류가 발생?�습?�다: ${errorMessage}`);
    }
  }

  /**
   * ?�용???�보 ?�??(?�규/?�정)
   *
   * @description
   * 기존 USR_01_0203_T ?�로?��??�서 ?�용?�역??관리�? 추�???USR_01_0204_T ?�로?��?�?변�?
   *
   * ?�로?��? ?�라미터:
   * - I_USER_ID: ?�용?�ID
   * - I_USER_NM: ?�용?�이�?
   * - I_HQ_DIV_CD: 본�?구분코드
   * - I_DEPT_DIV_CD: 부?�구분코??
   * - I_DUTY_CD: 직책코드
   * - I_DUTY_DIV_CD: 직책구분코드 (?�분류코드:114)
   * - I_AUTH_CD: 권한코드
   * - I_APV_APOF_ID: ?�인 결재??ID
   * - I_EMAIL_ADDR: ?�메?�주??
   * - I_WORK_USE_AUTH: ?�용권한 부?�받?� ?�무코드 (?�이??|)�?구분)
   * - I_REG_USER_ID: ?�록?�용?�ID (?�재 ?�션??로그???�용??
   * - I_USR_ROLE_ID: ?�용?�역?�ID (기본�? ?�반?�용??'A250715001')
   *
   * @param userData - ?�?�할 ?�용???�보
   * @param currentUserId - ?�재 로그?�한 ?�용??ID (?�션?�서 ?�달)
   * @returns Promise<string> - ?�??결과 메시지
   * @example
   * const result = await usrService.saveUser({
   *   empNo: "E001",
   *   empNm: "?�길??,
   *   hqDivCd: "1000",
   *   deptDivCd: "1100",
   *   workAuthList: [{ smlCsfCd: "01", wrkUseYn: "1" }]
   * }, "E001");
   *
   * @throws Error - ?�로?��? ?�출 ?�패 ??
   */
  async saveUser(
    userData: UserSaveData,
    currentUserId: string,
  ): Promise<string> {
    try {
      console.log('?�� ?�용???�보 ?�???�작:', userData);

      // Oracle ?�로?��? ?�출???�한 커넥??
      const conn = await this.oracle.getConnection();

      try {
        // ?�?????�재 ?�용???�보 조회
        console.log('?�� ?�?????�용???�보 조회...');
        const currentUser = await this.getUserList(
          'ALL',
          'ALL',
          userData.empNm,
        );
        if (currentUser.length > 0) {
          const user = currentUser.find((u) => u.empNo === userData.empNo);
          if (user) {
            console.log('?�� ?�?????�용???�보:', {
              empNo: user.empNo,
              usrRoleId: user.usrRoleId,
              usrRoleNm: user.usrRoleNm,
            });
          }
        }

        // ?�무권한 코드 문자???�성 (?�이??|)�?구분, �?마�?막에???�이??추�?)
        const workAuthCodes = userData.workAuthList
          .filter((auth) => auth.wrkUseYn === '1' || auth.wrkUseYn === 'Y')
          .map((auth) => auth.smlCsfCd);

        const workAuthString =
          workAuthCodes.length > 0
            ? workAuthCodes.join('|') + '|' // �?마�?막에???�이??추�?
            : '';

        console.log('?�� ?�무권한 코드:', workAuthString);

        // ?�로?��? ?�출 ???�라미터 로그
        console.log('?�� ?�로?��? ?�라미터:');
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

        // ?�로?��? 존재 ?��? ?�인 (???�세???�보)
        console.log('?�� ?�로?��? 존재 ?��? ?�인...');

        // USR_01_0204_T ?�로?��? ?�출
        console.log('?�� ?�로?��? ?�출 ?�작...');
        const result = (await conn.execute(
          `
          BEGIN
            USR_01_0204_T(
              :O_RTN,              -- OUT: 결과�?(1: ?�공, ?�러메시지: ?�패)
              :I_USER_ID,          -- IN: ?�용?�ID
              :I_USER_NM,          -- IN: ?�용?�이�?
              :I_HQ_DIV_CD,        -- IN: 본�?구분코드
              :I_DEPT_DIV_CD,      -- IN: 부?�구분코??
              :I_DUTY_CD,          -- IN: 직책코드
              :I_DUTY_DIV_CD,      -- IN: 직책구분코드 (?�분류코드:114)
              :I_AUTH_CD,          -- IN: 권한코드
              :I_APV_APOF_ID,      -- IN: ?�인 결재??ID
              :I_EMAIL_ADDR,       -- IN: ?�메?�주??
              :I_WORK_USE_AUTH,    -- IN: ?�용권한 부?�받?� ?�무코드 (?�이??|)�?구분)
              :I_REG_USER_ID,      -- IN: ?�록?�용?�ID
              :I_USR_ROLE_ID       -- IN: ?�용?�역?�ID
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
            I_USR_ROLE_ID: userData.usrRoleId || 'A250715001', // 기본�? ?�반?�용??
          },
        )) as { outBinds: { O_RTN: string } };

        console.log('?�� ?�로?��? ?�출 ?�료');
        console.log('?�� ?�로?��? 결과:', result);
        console.log('?�� outBinds:', result.outBinds);

        const rtn = result.outBinds.O_RTN;
        console.log('?�� 반환�?(O_RTN):', rtn);

        if (rtn === '1') {
          // ?�로?��? ?�출 ?�공 ??커밋 ?�행
          console.log('?�� ?�랜??�� 커밋 ?�작...');
          await conn.commit();
          console.log('???�랜??�� 커밋 ?�료');

          console.log('???�용???�보 ?�???�료');

          // ?�제 DB???�?�되?�는지 ?�인?�기 ?�해 ?�용???�보�??�시 조회
          try {
            const savedUser = await this.getUserList(
              'ALL',
              'ALL',
              userData.empNm,
            );
            console.log('?�� ?�?????�용??조회 결과:', savedUser);

            if (savedUser.length > 0) {
              const user = savedUser.find((u) => u.empNo === userData.empNo);
              if (user) {
                console.log('??DB???�제�??�?�됨 ?�인:', {
                  empNo: user.empNo,
                  usrRoleId: user.usrRoleId,
                  usrRoleNm: user.usrRoleNm,
                });
              } else {
                console.warn('?�️ ?�?�된 ?�용?��? 찾을 ???�음');
              }
            }
          } catch (error) {
            console.error('???�?????�용??조회 ?�패:', error);
          }

          return '?�?�되?�습?�다.';
        } else {
          // ?�로?��? ?�출 ?�패 ??롤백 ?�행
          console.log('?�� ?�랜??�� 롤백 ?�작...');
          await conn.rollback();
          console.log('???�랜??�� 롤백 ?�료');

          console.error('???�용???�보 ?�???�패:', rtn);
          throw new Error(`?�???�패: ${rtn}`);
        }
      } finally {
        // ?�이?�베?�스 ?�결 ?�제
        await conn.close();
      }
    } catch (error) {
      console.error('???�용???�보 ?�???�류:', error);
      console.error('???�류 ?�세 ?�보:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        code: (error as any).code,
        errno: (error as any).errno,
      });
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `?�용???�보 ?�??�??�류가 발생?�습?�다: ${errorMessage}`,
      );
    }
  }

  /**
   * 비�?번호 초기??
   *
   * @description
   * - ?�용?�의 비�?번호�??�용?�ID�?초기?�합?�다 (기존 Flex 방식�??�일).
   * - SH1512 ?�시�??�용?�여 비�?번호�??�호?�합?�다.
   * - 비�?번호 변경일?��? ?�재 ?�간?�로 ?�정?�니??
   *
   * 기존 Flex ?�로?��?:
   * - USR_01_0104_T: 비�?번호 초기???�로?��?
   * - ?�라미터: I_USER_ID (?�용?�ID), O_RTN (결과�?
   * - ?�답: 1=?�공, ?�러메시지=?�패
   * - 초기??비�?번호: ?�용?�ID (?�번)
   *
   * @param userId - ?�용??ID (?�번)
   * @returns Promise<string> - 초기??결과 메시지
   * @example
   * const result = await usrService.initPassword('E001');
   * // 결과: "비�?번호가 초기?�되?�습?�다."
   *
   * @throws Error - 비�?번호 초기???�패 ??
   */
  async initPassword(userId: string): Promise<string> {
    try {
      console.log('?�� 비�?번호 초기???�작:', userId);

      // 기존 Flex 방식�??�일?�게 ?�용?�ID�?비�?번호�??�정
      // TO-BE SHE512 ?�호???�용??
      const defaultPassword = userId; // ?�용?�ID (?�번)�?비�?번호�??�용
      const hashedPassword = crypto
        .createHash('sha512')
        .update(defaultPassword)
        .digest('hex');

      // ?�재 ?�간??14?�리 문자?�로 변??(YYYYMMDDHHMMSS)
      const now = new Date();
      const pwdChngDttm =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');

      console.log('?�� 비�?번호 변경일??(14?�리):', pwdChngDttm);
      console.log('?�� 초기??비�?번호:', defaultPassword);

      // ?�용???�이블에 비�?번호 ?�데?�트
      await this.userRepository.update(
        { userId: userId },
        {
          userPwd: hashedPassword,
          pwdChngDttm: pwdChngDttm,
        },
      );

      console.log('??비�?번호 초기???�료');
      return '비�?번호가 초기?�되?�습?�다.';
    } catch (error) {
      console.error('??비�?번호 초기???�류:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `비�?번호 초기??�??�류가 발생?�습?�다: ${errorMessage}`,
      );
    }
  }

  /**
   * ?�인결재??검??
   *
   * @description
   * - USR_01_0201_S ?�로?��?�??�출?�여 ?�인결재?��? 검?�합?�다.
   * - ?�용?�명?�로 부�?검?�이 가?�합?�다.
   * - 최�? 100개까지 조회 가?�합?�다.
   *
   * @param approverNm - ?�인결재?�명 (부�?검??
   * @returns Promise<UserData[]> - ?�인결재??목록
   * @example
   * const approvers = await usrService.searchApprover('?�길??);
   * // 결과: [{ empNo: "E001", empNm: "?�길??, authCd: "10" }]
   *
   * @throws Error - ?�로?��? ?�출 ?�패 ??
   */
  async searchApprover(approverNm: string): Promise<UserData[]> {
    try {
      console.log('?�� ?�인결재??검???�작:', approverNm);

      // Oracle ?�로?��? ?�출???�한 커넥??
      const conn = await this.oracle.getConnection();

      try {
        // USR_01_0201_S ?�로?��? ?�출 (?�인결재??검?�용)
        const result = (await conn.execute(
          `
          BEGIN
            USR_01_0201_S(
              :cursor,           -- OUT: 결과 커서
              :I_HQ_DIV_CD,      -- IN: 본�?구분코드 (빈값)
              :I_DEPT_DIV_CD,    -- IN: 부?�구분코??(빈값)
              :I_USER_NM         -- IN: ?�용?�명 (?�인결재?�명)
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

        // 결과 커서?�서 ?�이??추출
        const rs = result.outBinds.cursor;
        const rows = await rs.getRows(100); // 최�? 100개까지 조회
        await rs.close();

        console.log('???�인결재??검??결과:', rows.length + '�?);

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
          // ?�수 ?�드?�에 기본�??�정
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
        // ?�이?�베?�스 ?�결 ?�제
        await conn.close();
      }
    } catch (error) {
      console.error('???�인결재??검???�류:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `?�인결재??검??�??�류가 발생?�습?�다: ${errorMessage}`,
      );
    }
  }

  /**
   * ?�용????�� 목록 조회
   *
   * @description
   * - ?�용?��?가 'Y'???�용????�� 목록??조회?�니??
   * - ??���??�으�??�렬?�여 반환?�니??
   *
   * @returns Promise<TblUserRole[]> - ?�용????�� 목록
   * @example
   * const roles = await usrService.getUserRoles();
   * // 결과: [{ usrRoleId: "A250715001", usrRoleNm: "?�반?�용?? }]
   *
   * @throws Error - DB 조회 ?�패 ??
   */
  async getUserRoles(): Promise<TblUserRole[]> {
    try {
      console.log('?�� ?�용????�� 목록 조회 ?�작');

      const roles = await this.userRoleRepository.find({
        where: { useYn: 'Y' },
        order: { usrRoleNm: 'ASC' },
      });

      console.log('???�용????�� 목록 조회 결과:', roles.length + '�?);
      return roles;
    } catch (error) {
      console.error('???�용????�� 목록 조회 ?�류:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `?�용????�� 목록 조회 �??�류가 발생?�습?�다: ${errorMessage}`,
      );
    }
  }
}


