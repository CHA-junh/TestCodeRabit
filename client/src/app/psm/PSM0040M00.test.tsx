/**
 * PSM0040M00 - ๊ฐ๋ฐ?๋ก??๊ด๋ฆ?๋ฉ์ธ ?๋ฉด ?์ค??
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PSM0040M00 from './PSM0040M00';
import { useAuth } from '@/modules/auth/hooks/useAuth';

// PSM0050M00 ์ปดํฌ?ํธ Mock
jest.mock('./PSM0050M00', () => {
  return function MockPSM0050M00(props: any) {
    return (
      <div data-testid="psm0050m00">
        <div>๊ฐ๋ฐ ?๋ก???ด์ญ</div>
        <div>?ฌ์๋ฒํธ: {props.parentEmpNo}</div>
        <div>?ฌ์๋ช? {props.parentEmpNm}</div>
      </div>
    );
  };
});

// useAuth Hook Mock
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('PSM0040M00 - ๊ฐ๋ฐ?๋ก??๊ด๋ฆ?๋ฉ์ธ ?๋ฉด', () => {
  const mockUser = {
    userId: '10001',
    empNo: '10001',
    name: '๊น๊ฐ๋ฐ',
    email: 'dev@company.com',
    department: '๊ฐ๋ฐ?',
    position: '๊ฐ๋ฐ??,
    role: 'developer',
    permissions: ['read', 'write'],
    lastLoginAt: '2024-01-01T00:00:00Z',
    menuList: [],
    programList: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('์ปดํฌ?ํธ๊ฐ ?์?์ผ๋ก??๋๋ง๋??, () => {
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
    expect(screen.getByText('๊ฐ๋ฐ ?๋ก???ด์ญ')).toBeInTheDocument();
  });

  test('props๊ฐ ?์ ??๋ก๊ทธ?ธํ ?ฌ์ฉ???๋ณด๋ฅ??๋?ผ๋ก ?ํ?๋ค', () => {
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
    
    expect(screen.getByText('?ฌ์๋ฒํธ: 10001')).toBeInTheDocument();
    expect(screen.getByText('?ฌ์๋ช? ๊น๊ฐ๋ฐ')).toBeInTheDocument();
  });

  test('props๋ก??๋ฌ??๊ฐ์ด ๋ก๊ทธ???ฌ์ฉ???๋ณด๋ณด๋ค ?ฐ์ ?๋ค', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      session: { user: mockUser },
      loading: false,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      checkSession: jest.fn()
    });
    
    render(<PSM0040M00 empNo="20002" empNm="๋ฐ์?? />);
    
    expect(screen.getByText('?ฌ์๋ฒํธ: 20002')).toBeInTheDocument();
    expect(screen.getByText('?ฌ์๋ช? ๋ฐ์??)).toBeInTheDocument();
  });

  test('?ฌ์ฉ???๋ณด๊ฐ ?์ ??๋น?๊ฐ์ผ๋ก??ํ?๋ค', () => {
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
    
    expect(screen.getByText('?ฌ์๋ฒํธ:')).toBeInTheDocument();
    expect(screen.getByText('?ฌ์๋ช?')).toBeInTheDocument();
  });
}); 

