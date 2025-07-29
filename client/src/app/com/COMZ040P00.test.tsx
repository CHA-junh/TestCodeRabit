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
      { code: '01', name: '경영지원본부' },
      { code: '02', name: '영업본부' },
      { code: '03', name: '서비스사업본부' },
      { code: '04', name: '개발본부' }
    ],
    loading: false,
    error: null
  }),
  useDeptByHq: () => [
    { code: '0201', name: '영업1팀' },
    { code: '0202', name: '영업2팀' },
    { code: '0203', name: '영업3팀' }
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

describe('COMZ040P00 - 사업번호검색화면 테스트', () => {
  const mockBusinessData = [
    {
      bsnNo: '2025-001',
      bsnNm: '테스트 사업 1',
      bizRepnm: '영업대표1',
      bizRepid: 'SALES001',
      bizRepemail: 'sales1@test.com',
      pmNm: 'PM1',
      pmId: 'PM001',
      bsnStrtDt: '20250101',
      bsnEndDt: '20251231',
      bsnDeptKb: 'BIZ',
      pplsDeptNm: '영업1팀',
      pplsDeptCd: '0201',
      execDeptNm: '개발1팀',
      execDeptCd: '0401',
      pgrsStDiv: '2',
      pgrsStDivNm: '영업진행'
    },
    {
      bsnNo: '2025-002',
      bsnNm: '테스트 사업 2',
      bizRepnm: '영업대표2',
      bizRepid: 'SALES002',
      bizRepemail: 'sales2@test.com',
      pmNm: 'PM2',
      pmId: 'PM002',
      bsnStrtDt: '20250201',
      bsnEndDt: '20251130',
      bsnDeptKb: 'BIZ',
      pplsDeptNm: '영업2팀',
      pplsDeptCd: '0202',
      execDeptNm: '개발2팀',
      execDeptCd: '0402',
      pgrsStDiv: '3',
      pgrsStDivNm: '수주확정'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // 기본 사용자 정보 설정 (부서장 권한)
    mockUseAuth.mockReturnValue({
      user: {
        userId: '10757',
        empNo: '10757',
        name: '차준형',
        authCd: '10', // 부서장 권한
        hqDivCd: '02', // 영업본부
        deptDivCd: '0201', // 영업1팀
        deptTp: 'BIZ', // 영업부서
        dutyDivCd: '1' // 일반직원
      }
    });

    // Mock fetch 응답 설정
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockBusinessData,
        message: '조회가 완료되었습니다.'
      })
    });
  });

  test('사용자가 사업번호검색 화면에 접속하면 모든 주요 기능이 표시된다', async () => {
    render(<ProjectSearchPopup />);

    // 헤더 확인
    expect(screen.getByText('사업번호검색')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();

    // 조회구분 라디오 버튼 확인
    expect(screen.getByLabelText('전체')).toBeInTheDocument();
    expect(screen.getByLabelText('사업부서')).toBeInTheDocument();
    expect(screen.getByLabelText('실행부서')).toBeInTheDocument();

    // 검색 조건 필드 확인
    expect(screen.getByText('본부')).toBeInTheDocument();
    expect(screen.getByText('추진부서')).toBeInTheDocument();
    expect(screen.getByText('영업대표')).toBeInTheDocument();
    expect(screen.getByText('진행상태')).toBeInTheDocument();
    expect(screen.getByText('사업년도')).toBeInTheDocument();
    expect(screen.getByText('사업번호')).toBeInTheDocument();

    // 조회 버튼 확인
    expect(screen.getByRole('button', { name: '조회' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '종료' })).toBeInTheDocument();

    // AG-Grid 확인
    expect(screen.getByTestId('ag-grid')).toBeInTheDocument();
  });

  test('권한에 따른 조회구분 기본값이 올바르게 설정된다', async () => {
    render(<ProjectSearchPopup />);

    // 부서장 권한이므로 사업부서가 기본 선택되어야 함
    await waitFor(() => {
      expect(screen.getByLabelText('사업부서')).toBeChecked();
    }, { timeout: 3000 });
  });

  test('조회구분 변경 시 관련 필드들이 올바르게 업데이트된다', async () => {
    render(<ProjectSearchPopup />);

    // 전체 선택
    await act(async () => {
      fireEvent.click(screen.getByLabelText('전체'));
    });

    // 본부가 '전체'로 변경되고 비활성화되어야 함
    const hqSelect = screen.getAllByDisplayValue('전체')[0]; // 첫 번째 '전체' 값 (본부)
    expect(hqSelect).toBeDisabled();

    // 사업부서 선택
    await act(async () => {
      fireEvent.click(screen.getByLabelText('사업부서'));
    });

    // 본부가 사용자 본부로 설정되고 활성화되어야 함
    expect(screen.getByDisplayValue('영업본부')).not.toBeDisabled();
  });

  test('본부 변경 시 부서 목록이 업데이트된다', async () => {
    render(<ProjectSearchPopup />);

    // 사업부서 선택
    await act(async () => {
      fireEvent.click(screen.getByLabelText('사업부서'));
    });

    // 본부 변경
    const hqSelect = screen.getByDisplayValue('영업본부');
    await act(async () => {
      fireEvent.change(hqSelect, { target: { value: '03' } });
    });

    // 부서가 '전체'로 리셋되어야 함 (서비스사업본부로 변경됨)
    await waitFor(() => {
      const deptSelect = screen.getAllByDisplayValue('전체')[1]; // 두 번째 '전체' 값 (부서)
      expect(deptSelect).toBeInTheDocument();
    });
  });

  test('진행상태 체크박스들이 올바르게 동작한다', async () => {
    render(<ProjectSearchPopup />);

    // 모두선택 체크박스
    const allCheckbox = screen.getByLabelText('(모두선택)');
    expect(allCheckbox).toBeChecked();

    // 개별 체크박스들
    const newCheckbox = screen.getByLabelText('신규');
    const salesCheckbox = screen.getByLabelText('영업진행');
    const confirmedCheckbox = screen.getByLabelText('수주확정');

    // 개별 체크박스 해제
    await act(async () => {
      fireEvent.click(newCheckbox);
    });

    // 모두선택이 해제되어야 함
    expect(allCheckbox).not.toBeChecked();

    // 다시 모두선택
    await act(async () => {
      fireEvent.click(allCheckbox);
    });

    // 모든 개별 체크박스가 선택되어야 함
    expect(newCheckbox).toBeChecked();
    expect(salesCheckbox).toBeChecked();
    expect(confirmedCheckbox).toBeChecked();
  });

  test('사용자가 검색 조건을 입력하고 조회 버튼을 클릭하면 검색이 실행된다', async () => {
    render(<ProjectSearchPopup />);

    // 사업번호 입력
    const bsnNoInput = screen.getByLabelText('사업번호 입력');
    await act(async () => {
      fireEvent.change(bsnNoInput, { target: { value: '2025-001' } });
    });

    // 조회 버튼 클릭
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // API 호출 확인
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

  test('사용자가 엔터키를 누르면 검색이 실행된다', async () => {
    render(<ProjectSearchPopup />);

    // 사업번호 입력 후 엔터키
    const bsnNoInput = screen.getByLabelText('사업번호 입력');
    await act(async () => {
      fireEvent.change(bsnNoInput, { target: { value: '2025-001' } });
      fireEvent.keyDown(bsnNoInput, { key: 'Enter', code: 'Enter' });
    });

    // API 호출 확인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  test('검색 결과가 그리드에 표시된다', async () => {
    render(<ProjectSearchPopup />);

    // 조회 실행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 검색 결과 확인
    await waitFor(() => {
      expect(screen.getByTestId('grid-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('grid-row-1')).toBeInTheDocument();
      expect(screen.getByText('2025-001')).toBeInTheDocument();
      expect(screen.getByText('테스트 사업 1')).toBeInTheDocument();
      expect(screen.getByText('PM1')).toBeInTheDocument();
    });
  });

  test('사용자가 그리드에서 행을 클릭하면 선택된다', async () => {
    render(<ProjectSearchPopup />);

    // 조회 실행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 첫 번째 행 클릭
    await waitFor(() => {
      const firstRow = screen.getByTestId('grid-row-0');
      fireEvent.click(firstRow);
    });

    // 선택된 행의 데이터 확인
    expect(screen.getByText('2025-001')).toBeInTheDocument();
  });

  test('사용자가 그리드에서 행을 더블클릭하면 사업이 선택되고 팝업이 닫힌다', async () => {
    render(<ProjectSearchPopup />);

    // 조회 실행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 첫 번째 행 더블클릭
    await waitFor(() => {
      const firstRow = screen.getByTestId('grid-row-0');
      fireEvent.doubleClick(firstRow);
    });

    // 부모창에 메시지 전송 확인
    expect(window.opener.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'BUSINESS_SELECT',
        data: expect.objectContaining({
          bsnNo: '2025-001',
          bsnNm: '테스트 사업 1'
        })
      }),
      '*'
    );

    // 팝업 닫기 확인
    expect(window.close).toHaveBeenCalled();
  });

  test('검색 결과가 없을 때 적절한 메시지가 표시된다', async () => {
    // 빈 결과 모킹
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
        message: '조회 결과가 없습니다.'
      })
    });

    render(<ProjectSearchPopup />);

    // 조회 실행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 메시지 확인
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('조회 결과가 없습니다.', 'info');
    });
  });

  test('검색 중 오류가 발생하면 에러 메시지가 표시된다', async () => {
    // 오류 응답 모킹
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<ProjectSearchPopup />);

    // 조회 실행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 에러 메시지 확인
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('조회 중 오류가 발생했습니다.', 'error');
    });
  });

  test('ESC 키를 누르면 팝업이 닫힌다', async () => {
    render(<ProjectSearchPopup />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('닫기 버튼을 클릭하면 팝업이 닫힌다', async () => {
    render(<ProjectSearchPopup />);

    const closeButton = screen.getByRole('button', { name: '닫기' });
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('종료 버튼을 클릭하면 팝업이 닫힌다', async () => {
    render(<ProjectSearchPopup />);

    const endButton = screen.getByRole('button', { name: '종료' });
    await act(async () => {
      fireEvent.click(endButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('로딩 중에는 조회 버튼이 비활성화된다', async () => {
    // 느린 응답을 시뮬레이션하기 위해 Promise를 지연시킴
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

    // 로딩 상태에서 버튼이 비활성화되었는지 확인
    expect(searchButton).toBeDisabled();
    expect(searchButton).toHaveTextContent('조회중...');

    // Promise 해결
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    await waitFor(() => {
      expect(searchButton).not.toBeDisabled();
      expect(searchButton).toHaveTextContent('조회');
    });
  });

  test('권한별로 조회구분이 올바르게 설정된다', async () => {
    // PM 권한으로 모킹
    mockUseAuth.mockReturnValue({
      user: {
        userId: 'PM001',
        empNo: 'PM001',
        name: 'PM1',
        authCd: '30', // PM 권한
        hqDivCd: '04', // 개발본부
        deptDivCd: '0401', // 개발1팀
        deptTp: 'DEV', // 개발부서
        dutyDivCd: '1'
      }
    });

    render(<ProjectSearchPopup />);

    // PM 권한이므로 실행부서가 기본 선택되어야 함
    await waitFor(() => {
      expect(screen.getByLabelText('실행부서')).toBeChecked();
    }, { timeout: 3000 });
  });

  test('PM 권한으로 다른 PM의 사업을 선택하려고 하면 경고가 표시된다', async () => {
    // PM 권한으로 모킹
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

    // 조회 실행
    const searchButton = screen.getByRole('button', { name: '조회' });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // PM2의 사업을 더블클릭 (PM1이 아닌 사업)
    await waitFor(() => {
      const secondRow = screen.getByTestId('grid-row-1');
      fireEvent.doubleClick(secondRow);
    });

    // 경고 메시지 확인
    expect(mockShowToast).toHaveBeenCalledWith(
      '해당 사업의 PM이 아닙니다. 선택할 수 없습니다.',
      'warning'
    );
    expect(window.close).not.toHaveBeenCalled();
  });

  test('사업년도 변경이 올바르게 동작한다', async () => {
    render(<ProjectSearchPopup />);

    const yearSelect = screen.getByDisplayValue('전체');
    await act(async () => {
      fireEvent.change(yearSelect, { target: { value: '2025' } });
    });

    expect(screen.getByDisplayValue('2025년')).toBeInTheDocument();
  });

  test('영업대표 입력 필드가 권한에 따라 올바르게 동작한다', async () => {
    render(<ProjectSearchPopup />);

    // 사업부서 선택
    await act(async () => {
      fireEvent.click(screen.getByLabelText('사업부서'));
    });

    const userInput = screen.getByDisplayValue('차준형');
    expect(userInput).not.toBeDisabled();

    // 영업대표명 변경
    await act(async () => {
      fireEvent.change(userInput, { target: { value: '새로운영업대표' } });
    });

    expect(screen.getByDisplayValue('새로운영업대표')).toBeInTheDocument();
  });
}); 