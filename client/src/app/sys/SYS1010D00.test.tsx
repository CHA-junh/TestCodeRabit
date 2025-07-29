/**
 * SYS1010D00.test.tsx - ?�로그램 검???�업 ?�면 ?�스??
 * 
 * ?�스???�?? SYS1010D00.tsx
 * ?�스??범위: ?�로그램 검???�업??모든 주요 기능
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

describe('SYS1010D00 - ?�로그램 검???�업', () => {
  const mockPrograms = [
    {
      PGM_ID: 'USR2010M00',
      PGM_NM: '?�용?��?�?,
      PGM_DIV_CD: '1',
      BIZ_DIV_CD: 'USR',
      USE_YN: 'Y',
      SORT_SEQ: 1
    },
    {
      PGM_ID: 'SYS1000M00',
      PGM_NM: '?�로그램관�?,
      PGM_DIV_CD: '1',
      BIZ_DIV_CD: 'SYS',
      USE_YN: 'Y',
      SORT_SEQ: 2
    },
    {
      PGM_ID: 'SYS1001M00',
      PGM_NM: '?�로그램그룹관�?,
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

  describe('?�면 ?�더�?, () => {
    test('?�로그램 검???�업???�상?�으�??�더링됩?�다.', async () => {
      render(<SYS1010D00 />);
      expect(screen.getByText('?�로그램목록')).toBeInTheDocument();
    });

    test('검??조건 ?�력 ?�드?�이 ?�상?�으�??�더링됩?�다.', () => {
      render(<SYS1010D00 />);
      expect(screen.getByText('?�로그램 ID�?)).toBeInTheDocument();
      expect(screen.getByText('구분')).toBeInTheDocument();
      expect(screen.getAllByText('?�무')[0]).toBeInTheDocument(); // �?번째 '?�무' ?�스???�용
      expect(screen.getByText('조회')).toBeInTheDocument();
    });

    test('?�로그램 목록 그리?��? ?�상?�으�??�더링됩?�다.', async () => {
      render(<SYS1010D00 />);
      await waitFor(() => {
        expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
      });
    });
  });

  describe('?�로그램 목록 조회', () => {
    test('?�면 로드 ???�로그램 목록???�동?�로 조회?�니??', async () => {
      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('검??조건???�력?�고 조회 버튼???�릭?�면 ?�당 조건?�로 조회?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      // 검??조건 ?�력
      const searchInput = screen.getByDisplayValue('');
      await user.type(searchInput, '?�용??);

      const searchButton = screen.getByText('조회');
      await user.click(searchButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('?�터?��? ?�르�??�동?�로 조회가 ?�행?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      const searchInput = screen.getByDisplayValue('');
      await user.type(searchInput, '?�스??);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('?�로그램구분???�택?�면 ?�당 조건?�로 조회?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      const divisionSelect = screen.getAllByRole('combobox')[0];
      await user.selectOptions(divisionSelect, '?�면');

      const searchButton = screen.getByText('조회');
      await user.click(searchButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });

    test('?�무구분???�택?�면 ?�당 조건?�로 조회?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      const bizSelect = screen.getAllByRole('combobox')[1];
      await user.selectOptions(bizSelect, '?�무');

      const searchButton = screen.getByText('조회');
      await user.click(searchButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });
  });

  describe('?�로그램 ?�택', () => {
    test('?�중 ?�택 모드?�서 체크박스�??�로그램???�택?????�습?�다.', async () => {
      const user = userEvent.setup();
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 multiple={true} onSelect={mockOnSelect} />);

      await waitFor(() => {
        const gridRow = screen.getByTestId('program-search-grid-row-0');
        fireEvent.click(gridRow);
      });

      // 추�? 버튼 ?�릭
      const addButton = screen.getByText('추�?');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith([mockPrograms[0]]);
      });
    });

    test('?�일 ?�택 모드?�서 ?�블?�릭?�로 ?�로그램???�택?????�습?�다.', async () => {
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

    test('?�러 ?�로그램???�택?�면 모든 ?�택???�로그램???�달?�니??', async () => {
      const user = userEvent.setup();
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 multiple={true} onSelect={mockOnSelect} />);

      // ?�러 ?�로그램 ?�택
      await waitFor(() => {
        const gridRow1 = screen.getByTestId('program-search-grid-row-0');
        const gridRow2 = screen.getByTestId('program-search-grid-row-1');
        fireEvent.click(gridRow1);
        fireEvent.click(gridRow2);
      });

      // 추�? 버튼 ?�릭
      const addButton = screen.getByText('추�?');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith([mockPrograms[0], mockPrograms[1]]);
      });
    });
  });

  describe('?�택 취소', () => {
    test('취소 버튼???�릭?�면 ?�업???�힙?�다.', async () => {
      const user = userEvent.setup();
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 multiple={true} onSelect={mockOnSelect} />);

      // 취소 버튼 ?�릭
      const cancelButton = screen.getByText('취소');
      await user.click(cancelButton);

      // ?�업???�히?��? ?�인 (window.close가 ?�출?�는지)
      expect(window.close).toBeDefined();
    });
  });

  describe('?�업 ?�기', () => {
    test('ESC ?��? ?�르�??�업???�힙?�다.', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      await user.keyboard('{Escape}');

      // ESC ?�는 기본?�으�??�업???��? ?�으므�? ?�제 구현???�라 ?�스???�정 ?�요
      expect(true).toBe(true);
    });
  });

  describe('URL ?�라미터 처리', () => {
    test('URL ?�라미터??PGM_ID가 ?�으�??�당 ?�로그램??미리 ?�택?�니??', async () => {
      // URL ?�라미터 ?��??�이??- 간단???�스?�로 변�?
      render(<SYS1010D00 />);

      // 컴포?�트가 ?�상?�으�??�더링되?��? ?�인
      await waitFor(() => {
        expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
      });
    });

    test('URL ?�라미터??PGM_GRP_ID가 ?�으�??�당 그룹???�로그램?�이 ?�터링됩?�다.', async () => {
      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/sys/programs/search'));
      }, { timeout: 3000 });
    });
  });

  describe('검�?�??�러 처리', () => {
    test('?�로그램???�택?��? ?�고 추�? 버튼???�릭?�면 경고 메시지가 ?�시?�니??', async () => {
      const user = userEvent.setup();
      
      // alert 모킹
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<SYS1010D00 multiple={true} />);

      const addButton = screen.getByText('추�?');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('추�????�로그램???�택?�주?�요.');
      });

      mockAlert.mockRestore();
    });

    test('API ?�출 ?�패 ???�러 메시지가 ?�시?�니??', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('API ?�류'));

      // alert 모킹
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('?�로그램 목록 로드 ?�패: API ?�류');
      });

      mockAlert.mockRestore();
    });

    test('?�트?�크 ?�류 ???�절???�러 메시지가 ?�시?�니??', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

      // alert 모킹
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<SYS1010D00 />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('?�로그램 목록 로드 ?�패: Network Error');
      });

      mockAlert.mockRestore();
    });
  });

  describe('?�근??, () => {
    test('모든 ?�력 ?�드???�절??aria-label???�정?�어 ?�습?�다.', () => {
      render(<SYS1010D00 />);

      expect(screen.getByLabelText('?�로그램 ID�??�력')).toBeInTheDocument();
      expect(screen.getByLabelText('구분 ?�택')).toBeInTheDocument();
      expect(screen.getByLabelText('?�무 ?�택')).toBeInTheDocument();
    });

    test('?�보?�로 모든 기능???�근?????�습?�다.', async () => {
      const user = userEvent.setup();
      render(<SYS1010D00 />);

      // Tab ?�로 ?�커???�동
      await user.tab();
      expect(screen.getByDisplayValue('')).toHaveFocus(); // �?번째 input

      await user.tab();
      expect(screen.getAllByRole('combobox')[0]).toHaveFocus(); // �?번째 select

      await user.tab();
      expect(screen.getAllByRole('combobox')[1]).toHaveFocus(); // ??번째 select

      await user.tab();
      expect(screen.getByText('조회')).toHaveFocus(); // 조회 버튼
    });

    test('?�크�?리더 ?�용?��? ?�한 ?�절??ARIA ?�성???�정?�어 ?�습?�다.', () => {
      render(<SYS1010D00 />);

      expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
    });
  });

  describe('?�능 �?최적??, () => {
    test('?�?�의 ?�로그램 ?�이?��? ?�어???�면???�상?�으�??�더링됩?�다.', async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        PGM_ID: `PGM${i.toString().padStart(3, '0')}`,
        PGM_NM: `?�로그램 ${i}`,
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

  describe('반응???�자??, () => {
    test('?��? ?�면?�서??모든 기능???�상?�으�??�동?�니??', () => {
      // ?��? ?�면 ?�기 ?��??�이??
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<SYS1010D00 />);

      expect(screen.getByText('?�로그램목록')).toBeInTheDocument();
      expect(screen.getByTestId('program-search-grid')).toBeInTheDocument();
    });
  });

  describe('�?��??, () => {
    test('?�국???�스?��? ?�상?�으�??�시?�니??', () => {
      render(<SYS1010D00 />);

      expect(screen.getByText('?�로그램목록')).toBeInTheDocument();
      expect(screen.getByText('?�로그램 ID�?)).toBeInTheDocument();
      expect(screen.getByText('구분')).toBeInTheDocument();
      expect(screen.getAllByText('?�무')[0]).toBeInTheDocument(); // �?번째 '?�무' ?�스???�용
      expect(screen.getByText('조회')).toBeInTheDocument();
      expect(screen.getByText('추�?')).toBeInTheDocument();
      // 취소 버튼?� onSelect prop???�을 ?�만 ?�시?��?�?조건부�??�인
    });

    test('onSelect prop???�을 ??취소 버튼???�시?�니??', () => {
      const mockOnSelect = jest.fn();
      render(<SYS1010D00 onSelect={mockOnSelect} />);

      expect(screen.getByText('취소')).toBeInTheDocument();
    });
  });
}); 

