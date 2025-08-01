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
      { code: '01', name: 'κ²½μμ§?λ³ΈλΆ' },
      { code: '02', name: '?μλ³Έλ?' },
      { code: '03', name: '?λΉ?€μ¬?λ³ΈλΆ' },
      { code: '04', name: 'κ°λ°λ³Έλ?' }
    ],
    loading: false,
    error: null
  }),
  useDeptByHq: () => [
    { code: '0201', name: '?μ1?' },
    { code: '0202', name: '?μ2?' },
    { code: '0203', name: '?μ3?' }
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

describe('COMZ040P00 - ?¬μλ²νΈκ²?νλ©??μ€??, () => {
  const mockBusinessData = [
    {
      bsnNo: '2025-001',
      bsnNm: '?μ€???¬μ 1',
      bizRepnm: '?μ???',
      bizRepid: 'SALES001',
      bizRepemail: 'sales1@test.com',
      pmNm: 'PM1',
      pmId: 'PM001',
      bsnStrtDt: '20250101',
      bsnEndDt: '20251231',
      bsnDeptKb: 'BIZ',
      pplsDeptNm: '?μ1?',
      pplsDeptCd: '0201',
      execDeptNm: 'κ°λ°1?',
      execDeptCd: '0401',
      pgrsStDiv: '2',
      pgrsStDivNm: '?μμ§ν'
    },
    {
      bsnNo: '2025-002',
      bsnNm: '?μ€???¬μ 2',
      bizRepnm: '?μ???',
      bizRepid: 'SALES002',
      bizRepemail: 'sales2@test.com',
      pmNm: 'PM2',
      pmId: 'PM002',
      bsnStrtDt: '20250201',
      bsnEndDt: '20251130',
      bsnDeptKb: 'BIZ',
      pplsDeptNm: '?μ2?',
      pplsDeptCd: '0202',
      execDeptNm: 'κ°λ°2?',
      execDeptCd: '0402',
      pgrsStDiv: '3',
      pgrsStDivNm: '?μ£Ό?μ '
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // κΈ°λ³Έ ?¬μ©???λ³΄ ?€μ  (λΆ?μ₯ κΆν)
    mockUseAuth.mockReturnValue({
      user: {
        userId: '10757',
        empNo: '10757',
        name: 'μ°¨μ???,
        authCd: '10', // λΆ?μ₯ κΆν
        hqDivCd: '02', // ?μλ³Έλ?
        deptDivCd: '0201', // ?μ1?
        deptTp: 'BIZ', // ?μλΆ??
        dutyDivCd: '1' // ?Όλ°μ§μ
      }
    });

    // Mock fetch ?λ΅ ?€μ 
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockBusinessData,
        message: 'μ‘°νκ° ?λ£?μ?΅λ??'
      })
    });
  });

  test('?¬μ©?κ? ?¬μλ²νΈκ²???λ©΄???μ?λ©΄ λͺ¨λ  μ£Όμ κΈ°λ₯???μ?λ€', async () => {
    render(<ProjectSearchPopup />);

    // ?€λ ?μΈ
    expect(screen.getByText('?¬μλ²νΈκ²??)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '?«κΈ°' })).toBeInTheDocument();

    // μ‘°νκ΅¬λΆ ?Όλ??λ²νΌ ?μΈ
    expect(screen.getByLabelText('?μ²΄')).toBeInTheDocument();
    expect(screen.getByLabelText('?¬μλΆ??)).toBeInTheDocument();
    expect(screen.getByLabelText('?€νλΆ??)).toBeInTheDocument();

    // κ²??μ‘°κ±΄ ?λ ?μΈ
    expect(screen.getByText('λ³Έλ?')).toBeInTheDocument();
    expect(screen.getByText('μΆμ§λΆ??)).toBeInTheDocument();
    expect(screen.getByText('?μ???)).toBeInTheDocument();
    expect(screen.getByText('μ§ν?ν')).toBeInTheDocument();
    expect(screen.getByText('?¬μ?λ')).toBeInTheDocument();
    expect(screen.getByText('?¬μλ²νΈ')).toBeInTheDocument();

    // μ‘°ν λ²νΌ ?μΈ
    expect(screen.getByRole('button', { name: 'μ‘°ν' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'μ’λ£' })).toBeInTheDocument();

    // AG-Grid ?μΈ
    expect(screen.getByTestId('ag-grid')).toBeInTheDocument();
  });

  test('κΆν???°λ₯Έ μ‘°νκ΅¬λΆ κΈ°λ³Έκ°μ΄ ?¬λ°λ₯΄κ² ?€μ ?λ€', async () => {
    render(<ProjectSearchPopup />);

    // λΆ?μ₯ κΆν?΄λ?λ‘??¬μλΆ?κ? κΈ°λ³Έ ? ν?μ΄????
    await waitFor(() => {
      expect(screen.getByLabelText('?¬μλΆ??)).toBeChecked();
    }, { timeout: 3000 });
  });

  test('μ‘°νκ΅¬λΆ λ³κ²???κ΄???λ?€μ΄ ?¬λ°λ₯΄κ² ?λ°?΄νΈ?λ€', async () => {
    render(<ProjectSearchPopup />);

    // ?μ²΄ ? ν
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?μ²΄'));
    });

    // λ³Έλ?κ° '?μ²΄'λ‘?λ³κ²½λκ³?λΉν?±ν?μ΄????
    const hqSelect = screen.getAllByDisplayValue('?μ²΄')[0]; // μ²?λ²μ§Έ '?μ²΄' κ°?(λ³Έλ?)
    expect(hqSelect).toBeDisabled();

    // ?¬μλΆ??? ν
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?¬μλΆ??));
    });

    // λ³Έλ?κ° ?¬μ©??λ³Έλ?λ‘??€μ ?κ³  ?μ±?λ?΄μΌ ??
    expect(screen.getByDisplayValue('?μλ³Έλ?')).not.toBeDisabled();
  });

  test('λ³Έλ? λ³κ²???λΆ??λͺ©λ‘???λ°?΄νΈ?λ€', async () => {
    render(<ProjectSearchPopup />);

    // ?¬μλΆ??? ν
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?¬μλΆ??));
    });

    // λ³Έλ? λ³κ²?
    const hqSelect = screen.getByDisplayValue('?μλ³Έλ?');
    await act(async () => {
      fireEvent.change(hqSelect, { target: { value: '03' } });
    });

    // λΆ?κ? '?μ²΄'λ‘?λ¦¬μ?μ΄????(?λΉ?€μ¬?λ³ΈλΆλ‘?λ³κ²½λ¨)
    await waitFor(() => {
      const deptSelect = screen.getAllByDisplayValue('?μ²΄')[1]; // ??λ²μ§Έ '?μ²΄' κ°?(λΆ??
      expect(deptSelect).toBeInTheDocument();
    });
  });

  test('μ§ν?ν μ²΄ν¬λ°μ€?€μ΄ ?¬λ°λ₯΄κ² ?μ?λ€', async () => {
    render(<ProjectSearchPopup />);

    // λͺ¨λ? ν μ²΄ν¬λ°μ€
    const allCheckbox = screen.getByLabelText('(λͺ¨λ? ν)');
    expect(allCheckbox).toBeChecked();

    // κ°λ³ μ²΄ν¬λ°μ€??
    const newCheckbox = screen.getByLabelText('? κ·');
    const salesCheckbox = screen.getByLabelText('?μμ§ν');
    const confirmedCheckbox = screen.getByLabelText('?μ£Ό?μ ');

    // κ°λ³ μ²΄ν¬λ°μ€ ?΄μ 
    await act(async () => {
      fireEvent.click(newCheckbox);
    });

    // λͺ¨λ? ν???΄μ ?μ΄????
    expect(allCheckbox).not.toBeChecked();

    // ?€μ λͺ¨λ? ν
    await act(async () => {
      fireEvent.click(allCheckbox);
    });

    // λͺ¨λ  κ°λ³ μ²΄ν¬λ°μ€κ° ? ν?μ΄????
    expect(newCheckbox).toBeChecked();
    expect(salesCheckbox).toBeChecked();
    expect(confirmedCheckbox).toBeChecked();
  });

  test('?¬μ©?κ? κ²??μ‘°κ±΄???λ ₯?κ³  μ‘°ν λ²νΌ???΄λ¦­?λ©΄ κ²?μ΄ ?€ν?λ€', async () => {
    render(<ProjectSearchPopup />);

    // ?¬μλ²νΈ ?λ ₯
    const bsnNoInput = screen.getByLabelText('?¬μλ²νΈ ?λ ₯');
    await act(async () => {
      fireEvent.change(bsnNoInput, { target: { value: '2025-001' } });
    });

    // μ‘°ν λ²νΌ ?΄λ¦­
    const searchButton = screen.getByRole('button', { name: 'μ‘°ν' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // API ?ΈμΆ ?μΈ
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

  test('?¬μ©?κ? ?ν°?€λ? ?λ₯΄λ©?κ²?μ΄ ?€ν?λ€', async () => {
    render(<ProjectSearchPopup />);

    // ?¬μλ²νΈ ?λ ₯ ???ν°??
    const bsnNoInput = screen.getByLabelText('?¬μλ²νΈ ?λ ₯');
    await act(async () => {
      fireEvent.change(bsnNoInput, { target: { value: '2025-001' } });
      fireEvent.keyDown(bsnNoInput, { key: 'Enter', code: 'Enter' });
    });

    // API ?ΈμΆ ?μΈ
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  test('κ²??κ²°κ³Όκ° κ·Έλ¦¬?μ ?μ?λ€', async () => {
    render(<ProjectSearchPopup />);

    // μ‘°ν ?€ν
    const searchButton = screen.getByRole('button', { name: 'μ‘°ν' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // κ²??κ²°κ³Ό ?μΈ
    await waitFor(() => {
      expect(screen.getByTestId('grid-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('grid-row-1')).toBeInTheDocument();
      expect(screen.getByText('2025-001')).toBeInTheDocument();
      expect(screen.getByText('?μ€???¬μ 1')).toBeInTheDocument();
      expect(screen.getByText('PM1')).toBeInTheDocument();
    });
  });

  test('?¬μ©?κ? κ·Έλ¦¬?μ???μ ?΄λ¦­?λ©΄ ? ν?λ€', async () => {
    render(<ProjectSearchPopup />);

    // μ‘°ν ?€ν
    const searchButton = screen.getByRole('button', { name: 'μ‘°ν' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // μ²?λ²μ§Έ ???΄λ¦­
    await waitFor(() => {
      const firstRow = screen.getByTestId('grid-row-0');
      fireEvent.click(firstRow);
    });

    // ? ν???μ ?°μ΄???μΈ
    expect(screen.getByText('2025-001')).toBeInTheDocument();
  });

  test('?¬μ©?κ? κ·Έλ¦¬?μ???μ ?λΈ?΄λ¦­?λ©΄ ?¬μ??? ν?κ³  ?μ???«ν??, async () => {
    render(<ProjectSearchPopup />);

    // μ‘°ν ?€ν
    const searchButton = screen.getByRole('button', { name: 'μ‘°ν' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // μ²?λ²μ§Έ ???λΈ?΄λ¦­
    await waitFor(() => {
      const firstRow = screen.getByTestId('grid-row-0');
      fireEvent.doubleClick(firstRow);
    });

    // λΆλͺ¨μ°½??λ©μμ§ ?μ‘ ?μΈ
    expect(window.opener.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'BUSINESS_SELECT',
        data: expect.objectContaining({
          bsnNo: '2025-001',
          bsnNm: '?μ€???¬μ 1'
        })
      }),
      '*'
    );

    // ?μ ?«κΈ° ?μΈ
    expect(window.close).toHaveBeenCalled();
  });

  test('κ²??κ²°κ³Όκ° ?μ ???μ ??λ©μμ§κ° ?μ?λ€', async () => {
    // λΉ?κ²°κ³Ό λͺ¨νΉ
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
        message: 'μ‘°ν κ²°κ³Όκ° ?μ΅?λ€.'
      })
    });

    render(<ProjectSearchPopup />);

    // μ‘°ν ?€ν
    const searchButton = screen.getByRole('button', { name: 'μ‘°ν' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // λ©μμ§ ?μΈ
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('μ‘°ν κ²°κ³Όκ° ?μ΅?λ€.', 'info');
    });
  });

  test('κ²??μ€??€λ₯κ° λ°μ?λ©΄ ?λ¬ λ©μμ§κ° ?μ?λ€', async () => {
    // ?€λ₯ ?λ΅ λͺ¨νΉ
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<ProjectSearchPopup />);

    // μ‘°ν ?€ν
    const searchButton = screen.getByRole('button', { name: 'μ‘°ν' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ?λ¬ λ©μμ§ ?μΈ
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.', 'error');
    });
  });

  test('ESC ?€λ? ?λ₯΄λ©??μ???«ν??, async () => {
    render(<ProjectSearchPopup />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('?«κΈ° λ²νΌ???΄λ¦­?λ©΄ ?μ???«ν??, async () => {
    render(<ProjectSearchPopup />);

    const closeButton = screen.getByRole('button', { name: '?«κΈ°' });
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('μ’λ£ λ²νΌ???΄λ¦­?λ©΄ ?μ???«ν??, async () => {
    render(<ProjectSearchPopup />);

    const endButton = screen.getByRole('button', { name: 'μ’λ£' });
    await act(async () => {
      fireEvent.click(endButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('λ‘λ© μ€μ??μ‘°ν λ²νΌ??λΉν?±ν?λ€', async () => {
    // ?λ¦° ?λ΅???λ??μ΄?νκΈ??ν΄ Promiseλ₯?μ§?°μ??
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch as jest.Mock).mockReturnValue(delayedPromise);

    render(<ProjectSearchPopup />);

    const searchButton = screen.getByRole('button', { name: 'μ‘°ν' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // λ‘λ© ?ν?μ λ²νΌ??λΉν?±ν?μ?μ? ?μΈ
    expect(searchButton).toBeDisabled();
    expect(searchButton).toHaveTextContent('μ‘°νμ€?..');

    // Promise ?΄κ²°
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    await waitFor(() => {
      expect(searchButton).not.toBeDisabled();
      expect(searchButton).toHaveTextContent('μ‘°ν');
    });
  });

  test('κΆνλ³λ‘ μ‘°νκ΅¬λΆ???¬λ°λ₯΄κ² ?€μ ?λ€', async () => {
    // PM κΆν?Όλ‘ λͺ¨νΉ
    mockUseAuth.mockReturnValue({
      user: {
        userId: 'PM001',
        empNo: 'PM001',
        name: 'PM1',
        authCd: '30', // PM κΆν
        hqDivCd: '04', // κ°λ°λ³Έλ?
        deptDivCd: '0401', // κ°λ°1?
        deptTp: 'DEV', // κ°λ°λΆ??
        dutyDivCd: '1'
      }
    });

    render(<ProjectSearchPopup />);

    // PM κΆν?΄λ?λ‘??€νλΆ?κ? κΈ°λ³Έ ? ν?μ΄????
    await waitFor(() => {
      expect(screen.getByLabelText('?€νλΆ??)).toBeChecked();
    }, { timeout: 3000 });
  });

  test('PM κΆν?Όλ‘ ?€λ₯Έ PM???¬μ??? ν?λ €κ³??λ©΄ κ²½κ³ κ° ?μ?λ€', async () => {
    // PM κΆν?Όλ‘ λͺ¨νΉ
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

    // μ‘°ν ?€ν
    const searchButton = screen.getByRole('button', { name: 'μ‘°ν' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // PM2???¬μ???λΈ?΄λ¦­ (PM1???λ ?¬μ)
    await waitFor(() => {
      const secondRow = screen.getByTestId('grid-row-1');
      fireEvent.doubleClick(secondRow);
    });

    // κ²½κ³  λ©μμ§ ?μΈ
    expect(mockShowToast).toHaveBeenCalledWith(
      '?΄λΉ ?¬μ??PM???λ?λ€. ? ν?????μ΅?λ€.',
      'warning'
    );
    expect(window.close).not.toHaveBeenCalled();
  });

  test('?¬μ?λ λ³κ²½μ΄ ?¬λ°λ₯΄κ² ?μ?λ€', async () => {
    render(<ProjectSearchPopup />);

    const yearSelect = screen.getByDisplayValue('?μ²΄');
    await act(async () => {
      fireEvent.change(yearSelect, { target: { value: '2025' } });
    });

    expect(screen.getByDisplayValue('2025??)).toBeInTheDocument();
  });

  test('?μ????λ ₯ ?λκ° κΆν???°λΌ ?¬λ°λ₯΄κ² ?μ?λ€', async () => {
    render(<ProjectSearchPopup />);

    // ?¬μλΆ??? ν
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?¬μλΆ??));
    });

    const userInput = screen.getByDisplayValue('μ°¨μ???);
    expect(userInput).not.toBeDisabled();

    // ?μ??λͺ λ³κ²?
    await act(async () => {
      fireEvent.change(userInput, { target: { value: '?λ‘?΄μ?λ??? } });
    });

    expect(screen.getByDisplayValue('?λ‘?΄μ?λ???)).toBeInTheDocument();
  });
}); 

