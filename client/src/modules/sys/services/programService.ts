import { Program, ProgramSearchParams, ProgramCreateDto, ProgramUpdateDto, ProgramListResponse } from '../types/program.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ProgramService {
  /**
   * ?ë¡ê·¸ë¨ ëª©ë¡??ì¡°í?©ë??
   * @param params ê²??ì¡°ê±´
   * @returns ?ë¡ê·¸ë¨ ëª©ë¡ ?ëµ
   */
  static async getProgramList(params: ProgramSearchParams = {}): Promise<ProgramListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.pgmKwd) searchParams.append('pgmKwd', params.pgmKwd);
    if (params.pgmDivCd) searchParams.append('pgmDivCd', params.pgmDivCd);
    if (params.useYn) searchParams.append('useYn', params.useYn);
    if (params.bizDivCd) searchParams.append('bizDivCd', params.bizDivCd);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    console.log('API ?¸ì¶ URL:', `${API_BASE_URL}/api/sys/programs?${searchParams.toString()}`);
    
    const response = await fetch(`${API_BASE_URL}/api/sys/programs?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API ?ëµ ?í:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API ?ë¬ ?ëµ:', errorText);
      throw new Error(`?ë¡ê·¸ë¨ ëª©ë¡ ì¡°í ?¤í¨: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API ?ëµ ?°ì´??', data);
    return data;
  }

  /**
   * ?ë¡ê·¸ë¨ IDë¡??¨ì¼ ?ë¡ê·¸ë¨??ì¡°í?©ë??
   * @param pgmId ?ë¡ê·¸ë¨ ID
   * @returns ?ë¡ê·¸ë¨ ?ë³´
   */
  static async getProgramById(pgmId: string): Promise<Program> {
    const response = await fetch(`${API_BASE_URL}/api/sys/programs/${pgmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`?ë¡ê·¸ë¨ ì¡°í ?¤í¨: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?ë¡???ë¡ê·¸ë¨???ì±?©ë??
   * @param data ?ë¡ê·¸ë¨ ?ì± ?°ì´??
   * @returns ?ì±???ë¡ê·¸ë¨ ?ë³´
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
      throw new Error(`?ë¡ê·¸ë¨ ?ì± ?¤í¨: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?ë¡ê·¸ë¨ ?ë³´ë¥??ì ?©ë??
   * @param pgmId ?ë¡ê·¸ë¨ ID
   * @param data ?ì ???ë¡ê·¸ë¨ ?°ì´??
   * @returns ?ì ???ë¡ê·¸ë¨ ?ë³´
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
      throw new Error(`?ë¡ê·¸ë¨ ?ì  ?¤í¨: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?ë¡ê·¸ë¨???? ?©ë??
   * @param pgmId ?ë¡ê·¸ë¨ ID
   * @returns ??  ?±ê³µ ?¬ë?
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
      throw new Error(`?ë¡ê·¸ë¨ ??  ?¤í¨: ${errorData.message || response.statusText}`);
    }

    return true;
  }
} 

