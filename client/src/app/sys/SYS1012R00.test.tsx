/**
 * SYS1012R00.test.tsx - ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?ì—… ?”ë©´ ?ŒìŠ¤??
 * 
 * ?ŒìŠ¤???€?? SYS1012R00.tsx
 * ?ŒìŠ¤??ë²”ìœ„: ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?ì—…??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥
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

describe('SYS1012R00 - ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?ì—…', () => {
  const mockMenuPreviewData = [
    {
      menuDspNm: '?¬ìš©?ê?ë¦?,
      pgmId: 'USR2010M00',
      menuShpDvcd: '1',
      hgrkMenuSeq: '0',
      menuSeq: '1',
      flag: 'Y',
      menuUseYn: 'Y',
      menuLvl: 1,
      mapTitle: '?¬ìš©?ê?ë¦?,
      children: [
        {
          menuDspNm: '?¬ìš©??ëª©ë¡',
          pgmId: 'USR2010M00',
          menuShpDvcd: '1',
          hgrkMenuSeq: '1',
          menuSeq: '1.1',
          flag: 'Y',
          menuUseYn: 'Y',
          menuLvl: 2,
          mapTitle: '?¬ìš©??ëª©ë¡',
          children: []
        },
        {
          menuDspNm: '?¬ìš©???±ë¡',
          pgmId: 'USR2011M00',
          menuShpDvcd: '1',
          hgrkMenuSeq: '1',
          menuSeq: '1.2',
          flag: 'Y',
          menuUseYn: 'Y',
          menuLvl: 2,
          mapTitle: '?¬ìš©???±ë¡',
          children: []
        }
      ]
    },
    {
      menuDspNm: '?œìŠ¤?œê?ë¦?,
      pgmId: 'SYS1000M00',
      menuShpDvcd: '1',
      hgrkMenuSeq: '0',
      menuSeq: '2',
      flag: 'Y',
      menuUseYn: 'Y',
      menuLvl: 1,
      mapTitle: '?œìŠ¤?œê?ë¦?,
      children: [
        {
          menuDspNm: '?„ë¡œê·¸ë¨ê´€ë¦?,
          pgmId: 'SYS1000M00',
          menuShpDvcd: '1',
          hgrkMenuSeq: '2',
          menuSeq: '2.1',
          flag: 'Y',
          menuUseYn: 'Y',
          menuLvl: 2,
          mapTitle: '?„ë¡œê·¸ë¨ê´€ë¦?,
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

  describe('?”ë©´ ?Œë”ë§?, () => {
    test('ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?ì—…???•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', async () => {
      render(<SYS1012R00 menuId="MENU001" />);
      expect(screen.getByText('ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸°')).toBeInTheDocument();
    });
    test('?¸ë¦¬?€ ?ì„¸, ë²„íŠ¼???•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', () => {
      render(<SYS1012R00 menuId="MENU001" />);
      expect(screen.getByText('?«ê¸°')).toBeInTheDocument();
    });
  });

  describe('ë©”ë‰´ ?°ì´??ë¡œë“œ', () => {
    test('?”ë©´ ë¡œë“œ ??ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?°ì´?°ê? ?ë™?¼ë¡œ ì¡°íšŒ?©ë‹ˆ??', async () => {
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(mockMenuService.getMenuPreview).toHaveBeenCalledWith('MENU001');
      });
    });

    test('ë©”ë‰´ ?°ì´?°ê? ë¡œë“œ?˜ë©´ ?¸ë¦¬ êµ¬ì¡°ë¡??œì‹œ?©ë‹ˆ??', async () => {
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        // ìµœìƒ??ë©”ë‰´??
        expect(screen.getByText('?¬ìš©?ê?ë¦?)).toBeInTheDocument();
        expect(screen.getByText('?œìŠ¤?œê?ë¦?)).toBeInTheDocument();
        
        // ?˜ìœ„ ë©”ë‰´??(ì´ˆê¸°?ëŠ” ?¨ê²¨???ˆìŒ)
        expect(screen.queryByText('?¬ìš©??ëª©ë¡')).not.toBeInTheDocument();
        expect(screen.queryByText('?¬ìš©???±ë¡')).not.toBeInTheDocument();
      });
    });

    test('ë¡œë”© ì¤‘ì—??ë¡œë”© ?¸ë””ì¼€?´í„°ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      // ë¡œë”© ?íƒœ ?œë??ˆì´??
      mockMenuService.getMenuPreview.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockMenuPreviewData), 100))
      );

      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByText('ë¡œë”© ì¤?..')).toBeInTheDocument();
    });
  });

  describe('ë©”ë‰´ ?¸ë¦¬ ?•ì¥/ì¶•ì†Œ', () => {
    test('?•ì¥ ë²„íŠ¼???´ë¦­?˜ë©´ ?˜ìœ„ ë©”ë‰´ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        expect(screen.getByText('?¬ìš©??ëª©ë¡')).toBeInTheDocument();
        expect(screen.getByText('?¬ìš©???±ë¡')).toBeInTheDocument();
      });
    });

    test('ì¶•ì†Œ ë²„íŠ¼???´ë¦­?˜ë©´ ?˜ìœ„ ë©”ë‰´ê°€ ?¨ê²¨ì§‘ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // ë¨¼ì? ?•ì¥
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        expect(screen.getByText('?¬ìš©??ëª©ë¡')).toBeInTheDocument();
      });

      // ì¶•ì†Œ
      await waitFor(() => {
        const collapseButton = screen.getByTestId('collapse-button-0');
        user.click(collapseButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('?¬ìš©??ëª©ë¡')).not.toBeInTheDocument();
      });
    });

    test('?„ì²´ ?•ì¥ ë²„íŠ¼???´ë¦­?˜ë©´ ëª¨ë“  ?˜ìœ„ ë©”ë‰´ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      const expandAllButton = screen.getByTestId('expand-all-button');
      await user.click(expandAllButton);

      await waitFor(() => {
        expect(screen.getByText('?¬ìš©??ëª©ë¡')).toBeInTheDocument();
        expect(screen.getByText('?¬ìš©???±ë¡')).toBeInTheDocument();
        expect(screen.getByText('?„ë¡œê·¸ë¨ê´€ë¦?)).toBeInTheDocument();
      });
    });

    test('?„ì²´ ì¶•ì†Œ ë²„íŠ¼???´ë¦­?˜ë©´ ëª¨ë“  ?˜ìœ„ ë©”ë‰´ê°€ ?¨ê²¨ì§‘ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // ë¨¼ì? ?„ì²´ ?•ì¥
      const expandAllButton = screen.getByTestId('expand-all-button');
      await user.click(expandAllButton);

      await waitFor(() => {
        expect(screen.getByText('?¬ìš©??ëª©ë¡')).toBeInTheDocument();
      });

      // ?„ì²´ ì¶•ì†Œ
      const collapseAllButton = screen.getByTestId('collapse-all-button');
      await user.click(collapseAllButton);

      await waitFor(() => {
        expect(screen.queryByText('?¬ìš©??ëª©ë¡')).not.toBeInTheDocument();
        expect(screen.queryByText('?„ë¡œê·¸ë¨ê´€ë¦?)).not.toBeInTheDocument();
      });
    });
  });

  describe('ë©”ë‰´ ? íƒ', () => {
    test('ë©”ë‰´ë¥??´ë¦­?˜ë©´ ?´ë‹¹ ë©”ë‰´ê°€ ? íƒ?˜ê³  ?ì„¸ ?•ë³´ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('?¬ìš©?ê?ë¦?);
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('selected-menu-name')).toHaveTextContent('?¬ìš©?ê?ë¦?);
        expect(screen.getByTestId('selected-menu-program')).toHaveTextContent('USR2010M00');
        expect(screen.getByTestId('selected-menu-level')).toHaveTextContent('1');
      });
    });

    test('?˜ìœ„ ë©”ë‰´ë¥??´ë¦­?˜ë©´ ?´ë‹¹ ë©”ë‰´???ì„¸ ?•ë³´ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // ë¨¼ì? ?•ì¥
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        const subMenuItem = screen.getByText('?¬ìš©??ëª©ë¡');
        user.click(subMenuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('selected-menu-name')).toHaveTextContent('?¬ìš©??ëª©ë¡');
        expect(screen.getByTestId('selected-menu-program')).toHaveTextContent('USR2010M00');
        expect(screen.getByTestId('selected-menu-level')).toHaveTextContent('2');
      });
    });

    test('? íƒ??ë©”ë‰´???œê°?ìœ¼ë¡?ê°•ì¡° ?œì‹œ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('?¬ìš©?ê?ë¦?);
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByText('?¬ìš©?ê?ë¦?)).toHaveClass('selected');
      });
    });
  });

  describe('ë©”ë‰´ ?ì„¸ ?•ë³´', () => {
    test('ë©”ë‰´ë¥?? íƒ?˜ë©´ ?ì„¸ ?•ë³´ ?¨ë„???•ë³´ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('?¬ìš©?ê?ë¦?);
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('detail-section')).toBeInTheDocument();
        expect(screen.getByText('ë©”ë‰´ëª? ?¬ìš©?ê?ë¦?)).toBeInTheDocument();
        expect(screen.getByText('?„ë¡œê·¸ë¨ ID: USR2010M00')).toBeInTheDocument();
        expect(screen.getByText('ë©”ë‰´ ?ˆë²¨: 1')).toBeInTheDocument();
        expect(screen.getByText('?¬ìš© ?¬ë?: ?¬ìš©')).toBeInTheDocument();
      });
    });

    test('ë©”ë‰´ë³??„ë¡œê·¸ë¨ ?•ë³´ê°€ ?•ìƒ?ìœ¼ë¡??œì‹œ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        const menuItem = screen.getByText('?¬ìš©?ê?ë¦?);
        user.click(menuItem);
      });

      await waitFor(() => {
        expect(screen.getByTestId('program-info-section')).toBeInTheDocument();
        expect(screen.getByText('?°ê²°???„ë¡œê·¸ë¨')).toBeInTheDocument();
      });
    });
  });

  describe('?ì—… ?«ê¸°', () => {
    test('?«ê¸° ë²„íŠ¼???´ë¦­?˜ë©´ ?ì—…???«í™?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      render(<SYS1012R00 menuId="MENU001" onClose={mockOnClose} />);

      const closeButton = screen.getByTestId('close-button');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('ESC ?¤ë? ?„ë¥´ë©??ì—…???«í™?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      render(<SYS1012R00 menuId="MENU001" onClose={mockOnClose} />);

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('ê²€ì¦?ë°??ëŸ¬ ì²˜ë¦¬', () => {
    test('ë©”ë‰´ IDê°€ ?†ìœ¼ë©??ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      render(<SYS1012R00 />);

      await waitFor(() => {
        expect(screen.getByText('ë©”ë‰´ IDê°€ ?„ìš”?©ë‹ˆ??')).toBeInTheDocument();
      });
    });

    test('API ?¸ì¶œ ?¤íŒ¨ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      mockMenuService.getMenuPreview.mockRejectedValue(new Error('API ?¤ë¥˜'));

      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(screen.getByText('ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ì¡°íšŒ ?¤íŒ¨: API ?¤ë¥˜')).toBeInTheDocument();
      });
    });

    test('?¤íŠ¸?Œí¬ ?¤ë¥˜ ???ì ˆ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      mockMenuService.getMenuPreview.mockRejectedValue(new Error('Network Error'));

      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(screen.getByText('ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ì¡°íšŒ ?¤íŒ¨: Network Error')).toBeInTheDocument();
      });
    });

    test('ë©”ë‰´ ?°ì´?°ê? ë¹„ì–´?ˆì„ ???ì ˆ??ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      mockMenuService.getMenuPreview.mockResolvedValue([]);

      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(screen.getByText('?œì‹œ??ë©”ë‰´ê°€ ?†ìŠµ?ˆë‹¤.')).toBeInTheDocument();
      });
    });
  });

  describe('?‘ê·¼??, () => {
    test('ëª¨ë“  ë©”ë‰´ ??ª©???ì ˆ??aria-label???¤ì •?˜ì–´ ?ˆìŠµ?ˆë‹¤.', () => {
      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByLabelText('?¬ìš©?ê?ë¦?ë©”ë‰´')).toBeInTheDocument();
      expect(screen.getByLabelText('?œìŠ¤?œê?ë¦?ë©”ë‰´')).toBeInTheDocument();
    });

    test('?¤ë³´?œë¡œ ëª¨ë“  ê¸°ëŠ¥???‘ê·¼?????ˆìŠµ?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // Tab ?¤ë¡œ ?¬ì»¤???´ë™
      await user.tab();
      expect(screen.getByTestId('expand-all-button')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('collapse-all-button')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('close-button')).toHaveFocus();
    });

    test('?¤í¬ë¦?ë¦¬ë” ?¬ìš©?ë? ?„í•œ ?ì ˆ??ARIA ?ì„±???¤ì •?˜ì–´ ?ˆìŠµ?ˆë‹¤.', () => {
      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByTestId('menu-tree')).toHaveAttribute('role', 'tree');
      expect(screen.getByTestId('detail-section')).toHaveAttribute('role', 'region');
    });
  });

  describe('?±ëŠ¥ ë°?ìµœì ??, () => {
    test('?€?‰ì˜ ë©”ë‰´ ?°ì´?°ê? ?ˆì–´???”ë©´???•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', async () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        menuDspNm: `ë©”ë‰´ ${i}`,
        pgmId: `PGM${i.toString().padStart(3, '0')}`,
        menuShpDvcd: '1',
        hgrkMenuSeq: '0',
        menuSeq: (i + 1).toString(),
        flag: 'Y',
        menuUseYn: 'Y',
        menuLvl: 1,
        mapTitle: `ë©”ë‰´ ${i}`,
        children: []
      }));

      mockMenuService.getMenuPreview.mockResolvedValue(largeData);

      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        expect(screen.getByTestId('menu-tree')).toBeInTheDocument();
      });
    });

    test('ë©”ë‰´ ?¸ë¦¬ ?•ì¥/ì¶•ì†Œ ???±ëŠ¥??ìµœì ?”ë˜???ˆìŠµ?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // ë¹ ë¥´ê²??¬ëŸ¬ ë²??•ì¥/ì¶•ì†Œ
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
        user.click(expandButton);
        user.click(expandButton);
      });

      // ?±ëŠ¥ ë¬¸ì œ ?†ì´ ?•ìƒ ?‘ë™?˜ëŠ”ì§€ ?•ì¸
      await waitFor(() => {
        expect(screen.getByTestId('menu-tree')).toBeInTheDocument();
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

      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByTestId('menu-tree-section')).toBeInTheDocument();
      expect(screen.getByTestId('menu-detail-section')).toBeInTheDocument();
    });
  });

  describe('êµ? œ??, () => {
    test('?œêµ­???ìŠ¤?¸ê? ?•ìƒ?ìœ¼ë¡??œì‹œ?©ë‹ˆ??', () => {
      render(<SYS1012R00 menuId="MENU001" />);

      expect(screen.getByText('ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸°')).toBeInTheDocument();
      expect(screen.getByText('?„ì²´ ?•ì¥')).toBeInTheDocument();
      expect(screen.getByText('?„ì²´ ì¶•ì†Œ')).toBeInTheDocument();
      expect(screen.getByText('?«ê¸°')).toBeInTheDocument();
    });
  });

  describe('ë©”ë‰´ ê³„ì¸µ êµ¬ì¡°', () => {
    test('ë©”ë‰´??ê³„ì¸µ êµ¬ì¡°ê°€ ?¬ë°”ë¥´ê²Œ ?œì‹œ?©ë‹ˆ??', async () => {
      render(<SYS1012R00 menuId="MENU001" />);

      await waitFor(() => {
        // ìµœìƒ??ë©”ë‰´??
        expect(screen.getByText('?¬ìš©?ê?ë¦?)).toBeInTheDocument();
        expect(screen.getByText('?œìŠ¤?œê?ë¦?)).toBeInTheDocument();
        
        // ê³„ì¸µ êµ¬ì¡° ?•ì¸
        const userManagementItem = screen.getByText('?¬ìš©?ê?ë¦?).closest('[data-testid="menu-item"]');
        const systemManagementItem = screen.getByText('?œìŠ¤?œê?ë¦?).closest('[data-testid="menu-item"]');
        
        expect(userManagementItem).toHaveAttribute('data-level', '1');
        expect(systemManagementItem).toHaveAttribute('data-level', '1');
      });
    });

    test('?˜ìœ„ ë©”ë‰´???¤ì—¬?°ê¸°ê°€ ?¬ë°”ë¥´ê²Œ ?ìš©?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1012R00 menuId="MENU001" />);

      // ?•ì¥
      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button-0');
        user.click(expandButton);
      });

      await waitFor(() => {
        const subMenuItem = screen.getByText('?¬ìš©??ëª©ë¡').closest('[data-testid="menu-item"]');
        expect(subMenuItem).toHaveAttribute('data-level', '2');
      });
    });
  });
}); 

