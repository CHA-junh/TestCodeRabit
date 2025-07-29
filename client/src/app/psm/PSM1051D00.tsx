'use client';

import React, { useState, useEffect } from 'react';
import '../common/common.css';

/**
 * PSM1051D00 - 경력 상세 조회 컴포넌트
 * 
 * 기존 사원의 경력 정보를 조회하고 표시하는 컴포넌트입니다.
 * PSM1050M00 팝업 내에서 수정 모드일 때 사용됩니다.
 * 
 * 주요 기능:
 * - 사원 경력 정보 조회
 * - 경력 계산 결과 표시
 * - 읽기 전용 모드로 경력 정보 확인
 * 
 * AS-IS: 경력 조회 컴포넌트 (MXML)
 * TO-BE: React 기반 경력 조회 컴포넌트
 * 
 * 사용 예시:
 * ```tsx
 * // PSM1050M00에서 사용 (수정 모드)
 * <PSM1051D00 empNo="10001" />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */

// 타입 정의
interface ProfileCarrData {
  calcStndDt: string;
  entrBefInYcnt: string;
  entrBefInMcnt: string;
  entrAftYcnt: string;
  entrAftMcnt: string;
  carrYcnt: string;
  carrMcnt: string;
  tcnGrd: string;
  tcnGrdCd: string;
  entrBefInCtqlYcnt: string;
  entrBefInCtqlMcnt: string;
  entrAftCtqlYcnt: string;
  entrAftCtqlMcnt: string;
  carrCtqlYcnt: string;
  carrCtqlMcnt: string;
  ctqlTcnGrd: string;
  ctqlTcnGrdCd: string;
}

interface PSM1051D00Props {
  empNo?: string;
}

