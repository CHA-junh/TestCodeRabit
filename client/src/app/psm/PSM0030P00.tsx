'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import '../common/common.css'

/**
 * PSM0030P00 - 기술등급이력 조회 팝업
 * 
 * 사원의 기술등급 변경 이력을 조회하는 팝업 화면입니다.
 * AS-IS PSM_01_0110.mxml의 기술등급이력 조회 기능을 React로 구현한 버전입니다.
 * 
 * 주요 기능:
 * - 사원의 기술등급 변경 이력 조회
 * - 등급 변경 일자 및 비고 정보 표시
 * - 경력 계산 기준일 기준 등급 정보 표시
 * - 팝업 형태로 모달 표시
 * 
 * AS-IS: PSM_01_0110.mxml (기술등급이력 조회)
 * TO-BE: React 기반 팝업 컴포넌트
 * 
 * 사용 예시:
 * ```tsx
 * // PSM1010M00에서 호출
 * <PSM0030P00 
 *   empNo="10001"
 *   empNm="홍길동"
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
  // AS-IS PSM_01_0110에서 전달하는 값들
  ownOutsKb?: string;      // 자사외주구분
  ownOutsCd?: string;      // 자사외주구분코드
  empNm?: string;          // 성명
  entrDt?: string;         // 입사일자
  lastAdbgDiv?: string;    // 최종학력구분
  ctql?: string;           // 자격증
  ctqlPurDt?: string;      // 자격취득일자
  adbgCarrMcnt?: string;   // 학력경력개월수
  ctqlCarrMcnt?: string;   // 자격경력개월수
  carrCalcStndDt?: string; // 경력계산기준일
  lastTcnGrd?: string;     // 최종기술등급
  lastTcnGrdCd?: string;   // 최종기술등급코드
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
  
  // AS-IS에서 전달받은 값으로 employeeInfo 초기화
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

  // 팝업이 열릴 때 자동으로 기술등급이력 조회
  useEffect(() => {
    if (empNo) {
      fetchGradeHistory(empNo);
    }
  }, [empNo]);

  // AS-IS PSM_01_0161_S 프로시저 호출
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
        showToast('데이터 조회에 실패했습니다: ' + (data.message || ''), 'error');
        setGradeHistory([]);
      }
    } catch (error) {
      console.error('기술등급이력 조회 중 오류:', error);
      showToast('기술등급이력 조회 중 오류가 발생했습니다.', 'error');
      setGradeHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // 조회 버튼 클릭 (AS-IS onBtnClickCarrCalc 함수와 동일)
  const handleSearch = () => {
    if (!empNo) {
      showToast('사원번호가 필요합니다.', 'warning');
      return;
    }
    
    // AS-IS에서는 부모화면에서 전달받은 값 사용하므로 기술등급이력만 조회
    fetchGradeHistory(empNo);
  };

  // AS-IS grdTcnGrdHstyListStyleFunc와 동일한 스타일링
  const getRowStyle = (item: GradeHistoryItem) => {
    if (item.TCN_GRD_NM === employeeInfo.LAST_TCN_GRD) {
      return 'text-red-500 font-bold'; // 현재 기술등급 ROW 전체를 붉은색으로
    }
    return '';
  };

  // 날짜 포맷 변환: YYYYMMDD → YYYY-MM-DD
  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  };

  // 경력개월수를 년/월로 분리 (AS-IS setCarrMcntDivision 함수와 동일)
  const getYearMonthFromMonths = (months: string) => {
    const numMonths = Number(months);
    const years = Math.floor(numMonths / 12);
    const remainingMonths = numMonths - (years * 12);
    return { years, months: remainingMonths };
  };

  const adbgCareer = getYearMonthFromMonths(employeeInfo.ADBG_CARR_MCNT);
  const ctqlCareer = getYearMonthFromMonths(employeeInfo.CTQL_CARR_MCNT);

  // 종료 버튼 클릭
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
          <h3 className="popup-title" style={{ fontSize: '14px', lineHeight: '32px' }}>기술등급이력조회</h3>
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
                <th className="clear-th w-[60px]">성명</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.EMP_NM} className="input-base input-default w-full" disabled />
                </td>
                <th className="clear-th w-[80px]">입사일자</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={formatDate(employeeInfo.ENTR_DT)} className="input-base input-default w-full" disabled />
                </td>
              </tr>

              <tr className="clear-tr">
                <th className="clear-th w-[80px]">최종학력</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.LAST_ADBG_DIV} className="input-base input-default w-full" disabled />
                </td>
                <th className="clear-th w-[80px]">자격증</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.CTQL} className="input-base input-default w-full" disabled />
                </td>
                <th className="clear-th w-[90px]">자격취득일</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={formatDate(employeeInfo.CTQL_PUR_DT)} className="input-base input-default w-full" disabled />
                </td>
              </tr>

              <tr className="clear-tr">
                <th className="clear-th w-[100px]">학력경력개월</th>
                <td className="clear-td min-w-[160px]">
                  <div className="flex items-center gap-1">
                    <input type="text" value={adbgCareer.years} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">년</span>
                    <input type="text" value={adbgCareer.months} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">개월</span>
                  </div>
                </td>
                <th className="clear-th w-[110px]">기술자격경력</th>
                <td className="clear-td min-w-[160px]">
                  <div className="flex items-center gap-1">
                    <input type="text" value={ctqlCareer.years} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">년</span>
                    <input type="text" value={ctqlCareer.months} className="input-base input-default !w-[50px]" disabled />
                    <span className="m-1">개월</span>
                  </div>
                </td>
                <th className="clear-th w-[100px]">경력계산기준</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={formatDate(employeeInfo.CARR_CALC_STND_DT)} className="input-base input-default w-full" disabled />
                </td>
              </tr>

              <tr className="clear-tr">
                <th className="clear-th w-[100px]">기술등급(현)</th>
                <td className="clear-td min-w-[160px]">
                  <input type="text" value={employeeInfo.LAST_TCN_GRD} className="input-base input-default text-red-500 font-bold w-full" disabled />
                </td>
                <th className="clear-th w-[100px]">경력기준</th>
                <td className="clear-td min-w-[160px]" colSpan={3}>
                  <div className="flex items-center gap-4">
                    <label>
                      <input 
                        type="radio" 
                        name="calcType" 
                        checked={employeeInfo.CARR_DIV === '1'} 
                        disabled 
                      /> 학력
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="calcType" 
                        checked={employeeInfo.CARR_DIV === '2'} 
                        disabled 
                      /> 기술자격
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 등급 이력 테이블 */}
        <div className="tit_area">
          <h3>개발 기술등급 이력</h3>
          <div>
            <button 
              type="button" 
              className="btn-base btn-search"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? '조회중...' : '조회'}
            </button>
          </div>
        </div>
        <div className="gridbox-div mb-3" style={{ height: 'auto', overflowY: 'visible' }}>
          <table className="grid-table w-full">
            <thead>
              <tr>
                <th className="grid-th">기술등급</th>
                <th className="grid-th">시작일자</th>
                <th className="grid-th">비고</th>
              </tr>
            </thead>
            <tbody>
              {gradeHistory.length === 0 ? (
                <tr className="grid-tr">
                  <td colSpan={3} className="grid-td text-center text-gray-500">
                    {loading ? '조회중...' : '데이터가 없습니다'}
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

        {/* 안내 및 종료 버튼 */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-blue-700">
            * 시작일자는 등급이 시작되는 년월일을 말함. 리스트의 <span className="text-red-500">붉은색</span>은 경력계산기준일의 등급임.
          </div>
          <button type="button" className="btn-base btn-delete px-4" onClick={handleClose}>종료</button>
        </div>
        </div>
      </div>
    </div>
  );
}
