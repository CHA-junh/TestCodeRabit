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
    // Daum ?°í¸ë²ˆí˜¸ ?œë¹„???¤í¬ë¦½íŠ¸ ë¡œë“œ
    const loadDaumPostcodeScript = () => {
      if (window.daum) return; // ?´ë? ë¡œë“œ??ê²½ìš°

      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => {
        console.log('Daum ?°í¸ë²ˆí˜¸ ?œë¹„???¤í¬ë¦½íŠ¸ ë¡œë“œ ?„ë£Œ');
      };
      script.onerror = () => {
        console.error('Daum ?°í¸ë²ˆí˜¸ ?œë¹„???¤í¬ë¦½íŠ¸ ë¡œë“œ ?¤íŒ¨');
      };
      document.head.appendChild(script);
      scriptRef.current = script;
    };

    loadDaumPostcodeScript();

    // ì»´í¬?ŒíŠ¸ ?¸ë§ˆ?´íŠ¸ ???¤í¬ë¦½íŠ¸ ?œê±°
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && window.daum) {
      // ?ì—… ?„ì¹˜ ê³„ì‚° (?”ë©´ ì¤‘ì•™)
      const width = 500;
      const height = 600;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);

      new window.daum.Postcode({
        oncomplete: function(data: any) {
          // ?ì—…?ì„œ ê²€?‰ê²°ê³???ª©???´ë¦­?ˆì„???¤í–‰??ì½”ë“œ
          let addr = ''; // ì£¼ì†Œ ë³€??
          let extraAddr = ''; // ì°¸ê³ ??ª© ë³€??

          // ?¬ìš©?ê? ? íƒ??ì£¼ì†Œ ?€?…ì— ?°ë¼ ?´ë‹¹ ì£¼ì†Œ ê°’ì„ ê°€?¸ì˜¨??
          if (data.userSelectedType === 'R') { // ?¬ìš©?ê? ?„ë¡œëª?ì£¼ì†Œë¥?? íƒ?ˆì„ ê²½ìš°
            addr = data.roadAddress;
          } else { // ?¬ìš©?ê? ì§€ë²?ì£¼ì†Œë¥?? íƒ?ˆì„ ê²½ìš°(J)
            addr = data.jibunAddress;
          }

          // ?¬ìš©?ê? ? íƒ??ì£¼ì†Œê°€ ?„ë¡œëª??€?…ì¼??ì°¸ê³ ??ª©??ì¡°í•©?œë‹¤.
          if (data.userSelectedType === 'R') {
            // ë²•ì •?™ëª…???ˆì„ ê²½ìš° ì¶”ê??œë‹¤. (ë²•ì •ë¦¬ëŠ” ?œì™¸)
            // ë²•ì •?™ì˜ ê²½ìš° ë§ˆì?ë§?ë¬¸ìê°€ "??ë¡?ê°€"ë¡??ë‚œ??
            if (data.bname !== '' && /[??ë¡?ê°€]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            // ê±´ë¬¼ëª…ì´ ?ˆê³ , ê³µë™ì£¼íƒ??ê²½ìš° ì¶”ê??œë‹¤.
            if (data.buildingName !== '' && data.apartment === 'Y') {
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // ?œì‹œ??ì°¸ê³ ??ª©???ˆì„ ê²½ìš°, ê´„í˜¸ê¹Œì? ì¶”ê???ìµœì¢… ë¬¸ì?´ì„ ë§Œë“ ??
            if (extraAddr !== '') {
              extraAddr = ' (' + extraAddr + ')';
            }
            // ì¡°í•©??ì°¸ê³ ??ª©???´ë‹¹ ?„ë“œ???£ëŠ”??
            addr += extraAddr;
          }

          // ?°í¸ë²ˆí˜¸?€ ì£¼ì†Œ ?•ë³´ë¥??´ë‹¹ ?„ë“œ???£ëŠ”??
          const zipCode = data.zonecode;
          const fullAddress = addr;

          onSelect(zipCode, fullAddress);
          onClose();
        },
        onclose: function(state: any) {
          // ?¬ìš©?ê? ê²€??ê²°ê³¼ë¥?? íƒ?˜ì? ?Šê³  ?ì—…???«ì•˜????
          if (state === 'FORCE_CLOSE') {
            onClose();
          } else if (state === 'COMPLETE_CLOSE') {
            // ê²€??ê²°ê³¼ë¥?? íƒ?ˆì„ ?ŒëŠ” oncomplete?ì„œ ì²˜ë¦¬??
          }
        },
        width: width,
        height: height
      }).open({
        left: left,
        top: top,
        popupTitle: '?°í¸ë²ˆí˜¸ ê²€??,
        popupKey: 'postcode-popup'
      });
    }
  }, [isOpen, onSelect, onClose]);

  // ?ì—…???´ë ¤?ˆì„ ?ŒëŠ” ë¹?divë§??Œë”ë§?(?¤ì œ ?ì—…?€ Daum ?œë¹„?¤ì—??ì²˜ë¦¬)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">?°í¸ë²ˆí˜¸ ê²€??/h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            Ã—
          </button>
        </div>
        <div className="text-center text-gray-500 py-8">
          Daum ?°í¸ë²ˆí˜¸ ?œë¹„???ì—…???´ë¦½?ˆë‹¤...
        </div>
        <div className="mt-4 text-xs text-gray-500">
          * Daum ?°í¸ë²ˆí˜¸ ?œë¹„?¤ë? ?¬ìš©?©ë‹ˆ??
        </div>
      </div>
    </div>
  );
} 


