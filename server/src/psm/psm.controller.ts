/**
 * PSM (Personnel System Management) 컨트롤러
 * 
 * ?�사관�??�스?�의 REST API ?�드?�인?��? ?�공?�는 컨트롤러?�니??
 * ?�라?�언?�의 ?�청??받아 PSM ?�비?�로 ?�달?�고, ?��??�된 ?�답??반환?�니??
 * 
 * 주요 기능:
 * - ?�원 ?�보 관�?API
 * - 경력 계산 �?관�?API
 * - ?�사발령 관�?API
 * - 공통 코드 조회 API
 * 
 * 모든 API??Swagger 문서?��? ?�어 ?�으�? ?��??�된 ?�답 ?�식???�용?�니??
 * 
 * @author BIST Development Team
 * @since 2024
 */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiParam 
} from '@nestjs/swagger';
import { PsmService } from './psm.service';
import {
  SearchEmployeesDto,
  EmployeeDetailDto,
  CalculateCareerDto,
  UpdateCareerDto,
  SearchAppointmentDto,
  SaveAppointmentDto,
  DeleteAppointmentDto,
  BatchRegisterAppointmentDto,
  UpdateEmployeeDto,
  TechnicalGradeHistoryDto,
  ProfileCareerDto,
  ApiResponseDto,
  DeleteEmployeeDto,
  ProfileListDto,
  ProfileInsertDto,
  ProfileUpdateDto,
  ProfileDeleteDto,
  ProfileCarrCalcDto
} from './dto/psm.dto';

