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

describe('COM0050P00 - ?ŒìŠ¤??ë¡œê·¸???”ë©´ ?ŒìŠ¤??, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch ?‘ë‹µ ?¤ì •
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: '?ŒìŠ¤??ë¡œê·¸?¸ì´ ?±ê³µ?ˆìŠµ?ˆë‹¤.'
      })
    });
  });

  test('?¬ìš©?ê? ?ŒìŠ¤??ë¡œê·¸???”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???œì‹œ?œë‹¤', async () => {
    render(<TestLoginPopup />);

    // ?¤ë” ?•ì¸
    expect(screen.getByText('?ŒìŠ¤??ë¡œê·¸???”ë©´')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ã—' })).toBeInTheDocument();

    // ?…ë ¥ ?„ë“œ ?•ì¸ (label ?€??placeholderë¡??•ì¸)
    expect(screen.getByPlaceholderText('?¬ì›ë²ˆí˜¸')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '?•ì¸' })).toBeInTheDocument();

    // ?ˆë‚´ ë¬¸êµ¬ ?•ì¸
    expect(screen.getByText('?ŒìŠ¤?¸ë? ?„í•œ ?”ë©´ ?…ë‹ˆ??')).toBeInTheDocument();
    expect(screen.getByText('?ŒìŠ¤???˜ê³ ???˜ëŠ” ?¬ìš©??IDë¥??…ë ¥?˜ê³  ?•ì¸ ë²„íŠ¼???´ë¦­?˜ì„¸??')).toBeInTheDocument();
  });

  test('?¬ìš©?ê? ?ŒìŠ¤???¬ìš©?IDë¥??…ë ¥?˜ê³  ?•ì¸ ë²„íŠ¼???´ë¦­?˜ë©´ ë¡œê·¸?¸ì´ ì²˜ë¦¬?œë‹¤', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?¬ì›ë²ˆí˜¸');
    const button = screen.getByRole('button', { name: '?•ì¸' });

    // ?¬ìš©?ID ?…ë ¥ (?«ìë§??…ë ¥?˜ë„ë¡??„í„°ë§ë¨)
    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
    });
    
    // ?•ì¸ ë²„íŠ¼ ?´ë¦­
    await act(async () => {
      fireEvent.click(button);
    });

    // API ?¸ì¶œ ?•ì¸
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

  test('?¬ìš©?ê? ?”í„°?¤ë? ?„ë¥´ë©?ë¡œê·¸?¸ì´ ?¤í–‰?œë‹¤', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?¬ì›ë²ˆí˜¸');

    // ?¬ìš©?ID ?…ë ¥ ???”í„°??(?«ìë§??…ë ¥?˜ë„ë¡??„í„°ë§ë¨)
    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    // API ?¸ì¶œ ?•ì¸
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

  test('?¬ìš©?ê? ë¹?ê°’ìœ¼ë¡??•ì¸ ë²„íŠ¼???´ë¦­?˜ë©´ ê²½ê³  ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
    render(<TestLoginPopup />);

    const button = screen.getByRole('button', { name: '?•ì¸' });
    
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockShowToast).toHaveBeenCalledWith('?ŒìŠ¤???¬ìš©?IDë¥??…ë ¥?´ì£¼?¸ìš”.', 'warning');
    // fetch ?¸ì¶œ ?¬ë??????´ìƒ ì²´í¬?˜ì? ?ŠìŒ
  });

  test('?¬ìš©?ê? ?„ì¬ ë¡œê·¸?¸ëœ ?¬ìš©?ì? ?™ì¼??IDë¥??…ë ¥?˜ë©´ ê²½ê³  ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?¬ì›ë²ˆí˜¸');
    const button = screen.getByRole('button', { name: '?•ì¸' });

    // ?„ì¬ ë¡œê·¸?¸ëœ ?¬ìš©?ì? ?™ì¼??ID ?…ë ¥ (?«ìë§??„í„°ë§ë¨)
    await act(async () => {
      fireEvent.change(input, { target: { value: '10757' } });
      fireEvent.click(button);
    });

    expect(mockShowToast).toHaveBeenCalledWith('?„ì¬ ë¡œê·¸?¸ëœ ?¬ìš©?ì? ?™ì¼???¬ìš©?ë¡œ???ŒìŠ¤??ë¡œê·¸?¸í•  ???†ìŠµ?ˆë‹¤.', 'warning');
    // fetch ?¸ì¶œ ?¬ë??????´ìƒ ì²´í¬?˜ì? ?ŠìŒ
  });

  test('?¬ìš©?ê? ?«ìê°€ ?„ë‹Œ ë¬¸ìë¥??…ë ¥?˜ë©´ ?«ìë§??„í„°ë§ëœ??, async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?¬ì›ë²ˆí˜¸');

    // ?«ì?€ ë¬¸ìê°€ ?ì¸ ê°??…ë ¥
    await act(async () => {
      fireEvent.change(input, { target: { value: 'TEST123ABC' } });
    });

    // ?«ìë§??¨ì•„?ˆëŠ”ì§€ ?•ì¸
    expect(input).toHaveValue('123');
  });

  test('ë¡œê·¸???±ê³µ ??ë¶€ëª??ˆë„?°ê? ?ˆë¡œê³ ì¹¨?˜ê³  ?ì—…???«íŒ??, async () => {
    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?¬ì›ë²ˆí˜¸');
    const button = screen.getByRole('button', { name: '?•ì¸' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(window.opener.location.reload).toHaveBeenCalled();
      expect(window.close).toHaveBeenCalled();
    });
  });

  test('ë¡œê·¸???¤íŒ¨ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
    // ?¤íŒ¨ ?‘ë‹µ ëª¨í‚¹
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        message: 'ì¡´ì¬?˜ì? ?ŠëŠ” ?¬ìš©?ì…?ˆë‹¤.'
      })
    });

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?¬ì›ë²ˆí˜¸');
    const button = screen.getByRole('button', { name: '?•ì¸' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('ì¡´ì¬?˜ì? ?ŠëŠ” ?¬ìš©?ì…?ˆë‹¤.', 'error');
    });
  });

  test('?¤íŠ¸?Œí¬ ?¤ë¥˜ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
    // ?¤íŠ¸?Œí¬ ?¤ë¥˜ ëª¨í‚¹
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?¬ì›ë²ˆí˜¸');
    const button = screen.getByRole('button', { name: '?•ì¸' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('?œë²„ ?°ê²°???¤íŒ¨?ˆìŠµ?ˆë‹¤.', 'error');
    });
  });

  test('ESC ?¤ë? ?„ë¥´ë©??ì—…???«íŒ??, async () => {
    render(<TestLoginPopup />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('?«ê¸° ë²„íŠ¼???´ë¦­?˜ë©´ ?ì—…???«íŒ??, async () => {
    render(<TestLoginPopup />);

    const closeButton = screen.getByRole('button', { name: 'Ã—' });
    
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('ë¡œë”© ì¤‘ì—??ë²„íŠ¼??ë¹„í™œ?±í™”?œë‹¤', async () => {
    // ?ë¦° ?‘ë‹µ???œë??ˆì´?˜í•˜ê¸??„í•´ Promiseë¥?ì§€?°ì‹œ??
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch as jest.Mock).mockReturnValue(delayedPromise);

    render(<TestLoginPopup />);

    const input = screen.getByPlaceholderText('?¬ì›ë²ˆí˜¸');
    const button = screen.getByRole('button', { name: '?•ì¸' });

    await act(async () => {
      fireEvent.change(input, { target: { value: '002' } });
      fireEvent.click(button);
    });

    // ë¡œë”© ?íƒœ?ì„œ ë²„íŠ¼??ë¹„í™œ?±í™”?˜ì—ˆ?”ì? ?•ì¸
    expect(button).toBeDisabled();

    // Promise ?´ê²°
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true })
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
}); 

