'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import '../common/common.css';
import PSM1051D00 from './PSM1051D00';
import PSM1052D00 from './PSM1052D00';

// ?�???�의
interface CarrCalcData {
  empNo: string;
  ownOutsDiv: string;
  empNm: string;
  entrDt: string;
  lastAdbgDiv: string;
  lastAdbgDivCd: string;
  ctqlCd: string;
  ctqlPurDt: string;
  fstInDt: string;
  lastEndDt: string;
  carrCalcStndDt: string;
  // 경력 계산 결과
  entrBefInYcnt: string;
  entrBefInMcnt: string;
  entrAftYcnt: string;
  entrAftMcnt: string;
  carrYcnt: string;
  carrMcnt: string;
  tcnGrd: string;
  tcnGrdCd: string;
  // 기술?�격기�? 경력
  entrBefInCtqlYcnt: string;
  entrBefInCtqlMcnt: string;
  entrAftCtqlYcnt: string;
  entrAftCtqlMcnt: string;
  carrCtqlYcnt: string;
  carrCtqlMcnt: string;
  ctqlTcnGrd: string;
  ctqlTcnGrdCd: string;
  // 기�?
  entrBefMonths: string;
  entrBefCtqlMonths: string;
}

interface CommonCode {
  data?: string;
  label?: string;
  codeId?: string;
  codeNm?: string;
}

interface PSM1050M00Props {
  employeeData?: any;
  newFlag?: boolean; // PSM1020M00??newFlag?� ?�일
  onClose: () => void;
  onConfirm: (data: string) => void;
}

