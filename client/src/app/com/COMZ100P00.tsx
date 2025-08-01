'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * ì§ì ?ë³´ ?¸í°?ì´??(ASIS ê¸°ë°)
 * ASIS: COM_02_0600.mxml??AdvancedDataGrid ì»¬ë¼ êµ¬ì¡°? ?ì¼
 */
interface EmpInfo {
  LIST_NO: string;        // ëª©ë¡ ë²í¸
  EMP_NO: string;         // ?¬ë²
  EMP_NM: string;         // ?±ëª
  HQ_DIV_NM: string;      // ë³¸ë?ëª?
  DEPT_DIV_NM: string;    // ë¶?ëª
  DUTY_NM: string;        // ì§ê¸ëª?
  AUTH_CD_NM: string;     // ?¬ì©??ê¶í
  BSN_USE_YN: string;     // ?¬ì ?¬ì©ê¶í
  WPC_USE_YN: string;     // ì¶ì§ë¹??¬ì©ê¶í
  PSM_USE_YN: string;     // ?¸ì¬/ë³µë¦¬ ?¬ì©ê¶í
  RMK: string;            // ë¹ê³ 
  HQ_DIV_CD: string;      // ë³¸ë?êµ¬ë¶ì½ë
  DEPT_DIV_CD: string;    // ë¶?êµ¬ë¶ì½??
  DUTY_CD: string;        // ì§ê¸ì½ë
  DUTY_DIV_CD: string;    // ì§ì±êµ¬ë¶ì½ë
  AUTH_CD: string;        // ê¶íì½ë
  APV_APOF_ID: string;    // ?¹ì¸ê²°ì¬?ID
  EMAIL_ADDR: string;     // ?´ë©?¼ì£¼??
}

/**
 * ?ë¸?´ë¦­??ë°í??ìµì ?ë³´ ???
 * ASIS: EvtDblClick ?´ë²¤?¸ì txtData êµ¬ì¡°? ?ì¼
 * ?ì: "?¬ì©?ID^?¬ì©?ëª^?¬ì©?ë±ê¸?
 */
interface EmpSelectInfo {
  empNo: string;      // ?¬ë² (ASIS: EMP_NO)
  empNm: string;      // ?±ëª (ASIS: EMP_NM)
  authCd: string;      // ?¬ì©?ê¶??(ASIS: AUTH_CD)
}

/**
 * postMessageë¡?ë°ì ?°ì´?????
 */
interface PostMessageData {
  type: 'CHOICE_EMP_INIT';
  strEmpNm: string;
  empList: EmpInfo[];
}

/**
 * ì»´í¬?í¸ Props ?¸í°?ì´??
 * ASIS: pubEmpNm, pubOwnOutDiv ë³?ì? ?ì¼???? 
 */
interface Props {
  defaultEmpNm?: string;                    // ê¸°ë³¸ ì§ìëª?(ASIS: pubEmpNm)
  defaultEmpList?: EmpInfo[];              // ê¸°ë³¸ ì§ì ëª©ë¡ (ASIS: arrEmpListDG)
  onSelect: (empData: EmpSelectInfo) => void;  // ì§ì ? í ì½ë°± (ASIS: EvtDblClick ?´ë²¤??
  onClose: () => void;                      // ëª¨ë¬ ?«ê¸° ì½ë°± (ASIS: PopUpManager.removePopUp)
}

/**
 * ì»´í¬?í¸ Ref ?¸í°?ì´??
 * ASIS: choiceEmpInit() ?¨ì? ?ì¼???? 
 */
export interface EmpSearchModalRef {
  choiceEmpInit: (strEmpNm: string, empList: EmpInfo[]) => void
}

/**
 * ?í ?°ì´??(?ì??ì£¼ì ?´ì ?ì¬ ?¬ì©)
 * ASIS: ?ì¤?¸ì© ?°ì´??êµ¬ì¡°? ?ì¼
 */
