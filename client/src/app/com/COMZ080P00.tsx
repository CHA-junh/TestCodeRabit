'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * 직원 ?�보 ?�터?�이??(ASIS 기반)
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
  ENTR_DT: string;          // ?�사??
  EXEC_IN_STRT_DT: string;  // ?�입?�작??
  EXEC_IN_END_DT: string;   // ?�입종료??
  WKG_ST_DIV_NM: string;    // ?�태�?
  EXEC_ING_BSN_NM: string;  // ?�입�??�로?�트
  HQ_DIV_CD: string;        // 본�?구분코드
  DEPT_DIV_CD: string;      // 부?�구분코??
  CSF_CO_CD: string;        // ?�속코드
  WKG_ST_DIV: string;       // ?�태코드
  EXEC_ING_YN: string;      // ?�입중유�?
  OWN_OUTS_DIV: string;     // 구분코드
  OUTS_FIX_YN: string;      // ?�주배정?�무
  IN_FIX_DT: string;        // ?�주배정?�정?�자
  IN_FIX_PRJT: string;      // ?�주배정?�로?�트
  DUTY_CD: string;          // 직책코드
  DUTY_DIV_CD: string;      // ?�입?�력직책
  TCN_GRD: string;          // ?�급코드
}

/**
 * ?�블?�릭??반환??최소 ?�보 ?�??
 * ASIS: EvtDblClick ?�벤?�의 txtData 구조?� ?�일
 * ?�식: "?�번^?�사?�주구분^?�원�??�속�??�주배정?�무^?�주배정?�정?�자^?�주배정?�로?�트^?�입?�력직책구분코드^?�재최종기술?�급"
 */
interface EmpSelectInfo {
  empNo: string;                    // ?�번 (ASIS: EMP_NO)
  ownOutsDiv: string;               // ?�사?�주구분 (ASIS: OWN_OUTS_DIV)
  empNm: string;                    // ?�원�?(ASIS: EMP_NM)
  csfCoCd: string;                  // ?�속�?(ASIS: CSF_CO_CD)
  outsFixYn: string;                // ?�주배정?�무 (ASIS: OUTS_FIX_YN)
  inFixDt: string;                  // ?�주배정?�정?�자 (ASIS: IN_FIX_DT)
  inFixPrjt: string;                // ?�주배정?�로?�트 (ASIS: IN_FIX_PRJT)
  dutyDivCd: string;                // ?�입?�력 직책구분코드 (ASIS: DUTY_DIV_CD)
  tcnGrd: string;                   // ?�재 최종 기술?�급 (ASIS: TCN_GRD)
}

/**
 * postMessage�?받을 ?�이???�??
 */
interface PostMessageData {
  type: 'CHOICE_EMP_INIT';
  strEmpNm: string;
  ownOutDiv: string;
  empList: EmployeeInfo[];
}

/**
 * 직원 검???�업 컴포?�트 (?�장 버전)
 * ASIS: COM_02_0410.mxml ??TOBE: COMZ080P00.tsx
 * 
 * 주요 기능:
 * 1. 부모창?�서 직원 목록 ?�이???�신 (postMessage)
 * 2. 직원�?검??(onSearchClick) - ?�동 조회
 * 3. ?�사/?�주/?�사+?�주 구분 검??(rdOwnOutDiv)
 * 4. ?�사?�포??검??(chkRetirYn)
 * 5. 직원 ?�택(?�블?�릭) (onDoubleClick)
 * 6. ?�업 ?�기 (PopUpManager.removePopUp)
 * 7. ???��??�링 (grdEmpListStyleFunc)
 * 8. ?�보???�벤??처리 (Enter ??검?? Escape ???�기)
 * 9. postMessage�?부모창�??�신
 */
