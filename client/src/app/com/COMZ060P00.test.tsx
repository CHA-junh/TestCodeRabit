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

describe('COMZ060P00 - ๋ถ?๋ฒ?ธ๊??ํ๋ฉ?, () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockClear();
    (window.opener.postMessage as jest.Mock).mockClear();
    (window.close as jest.Mock).mockClear();
    mockShowToast.mockClear();
    mockDeptDivCodes.mockClear();
    mockUseSearchParams.mockClear();

    // useDeptDivCodes??๋ฐฐ์ด??์ง์  ๋ฐํ
    mockDeptDivCodes.mockReturnValue([
      { code: '01', name: '๋ณธ์ฌ' },
      { code: '02', name: '์ง?? }
    ]);

    // Mock fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            deptNo: '001',
            deptNm: '?ธ์ฌ?',
            deptDivCd: '01',
            deptDivNm: '๋ณธ์ฌ'
          }
        ]
      })
    });
  });

  test('?ฌ์ฉ?๊? ๋ถ?๋ฒ?ธ๊????๋ฉด???์?๋ฉด ๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???์?๋ค', () => {
    render(<DeptNumberSearchPopup />);

    // ?๋ชฉ ?์ธ
    expect(screen.getByText('๋ถ?๋ฒ??๊ฒ??)).toBeInTheDocument();

    // ๊ฒ??์กฐ๊ฑด ?๋ ฅ ?๋ ?์ธ
    expect(screen.getByDisplayValue('2025')).toBeInTheDocument(); // ?๋
    expect(screen.getByDisplayValue('')).toBeInTheDocument(); // ๋ถ?๋ฒ??(๋น?๊ฐ?

    // ๋ถ?๊ตฌ๋ถ?์ฝค๋ณด๋ฐ์ค ?ต์ ?์ธ
    expect(screen.getByDisplayValue('?์ฒด')).toBeInTheDocument();
    expect(screen.getByText('๋ณธ์ฌ')).toBeInTheDocument();
    expect(screen.getByText('์ง??)).toBeInTheDocument();

    // ์กฐํ ๋ฒํผ ?์ธ
    expect(screen.getByText('์กฐํ')).toBeInTheDocument();

    // ์ข๋ฃ ๋ฒํผ ?์ธ
    expect(screen.getByText('์ข๋ฃ')).toBeInTheDocument();
  });

  test('?ฌ์ฉ?๊? ๋ถ?๋ฒ?ธ๋? ?๋ ฅ?๊ณ  ์กฐํ ๋ฒํผ???ด๋ฆญ?๋ฉด ๊ฒ?์ด ?คํ?๋ค', async () => {
    render(<DeptNumberSearchPopup />);

    // ๋ถ?๋ฒ???๋ ฅ
    const deptNoInput = screen.getByDisplayValue('') as HTMLInputElement;
    fireEvent.change(deptNoInput, { target: { value: '001' } });

    // ์กฐํ ๋ฒํผ ?ด๋ฆญ
    const searchButton = screen.getByText('์กฐํ');
    fireEvent.click(searchButton);

    // API ?ธ์ถ ?์ธ
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

  test('?ฌ์ฉ?๊? ?ํฐ?ค๋? ?๋ฅด๋ฉ?๊ฒ?์ด ?คํ?๋ค', async () => {
    render(<DeptNumberSearchPopup />);

    // ๋ถ?๋ฒ???๋ ฅ ?๋?์ ?ํฐ???๋ ฅ
    const deptNoInput = screen.getByDisplayValue('') as HTMLInputElement;
    fireEvent.keyDown(deptNoInput, { key: 'Enter' });

    // API ?ธ์ถ ?์ธ
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

  test('?ฌ์ฉ?๊? ๋ถ?๊ตฌ๋ถ์ ? ํ?๊ณ  ๊ฒ?ํ๋ฉ??ด๋น ์กฐ๊ฑด?ผ๋ก ๊ฒ?๋??, async () => {
    render(<DeptNumberSearchPopup />);

    // ๋ถ?๊ตฌ๋ถ?? ํ
    const deptDivSelect = screen.getByDisplayValue('?์ฒด') as HTMLSelectElement;
    fireEvent.change(deptDivSelect, { target: { value: '01' } });

    // ์กฐํ ๋ฒํผ ?ด๋ฆญ
    const searchButton = screen.getByText('์กฐํ');
    fireEvent.click(searchButton);

    // API ?ธ์ถ ?์ธ
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

  test('๊ฒ??๊ฒฐ๊ณผ๊ฐ ?์ ??๊ทธ๋ฆฌ?์ ?ฐ์ด?ฐ๊? ?์?๋ค', async () => {
    // Mock API ?๋ต ?ค์ 
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            deptNo: '001',
            deptNm: '?ธ์ฌ?',
            strtDt: '20250101',
            endDt: '20251231',
            deptDivCd: '01',
            deptDivNm: '๋ณธ์ฌ',
            hqDivCd: '01',
            hqDivNm: '๊ฒฝ์์ง?๋ณธ๋ถ',
            bsnDeptKb: 'Y'
          }
        ]
      })
    });

    render(<DeptNumberSearchPopup />);

    // ์กฐํ ๋ฒํผ ?ด๋ฆญ
    const searchButton = screen.getByText('์กฐํ');
    fireEvent.click(searchButton);

    // ๊ฒ???๋ฃ ??๊ฒฐ๊ณผ ?์ธ - AG-Grid??? ?ฐ์ด?ฐ๋? ?์ธ
    await waitFor(() => {
      // ๋ถ?๋ฒ??์ปฌ๋ผ???ฐ์ด???์ธ
      const deptNoCells = screen.getAllByText('001');
      expect(deptNoCells.length).toBeGreaterThan(0);

      // ๋ถ?๋ช ์ปฌ๋ผ???ฐ์ด???์ธ
      const deptNmCells = screen.getAllByText('?ธ์ฌ?');
      expect(deptNmCells.length).toBeGreaterThan(0);
    });
  });

  test('๊ฒ??๊ฒฐ๊ณผ๊ฐ ?์ ???์ ??๋ฉ์์ง๊ฐ ?์?๋ค', async () => {
    // Mock API ?๋ต ?ค์  (๋น?๊ฒฐ๊ณผ)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: []
      })
    });

    render(<DeptNumberSearchPopup />);

    // ์กฐํ ๋ฒํผ ?ด๋ฆญ
    const searchButton = screen.getByText('์กฐํ');
    fireEvent.click(searchButton);

    // AG Grid??no-data ?ค๋ฒ?์ด ?์ธ
    await waitFor(() => {
      const noDataOverlay = document.querySelector('.ag-overlay-no-rows-wrapper');
      expect(noDataOverlay).toBeInTheDocument();
    });
  });

  test('API ?ค๋ฅ ๋ฐ์ ???๋ฌ ๋ฉ์์ง๊ฐ ?์?๋ค', async () => {
    // Mock API ?ค๋ฅ ?๋ต ?ค์  - ok: false๋ก??ค์ 
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

    // ์กฐํ ๋ฒํผ ?ด๋ฆญ
    const searchButton = screen.getByText('์กฐํ');
    fireEvent.click(searchButton);

    // ?๋ฌ ๋ฉ์์ง ?์ธ - toast ?ธ์ถ ?์ธ
    await waitFor(() => {
      console.log('mockShowToast calls:', mockShowToast.mock.calls)
      console.log('fetch calls:', (global.fetch as jest.Mock).mock.calls)
      expect(mockShowToast).toHaveBeenCalledWith('HTTP error! status: 500', 'error');
    });
  });

  test('?ฌ์ฉ?๊? ์ข๋ฃ ๋ฒํผ???ด๋ฆญ?๋ฉด ?์???ซํ??, () => {
    render(<DeptNumberSearchPopup />);

    // ์ข๋ฃ ๋ฒํผ ?ด๋ฆญ
    const closeButton = screen.getByText('์ข๋ฃ');
    fireEvent.click(closeButton);

    // window.close ?ธ์ถ ?์ธ
    expect(window.close).toHaveBeenCalled();
  });

  test('์ฟผ๋ฆฌ ?๋ผ๋ฏธํฐ๋ก?์ด๊ธฐ ๋ถ?๋ฒ?ธ๊? ?๋ฌ?๋ฉด ?๋ ฅ ?๋???์?๋ค', () => {
    // URL ?๋ผ๋ฏธํฐ ๋ชจํน
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => key === 'deptNo' ? 'D001' : null
    });

    render(<DeptNumberSearchPopup />);

    // ์ด๊ธฐ ๋ถ?๋ฒ?ธ๊? ?๋ ฅ ?๋???์?๋์ง ?์ธ
    expect(screen.getByDisplayValue('D001')).toBeInTheDocument();
  });

  test('?ฌ์ฉ?๊? ?๋๋ฅ?๋ณ๊ฒฝํ๊ณ?๊ฒ?ํ๋ฉ??ด๋น ?๋๋ก?๊ฒ?๋??, async () => {
    render(<DeptNumberSearchPopup />);

    // ?๋ ๋ณ๊ฒ?
    const yearInput = screen.getByDisplayValue('2025') as HTMLInputElement;
    fireEvent.change(yearInput, { target: { value: '2023' } });

    // ๋ถ?๋ฒ???๋ ฅ - aria-label?ผ๋ก ์ฐพ๊ธฐ
    const deptNoInput = screen.getByLabelText('๋ถ?๋ฒ??) as HTMLInputElement;
    fireEvent.change(deptNoInput, { target: { value: 'D001' } });

    // ์กฐํ ๋ฒํผ ?ด๋ฆญ
    const searchButton = screen.getByText('์กฐํ');
    fireEvent.click(searchButton);

    // API ?ธ์ถ ?์ธ
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

