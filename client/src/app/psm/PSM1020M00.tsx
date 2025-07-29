'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import '../common/common.css';
import PSM1050M00 from './PSM1050M00';
import PSM0030P00 from './PSM0030P00';

// ?€???•ì˜
interface EmployeeData {
  EMP_NO?: string;
  OWN_OUTS_DIV_CD?: string;
  OWN_OUTS_DIV?: string;
  CRPN_NM?: string;
  ENTR_NO?: string;
  ENTR_CD?: string;
  EMP_NM?: string;
  EMP_ENG_NM?: string;
  RES_REG_NO?: string;
  BIR_YR_MN_DT?: string;
  SEX_DIV_CD?: string;
  SEX_DIV?: string;
  NTLT_DIV_CD?: string;
  NTLT_DIV?: string;
  ENTR_DT?: string;
  RETIR_DT?: string;
  HQ_DIV_CD?: string;
  HQ_DIV?: string;
  DEPT_DIV_CD?: string;
  DEPT_DIV?: string;
  DUTY_CD?: string;
  DUTY?: string;
  LAST_TCN_GRD?: string;
  LAST_TCN_GRD_CD?: string;
  EMAIL_ADDR?: string;
  MOB_PHN_NO?: string;
  HOME_TEL?: string;
  HOME_ZIP_NO?: string;
  HOME_ADDR?: string;
  HOME_DET_ADDR?: string;
  LAST_IN_DT?: string;
  LAST_END_DT?: string;
  IN_TCNT?: string;
  LAST_ADBG_DIV?: string;
  LAST_ADBG_DIV_NM?: string;
  LAST_SCHL?: string;
  MAJR?: string;
  LAST_GRAD_DT?: string;
  CTQL_CD?: string;
  CTQL_CD_NM?: string;
  CTQL_PUR_DT?: string;
  CARR_MCNT?: string;
  CARR_YM?: string;
  WKG_ST_DIV_CD?: string;
  WKG_ST_DIV?: string;
  KOSA_REG_YN?: string;
  KOSA_RNW_DT?: string;
  FST_IN_DT?: string;
  ENTR_BEF_CARR?: string;
  ENTR_BEF_CTQL_CARR?: string;
  CARR_DIV_CD?: string;
  ADBG_CARR_MCNT?: string;
  CTQL_CARR_MCNT?: string;
  CARR_CALC_STND_DT?: string;
  RMK?: string;
  REG_DTTM?: string;
  CHNG_DTTM?: string;
  CHNGR_ID?: string;
  HDOFC_YEAR?: string;
  HDOFC_MONTH?: string;
  // AS-IS MXML?ì„œ ?¬ìš©?˜ëŠ” ì¶”ê? ?„ë“œ??
  ENTR_AFT_ADBG_CARR?: string; // ?…ì‚¬?„í•™?¥ê²½?¥ê°œ?”ìˆ˜
  ENTR_AFT_CTQL_CARR?: string; // ?…ì‚¬?„ìê²©ê²½?¥ê°œ?”ìˆ˜
  ENTR_BEF_ADBG_CARR?: string; // ?…ì‚¬?„í•™?¥ê²½?¥ê°œ?”ìˆ˜
}

// PSM1010M0??selectedEmployee ?€??
// interface SelectedEmployee { ... } <= ??ë¶€ë¶??„ì²´ ?? œ

interface CommonCode {
  data: string;
  label: string;
}

/**
 * PSM1020M00 ì»´í¬?ŒíŠ¸ Props ?¸í„°?˜ì´??
 * 
 * ?¬ì› ?•ë³´ ?±ë¡/?˜ì • ?”ë©´??props ?•ì˜
 * 
 * @property {EmployeeData | null} selectedEmployee - ? íƒ???¬ì› ?•ë³´ (PSM1010M00?ì„œ ?„ë‹¬)
 * @property {Object} [fieldEnableState] - ?„ë“œ ?œì„±???íƒœ (? ê·œ/?˜ì • ëª¨ë“œ???°ë¼ ?¤ë¦„)
 * @property {Function} [onSearchSuccess] - ê²€???±ê³µ ???¸ì¶œ??ì½œë°± (?ìœ„ ?”ë©´ ?¬ì¡°??
 */
interface PSM1020M00Props {
  selectedEmployee: EmployeeData | null;
  fieldEnableState?: {
    empNo: boolean;
    ownOutsDiv: boolean;
    hqDiv: boolean;
    deptDiv: boolean;
    duty: boolean;
    crpnNm: boolean;
  };
  onSearchSuccess?: () => void; // AS-IS MXML??parentDocument.prf_PsmSearch?€ ?™ì¼
}

/**
 * PSM1020M00 ì»´í¬?ŒíŠ¸ Ref ?¸í„°?˜ì´??
 * 
 * ë¶€ëª?ì»´í¬?ŒíŠ¸?ì„œ ?¸ì¶œ?????ˆëŠ” ë©”ì„œ?œë“¤???•ì˜
 * 
 * @property {Function} handleSearch - ?¬ì› ?•ë³´ ê²€???¤í–‰
 * @property {Function} initialize - ì»´í¬?ŒíŠ¸ ì´ˆê¸°??(? ê·œ ëª¨ë“œë¡??¤ì •)
 */
export interface PSM1020M00Ref {
  handleSearch: () => Promise<void>;
  initialize: () => void;
}

