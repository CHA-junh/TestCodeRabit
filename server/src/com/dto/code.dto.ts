import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * 코드 검???�청 DTO
 */
export class CodeSearchRequestDto {
  @ApiProperty({ 
    required: true, 
    description: '?�분류코드 (?�수) - 조회??코드???�분류 코드�??�력?�세??, 
    example: '100',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?�분류코드???�수?�니??' })
  largeCategoryCode: string;
}

/**
 * 코드 ?�보 DTO (Entity?� 매핑)
 */
export class CodeDto {
  @ApiProperty({ description: '코드 ID' })
  codeId: string;

  @ApiProperty({ description: '코드�? })
  codeNm: string;

  @ApiProperty({ description: '?�용 ?��?' })
  useYn: string;

  @ApiProperty({ description: '?�렬 ?�서' })
  sortSeq: number;
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
 * 코드 검???�답 DTO
 */
export class CodeSearchResponseDto {
  @ApiProperty({ description: '코드 목록', type: [CodeDto] })
  data: CodeDto[];

  @ApiProperty({ description: '?�로?��? ?�보', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto;

  @ApiProperty({ description: '�?개수' })
  totalCount: number;
} 

