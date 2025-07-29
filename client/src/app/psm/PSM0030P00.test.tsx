/**
 * PSM0030P00 - 기술?�급?�력 조회 ?�업 (간단 버전)
 * 
 * ?�심 기능�??�스?�하???��??�인 버전
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PSM0030P00 from './PSM0030P00';
import { ToastProvider } from '@/contexts/ToastContext';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: ToastProvider });
};

describe('PSM0030P00', () => {
  const mockProps = {
    empNo: '10001',
    empNm: '?�길??,
    ownOutsKb: '?�사',
    entrDt: '20200101',
    lastAdbgDiv: '?��?,
    ctql: '?�보처리기사',
    ctqlPurDt: '20200201',
    adbgCarrMcnt: '48',
    ctqlCarrMcnt: '36',
    carrCalcStndDt: '20231201',
    lastTcnGrd: '중급',
    carrDiv: '1'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  test('컴포?�트가 ?�바르게 ?�더링된??, async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    await act(async () => {
      renderWithProviders(<PSM0030P00 {...mockProps} onClose={jest.fn()} />);
    });

    expect(screen.getByText('기술?�급?�력조회')).toBeInTheDocument();
    expect(screen.getByDisplayValue('?�길??)).toBeInTheDocument();
    expect(screen.getByDisplayValue('중급')).toBeInTheDocument();
  });

  test('조회 버튼 ?�릭 ??API가 ?�출?�다', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    await act(async () => {
      renderWithProviders(<PSM0030P00 {...mockProps} onClose={jest.fn()} />);
    });

    // 조회 버튼???�성?�될 ?�까지 ?��?
    await waitFor(() => {
      expect(screen.getByText('조회')).toBeInTheDocument();
    });

    // ??번째 API ?�출???�한 mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    const searchButton = screen.getByText('조회');
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/psm/career/technical-grade-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: '10001' })
      });
    });
  });

  test('종료 버튼 ?�릭 ??onClose가 ?�출?�다', async () => {
    const mockOnClose = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    await act(async () => {
      renderWithProviders(<PSM0030P00 {...mockProps} onClose={mockOnClose} />);
    });

    const closeButton = screen.getByText('종료');
    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
}); 

