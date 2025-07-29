'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import '../common/common.css';
import DataGrid from '../../components/grid/DataGrid';

interface EmployeeListData {
  LIST_NO?: string;
  EMP_NO?: string;
  OWN_OUTS_DIV?: string;
  OWN_OUTS_DIV_CD?: string;
  EMP_NM?: string;
  DUTY?: string;
  DUTY_CD?: string;
  HQ_DIV?: string;
  HQ_DIV_CD?: string;
  DEPT_DIV?: string;
  DEPT_DIV_CD?: string;
  CRPN_NM?: string;
  ENTR_NO?: string;
  ENTR_DT?: string;
  WKG_ST_DIV?: string;
  WKG_ST_DIV_CD?: string;
  LAST_TCN_GRD_CD?: string;
  CARR_YM?: string;
  CTQL_CD_NM?: string;
  CTQL_CD?: string;
  MOB_PHN_NO?: string;
  EMAIL_ADDR?: string;
  RETIR_DT?: string;
  LAST_IN_DT?: string;
  FST_IN_DT?: string;
  LAST_END_DT?: string;
  LAST_IN_STRT_DT?: string;
  LAST_IN_END_DT?: string;
  LAST_PRJT?: string;
  RMK?: string;
  EMP_ENG_NM?: string;
  RES_REG_NO?: string;
  BIR_YR_MN_DT?: string;
  SEX_DIV_CD?: string;
  NTLT_DIV_CD?: string;
  HOME_TEL?: string;
  HOME_ZIP_NO?: string;
  HOME_ADDR?: string;
  HOME_DET_ADDR?: string;
  LAST_SCHL?: string;
  MAJR?: string;
  LAST_GRAD_DT?: string;
  CTQL_PUR_DT?: string;
  CARR_MCNT?: string;
}

interface AppointmentTargetData {
  APNT_DIV_NM?: string;
  APNT_DT?: string;
  EMP_NO?: string;
  EMP_NM?: string;
  HQ_DIV_NM?: string;
  DEPT_DIV_NM?: string;
  DUTY_NM?: string;
  HQ_DIV_NM_BEF?: string;
  DEPT_DIV_NM_BEF?: string;
  DUTY_NM_BEF?: string;
  RMK?: string;
  APNT_DIV_CD?: string;
  HQ_DIV_CD?: string;
  DEPT_DIV_CD?: string;
  DUTY_CD?: string;
}

interface CommonCode {
  data?: string;
  label?: string;
  codeId?: string;
  codeNm?: string;
  DATA?: string;
  LABEL?: string;
}

interface PSM1040M00Props {
  selectedEmployee?: EmployeeListData | null;
  isTab?: boolean;
  onRegisterSuccess?: () => void; // ?±ë¡ ?±ê³µ ???ìœ„ ?”ë©´ ?¬ì¡°??ì½œë°±
}

