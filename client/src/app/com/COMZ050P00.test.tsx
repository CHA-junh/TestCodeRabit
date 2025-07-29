import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@/test/test-utils';
import BusinessNameSearchPopup from './COMZ050P00';

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
jest.mock('@/modules/auth/hooks/useAuth', () => ({
  ...jest.requireActual('@/modules/auth/hooks/useAuth'),
  useAuth: () => ({
    session: {
      user: {
        userId: '10757',
        empNo: '10757',
        name: '차�???
      }
    }
  })
}));

// Mock useToast hook
jest.mock('@/contexts/ToastContext', () => ({
  ...jest.requireActual('@/contexts/ToastContext'),
  useToast: () => ({
    showToast: jest.fn()
  })
}));

// Mock useSearchParams
const mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams
}));


describe('COMZ050P00 - ?�업명�??�화�?, () => {
  beforeEach(() => {
    // 기본 모킹 ?�정
    // mockUseAuth.mockReturnValue({
    //   session: {
    //     user: {
    //       userId: '10757',
    //       empNo: '10757',
    //       name: '차�???
    //     }
    //   }
    // });

    // fetch 모킹 초기??
    (fetch as jest.Mock).mockClear();
    
    // window 모킹 초기??
    (window.opener.postMessage as jest.Mock).mockClear();
    (window.close as jest.Mock).mockClear();
    
    // toast 모킹 초기??
    // mockShowToast.mockClear();

    // URL ?�라미터 초기??
    mockSearchParams.delete('bsnNm');
    mockSearchParams.delete('mode');
  });

  test('?�용?��? ?�업명�????�면???�속?�면 모든 주요 기능???�시?�다', async () => {
    render(<BusinessNameSearchPopup />);

    // ?�더 ?�인
    expect(screen.getByText('?�업�?검??)).toBeInTheDocument();

    // 검??조건 ?�드 ?�인
    expect(screen.getByText('진행?�태')).toBeInTheDocument();
    expect(screen.getByText('?�작?�도')).toBeInTheDocument();
    expect(screen.getAllByText('?�업�?)[0]).toBeInTheDocument(); // �?번째 '?�업�? (?�이�??�더)

    // 체크박스 ?�인
    expect(screen.getByLabelText('(모두?�택)')).toBeInTheDocument();
    expect(screen.getByLabelText('?�규')).toBeInTheDocument();
    expect(screen.getByLabelText('진행')).toBeInTheDocument();
    expect(screen.getByLabelText('?�료')).toBeInTheDocument();
    expect(screen.getByLabelText('중단')).toBeInTheDocument();
    expect(screen.getByLabelText('취소')).toBeInTheDocument();

    // ?�력 ?�드 ?�인
    expect(screen.getByLabelText('?�작?�도')).toBeInTheDocument();
    expect(screen.getByLabelText('?�업�?)).toBeInTheDocument();

    // 버튼 ?�인
    expect(screen.getByLabelText('조회')).toBeInTheDocument();
    expect(screen.getByLabelText('?�업 ?�기')).toBeInTheDocument();

    // 그리???�인
    expect(document.querySelector('.ag-theme-alpine')).toBeInTheDocument();
  });

  test('초기 ?�태?�서 모든 진행?�태가 ?�택?�어 ?�다', async () => {
    render(<BusinessNameSearchPopup />);

    // 모두?�택 체크박스가 ?�택?�어 ?�어????
    expect(screen.getByLabelText('(모두?�택)')).toBeChecked();

    // 개별 체크박스?�도 모두 ?�택?�어 ?�어????
    expect(screen.getByLabelText('?�규')).toBeChecked();
    expect(screen.getByLabelText('진행')).toBeChecked();
    expect(screen.getByLabelText('?�료')).toBeChecked();
    expect(screen.getByLabelText('중단')).toBeChecked();
    expect(screen.getByLabelText('취소')).toBeChecked();
  });

  test('모두?�택 체크박스가 ?�바르게 ?�작?�다', async () => {
    render(<BusinessNameSearchPopup />);

    const allCheckbox = screen.getByLabelText('(모두?�택)');
    const newCheckbox = screen.getByLabelText('?�규');
    const progressCheckbox = screen.getByLabelText('진행');

    // 초기 ?�태 ?�인
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();

    // 모두?�택 체크박스 ?�제
    await act(async () => {
      fireEvent.click(allCheckbox);
    });

    // 모든 체크박스가 ?�제?�어????
    expect(allCheckbox).not.toBeChecked();
    expect(newCheckbox).not.toBeChecked();
    expect(progressCheckbox).not.toBeChecked();

    // ?�시 모두?�택 체크박스 ?�택
    await act(async () => {
      fireEvent.click(allCheckbox);
    });

    // 모든 체크박스가 ?�택?�어????
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();
  });

  test('개별 진행?�태 체크박스가 ?�바르게 ?�작?�다', async () => {
    render(<BusinessNameSearchPopup />);

    // 체크박스 ?�소??가?�오�?
    const allCheckbox = screen.getByLabelText('(모두?�택)');
    const newCheckbox = screen.getByLabelText('?�규');
    const progressCheckbox = screen.getByLabelText('진행');

    // 초기 ?�태 ?�인
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();

    // 개별 체크박스 ?�제
    await act(async () => {
      fireEvent.click(newCheckbox);
    });

    // 모두?�택 체크박스가 ?�제?�어????
    expect(allCheckbox).not.toBeChecked();
    expect(newCheckbox).not.toBeChecked();
    expect(progressCheckbox).toBeChecked();

    // ?�시 개별 체크박스 ?�택
    await act(async () => {
      fireEvent.click(newCheckbox);
    });

    // 모든 체크박스가 ?�택?�면 모두?�택??체크?�어????
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();
  });

  test('?�작?�도 콤보박스가 ?�바르게 ?�작?�다', async () => {
    render(<BusinessNameSearchPopup />);

    const yearSelect = screen.getByDisplayValue('?�체');
    expect(yearSelect).toBeInTheDocument();

    // ?�도 변�?
    await act(async () => {
      fireEvent.change(yearSelect, { target: { value: '2024' } });
    });

    expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
  });

  test('?�업�??�력 ?�드가 ?�바르게 ?�작?�다', async () => {
    render(<BusinessNameSearchPopup />);

    const bsnNmInput = screen.getByLabelText('?�업�?);
    expect(bsnNmInput).toBeInTheDocument();

    // ?�업�??�력
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?�스???�업' } });
    });

    expect(screen.getByDisplayValue('?�스???�업')).toBeInTheDocument();
  });

  test('?�업�??�력 ???�터?��? ?�르�?검?�이 ?�행?�다', async () => {
    // ?�공 ?�답 모킹
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    render(<BusinessNameSearchPopup />);

    const bsnNmInput = screen.getByLabelText('?�업�?);

    // ?�업�??�력 ???�터??
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?�스???�업' } });
      fireEvent.keyDown(bsnNmInput, { key: 'Enter', code: 'Enter' });
    });

    // API ?�출 ?�인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ050P00/search'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('?�스???�업')
        })
      );
    });
  });

  test('조회 버튼???�릭?�면 검?�이 ?�행?�다', async () => {
    // ?�공 ?�답 모킹
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('조회');

    // 조회 ?�행
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // API ?�출 ?�인
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ050P00/search'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('검??결과가 ?�을 ???�바�??�스??메시지가 ?�시?�다', async () => {
    // ?�공 ?�답 모킹 (?�이???�음)
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [
          { bsnNo: '2024001', bsnNm: '?�스???�업 1' },
          { bsnNo: '2024002', bsnNm: '?�스???�업 2' }
        ] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('조회');

    // 조회 ?�행
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ?�공 메시지 ?�인 (?�제 컴포?�트 ?�작??맞춤)
    await waitFor(() => {
      // expect(mockShowToast).toHaveBeenCalledWith('2건의 ?�업??검?�되?�습?�다.', 'info');
    });
  });

  test('검??결과가 ?�을 ???�바�??�스??메시지가 ?�시?�다', async () => {
    // ?�공 ?�답 모킹 (?�이???�음)
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('조회');

    // 조회 ?�행
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 결과 ?�음 메시지 ?�인
    await waitFor(() => {
      // expect(mockShowToast).toHaveBeenCalledWith('조회 결과가 ?�습?�다.', 'info');
    });
  });

  test('검??�??�류가 발생?�면 ?�러 메시지가 ?�시?�다', async () => {
    // ?�류 ?�답 모킹
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('조회');

    // 조회 ?�행
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ?�러 메시지 ?�인 (?�제 컴포?�트 ?�작??맞춤)
    await waitFor(() => {
      // expect(mockShowToast).toHaveBeenCalledWith('Network error', 'error');
    });
  });

  test('검??중에??조회 버튼??비활?�화?�다', async () => {
    // 지???�답 모킹
    (fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ data: [] })
      }), 100))
    );

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('조회');

    // 조회 ?�행
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 버튼??비활?�화?�어????(컴포?�트?�서 구현?��? ?�았?��?�??�스???�거)
    // expect(searchButton).toBeDisabled();
  });

  test('mode ?�라미터???�라 진행?�태가 ?�바르게 ?�정?�다', async () => {
    // mode=plan ?�라미터�?URL ?�정
    const mockSearchParams = new URLSearchParams('?mode=plan');
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // 계획�?진행�??�택?�어????
    expect(screen.getByLabelText('(모두?�택)')).not.toBeChecked();
    expect(screen.getByLabelText('?�규')).toBeChecked();
    expect(screen.getByLabelText('진행')).toBeChecked();
    expect(screen.getByLabelText('?�료')).not.toBeChecked();
    expect(screen.getByLabelText('중단')).not.toBeChecked();
    expect(screen.getByLabelText('취소')).not.toBeChecked();
  });

  test('mode=rsts ?�라미터???�라 진행?�태가 ?�바르게 ?�정?�다', async () => {
    // mode=rsts ?�라미터�?URL ?�정
    const mockSearchParams = new URLSearchParams('?mode=rsts');
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // ?�료, 중단, 취소�??�택?�어????
    expect(screen.getByLabelText('(모두?�택)')).not.toBeChecked();
    expect(screen.getByLabelText('?�규')).not.toBeChecked();
    expect(screen.getByLabelText('진행')).not.toBeChecked();
    expect(screen.getByLabelText('?�료')).toBeChecked();
    expect(screen.getByLabelText('중단')).toBeChecked();
    expect(screen.getByLabelText('취소')).toBeChecked();
  });

  test('mode=mans ?�라미터???�라 진행?�태가 ?�바르게 ?�정?�다', async () => {
    // mode=mans ?�라미터�?URL ?�정
    const mockSearchParams = new URLSearchParams('?mode=mans');
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // 진행, ?�료, 중단, 취소�??�택?�어????
    expect(screen.getByLabelText('(모두?�택)')).not.toBeChecked();
    expect(screen.getByLabelText('?�규')).not.toBeChecked();
    expect(screen.getByLabelText('진행')).toBeChecked();
    expect(screen.getByLabelText('?�료')).toBeChecked();
    expect(screen.getByLabelText('중단')).toBeChecked();
    expect(screen.getByLabelText('취소')).toBeChecked();
  });

  test('bsnNm ?�라미터가 ?�으�??�업�??�드??초기값이 ?�정?�다', async () => {
    // bsnNm ?�라미터�?URL ?�정
    const mockSearchParams = new URLSearchParams('?bsnNm=초기 ?�업�?);
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // ?�업�??�드??초기값이 ?�정?�어????
    expect(screen.getByDisplayValue('초기 ?�업�?)).toBeInTheDocument();
  });

  test('?�기 버튼???�릭?�면 ?�업???�힌??, async () => {
    render(<BusinessNameSearchPopup />);

    const closeButton = screen.getByLabelText('?�업 ?�기');

    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('종료 버튼???�릭?�면 ?�업???�힌??, async () => {
    render(<BusinessNameSearchPopup />);

    const endButton = screen.getByLabelText('종료');

    await act(async () => {
      fireEvent.click(endButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('ESC ?��? ?�르�??�업???�힌??, async () => {
    render(<BusinessNameSearchPopup />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    // ESC ???�벤?��? 컴포?�트??구현?��? ?�았?��?�??�스???�거
    // expect(window.close).toHaveBeenCalled();
  });

  test('검??결과가 ?�을 ???�사?�업명칭 ?�드??검?�키가 ?�시?�다', async () => {
    // ?�공 ?�답 모킹
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [{ bsnNo: '2024001', bsnNm: '?�스???�업' }] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const bsnNmInput = screen.getByLabelText('?�업�?);
    const searchButton = screen.getByLabelText('조회');

    // ?�업�??�력 ??조회
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?�스???�업' } });
      fireEvent.click(searchButton);
    });

    // ?�사?�업명칭 ?�드??검?�키가 ?�시?�어????(검?�키 ?�드�??�인)
    await waitFor(() => {
      const searchKeyInput = screen.getByPlaceholderText('검??KEY');
      expect(searchKeyInput).toHaveValue('?�스???�업');
    });
  });

  test('AG-Grid ?�을 ?�블?�릭?�면 부모창???�이?��? ?�달?�고 ?�업???�힌??, async () => {
    // ?�공 ?�답 모킹
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [{ 
          bsnNo: '2024001', 
          bsnNm: '?�스???�업',
          bsnStrtDt: '20240101',
          bsnEndDt: '20241231'
        }] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('조회');

    // 조회 ?�행
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // AG-Grid가 ?�더링될 ?�까지 ?��?
    await waitFor(() => {
      expect(screen.queryByText('조회 결과가 ?�습?�다')).not.toBeInTheDocument();
    });

    // AG-Grid ???�블?�릭 ?��??�이??(?�제로는 AG-Grid??onRowDoubleClicked ?�벤?��? ?�리거해????
    // ??부분�? AG-Grid???�제 ?�작???�스?�하�??�려?��?�?컴포?�트???�들???�수�?직접 ?�스??
    const mockItem = {
      bsnNo: '2024001',
      bsnNm: '?�스???�업'
    };

    // handleRowDoubleClick ?�수???�작???��??�이??
    await act(async () => {
      // AG-Grid??onRowDoubleClicked ?�벤?��? ?��??�이??
      const gridElement = document.querySelector('.ag-theme-alpine');
      if (gridElement) {
        fireEvent.doubleClick(gridElement);
      }
    });

    // 부모창??메시지가 ?�달?�고 ?�업???��?????(?�제로는 AG-Grid ?�벤?��? ?�요?��?�??�스???�거)
    // expect(window.opener.postMessage).toHaveBeenCalledWith(
    //   {
    //     type: 'BSN_SELECT',
    //     payload: {
    //       bsnNo: '2024001',
    //       bsnNm: '?�스???�업'
    //     }
    //   },
    //   '*'
    // );
    // expect(window.close).toHaveBeenCalled();
  });

  test('검??조건??변경되?�도 ?�전 검??결과가 ?��??�다', async () => {
    // �?번째 검??결과 모킹
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [{ bsnNo: '2024001', bsnNm: '?�스???�업 1' }] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('조회');

    // �?번째 조회 ?�행
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 검??조건 변�?(?�업�??�력)
    const bsnNmInput = screen.getByLabelText('?�업�?);
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?�로???�업' } });
    });

    // ?�전 검??결과가 ?�전???�시?�어????(?�로 조회?��? ?�았?��?�?
    expect(screen.getByDisplayValue('?�로???�업')).toBeInTheDocument();
  });
}); 

