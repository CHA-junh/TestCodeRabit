/**
 * PSM0040M00 - ê°œë°œ?„ë¡œ??ê´€ë¦?ë©”ì¸ ?”ë©´ ?ŒìŠ¤??
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PSM0040M00 from './PSM0040M00';
import { useAuth } from '@/modules/auth/hooks/useAuth';

// PSM0050M00 ì»´í¬?ŒíŠ¸ Mock
jest.mock('./PSM0050M00', () => {
  return function MockPSM0050M00(props: any) {
    return (
      <div data-testid="psm0050m00">
        <div>ê°œë°œ ?„ë¡œ???´ì—­</div>
        <div>?¬ì›ë²ˆí˜¸: {props.parentEmpNo}</div>
        <div>?¬ì›ëª? {props.parentEmpNm}</div>
      </div>
    );
  };
});

// useAuth Hook Mock
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('PSM0040M00 - ê°œë°œ?„ë¡œ??ê´€ë¦?ë©”ì¸ ?”ë©´', () => {
  const mockUser = {
    userId: '10001',
    empNo: '10001',
    name: 'ê¹€ê°œë°œ',
    email: 'dev@company.com',
    department: 'ê°œë°œ?€',
    position: 'ê°œë°œ??,
    role: 'developer',
    permissions: ['read', 'write'],
    lastLoginAt: '2024-01-01T00:00:00Z',
    menuList: [],
    programList: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ì»´í¬?ŒíŠ¸ê°€ ?•ìƒ?ìœ¼ë¡??Œë”ë§ëœ??, () => {
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
    expect(screen.getByText('ê°œë°œ ?„ë¡œ???´ì—­')).toBeInTheDocument();
  });

  test('propsê°€ ?†ì„ ??ë¡œê·¸?¸í•œ ?¬ìš©???•ë³´ë¥??ë™?¼ë¡œ ?‹íŒ…?œë‹¤', () => {
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
    
    expect(screen.getByText('?¬ì›ë²ˆí˜¸: 10001')).toBeInTheDocument();
    expect(screen.getByText('?¬ì›ëª? ê¹€ê°œë°œ')).toBeInTheDocument();
  });

  test('propsë¡??„ë‹¬??ê°’ì´ ë¡œê·¸???¬ìš©???•ë³´ë³´ë‹¤ ?°ì„ ?œë‹¤', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      session: { user: mockUser },
      loading: false,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      checkSession: jest.fn()
    });
    
    render(<PSM0040M00 empNo="20002" empNm="ë°•ìˆ˜?? />);
    
    expect(screen.getByText('?¬ì›ë²ˆí˜¸: 20002')).toBeInTheDocument();
    expect(screen.getByText('?¬ì›ëª? ë°•ìˆ˜??)).toBeInTheDocument();
  });

  test('?¬ìš©???•ë³´ê°€ ?†ì„ ??ë¹?ê°’ìœ¼ë¡??‹íŒ…?œë‹¤', () => {
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
    
    expect(screen.getByText('?¬ì›ë²ˆí˜¸:')).toBeInTheDocument();
    expect(screen.getByText('?¬ì›ëª?')).toBeInTheDocument();
  });
}); 