export default function PSM1040M00({ selectedEmployee, isTab, onRegisterSuccess }: PSM1040M00Props) {
  const { showToast, showConfirm } = useToast();
  const { user } = useAuth();
  const [appointmentTargets, setAppointmentTargets] = useState<AppointmentTargetData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [curEmpNo, setCurEmpNo] = useState('');
  const [isRegisterEnabled, setIsRegisterEnabled] = useState(true);
  const [scrollToIndex, setScrollToIndex] = useState<number>(-1);
  const [isInitialized, setIsInitialized] = useState(false);

  // AS-IS ê³µí†µ ì½”ë“œ ?íƒœ
  const [commonCodes, setCommonCodes] = useState<{
    apntDiv: CommonCode[];
    hqDiv: CommonCode[];
    deptDiv: CommonCode[];
    duty: CommonCode[];
  }>({
    apntDiv: [],
    hqDiv: [],
    deptDiv: [],
    duty: []
  });

  // AS-IS ?…ë ¥ ?°ì´???íƒœ
  const [inputData, setInputData] = useState({
    apntDiv: '2', // ë°œë ¹êµ¬ë¶„ (ê¸°ë³¸ê°? ?¹ì§„)
    apntDt: '', // ë°œë ¹?¼ì
    hqDiv: '', // ë°œë ¹ë³¸ë?
    deptDiv: '', // ë°œë ¹ë¶€??
    duty: '', // ë°œë ¹ì§ìœ„
    rmk: '' // ë¹„ê³ 
  });

  // AS-IS ?„ë“œ ?œì„±??ë¹„í™œ?±í™” ?íƒœ
  const [fieldEnableState, setFieldEnableState] = useState({
    hqDiv: false,
    deptDiv: false,
    duty: true
  });

  // AS-IS ì´ˆê¸°??ë¡œì§
  useEffect(() => {
    const initializeComponent = async () => {
      await loadCommonCodes();
      initScreen();
      setIsInitialized(true);
    };
    initializeComponent();
  }, []);

  // AS-IS ê³µí†µ ì½”ë“œ ë¡œë“œ
  const loadCommonCodes = async () => {
    try {
      // ë°œë ¹êµ¬ë¶„ ì½”ë“œ ë¡œë“œ (AS-IS: cbApntDiv.setLargeCode('018',''))
      const apntDivResponse = await fetch('/api/common/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ largeCategoryCode: '018' })
      });
      const apntDivResult = await apntDivResponse.json();
      const apntDivData = apntDivResult.data || [];

      // ë³¸ë? ì½”ë“œ ë¡œë“œ (AS-IS: cbHqDiv.setLargeCode('113', '00'))
      const hqResponse = await fetch('/api/common/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ largeCategoryCode: '113' })
      });
      const hqResult = await hqResponse.json();
      const hqData = hqResult.data || [];

      // ì§ì±… ì½”ë“œ ë¡œë“œ (AS-IS: cbDuty.setLargeCode('116','9'))
      const dutyResponse = await fetch('/api/common/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ largeCategoryCode: '116' })
      });
      const dutyResult = await dutyResponse.json();
      const dutyData = dutyResult.data || [];

      setCommonCodes({
        apntDiv: apntDivData || [],
        hqDiv: hqData || [],
        deptDiv: [],
        duty: dutyData || []
      });
    } catch (error) {
      console.error('ê³µí†µ ì½”ë“œ ë¡œë“œ ì¤??¤ë¥˜:', error);
    }
  };

  // AS-IS ?”ë©´ ì´ˆê¸°??
  const initScreen = () => {
    setInputData({
      apntDiv: '2',
      apntDt: '',
      hqDiv: '',
      deptDiv: '',
      duty: '9', // AS-IS?€ ?™ì¼: cbDuty.setLargeCode('116','9')??ê¸°ë³¸ê°?
      rmk: ''
    });
    
    // AS-IS?€ ?™ì¼???…ë ¥ ?„ë“œ ?œì„±??ë¹„í™œ?±í™”
    setFieldEnableState({
      hqDiv: false,
      deptDiv: false,
      duty: true
    });
    
    handleListClear();
  };

  // AS-IS ?¸ì‚¬ë°œë ¹ ?€?ì ë¦¬ìŠ¤?¸ì— ì¶”ê?
  const addAppointmentTarget = (employee: EmployeeListData) => {
    const validationResult = validateAppointmentTarget(employee);
    if (!validationResult) return;

    let remark = '';
    // AS-IS?€ ?™ì¼??ë¹„ê³  ë¡œì§
    if (inputData.apntDiv === '3') {
      const selectedHqLabel = commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm;
      if (employee.HQ_DIV === selectedHqLabel) {
        remark = inputData.rmk;
      } else {
        remark = `ë©?${employee.HQ_DIV} ëª?${selectedHqLabel}`;
      }
    } else {
      remark = inputData.rmk;
    }

    // AS-IS?€ ?™ì¼???°ì´??êµ¬ì¡°ë¡??ì„±
    const newTarget: AppointmentTargetData = {
      APNT_DIV_NM: commonCodes.apntDiv.find(code => code.codeId === inputData.apntDiv)?.codeNm, // ë°œë ¹êµ¬ë¶„
      APNT_DT: inputData.apntDt, // ë°œë ¹?¼ì
      EMP_NO: employee.EMP_NO, // ?¬ë²ˆ
      EMP_NM: employee.EMP_NM, // ?±ëª…
      HQ_DIV_NM: inputData.apntDiv === '3' ? 
                 commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm : 
                 employee.HQ_DIV, // ë°œë ¹ë³¸ë?
      DEPT_DIV_NM: inputData.apntDiv === '3' ? 
                   commonCodes.deptDiv.find(code => code.DATA === inputData.deptDiv)?.LABEL : 
                   employee.DEPT_DIV, // ë°œë ¹ë¶€??
      DUTY_NM: inputData.apntDiv === '2' && inputData.duty ? 
               commonCodes.duty.find(code => code.codeId === inputData.duty)?.codeNm : 
               employee.DUTY, // ë°œë ¹ì§ì±… (AS-IS?€ ?™ì¼: ?¹ì§„???Œë§Œ ? íƒ??ì§ì±…, ê·??¸ì—???„ì¬ ì§ì±…)
      HQ_DIV_NM_BEF: employee.HQ_DIV, // ë°œë ¹?„ë³¸ë¶€
      DEPT_DIV_NM_BEF: employee.DEPT_DIV, // ë°œë ¹?„ë???
      DUTY_NM_BEF: employee.DUTY, // ë°œë ¹?„ì§ì±?
      RMK: remark, // ë¹„ê³ 
      APNT_DIV_CD: inputData.apntDiv, // ë°œë ¹êµ¬ë¶„ì½”ë“œ
      HQ_DIV_CD: inputData.apntDiv === '3' ? inputData.hqDiv : employee.HQ_DIV_CD, // ë°œë ¹ë³¸ë?ì½”ë“œ
      DEPT_DIV_CD: inputData.apntDiv === '3' ? inputData.deptDiv : employee.DEPT_DIV_CD, // ë°œë ¹ë¶€?œì½”??
      DUTY_CD: inputData.apntDiv === '2' ? inputData.duty : employee.DUTY_CD // ë°œë ¹ì§ì±…ì½”ë“œ
    };

    // AS-IS?€ ?™ì¼?˜ê²Œ ë°°ì—´ ?ì— ì¶”ê?
    setAppointmentTargets(prev => {
      const newTargets = [...prev, newTarget];
      // AS-IS: ì¶”ê????‰ìœ¼ë¡??¤í¬ë¡??„ì¹˜ ?¤ì •
      setScrollToIndex(newTargets.length - 1);
      return newTargets;
    });
    setCurEmpNo(employee.EMP_NO || '');
  };

  // AS-IS ?¸ì‚¬ë°œë ¹ ?€?ì ê²€ì¦?
  const validateAppointmentTarget = (employee: EmployeeListData): boolean => {
    // ì»´í¬?ŒíŠ¸ê°€ ì´ˆê¸°?”ë˜ì§€ ?Šì•˜?¼ë©´ ê²€ì¦í•˜ì§€ ?ŠìŒ
    if (!isInitialized) {
      return false;
    }

    // AS-IS?€ ?™ì¼: ?±ë¡ë²„íŠ¼ ?œì„± ?¬ë? ì²´í¬
    if (!isRegisterEnabled) {
      showToast('? ê·œ ë²„íŠ¼???´ë¦­??ì£¼ì‹­?œìš”.', 'warning');
      return false;
    }

    // AS-IS?€ ?™ì¼: ë°œë ¹?¼ì ?…ë ¥ ì²´í¬
    if (!inputData.apntDt) {
      showToast('ë°œë ¹?¼ìë¥??…ë ¥??ì£¼ì‹­?œìš”.', 'warning');
      return false;
    }

    // AS-IS?€ ?™ì¼: ?¸ì£¼ ?¸ë ¥ ì²´í¬
    if (employee.OWN_OUTS_DIV_CD === '2') {
      showToast('?¸ì£¼?¸ë ¥?€ ?¸ì‚¬ë°œë ¹ ?€?ì´ ?„ë‹™?ˆë‹¤', 'warning');
      return false;
    }

    // AS-IS?€ ?™ì¼: ?´ë? ì¶”ê????¬ì›?¸ì? ì²´í¬
    const existingIndex = appointmentTargets.findIndex(target => target.EMP_NO === employee.EMP_NO);
    if (existingIndex >= 0) {
      showToast(`${employee.EMP_NM}???€) ?´ë? ?¸ì‚¬ë°œë ¹ ?€?ìë¡?ì¶”ê??˜ì–´ ?ˆìŠµ?ˆë‹¤.`, 'warning');
      return false;
    }

    // AS-IS?€ ?™ì¼: ?¹ì§„??ê²½ìš° ë°œë ¹ì§ì±…??ë°œë ¹??ì§ì±…ë³´ë‹¤ ?’ì•„???œë‹¤
    if (inputData.apntDiv === '2') {
      // AS-IS?€ ?™ì¼: ?¹ì§„???ŒëŠ” ì§ì±…??? íƒ?˜ì–´????
      if (!inputData.duty || inputData.duty.trim() === '') {
        showToast('?¹ì§„??ê²½ìš° ë°œë ¹ì§ì±…??? íƒ??ì£¼ì‹­?œìš”.', 'warning');
        return false;
      }
      
      const selectedDutyLabel = commonCodes.duty.find(code => code.codeId === inputData.duty)?.codeNm || '? íƒ??ì§ì±…';
      if (parseInt(inputData.duty) >= parseInt(employee.DUTY_CD || '0')) {
        showToast(`${selectedDutyLabel} ?¹ì§„ ?€?ì´ ?„ë‹™?ˆë‹¤.`, 'warning');
        return false;
      }
    }

    // AS-IS?€ ?™ì¼: ?´ë™??ê²½ìš° ë°œë ¹ë³¸ë?/ë¶€?œê? ë°œë ¹??ë³¸ë?/ë¶€?œì? ?¬ë¼???œë‹¤
    if (inputData.apntDiv === '3') {
      if (inputData.hqDiv === employee.HQ_DIV_CD && inputData.deptDiv === employee.DEPT_DIV_CD) {
        showToast('ë°œë ¹ë³¸ë?(ë¶€??ê°€ ê°™ìœ¼ë©?ë¶€???´ë™ ?€?ì´ ?„ë‹™?”ë‹¤.', 'warning');
        return false;
      }
    }

    return true;
  };

  // AS-IS ë°œë ¹êµ¬ë¶„ ë³€ê²???
  const handleApntDivChange = (apntDiv: string) => {
    setInputData(prev => ({ ...prev, apntDiv }));

    // AS-IS?€ ?™ì¼??ë¡œì§: ë°œë ¹êµ¬ë¶„???°ë¥¸ ?…ë ¥ ?„ë“œ ?œì„±??ë¹„í™œ?±í™”
    if (apntDiv === '1') {
      // AS-IS: ?…ì‚¬ ë°œë ¹ ?±ë¡?€ ?¬ì›ê´€ë¦?? ê·œ ?±ë¡ ???œë‹¤
      showToast('???…ì‚¬?±ë¡?€ ?¬ì›?•ë³´ ? ê·œ?±ë¡?œì—ë§?ê°€?¥í•¨.', 'info');
      setFieldEnableState({
        hqDiv: false,
        deptDiv: false,
        duty: false
      });
    } else if (apntDiv === '2') {
      // AS-IS: ?¹ì§„??? íƒ?˜ë©´ ë°œë ¹ì§ìœ„ë§??…ë ¥ ê°€??
      setFieldEnableState({
        hqDiv: false,
        deptDiv: false,
        duty: true
      });
    } else if (apntDiv === '3') {
      // AS-IS: ?´ë™??? íƒ?˜ë©´ ë³¸ë?/ë¶€?œë§Œ ?…ë ¥ ê°€??
      setFieldEnableState({
        hqDiv: true,
        deptDiv: true,
        duty: false
      });
    } else if (apntDiv === '4') {
      // AS-IS: ?´ì‚¬ë¥?? íƒ?˜ë©´ ?…ë ¥ ë¶ˆê???
      setFieldEnableState({
        hqDiv: false,
        deptDiv: false,
        duty: false
      });
    } else {
      setFieldEnableState({
        hqDiv: false,
        deptDiv: false,
        duty: false
      });
    }
  };

  // AS-IS ë³¸ë? ë³€ê²???ë¶€??ë¡œë“œ
  const handleHqDivChange = async (hqDiv: string) => {
    setInputData(prev => ({ ...prev, hqDiv }));

    try {
      // AS-IS: cbDeptDiv.setDeptCode3("",cbHqDiv.value.toString(),"N")
      const response = await fetch('/api/psm/dept-by-hq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          searchType: '2',
          includeAll: 'N',
          hqDivCd: hqDiv
        })
      });
      const deptResult = await response.json();
      const deptData = deptResult.data || [];
      
      setCommonCodes(prev => ({
        ...prev,
        deptDiv: deptData || []
      }));
    } catch (error) {
      console.error('ë¶€??ë¡œë“œ ì¤??¤ë¥˜:', error);
    }
  };

  // AS-IS ? ê·œ ë²„íŠ¼ ?´ë¦­
  const handleNew = () => {
    handleListClear();
    // AS-IS?€ ?™ì¼: ? ê·œ ??ê¸°ë³¸ê°??¤ì •
    setInputData(prev => ({
      ...prev,
      duty: '9' // AS-IS?€ ?™ì¼: cbDuty.setLargeCode('116','9')??ê¸°ë³¸ê°?
    }));
    // ?±ë¡ë²„íŠ¼ ?œì„±??
    setIsRegisterEnabled(true);
  };

  // AS-IS ?±ë¡ ë²„íŠ¼ ?´ë¦­
  const handleRegister = async () => {
    if (appointmentTargets.length === 0) {
      showToast('?±ë¡???€?ìê°€ ?†ìŠµ?ˆë‹¤.', 'warning');
      return;
    }

    showConfirm({
      message: `${appointmentTargets.length}ëª…ì˜ ?¸ì‚¬ë°œë ¹???±ë¡?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
      type: 'info',
      onConfirm: async () => {
        setIsLoading(true);
        setError(null);

        try {
          
          // AS-IS?€ ?™ì¼???°ì´??êµ¬ì„±
          const appointmentData = makeAppointmentData();
          
          const response = await fetch('/api/psm/appointment/batch-register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              appointmentData,
              userId: user?.userId || 'system' // ë¡œê·¸?¸ì‚¬?©ì (?¤ì œ ?¸ì…˜?ì„œ ê°€?¸ì˜´)
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              showToast('?±ë¡?˜ì—ˆ?µë‹ˆ??', 'info');
              // ???±ë¡??ë°©ì??˜ê¸° ?„í•´???±ë¡ë²„íŠ¼ ë¹„í™œ?±í™”
              setIsRegisterEnabled(false);
              handleListClear();
              
              // AS-IS: ?¬ì›ë¦¬ìŠ¤???¬ì¡°??
              if (onRegisterSuccess) {
                onRegisterSuccess();
              }
            } else {
              setError(result.message || '?±ë¡???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
              showToast(result.message || '?±ë¡???¤íŒ¨?ˆìŠµ?ˆë‹¤.', 'error');
            }
          } else {
            throw new Error('?±ë¡???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
          }
        } catch (error) {
          console.error('?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ ì¤??¤ë¥˜:', error);
          const errorMessage = error instanceof Error ? error.message : '?±ë¡ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => {
        console.log('?¸ì‚¬ë°œë ¹ ?±ë¡ ì·¨ì†Œ');
      }
    });
  };

  // AS-IS ?±ë¡?°ì´??ë§Œë“¤ê¸?
  const makeAppointmentData = (): string => {
    if (appointmentTargets.length === 0) {
      return '';
    }

    let appointmentData = '';
    for (const target of appointmentTargets) {
      appointmentData += `${target.APNT_DIV_CD}^`; // ë°œë ¹êµ¬ë¶„
      appointmentData += `${target.APNT_DT?.replace(/-/g, '')}^`; // ë°œë ¹?¼ì
      appointmentData += `${target.EMP_NO}^`; // ?¬ë²ˆ
      appointmentData += `${target.HQ_DIV_CD}^`; // ë³¸ë?ì½”ë“œ
      appointmentData += `${target.DEPT_DIV_CD}^`; // ë¶€?œêµ¬ë¶„ì½”??
      appointmentData += `${target.DUTY_CD}^`; // ì§ì±…ì½”ë“œ
      appointmentData += `${target.RMK}^`; // ë¹„ê³ 
      appointmentData += '|';
    }
    return appointmentData;
  };

  // AS-IS ?‰ì‚­??ë²„íŠ¼ ?´ë¦­
  const handleRowDelete = (index: number) => {
    if (index < 0 || index >= appointmentTargets.length) return;

    const newTargets = [...appointmentTargets];
    newTargets.splice(index, 1);
    setAppointmentTargets(newTargets);

    // AS-IS?€ ?™ì¼??curEmpNo ì²˜ë¦¬
    if (index > 0 && index >= newTargets.length) {
      setCurEmpNo(newTargets[index - 1].EMP_NO || '');
    }
  };

  // AS-IS ë¦¬ìŠ¤??ì´ˆê¸°??
  const handleListClear = () => {
    setAppointmentTargets([]);
    setCurEmpNo('');
    setScrollToIndex(-1);
  };

  // ?¸ë??ì„œ ?¬ì› ì¶”ê? ?¸ì¶œ (PSM1000M00?ì„œ ?¬ìš©)
  useEffect(() => {
    if (selectedEmployee) {
      addAppointmentTarget(selectedEmployee);
    }
  }, [selectedEmployee]);

  return (
    <div className={`flex flex-col ${isTab ? 'flex-1 min-h-0' : 'h-full'} overflow-auto`}>
      {/* AS-IS ?¸ì‚¬ë°œë ¹?´ìš© + ?€?ì */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* AS-IS ?¼ìª½ ?¸ì‚¬ë°œë ¹?´ìš© ?…ë ¥ */}
        <div className="w-[320px] flex flex-col">
          <div className="tit_area">
            <h3>?¸ì‚¬ë°œë ¹?´ìš©</h3>
          </div>
          <div className="flex-1">
            <table className="form-table">
              <tbody>
                <tr className="form-tr">
                  <th className="form-th w-[100px]">ë°œë ¹êµ¬ë¶„</th>
                  <td className="form-td">
                    <select 
                      className="combo-base w-full"
                      data-field="apntDiv"
                      value={inputData.apntDiv}
                      onChange={(e) => handleApntDivChange(e.target.value)}
                    >
                      {commonCodes.apntDiv.map(code => (
                        <option key={code.codeId} value={code.codeId}>
                          {code.codeNm}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="form-tr">
                  <th className="form-th">ë°œë ¹?¼ì</th>
                  <td className="form-td">
                    <input 
                      type="date" 
                      className="input-base input-default w-full"
                      data-field="apntDt"
                      value={inputData.apntDt}
                      onChange={(e) => setInputData(prev => ({ ...prev, apntDt: e.target.value }))}
                    />
                  </td>
                </tr>
                <tr className="form-tr">
                  <th className="form-th">ë°œë ¹ë³¸ë?</th>
                  <td className="form-td">
                    <select 
                      className="combo-base w-full"
                      value={inputData.hqDiv}
                      data-field="hqDiv"
                      onChange={(e) => handleHqDivChange(e.target.value)}
                      disabled={!fieldEnableState.hqDiv}
                    >
                      {commonCodes.hqDiv.map(code => (
                        <option key={code.codeId} value={code.codeId}>
                          {code.codeNm}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="form-tr">
                  <th className="form-th">ë°œë ¹ë¶€??/th>
                  <td className="form-td">
                    <select 
                      className="combo-base w-full"
                      value={inputData.deptDiv}
                      data-field="deptDiv"
                      onChange={(e) => setInputData(prev => ({ ...prev, deptDiv: e.target.value }))}
                      disabled={!fieldEnableState.deptDiv}
                    >
                      {commonCodes.deptDiv.map(code => (
                        <option key={code.DATA} value={code.DATA}>
                          {code.LABEL}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="form-tr">
                  <th className="form-th">ë°œë ¹ì§ìœ„</th>
                  <td className="form-td">
                    <select 
                      className="combo-base w-full"
                      value={inputData.duty}
                      onChange={(e) => {
                        setInputData(prev => ({ ...prev, duty: e.target.value }));
                      }}
                      disabled={!fieldEnableState.duty}
                    >
                      {commonCodes.duty.map(code => (
                        <option key={code.codeId} value={code.codeId}>
                          {code.codeNm}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="form-tr align-top">
                  <th className="form-th pt-2">ë¹„ê³ </th>
                  <td className="form-td">
                    <textarea 
                      className="textarea_def w-full min-h-[80px]"
                      value={inputData.rmk}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // UTF-8 ë°”ì´????ê³„ì‚°
                        const byteLength = new TextEncoder().encode(newValue).length;
                        
                        if (byteLength <= 500) {
                          setInputData(prev => ({ ...prev, rmk: newValue }));
                        } else {
                          showToast(`ë¹„ê³ ??500ë°”ì´?¸ê¹Œì§€ ?…ë ¥ ê°€?¥í•©?ˆë‹¤. (?„ì¬: ${byteLength}ë°”ì´??`, 'warning');
                        }
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end mt-2 gap-2">
              <button 
                className="btn-base btn-etc"
                onClick={handleNew}
              >
                ? ê·œ
              </button>
              <button 
                className="btn-base btn-act"
                onClick={handleRegister}
                disabled={isLoading || !isRegisterEnabled}
              >
                ?±ë¡
              </button>
            </div>
          </div>
        </div>

        {/* AS-IS ?¤ë¥¸ìª??¸ì‚¬ë°œë ¹ ?€?ì */}
        <div className="flex-1 flex flex-col">
          <div className="tit_area justify-between">
            <h3>?¸ì‚¬ë°œë ¹ ?€?ì</h3>
            <div className="flex gap-2">
              <button 
                className="btn-base btn-etc"
                onClick={handleListClear}
              >
                ë¦¬ìŠ¤?¸ì´ˆê¸°í™”
              </button>
              <button 
                className="btn-base btn-delete"
                onClick={() => {
                  if (!curEmpNo) {
                    showToast('?? œ???‰ì„ ? íƒ??ì£¼ì‹­?œìš”.', 'warning');
                    return;
                  }
                  const selectedIndex = appointmentTargets.findIndex(target => target.EMP_NO === curEmpNo);
                  if (selectedIndex >= 0) {
                    handleRowDelete(selectedIndex);
                  } else {
                    showToast('? íƒ???‰ì„ ì°¾ì„ ???†ìŠµ?ˆë‹¤.', 'warning');
                  }
                }}
                disabled={!curEmpNo || appointmentTargets.length === 0}
              >
                ?‰ì‚­??
              </button>
            </div>
          </div>
          <div>
            <DataGrid
              rowData={appointmentTargets}
              columnDefs={[
                { headerName: 'êµ¬ë¶„', field: 'APNT_DIV_NM', width: 90 },
                { headerName: 'ë°œë ¹?¼ì', field: 'APNT_DT', width: 110 },
                { headerName: '?¬ë²ˆ', field: 'EMP_NO', width: 100 },
                { headerName: '?±ëª…', field: 'EMP_NM', width: 100 },
                { headerName: 'ë³¸ë?', field: 'HQ_DIV_NM', width: 110 },
                { headerName: 'ë¶€??, field: 'DEPT_DIV_NM', width: 110 },
                { headerName: 'ì§ì±…', field: 'DUTY_NM', width: 90 },
                { headerName: 'ë³¸ë?', field: 'HQ_DIV_NM_BEF', width: 110 },
                { headerName: 'ë¶€??, field: 'DEPT_DIV_NM_BEF', width: 110 },
                { headerName: 'ì§ì±…', field: 'DUTY_NM_BEF', width: 90 },
                { headerName: 'ë¹„ê³ ', field: 'RMK', flex: 1 },
              ]}
              height="300px"
              enablePagination={false}
              enableSelection={true}
              enableExport={false}
              enableSorting={true}
              enableFiltering={true}
              className="ag-custom"
              onRowSelected={(selectedRows: any[]) => {
                if (selectedRows.length > 0) {
                  setCurEmpNo(selectedRows[0].EMP_NO);
                } else {
                  setCurEmpNo('');
                }
              }}
            />
          </div>
          <p className="text-[13px] text-[#00509A] py-1">
            ??ë°œë ¹?€?ì???”ë©´ ?ë‹¨???¬ì›(?¸ì£¼)ë¦¬ìŠ¤?¸ë? ?”ë¸”?´ë¦­?˜ë©´ ?¸ì‚¬ë°œë ¹ ?€?ì ë¦¬ìŠ¤?¸ì— ì¶”ê? ?©ë‹ˆ??
          </p>
        </div>
      </div>

      {/* ?ëŸ¬ ë©”ì‹œì§€ */}
      {error && (
        <div className="text-red-500 text-sm mt-2 px-1">
          {error}
        </div>
      )}
    </div>
  );
}


