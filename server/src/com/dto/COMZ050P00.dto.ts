import { ApiProperty } from '@nestjs/swagger';

export class COMZ050P00RequestDto {
  @ApiProperty({ description: '저장프로시저명', required: false })
  sp?: string;

  @ApiProperty({ description: '사업명' })
  bsnNm: string;

  @ApiProperty({ description: '시작년도', required: false })
  startYear?: string;

  @ApiProperty({ description: '진행상태구분', required: false })
  progressStateDiv?: string;

  @ApiProperty({ description: '로그인ID', required: false })
  loginId?: string;
}

export class COMZ050P00ResultDto {
  @ApiProperty({ description: '사업번호' })
  bsnNo: string;

  @ApiProperty({ description: '사업구분' })
  bsnDiv: string;

  @ApiProperty({ description: '사업구분명' })
  bsnDivNm: string;

  @ApiProperty({ description: '사업명' })
  bsnNm: string;

  @ApiProperty({ description: '수주처' })
  ordPlc: string;

  @ApiProperty({ description: '부서번호' })
  deptNo: string;

  @ApiProperty({ description: '매출구분' })
  saleDiv: string;

  @ApiProperty({ description: '매출구분명' })
  saleDivNm: string;

  @ApiProperty({ description: '사업년도' })
  bsnYr: string;

  @ApiProperty({ description: '일련번호' })
  seqNo: string;

  @ApiProperty({ description: '진행상태구분' })
  pgrsStDiv: string;

  @ApiProperty({ description: '진행상태구분명' })
  pgrsStDivNm: string;

  @ApiProperty({ description: '사업시작일자' })
  bsnStrtDt: string;

  @ApiProperty({ description: '사업종료일자' })
  bsnEndDt: string;

  @ApiProperty({ description: '영업대표' })
  bizRepnm: string;

  @ApiProperty({ description: 'PM' })
  pmNm: string;

  @ApiProperty({ description: '계약일자' })
  ctrDt: string;

  @ApiProperty({ description: '사업부서명' })
  pplsDeptNm: string;

  @ApiProperty({ description: '사업부서코드' })
  pplsDeptCd: string;

  @ApiProperty({ description: '사업본부코드' })
  pplsHqCd: string;

  @ApiProperty({ description: '실행부서명' })
  execDeptNm: string;

  @ApiProperty({ description: '실행부서코드' })
  execDeptCd: string;

  @ApiProperty({ description: '실행본부코드' })
  execHqCd: string;

  @ApiProperty({ description: '비고' })
  rmk: string;

  @ApiProperty({ description: '등록일시' })
  regDttm: string;

  @ApiProperty({ description: '변경일시' })
  chngDttm: string;

  @ApiProperty({ description: '변경자ID' })
  chngrId: string;
}

export class COMZ050P00ResponseDto {
  @ApiProperty({ type: [COMZ050P00ResultDto], description: '사업명 검색 결과 리스트' })
  data: COMZ050P00ResultDto[];

  @ApiProperty({ description: '총 건수' })
  totalCount: number;
} 