'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * ì§ì› ?•ë³´ ?¸í„°?˜ì´??(ASIS ê¸°ë°˜)
 * ASIS: AdvancedDataGrid??dataField?€ ?™ì¼??êµ¬ì¡°
 */
interface EmployeeInfo {
  LIST_NO: string;          // ëª©ë¡ ë²ˆí˜¸
  OWN_OUTS_NM: string;      // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ëª?
  EMP_NM: string;           // ì§ì›ëª?
  EMP_NO: string;           // ì§ì›ë²ˆí˜¸
  DUTY_CD_NM: string;       // ì§ì±… ì½”ë“œëª?
  TCN_GRD_NM: string;       // ê¸°ìˆ ?±ê¸‰ëª?
  PARTY_NM: string;         // ?Œì†ëª?
  ENTR_DT: string;          // ?…ì‚¬??
  EXEC_IN_STRT_DT: string;  // ?¬ì…?œì‘??
  EXEC_IN_END_DT: string;   // ?¬ì…ì¢…ë£Œ??
  WKG_ST_DIV_NM: string;    // ?íƒœëª?
  EXEC_ING_BSN_NM: string;  // ?¬ì…ì¤??„ë¡œ?íŠ¸
  HQ_DIV_CD: string;        // ë³¸ë?êµ¬ë¶„ì½”ë“œ
  DEPT_DIV_CD: string;      // ë¶€?œêµ¬ë¶„ì½”??
  CSF_CO_CD: string;        // ?Œì†ì½”ë“œ
  WKG_ST_DIV: string;       // ?íƒœì½”ë“œ
  EXEC_ING_YN: string;      // ?¬ì…ì¤‘ìœ ë¬?
  OWN_OUTS_DIV: string;     // êµ¬ë¶„ì½”ë“œ
  OUTS_FIX_YN: string;      // ?¸ì£¼ë°°ì •? ë¬´
  IN_FIX_DT: string;        // ?¸ì£¼ë°°ì •?•ì •?¼ì
  IN_FIX_PRJT: string;      // ?¸ì£¼ë°°ì •?„ë¡œ?íŠ¸
  DUTY_CD: string;          // ì§ì±…ì½”ë“œ
  DUTY_DIV_CD: string;      // ?¬ì…?¸ë ¥ì§ì±…
  TCN_GRD: string;          // ?±ê¸‰ì½”ë“œ
}

/**
 * ?”ë¸”?´ë¦­??ë°˜í™˜??ìµœì†Œ ?•ë³´ ?€??
 * ASIS: EvtDblClick ?´ë²¤?¸ì˜ txtData êµ¬ì¡°?€ ?™ì¼
 * ?•ì‹: "?¬ë²ˆ^?ì‚¬?¸ì£¼êµ¬ë¶„^?¬ì›ëª??Œì†ëª??¸ì£¼ë°°ì •? ë¬´^?¸ì£¼ë°°ì •?•ì •?¼ì^?¸ì£¼ë°°ì •?„ë¡œ?íŠ¸^?¬ì…?¸ë ¥ì§ì±…êµ¬ë¶„ì½”ë“œ^?„ì¬ìµœì¢…ê¸°ìˆ ?±ê¸‰"
 */
interface EmpSelectInfo {
  empNo: string;                    // ?¬ë²ˆ (ASIS: EMP_NO)
  ownOutsDiv: string;               // ?ì‚¬?¸ì£¼êµ¬ë¶„ (ASIS: OWN_OUTS_DIV)
  empNm: string;                    // ?¬ì›ëª?(ASIS: EMP_NM)
  csfCoCd: string;                  // ?Œì†ëª?(ASIS: CSF_CO_CD)
  outsFixYn: string;                // ?¸ì£¼ë°°ì •? ë¬´ (ASIS: OUTS_FIX_YN)
  inFixDt: string;                  // ?¸ì£¼ë°°ì •?•ì •?¼ì (ASIS: IN_FIX_DT)
  inFixPrjt: string;                // ?¸ì£¼ë°°ì •?„ë¡œ?íŠ¸ (ASIS: IN_FIX_PRJT)
  dutyDivCd: string;                // ?¬ì…?¸ë ¥ ì§ì±…êµ¬ë¶„ì½”ë“œ (ASIS: DUTY_DIV_CD)
  tcnGrd: string;                   // ?„ì¬ ìµœì¢… ê¸°ìˆ ?±ê¸‰ (ASIS: TCN_GRD)
}

