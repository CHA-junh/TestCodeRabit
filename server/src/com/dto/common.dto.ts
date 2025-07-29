// 공통 부서구분코드 DTO (여러 화면에서 재사용)
import { ApiProperty } from '@nestjs/swagger';

/**
 * 부서구분코드(112) 공통 DTO
 * code: 부서구분코드
 * name: 부서구분명
 */
export class DeptDivCodeDto {
  @ApiProperty({ description: '부서구분코드' })
  code: string;

  @ApiProperty({ description: '부서구분명' })
  name: string;
} 