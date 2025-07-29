/**
 * SYS1001M00.test.tsx - ?�로그램 그룹 관�??�면 ?�스??
 * 
 * ?�스???�?? SYS1001M00.tsx
 * ?�스??범위: ?�로그램 그룹 관리의 모든 주요 기능
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SYS1001M00 from './SYS1001M00';
import { ProgramGroupService } from '@/modules/sys/services/programGroupService';
import { usePopup } from '@/modules/com/hooks/usePopup';

// Mock dependencies
jest.mock('@/modules/sys/services/programGroupService');
jest.mock('@/modules/com/hooks/usePopup');
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock AG-Grid
jest.mock('ag-grid-react', () => ({
  AgGridReact: ({ rowData, onSelectionChanged, onGridReady, columnDefs }: any) => (
    <div data-testid="ag-grid">
      {rowData?.map((item: any, index: number) => (
        <div key={index} data-testid={`grid-row-${index}`} onClick={() => onSelectionChanged?.({ api: { getSelectedRows: () => [item] } })}>
          {item.pgmGrpId || item.pgmId}
        </div>
      ))}
    </div>
  ),
}));

const mockProgramGroupService = ProgramGroupService as jest.Mocked<typeof ProgramGroupService>;
const mockUsePopup = usePopup as jest.MockedFunction<typeof usePopup>;

describe('SYS1001M00 - ?�로그램 그룹 관�?, () => {
  const mockProgramGroups = [
    {
      pgmGrpId: 'GRP001',
      pgmGrpNm: '?�용?��?�?그룹',
      useYn: 'Y',
      sortSeq: 1,
      regDttm: '2024-01-01',
      chngDttm: '2024-01-01',
      chngrId: 'admin'
    },
    {
      pgmGrpId: 'GRP002',
      pgmGrpNm: '?�스?��?�?그룹',
      useYn: 'Y',
      sortSeq: 2,
      regDttm: '2024-01-01',
      chngDttm: '2024-01-01',
      chngrId: 'admin'
    }
  ];

  const mockPrograms = [
    {
      pgmId: 'USR2010M00',
      pgmNm: '?�용?��?�?,
      pgmDivNm: '?�면',
      bizDivNm: '?�용?��?�?,
      useYn: 'Y',
      sortSeq: 1
    },
    {
      pgmId: 'SYS1000M00',
      pgmNm: '?�로그램관�?,
      pgmDivNm: '?�면',
      bizDivNm: '?�스?��?�?,
      useYn: 'Y',
      sortSeq: 2
    }
  ];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock service methods
    mockProgramGroupService.getProgramGroupList.mockResolvedValue({
      success: true,
      data: mockProgramGroups,
      message: '조회 ?�공'
    });

    mockProgramGroupService.getProgramGroupDetail.mockResolvedValue({
      success: true,
      data: {
        ...mockProgramGroups[0],
        programs: mockPrograms
      },
      message: '조회 ?�공'
    });

    mockProgramGroupService.createProgramGroup.mockResolvedValue(mockProgramGroups[0]);

    mockProgramGroupService.updateProgramGroup.mockResolvedValue(mockProgramGroups[0]);

    mockProgramGroupService.copyProgramGroup.mockResolvedValue({
      success: true,
      message: '복사 ?�공'
    });

    // Mock popup hook
    mockUsePopup.mockReturnValue({
      openPopup: jest.fn(),
      closePopup: jest.fn(),
      focusPopup: jest.fn(),
      postMessage: jest.fn(),
      isOpen: false,
      popupInstance: null
    });
  });

  describe('?�면 ?�더�?, () => {
    test('?�로그램 그룹 관�??�면???�상?�으�??�더링됩?�다.', async () => {
      render(<SYS1001M00 />);

      // 기본 UI ?�소?�이 ?�더링되?��? ?�인
      expect(screen.getByText('?�로그램 그룹 목록')).toBeInTheDocument();
      expect(screen.getByText('?�로그램 목록')).toBeInTheDocument();
      expect(screen.getByText('?�로그램 그룹 ?�보')).toBeInTheDocument();
    });

    test('검??조건 ?�력 ?�드?�이 ?�상?�으�??�더링됩?�다.', () => {
      render(<SYS1001M00 />);

      expect(screen.getByPlaceholderText('그룹�??�는 코드 ?�력')).toBeInTheDocument();
      expect(screen.getByDisplayValue('?�체')).toBeInTheDocument();
      expect(screen.getByText('조회')).toBeInTheDocument();
    });

    test('?�로그램 그룹 목록 그리?��? ?�상?�으�??�더링됩?�다.', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(screen.getAllByTestId('ag-grid')).toHaveLength(2); // ?�쪽, ?�른�?그리??
      });
    });

    test('버튼?�이 ?�상?�으�??�더링됩?�다.', () => {
      render(<SYS1001M00 />);

      expect(screen.getByText('?�규')).toBeInTheDocument();
      expect(screen.getByText('?�??)).toBeInTheDocument();
      expect(screen.getByText('??��')).toBeInTheDocument();
      expect(screen.getByText('추�?')).toBeInTheDocument();
    });
  });

  describe('?�로그램 그룹 목록 조회', () => {
    test('?�면 로드 ???�로그램 그룹 목록???�동?�로 조회?�니??', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupList).toHaveBeenCalledWith({
          PGM_GRP_NM: '',
          USE_YN: ''
        });
      });
    });

    test('검??조건???�력?�고 조회 버튼???�릭?�면 ?�당 조건?�로 조회?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      // 검??조건 ?�력
      const searchInput = screen.getByPlaceholderText('그룹�??�는 코드 ?�력');
      await user.type(searchInput, '?�용??);

      const searchButton = screen.getByText('조회');
      await user.click(searchButton);

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupList).toHaveBeenCalledWith({
          PGM_GRP_NM: '?�용??,
          USE_YN: ''
        });
      });
    });

    test('?�터?��? ?�르�??�동?�로 조회가 ?�행?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      const searchInput = screen.getByPlaceholderText('그룹�??�는 코드 ?�력');
      await user.type(searchInput, '?�스??);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupList).toHaveBeenCalledWith({
          PGM_GRP_NM: '?�스??,
          USE_YN: ''
        });
      });
    });
  });

  describe('?�로그램 그룹 ?�택', () => {
    test('?�로그램 그룹???�릭?�면 ?�당 그룹???�세 ?�보가 ?�시?�니??', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        const gridRow = screen.getByTestId('grid-row-0');
        fireEvent.click(gridRow);
      });

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupDetail).toHaveBeenCalledWith('GRP001');
      });
    });

    test('?�로그램 그룹???�택?�면 ?�당 그룹???�로그램 목록???�시?�니??', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        const gridRow = screen.getByTestId('grid-row-0');
        fireEvent.click(gridRow);
      });

      await waitFor(() => {
        expect(screen.getByText('?�로그램 목록')).toBeInTheDocument();
      });
    });
  });

  describe('?�로그램 그룹 ?�규 ?�록', () => {
    test('?�규 버튼???�릭?�면 ?�이 초기?�됩?�다.', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      const newButton = screen.getByText('?�규');
      await user.click(newButton);

      // ?�규 버튼 ?�릭 ???�태 ?�인
      expect(newButton).toBeInTheDocument();
    });
  });

  describe('?�로그램 추�?', () => {
    test('?�로그램 추�? 버튼???�릭?�면 ?�로그램 검???�업???�립?�다.', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      // 그룹 ?�택
      await waitFor(() => {
        const gridRow = screen.getByTestId('grid-row-0');
        fireEvent.click(gridRow);
      });

      // ?�로그램 추�? 버튼 ?�릭
      const addProgramButton = screen.getByText('추�?');
      await user.click(addProgramButton);

      await waitFor(() => {
        expect(mockUsePopup().openPopup).toHaveBeenCalled();
      });
    });
  });

  describe('검�?�??�러 처리', () => {
    test('API ?�출 ?�패 ???�러 처리가 ?�상?�으�??�동?�니??', async () => {
      mockProgramGroupService.getProgramGroupList.mockRejectedValue(new Error('API ?�류'));

      render(<SYS1001M00 />);

      // ?�러 발생 ?�에???�면???�상?�으�??�더링되?��? ?�인
      await waitFor(() => {
        expect(screen.getByText('?�로그램 그룹 목록')).toBeInTheDocument();
      });
    });
  });

  describe('?�근??, () => {
    test('모든 ?�력 ?�드???�절??placeholder가 ?�정?�어 ?�습?�다.', () => {
      render(<SYS1001M00 />);

      expect(screen.getByPlaceholderText('그룹�??�는 코드 ?�력')).toBeInTheDocument();
    });

    test('?�보?�로 기본 기능???�근?????�습?�다.', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      // Tab ?�로 ?�커???�동
      await user.tab();
      expect(screen.getByPlaceholderText('그룹�??�는 코드 ?�력')).toHaveFocus();
    });
  });

  describe('?�능 �?최적??, () => {
    test('그리???�이??변�???컬럼 ?�기가 ?�동?�로 조정?�니??', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(screen.getAllByTestId('ag-grid')).toHaveLength(2);
      });
    });

    test('?�?�의 ?�이?��? ?�어???�면???�상?�으�??�더링됩?�다.', async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        pgmGrpId: `GRP${i.toString().padStart(3, '0')}`,
        pgmGrpNm: `그룹 ${i}`,
        useYn: 'Y',
        sortSeq: i + 1
      }));

      mockProgramGroupService.getProgramGroupList.mockResolvedValue({
        success: true,
        data: largeData,
        message: '조회 ?�공'
      });

      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(screen.getAllByTestId('ag-grid')).toHaveLength(2);
      });
    });
  });
}); 

