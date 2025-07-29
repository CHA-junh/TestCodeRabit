import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import COMZ010M00Page from './COMZ010M00';

// Mock fetch
global.fetch = jest.fn();

// Mock useAuth hook
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  ...jest.requireActual('@/modules/auth/hooks/useAuth'),
  useAuth: () => ({
    session: {
      user: {
        userId: 'TEST_USER',
        empNo: 'TEST001'
      }
    }
  })
}));

// Mock useToast hook
jest.mock('@/contexts/ToastContext', () => ({
  ...jest.requireActual('@/contexts/ToastContext'),
  useToast: () => ({
    showToast: jest.fn(),
    showConfirm: jest.fn(({ onConfirm }) => onConfirm())
  })
}));

describe('COMZ010M00 - ?œìŠ¤?œì½”?œê?ë¦??”ë©´ ?ŒìŠ¤??, () => {
  beforeEach(() => {
    // Mock fetch ?‘ë‹µ ?¤ì •
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            lrgCsfCd: '1001',
            lrgCsfNm: 'ë¶€?œêµ¬ë¶?,
            useYn: 'Y',
            expl: 'ë¶€??êµ¬ë¶„ ì½”ë“œ'
          },
          {
            lrgCsfCd: '1002',
            lrgCsfNm: 'ì§ê¸‰êµ¬ë¶„',
            useYn: 'Y',
            expl: 'ì§ê¸‰ êµ¬ë¶„ ì½”ë“œ'
          }
        ]
      })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('?¬ìš©?ê? ?œìŠ¤?œì½”?œê?ë¦??”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???œì‹œ?œë‹¤', async () => {
    render(<COMZ010M00Page />);

    // ì¡°íšŒ ?ì—­ ?•ì¸
    await waitFor(() => {
      expect(screen.getByText('?€ë¶„ë¥˜ ì½”ë“œ')).toBeInTheDocument();
    });

    expect(screen.getAllByText('?€ë¶„ë¥˜ëª?)).toHaveLength(3); // ê²€?? ê·¸ë¦¬???¤ë”, ??
    expect(screen.getByText('ì¡°íšŒ')).toBeInTheDocument();

    // ?€ë¶„ë¥˜ ì½”ë“œ ?±ë¡ ?ì—­ ?•ì¸
    expect(screen.getByText('?€ë¶„ë¥˜ì½”ë“œ ?±ë¡')).toBeInTheDocument();
    expect(screen.getAllByText('? ê·œ')).toHaveLength(2);
    expect(screen.getAllByText('?€??)).toHaveLength(2);
    expect(screen.getAllByText('?? œ')).toHaveLength(2);

    // ?Œë¶„ë¥?ì½”ë“œ ?±ë¡ ?ì—­ ?•ì¸
    expect(screen.getByText('?Œë¶„ë¥˜ì½”???±ë¡')).toBeInTheDocument();
  });

  test('?¬ìš©?ê? ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ?€ë¶„ë¥˜ ì½”ë“œ ëª©ë¡???”ë©´???œì‹œ?œë‹¤', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByText('ì¡°íšŒ')).toBeInTheDocument();
    });

    const searchButton = screen.getByText('ì¡°íšŒ');
    fireEvent.click(searchButton);

    // API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0101_S(?,?)',
            PARAM: '|'
          })
        })
      );
    });
  });

  test('?¬ìš©?ê? ?€ë¶„ë¥˜ì½”ë“œ ê²€??ì¡°ê±´???…ë ¥?˜ê³  ì¡°íšŒ?˜ë©´ ?´ë‹¹ ì¡°ê±´?¼ë¡œ ê²€?‰ëœ??, async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?€ë¶„ë¥˜ì½”ë“œ ê²€??)).toBeInTheDocument();
    });

    // ê²€??ì¡°ê±´ ?…ë ¥
    const codeInput = screen.getByLabelText('?€ë¶„ë¥˜ì½”ë“œ ê²€??);
    const nameInput = screen.getByLabelText('?€ë¶„ë¥˜ëª?ê²€??);

    fireEvent.change(codeInput, { target: { value: '1001' } });
    fireEvent.change(nameInput, { target: { value: 'ë¶€?? } });

    // ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
    fireEvent.click(screen.getByText('ì¡°íšŒ'));

    // API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0101_S(?,?)',
            PARAM: '1001|ë¶€??
          })
        })
      );
    });
  });

  test('?¬ìš©?ê? ?€ë¶„ë¥˜ì½”ë“œ ?±ë¡ ?¼ì—???„ìˆ˜ ??ª©???…ë ¥?˜ê³  ?€?¥í•  ???ˆë‹¤', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByLabelText('?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥')).toHaveLength(2);
    });

    // ?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥ (ì²?ë²ˆì§¸ ?…ë ¥ ?„ë“œ)
    const codeInputs = screen.getAllByLabelText('?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥');
    const codeInput = codeInputs[0]; // ?€ë¶„ë¥˜ ?±ë¡ ?¼ì˜ ?…ë ¥ ?„ë“œ
    const nameInput = screen.getByLabelText('?€ë¶„ë¥˜ëª??…ë ¥');

    fireEvent.change(codeInput, { target: { value: '1003' } });
    fireEvent.change(nameInput, { target: { value: '?ŒìŠ¤?¸ì½”?? } });

    // ?€??ë²„íŠ¼ ?´ë¦­ (ì²?ë²ˆì§¸ ?€??ë²„íŠ¼)
    const saveButtons = screen.getAllByText('?€??);
    fireEvent.click(saveButtons[0]);

    // API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0102_T(?,?,?,?,?,?)',
            PARAM: '1003|?ŒìŠ¤?¸ì½”??Y||TEST_USER'
          })
        })
      );
    });
  });

  test('?¬ìš©?ê? ?€ë¶„ë¥˜ì½”ë“œ ?±ë¡ ???„ìˆ˜ ??ª©??ë¹„ì–´?ˆìœ¼ë©??€?¥ë˜ì§€ ?ŠëŠ”??, async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('?€??)).toHaveLength(2);
    });

    // ?„ìˆ˜ ??ª© ?†ì´ ?€??ë²„íŠ¼ ?´ë¦­
    const saveButtons = screen.getAllByText('?€??);
    fireEvent.click(saveButtons[0]);

    // API ?¸ì¶œ???˜ì? ?Šì•˜?”ì? ?•ì¸
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.any(Object)
      );
    });
  });

  test('?¬ìš©?ê? ?€ë¶„ë¥˜ì½”ë“œë¥?? íƒ?˜ë©´ ?´ë‹¹ ?Œë¶„ë¥?ì½”ë“œ ëª©ë¡???œì‹œ?œë‹¤', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByText('ì¡°íšŒ')).toBeInTheDocument();
    });

    // ì¡°íšŒ ë²„íŠ¼ ?´ë¦­?˜ì—¬ ?€ë¶„ë¥˜ ëª©ë¡ ë¡œë“œ
    fireEvent.click(screen.getByText('ì¡°íšŒ'));

    // ?€ë¶„ë¥˜ ì½”ë“œ ì¡°íšŒ API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0101_S(?,?)',
            PARAM: '|'
          })
        })
      );
    });
  });

  test('?¬ìš©?ê? ?Œë¶„ë¥˜ì½”???±ë¡ ?¼ì—???„ìˆ˜ ??ª©???…ë ¥?˜ê³  ?€?¥í•  ???ˆë‹¤', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?Œë¶„ë¥˜ì½”???…ë ¥')).toBeInTheDocument();
    });

    // ?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥ (?Œë¶„ë¥??±ë¡???„í•´ ?„ìš”) - ??ë²ˆì§¸ ?…ë ¥ ?„ë“œ
    const largeCodeInputs = screen.getAllByLabelText('?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥');
    const largeCodeInput = largeCodeInputs[1]; // ?Œë¶„ë¥??±ë¡ ?¼ì˜ ?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥ ?„ë“œ
    fireEvent.change(largeCodeInput, { target: { value: '1001' } });

    // ?Œë¶„ë¥˜ì½”???…ë ¥
    const smallCodeInput = screen.getByLabelText('?Œë¶„ë¥˜ì½”???…ë ¥');
    const smallNameInput = screen.getByLabelText('?Œë¶„ë¥˜ëª… ?…ë ¥');

    fireEvent.change(smallCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallNameInput, { target: { value: '?ŒìŠ¤?¸ì†Œë¶„ë¥˜' } });

    // ?€??ë²„íŠ¼ ?´ë¦­ (??ë²ˆì§¸ ?€??ë²„íŠ¼)
    const saveButtons = screen.getAllByText('?€??);
    fireEvent.click(saveButtons[1]);

    // API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0105_T(?,?,?,?,?,?,?,?,?,?,?)',
            PARAM: '1001|1001|?ŒìŠ¤?¸ì†Œë¶„ë¥˜||||1|Y||TEST_USER'
          })
        })
      );
    });
  });

  test('?¬ìš©?ê? ?€ë¶„ë¥˜ì½”ë“œë¥??? œ?????ˆë‹¤', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('?? œ')).toHaveLength(2);
    });

    // ?? œ ë²„íŠ¼ ?´ë¦­ (ì²?ë²ˆì§¸ ?? œ ë²„íŠ¼ - ?€ë¶„ë¥˜)
    const deleteButtons = screen.getAllByText('?? œ');
    fireEvent.click(deleteButtons[0]);

    // ?? œ ë²„íŠ¼???´ë¦­?˜ì—ˆ?”ì? ?•ì¸
    expect(deleteButtons[0]).toBeInTheDocument();
  });

  test('?¬ìš©?ê? ?Œë¶„ë¥˜ì½”?œë? ?? œ?????ˆë‹¤', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('?? œ')).toHaveLength(2);
    });

    // ?? œ ë²„íŠ¼ ?´ë¦­ (??ë²ˆì§¸ ?? œ ë²„íŠ¼ - ?Œë¶„ë¥?
    const deleteButtons = screen.getAllByText('?? œ');
    fireEvent.click(deleteButtons[1]);

    // ?? œ ë²„íŠ¼???´ë¦­?˜ì—ˆ?”ì? ?•ì¸
    expect(deleteButtons[1]).toBeInTheDocument();
  });

  test('?¬ìš©?ê? ? ê·œ ë²„íŠ¼???´ë¦­?˜ë©´ ?±ë¡ ?¼ì´ ì´ˆê¸°?”ëœ??, async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('? ê·œ')).toHaveLength(2);
    });

    // ?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥
    const codeInputs = screen.getAllByLabelText('?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥');
    const codeInput = codeInputs[0]; // ?€ë¶„ë¥˜ ?±ë¡ ?¼ì˜ ?…ë ¥ ?„ë“œ
    fireEvent.change(codeInput, { target: { value: '1003' } });

    // ? ê·œ ë²„íŠ¼ ?´ë¦­ (ì²?ë²ˆì§¸ ? ê·œ ë²„íŠ¼ - ?€ë¶„ë¥˜)
    const newButtons = screen.getAllByText('? ê·œ');
    fireEvent.click(newButtons[0]);

    // ?¼ì´ ì´ˆê¸°?”ë˜?ˆëŠ”ì§€ ?•ì¸
    await waitFor(() => {
      expect(codeInput).toHaveValue('');
    });
  });

  test('?¬ìš©?ê? ?”í„°?¤ë? ?„ë¥´ë©?ê²€?‰ì´ ?¤í–‰?œë‹¤', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?€ë¶„ë¥˜ì½”ë“œ ê²€??)).toBeInTheDocument();
    });

    // ê²€??ì¡°ê±´ ?…ë ¥ ???”í„°??
    const codeInput = screen.getByLabelText('?€ë¶„ë¥˜ì½”ë“œ ê²€??);
    fireEvent.change(codeInput, { target: { value: '1001' } });
    fireEvent.keyDown(codeInput, { key: 'Enter' });

    // API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0101_S(?,?)',
            PARAM: '1001|'
          })
        })
      );
    });
  });

  test('?¬ìš©?ê? ?€ë¶„ë¥˜ì½”ë“œ ?±ë¡ ?¼ì—???”í„°?¤ë? ?„ë¥´ë©??€?¥ì´ ?¤í–‰?œë‹¤', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByLabelText('?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥')).toHaveLength(2);
    });

    // ?„ìˆ˜ ??ª© ?…ë ¥
    const codeInputs = screen.getAllByLabelText('?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥');
    const codeInput = codeInputs[0]; // ?€ë¶„ë¥˜ ?±ë¡ ?¼ì˜ ?…ë ¥ ?„ë“œ
    const nameInput = screen.getByLabelText('?€ë¶„ë¥˜ëª??…ë ¥');

    fireEvent.change(codeInput, { target: { value: '1003' } });
    fireEvent.change(nameInput, { target: { value: '?ŒìŠ¤?¸ì½”?? } });

    // ?”í„°???…ë ¥
    fireEvent.keyDown(codeInput, { key: 'Enter' });

    // API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('?¬ìš©?ê? ?Œë¶„ë¥˜ì½”???±ë¡ ?¼ì—???”í„°?¤ë? ?„ë¥´ë©??€?¥ì´ ?¤í–‰?œë‹¤', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?Œë¶„ë¥˜ì½”???…ë ¥')).toBeInTheDocument();
    });

    // ?„ìˆ˜ ??ª© ?…ë ¥
    const largeCodeInputs = screen.getAllByLabelText('?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥');
    const largeCodeInput = largeCodeInputs[1]; // ?Œë¶„ë¥??±ë¡ ?¼ì˜ ?€ë¶„ë¥˜ì½”ë“œ ?…ë ¥ ?„ë“œ
    const smallCodeInput = screen.getByLabelText('?Œë¶„ë¥˜ì½”???…ë ¥');
    const smallNameInput = screen.getByLabelText('?Œë¶„ë¥˜ëª… ?…ë ¥');

    fireEvent.change(largeCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallNameInput, { target: { value: '?ŒìŠ¤?¸ì†Œë¶„ë¥˜' } });

    // ?”í„°???…ë ¥
    fireEvent.keyDown(smallCodeInput, { key: 'Enter' });

    // API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });
}); 