/**
 * postMessageë¡?ë°›ì„ ?°ì´???€??
 */
interface PostMessageData {
  type: 'CHOICE_EMP_INIT';
  strEmpNm: string;
  ownOutDiv: string;
  empList: EmployeeInfo[];
}

/**
 * ì§ì› ê²€???ì—… ì»´í¬?ŒíŠ¸ (?•ì¥ ë²„ì „)
 * ASIS: COM_02_0410.mxml ??TOBE: COMZ080P00.tsx
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * 1. ë¶€ëª¨ì°½?ì„œ ì§ì› ëª©ë¡ ?°ì´???˜ì‹  (postMessage)
 * 2. ì§ì›ëª?ê²€??(onSearchClick) - ?˜ë™ ì¡°íšŒ
 * 3. ?ì‚¬/?¸ì£¼/?ì‚¬+?¸ì£¼ êµ¬ë¶„ ê²€??(rdOwnOutDiv)
 * 4. ?´ì‚¬?í¬??ê²€??(chkRetirYn)
 * 5. ì§ì› ? íƒ(?”ë¸”?´ë¦­) (onDoubleClick)
 * 6. ?ì—… ?«ê¸° (PopUpManager.removePopUp)
 * 7. ???¤í??¼ë§ (grdEmpListStyleFunc)
 * 8. ?¤ë³´???´ë²¤??ì²˜ë¦¬ (Enter ??ê²€?? Escape ???«ê¸°)
 * 9. postMessageë¡?ë¶€ëª¨ì°½ê³??µì‹ 
 */
