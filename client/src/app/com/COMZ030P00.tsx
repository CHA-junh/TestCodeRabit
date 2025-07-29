'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * ?±ê¸‰ë³??¨ê? ?°ì´???¸í„°?˜ì´??
 * ASIS: AdvancedDataGrid??dataField?€ ?€??
 */
interface GradeUnitPriceData {
  TCN_GRD_NM: string; // ?±ê¸‰ (ASIS: dataField="TCN_GRD_NM")
  DUTY_NM: string;     // ì§ì±… (ASIS: dataField=DUTY_NM)
  UPRC: string;        // ?¨ê? (ASIS: dataField="UPRC")
}

/**
 * ?”ë¸”?´ë¦­??ë°˜í™˜??ìµœì†Œ ?•ë³´ ?€??
 * ASIS: EvtDblClick ?´ë²¤?¸ì˜ txtData êµ¬ì¡°?€ ?™ì¼
 * ?•ì‹: "?¨ê?"
 */
interface PriceSelectInfo {
  price: string;       // ?¨ê? (ASIS: UPRC)
}

/**
 * postMessageë¡?ë°›ì„ ?°ì´???€??
 */
interface PostMessageData {
  type: 'CHOICE_PRICE_INIT';
  ownOutsDiv: string;
  year: string;
  priceList: GradeUnitPriceData[];
}

/**
 * ?±ê¸‰ë³??¨ê? ì¡°íšŒ ?ì—…
 * ASIS: COM_01_0300.mxml ??TOBE: COMZ030P00.tsx
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * 1. ë¶€ëª¨ì°½?ì„œ ?¨ê? ëª©ë¡ ?°ì´???˜ì‹  (postMessage)
 * 2. ?±ê¸‰ë³??¨ê? ì¡°íšŒ (USP_UNTPRC_SEL) 
 * 3. ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ? íƒ (rdIODiv)
 * 4. ?„ë„ ? íƒ (txtYrNm)
 * 5. ?”ë¸”?´ë¦­ ???¨ê? ? íƒ (onDoubleClick)
 * 6. ?ì—… ?«ê¸° (PopUpManager.removePopUp)
 * 7. ?¤ë³´???´ë²¤??ì²˜ë¦¬ (Enter ??ì¡°íšŒ, Escape ???«ê¸°)
 * 8. postMessageë¡?ë¶€ëª¨ì°½ê³??µì‹ 
 * 
 * ASIS ?€??ê´€ê³?
 * - TitleWindow ??popup-wrapper
 * - AdvancedDataGrid ??table
 * - RadioButtonGroup ??radio buttons
 * - FInputNumber ??select
 * - CurrencyFormatter ??formatCurrency
 */
