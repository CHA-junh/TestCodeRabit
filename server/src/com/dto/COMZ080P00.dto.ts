import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * 직원 검???�청 DTO
 */
export class EmployeeSearchRequestDto {
  @ApiProperty({ 
    required: false, 
    description: '검???�워??(?�택) - 검??방식 ?�택', 
    example: '2' 
  })
  @IsOptional()
  @IsString()
  kb?: string;

  @ApiProperty({ 
    required: false, 
    description: '?�원번호 (?�택) - ?�정 ?�원번호�?검?�할 ???�용', 
    example: '' 
  })
  @IsOptional()
  @IsString()
  empNo?: string;

  @ApiProperty({ 
    required: true, 
    description: '?�원�?(?�수) - 검?�할 ?�원???�름???�력?�세??, 
    example: '?�길??,
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?�원명�? ?�수?�니??' })
  empNm: string;

  @ApiProperty({ 
    required: false, 
    description: '?��?/?��? 구분 (?�택) - 1: ?�사, 2: ?�주, ALL: ?�체', 
    example: 'ALL' 
  })
  @IsOptional()
  @IsString()
  ownOutsDiv?: string;

  @ApiProperty({ 
    required: false, 
    description: '?�직 ?��? (?�택) - Y: ?�직???�함, N: ?�직???�외', 
    example: 'Y' 
  })
  @IsOptional()
  @IsString()
  retirYn?: string;
}

/**
 * 직원 ?�보 DTO (Entity?� 매핑)
 */
export class EmployeeDto {
  @ApiProperty({ description: '목록 번호' })
  LIST_NO: string;

  @ApiProperty({ description: '?�사/?�주 구분�? })
  OWN_OUTS_NM: string;

  @ApiProperty({ description: '직원�? })
  EMP_NM: string;

  @ApiProperty({ description: '직원번호' })
  EMP_NO: string;

  @ApiProperty({ description: '직책 코드�? })
  DUTY_CD_NM: string;

  @ApiProperty({ description: '기술?�급�? })
  TCN_GRD_NM: string;

  @ApiProperty({ description: '?�속�? })
  PARTY_NM: string;

  @ApiProperty({ description: '?�사?? })
  ENTR_DT: string;

  @ApiProperty({ description: '?�입?�작?? })
  EXEC_IN_STRT_DT: string;

  @ApiProperty({ description: '?�입종료?? })
  EXEC_IN_END_DT: string;

  @ApiProperty({ description: '?�태�? })
  WKG_ST_DIV_NM: string;

  @ApiProperty({ description: '?�입�??�로?�트' })
  EXEC_ING_BSN_NM: string;

  @ApiProperty({ description: '본�?구분코드' })
  HQ_DIV_CD: string;

  @ApiProperty({ description: '부?�구분코?? })
  DEPT_DIV_CD: string;

  @ApiProperty({ description: '?�속코드' })
  CSF_CO_CD: string;

  @ApiProperty({ description: '?�태코드' })
  WKG_ST_DIV: string;

  @ApiProperty({ description: '?�입중유�? })
  EXEC_ING_YN: string;

  @ApiProperty({ description: '구분코드' })
  OWN_OUTS_DIV: string;

  @ApiProperty({ description: '?�주배정?�무' })
  OUTS_FIX_YN: string;

  @ApiProperty({ description: '?�주배정?�정?�자' })
  IN_FIX_DT: string;

  @ApiProperty({ description: '?�주배정?�로?�트' })
  IN_FIX_PRJT: string;

  @ApiProperty({ description: '직책코드' })
  DUTY_CD: string;

  @ApiProperty({ description: '?�입?�력직책' })
  DUTY_DIV_CD: string;

  @ApiProperty({ description: '?�급코드' })
  TCN_GRD: string;
}

/**
 * ?�로?��? ?�보 DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '?�로?��?�? })
  name: string;

  @ApiProperty({ description: '?�본 주석 (줄별 배열)', type: [String] })
  originalCommentLines: string[];
}

/**
 * 직원 검???�답 DTO
 */
export class EmployeeSearchResponseDto {
  @ApiProperty({ description: '직원 목록', type: [EmployeeDto] })
  data: EmployeeDto[];

  @ApiProperty({ description: '?�로?��? ?�보', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto;

  @ApiProperty({ description: '�?개수' })
  totalCount: number;
} 

