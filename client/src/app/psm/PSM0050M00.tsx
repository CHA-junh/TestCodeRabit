'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import ConfirmDialog from '@/components/ConfirmDialog';

import PSM0060M00 from './PSM0060M00';
import COMZ080P00 from '../com/COMZ080P00';
import '../common/common.css';

/**
 * 사원 기본 정보 데이터 인터페이스
 * 
 * AS-IS PSM_01_0101_S 프로시저에서 반환되는 사원 정보와 동일한 구조
 * 
 * @property {string} EMP_NO - 사원번호
 * @property {string} OWN_OUTS_DIV - 내부/외주 구분 (1: 내부, 2: 외주)
 * @property {string} OWN_OUTS_NM - 내부/외주 구분명
 * @property {string} EMP_NM - 사원명
 * @property {string} ENTR_DT - 입사일 (YYYYMMDD)
 * @property {string} RETIR_DT - 퇴사일 (YYYYMMDD)
 * @property {string} PRJ_YN - 프로젝트 참여 여부 (Y/N)
 * @property {string} BSN_NO - 사업번호
 * @property {string} BSN_NM - 사업명
 * @property {string} DEV_NM - 개발명
 * @property {string} CO_CD - 회사코드
 * @property {string} CO_NM - 회사명
 * @property {string} EXEC_IN_STRT_DT - 실행중 시작일
 * @property {string} EXEC_IN_END_DT - 실행중 종료일
 * @property {string} CHRG_WRK - 담당업무
 * @property {string} EXEC_IN_YN - 실행중 여부 (Y/N)
 * @property {string} HQ_DIV_CD - 본부구분코드
 * @property {string} HQ_DIV_NM - 본부구분명
 * @property {string} DEPT_DIV_CD - 부서구분코드
 * @property {string} DEPT_DIV_NM - 부서구분명
 * @property {string} DUTY_CD - 직책코드
 * @property {string} DUTY_CD_NM - 직책명
 * @property {string} DUTY_DIV_CD - 직책구분코드
 * @property {string} TCN_GRD - 기술등급
 * @property {string} TCN_GRD_NM - 기술등급명
 * @property {string} WKG_ST_DIV - 근무상태구분
 * @property {string} WKG_ST_DIV_NM - 근무상태구분명
 * @property {string} RMK - 비고
 * @property {string} PARTY_NM - 소속명
 * @property {string} EXEC_ING_BSN_NM - 실행중 사업명
 * @property {string} EXEC_ING_YN - 실행중 여부 (Y/N)
 * @property {string} CSF_CO_CD - CSF 회사코드
 * @property {string} OUTS_FIX_YN - 외주고정여부 (Y/N)
 * @property {string} LAST_SCHL - 최종학력
 * @property {string} MAJR - 전공
 * @property {string} LAST_GRAD_DT - 최종졸업일 (YYYYMMDD)
 * @property {string} CTQL_CD_NM - 자격증명
 * @property {string} CTQL_CD - 자격증코드
 * @property {string} CTQL_PUR_DT - 자격증취득일 (YYYYMMDD)
 * @property {string} CARR_MCNT - 경력개월수
 * @property {string} ENTR_BEF_CARR - 입사전경력
 * @property {string} CARR_CALC_STND_DT - 경력계산기준일 (YYYYMMDD)
 */
interface EmployeeData {
  EMP_NO: string;
  OWN_OUTS_DIV: string;
  OWN_OUTS_NM: string;
  EMP_NM: string;
  ENTR_DT: string;
  RETIR_DT: string;
  PRJ_YN: string;
  BSN_NO: string;
  BSN_NM: string;
  DEV_NM: string;
  CO_CD: string;
  CO_NM: string;
  EXEC_IN_STRT_DT: string;
  EXEC_IN_END_DT: string;
  CHRG_WRK: string;
  EXEC_IN_YN: string;
  HQ_DIV_CD: string;
  HQ_DIV_NM: string;
  DEPT_DIV_CD: string;
  DEPT_DIV_NM: string;
  DUTY_CD: string;
  DUTY_CD_NM: string;
  DUTY_DIV_CD: string;
  TCN_GRD: string;
  TCN_GRD_NM: string;
  WKG_ST_DIV: string;
  WKG_ST_DIV_NM: string;
  RMK: string;
  PARTY_NM: string;
  EXEC_ING_BSN_NM: string;
  EXEC_ING_YN: string;
  CSF_CO_CD: string;
  OUTS_FIX_YN: string;
  LAST_SCHL: string;
  MAJR: string;
  LAST_GRAD_DT: string;
  CTQL_CD_NM: string;
  CTQL_CD: string;
  CTQL_PUR_DT: string;
  CARR_MCNT: string;
  ENTR_BEF_CARR: string;
  CARR_CALC_STND_DT: string;
}

interface ProfileData {
  EMP_NO: string;
  SEQ_NO: string;
  PRJT_NM: string;
  PRJT_NM_EXCEL: string;
  STRT_DT: string;
  END_DT: string;
  STRT_YM: string;
  END_YM: string;
  IN_MCNT: string;
  BSN_NO: string;
  MMBR_CO: string;
  CHRG_WRK: string;
  CHRG_WRK_NM: string;
  ROLE_DIV_CD: string;
  ROLE_DIV_NM: string;
  DVLP_ENVR: string;
  RMK: string;
  REG_DT: string;
  CHNGR_NM: string;
  LAST_CNFM_DT: string;
}

interface ProfileFormData {
  bsnNo: string;
  seqNo: string;
  strtYear: string;
  strtMonth: string;
  endYear: string;
  endMonth: string;
  prjtNm: string;
  mmbrCo: string;
  delpEnvr: string;
  roleNm: string;
  chrgWrk: string;
  taskNm: string;
  rmk: string;
  strtDate: string;
  endDate: string;
  bsnNm: string;
  custNm: string;
}

interface CommonCode {
  codeId?: string;
  codeNm?: string;
  DATA?: string;
  LABEL?: string;
}

interface ProfileCarrData {
  calcStadDt: string;
  entrBefInYcnt: number;
  entrBefInMcnt: number;
  entrAftInYcnt: number;
  entrAftInMcnt: number;
  totCarrYcnt: number;
  totCarrMcnt: number;
  adbgTcnGrdNm: string;
  adbgTcnGrdCd: string;
  ctqlEntrBefInYcnt: number;
  ctqlEntrBefInMcnt: number;
  ctqlEntrAftInYcnt: number;
  ctqlEntrAftInMcnt: number;
  ctqlTotCarrYcnt: number;
  ctqlTotCarrMcnt: number;
  ctqlTcnGrdNm: string;
  ctqlTcnGrdCd: string;
}

/**
 * PSM0050M00 - 개발자 프로필 관리 화면
 * 
 * 개발자의 프로필 정보를 관리하는 핵심 화면입니다.
 * 사원 정보 조회, 프로필 등록/수정/삭제, 경력 계산 등의 기능을 제공합니다.
 * 
 * 주요 기능:
 * - 사원 정보 조회 및 프로필 관리
 * - 프로필 등록/수정/삭제 (CRUD)
 * - 경력 계산 및 표시 (입사 전/후 경력 분리)
 * - 개발환경 선택 팝업 (PSM0060M00)
 * - 사원 검색 팝업 (COMZ080P00)
 * - CSV 다운로드 (AG Grid Community 버전)
 * - AG Grid를 활용한 프로필 목록 표시
 * 
 * AS-IS: PSM_03_0110.mxml (개발프로필 등록 및 수정)
 * TO-BE: React 기반 프로필 관리 화면
 * 
 * 사용 예시:
 * ```tsx
 * // 독립 화면으로 사용
 * <PSM0050M00 />
 * 
 * // 탭 모드로 사용 (PSM1010M00 내부)
 * <PSM0050M00 isTabMode={true} parentEmpNo="10001" parentEmpNm="홍길동" />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */
