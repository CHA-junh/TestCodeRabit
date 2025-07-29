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

describe('COMZ060P00 - Î∂Ä?úÎ≤à?∏Í??âÌôîÎ©?, () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockClear();
    (window.opener.postMessage as jest.Mock).mockClear();
    (window.close as jest.Mock).mockClear();
    mockShowToast.mockClear();
    mockDeptDivCodes.mockClear();
    mockUseSearchParams.mockClear();

    // useDeptDivCodes??Î∞∞Ïó¥??ÏßÅÏ†ë Î∞òÌôò
    mockDeptDivCodes.mockReturnValue([
      { code: '01', name: 'Î≥∏ÏÇ¨' },
      { code: '02', name: 'ÏßÄ?? }
    ]);

    // Mock fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            deptNo: '001',
            deptNm: '?∏ÏÇ¨?Ä',
            deptDivCd: '01',
            deptDivNm: 'Î≥∏ÏÇ¨'
          }
        ]
      })
    });
  });

  test('?¨Ïö©?êÍ? Î∂Ä?úÎ≤à?∏Í????îÎ©¥???ëÏÜç?òÎ©¥ Î™®Îì† Ï£ºÏöî Í∏∞Îä•???úÏãú?úÎã§', () => {
    render(<DeptNumberSearchPopup />);

    // ?úÎ™© ?ïÏù∏
    expect(screen.getByText('Î∂Ä?úÎ≤à??Í≤Ä??)).toBeInTheDocument();

    // Í≤Ä??Ï°∞Í±¥ ?ÖÎ†• ?ÑÎìú ?ïÏù∏
    expect(screen.getByDisplayValue('2025')).toBeInTheDocument(); // ?ÑÎèÑ
    expect(screen.getByDisplayValue('')).toBeInTheDocument(); // Î∂Ä?úÎ≤à??(Îπ?Í∞?

    // Î∂Ä?úÍµ¨Î∂?ÏΩ§Î≥¥Î∞ïÏä§ ?µÏÖò ?ïÏù∏
    expect(screen.getByDisplayValue('?ÑÏ≤¥')).toBeInTheDocument();
    expect(screen.getByText('Î≥∏ÏÇ¨')).toBeInTheDocument();
    expect(screen.getByText('ÏßÄ??)).toBeInTheDocument();

    // Ï°∞Ìöå Î≤ÑÌäº ?ïÏù∏
    expect(screen.getByText('Ï°∞Ìöå')).toBeInTheDocument();

    // Ï¢ÖÎ£å Î≤ÑÌäº ?ïÏù∏
    expect(screen.getByText('Ï¢ÖÎ£å')).toBeInTheDocument();
  });

  test('?¨Ïö©?êÍ? Î∂Ä?úÎ≤à?∏Î? ?ÖÎ†•?òÍ≥† Ï°∞Ìöå Î≤ÑÌäº???¥Î¶≠?òÎ©¥ Í≤Ä?âÏù¥ ?§Ìñâ?úÎã§', async () => {
    render(<DeptNumberSearchPopup />);

    // Î∂Ä?úÎ≤à???ÖÎ†•
    const deptNoInput = screen.getByDisplayValue('') as HTMLInputElement;
    fireEvent.change(deptNoInput, { target: { value: '001' } });

    // Ï°∞Ìöå Î≤ÑÌäº ?¥Î¶≠
    const searchButton = screen.getByText('Ï°∞Ìöå');
    fireEvent.click(searchButton);

    // API ?∏Ï∂ú ?ïÏù∏
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

  test('?¨Ïö©?êÍ? ?îÌÑ∞?§Î? ?ÑÎ•¥Î©?Í≤Ä?âÏù¥ ?§Ìñâ?úÎã§', async () => {
    render(<DeptNumberSearchPopup />);

    // Î∂Ä?úÎ≤à???ÖÎ†• ?ÑÎìú?êÏÑú ?îÌÑ∞???ÖÎ†•
    const deptNoInput = screen.getByDisplayValue('') as HTMLInputElement;
    fireEvent.keyDown(deptNoInput, { key: 'Enter' });

    // API ?∏Ï∂ú ?ïÏù∏
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

  test('?¨Ïö©?êÍ? Î∂Ä?úÍµ¨Î∂ÑÏùÑ ?†ÌÉù?òÍ≥† Í≤Ä?âÌïòÎ©??¥Îãπ Ï°∞Í±¥?ºÎ°ú Í≤Ä?âÎêú??, async () => {
    render(<DeptNumberSearchPopup />);

    // Î∂Ä?úÍµ¨Î∂??†ÌÉù
    const deptDivSelect = screen.getByDisplayValue('?ÑÏ≤¥') as HTMLSelectElement;
    fireEvent.change(deptDivSelect, { target: { value: '01' } });

    // Ï°∞Ìöå Î≤ÑÌäº ?¥Î¶≠
    const searchButton = screen.getByText('Ï°∞Ìöå');
    fireEvent.click(searchButton);

    // API ?∏Ï∂ú ?ïÏù∏
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

  test('Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?àÏùÑ ??Í∑∏Î¶¨?úÏóê ?∞Ïù¥?∞Í? ?úÏãú?úÎã§', async () => {
    // Mock API ?ëÎãµ ?§Ï†ï
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            deptNo: '001',
            deptNm: '?∏ÏÇ¨?Ä',
            strtDt: '20250101',
            endDt: '20251231',
            deptDivCd: '01',
            deptDivNm: 'Î≥∏ÏÇ¨',
            hqDivCd: '01',
            hqDivNm: 'Í≤ΩÏòÅÏßÄ?êÎ≥∏Î∂Ä',
            bsnDeptKb: 'Y'
          }
        ]
      })
    });

    render(<DeptNumberSearchPopup />);

    // Ï°∞Ìöå Î≤ÑÌäº ?¥Î¶≠
    const searchButton = screen.getByText('Ï°∞Ìöå');
    fireEvent.click(searchButton);

    // Í≤Ä???ÑÎ£å ??Í≤∞Í≥º ?ïÏù∏ - AG-Grid???Ä ?∞Ïù¥?∞Î? ?ïÏù∏
    await waitFor(() => {
      // Î∂Ä?úÎ≤à??Ïª¨Îüº???∞Ïù¥???ïÏù∏
      const deptNoCells = screen.getAllByText('001');
      expect(deptNoCells.length).toBeGreaterThan(0);

      // Î∂Ä?úÎ™Ö Ïª¨Îüº???∞Ïù¥???ïÏù∏
      const deptNmCells = screen.getAllByText('?∏ÏÇ¨?Ä');
      expect(deptNmCells.length).toBeGreaterThan(0);
    });
  });

  test('Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ÜÏùÑ ???ÅÏ†à??Î©îÏãúÏßÄÍ∞Ä ?úÏãú?úÎã§', async () => {
    // Mock API ?ëÎãµ ?§Ï†ï (Îπ?Í≤∞Í≥º)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: []
      })
    });

    render(<DeptNumberSearchPopup />);

    // Ï°∞Ìöå Î≤ÑÌäº ?¥Î¶≠
    const searchButton = screen.getByText('Ï°∞Ìöå');
    fireEvent.click(searchButton);

    // AG Grid??no-data ?§Î≤Ñ?àÏù¥ ?ïÏù∏
    await waitFor(() => {
      const noDataOverlay = document.querySelector('.ag-overlay-no-rows-wrapper');
      expect(noDataOverlay).toBeInTheDocument();
    });
  });

  test('API ?§Î•ò Î∞úÏÉù ???êÎü¨ Î©îÏãúÏßÄÍ∞Ä ?úÏãú?úÎã§', async () => {
    // Mock API ?§Î•ò ?ëÎãµ ?§Ï†ï - ok: falseÎ°??§Ï†ï
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

    // Ï°∞Ìöå Î≤ÑÌäº ?¥Î¶≠
    const searchButton = screen.getByText('Ï°∞Ìöå');
    fireEvent.click(searchButton);

    // ?êÎü¨ Î©îÏãúÏßÄ ?ïÏù∏ - toast ?∏Ï∂ú ?ïÏù∏
    await waitFor(() => {
      console.log('mockShowToast calls:', mockShowToast.mock.calls)
      console.log('fetch calls:', (global.fetch as jest.Mock).mock.calls)
      expect(mockShowToast).toHaveBeenCalledWith('HTTP error! status: 500', 'error');
    });
  });

  test('?¨Ïö©?êÍ? Ï¢ÖÎ£å Î≤ÑÌäº???¥Î¶≠?òÎ©¥ ?ùÏóÖ???´Ìûå??, () => {
    render(<DeptNumberSearchPopup />);

    // Ï¢ÖÎ£å Î≤ÑÌäº ?¥Î¶≠
    const closeButton = screen.getByText('Ï¢ÖÎ£å');
    fireEvent.click(closeButton);

    // window.close ?∏Ï∂ú ?ïÏù∏
    expect(window.close).toHaveBeenCalled();
  });

  test('ÏøºÎ¶¨ ?åÎùºÎØ∏ÌÑ∞Î°?Ï¥àÍ∏∞ Î∂Ä?úÎ≤à?∏Í? ?ÑÎã¨?òÎ©¥ ?ÖÎ†• ?ÑÎìú???úÏãú?úÎã§', () => {
    // URL ?åÎùºÎØ∏ÌÑ∞ Î™®ÌÇπ
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => key === 'deptNo' ? 'D001' : null
    });

    render(<DeptNumberSearchPopup />);

    // Ï¥àÍ∏∞ Î∂Ä?úÎ≤à?∏Í? ?ÖÎ†• ?ÑÎìú???úÏãú?òÎäîÏßÄ ?ïÏù∏
    expect(screen.getByDisplayValue('D001')).toBeInTheDocument();
  });

  test('?¨Ïö©?êÍ? ?ÑÎèÑÎ•?Î≥ÄÍ≤ΩÌïòÍ≥?Í≤Ä?âÌïòÎ©??¥Îãπ ?ÑÎèÑÎ°?Í≤Ä?âÎêú??, async () => {
    render(<DeptNumberSearchPopup />);

    // ?ÑÎèÑ Î≥ÄÍ≤?
    const yearInput = screen.getByDisplayValue('2025') as HTMLInputElement;
    fireEvent.change(yearInput, { target: { value: '2023' } });

    // Î∂Ä?úÎ≤à???ÖÎ†• - aria-label?ºÎ°ú Ï∞æÍ∏∞
    const deptNoInput = screen.getByLabelText('Î∂Ä?úÎ≤à??) as HTMLInputElement;
    fireEvent.change(deptNoInput, { target: { value: 'D001' } });

    // Ï°∞Ìöå Î≤ÑÌäº ?¥Î¶≠
    const searchButton = screen.getByText('Ï°∞Ìöå');
    fireEvent.click(searchButton);

    // API ?∏Ï∂ú ?ïÏù∏
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

