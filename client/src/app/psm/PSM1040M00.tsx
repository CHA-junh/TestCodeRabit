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
  onRegisterSuccess?: () => void; // 등록 성공 후 상위 화면 재조회 콜백
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

  // AS-IS 공통 코드 상태
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

  // AS-IS 입력 데이터 상태
  const [inputData, setInputData] = useState({
    apntDiv: '2', // 발령구분 (기본값: 승진)
    apntDt: '', // 발령일자
    hqDiv: '', // 발령본부
    deptDiv: '', // 발령부서
    duty: '', // 발령직위
    rmk: '' // 비고
  });

  // AS-IS 필드 활성화/비활성화 상태
  const [fieldEnableState, setFieldEnableState] = useState({
    hqDiv: false,
    deptDiv: false,
    duty: true
  });

  // AS-IS 초기화 로직
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

      // 본부 코드 로드 (AS-IS: cbHqDiv.setLargeCode('113', '00'))
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
      console.error('공통 코드 로드 중 오류:', error);
    }
  };

  // AS-IS 화면 초기화
  const initScreen = () => {
    setInputData({
      apntDiv: '2',
      apntDt: '',
      hqDiv: '',
      deptDiv: '',
      duty: '9', // AS-IS와 동일: cbDuty.setLargeCode('116','9')의 기본값
      rmk: ''
    });
    
    // AS-IS와 동일한 입력 필드 활성화/비활성화
    setFieldEnableState({
      hqDiv: false,
      deptDiv: false,
      duty: true
    });
    
    handleListClear();
  };

  // AS-IS 인사발령 대상자 리스트에 추가
  const addAppointmentTarget = (employee: EmployeeListData) => {
    const validationResult = validateAppointmentTarget(employee);
    if (!validationResult) return;

    let remark = '';
    // AS-IS와 동일한 비고 로직
    if (inputData.apntDiv === '3') {
      const selectedHqLabel = commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm;
      if (employee.HQ_DIV === selectedHqLabel) {
        remark = inputData.rmk;
      } else {
        remark = `면:${employee.HQ_DIV} 명:${selectedHqLabel}`;
      }
    } else {
      remark = inputData.rmk;
    }

    // AS-IS와 동일한 데이터 구조로 생성
    const newTarget: AppointmentTargetData = {
      APNT_DIV_NM: commonCodes.apntDiv.find(code => code.codeId === inputData.apntDiv)?.codeNm, // 발령구분
      APNT_DT: inputData.apntDt, // 발령일자
      EMP_NO: employee.EMP_NO, // 사번
      EMP_NM: employee.EMP_NM, // 성명
      HQ_DIV_NM: inputData.apntDiv === '3' ? 
                 commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm : 
                 employee.HQ_DIV, // 발령본부
      DEPT_DIV_NM: inputData.apntDiv === '3' ? 
                   commonCodes.deptDiv.find(code => code.DATA === inputData.deptDiv)?.LABEL : 
                   employee.DEPT_DIV, // 발령부서
      DUTY_NM: inputData.apntDiv === '2' && inputData.duty ? 
               commonCodes.duty.find(code => code.codeId === inputData.duty)?.codeNm : 
               employee.DUTY, // 발령직책 (AS-IS와 동일: 승진일 때만 선택된 직책, 그 외에는 현재 직책)
      HQ_DIV_NM_BEF: employee.HQ_DIV, // 발령전본부
      DEPT_DIV_NM_BEF: employee.DEPT_DIV, // 발령전부서
      DUTY_NM_BEF: employee.DUTY, // 발령전직책
      RMK: remark, // 비고
      APNT_DIV_CD: inputData.apntDiv, // 발령구분코드
      HQ_DIV_CD: inputData.apntDiv === '3' ? inputData.hqDiv : employee.HQ_DIV_CD, // 발령본부코드
      DEPT_DIV_CD: inputData.apntDiv === '3' ? inputData.deptDiv : employee.DEPT_DIV_CD, // 발령부서코드
      DUTY_CD: inputData.apntDiv === '2' ? inputData.duty : employee.DUTY_CD // 발령직책코드
    };

    // AS-IS와 동일하게 배열 끝에 추가
    setAppointmentTargets(prev => {
      const newTargets = [...prev, newTarget];
      // AS-IS: 추가된 행으로 스크롤 위치 설정
      setScrollToIndex(newTargets.length - 1);
      return newTargets;
    });
    setCurEmpNo(employee.EMP_NO || '');
  };

  // AS-IS 인사발령 대상자 검증
  const validateAppointmentTarget = (employee: EmployeeListData): boolean => {
    // 컴포넌트가 초기화되지 않았으면 검증하지 않음
    if (!isInitialized) {
      return false;
    }

    // AS-IS와 동일: 등록버튼 활성 여부 체크
    if (!isRegisterEnabled) {
      showToast('신규 버튼을 클릭해 주십시요.', 'warning');
      return false;
    }

    // AS-IS와 동일: 발령일자 입력 체크
    if (!inputData.apntDt) {
      showToast('발령일자를 입력해 주십시요.', 'warning');
      return false;
    }

    // AS-IS와 동일: 외주 인력 체크
    if (employee.OWN_OUTS_DIV_CD === '2') {
      showToast('외주인력은 인사발령 대상이 아닙니다', 'warning');
      return false;
    }

    // AS-IS와 동일: 이미 추가된 사원인지 체크
    const existingIndex = appointmentTargets.findIndex(target => target.EMP_NO === employee.EMP_NO);
    if (existingIndex >= 0) {
      showToast(`${employee.EMP_NM}는(은) 이미 인사발령 대상자로 추가되어 있습니다.`, 'warning');
      return false;
    }

    // AS-IS와 동일: 승진일 경우 발령직책이 발령전 직책보다 높아야 한다
    if (inputData.apntDiv === '2') {
      // AS-IS와 동일: 승진일 때는 직책이 선택되어야 함
      if (!inputData.duty || inputData.duty.trim() === '') {
        showToast('승진일 경우 발령직책을 선택해 주십시요.', 'warning');
        return false;
      }
      
      const selectedDutyLabel = commonCodes.duty.find(code => code.codeId === inputData.duty)?.codeNm || '선택된 직책';
      if (parseInt(inputData.duty) >= parseInt(employee.DUTY_CD || '0')) {
        showToast(`${selectedDutyLabel} 승진 대상이 아닙니다.`, 'warning');
        return false;
      }
    }

    // AS-IS와 동일: 이동일 경우 발령본부/부서가 발령전 본부/부서와 달라야 한다
    if (inputData.apntDiv === '3') {
      if (inputData.hqDiv === employee.HQ_DIV_CD && inputData.deptDiv === employee.DEPT_DIV_CD) {
        showToast('발령본부(부서)가 같으면 부서 이동 대상이 아닙디다.', 'warning');
        return false;
      }
    }

    return true;
  };

  // AS-IS 발령구분 변경 시
  const handleApntDivChange = (apntDiv: string) => {
    setInputData(prev => ({ ...prev, apntDiv }));

    // AS-IS와 동일한 로직: 발령구분에 따른 입력 필드 활성화/비활성화
    if (apntDiv === '1') {
      // AS-IS: 입사 발령 등록은 사원관리 신규 등록 시 한다
      showToast('※ 입사등록은 사원정보 신규등록시에만 가능함.', 'info');
      setFieldEnableState({
        hqDiv: false,
        deptDiv: false,
        duty: false
      });
    } else if (apntDiv === '2') {
      // AS-IS: 승진을 선택하면 발령직위만 입력 가능
      setFieldEnableState({
        hqDiv: false,
        deptDiv: false,
        duty: true
      });
    } else if (apntDiv === '3') {
      // AS-IS: 이동을 선택하면 본부/부서만 입력 가능
      setFieldEnableState({
        hqDiv: true,
        deptDiv: true,
        duty: false
      });
    } else if (apntDiv === '4') {
      // AS-IS: 퇴사를 선택하면 입력 불가능
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

  // AS-IS 본부 변경 시 부서 로드
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
      console.error('부서 로드 중 오류:', error);
    }
  };

  // AS-IS 신규 버튼 클릭
  const handleNew = () => {
    handleListClear();
    // AS-IS와 동일: 신규 시 기본값 설정
    setInputData(prev => ({
      ...prev,
      duty: '9' // AS-IS와 동일: cbDuty.setLargeCode('116','9')의 기본값
    }));
    // 등록버튼 활성화
    setIsRegisterEnabled(true);
  };

  // AS-IS 등록 버튼 클릭
  const handleRegister = async () => {
    if (appointmentTargets.length === 0) {
      showToast('등록할 대상자가 없습니다.', 'warning');
      return;
    }

    showConfirm({
      message: `${appointmentTargets.length}명의 인사발령을 등록하시겠습니까?`,
      type: 'info',
      onConfirm: async () => {
        setIsLoading(true);
        setError(null);

        try {
          
          // AS-IS와 동일한 데이터 구성
          const appointmentData = makeAppointmentData();
          
          const response = await fetch('/api/psm/appointment/batch-register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              appointmentData,
              userId: user?.userId || 'system' // 로그인사용자 (실제 세션에서 가져옴)
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              showToast('등록되었습니다.', 'info');
              // 재 등록을 방지하기 위해서 등록버튼 비활성화
              setIsRegisterEnabled(false);
              handleListClear();
              
              // AS-IS: 사원리스트 재조회
              if (onRegisterSuccess) {
                onRegisterSuccess();
              }
            } else {
              setError(result.message || '등록에 실패했습니다.');
              showToast(result.message || '등록에 실패했습니다.', 'error');
            }
          } else {
            throw new Error('등록에 실패했습니다.');
          }
        } catch (error) {
          console.error('인사발령 일괄등록 중 오류:', error);
          const errorMessage = error instanceof Error ? error.message : '등록 중 오류가 발생했습니다.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => {
        console.log('인사발령 등록 취소');
      }
    });
  };

  // AS-IS 등록데이터 만들기
  const makeAppointmentData = (): string => {
    if (appointmentTargets.length === 0) {
      return '';
    }

    let appointmentData = '';
    for (const target of appointmentTargets) {
      appointmentData += `${target.APNT_DIV_CD}^`; // 발령구분
      appointmentData += `${target.APNT_DT?.replace(/-/g, '')}^`; // 발령일자
      appointmentData += `${target.EMP_NO}^`; // 사번
      appointmentData += `${target.HQ_DIV_CD}^`; // 본부코드
      appointmentData += `${target.DEPT_DIV_CD}^`; // 부서구분코드
      appointmentData += `${target.DUTY_CD}^`; // 직책코드
      appointmentData += `${target.RMK}^`; // 비고
      appointmentData += '|';
    }
    return appointmentData;
  };

  // AS-IS 행삭제 버튼 클릭
  const handleRowDelete = (index: number) => {
    if (index < 0 || index >= appointmentTargets.length) return;

    const newTargets = [...appointmentTargets];
    newTargets.splice(index, 1);
    setAppointmentTargets(newTargets);

    // AS-IS와 동일한 curEmpNo 처리
    if (index > 0 && index >= newTargets.length) {
      setCurEmpNo(newTargets[index - 1].EMP_NO || '');
    }
  };

  // AS-IS 리스트 초기화
  const handleListClear = () => {
    setAppointmentTargets([]);
    setCurEmpNo('');
    setScrollToIndex(-1);
  };

  // 외부에서 사원 추가 호출 (PSM1000M00에서 사용)
  useEffect(() => {
    if (selectedEmployee) {
      addAppointmentTarget(selectedEmployee);
    }
  }, [selectedEmployee]);

  return (
    <div className={`flex flex-col ${isTab ? 'flex-1 min-h-0' : 'h-full'} overflow-auto`}>
      {/* AS-IS 인사발령내용 + 대상자 */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* AS-IS 왼쪽 인사발령내용 입력 */}
        <div className="w-[320px] flex flex-col">
          <div className="tit_area">
            <h3>인사발령내용</h3>
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
                  <th className="form-th">발령일자</th>
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
                  <th className="form-th">발령본부</th>
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
                  <th className="form-th">발령부서</th>
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
                        // UTF-8 바이트 수 계산
                        const byteLength = new TextEncoder().encode(newValue).length;
                        
                        if (byteLength <= 500) {
                          setInputData(prev => ({ ...prev, rmk: newValue }));
                        } else {
                          showToast(`비고는 500바이트까지 입력 가능합니다. (현재: ${byteLength}바이트)`, 'warning');
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
                신규
              </button>
              <button 
                className="btn-base btn-act"
                onClick={handleRegister}
                disabled={isLoading || !isRegisterEnabled}
              >
                등록
              </button>
            </div>
          </div>
        </div>

        {/* AS-IS 오른쪽 인사발령 대상자 */}
        <div className="flex-1 flex flex-col">
          <div className="tit_area justify-between">
            <h3>인사발령 대상자</h3>
            <div className="flex gap-2">
              <button 
                className="btn-base btn-etc"
                onClick={handleListClear}
              >
                리스트초기화
              </button>
              <button 
                className="btn-base btn-delete"
                onClick={() => {
                  if (!curEmpNo) {
                    showToast('삭제할 행을 선택해 주십시요.', 'warning');
                    return;
                  }
                  const selectedIndex = appointmentTargets.findIndex(target => target.EMP_NO === curEmpNo);
                  if (selectedIndex >= 0) {
                    handleRowDelete(selectedIndex);
                  } else {
                    showToast('선택된 행을 찾을 수 없습니다.', 'warning');
                  }
                }}
                disabled={!curEmpNo || appointmentTargets.length === 0}
              >
                행삭제
              </button>
            </div>
          </div>
          <div>
            <DataGrid
              rowData={appointmentTargets}
              columnDefs={[
                { headerName: '구분', field: 'APNT_DIV_NM', width: 90 },
                { headerName: '발령일자', field: 'APNT_DT', width: 110 },
                { headerName: '사번', field: 'EMP_NO', width: 100 },
                { headerName: '성명', field: 'EMP_NM', width: 100 },
                { headerName: '본부', field: 'HQ_DIV_NM', width: 110 },
                { headerName: '부서', field: 'DEPT_DIV_NM', width: 110 },
                { headerName: '직책', field: 'DUTY_NM', width: 90 },
                { headerName: '본부', field: 'HQ_DIV_NM_BEF', width: 110 },
                { headerName: '부서', field: 'DEPT_DIV_NM_BEF', width: 110 },
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
            ※ 발령대상자는 화면 상단의 사원(외주)리스트를 더블클릭하면 인사발령 대상자 리스트에 추가 됩니다.
          </p>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="text-red-500 text-sm mt-2 px-1">
          {error}
        </div>
      )}
    </div>
  );
}
