import { ApiProperty } from '@nestjs/swagger';

export class COMZ050P00RequestDto {
  @ApiProperty({ description: '?€?¥í”„ë¡œì‹œ?€ëª?, required: false })
  sp?: string;

  @ApiProperty({ description: '?¬ì—…ëª? })
  bsnNm: string;

  @ApiProperty({ description: '?œì‘?„ë„', required: false })
  startYear?: string;

  @ApiProperty({ description: 'ì§„í–‰?íƒœêµ¬ë¶„', required: false })
  progressStateDiv?: string;

  @ApiProperty({ description: 'ë¡œê·¸?¸ID', required: false })
  loginId?: string;
}

export class COMZ050P00ResultDto {
  @ApiProperty({ description: '?¬ì—…ë²ˆí˜¸' })
  bsnNo: string;

  @ApiProperty({ description: '?¬ì—…êµ¬ë¶„' })
  bsnDiv: string;

  @ApiProperty({ description: '?¬ì—…êµ¬ë¶„ëª? })
  bsnDivNm: string;

  @ApiProperty({ description: '?¬ì—…ëª? })
  bsnNm: string;

  @ApiProperty({ description: '?˜ì£¼ì²? })
  ordPlc: string;

  @ApiProperty({ description: 'ë¶€?œë²ˆ?? })
  deptNo: string;

  @ApiProperty({ description: 'ë§¤ì¶œêµ¬ë¶„' })
  saleDiv: string;

  @ApiProperty({ description: 'ë§¤ì¶œêµ¬ë¶„ëª? })
  saleDivNm: string;

  @ApiProperty({ description: '?¬ì—…?„ë„' })
  bsnYr: string;

  @ApiProperty({ description: '?¼ë ¨ë²ˆí˜¸' })
  seqNo: string;

  @ApiProperty({ description: 'ì§„í–‰?íƒœêµ¬ë¶„' })
  pgrsStDiv: string;

  @ApiProperty({ description: 'ì§„í–‰?íƒœêµ¬ë¶„ëª? })
  pgrsStDivNm: string;

  @ApiProperty({ description: '?¬ì—…?œì‘?¼ì' })
  bsnStrtDt: string;

  @ApiProperty({ description: '?¬ì—…ì¢…ë£Œ?¼ì' })
  bsnEndDt: string;

  @ApiProperty({ description: '?ì—…?€?? })
  bizRepnm: string;

  @ApiProperty({ description: 'PM' })
  pmNm: string;

  @ApiProperty({ description: 'ê³„ì•½?¼ì' })
  ctrDt: string;

  @ApiProperty({ description: '?¬ì—…ë¶€?œëª…' })
  pplsDeptNm: string;

  @ApiProperty({ description: '?¬ì—…ë¶€?œì½”?? })
  pplsDeptCd: string;

  @ApiProperty({ description: '?¬ì—…ë³¸ë?ì½”ë“œ' })
  pplsHqCd: string;

  @ApiProperty({ description: '?¤í–‰ë¶€?œëª…' })
  execDeptNm: string;

  @ApiProperty({ description: '?¤í–‰ë¶€?œì½”?? })
  execDeptCd: string;

  @ApiProperty({ description: '?¤í–‰ë³¸ë?ì½”ë“œ' })
  execHqCd: string;

  @ApiProperty({ description: 'ë¹„ê³ ' })
  rmk: string;

  @ApiProperty({ description: '?±ë¡?¼ì‹œ' })
  regDttm: string;

  @ApiProperty({ description: 'ë³€ê²½ì¼?? })
  chngDttm: string;

  @ApiProperty({ description: 'ë³€ê²½ìID' })
  chngrId: string;
}

export class COMZ050P00ResponseDto {
  @ApiProperty({ type: [COMZ050P00ResultDto], description: '?¬ì—…ëª?ê²€??ê²°ê³¼ ë¦¬ìŠ¤?? })
  data: COMZ050P00ResultDto[];

  @ApiProperty({ description: 'ì´?ê±´ìˆ˜' })
  totalCount: number;
} 

