/**
 * CommonController - 공통 기능 API 컨트롤러
 *
 * 주요 기능:
 * - 공통 코드 조회 (?�분류코드�??�분류코??
 * - 부?�구분코??조회 (직접 DB 조회)
 * - 본�?�?부??코드 조회 (?�로?��? ?�출)
 *
 * ?��? ?�로?��?:
 * - COM_03_0101_S: 공통코드 조회 (?�분류코드�??�분류코??
 * - COM_03_0201_S: 본�?�?부??코드 조회
 *
 * ?��? ?�이�?
 * - TBL_SML_CSF_CD: ?�분류코???�이�?(부?�구분코??112)
 *
 * ?�용 ?�면:
 * - USR2010M00: ?�용??관�?(본�?/부??콤보박스)
 * - SYS1003M00: ?�용????�� 관�?(코드 조회)
 * - 기�? 공통 코드가 ?�요??모든 ?�면
 */
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CommonService } from './common.service';
import { DeptDivCodeDto } from '../com/dto/common.dto';
import {
  CodeSearchRequestDto,
  CodeSearchResponseDto,
} from '../com/dto/code.dto';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  /**
   * 부?�구분코??목록 조회 (GET)
   *
   * @description
   * - 부?�구분코??112)???�당?�는 모든 부??목록??조회?�니??
   * - 직접 DB 쿼리�?조회?�여 빠른 ?�답???�공?�니??
   * - ?�로?��? ?�출 ?�이 ?�순 조회�??�행?�니??
   *
   * @returns DeptDivCodeDto[] - 부?�구분코??목록
   * @example
   * GET /api/common/dept-div-codes
   * Response: [
   *   { "code": "1000", "name": "?�내공통(25)" },
   *   { "code": "1100", "name": "?��??�영?�본부(25)" }
   * ]
   */
  @Get('dept-div-codes')
  @ApiOperation({
    summary: '부?�구분코??목록',
    description:
      '부?�구분코??112) 목록??조회?�니?? 직접 DB 쿼리�?빠른 ?�답???�공?�니??',
  })
  @ApiResponse({
    status: 200,
    description: '부?�구분코??목록 조회 ?�공',
    type: [DeptDivCodeDto],
  })
  async getDeptDivCodes(): Promise<DeptDivCodeDto[]> {
    return this.commonService.getDeptDivCodes();
  }

  /**
   * 본�?구분코드 목록 조회 (GET)
   *
   * @description
   * - 본�?구분코드(113)???�당?�는 모든 본�? 목록??조회?�니??
   * - 직접 DB 쿼리�?조회?�여 빠른 ?�답???�공?�니??
   * - ?�로?��? ?�출 ?�이 ?�순 조회�??�행?�니??
   *
   * @returns DeptDivCodeDto[] - 본�?구분코드 목록
   * @example
   * GET /api/common/hq-div-codes
   * Response: [
   *   { "code": "01", "name": "경영지?�본부" },
   *   { "code": "02", "name": "?�업본�?" }
   * ]
   */
  @Get('hq-div-codes')
  @ApiOperation({
    summary: '본�?구분코드 목록',
    description:
      '본�?구분코드(113) 목록??조회?�니?? 직접 DB 쿼리�?빠른 ?�답???�공?�니??',
  })
  @ApiResponse({
    status: 200,
    description: '본�?구분코드 목록 조회 ?�공',
    type: [DeptDivCodeDto],
  })
  async getHqDivCodes(): Promise<DeptDivCodeDto[]> {
    return this.commonService.getHqDivCodes();
  }

  /**
   * 본�?�?부??목록 조회 (GET)
   *
   * @description
   * - ?�정 본�????�한 부??목록??직접 DB 쿼리�?조회?�니??
   * - TBL_SML_CSF_CD ?�이블에??LINK_CD1 컬럼???�용?�여 본�?�??�터링합?�다.
   * - ?�로?��? ?�출 ?�이 ?�순 SELECT 쿼리�??�행?�여 빠른 ?�답???�공?�니??
   *
   * @param hqCd - 본�?구분코드 (?? '01', '02', '03', '04')
   * @returns DeptDivCodeDto[] - 본�?�?부??목록
   * @example
   * GET /api/common/dept-by-hq?hqCd=01
   * Response: [
   *   { "code": "1101", "name": "경영지?��?" },
   *   { "code": "1102", "name": "?�사?�" }
   * ]
   */
  @Get('dept-by-hq')
  @ApiOperation({
    summary: '본�?�?부??목록',
    description:
      '본�?구분코드???�당?�는 부??목록??조회?�니?? 직접 DB 쿼리�?빠른 ?�답???�공?�니??',
  })
  @ApiResponse({
    status: 200,
    description: '본�?�?부??목록 조회 ?�공',
    type: [DeptDivCodeDto],
  })
  async getDeptByHq(@Query('hqCd') hqCd: string): Promise<DeptDivCodeDto[]> {
    return this.commonService.getDeptByHq(hqCd);
  }

  /**
   * 공통 코드 조회 (POST)
   *
   * @description
   * - ?�분류코드???�당?�는 ?�분�?코드?�을 조회?�니??
   * - COM_03_0101_S ?�로?��?�??�출?�여 조회?�니??
   * - ?�로?��? ?�보?� ?�께 ?�답??반환?�니??
   *
   * @param body.largeCategoryCode - ?�분류코드 (?? 113=본�?구분, 112=부?�구�? 101=권한구분)
   * @returns CodeSearchResponseDto - 코드 목록 �??�로?��? ?�보
   * @example
   * POST /api/common/search
   * Body: { "largeCategoryCode": "113" }
   * Response: {
   *   "data": [
   *     { "codeId": "1000", "codeNm": "?�내공통(25)" }
   *   ],
   *   "procedureInfo": { "name": "COM_03_0101_S" },
   *   "totalCount": 1
   * }
   */
  @Post('search')
  @ApiOperation({
    summary: '코드 조회',
    description:
      '?�분류코드???�당?�는 ?�분�?코드?�을 조회?�고 ?�로?��? ?�보�??�함?�여 반환?�니??',
  })
  @ApiBody({
    type: CodeSearchRequestDto,
    description: '코드 검??조건 (?�분류코드)',
  })
  @ApiResponse({
    status: 200,
    description: '코드 조회 ?�공',
    type: CodeSearchResponseDto,
  })
  async searchCodes(
    @Body() body: CodeSearchRequestDto,
  ): Promise<CodeSearchResponseDto> {
    return this.commonService.searchCodes(body.largeCategoryCode);
  }

  /**
   * 본�?�?부??코드 조회 (POST)
   *
   * @description
   * - ?�정 본�????�한 부??코드?�을 조회?�니??
   * - COM_03_0201_S ?�로?��?�??�출?�여 조회?�니??
   * - 본�?코드가 'ALL'??경우 ?�체 부?��? 조회?�니??
   *
   * @param body.hqDivCd - 본�?구분코드 (?? '1000', 'ALL')
   * @param body.allYn - ?�체?�함?��? (기본�? 'Y')
   * @returns CodeSearchResponseDto - 부??코드 목록 �??�로?��? ?�보
   * @example
   * POST /api/common/dept-by-hq
   * Body: { "hqDivCd": "1000", "allYn": "Y" }
   * Response: {
   *   "data": [
   *     { "codeId": "1100", "codeNm": "?��??�영?�본부(25)" }
   *   ],
   *   "procedureInfo": { "name": "COM_03_0201_S" },
   *   "totalCount": 1
   * }
   */
  @Post('dept-by-hq')
  @ApiOperation({
    summary: '본�?�?부??코드 조회',
    description:
      '본�?구분코드???�당?�는 부??코드?�을 조회?�고 ?�로?��? ?�보�??�함?�여 반환?�니??',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        hqDivCd: {
          type: 'string',
          description: '본�?구분코드 (ALL=?�체부??조회)',
        },
        allYn: {
          type: 'string',
          description: '?�체?�함?��? (Y/N)',
          default: 'Y',
        },
      },
      required: ['hqDivCd'],
    },
    description: '본�?�?부??코드 검??조건',
  })
  @ApiResponse({
    status: 200,
    description: '본�?�?부??코드 조회 ?�공',
    type: CodeSearchResponseDto,
  })
  async searchDeptCodesByHq(
    @Body() body: { hqDivCd: string; allYn?: string },
  ): Promise<CodeSearchResponseDto> {
    return this.commonService.searchDeptCodesByHq(
      body.hqDivCd,
      body.allYn || 'Y',
    );
  }
}


