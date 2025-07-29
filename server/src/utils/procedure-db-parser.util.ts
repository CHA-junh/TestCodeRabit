import { Injectable } from '@nestjs/common'
import { OracleService } from '../database/database.provider'
import * as oracledb from 'oracledb'

/**
 * 프로시저 정보 타입 (원본 주석만 포함)
 */
export interface ProcedureInfo {
  name: string
  originalCommentLines: string[]
}

/**
 * DB에서 실시간으로 프로시저 주석을 조회하는 유틸리티
 */
@Injectable()
export class ProcedureDbParser {
  constructor(private readonly oracle: OracleService) {}

  /**
   * DB에서 프로시저 소스 코드를 조회합니다.
   * @param procedureName - 프로시저명
   * @returns 프로시저 소스 코드
   */
  private async getProcedureSource(procedureName: string): Promise<string> {
    const conn = await this.oracle.getConnection()
    try {
      const result = await conn.execute(
        `
        SELECT TEXT 
        FROM USER_SOURCE 
        WHERE NAME = :procedureName 
        AND TYPE = 'PROCEDURE'
        ORDER BY LINE
        `,
        { procedureName },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ) as { rows: any[] }

      if (!result.rows || result.rows.length === 0) {
        return ''
      }

      return result.rows.map(row => row.TEXT).join('')
    } finally {
      await conn.close()
    }
  }

  /**
   * 프로시저 주석을 추출합니다.
   * @param sourceCode - 프로시저 소스 코드
   * @returns 주석 부분만 추출
   */
  private extractComment(sourceCode: string): string {
    if (!sourceCode) return ''
    
    const lines = sourceCode.split('\n')
    let commentLines: string[] = []
    let inCommentBlock = false
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // 주석 블록 시작 확인 (여러 패턴 지원)
      if (trimmedLine.includes('/**********************************************************************************') || 
          trimmedLine.includes('/********************************************************************************') ||
          trimmedLine.includes('/*******************************************************************************')) {
        inCommentBlock = true
        commentLines.push(line)
        continue
      }
      
      // 주석 블록 종료 확인 (여러 패턴 지원)
      if (trimmedLine.includes('**************************************************************************************/') ||
          trimmedLine.includes('********************************************************************************/') ||
          trimmedLine.includes('*******************************************************************************/')) {
        commentLines.push(line)
        inCommentBlock = false
        break
      }
      
      // 주석 블록 내부의 모든 라인 추가
      if (inCommentBlock) {
        commentLines.push(line)
      }
    }
    
    const extractedComment = commentLines.join('\n')
    
    // 주석이 추출되지 않았거나 너무 짧으면 전체 소스에서 주석 부분만 찾기
    if (!extractedComment || extractedComment.length < 50) {
      return this.extractCommentFromFullSource(sourceCode)
    }
    
    return extractedComment
  }

  /**
   * 전체 소스에서 주석 부분을 찾습니다.
   * @param sourceCode - 프로시저 소스 코드
   * @returns 주석 부분
   */
  private extractCommentFromFullSource(sourceCode: string): string {
    const commentStart = sourceCode.indexOf('/**********************************************************************************')
    if (commentStart === -1) {
      return '프로시저 주석을 찾을 수 없습니다.'
    }
    
    const commentEnd = sourceCode.indexOf('**************************************************************************************/')
    if (commentEnd === -1) {
      return '프로시저 주석을 찾을 수 없습니다.'
    }
    
    return sourceCode.substring(commentStart, commentEnd + 50) // 50은 종료 주석 길이
  }

  /**
   * 줄바꿈을 HTML에서 제대로 표시되도록 변환합니다.
   * @param text - 원본 텍스트
   * @returns 줄바꿈이 제대로 표시되는 텍스트
   */
  private formatCommentForDisplay(text: string): string {
    if (!text) return ''
    
    // 문자열 \n을 실제 줄바꿈으로 변환하고, 탭을 공백으로 변환
    let formatted = text
      .replace(/\\n/g, '\n')  // 문자열 \n을 실제 줄바꿈으로
      .replace(/\t/g, '    ') // 탭을 4개 공백으로
      .trim()
    
    // 실제 줄바꿈이 있는 경우 그대로 유지
    return formatted
  }

  /**
   * DB에서 프로시저 정보를 실시간으로 조회합니다.
   * @param procedureName - 프로시저명
   * @returns 프로시저 정보 (원본 주석만 포함)
   */
  async getProcedureInfoFromDb(procedureName: string): Promise<ProcedureInfo> {
    try {
      const sourceCode = await this.getProcedureSource(procedureName)
      // console.log(`=== ${procedureName} 소스 코드 (처음 1000자) ===`)
      // console.log(sourceCode.substring(0, 1000))
      // console.log('==========================================')
      
      const originalComment = this.extractComment(sourceCode)
      // console.log(`=== ${procedureName} 추출된 주석 ===`)
      // console.log(originalComment)
      // console.log('==========================================')
      
      const formattedComment = this.formatCommentForDisplay(originalComment)
      
      // 줄바꿈을 배열로 제공
      const commentLines = formattedComment.split('\n').filter(line => line.trim() !== '')
      
      return {
        name: procedureName,
        originalCommentLines: commentLines
      }
    } catch (error) {
      console.error(`프로시저 정보 조회 오류 (${procedureName}):`, error)
      
      // 오류 발생 시 기본 정보 반환
      return {
        name: procedureName,
        originalCommentLines: ['프로시저 정보를 조회할 수 없습니다.']
      }
    }
  }

  /**
   * 여러 프로시저의 정보를 일괄 조회합니다.
   * @param procedureNames - 프로시저명 배열
   * @returns 프로시저 정보 맵
   */
  async getMultipleProcedureInfo(procedureNames: string[]): Promise<Record<string, ProcedureInfo>> {
    const results: Record<string, ProcedureInfo> = {}
    
    for (const procedureName of procedureNames) {
      results[procedureName] = await this.getProcedureInfoFromDb(procedureName)
    }
    
    return results
  }
} 