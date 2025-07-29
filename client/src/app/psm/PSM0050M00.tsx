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
 * ?�원 기본 ?�보 ?�이???�터?�이??
 * 
 * AS-IS PSM_01_0101_S ?�로?��??�서 반환?�는 ?�원 ?�보?� ?�일??구조
 * 
 * @property {string} EMP_NO - ?�원번호
 * @property {string} OWN_OUTS_DIV - ?��?/?�주 구분 (1: ?��?, 2: ?�주)
 * @property {string} OWN_OUTS_NM - ?��?/?�주 구분�?
 * @property {string} EMP_NM - ?�원�?
 * @property {string} ENTR_DT - ?�사??(YYYYMMDD)
 * @property {string} RETIR_DT - ?�사??(YYYYMMDD)
 * @property {string} PRJ_YN - ?�로?�트 참여 ?��? (Y/N)
 * @property {string} BSN_NO - ?�업번호
 * @property {string} BSN_NM - ?�업�?
 * @property {string} DEV_NM - 개발�?
 * @property {string} CO_CD - ?�사코드
 * @property {string} CO_NM - ?�사�?
 * @property {string} EXEC_IN_STRT_DT - ?�행�??�작??
 * @property {string} EXEC_IN_END_DT - ?�행�?종료??
 * @property {string} CHRG_WRK - ?�당?�무
 * @property {string} EXEC_IN_YN - ?�행�??��? (Y/N)
 * @property {string} HQ_DIV_CD - 본�?구분코드
 * @property {string} HQ_DIV_NM - 본�?구분�?
 * @property {string} DEPT_DIV_CD - 부?�구분코??
 * @property {string} DEPT_DIV_NM - 부?�구분명
 * @property {string} DUTY_CD - 직책코드
 * @property {string} DUTY_CD_NM - 직책�?
 * @property {string} DUTY_DIV_CD - 직책구분코드
 * @property {string} TCN_GRD - 기술?�급
 * @property {string} TCN_GRD_NM - 기술?�급�?
 * @property {string} WKG_ST_DIV - 근무?�태구분
 * @property {string} WKG_ST_DIV_NM - 근무?�태구분�?
 * @property {string} RMK - 비고
 * @property {string} PARTY_NM - ?�속�?
 * @property {string} EXEC_ING_BSN_NM - ?�행�??�업�?
 * @property {string} EXEC_ING_YN - ?�행�??��? (Y/N)
 * @property {string} CSF_CO_CD - CSF ?�사코드
 * @property {string} OUTS_FIX_YN - ?�주고정?��? (Y/N)
 * @property {string} LAST_SCHL - 최종?�력
 * @property {string} MAJR - ?�공
 * @property {string} LAST_GRAD_DT - 최종졸업??(YYYYMMDD)
 * @property {string} CTQL_CD_NM - ?�격증명
 * @property {string} CTQL_CD - ?�격증코??
 * @property {string} CTQL_PUR_DT - ?�격증취?�일 (YYYYMMDD)
 * @property {string} CARR_MCNT - 경력개월??
 * @property {string} ENTR_BEF_CARR - ?�사?�경??
 * @property {string} CARR_CALC_STND_DT - 경력계산기�???(YYYYMMDD)
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
 * PSM0050M00 - 개발???�로??관�??�면
 * 
 * 개발?�의 ?�로???�보�?관리하???�심 ?�면?�니??
 * ?�원 ?�보 조회, ?�로???�록/?�정/??��, 경력 계산 ?�의 기능???�공?�니??
 * 
 * 주요 기능:
 * - ?�원 ?�보 조회 �??�로??관�?
 * - ?�로???�록/?�정/??�� (CRUD)
 * - 경력 계산 �??�시 (?�사 ????경력 분리)
 * - 개발?�경 ?�택 ?�업 (PSM0060M00)
 * - ?�원 검???�업 (COMZ080P00)
 * - CSV ?�운로드 (AG Grid Community 버전)
 * - AG Grid�??�용???�로??목록 ?�시
 * 
 * AS-IS: PSM_03_0110.mxml (개발?�로???�록 �??�정)
 * TO-BE: React 기반 ?�로??관�??�면
 * 
 * ?�용 ?�시:
 * ```tsx
 * // ?�립 ?�면?�로 ?�용
 * <PSM0050M00 />
 * 
 * // ??모드�??�용 (PSM1010M00 ?��?)
 * <PSM0050M00 isTabMode={true} parentEmpNo="10001" parentEmpNm="?�길?? />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */
interface PSM0050M00Props {
  /** ??모드 ?��? (PSM1010M00????���??�용????true) */
  isTabMode?: boolean;
  /** 부�?컴포?�트?�서 ?�달받�? ?�원번호 */
  parentEmpNo?: string;
  /** 부�?컴포?�트?�서 ?�달받�? ?�원�?*/
  parentEmpNm?: string;
  /** ?�로???�록 버튼 ?�릭 ???�출??콜백 */
  onProfileRegist?: (empNo: string) => void;
}

// API ?�출???�한 공통 ?�수 (컴포?�트 ?��?�??�동)
const callApi = async (url: string, data: any): Promise<any> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`API ?�출 ?�패: ${response.status}`);
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
  
  // ?�력 ?�드 refs
  const strtDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const prjtNmRef = useRef<HTMLInputElement>(null);
  const mmbrCoRef = useRef<HTMLInputElement>(null);
  const chrgWrkRef = useRef<HTMLSelectElement>(null);
  const delpEnvrRef = useRef<HTMLInputElement>(null);

  /**
   * AS-IS 권한 체크 로직
   * 경영지?�본부 (01), 본�???00), 부?�장(10), ?�업본�? ?�업?�??02)�??�원 조회 가??
   * @returns {boolean} ?�원 조회 권한 ?��?
   */
  const isEnableSrchEmpAuthority = (): boolean => {
    const hqDivCd = user?.hqDivCd || '';
    const authCd = user?.authCd || '';
    const deptTp = user?.deptTp || '';

    if (hqDivCd === '01' || deptTp === 'ADM') return true; // 경영지?�본부
    if (authCd === '00') return true; // 본�???
    if (authCd === '10') return true; // 부?�장
    if (hqDivCd === '02' || deptTp === 'BIZ') return true; // ?�업본�? ?�업?�??

    return false;
  };

  /**
   * AS-IS ?�력�?검�?로직
   * ?�수 ?�력 ?�드 검�?�??�류 ???�당 ?�드???�커??
   * @returns {boolean} 검�??�과 ?��?
   */
  const validateInputData = (): boolean => {
    const { strtDate, endDate, prjtNm, mmbrCo, delpEnvr, chrgWrk } = profileForm;

    if (!strtDate || strtDate === '') {
      showToast('?�작?�자�??�력??주십?�요.', 'error');
      setTimeout(() => strtDateRef.current?.focus(), 100);
      return false;
    }

    if (!endDate || endDate === '') {
      showToast('종료?�자�??�력??주십?�요.', 'error');
      setTimeout(() => endDateRef.current?.focus(), 100);
      return false;
    }

    if (prjtNm === '') {
      showToast('?�로?�트명을 ?�력??주십?�요.', 'error');
      setTimeout(() => prjtNmRef.current?.focus(), 100);
      return false;
    }

    if (mmbrCo === '') {
      showToast('고객?��? ?�력??주십?�요.', 'error');
      setTimeout(() => mmbrCoRef.current?.focus(), 100);
      return false;
    }

    if (chrgWrk === '') {
      showToast('?�당?�무�??�력??주십?�요.', 'error');
      setTimeout(() => chrgWrkRef.current?.focus(), 100);
      return false;
    }

    if (delpEnvr === '') {
      showToast('개발?�경/DBMS/?�어�??�력??주십?�요.', 'error');
      setTimeout(() => delpEnvrRef.current?.focus(), 100);
      return false;
    }

    // ?�작?�자가 종료?�자보다 ??? 경우 체크
    if (strtDate > endDate) {
      showToast('?�작?�자??종료?�자보다 같거???�아???�니?? 개발기간???�시 ?�력??주십?�요.', 'error');
      setTimeout(() => strtDateRef.current?.focus(), 100);
      return false;
    }

    return true;
  };

  /**
   * AS-IS 경력개월???�계 구하�?
   * ?�과 개월???�력받아 �?개월?�로 변??
   * @param {string} strYCnt - ?�수
   * @param {string} strMCnt - 개월??
   * @returns {string} �?개월??
   */
  const getCarrMCnt = (strYCnt: string, strMCnt: string): string => {
    if (strYCnt === '' && strMCnt === '') return '';
    
    const nYcnt = parseInt(strYCnt) || 0;
    const nMCnt = parseInt(strMCnt) || 0;
    
    return String((nYcnt * 12) + nMCnt);
  };

  /**
   * AS-IS ?�작?�자 ?�력 ?�이???�월???�치�?
   * ?�과 ?�을 ?�력받아 YYYYMMDD ?�식?�로 변??(?�자????�� 01)
   * @param {string} year - ?�도
   * @param {string} month - ??
   * @returns {string} YYYYMMDD ?�식???�작?�자
   */
  const packStrtDate = (year: string, month: string): string => {
    return year + month + '01';
  };

  /**
   * AS-IS 종료?�자 ?�력 ?�이???�월???�치�?
   * ?�과 ?�을 ?�력받아 YYYYMMDD ?�식?�로 변??(?�자???�당 ?�의 마�?�???
   * @param {string} year - ?�도
   * @param {string} month - ??
   * @returns {string} YYYYMMDD ?�식??종료?�자
   */
  const packEndDate = (year: string, month: string): string => {
    const arrLastDay = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // ?�년??경우
    const yearNum = parseInt(year);
    if (yearNum % 4 === 0 && (yearNum % 100 !== 0 || yearNum % 400 === 0)) {
      arrLastDay[2] = 29; // ?�년 2??
    }
    
    return year + month + String(arrLastDay[parseInt(month)]);
  };

  /**
   * AS-IS 경력 계산 로직
   * ?�로??리스?��? 기반?�로 ?�사???�사??경력??계산
   * @param {string} kb - 계산 ?�??('ALL', 'Before', 'After')
   */
  const calculateCareer = (kb: string) => {
    if (!employeeData || !profileList.length) return;

    const strEntrYm = employeeData.ENTR_DT?.replace(/\//g, '').substring(0, 6) || '';
    
    let nBefCarrMcnt = 0; // ?�사??경력개월??
    let nAftCarrMcnt = 0; // ?�사??경력개월??
    
    const now = new Date();
    const nowYearMonth = now.getFullYear().toString() + 
      String(now.getMonth() + 1).padStart(2, '0');

    profileList.forEach(profile => {
      const strDevStrtYm = profile.STRT_YM?.replace(/\//g, '') || '';
      const strDevEndYm = (profile.END_YM?.replace(/\//g, '') || '') > nowYearMonth 
        ? nowYearMonth 
        : profile.END_YM?.replace(/\//g, '') || '';

      if (employeeData.OWN_OUTS_DIV === '1') {
        // ?�사??경우
        if (Number(strEntrYm) > Number(strDevStrtYm)) {
          // ?�사??경력
          nBefCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        } else {
          // ?�사??경력
          nAftCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        }
      } else {
        // ?�주??경우
        if (!profile.BSN_NO || profile.BSN_NO === '') {
          // ?�?�개발경??
          nBefCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        } else {
          // ?�사개발경력
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
   * AS-IS 개월??계산
   * ?�작?�월�?종료?�월 ?�이??개월?��? 계산
   * @param {string} startYm - ?�작?�월 (YYYYMM ?�식)
   * @param {string} endYm - 종료?�월 (YYYYMM ?�식)
   * @returns {number} 개월??
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
   * 개월?��? ?�과 개월�?변?�하???�틸리티 ?�수
   * @param {number} carrMcnt - 경력 개월??
   * @returns {{years: number, months: number}} ?�과 개월
   */
  const convertMonthsToYearsAndMonths = (carrMcnt: number) => {
    const years = Math.floor(carrMcnt / 12);
    const months = carrMcnt - (years * 12);
    return { years, months };
  };

  /**
   * YYYY-MM ?�식???�짜?�서 ?�과 ?�을 추출?�는 ?�틸리티 ?�수
   * @param {string} startDate - ?�작?�자 (YYYY-MM ?�식)
   * @param {string} endDate - 종료?�자 (YYYY-MM ?�식)
   * @returns {{strtYear: string, strtMonth: string, endYear: string, endMonth: string}} ?�월 ?�보
   */
  const extractYearMonthFromDateRange = (startDate: string, endDate: string) => {
    const strtYear = startDate.substring(0, 4);
    const strtMonth = startDate.substring(5, 7);
    const endYear = endDate.substring(0, 4);
    const endMonth = endDate.substring(5, 7);
    return { strtYear, strtMonth, endYear, endMonth };
  };

  /**
   * AS-IS ?�사?�경???�면 출력
   * 개월?��? ?�과 개월�?변?�하???�태???�??
   * @param {number} carrMcnt - 경력 개월??
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
   * AS-IS ?�사?�경???�면 출력
   * 개월?��? ?�과 개월�?변?�하???�태???�??
   * @param {number} carrMcnt - 경력 개월??
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
   * AS-IS 경력?�계 ?�면 출력
   * 개월?��? ?�과 개월�?변?�하???�태???�??
   * @param {number} carrMcnt - 경력 개월??
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
   * AS-IS ?�로??중복 체크
   * ?�업번호�??�로??중복 ?�록 ?��? ?�인
   * @param {string} bsnNo - ?�업번호
   * @returns {boolean} 중복 ?��?
   */
  const checkProfileExisted = (bsnNo: string): boolean => {
    return profileList.some(profile => profile.BSN_NO === bsnNo);
  };

  /**
   * AS-IS ?�력 ?�드 ?�성??비활?�화
   * AS-IS 로직:
   * - ?�작?�자, 종료?�자, ?�당?�무: enabled???�라 ?�어
   * - ?�로?�트�? 고객?? 개발?�경: ??�� ?�성??(AS-IS?�서 주석처리??
   * @param {boolean} enabled - ?�성???��?
   */
  const setEnabledInputItem = (enabled: boolean) => {
    setInputEnabled(enabled);
  };

  /**
   * AS-IS 개발?�경 ?�력 ?�업
   * 개발?�경 ?�택 ?�업???�기
   */
  const handleDevEnvPopup = () => {
    setShowDevEnvPopup(true);
  };

  /**
   * AS-IS 경력 ?�??기능 (간단???�림?�로 ?��?
   * 경력 ?�?��? 별도 ?�업?�로 구현 ?�정
   */
  const handleCareerSave = () => {
    showToast('경력 ?�??기능?� 별도 ?�업?�로 구현?�니??', 'info');
  };

  /**
   * AS-IS DataGrid 번호 매기???�수
   * AG-Grid?�서 ??번호�??�시?�기 ?�한 ?�더??
   * @param {any} params - AG-Grid ?�라미터
   * @returns {string} ??번호
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
   * 초기 ?�이??로드
   * 공통코드 로드 �?권한 체크
   */
  const initializeData = async () => {
    try {
      // 공통코드????�� 로드 (?�당?�무 콤보박스??
      await loadCommonCodes();
      
      // ??모드??경우 부모로부???�달받�? ?�원 ?�보 ?�용
      if (isTabMode && parentEmpNo && parentEmpNm) {
        setSearchEmpNm(parentEmpNm);
        // 부모로부???�달받�? ?�원 ?�보�?조회
        await searchEmployeeInfo('1', parentEmpNo, 'ALL');
      } else {
        // AS-IS?� ?�일??초기 ?�정
        if (user?.userId) {
          setSearchEmpNm(user.name || '');
        }
      }
      
      // 권한 체크???�원 검???�에�??�용
      if (!isEnableSrchEmpAuthority()) {
        showToast('?�원 조회 권한???�습?�다.', 'warning');
      }
    } catch (error) {
      console.error('초기??�??�류:', error);
      showToast('초기??�??�류가 발생?�습?�다.', 'error');
    }
  };

  /**
   * 공통코드 로드
   * AS-IS: COM_03_0101_S ?�로?��? ?�출, ?�라미터: I_LRG_CSF_CD (?�분류코드)
   * ?�당?�무 콤보박스??공통코드 조회
   */
  const loadCommonCodes = async () => {
    try {
      const result = await callApi('/api/common/search', {
        largeCategoryCode: '107'
      });
      
      // API ?�답??success ?�드가 ?�으므�?data가 ?�으�??�공?�로 처리
      if (result.data && Array.isArray(result.data)) {
        setCommonCodes(result.data);
      } else {
        console.error('공통코드 API ?�패:', result);
      }
    } catch (error) {
      console.error('공통코드 조회 ?�류:', error);
    }
  };

  /**
   * ?�원 ?�보 검??
   * AS-IS 로직???�라 ?�원번호 ?�는 ?�원명으�??�원 ?�보 조회
   * @param {string} kb - 검???�??('1': ?�원번호, '2': ?�원�?
   * @param {string} strEmp - 검?�할 ?�원번호 ?�는 ?�원�?
   * @param {string} strOutsOwn - ?�사/?�주 구분 ('ALL', '1': ?�사, '2': ?�주)
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
        // AS-IS empBscInfSeltHandler 로직�??�일
        if (result.data.length > 1) {
        // 2�??�상??경우 ?�원 ?�택 ?�업 ?�출 (AS-IS: COM_02_0410)
        // TO-BE: COMZ080P00 ?�업 ?�출
        openEmployeeSearchPopup(kb, strEmp, strOutsOwn, result.data);
        return;
        } else {
          // ??건일 경우 ?�원 ?�보 ?�정
          console.log('[PSM0050M00] Employee found:', result.data[0]);
          const employee = result.data[0];
          setEmployeeData(employee);
          
          // AS-IS?� ?�일?�게 ?�로???�역 조회
          await loadProfileList(employee.EMP_NO);
          await loadProfileCarrData(employee.EMP_NO);
          
          // ?�원 조회 ???�로???�력 ??초기??(AS-IS: onClickBtnNew)
          handleNew();
        }
      } else {
        console.log('[PSM0050M00] No employee found');
        showToast('?�원 ?�보�?찾을 ???�습?�다.', 'warning');
      }
    } catch (error) {
      console.error('?�원 ?�보 조회 ?�류:', error);
      showToast('?�원 ?�보 조회 �??�류가 발생?�습?�다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ?�로??리스??로드
   * ?�원번호�??�로??목록 조회
   * @param {string} empNo - ?�원번호
   */
  const loadProfileList = async (empNo: string) => {
    try {
      const result = await callApi('/api/psm/profile/list', {
        empNo: empNo,
        userId: user?.userId || 'system'
      });
      
      if (result.success) {
        // result.data가 배열?��? ?�인?�고 ?�전?�게 ?�정
        const profileData = Array.isArray(result.data) ? result.data : [];
        setProfileList(profileData);
        
        // ?�이??로드 ??컬럼 ?�기 조정
        setTimeout(() => {
          if (gridApiRef.current) {
            gridApiRef.current.sizeColumnsToFit();
          }
        }, 200);
      }
    } catch (error) {
      console.error('?�로??리스??조회 ?�류:', error);
      showToast('?�로??리스??조회 �??�류가 발생?�습?�다.', 'error');
    }
  };

  /**
   * ?�로??경력 ?�이??로드
   * ?�원번호�?경력 계산 ?�이??조회
   * @param {string} empNo - ?�원번호
   */
  const loadProfileCarrData = async (empNo: string) => {
    try {
      const result = await callApi('/api/psm/profile/carr-calc', {
        empNo: empNo,
        userId: user?.userId || 'system'
      });
      
      if (result.success && result.data && result.data.length > 0) {
        // AS-IS fnSelectProfileCarr ?�수??aftCarrCalcHandler 로직
        const rec = result.data[0]; // 배열??�?번째 ?�소 ?�용
        
        if (!rec) {
          // ?�로??경력 출력 ??�� Clear
          clearProfileCarr();
          return;
        }

        // ?�력기�? 경력(?�사???�사??�??�급
        const befMCnt = Number(rec.BEF_M_CNT || 0);
        const aftMCnt = Number(rec.AFT_M_CNT || 0);
        const totMCnt = befMCnt + aftMCnt;
        
        setProfileCarrData({
          calcStadDt: rec.CALC_STAD_DT || '',
          // ?�력기�?
          entrBefInYcnt: Math.floor(befMCnt / 12),
          entrBefInMcnt: befMCnt - (Math.floor(befMCnt / 12) * 12),
          entrAftInYcnt: Math.floor(aftMCnt / 12),
          entrAftInMcnt: aftMCnt - (Math.floor(aftMCnt / 12) * 12),
          totCarrYcnt: Math.floor(totMCnt / 12),
          totCarrMcnt: totMCnt - (Math.floor(totMCnt / 12) * 12),
          adbgTcnGrdNm: rec.TCN_GRD_NM || '',
          adbgTcnGrdCd: rec.TCN_GRD || '',
          // 기술?�격기�?
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
      console.error('?�로??경력 계산 ?�이??조회 ?�류:', error);
    }
  };

  /**
   * ?�로??경력 ?�이??초기??
   * 경력 계산 ?�이?��? 기본값으�?초기??
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
   * ?�원 검??버튼 ?�릭 ?�들??
   * ?�원명으�??�원 검???�행
   */
  const handleEmpSearch = () => {
    if (!searchEmpNm.trim()) {
      showToast('?�원명을 ?�력??주십?�요.', 'warning');
      return;
    }
    searchEmployeeInfo('2', searchEmpNm.trim(), 'ALL');
  };

  /**
   * 조회 버튼 ?�릭 ?�들??
   * ?�재 ?�택???�원???�로?�과 경력 ?�이?��? ?�로고침
   */
  const handleRefreshData = () => {
    if (!employeeData?.EMP_NO.trim()) {
      showToast('?�원명을 ?�력??주십?�요.', 'warning');
      return;
    } else {
      loadProfileList(employeeData.EMP_NO);
      loadProfileCarrData(employeeData.EMP_NO);
    }
  };

  /**
   * AS-IS DblClick_COM_02_0410 ?�수?� ?�일??기능
   * ?�원 ?�택 ?�업?�서 ?�택???�원 ?�보 처리
   * @param {string} empNo - ?�택???�원번호
   * @param {string} empNm - ?�택???�원�?
   * @param {string} ownOutsDiv - ?�사/?�주 구분
   */
  /**
   * COMZ080P00 ?�업 ?�기 ?�수
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
      
      // ?�업??로드?????�이???�송
      popup.onload = () => {
        setTimeout(() => {
          sendDataToEmployeePopup(popup, searchType, searchValue, ownOutsDiv, empList);
        }, 500);
      };
    }
  };

  /**
   * ?�업???�이???�송
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
   * 메시지 ?�신 처리
   */
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'EMP_SELECTED') {
        const selectedEmp = event.data.data;
        handleEmployeeSelected(selectedEmp.empNo, selectedEmp.empNm, selectedEmp.ownOutsDiv);
        
        // ?�업 ?�기
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
    
    // AS-IS?� ?�일?�게 ?�로???�역 조회
    loadProfileList(empNo);
    loadProfileCarrData(empNo);
    
    // ?�원 조회 ???�로???�력 ??초기??(AS-IS: onClickBtnNew)
    handleNew();
  };

  /**
   * ?�로??검??버튼 ?�릭 ?�들??
   * ?�재 ?�택???�원???�로??목록 ?�로고침
   */
  const handleProfileSearch = () => {
    if (!employeeData) {
      showToast('먼�? ?�원??검?�해주세??', 'warning');
      return;
    }
    loadProfileList(employeeData.EMP_NO);
  };

  /**
   * ?�로???��? ?�운로드 ?�들??
   * CSV ?�태�??�이???�운로드 (Community 버전 ?�??
   */
  const handleProfileExcel = () => {
    if (!profileList || profileList.length === 0) {
      showToast('?�운로드???�로???�이?��? ?�습?�다.', 'warning');
      return;
    }

    try {
      // CSV ?�태�??�이???�보?�기
      const headers = ['?�로?�트�?, '?�작?�월', '종료?�월', '개월??, '고객??, '?�당?�무', '개발?�경', '?�업번호', '?�록??, '?�록??, '비고'];
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
      link.setAttribute('download', `${employeeData?.EMP_NM || ''}_?�로???�역.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('CSV ?�운로드가 ?�료?�었?�니??', 'info');
    } catch (error) {
      console.error('CSV ?�운로드 ?�류:', error);
      showToast('CSV ?�운로드 �??�류가 발생?�습?�다.', 'error');
    }
  };

  /**
   * ?�로???�록 ?�업 ?�들??
   */
  const handleProfileRegist = () => {
    if (isTabMode && employeeData?.EMP_NO) {
      showToast('개발중입?�다.', 'error');
      // ??모드?�서??COM0000M00???�역 handleMenuClick ?�수�??�출
      // const globalHandleMenuClick = (window as any).handleMenuClick;
      // if (globalHandleMenuClick && typeof globalHandleMenuClick === 'function') {
      //   // ?�원번호�??�라미터�??�달
      //   globalHandleMenuClick('PSM0040', { 
      //     empNo: employeeData.EMP_NO,
      //     empNm: employeeData.EMP_NM 
      //   });
      // } else {
      //   showToast('메뉴 ?�스?�에 ?�결?????�습?�다.', 'error');
      // }
    }
  };

  /**
   * ?�사/?�주 구분???�른 경력 ?�벨 반환
   * AS-IS: ?�사(1)�?"?�사???�사??경력", ?�주(2)�?"?�???�사 경력"
   * @param {string} ownOutsDiv - ?�사/?�주 구분 ('1': ?�사, '2': ?�주)
   * @param {string} type - ?�벨 ?�??('before' | 'after')
   * @returns {string} 경력 ?�벨
   */
  const getCareerLabel = (ownOutsDiv: string, type: 'before' | 'after'): string => {
    if (ownOutsDiv === '1') {
      // ?�사
      return type === 'before' ? '?�사??경력' : '?�사??경력';
    } else {
      // ?�주
      return type === 'before' ? '?�??경력' : '?�사 경력';
    }
  };

  /**
   * ?�입?�역 불러?�기 ?�들??
   * ?�입?�력?�황(BSN0660P00) ?�면 개발 �?
   */
  const handleLoadProjectInput = () => {
    showToast('?�입?�력?�황(BSN0660P00) ?�면 개발중입?�다.', 'info');
  };

  /**
   * ?�로???�블?�릭 ?�들??
   * ?�로??목록?�서 ??��???�블?�릭?�여 ?�정 모드�??�환
   * @param {number} index - ?�로??목록 ?�덱??
   */
  const handleProfileDoubleClick = (index: number) => {
    if (index < 0 || index >= profileList.length) return;
    
    const profile = profileList[index];
    
    // AS-IS 로직: ?�짜�????�로 분리
    const strtDt = profile.STRT_DT || '';
    const endDt = profile.END_DT || '';
    
    // YYYYMMDD ?�식??YYYY-MM ?�식?�로 변??
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
      strtDate: formatDateToMonth(strtDt), // YYYY-MM ?�식?�로 변??
      endDate: formatDateToMonth(endDt),   // YYYY-MM ?�식?�로 변??
      bsnNm: profile.BSN_NO || '',
      custNm: profile.MMBR_CO || ''
    });
    
    setNewFlag(false);
    
    // AS-IS 로직: ?�투?�등록내??���??�록???�로?�인지 체크
    if (!profile.BSN_NO || profile.BSN_NO === '') {
      // 모든 ?�력 ??�� ?�력 가??
      setEnabledInputItem(true);
    } else {
      // 개발?�경�?빼고 ?�머지???�력 불�???
      setEnabledInputItem(false);
    }
  };

  /**
   * ?�규 버튼 ?�릭 ?�들??
   * ?�로???�력 ?�을 초기?�하�??�규 ?�록 모드�??�환
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
    // AS-IS: setEnabledInputItem(true) - ?�력??�� ?�성??
    setInputEnabled(true);
  };

  /**
   * ?�??버튼 ?�릭 ?�들??
   * ?�???�인 ?�이?�로�??�시
   */
  const handleSave = () => {
    if (!employeeData) {
      showToast('먼�? ?�원??검?�해주세??', 'warning');
      return;
    }

    if (!validateInputData()) {
      return;
    }

    // AS-IS 중복 체크
    if (newFlag && checkProfileExisted(profileForm.bsnNo)) {
      showToast('?��? ?�록???�로?�입?�다.', 'warning');
      return;
    }

    // ?�???�인 ?�이?�로�??�시
    setShowSaveConfirm(true);
  };

  /**
   * ?�???�인 ?�이?�로�??�인 ?�들??
   * ?�로???�록 ?�는 ?�정 API ?�출
   */
  const handleSaveConfirm = async () => {
    setShowSaveConfirm(false);

    if (!employeeData) {
      showToast('?�원 ?�보가 ?�습?�다.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const url = newFlag ? '/api/psm/profile/insert' : '/api/psm/profile/update';
      
      // strtDate?� endDate?�서 ?�월 추출 (YYYY-MM ?�식?�서)
      if (!profileForm.strtDate || !profileForm.endDate) {
        showToast('?�작?�자?� 종료?�자�?모두 ?�력?�주?�요.', 'error');
        return;
      }
      
      const { strtYear, strtMonth, endYear, endMonth } = extractYearMonthFromDateRange(
        profileForm.strtDate, 
        profileForm.endDate
      );

      // 공통 ?�청 ?�이??구성
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

      // Update ?�에�?seqNo 추�?
      const requestData = newFlag ? baseRequestData : {
        ...baseRequestData,
        seqNo: String(profileForm.seqNo)
      };

      const result = await callApi(url, requestData);
      
      if (result.success) {
        showToast(newFlag ? '?�로?�이 ?�록?�었?�니??' : '?�로?�이 ?�정?�었?�니??', 'info');
        await loadProfileList(employeeData!.EMP_NO);
        handleNew();
      } else {
        showToast(result.message || '?�??�??�류가 발생?�습?�다.', 'error');
      }
    } catch (error) {
      console.error('?�로???�???�류:', error);
      showToast('?�로???�??�??�류가 발생?�습?�다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ??�� 버튼 ?�릭 ?�들??
   * ??�� ?�인 ?�이?�로�??�시
   */
  const handleDelete = async () => {
    if (!employeeData || !profileForm.seqNo) {
      showToast('??��???�로?�을 ?�택?�주?�요.', 'warning');
      return;
    }

    const confirmMessage = profileForm.bsnNo 
      ? '?�로?�트관리에???�록???�입?�황 ?�역???�로???�니?? 그래????��?�시겠습?�까?'
      : '?�택???�로?�을 ??��?�시겠습?�까?';

    setDeleteConfirmMessage(confirmMessage);
    setShowDeleteConfirm(true);
  };

  /**
   * ??�� ?�인 ?�이?�로�??�인 ?�들??
   * ?�로????�� API ?�출
   */
  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);

    if (!employeeData) {
      showToast('?�원 ?�보가 ?�습?�다.', 'error');
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
        showToast('?�로?�이 ??��?�었?�니??', 'info');
        await loadProfileList(employeeData.EMP_NO);
        handleNew();
      } else {
        showToast(result.message || '??�� �??�류가 발생?�습?�다.', 'error');
      }
    } catch (error) {
      console.error('?�로????�� ?�류:', error);
      showToast('?�로????�� �??�류가 발생?�습?�다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ???�드 변�??�들??
   * ?�로???�력 ?�의 ?�드 �?변�?처리
   * @param {keyof ProfileFormData} field - 변경할 ?�드�?
   * @param {string} value - 변경할 �?
   */
  const handleFormChange = (field: keyof ProfileFormData, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  /**
   * AS-IS 경력 변�????�동 계산
   * ?�로??변�???경력???�동?�로 ?�계??
   */
  const handleCareerChange = () => {
    calculateCareer('ALL');
  };

  useEffect(() => {
    initializeData();
  }, []);

  // ??모드?�서 부�?props 변�????�조??
  useEffect(() => {
    console.log('[PSM0050M00] useEffect triggered:', { isTabMode, parentEmpNo, parentEmpNm });
    if (parentEmpNo && parentEmpNo.trim() !== '') {
      console.log('[PSM0050M00] Loading employee info for:', parentEmpNo);
      setSearchEmpNm(parentEmpNm || '');
      // ?�동?�로 ?�원 ?�보 조회 �??�로??조회까�? ?�행
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
    { headerName: '?�로?�트�?, field: 'PRJT_NM', width: 250 },
    { headerName: '?�작?�월', field: 'STRT_YM', width: 100 },
    { headerName: '종료?�월', field: 'END_YM', width: 100 },
    { headerName: '개월??, field: 'IN_MCNT', width: 120 },
    { headerName: '고객??, field: 'MMBR_CO', width: 150 },
    { headerName: '?�당?�무', field: 'CHRG_WRK_NM', width: 100 },
    { headerName: '개발?�경', field: 'DVLP_ENVR', width: 250 },
    { headerName: '?�업번호', field: 'BSN_NO', width: 150 },
    { headerName: '?�록??, field: 'REG_DT', width: 130 },
    { headerName: '?�록??, field: 'CHNGR_NM', width: 100 },
    { headerName: '비고', field: 'RMK', width: 400 }
  ];

  /**
   * AS-IS CommMethods.setDateFormat ?�수?� ?�일??기능
   * YYYYMMDD ?�식??YYYY/MM/DD ?�식?�로 변??
   * @param {string} dateStr - YYYYMMDD ?�식???�짜 문자??
   * @returns {string} YYYY/MM/DD ?�식???�짜 문자??
   */
  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length < 8) return '';
    
    // YYYYMMDD ?�식??YYYY/MM/DD ?�식?�로 변??
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return `${year}/${month}/${day}`;
  };

  /**
   * AG-Grid 준�??�료 ?�들??
   * 그리??API 참조 ?�??�?컬럼 ?�기 ?�동 조정
   * @param {GridReadyEvent} params - AG-Grid 준�??�료 ?�벤???�라미터
   */
  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
  };

  // ?�도??리사?�즈 ?�에??컬럼 ?�기 조정
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
      {/* 조회 ?�역 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            {/* 1??*/}
            <tr className="search-tr">
              <th className="search-th">?�원�?/th>
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
                      placeholder="?�원�?
                      disabled={isTabMode}
                    />
                    <button 
                      type="button"
                      onClick={handleEmpSearch}
                      className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded border border-blue-500 hover:border-blue-600 transition-colors shadow-sm disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
                      title="?�원 검??
                      disabled={isTabMode || !isEnableSrchEmpAuthority()}
                    >
                      <img 
                        src="/icon_search_bk.svg" 
                        alt="검?? 
                        className="w-4 h-4 filter brightness-0 invert"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <span className="hidden text-sm font-medium text-white">검??/span>
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

              <th className="search-th">?�속</th>
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

              <th className="search-th">근무?�태</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.WKG_ST_DIV_NM || ''}
                  readOnly
                />
              </td>
            </tr>

            {/* 2??*/}
            <tr className="search-tr">

              <th className="search-th">?�사?�자</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.ENTR_DT || ''}
                  readOnly
                />
              </td>

              <th className="search-th">?�사?�자</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.RETIR_DT || ''}
                  readOnly
                />
              </td>

              <th className="search-th">?�력/?�공</th>
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

              <th className="search-th">?�격�?취득??/th>
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
                  <span className="m-0">??/span>
                  <input 
                    type="text" 
                    className="input-base input-default !w-[50px] text-right" 
                    value={(Number(employeeData?.CARR_MCNT) || 0) % 12}
                    readOnly
                  />
                  <span className="m-0">개월</span>
                </div>
              </td>

              <th className="search-th">?�급</th>
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

      {/* 개발 ?�로???�역 AG-Grid */}
      <div className="gridbox-div mb-4">
        <div className="grid-header">
          <div className="flex justify-between items-center w-full">
            <h3>개발 ?�로???�역</h3>
            <div className="flex gap-2">
              <button 
                type="button" 
                className="btn-base btn-excel"
                onClick={handleProfileExcel}
              >
                CSV
              </button>
              {/* ??모드?�서�??�로???�록 버튼 ?�시 */}
              {isTabMode && (
                <button 
                  type="button" 
                  className="btn-base btn-act"
                  onClick={handleProfileRegist}
                >
                  ?�로?�등�?
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

      {/* ?�이�??�역 */}
      <div className="box-wrap">
        <div className="tit_area">
          <h3>
            ?�로??경력
            <span className="ml-2 text-sm text-gray-500 font-normal">
              (기�??? {profileCarrData?.calcStadDt ? profileCarrData.calcStadDt : ''})
            </span>
          </h3>
        </div>
        
        {/* ?�이�?*/}
        <table className="form-table w-full mb-4">
          <tbody>
            {/* 1?? ?�력 기�? */}
            <tr className="form-tr">
              <th className="form-th w-[130px]">?�력기�?</th>
              <td className="form-td w-[250px]">
                {getCareerLabel(employeeData?.OWN_OUTS_DIV || '1', 'before')}
                <input 
                  type="text" 
                  className="input-base input-default !w-[50px] text-center mx-1" 
                  value={profileCarrData?.entrBefInYcnt ?? 0}
                  readOnly
                />??
                <input 
                  type="text" 
                  className="input-base input-default !w-[50px] text-center mx-1" 
                  value={profileCarrData?.entrBefInMcnt ?? 0}
                  readOnly
                />??
              </td>
              <td className="form-td w-[250px]">
                {getCareerLabel(employeeData?.OWN_OUTS_DIV || '1', 'after')}
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.entrAftInYcnt ?? 0}
                   readOnly
                 />??
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.entrAftInMcnt ?? 0}
                   readOnly
                 />??
               </td>
               <td className="form-td">
                 ?�계
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.totCarrYcnt ?? 0}
                   readOnly
                 />??
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.totCarrMcnt ?? 0}
                   readOnly
                 />??
                 <span className="ml-2 font-bold text-blue-600">
                   {profileCarrData?.adbgTcnGrdNm || ''}
                 </span>
               </td>
             </tr>
             {/* 2?? 기술?�격 기�? */}
             <tr className="form-tr">
               <th className="form-th w-[130px]">기술?�격기�?</th>
               <td className="form-td">
                 {getCareerLabel(employeeData?.OWN_OUTS_DIV || '1', 'before')}
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlEntrBefInYcnt ?? 0}
                   readOnly
                 />??
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlEntrBefInMcnt ?? 0}
                   readOnly
                 />??
               </td>
               <td className="form-td">
                 {getCareerLabel(employeeData?.OWN_OUTS_DIV || '1', 'after')}
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlEntrAftInYcnt ?? 0}
                   readOnly
                 />??
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlEntrAftInMcnt ?? 0}
                   readOnly
                 />??
               </td>
               <td className="form-td">
                 ?�계
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlTotCarrYcnt ?? 0}
                   readOnly
                 />??
                 <input 
                   type="text" 
                   className="input-base input-default !w-[50px] text-center mx-1" 
                   value={profileCarrData?.ctqlTotCarrMcnt ?? 0}
                   readOnly
                 />??
                 <span className="ml-2 font-bold text-blue-600">
                   {profileCarrData?.ctqlTcnGrdNm || ''}
                 </span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ??모드가 ?�닐 ?�만 ?�로???�성 ?�역 ?�시 */}
        {!isTabMode && (
          <div className="tit_area">
            <h3>?�로???�성</h3>
            <div>
              <button
                className="btn-base btn-act"
                onClick={handleLoadProjectInput}
              >
                ?�입?�역 불러?�기
              </button>
            </div>
          </div>
        )}

        {/* ??모드가 ?�닐 ?�만 ?�로???�력 ???�시 */}
        {!isTabMode && (
          <div className="gridbox-div mb-4">
          <div className="grid-scroll-wrap">
            <table className="grid-table">
              <thead>
                <tr>
                  <th className="grid-th">?�작?�자</th>
                  <th className="grid-th">종료?�자</th>
                  <th className="grid-th">?�로?�트�?/th>
                  <th className="grid-th">고객??/th>
                  <th className="grid-th">?�당?�무</th>
                                     <th className="grid-th flex justify-between items-center">개발?�경/DBMS/?�어<button type="button" className="btn-base btn-etc" onClick={handleDevEnvPopup}>?�택</button></th>
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
                      <option value="">?�택?�세??/option>
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

        {/* ??모드가 ?�닐 ?�만 ?�로???�력 ???�시 */}
        {!isTabMode && (
          <div className="flex justify-end gap-2 mt-2">
            <button 
              className="btn-base btn-delete"
              onClick={handleDelete}
              disabled={!profileForm.seqNo}
            >
              ??��
            </button>
            <button 
              className="btn-base btn-etc"
              onClick={handleNew}
            >
              ?�규
            </button>
            <button 
              className="btn-base btn-act"
              onClick={handleSave}
            >
              ?�??
            </button>
          </div>
        )}
      </div>



      {showDevEnvPopup && (
        <PSM0060M00
          onConfirm={(data) => {
            // AS-IS 로직: ?�택????��?�을 ?�표�?구분?�여 ?�결
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



      {/* ??�� ?�인 ?�이?�로�?*/}
      <ConfirmDialog
        isVisible={showDeleteConfirm}
        type="warning"
        message={deleteConfirmMessage}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* ?�???�인 ?�이?�로�?*/}
      <ConfirmDialog
        isVisible={showSaveConfirm}
        type="info"
        message={newFlag ? '?�로?�을 ?�록?�시겠습?�까?' : '?�로?�을 ?�정?�시겠습?�까?'}
        onConfirm={handleSaveConfirm}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </div>
  );
};

export default PSM0050M00;