export default function PSM1050M00({ employeeData, newFlag = true, onClose, onConfirm }: PSM1050M00Props) {
  const { showToast, showConfirm } = useToast();
  const { user } = useAuth();
  const [carrData, setCarrData] = useState<CarrCalcData>({
    empNo: '',
    ownOutsDiv: '1',
    empNm: '',
    entrDt: '',
    lastAdbgDiv: '',
    lastAdbgDivCd: '',
    ctqlCd: '',
    ctqlPurDt: '',
    fstInDt: '',
    lastEndDt: '',
    carrCalcStndDt: '',
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
    ctqlTcnGrdCd: '',
    entrBefMonths: '0',
    entrBefCtqlMonths: '0'
  });

  const [commonCodes, setCommonCodes] = useState<{
    ctqlCd: CommonCode[];
    tcnGrd: CommonCode[];
  }>({
    ctqlCd: [],
    tcnGrd: []
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAutoCalcEnabled, setIsAutoCalcEnabled] = useState(true);
  
  // AS-IS MXML???�??변?�들�??�일
  const [savedData, setSavedData] = useState<{
    entrBefInYcnt: string;
    entrBefInMcnt: string;
    entrBefCtqlInYcnt: string;
    entrBefCtqlInMcnt: string;
  }>({
    entrBefInYcnt: '',
    entrBefInMcnt: '',
    entrBefCtqlInYcnt: '',
    entrBefCtqlInMcnt: ''
  });

  // 초기??
  useEffect(() => {
    if (employeeData) {
      const initialCarrData = {
        empNo: employeeData.EMP_NO || '',
        ownOutsDiv: employeeData.OWN_OUTS_DIV_CD || '1',
        empNm: employeeData.EMP_NM || '',
        entrDt: employeeData.ENTR_DT || '',
        lastAdbgDiv: employeeData.LAST_ADBG_DIV_NM || '',
        lastAdbgDivCd: employeeData.LAST_ADBG_DIV || '',
        ctqlCd: employeeData.CTQL_CD === 'null' ? '' : (employeeData.CTQL_CD || ''),
        ctqlPurDt: employeeData.CTQL_PUR_DT || '',
        fstInDt: employeeData.FST_IN_DT || '',
        lastEndDt: employeeData.LAST_END_DT || '',
        carrCalcStndDt: employeeData.CARR_CALC_STND_DT || '',
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
        ctqlTcnGrdCd: '',
        entrBefMonths: '0',
        entrBefCtqlMonths: '0'
      };
      
      setCarrData(initialCarrData);
    }
    loadCommonCodes();
  }, [employeeData]);

  // AS-IS MXML�??�일: ?�면 로드 ???�동 경력계산/?�로?�경??조회
  useEffect(() => {
    if (employeeData && carrData.empNo) {
      // AS-IS MXML??initComplete 로직�??�일
      if (newFlag === false) {
        // ?�정 ?�록 ?? ?�로??경력 조회 ??경력계산???�행
        loadProfileCareerAndCalc();
      } else {
        // ?�규 ?�록 ?? 경력계산 ?�행
        handleCarrCalc();
      }
    }
  }, [carrData.empNo, newFlag]);

  // ?�로??경력 조회 ??경력계산 ?�행
  const loadProfileCareerAndCalc = async () => {
    try {
      const response = await fetch('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empNo: carrData.empNo
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // result.data??배열?��?�?�?번째 ?�소�??�용
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          // 경력계산 ?�행
          handleCarrCalc();
          
          // ?�짜 ?�식 변?? "2025/07/31" ??"20250731"
          const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            // "2025/07/31" ?�태�?"20250731"�?변??
            return dateStr.replace(/\//g, '');
          };

          setCarrData(prev => ({
            ...prev,
            carrCalcStndDt: formatDate(data?.CALC_STAD_DT || ''),
            // ?�력기�? 경력 계산
            entrBefInYcnt: String(Math.floor(Number(data?.BEF_M_CNT || 0) / 12)),
            entrBefInMcnt: String((Number(data?.BEF_M_CNT || 0) - Math.floor(Number(data?.BEF_M_CNT || 0) / 12) * 12)),
            entrAftYcnt: String(Math.floor(Number(data?.AFT_M_CNT || 0) / 12)),
            entrAftMcnt: String((Number(data?.AFT_M_CNT || 0) - Math.floor(Number(data?.AFT_M_CNT || 0) / 12) * 12)),
            carrYcnt: String(Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12)),
            carrMcnt: String(((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) - Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12) * 12)),
            tcnGrd: data?.TCN_GRD_NM || '',
            tcnGrdCd: data?.TCN_GRD || '',
            // 기술?�격기�? 경력 계산
            entrBefInCtqlYcnt: String(Math.floor(Number(data?.BEF_CTQL_M_CNT || 0) / 12)),
            entrBefInCtqlMcnt: String((Number(data?.BEF_CTQL_M_CNT || 0) - Math.floor(Number(data?.BEF_CTQL_M_CNT || 0) / 12) * 12)),
            entrAftCtqlYcnt: String(Math.floor(Number(data?.AFT_CTQL_M_CNT || 0) / 12)),
            entrAftCtqlMcnt: String((Number(data?.AFT_CTQL_M_CNT || 0) - Math.floor(Number(data?.AFT_CTQL_M_CNT || 0) / 12) * 12)),
            carrCtqlYcnt: String(Math.floor((Number(data?.BEF_CTQL_M_CNT || 0) + Number(data?.AFT_CTQL_M_CNT || 0)) / 12)),
            carrCtqlMcnt: String(((Number(data?.BEF_CTQL_M_CNT || 0) + Number(data?.AFT_CTQL_M_CNT || 0)) - Math.floor((Number(data?.BEF_CTQL_M_CNT || 0) + Number(data?.AFT_CTQL_M_CNT || 0)) / 12) * 12)),
            ctqlTcnGrd: data?.CTQL_TCN_GRD_NM || '',
            ctqlTcnGrdCd: data?.CTQL_TCN_GRD || ''
          }));
        }
      }
      
      // ?�로??경력 조회 ?�료 (경력계산?� 별도�??�행?��? ?�음)
    } catch (error) {
      console.error('?�로??경력 조회 ?�패:', error);
    }
  };

  // AS-IS MXML??fnChangeAfterCarrCalc ?�수?� ?�일???�로??경력 조회
  const loadProfileCareer = async () => {
    try {
      const response = await fetch('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empNo: carrData.empNo
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // result.data??배열?��?�?�?번째 ?�소�??�용
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          // AS-IS MXML??carrCalcHandler 로직�??�일???�이??처리
          if (!data) {
            console.log('?�록???�로???�역???�습?�다.');
            return;
          }

          // ?�짜 ?�식 변?? "2025/07/31" ??"20250731"
          const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            // "2025/07/31" ?�태�?"20250731"�?변??
            return dateStr.replace(/\//g, '');
          };

          setCarrData(prev => ({
            ...prev,
            carrCalcStndDt: formatDate(data?.CALC_STAD_DT || ''),
            // ?�력기�? 경력 계산
            entrBefInYcnt: String(Math.floor(Number(data?.BEF_M_CNT || 0) / 12)),
            entrBefInMcnt: String((Number(data?.BEF_M_CNT || 0) - Math.floor(Number(data?.BEF_M_CNT || 0) / 12) * 12)),
            entrAftYcnt: String(Math.floor(Number(data?.AFT_M_CNT || 0) / 12)),
            entrAftMcnt: String((Number(data?.AFT_M_CNT || 0) - Math.floor(Number(data?.AFT_M_CNT || 0) / 12) * 12)),
            carrYcnt: String(Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12)),
            carrMcnt: String(((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) - Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12) * 12)),
            tcnGrd: data?.TCN_GRD_NM || '',
            tcnGrdCd: data?.TCN_GRD || '',
            // 기술?�격기�? 경력 계산
            entrBefInCtqlYcnt: String(Math.floor(Number(data?.BEF_CTQL_M_CNT || 0) / 12)),
            entrBefInCtqlMcnt: String((Number(data?.BEF_CTQL_M_CNT || 0) - Math.floor(Number(data?.BEF_CTQL_M_CNT || 0) / 12) * 12)),
            entrAftCtqlYcnt: String(Math.floor(Number(data?.AFT_CTQL_M_CNT || 0) / 12)),
            entrAftCtqlMcnt: String((Number(data?.AFT_CTQL_M_CNT || 0) - Math.floor(Number(data?.AFT_CTQL_M_CNT || 0) / 12) * 12)),
            carrCtqlYcnt: String(Math.floor((Number(data?.BEF_CTQL_M_CNT || 0) + Number(data?.AFT_CTQL_M_CNT || 0)) / 12)),
            carrCtqlMcnt: String(((Number(data?.BEF_CTQL_M_CNT || 0) + Number(data?.AFT_CTQL_M_CNT || 0)) - Math.floor((Number(data?.BEF_CTQL_M_CNT || 0) + Number(data?.AFT_CTQL_M_CNT || 0)) / 12) * 12)),
            ctqlTcnGrd: data?.CTQL_TCN_GRD_NM || '',
            ctqlTcnGrdCd: data?.CTQL_TCN_GRD || ''
          }));
        }
      }
    } catch (error) {
      console.error('?�로??경력 조회 ?�패:', error);
    }
  };

  // 공통코드 로드
  const loadCommonCodes = async () => {
    try {
      const [ctqlResponse, tcnGrdResponse] = await Promise.all([
        fetch('/api/common/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ largeCategoryCode: '013' }) // ?�격�?
        }),
        fetch('/api/common/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ largeCategoryCode: '104' }) // 기술?�급
        })
      ]);

      const ctqlResult = await ctqlResponse.json();
      const tcnGrdResult = await tcnGrdResponse.json();
      
      const ctqlData = ctqlResult.data || [];
      const tcnGrdData = tcnGrdResult.data || [];

      setCommonCodes({
        ctqlCd: ctqlData,
        tcnGrd: tcnGrdData
      });
    } catch (error) {
      console.error('공통코드 로드 ?�패:', error);
    }
  };

  // AS-IS MXML??onBtnClickCarrCalc ?�수?� ?�일??로직
  const handleCarrCalc = async () => {
    if (!validateInput()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/psm/career/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empNo: carrData.empNo,
          entrDt: carrData.entrDt,
          fstInDt: carrData.fstInDt,
          lastEndDt: carrData.lastEndDt,
          lastAdbgDivCd: carrData.lastAdbgDivCd,
          ctqlCd: carrData.ctqlCd,
          ctqlPurDt: carrData.ctqlPurDt,
          ownOutsDiv: carrData.ownOutsDiv
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // result.data??배열?��?�?�?번째 ?�소�??�용
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          const updatedData = {
            ...carrData,
            // ?�력기�? 경력
            entrBefInYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_Y || 0) : '0',
            entrBefInMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_M || 0) : '0',
            entrAftYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_AFT_Y || 0) : '0',
            entrAftMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_AFT_M || 0) : '0',
            carrYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CARR_YEAR || 0) : String(data?.OUTS_CARR_Y || 0),
            carrMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CARR_MONTH || 0) : String(data?.OUTS_CARR_M || 0),
            tcnGrd: data?.OWN_OUTS_DIV === '1' ? (data?.TCN_GRD_NM || '') : (data?.OUTS_TCN_GRD_NM || ''),
            tcnGrdCd: data?.OWN_OUTS_DIV === '1' ? (data?.TCN_GRD || '') : (data?.OUTS_TCN_GRD || ''),
            // 기술?�격기�? 경력
            entrBefInCtqlYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_BEF_Y || 0) : '0',
            entrBefInCtqlMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_BEF_M || 0) : '0',
            entrAftCtqlYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_AFT_Y || 0) : '0',
            entrAftCtqlMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_AFT_M || 0) : '0',
            carrCtqlYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_YEAR || 0) : String(data?.OUTS_CTQL_CARR_Y || 0),
            carrCtqlMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_MONTH || 0) : String(data?.OUTS_CTQL_CARR_M || 0),
            ctqlTcnGrd: data?.OWN_OUTS_DIV === '1' ? (data?.CTQL_TCN_GRD_NM || '') : (data?.OUTS_CTQL_TCN_GRD_NM || ''),
            ctqlTcnGrdCd: data?.OWN_OUTS_DIV === '1' ? (data?.CTQL_TCN_GRD || '') : (data?.OUTS_CTQL_TCN_GRD || ''),
            carrCalcStndDt: data?.CARR_CALC_STND_DT ? data.CARR_CALC_STND_DT.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3') : '',
            entrBefMonths: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_MONTHS || 0) : '0',
            entrBefCtqlMonths: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_BEF_MONTHS || 0) : '0'
          };
                    
          // 경력계산 결과 ?�팅 ???�동 계산 비활?�화
          setIsAutoCalcEnabled(false);
          setCarrData(updatedData);

          // AS-IS MXML�??�일: 계산??종료?????�력??경력?�이??Save
          setSavedData({
            entrBefInYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_Y || 0) : '0',
            entrBefInMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_M || 0) : '0',
            entrBefCtqlInYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_BEF_Y || 0) : '0',
            entrBefCtqlInMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_BEF_M || 0) : '0'
          });
        } else {
          console.error('경력계산 ?�패:', result.message);
        }
      }
    } catch (error) {
      console.error('경력계산 ?�패:', error);
      showToast('경력계산 �??�류가 발생?�습?�다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // AS-IS MXML??isCheckInputValidation ?�수?� ?�일??로직
  const validateInput = (): boolean => {
    if (!carrData.fstInDt) {
      showToast('최초?�입?�자�??�력?�십?�요.', 'warning');
      return false;
    }
    
    if (carrData.ownOutsDiv === '2' && !carrData.lastEndDt) {
      showToast('최종철수?�자�??�력?�십?�요.', 'warning');
      return false;
    }
    
    return true;
  };

  // AS-IS MXML??onBtnConfirmClick ?�수?� ?�일??로직
  const handleConfirm = async () => {
    // ?�벤???�출 - ?�이???�성
    const confirmData = makeConfirmData();
    
    // 2013.10.01 ?�원?�보??경력 갱신
    if (newFlag === false) {
      // ?�정 ?�록 ?? 경력?�???�행
      await fnUpdateCarr();
    }
    
    // ?�이??반환 �??�업 ?�기
    onConfirm(confirmData);
    //onClose();
  };

  // AS-IS MXML??fnUpdateCarr ?�수?� ?�일??로직
  const fnUpdateCarr = async () => {
    const confirmData = makeConfirmData();
    const arrD = confirmData.split('^');

    try {
      const response = await fetch('/api/psm/career/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empNo: carrData.empNo,
          ownOutsDiv: carrData.ownOutsDiv,
          ctqlCd: carrData.ctqlCd,
          ctqlPurDt: carrData.ctqlPurDt ? carrData.ctqlPurDt.replace(/-/g, '') : '',
          fstInDt: carrData.fstInDt ? carrData.fstInDt.replace(/-/g, '') : '',
          lastEndDt: carrData.lastEndDt ? carrData.lastEndDt.replace(/-/g, '') : '',
          carrCalcStndDt: arrD[16] ? arrD[16].replace(/-/g, '') : '',
          carrDivCd: arrD[11],        // 경력구분코드 (1:?�력, 2:기술?�격)
          lastTcnGrd: arrD[10],       // 기술?�급코드
          carrMcnt: getCarrMCnt(arrD[7], arrD[8]), // 경력개월??
          adbgCarrMcnt: arrD[14],     // ?�력경력개월??
          ctqlCarrMcnt: arrD[15],     // ?�격경력개월??
          entrBefAdbgCarr: arrD[17],  // ?�사?�학?�경?�개?�수
          entrBefCtqlCarr: arrD[18],  // ?�사?�자격경?�개?�수
          userId: user?.userId || 'system' // 로그?�사?�자 (?�제 ?�션?�서 가?�옴)
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('경력?�???�답:', result);
        if (result.success) {
          showToast('?�?�되?�습?�다.', 'info');
        } else {
          showToast(result.message || '?�?�에 ?�패?�습?�다.', 'error');
        }
      } else {
        console.error('HTTP ?�류:', response.status, response.statusText);
        showToast(`?�?�에 ?�패?�습?�다. (${response.status})`, 'error');
      }
    } catch (error) {
      console.error('경력?�???�패:', error);
      showToast('경력?�??�??�류가 발생?�습?�다.', 'error');
    }
  };

  // AS-IS MXML??fnMakeCinfirmData ?�수?� ?�일??로직
  const makeConfirmData = (): string => {
    let strData = '';
    // AS-IS MXML??CommMethods.SlashDel() ?�수?� ?�일??로직
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      return dateStr.replace(/-/g, ''); // YYYY-MM-DD ??YYYYMMDD
    };
    
    strData += '^' + formatDate(carrData.fstInDt);
    strData += '^' + formatDate(carrData.lastEndDt);
    
    if (carrData.ctqlTcnGrdCd) {
      if (Number(carrData.tcnGrdCd) < Number(carrData.ctqlTcnGrdCd)) {
        // ?�격증이 ?�고 ?�력기�? ?�급???�으�??�력기�? 경력
        strData += '^' + carrData.entrBefInYcnt;
        strData += '^' + carrData.entrBefInMcnt;
        strData += '^' + carrData.entrAftYcnt;
        strData += '^' + carrData.entrAftMcnt;
        strData += '^' + carrData.carrYcnt;
        strData += '^' + carrData.carrMcnt;
        strData += '^' + carrData.tcnGrd;
        strData += '^' + carrData.tcnGrdCd;
        strData += '^1'; // 경력기�?-?�력
      } else if (Number(carrData.tcnGrdCd) === Number(carrData.ctqlTcnGrdCd)) {
        // ?�격증이 ?�고 ?�력기�??�급�?기술?�격?�급???�일?�면 경력??많�? 것으�?
        const numCarrMonths = Number(carrData.carrYcnt) * 12 + Number(carrData.carrMcnt);
        const numCtqlCarrMonths = Number(carrData.carrCtqlYcnt) * 12 + Number(carrData.carrCtqlMcnt);
        
        if (numCarrMonths > numCtqlCarrMonths) {
          strData += '^' + carrData.entrBefInYcnt;
          strData += '^' + carrData.entrBefInMcnt;
          strData += '^' + carrData.entrAftYcnt;
          strData += '^' + carrData.entrAftMcnt;
          strData += '^' + carrData.carrYcnt;
          strData += '^' + carrData.carrMcnt;
          strData += '^' + carrData.tcnGrd;
          strData += '^' + carrData.tcnGrdCd;
          strData += '^1'; // 경력기�?-?�력
        } else {
          strData += '^' + carrData.entrBefInCtqlYcnt;
          strData += '^' + carrData.entrBefInCtqlMcnt;
          strData += '^' + carrData.entrAftCtqlYcnt;
          strData += '^' + carrData.entrAftCtqlMcnt;
          strData += '^' + carrData.carrCtqlYcnt;
          strData += '^' + carrData.carrCtqlMcnt;
          strData += '^' + carrData.ctqlTcnGrd;
          strData += '^' + carrData.ctqlTcnGrdCd;
          strData += '^2'; // 경력기�?-기술?�격
        }
      } else {
        // ?�격증이 ?�고 기술?�격기�??�급???�으�?기술?�격기�? 경력
        strData += '^' + carrData.entrBefInCtqlYcnt;
        strData += '^' + carrData.entrBefInCtqlMcnt;
        strData += '^' + carrData.entrAftCtqlYcnt;
        strData += '^' + carrData.entrAftCtqlMcnt;
        strData += '^' + carrData.carrCtqlYcnt;
        strData += '^' + carrData.carrCtqlMcnt;
        strData += '^' + carrData.ctqlTcnGrd;
        strData += '^' + carrData.ctqlTcnGrdCd;
        strData += '^2'; // 경력기�?-기술?�격
      }
    } else {
      // ?�격증이 ?�을 경우
      strData += '^' + carrData.entrBefInYcnt;
      strData += '^' + carrData.entrBefInMcnt;
      strData += '^' + carrData.entrAftYcnt;
      strData += '^' + carrData.entrAftMcnt;
      strData += '^' + carrData.carrYcnt;
      strData += '^' + carrData.carrMcnt;
      strData += '^' + carrData.tcnGrd;
      strData += '^' + carrData.tcnGrdCd;
      strData += '^1'; // 경력기�?-?�력
    }
    
    strData += '^' + carrData.ctqlCd;
    strData += '^' + formatDate(carrData.ctqlPurDt);
    strData += '^' + getCarrMCnt(carrData.carrYcnt, carrData.carrMcnt);
    strData += '^' + getCarrMCnt(carrData.carrCtqlYcnt, carrData.carrCtqlMcnt);
    strData += '^' + formatDate(carrData.carrCalcStndDt);
    strData += '^' + getCarrMCnt(carrData.entrBefInYcnt, carrData.entrBefInMcnt);
    strData += '^' + getCarrMCnt(carrData.entrBefInCtqlYcnt, carrData.entrBefInCtqlMcnt);
    strData += '^' + getCarrMCnt(carrData.entrAftYcnt, carrData.entrAftMcnt);
    strData += '^' + getCarrMCnt(carrData.entrAftCtqlYcnt, carrData.entrAftCtqlMcnt);
    
    return strData;
  };

  // AS-IS MXML??getCarrMCnt ?�수?� ?�일??로직
  const getCarrMCnt = (strYCnt: string, strMCnt: string): string => {
    const nYcnt = parseInt(strYCnt) || 0;
    const nMCnt = parseInt(strMCnt) || 0;
    return String((nYcnt * 12) + nMCnt);
  };

  // AS-IS MXML??getTotalCarrMonths ?�수?� ?�일??로직
  const getTotalCarrMonths = (sKb: string) => {
    if (sKb === 'Adbg') { // ?�력기�? 경력
      const adbgCarrMonths = Number(getCarrMCnt(carrData.entrBefInYcnt, carrData.entrBefInMcnt)) +
                             Number(getCarrMCnt(carrData.entrAftYcnt, carrData.entrAftMcnt));
      setCarrData(prev => ({
        ...prev,
        carrYcnt: String(Math.floor(adbgCarrMonths / 12)),
        carrMcnt: String(adbgCarrMonths - Math.floor(adbgCarrMonths / 12) * 12)
      }));
    } else if (sKb === 'Ctql') { // 기술?�격기�? 경력
      const ctqlCarrMonths = Number(getCarrMCnt(carrData.entrBefInCtqlYcnt, carrData.entrBefInCtqlMcnt)) +
                             Number(getCarrMCnt(carrData.entrAftCtqlYcnt, carrData.entrAftCtqlMcnt));
      setCarrData(prev => ({
        ...prev,
        carrCtqlYcnt: String(Math.floor(ctqlCarrMonths / 12)),
        carrCtqlMcnt: String(ctqlCarrMonths - Math.floor(ctqlCarrMonths / 12) * 12)
      }));
    }
    
    // 기술?�급 ?�동 계산
    getTcnGrd(sKb);
  };

  // AS-IS MXML??getTcnGrd ?�수?� ?�일??로직
  const getTcnGrd = (sKb: string) => {
    if (sKb === 'Adbg') {
      const carrMonths = Number(getCarrMCnt(carrData.carrYcnt, carrData.carrMcnt));
      
      if (carrData.lastAdbgDivCd === '04') { // ?�문?�사
        if (carrMonths < 108) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: '초급' }));
        } else if (carrMonths < 108 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: '중급' }));
        } else if (carrMonths < 108 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '?�급' }));
        }
      } else if (carrData.lastAdbgDivCd === '03') { // ?�사
        if (carrMonths < 72) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: '초급' }));
        } else if (carrMonths < 72 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: '중급' }));
        } else if (carrMonths < 72 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '?�급' }));
        }
      } else if (carrData.lastAdbgDivCd === '02') { // ?�사
        if (carrMonths < 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: '초급' }));
        } else if (carrMonths < 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: '중급' }));
        } else if (carrMonths < 36 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '?�급' }));
        }
      } else if (carrData.lastAdbgDivCd === '01') { // 박사
        if (carrMonths < 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '?�급' }));
        }
      } else if (carrData.lastAdbgDivCd === '05') { // 고졸
        if (carrMonths < 144) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: '초급' }));
        } else if (carrMonths < 144 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: '중급' }));
        } else if (carrMonths < 144 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '?�급' }));
        }
      }
    } else if (sKb === 'Ctql') {
      const ctqlCarrMonths = Number(getCarrMCnt(carrData.carrCtqlYcnt, carrData.carrCtqlMcnt));

      if (carrData.ctqlCd === '01') { // 기사
        if (ctqlCarrMonths < 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '4', ctqlTcnGrd: '초급' }));
        } else if (ctqlCarrMonths < 36 + 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '3', ctqlTcnGrd: '중급' }));
        } else if (ctqlCarrMonths < 36 + 36 + 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '2', ctqlTcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '1', ctqlTcnGrd: '?�급' }));
        }
      } else if (carrData.ctqlCd === '02') { // ?�업기사
        if (ctqlCarrMonths < 84) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '4', ctqlTcnGrd: '초급' }));
        } else if (ctqlCarrMonths < 84 + 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '3', ctqlTcnGrd: '중급' }));
        } else if (ctqlCarrMonths < 84 + 36 + 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '2', ctqlTcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '1', ctqlTcnGrd: '?�급' }));
        }
      }
    }
  };

  // AS-IS MXML??setEnableInputData ?�수?� ?�일??로직
  const setEnableInputData = (ownOutsCd: string) => {
    if (ownOutsCd === '1') {
      // ?�사??경우: ?�사???�사??경력 ?�력 가?? ?�계???�기?�용
      return {
        entrBefInYcnt: true,
        entrBefInMcnt: true,
        entrAftYcnt: false,
        entrAftMcnt: false,
        carrYcnt: false,
        carrMcnt: false,
        entrBefInCtqlYcnt: true,
        entrBefInCtqlMcnt: true,
        entrAftCtqlYcnt: false,
        entrAftCtqlMcnt: false,
        carrCtqlYcnt: false,
        carrCtqlMcnt: false
      };
    } else {
      // ?�주??경우: ?�사???�사??경력 ?�력 불�?, ?�계�??�력 가??
      return {
        entrBefInYcnt: false,
        entrBefInMcnt: false,
        entrAftYcnt: false,
        entrAftMcnt: false,
        carrYcnt: true,
        carrMcnt: true,
        entrBefInCtqlYcnt: false,
        entrBefInCtqlMcnt: false,
        entrAftCtqlYcnt: false,
        entrAftCtqlMcnt: false,
        carrCtqlYcnt: true,
        carrCtqlMcnt: true
      };
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCarrData(prev => ({
      ...prev,
      [field]: value
    }));

    // ?�용?��? 직접 ?�력 ?�드�?변경하�??�동 계산 ?�성??
    if (!isAutoCalcEnabled && ['entrBefInYcnt', 'entrBefInMcnt', 'entrAftYcnt', 'entrAftMcnt', 'entrBefInCtqlYcnt', 'entrBefInCtqlMcnt', 'entrAftCtqlYcnt', 'entrAftCtqlMcnt'].includes(field)) {
      setIsAutoCalcEnabled(true);
    }

    // ?�동 계산???�성?�된 경우?�만 ?�동 계산 ?�행
    if (isAutoCalcEnabled) {
      // AS-IS MXML�??�일: 경력개월??변�????�동 계산
      if (['entrBefInYcnt', 'entrBefInMcnt', 'entrAftYcnt', 'entrAftMcnt'].includes(field)) {
        getTotalCarrMonths('Adbg');
      } else if (['entrBefInCtqlYcnt', 'entrBefInCtqlMcnt', 'entrAftCtqlYcnt', 'entrAftCtqlMcnt'].includes(field)) {
        getTotalCarrMonths('Ctql');
      }
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center" 
      style={{ 
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-[95%] h-[95%] max-w-[1400px] max-h-[900px] overflow-hidden flex flex-col">
        <div className="popup-wrapper h-full flex flex-col">
      {/* ?�단 ?�더 */}
      <div className="popup-header">
        <h3 className="popup-title">경력개월??계산</h3>
        <button className="popup-close" type="button" onClick={onClose}>×</button>
      </div>

      {/* 본문 ?�역 */}
      <div className="popup-body">
        {/* 조회부 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr className="search-tr">
                <th className="search-th w-[80px]">구분</th>
                <td className="search-td w-[150px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-full" 
                    value={carrData.ownOutsDiv === '1' ? '?�사' : '?�주'}
                    readOnly
                  />
                </td>
                <th className="search-th w-[80px]">?�명</th>
                <td className="search-td w-[150px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-full" 
                    value={carrData.empNm}
                    readOnly
                  />
                </td>
                <th className="search-th w-[80px]">?�사?�자</th>
                <td className="search-td w-[150px]">
                  <input 
                    type="date" 
                    className="input-base input-calender w-full" 
                    value={carrData.entrDt ? carrData.entrDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                    readOnly
                  />
                </td>
                <th className="search-th w-[80px]">최종?�력</th>
                <td className="search-td w-[150px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-full" 
                    value={carrData.lastAdbgDiv}
                    readOnly
                  />
                </td>
              </tr>
              <tr className="search-tr">
                <th className="search-th">?�격�?/th>
                <td className="search-td">
                  <select 
                    className="combo-base w-full"
                    value={carrData.ctqlCd}
                    onChange={(e) => handleInputChange('ctqlCd', e.target.value)}
                  >
                    <option value="">?�택?�세??/option>
                    {commonCodes.ctqlCd.map(code => (
                      <option key={code.codeId || code.data} value={code.codeId || code.data}>{code.codeNm || code.label}</option>
                    ))}
                  </select>
                </td>
                <th className="search-th">?�격취득??/th>
                <td className="search-td">
                  <input 
                    type="date" 
                    className="input-base input-calender w-full" 
                    value={carrData.ctqlPurDt ? carrData.ctqlPurDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                    onChange={(e) => handleInputChange('ctqlPurDt', e.target.value.replace(/-/g, ''))}
                  />
                </td>
                <th className="search-th">최초?�입?�자</th>
                <td className="search-td">
                  <input 
                    type="date" 
                    className="input-base input-calender w-full" 
                    value={carrData.fstInDt ? carrData.fstInDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                    onChange={(e) => handleInputChange('fstInDt', e.target.value.replace(/-/g, ''))}
                  />
                </td>
                <th className="search-th">최종철수?�자</th>
                <td className="search-td">
                  <input 
                    type="date" 
                    className="input-base input-calender w-full" 
                    value={carrData.lastEndDt ? carrData.lastEndDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                    onChange={(e) => handleInputChange('lastEndDt', e.target.value.replace(/-/g, ''))}
                  />
                </td>
                <td className="search-td float-right">
                  <button 
                    className="btn-base btn-act"
                    onClick={handleCarrCalc}
                    disabled={isLoading}
                  >
                    {isLoading ? '계산�?..' : '계산'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 경력 ?�이�?*/}
        <div className="mt-4">
          <div className="tit_area">
            <h3>
              경력 <span className="text-[13px] font-normal gap-2">(최초?�입?�에??기�???최종철수?�자)까�???개월??</span>
            </h3>
            <div className="flex items-center gap-2">
              <div className="">기�???/div>
              <input 
                type="date" 
                className="input-base input-calender w-[150px]" 
                value={carrData.carrCalcStndDt ? carrData.carrCalcStndDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
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
                    value={carrData.entrBefInYcnt}
                    onChange={(e) => handleInputChange('entrBefInYcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrBefInYcnt === false}
                  /> ??' '}
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.entrBefInMcnt}
                    onChange={(e) => handleInputChange('entrBefInMcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrBefInMcnt === false}
                  /> 개월
                </td>
                <td className="form-td">
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.entrAftYcnt}
                    onChange={(e) => handleInputChange('entrAftYcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrAftYcnt === false}
                  /> ??' '}
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.entrAftMcnt}
                    onChange={(e) => handleInputChange('entrAftMcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrAftMcnt === false}
                  /> 개월
                </td>
                <td className="form-td">
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.carrYcnt}
                    onChange={(e) => handleInputChange('carrYcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).carrYcnt === false}
                  /> ??' '}
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.carrMcnt}
                    onChange={(e) => handleInputChange('carrMcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).carrMcnt === false}
                  /> 개월
                </td>
                                  <td className="form-td">
                    <input 
                      className="input-base w-full"
                      value={carrData.tcnGrd}
                      readOnly
                    />
                  </td>
              </tr>
              <tr>
                <th className="form-th text-left">기술?�격기�?</th>
                <td className="form-td">
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.entrBefInCtqlYcnt}
                    onChange={(e) => handleInputChange('entrBefInCtqlYcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrBefInCtqlYcnt === false}
                  /> ??' '}
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.entrBefInCtqlMcnt}
                    onChange={(e) => handleInputChange('entrBefInCtqlMcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrBefInCtqlMcnt === false}
                  /> 개월
                </td>
                <td className="form-td">
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.entrAftCtqlYcnt}
                    onChange={(e) => handleInputChange('entrAftCtqlYcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrAftCtqlYcnt === false}
                  /> ??' '}
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.entrAftCtqlMcnt}
                    onChange={(e) => handleInputChange('entrAftCtqlMcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrAftCtqlMcnt === false}
                  /> 개월
                </td>
                <td className="form-td">
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.carrCtqlYcnt}
                    onChange={(e) => handleInputChange('carrCtqlYcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).carrCtqlYcnt === false}
                  /> ??' '}
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.carrCtqlMcnt}
                    onChange={(e) => handleInputChange('carrCtqlMcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).carrCtqlMcnt === false}
                  /> 개월
                </td>
                                  <td className="form-td">
                    <input 
                      className="input-base w-full"
                      value={carrData.ctqlTcnGrd}
                      readOnly
                    />
                  </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-3">
            <p className="text-[13px] text-[#00509A] py-1">
              {newFlag 
                ? '??경력계산 결과 조회 ??[?�인]버튼???�릭?�니?? [취소]�??�택?�면 경력??반영?��? ?�습?�다.'
                : '??[경력?�??버튼???�릭?�면 ?�로?�트 경력?�항�??�?�됩?�다.'
              }
            </p>
            <div className="flex gap-2">
              <button 
                className="btn-base btn-act"
                onClick={handleConfirm}
              >
                {newFlag ? '?�인' : '경력?�??}
              </button>
              <button 
                className="btn-base btn-delete"
                onClick={onClose}
              >
                취소
              </button>
            </div>
          </div>

          {/* ?�단 ?�역 - ?�규/?�정 모드???�라 ?�르�??�시 */}
          {newFlag ? <PSM1052D00 /> : <PSM1051D00 empNo={carrData.empNo} />}
        </div>
      </div>
    </div>
  </div>
  </div>
  );

  // Portal???�용?�서 body??직접 ?�더�?
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return null;
}

