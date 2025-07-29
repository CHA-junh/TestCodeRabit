'use client';

import React, { useEffect, useState } from 'react';
import PSM0050M00 from './PSM0050M00';
import { useAuth } from '@/modules/auth/hooks/useAuth';

/**
 * PSM0040M00 - ê°œë°œ?„ë¡œ??ê´€ë¦?ë©”ì¸ ?”ë©´
 * 
 * ê°œë°œ?ì˜ ?„ë¡œ???•ë³´ë¥?ê´€ë¦¬í•˜??ë©”ì¸ ?”ë©´?…ë‹ˆ??
 * PSM0050M00 (ê°œë°œ?„ë¡œ???±ë¡ ë°??˜ì •) ?”ë©´???¸ì¶œ?˜ëŠ” ì»¨í…Œ?´ë„ˆ ì»´í¬?ŒíŠ¸ë¡?
 * ì²??¤í”ˆ ??ë³¸ì¸ ?•ë³´ë¥??ë™?¼ë¡œ ?‹íŒ…?˜ê³  ì¡°íšŒê¹Œì? ?˜í–‰?©ë‹ˆ??
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ë³¸ì¸ ?•ë³´ ?ë™ ?‹íŒ… (ë¡œê·¸?¸í•œ ?¬ìš©???•ë³´ ?œìš©)
 * - PSM0050M00 ?”ë©´ ?¸ì¶œ ë°??Œë¼ë¯¸í„° ?„ë‹¬
 * - propsë¡??„ë‹¬ë°›ì? ?¬ì› ?•ë³´ ?°ì„  ?¬ìš©
 * 
 * AS-IS: PSM_03_0100.mxml (ê°œë°œ?„ë¡œ???±ë¡ ë°??˜ì • ë©”ì¸ ?”ë©´)
 * TO-BE: PSM0050M00???¸ì¶œ?˜ëŠ” ?˜í¼ ì»´í¬?ŒíŠ¸
 * 
 * ?¬ìš© ?ˆì‹œ:
 * ```tsx
 * // ë³¸ì¸ ?„ë¡œ??ê´€ë¦??”ë©´ ?´ê¸°
 * <PSM0040M00 />
 * 
 * // ?¹ì • ?¬ì›???„ë¡œ??ê´€ë¦??”ë©´ ?´ê¸°
 * <PSM0040M00 empNo="10001" empNm="?ê¸¸?? />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */

/**
 * PSM0040M00 ì»´í¬?ŒíŠ¸ Props ?¸í„°?˜ì´??
 * 
 * @property {string} [empNo] - ì¡°íšŒ???¬ì›ë²ˆí˜¸ (ë¯¸ì…????ë³¸ì¸ ?•ë³´ ?¬ìš©)
 * @property {string} [empNm] - ì¡°íšŒ???¬ì›ëª?(ë¯¸ì…????ë³¸ì¸ ?•ë³´ ?¬ìš©)
 * @property {any} [key] - ê¸°í? ì¶”ê? ?Œë¼ë¯¸í„°
 */
interface PSM0040M00Props {
  /** ?¬ì›ë²ˆí˜¸ */
  empNo?: string;
  /** ?¬ì›ëª?*/
  empNm?: string;
  /** ê¸°í? ?Œë¼ë¯¸í„° */
  [key: string]: any;
}

/**
 * PSM0040M00 ì»´í¬?ŒíŠ¸
 * 
 * ê°œë°œ?„ë¡œ??ê´€ë¦?ë©”ì¸ ?”ë©´???Œë”ë§í•˜???¨ìˆ˜??ì»´í¬?ŒíŠ¸?…ë‹ˆ??
 * 
 * @param {PSM0040M00Props} props - ì»´í¬?ŒíŠ¸ props
 * @returns {JSX.Element} PSM0040M00 ?”ë©´ JSX
 */
const PSM0040M00: React.FC<PSM0040M00Props> = ({ empNo, empNm, ...otherProps }) => {
  const { user } = useAuth();
  const [autoEmpNo, setAutoEmpNo] = useState<string>('');
  const [autoEmpNm, setAutoEmpNm] = useState<string>('');

  /**
   * ì²??¤í”ˆ ??ë³¸ì¸ ?•ë³´ ?ë™ ?‹íŒ…
   * 
   * propsë¡??„ë‹¬ë°›ì? ?¬ì› ?•ë³´ê°€ ?†ìœ¼ë©??„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©?ì˜ ?•ë³´ë¥??¬ìš©?˜ê³ ,
   * propsë¡??„ë‹¬ë°›ì? ?•ë³´ê°€ ?ˆìœ¼ë©??´ë‹¹ ?•ë³´ë¥??°ì„  ?¬ìš©?©ë‹ˆ??
   * 
   * @param {User} user - ?„ì¬ ë¡œê·¸?¸í•œ ?¬ìš©???•ë³´
   * @param {string} empNo - propsë¡??„ë‹¬ë°›ì? ?¬ì›ë²ˆí˜¸
   * @param {string} empNm - propsë¡??„ë‹¬ë°›ì? ?¬ì›ëª?
   */
  useEffect(() => {
    if (user && !empNo && !empNm) {
      // propsë¡??„ë‹¬ë°›ì? empNo, empNm???†ê³  ë¡œê·¸?¸í•œ ?¬ìš©???•ë³´ê°€ ?ˆìœ¼ë©?ë³¸ì¸ ?•ë³´ ?¬ìš©
      setAutoEmpNo(user.empNo || '');
      setAutoEmpNm(user.name || '');
    } else {
      // propsë¡??„ë‹¬ë°›ì? ?•ë³´ê°€ ?ˆìœ¼ë©??´ë‹¹ ?•ë³´ ?¬ìš©
      setAutoEmpNo(empNo || '');
      setAutoEmpNm(empNm || '');
    }
  }, [user, empNo, empNm]);

  return (
    <div className="w-full h-full">
      <PSM0050M00 
        parentEmpNo={autoEmpNo}
        parentEmpNm={autoEmpNm}
        {...otherProps}
      />
    </div>
  );
};

export default PSM0040M00; 

