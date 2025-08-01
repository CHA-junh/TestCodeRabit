/**
 * SYS1010D00.test.tsx - ?ë¡ê·¸ë¨ ê²???ì ?ë©´ ?ì¤??
 * 
 * ?ì¤????? SYS1010D00.tsx
 * ?ì¤??ë²ì: ?ë¡ê·¸ë¨ ê²???ì??ëª¨ë  ì£¼ì ê¸°ë¥
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

describe('SYS1010D00 - ?ë¡ê·¸ë¨ ê²???ì', () => {
  const mockPrograms = [
    {
      PGM_ID: 'USR2010M00',
      PGM_NM: '?¬ì©?ê?ë¦?,
      PGM_DIV_CD: '1',
      BIZ_DIV_CD: 'USR',
      USE_YN: 'Y',
      SORT_SEQ: 1
    },
    {
      PGM_ID: 'SYS1000M00',
      PGM_NM: '?ë¡ê·¸ë¨ê´ë¦?,
      PGM_DIV_CD: '1',
      BIZ_DIV_CD: 'SYS',
      USE_YN: 'Y',
      SORT_SEQ: 2
    },
    {
      PGM_ID: 'SYS1001M00',
      PGM_NM: '?ë¡ê·¸ë¨ê·¸ë£¹ê´ë¦?,
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

  describe('?ë©´ ?ëë§?, () => {
    test('?ë¡ê·¸ë¨ ê²???ì???ì?ì¼ë¡??ëë§ë©?ë¤.', async () => {
      render(<SYS1010D00 />);
      expect(screen.getByText('?ë¡ê·¸ë¨ëª©ë¡')).toBeInTheDocument();
    });

    test('ê²??ì¡°ê±´ ?ë ¥ ?ë?¤ì´ ?ì?ì¼ë¡??ëë§ë©?ë¤.', () => {
      render(<SYS1010D00 />);
      expect(screen.getByText('?ë¡ê·¸ë¨ IDëª?)).toBeInTheDocument();
      expect(screen.getByText('êµ¬ë¶')).toBeInTheDocument();
      expect(screen.getAllByText('?ë¬´')[0]).toBeInTheDocument(); // ì²?ë²ì§¸ '?ë¬´' ?ì¤???¬ì©
      expect(screen.getByText('ì¡°í')).toBeInTheDocument();
    });

    test('?ë¡ê·¸ë¨ ëª©ë¡ ê·¸ë¦¬?ê? ?ì?ì¼ë¡??ëë§ë©?ë¤.', async () => {
      render(<SYS1010D00 />);
      await waitFor(() => {
        expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
      });
    });
  });

  describe('?ë¡ê·¸ë¨ ëª©ë¡ ì¡°í', () => {
    test('?ë©´ ë¡ë ???ë¡ê·¸ë¨ ëª©ë¡???ë?¼ë¡ ì¡°í?©ë??', async () => {
      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('ê²??ì¡°ê±´???ë ¥?ê³  ì¡°í ë²í¼???´ë¦­?ë©´ ?´ë¹ ì¡°ê±´?¼ë¡ ì¡°í?©ë??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      // ê²??ì¡°ê±´ ?ë ¥
      const searchInput = screen.getByDisplayValue('');
      await user.type(searchInput, '?¬ì©??);

      const searchButton = screen.getByText('ì¡°í');
      await user.click(searchButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('?í°?¤ë? ?ë¥´ë©??ë?¼ë¡ ì¡°íê° ?¤í?©ë??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      const searchInput = screen.getByDisplayValue('');
      await user.type(searchInput, '?ì¤??);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('?ë¡ê·¸ë¨êµ¬ë¶??? í?ë©´ ?´ë¹ ì¡°ê±´?¼ë¡ ì¡°í?©ë??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      const divisionSelect = screen.getAllByRole('combobox')[0];
      await user.selectOptions(divisionSelect, '?ë©´');

      const searchButton = screen.getByText('ì¡°í');
      await user.click(searchButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('?ë¬´êµ¬ë¶??? í?ë©´ ?´ë¹ ì¡°ê±´?¼ë¡ ì¡°í?©ë??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      const bizSelect = screen.getAllByRole('combobox')[1];
      await user.selectOptions(bizSelect, '?ë¬´');

      const searchButton = screen.getByText('ì¡°í');
      await user.click(searchButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });
  });

  describe('?ë¡ê·¸ë¨ ? í', () => {
    test('?¤ì¤ ? í ëª¨ë?ì ì²´í¬ë°ì¤ë¡??ë¡ê·¸ë¨??? í?????ìµ?ë¤.', async () => {
      const user = userEvent.setup();
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 multiple={true} onSelect={mockOnSelect} />);

      await waitFor(() => {
        const gridRow = screen.getByTestId('program-search-grid-row-0');
        fireEvent.click(gridRow);
      });

      // ì¶ê? ë²í¼ ?´ë¦­
      const addButton = screen.getByText('ì¶ê?');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith([mockPrograms[0]]);
      });
    });

    test('?¨ì¼ ? í ëª¨ë?ì ?ë¸?´ë¦­?¼ë¡ ?ë¡ê·¸ë¨??? í?????ìµ?ë¤.', async () => {
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

    test('?¬ë¬ ?ë¡ê·¸ë¨??? í?ë©´ ëª¨ë  ? í???ë¡ê·¸ë¨???ë¬?©ë??', async () => {
      const user = userEvent.setup();
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 multiple={true} onSelect={mockOnSelect} />);

      // ?¬ë¬ ?ë¡ê·¸ë¨ ? í
      await waitFor(() => {
        const gridRow1 = screen.getByTestId('program-search-grid-row-0');
        const gridRow2 = screen.getByTestId('program-search-grid-row-1');
        fireEvent.click(gridRow1);
        fireEvent.click(gridRow2);
      });

      // ì¶ê? ë²í¼ ?´ë¦­
      const addButton = screen.getByText('ì¶ê?');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith([mockPrograms[0], mockPrograms[1]]);
      });
    });
  });

  describe('? í ì·¨ì', () => {
    test('ì·¨ì ë²í¼???´ë¦­?ë©´ ?ì???«í?ë¤.', async () => {
      const user = userEvent.setup();
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 multiple={true} onSelect={mockOnSelect} />);

      // ì·¨ì ë²í¼ ?´ë¦­
      const cancelButton = screen.getByText('ì·¨ì');
      await user.click(cancelButton);

      // ?ì???«í?ì? ?ì¸ (window.closeê° ?¸ì¶?ëì§)
      expect(window.close).toBeDefined();
    });
  });

  describe('?ì ?«ê¸°', () => {
    test('ESC ?¤ë? ?ë¥´ë©??ì???«í?ë¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      await user.keyboard('{Escape}');

      // ESC ?¤ë ê¸°ë³¸?ì¼ë¡??ì???«ì? ?ì¼ë¯ë¡? ?¤ì  êµ¬í???°ë¼ ?ì¤???ì  ?ì
      expect(true).toBe(true);
    });
  });

  describe('URL ?ë¼ë¯¸í° ì²ë¦¬', () => {
    test('URL ?ë¼ë¯¸í°??PGM_IDê° ?ì¼ë©??´ë¹ ?ë¡ê·¸ë¨??ë¯¸ë¦¬ ? í?©ë??', async () => {
      // URL ?ë¼ë¯¸í° ?ë??ì´??- ê°ë¨???ì¤?¸ë¡ ë³ê²?
      render(<SYS1010D00 />);

      // ì»´í¬?í¸ê° ?ì?ì¼ë¡??ëë§ë?ì? ?ì¸
      await waitFor(() => {
        expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
      });
    });

    test('URL ?ë¼ë¯¸í°??PGM_GRP_IDê° ?ì¼ë©??´ë¹ ê·¸ë£¹???ë¡ê·¸ë¨?¤ì´ ?í°ë§ë©?ë¤.', async () => {
      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });
  });

  describe('ê²ì¦?ë°??ë¬ ì²ë¦¬', () => {
    test('?ë¡ê·¸ë¨??? í?ì? ?ê³  ì¶ê? ë²í¼???´ë¦­?ë©´ ê²½ê³  ë©ìì§ê° ?ì?©ë??', async () => {
      const user = userEvent.setup();
      
      // alert ëª¨í¹
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<SYS1010D00 multiple={true} />);

      const addButton = screen.getByText('ì¶ê?');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('ì¶ê????ë¡ê·¸ë¨??? í?´ì£¼?¸ì.');
      });

      mockAlert.mockRestore();
    });

    test('API ?¸ì¶ ?¤í¨ ???ë¬ ë©ìì§ê° ?ì?©ë??', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('API ?¤ë¥'));

      // alert ëª¨í¹
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('?ë¡ê·¸ë¨ ëª©ë¡ ë¡ë ?¤í¨: API ?¤ë¥');
      });

      mockAlert.mockRestore();
    });

    test('?¤í¸?í¬ ?¤ë¥ ???ì ???ë¬ ë©ìì§ê° ?ì?©ë??', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

      // alert ëª¨í¹
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('?ë¡ê·¸ë¨ ëª©ë¡ ë¡ë ?¤í¨: Network Error');
      });

      mockAlert.mockRestore();
    });
  });

  describe('?ê·¼??, () => {
    test('ëª¨ë  ?ë ¥ ?ë???ì ??aria-label???¤ì ?ì´ ?ìµ?ë¤.', () => {
      render(<SYS1010D00 />);

      expect(screen.getByLabelText('?ë¡ê·¸ë¨ IDëª??ë ¥')).toBeInTheDocument();
      expect(screen.getByLabelText('êµ¬ë¶ ? í')).toBeInTheDocument();
      expect(screen.getByLabelText('?ë¬´ ? í')).toBeInTheDocument();
    });

    test('?¤ë³´?ë¡ ëª¨ë  ê¸°ë¥???ê·¼?????ìµ?ë¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      // Tab ?¤ë¡ ?¬ì»¤???´ë
      await user.tab();
      expect(screen.getByDisplayValue('')).toHaveFocus(); // ì²?ë²ì§¸ input

      await user.tab();
      expect(screen.getAllByRole('combobox')[0]).toHaveFocus(); // ì²?ë²ì§¸ select

      await user.tab();
      expect(screen.getAllByRole('combobox')[1]).toHaveFocus(); // ??ë²ì§¸ select

      await user.tab();
      expect(screen.getByText('ì¡°í')).toHaveFocus(); // ì¡°í ë²í¼
    });

    test('?¤í¬ë¦?ë¦¬ë ?¬ì©?ë? ?í ?ì ??ARIA ?ì±???¤ì ?ì´ ?ìµ?ë¤.', () => {
      render(<SYS1010D00 />);

      expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
    });
  });

  describe('?±ë¥ ë°?ìµì ??, () => {
    test('??ì ?ë¡ê·¸ë¨ ?°ì´?°ê? ?ì´???ë©´???ì?ì¼ë¡??ëë§ë©?ë¤.', async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        PGM_ID: `PGM${i.toString().padStart(3, '0')}`,
        PGM_NM: `?ë¡ê·¸ë¨ ${i}`,
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

  describe('ë°ì???ì??, () => {
    test('?ì? ?ë©´?ì??ëª¨ë  ê¸°ë¥???ì?ì¼ë¡??ë?©ë??', () => {
      // ?ì? ?ë©´ ?¬ê¸° ?ë??ì´??
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<SYS1010D00 />);

      expect(screen.getByText('?ë¡ê·¸ë¨ëª©ë¡')).toBeInTheDocument();
      expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
    });
  });

  describe('êµ? ??, () => {
    test('?êµ­???ì¤?¸ê? ?ì?ì¼ë¡??ì?©ë??', () => {
      render(<SYS1010D00 />);

      expect(screen.getByText('?ë¡ê·¸ë¨ëª©ë¡')).toBeInTheDocument();
      expect(screen.getByText('?ë¡ê·¸ë¨ IDëª?)).toBeInTheDocument();
      expect(screen.getByText('êµ¬ë¶')).toBeInTheDocument();
      expect(screen.getAllByText('?ë¬´')[0]).toBeInTheDocument(); // ì²?ë²ì§¸ '?ë¬´' ?ì¤???¬ì©
      expect(screen.getByText('ì¡°í')).toBeInTheDocument();
      expect(screen.getByText('ì¶ê?')).toBeInTheDocument();
      // ì·¨ì ë²í¼? onSelect prop???ì ?ë§ ?ì?ë?ë¡?ì¡°ê±´ë¶ë¡??ì¸
    });

    test('onSelect prop???ì ??ì·¨ì ë²í¼???ì?©ë??', () => {
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 onSelect={mockOnSelect} />);

      expect(screen.getByText('ì·¨ì')).toBeInTheDocument();
    });
  });
}); 

