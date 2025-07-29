import { Injectable } from '@nestjs/common'
import { OracleService } from '../database/database.provider'
import * as oracledb from 'oracledb'

/**
 * ?�로?��? ?�보 ?�??(?�본 주석�??�함)
 */
export interface ProcedureInfo {
  name: string
  originalCommentLines: string[]
}

/**
 * DB?�서 ?�시간으�??�로?��? 주석??조회?�는 ?�틸리티
 */
@Injectable()
export class ProcedureDbParser {
  constructor(private readonly oracle: OracleService) {}

  /**
   * DB?�서 ?�로?��? ?�스 코드�?조회?�니??
   * @param procedureName - ?�로?��?�?
   * @returns ?�로?��? ?�스 코드
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
   * ?�로?��? 주석??추출?�니??
   * @param sourceCode - ?�로?��? ?�스 코드
   * @returns 주석 부분만 추출
   */
  private extractComment(sourceCode: string): string {
    if (!sourceCode) return ''
    
    const lines = sourceCode.split('\n')
    let commentLines: string[] = []
    let inCommentBlock = false
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // 주석 블록 ?�작 ?�인 (?�러 ?�턴 지??
      if (trimmedLine.includes('/**********************************************************************************') || 
          trimmedLine.includes('/********************************************************************************') ||
          trimmedLine.includes('/*******************************************************************************')) {
        inCommentBlock = true
        commentLines.push(line)
        continue
      }
      
      // 주석 블록 종료 ?�인 (?�러 ?�턴 지??
      if (trimmedLine.includes('**************************************************************************************/') ||
          trimmedLine.includes('********************************************************************************/') ||
          trimmedLine.includes('*******************************************************************************/')) {
        commentLines.push(line)
        inCommentBlock = false
        break
      }
      
      // 주석 블록 ?��???모든 ?�인 추�?
      if (inCommentBlock) {
        commentLines.push(line)
      }
    }
    
    const extractedComment = commentLines.join('\n')
    
    // 주석??추출?��? ?�았거나 ?�무 짧으�??�체 ?�스?�서 주석 부분만 찾기
    if (!extractedComment || extractedComment.length < 50) {
      return this.extractCommentFromFullSource(sourceCode)
    }
    
    return extractedComment
  }

  /**
   * ?�체 ?�스?�서 주석 부분을 찾습?�다.
   * @param sourceCode - ?�로?��? ?�스 코드
   * @returns 주석 부�?
   */
  private extractCommentFromFullSource(sourceCode: string): string {
    const commentStart = sourceCode.indexOf('/**********************************************************************************')
    if (commentStart === -1) {
      return '?�로?��? 주석??찾을 ???�습?�다.'
    }
    
    const commentEnd = sourceCode.indexOf('**************************************************************************************/')
    if (commentEnd === -1) {
      return '?�로?��? 주석??찾을 ???�습?�다.'
    }
    
    return sourceCode.substring(commentStart, commentEnd + 50) // 50?� 종료 주석 길이
  }

  /**
   * 줄바꿈을 HTML?�서 ?��?�??�시?�도�?변?�합?�다.
   * @param text - ?�본 ?�스??
   * @returns 줄바꿈이 ?��?�??�시?�는 ?�스??
   */
  private formatCommentForDisplay(text: string): string {
    if (!text) return ''
    
    // 문자??\n???�제 줄바꿈으�?변?�하�? ??�� 공백?�로 변??
    let formatted = text
      .replace(/\\n/g, '\n')  // 문자??\n???�제 줄바꿈으�?
      .replace(/\t/g, '    ') // ??�� 4�?공백?�로
      .trim()
    
    // ?�제 줄바꿈이 ?�는 경우 그�?�??��?
    return formatted
  }

  /**
   * DB?�서 ?�로?��? ?�보�??�시간으�?조회?�니??
   * @param procedureName - ?�로?��?�?
   * @returns ?�로?��? ?�보 (?�본 주석�??�함)
   */
  async getProcedureInfoFromDb(procedureName: string): Promise<ProcedureInfo> {
    try {
      const sourceCode = await this.getProcedureSource(procedureName)
      // console.log(`=== ${procedureName} ?�스 코드 (처음 1000?? ===`)
      // console.log(sourceCode.substring(0, 1000))
      // console.log('==========================================')
      
      const originalComment = this.extractComment(sourceCode)
      // console.log(`=== ${procedureName} 추출??주석 ===`)
      // console.log(originalComment)
      // console.log('==========================================')
      
      const formattedComment = this.formatCommentForDisplay(originalComment)
      
      // 줄바꿈을 배열�??�공
      const commentLines = formattedComment.split('\n').filter(line => line.trim() !== '')
      
      return {
        name: procedureName,
        originalCommentLines: commentLines
      }
    } catch (error) {
      console.error(`?�로?��? ?�보 조회 ?�류 (${procedureName}):`, error)
      
      // ?�류 발생 ??기본 ?�보 반환
      return {
        name: procedureName,
        originalCommentLines: ['?�로?��? ?�보�?조회?????�습?�다.']
      }
    }
  }

  /**
   * ?�러 ?�로?��????�보�??�괄 조회?�니??
   * @param procedureNames - ?�로?��?�?배열
   * @returns ?�로?��? ?�보 �?
   */
  async getMultipleProcedureInfo(procedureNames: string[]): Promise<Record<string, ProcedureInfo>> {
    const results: Record<string, ProcedureInfo> = {}
    
    for (const procedureName of procedureNames) {
      results[procedureName] = await this.getProcedureInfoFromDb(procedureName)
    }
    
    return results
  }
} 

