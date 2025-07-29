'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * 직원 ?�보 ?�터?�이??(ASIS 기반)
 * ASIS: COM_02_0600.mxml??AdvancedDataGrid 컬럼 구조?� ?�일
 */
interface EmpInfo {
  LIST_NO: string;        // 목록 번호
  EMP_NO: string;         // ?�번
  EMP_NM: string;         // ?�명
  HQ_DIV_NM: string;      // 본�?�?
  DEPT_DIV_NM: string;    // 부?�명
  DUTY_NM: string;        // 직급�?
  AUTH_CD_NM: string;     // ?�용??권한
  BSN_USE_YN: string;     // ?�업 ?�용권한
  WPC_USE_YN: string;     // 추진�??�용권한
  PSM_USE_YN: string;     // ?�사/복리 ?�용권한
  RMK: string;            // 비고
  HQ_DIV_CD: string;      // 본�?구분코드
  DEPT_DIV_CD: string;    // 부?�구분코??
  DUTY_CD: string;        // 직급코드
  DUTY_DIV_CD: string;    // 직책구분코드
  AUTH_CD: string;        // 권한코드
  APV_APOF_ID: string;    // ?�인결재?�ID
  EMAIL_ADDR: string;     // ?�메?�주??
}

/**
 * ?�블?�릭??반환??최소 ?�보 ?�??
 * ASIS: EvtDblClick ?�벤?�의 txtData 구조?� ?�일
 * ?�식: "?�용?�ID^?�용?�명^?�용?�등�?
 */
interface EmpSelectInfo {
  empNo: string;      // ?�번 (ASIS: EMP_NO)
  empNm: string;      // ?�명 (ASIS: EMP_NM)
  authCd: string;      // ?�용?�권??(ASIS: AUTH_CD)
}

/**
 * postMessage�?받을 ?�이???�??
 */
interface PostMessageData {
  type: 'CHOICE_EMP_INIT';
  strEmpNm: string;
  empList: EmpInfo[];
}

/**
 * 컴포?�트 Props ?�터?�이??
 * ASIS: pubEmpNm, pubOwnOutDiv 변?��? ?�일????��
 */
interface Props {
  defaultEmpNm?: string;                    // 기본 직원�?(ASIS: pubEmpNm)
  defaultEmpList?: EmpInfo[];              // 기본 직원 목록 (ASIS: arrEmpListDG)
  onSelect: (empData: EmpSelectInfo) => void;  // 직원 ?�택 콜백 (ASIS: EvtDblClick ?�벤??
  onClose: () => void;                      // 모달 ?�기 콜백 (ASIS: PopUpManager.removePopUp)
}

/**
 * 컴포?�트 Ref ?�터?�이??
 * ASIS: choiceEmpInit() ?�수?� ?�일????��
 */
export interface EmpSearchModalRef {
  choiceEmpInit: (strEmpNm: string, empList: EmpInfo[]) => void
}

/**
 * ?�플 ?�이??(?�요??주석 ?�제?�여 ?�용)
 * ASIS: ?�스?�용 ?�이??구조?� ?�일
 */
/*
const SAMPLE_EMP_DATA: EmpInfo[] = [
  {
    LIST_NO: "1",
    EMP_NO: "E001",
    EMP_NM: "?�길??,
    HQ_DIV_NM: "경영본�?",
    DEPT_DIV_NM: "?�략?�",
    DUTY_NM: "과장",
    AUTH_CD_NM: "관리자",
    BSN_USE_YN: "1",
    WPC_USE_YN: "0",
    PSM_USE_YN: "1",
    RMK: "",
    HQ_DIV_CD: "HQ001",
    DEPT_DIV_CD: "DEPT001",
    DUTY_CD: "DUTY001",
    DUTY_DIV_CD: "DUTY_DIV001",
    AUTH_CD: "AUTH001",
    APV_APOF_ID: "APV001",
    EMAIL_ADDR: "hong@company.com"
  }
];
*/

/**
 * 직원 ?�보 조회 ?�업 (?�업 ?�용)
 * ASIS: COM_02_0600.mxml ??TOBE: COMZ100P00.tsx
 *
 * 주요 기능:
 * 1. ?�용?�명?�로 ?�시�?검??(USR_01_0201_S)
 * 2. 검??결과�??�이�??�태�??�시
 * 3. ?�블?�릭?�로 직원 ?�택 (window.opener.postMessage)
 * 4. Enter ?�로 검???�행
 * 5. Escape ?�로 ?�업 ?�기
 * 6. ?�커?????�체 ?�택
 * 7. postMessage�??�이???�신 �?부�?창으�?결과 ?�송
 */
