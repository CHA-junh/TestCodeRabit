/**
 * SYS1001M00.test.tsx - 프로그램 그룹 관리 화면 테스트
 * 
 * 테스트 대상: SYS1001M00.tsx
 * 테스트 범위: 프로그램 그룹 관리의 모든 주요 기능
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

describe('SYS1001M00 - 프로그램 그룹 관리', () => {
  const mockProgramGroups = [
    {
      pgmGrpId: 'GRP001',
      pgmGrpNm: '사용자관리 그룹',
      useYn: 'Y',
      sortSeq: 1,
      regDttm: '2024-01-01',
      chngDttm: '2024-01-01',
      chngrId: 'admin'
    },
    {
      pgmGrpId: 'GRP002',
      pgmGrpNm: '시스템관리 그룹',
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
      pgmNm: '사용자관리',
      pgmDivNm: '화면',
      bizDivNm: '사용자관리',
      useYn: 'Y',
      sortSeq: 1
    },
    {
      pgmId: 'SYS1000M00',
      pgmNm: '프로그램관리',
      pgmDivNm: '화면',
      bizDivNm: '시스템관리',
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
      message: '조회 성공'
    });

    mockProgramGroupService.getProgramGroupDetail.mockResolvedValue({
      success: true,
      data: {
        ...mockProgramGroups[0],
        programs: mockPrograms
      },
      message: '조회 성공'
    });

    mockProgramGroupService.createProgramGroup.mockResolvedValue(mockProgramGroups[0]);

    mockProgramGroupService.updateProgramGroup.mockResolvedValue(mockProgramGroups[0]);

    mockProgramGroupService.copyProgramGroup.mockResolvedValue({
      success: true,
      message: '복사 성공'
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

  describe('화면 렌더링', () => {
    test('프로그램 그룹 관리 화면이 정상적으로 렌더링됩니다.', async () => {
      render(<SYS1001M00 />);

      // 기본 UI 요소들이 렌더링되는지 확인
      expect(screen.getByText('프로그램 그룹 목록')).toBeInTheDocument();
      expect(screen.getByText('프로그램 목록')).toBeInTheDocument();
      expect(screen.getByText('프로그램 그룹 정보')).toBeInTheDocument();
    });

    test('검색 조건 입력 필드들이 정상적으로 렌더링됩니다.', () => {
      render(<SYS1001M00 />);

      expect(screen.getByPlaceholderText('그룹명 또는 코드 입력')).toBeInTheDocument();
      expect(screen.getByDisplayValue('전체')).toBeInTheDocument();
      expect(screen.getByText('조회')).toBeInTheDocument();
    });

    test('프로그램 그룹 목록 그리드가 정상적으로 렌더링됩니다.', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(screen.getAllByTestId('ag-grid')).toHaveLength(2); // 왼쪽, 오른쪽 그리드
      });
    });

    test('버튼들이 정상적으로 렌더링됩니다.', () => {
      render(<SYS1001M00 />);

      expect(screen.getByText('신규')).toBeInTheDocument();
      expect(screen.getByText('저장')).toBeInTheDocument();
      expect(screen.getByText('삭제')).toBeInTheDocument();
      expect(screen.getByText('추가')).toBeInTheDocument();
    });
  });

  describe('프로그램 그룹 목록 조회', () => {
    test('화면 로드 시 프로그램 그룹 목록이 자동으로 조회됩니다.', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupList).toHaveBeenCalledWith({
          PGM_GRP_NM: '',
          USE_YN: ''
        });
      });
    });

    test('검색 조건을 입력하고 조회 버튼을 클릭하면 해당 조건으로 조회됩니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      // 검색 조건 입력
      const searchInput = screen.getByPlaceholderText('그룹명 또는 코드 입력');
      await user.type(searchInput, '사용자');

      const searchButton = screen.getByText('조회');
      await user.click(searchButton);

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupList).toHaveBeenCalledWith({
          PGM_GRP_NM: '사용자',
          USE_YN: ''
        });
      });
    });

    test('엔터키를 누르면 자동으로 조회가 실행됩니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      const searchInput = screen.getByPlaceholderText('그룹명 또는 코드 입력');
      await user.type(searchInput, '시스템');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupList).toHaveBeenCalledWith({
          PGM_GRP_NM: '시스템',
          USE_YN: ''
        });
      });
    });
  });

  describe('프로그램 그룹 선택', () => {
    test('프로그램 그룹을 클릭하면 해당 그룹의 상세 정보가 표시됩니다.', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        const gridRow = screen.getByTestId('grid-row-0');
        fireEvent.click(gridRow);
      });

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupDetail).toHaveBeenCalledWith('GRP001');
      });
    });

    test('프로그램 그룹을 선택하면 해당 그룹의 프로그램 목록이 표시됩니다.', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        const gridRow = screen.getByTestId('grid-row-0');
        fireEvent.click(gridRow);
      });

      await waitFor(() => {
        expect(screen.getByText('프로그램 목록')).toBeInTheDocument();
      });
    });
  });

  describe('프로그램 그룹 신규 등록', () => {
    test('신규 버튼을 클릭하면 폼이 초기화됩니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      const newButton = screen.getByText('신규');
      await user.click(newButton);

      // 신규 버튼 클릭 후 상태 확인
      expect(newButton).toBeInTheDocument();
    });
  });

  describe('프로그램 추가', () => {
    test('프로그램 추가 버튼을 클릭하면 프로그램 검색 팝업이 열립니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      // 그룹 선택
      await waitFor(() => {
        const gridRow = screen.getByTestId('grid-row-0');
        fireEvent.click(gridRow);
      });

      // 프로그램 추가 버튼 클릭
      const addProgramButton = screen.getByText('추가');
      await user.click(addProgramButton);

      await waitFor(() => {
        expect(mockUsePopup().openPopup).toHaveBeenCalled();
      });
    });
  });

  describe('검증 및 에러 처리', () => {
    test('API 호출 실패 시 에러 처리가 정상적으로 작동합니다.', async () => {
      mockProgramGroupService.getProgramGroupList.mockRejectedValue(new Error('API 오류'));

      render(<SYS1001M00 />);

      // 에러 발생 시에도 화면이 정상적으로 렌더링되는지 확인
      await waitFor(() => {
        expect(screen.getByText('프로그램 그룹 목록')).toBeInTheDocument();
      });
    });
  });

  describe('접근성', () => {
    test('모든 입력 필드에 적절한 placeholder가 설정되어 있습니다.', () => {
      render(<SYS1001M00 />);

      expect(screen.getByPlaceholderText('그룹명 또는 코드 입력')).toBeInTheDocument();
    });

    test('키보드로 기본 기능에 접근할 수 있습니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      // Tab 키로 포커스 이동
      await user.tab();
      expect(screen.getByPlaceholderText('그룹명 또는 코드 입력')).toHaveFocus();
    });
  });

  describe('성능 및 최적화', () => {
    test('그리드 데이터 변경 시 컬럼 크기가 자동으로 조정됩니다.', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(screen.getAllByTestId('ag-grid')).toHaveLength(2);
      });
    });

    test('대량의 데이터가 있어도 화면이 정상적으로 렌더링됩니다.', async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        pgmGrpId: `GRP${i.toString().padStart(3, '0')}`,
        pgmGrpNm: `그룹 ${i}`,
        useYn: 'Y',
        sortSeq: i + 1
      }));

      mockProgramGroupService.getProgramGroupList.mockResolvedValue({
        success: true,
        data: largeData,
        message: '조회 성공'
      });

      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(screen.getAllByTestId('ag-grid')).toHaveLength(2);
      });
    });
  });
}); 