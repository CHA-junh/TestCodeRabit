/**
 * USR2010M00Service - 사용자 관리 서비스
 *
 * 주요 기능:
 * - 사용자 목록 조회 및 검색
 * - 사용자 정보 저장 (신규/수정)
 * - 사용자 업무권한 관리
 * - 비밀번호 초기화
 * - 승인결재자 검색
 * - 사용자 역할 관리
 *
 * 연관 테이블:
 * - TBL_EMP_INF: 직원 정보 (사용자 기본 정보)
 * - TBL_USER_INF: 사용자 정보 (권한, 승인결재자 등)
 * - TBL_WRKBY_USE_AUTH: 업무별 사용권한
 * - TBL_USER_ROLE: 사용자 역할
 * - TBL_SML_CSF_CD: 소분류코드 (본부, 부서, 권한, 직책 등)
 *
 * 연관 프로시저:
 * - USR_01_0201_S: 사용자 목록 조회 (TypeORM 쿼리로 대체)
 * - USR_01_0202_S: 업무별 사용권한 목록 조회
 * - USR_01_0204_T: 사용자 정보 저장 (신규/수정)
 * - USR_01_0104_T: 비밀번호 초기화
 *
 * 사용 화면:
 * - USR2010M00: 사용자 관리 화면
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
 * 사용자 데이터 인터페이스
 *
 * @description
 * 사용자 목록 조회 시 반환되는 사용자 정보 구조
 */
export interface UserData {
  empNo: string; // 사원번호
  ownOutsDiv: string; // 자사외주구분
  entrNo: string; // 업체번호
  empNm: string; // 사원성명
  entrDt: string; // 입사일자
  retirDt: string; // 퇴사일자
  hqDivCd: string; // 본부구분코드
  hqDivNm: string; // 본부명
  deptDivCd: string; // 부서구분코드
  deptDivNm: string; // 부서명
  dutyCd: string; // 직책코드
  dutyNm: string; // 직책명
  wmailYn: string; // 웹메일등록여부
  authCd: string; // 권한코드
  authCdNm: string; // 권한명
  dutyDivCd: string; // 직책구분코드
  dutyDivCdNm: string; // 직책구분명
  apvApofId: string; // 승인결재자ID
  apvApofNm: string; // 승인결재자명
  wrkCnt: string; // 사용권한업무갯수
  lastWrk: string; // 최종등록된업무
  bsnUseYn: string; // 사업/프로젝트 사용유무
  wpcUseYn: string; // 업무추진비 사용유무
  psmUseYn: string; // 인사/복리 사용유무
  emailAddr: string; // 이메일주소
  usrRoleId: string; // 사용자역할ID
  usrRoleNm: string; // 사용자역할명
}

/**
 * 업무권한 데이터 인터페이스
 *
 * @description
 * 사용자별 업무권한 정보 구조
 */
export interface WorkAuthData {
  smlCsfCd: string; // 업무구분코드
  smlCsfNm: string; // 업무구분명
  wrkUseYn: string; // 사용권한여부
  rmk?: string; // 비고
  regDttm?: string; // 등록일시
  chngrId?: string; // 변경자ID
}

