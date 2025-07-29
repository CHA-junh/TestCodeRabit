/**
 * PSM0060M00 - 개발?�경 ?�택 ?�업 ?�스??
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PSM0060M00 from './PSM0060M00';
import { useToast } from '@/contexts/ToastContext';

// useToast Hook Mock
jest.mock('@/contexts/ToastContext', () => ({
  useToast: jest.fn()
}));

const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

describe('PSM0060M00 - 개발?�경 ?�택 ?�업', () => {
  const mockOnConfirm = jest.fn();
  const mockOnClose = jest.fn();
  const mockShowToast = jest.fn();
  const mockShowConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToast.mockReturnValue({
      showToast: mockShowToast,
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showWarning: jest.fn(),
      showInfo: jest.fn(),
      showConfirm: mockShowConfirm
    });
  });

  describe('기본 ?�더�??�스??, () => {
    test('컴포?�트가 ?�상?�으�??�더링된??, () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('개발?�경/DBMS/?�어 ?�용 ?�력')).toBeInTheDocument();
      expect(screen.getByText('?�영체제(OS)')).toBeInTheDocument();
      expect(screen.getByText('DBMS')).toBeInTheDocument();
      expect(screen.getByText('?�레?�웍')).toBeInTheDocument();
      expect(screen.getByText('WAS/미들?�어')).toBeInTheDocument();
      expect(screen.getByText('?�어/개발?�경')).toBeInTheDocument();
      expect(screen.getByText('TOOL')).toBeInTheDocument();
      expect(screen.getByText('모바??)).toBeInTheDocument();
      expect(screen.getAllByText('기�?')).toHaveLength(8); // 8개의 기�? ?�스?��? ?�음 (7�?체크박스 + 1�??�션 ?�목)
    });

    test('?�인�?취소 버튼???�시?�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('?�인')).toBeInTheDocument();
      expect(screen.getByText('취소')).toBeInTheDocument();
    });

    test('?�기 버튼(X)???�시?�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('×')).toBeInTheDocument();
    });
  });

  describe('체크박스 ?�택 ?�스??, () => {
    test('?�영체제 체크박스�??�택?????�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const unixCheckbox = screen.getByLabelText('UNIX');
      const windowCheckbox = screen.getByLabelText('WINDOW');
      const linuxCheckbox = screen.getByLabelText('LINUX');
      
      fireEvent.click(unixCheckbox);
      fireEvent.click(windowCheckbox);
      
      expect(unixCheckbox).toBeChecked();
      expect(windowCheckbox).toBeChecked();
      expect(linuxCheckbox).not.toBeChecked();
    });

    test('DBMS 체크박스�??�택?????�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const oracleCheckbox = screen.getByLabelText('ORACLE');
      const mssqlCheckbox = screen.getByLabelText('MS-SQL');
      
      fireEvent.click(oracleCheckbox);
      fireEvent.click(mssqlCheckbox);
      
      expect(oracleCheckbox).toBeChecked();
      expect(mssqlCheckbox).toBeChecked();
    });

    test('?�어/개발?�경 체크박스�??�택?????�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const javaCheckbox = screen.getByLabelText('JAVA,JSP');
      const springCheckbox = screen.getByLabelText('Spring');
      
      fireEvent.click(javaCheckbox);
      fireEvent.click(springCheckbox);
      
      expect(javaCheckbox).toBeChecked();
      expect(springCheckbox).toBeChecked();
    });
  });

  describe('기�? ?�스???�력 ?�스??, () => {
    test('?�영체제 기�? ?�스?��? ?�력?????�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ?�영체제 ?�션??기�? 체크박스 (�?번째 기�?)
      const osEtcCheckboxes = screen.getAllByLabelText('기�?');
      const osEtcCheckbox = osEtcCheckboxes[0];
      
      // ?�영체제 ?�션??기�? ?�력 ?�드 (�?번째 disabled input)
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      const osEtcInput = disabledInputs[0];
      
      fireEvent.click(osEtcCheckbox);
      fireEvent.change(osEtcInput, { target: { value: 'macOS' } });
      
      expect(osEtcCheckbox).toBeChecked();
      expect(osEtcInput).toHaveValue('macOS');
    });

    test('기�? ?�스???�력???�성??비활?�화?�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ?�영체제 ?�션??기�? 체크박스 (�?번째 기�?)
      const osEtcCheckboxes = screen.getAllByLabelText('기�?');
      const osEtcCheckbox = osEtcCheckboxes[0];
      
      // ?�영체제 ?�션??기�? ?�력 ?�드 (�?번째 disabled input)
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      const osEtcInput = disabledInputs[0];
      
      // 초기?�는 비활?�화
      expect(osEtcInput).toBeDisabled();
      
      // 체크박스 ?�택 ???�성??
      fireEvent.click(osEtcCheckbox);
      expect(osEtcInput).toBeEnabled();
      
      // 체크박스 ?�제 ??비활?�화
      fireEvent.click(osEtcCheckbox);
      expect(osEtcInput).toBeDisabled();
    });
  });

  describe('버튼 ?�릭 ?�스??, () => {
    test('취소 버튼 ?�릭 ??onClose가 ?�출?�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const cancelButton = screen.getByText('취소');
      fireEvent.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('?�기 버튼(X) ?�릭 ??onClose가 ?�출?�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('?�인 버튼 ?�릭 ???�택???�이?��? onConfirm?�로 ?�달?�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // �?가지 ?�션 ?�택
      fireEvent.click(screen.getByLabelText('UNIX'));
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('Spring'));
      
      const confirmButton = screen.getByText('?�인');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('UNIX, ORACLE, JAVA,JSP, Spring');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('?�이???�집 ?�스??, () => {
    test('?�택??모든 ?�이?��? ?�바르게 ?�집?�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ?�영체제
      fireEvent.click(screen.getByLabelText('UNIX'));
      const osEtcCheckboxes = screen.getAllByLabelText('기�?');
      fireEvent.click(osEtcCheckboxes[0]); // ?�영체제 기�?
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      fireEvent.change(disabledInputs[0], { target: { value: 'macOS' } });
      
      // DBMS
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('MS-SQL'));
      
      // ?�어
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('Spring'));
      
      // 기�? ?�스??
      const etcInput = screen.getByPlaceholderText('기�? ?�용???�력?�세??);
      fireEvent.change(etcInput, { target: { value: '추�? 기술' } });
      
      const confirmButton = screen.getByText('?�인');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('UNIX, ORACLE, MS-SQL, JAVA,JSP, Spring, 추�? 기술');
    });

    test('?�택????��???�으�?�?문자?�이 ?�달?�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const confirmButton = screen.getByText('?�인');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('');
    });

    test('기�? 체크박스가 ?�택?��? ?�으�??�당 ?�스?�는 ?�함?��? ?�는??, () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // 기�? ?�스?�만 ?�력?�고 체크박스???�택?��? ?�음
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      fireEvent.change(disabledInputs[0], { target: { value: 'macOS' } });
      
      const confirmButton = screen.getByText('?�인');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('');
    });
  });

  describe('UI ?�호?�용 ?�스??, () => {
    test('모든 체크박스가 초기???�택?��? ?��? ?�태?�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked();
      });
    });

    test('모든 ?�스???�력??초기??�?값이??, () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const textInputs = screen.getAllByRole('textbox');
      textInputs.forEach(input => {
        expect(input).toHaveValue('');
      });
    });

    test('기�? ?�스???�력??초기??비활?�화?�어 ?�다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const textInputs = screen.getAllByRole('textbox');
      textInputs.forEach(input => {
        if (input !== screen.getByPlaceholderText('기�? ?�용???�력?�세??)) {
          expect(input).toBeDisabled();
        }
      });
    });
  });

  describe('?�러 처리 ?�스??, () => {
    test('onConfirm???�어???�러가 발생?��? ?�는??, () => {
      expect(() => {
        render(<PSM0060M00 onClose={mockOnClose} />);
      }).not.toThrow();
    });

    test('onClose가 ?�어???�러가 발생?��? ?�는??, () => {
      expect(() => {
        render(<PSM0060M00 onConfirm={mockOnConfirm} />);
      }).not.toThrow();
    });

    test('props가 ?�어???�상 ?�작?�다', () => {
      expect(() => {
        render(<PSM0060M00 />);
      }).not.toThrow();
    });
  });

  describe('?�제 ?�용 ?�나리오 ?�스??, () => {
    test('Java 개발???�나리오', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // Java 개발???�반?�인 ?�택
      fireEvent.click(screen.getByLabelText('WINDOW'));
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('Spring'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('JQuery'));
      fireEvent.click(screen.getByLabelText('HTML5'));
      
      const confirmButton = screen.getByText('?�인');
      fireEvent.click(confirmButton);
      
      // ?�제 ?�이???�서??맞춰 ?�정
      expect(mockOnConfirm).toHaveBeenCalledWith('WINDOW, ORACLE, JAVA,JSP, Spring, JQuery, HTML5');
    });

    test('모바??개발???�나리오', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // 모바??개발???�반?�인 ?�택
      fireEvent.click(screen.getByLabelText('LINUX'));
      fireEvent.click(screen.getByLabelText('Android'));
      fireEvent.click(screen.getByLabelText('IO/S'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      
      const confirmButton = screen.getByText('?�인');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('LINUX, JAVA,JSP, Android, IO/S');
    });
  });
}); 

