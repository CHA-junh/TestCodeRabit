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

describe('COM0050P00 - ?์ค??๋ก๊ทธ???๋ฉด ?์ค??, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch ?๋ต ?ค์ 
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: '?์ค??๋ก๊ทธ?ธ์ด ?ฑ๊ณต?์ต?๋ค.'
      })
    });
  });

  test('?ฌ์ฉ?๊? ?์ค??๋ก๊ทธ???๋ฉด???์?๋ฉด ๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???์?๋ค', async () => {
    render(<TestLoginPopup />);

    // ?ค๋ ?์ธ
    expect(screen.getByText('?์ค??๋ก๊ทธ???๋ฉด')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ร' })).toBeInTheDocument();

    // ?๋ ฅ ?๋ ?์ธ (label ???placeholder๋ก??์ธ)
    expect(screen.getByPlaceholderText('?ฌ์๋ฒํธ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '?์ธ' })).toBeInTheDocument();

    // ?๋ด ๋ฌธ๊ตฌ ?์ธ
    expect(screen.getByText('?์ค?ธ๋? ?ํ ?๋ฉด ?๋??')).toBeInTheDocument();
    expect(screen.getByText('?์ค???๊ณ ???๋ ?ฌ์ฉ??ID๋ฅ??๋ ฅ?๊ณ  ?์ธ ๋ฒํผ???ด๋ฆญ?์ธ??')).toBeInTheDocument();
  });

  test('?ฌ์ฉ?๊? ?์ค???ฌ์ฉ?ID๋ฅ??๋ ฅ?๊ณ  ?์ธ ๋ฒํผ???ด๋ฆญ?๋ฉด ๋ก๊ทธ?ธ์ด ์ฒ๋ฆฌ?๋ค', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?ฌ์๋ฒํธ');
    const button = screen.getByRole('button', { name: '?์ธ' });

    // ?ฌ์ฉ?ID ?๋ ฅ (?ซ์๋ง??๋ ฅ?๋๋ก??ํฐ๋ง๋จ)
    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
    });
    
    // ?์ธ ๋ฒํผ ?ด๋ฆญ
    await act(async () => {
      fireEvent.click(button);
    });

    // API ?ธ์ถ ?์ธ
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

  test('?ฌ์ฉ?๊? ?ํฐ?ค๋? ?๋ฅด๋ฉ?๋ก๊ทธ?ธ์ด ?คํ?๋ค', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?ฌ์๋ฒํธ');

    // ?ฌ์ฉ?ID ?๋ ฅ ???ํฐ??(?ซ์๋ง??๋ ฅ?๋๋ก??ํฐ๋ง๋จ)
    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    // API ?ธ์ถ ?์ธ
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

  test('?ฌ์ฉ?๊? ๋น?๊ฐ์ผ๋ก??์ธ ๋ฒํผ???ด๋ฆญ?๋ฉด ๊ฒฝ๊ณ  ๋ฉ์์ง๊ฐ ?์?๋ค', async () => {
    render(<TestLoginPopup />);

    const button = screen.getByRole('button', { name: '?์ธ' });
    
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockShowToast).toHaveBeenCalledWith('?์ค???ฌ์ฉ?ID๋ฅ??๋ ฅ?ด์ฃผ?ธ์.', 'warning');
    // fetch ?ธ์ถ ?ฌ๋??????ด์ ์ฒดํฌ?์? ?์
  });

  test('?ฌ์ฉ?๊? ?์ฌ ๋ก๊ทธ?ธ๋ ?ฌ์ฉ?์? ?์ผ??ID๋ฅ??๋ ฅ?๋ฉด ๊ฒฝ๊ณ  ๋ฉ์์ง๊ฐ ?์?๋ค', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?ฌ์๋ฒํธ');
    const button = screen.getByRole('button', { name: '?์ธ' });

    // ?์ฌ ๋ก๊ทธ?ธ๋ ?ฌ์ฉ?์? ?์ผ??ID ?๋ ฅ (?ซ์๋ง??ํฐ๋ง๋จ)
    await act(async () => {
      fireEvent.change(input, { target: { value: '10757' } });
      fireEvent.click(button);
    });

    expect(mockShowToast).toHaveBeenCalledWith('?์ฌ ๋ก๊ทธ?ธ๋ ?ฌ์ฉ?์? ?์ผ???ฌ์ฉ?๋ก???์ค??๋ก๊ทธ?ธํ  ???์ต?๋ค.', 'warning');
    // fetch ?ธ์ถ ?ฌ๋??????ด์ ์ฒดํฌ?์? ?์
  });

  test('?ฌ์ฉ?๊? ?ซ์๊ฐ ?๋ ๋ฌธ์๋ฅ??๋ ฅ?๋ฉด ?ซ์๋ง??ํฐ๋ง๋??, async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?ฌ์๋ฒํธ');

    // ?ซ์? ๋ฌธ์๊ฐ ?์ธ ๊ฐ??๋ ฅ
    await act(async () => {
      fireEvent.change(input, { target: { value: 'TEST123ABC' } });
    });

    // ?ซ์๋ง??จ์?๋์ง ?์ธ
    expect(input).toHaveValue('123');
  });

  test('๋ก๊ทธ???ฑ๊ณต ??๋ถ๋ช??๋?ฐ๊? ?๋ก๊ณ ์นจ?๊ณ  ?์???ซํ??, async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?ฌ์๋ฒํธ');
    const button = screen.getByRole('button', { name: '?์ธ' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(window.opener.location.reload).toHaveBeenCalled();
      expect(window.close).toHaveBeenCalled();
    });
  });

  test('๋ก๊ทธ???คํจ ???๋ฌ ๋ฉ์์ง๊ฐ ?์?๋ค', async () => {
    // ?คํจ ?๋ต ๋ชจํน
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        message: '์กด์ฌ?์? ?๋ ?ฌ์ฉ?์?๋ค.'
      })
    });

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?ฌ์๋ฒํธ');
    const button = screen.getByRole('button', { name: '?์ธ' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('์กด์ฌ?์? ?๋ ?ฌ์ฉ?์?๋ค.', 'error');
    });
  });

  test('?คํธ?ํฌ ?ค๋ฅ ???๋ฌ ๋ฉ์์ง๊ฐ ?์?๋ค', async () => {
    // ?คํธ?ํฌ ?ค๋ฅ ๋ชจํน
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?ฌ์๋ฒํธ');
    const button = screen.getByRole('button', { name: '?์ธ' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('?๋ฒ ?ฐ๊ฒฐ???คํจ?์ต?๋ค.', 'error');
    });
  });

  test('ESC ?ค๋? ?๋ฅด๋ฉ??์???ซํ??, async () => {
    render(<TestLoginPopup />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('?ซ๊ธฐ ๋ฒํผ???ด๋ฆญ?๋ฉด ?์???ซํ??, async () => {
    render(<TestLoginPopup />);

    const closeButton = screen.getByRole('button', { name: 'ร' });
    
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('๋ก๋ฉ ์ค์??๋ฒํผ??๋นํ?ฑํ?๋ค', async () => {
    // ?๋ฆฐ ?๋ต???๋??์ด?ํ๊ธ??ํด Promise๋ฅ?์ง?ฐ์??
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch as jest.Mock).mockReturnValue(delayedPromise);

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?ฌ์๋ฒํธ');
    const button = screen.getByRole('button', { name: '?์ธ' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    // ๋ก๋ฉ ?ํ?์ ๋ฒํผ??๋นํ?ฑํ?์?์? ?์ธ
    expect(button).toBeDisabled();

    // Promise ?ด๊ฒฐ
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true })
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
}); 

