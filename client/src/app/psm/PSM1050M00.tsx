'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import '../common/common.css';
import PSM1051D00 from './PSM1051D00';
import PSM1052D00 from './PSM1052D00';

// ?€???•ì˜
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
  // ê²½ë ¥ ê³„ì‚° ê²°ê³¼
  entrBefInYcnt: string;
  entrBefInMcnt: string;
  entrAftYcnt: string;
  entrAftMcnt: string;
  carrYcnt: string;
  carrMcnt: string;
  tcnGrd: string;
  tcnGrdCd: string;
  // ê¸°ìˆ ?ê²©ê¸°ì? ê²½ë ¥
  entrBefInCtqlYcnt: string;
  entrBefInCtqlMcnt: string;
  entrAftCtqlYcnt: string;
  entrAftCtqlMcnt: string;
  carrCtqlYcnt: string;
  carrCtqlMcnt: string;
  ctqlTcnGrd: string;
  ctqlTcnGrdCd: string;
  // ê¸°í?
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
  newFlag?: boolean; // PSM1020M00??newFlag?€ ?™ì¼
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
  
  // AS-IS MXML???€??ë³€?˜ë“¤ê³??™ì¼
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

  // ì´ˆê¸°??
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

  // AS-IS MXMLê³??™ì¼: ?”ë©´ ë¡œë“œ ???ë™ ê²½ë ¥ê³„ì‚°/?„ë¡œ?„ê²½??ì¡°íšŒ
  useEffect(() => {
    if (employeeData && carrData.empNo) {
      // AS-IS MXML??initComplete ë¡œì§ê³??™ì¼
      if (newFlag === false) {
        // ?˜ì • ?±ë¡ ?? ?„ë¡œ??ê²½ë ¥ ì¡°íšŒ ??ê²½ë ¥ê³„ì‚°???¤í–‰
        loadProfileCareerAndCalc();
      } else {
        // ? ê·œ ?±ë¡ ?? ê²½ë ¥ê³„ì‚° ?¤í–‰
        handleCarrCalc();
      }
    }
  }, [carrData.empNo, newFlag]);

  // ?„ë¡œ??ê²½ë ¥ ì¡°íšŒ ??ê²½ë ¥ê³„ì‚° ?¤í–‰
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
          // result.data??ë°°ì—´?´ë?ë¡?ì²?ë²ˆì§¸ ?”ì†Œë¥??¬ìš©
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          // ê²½ë ¥ê³„ì‚° ?¤í–‰
          handleCarrCalc();
          
          // ? ì§œ ?•ì‹ ë³€?? "2025/07/31" ??"20250731"
          const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            // "2025/07/31" ?•íƒœë¥?"20250731"ë¡?ë³€??
            return dateStr.replace(/\//g, '');
          };

          setCarrData(prev => ({
            ...prev,
            carrCalcStndDt: formatDate(data?.CALC_STAD_DT || ''),
            // ?™ë ¥ê¸°ì? ê²½ë ¥ ê³„ì‚°
            entrBefInYcnt: String(Math.floor(Number(data?.BEF_M_CNT || 0) / 12)),
            entrBefInMcnt: String((Number(data?.BEF_M_CNT || 0) - Math.floor(Number(data?.BEF_M_CNT || 0) / 12) * 12)),
            entrAftYcnt: String(Math.floor(Number(data?.AFT_M_CNT || 0) / 12)),
            entrAftMcnt: String((Number(data?.AFT_M_CNT || 0) - Math.floor(Number(data?.AFT_M_CNT || 0) / 12) * 12)),
            carrYcnt: String(Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12)),
            carrMcnt: String(((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) - Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12) * 12)),
            tcnGrd: data?.TCN_GRD_NM || '',
            tcnGrdCd: data?.TCN_GRD || '',
            // ê¸°ìˆ ?ê²©ê¸°ì? ê²½ë ¥ ê³„ì‚°
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
      
      // ?„ë¡œ??ê²½ë ¥ ì¡°íšŒ ?„ë£Œ (ê²½ë ¥ê³„ì‚°?€ ë³„ë„ë¡??¤í–‰?˜ì? ?ŠìŒ)
    } catch (error) {
      console.error('?„ë¡œ??ê²½ë ¥ ì¡°íšŒ ?¤íŒ¨:', error);
    }
  };

  // AS-IS MXML??fnChangeAfterCarrCalc ?¨ìˆ˜?€ ?™ì¼???„ë¡œ??ê²½ë ¥ ì¡°íšŒ
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
          // result.data??ë°°ì—´?´ë?ë¡?ì²?ë²ˆì§¸ ?”ì†Œë¥??¬ìš©
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          // AS-IS MXML??carrCalcHandler ë¡œì§ê³??™ì¼???°ì´??ì²˜ë¦¬
          if (!data) {
            console.log('?±ë¡???„ë¡œ???´ì—­???†ìŠµ?ˆë‹¤.');
            return;
          }

          // ? ì§œ ?•ì‹ ë³€?? "2025/07/31" ??"20250731"
          const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            // "2025/07/31" ?•íƒœë¥?"20250731"ë¡?ë³€??
            return dateStr.replace(/\//g, '');
          };

          setCarrData(prev => ({
            ...prev,
            carrCalcStndDt: formatDate(data?.CALC_STAD_DT || ''),
            // ?™ë ¥ê¸°ì? ê²½ë ¥ ê³„ì‚°
            entrBefInYcnt: String(Math.floor(Number(data?.BEF_M_CNT || 0) / 12)),
            entrBefInMcnt: String((Number(data?.BEF_M_CNT || 0) - Math.floor(Number(data?.BEF_M_CNT || 0) / 12) * 12)),
            entrAftYcnt: String(Math.floor(Number(data?.AFT_M_CNT || 0) / 12)),
            entrAftMcnt: String((Number(data?.AFT_M_CNT || 0) - Math.floor(Number(data?.AFT_M_CNT || 0) / 12) * 12)),
            carrYcnt: String(Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12)),
            carrMcnt: String(((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) - Math.floor((Number(data?.BEF_M_CNT || 0) + Number(data?.AFT_M_CNT || 0)) / 12) * 12)),
            tcnGrd: data?.TCN_GRD_NM || '',
            tcnGrdCd: data?.TCN_GRD || '',
            // ê¸°ìˆ ?ê²©ê¸°ì? ê²½ë ¥ ê³„ì‚°
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
      console.error('?„ë¡œ??ê²½ë ¥ ì¡°íšŒ ?¤íŒ¨:', error);
    }
  };

  // ê³µí†µì½”ë“œ ë¡œë“œ
  const loadCommonCodes = async () => {
    try {
      const [ctqlResponse, tcnGrdResponse] = await Promise.all([
        fetch('/api/common/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ largeCategoryCode: '013' }) // ?ê²©ì¦?
        }),
        fetch('/api/common/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ largeCategoryCode: '104' }) // ê¸°ìˆ ?±ê¸‰
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
      console.error('ê³µí†µì½”ë“œ ë¡œë“œ ?¤íŒ¨:', error);
    }
  };

  // AS-IS MXML??onBtnClickCarrCalc ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
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
          // result.data??ë°°ì—´?´ë?ë¡?ì²?ë²ˆì§¸ ?”ì†Œë¥??¬ìš©
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          
          const updatedData = {
            ...carrData,
            // ?™ë ¥ê¸°ì? ê²½ë ¥
            entrBefInYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_Y || 0) : '0',
            entrBefInMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_M || 0) : '0',
            entrAftYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_AFT_Y || 0) : '0',
            entrAftMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_AFT_M || 0) : '0',
            carrYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CARR_YEAR || 0) : String(data?.OUTS_CARR_Y || 0),
            carrMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CARR_MONTH || 0) : String(data?.OUTS_CARR_M || 0),
            tcnGrd: data?.OWN_OUTS_DIV === '1' ? (data?.TCN_GRD_NM || '') : (data?.OUTS_TCN_GRD_NM || ''),
            tcnGrdCd: data?.OWN_OUTS_DIV === '1' ? (data?.TCN_GRD || '') : (data?.OUTS_TCN_GRD || ''),
            // ê¸°ìˆ ?ê²©ê¸°ì? ê²½ë ¥
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
                    
          // ê²½ë ¥ê³„ì‚° ê²°ê³¼ ?‹íŒ… ???ë™ ê³„ì‚° ë¹„í™œ?±í™”
          setIsAutoCalcEnabled(false);
          setCarrData(updatedData);

          // AS-IS MXMLê³??™ì¼: ê³„ì‚°??ì¢…ë£Œ?????…ë ¥??ê²½ë ¥?°ì´??Save
          setSavedData({
            entrBefInYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_Y || 0) : '0',
            entrBefInMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.ENTR_BEF_M || 0) : '0',
            entrBefCtqlInYcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_BEF_Y || 0) : '0',
            entrBefCtqlInMcnt: data?.OWN_OUTS_DIV === '1' ? String(data?.CTQL_BEF_M || 0) : '0'
          });
        } else {
          console.error('ê²½ë ¥ê³„ì‚° ?¤íŒ¨:', result.message);
        }
      }
    } catch (error) {
      console.error('ê²½ë ¥ê³„ì‚° ?¤íŒ¨:', error);
      showToast('ê²½ë ¥ê³„ì‚° ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // AS-IS MXML??isCheckInputValidation ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const validateInput = (): boolean => {
    if (!carrData.fstInDt) {
      showToast('ìµœì´ˆ?¬ì…?¼ìë¥??…ë ¥?˜ì‹­?œìš”.', 'warning');
      return false;
    }
    
    if (carrData.ownOutsDiv === '2' && !carrData.lastEndDt) {
      showToast('ìµœì¢…ì² ìˆ˜?¼ìë¥??…ë ¥?˜ì‹­?œìš”.', 'warning');
      return false;
    }
    
    return true;
  };

  // AS-IS MXML??onBtnConfirmClick ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const handleConfirm = async () => {
    // ?´ë²¤???¸ì¶œ - ?°ì´???ì„±
    const confirmData = makeConfirmData();
    
    // 2013.10.01 ?¬ì›?•ë³´??ê²½ë ¥ ê°±ì‹ 
    if (newFlag === false) {
      // ?˜ì • ?±ë¡ ?? ê²½ë ¥?€???¤í–‰
      await fnUpdateCarr();
    }
    
    // ?°ì´??ë°˜í™˜ ë°??ì—… ?«ê¸°
    onConfirm(confirmData);
    //onClose();
  };

  // AS-IS MXML??fnUpdateCarr ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
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
          carrDivCd: arrD[11],        // ê²½ë ¥êµ¬ë¶„ì½”ë“œ (1:?™ë ¥, 2:ê¸°ìˆ ?ê²©)
          lastTcnGrd: arrD[10],       // ê¸°ìˆ ?±ê¸‰ì½”ë“œ
          carrMcnt: getCarrMCnt(arrD[7], arrD[8]), // ê²½ë ¥ê°œì›”??
          adbgCarrMcnt: arrD[14],     // ?™ë ¥ê²½ë ¥ê°œì›”??
          ctqlCarrMcnt: arrD[15],     // ?ê²©ê²½ë ¥ê°œì›”??
          entrBefAdbgCarr: arrD[17],  // ?…ì‚¬?„í•™?¥ê²½?¥ê°œ?”ìˆ˜
          entrBefCtqlCarr: arrD[18],  // ?…ì‚¬?„ìê²©ê²½?¥ê°œ?”ìˆ˜
          userId: user?.userId || 'system' // ë¡œê·¸?¸ì‚¬?©ì (?¤ì œ ?¸ì…˜?ì„œ ê°€?¸ì˜´)
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('ê²½ë ¥?€???‘ë‹µ:', result);
        if (result.success) {
          showToast('?€?¥ë˜?ˆìŠµ?ˆë‹¤.', 'info');
        } else {
          showToast(result.message || '?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.', 'error');
        }
      } else {
        console.error('HTTP ?¤ë¥˜:', response.status, response.statusText);
        showToast(`?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤. (${response.status})`, 'error');
      }
    } catch (error) {
      console.error('ê²½ë ¥?€???¤íŒ¨:', error);
      showToast('ê²½ë ¥?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
    }
  };

  // AS-IS MXML??fnMakeCinfirmData ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const makeConfirmData = (): string => {
    let strData = '';
    // AS-IS MXML??CommMethods.SlashDel() ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      return dateStr.replace(/-/g, ''); // YYYY-MM-DD ??YYYYMMDD
    };
    
    strData += '^' + formatDate(carrData.fstInDt);
    strData += '^' + formatDate(carrData.lastEndDt);
    
    if (carrData.ctqlTcnGrdCd) {
      if (Number(carrData.tcnGrdCd) < Number(carrData.ctqlTcnGrdCd)) {
        // ?ê²©ì¦ì´ ?ˆê³  ?™ë ¥ê¸°ì? ?±ê¸‰???’ìœ¼ë©??™ë ¥ê¸°ì? ê²½ë ¥
        strData += '^' + carrData.entrBefInYcnt;
        strData += '^' + carrData.entrBefInMcnt;
        strData += '^' + carrData.entrAftYcnt;
        strData += '^' + carrData.entrAftMcnt;
        strData += '^' + carrData.carrYcnt;
        strData += '^' + carrData.carrMcnt;
        strData += '^' + carrData.tcnGrd;
        strData += '^' + carrData.tcnGrdCd;
        strData += '^1'; // ê²½ë ¥ê¸°ì?-?™ë ¥
      } else if (Number(carrData.tcnGrdCd) === Number(carrData.ctqlTcnGrdCd)) {
        // ?ê²©ì¦ì´ ?ˆê³  ?™ë ¥ê¸°ì??±ê¸‰ê³?ê¸°ìˆ ?ê²©?±ê¸‰???™ì¼?˜ë©´ ê²½ë ¥??ë§ì? ê²ƒìœ¼ë¡?
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
          strData += '^1'; // ê²½ë ¥ê¸°ì?-?™ë ¥
        } else {
          strData += '^' + carrData.entrBefInCtqlYcnt;
          strData += '^' + carrData.entrBefInCtqlMcnt;
          strData += '^' + carrData.entrAftCtqlYcnt;
          strData += '^' + carrData.entrAftCtqlMcnt;
          strData += '^' + carrData.carrCtqlYcnt;
          strData += '^' + carrData.carrCtqlMcnt;
          strData += '^' + carrData.ctqlTcnGrd;
          strData += '^' + carrData.ctqlTcnGrdCd;
          strData += '^2'; // ê²½ë ¥ê¸°ì?-ê¸°ìˆ ?ê²©
        }
      } else {
        // ?ê²©ì¦ì´ ?ˆê³  ê¸°ìˆ ?ê²©ê¸°ì??±ê¸‰???’ìœ¼ë©?ê¸°ìˆ ?ê²©ê¸°ì? ê²½ë ¥
        strData += '^' + carrData.entrBefInCtqlYcnt;
        strData += '^' + carrData.entrBefInCtqlMcnt;
        strData += '^' + carrData.entrAftCtqlYcnt;
        strData += '^' + carrData.entrAftCtqlMcnt;
        strData += '^' + carrData.carrCtqlYcnt;
        strData += '^' + carrData.carrCtqlMcnt;
        strData += '^' + carrData.ctqlTcnGrd;
        strData += '^' + carrData.ctqlTcnGrdCd;
        strData += '^2'; // ê²½ë ¥ê¸°ì?-ê¸°ìˆ ?ê²©
      }
    } else {
      // ?ê²©ì¦ì´ ?†ì„ ê²½ìš°
      strData += '^' + carrData.entrBefInYcnt;
      strData += '^' + carrData.entrBefInMcnt;
      strData += '^' + carrData.entrAftYcnt;
      strData += '^' + carrData.entrAftMcnt;
      strData += '^' + carrData.carrYcnt;
      strData += '^' + carrData.carrMcnt;
      strData += '^' + carrData.tcnGrd;
      strData += '^' + carrData.tcnGrdCd;
      strData += '^1'; // ê²½ë ¥ê¸°ì?-?™ë ¥
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

  // AS-IS MXML??getCarrMCnt ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const getCarrMCnt = (strYCnt: string, strMCnt: string): string => {
    const nYcnt = parseInt(strYCnt) || 0;
    const nMCnt = parseInt(strMCnt) || 0;
    return String((nYcnt * 12) + nMCnt);
  };

  // AS-IS MXML??getTotalCarrMonths ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const getTotalCarrMonths = (sKb: string) => {
    if (sKb === 'Adbg') { // ?™ë ¥ê¸°ì? ê²½ë ¥
      const adbgCarrMonths = Number(getCarrMCnt(carrData.entrBefInYcnt, carrData.entrBefInMcnt)) +
                             Number(getCarrMCnt(carrData.entrAftYcnt, carrData.entrAftMcnt));
      setCarrData(prev => ({
        ...prev,
        carrYcnt: String(Math.floor(adbgCarrMonths / 12)),
        carrMcnt: String(adbgCarrMonths - Math.floor(adbgCarrMonths / 12) * 12)
      }));
    } else if (sKb === 'Ctql') { // ê¸°ìˆ ?ê²©ê¸°ì? ê²½ë ¥
      const ctqlCarrMonths = Number(getCarrMCnt(carrData.entrBefInCtqlYcnt, carrData.entrBefInCtqlMcnt)) +
                             Number(getCarrMCnt(carrData.entrAftCtqlYcnt, carrData.entrAftCtqlMcnt));
      setCarrData(prev => ({
        ...prev,
        carrCtqlYcnt: String(Math.floor(ctqlCarrMonths / 12)),
        carrCtqlMcnt: String(ctqlCarrMonths - Math.floor(ctqlCarrMonths / 12) * 12)
      }));
    }
    
    // ê¸°ìˆ ?±ê¸‰ ?ë™ ê³„ì‚°
    getTcnGrd(sKb);
  };

  // AS-IS MXML??getTcnGrd ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const getTcnGrd = (sKb: string) => {
    if (sKb === 'Adbg') {
      const carrMonths = Number(getCarrMCnt(carrData.carrYcnt, carrData.carrMcnt));
      
      if (carrData.lastAdbgDivCd === '04') { // ?„ë¬¸?™ì‚¬
        if (carrMonths < 108) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: 'ì´ˆê¸‰' }));
        } else if (carrMonths < 108 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: 'ì¤‘ê¸‰' }));
        } else if (carrMonths < 108 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: 'ê³ ê¸‰' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '?¹ê¸‰' }));
        }
      } else if (carrData.lastAdbgDivCd === '03') { // ?™ì‚¬
        if (carrMonths < 72) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: 'ì´ˆê¸‰' }));
        } else if (carrMonths < 72 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: 'ì¤‘ê¸‰' }));
        } else if (carrMonths < 72 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: 'ê³ ê¸‰' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '?¹ê¸‰' }));
        }
      } else if (carrData.lastAdbgDivCd === '02') { // ?ì‚¬
        if (carrMonths < 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: 'ì´ˆê¸‰' }));
        } else if (carrMonths < 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: 'ì¤‘ê¸‰' }));
        } else if (carrMonths < 36 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: 'ê³ ê¸‰' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '?¹ê¸‰' }));
        }
      } else if (carrData.lastAdbgDivCd === '01') { // ë°•ì‚¬
        if (carrMonths < 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: 'ê³ ê¸‰' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '?¹ê¸‰' }));
        }
      } else if (carrData.lastAdbgDivCd === '05') { // ê³ ì¡¸
        if (carrMonths < 144) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '4', tcnGrd: 'ì´ˆê¸‰' }));
        } else if (carrMonths < 144 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '3', tcnGrd: 'ì¤‘ê¸‰' }));
        } else if (carrMonths < 144 + 36 + 36) {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '2', tcnGrd: 'ê³ ê¸‰' }));
        } else {
          setCarrData(prev => ({ ...prev, tcnGrdCd: '1', tcnGrd: '?¹ê¸‰' }));
        }
      }
    } else if (sKb === 'Ctql') {
      const ctqlCarrMonths = Number(getCarrMCnt(carrData.carrCtqlYcnt, carrData.carrCtqlMcnt));

      if (carrData.ctqlCd === '01') { // ê¸°ì‚¬
        if (ctqlCarrMonths < 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '4', ctqlTcnGrd: 'ì´ˆê¸‰' }));
        } else if (ctqlCarrMonths < 36 + 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '3', ctqlTcnGrd: 'ì¤‘ê¸‰' }));
        } else if (ctqlCarrMonths < 36 + 36 + 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '2', ctqlTcnGrd: 'ê³ ê¸‰' }));
        } else {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '1', ctqlTcnGrd: '?¹ê¸‰' }));
        }
      } else if (carrData.ctqlCd === '02') { // ?°ì—…ê¸°ì‚¬
        if (ctqlCarrMonths < 84) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '4', ctqlTcnGrd: 'ì´ˆê¸‰' }));
        } else if (ctqlCarrMonths < 84 + 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '3', ctqlTcnGrd: 'ì¤‘ê¸‰' }));
        } else if (ctqlCarrMonths < 84 + 36 + 36) {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '2', ctqlTcnGrd: 'ê³ ê¸‰' }));
        } else {
          setCarrData(prev => ({ ...prev, ctqlTcnGrdCd: '1', ctqlTcnGrd: '?¹ê¸‰' }));
        }
      }
    }
  };

  // AS-IS MXML??setEnableInputData ?¨ìˆ˜?€ ?™ì¼??ë¡œì§
  const setEnableInputData = (ownOutsCd: string) => {
    if (ownOutsCd === '1') {
      // ?ì‚¬??ê²½ìš°: ?…ì‚¬???…ì‚¬??ê²½ë ¥ ?…ë ¥ ê°€?? ?©ê³„???½ê¸°?„ìš©
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
      // ?¸ì£¼??ê²½ìš°: ?…ì‚¬???…ì‚¬??ê²½ë ¥ ?…ë ¥ ë¶ˆê?, ?©ê³„ë§??…ë ¥ ê°€??
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

    // ?¬ìš©?ê? ì§ì ‘ ?…ë ¥ ?„ë“œë¥?ë³€ê²½í•˜ë©??ë™ ê³„ì‚° ?œì„±??
    if (!isAutoCalcEnabled && ['entrBefInYcnt', 'entrBefInMcnt', 'entrAftYcnt', 'entrAftMcnt', 'entrBefInCtqlYcnt', 'entrBefInCtqlMcnt', 'entrAftCtqlYcnt', 'entrAftCtqlMcnt'].includes(field)) {
      setIsAutoCalcEnabled(true);
    }

    // ?ë™ ê³„ì‚°???œì„±?”ëœ ê²½ìš°?ë§Œ ?ë™ ê³„ì‚° ?¤í–‰
    if (isAutoCalcEnabled) {
      // AS-IS MXMLê³??™ì¼: ê²½ë ¥ê°œì›”??ë³€ê²????ë™ ê³„ì‚°
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
      {/* ?ë‹¨ ?¤ë” */}
      <div className="popup-header">
        <h3 className="popup-title">ê²½ë ¥ê°œì›”??ê³„ì‚°</h3>
        <button className="popup-close" type="button" onClick={onClose}>Ã—</button>
      </div>

      {/* ë³¸ë¬¸ ?ì—­ */}
      <div className="popup-body">
        {/* ì¡°íšŒë¶€ */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr className="search-tr">
                <th className="search-th w-[80px]">êµ¬ë¶„</th>
                <td className="search-td w-[150px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-full" 
                    value={carrData.ownOutsDiv === '1' ? '?ì‚¬' : '?¸ì£¼'}
                    readOnly
                  />
                </td>
                <th className="search-th w-[80px]">?±ëª…</th>
                <td className="search-td w-[150px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-full" 
                    value={carrData.empNm}
                    readOnly
                  />
                </td>
                <th className="search-th w-[80px]">?…ì‚¬?¼ì</th>
                <td className="search-td w-[150px]">
                  <input 
                    type="date" 
                    className="input-base input-calender w-full" 
                    value={carrData.entrDt ? carrData.entrDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                    readOnly
                  />
                </td>
                <th className="search-th w-[80px]">ìµœì¢…?™ë ¥</th>
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
                <th className="search-th">?ê²©ì¦?/th>
                <td className="search-td">
                  <select 
                    className="combo-base w-full"
                    value={carrData.ctqlCd}
                    onChange={(e) => handleInputChange('ctqlCd', e.target.value)}
                  >
                    <option value="">? íƒ?˜ì„¸??/option>
                    {commonCodes.ctqlCd.map(code => (
                      <option key={code.codeId || code.data} value={code.codeId || code.data}>{code.codeNm || code.label}</option>
                    ))}
                  </select>
                </td>
                <th className="search-th">?ê²©ì·¨ë“??/th>
                <td className="search-td">
                  <input 
                    type="date" 
                    className="input-base input-calender w-full" 
                    value={carrData.ctqlPurDt ? carrData.ctqlPurDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                    onChange={(e) => handleInputChange('ctqlPurDt', e.target.value.replace(/-/g, ''))}
                  />
                </td>
                <th className="search-th">ìµœì´ˆ?¬ì…?¼ì</th>
                <td className="search-td">
                  <input 
                    type="date" 
                    className="input-base input-calender w-full" 
                    value={carrData.fstInDt ? carrData.fstInDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : ''}
                    onChange={(e) => handleInputChange('fstInDt', e.target.value.replace(/-/g, ''))}
                  />
                </td>
                <th className="search-th">ìµœì¢…ì² ìˆ˜?¼ì</th>
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
                    {isLoading ? 'ê³„ì‚°ì¤?..' : 'ê³„ì‚°'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ê²½ë ¥ ?Œì´ë¸?*/}
        <div className="mt-4">
          <div className="tit_area">
            <h3>
              ê²½ë ¥ <span className="text-[13px] font-normal gap-2">(ìµœì´ˆ?¬ì…?¼ì—??ê¸°ì???ìµœì¢…ì² ìˆ˜?¼ì)ê¹Œì???ê°œì›”??</span>
            </h3>
            <div className="flex items-center gap-2">
              <div className="">ê¸°ì???/div>
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
                    value={carrData.entrBefInYcnt}
                    onChange={(e) => handleInputChange('entrBefInYcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrBefInYcnt === false}
                  /> ??' '}
                  <input 
                    className="input-base !w-[50px]" 
                    value={carrData.entrBefInMcnt}
                    onChange={(e) => handleInputChange('entrBefInMcnt', e.target.value)}
                    disabled={setEnableInputData(carrData.ownOutsDiv).entrBefInMcnt === false}
                  /> ê°œì›”
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
                  /> ê°œì›”
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
                  /> ê°œì›”
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
                <th className="form-th text-left">ê¸°ìˆ ?ê²©ê¸°ì?</th>
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
                  /> ê°œì›”
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
                  /> ê°œì›”
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
                  /> ê°œì›”
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
                ? '??ê²½ë ¥ê³„ì‚° ê²°ê³¼ ì¡°íšŒ ??[?•ì¸]ë²„íŠ¼???´ë¦­?©ë‹ˆ?? [ì·¨ì†Œ]ë¥?? íƒ?˜ë©´ ê²½ë ¥??ë°˜ì˜?˜ì? ?ŠìŠµ?ˆë‹¤.'
                : '??[ê²½ë ¥?€??ë²„íŠ¼???´ë¦­?˜ë©´ ?„ë¡œ?íŠ¸ ê²½ë ¥?¬í•­ë§??€?¥ë©?ˆë‹¤.'
              }
            </p>
            <div className="flex gap-2">
              <button 
                className="btn-base btn-act"
                onClick={handleConfirm}
              >
                {newFlag ? '?•ì¸' : 'ê²½ë ¥?€??}
              </button>
              <button 
                className="btn-base btn-delete"
                onClick={onClose}
              >
                ì·¨ì†Œ
              </button>
            </div>
          </div>

          {/* ?˜ë‹¨ ?ì—­ - ? ê·œ/?˜ì • ëª¨ë“œ???°ë¼ ?¤ë¥´ê²??œì‹œ */}
          {newFlag ? <PSM1052D00 /> : <PSM1051D00 empNo={carrData.empNo} />}
        </div>
      </div>
    </div>
  </div>
  </div>
  );

  // Portal???¬ìš©?´ì„œ body??ì§ì ‘ ?Œë”ë§?
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return null;
}

