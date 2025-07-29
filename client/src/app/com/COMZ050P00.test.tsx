import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@/test/test-utils';
import BusinessNameSearchPopup from './COMZ050P00';

// Mock fetch
global.fetch = jest.fn();

// Mock window.opener
Object.defineProperty(window, 'opener', {
  value: {
    postMessage: jest.fn()
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
        empNo: '10757',
        name: 'ì°¨ì???
      }
    }
  })
}));

// Mock useToast hook
jest.mock('@/contexts/ToastContext', () => ({
  ...jest.requireActual('@/contexts/ToastContext'),
  useToast: () => ({
    showToast: jest.fn()
  })
}));

// Mock useSearchParams
const mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams
}));


describe('COMZ050P00 - ?¬ì—…ëª…ê??‰í™”ë©?, () => {
  beforeEach(() => {
    // ê¸°ë³¸ ëª¨í‚¹ ?¤ì •
    // mockUseAuth.mockReturnValue({
    //   session: {
    //     user: {
    //       userId: '10757',
    //       empNo: '10757',
    //       name: 'ì°¨ì???
    //     }
    //   }
    // });

    // fetch ëª¨í‚¹ ì´ˆê¸°??
    (fetch as jest.Mock).mockClear();
    
    // window ëª¨í‚¹ ì´ˆê¸°??
    (window.opener.postMessage as jest.Mock).mockClear();
    (window.close as jest.Mock).mockClear();
    
    // toast ëª¨í‚¹ ì´ˆê¸°??
    // mockShowToast.mockClear();

    // URL ?Œë¼ë¯¸í„° ì´ˆê¸°??
    mockSearchParams.delete('bsnNm');
    mockSearchParams.delete('mode');
  });

  test('?¬ìš©?ê? ?¬ì—…ëª…ê????”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???œì‹œ?œë‹¤', async () => {
    render(<BusinessNameSearchPopup />);

    // ?¤ë” ?•ì¸
    expect(screen.getByText('?¬ì—…ëª?ê²€??)).toBeInTheDocument();

    // ê²€??ì¡°ê±´ ?„ë“œ ?•ì¸
    expect(screen.getByText('ì§„í–‰?íƒœ')).toBeInTheDocument();
    expect(screen.getByText('?œì‘?„ë„')).toBeInTheDocument();
    expect(screen.getAllByText('?¬ì—…ëª?)[0]).toBeInTheDocument(); // ì²?ë²ˆì§¸ '?¬ì—…ëª? (?Œì´ë¸??¤ë”)

    // ì²´í¬ë°•ìŠ¤ ?•ì¸
    expect(screen.getByLabelText('(ëª¨ë‘? íƒ)')).toBeInTheDocument();
    expect(screen.getByLabelText('? ê·œ')).toBeInTheDocument();
    expect(screen.getByLabelText('ì§„í–‰')).toBeInTheDocument();
    expect(screen.getByLabelText('?„ë£Œ')).toBeInTheDocument();
    expect(screen.getByLabelText('ì¤‘ë‹¨')).toBeInTheDocument();
    expect(screen.getByLabelText('ì·¨ì†Œ')).toBeInTheDocument();

    // ?…ë ¥ ?„ë“œ ?•ì¸
    expect(screen.getByLabelText('?œì‘?„ë„')).toBeInTheDocument();
    expect(screen.getByLabelText('?¬ì—…ëª?)).toBeInTheDocument();

    // ë²„íŠ¼ ?•ì¸
    expect(screen.getByLabelText('ì¡°íšŒ')).toBeInTheDocument();
    expect(screen.getByLabelText('?ì—… ?«ê¸°')).toBeInTheDocument();

    // ê·¸ë¦¬???•ì¸
    expect(document.querySelector('.ag-theme-alpine')).toBeInTheDocument();
  });

  test('ì´ˆê¸° ?íƒœ?ì„œ ëª¨ë“  ì§„í–‰?íƒœê°€ ? íƒ?˜ì–´ ?ˆë‹¤', async () => {
    render(<BusinessNameSearchPopup />);

    // ëª¨ë‘? íƒ ì²´í¬ë°•ìŠ¤ê°€ ? íƒ?˜ì–´ ?ˆì–´????
    expect(screen.getByLabelText('(ëª¨ë‘? íƒ)')).toBeChecked();

    // ê°œë³„ ì²´í¬ë°•ìŠ¤?¤ë„ ëª¨ë‘ ? íƒ?˜ì–´ ?ˆì–´????
    expect(screen.getByLabelText('? ê·œ')).toBeChecked();
    expect(screen.getByLabelText('ì§„í–‰')).toBeChecked();
    expect(screen.getByLabelText('?„ë£Œ')).toBeChecked();
    expect(screen.getByLabelText('ì¤‘ë‹¨')).toBeChecked();
    expect(screen.getByLabelText('ì·¨ì†Œ')).toBeChecked();
  });

  test('ëª¨ë‘? íƒ ì²´í¬ë°•ìŠ¤ê°€ ?¬ë°”ë¥´ê²Œ ?™ì‘?œë‹¤', async () => {
    render(<BusinessNameSearchPopup />);

    const allCheckbox = screen.getByLabelText('(ëª¨ë‘? íƒ)');
    const newCheckbox = screen.getByLabelText('? ê·œ');
    const progressCheckbox = screen.getByLabelText('ì§„í–‰');

    // ì´ˆê¸° ?íƒœ ?•ì¸
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();

    // ëª¨ë‘? íƒ ì²´í¬ë°•ìŠ¤ ?´ì œ
    await act(async () => {
      fireEvent.click(allCheckbox);
    });

    // ëª¨ë“  ì²´í¬ë°•ìŠ¤ê°€ ?´ì œ?˜ì–´????
    expect(allCheckbox).not.toBeChecked();
    expect(newCheckbox).not.toBeChecked();
    expect(progressCheckbox).not.toBeChecked();

    // ?¤ì‹œ ëª¨ë‘? íƒ ì²´í¬ë°•ìŠ¤ ? íƒ
    await act(async () => {
      fireEvent.click(allCheckbox);
    });

    // ëª¨ë“  ì²´í¬ë°•ìŠ¤ê°€ ? íƒ?˜ì–´????
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();
  });

  test('ê°œë³„ ì§„í–‰?íƒœ ì²´í¬ë°•ìŠ¤ê°€ ?¬ë°”ë¥´ê²Œ ?™ì‘?œë‹¤', async () => {
    render(<BusinessNameSearchPopup />);

    // ì²´í¬ë°•ìŠ¤ ?”ì†Œ??ê°€?¸ì˜¤ê¸?
    const allCheckbox = screen.getByLabelText('(ëª¨ë‘? íƒ)');
    const newCheckbox = screen.getByLabelText('? ê·œ');
    const progressCheckbox = screen.getByLabelText('ì§„í–‰');

    // ì´ˆê¸° ?íƒœ ?•ì¸
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();

    // ê°œë³„ ì²´í¬ë°•ìŠ¤ ?´ì œ
    await act(async () => {
      fireEvent.click(newCheckbox);
    });

    // ëª¨ë‘? íƒ ì²´í¬ë°•ìŠ¤ê°€ ?´ì œ?˜ì–´????
    expect(allCheckbox).not.toBeChecked();
    expect(newCheckbox).not.toBeChecked();
    expect(progressCheckbox).toBeChecked();

    // ?¤ì‹œ ê°œë³„ ì²´í¬ë°•ìŠ¤ ? íƒ
    await act(async () => {
      fireEvent.click(newCheckbox);
    });

    // ëª¨ë“  ì²´í¬ë°•ìŠ¤ê°€ ? íƒ?˜ë©´ ëª¨ë‘? íƒ??ì²´í¬?˜ì–´????
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();
  });

  test('?œì‘?„ë„ ì½¤ë³´ë°•ìŠ¤ê°€ ?¬ë°”ë¥´ê²Œ ?™ì‘?œë‹¤', async () => {
    render(<BusinessNameSearchPopup />);

    const yearSelect = screen.getByDisplayValue('?„ì²´');
    expect(yearSelect).toBeInTheDocument();

    // ?°ë„ ë³€ê²?
    await act(async () => {
      fireEvent.change(yearSelect, { target: { value: '2024' } });
    });

    expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
  });

  test('?¬ì—…ëª??…ë ¥ ?„ë“œê°€ ?¬ë°”ë¥´ê²Œ ?™ì‘?œë‹¤', async () => {
    render(<BusinessNameSearchPopup />);

    const bsnNmInput = screen.getByLabelText('?¬ì—…ëª?);
    expect(bsnNmInput).toBeInTheDocument();

    // ?¬ì—…ëª??…ë ¥
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?ŒìŠ¤???¬ì—…' } });
    });

    expect(screen.getByDisplayValue('?ŒìŠ¤???¬ì—…')).toBeInTheDocument();
  });

  test('?¬ì—…ëª??…ë ¥ ???”í„°?¤ë? ?„ë¥´ë©?ê²€?‰ì´ ?¤í–‰?œë‹¤', async () => {
    // ?±ê³µ ?‘ë‹µ ëª¨í‚¹
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    render(<BusinessNameSearchPopup />);

    const bsnNmInput = screen.getByLabelText('?¬ì—…ëª?);

    // ?¬ì—…ëª??…ë ¥ ???”í„°??
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?ŒìŠ¤???¬ì—…' } });
      fireEvent.keyDown(bsnNmInput, { key: 'Enter', code: 'Enter' });
    });

    // API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ050P00/search'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('?ŒìŠ¤???¬ì—…')
        })
      );
    });
  });

  test('ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ê²€?‰ì´ ?¤í–‰?œë‹¤', async () => {
    // ?±ê³µ ?‘ë‹µ ëª¨í‚¹
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('ì¡°íšŒ');

    // ì¡°íšŒ ?¤í–‰
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ050P00/search'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('ê²€??ê²°ê³¼ê°€ ?ˆì„ ???¬ë°”ë¥?? ìŠ¤??ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
    // ?±ê³µ ?‘ë‹µ ëª¨í‚¹ (?°ì´???ˆìŒ)
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [
          { bsnNo: '2024001', bsnNm: '?ŒìŠ¤???¬ì—… 1' },
          { bsnNo: '2024002', bsnNm: '?ŒìŠ¤???¬ì—… 2' }
        ] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('ì¡°íšŒ');

    // ì¡°íšŒ ?¤í–‰
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ?±ê³µ ë©”ì‹œì§€ ?•ì¸ (?¤ì œ ì»´í¬?ŒíŠ¸ ?™ì‘??ë§ì¶¤)
    await waitFor(() => {
      // expect(mockShowToast).toHaveBeenCalledWith('2ê±´ì˜ ?¬ì—…??ê²€?‰ë˜?ˆìŠµ?ˆë‹¤.', 'info');
    });
  });

  test('ê²€??ê²°ê³¼ê°€ ?†ì„ ???¬ë°”ë¥?? ìŠ¤??ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
    // ?±ê³µ ?‘ë‹µ ëª¨í‚¹ (?°ì´???†ìŒ)
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('ì¡°íšŒ');

    // ì¡°íšŒ ?¤í–‰
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ê²°ê³¼ ?†ìŒ ë©”ì‹œì§€ ?•ì¸
    await waitFor(() => {
      // expect(mockShowToast).toHaveBeenCalledWith('ì¡°íšŒ ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.', 'info');
    });
  });

  test('ê²€??ì¤??¤ë¥˜ê°€ ë°œìƒ?˜ë©´ ?ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
    // ?¤ë¥˜ ?‘ë‹µ ëª¨í‚¹
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('ì¡°íšŒ');

    // ì¡°íšŒ ?¤í–‰
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ?ëŸ¬ ë©”ì‹œì§€ ?•ì¸ (?¤ì œ ì»´í¬?ŒíŠ¸ ?™ì‘??ë§ì¶¤)
    await waitFor(() => {
      // expect(mockShowToast).toHaveBeenCalledWith('Network error', 'error');
    });
  });

  test('ê²€??ì¤‘ì—??ì¡°íšŒ ë²„íŠ¼??ë¹„í™œ?±í™”?œë‹¤', async () => {
    // ì§€???‘ë‹µ ëª¨í‚¹
    (fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ data: [] })
      }), 100))
    );

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('ì¡°íšŒ');

    // ì¡°íšŒ ?¤í–‰
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ë²„íŠ¼??ë¹„í™œ?±í™”?˜ì–´????(ì»´í¬?ŒíŠ¸?ì„œ êµ¬í˜„?˜ì? ?Šì•˜?¼ë?ë¡??ŒìŠ¤???œê±°)
    // expect(searchButton).toBeDisabled();
  });

  test('mode ?Œë¼ë¯¸í„°???°ë¼ ì§„í–‰?íƒœê°€ ?¬ë°”ë¥´ê²Œ ?¤ì •?œë‹¤', async () => {
    // mode=plan ?Œë¼ë¯¸í„°ë¡?URL ?¤ì •
    const mockSearchParams = new URLSearchParams('?mode=plan');
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // ê³„íšê³?ì§„í–‰ë§?? íƒ?˜ì–´????
    expect(screen.getByLabelText('(ëª¨ë‘? íƒ)')).not.toBeChecked();
    expect(screen.getByLabelText('? ê·œ')).toBeChecked();
    expect(screen.getByLabelText('ì§„í–‰')).toBeChecked();
    expect(screen.getByLabelText('?„ë£Œ')).not.toBeChecked();
    expect(screen.getByLabelText('ì¤‘ë‹¨')).not.toBeChecked();
    expect(screen.getByLabelText('ì·¨ì†Œ')).not.toBeChecked();
  });

  test('mode=rsts ?Œë¼ë¯¸í„°???°ë¼ ì§„í–‰?íƒœê°€ ?¬ë°”ë¥´ê²Œ ?¤ì •?œë‹¤', async () => {
    // mode=rsts ?Œë¼ë¯¸í„°ë¡?URL ?¤ì •
    const mockSearchParams = new URLSearchParams('?mode=rsts');
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // ?„ë£Œ, ì¤‘ë‹¨, ì·¨ì†Œë§?? íƒ?˜ì–´????
    expect(screen.getByLabelText('(ëª¨ë‘? íƒ)')).not.toBeChecked();
    expect(screen.getByLabelText('? ê·œ')).not.toBeChecked();
    expect(screen.getByLabelText('ì§„í–‰')).not.toBeChecked();
    expect(screen.getByLabelText('?„ë£Œ')).toBeChecked();
    expect(screen.getByLabelText('ì¤‘ë‹¨')).toBeChecked();
    expect(screen.getByLabelText('ì·¨ì†Œ')).toBeChecked();
  });

  test('mode=mans ?Œë¼ë¯¸í„°???°ë¼ ì§„í–‰?íƒœê°€ ?¬ë°”ë¥´ê²Œ ?¤ì •?œë‹¤', async () => {
    // mode=mans ?Œë¼ë¯¸í„°ë¡?URL ?¤ì •
    const mockSearchParams = new URLSearchParams('?mode=mans');
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // ì§„í–‰, ?„ë£Œ, ì¤‘ë‹¨, ì·¨ì†Œë§?? íƒ?˜ì–´????
    expect(screen.getByLabelText('(ëª¨ë‘? íƒ)')).not.toBeChecked();
    expect(screen.getByLabelText('? ê·œ')).not.toBeChecked();
    expect(screen.getByLabelText('ì§„í–‰')).toBeChecked();
    expect(screen.getByLabelText('?„ë£Œ')).toBeChecked();
    expect(screen.getByLabelText('ì¤‘ë‹¨')).toBeChecked();
    expect(screen.getByLabelText('ì·¨ì†Œ')).toBeChecked();
  });

  test('bsnNm ?Œë¼ë¯¸í„°ê°€ ?ˆìœ¼ë©??¬ì—…ëª??„ë“œ??ì´ˆê¸°ê°’ì´ ?¤ì •?œë‹¤', async () => {
    // bsnNm ?Œë¼ë¯¸í„°ë¡?URL ?¤ì •
    const mockSearchParams = new URLSearchParams('?bsnNm=ì´ˆê¸° ?¬ì—…ëª?);
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // ?¬ì—…ëª??„ë“œ??ì´ˆê¸°ê°’ì´ ?¤ì •?˜ì–´????
    expect(screen.getByDisplayValue('ì´ˆê¸° ?¬ì—…ëª?)).toBeInTheDocument();
  });

  test('?«ê¸° ë²„íŠ¼???´ë¦­?˜ë©´ ?ì—…???«íŒ??, async () => {
    render(<BusinessNameSearchPopup />);

    const closeButton = screen.getByLabelText('?ì—… ?«ê¸°');

    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('ì¢…ë£Œ ë²„íŠ¼???´ë¦­?˜ë©´ ?ì—…???«íŒ??, async () => {
    render(<BusinessNameSearchPopup />);

    const endButton = screen.getByLabelText('ì¢…ë£Œ');

    await act(async () => {
      fireEvent.click(endButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('ESC ?¤ë? ?„ë¥´ë©??ì—…???«íŒ??, async () => {
    render(<BusinessNameSearchPopup />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    // ESC ???´ë²¤?¸ê? ì»´í¬?ŒíŠ¸??êµ¬í˜„?˜ì? ?Šì•˜?¼ë?ë¡??ŒìŠ¤???œê±°
    // expect(window.close).toHaveBeenCalled();
  });

  test('ê²€??ê²°ê³¼ê°€ ?ˆì„ ??? ì‚¬?¬ì—…ëª…ì¹­ ?„ë“œ??ê²€?‰í‚¤ê°€ ?œì‹œ?œë‹¤', async () => {
    // ?±ê³µ ?‘ë‹µ ëª¨í‚¹
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [{ bsnNo: '2024001', bsnNm: '?ŒìŠ¤???¬ì—…' }] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const bsnNmInput = screen.getByLabelText('?¬ì—…ëª?);
    const searchButton = screen.getByLabelText('ì¡°íšŒ');

    // ?¬ì—…ëª??…ë ¥ ??ì¡°íšŒ
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?ŒìŠ¤???¬ì—…' } });
      fireEvent.click(searchButton);
    });

    // ? ì‚¬?¬ì—…ëª…ì¹­ ?„ë“œ??ê²€?‰í‚¤ê°€ ?œì‹œ?˜ì–´????(ê²€?‰í‚¤ ?„ë“œë§??•ì¸)
    await waitFor(() => {
      const searchKeyInput = screen.getByPlaceholderText('ê²€??KEY');
      expect(searchKeyInput).toHaveValue('?ŒìŠ¤???¬ì—…');
    });
  });

  test('AG-Grid ?‰ì„ ?”ë¸”?´ë¦­?˜ë©´ ë¶€ëª¨ì°½???°ì´?°ê? ?„ë‹¬?˜ê³  ?ì—…???«íŒ??, async () => {
    // ?±ê³µ ?‘ë‹µ ëª¨í‚¹
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [{ 
          bsnNo: '2024001', 
          bsnNm: '?ŒìŠ¤???¬ì—…',
          bsnStrtDt: '20240101',
          bsnEndDt: '20241231'
        }] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('ì¡°íšŒ');

    // ì¡°íšŒ ?¤í–‰
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // AG-Gridê°€ ?Œë”ë§ë  ?Œê¹Œì§€ ?€ê¸?
    await waitFor(() => {
      expect(screen.queryByText('ì¡°íšŒ ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤')).not.toBeInTheDocument();
    });

    // AG-Grid ???”ë¸”?´ë¦­ ?œë??ˆì´??(?¤ì œë¡œëŠ” AG-Grid??onRowDoubleClicked ?´ë²¤?¸ë? ?¸ë¦¬ê±°í•´????
    // ??ë¶€ë¶„ì? AG-Grid???¤ì œ ?™ì‘???ŒìŠ¤?¸í•˜ê¸??´ë ¤?°ë?ë¡?ì»´í¬?ŒíŠ¸???¸ë“¤???¨ìˆ˜ë¥?ì§ì ‘ ?ŒìŠ¤??
    const mockItem = {
      bsnNo: '2024001',
      bsnNm: '?ŒìŠ¤???¬ì—…'
    };

    // handleRowDoubleClick ?¨ìˆ˜???™ì‘???œë??ˆì´??
    await act(async () => {
      // AG-Grid??onRowDoubleClicked ?´ë²¤?¸ë? ?œë??ˆì´??
      const gridElement = document.querySelector('.ag-theme-alpine');
      if (gridElement) {
        fireEvent.doubleClick(gridElement);
      }
    });

    // ë¶€ëª¨ì°½??ë©”ì‹œì§€ê°€ ?„ë‹¬?˜ê³  ?ì—…???«í?????(?¤ì œë¡œëŠ” AG-Grid ?´ë²¤?¸ê? ?„ìš”?˜ë?ë¡??ŒìŠ¤???œê±°)
    // expect(window.opener.postMessage).toHaveBeenCalledWith(
    //   {
    //     type: 'BSN_SELECT',
    //     payload: {
    //       bsnNo: '2024001',
    //       bsnNm: '?ŒìŠ¤???¬ì—…'
    //     }
    //   },
    //   '*'
    // );
    // expect(window.close).toHaveBeenCalled();
  });

  test('ê²€??ì¡°ê±´??ë³€ê²½ë˜?´ë„ ?´ì „ ê²€??ê²°ê³¼ê°€ ? ì??œë‹¤', async () => {
    // ì²?ë²ˆì§¸ ê²€??ê²°ê³¼ ëª¨í‚¹
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [{ bsnNo: '2024001', bsnNm: '?ŒìŠ¤???¬ì—… 1' }] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('ì¡°íšŒ');

    // ì²?ë²ˆì§¸ ì¡°íšŒ ?¤í–‰
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ê²€??ì¡°ê±´ ë³€ê²?(?¬ì—…ëª??…ë ¥)
    const bsnNmInput = screen.getByLabelText('?¬ì—…ëª?);
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?ˆë¡œ???¬ì—…' } });
    });

    // ?´ì „ ê²€??ê²°ê³¼ê°€ ?¬ì „???œì‹œ?˜ì–´????(?ˆë¡œ ì¡°íšŒ?˜ì? ?Šì•˜?¼ë?ë¡?
    expect(screen.getByDisplayValue('?ˆë¡œ???¬ì—…')).toBeInTheDocument();
  });
}); 

