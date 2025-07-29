'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * ì§ì› ?•ë³´ ?¸í„°?˜ì´??
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
  BSN_NM: string;           // ?¬ì—…ëª?
  EXEC_IN_STRT_DT: string;  // ?¬ì…?œì‘??
  EXEC_IN_END_DT: string;   // ?¬ì…ì¢…ë£Œ??
  RMK: string;              // ë¹„ê³ 
  HQ_DIV_CD: string;        // ë³¸ë?êµ¬ë¶„ì½”ë“œ
  DEPT_DIV_CD: string;      // ë¶€?œêµ¬ë¶„ì½”??
}

/**
 * ?”ë¸”?´ë¦­??ë°˜í™˜??ìµœì†Œ ?•ë³´ ?€??
 * ASIS: EvtDblClick ?´ë²¤?¸ì˜ txtData êµ¬ì¡°?€ ?™ì¼
 * ?•ì‹: "?¬ë²ˆ^?ì‚¬?¸ì£¼êµ¬ë¶„^?¬ì›ëª?
 */
interface EmpSelectInfo {
  empNo: string;           // ?¬ë²ˆ (ASIS: EMP_NO)
  ownOutsNm: string;       // ?ì‚¬/?¸ì£¼ êµ¬ë¶„ (ASIS: OWN_OUTS_NM)
  empNm: string;           // ?¬ì›ëª?(ASIS: EMP_NM)
}

/**
 * postMessageë¡?ë°›ì„ ?°ì´???€??
 */
interface PostMessageData {
  type: 'CHOICE_EMP_INIT';
  strEmpNm: string;
  empList: EmployeeInfo[];
}

/**
 * ì§ì› ê²€???ì—… ì»´í¬?ŒíŠ¸
 * ASIS: COM_02_0400.mxml ??TOBE: COMZ070P00.tsx
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * 1. ë¶€ëª¨ì°½?ì„œ ì§ì› ëª©ë¡ ?°ì´???˜ì‹  (postMessage)
 * 2. ì§ì›ëª??…ë ¥ ?„ë“œ (ê²€?‰ìš©???„ë‹Œ ?œì‹œ??
 * 3. ì§ì› ? íƒ(?”ë¸”?´ë¦­) (onDoubleClick)
 * 4. ?ì—… ?«ê¸° (PopUpManager.removePopUp)
 * 5. postMessageë¡?ë¶€ëª¨ì°½ê³??µì‹ 
 */
