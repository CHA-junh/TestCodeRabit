'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * 직원 ?�보 ?�터?�이??
 * ASIS: AdvancedDataGrid??dataField?� ?�일??구조
 */
interface EmployeeInfo {
  LIST_NO: string;          // 목록 번호
  OWN_OUTS_NM: string;      // ?�사/?�주 구분�?
  EMP_NM: string;           // 직원�?
  EMP_NO: string;           // 직원번호
  DUTY_CD_NM: string;       // 직책 코드�?
  TCN_GRD_NM: string;       // 기술?�급�?
  PARTY_NM: string;         // ?�속�?
  BSN_NM: string;           // ?�업�?
  EXEC_IN_STRT_DT: string;  // ?�입?�작??
  EXEC_IN_END_DT: string;   // ?�입종료??
  RMK: string;              // 비고
  HQ_DIV_CD: string;        // 본�?구분코드
  DEPT_DIV_CD: string;      // 부?�구분코??
}

/**
 * ?�블?�릭??반환??최소 ?�보 ?�??
 * ASIS: EvtDblClick ?�벤?�의 txtData 구조?� ?�일
 * ?�식: "?�번^?�사?�주구분^?�원�?
 */
interface EmpSelectInfo {
  empNo: string;           // ?�번 (ASIS: EMP_NO)
  ownOutsNm: string;       // ?�사/?�주 구분 (ASIS: OWN_OUTS_NM)
  empNm: string;           // ?�원�?(ASIS: EMP_NM)
}

/**
 * postMessage�?받을 ?�이???�??
 */
interface PostMessageData {
  type: 'CHOICE_EMP_INIT';
  strEmpNm: string;
  empList: EmployeeInfo[];
}

/**
 * 직원 검???�업 컴포?�트
 * ASIS: COM_02_0400.mxml ??TOBE: COMZ070P00.tsx
 * 
 * 주요 기능:
 * 1. 부모창?�서 직원 목록 ?�이???�신 (postMessage)
 * 2. 직원�??�력 ?�드 (검?�용???�닌 ?�시??
 * 3. 직원 ?�택(?�블?�릭) (onDoubleClick)
 * 4. ?�업 ?�기 (PopUpManager.removePopUp)
 * 5. postMessage�?부모창�??�신
 */
