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
 * ?¬ì› ê¸°ë³¸ ?•ë³´ ?°ì´???¸í„°?˜ì´??
 * 
 * AS-IS PSM_01_0101_S ?„ë¡œ?œì??ì„œ ë°˜í™˜?˜ëŠ” ?¬ì› ?•ë³´?€ ?™ì¼??êµ¬ì¡°
 * 
 * @property {string} EMP_NO - ?¬ì›ë²ˆí˜¸
 * @property {string} OWN_OUTS_DIV - ?´ë?/?¸ì£¼ êµ¬ë¶„ (1: ?´ë?, 2: ?¸ì£¼)
 * @property {string} OWN_OUTS_NM - ?´ë?/?¸ì£¼ êµ¬ë¶„ëª?
 * @property {string} EMP_NM - ?¬ì›ëª?
 * @property {string} ENTR_DT - ?…ì‚¬??(YYYYMMDD)
 * @property {string} RETIR_DT - ?´ì‚¬??(YYYYMMDD)
 * @property {string} PRJ_YN - ?„ë¡œ?íŠ¸ ì°¸ì—¬ ?¬ë? (Y/N)
 * @property {string} BSN_NO - ?¬ì—…ë²ˆí˜¸
 * @property {string} BSN_NM - ?¬ì—…ëª?
 * @property {string} DEV_NM - ê°œë°œëª?
 * @property {string} CO_CD - ?Œì‚¬ì½”ë“œ
 * @property {string} CO_NM - ?Œì‚¬ëª?
 * @property {string} EXEC_IN_STRT_DT - ?¤í–‰ì¤??œì‘??
 * @property {string} EXEC_IN_END_DT - ?¤í–‰ì¤?ì¢…ë£Œ??
 * @property {string} CHRG_WRK - ?´ë‹¹?…ë¬´
 * @property {string} EXEC_IN_YN - ?¤í–‰ì¤??¬ë? (Y/N)
 * @property {string} HQ_DIV_CD - ë³¸ë?êµ¬ë¶„ì½”ë“œ
 * @property {string} HQ_DIV_NM - ë³¸ë?êµ¬ë¶„ëª?
 * @property {string} DEPT_DIV_CD - ë¶€?œêµ¬ë¶„ì½”??
 * @property {string} DEPT_DIV_NM - ë¶€?œêµ¬ë¶„ëª…
 * @property {string} DUTY_CD - ì§ì±…ì½”ë“œ
 * @property {string} DUTY_CD_NM - ì§ì±…ëª?
 * @property {string} DUTY_DIV_CD - ì§ì±…êµ¬ë¶„ì½”ë“œ
 * @property {string} TCN_GRD - ê¸°ìˆ ?±ê¸‰
 * @property {string} TCN_GRD_NM - ê¸°ìˆ ?±ê¸‰ëª?
 * @property {string} WKG_ST_DIV - ê·¼ë¬´?íƒœêµ¬ë¶„
 * @property {string} WKG_ST_DIV_NM - ê·¼ë¬´?íƒœêµ¬ë¶„ëª?
 * @property {string} RMK - ë¹„ê³ 
 * @property {string} PARTY_NM - ?Œì†ëª?
 * @property {string} EXEC_ING_BSN_NM - ?¤í–‰ì¤??¬ì—…ëª?
 * @property {string} EXEC_ING_YN - ?¤í–‰ì¤??¬ë? (Y/N)
 * @property {string} CSF_CO_CD - CSF ?Œì‚¬ì½”ë“œ
 * @property {string} OUTS_FIX_YN - ?¸ì£¼ê³ ì •?¬ë? (Y/N)
 * @property {string} LAST_SCHL - ìµœì¢…?™ë ¥
 * @property {string} MAJR - ?„ê³µ
 * @property {string} LAST_GRAD_DT - ìµœì¢…ì¡¸ì—…??(YYYYMMDD)
 * @property {string} CTQL_CD_NM - ?ê²©ì¦ëª…
 * @property {string} CTQL_CD - ?ê²©ì¦ì½”??
 * @property {string} CTQL_PUR_DT - ?ê²©ì¦ì·¨?ì¼ (YYYYMMDD)
 * @property {string} CARR_MCNT - ê²½ë ¥ê°œì›”??
 * @property {string} ENTR_BEF_CARR - ?…ì‚¬?„ê²½??
 * @property {string} CARR_CALC_STND_DT - ê²½ë ¥ê³„ì‚°ê¸°ì???(YYYYMMDD)
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
 * PSM0050M00 - ê°œë°œ???„ë¡œ??ê´€ë¦??”ë©´
 * 
 * ê°œë°œ?ì˜ ?„ë¡œ???•ë³´ë¥?ê´€ë¦¬í•˜???µì‹¬ ?”ë©´?…ë‹ˆ??
 * ?¬ì› ?•ë³´ ì¡°íšŒ, ?„ë¡œ???±ë¡/?˜ì •/?? œ, ê²½ë ¥ ê³„ì‚° ?±ì˜ ê¸°ëŠ¥???œê³µ?©ë‹ˆ??
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ì› ?•ë³´ ì¡°íšŒ ë°??„ë¡œ??ê´€ë¦?
 * - ?„ë¡œ???±ë¡/?˜ì •/?? œ (CRUD)
 * - ê²½ë ¥ ê³„ì‚° ë°??œì‹œ (?…ì‚¬ ????ê²½ë ¥ ë¶„ë¦¬)
 * - ê°œë°œ?˜ê²½ ? íƒ ?ì—… (PSM0060M00)
 * - ?¬ì› ê²€???ì—… (COMZ080P00)
 * - CSV ?¤ìš´ë¡œë“œ (AG Grid Community ë²„ì „)
 * - AG Gridë¥??œìš©???„ë¡œ??ëª©ë¡ ?œì‹œ
 * 
 * AS-IS: PSM_03_0110.mxml (ê°œë°œ?„ë¡œ???±ë¡ ë°??˜ì •)
 * TO-BE: React ê¸°ë°˜ ?„ë¡œ??ê´€ë¦??”ë©´
 * 
 * ?¬ìš© ?ˆì‹œ:
 * ```tsx
 * // ?…ë¦½ ?”ë©´?¼ë¡œ ?¬ìš©
 * <PSM0050M00 />
 * 
 * // ??ëª¨ë“œë¡??¬ìš© (PSM1010M00 ?´ë?)
 * <PSM0050M00 isTabMode={true} parentEmpNo="10001" parentEmpNm="?ê¸¸?? />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */
interface PSM0050M00Props {
  /** ??ëª¨ë“œ ?¬ë? (PSM1010M00????œ¼ë¡??¬ìš©????true) */
  isTabMode?: boolean;
  /** ë¶€ëª?ì»´í¬?ŒíŠ¸?ì„œ ?„ë‹¬ë°›ì? ?¬ì›ë²ˆí˜¸ */
  parentEmpNo?: string;
  /** ë¶€ëª?ì»´í¬?ŒíŠ¸?ì„œ ?„ë‹¬ë°›ì? ?¬ì›ëª?*/
  parentEmpNm?: string;
  /** ?„ë¡œ???±ë¡ ë²„íŠ¼ ?´ë¦­ ???¸ì¶œ??ì½œë°± */
  onProfileRegist?: (empNo: string) => void;
}

// API ?¸ì¶œ???„í•œ ê³µí†µ ?¨ìˆ˜ (ì»´í¬?ŒíŠ¸ ?¸ë?ë¡??´ë™)
const callApi = async (url: string, data: any): Promise<any> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`API ?¸ì¶œ ?¤íŒ¨: ${response.status}`);
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
  
  // ?…ë ¥ ?„ë“œ refs
  const strtDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const prjtNmRef = useRef<HTMLInputElement>(null);
  const mmbrCoRef = useRef<HTMLInputElement>(null);
  const chrgWrkRef = useRef<HTMLSelectElement>(null);
  const delpEnvrRef = useRef<HTMLInputElement>(null);

  /**
   * AS-IS ê¶Œí•œ ì²´í¬ ë¡œì§
   * ê²½ì˜ì§€?ë³¸ë¶€ (01), ë³¸ë???00), ë¶€?œì¥(10), ?ì—…ë³¸ë? ?ì—…?€??02)ë§??¬ì› ì¡°íšŒ ê°€??
   * @returns {boolean} ?¬ì› ì¡°íšŒ ê¶Œí•œ ?¬ë?
   */
  const isEnableSrchEmpAuthority = (): boolean => {
    const hqDivCd = user?.hqDivCd || '';
    const authCd = user?.authCd || '';
    const deptTp = user?.deptTp || '';

    if (hqDivCd === '01' || deptTp === 'ADM') return true; // ê²½ì˜ì§€?ë³¸ë¶€
    if (authCd === '00') return true; // ë³¸ë???
    if (authCd === '10') return true; // ë¶€?œì¥
    if (hqDivCd === '02' || deptTp === 'BIZ') return true; // ?ì—…ë³¸ë? ?ì—…?€??

    return false;
  };

  /**
   * AS-IS ?…ë ¥ê°?ê²€ì¦?ë¡œì§
   * ?„ìˆ˜ ?…ë ¥ ?„ë“œ ê²€ì¦?ë°??¤ë¥˜ ???´ë‹¹ ?„ë“œ???¬ì»¤??
   * @returns {boolean} ê²€ì¦??µê³¼ ?¬ë?
   */
  const validateInputData = (): boolean => {
    const { strtDate, endDate, prjtNm, mmbrCo, delpEnvr, chrgWrk } = profileForm;

    if (!strtDate || strtDate === '') {
      showToast('?œì‘?¼ìë¥??…ë ¥??ì£¼ì‹­?œìš”.', 'error');
      setTimeout(() => strtDateRef.current?.focus(), 100);
      return false;
    }

    if (!endDate || endDate === '') {
      showToast('ì¢…ë£Œ?¼ìë¥??…ë ¥??ì£¼ì‹­?œìš”.', 'error');
      setTimeout(() => endDateRef.current?.focus(), 100);
      return false;
    }

    if (prjtNm === '') {
      showToast('?„ë¡œ?íŠ¸ëª…ì„ ?…ë ¥??ì£¼ì‹­?œìš”.', 'error');
      setTimeout(() => prjtNmRef.current?.focus(), 100);
      return false;
    }

    if (mmbrCo === '') {
      showToast('ê³ ê°?¬ë? ?…ë ¥??ì£¼ì‹­?œìš”.', 'error');
      setTimeout(() => mmbrCoRef.current?.focus(), 100);
      return false;
    }

    if (chrgWrk === '') {
      showToast('?´ë‹¹?…ë¬´ë¥??…ë ¥??ì£¼ì‹­?œìš”.', 'error');
      setTimeout(() => chrgWrkRef.current?.focus(), 100);
      return false;
    }

    if (delpEnvr === '') {
      showToast('ê°œë°œ?˜ê²½/DBMS/?¸ì–´ë¥??…ë ¥??ì£¼ì‹­?œìš”.', 'error');
      setTimeout(() => delpEnvrRef.current?.focus(), 100);
      return false;
    }

    // ?œì‘?¼ìê°€ ì¢…ë£Œ?¼ìë³´ë‹¤ ??? ê²½ìš° ì²´í¬
    if (strtDate > endDate) {
      showToast('?œì‘?¼ì??ì¢…ë£Œ?¼ìë³´ë‹¤ ê°™ê±°???‘ì•„???©ë‹ˆ?? ê°œë°œê¸°ê°„???¤ì‹œ ?…ë ¥??ì£¼ì‹­?œìš”.', 'error');
      setTimeout(() => strtDateRef.current?.focus(), 100);
      return false;
    }

    return true;
  };

  /**
   * AS-IS ê²½ë ¥ê°œì›”???©ê³„ êµ¬í•˜ê¸?
   * ?„ê³¼ ê°œì›”???…ë ¥ë°›ì•„ ì´?ê°œì›”?˜ë¡œ ë³€??
   * @param {string} strYCnt - ?„ìˆ˜
   * @param {string} strMCnt - ê°œì›”??
   * @returns {string} ì´?ê°œì›”??
   */
  const getCarrMCnt = (strYCnt: string, strMCnt: string): string => {
    if (strYCnt === '' && strMCnt === '') return '';
    
    const nYcnt = parseInt(strYCnt) || 0;
    const nMCnt = parseInt(strMCnt) || 0;
    
    return String((nYcnt * 12) + nMCnt);
  };

  /**
   * AS-IS ?œì‘?¼ì ?…ë ¥ ?°ì´???„ì›”???©ì¹˜ê¸?
   * ?„ê³¼ ?”ì„ ?…ë ¥ë°›ì•„ YYYYMMDD ?•ì‹?¼ë¡œ ë³€??(?¼ì????ƒ 01)
   * @param {string} year - ?„ë„
   * @param {string} month - ??
   * @returns {string} YYYYMMDD ?•ì‹???œì‘?¼ì
   */
  const packStrtDate = (year: string, month: string): string => {
    return year + month + '01';
  };

  /**
   * AS-IS ì¢…ë£Œ?¼ì ?…ë ¥ ?°ì´???„ì›”???©ì¹˜ê¸?
   * ?„ê³¼ ?”ì„ ?…ë ¥ë°›ì•„ YYYYMMDD ?•ì‹?¼ë¡œ ë³€??(?¼ì???´ë‹¹ ?”ì˜ ë§ˆì?ë§???
   * @param {string} year - ?„ë„
   * @param {string} month - ??
   * @returns {string} YYYYMMDD ?•ì‹??ì¢…ë£Œ?¼ì
   */
  const packEndDate = (year: string, month: string): string => {
    const arrLastDay = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // ?¤ë…„??ê²½ìš°
    const yearNum = parseInt(year);
    if (yearNum % 4 === 0 && (yearNum % 100 !== 0 || yearNum % 400 === 0)) {
      arrLastDay[2] = 29; // ?¤ë…„ 2??
    }
    
    return year + month + String(arrLastDay[parseInt(month)]);
  };

  /**
   * AS-IS ê²½ë ¥ ê³„ì‚° ë¡œì§
   * ?„ë¡œ??ë¦¬ìŠ¤?¸ë? ê¸°ë°˜?¼ë¡œ ?…ì‚¬???…ì‚¬??ê²½ë ¥??ê³„ì‚°
   * @param {string} kb - ê³„ì‚° ?€??('ALL', 'Before', 'After')
   */
  const calculateCareer = (kb: string) => {
    if (!employeeData || !profileList.length) return;

    const strEntrYm = employeeData.ENTR_DT?.replace(/\//g, '').substring(0, 6) || '';
    
    let nBefCarrMcnt = 0; // ?…ì‚¬??ê²½ë ¥ê°œì›”??
    let nAftCarrMcnt = 0; // ?…ì‚¬??ê²½ë ¥ê°œì›”??
    
    const now = new Date();
    const nowYearMonth = now.getFullYear().toString() + 
      String(now.getMonth() + 1).padStart(2, '0');

    profileList.forEach(profile => {
      const strDevStrtYm = profile.STRT_YM?.replace(/\//g, '') || '';
      const strDevEndYm = (profile.END_YM?.replace(/\//g, '') || '') > nowYearMonth 
        ? nowYearMonth 
        : profile.END_YM?.replace(/\//g, '') || '';

      if (employeeData.OWN_OUTS_DIV === '1') {
        // ?ì‚¬??ê²½ìš°
        if (Number(strEntrYm) > Number(strDevStrtYm)) {
          // ?…ì‚¬??ê²½ë ¥
          nBefCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        } else {
          // ?…ì‚¬??ê²½ë ¥
          nAftCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        }
      } else {
        // ?¸ì£¼??ê²½ìš°
        if (!profile.BSN_NO || profile.BSN_NO === '') {
          // ?€?¬ê°œë°œê²½??
          nBefCarrMcnt += getMonthCnt(strDevStrtYm, strDevEndYm);
        } else {
          // ?ì‚¬ê°œë°œê²½ë ¥
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
   * AS-IS ê°œì›”??ê³„ì‚°
   * ?œì‘?„ì›”ê³?ì¢…ë£Œ?„ì›” ?¬ì´??ê°œì›”?˜ë? ê³„ì‚°
   * @param {string} startYm - ?œì‘?„ì›” (YYYYMM ?•ì‹)
   * @param {string} endYm - ì¢…ë£Œ?„ì›” (YYYYMM ?•ì‹)
   * @returns {number} ê°œì›”??
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
   * ê°œì›”?˜ë? ?„ê³¼ ê°œì›”ë¡?ë³€?˜í•˜??? í‹¸ë¦¬í‹° ?¨ìˆ˜
   * @param {number} carrMcnt - ê²½ë ¥ ê°œì›”??
   * @returns {{years: number, months: number}} ?„ê³¼ ê°œì›”
   */
  const convertMonthsToYearsAndMonths = (carrMcnt: number) => {
    const years = Math.floor(carrMcnt / 12);
    const months = carrMcnt - (years * 12);
    return { years, months };
  };

  /**
   * YYYY-MM ?•ì‹??? ì§œ?ì„œ ?„ê³¼ ?”ì„ ì¶”ì¶œ?˜ëŠ” ? í‹¸ë¦¬í‹° ?¨ìˆ˜
   * @param {string} startDate - ?œì‘?¼ì (YYYY-MM ?•ì‹)
   * @param {string} endDate - ì¢…ë£Œ?¼ì (YYYY-MM ?•ì‹)
   * @returns {{strtYear: string, strtMonth: string, endYear: string, endMonth: string}} ?„ì›” ?•ë³´
   */
  const extractYearMonthFromDateRange = (startDate: string, endDate: string) => {
    const strtYear = startDate.substring(0, 4);
    const strtMonth = startDate.substring(5, 7);
    const endYear = endDate.substring(0, 4);
    const endMonth = endDate.substring(5, 7);
    return { strtYear, strtMonth, endYear, endMonth };
  };

  /**
   * AS-IS ?…ì‚¬?„ê²½???”ë©´ ì¶œë ¥
   * ê°œì›”?˜ë? ?„ê³¼ ê°œì›”ë¡?ë³€?˜í•˜???íƒœ???€??
   * @param {number} carrMcnt - ê²½ë ¥ ê°œì›”??
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
   * AS-IS ?…ì‚¬?„ê²½???”ë©´ ì¶œë ¥
   * ê°œì›”?˜ë? ?„ê³¼ ê°œì›”ë¡?ë³€?˜í•˜???íƒœ???€??
   * @param {number} carrMcnt - ê²½ë ¥ ê°œì›”??
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
   * AS-IS ê²½ë ¥?©ê³„ ?”ë©´ ì¶œë ¥
   * ê°œì›”?˜ë? ?„ê³¼ ê°œì›”ë¡?ë³€?˜í•˜???íƒœ???€??
   * @param {number} carrMcnt - ê²½ë ¥ ê°œì›”??
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
   * AS-IS ?„ë¡œ??ì¤‘ë³µ ì²´í¬
   * ?¬ì—…ë²ˆí˜¸ë¡??„ë¡œ??ì¤‘ë³µ ?±ë¡ ?¬ë? ?•ì¸
   * @param {string} bsnNo - ?¬ì—…ë²ˆí˜¸
   * @returns {boolean} ì¤‘ë³µ ?¬ë?
   */
  const checkProfileExisted = (bsnNo: string): boolean => {
    return profileList.some(profile => profile.BSN_NO === bsnNo);
  };

  /**
   * AS-IS ?…ë ¥ ?„ë“œ ?œì„±??ë¹„í™œ?±í™”
   * AS-IS ë¡œì§:
   * - ?œì‘?¼ì, ì¢…ë£Œ?¼ì, ?´ë‹¹?…ë¬´: enabled???°ë¼ ?œì–´
   * - ?„ë¡œ?íŠ¸ëª? ê³ ê°?? ê°œë°œ?˜ê²½: ??ƒ ?œì„±??(AS-IS?ì„œ ì£¼ì„ì²˜ë¦¬??
   * @param {boolean} enabled - ?œì„±???¬ë?
   */
  const setEnabledInputItem = (enabled: boolean) => {
    setInputEnabled(enabled);
  };

  /**
   * AS-IS ê°œë°œ?˜ê²½ ?…ë ¥ ?ì—…
   * ê°œë°œ?˜ê²½ ? íƒ ?ì—…???´ê¸°
   */
  const handleDevEnvPopup = () => {
    setShowDevEnvPopup(true);
  };

  /**
   * AS-IS ê²½ë ¥ ?€??ê¸°ëŠ¥ (ê°„ë‹¨???Œë¦¼?¼ë¡œ ?€ì²?
   * ê²½ë ¥ ?€?¥ì? ë³„ë„ ?ì—…?¼ë¡œ êµ¬í˜„ ?ˆì •
   */
  const handleCareerSave = () => {
    showToast('ê²½ë ¥ ?€??ê¸°ëŠ¥?€ ë³„ë„ ?ì—…?¼ë¡œ êµ¬í˜„?©ë‹ˆ??', 'info');
  };

  /**
   * AS-IS DataGrid ë²ˆí˜¸ ë§¤ê¸°???¨ìˆ˜
   * AG-Grid?ì„œ ??ë²ˆí˜¸ë¥??œì‹œ?˜ê¸° ?„í•œ ?Œë”??
   * @param {any} params - AG-Grid ?Œë¼ë¯¸í„°
   * @returns {string} ??ë²ˆí˜¸
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
   * ì´ˆê¸° ?°ì´??ë¡œë“œ
   * ê³µí†µì½”ë“œ ë¡œë“œ ë°?ê¶Œí•œ ì²´í¬
   */
  const initializeData = async () => {
    try {
      // ê³µí†µì½”ë“œ????ƒ ë¡œë“œ (?´ë‹¹?…ë¬´ ì½¤ë³´ë°•ìŠ¤??
      await loadCommonCodes();
      
      // ??ëª¨ë“œ??ê²½ìš° ë¶€ëª¨ë¡œë¶€???„ë‹¬ë°›ì? ?¬ì› ?•ë³´ ?¬ìš©
      if (isTabMode && parentEmpNo && parentEmpNm) {
        setSearchEmpNm(parentEmpNm);
        // ë¶€ëª¨ë¡œë¶€???„ë‹¬ë°›ì? ?¬ì› ?•ë³´ë¡?ì¡°íšŒ
        await searchEmployeeInfo('1', parentEmpNo, 'ALL');
      } else {
        // AS-IS?€ ?™ì¼??ì´ˆê¸° ?¤ì •
        if (user?.userId) {
          setSearchEmpNm(user.name || '');
        }
      }
      
      // ê¶Œí•œ ì²´í¬???¬ì› ê²€???œì—ë§??ìš©
      if (!isEnableSrchEmpAuthority()) {
        showToast('?¬ì› ì¡°íšŒ ê¶Œí•œ???†ìŠµ?ˆë‹¤.', 'warning');
      }
    } catch (error) {
      console.error('ì´ˆê¸°??ì¤??¤ë¥˜:', error);
      showToast('ì´ˆê¸°??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
    }
  };

  /**
   * ê³µí†µì½”ë“œ ë¡œë“œ
   * AS-IS: COM_03_0101_S ?„ë¡œ?œì? ?¸ì¶œ, ?Œë¼ë¯¸í„°: I_LRG_CSF_CD (?€ë¶„ë¥˜ì½”ë“œ)
   * ?´ë‹¹?…ë¬´ ì½¤ë³´ë°•ìŠ¤??ê³µí†µì½”ë“œ ì¡°íšŒ
   */
  const loadCommonCodes = async () => {
    try {
      const result = await callApi('/api/common/search', {
        largeCategoryCode: '107'
      });
      
      // API ?‘ë‹µ??success ?„ë“œê°€ ?†ìœ¼ë¯€ë¡?dataê°€ ?ˆìœ¼ë©??±ê³µ?¼ë¡œ ì²˜ë¦¬
      if (result.data && Array.isArray(result.data)) {
        setCommonCodes(result.data);
      } else {
        console.error('ê³µí†µì½”ë“œ API ?¤íŒ¨:', result);
      }
    } catch (error) {
      console.error('ê³µí†µì½”ë“œ ì¡°íšŒ ?¤ë¥˜:', error);
    }
  };

  /**
   * ?¬ì› ?•ë³´ ê²€??
   * AS-IS ë¡œì§???°ë¼ ?¬ì›ë²ˆí˜¸ ?ëŠ” ?¬ì›ëª…ìœ¼ë¡??¬ì› ?•ë³´ ì¡°íšŒ
   * @param {string} kb - ê²€???€??('1': ?¬ì›ë²ˆí˜¸, '2': ?¬ì›ëª?
   * @param {string} strEmp - ê²€?‰í•  ?¬ì›ë²ˆí˜¸ ?ëŠ” ?¬ì›ëª?
   * @param {string} strOutsOwn - ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ('ALL', '1': ?ì‚¬, '2': ?¸ì£¼)
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
        // AS-IS empBscInfSeltHandler ë¡œì§ê³??™ì¼
        if (result.data.length > 1) {
        // 2ê±??´ìƒ??ê²½ìš° ?¬ì› ? íƒ ?ì—… ?¸ì¶œ (AS-IS: COM_02_0410)
        // TO-BE: COMZ080P00 ?ì—… ?¸ì¶œ
        openEmployeeSearchPopup(kb, strEmp, strOutsOwn, result.data);
        return;
        } else {
          // ??ê±´ì¼ ê²½ìš° ?¬ì› ?•ë³´ ?¤ì •
          console.log('[PSM0050M00] Employee found:', result.data[0]);
          const employee = result.data[0];
          setEmployeeData(employee);
          
          // AS-IS?€ ?™ì¼?˜ê²Œ ?„ë¡œ???´ì—­ ì¡°íšŒ
          await loadProfileList(employee.EMP_NO);
          await loadProfileCarrData(employee.EMP_NO);
          
          // ?¬ì› ì¡°íšŒ ???„ë¡œ???…ë ¥ ??ì´ˆê¸°??(AS-IS: onClickBtnNew)
          handleNew();
        }
      } else {
        console.log('[PSM0050M00] No employee found');
        showToast('?¬ì› ?•ë³´ë¥?ì°¾ì„ ???†ìŠµ?ˆë‹¤.', 'warning');
      }
    } catch (error) {
      console.error('?¬ì› ?•ë³´ ì¡°íšŒ ?¤ë¥˜:', error);
      showToast('?¬ì› ?•ë³´ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ?„ë¡œ??ë¦¬ìŠ¤??ë¡œë“œ
   * ?¬ì›ë²ˆí˜¸ë¡??„ë¡œ??ëª©ë¡ ì¡°íšŒ
   * @param {string} empNo - ?¬ì›ë²ˆí˜¸
   */
  const loadProfileList = async (empNo: string) => {
    try {
      const result = await callApi('/api/psm/profile/list', {
        empNo: empNo,
        userId: user?.userId || 'system'
      });
      
      if (result.success) {
        // result.dataê°€ ë°°ì—´?¸ì? ?•ì¸?˜ê³  ?ˆì „?˜ê²Œ ?¤ì •
        const profileData = Array.isArray(result.data) ? result.data : [];
        setProfileList(profileData);
        
        // ?°ì´??ë¡œë“œ ??ì»¬ëŸ¼ ?¬ê¸° ì¡°ì •
        setTimeout(() => {
          if (gridApiRef.current) {
            gridApiRef.current.sizeColumnsToFit();
          }
        }, 200);
      }
    } catch (error) {
      console.error('?„ë¡œ??ë¦¬ìŠ¤??ì¡°íšŒ ?¤ë¥˜:', error);
      showToast('?„ë¡œ??ë¦¬ìŠ¤??ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
    }
  };

  /**
   * ?„ë¡œ??ê²½ë ¥ ?°ì´??ë¡œë“œ
   * ?¬ì›ë²ˆí˜¸ë¡?ê²½ë ¥ ê³„ì‚° ?°ì´??ì¡°íšŒ
   * @param {string} empNo - ?¬ì›ë²ˆí˜¸
   */
  const loadProfileCarrData = async (empNo: string) => {
    try {
      const result = await callApi('/api/psm/profile/carr-calc', {
        empNo: empNo,
        userId: user?.userId || 'system'
      });
      
      if (result.success && result.data && result.data.length > 0) {
        // AS-IS fnSelectProfileCarr ?¨ìˆ˜??aftCarrCalcHandler ë¡œì§
        const rec = result.data[0]; // ë°°ì—´??ì²?ë²ˆì§¸ ?”ì†Œ ?¬ìš©
        
        if (!rec) {
          // ?„ë¡œ??ê²½ë ¥ ì¶œë ¥ ??ª© Clear
          clearProfileCarr();
          return;
        }

        // ?™ë ¥ê¸°ì? ê²½ë ¥(?…ì‚¬???…ì‚¬??ê³??±ê¸‰
        const befMCnt = Number(rec.BEF_M_CNT || 0);
        const aftMCnt = Number(rec.AFT_M_CNT || 0);
        const totMCnt = befMCnt + aftMCnt;
        
        setProfileCarrData({
          calcStadDt: rec.CALC_STAD_DT || '',
          // ?™ë ¥ê¸°ì?
          entrBefInYcnt: Math.floor(befMCnt / 12),
          entrBefInMcnt: befMCnt - (Math.floor(befMCnt / 12) * 12),
          entrAftInYcnt: Math.floor(aftMCnt / 12),
          entrAftInMcnt: aftMCnt - (Math.floor(aftMCnt / 12) * 12),
          totCarrYcnt: Math.floor(totMCnt / 12),
          totCarrMcnt: totMCnt - (Math.floor(totMCnt / 12) * 12),
          adbgTcnGrdNm: rec.TCN_GRD_NM || '',
          adbgTcnGrdCd: rec.TCN_GRD || '',
          // ê¸°ìˆ ?ê²©ê¸°ì?
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
      console.error('?„ë¡œ??ê²½ë ¥ ê³„ì‚° ?°ì´??ì¡°íšŒ ?¤ë¥˜:', error);
    }
  };

  /**
   * ?„ë¡œ??ê²½ë ¥ ?°ì´??ì´ˆê¸°??
   * ê²½ë ¥ ê³„ì‚° ?°ì´?°ë? ê¸°ë³¸ê°’ìœ¼ë¡?ì´ˆê¸°??
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
   * ?¬ì› ê²€??ë²„íŠ¼ ?´ë¦­ ?¸ë“¤??
   * ?¬ì›ëª…ìœ¼ë¡??¬ì› ê²€???¤í–‰
   */
  const handleEmpSearch = () => {
    if (!searchEmpNm.trim()) {
      showToast('?¬ì›ëª…ì„ ?…ë ¥??ì£¼ì‹­?œìš”.', 'warning');
      return;
    }
    searchEmployeeInfo('2', searchEmpNm.trim(), 'ALL');
  };

  /**
   * ì¡°íšŒ ë²„íŠ¼ ?´ë¦­ ?¸ë“¤??
   * ?„ì¬ ? íƒ???¬ì›???„ë¡œ?„ê³¼ ê²½ë ¥ ?°ì´?°ë? ?ˆë¡œê³ ì¹¨
   */
  const handleRefreshData = () => {
    if (!employeeData?.EMP_NO.trim()) {
      showToast('?¬ì›ëª…ì„ ?…ë ¥??ì£¼ì‹­?œìš”.', 'warning');
      return;
    } else {
      loadProfileList(employeeData.EMP_NO);
      loadProfileCarrData(employeeData.EMP_NO);
    }
  };

  /**
   * AS-IS DblClick_COM_02_0410 ?¨ìˆ˜?€ ?™ì¼??ê¸°ëŠ¥
   * ?¬ì› ? íƒ ?ì—…?ì„œ ? íƒ???¬ì› ?•ë³´ ì²˜ë¦¬
   * @param {string} empNo - ? íƒ???¬ì›ë²ˆí˜¸
   * @param {string} empNm - ? íƒ???¬ì›ëª?
   * @param {string} ownOutsDiv - ?ì‚¬/?¸ì£¼ êµ¬ë¶„
   */
  /**
   * COMZ080P00 ?ì—… ?´ê¸° ?¨ìˆ˜
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
      
      // ?ì—…??ë¡œë“œ?????°ì´???„ì†¡
      popup.onload = () => {
        setTimeout(() => {
          sendDataToEmployeePopup(popup, searchType, searchValue, ownOutsDiv, empList);
        }, 500);
      };
    }
  };

  /**
   * ?ì—…???°ì´???„ì†¡
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
   * ë©”ì‹œì§€ ?˜ì‹  ì²˜ë¦¬
   */
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'EMP_SELECTED') {
        const selectedEmp = event.data.data;
        handleEmployeeSelected(selectedEmp.empNo, selectedEmp.empNm, selectedEmp.ownOutsDiv);
        
        // ?ì—… ?«ê¸°
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
    
    // AS-IS?€ ?™ì¼?˜ê²Œ ?„ë¡œ???´ì—­ ì¡°íšŒ
    loadProfileList(empNo);
    loadProfileCarrData(empNo);
    
    // ?¬ì› ì¡°íšŒ ???„ë¡œ???…ë ¥ ??ì´ˆê¸°??(AS-IS: onClickBtnNew)
    handleNew();
  };

  /**
   * ?„ë¡œ??ê²€??ë²„íŠ¼ ?´ë¦­ ?¸ë“¤??
   * ?„ì¬ ? íƒ???¬ì›???„ë¡œ??ëª©ë¡ ?ˆë¡œê³ ì¹¨
   */
  const handleProfileSearch = () => {
    if (!employeeData) {
      showToast('ë¨¼ì? ?¬ì›??ê²€?‰í•´ì£¼ì„¸??', 'warning');
      return;
    }
    loadProfileList(employeeData.EMP_NO);
  };

  /**
   * ?„ë¡œ???‘ì? ?¤ìš´ë¡œë“œ ?¸ë“¤??
   * CSV ?•íƒœë¡??°ì´???¤ìš´ë¡œë“œ (Community ë²„ì „ ?€??
   */
  const handleProfileExcel = () => {
    if (!profileList || profileList.length === 0) {
      showToast('?¤ìš´ë¡œë“œ???„ë¡œ???°ì´?°ê? ?†ìŠµ?ˆë‹¤.', 'warning');
      return;
    }

    try {
      // CSV ?•íƒœë¡??°ì´???´ë³´?´ê¸°
      const headers = ['?„ë¡œ?íŠ¸ëª?, '?œì‘?„ì›”', 'ì¢…ë£Œ?„ì›”', 'ê°œì›”??, 'ê³ ê°??, '?´ë‹¹?…ë¬´', 'ê°œë°œ?˜ê²½', '?¬ì—…ë²ˆí˜¸', '?±ë¡??, '?±ë¡??, 'ë¹„ê³ '];
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
      link.setAttribute('download', `${employeeData?.EMP_NM || ''}_?„ë¡œ???´ì—­.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('CSV ?¤ìš´ë¡œë“œê°€ ?„ë£Œ?˜ì—ˆ?µë‹ˆ??', 'info');
    } catch (error) {
      console.error('CSV ?¤ìš´ë¡œë“œ ?¤ë¥˜:', error);
      showToast('CSV ?¤ìš´ë¡œë“œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
    }
  };

  /**
   * ?„ë¡œ???±ë¡ ?ì—… ?¸ë“¤??
   */
  const handleProfileRegist = () => {
    if (isTabMode && employeeData?.EMP_NO) {
      showToast('ê°œë°œì¤‘ì…?ˆë‹¤.', 'error');
      // ??ëª¨ë“œ?ì„œ??COM0000M00???„ì—­ handleMenuClick ?¨ìˆ˜ë¥??¸ì¶œ
      // const globalHandleMenuClick = (window as any).handleMenuClick;
      // if (globalHandleMenuClick && typeof globalHandleMenuClick === 'function') {
      //   // ?¬ì›ë²ˆí˜¸ë¥??Œë¼ë¯¸í„°ë¡??„ë‹¬
      //   globalHandleMenuClick('PSM0040', { 
      //     empNo: employeeData.EMP_NO,
      //     empNm: employeeData.EMP_NM 
      //   });
      // } else {
      //   showToast('ë©”ë‰´ ?œìŠ¤?œì— ?°ê²°?????†ìŠµ?ˆë‹¤.', 'error');
      // }
    }
  };

  /**
   * ?ì‚¬/?¸ì£¼ êµ¬ë¶„???°ë¥¸ ê²½ë ¥ ?¼ë²¨ ë°˜í™˜
   * AS-IS: ?ì‚¬(1)ë©?"?…ì‚¬???…ì‚¬??ê²½ë ¥", ?¸ì£¼(2)ë©?"?€???ì‚¬ ê²½ë ¥"
   * @param {string} ownOutsDiv - ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ('1': ?ì‚¬, '2': ?¸ì£¼)
   * @param {string} type - ?¼ë²¨ ?€??('before' | 'after')
   * @returns {string} ê²½ë ¥ ?¼ë²¨
   */
  const getCareerLabel = (ownOutsDiv: string, type: 'before' | 'after'): string => {
    if (ownOutsDiv === '1') {
      // ?ì‚¬
      return type === 'before' ? '?…ì‚¬??ê²½ë ¥' : '?…ì‚¬??ê²½ë ¥';
    } else {
      // ?¸ì£¼
      return type === 'before' ? '?€??ê²½ë ¥' : '?ì‚¬ ê²½ë ¥';
    }
  };

  /**
   * ?¬ì…?´ì—­ ë¶ˆëŸ¬?¤ê¸° ?¸ë“¤??
   * ?¬ì…?¸ë ¥?„í™©(BSN0660P00) ?”ë©´ ê°œë°œ ì¤?
   */
  const handleLoadProjectInput = () => {
    showToast('?¬ì…?¸ë ¥?„í™©(BSN0660P00) ?”ë©´ ê°œë°œì¤‘ì…?ˆë‹¤.', 'info');
  };

  /**
   * ?„ë¡œ???”ë¸”?´ë¦­ ?¸ë“¤??
   * ?„ë¡œ??ëª©ë¡?ì„œ ??ª©???”ë¸”?´ë¦­?˜ì—¬ ?˜ì • ëª¨ë“œë¡??„í™˜
   * @param {number} index - ?„ë¡œ??ëª©ë¡ ?¸ë±??
   */
  const handleProfileDoubleClick = (index: number) => {
    if (index < 0 || index >= profileList.length) return;
    
    const profile = profileList[index];
    
    // AS-IS ë¡œì§: ? ì§œë¥????”ë¡œ ë¶„ë¦¬
    const strtDt = profile.STRT_DT || '';
    const endDt = profile.END_DT || '';
    
    // YYYYMMDD ?•ì‹??YYYY-MM ?•ì‹?¼ë¡œ ë³€??
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
      strtDate: formatDateToMonth(strtDt), // YYYY-MM ?•ì‹?¼ë¡œ ë³€??
      endDate: formatDateToMonth(endDt),   // YYYY-MM ?•ì‹?¼ë¡œ ë³€??
      bsnNm: profile.BSN_NO || '',
      custNm: profile.MMBR_CO || ''
    });
    
    setNewFlag(false);
    
    // AS-IS ë¡œì§: ?¤íˆ¬?…ë“±ë¡ë‚´??œ¼ë¡??±ë¡???„ë¡œ?„ì¸ì§€ ì²´í¬
    if (!profile.BSN_NO || profile.BSN_NO === '') {
      // ëª¨ë“  ?…ë ¥ ??ª© ?…ë ¥ ê°€??
      setEnabledInputItem(true);
    } else {
      // ê°œë°œ?˜ê²½ë§?ë¹¼ê³  ?˜ë¨¸ì§€???…ë ¥ ë¶ˆê???
      setEnabledInputItem(false);
    }
  };

  /**
   * ? ê·œ ë²„íŠ¼ ?´ë¦­ ?¸ë“¤??
   * ?„ë¡œ???…ë ¥ ?¼ì„ ì´ˆê¸°?”í•˜ê³?? ê·œ ?±ë¡ ëª¨ë“œë¡??„í™˜
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
    // AS-IS: setEnabledInputItem(true) - ?…ë ¥??ª© ?œì„±??
    setInputEnabled(true);
  };

  /**
   * ?€??ë²„íŠ¼ ?´ë¦­ ?¸ë“¤??
   * ?€???•ì¸ ?¤ì´?¼ë¡œê·??œì‹œ
   */
  const handleSave = () => {
    if (!employeeData) {
      showToast('ë¨¼ì? ?¬ì›??ê²€?‰í•´ì£¼ì„¸??', 'warning');
      return;
    }

    if (!validateInputData()) {
      return;
    }

    // AS-IS ì¤‘ë³µ ì²´í¬
    if (newFlag && checkProfileExisted(profileForm.bsnNo)) {
      showToast('?´ë? ?±ë¡???„ë¡œ?„ì…?ˆë‹¤.', 'warning');
      return;
    }

    // ?€???•ì¸ ?¤ì´?¼ë¡œê·??œì‹œ
    setShowSaveConfirm(true);
  };

  /**
   * ?€???•ì¸ ?¤ì´?¼ë¡œê·??•ì¸ ?¸ë“¤??
   * ?„ë¡œ???±ë¡ ?ëŠ” ?˜ì • API ?¸ì¶œ
   */
  const handleSaveConfirm = async () => {
    setShowSaveConfirm(false);

    if (!employeeData) {
      showToast('?¬ì› ?•ë³´ê°€ ?†ìŠµ?ˆë‹¤.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const url = newFlag ? '/api/psm/profile/insert' : '/api/psm/profile/update';
      
      // strtDate?€ endDate?ì„œ ?„ì›” ì¶”ì¶œ (YYYY-MM ?•ì‹?ì„œ)
      if (!profileForm.strtDate || !profileForm.endDate) {
        showToast('?œì‘?¼ì?€ ì¢…ë£Œ?¼ìë¥?ëª¨ë‘ ?…ë ¥?´ì£¼?¸ìš”.', 'error');
        return;
      }
      
      const { strtYear, strtMonth, endYear, endMonth } = extractYearMonthFromDateRange(
        profileForm.strtDate, 
        profileForm.endDate
      );

      // ê³µí†µ ?”ì²­ ?°ì´??êµ¬ì„±
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

      // Update ?œì—ë§?seqNo ì¶”ê?
      const requestData = newFlag ? baseRequestData : {
        ...baseRequestData,
        seqNo: String(profileForm.seqNo)
      };

      const result = await callApi(url, requestData);
      
      if (result.success) {
        showToast(newFlag ? '?„ë¡œ?„ì´ ?±ë¡?˜ì—ˆ?µë‹ˆ??' : '?„ë¡œ?„ì´ ?˜ì •?˜ì—ˆ?µë‹ˆ??', 'info');
        await loadProfileList(employeeData!.EMP_NO);
        handleNew();
      } else {
        showToast(result.message || '?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
      }
    } catch (error) {
      console.error('?„ë¡œ???€???¤ë¥˜:', error);
      showToast('?„ë¡œ???€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ?? œ ë²„íŠ¼ ?´ë¦­ ?¸ë“¤??
   * ?? œ ?•ì¸ ?¤ì´?¼ë¡œê·??œì‹œ
   */
  const handleDelete = async () => {
    if (!employeeData || !profileForm.seqNo) {
      showToast('?? œ???„ë¡œ?„ì„ ? íƒ?´ì£¼?¸ìš”.', 'warning');
      return;
    }

    const confirmMessage = profileForm.bsnNo 
      ? '?„ë¡œ?íŠ¸ê´€ë¦¬ì—???±ë¡???¬ì…?„í™© ?´ì—­???„ë¡œ???…ë‹ˆ?? ê·¸ë˜???? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?'
      : '? íƒ???„ë¡œ?„ì„ ?? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?';

    setDeleteConfirmMessage(confirmMessage);
    setShowDeleteConfirm(true);
  };

  /**
   * ?? œ ?•ì¸ ?¤ì´?¼ë¡œê·??•ì¸ ?¸ë“¤??
   * ?„ë¡œ???? œ API ?¸ì¶œ
   */
  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);

    if (!employeeData) {
      showToast('?¬ì› ?•ë³´ê°€ ?†ìŠµ?ˆë‹¤.', 'error');
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
        showToast('?„ë¡œ?„ì´ ?? œ?˜ì—ˆ?µë‹ˆ??', 'info');
        await loadProfileList(employeeData.EMP_NO);
        handleNew();
      } else {
        showToast(result.message || '?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
      }
    } catch (error) {
      console.error('?„ë¡œ???? œ ?¤ë¥˜:', error);
      showToast('?„ë¡œ???? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ???„ë“œ ë³€ê²??¸ë“¤??
   * ?„ë¡œ???…ë ¥ ?¼ì˜ ?„ë“œ ê°?ë³€ê²?ì²˜ë¦¬
   * @param {keyof ProfileFormData} field - ë³€ê²½í•  ?„ë“œëª?
   * @param {string} value - ë³€ê²½í•  ê°?
   */
  const handleFormChange = (field: keyof ProfileFormData, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  /**
   * AS-IS ê²½ë ¥ ë³€ê²????ë™ ê³„ì‚°
   * ?„ë¡œ??ë³€ê²???ê²½ë ¥???ë™?¼ë¡œ ?¬ê³„??
   */
  const handleCareerChange = () => {
    calculateCareer('ALL');
  };

  useEffect(() => {
    initializeData();
  }, []);

  // ??ëª¨ë“œ?ì„œ ë¶€ëª?props ë³€ê²????¬ì¡°??
  useEffect(() => {
    console.log('[PSM0050M00] useEffect triggered:', { isTabMode, parentEmpNo, parentEmpNm });
    if (parentEmpNo && parentEmpNo.trim() !== '') {
      console.log('[PSM0050M00] Loading employee info for:', parentEmpNo);
      setSearchEmpNm(parentEmpNm || '');
      // ?ë™?¼ë¡œ ?¬ì› ?•ë³´ ì¡°íšŒ ë°??„ë¡œ??ì¡°íšŒê¹Œì? ?˜í–‰
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
    { headerName: '?„ë¡œ?íŠ¸ëª?, field: 'PRJT_NM', width: 250 },
    { headerName: '?œì‘?„ì›”', field: 'STRT_YM', width: 100 },
    { headerName: 'ì¢…ë£Œ?„ì›”', field: 'END_YM', width: 100 },
    { headerName: 'ê°œì›”??, field: 'IN_MCNT', width: 120 },
    { headerName: 'ê³ ê°??, field: 'MMBR_CO', width: 150 },
    { headerName: '?´ë‹¹?…ë¬´', field: 'CHRG_WRK_NM', width: 100 },
    { headerName: 'ê°œë°œ?˜ê²½', field: 'DVLP_ENVR', width: 250 },
    { headerName: '?¬ì—…ë²ˆí˜¸', field: 'BSN_NO', width: 150 },
    { headerName: '?±ë¡??, field: 'REG_DT', width: 130 },
    { headerName: '?±ë¡??, field: 'CHNGR_NM', width: 100 },
    { headerName: 'ë¹„ê³ ', field: 'RMK', width: 400 }
  ];

  /**
   * AS-IS CommMethods.setDateFormat ?¨ìˆ˜?€ ?™ì¼??ê¸°ëŠ¥
   * YYYYMMDD ?•ì‹??YYYY/MM/DD ?•ì‹?¼ë¡œ ë³€??
   * @param {string} dateStr - YYYYMMDD ?•ì‹??? ì§œ ë¬¸ì??
   * @returns {string} YYYY/MM/DD ?•ì‹??? ì§œ ë¬¸ì??
   */
  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length < 8) return '';
    
    // YYYYMMDD ?•ì‹??YYYY/MM/DD ?•ì‹?¼ë¡œ ë³€??
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return `${year}/${month}/${day}`;
  };

  /**
   * AG-Grid ì¤€ë¹??„ë£Œ ?¸ë“¤??
   * ê·¸ë¦¬??API ì°¸ì¡° ?€??ë°?ì»¬ëŸ¼ ?¬ê¸° ?ë™ ì¡°ì •
   * @param {GridReadyEvent} params - AG-Grid ì¤€ë¹??„ë£Œ ?´ë²¤???Œë¼ë¯¸í„°
   */
  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
  };

  // ?ˆë„??ë¦¬ì‚¬?´ì¦ˆ ?œì—??ì»¬ëŸ¼ ?¬ê¸° ì¡°ì •
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
      {/* ì¡°íšŒ ?ì—­ */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            {/* 1??*/}
            <tr className="search-tr">
              <th className="search-th">?¬ì›ëª?/th>
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
                      placeholder="?¬ì›ëª?
                      disabled={isTabMode}
                    />
                    <button 
                      type="button"
                      onClick={handleEmpSearch}
                      className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded border border-blue-500 hover:border-blue-600 transition-colors shadow-sm disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
                      title="?¬ì› ê²€??
                      disabled={isTabMode || !isEnableSrchEmpAuthority()}
                    >
                      <img 
                        src="/icon_search_bk.svg" 
                        alt="ê²€?? 
                        className="w-4 h-4 filter brightness-0 invert"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <span className="hidden text-sm font-medium text-white">ê²€??/span>
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

              <th className="search-th">?Œì†</th>
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

              <th className="search-th">ì§ì±…</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.DUTY_CD_NM || ''}
                  readOnly
                />
              </td>

              <th className="search-th">ê·¼ë¬´?íƒœ</th>
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

              <th className="search-th">?…ì‚¬?¼ì</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.ENTR_DT || ''}
                  readOnly
                />
              </td>

              <th className="search-th">?´ì‚¬?¼ì</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full" 
                  value={employeeData?.RETIR_DT || ''}
                  readOnly
                />
              </td>

              <th className="search-th">?™ë ¥/?„ê³µ</th>
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

              <th className="search-th">?ê²©ì¦?ì·¨ë“??/th>
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

              <th className="search-th">ê²½ë ¥</th>
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
                  <span className="m-0">ê°œì›”</span>
                </div>
              </td>

              <th className="search-th">?±ê¸‰</th>
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
                  ì¡°íšŒ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ê°œë°œ ?„ë¡œ???´ì—­ AG-Grid */}
      <div className="gridbox-div mb-4">
        <div className="grid-header">
          <div className="flex justify-between items-center w-full">
            <h3>ê°œë°œ ?„ë¡œ???´ì—­</h3>
            <div className="flex gap-2">
              <button 
                type="button" 
                className="btn-base btn-excel"
                onClick={handleProfileExcel}
              >
                CSV
              </button>
              {/* ??ëª¨ë“œ?ì„œë§??„ë¡œ???±ë¡ ë²„íŠ¼ ?œì‹œ */}
              {isTabMode && (
                <button 
                  type="button" 
                  className="btn-base btn-act"
                  onClick={handleProfileRegist}
                >
                  ?„ë¡œ?„ë“±ë¡?
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

      {/* ?Œì´ë¸??ì—­ */}
      <div className="box-wrap">
        <div className="tit_area">
          <h3>
            ?„ë¡œ??ê²½ë ¥
            <span className="ml-2 text-sm text-gray-500 font-normal">
              (ê¸°ì??? {profileCarrData?.calcStadDt ? profileCarrData.calcStadDt : ''})
            </span>
          </h3>
        </div>
        
        {/* ?Œì´ë¸?*/}
        <table className="form-table w-full mb-4">
          <tbody>
            {/* 1?? ?™ë ¥ ê¸°ì? */}
            <tr className="form-tr">
              <th className="form-th w-[130px]">?™ë ¥ê¸°ì?</th>
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
                 ?©ê³„
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
             {/* 2?? ê¸°ìˆ ?ê²© ê¸°ì? */}
             <tr className="form-tr">
               <th className="form-th w-[130px]">ê¸°ìˆ ?ê²©ê¸°ì?</th>
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
                 ?©ê³„
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

        {/* ??ëª¨ë“œê°€ ?„ë‹ ?Œë§Œ ?„ë¡œ???‘ì„± ?ì—­ ?œì‹œ */}
        {!isTabMode && (
          <div className="tit_area">
            <h3>?„ë¡œ???‘ì„±</h3>
            <div>
              <button
                className="btn-base btn-act"
                onClick={handleLoadProjectInput}
              >
                ?¬ì…?´ì—­ ë¶ˆëŸ¬?¤ê¸°
              </button>
            </div>
          </div>
        )}

        {/* ??ëª¨ë“œê°€ ?„ë‹ ?Œë§Œ ?„ë¡œ???…ë ¥ ???œì‹œ */}
        {!isTabMode && (
          <div className="gridbox-div mb-4">
          <div className="grid-scroll-wrap">
            <table className="grid-table">
              <thead>
                <tr>
                  <th className="grid-th">?œì‘?¼ì</th>
                  <th className="grid-th">ì¢…ë£Œ?¼ì</th>
                  <th className="grid-th">?„ë¡œ?íŠ¸ëª?/th>
                  <th className="grid-th">ê³ ê°??/th>
                  <th className="grid-th">?´ë‹¹?…ë¬´</th>
                                     <th className="grid-th flex justify-between items-center">ê°œë°œ?˜ê²½/DBMS/?¸ì–´<button type="button" className="btn-base btn-etc" onClick={handleDevEnvPopup}>? íƒ</button></th>
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
                      <option value="">? íƒ?˜ì„¸??/option>
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

        {/* ??ëª¨ë“œê°€ ?„ë‹ ?Œë§Œ ?„ë¡œ???…ë ¥ ???œì‹œ */}
        {!isTabMode && (
          <div className="flex justify-end gap-2 mt-2">
            <button 
              className="btn-base btn-delete"
              onClick={handleDelete}
              disabled={!profileForm.seqNo}
            >
              ?? œ
            </button>
            <button 
              className="btn-base btn-etc"
              onClick={handleNew}
            >
              ? ê·œ
            </button>
            <button 
              className="btn-base btn-act"
              onClick={handleSave}
            >
              ?€??
            </button>
          </div>
        )}
      </div>



      {showDevEnvPopup && (
        <PSM0060M00
          onConfirm={(data) => {
            // AS-IS ë¡œì§: ? íƒ????ª©?¤ì„ ?¼í‘œë¡?êµ¬ë¶„?˜ì—¬ ?°ê²°
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



      {/* ?? œ ?•ì¸ ?¤ì´?¼ë¡œê·?*/}
      <ConfirmDialog
        isVisible={showDeleteConfirm}
        type="warning"
        message={deleteConfirmMessage}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* ?€???•ì¸ ?¤ì´?¼ë¡œê·?*/}
      <ConfirmDialog
        isVisible={showSaveConfirm}
        type="info"
        message={newFlag ? '?„ë¡œ?„ì„ ?±ë¡?˜ì‹œê² ìŠµ?ˆê¹Œ?' : '?„ë¡œ?„ì„ ?˜ì •?˜ì‹œê² ìŠµ?ˆê¹Œ?'}
        onConfirm={handleSaveConfirm}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </div>
  );
};

export default PSM0050M00;


