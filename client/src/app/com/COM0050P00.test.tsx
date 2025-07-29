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

describe('COM0050P00 - ?�스??로그???�면 ?�스??, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch ?�답 ?�정
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: '?�스??로그?�이 ?�공?�습?�다.'
      })
    });
  });

  test('?�용?��? ?�스??로그???�면???�속?�면 모든 주요 기능???�시?�다', async () => {
    render(<TestLoginPopup />);

    // ?�더 ?�인
    expect(screen.getByText('?�스??로그???�면')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();

    // ?�력 ?�드 ?�인 (label ?�??placeholder�??�인)
    expect(screen.getByPlaceholderText('?�원번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '?�인' })).toBeInTheDocument();

    // ?�내 문구 ?�인
    expect(screen.getByText('?�스?��? ?�한 ?�면 ?�니??')).toBeInTheDocument();
    expect(screen.getByText('?�스???�고???�는 ?�용??ID�??�력?�고 ?�인 버튼???�릭?�세??')).toBeInTheDocument();
  });

  test('?�용?��? ?�스???�용?�ID�??�력?�고 ?�인 버튼???�릭?�면 로그?�이 처리?�다', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?�원번호');
    const button = screen.getByRole('button', { name: '?�인' });

    // ?�용?�ID ?�력 (?�자�??�력?�도�??�터링됨)
    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
    });
    
    // ?�인 버튼 ?�릭
    await act(async () => {
      fireEvent.click(button);
    });

    // API ?�출 ?�인
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

  test('?�용?��? ?�터?��? ?�르�?로그?�이 ?�행?�다', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?�원번호');

    // ?�용?�ID ?�력 ???�터??(?�자�??�력?�도�??�터링됨)
    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    // API ?�출 ?�인
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

  test('?�용?��? �?값으�??�인 버튼???�릭?�면 경고 메시지가 ?�시?�다', async () => {
    render(<TestLoginPopup />);

    const button = screen.getByRole('button', { name: '?�인' });
    
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockShowToast).toHaveBeenCalledWith('?�스???�용?�ID�??�력?�주?�요.', 'warning');
    // fetch ?�출 ?��??????�상 체크?��? ?�음
  });

  test('?�용?��? ?�재 로그?�된 ?�용?��? ?�일??ID�??�력?�면 경고 메시지가 ?�시?�다', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?�원번호');
    const button = screen.getByRole('button', { name: '?�인' });

    // ?�재 로그?�된 ?�용?��? ?�일??ID ?�력 (?�자�??�터링됨)
    await act(async () => {
      fireEvent.change(input, { target: { value: '10757' } });
      fireEvent.click(button);
    });

    expect(mockShowToast).toHaveBeenCalledWith('?�재 로그?�된 ?�용?��? ?�일???�용?�로???�스??로그?�할 ???�습?�다.', 'warning');
    // fetch ?�출 ?��??????�상 체크?��? ?�음
  });

  test('?�용?��? ?�자가 ?�닌 문자�??�력?�면 ?�자�??�터링된??, async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?�원번호');

    // ?�자?� 문자가 ?�인 �??�력
    await act(async () => {
      fireEvent.change(input, { target: { value: 'TEST123ABC' } });
    });

    // ?�자�??�아?�는지 ?�인
    expect(input).toHaveValue('123');
  });

  test('로그???�공 ??부�??�도?��? ?�로고침?�고 ?�업???�힌??, async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?�원번호');
    const button = screen.getByRole('button', { name: '?�인' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(window.opener.location.reload).toHaveBeenCalled();
      expect(window.close).toHaveBeenCalled();
    });
  });

  test('로그???�패 ???�러 메시지가 ?�시?�다', async () => {
    // ?�패 ?�답 모킹
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        message: '존재?��? ?�는 ?�용?�입?�다.'
      })
    });

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?�원번호');
    const button = screen.getByRole('button', { name: '?�인' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('존재?��? ?�는 ?�용?�입?�다.', 'error');
    });
  });

  test('?�트?�크 ?�류 ???�러 메시지가 ?�시?�다', async () => {
    // ?�트?�크 ?�류 모킹
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?�원번호');
    const button = screen.getByRole('button', { name: '?�인' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('?�버 ?�결???�패?�습?�다.', 'error');
    });
  });

  test('ESC ?��? ?�르�??�업???�힌??, async () => {
    render(<TestLoginPopup />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('?�기 버튼???�릭?�면 ?�업???�힌??, async () => {
    render(<TestLoginPopup />);

    const closeButton = screen.getByRole('button', { name: '×' });
    
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('로딩 중에??버튼??비활?�화?�다', async () => {
    // ?�린 ?�답???��??�이?�하�??�해 Promise�?지?�시??
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch as jest.Mock).mockReturnValue(delayedPromise);

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?�원번호');
    const button = screen.getByRole('button', { name: '?�인' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    // 로딩 ?�태?�서 버튼??비활?�화?�었?��? ?�인
    expect(button).toBeDisabled();

    // Promise ?�결
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true })
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
}); 

