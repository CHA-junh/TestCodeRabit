'use client';

import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { RowDoubleClickedEvent } from 'ag-grid-community';
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

interface AppointmentData {
  LIST_NO?: string;
  APNT_DIV_NM?: string;
  APNT_DIV?: string;
  APNT_DT?: string;
  HQ_DIV_NM?: string;
  HQ_DIV_CD?: string;
  DEPT_DIV_NM?: string;
  DEPT_DIV_CD?: string;
  DUTY_NM?: string;
  DUTY_CD?: string;
  RMK?: string;
  SEQ_NO?: string;
}

interface CommonCode {
  data?: string;
  label?: string;
  DATA?: string;
  LABEL?: string;
  codeId?: string;
  codeNm?: string;
}

/**
 * PSM1030M00 - ?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ Í¥ÄÎ¶??îÎ©¥
 * 
 * ?¨Ïõê???∏ÏÇ¨Î∞úÎ†π ?¥Ïó≠??Ï°∞Ìöå?òÍ≥† Í¥ÄÎ¶¨Ìïò???îÎ©¥?ÖÎãà??
 * ?∏ÏÇ¨Î∞úÎ†π ?±Î°ù, ?òÏ†ï, ??†ú Í∏∞Îä•???úÍ≥µ?òÎ©∞ AG GridÎ•??¨Ïö©?òÏó¨ Î™©Î°ù???úÏãú?©Îãà??
 * 
 * Ï£ºÏöî Í∏∞Îä•:
 * - ?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ Ï°∞Ìöå Î∞?Í≤Ä??
 * - ?∏ÏÇ¨Î∞úÎ†π ?±Î°ù/?òÏ†ï/??†ú
 * - Î≥∏Î?Î≥?Î∂Ä??Ï°∞Ìöå
 * - AG GridÎ•??úÏö©??Î∞úÎ†π?¥Ïó≠ Î™©Î°ù ?úÏãú
 * 
 * AS-IS: PSM_01_0130.mxml (?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ Í¥ÄÎ¶?
 * TO-BE: React Í∏∞Î∞ò ?∏ÏÇ¨Î∞úÎ†π Í¥ÄÎ¶??îÎ©¥
 * 
 * ?¨Ïö© ?àÏãú:
 * ```tsx
 * // PSM1010M00????úºÎ°??¨Ïö©
 * <PSM1030M00 
 *   selectedEmployee={selectedEmployee}
 *   isTab={true}
 * />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */

interface PSM1030M00Props {
  /** ?†ÌÉù???¨Ïõê ?ïÎ≥¥ (PSM1010M00?êÏÑú ?ÑÎã¨) */
  selectedEmployee?: EmployeeListData | null;
  /** ??Î™®Îìú ?¨Î? */
  isTab?: boolean;
}

export interface PSM1030M00Ref {
  initialize: () => void;
}

