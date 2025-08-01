/**
 * PSM0060M00 - ê°ë°?ê²½ ? í ?ì ?ì¤??
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

describe('PSM0060M00 - ê°ë°?ê²½ ? í ?ì', () => {
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

  describe('ê¸°ë³¸ ?ëë§??ì¤??, () => {
    test('ì»´í¬?í¸ê° ?ì?ì¼ë¡??ëë§ë??, () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('ê°ë°?ê²½/DBMS/?¸ì´ ?´ì© ?ë ¥')).toBeInTheDocument();
      expect(screen.getByText('?´ìì²´ì (OS)')).toBeInTheDocument();
      expect(screen.getByText('DBMS')).toBeInTheDocument();
      expect(screen.getByText('?ë ?ì')).toBeInTheDocument();
      expect(screen.getByText('WAS/ë¯¸ë¤?¨ì´')).toBeInTheDocument();
      expect(screen.getByText('?¸ì´/ê°ë°?ê²½')).toBeInTheDocument();
      expect(screen.getByText('TOOL')).toBeInTheDocument();
      expect(screen.getByText('ëª¨ë°??)).toBeInTheDocument();
      expect(screen.getAllByText('ê¸°í?')).toHaveLength(8); // 8ê°ì ê¸°í? ?ì¤?¸ê? ?ì (7ê°?ì²´í¬ë°ì¤ + 1ê°??¹ì ?ëª©)
    });

    test('?ì¸ê³?ì·¨ì ë²í¼???ì?ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('?ì¸')).toBeInTheDocument();
      expect(screen.getByText('ì·¨ì')).toBeInTheDocument();
    });

    test('?«ê¸° ë²í¼(X)???ì?ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('Ã')).toBeInTheDocument();
    });
  });

  describe('ì²´í¬ë°ì¤ ? í ?ì¤??, () => {
    test('?´ìì²´ì  ì²´í¬ë°ì¤ë¥?? í?????ë¤', () => {
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

    test('DBMS ì²´í¬ë°ì¤ë¥?? í?????ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const oracleCheckbox = screen.getByLabelText('ORACLE');
      const mssqlCheckbox = screen.getByLabelText('MS-SQL');
      
      fireEvent.click(oracleCheckbox);
      fireEvent.click(mssqlCheckbox);
      
      expect(oracleCheckbox).toBeChecked();
      expect(mssqlCheckbox).toBeChecked();
    });

    test('?¸ì´/ê°ë°?ê²½ ì²´í¬ë°ì¤ë¥?? í?????ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const javaCheckbox = screen.getByLabelText('JAVA,JSP');
      const springCheckbox = screen.getByLabelText('Spring');
      
      fireEvent.click(javaCheckbox);
      fireEvent.click(springCheckbox);
      
      expect(javaCheckbox).toBeChecked();
      expect(springCheckbox).toBeChecked();
    });
  });

  describe('ê¸°í? ?ì¤???ë ¥ ?ì¤??, () => {
    test('?´ìì²´ì  ê¸°í? ?ì¤?¸ë? ?ë ¥?????ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ?´ìì²´ì  ?¹ì??ê¸°í? ì²´í¬ë°ì¤ (ì²?ë²ì§¸ ê¸°í?)
      const osEtcCheckboxes = screen.getAllByLabelText('ê¸°í?');
      const osEtcCheckbox = osEtcCheckboxes[0];
      
      // ?´ìì²´ì  ?¹ì??ê¸°í? ?ë ¥ ?ë (ì²?ë²ì§¸ disabled input)
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      const osEtcInput = disabledInputs[0];
      
      fireEvent.click(osEtcCheckbox);
      fireEvent.change(osEtcInput, { target: { value: 'macOS' } });
      
      expect(osEtcCheckbox).toBeChecked();
      expect(osEtcInput).toHaveValue('macOS');
    });

    test('ê¸°í? ?ì¤???ë ¥???ì±??ë¹í?±í?ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ?´ìì²´ì  ?¹ì??ê¸°í? ì²´í¬ë°ì¤ (ì²?ë²ì§¸ ê¸°í?)
      const osEtcCheckboxes = screen.getAllByLabelText('ê¸°í?');
      const osEtcCheckbox = osEtcCheckboxes[0];
      
      // ?´ìì²´ì  ?¹ì??ê¸°í? ?ë ¥ ?ë (ì²?ë²ì§¸ disabled input)
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      const osEtcInput = disabledInputs[0];
      
      // ì´ê¸°?ë ë¹í?±í
      expect(osEtcInput).toBeDisabled();
      
      // ì²´í¬ë°ì¤ ? í ???ì±??
      fireEvent.click(osEtcCheckbox);
      expect(osEtcInput).toBeEnabled();
      
      // ì²´í¬ë°ì¤ ?´ì  ??ë¹í?±í
      fireEvent.click(osEtcCheckbox);
      expect(osEtcInput).toBeDisabled();
    });
  });

  describe('ë²í¼ ?´ë¦­ ?ì¤??, () => {
    test('ì·¨ì ë²í¼ ?´ë¦­ ??onCloseê° ?¸ì¶?ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const cancelButton = screen.getByText('ì·¨ì');
      fireEvent.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('?«ê¸° ë²í¼(X) ?´ë¦­ ??onCloseê° ?¸ì¶?ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const closeButton = screen.getByText('Ã');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('?ì¸ ë²í¼ ?´ë¦­ ??? í???°ì´?°ê? onConfirm?¼ë¡ ?ë¬?ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ëª?ê°ì§ ?µì ? í
      fireEvent.click(screen.getByLabelText('UNIX'));
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('Spring'));
      
      const confirmButton = screen.getByText('?ì¸');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('UNIX, ORACLE, JAVA,JSP, Spring');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('?°ì´???ì§ ?ì¤??, () => {
    test('? í??ëª¨ë  ?°ì´?°ê? ?¬ë°ë¥´ê² ?ì§?ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ?´ìì²´ì 
      fireEvent.click(screen.getByLabelText('UNIX'));
      const osEtcCheckboxes = screen.getAllByLabelText('ê¸°í?');
      fireEvent.click(osEtcCheckboxes[0]); // ?´ìì²´ì  ê¸°í?
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      fireEvent.change(disabledInputs[0], { target: { value: 'macOS' } });
      
      // DBMS
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('MS-SQL'));
      
      // ?¸ì´
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('Spring'));
      
      // ê¸°í? ?ì¤??
      const etcInput = screen.getByPlaceholderText('ê¸°í? ?´ì©???ë ¥?ì¸??);
      fireEvent.change(etcInput, { target: { value: 'ì¶ê? ê¸°ì ' } });
      
      const confirmButton = screen.getByText('?ì¸');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('UNIX, ORACLE, MS-SQL, JAVA,JSP, Spring, ì¶ê? ê¸°ì ');
    });

    test('? í????ª©???ì¼ë©?ë¹?ë¬¸ì?´ì´ ?ë¬?ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const confirmButton = screen.getByText('?ì¸');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('');
    });

    test('ê¸°í? ì²´í¬ë°ì¤ê° ? í?ì? ?ì¼ë©??´ë¹ ?ì¤?¸ë ?¬í¨?ì? ?ë??, () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ê¸°í? ?ì¤?¸ë§ ?ë ¥?ê³  ì²´í¬ë°ì¤??? í?ì? ?ì
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      fireEvent.change(disabledInputs[0], { target: { value: 'macOS' } });
      
      const confirmButton = screen.getByText('?ì¸');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('');
    });
  });

  describe('UI ?í¸?ì© ?ì¤??, () => {
    test('ëª¨ë  ì²´í¬ë°ì¤ê° ì´ê¸°??? í?ì? ?ì? ?í?´ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked();
      });
    });

    test('ëª¨ë  ?ì¤???ë ¥??ì´ê¸°??ë¹?ê°ì´??, () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const textInputs = screen.getAllByRole('textbox');
      textInputs.forEach(input => {
        expect(input).toHaveValue('');
      });
    });

    test('ê¸°í? ?ì¤???ë ¥??ì´ê¸°??ë¹í?±í?ì´ ?ë¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const textInputs = screen.getAllByRole('textbox');
      textInputs.forEach(input => {
        if (input !== screen.getByPlaceholderText('ê¸°í? ?´ì©???ë ¥?ì¸??)) {
          expect(input).toBeDisabled();
        }
      });
    });
  });

  describe('?ë¬ ì²ë¦¬ ?ì¤??, () => {
    test('onConfirm???ì´???ë¬ê° ë°ì?ì? ?ë??, () => {
      expect(() => {
        render(<PSM0060M00 onClose={mockOnClose} />);
      }).not.toThrow();
    });

    test('onCloseê° ?ì´???ë¬ê° ë°ì?ì? ?ë??, () => {
      expect(() => {
        render(<PSM0060M00 onConfirm={mockOnConfirm} />);
      }).not.toThrow();
    });

    test('propsê° ?ì´???ì ?ì?ë¤', () => {
      expect(() => {
        render(<PSM0060M00 />);
      }).not.toThrow();
    });
  });

  describe('?¤ì  ?¬ì© ?ëë¦¬ì¤ ?ì¤??, () => {
    test('Java ê°ë°???ëë¦¬ì¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // Java ê°ë°???¼ë°?ì¸ ? í
      fireEvent.click(screen.getByLabelText('WINDOW'));
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('Spring'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('JQuery'));
      fireEvent.click(screen.getByLabelText('HTML5'));
      
      const confirmButton = screen.getByText('?ì¸');
      fireEvent.click(confirmButton);
      
      // ?¤ì  ?°ì´???ì??ë§ì¶° ?ì 
      expect(mockOnConfirm).toHaveBeenCalledWith('WINDOW, ORACLE, JAVA,JSP, Spring, JQuery, HTML5');
    });

    test('ëª¨ë°??ê°ë°???ëë¦¬ì¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ëª¨ë°??ê°ë°???¼ë°?ì¸ ? í
      fireEvent.click(screen.getByLabelText('LINUX'));
      fireEvent.click(screen.getByLabelText('Android'));
      fireEvent.click(screen.getByLabelText('IO/S'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      
      const confirmButton = screen.getByText('?ì¸');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('LINUX, JAVA,JSP, Android, IO/S');
    });
  });
}); 

