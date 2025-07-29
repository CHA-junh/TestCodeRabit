import { ProgramGroup, ProgramGroupSearchParams, ProgramGroupCreateDto, ProgramGroupUpdateDto, ProgramGroupListResponse } from '../types/programGroup.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ProgramGroupService {
  /**
   * 새로운 프로그램 그룹 ID를 생성합니다.
   * @returns 생성된 프로그램 그룹 ID
   */
  static async generateProgramGroupId(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/generate-id`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`프로그램 그룹 ID 생성 실패: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success && result.data?.pgmGrpId) {
      return result.data.pgmGrpId;
    } else {
      throw new Error(result.message || '프로그램 그룹 ID 생성 실패');
    }
  }

  /**
   * 프로그램 그룹 목록을 조회합니다.
   * @param params 검색 조건
   * @returns 프로그램 그룹 목록 응답
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
      throw new Error(`프로그램 그룹 목록 조회 실패: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * 프로그램 그룹 ID로 단일 프로그램 그룹을 조회합니다.
   * @param groupId 프로그램 그룹 ID
   * @returns 프로그램 그룹 정보
   */
  static async getProgramGroupById(groupId: string): Promise<ProgramGroup> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`프로그램 그룹 조회 실패: ${response.statusText}`);
    }

    const result = await response.json();
    
    // 백엔드 응답 구조: { success: true, data: {...}, message: '...' }
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || '프로그램 그룹 조회 실패');
    }
  }

  /**
   * 새로운 프로그램 그룹을 생성합니다.
   * @param data 프로그램 그룹 생성 데이터
   * @returns 생성된 프로그램 그룹 정보
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
      throw new Error(`프로그램 그룹 생성 실패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * 프로그램 그룹 정보를 수정합니다.
   * @param groupId 프로그램 그룹 ID
   * @param data 수정할 프로그램 그룹 데이터
   * @returns 수정된 프로그램 그룹 정보
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
      throw new Error(`프로그램 그룹 수정 실패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * 프로그램 그룹을 삭제합니다.
   * @param groupId 프로그램 그룹 ID
   * @returns 삭제 성공 여부
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
      throw new Error(`프로그램 그룹 삭제 실패: ${errorData.message || response.statusText}`);
    }

    return true;
  }

  /**
   * 특정 프로그램 그룹에 속한 프로그램 목록을 조회합니다.
   * @param groupId 프로그램 그룹 ID
   * @returns 프로그램 목록
   */
  static async getProgramsByGroup(groupId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}/programs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`프로그램 그룹 프로그램 조회 실패: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result || [];
  }

  /**
   * 프로그램 그룹의 프로그램 목록을 조회합니다.
   * @param groupId 프로그램 그룹 ID
   * @returns 프로그램 목록 응답
   */
  static async getProgramGroupPrograms(groupId: string): Promise<{ success: boolean; data: any[]; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}/programs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`프로그램 그룹 프로그램 조회 실패: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 프로그램 그룹 상세 정보를 조회합니다.
   * @param groupId 프로그램 그룹 ID
   * @returns 프로그램 그룹 상세 정보
   */
  static async getProgramGroupDetail(groupId: string): Promise<{ success: boolean; data: any; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${groupId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`프로그램 그룹 상세 조회 실패: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 프로그램 그룹을 저장합니다.
   * @param programGroup 프로그램 그룹 데이터
   * @returns 저장 결과
   */
  static async saveProgramGroup(programGroup: any): Promise<{ success: boolean; message: string }> {
    // 프로그램 그룹 정보 저장 (생성 또는 수정)
    let response;
    if (programGroup.pgmGrpId) {
      // 기존 그룹 수정
      response = await fetch(`${API_BASE_URL}/api/sys/sys-program-groups/${programGroup.pgmGrpId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programGroup),
      });
    } else {
      // 신규 그룹 생성
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
      throw new Error(`프로그램 그룹 저장 실패: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * 프로그램 그룹에 프로그램을 추가합니다.
   * @param groupId 프로그램 그룹 ID
   * @param programIds 추가할 프로그램 ID 배열
   * @returns 추가된 프로그램 수
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
      throw new Error(`프로그램 추가 실패: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result.count || 0;
  }

  /**
   * 프로그램 그룹에서 프로그램을 제거합니다.
   * @param groupId 프로그램 그룹 ID
   * @param programIds 제거할 프로그램 ID 배열
   * @returns 제거 결과
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
      throw new Error(`프로그램 제거 실패: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * 프로그램 그룹을 복사합니다.
   * @param groupId 복사할 프로그램 그룹 ID
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
      throw new Error(`프로그램 그룹 복사 실패: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }
} 
