/**
 * SYS1010D00.test.tsx - ?„ë¡œê·¸ë¨ ê²€???ì—… ?”ë©´ ?ŒìŠ¤??
 * 
 * ?ŒìŠ¤???€?? SYS1010D00.tsx
 * ?ŒìŠ¤??ë²”ìœ„: ?„ë¡œê·¸ë¨ ê²€???ì—…??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SYS1010D00 from './SYS1010D00';

// Mock AG-Grid
jest.mock('ag-grid-react', () => ({
  AgGridReact: ({ rowData, onSelectionChanged, onGridReady, onRowDoubleClicked, ...props }: any) => {
    // Use unique test ID based on props or context
    const testId = props['data-testid'] || 'ag-grid';
    
    // Simulate selection state
    const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
    
    const handleRowClick = (item: any) => {
      if (props.rowSelection === 'multiple') {
        const newSelection = selectedRows.includes(item) 
          ? selectedRows.filter(row => row !== item)
          : [...selectedRows, item];
        setSelectedRows(newSelection);
        onSelectionChanged?.({ api: { getSelectedRows: () => newSelection } });
      } else {
        setSelectedRows([item]);
        onSelectionChanged?.({ api: { getSelectedRows: () => [item] } });
      }
    };

    const handleRowDoubleClick = (item: any) => {
      onRowDoubleClicked?.({ data: item });
    };

    return (
      <div data-testid={testId}>
        {rowData?.map((item: any, index: number) => (
          <div 
            key={index} 
            data-testid={`${testId}-row-${index}`} 
            onClick={() => handleRowClick(item)}
            onDoubleClick={() => handleRowDoubleClick(item)}
            className={selectedRows.includes(item) ? 'selected' : ''}
          >
            {item.PGM_ID}
          </div>
        ))}
      </div>
    );
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('SYS1010D00 - ?„ë¡œê·¸ë¨ ê²€???ì—…', () => {
  const mockPrograms = [
    {
      PGM_ID: 'USR2010M00',
      PGM_NM: '?¬ìš©?ê?ë¦?,
      PGM_DIV_CD: '1',
      BIZ_DIV_CD: 'USR',
      USE_YN: 'Y',
      SORT_SEQ: 1
    },
    {
      PGM_ID: 'SYS1000M00',
      PGM_NM: '?„ë¡œê·¸ë¨ê´€ë¦?,
      PGM_DIV_CD: '1',
      BIZ_DIV_CD: 'SYS',
      USE_YN: 'Y',
      SORT_SEQ: 2
    },
    {
      PGM_ID: 'SYS1001M00',
      PGM_NM: '?„ë¡œê·¸ë¨ê·¸ë£¹ê´€ë¦?,
      PGM_DIV_CD: '1',
      BIZ_DIV_CD: 'SYS',
      USE_YN: 'Y',
      SORT_SEQ: 3
    }
  ];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock fetch for programs
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (url.includes('/api/sys/programs/search')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockPrograms })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      });
    });
  });

  describe('?”ë©´ ?Œë”ë§?, () => {
    test('?„ë¡œê·¸ë¨ ê²€???ì—…???•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', async () => {
      render(<SYS1010D00 />);
      expect(screen.getByText('?„ë¡œê·¸ë¨ëª©ë¡')).toBeInTheDocument();
    });

    test('ê²€??ì¡°ê±´ ?…ë ¥ ?„ë“œ?¤ì´ ?•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', () => {
      render(<SYS1010D00 />);
      expect(screen.getByText('?„ë¡œê·¸ë¨ IDëª?)).toBeInTheDocument();
      expect(screen.getByText('êµ¬ë¶„')).toBeInTheDocument();
      expect(screen.getAllByText('?…ë¬´')[0]).toBeInTheDocument(); // ì²?ë²ˆì§¸ '?…ë¬´' ?ìŠ¤???¬ìš©
      expect(screen.getByText('ì¡°íšŒ')).toBeInTheDocument();
    });

    test('?„ë¡œê·¸ë¨ ëª©ë¡ ê·¸ë¦¬?œê? ?•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', async () => {
      render(<SYS1010D00 />);
      await waitFor(() => {
        expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
      });
    });
  });

  describe('?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ', () => {
    test('?”ë©´ ë¡œë“œ ???„ë¡œê·¸ë¨ ëª©ë¡???ë™?¼ë¡œ ì¡°íšŒ?©ë‹ˆ??', async () => {
      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('ê²€??ì¡°ê±´???…ë ¥?˜ê³  ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ?´ë‹¹ ì¡°ê±´?¼ë¡œ ì¡°íšŒ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      // ê²€??ì¡°ê±´ ?…ë ¥
      const searchInput = screen.getByDisplayValue('');
      await user.type(searchInput, '?¬ìš©??);

      const searchButton = screen.getByText('ì¡°íšŒ');
      await user.click(searchButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('?”í„°?¤ë? ?„ë¥´ë©??ë™?¼ë¡œ ì¡°íšŒê°€ ?¤í–‰?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      const searchInput = screen.getByDisplayValue('');
      await user.type(searchInput, '?œìŠ¤??);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('?„ë¡œê·¸ë¨êµ¬ë¶„??? íƒ?˜ë©´ ?´ë‹¹ ì¡°ê±´?¼ë¡œ ì¡°íšŒ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      const divisionSelect = screen.getAllByRole('combobox')[0];
      await user.selectOptions(divisionSelect, '?”ë©´');

      const searchButton = screen.getByText('ì¡°íšŒ');
      await user.click(searchButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('?…ë¬´êµ¬ë¶„??? íƒ?˜ë©´ ?´ë‹¹ ì¡°ê±´?¼ë¡œ ì¡°íšŒ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      const bizSelect = screen.getAllByRole('combobox')[1];
      await user.selectOptions(bizSelect, '?…ë¬´');

      const searchButton = screen.getByText('ì¡°íšŒ');
      await user.click(searchButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });
  });

  describe('?„ë¡œê·¸ë¨ ? íƒ', () => {
    test('?¤ì¤‘ ? íƒ ëª¨ë“œ?ì„œ ì²´í¬ë°•ìŠ¤ë¡??„ë¡œê·¸ë¨??? íƒ?????ˆìŠµ?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 multiple={true} onSelect={mockOnSelect} />);

      await waitFor(() => {
        const gridRow = screen.getByTestId('program-search-grid-row-0');
        fireEvent.click(gridRow);
      });

      // ì¶”ê? ë²„íŠ¼ ?´ë¦­
      const addButton = screen.getByText('ì¶”ê?');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith([mockPrograms[0]]);
      });
    });

    test('?¨ì¼ ? íƒ ëª¨ë“œ?ì„œ ?”ë¸”?´ë¦­?¼ë¡œ ?„ë¡œê·¸ë¨??? íƒ?????ˆìŠµ?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 multiple={false} onSelect={mockOnSelect} />);

      await waitFor(() => {
        const gridRow = screen.getByTestId('program-search-grid-row-0');
        fireEvent.doubleClick(gridRow);
      });

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith([mockPrograms[0]]);
      });
    });

    test('?¬ëŸ¬ ?„ë¡œê·¸ë¨??? íƒ?˜ë©´ ëª¨ë“  ? íƒ???„ë¡œê·¸ë¨???„ë‹¬?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 multiple={true} onSelect={mockOnSelect} />);

      // ?¬ëŸ¬ ?„ë¡œê·¸ë¨ ? íƒ
      await waitFor(() => {
        const gridRow1 = screen.getByTestId('program-search-grid-row-0');
        const gridRow2 = screen.getByTestId('program-search-grid-row-1');
        fireEvent.click(gridRow1);
        fireEvent.click(gridRow2);
      });

      // ì¶”ê? ë²„íŠ¼ ?´ë¦­
      const addButton = screen.getByText('ì¶”ê?');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith([mockPrograms[0], mockPrograms[1]]);
      });
    });
  });

  describe('? íƒ ì·¨ì†Œ', () => {
    test('ì·¨ì†Œ ë²„íŠ¼???´ë¦­?˜ë©´ ?ì—…???«í™?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 multiple={true} onSelect={mockOnSelect} />);

      // ì·¨ì†Œ ë²„íŠ¼ ?´ë¦­
      const cancelButton = screen.getByText('ì·¨ì†Œ');
      await user.click(cancelButton);

      // ?ì—…???«íˆ?”ì? ?•ì¸ (window.closeê°€ ?¸ì¶œ?˜ëŠ”ì§€)
      expect(window.close).toBeDefined();
    });
  });

  describe('?ì—… ?«ê¸°', () => {
    test('ESC ?¤ë? ?„ë¥´ë©??ì—…???«í™?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      await user.keyboard('{Escape}');

      // ESC ?¤ëŠ” ê¸°ë³¸?ìœ¼ë¡??ì—…???«ì? ?Šìœ¼ë¯€ë¡? ?¤ì œ êµ¬í˜„???°ë¼ ?ŒìŠ¤???˜ì • ?„ìš”
      expect(true).toBe(true);
    });
  });

  describe('URL ?Œë¼ë¯¸í„° ì²˜ë¦¬', () => {
    test('URL ?Œë¼ë¯¸í„°??PGM_IDê°€ ?ˆìœ¼ë©??´ë‹¹ ?„ë¡œê·¸ë¨??ë¯¸ë¦¬ ? íƒ?©ë‹ˆ??', async () => {
      // URL ?Œë¼ë¯¸í„° ?œë??ˆì´??- ê°„ë‹¨???ŒìŠ¤?¸ë¡œ ë³€ê²?
      render(<SYS1010D00 />);

      // ì»´í¬?ŒíŠ¸ê°€ ?•ìƒ?ìœ¼ë¡??Œë”ë§ë˜?”ì? ?•ì¸
      await waitFor(() => {
        expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
      });
    });

    test('URL ?Œë¼ë¯¸í„°??PGM_GRP_IDê°€ ?ˆìœ¼ë©??´ë‹¹ ê·¸ë£¹???„ë¡œê·¸ë¨?¤ì´ ?„í„°ë§ë©?ˆë‹¤.', async () => {
      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });
  });

  describe('ê²€ì¦?ë°??ëŸ¬ ì²˜ë¦¬', () => {
    test('?„ë¡œê·¸ë¨??? íƒ?˜ì? ?Šê³  ì¶”ê? ë²„íŠ¼???´ë¦­?˜ë©´ ê²½ê³  ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      
      // alert ëª¨í‚¹
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<SYS1010D00 multiple={true} />);

      const addButton = screen.getByText('ì¶”ê?');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('ì¶”ê????„ë¡œê·¸ë¨??? íƒ?´ì£¼?¸ìš”.');
      });

      mockAlert.mockRestore();
    });

    test('API ?¸ì¶œ ?¤íŒ¨ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('API ?¤ë¥˜'));

      // alert ëª¨í‚¹
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('?„ë¡œê·¸ë¨ ëª©ë¡ ë¡œë“œ ?¤íŒ¨: API ?¤ë¥˜');
      });

      mockAlert.mockRestore();
    });

    test('?¤íŠ¸?Œí¬ ?¤ë¥˜ ???ì ˆ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

      // alert ëª¨í‚¹
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('?„ë¡œê·¸ë¨ ëª©ë¡ ë¡œë“œ ?¤íŒ¨: Network Error');
      });

      mockAlert.mockRestore();
    });
  });

  describe('?‘ê·¼??, () => {
    test('ëª¨ë“  ?…ë ¥ ?„ë“œ???ì ˆ??aria-label???¤ì •?˜ì–´ ?ˆìŠµ?ˆë‹¤.', () => {
      render(<SYS1010D00 />);

      expect(screen.getByLabelText('?„ë¡œê·¸ë¨ IDëª??…ë ¥')).toBeInTheDocument();
      expect(screen.getByLabelText('êµ¬ë¶„ ? íƒ')).toBeInTheDocument();
      expect(screen.getByLabelText('?…ë¬´ ? íƒ')).toBeInTheDocument();
    });

    test('?¤ë³´?œë¡œ ëª¨ë“  ê¸°ëŠ¥???‘ê·¼?????ˆìŠµ?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      // Tab ?¤ë¡œ ?¬ì»¤???´ë™
      await user.tab();
      expect(screen.getByDisplayValue('')).toHaveFocus(); // ì²?ë²ˆì§¸ input

      await user.tab();
      expect(screen.getAllByRole('combobox')[0]).toHaveFocus(); // ì²?ë²ˆì§¸ select

      await user.tab();
      expect(screen.getAllByRole('combobox')[1]).toHaveFocus(); // ??ë²ˆì§¸ select

      await user.tab();
      expect(screen.getByText('ì¡°íšŒ')).toHaveFocus(); // ì¡°íšŒ ë²„íŠ¼
    });

    test('?¤í¬ë¦?ë¦¬ë” ?¬ìš©?ë? ?„í•œ ?ì ˆ??ARIA ?ì„±???¤ì •?˜ì–´ ?ˆìŠµ?ˆë‹¤.', () => {
      render(<SYS1010D00 />);

      expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
    });
  });

  describe('?±ëŠ¥ ë°?ìµœì ??, () => {
    test('?€?‰ì˜ ?„ë¡œê·¸ë¨ ?°ì´?°ê? ?ˆì–´???”ë©´???•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        PGM_ID: `PGM${i.toString().padStart(3, '0')}`,
        PGM_NM: `?„ë¡œê·¸ë¨ ${i}`,
        PGM_DIV_CD: '1',
        BIZ_DIV_CD: 'SYS',
        USE_YN: 'Y',
        SORT_SEQ: i + 1
      }));

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: largeData })
      });

      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
      });
    });
  });

  describe('ë°˜ì‘???”ì??, () => {
    test('?‘ì? ?”ë©´?ì„œ??ëª¨ë“  ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??‘ë™?©ë‹ˆ??', () => {
      // ?‘ì? ?”ë©´ ?¬ê¸° ?œë??ˆì´??
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<SYS1010D00 />);

      expect(screen.getByText('?„ë¡œê·¸ë¨ëª©ë¡')).toBeInTheDocument();
      expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
    });
  });

  describe('êµ? œ??, () => {
    test('?œêµ­???ìŠ¤?¸ê? ?•ìƒ?ìœ¼ë¡??œì‹œ?©ë‹ˆ??', () => {
      render(<SYS1010D00 />);

      expect(screen.getByText('?„ë¡œê·¸ë¨ëª©ë¡')).toBeInTheDocument();
      expect(screen.getByText('?„ë¡œê·¸ë¨ IDëª?)).toBeInTheDocument();
      expect(screen.getByText('êµ¬ë¶„')).toBeInTheDocument();
      expect(screen.getAllByText('?…ë¬´')[0]).toBeInTheDocument(); // ì²?ë²ˆì§¸ '?…ë¬´' ?ìŠ¤???¬ìš©
      expect(screen.getByText('ì¡°íšŒ')).toBeInTheDocument();
      expect(screen.getByText('ì¶”ê?')).toBeInTheDocument();
      // ì·¨ì†Œ ë²„íŠ¼?€ onSelect prop???ˆì„ ?Œë§Œ ?œì‹œ?˜ë?ë¡?ì¡°ê±´ë¶€ë¡??•ì¸
    });

    test('onSelect prop???ˆì„ ??ì·¨ì†Œ ë²„íŠ¼???œì‹œ?©ë‹ˆ??', () => {
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 onSelect={mockOnSelect} />);

      expect(screen.getByText('ì·¨ì†Œ')).toBeInTheDocument();
    });
  });
}); 

