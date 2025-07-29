import { Program, ProgramSearchParams, ProgramCreateDto, ProgramUpdateDto, ProgramListResponse } from '../types/program.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ProgramService {
  /**
   * 프로그램 목록을 조회합니다.
   * @param params 검색 조건
   * @returns 프로그램 목록 응답
   */
  static async getProgramList(params: ProgramSearchParams = {}): Promise<ProgramListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.pgmKwd) searchParams.append('pgmKwd', params.pgmKwd);
    if (params.pgmDivCd) searchParams.append('pgmDivCd', params.pgmDivCd);
    if (params.useYn) searchParams.append('useYn', params.useYn);
    if (params.bizDivCd) searchParams.append('bizDivCd', params.bizDivCd);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    console.log('API 호출 URL:', `${API_BASE_URL}/api/sys/programs?${searchParams.toString()}`);
    
    const response = await fetch(`${API_BASE_URL}/api/sys/programs?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API 응답 상태:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      throw new Error(`프로그램 목록 조회 실패: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API 응답 데이터:', data);
    return data;
  }

  /**
   * 프로그램 ID로 단일 프로그램을 조회합니다.
   * @param pgmId 프로그램 ID
   * @returns 프로그램 정보
   */
  static async getProgramById(pgmId: string): Promise<Program> {
    const response = await fetch(`${API_BASE_URL}/api/sys/programs/${pgmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`프로그램 조회 실패: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 새로운 프로그램을 생성합니다.
   * @param data 프로그램 생성 데이터
   * @returns 생성된 프로그램 정보
   */
  static async createProgram(data: ProgramCreateDto): Promise<Program> {
    const response = await fetch(`${API_BASE_URL}/api/sys/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`프로그램 생성 실패: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * 프로그램 정보를 수정합니다.
   * @param pgmId 프로그램 ID
   * @param data 수정할 프로그램 데이터
   * @returns 수정된 프로그램 정보
   */
  static async updateProgram(pgmId: string, data: ProgramUpdateDto): Promise<Program> {
    const response = await fetch(`${API_BASE_URL}/api/sys/programs/${pgmId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`프로그램 수정 실패: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * 프로그램을 삭제합니다.
   * @param pgmId 프로그램 ID
   * @returns 삭제 성공 여부
   */
  static async deleteProgram(pgmId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/api/sys/programs/${pgmId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`프로그램 삭제 실패: ${errorData.message || response.statusText}`);
    }

    return true;
  }
} 