import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

/**
 * ?„ë¡œ?œì? ?•ë³´ DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '?„ë¡œ?œì?ëª? })
  name: string

  @ApiProperty({ description: '?ë³¸ ì£¼ì„ (ì¤„ë³„ ë°°ì—´)', type: [String] })
  originalCommentLines: string[]
}

/**
 * ?¬ìš©???•ë³´ ?€??
 */
export interface User {
  // ?¤ì œ DB ì»¬ëŸ¼??
  EMP_NO: string
  EMP_NM: string
  HQ_DIV_CD: string
  HQ_DIV_NM: string
  DEPT_DIV_CD: string
  DEPT_DIV_NM: string
  DUTY_CD: string
  DUTY_NM: string
  AUTH_CD: string
  AUTH_CD_NM: string
  BSN_USE_YN: string
  WPC_USE_YN: string
  PSM_USE_YN: string
  EMAIL_ADDR: string
  APV_APOF_ID: string
  DUTY_DIV_CD: string
  DUTY_DIV_CD_NM: string
  OWN_OUTS_DIV: string
  ENTR_NO: string
  ENTR_DT: string
  RETIR_DT: string
  WMAIL_YN: string
  WRK_CNT: string
  LAST_WRK: string
  [key: string]: any
}

/**
 * ?¬ìš©??ê²€???‘ë‹µ DTO
 */
export class UserSearchResponseDto {
  @ApiProperty({ description: '?¬ìš©??ëª©ë¡', type: [Object] })
  data: User[]

  @ApiProperty({ description: '?„ë¡œ?œì? ?•ë³´', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto

  @ApiProperty({ description: 'ì´?ê°œìˆ˜' })
  totalCount: number
}

/**
 * ?¬ìš©??ê²€???Œë¼ë¯¸í„° ?€??
 */
export class UserSearchParams {
  @ApiProperty({ 
    required: true, 
    description: '?¬ìš©?ëª… (?„ìˆ˜) - ê²€?‰í•  ?¬ìš©?ì˜ ?´ë¦„???…ë ¥?˜ì„¸??, 
    default: '',
    example: '?ê¸¸??,
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?¬ìš©?ëª…?€ ?„ìˆ˜?…ë‹ˆ??' })
  userNm: string = ''

  @ApiProperty({ 
    required: false, 
    description: 'ë³¸ì‚¬ êµ¬ë¶„ (? íƒ) - ë³¸ì‚¬/ì§€??êµ¬ë¶„ ì½”ë“œ', 
    default: '',
    type: String
  })
  @IsOptional()
  @IsString()
  hqDiv?: string = ''

  @ApiProperty({ 
    required: false, 
    description: 'ë¶€??êµ¬ë¶„ (? íƒ) - ë¶€??ì½”ë“œ', 
    default: '',
    type: String
  })
  @IsOptional()
  @IsString()
  deptDiv?: string = ''
} 

