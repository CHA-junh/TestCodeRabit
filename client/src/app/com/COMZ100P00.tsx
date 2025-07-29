'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * ì§ì› ?•ë³´ ?¸í„°?˜ì´??(ASIS ê¸°ë°˜)
 * ASIS: COM_02_0600.mxml??AdvancedDataGrid ì»¬ëŸ¼ êµ¬ì¡°?€ ?™ì¼
 */
interface EmpInfo {
  LIST_NO: string;        // ëª©ë¡ ë²ˆí˜¸
  EMP_NO: string;         // ?¬ë²ˆ
  EMP_NM: string;         // ?±ëª…
  HQ_DIV_NM: string;      // ë³¸ë?ëª?
  DEPT_DIV_NM: string;    // ë¶€?œëª…
  DUTY_NM: string;        // ì§ê¸‰ëª?
  AUTH_CD_NM: string;     // ?¬ìš©??ê¶Œí•œ
  BSN_USE_YN: string;     // ?¬ì—… ?¬ìš©ê¶Œí•œ
  WPC_USE_YN: string;     // ì¶”ì§„ë¹??¬ìš©ê¶Œí•œ
  PSM_USE_YN: string;     // ?¸ì‚¬/ë³µë¦¬ ?¬ìš©ê¶Œí•œ
  RMK: string;            // ë¹„ê³ 
  HQ_DIV_CD: string;      // ë³¸ë?êµ¬ë¶„ì½”ë“œ
  DEPT_DIV_CD: string;    // ë¶€?œêµ¬ë¶„ì½”??
  DUTY_CD: string;        // ì§ê¸‰ì½”ë“œ
  DUTY_DIV_CD: string;    // ì§ì±…êµ¬ë¶„ì½”ë“œ
  AUTH_CD: string;        // ê¶Œí•œì½”ë“œ
  APV_APOF_ID: string;    // ?¹ì¸ê²°ì¬?ID
  EMAIL_ADDR: string;     // ?´ë©”?¼ì£¼??
}

/**
 * ?”ë¸”?´ë¦­??ë°˜í™˜??ìµœì†Œ ?•ë³´ ?€??
 * ASIS: EvtDblClick ?´ë²¤?¸ì˜ txtData êµ¬ì¡°?€ ?™ì¼
 * ?•ì‹: "?¬ìš©?ID^?¬ìš©?ëª…^?¬ìš©?ë“±ê¸?
 */
interface EmpSelectInfo {
  empNo: string;      // ?¬ë²ˆ (ASIS: EMP_NO)
  empNm: string;      // ?±ëª… (ASIS: EMP_NM)
  authCd: string;      // ?¬ìš©?ê¶Œ??(ASIS: AUTH_CD)
}

/**
 * postMessageë¡?ë°›ì„ ?°ì´???€??
 */
interface PostMessageData {
  type: 'CHOICE_EMP_INIT';
  strEmpNm: string;
  empList: EmpInfo[];
}

/**
 * ì»´í¬?ŒíŠ¸ Props ?¸í„°?˜ì´??
 * ASIS: pubEmpNm, pubOwnOutDiv ë³€?˜ì? ?™ì¼????• 
 */
interface Props {
  defaultEmpNm?: string;                    // ê¸°ë³¸ ì§ì›ëª?(ASIS: pubEmpNm)
  defaultEmpList?: EmpInfo[];              // ê¸°ë³¸ ì§ì› ëª©ë¡ (ASIS: arrEmpListDG)
  onSelect: (empData: EmpSelectInfo) => void;  // ì§ì› ? íƒ ì½œë°± (ASIS: EvtDblClick ?´ë²¤??
  onClose: () => void;                      // ëª¨ë‹¬ ?«ê¸° ì½œë°± (ASIS: PopUpManager.removePopUp)
}

/**
 * ì»´í¬?ŒíŠ¸ Ref ?¸í„°?˜ì´??
 * ASIS: choiceEmpInit() ?¨ìˆ˜?€ ?™ì¼????• 
 */
export interface EmpSearchModalRef {
  choiceEmpInit: (strEmpNm: string, empList: EmpInfo[]) => void
}

