import { Injectable } from '@nestjs/common'
import { OracleService } from '../database/database.provider'
import * as oracledb from 'oracledb'

/**
 * ?๋ก?์? ?๋ณด ???(?๋ณธ ์ฃผ์๋ง??ฌํจ)
 */
export interface ProcedureInfo {
  name: string
  originalCommentLines: string[]
}

/**
 * DB?์ ?ค์๊ฐ์ผ๋ก??๋ก?์? ์ฃผ์??์กฐํ?๋ ? ํธ๋ฆฌํฐ
 */
@Injectable()
export class ProcedureDbParser {
  constructor(private readonly oracle: OracleService) {}

  /**
   * DB?์ ?๋ก?์? ?์ค ์ฝ๋๋ฅ?์กฐํ?ฉ๋??
   * @param procedureName - ?๋ก?์?๋ช?
   * @returns ?๋ก?์? ?์ค ์ฝ๋
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
   * ?๋ก?์? ์ฃผ์??์ถ์ถ?ฉ๋??
   * @param sourceCode - ?๋ก?์? ?์ค ์ฝ๋
   * @returns ์ฃผ์ ๋ถ๋ถ๋ง ์ถ์ถ
   */
  private extractComment(sourceCode: string): string {
    if (!sourceCode) return ''
    
    const lines = sourceCode.split('\n')
    let commentLines: string[] = []
    let inCommentBlock = false
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // ์ฃผ์ ๋ธ๋ก ?์ ?์ธ (?ฌ๋ฌ ?จํด ์ง??
      if (trimmedLine.includes('/**********************************************************************************') || 
          trimmedLine.includes('/********************************************************************************') ||
          trimmedLine.includes('/*******************************************************************************')) {
        inCommentBlock = true
        commentLines.push(line)
        continue
      }
      
      // ์ฃผ์ ๋ธ๋ก ์ข๋ฃ ?์ธ (?ฌ๋ฌ ?จํด ์ง??
      if (trimmedLine.includes('**************************************************************************************/') ||
          trimmedLine.includes('********************************************************************************/') ||
          trimmedLine.includes('*******************************************************************************/')) {
        commentLines.push(line)
        inCommentBlock = false
        break
      }
      
      // ์ฃผ์ ๋ธ๋ก ?ด๋???๋ชจ๋  ?ผ์ธ ์ถ๊?
      if (inCommentBlock) {
        commentLines.push(line)
      }
    }
    
    const extractedComment = commentLines.join('\n')
    
    // ์ฃผ์??์ถ์ถ?์? ?์๊ฑฐ๋ ?๋ฌด ์งง์ผ๋ฉ??์ฒด ?์ค?์ ์ฃผ์ ๋ถ๋ถ๋ง ์ฐพ๊ธฐ
    if (!extractedComment || extractedComment.length < 50) {
      return this.extractCommentFromFullSource(sourceCode)
    }
    
    return extractedComment
  }

  /**
   * ?์ฒด ?์ค?์ ์ฃผ์ ๋ถ๋ถ์ ์ฐพ์ต?๋ค.
   * @param sourceCode - ?๋ก?์? ?์ค ์ฝ๋
   * @returns ์ฃผ์ ๋ถ๋ถ?
   */
  private extractCommentFromFullSource(sourceCode: string): string {
    const commentStart = sourceCode.indexOf('/**********************************************************************************')
    if (commentStart === -1) {
      return '?๋ก?์? ์ฃผ์??์ฐพ์ ???์ต?๋ค.'
    }
    
    const commentEnd = sourceCode.indexOf('**************************************************************************************/')
    if (commentEnd === -1) {
      return '?๋ก?์? ์ฃผ์??์ฐพ์ ???์ต?๋ค.'
    }
    
    return sourceCode.substring(commentStart, commentEnd + 50) // 50? ์ข๋ฃ ์ฃผ์ ๊ธธ์ด
  }

  /**
   * ์ค๋ฐ๊ฟ์ HTML?์ ?๋?๋ก??์?๋๋ก?๋ณ?ํฉ?๋ค.
   * @param text - ?๋ณธ ?์ค??
   * @returns ์ค๋ฐ๊ฟ์ด ?๋?๋ก??์?๋ ?์ค??
   */
  private formatCommentForDisplay(text: string): string {
    if (!text) return ''
    
    // ๋ฌธ์??\n???ค์  ์ค๋ฐ๊ฟ์ผ๋ก?๋ณ?ํ๊ณ? ?? ๊ณต๋ฐฑ?ผ๋ก ๋ณ??
    let formatted = text
      .replace(/\\n/g, '\n')  // ๋ฌธ์??\n???ค์  ์ค๋ฐ๊ฟ์ผ๋ก?
      .replace(/\t/g, '    ') // ?? 4๊ฐ?๊ณต๋ฐฑ?ผ๋ก
      .trim()
    
    // ?ค์  ์ค๋ฐ๊ฟ์ด ?๋ ๊ฒฝ์ฐ ๊ทธ๋?๋ก?? ์?
    return formatted
  }

  /**
   * DB?์ ?๋ก?์? ?๋ณด๋ฅ??ค์๊ฐ์ผ๋ก?์กฐํ?ฉ๋??
   * @param procedureName - ?๋ก?์?๋ช?
   * @returns ?๋ก?์? ?๋ณด (?๋ณธ ์ฃผ์๋ง??ฌํจ)
   */
  async getProcedureInfoFromDb(procedureName: string): Promise<ProcedureInfo> {
    try {
      const sourceCode = await this.getProcedureSource(procedureName)
      // console.log(`=== ${procedureName} ?์ค ์ฝ๋ (์ฒ์ 1000?? ===`)
      // console.log(sourceCode.substring(0, 1000))
      // console.log('==========================================')
      
      const originalComment = this.extractComment(sourceCode)
      // console.log(`=== ${procedureName} ์ถ์ถ??์ฃผ์ ===`)
      // console.log(originalComment)
      // console.log('==========================================')
      
      const formattedComment = this.formatCommentForDisplay(originalComment)
      
      // ์ค๋ฐ๊ฟ์ ๋ฐฐ์ด๋ก??๊ณต
      const commentLines = formattedComment.split('\n').filter(line => line.trim() !== '')
      
      return {
        name: procedureName,
        originalCommentLines: commentLines
      }
    } catch (error) {
      console.error(`?๋ก?์? ?๋ณด ์กฐํ ?ค๋ฅ (${procedureName}):`, error)
      
      // ?ค๋ฅ ๋ฐ์ ??๊ธฐ๋ณธ ?๋ณด ๋ฐํ
      return {
        name: procedureName,
        originalCommentLines: ['?๋ก?์? ?๋ณด๋ฅ?์กฐํ?????์ต?๋ค.']
      }
    }
  }

  /**
   * ?ฌ๋ฌ ?๋ก?์????๋ณด๋ฅ??ผ๊ด ์กฐํ?ฉ๋??
   * @param procedureNames - ?๋ก?์?๋ช?๋ฐฐ์ด
   * @returns ?๋ก?์? ?๋ณด ๋ง?
   */
  async getMultipleProcedureInfo(procedureNames: string[]): Promise<Record<string, ProcedureInfo>> {
    const results: Record<string, ProcedureInfo> = {}
    
    for (const procedureName of procedureNames) {
      results[procedureName] = await this.getProcedureInfoFromDb(procedureName)
    }
    
    return results
  }
} 