/**
 * 사용자 저장 데이터 인터페이스
 *
 * @description
 * 사용자 정보 저장 시 사용되는 데이터 구조
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
  usrRoleId?: string; // 사용자역할ID (선택적, 기본값: 'A250715001')
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
   * 사용자 목록 조회 (TypeORM 쿼리로 변경)
   *
   * @description
   * 기존 USR_01_0201_S 프로시저를 TypeORM 쿼리로 대체한 이유:
   * 1. 프로시저 의존성 제거로 유지보수성 향상
   * 2. TypeORM의 타입 안전성과 쿼리 빌더 활용
   * 3. 사용자역할(USR_ROLE_ID) 정보 추가로 새로운 요구사항 반영
   * 4. 테스트 용이성 및 디버깅 편의성 증대
   * 5. 마이크로서비스 아키텍처에 적합한 구조로 전환
   *
   * 조회 조건:
   * - 본부구분코드 (hqDiv)
   * - 부서구분코드 (deptDiv)
   * - 사용자명 (userNm, 부분 검색)
   *
   * @param hqDiv - 본부구분코드 (ALL=전체)
   * @param deptDiv - 부서구분코드 (ALL=전체)
   * @param userNm - 사용자명 (부분 검색)
   * @returns Promise<UserData[]> - 사용자 목록
   * @example
   * const users = await usrService.getUserList('1000', '1100', '홍길동');
   * // 결과: [{ empNo: "E001", empNm: "홍길동", hqDivNm: "디지털영업본부" }]
   *
   * @throws Error - DB 조회 실패 시
   */
  async getUserList(
    hqDiv?: string,
    deptDiv?: string,
    userNm?: string,
  ): Promise<UserData[]> {
    try {
      console.log('⚡️ Executing raw SQL query for user list...');
      console.log('🔍 Query params:', { hqDiv, deptDiv, userNm });

      // 동적 WHERE 조건 구성
      let whereConditions: string[] = [];
      let queryParams: any = {};

      // 프로시저 로직에 맞게 WHERE 조건 구성 (모든 조건을 동시에 적용)
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

      console.log('🔍 Where conditions:', whereConditions);
      console.log('🔍 Query parameters object:', queryParams);

      // 복잡한 JOIN 쿼리로 사용자 정보와 권한 정보를 함께 조회
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

      console.log('🔍 Final SQL Query:', query);
      console.log('🔍 Query Parameters:', queryParams);

      const result = await this.empRepository.query(
        query,
        Object.values(queryParams),
      );
      console.log('✅ Raw query result count:', result.length);

      // 결과를 UserData 인터페이스에 맞게 변환
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

      console.log('✅ Transformed user data count:', userDataList.length);
      return userDataList;
    } catch (error) {
      console.error('❌ Error in getUserList:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `사용자 목록 조회 중 오류가 발생했습니다: ${errorMessage}`,
      );
    }
  }

  /**
   * 사용자 업무권한 목록 조회
   *
   * @description
   * - USR_01_0202_S 프로시저를 호출하여 특정 사용자의 업무권한 목록을 조회합니다.
   * - 업무구분코드, 업무구분명, 사용권한여부 등을 반환합니다.
   * - 최대 100개까지 조회 가능합니다.
   *
   * @param userId - 사용자 ID (사번)
   * @returns Promise<WorkAuthData[]> - 업무권한 목록
   * @example
   * const workAuths = await usrService.getWorkAuthList('E001');
   * // 결과: [{ smlCsfCd: "01", smlCsfNm: "사업관리", wrkUseYn: "1" }]
   *
   * @throws Error - 프로시저 호출 실패 시
   */
  async getWorkAuthList(userId: string): Promise<WorkAuthData[]> {
    try {
      console.log('🔍 사용자 업무권한 조회 시작:', userId);

      // Oracle 프로시저 호출을 위한 커넥션
      const conn = await this.oracle.getConnection();

      try {
        // USR_01_0202_S 프로시저 호출
        const result = (await conn.execute(
          `
          BEGIN
            USR_01_0202_S(
              :cursor,           -- OUT: 결과 커서
              :I_USER_ID         -- IN: 사용자ID
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

        // 결과 커서에서 데이터 추출
        const rs = result.outBinds.cursor;
        const rows = await rs.getRows(100); // 최대 100개까지 조회
        await rs.close();

        console.log('✅ 업무권한 조회 결과:', rows.length + '건');

        return rows.map((row: any) => ({
          smlCsfCd: row.SML_CSF_CD || '',
          smlCsfNm: row.SML_CSF_NM || '',
          wrkUseYn: row.WRK_USE_YN || '0',
          rmk: row.RMK || '',
          regDttm: row.REG_DTTM || '',
          chngrId: row.CHNGR_ID || '',
        }));
      } finally {
        // 데이터베이스 연결 해제
        await conn.close();
      }
    } catch (error) {
      console.error('❌ 업무권한 조회 오류:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`업무권한 조회 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }

  /**
   * 사용자 정보 저장 (신규/수정)
   *
   * @description
   * 기존 USR_01_0203_T 프로시저에서 사용자역할 관리가 추가된 USR_01_0204_T 프로시저로 변경
   *
   * 프로시저 파라미터:
   * - I_USER_ID: 사용자ID
   * - I_USER_NM: 사용자이름
   * - I_HQ_DIV_CD: 본부구분코드
   * - I_DEPT_DIV_CD: 부서구분코드
   * - I_DUTY_CD: 직책코드
   * - I_DUTY_DIV_CD: 직책구분코드 (대분류코드:114)
   * - I_AUTH_CD: 권한코드
   * - I_APV_APOF_ID: 승인 결재자 ID
   * - I_EMAIL_ADDR: 이메일주소
   * - I_WORK_USE_AUTH: 사용권한 부여받은 업무코드 (파이프(|)로 구분)
   * - I_REG_USER_ID: 등록사용자ID (현재 세션의 로그인 사용자)
   * - I_USR_ROLE_ID: 사용자역할ID (기본값: 일반사용자 'A250715001')
   *
   * @param userData - 저장할 사용자 정보
   * @param currentUserId - 현재 로그인한 사용자 ID (세션에서 전달)
   * @returns Promise<string> - 저장 결과 메시지
   * @example
   * const result = await usrService.saveUser({
   *   empNo: "E001",
   *   empNm: "홍길동",
   *   hqDivCd: "1000",
   *   deptDivCd: "1100",
   *   workAuthList: [{ smlCsfCd: "01", wrkUseYn: "1" }]
   * }, "E001");
   *
   * @throws Error - 프로시저 호출 실패 시
   */
  async saveUser(
    userData: UserSaveData,
    currentUserId: string,
  ): Promise<string> {
    try {
      console.log('💾 사용자 정보 저장 시작:', userData);

      // Oracle 프로시저 호출을 위한 커넥션
      const conn = await this.oracle.getConnection();

      try {
        // 저장 전 현재 사용자 정보 조회
        console.log('🔍 저장 전 사용자 정보 조회...');
        const currentUser = await this.getUserList(
          'ALL',
          'ALL',
          userData.empNm,
        );
        if (currentUser.length > 0) {
          const user = currentUser.find((u) => u.empNo === userData.empNo);
          if (user) {
            console.log('🔍 저장 전 사용자 정보:', {
              empNo: user.empNo,
              usrRoleId: user.usrRoleId,
              usrRoleNm: user.usrRoleNm,
            });
          }
        }

        // 업무권한 코드 문자열 생성 (파이프(|)로 구분, 맨 마지막에도 파이프 추가)
        const workAuthCodes = userData.workAuthList
          .filter((auth) => auth.wrkUseYn === '1' || auth.wrkUseYn === 'Y')
          .map((auth) => auth.smlCsfCd);

        const workAuthString =
          workAuthCodes.length > 0
            ? workAuthCodes.join('|') + '|' // 맨 마지막에도 파이프 추가
            : '';

        console.log('🔍 업무권한 코드:', workAuthString);

        // 프로시저 호출 전 파라미터 로그
        console.log('🔍 프로시저 파라미터:');
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

        // 프로시저 존재 여부 확인 (더 자세한 정보)
        console.log('🔍 프로시저 존재 여부 확인...');

        // USR_01_0204_T 프로시저 호출
        console.log('🔍 프로시저 호출 시작...');
        const result = (await conn.execute(
          `
          BEGIN
            USR_01_0204_T(
              :O_RTN,              -- OUT: 결과값 (1: 성공, 에러메시지: 실패)
              :I_USER_ID,          -- IN: 사용자ID
              :I_USER_NM,          -- IN: 사용자이름
              :I_HQ_DIV_CD,        -- IN: 본부구분코드
              :I_DEPT_DIV_CD,      -- IN: 부서구분코드
              :I_DUTY_CD,          -- IN: 직책코드
              :I_DUTY_DIV_CD,      -- IN: 직책구분코드 (대분류코드:114)
              :I_AUTH_CD,          -- IN: 권한코드
              :I_APV_APOF_ID,      -- IN: 승인 결재자 ID
              :I_EMAIL_ADDR,       -- IN: 이메일주소
              :I_WORK_USE_AUTH,    -- IN: 사용권한 부여받은 업무코드 (파이프(|)로 구분)
              :I_REG_USER_ID,      -- IN: 등록사용자ID
              :I_USR_ROLE_ID       -- IN: 사용자역할ID
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
            I_USR_ROLE_ID: userData.usrRoleId || 'A250715001', // 기본값: 일반사용자,
          },
        )) as { outBinds: { O_RTN: string } };

        console.log('🔍 프로시저 호출 완료');
        console.log('🔍 프로시저 결과:', result);
        console.log('🔍 outBinds:', result.outBinds);

        const rtn = result.outBinds.O_RTN;
        console.log('🔍 반환값 (O_RTN):', rtn);

        if (rtn === '1') {
          // 프로시저 호출 성공 시 커밋 수행
          console.log('🔍 트랜잭션 커밋 시작...');
          await conn.commit();
          console.log('✅ 트랜잭션 커밋 완료');

          console.log('✅ 사용자 정보 저장 완료');

          // 실제 DB에 저장되었는지 확인하기 위해 사용자 정보를 다시 조회
          try {
            const savedUser = await this.getUserList(
              'ALL',
              'ALL',
              userData.empNm,
            );
            console.log('🔍 저장 후 사용자 조회 결과:', savedUser);

            if (savedUser.length > 0) {
              const user = savedUser.find((u) => u.empNo === userData.empNo);
              if (user) {
                console.log('✅ DB에 실제로 저장됨 확인:', {
                  empNo: user.empNo,
                  usrRoleId: user.usrRoleId,
                  usrRoleNm: user.usrRoleNm,
                });
              } else {
                console.warn('⚠️ 저장된 사용자를 찾을 수 없음');
              }
            }
          } catch (error) {
            console.error('❌ 저장 후 사용자 조회 실패:', error);
          }

          return '저장되었습니다.';
        } else {
          // 프로시저 호출 실패 시 롤백 수행
          console.log('🔍 트랜잭션 롤백 시작...');
          await conn.rollback();
          console.log('✅ 트랜잭션 롤백 완료');

          console.error('❌ 사용자 정보 저장 실패:', rtn);
          throw new Error(`저장 실패: ${rtn}`);
        }
      } finally {
        // 데이터베이스 연결 해제
        await conn.close();
      }
    } catch (error) {
      console.error('❌ 사용자 정보 저장 오류:', error);
      console.error('❌ 오류 상세 정보:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        code: (error as any).code,
        errno: (error as any).errno,
      });
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `사용자 정보 저장 중 오류가 발생했습니다: ${errorMessage}`,
      );
    }
  }

  /**
   * 비밀번호 초기화
   *
   * @description
   * - 사용자의 비밀번호를 사용자ID로 초기화합니다 (기존 Flex 방식과 동일).
   * - SH1512 해시를 사용하여 비밀번호를 암호화합니다.
   * - 비밀번호 변경일시를 현재 시간으로 설정합니다.
   *
   * 기존 Flex 프로시저:
   * - USR_01_0104_T: 비밀번호 초기화 프로시저
   * - 파라미터: I_USER_ID (사용자ID), O_RTN (결과값)
   * - 응답: 1=성공, 에러메시지=실패
   * - 초기화 비밀번호: 사용자ID (사번)
   *
   * @param userId - 사용자 ID (사번)
   * @returns Promise<string> - 초기화 결과 메시지
   * @example
   * const result = await usrService.initPassword('E001');
   * // 결과: "비밀번호가 초기화되었습니다."
   *
   * @throws Error - 비밀번호 초기화 실패 시
   */
  async initPassword(userId: string): Promise<string> {
    try {
      console.log('🔑 비밀번호 초기화 시작:', userId);

      // 기존 Flex 방식과 동일하게 사용자ID를 비밀번호로 설정
      // TO-BE SHE512 암호화 적용용
      const defaultPassword = userId; // 사용자ID (사번)를 비밀번호로 사용
      const hashedPassword = crypto
        .createHash('sha512')
        .update(defaultPassword)
        .digest('hex');

      // 현재 시간을 14자리 문자열로 변환 (YYYYMMDDHHMMSS)
      const now = new Date();
      const pwdChngDttm =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');

      console.log('🔍 비밀번호 변경일시 (14자리):', pwdChngDttm);
      console.log('🔍 초기화 비밀번호:', defaultPassword);

      // 사용자 테이블에 비밀번호 업데이트
      await this.userRepository.update(
        { userId: userId },
        {
          userPwd: hashedPassword,
          pwdChngDttm: pwdChngDttm,
        },
      );

      console.log('✅ 비밀번호 초기화 완료');
      return '비밀번호가 초기화되었습니다.';
    } catch (error) {
      console.error('❌ 비밀번호 초기화 오류:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `비밀번호 초기화 중 오류가 발생했습니다: ${errorMessage}`,
      );
    }
  }

  /**
   * 승인결재자 검색
   *
   * @description
   * - USR_01_0201_S 프로시저를 호출하여 승인결재자를 검색합니다.
   * - 사용자명으로 부분 검색이 가능합니다.
   * - 최대 100개까지 조회 가능합니다.
   *
   * @param approverNm - 승인결재자명 (부분 검색)
   * @returns Promise<UserData[]> - 승인결재자 목록
   * @example
   * const approvers = await usrService.searchApprover('홍길동');
   * // 결과: [{ empNo: "E001", empNm: "홍길동", authCd: "10" }]
   *
   * @throws Error - 프로시저 호출 실패 시
   */
  async searchApprover(approverNm: string): Promise<UserData[]> {
    try {
      console.log('🔍 승인결재자 검색 시작:', approverNm);

      // Oracle 프로시저 호출을 위한 커넥션
      const conn = await this.oracle.getConnection();

      try {
        // USR_01_0201_S 프로시저 호출 (승인결재자 검색용)
        const result = (await conn.execute(
          `
          BEGIN
            USR_01_0201_S(
              :cursor,           -- OUT: 결과 커서
              :I_HQ_DIV_CD,      -- IN: 본부구분코드 (빈값)
              :I_DEPT_DIV_CD,    -- IN: 부서구분코드 (빈값)
              :I_USER_NM         -- IN: 사용자명 (승인결재자명)
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

        // 결과 커서에서 데이터 추출
        const rs = result.outBinds.cursor;
        const rows = await rs.getRows(100); // 최대 100개까지 조회
        await rs.close();

        console.log('✅ 승인결재자 검색 결과:', rows.length + '건');

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
          // 필수 필드들에 기본값 설정
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
        // 데이터베이스 연결 해제
        await conn.close();
      }
    } catch (error) {
      console.error('❌ 승인결재자 검색 오류:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `승인결재자 검색 중 오류가 발생했습니다: ${errorMessage}`,
      );
    }
  }

  /**
   * 사용자 역할 목록 조회
   *
   * @description
   * - 사용여부가 'Y'인 사용자 역할 목록을 조회합니다.
   * - 역할명 순으로 정렬하여 반환합니다.
   *
   * @returns Promise<TblUserRole[]> - 사용자 역할 목록
   * @example
   * const roles = await usrService.getUserRoles();
   * // 결과: [{ usrRoleId: "A250715001", usrRoleNm: "일반사용자" }]
   *
   * @throws Error - DB 조회 실패 시
   */
  async getUserRoles(): Promise<TblUserRole[]> {
    try {
      console.log('🔍 사용자 역할 목록 조회 시작');

      const roles = await this.userRoleRepository.find({
        where: { useYn: 'Y' },
        order: { usrRoleNm: 'ASC' },
      });

      console.log('✅ 사용자 역할 목록 조회 결과:', roles.length + '건');
      return roles;
    } catch (error) {
      console.error('❌ 사용자 역할 목록 조회 오류:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `사용자 역할 목록 조회 중 오류가 발생했습니다: ${errorMessage}`,
      );
    }
  }
}
