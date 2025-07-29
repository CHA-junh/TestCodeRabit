'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css';

/**
 * ?�급�??��? ?�이???�터?�이??
 * ASIS: AdvancedDataGrid??dataField?� ?�??
 */
interface GradeUnitPriceData {
  TCN_GRD_NM: string; // ?�급 (ASIS: dataField="TCN_GRD_NM")
  DUTY_NM: string;     // 직책 (ASIS: dataField=DUTY_NM)
  UPRC: string;        // ?��? (ASIS: dataField="UPRC")
}

/**
 * ?�블?�릭??반환??최소 ?�보 ?�??
 * ASIS: EvtDblClick ?�벤?�의 txtData 구조?� ?�일
 * ?�식: "?��?"
 */
interface PriceSelectInfo {
  price: string;       // ?��? (ASIS: UPRC)
}

/**
 * postMessage�?받을 ?�이???�??
 */
interface PostMessageData {
  type: 'CHOICE_PRICE_INIT';
  ownOutsDiv: string;
  year: string;
  priceList: GradeUnitPriceData[];
}

/**
 * ?�급�??��? 조회 ?�업
 * ASIS: COM_01_0300.mxml ??TOBE: COMZ030P00.tsx
 * 
 * 주요 기능:
 * 1. 부모창?�서 ?��? 목록 ?�이???�신 (postMessage)
 * 2. ?�급�??��? 조회 (USP_UNTPRC_SEL) 
 * 3. ?�사/?�주 구분 ?�택 (rdIODiv)
 * 4. ?�도 ?�택 (txtYrNm)
 * 5. ?�블?�릭 ???��? ?�택 (onDoubleClick)
 * 6. ?�업 ?�기 (PopUpManager.removePopUp)
 * 7. ?�보???�벤??처리 (Enter ??조회, Escape ???�기)
 * 8. postMessage�?부모창�??�신
 * 
 * ASIS ?�??관�?
 * - TitleWindow ??popup-wrapper
 * - AdvancedDataGrid ??table
 * - RadioButtonGroup ??radio buttons
 * - FInputNumber ??select
 * - CurrencyFormatter ??formatCurrency
 */
