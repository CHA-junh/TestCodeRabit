/**
 * PSM0040M00 - 개발프로필 관리 메인 화면 테스트
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PSM0040M00 from './PSM0040M00';
import { useAuth } from '@/modules/auth/hooks/useAuth';

// PSM0050M00 컴포넌트 Mock
jest.mock('./PSM0050M00', () => {
  return function MockPSM0050M00(props: any) {
    return (
      <div data-testid="psm0050m00">
        <div>개발 프로필 내역</div>
        <div>사원번호: {props.parentEmpNo}</div>
        <div>사원명: {props.parentEmpNm}</div>
      </div>
    );
  };
});

// useAuth Hook Mock
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('PSM0040M00 - 개발프로필 관리 메인 화면', () => {
  const mockUser = {
    userId: '10001',
    empNo: '10001',
    name: '김개발',
    email: 'dev@company.com',
    department: '개발팀',
    position: '개발자',
    role: 'developer',
    permissions: ['read', 'write'],
    lastLoginAt: '2024-01-01T00:00:00Z',
    menuList: [],
    programList: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('컴포넌트가 정상적으로 렌더링된다', () => {
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
    expect(screen.getByText('개발 프로필 내역')).toBeInTheDocument();
  });

  test('props가 없을 때 로그인한 사용자 정보를 자동으로 셋팅한다', () => {
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
    
    expect(screen.getByText('사원번호: 10001')).toBeInTheDocument();
    expect(screen.getByText('사원명: 김개발')).toBeInTheDocument();
  });

  test('props로 전달된 값이 로그인 사용자 정보보다 우선한다', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      session: { user: mockUser },
      loading: false,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      checkSession: jest.fn()
    });
    
    render(<PSM0040M00 empNo="20002" empNm="박수정" />);
    
    expect(screen.getByText('사원번호: 20002')).toBeInTheDocument();
    expect(screen.getByText('사원명: 박수정')).toBeInTheDocument();
  });

  test('사용자 정보가 없을 때 빈 값으로 셋팅한다', () => {
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
    
    expect(screen.getByText('사원번호:')).toBeInTheDocument();
    expect(screen.getByText('사원명:')).toBeInTheDocument();
  });
}); 