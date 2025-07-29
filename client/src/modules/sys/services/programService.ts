import { Program, ProgramSearchParams, ProgramCreateDto, ProgramUpdateDto, ProgramListResponse } from '../types/program.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ProgramService {
  /**
   * ?�로그램 목록??조회?�니??
   * @param params 검??조건
   * @returns ?�로그램 목록 ?�답
   */
  static async getProgramList(params: ProgramSearchParams = {}): Promise<ProgramListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.pgmKwd) searchParams.append('pgmKwd', params.pgmKwd);
    if (params.pgmDivCd) searchParams.append('pgmDivCd', params.pgmDivCd);
    if (params.useYn) searchParams.append('useYn', params.useYn);
    if (params.bizDivCd) searchParams.append('bizDivCd', params.bizDivCd);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    console.log('API ?�출 URL:', `${API_BASE_URL}/api/sys/programs?${searchParams.toString()}`);
    
    const response = await fetch(`${API_BASE_URL}/api/sys/programs?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API ?�답 ?�태:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API ?�러 ?�답:', errorText);
      throw new Error(`?�로그램 목록 조회 ?�패: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API ?�답 ?�이??', data);
    return data;
  }

  /**
   * ?�로그램 ID�??�일 ?�로그램??조회?�니??
   * @param pgmId ?�로그램 ID
   * @returns ?�로그램 ?�보
   */
  static async getProgramById(pgmId: string): Promise<Program> {
    const response = await fetch(`${API_BASE_URL}/api/sys/programs/${pgmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`?�로그램 조회 ?�패: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?�로???�로그램???�성?�니??
   * @param data ?�로그램 ?�성 ?�이??
   * @returns ?�성???�로그램 ?�보
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
      throw new Error(`?�로그램 ?�성 ?�패: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?�로그램 ?�보�??�정?�니??
   * @param pgmId ?�로그램 ID
   * @param data ?�정???�로그램 ?�이??
   * @returns ?�정???�로그램 ?�보
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
      throw new Error(`?�로그램 ?�정 ?�패: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?�로그램????��?�니??
   * @param pgmId ?�로그램 ID
   * @returns ??�� ?�공 ?��?
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
      throw new Error(`?�로그램 ??�� ?�패: ${errorData.message || response.statusText}`);
    }

    return true;
  }
} 


