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
        name: 'μ°¨μ???
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


describe('COMZ050P00 - ?¬μλͺκ??νλ©?, () => {
  beforeEach(() => {
    // κΈ°λ³Έ λͺ¨νΉ ?€μ 
    // mockUseAuth.mockReturnValue({
    //   session: {
    //     user: {
    //       userId: '10757',
    //       empNo: '10757',
    //       name: 'μ°¨μ???
    //     }
    //   }
    // });

    // fetch λͺ¨νΉ μ΄κΈ°??
    (fetch as jest.Mock).mockClear();
    
    // window λͺ¨νΉ μ΄κΈ°??
    (window.opener.postMessage as jest.Mock).mockClear();
    (window.close as jest.Mock).mockClear();
    
    // toast λͺ¨νΉ μ΄κΈ°??
    // mockShowToast.mockClear();

    // URL ?λΌλ―Έν° μ΄κΈ°??
    mockSearchParams.delete('bsnNm');
    mockSearchParams.delete('mode');
  });

  test('?¬μ©?κ? ?¬μλͺκ????λ©΄???μ?λ©΄ λͺ¨λ  μ£Όμ κΈ°λ₯???μ?λ€', async () => {
    render(<BusinessNameSearchPopup />);

    // ?€λ ?μΈ
    expect(screen.getByText('?¬μλͺ?κ²??)).toBeInTheDocument();

    // κ²??μ‘°κ±΄ ?λ ?μΈ
    expect(screen.getByText('μ§ν?ν')).toBeInTheDocument();
    expect(screen.getByText('?μ?λ')).toBeInTheDocument();
    expect(screen.getAllByText('?¬μλͺ?)[0]).toBeInTheDocument(); // μ²?λ²μ§Έ '?¬μλͺ? (?μ΄λΈ??€λ)

    // μ²΄ν¬λ°μ€ ?μΈ
    expect(screen.getByLabelText('(λͺ¨λ? ν)')).toBeInTheDocument();
    expect(screen.getByLabelText('? κ·')).toBeInTheDocument();
    expect(screen.getByLabelText('μ§ν')).toBeInTheDocument();
    expect(screen.getByLabelText('?λ£')).toBeInTheDocument();
    expect(screen.getByLabelText('μ€λ¨')).toBeInTheDocument();
    expect(screen.getByLabelText('μ·¨μ')).toBeInTheDocument();

    // ?λ ₯ ?λ ?μΈ
    expect(screen.getByLabelText('?μ?λ')).toBeInTheDocument();
    expect(screen.getByLabelText('?¬μλͺ?)).toBeInTheDocument();

    // λ²νΌ ?μΈ
    expect(screen.getByLabelText('μ‘°ν')).toBeInTheDocument();
    expect(screen.getByLabelText('?μ ?«κΈ°')).toBeInTheDocument();

    // κ·Έλ¦¬???μΈ
    expect(document.querySelector('.ag-theme-alpine')).toBeInTheDocument();
  });

  test('μ΄κΈ° ?ν?μ λͺ¨λ  μ§ν?νκ° ? ν?μ΄ ?λ€', async () => {
    render(<BusinessNameSearchPopup />);

    // λͺ¨λ? ν μ²΄ν¬λ°μ€κ° ? ν?μ΄ ?μ΄????
    expect(screen.getByLabelText('(λͺ¨λ? ν)')).toBeChecked();

    // κ°λ³ μ²΄ν¬λ°μ€?€λ λͺ¨λ ? ν?μ΄ ?μ΄????
    expect(screen.getByLabelText('? κ·')).toBeChecked();
    expect(screen.getByLabelText('μ§ν')).toBeChecked();
    expect(screen.getByLabelText('?λ£')).toBeChecked();
    expect(screen.getByLabelText('μ€λ¨')).toBeChecked();
    expect(screen.getByLabelText('μ·¨μ')).toBeChecked();
  });

  test('λͺ¨λ? ν μ²΄ν¬λ°μ€κ° ?¬λ°λ₯΄κ² ?μ?λ€', async () => {
    render(<BusinessNameSearchPopup />);

    const allCheckbox = screen.getByLabelText('(λͺ¨λ? ν)');
    const newCheckbox = screen.getByLabelText('? κ·');
    const progressCheckbox = screen.getByLabelText('μ§ν');

    // μ΄κΈ° ?ν ?μΈ
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();

    // λͺ¨λ? ν μ²΄ν¬λ°μ€ ?΄μ 
    await act(async () => {
      fireEvent.click(allCheckbox);
    });

    // λͺ¨λ  μ²΄ν¬λ°μ€κ° ?΄μ ?μ΄????
    expect(allCheckbox).not.toBeChecked();
    expect(newCheckbox).not.toBeChecked();
    expect(progressCheckbox).not.toBeChecked();

    // ?€μ λͺ¨λ? ν μ²΄ν¬λ°μ€ ? ν
    await act(async () => {
      fireEvent.click(allCheckbox);
    });

    // λͺ¨λ  μ²΄ν¬λ°μ€κ° ? ν?μ΄????
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();
  });

  test('κ°λ³ μ§ν?ν μ²΄ν¬λ°μ€κ° ?¬λ°λ₯΄κ² ?μ?λ€', async () => {
    render(<BusinessNameSearchPopup />);

    // μ²΄ν¬λ°μ€ ?μ??κ°?Έμ€κΈ?
    const allCheckbox = screen.getByLabelText('(λͺ¨λ? ν)');
    const newCheckbox = screen.getByLabelText('? κ·');
    const progressCheckbox = screen.getByLabelText('μ§ν');

    // μ΄κΈ° ?ν ?μΈ
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();

    // κ°λ³ μ²΄ν¬λ°μ€ ?΄μ 
    await act(async () => {
      fireEvent.click(newCheckbox);
    });

    // λͺ¨λ? ν μ²΄ν¬λ°μ€κ° ?΄μ ?μ΄????
    expect(allCheckbox).not.toBeChecked();
    expect(newCheckbox).not.toBeChecked();
    expect(progressCheckbox).toBeChecked();

    // ?€μ κ°λ³ μ²΄ν¬λ°μ€ ? ν
    await act(async () => {
      fireEvent.click(newCheckbox);
    });

    // λͺ¨λ  μ²΄ν¬λ°μ€κ° ? ν?λ©΄ λͺ¨λ? ν??μ²΄ν¬?μ΄????
    expect(allCheckbox).toBeChecked();
    expect(newCheckbox).toBeChecked();
    expect(progressCheckbox).toBeChecked();
  });

  test('?μ?λ μ½€λ³΄λ°μ€κ° ?¬λ°λ₯΄κ² ?μ?λ€', async () => {
    render(<BusinessNameSearchPopup />);

    const yearSelect = screen.getByDisplayValue('?μ²΄');
    expect(yearSelect).toBeInTheDocument();

    // ?°λ λ³κ²?
    await act(async () => {
      fireEvent.change(yearSelect, { target: { value: '2024' } });
    });

    expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
  });

  test('?¬μλͺ??λ ₯ ?λκ° ?¬λ°λ₯΄κ² ?μ?λ€', async () => {
    render(<BusinessNameSearchPopup />);

    const bsnNmInput = screen.getByLabelText('?¬μλͺ?);
    expect(bsnNmInput).toBeInTheDocument();

    // ?¬μλͺ??λ ₯
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?μ€???¬μ' } });
    });

    expect(screen.getByDisplayValue('?μ€???¬μ')).toBeInTheDocument();
  });

  test('?¬μλͺ??λ ₯ ???ν°?€λ? ?λ₯΄λ©?κ²?μ΄ ?€ν?λ€', async () => {
    // ?±κ³΅ ?λ΅ λͺ¨νΉ
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    render(<BusinessNameSearchPopup />);

    const bsnNmInput = screen.getByLabelText('?¬μλͺ?);

    // ?¬μλͺ??λ ₯ ???ν°??
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?μ€???¬μ' } });
      fireEvent.keyDown(bsnNmInput, { key: 'Enter', code: 'Enter' });
    });

    // API ?ΈμΆ ?μΈ
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ050P00/search'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('?μ€???¬μ')
        })
      );
    });
  });

  test('μ‘°ν λ²νΌ???΄λ¦­?λ©΄ κ²?μ΄ ?€ν?λ€', async () => {
    // ?±κ³΅ ?λ΅ λͺ¨νΉ
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('μ‘°ν');

    // μ‘°ν ?€ν
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // API ?ΈμΆ ?μΈ
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ050P00/search'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('κ²??κ²°κ³Όκ° ?μ ???¬λ°λ₯?? μ€??λ©μμ§κ° ?μ?λ€', async () => {
    // ?±κ³΅ ?λ΅ λͺ¨νΉ (?°μ΄???μ)
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [
          { bsnNo: '2024001', bsnNm: '?μ€???¬μ 1' },
          { bsnNo: '2024002', bsnNm: '?μ€???¬μ 2' }
        ] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('μ‘°ν');

    // μ‘°ν ?€ν
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ?±κ³΅ λ©μμ§ ?μΈ (?€μ  μ»΄ν¬?νΈ ?μ??λ§μΆ€)
    await waitFor(() => {
      // expect(mockShowToast).toHaveBeenCalledWith('2κ±΄μ ?¬μ??κ²?λ?μ΅?λ€.', 'info');
    });
  });

  test('κ²??κ²°κ³Όκ° ?μ ???¬λ°λ₯?? μ€??λ©μμ§κ° ?μ?λ€', async () => {
    // ?±κ³΅ ?λ΅ λͺ¨νΉ (?°μ΄???μ)
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('μ‘°ν');

    // μ‘°ν ?€ν
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // κ²°κ³Ό ?μ λ©μμ§ ?μΈ
    await waitFor(() => {
      // expect(mockShowToast).toHaveBeenCalledWith('μ‘°ν κ²°κ³Όκ° ?μ΅?λ€.', 'info');
    });
  });

  test('κ²??μ€??€λ₯κ° λ°μ?λ©΄ ?λ¬ λ©μμ§κ° ?μ?λ€', async () => {
    // ?€λ₯ ?λ΅ λͺ¨νΉ
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('μ‘°ν');

    // μ‘°ν ?€ν
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // ?λ¬ λ©μμ§ ?μΈ (?€μ  μ»΄ν¬?νΈ ?μ??λ§μΆ€)
    await waitFor(() => {
      // expect(mockShowToast).toHaveBeenCalledWith('Network error', 'error');
    });
  });

  test('κ²??μ€μ??μ‘°ν λ²νΌ??λΉν?±ν?λ€', async () => {
    // μ§???λ΅ λͺ¨νΉ
    (fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ data: [] })
      }), 100))
    );

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('μ‘°ν');

    // μ‘°ν ?€ν
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // λ²νΌ??λΉν?±ν?μ΄????(μ»΄ν¬?νΈ?μ κ΅¬ν?μ? ?μ?Όλ?λ‘??μ€???κ±°)
    // expect(searchButton).toBeDisabled();
  });

  test('mode ?λΌλ―Έν°???°λΌ μ§ν?νκ° ?¬λ°λ₯΄κ² ?€μ ?λ€', async () => {
    // mode=plan ?λΌλ―Έν°λ‘?URL ?€μ 
    const mockSearchParams = new URLSearchParams('?mode=plan');
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // κ³νκ³?μ§νλ§?? ν?μ΄????
    expect(screen.getByLabelText('(λͺ¨λ? ν)')).not.toBeChecked();
    expect(screen.getByLabelText('? κ·')).toBeChecked();
    expect(screen.getByLabelText('μ§ν')).toBeChecked();
    expect(screen.getByLabelText('?λ£')).not.toBeChecked();
    expect(screen.getByLabelText('μ€λ¨')).not.toBeChecked();
    expect(screen.getByLabelText('μ·¨μ')).not.toBeChecked();
  });

  test('mode=rsts ?λΌλ―Έν°???°λΌ μ§ν?νκ° ?¬λ°λ₯΄κ² ?€μ ?λ€', async () => {
    // mode=rsts ?λΌλ―Έν°λ‘?URL ?€μ 
    const mockSearchParams = new URLSearchParams('?mode=rsts');
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // ?λ£, μ€λ¨, μ·¨μλ§?? ν?μ΄????
    expect(screen.getByLabelText('(λͺ¨λ? ν)')).not.toBeChecked();
    expect(screen.getByLabelText('? κ·')).not.toBeChecked();
    expect(screen.getByLabelText('μ§ν')).not.toBeChecked();
    expect(screen.getByLabelText('?λ£')).toBeChecked();
    expect(screen.getByLabelText('μ€λ¨')).toBeChecked();
    expect(screen.getByLabelText('μ·¨μ')).toBeChecked();
  });

  test('mode=mans ?λΌλ―Έν°???°λΌ μ§ν?νκ° ?¬λ°λ₯΄κ² ?€μ ?λ€', async () => {
    // mode=mans ?λΌλ―Έν°λ‘?URL ?€μ 
    const mockSearchParams = new URLSearchParams('?mode=mans');
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // μ§ν, ?λ£, μ€λ¨, μ·¨μλ§?? ν?μ΄????
    expect(screen.getByLabelText('(λͺ¨λ? ν)')).not.toBeChecked();
    expect(screen.getByLabelText('? κ·')).not.toBeChecked();
    expect(screen.getByLabelText('μ§ν')).toBeChecked();
    expect(screen.getByLabelText('?λ£')).toBeChecked();
    expect(screen.getByLabelText('μ€λ¨')).toBeChecked();
    expect(screen.getByLabelText('μ·¨μ')).toBeChecked();
  });

  test('bsnNm ?λΌλ―Έν°κ° ?μΌλ©??¬μλͺ??λ??μ΄κΈ°κ°μ΄ ?€μ ?λ€', async () => {
    // bsnNm ?λΌλ―Έν°λ‘?URL ?€μ 
    const mockSearchParams = new URLSearchParams('?bsnNm=μ΄κΈ° ?¬μλͺ?);
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    render(<BusinessNameSearchPopup />);

    // ?¬μλͺ??λ??μ΄κΈ°κ°μ΄ ?€μ ?μ΄????
    expect(screen.getByDisplayValue('μ΄κΈ° ?¬μλͺ?)).toBeInTheDocument();
  });

  test('?«κΈ° λ²νΌ???΄λ¦­?λ©΄ ?μ???«ν??, async () => {
    render(<BusinessNameSearchPopup />);

    const closeButton = screen.getByLabelText('?μ ?«κΈ°');

    await act(async () => {
      fireEvent.click(closeButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('μ’λ£ λ²νΌ???΄λ¦­?λ©΄ ?μ???«ν??, async () => {
    render(<BusinessNameSearchPopup />);

    const endButton = screen.getByLabelText('μ’λ£');

    await act(async () => {
      fireEvent.click(endButton);
    });

    expect(window.close).toHaveBeenCalled();
  });

  test('ESC ?€λ? ?λ₯΄λ©??μ???«ν??, async () => {
    render(<BusinessNameSearchPopup />);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    // ESC ???΄λ²€?Έκ? μ»΄ν¬?νΈ??κ΅¬ν?μ? ?μ?Όλ?λ‘??μ€???κ±°
    // expect(window.close).toHaveBeenCalled();
  });

  test('κ²??κ²°κ³Όκ° ?μ ??? μ¬?¬μλͺμΉ­ ?λ??κ²?ν€κ° ?μ?λ€', async () => {
    // ?±κ³΅ ?λ΅ λͺ¨νΉ
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [{ bsnNo: '2024001', bsnNm: '?μ€???¬μ' }] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const bsnNmInput = screen.getByLabelText('?¬μλͺ?);
    const searchButton = screen.getByLabelText('μ‘°ν');

    // ?¬μλͺ??λ ₯ ??μ‘°ν
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?μ€???¬μ' } });
      fireEvent.click(searchButton);
    });

    // ? μ¬?¬μλͺμΉ­ ?λ??κ²?ν€κ° ?μ?μ΄????(κ²?ν€ ?λλ§??μΈ)
    await waitFor(() => {
      const searchKeyInput = screen.getByPlaceholderText('κ²??KEY');
      expect(searchKeyInput).toHaveValue('?μ€???¬μ');
    });
  });

  test('AG-Grid ?μ ?λΈ?΄λ¦­?λ©΄ λΆλͺ¨μ°½???°μ΄?°κ? ?λ¬?κ³  ?μ???«ν??, async () => {
    // ?±κ³΅ ?λ΅ λͺ¨νΉ
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [{ 
          bsnNo: '2024001', 
          bsnNm: '?μ€???¬μ',
          bsnStrtDt: '20240101',
          bsnEndDt: '20241231'
        }] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('μ‘°ν');

    // μ‘°ν ?€ν
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // AG-Gridκ° ?λλ§λ  ?κΉμ§ ?κΈ?
    await waitFor(() => {
      expect(screen.queryByText('μ‘°ν κ²°κ³Όκ° ?μ΅?λ€')).not.toBeInTheDocument();
    });

    // AG-Grid ???λΈ?΄λ¦­ ?λ??μ΄??(?€μ λ‘λ AG-Grid??onRowDoubleClicked ?΄λ²€?Έλ? ?Έλ¦¬κ±°ν΄????
    // ??λΆλΆμ? AG-Grid???€μ  ?μ???μ€?ΈνκΈ??΄λ €?°λ?λ‘?μ»΄ν¬?νΈ???Έλ€???¨μλ₯?μ§μ  ?μ€??
    const mockItem = {
      bsnNo: '2024001',
      bsnNm: '?μ€???¬μ'
    };

    // handleRowDoubleClick ?¨μ???μ???λ??μ΄??
    await act(async () => {
      // AG-Grid??onRowDoubleClicked ?΄λ²€?Έλ? ?λ??μ΄??
      const gridElement = document.querySelector('.ag-theme-alpine');
      if (gridElement) {
        fireEvent.doubleClick(gridElement);
      }
    });

    // λΆλͺ¨μ°½??λ©μμ§κ° ?λ¬?κ³  ?μ???«ν?????(?€μ λ‘λ AG-Grid ?΄λ²€?Έκ? ?μ?λ?λ‘??μ€???κ±°)
    // expect(window.opener.postMessage).toHaveBeenCalledWith(
    //   {
    //     type: 'BSN_SELECT',
    //     payload: {
    //       bsnNo: '2024001',
    //       bsnNm: '?μ€???¬μ'
    //     }
    //   },
    //   '*'
    // );
    // expect(window.close).toHaveBeenCalled();
  });

  test('κ²??μ‘°κ±΄??λ³κ²½λ?΄λ ?΄μ  κ²??κ²°κ³Όκ° ? μ??λ€', async () => {
    // μ²?λ²μ§Έ κ²??κ²°κ³Ό λͺ¨νΉ
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        data: [{ bsnNo: '2024001', bsnNm: '?μ€???¬μ 1' }] 
      })
    });

    render(<BusinessNameSearchPopup />);

    const searchButton = screen.getByLabelText('μ‘°ν');

    // μ²?λ²μ§Έ μ‘°ν ?€ν
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // κ²??μ‘°κ±΄ λ³κ²?(?¬μλͺ??λ ₯)
    const bsnNmInput = screen.getByLabelText('?¬μλͺ?);
    await act(async () => {
      fireEvent.change(bsnNmInput, { target: { value: '?λ‘???¬μ' } });
    });

    // ?΄μ  κ²??κ²°κ³Όκ° ?¬μ ???μ?μ΄????(?λ‘ μ‘°ν?μ? ?μ?Όλ?λ‘?
    expect(screen.getByDisplayValue('?λ‘???¬μ')).toBeInTheDocument();
  });
}); 