const COMZ070P00 = () => {
  /**
   * 직원 목록 ?�태 관�?
   * ASIS: grdEmpList.dataProvider (ArrayCollection)
   * TOBE: useState�??�태 관�?
   */
  const [employees, setEmployees] = useState<EmployeeInfo[]>([])
  
  /**
   * 직원�?검?�어 ?�태 관�?
   * ASIS: txtEmpNm.text
   * TOBE: useState�??�태 관�?
   */
  const [empNm, setEmpNm] = useState('')

  /**
   * 로딩 ?�태 관�?
   * ASIS: showBusyCursor="true"
   */
  const [loading, setLoading] = useState(false)

  /**
   * ?�력 ?�드 참조 (ASIS: txtEmpNm)
   */
  const inputRef = useRef<HTMLInputElement>(null)

  const { showToast } = useToast();

  /**
   * 메시지 ?�신 ?�태 관�?
   */
  const [messageReceived, setMessageReceived] = useState(false)

  /**
   * postMessage ?�벤???�들??
   * 부�?창에???�송??choiceEmpInit ?�이?��? 처리
   */
  const handlePostMessage = (event: MessageEvent) => {
    const data = event.data;
    if (data?.type === 'CHOICE_EMP_INIT' && data?.data) {
      choiceEmpInit(data.data.empNm, data.data.empList);
      setMessageReceived(true);
    }
  }

  /**
   * init_Complete ?�수
   * ASIS: init_Complete() ?�수?� ?�일????��
   * 모달??처음 로드????초기???�업???�행
   */
  const init_Complete = () => {
    setEmpNm('')
    setEmployees([])
    setLoading(false)
    // 검?�창???�커??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * choiceEmpInit
   * ASIS: choiceEmpInit(strEmpNm:String, arrEmpList:ArrayCollection):void ?�수?� ?�일??로직
   * 직원?�택 리스???�면 ?�출????초기�??�정
   * @param strEmpNm - 초기 직원�?
   * @param arrEmpList - 초기 직원 목록
   */
  const choiceEmpInit = (strEmpNm: string, arrEmpList: EmployeeInfo[]) => {
    // ASIS: txtEmpNm.text = strEmpNm; grdEmpList.dataProvider = arrEmpList
    setEmpNm(strEmpNm);
    setEmployees(arrEmpList);
    // 검?�창???�커??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  };

  /**
   * fnBsnNoSearch
   * ASIS: fnBsnNoSearch():void ?�수?� ?�일??로직
   * �??�면???�동조회
   */
  const fnBsnNoSearch = () => {
    // ASIS: init(); onSearchClick()
    handleSearch();
  };

  /**
   * 직원 ?�블?�릭 처리 ?�수
   * ASIS: onDoubleClick() ?�수?� ?�일??로직
   * 
   * ?�택??직원 ?�보�?부�?컴포?�트�??�달?�고 ?�업 ?�기
   * ASIS: EvtDblClick ?�벤??발생 ??PopUpManager.removePopUp()
   */
  const handleDoubleClick = (employee: EmployeeInfo) => {
    // ASIS: evtDblClck.txtData = grdEmpList.selectedItem.EMP_NO + "^" + grdEmpList.selectedItem.OWN_OUTS_NM + "^" + grdEmpList.selectedItem.EMP_NM
    const selectInfo: EmpSelectInfo = {
      empNo: employee.EMP_NO,
      ownOutsNm: employee.OWN_OUTS_NM,
      empNm: employee.EMP_NM
    }

    // ?�업 창인 경우 부�?창으�?결과 ?�송
    if (window.opener && !window.opener.closed) {
      try {
        // 부�?창의 handleEmployeeSelect ?�수 ?�출
        const messageData = {
          type: 'EMP_SELECTED',
          data: selectInfo,
          source: 'COMZ070P00',
          timestamp: new Date().toISOString()
        };
        
        window.opener.postMessage(messageData, '*');
        
        // ?�업 �??�기
        window.close();
      } catch (error) {
        console.error('부모창 ?�신 ?�류:', error);
      }
    }
  }

  /**
   * ?�이�???번호 ?�성 ?�수
   * ASIS: setRowNum() ?�수?� ?�일??로직
   * 
   * @param index - ???�덱??
   * @returns ??번호 (1부???�작)
   */
  const setRowNumber = (index: number) => {
    // ASIS: var index:int = grdEmpList.dataProvider.getItemIndex(cItem) + 1
    return String(index + 1)
  }

  /**
   * ?�보???�벤??처리 ?�수
   * ASIS: ?�보???�벤??처리?� ?�일
   * Enter: 검???�행
   * Escape: ?�업 ?�기
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
   * ?�커?????�체 ?�택
   * ASIS: FInputHangul 컴포?�트???�커?????�체 ?�택 기능�??�일
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  /**
   * 직원 검??기능 (구현 ?�요)
   * ASIS: onSearchClick() ?�수?� ?�일????��
   * 
   * TODO: API ?�동 구현 ?�요
   * - ?�드?�인?? /api/COMZ070P00/search
   * - ?�라미터: 직원�?(empNm)
   * - ?�답: 직원 목록 (EmployeeInfo[])
   */
  const handleSearch = async () => {
    // 조회 기능 ?�거??- 부모창?�서 ?�이?��? 받아???�시�???
  }

  /**
   * 컴포?�트 초기??�?메시지 ?�신 처리
   */
  const messageListenerRef = useRef<((event: MessageEvent) => void) | null>(null);
  const isInitializedRef = useRef(false);
  
  useEffect(() => {
    // ?��? 초기?�되?�는지 ?�인
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
      {/* ?�업 ?�더 - ASIS: TitleWindow??title�?showCloseButton */}
      <div className="popup-header">
        <h3 className="popup-title">직원 검??/h3>
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
        {/* 검???�역 - ASIS: HBox ??TextInput�?Button */}
        <div className="search-div mb-4">
          <table className="search-table">
            <tbody>
              <tr>
                {/* 직원�??�력 - ASIS: txtEmpNm (TextInput) */}
                <th className="search-th w-[80px]">직원�?/th>
                <td className="search-td w-[200px]">
                  <input 
                    ref={inputRef}
                    type="text" 
                    className="input-base input-default w-full" 
                    value={empNm}
                    onChange={(e) => setEmpNm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder="직원�??�력"
                  />
                </td>
                {/* 조회 버튼 ?�거??*/}
                <td className="search-td text-right" colSpan={6}>
                  {/* 조회 버튼 ?�거??*/}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 결과 그리??- ASIS: grdEmpList (AdvancedDataGrid) */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                {/* ASIS: AdvancedDataGridColumn�??�일??컬럼 구조 */}
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th">구분</th>
                <th className="grid-th">직원�?/th>
                <th className="grid-th">직책</th>
                <th className="grid-th">?�급</th>
                <th className="grid-th">?�속</th>
                <th className="grid-th">최종?�로?�트</th>
                <th className="grid-th">?�입??/th>
                <th className="grid-th">철수??/th>
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
                  {/* ASIS: labelFunction="setRowNum"�??�일 */}
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

        {/* 검??결과가 ?�을 ???�시 */}
        {employees.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">?�� 검??결과가 ?�습?�다.</p>
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


