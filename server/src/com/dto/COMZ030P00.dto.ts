import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

/**
 * ?¨ê? ê²€???Œë¼ë¯¸í„° ?€??
 */
export class UnitPriceSearchParams {
  @ApiProperty({ 
    required: true, 
    description: '?´ë?/?¸ë? êµ¬ë¶„ (?„ìˆ˜) - 1: ?ì‚¬, 2: ?¸ì£¼', 
    default: '1',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?´ë?/?¸ë? êµ¬ë¶„?€ ?„ìˆ˜?…ë‹ˆ??' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '?„ë„ (?„ìˆ˜) - ê²€?‰í•  ?„ë„ë¥??…ë ¥?˜ì„¸??(?? 2024)', 
    default: '',
    example: '2024',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?„ë„???„ìˆ˜?…ë‹ˆ??' })
  year: string = ''

  @ApiProperty({ 
    required: false, 
    description: '?¬ì—…?ë²ˆ??(? íƒ) - ?¹ì • ?¬ì—…?ì˜ ?¨ê?ë§?ê²€?‰í•  ???¬ìš©', 
    default: '' 
  })
  @IsOptional()
  @IsString()
  bsnNo?: string = ''
}

/**
 * ?¨ê? ?•ë³´ ?€??
 */
export interface UnitPrice {
  OWN_OUTS_DIV: string
  OWN_OUTS_DIV_NM: string
  YR: string
  TCN_GRD: string
  TCN_GRD_NM: string
  DUTY_CD: string
  DUTY_NM: string
  UPRC: string
  [key: string]: any
}

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
 * ?¨ê? ê²€???‘ë‹µ DTO
 */
export class UnitPriceSearchResponseDto {
  @ApiProperty({ description: '?¨ê? ëª©ë¡', type: [Object] })
  data: UnitPrice[]

  @ApiProperty({ description: '?„ë¡œ?œì? ?•ë³´', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto

  @ApiProperty({ description: 'ì´?ê°œìˆ˜' })
  totalCount: number
} 

