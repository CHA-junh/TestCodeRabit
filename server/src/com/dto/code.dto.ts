import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * μ½λ κ²???μ²­ DTO
 */
export class CodeSearchRequestDto {
  @ApiProperty({ 
    required: true, 
    description: '?λΆλ₯μ½λ (?μ) - μ‘°ν??μ½λ???λΆλ₯ μ½λλ₯??λ ₯?μΈ??, 
    example: '100',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?λΆλ₯μ½λ???μ?λ??' })
  largeCategoryCode: string;
}

/**
 * μ½λ ?λ³΄ DTO (Entity? λ§€ν)
 */
export class CodeDto {
  @ApiProperty({ description: 'μ½λ ID' })
  codeId: string;

  @ApiProperty({ description: 'μ½λλͺ? })
  codeNm: string;

  @ApiProperty({ description: '?¬μ© ?¬λ?' })
  useYn: string;

  @ApiProperty({ description: '?λ ¬ ?μ' })
  sortSeq: number;
}

/**
 * ?λ‘?μ? ?λ³΄ DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '?λ‘?μ?λͺ? })
  name: string;

  @ApiProperty({ description: '?λ³Έ μ£Όμ (μ€λ³ λ°°μ΄)', type: [String] })
  originalCommentLines: string[];
}

/**
 * μ½λ κ²???λ΅ DTO
 */
export class CodeSearchResponseDto {
  @ApiProperty({ description: 'μ½λ λͺ©λ‘', type: [CodeDto] })
  data: CodeDto[];

  @ApiProperty({ description: '?λ‘?μ? ?λ³΄', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto;

  @ApiProperty({ description: 'μ΄?κ°μ' })
  totalCount: number;
} 

