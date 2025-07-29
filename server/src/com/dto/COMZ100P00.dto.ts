import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

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
 * ?�용???�보 ?�??
 */
export interface User {
  // ?�제 DB 컬럼??
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
 * ?�용??검???�답 DTO
 */
export class UserSearchResponseDto {
  @ApiProperty({ description: '?�용??목록', type: [Object] })
  data: User[]

  @ApiProperty({ description: '?�로?��? ?�보', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto

  @ApiProperty({ description: '�?개수' })
  totalCount: number
}

/**
 * ?�용??검???�라미터 ?�??
 */
export class UserSearchParams {
  @ApiProperty({ 
    required: true, 
    description: '?�용?�명 (?�수) - 검?�할 ?�용?�의 ?�름???�력?�세??, 
    default: '',
    example: '?�길??,
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?�용?�명?� ?�수?�니??' })
  userNm: string = ''

  @ApiProperty({ 
    required: false, 
    description: '본사 구분 (?�택) - 본사/지??구분 코드', 
    default: '',
    type: String
  })
  @IsOptional()
  @IsString()
  hqDiv?: string = ''

  @ApiProperty({ 
    required: false, 
    description: '부??구분 (?�택) - 부??코드', 
    default: '',
    type: String
  })
  @IsOptional()
  @IsString()
  deptDiv?: string = ''
} 

