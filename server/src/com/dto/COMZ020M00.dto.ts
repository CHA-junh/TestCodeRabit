import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'



/**
 * ?��? ?�???�라미터 ?�??
 */
export class UnitPriceSaveParams {
  @ApiProperty({ 
    required: true, 
    description: '?��?/?��? 구분 (?�수) - 1: ?�사, 2: ?�주', 
    default: '1' 
  })
  @IsString()
  @IsNotEmpty({ message: '?��?/?��? 구분?� ?�수?�니??' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '?�도 (?�수) - ?��?�??�용???�도 (?? 2024)', 
    default: '' 
  })
  @IsString()
  @IsNotEmpty({ message: '?�도???�수?�니??' })
  year: string = ''

  @ApiProperty({ 
    required: true, 
    description: '기술?�급 (?�수) - 기술???�급 코드', 
    default: '',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '기술?�급?� ?�수?�니??' })
  tcnGrd: string = ''

  @ApiProperty({ 
    required: true, 
    description: '직무코드 (?�수) - 직무 분류 코드', 
    default: '',
    example: '9',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '직무코드???�수?�니??' })
  dutyCd: string = ''

  @ApiProperty({ 
    required: true, 
    description: '?��? (?�수) - ?�간???��? 금액', 
    default: '',
    example: '50000',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?��????�수?�니??' })
  unitPrice: string = ''
}

/**
 * ?��? ??�� ?�라미터 ?�??
 */
export class UnitPriceDeleteParams {
  @ApiProperty({ 
    required: true, 
    description: '?��?/?��? 구분 (?�수) - 1: ?�사, 2: ?�주', 
    default: '1',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?��?/?��? 구분?� ?�수?�니??' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '?�도 (?�수) - ??��???��????�도', 
    default: '',
    example: '2024',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '?�도???�수?�니??' })
  year: string = ''

  @ApiProperty({ 
    required: true, 
    description: '기술?�급 (?�수) - ??��???��???기술?�급', 
    default: '',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '기술?�급?� ?�수?�니??' })
  tcnGrd: string = ''

  @ApiProperty({ 
    required: true, 
    description: '직무코드 (?�수) - ??��???��???직무코드', 
    default: '',
    example: '9',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '직무코드???�수?�니??' })
  dutyCd: string = ''
}

/**
 * ?��? ?�보 ?�??
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
 * ?�로?��? ?�보 DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '?�로?��?�? })
  name: string

  @ApiProperty({ description: '?�본 주석 (줄별 배열)', type: [String] })
  originalCommentLines: string[]
}

 