/*
const SAMPLE_EMP_DATA: EmpInfo[] = [
  {
    LIST_NO: "1",
    EMP_NO: "E001",
    EMP_NM: "?ê¸¸??,
    HQ_DIV_NM: "ê²½ìë³¸ë?",
    DEPT_DIV_NM: "?ëµ?",
    DUTY_NM: "ê³¼ì¥",
    AUTH_CD_NM: "ê´ë¦¬ì",
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
 * ì§ì ?ë³´ ì¡°í ?ì (?ì ?ì©)
 * ASIS: COM_02_0600.mxml ??TOBE: COMZ100P00.tsx
 *
 * ì£¼ì ê¸°ë¥:
 * 1. ?¬ì©?ëª?¼ë¡ ?¤ìê°?ê²??(USR_01_0201_S)
 * 2. ê²??ê²°ê³¼ë¥??ì´ë¸??íë¡??ì
 * 3. ?ë¸?´ë¦­?¼ë¡ ì§ì ? í (window.opener.postMessage)
 * 4. Enter ?¤ë¡ ê²???¤í
 * 5. Escape ?¤ë¡ ?ì ?«ê¸°
 * 6. ?¬ì»¤?????ì²´ ? í
 * 7. postMessageë¡??°ì´???ì  ë°?ë¶ëª?ì°½ì¼ë¡?ê²°ê³¼ ?ì¡
 */
