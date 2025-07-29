import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

/**
 * ?��? 검???�라미터 ?�??
 */
export class UnitPriceSearchParams {
  @ApiProperty({ 
    required: true, 
    description: '?��?/?��? 구분 (?�수) - 1: ?�사, 2: ?�주', 
    default: '1',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?��?/?��? 구분?� ?�수?�니??' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '?�도 (?�수) - 검?�할 ?�도�??�력?�세??(?? 2024)', 
    default: '',
    example: '2024',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?�도???�수?�니??' })
  year: string = ''

  @ApiProperty({ 
    required: false, 
    description: '?�업?�번??(?�택) - ?�정 ?�업?�의 ?��?�?검?�할 ???�용', 
    default: '' 
  })
  @IsOptional()
  @IsString()
  bsnNo?: string = ''
}

/**
 * ?��? ?�보 ?�??
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
 * ?�로?��? ?�보 DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '?�로?��?�? })
  name: string

  @ApiProperty({ description: '?�본 주석 (줄별 배열)', type: [String] })
  originalCommentLines: string[]
}

/**
 * ?��? 검???�답 DTO
 */
export class UnitPriceSearchResponseDto {
  @ApiProperty({ description: '?��? 목록', type: [Object] })
  data: UnitPrice[]

  @ApiProperty({ description: '?�로?��? ?�보', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto

  @ApiProperty({ description: '�?개수' })
  totalCount: number
} 

