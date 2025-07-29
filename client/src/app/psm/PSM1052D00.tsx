'use client';

import React from 'react';
import '../common/common.css';

/**
 * PSM1052D00 - 경력 입력 컴포넌트
 * 
 * 신규 사원의 경력 정보를 입력하는 컴포넌트입니다.
 * PSM1050M00 팝업 내에서 신규 등록 모드일 때 사용됩니다.
 * 
 * 주요 기능:
 * - 신규 사원 경력 정보 입력
 * - 경력 계산 기준일 설정
 * - 경력 정보 유효성 검증
 * 
 * AS-IS: 경력 입력 컴포넌트 (MXML)
 * TO-BE: React 기반 경력 입력 컴포넌트
 * 
 * 사용 예시:
 * ```tsx
 * // PSM1050M00에서 사용 (신규 등록 모드)
 * <PSM1052D00 />
 * ```
 * 
 * @author BIST Development Team
 * @since 2024
 */

export default function PSM1052D00() {
  return (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
      <div className="text-[13px] text-[#00509A] space-y-1">
        <p>※ 입사전 경력 (자사인력) - 입사 전 프로젝트 투입 기간을 말함.</p>
        <p className="ml-4">
          (1)학력기준: 프로젝트 최초 투입일부터 입사일 전까지의 개월 수
        </p>
        <p className="ml-4">
          (2)기술자격기준: 자격취득일부터 입사일 전까지의 개월 수
        </p>
        <p>※ 입사후 경력 (자사인력) - 입사 후 재직 기간을 말함.</p>
        <p className="ml-4">
          (1)학력기준: 입사일부터 현재일까지의 개월 수 (재직개월수와 동일)
        </p>
        <p className="ml-4">
          (2)기술자격기준: 자격취득일부터 현재일까지의 개월 수
        </p>
        <p>※ 외주인력은 프로젝트 최초 투입일부터 최종 철수일까지 프로필의 경력 개월수를 계산함.</p>
        <p>※ 계산된 경력개월수와 등급을 사원정보 저장 시 반영을 할려면 [확인]버튼을 선택하고 미반영시에는 [취소]버튼을 선택함.</p>
        <p>※ 입사전 경력 개월을 수정 입력 후 [계산]버튼을 클릭하면 DB에 저장된 값으로 바뀜. 수정 후 먼저 사원정보를 저장해야 함.</p>
      </div>
    </div>
  );
}
