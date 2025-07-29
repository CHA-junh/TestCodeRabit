import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * 코드 검색 요청 DTO
 */
export class CodeSearchRequestDto {
  @ApiProperty({ 
    required: true, 
    description: '대분류코드 (필수) - 조회할 코드의 대분류 코드를 입력하세요', 
    example: '100',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '대분류코드는 필수입니다.' })
  largeCategoryCode: string;
}

/**
 * 코드 정보 DTO (Entity와 매핑)
 */
export class CodeDto {
  @ApiProperty({ description: '코드 ID' })
  codeId: string;

  @ApiProperty({ description: '코드명' })
  codeNm: string;

  @ApiProperty({ description: '사용 여부' })
  useYn: string;

  @ApiProperty({ description: '정렬 순서' })
  sortSeq: number;
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
 * 코드 검색 응답 DTO
 */
export class CodeSearchResponseDto {
  @ApiProperty({ description: '코드 목록', type: [CodeDto] })
  data: CodeDto[];

  @ApiProperty({ description: '프로시저 정보', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto;

  @ApiProperty({ description: '총 개수' })
  totalCount: number;
} 