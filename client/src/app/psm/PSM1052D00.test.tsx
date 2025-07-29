/**
 * PSM1052D00 - 경력 입력 컴포넌트 테스트
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PSM1052D00 from './PSM1052D00';

describe('PSM1052D00 - 경력 입력 컴포넌트', () => {
  test('컴포넌트가 정상적으로 렌더링된다', () => {
    render(<PSM1052D00 />);
    
    expect(screen.getByText('※ 입사전 경력 (자사인력) - 입사 전 프로젝트 투입 기간을 말함.')).toBeInTheDocument();
  });

  test('주요 안내 문구들이 표시된다', () => {
    render(<PSM1052D00 />);
    
    // 핵심 문구들만 확인
    expect(screen.getByText(/※ 입사전 경력 \(자사인력\)/)).toBeInTheDocument();
    expect(screen.getByText(/※ 입사후 경력 \(자사인력\)/)).toBeInTheDocument();
    expect(screen.getByText(/※ 외주인력은/)).toBeInTheDocument();
  });

  test('컴포넌트가 파란색 배경으로 표시된다', () => {
    render(<PSM1052D00 />);
    
    const container = screen.getByText('※ 입사전 경력 (자사인력) - 입사 전 프로젝트 투입 기간을 말함.').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-blue-50');
  });

  test('props가 없어도 정상 동작한다', () => {
    expect(() => {
      render(<PSM1052D00 />);
    }).not.toThrow();
  });
}); 