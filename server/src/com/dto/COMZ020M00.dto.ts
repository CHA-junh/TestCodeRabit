import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'



/**
 * ?¨ê? ?€???Œë¼ë¯¸í„° ?€??
 */
export class UnitPriceSaveParams {
  @ApiProperty({ 
    required: true, 
    description: '?´ë?/?¸ë? êµ¬ë¶„ (?„ìˆ˜) - 1: ?ì‚¬, 2: ?¸ì£¼', 
    default: '1' 
  })
  @IsString()
  @IsNotEmpty({ message: '?´ë?/?¸ë? êµ¬ë¶„?€ ?„ìˆ˜?…ë‹ˆ??' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '?„ë„ (?„ìˆ˜) - ?¨ê?ë¥??ìš©???„ë„ (?? 2024)', 
    default: '' 
  })
  @IsString()
  @IsNotEmpty({ message: '?„ë„???„ìˆ˜?…ë‹ˆ??' })
  year: string = ''

  @ApiProperty({ 
    required: true, 
    description: 'ê¸°ìˆ ?±ê¸‰ (?„ìˆ˜) - ê¸°ìˆ ???±ê¸‰ ì½”ë“œ', 
    default: '',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: 'ê¸°ìˆ ?±ê¸‰?€ ?„ìˆ˜?…ë‹ˆ??' })
  tcnGrd: string = ''

  @ApiProperty({ 
    required: true, 
    description: 'ì§ë¬´ì½”ë“œ (?„ìˆ˜) - ì§ë¬´ ë¶„ë¥˜ ì½”ë“œ', 
    default: '',
    example: '9',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: 'ì§ë¬´ì½”ë“œ???„ìˆ˜?…ë‹ˆ??' })
  dutyCd: string = ''

  @ApiProperty({ 
    required: true, 
    description: '?¨ê? (?„ìˆ˜) - ?œê°„???¨ê? ê¸ˆì•¡', 
    default: '',
    example: '50000',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?¨ê????„ìˆ˜?…ë‹ˆ??' })
  unitPrice: string = ''
}

/**
 * ?¨ê? ?? œ ?Œë¼ë¯¸í„° ?€??
 */
export class UnitPriceDeleteParams {
  @ApiProperty({ 
    required: true, 
    description: '?´ë?/?¸ë? êµ¬ë¶„ (?„ìˆ˜) - 1: ?ì‚¬, 2: ?¸ì£¼', 
    default: '1',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?´ë?/?¸ë? êµ¬ë¶„?€ ?„ìˆ˜?…ë‹ˆ??' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '?„ë„ (?„ìˆ˜) - ?? œ???¨ê????„ë„', 
    default: '',
    example: '2024',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?„ë„???„ìˆ˜?…ë‹ˆ??' })
  year: string = ''

  @ApiProperty({ 
    required: true, 
    description: 'ê¸°ìˆ ?±ê¸‰ (?„ìˆ˜) - ?? œ???¨ê???ê¸°ìˆ ?±ê¸‰', 
    default: '',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: 'ê¸°ìˆ ?±ê¸‰?€ ?„ìˆ˜?…ë‹ˆ??' })
  tcnGrd: string = ''

  @ApiProperty({ 
    required: true, 
    description: 'ì§ë¬´ì½”ë“œ (?„ìˆ˜) - ?? œ???¨ê???ì§ë¬´ì½”ë“œ', 
    default: '',
    example: '9',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: 'ì§ë¬´ì½”ë“œ???„ìˆ˜?…ë‹ˆ??' })
  dutyCd: string = ''
}

/**
 * ?¨ê? ?•ë³´ ?€??
 */
export interface UnitPrice {
  OWN_OUTS_DIV: string
  OWN_OUTS_DIV_NM: string
  YR: string
  TCN_GRD: string
  TCN_GRD_NM: string
  DUTY_CD: string
  DUTY_NM: string
  UPRC: string
  [key: string]: any
}

/**
 * ?„ë¡œ?œì? ?•ë³´ DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '?„ë¡œ?œì?ëª? })
  name: string

  @ApiProperty({ description: '?ë³¸ ì£¼ì„ (ì¤„ë³„ ë°°ì—´)', type: [String] })
  originalCommentLines: string[]
}

 

