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
 * COMZ040P00 - (???¬ì—…ë²ˆí˜¸ê²€?‰í™”ë©?
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ì—…ë²ˆí˜¸ ê²€??ë°?? íƒ
 * - ê¶Œí•œë³?ì¡°íšŒ ë²”ìœ„ ?œì–´
 * - ì§„í–‰?íƒœë³??„í„°ë§?
 * - ë¶€?œë³„ ?¬ì—… ì¡°íšŒ
 * 
 * ?°ê? ?Œì´ë¸?
 * - TBL_BSN_NO_INF (?¬ì—…ë²ˆí˜¸ ?•ë³´)
 * - TBL_BSN_SCDC (?¬ì—…?ˆì˜??
 * - TBL_BSN_PLAN (?¬ì—…ê³„íš)
 * - TBL_DEPT (ë¶€???•ë³´)
 */

// API URL ?¤ì •
const apiUrl =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/COMZ040P00`
    : '/api/COMZ040P00';

interface BusinessData {
  bsnNo: string;
  bsnNm: string;
  bizRepnm: string;  // ë°±ì—”?œì—???¤ì œë¡??¤ëŠ” ?„ë“œëª?
  bizRepid: string;  // ë°±ì—”?œì—???¤ì œë¡??¤ëŠ” ?„ë“œëª?
  bizRepemail: string;  // ë°±ì—”?œì—???¤ì œë¡??¤ëŠ” ?„ë“œëª?
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

// ë¶€???•ë³´ ?€??
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

  // AG-Grid ì»¬ëŸ¼ ?•ì˜
  const [businessColDefs] = useState<ColDef[]>([
    {
      headerName: '?¬ì—…ë²ˆí˜¸',
      field: 'bsnNo',
      width: 120,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnNo',
    },
    {
      headerName: '?¬ì—…ëª?,
      field: 'bsnNm',
      width: 400,
      flex: 1,
      cellStyle: { textAlign: 'left' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnNm',
    },
    {
      headerName: '?œì‘?¼ì',
      field: 'bsnStrtDt',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnStrtDt',
    },
    {
      headerName: 'ì¢…ë£Œ?¼ì',
      field: 'bsnEndDt',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'bsnEndDt',
    },
    {
      headerName: '?ì—…ë¶€??,
      field: 'pplsDeptNm',
      width: 120,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'pplsDeptNm',
    },
    {
      headerName: '?ì—…?€??,
      field: 'bizRepnm',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      valueGetter: (params) => params.data?.bizRepnm || 'ë¯¸ì???,
      tooltipField: 'bizRepnm',
    },
    {
      headerName: '?¤í–‰ë¶€??,
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
      headerName: 'ì§„í–‰?íƒœ',
      field: 'pgrsStDivNm',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'pgrsStDivNm',
    },
  ]);

  const [searchType, setSearchType] = useState(''); // ì´ˆê¸°ê°’ì„ ë¹?ë¬¸ì?´ë¡œ ?¤ì •
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
  const [planYn, setPlanYn] = useState(false); // ?¬ì—…?ˆì‚°?ˆì˜???¬ë?

  // ì§„í–‰?íƒœ ì½”ë“œ ë§¤í•‘
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

  // ë³¸ë?ë³?ë¶€??ëª©ë¡ ì¡°íšŒ (ê³µí†µ ???¬ìš©)
  const deptListData = useDeptByHq(hqDiv);

  // ?”ë²„ê¹…ìš© ë¡œê·¸ - ?íƒœ ë³€ê²??œì—ë§??¤í–‰
  useEffect(() => {
    if (user) {
      console.log('?” ?„ì¬ ë³¸ë?:', hqDiv);
      console.log('?” ë¶€??ëª©ë¡:', deptListData);
      console.log('?” ?¬ìš©???•ë³´:', user);
    }
  }, [hqDiv, deptListData, user]);

  // ê¶Œí•œ???°ë¥¸ ì¡°íšŒêµ¬ë¶„ ?”í´???¤ì • (?ˆê±°??setDefalutSrchKb ?¨ìˆ˜)
  const setDefaultSearchType = () => {
    const authCd = user?.authCd || '';
    const hqDivCd = user?.hqDivCd || '';
    const deptTp = user?.deptTp || '';

    console.log('?” ê¶Œí•œ:', authCd);
    console.log('?” ë³¸ë?:', hqDivCd);
    console.log('?” ë¶€?œìœ ??', deptTp);

    let newSearchType = '0'; // ê¸°ë³¸ê°?

    if (authCd === '00') { // ë³¸ë????„ì› ?´ìƒ
      newSearchType = '0';
    } else if (authCd === '10') { // ë¶€?œì¥
      if (hqDivCd === '02' || deptTp === 'BIZ') { // ?ì—…ë³¸ë?
        newSearchType = '1';
      } else if (hqDivCd === '03' || hqDivCd === '04') { // ?œë¹„?¤ì‚¬?…ë³¸ë¶€, ê°œë°œë³¸ë?
        newSearchType = '2';
      } else {
        newSearchType = '0';
      }
    } else if (authCd === '20') { // ?ì—…?€??
      newSearchType = '1';
    } else if (authCd === '30') { // PM
      newSearchType = '2'; // ?ˆê±°?œì? ?™ì¼?˜ê²Œ PM?€ ê¸°ë³¸?ìœ¼ë¡??¤í–‰ë¶€??
    } else {
      // ê¶Œí•œì½”ë“œê°€ ?†ê±°???????†ëŠ” ê²½ìš°
      if (hqDivCd === '01' || deptTp === 'ADM') { // ê²½ì˜ì§€?ë³¸ë¶€
        newSearchType = '0';
      } else {
        newSearchType = '0'; // ê¸°ë³¸ê°’ìœ¼ë¡?'?„ì²´' ?¤ì •
      }
    }

    console.log('?” ?¤ì •??ì¡°íšŒêµ¬ë¶„:', newSearchType);
    setSearchType(newSearchType);
    
    handleSearchTypeChange(newSearchType); // ?ˆë¡œ??ê°’ìœ¼ë¡?ì§ì ‘ ?¸ì¶œ
  };

  // ì»´í¬?ŒíŠ¸ ë§ˆìš´????ê¶Œí•œ???°ë¥¸ ê¸°ë³¸ê°??¤ì • (ì´ˆê¸° ?°ì´??ë¡œë“œ?€ ë¶„ë¦¬)
  useEffect(() => {
    if (user) {
      console.log('?” useEffect - ?¬ìš©???•ë³´ ë¡œë“œ??', user);
      setDefaultSearchType();
    }
  }, [user]);

  // ê¶Œí•œ ?¤ì • ?„ë£Œ ??ì´ˆê¸° ê²€???¤í–‰
  useEffect(() => {
    if (user && searchType !== '') {
      console.log('?” ê¶Œí•œ ?¤ì • ?„ë£Œ - ì´ˆê¸° ê²€???¤í–‰');
      console.log('?” ê²€???€??', searchType);
      console.log('?” ?¬ìš©???•ë³´:', user);
      setProgressStateByType(''); // ê¸°ë³¸ ì§„í–‰?íƒœ ?¤ì •
            handleSearch();
    }
  }, [searchType, user]);

  // ê³µí†µ ì½”ë“œ ?ëŸ¬ ì²˜ë¦¬
  useEffect(() => {
    if (codesError) {
      showToast(codesError, 'error');
    }
  }, [codesError, showToast]);

  // ì§„í–‰?íƒœ ?¤ì • (?ˆê±°??setPgrsSt ?¨ìˆ˜)
  const setProgressStateByType = (val: string) => {
    if (val === 'plan') { // ?¬ì—…?ˆì‚°?ˆì˜??
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
      // ?ˆê±°?œì? ?™ì¼?˜ê²Œ ? ê·œ, ?ì—…ì§„í–‰ë§?ì²´í¬ ê°€??
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
    } else if (val === 'rsts') { // ?¬ì—…?•ì •?ˆì˜??
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
      // ?ˆê±°?œì? ?™ì¼?˜ê²Œ ?˜ì£¼?•ì •, ê³„ì•½, ?„ë£Œë§?ì²´í¬ ê°€??
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
    } else if (val === 'pplct') { // ?…ë¬´ì¶”ì§„ë¹?
      setPlanYn(false);
      const authCd = user?.authCd || '';
      const hqDivCd = user?.hqDivCd || '';
      const deptTp = user?.deptTp || '';

      if (hqDivCd === '02' || authCd === '00' || deptTp === 'BIZ') {
        // ?ì—…ë³¸ë? ?ëŠ” ë³¸ë????´ìƒ
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
        // ?ì—…ë³¸ë??€ ë³¸ë??¥ì´?ì´ ?„ë‹ˆë©??˜ì£¼?•ì •???¬ì—…ë¦¬ìŠ¤?¸ë§Œ ì¡°íšŒ ê°€??
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

  // ? íƒ ê¶Œí•œ ì²´í¬ (?ˆê±°??chkAuthListSelect ?¨ìˆ˜)
  const checkAuthListSelect = (item: BusinessData): boolean => {
    const authCd = user?.authCd || '';
    const userName = user?.name || '';

    // PM??ê²½ìš°?ëŠ” ?ì‹ ???¬ì—…ë§?? íƒ?????ˆë‹¤
    if (authCd === '30') {
      if (userName !== item.pmNm) {
        showToast(`?´ë‹¹ ?¬ì—…??PM???„ë‹™?ˆë‹¤. ? íƒ?????†ìŠµ?ˆë‹¤.`, 'warning');
        return false;
      }
    }
    return true;
  };

  // ëª¨ë‘? íƒ ì²´í¬ë°•ìŠ¤ ì²˜ë¦¬ (?ˆê±°??onChangeAll ?¨ìˆ˜)
  const handleAllProgressChange = (checked: boolean) => {
    console.log('?”„ ?„ì²´ ì²´í¬ë°•ìŠ¤ ?´ë¦­:', checked);
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

  // ê°œë³„ ì§„í–‰?íƒœ ì²´í¬ë°•ìŠ¤ ì²˜ë¦¬ (?ˆê±°??onChangePrgsSt ?¨ìˆ˜)
  const handleProgressChange = (key: string, checked: boolean) => {
    console.log('?”„ ê°œë³„ ì²´í¬ë°•ìŠ¤ ?´ë¦­:', key, checked);
    setProgressStates(prev => ({
      ...prev,
      [key]: checked,
      // ê°œë³„ ì²´í¬ë°•ìŠ¤ ?´ì œ ???„ì²´ ? íƒ???´ì œ (?ˆê±°?œì? ?™ì¼)
      all: checked ? prev.all : false
    }));
  };

  // ì¡°íšŒêµ¬ë¶„ ë³€ê²?ì²˜ë¦¬ (?ˆê±°??onRdPplsExecDivChange ?¨ìˆ˜)
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

  // ë³¸ë? ë³€ê²?ì²˜ë¦¬ (?ˆê±°??onHqDivChange ?¨ìˆ˜)
  const handleHqChange = (value: string) => {
    setHqDiv(value);
    setDeptDiv('ALL'); // ?ˆê±°?œì? ?™ì¼?˜ê²Œ ë³¸ë? ë³€ê²???ë¶€?œëŠ” 'ALL'ë¡?ë¦¬ì…‹
  };

  // ê²€???¤í–‰
  const handleSearch = async () => {
    if (!user) {
      showToast('?¬ìš©???•ë³´ë¥?ì°¾ì„ ???†ìŠµ?ˆë‹¤.', 'error');
      return;
    }

    console.log('?” ê²€???œì‘');
    console.log('?” ?„ì¬ ?íƒœ:', {
      searchType,
      hqDiv,
      deptDiv,
      userNm,
      bsnNo,
      bsnYear,
      progressStates
    });

    // ê²€??ì¡°ê±´ ? íš¨??ê²€??
    if (searchType === '') {
      console.log('? ï¸ ê²€???€?…ì´ ?¤ì •?˜ì? ?ŠìŒ');
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
        userNm: userNm || 'ALL', // ?„ë¡œ?œì? ë¡œì§??ë§ì¶° 'ALL' ?¬ìš©
        loginId: user.userId || user.empNo || ''
      };

      console.log('?“¤ ê²€???”ì²­:', searchParams);

      const response = await fetch(`${apiUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error(`ê²€???¤íŒ¨: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setBusinessList(result.data || []);
        if (result.data && result.data.length === 0) {
          showToast('ì¡°íšŒ ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.', 'info');
        } else {
          showToast(`${result.data?.length || 0}ê±´ì˜ ?¬ì—…??ì¡°íšŒ?˜ì—ˆ?µë‹ˆ??`, 'info');
        }
      } else {
        showToast(result.message || 'ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
      }
    } catch (error) {
      console.error('ê²€???¤ë¥˜:', error);
      setError(error instanceof Error ? error.message : 'ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.');
      showToast('ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ???´ë¦­ ì²˜ë¦¬
  const handleRowClick = (item: BusinessData) => {
    setSelectedBusiness(item);
  }

  // AG-Grid ? íƒ ?´ë²¤??
  const onBusinessSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const row = selectedRows[0];
      handleRowClick(row);
    } else {
      setSelectedBusiness(null);
    }
  };

  // AG-Grid ì¤€ë¹??„ë£Œ ?´ë²¤??
  const onBusinessGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  // ?”ë¸”?´ë¦­ ì²˜ë¦¬
  const handleDoubleClick = (item: BusinessData) => {
    // ê¶Œí•œ ì²´í¬
    if (!checkAuthListSelect(item)) {
      return;
    }

    if (window.opener) {
      // ë¶€ëª¨ì°½???°ì´???„ë‹¬
      const resultData = {
        bsnNo: item.bsnNo,
        bsnDeptKb: item.bsnDeptKb,
        bizRepNm: item.bizRepnm,  // ?¤ì œ ?„ë“œëª??¬ìš©
        bizRepId: item.bizRepid,  // ?¤ì œ ?„ë“œëª??¬ìš©
        pmNm: item.pmNm,
        pmId: item.pmId,
        bsnStrtDt: item.bsnStrtDt,
        bsnEndDt: item.bsnEndDt,
        bizRepEmail: item.bizRepemail,  // ?¤ì œ ?„ë“œëª??¬ìš©
        pplsDeptCd: item.pplsDeptCd,
        execDeptCd: item.execDeptCd,
        bsnNm: item.bsnNm
      };
      
      // ë¶€ëª¨ì°½???´ë²¤???„ë‹¬
      window.opener.postMessage({
        type: 'BUSINESS_SELECT',
        data: resultData
      }, '*');
      
      window.close();
    }
  };

  // ê·¸ë¦¬?????¤ë³´???¤ë¹„ê²Œì´??
  const handleRowKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === 'ArrowDown') {
      const nextIdx = idx + 1;
      if (nextIdx < businessList.length) {
        const nextRow = businessList[nextIdx];
        setSelectedBusiness(nextRow);
        // ?¤ìŒ ?‰ì— ?¬ì»¤???´ë™
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="?¬ì—…ë²ˆí˜¸ "]')[nextIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'ArrowUp') {
      const prevIdx = idx - 1;
      if (prevIdx >= 0) {
        const prevRow = businessList[prevIdx];
        setSelectedBusiness(prevRow);
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="?¬ì—…ë²ˆí˜¸ "]')[prevIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'Enter') {
      // ?”í„°?¤ë¡œ ? íƒ
      const currentRow = businessList[idx];
      if (currentRow) {
        handleDoubleClick(currentRow);
      }
    }
  };

  // ?”í„°??ì²˜ë¦¬
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ? íš¨??ì²´í¬ (?ˆê±°??chkValidation ?¨ìˆ˜)
  const checkValidation = (): boolean => {
    // ?¬ì—…?ˆì‚°?ˆì˜?œì¼ ê²½ìš°
    if (planYn) {
      if (!progressStates.new && !progressStates.sales) {
        showToast('ì§„í–‰?íƒœë¥?? íƒ?˜ì„¸?? (? ê·œ ?ëŠ” ?ì—…ì§„í–‰ ì¤??˜ë‚˜ ?´ìƒ)', 'warning');
        return false;
      }
    } else {
      // ?¬ì—…?•ì •?ˆì˜?œì¼ ê²½ìš° - ?˜ì£¼?•ì •, ê³„ì•½, ?„ë£Œ ì¤??˜ë‚˜?¼ë„ ? íƒ?˜ì–´????
      if (!progressStates.confirmed && !progressStates.contract && !progressStates.completed) {
        showToast('ì§„í–‰?íƒœë¥?? íƒ?˜ì„¸?? (?˜ì£¼?•ì •, ê³„ì•½, ?„ë£Œ ì¤??˜ë‚˜ ?´ìƒ)', 'warning');
        return false;
      }
    }
    return true;
  };

  // ESC ?¤ë¡œ ?ì—… ?«ê¸°
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // ?„ì²´ ì²´í¬ë°•ìŠ¤ ?íƒœ ?ë™ ?…ë°?´íŠ¸
  useEffect(() => {
    const allIndividualChecked = progressStates.new && 
                                progressStates.sales && 
                                progressStates.confirmed && 
                                progressStates.contract && 
                                progressStates.completed && 
                                progressStates.failed && 
                                progressStates.cancelled;
    
    if (allIndividualChecked !== progressStates.all) {
      console.log('?”„ ?„ì²´ ì²´í¬ë°•ìŠ¤ ?íƒœ ?…ë°?´íŠ¸:', allIndividualChecked);
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
      {/* ?ë‹¨ ?¤ë” */}
      <div className="popup-header">
        <h3 className="popup-title">?¬ì—…ë²ˆí˜¸ê²€??/h3>
        <button 
          className="popup-close" 
          type="button"
          onClick={() => window.close()}
          tabIndex={0}
          aria-label="?«ê¸°"
        >
          Ã—
        </button>
      </div>

      <div className="popup-body">
        {/* ê²€???ì—­ */}
        <div className="search-div">
          <table className="search-table">
            <tbody>
              {/* 1??- ì¡°íšŒêµ¬ë¶„ */}
              <tr className="search-tr">
                <th className="search-th w-[110px]">ì¡°íšŒêµ¬ë¶„</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '0'}
                      onChange={() => handleSearchTypeChange('0')}
                    /> ?„ì²´
                  </label>
                  <label className="mr-2">
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '1'}
                      onChange={() => handleSearchTypeChange('1')}
                    /> ?¬ì—…ë¶€??
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '2'}
                      onChange={() => handleSearchTypeChange('2')}
                    /> ?¤í–‰ë¶€??
                  </label>
                </td>
              </tr>

              {/* 2??- ë³¸ë?, ì¶”ì§„ë¶€?? ?ì—…?€??*/}
              <tr className="search-tr">
                <th className="search-th">ë³¸ë?</th>
                <td className="search-td !w-[150px]">
                  <select 
                    className="combo-base"
                    value={hqDiv}
                    onChange={(e) => handleHqChange(e.target.value)}
                    disabled={searchType === '0' || codesLoading}
                  >
                    <option value="ALL">?„ì²´</option>
                    {hqDivCodes.map((code) => (
                      <option key={code.code} value={code.code}>
                        {code.name}
                      </option>
                    ))}
                  </select>
                </td>
                <th className="search-th w-[110px]">
                  {searchType === '2' ? '?¤í–‰ë¶€?? : 'ì¶”ì§„ë¶€??}
                </th>
                <td className="search-td !w-[150px]">
                  <select 
                    className="combo-base"
                    value={deptDiv}
                    onChange={(e) => setDeptDiv(e.target.value)}
                    disabled={searchType === '0'}
                  >
                    <option value="ALL">?„ì²´</option>
                    {deptListData.map((dept: any) => (
                      <option key={dept.code || dept.deptDivCd} value={dept.code || dept.deptDivCd}>
                        {dept.name || dept.deptNm}
                      </option>
                    ))}
                  </select>
                </td>
                <th className="search-th w-[110px]">
                  {searchType === '2' ? 'PMëª? : '?ì—…?€??}
                </th>
                <td className="search-td !w-[150px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-[100px]" 
                    value={userNm}
                    onChange={(e) => setUserNm(e.target.value)}
                    disabled={searchType === '0' || (user?.authCd === '40' || (user?.authCd === '30' && user?.dutyDivCd === '4'))}
                    placeholder={user?.authCd === '30' && user?.dutyDivCd === '4' && searchType === '2' ? 'ë³¸ì¸ PM ?¬ì—…ë§?ì¡°íšŒ' : ''}
                  />
                </td>
                <td className="search-td" colSpan={4}></td>
              </tr>

              {/* 3??- ì§„í–‰?íƒœ */}
              <tr className="search-tr">
                <th className="search-th">ì§„í–‰?íƒœ</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.all}
                      onChange={(e) => handleAllProgressChange(e.target.checked)}
                      disabled={!progressEnabled.all}
                    /> (ëª¨ë‘? íƒ)
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.new}
                      onChange={(e) => handleProgressChange('new', e.target.checked)}
                      disabled={!progressEnabled.new}
                    /> ? ê·œ
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.sales}
                      onChange={(e) => handleProgressChange('sales', e.target.checked)}
                      disabled={!progressEnabled.sales}
                    /> ?ì—…ì§„í–‰
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.confirmed}
                      onChange={(e) => handleProgressChange('confirmed', e.target.checked)}
                      disabled={!progressEnabled.confirmed}
                    /> ?˜ì£¼?•ì •
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.contract}
                      onChange={(e) => handleProgressChange('contract', e.target.checked)}
                      disabled={!progressEnabled.contract}
                    /> ê³„ì•½
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.completed}
                      onChange={(e) => handleProgressChange('completed', e.target.checked)}
                      disabled={!progressEnabled.completed}
                    /> ?„ë£Œ(ì¢…ê²°)
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.failed}
                      onChange={(e) => handleProgressChange('failed', e.target.checked)}
                      disabled={!progressEnabled.failed}
                    /> ?˜ì£¼?¤íŒ¨
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={progressStates.cancelled}
                      onChange={(e) => handleProgressChange('cancelled', e.target.checked)}
                      disabled={!progressEnabled.cancelled}
                    /> ì·¨ì†Œ(?? œ)
                  </label>
                </td>
              </tr>

              {/* 4??- ?¬ì—…?„ë„, ?¬ì—…ë²ˆí˜¸, ì¡°íšŒë²„íŠ¼ */}
              <tr className="search-tr">
                <th className="search-th">?¬ì—…?„ë„</th>
                <td className="search-td">
                  <select 
                    className="combo-base w-[120px]"
                    value={bsnYear}
                    onChange={(e) => setBsnYear(e.target.value)}
                  >
                    <option value="ALL">?„ì²´</option>
                    <option value="2025">2025??/option>
                    <option value="2024">2024??/option>
                    <option value="2023">2023??/option>
                    <option value="2022">2022??/option>
                    <option value="2021">2021??/option>
                  </select>
                </td>
                <th className="search-th">?¬ì—…ë²ˆí˜¸</th>
                <td className="search-td">
                  <input 
                    type="text" 
                    className="input-base input-default w-[120px]" 
                    value={bsnNo}
                    onChange={(e) => setBsnNo(e.target.value)}
                    onKeyDown={handleKeyPress}
                    tabIndex={0}
                    aria-label="?¬ì—…ë²ˆí˜¸ ?…ë ¥"
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
                    aria-label="ì¡°íšŒ"
                  >
                    {loading ? 'ì¡°íšŒì¤?..' : 'ì¡°íšŒ'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ?ëŸ¬ ë©”ì‹œì§€ */}
        {error && (
          <div className="mt-2">
            <div className="error-message-box">
              <div className="error-message-icon">??/div>
              <div className="error-message-desc">{error}</div>
            </div>
          </div>
        )}

        {/* ê·¸ë¦¬???ì—­ */}
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

        {/* ì¢…ë£Œ ë²„íŠ¼ */}
        <div className="flex justify-end mt-4">
          <button 
            className="btn-base btn-delete"
            onClick={() => window.close()}
            tabIndex={0}
            aria-label="ì¢…ë£Œ"
          >
            ì¢…ë£Œ
          </button>
        </div>
      </div>
    </div>
  );
}




