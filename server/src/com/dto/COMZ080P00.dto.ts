import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * 직원 검색 요청 DTO
 */
export class EmployeeSearchRequestDto {
  @ApiProperty({ 
    required: false, 
    description: '검색 키워드 (선택) - 검색 방식 선택', 
    example: '2' 
  })
  @IsOptional()
  @IsString()
  kb?: string;

  @ApiProperty({ 
    required: false, 
    description: '사원번호 (선택) - 특정 사원번호로 검색할 때 사용', 
    example: '' 
  })
  @IsOptional()
  @IsString()
  empNo?: string;

  @ApiProperty({ 
    required: true, 
    description: '사원명 (필수) - 검색할 사원의 이름을 입력하세요', 
    example: '홍길동',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '사원명은 필수입니다.' })
  empNm: string;

  @ApiProperty({ 
    required: false, 
    description: '내부/외부 구분 (선택) - 1: 자사, 2: 외주, ALL: 전체', 
    example: 'ALL' 
  })
  @IsOptional()
  @IsString()
  ownOutsDiv?: string;

  @ApiProperty({ 
    required: false, 
    description: '퇴직 여부 (선택) - Y: 퇴직자 포함, N: 퇴직자 제외', 
    example: 'Y' 
  })
  @IsOptional()
  @IsString()
  retirYn?: string;
}

/**
 * 직원 정보 DTO (Entity와 매핑)
 */
export class EmployeeDto {
  @ApiProperty({ description: '목록 번호' })
  LIST_NO: string;

  @ApiProperty({ description: '자사/외주 구분명' })
  OWN_OUTS_NM: string;

  @ApiProperty({ description: '직원명' })
  EMP_NM: string;

  @ApiProperty({ description: '직원번호' })
  EMP_NO: string;

  @ApiProperty({ description: '직책 코드명' })
  DUTY_CD_NM: string;

  @ApiProperty({ description: '기술등급명' })
  TCN_GRD_NM: string;

  @ApiProperty({ description: '소속명' })
  PARTY_NM: string;

  @ApiProperty({ description: '입사일' })
  ENTR_DT: string;

  @ApiProperty({ description: '투입시작일' })
  EXEC_IN_STRT_DT: string;

  @ApiProperty({ description: '투입종료일' })
  EXEC_IN_END_DT: string;

  @ApiProperty({ description: '상태명' })
  WKG_ST_DIV_NM: string;

  @ApiProperty({ description: '투입중 프로젝트' })
  EXEC_ING_BSN_NM: string;

  @ApiProperty({ description: '본부구분코드' })
  HQ_DIV_CD: string;

  @ApiProperty({ description: '부서구분코드' })
  DEPT_DIV_CD: string;

  @ApiProperty({ description: '소속코드' })
  CSF_CO_CD: string;

  @ApiProperty({ description: '상태코드' })
  WKG_ST_DIV: string;

  @ApiProperty({ description: '투입중유무' })
  EXEC_ING_YN: string;

  @ApiProperty({ description: '구분코드' })
  OWN_OUTS_DIV: string;

  @ApiProperty({ description: '외주배정유무' })
  OUTS_FIX_YN: string;

  @ApiProperty({ description: '외주배정확정일자' })
  IN_FIX_DT: string;

  @ApiProperty({ description: '외주배정프로젝트' })
  IN_FIX_PRJT: string;

  @ApiProperty({ description: '직책코드' })
  DUTY_CD: string;

  @ApiProperty({ description: '투입인력직책' })
  DUTY_DIV_CD: string;

  @ApiProperty({ description: '등급코드' })
  TCN_GRD: string;
}

/**
 * 프로시저 정보 DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '프로시저명' })
  name: string;

  @ApiProperty({ description: '원본 주석 (줄별 배열)', type: [String] })
  originalCommentLines: string[];
}

/**
 * 직원 검색 응답 DTO
 */
export class EmployeeSearchResponseDto {
  @ApiProperty({ description: '직원 목록', type: [EmployeeDto] })
  data: EmployeeDto[];

  @ApiProperty({ description: '프로시저 정보', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto;

  @ApiProperty({ description: '총 개수' })
  totalCount: number;
} 