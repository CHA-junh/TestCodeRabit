/**
 * SYS1012R00 - 메뉴 미리보기 ?�업 ?�면
 *
 * 주요 기능:
 * - 메뉴 계층 구조 미리보기
 * - 메뉴�??�로그램 ?�보 ?�시
 * - 메뉴 ?�리 ?�장/축소 기능
 * - 메뉴 ?�택 �??�세 ?�보 ?�시
 * - ?�업 ?�태�??�작?�여 부�??�면�?분리
 *
 * API ?�동:
 * - GET /api/sys/sys-menus/:menuId/preview - 메뉴 미리보기 ?�이??조회
 *
 * ?�태 관�?
 * - 메뉴 계층 구조 ?�이??
 * - ?�장??메뉴 ??��??(expandedItems)
 * - ?�택??메뉴 ??�� (selectedMenu)
 * - 로딩 ?�태 �??�러 처리
 *
 * ?�용???�터?�이??
 * - 메뉴 계층 구조 ?�리 ?�시
 * - 메뉴 ??�� ?�장/축소 버튼
 * - 메뉴 ?�택 ???�세 ?�보 ?�시
 * - 메뉴�??�로그램 ?�보 ?�시
 * - ?�기 버튼
 *
 * ?��? ?�면:
 * - SYS1002M00: 메뉴�??�로그램 관�?(미리보기 ?�출)
 * - SYS1001M00: ?�로그램 그룹 관�?(메뉴 구조 ?�인)
 * - SYS1003M00: ?�용????�� 관�?(메뉴 권한 ?�인)
 *
 * ?�이??구조:
 * - MenuPreviewData: 메뉴 미리보기 ?�이??(menuDspNm, pgmId, menuShpDvcd, children ??
 * - SYS1012R00Props: ?�업 ?�성 (menuId, onClose)
 *
 * ?�이?�항:
 * - ?�업 ?�태�??�작?�여 부�??�면?�서 ?�출
 * - URL ?�라미터 ?�는 props�??�한 메뉴 ID ?�달
 * - React Query�??�용???�이??캐싱 �??�태 관�?
 * - 계층??메뉴 구조�??�리 ?�태�??�시
 * - 메뉴�??�로그램 ?�보�??�께 ?�시
 * - ?�장/축소 ?�태�?로컬?�서 관�?
 * - 메뉴 ?�택 ???�세 ?�보�??�측???�시
 *
 * ?�용 ?�시:
 * - SYS1002M00?�서 메뉴 구조 ?�인 ??
 * - 메뉴�??�로그램 ?�결 ?�태 ?�인 ??
 * - 메뉴 계층 구조 검�???
 *
 * ?�이???�름:
 * 1. menuId�?받아??API ?�출
 * 2. ?�버?�서 계층??메뉴 ?�이??반환
 * 3. ?�라?�언?�에???�리 구조�?변??
 * 4. ?�용?��? ?�장/축소?�며 ?�색
 * 5. 메뉴 ?�택 ???�세 ?�보 ?�시
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
  // URL ?�라미터?�서 menuId 가?�오�?
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

  // props??menuId가 ?�선, ?�으�?URL ?�라미터 ?�용
  const finalMenuId = menuId || urlMenuId;
  const [menuData, setMenuData] = useState<MenuPreviewData[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedMenu, setSelectedMenu] = useState<string>('');

  // 메뉴 ?�이??조회
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

  // 계층??메뉴 ?�이??구성 (?�버 ?�본 ?�이??구조 ?�용)
  const buildHierarchicalMenu = useCallback((items: any[]): any[] => {
    console.log('buildHierarchicalMenu - input items:', items);
    
    const menuMap = new Map<string, any>();
    const rootItems: any[] = [];

    // 모든 ?�이?�을 맵에 추�?
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

  // ?�리 ?�장/축소
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

  // TREE MENU ?�더�?(Designs ?��???
  const renderTreeMenu = () => {
    console.log('renderTreeMenu - hierarchicalMenu:', hierarchicalMenu);
    
    const renderTreeItem = (item: any, level: number = 0) => {
      const isExpanded = expandedItems.has(item.MENU_SEQ);
      const hasChildren = item.children && item.children.length > 0;
      const isSelected = selectedMenu === item.MENU_SEQ;

      // ?�위 메뉴가 ?�고 ?�로그램???�으�??�시?��? ?�음
      if (!hasChildren && !item.PGM_ID) {
        return null;
      }

      return (
        <div key={item.MENU_SEQ}>
          {/* 메뉴 ?�이??*/}
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

          {/* ?�위 메뉴 */}
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
        {/* ?�단: ?�?��? */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-stone-300 bg-gray-50 shrink-0">
          <img src="/icon_lock.svg" alt="lock" className="w-4 h-4" />
          <span className="text-stone-700 text-base font-semibold">?�로그램</span>
        </div>

        {/* 검???�역 */}
        <div className="flex items-center justify-between px-2 py-1 border-b border-stone-200 bg-white shrink-0">
          <span className="text-stone-400 m-1">메뉴명을 ?�력 ??주세??/span>
          <div className="w-auto h-4 flex gap-2">
            <button onClick={handleExpandAll}>
              <img src="/icon_plus.svg" alt="expand all" className="w-4 h-4" />
            </button>
            <button onClick={handleCollapseAll}>
              <img src="/icon_minus.svg" alt="collapse all" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 메뉴 리스?? ?�크�??�???�역 */}
        <div className="flex-1 overflow-y-auto py-1 space-y-1 scroll-area">
          {hierarchicalMenu.length === 0 ? (
            <div className="text-center text-stone-500 py-4">메뉴 ?�이?��? ?�습?�다.</div>
          ) : (
            hierarchicalMenu
              .map((item: any) => renderTreeItem(item))
              .filter(Boolean) // null �??�거
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="popup-wrapper">
      {/* ?�더 */}
      <div className="popup-header">
        <span className="popup-title">메뉴 미리보기</span>
        <button 
          className="popup-close" 
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              // ?�업 창인 경우 window.close() ?�용
              if (window.opener) {
                window.close();
              }
            }
          }}
        >
          ×
        </button>
      </div>

      {/* ?�업 바디 */}
      <div className="popup-body">
        {/* 좌측: 메뉴 ?�리 ?�널 */}
        <div className="w-[300px] bg-[#e5e5e5] shrink-0 overflow-y-auto border-r border-stone-300">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-stone-600">메뉴 ?�이?��? 불러?�는 �?..</p>
            </div>
          )}
          
          {error && (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <p className="text-red-600 mb-2">메뉴 ?�이??조회 ?�패</p>
              <button 
                className="btn-base btn-etc text-xs"
                onClick={() => refetchMenu()}
              >
                ?�시 ?�도
              </button>
            </div>
          )}
          
          {!isLoading && !error && menuData.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full p-3">
              <p className="text-stone-600">조회??메뉴 ?�이?��? ?�습?�다.</p>
            </div>
          )}
          
          {!isLoading && !error && menuData.length > 0 && renderTreeMenu()}
        </div>
      </div>
    </div>
  );
} 