const COMZ100P00 = () => {
  // ì§ì ëª©ë¡ ?í ê´ë¦?(ASIS: grdEmpList.dataProvider)
  const [emps, setEmps] = useState<EmpInfo[]>([])
  // ë¡ë© ?í ê´ë¦?(ASIS: showBusyCursor="true")
  const [loading, setLoading] = useState(false)
  // ì§ìëª?ê²?ì´ ?í ê´ë¦?(ASIS: txtEmpNm.text)
  const [empNm, setEmpNm] = useState('')
  // ?ë ¥ ?ë ì°¸ì¡° (ASIS: txtEmpNm)
  const inputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  // ë©ìì§ ?ì  ?í ê´ë¦?
  const [messageReceived, setMessageReceived] = useState(false)

  /**
   * postMessage ?´ë²¤???¸ë¤??
   * ë¶ëª?ì°?USR2010M00)?ì ?ì¡??choiceEmpInit ?°ì´?°ë? ì²ë¦¬
   */
  const handlePostMessage = (event: MessageEvent) => {
    const data = event.data;
    console.log('COMZ100P00 - postMessage ?ì :', data);
    
    if (data?.type === 'CHOICE_EMP_INIT' && data?.data) {
      console.log('COMZ100P00 - ì§ì ?°ì´???ì :', {
        empNm: data.data.empNm,
        empListLength: data.data.empList?.length || 0,
        empList: data.data.empList
      });
      
      choiceEmpInit(data.data.empNm, data.data.empList);
      setMessageReceived(true);
    }
  }

  /**
   * init_Complete ?¨ì
   * ASIS: init_Complete() ?¨ì? ?ì¼???? 
   * ëª¨ë¬??ì²ì ë¡ë????ì´ê¸°???ì???í
   */
  const init_Complete = () => {
    setEmpNm('')
    setEmps([])
    setLoading(false)
    // ê²?ì°½???¬ì»¤??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * choiceEmpInit ?¨ì
   * ASIS: choiceEmpInit(strEmpNm:String, arrEmpList:ArrayCollection) ?¨ì? ?ì¼
   * ì§ìëªê³¼ ì§ìë¦¬ì¤?¸ë? ë°ì???ë ¥ì°½ê³¼ ê²°ê³¼ ê·¸ë¦¬?ë? ì´ê¸°??
   * @param strEmpNm ì§ìëª?(ASIS: strEmpNm)
   * @param empList ì§ìë¦¬ì¤??(ASIS: arrEmpList)
   */
  const choiceEmpInit = (strEmpNm: string, empList: EmpInfo[]) => {
    setEmpNm(strEmpNm)
    setEmps(empList)
    setLoading(false)
    // ê²?ì°½???¬ì»¤??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * ì§ì ê²???¨ì
   * ASIS: onSearchClick() ?¨ì? ?ì¼??ë¡ì§
   * ?ë¡?ì?: USR_01_0201_S(?, ?, ?, ?)
   * ?ë¼ë¯¸í°: ë³¸ë?êµ¬ë¶ì½ë, ë¶?êµ¬ë¶ì½?? ?¬ì©?ëª
   * APIë¥??¸ì¶?ì¬ ì§ì ?ë³´ë¥?ê²?íê³?ê²°ê³¼ë¥??í?????
   */
  const handleSearch = async () => {
    // ?¬ì©?ëª ?ì ?ë ¥ ê²ì¦?
    if (!empNm.trim()) {
      showToast('?¬ì©?ëª???ë ¥?´ì£¼?¸ì.', 'warning')
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
        
        // ê²??ê²°ê³¼ê° ?ê³  ê²?ì´ê° ?ë ê²½ì° ?ë¦¼ (ASIS: Alert.show("?´ë¹ ?¬ì©?ëª? ì¡´ì¬?ì? ?ìµ?ë¤."))
        if (empList.length === 0 && empNm.trim()) {
          showToast('?´ë¹ ì§ìëªì? ì¡´ì¬?ì? ?ìµ?ë¤.', 'warning')
        }
      } else {
        const errorData = await res.json()
        const errorMessage = errorData.message || 'ê²??ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
        showToast(errorMessage, 'error')
        setEmps([])
      }
    } catch (e) {
      console.error('ê²???¤í¨:', e)
      showToast('ê²??ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.', 'error')
      setEmps([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * ì§ì ?ë¸?´ë¦­ ì²ë¦¬ ?¨ì
   * ASIS: onDoubleClick(idx:int) ?¨ì? ?ì¼??ë¡ì§
   * ?ë¸?´ë¦­ ??? í??ì§ì ?ë³´ë¥?ë¶ëª?ì»´í¬?í¸ë¡??ë¬
   * ?ì ì°½ì¸ ê²½ì° ë¶ëª?ì°?USR2010M00)??handleApproverSelect ?¨ì ?¸ì¶
   */
  const handleDoubleClick = (emp: EmpInfo) => {
    const selectInfo: EmpSelectInfo = {
      empNo: emp.EMP_NO,      // ASIS: grdEmpList.selectedItem.EMP_NO
      empNm: emp.EMP_NM,      // ASIS: grdEmpList.selectedItem.EMP_NM
      authCd: emp.AUTH_CD,    // ASIS: grdEmpList.selectedItem.AUTH_CD
    }

    // ?ì ì°½ì¸ ê²½ì° ë¶ëª?ì°½ì¼ë¡?ê²°ê³¼ ?ì¡
    if (window.opener && !window.opener.closed) {
      try {
        // ë¶ëª?ì°½ì handleApproverSelect ?¨ì ?¸ì¶
        const messageData = {
          type: 'EMP_SELECTED',
          data: selectInfo,
          source: 'COMZ100P00',
          timestamp: new Date().toISOString()
        };
        
        window.opener.postMessage(messageData, '*');
        
        // ?ì ì°??«ê¸°
        window.close();
      } catch (error) {
        // fallback: ë¡ì»¬ onSelect ì½ë°± ?¬ì©
        // onSelect(selectInfo); // This line is removed as per the new_code
        // onClose(); // This line is removed as per the new_code
      }
    } else {
      // ?¼ë° ëª¨ë¬??ê²½ì° ê¸°ì¡´ ë°©ì ?¬ì©
      // onSelect(selectInfo); // This line is removed as per the new_code
      // onClose(); // This line is removed as per the new_code
    }
  }

  /**
   * ?ì´ë¸???ë²í¸ ?ì± ?¨ì
   * ASIS: setRowNum(cItem:Object,i_column:AdvancedDataGridColumn):String ?¨ì? ?ì¼
   * @param index ???¸ë±??
   * @returns ??ë²í¸ ë¬¸ì??
   */
  const setRowNumber = (index: number) => {
    return String(index + 1)
  }

  /**
   * ?¤ë³´???´ë²¤??ì²ë¦¬ ?¨ì
   * ASIS: ?¤ë³´???´ë²¤??ì²ë¦¬? ?ì¼
   * Enter: ê²???¤í
   * Escape: ?ì ?«ê¸°
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
   * ?¬ì»¤?????ì²´ ? í
   * ASIS: FInputHangul ì»´í¬?í¸???¬ì»¤?????ì²´ ? í ê¸°ë¥ê³??ì¼
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  /**
   * ì»´í¬?í¸ ì´ê¸°??ë°?ë©ìì§ ?ì  ì²ë¦¬
   */
  const messageListenerRef = useRef<((event: MessageEvent) => void) | null>(null);
  const isInitializedRef = useRef(false);
  
  useEffect(() => {
    // ?´ë? ì´ê¸°?ë?ëì§ ?ì¸
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
   * ?¸ë??ì ?¸ì¶?????ë ë©ì?ë¤??ref???¸ì¶
   * ASIS: choiceEmpInit ?¨ìë¥??¸ë??ì ?¸ì¶?????ëë¡??¸ì¶
   */
  // useImperativeHandle(ref, () => ({ // This line is removed as per the new_code
  //   choiceEmpInit: (strEmpNm: string, empList: EmpInfo[]) => { // This line is removed as per the new_code
  //     choiceEmpInit(strEmpNm, empList); // This line is removed as per the new_code
  //   } // This line is removed as per the new_code
  // })) // This line is removed as per the new_code

  return (
    <div className="popup-wrapper min-w-[840px]">
      {/* ?ì ?¤ë (ASIS: TitleWindow ?¤ë) */}
      <div className="popup-header">
        <h3 className="popup-title">?¬ì©?ëª ê²??/h3>
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
          Ã
        </button>
      </div>

      {/* ?ì ë³¸ë¬¸ (ASIS: VBox ?ì­) */}
      <div className="popup-body scroll-area">

        {/* ê²??ì¡°ê±´ (ASIS: HBox ê²???ì­) */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                {/* ?¬ì©?ëª ?ë ¥ (ASIS: txtEmpNm) */}
                <th className="search-th w-[100px]">?¬ì©??ëª?/th>
                <td className="search-td w-[200px]">
                  <input
                    ref={inputRef}
                    type="text"
                    className="input-base input-default w-full"
                    value={empNm}
                    onChange={(e) => setEmpNm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder="?¬ì©?ëª ?ë ¥"
                  />
                  
                </td>
                {/* ì¡°í ë²í¼ (ASIS: ì¡°í ë²í¼) */}
                <td className="search-td text-right" colSpan={6}>
                  <button 
                    className="btn-base btn-search" 
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? 'ì¡°í ì¤?..' : 'ì¡°í'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ê²°ê³¼ ê·¸ë¦¬??(ASIS: grdEmpList AdvancedDataGrid) */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                {/* ASIS: AdvancedDataGridColumn êµ¬ì¡°? ?ì¼ */}
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th w-[60px]">?¬ë²</th>
                <th className="grid-th w-[70px]">?±ëª</th>
                <th className="grid-th w-[120px]">ë³¸ë?ëª?/th>
                <th className="grid-th w-[120px]">ë¶?ëª</th>
                <th className="grid-th w-[60px]">ì§ê¸ëª?/th>
                <th className="grid-th w-[100px]">?¬ì©??ê¶í</th>
                {/* ASIS: AdvancedDataGridColumnGroup "?ë¬´ë³??¬ì©ê¶í" */}
                <th className="grid-th w-[60px]">?¬ì</th>
                <th className="grid-th w-[60px]">ì¶ì§ë¹?/th>
                <th className="grid-th w-[60px]">?¸ì¬/ë³µë¦¬</th>
                <th className="grid-th">ë¹ê³ </th>
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
                  {/* ASIS: CheckBox itemRenderer? ?ì¼??ê¸°ë¥ */}
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

        {/* ê²??ê²°ê³¼ê° ?ì ???ì (ASIS: ë¹?ê·¸ë¦¬???ì) */}
        {emps.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">? ê²??ê²°ê³¼ê° ?ìµ?ë¤.</p>
        )}

        {/* ì¢ë£ ë²í¼ ?ë¨ ?°ì¸¡ ?ë ¬ (ASIS: btnClose) */}
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
            ì¢ë£
          </button>
        </div>
      </div>
    </div>
  );
}

export default COMZ100P00;



