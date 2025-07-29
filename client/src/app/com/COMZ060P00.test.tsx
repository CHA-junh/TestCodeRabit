import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@/test/test-utils';
import DeptNumberSearchPopup from './COMZ060P00';
import { Response } from 'node-fetch';

// Mock fetch
global.fetch = jest.fn();

// Mock window.opener and window.close
Object.defineProperty(window, 'opener', {
  value: {
    postMessage: jest.fn()
  },
  writable: true
});
Object.defineProperty(window, 'close', {
  value: jest.fn(),
  writable: true
});

// Mock useDeptDivCodes hook
const mockDeptDivCodes = jest.fn();
jest.mock('@/modules/auth/hooks/useCommonCodes', () => ({
  ...jest.requireActual('@/modules/auth/hooks/useCommonCodes'),
  useDeptDivCodes: () => mockDeptDivCodes()
}));

// Mock useToast hook
const mockShowToast = jest.fn();
jest.mock('@/contexts/ToastContext', () => ({
  ...jest.requireActual('@/contexts/ToastContext'),
  useToast: () => ({
    showToast: mockShowToast
  })
}));

// Mock useSearchParams hook
const mockUseSearchParams = jest.fn();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams()
}));

describe('COMZ060P00 - 부?�번?��??�화�?, () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockClear();
    (window.opener.postMessage as jest.Mock).mockClear();
    (window.close as jest.Mock).mockClear();
    mockShowToast.mockClear();
    mockDeptDivCodes.mockClear();
    mockUseSearchParams.mockClear();

    // useDeptDivCodes??배열??직접 반환
    mockDeptDivCodes.mockReturnValue([
      { code: '01', name: '본사' },
      { code: '02', name: '지?? }
    ]);

    // Mock fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            deptNo: '001',
            deptNm: '?�사?�',
            deptDivCd: '01',
            deptDivNm: '본사'
          }
        ]
      })
    });
  });

  test('?�용?��? 부?�번?��????�면???�속?�면 모든 주요 기능???�시?�다', () => {
    render(<DeptNumberSearchPopup />);

    // ?�목 ?�인
    expect(screen.getByText('부?�번??검??)).toBeInTheDocument();

    // 검??조건 ?�력 ?�드 ?�인
    expect(screen.getByDisplayValue('2025')).toBeInTheDocument(); // ?�도
    expect(screen.getByDisplayValue('')).toBeInTheDocument(); // 부?�번??(�?�?

    // 부?�구�?콤보박스 ?�션 ?�인
    expect(screen.getByDisplayValue('?�체')).toBeInTheDocument();
    expect(screen.getByText('본사')).toBeInTheDocument();
    expect(screen.getByText('지??)).toBeInTheDocument();

    // 조회 버튼 ?�인
    expect(screen.getByText('조회')).toBeInTheDocument();

    // 종료 버튼 ?�인
    expect(screen.getByText('종료')).toBeInTheDocument();
  });

  test('?�용?��? 부?�번?��? ?�력?�고 조회 버튼???�릭?�면 검?�이 ?�행?�다', async () => {
    render(<DeptNumberSearchPopup />);

    // 부?�번???�력
    const deptNoInput = screen.getByDisplayValue('') as HTMLInputElement;
    fireEvent.change(deptNoInput, { target: { value: '001' } });

    // 조회 버튼 ?�릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // API ?�출 ?�인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ060P00/search'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sp: 'COM_02_0301_S',
            param: ['001', '2025', '']
          })
        })
      );
    });
  });

  test('?�용?��? ?�터?��? ?�르�?검?�이 ?�행?�다', async () => {
    render(<DeptNumberSearchPopup />);

    // 부?�번???�력 ?�드?�서 ?�터???�력
    const deptNoInput = screen.getByDisplayValue('') as HTMLInputElement;
    fireEvent.keyDown(deptNoInput, { key: 'Enter' });

    // API ?�출 ?�인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ060P00/search'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sp: 'COM_02_0301_S',
            param: ['', '2025', '']
          })
        })
      );
    });
  });

  test('?�용?��? 부?�구분을 ?�택?�고 검?�하�??�당 조건?�로 검?�된??, async () => {
    render(<DeptNumberSearchPopup />);

    // 부?�구�??�택
    const deptDivSelect = screen.getByDisplayValue('?�체') as HTMLSelectElement;
    fireEvent.change(deptDivSelect, { target: { value: '01' } });

    // 조회 버튼 ?�릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // API ?�출 ?�인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ060P00/search'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sp: 'COM_02_0301_S',
            param: ['', '2025', '01']
          })
        })
      );
    });
  });

  test('검??결과가 ?�을 ??그리?�에 ?�이?��? ?�시?�다', async () => {
    // Mock API ?�답 ?�정
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            deptNo: '001',
            deptNm: '?�사?�',
            strtDt: '20250101',
            endDt: '20251231',
            deptDivCd: '01',
            deptDivNm: '본사',
            hqDivCd: '01',
            hqDivNm: '경영지?�본부',
            bsnDeptKb: 'Y'
          }
        ]
      })
    });

    render(<DeptNumberSearchPopup />);

    // 조회 버튼 ?�릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // 검???�료 ??결과 ?�인 - AG-Grid???� ?�이?��? ?�인
    await waitFor(() => {
      // 부?�번??컬럼???�이???�인
      const deptNoCells = screen.getAllByText('001');
      expect(deptNoCells.length).toBeGreaterThan(0);

      // 부?�명 컬럼???�이???�인
      const deptNmCells = screen.getAllByText('?�사?�');
      expect(deptNmCells.length).toBeGreaterThan(0);
    });
  });

  test('검??결과가 ?�을 ???�절??메시지가 ?�시?�다', async () => {
    // Mock API ?�답 ?�정 (�?결과)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: []
      })
    });

    render(<DeptNumberSearchPopup />);

    // 조회 버튼 ?�릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // AG Grid??no-data ?�버?�이 ?�인
    await waitFor(() => {
      const noDataOverlay = document.querySelector('.ag-overlay-no-rows-wrapper');
      expect(noDataOverlay).toBeInTheDocument();
    });
  });

  test('API ?�류 발생 ???�러 메시지가 ?�시?�다', async () => {
    // Mock API ?�류 ?�답 ?�정 - ok: false�??�정
    const fetchMockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}),
      headers: {},
      url: '',
      clone: () => fetchMockResponse,
      redirected: false,
      type: 'basic',
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      text: async () => '',
    };
    console.log('fetchMockResponse:', fetchMockResponse);
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: [] }) })
      .mockResolvedValueOnce(fetchMockResponse);

    render(<DeptNumberSearchPopup />);

    // 조회 버튼 ?�릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // ?�러 메시지 ?�인 - toast ?�출 ?�인
    await waitFor(() => {
      console.log('mockShowToast calls:', mockShowToast.mock.calls)
      console.log('fetch calls:', (global.fetch as jest.Mock).mock.calls)
      expect(mockShowToast).toHaveBeenCalledWith('HTTP error! status: 500', 'error');
    });
  });

  test('?�용?��? 종료 버튼???�릭?�면 ?�업???�힌??, () => {
    render(<DeptNumberSearchPopup />);

    // 종료 버튼 ?�릭
    const closeButton = screen.getByText('종료');
    fireEvent.click(closeButton);

    // window.close ?�출 ?�인
    expect(window.close).toHaveBeenCalled();
  });

  test('쿼리 ?�라미터�?초기 부?�번?��? ?�달?�면 ?�력 ?�드???�시?�다', () => {
    // URL ?�라미터 모킹
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => key === 'deptNo' ? 'D001' : null
    });

    render(<DeptNumberSearchPopup />);

    // 초기 부?�번?��? ?�력 ?�드???�시?�는지 ?�인
    expect(screen.getByDisplayValue('D001')).toBeInTheDocument();
  });

  test('?�용?��? ?�도�?변경하�?검?�하�??�당 ?�도�?검?�된??, async () => {
    render(<DeptNumberSearchPopup />);

    // ?�도 변�?
    const yearInput = screen.getByDisplayValue('2025') as HTMLInputElement;
    fireEvent.change(yearInput, { target: { value: '2023' } });

    // 부?�번???�력 - aria-label?�로 찾기
    const deptNoInput = screen.getByLabelText('부?�번??) as HTMLInputElement;
    fireEvent.change(deptNoInput, { target: { value: 'D001' } });

    // 조회 버튼 ?�릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // API ?�출 ?�인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ060P00/search'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sp: 'COM_02_0301_S',
            param: ['D001', '2023', '']
          })
        })
      );
    });
  });
}); 