const COMZ100P00 = () => {
  // 직원 목록 ?�태 관�?(ASIS: grdEmpList.dataProvider)
  const [emps, setEmps] = useState<EmpInfo[]>([])
  // 로딩 ?�태 관�?(ASIS: showBusyCursor="true")
  const [loading, setLoading] = useState(false)
  // 직원�?검?�어 ?�태 관�?(ASIS: txtEmpNm.text)
  const [empNm, setEmpNm] = useState('')
  // ?�력 ?�드 참조 (ASIS: txtEmpNm)
  const inputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  // 메시지 ?�신 ?�태 관�?
  const [messageReceived, setMessageReceived] = useState(false)

  /**
   * postMessage ?�벤???�들??
   * 부�?�?USR2010M00)?�서 ?�송??choiceEmpInit ?�이?��? 처리
   */
  const handlePostMessage = (event: MessageEvent) => {
    const data = event.data;
    console.log('COMZ100P00 - postMessage ?�신:', data);
    
    if (data?.type === 'CHOICE_EMP_INIT' && data?.data) {
      console.log('COMZ100P00 - 직원 ?�이???�신:', {
        empNm: data.data.empNm,
        empListLength: data.data.empList?.length || 0,
        empList: data.data.empList
      });
      
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
    setEmps([])
    setLoading(false)
    // 검?�창???�커??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * choiceEmpInit ?�수
   * ASIS: choiceEmpInit(strEmpNm:String, arrEmpList:ArrayCollection) ?�수?� ?�일
   * 직원명과 직원리스?��? 받아???�력창과 결과 그리?��? 초기??
   * @param strEmpNm 직원�?(ASIS: strEmpNm)
   * @param empList 직원리스??(ASIS: arrEmpList)
   */
  const choiceEmpInit = (strEmpNm: string, empList: EmpInfo[]) => {
    setEmpNm(strEmpNm)
    setEmps(empList)
    setLoading(false)
    // 검?�창???�커??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * 직원 검???�수
   * ASIS: onSearchClick() ?�수?� ?�일??로직
   * ?�로?��?: USR_01_0201_S(?, ?, ?, ?)
   * ?�라미터: 본�?구분코드, 부?�구분코?? ?�용?�명
   * API�??�출?�여 직원 ?�보�?검?�하�?결과�??�태???�??
   */
  const handleSearch = async () => {
    // ?�용?�명 ?�수 ?�력 검�?
    if (!empNm.trim()) {
      showToast('?�용?�명???�력?�주?�요.', 'warning')
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch('/api/COMZ100P00/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userNm: empNm.trim()
        })
      })

      if (res.ok) {
        const data = await res.json()
        const empList = data.data || data
        setEmps(empList)
        
        // 검??결과가 ?�고 검?�어가 ?�는 경우 ?�림 (ASIS: Alert.show("?�당 ?�용?�명?� 존재?��? ?�습?�다."))
        if (empList.length === 0 && empNm.trim()) {
          showToast('?�당 직원명�? 존재?��? ?�습?�다.', 'warning')
        }
      } else {
        const errorData = await res.json()
        const errorMessage = errorData.message || '검??�??�류가 발생?�습?�다.'
        showToast(errorMessage, 'error')
        setEmps([])
      }
    } catch (e) {
      console.error('검???�패:', e)
      showToast('검??�??�류가 발생?�습?�다.', 'error')
      setEmps([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * 직원 ?�블?�릭 처리 ?�수
   * ASIS: onDoubleClick(idx:int) ?�수?� ?�일??로직
   * ?�블?�릭 ???�택??직원 ?�보�?부�?컴포?�트�??�달
   * ?�업 창인 경우 부�?�?USR2010M00)??handleApproverSelect ?�수 ?�출
   */
  const handleDoubleClick = (emp: EmpInfo) => {
    const selectInfo: EmpSelectInfo = {
      empNo: emp.EMP_NO,      // ASIS: grdEmpList.selectedItem.EMP_NO
      empNm: emp.EMP_NM,      // ASIS: grdEmpList.selectedItem.EMP_NM
      authCd: emp.AUTH_CD,    // ASIS: grdEmpList.selectedItem.AUTH_CD
    }

    // ?�업 창인 경우 부�?창으�?결과 ?�송
    if (window.opener && !window.opener.closed) {
      try {
        // 부�?창의 handleApproverSelect ?�수 ?�출
        const messageData = {
          type: 'EMP_SELECTED',
          data: selectInfo,
          source: 'COMZ100P00',
          timestamp: new Date().toISOString()
        };
        
        window.opener.postMessage(messageData, '*');
        
        // ?�업 �??�기
        window.close();
      } catch (error) {
        // fallback: 로컬 onSelect 콜백 ?�용
        // onSelect(selectInfo); // This line is removed as per the new_code
        // onClose(); // This line is removed as per the new_code
      }
    } else {
      // ?�반 모달??경우 기존 방식 ?�용
      // onSelect(selectInfo); // This line is removed as per the new_code
      // onClose(); // This line is removed as per the new_code
    }
  }

  /**
   * ?�이�???번호 ?�성 ?�수
   * ASIS: setRowNum(cItem:Object,i_column:AdvancedDataGridColumn):String ?�수?� ?�일
   * @param index ???�덱??
   * @returns ??번호 문자??
   */
  const setRowNumber = (index: number) => {
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
      handleSearch()
    } else if (e.key === 'Escape') {
      if (window.opener && !window.opener.closed) {
        window.close();
      } else {
        // onClose(); // This line is removed as per the new_code
      }
    }
  }

  /**
   * ?�커?????�체 ?�택
   * ASIS: FInputHangul 컴포?�트???�커?????�체 ?�택 기능�??�일
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
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



  /**
   * ?��??�서 ?�출?????�는 메서?�들??ref???�출
   * ASIS: choiceEmpInit ?�수�??��??�서 ?�출?????�도�??�출
   */
  // useImperativeHandle(ref, () => ({ // This line is removed as per the new_code
  //   choiceEmpInit: (strEmpNm: string, empList: EmpInfo[]) => { // This line is removed as per the new_code
  //     choiceEmpInit(strEmpNm, empList); // This line is removed as per the new_code
  //   } // This line is removed as per the new_code
  // })) // This line is removed as per the new_code

  return (
    <div className="popup-wrapper min-w-[840px]">
      {/* ?�업 ?�더 (ASIS: TitleWindow ?�더) */}
      <div className="popup-header">
        <h3 className="popup-title">?�용?�명 검??/h3>
        <button 
          className="popup-close" 
          onClick={() => {
            if (window.opener && !window.opener.closed) {
              window.close();
            } else {
              // onClose(); // This line is removed as per the new_code
            }
          }}
        >
          ×
        </button>
      </div>

      {/* ?�업 본문 (ASIS: VBox ?�역) */}
      <div className="popup-body scroll-area">

        {/* 검??조건 (ASIS: HBox 검???�역) */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                {/* ?�용?�명 ?�력 (ASIS: txtEmpNm) */}
                <th className="search-th w-[100px]">?�용??�?/th>
                <td className="search-td w-[200px]">
                  <input
                    ref={inputRef}
                    type="text"
                    className="input-base input-default w-full"
                    value={empNm}
                    onChange={(e) => setEmpNm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder="?�용?�명 ?�력"
                  />
                  
                </td>
                {/* 조회 버튼 (ASIS: 조회 버튼) */}
                <td className="search-td text-right" colSpan={6}>
                  <button 
                    className="btn-base btn-search" 
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? '조회 �?..' : '조회'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 결과 그리??(ASIS: grdEmpList AdvancedDataGrid) */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                {/* ASIS: AdvancedDataGridColumn 구조?� ?�일 */}
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th w-[60px]">?�번</th>
                <th className="grid-th w-[70px]">?�명</th>
                <th className="grid-th w-[120px]">본�?�?/th>
                <th className="grid-th w-[120px]">부?�명</th>
                <th className="grid-th w-[60px]">직급�?/th>
                <th className="grid-th w-[100px]">?�용??권한</th>
                {/* ASIS: AdvancedDataGridColumnGroup "?�무�??�용권한" */}
                <th className="grid-th w-[60px]">?�업</th>
                <th className="grid-th w-[60px]">추진�?/th>
                <th className="grid-th w-[60px]">?�사/복리</th>
                <th className="grid-th">비고</th>
              </tr>
            </thead>
            <tbody>
              {emps.map((emp, index) => (
                <tr 
                  className="grid-tr cursor-pointer hover:bg-blue-50" 
                  key={index}
                  onDoubleClick={() => handleDoubleClick(emp)}
                >
                  <td className="grid-td text-center">{setRowNumber(index)}</td>
                  <td className="grid-td text-center">{emp.EMP_NO}</td>
                  <td className="grid-td text-center">{emp.EMP_NM}</td>
                  <td className="grid-td text-center">{emp.HQ_DIV_NM}</td>
                  <td className="grid-td text-center">{emp.DEPT_DIV_NM}</td>
                  <td className="grid-td text-center">{emp.DUTY_NM}</td>
                  <td className="grid-td text-center">{emp.AUTH_CD_NM}</td>
                  {/* ASIS: CheckBox itemRenderer?� ?�일??기능 */}
                  <td className="grid-td text-center">
                    <input type="checkbox" checked={emp.BSN_USE_YN === "1"} readOnly />
                  </td>
                  <td className="grid-td text-center">
                    <input type="checkbox" checked={emp.WPC_USE_YN === "1"} readOnly />
                  </td>
                  <td className="grid-td text-center">
                    <input type="checkbox" checked={emp.PSM_USE_YN === "1"} readOnly />
                  </td>
                  <td className="grid-td">{emp.RMK}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 검??결과가 ?�을 ???�시 (ASIS: �?그리???�시) */}
        {emps.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">?�� 검??결과가 ?�습?�다.</p>
        )}

        {/* 종료 버튼 ?�단 ?�측 ?�렬 (ASIS: btnClose) */}
        <div className="flex justify-end mt-2">
          <button 
            className="btn-base btn-delete" 
            onClick={() => {
              if (window.opener && !window.opener.closed) {
                window.close();
              } else {
                // onClose(); // This line is removed as per the new_code
              }
            }}
          >
            종료
          </button>
        </div>
      </div>
    </div>
  );
}

export default COMZ100P00;



