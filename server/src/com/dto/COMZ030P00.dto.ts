import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

/**
 * 단가 검색 파라미터 타입
 */
export class UnitPriceSearchParams {
  @ApiProperty({ 
    required: true, 
    description: '내부/외부 구분 (필수) - 1: 자사, 2: 외주', 
    default: '1',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '내부/외부 구분은 필수입니다.' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '년도 (필수) - 검색할 년도를 입력하세요 (예: 2024)', 
    default: '',
    example: '2024',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '년도는 필수입니다.' })
  year: string = ''

  @ApiProperty({ 
    required: false, 
    description: '사업자번호 (선택) - 특정 사업자의 단가만 검색할 때 사용', 
    default: '' 
  })
  @IsOptional()
  @IsString()
  bsnNo?: string = ''
}

/**
 * 단가 정보 타입
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
 * 프로시저 정보 DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '프로시저명' })
  name: string

  @ApiProperty({ description: '원본 주석 (줄별 배열)', type: [String] })
  originalCommentLines: string[]
}

/**
 * 단가 검색 응답 DTO
 */
export class UnitPriceSearchResponseDto {
  @ApiProperty({ description: '단가 목록', type: [Object] })
  data: UnitPrice[]

  @ApiProperty({ description: '프로시저 정보', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto

  @ApiProperty({ description: '총 개수' })
  totalCount: number
} 