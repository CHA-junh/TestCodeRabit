/**
 * CommonController - 공통 기능 API 컨트롤러
 *
 * 주요 기능:
 * - 공통 코드 조회 (대분류코드별 소분류코드)
 * - 부서구분코드 조회 (직접 DB 조회)
 * - 본부별 부서 코드 조회 (프로시저 호출)
 *
 * 연관 프로시저:
 * - COM_03_0101_S: 공통코드 조회 (대분류코드별 소분류코드)
 * - COM_03_0201_S: 본부별 부서 코드 조회
 *
 * 연관 테이블:
 * - TBL_SML_CSF_CD: 소분류코드 테이블 (부서구분코드 112)
 *
 * 사용 화면:
 * - USR2010M00: 사용자 관리 (본부/부서 콤보박스)
 * - SYS1003M00: 사용자 역할 관리 (코드 조회)
 * - 기타 공통 코드가 필요한 모든 화면
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
   * 부서구분코드 목록 조회 (GET)
   *
   * @description
   * - 부서구분코드(112)에 해당하는 모든 부서 목록을 조회합니다.
   * - 직접 DB 쿼리로 조회하여 빠른 응답을 제공합니다.
   * - 프로시저 호출 없이 단순 조회만 수행합니다.
   *
   * @returns DeptDivCodeDto[] - 부서구분코드 목록
   * @example
   * GET /api/common/dept-div-codes
   * Response: [
   *   { "code": "1000", "name": "사내공통(25)" },
   *   { "code": "1100", "name": "디지털영업본부(25)" }
   * ]
   */
  @Get('dept-div-codes')
  @ApiOperation({
    summary: '부서구분코드 목록',
    description:
      '부서구분코드(112) 목록을 조회합니다. 직접 DB 쿼리로 빠른 응답을 제공합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '부서구분코드 목록 조회 성공',
    type: [DeptDivCodeDto],
  })
  async getDeptDivCodes(): Promise<DeptDivCodeDto[]> {
    return this.commonService.getDeptDivCodes();
  }

  /**
   * 본부구분코드 목록 조회 (GET)
   *
   * @description
   * - 본부구분코드(113)에 해당하는 모든 본부 목록을 조회합니다.
   * - 직접 DB 쿼리로 조회하여 빠른 응답을 제공합니다.
   * - 프로시저 호출 없이 단순 조회만 수행합니다.
   *
   * @returns DeptDivCodeDto[] - 본부구분코드 목록
   * @example
   * GET /api/common/hq-div-codes
   * Response: [
   *   { "code": "01", "name": "경영지원본부" },
   *   { "code": "02", "name": "영업본부" }
   * ]
   */
  @Get('hq-div-codes')
  @ApiOperation({
    summary: '본부구분코드 목록',
    description:
      '본부구분코드(113) 목록을 조회합니다. 직접 DB 쿼리로 빠른 응답을 제공합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '본부구분코드 목록 조회 성공',
    type: [DeptDivCodeDto],
  })
  async getHqDivCodes(): Promise<DeptDivCodeDto[]> {
    return this.commonService.getHqDivCodes();
  }

  /**
   * 본부별 부서 목록 조회 (GET)
   *
   * @description
   * - 특정 본부에 속한 부서 목록을 직접 DB 쿼리로 조회합니다.
   * - TBL_SML_CSF_CD 테이블에서 LINK_CD1 컬럼을 사용하여 본부별 필터링합니다.
   * - 프로시저 호출 없이 단순 SELECT 쿼리만 수행하여 빠른 응답을 제공합니다.
   *
   * @param hqCd - 본부구분코드 (예: '01', '02', '03', '04')
   * @returns DeptDivCodeDto[] - 본부별 부서 목록
   * @example
   * GET /api/common/dept-by-hq?hqCd=01
   * Response: [
   *   { "code": "1101", "name": "경영지원팀" },
   *   { "code": "1102", "name": "인사팀" }
   * ]
   */
  @Get('dept-by-hq')
  @ApiOperation({
    summary: '본부별 부서 목록',
    description:
      '본부구분코드에 해당하는 부서 목록을 조회합니다. 직접 DB 쿼리로 빠른 응답을 제공합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '본부별 부서 목록 조회 성공',
    type: [DeptDivCodeDto],
  })
  async getDeptByHq(@Query('hqCd') hqCd: string): Promise<DeptDivCodeDto[]> {
    return this.commonService.getDeptByHq(hqCd);
  }

  /**
   * 공통 코드 조회 (POST)
   *
   * @description
   * - 대분류코드에 해당하는 소분류 코드들을 조회합니다.
   * - COM_03_0101_S 프로시저를 호출하여 조회합니다.
   * - 프로시저 정보와 함께 응답을 반환합니다.
   *
   * @param body.largeCategoryCode - 대분류코드 (예: 113=본부구분, 112=부서구분, 101=권한구분)
   * @returns CodeSearchResponseDto - 코드 목록 및 프로시저 정보
   * @example
   * POST /api/common/search
   * Body: { "largeCategoryCode": "113" }
   * Response: {
   *   "data": [
   *     { "codeId": "1000", "codeNm": "사내공통(25)" }
   *   ],
   *   "procedureInfo": { "name": "COM_03_0101_S" },
   *   "totalCount": 1
   * }
   */
  @Post('search')
  @ApiOperation({
    summary: '코드 조회',
    description:
      '대분류코드에 해당하는 소분류 코드들을 조회하고 프로시저 정보를 포함하여 반환합니다.',
  })
  @ApiBody({
    type: CodeSearchRequestDto,
    description: '코드 검색 조건 (대분류코드)',
  })
  @ApiResponse({
    status: 200,
    description: '코드 조회 성공',
    type: CodeSearchResponseDto,
  })
  async searchCodes(
    @Body() body: CodeSearchRequestDto,
  ): Promise<CodeSearchResponseDto> {
    return this.commonService.searchCodes(body.largeCategoryCode);
  }

  /**
   * 본부별 부서 코드 조회 (POST)
   *
   * @description
   * - 특정 본부에 속한 부서 코드들을 조회합니다.
   * - COM_03_0201_S 프로시저를 호출하여 조회합니다.
   * - 본부코드가 'ALL'인 경우 전체 부서를 조회합니다.
   *
   * @param body.hqDivCd - 본부구분코드 (예: '1000', 'ALL')
   * @param body.allYn - 전체포함여부 (기본값: 'Y')
   * @returns CodeSearchResponseDto - 부서 코드 목록 및 프로시저 정보
   * @example
   * POST /api/common/dept-by-hq
   * Body: { "hqDivCd": "1000", "allYn": "Y" }
   * Response: {
   *   "data": [
   *     { "codeId": "1100", "codeNm": "디지털영업본부(25)" }
   *   ],
   *   "procedureInfo": { "name": "COM_03_0201_S" },
   *   "totalCount": 1
   * }
   */
  @Post('dept-by-hq')
  @ApiOperation({
    summary: '본부별 부서 코드 조회',
    description:
      '본부구분코드에 해당하는 부서 코드들을 조회하고 프로시저 정보를 포함하여 반환합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        hqDivCd: {
          type: 'string',
          description: '본부구분코드 (ALL=전체부서 조회)',
        },
        allYn: {
          type: 'string',
          description: '전체포함여부 (Y/N)',
          default: 'Y',
        },
      },
      required: ['hqDivCd'],
    },
    description: '본부별 부서 코드 검색 조건',
  })
  @ApiResponse({
    status: 200,
    description: '본부별 부서 코드 조회 성공',
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