interface PSM0050M00Props {
  /** 탭 모드 여부 (PSM1010M00의 탭으로 사용될 때 true) */
  isTabMode?: boolean;
  /** 부모 컴포넌트에서 전달받은 사원번호 */
  parentEmpNo?: string;
  /** 부모 컴포넌트에서 전달받은 사원명 */
  parentEmpNm?: string;
  /** 프로필 등록 버튼 클릭 시 호출될 콜백 */
  onProfileRegist?: (empNo: string) => void;
}

// API 호출을 위한 공통 함수 (컴포넌트 외부로 이동)
const callApi = async (url: string, data: any): Promise<any> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  return response.json();
};

const PSM0050M00: React.FC<PSM0050M00Props> = ({ 
  isTabMode = false, 
  parentEmpNo = '', 
  parentEmpNm = '',
  onProfileRegist,
}) => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [profileList, setProfileList] = useState<ProfileData[]>([]);
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    bsnNo: '',
    seqNo: '',
    strtYear: '',
    strtMonth: '',
    endYear: '',
    endMonth: '',
    prjtNm: '',
    mmbrCo: '',
    delpEnvr: '',
    roleNm: '',
    chrgWrk: '',
    taskNm: '',
    rmk: '',
    strtDate: '',
    endDate: '',
    bsnNm: '',
    custNm: ''
  });

  const [newFlag, setNewFlag] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputEnabled, setInputEnabled] = useState<boolean>(true);
  const [searchEmpNm, setSearchEmpNm] = useState<string>('');
  const [commonCodes, setCommonCodes] = useState<CommonCode[]>([]);


  const [profileCarrData, setProfileCarrData] = useState<ProfileCarrData>({
    calcStadDt: '',
    entrBefInYcnt: 0,
    entrBefInMcnt: 0,
    entrAftInYcnt: 0,
    entrAftInMcnt: 0,
    totCarrYcnt: 0,
    totCarrMcnt: 0,
    adbgTcnGrdNm: '',
    adbgTcnGrdCd: '',
    ctqlEntrBefInYcnt: 0,
    ctqlEntrBefInMcnt: 0,
    ctqlEntrAftInYcnt: 0,
    ctqlEntrAftInMcnt: 0,
    ctqlTotCarrYcnt: 0,
    ctqlTotCarrMcnt: 0,
    ctqlTcnGrdNm: '',
    ctqlTcnGrdCd: ''
  });

  const [showDevEnvPopup, setShowDevEnvPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState('');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [employeeSearchData, setEmployeeSearchData] = useState<any>(null);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);

  const gridApiRef = useRef<GridApi | null>(null);
  
  // 입력 필드 refs
  const strtDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const prjtNmRef = useRef<HTMLInputElement>(null);
  const mmbrCoRef = useRef<HTMLInputElement>(null);
  const chrgWrkRef = useRef<HTMLSelectElement>(null);
  const delpEnvrRef = useRef<HTMLInputElement>(null);

  /**
   * AS-IS 권한 체크 로직
   * 경영지원본부 (01), 본부장(00), 부서장(10), 영업본부 영업대표(02)만 사원 조회 가능
   * @returns {boolean} 사원 조회 권한 여부
   */
  const isEnableSrchEmpAuthority = (): boolean => {
    const hqDivCd = user?.hqDivCd || '';
    const authCd = user?.authCd || '';
    const deptTp = user?.deptTp || '';

    if (hqDivCd === '01' || deptTp === 'ADM') return true; // 경영지원본부
    if (authCd === '00') return true; // 본부장
    if (authCd === '10') return true; // 부서장
    if (hqDivCd === '02' || deptTp === 'BIZ') return true; // 영업본부 영업대표

    return false;
  };

  /**
   * AS-IS 입력값 검증 로직
   * 필수 입력 필드 검증 및 오류 시 해당 필드에 포커스
   * @returns {boolean} 검증 통과 여부
   */
  const validateInputData = (): boolean => {
    const { strtDate, endDate, prjtNm, mmbrCo, delpEnvr, chrgWrk } = profileForm;

    if (!strtDate || strtDate === '') {
      showToast('시작일자를 입력해 주십시요.', 'error');
      setTimeout(() => strtDateRef.current?.focus(), 100);
      return false;
    }

    if (!endDate || endDate === '') {
      showToast('종료일자를 입력해 주십시요.', 'error');
      setTimeout(() => endDateRef.current?.focus(), 100);
      return false;
    }

    if (prjtNm === '') {
      showToast('프로젝트명을 입력해 주십시요.', 'error');
      setTimeout(() => prjtNmRef.current?.focus(), 100);
      return false;
    }

    if (mmbrCo === '') {
      showToast('고객사를 입력해 주십시요.', 'error');
      setTimeout(() => mmbrCoRef.current?.focus(), 100);
      return false;
    }

    if (chrgWrk === '') {
      showToast('담당업무를 입력해 주십시요.', 'error');
      setTimeout(() => chrgWrkRef.current?.focus(), 100);
      return false;
    }

    if (delpEnvr === '') {
      showToast('개발환경/DBMS/언어를 입력해 주십시요.', 'error');
      setTimeout(() => delpEnvrRef.current?.focus(), 100);
      return false;
    }

    // 시작일자가 종료일자보다 늦은 경우 체크
    if (strtDate > endDate) {
      showToast('시작일자는 종료일자보다 같거나 작아야 합니다. 개발기간을 다시 입력해 주십시요.', 'error');
      setTimeout(() => strtDateRef.current?.focus(), 100);
      return false;
    }

    return true;
  };

  /**
   * AS-IS 경력개월수 합계 구하기
   * 년과 개월을 입력받아 총 개월수로 변환
   * @param {string} strYCnt - 년수
   * @param {string} strMCnt - 개월수
   * @returns {string} 총 개월수
   */
  const getCarrMCnt = (strYCnt: string, strMCnt: string): string => {
    if (strYCnt === '' && strMCnt === '') return '';
    
    const nYcnt = parseInt(strYCnt) || 0;
    const nMCnt = parseInt(strMCnt) || 0;
    
    return String((nYcnt * 12) + nMCnt);
  };

  /**
   * AS-IS 시작일자 입력 데이터 년월일 합치기
   * 년과 월을 입력받아 YYYYMMDD 형식으로 변환 (일자는 항상 01)
   * @param {string} year - 년도
   * @param {string} month - 월
   * @returns {string} YYYYMMDD 형식의 시작일자
   */
  const packStrtDate = (year: string, month: string): string => {
    return year + month + '01';
  };

  /**
   * AS-IS 종료일자 입력 데이터 년월일 합치기
   * 년과 월을 입력받아 YYYYMMDD 형식으로 변환 (일자는 해당 월의 마지막 날)
   * @param {string} year - 년도
   * @param {string} month - 월
   * @returns {string} YYYYMMDD 형식의 종료일자
   */
  const packEndDate = (year: string, month: string): string => {
    const arrLastDay = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // 윤년일 경우
    const yearNum = parseInt(year);
    if (yearNum % 4 === 0 && (yearNum % 100 !== 0 || yearNum % 400 === 0)) {
      arrLastDay[2] = 29; // 윤년 2월
    }
    
    return year + month + String(arrLastDay[parseInt(month)]);
  };

  /**
   * AS-IS 경력 계산 로직
   * 프로필 리스트를 기반으로 입사전/입사후 경력을 계산
   * @param {string} kb - 계산 타입 ('ALL', 'Before', 'After')
   */
  const calculateCareer = (kb: string) => {
    if (!employeeData || !profileList.length) return;

    const strEntrYm = employeeData.ENTR_DT?.replace(/\//g, '').substring(0, 6) || '';
    
    let nBefCarrMcnt = 0; // 입사전 경력개월수
    let nAftCarrMcnt = 0; // 입사후 경력개월수
    
    const now = new Date();
    const nowYearMonth = now.getFullYear().toString() + 
      String(now.getMonth() + 1).padStart(2, '0');

    profileList.forEach(profile => {
      const strDevStrtYm = profile.STRT_YM?.replace(/\//g, '') || '';
      const strDevEndYm = (profile.END_YM?.replace(/\//g, '') || '') > nowYearMonth 
        ? nowYearMonth 
        : profile.END_YM?.replace(/\//g, '') || '';

      if (employeeData.OWN_OUTS_DIV === '1') {
        // 자사일 경우
        if (Number(strEntrYm) > Number(strDevStrtYm)) {
          // 입사전 경력
          nBefCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        } else {
          // 입사후 경력
          nAftCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        }
      } else {
        // 외주일 경우
        if (!profile.BSN_NO || profile.BSN_NO === '') {
          // 타사개발경력
          nBefCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        } else {
          // 자사개발경력
          nAftCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        }
      }
    });

    if (kb === 'ALL' || kb === 'Before') {
      prtEntrBefCarr(nBefCarrMcnt);
    } else {
      nBefCarrMcnt = Number(getCarrMCnt(String(profileCarrData.entrBefInYcnt), String(profileCarrData.entrBefInMcnt)));
    }
    
    if (kb === 'ALL' || kb === 'After') {
      prtEntrAftCarr(nAftCarrMcnt);
    } else {
      nAftCarrMcnt = Number(getCarrMCnt(String(profileCarrData.entrAftInYcnt), String(profileCarrData.entrAftInMcnt)));
    }

    prtCarrTotal(nBefCarrMcnt + nAftCarrMcnt);
  };

  /**
   * AS-IS 개월수 계산
   * 시작년월과 종료년월 사이의 개월수를 계산
   * @param {string} startYm - 시작년월 (YYYYMM 형식)
   * @param {string} endYm - 종료년월 (YYYYMM 형식)
   * @returns {number} 개월수
   */
  const getMonthCnt = (startYm: string, endYm: string): number => {
    if (!startYm || !endYm) return 0;
    
    const startYear = parseInt(startYm.substring(0, 4));
    const startMonth = parseInt(startYm.substring(4, 6));
    const endYear = parseInt(endYm.substring(0, 4));
    const endMonth = parseInt(endYm.substring(4, 6));
    
    return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  };

  /**
   * 개월수를 년과 개월로 변환하는 유틸리티 함수
   * @param {number} carrMcnt - 경력 개월수
   * @returns {{years: number, months: number}} 년과 개월
   */
  const convertMonthsToYearsAndMonths = (carrMcnt: number) => {
    const years = Math.floor(carrMcnt / 12);
    const months = carrMcnt - (years * 12);
    return { years, months };
  };

  /**
   * YYYY-MM 형식의 날짜에서 년과 월을 추출하는 유틸리티 함수
   * @param {string} startDate - 시작일자 (YYYY-MM 형식)
   * @param {string} endDate - 종료일자 (YYYY-MM 형식)
   * @returns {{strtYear: string, strtMonth: string, endYear: string, endMonth: string}} 년월 정보
   */
  const extractYearMonthFromDateRange = (startDate: string, endDate: string) => {
    const strtYear = startDate.substring(0, 4);
    const strtMonth = startDate.substring(5, 7);
    const endYear = endDate.substring(0, 4);
    const endMonth = endDate.substring(5, 7);
    return { strtYear, strtMonth, endYear, endMonth };
  };

  /**
   * AS-IS 입사전경력 화면 출력
   * 개월수를 년과 개월로 변환하여 상태에 저장
   * @param {number} carrMcnt - 경력 개월수
   */
  const prtEntrBefCarr = (carrMcnt: number) => {
    const { years, months } = convertMonthsToYearsAndMonths(carrMcnt);
    
    setProfileCarrData(prev => ({
      ...prev,
      entrBefInYcnt: years,
      entrBefInMcnt: months
    }));
  };

  /**
   * AS-IS 입사후경력 화면 출력
   * 개월수를 년과 개월로 변환하여 상태에 저장
   * @param {number} carrMcnt - 경력 개월수
   */
  const prtEntrAftCarr = (carrMcnt: number) => {
    const { years, months } = convertMonthsToYearsAndMonths(carrMcnt);
    
    setProfileCarrData(prev => ({
      ...prev,
      entrAftInYcnt: years,
      entrAftInMcnt: months
    }));
  };

  /**
   * AS-IS 경력합계 화면 출력
   * 개월수를 년과 개월로 변환하여 상태에 저장
   * @param {number} carrMcnt - 경력 개월수
   */
  const prtCarrTotal = (carrMcnt: number) => {
    const { years, months } = convertMonthsToYearsAndMonths(carrMcnt);
    
    setProfileCarrData(prev => ({
      ...prev,
      totCarrYcnt: years,
      totCarrMcnt: months
    }));
  };

  /**
   * AS-IS 프로필 중복 체크
   * 사업번호로 프로필 중복 등록 여부 확인
   * @param {string} bsnNo - 사업번호
   * @returns {boolean} 중복 여부
   */
  const checkProfileExisted = (bsnNo: string): boolean => {
    return profileList.some(profile => profile.BSN_NO === bsnNo);
  };

  /**
   * AS-IS 입력 필드 활성화/비활성화
   * AS-IS 로직:
   * - 시작일자, 종료일자, 담당업무: enabled에 따라 제어
   * - 프로젝트명, 고객사, 개발환경: 항상 활성화 (AS-IS에서 주석처리됨)
   * @param {boolean} enabled - 활성화 여부
   */
  const setEnabledInputItem = (enabled: boolean) => {
    setInputEnabled(enabled);
  };

  /**
   * AS-IS 개발환경 입력 팝업
   * 개발환경 선택 팝업을 열기
   */
  const handleDevEnvPopup = () => {
    setShowDevEnvPopup(true);
  };

  /**
   * AS-IS 경력 저장 기능 (간단한 알림으로 대체)
   * 경력 저장은 별도 팝업으로 구현 예정
   */
  const handleCareerSave = () => {
    showToast('경력 저장 기능은 별도 팝업으로 구현됩니다.', 'info');
  };

  /**
   * AS-IS DataGrid 번호 매기는 함수
   * AG-Grid에서 행 번호를 표시하기 위한 렌더러
   * @param {any} params - AG-Grid 파라미터
   * @returns {string} 행 번호
   */
  const setRowNum = (params: any) => {
    if (gridApiRef.current && params.node && params.node.rowIndex !== null && params.node.rowIndex !== undefined) {
      const rowNode = gridApiRef.current.getDisplayedRowAtIndex(params.node.rowIndex);
      if (rowNode) {
        const index = params.node.rowIndex + 1;
        return String(index);
      }
    }
    return '';
  };

  /**
   * 초기 데이터 로드
   * 공통코드 로드 및 권한 체크
   */
  const initializeData = async () => {
    try {
      // 공통코드는 항상 로드 (담당업무 콤보박스용)
      await loadCommonCodes();
      
      // 탭 모드인 경우 부모로부터 전달받은 사원 정보 사용
      if (isTabMode && parentEmpNo && parentEmpNm) {
        setSearchEmpNm(parentEmpNm);
        // 부모로부터 전달받은 사원 정보로 조회
        await searchEmployeeInfo('1', parentEmpNo, 'ALL');
      } else {
        // AS-IS와 동일한 초기 설정
        if (user?.userId) {
          setSearchEmpNm(user.name || '');
        }
      }
      
      // 권한 체크는 사원 검색 시에만 적용
      if (!isEnableSrchEmpAuthority()) {
        showToast('사원 조회 권한이 없습니다.', 'warning');
      }
    } catch (error) {
      console.error('초기화 중 오류:', error);
      showToast('초기화 중 오류가 발생했습니다.', 'error');
    }
  };

  /**
   * 공통코드 로드
   * AS-IS: COM_03_0101_S 프로시저 호출, 파라미터: I_LRG_CSF_CD (대분류코드)
   * 담당업무 콤보박스용 공통코드 조회
   */
  const loadCommonCodes = async () => {
    try {
      const result = await callApi('/api/common/search', {
        largeCategoryCode: '107'
      });
      
      // API 응답에 success 필드가 없으므로 data가 있으면 성공으로 처리
      if (result.data && Array.isArray(result.data)) {
        setCommonCodes(result.data);
      } else {
        console.error('공통코드 API 실패:', result);
      }
    } catch (error) {
      console.error('공통코드 조회 오류:', error);
    }
  };

  /**
   * 사원 정보 검색
   * AS-IS 로직에 따라 사원번호 또는 사원명으로 사원 정보 조회
   * @param {string} kb - 검색 타입 ('1': 사원번호, '2': 사원명)
   * @param {string} strEmp - 검색할 사원번호 또는 사원명
   * @param {string} strOutsOwn - 자사/외주 구분 ('ALL', '1': 자사, '2': 외주)
   */
  const searchEmployeeInfo = async (kb: string, strEmp: string, strOutsOwn: string) => {
    try {
      console.log('[PSM0050M00] searchEmployeeInfo called:', { kb, strEmp, strOutsOwn });
      setIsLoading(true);
      const result = await callApi('/api/psm/employee/search-com', {
        empNo: kb === '1' ? strEmp : '',
        empNm: kb === '2' ? strEmp : '',
        ownOutsDiv: strOutsOwn,
        retirYn: 'Y'
      });
      
      console.log('[PSM0050M00] searchEmployeeInfo result:', result);
      
      if (result.success && result.data && result.data.length > 0) {
        // AS-IS empBscInfSeltHandler 로직과 동일
        if (result.data.length > 1) {
        // 2건 이상일 경우 사원 선택 팝업 호출 (AS-IS: COM_02_0410)
        // TO-BE: COMZ080P00 팝업 호출
        openEmployeeSearchPopup(kb, strEmp, strOutsOwn, result.data);
        return;
        } else {
          // 한 건일 경우 사원 정보 설정
          console.log('[PSM0050M00] Employee found:', result.data[0]);
          const employee = result.data[0];
          setEmployeeData(employee);
          
          // AS-IS와 동일하게 프로필 내역 조회
          await loadProfileList(employee.EMP_NO);
          await loadProfileCarrData(employee.EMP_NO);
          
          // 사원 조회 시 프로필 입력 폼 초기화 (AS-IS: onClickBtnNew)
          handleNew();
        }
      } else {
        console.log('[PSM0050M00] No employee found');
        showToast('사원 정보를 찾을 수 없습니다.', 'warning');
      }
    } catch (error) {
      console.error('사원 정보 조회 오류:', error);
      showToast('사원 정보 조회 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 프로필 리스트 로드
   * 사원번호로 프로필 목록 조회
   * @param {string} empNo - 사원번호
   */
  const loadProfileList = async (empNo: string) => {
    try {
      const result = await callApi('/api/psm/profile/list', {
        empNo: empNo,
        userId: user?.userId || 'system'
      });
      
      if (result.success) {
        // result.data가 배열인지 확인하고 안전하게 설정
        const profileData = Array.isArray(result.data) ? result.data : [];
        setProfileList(profileData);
        
        // 데이터 로드 후 컬럼 크기 조정
        setTimeout(() => {
          if (gridApiRef.current) {
            gridApiRef.current.sizeColumnsToFit();
          }
        }, 200);
      }
    } catch (error) {
      console.error('프로필 리스트 조회 오류:', error);
      showToast('프로필 리스트 조회 중 오류가 발생했습니다.', 'error');
    }
  };

  /**
   * 프로필 경력 데이터 로드
   * 사원번호로 경력 계산 데이터 조회
   * @param {string} empNo - 사원번호
   */
  const loadProfileCarrData = async (empNo: string) => {
    try {
      const result = await callApi('/api/psm/profile/carr-calc', {
        empNo: empNo,
        userId: user?.userId || 'system'
      });
      
      if (result.success && result.data && result.data.length > 0) {
        // AS-IS fnSelectProfileCarr 함수의 aftCarrCalcHandler 로직
        const rec = result.data[0]; // 배열의 첫 번째 요소 사용
        
        if (!rec) {
          // 프로필 경력 출력 항목 Clear
          clearProfileCarr();
          return;
        }

        // 학력기준 경력(입사전/입사후)과 등급
        const befMCnt = Number(rec.BEF_M_CNT || 0);
        const aftMCnt = Number(rec.AFT_M_CNT || 0);
        const totMCnt = befMCnt + aftMCnt;
        
        setProfileCarrData({
          calcStadDt: rec.CALC_STAD_DT || '',
          // 학력기준
          entrBefInYcnt: Math.floor(befMCnt / 12),
          entrBefInMcnt: befMCnt - (Math.floor(befMCnt / 12) * 12),
          entrAftInYcnt: Math.floor(aftMCnt / 12),
          entrAftInMcnt: aftMCnt - (Math.floor(aftMCnt / 12) * 12),
          totCarrYcnt: Math.floor(totMCnt / 12),
          totCarrMcnt: totMCnt - (Math.floor(totMCnt / 12) * 12),
          adbgTcnGrdNm: rec.TCN_GRD_NM || '',
          adbgTcnGrdCd: rec.TCN_GRD || '',
          // 기술자격기준
          ctqlEntrBefInYcnt: Math.floor(Number(rec.BEF_CTQL_M_CNT || 0) / 12),
          ctqlEntrBefInMcnt: Number(rec.BEF_CTQL_M_CNT || 0) - (Math.floor(Number(rec.BEF_CTQL_M_CNT || 0) / 12) * 12),
          ctqlEntrAftInYcnt: Math.floor(Number(rec.AFT_CTQL_M_CNT || 0) / 12),
          ctqlEntrAftInMcnt: Number(rec.AFT_CTQL_M_CNT || 0) - (Math.floor(Number(rec.AFT_CTQL_M_CNT || 0) / 12) * 12),
          ctqlTotCarrYcnt: Math.floor((Number(rec.BEF_CTQL_M_CNT || 0) + Number(rec.AFT_CTQL_M_CNT || 0)) / 12),
          ctqlTotCarrMcnt: (Number(rec.BEF_CTQL_M_CNT || 0) + Number(rec.AFT_CTQL_M_CNT || 0)) - (Math.floor((Number(rec.BEF_CTQL_M_CNT || 0) + Number(rec.AFT_CTQL_M_CNT || 0)) / 12) * 12),
          ctqlTcnGrdNm: rec.CTQL_TCN_GRD_NM || '',
          ctqlTcnGrdCd: rec.CTQL_TCN_GRD || ''
        });
      }
    } catch (error) {
      console.error('프로필 경력 계산 데이터 조회 오류:', error);
    }
  };

  /**
   * 프로필 경력 데이터 초기화
   * 경력 계산 데이터를 기본값으로 초기화
   */
  const clearProfileCarr = () => {
    setProfileCarrData({
      calcStadDt: '',
      entrBefInYcnt: 0,
      entrBefInMcnt: 0,
      entrAftInYcnt: 0,
      entrAftInMcnt: 0,
      totCarrYcnt: 0,
      totCarrMcnt: 0,
      adbgTcnGrdNm: '',
      adbgTcnGrdCd: '',
      ctqlEntrBefInYcnt: 0,
      ctqlEntrBefInMcnt: 0,
      ctqlEntrAftInYcnt: 0,
      ctqlEntrAftInMcnt: 0,
      ctqlTotCarrYcnt: 0,
      ctqlTotCarrMcnt: 0,
      ctqlTcnGrdNm: '',
      ctqlTcnGrdCd: ''
    });
  };

  /**
   * 사원 검색 버튼 클릭 핸들러
   * 사원명으로 사원 검색 실행
   */
  const handleEmpSearch = () => {
    if (!searchEmpNm.trim()) {
      showToast('사원명을 입력해 주십시요.', 'warning');
      return;
    }
    searchEmployeeInfo('2', searchEmpNm.trim(), 'ALL');
  };

  /**
   * 조회 버튼 클릭 핸들러
   * 현재 선택된 사원의 프로필과 경력 데이터를 새로고침
   */
  const handleRefreshData = () => {
    if (!employeeData?.EMP_NO.trim()) {
      showToast('사원명을 입력해 주십시요.', 'warning');
      return;
    } else {
      loadProfileList(employeeData.EMP_NO);
      loadProfileCarrData(employeeData.EMP_NO);
    }
  };

  /**
   * AS-IS DblClick_COM_02_0410 함수와 동일한 기능
   * 사원 선택 팝업에서 선택된 사원 정보 처리
   * @param {string} empNo - 선택된 사원번호
   * @param {string} empNm - 선택된 사원명
   * @param {string} ownOutsDiv - 자사/외주 구분
   */
  /**
   * COMZ080P00 팝업 열기 함수
   */
  const openEmployeeSearchPopup = (searchType: string, searchValue: string, ownOutsDiv: string, empList: any[]) => {
    const width = 1000;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      `/popup/com/COMZ080P00`,
      `COMZ080P00_popup`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (popup) {
      setPopupWindow(popup);
      
      // 팝업이 로드된 후 데이터 전송
      popup.onload = () => {
        setTimeout(() => {
          sendDataToEmployeePopup(popup, searchType, searchValue, ownOutsDiv, empList);
        }, 500);
      };
    }
  };

  /**
   * 팝업에 데이터 전송
   */
  const sendDataToEmployeePopup = (popup: Window, searchType: string, searchValue: string, ownOutsDiv: string, empList: any[]) => {
    const popupData = {
      empNm: searchType === '2' ? searchValue : '',
      ownOutDiv: ownOutsDiv,
      empList: empList
    };
    
    popup.postMessage({
      type: 'CHOICE_EMP_INIT',
      data: popupData
    }, '*');
  };

  /**
   * 메시지 수신 처리
   */
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'EMP_SELECTED') {
        const selectedEmp = event.data.data;
        handleEmployeeSelected(selectedEmp.empNo, selectedEmp.empNm, selectedEmp.ownOutsDiv);
        
        // 팝업 닫기
        if (popupWindow) {
          popupWindow.close();
          setPopupWindow(null);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [popupWindow]);

  const handleEmployeeSelected = (empNo: string, empNm: string, ownOutsDiv: string) => {
    setEmployeeData({ EMP_NO: empNo, EMP_NM: empNm, OWN_OUTS_DIV: ownOutsDiv } as EmployeeData);
    setSearchEmpNm(empNm);
    
    // AS-IS와 동일하게 프로필 내역 조회
    loadProfileList(empNo);
    loadProfileCarrData(empNo);
    
    // 사원 조회 시 프로필 입력 폼 초기화 (AS-IS: onClickBtnNew)
    handleNew();
  };

  /**
   * 프로필 검색 버튼 클릭 핸들러
   * 현재 선택된 사원의 프로필 목록 새로고침
   */
  const handleProfileSearch = () => {
    if (!employeeData) {
      showToast('먼저 사원을 검색해주세요.', 'warning');
      return;
    }
    loadProfileList(employeeData.EMP_NO);
  };

  /**
   * 프로필 엑셀 다운로드 핸들러
   * CSV 형태로 데이터 다운로드 (Community 버전 대응)
   */
  const handleProfileExcel = () => {
    if (!profileList || profileList.length === 0) {
      showToast('다운로드할 프로필 데이터가 없습니다.', 'warning');
      return;
    }

    try {
      // CSV 형태로 데이터 내보내기
      const headers = ['프로젝트명', '시작년월', '종료년월', '개월수', '고객사', '담당업무', '개발환경', '사업번호', '등록일', '등록자', '비고'];
      const csvData = profileList.map(profile => [
        profile.PRJT_NM || '',
        profile.STRT_YM || '',
        profile.END_YM || '',
        profile.IN_MCNT || '',
        profile.MMBR_CO || '',
        profile.CHRG_WRK_NM || '',
        profile.DVLP_ENVR || '',
        profile.BSN_NO || '',
        profile.REG_DT || '',
        profile.CHNGR_NM || '',
        profile.RMK || ''
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${employeeData?.EMP_NM || ''}_프로필_내역.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('CSV 다운로드가 완료되었습니다.', 'info');
    } catch (error) {
      console.error('CSV 다운로드 오류:', error);
      showToast('CSV 다운로드 중 오류가 발생했습니다.', 'error');
    }
  };

  /**
   * 프로필 등록 팝업 핸들러
   */
  const handleProfileRegist = () => {
    if (isTabMode && employeeData?.EMP_NO) {
      showToast('개발중입니다.', 'error');
      // 탭 모드에서는 COM0000M00의 전역 handleMenuClick 함수를 호출
      // const globalHandleMenuClick = (window as any).handleMenuClick;
      // if (globalHandleMenuClick && typeof globalHandleMenuClick === 'function') {
      //   // 사원번호를 파라미터로 전달
      //   globalHandleMenuClick('PSM0040', { 
      //     empNo: employeeData.EMP_NO,
      //     empNm: employeeData.EMP_NM 
      //   });
      // } else {
      //   showToast('메뉴 시스템에 연결할 수 없습니다.', 'error');
      // }
    }
  };

  /**
   * 자사/외주 구분에 따른 경력 라벨 반환
   * AS-IS: 자사(1)면 "입사전/입사후 경력", 외주(2)면 "타사/자사 경력"
   * @param {string} ownOutsDiv - 자사/외주 구분 ('1': 자사, '2': 외주)
   * @param {string} type - 라벨 타입 ('before' | 'after')
   * @returns {string} 경력 라벨
   */
  const getCareerLabel = (ownOutsDiv: string, type: 'before' | 'after'): string => {
    if (ownOutsDiv === '1') {
      // 자사
      return type === 'before' ? '입사전 경력' : '입사후 경력';
    } else {
      // 외주
      return type === 'before' ? '타사 경력' : '자사 경력';
    }
  };

  /**
   * 투입내역 불러오기 핸들러
   * 투입인력현황(BSN0660P00) 화면 개발 중
   */
  const handleLoadProjectInput = () => {
    showToast('투입인력현황(BSN0660P00) 화면 개발중입니다.', 'info');
  };

  /**
   * 프로필 더블클릭 핸들러
   * 프로필 목록에서 항목을 더블클릭하여 수정 모드로 전환
   * @param {number} index - 프로필 목록 인덱스
   */
  const handleProfileDoubleClick = (index: number) => {
    if (index < 0 || index >= profileList.length) return;
    
    const profile = profileList[index];
    
    // AS-IS 로직: 날짜를 년/월로 분리
    const strtDt = profile.STRT_DT || '';
    const endDt = profile.END_DT || '';
    
    // YYYYMMDD 형식을 YYYY-MM 형식으로 변환
    const formatDateToMonth = (dateStr: string): string => {
      if (!dateStr || dateStr.length < 6) return '';
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      return `${year}-${month}`;
    };
    
    setProfileForm({
      bsnNo: profile.BSN_NO || '',
      seqNo: profile.SEQ_NO || '',
      strtYear: '',
      strtMonth: '',
      endYear: '',
      endMonth: '',
      prjtNm: profile.PRJT_NM || '',
      mmbrCo: profile.MMBR_CO || '',
      delpEnvr: profile.DVLP_ENVR || '',
      roleNm: profile.ROLE_DIV_NM || '',
      chrgWrk: profile.CHRG_WRK || '',
      taskNm: profile.CHRG_WRK_NM || '',
      rmk: profile.RMK || '',
      strtDate: formatDateToMonth(strtDt), // YYYY-MM 형식으로 변환
      endDate: formatDateToMonth(endDt),   // YYYY-MM 형식으로 변환
      bsnNm: profile.BSN_NO || '',
      custNm: profile.MMBR_CO || ''
    });
    
    setNewFlag(false);
    
    // AS-IS 로직: 실투입등록내역으로 등록된 프로필인지 체크
    if (!profile.BSN_NO || profile.BSN_NO === '') {
      // 모든 입력 항목 입력 가능
      setEnabledInputItem(true);
    } else {
      // 개발환경만 빼고 나머지는 입력 불가능
      setEnabledInputItem(false);
    }
  };

  /**
   * 신규 버튼 클릭 핸들러
   * 프로필 입력 폼을 초기화하고 신규 등록 모드로 전환
   */
  const handleNew = () => {
    setProfileForm({
      bsnNo: '',
      seqNo: '',
      strtYear: '',
      strtMonth: '',
      endYear: '',
      endMonth: '',
      prjtNm: '',
      mmbrCo: '',
      delpEnvr: '',
      roleNm: '',
      chrgWrk: '',
      taskNm: '',
      rmk: '',
      strtDate: '',
      endDate: '',
      bsnNm: '',
      custNm: ''
    });
    setNewFlag(true);
    // AS-IS: setEnabledInputItem(true) - 입력항목 활성화
    setInputEnabled(true);
  };

  /**
   * 저장 버튼 클릭 핸들러
   * 저장 확인 다이얼로그 표시
   */
  const handleSave = () => {
    if (!employeeData) {
      showToast('먼저 사원을 검색해주세요.', 'warning');
      return;
    }

    if (!validateInputData()) {
      return;
    }

    // AS-IS 중복 체크
    if (newFlag && checkProfileExisted(profileForm.bsnNo)) {
      showToast('이미 등록된 프로필입니다.', 'warning');
      return;
    }

    // 저장 확인 다이얼로그 표시
    setShowSaveConfirm(true);
  };

  /**
   * 저장 확인 다이얼로그 확인 핸들러
   * 프로필 등록 또는 수정 API 호출
   */
  const handleSaveConfirm = async () => {
    setShowSaveConfirm(false);

    if (!employeeData) {
      showToast('사원 정보가 없습니다.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const url = newFlag ? '/api/psm/profile/insert' : '/api/psm/profile/update';
      
      // strtDate와 endDate에서 년월 추출 (YYYY-MM 형식에서)
      if (!profileForm.strtDate || !profileForm.endDate) {
        showToast('시작일자와 종료일자를 모두 입력해주세요.', 'error');
        return;
      }
      
      const { strtYear, strtMonth, endYear, endMonth } = extractYearMonthFromDateRange(
        profileForm.strtDate, 
        profileForm.endDate
      );

      // 공통 요청 데이터 구성
      const baseRequestData = {
        empNo: employeeData.EMP_NO,
        bsnNo: profileForm.bsnNo,
        strtDate: packStrtDate(strtYear, strtMonth),
        endDate: packEndDate(endYear, endMonth),
        prjtNm: profileForm.prjtNm,
        mmbrCo: profileForm.mmbrCo,
        delpEnvr: profileForm.delpEnvr,
        roleNm: profileForm.roleNm,
        taskNm: profileForm.chrgWrk,
        rmk: profileForm.rmk,
        userId: user?.userId || 'system'
      };

      // Update 시에만 seqNo 추가
      const requestData = newFlag ? baseRequestData : {
        ...baseRequestData,
        seqNo: String(profileForm.seqNo)
      };

      const result = await callApi(url, requestData);
      
      if (result.success) {
        showToast(newFlag ? '프로필이 등록되었습니다.' : '프로필이 수정되었습니다.', 'info');
        await loadProfileList(employeeData!.EMP_NO);
        handleNew();
      } else {
        showToast(result.message || '저장 중 오류가 발생했습니다.', 'error');
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      showToast('프로필 저장 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 삭제 버튼 클릭 핸들러
   * 삭제 확인 다이얼로그 표시
   */
  const handleDelete = async () => {
    if (!employeeData || !profileForm.seqNo) {
      showToast('삭제할 프로필을 선택해주세요.', 'warning');
      return;
    }

    const confirmMessage = profileForm.bsnNo 
      ? '프로젝트관리에서 등록된 투입현황 내역의 프로필 입니다. 그래도 삭제하시겠습니까?'
      : '선택한 프로필을 삭제하시겠습니까?';

    setDeleteConfirmMessage(confirmMessage);
    setShowDeleteConfirm(true);
  };

  /**
   * 삭제 확인 다이얼로그 확인 핸들러
   * 프로필 삭제 API 호출
   */
  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);

    if (!employeeData) {
      showToast('사원 정보가 없습니다.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const result = await callApi('/api/psm/profile/delete', {
        empNo: employeeData.EMP_NO,
        seqNo: String(profileForm.seqNo),
        userId: user?.userId || 'system'
      });
      
      if (result.success) {
        showToast('프로필이 삭제되었습니다.', 'info');
        await loadProfileList(employeeData.EMP_NO);
        handleNew();
      } else {
        showToast(result.message || '삭제 중 오류가 발생했습니다.', 'error');
      }
    } catch (error) {
      console.error('프로필 삭제 오류:', error);
      showToast('프로필 삭제 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 폼 필드 변경 핸들러
   * 프로필 입력 폼의 필드 값 변경 처리
   * @param {keyof ProfileFormData} field - 변경할 필드명
   * @param {string} value - 변경할 값
   */
  const handleFormChange = (field: keyof ProfileFormData, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  /**
   * AS-IS 경력 변경 시 자동 계산
   * 프로필 변경 시 경력을 자동으로 재계산
   */
  const handleCareerChange = () => {
    calculateCareer('ALL');
  };

  useEffect(() => {
    initializeData();
  }, []);

  // 탭 모드에서 부모 props 변경 시 재조회
  useEffect(() => {
    console.log('[PSM0050M00] useEffect triggered:', { isTabMode, parentEmpNo, parentEmpNm });
    if (parentEmpNo && parentEmpNo.trim() !== '') {
      console.log('[PSM0050M00] Loading employee info for:', parentEmpNo);
      setSearchEmpNm(parentEmpNm || '');
      // 자동으로 사원 정보 조회 및 프로필 조회까지 수행
      searchEmployeeInfo('1', parentEmpNo, 'ALL');
    }
  }, [isTabMode, parentEmpNo, parentEmpNm]);

  const columnDefs: ColDef[] = [
    {
      headerName: 'No',
      field: 'rowNum',
      width: 70,
      cellRenderer: setRowNum
    },
    { headerName: '프로젝트명', field: 'PRJT_NM', width: 250 },
    { headerName: '시작년월', field: 'STRT_YM', width: 100 },
    { headerName: '종료년월', field: 'END_YM', width: 100 },
    { headerName: '개월수', field: 'IN_MCNT', width: 120 },
    { headerName: '고객사', field: 'MMBR_CO', width: 150 },
    { headerName: '담당업무', field: 'CHRG_WRK_NM', width: 100 },
    { headerName: '개발환경', field: 'DVLP_ENVR', width: 250 },
    { headerName: '사업번호', field: 'BSN_NO', width: 150 },
    { headerName: '등록일', field: 'REG_DT', width: 130 },
    { headerName: '등록자', field: 'CHNGR_NM', width: 100 },
    { headerName: '비고', field: 'RMK', width: 400 }
  ];

  /**
   * AS-IS CommMethods.setDateFormat 함수와 동일한 기능
   * YYYYMMDD 형식을 YYYY/MM/DD 형식으로 변환
   * @param {string} dateStr - YYYYMMDD 형식의 날짜 문자열
   * @returns {string} YYYY/MM/DD 형식의 날짜 문자열
   */
  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length < 8) return '';
    
    // YYYYMMDD 형식을 YYYY/MM/DD 형식으로 변환
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return `${year}/${month}/${day}`;
  };

  /**
   * AG-Grid 준비 완료 핸들러
   * 그리드 API 참조 저장 및 컬럼 크기 자동 조정
   * @param {GridReadyEvent} params - AG-Grid 준비 완료 이벤트 파라미터
   */
  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
  };

  // 윈도우 리사이즈 시에도 컬럼 크기 조정
  useEffect(() => {
    const handleResize = () => {
      if (gridApiRef.current) {
        gridApiRef.current.sizeColumnsToFit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={isTabMode ? "" : "mdi"}>
      {/* 조회 영역 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            {/* 1행 */}
            <tr className="search-tr">
              <th className="search-th">사원명</th>
              <td className="search-td" colSpan={3}>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <input 
                      type="text" 
                      data-field="searchEmpNm"
                      className={`input-base input-default !w-[80px] ${isTabMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                      value={searchEmpNm}
                      onChange={(e) => setSearchEmpNm(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleEmpSearch();
                        }
                      }}
                      placeholder="사원명"
                      disabled={isTabMode}
                    />
                    <button 
                      type="button"
                      onClick={handleEmpSearch}
                      className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded border border-blue-500 hover:border-blue-600 transition-colors shadow-sm disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
                      title="사원 검색"
                      disabled={isTabMode || !isEnableSrchEmpAuthority()}
                    >
                      <img 
                        src="/icon_search_bk.svg" 
                        alt="검색" 
                        className="w-4 h-4 filter brightness-0 invert"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <span className="hidden text-sm font-medium text-white">검색</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <input 
                      type="text" 
                      className="input-base input-default !w-[100px]" 
                      value={employeeData?.EMP_NO || ''}
                      readOnly
                    />
                    <input 
                      type="text" 
                      className="input-base input-default" 
                      value={employeeData?.EMP_NM || ''}
                      readOnly
                    />
                  </div>
                </div>
              </td>

              <th className="search-th">소속</th>
              <td className="search-td" colSpan={3}>
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={(() => {
                    const coNm = employeeData?.CO_NM || '';
                    const hqDivNm = employeeData?.HQ_DIV_NM || '';
                    const deptDivNm = employeeData?.DEPT_DIV_NM || '';
                    
                    const parts = [coNm, hqDivNm, deptDivNm].filter(part => part !== '');
                    return parts.join(' > ');
                  })()}
                  readOnly
                />
              </td>

              <th className="search-th">직책</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.DUTY_CD_NM || ''}
                  readOnly
                />
              </td>

              <th className="search-th">근무상태</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.WKG_ST_DIV_NM || ''}
                  readOnly
                />
              </td>
            </tr>

            {/* 2행 */}
            <tr className="search-tr">

              <th className="search-th">입사일자</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.ENTR_DT || ''}
                  readOnly
                />
              </td>

              <th className="search-th">퇴사일자</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.RETIR_DT || ''}
                  readOnly
                />
              </td>

              <th className="search-th">학력/전공</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={(() => {
                    const lastSchl = employeeData?.LAST_SCHL || '';
                    const majr = employeeData?.MAJR || '';
                    const lastGradDt = formatDate(employeeData?.LAST_GRAD_DT || '');
                    
                    const parts = [lastSchl, majr, lastGradDt].filter(part => part !== '');
                    return parts.join(' / ');
                  })()}
                  readOnly
                />
              </td>

              <th className="search-th">자격증/취득일</th>
              <td className="search-td">
                <input
                  type="text"
                  className="input-base input-default w-full"
                  value={(() => {
                    const ctqlCdNm = employeeData?.CTQL_CD_NM || '';
                    const ctqlPurDt = formatDate(employeeData?.CTQL_PUR_DT || '');
                    
                    const parts = [ctqlCdNm, ctqlPurDt].filter(part => part !== '');
                    return parts.join(' / ');
                  })()}
                  readOnly
                />
              </td>

              <th className="search-th">경력</th>
              <td className="search-td">
                <div className="flex items-center gap-1">
                  <input 
                    type="text" 
                    className="input-base input-default !w-[50px] text-right" 
                    value={Math.floor((Number(employeeData?.CARR_MCNT) || 0) / 12)}
                    readOnly
                  />
                  <span className="m-0">년</span>
                  <input 
                    type="text" 
                    className="input-base input-default !w-[50px] text-right" 
                    value={(Number(employeeData?.CARR_MCNT) || 0) % 12}
                    readOnly
                  />
                  <span className="m-0">개월</span>
                </div>
              </td>

              <th className="search-th">등급</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.TCN_GRD_NM || ''}
                  readOnly
                />
              </td>

              <td className="text-right">
                <button 
                  className="btn-base btn-search"
                  onClick={handleRefreshData}
                  disabled={!isEnableSrchEmpAuthority()}
                >
                  조회
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 개발 프로필 내역 AG-Grid */}
      <div className="gridbox-div mb-4">
        <div className="grid-header">
          <div className="flex justify-between items-center w-full">
            <h3>개발 프로필 내역</h3>
            <div className="flex gap-2">
              <button 
                type="button" 
                className="btn-base btn-excel"
                onClick={handleProfileExcel}
              >
                CSV
              </button>
              {/* 탭 모드에서만 프로필 등록 버튼 표시 */}
              {isTabMode && (
                <button 
                  type="button" 
                  className="btn-base btn-act"
                  onClick={handleProfileRegist}
                >
                  프로필등록
                </button>
              )}
            </div>
          </div>
        </div>
                  <div className="ag-theme-alpine" style={{ height: isTabMode ? '238px' : '400px', width: '100%' }}>
            <AgGridReact
              rowData={profileList}
              columnDefs={columnDefs}
              onGridReady={onGridReady}
              onRowDoubleClicked={(event) => {
                if (event.rowIndex !== null && event.rowIndex !== undefined) {
                  handleProfileDoubleClick(event.rowIndex);
                }
              }}
              rowSelection="single"
              suppressRowClickSelection={true}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50]}
              domLayout="normal"
              enableRangeSelection={true}
              suppressColumnVirtualisation={true}
            />
          </div>
      </div>

      {/* 테이블 영역 */}
      <div className="box-wrap">
        <div className="tit_area">
          <h3>
            프로필 경력
            <span className="ml-2 text-sm text-gray-500 font-normal">
              (기준일: {profileCarrData?.calcStadDt ? profileCarrData.calcStadDt : ''})
            </span>
          </h3>
        </div>
        
        {/* 테이블 */}
        <table className="form-table w-full mb-4">
          <tbody>
            {/* 1행: 학력 기준 */}
            <tr className="form-tr">
              <th className="form-th w-[130px]">학력기준</th>
              <td className="form-td w-[250px]">
                {getCareerLabel(employeeData?.OWN_OUTS_DIV || '1', 'before')}
                <input 
                  type="text" 
                  className="input-base input-default !w-[50px] text-center mx-1" 
                  value={profileCarrData?.entrBefInYcnt ?? 0}
                  readOnly
                />년
                <input 
                  type="text" 
                  className="input-base input-default !w-[50px] text-center mx-1" 
                  value={profileCarrData?.entrBefInMcnt ?? 0}
                  readOnly
                />월
              </td>
              <td className="form-td w-[250px]">
                {getCareerLabel(employeeData?.OWN_OUTS_DIV || '1', 'after')}
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.entrAftInYcnt ?? 0}
                   readOnly
                 />년
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.entrAftInMcnt ?? 0}
                   readOnly
                 />월
               </td>
               <td className="form-td">
                 합계
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.totCarrYcnt ?? 0}
                   readOnly
                 />년
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.totCarrMcnt ?? 0}
                   readOnly
                 />월
                 <span className="ml-2 font-bold text-blue-600">
                   {profileCarrData?.adbgTcnGrdNm || ''}
                 </span>
               </td>
             </tr>
             {/* 2행: 기술자격 기준 */}
             <tr className="form-tr">
               <th className="form-th w-[130px]">기술자격기준</th>
               <td className="form-td">
                 {getCareerLabel(employeeData?.OWN_OUTS_DIV || '1', 'before')}
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlEntrBefInYcnt ?? 0}
                   readOnly
                 />년
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlEntrBefInMcnt ?? 0}
                   readOnly
                 />월
               </td>
               <td className="form-td">
                 {getCareerLabel(employeeData?.OWN_OUTS_DIV || '1', 'after')}
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlEntrAftInYcnt ?? 0}
                   readOnly
                 />년
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlEntrAftInMcnt ?? 0}
                   readOnly
                 />월
               </td>
               <td className="form-td">
                 합계
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlTotCarrYcnt ?? 0}
                   readOnly
                 />년
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlTotCarrMcnt ?? 0}
                   readOnly
                 />월
                 <span className="ml-2 font-bold text-blue-600">
                   {profileCarrData?.ctqlTcnGrdNm || ''}
                 </span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 탭 모드가 아닐 때만 프로필 작성 영역 표시 */}
        {!isTabMode && (
          <div className="tit_area">
            <h3>프로필 작성</h3>
            <div>
              <button
                className="btn-base btn-act"
                onClick={handleLoadProjectInput}
              >
                투입내역 불러오기
              </button>
            </div>
          </div>
        )}

        {/* 탭 모드가 아닐 때만 프로필 입력 폼 표시 */}
        {!isTabMode && (
          <div className="gridbox-div mb-4">
          <div className="grid-scroll-wrap">
            <table className="grid-table">
              <thead>
                <tr>
                  <th className="grid-th">시작일자</th>
                  <th className="grid-th">종료일자</th>
                  <th className="grid-th">프로젝트명</th>
                  <th className="grid-th">고객사</th>
                  <th className="grid-th">담당업무</th>
                                     <th className="grid-th flex justify-between items-center">개발환경/DBMS/언어<button type="button" className="btn-base btn-etc" onClick={handleDevEnvPopup}>선택</button></th>
                </tr>
              </thead>
              <tbody>
                <tr className="grid-tr even:bg-[#F9FCFF] hover:bg-blue-50">
                  <td className="grid-td">
                    <input 
                      ref={strtDateRef}
                      type="month" 
                      data-field="strtDate"
                      className="input-base input-calender w-full"
                      value={profileForm.strtDate}
                      onChange={(e) => handleFormChange('strtDate', e.target.value)}
                      disabled={!inputEnabled}
                    />
                  </td>
                  <td className="grid-td">
                    <input 
                      ref={endDateRef}
                      type="month" 
                      data-field="endDate"
                      className="input-base input-calender w-full"
                      value={profileForm.endDate}
                      onChange={(e) => handleFormChange('endDate', e.target.value)}
                      disabled={!inputEnabled}
                    />
                  </td>
                  <td className="grid-td">
                    <input 
                      ref={prjtNmRef}
                      type="text" 
                      data-field="prjtNm"
                      className="input-base input-default w-full"
                      value={profileForm.prjtNm}
                      onChange={(e) => handleFormChange('prjtNm', e.target.value)}
                      maxLength={333}
                    />
                  </td>
                  <td className="grid-td">
                    <input 
                      ref={mmbrCoRef}
                      type="text" 
                      data-field="mmbrCo"
                      className="input-base input-default w-full"
                      value={profileForm.mmbrCo}
                      onChange={(e) => handleFormChange('mmbrCo', e.target.value)}
                      maxLength={166}
                    />
                  </td>
                  <td className="grid-td">
                    <select 
                      ref={chrgWrkRef}
                      data-field="chrgWrk"
                      className="input-base input-default w-full"
                      value={profileForm.chrgWrk}
                      onChange={(e) => handleFormChange('chrgWrk', e.target.value)}
                      disabled={!inputEnabled}
                    >
                      <option value="">선택하세요</option>
                      {commonCodes.map(code => (
                        <option key={code.codeId} value={code.codeId}>
                          {code.codeNm}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="grid-td">
                    <input 
                      ref={delpEnvrRef}
                      type="text" 
                      data-field="delpEnvr"
                      className="input-base input-default w-full"
                      value={profileForm.delpEnvr}
                      onChange={(e) => handleFormChange('delpEnvr', e.target.value)}
                      maxLength={166}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>)}

        {/* 탭 모드가 아닐 때만 프로필 입력 폼 표시 */}
        {!isTabMode && (
          <div className="flex justify-end gap-2 mt-2">
            <button 
              className="btn-base btn-delete"
              onClick={handleDelete}
              disabled={!profileForm.seqNo}
            >
              삭제
            </button>
            <button 
              className="btn-base btn-etc"
              onClick={handleNew}
            >
              신규
            </button>
            <button 
              className="btn-base btn-act"
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        )}
      </div>



      {showDevEnvPopup && (
        <PSM0060M00
          onConfirm={(data) => {
            // AS-IS 로직: 선택된 항목들을 쉼표로 구분하여 연결
            let strDelpEnvr = "";
            if (Array.isArray(data)) {
              for (let i = 0; i < data.length; i++) {
                if (data[i] !== "") {
                  if (strDelpEnvr === "") {
                    strDelpEnvr = data[i];
                  } else {
                    strDelpEnvr += ", " + data[i];
                  }
                }
              }
            } else {
              strDelpEnvr = data;
            }
            setProfileForm(prev => ({ ...prev, delpEnvr: strDelpEnvr }));
            setShowDevEnvPopup(false);
          }}
          onClose={() => setShowDevEnvPopup(false)}
        />
      )}



      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isVisible={showDeleteConfirm}
        type="warning"
        message={deleteConfirmMessage}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* 저장 확인 다이얼로그 */}
      <ConfirmDialog
        isVisible={showSaveConfirm}
        type="info"
        message={newFlag ? '프로필을 등록하시겠습니까?' : '프로필을 수정하시겠습니까?'}
        onConfirm={handleSaveConfirm}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </div>
  );
};

export default PSM0050M00;
