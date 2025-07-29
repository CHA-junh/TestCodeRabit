import { ApiProperty } from '@nestjs/swagger';

export class COMZ060P00RequestDto {
  @ApiProperty({ description: '부서번호', required: true })
  deptNo: string;

  @ApiProperty({ description: '년도', required: true })
  year: string;

  @ApiProperty({ description: '부서구분코드', required: false })
  deptDivCd?: string;
}

export class COMZ060P00ResultDto {
  @ApiProperty({ description: '부서번호' })
  deptNo: string;
  @ApiProperty({ description: '부서명' })
  deptNm: string;
  @ApiProperty({ description: '시작일자' })
  strtDt: string;
  @ApiProperty({ description: '종료일자' })
  endDt: string;
  @ApiProperty({ description: '부서구분코드' })
  deptDivCd: string;
  @ApiProperty({ description: '부서구분명' })
  deptDivNm: string;
  @ApiProperty({ description: '본부구분코드' })
  hqDivCd: string;
  @ApiProperty({ description: '본부구분명' })
  hqDivNm: string;
  @ApiProperty({ description: '사업부서구분' })
  bsnDeptKb: string;
}

export class COMZ060P00ResponseDto {
  @ApiProperty({ type: [COMZ060P00ResultDto], description: '부서 리스트' })
  data: COMZ060P00ResultDto[];

  @ApiProperty({ description: '총 건수' })
  totalCount: number;
}

export class DeptDivCodeDto {
  @ApiProperty({ description: '부서구분코드' })
  code: string;

  @ApiProperty({ description: '부서구분명' })
  name: string;
} 