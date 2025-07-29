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

describe('COMZ060P00 - 부서번호검색화면', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockClear();
    (window.opener.postMessage as jest.Mock).mockClear();
    (window.close as jest.Mock).mockClear();
    mockShowToast.mockClear();
    mockDeptDivCodes.mockClear();
    mockUseSearchParams.mockClear();

    // useDeptDivCodes는 배열을 직접 반환
    mockDeptDivCodes.mockReturnValue([
      { code: '01', name: '본사' },
      { code: '02', name: '지점' }
    ]);

    // Mock fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            deptNo: '001',
            deptNm: '인사팀',
            deptDivCd: '01',
            deptDivNm: '본사'
          }
        ]
      })
    });
  });

  test('사용자가 부서번호검색 화면에 접속하면 모든 주요 기능이 표시된다', () => {
    render(<DeptNumberSearchPopup />);

    // 제목 확인
    expect(screen.getByText('부서번호 검색')).toBeInTheDocument();

    // 검색 조건 입력 필드 확인
    expect(screen.getByDisplayValue('2025')).toBeInTheDocument(); // 년도
    expect(screen.getByDisplayValue('')).toBeInTheDocument(); // 부서번호 (빈 값)

    // 부서구분 콤보박스 옵션 확인
    expect(screen.getByDisplayValue('전체')).toBeInTheDocument();
    expect(screen.getByText('본사')).toBeInTheDocument();
    expect(screen.getByText('지점')).toBeInTheDocument();

    // 조회 버튼 확인
    expect(screen.getByText('조회')).toBeInTheDocument();

    // 종료 버튼 확인
    expect(screen.getByText('종료')).toBeInTheDocument();
  });

  test('사용자가 부서번호를 입력하고 조회 버튼을 클릭하면 검색이 실행된다', async () => {
    render(<DeptNumberSearchPopup />);

    // 부서번호 입력
    const deptNoInput = screen.getByDisplayValue('') as HTMLInputElement;
    fireEvent.change(deptNoInput, { target: { value: '001' } });

    // 조회 버튼 클릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // API 호출 확인
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

  test('사용자가 엔터키를 누르면 검색이 실행된다', async () => {
    render(<DeptNumberSearchPopup />);

    // 부서번호 입력 필드에서 엔터키 입력
    const deptNoInput = screen.getByDisplayValue('') as HTMLInputElement;
    fireEvent.keyDown(deptNoInput, { key: 'Enter' });

    // API 호출 확인
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

  test('사용자가 부서구분을 선택하고 검색하면 해당 조건으로 검색된다', async () => {
    render(<DeptNumberSearchPopup />);

    // 부서구분 선택
    const deptDivSelect = screen.getByDisplayValue('전체') as HTMLSelectElement;
    fireEvent.change(deptDivSelect, { target: { value: '01' } });

    // 조회 버튼 클릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // API 호출 확인
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

  test('검색 결과가 있을 때 그리드에 데이터가 표시된다', async () => {
    // Mock API 응답 설정
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            deptNo: '001',
            deptNm: '인사팀',
            strtDt: '20250101',
            endDt: '20251231',
            deptDivCd: '01',
            deptDivNm: '본사',
            hqDivCd: '01',
            hqDivNm: '경영지원본부',
            bsnDeptKb: 'Y'
          }
        ]
      })
    });

    render(<DeptNumberSearchPopup />);

    // 조회 버튼 클릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // 검색 완료 후 결과 확인 - AG-Grid의 셀 데이터를 확인
    await waitFor(() => {
      // 부서번호 컬럼의 데이터 확인
      const deptNoCells = screen.getAllByText('001');
      expect(deptNoCells.length).toBeGreaterThan(0);

      // 부서명 컬럼의 데이터 확인
      const deptNmCells = screen.getAllByText('인사팀');
      expect(deptNmCells.length).toBeGreaterThan(0);
    });
  });

  test('검색 결과가 없을 때 적절한 메시지가 표시된다', async () => {
    // Mock API 응답 설정 (빈 결과)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: []
      })
    });

    render(<DeptNumberSearchPopup />);

    // 조회 버튼 클릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // AG Grid의 no-data 오버레이 확인
    await waitFor(() => {
      const noDataOverlay = document.querySelector('.ag-overlay-no-rows-wrapper');
      expect(noDataOverlay).toBeInTheDocument();
    });
  });

  test('API 오류 발생 시 에러 메시지가 표시된다', async () => {
    // Mock API 오류 응답 설정 - ok: false로 설정
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

    // 조회 버튼 클릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // 에러 메시지 확인 - toast 호출 확인
    await waitFor(() => {
      console.log('mockShowToast calls:', mockShowToast.mock.calls)
      console.log('fetch calls:', (global.fetch as jest.Mock).mock.calls)
      expect(mockShowToast).toHaveBeenCalledWith('HTTP error! status: 500', 'error');
    });
  });

  test('사용자가 종료 버튼을 클릭하면 팝업이 닫힌다', () => {
    render(<DeptNumberSearchPopup />);

    // 종료 버튼 클릭
    const closeButton = screen.getByText('종료');
    fireEvent.click(closeButton);

    // window.close 호출 확인
    expect(window.close).toHaveBeenCalled();
  });

  test('쿼리 파라미터로 초기 부서번호가 전달되면 입력 필드에 표시된다', () => {
    // URL 파라미터 모킹
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => key === 'deptNo' ? 'D001' : null
    });

    render(<DeptNumberSearchPopup />);

    // 초기 부서번호가 입력 필드에 표시되는지 확인
    expect(screen.getByDisplayValue('D001')).toBeInTheDocument();
  });

  test('사용자가 년도를 변경하고 검색하면 해당 년도로 검색된다', async () => {
    render(<DeptNumberSearchPopup />);

    // 년도 변경
    const yearInput = screen.getByDisplayValue('2025') as HTMLInputElement;
    fireEvent.change(yearInput, { target: { value: '2023' } });

    // 부서번호 입력 - aria-label으로 찾기
    const deptNoInput = screen.getByLabelText('부서번호') as HTMLInputElement;
    fireEvent.change(deptNoInput, { target: { value: 'D001' } });

    // 조회 버튼 클릭
    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // API 호출 확인
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