'use client';

import React, { useState, useEffect } from 'react';
import '../common/common.css';

/**
 * PSM1051D00 - ê²½ë ¥ ?ì„¸ ì¡°íšŒ ì»´í¬?ŒíŠ¸
 * 
 * ê¸°ì¡´ ?¬ì›??ê²½ë ¥ ?•ë³´ë¥?ì¡°íšŒ?˜ê³  ?œì‹œ?˜ëŠ” ì»´í¬?ŒíŠ¸?…ë‹ˆ??
 * PSM1050M00 ?ì—… ?´ì—???˜ì • ëª¨ë“œ?????¬ìš©?©ë‹ˆ??
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ì› ê²½ë ¥ ?•ë³´ ì¡°íšŒ
 * - ê²½ë ¥ ê³„ì‚° ê²°ê³¼ ?œì‹œ
 * - ?½ê¸° ?„ìš© ëª¨ë“œë¡?ê²½ë ¥ ?•ë³´ ?•ì¸
 * 
 * AS-IS: ê²½ë ¥ ì¡°íšŒ ì»´í¬?ŒíŠ¸ (MXML)
 * TO-BE: React ê¸°ë°˜ ê²½ë ¥ ì¡°íšŒ ì»´í¬?ŒíŠ¸
 * 
 * ?¬ìš© ?ˆì‹œ:
 * ```tsx
 * // PSM1050M00?ì„œ ?¬ìš© (?˜ì • ëª¨ë“œ)
 * <PSM1051D00 empNo="10001" />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */

// ?€???•ì˜
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

  // AS-IS MXML??fnChangeAfterCarrCalc ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  useEffect(() => {
    if (empNo) {
      // ?¬ì›ë²ˆí˜¸ê°€ ?ˆìœ¼ë©?API ?¸ì¶œ
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
          // result.data??ë°°ì—´?´ë?ë¡?ì²?ë²ˆì§¸ ?”ì†Œë¥??¬ìš©
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          // AS-IS MXML??carrCalcHandler ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
          const befMCnt = Number(data.BEF_M_CNT || 0);
          const aftMCnt = Number(data.AFT_M_CNT || 0);
          const totMCnt = befMCnt + aftMCnt;
          
          const befCtqlMCnt = Number(data.BEF_CTQL_M_CNT || 0);
          const aftCtqlMCnt = Number(data.AFT_CTQL_M_CNT || 0);
          const totCtqlMCnt = befCtqlMCnt + aftCtqlMCnt;

          // ? ì§œ ?•ì‹ ë³€?? "2025/07/31" ??"20250731"
          const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            // "2025/07/31" ?•íƒœë¥?"20250731"ë¡?ë³€??
            return dateStr.replace(/\//g, '');
          };

          setProfileData({
            calcStndDt: formatDate(data.CALC_STAD_DT || ''),
            // ?™ë ¥ê¸°ì? ê²½ë ¥
            entrBefInYcnt: String(Math.floor(befMCnt / 12)),
            entrBefInMcnt: String(befMCnt - (Math.floor(befMCnt / 12) * 12)),
            entrAftYcnt: String(Math.floor(aftMCnt / 12)),
            entrAftMcnt: String(aftMCnt - (Math.floor(aftMCnt / 12) * 12)),
            carrYcnt: String(Math.floor(totMCnt / 12)),
            carrMcnt: String(totMCnt - (Math.floor(totMCnt / 12) * 12)),
            tcnGrd: data.TCN_GRD_NM || '',
            tcnGrdCd: data.TCN_GRD || '',
            // ê¸°ìˆ ?ê²©ê¸°ì? ê²½ë ¥
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
      console.error('?„ë¡œ??ê²½ë ¥ ì¡°íšŒ ?¤íŒ¨:', error);
      setHasProfileData(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="tit_area flex justify-between items-center">
        <h3>
          ?„ë¡œ?„ê²½??
          {!hasProfileData && (
            <span className="text-[13px] font-normal text-red-500 ml-2">
              (?±ë¡???„ë¡œ???´ì—­???†ìŠµ?ˆë‹¤.)
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          <span className="">ê¸°ì???/span>
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
            <th className="form-th !text-center">?…ì‚¬??ê²½ë ¥</th>
            <th className="form-th !text-center">?…ì‚¬??ê²½ë ¥</th>
            <th className="form-th !text-center">?©ê³„</th>
            <th className="form-th !text-center">ê¸°ìˆ ?±ê¸‰</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="form-th text-left">?™ë ¥ê¸°ì?</th>
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
              /> ê°œì›”
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
              /> ê°œì›”
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
              /> ê°œì›”
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
            <th className="form-th text-left">ê¸°ìˆ ?ê²©ê¸°ì?</th>
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
              /> ê°œì›”
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
              /> ê°œì›”
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
              /> ê°œì›”
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
          ???…ì‚¬??ê²½ë ¥?€ ?„ë¡œ?„ì˜ ?…ì‚¬??ê²½ë ¥ë³´ë‹¤ ?????†ìŠµ?ˆë‹¤. ?„ë¡œ???‘ì„± ?´ìš©???•ì¸??ì£¼ì‹­?œìš”.
        </p>
      </div>
    </div>
  );
}


