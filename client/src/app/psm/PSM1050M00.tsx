'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import '../common/common.css';
import PSM1051D00 from './PSM1051D00';
import PSM1052D00 from './PSM1052D00';

// 타입 정의
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
  // 기술자격기준 경력
  entrBefInCtqlYcnt: string;
  entrBefInCtqlMcnt: string;
  entrAftCtqlYcnt: string;
  entrAftCtqlMcnt: string;
  carrCtqlYcnt: string;
  carrCtqlMcnt: string;
  ctqlTcnGrd: string;
  ctqlTcnGrdCd: string;
  // 기타
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
  newFlag?: boolean; // PSM1020M00의 newFlag와 동일
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
  
  // AS-IS MXML의 저장 변수들과 동일
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

  // 초기화
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

  // AS-IS MXML과 동일: 화면 로드 시 자동 경력계산/프로필경력 조회
  useEffect(() => {
    if (employeeData && carrData.empNo) {
      // AS-IS MXML의 initComplete 로직과 동일
      if (newFlag === false) {
        // 수정 등록 시: 프로필 경력 조회 후 경력계산도 실행
        loadProfileCareerAndCalc();
      } else {
        // 신규 등록 시: 경력계산 실행
        handleCarrCalc();
      }
    }
  }, [carrData.empNo, newFlag]);

  // 프로필 경력 조회 후 경력계산 실행
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
          // result.data는 배열이므로 첫 번째 요소를 사용
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          // 경력계산 실행
          handleCarrCalc();
          
          // 날짜 형식 변환: "2025/07/31" → "20250731"
          const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            // "2025/07/31" 형태를 "20250731"로 변환
            return dateStr.replace(/\//g, '');
          };

          setCarrData(prev => ({
            ...prev,
            carrCalcStndDt: formatDate(data?.CALC_STAD_DT || ''),
            // 학력기준 경력 계산
            entrBefInYcnt: String(Math.floor(Number(data?.BEF_M_CNT || 0) / 12)),
            entrBefInMcnt: String((Number(data?.BEF_M_CNT || 0) - Math.floor(Number(data?.BEF_M_CNT || 0) / 12) * 12)),
            entrAftYcnt: String(Math.floor(Number(data?.AFT_M_CNT || 0) / 12)),
            entrAftMcnt: String((Number(data?.AFT_M_CNT || 0) - Math.floor(Number(data?.AFT_M_CNT || 0) / 12) * 12)),
            carrYcnt: String(Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12)),
            carrMcnt: String(((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) - Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12) * 12)),
            tcnGrd: data?.TCN_GRD_NM || '',
            tcnGrdCd: data?.TCN_GRD || '',
            // 기술자격기준 경력 계산
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
      
      // 프로필 경력 조회 완료 (경력계산은 별도로 실행하지 않음)
    } catch (error) {
      console.error('프로필 경력 조회 실패:', error);
    }
  };

  // AS-IS MXML의 fnChangeAfterCarrCalc 함수와 동일한 프로필 경력 조회
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
          // result.data는 배열이므로 첫 번째 요소를 사용
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          // AS-IS MXML의 carrCalcHandler 로직과 동일한 데이터 처리
          if (!data) {
            console.log('등록된 프로필 내역이 없습니다.');
            return;
          }

          // 날짜 형식 변환: "2025/07/31" → "20250731"
          const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            // "2025/07/31" 형태를 "20250731"로 변환
            return dateStr.replace(/\//g, '');
          };

          setCarrData(prev => ({
            ...prev,
            carrCalcStndDt: formatDate(data?.CALC_STAD_DT || ''),
            // 학력기준 경력 계산
            entrBefInYcnt: String(Math.floor(Number(data?.BEF_M_CNT || 0) / 12)),
            entrBefInMcnt: String((Number(data?.BEF_M_CNT || 0) - Math.floor(Number(data?.BEF_M_CNT || 0) / 12) * 12)),
            entrAftYcnt: String(Math.floor(Number(data?.AFT_M_CNT || 0) / 12)),
            entrAftMcnt: String((Number(data?.AFT_M_CNT || 0) - Math.floor(Number(data?.AFT_M_CNT || 0) / 12) * 12)),
            carrYcnt: String(Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12)),
            carrMcnt: String(((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) - Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12) * 12)),
            tcnGrd: data?.TCN_GRD_NM || '',
            tcnGrdCd: data?.TCN_GRD || '',
            // 기술자격기준 경력 계산
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
      console.error('프로필 경력 조회 실패:', error);
    }
  };

  // 공통코드 로드
  const loadCommonCodes = async () => {
    try {
      const [ctqlResponse, tcnGrdResponse] = await Promise.all([
        fetch('/api/common/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ largeCategoryCode: '013' }) // 자격증
        }),
        fetch('/api/common/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ largeCategoryCode: '104' }) // 기술등급
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
      console.error('공통코드 로드 실패:', error);
    }
  };

  // AS-IS MXML의 onBtnClickCarrCalc 함수와 동일한 로직
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
          // result.data는 배열이므로 첫 번째 요소를 사용
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          const updatedData = {
            ...carrData,
            // 학력기준 경력
            entrBefInYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_Y || 0) : '0',
            entrBefInMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_M || 0) : '0',
            entrAftYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_AFT_Y || 0) : '0',
            entrAftMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_AFT_M || 0) : '0',
            carrYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CARR_YEAR || 0) : String(data?.OUTS_CARR_Y || 0),
            carrMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CARR_MONTH || 0) : String(data?.OUTS_CARR_M || 0),
            tcnGrd: data?.OWN_OUTS_DIV === '1' ? (data?.TCN_GRD_NM || '') : (data?.OUTS_TCN_GRD_NM || ''),
            tcnGrdCd: data?.OWN_OUTS_DIV === '1' ? (data?.TCN_GRD || '') : (data?.OUTS_TCN_GRD || ''),
            // 기술자격기준 경력
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
                    
          // 경력계산 결과 셋팅 후 자동 계산 비활성화
          setIsAutoCalcEnabled(false);
          setCarrData(updatedData);

          // AS-IS MXML과 동일: 계산이 종료될 때 입력전 경력데이터 Save
          setSavedData({
            entrBefInYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_Y || 0) : '0',
            entrBefInMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_M || 0) : '0',
            entrBefCtqlInYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_BEF_Y || 0) : '0',
            entrBefCtqlInMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_BEF_M || 0) : '0'
          });
        } else {
          console.error('경력계산 실패:', result.message);
        }
      }
    } catch (error) {
      console.error('경력계산 실패:', error);
      showToast('경력계산 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // AS-IS MXML의 isCheckInputValidation 함수와 동일한 로직
  const validateInput = (): boolean => {
    if (!carrData.fstInDt) {
      showToast('최초투입일자를 입력하십시요.', 'warning');
      return false;
    }
    
    if (carrData.ownOutsDiv === '2' && !carrData.lastEndDt) {
      showToast('최종철수일자를 입력하십시요.', 'warning');
      return false;
    }
    
    return true;
  };

  // AS-IS MXML의 onBtnConfirmClick 함수와 동일한 로직
  const handleConfirm = async () => {
    // 이벤트 호출 - 데이터 생성
    const confirmData = makeConfirmData();
    
    // 2013.10.01 사원정보의 경력 갱신
    if (newFlag === false) {
      // 수정 등록 시: 경력저장 실행
      await fnUpdateCarr();
    }
    
    // 데이터 반환 및 팝업 닫기
    onConfirm(confirmData);
    //onClose();
  };

  // AS-IS MXML의 fnUpdateCarr 함수와 동일한 로직
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
          carrDivCd: arrD[11],        // 경력구분코드 (1:학력, 2:기술자격)
          lastTcnGrd: arrD[10],       // 기술등급코드
          carrMcnt: getCarrMCnt(arrD[7], arrD[8]), // 경력개월수
          adbgCarrMcnt: arrD[14],     // 학력경력개월수
          ctqlCarrMcnt: arrD[15],     // 자격경력개월수
          entrBefAdbgCarr: arrD[17],  // 입사전학력경력개월수
          entrBefCtqlCarr: arrD[18],  // 입사전자격경력개월수
          userId: user?.userId || 'system' // 로그인사용자 (실제 세션에서 가져옴)
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('경력저장 응답:', result);
        if (result.success) {
          showToast('저장되었습니다.', 'info');
        } else {
          showToast(result.message || '저장에 실패했습니다.', 'error');
        }
      } else {
        console.error('HTTP 오류:', response.status, response.statusText);
        showToast(`저장에 실패했습니다. (${response.status})`, 'error');
      }
    } catch (error) {
      console.error('경력저장 실패:', error);
      showToast('경력저장 중 오류가 발생했습니다.', 'error');
    }
  };

  // AS-IS MXML의 fnMakeCinfirmData 함수와 동일한 로직
  const makeConfirmData = (): string => {
    let strData = '';
    // AS-IS MXML의 CommMethods.SlashDel() 함수와 동일한 로직
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      return dateStr.replace(/-/g, ''); // YYYY-MM-DD → YYYYMMDD
    };
    
    strData += '^' + formatDate(carrData.fstInDt);
    strData += '^' + formatDate(carrData.lastEndDt);
    
    if (carrData.ctqlTcnGrdCd) {
      if (Number(carrData.tcnGrdCd) < Number(carrData.ctqlTcnGrdCd)) {
        // 자격증이 있고 학력기준 등급이 높으면 학력기준 경력
        strData += '^' + carrData.entrBefInYcnt;
        strData += '^' + carrData.entrBefInMcnt;
        strData += '^' + carrData.entrAftYcnt;
        strData += '^' + carrData.entrAftMcnt;
        strData += '^' + carrData.carrYcnt;
        strData += '^' + carrData.carrMcnt;
        strData += '^' + carrData.tcnGrd;
        strData += '^' + carrData.tcnGrdCd;
        strData += '^1'; // 경력기준-학력
      } else if (Number(carrData.tcnGrdCd) === Number(carrData.ctqlTcnGrdCd)) {
        // 자격증이 있고 학력기준등급과 기술자격등급이 동일하면 경력이 많은 것으로
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
          strData += '^1'; // 경력기준-학력
        } else {
          strData += '^' + carrData.entrBefInCtqlYcnt;
          strData += '^' + carrData.entrBefInCtqlMcnt;
          strData += '^' + carrData.entrAftCtqlYcnt;
          strData += '^' + carrData.entrAftCtqlMcnt;
          strData += '^' + carrData.carrCtqlYcnt;
          strData += '^' + carrData.carrCtqlMcnt;
          strData += '^' + carrData.ctqlTcnGrd;
          strData += '^' + carrData.ctqlTcnGrdCd;
          strData += '^2'; // 경력기준-기술자격
        }
      } else {
        // 자격증이 있고 기술자격기준등급이 높으면 기술자격기준 경력
        strData += '^' + carrData.entrBefInCtqlYcnt;
        strData += '^' + carrData.entrBefInCtqlMcnt;
        strData += '^' + carrData.entrAftCtqlYcnt;
        strData += '^' + carrData.entrAftCtqlMcnt;
        strData += '^' + carrData.carrCtqlYcnt;
        strData += '^' + carrData.carrCtqlMcnt;
        strData += '^' + carrData.ctqlTcnGrd;
        strData += '^' + carrData.ctqlTcnGrdCd;
        strData += '^2'; // 경력기준-기술자격
      }
    } else {
      // 자격증이 없을 경우
      strData += '^' + carrData.entrBefInYcnt;
      strData += '^' + carrData.entrBefInMcnt;
      strData += '^' + carrData.entrAftYcnt;
      strData += '^' + carrData.entrAftMcnt;
      strData += '^' + carrData.carrYcnt;
      strData += '^' + carrData.carrMcnt;
      strData += '^' + carrData.tcnGrd;
      strData += '^' + carrData.tcnGrdCd;
      strData += '^1'; // 경력기준-학력
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

  // AS-IS MXML의 getCarrMCnt 함수와 동일한 로직
  const getCarrMCnt = (strYCnt: string, strMCnt: string): string => {
    const nYcnt = parseInt(strYCnt) || 0;
    const nMCnt = parseInt(strMCnt) || 0;
    return String((nYcnt * 12) + nMCnt);
  };

  // AS-IS MXML의 getTotalCarrMonths 함수와 동일한 로직
  const getTotalCarrMonths = (sKb: string) => {
    if (sKb === 'Adbg') { // 학력기준 경력
      const adbgCarrMonths = Number(getCarrMCnt(carrData.entrBefInYcnt, carrData.entrBefInMcnt)) +
                             Number(getCarrMCnt(carrData.entrAftYcnt, carrData.entrAftMcnt));
      setCarrData(prev => ({
        ...prev,
        carrYcnt: String(Math.floor(adbgCarrMonths / 12)),
        carrMcnt: String(adbgCarrMonths - Math.floor(adbgCarrMonths / 12) * 12)
      }));
    } else if (sKb === 'Ctql') { // 기술자격기준 경력
      const ctqlCarrMonths = Number(getCarrMCnt(carrData.entrBefInCtqlYcnt, carrData.entrBefInCtqlMcnt)) +
                             Number(getCarrMCnt(carrData.entrAftCtqlYcnt, carrData.entrAftCtqlMcnt));
      setCarrData(prev => ({
        ...prev,
        carrCtqlYcnt: String(Math.floor(ctqlCarrMonths / 12)),
        carrCtqlMcnt: String(ctqlCarrMonths - Math.floor(ctqlCarrMonths / 12) * 12)
      }));
    }
    
    // 기술등급 자동 계산
    getTcnGrd(sKb);
  };

  // AS-IS MXML의 getTcnGrd 함수와 동일한 로직
  const getTcnGrd = (sKb: string) => {
    if (sKb === 'Adbg') {
      const carrMonths = Number(getCarrMCnt(carrData.carrYcnt, carrData.carrMcnt));
      
      if (carrData.lastAdbgDivCd === '04') { // 전문학사
        if (carrMonths < 108) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: '초급' }));
        } else if (carrMonths < 108 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: '중급' }));
        } else if (carrMonths < 108 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '특급' }));
        }
      } else if (carrData.lastAdbgDivCd === '03') { // 학사
        if (carrMonths < 72) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: '초급' }));
        } else if (carrMonths < 72 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: '중급' }));
        } else if (carrMonths < 72 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '특급' }));
        }
      } else if (carrData.lastAdbgDivCd === '02') { // 석사
        if (carrMonths < 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: '초급' }));
        } else if (carrMonths < 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: '중급' }));
        } else if (carrMonths < 36 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '특급' }));
        }
      } else if (carrData.lastAdbgDivCd === '01') { // 박사
        if (carrMonths < 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '특급' }));
        }
      } else if (carrData.lastAdbgDivCd === '05') { // 고졸
        if (carrMonths < 144) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: '초급' }));
        } else if (carrMonths < 144 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: '중급' }));
        } else if (carrMonths < 144 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '특급' }));
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
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '1', ctqlTcnGrd: '특급' }));
        }
      } else if (carrData.ctqlCd === '02') { // 산업기사
        if (ctqlCarrMonths < 84) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '4', ctqlTcnGrd: '초급' }));
        } else if (ctqlCarrMonths < 84 + 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '3', ctqlTcnGrd: '중급' }));
        } else if (ctqlCarrMonths < 84 + 36 + 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '2', ctqlTcnGrd: '고급' }));
        } else {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '1', ctqlTcnGrd: '특급' }));
        }
      }
    }
  };

  // AS-IS MXML의 setEnableInputData 함수와 동일한 로직
  const setEnableInputData = (ownOutsCd: string) => {
    if (ownOutsCd === '1') {
      // 자사일 경우: 입사전/입사후 경력 입력 가능, 합계는 읽기전용
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
      // 외주일 경우: 입사전/입사후 경력 입력 불가, 합계만 입력 가능
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

    // 사용자가 직접 입력 필드를 변경하면 자동 계산 활성화
    if (!isAutoCalcEnabled && ['entrBefInYcnt', 'entrBefInMcnt', 'entrAftYcnt', 'entrAftMcnt', 'entrBefInCtqlYcnt', 'entrBefInCtqlMcnt', 'entrAftCtqlYcnt', 'entrAftCtqlMcnt'].includes(field)) {
      setIsAutoCalcEnabled(true);
    }

    // 자동 계산이 활성화된 경우에만 자동 계산 실행
    if (isAutoCalcEnabled) {
      // AS-IS MXML과 동일: 경력개월수 변경 시 자동 계산
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
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">경력개월수 계산</h3>
        <button className="popup-close" type="button" onClick={onClose}>×</button>
      </div>

      {/* 본문 영역 */}
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
                    value={carrData.ownOutsDiv === '1' ? '자사' : '외주'}
                    readOnly
                  />
                </td>
                <th className="search-th w-[80px]">성명</th>
                <td className="search-td w-[150px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-full" 
                    value={carrData.empNm}
                    readOnly
                  />
                </td>
                <th className="search-th w-[80px]">입사일자</th>
                <td className="search-td w-[150px]">
                  <input 
                    type="date" 
                    className="input-base input-calender w-full" 
                    value={carrData.entrDt ? carrData.entrDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                    readOnly
                  />
                </td>
                <th className="search-th w-[80px]">최종학력</th>
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
                <th className="search-th">자격증</th>
                <td className="search-td">
                  <select 
                    className="combo-base w-full"
                    value={carrData.ctqlCd}
                    onChange={(e) => handleInputChange('ctqlCd', e.target.value)}
                  >
                    <option value="">선택하세요</option>
                    {commonCodes.ctqlCd.map(code => (
                      <option key={code.codeId || code.data} value={code.codeId || code.data}>{code.codeNm || code.label}</option>
                    ))}
                  </select>
                </td>
                <th className="search-th">자격취득일</th>
                <td className="search-td">
                  <input 
                    type="date" 
                    className="input-base input-calender w-full" 
                    value={carrData.ctqlPurDt ? carrData.ctqlPurDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                    onChange={(e) => handleInputChange('ctqlPurDt', e.target.value.replace(/-/g, ''))}
                  />
                </td>
                <th className="search-th">최초투입일자</th>
                <td className="search-td">
                  <input 
                    type="date" 
                    className="input-base input-calender w-full" 
                    value={carrData.fstInDt ? carrData.fstInDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                    onChange={(e) => handleInputChange('fstInDt', e.target.value.replace(/-/g, ''))}
                  />
                </td>
                <th className="search-th">최종철수일자</th>
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
                    {isLoading ? '계산중...' : '계산'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 경력 테이블 */}
        <div className="mt-4">
          <div className="tit_area">
            <h3>
              경력 <span className="text-[13px] font-normal gap-2">(최초투입일에서 기준일(최종철수일자)까지의 개월수)</span>
            </h3>
            <div className="flex items-center gap-2">
              <div className="">기준일</div>
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
                    value={carrData.entrBefInYcnt}
                    onChange={(e) => handleInputChange('entrBefInYcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrBefInYcnt === false}
                  /> 년{' '}
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
                  /> 년{' '}
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
                  /> 년{' '}
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
                <th className="form-th text-left">기술자격기준</th>
                <td className="form-td">
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.entrBefInCtqlYcnt}
                    onChange={(e) => handleInputChange('entrBefInCtqlYcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrBefInCtqlYcnt === false}
                  /> 년{' '}
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
                  /> 년{' '}
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
                  /> 년{' '}
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
                ? '※ 경력계산 결과 조회 후 [확인]버튼을 클릭합니다. [취소]를 선택하면 경력이 반영되지 않습니다.'
                : '※ [경력저장]버튼을 클릭하면 프로젝트 경력사항만 저장됩니다.'
              }
            </p>
            <div className="flex gap-2">
              <button 
                className="btn-base btn-act"
                onClick={handleConfirm}
              >
                {newFlag ? '확인' : '경력저장'}
              </button>
              <button 
                className="btn-base btn-delete"
                onClick={onClose}
              >
                취소
              </button>
            </div>
          </div>

          {/* 하단 영역 - 신규/수정 모드에 따라 다르게 표시 */}
          {newFlag ? <PSM1052D00 /> : <PSM1051D00 empNo={carrData.empNo} />}
        </div>
      </div>
    </div>
  </div>
  </div>
  );

  // Portal을 사용해서 body에 직접 렌더링
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return null;
}