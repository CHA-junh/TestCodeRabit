import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * ์ง์ ๊ฒ???์ฒญ DTO
 */
export class EmployeeSearchRequestDto {
  @ApiProperty({ 
    required: false, 
    description: '๊ฒ???ค์??(? ํ) - ๊ฒ??๋ฐฉ์ ? ํ', 
    example: '2' 
  })
  @IsOptional()
  @IsString()
  kb?: string;

  @ApiProperty({ 
    required: false, 
    description: '?ฌ์๋ฒํธ (? ํ) - ?น์  ?ฌ์๋ฒํธ๋ก?๊ฒ?ํ  ???ฌ์ฉ', 
    example: '' 
  })
  @IsOptional()
  @IsString()
  empNo?: string;

  @ApiProperty({ 
    required: true, 
    description: '?ฌ์๋ช?(?์) - ๊ฒ?ํ  ?ฌ์???ด๋ฆ???๋ ฅ?์ธ??, 
    example: '?๊ธธ??,
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?ฌ์๋ช์? ?์?๋??' })
  empNm: string;

  @ApiProperty({ 
    required: false, 
    description: '?ด๋?/?ธ๋? ๊ตฌ๋ถ (? ํ) - 1: ?์ฌ, 2: ?ธ์ฃผ, ALL: ?์ฒด', 
    example: 'ALL' 
  })
  @IsOptional()
  @IsString()
  ownOutsDiv?: string;

  @ApiProperty({ 
    required: false, 
    description: '?ด์ง ?ฌ๋? (? ํ) - Y: ?ด์ง???ฌํจ, N: ?ด์ง???์ธ', 
    example: 'Y' 
  })
  @IsOptional()
  @IsString()
  retirYn?: string;
}

/**
 * ์ง์ ?๋ณด DTO (Entity? ๋งคํ)
 */
export class EmployeeDto {
  @ApiProperty({ description: '๋ชฉ๋ก ๋ฒํธ' })
  LIST_NO: string;

  @ApiProperty({ description: '?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ๋ช? })
  OWN_OUTS_NM: string;

  @ApiProperty({ description: '์ง์๋ช? })
  EMP_NM: string;

  @ApiProperty({ description: '์ง์๋ฒํธ' })
  EMP_NO: string;

  @ApiProperty({ description: '์ง์ฑ ์ฝ๋๋ช? })
  DUTY_CD_NM: string;

  @ApiProperty({ description: '๊ธฐ์ ?ฑ๊ธ๋ช? })
  TCN_GRD_NM: string;

  @ApiProperty({ description: '?์๋ช? })
  PARTY_NM: string;

  @ApiProperty({ description: '?์ฌ?? })
  ENTR_DT: string;

  @ApiProperty({ description: '?ฌ์?์?? })
  EXEC_IN_STRT_DT: string;

  @ApiProperty({ description: '?ฌ์์ข๋ฃ?? })
  EXEC_IN_END_DT: string;

  @ApiProperty({ description: '?ํ๋ช? })
  WKG_ST_DIV_NM: string;

  @ApiProperty({ description: '?ฌ์์ค??๋ก?ํธ' })
  EXEC_ING_BSN_NM: string;

  @ApiProperty({ description: '๋ณธ๋?๊ตฌ๋ถ์ฝ๋' })
  HQ_DIV_CD: string;

  @ApiProperty({ description: '๋ถ?๊ตฌ๋ถ์ฝ?? })
  DEPT_DIV_CD: string;

  @ApiProperty({ description: '?์์ฝ๋' })
  CSF_CO_CD: string;

  @ApiProperty({ description: '?ํ์ฝ๋' })
  WKG_ST_DIV: string;

  @ApiProperty({ description: '?ฌ์์ค์ ๋ฌ? })
  EXEC_ING_YN: string;

  @ApiProperty({ description: '๊ตฌ๋ถ์ฝ๋' })
  OWN_OUTS_DIV: string;

  @ApiProperty({ description: '?ธ์ฃผ๋ฐฐ์ ? ๋ฌด' })
  OUTS_FIX_YN: string;

  @ApiProperty({ description: '?ธ์ฃผ๋ฐฐ์ ?์ ?ผ์' })
  IN_FIX_DT: string;

  @ApiProperty({ description: '?ธ์ฃผ๋ฐฐ์ ?๋ก?ํธ' })
  IN_FIX_PRJT: string;

  @ApiProperty({ description: '์ง์ฑ์ฝ๋' })
  DUTY_CD: string;

  @ApiProperty({ description: '?ฌ์?ธ๋ ฅ์ง์ฑ' })
  DUTY_DIV_CD: string;

  @ApiProperty({ description: '?ฑ๊ธ์ฝ๋' })
  TCN_GRD: string;
}

/**
 * ?๋ก?์? ?๋ณด DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '?๋ก?์?๋ช? })
  name: string;

  @ApiProperty({ description: '?๋ณธ ์ฃผ์ (์ค๋ณ ๋ฐฐ์ด)', type: [String] })
  originalCommentLines: string[];
}

/**
 * ์ง์ ๊ฒ???๋ต DTO
 */
export class EmployeeSearchResponseDto {
  @ApiProperty({ description: '์ง์ ๋ชฉ๋ก', type: [EmployeeDto] })
  data: EmployeeDto[];

  @ApiProperty({ description: '?๋ก?์? ?๋ณด', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto;

  @ApiProperty({ description: '์ด?๊ฐ์' })
  totalCount: number;
} 

