/**
 * SYS1012R00.test.tsx - 메뉴 미리보기 ?�업 ?�면 ?�스??
 * 
 * ?�스???�?? SYS1012R00.tsx
 * ?�스??범위: 메뉴 미리보기 ?�업??모든 주요 기능
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

describe('SYS1012R00 - 메뉴 미리보기 ?�업', () => {
  const mockMenuPreviewData = [
    {
      menuDspNm: '?�용?��?�?,
      pgmId: 'USR2010M00',
      menuShpDvcd: '1',
      hgrkMenuSeq: '0',
      menuSeq: '1',
      flag: 'Y',
      menuUseYn: 'Y',
      menuLvl: 1,
      mapTitle: '?�용?��?�?,
      children: [
        {
          menuDspNm: '?�용??목록',
          pgmId: 'USR2010M00',
          menuShpDvcd: '1',
          hgrkMenuSeq: '1',
          menuSeq: '1.1',
          flag: 'Y',
          menuUseYn: 'Y',
          menuLvl: 2,
          mapTitle: '?�용??목록',
          children: []
        },
        {
          menuDspNm: '?�용???�록',
          pgmId: 'USR2011M00',
          menuShpDvcd: '1',
          hgrkMenuSeq: '1',
          menuSeq: '1.2',
          flag: 'Y',
          menuUseYn: 'Y',
          menuLvl: 2,
          mapTitle: '?�용???�록',
          children: []
        }
      ]
    },
    {
      menuDspNm: '?�스?��?�?,
      pgmId: 'SYS1000M00',
      menuShpDvcd: '1',
      hgrkMenuSeq: '0',
      menuSeq: '2',
      flag: 'Y',
      menuUseYn: 'Y',
      menuLvl: 1,
      mapTitle: '?�스?��?�?,
      children: [
        {
          menuDspNm: '?�로그램관�?,
          pgmId: 'SYS1000M00',
          menuShpDvcd: '1',
          hgrkMenuSeq: '2',
          menuSeq: '2.1',
          flag: 'Y',
          menuUseYn: 'Y',
          menuLvl: 2,
          mapTitle: '?�로그램관�?,
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

  describe('?�면 ?�더�?, () => {
    test('메뉴 미리보기 ?�업???�상?�으�??�더링됩?�다.', async () => {
      render(<SYS1012R00 menuId="MENU001" />);
      expect(screen.getByText('메뉴 미리보기')).toBeInTheDocument();
    });
    test('?�리?� ?�세, 버튼???�상?�으�??�더링됩?�다.', () => {
      render(<SYS1012R00 menuId="MENU001" />);
      expect(screen.getByText('?�기')).toBeInTheDocument();
    });
  });

  describe('메뉴 ?�이??로드', () => {
    test('?�면 로드 ??메뉴 미리보기 ?�이?��? ?�동?�로 조회?�니??', async () => {
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(mockMenuService.getMenuPreview).toHaveBeenCalledWith('MENU001');
      });
    });

    test('메뉴 ?�이?��? 로드?�면 ?�리 구조�??�시?�니??', async () => {
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        // 최상??메뉴??
        expect(screen.getByText('?�용?��?�?)).toBeInTheDocument();
        expect(screen.getByText('?�스?��?�?)).toBeInTheDocument();
        
        // ?�위 메뉴??(초기?�는 ?�겨???�음)
        expect(screen.queryByText('?�용??목록')).not.toBeInTheDocument();
        expect(screen.queryByText('?�용???�록')).not.toBeInTheDocument();
      });
    });

    test('로딩 중에??로딩 ?�디케?�터가 ?�시?�니??', async () => {
      // 로딩 ?�태 ?��??�이??
      mockMenuService.getMenuPreview.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockMenuPreviewData), 100))
      );

      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByText('로딩 �?..')).toBeInTheDocument();
    });
  });

  describe('메뉴 ?�리 ?�장/축소', () => {
    test('?�장 버튼???�릭?�면 ?�위 메뉴가 ?�시?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        expect(screen.getByText('?�용??목록')).toBeInTheDocument();
        expect(screen.getByText('?�용???�록')).toBeInTheDocument();
      });
    });

    test('축소 버튼???�릭?�면 ?�위 메뉴가 ?�겨집니??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // 먼�? ?�장
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        expect(screen.getByText('?�용??목록')).toBeInTheDocument();
      });

      // 축소
      await waitFor(() => {
        const collapseButton = screen.getByTestId('collapse-button-0');
        user.click(collapseButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('?�용??목록')).not.toBeInTheDocument();
      });
    });

    test('?�체 ?�장 버튼???�릭?�면 모든 ?�위 메뉴가 ?�시?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      const expandAllButton = screen.getByTestId('expand-all-button');
      await user.click(expandAllButton);

      await waitFor(() => {
        expect(screen.getByText('?�용??목록')).toBeInTheDocument();
        expect(screen.getByText('?�용???�록')).toBeInTheDocument();
        expect(screen.getByText('?�로그램관�?)).toBeInTheDocument();
      });
    });

    test('?�체 축소 버튼???�릭?�면 모든 ?�위 메뉴가 ?�겨집니??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // 먼�? ?�체 ?�장
      const expandAllButton = screen.getByTestId('expand-all-button');
      await user.click(expandAllButton);

      await waitFor(() => {
        expect(screen.getByText('?�용??목록')).toBeInTheDocument();
      });

      // ?�체 축소
      const collapseAllButton = screen.getByTestId('collapse-all-button');
      await user.click(collapseAllButton);

      await waitFor(() => {
        expect(screen.queryByText('?�용??목록')).not.toBeInTheDocument();
        expect(screen.queryByText('?�로그램관�?)).not.toBeInTheDocument();
      });
    });
  });

  describe('메뉴 ?�택', () => {
    test('메뉴�??�릭?�면 ?�당 메뉴가 ?�택?�고 ?�세 ?�보가 ?�시?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('?�용?��?�?);
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('selected-menu-name')).toHaveTextContent('?�용?��?�?);
        expect(screen.getByTestId('selected-menu-program')).toHaveTextContent('USR2010M00');
        expect(screen.getByTestId('selected-menu-level')).toHaveTextContent('1');
      });
    });

    test('?�위 메뉴�??�릭?�면 ?�당 메뉴???�세 ?�보가 ?�시?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // 먼�? ?�장
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        const subMenuItem = screen.getByText('?�용??목록');
        user.click(subMenuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('selected-menu-name')).toHaveTextContent('?�용??목록');
        expect(screen.getByTestId('selected-menu-program')).toHaveTextContent('USR2010M00');
        expect(screen.getByTestId('selected-menu-level')).toHaveTextContent('2');
      });
    });

    test('?�택??메뉴???�각?�으�?강조 ?�시?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('?�용?��?�?);
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByText('?�용?��?�?)).toHaveClass('selected');
      });
    });
  });

  describe('메뉴 ?�세 ?�보', () => {
    test('메뉴�??�택?�면 ?�세 ?�보 ?�널???�보가 ?�시?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('?�용?��?�?);
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('detail-section')).toBeInTheDocument();
        expect(screen.getByText('메뉴�? ?�용?��?�?)).toBeInTheDocument();
        expect(screen.getByText('?�로그램 ID: USR2010M00')).toBeInTheDocument();
        expect(screen.getByText('메뉴 ?�벨: 1')).toBeInTheDocument();
        expect(screen.getByText('?�용 ?��?: ?�용')).toBeInTheDocument();
      });
    });

    test('메뉴�??�로그램 ?�보가 ?�상?�으�??�시?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('?�용?��?�?);
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('program-info-section')).toBeInTheDocument();
        expect(screen.getByText('?�결???�로그램')).toBeInTheDocument();
      });
    });
  });

  describe('?�업 ?�기', () => {
    test('?�기 버튼???�릭?�면 ?�업???�힙?�다.', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      render(<SYS1012R00 menuId="MENU001" onClose={mockOnClose} />);

      const closeButton = screen.getByTestId('close-button');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('ESC ?��? ?�르�??�업???�힙?�다.', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      render(<SYS1012R00 menuId="MENU001" onClose={mockOnClose} />);

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('검�?�??�러 처리', () => {
    test('메뉴 ID가 ?�으�??�러 메시지가 ?�시?�니??', async () => {
      render(<SYS1012R00 />);

      await waitFor(() => {
        expect(screen.getByText('메뉴 ID가 ?�요?�니??')).toBeInTheDocument();
      });
    });

    test('API ?�출 ?�패 ???�러 메시지가 ?�시?�니??', async () => {
      mockMenuService.getMenuPreview.mockRejectedValue(new Error('API ?�류'));

      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(screen.getByText('메뉴 미리보기 조회 ?�패: API ?�류')).toBeInTheDocument();
      });
    });

    test('?�트?�크 ?�류 ???�절???�러 메시지가 ?�시?�니??', async () => {
      mockMenuService.getMenuPreview.mockRejectedValue(new Error('Network Error'));

      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(screen.getByText('메뉴 미리보기 조회 ?�패: Network Error')).toBeInTheDocument();
      });
    });

    test('메뉴 ?�이?��? 비어?�을 ???�절??메시지가 ?�시?�니??', async () => {
      mockMenuService.getMenuPreview.mockResolvedValue([]);

      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(screen.getByText('?�시??메뉴가 ?�습?�다.')).toBeInTheDocument();
      });
    });
  });

  describe('?�근??, () => {
    test('모든 메뉴 ??��???�절??aria-label???�정?�어 ?�습?�다.', () => {
      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByLabelText('?�용?��?�?메뉴')).toBeInTheDocument();
      expect(screen.getByLabelText('?�스?��?�?메뉴')).toBeInTheDocument();
    });

    test('?�보?�로 모든 기능???�근?????�습?�다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // Tab ?�로 ?�커???�동
      await user.tab();
      expect(screen.getByTestId('expand-all-button')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('collapse-all-button')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('close-button')).toHaveFocus();
    });

    test('?�크�?리더 ?�용?��? ?�한 ?�절??ARIA ?�성???�정?�어 ?�습?�다.', () => {
      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByTestId('menu-tree')).toHaveAttribute('role', 'tree');
      expect(screen.getByTestId('detail-section')).toHaveAttribute('role', 'region');
    });
  });

  describe('?�능 �?최적??, () => {
    test('?�?�의 메뉴 ?�이?��? ?�어???�면???�상?�으�??�더링됩?�다.', async () => {
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

    test('메뉴 ?�리 ?�장/축소 ???�능??최적?�되???�습?�다.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // 빠르�??�러 �??�장/축소
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
        user.click(expandButton);
        user.click(expandButton);
      });

      // ?�능 문제 ?�이 ?�상 ?�동?�는지 ?�인
      await waitFor(() => {
        expect(screen.getByTestId('menu-tree')).toBeInTheDocument();
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

      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByTestId('menu-tree-section')).toBeInTheDocument();
      expect(screen.getByTestId('menu-detail-section')).toBeInTheDocument();
    });
  });

  describe('�?��??, () => {
    test('?�국???�스?��? ?�상?�으�??�시?�니??', () => {
      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByText('메뉴 미리보기')).toBeInTheDocument();
      expect(screen.getByText('?�체 ?�장')).toBeInTheDocument();
      expect(screen.getByText('?�체 축소')).toBeInTheDocument();
      expect(screen.getByText('?�기')).toBeInTheDocument();
    });
  });

  describe('메뉴 계층 구조', () => {
    test('메뉴??계층 구조가 ?�바르게 ?�시?�니??', async () => {
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        // 최상??메뉴??
        expect(screen.getByText('?�용?��?�?)).toBeInTheDocument();
        expect(screen.getByText('?�스?��?�?)).toBeInTheDocument();
        
        // 계층 구조 ?�인
        const userManagementItem = screen.getByText('?�용?��?�?).closest('[data-testid="menu-item"]');
        const systemManagementItem = screen.getByText('?�스?��?�?).closest('[data-testid="menu-item"]');
        
        expect(userManagementItem).toHaveAttribute('data-level', '1');
        expect(systemManagementItem).toHaveAttribute('data-level', '1');
      });
    });

    test('?�위 메뉴???�여?�기가 ?�바르게 ?�용?�니??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // ?�장
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        const subMenuItem = screen.getByText('?�용??목록').closest('[data-testid="menu-item"]');
        expect(subMenuItem).toHaveAttribute('data-level', '2');
      });
    });
  });
}); 

