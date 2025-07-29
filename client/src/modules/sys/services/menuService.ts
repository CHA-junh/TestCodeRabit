import { Menu, MenuSearchParams, MenuCreateDto, MenuUpdateDto, MenuListResponse } from '../types/menu.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class MenuService {
  /**
   * ë©”ë‰´ ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * @param params ê²€??ì¡°ê±´
   * @returns ë©”ë‰´ ëª©ë¡ ?‘ë‹µ
   */
  static async getMenuList(params: MenuSearchParams = {}): Promise<MenuListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.MENU_KWD) searchParams.append('MENU_KWD', params.MENU_KWD);
    if (params.USE_YN) searchParams.append('USE_YN', params.USE_YN);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ë©”ë‰´ ëª©ë¡ ì¡°íšŒ ?¤íŒ¨: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      data: result.data || result || [],
      total: result.data?.length || result?.length || 0,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  }

  /**
   * ë©”ë‰´ IDë¡??¨ì¼ ë©”ë‰´ë¥?ì¡°íšŒ?©ë‹ˆ??
   * @param menuId ë©”ë‰´ ID
   * @returns ë©”ë‰´ ?•ë³´
   */
  static async getMenuById(menuId: string): Promise<Menu> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ë©”ë‰´ ì¡°íšŒ ?¤íŒ¨: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * ?ˆë¡œ??ë©”ë‰´ë¥??ì„±?©ë‹ˆ??
   * @param data ë©”ë‰´ ?ì„± ?°ì´??
   * @returns ?ì„±??ë©”ë‰´ ?•ë³´
   */
  static async createMenu(data: MenuCreateDto): Promise<Menu> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ë©”ë‰´ ?ì„± ?¤íŒ¨: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * ë©”ë‰´ ?•ë³´ë¥??˜ì •?©ë‹ˆ??
   * @param menuId ë©”ë‰´ ID
   * @param data ?˜ì •??ë©”ë‰´ ?°ì´??
   * @returns ?˜ì •??ë©”ë‰´ ?•ë³´
   */
  static async updateMenu(menuId: string, data: MenuUpdateDto): Promise<Menu> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ë©”ë‰´ ?˜ì • ?¤íŒ¨: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * ë©”ë‰´ë¥??? œ?©ë‹ˆ??
   * @param menuId ë©”ë‰´ ID
   * @returns ?? œ ?±ê³µ ?¬ë?
   */
  static async deleteMenu(menuId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ë©”ë‰´ ?? œ ?¤íŒ¨: ${errorData.message || response.statusText}`);
    }

    return true;
  }

  /**
   * ë©”ë‰´ë¥?ë³µì‚¬?©ë‹ˆ??
   * @param menuId ?ë³¸ ë©”ë‰´ ID
   * @param newMenuName ?ˆë¡œ??ë©”ë‰´ëª?
   * @returns ë³µì‚¬??ë©”ë‰´ ?•ë³´
   */
  static async copyMenu(menuId: string, newMenuName: string): Promise<Menu> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/copy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ menuName: newMenuName }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ë©”ë‰´ ë³µì‚¬ ?¤íŒ¨: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * ë©”ë‰´ ?¸ë¦¬ë¥?ì¡°íšŒ?©ë‹ˆ??
   * @param menuId ë©”ë‰´ ID (?„ì²´ ?¸ë¦¬ ì¡°íšŒ ??'ALL' ?¬ìš©)
   * @returns ë©”ë‰´ ?¸ë¦¬ ?•ë³´
   */
  static async getMenuTree(menuId: string = 'ALL'): Promise<any[]> {
    const url = menuId === 'ALL' ? `${API_BASE_URL}/api/sys/sys-menus/tree` : `${API_BASE_URL}/api/sys/sys-menus/${menuId}/tree`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ë©”ë‰´ ?¸ë¦¬ ì¡°íšŒ ?¤íŒ¨: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  }

  /**
   * ?¹ì • ë©”ë‰´ ê¸°ì??¼ë¡œ ?¸ë¦¬ë¥?ì¡°íšŒ?©ë‹ˆ??
   * @param menuId ë©”ë‰´ ID
   * @returns ë©”ë‰´ ?¸ë¦¬ ?•ë³´
   */
  static async getMenuTreeByMenu(menuId: string): Promise<any[]> {
    console.log('?” MenuService.getMenuTreeByMenu ?¸ì¶œ - ë©”ë‰´ID:', menuId);
    console.log('?“¡ API ?”ë“œ?¬ì¸??', `${API_BASE_URL}/api/sys/sys-menus/${menuId}/tree`);
    
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/tree`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('?“Š API ?‘ë‹µ ?íƒœ:', response.status, response.statusText);

    if (!response.ok) {
      console.error('??API ?¸ì¶œ ?¤íŒ¨:', response.status, response.statusText);
      throw new Error(`ë©”ë‰´ ?¸ë¦¬ ì¡°íšŒ ?¤íŒ¨: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('??API ?‘ë‹µ ?°ì´??', result);
    
    return result.data || [];
  }

  /**
   * ë©”ë‰´ ?ì„¸ë¥?ì¡°íšŒ?©ë‹ˆ??
   * @param menuId ë©”ë‰´ ID
   * @param parentMenuSeq ?ìœ„ ë©”ë‰´ ?œë²ˆ
   * @returns ë©”ë‰´ ?ì„¸ ?•ë³´
   */
  static async getMenuDetails(menuId: string, parentMenuSeq: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/details/${parentMenuSeq}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ë©”ë‰´ ?ì„¸ ì¡°íšŒ ?¤íŒ¨: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  }

  // ë©”ë‰´ë³??„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ (SEIZE_TO_BIST ë°©ì‹)
  static async getMenuPrograms(menuId: string, menuSeq?: number): Promise<any[]> {
    const url = menuSeq !== undefined 
      ? `${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs?menuSeq=${menuSeq}`
      : `${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('ë©”ë‰´ë³??„ë¡œê·¸ë¨ ì¡°íšŒ ?¤íŒ¨');
    }

    const result = await response.json();
    return result.data || [];
  }

  // ?„ë¡œê·¸ë¨ ê²€??
  static async searchPrograms(keyword: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/sys/programs/search?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('?„ë¡œê·¸ë¨ ê²€???¤íŒ¨');
    }

    const result = await response.json();
    return result.data || [];
  }

  // ë©”ë‰´???„ë¡œê·¸ë¨ ì¶”ê?
  static async addMenuProgram(menuId: string, programData: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programData),
    });

    if (!response.ok) {
      throw new Error('?„ë¡œê·¸ë¨ ì¶”ê? ?¤íŒ¨');
    }
  }

  // ë©”ë‰´ ?„ë¡œê·¸ë¨ ?? œ
  static async deleteMenuProgram(menuId: string, menuSeq: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs/${menuSeq}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('?„ë¡œê·¸ë¨ ?? œ ?¤íŒ¨');
    }
  }

  // ë©”ë‰´ ?„ë¡œê·¸ë¨ ?€??(SEIZE_TO_BIST ë°©ì‹)
  static async saveMenuPrograms(menuId: string, programs: any[]): Promise<void> {
    console.log('?” MenuService.saveMenuPrograms ?¸ì¶œ');
    console.log('?“‹ API URL:', `${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs/save`);
    console.log('?“‹ ?”ì²­ ?°ì´??', { MENU_PGM: programs });
    
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ MENU_PGM: programs }),
    });

    console.log('?“‹ ?‘ë‹µ ?íƒœ:', response.status);
    console.log('?“‹ ?‘ë‹µ ?íƒœ ?ìŠ¤??', response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('??API ?‘ë‹µ ?ëŸ¬:', errorData);
      throw new Error(`ë©”ë‰´ ?„ë¡œê·¸ë¨ ?€???¤íŒ¨: ${errorData.message || response.statusText}`);
    }
    
    const result = await response.json().catch(() => ({}));
    console.log('??API ?‘ë‹µ ?±ê³µ:', result);
  }

  // ë©”ë‰´ ?¸ë¦¬ ?œì„œ ?…ë°?´íŠ¸
  static async updateMenuTreeOrder(menuId: string, treeData: any[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/tree-order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(treeData),
    });

    if (!response.ok) {
      throw new Error('ë©”ë‰´ ?¸ë¦¬ ?œì„œ ?…ë°?´íŠ¸ ?¤íŒ¨');
    }
  }

  // ?¸ë¦¬ ?œì„œ ?…ë°?´íŠ¸ (SEIZE_TO_BIST ë°©ì‹)
  static async updateTreeMenu(menuId: string, treeData: any[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/update-tree-menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ TREE_MENU: treeData }),
    });

    if (!response.ok) {
      throw new Error('?¸ë¦¬ ?œì„œ ?…ë°?´íŠ¸ ?¤íŒ¨');
    }
  }

  /**
   * ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸°ë¥??„í•œ ë©”ë‰´ ?°ì´?°ë? ì¡°íšŒ?©ë‹ˆ??
   * @param menuId ë©”ë‰´ ID
   * @returns ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ?°ì´??
   */
  static async getMenuPreview(menuId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/preview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ë©”ë‰´ ë¯¸ë¦¬ë³´ê¸° ì¡°íšŒ ?¤íŒ¨: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result || [];
  }

  static async deleteMenuProgramsHierarchical(menuId: string, menuSeqs: number[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs/delete-hierarchical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menuSeqs }),
    });
    if (!response.ok) {
      throw new Error('ê³„ì¸µ ?? œ ?¤íŒ¨');
    }
  }
} 

