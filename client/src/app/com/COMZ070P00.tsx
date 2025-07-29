'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * 직원 정보 인터페이스
 * ASIS: AdvancedDataGrid의 dataField와 동일한 구조
 */
interface EmployeeInfo {
  LIST_NO: string;          // 목록 번호
  OWN_OUTS_NM: string;      // 자사/외주 구분명
  EMP_NM: string;           // 직원명
  EMP_NO: string;           // 직원번호
  DUTY_CD_NM: string;       // 직책 코드명
  TCN_GRD_NM: string;       // 기술등급명
  PARTY_NM: string;         // 소속명
  BSN_NM: string;           // 사업명
  EXEC_IN_STRT_DT: string;  // 투입시작일
  EXEC_IN_END_DT: string;   // 투입종료일
  RMK: string;              // 비고
  HQ_DIV_CD: string;        // 본부구분코드
  DEPT_DIV_CD: string;      // 부서구분코드
}

/**
 * 더블클릭시 반환할 최소 정보 타입
 * ASIS: EvtDblClick 이벤트의 txtData 구조와 동일
 * 형식: "사번^자사외주구분^사원명"
 */
interface EmpSelectInfo {
  empNo: string;           // 사번 (ASIS: EMP_NO)
  ownOutsNm: string;       // 자사/외주 구분 (ASIS: OWN_OUTS_NM)
  empNm: string;           // 사원명 (ASIS: EMP_NM)
}

/**
 * postMessage로 받을 데이터 타입
 */
interface PostMessageData {
  type: 'CHOICE_EMP_INIT';
  strEmpNm: string;
  empList: EmployeeInfo[];
}

/**
 * 직원 검색 팝업 컴포넌트
 * ASIS: COM_02_0400.mxml → TOBE: COMZ070P00.tsx
 * 
 * 주요 기능:
 * 1. 부모창에서 직원 목록 데이터 수신 (postMessage)
 * 2. 직원명 입력 필드 (검색용이 아닌 표시용)
 * 3. 직원 선택(더블클릭) (onDoubleClick)
 * 4. 팝업 닫기 (PopUpManager.removePopUp)
 * 5. postMessage로 부모창과 통신
 */
