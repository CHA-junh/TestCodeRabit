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
    // Daum ?ฐํธ๋ฒํธ ?๋น???คํฌ๋ฆฝํธ ๋ก๋
    const loadDaumPostcodeScript = () => {
      if (window.daum) return; // ?ด๋? ๋ก๋??๊ฒฝ์ฐ

      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => {
        console.log('Daum ?ฐํธ๋ฒํธ ?๋น???คํฌ๋ฆฝํธ ๋ก๋ ?๋ฃ');
      };
      script.onerror = () => {
        console.error('Daum ?ฐํธ๋ฒํธ ?๋น???คํฌ๋ฆฝํธ ๋ก๋ ?คํจ');
      };
      document.head.appendChild(script);
      scriptRef.current = script;
    };

    loadDaumPostcodeScript();

    // ์ปดํฌ?ํธ ?ธ๋ง?ดํธ ???คํฌ๋ฆฝํธ ?๊ฑฐ
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && window.daum) {
      // ?์ ?์น ๊ณ์ฐ (?๋ฉด ์ค์)
      const width = 500;
      const height = 600;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);

      new window.daum.Postcode({
        oncomplete: function(data: any) {
          // ?์?์ ๊ฒ?๊ฒฐ๊ณ???ชฉ???ด๋ฆญ?์???คํ??์ฝ๋
          let addr = ''; // ์ฃผ์ ๋ณ??
          let extraAddr = ''; // ์ฐธ๊ณ ??ชฉ ๋ณ??

          // ?ฌ์ฉ?๊? ? ํ??์ฃผ์ ??์ ?ฐ๋ผ ?ด๋น ์ฃผ์ ๊ฐ์ ๊ฐ?ธ์จ??
          if (data.userSelectedType === 'R') { // ?ฌ์ฉ?๊? ?๋ก๋ช?์ฃผ์๋ฅ?? ํ?์ ๊ฒฝ์ฐ
            addr = data.roadAddress;
          } else { // ?ฌ์ฉ?๊? ์ง๋ฒ?์ฃผ์๋ฅ?? ํ?์ ๊ฒฝ์ฐ(J)
            addr = data.jibunAddress;
          }

          // ?ฌ์ฉ?๊? ? ํ??์ฃผ์๊ฐ ?๋ก๋ช???์ผ??์ฐธ๊ณ ??ชฉ??์กฐํฉ?๋ค.
          if (data.userSelectedType === 'R') {
            // ๋ฒ์ ?๋ช???์ ๊ฒฝ์ฐ ์ถ๊??๋ค. (๋ฒ์ ๋ฆฌ๋ ?์ธ)
            // ๋ฒ์ ?์ ๊ฒฝ์ฐ ๋ง์?๋ง?๋ฌธ์๊ฐ "??๋ก?๊ฐ"๋ก??๋??
            if (data.bname !== '' && /[??๋ก?๊ฐ]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            // ๊ฑด๋ฌผ๋ช์ด ?๊ณ , ๊ณต๋์ฃผํ??๊ฒฝ์ฐ ์ถ๊??๋ค.
            if (data.buildingName !== '' && data.apartment === 'Y') {
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // ?์??์ฐธ๊ณ ??ชฉ???์ ๊ฒฝ์ฐ, ๊ดํธ๊น์? ์ถ๊???์ต์ข ๋ฌธ์?ด์ ๋ง๋ ??
            if (extraAddr !== '') {
              extraAddr = ' (' + extraAddr + ')';
            }
            // ์กฐํฉ??์ฐธ๊ณ ??ชฉ???ด๋น ?๋???ฃ๋??
            addr += extraAddr;
          }

          // ?ฐํธ๋ฒํธ? ์ฃผ์ ?๋ณด๋ฅ??ด๋น ?๋???ฃ๋??
          const zipCode = data.zonecode;
          const fullAddress = addr;

          onSelect(zipCode, fullAddress);
          onClose();
        },
        onclose: function(state: any) {
          // ?ฌ์ฉ?๊? ๊ฒ??๊ฒฐ๊ณผ๋ฅ?? ํ?์? ?๊ณ  ?์???ซ์????
          if (state === 'FORCE_CLOSE') {
            onClose();
          } else if (state === 'COMPLETE_CLOSE') {
            // ๊ฒ??๊ฒฐ๊ณผ๋ฅ?? ํ?์ ?๋ oncomplete?์ ์ฒ๋ฆฌ??
          }
        },
        width: width,
        height: height
      }).open({
        left: left,
        top: top,
        popupTitle: '?ฐํธ๋ฒํธ ๊ฒ??,
        popupKey: 'postcode-popup'
      });
    }
  }, [isOpen, onSelect, onClose]);

  // ?์???ด๋ ค?์ ?๋ ๋น?div๋ง??๋๋ง?(?ค์  ?์? Daum ?๋น?ค์??์ฒ๋ฆฌ)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">?ฐํธ๋ฒํธ ๊ฒ??/h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ร
          </button>
        </div>
        <div className="text-center text-gray-500 py-8">
          Daum ?ฐํธ๋ฒํธ ?๋น???์???ด๋ฆฝ?๋ค...
        </div>
        <div className="mt-4 text-xs text-gray-500">
          * Daum ?ฐํธ๋ฒํธ ?๋น?ค๋? ?ฌ์ฉ?ฉ๋??
        </div>
      </div>
    </div>
  );
} 

