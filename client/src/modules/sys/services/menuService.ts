import { Menu, MenuSearchParams, MenuCreateDto, MenuUpdateDto, MenuListResponse } from '../types/menu.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class MenuService {
  /**
   * 메뉴 목록을 조회합니다.
   * @param params 검색 조건
   * @returns 메뉴 목록 응답
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
      throw new Error(`메뉴 목록 조회 실패: ${response.statusText}`);
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
   * 메뉴 ID로 단일 메뉴를 조회합니다.
   * @param menuId 메뉴 ID
   * @returns 메뉴 정보
   */
  static async getMenuById(menuId: string): Promise<Menu> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`메뉴 조회 실패: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * 새로운 메뉴를 생성합니다.
   * @param data 메뉴 생성 데이터
   * @returns 생성된 메뉴 정보
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
      throw new Error(`메뉴 생성 실패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * 메뉴 정보를 수정합니다.
   * @param menuId 메뉴 ID
   * @param data 수정할 메뉴 데이터
   * @returns 수정된 메뉴 정보
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
      throw new Error(`메뉴 수정 실패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * 메뉴를 삭제합니다.
   * @param menuId 메뉴 ID
   * @returns 삭제 성공 여부
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
      throw new Error(`메뉴 삭제 실패: ${errorData.message || response.statusText}`);
    }

    return true;
  }

  /**
   * 메뉴를 복사합니다.
   * @param menuId 원본 메뉴 ID
   * @param newMenuName 새로운 메뉴명
   * @returns 복사된 메뉴 정보
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
      throw new Error(`메뉴 복사 실패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * 메뉴 트리를 조회합니다.
   * @param menuId 메뉴 ID (전체 트리 조회 시 'ALL' 사용)
   * @returns 메뉴 트리 정보
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
      throw new Error(`메뉴 트리 조회 실패: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  }

  /**
   * 특정 메뉴 기준으로 트리를 조회합니다.
   * @param menuId 메뉴 ID
   * @returns 메뉴 트리 정보
   */
  static async getMenuTreeByMenu(menuId: string): Promise<any[]> {
    console.log('🔍 MenuService.getMenuTreeByMenu 호출 - 메뉴ID:', menuId);
    console.log('📡 API 엔드포인트:', `${API_BASE_URL}/api/sys/sys-menus/${menuId}/tree`);
    
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/tree`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 API 응답 상태:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ API 호출 실패:', response.status, response.statusText);
      throw new Error(`메뉴 트리 조회 실패: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ API 응답 데이터:', result);
    
    return result.data || [];
  }

  /**
   * 메뉴 상세를 조회합니다.
   * @param menuId 메뉴 ID
   * @param parentMenuSeq 상위 메뉴 순번
   * @returns 메뉴 상세 정보
   */
  static async getMenuDetails(menuId: string, parentMenuSeq: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/details/${parentMenuSeq}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`메뉴 상세 조회 실패: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  }

  // 메뉴별 프로그램 목록 조회 (SEIZE_TO_BIST 방식)
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
      throw new Error('메뉴별 프로그램 조회 실패');
    }

    const result = await response.json();
    return result.data || [];
  }

  // 프로그램 검색
  static async searchPrograms(keyword: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/sys/programs/search?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('프로그램 검색 실패');
    }

    const result = await response.json();
    return result.data || [];
  }

  // 메뉴에 프로그램 추가
  static async addMenuProgram(menuId: string, programData: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programData),
    });

    if (!response.ok) {
      throw new Error('프로그램 추가 실패');
    }
  }

  // 메뉴 프로그램 삭제
  static async deleteMenuProgram(menuId: string, menuSeq: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs/${menuSeq}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('프로그램 삭제 실패');
    }
  }

  // 메뉴 프로그램 저장 (SEIZE_TO_BIST 방식)
  static async saveMenuPrograms(menuId: string, programs: any[]): Promise<void> {
    console.log('🔍 MenuService.saveMenuPrograms 호출');
    console.log('📋 API URL:', `${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs/save`);
    console.log('📋 요청 데이터:', { MENU_PGM: programs });
    
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/programs/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ MENU_PGM: programs }),
    });

    console.log('📋 응답 상태:', response.status);
    console.log('📋 응답 상태 텍스트:', response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API 응답 에러:', errorData);
      throw new Error(`메뉴 프로그램 저장 실패: ${errorData.message || response.statusText}`);
    }
    
    const result = await response.json().catch(() => ({}));
    console.log('✅ API 응답 성공:', result);
  }

  // 메뉴 트리 순서 업데이트
  static async updateMenuTreeOrder(menuId: string, treeData: any[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/tree-order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(treeData),
    });

    if (!response.ok) {
      throw new Error('메뉴 트리 순서 업데이트 실패');
    }
  }

  // 트리 순서 업데이트 (SEIZE_TO_BIST 방식)
  static async updateTreeMenu(menuId: string, treeData: any[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-menus/${menuId}/update-tree-menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ TREE_MENU: treeData }),
    });

    if (!response.ok) {
      throw new Error('트리 순서 업데이트 실패');
    }
  }

  /**
   * 메뉴 미리보기를 위한 메뉴 데이터를 조회합니다.
   * @param menuId 메뉴 ID
   * @returns 메뉴 미리보기 데이터
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
      throw new Error(`메뉴 미리보기 조회 실패: ${errorData.message || response.statusText}`);
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
      throw new Error('계층 삭제 실패');
    }
  }
} 