/**
 * ?˜í”Œ ?°ì´??(?„ìš”??ì£¼ì„ ?´ì œ?˜ì—¬ ?¬ìš©)
 * ASIS: ?ŒìŠ¤?¸ìš© ?°ì´??êµ¬ì¡°?€ ?™ì¼
 */
/*
const SAMPLE_EMP_DATA: EmpInfo[] = [
  {
    LIST_NO: "1",
    EMP_NO: "E001",
    EMP_NM: "?ê¸¸??,
    HQ_DIV_NM: "ê²½ì˜ë³¸ë?",
    DEPT_DIV_NM: "?„ëµ?€",
    DUTY_NM: "ê³¼ì¥",
    AUTH_CD_NM: "ê´€ë¦¬ì",
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
 * ì§ì› ?•ë³´ ì¡°íšŒ ?ì—… (?ì—… ?„ìš©)
 * ASIS: COM_02_0600.mxml ??TOBE: COMZ100P00.tsx
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * 1. ?¬ìš©?ëª…?¼ë¡œ ?¤ì‹œê°?ê²€??(USR_01_0201_S)
 * 2. ê²€??ê²°ê³¼ë¥??Œì´ë¸??•íƒœë¡??œì‹œ
 * 3. ?”ë¸”?´ë¦­?¼ë¡œ ì§ì› ? íƒ (window.opener.postMessage)
 * 4. Enter ?¤ë¡œ ê²€???¤í–‰
 * 5. Escape ?¤ë¡œ ?ì—… ?«ê¸°
 * 6. ?¬ì»¤?????„ì²´ ? íƒ
 * 7. postMessageë¡??°ì´???˜ì‹  ë°?ë¶€ëª?ì°½ìœ¼ë¡?ê²°ê³¼ ?„ì†¡
 */