@ApiTags('PSM - ?�사관�?)
@Controller('psm')
export class PsmController {
  constructor(
    private readonly psmService: PsmService
  ) {}

  @ApiOperation({ 
    summary: '?�원 검??, 
    description: '조건??맞는 ?�원 목록??검?�합?�다.' 
  })
  @ApiBody({ type: SearchEmployeesDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�원 검???�공',
    type: ApiResponseDto 
  })
  @Post('employee/search')
  async searchEmployees(@Body() searchParams: SearchEmployeesDto) {
    return await this.psmService.searchEmployees(searchParams);
  }

  @ApiOperation({ 
    summary: '?�원 ?�세 조회', 
    description: '?�정 ?�원???�세 ?�보�?조회?�니??' 
  })
  @ApiBody({ type: EmployeeDetailDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�원 ?�세 조회 ?�공',
    type: ApiResponseDto 
  })
  @Post('employee/detail')
  async getEmployeeDetail(@Body() detailParams: EmployeeDetailDto) {
    return await this.psmService.getEmployeeDetail(detailParams);
  }

  @ApiOperation({ 
    summary: '경력 계산', 
    description: '?�원??경력??계산?�니??' 
  })
  @ApiBody({ type: CalculateCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '경력 계산 ?�공',
    type: ApiResponseDto 
  })
  @Post('career/calculate')
  async calculateCareer(@Body() careerParams: CalculateCareerDto) {
    return await this.psmService.calculateCareer(careerParams);
  }

  @ApiOperation({ 
    summary: '?�로??경력 조회', 
    description: '?�원???�로??경력 ?�보�?조회?�니??' 
  })
  @ApiBody({ type: ProfileCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�로??경력 조회 ?�공',
    type: ApiResponseDto 
  })
  @Post('career/profile')
  async getProfileCareer(@Body() profileParams: ProfileCareerDto) {
    return await this.psmService.getProfileCareer(profileParams);
  }

  @ApiOperation({ 
    summary: '?�로??경력 조회 (GET)', 
    description: '?�원번호�??�로??경력 ?�보�?조회?�니??' 
  })
  @ApiParam({ name: 'empNo', description: '?�원번호' })
  @ApiResponse({ 
    status: 200, 
    description: '?�로??경력 조회 ?�공',
    type: ApiResponseDto 
  })
  @Get('career/profile/:empNo')
  async getProfileCareerByEmpNo(@Param('empNo') empNo: string) {
    return await this.psmService.getProfileCareer({ empNo });
  }



  @ApiOperation({ 
    summary: '본�?�?부??조회', 
    description: '본�? 코드???�당?�는 부??목록??조회?�니??' 
  })
  @ApiResponse({ 
    status: 200, 
    description: '본�?�?부??조회 ?�공',
    type: ApiResponseDto 
  })
  @Post('dept-by-hq')
  async getDeptByHq(@Body() body: any) {
    const paramString = `${body.searchType}|${body.includeAll}|${body.hqDivCd}`;
    return await this.psmService.getDeptByHq(paramString);
  }

  @ApiOperation({ 
    summary: '경력 계산 (?�로?��?)', 
    description: '?�로?��?�??�한 경력 계산???�행?�니??' 
  })
  @ApiBody({ type: CalculateCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '경력 계산 ?�공',
    type: ApiResponseDto 
  })
  @Post('career/calculate-proc')
  async calculateCareerByProc(@Body() careerParams: CalculateCareerDto) {
    return await this.psmService.calculateCareer(careerParams);
  }

  @ApiOperation({ 
    summary: '경력 ?�데?�트', 
    description: '?�원??경력 ?�보�??�데?�트?�니??' 
  })
  @ApiBody({ type: UpdateCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '경력 ?�데?�트 ?�공',
    type: ApiResponseDto 
  })
  @Post('career/update')
  async updateCareer(@Body() updateParams: UpdateCareerDto) {
    return await this.psmService.updateCareer(updateParams);
  }

  @ApiOperation({ 
    summary: '?�로??경력 조회 (?�로?��?)', 
    description: '?�로?��?�??�한 ?�로??경력 ?�보�?조회?�니??' 
  })
  @ApiBody({ type: ProfileCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�로??경력 조회 ?�공',
    type: ApiResponseDto 
  })
  @Post('career/profile-proc')
  async getProfileCareerByProc(@Body() profileParams: ProfileCareerDto) {
    return await this.psmService.getProfileCareer(profileParams);
  }

  @ApiOperation({ 
    summary: '기술?�급 ?�력 조회', 
    description: '?�원??기술?�급 ?�력??조회?�니??' 
  })
  @ApiBody({ type: TechnicalGradeHistoryDto })
  @ApiResponse({ 
    status: 200, 
    description: '기술?�급 ?�력 조회 ?�공',
    type: ApiResponseDto 
  })
  @Post('career/technical-grade-history')
  async getTechnicalGradeHistory(@Body() historyParams: TechnicalGradeHistoryDto) {
    return await this.psmService.getTechnicalGradeHistory(historyParams);
  }
  
  @ApiOperation({ 
    summary: '?�사발령?�역 조회', 
    description: '?�원???�사발령?�역??조회?�니??' 
  })
  @ApiBody({ type: SearchAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�사발령?�역 조회 ?�공',
    type: ApiResponseDto 
  })
  @Post('appointment/search')
  async searchAppointmentList(@Body() searchParams: SearchAppointmentDto) {
    return await this.psmService.searchAppointmentList(searchParams);
  }

  @ApiOperation({ 
    summary: '?�사발령 ?�??, 
    description: '?�사발령 ?�보�??�?�합?�다.' 
  })
  @ApiBody({ type: SaveAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�사발령 ?�???�공',
    type: ApiResponseDto 
  })
  @Post('appointment/save')
  async saveAppointment(@Body() saveParams: SaveAppointmentDto) {
    return await this.psmService.saveAppointment(saveParams);
  }

  @ApiOperation({ 
    summary: '?�사발령 ??��', 
    description: '?�사발령 ?�보�???��?�니??' 
  })
  @ApiBody({ type: DeleteAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�사발령 ??�� ?�공',
    type: ApiResponseDto 
  })
  @Post('appointment/delete')
  async deleteAppointment(@Body() deleteParams: DeleteAppointmentDto) {
    return await this.psmService.deleteAppointment(deleteParams);
  }

  @ApiOperation({ 
    summary: '?�사발령 ?�괄?�록', 
    description: '?�러 ?�원???�사발령???�괄 ?�록?�니??' 
  })
  @ApiBody({ type: BatchRegisterAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�사발령 ?�괄?�록 ?�공',
    type: ApiResponseDto 
  })
  @Post('appointment/batch-register')
  async batchRegisterAppointment(@Body() batchParams: BatchRegisterAppointmentDto) {
    return await this.psmService.batchRegisterAppointment(batchParams);
  }

  @ApiOperation({ 
    summary: '?�원 ?�보 ?�데?�트', 
    description: '?�원??기본 ?�보�??�데?�트?�니??' 
  })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�원 ?�보 ?�데?�트 ?�공',
    type: ApiResponseDto 
  })
  @Post('employee/update')
  async updateEmployee(@Body() updateParams: UpdateEmployeeDto) {
    return await this.psmService.updateEmployee(updateParams);
  }

  @ApiOperation({ 
    summary: '?�원 ?�보 ??��', 
    description: '?�원??모든 ?�보�???��?�니?? (AS-IS PSM_01_0113_D ?�로?��? ?�출)' 
  })
  @ApiBody({ type: DeleteEmployeeDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�원 ?�보 ??�� ?�공',
    type: ApiResponseDto 
  })
  @Post('employee/delete')
  async deleteEmployee(@Body() deleteParams: DeleteEmployeeDto) {
    return await this.psmService.deleteEmployee(deleteParams);
  }

  @ApiOperation({ 
    summary: '?�로??리스??조회', 
    description: '?�원??개발 ?�로??리스?��? 조회?�니??' 
  })
  @ApiBody({ type: ProfileListDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�로??리스??조회 ?�공',
    type: ApiResponseDto 
  })
  @Post('profile/list')
  async getProfileList(@Body() listParams: ProfileListDto) {
    return await this.psmService.getProfileList(listParams);
  }

  @ApiOperation({ 
    summary: '?�로???�록', 
    description: '?�로??개발 ?�로?�을 ?�록?�니??' 
  })
  @ApiBody({ type: ProfileInsertDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�로???�록 ?�공',
    type: ApiResponseDto 
  })
  @Post('profile/insert')
  async insertProfile(@Body() insertParams: ProfileInsertDto) {
    return await this.psmService.insertProfile(insertParams);
  }

  @ApiOperation({ 
    summary: '?�로???�정', 
    description: '기존 개발 ?�로?�을 ?�정?�니??' 
  })
  @ApiBody({ type: ProfileUpdateDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�로???�정 ?�공',
    type: ApiResponseDto 
  })
  @Post('profile/update')
  async updateProfile(@Body() updateParams: ProfileUpdateDto) {
    return await this.psmService.updateProfile(updateParams);
  }

  @ApiOperation({ 
    summary: '?�로????��', 
    description: '개발 ?�로?�을 ??��?�니??' 
  })
  @ApiBody({ type: ProfileDeleteDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�로????�� ?�공',
    type: ApiResponseDto 
  })
  @Post('profile/delete')
  async deleteProfile(@Body() deleteParams: ProfileDeleteDto) {
    return await this.psmService.deleteProfile(deleteParams);
  }

  @ApiOperation({ 
    summary: '?�로??경력 계산 ?�이??조회', 
    description: '?�로??기반 경력 계산 ?�이?��? 조회?�니?? (PSM_03_0131_S)' 
  })
  @ApiBody({ type: ProfileCarrCalcDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�로??경력 계산 ?�이??조회 ?�공',
    type: ApiResponseDto 
  })
  @Post('profile/carr-calc')
  async getProfileCarrCalc(@Body() calcParams: ProfileCarrCalcDto) {
    return await this.psmService.getProfileCarrCalc(calcParams);
  }




  @ApiOperation({ 
    summary: '?�원 ?�보 조회 (COM_02_0411_S)', 
    description: 'COM_02_0411_S ?�로?��?�??�용?�여 ?�원 ?�보�?조회?�니??' 
  })
  @ApiBody({ type: SearchEmployeesDto })
  @ApiResponse({ 
    status: 200, 
    description: '?�원 ?�보 조회 ?�공',
    type: ApiResponseDto 
  })
  @Post('employee/search-com')
  async searchEmployeesCom(@Body() searchParams: SearchEmployeesDto) {
    return await this.psmService.searchEmployeesCom(searchParams);
  }
}

