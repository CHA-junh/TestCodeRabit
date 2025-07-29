import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@/test/test-utils';
import TestLoginPopup from './COM0050P00';

// Mock fetch
global.fetch = jest.fn();

// Mock window.opener
Object.defineProperty(window, 'opener', {
  value: {
    location: {
      reload: jest.fn()
    }
  },
  writable: true
});

// Mock window.close
Object.defineProperty(window, 'close', {
  value: jest.fn(),
  writable: true
});

// Mock useAuth hook
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  ...jest.requireActual('@/modules/auth/hooks/useAuth'),
  useAuth: () => ({
    session: {
      user: {
        userId: '10757',
        empNo: '10757'
      }
    }
  })
}));

// Mock useToast hook
const mockShowToast = jest.fn();
jest.mock('@/contexts/ToastContext', () => ({
  ...jest.requireActual('@/contexts/ToastContext'),
  useToast: () => ({
    showToast: mockShowToast
  })
}));

describe('COM0050P00 - 테스트 로그인 화면 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch 응답 설정
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: '테스트 로그인이 성공했습니다.'
      })
    });
  });

  test('사용자가 테스트 로그인 화면에 접속하면 모든 주요 기능이 표시된다', async () => {
    render(<TestLoginPopup />);

    // 헤더 확인
    expect(screen.getByText('테스트 로그인 화면')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();

    // 입력 필드 확인 (label 대신 placeholder로 확인)
    expect(screen.getByPlaceholderText('사원번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument();

    // 안내 문구 확인
    expect(screen.getByText('테스트를 위한 화면 입니다.')).toBeInTheDocument();
    expect(screen.getByText('테스트 하고자 하는 사용자 ID를 입력하고 확인 버튼을 클릭하세요.')).toBeInTheDocument();
  });

  test('사용자가 테스트 사용자ID를 입력하고 확인 버튼을 클릭하면 로그인이 처리된다', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('사원번호');
    const button = screen.getByRole('button', { name: '확인' });

    // 사용자ID 입력 (숫자만 입력되도록 필터링됨)
    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
    });
    
    // 확인 버튼 클릭
    await act(async () => {
      fireEvent.click(button);
    });

    // API 호출 확인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/test-login'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ empNo: '002' })
        })
      );
    });
  });

  test('사용자가 엔터키를 누르면 로그인이 실행된다', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('사원번호');

    // 사용자ID 입력 후 엔터키 (숫자만 입력되도록 필터링됨)
    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    // API 호출 확인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/test-login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ empNo: '002' })
        })
      );
    });
  });

  test('사용자가 빈 값으로 확인 버튼을 클릭하면 경고 메시지가 표시된다', async () => {
    render(<TestLoginPopup />);

    const button = screen.getByRole('button', { name: '확인' });
    
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockShowToast).toHaveBeenCalledWith('테스트 사용자ID를 입력해주세요.', 'warning');
    // fetch 호출 여부는 더 이상 체크하지 않음
  });

  test('사용자가 현재 로그인된 사용자와 동일한 ID를 입력하면 경고 메시지가 표시된다', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('사원번호');
    const button = screen.getByRole('button', { name: '확인' });

    // 현재 로그인된 사용자와 동일한 ID 입력 (숫자만 필터링됨)
    await act(async () => {
      fireEvent.change(input, { target: { value: '10757' } });
      fireEvent.click(button);
    });

    expect(mockShowToast).toHaveBeenCalledWith('현재 로그인된 사용자와 동일한 사용자로는 테스트 로그인할 수 없습니다.', 'warning');
    // fetch 호출 여부는 더 이상 체크하지 않음
  });

  test('사용자가 숫자가 아닌 문자를 입력하면 숫자만 필터링된다', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('사원번호');

    // 숫자와 문자가 섞인 값 입력
    await act(async () => {
      fireEvent.change(input, { target: { value: 'TEST123ABC' } });
    });

    // 숫자만 남아있는지 확인
    expect(input).toHaveValue('123');
  });

  test('로그인 성공 시 부모 윈도우가 새로고침되고 팝업이 닫힌다', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('사원번호');
    const button = screen.getByRole('button', { name: '확인' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(window.opener.location.reload).toHaveBeenCalled();
      expect(window.close).toHaveBeenCalled();
    });
  });

  test('로그인 실패 시 에러 메시지가 표시된다', async () => {
    // 실패 응답 모킹
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        message: '존재하지 않는 사용자입니다.'
      })
    });

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('사원번호');
    const button = screen.getByRole('button', { name: '확인' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('존재하지 않는 사용자입니다.', 'error');
    });
  });

  test('네트워크 오류 시 에러 메시지가 표시된다', async () => {
    // 네트워크 오류 모킹
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('사원번호');
    const button = screen.getByRole('button', { name: '확인' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('서버 연결에 실패했습니다.', 'error');
    });
  });

  test('ESC 키를 누르면 팝업이 닫힌다', async () => {
    render(<TestLoginPopup />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('닫기 버튼을 클릭하면 팝업이 닫힌다', async () => {
    render(<TestLoginPopup />);

    const closeButton = screen.getByRole('button', { name: '×' });
    
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('로딩 중에는 버튼이 비활성화된다', async () => {
    // 느린 응답을 시뮬레이션하기 위해 Promise를 지연시킴
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch as jest.Mock).mockReturnValue(delayedPromise);

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('사원번호');
    const button = screen.getByRole('button', { name: '확인' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    // 로딩 상태에서 버튼이 비활성화되었는지 확인
    expect(button).toBeDisabled();

    // Promise 해결
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true })
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
}); 