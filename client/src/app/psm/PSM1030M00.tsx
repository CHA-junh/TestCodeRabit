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
 * PSM1030M00 - 인사발령내역 관리 화면
 * 
 * 사원의 인사발령 내역을 조회하고 관리하는 화면입니다.
 * 인사발령 등록, 수정, 삭제 기능을 제공하며 AG Grid를 사용하여 목록을 표시합니다.
 * 
 * 주요 기능:
 * - 인사발령내역 조회 및 검색
 * - 인사발령 등록/수정/삭제
 * - 본부별 부서 조회
 * - AG Grid를 활용한 발령내역 목록 표시
 * 
 * AS-IS: PSM_01_0130.mxml (인사발령내역 관리)
 * TO-BE: React 기반 인사발령 관리 화면
 * 
 * 사용 예시:
 * ```tsx
 * // PSM1010M00의 탭으로 사용
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
  /** 선택된 사원 정보 (PSM1010M00에서 전달) */
  selectedEmployee?: EmployeeListData | null;
  /** 탭 모드 여부 */
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
    rmk: '', // 비고
    seqNo: '' // 일련번호
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
        apntDiv: apntDivData,
        hqDiv: hqData,
        deptDiv: [],
        duty: dutyData
      });
    } catch (error) {
      console.error('공통 코드 로드 중 오류:', error);
    }
  };

  // AS-IS 인사발령내역 조회 (PSM_01_0131_S 프로시저 호출)
  const searchAppointmentList = useCallback(async () => {
    // employeeInfo 대신 selectedEmployee를 직접 사용하여 타이밍 문제 해결
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
          setError(result.message || '조회에 실패했습니다.');
        }
      } else {
        throw new Error('조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('인사발령내역 조회 중 오류:', error);
      setError(error instanceof Error ? error.message : '조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEmployee?.EMP_NO, employeeInfo?.EMP_NO]);

  // 외부에서 호출할 수 있는 함수들을 ref로 노출
  useImperativeHandle(ref, () => ({
    initialize: () => {
      // PSM1030M00 초기화
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

  // AS-IS 초기화 로직
  useEffect(() => {
    if (selectedEmployee) {
      setEmployeeInfo(selectedEmployee);
      loadCommonCodes();
      searchAppointmentList();
      initAppointmentInput();
    }
  }, [selectedEmployee?.EMP_NO, searchAppointmentList]); // EMP_NO가 변경될 때만 실행

  // AS-IS 인사발령내역 저장 후 기본정보 재조회
  const setAppointmentBasicInfo = () => {
    // PSM1010M00에서 선택한 사원의 원본 정보는 유지하고, 
    // 인사발령내역의 최신 정보는 별도로 관리
    // 상단의 본부, 부서는 원본 사원 정보를 그대로 사용
  };

  // AS-IS 인사발령등록 입력 항목 초기화
  const initAppointmentInput = () => {
    // PSM1010M00에서 선택한 사원의 원본 정보 사용
    const currentEmployee = selectedEmployee || employeeInfo;
    if (!currentEmployee) return;

    setInputData({
      apntDiv: '2', // 발령구분 (기본값: 승진)
      apntDt: '', // 발령일자
      hqDiv: currentEmployee.HQ_DIV_CD || '',
      deptDiv: currentEmployee.DEPT_DIV_CD || '',
      duty: currentEmployee.DUTY_CD || '',
      rmk: '', // 비고
      seqNo: '' // 일련번호
    });

    setSaveApntDiv('2');
    setNewFlag(true);
  };

  // AS-IS 발령구분 변경 시
  const handleApntDivChange = (apntDiv: string) => {
    setInputData(prev => ({ ...prev, apntDiv }));
    setSaveApntDiv(apntDiv);

    // AS-IS와 동일한 로직: 발령구분에 따른 입력 필드 활성화/비활성화
    if (apntDiv === '1') {
      // 입사 발령 등록은 모두 입력 가능
    } else if (apntDiv === '2') {
      // 승진을 선택하면 발령직위만 입력 가능
    } else if (apntDiv === '3') {
      // 이동을 선택하면 본부/부서만 입력 가능
    } else if (apntDiv === '4') {
      // 퇴사를 선택하면 입력 불가능
    }

    // 발령구분 변경 후 비고 설정 (새로운 발령구분 값 사용)
    setAppointmentRemarkWithDiv(apntDiv);
  };

  // AS-IS 발령구분 선택에 의해 비고 내용 자동 설정
  const setAppointmentRemark = () => {
    if (inputData.apntDiv === '3') {
      if (inputData.hqDiv === employeeInfo?.HQ_DIV_CD) {
        setInputData(prev => ({ ...prev, rmk: newFlag ? '' : prev.rmk }));
      } else {
        const newRemark = `면:${employeeInfo?.HQ_DIV} 명:${commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm}`;
        setInputData(prev => ({ ...prev, rmk: newRemark }));
      }
    } else {
      setInputData(prev => ({ ...prev, rmk: saveApntDiv === '3' ? '' : prev.rmk }));
    }
  };

  // 발령구분 변경 시 비고 설정 (발령구분 파라미터 받음)
  const setAppointmentRemarkWithDiv = (apntDiv: string) => {
    if (apntDiv === '3') {
      if (inputData.hqDiv === employeeInfo?.HQ_DIV_CD) {
        setInputData(prev => ({ ...prev, rmk: newFlag ? '' : prev.rmk }));
      } else {
        const newRemark = `면:${employeeInfo?.HQ_DIV} 명:${commonCodes.hqDiv.find(code => code.codeId === inputData.hqDiv)?.codeNm}`;
        setInputData(prev => ({ ...prev, rmk: newRemark }));
      }
    } else {
      setInputData(prev => ({ ...prev, rmk: saveApntDiv === '3' ? '' : prev.rmk }));
    }
  };

  // AS-IS 본부 변경 시 부서 로드
  const handleHqDivChange = async (hqDiv: string) => {
    const currentDeptDiv = inputData.deptDiv; // 현재 선택된 부서 저장
    setInputData(prev => ({ ...prev, hqDiv, deptDiv: '' })); // 부서 초기화

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

      // 부서 목록 로드 후 기존 부서가 새 목록에 있으면 선택, 없으면 빈 값
      if (deptData && Array.isArray(deptData)) {
        const deptExists = deptData.some(dept => dept.data === currentDeptDiv);
        if (deptExists) {
          setInputData(prev => ({ ...prev, deptDiv: currentDeptDiv }));
        }
      }

      // 발령구분이 "3" (이동)일 때 비고 바로 설정
      if (inputData.apntDiv === '3') {
        if (hqDiv === employeeInfo?.HQ_DIV_CD) {
          setInputData(prev => ({ ...prev, rmk: newFlag ? '' : prev.rmk }));
        } else {
          const newRemark = `면:${employeeInfo?.HQ_DIV} 명:${commonCodes.hqDiv.find(code => code.codeId === hqDiv)?.codeNm}`;
          setInputData(prev => ({ ...prev, rmk: newRemark }));
        }
      } else {
        setAppointmentRemark();
      }
    } catch (error) {
      console.error('부서 로드 중 오류:', error);
    }
  };

  // AS-IS 입력 데이터 검증
  const validateInput = (): boolean => {
    // 발령일자 입력 체크
    if (!inputData.apntDt) {
      showToast('발령일자를 입력해 주십시요.', 'warning');
      return false;
    }

    // AS-IS 주석 처리된 검증 로직들 (과거 인사 발령내용을 등록이 가능하므로 Check를 하지 않아도 된다)
    // 승진일 경우 발령직책이 발령전 직책보다 높아야 한다.
    // if (inputData.apntDiv === '2') {
    //   if (Number(inputData.duty) >= Number(employeeInfo?.DUTY_CD || 0)) {
    //     showToast('승진 대상이 아닙니다.', 'warning');
    //     return false;
    //   }
    // }
    
    // 이동일 경우 발령본부/부서가 발령전 본부/부서와 달라야 한다.
    // if (inputData.apntDiv === '3') {
    //   if (inputData.hqDiv === employeeInfo?.HQ_DIV_CD && inputData.deptDiv === employeeInfo?.DEPT_DIV_CD) {
    //     showToast('발령본부(부서)가 같으면 부서 이동 대상이 아닙니다.', 'warning');
    //     return false;
    //   }
    // }

    return true;
  };

  // AS-IS 저장 버튼 클릭
  const handleSave = async () => {
    if (!validateInput()) return;

    showConfirm({
      message: newFlag ? '새로운 인사발령을 등록하시겠습니까?' : '인사발령을 수정하시겠습니까?',
      type: 'info',
      onConfirm: async () => {
        setIsLoading(true);
        setError(null);

        try {
          
          // AS-IS MXML과 동일한 발령일자 형식 변환
          const formatDateForProc = (dateStr: string) => {
            if (!dateStr) return '';
            return dateStr.replace(/[\/-]/g, ''); // YYYY/MM/DD → YYYYMMDD
          };
          
          const params = [
            newFlag ? 'NEW' : 'MOD', // 일괄등록 데이터
            employeeInfo?.EMP_NO, // 사원번호
            newFlag ? '' : inputData.seqNo, // 일련번호 (NEW일 때는 빈 값, MOD일 때는 기존 일련번호)
            inputData.apntDiv, // 발령구분
            formatDateForProc(inputData.apntDt), // 발령일자 (YYYYMMDD 형식)
            inputData.hqDiv, // 사업본부구분코드 (113)
            inputData.deptDiv, // 부서구분코드 (112)
            inputData.duty, // 직책코드(116)
            inputData.rmk, // 비고
            user?.userId || 'system' // 로그인사용자 (실제 세션에서 가져옴)
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
              userId: user?.userId || 'system' // 로그인사용자 ID 추가
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              showToast('저장되었습니다.', 'info');
              
              // AS-IS: 사원리스트 재조회 및 현재 사원번호 설정
              // parentDocument.prf_PsmSearch("psm_01_0130.apntSpecSaveHandler()....");
              // parentDocument.curEmpNo = txtEmpNo.text;
              
              searchAppointmentList();
              handleNew();
            } else {
              setError(result.message || '저장에 실패했습니다.');
              showToast(result.message || '저장에 실패했습니다.', 'error');
            }
          } else {
            throw new Error('저장에 실패했습니다.');
          }
        } catch (error) {
          console.error('인사발령내역 저장 중 오류:', error);
          const errorMessage = error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
      onCancel: () => {
        // 인사발령 저장 취소
      }
    });
  };

  // AS-IS 삭제 버튼 클릭
  const handleDelete = async () => {
    if (!inputData.seqNo) {
      showToast('삭제할 인사발령내역을 선택해 주십시요.', 'warning');
      return;
    }

    showConfirm({
      message: '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
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
              userId: user?.userId || 'system' // 로그인사용자 ID 추가
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              showToast('삭제되었습니다.', 'info');
              searchAppointmentList();
              handleNew();
              // AS-IS: btnDel.enabled = false
            } else {
              setError(result.message || '삭제에 실패했습니다.');
              showToast(result.message || '삭제에 실패했습니다.', 'error');
            }
          } else {
            throw new Error('삭제에 실패했습니다.');
          }
            } catch (error) {
          console.error('인사발령내역 삭제 중 오류:', error);
          const errorMessage = error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.';
          setError(errorMessage);
          showToast(errorMessage, 'error');
        } finally {
          setIsLoading(false);
        }
      },
              onCancel: () => {
          // 인사발령 삭제 취소
        }
    });
  };

  // AS-IS 신규 버튼 클릭
  const handleNew = () => {
    setNewFlag(true);
    initAppointmentInput();
    // AS-IS: this.btnSave.enabled = true, this.btnDel.enabled = false
    setSelectedAppointment(null);
  };

  // AS-IS 날짜 표시 형식 변환 함수
  const formatDateForDisplay = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    // YYYYMMDD → YYYY/MM/DD 형식으로 변환
    if (dateStr.length === 8) {
      return `${dateStr.substring(0, 4)}/${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}`;
    }
    return dateStr;
  };

  // AS-IS 인사발령내역 더블클릭
  const handleAppointmentDoubleClick = async (event: RowDoubleClickedEvent) => {
    const appointment = event.data as AppointmentData;
    if (!appointment) return;

    setSelectedAppointment(appointment);
    setNewFlag(false);

    // 발령일자 형식 변환: "2024/09/01" → "2024-09-01"
    const formatDateForInput = (dateStr: string) => {
      if (!dateStr) return '';
      return dateStr.replace(/\//g, '-');
    };

    // 발령부서 목록 로드
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
        console.error('부서 로드 중 오류:', error);
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

  // PSM1010M00에서 선택한 사원의 원본 정보 사용
  const currentEmployee = selectedEmployee || employeeInfo;

  return (
    <div className={`flex flex-col ${isTab ? 'flex-1 min-h-0' : 'h-full'} overflow-auto`}>
      {/* AS-IS 개인 회사 정보 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[80px]">업체명</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.CRPN_NM || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">사원번호</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.EMP_NO || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">사원명</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.EMP_NM || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">입사일자</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={formatDateForDisplay(currentEmployee?.ENTR_DT)} readOnly />
              </td>
              <th className="search-th w-[80px]">퇴사일자</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={formatDateForDisplay(currentEmployee?.RETIR_DT)} readOnly />
              </td>
            </tr>
            <tr className="search-tr">
              <th className="search-th w-[80px]">본부</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.HQ_DIV || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">부서</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.DEPT_DIV || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">직책</th>
              <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" value={currentEmployee?.DUTY || ''} readOnly />
              </td>
              <th className="search-th w-[80px]">근무상태</th>
              <td className="search-td">
                <input type="text" className="input-base input-default !w-[150px]" value={currentEmployee?.WKG_ST_DIV || ''} readOnly />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* AS-IS 인사발령내역 */}
        <div className="w-1/2 flex flex-col">
          <div className="tit_area">
            <h3>인사발령내역</h3>
          </div>
          <div>
            <DataGrid
              rowData={appointmentList}
              columnDefs={[
                { headerName: 'No', valueGetter: (params: any) => params.node.rowIndex + 1, width: 70 },
                { headerName: '구분', field: 'APNT_DIV_NM', width: 100 },
                { headerName: '발령일자', field: 'APNT_DT', width: 120 },
                { headerName: '본부', field: 'HQ_DIV_NM', width: 120 },
                { headerName: '부서', field: 'DEPT_DIV_NM', width: 120 },
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
            ※ 2010년 이전 발령건은 발령내용 등 포함여부 차이로 사실과 다릅니다.
          </p>
        </div>

        {/* AS-IS 인사발령등록 */}
        <div className="w-1/2 flex flex-col">
          <div className="tit_area">
            <h3>인사발령등록</h3>
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
                  <th className="form-th w-[100px]">발령일자</th>
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
                  <th className="form-th">발령본부</th>
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
                  <th className="form-th">발령부서</th>
                  <td className="form-td">
                    <select 
                      className="combo-base w-full"
                      value={inputData.deptDiv}
                      onChange={(e) => setInputData(prev => ({ ...prev, deptDiv: e.target.value }))}
                      disabled={inputData.apntDiv === '2' || inputData.apntDiv === '4'}
                    >
                      <option value="">선택하세요</option>
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
                disabled={!currentEmployee?.EMP_NO}
              >
                신규
              </button>
              <button 
                className="btn-base btn-act"
                onClick={handleSave}
                disabled={isLoading || !currentEmployee?.EMP_NO}
              >
                {isLoading ? '저장중...' : '저장'}
              </button>
              <button 
                className="btn-base btn-delete"
                onClick={handleDelete}
                disabled={isLoading || !inputData.seqNo}
              >
                삭제
              </button>
            </div>
          </div>
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
});

export default PSM1030M00;