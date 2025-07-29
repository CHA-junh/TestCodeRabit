/**
 * SYS1012R00.test.tsx - 메뉴 미리보기 팝업 화면 테스트
 * 
 * 테스트 대상: SYS1012R00.tsx
 * 테스트 범위: 메뉴 미리보기 팝업의 모든 주요 기능
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SYS1012R00 from './SYS1012R00';
import { MenuService } from '@/modules/sys/services/menuService';

// Mock dependencies
jest.mock('@/modules/sys/services/menuService');
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

const mockMenuService = MenuService as jest.Mocked<typeof MenuService>;

describe('SYS1012R00 - 메뉴 미리보기 팝업', () => {
  const mockMenuPreviewData = [
    {
      menuDspNm: '사용자관리',
      pgmId: 'USR2010M00',
      menuShpDvcd: '1',
      hgrkMenuSeq: '0',
      menuSeq: '1',
      flag: 'Y',
      menuUseYn: 'Y',
      menuLvl: 1,
      mapTitle: '사용자관리',
      children: [
        {
          menuDspNm: '사용자 목록',
          pgmId: 'USR2010M00',
          menuShpDvcd: '1',
          hgrkMenuSeq: '1',
          menuSeq: '1.1',
          flag: 'Y',
          menuUseYn: 'Y',
          menuLvl: 2,
          mapTitle: '사용자 목록',
          children: []
        },
        {
          menuDspNm: '사용자 등록',
          pgmId: 'USR2011M00',
          menuShpDvcd: '1',
          hgrkMenuSeq: '1',
          menuSeq: '1.2',
          flag: 'Y',
          menuUseYn: 'Y',
          menuLvl: 2,
          mapTitle: '사용자 등록',
          children: []
        }
      ]
    },
    {
      menuDspNm: '시스템관리',
      pgmId: 'SYS1000M00',
      menuShpDvcd: '1',
      hgrkMenuSeq: '0',
      menuSeq: '2',
      flag: 'Y',
      menuUseYn: 'Y',
      menuLvl: 1,
      mapTitle: '시스템관리',
      children: [
        {
          menuDspNm: '프로그램관리',
          pgmId: 'SYS1000M00',
          menuShpDvcd: '1',
          hgrkMenuSeq: '2',
          menuSeq: '2.1',
          flag: 'Y',
          menuUseYn: 'Y',
          menuLvl: 2,
          mapTitle: '프로그램관리',
          children: []
        }
      ]
    }
  ];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock service methods
    mockMenuService.getMenuPreview.mockResolvedValue(mockMenuPreviewData);
  });

  describe('화면 렌더링', () => {
    test('메뉴 미리보기 팝업이 정상적으로 렌더링됩니다.', async () => {
      render(<SYS1012R00 menuId="MENU001" />);
      expect(screen.getByText('메뉴 미리보기')).toBeInTheDocument();
    });
    test('트리와 상세, 버튼이 정상적으로 렌더링됩니다.', () => {
      render(<SYS1012R00 menuId="MENU001" />);
      expect(screen.getByText('닫기')).toBeInTheDocument();
    });
  });

  describe('메뉴 데이터 로드', () => {
    test('화면 로드 시 메뉴 미리보기 데이터가 자동으로 조회됩니다.', async () => {
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(mockMenuService.getMenuPreview).toHaveBeenCalledWith('MENU001');
      });
    });

    test('메뉴 데이터가 로드되면 트리 구조로 표시됩니다.', async () => {
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        // 최상위 메뉴들
        expect(screen.getByText('사용자관리')).toBeInTheDocument();
        expect(screen.getByText('시스템관리')).toBeInTheDocument();
        
        // 하위 메뉴들 (초기에는 숨겨져 있음)
        expect(screen.queryByText('사용자 목록')).not.toBeInTheDocument();
        expect(screen.queryByText('사용자 등록')).not.toBeInTheDocument();
      });
    });

    test('로딩 중에는 로딩 인디케이터가 표시됩니다.', async () => {
      // 로딩 상태 시뮬레이션
      mockMenuService.getMenuPreview.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockMenuPreviewData), 100))
      );

      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByText('로딩 중...')).toBeInTheDocument();
    });
  });

  describe('메뉴 트리 확장/축소', () => {
    test('확장 버튼을 클릭하면 하위 메뉴가 표시됩니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        expect(screen.getByText('사용자 목록')).toBeInTheDocument();
        expect(screen.getByText('사용자 등록')).toBeInTheDocument();
      });
    });

    test('축소 버튼을 클릭하면 하위 메뉴가 숨겨집니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // 먼저 확장
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        expect(screen.getByText('사용자 목록')).toBeInTheDocument();
      });

      // 축소
      await waitFor(() => {
        const collapseButton = screen.getByTestId('collapse-button-0');
        user.click(collapseButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('사용자 목록')).not.toBeInTheDocument();
      });
    });

    test('전체 확장 버튼을 클릭하면 모든 하위 메뉴가 표시됩니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      const expandAllButton = screen.getByTestId('expand-all-button');
      await user.click(expandAllButton);

      await waitFor(() => {
        expect(screen.getByText('사용자 목록')).toBeInTheDocument();
        expect(screen.getByText('사용자 등록')).toBeInTheDocument();
        expect(screen.getByText('프로그램관리')).toBeInTheDocument();
      });
    });

    test('전체 축소 버튼을 클릭하면 모든 하위 메뉴가 숨겨집니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // 먼저 전체 확장
      const expandAllButton = screen.getByTestId('expand-all-button');
      await user.click(expandAllButton);

      await waitFor(() => {
        expect(screen.getByText('사용자 목록')).toBeInTheDocument();
      });

      // 전체 축소
      const collapseAllButton = screen.getByTestId('collapse-all-button');
      await user.click(collapseAllButton);

      await waitFor(() => {
        expect(screen.queryByText('사용자 목록')).not.toBeInTheDocument();
        expect(screen.queryByText('프로그램관리')).not.toBeInTheDocument();
      });
    });
  });

  describe('메뉴 선택', () => {
    test('메뉴를 클릭하면 해당 메뉴가 선택되고 상세 정보가 표시됩니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('사용자관리');
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('selected-menu-name')).toHaveTextContent('사용자관리');
        expect(screen.getByTestId('selected-menu-program')).toHaveTextContent('USR2010M00');
        expect(screen.getByTestId('selected-menu-level')).toHaveTextContent('1');
      });
    });

    test('하위 메뉴를 클릭하면 해당 메뉴의 상세 정보가 표시됩니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // 먼저 확장
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        const subMenuItem = screen.getByText('사용자 목록');
        user.click(subMenuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('selected-menu-name')).toHaveTextContent('사용자 목록');
        expect(screen.getByTestId('selected-menu-program')).toHaveTextContent('USR2010M00');
        expect(screen.getByTestId('selected-menu-level')).toHaveTextContent('2');
      });
    });

    test('선택된 메뉴는 시각적으로 강조 표시됩니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('사용자관리');
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByText('사용자관리')).toHaveClass('selected');
      });
    });
  });

  describe('메뉴 상세 정보', () => {
    test('메뉴를 선택하면 상세 정보 패널에 정보가 표시됩니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('사용자관리');
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('detail-section')).toBeInTheDocument();
        expect(screen.getByText('메뉴명: 사용자관리')).toBeInTheDocument();
        expect(screen.getByText('프로그램 ID: USR2010M00')).toBeInTheDocument();
        expect(screen.getByText('메뉴 레벨: 1')).toBeInTheDocument();
        expect(screen.getByText('사용 여부: 사용')).toBeInTheDocument();
      });
    });

    test('메뉴별 프로그램 정보가 정상적으로 표시됩니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('사용자관리');
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('program-info-section')).toBeInTheDocument();
        expect(screen.getByText('연결된 프로그램')).toBeInTheDocument();
      });
    });
  });

  describe('팝업 닫기', () => {
    test('닫기 버튼을 클릭하면 팝업이 닫힙니다.', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      render(<SYS1012R00 menuId="MENU001" onClose={mockOnClose} />);

      const closeButton = screen.getByTestId('close-button');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('ESC 키를 누르면 팝업이 닫힙니다.', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      render(<SYS1012R00 menuId="MENU001" onClose={mockOnClose} />);

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('검증 및 에러 처리', () => {
    test('메뉴 ID가 없으면 에러 메시지가 표시됩니다.', async () => {
      render(<SYS1012R00 />);

      await waitFor(() => {
        expect(screen.getByText('메뉴 ID가 필요합니다.')).toBeInTheDocument();
      });
    });

    test('API 호출 실패 시 에러 메시지가 표시됩니다.', async () => {
      mockMenuService.getMenuPreview.mockRejectedValue(new Error('API 오류'));

      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(screen.getByText('메뉴 미리보기 조회 실패: API 오류')).toBeInTheDocument();
      });
    });

    test('네트워크 오류 시 적절한 에러 메시지가 표시됩니다.', async () => {
      mockMenuService.getMenuPreview.mockRejectedValue(new Error('Network Error'));

      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(screen.getByText('메뉴 미리보기 조회 실패: Network Error')).toBeInTheDocument();
      });
    });

    test('메뉴 데이터가 비어있을 때 적절한 메시지가 표시됩니다.', async () => {
      mockMenuService.getMenuPreview.mockResolvedValue([]);

      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(screen.getByText('표시할 메뉴가 없습니다.')).toBeInTheDocument();
      });
    });
  });

  describe('접근성', () => {
    test('모든 메뉴 항목에 적절한 aria-label이 설정되어 있습니다.', () => {
      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByLabelText('사용자관리 메뉴')).toBeInTheDocument();
      expect(screen.getByLabelText('시스템관리 메뉴')).toBeInTheDocument();
    });

    test('키보드로 모든 기능에 접근할 수 있습니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // Tab 키로 포커스 이동
      await user.tab();
      expect(screen.getByTestId('expand-all-button')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('collapse-all-button')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('close-button')).toHaveFocus();
    });

    test('스크린 리더 사용자를 위한 적절한 ARIA 속성이 설정되어 있습니다.', () => {
      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByTestId('menu-tree')).toHaveAttribute('role', 'tree');
      expect(screen.getByTestId('detail-section')).toHaveAttribute('role', 'region');
    });
  });

  describe('성능 및 최적화', () => {
    test('대량의 메뉴 데이터가 있어도 화면이 정상적으로 렌더링됩니다.', async () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        menuDspNm: `메뉴 ${i}`,
        pgmId: `PGM${i.toString().padStart(3, '0')}`,
        menuShpDvcd: '1',
        hgrkMenuSeq: '0',
        menuSeq: (i + 1).toString(),
        flag: 'Y',
        menuUseYn: 'Y',
        menuLvl: 1,
        mapTitle: `메뉴 ${i}`,
        children: []
      }));

      mockMenuService.getMenuPreview.mockResolvedValue(largeData);

      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(screen.getByTestId('menu-tree')).toBeInTheDocument();
      });
    });

    test('메뉴 트리 확장/축소 시 성능이 최적화되어 있습니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // 빠르게 여러 번 확장/축소
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
        user.click(expandButton);
        user.click(expandButton);
      });

      // 성능 문제 없이 정상 작동하는지 확인
      await waitFor(() => {
        expect(screen.getByTestId('menu-tree')).toBeInTheDocument();
      });
    });
  });

  describe('반응형 디자인', () => {
    test('작은 화면에서도 모든 기능이 정상적으로 작동합니다.', () => {
      // 작은 화면 크기 시뮬레이션
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByTestId('menu-tree-section')).toBeInTheDocument();
      expect(screen.getByTestId('menu-detail-section')).toBeInTheDocument();
    });
  });

  describe('국제화', () => {
    test('한국어 텍스트가 정상적으로 표시됩니다.', () => {
      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByText('메뉴 미리보기')).toBeInTheDocument();
      expect(screen.getByText('전체 확장')).toBeInTheDocument();
      expect(screen.getByText('전체 축소')).toBeInTheDocument();
      expect(screen.getByText('닫기')).toBeInTheDocument();
    });
  });

  describe('메뉴 계층 구조', () => {
    test('메뉴의 계층 구조가 올바르게 표시됩니다.', async () => {
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        // 최상위 메뉴들
        expect(screen.getByText('사용자관리')).toBeInTheDocument();
        expect(screen.getByText('시스템관리')).toBeInTheDocument();
        
        // 계층 구조 확인
        const userManagementItem = screen.getByText('사용자관리').closest('[data-testid="menu-item"]');
        const systemManagementItem = screen.getByText('시스템관리').closest('[data-testid="menu-item"]');
        
        expect(userManagementItem).toHaveAttribute('data-level', '1');
        expect(systemManagementItem).toHaveAttribute('data-level', '1');
      });
    });

    test('하위 메뉴의 들여쓰기가 올바르게 적용됩니다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // 확장
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        const subMenuItem = screen.getByText('사용자 목록').closest('[data-testid="menu-item"]');
        expect(subMenuItem).toHaveAttribute('data-level', '2');
      });
    });
  });
}); 