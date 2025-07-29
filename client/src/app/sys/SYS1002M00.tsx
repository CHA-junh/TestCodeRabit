/**
 * SYS1002M00 - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ê´€ë¦??”ë©´
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ë©”ë‰´ ëª©ë¡ ì¡°íšŒ ë°?ê²€??
 * - ë©”ë‰´ ? ê·œ ?±ë¡ ë°??˜ì •/?? œ
 * - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ?°ê²° ê´€ë¦?
 * - ë©”ë‰´ ê³„ì¸µ êµ¬ì¡° ?¸ë¦¬ ?œì‹œ
 * - ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ê¸°ëŠ¥
 * - ë©”ë‰´ ë³µì‚¬ ê¸°ëŠ¥
 *
 * API ?°ë™:
 * - GET /api/sys/sys-menus - ë©”ë‰´ ëª©ë¡ ì¡°íšŒ
 * - POST /api/sys/sys-menus - ë©”ë‰´ ?€??
 * - DELETE /api/sys/sys-menus/:menuId - ë©”ë‰´ ?? œ
 * - POST /api/sys/sys-menus/:menuId/copy - ë©”ë‰´ ë³µì‚¬
 * - GET /api/sys/sys-menus/:menuId/programs - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ì¡°íšŒ
 * - POST /api/sys/sys-menus/:menuId/programs - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ?€??
 * - DELETE /api/sys/sys-menus/:menuId/programs - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ?? œ
 * - POST /api/common/search - ê³µí†µì½”ë“œ ì¡°íšŒ (êµ¬ë¶„: 304)
 *
 * ?íƒœ ê´€ë¦?
 * - ë©”ë‰´ ëª©ë¡ ë°?? íƒ??ë©”ë‰´
 * - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ëª©ë¡ ë°?? íƒ???„ë¡œê·¸ë¨??
 * - ë©”ë‰´ ?¸ë¦¬ êµ¬ì¡° ë°??•ì¥/ì¶•ì†Œ ?íƒœ
 * - ê²€??ì¡°ê±´ (ë©”ë‰´ID/ëª? ?¬ìš©?¬ë?)
 * - êµ¬ë¶„ ì½”ë“œ ëª©ë¡ (304 ?€ë¶„ë¥˜)
 *
 * ?¬ìš©???¸í„°?˜ì´??
 * - ê²€??ì¡°ê±´ ?…ë ¥ (ë©”ë‰´ID/ëª? ?¬ìš©?¬ë?)
 * - ë©”ë‰´ ëª©ë¡ ?Œì´ë¸?(AG-Grid)
 * - ë©”ë‰´ ê³„ì¸µ êµ¬ì¡° ?¸ë¦¬ (ì¢Œì¸¡)
 * - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ëª©ë¡ ?Œì´ë¸?(?°ì¸¡)
 * - ë©”ë‰´ ?ì„¸ ?•ë³´ ?…ë ¥ ??
 * - ?€??? ê·œ/?? œ/ë³µì‚¬/ë¯¸ë¦¬ë³´ê¸° ë²„íŠ¼
 *
 * ?°ê? ?”ë©´:
 * - SYS1000M00: ?„ë¡œê·¸ë¨ ê´€ë¦?(?„ë¡œê·¸ë¨ ?•ë³´)
 * - SYS1001M00: ?„ë¡œê·¸ë¨ ê·¸ë£¹ ê´€ë¦?(ê·¸ë£¹ ?°ê²°)
 * - SYS1003M00: ?¬ìš©????•  ê´€ë¦?(ë©”ë‰´ ê¶Œí•œ)
 * - SYS1010D00: ?„ë¡œê·¸ë¨ ê²€???ì—…
 * - SYS1012R00: ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?ì—…
 *
 * ?°ì´??êµ¬ì¡°:
 * - Menu: ë©”ë‰´ ?•ë³´ (MENU_ID, MENU_NM, USE_YN, USER_CNT ??
 * - MenuProgram: ë©”ë‰´ë³??„ë¡œê·¸ë¨ ?•ë³´ (MENU_SEQ, MENU_DSP_NM, MENU_SHP_DVCD, PGM_ID ??
 * - TreeNode: ë©”ë‰´ ?¸ë¦¬ ?¸ë“œ (children, treeIndex ??
 *
 * ?¹ì´?¬í•­:
 * - ë©”ë‰´??ê³„ì¸µ êµ¬ì¡°ë¡?ê´€ë¦?(MENU_SEQë¡?ê³„ì¸µ ?œí˜„)
 * - ë©”ë‰´ë³??„ë¡œê·¸ë¨??êµ¬ë¶„?€ 304 ?€ë¶„ë¥˜ ì½”ë“œ ?¬ìš©
 * - ë©”ë‰´ ë³µì‚¬ ???˜ìœ„ ë©”ë‰´?€ ?„ë¡œê·¸ë¨???¨ê»˜ ë³µì‚¬
 * - ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸°???ì—…?¼ë¡œ ?¤ì œ ë©”ë‰´ êµ¬ì¡° ?œì‹œ
 * - ?¸ë¦¬ êµ¬ì¡°???¬ê???ì»´í¬?ŒíŠ¸ë¡?êµ¬í˜„
 * - ë©”ë‰´ë³??„ë¡œê·¸ë¨?€ ê³„ì¸µ???? œ ì§€??
 */
'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { cn } from '@/lib/utils';
import { Menu, MenuListResponse, MenuCreateDto, MenuUpdateDto } from '@/modules/sys/types/menu.types';
import { MenuService } from '@/modules/sys/services/menuService';
import { usePopup } from '@/modules/com/hooks/usePopup';
import '../common/common.css';
import { useToast } from '@/contexts/ToastContext';

