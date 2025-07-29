'use client';

import React, { useState, useRef } from 'react';

/**
 * ?ì—… ?ŒìŠ¤???˜ì´ì§€
 * COMZ070P00, COMZ080P00, COMZ030P00 ?ì—… ì»´í¬?ŒíŠ¸ ?ŒìŠ¤?¸ìš©
 */
const PopupTestPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedPrice, setSelectedPrice] = useState<any>(null);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);

  /**
   * ?ì—… ?´ê¸° ?¨ìˆ˜
   */
  const openPopup = (popupType: string) => {
    const width = 1000;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      `/popup/com/${popupType}`,
      `${popupType}_popup`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (popup) {
      setPopupWindow(popup);
      
      // ?ì—…??ë¡œë“œ?????°ì´???„ì†¡
      popup.onload = () => {
        setTimeout(() => {
          sendDataToPopup(popup, popupType);
        }, 500);
      };
    }
  };

  /**
   * ?ì—…???°ì´???„ì†¡
   */
  const sendDataToPopup = (popup: Window, popupType: string) => {
    const testData = getTestData(popupType);
    
    popup.postMessage({
      type: getMessageType(popupType),
      data: testData
    }, '*');
  };

  /**
   * ë©”ì‹œì§€ ?€??ë°˜í™˜
   */
  const getMessageType = (popupType: string) => {
    switch (popupType) {
      case 'COMZ070P00':
        return 'CHOICE_EMP_INIT';
      case 'COMZ080P00':
        return 'CHOICE_EMP_INIT';
      case 'COMZ030P00':
        return 'CHOICE_PRICE_INIT';
      default:
        return 'CHOICE_EMP_INIT';
    }
  };

  /**
   * ?ŒìŠ¤???°ì´??ë°˜í™˜
   */
  const getTestData = (popupType: string) => {
    switch (popupType) {
      case 'COMZ070P00':
        return {
          empNm: '??',
          empList: [
            {
              LIST_NO: "1",
              OWN_OUTS_NM: "?ì‚¬",
              EMP_NM: "?ê¸¸??,
              EMP_NO: "EMP001",
              DUTY_CD_NM: "?¬ì›",
              TCN_GRD_NM: "ì´ˆê¸‰",
              PARTY_NM: "ITO?¬ì—…ë³¸ë?/DP",
              BSN_NM: "?„ë??´ìƒ ì±„ë„?µí•©?ë§¤?œìŠ¤??êµ¬ì¶•",
              EXEC_IN_STRT_DT: "2012/05/16",
              EXEC_IN_END_DT: "2012/06/22",
              RMK: "",
              HQ_DIV_CD: "HQ001",
              DEPT_DIV_CD: "DEPT001"
            },
            {
              LIST_NO: "2",
              OWN_OUTS_NM: "?ì‚¬",
              EMP_NM: "?ì² ??,
              EMP_NO: "EMP002",
              DUTY_CD_NM: "ê³¼ì¥",
              TCN_GRD_NM: "ì¤‘ê¸‰",
              PARTY_NM: "?œë¹„?¤ì‚¬?…ë³¸ë¶€",
              BSN_NM: "KBìºí”¼???ë™ì°?TM?œìŠ¤??êµ¬ì¶•",
              EXEC_IN_STRT_DT: "2016/11/03",
              EXEC_IN_END_DT: "2017/01/02",
              RMK: "",
              HQ_DIV_CD: "HQ002",
              DEPT_DIV_CD: "DEPT002"
            }
          ]
        };

      case 'COMZ080P00':
        return {
          empNm: '?±ë???,
          ownOutDiv: '1',
          empList: [
            {
              LIST_NO: "1",
              OWN_OUTS_NM: "?ì‚¬",
              EMP_NM: "?±ë???,
              EMP_NO: "EMP001",
              DUTY_CD_NM: "ë¶€??,
              TCN_GRD_NM: "?¹ê¸‰",
              PARTY_NM: "SI?¬ì—…ë³¸ë?",
              ENTR_DT: "2024/07/01",
              EXEC_IN_STRT_DT: "2024/08/01",
              EXEC_IN_END_DT: "2025/01/01",
              WKG_ST_DIV_NM: "?¬ì§",
              EXEC_ING_BSN_NM: "AICC êµ¬ì¶•",
              HQ_DIV_CD: "HQ001",
              DEPT_DIV_CD: "DEPT001",
              CSF_CO_CD: "CSF001",
              WKG_ST_DIV: "1",
              EXEC_ING_YN: "Y",
              OWN_OUTS_DIV: "1",
              OUTS_FIX_YN: "N",
              IN_FIX_DT: "",
              IN_FIX_PRJT: "",
              DUTY_CD: "DUTY001",
              DUTY_DIV_CD: "DUTY_DIV001",
              TCN_GRD: "TCN001"
            }
          ]
        };

      case 'COMZ030P00':
        return {
          ownOutsDiv: '1',
          year: '2024'
        };

      default:
        return {};
    }
  };

  /**
   * ë©”ì‹œì§€ ?˜ì‹  ì²˜ë¦¬
   */
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('ë¶€ëª¨ì°½ - ë©”ì‹œì§€ ?˜ì‹ :', event.data);
      
      if (event.data?.type === 'EMP_SELECTED') {
        setSelectedEmployee(event.data.data);
        console.log('ì§ì› ? íƒ??', event.data.data);
      } else if (event.data?.type === 'PRICE_SELECTED') {
        setSelectedPrice(event.data.data);
        console.log('?¨ê? ? íƒ??', event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">?ì—… ?ŒìŠ¤???˜ì´ì§€</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* COMZ070P00 ?ŒìŠ¤??*/}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">COMZ070P00 - ì§ì› ê²€??(ê¸°ë³¸)</h2>
          <p className="text-sm text-gray-600 mb-4">
            ê¸°ë³¸ ì§ì› ê²€???ì—… ?ŒìŠ¤??
          </p>
          <button
            onClick={() => openPopup('COMZ070P00')}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            ?ì—… ?´ê¸°
          </button>
        </div>

        {/* COMZ080P00 ?ŒìŠ¤??*/}
        <div className="border rounded-lg p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-4">COMZ080P00 - ì§ì› ê²€??(?•ì¥)</h2>
          <p className="text-sm text-gray-600 mb-4">
            ?•ì¥ ì§ì› ê²€???ì—… ?ŒìŠ¤??(?ì‚¬/?¸ì£¼ êµ¬ë¶„, ?´ì‚¬?í¬??
          </p>
          <button
            onClick={() => openPopup('COMZ080P00')}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            ?ì—… ?´ê¸°
          </button>
        </div>

        {/* COMZ030P00 ?ŒìŠ¤??*/}
        <div className="border rounded-lg p-6 bg-purple-50">
          <h2 className="text-xl font-semibold mb-4">COMZ030P00 - ?±ê¸‰ë³??¨ê?</h2>
          <p className="text-sm text-gray-600 mb-4">
            ?±ê¸‰ë³??¨ê? ì¡°íšŒ ?ì—… ?ŒìŠ¤??
          </p>
          <button
            onClick={() => openPopup('COMZ030P00')}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
          >
            ?ì—… ?´ê¸°
          </button>
        </div>
      </div>

      {/* ? íƒ ê²°ê³¼ ?œì‹œ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ì§ì› ? íƒ ê²°ê³¼ */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">? íƒ??ì§ì› ?•ë³´</h3>
          {selectedEmployee ? (
            <pre className="text-sm bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(selectedEmployee, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">ì§ì›??? íƒ?´ì£¼?¸ìš”.</p>
          )}
        </div>

        {/* ?¨ê? ? íƒ ê²°ê³¼ */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">? íƒ???¨ê? ?•ë³´</h3>
          {selectedPrice ? (
            <pre className="text-sm bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(selectedPrice, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">?¨ê?ë¥?? íƒ?´ì£¼?¸ìš”.</p>
          )}
        </div>
      </div>

      {/* ?¬ìš©ë²??ˆë‚´ */}
      <div className="mt-8 p-6 bg-yellow-50 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">?¬ìš©ë²?/h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>?„ì˜ ë²„íŠ¼ ì¤??˜ë‚˜ë¥??´ë¦­?˜ì—¬ ?ì—…???½ë‹ˆ??</li>
          <li>?ì—…???´ë¦¬ë©?ë¶€ëª¨ì°½?ì„œ ?ŒìŠ¤???°ì´?°ê? ?ë™?¼ë¡œ ?„ì†¡?©ë‹ˆ??</li>
          <li>?ì—…?ì„œ ??ª©???”ë¸”?´ë¦­?˜ì—¬ ? íƒ?©ë‹ˆ??</li>
          <li>? íƒ???•ë³´ê°€ ?„ë˜ ê²°ê³¼ ?ì—­???œì‹œ?©ë‹ˆ??</li>
          <li>ë¸Œë¼?°ì? ê°œë°œ???„êµ¬(F12)??Console?ì„œ ë¡œê·¸ë¥??•ì¸?????ˆìŠµ?ˆë‹¤.</li>
        </ol>
      </div>
    </div>
  );
};

export default PopupTestPage; 

