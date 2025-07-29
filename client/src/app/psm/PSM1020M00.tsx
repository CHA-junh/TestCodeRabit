'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import '../common/common.css';
import PSM1050M00 from './PSM1050M00';
import PSM0030P00 from './PSM0030P00';

// ?�???�의
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
  // AS-IS MXML?�서 ?�용?�는 추�? ?�드??
  ENTR_AFT_ADBG_CARR?: string; // ?�사?�학?�경?�개?�수
  ENTR_AFT_CTQL_CARR?: string; // ?�사?�자격경?�개?�수
  ENTR_BEF_ADBG_CARR?: string; // ?�사?�학?�경?�개?�수
}

// PSM1010M0??selectedEmployee ?�??
// interface SelectedEmployee { ... } <= ??부�??�체 ??��

interface CommonCode {
  data: string;
  label: string;
}

/**
 * PSM1020M00 컴포?�트 Props ?�터?�이??
 * 
 * ?�원 ?�보 ?�록/?�정 ?�면??props ?�의
 * 
 * @property {EmployeeData | null} selectedEmployee - ?�택???�원 ?�보 (PSM1010M00?�서 ?�달)
 * @property {Object} [fieldEnableState] - ?�드 ?�성???�태 (?�규/?�정 모드???�라 ?�름)
 * @property {Function} [onSearchSuccess] - 검???�공 ???�출??콜백 (?�위 ?�면 ?�조??
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
  onSearchSuccess?: () => void; // AS-IS MXML??parentDocument.prf_PsmSearch?� ?�일
}

/**
 * PSM1020M00 컴포?�트 Ref ?�터?�이??
 * 
 * 부�?컴포?�트?�서 ?�출?????�는 메서?�들???�의
 * 
 * @property {Function} handleSearch - ?�원 ?�보 검???�행
 * @property {Function} initialize - 컴포?�트 초기??(?�규 모드�??�정)
 */
export interface PSM1020M00Ref {
  handleSearch: () => Promise<void>;
  initialize: () => void;
}

