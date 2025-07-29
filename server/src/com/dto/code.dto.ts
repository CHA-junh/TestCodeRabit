import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * ì½”ë“œ ê²€???”ì²­ DTO
 */
export class CodeSearchRequestDto {
  @ApiProperty({ 
    required: true, 
    description: '?€ë¶„ë¥˜ì½”ë“œ (?„ìˆ˜) - ì¡°íšŒ??ì½”ë“œ???€ë¶„ë¥˜ ì½”ë“œë¥??…ë ¥?˜ì„¸??, 
    example: '100',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?€ë¶„ë¥˜ì½”ë“œ???„ìˆ˜?…ë‹ˆ??' })
  largeCategoryCode: string;
}

/**
 * ì½”ë“œ ?•ë³´ DTO (Entity?€ ë§¤í•‘)
 */
export class CodeDto {
  @ApiProperty({ description: 'ì½”ë“œ ID' })
  codeId: string;

  @ApiProperty({ description: 'ì½”ë“œëª? })
  codeNm: string;

  @ApiProperty({ description: '?¬ìš© ?¬ë?' })
  useYn: string;

  @ApiProperty({ description: '?•ë ¬ ?œì„œ' })
  sortSeq: number;
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
 * ì½”ë“œ ê²€???‘ë‹µ DTO
 */
export class CodeSearchResponseDto {
  @ApiProperty({ description: 'ì½”ë“œ ëª©ë¡', type: [CodeDto] })
  data: CodeDto[];

  @ApiProperty({ description: '?„ë¡œ?œì? ?•ë³´', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto;

  @ApiProperty({ description: 'ì´?ê°œìˆ˜' })
  totalCount: number;
} 