const COMZ080P00 = () => {
  /**
   * ì§ì› ëª©ë¡ ?íƒœ ê´€ë¦?
   * ASIS: grdEmpList.dataProvider (ArrayCollection)
   * TOBE: useStateë¡??íƒœ ê´€ë¦?
   */
  const [employees, setEmployees] = useState<EmployeeInfo[]>([])
  
  /**
   * ë¡œë”© ?íƒœ ê´€ë¦?
   * ASIS: showBusyCursor="true"
   */
  const [loading, setLoading] = useState(false)
  
  /**
   * ì§ì›ëª?ê²€?‰ì–´ ?íƒœ ê´€ë¦?
   * ASIS: txtEmpNm.text
   * TOBE: useStateë¡??íƒœ ê´€ë¦?
   */
  const [empNm, setEmpNm] = useState('')
  
  /**
   * ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ?íƒœ ê´€ë¦?
   * ASIS: rdOwnOutDiv.selectedValue
   * TOBE: useStateë¡??íƒœ ê´€ë¦?
   */
  const [ownOutDiv, setOwnOutDiv] = useState('1')
  
  /**
   * ?´ì‚¬?í¬???íƒœ ê´€ë¦?
   * ASIS: chkRetirYn.selected
   * TOBE: useStateë¡??íƒœ ê´€ë¦?
   */
  const [retirYn, setRetirYn] = useState(true)

  /**
   * ?…ë ¥ ?„ë“œ ì°¸ì¡° (ASIS: txtEmpNm)
   */
  const inputRef = useRef<HTMLInputElement>(null)

  const { showToast } = useToast()

  /**
   * ë©”ì‹œì§€ ?˜ì‹  ?íƒœ ê´€ë¦?
   */
  const [messageReceived, setMessageReceived] = useState(false)

  /**
   * postMessage ?´ë²¤???¸ë“¤??
   * ë¶€ëª?ì°½ì—???„ì†¡??choiceEmpInit ?°ì´?°ë? ì²˜ë¦¬
   */
  const handlePostMessage = (event: MessageEvent) => {
    const data = event.data;
    if (data?.type === 'CHOICE_EMP_INIT' && data?.data) {
      choiceEmpInit(data.data.empNm, data.data.ownOutDiv, data.data.empList);
      setMessageReceived(true);
    }
  }

  /**
   * init_Complete ?¨ìˆ˜
   * ASIS: init_Complete() ?¨ìˆ˜?€ ?™ì¼????• 
   * ëª¨ë‹¬??ì²˜ìŒ ë¡œë“œ????ì´ˆê¸°???‘ì—…???˜í–‰
   */
  const init_Complete = () => {
    setEmpNm('')
    setEmployees([])
    setLoading(false)
    setOwnOutDiv('1')
    setRetirYn(true)
    // ê²€?‰ì°½???¬ì»¤??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * ì§ì› ê²€???¨ìˆ˜ (API ?¸ì¶œ)
   * ASIS: onSearchClick() ?¨ìˆ˜?€ ?™ì¼????• 
   * 
   * ?„ë¡œ?œì?: COM_02_0411_S(?, ?, ?, ?, ?, ?)
   * ?Œë¼ë¯¸í„°: ì¡°íšŒêµ¬ë¶„, ?¬ì›ë²ˆí˜¸, ?¬ì›ëª? ?ì‚¬?¸ì£¼êµ¬ë¶„, ?´ì‚¬?í¬?¨ì¡°?Œìœ ë¬?
   */
  const handleSearch = async () => {
    // ASIS: validation check
    if (!empNm.trim()) {
      showToast('ì§ì›ëª…ì„ ?…ë ¥?´ì£¼?¸ìš”.', 'warning')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/COMZ080P00/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kb: '2', // ?¬ì›ëª…ìœ¼ë¡?ê²€??(ASIS: strSrchKb)
          empNo: '', // ?¬ì›ë²ˆí˜¸ (ASIS: ë¹ˆê°’)
          empNm: empNm.trim(), // ?¬ì›ëª?(ASIS: strEmpNm)
          ownOutsDiv: ownOutDiv === 'ALL' ? null : ownOutDiv, // ?ì‚¬?¸ì£¼êµ¬ë¶„ (ASIS: OwnOutDiv)
          retirYn: retirYn ? 'Y' : 'N' // ?´ì‚¬?í¬?¨ì¡°?Œìœ ë¬?(ASIS: chkRetirYn.selected)
        })
      })

      if (res.ok) {
        const empData = await res.json()
        setEmployees(empData.data)
        
        // ASIS: ê²€??ê²°ê³¼ê°€ ?†ê³  ê²€?‰ì–´ê°€ ?ˆëŠ” ê²½ìš° ?Œë¦¼
        if (empData.data.length === 0 && empNm.trim()) {
          showToast('?´ë‹¹ ì§ì›ëª…ì? ì¡´ì¬?˜ì? ?ŠìŠµ?ˆë‹¤.', 'warning')
        }
      } else {
        const errorData = await res.json()
        const errorMessage = errorData.message || 'ê²€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
        showToast(errorMessage, 'error')
        setEmployees([])
      }
    } catch (e) {
      console.error('ê²€???¤íŒ¨:', e)
      showToast('ê²€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * ì§ì› ?”ë¸”?´ë¦­ ì²˜ë¦¬ ?¨ìˆ˜ (ASIS ê¸°ë°˜)
   * ASIS: onDoubleClick() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * 
   * ? íƒ??ì§ì› ?•ë³´ë¥?ë¶€ëª?ì»´í¬?ŒíŠ¸ë¡??„ë‹¬?˜ê³  ?ì—… ?«ê¸°
   * ASIS: EvtDblClick ?´ë²¤??ë°œìƒ ??PopUpManager.removePopUp()
   */
  const handleDoubleClick = (employee: EmployeeInfo) => {
    // ASIS: evtDblClck.txtData êµ¬ì¡°?€ ?™ì¼
    const selectInfo: EmpSelectInfo = {
      empNo: employee.EMP_NO,                    // [0]: ?¬ë²ˆ (ASIS: grdEmpList.selectedItem.EMP_NO)
      ownOutsDiv: employee.OWN_OUTS_DIV,        // [1]: ?ì‚¬?¸ì£¼êµ¬ë¶„ (ASIS: grdEmpList.selectedItem.OWN_OUTS_DIV)
      empNm: employee.EMP_NM,                   // [2]: ?¬ì›ëª?(ASIS: grdEmpList.selectedItem.EMP_NM)
      csfCoCd: employee.CSF_CO_CD,              // [3]: ?Œì†ëª?(ASIS: grdEmpList.selectedItem.CSF_CO_CD)
      outsFixYn: employee.OUTS_FIX_YN,          // [4]: ?¸ì£¼ë°°ì •? ë¬´ (ASIS: grdEmpList.selectedItem.OUTS_FIX_YN)
      inFixDt: employee.IN_FIX_DT,              // [5]: ?¸ì£¼ë°°ì •?•ì •?¼ì (ASIS: grdEmpList.selectedItem.IN_FIX_DT)
      inFixPrjt: employee.IN_FIX_PRJT,          // [6]: ?¸ì£¼ë°°ì •?„ë¡œ?íŠ¸ (ASIS: grdEmpList.selectedItem.IN_FIX_PRJT)
      dutyDivCd: employee.DUTY_DIV_CD,          // [7]: ?¬ì…?¸ë ¥ ì§ì±…êµ¬ë¶„ì½”ë“œ (ASIS: grdEmpList.selectedItem.DUTY_DIV_CD)
      tcnGrd: employee.TCN_GRD                  // [8]: ?„ì¬ ìµœì¢… ê¸°ìˆ ?±ê¸‰ (ASIS: grdEmpList.selectedItem.TCN_GRD)
    }

    // ?ì—… ì°½ì¸ ê²½ìš° ë¶€ëª?ì°½ìœ¼ë¡?ê²°ê³¼ ?„ì†¡
    if (window.opener && !window.opener.closed) {
      try {
        // ë¶€ëª?ì°½ì˜ handleEmployeeSelect ?¨ìˆ˜ ?¸ì¶œ
        const messageData = {
          type: 'EMP_SELECTED',
          data: selectInfo,
          source: 'COMZ080P00',
          timestamp: new Date().toISOString()
        };
        
        window.opener.postMessage(messageData, '*');
        
        // ?ì—… ì°??«ê¸°
        window.close();
      } catch (error) {
        console.error('ë¶€ëª¨ì°½ ?µì‹  ?¤ë¥˜:', error);
      }
    }
  }

  /**
   * ?Œì´ë¸???ë²ˆí˜¸ ?ì„± ?¨ìˆ˜
   * ASIS: setRowNum() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * 
   * @param index - ???¸ë±??
   * @returns ??ë²ˆí˜¸ (1ë¶€???œì‘)
   */
  const setRowNumber = (index: number) => {
    // ASIS: var index:int = grdEmpList.dataProvider.getItemIndex(cItem) + 1
    return String(index + 1)
  }

  /**
   * ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ë³€ê²?ì²˜ë¦¬
   * ASIS: onChangeOwnOutDiv() ?¨ìˆ˜?€ ?™ì¼????• 
   */
  const handleOwnOutDivChange = (value: string) => {
    setOwnOutDiv(value)
  }

  /**
   * ?´ì‚¬?í¬??ì²´í¬ë°•ìŠ¤ ë³€ê²?ì²˜ë¦¬
   * ASIS: chkRetirYn.selected ë³€ê²??´ë²¤??
   */
  const handleRetirYnChange = (checked: boolean) => {
    setRetirYn(checked)
  }

  /**
   * ???¤í????¨ìˆ˜ (ASIS ê¸°ë°˜)
   * ASIS: grdEmpListStyleFunc() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * 
   * @param employee - ì§ì› ?•ë³´
   * @returns CSS ?´ë˜?¤ëª…
   */
  const getRowStyle = (employee: EmployeeInfo) => {
    if (employee.WKG_ST_DIV === "3") {        // ?´ì‚¬ (ASIS: data["WKG_ST_DIV"] == "3")
      return "text-red-600"
    } else if (employee.WKG_ST_DIV === "2") { // ?´ì§ (ASIS: data["WKG_ST_DIV"] == "2")
      return "text-blue-600"
    } else if (employee.OWN_OUTS_DIV === "2" && employee.EXEC_ING_YN === "N") { // ì² ìˆ˜???¸ì£¼??ê²½ìš° (ASIS: data["OWN_OUTS_DIV"] == "2" && data["EXEC_ING_YN"] == "N")
      return "text-red-600"
    }
    return ""
  }

  /**
   * ?¤ë³´???´ë²¤??ì²˜ë¦¬ ?¨ìˆ˜
   * ASIS: Enter ???´ë²¤??ì²˜ë¦¬
   * Enter: ê²€???¤í–‰
   * Escape: ?ì—… ?«ê¸°
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
   * ?¬ì»¤?????„ì²´ ? íƒ
   * ASIS: FInputHangul ì»´í¬?ŒíŠ¸???¬ì»¤?????„ì²´ ? íƒ ê¸°ëŠ¥ê³??™ì¼
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  /**
   * ì§ì› ? íƒ ë¦¬ìŠ¤??ì´ˆê¸°???¨ìˆ˜
   * ASIS: choiceEmpInit() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * 
   * @param strEmpNm - ì´ˆê¸° ì§ì›ëª?
   * @param ownOutDiv - ì´ˆê¸° ?ì‚¬/?¸ì£¼ êµ¬ë¶„
   * @param empList - ì´ˆê¸° ì§ì› ëª©ë¡
   */
  const choiceEmpInit = (strEmpNm: string, ownOutDiv: string, empList: EmployeeInfo[]) => {
    // ASIS: txtEmpNm.text = strEmpNm; rdOwnOutDiv.selectedValue = OwnOutDiv; grdEmpList.dataProvider = arrEmpList
    setEmpNm(strEmpNm)
    setOwnOutDiv(ownOutDiv)
    setEmployees(empList)
    // ê²€?‰ì°½???¬ì»¤??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * ì»´í¬?ŒíŠ¸ ì´ˆê¸°??ë°?ë©”ì‹œì§€ ?˜ì‹  ì²˜ë¦¬
   */
  const messageListenerRef = useRef<((event: MessageEvent) => void) | null>(null);
  const isInitializedRef = useRef(false);
  
  useEffect(() => {
    // ?´ë? ì´ˆê¸°?”ë˜?ˆëŠ”ì§€ ?•ì¸
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
      {/* ?ì—… ?ë‹¨ ?¤ë” - ASIS: TitleWindow??titleê³?showCloseButton */}
      <div className="popup-header">
        <h3 className="popup-title">ì§ì› ê²€??/h3>
        <button 
          className="popup-close" 
          type="button" 
          onClick={() => {
            if (window.opener && !window.opener.closed) {
              window.close();
            }
          }}
        >
          Ã—
        </button>
      </div>

      {/* ?ì—… ë³¸ë¬¸ - ASIS: VBox ?´ë? ?ì—­ */}
      <div className="popup-body">
        {/* ê²€???ì—­ - ASIS: HBox ??ê²€??ì¡°ê±´ ?ì—­ */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                {/* ì§ì›ëª??…ë ¥ - ASIS: txtEmpNm (FInputHangul) */}
                <th className="search-th w-[80px]">ì§ì›ëª?/th>
                <td className="search-td w-[200px]">
                  <input 
                    ref={inputRef}
                    type="text" 
                    className="input-base input-default w-full" 
                    value={empNm}
                    onChange={(e) => setEmpNm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder="ì§ì›ëª??…ë ¥"
                  />
                </td>
                {/* ?ì‚¬/?¸ì£¼ êµ¬ë¶„ - ASIS: rdOwnOutDiv (RadioButtonGroup) */}
                <td className="search-td" colSpan={6}>
                  <div className="flex items-center gap-4 text-sm">
                    <label>
                      <input 
                        type="radio" 
                        name="type" 
                        checked={ownOutDiv === '1'}
                        onChange={() => handleOwnOutDivChange('1')}
                      /> ?ì‚¬
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="type" 
                        checked={ownOutDiv === '2'}
                        onChange={() => handleOwnOutDivChange('2')}
                      /> ?¸ì£¼
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="type" 
                        checked={ownOutDiv === 'ALL'}
                        onChange={() => handleOwnOutDivChange('ALL')}
                      /> ?ì‚¬+?¸ì£¼
                    </label>
                    {/* ?´ì‚¬?í¬??ì²´í¬ë°•ìŠ¤ - ASIS: chkRetirYn (CheckBox) */}
                    <label>
                      <input 
                        type="checkbox" 
                        checked={retirYn}
                        onChange={(e) => handleRetirYnChange(e.target.checked)}
                      /> ?´ì‚¬?í¬??
                    </label>
                  </div>
                </td>
                {/* ì¡°íšŒ ë²„íŠ¼ - ASIS: ì¡°íšŒ ë²„íŠ¼ */}
                <td className="search-td text-right">
                  <button 
                    className="btn-base btn-search" 
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? 'ì¡°íšŒ ì¤?..' : 'ì¡°íšŒ'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ê²°ê³¼ ê·¸ë¦¬??- ASIS: grdEmpList (AdvancedDataGrid) */}
        <div className="gridbox-div mb-2">
          <table className="grid-table">
            <thead>
              <tr>
                {/* ASIS: AdvancedDataGridColumnê³??™ì¼??ì»¬ëŸ¼ êµ¬ì¡° */}
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th">êµ¬ë¶„</th>
                <th className="grid-th">ì§ì›ëª?/th>
                <th className="grid-th">ì§ì±…</th>
                <th className="grid-th">?±ê¸‰</th>
                <th className="grid-th">?Œì†</th>
                <th className="grid-th">?…ì‚¬??/th>
                <th className="grid-th">?¬ì…??/th>
                <th className="grid-th">ì² ìˆ˜??/th>
                <th className="grid-th">?íƒœ</th>
                <th className="grid-th">?¬ì…ì¤??„ë¡œ?íŠ¸</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr 
                  key={index}
                  className={`grid-tr cursor-pointer hover:bg-blue-50 ${getRowStyle(employee)}`}
                  onDoubleClick={() => handleDoubleClick(employee)}
                >
                  {/* ASIS: labelFunction="setRowNum"ê³??™ì¼ */}
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

        {/* ê²€??ê²°ê³¼ê°€ ?†ì„ ???œì‹œ */}
        {employees.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">?” ê²€??ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.</p>
        )}

        {/* ?˜ë‹¨ ?ˆë‚´ë¬¸êµ¬ - ASIS: Label ì»´í¬?ŒíŠ¸??*/}
        <div className="text-xs text-blue-600 leading-snug whitespace-pre-wrap px-1 mb-3">
          ???¸ì£¼ ì§ì›??ê²½ìš°, ?…ì‚¬?¼ì? ë¶€???„ë¡œ?íŠ¸ ìµœì´ˆ ?¬ì…?¼ì?´ê³  ?¬ì…?¼ê³¼ ì² ìˆ˜?¼ì? ìµœì¢…?¬ì…?¼ê³¼ ì² ìˆ˜?¼ì„.{"\n"}
          ?íƒœ???ì‚¬ ì§ì›??ê²½ìš° ?¬ì§/?´ì‚¬/?´ì§?¼ë¡œ ?œì‹œ?˜ê³  ?¸ì£¼??ê²½ìš°?ëŠ” ?¬ì§/ì² ìˆ˜ë¡??œì‹œ??{"\n"}
          ê²€?‰í•˜ê³ ì ?˜ëŠ” ì§ì›?´ë¦„??ëª¨ë? ê²½ìš°?ëŠ” ë§ˆì?ë§??…ë ¥??<b>%</b> ë¶™ì—¬??ê²€?‰í•˜ë©???
        </div>

        {/* ì¢…ë£Œ ë²„íŠ¼ - ASIS: btnClose (Button) */}
        <div className="flex justify-end">
          <button 
            className="btn-base btn-delete" 
            onClick={() => {
              if (window.opener && !window.opener.closed) {
                window.close();
              }
            }}
          >
            ì¢…ë£Œ
          </button>
        </div>
      </div>
    </div>
  );
}

export default COMZ080P00;


