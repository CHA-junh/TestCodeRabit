// 공통 부?�구분코??DTO (?�러 ?�면?�서 ?�사??
import { ApiProperty } from '@nestjs/swagger';

/**
 * 부?�구분코??112) 공통 DTO
 * code: 부?�구분코??
 * name: 부?�구분명
 */
export class DeptDivCodeDto {
  @ApiProperty({ description: '부?�구분코?? })
  code: string;

  @ApiProperty({ description: '부?�구분명' })
  name: string;
} 

