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
  onRegisterSuccess?: () => void; // ?�록 ?�공 ???�위 ?�면 ?�조??콜백
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
    rmk: '' // 비고
  });

  // AS-IS ?�드 ?�성??비활?�화 ?�태
  const [fieldEnableState, setFieldEnableState] = useState({
    hqDiv: false,
    deptDiv: false,
    duty: true
  });

  // AS-IS 초기??로직
  useEffect(() => {
    const initializeComponent = async () => {
      await loadCommonCodes();
      initScreen();
      setIsInitialized(true);
    };
    initializeComponent();
  }, []);

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
        apntDiv: apntDivData || [],
        hqDiv: hqData || [],
        deptDiv: [],
        duty: dutyData || []
      });
    } catch (error) {
      console.error('공통 코드 로드 �??�류:', error);
    }
  };

  // AS-IS ?�면 초기??
  const initScreen = () => {
    setInputData({
      apntDiv: '2',
      apntDt: '',
      hqDiv: '',
      deptDiv: '',
      duty: '9', // AS-IS?� ?�일: cbDuty.setLargeCode('116','9')??기본�?
      rmk: ''
    });
    
    // AS-IS?� ?�일???�력 ?�드 ?�성??비활?�화
    setFieldEnableState({
      hqDiv: false,
      deptDiv: false,
      duty: true
    });
    
    handleListClear();
  };

  // AS-IS ?�사발령 ?�?�자 리스?�에 추�?
  const addAppointmentTarget = (employee: EmployeeListData) => {
    const validationResult = validateAppointmentTarget(employee);
    if (!validationResult) return;

    let remark = '';
    // AS-IS?� ?�일??비고 로직
    if (inputData.apntDiv === '3') {
      const selectedHqLabel = commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm;
      if (employee.HQ_DIV === selectedHqLabel) {
        remark = inputData.rmk;
      } else {
        remark = `�?${employee.HQ_DIV} �?${selectedHqLabel}`;
      }
    } else {
      remark = inputData.rmk;
    }

    // AS-IS?� ?�일???�이??구조�??�성
    const newTarget: AppointmentTargetData = {
      APNT_DIV_NM: commonCodes.apntDiv.find(code => code.codeId === inputData.apntDiv)?.codeNm, // 발령구분
      APNT_DT: inputData.apntDt, // 발령?�자
      EMP_NO: employee.EMP_NO, // ?�번
      EMP_NM: employee.EMP_NM, // ?�명
      HQ_DIV_NM: inputData.apntDiv === '3' ? 
                 commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm : 
                 employee.HQ_DIV, // 발령본�?
      DEPT_DIV_NM: inputData.apntDiv === '3' ? 
                   commonCodes.deptDiv.find(code => code.DATA === inputData.deptDiv)?.LABEL : 
                   employee.DEPT_DIV, // 발령부??
      DUTY_NM: inputData.apntDiv === '2' && inputData.duty ? 
               commonCodes.duty.find(code => code.codeId === inputData.duty)?.codeNm : 
               employee.DUTY, // 발령직책 (AS-IS?� ?�일: ?�진???�만 ?�택??직책, �??�에???�재 직책)
      HQ_DIV_NM_BEF: employee.HQ_DIV, // 발령?�본부
      DEPT_DIV_NM_BEF: employee.DEPT_DIV, // 발령?��???
      DUTY_NM_BEF: employee.DUTY, // 발령?�직�?
      RMK: remark, // 비고
      APNT_DIV_CD: inputData.apntDiv, // 발령구분코드
      HQ_DIV_CD: inputData.apntDiv === '3' ? inputData.hqDiv : employee.HQ_DIV_CD, // 발령본�?코드
      DEPT_DIV_CD: inputData.apntDiv === '3' ? inputData.deptDiv : employee.DEPT_DIV_CD, // 발령부?�코??
      DUTY_CD: inputData.apntDiv === '2' ? inputData.duty : employee.DUTY_CD // 발령직책코드
    };

    // AS-IS?� ?�일?�게 배열 ?�에 추�?
    setAppointmentTargets(prev => {
      const newTargets = [...prev, newTarget];
      // AS-IS: 추�????�으�??�크�??�치 ?�정
      setScrollToIndex(newTargets.length - 1);
      return newTargets;
    });
    setCurEmpNo(employee.EMP_NO || '');
  };

  // AS-IS ?�사발령 ?�?�자 검�?
  const validateAppointmentTarget = (employee: EmployeeListData): boolean => {
    // 컴포?�트가 초기?�되지 ?�았?�면 검증하지 ?�음
    if (!isInitialized) {
      return false;
    }

    // AS-IS?� ?�일: ?�록버튼 ?�성 ?��? 체크
    if (!isRegisterEnabled) {
      showToast('?�규 버튼???�릭??주십?�요.', 'warning');
      return false;
    }

    // AS-IS?� ?�일: 발령?�자 ?�력 체크
    if (!inputData.apntDt) {
      showToast('발령?�자�??�력??주십?�요.', 'warning');
      return false;
    }

    // AS-IS?� ?�일: ?�주 ?�력 체크
    if (employee.OWN_OUTS_DIV_CD === '2') {
      showToast('?�주?�력?� ?�사발령 ?�?�이 ?�닙?�다', 'warning');
      return false;
    }

    // AS-IS?� ?�일: ?��? 추�????�원?��? 체크
    const existingIndex = appointmentTargets.findIndex(target => target.EMP_NO === employee.EMP_NO);
    if (existingIndex >= 0) {
      showToast(`${employee.EMP_NM}???�) ?��? ?�사발령 ?�?�자�?추�??�어 ?�습?�다.`, 'warning');
      return false;
    }

    // AS-IS?� ?�일: ?�진??경우 발령직책??발령??직책보다 ?�아???�다
    if (inputData.apntDiv === '2') {
      // AS-IS?� ?�일: ?�진???�는 직책???�택?�어????
      if (!inputData.duty || inputData.duty.trim() === '') {
        showToast('?�진??경우 발령직책???�택??주십?�요.', 'warning');
        return false;
      }
      
      const selectedDutyLabel = commonCodes.duty.find(code => code.codeId === inputData.duty)?.codeNm || '?�택??직책';
      if (parseInt(inputData.duty) >= parseInt(employee.DUTY_CD || '0')) {
        showToast(`${selectedDutyLabel} ?�진 ?�?�이 ?�닙?�다.`, 'warning');
        return false;
      }
    }

    // AS-IS?� ?�일: ?�동??경우 발령본�?/부?��? 발령??본�?/부?��? ?�라???�다
    if (inputData.apntDiv === '3') {
      if (inputData.hqDiv === employee.HQ_DIV_CD && inputData.deptDiv === employee.DEPT_DIV_CD) {
        showToast('발령본�?(부??가 같으�?부???�동 ?�?�이 ?�닙?�다.', 'warning');
        return false;
      }
    }

    return true;
  };

  // AS-IS 발령구분 변�???
  const handleApntDivChange = (apntDiv: string) => {
    setInputData(prev => ({ ...prev, apntDiv }));

    // AS-IS?� ?�일??로직: 발령구분???�른 ?�력 ?�드 ?�성??비활?�화
    if (apntDiv === '1') {
      // AS-IS: ?�사 발령 ?�록?� ?�원관�??�규 ?�록 ???�다
      showToast('???�사?�록?� ?�원?�보 ?�규?�록?�에�?가?�함.', 'info');
      setFieldEnableState({
        hqDiv: false,
        deptDiv: false,
        duty: false
      });
    } else if (apntDiv === '2') {
      // AS-IS: ?�진???�택?�면 발령직위�??�력 가??
      setFieldEnableState({
        hqDiv: false,
        deptDiv: false,
        duty: true
      });
    } else if (apntDiv === '3') {
      // AS-IS: ?�동???�택?�면 본�?/부?�만 ?�력 가??
      setFieldEnableState({
        hqDiv: true,
        deptDiv: true,
        duty: false
      });
    } else if (apntDiv === '4') {
      // AS-IS: ?�사�??�택?�면 ?�력 불�???
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

  // AS-IS 본�? 변�???부??로드
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
      console.error('부??로드 �??�류:', error);
    }
  };

  // AS-IS ?�규 버튼 ?�릭
  const handleNew = () => {
    handleListClear();
    // AS-IS?� ?�일: ?�규 ??기본�??�정
    setInputData(prev => ({
      ...prev,
      duty: '9' // AS-IS?� ?�일: cbDuty.setLargeCode('116','9')??기본�?
    }));
    // ?�록버튼 ?�성??
    setIsRegisterEnabled(true);
  };

  // AS-IS ?�록 버튼 ?�릭
  const handleRegister = async () => {
    if (appointmentTargets.length === 0) {
      showToast('?�록???�?�자가 ?�습?�다.', 'warning');
      return;
    }

    showConfirm({
      message: `${appointmentTargets.length}명의 ?�사발령???�록?�시겠습?�까?`,
      type: 'info',
      onConfirm: async () => {
        setIsLoading(true);
        setError(null);

        try {
          
          // AS-IS?� ?�일???�이??구성
          const appointmentData = makeAppointmentData();
          
          const response = await fetch('/api/psm/appointment/batch-register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              appointmentData,
              userId: user?.userId || 'system' // 로그?�사?�자 (?�제 ?�션?�서 가?�옴)
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              showToast('?�록?�었?�니??', 'info');
              // ???�록??방�??�기 ?�해???�록버튼 비활?�화
              setIsRegisterEnabled(false);
              handleListClear();
              
              // AS-IS: ?�원리스???�조??
              if (onRegisterSuccess) {
                onRegisterSuccess();
              }
            } else {
              setError(result.message || '?�록???�패?�습?�다.');
              showToast(result.message || '?�록???�패?�습?�다.', 'error');
            }
          } else {
            throw new Error('?�록???�패?�습?�다.');
          }
        } catch (error) {
          console.error('?�사발령 ?�괄?�록 �??�류:', error);
          const errorMessage = error instanceof Error ? error.message : '?�록 �??�류가 발생?�습?�다.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => {
        console.log('?�사발령 ?�록 취소');
      }
    });
  };

  // AS-IS ?�록?�이??만들�?
  const makeAppointmentData = (): string => {
    if (appointmentTargets.length === 0) {
      return '';
    }

    let appointmentData = '';
    for (const target of appointmentTargets) {
      appointmentData += `${target.APNT_DIV_CD}^`; // 발령구분
      appointmentData += `${target.APNT_DT?.replace(/-/g, '')}^`; // 발령?�자
      appointmentData += `${target.EMP_NO}^`; // ?�번
      appointmentData += `${target.HQ_DIV_CD}^`; // 본�?코드
      appointmentData += `${target.DEPT_DIV_CD}^`; // 부?�구분코??
      appointmentData += `${target.DUTY_CD}^`; // 직책코드
      appointmentData += `${target.RMK}^`; // 비고
      appointmentData += '|';
    }
    return appointmentData;
  };

  // AS-IS ?�삭??버튼 ?�릭
  const handleRowDelete = (index: number) => {
    if (index < 0 || index >= appointmentTargets.length) return;

    const newTargets = [...appointmentTargets];
    newTargets.splice(index, 1);
    setAppointmentTargets(newTargets);

    // AS-IS?� ?�일??curEmpNo 처리
    if (index > 0 && index >= newTargets.length) {
      setCurEmpNo(newTargets[index - 1].EMP_NO || '');
    }
  };

  // AS-IS 리스??초기??
  const handleListClear = () => {
    setAppointmentTargets([]);
    setCurEmpNo('');
    setScrollToIndex(-1);
  };

  // ?��??�서 ?�원 추�? ?�출 (PSM1000M00?�서 ?�용)
  useEffect(() => {
    if (selectedEmployee) {
      addAppointmentTarget(selectedEmployee);
    }
  }, [selectedEmployee]);

  return (
    <div className={`flex flex-col ${isTab ? 'flex-1 min-h-0' : 'h-full'} overflow-auto`}>
      {/* AS-IS ?�사발령?�용 + ?�?�자 */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* AS-IS ?�쪽 ?�사발령?�용 ?�력 */}
        <div className="w-[320px] flex flex-col">
          <div className="tit_area">
            <h3>?�사발령?�용</h3>
          </div>
          <div className="flex-1">
            <table className="form-table">
              <tbody>
                <tr className="form-tr">
                  <th className="form-th w-[100px]">발령구분</th>
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
                  <th className="form-th">발령?�자</th>
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
                  <th className="form-th">발령본�?</th>
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
                  <th className="form-th">발령부??/th>
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
                  <th className="form-th">발령직위</th>
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
                  <th className="form-th pt-2">비고</th>
                  <td className="form-td">
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
              >
                ?�규
              </button>
              <button 
                className="btn-base btn-act"
                onClick={handleRegister}
                disabled={isLoading || !isRegisterEnabled}
              >
                ?�록
              </button>
            </div>
          </div>
        </div>

        {/* AS-IS ?�른�??�사발령 ?�?�자 */}
        <div className="flex-1 flex flex-col">
          <div className="tit_area justify-between">
            <h3>?�사발령 ?�?�자</h3>
            <div className="flex gap-2">
              <button 
                className="btn-base btn-etc"
                onClick={handleListClear}
              >
                리스?�초기화
              </button>
              <button 
                className="btn-base btn-delete"
                onClick={() => {
                  if (!curEmpNo) {
                    showToast('??��???�을 ?�택??주십?�요.', 'warning');
                    return;
                  }
                  const selectedIndex = appointmentTargets.findIndex(target => target.EMP_NO === curEmpNo);
                  if (selectedIndex >= 0) {
                    handleRowDelete(selectedIndex);
                  } else {
                    showToast('?�택???�을 찾을 ???�습?�다.', 'warning');
                  }
                }}
                disabled={!curEmpNo || appointmentTargets.length === 0}
              >
                ?�삭??
              </button>
            </div>
          </div>
          <div>
            <DataGrid
              rowData={appointmentTargets}
              columnDefs={[
                { headerName: '구분', field: 'APNT_DIV_NM', width: 90 },
                { headerName: '발령?�자', field: 'APNT_DT', width: 110 },
                { headerName: '?�번', field: 'EMP_NO', width: 100 },
                { headerName: '?�명', field: 'EMP_NM', width: 100 },
                { headerName: '본�?', field: 'HQ_DIV_NM', width: 110 },
                { headerName: '부??, field: 'DEPT_DIV_NM', width: 110 },
                { headerName: '직책', field: 'DUTY_NM', width: 90 },
                { headerName: '본�?', field: 'HQ_DIV_NM_BEF', width: 110 },
                { headerName: '부??, field: 'DEPT_DIV_NM_BEF', width: 110 },
                { headerName: '직책', field: 'DUTY_NM_BEF', width: 90 },
                { headerName: '비고', field: 'RMK', flex: 1 },
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
            ??발령?�?�자???�면 ?�단???�원(?�주)리스?��? ?�블?�릭?�면 ?�사발령 ?�?�자 리스?�에 추�? ?�니??
          </p>
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
}


