/**
 * PSM (Personnel System Management) ì»¨íŠ¸ë¡¤ëŸ¬
 * 
 * ?¸ì‚¬ê´€ë¦??œìŠ¤?œì˜ REST API ?”ë“œ?¬ì¸?¸ë? ?œê³µ?˜ëŠ” ì»¨íŠ¸ë¡¤ëŸ¬?…ë‹ˆ??
 * ?´ë¼?´ì–¸?¸ì˜ ?”ì²­??ë°›ì•„ PSM ?œë¹„?¤ë¡œ ?„ë‹¬?˜ê³ , ?œì??”ëœ ?‘ë‹µ??ë°˜í™˜?©ë‹ˆ??
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ì› ?•ë³´ ê´€ë¦?API
 * - ê²½ë ¥ ê³„ì‚° ë°?ê´€ë¦?API
 * - ?¸ì‚¬ë°œë ¹ ê´€ë¦?API
 * - ê³µí†µ ì½”ë“œ ì¡°íšŒ API
 * 
 * ëª¨ë“  API??Swagger ë¬¸ì„œ?”ê? ?˜ì–´ ?ˆìœ¼ë©? ?œì??”ëœ ?‘ë‹µ ?•ì‹???¬ìš©?©ë‹ˆ??
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

@ApiTags('PSM - ?¸ì‚¬ê´€ë¦?)
@Controller('psm')
export class PsmController {
  constructor(
    private readonly psmService: PsmService
  ) {}

  @ApiOperation({ 
    summary: '?¬ì› ê²€??, 
    description: 'ì¡°ê±´??ë§ëŠ” ?¬ì› ëª©ë¡??ê²€?‰í•©?ˆë‹¤.' 
  })
  @ApiBody({ type: SearchEmployeesDto })
  @ApiResponse({ 
    status: 200, 
    description: '?¬ì› ê²€???±ê³µ',
    type: ApiResponseDto 
  })
  @Post('employee/search')
  async searchEmployees(@Body() searchParams: SearchEmployeesDto) {
    return await this.psmService.searchEmployees(searchParams);
  }

  @ApiOperation({ 
    summary: '?¬ì› ?ì„¸ ì¡°íšŒ', 
    description: '?¹ì • ?¬ì›???ì„¸ ?•ë³´ë¥?ì¡°íšŒ?©ë‹ˆ??' 
  })
  @ApiBody({ type: EmployeeDetailDto })
  @ApiResponse({ 
    status: 200, 
    description: '?¬ì› ?ì„¸ ì¡°íšŒ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('employee/detail')
  async getEmployeeDetail(@Body() detailParams: EmployeeDetailDto) {
    return await this.psmService.getEmployeeDetail(detailParams);
  }

  @ApiOperation({ 
    summary: 'ê²½ë ¥ ê³„ì‚°', 
    description: '?¬ì›??ê²½ë ¥??ê³„ì‚°?©ë‹ˆ??' 
  })
  @ApiBody({ type: CalculateCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: 'ê²½ë ¥ ê³„ì‚° ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('career/calculate')
  async calculateCareer(@Body() careerParams: CalculateCareerDto) {
    return await this.psmService.calculateCareer(careerParams);
  }

  @ApiOperation({ 
    summary: '?„ë¡œ??ê²½ë ¥ ì¡°íšŒ', 
    description: '?¬ì›???„ë¡œ??ê²½ë ¥ ?•ë³´ë¥?ì¡°íšŒ?©ë‹ˆ??' 
  })
  @ApiBody({ type: ProfileCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '?„ë¡œ??ê²½ë ¥ ì¡°íšŒ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('career/profile')
  async getProfileCareer(@Body() profileParams: ProfileCareerDto) {
    return await this.psmService.getProfileCareer(profileParams);
  }

  @ApiOperation({ 
    summary: '?„ë¡œ??ê²½ë ¥ ì¡°íšŒ (GET)', 
    description: '?¬ì›ë²ˆí˜¸ë¡??„ë¡œ??ê²½ë ¥ ?•ë³´ë¥?ì¡°íšŒ?©ë‹ˆ??' 
  })
  @ApiParam({ name: 'empNo', description: '?¬ì›ë²ˆí˜¸' })
  @ApiResponse({ 
    status: 200, 
    description: '?„ë¡œ??ê²½ë ¥ ì¡°íšŒ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Get('career/profile/:empNo')
  async getProfileCareerByEmpNo(@Param('empNo') empNo: string) {
    return await this.psmService.getProfileCareer({ empNo });
  }



  @ApiOperation({ 
    summary: 'ë³¸ë?ë³?ë¶€??ì¡°íšŒ', 
    description: 'ë³¸ë? ì½”ë“œ???´ë‹¹?˜ëŠ” ë¶€??ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'ë³¸ë?ë³?ë¶€??ì¡°íšŒ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('dept-by-hq')
  async getDeptByHq(@Body() body: any) {
    const paramString = `${body.searchType}|${body.includeAll}|${body.hqDivCd}`;
    return await this.psmService.getDeptByHq(paramString);
  }

  @ApiOperation({ 
    summary: 'ê²½ë ¥ ê³„ì‚° (?„ë¡œ?œì?)', 
    description: '?„ë¡œ?œì?ë¥??µí•œ ê²½ë ¥ ê³„ì‚°???˜í–‰?©ë‹ˆ??' 
  })
  @ApiBody({ type: CalculateCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: 'ê²½ë ¥ ê³„ì‚° ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('career/calculate-proc')
  async calculateCareerByProc(@Body() careerParams: CalculateCareerDto) {
    return await this.psmService.calculateCareer(careerParams);
  }

  @ApiOperation({ 
    summary: 'ê²½ë ¥ ?…ë°?´íŠ¸', 
    description: '?¬ì›??ê²½ë ¥ ?•ë³´ë¥??…ë°?´íŠ¸?©ë‹ˆ??' 
  })
  @ApiBody({ type: UpdateCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: 'ê²½ë ¥ ?…ë°?´íŠ¸ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('career/update')
  async updateCareer(@Body() updateParams: UpdateCareerDto) {
    return await this.psmService.updateCareer(updateParams);
  }

  @ApiOperation({ 
    summary: '?„ë¡œ??ê²½ë ¥ ì¡°íšŒ (?„ë¡œ?œì?)', 
    description: '?„ë¡œ?œì?ë¥??µí•œ ?„ë¡œ??ê²½ë ¥ ?•ë³´ë¥?ì¡°íšŒ?©ë‹ˆ??' 
  })
  @ApiBody({ type: ProfileCareerDto })
  @ApiResponse({ 
    status: 200, 
    description: '?„ë¡œ??ê²½ë ¥ ì¡°íšŒ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('career/profile-proc')
  async getProfileCareerByProc(@Body() profileParams: ProfileCareerDto) {
    return await this.psmService.getProfileCareer(profileParams);
  }

  @ApiOperation({ 
    summary: 'ê¸°ìˆ ?±ê¸‰ ?´ë ¥ ì¡°íšŒ', 
    description: '?¬ì›??ê¸°ìˆ ?±ê¸‰ ?´ë ¥??ì¡°íšŒ?©ë‹ˆ??' 
  })
  @ApiBody({ type: TechnicalGradeHistoryDto })
  @ApiResponse({ 
    status: 200, 
    description: 'ê¸°ìˆ ?±ê¸‰ ?´ë ¥ ì¡°íšŒ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('career/technical-grade-history')
  async getTechnicalGradeHistory(@Body() historyParams: TechnicalGradeHistoryDto) {
    return await this.psmService.getTechnicalGradeHistory(historyParams);
  }
  
  @ApiOperation({ 
    summary: '?¸ì‚¬ë°œë ¹?´ì—­ ì¡°íšŒ', 
    description: '?¬ì›???¸ì‚¬ë°œë ¹?´ì—­??ì¡°íšŒ?©ë‹ˆ??' 
  })
  @ApiBody({ type: SearchAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '?¸ì‚¬ë°œë ¹?´ì—­ ì¡°íšŒ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('appointment/search')
  async searchAppointmentList(@Body() searchParams: SearchAppointmentDto) {
    return await this.psmService.searchAppointmentList(searchParams);
  }

  @ApiOperation({ 
    summary: '?¸ì‚¬ë°œë ¹ ?€??, 
    description: '?¸ì‚¬ë°œë ¹ ?•ë³´ë¥??€?¥í•©?ˆë‹¤.' 
  })
  @ApiBody({ type: SaveAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '?¸ì‚¬ë°œë ¹ ?€???±ê³µ',
    type: ApiResponseDto 
  })
  @Post('appointment/save')
  async saveAppointment(@Body() saveParams: SaveAppointmentDto) {
    return await this.psmService.saveAppointment(saveParams);
  }

  @ApiOperation({ 
    summary: '?¸ì‚¬ë°œë ¹ ?? œ', 
    description: '?¸ì‚¬ë°œë ¹ ?•ë³´ë¥??? œ?©ë‹ˆ??' 
  })
  @ApiBody({ type: DeleteAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '?¸ì‚¬ë°œë ¹ ?? œ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('appointment/delete')
  async deleteAppointment(@Body() deleteParams: DeleteAppointmentDto) {
    return await this.psmService.deleteAppointment(deleteParams);
  }

  @ApiOperation({ 
    summary: '?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡', 
    description: '?¬ëŸ¬ ?¬ì›???¸ì‚¬ë°œë ¹???¼ê´„ ?±ë¡?©ë‹ˆ??' 
  })
  @ApiBody({ type: BatchRegisterAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: '?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('appointment/batch-register')
  async batchRegisterAppointment(@Body() batchParams: BatchRegisterAppointmentDto) {
    return await this.psmService.batchRegisterAppointment(batchParams);
  }

  @ApiOperation({ 
    summary: '?¬ì› ?•ë³´ ?…ë°?´íŠ¸', 
    description: '?¬ì›??ê¸°ë³¸ ?•ë³´ë¥??…ë°?´íŠ¸?©ë‹ˆ??' 
  })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({ 
    status: 200, 
    description: '?¬ì› ?•ë³´ ?…ë°?´íŠ¸ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('employee/update')
  async updateEmployee(@Body() updateParams: UpdateEmployeeDto) {
    return await this.psmService.updateEmployee(updateParams);
  }

  @ApiOperation({ 
    summary: '?¬ì› ?•ë³´ ?? œ', 
    description: '?¬ì›??ëª¨ë“  ?•ë³´ë¥??? œ?©ë‹ˆ?? (AS-IS PSM_01_0113_D ?„ë¡œ?œì? ?¸ì¶œ)' 
  })
  @ApiBody({ type: DeleteEmployeeDto })
  @ApiResponse({ 
    status: 200, 
    description: '?¬ì› ?•ë³´ ?? œ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('employee/delete')
  async deleteEmployee(@Body() deleteParams: DeleteEmployeeDto) {
    return await this.psmService.deleteEmployee(deleteParams);
  }

  @ApiOperation({ 
    summary: '?„ë¡œ??ë¦¬ìŠ¤??ì¡°íšŒ', 
    description: '?¬ì›??ê°œë°œ ?„ë¡œ??ë¦¬ìŠ¤?¸ë? ì¡°íšŒ?©ë‹ˆ??' 
  })
  @ApiBody({ type: ProfileListDto })
  @ApiResponse({ 
    status: 200, 
    description: '?„ë¡œ??ë¦¬ìŠ¤??ì¡°íšŒ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('profile/list')
  async getProfileList(@Body() listParams: ProfileListDto) {
    return await this.psmService.getProfileList(listParams);
  }

  @ApiOperation({ 
    summary: '?„ë¡œ???±ë¡', 
    description: '?ˆë¡œ??ê°œë°œ ?„ë¡œ?„ì„ ?±ë¡?©ë‹ˆ??' 
  })
  @ApiBody({ type: ProfileInsertDto })
  @ApiResponse({ 
    status: 200, 
    description: '?„ë¡œ???±ë¡ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('profile/insert')
  async insertProfile(@Body() insertParams: ProfileInsertDto) {
    return await this.psmService.insertProfile(insertParams);
  }

  @ApiOperation({ 
    summary: '?„ë¡œ???˜ì •', 
    description: 'ê¸°ì¡´ ê°œë°œ ?„ë¡œ?„ì„ ?˜ì •?©ë‹ˆ??' 
  })
  @ApiBody({ type: ProfileUpdateDto })
  @ApiResponse({ 
    status: 200, 
    description: '?„ë¡œ???˜ì • ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('profile/update')
  async updateProfile(@Body() updateParams: ProfileUpdateDto) {
    return await this.psmService.updateProfile(updateParams);
  }

  @ApiOperation({ 
    summary: '?„ë¡œ???? œ', 
    description: 'ê°œë°œ ?„ë¡œ?„ì„ ?? œ?©ë‹ˆ??' 
  })
  @ApiBody({ type: ProfileDeleteDto })
  @ApiResponse({ 
    status: 200, 
    description: '?„ë¡œ???? œ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('profile/delete')
  async deleteProfile(@Body() deleteParams: ProfileDeleteDto) {
    return await this.psmService.deleteProfile(deleteParams);
  }

  @ApiOperation({ 
    summary: '?„ë¡œ??ê²½ë ¥ ê³„ì‚° ?°ì´??ì¡°íšŒ', 
    description: '?„ë¡œ??ê¸°ë°˜ ê²½ë ¥ ê³„ì‚° ?°ì´?°ë? ì¡°íšŒ?©ë‹ˆ?? (PSM_03_0131_S)' 
  })
  @ApiBody({ type: ProfileCarrCalcDto })
  @ApiResponse({ 
    status: 200, 
    description: '?„ë¡œ??ê²½ë ¥ ê³„ì‚° ?°ì´??ì¡°íšŒ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('profile/carr-calc')
  async getProfileCarrCalc(@Body() calcParams: ProfileCarrCalcDto) {
    return await this.psmService.getProfileCarrCalc(calcParams);
  }




  @ApiOperation({ 
    summary: '?¬ì› ?•ë³´ ì¡°íšŒ (COM_02_0411_S)', 
    description: 'COM_02_0411_S ?„ë¡œ?œì?ë¥??¬ìš©?˜ì—¬ ?¬ì› ?•ë³´ë¥?ì¡°íšŒ?©ë‹ˆ??' 
  })
  @ApiBody({ type: SearchEmployeesDto })
  @ApiResponse({ 
    status: 200, 
    description: '?¬ì› ?•ë³´ ì¡°íšŒ ?±ê³µ',
    type: ApiResponseDto 
  })
  @Post('employee/search-com')
  async searchEmployeesCom(@Body() searchParams: SearchEmployeesDto) {
    return await this.psmService.searchEmployeesCom(searchParams);
  }
}

