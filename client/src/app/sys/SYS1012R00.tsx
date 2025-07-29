/**
 * SYS1012R00 - 메뉴 미리보기 팝업 화면
 *
 * 주요 기능:
 * - 메뉴 계층 구조 미리보기
 * - 메뉴별 프로그램 정보 표시
 * - 메뉴 트리 확장/축소 기능
 * - 메뉴 선택 및 상세 정보 표시
 * - 팝업 형태로 동작하여 부모 화면과 분리
 *
 * API 연동:
 * - GET /api/sys/sys-menus/:menuId/preview - 메뉴 미리보기 데이터 조회
 *
 * 상태 관리:
 * - 메뉴 계층 구조 데이터
 * - 확장된 메뉴 항목들 (expandedItems)
 * - 선택된 메뉴 항목 (selectedMenu)
 * - 로딩 상태 및 에러 처리
 *
 * 사용자 인터페이스:
 * - 메뉴 계층 구조 트리 표시
 * - 메뉴 항목 확장/축소 버튼
 * - 메뉴 선택 시 상세 정보 표시
 * - 메뉴별 프로그램 정보 표시
 * - 닫기 버튼
 *
 * 연관 화면:
 * - SYS1002M00: 메뉴별 프로그램 관리 (미리보기 호출)
 * - SYS1001M00: 프로그램 그룹 관리 (메뉴 구조 확인)
 * - SYS1003M00: 사용자 역할 관리 (메뉴 권한 확인)
 *
 * 데이터 구조:
 * - MenuPreviewData: 메뉴 미리보기 데이터 (menuDspNm, pgmId, menuShpDvcd, children 등)
 * - SYS1012R00Props: 팝업 속성 (menuId, onClose)
 *
 * 특이사항:
 * - 팝업 형태로 동작하여 부모 화면에서 호출
 * - URL 파라미터 또는 props를 통한 메뉴 ID 전달
 * - React Query를 사용한 데이터 캐싱 및 상태 관리
 * - 계층적 메뉴 구조를 트리 형태로 표시
 * - 메뉴별 프로그램 정보를 함께 표시
 * - 확장/축소 상태를 로컬에서 관리
 * - 메뉴 선택 시 상세 정보를 우측에 표시
 *
 * 사용 예시:
 * - SYS1002M00에서 메뉴 구조 확인 시
 * - 메뉴별 프로그램 연결 상태 확인 시
 * - 메뉴 계층 구조 검증 시
 *
 * 데이터 흐름:
 * 1. menuId를 받아서 API 호출
 * 2. 서버에서 계층적 메뉴 데이터 반환
 * 3. 클라이언트에서 트리 구조로 변환
 * 4. 사용자가 확장/축소하며 탐색
 * 5. 메뉴 선택 시 상세 정보 표시
 */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MenuService } from '@/modules/sys/services/menuService';

interface MenuPreviewData {
  menuDspNm: string;
  pgmId: string;
  menuShpDvcd: string;
  hgrkMenuSeq: string;
  menuSeq: string;
  flag: string;
  menuUseYn: string;
  menuLvl: number;
  mapTitle: string;
  children?: MenuPreviewData[];
}

interface SYS1012R00Props {
  menuId?: string;
  onClose?: () => void;
}

