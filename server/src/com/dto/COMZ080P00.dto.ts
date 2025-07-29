import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * ì§ì› ê²€???”ì²­ DTO
 */
export class EmployeeSearchRequestDto {
  @ApiProperty({ 
    required: false, 
    description: 'ê²€???¤ì›Œ??(? íƒ) - ê²€??ë°©ì‹ ? íƒ', 
    example: '2' 
  })
  @IsOptional()
  @IsString()
  kb?: string;

  @ApiProperty({ 
    required: false, 
    description: '?¬ì›ë²ˆí˜¸ (? íƒ) - ?¹ì • ?¬ì›ë²ˆí˜¸ë¡?ê²€?‰í•  ???¬ìš©', 
    example: '' 
  })
  @IsOptional()
  @IsString()
  empNo?: string;

  @ApiProperty({ 
    required: true, 
    description: '?¬ì›ëª?(?„ìˆ˜) - ê²€?‰í•  ?¬ì›???´ë¦„???…ë ¥?˜ì„¸??, 
    example: '?ê¸¸??,
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?¬ì›ëª…ì? ?„ìˆ˜?…ë‹ˆ??' })
  empNm: string;

  @ApiProperty({ 
    required: false, 
    description: '?´ë?/?¸ë? êµ¬ë¶„ (? íƒ) - 1: ?ì‚¬, 2: ?¸ì£¼, ALL: ?„ì²´', 
    example: 'ALL' 
  })
  @IsOptional()
  @IsString()
  ownOutsDiv?: string;

  @ApiProperty({ 
    required: false, 
    description: '?´ì§ ?¬ë? (? íƒ) - Y: ?´ì§???¬í•¨, N: ?´ì§???œì™¸', 
    example: 'Y' 
  })
  @IsOptional()
  @IsString()
  retirYn?: string;
}

/**
 * ì§ì› ?•ë³´ DTO (Entity?€ ë§¤í•‘)
 */
export class EmployeeDto {
  @ApiProperty({ description: 'ëª©ë¡ ë²ˆí˜¸' })
  LIST_NO: string;

  @ApiProperty({ description: '?ì‚¬/?¸ì£¼ êµ¬ë¶„ëª? })
  OWN_OUTS_NM: string;

  @ApiProperty({ description: 'ì§ì›ëª? })
  EMP_NM: string;

  @ApiProperty({ description: 'ì§ì›ë²ˆí˜¸' })
  EMP_NO: string;

  @ApiProperty({ description: 'ì§ì±… ì½”ë“œëª? })
  DUTY_CD_NM: string;

  @ApiProperty({ description: 'ê¸°ìˆ ?±ê¸‰ëª? })
  TCN_GRD_NM: string;

  @ApiProperty({ description: '?Œì†ëª? })
  PARTY_NM: string;

  @ApiProperty({ description: '?…ì‚¬?? })
  ENTR_DT: string;

  @ApiProperty({ description: '?¬ì…?œì‘?? })
  EXEC_IN_STRT_DT: string;

  @ApiProperty({ description: '?¬ì…ì¢…ë£Œ?? })
  EXEC_IN_END_DT: string;

  @ApiProperty({ description: '?íƒœëª? })
  WKG_ST_DIV_NM: string;

  @ApiProperty({ description: '?¬ì…ì¤??„ë¡œ?íŠ¸' })
  EXEC_ING_BSN_NM: string;

  @ApiProperty({ description: 'ë³¸ë?êµ¬ë¶„ì½”ë“œ' })
  HQ_DIV_CD: string;

  @ApiProperty({ description: 'ë¶€?œêµ¬ë¶„ì½”?? })
  DEPT_DIV_CD: string;

  @ApiProperty({ description: '?Œì†ì½”ë“œ' })
  CSF_CO_CD: string;

  @ApiProperty({ description: '?íƒœì½”ë“œ' })
  WKG_ST_DIV: string;

  @ApiProperty({ description: '?¬ì…ì¤‘ìœ ë¬? })
  EXEC_ING_YN: string;

  @ApiProperty({ description: 'êµ¬ë¶„ì½”ë“œ' })
  OWN_OUTS_DIV: string;

  @ApiProperty({ description: '?¸ì£¼ë°°ì •? ë¬´' })
  OUTS_FIX_YN: string;

  @ApiProperty({ description: '?¸ì£¼ë°°ì •?•ì •?¼ì' })
  IN_FIX_DT: string;

  @ApiProperty({ description: '?¸ì£¼ë°°ì •?„ë¡œ?íŠ¸' })
  IN_FIX_PRJT: string;

  @ApiProperty({ description: 'ì§ì±…ì½”ë“œ' })
  DUTY_CD: string;

  @ApiProperty({ description: '?¬ì…?¸ë ¥ì§ì±…' })
  DUTY_DIV_CD: string;

  @ApiProperty({ description: '?±ê¸‰ì½”ë“œ' })
  TCN_GRD: string;
}

/**
 * ?„ë¡œ?œì? ?•ë³´ DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '?„ë¡œ?œì?ëª? })
  name: string;

  @ApiProperty({ description: '?ë³¸ ì£¼ì„ (ì¤„ë³„ ë°°ì—´)', type: [String] })
  originalCommentLines: string[];
}

/**
 * ì§ì› ê²€???‘ë‹µ DTO
 */
export class EmployeeSearchResponseDto {
  @ApiProperty({ description: 'ì§ì› ëª©ë¡', type: [EmployeeDto] })
  data: EmployeeDto[];

  @ApiProperty({ description: '?„ë¡œ?œì? ?•ë³´', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto;

  @ApiProperty({ description: 'ì´?ê°œìˆ˜' })
  totalCount: number;
} 