// ?¬ê????¸ë¦¬ ?¸ë“œ ì»´í¬?ŒíŠ¸
interface TreeNodeProps {
  node: any;
  level: number;
  index: number;
  onToggle: (index: number) => void;
  onSelect: (node: any) => void;
  openIndexes: number[];
  selectedTreeNode: any | null;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, index, onToggle, onSelect, openIndexes, selectedTreeNode }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isOpen = openIndexes.includes(node.treeIndex || index);
  const isTopLevel = node.MENU_SEQ === '0'; // ìµœìƒ???¸ë“œ ?¬ë?
  const isSelected = selectedTreeNode && selectedTreeNode.MENU_SEQ === node.MENU_SEQ;
  
  return (
    <li style={{ listStyle: 'none' }}>
      <div 
        className={`menu-title flex items-center gap-1 cursor-pointer ${
          isTopLevel ? 'font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded' : ''
        } ${isSelected ? 'bg-orange-100' : ''}`}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          <span 
            className="mr-1"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.treeIndex || index);
            }}
          >
            {isOpen ? '?? : '??}
          </span>
        ) : (
          <span className="mr-1">??/span>
        )}
        {isTopLevel && <span className="text-blue-500 mr-1">?‘‘</span>}
        <span className="flex-1">{node.MENU_DSP_NM}</span>
      </div>
      {isOpen && hasChildren && (
        <ul className="menu-children pl-4" style={{ listStyle: 'none' }}>
          {node.children.map((child: any, childIndex: number) => {
            return (
              <TreeNode
                key={child.MENU_SEQ || childIndex}
                node={child}
                level={level + 1}
                index={child.treeIndex || childIndex}
                onToggle={onToggle}
                onSelect={onSelect}
                openIndexes={openIndexes}
                selectedTreeNode={selectedTreeNode}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default function SYS1002M00() {
  const { showToast, showConfirm } = useToast();
  
  // AG-Grid refs
  const menuGridRef = useRef<AgGridReact<Menu>>(null);
  const menuProgramGridRef = useRef<AgGridReact<any>>(null);

  // AG-Grid ì»¬ëŸ¼ ?•ì˜ - ë©”ë‰´ ëª©ë¡
  const [menuColDefs] = useState<ColDef[]>([
    { headerName: 'No', field: 'rowIndex', width: 60, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1 },
    { headerName: 'ë©”ë‰´ID', field: 'MENU_ID', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: 'ë©”ë‰´ëª?, field: 'MENU_NM', width: 200, flex: 1.5, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '?¬ìš©?¬ë?', field: 'USE_YN', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '?¬ìš©?ìˆ˜', field: 'USER_CNT', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '0' },
    { headerName: 'ë³€ê²½ì', field: 'CHNGR_NM', width: 100, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '-' },
    { headerName: 'ë³€ê²½ì¼??, field: 'CHNG_DTTM', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '-' },
  ]);

  // 304 ?€ë¶„ë¥˜ ì½”ë“œ???Œë¶„ë¥?ì½”ë“œ ëª©ë¡
  const [divisionCodes, setDivisionCodes] = useState<Array<{codeId: string, codeNm: string}>>([]);

  // 304 ?€ë¶„ë¥˜ ì½”ë“œ???Œë¶„ë¥?ì½”ë“œ?¤ì„ ê°€?¸ì˜¤???¨ìˆ˜
  const loadDivisionCodes = async () => {
    try {
      const response = await fetch('/api/common/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ largeCategoryCode: '304' })
      });
      const result = await response.json();
      const codes = result.data || [];
      setDivisionCodes(codes);
    } catch (error) {
      console.error('304 ?€ë¶„ë¥˜ ì½”ë“œ ë¡œë“œ ì¤??¤ë¥˜:', error);
    }
  };

  // AG-Grid ì»¬ëŸ¼ ?•ì˜ - ë©”ë‰´ë³??„ë¡œê·¸ë¨
  const menuProgramColDefs = useMemo<ColDef[]>(() => [
    { headerName: 'No', field: 'rowIndex', width: 60, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1 },
    { 
      headerName: '', 
      field: 'checkbox', 
      width: 40, 
      flex: 0.3, 
      cellStyle: { textAlign: 'center' }, 
      headerClass: 'ag-center-header',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left'
    },
    { 
      headerName: 'êµ¬ë¶„', 
      field: 'MENU_SHP_DVCD', 
      width: 80, 
      flex: 0.8, 
      cellStyle: { textAlign: 'center' }, 
      headerClass: 'ag-center-header',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: Array.isArray(divisionCodes) && divisionCodes.length > 0 
          ? divisionCodes.map(code => code.codeId) 
          : []
      },
      valueFormatter: (params: any) => {
        // params.dataê°€ null??ê²½ìš° ?ˆì „?˜ê²Œ ì²˜ë¦¬
        if (!params.data) {
          return params.value || '';
        }
        
        // ?œë²„?ì„œ ë°›ì? MENU_SHP_DVCD_NM???°ì„  ?¬ìš©?˜ê³ , ?†ìœ¼ë©?divisionCodes?ì„œ ì°¾ê¸°
        if (params.data.MENU_SHP_DVCD_NM) {
          return params.data.MENU_SHP_DVCD_NM;
        }
        if (Array.isArray(divisionCodes) && divisionCodes.length > 0) {
          const code = divisionCodes.find(c => c.codeId === params.value);
          return code ? code.codeNm : params.value;
        }
        return params.value || '';
      }
    },
    { headerName: '?œì‹œëª?, field: 'MENU_DSP_NM', width: 150, flex: 1.2, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '?„ë¡œê·¸ë¨', field: 'PGM_ID', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { 
      headerName: 'ì°¾ê¸°', 
      field: 'search', 
      width: 60, 
      flex: 0.5, 
      cellStyle: { textAlign: 'center' }, 
      headerClass: 'ag-center-header',
      cellRenderer: (params: any) => {
        return (
          <button
            type="button"
            className="btn-base btn-etc text-xs px-2 py-1"
            onClick={() => handleProgramSearch(params.data, params.node.rowIndex)}
          >
            ì°¾ê¸°
          </button>
        );
      }
    },
    { headerName: '?•ë ¬', field: 'SORT_SEQ', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', type: 'numericColumn' },
    { headerName: '?¬ìš©?¬ë?', field: 'USE_YN', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Y', 'N'] } },
  ], [divisionCodes]);

  // ?íƒœ ?•ì˜
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [menuTree, setMenuTree] = useState<any[]>([]);
  const [menuDetails, setMenuDetails] = useState<any[]>([]);
  const [selectedDetails, setSelectedDetails] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [isNewMenu, setIsNewMenu] = useState(false);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [searchConditions, setSearchConditions] = useState({
    MENU_KWD: '',
    USE_YN: '',
  });
  const [selectedTreeNode, setSelectedTreeNode] = useState<any | null>(null);

  // ?ì—… ??
  const { openPopup } = usePopup();

  // ì´ˆê¸° ë¡œë“œ - ?ë‹¨ ê·¸ë¦¬??ì¡°íšŒ ë°?304 ?€ë¶„ë¥˜ ì½”ë“œ ë¡œë“œ
  useEffect(() => {
    console.log('?”„ SYS1002M00 ?”ë©´ ë¡œë“œ - ?ë‹¨ ê·¸ë¦¬??ì¡°íšŒ ?œì‘');
    loadMenus();
    loadDivisionCodes(); // 304 ?€ë¶„ë¥˜ ì½”ë“œ ë¡œë“œ
  }, []);

  // ?°ì´??ë³€ê²???ì»¬ëŸ¼ ?¬ê¸° ì¡°ì •
  useEffect(() => {
    if (menuGridRef.current?.api) {
      menuGridRef.current.api.sizeColumnsToFit();
    }
  }, [menus]);

  useEffect(() => {
    if (menuProgramGridRef.current?.api) {
      menuProgramGridRef.current.api.sizeColumnsToFit();
    }
  }, []);

  // AG-Grid ?´ë²¤???¸ë“¤??
  const onMenuSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const menu = selectedRows[0];
      console.log('?¯ ê·¸ë¦¬?œì—??ë©”ë‰´ ? íƒ??', menu);
      console.log('?“‹ ? íƒ??ë©”ë‰´ ?•ë³´:', {
        MENU_ID: menu.MENU_ID,
        MENU_NM: menu.MENU_NM,
        USE_YN: menu.USE_YN
      });
      setIsNewMenu(false);
      setSelectedMenu(menu);
      console.log('?”„ ê´€???°ì´??ë¡œë“œ ?œì‘...');
      setMenuPrograms([]);
      setSelectedPrograms(new Set());
      // ë©”ë‰´ ?¸ë¦¬ ë¡œë“œ (SEIZE_TO_BIST ë°©ì‹: ? íƒ??ë©”ë‰´ë¥?ìµœìƒ?„ë¡œ ?¤ì •)
      if (menu.MENU_ID) {
        loadMenuTreeByMenu(menu.MENU_ID, menu);
        // ë©”ë‰´ë³??„ë¡œê·¸ë¨ ?™ì‹œ ì¡°íšŒ (MENU_SEQ=0)
        loadMenuPrograms(menu.MENU_ID, 0);
      }
      console.log('??ë©”ë‰´ ? íƒ ì²˜ë¦¬ ?„ë£Œ');
    } else {
      setSelectedMenu(null);
      setMenuPrograms([]);
      setMenuTree([]); // ?¸ë¦¬??ì´ˆê¸°??
    }
  };

  const onMenuProgramSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    const selectedIndices = new Set<number>();
    selectedRows.forEach(row => {
      const index = menuPrograms.findIndex(item => item === row);
      if (index !== -1) {
        selectedIndices.add(index);
      }
    });
    setSelectedPrograms(selectedIndices);
    console.log('? íƒ???„ë¡œê·¸ë¨??', selectedIndices);
  };

  const onMenuGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  const onMenuProgramGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };



  // ?„ë¡œê·¸ë¨ ê²€???¸ë“¤??
  const handleProgramSearch = (rowData: any, rowIndex: number) => {
    console.log('?„ë¡œê·¸ë¨ ê²€???´ë¦­:', rowData, rowIndex);
    // ?„ë¡œê·¸ë¨ ê²€???ì—… ?´ê¸° (ê·¸ë¦¬???ˆìª½: ?´ë¦­??ë¡œìš°???œë²ˆ??PGM_IDë¡??„ë‹¬)
    openPopup({
      url: `/popup/sys/SYS1010D00?PGM_ID=${rowIndex}`,
      size: 'custom',
      position: 'center',
      options: {
        width: 850,
        height: 430,
        resizable: false,
        scrollbars: false
      }
    });
  };

  // ë©”ë‰´ë³??„ë¡œê·¸ë¨ ê´€ë¦??íƒœ
  const [menuPrograms, setMenuPrograms] = useState<any[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<Set<number>>(new Set());
  const [programSearchKeyword, setProgramSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showProgramSearch, setShowProgramSearch] = useState(false);
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  // ê³µí†µ ì´ˆê¸°???¨ìˆ˜
  const resetAllData = () => {
    setSelectedMenu(null);
    setMenuTree([]);
    setMenuPrograms([]);
    setSelectedDetails(new Set());
    setSelectedPrograms(new Set());
    setOpenIndexes([]);
    setTreeExpanded(false);
    setIsNewMenu(false);
    setSelectedTreeNode(null);
  };

  // ë©”ë‰´ ëª©ë¡ ë¶ˆëŸ¬?¤ê¸°
  const loadMenus = async () => {
    setLoading(true);
    resetAllData();
    try {
      const response: MenuListResponse = await MenuService.getMenuList(searchConditions);
      setMenus(response.data || []);
    } catch (error: any) {
      showToast(`ë©”ë‰´ ëª©ë¡ ì¡°íšŒ ?¤íŒ¨: ${error?.message || '?????†ëŠ” ?¤ë¥˜'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ë©”ë‰´ ?¸ë¦¬ ë¶ˆëŸ¬?¤ê¸° (?„ì²´)
  const loadMenuTree = useCallback(async () => {
    try {
      const tree = await MenuService.getMenuTree('ALL');
      console.log('ë¡œë“œ???¸ë¦¬ ?°ì´??', tree);
      
      // ?‰ë©´ ?°ì´?°ë? ê³„ì¸µ êµ¬ì¡°ë¡?ë³€??
      const hierarchicalTree = convertToHierarchicalTree(tree || []);
      console.log('ê³„ì¸µ êµ¬ì¡°ë¡?ë³€?˜ëœ ?¸ë¦¬:', hierarchicalTree);
      
      setMenuTree(hierarchicalTree);
      // ?¸ë¦¬ ë¡œë“œ ???•ì¥ ?íƒœ ì´ˆê¸°??
      setOpenIndexes([]);
      setTreeExpanded(false);
    } catch (error: any) {
      console.error('ë©”ë‰´ ?¸ë¦¬ ì¡°íšŒ ?¤íŒ¨:', error);
    }
  }, []);

  // ?¸ë¦¬ ?°ì´?°ë? ê³„ì¸µ êµ¬ì¡°ë¡?ë³€?˜í•˜???¨ìˆ˜ (SEIZE_TO_BIST ë°©ì‹)
  const convertToHierarchicalTree = (flatTree: any[], selectedMenu?: Menu | null) => {
    if (!flatTree || flatTree.length === 0) return [];
    
    console.log('?”„ ê³„ì¸µ êµ¬ì¡° ë³€???œì‘ - ?…ë ¥ ?°ì´??', flatTree);
    console.log('?¯ ? íƒ??ë©”ë‰´:', selectedMenu);
    
    const treeMap = new Map();
    const rootNodes: any[] = [];
    
    // ëª¨ë“  ?¸ë“œë¥?ë§µì— ?€??(ë¬¸ì???¤ë¡œ ?µì¼)
    flatTree.forEach((item, index) => {
      treeMap.set(String(item.MENU_SEQ), {
        ...item,
        children: [],
        index: index
      });
    });
    
    // ë¶€ëª??ì‹ ê´€ê³??¤ì •
    flatTree.forEach((item) => {
      const node = treeMap.get(String(item.MENU_SEQ));
      
      // HGRK_MENU_SEQ ?€??ì²´í¬ ë°?ë£¨íŠ¸ ?¸ë“œ ?ë³„
      const hgrkMenuSeq = String(item.HGRK_MENU_SEQ);
      const isRoot = hgrkMenuSeq === '0' || hgrkMenuSeq === 'null' || hgrkMenuSeq === 'undefined';
      
      console.log(`?” ?¸ë“œ ë¶„ì„: ${item.MENU_DSP_NM}, HGRK_MENU_SEQ: ${hgrkMenuSeq} (?€?? ${typeof hgrkMenuSeq}), ë£¨íŠ¸?¬ë?: ${isRoot}`);
      
      if (isRoot) {
        console.log('?Œ³ ë£¨íŠ¸ ?¸ë“œ ì¶”ê?:', item.MENU_DSP_NM, 'MENU_SEQ:', item.MENU_SEQ);
        rootNodes.push(node);
      } else {
        // ?˜ìœ„ ?¸ë“œ - ë¶€ëª?ì°¾ê¸° (ë¬¸ì?´ë¡œ ?µì¼)
        const parent = treeMap.get(hgrkMenuSeq);
        if (parent) {
          console.log('?‘¶ ?˜ìœ„ ?¸ë“œ ì¶”ê?:', item.MENU_DSP_NM, '??ë¶€ëª?', parent.MENU_DSP_NM);
          parent.children.push(node);
        } else {
          console.log('? ï¸ ë¶€ëª¨ë? ì°¾ì„ ???†ìŒ:', item.MENU_DSP_NM, 'HGRK_MENU_SEQ:', hgrkMenuSeq);
          // ë¶€ëª¨ë? ì°¾ì„ ???†ìœ¼ë©?ë£¨íŠ¸ë¡?ì¶”ê?
          rootNodes.push(node);
        }
      }
    });
    
    // SEIZE_TO_BIST ë°©ì‹: ? íƒ??ë©”ë‰´ë¥?ìµœìƒ???¸ë“œë¡?ì¶”ê?
    if (selectedMenu) {
      const topLevelNode = {
        MENU_ID: selectedMenu.MENU_ID,
        HGRK_MENU_SEQ: '',
        MENU_SEQ: '0',  // ìµœìƒ??ë©”ë‰´??"0"
        MENU_DSP_NM: selectedMenu.MENU_NM,
        children: rootNodes,  // ê¸°ì¡´ ë£¨íŠ¸ ?¸ë“œ?¤ì„ ?˜ìœ„ë¡??´ë™
        index: -1,
        expanded: true
      };
      
      console.log('?‘‘ ? íƒ??ë©”ë‰´ë¥?ìµœìƒ???¸ë“œë¡??¤ì •:', selectedMenu.MENU_NM);
      console.log('?“Š ìµœìƒ???¸ë“œ ?˜ìœ„??ê¸°ì¡´ ë£¨íŠ¸ ?¸ë“œ??ë°°ì¹˜:', rootNodes.length, 'ê°?);
      
      return [topLevelNode];
    }
    
    console.log('??ê³„ì¸µ êµ¬ì¡° ë³€???„ë£Œ - ë£¨íŠ¸ ?¸ë“œ ??', rootNodes.length);
    console.log('?“Š ìµœì¢… ?¸ë¦¬ êµ¬ì¡°:', rootNodes);
    
    return rootNodes;
  };

  // ë©”ë‰´ ?¸ë¦¬ ë¶ˆëŸ¬?¤ê¸° (?¹ì • ë©”ë‰´ ê¸°ì?)
  const loadMenuTreeByMenu = useCallback(async (menuId: string, selectedMenu?: Menu | null) => {
    try {
      console.log('?”„ [DEBUG] ?¸ë¦¬ ?¬ì¡°???¨ìˆ˜ ?¤í–‰! menuId:', menuId);
      console.log('?“¡ API ?¸ì¶œ: MenuService.getMenuTreeByMenu(', menuId, ')');
      
      const tree = await MenuService.getMenuTreeByMenu(menuId);
      
      console.log('??[DEBUG] ?¸ë¦¬ API ?‘ë‹µ:', tree);
      console.log('?“Š ì¡°íšŒ???¸ë¦¬ ?°ì´??ê°œìˆ˜:', tree?.length || 0);
      
      // ?‰ë©´ ?°ì´?°ë? ê³„ì¸µ êµ¬ì¡°ë¡?ë³€??(? íƒ??ë©”ë‰´ë¥?ìµœìƒ?„ë¡œ ?¤ì •)
      const hierarchicalTree = convertToHierarchicalTree(tree || [], selectedMenu);
      console.log('?“Š [DEBUG] ê³„ì¸µ êµ¬ì¡°ë¡?ë³€?˜ëœ ?¸ë¦¬:', hierarchicalTree);
      
      // ?¸ë¦¬ ?¸ë“œ???¸ë±??? ë‹¹
      assignTreeIndexes(hierarchicalTree);
      console.log('?“Š [DEBUG] ?¸ë±??? ë‹¹???¸ë¦¬:', hierarchicalTree);
      
      setMenuTree((prev) => {
        console.log('?Ÿ¢ [DEBUG] setMenuTree ?¸ì¶œ! ?´ì „:', prev, '?ˆê°’:', hierarchicalTree);
        return hierarchicalTree;
      });
      
      // ?ŒìŠ¤?¸ìš©: ëª¨ë“  ?¸ë“œë¥??¼ì³ì§??íƒœë¡??¤ì •
      const allIndexes: number[] = [];
      const collectAllIndexes = (nodes: any[]) => {
        nodes.forEach((node) => {
          if (node.treeIndex !== undefined) {
            allIndexes.push(node.treeIndex);
          }
          if (node.children && node.children.length > 0) {
            collectAllIndexes(node.children);
          }
        });
      };
      collectAllIndexes(hierarchicalTree);
      setOpenIndexes(allIndexes);
      
      console.log('?¯ ?¸ë¦¬ ?íƒœ ?…ë°?´íŠ¸ ?„ë£Œ');
    } catch (error: any) {
      console.error('??ë©”ë‰´ ?¸ë¦¬ ì¡°íšŒ ?¤íŒ¨:', error);
    }
  }, []);

  // ë©”ë‰´ ?ì„¸ ë¶ˆëŸ¬?¤ê¸°
  const loadMenuDetails = useCallback(async (menuId: string) => {
    if (!menuId) return;
    try {
      setMenuDetails([]);
    } catch (error: any) {
      console.error('ë©”ë‰´ ?ì„¸ ì¡°íšŒ ?¤íŒ¨:', error);
    }
  }, []);

  // ë©”ë‰´ë³??„ë¡œê·¸ë¨ ëª©ë¡ ë¶ˆëŸ¬?¤ê¸°
  const loadMenuPrograms = useCallback(async (menuId: string, menuSeq: number) => {
    if (!menuId) return;
    try {
      const programs = await MenuService.getMenuPrograms(menuId, menuSeq);
      setMenuPrograms(programs);
    } catch (error: any) {
      console.error('ë©”ë‰´ë³??„ë¡œê·¸ë¨ ì¡°íšŒ ?¤íŒ¨:', error);
    }
  }, []);

  // ?„ë¡œê·¸ë¨ ê²€??
  const searchPrograms = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await MenuService.searchPrograms(keyword);
      setSearchResults(results);
    } catch (error: any) {
      console.error('?„ë¡œê·¸ë¨ ê²€???¤íŒ¨:', error);
      setSearchResults([]);
    }
  }, []);

  // ?¤ì‹œê°??…ë°?´íŠ¸ ?¨ìˆ˜??
  const refreshTree = useCallback(async () => {
    await loadMenuTree();
  }, [loadMenuTree]);

  const refreshPrograms = useCallback(async () => {
    if (selectedMenu?.MENU_ID) {
      await loadMenuPrograms(selectedMenu.MENU_ID, 0);
    }
  }, [selectedMenu?.MENU_ID, loadMenuPrograms]);

  // ?¸ë¦¬ ?œì„œ ?…ë°?´íŠ¸ (?œë˜ê·????œë¡­ ?€ì²?
  const updateTreeOrder = useCallback(async (menuId: string, treeData: any[]) => {
    try {
      await MenuService.updateMenuTreeOrder(menuId, treeData);
      showToast('?¸ë¦¬ ?œì„œê°€ ?…ë°?´íŠ¸?˜ì—ˆ?µë‹ˆ??', 'success');
      // ?¤ì‹œê°??…ë°?´íŠ¸
      await refreshTree();
    } catch (error: any) {
      console.error('?¸ë¦¬ ?œì„œ ?…ë°?´íŠ¸ ?¤íŒ¨:', error);
      showToast(`?¸ë¦¬ ?œì„œ ?…ë°?´íŠ¸ ?¤íŒ¨: ${error?.message || '?????†ëŠ” ?¤ë¥˜'}`, 'error');
    }
  }, [refreshTree, showToast]);

  // ë©”ë‰´???„ë¡œê·¸ë¨ ì¶”ê?
  const addMenuProgram = useCallback(async (program: any) => {
    if (!selectedMenu) return;
    try {
      await MenuService.addMenuProgram(selectedMenu.MENU_ID, {
        pgmId: program.PGM_ID,
        menuDspNm: program.PGM_NM,
        menuShpDvcd: program.MENU_SHP_DVCD || 'P', // 304 ?€ë¶„ë¥˜ ì½”ë“œ???Œë¶„ë¥?ì½”ë“œ
        useYn: 'Y',
        chngrId: 'SYSTEM',
        hgrkMenuSeq: selectedMenu.MENU_SEQ // ?¸ë¦¬?ì„œ ? íƒ??ë©”ë‰´??MENU_SEQ
      });
      await loadMenuPrograms(selectedMenu.MENU_ID, 0);
      setShowProgramSearch(false);
      setProgramSearchKeyword('');
      showToast('?„ë¡œê·¸ë¨??ì¶”ê??˜ì—ˆ?µë‹ˆ??', 'success');
    } catch (error: any) {
      showToast(`?„ë¡œê·¸ë¨ ì¶”ê? ?¤íŒ¨: ${error.message}`, 'error');
    }
  }, [selectedMenu, loadMenuPrograms, showToast]);

  // ë©”ë‰´ ?„ë¡œê·¸ë¨ ?? œ
  const deleteMenuPrograms = useCallback(async () => {
    if (!selectedMenu || selectedPrograms.size === 0) return;
    
    showConfirm({
      message: '? íƒ???„ë¡œê·¸ë¨?¤ì„ ?? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?',
      type: 'warning',
      onConfirm: async () => {
        try {
          const deletePromises = Array.from(selectedPrograms).map(menuSeq =>
            MenuService.deleteMenuProgram(selectedMenu.MENU_ID, menuSeq)
          );
          await Promise.all(deletePromises);
          await loadMenuPrograms(selectedMenu.MENU_ID, 0);
          await loadMenuTreeByMenu(selectedMenu.MENU_ID, selectedMenu); // ë©”ë‰´ ?¸ë¦¬ë·??¬ì¡°??
          setSelectedPrograms(new Set());
          showToast('? íƒ???„ë¡œê·¸ë¨?¤ì´ ?? œ?˜ì—ˆ?µë‹ˆ??', 'success');
        } catch (error: any) {
          showToast(`?„ë¡œê·¸ë¨ ?? œ ?¤íŒ¨: ${error.message}`, 'error');
        }
      }
    });
  }, [selectedMenu, selectedPrograms, loadMenuPrograms, loadMenuTreeByMenu, showToast, showConfirm]);

  // ë©”ë‰´ë³??„ë¡œê·¸ë¨ ??ì¶”ê?
  const handleAddProgramRow = () => {
    setMenuPrograms(prev => [
      ...prev,
      {
        MENU_SHP_DVCD: '', // 304 ?€ë¶„ë¥˜ ì½”ë“œ???Œë¶„ë¥?ì½”ë“œ
        MENU_SHP_DVCD_NM: '', // ?œì‹œëª?ì´ˆê¸°??
        MENU_DSP_NM: '',
        PGM_ID: '',
        PGM_NM: '',
        SORT_SEQ: prev.length + 1,
        USE_YN: 'Y',
        checked: false,
      },
    ]);
  };

  // ë©”ë‰´ë³??„ë¡œê·¸ë¨ ???? œ (ê³„ì¸µ êµ¬ì¡° ?? œ)
  const handleDeleteProgramRows = async () => {
    if (selectedPrograms.size === 0) {
      showToast('?? œ????ª©??? íƒ?´ì£¼?¸ìš”.', 'warning');
      return;
    }
    if (!selectedMenu?.MENU_ID) {
      showToast('ë©”ë‰´ê°€ ? íƒ?˜ì? ?Šì•˜?µë‹ˆ??', 'warning');
      return;
    }
    
    showConfirm({
      message: '? íƒ???„ë¡œê·¸ë¨?¤ê³¼ ?˜ìœ„ ??ª©?¤ì„ ëª¨ë‘ ?? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?',
      type: 'warning',
      onConfirm: async () => {
        setLoading(true);
        try {
          // ? íƒ???‰ì˜ MENU_SEQë§?ì¶”ì¶œ
          const selectedRows = Array.from(selectedPrograms).map(idx => menuPrograms[idx]);
          const menuSeqs = selectedRows.map(row => row.MENU_SEQ).filter(Boolean);
          // ?ˆë¡œ??ê³„ì¸µ ?? œ API ?¸ì¶œ
          await MenuService.deleteMenuProgramsHierarchical(selectedMenu.MENU_ID, menuSeqs);
          showToast('? íƒ???„ë¡œê·¸ë¨?¤ê³¼ ?˜ìœ„ ??ª©?¤ì´ ëª¨ë‘ ?? œ?˜ì—ˆ?µë‹ˆ??', 'success');
          // ?”ë©´ ê°±ì‹  - ?ë˜ ? íƒ??ë©”ë‰´???œí€€???¬ìš©
          const selectedMenuSeq = selectedTreeNode?.MENU_SEQ ?? selectedMenu.MENU_SEQ ?? 0;
          await loadMenuPrograms(selectedMenu.MENU_ID, selectedMenuSeq);
          await loadMenuTreeByMenu(selectedMenu.MENU_ID, selectedMenu);
          setSelectedPrograms(new Set());
        } catch (error: any) {
          showToast(`?? œ ?¤íŒ¨: ${error?.message || '?????†ëŠ” ?¤ë¥˜'}`, 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // ë©”ë‰´ë³??„ë¡œê·¸ë¨ ?€??
  const handleSavePrograms = async () => {
    if (!selectedMenu) {
      showToast('ë©”ë‰´ê°€ ? íƒ?˜ì? ?Šì•˜?µë‹ˆ??', 'warning');
      return;
    }
    if (menuPrograms.length === 0) {
      showToast('?€?¥í•  ?„ë¡œê·¸ë¨???†ìŠµ?ˆë‹¤.', 'warning');
      return;
    }
    // ? íš¨??ê²€??
    for (let i = 0; i < menuPrograms.length; i++) {
      const row = menuPrograms[i];
      if (!row.MENU_DSP_NM) {
        showToast('?œì‹œëª…ì„ ?…ë ¥?˜ì„¸??', 'warning');
        return;
      }
      if (row.MENU_SHP_DVCD === 'P' && !row.PGM_ID) {
        showToast('?„ë¡œê·¸ë¨??? íƒ?˜ì„¸??', 'warning');
        return;
      }
    }

    showConfirm({
      message: '?„ë¡œê·¸ë¨ ?•ë³´ë¥??€?¥í•˜?œê² ?µë‹ˆê¹?',
      type: 'info',
      onConfirm: async () => {
        // HGRK_MENU_SEQ ë³´ì¥ - ?¸ë¦¬?ì„œ ? íƒ??ë©”ë‰´??MENU_SEQ ?¬ìš©
        const programsToSave = menuPrograms.map(row => ({
          ...row,
          HGRK_MENU_SEQ: selectedTreeNode?.MENU_SEQ ?? selectedMenu.MENU_SEQ ?? 0
        }));

        try {
          await MenuService.saveMenuPrograms(selectedMenu.MENU_ID, programsToSave);
          showToast('?€?¥ë˜?ˆìŠµ?ˆë‹¤.', 'success');
          // ?”ë©´ ê°±ì‹  - ?ë˜ ? íƒ??ë©”ë‰´???œí€€???¬ìš©
          const selectedMenuSeq = selectedTreeNode?.MENU_SEQ ?? selectedMenu.MENU_SEQ ?? 0;
          await loadMenuPrograms(selectedMenu.MENU_ID, selectedMenuSeq);
          await loadMenuTreeByMenu(selectedMenu.MENU_ID, selectedMenu);
          setSelectedPrograms(new Set());
        } catch (e: any) {
          showToast('?€???¤íŒ¨: ' + (e?.message || '?????†ëŠ” ?¤ë¥˜'), 'error');
        }
      }
    });
  };

  // ê²€??ì¡°ê±´ ë³€ê²??¸ë“¤??
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchConditions((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ?”í„° ?…ë ¥ ??ê²€??
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === 'Enter') {
      loadMenus();
    }
  };



  // ? ê·œ ë©”ë‰´
  const handleNew = () => {
    setIsNewMenu(true);
    setSelectedMenu({
      MENU_ID: '',
      MENU_NM: '',
      USE_YN: 'Y',
      SORT_SEQ: 1,
      MENU_LEVEL: 1,
    });
    setMenuDetails([]);
    setMenuTree([]);
    setMenuPrograms([]);
    setSelectedDetails(new Set());
    setSelectedPrograms(new Set());
  };

  // ??ë©”ë‰´ ID ?ì„±
  const generateNewMenuId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `M${year}${month}${day}${random}`;
  };

  // ?€??
  const handleSave = async () => {
    if (!selectedMenu) return;

    if (!selectedMenu.MENU_NM.trim()) {
      showToast('ë©”ë‰´ëª…ì„ ?…ë ¥?´ì£¼?¸ìš”.', 'warning');
      return;
    }

    try {
      if (isNewMenu) {
        const newMenuId = generateNewMenuId();
        const menuData: MenuCreateDto = {
          MENU_NM: selectedMenu.MENU_NM,
          USE_YN: selectedMenu.USE_YN,
          SORT_SEQ: selectedMenu.SORT_SEQ,
          MENU_LEVEL: selectedMenu.MENU_LEVEL,
        };

        await MenuService.createMenu(menuData);
        showToast('ë©”ë‰´ê°€ ?ì„±?˜ì—ˆ?µë‹ˆ??', 'success');
        
        // ?€????ëª¨ë“  ?°ì´??ì´ˆê¸°??ë°??¬ì¡°??
        await loadMenus();
      } else {
        const menuData: MenuUpdateDto = {
          MENU_NM: selectedMenu.MENU_NM,
          USE_YN: selectedMenu.USE_YN,
        };

        await MenuService.updateMenu(selectedMenu.MENU_ID, menuData);
        showToast('ë©”ë‰´ê°€ ?˜ì •?˜ì—ˆ?µë‹ˆ??', 'success');
        
        // ?€????ëª¨ë“  ?°ì´??ì´ˆê¸°??ë°??¬ì¡°??
        await loadMenus();
      }
    } catch (error: any) {
      showToast(`?€???¤íŒ¨: ${error?.message || '?????†ëŠ” ?¤ë¥˜'}`, 'error');
    }
  };

  // ?? œ
  const handleDelete = async () => {
    if (!selectedMenu) return;

    showConfirm({
      message: '?•ë§ë¡??? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?',
      type: 'warning',
      onConfirm: async () => {
        try {
          await MenuService.deleteMenu(selectedMenu.MENU_ID);
          showToast('ë©”ë‰´ê°€ ?? œ?˜ì—ˆ?µë‹ˆ??', 'success');
          // ?? œ ??ëª¨ë“  ?°ì´??ì´ˆê¸°??ë°??¬ì¡°??
          await loadMenus();
        } catch (error: any) {
          showToast(`?? œ ?¤íŒ¨: ${error?.message || '?????†ëŠ” ?¤ë¥˜'}`, 'error');
        }
      }
    });
  };

  // ë³µì‚¬ ?€??
  const handleCopy = async () => {
    if (!selectedMenu) {
      showToast('ë³µì‚¬??ë©”ë‰´ë¥?ë¨¼ì? ? íƒ?´ì£¼?¸ìš”.', 'warning');
      return;
    }

    showConfirm({
      message: `${selectedMenu.MENU_NM} ë©”ë‰´ë¥??ˆë¡œ ë³µì‚¬?˜ì‹œê² ìŠµ?ˆê¹Œ?`,
      type: 'info',
      onConfirm: async () => {
        try {
          setLoading(true);
          
          // SEIZE_TO_BIST ë°©ì‹?¼ë¡œ ë³µì‚¬ (ë©”ë‰´ ?•ë³´ + ë©”ë‰´ ?ì„¸ ëª¨ë‘ ë³µì‚¬)
          const result = await MenuService.copyMenu(selectedMenu.MENU_ID, selectedMenu.MENU_NM);
          
          showToast(`??ë©”ë‰´ '${result.MENU_NM}'??ê°€) ?±ê³µ?ìœ¼ë¡??ì„±?˜ì—ˆ?µë‹ˆ??`, 'success');
          
          // ë³µì‚¬ ??ëª¨ë“  ?°ì´??ì´ˆê¸°??ë°??¬ì¡°??
          await loadMenus();
          
        } catch (error: any) {
          console.error('ë©”ë‰´ ë³µì‚¬ ?¤íŒ¨:', error);
          showToast(`ë³µì‚¬ ?¤íŒ¨: ${error?.message || '?????†ëŠ” ?¤ë¥˜'}`, 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // ?ì„¸ ì²´í¬ë°•ìŠ¤
  const handleDetailCheck = (menuSeq: number) => {
    const newSelected = new Set(selectedDetails);
    if (newSelected.has(menuSeq)) {
      newSelected.delete(menuSeq);
    } else {
      newSelected.add(menuSeq);
    }
    setSelectedDetails(newSelected);
  };

  // ?„ì²´ ? íƒ
  const handleSelectAll = () => {
    if (selectedDetails.size === menuDetails.length) {
      setSelectedDetails(new Set());
    } else {
      setSelectedDetails(new Set(menuDetails.map(detail => detail.MENU_SEQ)));
    }
  };

  // ë©”ë‰´ ? ê? ë°??´ë¦­ ?´ë²¤??
  const toggleMenu = (nodeIndex: number) => {
    setOpenIndexes(prev => {
      const newIndexes = prev.includes(nodeIndex) 
        ? prev.filter(i => i !== nodeIndex)
        : [...prev, nodeIndex];
      
      // ê°œë³„ ? ê? ???„ì²´ ?•ì¥ ?íƒœ ?…ë°?´íŠ¸
      const totalNodes = countTotalNodes(menuTree);
      setTreeExpanded(newIndexes.length === totalNodes);
      
      return newIndexes;
    });
  };

  // ?¸ë¦¬ ?¸ë“œ ?´ë¦­ ???„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ (SEIZE_TO_BIST ë°©ì‹)
  const handleTreeClick = async (node: any) => {
    try {
      setSelectedTreeNode(node);
      // setSelectedMenu(...) ?¸ì¶œ ?œê±°!
      const programs = await MenuService.getMenuPrograms(node.MENU_ID, node.MENU_SEQ);
      setMenuPrograms(programs);
      setSelectedPrograms(new Set());
    } catch (error: any) {
      showToast(`?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ ?¤íŒ¨: ${error?.message || '?????†ëŠ” ?¤ë¥˜'}`, 'error');
    }
  };

  // ?¸ë¦¬ ?¸ë“œ???¸ë±??? ë‹¹?˜ëŠ” ?¨ìˆ˜
  const assignTreeIndexes = (nodes: any[], startIndex: number = 0): number => {
    let currentIndex = startIndex;
    
    const assignIndexes = (nodeList: any[]) => {
      nodeList.forEach(node => {
        node.treeIndex = currentIndex++;
        if (node.children && node.children.length > 0) {
          assignIndexes(node.children);
        }
      });
    };
    
    assignIndexes(nodes);
    return currentIndex;
  };

  // ?„ì²´ ?¸ë“œ ê°œìˆ˜ ê³„ì‚°
  const countTotalNodes = (nodes: any[]): number => {
    let count = 0;
    const countNodes = (nodeList: any[]) => {
      nodeList.forEach(node => {
        count++;
        if (node.children && node.children.length > 0) {
          countNodes(node.children);
        }
      });
    };
    countNodes(nodes);
    return count;
  };

  // ?„ì—­ postMessage ?˜ì‹  (?”ë²„ê¹?ë°??¤ì œ ì²˜ë¦¬)
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      if (event.data?.type === 'SELECTED_PROGRAMS') {
        const programs = event.data.data;
        const pgmIdParam = event.data.PGM_ID;
        if (!selectedMenu || !programs || programs.length === 0) return;

        if (pgmIdParam === 'INSERT_ROWS') {
          // ê¸°ì¡´ ë¡œì§: ì¤‘ë³µ ?†ì´ ë§??¤ì— ì¶”ê?
          setMenuPrograms(prev => {
            const existingPgmIds = new Set(prev.map(row => row.PGM_ID));
            const newRows = (programs as any[])
              .filter((program) => !existingPgmIds.has(program.PGM_ID))
              .map((program: any, idx: number) => ({
                MENU_DSP_NM: program.PGM_NM,
                MENU_SHP_DVCD: 'P',
                PGM_ID: program.PGM_ID,
                USE_YN: 'Y',
                CHNGR_ID: 'SYSTEM',
                HGRK_MENU_SEQ: selectedMenu.MENU_SEQ,
                SORT_SEQ: prev.length + idx + 1
              }));
            return [...prev, ...newRows];
          });
        } else {
          // ë°›ì? PGM_IDê°€ ?«ì?¼ë©´ ?´ë‹¹ ?œë²ˆ???½ì…/ì¹˜í™˜
          if (programs.length > 1) {
            showToast('1ê°œë§Œ ? íƒ??ì£¼ì„¸??', 'warning');
            return;
          }
          const insertIndex = Number(pgmIdParam);
          if (isNaN(insertIndex) || insertIndex < 0) return;
          setMenuPrograms(prev => {
            const existingPgmIds = new Set(prev.map(row => row.PGM_ID));
            // ì¤‘ë³µ ë°©ì?: ê¸°ì¡´???†ëŠ” ?„ë¡œê·¸ë¨ë§?
            const newRows = (programs as any[])
              .filter((program) => !existingPgmIds.has(program.PGM_ID))
              .map((program: any) => ({
                MENU_DSP_NM: program.PGM_NM,
                MENU_SHP_DVCD: 'P',
                PGM_ID: program.PGM_ID,
                USE_YN: 'Y',
                CHNGR_ID: 'SYSTEM',
                HGRK_MENU_SEQ: selectedMenu.MENU_SEQ,
                SORT_SEQ: insertIndex + 1
              }));
            if (newRows.length === 0) return prev;
            // ê¸°ì¡´ ë°°ì—´ ë³µì‚¬
            const updated = [...prev];
            // ?´ë‹¹ ?¸ë±?¤ì— ì¹˜í™˜ ?ëŠ” ?½ì…
            if (insertIndex < updated.length) {
              updated.splice(insertIndex, 1, ...newRows);
            } else {
              // ?¸ë±?¤ê? ë²”ìœ„ ë°–ì´ë©?ë§??¤ì— ì¶”ê?
              updated.push(...newRows);
            }
            // SORT_SEQ ?¬ì •??
            return updated.map((row, idx) => ({ ...row, SORT_SEQ: idx + 1 }));
          });
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [selectedMenu]);

  return (
    <div className="mdi">
      {/* ì¡°íšŒ ?ì—­ */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[110px]">ë©”ë‰´IDëª?/th>
              <td className="search-td w-[20%]">
                <input
                  type="text"
                  name="MENU_KWD"
                  className="input-base input-default w-full"
                  value={searchConditions.MENU_KWD}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                />
              </td>
              <th className="search-th w-[100px]">?¬ìš©?¬ë?</th>
              <td className="search-td w-[10%]">
                <select
                  name="USE_YN"
                  className="combo-base w-full min-w-[80px]"
                  value={searchConditions.USE_YN}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                >
                  <option value="">?„ì²´</option>
                  <option value="Y">?¬ìš©</option>
                  <option value="N">ë¯¸ì‚¬??/option>
                </select>
              </td>
              <td className="search-td text-right" colSpan={1}>
                <button type="button" className="btn-base btn-search" onClick={loadMenus}>
                  ì¡°íšŒ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ë©”ë‰´ ëª©ë¡ ê·¸ë¦¬??*/}
      <div className="gridbox-div mb-4 ag-theme-alpine" style={{ height: 'calc(100vh - 400px)', minHeight: '300px' }}>
        <AgGridReact
          ref={menuGridRef}
          rowData={menus}
          columnDefs={menuColDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            suppressSizeToFit: false,
          }}
          rowSelection='single'
          onSelectionChanged={onMenuSelectionChanged}
          onGridReady={onMenuGridReady}
          loadingOverlayComponent={() => <div className="text-center py-4">ë¡œë”© ì¤?..</div>}
          noRowsOverlayComponent={() => <div className="text-center py-4">ì¡°íšŒ???•ë³´ê°€ ?†ìŠµ?ˆë‹¤.</div>}
          suppressRowClickSelection={false}
          animateRows={true}
          rowHeight={32}
          headerHeight={40}
          data-testid="menu-grid"
        />
      </div>

      {/* ?ì„¸ ?…ë ¥ ??*/}
      <table className="form-table w-full mb-4">
        <tbody>
          <tr className="form-tr">
            <th className="form-th w-[130px] required">ë©”ë‰´ëª?/th>
            <td className="form-td w-[250px]">
              <input
                type="text"
                className="input-base input-default w-full"
                value={selectedMenu?.MENU_NM || ''}
                onChange={e => setSelectedMenu(prev => prev ? { ...prev, MENU_NM: e.target.value } : null)}
                disabled={!selectedMenu}
              />
            </td>
            <th className="form-th w-[130px]">?¬ìš©?¬ë?</th>
            <td className="form-td w-[10%]">
              <select
                className="combo-base w-full min-w-[60px]"
                value={selectedMenu?.USE_YN || 'Y'}
                disabled={!selectedMenu}
                onChange={e => setSelectedMenu(prev => prev ? { ...prev, USE_YN: e.target.value } : null)}
              >
                <option value="">?„ì²´</option>
                <option value="Y">?¬ìš©</option>
                <option value="N">ë¯¸ì‚¬??/option>
              </select>
            </td>
            <td className="form-td"></td>
          </tr>
        </tbody>
      </table>

      {/* ë²„íŠ¼ ??*/}
      <div className="flex gap-2 justify-end mb-4">
        <button type="button" className="btn-base btn-delete" onClick={handleDelete} disabled={!selectedMenu || isNewMenu}>ë©”ë‰´?? œ</button>
        <button type="button" className="btn-base btn-etc" onClick={handleCopy} disabled={!selectedMenu}>ë³µì‚¬?€??/button>
        <button type="button" className="btn-base btn-etc" onClick={handleNew}>? ê·œ</button>
        <button type="button" className="btn-base btn-act" onClick={handleSave} disabled={!selectedMenu}>?€??/button>
      </div>

      {/* ë©”ë‰´ ?¸ë¦¬ + ?„ë¡œê·¸ë¨ ?•ë³´ */}
      <div className="flex w-full gap-4 mt-4" style={{ height: 'calc(100vh - 600px)', minHeight: '200px' }}>
        {/* ì¢Œì¸¡: ë©”ë‰´ ?¸ë¦¬ */}
        <div className="w-1/3 flex flex-col">
          <div className="tit_area flex justify-between items-center">
            <h3>ë©”ë‰´ ëª©ë¡</h3>
            <div className="flex gap-1">
              <button 
                type="button" 
                className="text-xl text-gray-500"
                onClick={() => {
                  const allIndexes: number[] = [];
                  const collectAllIndexes = (nodes: any[]) => {
                    nodes.forEach((node) => {
                      if (node.treeIndex !== undefined) {
                        allIndexes.push(node.treeIndex);
                      }
                      if (node.children && node.children.length > 0) {
                        collectAllIndexes(node.children);
                      }
                    });
                  };
                  collectAllIndexes(menuTree);
                  setOpenIndexes(allIndexes);
                  setTreeExpanded(true);
                }}
              >
                ï¼?
              </button>
              <button 
                type="button" 
                className="text-xl text-gray-400"
                onClick={() => {
                  setOpenIndexes([]);
                  setTreeExpanded(false);
                }}
              >
                ï¼?
              </button>
            </div>
          </div>
          <div className="menu-tree-wrap flex-1 overflow-auto">
            <ul className="menu-tree" style={{ listStyle: 'none' }}>
              {menuTree.length === 0 ? (
                <li className="text-gray-500 text-center p-4">ë©”ë‰´ ?¸ë¦¬ê°€ ?†ìŠµ?ˆë‹¤.</li>
              ) : (
                menuTree.map((item, idx) => (
                  <TreeNode 
                    key={item.MENU_SEQ || idx} 
                    node={item} 
                    level={0} 
                    index={item.treeIndex || idx}
                    onToggle={toggleMenu}
                    onSelect={handleTreeClick}
                    openIndexes={openIndexes}
                    selectedTreeNode={selectedTreeNode}
                  />
                ))
              )}
            </ul>
          </div>
        </div>

        {/* ?°ì¸¡: ë©”ë‰´ë³??„ë¡œê·¸ë¨ */}
        <div className="w-2/3 flex flex-col">
          <div className="tit_area flex justify-between items-center">
            <h3>ë©”ë‰´ ë³??„ë¡œê·¸ë¨</h3>
            <button type="button" className="btn-base btn-etc text-xs px-2 py-1"             onClick={() => {
              if (!selectedMenu) {
                showToast('ë©”ë‰´ë¥?ë¨¼ì? ? íƒ?´ì£¼?¸ìš”.', 'warning');
                return;
              }
              console.log('ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?´ë¦­ - selectedMenu:', selectedMenu);
              console.log('ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?´ë¦­ - MENU_ID:', selectedMenu.MENU_ID);
              openPopup({
                url: `/popup/sys/SYS1012R00?menuId=${selectedMenu.MENU_ID}`,
                size: 'large',
                position: 'center',
                options: {
                  width: 1200,
                  height: 800,
                  resizable: true,
                  scrollbars: true
                }
              });
            }}>
              ë©”ë‰´ë¯¸ë¦¬ë³´ê¸°
            </button>
          </div>

          <div className="gridbox-div flex-1 overflow-auto ag-theme-alpine">
            <AgGridReact
              ref={menuProgramGridRef}
              rowData={menuPrograms}
              columnDefs={menuProgramColDefs}
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
                suppressSizeToFit: false,
                editable: true,
              }}
              rowSelection='multiple'
              onSelectionChanged={onMenuProgramSelectionChanged}
              onGridReady={onMenuProgramGridReady}
              loadingOverlayComponent={() => <div className="text-center py-4">ë¡œë”© ì¤?..</div>}
              noRowsOverlayComponent={() => <div className="text-center py-4">ì¡°íšŒ???•ë³´ê°€ ?†ìŠµ?ˆë‹¤.</div>}
              suppressRowClickSelection={false}
              animateRows={true}
              rowHeight={32}
              headerHeight={40}
              data-testid="menu-program-grid"
              onCellValueChanged={(params) => {
                const { data, colDef, newValue } = params;
                const updated = [...menuPrograms];
                const index = updated.findIndex(item => item === data);
                if (index !== -1 && colDef.field) {
                  // êµ¬ë¶„ ì»¬ëŸ¼(MENU_SHP_DVCD_NM)??ë³€ê²½ëœ ê²½ìš°, MENU_SHP_DVCD???¨ê»˜ ?…ë°?´íŠ¸
                  if (colDef.field === 'MENU_SHP_DVCD_NM') {
                    // divisionCodes?ì„œ ? íƒ??ì½”ë“œ???´ë¦„ ì°¾ê¸°
                    if (Array.isArray(divisionCodes) && divisionCodes.length > 0) {
                      const selectedCode = divisionCodes.find(code => code.codeId === newValue);
                      if (selectedCode) {
                        // MENU_SHP_DVCD?€ MENU_SHP_DVCD_NM ëª¨ë‘ ?…ë°?´íŠ¸
                        updated[index] = { 
                          ...data, 
                          MENU_SHP_DVCD: newValue, // ?¤ì œ ì½”ë“œ ID
                          MENU_SHP_DVCD_NM: selectedCode.codeNm // ?œì‹œëª?
                        };
                      } else {
                        updated[index] = { ...data, [colDef.field]: newValue };
                      }
                    } else {
                      updated[index] = { ...data, [colDef.field]: newValue };
                    }
                  } else {
                    updated[index] = { ...data, [colDef.field]: newValue };
                  }
                  setMenuPrograms(updated);
                }
              }}
            />
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <button type="button" className="btn-base btn-etc text-xs px-2 py-1"             onClick={() => {
              if (!selectedMenu) {
                showToast('ë©”ë‰´ë¥?ë¨¼ì? ? íƒ?´ì£¼?¸ìš”.', 'warning');
                return;
              }
              // ?„ë¡œê·¸ë¨ ê²€???ì—… ?´ê¸° (?˜ë‹¨ ë²„íŠ¼: INSERT_ROWSë¥?PGM_IDë¡??„ë‹¬)
              openPopup({
                url: `/popup/sys/SYS1010D00?PGM_ID=INSERT_ROWS`,
                size: 'custom',
                position: 'center',
                options: {
                  width: 850,
                  height: 430,
                  resizable: false,
                  scrollbars: false
                }
              });
            }}>ì°¾ê¸°</button>
            <button type="button" className="btn-base btn-etc text-xs px-2 py-1" onClick={handleAddProgramRow}>ì¶”ê?</button>
            <button type="button" className="btn-base btn-delete text-xs px-2 py-1" onClick={handleDeleteProgramRows} disabled={selectedPrograms.size === 0}>?? œ</button>
            <button type="button" className="btn-base btn-act text-xs px-2 py-1" onClick={handleSavePrograms}>?€??/button>
          </div>
        </div>
      </div>
    </div>
  );
} 

