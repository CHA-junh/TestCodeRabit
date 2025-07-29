'use client';

import React, { useState, useRef } from 'react';

/**
 * ?�업 ?�스???�이지
 * COMZ070P00, COMZ080P00, COMZ030P00 ?�업 컴포?�트 ?�스?�용
 */
const PopupTestPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedPrice, setSelectedPrice] = useState<any>(null);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);

  /**
   * ?�업 ?�기 ?�수
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
      
      // ?�업??로드?????�이???�송
      popup.onload = () => {
        setTimeout(() => {
          sendDataToPopup(popup, popupType);
        }, 500);
      };
    }
  };

  /**
   * ?�업???�이???�송
   */
  const sendDataToPopup = (popup: Window, popupType: string) => {
    const testData = getTestData(popupType);
    
    popup.postMessage({
      type: getMessageType(popupType),
      data: testData
    }, '*');
  };

  /**
   * 메시지 ?�??반환
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
   * ?�스???�이??반환
   */
  const getTestData = (popupType: string) => {
    switch (popupType) {
      case 'COMZ070P00':
        return {
          empNm: '??',
          empList: [
            {
              LIST_NO: "1",
              OWN_OUTS_NM: "?�사",
              EMP_NM: "?�길??,
              EMP_NO: "EMP001",
              DUTY_CD_NM: "?�원",
              TCN_GRD_NM: "초급",
              PARTY_NM: "ITO?�업본�?/DP",
              BSN_NM: "?��??�상 채널?�합?�매?�스??구축",
              EXEC_IN_STRT_DT: "2012/05/16",
              EXEC_IN_END_DT: "2012/06/22",
              RMK: "",
              HQ_DIV_CD: "HQ001",
              DEPT_DIV_CD: "DEPT001"
            },
            {
              LIST_NO: "2",
              OWN_OUTS_NM: "?�사",
              EMP_NM: "?�철??,
              EMP_NO: "EMP002",
              DUTY_CD_NM: "과장",
              TCN_GRD_NM: "중급",
              PARTY_NM: "?�비?�사?�본부",
              BSN_NM: "KB캐피???�동�?TM?�스??구축",
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
          empNm: '?��???,
          ownOutDiv: '1',
          empList: [
            {
              LIST_NO: "1",
              OWN_OUTS_NM: "?�사",
              EMP_NM: "?��???,
              EMP_NO: "EMP001",
              DUTY_CD_NM: "부??,
              TCN_GRD_NM: "?�급",
              PARTY_NM: "SI?�업본�?",
              ENTR_DT: "2024/07/01",
              EXEC_IN_STRT_DT: "2024/08/01",
              EXEC_IN_END_DT: "2025/01/01",
              WKG_ST_DIV_NM: "?�직",
              EXEC_ING_BSN_NM: "AICC 구축",
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
   * 메시지 ?�신 처리
   */
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('부모창 - 메시지 ?�신:', event.data);
      
      if (event.data?.type === 'EMP_SELECTED') {
        setSelectedEmployee(event.data.data);
        console.log('직원 ?�택??', event.data.data);
      } else if (event.data?.type === 'PRICE_SELECTED') {
        setSelectedPrice(event.data.data);
        console.log('?��? ?�택??', event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">?�업 ?�스???�이지</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* COMZ070P00 ?�스??*/}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">COMZ070P00 - 직원 검??(기본)</h2>
          <p className="text-sm text-gray-600 mb-4">
            기본 직원 검???�업 ?�스??
          </p>
          <button
            onClick={() => openPopup('COMZ070P00')}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            ?�업 ?�기
          </button>
        </div>

        {/* COMZ080P00 ?�스??*/}
        <div className="border rounded-lg p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-4">COMZ080P00 - 직원 검??(?�장)</h2>
          <p className="text-sm text-gray-600 mb-4">
            ?�장 직원 검???�업 ?�스??(?�사/?�주 구분, ?�사?�포??
          </p>
          <button
            onClick={() => openPopup('COMZ080P00')}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            ?�업 ?�기
          </button>
        </div>

        {/* COMZ030P00 ?�스??*/}
        <div className="border rounded-lg p-6 bg-purple-50">
          <h2 className="text-xl font-semibold mb-4">COMZ030P00 - ?�급�??��?</h2>
          <p className="text-sm text-gray-600 mb-4">
            ?�급�??��? 조회 ?�업 ?�스??
          </p>
          <button
            onClick={() => openPopup('COMZ030P00')}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
          >
            ?�업 ?�기
          </button>
        </div>
      </div>

      {/* ?�택 결과 ?�시 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 직원 ?�택 결과 */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">?�택??직원 ?�보</h3>
          {selectedEmployee ? (
            <pre className="text-sm bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(selectedEmployee, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">직원???�택?�주?�요.</p>
          )}
        </div>

        {/* ?��? ?�택 결과 */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">?�택???��? ?�보</h3>
          {selectedPrice ? (
            <pre className="text-sm bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(selectedPrice, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">?��?�??�택?�주?�요.</p>
          )}
        </div>
      </div>

      {/* ?�용�??�내 */}
      <div className="mt-8 p-6 bg-yellow-50 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">?�용�?/h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>?�의 버튼 �??�나�??�릭?�여 ?�업???�니??</li>
          <li>?�업???�리�?부모창?�서 ?�스???�이?��? ?�동?�로 ?�송?�니??</li>
          <li>?�업?�서 ??��???�블?�릭?�여 ?�택?�니??</li>
          <li>?�택???�보가 ?�래 결과 ?�역???�시?�니??</li>
          <li>브라?��? 개발???�구(F12)??Console?�서 로그�??�인?????�습?�다.</li>
        </ol>
      </div>
    </div>
  );
};

export default PopupTestPage; 

