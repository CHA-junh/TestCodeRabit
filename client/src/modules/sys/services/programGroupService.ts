import { ProgramGroup, ProgramGroupSearchParams, ProgramGroupCreateDto, ProgramGroupUpdateDto, ProgramGroupListResponse } from '../types/programGroup.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ProgramGroupService {
  /**
   * ?�로???�로그램 그룹 ID�??�성?�니??
   * @returns ?�성???�로그램 그룹 ID
   */
  static async generateProgramGroupId(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/generate-id`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`?�로그램 그룹 ID ?�성 ?�패: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success && result.data?.pgmGrpId) {
      return result.data.pgmGrpId;
    } else {
      throw new Error(result.message || '?�로그램 그룹 ID ?�성 ?�패');
    }
  }

  /**
   * ?�로그램 그룹 목록??조회?�니??
   * @param params 검??조건
   * @returns ?�로그램 그룹 목록 ?�답
   */
  static async getProgramGroupList(params: ProgramGroupSearchParams = {}): Promise<ProgramGroupListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.PGM_GRP_NM) searchParams.append('PGM_GRP_NM', params.PGM_GRP_NM);
    if (params.USE_YN) searchParams.append('USE_YN', params.USE_YN);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`?�로그램 그룹 목록 조회 ?�패: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * ?�로그램 그룹 ID�??�일 ?�로그램 그룹??조회?�니??
   * @param groupId ?�로그램 그룹 ID
   * @returns ?�로그램 그룹 ?�보
   */
  static async getProgramGroupById(groupId: string): Promise<ProgramGroup> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`?�로그램 그룹 조회 ?�패: ${response.statusText}`);
    }

    const result = await response.json();
    
    // 백엔???�답 구조: { success: true, data: {...}, message: '...' }
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || '?�로그램 그룹 조회 ?�패');
    }
  }

  /**
   * ?�로???�로그램 그룹???�성?�니??
   * @param data ?�로그램 그룹 ?�성 ?�이??
   * @returns ?�성???�로그램 그룹 ?�보
   */
  static async createProgramGroup(data: ProgramGroupCreateDto): Promise<ProgramGroup> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`?�로그램 그룹 ?�성 ?�패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * ?�로그램 그룹 ?�보�??�정?�니??
   * @param groupId ?�로그램 그룹 ID
   * @param data ?�정???�로그램 그룹 ?�이??
   * @returns ?�정???�로그램 그룹 ?�보
   */
  static async updateProgramGroup(groupId: string, data: ProgramGroupUpdateDto): Promise<ProgramGroup> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`?�로그램 그룹 ?�정 ?�패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * ?�로그램 그룹????��?�니??
   * @param groupId ?�로그램 그룹 ID
   * @returns ??�� ?�공 ?��?
   */
  static async deleteProgramGroup(groupId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`?�로그램 그룹 ??�� ?�패: ${errorData.message || response.statusText}`);
    }

    return true;
  }

  /**
   * ?�정 ?�로그램 그룹???�한 ?�로그램 목록??조회?�니??
   * @param groupId ?�로그램 그룹 ID
   * @returns ?�로그램 목록
   */
  static async getProgramsByGroup(groupId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}/programs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`?�로그램 그룹 ?�로그램 조회 ?�패: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result || [];
  }

  /**
   * ?�로그램 그룹???�로그램 목록??조회?�니??
   * @param groupId ?�로그램 그룹 ID
   * @returns ?�로그램 목록 ?�답
   */
  static async getProgramGroupPrograms(groupId: string): Promise<{ success: boolean; data: any[]; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}/programs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`?�로그램 그룹 ?�로그램 조회 ?�패: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?�로그램 그룹 ?�세 ?�보�?조회?�니??
   * @param groupId ?�로그램 그룹 ID
   * @returns ?�로그램 그룹 ?�세 ?�보
   */
  static async getProgramGroupDetail(groupId: string): Promise<{ success: boolean; data: any; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`?�로그램 그룹 ?�세 조회 ?�패: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?�로그램 그룹???�?�합?�다.
   * @param programGroup ?�로그램 그룹 ?�이??
   * @returns ?�??결과
   */
  static async saveProgramGroup(programGroup: any): Promise<{ success: boolean; message: string }> {
    // ?�로그램 그룹 ?�보 ?�??(?�성 ?�는 ?�정)
    let response;
    if (programGroup.pgmGrpId) {
      // 기존 그룹 ?�정
      response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${programGroup.pgmGrpId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programGroup),
      });
    } else {
      // ?�규 그룹 ?�성
      response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programGroup),
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`?�로그램 그룹 ?�???�패: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?�로그램 그룹???�로그램??추�??�니??
   * @param groupId ?�로그램 그룹 ID
   * @param programIds 추�????�로그램 ID 배열
   * @returns 추�????�로그램 ??
   */
  static async addProgramsToGroup(groupId: string, programIds: string[]): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ programIds }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`?�로그램 추�? ?�패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.count || 0;
  }

  /**
   * ?�로그램 그룹?�서 ?�로그램???�거?�니??
   * @param groupId ?�로그램 그룹 ID
   * @param programIds ?�거???�로그램 ID 배열
   * @returns ?�거 결과
   */
  static async removeProgramsFromGroup(groupId: string, programIds: string[]): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}/programs`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ programIds }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`?�로그램 ?�거 ?�패: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?�로그램 그룹??복사?�니??
   * @param groupId 복사???�로그램 그룹 ID
   * @returns 복사 결과
   */
  static async copyProgramGroup(groupId: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}/copy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`?�로그램 그룹 복사 ?�패: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }
} 



