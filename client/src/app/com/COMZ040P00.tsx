'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/app/common/common.css';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { useDeptByHq, DeptByHq } from '@/modules/auth/hooks/useCommonCodes';
import { useCommonCodes } from '@/modules/auth/hooks/useCommonCodes';

/**
 * COMZ040P00 - (팝)사업번호검색화면
 * 
 * 주요 기능:
 * - 사업번호 검색 및 선택
 * - 권한별 조회 범위 제어
 * - 진행상태별 필터링
 * - 부서별 사업 조회
 * 
 * 연관 테이블:
 * - TBL_BSN_NO_INF (사업번호 정보)
 * - TBL_BSN_SCDC (사업품의서)
 * - TBL_BSN_PLAN (사업계획)
 * - TBL_DEPT (부서 정보)
 */

// API URL 설정
const apiUrl =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ040P00`
    : '/api/COMZ040P00';

interface BusinessData {
  bsnNo: string;
  bsnNm: string;
  bizRepnm: string;  // 백엔드에서 실제로 오는 필드명
  bizRepid: string;  // 백엔드에서 실제로 오는 필드명
  bizRepemail: string;  // 백엔드에서 실제로 오는 필드명
  pmNm: string;
  pmId: string;
  bsnStrtDt: string;
  bsnEndDt: string;
  bsnDeptKb: string;
  pplsDeptNm: string;
  pplsDeptCd: string;
  execDeptNm: string;
  execDeptCd: string;
  pgrsStDiv: string;
  pgrsStDivNm: string;
}

// 부서 정보 타입
interface DeptInfo {
  deptDivCd: string;
  deptNm: string;
  hqDivCd: string;
}

export default function ProjectSearchPopup() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { hqDivCodes, loading: codesLoading, error: codesError } = useCommonCodes();
  
  // AG-Grid ref
  const businessGridRef = useRef<AgGridReact<BusinessData>>(null);

  // AG-Grid 컬럼 정의
  const [businessColDefs] = useState<ColDef[]>([
    {
      headerName: '사업번호',
      field: 'bsnNo',
      width: 120,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnNo',
    },
    {
      headerName: '사업명',
      field: 'bsnNm',
      width: 400,
      flex: 1,
      cellStyle: { textAlign: 'left' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnNm',
    },
    {
      headerName: '시작일자',
      field: 'bsnStrtDt',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnStrtDt',
    },
    {
      headerName: '종료일자',
      field: 'bsnEndDt',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnEndDt',
    },
    {
      headerName: '영업부서',
      field: 'pplsDeptNm',
      width: 120,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'pplsDeptNm',
    },
    {
      headerName: '영업대표',
      field: 'bizRepnm',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      valueGetter: (params) => params.data?.bizRepnm || '미지정',
      tooltipField: 'bizRepnm',
    },
    {
      headerName: '실행부서',
      field: 'execDeptNm',
      width: 120,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'execDeptNm',
    },
    {
      headerName: 'PM',
      field: 'pmNm',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'pmNm',
    },
    {
      headerName: '진행상태',
      field: 'pgrsStDivNm',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'pgrsStDivNm',
    },
  ]);

  const [searchType, setSearchType] = useState(''); // 초기값을 빈 문자열로 설정
  const [hqDiv, setHqDiv] = useState('ALL');
  const [deptDiv, setDeptDiv] = useState('ALL');
  const [userNm, setUserNm] = useState('');
  const [progressStates, setProgressStates] = useState({
    all: true,
    new: true,
    sales: true,
    confirmed: true,
    contract: true,
    completed: true,
    failed: true,
    cancelled: true
  });
  const [progressEnabled, setProgressEnabled] = useState({
    all: true,
    new: true,
    sales: true,
    confirmed: true,
    contract: true,
    completed: true,
    failed: true,
    cancelled: true
  });
  const [bsnYear, setBsnYear] = useState('ALL');
  const [bsnNo, setBsnNo] = useState('');
  const [businessList, setBusinessList] = useState<BusinessData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessData | null>(null);
  const [planYn, setPlanYn] = useState(false); // 사업예산품의서 여부

  // 진행상태 코드 매핑
  const getProgressStateCode = () => {
    let codes = [];
    if (progressStates.new) codes.push('1');
    if (progressStates.sales) codes.push('2');
    if (progressStates.confirmed) codes.push('3');
    if (progressStates.contract) codes.push('4');
    if (progressStates.completed) codes.push('8');
    if (progressStates.failed) codes.push('7');
    if (progressStates.cancelled) codes.push('9');
    return codes.join(',');
  };

  // 본부별 부서 목록 조회 (공통 훅 사용)
  const deptListData = useDeptByHq(hqDiv);

  // 디버깅용 로그 - 상태 변경 시에만 실행
  useEffect(() => {
    if (user) {
      console.log('🔍 현재 본부:', hqDiv);
      console.log('🔍 부서 목록:', deptListData);
      console.log('🔍 사용자 정보:', user);
    }
  }, [hqDiv, deptListData, user]);

  // 권한에 따른 조회구분 디폴트 설정 (레거시 setDefalutSrchKb 함수)
  const setDefaultSearchType = () => {
    const authCd = user?.authCd || '';
    const hqDivCd = user?.hqDivCd || '';
    const deptTp = user?.deptTp || '';

    console.log('🔍 권한:', authCd);
    console.log('🔍 본부:', hqDivCd);
    console.log('🔍 부서유형:', deptTp);

    let newSearchType = '0'; // 기본값

    if (authCd === '00') { // 본부장/임원 이상
      newSearchType = '0';
    } else if (authCd === '10') { // 부서장
      if (hqDivCd === '02' || deptTp === 'BIZ') { // 영업본부
        newSearchType = '1';
      } else if (hqDivCd === '03' || hqDivCd === '04') { // 서비스사업본부, 개발본부
        newSearchType = '2';
      } else {
        newSearchType = '0';
      }
    } else if (authCd === '20') { // 영업대표
      newSearchType = '1';
    } else if (authCd === '30') { // PM
      newSearchType = '2'; // 레거시와 동일하게 PM은 기본적으로 실행부서
    } else {
      // 권한코드가 없거나 알 수 없는 경우
      if (hqDivCd === '01' || deptTp === 'ADM') { // 경영지원본부
        newSearchType = '0';
      } else {
        newSearchType = '0'; // 기본값으로 '전체' 설정
      }
    }

    console.log('🔍 설정된 조회구분:', newSearchType);
    setSearchType(newSearchType);
    
    handleSearchTypeChange(newSearchType); // 새로운 값으로 직접 호출
  };

  // 컴포넌트 마운트 시 권한에 따른 기본값 설정 (초기 데이터 로드와 분리)
  useEffect(() => {
    if (user) {
      console.log('🔍 useEffect - 사용자 정보 로드됨:', user);
      setDefaultSearchType();
    }
  }, [user]);

  // 권한 설정 완료 후 초기 검색 실행
  useEffect(() => {
    if (user && searchType !== '') {
      console.log('🔍 권한 설정 완료 - 초기 검색 실행');
      console.log('🔍 검색 타입:', searchType);
      console.log('🔍 사용자 정보:', user);
      setProgressStateByType(''); // 기본 진행상태 설정
            handleSearch();
    }
  }, [searchType, user]);

  // 공통 코드 에러 처리
  useEffect(() => {
    if (codesError) {
      showToast(codesError, 'error');
    }
  }, [codesError, showToast]);

  // 진행상태 설정 (레거시 setPgrsSt 함수)
  const setProgressStateByType = (val: string) => {
    if (val === 'plan') { // 사업예산품의서
      setPlanYn(true);
      setProgressStates({
        all: true,
        new: true,
        sales: true,
        confirmed: false,
        contract: false,
        completed: false,
        failed: false,
        cancelled: false
      });
      // 레거시와 동일하게 신규, 영업진행만 체크 가능
      setProgressEnabled({
        all: true,
        new: true,
        sales: true,
        confirmed: false,
        contract: false,
        completed: false,
        failed: false,
        cancelled: false
      });
    } else if (val === 'rsts') { // 사업확정품의서
      setPlanYn(false);
      setProgressStates({
        all: true,
        new: false,
        sales: false,
        confirmed: true,
        contract: true,
        completed: true,
        failed: false,
        cancelled: false
      });
      // 레거시와 동일하게 수주확정, 계약, 완료만 체크 가능
      setProgressEnabled({
        all: true,
        new: false,
        sales: false,
        confirmed: true,
        contract: true,
        completed: true,
        failed: false,
        cancelled: false
      });
    } else if (val === 'pplct') { // 업무추진비
      setPlanYn(false);
      const authCd = user?.authCd || '';
      const hqDivCd = user?.hqDivCd || '';
      const deptTp = user?.deptTp || '';

      if (hqDivCd === '02' || authCd === '00' || deptTp === 'BIZ') {
        // 영업본부 또는 본부장 이상
        setProgressStates({
          all: true,
          new: true,
          sales: true,
          confirmed: true,
          contract: true,
          completed: false,
          failed: false,
          cancelled: false
        });
        setProgressEnabled({
          all: true,
          new: true,
          sales: true,
          confirmed: true,
          contract: true,
          completed: true,
          failed: false,
          cancelled: false
        });
      } else {
        // 영업본부와 본부장이상이 아니면 수주확정된 사업리스트만 조회 가능
        setProgressStates({
          all: true,
          new: false,
          sales: false,
          confirmed: true,
          contract: true,
          completed: true,
          failed: false,
          cancelled: false
        });
        setProgressEnabled({
          all: true,
          new: false,
          sales: false,
          confirmed: true,
          contract: true,
          completed: true,
          failed: false,
          cancelled: false
        });
      }
    } else {
      setPlanYn(false);
      setProgressStates({
        all: true,
        new: true,
        sales: true,
        confirmed: true,
        contract: true,
        completed: true,
        failed: true,
        cancelled: true
      });
      setProgressEnabled({
        all: true,
        new: true,
        sales: true,
        confirmed: true,
        contract: true,
        completed: true,
        failed: true,
        cancelled: true
      });
    }
  };

  // 선택 권한 체크 (레거시 chkAuthListSelect 함수)
  const checkAuthListSelect = (item: BusinessData): boolean => {
    const authCd = user?.authCd || '';
    const userName = user?.name || '';

    // PM인 경우에는 자신의 사업만 선택할 수 있다
    if (authCd === '30') {
      if (userName !== item.pmNm) {
        showToast(`해당 사업의 PM이 아닙니다. 선택할 수 없습니다.`, 'warning');
        return false;
      }
    }
    return true;
  };

  // 모두선택 체크박스 처리 (레거시 onChangeAll 함수)
  const handleAllProgressChange = (checked: boolean) => {
    console.log('🔄 전체 체크박스 클릭:', checked);
    setProgressStates(prev => ({
      ...prev,
      all: checked,
      new: progressEnabled.new ? checked : prev.new,
      sales: progressEnabled.sales ? checked : prev.sales,
      confirmed: progressEnabled.confirmed ? checked : prev.confirmed,
      contract: progressEnabled.contract ? checked : prev.contract,
      completed: progressEnabled.completed ? checked : prev.completed,
      failed: progressEnabled.failed ? checked : prev.failed,
      cancelled: progressEnabled.cancelled ? checked : prev.cancelled
    }));
  };

  // 개별 진행상태 체크박스 처리 (레거시 onChangePrgsSt 함수)
  const handleProgressChange = (key: string, checked: boolean) => {
    console.log('🔄 개별 체크박스 클릭:', key, checked);
    setProgressStates(prev => ({
      ...prev,
      [key]: checked,
      // 개별 체크박스 해제 시 전체 선택도 해제 (레거시와 동일)
      all: checked ? prev.all : false
    }));
  };

  // 조회구분 변경 처리 (레거시 onRdPplsExecDivChange 함수)
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    
    if (value === '0') {
      setHqDiv('ALL');
      setDeptDiv('ALL');
      const authCd = user?.authCd || '';
      const dutyDivCd = user?.dutyDivCd || '';
      if (authCd === '40' || (authCd === '30' && dutyDivCd === '4')) {
        setUserNm(user?.name || '');
      } else {
        setUserNm('');
      }
    } else if (value === '1' || value === '2') {
      setHqDiv(user?.hqDivCd || '');
      const authCd = user?.authCd || '';
      const hqDivCd = user?.hqDivCd || '';
      const deptTp = user?.deptTp || '';
      
      if (hqDivCd === '02' || deptTp === 'BIZ') {
        setDeptDiv(user?.deptDivCd || '');
        setUserNm(authCd === '00' ? '' : (user?.name || ''));
      } else {
        setDeptDiv('ALL');
        setUserNm((authCd === '00' || authCd === '10') ? '' : (user?.name || ''));
      }
    } else {
      setHqDiv('');
      setDeptDiv('');
      setUserNm('');
    }
  };

  // 본부 변경 처리 (레거시 onHqDivChange 함수)
  const handleHqChange = (value: string) => {
    setHqDiv(value);
    setDeptDiv('ALL'); // 레거시와 동일하게 본부 변경 시 부서는 'ALL'로 리셋
  };

  // 검색 실행
  const handleSearch = async () => {
    if (!user) {
      showToast('사용자 정보를 찾을 수 없습니다.', 'error');
      return;
    }

    console.log('🔍 검색 시작');
    console.log('🔍 현재 상태:', {
      searchType,
      hqDiv,
      deptDiv,
      userNm,
      bsnNo,
      bsnYear,
      progressStates
    });

    // 검색 조건 유효성 검사
    if (searchType === '') {
      console.log('⚠️ 검색 타입이 설정되지 않음');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = {
        bsnNo: bsnNo || '',
        startYear: bsnYear || 'ALL',
        progressStateDiv: getProgressStateCode(),
        searchDiv: searchType,
        hqCd: hqDiv,
        deptCd: deptDiv,
        userNm: userNm || 'ALL', // 프로시저 로직에 맞춰 'ALL' 사용
        loginId: user.userId || user.empNo || ''
      };

      console.log('📤 검색 요청:', searchParams);

      const response = await fetch(`${apiUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error(`검색 실패: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setBusinessList(result.data || []);
        if (result.data && result.data.length === 0) {
          showToast('조회 결과가 없습니다.', 'info');
        } else {
          showToast(`${result.data?.length || 0}건의 사업이 조회되었습니다.`, 'info');
        }
      } else {
        showToast(result.message || '조회 중 오류가 발생했습니다.', 'error');
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setError(error instanceof Error ? error.message : '조회 중 오류가 발생했습니다.');
      showToast('조회 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 행 클릭 처리
  const handleRowClick = (item: BusinessData) => {
    setSelectedBusiness(item);
  }

  // AG-Grid 선택 이벤트
  const onBusinessSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const row = selectedRows[0];
      handleRowClick(row);
    } else {
      setSelectedBusiness(null);
    }
  };

  // AG-Grid 준비 완료 이벤트
  const onBusinessGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  // 더블클릭 처리
  const handleDoubleClick = (item: BusinessData) => {
    // 권한 체크
    if (!checkAuthListSelect(item)) {
      return;
    }

    if (window.opener) {
      // 부모창에 데이터 전달
      const resultData = {
        bsnNo: item.bsnNo,
        bsnDeptKb: item.bsnDeptKb,
        bizRepNm: item.bizRepnm,  // 실제 필드명 사용
        bizRepId: item.bizRepid,  // 실제 필드명 사용
        pmNm: item.pmNm,
        pmId: item.pmId,
        bsnStrtDt: item.bsnStrtDt,
        bsnEndDt: item.bsnEndDt,
        bizRepEmail: item.bizRepemail,  // 실제 필드명 사용
        pplsDeptCd: item.pplsDeptCd,
        execDeptCd: item.execDeptCd,
        bsnNm: item.bsnNm
      };
      
      // 부모창에 이벤트 전달
      window.opener.postMessage({
        type: 'BUSINESS_SELECT',
        data: resultData
      }, '*');
      
      window.close();
    }
  };

  // 그리드 행 키보드 네비게이션
  const handleRowKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === 'ArrowDown') {
      const nextIdx = idx + 1;
      if (nextIdx < businessList.length) {
        const nextRow = businessList[nextIdx];
        setSelectedBusiness(nextRow);
        // 다음 행에 포커스 이동
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="사업번호 "]')[nextIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'ArrowUp') {
      const prevIdx = idx - 1;
      if (prevIdx >= 0) {
        const prevRow = businessList[prevIdx];
        setSelectedBusiness(prevRow);
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="사업번호 "]')[prevIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'Enter') {
      // 엔터키로 선택
      const currentRow = businessList[idx];
      if (currentRow) {
        handleDoubleClick(currentRow);
      }
    }
  };

  // 엔터키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 유효성 체크 (레거시 chkValidation 함수)
  const checkValidation = (): boolean => {
    // 사업예산품의서일 경우
    if (planYn) {
      if (!progressStates.new && !progressStates.sales) {
        showToast('진행상태를 선택하세요. (신규 또는 영업진행 중 하나 이상)', 'warning');
        return false;
      }
    } else {
      // 사업확정품의서일 경우 - 수주확정, 계약, 완료 중 하나라도 선택되어야 함
      if (!progressStates.confirmed && !progressStates.contract && !progressStates.completed) {
        showToast('진행상태를 선택하세요. (수주확정, 계약, 완료 중 하나 이상)', 'warning');
        return false;
      }
    }
    return true;
  };

  // ESC 키로 팝업 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // 전체 체크박스 상태 자동 업데이트
  useEffect(() => {
    const allIndividualChecked = progressStates.new && 
                                progressStates.sales && 
                                progressStates.confirmed && 
                                progressStates.contract && 
                                progressStates.completed && 
                                progressStates.failed && 
                                progressStates.cancelled;
    
    if (allIndividualChecked !== progressStates.all) {
      console.log('🔄 전체 체크박스 상태 업데이트:', allIndividualChecked);
      setProgressStates(prev => ({
        ...prev,
        all: allIndividualChecked
      }));
    }
  }, [progressStates.new, progressStates.sales, progressStates.confirmed, 
      progressStates.contract, progressStates.completed, progressStates.failed, 
      progressStates.cancelled]);

  return (
    <div className="popup-wrapper">
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">사업번호검색</h3>
        <button 
          className="popup-close" 
          type="button"
          onClick={() => window.close()}
          tabIndex={0}
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      <div className="popup-body">
        {/* 검색 영역 */}
        <div className="search-div">
          <table className="search-table">
            <tbody>
              {/* 1행 - 조회구분 */}
              <tr className="search-tr">
                <th className="search-th w-[110px]">조회구분</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '0'}
                      onChange={() => handleSearchTypeChange('0')}
                    /> 전체
                  </label>
                  <label className="mr-2">
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '1'}
                      onChange={() => handleSearchTypeChange('1')}
                    /> 사업부서
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '2'}
                      onChange={() => handleSearchTypeChange('2')}
                    /> 실행부서
                  </label>
                </td>
              </tr>

              {/* 2행 - 본부, 추진부서, 영업대표 */}
              <tr className="search-tr">
                <th className="search-th">본부</th>
                <td className="search-td !w-[150px]">
                  <select 
                    className="combo-base"
                    value={hqDiv}
                    onChange={(e) => handleHqChange(e.target.value)}
                    disabled={searchType === '0' || codesLoading}
                  >
                    <option value="ALL">전체</option>
                    {hqDivCodes.map((code) => (
                      <option key={code.code} value={code.code}>
                        {code.name}
                      </option>
                    ))}
                  </select>
                </td>
                <th className="search-th w-[110px]">
                  {searchType === '2' ? '실행부서' : '추진부서'}
                </th>
                <td className="search-td !w-[150px]">
                  <select 
                    className="combo-base"
                    value={deptDiv}
                    onChange={(e) => setDeptDiv(e.target.value)}
                    disabled={searchType === '0'}
                  >
                    <option value="ALL">전체</option>
                    {deptListData.map((dept: any) => (
                      <option key={dept.code || dept.deptDivCd} value={dept.code || dept.deptDivCd}>
                        {dept.name || dept.deptNm}
                      </option>
                    ))}
                  </select>
                </td>
                <th className="search-th w-[110px]">
                  {searchType === '2' ? 'PM명' : '영업대표'}
                </th>
                <td className="search-td !w-[150px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-[100px]" 
                    value={userNm}
                    onChange={(e) => setUserNm(e.target.value)}
                    disabled={searchType === '0' || (user?.authCd === '40' || (user?.authCd === '30' && user?.dutyDivCd === '4'))}
                    placeholder={user?.authCd === '30' && user?.dutyDivCd === '4' && searchType === '2' ? '본인 PM 사업만 조회' : ''}
                  />
                </td>
                <td className="search-td" colSpan={4}></td>
              </tr>

              {/* 3행 - 진행상태 */}
              <tr className="search-tr">
                <th className="search-th">진행상태</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.all}
                      onChange={(e) => handleAllProgressChange(e.target.checked)}
                      disabled={!progressEnabled.all}
                    /> (모두선택)
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.new}
                      onChange={(e) => handleProgressChange('new', e.target.checked)}
                      disabled={!progressEnabled.new}
                    /> 신규
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.sales}
                      onChange={(e) => handleProgressChange('sales', e.target.checked)}
                      disabled={!progressEnabled.sales}
                    /> 영업진행
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.confirmed}
                      onChange={(e) => handleProgressChange('confirmed', e.target.checked)}
                      disabled={!progressEnabled.confirmed}
                    /> 수주확정
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.contract}
                      onChange={(e) => handleProgressChange('contract', e.target.checked)}
                      disabled={!progressEnabled.contract}
                    /> 계약
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.completed}
                      onChange={(e) => handleProgressChange('completed', e.target.checked)}
                      disabled={!progressEnabled.completed}
                    /> 완료(종결)
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.failed}
                      onChange={(e) => handleProgressChange('failed', e.target.checked)}
                      disabled={!progressEnabled.failed}
                    /> 수주실패
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={progressStates.cancelled}
                      onChange={(e) => handleProgressChange('cancelled', e.target.checked)}
                      disabled={!progressEnabled.cancelled}
                    /> 취소(삭제)
                  </label>
                </td>
              </tr>

              {/* 4행 - 사업년도, 사업번호, 조회버튼 */}
              <tr className="search-tr">
                <th className="search-th">사업년도</th>
                <td className="search-td">
                  <select 
                    className="combo-base w-[120px]"
                    value={bsnYear}
                    onChange={(e) => setBsnYear(e.target.value)}
                  >
                    <option value="ALL">전체</option>
                    <option value="2025">2025년</option>
                    <option value="2024">2024년</option>
                    <option value="2023">2023년</option>
                    <option value="2022">2022년</option>
                    <option value="2021">2021년</option>
                  </select>
                </td>
                <th className="search-th">사업번호</th>
                <td className="search-td">
                  <input 
                    type="text" 
                    className="input-base input-default w-[120px]" 
                    value={bsnNo}
                    onChange={(e) => setBsnNo(e.target.value)}
                    onKeyDown={handleKeyPress}
                    tabIndex={0}
                    aria-label="사업번호 입력"
                  />
                </td>
                <td className="search-td text-right" colSpan={4}>
                  <button 
                    className="btn-base btn-search"
                    onClick={() => {
                      if (checkValidation()) {
                        handleSearch();
                      }
                    }}
                    disabled={loading}
                    tabIndex={0}
                    aria-label="조회"
                  >
                    {loading ? '조회중...' : '조회'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mt-2">
            <div className="error-message-box">
              <div className="error-message-icon">⚠</div>
              <div className="error-message-desc">{error}</div>
            </div>
          </div>
        )}

        {/* 그리드 영역 */}
        <div className='ag-theme-alpine' style={{ height: 400, width: "100%" }}>
			<AgGridReact
				ref={businessGridRef}
				rowData={businessList}
				columnDefs={businessColDefs}
				defaultColDef={{
					resizable: true,
					sortable: true,
				}}
				rowSelection='single'
				onSelectionChanged={onBusinessSelectionChanged}
				onRowDoubleClicked={(event) => {
					handleDoubleClick(event.data);
				}}
				onGridReady={onBusinessGridReady}
				components={{
					agColumnHeader: (props: any) => (
						<div style={{ textAlign: "center", width: "100%" }}>
							{props.displayName}
						</div>
					),
				}}
			/>
		</div>

        {/* 종료 버튼 */}
        <div className="flex justify-end mt-4">
          <button 
            className="btn-base btn-delete"
            onClick={() => window.close()}
            tabIndex={0}
            aria-label="종료"
          >
            종료
          </button>
        </div>
      </div>
    </div>
  );
}


