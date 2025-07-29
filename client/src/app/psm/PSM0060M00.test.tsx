/**
 * PSM0060M00 - ê°œë°œ?˜ê²½ ? íƒ ?ì—… ?ŒìŠ¤??
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

describe('PSM0060M00 - ê°œë°œ?˜ê²½ ? íƒ ?ì—…', () => {
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

  describe('ê¸°ë³¸ ?Œë”ë§??ŒìŠ¤??, () => {
    test('ì»´í¬?ŒíŠ¸ê°€ ?•ìƒ?ìœ¼ë¡??Œë”ë§ëœ??, () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('ê°œë°œ?˜ê²½/DBMS/?¸ì–´ ?´ìš© ?…ë ¥')).toBeInTheDocument();
      expect(screen.getByText('?´ì˜ì²´ì œ(OS)')).toBeInTheDocument();
      expect(screen.getByText('DBMS')).toBeInTheDocument();
      expect(screen.getByText('?„ë ˆ?„ì›')).toBeInTheDocument();
      expect(screen.getByText('WAS/ë¯¸ë“¤?¨ì–´')).toBeInTheDocument();
      expect(screen.getByText('?¸ì–´/ê°œë°œ?˜ê²½')).toBeInTheDocument();
      expect(screen.getByText('TOOL')).toBeInTheDocument();
      expect(screen.getByText('ëª¨ë°”??)).toBeInTheDocument();
      expect(screen.getAllByText('ê¸°í?')).toHaveLength(8); // 8ê°œì˜ ê¸°í? ?ìŠ¤?¸ê? ?ˆìŒ (7ê°?ì²´í¬ë°•ìŠ¤ + 1ê°??¹ì…˜ ?œëª©)
    });

    test('?•ì¸ê³?ì·¨ì†Œ ë²„íŠ¼???œì‹œ?œë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('?•ì¸')).toBeInTheDocument();
      expect(screen.getByText('ì·¨ì†Œ')).toBeInTheDocument();
    });

    test('?«ê¸° ë²„íŠ¼(X)???œì‹œ?œë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      expect(screen.getByText('Ã—')).toBeInTheDocument();
    });
  });

  describe('ì²´í¬ë°•ìŠ¤ ? íƒ ?ŒìŠ¤??, () => {
    test('?´ì˜ì²´ì œ ì²´í¬ë°•ìŠ¤ë¥?? íƒ?????ˆë‹¤', () => {
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

    test('DBMS ì²´í¬ë°•ìŠ¤ë¥?? íƒ?????ˆë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const oracleCheckbox = screen.getByLabelText('ORACLE');
      const mssqlCheckbox = screen.getByLabelText('MS-SQL');
      
      fireEvent.click(oracleCheckbox);
      fireEvent.click(mssqlCheckbox);
      
      expect(oracleCheckbox).toBeChecked();
      expect(mssqlCheckbox).toBeChecked();
    });

    test('?¸ì–´/ê°œë°œ?˜ê²½ ì²´í¬ë°•ìŠ¤ë¥?? íƒ?????ˆë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const javaCheckbox = screen.getByLabelText('JAVA,JSP');
      const springCheckbox = screen.getByLabelText('Spring');
      
      fireEvent.click(javaCheckbox);
      fireEvent.click(springCheckbox);
      
      expect(javaCheckbox).toBeChecked();
      expect(springCheckbox).toBeChecked();
    });
  });

  describe('ê¸°í? ?ìŠ¤???…ë ¥ ?ŒìŠ¤??, () => {
    test('?´ì˜ì²´ì œ ê¸°í? ?ìŠ¤?¸ë? ?…ë ¥?????ˆë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ?´ì˜ì²´ì œ ?¹ì…˜??ê¸°í? ì²´í¬ë°•ìŠ¤ (ì²?ë²ˆì§¸ ê¸°í?)
      const osEtcCheckboxes = screen.getAllByLabelText('ê¸°í?');
      const osEtcCheckbox = osEtcCheckboxes[0];
      
      // ?´ì˜ì²´ì œ ?¹ì…˜??ê¸°í? ?…ë ¥ ?„ë“œ (ì²?ë²ˆì§¸ disabled input)
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      const osEtcInput = disabledInputs[0];
      
      fireEvent.click(osEtcCheckbox);
      fireEvent.change(osEtcInput, { target: { value: 'macOS' } });
      
      expect(osEtcCheckbox).toBeChecked();
      expect(osEtcInput).toHaveValue('macOS');
    });

    test('ê¸°í? ?ìŠ¤???…ë ¥???œì„±??ë¹„í™œ?±í™”?œë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ?´ì˜ì²´ì œ ?¹ì…˜??ê¸°í? ì²´í¬ë°•ìŠ¤ (ì²?ë²ˆì§¸ ê¸°í?)
      const osEtcCheckboxes = screen.getAllByLabelText('ê¸°í?');
      const osEtcCheckbox = osEtcCheckboxes[0];
      
      // ?´ì˜ì²´ì œ ?¹ì…˜??ê¸°í? ?…ë ¥ ?„ë“œ (ì²?ë²ˆì§¸ disabled input)
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      const osEtcInput = disabledInputs[0];
      
      // ì´ˆê¸°?ëŠ” ë¹„í™œ?±í™”
      expect(osEtcInput).toBeDisabled();
      
      // ì²´í¬ë°•ìŠ¤ ? íƒ ???œì„±??
      fireEvent.click(osEtcCheckbox);
      expect(osEtcInput).toBeEnabled();
      
      // ì²´í¬ë°•ìŠ¤ ?´ì œ ??ë¹„í™œ?±í™”
      fireEvent.click(osEtcCheckbox);
      expect(osEtcInput).toBeDisabled();
    });
  });

  describe('ë²„íŠ¼ ?´ë¦­ ?ŒìŠ¤??, () => {
    test('ì·¨ì†Œ ë²„íŠ¼ ?´ë¦­ ??onCloseê°€ ?¸ì¶œ?œë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const cancelButton = screen.getByText('ì·¨ì†Œ');
      fireEvent.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('?«ê¸° ë²„íŠ¼(X) ?´ë¦­ ??onCloseê°€ ?¸ì¶œ?œë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const closeButton = screen.getByText('Ã—');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('?•ì¸ ë²„íŠ¼ ?´ë¦­ ??? íƒ???°ì´?°ê? onConfirm?¼ë¡œ ?„ë‹¬?œë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ëª?ê°€ì§€ ?µì…˜ ? íƒ
      fireEvent.click(screen.getByLabelText('UNIX'));
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('Spring'));
      
      const confirmButton = screen.getByText('?•ì¸');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('UNIX, ORACLE, JAVA,JSP, Spring');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('?°ì´???˜ì§‘ ?ŒìŠ¤??, () => {
    test('? íƒ??ëª¨ë“  ?°ì´?°ê? ?¬ë°”ë¥´ê²Œ ?˜ì§‘?œë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ?´ì˜ì²´ì œ
      fireEvent.click(screen.getByLabelText('UNIX'));
      const osEtcCheckboxes = screen.getAllByLabelText('ê¸°í?');
      fireEvent.click(osEtcCheckboxes[0]); // ?´ì˜ì²´ì œ ê¸°í?
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      fireEvent.change(disabledInputs[0], { target: { value: 'macOS' } });
      
      // DBMS
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('MS-SQL'));
      
      // ?¸ì–´
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('Spring'));
      
      // ê¸°í? ?ìŠ¤??
      const etcInput = screen.getByPlaceholderText('ê¸°í? ?´ìš©???…ë ¥?˜ì„¸??);
      fireEvent.change(etcInput, { target: { value: 'ì¶”ê? ê¸°ìˆ ' } });
      
      const confirmButton = screen.getByText('?•ì¸');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('UNIX, ORACLE, MS-SQL, JAVA,JSP, Spring, ì¶”ê? ê¸°ìˆ ');
    });

    test('? íƒ????ª©???†ìœ¼ë©?ë¹?ë¬¸ì?´ì´ ?„ë‹¬?œë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const confirmButton = screen.getByText('?•ì¸');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('');
    });

    test('ê¸°í? ì²´í¬ë°•ìŠ¤ê°€ ? íƒ?˜ì? ?Šìœ¼ë©??´ë‹¹ ?ìŠ¤?¸ëŠ” ?¬í•¨?˜ì? ?ŠëŠ”??, () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ê¸°í? ?ìŠ¤?¸ë§Œ ?…ë ¥?˜ê³  ì²´í¬ë°•ìŠ¤??? íƒ?˜ì? ?ŠìŒ
      const disabledInputs = screen.getAllByRole('textbox').filter(input => input.hasAttribute('disabled'));
      fireEvent.change(disabledInputs[0], { target: { value: 'macOS' } });
      
      const confirmButton = screen.getByText('?•ì¸');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('');
    });
  });

  describe('UI ?í˜¸?‘ìš© ?ŒìŠ¤??, () => {
    test('ëª¨ë“  ì²´í¬ë°•ìŠ¤ê°€ ì´ˆê¸°??? íƒ?˜ì? ?Šì? ?íƒœ?´ë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked();
      });
    });

    test('ëª¨ë“  ?ìŠ¤???…ë ¥??ì´ˆê¸°??ë¹?ê°’ì´??, () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const textInputs = screen.getAllByRole('textbox');
      textInputs.forEach(input => {
        expect(input).toHaveValue('');
      });
    });

    test('ê¸°í? ?ìŠ¤???…ë ¥??ì´ˆê¸°??ë¹„í™œ?±í™”?˜ì–´ ?ˆë‹¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      const textInputs = screen.getAllByRole('textbox');
      textInputs.forEach(input => {
        if (input !== screen.getByPlaceholderText('ê¸°í? ?´ìš©???…ë ¥?˜ì„¸??)) {
          expect(input).toBeDisabled();
        }
      });
    });
  });

  describe('?ëŸ¬ ì²˜ë¦¬ ?ŒìŠ¤??, () => {
    test('onConfirm???†ì–´???ëŸ¬ê°€ ë°œìƒ?˜ì? ?ŠëŠ”??, () => {
      expect(() => {
        render(<PSM0060M00 onClose={mockOnClose} />);
      }).not.toThrow();
    });

    test('onCloseê°€ ?†ì–´???ëŸ¬ê°€ ë°œìƒ?˜ì? ?ŠëŠ”??, () => {
      expect(() => {
        render(<PSM0060M00 onConfirm={mockOnConfirm} />);
      }).not.toThrow();
    });

    test('propsê°€ ?†ì–´???•ìƒ ?™ì‘?œë‹¤', () => {
      expect(() => {
        render(<PSM0060M00 />);
      }).not.toThrow();
    });
  });

  describe('?¤ì œ ?¬ìš© ?œë‚˜ë¦¬ì˜¤ ?ŒìŠ¤??, () => {
    test('Java ê°œë°œ???œë‚˜ë¦¬ì˜¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // Java ê°œë°œ???¼ë°˜?ì¸ ? íƒ
      fireEvent.click(screen.getByLabelText('WINDOW'));
      fireEvent.click(screen.getByLabelText('ORACLE'));
      fireEvent.click(screen.getByLabelText('Spring'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      fireEvent.click(screen.getByLabelText('JQuery'));
      fireEvent.click(screen.getByLabelText('HTML5'));
      
      const confirmButton = screen.getByText('?•ì¸');
      fireEvent.click(confirmButton);
      
      // ?¤ì œ ?°ì´???œì„œ??ë§ì¶° ?˜ì •
      expect(mockOnConfirm).toHaveBeenCalledWith('WINDOW, ORACLE, JAVA,JSP, Spring, JQuery, HTML5');
    });

    test('ëª¨ë°”??ê°œë°œ???œë‚˜ë¦¬ì˜¤', () => {
      render(<PSM0060M00 onConfirm={mockOnConfirm} onClose={mockOnClose} />);
      
      // ëª¨ë°”??ê°œë°œ???¼ë°˜?ì¸ ? íƒ
      fireEvent.click(screen.getByLabelText('LINUX'));
      fireEvent.click(screen.getByLabelText('Android'));
      fireEvent.click(screen.getByLabelText('IO/S'));
      fireEvent.click(screen.getByLabelText('JAVA,JSP'));
      
      const confirmButton = screen.getByText('?•ì¸');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledWith('LINUX, JAVA,JSP, Android, IO/S');
    });
  });
}); 

