'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import '../common/common.css';
import PSM1050M00 from './PSM1050M00';
import PSM0030P00 from './PSM0030P00';

// 타입 정의
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
  // AS-IS MXML에서 사용되는 추가 필드들
  ENTR_AFT_ADBG_CARR?: string; // 입사후학력경력개월수
  ENTR_AFT_CTQL_CARR?: string; // 입사후자격경력개월수
  ENTR_BEF_ADBG_CARR?: string; // 입사전학력경력개월수
}

// PSM1010M0는 selectedEmployee 타입
// interface SelectedEmployee { ... } <= 이 부분 전체 삭제

interface CommonCode {
  data: string;
  label: string;
}

/**
 * PSM1020M00 컴포넌트 Props 인터페이스
 * 
 * 사원 정보 등록/수정 화면의 props 정의
 * 
 * @property {EmployeeData | null} selectedEmployee - 선택된 사원 정보 (PSM1010M00에서 전달)
 * @property {Object} [fieldEnableState] - 필드 활성화 상태 (신규/수정 모드에 따라 다름)
 * @property {Function} [onSearchSuccess] - 검색 성공 시 호출될 콜백 (상위 화면 재조회)
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
  onSearchSuccess?: () => void; // AS-IS MXML의 parentDocument.prf_PsmSearch와 동일
}

/**
 * PSM1020M00 컴포넌트 Ref 인터페이스
 * 
 * 부모 컴포넌트에서 호출할 수 있는 메서드들을 정의
 * 
 * @property {Function} handleSearch - 사원 정보 검색 실행
 * @property {Function} initialize - 컴포넌트 초기화 (신규 모드로 설정)
 */
export interface PSM1020M00Ref {
  handleSearch: () => Promise<void>;
  initialize: () => void;
}

