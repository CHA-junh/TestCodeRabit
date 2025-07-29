import { Injectable } from '@nestjs/common'
import { OracleService } from '../database/database.provider'
import * as oracledb from 'oracledb'

/**
 * ?„ë¡œ?œì? ?•ë³´ ?€??(?ë³¸ ì£¼ì„ë§??¬í•¨)
 */
export interface ProcedureInfo {
  name: string
  originalCommentLines: string[]
}

/**
 * DB?ì„œ ?¤ì‹œê°„ìœ¼ë¡??„ë¡œ?œì? ì£¼ì„??ì¡°íšŒ?˜ëŠ” ? í‹¸ë¦¬í‹°
 */
@Injectable()
export class ProcedureDbParser {
  constructor(private readonly oracle: OracleService) {}

  /**
   * DB?ì„œ ?„ë¡œ?œì? ?ŒìŠ¤ ì½”ë“œë¥?ì¡°íšŒ?©ë‹ˆ??
   * @param procedureName - ?„ë¡œ?œì?ëª?
   * @returns ?„ë¡œ?œì? ?ŒìŠ¤ ì½”ë“œ
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
   * ?„ë¡œ?œì? ì£¼ì„??ì¶”ì¶œ?©ë‹ˆ??
   * @param sourceCode - ?„ë¡œ?œì? ?ŒìŠ¤ ì½”ë“œ
   * @returns ì£¼ì„ ë¶€ë¶„ë§Œ ì¶”ì¶œ
   */
  private extractComment(sourceCode: string): string {
    if (!sourceCode) return ''
    
    const lines = sourceCode.split('\n')
    let commentLines: string[] = []
    let inCommentBlock = false
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // ì£¼ì„ ë¸”ë¡ ?œì‘ ?•ì¸ (?¬ëŸ¬ ?¨í„´ ì§€??
      if (trimmedLine.includes('/**********************************************************************************') || 
          trimmedLine.includes('/********************************************************************************') ||
          trimmedLine.includes('/*******************************************************************************')) {
        inCommentBlock = true
        commentLines.push(line)
        continue
      }
      
      // ì£¼ì„ ë¸”ë¡ ì¢…ë£Œ ?•ì¸ (?¬ëŸ¬ ?¨í„´ ì§€??
      if (trimmedLine.includes('**************************************************************************************/') ||
          trimmedLine.includes('********************************************************************************/') ||
          trimmedLine.includes('*******************************************************************************/')) {
        commentLines.push(line)
        inCommentBlock = false
        break
      }
      
      // ì£¼ì„ ë¸”ë¡ ?´ë???ëª¨ë“  ?¼ì¸ ì¶”ê?
      if (inCommentBlock) {
        commentLines.push(line)
      }
    }
    
    const extractedComment = commentLines.join('\n')
    
    // ì£¼ì„??ì¶”ì¶œ?˜ì? ?Šì•˜ê±°ë‚˜ ?ˆë¬´ ì§§ìœ¼ë©??„ì²´ ?ŒìŠ¤?ì„œ ì£¼ì„ ë¶€ë¶„ë§Œ ì°¾ê¸°
    if (!extractedComment || extractedComment.length < 50) {
      return this.extractCommentFromFullSource(sourceCode)
    }
    