const COMZ070P00 = () => {
  /**
   * 직원 목록 상태 관리
   * ASIS: grdEmpList.dataProvider (ArrayCollection)
   * TOBE: useState로 상태 관리
   */
  const [employees, setEmployees] = useState<EmployeeInfo[]>([])
  
  /**
   * 직원명 검색어 상태 관리
   * ASIS: txtEmpNm.text
   * TOBE: useState로 상태 관리
   */
  const [empNm, setEmpNm] = useState('')

  /**
   * 로딩 상태 관리
   * ASIS: showBusyCursor="true"
   */
  const [loading, setLoading] = useState(false)

  /**
   * 입력 필드 참조 (ASIS: txtEmpNm)
   */
  const inputRef = useRef<HTMLInputElement>(null)

  const { showToast } = useToast();

  /**
   * 메시지 수신 상태 관리
   */
  const [messageReceived, setMessageReceived] = useState(false)

  /**
   * postMessage 이벤트 핸들러
   * 부모 창에서 전송된 choiceEmpInit 데이터를 처리
   */
  const handlePostMessage = (event: MessageEvent) => {
    const data = event.data;
    if (data?.type === 'CHOICE_EMP_INIT' && data?.data) {
      choiceEmpInit(data.data.empNm, data.data.empList);
      setMessageReceived(true);
    }
  }

  /**
   * init_Complete 함수
   * ASIS: init_Complete() 함수와 동일한 역할
   * 모달이 처음 로드될 때 초기화 작업을 수행
   */
  const init_Complete = () => {
    setEmpNm('')
    setEmployees([])
    setLoading(false)
    // 검색창에 포커스 (ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * choiceEmpInit
   * ASIS: choiceEmpInit(strEmpNm:String, arrEmpList:ArrayCollection):void 함수와 동일한 로직
   * 직원선택 리스트 화면 호출할 때 초기값 설정
   * @param strEmpNm - 초기 직원명
   * @param arrEmpList - 초기 직원 목록
   */
  const choiceEmpInit = (strEmpNm: string, arrEmpList: EmployeeInfo[]) => {
    // ASIS: txtEmpNm.text = strEmpNm; grdEmpList.dataProvider = arrEmpList
    setEmpNm(strEmpNm);
    setEmployees(arrEmpList);
    // 검색창에 포커스 (ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  };

  /**
   * fnBsnNoSearch
   * ASIS: fnBsnNoSearch():void 함수와 동일한 로직
   * 창 열면서 자동조회
   */
  const fnBsnNoSearch = () => {
    // ASIS: init(); onSearchClick()
    handleSearch();
  };

  /**
   * 직원 더블클릭 처리 함수
   * ASIS: onDoubleClick() 함수와 동일한 로직
   * 
   * 선택된 직원 정보를 부모 컴포넌트로 전달하고 팝업 닫기
   * ASIS: EvtDblClick 이벤트 발생 후 PopUpManager.removePopUp()
   */
  const handleDoubleClick = (employee: EmployeeInfo) => {
    // ASIS: evtDblClck.txtData = grdEmpList.selectedItem.EMP_NO + "^" + grdEmpList.selectedItem.OWN_OUTS_NM + "^" + grdEmpList.selectedItem.EMP_NM
    const selectInfo: EmpSelectInfo = {
      empNo: employee.EMP_NO,
      ownOutsNm: employee.OWN_OUTS_NM,
      empNm: employee.EMP_NM
    }

    // 팝업 창인 경우 부모 창으로 결과 전송
    if (window.opener && !window.opener.closed) {
      try {
        // 부모 창의 handleEmployeeSelect 함수 호출
        const messageData = {
          type: 'EMP_SELECTED',
          data: selectInfo,
          source: 'COMZ070P00',
          timestamp: new Date().toISOString()
        };
        
        window.opener.postMessage(messageData, '*');
        
        // 팝업 창 닫기
        window.close();
      } catch (error) {
        console.error('부모창 통신 오류:', error);
      }
    }
  }

  /**
   * 테이블 행 번호 생성 함수
   * ASIS: setRowNum() 함수와 동일한 로직
   * 
   * @param index - 행 인덱스
   * @returns 행 번호 (1부터 시작)
   */
  const setRowNumber = (index: number) => {
    // ASIS: var index:int = grdEmpList.dataProvider.getItemIndex(cItem) + 1
    return String(index + 1)
  }

  /**
   * 키보드 이벤트 처리 함수
   * ASIS: 키보드 이벤트 처리와 동일
   * Enter: 검색 실행
   * Escape: 팝업 닫기
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      if (window.opener && !window.opener.closed) {
        window.close();
      }
    }
  };

  /**
   * 포커스 시 전체 선택
   * ASIS: FInputHangul 컴포넌트의 포커스 시 전체 선택 기능과 동일
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  /**
   * 직원 검색 기능 (구현 필요)
   * ASIS: onSearchClick() 함수와 동일한 역할
   * 
   * TODO: API 연동 구현 필요
   * - 엔드포인트: /api/COMZ070P00/search
   * - 파라미터: 직원명 (empNm)
   * - 응답: 직원 목록 (EmployeeInfo[])
   */
  const handleSearch = async () => {
    // 조회 기능 제거됨 - 부모창에서 데이터를 받아서 표시만 함
  }

  /**
   * 컴포넌트 초기화 및 메시지 수신 처리
   */
  const messageListenerRef = useRef<((event: MessageEvent) => void) | null>(null);
  const isInitializedRef = useRef(false);
  
  useEffect(() => {
    // 이미 초기화되었는지 확인
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    init_Complete();
    const hasParent = window.opener && !window.opener.closed;
    if (hasParent) {
      setTimeout(() => {
        try {
          const readyMessage = {
            type: 'POPUP_READY',
            source: 'CHILD',
            timestamp: new Date().toISOString()
          };
          window.opener.postMessage(readyMessage, '*');
        } catch (error) {}
      }, 100);
    }
    const handleMessage = (event: MessageEvent) => {
      handlePostMessage(event);
    };
    messageListenerRef.current = handleMessage;
    window.addEventListener('message', handleMessage);
    return () => {
      if (messageListenerRef.current) {
        window.removeEventListener('message', messageListenerRef.current);
        messageListenerRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [])

  return (
    <div className="popup-wrapper">
      {/* 팝업 헤더 - ASIS: TitleWindow의 title과 showCloseButton */}
      <div className="popup-header">
        <h3 className="popup-title">직원 검색</h3>
        <button 
          className="popup-close" 
          type="button" 
          onClick={() => {
            if (window.opener && !window.opener.closed) {
              window.close();
            }
          }}
        >
          ×
        </button>
      </div>

      <div className="popup-body">
        {/* 검색 영역 - ASIS: HBox 내 TextInput과 Button */}
        <div className="search-div mb-4">
          <table className="search-table">
            <tbody>
              <tr>
                {/* 직원명 입력 - ASIS: txtEmpNm (TextInput) */}
                <th className="search-th w-[80px]">직원명</th>
                <td className="search-td w-[200px]">
                  <input 
                    ref={inputRef}
                    type="text" 
                    className="input-base input-default w-full" 
                    value={empNm}
                    onChange={(e) => setEmpNm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder="직원명 입력"
                  />
                </td>
                {/* 조회 버튼 제거됨 */}
                <td className="search-td text-right" colSpan={6}>
                  {/* 조회 버튼 제거됨 */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 결과 그리드 - ASIS: grdEmpList (AdvancedDataGrid) */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                {/* ASIS: AdvancedDataGridColumn과 동일한 컬럼 구조 */}
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th">구분</th>
                <th className="grid-th">직원명</th>
                <th className="grid-th">직책</th>
                <th className="grid-th">등급</th>
                <th className="grid-th">소속</th>
                <th className="grid-th">최종프로젝트</th>
                <th className="grid-th">투입일</th>
                <th className="grid-th">철수일</th>
                <th className="grid-th">비고</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr 
                  key={index}
                  className="grid-tr cursor-pointer hover:bg-blue-50"
                  onDoubleClick={() => handleDoubleClick(employee)}
                >
                  {/* ASIS: labelFunction="setRowNum"과 동일 */}
                  <td className="grid-td text-center">{setRowNumber(index)}</td>
                  <td className="grid-td">{employee.OWN_OUTS_NM}</td>
                  <td className="grid-td">{employee.EMP_NM}</td>
                  <td className="grid-td">{employee.DUTY_CD_NM}</td>
                  <td className="grid-td">{employee.TCN_GRD_NM}</td>
                  <td className="grid-td">{employee.PARTY_NM}</td>
                  <td className="grid-td">{employee.BSN_NM}</td>
                  <td className="grid-td">{employee.EXEC_IN_STRT_DT}</td>
                  <td className="grid-td">{employee.EXEC_IN_END_DT}</td>
                  <td className="grid-td">{employee.RMK}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 검색 결과가 없을 때 표시 */}
        {employees.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">🔍 검색 결과가 없습니다.</p>
        )}

        {/* 종료 버튼 - ASIS: btnClose (Button) */}
        <div className="flex justify-end">
          <button 
            className="btn-base btn-delete" 
            onClick={() => {
              if (window.opener && !window.opener.closed) {
                window.close();
              }
            }}
          >
            종료
          </button>
        </div>
      </div>
    </div>
  );
};

export default COMZ070P00;