const COMZ030P00 = () => {
  const { showToast } = useToast();
  /**
   * ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ?íƒœ ê´€ë¦?
   * ASIS: rdIODiv.selectedValue
   */
  const [radioValue, setRadioValue] = useState('1');
  
  /**
   * ?„ë„ ?íƒœ ê´€ë¦?
   * ASIS: txtYrNm.text
   */
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  /**
   * ê·¸ë¦¬???°ì´???íƒœ ê´€ë¦?
   * ASIS: initDG (ArrayCollection)
   */
  const [gridData, setGridData] = useState<GradeUnitPriceData[]>([]);
  
  /**
   * ë¡œë”© ?íƒœ ê´€ë¦?
   * ASIS: showBusyCursor="true"
   */
  const [loading, setLoading] = useState(false);
  
  /**
   * ? íƒ?????¸ë±??
   * ASIS: grdUntPrc.selectedIndex
   */
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  /**
   * ?…ë ¥ ?„ë“œ ì°¸ì¡° (ASIS: txtYrNm)
   */
  const selectRef = useRef<HTMLSelectElement>(null)

  /**
   * ë©”ì‹œì§€ ?˜ì‹  ?íƒœ ê´€ë¦?
   */
  const [messageReceived, setMessageReceived] = useState(false)

  /**
   * postMessage ?´ë²¤???¸ë“¤??
   * ë¶€ëª?ì°½ì—???„ì†¡??choicePriceInit ?°ì´?°ë? ì²˜ë¦¬
   */
  const handlePostMessage = (event: MessageEvent) => {
    const data = event.data;
    if (data?.type === 'CHOICE_PRICE_INIT' && data?.data) {
      setUntPrcInfo(data.data);
      setMessageReceived(true);
    }
  }

  /**
   * init_Complete ?¨ìˆ˜
   * ASIS: init_Complete() ?¨ìˆ˜?€ ?™ì¼????• 
   * ëª¨ë‹¬??ì²˜ìŒ ë¡œë“œ????ì´ˆê¸°???‘ì—…???˜í–‰
   */
  const init_Complete = () => {
    setRadioValue('1')
    setYear(new Date().getFullYear().toString())
    setGridData([])
    setLoading(false)
    setSelectedRow(null)
    // ?„ë„ ? íƒì°½ì— ?¬ì»¤??(ASIS: txtYrNm.focus())
    setTimeout(() => {
      selectRef.current?.focus()
    }, 0)
  }

  /**
   * setUntPrcInfo
   * ASIS: setUntPrcInfo(gubun:String, bsnStrtYy:String) ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * ?ì‚¬êµ¬ë¶„, ?„ë¡œ?íŠ¸ ?œì‘?„ë„ë¥?param dataë¡?ë°›ì•„???‹íŒ…?????ˆê²Œ ??
   * @param param { ownOutsDiv: string, year: string }
   */
  const setUntPrcInfo = (param: { ownOutsDiv: string; year: string }) => {
    setRadioValue(param.ownOutsDiv);
    setYear(param.year);
    // ë¶€ëª¨ì°½?ì„œ ?°ì´?°ë? ë°›ì? ???ë™ ì¡°íšŒ ?¤í–‰
    setTimeout(() => {
      handleSearch();
    }, 50);
  };

  /**
   * ?¨ê? ê²€???¨ìˆ˜
   * ASIS: onSearchClick() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * 
   * ?„ë¡œ?œì?: USP_UNTPRC_SEL(?, ?, ?)
   * ?Œë¼ë¯¸í„°: ?ì‚¬/?¸ì£¼êµ¬ë¶„, ?„ë„
   */
  const handleSearch = async () => {
    // ASIS: validation check
    if (!year.trim()) {
      showToast('?„ë„ë¥??…ë ¥?˜ì„¸??', 'info');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/COMZ030P00/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ownOutsDiv: radioValue, 
          year,
          bsnNo: null 
        })
      });
      
      if (res.ok) {
        const result = await res.json();
        setGridData(Array.isArray(result.data) ? result.data : []);
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.message || '?±ê¸‰ë³??¨ê? ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.';
        showToast(errorMessage, 'warning');
        setGridData([]);
      }
    } catch (error) {
      console.error('?±ê¸‰ë³??¨ê? ì¡°íšŒ ?¤ë¥˜:', error);
      showToast('?±ê¸‰ë³??¨ê? ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
      setGridData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ?”ë¸”?´ë¦­ ?´ë²¤??ì²˜ë¦¬
   * ASIS: onDoubleClick() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
   * 
   * ?”ë¸”?´ë¦­ ??? íƒ???¨ê?ë¥?ë¶€ëª¨ì°½?¼ë¡œ ?„ë‹¬?˜ê³  ?ì—… ?«ê¸°
   */
  const handleRowDoubleClick = (index: number) => {
    if (gridData && gridData[index]) {
      const selectedItem = gridData[index];
      const selectInfo: PriceSelectInfo = {
        price: selectedItem.UPRC
      }

      // ?ì—… ì°½ì¸ ê²½ìš° ë¶€ëª?ì°½ìœ¼ë¡?ê²°ê³¼ ?„ì†¡
      if (window.opener && !window.opener.closed) {
        try {
          // ë¶€ëª?ì°½ì˜ handlePriceSelect ?¨ìˆ˜ ?¸ì¶œ
          const messageData = {
            type: 'PRICE_SELECTED',
            data: selectInfo,
            source: 'COMZ030P00',
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
  };

  /**
   * ???´ë¦­ ??? íƒ ?íƒœ ê´€ë¦?
   * ASIS: grdUntPrc.selectedIndex ê´€ë¦?
   */
  const handleRowClick = (index: number) => {
    setSelectedRow(index);
  };

  /**
   * ?¤ë³´???´ë²¤??ì²˜ë¦¬ ?¨ìˆ˜
   * ASIS: ?¤ë³´???´ë²¤??ì²˜ë¦¬?€ ?™ì¼
   * Enter: ê²€???¤í–‰
   * Escape: ?ì—… ?«ê¸°
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
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
   * ASIS: FInputNumber ì»´í¬?ŒíŠ¸???¬ì»¤?????„ì²´ ? íƒ ê¸°ëŠ¥ê³??™ì¼
   */
  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    // select ?”ì†Œ??select() ë©”ì„œ?œê? ?†ìœ¼ë¯€ë¡??œê±°
    // e.target.select()
  }

  /**
   * ?«ì ?¬ë§·??(ASIS??CurrencyFormatter ?€ì²?
   * ASIS: moneyFormat currencySymbol=""
   */
  const formatCurrency = (value: string) => {
    try {
      // ë¹?ê°’ì´??null ì²´í¬
      if (!value || value === '') return '0';
      
      // ë¬¸ì?´ì—??ì½¤ë§ˆ ?œê±° ???«ìë¡?ë³€??
      const cleanValue = value.toString().replace(/[^\d.-]/g, '');
      const numValue = parseFloat(cleanValue) || 0;
      
      // ?Œìˆ˜ ì²´í¬
      if (numValue < 0) return '0';
      
      // ì²??¨ìœ„ ì½¤ë§ˆ ?¬ë§·??
      return numValue.toLocaleString('ko-KR');
    } catch (error) {
      console.error('?«ì ?¬ë§·???¤ë¥˜:', error, 'value:', value);
      return '0';
    }
  };

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
    
    // ì´ˆê¸°???„ë£Œ ???ë™ ì¡°íšŒ ?¤í–‰
    setTimeout(() => {
      handleSearch();
    }, 100);
    
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
    <div className="popup-wrapper min-w-[500px]">
      {/* ?ì—… ?¤ë” - ASIS: TitleWindow title */}
      <div className="popup-header">
        <h3 className="popup-title">?±ê¸‰ë³??¨ê? ì¡°íšŒ</h3>
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

      <div className="popup-body scroll-area">
        {/* ì¡°íšŒ ì¡°ê±´ ?ì—­ - ASIS: ?ë‹¨ ê²€??ì¡°ê±´ ?ì—­ */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                {/* ?ì‚¬/?¸ì£¼ êµ¬ë¶„ - ASIS: rdIODiv (RadioButtonGroup) */}
                <th className="search-th w-[100px]">?ì‚¬/?¸ì£¼ êµ¬ë¶„</th>
                <td className="search-td w-[120px]">
                  <div className="flex items-center gap-4 text-sm">
                    <label><input type="radio" name="gubun" value="1" checked={radioValue === '1'} onChange={e => setRadioValue(e.target.value)} /> ?ì‚¬</label>
                    <label><input type="radio" name="gubun" value="2" checked={radioValue === '2'} onChange={e => setRadioValue(e.target.value)} /> ?¸ì£¼</label>
                  </div>
                </td>
                {/* ?„ë„ ?…ë ¥ - ASIS: txtYrNm (FInputNumber) */}
                <th className="search-th w-[70px]">?„ë„</th>
                <td className="search-td w-[100px]">
                  <select
                    ref={selectRef}
                    className="combo-base w-full"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                  >
                    {Array.from({ length: 11 }, (_, i) => {
                      const y = new Date().getFullYear() - 5 + i;
                      return (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      );
                    })}
                  </select>
                </td>

                {/* ì¡°íšŒ ë²„íŠ¼ - ASIS: ì¡°íšŒ ë²„íŠ¼ */}
                <td className="search-td text-right">
                  <button 
                    className="btn-base btn-search" 
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? 'ì¡°íšŒì¤?..' : 'ì¡°íšŒ'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ê·¸ë¦¬???ì—­ - ASIS: grdUntPrc (AdvancedDataGrid) */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                {/* ASIS: AdvancedDataGridColumn headerText="?±ê¸‰" dataField="TCN_GRD_NM" */}
                <th className="grid-th">?±ê¸‰</th>
                {/* ASIS: AdvancedDataGridColumn headerText="ì§ì±…" dataField="DUTY_NM" */}
                <th className="grid-th">ì§ì±…</th>
                {/* ASIS: AdvancedDataGridColumn headerText="?¨ê? dataField="UPRC" formatter="{moneyFormat}" */}
                <th className="grid-th text-right">?¨ê?</th>
              </tr>
            </thead>
            <tbody>
              {gridData.length > 0 ? (
                gridData.map((item, idx) => (
                  <tr 
                    className={`grid-tr cursor-pointer ${selectedRow === idx ? 'bg-blue-50' : ''}`}
                    key={idx}
                    onClick={() => handleRowClick(idx)}
                    onDoubleClick={() => handleRowDoubleClick(idx)}
                  >
                    <td className="grid-td text-center">{item.TCN_GRD_NM}</td>
                    <td className="grid-td text-center">{item.DUTY_NM}</td>
                    <td className="grid-td text-right">{formatCurrency(item.UPRC)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="grid-td text-center text-gray-500">
                    {loading ? 'ì¡°íšŒì¤?..' : 'ì¡°íšŒ???°ì´?°ê? ?†ìŠµ?ˆë‹¤.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ?˜ë‹¨ ë²„íŠ¼ - ASIS: btnClose */}
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

export default COMZ030P00;