const PSM1030M00 = forwardRef<PSM1030M00Ref, PSM1030M00Props>(({ selectedEmployee, isTab }, ref) => {
  const { showToast, showConfirm } = useToast();
  const { user } = useAuth();
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeListData | null>(null);
  const [appointmentList, setAppointmentList] = useState<AppointmentData[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFlag, setNewFlag] = useState(true);
  const [saveApntDiv, setSaveApntDiv] = useState('');

  // AS-IS Í≥µÌÜµ ÏΩîÎìú ?ÅÌÉú
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

  // AS-IS ?ÖÎ†• ?∞Ïù¥???ÅÌÉú
  const [inputData, setInputData] = useState({
    apntDiv: '2', // Î∞úÎ†πÍµ¨Î∂Ñ (Í∏∞Î≥∏Í∞? ?πÏßÑ)
    apntDt: '', // Î∞úÎ†π?ºÏûê
    hqDiv: '', // Î∞úÎ†πÎ≥∏Î?
    deptDiv: '', // Î∞úÎ†πÎ∂Ä??
    duty: '', // Î∞úÎ†πÏßÅÏúÑ
    rmk: '', // ÎπÑÍ≥†
    seqNo: '' // ?ºÎ†®Î≤àÌò∏
  });



  // AS-IS Í≥µÌÜµ ÏΩîÎìú Î°úÎìú
  const loadCommonCodes = async () => {
    try {
      // Î∞úÎ†πÍµ¨Î∂Ñ ÏΩîÎìú Î°úÎìú (AS-IS: cbApntDiv.setLargeCode('018',''))
      const apntDivResponse = await fetch('/api/common/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ largeCategoryCode: '018' })
      });
      const apntDivResult = await apntDivResponse.json();
      const apntDivData = apntDivResult.data || [];

      // Î≥∏Î? ÏΩîÎìú Î°úÎìú (AS-IS: cbHqDiv.setLargeCode('113', '00'))
      const hqResponse = await fetch('/api/common/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ largeCategoryCode: '113' })
      });
      const hqResult = await hqResponse.json();
      const hqData = hqResult.data || [];

      // ÏßÅÏ±Ö ÏΩîÎìú Î°úÎìú (AS-IS: cbDuty.setLargeCode('116','9'))
      const dutyResponse = await fetch('/api/common/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ largeCategoryCode: '116' })
      });
      const dutyResult = await dutyResponse.json();
      const dutyData = dutyResult.data || [];

      setCommonCodes({
        apntDiv: apntDivData,
        hqDiv: hqData,
        deptDiv: [],
        duty: dutyData
      });
    } catch (error) {
      console.error('Í≥µÌÜµ ÏΩîÎìú Î°úÎìú Ï§??§Î•ò:', error);
    }
  };

  // AS-IS ?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ Ï°∞Ìöå (PSM_01_0131_S ?ÑÎ°ú?úÏ? ?∏Ï∂ú)
  const searchAppointmentList = useCallback(async () => {
    // employeeInfo ?Ä??selectedEmployeeÎ•?ÏßÅÏ†ë ?¨Ïö©?òÏó¨ ?Ä?¥Î∞ç Î¨∏Ï†ú ?¥Í≤∞
    const currentEmpNo = selectedEmployee?.EMP_NO || employeeInfo?.EMP_NO;
    if (!currentEmpNo) return;

    setIsLoading(true);
    setError(null);

    try {

      
      const response = await fetch('/api/psm/appointment/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empNo: currentEmpNo
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAppointmentList(result.data || []);
          setAppointmentBasicInfo();
        } else {
          setError(result.message || 'Ï°∞Ìöå???§Ìå®?àÏäµ?àÎã§.');
        }
      } else {
        throw new Error('Ï°∞Ìöå???§Ìå®?àÏäµ?àÎã§.');
      }
    } catch (error) {
      console.error('?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ Ï°∞Ìöå Ï§??§Î•ò:', error);
      setError(error instanceof Error ? error.message : 'Ï°∞Ìöå Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEmployee?.EMP_NO, employeeInfo?.EMP_NO]);

  // ?∏Î??êÏÑú ?∏Ï∂ú?????àÎäî ?®Ïàò?§ÏùÑ refÎ°??∏Ï∂ú
  useImperativeHandle(ref, () => ({
    initialize: () => {
      // PSM1030M00 Ï¥àÍ∏∞??
      setEmployeeInfo(null);
      setAppointmentList([]);
      setSelectedAppointment(null);
      setNewFlag(true);
      setSaveApntDiv('');
      setError(null);
      setInputData({
        apntDiv: '2',
        apntDt: '',
        hqDiv: '',
        deptDiv: '',
        duty: '',
        rmk: '',
        seqNo: ''
      });

    }
  }));

  // AS-IS Ï¥àÍ∏∞??Î°úÏßÅ
  useEffect(() => {
    if (selectedEmployee) {
      setEmployeeInfo(selectedEmployee);
      loadCommonCodes();
      searchAppointmentList();
      initAppointmentInput();
    }
  }, [selectedEmployee?.EMP_NO, searchAppointmentList]); // EMP_NOÍ∞Ä Î≥ÄÍ≤ΩÎê† ?åÎßå ?§Ìñâ

  // AS-IS ?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ ?Ä????Í∏∞Î≥∏?ïÎ≥¥ ?¨Ï°∞??
  const setAppointmentBasicInfo = () => {
    // PSM1010M00?êÏÑú ?†ÌÉù???¨Ïõê???êÎ≥∏ ?ïÎ≥¥???†Ï??òÍ≥†, 
    // ?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠??ÏµúÏã† ?ïÎ≥¥??Î≥ÑÎèÑÎ°?Í¥ÄÎ¶?
    // ?ÅÎã®??Î≥∏Î?, Î∂Ä?úÎäî ?êÎ≥∏ ?¨Ïõê ?ïÎ≥¥Î•?Í∑∏Î?Î°??¨Ïö©
  };

  // AS-IS ?∏ÏÇ¨Î∞úÎ†π?±Î°ù ?ÖÎ†• ??™© Ï¥àÍ∏∞??
  const initAppointmentInput = () => {
    // PSM1010M00?êÏÑú ?†ÌÉù???¨Ïõê???êÎ≥∏ ?ïÎ≥¥ ?¨Ïö©
    const currentEmployee = selectedEmployee || employeeInfo;
    if (!currentEmployee) return;

    setInputData({
      apntDiv: '2', // Î∞úÎ†πÍµ¨Î∂Ñ (Í∏∞Î≥∏Í∞? ?πÏßÑ)
      apntDt: '', // Î∞úÎ†π?ºÏûê
      hqDiv: currentEmployee.HQ_DIV_CD || '',
      deptDiv: currentEmployee.DEPT_DIV_CD || '',
      duty: currentEmployee.DUTY_CD || '',
      rmk: '', // ÎπÑÍ≥†
      seqNo: '' // ?ºÎ†®Î≤àÌò∏
    });

    setSaveApntDiv('2');
    setNewFlag(true);
  };

  // AS-IS Î∞úÎ†πÍµ¨Î∂Ñ Î≥ÄÍ≤???
  const handleApntDivChange = (apntDiv: string) => {
    setInputData(prev => ({ ...prev, apntDiv }));
    setSaveApntDiv(apntDiv);

    // AS-IS?Ä ?ôÏùº??Î°úÏßÅ: Î∞úÎ†πÍµ¨Î∂Ñ???∞Î•∏ ?ÖÎ†• ?ÑÎìú ?úÏÑ±??ÎπÑÌôú?±Ìôî
    if (apntDiv === '1') {
      // ?ÖÏÇ¨ Î∞úÎ†π ?±Î°ù?Ä Î™®Îëê ?ÖÎ†• Í∞Ä??
    } else if (apntDiv === '2') {
      // ?πÏßÑ???†ÌÉù?òÎ©¥ Î∞úÎ†πÏßÅÏúÑÎß??ÖÎ†• Í∞Ä??
    } else if (apntDiv === '3') {
      // ?¥Îèô???†ÌÉù?òÎ©¥ Î≥∏Î?/Î∂Ä?úÎßå ?ÖÎ†• Í∞Ä??
    } else if (apntDiv === '4') {
      // ?¥ÏÇ¨Î•??†ÌÉù?òÎ©¥ ?ÖÎ†• Î∂àÍ???
    }

    // Î∞úÎ†πÍµ¨Î∂Ñ Î≥ÄÍ≤???ÎπÑÍ≥† ?§Ï†ï (?àÎ°ú??Î∞úÎ†πÍµ¨Î∂Ñ Í∞??¨Ïö©)
    setAppointmentRemarkWithDiv(apntDiv);
  };

  // AS-IS Î∞úÎ†πÍµ¨Î∂Ñ ?†ÌÉù???òÌï¥ ÎπÑÍ≥† ?¥Ïö© ?êÎèô ?§Ï†ï
  const setAppointmentRemark = () => {
    if (inputData.apntDiv === '3') {
      if (inputData.hqDiv === employeeInfo?.HQ_DIV_CD) {
        setInputData(prev => ({ ...prev, rmk: newFlag ? '' : prev.rmk }));
      } else {
        const newRemark = `Î©?${employeeInfo?.HQ_DIV} Î™?${commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm}`;
        setInputData(prev => ({ ...prev, rmk: newRemark }));
      }
    } else {
      setInputData(prev => ({ ...prev, rmk: saveApntDiv === '3' ? '' : prev.rmk }));
    }
  };

  // Î∞úÎ†πÍµ¨Î∂Ñ Î≥ÄÍ≤???ÎπÑÍ≥† ?§Ï†ï (Î∞úÎ†πÍµ¨Î∂Ñ ?åÎùºÎØ∏ÌÑ∞ Î∞õÏùå)
  const setAppointmentRemarkWithDiv = (apntDiv: string) => {
    if (apntDiv === '3') {
      if (inputData.hqDiv === employeeInfo?.HQ_DIV_CD) {
        setInputData(prev => ({ ...prev, rmk: newFlag ? '' : prev.rmk }));
      } else {
        const newRemark = `Î©?${employeeInfo?.HQ_DIV} Î™?${commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm}`;
        setInputData(prev => ({ ...prev, rmk: newRemark }));
      }
    } else {
      setInputData(prev => ({ ...prev, rmk: saveApntDiv === '3' ? '' : prev.rmk }));
    }
  };

  // AS-IS Î≥∏Î? Î≥ÄÍ≤???Î∂Ä??Î°úÎìú
  const handleHqDivChange = async (hqDiv: string) => {
    const currentDeptDiv = inputData.deptDiv; // ?ÑÏû¨ ?†ÌÉù??Î∂Ä???Ä??
    setInputData(prev => ({ ...prev, hqDiv, deptDiv: '' })); // Î∂Ä??Ï¥àÍ∏∞??

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
        deptDiv: deptData
      }));

      // Î∂Ä??Î™©Î°ù Î°úÎìú ??Í∏∞Ï°¥ Î∂Ä?úÍ? ??Î™©Î°ù???àÏúºÎ©??†ÌÉù, ?ÜÏúºÎ©?Îπ?Í∞?
      if (deptData && Array.isArray(deptData)) {
        const deptExists = deptData.some(dept => dept.data === currentDeptDiv);
        if (deptExists) {
          setInputData(prev => ({ ...prev, deptDiv: currentDeptDiv }));
        }
      }

      // Î∞úÎ†πÍµ¨Î∂Ñ??"3" (?¥Îèô)????ÎπÑÍ≥† Î∞îÎ°ú ?§Ï†ï
      if (inputData.apntDiv === '3') {
        if (hqDiv === employeeInfo?.HQ_DIV_CD) {
          setInputData(prev => ({ ...prev, rmk: newFlag ? '' : prev.rmk }));
        } else {
          const newRemark = `Î©?${employeeInfo?.HQ_DIV} Î™?${commonCodes.hqDiv.find(code => code.codeId === hqDiv)?.codeNm}`;
          setInputData(prev => ({ ...prev, rmk: newRemark }));
        }
      } else {
        setAppointmentRemark();
      }
    } catch (error) {
      console.error('Î∂Ä??Î°úÎìú Ï§??§Î•ò:', error);
    }
  };

  // AS-IS ?ÖÎ†• ?∞Ïù¥??Í≤ÄÏ¶?
  const validateInput = (): boolean => {
    // Î∞úÎ†π?ºÏûê ?ÖÎ†• Ï≤¥ÌÅ¨
    if (!inputData.apntDt) {
      showToast('Î∞úÎ†π?ºÏûêÎ•??ÖÎ†•??Ï£ºÏã≠?úÏöî.', 'warning');
      return false;
    }

    // AS-IS Ï£ºÏÑù Ï≤òÎ¶¨??Í≤ÄÏ¶?Î°úÏßÅ??(Í≥ºÍ±∞ ?∏ÏÇ¨ Î∞úÎ†π?¥Ïö©???±Î°ù??Í∞Ä?•ÌïòÎØÄÎ°?CheckÎ•??òÏ? ?äÏïÑ???úÎã§)
    // ?πÏßÑ??Í≤ΩÏö∞ Î∞úÎ†πÏßÅÏ±Ö??Î∞úÎ†π??ÏßÅÏ±ÖÎ≥¥Îã§ ?íÏïÑ???úÎã§.
    // if (inputData.apntDiv === '2') {
    //   if (Number(inputData.duty) >= Number(employeeInfo?.DUTY_CD || 0)) {
    //     showToast('?πÏßÑ ?Ä?ÅÏù¥ ?ÑÎãô?àÎã§.', 'warning');
    //     return false;
    //   }
    // }
    
    // ?¥Îèô??Í≤ΩÏö∞ Î∞úÎ†πÎ≥∏Î?/Î∂Ä?úÍ? Î∞úÎ†π??Î≥∏Î?/Î∂Ä?úÏ? ?¨Îùº???úÎã§.
    // if (inputData.apntDiv === '3') {
    //   if (inputData.hqDiv === employeeInfo?.HQ_DIV_CD && inputData.deptDiv === employeeInfo?.DEPT_DIV_CD) {
    //     showToast('Î∞úÎ†πÎ≥∏Î?(Î∂Ä??Í∞Ä Í∞ôÏúºÎ©?Î∂Ä???¥Îèô ?Ä?ÅÏù¥ ?ÑÎãô?àÎã§.', 'warning');
    //     return false;
    //   }
    // }

    return true;
  };

  // AS-IS ?Ä??Î≤ÑÌäº ?¥Î¶≠
  const handleSave = async () => {
    if (!validateInput()) return;

    showConfirm({
      message: newFlag ? '?àÎ°ú???∏ÏÇ¨Î∞úÎ†π???±Î°ù?òÏãúÍ≤†Ïäµ?àÍπå?' : '?∏ÏÇ¨Î∞úÎ†π???òÏ†ï?òÏãúÍ≤†Ïäµ?àÍπå?',
      type: 'info',
      onConfirm: async () => {
        setIsLoading(true);
        setError(null);

        try {
          
          // AS-IS MXMLÍ≥??ôÏùº??Î∞úÎ†π?ºÏûê ?ïÏãù Î≥Ä??
          const formatDateForProc = (dateStr: string) => {
            if (!dateStr) return '';
            return dateStr.replace(/[\/-]/g, ''); // YYYY/MM/DD ??YYYYMMDD
          };
          
          const params = [
            newFlag ? 'NEW' : 'MOD', // ?ºÍ¥Ñ?±Î°ù ?∞Ïù¥??
            employeeInfo?.EMP_NO, // ?¨ÏõêÎ≤àÌò∏
            newFlag ? '' : inputData.seqNo, // ?ºÎ†®Î≤àÌò∏ (NEW???åÎäî Îπ?Í∞? MOD???åÎäî Í∏∞Ï°¥ ?ºÎ†®Î≤àÌò∏)
            inputData.apntDiv, // Î∞úÎ†πÍµ¨Î∂Ñ
            formatDateForProc(inputData.apntDt), // Î∞úÎ†π?ºÏûê (YYYYMMDD ?ïÏãù)
            inputData.hqDiv, // ?¨ÏóÖÎ≥∏Î?Íµ¨Î∂ÑÏΩîÎìú (113)
            inputData.deptDiv, // Î∂Ä?úÍµ¨Î∂ÑÏΩî??(112)
            inputData.duty, // ÏßÅÏ±ÖÏΩîÎìú(116)
            inputData.rmk, // ÎπÑÍ≥†
            user?.userId || 'system' // Î°úÍ∑∏?∏ÏÇ¨?©Ïûê (?§Ï†ú ?∏ÏÖò?êÏÑú Í∞Ä?∏Ïò¥)
          ].join('|');



          const response = await fetch('/api/psm/appointment/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: newFlag ? 'NEW' : 'MOD',
              empNo: employeeInfo?.EMP_NO,
              seqNo: inputData.seqNo ? String(inputData.seqNo) : '',
              apntDiv: inputData.apntDiv,
              apntDt: formatDateForProc(inputData.apntDt),
              hqDivCd: inputData.hqDiv,
              deptDivCd: inputData.deptDiv,
              dutyCd: inputData.duty,
              rmk: inputData.rmk,
              userId: user?.userId || 'system' // Î°úÍ∑∏?∏ÏÇ¨?©Ïûê ID Ï∂îÍ?
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              showToast('?Ä?•Îêò?àÏäµ?àÎã§.', 'info');
              
              // AS-IS: ?¨ÏõêÎ¶¨Ïä§???¨Ï°∞??Î∞??ÑÏû¨ ?¨ÏõêÎ≤àÌò∏ ?§Ï†ï
              // parentDocument.prf_PsmSearch("psm_01_0130.apntSpecSaveHandler()....");
              // parentDocument.curEmpNo = txtEmpNo.text;
              
              searchAppointmentList();
              handleNew();
            } else {
              setError(result.message || '?Ä?•Ïóê ?§Ìå®?àÏäµ?àÎã§.');
              showToast(result.message || '?Ä?•Ïóê ?§Ìå®?àÏäµ?àÎã§.', 'error');
            }
          } else {
            throw new Error('?Ä?•Ïóê ?§Ìå®?àÏäµ?àÎã§.');
          }
        } catch (error) {
          console.error('?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ ?Ä??Ï§??§Î•ò:', error);
          const errorMessage = error instanceof Error ? error.message : '?Ä??Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => {
        // ?∏ÏÇ¨Î∞úÎ†π ?Ä??Ï∑®ÏÜå
      }
    });
  };

  // AS-IS ??†ú Î≤ÑÌäº ?¥Î¶≠
  const handleDelete = async () => {
    if (!inputData.seqNo) {
      showToast('??†ú???∏ÏÇ¨Î∞úÎ†π?¥Ïó≠???†ÌÉù??Ï£ºÏã≠?úÏöî.', 'warning');
      return;
    }

    showConfirm({
      message: '?ïÎßê ??†ú?òÏãúÍ≤†Ïäµ?àÍπå? ???ëÏóÖ?Ä ?òÎèåÎ¶????ÜÏäµ?àÎã§.',
      type: 'warning',
      onConfirm: async () => {
        setIsLoading(true);
        setError(null);

        try {

          
          const response = await fetch('/api/psm/appointment/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              empNo: employeeInfo?.EMP_NO,
              seqNo: inputData.seqNo ? String(inputData.seqNo) : '',
              userId: user?.userId || 'system' // Î°úÍ∑∏?∏ÏÇ¨?©Ïûê ID Ï∂îÍ?
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              showToast('??†ú?òÏóà?µÎãà??', 'info');
              searchAppointmentList();
              handleNew();
              // AS-IS: btnDel.enabled = false
            } else {
              setError(result.message || '??†ú???§Ìå®?àÏäµ?àÎã§.');
              showToast(result.message || '??†ú???§Ìå®?àÏäµ?àÎã§.', 'error');
            }
          } else {
            throw new Error('??†ú???§Ìå®?àÏäµ?àÎã§.');
          }
            } catch (error) {
          console.error('?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ ??†ú Ï§??§Î•ò:', error);
          const errorMessage = error instanceof Error ? error.message : '??†ú Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
              onCancel: () => {
          // ?∏ÏÇ¨Î∞úÎ†π ??†ú Ï∑®ÏÜå
        }
    });
  };

  // AS-IS ?†Í∑ú Î≤ÑÌäº ?¥Î¶≠
  const handleNew = () => {
    setNewFlag(true);
    initAppointmentInput();
    // AS-IS: this.btnSave.enabled = true, this.btnDel.enabled = false
    setSelectedAppointment(null);
  };

  // AS-IS ?†Ïßú ?úÏãú ?ïÏãù Î≥Ä???®Ïàò
  const formatDateForDisplay = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    // YYYYMMDD ??YYYY/MM/DD ?ïÏãù?ºÎ°ú Î≥Ä??
    if (dateStr.length === 8) {
      return `${dateStr.substring(0, 4)}/${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}`;
    }
    return dateStr;
  };

  // AS-IS ?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ ?îÎ∏î?¥Î¶≠
  const handleAppointmentDoubleClick = async (event: RowDoubleClickedEvent) => {
    const appointment = event.data as AppointmentData;
    if (!appointment) return;

    setSelectedAppointment(appointment);
    setNewFlag(false);

    // Î∞úÎ†π?ºÏûê ?ïÏãù Î≥Ä?? "2024/09/01" ??"2024-09-01"
    const formatDateForInput = (dateStr: string) => {
      if (!dateStr) return '';
      return dateStr.replace(/\//g, '-');
    };

    // Î∞úÎ†πÎ∂Ä??Î™©Î°ù Î°úÎìú
    if (appointment.HQ_DIV_CD) {
      try {
        const response = await fetch('/api/psm/dept-by-hq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            searchType: '2',
            includeAll: 'N',
            hqDivCd: appointment.HQ_DIV_CD
          })
        });
        const deptResult = await response.json();
        const deptData = deptResult.success ? deptResult.data : [];
        
        setCommonCodes(prev => ({
          ...prev,
          deptDiv: deptData || []
        }));
      } catch (error) {
        console.error('Î∂Ä??Î°úÎìú Ï§??§Î•ò:', error);
      }
    }

    setInputData({
      apntDiv: appointment.APNT_DIV || '2',
      apntDt: formatDateForInput(appointment.APNT_DT || ''),
      hqDiv: appointment.HQ_DIV_CD || '',
      deptDiv: appointment.DEPT_DIV_CD || '',
      duty: appointment.DUTY_CD || '',
      rmk: appointment.RMK || '',
      seqNo: appointment.SEQ_NO || ''
    });

    setSaveApntDiv(appointment.APNT_DIV || '2');
    
    // AS-IS: this.btnSave.enabled = true, this.btnDel.enabled = true
  };

  // PSM1010M00?êÏÑú ?†ÌÉù???¨Ïõê???êÎ≥∏ ?ïÎ≥¥ ?¨Ïö©
  const currentEmployee = selectedEmployee || employeeInfo;

  return (
    <div className={`flex flex-col ${isTab ? 'flex-1 min-h-0' : 'h-full'} overflow-auto`}>
      {/* AS-IS Í∞úÏù∏ ?åÏÇ¨ ?ïÎ≥¥ */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[80px]">?ÖÏ≤¥Î™?/th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.CRPN_NM || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">?¨ÏõêÎ≤àÌò∏</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.EMP_NO || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">?¨ÏõêÎ™?/th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.EMP_NM || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">?ÖÏÇ¨?ºÏûê</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={formatDateForDisplay(currentEmployee?.ENTR_DT)} readOnly />
              </td>
              <th className="search-th w-[80px]">?¥ÏÇ¨?ºÏûê</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={formatDateForDisplay(currentEmployee?.RETIR_DT)} readOnly />
              </td>
            </tr>
            <tr className="search-tr">
              <th className="search-th w-[80px]">Î≥∏Î?</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.HQ_DIV || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">Î∂Ä??/th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.DEPT_DIV || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">ÏßÅÏ±Ö</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.DUTY || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">Í∑ºÎ¨¥?ÅÌÉú</th>
              <td className="search-td">
                <input type="text" className="input-base input-default !w-[150px]" value={currentEmployee?.WKG_ST_DIV || ''} readOnly />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* AS-IS ?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ */}
        <div className="w-1/2 flex flex-col">
          <div className="tit_area">
            <h3>?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠</h3>
          </div>
          <div>
            <DataGrid
              rowData={appointmentList}
              columnDefs={[
                { headerName: 'No', valueGetter: (params: any) => params.node.rowIndex + 1, width: 70 },
                { headerName: 'Íµ¨Î∂Ñ', field: 'APNT_DIV_NM', width: 100 },
                { headerName: 'Î∞úÎ†π?ºÏûê', field: 'APNT_DT', width: 120 },
                { headerName: 'Î≥∏Î?', field: 'HQ_DIV_NM', width: 120 },
                { headerName: 'Î∂Ä??, field: 'DEPT_DIV_NM', width: 120 },
                { headerName: 'ÏßÅÏ±Ö', field: 'DUTY_NM', width: 120 },
                { headerName: 'ÎπÑÍ≥†', field: 'RMK', flex: 1 },
              ]}
              height="300px"
              onRowSelected={undefined}
              onGridReady={undefined}
              onRowDoubleClicked={handleAppointmentDoubleClick}
              enablePagination={false}
              enableSelection={false}
              enableExport={false}
              enableSorting={true}
              enableFiltering={true}
              className="ag-custom"
            />
          </div>
          <p className="text-[13px] text-[#00509A] py-1">
            ??2010???¥Ï†Ñ Î∞úÎ†πÍ±¥Ï? Î∞úÎ†π?¥Ïö© ???¨Ìï®?¨Î? Ï∞®Ïù¥Î°??¨Ïã§Í≥??§Î¶Ö?àÎã§.
          </p>
        </div>

        {/* AS-IS ?∏ÏÇ¨Î∞úÎ†π?±Î°ù */}
        <div className="w-1/2 flex flex-col">
          <div className="tit_area">
            <h3>?∏ÏÇ¨Î∞úÎ†π?±Î°ù</h3>
          </div>
          <div className="flex-1">
            <table className="form-table">
              <tbody>
                <tr className="form-tr">
                  <th className="form-th w-[100px]">Î∞úÎ†πÍµ¨Î∂Ñ</th>
                  <td className="form-td">
                    <select 
                      className="combo-base w-full"
                      value={inputData.apntDiv}
                      onChange={(e) => handleApntDivChange(e.target.value)}
                    >
                      {commonCodes.apntDiv.map(code => (
                        <option key={code.codeId} value={code.codeId}>{code.codeNm}</option>
                      ))}
                    </select>
                  </td>
                  <th className="form-th w-[100px]">Î∞úÎ†π?ºÏûê</th>
                  <td className="form-td">
                    <input 
                      type="date" 
                      data-field="apntDt"
                      className="input-base input-default w-full"
                      value={inputData.apntDt}
                      onChange={(e) => setInputData(prev => ({ ...prev, apntDt: e.target.value }))}
                    />
                  </td>
                </tr>
                <tr className="form-tr">
                  <th className="form-th">Î∞úÎ†πÎ≥∏Î?</th>
                  <td className="form-td">
                    <select 
                      className="combo-base w-full"
                      value={inputData.hqDiv}
                      onChange={(e) => handleHqDivChange(e.target.value)}
                      disabled={inputData.apntDiv === '2' || inputData.apntDiv === '4'}
                    >
                      {commonCodes.hqDiv.map(code => (
                        <option key={code.codeId} value={code.codeId}>{code.codeNm}</option>
                      ))}
                    </select>
                  </td>
                  <th className="form-th">Î∞úÎ†πÎ∂Ä??/th>
                  <td className="form-td">
                    <select 
                      className="combo-base w-full"
                      value={inputData.deptDiv}
                      onChange={(e) => setInputData(prev => ({ ...prev, deptDiv: e.target.value }))}
                      disabled={inputData.apntDiv === '2' || inputData.apntDiv === '4'}
                    >
                      <option value="">?†ÌÉù?òÏÑ∏??/option>
                      {commonCodes.deptDiv.map(code => (
                        <option key={code.DATA} value={code.DATA}>
                          {code.LABEL}
                        </option>
                      ))}
                    </select>

                  </td>
                </tr>
                <tr className="form-tr">
                  <th className="form-th">Î∞úÎ†πÏßÅÏúÑ</th>
                  <td className="form-td">
                    <select 
                      className="combo-base w-full"
                      data-field="duty"
                      value={inputData.duty}
                      onChange={(e) => setInputData(prev => ({ ...prev, duty: e.target.value }))}
                      disabled={inputData.apntDiv === '3' || inputData.apntDiv === '4'}
                    >
                      {commonCodes.duty.map(code => (
                        <option key={code.codeId} value={code.codeId}>{code.codeNm}</option>
                      ))}
                    </select>
                  </td>
                  <th className="form-th align-top pt-2">ÎπÑÍ≥†</th>
                  <td className="form-td" rowSpan={2}>
                    <textarea 
                      className="textarea_def w-full min-h-[80px]"
                      value={inputData.rmk}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // UTF-8 Î∞îÏù¥????Í≥ÑÏÇ∞
                        const byteLength = new TextEncoder().encode(newValue).length;
                        
                        if (byteLength <= 500) {
                          setInputData(prev => ({ ...prev, rmk: newValue }));
                        } else {
                          showToast(`ÎπÑÍ≥†??500Î∞îÏù¥?∏ÍπåÏßÄ ?ÖÎ†• Í∞Ä?•Ìï©?àÎã§. (?ÑÏû¨: ${byteLength}Î∞îÏù¥??`, 'warning');
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
                disabled={!currentEmployee?.EMP_NO}
              >
                ?†Í∑ú
              </button>
              <button 
                className="btn-base btn-act"
                onClick={handleSave}
                disabled={isLoading || !currentEmployee?.EMP_NO}
              >
                {isLoading ? '?Ä?•Ï§ë...' : '?Ä??}
              </button>
              <button 
                className="btn-base btn-delete"
                onClick={handleDelete}
                disabled={isLoading || !inputData.seqNo}
              >
                ??†ú
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ?êÎü¨ Î©îÏãúÏßÄ */}
      {error && (
        <div className="text-red-500 text-sm mt-2 px-1">
          {error}
        </div>
      )}
    </div>
  );
});

export default PSM1030M00;

