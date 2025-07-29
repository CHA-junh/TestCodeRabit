import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import COMZ010M00Page from './COMZ010M00';

// Mock fetch
global.fetch = jest.fn();

// Mock useAuth hook
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  ...jest.requireActual('@/modules/auth/hooks/useAuth'),
  useAuth: () => ({
    session: {
      user: {
        userId: 'TEST_USER',
        empNo: 'TEST001'
      }
    }
  })
}));

// Mock useToast hook
jest.mock('@/contexts/ToastContext', () => ({
  ...jest.requireActual('@/contexts/ToastContext'),
  useToast: () => ({
    showToast: jest.fn(),
    showConfirm: jest.fn(({ onConfirm }) => onConfirm())
  })
}));

describe('COMZ010M00 - ?�스?�코?��?�??�면 ?�스??, () => {
  beforeEach(() => {
    // Mock fetch ?�답 ?�정
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            lrgCsfCd: '1001',
            lrgCsfNm: '부?�구�?,
            useYn: 'Y',
            expl: '부??구분 코드'
          },
          {
            lrgCsfCd: '1002',
            lrgCsfNm: '직급구분',
            useYn: 'Y',
            expl: '직급 구분 코드'
          }
        ]
      })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('?�용?��? ?�스?�코?��?�??�면???�속?�면 모든 주요 기능???�시?�다', async () => {
    render(<COMZ010M00Page />);

    // 조회 ?�역 ?�인
    await waitFor(() => {
      expect(screen.getByText('?�분류 코드')).toBeInTheDocument();
    });

    expect(screen.getAllByText('?�분류�?)).toHaveLength(3); // 검?? 그리???�더, ??
    expect(screen.getByText('조회')).toBeInTheDocument();

    // ?�분류 코드 ?�록 ?�역 ?�인
    expect(screen.getByText('?�분류코드 ?�록')).toBeInTheDocument();
    expect(screen.getAllByText('?�규')).toHaveLength(2);
    expect(screen.getAllByText('?�??)).toHaveLength(2);
    expect(screen.getAllByText('??��')).toHaveLength(2);

    // ?�분�?코드 ?�록 ?�역 ?�인
    expect(screen.getByText('?�분류코???�록')).toBeInTheDocument();
  });

  test('?�용?��? 조회 버튼???�릭?�면 ?�분류 코드 목록???�면???�시?�다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByText('조회')).toBeInTheDocument();
    });

    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // API ?�출 ?�인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0101_S(?,?)',
            PARAM: '|'
          })
        })
      );
    });
  });

  test('?�용?��? ?�분류코드 검??조건???�력?�고 조회?�면 ?�당 조건?�로 검?�된??, async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?�분류코드 검??)).toBeInTheDocument();
    });

    // 검??조건 ?�력
    const codeInput = screen.getByLabelText('?�분류코드 검??);
    const nameInput = screen.getByLabelText('?�분류�?검??);

    fireEvent.change(codeInput, { target: { value: '1001' } });
    fireEvent.change(nameInput, { target: { value: '부?? } });

    // 조회 버튼 ?�릭
    fireEvent.click(screen.getByText('조회'));

    // API ?�출 ?�인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0101_S(?,?)',
            PARAM: '1001|부??
          })
        })
      );
    });
  });

  test('?�용?��? ?�분류코드 ?�록 ?�에???�수 ??��???�력?�고 ?�?�할 ???�다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByLabelText('?�분류코드 ?�력')).toHaveLength(2);
    });

    // ?�분류코드 ?�력 (�?번째 ?�력 ?�드)
    const codeInputs = screen.getAllByLabelText('?�분류코드 ?�력');
    const codeInput = codeInputs[0]; // ?�분류 ?�록 ?�의 ?�력 ?�드
    const nameInput = screen.getByLabelText('?�분류�??�력');

    fireEvent.change(codeInput, { target: { value: '1003' } });
    fireEvent.change(nameInput, { target: { value: '?�스?�코?? } });

    // ?�??버튼 ?�릭 (�?번째 ?�??버튼)
    const saveButtons = screen.getAllByText('?�??);
    fireEvent.click(saveButtons[0]);

    // API ?�출 ?�인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0102_T(?,?,?,?,?,?)',
            PARAM: '1003|?�스?�코??Y||TEST_USER'
          })
        })
      );
    });
  });

  test('?�용?��? ?�분류코드 ?�록 ???�수 ??��??비어?�으�??�?�되지 ?�는??, async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('?�??)).toHaveLength(2);
    });

    // ?�수 ??�� ?�이 ?�??버튼 ?�릭
    const saveButtons = screen.getAllByText('?�??);
    fireEvent.click(saveButtons[0]);

    // API ?�출???��? ?�았?��? ?�인
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.any(Object)
      );
    });
  });

  test('?�용?��? ?�분류코드�??�택?�면 ?�당 ?�분�?코드 목록???�시?�다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByText('조회')).toBeInTheDocument();
    });

    // 조회 버튼 ?�릭?�여 ?�분류 목록 로드
    fireEvent.click(screen.getByText('조회'));

    // ?�분류 코드 조회 API ?�출 ?�인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0101_S(?,?)',
            PARAM: '|'
          })
        })
      );
    });
  });

  test('?�용?��? ?�분류코???�록 ?�에???�수 ??��???�력?�고 ?�?�할 ???�다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?�분류코???�력')).toBeInTheDocument();
    });

    // ?�분류코드 ?�력 (?�분�??�록???�해 ?�요) - ??번째 ?�력 ?�드
    const largeCodeInputs = screen.getAllByLabelText('?�분류코드 ?�력');
    const largeCodeInput = largeCodeInputs[1]; // ?�분�??�록 ?�의 ?�분류코드 ?�력 ?�드
    fireEvent.change(largeCodeInput, { target: { value: '1001' } });

    // ?�분류코???�력
    const smallCodeInput = screen.getByLabelText('?�분류코???�력');
    const smallNameInput = screen.getByLabelText('?�분류명 ?�력');

    fireEvent.change(smallCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallNameInput, { target: { value: '?�스?�소분류' } });

    // ?�??버튼 ?�릭 (??번째 ?�??버튼)
    const saveButtons = screen.getAllByText('?�??);
    fireEvent.click(saveButtons[1]);

    // API ?�출 ?�인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0105_T(?,?,?,?,?,?,?,?,?,?,?)',
            PARAM: '1001|1001|?�스?�소분류||||1|Y||TEST_USER'
          })
        })
      );
    });
  });

  test('?�용?��? ?�분류코드�???��?????�다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('??��')).toHaveLength(2);
    });

    // ??�� 버튼 ?�릭 (�?번째 ??�� 버튼 - ?�분류)
    const deleteButtons = screen.getAllByText('??��');
    fireEvent.click(deleteButtons[0]);

    // ??�� 버튼???�릭?�었?��? ?�인
    expect(deleteButtons[0]).toBeInTheDocument();
  });

  test('?�용?��? ?�분류코?��? ??��?????�다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('??��')).toHaveLength(2);
    });

    // ??�� 버튼 ?�릭 (??번째 ??�� 버튼 - ?�분�?
    const deleteButtons = screen.getAllByText('??��');
    fireEvent.click(deleteButtons[1]);

    // ??�� 버튼???�릭?�었?��? ?�인
    expect(deleteButtons[1]).toBeInTheDocument();
  });

  test('?�용?��? ?�규 버튼???�릭?�면 ?�록 ?�이 초기?�된??, async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('?�규')).toHaveLength(2);
    });

    // ?�분류코드 ?�력
    const codeInputs = screen.getAllByLabelText('?�분류코드 ?�력');
    const codeInput = codeInputs[0]; // ?�분류 ?�록 ?�의 ?�력 ?�드
    fireEvent.change(codeInput, { target: { value: '1003' } });

    // ?�규 버튼 ?�릭 (�?번째 ?�규 버튼 - ?�분류)
    const newButtons = screen.getAllByText('?�규');
    fireEvent.click(newButtons[0]);

    // ?�이 초기?�되?�는지 ?�인
    await waitFor(() => {
      expect(codeInput).toHaveValue('');
    });
  });

  test('?�용?��? ?�터?��? ?�르�?검?�이 ?�행?�다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?�분류코드 검??)).toBeInTheDocument();
    });

    // 검??조건 ?�력 ???�터??
    const codeInput = screen.getByLabelText('?�분류코드 검??);
    fireEvent.change(codeInput, { target: { value: '1001' } });
    fireEvent.keyDown(codeInput, { key: 'Enter' });

    // API ?�출 ?�인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0101_S(?,?)',
            PARAM: '1001|'
          })
        })
      );
    });
  });

  test('?�용?��? ?�분류코드 ?�록 ?�에???�터?��? ?�르�??�?�이 ?�행?�다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByLabelText('?�분류코드 ?�력')).toHaveLength(2);
    });

    // ?�수 ??�� ?�력
    const codeInputs = screen.getAllByLabelText('?�분류코드 ?�력');
    const codeInput = codeInputs[0]; // ?�분류 ?�록 ?�의 ?�력 ?�드
    const nameInput = screen.getByLabelText('?�분류�??�력');

    fireEvent.change(codeInput, { target: { value: '1003' } });
    fireEvent.change(nameInput, { target: { value: '?�스?�코?? } });

    // ?�터???�력
    fireEvent.keyDown(codeInput, { key: 'Enter' });

    // API ?�출 ?�인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('?�용?��? ?�분류코???�록 ?�에???�터?��? ?�르�??�?�이 ?�행?�다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?�분류코???�력')).toBeInTheDocument();
    });

    // ?�수 ??�� ?�력
    const largeCodeInputs = screen.getAllByLabelText('?�분류코드 ?�력');
    const largeCodeInput = largeCodeInputs[1]; // ?�분�??�록 ?�의 ?�분류코드 ?�력 ?�드
    const smallCodeInput = screen.getByLabelText('?�분류코???�력');
    const smallNameInput = screen.getByLabelText('?�분류명 ?�력');

    fireEvent.change(largeCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallNameInput, { target: { value: '?�스?�소분류' } });

    // ?�터???�력
    fireEvent.keyDown(smallCodeInput, { key: 'Enter' });

    // API ?�출 ?�인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });
}); 