const COMZ080P00 = () => {
  /**
   * 직원 목록 ?�태 관�?
   * ASIS: grdEmpList.dataProvider (ArrayCollection)
   * TOBE: useState�??�태 관�?
   */
  const [employees, setEmployees] = useState<EmployeeInfo[]>([])
  
  /**
   * 로딩 ?�태 관�?
   * ASIS: showBusyCursor="true"
   */
  const [loading, setLoading] = useState(false)
  
  /**
   * 직원�?검?�어 ?�태 관�?
   * ASIS: txtEmpNm.text
   * TOBE: useState�??�태 관�?
   */
  const [empNm, setEmpNm] = useState('')
  
  /**
   * ?�사/?�주 구분 ?�태 관�?
   * ASIS: rdOwnOutDiv.selectedValue
   * TOBE: useState�??�태 관�?
   */
  const [ownOutDiv, setOwnOutDiv] = useState('1')
  
  /**
   * ?�사?�포???�태 관�?
   * ASIS: chkRetirYn.selected
   * TOBE: useState�??�태 관�?
   */
  const [retirYn, setRetirYn] = useState(true)

  /**
   * ?�력 ?�드 참조 (ASIS: txtEmpNm)
   */
  const inputRef = useRef<HTMLInputElement>(null)

  const { showToast } = useToast()

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
      choiceEmpInit(data.data.empNm, data.data.ownOutDiv, data.data.empList);
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
    setOwnOutDiv('1')
    setRetirYn(true)
    // 검?�창???�커??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * 직원 검???�수 (API ?�출)
   * ASIS: onSearchClick() ?�수?� ?�일????��
   * 
   * ?�로?��?: COM_02_0411_S(?, ?, ?, ?, ?, ?)
   * ?�라미터: 조회구분, ?�원번호, ?�원�? ?�사?�주구분, ?�사?�포?�조?�유�?
   */
  const handleSearch = async () => {
    // ASIS: validation check
    if (!empNm.trim()) {
      showToast('직원명을 ?�력?�주?�요.', 'warning')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/COMZ080P00/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kb: '2', // ?�원명으�?검??(ASIS: strSrchKb)
          empNo: '', // ?�원번호 (ASIS: 빈값)
          empNm: empNm.trim(), // ?�원�?(ASIS: strEmpNm)
          ownOutsDiv: ownOutDiv === 'ALL' ? null : ownOutDiv, // ?�사?�주구분 (ASIS: OwnOutDiv)
          retirYn: retirYn ? 'Y' : 'N' // ?�사?�포?�조?�유�?(ASIS: chkRetirYn.selected)
        })
      })

      if (res.ok) {
        const empData = await res.json()
        setEmployees(empData.data)
        
        // ASIS: 검??결과가 ?�고 검?�어가 ?�는 경우 ?�림
        if (empData.data.length === 0 && empNm.trim()) {
          showToast('?�당 직원명�? 존재?��? ?�습?�다.', 'warning')
        }
      } else {
        const errorData = await res.json()
        const errorMessage = errorData.message || '검??�??�류가 발생?�습?�다.'
        showToast(errorMessage, 'error')
        setEmployees([])
      }
    } catch (e) {
      console.error('검???�패:', e)
      showToast('검??�??�류가 발생?�습?�다.', 'error')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * 직원 ?�블?�릭 처리 ?�수 (ASIS 기반)
   * ASIS: onDoubleClick() ?�수?� ?�일??로직
   * 
   * ?�택??직원 ?�보�?부�?컴포?�트�??�달?�고 ?�업 ?�기
   * ASIS: EvtDblClick ?�벤??발생 ??PopUpManager.removePopUp()
   */
  const handleDoubleClick = (employee: EmployeeInfo) => {
    // ASIS: evtDblClck.txtData 구조?� ?�일
    const selectInfo: EmpSelectInfo = {
      empNo: employee.EMP_NO,                    // [0]: ?�번 (ASIS: grdEmpList.selectedItem.EMP_NO)
      ownOutsDiv: employee.OWN_OUTS_DIV,        // [1]: ?�사?�주구분 (ASIS: grdEmpList.selectedItem.OWN_OUTS_DIV)
      empNm: employee.EMP_NM,                   // [2]: ?�원�?(ASIS: grdEmpList.selectedItem.EMP_NM)
      csfCoCd: employee.CSF_CO_CD,              // [3]: ?�속�?(ASIS: grdEmpList.selectedItem.CSF_CO_CD)
      outsFixYn: employee.OUTS_FIX_YN,          // [4]: ?�주배정?�무 (ASIS: grdEmpList.selectedItem.OUTS_FIX_YN)
      inFixDt: employee.IN_FIX_DT,              // [5]: ?�주배정?�정?�자 (ASIS: grdEmpList.selectedItem.IN_FIX_DT)
      inFixPrjt: employee.IN_FIX_PRJT,          // [6]: ?�주배정?�로?�트 (ASIS: grdEmpList.selectedItem.IN_FIX_PRJT)
      dutyDivCd: employee.DUTY_DIV_CD,          // [7]: ?�입?�력 직책구분코드 (ASIS: grdEmpList.selectedItem.DUTY_DIV_CD)
      tcnGrd: employee.TCN_GRD                  // [8]: ?�재 최종 기술?�급 (ASIS: grdEmpList.selectedItem.TCN_GRD)
    }

    // ?�업 창인 경우 부�?창으�?결과 ?�송
    if (window.opener && !window.opener.closed) {
      try {
        // 부�?창의 handleEmployeeSelect ?�수 ?�출
        const messageData = {
          type: 'EMP_SELECTED',
          data: selectInfo,
          source: 'COMZ080P00',
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
   * ?�사/?�주 구분 변�?처리
   * ASIS: onChangeOwnOutDiv() ?�수?� ?�일????��
   */
  const handleOwnOutDivChange = (value: string) => {
    setOwnOutDiv(value)
  }

  /**
   * ?�사?�포??체크박스 변�?처리
   * ASIS: chkRetirYn.selected 변�??�벤??
   */
  const handleRetirYnChange = (checked: boolean) => {
    setRetirYn(checked)
  }

  /**
   * ???��????�수 (ASIS 기반)
   * ASIS: grdEmpListStyleFunc() ?�수?� ?�일??로직
   * 
   * @param employee - 직원 ?�보
   * @returns CSS ?�래?�명
   */
  const getRowStyle = (employee: EmployeeInfo) => {
    if (employee.WKG_ST_DIV === "3") {        // ?�사 (ASIS: data["WKG_ST_DIV"] == "3")
      return "text-red-600"
    } else if (employee.WKG_ST_DIV === "2") { // ?�직 (ASIS: data["WKG_ST_DIV"] == "2")
      return "text-blue-600"
    } else if (employee.OWN_OUTS_DIV === "2" && employee.EXEC_ING_YN === "N") { // 철수???�주??경우 (ASIS: data["OWN_OUTS_DIV"] == "2" && data["EXEC_ING_YN"] == "N")
      return "text-red-600"
    }
    return ""
  }

  /**
   * ?�보???�벤??처리 ?�수
   * ASIS: Enter ???�벤??처리
   * Enter: 검???�행
   * Escape: ?�업 ?�기
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      if (window.opener && !window.opener.closed) {
        window.close();
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
   * 직원 ?�택 리스??초기???�수
   * ASIS: choiceEmpInit() ?�수?� ?�일??로직
   * 
   * @param strEmpNm - 초기 직원�?
   * @param ownOutDiv - 초기 ?�사/?�주 구분
   * @param empList - 초기 직원 목록
   */
  const choiceEmpInit = (strEmpNm: string, ownOutDiv: string, empList: EmployeeInfo[]) => {
    // ASIS: txtEmpNm.text = strEmpNm; rdOwnOutDiv.selectedValue = OwnOutDiv; grdEmpList.dataProvider = arrEmpList
    setEmpNm(strEmpNm)
    setOwnOutDiv(ownOutDiv)
    setEmployees(empList)
    // 검?�창???�커??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
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
      {/* ?�업 ?�단 ?�더 - ASIS: TitleWindow??title�?showCloseButton */}
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

      {/* ?�업 본문 - ASIS: VBox ?��? ?�역 */}
      <div className="popup-body">
        {/* 검???�역 - ASIS: HBox ??검??조건 ?�역 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                {/* 직원�??�력 - ASIS: txtEmpNm (FInputHangul) */}
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
                {/* ?�사/?�주 구분 - ASIS: rdOwnOutDiv (RadioButtonGroup) */}
                <td className="search-td" colSpan={6}>
                  <div className="flex items-center gap-4 text-sm">
                    <label>
                      <input 
                        type="radio" 
                        name="type" 
                        checked={ownOutDiv === '1'}
                        onChange={() => handleOwnOutDivChange('1')}
                      /> ?�사
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="type" 
                        checked={ownOutDiv === '2'}
                        onChange={() => handleOwnOutDivChange('2')}
                      /> ?�주
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="type" 
                        checked={ownOutDiv === 'ALL'}
                        onChange={() => handleOwnOutDivChange('ALL')}
                      /> ?�사+?�주
                    </label>
                    {/* ?�사?�포??체크박스 - ASIS: chkRetirYn (CheckBox) */}
                    <label>
                      <input 
                        type="checkbox" 
                        checked={retirYn}
                        onChange={(e) => handleRetirYnChange(e.target.checked)}
                      /> ?�사?�포??
                    </label>
                  </div>
                </td>
                {/* 조회 버튼 - ASIS: 조회 버튼 */}
                <td className="search-td text-right">
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

        {/* 결과 그리??- ASIS: grdEmpList (AdvancedDataGrid) */}
        <div className="gridbox-div mb-2">
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
                <th className="grid-th">?�사??/th>
                <th className="grid-th">?�입??/th>
                <th className="grid-th">철수??/th>
                <th className="grid-th">?�태</th>
                <th className="grid-th">?�입�??�로?�트</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr 
                  key={index}
                  className={`grid-tr cursor-pointer hover:bg-blue-50 ${getRowStyle(employee)}`}
                  onDoubleClick={() => handleDoubleClick(employee)}
                >
                  {/* ASIS: labelFunction="setRowNum"�??�일 */}
                  <td className="grid-td text-center">{setRowNumber(index)}</td>
                  <td className="grid-td">{employee.OWN_OUTS_NM}</td>
                  <td className="grid-td">{employee.EMP_NM}</td>
                  <td className="grid-td">{employee.DUTY_CD_NM}</td>
                  <td className="grid-td">{employee.TCN_GRD_NM}</td>
                  <td className="grid-td">{employee.PARTY_NM}</td>
                  <td className="grid-td">{employee.ENTR_DT}</td>
                  <td className="grid-td">{employee.EXEC_IN_STRT_DT}</td>
                  <td className="grid-td">{employee.EXEC_IN_END_DT}</td>
                  <td className="grid-td">{employee.WKG_ST_DIV_NM}</td>
                  <td className="grid-td">{employee.EXEC_ING_BSN_NM}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 검??결과가 ?�을 ???�시 */}
        {employees.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">?�� 검??결과가 ?�습?�다.</p>
        )}

        {/* ?�단 ?�내문구 - ASIS: Label 컴포?�트??*/}
        <div className="text-xs text-blue-600 leading-snug whitespace-pre-wrap px-1 mb-3">
          ???�주 직원??경우, ?�사?��? 부???�로?�트 최초 ?�입?�자?�고 ?�입?�과 철수?��? 최종?�입?�과 철수?�임.{"\n"}
          ?�태???�사 직원??경우 ?�직/?�사/?�직?�로 ?�시?�고 ?�주??경우?�는 ?�직/철수�??�시??{"\n"}
          검?�하고자 ?�는 직원?�름??모�? 경우?�는 마�?�??�력??<b>%</b> 붙여??검?�하�???
        </div>

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
}

export default COMZ080P00;


