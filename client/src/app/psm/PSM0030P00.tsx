'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css'

/**
 * PSM0030P00 - ê¸°ìˆ ?±ê¸‰?´ë ¥ ì¡°íšŒ ?ì—…
 * 
 * ?¬ì›??ê¸°ìˆ ?±ê¸‰ ë³€ê²??´ë ¥??ì¡°íšŒ?˜ëŠ” ?ì—… ?”ë©´?…ë‹ˆ??
 * AS-IS PSM_01_0110.mxml??ê¸°ìˆ ?±ê¸‰?´ë ¥ ì¡°íšŒ ê¸°ëŠ¥??Reactë¡?êµ¬í˜„??ë²„ì „?…ë‹ˆ??
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ì›??ê¸°ìˆ ?±ê¸‰ ë³€ê²??´ë ¥ ì¡°íšŒ
 * - ?±ê¸‰ ë³€ê²??¼ì ë°?ë¹„ê³  ?•ë³´ ?œì‹œ
 * - ê²½ë ¥ ê³„ì‚° ê¸°ì???ê¸°ì? ?±ê¸‰ ?•ë³´ ?œì‹œ
 * - ?ì—… ?•íƒœë¡?ëª¨ë‹¬ ?œì‹œ
 * 
 * AS-IS: PSM_01_0110.mxml (ê¸°ìˆ ?±ê¸‰?´ë ¥ ì¡°íšŒ)
 * TO-BE: React ê¸°ë°˜ ?ì—… ì»´í¬?ŒíŠ¸
 * 
 * ?¬ìš© ?ˆì‹œ:
 * ```tsx
 * // PSM1010M00?ì„œ ?¸ì¶œ
 * <PSM0030P00 
 *   empNo="10001"
 *   empNm="?ê¸¸??
 *   onClose={() => setShowPopup(false)}
 * />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */

interface GradeHistoryItem {
  TCN_GRD_NM: string;
  GRD_REG_DT: string;
  RMK: string;
  TCN_GRD: string;
}

interface EmployeeInfo {
  OWN_OUTS_KB: string;
  EMP_NM: string;
  ENTR_DT: string;
  LAST_ADBG_DIV: string;
  CTQL: string;
  CTQL_PUR_DT: string;
  ADBG_CARR_MCNT: string;
  CTQL_CARR_MCNT: string;
  CARR_CALC_STND_DT: string;
  LAST_TCN_GRD: string;
  CARR_DIV: string;
}

interface RoleManagementPopupProps {
  empNo?: string;
  onClose?: () => void;
  // AS-IS PSM_01_0110?ì„œ ?„ë‹¬?˜ëŠ” ê°’ë“¤
  ownOutsKb?: string;      // ?ì‚¬?¸ì£¼êµ¬ë¶„
  ownOutsCd?: string;      // ?ì‚¬?¸ì£¼êµ¬ë¶„ì½”ë“œ
  empNm?: string;          // ?±ëª…
  entrDt?: string;         // ?…ì‚¬?¼ì
  lastAdbgDiv?: string;    // ìµœì¢…?™ë ¥êµ¬ë¶„
  ctql?: string;           // ?ê²©ì¦?
  ctqlPurDt?: string;      // ?ê²©ì·¨ë“?¼ì
  adbgCarrMcnt?: string;   // ?™ë ¥ê²½ë ¥ê°œì›”??
  ctqlCarrMcnt?: string;   // ?ê²©ê²½ë ¥ê°œì›”??
  carrCalcStndDt?: string; // ê²½ë ¥ê³„ì‚°ê¸°ì???
  lastTcnGrd?: string;     // ìµœì¢…ê¸°ìˆ ?±ê¸‰
  lastTcnGrdCd?: string;   // ìµœì¢…ê¸°ìˆ ?±ê¸‰ì½”ë“œ
  carrDiv?: string;        // ê²½ë ¥êµ¬ë¶„ì½”ë“œ
}

