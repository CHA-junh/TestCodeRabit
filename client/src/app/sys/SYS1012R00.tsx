/**
 * SYS1012R00 - ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?ì—… ?”ë©´
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ë©”ë‰´ ê³„ì¸µ êµ¬ì¡° ë¯¸ë¦¬ë³´ê¸°
 * - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ?•ë³´ ?œì‹œ
 * - ë©”ë‰´ ?¸ë¦¬ ?•ì¥/ì¶•ì†Œ ê¸°ëŠ¥
 * - ë©”ë‰´ ? íƒ ë°??ì„¸ ?•ë³´ ?œì‹œ
 * - ?ì—… ?•íƒœë¡??™ì‘?˜ì—¬ ë¶€ëª??”ë©´ê³?ë¶„ë¦¬
 *
 * API ?°ë™:
 * - GET /api/sys/sys-menus/:menuId/preview - ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?°ì´??ì¡°íšŒ
 *
 * ?íƒœ ê´€ë¦?
 * - ë©”ë‰´ ê³„ì¸µ êµ¬ì¡° ?°ì´??
 * - ?•ì¥??ë©”ë‰´ ??ª©??(expandedItems)
 * - ? íƒ??ë©”ë‰´ ??ª© (selectedMenu)
 * - ë¡œë”© ?íƒœ ë°??ëŸ¬ ì²˜ë¦¬
 *
 * ?¬ìš©???¸í„°?˜ì´??
 * - ë©”ë‰´ ê³„ì¸µ êµ¬ì¡° ?¸ë¦¬ ?œì‹œ
 * - ë©”ë‰´ ??ª© ?•ì¥/ì¶•ì†Œ ë²„íŠ¼
 * - ë©”ë‰´ ? íƒ ???ì„¸ ?•ë³´ ?œì‹œ
 * - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ?•ë³´ ?œì‹œ
 * - ?«ê¸° ë²„íŠ¼
 *
 * ?°ê? ?”ë©´:
 * - SYS1002M00: ë©”ë‰´ë³??„ë¡œê·¸ë¨ ê´€ë¦?(ë¯¸ë¦¬ë³´ê¸° ?¸ì¶œ)
 * - SYS1001M00: ?„ë¡œê·¸ë¨ ê·¸ë£¹ ê´€ë¦?(ë©”ë‰´ êµ¬ì¡° ?•ì¸)
 * - SYS1003M00: ?¬ìš©????•  ê´€ë¦?(ë©”ë‰´ ê¶Œí•œ ?•ì¸)
 *
 * ?°ì´??êµ¬ì¡°:
 * - MenuPreviewData: ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?°ì´??(menuDspNm, pgmId, menuShpDvcd, children ??
 * - SYS1012R00Props: ?ì—… ?ì„± (menuId, onClose)
 *
 * ?¹ì´?¬í•­:
 * - ?ì—… ?•íƒœë¡??™ì‘?˜ì—¬ ë¶€ëª??”ë©´?ì„œ ?¸ì¶œ
 * - URL ?Œë¼ë¯¸í„° ?ëŠ” propsë¥??µí•œ ë©”ë‰´ ID ?„ë‹¬
 * - React Queryë¥??¬ìš©???°ì´??ìºì‹± ë°??íƒœ ê´€ë¦?
 * - ê³„ì¸µ??ë©”ë‰´ êµ¬ì¡°ë¥??¸ë¦¬ ?•íƒœë¡??œì‹œ
 * - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ?•ë³´ë¥??¨ê»˜ ?œì‹œ
 * - ?•ì¥/ì¶•ì†Œ ?íƒœë¥?ë¡œì»¬?ì„œ ê´€ë¦?
 * - ë©”ë‰´ ? íƒ ???ì„¸ ?•ë³´ë¥??°ì¸¡???œì‹œ
 *
 * ?¬ìš© ?ˆì‹œ:
 * - SYS1002M00?ì„œ ë©”ë‰´ êµ¬ì¡° ?•ì¸ ??
 * - ë©”ë‰´ë³??„ë¡œê·¸ë¨ ?°ê²° ?íƒœ ?•ì¸ ??
 * - ë©”ë‰´ ê³„ì¸µ êµ¬ì¡° ê²€ì¦???
 *
 * ?°ì´???ë¦„:
 * 1. menuIdë¥?ë°›ì•„??API ?¸ì¶œ
 * 2. ?œë²„?ì„œ ê³„ì¸µ??ë©”ë‰´ ?°ì´??ë°˜í™˜
 * 3. ?´ë¼?´ì–¸?¸ì—???¸ë¦¬ êµ¬ì¡°ë¡?ë³€??
 * 4. ?¬ìš©?ê? ?•ì¥/ì¶•ì†Œ?˜ë©° ?ìƒ‰
 * 5. ë©”ë‰´ ? íƒ ???ì„¸ ?•ë³´ ?œì‹œ
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
  // URL ?Œë¼ë¯¸í„°?ì„œ menuId ê°€?¸ì˜¤ê¸?
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

  // props??menuIdê°€ ?°ì„ , ?†ìœ¼ë©?URL ?Œë¼ë¯¸í„° ?¬ìš©
  const finalMenuId = menuId || urlMenuId;
  const [menuData, setMenuData] = useState<MenuPreviewData[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedMenu, setSelectedMenu] = useState<string>('');

  // ë©”ë‰´ ?°ì´??ì¡°íšŒ
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

  // ê³„ì¸µ??ë©”ë‰´ ?°ì´??êµ¬ì„± (?œë²„ ?ë³¸ ?°ì´??êµ¬ì¡° ?¬ìš©)
  const buildHierarchicalMenu = useCallback((items: any[]): any[] => {
    console.log('buildHierarchicalMenu - input items:', items);
    
    const menuMap = new Map<string, any>();
    const rootItems: any[] = [];

    // ëª¨ë“  ?„ì´?œì„ ë§µì— ì¶”ê?
    items.forEach(item => {
      menuMap.set(item.MENU_SEQ, { ...item, children: [] });
    });

    // ê³„ì¸µ êµ¬ì¡° êµ¬ì„±
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

  // ?¸ë¦¬ ?•ì¥/ì¶•ì†Œ
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

  // TREE MENU ?Œë”ë§?(Designs ?¤í???
  const renderTreeMenu = () => {
    console.log('renderTreeMenu - hierarchicalMenu:', hierarchicalMenu);
    
    const renderTreeItem = (item: any, level: number = 0) => {
      const isExpanded = expandedItems.has(item.MENU_SEQ);
      const hasChildren = item.children && item.children.length > 0;
      const isSelected = selectedMenu === item.MENU_SEQ;

      // ?˜ìœ„ ë©”ë‰´ê°€ ?†ê³  ?„ë¡œê·¸ë¨???†ìœ¼ë©??œì‹œ?˜ì? ?ŠìŒ
      if (!hasChildren && !item.PGM_ID) {
        return null;
      }

      return (
        <div key={item.MENU_SEQ}>
          {/* ë©”ë‰´ ?„ì´??*/}
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

          {/* ?˜ìœ„ ë©”ë‰´ */}
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
        {/* ?ë‹¨: ?€?´í? */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-stone-300 bg-gray-50 shrink-0">
          <img src="/icon_lock.svg" alt="lock" className="w-4 h-4" />
          <span className="text-stone-700 text-base font-semibold">?„ë¡œê·¸ë¨</span>
        </div>

        {/* ê²€???ì—­ */}
        <div className="flex items-center justify-between px-2 py-1 border-b border-stone-200 bg-white shrink-0">
          <span className="text-stone-400 m-1">ë©”ë‰´ëª…ì„ ?…ë ¥ ??ì£¼ì„¸??/span>
          <div className="w-auto h-4 flex gap-2">
            <button onClick={handleExpandAll}>
              <img src="/icon_plus.svg" alt="expand all" className="w-4 h-4" />
            </button>
            <button onClick={handleCollapseAll}>
              <img src="/icon_minus.svg" alt="collapse all" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ë©”ë‰´ ë¦¬ìŠ¤?? ?¤í¬ë¡??€???ì—­ */}
        <div className="flex-1 overflow-y-auto py-1 space-y-1 scroll-area">
          {hierarchicalMenu.length === 0 ? (
            <div className="text-center text-stone-500 py-4">ë©”ë‰´ ?°ì´?°ê? ?†ìŠµ?ˆë‹¤.</div>
          ) : (
            hierarchicalMenu
              .map((item: any) => renderTreeItem(item))
              .filter(Boolean) // null ê°??œê±°
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="popup-wrapper">
      {/* ?¤ë” */}
      <div className="popup-header">
        <span className="popup-title">ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸°</span>
        <button 
          className="popup-close" 
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              // ?ì—… ì°½ì¸ ê²½ìš° window.close() ?¬ìš©
              if (window.opener) {
                window.close();
              }
            }
          }}
        >
          Ã—
        </button>
      </div>

      {/* ?ì—… ë°”ë”” */}
      <div className="popup-body">
        {/* ì¢Œì¸¡: ë©”ë‰´ ?¸ë¦¬ ?¨ë„ */}
        <div className="w-[300px] bg-[#e5e5e5] shrink-0 overflow-y-auto border-r border-stone-300">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-stone-600">ë©”ë‰´ ?°ì´?°ë? ë¶ˆëŸ¬?¤ëŠ” ì¤?..</p>
            </div>
          )}
          
          {error && (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <p className="text-red-600 mb-2">ë©”ë‰´ ?°ì´??ì¡°íšŒ ?¤íŒ¨</p>
              <button 
                className="btn-base btn-etc text-xs"
                onClick={() => refetchMenu()}
              >
                ?¤ì‹œ ?œë„
              </button>
            </div>
          )}
          
          {!isLoading && !error && menuData.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full p-3">
              <p className="text-stone-600">ì¡°íšŒ??ë©”ë‰´ ?°ì´?°ê? ?†ìŠµ?ˆë‹¤.</p>
            </div>
          )}
          
          {!isLoading && !error && menuData.length > 0 && renderTreeMenu()}
        </div>
      </div>
    </div>
  );
} 