const SearchSection = forwardRef<PSM1020M00Ref, PSM1020M00Props>(({ selectedEmployee, fieldEnableState, onSearchSuccess }, ref) => {
  const { showToast, showConfirm } = useToast();
  const { user } = useAuth();
  // 검색 조건 state
  const [searchConditions, setSearchConditions] = useState({
    ownOutsDiv: '1', // 자사/외주 구분 (1:자사, 2:외주)
    empNm: '', // 사원성명
    hqDivCd: 'ALL', // 본부코드
    deptDivCd: 'ALL', // 부서코드
    dutyCd: 'ALL', // 직책코드
    retirYn: 'Y' // 퇴사자포함유무
  });

  // 사원 데이터 state - 초기값으로 자사 설정
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>({
    OWN_OUTS_DIV_CD: '1',
    OWN_OUTS_DIV: '자사',
    ENTR_CD: '',
    CARR_DIV_CD: '1',
    WKG_ST_DIV_CD: '1',
    WKG_ST_DIV: '재직중',
    KOSA_REG_YN: 'N',
    HQ_DIV_CD: '', // 본부 코드 초기값 추가
    DEPT_DIV_CD: '', // 부서 코드 초기값 추가
    DUTY_CD: '', // 직책 코드 초기값 추가
    EMP_NO: '', // 사원번호 초기값 추가
    EMP_NM: '', // 사원명 초기값 추가
    EMP_ENG_NM: '', // 영문명 초기값 추가
    RES_REG_NO: '', // 주민등록번호 초기값 추가
    BIR_YR_MN_DT: '', // 생년월일 초기값 추가
    SEX_DIV_CD: '', // 성별 초기값 추가
    NTLT_DIV_CD: '', // 국적 초기값 추가
    ENTR_DT: '', // 입사일자 초기값 추가
    RETIR_DT: '', // 퇴사일자 초기값 추가
    EMAIL_ADDR: '', // 이메일 초기값 추가
    MOB_PHN_NO: '', // 휴대전화 초기값 추가
    HOME_TEL: '', // 자택전화 초기값 추가
    HOME_ZIP_NO: '', // 우편번호 초기값 추가
    HOME_ADDR: '', // 주소 초기값 추가
    HOME_DET_ADDR: '', // 상세주소 초기값 추가
    LAST_IN_DT: '', // 최종투입일자 초기값 추가
    LAST_END_DT: '', // 최종철수일자 초기값 추가
    LAST_SCHL: '', // 학교 초기값 추가
    MAJR: '', // 전공 초기값 추가
    LAST_GRAD_DT: '', // 졸업일자 초기값 추가
    CTQL_CD: '', // 자격증 초기값 추가
    CTQL_PUR_DT: '', // 자격취득일자 초기값 추가
    CARR_MCNT: '0', // 경력개월수 초기값 추가
    FST_IN_DT: '', // 최초투입일자 초기값 추가
    ENTR_BEF_CARR: '0', // 입사전경력 초기값 추가
    ENTR_BEF_CTQL_CARR: '0', // 입사전자격경력 초기값 추가
    ADBG_CARR_MCNT: '0', // 학력경력개월수 초기값 추가
    CTQL_CARR_MCNT: '0', // 자격경력개월수 초기값 추가
    CARR_CALC_STND_DT: '', // 경력계산기준일 초기값 추가
    LAST_ADBG_DIV: '', // 최종학력 초기값 추가
    LAST_TCN_GRD: '', // 기술등급 초기값 추가
    RMK: '', // 비고 초기값 추가
    HDOFC_YEAR: '0', // 재직년수(년) 초기값 추가
    HDOFC_MONTH: '0', // 재직년수(월) 초기값 추가
    ENTR_AFT_ADBG_CARR: '0', // 입사후학력경력 초기값 추가
    ENTR_AFT_CTQL_CARR: '0' // 입사후자격경력 초기값 추가
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFlag, setNewFlag] = useState<boolean>(false); // AS-IS MXML의 newFlag와 동일 - 초기값을 false로 설정
  const [showCarrCalcPopup, setShowCarrCalcPopup] = useState<boolean>(false); // 경력계산 팝업 표시 여부
  const [showGradeHistoryPopup, setShowGradeHistoryPopup] = useState<boolean>(false); // 등급이력조회 팝업 표시 여부

  // AS-IS MXML과 동일한 저장 데이터 변수들
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
    ownCompanyList: CommonCode[]; // 자사 업체 목록
    entrList: CommonCode[]; // 외주 업체 목록
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

  // 외부에서 호출할 수 있는 함수들을 ref로 노출
  useImperativeHandle(ref, () => ({
    handleSearch: async () => {
      await handleSearch();
    },
    initialize: () => {
      // PSM1020M00 초기화
      setNewFlag(false);
      setEmployeeData({
        EMP_NO: '',
        OWN_OUTS_DIV_CD: '1',
        OWN_OUTS_DIV: '자사',
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

  // selectedEmployee prop이 변경될 때 employeeData를 업데이트
  useEffect(() => {
    if (selectedEmployee) {
      // PSM1020M00: selectedEmployee 변경됨 - 선택된 사원 정보로 employeeData 설정
      
      // 사원 선택 시 신규 모드 해제
      setNewFlag(false);
      
      // selectedEmployee 데이터를 employeeData 형식으로 변환
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
        // AS-IS MXML에서 사용되는 필드들
        ENTR_BEF_CARR: selectedEmployee.ENTR_BEF_CARR,
        ENTR_BEF_CTQL_CARR: selectedEmployee.ENTR_BEF_CTQL_CARR,
        ADBG_CARR_MCNT: selectedEmployee.ADBG_CARR_MCNT,
        CTQL_CARR_MCNT: selectedEmployee.CTQL_CARR_MCNT,
        CARR_CALC_STND_DT: selectedEmployee.CARR_CALC_STND_DT,
        // 기본값 유지
        CARR_DIV_CD: selectedEmployee.CARR_DIV_CD || '1',
        KOSA_REG_YN: selectedEmployee.KOSA_REG_YN || 'N',
        HDOFC_YEAR: selectedEmployee.HDOFC_YEAR,
        HDOFC_MONTH: selectedEmployee.HDOFC_MONTH,
        ENTR_AFT_ADBG_CARR: selectedEmployee.ENTR_AFT_ADBG_CARR,
        ENTR_AFT_CTQL_CARR: selectedEmployee.ENTR_AFT_CTQL_CARR,
        // 최종학력 정보 추가
        LAST_ADBG_DIV: selectedEmployee.LAST_ADBG_DIV,
        LAST_ADBG_DIV_NM: selectedEmployee.LAST_ADBG_DIV_NM
      };
      
      setEmployeeData(convertedData);
      
      // 외주 사원인 경우 외주 업체 목록 로드
      if (selectedEmployee.OWN_OUTS_DIV_CD === '2') {
        loadEntrList();
      }
    }
  }, [selectedEmployee]);

  // 초기 데이터 로드
  useEffect(() => {
    // 초기 데이터 로드 시작 - 공통코드, 자사/외주 업체 목록 로드
    const initializeData = async () => {
      await loadCommonCodes();
      await loadOwnCompanyList(); // 자사 업체 목록 로드
      await loadEntrList(); // 외주 업체 목록 로드
    };
    initializeData();
    
    // 카카오 주소 검색 스크립트 로드
    if (typeof window !== 'undefined' && !window.daum) {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // AS-IS COM_03_0101_S 프로시저 호출 방식으로 공통코드 로드
  const loadCommonCodes = async () => {
    try {
      const codeTypes = [
        { key: 'ownOutsDiv', type: '103' }, // 자사/외주구분
        { key: 'hqDiv', type: '113' }, // 본부구분
        { key: 'duty', type: '116' }, // 직책
        { key: 'sexDiv', type: '011' }, // 성별구분
        { key: 'ntltDiv', type: '012' }, // 국적구분
        { key: 'lastAdbgDiv', type: '014' }, // 최종학력구분
        { key: 'ctqlCd', type: '013' }, // 자격증
        { key: 'wkgStDiv', type: '017' }, // 근무상태구분
        { key: 'tcnGrd', type: '104' } // 기술등급
      ];

      const newCommonCodes: any = { ...commonCodes };

      for (const { key, type } of codeTypes) {
        try {
          // AS-IS COM_03_0101_S 프로시저 호출 방식
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
            
            // API 응답을 {data: codeId, label: codeNm} 형태로 변환
            const transformedData = data.map((item: any) => ({
              data: item.codeId || '',
              label: item.codeNm || ''
            }));
            
            newCommonCodes[key] = transformedData;
          }
        } catch (error) {
          console.error(`공통코드 로드 실패 (${type}):`, error);
        }
      }

      setCommonCodes(newCommonCodes);
    } catch (error) {
      console.error('공통코드 로드 중 오류:', error);
    }
  };

  // AS-IS COM_03_0201_S 프로시저 호출 방식으로 본부별 부서 로드
  const loadDeptByHq = async (hqDivCd: string) => {
    try {
      // 본부별 부서 로드 시작
      
      // AS-IS COM_03_0201_S 프로시저 호출 방식
      // 조회유형=2, 전체포함유무=N, 본부코드=hqDivCd
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
          
          // API 응답이 배열 형태인 경우 객체 형태로 변환
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
        
        // 부서 목록이 로드되면 기존 employeeData의 DEPT_DIV_CD 값 유지
        if (transformedData && transformedData.length > 0) {
          // employeeData에 DEPT_DIV_CD가 있으면 그 값을 유지, 없으면 첫 번째 항목 선택
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
      console.error('부서 로드 중 오류:', error);
    }
  };

  // AS-IS COM_03_0101_S 프로시저 호출 방식으로 자사 업체 목록 로드
  const loadOwnCompanyList = async () => {
    try {
      // 자사 업체 목록 로드 시작
      const response = await fetch('/api/common/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          largeCategoryCode: '110' // 자사 업체 대분류 코드
        })
      });
      
              if (response.ok) {
          const result = await response.json();
          const data = result.data || [];
          
          // API 응답을 {data: codeId, label: codeNm} 형태로 변환
          const transformedData = data.map((item: any) => ({
            data: item.codeId || '',
            label: item.codeNm || ''
          }));
        
        setCommonCodes(prev => ({
          ...prev,
          ownCompanyList: transformedData
        }));
        
        // 자사 업체 목록이 로드되고 첫 번째 항목이 있으면 자동 선택
        if (transformedData && transformedData.length > 0 && employeeData?.OWN_OUTS_DIV_CD === '1') {
          setEmployeeData(prev => ({
            ...prev!,
            ENTR_CD: transformedData[0].data
          }));
        }
      }
    } catch (error) {
      console.error('자사 업체 목록 로드 중 오류:', error);
    }
  };

  // AS-IS COM_03_0101_S 프로시저 호출 방식으로 외주 업체 목록 로드
  const loadEntrList = async () => {
    try {
      // 외주 업체 목록 로드 시작
            const response = await fetch('/api/common/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          largeCategoryCode: '111' // 외주 업체 대분류 코드
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        
        // API 응답을 {data: codeId, label: codeNm} 형태로 변환
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
      console.error('외주 업체 목록 로드 중 오류:', error);
    }
  };

  // 검색 조건 변경 핸들러
  const handleSearchChange = (field: string, value: string) => {
    setSearchConditions(prev => ({
      ...prev,
      [field]: value
    }));

    // 본부 변경 시 부서 리스트 업데이트 (AS-IS onCbHqDivChange 로직)
    if (field === 'hqDivCd') {
      handleHqDivChange(value);
    }
    
    // 자사/외주 구분 변경 시 이벤트 (AS-IS onOwnOutsDivChange 로직)
    if (field === 'ownOutsDiv') {
      handleOwnOutsDivChange(value);
    }
  };

  // AS-IS MXML의 onOwnOutsDivChange 함수와 동일한 로직
  const handleOwnOutsDivChange = (value: string) => {
    // 자사/외주 구분 변경 처리
    
    if (value === '1') {
      // AS-IS MXML과 동일: 자사인 경우
      // cbCrpnNm.setLargeCode('110','') - 자사 업체 목록 로드
      if (commonCodes.ownCompanyList.length === 0) {
        loadOwnCompanyList();
      }
      
      // AS-IS MXML과 동일: txtEmpNo.enabled = true - 사원번호 활성화
      
      setEmployeeData(prev => ({
        ...prev!,
        OWN_OUTS_DIV_CD: '1',
        OWN_OUTS_DIV: '자사',
        ENTR_CD: '' // 자사 업체 코드 초기화
      }));
    } else if (value === '2') {
      // AS-IS MXML과 동일: 외주인 경우
      // cbCrpnNm.setLargeCode('111','') - 외주 업체 목록 로드
      if (commonCodes.entrList.length === 0) {
        loadEntrList();
      }
      
      // AS-IS MXML과 동일: txtEmpNo.enabled = false - 외주 사번은 자동채번
      
      setEmployeeData(prev => ({
        ...prev!,
        OWN_OUTS_DIV_CD: '2',
        OWN_OUTS_DIV: '외주',
        ENTR_CD: '' // 외주 업체 코드 초기화
      }));
    }
    
    // AS-IS MXML과 동일: 신규 모드에서 외주 선택 시 추가 처리
    if (newFlag === true && value === '2') {
      // AS-IS: setEmpNoMaxCnt() 호출 (현재는 주석 처리됨)
    }
  };

  // 본부 콤보 변경 이벤트 핸들러 (AS-IS onCbHqDivChange와 동일)
  const handleHqDivChange = (value: string) => {
    // 본부 콤보 변경 이벤트 처리
    
    // AS-IS와 동일하게 부서 콤보 초기화
    setCommonCodes(prev => ({
      ...prev,
      deptDiv: []
    }));
    
    // 사원 데이터에서 부서 코드 초기화
    setEmployeeData(prev => ({
      ...prev!,
      DEPT_DIV_CD: ''
    }));
    
    // 본부가 선택된 경우에만 부서 목록 로드
    if (value && value !== '') {
      loadDeptByHq(value);
    }
  };

  // 사원 조회 함수
  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const empNo = employeeData?.EMP_NO;
      
      if (!empNo) {
        setError('사원번호를 입력해 주십시요.');
        showToast('사원번호를 입력해 주십시요.', 'warning');
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
            OWN_OUTS_DIV: rec.OWN_OUTS_DIV_CD === '1' ? '자사' : '외주',
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
          
          // 본부가 설정되면 해당 본부의 부서 목록 로드
          if (rec.HQ_DIV_CD && rec.HQ_DIV_CD !== '') {
            loadDeptByHq(rec.HQ_DIV_CD);
          }
          
          if (rec.OWN_OUTS_DIV_CD === '2') {
            loadEntrList();
          }
          
          // AS-IS MXML과 동일: 사원 데이터 로드 후 현재 데이터를 saveData에 저장
          setTimeout(() => {
            saveProjectInputData();
          }, 0);
          
        } else {
          setEmployeeData(null);
          const errorMessage = result.message || '해당되는 데이터가 없습니다.';
          setError(errorMessage);
          showToast(errorMessage, 'warning');
        }
      } else {
        throw new Error('사원 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('사원 조회 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };



  // AS-IS MXML의 fnInputValidationChk 함수와 동일한 로직
  const validateInput = (checkType: string): boolean => {
    if (checkType === "Registe" || checkType === "CarrCalc") {
      if (!employeeData?.OWN_OUTS_DIV_CD) {
        showToast("자사 또는 외주 구분을 선택해 주십시요.", "warning");
        // 자사/외주 구분 select에 포커스
        const ownOutsDivSelect = document.querySelector('select[value="' + (employeeData?.OWN_OUTS_DIV_CD || '') + '"]') as HTMLSelectElement;
        if (ownOutsDivSelect) ownOutsDivSelect.focus();
        return false;
      }

      if (employeeData.OWN_OUTS_DIV_CD === "1" && !employeeData.ENTR_DT) {
        showToast("입사일자를 입력해 주십시요", "warning");
        // 입사일자 input에 포커스
        setTimeout(() => {
          const entrDtInput = document.querySelector('input[data-field="entrDt"]') as HTMLInputElement;
          if (entrDtInput) {
            entrDtInput.focus();
          }
        }, 100);
        return false;
      }

      if (!employeeData?.HQ_DIV_CD || employeeData.HQ_DIV_CD.trim() === '') {
        showToast("본부를 선택해 주십시요.", "warning");
        // 본부 select에 포커스
        setTimeout(() => {
          const hqDivSelect = document.querySelector('select[data-field="hqDiv"]') as HTMLSelectElement;
          if (hqDivSelect) {
            hqDivSelect.focus();
          }
        }, 100);
        return false;
      }
      
      if (!employeeData?.LAST_ADBG_DIV || employeeData.LAST_ADBG_DIV === '') {
        showToast("최종학력을 선택해 주십시요", "warning");
        // 최종학력 select에 포커스
        setTimeout(() => {
          const lastAdbgDivSelect = document.querySelector('select[data-field="lastAdbgDiv"]') as HTMLSelectElement;
          if (lastAdbgDivSelect) {
            lastAdbgDivSelect.focus();
          }
        }, 100);
        return false;
      }
      
      if (!employeeData?.FST_IN_DT) {
        showToast("최초투입일자를 입력해 주십시요", "warning");
        // 최초투입일자 input에 포커스
        setTimeout(() => {
          const fstInDtInput = document.querySelector('input[data-field="fstInDt"]') as HTMLInputElement;
          if (fstInDtInput) {
            fstInDtInput.focus();
          }
        }, 100);
        return false;
      } 
        
      if (employeeData.OWN_OUTS_DIV_CD === "2" && !employeeData.LAST_END_DT) {
        showToast("최종철수일자를 입력해 주십시요", "warning");
        // 최종철수일자 input에 포커스
        setTimeout(() => {
          const lastEndDtInput = document.querySelector('input[data-field="lastEndDt"]') as HTMLInputElement;
          if (lastEndDtInput) {
            lastEndDtInput.focus();
          }
        }, 100);
        return false;
      } 

      if (employeeData?.CTQL_CD && employeeData?.CTQL_CD !== "null" && !employeeData?.CTQL_PUR_DT) {
        showToast("자격취득일자를 입력해 주십시요", "warning");
        // 자격취득일자 input에 포커스
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
        showToast("사원번호를 입력해 주십시요", "warning");
        // 사원번호 input에 포커스
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
        showToast("성명을 입력해 주십시요", "warning");
        // 성명 input에 포커스 - data-field 속성으로 정확히 찾기
        setTimeout(() => {
          const empNmInput = document.querySelector('input[data-field="empNm"]') as HTMLInputElement;
          if (empNmInput) {
            empNmInput.focus();
            empNmInput.select(); // 텍스트 선택도 추가
          }
        }, 100);
        return false;
      }

      if (employeeData?.RETIR_DT && employeeData?.WKG_ST_DIV_CD !== "3") {
        showToast("근무상태를 퇴사로 선택해 주십시요", "warning");
        // 근무상태 select에 포커스
        setTimeout(() => {
          const wkgStDivSelect = document.querySelector('select[data-field="wkgStDiv"]') as HTMLSelectElement;
          if (wkgStDivSelect) {
            wkgStDivSelect.focus();
          }
        }, 100);
        return false;
      }

      // 근무상태가 재직일 경우에만 체크
      if (Number(employeeData?.CARR_MCNT || 0) === 0 && employeeData?.WKG_ST_DIV_CD === "1") {
        showToast("경력개월수를 계산해 주십시요.", "warning");
        // 경력계산 버튼에 포커스
        setTimeout(() => {
          const carrCalcBtn = document.querySelector('button[data-field="carrCalcBtn"]') as HTMLButtonElement;
          if (carrCalcBtn) {
            carrCalcBtn.focus();
          }
        }, 100);
        return false;
      }
      
      if (!employeeData?.BIR_YR_MN_DT) {
        showToast("생년월일을 입력해 주십시요.", "warning");
        // 생년월일 input에 포커스
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

  // AS-IS MXML의 OnClick_RegNewPsm 함수와 동일한 사원 정보 저장 로직
  const handleSave = async () => {
    if (!employeeData) return;

    // AS-IS MXML과 동일한 validation 체크
    if (!validateInput("Registe")) {
      return;
    }

    // AS-IS MXML과 동일: 프로젝트정보 데이터 변경여부 Check
    if (isCheckProjectInputData() === true || newFlag === true) {
      showConfirm({
        message: newFlag ? '새로운 사원 정보를 등록하시겠습니까?' : '사원 정보를 수정하시겠습니까?',
        type: 'info',
        onConfirm: async () => {
          await fnPsmBasicInfoUpdate();
        },
        onCancel: () => {
          // 사원 정보 저장 취소
        }
      });
    } else {
      // AS-IS MXML과 동일: 경력개월수계산을 다시 한 후 저장을 하도록 한다.
      const msg = setCarrMonthsComfirmMessage();
      showConfirm({
        message: msg,
        type: 'warning',
        onConfirm: () => {
          // 경력계산 팝업 호출
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

  // AS-IS MXML의 setCarrMonthsComfirmMessage 함수와 동일한 로직
  const setCarrMonthsComfirmMessage = (): string => {
    let strMsg = '';

    // "null" 문자열을 빈 문자열로 치환하는 헬퍼 함수
    const normalizeValue = (value: string | undefined): string => {
      if (!value || value === 'null') return '';
      return value;
    };

    if (normalizeValue(saveData.ctqlCd) !== normalizeValue(employeeData?.CTQL_CD)) {
      strMsg = '자격증 내용이 변경되었습니다. ';
    } else if (normalizeValue(saveData.ctqlPurDt) !== normalizeValue(employeeData?.CTQL_PUR_DT)) {
      strMsg = '자격증취득일자가 변경되었습니다. ';
    } else if (normalizeValue(saveData.fstInDt) !== normalizeValue(employeeData?.FST_IN_DT)) {
      strMsg = '최초투입일자가 변경되었습니다. ';
    } else if (normalizeValue(saveData.lastEndDt) !== normalizeValue(employeeData?.LAST_END_DT)) {
      strMsg = '최종철수일자가 변경되었습니다. ';
    } else {
      strMsg = '';
    }
    
    strMsg += '경력개월수 계산을 다시 한 후 [저장]을 하십시요. \n경력개월수계산 화면을 팝업하시겠습니까?';
    
    return strMsg;
  };

  // AS-IS MXML의 fnPsmBasicInfoUpdate 함수와 동일한 로직
  const fnPsmBasicInfoUpdate = async () => {
    if (!employeeData) return;

    // AS-IS MXML과 동일: 저장 전에 현재 데이터를 saveData에 저장
    saveProjectInputData();

    setIsLoading(true);
    setError(null);

    try {
      // 전송할 데이터 로깅
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
            
      // AS-IS MXML과 동일한 프로시저 호출 방식
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
          showToast('저장되었습니다.', 'info');
          
          // AS-IS MXML과 동일: 저장 후 상위 화면 재조회 (PSM1010M00)
          if (onSearchSuccess) {
            onSearchSuccess();
          }
        } else {
          setError(result.message);
          showToast(result.message, 'error');
        }
      } else {
        throw new Error('저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('저장 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // AS-IS MXML의 setParameter 함수와 동일한 로직
  const setParameter = (tmpStr: string, opt: number): string => {
    if (!tmpStr || tmpStr === '') {
      return '';
    } else {
      // 공백 제거
      if (opt === 1) {
        tmpStr = tmpStr.replace(/ /g, '');
      }
      // 날짜 "/" 제거
      else if (opt === 2) {
        tmpStr = tmpStr.replace(/ /g, '');
        tmpStr = tmpStr.replace(/\//g, '');
      }
      // 주민등록번호, 우편번호 '-' 제거
      else if (opt === 3) {
        tmpStr = tmpStr.replace(/ /g, '');
        tmpStr = tmpStr.replace(/-/g, '');
      }
    }
    return tmpStr;
  };

  // AS-IS MXML과 동일한 파라미터 빌드 로직
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
    objTemp += '|'; // 최초투입일자 (별도 처리)
    objTemp += setParameter(employeeData.LAST_END_DT || '', 2) + '|';
    objTemp += '|'; // 투입횟수
    objTemp += setParameter(employeeData.LAST_ADBG_DIV || '', 1) + '|';
    objTemp += setParameter(employeeData.LAST_SCHL || '', 1) + '|';
    objTemp += setParameter(employeeData.MAJR || '', 1) + '|';
    objTemp += setParameter(employeeData.LAST_GRAD_DT || '', 2) + '|';
    objTemp += setParameter(employeeData.CTQL_CD || '', 1) + '|';
    objTemp += setParameter(employeeData.CTQL_PUR_DT || '', 2) + '|';
    objTemp += getCarrMCnt(employeeData.CARR_MCNT || '0', '0') + '|';
    objTemp += setParameter(employeeData.WKG_ST_DIV_CD || '', 1) + '|';
    objTemp += 'system|'; // 로그인사용자ID
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

  // 사원 정보 삭제
  // AS-IS MXML의 OnClick_DelEmp() 함수와 동일한 삭제 로직
  const handleDelete = async () => {
    // AS-IS와 동일: 사원번호 체크
    if (!employeeData?.EMP_NO) {
      showToast('삭제할 사원을 선택해 주십시요.', 'warning');
      return;
    }

    // AS-IS와 동일: 확인 다이얼로그
    showConfirm({
      message: '정말 삭제하시겠습니까?',
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
              // AS-IS와 동일: 성공 메시지 표시
              showToast('삭제되었습니다.', 'info');
              
              // AS-IS와 동일: 사원번호 업데이트 (성공 응답에서 받은 사원번호)
              if (result.data && result.data.empNo) {
                setEmployeeData(prev => ({
                  ...prev,
                  EMP_NO: result.data.empNo
                }));
              }
              
              // AS-IS와 동일: 화면 초기화
              handleNew();
              
              // AS-IS와 동일: 상위 화면 재조회 (parentDocument.prf_PsmSearch)
              if (onSearchSuccess) {
                onSearchSuccess();
              }
            } else {
              setError(result.message || '삭제에 실패했습니다.');
              showToast(result.message || '삭제에 실패했습니다.', 'error');
            }
          } else {
            throw new Error('삭제에 실패했습니다.');
          }
        } catch (error) {
          console.error('사원 삭제 중 오류:', error);
          const errorMessage = error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => {
        // 사원 삭제 취소
      }
    });
  };

  // AS-IS MXML의 initImpInfo() 함수와 동일한 신규 등록 로직
  const handleNew = () => {
    const today = new Date();
    const todayStr = today.getFullYear().toString() + 
                    String(today.getMonth() + 1).padStart(2, '0') + 
                    String(today.getDate()).padStart(2, '0');

    // AS-IS MXML과 동일한 초기화 로직
    setEmployeeData({
      // 기본 구분 설정
      OWN_OUTS_DIV_CD: '1',
      OWN_OUTS_DIV: '자사',
      ENTR_CD: '',
      CARR_DIV_CD: '1',
      WKG_ST_DIV_CD: '1',
      WKG_ST_DIV: '재직중',
      KOSA_REG_YN: 'N',
      
      // 사원 정보 초기화
      EMP_NO: '',
      EMP_NM: '',
      EMP_ENG_NM: '',
      RES_REG_NO: '',
      BIR_YR_MN_DT: '',
      SEX_DIV_CD: '1',
      NTLT_DIV_CD: '1',
      ENTR_DT: '',
      RETIR_DT: '',
      
      // 조직 정보 초기화 (AS-IS와 동일한 기본값)
      HQ_DIV_CD: '',
      DEPT_DIV_CD: '',
      DUTY_CD: '9', // AS-IS: cbDuty.setValue("9")
      
      // 학력 정보 초기화
      LAST_ADBG_DIV: '',
      LAST_SCHL: '',
      MAJR: '',
      LAST_GRAD_DT: '',
      
      // 연락처 정보 초기화
      MOB_PHN_NO: '',
      HOME_TEL: '',
      HOME_ZIP_NO: '',
      HOME_ADDR: '',
      HOME_DET_ADDR: '',
      EMAIL_ADDR: '',
      
      // 자격증 정보 초기화
      CTQL_CD: '',
      CTQL_PUR_DT: '',
      
      // 경력 정보 초기화 (AS-IS와 동일한 기본값)
      CARR_MCNT: '0',
      ENTR_BEF_CARR: '0',
      ENTR_BEF_CTQL_CARR: '0',
      ADBG_CARR_MCNT: '0',
      CTQL_CARR_MCNT: '0',
      
      // 투입 정보 초기화 (AS-IS: 최초투입일자 = 현재일자)
      FST_IN_DT: todayStr,
      LAST_END_DT: '',
      
      // 재직년수 초기화 (AS-IS와 동일한 기본값)
      HDOFC_YEAR: '0',
      HDOFC_MONTH: '0',
      
      // 기타 정보 초기화
      LAST_TCN_GRD: '',
      KOSA_RNW_DT: '',
      CARR_CALC_STND_DT: '',
      RMK: '',
      
      // 입사후 경력 초기화
      ENTR_AFT_ADBG_CARR: '0',
      ENTR_AFT_CTQL_CARR: '0'
    });

    // AS-IS MXML과 동일: 신규 플래그 설정 및 메시지 표시
    setNewFlag(true);
    
    // AS-IS MXML의 경력개월수 계산 메시지와 동일
            // 경력개월수와 기술등급은 [경력개월수계산] 화면에서 계산되고 확인처리를 통해서 입력이 가능합니다. [경력계산] 버튼을 클릭하세요.
    
    // AS-IS MXML과 동일: 경력계산 버튼 표시 (newFlag가 true일 때만 표시)
    // 이는 UI에서 newFlag 상태에 따라 경력계산 버튼의 visible을 제어하는데 사용됨
    
    // AS-IS MXML과 동일: 신규 등록 시 모든 필드 활성화
    // AS-IS: txtEmpNo.enabled = true; cbOwnOutsDiv.enabled = true; cbCrpnNm.enabled = true;
    // AS-IS: cbHqDiv.enabled = true; cbDeptDiv.enabled = true; cbDuty.enabled = true;
            // 신규 등록: 모든 필드가 활성화되었습니다.
    
    // AS-IS MXML과 동일: 신규 등록 후 현재 데이터를 saveData에 저장
    setTimeout(() => {
      saveProjectInputData();
    }, 0);
  };

  // AS-IS MXML의 getCarrMCnt 함수와 동일한 로직
  const getCarrMCnt = (strYCnt: string, strMCnt: string): string => {
    if (strYCnt === "" && strMCnt === "") return "";
    
    const nYcnt = parseInt(strYCnt) || 0;
    const nMCnt = parseInt(strMCnt) || 0;
    
    return String((nYcnt * 12) + nMCnt);
  };



  // 사원 정보 변경 핸들러
  const handleEmployeeChange = (field: string, value: string) => {
    if (!employeeData) return;

    setEmployeeData(prev => {
      const newData = {
        ...prev!,
        [field]: value
      };
      return newData;
    });

    // 경력구분 변경 시 기술등급 자동 계산 (AS-IS MXML의 onChangeCarrDiv 로직)
    if (field === 'CARR_DIV_CD') {
      handleCarrDivChange(value);
    }
  };

  // AS-IS MXML의 onChangeCarrDiv 로직과 동일
  const handleCarrDivChange = (carrDivCd: string) => {
    if (!employeeData) return;
    
    // 기술등급 자동 계산
    const newTcnGrd = getTcnGrd(carrDivCd);
    setEmployeeData(prev => ({
      ...prev!,
      LAST_TCN_GRD: newTcnGrd
    }));
  };

  // 카카오 주소 검색 팝업 호출
  const handleAddressSearch = () => {
    // 카카오 주소 검색 팝업 스크립트가 로드되어 있는지 확인
    if (typeof window.daum !== 'undefined' && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data: any) {
          // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
          // 예제를 참고하여 각주를 작성하거나, 아래 예제를 수정하여 사용하시면 됩니다.
          
          // 도로명 주소의 노출 규칙에 따라 주소를 표시합니다.
          // 내려오는 데이터가 도로명주소일 경우 linkRoadname이 공백일 수 있습니다.
          let roadAddr = data.roadAddress; // 도로명 주소 변수
          let jibunAddr = data.jibunAddress; // 지번 주소 변수
          
          // 우편번호와 주소 정보를 해당 필드에 넣는다.
          setEmployeeData(prev => ({
            ...prev!,
            HOME_ZIP_NO: data.zonecode,
            HOME_ADDR: roadAddr || jibunAddr
          }));
          
          // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            // 상세주소 필드에 건물명을 추가
            setEmployeeData(prev => ({
              ...prev!,
              HOME_DET_ADDR: data.buildingName || ''
            }));
          }
        }
      }).open();
    } else {
      // 카카오 주소 검색 스크립트가 로드되지 않은 경우
      showToast('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.', 'warning');
      
      // 스크립트 동적 로드
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        // 스크립트 로드 완료 후 다시 호출
        setTimeout(handleAddressSearch, 100);
      };
      document.head.appendChild(script);
    }
  };

  // AS-IS MXML의 fnSaveProjecInputData 함수와 동일한 로직
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

  // AS-IS MXML의 isCheckProjectInputData 함수와 동일한 로직
  const isCheckProjectInputData = (): boolean => {
    if (!employeeData) return false;
    
    // AS-IS와 동일한 날짜 포맷팅 함수
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return '';
      return dateStr.replace(/\//g, ''); // 슬래시 제거
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
        return false; // 외주일 경우에만 최종철수일자를 Check한다.
      }
    }
    return true;
  };

  // AS-IS MXML의 getTcnGrd 함수와 동일한 로직
  const getTcnGrd = (carrDivCd: string): string => {
    if (!employeeData) return "";
    
    const carrMonths = Number(employeeData.CARR_MCNT || 0);
    const lastAdbgDiv = employeeData.LAST_ADBG_DIV || "";
    const ctqlCd = employeeData.CTQL_CD === 'null' ? '' : (employeeData.CTQL_CD || "");

    if (carrDivCd === "1") {
      // 학력 기준
      if (lastAdbgDiv === "04") { // 전문학사
        if (carrMonths < 108) return "4";
        else if (carrMonths < 108 + 36) return "3";
        else if (carrMonths < 108 + 36 + 36) return "2";
        else return "1";
      }
      else if (lastAdbgDiv === "03") { // 학사
        if (carrMonths < 72) return "4";
        else if (carrMonths < 72 + 36) return "3";
        else if (carrMonths < 72 + 36 + 36) return "2";
        else return "1";
      }
      else if (lastAdbgDiv === "02") { // 석사
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
      // 기술자격 기준
      if (ctqlCd === "01") { // 기사
        if (carrMonths < 36) return "4";
        else if (carrMonths < 36 + 36) return "3";
        else if (carrMonths < 36 + 36 + 36) return "2";
        else return "1";
      }
      else if (ctqlCd === "02") { // 산업기사
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
            {/* 1행*/}
            <tr className="search-tr">
              <th className="search-th">자사 외주 구분</th>
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

              <th className="search-th">업체명</th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  value={employeeData?.ENTR_CD || ''}
                  data-field="crpnNm"
                  onChange={(e) => handleEmployeeChange('ENTR_CD', e.target.value)}
                  disabled={newFlag ? false : !fieldEnableState?.crpnNm}
                >
                  <option key="select-default" value="">선택하세요</option>
                  {(() => {
                    
                    if (employeeData?.OWN_OUTS_DIV_CD === '1') {
                      // 자사인 경우: 자사 업체 목록
                      if (commonCodes.ownCompanyList.length === 0) {
                        return <option key="loading-own" value="" disabled>로딩중...</option>;
                      }
                      return commonCodes.ownCompanyList.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ));
                    } else if (employeeData?.OWN_OUTS_DIV_CD === '2') {
                      // 외주인 경우: 외주 업체 목록
                      if (commonCodes.entrList.length === 0) {
                        return <option key="loading-entr" value="" disabled>로딩중...</option>;
                      }
                      
                      return commonCodes.entrList.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ));
                    }
                    return null;
                  })()}
                </select>

              </td>

              <th className="search-th ">사원번호</th>
              <td className="search-td">
                <input 
                  type="text" 
                  className="input-base input-default w-full min-w-[150px]" 
                  data-field="empNo"
                  value={employeeData?.EMP_NO || ''} 
                  onChange={(e) => {
                    const value = e.target.value;
                    // 사원번호: 10바이트 제한 (숫자/영문 위주)
                    const byteLength = new Blob([value]).size;
                    if (byteLength <= 10) {
                      handleEmployeeChange('EMP_NO', value);
                    }
                  }}
                  disabled={(() => {
                    // AS-IS MXML과 동일한 로직: 자사/외주 구분에 따른 사원번호 활성화/비활성화
                    if (newFlag) {
                      // 신규 모드일 때는 자사/외주 구분에 따라 제어
                      return employeeData?.OWN_OUTS_DIV_CD === '2'; // 외주면 비활성화 (자동채번)
                    } else {
                      // 수정 모드일 때는 fieldEnableState로 제어
                      return !fieldEnableState?.empNo;
                    }
                  })()}
                />
              </td>

              <th className="search-th">본부</th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  data-field="hqDiv"
                  value={employeeData?.HQ_DIV_CD || ''}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    
                    // 직접 employeeData 업데이트
                    setEmployeeData(prev => {
                      if (!prev) return prev;
                      const newData = {
                        ...prev,
                        HQ_DIV_CD: selectedValue
                      };
                      return newData;
                    });
                    
                    // 본부 변경 시 부서 목록 업데이트
                    if (selectedValue) {
                      handleHqDivChange(selectedValue);
                      // 부서 코드 초기화
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
                  {<option key="hq-select-default" value="">선택하세요</option>}
                  {commonCodes.hqDiv.map(code => (
                    <option key={code.data} value={code.data}>{code.label}</option>
                  ))}
                </select>

              </td>

              <th className="search-th">부서</th>
              <td className="search-td">
                <select 
                  className="combo-base min-w-[150px] w-full"
                  data-field="deptDiv"
                  value={employeeData?.DEPT_DIV_CD || ''}
                  onChange={(e) => handleEmployeeChange('DEPT_DIV_CD', e.target.value)}
                  disabled={newFlag ? false : !fieldEnableState?.deptDiv}
                >
                  <option key="dept-select-default" value="">선택하세요</option>
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
                  <option key="duty-select-default" value="">선택하세요</option>
                  {commonCodes.duty.map(code => (
                    <option key={code.data} value={code.data}>{code.label}</option>
                  ))}
                </select>
              </td>
            </tr>

            {/* 2행+ 조회 버튼 */}
            <tr className="search-tr">
              <th className="search-th  ">근무상태</th>
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

              <th className="search-th ">입사일자</th>
              <td className="search-td">
                <input 
                  type="date" 
                  className="input-base .input-calender min-w-[150px]" 
                  data-field="entrDt"
                  value={employeeData?.ENTR_DT ? employeeData.ENTR_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                  onChange={(e) => handleEmployeeChange('ENTR_DT', e.target.value.replace(/-/g, ''))}
                />
              </td>

              <th className="search-th  ">퇴사일자</th>
              <td className="search-td">
                <input 
                  type="date" 
                  className="input-base .input-calender min-w-[150px]" 
                  value={employeeData?.RETIR_DT ? employeeData.RETIR_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                  onChange={(e) => handleEmployeeChange('RETIR_DT', e.target.value.replace(/-/g, ''))}
                />
              </td>

              <th className="search-th">재직년수</th>
              <td className="search-td" colSpan={3}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input-base input-default !w-[50px] text-right"
                    placeholder="00"
                    value={employeeData?.HDOFC_YEAR || ''}
                    readOnly
                  />
                  <span className="m-2">년</span>
                  <input
                    type="text"
                    className="input-base input-default !w-[50px] text-right"
                    placeholder="00"
                    value={employeeData?.HDOFC_MONTH || ''}
                    readOnly
                  />
                                    <span className="m-2">월</span>
                  { <div className="ml-auto">
                <button 
                  className="btn-base btn-search"
                  onClick={handleSearch}
                  disabled={isLoading}
                  style={{visibility: 'hidden'}}
                >
                  {isLoading ? '조회중...' : '조회'}
                </button>
                  </div> }
                </div>
              </td>


            </tr>
          </tbody>
        </table>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="text-red-500 text-sm mt-2 px-1">
          {error}
        </div>
      )}

      {/*조회된 영역*/}
      <div className="flex gap-4 mt-4 text-sm">
        {/* 개인 정보 */}
        <div className="w-1/2 ">
          <div className="font-semibold mb-1 pl-1">개인 정보</div>
          <div className="clearbox-div">
            <table className="clear-table">
              <tbody>
                <tr className="clear-tr">
                  <th className="clear-th">성명</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      data-field="empNm"
                      value={employeeData?.EMP_NM || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 바이트 길이 계산 (한글 1글자 = 3바이트)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 20) {
                          handleEmployeeChange('EMP_NM', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">최종학력</th>
                  <td className="clear-td">
                    <select 
                      className="combo-base w-full"
                      data-field="lastAdbgDiv"
                      value={employeeData?.LAST_ADBG_DIV || ''}
                      onChange={(e) => handleEmployeeChange('LAST_ADBG_DIV', e.target.value)}
                    >
                      <option key="lastAdbg-select-default" value="">선택하세요</option>
                      {commonCodes.lastAdbgDiv.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">영문 성명</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.EMP_ENG_NM || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 영문 성명: 50바이트 제한 (영문 위주)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 50) {
                          handleEmployeeChange('EMP_ENG_NM', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">학교</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.LAST_SCHL || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 학교명: 50바이트 제한 (한글 포함)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 50) {
                          handleEmployeeChange('LAST_SCHL', value);
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">성별</th>
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
                  <th className="clear-th">전공</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.MAJR || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 전공명: 50바이트 제한 (한글 포함)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 50) {
                          handleEmployeeChange('MAJR', value);
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">국적</th>
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
                  <th className="clear-th">졸업일자</th>
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
                  <th className="clear-th">주민등록번호</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.RES_REG_NO || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 주민등록번호: 13바이트 제한 (숫자 + 하이픈)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 13) {
                          handleEmployeeChange('RES_REG_NO', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">생년월일</th>
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
                  <th className="clear-th">휴대전화</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.MOB_PHN_NO || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 휴대전화: 20바이트 제한 (숫자 + 하이픈)
                        const byteLength = new Blob([value]).size;
                        if (byteLength <= 20) {
                          handleEmployeeChange('MOB_PHN_NO', value);
                        }
                      }}
                    />
                  </td>
                  <th className="clear-th">자택전화</th>
                  <td className="clear-td">
                    <input 
                      type="text" 
                      className="input-base input-default w-full" 
                      value={employeeData?.HOME_TEL || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 자택전화: 20바이트 제한 (숫자 + 하이픈)
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
                        // E-Mail: 100바이트 제한 (영문 + 특수문자)
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
                          placeholder="우편번호"
                          value={employeeData?.HOME_ZIP_NO || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            // 우편번호: 6바이트 제한 (숫자)
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
                            // 기본주소: 200바이트 제한 (한글 포함)
                            const byteLength = new Blob([value]).size;
                            if (byteLength <= 200) {
                              handleEmployeeChange('HOME_ADDR', value);
                            }
                          }}
                        />
                        <input 
                          className="input-base input-default w-[40%]" 
                          placeholder="상세주소"
                          value={employeeData?.HOME_DET_ADDR || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            // 상세주소: 100바이트 제한 (한글 포함)
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

        {/* 프로젝트 정보 */}
        <div className="w-1/2">
          <div className="font-semibold mb-1 pl-1">프로젝트 정보</div>
          <div className="clearbox-div">
            <table className="clear-table">
              <tbody>
                <tr className="clear-tr">
                  <th className="clear-th">기준 정보</th>
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
                        학력
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
                        기술자격
                      </label>
                    </div>
                  </td>
                </tr>

                <tr className="clear-tr">
                  <th className="clear-th">자격증</th>
                  <td className="clear-td">
                    <select 
                      className="combo-base w-full"
                      value={employeeData?.CTQL_CD || ''}
                      onChange={(e) => handleEmployeeChange('CTQL_CD', e.target.value)}
                    >
                      <option key="ctql-select-default" value="">선택하세요</option>
                      {commonCodes.ctqlCd.map(code => (
                        <option key={code.data} value={code.data}>{code.label}</option>
                      ))}
                    </select>
                  </td>
                  <th className="clear-th">자격증 취득일자</th>
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
                  <th className="clear-th">최초 투입일자</th>
                  <td className="clear-td">
                    <input 
                      type="date" 
                      className="input-base .input-calender" 
                      data-field="fstInDt"
                      value={employeeData?.FST_IN_DT ? employeeData.FST_IN_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                      onChange={(e) => handleEmployeeChange('FST_IN_DT', e.target.value.replace(/-/g, ''))}
                    />
                  </td>
                  <th className="clear-th">최종 철수일자</th>
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
                  <th className="clear-th">입사 전 경력</th>
                  <td className="clear-td">
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        className="input-base input-default !w-[50px] text-right" 
                        placeholder="00" 
                        maxLength={3}
                        onChange={(e) => {
                          const value = e.target.value;
                          // 입사 전 경력 년수: 3바이트 제한 (숫자)
                          const byteLength = new Blob([value]).size;
                          if (byteLength <= 3) {
                            const years = Number(value) || 0;
                            const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                            // AS-IS와 동일한 계산 로직
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
                          // AS-IS MXML 로직과 동일: 경력구분에 따른 분기
                          const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                          const befCarrMonths = carrDivCd === '1' 
                            ? Number(employeeData?.ENTR_BEF_CARR || 0)
                            : Number(employeeData?.ENTR_BEF_CTQL_CARR || 0);
                          // AS-IS와 동일하게 Math.floor 사용
                          return befCarrMonths > 0 ? Math.floor(befCarrMonths / 12) : '';
                        })()}
                      />
                      <span className="m-0">년</span>
                      <input 
                        type="text" 
                        className="input-base input-default !w-[50px] text-right" 
                        placeholder="00" 
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value;
                          // 입사 전 경력 월수: 2바이트 제한 (숫자)
                          const byteLength = new Blob([value]).size;
                          if (byteLength <= 2) {
                            const months = Number(value) || 0;
                            const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                            // AS-IS와 동일한 계산 로직
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
                          // AS-IS MXML 로직과 동일: 경력구분에 따른 분기
                          const carrDivCd = employeeData?.CARR_DIV_CD || '1';
                          const befCarrMonths = carrDivCd === '1' 
                            ? Number(employeeData?.ENTR_BEF_CARR || 0)
                            : Number(employeeData?.ENTR_BEF_CTQL_CARR || 0);
                          // AS-IS와 동일한 계산 로직: nBefCarrMCnt = nBefCarrMCnt - (nBefCarrYCnt*12)
                          const befCarrYears = Math.floor(befCarrMonths / 12);
                          return befCarrMonths > 0 ? befCarrMonths - (befCarrYears * 12) : '';
                        })()}
                      />
                      <span className="m-0">월</span>
                    </div>
                  </td>
                  <th className="clear-th">경력 개월 수</th>
                  <td className="clear-td">
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        className="input-base input-default !w-[50px] text-right" 
                        placeholder="00" 
                        value={(() => {
                          // AS-IS MXML 로직과 동일: 경력개월수를 xx년xxx개월로 표시
                          const carrMonths = Number(employeeData?.CARR_MCNT || 0);
                          // AS-IS와 동일하게 Math.floor 사용
                          return carrMonths > 0 ? Math.floor(carrMonths / 12) : '';
                        })()}
                        readOnly
                      />
                      <span className="m-0">년</span>
                      <input 
                        type="text" 
                        className="input-base input-default !w-[50px] text-right" 
                        placeholder="00" 
                        value={(() => {
                          // AS-IS MXML 로직과 동일: 경력개월수를 xx년xxx개월로 표시
                          const carrMonths = Number(employeeData?.CARR_MCNT || 0);
                          // AS-IS와 동일한 계산 로직: nCarrMCnt = nCarrMCnt - (nCarrYCnt*12)
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
                  <th className="clear-th">계산 기준 일자</th>
                  <td className="clear-td">
                    <input 
                      type="date" 
                      className="input-base .input-calender" 
                      value={employeeData?.CARR_CALC_STND_DT ? employeeData.CARR_CALC_STND_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                      onChange={(e) => handleEmployeeChange('CARR_CALC_STND_DT', e.target.value.replace(/-/g, ''))}
                    />
                  </td>
                  <th className="clear-th">기술등급</th>
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
                          // AS-IS MXML의 onClickBtnCarrCalc 로직과 동일
                          if (!validateInput("CarrCalc")) {
                            return;
                          }
                          setShowCarrCalcPopup(true);
                          // 팝업 열릴 때 body scroll 방지 및 탭 숨김
                          document.body.style.overflow = 'hidden';
                          // 탭 컨테이너 숨김
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
                          // AS-IS MXML의 onClickBtnGrdCHngSrch 로직과 동일
                          if (newFlag) {
                            showToast('신규 입력 시에는 기술등급이력 조회를 할 수 없습니다. 저장 후 조회 하십시요.', 'warning');
                            return;
                          }
                          
                          if (!employeeData?.EMP_NO) {
                            showToast('사원번호가 필요합니다.', 'warning');
                            return;
                          }
                          
                          setShowGradeHistoryPopup(true);
                          // 팝업 열릴 때 body scroll 방지 및 탭 숨김
                          document.body.style.overflow = 'hidden';
                          // 탭 컨테이너 숨김
                          const tabContainer = document.querySelector('.tab-container');
                          if (tabContainer) {
                            (tabContainer as HTMLElement).style.display = 'none';
                          }
                        }}
                      >
                        등급이력조회
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
                        // 비고: 500바이트 제한 (한글 포함)
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
            {/* 안내문구 + 버튼들 */}
            <div className="flex justify-between items-center mt-2 px-1">
              <p className="text-[13px] text-[#00509A]">
                ※ 조회만 가능합니다. 프로젝트 정보 수정은 경영지원본부 인사담당자만 가능합니다.
              </p>
              <div className="flex gap-2">
                <button 
                  className="btn-base btn-delete"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  삭제
                </button>
                <button 
                  className="btn-base btn-etc"
                  onClick={handleNew}
                  disabled={isLoading}
                >
                  신규
                </button>
                <button 
                  className="btn-base btn-act"
                  onClick={handleSave}
                  disabled={isLoading || (!newFlag && (!employeeData?.EMP_NO || employeeData.EMP_NO.trim() === ''))}
                >
                  저장
                </button>
              </div>
            </div>


          </div>
        </div>

      </div>

      {/* 경력계산 팝업 */}
      {showCarrCalcPopup && (
        <PSM1050M00
              employeeData={employeeData}
              newFlag={newFlag}
              onClose={() => {
                setShowCarrCalcPopup(false);
                // 팝업 닫힐 때 body scroll 복원 및 탭 표시
                document.body.style.overflow = 'auto';
                // 탭 컨테이너 다시 표시
                const tabContainer = document.querySelector('.tab-container');
                if (tabContainer) {
                  (tabContainer as HTMLElement).style.display = 'flex';
                }
              }}
              onConfirm={(data) => {
                // AS-IS MXML의 onBtnConfirmClick 로직과 동일
                
                // 경력계산 결과를 employeeData에 반영
                if (data && employeeData) {
                  const resultData = data.split('^');
                  
                  // AS-IS MXML과 동일한 데이터 매핑
                  // [1]최초투입일자 [2]최종철수일자 [3]입사전경력(년) [4]입사전경력(월) [5]입사후경력(년) [6]입사후경력(월) 
                  // [7]합계(년) [8]합계(월) [9]등급명칭 [10]등급코드 [11]경력기준(학력/기술자격)
                  // [12]자격증코드 [13]자격취득일자 [14]학력경력개월수 [15]자격경력개월수 [16]경력계산기준일
                  // [17]입사전학력경력개월수 [18]입사전자격경력개월수 [19]입사후학력경력개월수 [20]입사후자격경력개월수
                  const updatedEmployeeData = {
                    ...employeeData,
                    FST_IN_DT: resultData[1] || employeeData.FST_IN_DT,
                    LAST_END_DT: resultData[2] || employeeData.LAST_END_DT,
                    // 자격증 정보
                    CTQL_CD: resultData[12] || employeeData.CTQL_CD,
                    CTQL_PUR_DT: resultData[13] || employeeData.CTQL_PUR_DT,
                    // 입사전 경력 - 경력구분에 따라 설정
                    ENTR_BEF_CARR: resultData[11] === '1' ? resultData[17] : employeeData.ENTR_BEF_CARR, // 학력기준
                    ENTR_BEF_CTQL_CARR: resultData[11] === '2' ? resultData[18] : employeeData.ENTR_BEF_CTQL_CARR, // 기술자격기준
                    // 입사후 경력
                    ENTR_AFT_ADBG_CARR: resultData[19] || employeeData.ENTR_AFT_ADBG_CARR,
                    ENTR_AFT_CTQL_CARR: resultData[20] || employeeData.ENTR_AFT_CTQL_CARR,
                    // 합계 경력
                    CARR_MCNT: resultData[11] === '1' ? resultData[14] : resultData[15] || employeeData.CARR_MCNT,
                    // 기술등급
                    LAST_TCN_GRD: resultData[9] || employeeData.LAST_TCN_GRD,
                    LAST_TCN_GRD_CD: resultData[10] || employeeData.LAST_TCN_GRD_CD,
                    // 경력구분
                    CARR_DIV_CD: resultData[11] || employeeData.CARR_DIV_CD,
                    // 경력계산기준일
                    CARR_CALC_STND_DT: resultData[16] || new Date().toISOString().slice(0, 10).replace(/-/g, '')
                  };
                  
                  setEmployeeData(updatedEmployeeData);
                  
                  // AS-IS MXML과 동일: 경력개월수 계산 화면으로부터 데이터를 받은 값을 저장
                  setTimeout(() => {
                    saveProjectInputData();
                  }, 0);
                }
                
                setShowCarrCalcPopup(false);
                // 팝업 닫힐 때 body scroll 복원 및 탭 표시
                document.body.style.overflow = 'auto';
                // 탭 컨테이너 다시 표시
                const tabContainer = document.querySelector('.tab-container');
                if (tabContainer) {
                  (tabContainer as HTMLElement).style.display = 'flex';
                }
              }}
            />
      )}

      {/* 등급이력조회 팝업 */}
      {showGradeHistoryPopup && (
        <PSM0030P00
          empNo={employeeData?.EMP_NO}
          onClose={() => {
            setShowGradeHistoryPopup(false);
            // 팝업 닫힐 때 body scroll 복원 및 탭 표시
            document.body.style.overflow = 'auto';
            // 탭 컨테이너 다시 표시
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
            // 기술등급 코드에 해당하는 text 값 찾기
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