const COMZ030P00 = () => {
  const { showToast } = useToast();
  /**
   * ?�사/?�주 구분 ?�태 관�?
   * ASIS: rdIODiv.selectedValue
   */
  const [radioValue, setRadioValue] = useState('1');
  
  /**
   * ?�도 ?�태 관�?
   * ASIS: txtYrNm.text
   */
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  /**
   * 그리???�이???�태 관�?
   * ASIS: initDG (ArrayCollection)
   */
  const [gridData, setGridData] = useState<GradeUnitPriceData[]>([]);
  
  /**
   * 로딩 ?�태 관�?
   * ASIS: showBusyCursor="true"
   */
  const [loading, setLoading] = useState(false);
  
  /**
   * ?�택?????�덱??
   * ASIS: grdUntPrc.selectedIndex
   */
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  /**
   * ?�력 ?�드 참조 (ASIS: txtYrNm)
   */
  const selectRef = useRef<HTMLSelectElement>(null)

  /**
   * 메시지 ?�신 ?�태 관�?
   */
  const [messageReceived, setMessageReceived] = useState(false)

  /**
   * postMessage ?�벤???�들??
   * 부�?창에???�송??choicePriceInit ?�이?��? 처리
   */
  const handlePostMessage = (event: MessageEvent) => {
    const data = event.data;
    if (data?.type === 'CHOICE_PRICE_INIT' && data?.data) {
      setUntPrcInfo(data.data);
      setMessageReceived(true);
    }
  }

  /**
   * init_Complete ?�수
   * ASIS: init_Complete() ?�수?� ?�일????��
   * 모달??처음 로드????초기???�업???�행
   */
  const init_Complete = () => {
    setRadioValue('1')
    setYear(new Date().getFullYear().toString())
    setGridData([])
    setLoading(false)
    setSelectedRow(null)
    // ?�도 ?�택창에 ?�커??(ASIS: txtYrNm.focus())
    setTimeout(() => {
      selectRef.current?.focus()
    }, 0)
  }

  /**
   * setUntPrcInfo
   * ASIS: setUntPrcInfo(gubun:String, bsnStrtYy:String) ?�수?� ?�일??로직
   * ?�사구분, ?�로?�트 ?�작?�도�?param data�?받아???�팅?????�게 ??
   * @param param { ownOutsDiv: string, year: string }
   */
  const setUntPrcInfo = (param: { ownOutsDiv: string; year: string }) => {
    setRadioValue(param.ownOutsDiv);
    setYear(param.year);
    // 부모창?�서 ?�이?��? 받�? ???�동 조회 ?�행
    setTimeout(() => {
      handleSearch();
    }, 50);
  };

  /**
   * ?��? 검???�수
   * ASIS: onSearchClick() ?�수?� ?�일??로직
   * 
   * ?�로?��?: USP_UNTPRC_SEL(?, ?, ?)
   * ?�라미터: ?�사/?�주구분, ?�도
   */
  const handleSearch = async () => {
    // ASIS: validation check
    if (!year.trim()) {
      showToast('?�도�??�력?�세??', 'info');
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
        const errorMessage = errorData.message || '?�급�??��? 조회 �??�류가 발생?�습?�다.';
        showToast(errorMessage, 'warning');
        setGridData([]);
      }
    } catch (error) {
      console.error('?�급�??��? 조회 ?�류:', error);
      showToast('?�급�??��? 조회 �??�류가 발생?�습?�다.', 'error');
      setGridData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ?�블?�릭 ?�벤??처리
   * ASIS: onDoubleClick() ?�수?� ?�일??로직
   * 
   * ?�블?�릭 ???�택???��?�?부모창?�로 ?�달?�고 ?�업 ?�기
   */
  const handleRowDoubleClick = (index: number) => {
    if (gridData && gridData[index]) {
      const selectedItem = gridData[index];
      const selectInfo: PriceSelectInfo = {
        price: selectedItem.UPRC
      }

      // ?�업 창인 경우 부�?창으�?결과 ?�송
      if (window.opener && !window.opener.closed) {
        try {
          // 부�?창의 handlePriceSelect ?�수 ?�출
          const messageData = {
            type: 'PRICE_SELECTED',
            data: selectInfo,
            source: 'COMZ030P00',
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
  };

  /**
   * ???�릭 ???�택 ?�태 관�?
   * ASIS: grdUntPrc.selectedIndex 관�?
   */
  const handleRowClick = (index: number) => {
    setSelectedRow(index);
  };

  /**
   * ?�보???�벤??처리 ?�수
   * ASIS: ?�보???�벤??처리?� ?�일
   * Enter: 검???�행
   * Escape: ?�업 ?�기
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
   * ?�커?????�체 ?�택
   * ASIS: FInputNumber 컴포?�트???�커?????�체 ?�택 기능�??�일
   */
  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    // select ?�소??select() 메서?��? ?�으므�??�거
    // e.target.select()
  }

  /**
   * ?�자 ?�맷??(ASIS??CurrencyFormatter ?��?
   * ASIS: moneyFormat currencySymbol=""
   */
  const formatCurrency = (value: string) => {
    try {
      // �?값이??null 체크
      if (!value || value === '') return '0';
      
      // 문자?�에??콤마 ?�거 ???�자�?변??
      const cleanValue = value.toString().replace(/[^\d.-]/g, '');
      const numValue = parseFloat(cleanValue) || 0;
      
      // ?�수 체크
      if (numValue < 0) return '0';
      
      // �??�위 콤마 ?�맷??
      return numValue.toLocaleString('ko-KR');
    } catch (error) {
      console.error('?�자 ?�맷???�류:', error, 'value:', value);
      return '0';
    }
  };

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
    
    // 초기???�료 ???�동 조회 ?�행
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
      {/* ?�업 ?�더 - ASIS: TitleWindow title */}
      <div className="popup-header">
        <h3 className="popup-title">?�급�??��? 조회</h3>
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

      <div className="popup-body scroll-area">
        {/* 조회 조건 ?�역 - ASIS: ?�단 검??조건 ?�역 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                {/* ?�사/?�주 구분 - ASIS: rdIODiv (RadioButtonGroup) */}
                <th className="search-th w-[100px]">?�사/?�주 구분</th>
                <td className="search-td w-[120px]">
                  <div className="flex items-center gap-4 text-sm">
                    <label><input type="radio" name="gubun" value="1" checked={radioValue === '1'} onChange={e => setRadioValue(e.target.value)} /> ?�사</label>
                    <label><input type="radio" name="gubun" value="2" checked={radioValue === '2'} onChange={e => setRadioValue(e.target.value)} /> ?�주</label>
                  </div>
                </td>
                {/* ?�도 ?�력 - ASIS: txtYrNm (FInputNumber) */}
                <th className="search-th w-[70px]">?�도</th>
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

                {/* 조회 버튼 - ASIS: 조회 버튼 */}
                <td className="search-td text-right">
                  <button 
                    className="btn-base btn-search" 
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? '조회�?..' : '조회'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 그리???�역 - ASIS: grdUntPrc (AdvancedDataGrid) */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                {/* ASIS: AdvancedDataGridColumn headerText="?�급" dataField="TCN_GRD_NM" */}
                <th className="grid-th">?�급</th>
                {/* ASIS: AdvancedDataGridColumn headerText="직책" dataField="DUTY_NM" */}
                <th className="grid-th">직책</th>
                {/* ASIS: AdvancedDataGridColumn headerText="?��? dataField="UPRC" formatter="{moneyFormat}" */}
                <th className="grid-th text-right">?��?</th>
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
                    {loading ? '조회�?..' : '조회???�이?��? ?�습?�다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ?�단 버튼 - ASIS: btnClose */}
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

export default COMZ030P00;


