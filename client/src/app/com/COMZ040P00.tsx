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
 * COMZ040P00 - (???¬μλ²νΈκ²?νλ©?
 * 
 * μ£Όμ κΈ°λ₯:
 * - ?¬μλ²νΈ κ²??λ°?? ν
 * - κΆνλ³?μ‘°ν λ²μ ?μ΄
 * - μ§ν?νλ³??ν°λ§?
 * - λΆ?λ³ ?¬μ μ‘°ν
 * 
 * ?°κ? ?μ΄λΈ?
 * - TBL_BSN_NO_INF (?¬μλ²νΈ ?λ³΄)
 * - TBL_BSN_SCDC (?¬μ?μ??
 * - TBL_BSN_PLAN (?¬μκ³ν)
 * - TBL_DEPT (λΆ???λ³΄)
 */

// API URL ?€μ 
const apiUrl =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ040P00`
    : '/api/COMZ040P00';

interface BusinessData {
  bsnNo: string;
  bsnNm: string;
  bizRepnm: string;  // λ°±μ?μ???€μ λ‘??€λ ?λλͺ?
  bizRepid: string;  // λ°±μ?μ???€μ λ‘??€λ ?λλͺ?
  bizRepemail: string;  // λ°±μ?μ???€μ λ‘??€λ ?λλͺ?
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

// λΆ???λ³΄ ???
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

  // AG-Grid μ»¬λΌ ?μ
  const [businessColDefs] = useState<ColDef[]>([
    {
      headerName: '?¬μλ²νΈ',
      field: 'bsnNo',
      width: 120,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnNo',
    },
    {
      headerName: '?¬μλͺ?,
      field: 'bsnNm',
      width: 400,
      flex: 1,
      cellStyle: { textAlign: 'left' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnNm',
    },
    {
      headerName: '?μ?Όμ',
      field: 'bsnStrtDt',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnStrtDt',
    },
    {
      headerName: 'μ’λ£?Όμ',
      field: 'bsnEndDt',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnEndDt',
    },
    {
      headerName: '?μλΆ??,
      field: 'pplsDeptNm',
      width: 120,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'pplsDeptNm',
    },
    {
      headerName: '?μ???,
      field: 'bizRepnm',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      valueGetter: (params) => params.data?.bizRepnm || 'λ―Έμ???,
      tooltipField: 'bizRepnm',
    },
    {
      headerName: '?€νλΆ??,
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
      headerName: 'μ§ν?ν',
      field: 'pgrsStDivNm',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'pgrsStDivNm',
    },
  ]);

  const [searchType, setSearchType] = useState(''); // μ΄κΈ°κ°μ λΉ?λ¬Έμ?΄λ‘ ?€μ 
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
  const [planYn, setPlanYn] = useState(false); // ?¬μ?μ°?μ???¬λ?

  // μ§ν?ν μ½λ λ§€ν
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

  // λ³Έλ?λ³?λΆ??λͺ©λ‘ μ‘°ν (κ³΅ν΅ ???¬μ©)
  const deptListData = useDeptByHq(hqDiv);

  // ?λ²κΉμ© λ‘κ·Έ - ?ν λ³κ²??μλ§??€ν
  useEffect(() => {
    if (user) {
      console.log('? ?μ¬ λ³Έλ?:', hqDiv);
      console.log('? λΆ??λͺ©λ‘:', deptListData);
      console.log('? ?¬μ©???λ³΄:', user);
    }
  }, [hqDiv, deptListData, user]);

  // κΆν???°λ₯Έ μ‘°νκ΅¬λΆ ?ν΄???€μ  (?κ±°??setDefalutSrchKb ?¨μ)
  const setDefaultSearchType = () => {
    const authCd = user?.authCd || '';
    const hqDivCd = user?.hqDivCd || '';
    const deptTp = user?.deptTp || '';

    console.log('? κΆν:', authCd);
    console.log('? λ³Έλ?:', hqDivCd);
    console.log('? λΆ?μ ??', deptTp);

    let newSearchType = '0'; // κΈ°λ³Έκ°?

    if (authCd === '00') { // λ³Έλ????μ ?΄μ
      newSearchType = '0';
    } else if (authCd === '10') { // λΆ?μ₯
      if (hqDivCd === '02' || deptTp === 'BIZ') { // ?μλ³Έλ?
        newSearchType = '1';
      } else if (hqDivCd === '03' || hqDivCd === '04') { // ?λΉ?€μ¬?λ³ΈλΆ, κ°λ°λ³Έλ?
        newSearchType = '2';
      } else {
        newSearchType = '0';
      }
    } else if (authCd === '20') { // ?μ???
      newSearchType = '1';
    } else if (authCd === '30') { // PM
      newSearchType = '2'; // ?κ±°?μ? ?μΌ?κ² PM? κΈ°λ³Έ?μΌλ‘??€νλΆ??
    } else {
      // κΆνμ½λκ° ?κ±°???????λ κ²½μ°
      if (hqDivCd === '01' || deptTp === 'ADM') { // κ²½μμ§?λ³ΈλΆ
        newSearchType = '0';
      } else {
        newSearchType = '0'; // κΈ°λ³Έκ°μΌλ‘?'?μ²΄' ?€μ 
      }
    }

    console.log('? ?€μ ??μ‘°νκ΅¬λΆ:', newSearchType);
    setSearchType(newSearchType);
    
    handleSearchTypeChange(newSearchType); // ?λ‘??κ°μΌλ‘?μ§μ  ?ΈμΆ
  };

  // μ»΄ν¬?νΈ λ§μ΄????κΆν???°λ₯Έ κΈ°λ³Έκ°??€μ  (μ΄κΈ° ?°μ΄??λ‘λ? λΆλ¦¬)
  useEffect(() => {
    if (user) {
      console.log('? useEffect - ?¬μ©???λ³΄ λ‘λ??', user);
      setDefaultSearchType();
    }
  }, [user]);

  // κΆν ?€μ  ?λ£ ??μ΄κΈ° κ²???€ν
  useEffect(() => {
    if (user && searchType !== '') {
      console.log('? κΆν ?€μ  ?λ£ - μ΄κΈ° κ²???€ν');
      console.log('? κ²?????', searchType);
      console.log('? ?¬μ©???λ³΄:', user);
      setProgressStateByType(''); // κΈ°λ³Έ μ§ν?ν ?€μ 
            handleSearch();
    }
  }, [searchType, user]);

  // κ³΅ν΅ μ½λ ?λ¬ μ²λ¦¬
  useEffect(() => {
    if (codesError) {
      showToast(codesError, 'error');
    }
  }, [codesError, showToast]);

  // μ§ν?ν ?€μ  (?κ±°??setPgrsSt ?¨μ)
  const setProgressStateByType = (val: string) => {
    if (val === 'plan') { // ?¬μ?μ°?μ??
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
      // ?κ±°?μ? ?μΌ?κ² ? κ·, ?μμ§νλ§?μ²΄ν¬ κ°??
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
    } else if (val === 'rsts') { // ?¬μ?μ ?μ??
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
      // ?κ±°?μ? ?μΌ?κ² ?μ£Ό?μ , κ³μ½, ?λ£λ§?μ²΄ν¬ κ°??
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
    } else if (val === 'pplct') { // ?λ¬΄μΆμ§λΉ?
      setPlanYn(false);
      const authCd = user?.authCd || '';
      const hqDivCd = user?.hqDivCd || '';
      const deptTp = user?.deptTp || '';

      if (hqDivCd === '02' || authCd === '00' || deptTp === 'BIZ') {
        // ?μλ³Έλ? ?λ λ³Έλ????΄μ
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
        // ?μλ³Έλ?? λ³Έλ??₯μ΄?μ΄ ?λλ©??μ£Ό?μ ???¬μλ¦¬μ€?Έλ§ μ‘°ν κ°??
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

  // ? ν κΆν μ²΄ν¬ (?κ±°??chkAuthListSelect ?¨μ)
  const checkAuthListSelect = (item: BusinessData): boolean => {
    const authCd = user?.authCd || '';
    const userName = user?.name || '';

    // PM??κ²½μ°?λ ?μ ???¬μλ§?? ν?????λ€
    if (authCd === '30') {
      if (userName !== item.pmNm) {
        showToast(`?΄λΉ ?¬μ??PM???λ?λ€. ? ν?????μ΅?λ€.`, 'warning');
        return false;
      }
    }
    return true;
  };

  // λͺ¨λ? ν μ²΄ν¬λ°μ€ μ²λ¦¬ (?κ±°??onChangeAll ?¨μ)
  const handleAllProgressChange = (checked: boolean) => {
    console.log('? ?μ²΄ μ²΄ν¬λ°μ€ ?΄λ¦­:', checked);
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

  // κ°λ³ μ§ν?ν μ²΄ν¬λ°μ€ μ²λ¦¬ (?κ±°??onChangePrgsSt ?¨μ)
  const handleProgressChange = (key: string, checked: boolean) => {
    console.log('? κ°λ³ μ²΄ν¬λ°μ€ ?΄λ¦­:', key, checked);
    setProgressStates(prev => ({
      ...prev,
      [key]: checked,
      // κ°λ³ μ²΄ν¬λ°μ€ ?΄μ  ???μ²΄ ? ν???΄μ  (?κ±°?μ? ?μΌ)
      all: checked ? prev.all : false
    }));
  };

  // μ‘°νκ΅¬λΆ λ³κ²?μ²λ¦¬ (?κ±°??onRdPplsExecDivChange ?¨μ)
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

  // λ³Έλ? λ³κ²?μ²λ¦¬ (?κ±°??onHqDivChange ?¨μ)
  const handleHqChange = (value: string) => {
    setHqDiv(value);
    setDeptDiv('ALL'); // ?κ±°?μ? ?μΌ?κ² λ³Έλ? λ³κ²???λΆ?λ 'ALL'λ‘?λ¦¬μ
  };

  // κ²???€ν
  const handleSearch = async () => {
    if (!user) {
      showToast('?¬μ©???λ³΄λ₯?μ°Ύμ ???μ΅?λ€.', 'error');
      return;
    }

    console.log('? κ²???μ');
    console.log('? ?μ¬ ?ν:', {
      searchType,
      hqDiv,
      deptDiv,
      userNm,
      bsnNo,
      bsnYear,
      progressStates
    });

    // κ²??μ‘°κ±΄ ? ν¨??κ²??
    if (searchType === '') {
      console.log('? οΈ κ²????μ΄ ?€μ ?μ? ?μ');
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
        userNm: userNm || 'ALL', // ?λ‘?μ? λ‘μ§??λ§μΆ° 'ALL' ?¬μ©
        loginId: user.userId || user.empNo || ''
      };

      console.log('?€ κ²???μ²­:', searchParams);

      const response = await fetch(`${apiUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error(`κ²???€ν¨: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setBusinessList(result.data || []);
        if (result.data && result.data.length === 0) {
          showToast('μ‘°ν κ²°κ³Όκ° ?μ΅?λ€.', 'info');
        } else {
          showToast(`${result.data?.length || 0}κ±΄μ ?¬μ??μ‘°ν?μ?΅λ??`, 'info');
        }
      } else {
        showToast(result.message || 'μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.', 'error');
      }
    } catch (error) {
      console.error('κ²???€λ₯:', error);
      setError(error instanceof Error ? error.message : 'μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.');
      showToast('μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ???΄λ¦­ μ²λ¦¬
  const handleRowClick = (item: BusinessData) => {
    setSelectedBusiness(item);
  }

  // AG-Grid ? ν ?΄λ²€??
  const onBusinessSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const row = selectedRows[0];
      handleRowClick(row);
    } else {
      setSelectedBusiness(null);
    }
  };

  // AG-Grid μ€λΉ??λ£ ?΄λ²€??
  const onBusinessGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  // ?λΈ?΄λ¦­ μ²λ¦¬
  const handleDoubleClick = (item: BusinessData) => {
    // κΆν μ²΄ν¬
    if (!checkAuthListSelect(item)) {
      return;
    }

    if (window.opener) {
      // λΆλͺ¨μ°½???°μ΄???λ¬
      const resultData = {
        bsnNo: item.bsnNo,
        bsnDeptKb: item.bsnDeptKb,
        bizRepNm: item.bizRepnm,  // ?€μ  ?λλͺ??¬μ©
        bizRepId: item.bizRepid,  // ?€μ  ?λλͺ??¬μ©
        pmNm: item.pmNm,
        pmId: item.pmId,
        bsnStrtDt: item.bsnStrtDt,
        bsnEndDt: item.bsnEndDt,
        bizRepEmail: item.bizRepemail,  // ?€μ  ?λλͺ??¬μ©
        pplsDeptCd: item.pplsDeptCd,
        execDeptCd: item.execDeptCd,
        bsnNm: item.bsnNm
      };
      
      // λΆλͺ¨μ°½???΄λ²€???λ¬
      window.opener.postMessage({
        type: 'BUSINESS_SELECT',
        data: resultData
      }, '*');
      
      window.close();
    }
  };

  // κ·Έλ¦¬?????€λ³΄???€λΉκ²μ΄??
  const handleRowKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === 'ArrowDown') {
      const nextIdx = idx + 1;
      if (nextIdx < businessList.length) {
        const nextRow = businessList[nextIdx];
        setSelectedBusiness(nextRow);
        // ?€μ ?μ ?¬μ»€???΄λ
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="?¬μλ²νΈ "]')[nextIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'ArrowUp') {
      const prevIdx = idx - 1;
      if (prevIdx >= 0) {
        const prevRow = businessList[prevIdx];
        setSelectedBusiness(prevRow);
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="?¬μλ²νΈ "]')[prevIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'Enter') {
      // ?ν°?€λ‘ ? ν
      const currentRow = businessList[idx];
      if (currentRow) {
        handleDoubleClick(currentRow);
      }
    }
  };

  // ?ν°??μ²λ¦¬
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ? ν¨??μ²΄ν¬ (?κ±°??chkValidation ?¨μ)
  const checkValidation = (): boolean => {
    // ?¬μ?μ°?μ?μΌ κ²½μ°
    if (planYn) {
      if (!progressStates.new && !progressStates.sales) {
        showToast('μ§ν?νλ₯?? ν?μΈ?? (? κ· ?λ ?μμ§ν μ€??λ ?΄μ)', 'warning');
        return false;
      }
    } else {
      // ?¬μ?μ ?μ?μΌ κ²½μ° - ?μ£Ό?μ , κ³μ½, ?λ£ μ€??λ?Όλ ? ν?μ΄????
      if (!progressStates.confirmed && !progressStates.contract && !progressStates.completed) {
        showToast('μ§ν?νλ₯?? ν?μΈ?? (?μ£Ό?μ , κ³μ½, ?λ£ μ€??λ ?΄μ)', 'warning');
        return false;
      }
    }
    return true;
  };

  // ESC ?€λ‘ ?μ ?«κΈ°
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // ?μ²΄ μ²΄ν¬λ°μ€ ?ν ?λ ?λ°?΄νΈ
  useEffect(() => {
    const allIndividualChecked = progressStates.new && 
                                progressStates.sales && 
                                progressStates.confirmed && 
                                progressStates.contract && 
                                progressStates.completed && 
                                progressStates.failed && 
                                progressStates.cancelled;
    
    if (allIndividualChecked !== progressStates.all) {
      console.log('? ?μ²΄ μ²΄ν¬λ°μ€ ?ν ?λ°?΄νΈ:', allIndividualChecked);
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
      {/* ?λ¨ ?€λ */}
      <div className="popup-header">
        <h3 className="popup-title">?¬μλ²νΈκ²??/h3>
        <button 
          className="popup-close" 
          type="button"
          onClick={() => window.close()}
          tabIndex={0}
          aria-label="?«κΈ°"
        >
          Γ
        </button>
      </div>

      <div className="popup-body">
        {/* κ²???μ­ */}
        <div className="search-div">
          <table className="search-table">
            <tbody>
              {/* 1??- μ‘°νκ΅¬λΆ */}
              <tr className="search-tr">
                <th className="search-th w-[110px]">μ‘°νκ΅¬λΆ</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '0'}
                      onChange={() => handleSearchTypeChange('0')}
                    /> ?μ²΄
                  </label>
                  <label className="mr-2">
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '1'}
                      onChange={() => handleSearchTypeChange('1')}
                    /> ?¬μλΆ??
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '2'}
                      onChange={() => handleSearchTypeChange('2')}
                    /> ?€νλΆ??
                  </label>
                </td>
              </tr>

              {/* 2??- λ³Έλ?, μΆμ§λΆ?? ?μ???*/}
              <tr className="search-tr">
                <th className="search-th">λ³Έλ?</th>
                <td className="search-td !w-[150px]">
                  <select 
                    className="combo-base"
                    value={hqDiv}
                    onChange={(e) => handleHqChange(e.target.value)}
                    disabled={searchType === '0' || codesLoading}
                  >
                    <option value="ALL">?μ²΄</option>
                    {hqDivCodes.map((code) => (
                      <option key={code.code} value={code.code}>
                        {code.name}
                      </option>
                    ))}
                  </select>
                </td>
                <th className="search-th w-[110px]">
                  {searchType === '2' ? '?€νλΆ?? : 'μΆμ§λΆ??}
                </th>
                <td className="search-td !w-[150px]">
                  <select 
                    className="combo-base"
                    value={deptDiv}
                    onChange={(e) => setDeptDiv(e.target.value)}
                    disabled={searchType === '0'}
                  >
                    <option value="ALL">?μ²΄</option>
                    {deptListData.map((dept: any) => (
                      <option key={dept.code || dept.deptDivCd} value={dept.code || dept.deptDivCd}>
                        {dept.name || dept.deptNm}
                      </option>
                    ))}
                  </select>
                </td>
                <th className="search-th w-[110px]">
                  {searchType === '2' ? 'PMλͺ? : '?μ???}
                </th>
                <td className="search-td !w-[150px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-[100px]" 
                    value={userNm}
                    onChange={(e) => setUserNm(e.target.value)}
                    disabled={searchType === '0' || (user?.authCd === '40' || (user?.authCd === '30' && user?.dutyDivCd === '4'))}
                    placeholder={user?.authCd === '30' && user?.dutyDivCd === '4' && searchType === '2' ? 'λ³ΈμΈ PM ?¬μλ§?μ‘°ν' : ''}
                  />
                </td>
                <td className="search-td" colSpan={4}></td>
              </tr>

              {/* 3??- μ§ν?ν */}
              <tr className="search-tr">
                <th className="search-th">μ§ν?ν</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.all}
                      onChange={(e) => handleAllProgressChange(e.target.checked)}
                      disabled={!progressEnabled.all}
                    /> (λͺ¨λ? ν)
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.new}
                      onChange={(e) => handleProgressChange('new', e.target.checked)}
                      disabled={!progressEnabled.new}
                    /> ? κ·
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.sales}
                      onChange={(e) => handleProgressChange('sales', e.target.checked)}
                      disabled={!progressEnabled.sales}
                    /> ?μμ§ν
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.confirmed}
                      onChange={(e) => handleProgressChange('confirmed', e.target.checked)}
                      disabled={!progressEnabled.confirmed}
                    /> ?μ£Ό?μ 
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.contract}
                      onChange={(e) => handleProgressChange('contract', e.target.checked)}
                      disabled={!progressEnabled.contract}
                    /> κ³μ½
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.completed}
                      onChange={(e) => handleProgressChange('completed', e.target.checked)}
                      disabled={!progressEnabled.completed}
                    /> ?λ£(μ’κ²°)
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.failed}
                      onChange={(e) => handleProgressChange('failed', e.target.checked)}
                      disabled={!progressEnabled.failed}
                    /> ?μ£Ό?€ν¨
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={progressStates.cancelled}
                      onChange={(e) => handleProgressChange('cancelled', e.target.checked)}
                      disabled={!progressEnabled.cancelled}
                    /> μ·¨μ(?? )
                  </label>
                </td>
              </tr>

              {/* 4??- ?¬μ?λ, ?¬μλ²νΈ, μ‘°νλ²νΌ */}
              <tr className="search-tr">
                <th className="search-th">?¬μ?λ</th>
                <td className="search-td">
                  <select 
                    className="combo-base w-[120px]"
                    value={bsnYear}
                    onChange={(e) => setBsnYear(e.target.value)}
                  >
                    <option value="ALL">?μ²΄</option>
                    <option value="2025">2025??/option>
                    <option value="2024">2024??/option>
                    <option value="2023">2023??/option>
                    <option value="2022">2022??/option>
                    <option value="2021">2021??/option>
                  </select>
                </td>
                <th className="search-th">?¬μλ²νΈ</th>
                <td className="search-td">
                  <input 
                    type="text" 
                    className="input-base input-default w-[120px]" 
                    value={bsnNo}
                    onChange={(e) => setBsnNo(e.target.value)}
                    onKeyDown={handleKeyPress}
                    tabIndex={0}
                    aria-label="?¬μλ²νΈ ?λ ₯"
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
                    aria-label="μ‘°ν"
                  >
                    {loading ? 'μ‘°νμ€?..' : 'μ‘°ν'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ?λ¬ λ©μμ§ */}
        {error && (
          <div className="mt-2">
            <div className="error-message-box">
              <div className="error-message-icon">??/div>
              <div className="error-message-desc">{error}</div>
            </div>
          </div>
        )}

        {/* κ·Έλ¦¬???μ­ */}
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

        {/* μ’λ£ λ²νΌ */}
        <div className="flex justify-end mt-4">
          <button 
            className="btn-base btn-delete"
            onClick={() => window.close()}
            tabIndex={0}
            aria-label="μ’λ£"
          >
            μ’λ£
          </button>
        </div>
      </div>
    </div>
  );
}