export default function RoleManagementPopup({ 
  empNo, 
  onClose,
  ownOutsKb = '',
  ownOutsCd = '',
  empNm = '',
  entrDt = '',
  lastAdbgDiv = '',
  ctql = '',
  ctqlPurDt = '',
  adbgCarrMcnt = '',
  ctqlCarrMcnt = '',
  carrCalcStndDt = '',
  lastTcnGrd = '',
  lastTcnGrdCd = '',
  carrDiv = ''
}: RoleManagementPopupProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [gradeHistory, setGradeHistory] = useState<GradeHistoryItem[]>([]);
  
  // AS-IS?ì„œ ?„ë‹¬ë°›ì? ê°’ìœ¼ë¡?employeeInfo ì´ˆê¸°??
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    OWN_OUTS_KB: ownOutsKb,
    EMP_NM: empNm,
    ENTR_DT: entrDt,
    LAST_ADBG_DIV: lastAdbgDiv,
    CTQL: ctql,
    CTQL_PUR_DT: ctqlPurDt,
    ADBG_CARR_MCNT: adbgCarrMcnt,
    CTQL_CARR_MCNT: ctqlCarrMcnt,
    CARR_CALC_STND_DT: carrCalcStndDt,
    LAST_TCN_GRD: lastTcnGrd,
    CARR_DIV: carrDiv
  });

  // ?ì—…???´ë¦´ ???ë™?¼ë¡œ ê¸°ìˆ ?±ê¸‰?´ë ¥ ì¡°íšŒ
  useEffect(() => {
    if (empNo) {
      fetchGradeHistory(empNo);
    }
  }, [empNo]);

  // AS-IS PSM_01_0161_S ?„ë¡œ?œì? ?¸ì¶œ
  const fetchGradeHistory = async (empNo: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/psm/career/technical-grade-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empNo: empNo
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setGradeHistory(data.data || []);
      } else {
        showToast('?°ì´??ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤: ' + (data.message || ''), 'error');
        setGradeHistory([]);
      }
    } catch (error) {
      console.error('ê¸°ìˆ ?±ê¸‰?´ë ¥ ì¡°íšŒ ì¤??¤ë¥˜:', error);
      showToast('ê¸°ìˆ ?±ê¸‰?´ë ¥ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
      setGradeHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // ì¡°íšŒ ë²„íŠ¼ ?´ë¦­ (AS-IS onBtnClickCarrCalc ?¨ìˆ˜?€ ?™ì¼)
  const handleSearch = () => {
    if (!empNo) {
      showToast('?¬ì›ë²ˆí˜¸ê°€ ?„ìš”?©ë‹ˆ??', 'warning');
      return;
    }
    
    // AS-IS?ì„œ??ë¶€ëª¨í™”ë©´ì—???„ë‹¬ë°›ì? ê°??¬ìš©?˜ë?ë¡?ê¸°ìˆ ?±ê¸‰?´ë ¥ë§?ì¡°íšŒ
    fetchGradeHistory(empNo);
  };

  // AS-IS grdTcnGrdHstyListStyleFunc?€ ?™ì¼???¤í??¼ë§
  const getRowStyle = (item: GradeHistoryItem) => {
    if (item.TCN_GRD_NM === employeeInfo.LAST_TCN_GRD) {
      return 'text-red-500 font-bold'; // ?„ì¬ ê¸°ìˆ ?±ê¸‰ ROW ?„ì²´ë¥?ë¶‰ì??‰ìœ¼ë¡?
    }
    return '';
  };

  // ? ì§œ ?¬ë§· ë³€?? YYYYMMDD ??YYYY-MM-DD
  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  };

  // ê²½ë ¥ê°œì›”?˜ë? ???”ë¡œ ë¶„ë¦¬ (AS-IS setCarrMcntDivision ?¨ìˆ˜?€ ?™ì¼)
  const getYearMonthFromMonths = (months: string) => {
    const numMonths = Number(months);
    const years = Math.floor(numMonths / 12);
    const remainingMonths = numMonths - (years * 12);
    return { years, months: remainingMonths };
  };

  const adbgCareer = getYearMonthFromMonths(employeeInfo.ADBG_CARR_MCNT);
  const ctqlCareer = getYearMonthFromMonths(employeeInfo.CTQL_CARR_MCNT);

  // ì¢…ë£Œ ë²„íŠ¼ ?´ë¦­
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        className="popup-wrapper w-full mx-4"
        style={{ 
          zIndex: 999999,
          position: 'relative',
          maxWidth: '1000px',
          height: 'auto',
          minHeight: '460px'
        }}
      >
        <div className="popup-header" style={{ height: '32px', padding: '0 16px' }}>
          <h3 className="popup-title" style={{ fontSize: '14px', lineHeight: '32px' }}>ê¸°ìˆ ?±ê¸‰?´ë ¥ì¡°íšŒ</h3>
          <button className="popup-close" type="button" onClick={handleClose} style={{ fontSize: '18px', lineHeight: '32px' }}>Ã—</button>
        </div>

        <div className="popup-body" style={{ padding: '16px' }}>
        <div className="clearbox-div mb-3">
          <table className="clear-table w-full">
            <tbody>
              <tr className="clear-tr">
                <th className="clear-th w-[80px]">êµ¬ë¶„</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.OWN_OUTS_KB} className="input-base input-default w-full" disabled />
                </td>
                <th className="clear-th w-[60px]">?±ëª…</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.EMP_NM} className="input-base input-default w-full" disabled />
                </td>
                <th className="clear-th w-[80px]">?…ì‚¬?¼ì</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={formatDate(employeeInfo.ENTR_DT)} className="input-base input-default w-full" disabled />
                </td>
              </tr>

              <tr className="clear-tr">
                <th className="clear-th w-[80px]">ìµœì¢…?™ë ¥</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.LAST_ADBG_DIV} className="input-base input-default w-full" disabled />
                </td>
                <th className="clear-th w-[80px]">?ê²©ì¦?/th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.CTQL} className="input-base input-default w-full" disabled />
                </td>
                <th className="clear-th w-[90px]">?ê²©ì·¨ë“??/th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={formatDate(employeeInfo.CTQL_PUR_DT)} className="input-base input-default w-full" disabled />
                </td>
              </tr>

              <tr className="clear-tr">
                <th className="clear-th w-[100px]">?™ë ¥ê²½ë ¥ê°œì›”</th>
                <td className="clear-td min-w-[160px]">
                  <div className="flex items-center gap-1">
                    <input type="text" value={adbgCareer.years} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">??/span>
                    <input type="text" value={adbgCareer.months} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">ê°œì›”</span>
                  </div>
                </td>
                <th className="clear-th w-[110px]">ê¸°ìˆ ?ê²©ê²½ë ¥</th>
                <td className="clear-td min-w-[160px]">
                  <div className="flex items-center gap-1">
                    <input type="text" value={ctqlCareer.years} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">??/span>
                    <input type="text" value={ctqlCareer.months} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">ê°œì›”</span>
                  </div>
                </td>
                <th className="clear-th w-[100px]">ê²½ë ¥ê³„ì‚°ê¸°ì?</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={formatDate(employeeInfo.CARR_CALC_STND_DT)} className="input-base input-default w-full" disabled />
                </td>
              </tr>

              <tr className="clear-tr">
                <th className="clear-th w-[100px]">ê¸°ìˆ ?±ê¸‰(??</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.LAST_TCN_GRD} className="input-base input-default text-red-500 font-bold w-full" disabled />
                </td>
                <th className="clear-th w-[100px]">ê²½ë ¥ê¸°ì?</th>
                <td className="clear-td min-w-[160px]" colSpan={3}>
                  <div className="flex items-center gap-4">
                    <label>
                      <input 
                        type="radio" 
                        name="calcType" 
                        checked={employeeInfo.CARR_DIV === '1'} 
                        disabled 
                      /> ?™ë ¥
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="calcType" 
                        checked={employeeInfo.CARR_DIV === '2'} 
                        disabled 
                      /> ê¸°ìˆ ?ê²©
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ?±ê¸‰ ?´ë ¥ ?Œì´ë¸?*/}
        <div className="tit_area">
          <h3>ê°œë°œ ê¸°ìˆ ?±ê¸‰ ?´ë ¥</h3>
          <div>
            <button 
              type="button" 
              className="btn-base btn-search"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'ì¡°íšŒì¤?..' : 'ì¡°íšŒ'}
            </button>
          </div>
        </div>
        <div className="gridbox-div mb-3" style={{ height: 'auto', overflowY: 'visible' }}>
          <table className="grid-table w-full">
            <thead>
              <tr>
                <th className="grid-th">ê¸°ìˆ ?±ê¸‰</th>
                <th className="grid-th">?œì‘?¼ì</th>
                <th className="grid-th">ë¹„ê³ </th>
              </tr>
            </thead>
            <tbody>
              {gradeHistory.length === 0 ? (
                <tr className="grid-tr">
                  <td colSpan={3} className="grid-td text-center text-gray-500">
                    {loading ? 'ì¡°íšŒì¤?..' : '?°ì´?°ê? ?†ìŠµ?ˆë‹¤'}
                  </td>
                </tr>
              ) : (
                gradeHistory.map((item, i) => (
                  <tr key={i} className={`grid-tr ${getRowStyle(item)}`}>
                    <td className="grid-td">
                      {item.TCN_GRD_NM}
                    </td>
                    <td className="grid-td">
                      {formatDate(item.GRD_REG_DT)}
                    </td>
                    <td className="grid-td">
                      {item.RMK}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ?ˆë‚´ ë°?ì¢…ë£Œ ë²„íŠ¼ */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-blue-700">
            * ?œì‘?¼ì???±ê¸‰???œì‘?˜ëŠ” ?„ì›”?¼ì„ ë§í•¨. ë¦¬ìŠ¤?¸ì˜ <span className="text-red-500">ë¶‰ì???/span>?€ ê²½ë ¥ê³„ì‚°ê¸°ì??¼ì˜ ?±ê¸‰??
          </div>
          <button type="button" className="btn-base btn-delete px-4" onClick={handleClose}>ì¢…ë£Œ</button>
        </div>
        </div>
      </div>
    </div>
  );
}


