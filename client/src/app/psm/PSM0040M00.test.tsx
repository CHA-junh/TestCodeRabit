/**
 * PSM0040M00 - 개발?�로??관�?메인 ?�면 ?�스??
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PSM0040M00 from './PSM0040M00';
import { useAuth } from '@/modules/auth/hooks/useAuth';

// PSM0050M00 컴포?�트 Mock
jest.mock('./PSM0050M00', () => {
  return function MockPSM0050M00(props: any) {
    return (
      <div data-testid="psm0050m00">
        <div>개발 ?�로???�역</div>
        <div>?�원번호: {props.parentEmpNo}</div>
        <div>?�원�? {props.parentEmpNm}</div>
      </div>
    );
  };
});

// useAuth Hook Mock
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('PSM0040M00 - 개발?�로??관�?메인 ?�면', () => {
  const mockUser = {
    userId: '10001',
    empNo: '10001',
    name: '김개발',
    email: 'dev@company.com',
    department: '개발?�',
    position: '개발??,
    role: 'developer',
    permissions: ['read', 'write'],
    lastLoginAt: '2024-01-01T00:00:00Z',
    menuList: [],
    programList: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('컴포?�트가 ?�상?�으�??�더링된??, () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      session: { user: mockUser },
      loading: false,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      checkSession: jest.fn()
    });
    
    render(<PSM0040M00 />);
    
    expect(screen.getByTestId('psm0050m00')).toBeInTheDocument();
    expect(screen.getByText('개발 ?�로???�역')).toBeInTheDocument();
  });

  test('props가 ?�을 ??로그?�한 ?�용???�보�??�동?�로 ?�팅?�다', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      session: { user: mockUser },
      loading: false,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      checkSession: jest.fn()
    });
    
    render(<PSM0040M00 />);
    
    expect(screen.getByText('?�원번호: 10001')).toBeInTheDocument();
    expect(screen.getByText('?�원�? 김개발')).toBeInTheDocument();
  });

  test('props�??�달??값이 로그???�용???�보보다 ?�선?�다', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      session: { user: mockUser },
      loading: false,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      checkSession: jest.fn()
    });
    
    render(<PSM0040M00 empNo="20002" empNm="박수?? />);
    
    expect(screen.getByText('?�원번호: 20002')).toBeInTheDocument();
    expect(screen.getByText('?�원�? 박수??)).toBeInTheDocument();
  });

  test('?�용???�보가 ?�을 ??�?값으�??�팅?�다', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      session: { user: null },
      loading: false,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      checkSession: jest.fn()
    });
    
    render(<PSM0040M00 />);
    
    expect(screen.getByText('?�원번호:')).toBeInTheDocument();
    expect(screen.getByText('?�원�?')).toBeInTheDocument();
  });
}); 

