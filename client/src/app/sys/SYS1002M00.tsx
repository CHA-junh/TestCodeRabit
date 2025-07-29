/**
 * SYS1002M00 - 메뉴�??�로그램 관�??�면
 *
 * 주요 기능:
 * - 메뉴 목록 조회 �?검??
 * - 메뉴 ?�규 ?�록 �??�정/??��
 * - 메뉴�??�로그램 ?�결 관�?
 * - 메뉴 계층 구조 ?�리 ?�시
 * - 메뉴 미리보기 기능
 * - 메뉴 복사 기능
 *
 * API ?�동:
 * - GET /api/sys/sys-menus - 메뉴 목록 조회
 * - POST /api/sys/sys-menus - 메뉴 ?�??
 * - DELETE /api/sys/sys-menus/:menuId - 메뉴 ??��
 * - POST /api/sys/sys-menus/:menuId/copy - 메뉴 복사
 * - GET /api/sys/sys-menus/:menuId/programs - 메뉴�??�로그램 조회
 * - POST /api/sys/sys-menus/:menuId/programs - 메뉴�??�로그램 ?�??
 * - DELETE /api/sys/sys-menus/:menuId/programs - 메뉴�??�로그램 ??��
 * - POST /api/common/search - 공통코드 조회 (구분: 304)
 *
 * ?�태 관�?
 * - 메뉴 목록 �??�택??메뉴
 * - 메뉴�??�로그램 목록 �??�택???�로그램??
 * - 메뉴 ?�리 구조 �??�장/축소 ?�태
 * - 검??조건 (메뉴ID/�? ?�용?��?)
 * - 구분 코드 목록 (304 ?�분류)
 *
 * ?�용???�터?�이??
 * - 검??조건 ?�력 (메뉴ID/�? ?�용?��?)
 * - 메뉴 목록 ?�이�?(AG-Grid)
 * - 메뉴 계층 구조 ?�리 (좌측)
 * - 메뉴�??�로그램 목록 ?�이�?(?�측)
 * - 메뉴 ?�세 ?�보 ?�력 ??
 * - ?�???�규/??��/복사/미리보기 버튼
 *
 * ?��? ?�면:
 * - SYS1000M00: ?�로그램 관�?(?�로그램 ?�보)
 * - SYS1001M00: ?�로그램 그룹 관�?(그룹 ?�결)
 * - SYS1003M00: ?�용????�� 관�?(메뉴 권한)
 * - SYS1010D00: ?�로그램 검???�업
 * - SYS1012R00: 메뉴 미리보기 ?�업
 *
 * ?�이??구조:
 * - Menu: 메뉴 ?�보 (MENU_ID, MENU_NM, USE_YN, USER_CNT ??
 * - MenuProgram: 메뉴�??�로그램 ?�보 (MENU_SEQ, MENU_DSP_NM, MENU_SHP_DVCD, PGM_ID ??
 * - TreeNode: 메뉴 ?�리 ?�드 (children, treeIndex ??
 *
 * ?�이?�항:
 * - 메뉴??계층 구조�?관�?(MENU_SEQ�?계층 ?�현)
 * - 메뉴�??�로그램??구분?� 304 ?�분류 코드 ?�용
 * - 메뉴 복사 ???�위 메뉴?� ?�로그램???�께 복사
 * - 메뉴 미리보기???�업?�로 ?�제 메뉴 구조 ?�시
 * - ?�리 구조???��???컴포?�트�?구현
 * - 메뉴�??�로그램?� 계층????�� 지??
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

// ?��????�리 ?�드 컴포?�트
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
  const isTopLevel = node.MENU_SEQ === '0'; // 최상???�드 ?��?
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
        {isTopLevel && <span className="text-blue-500 mr-1">?��</span>}
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

  // AG-Grid 컬럼 ?�의 - 메뉴 목록
  const [menuColDefs] = useState<ColDef[]>([
    { headerName: 'No', field: 'rowIndex', width: 60, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1 },
    { headerName: '메뉴ID', field: 'MENU_ID', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '메뉴�?, field: 'MENU_NM', width: 200, flex: 1.5, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '?�용?��?', field: 'USE_YN', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '?�용?�수', field: 'USER_CNT', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '0' },
    { headerName: '변경자', field: 'CHNGR_NM', width: 100, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '-' },
    { headerName: '변경일??, field: 'CHNG_DTTM', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '-' },
  ]);

  // 304 ?�분류 코드???�분�?코드 목록
  const [divisionCodes, setDivisionCodes] = useState<Array<{codeId: string, codeNm: string}>>([]);

  // 304 ?�분류 코드???�분�?코드?�을 가?�오???�수
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
      console.error('304 ?�분류 코드 로드 �??�류:', error);
    }
  };

  // AG-Grid 컬럼 ?�의 - 메뉴�??�로그램
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
      headerName: '구분', 
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
        // params.data가 null??경우 ?�전?�게 처리
        if (!params.data) {
          return params.value || '';
        }
        
        // ?�버?�서 받�? MENU_SHP_DVCD_NM???�선 ?�용?�고, ?�으�?divisionCodes?�서 찾기
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
    { headerName: '?�시�?, field: 'MENU_DSP_NM', width: 150, flex: 1.2, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '?�로그램', field: 'PGM_ID', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { 
      headerName: '찾기', 
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
            찾기
          </button>
        );
      }
    },
    { headerName: '?�렬', field: 'SORT_SEQ', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', type: 'numericColumn' },
    { headerName: '?�용?��?', field: 'USE_YN', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Y', 'N'] } },
  ], [divisionCodes]);

  // ?�태 ?�의
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

  // ?�업 ??
  const { openPopup } = usePopup();

  // 초기 로드 - ?�단 그리??조회 �?304 ?�분류 코드 로드
  useEffect(() => {
    console.log('?�� SYS1002M00 ?�면 로드 - ?�단 그리??조회 ?�작');
    loadMenus();
    loadDivisionCodes(); // 304 ?�분류 코드 로드
  }, []);

  // ?�이??변�???컬럼 ?�기 조정
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

  // AG-Grid ?�벤???�들??
  const onMenuSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const menu = selectedRows[0];
      console.log('?�� 그리?�에??메뉴 ?�택??', menu);
      console.log('?�� ?�택??메뉴 ?�보:', {
        MENU_ID: menu.MENU_ID,
        MENU_NM: menu.MENU_NM,
        USE_YN: menu.USE_YN
      });
      setIsNewMenu(false);
      setSelectedMenu(menu);
      console.log('?�� 관???�이??로드 ?�작...');
      setMenuPrograms([]);
      setSelectedPrograms(new Set());
      // 메뉴 ?�리 로드 (SEIZE_TO_BIST 방식: ?�택??메뉴�?최상?�로 ?�정)
      if (menu.MENU_ID) {
        loadMenuTreeByMenu(menu.MENU_ID, menu);
        // 메뉴�??�로그램 ?�시 조회 (MENU_SEQ=0)
        loadMenuPrograms(menu.MENU_ID, 0);
      }
      console.log('??메뉴 ?�택 처리 ?�료');
    } else {
      setSelectedMenu(null);
      setMenuPrograms([]);
      setMenuTree([]); // ?�리??초기??
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
    console.log('?�택???�로그램??', selectedIndices);
  };

  const onMenuGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  const onMenuProgramGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };



  // ?�로그램 검???�들??
  const handleProgramSearch = (rowData: any, rowIndex: number) => {
    console.log('?�로그램 검???�릭:', rowData, rowIndex);
    // ?�로그램 검???�업 ?�기 (그리???�쪽: ?�릭??로우???�번??PGM_ID�??�달)
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

  // 메뉴�??�로그램 관�??�태
  const [menuPrograms, setMenuPrograms] = useState<any[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<Set<number>>(new Set());
  const [programSearchKeyword, setProgramSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showProgramSearch, setShowProgramSearch] = useState(false);
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  // 공통 초기???�수
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

  // 메뉴 목록 불러?�기
  const loadMenus = async () => {
    setLoading(true);
    resetAllData();
    try {
      const response: MenuListResponse = await MenuService.getMenuList(searchConditions);
      setMenus(response.data || []);
    } catch (error: any) {
      showToast(`메뉴 목록 조회 ?�패: ${error?.message || '?????�는 ?�류'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 ?�리 불러?�기 (?�체)
  const loadMenuTree = useCallback(async () => {
    try {
      const tree = await MenuService.getMenuTree('ALL');
      console.log('로드???�리 ?�이??', tree);
      
      // ?�면 ?�이?��? 계층 구조�?변??
      const hierarchicalTree = convertToHierarchicalTree(tree || []);
      console.log('계층 구조�?변?�된 ?�리:', hierarchicalTree);
      
      setMenuTree(hierarchicalTree);
      // ?�리 로드 ???�장 ?�태 초기??
      setOpenIndexes([]);
      setTreeExpanded(false);
    } catch (error: any) {
      console.error('메뉴 ?�리 조회 ?�패:', error);
    }
  }, []);

  // ?�리 ?�이?��? 계층 구조�?변?�하???�수 (SEIZE_TO_BIST 방식)
  const convertToHierarchicalTree = (flatTree: any[], selectedMenu?: Menu | null) => {
    if (!flatTree || flatTree.length === 0) return [];
    
    console.log('?�� 계층 구조 변???�작 - ?�력 ?�이??', flatTree);
    console.log('?�� ?�택??메뉴:', selectedMenu);
    
    const treeMap = new Map();
    const rootNodes: any[] = [];
    
    // 모든 ?�드�?맵에 ?�??(문자???�로 ?�일)
    flatTree.forEach((item, index) => {
      treeMap.set(String(item.MENU_SEQ), {
        ...item,
        children: [],
        index: index
      });
    });
    
    // 부�??�식 관�??�정
    flatTree.forEach((item) => {
      const node = treeMap.get(String(item.MENU_SEQ));
      
      // HGRK_MENU_SEQ ?�??체크 �?루트 ?�드 ?�별
      const hgrkMenuSeq = String(item.HGRK_MENU_SEQ);
      const isRoot = hgrkMenuSeq === '0' || hgrkMenuSeq === 'null' || hgrkMenuSeq === 'undefined';
      
      console.log(`?�� ?�드 분석: ${item.MENU_DSP_NM}, HGRK_MENU_SEQ: ${hgrkMenuSeq} (?�?? ${typeof hgrkMenuSeq}), 루트?��?: ${isRoot}`);
      
      if (isRoot) {
        console.log('?�� 루트 ?�드 추�?:', item.MENU_DSP_NM, 'MENU_SEQ:', item.MENU_SEQ);
        rootNodes.push(node);
      } else {
        // ?�위 ?�드 - 부�?찾기 (문자?�로 ?�일)
        const parent = treeMap.get(hgrkMenuSeq);
        if (parent) {
          console.log('?�� ?�위 ?�드 추�?:', item.MENU_DSP_NM, '??부�?', parent.MENU_DSP_NM);
          parent.children.push(node);
        } else {
          console.log('?�️ 부모�? 찾을 ???�음:', item.MENU_DSP_NM, 'HGRK_MENU_SEQ:', hgrkMenuSeq);
          // 부모�? 찾을 ???�으�?루트�?추�?
          rootNodes.push(node);
        }
      }
    });
    
    // SEIZE_TO_BIST 방식: ?�택??메뉴�?최상???�드�?추�?
    if (selectedMenu) {
      const topLevelNode = {
        MENU_ID: selectedMenu.MENU_ID,
        HGRK_MENU_SEQ: '',
        MENU_SEQ: '0',  // 최상??메뉴??"0"
        MENU_DSP_NM: selectedMenu.MENU_NM,
        children: rootNodes,  // 기존 루트 ?�드?�을 ?�위�??�동
        index: -1,
        expanded: true
      };
      
      console.log('?�� ?�택??메뉴�?최상???�드�??�정:', selectedMenu.MENU_NM);
      console.log('?�� 최상???�드 ?�위??기존 루트 ?�드??배치:', rootNodes.length, '�?);
      
      return [topLevelNode];
    }
    
    console.log('??계층 구조 변???�료 - 루트 ?�드 ??', rootNodes.length);
    console.log('?�� 최종 ?�리 구조:', rootNodes);
    
    return rootNodes;
  };

  // 메뉴 ?�리 불러?�기 (?�정 메뉴 기�?)
  const loadMenuTreeByMenu = useCallback(async (menuId: string, selectedMenu?: Menu | null) => {
    try {
      console.log('?�� [DEBUG] ?�리 ?�조???�수 ?�행! menuId:', menuId);
      console.log('?�� API ?�출: MenuService.getMenuTreeByMenu(', menuId, ')');
      
      const tree = await MenuService.getMenuTreeByMenu(menuId);
      
      console.log('??[DEBUG] ?�리 API ?�답:', tree);
      console.log('?�� 조회???�리 ?�이??개수:', tree?.length || 0);
      
      // ?�면 ?�이?��? 계층 구조�?변??(?�택??메뉴�?최상?�로 ?�정)
      const hierarchicalTree = convertToHierarchicalTree(tree || [], selectedMenu);
      console.log('?�� [DEBUG] 계층 구조�?변?�된 ?�리:', hierarchicalTree);
      
      // ?�리 ?�드???�덱???�당
      assignTreeIndexes(hierarchicalTree);
      console.log('?�� [DEBUG] ?�덱???�당???�리:', hierarchicalTree);
      
      setMenuTree((prev) => {
        console.log('?�� [DEBUG] setMenuTree ?�출! ?�전:', prev, '?�값:', hierarchicalTree);
        return hierarchicalTree;
      });
      
      // ?�스?�용: 모든 ?�드�??�쳐�??�태�??�정
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
      
      console.log('?�� ?�리 ?�태 ?�데?�트 ?�료');
    } catch (error: any) {
      console.error('??메뉴 ?�리 조회 ?�패:', error);
    }
  }, []);

  // 메뉴 ?�세 불러?�기
  const loadMenuDetails = useCallback(async (menuId: string) => {
    if (!menuId) return;
    try {
      setMenuDetails([]);
    } catch (error: any) {
      console.error('메뉴 ?�세 조회 ?�패:', error);
    }
  }, []);

  // 메뉴�??�로그램 목록 불러?�기
  const loadMenuPrograms = useCallback(async (menuId: string, menuSeq: number) => {
    if (!menuId) return;
    try {
      const programs = await MenuService.getMenuPrograms(menuId, menuSeq);
      setMenuPrograms(programs);
    } catch (error: any) {
      console.error('메뉴�??�로그램 조회 ?�패:', error);
    }
  }, []);

  // ?�로그램 검??
  const searchPrograms = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await MenuService.searchPrograms(keyword);
      setSearchResults(results);
    } catch (error: any) {
      console.error('?�로그램 검???�패:', error);
      setSearchResults([]);
    }
  }, []);

  // ?�시�??�데?�트 ?�수??
  const refreshTree = useCallback(async () => {
    await loadMenuTree();
  }, [loadMenuTree]);

  const refreshPrograms = useCallback(async () => {
    if (selectedMenu?.MENU_ID) {
      await loadMenuPrograms(selectedMenu.MENU_ID, 0);
    }
  }, [selectedMenu?.MENU_ID, loadMenuPrograms]);

  // ?�리 ?�서 ?�데?�트 (?�래�????�롭 ?��?
  const updateTreeOrder = useCallback(async (menuId: string, treeData: any[]) => {
    try {
      await MenuService.updateMenuTreeOrder(menuId, treeData);
      showToast('?�리 ?�서가 ?�데?�트?�었?�니??', 'success');
      // ?�시�??�데?�트
      await refreshTree();
    } catch (error: any) {
      console.error('?�리 ?�서 ?�데?�트 ?�패:', error);
      showToast(`?�리 ?�서 ?�데?�트 ?�패: ${error?.message || '?????�는 ?�류'}`, 'error');
    }
  }, [refreshTree, showToast]);

  // 메뉴???�로그램 추�?
  const addMenuProgram = useCallback(async (program: any) => {
    if (!selectedMenu) return;
    try {
      await MenuService.addMenuProgram(selectedMenu.MENU_ID, {
        pgmId: program.PGM_ID,
        menuDspNm: program.PGM_NM,
        menuShpDvcd: program.MENU_SHP_DVCD || 'P', // 304 ?�분류 코드???�분�?코드
        useYn: 'Y',
        chngrId: 'SYSTEM',
        hgrkMenuSeq: selectedMenu.MENU_SEQ // ?�리?�서 ?�택??메뉴??MENU_SEQ
      });
      await loadMenuPrograms(selectedMenu.MENU_ID, 0);
      setShowProgramSearch(false);
      setProgramSearchKeyword('');
      showToast('?�로그램??추�??�었?�니??', 'success');
    } catch (error: any) {
      showToast(`?�로그램 추�? ?�패: ${error.message}`, 'error');
    }
  }, [selectedMenu, loadMenuPrograms, showToast]);

  // 메뉴 ?�로그램 ??��
  const deleteMenuPrograms = useCallback(async () => {
    if (!selectedMenu || selectedPrograms.size === 0) return;
    
    showConfirm({
      message: '?�택???�로그램?�을 ??��?�시겠습?�까?',
      type: 'warning',
      onConfirm: async () => {
        try {
          const deletePromises = Array.from(selectedPrograms).map(menuSeq =>
            MenuService.deleteMenuProgram(selectedMenu.MENU_ID, menuSeq)
          );
          await Promise.all(deletePromises);
          await loadMenuPrograms(selectedMenu.MENU_ID, 0);
          await loadMenuTreeByMenu(selectedMenu.MENU_ID, selectedMenu); // 메뉴 ?�리�??�조??
          setSelectedPrograms(new Set());
          showToast('?�택???�로그램?�이 ??��?�었?�니??', 'success');
        } catch (error: any) {
          showToast(`?�로그램 ??�� ?�패: ${error.message}`, 'error');
        }
      }
    });
  }, [selectedMenu, selectedPrograms, loadMenuPrograms, loadMenuTreeByMenu, showToast, showConfirm]);

  // 메뉴�??�로그램 ??추�?
  const handleAddProgramRow = () => {
    setMenuPrograms(prev => [
      ...prev,
      {
        MENU_SHP_DVCD: '', // 304 ?�분류 코드???�분�?코드
        MENU_SHP_DVCD_NM: '', // ?�시�?초기??
        MENU_DSP_NM: '',
        PGM_ID: '',
        PGM_NM: '',
        SORT_SEQ: prev.length + 1,
        USE_YN: 'Y',
        checked: false,
      },
    ]);
  };

  // 메뉴�??�로그램 ????�� (계층 구조 ??��)
  const handleDeleteProgramRows = async () => {
    if (selectedPrograms.size === 0) {
      showToast('??��????��???�택?�주?�요.', 'warning');
      return;
    }
    if (!selectedMenu?.MENU_ID) {
      showToast('메뉴가 ?�택?��? ?�았?�니??', 'warning');
      return;
    }
    
    showConfirm({
      message: '?�택???�로그램?�과 ?�위 ??��?�을 모두 ??��?�시겠습?�까?',
      type: 'warning',
      onConfirm: async () => {
        setLoading(true);
        try {
          // ?�택???�의 MENU_SEQ�?추출
          const selectedRows = Array.from(selectedPrograms).map(idx => menuPrograms[idx]);
          const menuSeqs = selectedRows.map(row => row.MENU_SEQ).filter(Boolean);
          // ?�로??계층 ??�� API ?�출
          await MenuService.deleteMenuProgramsHierarchical(selectedMenu.MENU_ID, menuSeqs);
          showToast('?�택???�로그램?�과 ?�위 ??��?�이 모두 ??��?�었?�니??', 'success');
          // ?�면 갱신 - ?�래 ?�택??메뉴???�퀀???�용
          const selectedMenuSeq = selectedTreeNode?.MENU_SEQ ?? selectedMenu.MENU_SEQ ?? 0;
          await loadMenuPrograms(selectedMenu.MENU_ID, selectedMenuSeq);
          await loadMenuTreeByMenu(selectedMenu.MENU_ID, selectedMenu);
          setSelectedPrograms(new Set());
        } catch (error: any) {
          showToast(`??�� ?�패: ${error?.message || '?????�는 ?�류'}`, 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 메뉴�??�로그램 ?�??
  const handleSavePrograms = async () => {
    if (!selectedMenu) {
      showToast('메뉴가 ?�택?��? ?�았?�니??', 'warning');
      return;
    }
    if (menuPrograms.length === 0) {
      showToast('?�?�할 ?�로그램???�습?�다.', 'warning');
      return;
    }
    // ?�효??검??
    for (let i = 0; i < menuPrograms.length; i++) {
      const row = menuPrograms[i];
      if (!row.MENU_DSP_NM) {
        showToast('?�시명을 ?�력?�세??', 'warning');
        return;
      }
      if (row.MENU_SHP_DVCD === 'P' && !row.PGM_ID) {
        showToast('?�로그램???�택?�세??', 'warning');
        return;
      }
    }

    showConfirm({
      message: '?�로그램 ?�보�??�?�하?�겠?�니�?',
      type: 'info',
      onConfirm: async () => {
        // HGRK_MENU_SEQ 보장 - ?�리?�서 ?�택??메뉴??MENU_SEQ ?�용
        const programsToSave = menuPrograms.map(row => ({
          ...row,
          HGRK_MENU_SEQ: selectedTreeNode?.MENU_SEQ ?? selectedMenu.MENU_SEQ ?? 0
        }));

        try {
          await MenuService.saveMenuPrograms(selectedMenu.MENU_ID, programsToSave);
          showToast('?�?�되?�습?�다.', 'success');
          // ?�면 갱신 - ?�래 ?�택??메뉴???�퀀???�용
          const selectedMenuSeq = selectedTreeNode?.MENU_SEQ ?? selectedMenu.MENU_SEQ ?? 0;
          await loadMenuPrograms(selectedMenu.MENU_ID, selectedMenuSeq);
          await loadMenuTreeByMenu(selectedMenu.MENU_ID, selectedMenu);
          setSelectedPrograms(new Set());
        } catch (e: any) {
          showToast('?�???�패: ' + (e?.message || '?????�는 ?�류'), 'error');
        }
      }
    });
  };

  // 검??조건 변�??�들??
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchConditions((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ?�터 ?�력 ??검??
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === 'Enter') {
      loadMenus();
    }
  };



  // ?�규 메뉴
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

  // ??메뉴 ID ?�성
  const generateNewMenuId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `M${year}${month}${day}${random}`;
  };

  // ?�??
  const handleSave = async () => {
    if (!selectedMenu) return;

    if (!selectedMenu.MENU_NM.trim()) {
      showToast('메뉴명을 ?�력?�주?�요.', 'warning');
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
        showToast('메뉴가 ?�성?�었?�니??', 'success');
        
        // ?�????모든 ?�이??초기??�??�조??
        await loadMenus();
      } else {
        const menuData: MenuUpdateDto = {
          MENU_NM: selectedMenu.MENU_NM,
          USE_YN: selectedMenu.USE_YN,
        };

        await MenuService.updateMenu(selectedMenu.MENU_ID, menuData);
        showToast('메뉴가 ?�정?�었?�니??', 'success');
        
        // ?�????모든 ?�이??초기??�??�조??
        await loadMenus();
      }
    } catch (error: any) {
      showToast(`?�???�패: ${error?.message || '?????�는 ?�류'}`, 'error');
    }
  };

  // ??��
  const handleDelete = async () => {
    if (!selectedMenu) return;

    showConfirm({
      message: '?�말�???��?�시겠습?�까?',
      type: 'warning',
      onConfirm: async () => {
        try {
          await MenuService.deleteMenu(selectedMenu.MENU_ID);
          showToast('메뉴가 ??��?�었?�니??', 'success');
          // ??�� ??모든 ?�이??초기??�??�조??
          await loadMenus();
        } catch (error: any) {
          showToast(`??�� ?�패: ${error?.message || '?????�는 ?�류'}`, 'error');
        }
      }
    });
  };

  // 복사 ?�??
  const handleCopy = async () => {
    if (!selectedMenu) {
      showToast('복사??메뉴�?먼�? ?�택?�주?�요.', 'warning');
      return;
    }

    showConfirm({
      message: `${selectedMenu.MENU_NM} 메뉴�??�로 복사?�시겠습?�까?`,
      type: 'info',
      onConfirm: async () => {
        try {
          setLoading(true);
          
          // SEIZE_TO_BIST 방식?�로 복사 (메뉴 ?�보 + 메뉴 ?�세 모두 복사)
          const result = await MenuService.copyMenu(selectedMenu.MENU_ID, selectedMenu.MENU_NM);
          
          showToast(`??메뉴 '${result.MENU_NM}'??가) ?�공?�으�??�성?�었?�니??`, 'success');
          
          // 복사 ??모든 ?�이??초기??�??�조??
          await loadMenus();
          
        } catch (error: any) {
          console.error('메뉴 복사 ?�패:', error);
          showToast(`복사 ?�패: ${error?.message || '?????�는 ?�류'}`, 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // ?�세 체크박스
  const handleDetailCheck = (menuSeq: number) => {
    const newSelected = new Set(selectedDetails);
    if (newSelected.has(menuSeq)) {
      newSelected.delete(menuSeq);
    } else {
      newSelected.add(menuSeq);
    }
    setSelectedDetails(newSelected);
  };

  // ?�체 ?�택
  const handleSelectAll = () => {
    if (selectedDetails.size === menuDetails.length) {
      setSelectedDetails(new Set());
    } else {
      setSelectedDetails(new Set(menuDetails.map(detail => detail.MENU_SEQ)));
    }
  };

  // 메뉴 ?��? �??�릭 ?�벤??
  const toggleMenu = (nodeIndex: number) => {
    setOpenIndexes(prev => {
      const newIndexes = prev.includes(nodeIndex) 
        ? prev.filter(i => i !== nodeIndex)
        : [...prev, nodeIndex];
      
      // 개별 ?��? ???�체 ?�장 ?�태 ?�데?�트
      const totalNodes = countTotalNodes(menuTree);
      setTreeExpanded(newIndexes.length === totalNodes);
      
      return newIndexes;
    });
  };

  // ?�리 ?�드 ?�릭 ???�로그램 목록 조회 (SEIZE_TO_BIST 방식)
  const handleTreeClick = async (node: any) => {
    try {
      setSelectedTreeNode(node);
      // setSelectedMenu(...) ?�출 ?�거!
      const programs = await MenuService.getMenuPrograms(node.MENU_ID, node.MENU_SEQ);
      setMenuPrograms(programs);
      setSelectedPrograms(new Set());
    } catch (error: any) {
      showToast(`?�로그램 목록 조회 ?�패: ${error?.message || '?????�는 ?�류'}`, 'error');
    }
  };

  // ?�리 ?�드???�덱???�당?�는 ?�수
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

  // ?�체 ?�드 개수 계산
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

  // ?�역 postMessage ?�신 (?�버�?�??�제 처리)
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      if (event.data?.type === 'SELECTED_PROGRAMS') {
        const programs = event.data.data;
        const pgmIdParam = event.data.PGM_ID;
        if (!selectedMenu || !programs || programs.length === 0) return;

        if (pgmIdParam === 'INSERT_ROWS') {
          // 기존 로직: 중복 ?�이 �??�에 추�?
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
          // 받�? PGM_ID가 ?�자?�면 ?�당 ?�번???�입/치환
          if (programs.length > 1) {
            showToast('1개만 ?�택??주세??', 'warning');
            return;
          }
          const insertIndex = Number(pgmIdParam);
          if (isNaN(insertIndex) || insertIndex < 0) return;
          setMenuPrograms(prev => {
            const existingPgmIds = new Set(prev.map(row => row.PGM_ID));
            // 중복 방�?: 기존???�는 ?�로그램�?
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
            // 기존 배열 복사
            const updated = [...prev];
            // ?�당 ?�덱?�에 치환 ?�는 ?�입
            if (insertIndex < updated.length) {
              updated.splice(insertIndex, 1, ...newRows);
            } else {
              // ?�덱?��? 범위 밖이�?�??�에 추�?
              updated.push(...newRows);
            }
            // SORT_SEQ ?�정??
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
      {/* 조회 ?�역 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[110px]">메뉴ID�?/th>
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
              <th className="search-th w-[100px]">?�용?��?</th>
              <td className="search-td w-[10%]">
                <select
                  name="USE_YN"
                  className="combo-base w-full min-w-[80px]"
                  value={searchConditions.USE_YN}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                >
                  <option value="">?�체</option>
                  <option value="Y">?�용</option>
                  <option value="N">미사??/option>
                </select>
              </td>
              <td className="search-td text-right" colSpan={1}>
                <button type="button" className="btn-base btn-search" onClick={loadMenus}>
                  조회
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 메뉴 목록 그리??*/}
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
          loadingOverlayComponent={() => <div className="text-center py-4">로딩 �?..</div>}
          noRowsOverlayComponent={() => <div className="text-center py-4">조회???�보가 ?�습?�다.</div>}
          suppressRowClickSelection={false}
          animateRows={true}
          rowHeight={32}
          headerHeight={40}
          data-testid="menu-grid"
        />
      </div>

      {/* ?�세 ?�력 ??*/}
      <table className="form-table w-full mb-4">
        <tbody>
          <tr className="form-tr">
            <th className="form-th w-[130px] required">메뉴�?/th>
            <td className="form-td w-[250px]">
              <input
                type="text"
                className="input-base input-default w-full"
                value={selectedMenu?.MENU_NM || ''}
                onChange={e => setSelectedMenu(prev => prev ? { ...prev, MENU_NM: e.target.value } : null)}
                disabled={!selectedMenu}
              />
            </td>
            <th className="form-th w-[130px]">?�용?��?</th>
            <td className="form-td w-[10%]">
              <select
                className="combo-base w-full min-w-[60px]"
                value={selectedMenu?.USE_YN || 'Y'}
                disabled={!selectedMenu}
                onChange={e => setSelectedMenu(prev => prev ? { ...prev, USE_YN: e.target.value } : null)}
              >
                <option value="">?�체</option>
                <option value="Y">?�용</option>
                <option value="N">미사??/option>
              </select>
            </td>
            <td className="form-td"></td>
          </tr>
        </tbody>
      </table>

      {/* 버튼 ??*/}
      <div className="flex gap-2 justify-end mb-4">
        <button type="button" className="btn-base btn-delete" onClick={handleDelete} disabled={!selectedMenu || isNewMenu}>메뉴??��</button>
        <button type="button" className="btn-base btn-etc" onClick={handleCopy} disabled={!selectedMenu}>복사?�??/button>
        <button type="button" className="btn-base btn-etc" onClick={handleNew}>?�규</button>
        <button type="button" className="btn-base btn-act" onClick={handleSave} disabled={!selectedMenu}>?�??/button>
      </div>

      {/* 메뉴 ?�리 + ?�로그램 ?�보 */}
      <div className="flex w-full gap-4 mt-4" style={{ height: 'calc(100vh - 600px)', minHeight: '200px' }}>
        {/* 좌측: 메뉴 ?�리 */}
        <div className="w-1/3 flex flex-col">
          <div className="tit_area flex justify-between items-center">
            <h3>메뉴 목록</h3>
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
                �?
              </button>
              <button 
                type="button" 
                className="text-xl text-gray-400"
                onClick={() => {
                  setOpenIndexes([]);
                  setTreeExpanded(false);
                }}
              >
                �?
              </button>
            </div>
          </div>
          <div className="menu-tree-wrap flex-1 overflow-auto">
            <ul className="menu-tree" style={{ listStyle: 'none' }}>
              {menuTree.length === 0 ? (
                <li className="text-gray-500 text-center p-4">메뉴 ?�리가 ?�습?�다.</li>
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

        {/* ?�측: 메뉴�??�로그램 */}
        <div className="w-2/3 flex flex-col">
          <div className="tit_area flex justify-between items-center">
            <h3>메뉴 �??�로그램</h3>
            <button type="button" className="btn-base btn-etc text-xs px-2 py-1"             onClick={() => {
              if (!selectedMenu) {
                showToast('메뉴�?먼�? ?�택?�주?�요.', 'warning');
                return;
              }
              console.log('메뉴 미리보기 ?�릭 - selectedMenu:', selectedMenu);
              console.log('메뉴 미리보기 ?�릭 - MENU_ID:', selectedMenu.MENU_ID);
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
              메뉴미리보기
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
              loadingOverlayComponent={() => <div className="text-center py-4">로딩 �?..</div>}
              noRowsOverlayComponent={() => <div className="text-center py-4">조회???�보가 ?�습?�다.</div>}
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
                  // 구분 컬럼(MENU_SHP_DVCD_NM)??변경된 경우, MENU_SHP_DVCD???�께 ?�데?�트
                  if (colDef.field === 'MENU_SHP_DVCD_NM') {
                    // divisionCodes?�서 ?�택??코드???�름 찾기
                    if (Array.isArray(divisionCodes) && divisionCodes.length > 0) {
                      const selectedCode = divisionCodes.find(code => code.codeId === newValue);
                      if (selectedCode) {
                        // MENU_SHP_DVCD?� MENU_SHP_DVCD_NM 모두 ?�데?�트
                        updated[index] = { 
                          ...data, 
                          MENU_SHP_DVCD: newValue, // ?�제 코드 ID
                          MENU_SHP_DVCD_NM: selectedCode.codeNm // ?�시�?
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
                showToast('메뉴�?먼�? ?�택?�주?�요.', 'warning');
                return;
              }
              // ?�로그램 검???�업 ?�기 (?�단 버튼: INSERT_ROWS�?PGM_ID�??�달)
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
            }}>찾기</button>
            <button type="button" className="btn-base btn-etc text-xs px-2 py-1" onClick={handleAddProgramRow}>추�?</button>
            <button type="button" className="btn-base btn-delete text-xs px-2 py-1" onClick={handleDeleteProgramRows} disabled={selectedPrograms.size === 0}>??��</button>
            <button type="button" className="btn-base btn-act text-xs px-2 py-1" onClick={handleSavePrograms}>?�??/button>
          </div>
        </div>
      </div>
    </div>
  );
} 

