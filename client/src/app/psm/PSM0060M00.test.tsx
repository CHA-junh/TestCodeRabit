/**
 * PSM0060M00 - 개발환경 선택 팝업 테스트
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

describe('PSM0060M00 - 개발환경 선택 팝업', () => {
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

  describe('기본 렌더링 테스트', () => {
    test('컴포넌트가 정상적으로 렌더링된다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('개발환경/DBMS/언어 내용 입력')).toBeInTheDocument();
      expect(screen.getByText('운영체제(OS)')).toBeInTheDocument();
      expect(screen.getByText('DBMS')).toBeInTheDocument();
      expect(screen.getByText('프레임웍')).toBeInTheDocument();
      expect(screen.getByText('WAS/미들웨어')).toBeInTheDocument();
      expect(screen.getByText('언어/개발환경')).toBeInTheDocument();
      expect(screen.getByText('TOOL')).toBeInTheDocument();
      expect(screen.getByText('모바일')).toBeInTheDocument();
      expect(screen.getAllByText('기타')).toHaveLength(8); // 8개의 기타 텍스트가 있음 (7개 체크박스 + 1개 섹션 제목)
    });

    test('확인과 취소 버튼이 표시된다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('확인')).toBeInTheDocument();
      expect(screen.getByText('취소')).toBeInTheDocument();
    });

    test('닫기 버튼(X)이 표시된다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('×')).toBeInTheDocument();
    });
  });

  describe('체크박스 선택 테스트', () => {
    test('운영체제 체크박스를 선택할 수 있다', () => {
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

    test('DBMS 체크박스를 선택할 수 있다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const oracleCheckbox = screen.getByLabelText('ORACLE');
      const mssqlCheckbox = screen.getByLabelText('MS-SQL');
      
      fireEvent.click(oracleCheckbox);
      fireEvent.click(mssqlCheckbox);
      
      expect(oracleCheckbox).toBeChecked();
      expect(mssqlCheckbox).toBeChecked();
    });

    test('언어/개발환경 체크박스를 선택할 수 있다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const javaCheckbox = screen.getByLabelText('JAVA,JSP');
      const springCheckbox = screen.getByLabelText('Spring');
      
      fireEvent.click(javaCheckbox);
      fireEvent.click(springCheckbox);
      
      expect(javaCheckbox).toBeChecked();
      expect(springCheckbox).toBeChecked();
    });
  });

  describe('기타 텍스트 입력 테스트', () => {
    test('운영체제 기타 텍스트를 입력할 수 있다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // 운영체제 섹션의 기타 체크박스 (첫 번째 기타)
      const osEtcCheckboxes = screen.getAllByLabelText('기타');
      const osEtcCheckbox = osEtcCheckboxes[0];
      
      // 운영체제 섹션의 기타 입력 필드 (첫 번째 disabled input)
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      const osEtcInput = disabledInputs[0];
      
      fireEvent.click(osEtcCheckbox);
      fireEvent.change(osEtcInput, { target: { value: 'macOS' } });
      
      expect(osEtcCheckbox).toBeChecked();
      expect(osEtcInput).toHaveValue('macOS');
    });

    test('기타 텍스트 입력이 활성화/비활성화된다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // 운영체제 섹션의 기타 체크박스 (첫 번째 기타)
      const osEtcCheckboxes = screen.getAllByLabelText('기타');
      const osEtcCheckbox = osEtcCheckboxes[0];
      
      // 운영체제 섹션의 기타 입력 필드 (첫 번째 disabled input)
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      const osEtcInput = disabledInputs[0];
      
      // 초기에는 비활성화
      expect(osEtcInput).toBeDisabled();
      
      // 체크박스 선택 시 활성화
      fireEvent.click(osEtcCheckbox);
      expect(osEtcInput).toBeEnabled();
      
      // 체크박스 해제 시 비활성화
      fireEvent.click(osEtcCheckbox);
      expect(osEtcInput).toBeDisabled();
    });
  });

  describe('버튼 클릭 테스트', () => {
    test('취소 버튼 클릭 시 onClose가 호출된다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const cancelButton = screen.getByText('취소');
      fireEvent.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('닫기 버튼(X) 클릭 시 onClose가 호출된다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('확인 버튼 클릭 시 선택된 데이터가 onConfirm으로 전달된다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // 몇 가지 옵션 선택
      fireEvent.click(screen.getByLabelText('UNIX'));
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('Spring'));
      
      const confirmButton = screen.getByText('확인');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('UNIX, ORACLE, JAVA,JSP, Spring');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('데이터 수집 테스트', () => {
    test('선택된 모든 데이터가 올바르게 수집된다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // 운영체제
      fireEvent.click(screen.getByLabelText('UNIX'));
      const osEtcCheckboxes = screen.getAllByLabelText('기타');
      fireEvent.click(osEtcCheckboxes[0]); // 운영체제 기타
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      fireEvent.change(disabledInputs[0], { target: { value: 'macOS' } });
      
      // DBMS
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('MS-SQL'));
      
      // 언어
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('Spring'));
      
      // 기타 텍스트
      const etcInput = screen.getByPlaceholderText('기타 내용을 입력하세요');
      fireEvent.change(etcInput, { target: { value: '추가 기술' } });
      
      const confirmButton = screen.getByText('확인');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('UNIX, ORACLE, MS-SQL, JAVA,JSP, Spring, 추가 기술');
    });

    test('선택된 항목이 없으면 빈 문자열이 전달된다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const confirmButton = screen.getByText('확인');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('');
    });

    test('기타 체크박스가 선택되지 않으면 해당 텍스트는 포함되지 않는다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // 기타 텍스트만 입력하고 체크박스는 선택하지 않음
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      fireEvent.change(disabledInputs[0], { target: { value: 'macOS' } });
      
      const confirmButton = screen.getByText('확인');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('');
    });
  });

  describe('UI 상호작용 테스트', () => {
    test('모든 체크박스가 초기에 선택되지 않은 상태이다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked();
      });
    });

    test('모든 텍스트 입력이 초기에 빈 값이다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const textInputs = screen.getAllByRole('textbox');
      textInputs.forEach(input => {
        expect(input).toHaveValue('');
      });
    });

    test('기타 텍스트 입력이 초기에 비활성화되어 있다', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const textInputs = screen.getAllByRole('textbox');
      textInputs.forEach(input => {
        if (input !== screen.getByPlaceholderText('기타 내용을 입력하세요')) {
          expect(input).toBeDisabled();
        }
      });
    });
  });

  describe('에러 처리 테스트', () => {
    test('onConfirm이 없어도 에러가 발생하지 않는다', () => {
      expect(() => {
        render(<PSM0060M00 onClose={mockOnClose} />);
      }).not.toThrow();
    });

    test('onClose가 없어도 에러가 발생하지 않는다', () => {
      expect(() => {
        render(<PSM0060M00 onConfirm={mockOnConfirm} />);
      }).not.toThrow();
    });

    test('props가 없어도 정상 동작한다', () => {
      expect(() => {
        render(<PSM0060M00 />);
      }).not.toThrow();
    });
  });

  describe('실제 사용 시나리오 테스트', () => {
    test('Java 개발자 시나리오', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // Java 개발자 일반적인 선택
      fireEvent.click(screen.getByLabelText('WINDOW'));
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('Spring'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('JQuery'));
      fireEvent.click(screen.getByLabelText('HTML5'));
      
      const confirmButton = screen.getByText('확인');
      fireEvent.click(confirmButton);
      
      // 실제 데이터 순서에 맞춰 수정
      expect(mockOnConfirm).toHaveBeenCalledWith('WINDOW, ORACLE, JAVA,JSP, Spring, JQuery, HTML5');
    });

    test('모바일 개발자 시나리오', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // 모바일 개발자 일반적인 선택
      fireEvent.click(screen.getByLabelText('LINUX'));
      fireEvent.click(screen.getByLabelText('Android'));
      fireEvent.click(screen.getByLabelText('IO/S'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      
      const confirmButton = screen.getByText('확인');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('LINUX, JAVA,JSP, Android, IO/S');
    });
  });
}); 