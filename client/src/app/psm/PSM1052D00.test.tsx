/**
 * PSM1052D00 - 경력 ?�력 컴포?�트 ?�스??
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PSM1052D00 from './PSM1052D00';

describe('PSM1052D00 - 경력 ?�력 컴포?�트', () => {
  test('컴포?�트가 ?�상?�으�??�더링된??, () => {
    render(<PSM1052D00 />);
    
    expect(screen.getByText('???�사??경력 (?�사?�력) - ?�사 ???�로?�트 ?�입 기간??말함.')).toBeInTheDocument();
  });

  test('주요 ?�내 문구?�이 ?�시?�다', () => {
    render(<PSM1052D00 />);
    
    // ?�심 문구?�만 ?�인
    expect(screen.getByText(/???�사??경력 \(?�사?�력\)/)).toBeInTheDocument();
    expect(screen.getByText(/???�사??경력 \(?�사?�력\)/)).toBeInTheDocument();
    expect(screen.getByText(/???�주?�력?�/)).toBeInTheDocument();
  });

  test('컴포?�트가 ?��???배경?�로 ?�시?�다', () => {
    render(<PSM1052D00 />);
    
    const container = screen.getByText('???�사??경력 (?�사?�력) - ?�사 ???�로?�트 ?�입 기간??말함.').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-blue-50');
  });

  test('props가 ?�어???�상 ?�작?�다', () => {
    expect(() => {
      render(<PSM1052D00 />);
    }).not.toThrow();
  });
}); 

