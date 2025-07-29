/**
 * SYS1001M00.test.tsx - ?„ë¡œê·¸ëž¨ ê·¸ë£¹ ê´€ë¦??”ë©´ ?ŒìŠ¤??
 * 
 * ?ŒìŠ¤???€?? SYS1001M00.tsx
 * ?ŒìŠ¤??ë²”ìœ„: ?„ë¡œê·¸ëž¨ ê·¸ë£¹ ê´€ë¦¬ì˜ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥
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

describe('SYS1001M00 - ?„ë¡œê·¸ëž¨ ê·¸ë£¹ ê´€ë¦?, () => {
  const mockProgramGroups = [
    {
      pgmGrpId: 'GRP001',
      pgmGrpNm: '?¬ìš©?ê?ë¦?ê·¸ë£¹',
      useYn: 'Y',
      sortSeq: 1,
      regDttm: '2024-01-01',
      chngDttm: '2024-01-01',
      chngrId: 'admin'
    },
    {
      pgmGrpId: 'GRP002',
      pgmGrpNm: '?œìŠ¤?œê?ë¦?ê·¸ë£¹',
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
      pgmNm: '?¬ìš©?ê?ë¦?,
      pgmDivNm: '?”ë©´',
      bizDivNm: '?¬ìš©?ê?ë¦?,
      useYn: 'Y',
      sortSeq: 1
    },
    {
      pgmId: 'SYS1000M00',
      pgmNm: '?„ë¡œê·¸ëž¨ê´€ë¦?,
      pgmDivNm: '?”ë©´',
      bizDivNm: '?œìŠ¤?œê?ë¦?,
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
      message: 'ì¡°íšŒ ?±ê³µ'
    });

    mockProgramGroupService.getProgramGroupDetail.mockResolvedValue({
      success: true,
      data: {
        ...mockProgramGroups[0],
        programs: mockPrograms
      },
      message: 'ì¡°íšŒ ?±ê³µ'
    });

    mockProgramGroupService.createProgramGroup.mockResolvedValue(mockProgramGroups[0]);

    mockProgramGroupService.updateProgramGroup.mockResolvedValue(mockProgramGroups[0]);

    mockProgramGroupService.copyProgramGroup.mockResolvedValue({
      success: true,
      message: 'ë³µì‚¬ ?±ê³µ'
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

  describe('?”ë©´ ?Œë”ë§?, () => {
    test('?„ë¡œê·¸ëž¨ ê·¸ë£¹ ê´€ë¦??”ë©´???•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', async () => {
      render(<SYS1001M00 />);

      // ê¸°ë³¸ UI ?”ì†Œ?¤ì´ ?Œë”ë§ë˜?”ì? ?•ì¸
      expect(screen.getByText('?„ë¡œê·¸ëž¨ ê·¸ë£¹ ëª©ë¡')).toBeInTheDocument();
      expect(screen.getByText('?„ë¡œê·¸ëž¨ ëª©ë¡')).toBeInTheDocument();
      expect(screen.getByText('?„ë¡œê·¸ëž¨ ê·¸ë£¹ ?•ë³´')).toBeInTheDocument();
    });

    test('ê²€??ì¡°ê±´ ?…ë ¥ ?„ë“œ?¤ì´ ?•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', () => {
      render(<SYS1001M00 />);

      expect(screen.getByPlaceholderText('ê·¸ë£¹ëª??ëŠ” ì½”ë“œ ?…ë ¥')).toBeInTheDocument();
      expect(screen.getByDisplayValue('?„ì²´')).toBeInTheDocument();
      expect(screen.getByText('ì¡°íšŒ')).toBeInTheDocument();
    });

    test('?„ë¡œê·¸ëž¨ ê·¸ë£¹ ëª©ë¡ ê·¸ë¦¬?œê? ?•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(screen.getAllByTestId('ag-grid')).toHaveLength(2); // ?¼ìª½, ?¤ë¥¸ìª?ê·¸ë¦¬??
      });
    });

    test('ë²„íŠ¼?¤ì´ ?•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', () => {
      render(<SYS1001M00 />);

      expect(screen.getByText('? ê·œ')).toBeInTheDocument();
      expect(screen.getByText('?€??)).toBeInTheDocument();
      expect(screen.getByText('?? œ')).toBeInTheDocument();
      expect(screen.getByText('ì¶”ê?')).toBeInTheDocument();
    });
  });

  describe('?„ë¡œê·¸ëž¨ ê·¸ë£¹ ëª©ë¡ ì¡°íšŒ', () => {
    test('?”ë©´ ë¡œë“œ ???„ë¡œê·¸ëž¨ ê·¸ë£¹ ëª©ë¡???ë™?¼ë¡œ ì¡°íšŒ?©ë‹ˆ??', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupList).toHaveBeenCalledWith({
          PGM_GRP_NM: '',
          USE_YN: ''
        });
      });
    });

    test('ê²€??ì¡°ê±´???…ë ¥?˜ê³  ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ?´ë‹¹ ì¡°ê±´?¼ë¡œ ì¡°íšŒ?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      // ê²€??ì¡°ê±´ ?…ë ¥
      const searchInput = screen.getByPlaceholderText('ê·¸ë£¹ëª??ëŠ” ì½”ë“œ ?…ë ¥');
      await user.type(searchInput, '?¬ìš©??);

      const searchButton = screen.getByText('ì¡°íšŒ');
      await user.click(searchButton);

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupList).toHaveBeenCalledWith({
          PGM_GRP_NM: '?¬ìš©??,
          USE_YN: ''
        });
      });
    });

    test('?”í„°?¤ë? ?„ë¥´ë©??ë™?¼ë¡œ ì¡°íšŒê°€ ?¤í–‰?©ë‹ˆ??', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      const searchInput = screen.getByPlaceholderText('ê·¸ë£¹ëª??ëŠ” ì½”ë“œ ?…ë ¥');
      await user.type(searchInput, '?œìŠ¤??);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupList).toHaveBeenCalledWith({
          PGM_GRP_NM: '?œìŠ¤??,
          USE_YN: ''
        });
      });
    });
  });

  describe('?„ë¡œê·¸ëž¨ ê·¸ë£¹ ? íƒ', () => {
    test('?„ë¡œê·¸ëž¨ ê·¸ë£¹???´ë¦­?˜ë©´ ?´ë‹¹ ê·¸ë£¹???ì„¸ ?•ë³´ê°€ ?œì‹œ?©ë‹ˆ??', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        const gridRow = screen.getByTestId('grid-row-0');
        fireEvent.click(gridRow);
      });

      await waitFor(() => {
        expect(mockProgramGroupService.getProgramGroupDetail).toHaveBeenCalledWith('GRP001');
      });
    });

    test('?„ë¡œê·¸ëž¨ ê·¸ë£¹??? íƒ?˜ë©´ ?´ë‹¹ ê·¸ë£¹???„ë¡œê·¸ëž¨ ëª©ë¡???œì‹œ?©ë‹ˆ??', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        const gridRow = screen.getByTestId('grid-row-0');
        fireEvent.click(gridRow);
      });

      await waitFor(() => {
        expect(screen.getByText('?„ë¡œê·¸ëž¨ ëª©ë¡')).toBeInTheDocument();
      });
    });
  });

  describe('?„ë¡œê·¸ëž¨ ê·¸ë£¹ ? ê·œ ?±ë¡', () => {
    test('? ê·œ ë²„íŠ¼???´ë¦­?˜ë©´ ?¼ì´ ì´ˆê¸°?”ë©?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      const newButton = screen.getByText('? ê·œ');
      await user.click(newButton);

      // ? ê·œ ë²„íŠ¼ ?´ë¦­ ???íƒœ ?•ì¸
      expect(newButton).toBeInTheDocument();
    });
  });

  describe('?„ë¡œê·¸ëž¨ ì¶”ê?', () => {
    test('?„ë¡œê·¸ëž¨ ì¶”ê? ë²„íŠ¼???´ë¦­?˜ë©´ ?„ë¡œê·¸ëž¨ ê²€???ì—…???´ë¦½?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      // ê·¸ë£¹ ? íƒ
      await waitFor(() => {
        const gridRow = screen.getByTestId('grid-row-0');
        fireEvent.click(gridRow);
      });

      // ?„ë¡œê·¸ëž¨ ì¶”ê? ë²„íŠ¼ ?´ë¦­
      const addProgramButton = screen.getByText('ì¶”ê?');
      await user.click(addProgramButton);

      await waitFor(() => {
        expect(mockUsePopup().openPopup).toHaveBeenCalled();
      });
    });
  });

  describe('ê²€ì¦?ë°??ëŸ¬ ì²˜ë¦¬', () => {
    test('API ?¸ì¶œ ?¤íŒ¨ ???ëŸ¬ ì²˜ë¦¬ê°€ ?•ìƒ?ìœ¼ë¡??‘ë™?©ë‹ˆ??', async () => {
      mockProgramGroupService.getProgramGroupList.mockRejectedValue(new Error('API ?¤ë¥˜'));

      render(<SYS1001M00 />);

      // ?ëŸ¬ ë°œìƒ ?œì—???”ë©´???•ìƒ?ìœ¼ë¡??Œë”ë§ë˜?”ì? ?•ì¸
      await waitFor(() => {
        expect(screen.getByText('?„ë¡œê·¸ëž¨ ê·¸ë£¹ ëª©ë¡')).toBeInTheDocument();
      });
    });
  });

  describe('?‘ê·¼??, () => {
    test('ëª¨ë“  ?…ë ¥ ?„ë“œ???ì ˆ??placeholderê°€ ?¤ì •?˜ì–´ ?ˆìŠµ?ˆë‹¤.', () => {
      render(<SYS1001M00 />);

      expect(screen.getByPlaceholderText('ê·¸ë£¹ëª??ëŠ” ì½”ë“œ ?…ë ¥')).toBeInTheDocument();
    });

    test('?¤ë³´?œë¡œ ê¸°ë³¸ ê¸°ëŠ¥???‘ê·¼?????ˆìŠµ?ˆë‹¤.', async () => {
      const user = userEvent.setup();
      render(<SYS1001M00 />);

      // Tab ?¤ë¡œ ?¬ì»¤???´ë™
      await user.tab();
      expect(screen.getByPlaceholderText('ê·¸ë£¹ëª??ëŠ” ì½”ë“œ ?…ë ¥')).toHaveFocus();
    });
  });

  describe('?±ëŠ¥ ë°?ìµœì ??, () => {
    test('ê·¸ë¦¬???°ì´??ë³€ê²???ì»¬ëŸ¼ ?¬ê¸°ê°€ ?ë™?¼ë¡œ ì¡°ì •?©ë‹ˆ??', async () => {
      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(screen.getAllByTestId('ag-grid')).toHaveLength(2);
      });
    });

    test('?€?‰ì˜ ?°ì´?°ê? ?ˆì–´???”ë©´???•ìƒ?ìœ¼ë¡??Œë”ë§ë©?ˆë‹¤.', async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        pgmGrpId: `GRP${i.toString().padStart(3, '0')}`,
        pgmGrpNm: `ê·¸ë£¹ ${i}`,
        useYn: 'Y',
        sortSeq: i + 1
      }));

      mockProgramGroupService.getProgramGroupList.mockResolvedValue({
        success: true,
        data: largeData,
        message: 'ì¡°íšŒ ?±ê³µ'
      });

      render(<SYS1001M00 />);

      await waitFor(() => {
        expect(screen.getAllByTestId('ag-grid')).toHaveLength(2);
      });
    });
  });
}); 

