'use client';

import React, { useEffect, useState } from 'react';
import PSM0050M00 from './PSM0050M00';
import { useAuth } from '@/modules/auth/hooks/useAuth';

/**
 * PSM0040M00 - 개발?�로??관�?메인 ?�면
 * 
 * 개발?�의 ?�로???�보�?관리하??메인 ?�면?�니??
 * PSM0050M00 (개발?�로???�록 �??�정) ?�면???�출?�는 컨테?�너 컴포?�트�?
 * �??�픈 ??본인 ?�보�??�동?�로 ?�팅?�고 조회까�? ?�행?�니??
 * 
 * 주요 기능:
 * - 본인 ?�보 ?�동 ?�팅 (로그?�한 ?�용???�보 ?�용)
 * - PSM0050M00 ?�면 ?�출 �??�라미터 ?�달
 * - props�??�달받�? ?�원 ?�보 ?�선 ?�용
 * 
 * AS-IS: PSM_03_0100.mxml (개발?�로???�록 �??�정 메인 ?�면)
 * TO-BE: PSM0050M00???�출?�는 ?�퍼 컴포?�트
 * 
 * ?�용 ?�시:
 * ```tsx
 * // 본인 ?�로??관�??�면 ?�기
 * <PSM0040M00 />
 * 
 * // ?�정 ?�원???�로??관�??�면 ?�기
 * <PSM0040M00 empNo="10001" empNm="?�길?? />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */

/**
 * PSM0040M00 컴포?�트 Props ?�터?�이??
 * 
 * @property {string} [empNo] - 조회???�원번호 (미입????본인 ?�보 ?�용)
 * @property {string} [empNm] - 조회???�원�?(미입????본인 ?�보 ?�용)
 * @property {any} [key] - 기�? 추�? ?�라미터
 */
interface PSM0040M00Props {
  /** ?�원번호 */
  empNo?: string;
  /** ?�원�?*/
  empNm?: string;
  /** 기�? ?�라미터 */
  [key: string]: any;
}

/**
 * PSM0040M00 컴포?�트
 * 
 * 개발?�로??관�?메인 ?�면???�더링하???�수??컴포?�트?�니??
 * 
 * @param {PSM0040M00Props} props - 컴포?�트 props
 * @returns {JSX.Element} PSM0040M00 ?�면 JSX
 */
const PSM0040M00: React.FC<PSM0040M00Props> = ({ empNo, empNm, ...otherProps }) => {
  const { user } = useAuth();
  const [autoEmpNo, setAutoEmpNo] = useState<string>('');
  const [autoEmpNm, setAutoEmpNm] = useState<string>('');

  /**
   * �??�픈 ??본인 ?�보 ?�동 ?�팅
   * 
   * props�??�달받�? ?�원 ?�보가 ?�으�??�재 로그?�한 ?�용?�의 ?�보�??�용?�고,
   * props�??�달받�? ?�보가 ?�으�??�당 ?�보�??�선 ?�용?�니??
   * 
   * @param {User} user - ?�재 로그?�한 ?�용???�보
   * @param {string} empNo - props�??�달받�? ?�원번호
   * @param {string} empNm - props�??�달받�? ?�원�?
   */
  useEffect(() => {
    if (user && !empNo && !empNm) {
      // props�??�달받�? empNo, empNm???�고 로그?�한 ?�용???�보가 ?�으�?본인 ?�보 ?�용
      setAutoEmpNo(user.empNo || '');
      setAutoEmpNm(user.name || '');
    } else {
      // props�??�달받�? ?�보가 ?�으�??�당 ?�보 ?�용
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