const COMZ070P00 = () => {
  /**
   * ì§ì› ëª©ë¡ ?íƒœ ê´€ë¦?
   * ASIS: grdEmpList.dataProvider (ArrayCollection)
   * TOBE: useStateë¡??íƒœ ê´€ë¦?
   */
  const [employees, setEmployees] = useState<EmployeeInfo[]>([])
  
  /**
   * ì§ì›ëª?ê²€?‰ì–´ ?íƒœ ê´€ë¦?
   * ASIS: txtEmpNm.text
   * TOBE: useStateë¡??íƒœ ê´€ë¦?
   */
  const [empNm, setEmpNm] = useState('')

  /**
   * ë¡œë”© ?íƒœ ê´€ë¦?
   * ASIS: showBusyCursor="true"
   */
  const [loading, setLoading] = useState(false)

  /**
   * ?…ë ¥ ?„ë“œ ì°¸ì¡° (ASIS: txtEmpNm)
   */
  const inputRef = useRef<HTMLInputElement>(null)

  const { showToast } = useToast();

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
      choiceEmpInit(data.data.empNm, data.data.empList);
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
    // ê²€?‰ì°½???¬ì»¤??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * choiceEmpInit
   * ASIS: choiceEmpInit(strEmpNm:String, arrEmpList:ArrayCollection):void ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * ì§ì›? íƒ ë¦¬ìŠ¤???”ë©´ ?¸ì¶œ????ì´ˆê¸°ê°??¤ì •
   * @param strEmpNm - ì´ˆê¸° ì§ì›ëª?
   * @param arrEmpList - ì´ˆê¸° ì§ì› ëª©ë¡
   */
  const choiceEmpInit = (strEmpNm: string, arrEmpList: EmployeeInfo[]) => {
    // ASIS: txtEmpNm.text = strEmpNm; grdEmpList.dataProvider = arrEmpList
    setEmpNm(strEmpNm);
    setEmployees(arrEmpList);
    // ê²€?‰ì°½???¬ì»¤??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  };

  /**
   * fnBsnNoSearch
   * ASIS: fnBsnNoSearch():void ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * ì°??´ë©´???ë™ì¡°íšŒ
   */
  const fnBsnNoSearch = () => {
    // ASIS: init(); onSearchClick()
    handleSearch();
  };

  /**
   * ì§ì› ?”ë¸”?´ë¦­ ì²˜ë¦¬ ?¨ìˆ˜
   * ASIS: onDoubleClick() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * 
   * ? íƒ??ì§ì› ?•ë³´ë¥?ë¶€ëª?ì»´í¬?ŒíŠ¸ë¡??„ë‹¬?˜ê³  ?ì—… ?«ê¸°
   * ASIS: EvtDblClick ?´ë²¤??ë°œìƒ ??PopUpManager.removePopUp()
   */
  const handleDoubleClick = (employee: EmployeeInfo) => {
    // ASIS: evtDblClck.txtData = grdEmpList.selectedItem.EMP_NO + "^" + grdEmpList.selectedItem.OWN_OUTS_NM + "^" + grdEmpList.selectedItem.EMP_NM
    const selectInfo: EmpSelectInfo = {
      empNo: employee.EMP_NO,
      ownOutsNm: employee.OWN_OUTS_NM,
      empNm: employee.EMP_NM
    }

    // ?ì—… ì°½ì¸ ê²½ìš° ë¶€ëª?ì°½ìœ¼ë¡?ê²°ê³¼ ?„ì†¡
    if (window.opener && !window.opener.closed) {
      try {
        // ë¶€ëª?ì°½ì˜ handleEmployeeSelect ?¨ìˆ˜ ?¸ì¶œ
        const messageData = {
          type: 'EMP_SELECTED',
          data: selectInfo,
          source: 'COMZ070P00',
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
   * ?¤ë³´???´ë²¤??ì²˜ë¦¬ ?¨ìˆ˜
   * ASIS: ?¤ë³´???´ë²¤??ì²˜ë¦¬?€ ?™ì¼
   * Enter: ê²€???¤í–‰
   * Escape: ?ì—… ?«ê¸°
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
   * ?¬ì»¤?????„ì²´ ? íƒ
   * ASIS: FInputHangul ì»´í¬?ŒíŠ¸???¬ì»¤?????„ì²´ ? íƒ ê¸°ëŠ¥ê³??™ì¼
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  /**
   * ì§ì› ê²€??ê¸°ëŠ¥ (êµ¬í˜„ ?„ìš”)
   * ASIS: onSearchClick() ?¨ìˆ˜?€ ?™ì¼????• 
   * 
   * TODO: API ?°ë™ êµ¬í˜„ ?„ìš”
   * - ?”ë“œ?¬ì¸?? /api/COMZ070P00/search
   * - ?Œë¼ë¯¸í„°: ì§ì›ëª?(empNm)
   * - ?‘ë‹µ: ì§ì› ëª©ë¡ (EmployeeInfo[])
   */
  const handleSearch = async () => {
    // ì¡°íšŒ ê¸°ëŠ¥ ?œê±°??- ë¶€ëª¨ì°½?ì„œ ?°ì´?°ë? ë°›ì•„???œì‹œë§???
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
      {/* ?ì—… ?¤ë” - ASIS: TitleWindow??titleê³?showCloseButton */}
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

      <div className="popup-body">
        {/* ê²€???ì—­ - ASIS: HBox ??TextInputê³?Button */}
        <div className="search-div mb-4">
          <table className="search-table">
            <tbody>
              <tr>
                {/* ì§ì›ëª??…ë ¥ - ASIS: txtEmpNm (TextInput) */}
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
                {/* ì¡°íšŒ ë²„íŠ¼ ?œê±°??*/}
                <td className="search-td text-right" colSpan={6}>
                  {/* ì¡°íšŒ ë²„íŠ¼ ?œê±°??*/}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ê²°ê³¼ ê·¸ë¦¬??- ASIS: grdEmpList (AdvancedDataGrid) */}
        <div className="gridbox-div mb-4">
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
                <th className="grid-th">ìµœì¢…?„ë¡œ?íŠ¸</th>
                <th className="grid-th">?¬ì…??/th>
                <th className="grid-th">ì² ìˆ˜??/th>
                <th className="grid-th">ë¹„ê³ </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr 
                  key={index}
                  className="grid-tr cursor-pointer hover:bg-blue-50"
                  onDoubleClick={() => handleDoubleClick(employee)}
                >
                  {/* ASIS: labelFunction="setRowNum"ê³??™ì¼ */}
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

        {/* ê²€??ê²°ê³¼ê°€ ?†ì„ ???œì‹œ */}
        {employees.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">?” ê²€??ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.</p>
        )}

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
};

export default COMZ070P00;


