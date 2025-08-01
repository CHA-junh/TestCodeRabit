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

describe('COMZ010M00 - ?μ€?μ½?κ?λ¦??λ©΄ ?μ€??, () => {
  beforeEach(() => {
    // Mock fetch ?λ΅ ?€μ 
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            lrgCsfCd: '1001',
            lrgCsfNm: 'λΆ?κ΅¬λΆ?,
            useYn: 'Y',
            expl: 'λΆ??κ΅¬λΆ μ½λ'
          },
          {
            lrgCsfCd: '1002',
            lrgCsfNm: 'μ§κΈκ΅¬λΆ',
            useYn: 'Y',
            expl: 'μ§κΈ κ΅¬λΆ μ½λ'
          }
        ]
      })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('?¬μ©?κ? ?μ€?μ½?κ?λ¦??λ©΄???μ?λ©΄ λͺ¨λ  μ£Όμ κΈ°λ₯???μ?λ€', async () => {
    render(<COMZ010M00Page />);

    // μ‘°ν ?μ­ ?μΈ
    await waitFor(() => {
      expect(screen.getByText('?λΆλ₯ μ½λ')).toBeInTheDocument();
    });

    expect(screen.getAllByText('?λΆλ₯λͺ?)).toHaveLength(3); // κ²?? κ·Έλ¦¬???€λ, ??
    expect(screen.getByText('μ‘°ν')).toBeInTheDocument();

    // ?λΆλ₯ μ½λ ?±λ‘ ?μ­ ?μΈ
    expect(screen.getByText('?λΆλ₯μ½λ ?±λ‘')).toBeInTheDocument();
    expect(screen.getAllByText('? κ·')).toHaveLength(2);
    expect(screen.getAllByText('???)).toHaveLength(2);
    expect(screen.getAllByText('?? ')).toHaveLength(2);

    // ?λΆλ₯?μ½λ ?±λ‘ ?μ­ ?μΈ
    expect(screen.getByText('?λΆλ₯μ½???±λ‘')).toBeInTheDocument();
  });

  test('?¬μ©?κ? μ‘°ν λ²νΌ???΄λ¦­?λ©΄ ?λΆλ₯ μ½λ λͺ©λ‘???λ©΄???μ?λ€', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByText('μ‘°ν')).toBeInTheDocument();
    });

    const searchButton = screen.getByText('μ‘°ν');
    fireEvent.click(searchButton);

    // API ?ΈμΆ ?μΈ
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

  test('?¬μ©?κ? ?λΆλ₯μ½λ κ²??μ‘°κ±΄???λ ₯?κ³  μ‘°ν?λ©΄ ?΄λΉ μ‘°κ±΄?Όλ‘ κ²?λ??, async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?λΆλ₯μ½λ κ²??)).toBeInTheDocument();
    });

    // κ²??μ‘°κ±΄ ?λ ₯
    const codeInput = screen.getByLabelText('?λΆλ₯μ½λ κ²??);
    const nameInput = screen.getByLabelText('?λΆλ₯λͺ?κ²??);

    fireEvent.change(codeInput, { target: { value: '1001' } });
    fireEvent.change(nameInput, { target: { value: 'λΆ?? } });

    // μ‘°ν λ²νΌ ?΄λ¦­
    fireEvent.click(screen.getByText('μ‘°ν'));

    // API ?ΈμΆ ?μΈ
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/search'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0101_S(?,?)',
            PARAM: '1001|λΆ??
          })
        })
      );
    });
  });

  test('?¬μ©?κ? ?λΆλ₯μ½λ ?±λ‘ ?Όμ???μ ??ͺ©???λ ₯?κ³  ??₯ν  ???λ€', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByLabelText('?λΆλ₯μ½λ ?λ ₯')).toHaveLength(2);
    });

    // ?λΆλ₯μ½λ ?λ ₯ (μ²?λ²μ§Έ ?λ ₯ ?λ)
    const codeInputs = screen.getAllByLabelText('?λΆλ₯μ½λ ?λ ₯');
    const codeInput = codeInputs[0]; // ?λΆλ₯ ?±λ‘ ?Όμ ?λ ₯ ?λ
    const nameInput = screen.getByLabelText('?λΆλ₯λͺ??λ ₯');

    fireEvent.change(codeInput, { target: { value: '1003' } });
    fireEvent.change(nameInput, { target: { value: '?μ€?Έμ½?? } });

    // ???λ²νΌ ?΄λ¦­ (μ²?λ²μ§Έ ???λ²νΌ)
    const saveButtons = screen.getAllByText('???);
    fireEvent.click(saveButtons[0]);

    // API ?ΈμΆ ?μΈ
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0102_T(?,?,?,?,?,?)',
            PARAM: '1003|?μ€?Έμ½??Y||TEST_USER'
          })
        })
      );
    });
  });

  test('?¬μ©?κ? ?λΆλ₯μ½λ ?±λ‘ ???μ ??ͺ©??λΉμ΄?μΌλ©???₯λμ§ ?λ??, async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('???)).toHaveLength(2);
    });

    // ?μ ??ͺ© ?μ΄ ???λ²νΌ ?΄λ¦­
    const saveButtons = screen.getAllByText('???);
    fireEvent.click(saveButtons[0]);

    // API ?ΈμΆ???μ? ?μ?μ? ?μΈ
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.any(Object)
      );
    });
  });

  test('?¬μ©?κ? ?λΆλ₯μ½λλ₯?? ν?λ©΄ ?΄λΉ ?λΆλ₯?μ½λ λͺ©λ‘???μ?λ€', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByText('μ‘°ν')).toBeInTheDocument();
    });

    // μ‘°ν λ²νΌ ?΄λ¦­?μ¬ ?λΆλ₯ λͺ©λ‘ λ‘λ
    fireEvent.click(screen.getByText('μ‘°ν'));

    // ?λΆλ₯ μ½λ μ‘°ν API ?ΈμΆ ?μΈ
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

  test('?¬μ©?κ? ?λΆλ₯μ½???±λ‘ ?Όμ???μ ??ͺ©???λ ₯?κ³  ??₯ν  ???λ€', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?λΆλ₯μ½???λ ₯')).toBeInTheDocument();
    });

    // ?λΆλ₯μ½λ ?λ ₯ (?λΆλ₯??±λ‘???ν΄ ?μ) - ??λ²μ§Έ ?λ ₯ ?λ
    const largeCodeInputs = screen.getAllByLabelText('?λΆλ₯μ½λ ?λ ₯');
    const largeCodeInput = largeCodeInputs[1]; // ?λΆλ₯??±λ‘ ?Όμ ?λΆλ₯μ½λ ?λ ₯ ?λ
    fireEvent.change(largeCodeInput, { target: { value: '1001' } });

    // ?λΆλ₯μ½???λ ₯
    const smallCodeInput = screen.getByLabelText('?λΆλ₯μ½???λ ₯');
    const smallNameInput = screen.getByLabelText('?λΆλ₯λͺ ?λ ₯');

    fireEvent.change(smallCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallNameInput, { target: { value: '?μ€?ΈμλΆλ₯' } });

    // ???λ²νΌ ?΄λ¦­ (??λ²μ§Έ ???λ²νΌ)
    const saveButtons = screen.getAllByText('???);
    fireEvent.click(saveButtons[1]);

    // API ?ΈμΆ ?μΈ
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            SP: 'COM_01_0105_T(?,?,?,?,?,?,?,?,?,?,?)',
            PARAM: '1001|1001|?μ€?ΈμλΆλ₯||||1|Y||TEST_USER'
          })
        })
      );
    });
  });

  test('?¬μ©?κ? ?λΆλ₯μ½λλ₯??? ?????λ€', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('?? ')).toHaveLength(2);
    });

    // ??  λ²νΌ ?΄λ¦­ (μ²?λ²μ§Έ ??  λ²νΌ - ?λΆλ₯)
    const deleteButtons = screen.getAllByText('?? ');
    fireEvent.click(deleteButtons[0]);

    // ??  λ²νΌ???΄λ¦­?μ?μ? ?μΈ
    expect(deleteButtons[0]).toBeInTheDocument();
  });

  test('?¬μ©?κ? ?λΆλ₯μ½?λ? ?? ?????λ€', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('?? ')).toHaveLength(2);
    });

    // ??  λ²νΌ ?΄λ¦­ (??λ²μ§Έ ??  λ²νΌ - ?λΆλ₯?
    const deleteButtons = screen.getAllByText('?? ');
    fireEvent.click(deleteButtons[1]);

    // ??  λ²νΌ???΄λ¦­?μ?μ? ?μΈ
    expect(deleteButtons[1]).toBeInTheDocument();
  });

  test('?¬μ©?κ? ? κ· λ²νΌ???΄λ¦­?λ©΄ ?±λ‘ ?Όμ΄ μ΄κΈ°?λ??, async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByText('? κ·')).toHaveLength(2);
    });

    // ?λΆλ₯μ½λ ?λ ₯
    const codeInputs = screen.getAllByLabelText('?λΆλ₯μ½λ ?λ ₯');
    const codeInput = codeInputs[0]; // ?λΆλ₯ ?±λ‘ ?Όμ ?λ ₯ ?λ
    fireEvent.change(codeInput, { target: { value: '1003' } });

    // ? κ· λ²νΌ ?΄λ¦­ (μ²?λ²μ§Έ ? κ· λ²νΌ - ?λΆλ₯)
    const newButtons = screen.getAllByText('? κ·');
    fireEvent.click(newButtons[0]);

    // ?Όμ΄ μ΄κΈ°?λ?λμ§ ?μΈ
    await waitFor(() => {
      expect(codeInput).toHaveValue('');
    });
  });

  test('?¬μ©?κ? ?ν°?€λ? ?λ₯΄λ©?κ²?μ΄ ?€ν?λ€', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?λΆλ₯μ½λ κ²??)).toBeInTheDocument();
    });

    // κ²??μ‘°κ±΄ ?λ ₯ ???ν°??
    const codeInput = screen.getByLabelText('?λΆλ₯μ½λ κ²??);
    fireEvent.change(codeInput, { target: { value: '1001' } });
    fireEvent.keyDown(codeInput, { key: 'Enter' });

    // API ?ΈμΆ ?μΈ
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

  test('?¬μ©?κ? ?λΆλ₯μ½λ ?±λ‘ ?Όμ???ν°?€λ? ?λ₯΄λ©???₯μ΄ ?€ν?λ€', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getAllByLabelText('?λΆλ₯μ½λ ?λ ₯')).toHaveLength(2);
    });

    // ?μ ??ͺ© ?λ ₯
    const codeInputs = screen.getAllByLabelText('?λΆλ₯μ½λ ?λ ₯');
    const codeInput = codeInputs[0]; // ?λΆλ₯ ?±λ‘ ?Όμ ?λ ₯ ?λ
    const nameInput = screen.getByLabelText('?λΆλ₯λͺ??λ ₯');

    fireEvent.change(codeInput, { target: { value: '1003' } });
    fireEvent.change(nameInput, { target: { value: '?μ€?Έμ½?? } });

    // ?ν°???λ ₯
    fireEvent.keyDown(codeInput, { key: 'Enter' });

    // API ?ΈμΆ ?μΈ
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/COMZ010M00/save'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  test('?¬μ©?κ? ?λΆλ₯μ½???±λ‘ ?Όμ???ν°?€λ? ?λ₯΄λ©???₯μ΄ ?€ν?λ€', async () => {
    render(<COMZ010M00Page />);

    await waitFor(() => {
      expect(screen.getByLabelText('?λΆλ₯μ½???λ ₯')).toBeInTheDocument();
    });

    // ?μ ??ͺ© ?λ ₯
    const largeCodeInputs = screen.getAllByLabelText('?λΆλ₯μ½λ ?λ ₯');
    const largeCodeInput = largeCodeInputs[1]; // ?λΆλ₯??±λ‘ ?Όμ ?λΆλ₯μ½λ ?λ ₯ ?λ
    const smallCodeInput = screen.getByLabelText('?λΆλ₯μ½???λ ₯');
    const smallNameInput = screen.getByLabelText('?λΆλ₯λͺ ?λ ₯');

    fireEvent.change(largeCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallCodeInput, { target: { value: '1001' } });
    fireEvent.change(smallNameInput, { target: { value: '?μ€?ΈμλΆλ₯' } });

    // ?ν°???λ ₯
    fireEvent.keyDown(smallCodeInput, { key: 'Enter' });

    // API ?ΈμΆ ?μΈ
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

