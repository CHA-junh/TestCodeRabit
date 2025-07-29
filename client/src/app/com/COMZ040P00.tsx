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
 * COMZ040P00 - (???�업번호검?�화�?
 * 
 * 주요 기능:
 * - ?�업번호 검??�??�택
 * - 권한�?조회 범위 ?�어
 * - 진행?�태�??�터�?
 * - 부?�별 ?�업 조회
 * 
 * ?��? ?�이�?
 * - TBL_BSN_NO_INF (?�업번호 ?�보)
 * - TBL_BSN_SCDC (?�업?�의??
 * - TBL_BSN_PLAN (?�업계획)
 * - TBL_DEPT (부???�보)
 */

// API URL ?�정
const apiUrl =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ040P00`
    : '/api/COMZ040P00';

interface BusinessData {
  bsnNo: string;
  bsnNm: string;
  bizRepnm: string;  // 백엔?�에???�제�??�는 ?�드�?
  bizRepid: string;  // 백엔?�에???�제�??�는 ?�드�?
  bizRepemail: string;  // 백엔?�에???�제�??�는 ?�드�?
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

// 부???�보 ?�??
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

  // AG-Grid 컬럼 ?�의
  const [businessColDefs] = useState<ColDef[]>([
    {
      headerName: '?�업번호',
      field: 'bsnNo',
      width: 120,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnNo',
    },
    {
      headerName: '?�업�?,
      field: 'bsnNm',
      width: 400,
      flex: 1,
      cellStyle: { textAlign: 'left' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnNm',
    },
    {
      headerName: '?�작?�자',
      field: 'bsnStrtDt',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnStrtDt',
    },
    {
      headerName: '종료?�자',
      field: 'bsnEndDt',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnEndDt',
    },
    {
      headerName: '?�업부??,
      field: 'pplsDeptNm',
      width: 120,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'pplsDeptNm',
    },
    {
      headerName: '?�업?�??,
      field: 'bizRepnm',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      valueGetter: (params) => params.data?.bizRepnm || '미�???,
      tooltipField: 'bizRepnm',
    },
    {
      headerName: '?�행부??,
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
      headerName: '진행?�태',
      field: 'pgrsStDivNm',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'pgrsStDivNm',
    },
  ]);

  const [searchType, setSearchType] = useState(''); // 초기값을 �?문자?�로 ?�정
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
  const [planYn, setPlanYn] = useState(false); // ?�업?�산?�의???��?

  // 진행?�태 코드 매핑
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

  // 본�?�?부??목록 조회 (공통 ???�용)
  const deptListData = useDeptByHq(hqDiv);

  // ?�버깅용 로그 - ?�태 변�??�에�??�행
  useEffect(() => {
    if (user) {
      console.log('?�� ?�재 본�?:', hqDiv);
      console.log('?�� 부??목록:', deptListData);
      console.log('?�� ?�용???�보:', user);
    }
  }, [hqDiv, deptListData, user]);

  // 권한???�른 조회구분 ?�폴???�정 (?�거??setDefalutSrchKb ?�수)
  const setDefaultSearchType = () => {
    const authCd = user?.authCd || '';
    const hqDivCd = user?.hqDivCd || '';
    const deptTp = user?.deptTp || '';

    console.log('?�� 권한:', authCd);
    console.log('?�� 본�?:', hqDivCd);
    console.log('?�� 부?�유??', deptTp);

    let newSearchType = '0'; // 기본�?

    if (authCd === '00') { // 본�????�원 ?�상
      newSearchType = '0';
    } else if (authCd === '10') { // 부?�장
      if (hqDivCd === '02' || deptTp === 'BIZ') { // ?�업본�?
        newSearchType = '1';
      } else if (hqDivCd === '03' || hqDivCd === '04') { // ?�비?�사?�본부, 개발본�?
        newSearchType = '2';
      } else {
        newSearchType = '0';
      }
    } else if (authCd === '20') { // ?�업?�??
      newSearchType = '1';
    } else if (authCd === '30') { // PM
      newSearchType = '2'; // ?�거?��? ?�일?�게 PM?� 기본?�으�??�행부??
    } else {
      // 권한코드가 ?�거???????�는 경우
      if (hqDivCd === '01' || deptTp === 'ADM') { // 경영지?�본부
        newSearchType = '0';
      } else {
        newSearchType = '0'; // 기본값으�?'?�체' ?�정
      }
    }

    console.log('?�� ?�정??조회구분:', newSearchType);
    setSearchType(newSearchType);
    
    handleSearchTypeChange(newSearchType); // ?�로??값으�?직접 ?�출
  };

  // 컴포?�트 마운????권한???�른 기본�??�정 (초기 ?�이??로드?� 분리)
  useEffect(() => {
    if (user) {
      console.log('?�� useEffect - ?�용???�보 로드??', user);
      setDefaultSearchType();
    }
  }, [user]);

  // 권한 ?�정 ?�료 ??초기 검???�행
  useEffect(() => {
    if (user && searchType !== '') {
      console.log('?�� 권한 ?�정 ?�료 - 초기 검???�행');
      console.log('?�� 검???�??', searchType);
      console.log('?�� ?�용???�보:', user);
      setProgressStateByType(''); // 기본 진행?�태 ?�정
            handleSearch();
    }
  }, [searchType, user]);

  // 공통 코드 ?�러 처리
  useEffect(() => {
    if (codesError) {
      showToast(codesError, 'error');
    }
  }, [codesError, showToast]);

  // 진행?�태 ?�정 (?�거??setPgrsSt ?�수)
  const setProgressStateByType = (val: string) => {
    if (val === 'plan') { // ?�업?�산?�의??
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
      // ?�거?��? ?�일?�게 ?�규, ?�업진행�?체크 가??
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
    } else if (val === 'rsts') { // ?�업?�정?�의??
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
      // ?�거?��? ?�일?�게 ?�주?�정, 계약, ?�료�?체크 가??
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
    } else if (val === 'pplct') { // ?�무추진�?
      setPlanYn(false);
      const authCd = user?.authCd || '';
      const hqDivCd = user?.hqDivCd || '';
      const deptTp = user?.deptTp || '';

      if (hqDivCd === '02' || authCd === '00' || deptTp === 'BIZ') {
        // ?�업본�? ?�는 본�????�상
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
        // ?�업본�??� 본�??�이?�이 ?�니�??�주?�정???�업리스?�만 조회 가??
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

  // ?�택 권한 체크 (?�거??chkAuthListSelect ?�수)
  const checkAuthListSelect = (item: BusinessData): boolean => {
    const authCd = user?.authCd || '';
    const userName = user?.name || '';

    // PM??경우?�는 ?�신???�업�??�택?????�다
    if (authCd === '30') {
      if (userName !== item.pmNm) {
        showToast(`?�당 ?�업??PM???�닙?�다. ?�택?????�습?�다.`, 'warning');
        return false;
      }
    }
    return true;
  };

  // 모두?�택 체크박스 처리 (?�거??onChangeAll ?�수)
  const handleAllProgressChange = (checked: boolean) => {
    console.log('?�� ?�체 체크박스 ?�릭:', checked);
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

  // 개별 진행?�태 체크박스 처리 (?�거??onChangePrgsSt ?�수)
  const handleProgressChange = (key: string, checked: boolean) => {
    console.log('?�� 개별 체크박스 ?�릭:', key, checked);
    setProgressStates(prev => ({
      ...prev,
      [key]: checked,
      // 개별 체크박스 ?�제 ???�체 ?�택???�제 (?�거?��? ?�일)
      all: checked ? prev.all : false
    }));
  };

  // 조회구분 변�?처리 (?�거??onRdPplsExecDivChange ?�수)
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

  // 본�? 변�?처리 (?�거??onHqDivChange ?�수)
  const handleHqChange = (value: string) => {
    setHqDiv(value);
    setDeptDiv('ALL'); // ?�거?��? ?�일?�게 본�? 변�???부?�는 'ALL'�?리셋
  };

  // 검???�행
  const handleSearch = async () => {
    if (!user) {
      showToast('?�용???�보�?찾을 ???�습?�다.', 'error');
      return;
    }

    console.log('?�� 검???�작');
    console.log('?�� ?�재 ?�태:', {
      searchType,
      hqDiv,
      deptDiv,
      userNm,
      bsnNo,
      bsnYear,
      progressStates
    });

    // 검??조건 ?�효??검??
    if (searchType === '') {
      console.log('?�️ 검???�?�이 ?�정?��? ?�음');
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
        userNm: userNm || 'ALL', // ?�로?��? 로직??맞춰 'ALL' ?�용
        loginId: user.userId || user.empNo || ''
      };

      console.log('?�� 검???�청:', searchParams);

      const response = await fetch(`${apiUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error(`검???�패: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setBusinessList(result.data || []);
        if (result.data && result.data.length === 0) {
          showToast('조회 결과가 ?�습?�다.', 'info');
        } else {
          showToast(`${result.data?.length || 0}건의 ?�업??조회?�었?�니??`, 'info');
        }
      } else {
        showToast(result.message || '조회 �??�류가 발생?�습?�다.', 'error');
      }
    } catch (error) {
      console.error('검???�류:', error);
      setError(error instanceof Error ? error.message : '조회 �??�류가 발생?�습?�다.');
      showToast('조회 �??�류가 발생?�습?�다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ???�릭 처리
  const handleRowClick = (item: BusinessData) => {
    setSelectedBusiness(item);
  }

  // AG-Grid ?�택 ?�벤??
  const onBusinessSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const row = selectedRows[0];
      handleRowClick(row);
    } else {
      setSelectedBusiness(null);
    }
  };

  // AG-Grid 준�??�료 ?�벤??
  const onBusinessGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  // ?�블?�릭 처리
  const handleDoubleClick = (item: BusinessData) => {
    // 권한 체크
    if (!checkAuthListSelect(item)) {
      return;
    }

    if (window.opener) {
      // 부모창???�이???�달
      const resultData = {
        bsnNo: item.bsnNo,
        bsnDeptKb: item.bsnDeptKb,
        bizRepNm: item.bizRepnm,  // ?�제 ?�드�??�용
        bizRepId: item.bizRepid,  // ?�제 ?�드�??�용
        pmNm: item.pmNm,
        pmId: item.pmId,
        bsnStrtDt: item.bsnStrtDt,
        bsnEndDt: item.bsnEndDt,
        bizRepEmail: item.bizRepemail,  // ?�제 ?�드�??�용
        pplsDeptCd: item.pplsDeptCd,
        execDeptCd: item.execDeptCd,
        bsnNm: item.bsnNm
      };
      
      // 부모창???�벤???�달
      window.opener.postMessage({
        type: 'BUSINESS_SELECT',
        data: resultData
      }, '*');
      
      window.close();
    }
  };

  // 그리?????�보???�비게이??
  const handleRowKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === 'ArrowDown') {
      const nextIdx = idx + 1;
      if (nextIdx < businessList.length) {
        const nextRow = businessList[nextIdx];
        setSelectedBusiness(nextRow);
        // ?�음 ?�에 ?�커???�동
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="?�업번호 "]')[nextIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'ArrowUp') {
      const prevIdx = idx - 1;
      if (prevIdx >= 0) {
        const prevRow = businessList[prevIdx];
        setSelectedBusiness(prevRow);
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="?�업번호 "]')[prevIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'Enter') {
      // ?�터?�로 ?�택
      const currentRow = businessList[idx];
      if (currentRow) {
        handleDoubleClick(currentRow);
      }
    }
  };

  // ?�터??처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ?�효??체크 (?�거??chkValidation ?�수)
  const checkValidation = (): boolean => {
    // ?�업?�산?�의?�일 경우
    if (planYn) {
      if (!progressStates.new && !progressStates.sales) {
        showToast('진행?�태�??�택?�세?? (?�규 ?�는 ?�업진행 �??�나 ?�상)', 'warning');
        return false;
      }
    } else {
      // ?�업?�정?�의?�일 경우 - ?�주?�정, 계약, ?�료 �??�나?�도 ?�택?�어????
      if (!progressStates.confirmed && !progressStates.contract && !progressStates.completed) {
        showToast('진행?�태�??�택?�세?? (?�주?�정, 계약, ?�료 �??�나 ?�상)', 'warning');
        return false;
      }
    }
    return true;
  };

  // ESC ?�로 ?�업 ?�기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // ?�체 체크박스 ?�태 ?�동 ?�데?�트
  useEffect(() => {
    const allIndividualChecked = progressStates.new && 
                                progressStates.sales && 
                                progressStates.confirmed && 
                                progressStates.contract && 
                                progressStates.completed && 
                                progressStates.failed && 
                                progressStates.cancelled;
    
    if (allIndividualChecked !== progressStates.all) {
      console.log('?�� ?�체 체크박스 ?�태 ?�데?�트:', allIndividualChecked);
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
      {/* ?�단 ?�더 */}
      <div className="popup-header">
        <h3 className="popup-title">?�업번호검??/h3>
        <button 
          className="popup-close" 
          type="button"
          onClick={() => window.close()}
          tabIndex={0}
          aria-label="?�기"
        >
          ×
        </button>
      </div>

      <div className="popup-body">
        {/* 검???�역 */}
        <div className="search-div">
          <table className="search-table">
            <tbody>
              {/* 1??- 조회구분 */}
              <tr className="search-tr">
                <th className="search-th w-[110px]">조회구분</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '0'}
                      onChange={() => handleSearchTypeChange('0')}
                    /> ?�체
                  </label>
                  <label className="mr-2">
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '1'}
                      onChange={() => handleSearchTypeChange('1')}
                    /> ?�업부??
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '2'}
                      onChange={() => handleSearchTypeChange('2')}
                    /> ?�행부??
                  </label>
                </td>
              </tr>

              {/* 2??- 본�?, 추진부?? ?�업?�??*/}
              <tr className="search-tr">
                <th className="search-th">본�?</th>
                <td className="search-td !w-[150px]">
                  <select 
                    className="combo-base"
                    value={hqDiv}
                    onChange={(e) => handleHqChange(e.target.value)}
                    disabled={searchType === '0' || codesLoading}
                  >
                    <option value="ALL">?�체</option>
                    {hqDivCodes.map((code) => (
                      <option key={code.code} value={code.code}>
                        {code.name}
                      </option>
                    ))}
                  </select>
                </td>
                <th className="search-th w-[110px]">
                  {searchType === '2' ? '?�행부?? : '추진부??}
                </th>
                <td className="search-td !w-[150px]">
                  <select 
                    className="combo-base"
                    value={deptDiv}
                    onChange={(e) => setDeptDiv(e.target.value)}
                    disabled={searchType === '0'}
                  >
                    <option value="ALL">?�체</option>
                    {deptListData.map((dept: any) => (
                      <option key={dept.code || dept.deptDivCd} value={dept.code || dept.deptDivCd}>
                        {dept.name || dept.deptNm}
                      </option>
                    ))}
                  </select>
                </td>
                <th className="search-th w-[110px]">
                  {searchType === '2' ? 'PM�? : '?�업?�??}
                </th>
                <td className="search-td !w-[150px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-[100px]" 
                    value={userNm}
                    onChange={(e) => setUserNm(e.target.value)}
                    disabled={searchType === '0' || (user?.authCd === '40' || (user?.authCd === '30' && user?.dutyDivCd === '4'))}
                    placeholder={user?.authCd === '30' && user?.dutyDivCd === '4' && searchType === '2' ? '본인 PM ?�업�?조회' : ''}
                  />
                </td>
                <td className="search-td" colSpan={4}></td>
              </tr>

              {/* 3??- 진행?�태 */}
              <tr className="search-tr">
                <th className="search-th">진행?�태</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.all}
                      onChange={(e) => handleAllProgressChange(e.target.checked)}
                      disabled={!progressEnabled.all}
                    /> (모두?�택)
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.new}
                      onChange={(e) => handleProgressChange('new', e.target.checked)}
                      disabled={!progressEnabled.new}
                    /> ?�규
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.sales}
                      onChange={(e) => handleProgressChange('sales', e.target.checked)}
                      disabled={!progressEnabled.sales}
                    /> ?�업진행
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.confirmed}
                      onChange={(e) => handleProgressChange('confirmed', e.target.checked)}
                      disabled={!progressEnabled.confirmed}
                    /> ?�주?�정
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
                    /> ?�료(종결)
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.failed}
                      onChange={(e) => handleProgressChange('failed', e.target.checked)}
                      disabled={!progressEnabled.failed}
                    /> ?�주?�패
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={progressStates.cancelled}
                      onChange={(e) => handleProgressChange('cancelled', e.target.checked)}
                      disabled={!progressEnabled.cancelled}
                    /> 취소(??��)
                  </label>
                </td>
              </tr>

              {/* 4??- ?�업?�도, ?�업번호, 조회버튼 */}
              <tr className="search-tr">
                <th className="search-th">?�업?�도</th>
                <td className="search-td">
                  <select 
                    className="combo-base w-[120px]"
                    value={bsnYear}
                    onChange={(e) => setBsnYear(e.target.value)}
                  >
                    <option value="ALL">?�체</option>
                    <option value="2025">2025??/option>
                    <option value="2024">2024??/option>
                    <option value="2023">2023??/option>
                    <option value="2022">2022??/option>
                    <option value="2021">2021??/option>
                  </select>
                </td>
                <th className="search-th">?�업번호</th>
                <td className="search-td">
                  <input 
                    type="text" 
                    className="input-base input-default w-[120px]" 
                    value={bsnNo}
                    onChange={(e) => setBsnNo(e.target.value)}
                    onKeyDown={handleKeyPress}
                    tabIndex={0}
                    aria-label="?�업번호 ?�력"
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
                    {loading ? '조회�?..' : '조회'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ?�러 메시지 */}
        {error && (
          <div className="mt-2">
            <div className="error-message-box">
              <div className="error-message-icon">??/div>
              <div className="error-message-desc">{error}</div>
            </div>
          </div>
        )}

        {/* 그리???�역 */}
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




