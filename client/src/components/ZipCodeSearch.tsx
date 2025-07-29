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
    // Daum ?�편번호 ?�비???�크립트 로드
    const loadDaumPostcodeScript = () => {
      if (window.daum) return; // ?��? 로드??경우

      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => {
        console.log('Daum ?�편번호 ?�비???�크립트 로드 ?�료');
      };
      script.onerror = () => {
        console.error('Daum ?�편번호 ?�비???�크립트 로드 ?�패');
      };
      document.head.appendChild(script);
      scriptRef.current = script;
    };

    loadDaumPostcodeScript();

    // 컴포?�트 ?�마?�트 ???�크립트 ?�거
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && window.daum) {
      // ?�업 ?�치 계산 (?�면 중앙)
      const width = 500;
      const height = 600;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);

      new window.daum.Postcode({
        oncomplete: function(data: any) {
          // ?�업?�서 검?�결�???��???�릭?�을???�행??코드
          let addr = ''; // 주소 변??
          let extraAddr = ''; // 참고??�� 변??

          // ?�용?��? ?�택??주소 ?�?�에 ?�라 ?�당 주소 값을 가?�온??
          if (data.userSelectedType === 'R') { // ?�용?��? ?�로�?주소�??�택?�을 경우
            addr = data.roadAddress;
          } else { // ?�용?��? 지�?주소�??�택?�을 경우(J)
            addr = data.jibunAddress;
          }

          // ?�용?��? ?�택??주소가 ?�로�??�?�일??참고??��??조합?�다.
          if (data.userSelectedType === 'R') {
            // 법정?�명???�을 경우 추�??�다. (법정리는 ?�외)
            // 법정?�의 경우 마�?�?문자가 "??�?가"�??�난??
            if (data.bname !== '' && /[??�?가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            // 건물명이 ?�고, 공동주택??경우 추�??�다.
            if (data.buildingName !== '' && data.apartment === 'Y') {
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // ?�시??참고??��???�을 경우, 괄호까�? 추�???최종 문자?�을 만든??
            if (extraAddr !== '') {
              extraAddr = ' (' + extraAddr + ')';
            }
            // 조합??참고??��???�당 ?�드???�는??
            addr += extraAddr;
          }

          // ?�편번호?� 주소 ?�보�??�당 ?�드???�는??
          const zipCode = data.zonecode;
          const fullAddress = addr;

          onSelect(zipCode, fullAddress);
          onClose();
        },
        onclose: function(state: any) {
          // ?�용?��? 검??결과�??�택?��? ?�고 ?�업???�았????
          if (state === 'FORCE_CLOSE') {
            onClose();
          } else if (state === 'COMPLETE_CLOSE') {
            // 검??결과�??�택?�을 ?�는 oncomplete?�서 처리??
          }
        },
        width: width,
        height: height
      }).open({
        left: left,
        top: top,
        popupTitle: '?�편번호 검??,
        popupKey: 'postcode-popup'
      });
    }
  }, [isOpen, onSelect, onClose]);

  // ?�업???�려?�을 ?�는 �?div�??�더�?(?�제 ?�업?� Daum ?�비?�에??처리)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">?�편번호 검??/h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <div className="text-center text-gray-500 py-8">
          Daum ?�편번호 ?�비???�업???�립?�다...
        </div>
        <div className="mt-4 text-xs text-gray-500">
          * Daum ?�편번호 ?�비?��? ?�용?�니??
        </div>
      </div>
    </div>
  );
} 


