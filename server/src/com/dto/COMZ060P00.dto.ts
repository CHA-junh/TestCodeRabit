import { ApiProperty } from '@nestjs/swagger';

export class COMZ060P00RequestDto {
  @ApiProperty({ description: '부?�번??, required: true })
  deptNo: string;

  @ApiProperty({ description: '?�도', required: true })
  year: string;

  @ApiProperty({ description: '부?�구분코??, required: false })
  deptDivCd?: string;
}

export class COMZ060P00ResultDto {
  @ApiProperty({ description: '부?�번?? })
  deptNo: string;
  @ApiProperty({ description: '부?�명' })
  deptNm: string;
  @ApiProperty({ description: '?�작?�자' })
  strtDt: string;
  @ApiProperty({ description: '종료?�자' })
  endDt: string;
  @ApiProperty({ description: '부?�구분코?? })
  deptDivCd: string;
  @ApiProperty({ description: '부?�구분명' })
  deptDivNm: string;
  @ApiProperty({ description: '본�?구분코드' })
  hqDivCd: string;
  @ApiProperty({ description: '본�?구분�? })
  hqDivNm: string;
  @ApiProperty({ description: '?�업부?�구�? })
  bsnDeptKb: string;
}

export class COMZ060P00ResponseDto {
  @ApiProperty({ type: [COMZ060P00ResultDto], description: '부??리스?? })
  data: COMZ060P00ResultDto[];

  @ApiProperty({ description: '�?건수' })
  totalCount: number;
}

export class DeptDivCodeDto {
  @ApiProperty({ description: '부?�구분코?? })
  code: string;

  @ApiProperty({ description: '부?�구분명' })
  name: string;
} 

