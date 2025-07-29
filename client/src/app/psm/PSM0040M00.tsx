'use client';

import React, { useEffect, useState } from 'react';
import PSM0050M00 from './PSM0050M00';
import { useAuth } from '@/modules/auth/hooks/useAuth';

/**
 * PSM0040M00 - 개발프로필 관리 메인 화면
 * 
 * 개발자의 프로필 정보를 관리하는 메인 화면입니다.
 * PSM0050M00 (개발프로필 등록 및 수정) 화면을 호출하는 컨테이너 컴포넌트로,
 * 첫 오픈 시 본인 정보를 자동으로 셋팅하고 조회까지 수행합니다.
 * 
 * 주요 기능:
 * - 본인 정보 자동 셋팅 (로그인한 사용자 정보 활용)
 * - PSM0050M00 화면 호출 및 파라미터 전달
 * - props로 전달받은 사원 정보 우선 사용
 * 
 * AS-IS: PSM_03_0100.mxml (개발프로필 등록 및 수정 메인 화면)
 * TO-BE: PSM0050M00을 호출하는 래퍼 컴포넌트
 * 
 * 사용 예시:
 * ```tsx
 * // 본인 프로필 관리 화면 열기
 * <PSM0040M00 />
 * 
 * // 특정 사원의 프로필 관리 화면 열기
 * <PSM0040M00 empNo="10001" empNm="홍길동" />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */

/**
 * PSM0040M00 컴포넌트 Props 인터페이스
 * 
 * @property {string} [empNo] - 조회할 사원번호 (미입력 시 본인 정보 사용)
 * @property {string} [empNm] - 조회할 사원명 (미입력 시 본인 정보 사용)
 * @property {any} [key] - 기타 추가 파라미터
 */
interface PSM0040M00Props {
  /** 사원번호 */
  empNo?: string;
  /** 사원명 */
  empNm?: string;
  /** 기타 파라미터 */
  [key: string]: any;
}

/**
 * PSM0040M00 컴포넌트
 * 
 * 개발프로필 관리 메인 화면을 렌더링하는 함수형 컴포넌트입니다.
 * 
 * @param {PSM0040M00Props} props - 컴포넌트 props
 * @returns {JSX.Element} PSM0040M00 화면 JSX
 */
const PSM0040M00: React.FC<PSM0040M00Props> = ({ empNo, empNm, ...otherProps }) => {
  const { user } = useAuth();
  const [autoEmpNo, setAutoEmpNo] = useState<string>('');
  const [autoEmpNm, setAutoEmpNm] = useState<string>('');

  /**
   * 첫 오픈 시 본인 정보 자동 셋팅
   * 
   * props로 전달받은 사원 정보가 없으면 현재 로그인한 사용자의 정보를 사용하고,
   * props로 전달받은 정보가 있으면 해당 정보를 우선 사용합니다.
   * 
   * @param {User} user - 현재 로그인한 사용자 정보
   * @param {string} empNo - props로 전달받은 사원번호
   * @param {string} empNm - props로 전달받은 사원명
   */
  useEffect(() => {
    if (user && !empNo && !empNm) {
      // props로 전달받은 empNo, empNm이 없고 로그인한 사용자 정보가 있으면 본인 정보 사용
      setAutoEmpNo(user.empNo || '');
      setAutoEmpNm(user.name || '');
    } else {
      // props로 전달받은 정보가 있으면 해당 정보 사용
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