import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'



/**
 * ?¨κ? ????λΌλ―Έν° ???
 */
export class UnitPriceSaveParams {
  @ApiProperty({ 
    required: true, 
    description: '?΄λ?/?Έλ? κ΅¬λΆ (?μ) - 1: ?μ¬, 2: ?Έμ£Ό', 
    default: '1' 
  })
  @IsString()
  @IsNotEmpty({ message: '?΄λ?/?Έλ? κ΅¬λΆ? ?μ?λ??' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '?λ (?μ) - ?¨κ?λ₯??μ©???λ (?? 2024)', 
    default: '' 
  })
  @IsString()
  @IsNotEmpty({ message: '?λ???μ?λ??' })
  year: string = ''

  @ApiProperty({ 
    required: true, 
    description: 'κΈ°μ ?±κΈ (?μ) - κΈ°μ ???±κΈ μ½λ', 
    default: '',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: 'κΈ°μ ?±κΈ? ?μ?λ??' })
  tcnGrd: string = ''

  @ApiProperty({ 
    required: true, 
    description: 'μ§λ¬΄μ½λ (?μ) - μ§λ¬΄ λΆλ₯ μ½λ', 
    default: '',
    example: '9',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: 'μ§λ¬΄μ½λ???μ?λ??' })
  dutyCd: string = ''

  @ApiProperty({ 
    required: true, 
    description: '?¨κ? (?μ) - ?κ°???¨κ? κΈμ‘', 
    default: '',
    example: '50000',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?¨κ????μ?λ??' })
  unitPrice: string = ''
}

/**
 * ?¨κ? ??  ?λΌλ―Έν° ???
 */
export class UnitPriceDeleteParams {
  @ApiProperty({ 
    required: true, 
    description: '?΄λ?/?Έλ? κ΅¬λΆ (?μ) - 1: ?μ¬, 2: ?Έμ£Ό', 
    default: '1',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?΄λ?/?Έλ? κ΅¬λΆ? ?μ?λ??' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '?λ (?μ) - ?? ???¨κ????λ', 
    default: '',
    example: '2024',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?λ???μ?λ??' })
  year: string = ''

  @ApiProperty({ 
    required: true, 
    description: 'κΈ°μ ?±κΈ (?μ) - ?? ???¨κ???κΈ°μ ?±κΈ', 
    default: '',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: 'κΈ°μ ?±κΈ? ?μ?λ??' })
  tcnGrd: string = ''

  @ApiProperty({ 
    required: true, 
    description: 'μ§λ¬΄μ½λ (?μ) - ?? ???¨κ???μ§λ¬΄μ½λ', 
    default: '',
    example: '9',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: 'μ§λ¬΄μ½λ???μ?λ??' })
  dutyCd: string = ''
}

/**
 * ?¨κ? ?λ³΄ ???
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
 * ?λ‘?μ? ?λ³΄ DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '?λ‘?μ?λͺ? })
  name: string

  @ApiProperty({ description: '?λ³Έ μ£Όμ (μ€λ³ λ°°μ΄)', type: [String] })
  originalCommentLines: string[]
}

 

