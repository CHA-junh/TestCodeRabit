'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css'

/**
 * PSM0030P00 - 기술?�급?�력 조회 ?�업
 * 
 * ?�원??기술?�급 변�??�력??조회?�는 ?�업 ?�면?�니??
 * AS-IS PSM_01_0110.mxml??기술?�급?�력 조회 기능??React�?구현??버전?�니??
 * 
 * 주요 기능:
 * - ?�원??기술?�급 변�??�력 조회
 * - ?�급 변�??�자 �?비고 ?�보 ?�시
 * - 경력 계산 기�???기�? ?�급 ?�보 ?�시
 * - ?�업 ?�태�?모달 ?�시
 * 
 * AS-IS: PSM_01_0110.mxml (기술?�급?�력 조회)
 * TO-BE: React 기반 ?�업 컴포?�트
 * 
 * ?�용 ?�시:
 * ```tsx
 * // PSM1010M00?�서 ?�출
 * <PSM0030P00 
 *   empNo="10001"
 *   empNm="?�길??
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
  // AS-IS PSM_01_0110?�서 ?�달?�는 값들
  ownOutsKb?: string;      // ?�사?�주구분
  ownOutsCd?: string;      // ?�사?�주구분코드
  empNm?: string;          // ?�명
  entrDt?: string;         // ?�사?�자
  lastAdbgDiv?: string;    // 최종?�력구분
  ctql?: string;           // ?�격�?
  ctqlPurDt?: string;      // ?�격취득?�자
  adbgCarrMcnt?: string;   // ?�력경력개월??
  ctqlCarrMcnt?: string;   // ?�격경력개월??
  carrCalcStndDt?: string; // 경력계산기�???
  lastTcnGrd?: string;     // 최종기술?�급
  lastTcnGrdCd?: string;   // 최종기술?�급코드
  carrDiv?: string;        // 경력구분코드
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
  
  // AS-IS?�서 ?�달받�? 값으�?employeeInfo 초기??
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

  // ?�업???�릴 ???�동?�로 기술?�급?�력 조회
  useEffect(() => {
    if (empNo) {
      fetchGradeHistory(empNo);
    }
  }, [empNo]);

  // AS-IS PSM_01_0161_S ?�로?��? ?�출
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
        showToast('?�이??조회???�패?�습?�다: ' + (data.message || ''), 'error');
        setGradeHistory([]);
      }
    } catch (error) {
      console.error('기술?�급?�력 조회 �??�류:', error);
      showToast('기술?�급?�력 조회 �??�류가 발생?�습?�다.', 'error');
      setGradeHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // 조회 버튼 ?�릭 (AS-IS onBtnClickCarrCalc ?�수?� ?�일)
  const handleSearch = () => {
    if (!empNo) {
      showToast('?�원번호가 ?�요?�니??', 'warning');
      return;
    }
    
    // AS-IS?�서??부모화면에???�달받�? �??�용?��?�?기술?�급?�력�?조회
    fetchGradeHistory(empNo);
  };

  // AS-IS grdTcnGrdHstyListStyleFunc?� ?�일???��??�링
  const getRowStyle = (item: GradeHistoryItem) => {
    if (item.TCN_GRD_NM === employeeInfo.LAST_TCN_GRD) {
      return 'text-red-500 font-bold'; // ?�재 기술?�급 ROW ?�체�?붉�??�으�?
    }
    return '';
  };

  // ?�짜 ?�맷 변?? YYYYMMDD ??YYYY-MM-DD
  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  };

  // 경력개월?��? ???�로 분리 (AS-IS setCarrMcntDivision ?�수?� ?�일)
  const getYearMonthFromMonths = (months: string) => {
    const numMonths = Number(months);
    const years = Math.floor(numMonths / 12);
    const remainingMonths = numMonths - (years * 12);
    return { years, months: remainingMonths };
  };

  const adbgCareer = getYearMonthFromMonths(employeeInfo.ADBG_CARR_MCNT);
  const ctqlCareer = getYearMonthFromMonths(employeeInfo.CTQL_CARR_MCNT);

  // 종료 버튼 ?�릭
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
          <h3 className="popup-title" style={{ fontSize: '14px', lineHeight: '32px' }}>기술?�급?�력조회</h3>
          <button className="popup-close" type="button" onClick={handleClose} style={{ fontSize: '18px', lineHeight: '32px' }}>×</button>
        </div>

        <div className="popup-body" style={{ padding: '16px' }}>
        <div className="clearbox-div mb-3">
          <table className="clear-table w-full">
            <tbody>
              <tr className="clear-tr">
                <th className="clear-th w-[80px]">구분</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.OWN_OUTS_KB} className="input-base input-default w-full" disabled />
                </td>
                <th className="clear-th w-[60px]">?�명</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.EMP_NM} className="input-base input-default w-full" disabled />
                </td>
                <th className="clear-th w-[80px]">?�사?�자</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={formatDate(employeeInfo.ENTR_DT)} className="input-base input-default w-full" disabled />
                </td>
              </tr>

              <tr className="clear-tr">
                <th className="clear-th w-[80px]">최종?�력</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.LAST_ADBG_DIV} className="input-base input-default w-full" disabled />
                </td>
                <th className="clear-th w-[80px]">?�격�?/th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.CTQL} className="input-base input-default w-full" disabled />
                </td>
                <th className="clear-th w-[90px]">?�격취득??/th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={formatDate(employeeInfo.CTQL_PUR_DT)} className="input-base input-default w-full" disabled />
                </td>
              </tr>

              <tr className="clear-tr">
                <th className="clear-th w-[100px]">?�력경력개월</th>
                <td className="clear-td min-w-[160px]">
                  <div className="flex items-center gap-1">
                    <input type="text" value={adbgCareer.years} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">??/span>
                    <input type="text" value={adbgCareer.months} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">개월</span>
                  </div>
                </td>
                <th className="clear-th w-[110px]">기술?�격경력</th>
                <td className="clear-td min-w-[160px]">
                  <div className="flex items-center gap-1">
                    <input type="text" value={ctqlCareer.years} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">??/span>
                    <input type="text" value={ctqlCareer.months} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">개월</span>
                  </div>
                </td>
                <th className="clear-th w-[100px]">경력계산기�?</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={formatDate(employeeInfo.CARR_CALC_STND_DT)} className="input-base input-default w-full" disabled />
                </td>
              </tr>

              <tr className="clear-tr">
                <th className="clear-th w-[100px]">기술?�급(??</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.LAST_TCN_GRD} className="input-base input-default text-red-500 font-bold w-full" disabled />
                </td>
                <th className="clear-th w-[100px]">경력기�?</th>
                <td className="clear-td min-w-[160px]" colSpan={3}>
                  <div className="flex items-center gap-4">
                    <label>
                      <input 
                        type="radio" 
                        name="calcType" 
                        checked={employeeInfo.CARR_DIV === '1'} 
                        disabled 
                      /> ?�력
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="calcType" 
                        checked={employeeInfo.CARR_DIV === '2'} 
                        disabled 
                      /> 기술?�격
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ?�급 ?�력 ?�이�?*/}
        <div className="tit_area">
          <h3>개발 기술?�급 ?�력</h3>
          <div>
            <button 
              type="button" 
              className="btn-base btn-search"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? '조회�?..' : '조회'}
            </button>
          </div>
        </div>
        <div className="gridbox-div mb-3" style={{ height: 'auto', overflowY: 'visible' }}>
          <table className="grid-table w-full">
            <thead>
              <tr>
                <th className="grid-th">기술?�급</th>
                <th className="grid-th">?�작?�자</th>
                <th className="grid-th">비고</th>
              </tr>
            </thead>
            <tbody>
              {gradeHistory.length === 0 ? (
                <tr className="grid-tr">
                  <td colSpan={3} className="grid-td text-center text-gray-500">
                    {loading ? '조회�?..' : '?�이?��? ?�습?�다'}
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

        {/* ?�내 �?종료 버튼 */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-blue-700">
            * ?�작?�자???�급???�작?�는 ?�월?�을 말함. 리스?�의 <span className="text-red-500">붉�???/span>?� 경력계산기�??�의 ?�급??
          </div>
          <button type="button" className="btn-base btn-delete px-4" onClick={handleClose}>종료</button>
        </div>
        </div>
      </div>
    </div>
  );
}


