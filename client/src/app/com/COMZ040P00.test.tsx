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
      { code: '01', name: '경영지?�본부' },
      { code: '02', name: '?�업본�?' },
      { code: '03', name: '?�비?�사?�본부' },
      { code: '04', name: '개발본�?' }
    ],
    loading: false,
    error: null
  }),
  useDeptByHq: () => [
    { code: '0201', name: '?�업1?�' },
    { code: '0202', name: '?�업2?�' },
    { code: '0203', name: '?�업3?�' }
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

describe('COMZ040P00 - ?�업번호검?�화�??�스??, () => {
  const mockBusinessData = [
    {
      bsnNo: '2025-001',
      bsnNm: '?�스???�업 1',
      bizRepnm: '?�업?�??',
      bizRepid: 'SALES001',
      bizRepemail: 'sales1@test.com',
      pmNm: 'PM1',
      pmId: 'PM001',
      bsnStrtDt: '20250101',
      bsnEndDt: '20251231',
      bsnDeptKb: 'BIZ',
      pplsDeptNm: '?�업1?�',
      pplsDeptCd: '0201',
      execDeptNm: '개발1?�',
      execDeptCd: '0401',
      pgrsStDiv: '2',
      pgrsStDivNm: '?�업진행'
    },
    {
      bsnNo: '2025-002',
      bsnNm: '?�스???�업 2',
      bizRepnm: '?�업?�??',
      bizRepid: 'SALES002',
      bizRepemail: 'sales2@test.com',
      pmNm: 'PM2',
      pmId: 'PM002',
      bsnStrtDt: '20250201',
      bsnEndDt: '20251130',
      bsnDeptKb: 'BIZ',
      pplsDeptNm: '?�업2?�',
      pplsDeptCd: '0202',
      execDeptNm: '개발2?�',
      execDeptCd: '0402',
      pgrsStDiv: '3',
      pgrsStDivNm: '?�주?�정'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // 기본 ?�용???�보 ?�정 (부?�장 권한)
    mockUseAuth.mockReturnValue({
      user: {
        userId: '10757',
        empNo: '10757',
        name: '차�???,
        authCd: '10', // 부?�장 권한
        hqDivCd: '02', // ?�업본�?
        deptDivCd: '0201', // ?�업1?�
        deptTp: 'BIZ', // ?�업부??
        dutyDivCd: '1' // ?�반직원
      }
    });

    // Mock fetch ?�답 ?�정
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockBusinessData,
        message: '조회가 ?�료?�었?�니??'
      })
    });
  });

  test('?�용?��? ?�업번호검???�면???�속?�면 모든 주요 기능???�시?�다', async () => {
    render(<ProjectSearchPopup />);

    // ?�더 ?�인
    expect(screen.getByText('?�업번호검??)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '?�기' })).toBeInTheDocument();

    // 조회구분 ?�디??버튼 ?�인
    expect(screen.getByLabelText('?�체')).toBeInTheDocument();
    expect(screen.getByLabelText('?�업부??)).toBeInTheDocument();
    expect(screen.getByLabelText('?�행부??)).toBeInTheDocument();

    // 검??조건 ?�드 ?�인
    expect(screen.getByText('본�?')).toBeInTheDocument();
    expect(screen.getByText('추진부??)).toBeInTheDocument();
    expect(screen.getByText('?�업?�??)).toBeInTheDocument();
    expect(screen.getByText('진행?�태')).toBeInTheDocument();
    expect(screen.getByText('?�업?�도')).toBeInTheDocument();
    expect(screen.getByText('?�업번호')).toBeInTheDocument();

    // 조회 버튼 ?�인
    expect(screen.getByRole('button', { name: '조회' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '종료' })).toBeInTheDocument();

    // AG-Grid ?�인
    expect(screen.getByTestId('ag-grid')).toBeInTheDocument();
  });

  test('권한???�른 조회구분 기본값이 ?�바르게 ?�정?�다', async () => {
    render(<ProjectSearchPopup />);

    // 부?�장 권한?��?�??�업부?��? 기본 ?�택?�어????
    await waitFor(() => {
      expect(screen.getByLabelText('?�업부??)).toBeChecked();
    }, { timeout: 3000 });
  });

  test('조회구분 변�???관???�드?�이 ?�바르게 ?�데?�트?�다', async () => {
    render(<ProjectSearchPopup />);

    // ?�체 ?�택
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?�체'));
    });

    // 본�?가 '?�체'�?변경되�?비활?�화?�어????
    const hqSelect = screen.getAllByDisplayValue('?�체')[0]; // �?번째 '?�체' �?(본�?)
    expect(hqSelect).toBeDisabled();

    // ?�업부???�택
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?�업부??));
    });

    // 본�?가 ?�용??본�?�??�정?�고 ?�성?�되?�야 ??
    expect(screen.getByDisplayValue('?�업본�?')).not.toBeDisabled();
  });

  test('본�? 변�???부??목록???�데?�트?�다', async () => {
    render(<ProjectSearchPopup />);

    // ?�업부???�택
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?�업부??));
    });

    // 본�? 변�?
    const hqSelect = screen.getByDisplayValue('?�업본�?');
    await act(async () => {
      fireEvent.change(hqSelect, { target: { value: '03' } });
    });

    // 부?��? '?�체'�?리셋?�어????(?�비?�사?�본부�?변경됨)
    await waitFor(() => {
      const deptSelect = screen.getAllByDisplayValue('?�체')[1]; // ??번째 '?�체' �?(부??
      expect(deptSelect).toBeInTheDocument();
    });
  });

  test('진행?�태 체크박스?�이 ?�바르게 ?�작?�다', async () => {
    render(<ProjectSearchPopup />);

    // 모두?�택 체크박스
    const allCheckbox = screen.getByLabelText('(모두?�택)');
    expect(allCheckbox).toBeChecked();

    // 개별 체크박스??
    const newCheckbox = screen.getByLabelText('?�규');
    const salesCheckbox = screen.getByLabelText('?�업진행');
    const confirmedCheckbox = screen.getByLabelText('?�주?�정');

    // 개별 체크박스 ?�제
    await act(async () => {
      fireEvent.click(newCheckbox);
    });

    // 모두?�택???�제?�어????
    expect(allCheckbox).not.toBeChecked();

    // ?�시 모두?�택
    await act(async () => {
      fireEvent.click(allCheckbox);
    });

    // 모든 개별 체크박스가 ?�택?�어????
    expect(newCheckbox).toBeChecked();
    expect(salesCheckbox).toBeChecked();
    expect(confirmedCheckbox).toBeChecked();
  });

  test('?�용?��? 검??조건???�력?�고 조회 버튼???�릭?�면 검?�이 ?�행?�다', async () => {
    render(<ProjectSearchPopup />);

    // ?�업번호 ?�력
    const bsnNoInput = screen.getByLabelText('?�업번호 ?�력');
    await act(async () => {
      fireEvent.change(bsnNoInput, { target: { value: '2025-001' } });
    });

    // 조회 버튼 ?�릭
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // API ?�출 ?�인
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

  test('?�용?��? ?�터?��? ?�르�?검?�이 ?�행?�다', async () => {
    render(<ProjectSearchPopup />);

    // ?�업번호 ?�력 ???�터??
    const bsnNoInput = screen.getByLabelText('?�업번호 ?�력');
    await act(async () => {
      fireEvent.change(bsnNoInput, { target: { value: '2025-001' } });
      fireEvent.keyDown(bsnNoInput, { key: 'Enter', code: 'Enter' });
    });

    // API ?�출 ?�인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  test('검??결과가 그리?�에 ?�시?�다', async () => {
    render(<ProjectSearchPopup />);

    // 조회 ?�행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 검??결과 ?�인
    await waitFor(() => {
      expect(screen.getByTestId('grid-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('grid-row-1')).toBeInTheDocument();
      expect(screen.getByText('2025-001')).toBeInTheDocument();
      expect(screen.getByText('?�스???�업 1')).toBeInTheDocument();
      expect(screen.getByText('PM1')).toBeInTheDocument();
    });
  });

  test('?�용?��? 그리?�에???�을 ?�릭?�면 ?�택?�다', async () => {
    render(<ProjectSearchPopup />);

    // 조회 ?�행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // �?번째 ???�릭
    await waitFor(() => {
      const firstRow = screen.getByTestId('grid-row-0');
      fireEvent.click(firstRow);
    });

    // ?�택???�의 ?�이???�인
    expect(screen.getByText('2025-001')).toBeInTheDocument();
  });

  test('?�용?��? 그리?�에???�을 ?�블?�릭?�면 ?�업???�택?�고 ?�업???�힌??, async () => {
    render(<ProjectSearchPopup />);

    // 조회 ?�행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // �?번째 ???�블?�릭
    await waitFor(() => {
      const firstRow = screen.getByTestId('grid-row-0');
      fireEvent.doubleClick(firstRow);
    });

    // 부모창??메시지 ?�송 ?�인
    expect(window.opener.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'BUSINESS_SELECT',
        data: expect.objectContaining({
          bsnNo: '2025-001',
          bsnNm: '?�스???�업 1'
        })
      }),
      '*'
    );

    // ?�업 ?�기 ?�인
    expect(window.close).toHaveBeenCalled();
  });

  test('검??결과가 ?�을 ???�절??메시지가 ?�시?�다', async () => {
    // �?결과 모킹
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
        message: '조회 결과가 ?�습?�다.'
      })
    });

    render(<ProjectSearchPopup />);

    // 조회 ?�행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 메시지 ?�인
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('조회 결과가 ?�습?�다.', 'info');
    });
  });

  test('검??�??�류가 발생?�면 ?�러 메시지가 ?�시?�다', async () => {
    // ?�류 ?�답 모킹
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<ProjectSearchPopup />);

    // 조회 ?�행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ?�러 메시지 ?�인
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('조회 �??�류가 발생?�습?�다.', 'error');
    });
  });

  test('ESC ?��? ?�르�??�업???�힌??, async () => {
    render(<ProjectSearchPopup />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('?�기 버튼???�릭?�면 ?�업???�힌??, async () => {
    render(<ProjectSearchPopup />);

    const closeButton = screen.getByRole('button', { name: '?�기' });
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('종료 버튼???�릭?�면 ?�업???�힌??, async () => {
    render(<ProjectSearchPopup />);

    const endButton = screen.getByRole('button', { name: '종료' });
    await act(async () => {
      fireEvent.click(endButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('로딩 중에??조회 버튼??비활?�화?�다', async () => {
    // ?�린 ?�답???��??�이?�하�??�해 Promise�?지?�시??
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch as jest.Mock).mockReturnValue(delayedPromise);

    render(<ProjectSearchPopup />);

    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 로딩 ?�태?�서 버튼??비활?�화?�었?��? ?�인
    expect(searchButton).toBeDisabled();
    expect(searchButton).toHaveTextContent('조회�?..');

    // Promise ?�결
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    await waitFor(() => {
      expect(searchButton).not.toBeDisabled();
      expect(searchButton).toHaveTextContent('조회');
    });
  });

  test('권한별로 조회구분???�바르게 ?�정?�다', async () => {
    // PM 권한?�로 모킹
    mockUseAuth.mockReturnValue({
      user: {
        userId: 'PM001',
        empNo: 'PM001',
        name: 'PM1',
        authCd: '30', // PM 권한
        hqDivCd: '04', // 개발본�?
        deptDivCd: '0401', // 개발1?�
        deptTp: 'DEV', // 개발부??
        dutyDivCd: '1'
      }
    });

    render(<ProjectSearchPopup />);

    // PM 권한?��?�??�행부?��? 기본 ?�택?�어????
    await waitFor(() => {
      expect(screen.getByLabelText('?�행부??)).toBeChecked();
    }, { timeout: 3000 });
  });

  test('PM 권한?�로 ?�른 PM???�업???�택?�려�??�면 경고가 ?�시?�다', async () => {
    // PM 권한?�로 모킹
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

    // 조회 ?�행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // PM2???�업???�블?�릭 (PM1???�닌 ?�업)
    await waitFor(() => {
      const secondRow = screen.getByTestId('grid-row-1');
      fireEvent.doubleClick(secondRow);
    });

    // 경고 메시지 ?�인
    expect(mockShowToast).toHaveBeenCalledWith(
      '?�당 ?�업??PM???�닙?�다. ?�택?????�습?�다.',
      'warning'
    );
    expect(window.close).not.toHaveBeenCalled();
  });

  test('?�업?�도 변경이 ?�바르게 ?�작?�다', async () => {
    render(<ProjectSearchPopup />);

    const yearSelect = screen.getByDisplayValue('?�체');
    await act(async () => {
      fireEvent.change(yearSelect, { target: { value: '2025' } });
    });

    expect(screen.getByDisplayValue('2025??)).toBeInTheDocument();
  });

  test('?�업?�???�력 ?�드가 권한???�라 ?�바르게 ?�작?�다', async () => {
    render(<ProjectSearchPopup />);

    // ?�업부???�택
    await act(async () => {
      fireEvent.click(screen.getByLabelText('?�업부??));
    });

    const userInput = screen.getByDisplayValue('차�???);
    expect(userInput).not.toBeDisabled();

    // ?�업?�?�명 변�?
    await act(async () => {
      fireEvent.change(userInput, { target: { value: '?�로?�영?��??? } });
    });

    expect(screen.getByDisplayValue('?�로?�영?��???)).toBeInTheDocument();
  });
}); 