export default function PSM1051D00({ empNo }: PSM1051D00Props) {
  const [profileData, setProfileData] = useState<ProfileCarrData>({
    calcStndDt: '',
    entrBefInYcnt: '0',
    entrBefInMcnt: '0',
    entrAftYcnt: '0',
    entrAftMcnt: '0',
    carrYcnt: '0',
    carrMcnt: '0',
    tcnGrd: '',
    tcnGrdCd: '',
    entrBefInCtqlYcnt: '0',
    entrBefInCtqlMcnt: '0',
    entrAftCtqlYcnt: '0',
    entrAftCtqlMcnt: '0',
    carrCtqlYcnt: '0',
    carrCtqlMcnt: '0',
    ctqlTcnGrd: '',
    ctqlTcnGrdCd: ''
  });

  const [hasProfileData, setHasProfileData] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // AS-IS MXML의 fnChangeAfterCarrCalc 함수와 동일한 로직
  useEffect(() => {
    if (empNo) {
      // 사원번호가 있으면 API 호출
      loadProfileCarrData();
    }
  }, [empNo]);

  const loadProfileCarrData = async () => {
    if (!empNo) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empNo: empNo
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          // result.data는 배열이므로 첫 번째 요소를 사용
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          // AS-IS MXML의 carrCalcHandler 함수와 동일한 로직
          const befMCnt = Number(data.BEF_M_CNT || 0);
          const aftMCnt = Number(data.AFT_M_CNT || 0);
          const totMCnt = befMCnt + aftMCnt;
          
          const befCtqlMCnt = Number(data.BEF_CTQL_M_CNT || 0);
          const aftCtqlMCnt = Number(data.AFT_CTQL_M_CNT || 0);
          const totCtqlMCnt = befCtqlMCnt + aftCtqlMCnt;

          // 날짜 형식 변환: "2025/07/31" → "20250731"
          const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            // "2025/07/31" 형태를 "20250731"로 변환
            return dateStr.replace(/\//g, '');
          };

          setProfileData({
            calcStndDt: formatDate(data.CALC_STAD_DT || ''),
            // 학력기준 경력
            entrBefInYcnt: String(Math.floor(befMCnt / 12)),
            entrBefInMcnt: String(befMCnt - (Math.floor(befMCnt / 12) * 12)),
            entrAftYcnt: String(Math.floor(aftMCnt / 12)),
            entrAftMcnt: String(aftMCnt - (Math.floor(aftMCnt / 12) * 12)),
            carrYcnt: String(Math.floor(totMCnt / 12)),
            carrMcnt: String(totMCnt - (Math.floor(totMCnt / 12) * 12)),
            tcnGrd: data.TCN_GRD_NM || '',
            tcnGrdCd: data.TCN_GRD || '',
            // 기술자격기준 경력
            entrBefInCtqlYcnt: String(Math.floor(befCtqlMCnt / 12)),
            entrBefInCtqlMcnt: String(befCtqlMCnt - (Math.floor(befCtqlMCnt / 12) * 12)),
            entrAftCtqlYcnt: String(Math.floor(aftCtqlMCnt / 12)),
            entrAftCtqlMcnt: String(aftCtqlMCnt - (Math.floor(aftCtqlMCnt / 12) * 12)),
            carrCtqlYcnt: String(Math.floor(totCtqlMCnt / 12)),
            carrCtqlMcnt: String(totCtqlMCnt - (Math.floor(totCtqlMCnt / 12) * 12)),
            ctqlTcnGrd: data.CTQL_TCN_GRD_NM || '',
            ctqlTcnGrdCd: data.CTQL_TCN_GRD || ''
          });
          setHasProfileData(true);
        } else {
          setHasProfileData(false);
        }
      }
    } catch (error) {
      console.error('프로필 경력 조회 실패:', error);
      setHasProfileData(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="tit_area flex justify-between items-center">
        <h3>
          프로필경력
          {!hasProfileData && (
            <span className="text-[13px] font-normal text-red-500 ml-2">
              (등록된 프로필 내역이 없습니다.)
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          <span className="">기준일</span>
          <input
            type="date"
            className="input-base input-calender w-[150px]"
            value={profileData.calcStndDt ? profileData.calcStndDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
            readOnly
          />
        </div>
      </div>

      <table className="form-table mt-2">
        <thead>
          <tr>
            <th className="form-th w-[160px]"></th>
            <th className="form-th !text-center">입사전 경력</th>
            <th className="form-th !text-center">입사후 경력</th>
            <th className="form-th !text-center">합계</th>
            <th className="form-th !text-center">기술등급</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="form-th text-left">학력기준</th>
            <td className="form-td">
              <input 
                className="input-base !w-[50px]" 
                value={profileData.entrBefInYcnt}
                readOnly
              /> 년{' '}
              <input 
                className="input-base !w-[50px]" 
                value={profileData.entrBefInMcnt}
                readOnly
              /> 개월
            </td>
            <td className="form-td">
              <input 
                className="input-base !w-[50px]" 
                value={profileData.entrAftYcnt}
                readOnly
              /> 년{' '}
              <input 
                className="input-base !w-[50px]" 
                value={profileData.entrAftMcnt}
                readOnly
              /> 개월
            </td>
            <td className="form-td">
              <input 
                className="input-base !w-[50px]" 
                value={profileData.carrYcnt}
                readOnly
              /> 년{' '}
              <input 
                className="input-base !w-[50px]" 
                value={profileData.carrMcnt}
                readOnly
              /> 개월
            </td>
            <td className="form-td">
              <input 
                className="input-base w-full" 
                value={profileData.tcnGrd}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <th className="form-th text-left">기술자격기준</th>
            <td className="form-td">
              <input 
                className="input-base !w-[50px]" 
                value={profileData.entrBefInCtqlYcnt}
                readOnly
              /> 년{' '}
              <input 
                className="input-base !w-[50px]" 
                value={profileData.entrBefInCtqlMcnt}
                readOnly
              /> 개월
            </td>
            <td className="form-td">
              <input 
                className="input-base !w-[50px]" 
                value={profileData.entrAftCtqlYcnt}
                readOnly
              /> 년{' '}
              <input 
                className="input-base !w-[50px]" 
                value={profileData.entrAftCtqlMcnt}
                readOnly
              /> 개월
            </td>
            <td className="form-td">
              <input 
                className="input-base !w-[50px]" 
                value={profileData.carrCtqlYcnt}
                readOnly
              /> 년{' '}
              <input 
                className="input-base !w-[50px]" 
                value={profileData.carrCtqlMcnt}
                readOnly
              /> 개월
            </td>
            <td className="form-td">
              <input 
                className="input-base w-full" 
                value={profileData.ctqlTcnGrd}
                readOnly
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-3">
        <p className="text-[13px] text-[#00509A] py-1">
          ※ 입사전 경력은 프로필의 입사전 경력보다 클 수 없습니다. 프로필 작성 내용을 확인해 주십시요.
        </p>
      </div>
    </div>
  );
}
