import { Menu, MenuSearchParams, MenuCreateDto, MenuUpdateDto, MenuListResponse } from '../types/menu.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class MenuService {
  /**
   * 메뉴 목록??조회?�니??
   * @param params 검??조건
   * @returns 메뉴 목록 ?�답
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
      throw new Error(`메뉴 목록 조회 ?�패: ${response.statusText}`);
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
   * 메뉴 ID�??�일 메뉴�?조회?�니??
   * @param menuId 메뉴 ID
   * @returns 메뉴 ?�보
   */
  static async getMenuById(menuId: string): Promise<Menu> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`메뉴 조회 ?�패: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * ?�로??메뉴�??�성?�니??
   * @param data 메뉴 ?�성 ?�이??
   * @returns ?�성??메뉴 ?�보
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
      throw new Error(`메뉴 ?�성 ?�패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * 메뉴 ?�보�??�정?�니??
   * @param menuId 메뉴 ID
   * @param data ?�정??메뉴 ?�이??
   * @returns ?�정??메뉴 ?�보
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
      throw new Error(`메뉴 ?�정 ?�패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * 메뉴�???��?�니??
   * @param menuId 메뉴 ID
   * @returns ??�� ?�공 ?��?
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
      throw new Error(`메뉴 ??�� ?�패: ${errorData.message || response.statusText}`);
    }

    return true;
  }

  /**
   * 메뉴�?복사?�니??
   * @param menuId ?�본 메뉴 ID
   * @param newMenuName ?�로??메뉴�?
   * @returns 복사??메뉴 ?�보
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
      throw new Error(`메뉴 복사 ?�패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * 메뉴 ?�리�?조회?�니??
   * @param menuId 메뉴 ID (?�체 ?�리 조회 ??'ALL' ?�용)
   * @returns 메뉴 ?�리 ?�보
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
      throw new Error(`메뉴 ?�리 조회 ?�패: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  }

  /**
   * ?�정 메뉴 기�??�로 ?�리�?조회?�니??
   * @param menuId 메뉴 ID
   * @returns 메뉴 ?�리 ?�보
   */
  static async getMenuTreeByMenu(menuId: string): Promise<any[]> {
    console.log('?�� MenuService.getMenuTreeByMenu ?�출 - 메뉴ID:', menuId);
    console.log('?�� API ?�드?�인??', `${API_BASE_URL}/api/sys/sys-menus/${menuId}/tree`);
    
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/tree`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('?�� API ?�답 ?�태:', response.status, response.statusText);

    if (!response.ok) {
      console.error('??API ?�출 ?�패:', response.status, response.statusText);
      throw new Error(`메뉴 ?�리 조회 ?�패: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('??API ?�답 ?�이??', result);
    
    return result.data || [];
  }

  /**
   * 메뉴 ?�세�?조회?�니??
   * @param menuId 메뉴 ID
   * @param parentMenuSeq ?�위 메뉴 ?�번
   * @returns 메뉴 ?�세 ?�보
   */
  static async getMenuDetails(menuId: string, parentMenuSeq: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/details/${parentMenuSeq}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`메뉴 ?�세 조회 ?�패: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  }

  // 메뉴�??�로그램 목록 조회 (SEIZE_TO_BIST 방식)
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
      throw new Error('메뉴�??�로그램 조회 ?�패');
    }

    const result = await response.json();
    return result.data || [];
  }

  // ?�로그램 검??
  static async searchPrograms(keyword: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/sys/programs/search?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('?�로그램 검???�패');
    }

    const result = await response.json();
    return result.data || [];
  }

  // 메뉴???�로그램 추�?
  static async addMenuProgram(menuId: string, programData: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programData),
    });

    if (!response.ok) {
      throw new Error('?�로그램 추�? ?�패');
    }
  }

  // 메뉴 ?�로그램 ??��
  static async deleteMenuProgram(menuId: string, menuSeq: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs/${menuSeq}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('?�로그램 ??�� ?�패');
    }
  }

  // 메뉴 ?�로그램 ?�??(SEIZE_TO_BIST 방식)
  static async saveMenuPrograms(menuId: string, programs: any[]): Promise<void> {
    console.log('?�� MenuService.saveMenuPrograms ?�출');
    console.log('?�� API URL:', `${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs/save`);
    console.log('?�� ?�청 ?�이??', { MENU_PGM: programs });
    
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ MENU_PGM: programs }),
    });

    console.log('?�� ?�답 ?�태:', response.status);
    console.log('?�� ?�답 ?�태 ?�스??', response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('??API ?�답 ?�러:', errorData);
      throw new Error(`메뉴 ?�로그램 ?�???�패: ${errorData.message || response.statusText}`);
    }
    
    const result = await response.json().catch(() => ({}));
    console.log('??API ?�답 ?�공:', result);
  }

  // 메뉴 ?�리 ?�서 ?�데?�트
  static async updateMenuTreeOrder(menuId: string, treeData: any[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/tree-order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(treeData),
    });

    if (!response.ok) {
      throw new Error('메뉴 ?�리 ?�서 ?�데?�트 ?�패');
    }
  }

  // ?�리 ?�서 ?�데?�트 (SEIZE_TO_BIST 방식)
  static async updateTreeMenu(menuId: string, treeData: any[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/update-tree-menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ TREE_MENU: treeData }),
    });

    if (!response.ok) {
      throw new Error('?�리 ?�서 ?�데?�트 ?�패');
    }
  }

  /**
   * 메뉴 미리보기�??�한 메뉴 ?�이?��? 조회?�니??
   * @param menuId 메뉴 ID
   * @returns 메뉴 미리보기 ?�이??
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
      throw new Error(`메뉴 미리보기 조회 ?�패: ${errorData.message || response.statusText}`);
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
      throw new Error('계층 ??�� ?�패');
    }
  }
} 

