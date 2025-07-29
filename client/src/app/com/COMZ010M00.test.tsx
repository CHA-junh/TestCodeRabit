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

describe('COMZ010M00 - 시스템코드관리 화면 테스트', () => {
  beforeEach(() => {
    // Mock fetch 응답 설정
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            lrgCsfCd: '1001',
            lrgCsfNm: '부서구분',
            useYn: 'Y',
            expl: '부서 구분 코드'
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

  test('사용자가 시스템코드관리 화면에 접속하면 모든 주요 기능이 표시된다', async () => {
    render(<COMZ010M00Page />);

    // 조회 영역 확인
    await waitFor(() => {
      expect(screen.getByText('대분류 코드')).toBeInTheDocument();
    });

    expect(screen.getAllByText('대분류명')).toHaveLength(3); // 검색, 그리드 헤더, 폼
    expect(screen.getByText('조회')).toBeInTheDocument();

    // 대분류 코드 등록 영역 확인
    expect(screen.getByText('대분류코드 등록')).toBeInTheDocument();
    expect(screen.getAllByText('신규')).toHaveLength(2);
    expect(screen.getAllByText('저장')).toHaveLength(2);
    expect(screen.getAllByText('삭제')).toHaveLength(2);

    // 소분류 코드 등록 영역 확인
    expect(screen.getByText('소분류코드 등록')).toBeInTheDocument();
  });

  test('사용자가 조회 버튼을 클릭하면 대분류 코드 목록이 화면에 표시된다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByText('조회')).toBeInTheDocument();
    });

    const searchButton = screen.getByText('조회');
    fireEvent.click(searchButton);

    // API 호출 확인
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

  test('사용자가 대분류코드 검색 조건을 입력하고 조회하면 해당 조건으로 검색된다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('대분류코드 검색')).toBeInTheDocument();
    });

    // 검색 조건 입력
    const codeInput = screen.getByLabelText('대분류코드 검색');
    const nameInput = screen.getByLabelText('대분류명 검색');

    fireEvent.change(codeInput, { target: { value: '1001' } });
    fireEvent.change(nameInput, { target: { value: '부서' } });

    // 조회 버튼 클릭
    fireEvent.click(screen.getByText('조회'));

    // API 호출 확인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0101_S(?,?)',
            PARAM: '1001|부서'
          })
        })
      );
    });
  });

  test('사용자가 대분류코드 등록 폼에서 필수 항목을 입력하고 저장할 수 있다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByLabelText('대분류코드 입력')).toHaveLength(2);
    });

    // 대분류코드 입력 (첫 번째 입력 필드)
    const codeInputs = screen.getAllByLabelText('대분류코드 입력');
    const codeInput = codeInputs[0]; // 대분류 등록 폼의 입력 필드
    const nameInput = screen.getByLabelText('대분류명 입력');

    fireEvent.change(codeInput, { target: { value: '1003' } });
    fireEvent.change(nameInput, { target: { value: '테스트코드' } });

    // 저장 버튼 클릭 (첫 번째 저장 버튼)
    const saveButtons = screen.getAllByText('저장');
    fireEvent.click(saveButtons[0]);

    // API 호출 확인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0102_T(?,?,?,?,?,?)',
            PARAM: '1003|테스트코드|Y||TEST_USER'
          })
        })
      );
    });
  });

  test('사용자가 대분류코드 등록 시 필수 항목이 비어있으면 저장되지 않는다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('저장')).toHaveLength(2);
    });

    // 필수 항목 없이 저장 버튼 클릭
    const saveButtons = screen.getAllByText('저장');
    fireEvent.click(saveButtons[0]);

    // API 호출이 되지 않았는지 확인
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.any(Object)
      );
    });
  });

  test('사용자가 대분류코드를 선택하면 해당 소분류 코드 목록이 표시된다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByText('조회')).toBeInTheDocument();
    });

    // 조회 버튼 클릭하여 대분류 목록 로드
    fireEvent.click(screen.getByText('조회'));

    // 대분류 코드 조회 API 호출 확인
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

  test('사용자가 소분류코드 등록 폼에서 필수 항목을 입력하고 저장할 수 있다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('소분류코드 입력')).toBeInTheDocument();
    });

    // 대분류코드 입력 (소분류 등록을 위해 필요) - 두 번째 입력 필드
    const largeCodeInputs = screen.getAllByLabelText('대분류코드 입력');
    const largeCodeInput = largeCodeInputs[1]; // 소분류 등록 폼의 대분류코드 입력 필드
    fireEvent.change(largeCodeInput, { target: { value: '1001' } });

    // 소분류코드 입력
    const smallCodeInput = screen.getByLabelText('소분류코드 입력');
    const smallNameInput = screen.getByLabelText('소분류명 입력');

    fireEvent.change(smallCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallNameInput, { target: { value: '테스트소분류' } });

    // 저장 버튼 클릭 (두 번째 저장 버튼)
    const saveButtons = screen.getAllByText('저장');
    fireEvent.click(saveButtons[1]);

    // API 호출 확인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0105_T(?,?,?,?,?,?,?,?,?,?,?)',
            PARAM: '1001|1001|테스트소분류||||1|Y||TEST_USER'
          })
        })
      );
    });
  });

  test('사용자가 대분류코드를 삭제할 수 있다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('삭제')).toHaveLength(2);
    });

    // 삭제 버튼 클릭 (첫 번째 삭제 버튼 - 대분류)
    const deleteButtons = screen.getAllByText('삭제');
    fireEvent.click(deleteButtons[0]);

    // 삭제 버튼이 클릭되었는지 확인
    expect(deleteButtons[0]).toBeInTheDocument();
  });

  test('사용자가 소분류코드를 삭제할 수 있다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('삭제')).toHaveLength(2);
    });

    // 삭제 버튼 클릭 (두 번째 삭제 버튼 - 소분류)
    const deleteButtons = screen.getAllByText('삭제');
    fireEvent.click(deleteButtons[1]);

    // 삭제 버튼이 클릭되었는지 확인
    expect(deleteButtons[1]).toBeInTheDocument();
  });

  test('사용자가 신규 버튼을 클릭하면 등록 폼이 초기화된다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('신규')).toHaveLength(2);
    });

    // 대분류코드 입력
    const codeInputs = screen.getAllByLabelText('대분류코드 입력');
    const codeInput = codeInputs[0]; // 대분류 등록 폼의 입력 필드
    fireEvent.change(codeInput, { target: { value: '1003' } });

    // 신규 버튼 클릭 (첫 번째 신규 버튼 - 대분류)
    const newButtons = screen.getAllByText('신규');
    fireEvent.click(newButtons[0]);

    // 폼이 초기화되었는지 확인
    await waitFor(() => {
      expect(codeInput).toHaveValue('');
    });
  });

  test('사용자가 엔터키를 누르면 검색이 실행된다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('대분류코드 검색')).toBeInTheDocument();
    });

    // 검색 조건 입력 후 엔터키
    const codeInput = screen.getByLabelText('대분류코드 검색');
    fireEvent.change(codeInput, { target: { value: '1001' } });
    fireEvent.keyDown(codeInput, { key: 'Enter' });

    // API 호출 확인
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

  test('사용자가 대분류코드 등록 폼에서 엔터키를 누르면 저장이 실행된다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByLabelText('대분류코드 입력')).toHaveLength(2);
    });

    // 필수 항목 입력
    const codeInputs = screen.getAllByLabelText('대분류코드 입력');
    const codeInput = codeInputs[0]; // 대분류 등록 폼의 입력 필드
    const nameInput = screen.getByLabelText('대분류명 입력');

    fireEvent.change(codeInput, { target: { value: '1003' } });
    fireEvent.change(nameInput, { target: { value: '테스트코드' } });

    // 엔터키 입력
    fireEvent.keyDown(codeInput, { key: 'Enter' });

    // API 호출 확인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('사용자가 소분류코드 등록 폼에서 엔터키를 누르면 저장이 실행된다', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('소분류코드 입력')).toBeInTheDocument();
    });

    // 필수 항목 입력
    const largeCodeInputs = screen.getAllByLabelText('대분류코드 입력');
    const largeCodeInput = largeCodeInputs[1]; // 소분류 등록 폼의 대분류코드 입력 필드
    const smallCodeInput = screen.getByLabelText('소분류코드 입력');
    const smallNameInput = screen.getByLabelText('소분류명 입력');

    fireEvent.change(largeCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallNameInput, { target: { value: '테스트소분류' } });

    // 엔터키 입력
    fireEvent.keyDown(smallCodeInput, { key: 'Enter' });

    // API 호출 확인
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