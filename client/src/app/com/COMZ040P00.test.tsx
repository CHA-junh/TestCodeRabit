import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@/test/test-utils';
import ProjectSearchPopup from './COMZ040P00';

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
const mockUseAuth = jest.fn();
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  ...jest.requireActual('@/modules/auth/hooks/useAuth'),
  useAuth: () => mockUseAuth()
}));

// Mock useToast hook
const mockShowToast = jest.fn();
jest.mock('@/contexts/ToastContext', () => ({
  ...jest.requireActual('@/contexts/ToastContext'),
  useToast: () => ({
    showToast: mockShowToast
  })
}));

// Mock useCommonCodes hook
jest.mock('@/modules/auth/hooks/useCommonCodes', () => ({
  useCommonCodes: () => ({
    hqDivCodes: [
      { code: '01', name: 'ê²½ì˜ì§€?ë³¸ë¶€' },
      { code: '02', name: '?ì—…ë³¸ë?' },
      { code: '03', name: '?œë¹„?¤ì‚¬?…ë³¸ë¶€' },
      { code: '04', name: 'ê°œë°œë³¸ë?' }
    ],
    loading: false,
    error: null
  }),
  useDeptByHq: () => [
    { code: '0201', name: '?ì—…1?€' },
    { code: '0202', name: '?ì—…2?€' },
    { code: '0203', name: '?ì—…3?€' }
  ]
}));

// Mock AG-Grid
jest.mock('ag-grid-react', () => ({
  AgGridReact: ({ rowData, onSelectionChanged, onRowDoubleClicked, onGridReady }: any) => {
    React.useEffect(() => {
      if (onGridReady) {
        onGridReady({ api: { sizeColumnsToFit: jest.fn() } });
      }
    }, [onGridReady]);

    return (
      <div data-testid="ag-grid">
        {rowData?.map((row: any, index: number) => (
          <div 
            key={row.bsnNo} 
            data-testid={`grid-row-${index}`}
            onClick={() => onSelectionChanged?.({ api: { getSelectedRows: () => [row] } })}
            onDoubleClick={() => onRowDoubleClicked?.({ data: row })}
          >
            <span data-testid="bsn-no">{row.bsnNo}</span>
            <span data-testid="bsn-nm">{row.bsnNm}</span>
            <span data-testid="pm-nm">{row.pmNm}</span>
          </div>
        ))}
      </div>
    );
  }
}));

// Mock AG-Grid styles
jest.mock('ag-grid-community/styles/ag-grid.css', () => ({}));
jest.mock('ag-grid-community/styles/ag-theme-alpine.css', () => ({}));