    return extractedComment
  }

  /**
   * ?„ì²´ ?ŒìŠ¤?ì„œ ì£¼ì„ ë¶€ë¶„ì„ ì°¾ìŠµ?ˆë‹¤.
   * @param sourceCode - ?„ë¡œ?œì? ?ŒìŠ¤ ì½”ë“œ
   * @returns ì£¼ì„ ë¶€ë¶?
   */
  private extractCommentFromFullSource(sourceCode: string): string {
    const commentStart = sourceCode.indexOf('/**********************************************************************************')
    if (commentStart === -1) {
      return '?„ë¡œ?œì? ì£¼ì„??ì°¾ì„ ???†ìŠµ?ˆë‹¤.'
    }
    
    const commentEnd = sourceCode.indexOf('**************************************************************************************/')
    if (commentEnd === -1) {
      return '?„ë¡œ?œì? ì£¼ì„??ì°¾ì„ ???†ìŠµ?ˆë‹¤.'
    }
    
    return sourceCode.substring(commentStart, commentEnd + 50) // 50?€ ì¢…ë£Œ ì£¼ì„ ê¸¸ì´
  }

  /**
   * ì¤„ë°”ê¿ˆì„ HTML?ì„œ ?œë?ë¡??œì‹œ?˜ë„ë¡?ë³€?˜í•©?ˆë‹¤.
   * @param text - ?ë³¸ ?ìŠ¤??
   * @returns ì¤„ë°”ê¿ˆì´ ?œë?ë¡??œì‹œ?˜ëŠ” ?ìŠ¤??
   */
  private formatCommentForDisplay(text: string): string {
    if (!text) return ''
    
    // ë¬¸ì??\n???¤ì œ ì¤„ë°”ê¿ˆìœ¼ë¡?ë³€?˜í•˜ê³? ??„ ê³µë°±?¼ë¡œ ë³€??
    let formatted = text
      .replace(/\\n/g, '\n')  // ë¬¸ì??\n???¤ì œ ì¤„ë°”ê¿ˆìœ¼ë¡?
      .replace(/\t/g, '    ') // ??„ 4ê°?ê³µë°±?¼ë¡œ
      .trim()
    
    // ?¤ì œ ì¤„ë°”ê¿ˆì´ ?ˆëŠ” ê²½ìš° ê·¸ë?ë¡?? ì?
    return formatted
  }

  /**
   * DB?ì„œ ?„ë¡œ?œì? ?•ë³´ë¥??¤ì‹œê°„ìœ¼ë¡?ì¡°íšŒ?©ë‹ˆ??
   * @param procedureName - ?„ë¡œ?œì?ëª?
   * @returns ?„ë¡œ?œì? ?•ë³´ (?ë³¸ ì£¼ì„ë§??¬í•¨)
   */
  async getProcedureInfoFromDb(procedureName: string): Promise<ProcedureInfo> {
    try {
      const sourceCode = await this.getProcedureSource(procedureName)
      // console.log(`=== ${procedureName} ?ŒìŠ¤ ì½”ë“œ (ì²˜ìŒ 1000?? ===`)
      // console.log(sourceCode.substring(0, 1000))
      // console.log('==========================================')
      
      const originalComment = this.extractComment(sourceCode)
      // console.log(`=== ${procedureName} ì¶”ì¶œ??ì£¼ì„ ===`)
      // console.log(originalComment)
      // console.log('==========================================')
      
      const formattedComment = this.formatCommentForDisplay(originalComment)
      
      // ì¤„ë°”ê¿ˆì„ ë°°ì—´ë¡??œê³µ
      const commentLines = formattedComment.split('\n').filter(line => line.trim() !== '')
      
      return {
        name: procedureName,
        originalCommentLines: commentLines
      }
    } catch (error) {
      console.error(`?„ë¡œ?œì? ?•ë³´ ì¡°íšŒ ?¤ë¥˜ (${procedureName}):`, error)
      
      // ?¤ë¥˜ ë°œìƒ ??ê¸°ë³¸ ?•ë³´ ë°˜í™˜
      return {
        name: procedureName,
        originalCommentLines: ['?„ë¡œ?œì? ?•ë³´ë¥?ì¡°íšŒ?????†ìŠµ?ˆë‹¤.']
      }
    }
  }

  /**
   * ?¬ëŸ¬ ?„ë¡œ?œì????•ë³´ë¥??¼ê´„ ì¡°íšŒ?©ë‹ˆ??
   * @param procedureNames - ?„ë¡œ?œì?ëª?ë°°ì—´
   * @returns ?„ë¡œ?œì? ?•ë³´ ë§?
   */
  async getMultipleProcedureInfo(procedureNames: string[]): Promise<Record<string, ProcedureInfo>> {
    const results: Record<string, ProcedureInfo> = {}
    
    for (const procedureName of procedureNames) {
      results[procedureName] = await this.getProcedureInfoFromDb(procedureName)
    }
    
    return results
  }
} 

