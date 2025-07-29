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
 * PSM1030M00 - ?�사발령?�역 관�??�면
 * 
 * ?�원???�사발령 ?�역??조회?�고 관리하???�면?�니??
 * ?�사발령 ?�록, ?�정, ??�� 기능???�공?�며 AG Grid�??�용?�여 목록???�시?�니??
 * 
 * 주요 기능:
 * - ?�사발령?�역 조회 �?검??
 * - ?�사발령 ?�록/?�정/??��
 * - 본�?�?부??조회
 * - AG Grid�??�용??발령?�역 목록 ?�시
 * 
 * AS-IS: PSM_01_0130.mxml (?�사발령?�역 관�?
 * TO-BE: React 기반 ?�사발령 관�??�면
 * 
 * ?�용 ?�시:
 * ```tsx
 * // PSM1010M00????���??�용
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
  /** ?�택???�원 ?�보 (PSM1010M00?�서 ?�달) */
  selectedEmployee?: EmployeeListData | null;
  /** ??모드 ?��? */
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

  // AS-IS 공통 코드 ?�태
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

  // AS-IS ?�력 ?�이???�태
  const [inputData, setInputData] = useState({
    apntDiv: '2', // 발령구분 (기본�? ?�진)
    apntDt: '', // 발령?�자
    hqDiv: '', // 발령본�?
    deptDiv: '', // 발령부??
    duty: '', // 발령직위
    rmk: '', // 비고
    seqNo: '' // ?�련번호
  });



  // AS-IS 공통 코드 로드
  const loadCommonCodes = async () => {
    try {
      // 발령구분 코드 로드 (AS-IS: cbApntDiv.setLargeCode('018',''))
      const apntDivResponse = await fetch('/api/common/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ largeCategoryCode: '018' })
      });
      const apntDivResult = await apntDivResponse.json();
      const apntDivData = apntDivResult.data || [];

      // 본�? 코드 로드 (AS-IS: cbHqDiv.setLargeCode('113', '00'))
      const hqResponse = await fetch('/api/common/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ largeCategoryCode: '113' })
      });
      const hqResult = await hqResponse.json();
      const hqData = hqResult.data || [];

      // 직책 코드 로드 (AS-IS: cbDuty.setLargeCode('116','9'))
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
      console.error('공통 코드 로드 �??�류:', error);
    }
  };

  // AS-IS ?�사발령?�역 조회 (PSM_01_0131_S ?�로?��? ?�출)
  const searchAppointmentList = useCallback(async () => {
    // employeeInfo ?�??selectedEmployee�?직접 ?�용?�여 ?�?�밍 문제 ?�결
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
          setError(result.message || '조회???�패?�습?�다.');
        }
      } else {
        throw new Error('조회???�패?�습?�다.');
      }
    } catch (error) {
      console.error('?�사발령?�역 조회 �??�류:', error);
      setError(error instanceof Error ? error.message : '조회 �??�류가 발생?�습?�다.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEmployee?.EMP_NO, employeeInfo?.EMP_NO]);

  // ?��??�서 ?�출?????�는 ?�수?�을 ref�??�출
  useImperativeHandle(ref, () => ({
    initialize: () => {
      // PSM1030M00 초기??
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

  // AS-IS 초기??로직
  useEffect(() => {
    if (selectedEmployee) {
      setEmployeeInfo(selectedEmployee);
      loadCommonCodes();
      searchAppointmentList();
      initAppointmentInput();
    }
  }, [selectedEmployee?.EMP_NO, searchAppointmentList]); // EMP_NO가 변경될 ?�만 ?�행

  // AS-IS ?�사발령?�역 ?�????기본?�보 ?�조??
  const setAppointmentBasicInfo = () => {
    // PSM1010M00?�서 ?�택???�원???�본 ?�보???��??�고, 
    // ?�사발령?�역??최신 ?�보??별도�?관�?
    // ?�단??본�?, 부?�는 ?�본 ?�원 ?�보�?그�?�??�용
  };

  // AS-IS ?�사발령?�록 ?�력 ??�� 초기??
  const initAppointmentInput = () => {
    // PSM1010M00?�서 ?�택???�원???�본 ?�보 ?�용
    const currentEmployee = selectedEmployee || employeeInfo;
    if (!currentEmployee) return;

    setInputData({
      apntDiv: '2', // 발령구분 (기본�? ?�진)
      apntDt: '', // 발령?�자
      hqDiv: currentEmployee.HQ_DIV_CD || '',
      deptDiv: currentEmployee.DEPT_DIV_CD || '',
      duty: currentEmployee.DUTY_CD || '',
      rmk: '', // 비고
      seqNo: '' // ?�련번호
    });

    setSaveApntDiv('2');
    setNewFlag(true);
  };

  // AS-IS 발령구분 변�???
  const handleApntDivChange = (apntDiv: string) => {
    setInputData(prev => ({ ...prev, apntDiv }));
    setSaveApntDiv(apntDiv);

    // AS-IS?� ?�일??로직: 발령구분???�른 ?�력 ?�드 ?�성??비활?�화
    if (apntDiv === '1') {
      // ?�사 발령 ?�록?� 모두 ?�력 가??
    } else if (apntDiv === '2') {
      // ?�진???�택?�면 발령직위�??�력 가??
    } else if (apntDiv === '3') {
      // ?�동???�택?�면 본�?/부?�만 ?�력 가??
    } else if (apntDiv === '4') {
      // ?�사�??�택?�면 ?�력 불�???
    }

    // 발령구분 변�???비고 ?�정 (?�로??발령구분 �??�용)
    setAppointmentRemarkWithDiv(apntDiv);
  };

  // AS-IS 발령구분 ?�택???�해 비고 ?�용 ?�동 ?�정
  const setAppointmentRemark = () => {
    if (inputData.apntDiv === '3') {
      if (inputData.hqDiv === employeeInfo?.HQ_DIV_CD) {
        setInputData(prev => ({ ...prev, rmk: newFlag ? '' : prev.rmk }));
      } else {
        const newRemark = `�?${employeeInfo?.HQ_DIV} �?${commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm}`;
        setInputData(prev => ({ ...prev, rmk: newRemark }));
      }
    } else {
      setInputData(prev => ({ ...prev, rmk: saveApntDiv === '3' ? '' : prev.rmk }));
    }
  };

  // 발령구분 변�???비고 ?�정 (발령구분 ?�라미터 받음)
  const setAppointmentRemarkWithDiv = (apntDiv: string) => {
    if (apntDiv === '3') {
      if (inputData.hqDiv === employeeInfo?.HQ_DIV_CD) {
        setInputData(prev => ({ ...prev, rmk: newFlag ? '' : prev.rmk }));
      } else {
        const newRemark = `�?${employeeInfo?.HQ_DIV} �?${commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm}`;
        setInputData(prev => ({ ...prev, rmk: newRemark }));
      }
    } else {
      setInputData(prev => ({ ...prev, rmk: saveApntDiv === '3' ? '' : prev.rmk }));
    }
  };

  // AS-IS 본�? 변�???부??로드
  const handleHqDivChange = async (hqDiv: string) => {
    const currentDeptDiv = inputData.deptDiv; // ?�재 ?�택??부???�??
    setInputData(prev => ({ ...prev, hqDiv, deptDiv: '' })); // 부??초기??

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

      // 부??목록 로드 ??기존 부?��? ??목록???�으�??�택, ?�으�?�?�?
      if (deptData && Array.isArray(deptData)) {
        const deptExists = deptData.some(dept => dept.data === currentDeptDiv);
        if (deptExists) {
          setInputData(prev => ({ ...prev, deptDiv: currentDeptDiv }));
        }
      }

      // 발령구분??"3" (?�동)????비고 바로 ?�정
      if (inputData.apntDiv === '3') {
        if (hqDiv === employeeInfo?.HQ_DIV_CD) {
          setInputData(prev => ({ ...prev, rmk: newFlag ? '' : prev.rmk }));
        } else {
          const newRemark = `�?${employeeInfo?.HQ_DIV} �?${commonCodes.hqDiv.find(code => code.codeId === hqDiv)?.codeNm}`;
          setInputData(prev => ({ ...prev, rmk: newRemark }));
        }
      } else {
        setAppointmentRemark();
      }
    } catch (error) {
      console.error('부??로드 �??�류:', error);
    }
  };

  // AS-IS ?�력 ?�이??검�?
  const validateInput = (): boolean => {
    // 발령?�자 ?�력 체크
    if (!inputData.apntDt) {
      showToast('발령?�자�??�력??주십?�요.', 'warning');
      return false;
    }

    // AS-IS 주석 처리??검�?로직??(과거 ?�사 발령?�용???�록??가?�하므�?Check�??��? ?�아???�다)
    // ?�진??경우 발령직책??발령??직책보다 ?�아???�다.
    // if (inputData.apntDiv === '2') {
    //   if (Number(inputData.duty) >= Number(employeeInfo?.DUTY_CD || 0)) {
    //     showToast('?�진 ?�?�이 ?�닙?�다.', 'warning');
    //     return false;
    //   }
    // }
    
    // ?�동??경우 발령본�?/부?��? 발령??본�?/부?��? ?�라???�다.
    // if (inputData.apntDiv === '3') {
    //   if (inputData.hqDiv === employeeInfo?.HQ_DIV_CD && inputData.deptDiv === employeeInfo?.DEPT_DIV_CD) {
    //     showToast('발령본�?(부??가 같으�?부???�동 ?�?�이 ?�닙?�다.', 'warning');
    //     return false;
    //   }
    // }

    return true;
  };

  // AS-IS ?�??버튼 ?�릭
  const handleSave = async () => {
    if (!validateInput()) return;

    showConfirm({
      message: newFlag ? '?�로???�사발령???�록?�시겠습?�까?' : '?�사발령???�정?�시겠습?�까?',
      type: 'info',
      onConfirm: async () => {
        setIsLoading(true);
        setError(null);

        try {
          
          // AS-IS MXML�??�일??발령?�자 ?�식 변??
          const formatDateForProc = (dateStr: string) => {
            if (!dateStr) return '';
            return dateStr.replace(/[\/-]/g, ''); // YYYY/MM/DD ??YYYYMMDD
          };
          
          const params = [
            newFlag ? 'NEW' : 'MOD', // ?�괄?�록 ?�이??
            employeeInfo?.EMP_NO, // ?�원번호
            newFlag ? '' : inputData.seqNo, // ?�련번호 (NEW???�는 �?�? MOD???�는 기존 ?�련번호)
            inputData.apntDiv, // 발령구분
            formatDateForProc(inputData.apntDt), // 발령?�자 (YYYYMMDD ?�식)
            inputData.hqDiv, // ?�업본�?구분코드 (113)
            inputData.deptDiv, // 부?�구분코??(112)
            inputData.duty, // 직책코드(116)
            inputData.rmk, // 비고
            user?.userId || 'system' // 로그?�사?�자 (?�제 ?�션?�서 가?�옴)
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
              userId: user?.userId || 'system' // 로그?�사?�자 ID 추�?
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              showToast('?�?�되?�습?�다.', 'info');
              
              // AS-IS: ?�원리스???�조??�??�재 ?�원번호 ?�정
              // parentDocument.prf_PsmSearch("psm_01_0130.apntSpecSaveHandler()....");
              // parentDocument.curEmpNo = txtEmpNo.text;
              
              searchAppointmentList();
              handleNew();
            } else {
              setError(result.message || '?�?�에 ?�패?�습?�다.');
              showToast(result.message || '?�?�에 ?�패?�습?�다.', 'error');
            }
          } else {
            throw new Error('?�?�에 ?�패?�습?�다.');
          }
        } catch (error) {
          console.error('?�사발령?�역 ?�??�??�류:', error);
          const errorMessage = error instanceof Error ? error.message : '?�??�??�류가 발생?�습?�다.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => {
        // ?�사발령 ?�??취소
      }
    });
  };

  // AS-IS ??�� 버튼 ?�릭
  const handleDelete = async () => {
    if (!inputData.seqNo) {
      showToast('??��???�사발령?�역???�택??주십?�요.', 'warning');
      return;
    }

    showConfirm({
      message: '?�말 ??��?�시겠습?�까? ???�업?� ?�돌�????�습?�다.',
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
              userId: user?.userId || 'system' // 로그?�사?�자 ID 추�?
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              showToast('??��?�었?�니??', 'info');
              searchAppointmentList();
              handleNew();
              // AS-IS: btnDel.enabled = false
            } else {
              setError(result.message || '??��???�패?�습?�다.');
              showToast(result.message || '??��???�패?�습?�다.', 'error');
            }
          } else {
            throw new Error('??��???�패?�습?�다.');
          }
            } catch (error) {
          console.error('?�사발령?�역 ??�� �??�류:', error);
          const errorMessage = error instanceof Error ? error.message : '??�� �??�류가 발생?�습?�다.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
              onCancel: () => {
          // ?�사발령 ??�� 취소
        }
    });
  };

  // AS-IS ?�규 버튼 ?�릭
  const handleNew = () => {
    setNewFlag(true);
    initAppointmentInput();
    // AS-IS: this.btnSave.enabled = true, this.btnDel.enabled = false
    setSelectedAppointment(null);
  };

  // AS-IS ?�짜 ?�시 ?�식 변???�수
  const formatDateForDisplay = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    // YYYYMMDD ??YYYY/MM/DD ?�식?�로 변??
    if (dateStr.length === 8) {
      return `${dateStr.substring(0, 4)}/${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}`;
    }
    return dateStr;
  };

  // AS-IS ?�사발령?�역 ?�블?�릭
  const handleAppointmentDoubleClick = async (event: RowDoubleClickedEvent) => {
    const appointment = event.data as AppointmentData;
    if (!appointment) return;

    setSelectedAppointment(appointment);
    setNewFlag(false);

    // 발령?�자 ?�식 변?? "2024/09/01" ??"2024-09-01"
    const formatDateForInput = (dateStr: string) => {
      if (!dateStr) return '';
      return dateStr.replace(/\//g, '-');
    };

    // 발령부??목록 로드
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
        console.error('부??로드 �??�류:', error);
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

  // PSM1010M00?�서 ?�택???�원???�본 ?�보 ?�용
  const currentEmployee = selectedEmployee || employeeInfo;

  return (
    <div className={`flex flex-col ${isTab ? 'flex-1 min-h-0' : 'h-full'} overflow-auto`}>
      {/* AS-IS 개인 ?�사 ?�보 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[80px]">?�체�?/th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.CRPN_NM || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">?�원번호</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.EMP_NO || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">?�원�?/th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.EMP_NM || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">?�사?�자</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={formatDateForDisplay(currentEmployee?.ENTR_DT)} readOnly />
              </td>
              <th className="search-th w-[80px]">?�사?�자</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={formatDateForDisplay(currentEmployee?.RETIR_DT)} readOnly />
              </td>
            </tr>
            <tr className="search-tr">
              <th className="search-th w-[80px]">본�?</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.HQ_DIV || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">부??/th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.DEPT_DIV || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">직책</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.DUTY || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">근무?�태</th>
              <td className="search-td">
                <input type="text" className="input-base input-default !w-[150px]" value={currentEmployee?.WKG_ST_DIV || ''} readOnly />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* AS-IS ?�사발령?�역 */}
        <div className="w-1/2 flex flex-col">
          <div className="tit_area">
            <h3>?�사발령?�역</h3>
          </div>
          <div>
            <DataGrid
              rowData={appointmentList}
              columnDefs={[
                { headerName: 'No', valueGetter: (params: any) => params.node.rowIndex + 1, width: 70 },
                { headerName: '구분', field: 'APNT_DIV_NM', width: 100 },
                { headerName: '발령?�자', field: 'APNT_DT', width: 120 },
                { headerName: '본�?', field: 'HQ_DIV_NM', width: 120 },
                { headerName: '부??, field: 'DEPT_DIV_NM', width: 120 },
                { headerName: '직책', field: 'DUTY_NM', width: 120 },
                { headerName: '비고', field: 'RMK', flex: 1 },
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
            ??2010???�전 발령건�? 발령?�용 ???�함?��? 차이�??�실�??�릅?�다.
          </p>
        </div>

        {/* AS-IS ?�사발령?�록 */}
        <div className="w-1/2 flex flex-col">
          <div className="tit_area">
            <h3>?�사발령?�록</h3>
          </div>
          <div className="flex-1">
            <table className="form-table">
              <tbody>
                <tr className="form-tr">
                  <th className="form-th w-[100px]">발령구분</th>
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
                  <th className="form-th w-[100px]">발령?�자</th>
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
                  <th className="form-th">발령본�?</th>
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
                  <th className="form-th">발령부??/th>
                  <td className="form-td">
                    <select 
                      className="combo-base w-full"
                      value={inputData.deptDiv}
                      onChange={(e) => setInputData(prev => ({ ...prev, deptDiv: e.target.value }))}
                      disabled={inputData.apntDiv === '2' || inputData.apntDiv === '4'}
                    >
                      <option value="">?�택?�세??/option>
                      {commonCodes.deptDiv.map(code => (
                        <option key={code.DATA} value={code.DATA}>
                          {code.LABEL}
                        </option>
                      ))}
                    </select>

                  </td>
                </tr>
                <tr className="form-tr">
                  <th className="form-th">발령직위</th>
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
                  <th className="form-th align-top pt-2">비고</th>
                  <td className="form-td" rowSpan={2}>
                    <textarea 
                      className="textarea_def w-full min-h-[80px]"
                      value={inputData.rmk}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // UTF-8 바이????계산
                        const byteLength = new TextEncoder().encode(newValue).length;
                        
                        if (byteLength <= 500) {
                          setInputData(prev => ({ ...prev, rmk: newValue }));
                        } else {
                          showToast(`비고??500바이?�까지 ?�력 가?�합?�다. (?�재: ${byteLength}바이??`, 'warning');
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
                ?�규
              </button>
              <button 
                className="btn-base btn-act"
                onClick={handleSave}
                disabled={isLoading || !currentEmployee?.EMP_NO}
              >
                {isLoading ? '?�?�중...' : '?�??}
              </button>
              <button 
                className="btn-base btn-delete"
                onClick={handleDelete}
                disabled={isLoading || !inputData.seqNo}
              >
                ??��
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ?�러 메시지 */}
      {error && (
        <div className="text-red-500 text-sm mt-2 px-1">
          {error}
        </div>
      )}
    </div>
  );
});

export default PSM1030M00;