const COMZ100P00 = () => {
  // ì§ì› ëª©ë¡ ?íƒœ ê´€ë¦?(ASIS: grdEmpList.dataProvider)
  const [emps, setEmps] = useState<EmpInfo[]>([])
  // ë¡œë”© ?íƒœ ê´€ë¦?(ASIS: showBusyCursor="true")
  const [loading, setLoading] = useState(false)
  // ì§ì›ëª?ê²€?‰ì–´ ?íƒœ ê´€ë¦?(ASIS: txtEmpNm.text)
  const [empNm, setEmpNm] = useState('')
  // ?…ë ¥ ?„ë“œ ì°¸ì¡° (ASIS: txtEmpNm)
  const inputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  // ë©”ì‹œì§€ ?˜ì‹  ?íƒœ ê´€ë¦?
  const [messageReceived, setMessageReceived] = useState(false)

  /**
   * postMessage ?´ë²¤???¸ë“¤??
   * ë¶€ëª?ì°?USR2010M00)?ì„œ ?„ì†¡??choiceEmpInit ?°ì´?°ë? ì²˜ë¦¬
   */
  const handlePostMessage = (event: MessageEvent) => {
    const data = event.data;
    console.log('COMZ100P00 - postMessage ?˜ì‹ :', data);
    
    if (data?.type === 'CHOICE_EMP_INIT' && data?.data) {
      console.log('COMZ100P00 - ì§ì› ?°ì´???˜ì‹ :', {
        empNm: data.data.empNm,
        empListLength: data.data.empList?.length || 0,
        empList: data.data.empList
      });
      
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
    setEmps([])
    setLoading(false)
    // ê²€?‰ì°½???¬ì»¤??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * choiceEmpInit ?¨ìˆ˜
   * ASIS: choiceEmpInit(strEmpNm:String, arrEmpList:ArrayCollection) ?¨ìˆ˜?€ ?™ì¼
   * ì§ì›ëª…ê³¼ ì§ì›ë¦¬ìŠ¤?¸ë? ë°›ì•„???…ë ¥ì°½ê³¼ ê²°ê³¼ ê·¸ë¦¬?œë? ì´ˆê¸°??
   * @param strEmpNm ì§ì›ëª?(ASIS: strEmpNm)
   * @param empList ì§ì›ë¦¬ìŠ¤??(ASIS: arrEmpList)
   */
  const choiceEmpInit = (strEmpNm: string, empList: EmpInfo[]) => {
    setEmpNm(strEmpNm)
    setEmps(empList)
    setLoading(false)
    // ê²€?‰ì°½???¬ì»¤??(ASIS: txtEmpNm.focus())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  /**
   * ì§ì› ê²€???¨ìˆ˜
   * ASIS: onSearchClick() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * ?„ë¡œ?œì?: USR_01_0201_S(?, ?, ?, ?)
   * ?Œë¼ë¯¸í„°: ë³¸ë?êµ¬ë¶„ì½”ë“œ, ë¶€?œêµ¬ë¶„ì½”?? ?¬ìš©?ëª…
   * APIë¥??¸ì¶œ?˜ì—¬ ì§ì› ?•ë³´ë¥?ê²€?‰í•˜ê³?ê²°ê³¼ë¥??íƒœ???€??
   */
  const handleSearch = async () => {
    // ?¬ìš©?ëª… ?„ìˆ˜ ?…ë ¥ ê²€ì¦?
    if (!empNm.trim()) {
      showToast('?¬ìš©?ëª…???…ë ¥?´ì£¼?¸ìš”.', 'warning')
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
        
        // ê²€??ê²°ê³¼ê°€ ?†ê³  ê²€?‰ì–´ê°€ ?ˆëŠ” ê²½ìš° ?Œë¦¼ (ASIS: Alert.show("?´ë‹¹ ?¬ìš©?ëª…?€ ì¡´ì¬?˜ì? ?ŠìŠµ?ˆë‹¤."))
        if (empList.length === 0 && empNm.trim()) {
          showToast('?´ë‹¹ ì§ì›ëª…ì? ì¡´ì¬?˜ì? ?ŠìŠµ?ˆë‹¤.', 'warning')
        }
      } else {
        const errorData = await res.json()
        const errorMessage = errorData.message || 'ê²€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
        showToast(errorMessage, 'error')
        setEmps([])
      }
    } catch (e) {
      console.error('ê²€???¤íŒ¨:', e)
      showToast('ê²€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error')
      setEmps([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * ì§ì› ?”ë¸”?´ë¦­ ì²˜ë¦¬ ?¨ìˆ˜
   * ASIS: onDoubleClick(idx:int) ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * ?”ë¸”?´ë¦­ ??? íƒ??ì§ì› ?•ë³´ë¥?ë¶€ëª?ì»´í¬?ŒíŠ¸ë¡??„ë‹¬
   * ?ì—… ì°½ì¸ ê²½ìš° ë¶€ëª?ì°?USR2010M00)??handleApproverSelect ?¨ìˆ˜ ?¸ì¶œ
   */
  const handleDoubleClick = (emp: EmpInfo) => {
    const selectInfo: EmpSelectInfo = {
      empNo: emp.EMP_NO,      // ASIS: grdEmpList.selectedItem.EMP_NO
      empNm: emp.EMP_NM,      // ASIS: grdEmpList.selectedItem.EMP_NM
      authCd: emp.AUTH_CD,    // ASIS: grdEmpList.selectedItem.AUTH_CD
    }

    // ?ì—… ì°½ì¸ ê²½ìš° ë¶€ëª?ì°½ìœ¼ë¡?ê²°ê³¼ ?„ì†¡
    if (window.opener && !window.opener.closed) {
      try {
        // ë¶€ëª?ì°½ì˜ handleApproverSelect ?¨ìˆ˜ ?¸ì¶œ
        const messageData = {
          type: 'EMP_SELECTED',
          data: selectInfo,
          source: 'COMZ100P00',
          timestamp: new Date().toISOString()
        };
        
        window.opener.postMessage(messageData, '*');
        
        // ?ì—… ì°??«ê¸°
        window.close();
      } catch (error) {
        // fallback: ë¡œì»¬ onSelect ì½œë°± ?¬ìš©
        // onSelect(selectInfo); // This line is removed as per the new_code
        // onClose(); // This line is removed as per the new_code
      }
    } else {
      // ?¼ë°˜ ëª¨ë‹¬??ê²½ìš° ê¸°ì¡´ ë°©ì‹ ?¬ìš©
      // onSelect(selectInfo); // This line is removed as per the new_code
      // onClose(); // This line is removed as per the new_code
    }
  }

  /**
   * ?Œì´ë¸???ë²ˆí˜¸ ?ì„± ?¨ìˆ˜
   * ASIS: setRowNum(cItem:Object,i_column:AdvancedDataGridColumn):String ?¨ìˆ˜?€ ?™ì¼
   * @param index ???¸ë±??
   * @returns ??ë²ˆí˜¸ ë¬¸ì??
   */
  const setRowNumber = (index: number) => {
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
   * ?¬ì»¤?????„ì²´ ? íƒ
   * ASIS: FInputHangul ì»´í¬?ŒíŠ¸???¬ì»¤?????„ì²´ ? íƒ ê¸°ëŠ¥ê³??™ì¼
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
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



  /**
   * ?¸ë??ì„œ ?¸ì¶œ?????ˆëŠ” ë©”ì„œ?œë“¤??ref???¸ì¶œ
   * ASIS: choiceEmpInit ?¨ìˆ˜ë¥??¸ë??ì„œ ?¸ì¶œ?????ˆë„ë¡??¸ì¶œ
   */
  // useImperativeHandle(ref, () => ({ // This line is removed as per the new_code
  //   choiceEmpInit: (strEmpNm: string, empList: EmpInfo[]) => { // This line is removed as per the new_code
  //     choiceEmpInit(strEmpNm, empList); // This line is removed as per the new_code
  //   } // This line is removed as per the new_code
  // })) // This line is removed as per the new_code

  return (
    <div className="popup-wrapper min-w-[840px]">
      {/* ?ì—… ?¤ë” (ASIS: TitleWindow ?¤ë”) */}
      <div className="popup-header">
        <h3 className="popup-title">?¬ìš©?ëª… ê²€??/h3>
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
          Ã—
        </button>
      </div>

      {/* ?ì—… ë³¸ë¬¸ (ASIS: VBox ?ì—­) */}
      <div className="popup-body scroll-area">

        {/* ê²€??ì¡°ê±´ (ASIS: HBox ê²€???ì—­) */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                {/* ?¬ìš©?ëª… ?…ë ¥ (ASIS: txtEmpNm) */}
                <th className="search-th w-[100px]">?¬ìš©??ëª?/th>
                <td className="search-td w-[200px]">
                  <input
                    ref={inputRef}
                    type="text"
                    className="input-base input-default w-full"
                    value={empNm}
                    onChange={(e) => setEmpNm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder="?¬ìš©?ëª… ?…ë ¥"
                  />
                  
                </td>
                {/* ì¡°íšŒ ë²„íŠ¼ (ASIS: ì¡°íšŒ ë²„íŠ¼) */}
                <td className="search-td text-right" colSpan={6}>
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

        {/* ê²°ê³¼ ê·¸ë¦¬??(ASIS: grdEmpList AdvancedDataGrid) */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                {/* ASIS: AdvancedDataGridColumn êµ¬ì¡°?€ ?™ì¼ */}
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th w-[60px]">?¬ë²ˆ</th>
                <th className="grid-th w-[70px]">?±ëª…</th>
                <th className="grid-th w-[120px]">ë³¸ë?ëª?/th>
                <th className="grid-th w-[120px]">ë¶€?œëª…</th>
                <th className="grid-th w-[60px]">ì§ê¸‰ëª?/th>
                <th className="grid-th w-[100px]">?¬ìš©??ê¶Œí•œ</th>
                {/* ASIS: AdvancedDataGridColumnGroup "?…ë¬´ë³??¬ìš©ê¶Œí•œ" */}
                <th className="grid-th w-[60px]">?¬ì—…</th>
                <th className="grid-th w-[60px]">ì¶”ì§„ë¹?/th>
                <th className="grid-th w-[60px]">?¸ì‚¬/ë³µë¦¬</th>
                <th className="grid-th">ë¹„ê³ </th>
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
                  {/* ASIS: CheckBox itemRenderer?€ ?™ì¼??ê¸°ëŠ¥ */}
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

        {/* ê²€??ê²°ê³¼ê°€ ?†ì„ ???œì‹œ (ASIS: ë¹?ê·¸ë¦¬???œì‹œ) */}
        {emps.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-4">?” ê²€??ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.</p>
        )}

        {/* ì¢…ë£Œ ë²„íŠ¼ ?˜ë‹¨ ?°ì¸¡ ?•ë ¬ (ASIS: btnClose) */}
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
            ì¢…ë£Œ
          </button>
        </div>
      </div>
    </div>
  );
}

export default COMZ100P00;



