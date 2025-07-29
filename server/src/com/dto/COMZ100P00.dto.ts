import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

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
 * 사용자 정보 타입
 */
export interface User {
  // 실제 DB 컬럼들
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
 * 사용자 검색 응답 DTO
 */
export class UserSearchResponseDto {
  @ApiProperty({ description: '사용자 목록', type: [Object] })
  data: User[]

  @ApiProperty({ description: '프로시저 정보', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto

  @ApiProperty({ description: '총 개수' })
  totalCount: number
}

/**
 * 사용자 검색 파라미터 타입
 */
export class UserSearchParams {
  @ApiProperty({ 
    required: true, 
    description: '사용자명 (필수) - 검색할 사용자의 이름을 입력하세요', 
    default: '',
    example: '홍길동',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '사용자명은 필수입니다.' })
  userNm: string = ''

  @ApiProperty({ 
    required: false, 
    description: '본사 구분 (선택) - 본사/지사 구분 코드', 
    default: '',
    type: String
  })
  @IsOptional()
  @IsString()
  hqDiv?: string = ''

  @ApiProperty({ 
    required: false, 
    description: '부서 구분 (선택) - 부서 코드', 
    default: '',
    type: String
  })
  @IsOptional()
  @IsString()
  deptDiv?: string = ''
} 