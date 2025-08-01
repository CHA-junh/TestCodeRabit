'use client';

import React, { useState, useRef } from 'react';

/**
 * ?μ ?μ€???μ΄μ§
 * COMZ070P00, COMZ080P00, COMZ030P00 ?μ μ»΄ν¬?νΈ ?μ€?Έμ©
 */
const PopupTestPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedPrice, setSelectedPrice] = useState<any>(null);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);

  /**
   * ?μ ?΄κΈ° ?¨μ
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
      
      // ?μ??λ‘λ?????°μ΄???μ‘
      popup.onload = () => {
        setTimeout(() => {
          sendDataToPopup(popup, popupType);
        }, 500);
      };
    }
  };

  /**
   * ?μ???°μ΄???μ‘
   */
  const sendDataToPopup = (popup: Window, popupType: string) => {
    const testData = getTestData(popupType);
    
    popup.postMessage({
      type: getMessageType(popupType),
      data: testData
    }, '*');
  };

  /**
   * λ©μμ§ ???λ°ν
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
   * ?μ€???°μ΄??λ°ν
   */
  const getTestData = (popupType: string) => {
    switch (popupType) {
      case 'COMZ070P00':
        return {
          empNm: '??',
          empList: [
            {
              LIST_NO: "1",
              OWN_OUTS_NM: "?μ¬",
              EMP_NM: "?κΈΈ??,
              EMP_NO: "EMP001",
              DUTY_CD_NM: "?¬μ",
              TCN_GRD_NM: "μ΄κΈ",
              PARTY_NM: "ITO?¬μλ³Έλ?/DP",
              BSN_NM: "?λ??΄μ μ±λ?΅ν©?λ§€?μ€??κ΅¬μΆ",
              EXEC_IN_STRT_DT: "2012/05/16",
              EXEC_IN_END_DT: "2012/06/22",
              RMK: "",
              HQ_DIV_CD: "HQ001",
              DEPT_DIV_CD: "DEPT001"
            },
            {
              LIST_NO: "2",
              OWN_OUTS_NM: "?μ¬",
              EMP_NM: "?μ² ??,
              EMP_NO: "EMP002",
              DUTY_CD_NM: "κ³Όμ₯",
              TCN_GRD_NM: "μ€κΈ",
              PARTY_NM: "?λΉ?€μ¬?λ³ΈλΆ",
              BSN_NM: "KBμΊνΌ???λμ°?TM?μ€??κ΅¬μΆ",
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
          empNm: '?±λ???,
          ownOutDiv: '1',
          empList: [
            {
              LIST_NO: "1",
              OWN_OUTS_NM: "?μ¬",
              EMP_NM: "?±λ???,
              EMP_NO: "EMP001",
              DUTY_CD_NM: "λΆ??,
              TCN_GRD_NM: "?ΉκΈ",
              PARTY_NM: "SI?¬μλ³Έλ?",
              ENTR_DT: "2024/07/01",
              EXEC_IN_STRT_DT: "2024/08/01",
              EXEC_IN_END_DT: "2025/01/01",
              WKG_ST_DIV_NM: "?¬μ§",
              EXEC_ING_BSN_NM: "AICC κ΅¬μΆ",
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
   * λ©μμ§ ?μ  μ²λ¦¬
   */
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('λΆλͺ¨μ°½ - λ©μμ§ ?μ :', event.data);
      
      if (event.data?.type === 'EMP_SELECTED') {
        setSelectedEmployee(event.data.data);
        console.log('μ§μ ? ν??', event.data.data);
      } else if (event.data?.type === 'PRICE_SELECTED') {
        setSelectedPrice(event.data.data);
        console.log('?¨κ? ? ν??', event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">?μ ?μ€???μ΄μ§</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* COMZ070P00 ?μ€??*/}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">COMZ070P00 - μ§μ κ²??(κΈ°λ³Έ)</h2>
          <p className="text-sm text-gray-600 mb-4">
            κΈ°λ³Έ μ§μ κ²???μ ?μ€??
          </p>
          <button
            onClick={() => openPopup('COMZ070P00')}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            ?μ ?΄κΈ°
          </button>
        </div>

        {/* COMZ080P00 ?μ€??*/}
        <div className="border rounded-lg p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-4">COMZ080P00 - μ§μ κ²??(?μ₯)</h2>
          <p className="text-sm text-gray-600 mb-4">
            ?μ₯ μ§μ κ²???μ ?μ€??(?μ¬/?Έμ£Ό κ΅¬λΆ, ?΄μ¬?ν¬??
          </p>
          <button
            onClick={() => openPopup('COMZ080P00')}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            ?μ ?΄κΈ°
          </button>
        </div>

        {/* COMZ030P00 ?μ€??*/}
        <div className="border rounded-lg p-6 bg-purple-50">
          <h2 className="text-xl font-semibold mb-4">COMZ030P00 - ?±κΈλ³??¨κ?</h2>
          <p className="text-sm text-gray-600 mb-4">
            ?±κΈλ³??¨κ? μ‘°ν ?μ ?μ€??
          </p>
          <button
            onClick={() => openPopup('COMZ030P00')}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
          >
            ?μ ?΄κΈ°
          </button>
        </div>
      </div>

      {/* ? ν κ²°κ³Ό ?μ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* μ§μ ? ν κ²°κ³Ό */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">? ν??μ§μ ?λ³΄</h3>
          {selectedEmployee ? (
            <pre className="text-sm bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(selectedEmployee, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">μ§μ??? ν?΄μ£Ό?Έμ.</p>
          )}
        </div>

        {/* ?¨κ? ? ν κ²°κ³Ό */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">? ν???¨κ? ?λ³΄</h3>
          {selectedPrice ? (
            <pre className="text-sm bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(selectedPrice, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">?¨κ?λ₯?? ν?΄μ£Ό?Έμ.</p>
          )}
        </div>
      </div>

      {/* ?¬μ©λ²??λ΄ */}
      <div className="mt-8 p-6 bg-yellow-50 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">?¬μ©λ²?/h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>?μ λ²νΌ μ€??λλ₯??΄λ¦­?μ¬ ?μ???½λ??</li>
          <li>?μ???΄λ¦¬λ©?λΆλͺ¨μ°½?μ ?μ€???°μ΄?°κ? ?λ?Όλ‘ ?μ‘?©λ??</li>
          <li>?μ?μ ??ͺ©???λΈ?΄λ¦­?μ¬ ? ν?©λ??</li>
          <li>? ν???λ³΄κ° ?λ κ²°κ³Ό ?μ­???μ?©λ??</li>
          <li>λΈλΌ?°μ? κ°λ°???κ΅¬(F12)??Console?μ λ‘κ·Έλ₯??μΈ?????μ΅?λ€.</li>
        </ol>
      </div>
    </div>
  );
};

export default PopupTestPage; 

