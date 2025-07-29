'use client';

import React, { useState, useEffect } from 'react';
import '../common/common.css';

/**
 * PSM1051D00 - 경력 ?�세 조회 컴포?�트
 * 
 * 기존 ?�원??경력 ?�보�?조회?�고 ?�시?�는 컴포?�트?�니??
 * PSM1050M00 ?�업 ?�에???�정 모드?????�용?�니??
 * 
 * 주요 기능:
 * - ?�원 경력 ?�보 조회
 * - 경력 계산 결과 ?�시
 * - ?�기 ?�용 모드�?경력 ?�보 ?�인
 * 
 * AS-IS: 경력 조회 컴포?�트 (MXML)
 * TO-BE: React 기반 경력 조회 컴포?�트
 * 
 * ?�용 ?�시:
 * ```tsx
 * // PSM1050M00?�서 ?�용 (?�정 모드)
 * <PSM1051D00 empNo="10001" />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */

// ?�???�의
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

  // AS-IS MXML??fnChangeAfterCarrCalc ?�수?� ?�일??로직
  useEffect(() => {
    if (empNo) {
      // ?�원번호가 ?�으�?API ?�출
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
          // result.data??배열?��?�?�?번째 ?�소�??�용
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          // AS-IS MXML??carrCalcHandler ?�수?� ?�일??로직
          const befMCnt = Number(data.BEF_M_CNT || 0);
          const aftMCnt = Number(data.AFT_M_CNT || 0);
          const totMCnt = befMCnt + aftMCnt;
          
          const befCtqlMCnt = Number(data.BEF_CTQL_M_CNT || 0);
          const aftCtqlMCnt = Number(data.AFT_CTQL_M_CNT || 0);
          const totCtqlMCnt = befCtqlMCnt + aftCtqlMCnt;

          // ?�짜 ?�식 변?? "2025/07/31" ??"20250731"
          const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            // "2025/07/31" ?�태�?"20250731"�?변??
            return dateStr.replace(/\//g, '');
          };

          setProfileData({
            calcStndDt: formatDate(data.CALC_STAD_DT || ''),
            // ?�력기�? 경력
            entrBefInYcnt: String(Math.floor(befMCnt / 12)),
            entrBefInMcnt: String(befMCnt - (Math.floor(befMCnt / 12) * 12)),
            entrAftYcnt: String(Math.floor(aftMCnt / 12)),
            entrAftMcnt: String(aftMCnt - (Math.floor(aftMCnt / 12) * 12)),
            carrYcnt: String(Math.floor(totMCnt / 12)),
            carrMcnt: String(totMCnt - (Math.floor(totMCnt / 12) * 12)),
            tcnGrd: data.TCN_GRD_NM || '',
            tcnGrdCd: data.TCN_GRD || '',
            // 기술?�격기�? 경력
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
      console.error('?�로??경력 조회 ?�패:', error);
      setHasProfileData(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="tit_area flex justify-between items-center">
        <h3>
          ?�로?�경??
          {!hasProfileData && (
            <span className="text-[13px] font-normal text-red-500 ml-2">
              (?�록???�로???�역???�습?�다.)
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          <span className="">기�???/span>
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
            <th className="form-th !text-center">?�사??경력</th>
            <th className="form-th !text-center">?�사??경력</th>
            <th className="form-th !text-center">?�계</th>
            <th className="form-th !text-center">기술?�급</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="form-th text-left">?�력기�?</th>
            <td className="form-td">
              <input 
                className="input-base !w-[50px]" 
                value={profileData.entrBefInYcnt}
                readOnly
              /> ??' '}
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
              /> ??' '}
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
              /> ??' '}
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
            <th className="form-th text-left">기술?�격기�?</th>
            <td className="form-td">
              <input 
                className="input-base !w-[50px]" 
                value={profileData.entrBefInCtqlYcnt}
                readOnly
              /> ??' '}
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
              /> ??' '}
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
              /> ??' '}
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
          ???�사??경력?� ?�로?�의 ?�사??경력보다 ?????�습?�다. ?�로???�성 ?�용???�인??주십?�요.
        </p>
      </div>
    </div>
  );
}