const SearchSection = forwardRef<PSM1020M00Ref, PSM1020M00Props>(({ selectedEmployee, fieldEnableState, onSearchSuccess }, ref) => {
  const { showToast, showConfirm } = useToast();
  const { user } = useAuth();
  // ê²€??ì¡°ê±´ state
  const [searchConditions, setSearchConditions] = useState({
    ownOutsDiv: '1', // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ (1:?ì‚¬, 2:?¸ì£¼)
    empNm: '', // ?¬ì›?±ëª…
    hqDivCd: 'ALL', // ë³¸ë?ì½”ë“œ
    deptDivCd: 'ALL', // ë¶€?œì½”??
    dutyCd: 'ALL', // ì§ì±…ì½”ë“œ
    retirYn: 'Y' // ?´ì‚¬?í¬?¨ìœ ë¬?
  });

  // ?¬ì› ?°ì´??state - ì´ˆê¸°ê°’ìœ¼ë¡??ì‚¬ ?¤ì •
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>({
    OWN_OUTS_DIV_CD: '1',
    OWN_OUTS_DIV: '?ì‚¬',
    ENTR_CD: '',
    CARR_DIV_CD: '1',
    WKG_ST_DIV_CD: '1',
    WKG_ST_DIV: '?¬ì§ì¤?,
    KOSA_REG_YN: 'N',
    HQ_DIV_CD: '', // ë³¸ë? ì½”ë“œ ì´ˆê¸°ê°?ì¶”ê?
    DEPT_DIV_CD: '', // ë¶€??ì½”ë“œ ì´ˆê¸°ê°?ì¶”ê?
    DUTY_CD: '', // ì§ì±… ì½”ë“œ ì´ˆê¸°ê°?ì¶”ê?
    EMP_NO: '', // ?¬ì›ë²ˆí˜¸ ì´ˆê¸°ê°?ì¶”ê?
    EMP_NM: '', // ?¬ì›ëª?ì´ˆê¸°ê°?ì¶”ê?
    EMP_ENG_NM: '', // ?ë¬¸ëª?ì´ˆê¸°ê°?ì¶”ê?
    RES_REG_NO: '', // ì£¼ë??±ë¡ë²ˆí˜¸ ì´ˆê¸°ê°?ì¶”ê?
    BIR_YR_MN_DT: '', // ?ë…„?”ì¼ ì´ˆê¸°ê°?ì¶”ê?
    SEX_DIV_CD: '', // ?±ë³„ ì´ˆê¸°ê°?ì¶”ê?
    NTLT_DIV_CD: '', // êµ?  ì´ˆê¸°ê°?ì¶”ê?
    ENTR_DT: '', // ?…ì‚¬?¼ì ì´ˆê¸°ê°?ì¶”ê?
    RETIR_DT: '', // ?´ì‚¬?¼ì ì´ˆê¸°ê°?ì¶”ê?
    EMAIL_ADDR: '', // ?´ë©”??ì´ˆê¸°ê°?ì¶”ê?
    MOB_PHN_NO: '', // ?´ë??„í™” ì´ˆê¸°ê°?ì¶”ê?
    HOME_TEL: '', // ?íƒ?„í™” ì´ˆê¸°ê°?ì¶”ê?
    HOME_ZIP_NO: '', // ?°í¸ë²ˆí˜¸ ì´ˆê¸°ê°?ì¶”ê?
    HOME_ADDR: '', // ì£¼ì†Œ ì´ˆê¸°ê°?ì¶”ê?
    HOME_DET_ADDR: '', // ?ì„¸ì£¼ì†Œ ì´ˆê¸°ê°?ì¶”ê?
    LAST_IN_DT: '', // ìµœì¢…?¬ì…?¼ì ì´ˆê¸°ê°?ì¶”ê?
    LAST_END_DT: '', // ìµœì¢…ì² ìˆ˜?¼ì ì´ˆê¸°ê°?ì¶”ê?
    LAST_SCHL: '', // ?™êµ ì´ˆê¸°ê°?ì¶”ê?
    MAJR: '', // ?„ê³µ ì´ˆê¸°ê°?ì¶”ê?
    LAST_GRAD_DT: '', // ì¡¸ì—…?¼ì ì´ˆê¸°ê°?ì¶”ê?
    CTQL_CD: '', // ?ê²©ì¦?ì´ˆê¸°ê°?ì¶”ê?
    CTQL_PUR_DT: '', // ?ê²©ì·¨ë“?¼ì ì´ˆê¸°ê°?ì¶”ê?
    CARR_MCNT: '0', // ê²½ë ¥ê°œì›”??ì´ˆê¸°ê°?ì¶”ê?
    FST_IN_DT: '', // ìµœì´ˆ?¬ì…?¼ì ì´ˆê¸°ê°?ì¶”ê?
    ENTR_BEF_CARR: '0', // ?…ì‚¬?„ê²½??ì´ˆê¸°ê°?ì¶”ê?
    ENTR_BEF_CTQL_CARR: '0', // ?…ì‚¬?„ìê²©ê²½??ì´ˆê¸°ê°?ì¶”ê?
    ADBG_CARR_MCNT: '0', // ?™ë ¥ê²½ë ¥ê°œì›”??ì´ˆê¸°ê°?ì¶”ê?
    CTQL_CARR_MCNT: '0', // ?ê²©ê²½ë ¥ê°œì›”??ì´ˆê¸°ê°?ì¶”ê?
    CARR_CALC_STND_DT: '', // ê²½ë ¥ê³„ì‚°ê¸°ì???ì´ˆê¸°ê°?ì¶”ê?
    LAST_ADBG_DIV: '', // ìµœì¢…?™ë ¥ ì´ˆê¸°ê°?ì¶”ê?
    LAST_TCN_GRD: '', // ê¸°ìˆ ?±ê¸‰ ì´ˆê¸°ê°?ì¶”ê?
    RMK: '', // ë¹„ê³  ì´ˆê¸°ê°?ì¶”ê?
    HDOFC_YEAR: '0', // ?¬ì§?„ìˆ˜(?? ì´ˆê¸°ê°?ì¶”ê?
    HDOFC_MONTH: '0', // ?¬ì§?„ìˆ˜(?? ì´ˆê¸°ê°?ì¶”ê?
    ENTR_AFT_ADBG_CARR: '0', // ?…ì‚¬?„í•™?¥ê²½??ì´ˆê¸°ê°?ì¶”ê?
    ENTR_AFT_CTQL_CARR: '0' // ?…ì‚¬?„ìê²©ê²½??ì´ˆê¸°ê°?ì¶”ê?
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFlag, setNewFlag] = useState<boolean>(false); // AS-IS MXML??newFlag?€ ?™ì¼ - ì´ˆê¸°ê°’ì„ falseë¡??¤ì •
  const [showCarrCalcPopup, setShowCarrCalcPopup] = useState<boolean>(false); // ê²½ë ¥ê³„ì‚° ?ì—… ?œì‹œ ?¬ë?
  const [showGradeHistoryPopup, setShowGradeHistoryPopup] = useState<boolean>(false); // ?±ê¸‰?´ë ¥ì¡°íšŒ ?ì—… ?œì‹œ ?¬ë?

  // AS-IS MXMLê³??™ì¼???€???°ì´??ë³€?˜ë“¤
  const [saveData, setSaveData] = useState<{
    ctqlCd: string;
    ctqlPurDt: string;
    fstInDt: string;
    lastEndDt: string;
    lastTcnGrd: string;
  }>({
    ctqlCd: '',
    ctqlPurDt: '',
    fstInDt: '',
    lastEndDt: '',
    lastTcnGrd: ''
  });

  // ê³µí†µì½”ë“œ state
  const [commonCodes, setCommonCodes] = useState<{
    ownOutsDiv: CommonCode[];
    hqDiv: CommonCode[];
    deptDiv: CommonCode[];
    duty: CommonCode[];
    sexDiv: CommonCode[];
    ntltDiv: CommonCode[];
    lastAdbgDiv: CommonCode[];
    ctqlCd: CommonCode[];
    wkgStDiv: CommonCode[];
    tcnGrd: CommonCode[];
    ownCompanyList: CommonCode[]; // ?ì‚¬ ?…ì²´ ëª©ë¡
    entrList: CommonCode[]; // ?¸ì£¼ ?…ì²´ ëª©ë¡
  }>({
    ownOutsDiv: [],
    hqDiv: [],
    deptDiv: [],
    duty: [],
    sexDiv: [],
    ntltDiv: [],
    lastAdbgDiv: [],
    ctqlCd: [],
    wkgStDiv: [],
    tcnGrd: [],
    ownCompanyList: [],
    entrList: []
  });

  // ?¸ë??ì„œ ?¸ì¶œ?????ˆëŠ” ?¨ìˆ˜?¤ì„ refë¡??¸ì¶œ
  useImperativeHandle(ref, () => ({
    handleSearch: async () => {
      await handleSearch();
    },
    initialize: () => {
      // PSM1020M00 ì´ˆê¸°??
      setNewFlag(false);
      setEmployeeData({
        EMP_NO: '',
        OWN_OUTS_DIV_CD: '1',
        OWN_OUTS_DIV: '?ì‚¬',
        CRPN_NM: '',
        ENTR_NO: '',
        ENTR_CD: '',
        EMP_NM: '',
        EMP_ENG_NM: '',
        RES_REG_NO: '',
        BIR_YR_MN_DT: '',
        SEX_DIV_CD: '',
        NTLT_DIV_CD: '',
        ENTR_DT: '',
        RETIR_DT: '',
        HQ_DIV_CD: '',
        HQ_DIV: '',
        DEPT_DIV_CD: '',
        DEPT_DIV: '',
        DUTY_CD: '',
        DUTY: '',
        LAST_TCN_GRD: '',
        EMAIL_ADDR: '',
        MOB_PHN_NO: '',
        HOME_TEL: '',
        HOME_ZIP_NO: '',
        HOME_ADDR: '',
        HOME_DET_ADDR: '',
        LAST_IN_DT: '',
        LAST_END_DT: '',
        LAST_SCHL: '',
        MAJR: '',
        LAST_GRAD_DT: '',
        CTQL_CD: '',
        CTQL_CD_NM: '',
        CTQL_PUR_DT: '',
        CARR_MCNT: '',
        CARR_YM: '',
        WKG_ST_DIV_CD: '',
        WKG_ST_DIV: '',
        FST_IN_DT: '',
        RMK: '',
        CARR_DIV_CD: '1',
        KOSA_REG_YN: 'N',
        HDOFC_YEAR: '',
        HDOFC_MONTH: '',
        ENTR_BEF_CARR: '',
        ENTR_BEF_CTQL_CARR: '',
        ADBG_CARR_MCNT: '',
        CTQL_CARR_MCNT: '',
        CARR_CALC_STND_DT: '',
        LAST_ADBG_DIV: '',
        LAST_ADBG_DIV_NM: '',
        ENTR_AFT_ADBG_CARR: '',
        ENTR_AFT_CTQL_CARR: ''
      });
    }
  }));

  // selectedEmployee prop??ë³€ê²½ë  ??employeeDataë¥??…ë°?´íŠ¸
  useEffect(() => {
    if (selectedEmployee) {
      // PSM1020M00: selectedEmployee ë³€ê²½ë¨ - ? íƒ???¬ì› ?•ë³´ë¡?employeeData ?¤ì •
      
      // ?¬ì› ? íƒ ??? ê·œ ëª¨ë“œ ?´ì œ
      setNewFlag(false);
      
      // selectedEmployee ?°ì´?°ë? employeeData ?•ì‹?¼ë¡œ ë³€??
      const convertedData: EmployeeData = {
        EMP_NO: selectedEmployee.EMP_NO,
        OWN_OUTS_DIV_CD: selectedEmployee.OWN_OUTS_DIV_CD,
        OWN_OUTS_DIV: selectedEmployee.OWN_OUTS_DIV,
        CRPN_NM: selectedEmployee.CRPN_NM,
        ENTR_NO: selectedEmployee.ENTR_NO,
        ENTR_CD: selectedEmployee.ENTR_CD,
        EMP_NM: selectedEmployee.EMP_NM,
        EMP_ENG_NM: selectedEmployee.EMP_ENG_NM,
        RES_REG_NO: selectedEmployee.RES_REG_NO,
        BIR_YR_MN_DT: selectedEmployee.BIR_YR_MN_DT,
        SEX_DIV_CD: selectedEmployee.SEX_DIV_CD,
        NTLT_DIV_CD: selectedEmployee.NTLT_DIV_CD,
        ENTR_DT: selectedEmployee.ENTR_DT,
        RETIR_DT: selectedEmployee.RETIR_DT,
        HQ_DIV_CD: selectedEmployee.HQ_DIV_CD,
        HQ_DIV: selectedEmployee.HQ_DIV,
        DEPT_DIV_CD: selectedEmployee.DEPT_DIV_CD,
        DEPT_DIV: selectedEmployee.DEPT_DIV,
        DUTY_CD: selectedEmployee.DUTY_CD,
        DUTY: selectedEmployee.DUTY,
        LAST_TCN_GRD: selectedEmployee.LAST_TCN_GRD,
        EMAIL_ADDR: selectedEmployee.EMAIL_ADDR,
        MOB_PHN_NO: selectedEmployee.MOB_PHN_NO,
        HOME_TEL: selectedEmployee.HOME_TEL,
        HOME_ZIP_NO: selectedEmployee.HOME_ZIP_NO,
        HOME_ADDR: selectedEmployee.HOME_ADDR,
        HOME_DET_ADDR: selectedEmployee.HOME_DET_ADDR,
        LAST_IN_DT: selectedEmployee.LAST_IN_DT,
        LAST_END_DT: selectedEmployee.LAST_END_DT,
        LAST_SCHL: selectedEmployee.LAST_SCHL,
        MAJR: selectedEmployee.MAJR,
        LAST_GRAD_DT: selectedEmployee.LAST_GRAD_DT,
        CTQL_CD: selectedEmployee.CTQL_CD,
        CTQL_CD_NM: selectedEmployee.CTQL_CD_NM,
        CTQL_PUR_DT: selectedEmployee.CTQL_PUR_DT,
        CARR_MCNT: selectedEmployee.CARR_MCNT,
        CARR_YM: selectedEmployee.CARR_YM,
        WKG_ST_DIV_CD: selectedEmployee.WKG_ST_DIV_CD,
        WKG_ST_DIV: selectedEmployee.WKG_ST_DIV,
        FST_IN_DT: selectedEmployee.FST_IN_DT,
        RMK: selectedEmployee.RMK,
        // AS-IS MXML?ì„œ ?¬ìš©?˜ëŠ” ?„ë“œ??
        ENTR_BEF_CARR: selectedEmployee.ENTR_BEF_CARR,
        ENTR_BEF_CTQL_CARR: selectedEmployee.ENTR_BEF_CTQL_CARR,
        ADBG_CARR_MCNT: selectedEmployee.ADBG_CARR_MCNT,
        CTQL_CARR_MCNT: selectedEmployee.CTQL_CARR_MCNT,
        CARR_CALC_STND_DT: selectedEmployee.CARR_CALC_STND_DT,
        // ê¸°ë³¸ê°?? ì?
        CARR_DIV_CD: selectedEmployee.CARR_DIV_CD || '1',
        KOSA_REG_YN: selectedEmployee.KOSA_REG_YN || 'N',
        HDOFC_YEAR: selectedEmployee.HDOFC_YEAR,
        HDOFC_MONTH: selectedEmployee.HDOFC_MONTH,
        ENTR_AFT_ADBG_CARR: selectedEmployee.ENTR_AFT_ADBG_CARR,
        ENTR_AFT_CTQL_CARR: selectedEmployee.ENTR_AFT_CTQL_CARR,
        // ìµœì¢…?™ë ¥ ?•ë³´ ì¶”ê?
        LAST_ADBG_DIV: selectedEmployee.LAST_ADBG_DIV,
        LAST_ADBG_DIV_NM: selectedEmployee.LAST_ADBG_DIV_NM
      };
      
      setEmployeeData(convertedData);
      
      // ?¸ì£¼ ?¬ì›??ê²½ìš° ?¸ì£¼ ?…ì²´ ëª©ë¡ ë¡œë“œ
      if (selectedEmployee.OWN_OUTS_DIV_CD === '2') {
        loadEntrList();
      }
    }
  }, [selectedEmployee]);

  // ì´ˆê¸° ?°ì´??ë¡œë“œ
  useEffect(() => {
    // ì´ˆê¸° ?°ì´??ë¡œë“œ ?œì‘ - ê³µí†µì½”ë“œ, ?ì‚¬/?¸ì£¼ ?…ì²´ ëª©ë¡ ë¡œë“œ
    const initializeData = async () => {
      await loadCommonCodes();
      await loadOwnCompanyList(); // ?ì‚¬ ?…ì²´ ëª©ë¡ ë¡œë“œ
      await loadEntrList(); // ?¸ì£¼ ?…ì²´ ëª©ë¡ ë¡œë“œ
    };
    initializeData();
    
    // ì¹´ì¹´??ì£¼ì†Œ ê²€???¤í¬ë¦½íŠ¸ ë¡œë“œ
    if (typeof window !== 'undefined' && !window.daum) {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // AS-IS COM_03_0101_S ?„ë¡œ?œì? ?¸ì¶œ ë°©ì‹?¼ë¡œ ê³µí†µì½”ë“œ ë¡œë“œ
  const loadCommonCodes = async () => {
    try {
      const codeTypes = [
        { key: 'ownOutsDiv', type: '103' }, // ?ì‚¬/?¸ì£¼êµ¬ë¶„
        { key: 'hqDiv', type: '113' }, // ë³¸ë?êµ¬ë¶„
        { key: 'duty', type: '116' }, // ì§ì±…
        { key: 'sexDiv', type: '011' }, // ?±ë³„êµ¬ë¶„
        { key: 'ntltDiv', type: '012' }, // êµ? êµ¬ë¶„
        { key: 'lastAdbgDiv', type: '014' }, // ìµœì¢…?™ë ¥êµ¬ë¶„
        { key: 'ctqlCd', type: '013' }, // ?ê²©ì¦?
        { key: 'wkgStDiv', type: '017' }, // ê·¼ë¬´?íƒœêµ¬ë¶„
        { key: 'tcnGrd', type: '104' } // ê¸°ìˆ ?±ê¸‰
      ];

      const newCommonCodes: any = { ...commonCodes };

      for (const { key, type } of codeTypes) {
        try {
          // AS-IS COM_03_0101_S ?„ë¡œ?œì? ?¸ì¶œ ë°©ì‹
          const response = await fetch('/api/common/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              largeCategoryCode: type
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            const data = result.data || [];
            
            // API ?‘ë‹µ??{data: codeId, label: codeNm} ?•íƒœë¡?ë³€??
            const transformedData = data.map((item: any) => ({
              data: item.codeId || '',
              label: item.codeNm || ''
            }));
            
            newCommonCodes[key] = transformedData;
          }
        } catch (error) {
          console.error(`ê³µí†µì½”ë“œ ë¡œë“œ ?¤íŒ¨ (${type}):`, error);
        }
      }

      setCommonCodes(newCommonCodes);
    } catch (error) {
      console.error('ê³µí†µì½”ë“œ ë¡œë“œ ì¤??¤ë¥˜:', error);
    }
  };

  // AS-IS COM_03_0201_S ?„ë¡œ?œì? ?¸ì¶œ ë°©ì‹?¼ë¡œ ë³¸ë?ë³?ë¶€??ë¡œë“œ
  const loadDeptByHq = async (hqDivCd: string) => {
    try {
      // ë³¸ë?ë³?ë¶€??ë¡œë“œ ?œì‘
      
      // AS-IS COM_03_0201_S ?„ë¡œ?œì? ?¸ì¶œ ë°©ì‹
      // ì¡°íšŒ? í˜•=2, ?„ì²´?¬í•¨? ë¬´=N, ë³¸ë?ì½”ë“œ=hqDivCd
      const response = await fetch('/api/psm/dept-by-hq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchType: '2',
          includeAll: 'N',
          hqDivCd: hqDivCd
        })
      });
      
      if (response.ok) {
          const result = await response.json();
          const data = result.success ? result.data : [];
          
          // API ?‘ë‹µ??ë°°ì—´ ?•íƒœ??ê²½ìš° ê°ì²´ ?•íƒœë¡?ë³€??
          let transformedData = data;
          if (Array.isArray(data) && data.length > 0) {
            transformedData = data.map((item: any) => ({
              data: item.DATA || '',
              label: item.LABEL || ''
            }));
          }
        
        setCommonCodes(prev => ({
          ...prev,
          deptDiv: transformedData
        }));
        
        // ë¶€??ëª©ë¡??ë¡œë“œ?˜ë©´ ê¸°ì¡´ employeeData??DEPT_DIV_CD ê°?? ì?
        if (transformedData && transformedData.length > 0) {
          // employeeData??DEPT_DIV_CDê°€ ?ˆìœ¼ë©?ê·?ê°’ì„ ? ì?, ?†ìœ¼ë©?ì²?ë²ˆì§¸ ??ª© ? íƒ
          const currentDeptDivCd = employeeData?.DEPT_DIV_CD;
          if (!currentDeptDivCd || currentDeptDivCd === '') {
            setEmployeeData(prev => ({
              ...prev!,
              DEPT_DIV_CD: transformedData[0].data
            }));
          }
        }
      }
    } catch (error) {
      console.error('ë¶€??ë¡œë“œ ì¤??¤ë¥˜:', error);
    }
  };

  // AS-IS COM_03_0101_S ?„ë¡œ?œì? ?¸ì¶œ ë°©ì‹?¼ë¡œ ?ì‚¬ ?…ì²´ ëª©ë¡ ë¡œë“œ
  const loadOwnCompanyList = async () => {
    try {
      // ?ì‚¬ ?…ì²´ ëª©ë¡ ë¡œë“œ ?œì‘
      const response = await fetch('/api/common/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          largeCategoryCode: '110' // ?ì‚¬ ?…ì²´ ?€ë¶„ë¥˜ ì½”ë“œ
        })
      });
      
              if (response.ok) {
          const result = await response.json();
          const data = result.data || [];
          
          // API ?‘ë‹µ??{data: codeId, label: codeNm} ?•íƒœë¡?ë³€??
          const transformedData = data.map((item: any) => ({
            data: item.codeId || '',
            label: item.codeNm || ''
          }));
        
        setCommonCodes(prev => ({
          ...prev,
          ownCompanyList: transformedData
        }));
        
        // ?ì‚¬ ?…ì²´ ëª©ë¡??ë¡œë“œ?˜ê³  ì²?ë²ˆì§¸ ??ª©???ˆìœ¼ë©??ë™ ? íƒ
        if (transformedData && transformedData.length > 0 && employeeData?.OWN_OUTS_DIV_CD === '1') {
          setEmployeeData(prev => ({
            ...prev!,
            ENTR_CD: transformedData[0].data
          }));
        }
      }
    } catch (error) {
      console.error('?ì‚¬ ?…ì²´ ëª©ë¡ ë¡œë“œ ì¤??¤ë¥˜:', error);
    }
  };

  // AS-IS COM_03_0101_S ?„ë¡œ?œì? ?¸ì¶œ ë°©ì‹?¼ë¡œ ?¸ì£¼ ?…ì²´ ëª©ë¡ ë¡œë“œ
  const loadEntrList = async () => {
    try {
      // ?¸ì£¼ ?…ì²´ ëª©ë¡ ë¡œë“œ ?œì‘
            const response = await fetch('/api/common/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          largeCategoryCode: '111' // ?¸ì£¼ ?…ì²´ ?€ë¶„ë¥˜ ì½”ë“œ
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        
        // API ?‘ë‹µ??{data: codeId, label: codeNm} ?•íƒœë¡?ë³€??
        const transformedData = data.map((item: any) => ({
          data: item.codeId || '',
          label: item.codeNm || ''
        }));
        
        setCommonCodes(prev => ({
          ...prev,
          entrList: transformedData
        }));
      }
    } catch (error) {
      console.error('?¸ì£¼ ?…ì²´ ëª©ë¡ ë¡œë“œ ì¤??¤ë¥˜:', error);
    }
  };

  // ê²€??ì¡°ê±´ ë³€ê²??¸ë“¤??
  const handleSearchChange = (field: string, value: string) => {
    setSearchConditions(prev => ({
      ...prev,
      [field]: value
    }));

    // ë³¸ë? ë³€ê²???ë¶€??ë¦¬ìŠ¤???…ë°?´íŠ¸ (AS-IS onCbHqDivChange ë¡œì§)
    if (field === 'hqDivCd') {
      handleHqDivChange(value);
    }
    
    // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ë³€ê²????´ë²¤??(AS-IS onOwnOutsDivChange ë¡œì§)
    if (field === 'ownOutsDiv') {
      handleOwnOutsDivChange(value);
    }
  };

  // AS-IS MXML??onOwnOutsDivChange ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const handleOwnOutsDivChange = (value: string) => {
    // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ë³€ê²?ì²˜ë¦¬
    
    if (value === '1') {
      // AS-IS MXMLê³??™ì¼: ?ì‚¬??ê²½ìš°
      // cbCrpnNm.setLargeCode('110','') - ?ì‚¬ ?…ì²´ ëª©ë¡ ë¡œë“œ
      if (commonCodes.ownCompanyList.length === 0) {
        loadOwnCompanyList();
      }
      
      // AS-IS MXMLê³??™ì¼: txtEmpNo.enabled = true - ?¬ì›ë²ˆí˜¸ ?œì„±??
      
      setEmployeeData(prev => ({
        ...prev!,
        OWN_OUTS_DIV_CD: '1',
        OWN_OUTS_DIV: '?ì‚¬',
        ENTR_CD: '' // ?ì‚¬ ?…ì²´ ì½”ë“œ ì´ˆê¸°??
      }));
    } else if (value === '2') {
      // AS-IS MXMLê³??™ì¼: ?¸ì£¼??ê²½ìš°
      // cbCrpnNm.setLargeCode('111','') - ?¸ì£¼ ?…ì²´ ëª©ë¡ ë¡œë“œ
      if (commonCodes.entrList.length === 0) {
        loadEntrList();
      }
      
      // AS-IS MXMLê³??™ì¼: txtEmpNo.enabled = false - ?¸ì£¼ ?¬ë²ˆ?€ ?ë™ì±„ë²ˆ
      
      setEmployeeData(prev => ({
        ...prev!,
        OWN_OUTS_DIV_CD: '2',
        OWN_OUTS_DIV: '?¸ì£¼',
        ENTR_CD: '' // ?¸ì£¼ ?…ì²´ ì½”ë“œ ì´ˆê¸°??
      }));
    }
    
    // AS-IS MXMLê³??™ì¼: ? ê·œ ëª¨ë“œ?ì„œ ?¸ì£¼ ? íƒ ??ì¶”ê? ì²˜ë¦¬
    if (newFlag === true && value === '2') {
      // AS-IS: setEmpNoMaxCnt() ?¸ì¶œ (?„ì¬??ì£¼ì„ ì²˜ë¦¬??
    }
  };

  // ë³¸ë? ì½¤ë³´ ë³€ê²??´ë²¤???¸ë“¤??(AS-IS onCbHqDivChange?€ ?™ì¼)
  const handleHqDivChange = (value: string) => {
    // ë³¸ë? ì½¤ë³´ ë³€ê²??´ë²¤??ì²˜ë¦¬
    
    // AS-IS?€ ?™ì¼?˜ê²Œ ë¶€??ì½¤ë³´ ì´ˆê¸°??
    setCommonCodes(prev => ({
      ...prev,
      deptDiv: []
    }));
    
    // ?¬ì› ?°ì´?°ì—??ë¶€??ì½”ë“œ ì´ˆê¸°??
    setEmployeeData(prev => ({
      ...prev!,
      DEPT_DIV_CD: ''
    }));
    
    // ë³¸ë?ê°€ ? íƒ??ê²½ìš°?ë§Œ ë¶€??ëª©ë¡ ë¡œë“œ
    if (value && value !== '') {
      loadDeptByHq(value);
    }
  };

  // ?¬ì› ì¡°íšŒ ?¨ìˆ˜
  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const empNo = employeeData?.EMP_NO;
      
      if (!empNo) {
        setError('?¬ì›ë²ˆí˜¸ë¥??…ë ¥??ì£¼ì‹­?œìš”.');
        showToast('?¬ì›ë²ˆí˜¸ë¥??…ë ¥??ì£¼ì‹­?œìš”.', 'warning');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/psm/employee/detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empNo: empNo
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const rec = result.data;
          
          const convertedData: EmployeeData = {
            EMP_NO: rec.EMP_NO,
            OWN_OUTS_DIV_CD: rec.OWN_OUTS_DIV_CD,
            OWN_OUTS_DIV: rec.OWN_OUTS_DIV_CD === '1' ? '?ì‚¬' : '?¸ì£¼',
            ENTR_CD: rec.ENTR_CD,
            CRPN_NM: rec.CRPN_NM,
            HQ_DIV_CD: rec.HQ_DIV_CD,
            HQ_DIV: rec.HQ_DIV,
            DEPT_DIV_CD: rec.DEPT_DIV_CD,
            DEPT_DIV: rec.DEPT_DIV,
            DUTY_CD: rec.DUTY_CD,
            DUTY: rec.DUTY,
            WKG_ST_DIV_CD: rec.WKG_ST_DIV_CD,
            WKG_ST_DIV: rec.WKG_ST_DIV,
            ENTR_DT: rec.ENTR_DT,
            RETIR_DT: rec.RETIR_DT,
            HDOFC_YEAR: rec.HDOFC_YEAR,
            HDOFC_MONTH: rec.HDOFC_MONTH,
            EMP_NM: rec.EMP_NM,
            EMP_ENG_NM: rec.EMP_ENG_NM,
            RES_REG_NO: rec.RES_REG_NO,
            BIR_YR_MN_DT: rec.BIR_YR_MN_DT,
            SEX_DIV_CD: rec.SEX_DIV_CD,
            SEX_DIV: rec.SEX_DIV,
            NTLT_DIV_CD: rec.NTLT_DIV_CD,
            NTLT_DIV: rec.NTLT_DIV,
            LAST_ADBG_DIV: rec.LAST_ADBG_DIV,
            LAST_ADBG_DIV_NM: rec.LAST_ADBG_DIV_NM,
            LAST_SCHL: rec.LAST_SCHL,
            MAJR: rec.MAJR,
            LAST_GRAD_DT: rec.LAST_GRAD_DT,
            MOB_PHN_NO: rec.MOB_PHN_NO,
            HOME_TEL: rec.HOME_TEL,
            HOME_ZIP_NO: rec.HOME_ZIP_NO,
            HOME_ADDR: rec.HOME_ADDR,
            HOME_DET_ADDR: rec.HOME_DET_ADDR,
            EMAIL_ADDR: rec.EMAIL_ADDR,
            CTQL_CD: rec.CTQL_CD,
            CTQL_CD_NM: rec.CTQL_CD_NM,
            CTQL_PUR_DT: rec.CTQL_PUR_DT,
            CARR_MCNT: rec.CARR_MCNT,
            CARR_YM: rec.CARR_YM,
            CARR_DIV_CD: rec.CARR_DIV_CD,
            ENTR_BEF_CARR: rec.ENTR_BEF_CARR,
            ENTR_BEF_CTQL_CARR: rec.ENTR_BEF_CTQL_CARR,
            ADBG_CARR_MCNT: rec.ADBG_CARR_MCNT,
            CTQL_CARR_MCNT: rec.CTQL_CARR_MCNT,
            CARR_CALC_STND_DT: rec.CARR_CALC_STND_DT,
            FST_IN_DT: rec.FST_IN_DT,
            LAST_END_DT: rec.LAST_END_DT,
            LAST_IN_DT: rec.LAST_IN_DT,
            LAST_TCN_GRD: rec.LAST_TCN_GRD,
            LAST_TCN_GRD_CD: rec.LAST_TCN_GRD_CD,
            KOSA_REG_YN: rec.KOSA_REG_YN,
            KOSA_RNW_DT: rec.KOSA_RNW_DT,
            RMK: rec.RMK,
            ENTR_AFT_ADBG_CARR: rec.ENTR_AFT_ADBG_CARR,
            ENTR_AFT_CTQL_CARR: rec.ENTR_AFT_CTQL_CARR
          };
          
          setEmployeeData(convertedData);
          setNewFlag(false);
          
          // ë³¸ë?ê°€ ?¤ì •?˜ë©´ ?´ë‹¹ ë³¸ë???ë¶€??ëª©ë¡ ë¡œë“œ
          if (rec.HQ_DIV_CD && rec.HQ_DIV_CD !== '') {
            loadDeptByHq(rec.HQ_DIV_CD);
          }
          
          if (rec.OWN_OUTS_DIV_CD === '2') {
            loadEntrList();
          }
          
          // AS-IS MXMLê³??™ì¼: ?¬ì› ?°ì´??ë¡œë“œ ???„ì¬ ?°ì´?°ë? saveData???€??
          setTimeout(() => {
            saveProjectInputData();
          }, 0);
          
        } else {
          setEmployeeData(null);
          const errorMessage = result.message || '?´ë‹¹?˜ëŠ” ?°ì´?°ê? ?†ìŠµ?ˆë‹¤.';
          setError(errorMessage);
          showToast(errorMessage, 'warning');
        }
      } else {
        throw new Error('?¬ì› ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
      }
    } catch (error) {
      console.error('?¬ì› ì¡°íšŒ ì¤??¤ë¥˜:', error);
      const errorMessage = error instanceof Error ? error.message : 'ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };



  // AS-IS MXML??fnInputValidationChk ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const validateInput = (checkType: string): boolean => {
    if (checkType === "Registe" || checkType === "CarrCalc") {
      if (!employeeData?.OWN_OUTS_DIV_CD) {
        showToast("?ì‚¬ ?ëŠ” ?¸ì£¼ êµ¬ë¶„??? íƒ??ì£¼ì‹­?œìš”.", "warning");
        // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ select???¬ì»¤??
        const ownOutsDivSelect = document.querySelector('select[value="' + (employeeData?.OWN_OUTS_DIV_CD || '') + '"]') as HTMLSelectElement;
        if (ownOutsDivSelect) ownOutsDivSelect.focus();
        return false;
      }

      if (employeeData.OWN_OUTS_DIV_CD === "1" && !employeeData.ENTR_DT) {
        showToast("?…ì‚¬?¼ìë¥??…ë ¥??ì£¼ì‹­?œìš”", "warning");
        // ?…ì‚¬?¼ì input???¬ì»¤??
        setTimeout(() => {
          const entrDtInput = document.querySelector('input[data-field="entrDt"]') as HTMLInputElement;
          if (entrDtInput) {
            entrDtInput.focus();
          }
        }, 100);
        return false;
      }

      if (!employeeData?.HQ_DIV_CD || employeeData.HQ_DIV_CD.trim() === '') {
        showToast("ë³¸ë?ë¥?? íƒ??ì£¼ì‹­?œìš”.", "warning");
        // ë³¸ë? select???¬ì»¤??
        setTimeout(() => {
          const hqDivSelect = document.querySelector('select[data-field="hqDiv"]') as HTMLSelectElement;
          if (hqDivSelect) {
            hqDivSelect.focus();
          }
        }, 100);
        return false;
      }
      
      if (!employeeData?.LAST_ADBG_DIV || employeeData.LAST_ADBG_DIV === '') {
        showToast("ìµœì¢…?™ë ¥??? íƒ??ì£¼ì‹­?œìš”", "warning");
        // ìµœì¢…?™ë ¥ select???¬ì»¤??
        setTimeout(() => {
          const lastAdbgDivSelect = document.querySelector('select[data-field="lastAdbgDiv"]') as HTMLSelectElement;
          if (lastAdbgDivSelect) {
            lastAdbgDivSelect.focus();
          }
        }, 100);
        return false;
      }
      
      if (!employeeData?.FST_IN_DT) {
        showToast("ìµœì´ˆ?¬ì…?¼ìë¥??…ë ¥??ì£¼ì‹­?œìš”", "warning");
        // ìµœì´ˆ?¬ì…?¼ì input???¬ì»¤??
        setTimeout(() => {
          const fstInDtInput = document.querySelector('input[data-field="fstInDt"]') as HTMLInputElement;
          if (fstInDtInput) {
            fstInDtInput.focus();
          }
        }, 100);
        return false;
      } 
        
      if (employeeData.OWN_OUTS_DIV_CD === "2" && !employeeData.LAST_END_DT) {
        showToast("ìµœì¢…ì² ìˆ˜?¼ìë¥??…ë ¥??ì£¼ì‹­?œìš”", "warning");
        // ìµœì¢…ì² ìˆ˜?¼ì input???¬ì»¤??
        setTimeout(() => {
          const lastEndDtInput = document.querySelector('input[data-field="lastEndDt"]') as HTMLInputElement;
          if (lastEndDtInput) {
            lastEndDtInput.focus();
          }
        }, 100);
        return false;
      } 

      if (employeeData?.CTQL_CD && employeeData?.CTQL_CD !== "null" && !employeeData?.CTQL_PUR_DT) {
        showToast("?ê²©ì·¨ë“?¼ìë¥??…ë ¥??ì£¼ì‹­?œìš”", "warning");
        // ?ê²©ì·¨ë“?¼ì input???¬ì»¤??
        setTimeout(() => {
          const ctqlPurDtInput = document.querySelector('input[data-field="ctqlPurDt"]') as HTMLInputElement;
          if (ctqlPurDtInput) {
            ctqlPurDtInput.focus();
          }
        }, 100);
        return false;
      }
    }
    
    if (checkType === "Registe") {
      if (!employeeData?.EMP_NO && employeeData?.OWN_OUTS_DIV_CD === "1") {
        showToast("?¬ì›ë²ˆí˜¸ë¥??…ë ¥??ì£¼ì‹­?œìš”", "warning");
        // ?¬ì›ë²ˆí˜¸ input???¬ì»¤??
        setTimeout(() => {
          const empNoInput = document.querySelector('input[data-field="empNo"]') as HTMLInputElement;
          if (empNoInput) {
            empNoInput.focus();
            empNoInput.select();
          }
        }, 100);
        return false;
      }

      if (!employeeData?.EMP_NM) {
        showToast("?±ëª…???…ë ¥??ì£¼ì‹­?œìš”", "warning");
        // ?±ëª… input???¬ì»¤??- data-field ?ì„±?¼ë¡œ ?•í™•??ì°¾ê¸°
        setTimeout(() => {
          const empNmInput = document.querySelector('input[data-field="empNm"]') as HTMLInputElement;
          if (empNmInput) {
            empNmInput.focus();
            empNmInput.select(); // ?ìŠ¤??? íƒ??ì¶”ê?
          }
        }, 100);
        return false;
      }

      if (employeeData?.RETIR_DT && employeeData?.WKG_ST_DIV_CD !== "3") {
        showToast("ê·¼ë¬´?íƒœë¥??´ì‚¬ë¡?? íƒ??ì£¼ì‹­?œìš”", "warning");
        // ê·¼ë¬´?íƒœ select???¬ì»¤??
        setTimeout(() => {
          const wkgStDivSelect = document.querySelector('select[data-field="wkgStDiv"]') as HTMLSelectElement;
          if (wkgStDivSelect) {
            wkgStDivSelect.focus();
          }
        }, 100);
        return false;
      }

      // ê·¼ë¬´?íƒœê°€ ?¬ì§??ê²½ìš°?ë§Œ ì²´í¬
      if (Number(employeeData?.CARR_MCNT || 0) === 0 && employeeData?.WKG_ST_DIV_CD === "1") {
        showToast("ê²½ë ¥ê°œì›”?˜ë? ê³„ì‚°??ì£¼ì‹­?œìš”.", "warning");
        // ê²½ë ¥ê³„ì‚° ë²„íŠ¼???¬ì»¤??
        setTimeout(() => {
          const carrCalcBtn = document.querySelector('button[data-field="carrCalcBtn"]') as HTMLButtonElement;
          if (carrCalcBtn) {
            carrCalcBtn.focus();
          }
        }, 100);
        return false;
      }
      
      if (!employeeData?.BIR_YR_MN_DT) {
        showToast("?ë…„?”ì¼???…ë ¥??ì£¼ì‹­?œìš”.", "warning");
        // ?ë…„?”ì¼ input???¬ì»¤??
        setTimeout(() => {
          const birYrMnDtInput = document.querySelector('input[data-field="birYrMnDt"]') as HTMLInputElement;
          if (birYrMnDtInput) {
            birYrMnDtInput.focus();
          }
        }, 100);
        return false;
      }
    }
    
    return true;
  };

  // AS-IS MXML??OnClick_RegNewPsm ?¨ìˆ˜?€ ?™ì¼???¬ì› ?•ë³´ ?€??ë¡œì§
  const handleSave = async () => {
    if (!employeeData) return;

    // AS-IS MXMLê³??™ì¼??validation ì²´í¬
    if (!validateInput("Registe")) {
      return;
    }

    // AS-IS MXMLê³??™ì¼: ?„ë¡œ?íŠ¸?•ë³´ ?°ì´??ë³€ê²½ì—¬ë¶€ Check
    if (isCheckProjectInputData() === true || newFlag === true) {
      showConfirm({
        message: newFlag ? '?ˆë¡œ???¬ì› ?•ë³´ë¥??±ë¡?˜ì‹œê² ìŠµ?ˆê¹Œ?' : '?¬ì› ?•ë³´ë¥??˜ì •?˜ì‹œê² ìŠµ?ˆê¹Œ?',
        type: 'info',
        onConfirm: async () => {
          await fnPsmBasicInfoUpdate();
        },
        onCancel: () => {
          // ?¬ì› ?•ë³´ ?€??ì·¨ì†Œ
        }
      });
    } else {
      // AS-IS MXMLê³??™ì¼: ê²½ë ¥ê°œì›”?˜ê³„?°ì„ ?¤ì‹œ ?????€?¥ì„ ?˜ë„ë¡??œë‹¤.
      const msg = setCarrMonthsComfirmMessage();
      showConfirm({
        message: msg,
        type: 'warning',
        onConfirm: () => {
          // ê²½ë ¥ê³„ì‚° ?ì—… ?¸ì¶œ
          if (validateInput("CarrCalc")) {
            setShowCarrCalcPopup(true);
          }
        },
        onCancel: () => {
          // ê²½ë ¥ ê³„ì‚° ì·¨ì†Œ
        }
      });
    }
  };

  // AS-IS MXML??setCarrMonthsComfirmMessage ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const setCarrMonthsComfirmMessage = (): string => {
    let strMsg = '';

    // "null" ë¬¸ì?´ì„ ë¹?ë¬¸ì?´ë¡œ ì¹˜í™˜?˜ëŠ” ?¬í¼ ?¨ìˆ˜
    const normalizeValue = (value: string | undefined): string => {
      if (!value || value === 'null') return '';
      return value;
    };

    if (normalizeValue(saveData.ctqlCd) !== normalizeValue(employeeData?.CTQL_CD)) {
      strMsg = '?ê²©ì¦??´ìš©??ë³€ê²½ë˜?ˆìŠµ?ˆë‹¤. ';
    } else if (normalizeValue(saveData.ctqlPurDt) !== normalizeValue(employeeData?.CTQL_PUR_DT)) {
      strMsg = '?ê²©ì¦ì·¨?ì¼?ê? ë³€ê²½ë˜?ˆìŠµ?ˆë‹¤. ';
    } else if (normalizeValue(saveData.fstInDt) !== normalizeValue(employeeData?.FST_IN_DT)) {
      strMsg = 'ìµœì´ˆ?¬ì…?¼ìê°€ ë³€ê²½ë˜?ˆìŠµ?ˆë‹¤. ';
    } else if (normalizeValue(saveData.lastEndDt) !== normalizeValue(employeeData?.LAST_END_DT)) {
      strMsg = 'ìµœì¢…ì² ìˆ˜?¼ìê°€ ë³€ê²½ë˜?ˆìŠµ?ˆë‹¤. ';
    } else {
      strMsg = '';
    }
    
    strMsg += 'ê²½ë ¥ê°œì›”??ê³„ì‚°???¤ì‹œ ????[?€?????˜ì‹­?œìš”. \nê²½ë ¥ê°œì›”?˜ê³„???”ë©´???ì—…?˜ì‹œê² ìŠµ?ˆê¹Œ?';
    
    return strMsg;
  };

  // AS-IS MXML??fnPsmBasicInfoUpdate ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const fnPsmBasicInfoUpdate = async () => {
    if (!employeeData) return;

    // AS-IS MXMLê³??™ì¼: ?€???„ì— ?„ì¬ ?°ì´?°ë? saveData???€??
    saveProjectInputData();

    setIsLoading(true);
    setError(null);

    try {
      // ?„ì†¡???°ì´??ë¡œê¹…
      const requestData = {
        mode: newFlag ? 'NEW' : 'MOD',
        empNo: employeeData.EMP_NO || '',
        ownOutsDiv: employeeData.OWN_OUTS_DIV_CD || '',
        entrCd: employeeData.ENTR_CD || '',
        empNm: employeeData.EMP_NM || '',
        empEngNm: employeeData.EMP_ENG_NM || '',
        resRegNo: employeeData.RES_REG_NO || '',
        birYrMnDt: employeeData.BIR_YR_MN_DT || '',
        sexDivCd: employeeData.SEX_DIV_CD || '',
        ntltDivCd: employeeData.NTLT_DIV_CD || '',
        entrDt: employeeData.ENTR_DT || '',
        retirDt: employeeData.RETIR_DT || '',
        hqDivCd: employeeData.HQ_DIV_CD || '',
        deptDivCd: employeeData.DEPT_DIV_CD || '',
        dutyCd: employeeData.DUTY_CD || '',
        lastTcnGrd: employeeData.LAST_TCN_GRD_CD || '',
        emailAddr: employeeData.EMAIL_ADDR || '',
        mobPhnNo: employeeData.MOB_PHN_NO || '',
        homeTel: employeeData.HOME_TEL || '',
        homeZipNo: employeeData.HOME_ZIP_NO || '',
        homeAddr: employeeData.HOME_ADDR || '',
        homeDetAddr: employeeData.HOME_DET_ADDR || '',
        lastInDt: employeeData.LAST_IN_DT || '',
        lastEndDt: employeeData.LAST_END_DT || '',
        inTcnt: employeeData.IN_TCNT || '',
        lastAdbgDiv: employeeData.LAST_ADBG_DIV || '',
        lastSchl: employeeData.LAST_SCHL || '',
        majr: employeeData.MAJR || '',
        lastGradDt: employeeData.LAST_GRAD_DT || '',
        ctqlCd: employeeData.CTQL_CD === 'null' ? '' : (employeeData.CTQL_CD || ''),
        ctqlPurDt: employeeData.CTQL_PUR_DT || '',
        carrMcnt: String(employeeData.CARR_MCNT || ''),
        wkgStDivCd: employeeData.WKG_ST_DIV_CD || '',
        userId: user?.userId || 'system',
        rmk: employeeData.RMK || '',
        kosaRegYn: employeeData.KOSA_REG_YN || '',
        kosaRnwDt: employeeData.KOSA_RNW_DT || '',
        fstInDt: employeeData.FST_IN_DT || '',
        entrBefCarr: String(employeeData.ENTR_BEF_CARR || ''),
        carrDivCd: employeeData.CARR_DIV_CD || '',
        adbgCarrMcnt: String(employeeData.ADBG_CARR_MCNT || ''),
        ctqlCarrMcnt: String(employeeData.CTQL_CARR_MCNT || ''),
        carrCalcStndDt: employeeData.CARR_CALC_STND_DT || '',
        entrBefAdbgCarr: String(employeeData.ENTR_BEF_ADBG_CARR || ''),
        entrBefCtqlCarr: String(employeeData.ENTR_BEF_CTQL_CARR || ''),
        entrAftAdbgCarr: String(employeeData.ENTR_AFT_ADBG_CARR || ''),
        entrAftCtqlCarr: String(employeeData.ENTR_AFT_CTQL_CARR || '')
      };
            
      // AS-IS MXMLê³??™ì¼???„ë¡œ?œì? ?¸ì¶œ ë°©ì‹
      const response = await fetch('/api/psm/employee/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: newFlag ? 'NEW' : 'MOD',
          empNo: employeeData.EMP_NO || '',
          ownOutsDiv: employeeData.OWN_OUTS_DIV_CD || '',
          entrCd: employeeData.ENTR_CD || '',
          empNm: employeeData.EMP_NM || '',
          empEngNm: employeeData.EMP_ENG_NM || '',
          resRegNo: employeeData.RES_REG_NO || '',
          birYrMnDt: employeeData.BIR_YR_MN_DT || '',
          sexDivCd: employeeData.SEX_DIV_CD || '',
          ntltDivCd: employeeData.NTLT_DIV_CD || '',
          entrDt: employeeData.ENTR_DT || '',
          retirDt: employeeData.RETIR_DT || '',
          hqDivCd: employeeData.HQ_DIV_CD || '',
          deptDivCd: employeeData.DEPT_DIV_CD || '',
          dutyCd: employeeData.DUTY_CD || '',
          lastTcnGrd: employeeData.LAST_TCN_GRD_CD || '',
          emailAddr: employeeData.EMAIL_ADDR || '',
          mobPhnNo: employeeData.MOB_PHN_NO || '',
          homeTel: employeeData.HOME_TEL || '',
          homeZipNo: employeeData.HOME_ZIP_NO || '',
          homeAddr: employeeData.HOME_ADDR || '',
          homeDetAddr: employeeData.HOME_DET_ADDR || '',
          lastInDt: employeeData.LAST_IN_DT || '',
          lastEndDt: employeeData.LAST_END_DT || '',
          inTcnt: employeeData.IN_TCNT || '',
          lastAdbgDiv: employeeData.LAST_ADBG_DIV || '',
          lastSchl: employeeData.LAST_SCHL || '',
          majr: employeeData.MAJR || '',
          lastGradDt: employeeData.LAST_GRAD_DT || '',
          ctqlCd: employeeData.CTQL_CD === 'null' ? '' : (employeeData.CTQL_CD || ''),
          ctqlPurDt: employeeData.CTQL_PUR_DT || '',
          carrMcnt: String(employeeData.CARR_MCNT || ''),
          wkgStDivCd: employeeData.WKG_ST_DIV_CD || '',
          userId: user?.userId || 'system',
          rmk: employeeData.RMK || '',
          kosaRegYn: employeeData.KOSA_REG_YN || '',
          kosaRnwDt: employeeData.KOSA_RNW_DT || '',
          fstInDt: employeeData.FST_IN_DT || '',
          entrBefCarr: String(employeeData.ENTR_BEF_CARR || ''),
          carrDivCd: employeeData.CARR_DIV_CD || '',
          adbgCarrMcnt: String(employeeData.ADBG_CARR_MCNT || ''),
          ctqlCarrMcnt: String(employeeData.CTQL_CARR_MCNT || ''),
          carrCalcStndDt: employeeData.CARR_CALC_STND_DT || '',
          entrBefAdbgCarr: String(employeeData.ENTR_BEF_ADBG_CARR || ''),
          entrBefCtqlCarr: String(employeeData.ENTR_BEF_CTQL_CARR || ''),
          entrAftAdbgCarr: String(employeeData.ENTR_AFT_ADBG_CARR || ''),
          entrAftCtqlCarr: String(employeeData.ENTR_AFT_CTQL_CARR || '')
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showToast('?€?¥ë˜?ˆìŠµ?ˆë‹¤.', 'info');
          
          // AS-IS MXMLê³??™ì¼: ?€?????ìœ„ ?”ë©´ ?¬ì¡°??(PSM1010M00)
          if (onSearchSuccess) {
            onSearchSuccess();
          }
        } else {
          setError(result.message);
          showToast(result.message, 'error');
        }
      } else {
        throw new Error('?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.');
      }
    } catch (error) {
      console.error('?€??ì¤??¤ë¥˜:', error);
      const errorMessage = error instanceof Error ? error.message : '?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // AS-IS MXML??setParameter ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const setParameter = (tmpStr: string, opt: number): string => {
    if (!tmpStr || tmpStr === '') {
      return '';
    } else {
      // ê³µë°± ?œê±°
      if (opt === 1) {
        tmpStr = tmpStr.replace(/ /g, '');
      }
      // ? ì§œ "/" ?œê±°
      else if (opt === 2) {
        tmpStr = tmpStr.replace(/ /g, '');
        tmpStr = tmpStr.replace(/\//g, '');
      }
      // ì£¼ë??±ë¡ë²ˆí˜¸, ?°í¸ë²ˆí˜¸ '-' ?œê±°
      else if (opt === 3) {
        tmpStr = tmpStr.replace(/ /g, '');
        tmpStr = tmpStr.replace(/-/g, '');
      }
    }
    return tmpStr;
  };

  // AS-IS MXMLê³??™ì¼???Œë¼ë¯¸í„° ë¹Œë“œ ë¡œì§
  const buildUpdateParameter = (): string => {
    if (!employeeData) return '';

    let objTemp = '';
    objTemp += setParameter(employeeData.EMP_NO || '', 1) + '|';
    objTemp += setParameter(employeeData.OWN_OUTS_DIV_CD || '', 1) + '|';
    objTemp += setParameter(employeeData.ENTR_CD || '', 1) + '|';
    objTemp += setParameter(employeeData.EMP_NM || '', 1) + '|';
    objTemp += setParameter(employeeData.EMP_ENG_NM || '', 1) + '|';
    objTemp += setParameter(employeeData.RES_REG_NO || '', 3) + '|';
    objTemp += setParameter(employeeData.BIR_YR_MN_DT || '', 2) + '|';
    objTemp += setParameter(employeeData.SEX_DIV_CD || '', 1) + '|';
    objTemp += setParameter(employeeData.NTLT_DIV_CD || '', 1) + '|';
    objTemp += setParameter(employeeData.ENTR_DT || '', 2) + '|';
    objTemp += setParameter(employeeData.RETIR_DT || '', 2) + '|';
    objTemp += setParameter(employeeData.HQ_DIV_CD || '', 1) + '|';
    objTemp += setParameter(employeeData.DEPT_DIV_CD || '', 1) + '|';
    objTemp += setParameter(employeeData.DUTY_CD || '', 1) + '|';
    objTemp += setParameter(employeeData.LAST_TCN_GRD || '', 1) + '|';
    objTemp += setParameter(employeeData.EMAIL_ADDR || '', 1) + '|';
    objTemp += setParameter(employeeData.MOB_PHN_NO || '', 1) + '|';
    objTemp += setParameter(employeeData.HOME_TEL || '', 1) + '|';
    objTemp += setParameter(employeeData.HOME_ZIP_NO || '', 3) + '|';
    objTemp += setParameter(employeeData.HOME_ADDR || '', 0) + '|';
    objTemp += setParameter(employeeData.HOME_DET_ADDR || '', 0) + '|';
    objTemp += '|'; // ìµœì´ˆ?¬ì…?¼ì (ë³„ë„ ì²˜ë¦¬)
    objTemp += setParameter(employeeData.LAST_END_DT || '', 2) + '|';
    objTemp += '|'; // ?¬ì…?Ÿìˆ˜
    objTemp += setParameter(employeeData.LAST_ADBG_DIV || '', 1) + '|';
    objTemp += setParameter(employeeData.LAST_SCHL || '', 1) + '|';
    objTemp += setParameter(employeeData.MAJR || '', 1) + '|';
    objTemp += setParameter(employeeData.LAST_GRAD_DT || '', 2) + '|';
    objTemp += setParameter(employeeData.CTQL_CD || '', 1) + '|';
    objTemp += setParameter(employeeData.CTQL_PUR_DT || '', 2) + '|';
    objTemp += getCarrMCnt(employeeData.CARR_MCNT || '0', '0') + '|';
    objTemp += setParameter(employeeData.WKG_ST_DIV_CD || '', 1) + '|';
    objTemp += 'system|'; // ë¡œê·¸?¸ì‚¬?©ìID
    objTemp += setParameter(employeeData.RMK || '', 1) + '|';
    objTemp += setParameter(employeeData.KOSA_REG_YN || 'N', 1) + '|';
    objTemp += setParameter(employeeData.KOSA_RNW_DT || '', 2) + '|';
    objTemp += '|' + setParameter(employeeData.FST_IN_DT || '', 2) + '|';
    objTemp += '|' + getCarrMCnt(employeeData.ENTR_BEF_CARR || '0', '0') + '|';
    objTemp += '|' + (employeeData.CARR_DIV_CD || '1') + '|';
    objTemp += '|' + (employeeData.ADBG_CARR_MCNT || '0') + '|';
    objTemp += '|' + (employeeData.CTQL_CARR_MCNT || '0') + '|';
    objTemp += '|' + setParameter(employeeData.CARR_CALC_STND_DT || '', 2) + '|';
    objTemp += '|' + (employeeData.ENTR_BEF_CARR || '0') + '|';
    objTemp += '|' + (employeeData.ENTR_BEF_CTQL_CARR || '0') + '|';
    objTemp += '|' + (employeeData.ENTR_AFT_ADBG_CARR || '0') + '|';
    objTemp += '|' + (employeeData.ENTR_AFT_CTQL_CARR || '0');

    return objTemp;
  };

  // ?¬ì› ?•ë³´ ?? œ
  // AS-IS MXML??OnClick_DelEmp() ?¨ìˆ˜?€ ?™ì¼???? œ ë¡œì§
  const handleDelete = async () => {
    // AS-IS?€ ?™ì¼: ?¬ì›ë²ˆí˜¸ ì²´í¬
    if (!employeeData?.EMP_NO) {
      showToast('?? œ???¬ì›??? íƒ??ì£¼ì‹­?œìš”.', 'warning');
      return;
    }

    // AS-IS?€ ?™ì¼: ?•ì¸ ?¤ì´?¼ë¡œê·?
    showConfirm({
      message: '?•ë§ ?? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?',
      type: 'warning',
      onConfirm: async () => {
        setIsLoading(true);
        setError(null);

        try {

          
          const response = await fetch('/api/psm/employee/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              empNo: employeeData.EMP_NO,
              userId: user?.userId || 'system'
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              // AS-IS?€ ?™ì¼: ?±ê³µ ë©”ì‹œì§€ ?œì‹œ
              showToast('?? œ?˜ì—ˆ?µë‹ˆ??', 'info');
              
              // AS-IS?€ ?™ì¼: ?¬ì›ë²ˆí˜¸ ?…ë°?´íŠ¸ (?±ê³µ ?‘ë‹µ?ì„œ ë°›ì? ?¬ì›ë²ˆí˜¸)
              if (result.data && result.data.empNo) {
                setEmployeeData(prev => ({
                  ...prev,
                  EMP_NO: result.data.empNo
                }));
              }
              
              // AS-IS?€ ?™ì¼: ?”ë©´ ì´ˆê¸°??
              handleNew();
              
              // AS-IS?€ ?™ì¼: ?ìœ„ ?”ë©´ ?¬ì¡°??(parentDocument.prf_PsmSearch)
              if (onSearchSuccess) {
                onSearchSuccess();
              }
            } else {
              setError(result.message || '?? œ???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
              showToast(result.message || '?? œ???¤íŒ¨?ˆìŠµ?ˆë‹¤.', 'error');
            }
          } else {
            throw new Error('?? œ???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
          }
        } catch (error) {
          console.error('?¬ì› ?? œ ì¤??¤ë¥˜:', error);
          const errorMessage = error instanceof Error ? error.message : '?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => {
        // ?¬ì› ?? œ ì·¨ì†Œ
      }
    });
  };

  // AS-IS MXML??initImpInfo() ?¨ìˆ˜?€ ?™ì¼??? ê·œ ?±ë¡ ë¡œì§
  const handleNew = () => {
    const today = new Date();
    const todayStr = today.getFullYear().toString() + 
                    String(today.getMonth() + 1).padStart(2, '0') + 
                    String(today.getDate()).padStart(2, '0');

    // AS-IS MXMLê³??™ì¼??ì´ˆê¸°??ë¡œì§
    setEmployeeData({
      // ê¸°ë³¸ êµ¬ë¶„ ?¤ì •
      OWN_OUTS_DIV_CD: '1',
      OWN_OUTS_DIV: '?ì‚¬',
      ENTR_CD: '',
      CARR_DIV_CD: '1',
      WKG_ST_DIV_CD: '1',
      WKG_ST_DIV: '?¬ì§ì¤?,
      KOSA_REG_YN: 'N',
      
      // ?¬ì› ?•ë³´ ì´ˆê¸°??
      EMP_NO: '',
      EMP_NM: '',
      EMP_ENG_NM: '',
      RES_REG_NO: '',
      BIR_YR_MN_DT: '',
      SEX_DIV_CD: '1',
      NTLT_DIV_CD: '1',
      ENTR_DT: '',
      RETIR_DT: '',
      
      // ì¡°ì§ ?•ë³´ ì´ˆê¸°??(AS-IS?€ ?™ì¼??ê¸°ë³¸ê°?
      HQ_DIV_CD: '',
      DEPT_DIV_CD: '',
      DUTY_CD: '9', // AS-IS: cbDuty.setValue("9")
      
      // ?™ë ¥ ?•ë³´ ì´ˆê¸°??
      LAST_ADBG_DIV: '',
      LAST_SCHL: '',
      MAJR: '',
      LAST_GRAD_DT: '',
      
      // ?°ë½ì²??•ë³´ ì´ˆê¸°??
      MOB_PHN_NO: '',
      HOME_TEL: '',
      HOME_ZIP_NO: '',
      HOME_ADDR: '',
      HOME_DET_ADDR: '',
      EMAIL_ADDR: '',
      
      // ?ê²©ì¦??•ë³´ ì´ˆê¸°??
      CTQL_CD: '',
      CTQL_PUR_DT: '',
      
      // ê²½ë ¥ ?•ë³´ ì´ˆê¸°??(AS-IS?€ ?™ì¼??ê¸°ë³¸ê°?
      CARR_MCNT: '0',
      ENTR_BEF_CARR: '0',
      ENTR_BEF_CTQL_CARR: '0',
      ADBG_CARR_MCNT: '0',
      CTQL_CARR_MCNT: '0',
      
      // ?¬ì… ?•ë³´ ì´ˆê¸°??(AS-IS: ìµœì´ˆ?¬ì…?¼ì = ?„ì¬?¼ì)
      FST_IN_DT: todayStr,
      LAST_END_DT: '',
      
      // ?¬ì§?„ìˆ˜ ì´ˆê¸°??(AS-IS?€ ?™ì¼??ê¸°ë³¸ê°?
      HDOFC_YEAR: '0',
      HDOFC_MONTH: '0',
      
      // ê¸°í? ?•ë³´ ì´ˆê¸°??
      LAST_TCN_GRD: '',
      KOSA_RNW_DT: '',
      CARR_CALC_STND_DT: '',
      RMK: '',
      
      // ?…ì‚¬??ê²½ë ¥ ì´ˆê¸°??
      ENTR_AFT_ADBG_CARR: '0',
      ENTR_AFT_CTQL_CARR: '0'
    });

    // AS-IS MXMLê³??™ì¼: ? ê·œ ?Œë˜ê·??¤ì • ë°?ë©”ì‹œì§€ ?œì‹œ
    setNewFlag(true);
    
    // AS-IS MXML??ê²½ë ¥ê°œì›”??ê³„ì‚° ë©”ì‹œì§€?€ ?™ì¼
            // ê²½ë ¥ê°œì›”?˜ì? ê¸°ìˆ ?±ê¸‰?€ [ê²½ë ¥ê°œì›”?˜ê³„?? ?”ë©´?ì„œ ê³„ì‚°?˜ê³  ?•ì¸ì²˜ë¦¬ë¥??µí•´???…ë ¥??ê°€?¥í•©?ˆë‹¤. [ê²½ë ¥ê³„ì‚°] ë²„íŠ¼???´ë¦­?˜ì„¸??
    
    // AS-IS MXMLê³??™ì¼: ê²½ë ¥ê³„ì‚° ë²„íŠ¼ ?œì‹œ (newFlagê°€ true???Œë§Œ ?œì‹œ)
    // ?´ëŠ” UI?ì„œ newFlag ?íƒœ???°ë¼ ê²½ë ¥ê³„ì‚° ë²„íŠ¼??visible???œì–´?˜ëŠ”???¬ìš©??
    
    // AS-IS MXMLê³??™ì¼: ? ê·œ ?±ë¡ ??ëª¨ë“  ?„ë“œ ?œì„±??
    // AS-IS: txtEmpNo.enabled = true; cbOwnOutsDiv.enabled = true; cbCrpnNm.enabled = true;
    // AS-IS: cbHqDiv.enabled = true; cbDeptDiv.enabled = true; cbDuty.enabled = true;
            // ? ê·œ ?±ë¡: ëª¨ë“  ?„ë“œê°€ ?œì„±?”ë˜?ˆìŠµ?ˆë‹¤.
    
    // AS-IS MXMLê³??™ì¼: ? ê·œ ?±ë¡ ???„ì¬ ?°ì´?°ë? saveData???€??
    setTimeout(() => {
      saveProjectInputData();
    }, 0);
  };

  // AS-IS MXML??getCarrMCnt ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const getCarrMCnt = (strYCnt: string, strMCnt: string): string => {
    if (strYCnt === "" && strMCnt === "") return "";
    
    const nYcnt = parseInt(strYCnt) || 0;
    const nMCnt = parseInt(strMCnt) || 0;
    
    return String((nYcnt * 12) + nMCnt);
  };



  // ?¬ì› ?•ë³´ ë³€ê²??¸ë“¤??
  const handleEmployeeChange = (field: string, value: string) => {
    if (!employeeData) return;

    setEmployeeData(prev => {
      const newData = {
        ...prev!,
        [field]: value
      };
      return newData;
    });

    // ê²½ë ¥êµ¬ë¶„ ë³€ê²???ê¸°ìˆ ?±ê¸‰ ?ë™ ê³„ì‚° (AS-IS MXML??onChangeCarrDiv ë¡œì§)
    if (field === 'CARR_DIV_CD') {
      handleCarrDivChange(value);
    }
  };

  // AS-IS MXML??onChangeCarrDiv ë¡œì§ê³??™ì¼
  const handleCarrDivChange = (carrDivCd: string) => {
    if (!employeeData) return;
    
    // ê¸°ìˆ ?±ê¸‰ ?ë™ ê³„ì‚°
    const newTcnGrd = getTcnGrd(carrDivCd);
    setEmployeeData(prev => ({
      ...prev!,
      LAST_TCN_GRD: newTcnGrd
    }));
  };

  // ì¹´ì¹´??ì£¼ì†Œ ê²€???ì—… ?¸ì¶œ
  const handleAddressSearch = () => {
    // ì¹´ì¹´??ì£¼ì†Œ ê²€???ì—… ?¤í¬ë¦½íŠ¸ê°€ ë¡œë“œ?˜ì–´ ?ˆëŠ”ì§€ ?•ì¸
    if (typeof window.daum !== 'undefined' && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data: any) {
          // ?ì—…?ì„œ ê²€?‰ê²°ê³???ª©???´ë¦­?ˆì„???¤í–‰??ì½”ë“œë¥??‘ì„±?˜ëŠ” ë¶€ë¶„ì…?ˆë‹¤.
          // ?ˆì œë¥?ì°¸ê³ ?˜ì—¬ ê°ì£¼ë¥??‘ì„±?˜ê±°?? ?„ë˜ ?ˆì œë¥??˜ì •?˜ì—¬ ?¬ìš©?˜ì‹œë©??©ë‹ˆ??
          
          // ?„ë¡œëª?ì£¼ì†Œ???¸ì¶œ ê·œì¹™???°ë¼ ì£¼ì†Œë¥??œì‹œ?©ë‹ˆ??
          // ?´ë ¤?¤ëŠ” ?°ì´?°ê? ?„ë¡œëª…ì£¼?Œì¼ ê²½ìš° linkRoadname??ê³µë°±?????ˆìŠµ?ˆë‹¤.
          let roadAddr = data.roadAddress; // ?„ë¡œëª?ì£¼ì†Œ ë³€??
          let jibunAddr = data.jibunAddress; // ì§€ë²?ì£¼ì†Œ ë³€??
          
          // ?°í¸ë²ˆí˜¸?€ ì£¼ì†Œ ?•ë³´ë¥??´ë‹¹ ?„ë“œ???£ëŠ”??
          setEmployeeData(prev => ({
            ...prev!,
            HOME_ZIP_NO: data.zonecode,
            HOME_ADDR: roadAddr || jibunAddr
          }));
          
          // ì°¸ê³ ??ª© ë¬¸ì?´ì´ ?ˆì„ ê²½ìš° ?´ë‹¹ ?„ë“œ???£ëŠ”??
          if (data.bname !== '' && /[??ë¡?ê°€]$/g.test(data.bname)) {
            // ?ì„¸ì£¼ì†Œ ?„ë“œ??ê±´ë¬¼ëª…ì„ ì¶”ê?
            setEmployeeData(prev => ({
              ...prev!,
              HOME_DET_ADDR: data.buildingName || ''
            }));
          }
        }
      }).open();
    } else {
      // ì¹´ì¹´??ì£¼ì†Œ ê²€???¤í¬ë¦½íŠ¸ê°€ ë¡œë“œ?˜ì? ?Šì? ê²½ìš°
      showToast('ì£¼ì†Œ ê²€???œë¹„?¤ë? ë¶ˆëŸ¬?¤ëŠ” ì¤‘ì…?ˆë‹¤. ? ì‹œ ???¤ì‹œ ?œë„?´ì£¼?¸ìš”.', 'warning');
      
      // ?¤í¬ë¦½íŠ¸ ?™ì  ë¡œë“œ
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        // ?¤í¬ë¦½íŠ¸ ë¡œë“œ ?„ë£Œ ???¤ì‹œ ?¸ì¶œ
        setTimeout(handleAddressSearch, 100);
      };
      document.head.appendChild(script);
    }
  };

  // AS-IS MXML??fnSaveProjecInputData ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const saveProjectInputData = () => {
    if (!employeeData) return;
    
    const newSaveData = {
      ctqlCd: employeeData.CTQL_CD === 'null' ? '' : (employeeData.CTQL_CD || ''),
      ctqlPurDt: employeeData.CTQL_PUR_DT || '',
      fstInDt: employeeData.FST_IN_DT || '',
      lastEndDt: employeeData.LAST_END_DT || '',
      lastTcnGrd: employeeData.LAST_TCN_GRD || ''
    };
    

    
    setSaveData(newSaveData);
  };

  // AS-IS MXML??isCheckProjectInputData ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const isCheckProjectInputData = (): boolean => {
    if (!employeeData) return false;
    
    // AS-IS?€ ?™ì¼??? ì§œ ?¬ë§·???¨ìˆ˜
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return '';
      return dateStr.replace(/\//g, ''); // ?¬ë˜???œê±°
    };
    

    
    if (saveData.ctqlCd !== (employeeData.CTQL_CD === 'null' ? '' : (employeeData.CTQL_CD || ''))) {
      return false;
    }
    
    else if (formatDate(saveData.ctqlPurDt) !== formatDate(employeeData.CTQL_PUR_DT || '')) {
      return false;
    }
    
    else if (formatDate(saveData.fstInDt) !== formatDate(employeeData.FST_IN_DT || '')) {
      return false;
    }
    
    else if (formatDate(saveData.lastEndDt) !== formatDate(employeeData.LAST_END_DT || '')) {
      if (employeeData.OWN_OUTS_DIV_CD === '2') {
        return false; // ?¸ì£¼??ê²½ìš°?ë§Œ ìµœì¢…ì² ìˆ˜?¼ìë¥?Check?œë‹¤.
      }
    }
    return true;
  };

  // AS-IS MXML??getTcnGrd ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const getTcnGrd = (carrDivCd: string): string => {
    if (!employeeData) return "";
    
    const carrMonths = Number(employeeData.CARR_MCNT || 0);
    const lastAdbgDiv = employeeData.LAST_ADBG_DIV || "";
    const ctqlCd = employeeData.CTQL_CD === 'null' ? '' : (employeeData.CTQL_CD || "");

    if (carrDivCd === "1") {
      // ?™ë ¥ ê¸°ì?
      if (lastAdbgDiv === "04") { // ?„ë¬¸?™ì‚¬
        if (carrMonths < 108) return "4";
        else if (carrMonths < 108 + 36) return "3";
        else if (carrMonths < 108 + 36 + 36) return "2";
        else return "1";
      }
      else if (lastAdbgDiv === "03") { // ?™ì‚¬
        if (carrMonths < 72) return "4";
        else if (carrMonths < 72 + 36) return "3";
        else if (carrMonths < 72 + 36 + 36) return "2";
        else return "1";
      }
      else if (lastAdbgDiv === "02") { // ?ì‚¬
        if (carrMonths < 36) return "4";
        else if (carrMonths < 36 + 36) return "3";
        else if (carrMonths < 36 + 36 + 36) return "2";
        else return "1";
      }
      else if (lastAdbgDiv === "01") { // ë°•ì‚¬
        if (carrMonths < 36) return "2";
        else return "1";
      }
      else if (lastAdbgDiv === "05") { // ê³ ì¡¸
        if (carrMonths < 144) return "4";
        else if (carrMonths < 144 + 36) return "3";
        else if (carrMonths < 144 + 36 + 36) return "2";
        else return "1";
      }
      else {
        return employeeData.LAST_TCN_GRD || "";
      }
    }
    else if (carrDivCd === "2") {
      // ê¸°ìˆ ?ê²© ê¸°ì?
      if (ctqlCd === "01") { // ê¸°ì‚¬
        if (carrMonths < 36) return "4";
        else if (carrMonths < 36 + 36) return "3";
        else if (carrMonths < 36 + 36 + 36) return "2";
        else return "1";
      }
      else if (ctqlCd === "02") { // ?°ì—…ê¸°ì‚¬
        if (carrMonths < 72) return "4";
        else if (carrMonths < 72 + 36) return "3";
        else if (carrMonths < 72 + 36 + 36) return "2";
        else return "1";
      }
      else {
        return employeeData.LAST_TCN_GRD || "";
      }
    }
    else {
      return employeeData.LAST_TCN_GRD || "";
    }
  };

  return (
    <div className="relative" style={{ zIndex: -999 }}>
      
      <div className="search-div">
        <table className="search-table w-full">
          <tbody>
            {/* 1??/}
            <tr className="search-tr">
              <th className="search-th">?ì‚¬ ?¸ì£¼ êµ¬ë¶„</th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  value={employeeData?.OWN_OUTS_DIV_CD || ''}
                  onChange={(e) => handleSearchChange('ownOutsDiv', e.target.value)}
                  disabled={newFlag ? false : !fieldEnableState?.ownOutsDiv}
                >
                  {commonCodes.ownOutsDiv.map(code => (
                    <option key={code.data} value={code.data}>{code.label}</option>
                  ))}
                </select>

              </td>

              <th className="search-th">?…ì²´ëª?/th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  value={employeeData?.ENTR_CD || ''}
                  data-field="crpnNm"
                  onChange={(e) => handleEmployeeChange('ENTR_CD', e.target.value)}
                  disabled={newFlag ? false : !fieldEnableState?.crpnNm}
                >
                  <option key="select-default" value="">? íƒ?˜ì„¸??/option>
                  {(() => {
                    
                    if (employeeData?.OWN_OUTS_DIV_CD === '1') {
                      // ?ì‚¬??ê²½ìš°: ?ì‚¬ ?…ì²´ ëª©ë¡
                      if (commonCodes.ownCompanyList.length === 0) {
                        return <option key="loading-own" value="" disabled>ë¡œë”©ì¤?..</option>;
                      }
                      return commonCodes.ownCompanyList.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ));
                    } else if (employeeData?.OWN_OUTS_DIV_CD === '2') {
                      // ?¸ì£¼??ê²½ìš°: ?¸ì£¼ ?…ì²´ ëª©ë¡
                      if (commonCodes.entrList.length === 0) {
                        return <option key="loading-entr" value="" disabled>ë¡œë”©ì¤?..</option>;
                      }
                      
                      return commonCodes.entrList.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ));
                    }
                    return null;
                  })()}
                </select>

              </td>

              <th className="search-th ">?¬ì›ë²ˆí˜¸</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full min-w-[150px]" 
                  data-field="empNo"
                  value={employeeData?.EMP_NO || ''} 
                  onChange={(e) => {
                    const value = e.target.value;
                    // ?¬ì›ë²ˆí˜¸: 10ë°”ì´???œí•œ (?«ì/?ë¬¸ ?„ì£¼)
                    const byteLength = new Blob([value]).size;
                    if (byteLength <= 10) {
                      handleEmployeeChange('EMP_NO', value);
                    }
                  }}
                  disabled={(() => {
                    // AS-IS MXMLê³??™ì¼??ë¡œì§: ?ì‚¬/?¸ì£¼ êµ¬ë¶„???°ë¥¸ ?¬ì›ë²ˆí˜¸ ?œì„±??ë¹„í™œ?±í™”
                    if (newFlag) {
                      // ? ê·œ ëª¨ë“œ???ŒëŠ” ?ì‚¬/?¸ì£¼ êµ¬ë¶„???°ë¼ ?œì–´
                      return employeeData?.OWN_OUTS_DIV_CD === '2'; // ?¸ì£¼ë©?ë¹„í™œ?±í™” (?ë™ì±„ë²ˆ)
                    } else {
                      // ?˜ì • ëª¨ë“œ???ŒëŠ” fieldEnableStateë¡??œì–´
                      return !fieldEnableState?.empNo;
                    }
                  })()}
                />
              </td>

              <th className="search-th">ë³¸ë?</th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  data-field="hqDiv"
                  value={employeeData?.HQ_DIV_CD || ''}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    
                    // ì§ì ‘ employeeData ?…ë°?´íŠ¸
                    setEmployeeData(prev => {
                      if (!prev) return prev;
                      const newData = {
                        ...prev,
                        HQ_DIV_CD: selectedValue
                      };
                      return newData;
                    });
                    
                    // ë³¸ë? ë³€ê²???ë¶€??ëª©ë¡ ?…ë°?´íŠ¸
                    if (selectedValue) {
                      handleHqDivChange(selectedValue);
                      // ë¶€??ì½”ë“œ ì´ˆê¸°??
                      setEmployeeData(prev => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          DEPT_DIV_CD: ''
                        };
                      });
                    }
                  }}
                  disabled={newFlag ? false : !fieldEnableState?.hqDiv}
                >
                  {<option key="hq-select-default" value="">? íƒ?˜ì„¸??/option>}
                  {commonCodes.hqDiv.map(code => (
                    <option key={code.data} value={code.data}>{code.label}</option>
                  ))}
                </select>

              </td>

              <th className="search-th">ë¶€??/th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  data-field="deptDiv"
                  value={employeeData?.DEPT_DIV_CD || ''}
                  onChange={(e) => handleEmployeeChange('DEPT_DIV_CD', e.target.value)}
                  disabled={newFlag ? false : !fieldEnableState?.deptDiv}
                >
                  <option key="dept-select-default" value="">? íƒ?˜ì„¸??/option>
                  {commonCodes.deptDiv.map(code => (
                    <option key={code.data} value={code.data}>{code.label}</option>
                  ))}
                </select>
              </td>

              <th className="search-th">ì§ì±…</th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  value={employeeData?.DUTY_CD || ''}
                  onChange={(e) => handleEmployeeChange('DUTY_CD', e.target.value)}
                  disabled={newFlag ? false : !fieldEnableState?.duty}
                >
                  <option key="duty-select-default" value="">? íƒ?˜ì„¸??/option>
                  {commonCodes.duty.map(code => (
                    <option key={code.data} value={code.data}>{code.label}</option>
                  ))}
                </select>
              </td>
            </tr>

            {/* 2?? ì¡°íšŒ ë²„íŠ¼ */}
            <tr className="search-tr">
              <th className="search-th  ">ê·¼ë¬´?íƒœ</th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  data-field="wkgStDiv"
                  value={employeeData?.WKG_ST_DIV_CD || '1'}
                  onChange={(e) => handleEmployeeChange('WKG_ST_DIV_CD', e.target.value)}
                >
                  {commonCodes.wkgStDiv.map(code => (
                    <option key={code.data} value={code.data}>{code.label}</option>
                  ))}
                </select>
              </td>

              <th className="search-th ">?…ì‚¬?¼ì</th>
              <td className="search-td">
                <input 
                  type="date" 
                  className="input-base .input-calender min-w-[150px]" 
                  data-field="entrDt"
                  value={employeeData?.ENTR_DT ? employeeData.ENTR_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                  onChange={(e) => handleEmployeeChange('ENTR_DT', e.target.value.replace(/-/g, ''))}
                />
              </td>

              <th className="search-th  ">?´ì‚¬?¼ì</th>
              <td className="search-td">
                <input 
                  type="date" 
                  className="input-base .input-calender min-w-[150px]" 
                  value={employeeData?.RETIR_DT ? employeeData.RETIR_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                  onChange={(e) => handleEmployeeChange('RETIR_DT', e.target.value.replace(/-/g, ''))}
                />
              </td>

              <th className="search-th">?¬ì§?„ìˆ˜</th>
              <td className="search-td" colSpan={3}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input-base input-default !w-[50px] text-right"
                    placeholder="00"
                    value={employeeData?.HDOFC_YEAR || ''}
                    readOnly
                  />
                  <span className="m-2">??/span>
                  <input
                    type="text"
                    className="input-base input-default !w-[50px] text-right"
                    placeholder="00"
                    value={employeeData?.HDOFC_MONTH || ''}
                    readOnly
                  />
                                    <span className="m-2">??/span>
                  { <div className="ml-auto">
                <button 
                  className="btn-base btn-search"
                  onClick={handleSearch}
                  disabled={isLoading}
                  style={{visibility: 'hidden'}}
                >
                  {isLoading ? 'ì¡°íšŒì¤?..' : 'ì¡°íšŒ'}
                </button>
                  </div> }
                </div>
              </td>


            </tr>
          </tbody>
        </table>
      </div>

      {/* ?ëŸ¬ ë©”ì‹œì§€ */}
      {error && (
        <div className="text-red-500 text-sm mt-2 px-1">
          {error}
        </div>
      )}

      {/*ì¡°íšŒ???ì—­*/}
      <div className="flex gap-4 mt-4 text-sm">
        {/* ê°œì¸ ?•ë³´ */}
        <div className="w-1/2 ">
          <div className="font-semibold mb-1 pl-1">ê°œì¸ ?•ë³´</div>
          <div className="clearbox-div">
            <table className="clear-table">
              <tbody>
                <tr className="clear-tr">
                  <th className="clear-th">?±ëª…</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      data-field="empNm"
                      value={employeeData?.EMP_NM || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ë°”ì´??ê¸¸ì´ ê³„ì‚° (?œê? 1ê¸€??= 3ë°”ì´??
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 20) {
                          handleEmployeeChange('EMP_NM', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">ìµœì¢…?™ë ¥</th>
                  <td className="clear-td">
                    <select 
                      className="combo-base w-full"
                      data-field="lastAdbgDiv"
                      value={employeeData?.LAST_ADBG_DIV || ''}
                      onChange={(e) => handleEmployeeChange('LAST_ADBG_DIV', e.target.value)}
                    >
                      <option key="lastAdbg-select-default" value="">? íƒ?˜ì„¸??/option>
                      {commonCodes.lastAdbgDiv.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">?ë¬¸ ?±ëª…</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.EMP_ENG_NM || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ?ë¬¸ ?±ëª…: 50ë°”ì´???œí•œ (?ë¬¸ ?„ì£¼)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 50) {
                          handleEmployeeChange('EMP_ENG_NM', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">?™êµ</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.LAST_SCHL || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ?™êµëª? 50ë°”ì´???œí•œ (?œê? ?¬í•¨)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 50) {
                          handleEmployeeChange('LAST_SCHL', value);
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">?±ë³„</th>
                  <td className="clear-td">
                    <select 
                      className="combo-base w-full"
                      value={employeeData?.SEX_DIV_CD || ''}
                      onChange={(e) => handleEmployeeChange('SEX_DIV_CD', e.target.value)}
                    >
                      {commonCodes.sexDiv.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ))}
                    </select>
                  </td>
                  <th className="clear-th">?„ê³µ</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.MAJR || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ?„ê³µëª? 50ë°”ì´???œí•œ (?œê? ?¬í•¨)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 50) {
                          handleEmployeeChange('MAJR', value);
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">êµ? </th>
                  <td className="clear-td">
                    <select 
                      className="combo-base w-full"
                      value={employeeData?.NTLT_DIV_CD || ''}
                      onChange={(e) => handleEmployeeChange('NTLT_DIV_CD', e.target.value)}
                    >
                      {commonCodes.ntltDiv.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ))}
                    </select>
                  </td>
                  <th className="clear-th">ì¡¸ì—…?¼ì</th>
                  <td className="clear-td">
                    <input 
                      type="date" 
                      className="input-base .input-calender" 
                      value={employeeData?.LAST_GRAD_DT ? employeeData.LAST_GRAD_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                      onChange={(e) => handleEmployeeChange('LAST_GRAD_DT', e.target.value.replace(/-/g, ''))}
                    />
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">ì£¼ë??±ë¡ë²ˆí˜¸</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.RES_REG_NO || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ì£¼ë??±ë¡ë²ˆí˜¸: 13ë°”ì´???œí•œ (?«ì + ?˜ì´??
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 13) {
                          handleEmployeeChange('RES_REG_NO', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">?ë…„?”ì¼</th>
                  <td className="clear-td">
                    <input 
                      type="date" 
                      className="input-base .input-calender" 
                      data-field="birYrMnDt"
                      value={employeeData?.BIR_YR_MN_DT ? employeeData.BIR_YR_MN_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                      onChange={(e) => handleEmployeeChange('BIR_YR_MN_DT', e.target.value.replace(/-/g, ''))}
                    />
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">?´ë??„í™”</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.MOB_PHN_NO || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ?´ë??„í™”: 20ë°”ì´???œí•œ (?«ì + ?˜ì´??
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 20) {
                          handleEmployeeChange('MOB_PHN_NO', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">?íƒ?„í™”</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.HOME_TEL || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ?íƒ?„í™”: 20ë°”ì´???œí•œ (?«ì + ?˜ì´??
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 20) {
                          handleEmployeeChange('HOME_TEL', value);
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">E-Mail</th>
                  <td className="clear-td" colSpan={3}>
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.EMAIL_ADDR || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // E-Mail: 100ë°”ì´???œí•œ (?ë¬¸ + ?¹ìˆ˜ë¬¸ì)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 100) {
                          handleEmployeeChange('EMAIL_ADDR', value);
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">ì£¼ì†Œ</th>
                                      <td className="clear-td" colSpan={3}>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          className="input-base input-default !w-[70px]" 
                          placeholder="?°í¸ë²ˆí˜¸"
                          value={employeeData?.HOME_ZIP_NO || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            // ?°í¸ë²ˆí˜¸: 6ë°”ì´???œí•œ (?«ì)
                            const byteLength = new Blob([value]).size;
                            if (byteLength <= 6) {
                              handleEmployeeChange('HOME_ZIP_NO', value);
                            }
                          }}
                          readOnly
                        />
                        <button 
                          className="btn-base btn-act w-[10%]"
                          onClick={handleAddressSearch}
                        >
                          ì°¾ê¸°
                        </button>
                        <input 
                          className="input-base input-default w-[40%]" 
                          placeholder="ê¸°ë³¸ì£¼ì†Œ"
                          value={employeeData?.HOME_ADDR || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            // ê¸°ë³¸ì£¼ì†Œ: 200ë°”ì´???œí•œ (?œê? ?¬í•¨)
                            const byteLength = new Blob([value]).size;
                            if (byteLength <= 200) {
                              handleEmployeeChange('HOME_ADDR', value);
                            }
                          }}
                        />
                        <input 
                          className="input-base input-default w-[40%]" 
                          placeholder="?ì„¸ì£¼ì†Œ"
                          value={employeeData?.HOME_DET_ADDR || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            // ?ì„¸ì£¼ì†Œ: 100ë°”ì´???œí•œ (?œê? ?¬í•¨)
                            const byteLength = new Blob([value]).size;
                            if (byteLength <= 100) {
                              handleEmployeeChange('HOME_DET_ADDR', value);
                            }
                          }}
                        />
                      </div>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ?„ë¡œ?íŠ¸ ?•ë³´ */}
        <div className="w-1/2">
          <div className="font-semibold mb-1 pl-1">?„ë¡œ?íŠ¸ ?•ë³´</div>
          <div className="clearbox-div">
            <table className="clear-table">
              <tbody>
                <tr className="clear-tr">
                  <th className="clear-th">ê¸°ì? ?•ë³´</th>
                  <td className="clear-td" colSpan={3}>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center gap-1">
                        <input 
                          type="radio" 
                          name="carrDiv" 
                          value="1"
                          checked={employeeData?.CARR_DIV_CD === '1'}
                          onChange={(e) => handleEmployeeChange('CARR_DIV_CD', e.target.value)}
                          disabled={true}
                        /> 
                        ?™ë ¥
                      </label>
                      <label className="inline-flex items-center gap-1">
                        <input 
                          type="radio" 
                          name="carrDiv" 
                          value="2"
                          checked={employeeData?.CARR_DIV_CD === '2'}
                          onChange={(e) => handleEmployeeChange('CARR_DIV_CD', e.target.value)}
                          disabled={true}
                        /> 
                        ê¸°ìˆ ?ê²©
                      </label>
                    </div>
                  </td>
                </tr>

                <tr className="clear-tr">
                  <th className="clear-th">?ê²©ì¦?/th>
                  <td className="clear-td">
                    <select 
                      className="combo-base w-full"
                      value={employeeData?.CTQL_CD || ''}
                      onChange={(e) => handleEmployeeChange('CTQL_CD', e.target.value)}
                    >
                      <option key="ctql-select-default" value="">? íƒ?˜ì„¸??/option>
                      {commonCodes.ctqlCd.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ))}
                    </select>
                  </td>
                  <th className="clear-th">?ê²©ì¦?ì·¨ë“?¼ì</th>
                  <td className="clear-td">
                    <input 
                      type="date" 
                      className="input-base .input-calender" 
                      data-field="ctqlPurDt"
                      value={employeeData?.CTQL_PUR_DT ? employeeData.CTQL_PUR_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                      onChange={(e) => handleEmployeeChange('CTQL_PUR_DT', e.target.value.replace(/-/g, ''))}
                    />
                  </td>
                </tr>

                <tr className="clear-tr">
                  <th className="clear-th">ìµœì´ˆ ?¬ì…?¼ì</th>
                  <td className="clear-td">
                    <input 
                      type="date" 
                      className="input-base .input-calender" 
                      data-field="fstInDt"
                      value={employeeData?.FST_IN_DT ? employeeData.FST_IN_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                      onChange={(e) => handleEmployeeChange('FST_IN_DT', e.target.value.replace(/-/g, ''))}
                    />
                  </td>
                  <th className="clear-th">ìµœì¢… ì² ìˆ˜?¼ì</th>
                  <td className="clear-td">
                    <input 
                      type="date" 
                      className="input-base .input-calender" 
                      data-field="lastEndDt"
                      value={employeeData?.LAST_END_DT ? employeeData.LAST_END_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                      onChange={(e) => handleEmployeeChange('LAST_END_DT', e.target.value.replace(/-/g, ''))}
                    />
                  </td>
                </tr>

                <tr className="clear-tr">
                  <th className="clear-th">?…ì‚¬ ??ê²½ë ¥</th>
                  <td className="clear-td">
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        className="input-base input-default !w-[50px] text-right" 
                        placeholder="00" 
                        maxLength={3}
                        onChange={(e) => {
                          const value = e.target.value;
                          // ?…ì‚¬ ??ê²½ë ¥ ?„ìˆ˜: 3ë°”ì´???œí•œ (?«ì)
                          const byteLength = new Blob([value]).size;
                          if (byteLength <= 3) {
                            const years = Number(value) || 0;
                            const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                            // AS-IS?€ ?™ì¼??ê³„ì‚° ë¡œì§
                            const currentTotalMonths = carrDivCd === '1' 
                              ? Number(employeeData?.ENTR_BEF_CARR || 0)
                              : Number(employeeData?.ENTR_BEF_CTQL_CARR || 0);
                            const currentYears = Math.floor(currentTotalMonths / 12);
                            const currentMonths = currentTotalMonths - (currentYears * 12);
                            const totalMonths = years * 12 + currentMonths;
                            
                            if (carrDivCd === '1') {
                              handleEmployeeChange('ENTR_BEF_CARR', String(totalMonths));
                            } else {
                              handleEmployeeChange('ENTR_BEF_CTQL_CARR', String(totalMonths));
                            }
                          }
                        }}
                        value={(() => {
                          // AS-IS MXML ë¡œì§ê³??™ì¼: ê²½ë ¥êµ¬ë¶„???°ë¥¸ ë¶„ê¸°
                          const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                          const befCarrMonths = carrDivCd === '1' 
                            ? Number(employeeData?.ENTR_BEF_CARR || 0)
                            : Number(employeeData?.ENTR_BEF_CTQL_CARR || 0);
                          // AS-IS?€ ?™ì¼?˜ê²Œ Math.floor ?¬ìš©
                          return befCarrMonths > 0 ? Math.floor(befCarrMonths / 12) : '';
                        })()}
                      />
                      <span className="m-0">??/span>
                      <input 
                        type="text" 
                        className="input-base input-default !w-[50px] text-right" 
                        placeholder="00" 
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value;
                          // ?…ì‚¬ ??ê²½ë ¥ ?”ìˆ˜: 2ë°”ì´???œí•œ (?«ì)
                          const byteLength = new Blob([value]).size;
                          if (byteLength <= 2) {
                            const months = Number(value) || 0;
                            const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                            // AS-IS?€ ?™ì¼??ê³„ì‚° ë¡œì§
                            const currentTotalMonths = carrDivCd === '1' 
                              ? Number(employeeData?.ENTR_BEF_CARR || 0)
                              : Number(employeeData?.ENTR_BEF_CTQL_CARR || 0);
                            const currentYears = Math.floor(currentTotalMonths / 12);
                            const totalMonths = currentYears * 12 + months;
                            
                            if (carrDivCd === '1') {
                              handleEmployeeChange('ENTR_BEF_CARR', String(totalMonths));
                            } else {
                              handleEmployeeChange('ENTR_BEF_CTQL_CARR', String(totalMonths));
                            }
                          }
                        }}
                        value={(() => {
                          // AS-IS MXML ë¡œì§ê³??™ì¼: ê²½ë ¥êµ¬ë¶„???°ë¥¸ ë¶„ê¸°
                          const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                          const befCarrMonths = carrDivCd === '1' 
                            ? Number(employeeData?.ENTR_BEF_CARR || 0)
                            : Number(employeeData?.ENTR_BEF_CTQL_CARR || 0);
                          // AS-IS?€ ?™ì¼??ê³„ì‚° ë¡œì§: nBefCarrMCnt = nBefCarrMCnt - (nBefCarrYCnt*12)
                          const befCarrYears = Math.floor(befCarrMonths / 12);
                          return befCarrMonths > 0 ? befCarrMonths - (befCarrYears * 12) : '';
                        })()}
                      />
                      <span className="m-0">??/span>
                    </div>
                  </td>
                  <th className="clear-th">ê²½ë ¥ ê°œì›” ??/th>
                  <td className="clear-td">
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        className="input-base input-default !w-[50px] text-right" 
                        placeholder="00" 
                        value={(() => {
                          // AS-IS MXML ë¡œì§ê³??™ì¼: ê²½ë ¥ê°œì›”?˜ë? xx?„xxxê°œì›”ë¡??œì‹œ
                          const carrMonths = Number(employeeData?.CARR_MCNT || 0);
                          // AS-IS?€ ?™ì¼?˜ê²Œ Math.floor ?¬ìš©
                          return carrMonths > 0 ? Math.floor(carrMonths / 12) : '';
                        })()}
                        readOnly
                      />
                      <span className="m-0">??/span>
                      <input 
                        type="text" 
                        className="input-base input-default !w-[50px] text-right" 
                        placeholder="00" 
                        value={(() => {
                          // AS-IS MXML ë¡œì§ê³??™ì¼: ê²½ë ¥ê°œì›”?˜ë? xx?„xxxê°œì›”ë¡??œì‹œ
                          const carrMonths = Number(employeeData?.CARR_MCNT || 0);
                          // AS-IS?€ ?™ì¼??ê³„ì‚° ë¡œì§: nCarrMCnt = nCarrMCnt - (nCarrYCnt*12)
                          const carrYears = Math.floor(carrMonths / 12);
                          return carrMonths > 0 ? carrMonths - (carrYears * 12) : '';
                        })()}
                        readOnly
                      />
                      <span className="m-0">ê°œì›”</span>
                    </div>
                  </td>
                </tr>

                <tr className="clear-tr">
                  <th className="clear-th">ê³„ì‚° ê¸°ì? ?¼ì</th>
                  <td className="clear-td">
                    <input 
                      type="date" 
                      className="input-base .input-calender" 
                      value={employeeData?.CARR_CALC_STND_DT ? employeeData.CARR_CALC_STND_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                      onChange={(e) => handleEmployeeChange('CARR_CALC_STND_DT', e.target.value.replace(/-/g, ''))}
                    />
                  </td>
                  <th className="clear-th">ê¸°ìˆ ?±ê¸‰</th>
                  <td className="clear-td">
                    <div className="flex gap-1">
                      <select 
                        className="combo-base w-full"
                        value={employeeData?.LAST_TCN_GRD || ''}
                        onChange={(e) => handleEmployeeChange('LAST_TCN_GRD', e.target.value)}
                      >
                        {commonCodes.tcnGrd.map(code => (
                          <option key={code.data} value={code.data}>{code.label}</option>
                        ))}
                      </select>
                      <button 
                        className="btn-base btn-act w-full"
                        data-field="carrCalcBtn"
                        onClick={() => {
                          // AS-IS MXML??onClickBtnCarrCalc ë¡œì§ê³??™ì¼
                          if (!validateInput("CarrCalc")) {
                            return;
                          }
                          setShowCarrCalcPopup(true);
                          // ?ì—… ?´ë¦´ ??body scroll ë°©ì? ë°????¨ê?
                          document.body.style.overflow = 'hidden';
                          // ??ì»¨í…Œ?´ë„ˆ ?¨ê?
                          const tabContainer = document.querySelector('.tab-container');
                          if (tabContainer) {
                            (tabContainer as HTMLElement).style.display = 'none';
                          }
                        }}
                      >
                        ê²½ë ¥ê³„ì‚°
                      </button>
                      <button 
                        className="btn-base btn-act w-full"
                        onClick={() => {
                          // AS-IS MXML??onClickBtnGrdCHngSrch ë¡œì§ê³??™ì¼
                          if (newFlag) {
                            showToast('? ê·œ ?…ë ¥ ?œì—??ê¸°ìˆ ?±ê¸‰?´ë ¥ ì¡°íšŒë¥??????†ìŠµ?ˆë‹¤. ?€????ì¡°íšŒ ?˜ì‹­?œìš”.', 'warning');
                            return;
                          }
                          
                          if (!employeeData?.EMP_NO) {
                            showToast('?¬ì›ë²ˆí˜¸ê°€ ?„ìš”?©ë‹ˆ??', 'warning');
                            return;
                          }
                          
                          setShowGradeHistoryPopup(true);
                          // ?ì—… ?´ë¦´ ??body scroll ë°©ì? ë°????¨ê?
                          document.body.style.overflow = 'hidden';
                          // ??ì»¨í…Œ?´ë„ˆ ?¨ê?
                          const tabContainer = document.querySelector('.tab-container');
                          if (tabContainer) {
                            (tabContainer as HTMLElement).style.display = 'none';
                          }
                        }}
                      >
                        ?±ê¸‰?´ë ¥ì¡°íšŒ
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="clear-tr">
                  <th className="clear-th align-top pt-2">ë¹„ê³ </th>
                  <td className="clear-td" colSpan={3}>
                    <textarea 
                      className="textarea_def" 
                      value={employeeData?.RMK || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ë¹„ê³ : 500ë°”ì´???œí•œ (?œê? ?¬í•¨)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 500) {
                          handleEmployeeChange('RMK', value);
                        }
                      }}
                    />
                  </td>
                </tr> 
              </tbody>
            </table>
            {/* ?ˆë‚´ë¬¸êµ¬ + ë²„íŠ¼??*/}
            <div className="flex justify-between items-center mt-2 px-1">
              <p className="text-[13px] text-[#00509A]">
                ??ì¡°íšŒë§?ê°€?¥í•©?ˆë‹¤. ?„ë¡œ?íŠ¸ ?•ë³´ ?˜ì •?€ ê²½ì˜ì§€?ë³¸ë¶€ ?¸ì‚¬?´ë‹¹?ë§Œ ê°€?¥í•©?ˆë‹¤.
              </p>
              <div className="flex gap-2">
                <button 
                  className="btn-base btn-delete"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  ?? œ
                </button>
                <button 
                  className="btn-base btn-etc"
                  onClick={handleNew}
                  disabled={isLoading}
                >
                  ? ê·œ
                </button>
                <button 
                  className="btn-base btn-act"
                  onClick={handleSave}
                  disabled={isLoading || (!newFlag && (!employeeData?.EMP_NO || employeeData.EMP_NO.trim() === ''))}
                >
                  ?€??
                </button>
              </div>
            </div>


          </div>
        </div>

      </div>

      {/* ê²½ë ¥ê³„ì‚° ?ì—… */}
      {showCarrCalcPopup && (
        <PSM1050M00
              employeeData={employeeData}
              newFlag={newFlag}
              onClose={() => {
                setShowCarrCalcPopup(false);
                // ?ì—… ?«í ??body scroll ë³µì› ë°????œì‹œ
                document.body.style.overflow = 'auto';
                // ??ì»¨í…Œ?´ë„ˆ ?¤ì‹œ ?œì‹œ
                const tabContainer = document.querySelector('.tab-container');
                if (tabContainer) {
                  (tabContainer as HTMLElement).style.display = 'flex';
                }
              }}
              onConfirm={(data) => {
                // AS-IS MXML??onBtnConfirmClick ë¡œì§ê³??™ì¼
                
                // ê²½ë ¥ê³„ì‚° ê²°ê³¼ë¥?employeeData??ë°˜ì˜
                if (data && employeeData) {
                  const resultData = data.split('^');
                  
                  // AS-IS MXMLê³??™ì¼???°ì´??ë§¤í•‘
                  // [1]ìµœì´ˆ?¬ì…?¼ì [2]ìµœì¢…ì² ìˆ˜?¼ì [3]?…ì‚¬?„ê²½???? [4]?…ì‚¬?„ê²½???? [5]?…ì‚¬?„ê²½???? [6]?…ì‚¬?„ê²½???? 
                  // [7]?©ê³„(?? [8]?©ê³„(?? [9]?±ê¸‰ëª…ì¹­ [10]?±ê¸‰ì½”ë“œ [11]ê²½ë ¥ê¸°ì?(?™ë ¥/ê¸°ìˆ ?ê²©)
                  // [12]?ê²©ì¦ì½”??[13]?ê²©ì·¨ë“?¼ì [14]?™ë ¥ê²½ë ¥ê°œì›”??[15]?ê²©ê²½ë ¥ê°œì›”??[16]ê²½ë ¥ê³„ì‚°ê¸°ì???
                  // [17]?…ì‚¬?„í•™?¥ê²½?¥ê°œ?”ìˆ˜ [18]?…ì‚¬?„ìê²©ê²½?¥ê°œ?”ìˆ˜ [19]?…ì‚¬?„í•™?¥ê²½?¥ê°œ?”ìˆ˜ [20]?…ì‚¬?„ìê²©ê²½?¥ê°œ?”ìˆ˜
                  const updatedEmployeeData = {
                    ...employeeData,
                    FST_IN_DT: resultData[1] || employeeData.FST_IN_DT,
                    LAST_END_DT: resultData[2] || employeeData.LAST_END_DT,
                    // ?ê²©ì¦??•ë³´
                    CTQL_CD: resultData[12] || employeeData.CTQL_CD,
                    CTQL_PUR_DT: resultData[13] || employeeData.CTQL_PUR_DT,
                    // ?…ì‚¬??ê²½ë ¥ - ê²½ë ¥êµ¬ë¶„???°ë¼ ?¤ì •
                    ENTR_BEF_CARR: resultData[11] === '1' ? resultData[17] : employeeData.ENTR_BEF_CARR, // ?™ë ¥ê¸°ì?
                    ENTR_BEF_CTQL_CARR: resultData[11] === '2' ? resultData[18] : employeeData.ENTR_BEF_CTQL_CARR, // ê¸°ìˆ ?ê²©ê¸°ì?
                    // ?…ì‚¬??ê²½ë ¥
                    ENTR_AFT_ADBG_CARR: resultData[19] || employeeData.ENTR_AFT_ADBG_CARR,
                    ENTR_AFT_CTQL_CARR: resultData[20] || employeeData.ENTR_AFT_CTQL_CARR,
                    // ?©ê³„ ê²½ë ¥
                    CARR_MCNT: resultData[11] === '1' ? resultData[14] : resultData[15] || employeeData.CARR_MCNT,
                    // ê¸°ìˆ ?±ê¸‰
                    LAST_TCN_GRD: resultData[9] || employeeData.LAST_TCN_GRD,
                    LAST_TCN_GRD_CD: resultData[10] || employeeData.LAST_TCN_GRD_CD,
                    // ê²½ë ¥êµ¬ë¶„
                    CARR_DIV_CD: resultData[11] || employeeData.CARR_DIV_CD,
                    // ê²½ë ¥ê³„ì‚°ê¸°ì???
                    CARR_CALC_STND_DT: resultData[16] || new Date().toISOString().slice(0, 10).replace(/-/g, '')
                  };
                  
                  setEmployeeData(updatedEmployeeData);
                  
                  // AS-IS MXMLê³??™ì¼: ê²½ë ¥ê°œì›”??ê³„ì‚° ?”ë©´?¼ë¡œë¶€???°ì´?°ë? ë°›ì? ê°’ì„ ?€??
                  setTimeout(() => {
                    saveProjectInputData();
                  }, 0);
                }
                
                setShowCarrCalcPopup(false);
                // ?ì—… ?«í ??body scroll ë³µì› ë°????œì‹œ
                document.body.style.overflow = 'auto';
                // ??ì»¨í…Œ?´ë„ˆ ?¤ì‹œ ?œì‹œ
                const tabContainer = document.querySelector('.tab-container');
                if (tabContainer) {
                  (tabContainer as HTMLElement).style.display = 'flex';
                }
              }}
            />
      )}

      {/* ?±ê¸‰?´ë ¥ì¡°íšŒ ?ì—… */}
      {showGradeHistoryPopup && (
        <PSM0030P00
          empNo={employeeData?.EMP_NO}
          onClose={() => {
            setShowGradeHistoryPopup(false);
            // ?ì—… ?«í ??body scroll ë³µì› ë°????œì‹œ
            document.body.style.overflow = 'auto';
            // ??ì»¨í…Œ?´ë„ˆ ?¤ì‹œ ?œì‹œ
            const tabContainer = document.querySelector('.tab-container');
            if (tabContainer) {
              (tabContainer as HTMLElement).style.display = 'flex';
            }
          }}
          ownOutsKb={employeeData?.OWN_OUTS_DIV || ''}
          ownOutsCd={employeeData?.OWN_OUTS_DIV_CD || ''}
          empNm={employeeData?.EMP_NM || ''}
          entrDt={employeeData?.ENTR_DT || ''}
          lastAdbgDiv={employeeData?.LAST_ADBG_DIV_NM || ''}
          ctql={employeeData?.CTQL_CD_NM || ''}
          ctqlPurDt={employeeData?.CTQL_PUR_DT || ''}
          adbgCarrMcnt={employeeData?.ADBG_CARR_MCNT || ''}
          ctqlCarrMcnt={employeeData?.CTQL_CARR_MCNT || ''}
          carrCalcStndDt={employeeData?.CARR_CALC_STND_DT || ''}
          lastTcnGrd={(() => {
            // ê¸°ìˆ ?±ê¸‰ ì½”ë“œ???´ë‹¹?˜ëŠ” text ê°?ì°¾ê¸°
            const tcnGrdItem = commonCodes.tcnGrd.find(code => code.data === employeeData?.LAST_TCN_GRD);
            return tcnGrdItem ? tcnGrdItem.label : employeeData?.LAST_TCN_GRD || '';
          })()}
          lastTcnGrdCd={employeeData?.LAST_TCN_GRD || ''}
          carrDiv={employeeData?.CARR_DIV_CD || ''}
        />
      )}
    </div>
  );
});

export default SearchSection;


