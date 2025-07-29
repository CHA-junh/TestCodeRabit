/**
 * PSM (Personnel System Management) 컨트롤러
 * 
 * 인사관리 시스템의 REST API 엔드포인트를 제공하는 컨트롤러입니다.
 * 클라이언트의 요청을 받아 PSM 서비스로 전달하고, 표준화된 응답을 반환합니다.
 * 
 * 주요 기능:
 * - 사원 정보 관리 API
 * - 경력 계산 및 관리 API
 * - 인사발령 관리 API
 * - 공통 코드 조회 API
 * 
 * 모든 API는 Swagger 문서화가 되어 있으며, 표준화된 응답 형식을 사용합니다.
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

@ApiTags('PSM - 인사관리')
@Controller('psm')
export class PsmController {
  constructor(
    private readonly psmService: PsmService
  ) {}

  @ApiOperation({ 
    summary: '사원 검색', 
    description: '조건에 맞는 사원 목록을 검색합니다.' 
  })
  @ApiBody({ type: SearchEmployeesDto })
  @ApiResponse({ 
    status: 200, 
    description: '사원 검색 성공',
    type: ApiResponseDto 
  })
  @Post('employee/search')
  async searchEmployees(@Body() searchParams: SearchEmployeesDto) {
    return await this.psmService.searchEmployees(searchParams);
  }

  @ApiOperation({ 
    summary: '사원 상세 조회', 
    description: '특정 사원의 상세 정보를 조회합니다.' 
  })
  @ApiBody({ type: EmployeeDetailDto })
  @ApiResponse({ 
    status: 200, 
    description: '사원 상세 조회 성공',
    type: ApiResponseDto 
  })
  @Post('employee/detail')
  async getEmployeeDetail(@Body() detailParams: EmployeeDetailDto) {
    return await this.psmService.getEmployeeDetail(detailParams);
  }

  @ApiOperation({ 
    summary: '경력 계산', 
    description: '사원의 경력을 계산합니다.' 
  })
  @ApiBody({ type: CalculateCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '경력 계산 성공',
    type: ApiResponseDto 
  })
  @Post('career/calculate')
  async calculateCareer(@Body() careerParams: CalculateCareerDto) {
    return await this.psmService.calculateCareer(careerParams);
  }

  @ApiOperation({ 
    summary: '프로필 경력 조회', 
    description: '사원의 프로필 경력 정보를 조회합니다.' 
  })
  @ApiBody({ type: ProfileCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '프로필 경력 조회 성공',
    type: ApiResponseDto 
  })
  @Post('career/profile')
  async getProfileCareer(@Body() profileParams: ProfileCareerDto) {
    return await this.psmService.getProfileCareer(profileParams);
  }

  @ApiOperation({ 
    summary: '프로필 경력 조회 (GET)', 
    description: '사원번호로 프로필 경력 정보를 조회합니다.' 
  })
  @ApiParam({ name: 'empNo', description: '사원번호' })
  @ApiResponse({ 
    status: 200, 
    description: '프로필 경력 조회 성공',
    type: ApiResponseDto 
  })
  @Get('career/profile/:empNo')
  async getProfileCareerByEmpNo(@Param('empNo') empNo: string) {
    return await this.psmService.getProfileCareer({ empNo });
  }



  @ApiOperation({ 
    summary: '본부별 부서 조회', 
    description: '본부 코드에 해당하는 부서 목록을 조회합니다.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: '본부별 부서 조회 성공',
    type: ApiResponseDto 
  })
  @Post('dept-by-hq')
  async getDeptByHq(@Body() body: any) {
    const paramString = `${body.searchType}|${body.includeAll}|${body.hqDivCd}`;
    return await this.psmService.getDeptByHq(paramString);
  }

  @ApiOperation({ 
    summary: '경력 계산 (프로시저)', 
    description: '프로시저를 통한 경력 계산을 수행합니다.' 
  })
  @ApiBody({ type: CalculateCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '경력 계산 성공',
    type: ApiResponseDto 
  })
  @Post('career/calculate-proc')
  async calculateCareerByProc(@Body() careerParams: CalculateCareerDto) {
    return await this.psmService.calculateCareer(careerParams);
  }

  @ApiOperation({ 
    summary: '경력 업데이트', 
    description: '사원의 경력 정보를 업데이트합니다.' 
  })
  @ApiBody({ type: UpdateCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '경력 업데이트 성공',
    type: ApiResponseDto 
  })
  @Post('career/update')
  async updateCareer(@Body() updateParams: UpdateCareerDto) {
    return await this.psmService.updateCareer(updateParams);
  }

  @ApiOperation({ 
    summary: '프로필 경력 조회 (프로시저)', 
    description: '프로시저를 통한 프로필 경력 정보를 조회합니다.' 
  })
  @ApiBody({ type: ProfileCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '프로필 경력 조회 성공',
    type: ApiResponseDto 
  })
  @Post('career/profile-proc')
  async getProfileCareerByProc(@Body() profileParams: ProfileCareerDto) {
    return await this.psmService.getProfileCareer(profileParams);
  }

  @ApiOperation({ 
    summary: '기술등급 이력 조회', 
    description: '사원의 기술등급 이력을 조회합니다.' 
  })
  @ApiBody({ type: TechnicalGradeHistoryDto })
  @ApiResponse({ 
    status: 200, 
    description: '기술등급 이력 조회 성공',
    type: ApiResponseDto 
  })
  @Post('career/technical-grade-history')
  async getTechnicalGradeHistory(@Body() historyParams: TechnicalGradeHistoryDto) {
    return await this.psmService.getTechnicalGradeHistory(historyParams);
  }
  
  @ApiOperation({ 
    summary: '인사발령내역 조회', 
    description: '사원의 인사발령내역을 조회합니다.' 
  })
  @ApiBody({ type: SearchAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '인사발령내역 조회 성공',
    type: ApiResponseDto 
  })
  @Post('appointment/search')
  async searchAppointmentList(@Body() searchParams: SearchAppointmentDto) {
    return await this.psmService.searchAppointmentList(searchParams);
  }

  @ApiOperation({ 
    summary: '인사발령 저장', 
    description: '인사발령 정보를 저장합니다.' 
  })
  @ApiBody({ type: SaveAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '인사발령 저장 성공',
    type: ApiResponseDto 
  })
  @Post('appointment/save')
  async saveAppointment(@Body() saveParams: SaveAppointmentDto) {
    return await this.psmService.saveAppointment(saveParams);
  }

  @ApiOperation({ 
    summary: '인사발령 삭제', 
    description: '인사발령 정보를 삭제합니다.' 
  })
  @ApiBody({ type: DeleteAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '인사발령 삭제 성공',
    type: ApiResponseDto 
  })
  @Post('appointment/delete')
  async deleteAppointment(@Body() deleteParams: DeleteAppointmentDto) {
    return await this.psmService.deleteAppointment(deleteParams);
  }

  @ApiOperation({ 
    summary: '인사발령 일괄등록', 
    description: '여러 사원의 인사발령을 일괄 등록합니다.' 
  })
  @ApiBody({ type: BatchRegisterAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '인사발령 일괄등록 성공',
    type: ApiResponseDto 
  })
  @Post('appointment/batch-register')
  async batchRegisterAppointment(@Body() batchParams: BatchRegisterAppointmentDto) {
    return await this.psmService.batchRegisterAppointment(batchParams);
  }

  @ApiOperation({ 
    summary: '사원 정보 업데이트', 
    description: '사원의 기본 정보를 업데이트합니다.' 
  })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({ 
    status: 200, 
    description: '사원 정보 업데이트 성공',
    type: ApiResponseDto 
  })
  @Post('employee/update')
  async updateEmployee(@Body() updateParams: UpdateEmployeeDto) {
    return await this.psmService.updateEmployee(updateParams);
  }

  @ApiOperation({ 
    summary: '사원 정보 삭제', 
    description: '사원의 모든 정보를 삭제합니다. (AS-IS PSM_01_0113_D 프로시저 호출)' 
  })
  @ApiBody({ type: DeleteEmployeeDto })
  @ApiResponse({ 
    status: 200, 
    description: '사원 정보 삭제 성공',
    type: ApiResponseDto 
  })
  @Post('employee/delete')
  async deleteEmployee(@Body() deleteParams: DeleteEmployeeDto) {
    return await this.psmService.deleteEmployee(deleteParams);
  }

  @ApiOperation({ 
    summary: '프로필 리스트 조회', 
    description: '사원의 개발 프로필 리스트를 조회합니다.' 
  })
  @ApiBody({ type: ProfileListDto })
  @ApiResponse({ 
    status: 200, 
    description: '프로필 리스트 조회 성공',
    type: ApiResponseDto 
  })
  @Post('profile/list')
  async getProfileList(@Body() listParams: ProfileListDto) {
    return await this.psmService.getProfileList(listParams);
  }

  @ApiOperation({ 
    summary: '프로필 등록', 
    description: '새로운 개발 프로필을 등록합니다.' 
  })
  @ApiBody({ type: ProfileInsertDto })
  @ApiResponse({ 
    status: 200, 
    description: '프로필 등록 성공',
    type: ApiResponseDto 
  })
  @Post('profile/insert')
  async insertProfile(@Body() insertParams: ProfileInsertDto) {
    return await this.psmService.insertProfile(insertParams);
  }

  @ApiOperation({ 
    summary: '프로필 수정', 
    description: '기존 개발 프로필을 수정합니다.' 
  })
  @ApiBody({ type: ProfileUpdateDto })
  @ApiResponse({ 
    status: 200, 
    description: '프로필 수정 성공',
    type: ApiResponseDto 
  })
  @Post('profile/update')
  async updateProfile(@Body() updateParams: ProfileUpdateDto) {
    return await this.psmService.updateProfile(updateParams);
  }

  @ApiOperation({ 
    summary: '프로필 삭제', 
    description: '개발 프로필을 삭제합니다.' 
  })
  @ApiBody({ type: ProfileDeleteDto })
  @ApiResponse({ 
    status: 200, 
    description: '프로필 삭제 성공',
    type: ApiResponseDto 
  })
  @Post('profile/delete')
  async deleteProfile(@Body() deleteParams: ProfileDeleteDto) {
    return await this.psmService.deleteProfile(deleteParams);
  }

  @ApiOperation({ 
    summary: '프로필 경력 계산 데이터 조회', 
    description: '프로필 기반 경력 계산 데이터를 조회합니다. (PSM_03_0131_S)' 
  })
  @ApiBody({ type: ProfileCarrCalcDto })
  @ApiResponse({ 
    status: 200, 
    description: '프로필 경력 계산 데이터 조회 성공',
    type: ApiResponseDto 
  })
  @Post('profile/carr-calc')
  async getProfileCarrCalc(@Body() calcParams: ProfileCarrCalcDto) {
    return await this.psmService.getProfileCarrCalc(calcParams);
  }




  @ApiOperation({ 
    summary: '사원 정보 조회 (COM_02_0411_S)', 
    description: 'COM_02_0411_S 프로시저를 사용하여 사원 정보를 조회합니다.' 
  })
  @ApiBody({ type: SearchEmployeesDto })
  @ApiResponse({ 
    status: 200, 
    description: '사원 정보 조회 성공',
    type: ApiResponseDto 
  })
  @Post('employee/search-com')
  async searchEmployeesCom(@Body() searchParams: SearchEmployeesDto) {
    return await this.psmService.searchEmployeesCom(searchParams);
  }
}