describe('COMZ040P00 - ?¬ì—…ë²ˆí˜¸ê²€?‰í™”ë©??ŒìŠ¤??, () => {
  const mockBusinessData = [
    {
      bsnNo: '2025-001',
      bsnNm: '?ŒìŠ¤???¬ì—… 1',
      bizRepnm: '?ì—…?€??',
      bizRepid: 'SALES001',
      bizRepemail: 'sales1@test.com',
      pmNm: 'PM1',
      pmId: 'PM001',
      bsnStrtDt: '20250101',
      bsnEndDt: '20251231',
      bsnDeptKb: 'BIZ',
      pplsDeptNm: '?ì—…1?€',
      pplsDeptCd: '0201',
      execDeptNm: 'ê°œë°œ1?€',
      execDeptCd: '0401',
      pgrsStDiv: '2',
      pgrsStDivNm: '?ì—…ì§„í–‰'
    },
    {
      bsnNo: '2025-002',
      bsnNm: '?ŒìŠ¤???¬ì—… 2',
      bizRepnm: '?ì—…?€??',
      bizRepid: 'SALES002',
      bizRepemail: 'sales2@test.com',
      pmNm: 'PM2',
      pmId: 'PM002',
      bsnStrtDt: '20250201',
      bsnEndDt: '20251130',
      bsnDeptKb: 'BIZ',
      pplsDeptNm: '?ì—…2?€',
      pplsDeptCd: '0202',
      execDeptNm: 'ê°œë°œ2?€',
      execDeptCd: '0402',
      pgrsStDiv: '3',
      pgrsStDivNm: '?˜ì£¼?•ì •'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // ê¸°ë³¸ ?¬ìš©???•ë³´ ?¤ì • (ë¶€?œì¥ ê¶Œí•œ)
    mockUseAuth.mockReturnValue({
      user: {
        userId: '10757',
        empNo: '10757',
        name: 'ì°¨ì???,
        authCd: '10', // ë¶€?œì¥ ê¶Œí•œ
        hqDivCd: '02', // ?ì—…ë³¸ë?
        deptDivCd: '0201', // ?ì—…1?€
        deptTp: 'BIZ', // ?ì—…ë¶€??
        dutyDivCd: '1' // ?¼ë°˜ì§ì›
      }
    });

    // Mock fetch ?‘ë‹µ ?¤ì •
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockBusinessData,
        message: 'ì¡°íšŒê°€ ?„ë£Œ?˜ì—ˆ?µë‹ˆ??'
      })
    });
  });

  test('?¬ìš©?ê? ?¬ì—…ë²ˆí˜¸ê²€???”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???œì‹œ?œë‹¤', async () => {
    render(<ProjectSearchPopup />);

    // ?¤ë” ?•ì¸
    expect(screen.getByText('?¬ì—…ë²ˆí˜¸ê²€??)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '?«ê¸°' })).toBeInTheDocument();

    // ì¡°íšŒêµ¬ë¶„ ?¼ë””??ë²„íŠ¼ ?•ì¸
    expect(screen.getByLabelText('?„ì²´')).toBeInTheDocument();
    expect(screen.getByLabelText('?¬ì—…ë¶€??)).toBeInTheDocument();
    expect(screen.getByLabelText('?¤í–‰ë¶€??)).toBeInTheDocument();

    // ê²€??ì¡°ê±´ ?„ë“œ ?•ì¸
    expect(screen.getByText('ë³¸ë?')).toBeInTheDocument();
    expect(screen.getByText('ì¶”ì§„ë¶€??)).toBeInTheDocument();
    expect(screen.getByText('?ì—…?€??)).toBeInTheDocument();
    expect(screen.getByText('ì§„í–‰?íƒœ')).toBeInTheDocument();
    expect(screen.getByText('?¬ì—…?„ë„')).toBeInTheDocument();
    expect(screen.getByText('?¬ì—…ë²ˆí˜¸')).toBeInTheDocument();

    // ì¡°íšŒ ë²„íŠ¼ ?•ì¸
    expect(screen.getByRole('button', { name: 'ì¡°íšŒ' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ì¢…ë£Œ' })).toBeInTheDocument();

    // AG-Grid ?•ì¸
    expect(screen.getByTestId('ag-grid')).toBeInTheDocument();
  });

  test('ê¶Œí•œ???°ë¥¸ ì¡°íšŒêµ¬ë¶„ ê¸°ë³¸ê°’ì´ ?¬ë°”ë¥´ê²Œ ?¤ì •?œë‹¤', async () => {
    render(<ProjectSearchPopup />);

    // ë¶€?œì¥ ê¶Œí•œ?´ë?ë¡??¬ì—…ë¶€?œê? ê¸°ë³¸ ? íƒ?˜ì–´????
    await waitFor(() => {
      expect(screen.getByLabelText('?¬ì—…ë¶€??)).toBeChecked();
    }, { timeout: 3000 });
  });

  test('ì¡°íšŒêµ¬ë¶„ ë³€ê²???ê´€???„ë“œ?¤ì´ ?¬ë°”ë¥´ê²Œ ?…ë°?´íŠ¸?œë‹¤', async () => {
    render(<ProjectSearchPopup />);

    // ?„ì²´ ? íƒ
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?„ì²´'));
    });

    // ë³¸ë?ê°€ '?„ì²´'ë¡?ë³€ê²½ë˜ê³?ë¹„í™œ?±í™”?˜ì–´????
    const hqSelect = screen.getAllByDisplayValue('?„ì²´')[0]; // ì²?ë²ˆì§¸ '?„ì²´' ê°?(ë³¸ë?)
    expect(hqSelect).toBeDisabled();

    // ?¬ì—…ë¶€??? íƒ
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?¬ì—…ë¶€??));
    });

    // ë³¸ë?ê°€ ?¬ìš©??ë³¸ë?ë¡??¤ì •?˜ê³  ?œì„±?”ë˜?´ì•¼ ??
    expect(screen.getByDisplayValue('?ì—…ë³¸ë?')).not.toBeDisabled();
  });

  test('ë³¸ë? ë³€ê²???ë¶€??ëª©ë¡???…ë°?´íŠ¸?œë‹¤', async () => {
    render(<ProjectSearchPopup />);

    // ?¬ì—…ë¶€??? íƒ
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?¬ì—…ë¶€??));
    });

    // ë³¸ë? ë³€ê²?
    const hqSelect = screen.getByDisplayValue('?ì—…ë³¸ë?');
    await act(async () => {
      fireEvent.change(hqSelect, { target: { value: '03' } });
    });

    // ë¶€?œê? '?„ì²´'ë¡?ë¦¬ì…‹?˜ì–´????(?œë¹„?¤ì‚¬?…ë³¸ë¶€ë¡?ë³€ê²½ë¨)
    await waitFor(() => {
      const deptSelect = screen.getAllByDisplayValue('?„ì²´')[1]; // ??ë²ˆì§¸ '?„ì²´' ê°?(ë¶€??
      expect(deptSelect).toBeInTheDocument();
    });
  });

  test('ì§„í–‰?íƒœ ì²´í¬ë°•ìŠ¤?¤ì´ ?¬ë°”ë¥´ê²Œ ?™ì‘?œë‹¤', async () => {
    render(<ProjectSearchPopup />);

    // ëª¨ë‘? íƒ ì²´í¬ë°•ìŠ¤
    const allCheckbox = screen.getByLabelText('(ëª¨ë‘? íƒ)');
    expect(allCheckbox).toBeChecked();

    // ê°œë³„ ì²´í¬ë°•ìŠ¤??
    const newCheckbox = screen.getByLabelText('? ê·œ');
    const salesCheckbox = screen.getByLabelText('?ì—…ì§„í–‰');
    const confirmedCheckbox = screen.getByLabelText('?˜ì£¼?•ì •');

    // ê°œë³„ ì²´í¬ë°•ìŠ¤ ?´ì œ
    await act(async () => {
      fireEvent.click(newCheckbox);
    });

    // ëª¨ë‘? íƒ???´ì œ?˜ì–´????
    expect(allCheckbox).not.toBeChecked();

    // ?¤ì‹œ ëª¨ë‘? íƒ
    await act(async () => {
      fireEvent.click(allCheckbox);
    });

    // ëª¨ë“  ê°œë³„ ì²´í¬ë°•ìŠ¤ê°€ ? íƒ?˜ì–´????
    expect(newCheckbox).toBeChecked();
    expect(salesCheckbox).toBeChecked();
    expect(confirmedCheckbox).toBeChecked();
  });

  test('?¬ìš©?ê? ê²€??ì¡°ê±´???…ë ¥?˜ê³  ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ê²€?‰ì´ ?¤í–‰?œë‹¤', async () => {
    render(<ProjectSearchPopup />);

    // ?¬ì—…ë²ˆí˜¸ ?…ë ¥
    const bsnNoInput = screen.getByLabelText('?¬ì—…ë²ˆí˜¸ ?…ë ¥');
    await act(async () => {
      fireEvent.change(bsnNoInput, { target: { value: '2025-001' } });
    });

    // ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
    const searchButton = screen.getByRole('button', { name: 'ì¡°íšŒ' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ040P00/search'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: expect.stringContaining('2025-001')
        })
      );
    });
  });

  test('?¬ìš©?ê? ?”í„°?¤ë? ?„ë¥´ë©?ê²€?‰ì´ ?¤í–‰?œë‹¤', async () => {
    render(<ProjectSearchPopup />);

    // ?¬ì—…ë²ˆí˜¸ ?…ë ¥ ???”í„°??
    const bsnNoInput = screen.getByLabelText('?¬ì—…ë²ˆí˜¸ ?…ë ¥');
    await act(async () => {
      fireEvent.change(bsnNoInput, { target: { value: '2025-001' } });
      fireEvent.keyDown(bsnNoInput, { key: 'Enter', code: 'Enter' });
    });

    // API ?¸ì¶œ ?•ì¸
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  test('ê²€??ê²°ê³¼ê°€ ê·¸ë¦¬?œì— ?œì‹œ?œë‹¤', async () => {
    render(<ProjectSearchPopup />);

    // ì¡°íšŒ ?¤í–‰
    const searchButton = screen.getByRole('button', { name: 'ì¡°íšŒ' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ê²€??ê²°ê³¼ ?•ì¸
    await waitFor(() => {
      expect(screen.getByTestId('grid-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('grid-row-1')).toBeInTheDocument();
      expect(screen.getByText('2025-001')).toBeInTheDocument();
      expect(screen.getByText('?ŒìŠ¤???¬ì—… 1')).toBeInTheDocument();
      expect(screen.getByText('PM1')).toBeInTheDocument();
    });
  });

  test('?¬ìš©?ê? ê·¸ë¦¬?œì—???‰ì„ ?´ë¦­?˜ë©´ ? íƒ?œë‹¤', async () => {
    render(<ProjectSearchPopup />);

    // ì¡°íšŒ ?¤í–‰
    const searchButton = screen.getByRole('button', { name: 'ì¡°íšŒ' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ì²?ë²ˆì§¸ ???´ë¦­
    await waitFor(() => {
      const firstRow = screen.getByTestId('grid-row-0');
      fireEvent.click(firstRow);
    });

    // ? íƒ???‰ì˜ ?°ì´???•ì¸
    expect(screen.getByText('2025-001')).toBeInTheDocument();
  });

  test('?¬ìš©?ê? ê·¸ë¦¬?œì—???‰ì„ ?”ë¸”?´ë¦­?˜ë©´ ?¬ì—…??? íƒ?˜ê³  ?ì—…???«íŒ??, async () => {
    render(<ProjectSearchPopup />);

    // ì¡°íšŒ ?¤í–‰
    const searchButton = screen.getByRole('button', { name: 'ì¡°íšŒ' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ì²?ë²ˆì§¸ ???”ë¸”?´ë¦­
    await waitFor(() => {
      const firstRow = screen.getByTestId('grid-row-0');
      fireEvent.doubleClick(firstRow);
    });

    // ë¶€ëª¨ì°½??ë©”ì‹œì§€ ?„ì†¡ ?•ì¸
    expect(window.opener.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'BUSINESS_SELECT',
        data: expect.objectContaining({
          bsnNo: '2025-001',
          bsnNm: '?ŒìŠ¤???¬ì—… 1'
        })
      }),
      '*'
    );

    // ?ì—… ?«ê¸° ?•ì¸
    expect(window.close).toHaveBeenCalled();
  });

  test('ê²€??ê²°ê³¼ê°€ ?†ì„ ???ì ˆ??ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
    // ë¹?ê²°ê³¼ ëª¨í‚¹
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
        message: 'ì¡°íšŒ ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.'
      })
    });

    render(<ProjectSearchPopup />);

    // ì¡°íšŒ ?¤í–‰
    const searchButton = screen.getByRole('button', { name: 'ì¡°íšŒ' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ë©”ì‹œì§€ ?•ì¸
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('ì¡°íšŒ ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.', 'info');
    });
  });

  test('ê²€??ì¤??¤ë¥˜ê°€ ë°œìƒ?˜ë©´ ?ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
    // ?¤ë¥˜ ?‘ë‹µ ëª¨í‚¹
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<ProjectSearchPopup />);

    // ì¡°íšŒ ?¤í–‰
    const searchButton = screen.getByRole('button', { name: 'ì¡°íšŒ' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ?ëŸ¬ ë©”ì‹œì§€ ?•ì¸
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error');
    });
  });

  test('ESC ?¤ë? ?„ë¥´ë©??ì—…???«íŒ??, async () => {
    render(<ProjectSearchPopup />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('?«ê¸° ë²„íŠ¼???´ë¦­?˜ë©´ ?ì—…???«íŒ??, async () => {
    render(<ProjectSearchPopup />);

    const closeButton = screen.getByRole('button', { name: '?«ê¸°' });
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('ì¢…ë£Œ ë²„íŠ¼???´ë¦­?˜ë©´ ?ì—…???«íŒ??, async () => {
    render(<ProjectSearchPopup />);

    const endButton = screen.getByRole('button', { name: 'ì¢…ë£Œ' });
    await act(async () => {
      fireEvent.click(endButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('ë¡œë”© ì¤‘ì—??ì¡°íšŒ ë²„íŠ¼??ë¹„í™œ?±í™”?œë‹¤', async () => {
    // ?ë¦° ?‘ë‹µ???œë??ˆì´?˜í•˜ê¸??„í•´ Promiseë¥?ì§€?°ì‹œ??
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch as jest.Mock).mockReturnValue(delayedPromise);

    render(<ProjectSearchPopup />);

    const searchButton = screen.getByRole('button', { name: 'ì¡°íšŒ' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ë¡œë”© ?íƒœ?ì„œ ë²„íŠ¼??ë¹„í™œ?±í™”?˜ì—ˆ?”ì? ?•ì¸
    expect(searchButton).toBeDisabled();
    expect(searchButton).toHaveTextContent('ì¡°íšŒì¤?..');

    // Promise ?´ê²°
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    await waitFor(() => {
      expect(searchButton).not.toBeDisabled();
      expect(searchButton).toHaveTextContent('ì¡°íšŒ');
    });
  });

  test('ê¶Œí•œë³„ë¡œ ì¡°íšŒêµ¬ë¶„???¬ë°”ë¥´ê²Œ ?¤ì •?œë‹¤', async () => {
    // PM ê¶Œí•œ?¼ë¡œ ëª¨í‚¹
    mockUseAuth.mockReturnValue({
      user: {
        userId: 'PM001',
        empNo: 'PM001',
        name: 'PM1',
        authCd: '30', // PM ê¶Œí•œ
        hqDivCd: '04', // ê°œë°œë³¸ë?
        deptDivCd: '0401', // ê°œë°œ1?€
        deptTp: 'DEV', // ê°œë°œë¶€??
        dutyDivCd: '1'
      }
    });

    render(<ProjectSearchPopup />);

    // PM ê¶Œí•œ?´ë?ë¡??¤í–‰ë¶€?œê? ê¸°ë³¸ ? íƒ?˜ì–´????
    await waitFor(() => {
      expect(screen.getByLabelText('?¤í–‰ë¶€??)).toBeChecked();
    }, { timeout: 3000 });
  });

  test('PM ê¶Œí•œ?¼ë¡œ ?¤ë¥¸ PM???¬ì—…??? íƒ?˜ë ¤ê³??˜ë©´ ê²½ê³ ê°€ ?œì‹œ?œë‹¤', async () => {
    // PM ê¶Œí•œ?¼ë¡œ ëª¨í‚¹
    mockUseAuth.mockReturnValue({
      user: {
        userId: 'PM001',
        empNo: 'PM001',
        name: 'PM1',
        authCd: '30',
        hqDivCd: '04',
        deptDivCd: '0401',
        deptTp: 'DEV',
        dutyDivCd: '1'
      }
    });

    render(<ProjectSearchPopup />);

    // ì¡°íšŒ ?¤í–‰
    const searchButton = screen.getByRole('button', { name: 'ì¡°íšŒ' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // PM2???¬ì—…???”ë¸”?´ë¦­ (PM1???„ë‹Œ ?¬ì—…)
    await waitFor(() => {
      const secondRow = screen.getByTestId('grid-row-1');
      fireEvent.doubleClick(secondRow);
    });

    // ê²½ê³  ë©”ì‹œì§€ ?•ì¸
    expect(mockShowToast).toHaveBeenCalledWith(
      '?´ë‹¹ ?¬ì—…??PM???„ë‹™?ˆë‹¤. ? íƒ?????†ìŠµ?ˆë‹¤.',
      'warning'
    );
    expect(window.close).not.toHaveBeenCalled();
  });

  test('?¬ì—…?„ë„ ë³€ê²½ì´ ?¬ë°”ë¥´ê²Œ ?™ì‘?œë‹¤', async () => {
    render(<ProjectSearchPopup />);

    const yearSelect = screen.getByDisplayValue('?„ì²´');
    await act(async () => {
      fireEvent.change(yearSelect, { target: { value: '2025' } });
    });

    expect(screen.getByDisplayValue('2025??)).toBeInTheDocument();
  });

  test('?ì—…?€???…ë ¥ ?„ë“œê°€ ê¶Œí•œ???°ë¼ ?¬ë°”ë¥´ê²Œ ?™ì‘?œë‹¤', async () => {
    render(<ProjectSearchPopup />);

    // ?¬ì—…ë¶€??? íƒ
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?¬ì—…ë¶€??));
    });

    const userInput = screen.getByDisplayValue('ì°¨ì???);
    expect(userInput).not.toBeDisabled();

    // ?ì—…?€?œëª… ë³€ê²?
    await act(async () => {
      fireEvent.change(userInput, { target: { value: '?ˆë¡œ?´ì˜?…ë??? } });
    });

    expect(screen.getByDisplayValue('?ˆë¡œ?´ì˜?…ë???)).toBeInTheDocument();
  });
}); 