export default function SYS1012R00({ menuId, onClose }: SYS1012R00Props) {
  // URL 파라미터에서 menuId 가져오기
  const [urlMenuId, setUrlMenuId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const menuIdFromUrl = urlParams.get('menuId');
      if (menuIdFromUrl) {
        setUrlMenuId(menuIdFromUrl);
      }
    }
  }, []);

  // props의 menuId가 우선, 없으면 URL 파라미터 사용
  const finalMenuId = menuId || urlMenuId;
  const [menuData, setMenuData] = useState<MenuPreviewData[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedMenu, setSelectedMenu] = useState<string>('');

  // 메뉴 데이터 조회
  const { data: menuList, refetch: refetchMenu, error, isLoading } = useQuery({
    queryKey: ['menuPreview', finalMenuId],
    queryFn: () => MenuService.getMenuPreview(finalMenuId || ''),
    enabled: !!finalMenuId,
  });

  useEffect(() => {
    console.log('SYS1012R00 - finalMenuId:', finalMenuId);
    console.log('SYS1012R00 - menuList:', menuList);
    console.log('SYS1012R00 - error:', error);
    console.log('SYS1012R00 - isLoading:', isLoading);
    
    if (menuList) {
      console.log('SYS1012R00 - setting menuData:', menuList);
      setMenuData(menuList);
    }
  }, [menuList, finalMenuId, error, isLoading]);

  // 계층적 메뉴 데이터 구성 (서버 원본 데이터 구조 사용)
  const buildHierarchicalMenu = useCallback((items: any[]): any[] => {
    console.log('buildHierarchicalMenu - input items:', items);
    
    const menuMap = new Map<string, any>();
    const rootItems: any[] = [];

    // 모든 아이템을 맵에 추가
    items.forEach(item => {
      menuMap.set(item.MENU_SEQ, { ...item, children: [] });
    });

    // 계층 구조 구성
    items.forEach(item => {
      const menuItem = menuMap.get(item.MENU_SEQ)!;
      console.log(`Processing item: ${item.MENU_DSP_NM}, menuSeq: ${item.MENU_SEQ}, hgrkMenuSeq: ${item.HGRK_MENU_SEQ}`);
      
      if (item.HGRK_MENU_SEQ === '0' || !menuMap.has(item.HGRK_MENU_SEQ)) {
        console.log(`Adding to root: ${item.MENU_DSP_NM}`);
        rootItems.push(menuItem);
      } else {
        const parent = menuMap.get(item.HGRK_MENU_SEQ);
        if (parent) {
          console.log(`Adding ${item.MENU_DSP_NM} as child of ${parent.MENU_DSP_NM}`);
          parent.children = parent.children || [];
          parent.children.push(menuItem);
        } else {
          console.log(`Parent not found for ${item.MENU_DSP_NM}, adding to root`);
          rootItems.push(menuItem);
        }
      }
    });

    console.log('buildHierarchicalMenu - rootItems:', rootItems);
    return rootItems;
  }, []);

  const hierarchicalMenu = buildHierarchicalMenu(menuList || []);
  console.log('SYS1012R00 - hierarchicalMenu:', hierarchicalMenu);

  // 트리 확장/축소
  const handleExpandAll = useCallback(() => {
    const allIds = new Set<string>();
    const collectIds = (items: any[]) => {
      items.forEach(item => {
        allIds.add(item.MENU_SEQ);
        if (item.children && item.children.length > 0) {
          collectIds(item.children);
        }
      });
    };
    collectIds(hierarchicalMenu);
    setExpandedItems(allIds);
  }, [hierarchicalMenu]);

  const handleCollapseAll = useCallback(() => {
    setExpandedItems(new Set());
  }, []);

  const handleToggleItem = useCallback((menuSeq: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuSeq)) {
        newSet.delete(menuSeq);
      } else {
        newSet.add(menuSeq);
      }
      return newSet;
    });
  }, []);

  // TREE MENU 렌더링 (Designs 스타일)
  const renderTreeMenu = () => {
    console.log('renderTreeMenu - hierarchicalMenu:', hierarchicalMenu);
    
    const renderTreeItem = (item: any, level: number = 0) => {
      const isExpanded = expandedItems.has(item.MENU_SEQ);
      const hasChildren = item.children && item.children.length > 0;
      const isSelected = selectedMenu === item.MENU_SEQ;

      // 하위 메뉴가 없고 프로그램도 없으면 표시하지 않음
      if (!hasChildren && !item.PGM_ID) {
        return null;
      }

      return (
        <div key={item.MENU_SEQ}>
          {/* 메뉴 아이템 */}
          <div
            className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded ${
              level === 0 
                ? 'pt-[4px] pb-[6px] border-b border-dashed text-stone-700 hover:text-[#0071DB]' 
                : `text-stone-700 hover:text-[#0071DB] ${
                    isSelected ? 'text-[#0071DB] font-bold bg-blue-50' : ''
                  }`
            }`}
            style={level > 0 ? { paddingLeft: `${6 + level * 16}px` } : {}}
            onClick={() => {
              if (hasChildren) {
                handleToggleItem(item.MENU_SEQ);
              } else {
                setSelectedMenu(item.MENU_SEQ);
              }
            }}
          >
            {hasChildren ? (
              <img
                src={isExpanded ? '/icon_minus.svg' : '/icon_plus.svg'}
                alt={isExpanded ? 'collapse' : 'expand'}
                className="w-4 h-4 shrink-0"
              />
            ) : (
              <img
                src="/icon_doc.svg"
                alt="menu"
                className="w-4 h-4 shrink-0"
              />
            )}
            <span className="leading-none inline-block m-2">
              {item.MENU_DSP_NM}
              {item.PGM_ID && <span className="text-stone-500 text-xs ml-1">({item.PGM_ID})</span>}
            </span>
          </div>

          {/* 하위 메뉴 */}
          {hasChildren && isExpanded && (
            <div className="space-y-1">
              {item.children!.map((child: any) => renderTreeItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="w-full h-full bg-white text-sm font-nanum flex flex-col">
        {/* 상단: 타이틀 */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-stone-300 bg-gray-50 shrink-0">
          <img src="/icon_lock.svg" alt="lock" className="w-4 h-4" />
          <span className="text-stone-700 text-base font-semibold">프로그램</span>
        </div>

        {/* 검색 영역 */}
        <div className="flex items-center justify-between px-2 py-1 border-b border-stone-200 bg-white shrink-0">
          <span className="text-stone-400 m-1">메뉴명을 입력 해 주세요</span>
          <div className="w-auto h-4 flex gap-2">
            <button onClick={handleExpandAll}>
              <img src="/icon_plus.svg" alt="expand all" className="w-4 h-4" />
            </button>
            <button onClick={handleCollapseAll}>
              <img src="/icon_minus.svg" alt="collapse all" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 메뉴 리스트: 스크롤 대상 영역 */}
        <div className="flex-1 overflow-y-auto py-1 space-y-1 scroll-area">
          {hierarchicalMenu.length === 0 ? (
            <div className="text-center text-stone-500 py-4">메뉴 데이터가 없습니다.</div>
          ) : (
            hierarchicalMenu
              .map((item: any) => renderTreeItem(item))
              .filter(Boolean) // null 값 제거
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="popup-wrapper">
      {/* 헤더 */}
      <div className="popup-header">
        <span className="popup-title">메뉴 미리보기</span>
        <button 
          className="popup-close" 
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              // 팝업 창인 경우 window.close() 사용
              if (window.opener) {
                window.close();
              }
            }
          }}
        >
          ×
        </button>
      </div>

      {/* 팝업 바디 */}
      <div className="popup-body">
        {/* 좌측: 메뉴 트리 패널 */}
        <div className="w-[300px] bg-[#e5e5e5] shrink-0 overflow-y-auto border-r border-stone-300">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-stone-600">메뉴 데이터를 불러오는 중...</p>
            </div>
          )}
          
          {error && (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <p className="text-red-600 mb-2">메뉴 데이터 조회 실패</p>
              <button 
                className="btn-base btn-etc text-xs"
                onClick={() => refetchMenu()}
              >
                다시 시도
              </button>
            </div>
          )}
          
          {!isLoading && !error && menuData.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full p-3">
              <p className="text-stone-600">조회된 메뉴 데이터가 없습니다.</p>
            </div>
          )}
          
          {!isLoading && !error && menuData.length > 0 && renderTreeMenu()}
        </div>
      </div>
    </div>
  );
} 