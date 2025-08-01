import { ApiProperty } from '@nestjs/swagger';

export class COMZ050P00RequestDto {
  @ApiProperty({ description: '??ฅํ๋ก์?๋ช?, required: false })
  sp?: string;

  @ApiProperty({ description: '?ฌ์๋ช? })
  bsnNm: string;

  @ApiProperty({ description: '?์?๋', required: false })
  startYear?: string;

  @ApiProperty({ description: '์งํ?ํ๊ตฌ๋ถ', required: false })
  progressStateDiv?: string;

  @ApiProperty({ description: '๋ก๊ทธ?ธID', required: false })
  loginId?: string;
}

export class COMZ050P00ResultDto {
  @ApiProperty({ description: '?ฌ์๋ฒํธ' })
  bsnNo: string;

  @ApiProperty({ description: '?ฌ์๊ตฌ๋ถ' })
  bsnDiv: string;

  @ApiProperty({ description: '?ฌ์๊ตฌ๋ถ๋ช? })
  bsnDivNm: string;

  @ApiProperty({ description: '?ฌ์๋ช? })
  bsnNm: string;

  @ApiProperty({ description: '?์ฃผ์ฒ? })
  ordPlc: string;

  @ApiProperty({ description: '๋ถ?๋ฒ?? })
  deptNo: string;

  @ApiProperty({ description: '๋งค์ถ๊ตฌ๋ถ' })
  saleDiv: string;

  @ApiProperty({ description: '๋งค์ถ๊ตฌ๋ถ๋ช? })
  saleDivNm: string;

  @ApiProperty({ description: '?ฌ์?๋' })
  bsnYr: string;

  @ApiProperty({ description: '?ผ๋ จ๋ฒํธ' })
  seqNo: string;

  @ApiProperty({ description: '์งํ?ํ๊ตฌ๋ถ' })
  pgrsStDiv: string;

  @ApiProperty({ description: '์งํ?ํ๊ตฌ๋ถ๋ช? })
  pgrsStDivNm: string;

  @ApiProperty({ description: '?ฌ์?์?ผ์' })
  bsnStrtDt: string;

  @ApiProperty({ description: '?ฌ์์ข๋ฃ?ผ์' })
  bsnEndDt: string;

  @ApiProperty({ description: '?์??? })
  bizRepnm: string;

  @ApiProperty({ description: 'PM' })
  pmNm: string;

  @ApiProperty({ description: '๊ณ์ฝ?ผ์' })
  ctrDt: string;

  @ApiProperty({ description: '?ฌ์๋ถ?๋ช' })
  pplsDeptNm: string;

  @ApiProperty({ description: '?ฌ์๋ถ?์ฝ?? })
  pplsDeptCd: string;

  @ApiProperty({ description: '?ฌ์๋ณธ๋?์ฝ๋' })
  pplsHqCd: string;

  @ApiProperty({ description: '?คํ๋ถ?๋ช' })
  execDeptNm: string;

  @ApiProperty({ description: '?คํ๋ถ?์ฝ?? })
  execDeptCd: string;

  @ApiProperty({ description: '?คํ๋ณธ๋?์ฝ๋' })
  execHqCd: string;

  @ApiProperty({ description: '๋น๊ณ ' })
  rmk: string;

  @ApiProperty({ description: '?ฑ๋ก?ผ์' })
  regDttm: string;

  @ApiProperty({ description: '๋ณ๊ฒฝ์ผ?? })
  chngDttm: string;

  @ApiProperty({ description: '๋ณ๊ฒฝ์ID' })
  chngrId: string;
}

export class COMZ050P00ResponseDto {
  @ApiProperty({ type: [COMZ050P00ResultDto], description: '?ฌ์๋ช?๊ฒ??๊ฒฐ๊ณผ ๋ฆฌ์ค?? })
  data: COMZ050P00ResultDto[];

  @ApiProperty({ description: '์ด?๊ฑด์' })
  totalCount: number;
} 

