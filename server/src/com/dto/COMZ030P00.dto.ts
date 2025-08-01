import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

/**
 * ?¨κ? κ²???λΌλ―Έν° ???
 */
export class UnitPriceSearchParams {
  @ApiProperty({ 
    required: true, 
    description: '?΄λ?/?Έλ? κ΅¬λΆ (?μ) - 1: ?μ¬, 2: ?Έμ£Ό', 
    default: '1',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?΄λ?/?Έλ? κ΅¬λΆ? ?μ?λ??' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '?λ (?μ) - κ²?ν  ?λλ₯??λ ₯?μΈ??(?? 2024)', 
    default: '',
    example: '2024',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?λ???μ?λ??' })
  year: string = ''

  @ApiProperty({ 
    required: false, 
    description: '?¬μ?λ²??(? ν) - ?Ήμ  ?¬μ?μ ?¨κ?λ§?κ²?ν  ???¬μ©', 
    default: '' 
  })
  @IsOptional()
  @IsString()
  bsnNo?: string = ''
}

/**
 * ?¨κ? ?λ³΄ ???
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
 * ?λ‘?μ? ?λ³΄ DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '?λ‘?μ?λͺ? })
  name: string

  @ApiProperty({ description: '?λ³Έ μ£Όμ (μ€λ³ λ°°μ΄)', type: [String] })
  originalCommentLines: string[]
}

/**
 * ?¨κ? κ²???λ΅ DTO
 */
export class UnitPriceSearchResponseDto {
  @ApiProperty({ description: '?¨κ? λͺ©λ‘', type: [Object] })
  data: UnitPrice[]

  @ApiProperty({ description: '?λ‘?μ? ?λ³΄', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto

  @ApiProperty({ description: 'μ΄?κ°μ' })
  totalCount: number
} 

