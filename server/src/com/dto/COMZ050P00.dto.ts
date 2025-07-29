import { ApiProperty } from '@nestjs/swagger';

export class COMZ050P00RequestDto {
  @ApiProperty({ description: '?�?�프로시?��?, required: false })
  sp?: string;

  @ApiProperty({ description: '?�업�? })
  bsnNm: string;

  @ApiProperty({ description: '?�작?�도', required: false })
  startYear?: string;

  @ApiProperty({ description: '진행?�태구분', required: false })
  progressStateDiv?: string;

  @ApiProperty({ description: '로그?�ID', required: false })
  loginId?: string;
}

export class COMZ050P00ResultDto {
  @ApiProperty({ description: '?�업번호' })
  bsnNo: string;

  @ApiProperty({ description: '?�업구분' })
  bsnDiv: string;

  @ApiProperty({ description: '?�업구분�? })
  bsnDivNm: string;

  @ApiProperty({ description: '?�업�? })
  bsnNm: string;

  @ApiProperty({ description: '?�주�? })
  ordPlc: string;

  @ApiProperty({ description: '부?�번?? })
  deptNo: string;

  @ApiProperty({ description: '매출구분' })
  saleDiv: string;

  @ApiProperty({ description: '매출구분�? })
  saleDivNm: string;

  @ApiProperty({ description: '?�업?�도' })
  bsnYr: string;

  @ApiProperty({ description: '?�련번호' })
  seqNo: string;

  @ApiProperty({ description: '진행?�태구분' })
  pgrsStDiv: string;

  @ApiProperty({ description: '진행?�태구분�? })
  pgrsStDivNm: string;

  @ApiProperty({ description: '?�업?�작?�자' })
  bsnStrtDt: string;

  @ApiProperty({ description: '?�업종료?�자' })
  bsnEndDt: string;

  @ApiProperty({ description: '?�업?�?? })
  bizRepnm: string;

  @ApiProperty({ description: 'PM' })
  pmNm: string;

  @ApiProperty({ description: '계약?�자' })
  ctrDt: string;

  @ApiProperty({ description: '?�업부?�명' })
  pplsDeptNm: string;

  @ApiProperty({ description: '?�업부?�코?? })
  pplsDeptCd: string;

  @ApiProperty({ description: '?�업본�?코드' })
  pplsHqCd: string;

  @ApiProperty({ description: '?�행부?�명' })
  execDeptNm: string;

  @ApiProperty({ description: '?�행부?�코?? })
  execDeptCd: string;

  @ApiProperty({ description: '?�행본�?코드' })
  execHqCd: string;

  @ApiProperty({ description: '비고' })
  rmk: string;

  @ApiProperty({ description: '?�록?�시' })
  regDttm: string;

  @ApiProperty({ description: '변경일?? })
  chngDttm: string;

  @ApiProperty({ description: '변경자ID' })
  chngrId: string;
}

export class COMZ050P00ResponseDto {
  @ApiProperty({ type: [COMZ050P00ResultDto], description: '?�업�?검??결과 리스?? })
  data: COMZ050P00ResultDto[];

  @ApiProperty({ description: '�?건수' })
  totalCount: number;
} 

