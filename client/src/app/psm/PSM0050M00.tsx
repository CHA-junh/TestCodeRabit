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
 * ?ฌ์ ๊ธฐ๋ณธ ?๋ณด ?ฐ์ด???ธํฐ?์ด??
 * 
 * AS-IS PSM_01_0101_S ?๋ก?์??์ ๋ฐํ?๋ ?ฌ์ ?๋ณด? ?์ผ??๊ตฌ์กฐ
 * 
 * @property {string} EMP_NO - ?ฌ์๋ฒํธ
 * @property {string} OWN_OUTS_DIV - ?ด๋?/?ธ์ฃผ ๊ตฌ๋ถ (1: ?ด๋?, 2: ?ธ์ฃผ)
 * @property {string} OWN_OUTS_NM - ?ด๋?/?ธ์ฃผ ๊ตฌ๋ถ๋ช?
 * @property {string} EMP_NM - ?ฌ์๋ช?
 * @property {string} ENTR_DT - ?์ฌ??(YYYYMMDD)
 * @property {string} RETIR_DT - ?ด์ฌ??(YYYYMMDD)
 * @property {string} PRJ_YN - ?๋ก?ํธ ์ฐธ์ฌ ?ฌ๋? (Y/N)
 * @property {string} BSN_NO - ?ฌ์๋ฒํธ
 * @property {string} BSN_NM - ?ฌ์๋ช?
 * @property {string} DEV_NM - ๊ฐ๋ฐ๋ช?
 * @property {string} CO_CD - ?์ฌ์ฝ๋
 * @property {string} CO_NM - ?์ฌ๋ช?
 * @property {string} EXEC_IN_STRT_DT - ?คํ์ค??์??
 * @property {string} EXEC_IN_END_DT - ?คํ์ค?์ข๋ฃ??
 * @property {string} CHRG_WRK - ?ด๋น?๋ฌด
 * @property {string} EXEC_IN_YN - ?คํ์ค??ฌ๋? (Y/N)
 * @property {string} HQ_DIV_CD - ๋ณธ๋?๊ตฌ๋ถ์ฝ๋
 * @property {string} HQ_DIV_NM - ๋ณธ๋?๊ตฌ๋ถ๋ช?
 * @property {string} DEPT_DIV_CD - ๋ถ?๊ตฌ๋ถ์ฝ??
 * @property {string} DEPT_DIV_NM - ๋ถ?๊ตฌ๋ถ๋ช
 * @property {string} DUTY_CD - ์ง์ฑ์ฝ๋
 * @property {string} DUTY_CD_NM - ์ง์ฑ๋ช?
 * @property {string} DUTY_DIV_CD - ์ง์ฑ๊ตฌ๋ถ์ฝ๋
 * @property {string} TCN_GRD - ๊ธฐ์ ?ฑ๊ธ
 * @property {string} TCN_GRD_NM - ๊ธฐ์ ?ฑ๊ธ๋ช?
 * @property {string} WKG_ST_DIV - ๊ทผ๋ฌด?ํ๊ตฌ๋ถ
 * @property {string} WKG_ST_DIV_NM - ๊ทผ๋ฌด?ํ๊ตฌ๋ถ๋ช?
 * @property {string} RMK - ๋น๊ณ 
 * @property {string} PARTY_NM - ?์๋ช?
 * @property {string} EXEC_ING_BSN_NM - ?คํ์ค??ฌ์๋ช?
 * @property {string} EXEC_ING_YN - ?คํ์ค??ฌ๋? (Y/N)
 * @property {string} CSF_CO_CD - CSF ?์ฌ์ฝ๋
 * @property {string} OUTS_FIX_YN - ?ธ์ฃผ๊ณ ์ ?ฌ๋? (Y/N)
 * @property {string} LAST_SCHL - ์ต์ข?๋ ฅ
 * @property {string} MAJR - ?๊ณต
 * @property {string} LAST_GRAD_DT - ์ต์ข์กธ์??(YYYYMMDD)
 * @property {string} CTQL_CD_NM - ?๊ฒฉ์ฆ๋ช
 * @property {string} CTQL_CD - ?๊ฒฉ์ฆ์ฝ??
 * @property {string} CTQL_PUR_DT - ?๊ฒฉ์ฆ์ทจ?์ผ (YYYYMMDD)
 * @property {string} CARR_MCNT - ๊ฒฝ๋ ฅ๊ฐ์??
 * @property {string} ENTR_BEF_CARR - ?์ฌ?๊ฒฝ??
 * @property {string} CARR_CALC_STND_DT - ๊ฒฝ๋ ฅ๊ณ์ฐ๊ธฐ์???(YYYYMMDD)
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
 * PSM0050M00 - ๊ฐ๋ฐ???๋ก??๊ด๋ฆ??๋ฉด
 * 
 * ๊ฐ๋ฐ?์ ?๋ก???๋ณด๋ฅ?๊ด๋ฆฌํ???ต์ฌ ?๋ฉด?๋??
 * ?ฌ์ ?๋ณด ์กฐํ, ?๋ก???ฑ๋ก/?์ /?? , ๊ฒฝ๋ ฅ ๊ณ์ฐ ?ฑ์ ๊ธฐ๋ฅ???๊ณต?ฉ๋??
 * 
 * ์ฃผ์ ๊ธฐ๋ฅ:
 * - ?ฌ์ ?๋ณด ์กฐํ ๋ฐ??๋ก??๊ด๋ฆ?
 * - ?๋ก???ฑ๋ก/?์ /??  (CRUD)
 * - ๊ฒฝ๋ ฅ ๊ณ์ฐ ๋ฐ??์ (?์ฌ ????๊ฒฝ๋ ฅ ๋ถ๋ฆฌ)
 * - ๊ฐ๋ฐ?๊ฒฝ ? ํ ?์ (PSM0060M00)
 * - ?ฌ์ ๊ฒ???์ (COMZ080P00)
 * - CSV ?ค์ด๋ก๋ (AG Grid Community ๋ฒ์ )
 * - AG Grid๋ฅ??์ฉ???๋ก??๋ชฉ๋ก ?์
 * 
 * AS-IS: PSM_03_0110.mxml (๊ฐ๋ฐ?๋ก???ฑ๋ก ๋ฐ??์ )
 * TO-BE: React ๊ธฐ๋ฐ ?๋ก??๊ด๋ฆ??๋ฉด
 * 
 * ?ฌ์ฉ ?์:
 * ```tsx
 * // ?๋ฆฝ ?๋ฉด?ผ๋ก ?ฌ์ฉ
 * <PSM0050M00 />
 * 
 * // ??๋ชจ๋๋ก??ฌ์ฉ (PSM1010M00 ?ด๋?)
 * <PSM0050M00 isTabMode={true} parentEmpNo="10001" parentEmpNm="?๊ธธ?? />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */
interface PSM0050M00Props {
  /** ??๋ชจ๋ ?ฌ๋? (PSM1010M00????ผ๋ก??ฌ์ฉ????true) */
  isTabMode?: boolean;
  /** ๋ถ๋ช?์ปดํฌ?ํธ?์ ?๋ฌ๋ฐ์? ?ฌ์๋ฒํธ */
  parentEmpNo?: string;
  /** ๋ถ๋ช?์ปดํฌ?ํธ?์ ?๋ฌ๋ฐ์? ?ฌ์๋ช?*/
  parentEmpNm?: string;
  /** ?๋ก???ฑ๋ก ๋ฒํผ ?ด๋ฆญ ???ธ์ถ??์ฝ๋ฐฑ */
  onProfileRegist?: (empNo: string) => void;
}

// API ?ธ์ถ???ํ ๊ณตํต ?จ์ (์ปดํฌ?ํธ ?ธ๋?๋ก??ด๋)
const callApi = async (url: string, data: any): Promise<any> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`API ?ธ์ถ ?คํจ: ${response.status}`);
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
  
  // ?๋ ฅ ?๋ refs
  const strtDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const prjtNmRef = useRef<HTMLInputElement>(null);
  const mmbrCoRef = useRef<HTMLInputElement>(null);
  const chrgWrkRef = useRef<HTMLSelectElement>(null);
  const delpEnvrRef = useRef<HTMLInputElement>(null);

  /**
   * AS-IS ๊ถํ ์ฒดํฌ ๋ก์ง
   * ๊ฒฝ์์ง?๋ณธ๋ถ (01), ๋ณธ๋???00), ๋ถ?์ฅ(10), ?์๋ณธ๋? ?์???02)๋ง??ฌ์ ์กฐํ ๊ฐ??
   * @returns {boolean} ?ฌ์ ์กฐํ ๊ถํ ?ฌ๋?
   */
  const isEnableSrchEmpAuthority = (): boolean => {
    const hqDivCd = user?.hqDivCd || '';
    const authCd = user?.authCd || '';
    const deptTp = user?.deptTp || '';

    if (hqDivCd === '01' || deptTp === 'ADM') return true; // ๊ฒฝ์์ง?๋ณธ๋ถ
    if (authCd === '00') return true; // ๋ณธ๋???
    if (authCd === '10') return true; // ๋ถ?์ฅ
    if (hqDivCd === '02' || deptTp === 'BIZ') return true; // ?์๋ณธ๋? ?์???

    return false;
  };

  /**
   * AS-IS ?๋ ฅ๊ฐ?๊ฒ์ฆ?๋ก์ง
   * ?์ ?๋ ฅ ?๋ ๊ฒ์ฆ?๋ฐ??ค๋ฅ ???ด๋น ?๋???ฌ์ปค??
   * @returns {boolean} ๊ฒ์ฆ??ต๊ณผ ?ฌ๋?
   */
  const validateInputData = (): boolean => {
    const { strtDate, endDate, prjtNm, mmbrCo, delpEnvr, chrgWrk } = profileForm;

    if (!strtDate || strtDate === '') {
      showToast('?์?ผ์๋ฅ??๋ ฅ??์ฃผ์ญ?์.', 'error');
      setTimeout(() => strtDateRef.current?.focus(), 100);
      return false;
    }

    if (!endDate || endDate === '') {
      showToast('์ข๋ฃ?ผ์๋ฅ??๋ ฅ??์ฃผ์ญ?์.', 'error');
      setTimeout(() => endDateRef.current?.focus(), 100);
      return false;
    }

    if (prjtNm === '') {
      showToast('?๋ก?ํธ๋ช์ ?๋ ฅ??์ฃผ์ญ?์.', 'error');
      setTimeout(() => prjtNmRef.current?.focus(), 100);
      return false;
    }

    if (mmbrCo === '') {
      showToast('๊ณ ๊ฐ?ฌ๋? ?๋ ฅ??์ฃผ์ญ?์.', 'error');
      setTimeout(() => mmbrCoRef.current?.focus(), 100);
      return false;
    }

    if (chrgWrk === '') {
      showToast('?ด๋น?๋ฌด๋ฅ??๋ ฅ??์ฃผ์ญ?์.', 'error');
      setTimeout(() => chrgWrkRef.current?.focus(), 100);
      return false;
    }

    if (delpEnvr === '') {
      showToast('๊ฐ๋ฐ?๊ฒฝ/DBMS/?ธ์ด๋ฅ??๋ ฅ??์ฃผ์ญ?์.', 'error');
      setTimeout(() => delpEnvrRef.current?.focus(), 100);
      return false;
    }

    // ?์?ผ์๊ฐ ์ข๋ฃ?ผ์๋ณด๋ค ??? ๊ฒฝ์ฐ ์ฒดํฌ
    if (strtDate > endDate) {
      showToast('?์?ผ์??์ข๋ฃ?ผ์๋ณด๋ค ๊ฐ๊ฑฐ???์???ฉ๋?? ๊ฐ๋ฐ๊ธฐ๊ฐ???ค์ ?๋ ฅ??์ฃผ์ญ?์.', 'error');
      setTimeout(() => strtDateRef.current?.focus(), 100);
      return false;
    }

    return true;
  };

  /**
   * AS-IS ๊ฒฝ๋ ฅ๊ฐ์???ฉ๊ณ ๊ตฌํ๊ธ?
   * ?๊ณผ ๊ฐ์???๋ ฅ๋ฐ์ ์ด?๊ฐ์?๋ก ๋ณ??
   * @param {string} strYCnt - ?์
   * @param {string} strMCnt - ๊ฐ์??
   * @returns {string} ์ด?๊ฐ์??
   */
  const getCarrMCnt = (strYCnt: string, strMCnt: string): string => {
    if (strYCnt === '' && strMCnt === '') return '';
    
    const nYcnt = parseInt(strYCnt) || 0;
    const nMCnt = parseInt(strMCnt) || 0;
    
    return String((nYcnt * 12) + nMCnt);
  };

  /**
   * AS-IS ?์?ผ์ ?๋ ฅ ?ฐ์ด???์???ฉ์น๊ธ?
   * ?๊ณผ ?์ ?๋ ฅ๋ฐ์ YYYYMMDD ?์?ผ๋ก ๋ณ??(?ผ์???? 01)
   * @param {string} year - ?๋
   * @param {string} month - ??
   * @returns {string} YYYYMMDD ?์???์?ผ์
   */
  const packStrtDate = (year: string, month: string): string => {
    return year + month + '01';
  };

  /**
   * AS-IS ์ข๋ฃ?ผ์ ?๋ ฅ ?ฐ์ด???์???ฉ์น๊ธ?
   * ?๊ณผ ?์ ?๋ ฅ๋ฐ์ YYYYMMDD ?์?ผ๋ก ๋ณ??(?ผ์???ด๋น ?์ ๋ง์?๋ง???
   * @param {string} year - ?๋
   * @param {string} month - ??
   * @returns {string} YYYYMMDD ?์??์ข๋ฃ?ผ์
   */
  const packEndDate = (year: string, month: string): string => {
    const arrLastDay = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // ?ค๋??๊ฒฝ์ฐ
    const yearNum = parseInt(year);
    if (yearNum % 4 === 0 && (yearNum % 100 !== 0 || yearNum % 400 === 0)) {
      arrLastDay[2] = 29; // ?ค๋ 2??
    }
    
    return year + month + String(arrLastDay[parseInt(month)]);
  };

  /**
   * AS-IS ๊ฒฝ๋ ฅ ๊ณ์ฐ ๋ก์ง
   * ?๋ก??๋ฆฌ์ค?ธ๋? ๊ธฐ๋ฐ?ผ๋ก ?์ฌ???์ฌ??๊ฒฝ๋ ฅ??๊ณ์ฐ
   * @param {string} kb - ๊ณ์ฐ ???('ALL', 'Before', 'After')
   */
  const calculateCareer = (kb: string) => {
    if (!employeeData || !profileList.length) return;

    const strEntrYm = employeeData.ENTR_DT?.replace(/\//g, '').substring(0, 6) || '';
    
    let nBefCarrMcnt = 0; // ?์ฌ??๊ฒฝ๋ ฅ๊ฐ์??
    let nAftCarrMcnt = 0; // ?์ฌ??๊ฒฝ๋ ฅ๊ฐ์??
    
    const now = new Date();
    const nowYearMonth = now.getFullYear().toString() + 
      String(now.getMonth() + 1).padStart(2, '0');

    profileList.forEach(profile => {
      const strDevStrtYm = profile.STRT_YM?.replace(/\//g, '') || '';
      const strDevEndYm = (profile.END_YM?.replace(/\//g, '') || '') > nowYearMonth 
        ? nowYearMonth 
        : profile.END_YM?.replace(/\//g, '') || '';

      if (employeeData.OWN_OUTS_DIV === '1') {
        // ?์ฌ??๊ฒฝ์ฐ
        if (Number(strEntrYm) > Number(strDevStrtYm)) {
          // ?์ฌ??๊ฒฝ๋ ฅ
          nBefCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        } else {
          // ?์ฌ??๊ฒฝ๋ ฅ
          nAftCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        }
      } else {
        // ?ธ์ฃผ??๊ฒฝ์ฐ
        if (!profile.BSN_NO || profile.BSN_NO === '') {
          // ??ฌ๊ฐ๋ฐ๊ฒฝ??
          nBefCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        } else {
          // ?์ฌ๊ฐ๋ฐ๊ฒฝ๋ ฅ
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
   * AS-IS ๊ฐ์??๊ณ์ฐ
   * ?์?์๊ณ?์ข๋ฃ?์ ?ฌ์ด??๊ฐ์?๋? ๊ณ์ฐ
   * @param {string} startYm - ?์?์ (YYYYMM ?์)
   * @param {string} endYm - ์ข๋ฃ?์ (YYYYMM ?์)
   * @returns {number} ๊ฐ์??
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
   * ๊ฐ์?๋? ?๊ณผ ๊ฐ์๋ก?๋ณ?ํ??? ํธ๋ฆฌํฐ ?จ์
   * @param {number} carrMcnt - ๊ฒฝ๋ ฅ ๊ฐ์??
   * @returns {{years: number, months: number}} ?๊ณผ ๊ฐ์
   */
  const convertMonthsToYearsAndMonths = (carrMcnt: number) => {
    const years = Math.floor(carrMcnt / 12);
    const months = carrMcnt - (years * 12);
    return { years, months };
  };

  /**
   * YYYY-MM ?์??? ์ง?์ ?๊ณผ ?์ ์ถ์ถ?๋ ? ํธ๋ฆฌํฐ ?จ์
   * @param {string} startDate - ?์?ผ์ (YYYY-MM ?์)
   * @param {string} endDate - ์ข๋ฃ?ผ์ (YYYY-MM ?์)
   * @returns {{strtYear: string, strtMonth: string, endYear: string, endMonth: string}} ?์ ?๋ณด
   */
  const extractYearMonthFromDateRange = (startDate: string, endDate: string) => {
    const strtYear = startDate.substring(0, 4);
    const strtMonth = startDate.substring(5, 7);
    const endYear = endDate.substring(0, 4);
    const endMonth = endDate.substring(5, 7);
    return { strtYear, strtMonth, endYear, endMonth };
  };

  /**
   * AS-IS ?์ฌ?๊ฒฝ???๋ฉด ์ถ๋ ฅ
   * ๊ฐ์?๋? ?๊ณผ ๊ฐ์๋ก?๋ณ?ํ???ํ?????
   * @param {number} carrMcnt - ๊ฒฝ๋ ฅ ๊ฐ์??
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
   * AS-IS ?์ฌ?๊ฒฝ???๋ฉด ์ถ๋ ฅ
   * ๊ฐ์?๋? ?๊ณผ ๊ฐ์๋ก?๋ณ?ํ???ํ?????
   * @param {number} carrMcnt - ๊ฒฝ๋ ฅ ๊ฐ์??
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
   * AS-IS ๊ฒฝ๋ ฅ?ฉ๊ณ ?๋ฉด ์ถ๋ ฅ
   * ๊ฐ์?๋? ?๊ณผ ๊ฐ์๋ก?๋ณ?ํ???ํ?????
   * @param {number} carrMcnt - ๊ฒฝ๋ ฅ ๊ฐ์??
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
   * AS-IS ?๋ก??์ค๋ณต ์ฒดํฌ
   * ?ฌ์๋ฒํธ๋ก??๋ก??์ค๋ณต ?ฑ๋ก ?ฌ๋? ?์ธ
   * @param {string} bsnNo - ?ฌ์๋ฒํธ
   * @returns {boolean} ์ค๋ณต ?ฌ๋?
   */
  const checkProfileExisted = (bsnNo: string): boolean => {
    return profileList.some(profile => profile.BSN_NO === bsnNo);
  };

  /**
   * AS-IS ?๋ ฅ ?๋ ?์ฑ??๋นํ?ฑํ
   * AS-IS ๋ก์ง:
   * - ?์?ผ์, ์ข๋ฃ?ผ์, ?ด๋น?๋ฌด: enabled???ฐ๋ผ ?์ด
   * - ?๋ก?ํธ๋ช? ๊ณ ๊ฐ?? ๊ฐ๋ฐ?๊ฒฝ: ?? ?์ฑ??(AS-IS?์ ์ฃผ์์ฒ๋ฆฌ??
   * @param {boolean} enabled - ?์ฑ???ฌ๋?
   */
  const setEnabledInputItem = (enabled: boolean) => {
    setInputEnabled(enabled);
  };

  /**
   * AS-IS ๊ฐ๋ฐ?๊ฒฝ ?๋ ฅ ?์
   * ๊ฐ๋ฐ?๊ฒฝ ? ํ ?์???ด๊ธฐ
   */
  const handleDevEnvPopup = () => {
    setShowDevEnvPopup(true);
  };

  /**
   * AS-IS ๊ฒฝ๋ ฅ ???๊ธฐ๋ฅ (๊ฐ๋จ???๋ฆผ?ผ๋ก ?์ฒ?
   * ๊ฒฝ๋ ฅ ??ฅ์? ๋ณ๋ ?์?ผ๋ก ๊ตฌํ ?์ 
   */
  const handleCareerSave = () => {
    showToast('๊ฒฝ๋ ฅ ???๊ธฐ๋ฅ? ๋ณ๋ ?์?ผ๋ก ๊ตฌํ?ฉ๋??', 'info');
  };

  /**
   * AS-IS DataGrid ๋ฒํธ ๋งค๊ธฐ???จ์
   * AG-Grid?์ ??๋ฒํธ๋ฅ??์?๊ธฐ ?ํ ?๋??
   * @param {any} params - AG-Grid ?๋ผ๋ฏธํฐ
   * @returns {string} ??๋ฒํธ
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
   * ์ด๊ธฐ ?ฐ์ด??๋ก๋
   * ๊ณตํต์ฝ๋ ๋ก๋ ๋ฐ?๊ถํ ์ฒดํฌ
   */
  const initializeData = async () => {
    try {
      // ๊ณตํต์ฝ๋???? ๋ก๋ (?ด๋น?๋ฌด ์ฝค๋ณด๋ฐ์ค??
      await loadCommonCodes();
      
      // ??๋ชจ๋??๊ฒฝ์ฐ ๋ถ๋ชจ๋ก๋ถ???๋ฌ๋ฐ์? ?ฌ์ ?๋ณด ?ฌ์ฉ
      if (isTabMode && parentEmpNo && parentEmpNm) {
        setSearchEmpNm(parentEmpNm);
        // ๋ถ๋ชจ๋ก๋ถ???๋ฌ๋ฐ์? ?ฌ์ ?๋ณด๋ก?์กฐํ
        await searchEmployeeInfo('1', parentEmpNo, 'ALL');
      } else {
        // AS-IS? ?์ผ??์ด๊ธฐ ?ค์ 
        if (user?.userId) {
          setSearchEmpNm(user.name || '');
        }
      }
      
      // ๊ถํ ์ฒดํฌ???ฌ์ ๊ฒ???์๋ง??์ฉ
      if (!isEnableSrchEmpAuthority()) {
        showToast('?ฌ์ ์กฐํ ๊ถํ???์ต?๋ค.', 'warning');
      }
    } catch (error) {
      console.error('์ด๊ธฐ??์ค??ค๋ฅ:', error);
      showToast('์ด๊ธฐ??์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.', 'error');
    }
  };

  /**
   * ๊ณตํต์ฝ๋ ๋ก๋
   * AS-IS: COM_03_0101_S ?๋ก?์? ?ธ์ถ, ?๋ผ๋ฏธํฐ: I_LRG_CSF_CD (?๋ถ๋ฅ์ฝ๋)
   * ?ด๋น?๋ฌด ์ฝค๋ณด๋ฐ์ค??๊ณตํต์ฝ๋ ์กฐํ
   */
  const loadCommonCodes = async () => {
    try {
      const result = await callApi('/api/common/search', {
        largeCategoryCode: '107'
      });
      
      // API ?๋ต??success ?๋๊ฐ ?์ผ๋ฏ๋ก?data๊ฐ ?์ผ๋ฉ??ฑ๊ณต?ผ๋ก ์ฒ๋ฆฌ
      if (result.data && Array.isArray(result.data)) {
        setCommonCodes(result.data);
      } else {
        console.error('๊ณตํต์ฝ๋ API ?คํจ:', result);
      }
    } catch (error) {
      console.error('๊ณตํต์ฝ๋ ์กฐํ ?ค๋ฅ:', error);
    }
  };

  /**
   * ?ฌ์ ?๋ณด ๊ฒ??
   * AS-IS ๋ก์ง???ฐ๋ผ ?ฌ์๋ฒํธ ?๋ ?ฌ์๋ช์ผ๋ก??ฌ์ ?๋ณด ์กฐํ
   * @param {string} kb - ๊ฒ?????('1': ?ฌ์๋ฒํธ, '2': ?ฌ์๋ช?
   * @param {string} strEmp - ๊ฒ?ํ  ?ฌ์๋ฒํธ ?๋ ?ฌ์๋ช?
   * @param {string} strOutsOwn - ?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ ('ALL', '1': ?์ฌ, '2': ?ธ์ฃผ)
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
        // AS-IS empBscInfSeltHandler ๋ก์ง๊ณ??์ผ
        if (result.data.length > 1) {
        // 2๊ฑ??ด์??๊ฒฝ์ฐ ?ฌ์ ? ํ ?์ ?ธ์ถ (AS-IS: COM_02_0410)
        // TO-BE: COMZ080P00 ?์ ?ธ์ถ
        openEmployeeSearchPopup(kb, strEmp, strOutsOwn, result.data);
        return;
        } else {
          // ??๊ฑด์ผ ๊ฒฝ์ฐ ?ฌ์ ?๋ณด ?ค์ 
          console.log('[PSM0050M00] Employee found:', result.data[0]);
          const employee = result.data[0];
          setEmployeeData(employee);
          
          // AS-IS? ?์ผ?๊ฒ ?๋ก???ด์ญ ์กฐํ
          await loadProfileList(employee.EMP_NO);
          await loadProfileCarrData(employee.EMP_NO);
          
          // ?ฌ์ ์กฐํ ???๋ก???๋ ฅ ??์ด๊ธฐ??(AS-IS: onClickBtnNew)
          handleNew();
        }
      } else {
        console.log('[PSM0050M00] No employee found');
        showToast('?ฌ์ ?๋ณด๋ฅ?์ฐพ์ ???์ต?๋ค.', 'warning');
      }
    } catch (error) {
      console.error('?ฌ์ ?๋ณด ์กฐํ ?ค๋ฅ:', error);
      showToast('?ฌ์ ?๋ณด ์กฐํ ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ?๋ก??๋ฆฌ์ค??๋ก๋
   * ?ฌ์๋ฒํธ๋ก??๋ก??๋ชฉ๋ก ์กฐํ
   * @param {string} empNo - ?ฌ์๋ฒํธ
   */
  const loadProfileList = async (empNo: string) => {
    try {
      const result = await callApi('/api/psm/profile/list', {
        empNo: empNo,
        userId: user?.userId || 'system'
      });
      
      if (result.success) {
        // result.data๊ฐ ๋ฐฐ์ด?ธ์? ?์ธ?๊ณ  ?์ ?๊ฒ ?ค์ 
        const profileData = Array.isArray(result.data) ? result.data : [];
        setProfileList(profileData);
        
        // ?ฐ์ด??๋ก๋ ??์ปฌ๋ผ ?ฌ๊ธฐ ์กฐ์ 
        setTimeout(() => {
          if (gridApiRef.current) {
            gridApiRef.current.sizeColumnsToFit();
          }
        }, 200);
      }
    } catch (error) {
      console.error('?๋ก??๋ฆฌ์ค??์กฐํ ?ค๋ฅ:', error);
      showToast('?๋ก??๋ฆฌ์ค??์กฐํ ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.', 'error');
    }
  };

  /**
   * ?๋ก??๊ฒฝ๋ ฅ ?ฐ์ด??๋ก๋
   * ?ฌ์๋ฒํธ๋ก?๊ฒฝ๋ ฅ ๊ณ์ฐ ?ฐ์ด??์กฐํ
   * @param {string} empNo - ?ฌ์๋ฒํธ
   */
  const loadProfileCarrData = async (empNo: string) => {
    try {
      const result = await callApi('/api/psm/profile/carr-calc', {
        empNo: empNo,
        userId: user?.userId || 'system'
      });
      
      if (result.success && result.data && result.data.length > 0) {
        // AS-IS fnSelectProfileCarr ?จ์??aftCarrCalcHandler ๋ก์ง
        const rec = result.data[0]; // ๋ฐฐ์ด??์ฒ?๋ฒ์งธ ?์ ?ฌ์ฉ
        
        if (!rec) {
          // ?๋ก??๊ฒฝ๋ ฅ ์ถ๋ ฅ ??ชฉ Clear
          clearProfileCarr();
          return;
        }

        // ?๋ ฅ๊ธฐ์? ๊ฒฝ๋ ฅ(?์ฌ???์ฌ??๊ณ??ฑ๊ธ
        const befMCnt = Number(rec.BEF_M_CNT || 0);
        const aftMCnt = Number(rec.AFT_M_CNT || 0);
        const totMCnt = befMCnt + aftMCnt;
        
        setProfileCarrData({
          calcStadDt: rec.CALC_STAD_DT || '',
          // ?๋ ฅ๊ธฐ์?
          entrBefInYcnt: Math.floor(befMCnt / 12),
          entrBefInMcnt: befMCnt - (Math.floor(befMCnt / 12) * 12),
          entrAftInYcnt: Math.floor(aftMCnt / 12),
          entrAftInMcnt: aftMCnt - (Math.floor(aftMCnt / 12) * 12),
          totCarrYcnt: Math.floor(totMCnt / 12),
          totCarrMcnt: totMCnt - (Math.floor(totMCnt / 12) * 12),
          adbgTcnGrdNm: rec.TCN_GRD_NM || '',
          adbgTcnGrdCd: rec.TCN_GRD || '',
          // ๊ธฐ์ ?๊ฒฉ๊ธฐ์?
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
      console.error('?๋ก??๊ฒฝ๋ ฅ ๊ณ์ฐ ?ฐ์ด??์กฐํ ?ค๋ฅ:', error);
    }
  };

  /**
   * ?๋ก??๊ฒฝ๋ ฅ ?ฐ์ด??์ด๊ธฐ??
   * ๊ฒฝ๋ ฅ ๊ณ์ฐ ?ฐ์ด?ฐ๋? ๊ธฐ๋ณธ๊ฐ์ผ๋ก?์ด๊ธฐ??
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
   * ?ฌ์ ๊ฒ??๋ฒํผ ?ด๋ฆญ ?ธ๋ค??
   * ?ฌ์๋ช์ผ๋ก??ฌ์ ๊ฒ???คํ
   */
  const handleEmpSearch = () => {
    if (!searchEmpNm.trim()) {
      showToast('?ฌ์๋ช์ ?๋ ฅ??์ฃผ์ญ?์.', 'warning');
      return;
    }
    searchEmployeeInfo('2', searchEmpNm.trim(), 'ALL');
  };

  /**
   * ์กฐํ ๋ฒํผ ?ด๋ฆญ ?ธ๋ค??
   * ?์ฌ ? ํ???ฌ์???๋ก?๊ณผ ๊ฒฝ๋ ฅ ?ฐ์ด?ฐ๋? ?๋ก๊ณ ์นจ
   */
  const handleRefreshData = () => {
    if (!employeeData?.EMP_NO.trim()) {
      showToast('?ฌ์๋ช์ ?๋ ฅ??์ฃผ์ญ?์.', 'warning');
      return;
    } else {
      loadProfileList(employeeData.EMP_NO);
      loadProfileCarrData(employeeData.EMP_NO);
    }
  };

  /**
   * AS-IS DblClick_COM_02_0410 ?จ์? ?์ผ??๊ธฐ๋ฅ
   * ?ฌ์ ? ํ ?์?์ ? ํ???ฌ์ ?๋ณด ์ฒ๋ฆฌ
   * @param {string} empNo - ? ํ???ฌ์๋ฒํธ
   * @param {string} empNm - ? ํ???ฌ์๋ช?
   * @param {string} ownOutsDiv - ?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ
   */
  /**
   * COMZ080P00 ?์ ?ด๊ธฐ ?จ์
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
      
      // ?์??๋ก๋?????ฐ์ด???์ก
      popup.onload = () => {
        setTimeout(() => {
          sendDataToEmployeePopup(popup, searchType, searchValue, ownOutsDiv, empList);
        }, 500);
      };
    }
  };

  /**
   * ?์???ฐ์ด???์ก
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
   * ๋ฉ์์ง ?์  ์ฒ๋ฆฌ
   */
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'EMP_SELECTED') {
        const selectedEmp = event.data.data;
        handleEmployeeSelected(selectedEmp.empNo, selectedEmp.empNm, selectedEmp.ownOutsDiv);
        
        // ?์ ?ซ๊ธฐ
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
    
    // AS-IS? ?์ผ?๊ฒ ?๋ก???ด์ญ ์กฐํ
    loadProfileList(empNo);
    loadProfileCarrData(empNo);
    
    // ?ฌ์ ์กฐํ ???๋ก???๋ ฅ ??์ด๊ธฐ??(AS-IS: onClickBtnNew)
    handleNew();
  };

  /**
   * ?๋ก??๊ฒ??๋ฒํผ ?ด๋ฆญ ?ธ๋ค??
   * ?์ฌ ? ํ???ฌ์???๋ก??๋ชฉ๋ก ?๋ก๊ณ ์นจ
   */
  const handleProfileSearch = () => {
    if (!employeeData) {
      showToast('๋จผ์? ?ฌ์??๊ฒ?ํด์ฃผ์ธ??', 'warning');
      return;
    }
    loadProfileList(employeeData.EMP_NO);
  };

  /**
   * ?๋ก???์? ?ค์ด๋ก๋ ?ธ๋ค??
   * CSV ?ํ๋ก??ฐ์ด???ค์ด๋ก๋ (Community ๋ฒ์  ???
   */
  const handleProfileExcel = () => {
    if (!profileList || profileList.length === 0) {
      showToast('?ค์ด๋ก๋???๋ก???ฐ์ด?ฐ๊? ?์ต?๋ค.', 'warning');
      return;
    }

    try {
      // CSV ?ํ๋ก??ฐ์ด???ด๋ณด?ด๊ธฐ
      const headers = ['?๋ก?ํธ๋ช?, '?์?์', '์ข๋ฃ?์', '๊ฐ์??, '๊ณ ๊ฐ??, '?ด๋น?๋ฌด', '๊ฐ๋ฐ?๊ฒฝ', '?ฌ์๋ฒํธ', '?ฑ๋ก??, '?ฑ๋ก??, '๋น๊ณ '];
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
      link.setAttribute('download', `${employeeData?.EMP_NM || ''}_?๋ก???ด์ญ.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('CSV ?ค์ด๋ก๋๊ฐ ?๋ฃ?์?ต๋??', 'info');
    } catch (error) {
      console.error('CSV ?ค์ด๋ก๋ ?ค๋ฅ:', error);
      showToast('CSV ?ค์ด๋ก๋ ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.', 'error');
    }
  };

  /**
   * ?๋ก???ฑ๋ก ?์ ?ธ๋ค??
   */
  const handleProfileRegist = () => {
    if (isTabMode && employeeData?.EMP_NO) {
      showToast('๊ฐ๋ฐ์ค์?๋ค.', 'error');
      // ??๋ชจ๋?์??COM0000M00???์ญ handleMenuClick ?จ์๋ฅ??ธ์ถ
      // const globalHandleMenuClick = (window as any).handleMenuClick;
      // if (globalHandleMenuClick && typeof globalHandleMenuClick === 'function') {
      //   // ?ฌ์๋ฒํธ๋ฅ??๋ผ๋ฏธํฐ๋ก??๋ฌ
      //   globalHandleMenuClick('PSM0040', { 
      //     empNo: employeeData.EMP_NO,
      //     empNm: employeeData.EMP_NM 
      //   });
      // } else {
      //   showToast('๋ฉ๋ด ?์ค?์ ?ฐ๊ฒฐ?????์ต?๋ค.', 'error');
      // }
    }
  };

  /**
   * ?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ???ฐ๋ฅธ ๊ฒฝ๋ ฅ ?ผ๋ฒจ ๋ฐํ
   * AS-IS: ?์ฌ(1)๋ฉ?"?์ฌ???์ฌ??๊ฒฝ๋ ฅ", ?ธ์ฃผ(2)๋ฉ?"????์ฌ ๊ฒฝ๋ ฅ"
   * @param {string} ownOutsDiv - ?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ ('1': ?์ฌ, '2': ?ธ์ฃผ)
   * @param {string} type - ?ผ๋ฒจ ???('before' | 'after')
   * @returns {string} ๊ฒฝ๋ ฅ ?ผ๋ฒจ
   */
  const getCareerLabel = (ownOutsDiv: string, type: 'before' | 'after'): string => {
    if (ownOutsDiv === '1') {
      // ?์ฌ
      return type === 'before' ? '?์ฌ??๊ฒฝ๋ ฅ' : '?์ฌ??๊ฒฝ๋ ฅ';
    } else {
      // ?ธ์ฃผ
      return type === 'before' ? '???๊ฒฝ๋ ฅ' : '?์ฌ ๊ฒฝ๋ ฅ';
    }
  };

  /**
   * ?ฌ์?ด์ญ ๋ถ๋ฌ?ค๊ธฐ ?ธ๋ค??
   * ?ฌ์?ธ๋ ฅ?ํฉ(BSN0660P00) ?๋ฉด ๊ฐ๋ฐ ์ค?
   */
  const handleLoadProjectInput = () => {
    showToast('?ฌ์?ธ๋ ฅ?ํฉ(BSN0660P00) ?๋ฉด ๊ฐ๋ฐ์ค์?๋ค.', 'info');
  };

  /**
   * ?๋ก???๋ธ?ด๋ฆญ ?ธ๋ค??
   * ?๋ก??๋ชฉ๋ก?์ ??ชฉ???๋ธ?ด๋ฆญ?์ฌ ?์  ๋ชจ๋๋ก??ํ
   * @param {number} index - ?๋ก??๋ชฉ๋ก ?ธ๋ฑ??
   */
  const handleProfileDoubleClick = (index: number) => {
    if (index < 0 || index >= profileList.length) return;
    
    const profile = profileList[index];
    
    // AS-IS ๋ก์ง: ? ์ง๋ฅ????๋ก ๋ถ๋ฆฌ
    const strtDt = profile.STRT_DT || '';
    const endDt = profile.END_DT || '';
    
    // YYYYMMDD ?์??YYYY-MM ?์?ผ๋ก ๋ณ??
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
      strtDate: formatDateToMonth(strtDt), // YYYY-MM ?์?ผ๋ก ๋ณ??
      endDate: formatDateToMonth(endDt),   // YYYY-MM ?์?ผ๋ก ๋ณ??
      bsnNm: profile.BSN_NO || '',
      custNm: profile.MMBR_CO || ''
    });
    
    setNewFlag(false);
    
    // AS-IS ๋ก์ง: ?คํฌ?๋ฑ๋ก๋ด??ผ๋ก??ฑ๋ก???๋ก?์ธ์ง ์ฒดํฌ
    if (!profile.BSN_NO || profile.BSN_NO === '') {
      // ๋ชจ๋  ?๋ ฅ ??ชฉ ?๋ ฅ ๊ฐ??
      setEnabledInputItem(true);
    } else {
      // ๊ฐ๋ฐ?๊ฒฝ๋ง?๋นผ๊ณ  ?๋จธ์ง???๋ ฅ ๋ถ๊???
      setEnabledInputItem(false);
    }
  };

  /**
   * ? ๊ท ๋ฒํผ ?ด๋ฆญ ?ธ๋ค??
   * ?๋ก???๋ ฅ ?ผ์ ์ด๊ธฐ?ํ๊ณ?? ๊ท ?ฑ๋ก ๋ชจ๋๋ก??ํ
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
    // AS-IS: setEnabledInputItem(true) - ?๋ ฅ??ชฉ ?์ฑ??
    setInputEnabled(true);
  };

  /**
   * ???๋ฒํผ ?ด๋ฆญ ?ธ๋ค??
   * ????์ธ ?ค์ด?ผ๋ก๊ท??์
   */
  const handleSave = () => {
    if (!employeeData) {
      showToast('๋จผ์? ?ฌ์??๊ฒ?ํด์ฃผ์ธ??', 'warning');
      return;
    }

    if (!validateInputData()) {
      return;
    }

    // AS-IS ์ค๋ณต ์ฒดํฌ
    if (newFlag && checkProfileExisted(profileForm.bsnNo)) {
      showToast('?ด๋? ?ฑ๋ก???๋ก?์?๋ค.', 'warning');
      return;
    }

    // ????์ธ ?ค์ด?ผ๋ก๊ท??์
    setShowSaveConfirm(true);
  };

  /**
   * ????์ธ ?ค์ด?ผ๋ก๊ท??์ธ ?ธ๋ค??
   * ?๋ก???ฑ๋ก ?๋ ?์  API ?ธ์ถ
   */
  const handleSaveConfirm = async () => {
    setShowSaveConfirm(false);

    if (!employeeData) {
      showToast('?ฌ์ ?๋ณด๊ฐ ?์ต?๋ค.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const url = newFlag ? '/api/psm/profile/insert' : '/api/psm/profile/update';
      
      // strtDate? endDate?์ ?์ ์ถ์ถ (YYYY-MM ?์?์)
      if (!profileForm.strtDate || !profileForm.endDate) {
        showToast('?์?ผ์? ์ข๋ฃ?ผ์๋ฅ?๋ชจ๋ ?๋ ฅ?ด์ฃผ?ธ์.', 'error');
        return;
      }
      
      const { strtYear, strtMonth, endYear, endMonth } = extractYearMonthFromDateRange(
        profileForm.strtDate, 
        profileForm.endDate
      );

      // ๊ณตํต ?์ฒญ ?ฐ์ด??๊ตฌ์ฑ
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

      // Update ?์๋ง?seqNo ์ถ๊?
      const requestData = newFlag ? baseRequestData : {
        ...baseRequestData,
        seqNo: String(profileForm.seqNo)
      };

      const result = await callApi(url, requestData);
      
      if (result.success) {
        showToast(newFlag ? '?๋ก?์ด ?ฑ๋ก?์?ต๋??' : '?๋ก?์ด ?์ ?์?ต๋??', 'info');
        await loadProfileList(employeeData!.EMP_NO);
        handleNew();
      } else {
        showToast(result.message || '???์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.', 'error');
      }
    } catch (error) {
      console.error('?๋ก??????ค๋ฅ:', error);
      showToast('?๋ก?????์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ??  ๋ฒํผ ?ด๋ฆญ ?ธ๋ค??
   * ??  ?์ธ ?ค์ด?ผ๋ก๊ท??์
   */
  const handleDelete = async () => {
    if (!employeeData || !profileForm.seqNo) {
      showToast('?? ???๋ก?์ ? ํ?ด์ฃผ?ธ์.', 'warning');
      return;
    }

    const confirmMessage = profileForm.bsnNo 
      ? '?๋ก?ํธ๊ด๋ฆฌ์???ฑ๋ก???ฌ์?ํฉ ?ด์ญ???๋ก???๋?? ๊ทธ๋???? ?์๊ฒ ์ต?๊น?'
      : '? ํ???๋ก?์ ?? ?์๊ฒ ์ต?๊น?';

    setDeleteConfirmMessage(confirmMessage);
    setShowDeleteConfirm(true);
  };

  /**
   * ??  ?์ธ ?ค์ด?ผ๋ก๊ท??์ธ ?ธ๋ค??
   * ?๋ก????  API ?ธ์ถ
   */
  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);

    if (!employeeData) {
      showToast('?ฌ์ ?๋ณด๊ฐ ?์ต?๋ค.', 'error');
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
        showToast('?๋ก?์ด ?? ?์?ต๋??', 'info');
        await loadProfileList(employeeData.EMP_NO);
        handleNew();
      } else {
        showToast(result.message || '??  ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.', 'error');
      }
    } catch (error) {
      console.error('?๋ก????  ?ค๋ฅ:', error);
      showToast('?๋ก????  ์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ???๋ ๋ณ๊ฒ??ธ๋ค??
   * ?๋ก???๋ ฅ ?ผ์ ?๋ ๊ฐ?๋ณ๊ฒ?์ฒ๋ฆฌ
   * @param {keyof ProfileFormData} field - ๋ณ๊ฒฝํ  ?๋๋ช?
   * @param {string} value - ๋ณ๊ฒฝํ  ๊ฐ?
   */
  const handleFormChange = (field: keyof ProfileFormData, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  /**
   * AS-IS ๊ฒฝ๋ ฅ ๋ณ๊ฒ????๋ ๊ณ์ฐ
   * ?๋ก??๋ณ๊ฒ???๊ฒฝ๋ ฅ???๋?ผ๋ก ?ฌ๊ณ??
   */
  const handleCareerChange = () => {
    calculateCareer('ALL');
  };

  useEffect(() => {
    initializeData();
  }, []);

  // ??๋ชจ๋?์ ๋ถ๋ช?props ๋ณ๊ฒ????ฌ์กฐ??
  useEffect(() => {
    console.log('[PSM0050M00] useEffect triggered:', { isTabMode, parentEmpNo, parentEmpNm });
    if (parentEmpNo && parentEmpNo.trim() !== '') {
      console.log('[PSM0050M00] Loading employee info for:', parentEmpNo);
      setSearchEmpNm(parentEmpNm || '');
      // ?๋?ผ๋ก ?ฌ์ ?๋ณด ์กฐํ ๋ฐ??๋ก??์กฐํ๊น์? ?ํ
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
    { headerName: '?๋ก?ํธ๋ช?, field: 'PRJT_NM', width: 250 },
    { headerName: '?์?์', field: 'STRT_YM', width: 100 },
    { headerName: '์ข๋ฃ?์', field: 'END_YM', width: 100 },
    { headerName: '๊ฐ์??, field: 'IN_MCNT', width: 120 },
    { headerName: '๊ณ ๊ฐ??, field: 'MMBR_CO', width: 150 },
    { headerName: '?ด๋น?๋ฌด', field: 'CHRG_WRK_NM', width: 100 },
    { headerName: '๊ฐ๋ฐ?๊ฒฝ', field: 'DVLP_ENVR', width: 250 },
    { headerName: '?ฌ์๋ฒํธ', field: 'BSN_NO', width: 150 },
    { headerName: '?ฑ๋ก??, field: 'REG_DT', width: 130 },
    { headerName: '?ฑ๋ก??, field: 'CHNGR_NM', width: 100 },
    { headerName: '๋น๊ณ ', field: 'RMK', width: 400 }
  ];

  /**
   * AS-IS CommMethods.setDateFormat ?จ์? ?์ผ??๊ธฐ๋ฅ
   * YYYYMMDD ?์??YYYY/MM/DD ?์?ผ๋ก ๋ณ??
   * @param {string} dateStr - YYYYMMDD ?์??? ์ง ๋ฌธ์??
   * @returns {string} YYYY/MM/DD ?์??? ์ง ๋ฌธ์??
   */
  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length < 8) return '';
    
    // YYYYMMDD ?์??YYYY/MM/DD ?์?ผ๋ก ๋ณ??
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return `${year}/${month}/${day}`;
  };

  /**
   * AG-Grid ์ค๋น??๋ฃ ?ธ๋ค??
   * ๊ทธ๋ฆฌ??API ์ฐธ์กฐ ???๋ฐ?์ปฌ๋ผ ?ฌ๊ธฐ ?๋ ์กฐ์ 
   * @param {GridReadyEvent} params - AG-Grid ์ค๋น??๋ฃ ?ด๋ฒค???๋ผ๋ฏธํฐ
   */
  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
  };

  // ?๋??๋ฆฌ์ฌ?ด์ฆ ?์??์ปฌ๋ผ ?ฌ๊ธฐ ์กฐ์ 
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
      {/* ์กฐํ ?์ญ */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            {/* 1??*/}
            <tr className="search-tr">
              <th className="search-th">?ฌ์๋ช?/th>
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
                      placeholder="?ฌ์๋ช?
                      disabled={isTabMode}
                    />
                    <button 
                      type="button"
                      onClick={handleEmpSearch}
                      className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded border border-blue-500 hover:border-blue-600 transition-colors shadow-sm disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
                      title="?ฌ์ ๊ฒ??
                      disabled={isTabMode || !isEnableSrchEmpAuthority()}
                    >
                      <img 
                        src="/icon_search_bk.svg" 
                        alt="๊ฒ?? 
                        className="w-4 h-4 filter brightness-0 invert"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <span className="hidden text-sm font-medium text-white">๊ฒ??/span>
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

              <th className="search-th">?์</th>
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

              <th className="search-th">์ง์ฑ</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.DUTY_CD_NM || ''}
                  readOnly
                />
              </td>

              <th className="search-th">๊ทผ๋ฌด?ํ</th>
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

              <th className="search-th">?์ฌ?ผ์</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.ENTR_DT || ''}
                  readOnly
                />
              </td>

              <th className="search-th">?ด์ฌ?ผ์</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.RETIR_DT || ''}
                  readOnly
                />
              </td>

              <th className="search-th">?๋ ฅ/?๊ณต</th>
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

              <th className="search-th">?๊ฒฉ์ฆ?์ทจ๋??/th>
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

              <th className="search-th">๊ฒฝ๋ ฅ</th>
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
                  <span className="m-0">๊ฐ์</span>
                </div>
              </td>

              <th className="search-th">?ฑ๊ธ</th>
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
                  ์กฐํ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ๊ฐ๋ฐ ?๋ก???ด์ญ AG-Grid */}
      <div className="gridbox-div mb-4">
        <div className="grid-header">
          <div className="flex justify-between items-center w-full">
            <h3>๊ฐ๋ฐ ?๋ก???ด์ญ</h3>
            <div className="flex gap-2">
              <button 
                type="button" 
                className="btn-base btn-excel"
                onClick={handleProfileExcel}
              >
                CSV
              </button>
              {/* ??๋ชจ๋?์๋ง??๋ก???ฑ๋ก ๋ฒํผ ?์ */}
              {isTabMode && (
                <button 
                  type="button" 
                  className="btn-base btn-act"
                  onClick={handleProfileRegist}
                >
                  ?๋ก?๋ฑ๋ก?
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

      {/* ?์ด๋ธ??์ญ */}
      <div className="box-wrap">
        <div className="tit_area">
          <h3>
            ?๋ก??๊ฒฝ๋ ฅ
            <span className="ml-2 text-sm text-gray-500 font-normal">
              (๊ธฐ์??? {profileCarrData?.calcStadDt ? profileCarrData.calcStadDt : ''})
            </span>
          </h3>
        </div>
        
        {/* ?์ด๋ธ?*/}
        <table className="form-table w-full mb-4">
          <tbody>
            {/* 1?? ?๋ ฅ ๊ธฐ์? */}
            <tr className="form-tr">
              <th className="form-th w-[130px]">?๋ ฅ๊ธฐ์?</th>
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
                 ?ฉ๊ณ
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
             {/* 2?? ๊ธฐ์ ?๊ฒฉ ๊ธฐ์? */}
             <tr className="form-tr">
               <th className="form-th w-[130px]">๊ธฐ์ ?๊ฒฉ๊ธฐ์?</th>
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
                 ?ฉ๊ณ
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

        {/* ??๋ชจ๋๊ฐ ?๋ ?๋ง ?๋ก???์ฑ ?์ญ ?์ */}
        {!isTabMode && (
          <div className="tit_area">
            <h3>?๋ก???์ฑ</h3>
            <div>
              <button
                className="btn-base btn-act"
                onClick={handleLoadProjectInput}
              >
                ?ฌ์?ด์ญ ๋ถ๋ฌ?ค๊ธฐ
              </button>
            </div>
          </div>
        )}

        {/* ??๋ชจ๋๊ฐ ?๋ ?๋ง ?๋ก???๋ ฅ ???์ */}
        {!isTabMode && (
          <div className="gridbox-div mb-4">
          <div className="grid-scroll-wrap">
            <table className="grid-table">
              <thead>
                <tr>
                  <th className="grid-th">?์?ผ์</th>
                  <th className="grid-th">์ข๋ฃ?ผ์</th>
                  <th className="grid-th">?๋ก?ํธ๋ช?/th>
                  <th className="grid-th">๊ณ ๊ฐ??/th>
                  <th className="grid-th">?ด๋น?๋ฌด</th>
                                     <th className="grid-th flex justify-between items-center">๊ฐ๋ฐ?๊ฒฝ/DBMS/?ธ์ด<button type="button" className="btn-base btn-etc" onClick={handleDevEnvPopup}>? ํ</button></th>
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
                      <option value="">? ํ?์ธ??/option>
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

        {/* ??๋ชจ๋๊ฐ ?๋ ?๋ง ?๋ก???๋ ฅ ???์ */}
        {!isTabMode && (
          <div className="flex justify-end gap-2 mt-2">
            <button 
              className="btn-base btn-delete"
              onClick={handleDelete}
              disabled={!profileForm.seqNo}
            >
              ?? 
            </button>
            <button 
              className="btn-base btn-etc"
              onClick={handleNew}
            >
              ? ๊ท
            </button>
            <button 
              className="btn-base btn-act"
              onClick={handleSave}
            >
              ???
            </button>
          </div>
        )}
      </div>



      {showDevEnvPopup && (
        <PSM0060M00
          onConfirm={(data) => {
            // AS-IS ๋ก์ง: ? ํ????ชฉ?ค์ ?ผํ๋ก?๊ตฌ๋ถ?์ฌ ?ฐ๊ฒฐ
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



      {/* ??  ?์ธ ?ค์ด?ผ๋ก๊ท?*/}
      <ConfirmDialog
        isVisible={showDeleteConfirm}
        type="warning"
        message={deleteConfirmMessage}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* ????์ธ ?ค์ด?ผ๋ก๊ท?*/}
      <ConfirmDialog
        isVisible={showSaveConfirm}
        type="info"
        message={newFlag ? '?๋ก?์ ?ฑ๋ก?์๊ฒ ์ต?๊น?' : '?๋ก?์ ?์ ?์๊ฒ ์ต?๊น?'}
        onConfirm={handleSaveConfirm}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </div>
  );
};

export default PSM0050M00;


