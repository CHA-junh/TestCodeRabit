/**
 * SYS1002M00 - 메뉴별 프로그램 관리 화면
 *
 * 주요 기능:
 * - 메뉴 목록 조회 및 검색
 * - 메뉴 신규 등록 및 수정/삭제
 * - 메뉴별 프로그램 연결 관리
 * - 메뉴 계층 구조 트리 표시
 * - 메뉴 미리보기 기능
 * - 메뉴 복사 기능
 *
 * API 연동:
 * - GET /api/sys/sys-menus - 메뉴 목록 조회
 * - POST /api/sys/sys-menus - 메뉴 저장
 * - DELETE /api/sys/sys-menus/:menuId - 메뉴 삭제
 * - POST /api/sys/sys-menus/:menuId/copy - 메뉴 복사
 * - GET /api/sys/sys-menus/:menuId/programs - 메뉴별 프로그램 조회
 * - POST /api/sys/sys-menus/:menuId/programs - 메뉴별 프로그램 저장
 * - DELETE /api/sys/sys-menus/:menuId/programs - 메뉴별 프로그램 삭제
 * - POST /api/common/search - 공통코드 조회 (구분: 304)
 *
 * 상태 관리:
 * - 메뉴 목록 및 선택된 메뉴
 * - 메뉴별 프로그램 목록 및 선택된 프로그램들
 * - 메뉴 트리 구조 및 확장/축소 상태
 * - 검색 조건 (메뉴ID/명, 사용여부)
 * - 구분 코드 목록 (304 대분류)
 *
 * 사용자 인터페이스:
 * - 검색 조건 입력 (메뉴ID/명, 사용여부)
 * - 메뉴 목록 테이블 (AG-Grid)
 * - 메뉴 계층 구조 트리 (좌측)
 * - 메뉴별 프로그램 목록 테이블 (우측)
 * - 메뉴 상세 정보 입력 폼
 * - 저장/신규/삭제/복사/미리보기 버튼
 *
 * 연관 화면:
 * - SYS1000M00: 프로그램 관리 (프로그램 정보)
 * - SYS1001M00: 프로그램 그룹 관리 (그룹 연결)
 * - SYS1003M00: 사용자 역할 관리 (메뉴 권한)
 * - SYS1010D00: 프로그램 검색 팝업
 * - SYS1012R00: 메뉴 미리보기 팝업
 *
 * 데이터 구조:
 * - Menu: 메뉴 정보 (MENU_ID, MENU_NM, USE_YN, USER_CNT 등)
 * - MenuProgram: 메뉴별 프로그램 정보 (MENU_SEQ, MENU_DSP_NM, MENU_SHP_DVCD, PGM_ID 등)
 * - TreeNode: 메뉴 트리 노드 (children, treeIndex 등)
 *
 * 특이사항:
 * - 메뉴는 계층 구조로 관리 (MENU_SEQ로 계층 표현)
 * - 메뉴별 프로그램의 구분은 304 대분류 코드 사용
 * - 메뉴 복사 시 하위 메뉴와 프로그램도 함께 복사
 * - 메뉴 미리보기는 팝업으로 실제 메뉴 구조 표시
 * - 트리 구조는 재귀적 컴포넌트로 구현
 * - 메뉴별 프로그램은 계층적 삭제 지원
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

// 재귀적 트리 노드 컴포넌트
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
  const isTopLevel = node.MENU_SEQ === '0'; // 최상위 노드 여부
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
            {isOpen ? '▼' : '▶'}
          </span>
        ) : (
          <span className="mr-1">•</span>
        )}
        {isTopLevel && <span className="text-blue-500 mr-1">👑</span>}
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

  // AG-Grid 컬럼 정의 - 메뉴 목록
  const [menuColDefs] = useState<ColDef[]>([
    { headerName: 'No', field: 'rowIndex', width: 60, flex: 0.5, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueGetter: (params) => params.node?.rowIndex ? params.node.rowIndex + 1 : 1 },
    { headerName: '메뉴ID', field: 'MENU_ID', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '메뉴명', field: 'MENU_NM', width: 200, flex: 1.5, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '사용여부', field: 'USE_YN', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
    { headerName: '사용자수', field: 'USER_CNT', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '0' },
    { headerName: '변경자', field: 'CHNGR_NM', width: 100, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '-' },
    { headerName: '변경일시', field: 'CHNG_DTTM', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', valueFormatter: (params) => params.value || '-' },
  ]);

  // 304 대분류 코드의 소분류 코드 목록
  const [divisionCodes, setDivisionCodes] = useState<Array<{codeId: string, codeNm: string}>>([]);

  // 304 대분류 코드의 소분류 코드들을 가져오는 함수
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
      console.error('304 대분류 코드 로드 중 오류:', error);
    }
  };

  // AG-Grid 컬럼 정의 - 메뉴별 프로그램
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
        // params.data가 null인 경우 안전하게 처리
        if (!params.data) {
          return params.value || '';
        }
        
        // 서버에서 받은 MENU_SHP_DVCD_NM을 우선 사용하고, 없으면 divisionCodes에서 찾기
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
    { headerName: '표시명', field: 'MENU_DSP_NM', width: 150, flex: 1.2, cellStyle: { textAlign: 'left' }, headerClass: 'ag-center-header' },
    { headerName: '프로그램', field: 'PGM_ID', width: 120, flex: 1, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header' },
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
    { headerName: '정렬', field: 'SORT_SEQ', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', type: 'numericColumn' },
    { headerName: '사용여부', field: 'USE_YN', width: 80, flex: 0.8, cellStyle: { textAlign: 'center' }, headerClass: 'ag-center-header', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Y', 'N'] } },
  ], [divisionCodes]);

  // 상태 정의
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

  // 팝업 훅
  const { openPopup } = usePopup();

  // 초기 로드 - 상단 그리드 조회 및 304 대분류 코드 로드
  useEffect(() => {
    console.log('🔄 SYS1002M00 화면 로드 - 상단 그리드 조회 시작');
    loadMenus();
    loadDivisionCodes(); // 304 대분류 코드 로드
  }, []);

  // 데이터 변경 시 컬럼 크기 조정
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

  // AG-Grid 이벤트 핸들러
  const onMenuSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const menu = selectedRows[0];
      console.log('🎯 그리드에서 메뉴 선택됨:', menu);
      console.log('📋 선택된 메뉴 정보:', {
        MENU_ID: menu.MENU_ID,
        MENU_NM: menu.MENU_NM,
        USE_YN: menu.USE_YN
      });
      setIsNewMenu(false);
      setSelectedMenu(menu);
      console.log('🔄 관련 데이터 로드 시작...');
      setMenuPrograms([]);
      setSelectedPrograms(new Set());
      // 메뉴 트리 로드 (SEIZE_TO_BIST 방식: 선택한 메뉴를 최상위로 설정)
      if (menu.MENU_ID) {
        loadMenuTreeByMenu(menu.MENU_ID, menu);
        // 메뉴별 프로그램 동시 조회 (MENU_SEQ=0)
        loadMenuPrograms(menu.MENU_ID, 0);
      }
      console.log('✅ 메뉴 선택 처리 완료');
    } else {
      setSelectedMenu(null);
      setMenuPrograms([]);
      setMenuTree([]); // 트리도 초기화
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
    console.log('선택된 프로그램들:', selectedIndices);
  };

  const onMenuGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  const onMenuProgramGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };



  // 프로그램 검색 핸들러
  const handleProgramSearch = (rowData: any, rowIndex: number) => {
    console.log('프로그램 검색 클릭:', rowData, rowIndex);
    // 프로그램 검색 팝업 열기 (그리드 안쪽: 클릭한 로우의 순번을 PGM_ID로 전달)
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

  // 메뉴별 프로그램 관리 상태
  const [menuPrograms, setMenuPrograms] = useState<any[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<Set<number>>(new Set());
  const [programSearchKeyword, setProgramSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showProgramSearch, setShowProgramSearch] = useState(false);
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  // 공통 초기화 함수
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

  // 메뉴 목록 불러오기
  const loadMenus = async () => {
    setLoading(true);
    resetAllData();
    try {
      const response: MenuListResponse = await MenuService.getMenuList(searchConditions);
      setMenus(response.data || []);
    } catch (error: any) {
      showToast(`메뉴 목록 조회 실패: ${error?.message || '알 수 없는 오류'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 트리 불러오기 (전체)
  const loadMenuTree = useCallback(async () => {
    try {
      const tree = await MenuService.getMenuTree('ALL');
      console.log('로드된 트리 데이터:', tree);
      
      // 평면 데이터를 계층 구조로 변환
      const hierarchicalTree = convertToHierarchicalTree(tree || []);
      console.log('계층 구조로 변환된 트리:', hierarchicalTree);
      
      setMenuTree(hierarchicalTree);
      // 트리 로드 시 확장 상태 초기화
      setOpenIndexes([]);
      setTreeExpanded(false);
    } catch (error: any) {
      console.error('메뉴 트리 조회 실패:', error);
    }
  }, []);

  // 트리 데이터를 계층 구조로 변환하는 함수 (SEIZE_TO_BIST 방식)
  const convertToHierarchicalTree = (flatTree: any[], selectedMenu?: Menu | null) => {
    if (!flatTree || flatTree.length === 0) return [];
    
    console.log('🔄 계층 구조 변환 시작 - 입력 데이터:', flatTree);
    console.log('🎯 선택된 메뉴:', selectedMenu);
    
    const treeMap = new Map();
    const rootNodes: any[] = [];
    
    // 모든 노드를 맵에 저장 (문자열 키로 통일)
    flatTree.forEach((item, index) => {
      treeMap.set(String(item.MENU_SEQ), {
        ...item,
        children: [],
        index: index
      });
    });
    
    // 부모-자식 관계 설정
    flatTree.forEach((item) => {
      const node = treeMap.get(String(item.MENU_SEQ));
      
      // HGRK_MENU_SEQ 타입 체크 및 루트 노드 판별
      const hgrkMenuSeq = String(item.HGRK_MENU_SEQ);
      const isRoot = hgrkMenuSeq === '0' || hgrkMenuSeq === 'null' || hgrkMenuSeq === 'undefined';
      
      console.log(`🔍 노드 분석: ${item.MENU_DSP_NM}, HGRK_MENU_SEQ: ${hgrkMenuSeq} (타입: ${typeof hgrkMenuSeq}), 루트여부: ${isRoot}`);
      
      if (isRoot) {
        console.log('🌳 루트 노드 추가:', item.MENU_DSP_NM, 'MENU_SEQ:', item.MENU_SEQ);
        rootNodes.push(node);
      } else {
        // 하위 노드 - 부모 찾기 (문자열로 통일)
        const parent = treeMap.get(hgrkMenuSeq);
        if (parent) {
          console.log('👶 하위 노드 추가:', item.MENU_DSP_NM, '→ 부모:', parent.MENU_DSP_NM);
          parent.children.push(node);
        } else {
          console.log('⚠️ 부모를 찾을 수 없음:', item.MENU_DSP_NM, 'HGRK_MENU_SEQ:', hgrkMenuSeq);
          // 부모를 찾을 수 없으면 루트로 추가
          rootNodes.push(node);
        }
      }
    });
    
    // SEIZE_TO_BIST 방식: 선택한 메뉴를 최상위 노드로 추가
    if (selectedMenu) {
      const topLevelNode = {
        MENU_ID: selectedMenu.MENU_ID,
        HGRK_MENU_SEQ: '',
        MENU_SEQ: '0',  // 최상위 메뉴는 "0"
        MENU_DSP_NM: selectedMenu.MENU_NM,
        children: rootNodes,  // 기존 루트 노드들을 하위로 이동
        index: -1,
        expanded: true
      };
      
      console.log('👑 선택한 메뉴를 최상위 노드로 설정:', selectedMenu.MENU_NM);
      console.log('📊 최상위 노드 하위에 기존 루트 노드들 배치:', rootNodes.length, '개');
      
      return [topLevelNode];
    }
    
    console.log('✅ 계층 구조 변환 완료 - 루트 노드 수:', rootNodes.length);
    console.log('📊 최종 트리 구조:', rootNodes);
    
    return rootNodes;
  };

  // 메뉴 트리 불러오기 (특정 메뉴 기준)
  const loadMenuTreeByMenu = useCallback(async (menuId: string, selectedMenu?: Menu | null) => {
    try {
      console.log('🔄 [DEBUG] 트리 재조회 함수 실행! menuId:', menuId);
      console.log('📡 API 호출: MenuService.getMenuTreeByMenu(', menuId, ')');
      
      const tree = await MenuService.getMenuTreeByMenu(menuId);
      
      console.log('✅ [DEBUG] 트리 API 응답:', tree);
      console.log('📊 조회된 트리 데이터 개수:', tree?.length || 0);
      
      // 평면 데이터를 계층 구조로 변환 (선택한 메뉴를 최상위로 설정)
      const hierarchicalTree = convertToHierarchicalTree(tree || [], selectedMenu);
      console.log('📊 [DEBUG] 계층 구조로 변환된 트리:', hierarchicalTree);
      
      // 트리 노드에 인덱스 할당
      assignTreeIndexes(hierarchicalTree);
      console.log('📊 [DEBUG] 인덱스 할당된 트리:', hierarchicalTree);
      
      setMenuTree((prev) => {
        console.log('🟢 [DEBUG] setMenuTree 호출! 이전:', prev, '새값:', hierarchicalTree);
        return hierarchicalTree;
      });
      
      // 테스트용: 모든 노드를 펼쳐진 상태로 설정
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
      
      console.log('🎯 트리 상태 업데이트 완료');
    } catch (error: any) {
      console.error('❌ 메뉴 트리 조회 실패:', error);
    }
  }, []);

  // 메뉴 상세 불러오기
  const loadMenuDetails = useCallback(async (menuId: string) => {
    if (!menuId) return;
    try {
      setMenuDetails([]);
    } catch (error: any) {
      console.error('메뉴 상세 조회 실패:', error);
    }
  }, []);

  // 메뉴별 프로그램 목록 불러오기
  const loadMenuPrograms = useCallback(async (menuId: string, menuSeq: number) => {
    if (!menuId) return;
    try {
      const programs = await MenuService.getMenuPrograms(menuId, menuSeq);
      setMenuPrograms(programs);
    } catch (error: any) {
      console.error('메뉴별 프로그램 조회 실패:', error);
    }
  }, []);

  // 프로그램 검색
  const searchPrograms = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await MenuService.searchPrograms(keyword);
      setSearchResults(results);
    } catch (error: any) {
      console.error('프로그램 검색 실패:', error);
      setSearchResults([]);
    }
  }, []);

  // 실시간 업데이트 함수들
  const refreshTree = useCallback(async () => {
    await loadMenuTree();
  }, [loadMenuTree]);

  const refreshPrograms = useCallback(async () => {
    if (selectedMenu?.MENU_ID) {
      await loadMenuPrograms(selectedMenu.MENU_ID, 0);
    }
  }, [selectedMenu?.MENU_ID, loadMenuPrograms]);

  // 트리 순서 업데이트 (드래그 앤 드롭 대체)
  const updateTreeOrder = useCallback(async (menuId: string, treeData: any[]) => {
    try {
      await MenuService.updateMenuTreeOrder(menuId, treeData);
      showToast('트리 순서가 업데이트되었습니다.', 'success');
      // 실시간 업데이트
      await refreshTree();
    } catch (error: any) {
      console.error('트리 순서 업데이트 실패:', error);
      showToast(`트리 순서 업데이트 실패: ${error?.message || '알 수 없는 오류'}`, 'error');
    }
  }, [refreshTree, showToast]);

  // 메뉴에 프로그램 추가
  const addMenuProgram = useCallback(async (program: any) => {
    if (!selectedMenu) return;
    try {
      await MenuService.addMenuProgram(selectedMenu.MENU_ID, {
        pgmId: program.PGM_ID,
        menuDspNm: program.PGM_NM,
        menuShpDvcd: program.MENU_SHP_DVCD || 'P', // 304 대분류 코드의 소분류 코드
        useYn: 'Y',
        chngrId: 'SYSTEM',
        hgrkMenuSeq: selectedMenu.MENU_SEQ // 트리에서 선택한 메뉴의 MENU_SEQ
      });
      await loadMenuPrograms(selectedMenu.MENU_ID, 0);
      setShowProgramSearch(false);
      setProgramSearchKeyword('');
      showToast('프로그램이 추가되었습니다.', 'success');
    } catch (error: any) {
      showToast(`프로그램 추가 실패: ${error.message}`, 'error');
    }
  }, [selectedMenu, loadMenuPrograms, showToast]);

  // 메뉴 프로그램 삭제
  const deleteMenuPrograms = useCallback(async () => {
    if (!selectedMenu || selectedPrograms.size === 0) return;
    
    showConfirm({
      message: '선택된 프로그램들을 삭제하시겠습니까?',
      type: 'warning',
      onConfirm: async () => {
        try {
          const deletePromises = Array.from(selectedPrograms).map(menuSeq =>
            MenuService.deleteMenuProgram(selectedMenu.MENU_ID, menuSeq)
          );
          await Promise.all(deletePromises);
          await loadMenuPrograms(selectedMenu.MENU_ID, 0);
          await loadMenuTreeByMenu(selectedMenu.MENU_ID, selectedMenu); // 메뉴 트리뷰 재조회
          setSelectedPrograms(new Set());
          showToast('선택된 프로그램들이 삭제되었습니다.', 'success');
        } catch (error: any) {
          showToast(`프로그램 삭제 실패: ${error.message}`, 'error');
        }
      }
    });
  }, [selectedMenu, selectedPrograms, loadMenuPrograms, loadMenuTreeByMenu, showToast, showConfirm]);

  // 메뉴별 프로그램 행 추가
  const handleAddProgramRow = () => {
    setMenuPrograms(prev => [
      ...prev,
      {
        MENU_SHP_DVCD: '', // 304 대분류 코드의 소분류 코드
        MENU_SHP_DVCD_NM: '', // 표시명 초기화
        MENU_DSP_NM: '',
        PGM_ID: '',
        PGM_NM: '',
        SORT_SEQ: prev.length + 1,
        USE_YN: 'Y',
        checked: false,
      },
    ]);
  };

  // 메뉴별 프로그램 행 삭제 (계층 구조 삭제)
  const handleDeleteProgramRows = async () => {
    if (selectedPrograms.size === 0) {
      showToast('삭제할 항목을 선택해주세요.', 'warning');
      return;
    }
    if (!selectedMenu?.MENU_ID) {
      showToast('메뉴가 선택되지 않았습니다.', 'warning');
      return;
    }
    
    showConfirm({
      message: '선택된 프로그램들과 하위 항목들을 모두 삭제하시겠습니까?',
      type: 'warning',
      onConfirm: async () => {
        setLoading(true);
        try {
          // 선택된 행의 MENU_SEQ만 추출
          const selectedRows = Array.from(selectedPrograms).map(idx => menuPrograms[idx]);
          const menuSeqs = selectedRows.map(row => row.MENU_SEQ).filter(Boolean);
          // 새로운 계층 삭제 API 호출
          await MenuService.deleteMenuProgramsHierarchical(selectedMenu.MENU_ID, menuSeqs);
          showToast('선택된 프로그램들과 하위 항목들이 모두 삭제되었습니다.', 'success');
          // 화면 갱신 - 원래 선택한 메뉴의 시퀀스 사용
          const selectedMenuSeq = selectedTreeNode?.MENU_SEQ ?? selectedMenu.MENU_SEQ ?? 0;
          await loadMenuPrograms(selectedMenu.MENU_ID, selectedMenuSeq);
          await loadMenuTreeByMenu(selectedMenu.MENU_ID, selectedMenu);
          setSelectedPrograms(new Set());
        } catch (error: any) {
          showToast(`삭제 실패: ${error?.message || '알 수 없는 오류'}`, 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 메뉴별 프로그램 저장
  const handleSavePrograms = async () => {
    if (!selectedMenu) {
      showToast('메뉴가 선택되지 않았습니다.', 'warning');
      return;
    }
    if (menuPrograms.length === 0) {
      showToast('저장할 프로그램이 없습니다.', 'warning');
      return;
    }
    // 유효성 검사
    for (let i = 0; i < menuPrograms.length; i++) {
      const row = menuPrograms[i];
      if (!row.MENU_DSP_NM) {
        showToast('표시명을 입력하세요.', 'warning');
        return;
      }
      if (row.MENU_SHP_DVCD === 'P' && !row.PGM_ID) {
        showToast('프로그램을 선택하세요.', 'warning');
        return;
      }
    }

    showConfirm({
      message: '프로그램 정보를 저장하시겠습니까?',
      type: 'info',
      onConfirm: async () => {
        // HGRK_MENU_SEQ 보장 - 트리에서 선택한 메뉴의 MENU_SEQ 사용
        const programsToSave = menuPrograms.map(row => ({
          ...row,
          HGRK_MENU_SEQ: selectedTreeNode?.MENU_SEQ ?? selectedMenu.MENU_SEQ ?? 0
        }));

        try {
          await MenuService.saveMenuPrograms(selectedMenu.MENU_ID, programsToSave);
          showToast('저장되었습니다.', 'success');
          // 화면 갱신 - 원래 선택한 메뉴의 시퀀스 사용
          const selectedMenuSeq = selectedTreeNode?.MENU_SEQ ?? selectedMenu.MENU_SEQ ?? 0;
          await loadMenuPrograms(selectedMenu.MENU_ID, selectedMenuSeq);
          await loadMenuTreeByMenu(selectedMenu.MENU_ID, selectedMenu);
          setSelectedPrograms(new Set());
        } catch (e: any) {
          showToast('저장 실패: ' + (e?.message || '알 수 없는 오류'), 'error');
        }
      }
    });
  };

  // 검색 조건 변경 핸들러
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchConditions((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 엔터 입력 시 검색
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === 'Enter') {
      loadMenus();
    }
  };



  // 신규 메뉴
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

  // 새 메뉴 ID 생성
  const generateNewMenuId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `M${year}${month}${day}${random}`;
  };

  // 저장
  const handleSave = async () => {
    if (!selectedMenu) return;

    if (!selectedMenu.MENU_NM.trim()) {
      showToast('메뉴명을 입력해주세요.', 'warning');
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
        showToast('메뉴가 생성되었습니다.', 'success');
        
        // 저장 후 모든 데이터 초기화 및 재조회
        await loadMenus();
      } else {
        const menuData: MenuUpdateDto = {
          MENU_NM: selectedMenu.MENU_NM,
          USE_YN: selectedMenu.USE_YN,
        };

        await MenuService.updateMenu(selectedMenu.MENU_ID, menuData);
        showToast('메뉴가 수정되었습니다.', 'success');
        
        // 저장 후 모든 데이터 초기화 및 재조회
        await loadMenus();
      }
    } catch (error: any) {
      showToast(`저장 실패: ${error?.message || '알 수 없는 오류'}`, 'error');
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!selectedMenu) return;

    showConfirm({
      message: '정말로 삭제하시겠습니까?',
      type: 'warning',
      onConfirm: async () => {
        try {
          await MenuService.deleteMenu(selectedMenu.MENU_ID);
          showToast('메뉴가 삭제되었습니다.', 'success');
          // 삭제 후 모든 데이터 초기화 및 재조회
          await loadMenus();
        } catch (error: any) {
          showToast(`삭제 실패: ${error?.message || '알 수 없는 오류'}`, 'error');
        }
      }
    });
  };

  // 복사 저장
  const handleCopy = async () => {
    if (!selectedMenu) {
      showToast('복사할 메뉴를 먼저 선택해주세요.', 'warning');
      return;
    }

    showConfirm({
      message: `${selectedMenu.MENU_NM} 메뉴를 새로 복사하시겠습니까?`,
      type: 'info',
      onConfirm: async () => {
        try {
          setLoading(true);
          
          // SEIZE_TO_BIST 방식으로 복사 (메뉴 정보 + 메뉴 상세 모두 복사)
          const result = await MenuService.copyMenu(selectedMenu.MENU_ID, selectedMenu.MENU_NM);
          
          showToast(`새 메뉴 '${result.MENU_NM}'이(가) 성공적으로 생성되었습니다.`, 'success');
          
          // 복사 후 모든 데이터 초기화 및 재조회
          await loadMenus();
          
        } catch (error: any) {
          console.error('메뉴 복사 실패:', error);
          showToast(`복사 실패: ${error?.message || '알 수 없는 오류'}`, 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 상세 체크박스
  const handleDetailCheck = (menuSeq: number) => {
    const newSelected = new Set(selectedDetails);
    if (newSelected.has(menuSeq)) {
      newSelected.delete(menuSeq);
    } else {
      newSelected.add(menuSeq);
    }
    setSelectedDetails(newSelected);
  };

  // 전체 선택
  const handleSelectAll = () => {
    if (selectedDetails.size === menuDetails.length) {
      setSelectedDetails(new Set());
    } else {
      setSelectedDetails(new Set(menuDetails.map(detail => detail.MENU_SEQ)));
    }
  };

  // 메뉴 토글 및 클릭 이벤트
  const toggleMenu = (nodeIndex: number) => {
    setOpenIndexes(prev => {
      const newIndexes = prev.includes(nodeIndex) 
        ? prev.filter(i => i !== nodeIndex)
        : [...prev, nodeIndex];
      
      // 개별 토글 시 전체 확장 상태 업데이트
      const totalNodes = countTotalNodes(menuTree);
      setTreeExpanded(newIndexes.length === totalNodes);
      
      return newIndexes;
    });
  };

  // 트리 노드 클릭 시 프로그램 목록 조회 (SEIZE_TO_BIST 방식)
  const handleTreeClick = async (node: any) => {
    try {
      setSelectedTreeNode(node);
      // setSelectedMenu(...) 호출 제거!
      const programs = await MenuService.getMenuPrograms(node.MENU_ID, node.MENU_SEQ);
      setMenuPrograms(programs);
      setSelectedPrograms(new Set());
    } catch (error: any) {
      showToast(`프로그램 목록 조회 실패: ${error?.message || '알 수 없는 오류'}`, 'error');
    }
  };

  // 트리 노드에 인덱스 할당하는 함수
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

  // 전체 노드 개수 계산
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

  // 전역 postMessage 수신 (디버깅 및 실제 처리)
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      if (event.data?.type === 'SELECTED_PROGRAMS') {
        const programs = event.data.data;
        const pgmIdParam = event.data.PGM_ID;
        if (!selectedMenu || !programs || programs.length === 0) return;

        if (pgmIdParam === 'INSERT_ROWS') {
          // 기존 로직: 중복 없이 맨 뒤에 추가
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
          // 받은 PGM_ID가 숫자라면 해당 순번에 삽입/치환
          if (programs.length > 1) {
            showToast('1개만 선택해 주세요.', 'warning');
            return;
          }
          const insertIndex = Number(pgmIdParam);
          if (isNaN(insertIndex) || insertIndex < 0) return;
          setMenuPrograms(prev => {
            const existingPgmIds = new Set(prev.map(row => row.PGM_ID));
            // 중복 방지: 기존에 없는 프로그램만
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
            // 해당 인덱스에 치환 또는 삽입
            if (insertIndex < updated.length) {
              updated.splice(insertIndex, 1, ...newRows);
            } else {
              // 인덱스가 범위 밖이면 맨 뒤에 추가
              updated.push(...newRows);
            }
            // SORT_SEQ 재정렬
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
      {/* 조회 영역 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[110px]">메뉴ID명</th>
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
              <th className="search-th w-[100px]">사용여부</th>
              <td className="search-td w-[10%]">
                <select
                  name="USE_YN"
                  className="combo-base w-full min-w-[80px]"
                  value={searchConditions.USE_YN}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                >
                  <option value="">전체</option>
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
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

      {/* 메뉴 목록 그리드 */}
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
          loadingOverlayComponent={() => <div className="text-center py-4">로딩 중...</div>}
          noRowsOverlayComponent={() => <div className="text-center py-4">조회된 정보가 없습니다.</div>}
          suppressRowClickSelection={false}
          animateRows={true}
          rowHeight={32}
          headerHeight={40}
          data-testid="menu-grid"
        />
      </div>

      {/* 상세 입력 폼 */}
      <table className="form-table w-full mb-4">
        <tbody>
          <tr className="form-tr">
            <th className="form-th w-[130px] required">메뉴명</th>
            <td className="form-td w-[250px]">
              <input
                type="text"
                className="input-base input-default w-full"
                value={selectedMenu?.MENU_NM || ''}
                onChange={e => setSelectedMenu(prev => prev ? { ...prev, MENU_NM: e.target.value } : null)}
                disabled={!selectedMenu}
              />
            </td>
            <th className="form-th w-[130px]">사용여부</th>
            <td className="form-td w-[10%]">
              <select
                className="combo-base w-full min-w-[60px]"
                value={selectedMenu?.USE_YN || 'Y'}
                disabled={!selectedMenu}
                onChange={e => setSelectedMenu(prev => prev ? { ...prev, USE_YN: e.target.value } : null)}
              >
                <option value="">전체</option>
                <option value="Y">사용</option>
                <option value="N">미사용</option>
              </select>
            </td>
            <td className="form-td"></td>
          </tr>
        </tbody>
      </table>

      {/* 버튼 셋 */}
      <div className="flex gap-2 justify-end mb-4">
        <button type="button" className="btn-base btn-delete" onClick={handleDelete} disabled={!selectedMenu || isNewMenu}>메뉴삭제</button>
        <button type="button" className="btn-base btn-etc" onClick={handleCopy} disabled={!selectedMenu}>복사저장</button>
        <button type="button" className="btn-base btn-etc" onClick={handleNew}>신규</button>
        <button type="button" className="btn-base btn-act" onClick={handleSave} disabled={!selectedMenu}>저장</button>
      </div>

      {/* 메뉴 트리 + 프로그램 정보 */}
      <div className="flex w-full gap-4 mt-4" style={{ height: 'calc(100vh - 600px)', minHeight: '200px' }}>
        {/* 좌측: 메뉴 트리 */}
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
                ＋
              </button>
              <button 
                type="button" 
                className="text-xl text-gray-400"
                onClick={() => {
                  setOpenIndexes([]);
                  setTreeExpanded(false);
                }}
              >
                －
              </button>
            </div>
          </div>
          <div className="menu-tree-wrap flex-1 overflow-auto">
            <ul className="menu-tree" style={{ listStyle: 'none' }}>
              {menuTree.length === 0 ? (
                <li className="text-gray-500 text-center p-4">메뉴 트리가 없습니다.</li>
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

        {/* 우측: 메뉴별 프로그램 */}
        <div className="w-2/3 flex flex-col">
          <div className="tit_area flex justify-between items-center">
            <h3>메뉴 별 프로그램</h3>
            <button type="button" className="btn-base btn-etc text-xs px-2 py-1"             onClick={() => {
              if (!selectedMenu) {
                showToast('메뉴를 먼저 선택해주세요.', 'warning');
                return;
              }
              console.log('메뉴 미리보기 클릭 - selectedMenu:', selectedMenu);
              console.log('메뉴 미리보기 클릭 - MENU_ID:', selectedMenu.MENU_ID);
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
              loadingOverlayComponent={() => <div className="text-center py-4">로딩 중...</div>}
              noRowsOverlayComponent={() => <div className="text-center py-4">조회된 정보가 없습니다.</div>}
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
                  // 구분 컬럼(MENU_SHP_DVCD_NM)이 변경된 경우, MENU_SHP_DVCD도 함께 업데이트
                  if (colDef.field === 'MENU_SHP_DVCD_NM') {
                    // divisionCodes에서 선택된 코드의 이름 찾기
                    if (Array.isArray(divisionCodes) && divisionCodes.length > 0) {
                      const selectedCode = divisionCodes.find(code => code.codeId === newValue);
                      if (selectedCode) {
                        // MENU_SHP_DVCD와 MENU_SHP_DVCD_NM 모두 업데이트
                        updated[index] = { 
                          ...data, 
                          MENU_SHP_DVCD: newValue, // 실제 코드 ID
                          MENU_SHP_DVCD_NM: selectedCode.codeNm // 표시명
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
                showToast('메뉴를 먼저 선택해주세요.', 'warning');
                return;
              }
              // 프로그램 검색 팝업 열기 (하단 버튼: INSERT_ROWS를 PGM_ID로 전달)
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
            <button type="button" className="btn-base btn-etc text-xs px-2 py-1" onClick={handleAddProgramRow}>추가</button>
            <button type="button" className="btn-base btn-delete text-xs px-2 py-1" onClick={handleDeleteProgramRows} disabled={selectedPrograms.size === 0}>삭제</button>
            <button type="button" className="btn-base btn-act text-xs px-2 py-1" onClick={handleSavePrograms}>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
} 