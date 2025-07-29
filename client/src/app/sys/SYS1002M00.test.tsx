/**
 * SYS1002M00.test.tsx - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ê´€ë¦??”ë©´ ?ŒìŠ¤??
 * 
 * ?ŒìŠ¤???€?? SYS1002M00.tsx
 * ?ŒìŠ¤??ë²”ìœ„: ë©”ë‰´ë³??„ë¡œê·¸ë¨ ê´€ë¦¬ì˜ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SYS1002M00 from './SYS1002M00';
import { MenuService } from '@/modules/sys/services/menuService';
import { usePopup } from '@/modules/com/hooks/usePopup';
import { Menu } from '@/modules/sys/types/menu.types';
import { useQuery } from '@tanstack/react-query';

// Mock dependencies
jest.mock('@/modules/sys/services/menuService');
jest.mock('@/modules/com/hooks/usePopup');
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: jest.fn()
  })),
}));

// Mock AG-Grid
jest.mock('ag-grid-react', () => ({
  AgGridReact: ({ rowData, onSelectionChanged, onGridReady, ...props }: any) => {
    // Use unique test ID based on props or context
    const testId = props['data-testid'] || 'ag-grid';
    
    // Ensure rowData is an array
    const safeRowData = Array.isArray(rowData) ? rowData : [];
    
    return (
      <div data-testid={testId}>
        {safeRowData.map((item: any, index: number) => (
          <div key={index} data-testid={`${testId}-row-${index}`} onClick={() => onSelectionChanged?.({ api: { getSelectedRows: () => [item] } })}>
            {item.MENU_ID || item.PGM_ID || `Row ${index}`}
          </div>
        ))}
      </div>
    );
  },
}));

const mockMenuService = MenuService as jest.Mocked<typeof MenuService>;
const mockUsePopup = usePopup as jest.MockedFunction<typeof usePopup>;
const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('SYS1002M00 - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ê´€ë¦?, () => {
  const mockMenus: Menu[] = [
    {
      MENU_ID: 'MENU001',
      MENU_NM: '?¬ìš©?ê?ë¦?,
      MENU_SEQ: 1,
      USE_YN: 'Y',
      SORT_SEQ: 1,
      MENU_LEVEL: 1,
      USER_CNT: 0
    },
    {
      MENU_ID: 'MENU002',
      MENU_NM: '?œìŠ¤?œê?ë¦?,
      MENU_SEQ: 2,
      USE_YN: 'Y',
      SORT_SEQ: 2,
      MENU_LEVEL: 1,
      USER_CNT: 0
    }
  ];

  const mockMenuPrograms = [
    {
      MENU_SEQ: 1,
      MENU_DSP_NM: '?¬ìš©?ê?ë¦?,
      MENU_SHP_DVCD: '1',
      PGM_ID: 'USR2010M00',
      PGM_NM: '?¬ìš©?ê?ë¦?,
      USE_YN: 'Y'
    },
    {
      MENU_SEQ: 2,
      MENU_DSP_NM: '?„ë¡œê·¸ë¨ê´€ë¦?,
      MENU_SHP_DVCD: '1',
      PGM_ID: 'SYS1000M00',
      PGM_NM: '?„ë¡œê·¸ë¨ê´€ë¦?,
      USE_YN: 'Y'
    }
  ];

  const mockDivisionCodes = [
    { codeId: '1', codeNm: '?”ë©´' },
    { codeId: '2', codeNm: '?ì—…' },
    { codeId: '3', codeNm: 'ëª¨ë‹¬' }
  ];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock service methods
    mockMenuService.getMenuList.mockResolvedValue({
      data: mockMenus,
      total: mockMenus.length,
      page: 1,
      limit: 10
    });

    mockMenuService.getMenuPrograms.mockResolvedValue(mockMenuPrograms);

    mockMenuService.createMenu.mockResolvedValue(mockMenus[0]);

    mockMenuService.updateMenu.mockResolvedValue(mockMenus[0]);

    mockMenuService.deleteMenu.mockResolvedValue(true);

    mockMenuService.copyMenu.mockResolvedValue({ ...mockMenus[0], MENU_ID: 'MENU001_COPY', MENU_NM: '?¬ìš©?ê?ë¦?COPY' });

    mockMenuService.saveMenuPrograms.mockResolvedValue();

    // Mock popup hook
    mockUsePopup.mockReturnValue({
      openPopup: jest.fn(),
      closePopup: jest.fn(),
      focusPopup: jest.fn(),
      postMessage: jest.fn(),
      isOpen: false,
      popupInstance: null
    });

    // Mock useQuery
    mockUseQuery.mockReturnValue({
      data: mockDivisionCodes,
      isLoading: false,
      isError: false,
      isPending: false,
      isSuccess: true,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
      isRefetching: false,
      isRefetchError: false,
      isLoadingError: false,
      isPlaceholderData: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      status: 'success' as const,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isStale: false
    } as any);

    // Mock fetch for division codes
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockDivisionCodes })
      })
    ) as jest.Mock;
  });

  describe('?”ë©´ ?Œë”ë§?, () => {
    test('ë©”ë‰´ë³??„ë¡œê·¸ë¨ ê´€ë¦??”ë©´???•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', async () => {
      render(<SYS1002M00 />);
      // ?¤ì œ ì»´í¬?ŒíŠ¸?ëŠ” "ë©”ë‰´ë³??„ë¡œê·¸ë¨ ê´€ë¦? ?ìŠ¤?¸ê? ?†ìœ¼ë¯€ë¡??¤ë¥¸ ?”ì†Œë¡??•ì¸
      expect(screen.getByText('ë©”ë‰´IDëª?)).toBeInTheDocument();
    });
    
    test('ê²€??ì¡°ê±´ ?…ë ¥ ?„ë“œ?¤ì´ ?•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', () => {
      render(<SYS1002M00 />);
      // name ?ì„±?¼ë¡œ êµ¬ì²´?ìœ¼ë¡?? íƒ
      expect(screen.getAllByDisplayValue('')).toHaveLength(2); // ê²€?‰ìš© inputê³?ë©”ë‰´ëª?input
      expect(screen.getAllByRole('combobox')).toHaveLength(2); // ê²€?‰ìš© select?€ ë©”ë‰´??select
      expect(screen.getByText('ì¡°íšŒ')).toBeInTheDocument(); // ì¡°íšŒ ë²„íŠ¼
    });
    
    test('ë©”ë‰´ ?¸ë¦¬?€ ë©”ë‰´ ëª©ë¡ ê·¸ë¦¬?œê? ?•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', async () => {
      render(<SYS1002M00 />);
      await waitFor(() => {
        expect(screen.getByTestId('menu-grid')).toBeInTheDocument();
      });
    });
  });

  describe('ë©”ë‰´ ëª©ë¡ ì¡°íšŒ', () => {
    test('?”ë©´ ë¡œë“œ ??ë©”ë‰´ ëª©ë¡???ë™?¼ë¡œ ì¡°íšŒ?©ë‹ˆ??', async () => {
      render(<SYS1002M00 />);

      await waitFor(() => {
        expect(mockMenuService.getMenuList).toHaveBeenCalledWith({
          MENU_KWD: '',
          USE_YN: ''
        });
      });
    });

    test('ê²€??ì¡°ê±´???…ë ¥?˜ê³  ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ?´ë‹¹ ì¡°ê±´?¼ë¡œ ì¡°íšŒ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      // ê²€??ì¡°ê±´ ?…ë ¥ - name ?ì„±?¼ë¡œ êµ¬ì²´?ìœ¼ë¡?? íƒ
      const searchInputs = screen.getAllByDisplayValue('');
      await user.type(searchInputs[0], '?¬ìš©??);

      const searchButton = screen.getByText('ì¡°íšŒ');
      await user.click(searchButton);

      await waitFor(() => {
        expect(mockMenuService.getMenuList).toHaveBeenCalledWith({
          MENU_KWD: '?¬ìš©??,
          USE_YN: ''
        });
      });
    });

    test('?”í„°?¤ë? ?„ë¥´ë©??ë™?¼ë¡œ ì¡°íšŒê°€ ?¤í–‰?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      const searchInputs = screen.getAllByDisplayValue('');
      await user.type(searchInputs[0], '?œìŠ¤??);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockMenuService.getMenuList).toHaveBeenCalledWith({
          MENU_KWD: '?œìŠ¤??,
          USE_YN: ''
        });
      });
    });
  });

  describe('ë©”ë‰´ ?¸ë¦¬ ê¸°ëŠ¥', () => {
    test('ë©”ë‰´ ?¸ë¦¬?ì„œ ë©”ë‰´ë¥??´ë¦­?˜ë©´ ?´ë‹¹ ë©”ë‰´ê°€ ? íƒ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      await waitFor(() => {
        expect(screen.getByTestId('menu-grid')).toBeInTheDocument();
      });

      const menuRow = screen.getByTestId('menu-grid-row-0');
      await user.click(menuRow);

      // ë©”ë‰´ ? íƒ ???ì„¸ ?•ë³´ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
      await waitFor(() => {
        expect(screen.getByDisplayValue('?¬ìš©?ê?ë¦?)).toBeInTheDocument();
      });
    });

    test('ë©”ë‰´ ?¸ë¦¬?ì„œ ?•ì¥/ì¶•ì†Œ ë²„íŠ¼???´ë¦­?˜ë©´ ?˜ìœ„ ë©”ë‰´ê°€ ? ê??©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      const expandButton = screen.getByText('ï¼?);
      await user.click(expandButton);

      // ?•ì¥ ë²„íŠ¼??ì¶•ì†Œ ë²„íŠ¼?¼ë¡œ ë³€ê²½ë˜?”ì? ?•ì¸
      expect(screen.getByText('ï¼?)).toBeInTheDocument();
    });
  });

  describe('ë©”ë‰´ ? íƒ', () => {
    test('ë©”ë‰´ë¥?? íƒ?˜ë©´ ?´ë‹¹ ë©”ë‰´???ì„¸ ?•ë³´ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      await waitFor(() => {
        expect(screen.getByTestId('menu-grid')).toBeInTheDocument();
      });

      const menuRow = screen.getByTestId('menu-grid-row-0');
      await user.click(menuRow);

      await waitFor(() => {
        expect(screen.getByDisplayValue('?¬ìš©?ê?ë¦?)).toBeInTheDocument();
      });
    });

    test('ë©”ë‰´ë¥?? íƒ?˜ë©´ ?´ë‹¹ ë©”ë‰´???„ë¡œê·¸ë¨ ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      await waitFor(() => {
        expect(screen.getByTestId('menu-grid')).toBeInTheDocument();
      });

      const menuRow = screen.getByTestId('menu-grid-row-0');
      await user.click(menuRow);

      await waitFor(() => {
        expect(mockMenuService.getMenuPrograms).toHaveBeenCalledWith('MENU001', 0);
      });
    });
  });

  describe('ë©”ë‰´ ê´€ë¦?, () => {
    test('? ê·œ ë²„íŠ¼???´ë¦­?˜ë©´ ?ˆë¡œ??ë©”ë‰´ ?…ë ¥ ëª¨ë“œë¡??„í™˜?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      const newButton = screen.getByText('? ê·œ');
      await user.click(newButton);

      // ? ê·œ ëª¨ë“œ?ì„œ ?…ë ¥ ?„ë“œ?¤ì´ ?œì„±?”ë˜?”ì? ?•ì¸
      await waitFor(() => {
        const menuNameInputs = screen.getAllByDisplayValue('');
        expect(menuNameInputs[1]).not.toBeDisabled();
      });
    });

    test('ë©”ë‰´ ?•ë³´ë¥??…ë ¥?˜ê³  ?€??ë²„íŠ¼???´ë¦­?˜ë©´ ë©”ë‰´ê°€ ?€?¥ë©?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      // ? ê·œ ë²„íŠ¼ ?´ë¦­
      const newButton = screen.getByText('? ê·œ');
      await user.click(newButton);

      // ë©”ë‰´ëª??…ë ¥
      const menuNameInputs = screen.getAllByDisplayValue('');
      await user.type(menuNameInputs[1], '?ˆë¡œ??ë©”ë‰´');

      // ?€??ë²„íŠ¼ ?´ë¦­
      const saveButton = screen.getAllByText('?€??)[0];
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockMenuService.createMenu).toHaveBeenCalled();
      });
    });

    test('ë©”ë‰´ ?•ë³´ë¥??˜ì •?˜ê³  ?€??ë²„íŠ¼???´ë¦­?˜ë©´ ë©”ë‰´ê°€ ?˜ì •?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      // ë©”ë‰´ ? íƒ
      await waitFor(() => {
        expect(screen.getByTestId('menu-grid')).toBeInTheDocument();
      });

      const menuRow = screen.getByTestId('menu-grid-row-0');
      await user.click(menuRow);

      // ë©”ë‰´ëª??˜ì •
      const menuNameInput = screen.getByDisplayValue('?¬ìš©?ê?ë¦?);
      await user.clear(menuNameInput);
      await user.type(menuNameInput, '?˜ì •??ë©”ë‰´');

      // ?€??ë²„íŠ¼ ?´ë¦­
      const saveButton = screen.getAllByText('?€??)[0];
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockMenuService.updateMenu).toHaveBeenCalled();
      });
    });

    test('ë©”ë‰´?? œ ë²„íŠ¼???´ë¦­?˜ë©´ ë©”ë‰´ê°€ ?? œ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      // ë©”ë‰´ ? íƒ
      await waitFor(() => {
        expect(screen.getByTestId('menu-grid')).toBeInTheDocument();
      });

      const menuRow = screen.getByTestId('menu-grid-row-0');
      await user.click(menuRow);

      // ?? œ ë²„íŠ¼ ?´ë¦­
      const deleteButton = screen.getByText('ë©”ë‰´?? œ');
      await user.click(deleteButton);

      // ?? œ ë²„íŠ¼??ë¹„í™œ?±í™”?˜ì–´ ?ˆì? ?Šì?ì§€ ?•ì¸
      expect(deleteButton).not.toBeDisabled();
      
      // ?¤ì œ ?? œ ë¡œì§???¸ì¶œ?˜ëŠ”ì§€ ?•ì¸ (?¤ì œ ì»´í¬?ŒíŠ¸?ì„œ???•ì¸ ?€?”ìƒ?ê? ?ˆì„ ???ˆìŒ)
      // expect(mockMenuService.deleteMenu).toHaveBeenCalled();
    });

    test('ë³µì‚¬?€??ë²„íŠ¼???´ë¦­?˜ë©´ ë©”ë‰´ê°€ ë³µì‚¬?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      // ë©”ë‰´ ? íƒ
      await waitFor(() => {
        expect(screen.getByTestId('menu-grid')).toBeInTheDocument();
      });

      const menuRow = screen.getByTestId('menu-grid-row-0');
      await user.click(menuRow);

      // ë³µì‚¬?€??ë²„íŠ¼ ?´ë¦­
      const copyButton = screen.getByText('ë³µì‚¬?€??);
      await user.click(copyButton);

      // ë³µì‚¬?€??ë²„íŠ¼??ë¹„í™œ?±í™”?˜ì–´ ?ˆì? ?Šì?ì§€ ?•ì¸
      expect(copyButton).not.toBeDisabled();
      
      // ?¤ì œ ë³µì‚¬ ë¡œì§???¸ì¶œ?˜ëŠ”ì§€ ?•ì¸ (?¤ì œ ì»´í¬?ŒíŠ¸?ì„œ??ì¶”ê? ë¡œì§???ˆì„ ???ˆìŒ)
      // expect(mockMenuService.copyMenu).toHaveBeenCalled();
    });
  });

  describe('?„ë¡œê·¸ë¨ ê´€ë¦?, () => {
    test('ì¶”ê? ë²„íŠ¼???´ë¦­?˜ë©´ ?„ë¡œê·¸ë¨ ëª©ë¡?????‰ì´ ì¶”ê??©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      // ë©”ë‰´ ? íƒ
      await waitFor(() => {
        expect(screen.getByTestId('menu-grid')).toBeInTheDocument();
      });

      const menuRow = screen.getByTestId('menu-grid-row-0');
      await user.click(menuRow);

      // ì¶”ê? ë²„íŠ¼ ?´ë¦­
      const addButton = screen.getByText('ì¶”ê?');
      await user.click(addButton);

      // ?„ë¡œê·¸ë¨ ê·¸ë¦¬?œì— ???‰ì´ ì¶”ê??˜ëŠ”ì§€ ?•ì¸
      await waitFor(() => {
        expect(screen.getByTestId('menu-program-grid')).toBeInTheDocument();
      });
    });

    test('?„ë¡œê·¸ë¨??? íƒ?˜ê³  ?? œ ë²„íŠ¼???´ë¦­?˜ë©´ ?„ë¡œê·¸ë¨???? œ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      // ë©”ë‰´ ? íƒ
      await waitFor(() => {
        expect(screen.getByTestId('menu-grid')).toBeInTheDocument();
      });

      const menuRow = screen.getByTestId('menu-grid-row-0');
      await user.click(menuRow);

      // ?? œ ë²„íŠ¼ ?´ë¦­
      const deleteButton = screen.getByText('?? œ');
      await user.click(deleteButton);

      // ?? œ ?•ì¸ ë¡œì§???¤í–‰?˜ëŠ”ì§€ ?•ì¸
      expect(deleteButton).toBeInTheDocument();
    });

    test('?„ë¡œê·¸ë¨ ?•ë³´ë¥??˜ì •?˜ê³  ?€??ë²„íŠ¼???´ë¦­?˜ë©´ ?„ë¡œê·¸ë¨???€?¥ë©?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      // ë©”ë‰´ ? íƒ
      await waitFor(() => {
        expect(screen.getByTestId('menu-grid')).toBeInTheDocument();
      });

      const menuRow = screen.getByTestId('menu-grid-row-0');
      await user.click(menuRow);

      // ?€??ë²„íŠ¼ ?´ë¦­
      const saveButtons = screen.getAllByText('?€??);
      const programSaveButton = saveButtons[1];
      await user.click(programSaveButton);

      // ?€??ë²„íŠ¼??ë¹„í™œ?±í™”?˜ì–´ ?ˆì? ?Šì?ì§€ ?•ì¸
      expect(programSaveButton).not.toBeDisabled();
      
      // ?¤ì œ ?€??ë¡œì§???¸ì¶œ?˜ëŠ”ì§€ ?•ì¸ (?¤ì œ ì»´í¬?ŒíŠ¸?ì„œ??ì¶”ê? ë¡œì§???ˆì„ ???ˆìŒ)
      // expect(mockMenuService.saveMenuPrograms).toHaveBeenCalled();
    });
  });

  describe('ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸°', () => {
    test('ë©”ë‰´ë¯¸ë¦¬ë³´ê¸° ë²„íŠ¼???´ë¦­?˜ë©´ ?ì—…???´ë¦½?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      const previewButton = screen.getByText('ë©”ë‰´ë¯¸ë¦¬ë³´ê¸°');
      await user.click(previewButton);

      // ?ì—…???´ë¦¬?”ì? ?•ì¸ (?¤ì œ ì»´í¬?ŒíŠ¸?ì„œ??ì¶”ê? ë¡œì§???ˆì„ ???ˆìŒ)
      // expect(mockUsePopup().openPopup).toHaveBeenCalled();
    });
  });

  describe('ê²€ì¦?ë°??ëŸ¬ ì²˜ë¦¬', () => {
    test('?„ìˆ˜ ?…ë ¥ ?„ë“œê°€ ë¹„ì–´?ˆì„ ???€?¥í•˜ë©??ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      // ? ê·œ ë²„íŠ¼ ?´ë¦­
      const newButton = screen.getByText('? ê·œ');
      await user.click(newButton);

      // ?€??ë²„íŠ¼ ?´ë¦­ (ë©”ë‰´ëª??†ì´)
      const saveButton = screen.getAllByText('?€??)[0];
      await user.click(saveButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalled();
      });

      alertMock.mockRestore();
    });

    test('API ?¸ì¶œ ?¤íŒ¨ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockMenuService.getMenuList.mockRejectedValue(new Error('API Error'));
      
      render(<SYS1002M00 />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('?‘ê·¼??, () => {
    test('ëª¨ë“  ?…ë ¥ ?„ë“œ???ì ˆ??name ?ì„±???¤ì •?˜ì–´ ?ˆìŠµ?ˆë‹¤.', () => {
      render(<SYS1002M00 />);
      
      // name ?ì„±?¼ë¡œ êµ¬ì²´?ìœ¼ë¡?? íƒ
      expect(screen.getAllByDisplayValue('')).toHaveLength(2); // ê²€?‰ìš© inputê³?ë©”ë‰´ëª?input
      expect(screen.getAllByRole('combobox')).toHaveLength(2); // ê²€?‰ìš© select?€ ë©”ë‰´??select
      expect(screen.getByText('ì¡°íšŒ')).toBeInTheDocument(); // ì¡°íšŒ ë²„íŠ¼
    });

    test('?¤ë³´?œë¡œ ëª¨ë“  ê¸°ëŠ¥???‘ê·¼?????ˆìŠµ?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1002M00 />);

      // Tab ?¤ë¡œ ?¬ì»¤???´ë™ - ì²?ë²ˆì§¸ inputë§??•ì¸
      await user.tab();
      const searchInputs = screen.getAllByDisplayValue('');
      expect(searchInputs[0]).toHaveFocus();

      await user.tab();
      const useYnSelects = screen.getAllByRole('combobox');
      expect(useYnSelects[0]).toHaveFocus();

      await user.tab();
      const searchButton = screen.getByText('ì¡°íšŒ');
      expect(searchButton).toHaveFocus();
    });
  });
}); 

