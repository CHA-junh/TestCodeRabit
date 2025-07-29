'use client';

import React, { useState, useRef } from 'react';

/**
 * 팝업 테스트 페이지
 * COMZ070P00, COMZ080P00, COMZ030P00 팝업 컴포넌트 테스트용
 */
const PopupTestPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedPrice, setSelectedPrice] = useState<any>(null);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);

  /**
   * 팝업 열기 함수
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
      
      // 팝업이 로드된 후 데이터 전송
      popup.onload = () => {
        setTimeout(() => {
          sendDataToPopup(popup, popupType);
        }, 500);
      };
    }
  };

  /**
   * 팝업에 데이터 전송
   */
  const sendDataToPopup = (popup: Window, popupType: string) => {
    const testData = getTestData(popupType);
    
    popup.postMessage({
      type: getMessageType(popupType),
      data: testData
    }, '*');
  };

  /**
   * 메시지 타입 반환
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
   * 테스트 데이터 반환
   */
  const getTestData = (popupType: string) => {
    switch (popupType) {
      case 'COMZ070P00':
        return {
          empNm: '홍%',
          empList: [
            {
              LIST_NO: "1",
              OWN_OUTS_NM: "자사",
              EMP_NM: "홍길동",
              EMP_NO: "EMP001",
              DUTY_CD_NM: "사원",
              TCN_GRD_NM: "초급",
              PARTY_NM: "ITO사업본부/DP",
              BSN_NM: "현대해상 채널통합판매시스템 구축",
              EXEC_IN_STRT_DT: "2012/05/16",
              EXEC_IN_END_DT: "2012/06/22",
              RMK: "",
              HQ_DIV_CD: "HQ001",
              DEPT_DIV_CD: "DEPT001"
            },
            {
              LIST_NO: "2",
              OWN_OUTS_NM: "자사",
              EMP_NM: "홍철수",
              EMP_NO: "EMP002",
              DUTY_CD_NM: "과장",
              TCN_GRD_NM: "중급",
              PARTY_NM: "서비스사업본부",
              BSN_NM: "KB캐피탈 자동차 TM시스템 구축",
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
          empNm: '성부뜰',
          ownOutDiv: '1',
          empList: [
            {
              LIST_NO: "1",
              OWN_OUTS_NM: "자사",
              EMP_NM: "성부뜰",
              EMP_NO: "EMP001",
              DUTY_CD_NM: "부장",
              TCN_GRD_NM: "특급",
              PARTY_NM: "SI사업본부",
              ENTR_DT: "2024/07/01",
              EXEC_IN_STRT_DT: "2024/08/01",
              EXEC_IN_END_DT: "2025/01/01",
              WKG_ST_DIV_NM: "재직",
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
   * 메시지 수신 처리
   */
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('부모창 - 메시지 수신:', event.data);
      
      if (event.data?.type === 'EMP_SELECTED') {
        setSelectedEmployee(event.data.data);
        console.log('직원 선택됨:', event.data.data);
      } else if (event.data?.type === 'PRICE_SELECTED') {
        setSelectedPrice(event.data.data);
        console.log('단가 선택됨:', event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">팝업 테스트 페이지</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* COMZ070P00 테스트 */}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">COMZ070P00 - 직원 검색 (기본)</h2>
          <p className="text-sm text-gray-600 mb-4">
            기본 직원 검색 팝업 테스트
          </p>
          <button
            onClick={() => openPopup('COMZ070P00')}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            팝업 열기
          </button>
        </div>

        {/* COMZ080P00 테스트 */}
        <div className="border rounded-lg p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-4">COMZ080P00 - 직원 검색 (확장)</h2>
          <p className="text-sm text-gray-600 mb-4">
            확장 직원 검색 팝업 테스트 (자사/외주 구분, 퇴사자포함)
          </p>
          <button
            onClick={() => openPopup('COMZ080P00')}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            팝업 열기
          </button>
        </div>

        {/* COMZ030P00 테스트 */}
        <div className="border rounded-lg p-6 bg-purple-50">
          <h2 className="text-xl font-semibold mb-4">COMZ030P00 - 등급별 단가</h2>
          <p className="text-sm text-gray-600 mb-4">
            등급별 단가 조회 팝업 테스트
          </p>
          <button
            onClick={() => openPopup('COMZ030P00')}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
          >
            팝업 열기
          </button>
        </div>
      </div>

      {/* 선택 결과 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 직원 선택 결과 */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">선택된 직원 정보</h3>
          {selectedEmployee ? (
            <pre className="text-sm bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(selectedEmployee, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">직원을 선택해주세요.</p>
          )}
        </div>

        {/* 단가 선택 결과 */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">선택된 단가 정보</h3>
          {selectedPrice ? (
            <pre className="text-sm bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(selectedPrice, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">단가를 선택해주세요.</p>
          )}
        </div>
      </div>

      {/* 사용법 안내 */}
      <div className="mt-8 p-6 bg-yellow-50 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">사용법</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>위의 버튼 중 하나를 클릭하여 팝업을 엽니다.</li>
          <li>팝업이 열리면 부모창에서 테스트 데이터가 자동으로 전송됩니다.</li>
          <li>팝업에서 항목을 더블클릭하여 선택합니다.</li>
          <li>선택된 정보가 아래 결과 영역에 표시됩니다.</li>
          <li>브라우저 개발자 도구(F12)의 Console에서 로그를 확인할 수 있습니다.</li>
        </ol>
      </div>
    </div>
  );
};

export default PopupTestPage; 