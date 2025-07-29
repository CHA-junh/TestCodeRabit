import React, { useEffect, useRef } from 'react';

interface ZipCodeSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (zipCode: string, address: string) => void;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: any) => {
        open: (options?: any) => void;
        embed: (element: HTMLElement, options?: any) => void;
      };
    };
  }
}

export default function ZipCodeSearch({ isOpen, onClose, onSelect }: ZipCodeSearchProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Daum 우편번호 서비스 스크립트 로드
    const loadDaumPostcodeScript = () => {
      if (window.daum) return; // 이미 로드된 경우

      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => {
        console.log('Daum 우편번호 서비스 스크립트 로드 완료');
      };
      script.onerror = () => {
        console.error('Daum 우편번호 서비스 스크립트 로드 실패');
      };
      document.head.appendChild(script);
      scriptRef.current = script;
    };

    loadDaumPostcodeScript();

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && window.daum) {
      // 팝업 위치 계산 (화면 중앙)
      const width = 500;
      const height = 600;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);

      new window.daum.Postcode({
        oncomplete: function(data: any) {
          // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드
          let addr = ''; // 주소 변수
          let extraAddr = ''; // 참고항목 변수

          // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
          if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
            addr = data.roadAddress;
          } else { // 사용자가 지번 주소를 선택했을 경우(J)
            addr = data.jibunAddress;
          }

          // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
          if (data.userSelectedType === 'R') {
            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== '' && data.apartment === 'Y') {
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (extraAddr !== '') {
              extraAddr = ' (' + extraAddr + ')';
            }
            // 조합된 참고항목을 해당 필드에 넣는다.
            addr += extraAddr;
          }

          // 우편번호와 주소 정보를 해당 필드에 넣는다.
          const zipCode = data.zonecode;
          const fullAddress = addr;

          onSelect(zipCode, fullAddress);
          onClose();
        },
        onclose: function(state: any) {
          // 사용자가 검색 결과를 선택하지 않고 팝업을 닫았을 때
          if (state === 'FORCE_CLOSE') {
            onClose();
          } else if (state === 'COMPLETE_CLOSE') {
            // 검색 결과를 선택했을 때는 oncomplete에서 처리됨
          }
        },
        width: width,
        height: height
      }).open({
        left: left,
        top: top,
        popupTitle: '우편번호 검색',
        popupKey: 'postcode-popup'
      });
    }
  }, [isOpen, onSelect, onClose]);

  // 팝업이 열려있을 때는 빈 div만 렌더링 (실제 팝업은 Daum 서비스에서 처리)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">우편번호 검색</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <div className="text-center text-gray-500 py-8">
          Daum 우편번호 서비스 팝업이 열립니다...
        </div>
        <div className="mt-4 text-xs text-gray-500">
          * Daum 우편번호 서비스를 사용합니다.
        </div>
      </div>
    </div>
  );
} 