import { Program, ProgramSearchParams, ProgramCreateDto, ProgramUpdateDto, ProgramListResponse } from '../types/program.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ProgramService {
  /**
   * ?„ë¡œê·¸ë¨ ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
   * @param params ê²€??ì¡°ê±´
   * @returns ?„ë¡œê·¸ë¨ ëª©ë¡ ?‘ë‹µ
   */
  static async getProgramList(params: ProgramSearchParams = {}): Promise<ProgramListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.pgmKwd) searchParams.append('pgmKwd', params.pgmKwd);
    if (params.pgmDivCd) searchParams.append('pgmDivCd', params.pgmDivCd);
    if (params.useYn) searchParams.append('useYn', params.useYn);
    if (params.bizDivCd) searchParams.append('bizDivCd', params.bizDivCd);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    console.log('API ?¸ì¶œ URL:', `${API_BASE_URL}/api/sys/programs?${searchParams.toString()}`);
    
    const response = await fetch(`${API_BASE_URL}/api/sys/programs?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API ?‘ë‹µ ?íƒœ:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API ?ëŸ¬ ?‘ë‹µ:', errorText);
      throw new Error(`?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ ?¤íŒ¨: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API ?‘ë‹µ ?°ì´??', data);
    return data;
  }

  /**
   * ?„ë¡œê·¸ë¨ IDë¡??¨ì¼ ?„ë¡œê·¸ë¨??ì¡°íšŒ?©ë‹ˆ??
   * @param pgmId ?„ë¡œê·¸ë¨ ID
   * @returns ?„ë¡œê·¸ë¨ ?•ë³´
   */
  static async getProgramById(pgmId: string): Promise<Program> {
    const response = await fetch(`${API_BASE_URL}/api/sys/programs/${pgmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`?„ë¡œê·¸ë¨ ì¡°íšŒ ?¤íŒ¨: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?ˆë¡œ???„ë¡œê·¸ë¨???ì„±?©ë‹ˆ??
   * @param data ?„ë¡œê·¸ë¨ ?ì„± ?°ì´??
   * @returns ?ì„±???„ë¡œê·¸ë¨ ?•ë³´
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
      throw new Error(`?„ë¡œê·¸ë¨ ?ì„± ?¤íŒ¨: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?„ë¡œê·¸ë¨ ?•ë³´ë¥??˜ì •?©ë‹ˆ??
   * @param pgmId ?„ë¡œê·¸ë¨ ID
   * @param data ?˜ì •???„ë¡œê·¸ë¨ ?°ì´??
   * @returns ?˜ì •???„ë¡œê·¸ë¨ ?•ë³´
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
      throw new Error(`?„ë¡œê·¸ë¨ ?˜ì • ?¤íŒ¨: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * ?„ë¡œê·¸ë¨???? œ?©ë‹ˆ??
   * @param pgmId ?„ë¡œê·¸ë¨ ID
   * @returns ?? œ ?±ê³µ ?¬ë?
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
      throw new Error(`?„ë¡œê·¸ë¨ ?? œ ?¤íŒ¨: ${errorData.message || response.statusText}`);
    }

    return true;
  }
} 