const SearchSection = forwardRef<PSM1020M00Ref, PSM1020M00Props>(({ selectedEmployee, fieldEnableState, onSearchSuccess }, ref) => {
  const { showToast, showConfirm } = useToast();
  const { user } = useAuth();
  // 검??조건 state
  const [searchConditions, setSearchConditions] = useState({
    ownOutsDiv: '1', // ?�사/?�주 구분 (1:?�사, 2:?�주)
    empNm: '', // ?�원?�명
    hqDivCd: 'ALL', // 본�?코드
    deptDivCd: 'ALL', // 부?�코??
    dutyCd: 'ALL', // 직책코드
    retirYn: 'Y' // ?�사?�포?�유�?
  });

  // ?�원 ?�이??state - 초기값으�??�사 ?�정
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>({
    OWN_OUTS_DIV_CD: '1',
    OWN_OUTS_DIV: '?�사',
    ENTR_CD: '',
    CARR_DIV_CD: '1',
    WKG_ST_DIV_CD: '1',
    WKG_ST_DIV: '?�직�?,
    KOSA_REG_YN: 'N',
    HQ_DIV_CD: '', // 본�? 코드 초기�?추�?
    DEPT_DIV_CD: '', // 부??코드 초기�?추�?
    DUTY_CD: '', // 직책 코드 초기�?추�?
    EMP_NO: '', // ?�원번호 초기�?추�?
    EMP_NM: '', // ?�원�?초기�?추�?
    EMP_ENG_NM: '', // ?�문�?초기�?추�?
    RES_REG_NO: '', // 주�??�록번호 초기�?추�?
    BIR_YR_MN_DT: '', // ?�년?�일 초기�?추�?
    SEX_DIV_CD: '', // ?�별 초기�?추�?
    NTLT_DIV_CD: '', // �?�� 초기�?추�?
    ENTR_DT: '', // ?�사?�자 초기�?추�?
    RETIR_DT: '', // ?�사?�자 초기�?추�?
    EMAIL_ADDR: '', // ?�메??초기�?추�?
    MOB_PHN_NO: '', // ?��??�화 초기�?추�?
    HOME_TEL: '', // ?�택?�화 초기�?추�?
    HOME_ZIP_NO: '', // ?�편번호 초기�?추�?
    HOME_ADDR: '', // 주소 초기�?추�?
    HOME_DET_ADDR: '', // ?�세주소 초기�?추�?
    LAST_IN_DT: '', // 최종?�입?�자 초기�?추�?
    LAST_END_DT: '', // 최종철수?�자 초기�?추�?
    LAST_SCHL: '', // ?�교 초기�?추�?
    MAJR: '', // ?�공 초기�?추�?
    LAST_GRAD_DT: '', // 졸업?�자 초기�?추�?
    CTQL_CD: '', // ?�격�?초기�?추�?
    CTQL_PUR_DT: '', // ?�격취득?�자 초기�?추�?
    CARR_MCNT: '0', // 경력개월??초기�?추�?
    FST_IN_DT: '', // 최초?�입?�자 초기�?추�?
    ENTR_BEF_CARR: '0', // ?�사?�경??초기�?추�?
    ENTR_BEF_CTQL_CARR: '0', // ?�사?�자격경??초기�?추�?
    ADBG_CARR_MCNT: '0', // ?�력경력개월??초기�?추�?
    CTQL_CARR_MCNT: '0', // ?�격경력개월??초기�?추�?
    CARR_CALC_STND_DT: '', // 경력계산기�???초기�?추�?
    LAST_ADBG_DIV: '', // 최종?�력 초기�?추�?
    LAST_TCN_GRD: '', // 기술?�급 초기�?추�?
    RMK: '', // 비고 초기�?추�?
    HDOFC_YEAR: '0', // ?�직?�수(?? 초기�?추�?
    HDOFC_MONTH: '0', // ?�직?�수(?? 초기�?추�?
    ENTR_AFT_ADBG_CARR: '0', // ?�사?�학?�경??초기�?추�?
    ENTR_AFT_CTQL_CARR: '0' // ?�사?�자격경??초기�?추�?
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFlag, setNewFlag] = useState<boolean>(false); // AS-IS MXML??newFlag?� ?�일 - 초기값을 false�??�정
  const [showCarrCalcPopup, setShowCarrCalcPopup] = useState<boolean>(false); // 경력계산 ?�업 ?�시 ?��?
  const [showGradeHistoryPopup, setShowGradeHistoryPopup] = useState<boolean>(false); // ?�급?�력조회 ?�업 ?�시 ?��?

  // AS-IS MXML�??�일???�???�이??변?�들
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

  // 공통코드 state
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
    ownCompanyList: CommonCode[]; // ?�사 ?�체 목록
    entrList: CommonCode[]; // ?�주 ?�체 목록
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

  // ?��??�서 ?�출?????�는 ?�수?�을 ref�??�출
  useImperativeHandle(ref, () => ({
    handleSearch: async () => {
      await handleSearch();
    },
    initialize: () => {
      // PSM1020M00 초기??
      setNewFlag(false);
      setEmployeeData({
        EMP_NO: '',
        OWN_OUTS_DIV_CD: '1',
        OWN_OUTS_DIV: '?�사',
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

  // selectedEmployee prop??변경될 ??employeeData�??�데?�트
  useEffect(() => {
    if (selectedEmployee) {
      // PSM1020M00: selectedEmployee 변경됨 - ?�택???�원 ?�보�?employeeData ?�정
      
      // ?�원 ?�택 ???�규 모드 ?�제
      setNewFlag(false);
      
      // selectedEmployee ?�이?��? employeeData ?�식?�로 변??
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
        // AS-IS MXML?�서 ?�용?�는 ?�드??
        ENTR_BEF_CARR: selectedEmployee.ENTR_BEF_CARR,
        ENTR_BEF_CTQL_CARR: selectedEmployee.ENTR_BEF_CTQL_CARR,
        ADBG_CARR_MCNT: selectedEmployee.ADBG_CARR_MCNT,
        CTQL_CARR_MCNT: selectedEmployee.CTQL_CARR_MCNT,
        CARR_CALC_STND_DT: selectedEmployee.CARR_CALC_STND_DT,
        // 기본�??��?
        CARR_DIV_CD: selectedEmployee.CARR_DIV_CD || '1',
        KOSA_REG_YN: selectedEmployee.KOSA_REG_YN || 'N',
        HDOFC_YEAR: selectedEmployee.HDOFC_YEAR,
        HDOFC_MONTH: selectedEmployee.HDOFC_MONTH,
        ENTR_AFT_ADBG_CARR: selectedEmployee.ENTR_AFT_ADBG_CARR,
        ENTR_AFT_CTQL_CARR: selectedEmployee.ENTR_AFT_CTQL_CARR,
        // 최종?�력 ?�보 추�?
        LAST_ADBG_DIV: selectedEmployee.LAST_ADBG_DIV,
        LAST_ADBG_DIV_NM: selectedEmployee.LAST_ADBG_DIV_NM
      };
      
      setEmployeeData(convertedData);
      
      // ?�주 ?�원??경우 ?�주 ?�체 목록 로드
      if (selectedEmployee.OWN_OUTS_DIV_CD === '2') {
        loadEntrList();
      }
    }
  }, [selectedEmployee]);

  // 초기 ?�이??로드
  useEffect(() => {
    // 초기 ?�이??로드 ?�작 - 공통코드, ?�사/?�주 ?�체 목록 로드
    const initializeData = async () => {
      await loadCommonCodes();
      await loadOwnCompanyList(); // ?�사 ?�체 목록 로드
      await loadEntrList(); // ?�주 ?�체 목록 로드
    };
    initializeData();
    
    // 카카??주소 검???�크립트 로드
    if (typeof window !== 'undefined' && !window.daum) {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // AS-IS COM_03_0101_S ?�로?��? ?�출 방식?�로 공통코드 로드
  const loadCommonCodes = async () => {
    try {
      const codeTypes = [
        { key: 'ownOutsDiv', type: '103' }, // ?�사/?�주구분
        { key: 'hqDiv', type: '113' }, // 본�?구분
        { key: 'duty', type: '116' }, // 직책
        { key: 'sexDiv', type: '011' }, // ?�별구분
        { key: 'ntltDiv', type: '012' }, // �?��구분
        { key: 'lastAdbgDiv', type: '014' }, // 최종?�력구분
        { key: 'ctqlCd', type: '013' }, // ?�격�?
        { key: 'wkgStDiv', type: '017' }, // 근무?�태구분
        { key: 'tcnGrd', type: '104' } // 기술?�급
      ];

      const newCommonCodes: any = { ...commonCodes };

      for (const { key, type } of codeTypes) {
        try {
          // AS-IS COM_03_0101_S ?�로?��? ?�출 방식
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
            
            // API ?�답??{data: codeId, label: codeNm} ?�태�?변??
            const transformedData = data.map((item: any) => ({
              data: item.codeId || '',
              label: item.codeNm || ''
            }));
            
            newCommonCodes[key] = transformedData;
          }
        } catch (error) {
          console.error(`공통코드 로드 ?�패 (${type}):`, error);
        }
      }

      setCommonCodes(newCommonCodes);
    } catch (error) {
      console.error('공통코드 로드 �??�류:', error);
    }
  };

  // AS-IS COM_03_0201_S ?�로?��? ?�출 방식?�로 본�?�?부??로드
  const loadDeptByHq = async (hqDivCd: string) => {
    try {
      // 본�?�?부??로드 ?�작
      
      // AS-IS COM_03_0201_S ?�로?��? ?�출 방식
      // 조회?�형=2, ?�체?�함?�무=N, 본�?코드=hqDivCd
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
          
          // API ?�답??배열 ?�태??경우 객체 ?�태�?변??
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
        
        // 부??목록??로드?�면 기존 employeeData??DEPT_DIV_CD �??��?
        if (transformedData && transformedData.length > 0) {
          // employeeData??DEPT_DIV_CD가 ?�으�?�?값을 ?��?, ?�으�?�?번째 ??�� ?�택
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
      console.error('부??로드 �??�류:', error);
    }
  };

  // AS-IS COM_03_0101_S ?�로?��? ?�출 방식?�로 ?�사 ?�체 목록 로드
  const loadOwnCompanyList = async () => {
    try {
      // ?�사 ?�체 목록 로드 ?�작
      const response = await fetch('/api/common/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          largeCategoryCode: '110' // ?�사 ?�체 ?�분류 코드
        })
      });
      
              if (response.ok) {
          const result = await response.json();
          const data = result.data || [];
          
          // API ?�답??{data: codeId, label: codeNm} ?�태�?변??
          const transformedData = data.map((item: any) => ({
            data: item.codeId || '',
            label: item.codeNm || ''
          }));
        
        setCommonCodes(prev => ({
          ...prev,
          ownCompanyList: transformedData
        }));
        
        // ?�사 ?�체 목록??로드?�고 �?번째 ??��???�으�??�동 ?�택
        if (transformedData && transformedData.length > 0 && employeeData?.OWN_OUTS_DIV_CD === '1') {
          setEmployeeData(prev => ({
            ...prev!,
            ENTR_CD: transformedData[0].data
          }));
        }
      }
    } catch (error) {
      console.error('?�사 ?�체 목록 로드 �??�류:', error);
    }
  };

  // AS-IS COM_03_0101_S ?�로?��? ?�출 방식?�로 ?�주 ?�체 목록 로드
  const loadEntrList = async () => {
    try {
      // ?�주 ?�체 목록 로드 ?�작
            const response = await fetch('/api/common/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          largeCategoryCode: '111' // ?�주 ?�체 ?�분류 코드
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        
        // API ?�답??{data: codeId, label: codeNm} ?�태�?변??
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
      console.error('?�주 ?�체 목록 로드 �??�류:', error);
    }
  };

  // 검??조건 변�??�들??
  const handleSearchChange = (field: string, value: string) => {
    setSearchConditions(prev => ({
      ...prev,
      [field]: value
    }));

    // 본�? 변�???부??리스???�데?�트 (AS-IS onCbHqDivChange 로직)
    if (field === 'hqDivCd') {
      handleHqDivChange(value);
    }
    
    // ?�사/?�주 구분 변�????�벤??(AS-IS onOwnOutsDivChange 로직)
    if (field === 'ownOutsDiv') {
      handleOwnOutsDivChange(value);
    }
  };

  // AS-IS MXML??onOwnOutsDivChange ?�수?� ?�일??로직
  const handleOwnOutsDivChange = (value: string) => {
    // ?�사/?�주 구분 변�?처리
    
    if (value === '1') {
      // AS-IS MXML�??�일: ?�사??경우
      // cbCrpnNm.setLargeCode('110','') - ?�사 ?�체 목록 로드
      if (commonCodes.ownCompanyList.length === 0) {
        loadOwnCompanyList();
      }
      
      // AS-IS MXML�??�일: txtEmpNo.enabled = true - ?�원번호 ?�성??
      
      setEmployeeData(prev => ({
        ...prev!,
        OWN_OUTS_DIV_CD: '1',
        OWN_OUTS_DIV: '?�사',
        ENTR_CD: '' // ?�사 ?�체 코드 초기??
      }));
    } else if (value === '2') {
      // AS-IS MXML�??�일: ?�주??경우
      // cbCrpnNm.setLargeCode('111','') - ?�주 ?�체 목록 로드
      if (commonCodes.entrList.length === 0) {
        loadEntrList();
      }
      
      // AS-IS MXML�??�일: txtEmpNo.enabled = false - ?�주 ?�번?� ?�동채번
      
      setEmployeeData(prev => ({
        ...prev!,
        OWN_OUTS_DIV_CD: '2',
        OWN_OUTS_DIV: '?�주',
        ENTR_CD: '' // ?�주 ?�체 코드 초기??
      }));
    }
    
    // AS-IS MXML�??�일: ?�규 모드?�서 ?�주 ?�택 ??추�? 처리
    if (newFlag === true && value === '2') {
      // AS-IS: setEmpNoMaxCnt() ?�출 (?�재??주석 처리??
    }
  };

  // 본�? 콤보 변�??�벤???�들??(AS-IS onCbHqDivChange?� ?�일)
  const handleHqDivChange = (value: string) => {
    // 본�? 콤보 변�??�벤??처리
    
    // AS-IS?� ?�일?�게 부??콤보 초기??
    setCommonCodes(prev => ({
      ...prev,
      deptDiv: []
    }));
    
    // ?�원 ?�이?�에??부??코드 초기??
    setEmployeeData(prev => ({
      ...prev!,
      DEPT_DIV_CD: ''
    }));
    
    // 본�?가 ?�택??경우?�만 부??목록 로드
    if (value && value !== '') {
      loadDeptByHq(value);
    }
  };

  // ?�원 조회 ?�수
  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const empNo = employeeData?.EMP_NO;
      
      if (!empNo) {
        setError('?�원번호�??�력??주십?�요.');
        showToast('?�원번호�??�력??주십?�요.', 'warning');
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
            OWN_OUTS_DIV: rec.OWN_OUTS_DIV_CD === '1' ? '?�사' : '?�주',
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
          
          // 본�?가 ?�정?�면 ?�당 본�???부??목록 로드
          if (rec.HQ_DIV_CD && rec.HQ_DIV_CD !== '') {
            loadDeptByHq(rec.HQ_DIV_CD);
          }
          
          if (rec.OWN_OUTS_DIV_CD === '2') {
            loadEntrList();
          }
          
          // AS-IS MXML�??�일: ?�원 ?�이??로드 ???�재 ?�이?��? saveData???�??
          setTimeout(() => {
            saveProjectInputData();
          }, 0);
          
        } else {
          setEmployeeData(null);
          const errorMessage = result.message || '?�당?�는 ?�이?��? ?�습?�다.';
          setError(errorMessage);
          showToast(errorMessage, 'warning');
        }
      } else {
        throw new Error('?�원 조회???�패?�습?�다.');
      }
    } catch (error) {
      console.error('?�원 조회 �??�류:', error);
      const errorMessage = error instanceof Error ? error.message : '조회 �??�류가 발생?�습?�다.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };



  // AS-IS MXML??fnInputValidationChk ?�수?� ?�일??로직
  const validateInput = (checkType: string): boolean => {
    if (checkType === "Registe" || checkType === "CarrCalc") {
      if (!employeeData?.OWN_OUTS_DIV_CD) {
        showToast("?�사 ?�는 ?�주 구분???�택??주십?�요.", "warning");
        // ?�사/?�주 구분 select???�커??
        const ownOutsDivSelect = document.querySelector('select[value="' + (employeeData?.OWN_OUTS_DIV_CD || '') + '"]') as HTMLSelectElement;
        if (ownOutsDivSelect) ownOutsDivSelect.focus();
        return false;
      }

      if (employeeData.OWN_OUTS_DIV_CD === "1" && !employeeData.ENTR_DT) {
        showToast("?�사?�자�??�력??주십?�요", "warning");
        // ?�사?�자 input???�커??
        setTimeout(() => {
          const entrDtInput = document.querySelector('input[data-field="entrDt"]') as HTMLInputElement;
          if (entrDtInput) {
            entrDtInput.focus();
          }
        }, 100);
        return false;
      }

      if (!employeeData?.HQ_DIV_CD || employeeData.HQ_DIV_CD.trim() === '') {
        showToast("본�?�??�택??주십?�요.", "warning");
        // 본�? select???�커??
        setTimeout(() => {
          const hqDivSelect = document.querySelector('select[data-field="hqDiv"]') as HTMLSelectElement;
          if (hqDivSelect) {
            hqDivSelect.focus();
          }
        }, 100);
        return false;
      }
      
      if (!employeeData?.LAST_ADBG_DIV || employeeData.LAST_ADBG_DIV === '') {
        showToast("최종?�력???�택??주십?�요", "warning");
        // 최종?�력 select???�커??
        setTimeout(() => {
          const lastAdbgDivSelect = document.querySelector('select[data-field="lastAdbgDiv"]') as HTMLSelectElement;
          if (lastAdbgDivSelect) {
            lastAdbgDivSelect.focus();
          }
        }, 100);
        return false;
      }
      
      if (!employeeData?.FST_IN_DT) {
        showToast("최초?�입?�자�??�력??주십?�요", "warning");
        // 최초?�입?�자 input???�커??
        setTimeout(() => {
          const fstInDtInput = document.querySelector('input[data-field="fstInDt"]') as HTMLInputElement;
          if (fstInDtInput) {
            fstInDtInput.focus();
          }
        }, 100);
        return false;
      } 
        
      if (employeeData.OWN_OUTS_DIV_CD === "2" && !employeeData.LAST_END_DT) {
        showToast("최종철수?�자�??�력??주십?�요", "warning");
        // 최종철수?�자 input???�커??
        setTimeout(() => {
          const lastEndDtInput = document.querySelector('input[data-field="lastEndDt"]') as HTMLInputElement;
          if (lastEndDtInput) {
            lastEndDtInput.focus();
          }
        }, 100);
        return false;
      } 

      if (employeeData?.CTQL_CD && employeeData?.CTQL_CD !== "null" && !employeeData?.CTQL_PUR_DT) {
        showToast("?�격취득?�자�??�력??주십?�요", "warning");
        // ?�격취득?�자 input???�커??
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
        showToast("?�원번호�??�력??주십?�요", "warning");
        // ?�원번호 input???�커??
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
        showToast("?�명???�력??주십?�요", "warning");
        // ?�명 input???�커??- data-field ?�성?�로 ?�확??찾기
        setTimeout(() => {
          const empNmInput = document.querySelector('input[data-field="empNm"]') as HTMLInputElement;
          if (empNmInput) {
            empNmInput.focus();
            empNmInput.select(); // ?�스???�택??추�?
          }
        }, 100);
        return false;
      }

      if (employeeData?.RETIR_DT && employeeData?.WKG_ST_DIV_CD !== "3") {
        showToast("근무?�태�??�사�??�택??주십?�요", "warning");
        // 근무?�태 select???�커??
        setTimeout(() => {
          const wkgStDivSelect = document.querySelector('select[data-field="wkgStDiv"]') as HTMLSelectElement;
          if (wkgStDivSelect) {
            wkgStDivSelect.focus();
          }
        }, 100);
        return false;
      }

      // 근무?�태가 ?�직??경우?�만 체크
      if (Number(employeeData?.CARR_MCNT || 0) === 0 && employeeData?.WKG_ST_DIV_CD === "1") {
        showToast("경력개월?��? 계산??주십?�요.", "warning");
        // 경력계산 버튼???�커??
        setTimeout(() => {
          const carrCalcBtn = document.querySelector('button[data-field="carrCalcBtn"]') as HTMLButtonElement;
          if (carrCalcBtn) {
            carrCalcBtn.focus();
          }
        }, 100);
        return false;
      }
      
      if (!employeeData?.BIR_YR_MN_DT) {
        showToast("?�년?�일???�력??주십?�요.", "warning");
        // ?�년?�일 input???�커??
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

  // AS-IS MXML??OnClick_RegNewPsm ?�수?� ?�일???�원 ?�보 ?�??로직
  const handleSave = async () => {
    if (!employeeData) return;

    // AS-IS MXML�??�일??validation 체크
    if (!validateInput("Registe")) {
      return;
    }

    // AS-IS MXML�??�일: ?�로?�트?�보 ?�이??변경여부 Check
    if (isCheckProjectInputData() === true || newFlag === true) {
      showConfirm({
        message: newFlag ? '?�로???�원 ?�보�??�록?�시겠습?�까?' : '?�원 ?�보�??�정?�시겠습?�까?',
        type: 'info',
        onConfirm: async () => {
          await fnPsmBasicInfoUpdate();
        },
        onCancel: () => {
          // ?�원 ?�보 ?�??취소
        }
      });
    } else {
      // AS-IS MXML�??�일: 경력개월?�계?�을 ?�시 ?????�?�을 ?�도�??�다.
      const msg = setCarrMonthsComfirmMessage();
      showConfirm({
        message: msg,
        type: 'warning',
        onConfirm: () => {
          // 경력계산 ?�업 ?�출
          if (validateInput("CarrCalc")) {
            setShowCarrCalcPopup(true);
          }
        },
        onCancel: () => {
          // 경력 계산 취소
        }
      });
    }
  };

  // AS-IS MXML??setCarrMonthsComfirmMessage ?�수?� ?�일??로직
  const setCarrMonthsComfirmMessage = (): string => {
    let strMsg = '';

    // "null" 문자?�을 �?문자?�로 치환?�는 ?�퍼 ?�수
    const normalizeValue = (value: string | undefined): string => {
      if (!value || value === 'null') return '';
      return value;
    };

    if (normalizeValue(saveData.ctqlCd) !== normalizeValue(employeeData?.CTQL_CD)) {
      strMsg = '?�격�??�용??변경되?�습?�다. ';
    } else if (normalizeValue(saveData.ctqlPurDt) !== normalizeValue(employeeData?.CTQL_PUR_DT)) {
      strMsg = '?�격증취?�일?��? 변경되?�습?�다. ';
    } else if (normalizeValue(saveData.fstInDt) !== normalizeValue(employeeData?.FST_IN_DT)) {
      strMsg = '최초?�입?�자가 변경되?�습?�다. ';
    } else if (normalizeValue(saveData.lastEndDt) !== normalizeValue(employeeData?.LAST_END_DT)) {
      strMsg = '최종철수?�자가 변경되?�습?�다. ';
    } else {
      strMsg = '';
    }
    
    strMsg += '경력개월??계산???�시 ????[?�?????�십?�요. \n경력개월?�계???�면???�업?�시겠습?�까?';
    
    return strMsg;
  };

  // AS-IS MXML??fnPsmBasicInfoUpdate ?�수?� ?�일??로직
  const fnPsmBasicInfoUpdate = async () => {
    if (!employeeData) return;

    // AS-IS MXML�??�일: ?�???�에 ?�재 ?�이?��? saveData???�??
    saveProjectInputData();

    setIsLoading(true);
    setError(null);

    try {
      // ?�송???�이??로깅
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
            
      // AS-IS MXML�??�일???�로?��? ?�출 방식
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
          showToast('?�?�되?�습?�다.', 'info');
          
          // AS-IS MXML�??�일: ?�?????�위 ?�면 ?�조??(PSM1010M00)
          if (onSearchSuccess) {
            onSearchSuccess();
          }
        } else {
          setError(result.message);
          showToast(result.message, 'error');
        }
      } else {
        throw new Error('?�?�에 ?�패?�습?�다.');
      }
    } catch (error) {
      console.error('?�??�??�류:', error);
      const errorMessage = error instanceof Error ? error.message : '?�??�??�류가 발생?�습?�다.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // AS-IS MXML??setParameter ?�수?� ?�일??로직
  const setParameter = (tmpStr: string, opt: number): string => {
    if (!tmpStr || tmpStr === '') {
      return '';
    } else {
      // 공백 ?�거
      if (opt === 1) {
        tmpStr = tmpStr.replace(/ /g, '');
      }
      // ?�짜 "/" ?�거
      else if (opt === 2) {
        tmpStr = tmpStr.replace(/ /g, '');
        tmpStr = tmpStr.replace(/\//g, '');
      }
      // 주�??�록번호, ?�편번호 '-' ?�거
      else if (opt === 3) {
        tmpStr = tmpStr.replace(/ /g, '');
        tmpStr = tmpStr.replace(/-/g, '');
      }
    }
    return tmpStr;
  };

  // AS-IS MXML�??�일???�라미터 빌드 로직
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
    objTemp += '|'; // 최초?�입?�자 (별도 처리)
    objTemp += setParameter(employeeData.LAST_END_DT || '', 2) + '|';
    objTemp += '|'; // ?�입?�수
    objTemp += setParameter(employeeData.LAST_ADBG_DIV || '', 1) + '|';
    objTemp += setParameter(employeeData.LAST_SCHL || '', 1) + '|';
    objTemp += setParameter(employeeData.MAJR || '', 1) + '|';
    objTemp += setParameter(employeeData.LAST_GRAD_DT || '', 2) + '|';
    objTemp += setParameter(employeeData.CTQL_CD || '', 1) + '|';
    objTemp += setParameter(employeeData.CTQL_PUR_DT || '', 2) + '|';
    objTemp += getCarrMCnt(employeeData.CARR_MCNT || '0', '0') + '|';
    objTemp += setParameter(employeeData.WKG_ST_DIV_CD || '', 1) + '|';
    objTemp += 'system|'; // 로그?�사?�자ID
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

  // ?�원 ?�보 ??��
  // AS-IS MXML??OnClick_DelEmp() ?�수?� ?�일????�� 로직
  const handleDelete = async () => {
    // AS-IS?� ?�일: ?�원번호 체크
    if (!employeeData?.EMP_NO) {
      showToast('??��???�원???�택??주십?�요.', 'warning');
      return;
    }

    // AS-IS?� ?�일: ?�인 ?�이?�로�?
    showConfirm({
      message: '?�말 ??��?�시겠습?�까?',
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
              // AS-IS?� ?�일: ?�공 메시지 ?�시
              showToast('??��?�었?�니??', 'info');
              
              // AS-IS?� ?�일: ?�원번호 ?�데?�트 (?�공 ?�답?�서 받�? ?�원번호)
              if (result.data && result.data.empNo) {
                setEmployeeData(prev => ({
                  ...prev,
                  EMP_NO: result.data.empNo
                }));
              }
              
              // AS-IS?� ?�일: ?�면 초기??
              handleNew();
              
              // AS-IS?� ?�일: ?�위 ?�면 ?�조??(parentDocument.prf_PsmSearch)
              if (onSearchSuccess) {
                onSearchSuccess();
              }
            } else {
              setError(result.message || '??��???�패?�습?�다.');
              showToast(result.message || '??��???�패?�습?�다.', 'error');
            }
          } else {
            throw new Error('??��???�패?�습?�다.');
          }
        } catch (error) {
          console.error('?�원 ??�� �??�류:', error);
          const errorMessage = error instanceof Error ? error.message : '??�� �??�류가 발생?�습?�다.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => {
        // ?�원 ??�� 취소
      }
    });
  };

  // AS-IS MXML??initImpInfo() ?�수?� ?�일???�규 ?�록 로직
  const handleNew = () => {
    const today = new Date();
    const todayStr = today.getFullYear().toString() + 
                    String(today.getMonth() + 1).padStart(2, '0') + 
                    String(today.getDate()).padStart(2, '0');

    // AS-IS MXML�??�일??초기??로직
    setEmployeeData({
      // 기본 구분 ?�정
      OWN_OUTS_DIV_CD: '1',
      OWN_OUTS_DIV: '?�사',
      ENTR_CD: '',
      CARR_DIV_CD: '1',
      WKG_ST_DIV_CD: '1',
      WKG_ST_DIV: '?�직�?,
      KOSA_REG_YN: 'N',
      
      // ?�원 ?�보 초기??
      EMP_NO: '',
      EMP_NM: '',
      EMP_ENG_NM: '',
      RES_REG_NO: '',
      BIR_YR_MN_DT: '',
      SEX_DIV_CD: '1',
      NTLT_DIV_CD: '1',
      ENTR_DT: '',
      RETIR_DT: '',
      
      // 조직 ?�보 초기??(AS-IS?� ?�일??기본�?
      HQ_DIV_CD: '',
      DEPT_DIV_CD: '',
      DUTY_CD: '9', // AS-IS: cbDuty.setValue("9")
      
      // ?�력 ?�보 초기??
      LAST_ADBG_DIV: '',
      LAST_SCHL: '',
      MAJR: '',
      LAST_GRAD_DT: '',
      
      // ?�락�??�보 초기??
      MOB_PHN_NO: '',
      HOME_TEL: '',
      HOME_ZIP_NO: '',
      HOME_ADDR: '',
      HOME_DET_ADDR: '',
      EMAIL_ADDR: '',
      
      // ?�격�??�보 초기??
      CTQL_CD: '',
      CTQL_PUR_DT: '',
      
      // 경력 ?�보 초기??(AS-IS?� ?�일??기본�?
      CARR_MCNT: '0',
      ENTR_BEF_CARR: '0',
      ENTR_BEF_CTQL_CARR: '0',
      ADBG_CARR_MCNT: '0',
      CTQL_CARR_MCNT: '0',
      
      // ?�입 ?�보 초기??(AS-IS: 최초?�입?�자 = ?�재?�자)
      FST_IN_DT: todayStr,
      LAST_END_DT: '',
      
      // ?�직?�수 초기??(AS-IS?� ?�일??기본�?
      HDOFC_YEAR: '0',
      HDOFC_MONTH: '0',
      
      // 기�? ?�보 초기??
      LAST_TCN_GRD: '',
      KOSA_RNW_DT: '',
      CARR_CALC_STND_DT: '',
      RMK: '',
      
      // ?�사??경력 초기??
      ENTR_AFT_ADBG_CARR: '0',
      ENTR_AFT_CTQL_CARR: '0'
    });

    // AS-IS MXML�??�일: ?�규 ?�래�??�정 �?메시지 ?�시
    setNewFlag(true);
    
    // AS-IS MXML??경력개월??계산 메시지?� ?�일
            // 경력개월?��? 기술?�급?� [경력개월?�계?? ?�면?�서 계산?�고 ?�인처리�??�해???�력??가?�합?�다. [경력계산] 버튼???�릭?�세??
    
    // AS-IS MXML�??�일: 경력계산 버튼 ?�시 (newFlag가 true???�만 ?�시)
    // ?�는 UI?�서 newFlag ?�태???�라 경력계산 버튼??visible???�어?�는???�용??
    
    // AS-IS MXML�??�일: ?�규 ?�록 ??모든 ?�드 ?�성??
    // AS-IS: txtEmpNo.enabled = true; cbOwnOutsDiv.enabled = true; cbCrpnNm.enabled = true;
    // AS-IS: cbHqDiv.enabled = true; cbDeptDiv.enabled = true; cbDuty.enabled = true;
            // ?�규 ?�록: 모든 ?�드가 ?�성?�되?�습?�다.
    
    // AS-IS MXML�??�일: ?�규 ?�록 ???�재 ?�이?��? saveData???�??
    setTimeout(() => {
      saveProjectInputData();
    }, 0);
  };

  // AS-IS MXML??getCarrMCnt ?�수?� ?�일??로직
  const getCarrMCnt = (strYCnt: string, strMCnt: string): string => {
    if (strYCnt === "" && strMCnt === "") return "";
    
    const nYcnt = parseInt(strYCnt) || 0;
    const nMCnt = parseInt(strMCnt) || 0;
    
    return String((nYcnt * 12) + nMCnt);
  };



  // ?�원 ?�보 변�??�들??
  const handleEmployeeChange = (field: string, value: string) => {
    if (!employeeData) return;

    setEmployeeData(prev => {
      const newData = {
        ...prev!,
        [field]: value
      };
      return newData;
    });

    // 경력구분 변�???기술?�급 ?�동 계산 (AS-IS MXML??onChangeCarrDiv 로직)
    if (field === 'CARR_DIV_CD') {
      handleCarrDivChange(value);
    }
  };

  // AS-IS MXML??onChangeCarrDiv 로직�??�일
  const handleCarrDivChange = (carrDivCd: string) => {
    if (!employeeData) return;
    
    // 기술?�급 ?�동 계산
    const newTcnGrd = getTcnGrd(carrDivCd);
    setEmployeeData(prev => ({
      ...prev!,
      LAST_TCN_GRD: newTcnGrd
    }));
  };

  // 카카??주소 검???�업 ?�출
  const handleAddressSearch = () => {
    // 카카??주소 검???�업 ?�크립트가 로드?�어 ?�는지 ?�인
    if (typeof window.daum !== 'undefined' && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data: any) {
          // ?�업?�서 검?�결�???��???�릭?�을???�행??코드�??�성?�는 부분입?�다.
          // ?�제�?참고?�여 각주�??�성?�거?? ?�래 ?�제�??�정?�여 ?�용?�시�??�니??
          
          // ?�로�?주소???�출 규칙???�라 주소�??�시?�니??
          // ?�려?�는 ?�이?��? ?�로명주?�일 경우 linkRoadname??공백?????�습?�다.
          let roadAddr = data.roadAddress; // ?�로�?주소 변??
          let jibunAddr = data.jibunAddress; // 지�?주소 변??
          
          // ?�편번호?� 주소 ?�보�??�당 ?�드???�는??
          setEmployeeData(prev => ({
            ...prev!,
            HOME_ZIP_NO: data.zonecode,
            HOME_ADDR: roadAddr || jibunAddr
          }));
          
          // 참고??�� 문자?�이 ?�을 경우 ?�당 ?�드???�는??
          if (data.bname !== '' && /[??�?가]$/g.test(data.bname)) {
            // ?�세주소 ?�드??건물명을 추�?
            setEmployeeData(prev => ({
              ...prev!,
              HOME_DET_ADDR: data.buildingName || ''
            }));
          }
        }
      }).open();
    } else {
      // 카카??주소 검???�크립트가 로드?��? ?��? 경우
      showToast('주소 검???�비?��? 불러?�는 중입?�다. ?�시 ???�시 ?�도?�주?�요.', 'warning');
      
      // ?�크립트 ?�적 로드
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        // ?�크립트 로드 ?�료 ???�시 ?�출
        setTimeout(handleAddressSearch, 100);
      };
      document.head.appendChild(script);
    }
  };

  // AS-IS MXML??fnSaveProjecInputData ?�수?� ?�일??로직
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

  // AS-IS MXML??isCheckProjectInputData ?�수?� ?�일??로직
  const isCheckProjectInputData = (): boolean => {
    if (!employeeData) return false;
    
    // AS-IS?� ?�일???�짜 ?�맷???�수
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return '';
      return dateStr.replace(/\//g, ''); // ?�래???�거
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
        return false; // ?�주??경우?�만 최종철수?�자�?Check?�다.
      }
    }
    return true;
  };

  // AS-IS MXML??getTcnGrd ?�수?� ?�일??로직
  const getTcnGrd = (carrDivCd: string): string => {
    if (!employeeData) return "";
    
    const carrMonths = Number(employeeData.CARR_MCNT || 0);
    const lastAdbgDiv = employeeData.LAST_ADBG_DIV || "";
    const ctqlCd = employeeData.CTQL_CD === 'null' ? '' : (employeeData.CTQL_CD || "");

    if (carrDivCd === "1") {
      // ?�력 기�?
      if (lastAdbgDiv === "04") { // ?�문?�사
        if (carrMonths < 108) return "4";
        else if (carrMonths < 108 + 36) return "3";
        else if (carrMonths < 108 + 36 + 36) return "2";
        else return "1";
      }
      else if (lastAdbgDiv === "03") { // ?�사
        if (carrMonths < 72) return "4";
        else if (carrMonths < 72 + 36) return "3";
        else if (carrMonths < 72 + 36 + 36) return "2";
        else return "1";
      }
      else if (lastAdbgDiv === "02") { // ?�사
        if (carrMonths < 36) return "4";
        else if (carrMonths < 36 + 36) return "3";
        else if (carrMonths < 36 + 36 + 36) return "2";
        else return "1";
      }
      else if (lastAdbgDiv === "01") { // 박사
        if (carrMonths < 36) return "2";
        else return "1";
      }
      else if (lastAdbgDiv === "05") { // 고졸
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
      // 기술?�격 기�?
      if (ctqlCd === "01") { // 기사
        if (carrMonths < 36) return "4";
        else if (carrMonths < 36 + 36) return "3";
        else if (carrMonths < 36 + 36 + 36) return "2";
        else return "1";
      }
      else if (ctqlCd === "02") { // ?�업기사
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
              <th className="search-th">?�사 ?�주 구분</th>
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

              <th className="search-th">?�체�?/th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  value={employeeData?.ENTR_CD || ''}
                  data-field="crpnNm"
                  onChange={(e) => handleEmployeeChange('ENTR_CD', e.target.value)}
                  disabled={newFlag ? false : !fieldEnableState?.crpnNm}
                >
                  <option key="select-default" value="">?�택?�세??/option>
                  {(() => {
                    
                    if (employeeData?.OWN_OUTS_DIV_CD === '1') {
                      // ?�사??경우: ?�사 ?�체 목록
                      if (commonCodes.ownCompanyList.length === 0) {
                        return <option key="loading-own" value="" disabled>로딩�?..</option>;
                      }
                      return commonCodes.ownCompanyList.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ));
                    } else if (employeeData?.OWN_OUTS_DIV_CD === '2') {
                      // ?�주??경우: ?�주 ?�체 목록
                      if (commonCodes.entrList.length === 0) {
                        return <option key="loading-entr" value="" disabled>로딩�?..</option>;
                      }
                      
                      return commonCodes.entrList.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ));
                    }
                    return null;
                  })()}
                </select>

              </td>

              <th className="search-th ">?�원번호</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full min-w-[150px]" 
                  data-field="empNo"
                  value={employeeData?.EMP_NO || ''} 
                  onChange={(e) => {
                    const value = e.target.value;
                    // ?�원번호: 10바이???�한 (?�자/?�문 ?�주)
                    const byteLength = new Blob([value]).size;
                    if (byteLength <= 10) {
                      handleEmployeeChange('EMP_NO', value);
                    }
                  }}
                  disabled={(() => {
                    // AS-IS MXML�??�일??로직: ?�사/?�주 구분???�른 ?�원번호 ?�성??비활?�화
                    if (newFlag) {
                      // ?�규 모드???�는 ?�사/?�주 구분???�라 ?�어
                      return employeeData?.OWN_OUTS_DIV_CD === '2'; // ?�주�?비활?�화 (?�동채번)
                    } else {
                      // ?�정 모드???�는 fieldEnableState�??�어
                      return !fieldEnableState?.empNo;
                    }
                  })()}
                />
              </td>

              <th className="search-th">본�?</th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  data-field="hqDiv"
                  value={employeeData?.HQ_DIV_CD || ''}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    
                    // 직접 employeeData ?�데?�트
                    setEmployeeData(prev => {
                      if (!prev) return prev;
                      const newData = {
                        ...prev,
                        HQ_DIV_CD: selectedValue
                      };
                      return newData;
                    });
                    
                    // 본�? 변�???부??목록 ?�데?�트
                    if (selectedValue) {
                      handleHqDivChange(selectedValue);
                      // 부??코드 초기??
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
                  {<option key="hq-select-default" value="">?�택?�세??/option>}
                  {commonCodes.hqDiv.map(code => (
                    <option key={code.data} value={code.data}>{code.label}</option>
                  ))}
                </select>

              </td>

              <th className="search-th">부??/th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  data-field="deptDiv"
                  value={employeeData?.DEPT_DIV_CD || ''}
                  onChange={(e) => handleEmployeeChange('DEPT_DIV_CD', e.target.value)}
                  disabled={newFlag ? false : !fieldEnableState?.deptDiv}
                >
                  <option key="dept-select-default" value="">?�택?�세??/option>
                  {commonCodes.deptDiv.map(code => (
                    <option key={code.data} value={code.data}>{code.label}</option>
                  ))}
                </select>
              </td>

              <th className="search-th">직책</th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  value={employeeData?.DUTY_CD || ''}
                  onChange={(e) => handleEmployeeChange('DUTY_CD', e.target.value)}
                  disabled={newFlag ? false : !fieldEnableState?.duty}
                >
                  <option key="duty-select-default" value="">?�택?�세??/option>
                  {commonCodes.duty.map(code => (
                    <option key={code.data} value={code.data}>{code.label}</option>
                  ))}
                </select>
              </td>
            </tr>

            {/* 2?? 조회 버튼 */}
            <tr className="search-tr">
              <th className="search-th  ">근무?�태</th>
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

              <th className="search-th ">?�사?�자</th>
              <td className="search-td">
                <input 
                  type="date" 
                  className="input-base .input-calender min-w-[150px]" 
                  data-field="entrDt"
                  value={employeeData?.ENTR_DT ? employeeData.ENTR_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                  onChange={(e) => handleEmployeeChange('ENTR_DT', e.target.value.replace(/-/g, ''))}
                />
              </td>

              <th className="search-th  ">?�사?�자</th>
              <td className="search-td">
                <input 
                  type="date" 
                  className="input-base .input-calender min-w-[150px]" 
                  value={employeeData?.RETIR_DT ? employeeData.RETIR_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                  onChange={(e) => handleEmployeeChange('RETIR_DT', e.target.value.replace(/-/g, ''))}
                />
              </td>

              <th className="search-th">?�직?�수</th>
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
                  {isLoading ? '조회�?..' : '조회'}
                </button>
                  </div> }
                </div>
              </td>


            </tr>
          </tbody>
        </table>
      </div>

      {/* ?�러 메시지 */}
      {error && (
        <div className="text-red-500 text-sm mt-2 px-1">
          {error}
        </div>
      )}

      {/*조회???�역*/}
      <div className="flex gap-4 mt-4 text-sm">
        {/* 개인 ?�보 */}
        <div className="w-1/2 ">
          <div className="font-semibold mb-1 pl-1">개인 ?�보</div>
          <div className="clearbox-div">
            <table className="clear-table">
              <tbody>
                <tr className="clear-tr">
                  <th className="clear-th">?�명</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      data-field="empNm"
                      value={employeeData?.EMP_NM || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 바이??길이 계산 (?��? 1글??= 3바이??
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 20) {
                          handleEmployeeChange('EMP_NM', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">최종?�력</th>
                  <td className="clear-td">
                    <select 
                      className="combo-base w-full"
                      data-field="lastAdbgDiv"
                      value={employeeData?.LAST_ADBG_DIV || ''}
                      onChange={(e) => handleEmployeeChange('LAST_ADBG_DIV', e.target.value)}
                    >
                      <option key="lastAdbg-select-default" value="">?�택?�세??/option>
                      {commonCodes.lastAdbgDiv.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">?�문 ?�명</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.EMP_ENG_NM || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ?�문 ?�명: 50바이???�한 (?�문 ?�주)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 50) {
                          handleEmployeeChange('EMP_ENG_NM', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">?�교</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.LAST_SCHL || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ?�교�? 50바이???�한 (?��? ?�함)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 50) {
                          handleEmployeeChange('LAST_SCHL', value);
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">?�별</th>
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
                  <th className="clear-th">?�공</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.MAJR || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ?�공�? 50바이???�한 (?��? ?�함)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 50) {
                          handleEmployeeChange('MAJR', value);
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">�?��</th>
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
                  <th className="clear-th">졸업?�자</th>
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
                  <th className="clear-th">주�??�록번호</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.RES_REG_NO || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 주�??�록번호: 13바이???�한 (?�자 + ?�이??
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 13) {
                          handleEmployeeChange('RES_REG_NO', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">?�년?�일</th>
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
                  <th className="clear-th">?��??�화</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.MOB_PHN_NO || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ?��??�화: 20바이???�한 (?�자 + ?�이??
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 20) {
                          handleEmployeeChange('MOB_PHN_NO', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">?�택?�화</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.HOME_TEL || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // ?�택?�화: 20바이???�한 (?�자 + ?�이??
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
                        // E-Mail: 100바이???�한 (?�문 + ?�수문자)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 100) {
                          handleEmployeeChange('EMAIL_ADDR', value);
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">주소</th>
                                      <td className="clear-td" colSpan={3}>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          className="input-base input-default !w-[70px]" 
                          placeholder="?�편번호"
                          value={employeeData?.HOME_ZIP_NO || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            // ?�편번호: 6바이???�한 (?�자)
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
                          찾기
                        </button>
                        <input 
                          className="input-base input-default w-[40%]" 
                          placeholder="기본주소"
                          value={employeeData?.HOME_ADDR || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            // 기본주소: 200바이???�한 (?��? ?�함)
                            const byteLength = new Blob([value]).size;
                            if (byteLength <= 200) {
                              handleEmployeeChange('HOME_ADDR', value);
                            }
                          }}
                        />
                        <input 
                          className="input-base input-default w-[40%]" 
                          placeholder="?�세주소"
                          value={employeeData?.HOME_DET_ADDR || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            // ?�세주소: 100바이???�한 (?��? ?�함)
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

        {/* ?�로?�트 ?�보 */}
        <div className="w-1/2">
          <div className="font-semibold mb-1 pl-1">?�로?�트 ?�보</div>
          <div className="clearbox-div">
            <table className="clear-table">
              <tbody>
                <tr className="clear-tr">
                  <th className="clear-th">기�? ?�보</th>
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
                        ?�력
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
                        기술?�격
                      </label>
                    </div>
                  </td>
                </tr>

                <tr className="clear-tr">
                  <th className="clear-th">?�격�?/th>
                  <td className="clear-td">
                    <select 
                      className="combo-base w-full"
                      value={employeeData?.CTQL_CD || ''}
                      onChange={(e) => handleEmployeeChange('CTQL_CD', e.target.value)}
                    >
                      <option key="ctql-select-default" value="">?�택?�세??/option>
                      {commonCodes.ctqlCd.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ))}
                    </select>
                  </td>
                  <th className="clear-th">?�격�?취득?�자</th>
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
                  <th className="clear-th">최초 ?�입?�자</th>
                  <td className="clear-td">
                    <input 
                      type="date" 
                      className="input-base .input-calender" 
                      data-field="fstInDt"
                      value={employeeData?.FST_IN_DT ? employeeData.FST_IN_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                      onChange={(e) => handleEmployeeChange('FST_IN_DT', e.target.value.replace(/-/g, ''))}
                    />
                  </td>
                  <th className="clear-th">최종 철수?�자</th>
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
                  <th className="clear-th">?�사 ??경력</th>
                  <td className="clear-td">
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        className="input-base input-default !w-[50px] text-right" 
                        placeholder="00" 
                        maxLength={3}
                        onChange={(e) => {
                          const value = e.target.value;
                          // ?�사 ??경력 ?�수: 3바이???�한 (?�자)
                          const byteLength = new Blob([value]).size;
                          if (byteLength <= 3) {
                            const years = Number(value) || 0;
                            const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                            // AS-IS?� ?�일??계산 로직
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
                          // AS-IS MXML 로직�??�일: 경력구분???�른 분기
                          const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                          const befCarrMonths = carrDivCd === '1' 
                            ? Number(employeeData?.ENTR_BEF_CARR || 0)
                            : Number(employeeData?.ENTR_BEF_CTQL_CARR || 0);
                          // AS-IS?� ?�일?�게 Math.floor ?�용
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
                          // ?�사 ??경력 ?�수: 2바이???�한 (?�자)
                          const byteLength = new Blob([value]).size;
                          if (byteLength <= 2) {
                            const months = Number(value) || 0;
                            const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                            // AS-IS?� ?�일??계산 로직
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
                          // AS-IS MXML 로직�??�일: 경력구분???�른 분기
                          const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                          const befCarrMonths = carrDivCd === '1' 
                            ? Number(employeeData?.ENTR_BEF_CARR || 0)
                            : Number(employeeData?.ENTR_BEF_CTQL_CARR || 0);
                          // AS-IS?� ?�일??계산 로직: nBefCarrMCnt = nBefCarrMCnt - (nBefCarrYCnt*12)
                          const befCarrYears = Math.floor(befCarrMonths / 12);
                          return befCarrMonths > 0 ? befCarrMonths - (befCarrYears * 12) : '';
                        })()}
                      />
                      <span className="m-0">??/span>
                    </div>
                  </td>
                  <th className="clear-th">경력 개월 ??/th>
                  <td className="clear-td">
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        className="input-base input-default !w-[50px] text-right" 
                        placeholder="00" 
                        value={(() => {
                          // AS-IS MXML 로직�??�일: 경력개월?��? xx?�xxx개월�??�시
                          const carrMonths = Number(employeeData?.CARR_MCNT || 0);
                          // AS-IS?� ?�일?�게 Math.floor ?�용
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
                          // AS-IS MXML 로직�??�일: 경력개월?��? xx?�xxx개월�??�시
                          const carrMonths = Number(employeeData?.CARR_MCNT || 0);
                          // AS-IS?� ?�일??계산 로직: nCarrMCnt = nCarrMCnt - (nCarrYCnt*12)
                          const carrYears = Math.floor(carrMonths / 12);
                          return carrMonths > 0 ? carrMonths - (carrYears * 12) : '';
                        })()}
                        readOnly
                      />
                      <span className="m-0">개월</span>
                    </div>
                  </td>
                </tr>

                <tr className="clear-tr">
                  <th className="clear-th">계산 기�? ?�자</th>
                  <td className="clear-td">
                    <input 
                      type="date" 
                      className="input-base .input-calender" 
                      value={employeeData?.CARR_CALC_STND_DT ? employeeData.CARR_CALC_STND_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                      onChange={(e) => handleEmployeeChange('CARR_CALC_STND_DT', e.target.value.replace(/-/g, ''))}
                    />
                  </td>
                  <th className="clear-th">기술?�급</th>
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
                          // AS-IS MXML??onClickBtnCarrCalc 로직�??�일
                          if (!validateInput("CarrCalc")) {
                            return;
                          }
                          setShowCarrCalcPopup(true);
                          // ?�업 ?�릴 ??body scroll 방�? �????��?
                          document.body.style.overflow = 'hidden';
                          // ??컨테?�너 ?��?
                          const tabContainer = document.querySelector('.tab-container');
                          if (tabContainer) {
                            (tabContainer as HTMLElement).style.display = 'none';
                          }
                        }}
                      >
                        경력계산
                      </button>
                      <button 
                        className="btn-base btn-act w-full"
                        onClick={() => {
                          // AS-IS MXML??onClickBtnGrdCHngSrch 로직�??�일
                          if (newFlag) {
                            showToast('?�규 ?�력 ?�에??기술?�급?�력 조회�??????�습?�다. ?�????조회 ?�십?�요.', 'warning');
                            return;
                          }
                          
                          if (!employeeData?.EMP_NO) {
                            showToast('?�원번호가 ?�요?�니??', 'warning');
                            return;
                          }
                          
                          setShowGradeHistoryPopup(true);
                          // ?�업 ?�릴 ??body scroll 방�? �????��?
                          document.body.style.overflow = 'hidden';
                          // ??컨테?�너 ?��?
                          const tabContainer = document.querySelector('.tab-container');
                          if (tabContainer) {
                            (tabContainer as HTMLElement).style.display = 'none';
                          }
                        }}
                      >
                        ?�급?�력조회
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="clear-tr">
                  <th className="clear-th align-top pt-2">비고</th>
                  <td className="clear-td" colSpan={3}>
                    <textarea 
                      className="textarea_def" 
                      value={employeeData?.RMK || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 비고: 500바이???�한 (?��? ?�함)
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
            {/* ?�내문구 + 버튼??*/}
            <div className="flex justify-between items-center mt-2 px-1">
              <p className="text-[13px] text-[#00509A]">
                ??조회�?가?�합?�다. ?�로?�트 ?�보 ?�정?� 경영지?�본부 ?�사?�당?�만 가?�합?�다.
              </p>
              <div className="flex gap-2">
                <button 
                  className="btn-base btn-delete"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  ??��
                </button>
                <button 
                  className="btn-base btn-etc"
                  onClick={handleNew}
                  disabled={isLoading}
                >
                  ?�규
                </button>
                <button 
                  className="btn-base btn-act"
                  onClick={handleSave}
                  disabled={isLoading || (!newFlag && (!employeeData?.EMP_NO || employeeData.EMP_NO.trim() === ''))}
                >
                  ?�??
                </button>
              </div>
            </div>


          </div>
        </div>

      </div>

      {/* 경력계산 ?�업 */}
      {showCarrCalcPopup && (
        <PSM1050M00
              employeeData={employeeData}
              newFlag={newFlag}
              onClose={() => {
                setShowCarrCalcPopup(false);
                // ?�업 ?�힐 ??body scroll 복원 �????�시
                document.body.style.overflow = 'auto';
                // ??컨테?�너 ?�시 ?�시
                const tabContainer = document.querySelector('.tab-container');
                if (tabContainer) {
                  (tabContainer as HTMLElement).style.display = 'flex';
                }
              }}
              onConfirm={(data) => {
                // AS-IS MXML??onBtnConfirmClick 로직�??�일
                
                // 경력계산 결과�?employeeData??반영
                if (data && employeeData) {
                  const resultData = data.split('^');
                  
                  // AS-IS MXML�??�일???�이??매핑
                  // [1]최초?�입?�자 [2]최종철수?�자 [3]?�사?�경???? [4]?�사?�경???? [5]?�사?�경???? [6]?�사?�경???? 
                  // [7]?�계(?? [8]?�계(?? [9]?�급명칭 [10]?�급코드 [11]경력기�?(?�력/기술?�격)
                  // [12]?�격증코??[13]?�격취득?�자 [14]?�력경력개월??[15]?�격경력개월??[16]경력계산기�???
                  // [17]?�사?�학?�경?�개?�수 [18]?�사?�자격경?�개?�수 [19]?�사?�학?�경?�개?�수 [20]?�사?�자격경?�개?�수
                  const updatedEmployeeData = {
                    ...employeeData,
                    FST_IN_DT: resultData[1] || employeeData.FST_IN_DT,
                    LAST_END_DT: resultData[2] || employeeData.LAST_END_DT,
                    // ?�격�??�보
                    CTQL_CD: resultData[12] || employeeData.CTQL_CD,
                    CTQL_PUR_DT: resultData[13] || employeeData.CTQL_PUR_DT,
                    // ?�사??경력 - 경력구분???�라 ?�정
                    ENTR_BEF_CARR: resultData[11] === '1' ? resultData[17] : employeeData.ENTR_BEF_CARR, // ?�력기�?
                    ENTR_BEF_CTQL_CARR: resultData[11] === '2' ? resultData[18] : employeeData.ENTR_BEF_CTQL_CARR, // 기술?�격기�?
                    // ?�사??경력
                    ENTR_AFT_ADBG_CARR: resultData[19] || employeeData.ENTR_AFT_ADBG_CARR,
                    ENTR_AFT_CTQL_CARR: resultData[20] || employeeData.ENTR_AFT_CTQL_CARR,
                    // ?�계 경력
                    CARR_MCNT: resultData[11] === '1' ? resultData[14] : resultData[15] || employeeData.CARR_MCNT,
                    // 기술?�급
                    LAST_TCN_GRD: resultData[9] || employeeData.LAST_TCN_GRD,
                    LAST_TCN_GRD_CD: resultData[10] || employeeData.LAST_TCN_GRD_CD,
                    // 경력구분
                    CARR_DIV_CD: resultData[11] || employeeData.CARR_DIV_CD,
                    // 경력계산기�???
                    CARR_CALC_STND_DT: resultData[16] || new Date().toISOString().slice(0, 10).replace(/-/g, '')
                  };
                  
                  setEmployeeData(updatedEmployeeData);
                  
                  // AS-IS MXML�??�일: 경력개월??계산 ?�면?�로부???�이?��? 받�? 값을 ?�??
                  setTimeout(() => {
                    saveProjectInputData();
                  }, 0);
                }
                
                setShowCarrCalcPopup(false);
                // ?�업 ?�힐 ??body scroll 복원 �????�시
                document.body.style.overflow = 'auto';
                // ??컨테?�너 ?�시 ?�시
                const tabContainer = document.querySelector('.tab-container');
                if (tabContainer) {
                  (tabContainer as HTMLElement).style.display = 'flex';
                }
              }}
            />
      )}

      {/* ?�급?�력조회 ?�업 */}
      {showGradeHistoryPopup && (
        <PSM0030P00
          empNo={employeeData?.EMP_NO}
          onClose={() => {
            setShowGradeHistoryPopup(false);
            // ?�업 ?�힐 ??body scroll 복원 �????�시
            document.body.style.overflow = 'auto';
            // ??컨테?�너 ?�시 ?�시
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
            // 기술?�급 코드???�당?�는 text �?찾기
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


