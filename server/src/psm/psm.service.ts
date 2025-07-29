/**
 * PSM (Personnel System Management) ?�비??
 * 
 * ?�사관�??�스?�의 ?�심 비즈?�스 로직??처리?�는 ?�비???�래?�입?�다.
 * Oracle PL/SQL ?�로?��?�??�출?�여 ?�원 ?�보, 경력, ?�사발령 ?�의 기능???�공?�니??
 * 
 * 주요 기능:
 * - ?�원 ?�보 관�?(검?? 조회, ?�록, ?�정, ??��)
 * - 경력 계산 �?관�?
 * - ?�사발령 관�?(개별/?�괄)
 * - 공통 코드 조회
 * 
 * @author BIST Development Team
 * @since 2024
 */
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { OracleService } from '../database/database.provider';
import {
  SearchEmployeesDto,
  EmployeeDetailDto,
  CalculateCareerDto,
  UpdateCareerDto,
  SaveAppointmentDto,
  DeleteAppointmentDto,
  BatchRegisterAppointmentDto,
  UpdateEmployeeDto,
  ProfileCareerDto,
  TechnicalGradeHistoryDto,
  SearchAppointmentDto,
  DeleteEmployeeDto,
  ProfileInsertDto,
  ProfileUpdateDto,
  ProfileDeleteDto,
  ProfileListDto,
  ProfileCarrCalcDto
} from './dto/psm.dto';

/**
 * PSM ?�비???��? ?�답 DTO
 * 
 * 모든 PSM API???�답 ?�식???��??�하�??�한 ?�네�??�래?�입?�다.
 * ?�공/?�패 ?��?, ?�이?? ?�류 메시지�??�함?�니??
 * 
 * @template T ?�답 ?�이?�의 ?�??
 */
export class PsmResponseDto<T = any> {
  @ApiProperty({ 
    description: '?�공 ?��?', 
    example: true 
  })
  success: boolean;

  @ApiProperty({ 
    description: '?�답 ?�이??, 
    required: false 
  })
  data?: T;

  @ApiProperty({ 
    description: '?�류 메시지', 
    example: '처리 �??�류가 발생?�습?�다.',
    required: false 
  })
  message?: string;
}

/**
 * PSM ?�비??구현 ?�래??
 * 
 * ?�사관�??�스?�의 모든 비즈?�스 로직??처리?�니??
 * Oracle PL/SQL ?�로?��?�??�해 ?�이?�베?�스?� ?�호?�용?�며,
 * ?�라?�언?�에�??��??�된 ?�답???�공?�니??
 * 
 * 주요 ?�징:
 * - AS-IS MXML ?�스?�과 ?�일???�로?��? ?�출
 * - ?�???�전?�을 ?�한 TypeScript DTO ?�용
 * - ?�합???�러 처리 �?로깅
 * - ?��??�된 ?�답 ?�식
 */
@Injectable()
export class PsmService {
  constructor(
    private readonly oracleService: OracleService
  ) {}

  /**
   * ?�원 검??
   */
  async searchEmployees(searchParams: SearchEmployeesDto): Promise<PsmResponseDto> {
    const { empNo, empNm, ownOutsDiv, hqDivCd, deptDivCd, dutyCd, retirYn } = searchParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0101_S', [
        empNo || 'ALL',
        empNm || '',
        ownOutsDiv || '1',
        hqDivCd || 'ALL',
        deptDivCd || 'ALL',
        dutyCd || 'ALL',
        retirYn || 'N'
      ]);
      
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�원 검??�??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�원 검??(COM_02_0411_S ?�로?��? ?�용)
   * AS-IS PSM_03_0110.mxml??fnSearchEmpInfo?�서 ?�출?�는 ?�로?��?
   */
  async searchEmployeesCom(searchParams: SearchEmployeesDto): Promise<PsmResponseDto> {
    const { empNo, empNm, ownOutsDiv, retirYn } = searchParams;
    
    // AS-IS?�서 ?�용?�는 ?�라미터 구조
    // I_KB: 조회구분 (1:직원번호, 2:직원�?
    // I_EMP_NO: 직원번호
    // I_EMP_NM: 직원�?
    // I_OWN_OUTS_DIV: ?�사?�주구분
    // I_RETIR_YN: ?�사?�포?�조?�유�?
    
    let kb = '1'; // 기본�? 직원번호�?검??
    if (empNm && empNm.trim() !== '') {
      kb = '2'; // 직원명으�?검??
    }
    
    try {
      // OracleService??executeProcedure ?�용
      const result = await this.oracleService.executeProcedure('COM_02_0411_S', [
        kb,                                    // I_KB: 조회구분
        empNo || '',                           // I_EMP_NO: 직원번호
        empNm || '',                           // I_EMP_NM: 직원�?
        ownOutsDiv || 'ALL',                   // I_OWN_OUTS_DIV: ?�사?�주구분
        retirYn || 'Y'                         // I_RETIR_YN: ?�사?�포?�조?�유�?
      ]);
      
      return {
        success: true,
        data: result.data,
        message: '?�원 ?�보 조회가 ?�공?�으�??�료?�었?�니??'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�원 ?�보 조회 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�원 ?�세 조회
   */
  async getEmployeeDetail(detailParams: EmployeeDetailDto): Promise<PsmResponseDto> {
    const { empNo } = detailParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0101_S', [empNo]);
      
      // 결과가 배열??경우 �?번째 ?�소 반환
      let resultData = result.data;
      if (Array.isArray(resultData) && resultData.length > 0) {
        resultData = resultData[0];
      }
      
      return {
        success: true,
        data: resultData
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�원 ?�세 조회 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�원 경력 계산
   * 
   * AS-IS MXML??PSM_01_0152_S ?�로?��?�??�출?�여 ?�원??경력??계산?�니??
   * ?�력기�? 경력�??�격기�? 경력??모두 계산?�며, ?�사/?�주 구분???�라 ?�른 로직???�용?�니??
   * 
   * @param careerParams 경력 계산???�요???�라미터
   * @returns 계산??경력 ?�보
   * 
   * @example
   * // ?�사 ?�원??경력 계산
   * const result = await calculateCareer({
   *   empNo: '10005',
   *   entrDt: '20200101',
   *   ownOutsDiv: '1'
   * });
   */
  async calculateCareer(careerParams: CalculateCareerDto): Promise<PsmResponseDto> {
    const { empNo, entrDt, fstInDt, lastEndDt, lastAdbgDivCd, ctqlCd, ctqlPurDt, ownOutsDiv } = careerParams;
    
    try {
      // OracleService??executeProcedure ?�용
      const result = await this.oracleService.executeProcedure('PSM_01_0152_S', [
        empNo,                    // I_EMP_NO: ?�원번호
        entrDt || '',            // I_ENTR_DT: ?�사?�자 (YYYYMMDD)
        fstInDt || '',           // I_FST_IN_DT: 최초?�입?�자 (YYYYMMDD)
        lastEndDt || '',         // I_LAST_END_DT: 최종철수?�자 (YYYYMMDD)
        lastAdbgDivCd || '',     // I_LAST_ADBG_DIV: 최종?�력구분코드
        ctqlCd || '',            // I_CTQL_CD: ?�격증코??
        ctqlPurDt || '',         // I_CTQL_PUR_DT: ?�격취득?�자 (YYYYMMDD)
        ownOutsDiv || '1',       // I_OWN_OUTS_DIV: ?�사?�주구분 (1:?�사, 2:?�주)
        ''                       // I_CARR_CALC_STND_DT: 경력계산기�??�자 (기본�? NULL)
      ]);
      
      // 결과가 배열??경우 �?번째 ?�소 반환
      let resultData = result.data;
      if (Array.isArray(resultData) && resultData.length > 0) {
        resultData = resultData[0];
      }
      
      return {
        success: true,
        data: resultData
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '경력 계산 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * 경력 ?�데?�트
   */
  async updateCareer(updateParams: UpdateCareerDto): Promise<PsmResponseDto> {
    const { 
      empNo, ownOutsDiv, ctqlCd, ctqlPurDt, fstInDt, lastEndDt, 
      carrCalcStndDt, carrDivCd, lastTcnGrd, carrMcnt, 
      adbgCarrMcnt, ctqlCarrMcnt, entrBefCtqlCarr, entrBefAdbgCarr, userId 
    } = updateParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0153_U', [
        empNo,
        ownOutsDiv,
        ctqlCd || '',
        ctqlPurDt || '',
        fstInDt || '',
        lastEndDt || '',
        carrCalcStndDt || '',
        carrDivCd || '1',
        lastTcnGrd || '',
        carrMcnt || '0',
        adbgCarrMcnt || '0',
        ctqlCarrMcnt || '0',
        entrBefAdbgCarr || '0',
        entrBefCtqlCarr || '0',
        userId || 'system'
      ]);
      
      // OUT ?�라미터 �??�인 - AS-IS MXML�??�일?�게 'ok'�??�작?�는지 ?�인
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          message: result.result || '?�로?��? ?�행 �??�류가 발생?�습?�다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '경력 ?�데?�트 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�사발령 ?�??
   */
  async saveAppointment(saveParams: SaveAppointmentDto): Promise<PsmResponseDto> {
    const { mode, empNo, seqNo, apntDiv, apntDt, hqDivCd, deptDivCd, dutyCd, rmk } = saveParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0132_T', [
        mode,
        empNo,
        mode === 'NEW' ? '' : (seqNo || ''),
        apntDiv,
        apntDt,
        hqDivCd,
        deptDivCd,
        dutyCd,
        rmk || '',
        'USER_ID'
      ]);
      
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          message: result.result
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�사발령 ?�??�??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�사발령 ??��
   */
  async deleteAppointment(deleteParams: DeleteAppointmentDto): Promise<PsmResponseDto> {
    const { empNo, seqNo } = deleteParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0133_D', [
        empNo,
        seqNo ? String(seqNo) : '',
        'USER_ID'
      ]);
      
      // AS-IS MXML�??�일?�게 'ok'�??�작?�는지 ?�인
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          message: result.result || '?�사발령 ??�� �??�류가 발생?�습?�다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�사발령 ??�� �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�사발령 ?�괄?�록
   */
  async batchRegisterAppointment(batchParams: BatchRegisterAppointmentDto): Promise<PsmResponseDto> {
    const { appointmentData, userId } = batchParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0141_T', [appointmentData, userId]);
      
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          message: result.result
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�사발령 ?�괄?�록 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�원 ?�보 ?�데?�트
   */
  async updateEmployee(updateParams: UpdateEmployeeDto): Promise<PsmResponseDto> {
    console.log('=== PSM Service updateEmployee ===');
    console.log('Update Params:', JSON.stringify(updateParams, null, 2));
    
    const { mode, ...employeeData } = updateParams;
    
    const procedureName = mode === 'NEW' ? 'PSM_01_1111_I' : 'PSM_01_1112_U';
    console.log('Procedure Name:', procedureName);

    try {
      const result = await this.oracleService.executeProcedure(procedureName, [
        employeeData.empNo || '',
        employeeData.ownOutsDiv || '',
        employeeData.entrCd || '',
        employeeData.empNm || '',
        employeeData.empEngNm || '',
        employeeData.resRegNo || '',
        employeeData.birYrMnDt || '',
        employeeData.sexDivCd || '',
        employeeData.ntltDivCd || '',
        employeeData.entrDt || '',
        employeeData.retirDt || '',
        employeeData.hqDivCd || '',
        employeeData.deptDivCd || '',
        employeeData.dutyCd || '',
        employeeData.lastTcnGrd || '',
        employeeData.emailAddr || '',
        employeeData.mobPhnNo || '',
        employeeData.homeTel || '',
        employeeData.homeZipNo || '',
        employeeData.homeAddr || '',
        employeeData.homeDetAddr || '',
        employeeData.lastInDt || '',
        employeeData.lastEndDt || '',
        employeeData.inTcnt || '',
        employeeData.lastAdbgDiv || '',
        employeeData.lastSchl || '',
        employeeData.majr || '',
        employeeData.lastGradDt || '',
        employeeData.ctqlCd || '',
        employeeData.ctqlPurDt || '',
        employeeData.carrMcnt || '',
        employeeData.wkgStDivCd || '',        
        employeeData.userId || '',
        employeeData.rmk || '',
        employeeData.kosaRegYn || '',
        employeeData.kosaRnwDt || '',
        employeeData.fstInDt || '',
        employeeData.entrBefCarr || '',
        employeeData.carrDivCd || '',
        employeeData.adbgCarrMcnt || '',
        employeeData.ctqlCarrMcnt || '',
        employeeData.carrCalcStndDt || '',
        employeeData.entrBefAdbgCarr || '',
        employeeData.entrBefCtqlCarr || '',
        employeeData.entrAftAdbgCarr || '',
        employeeData.entrAftCtqlCarr || ''
      ]);
      
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          message: result.result
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�원 ?�보 ?�데?�트 �??�류가 발생?�습?�다.'
      };
    }
  }



  /**
   * 본�?�?부??조회
   */
  async getDeptByHq(paramString: string): Promise<PsmResponseDto> {
    const [searchType, includeAll, hqDivCd] = paramString.split('|');
    
    try {
      const result = await this.oracleService.executeProcedure('COM_03_0201_S', [
        searchType || '2',
        includeAll || 'N',
        hqDivCd || 'ALL'
      ]);
      
      // 결과가 배열???�닌 경우 배열�?변??
      let data = result.data;
      if (!Array.isArray(data)) {
        if (data && typeof data === 'object') {
          data = [data];
        } else {
          data = [];
        }
      }
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '본�?�?부??조회 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�로??경력 조회
   */
  async getProfileCareer(profileParams: ProfileCareerDto): Promise<PsmResponseDto> {
    const { empNo } = profileParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0131_S', [empNo]);
      
      // 결과가 배열???�닌 경우 배열�?변??
      let data = result.data;
      if (!Array.isArray(data)) {
        if (data && typeof data === 'object') {
          data = [data];
        } else {
          data = [];
        }
      }
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�로??경력 조회 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * 기술?�급 ?�력 조회
   */
  async getTechnicalGradeHistory(historyParams: TechnicalGradeHistoryDto): Promise<PsmResponseDto> {
    const { empNo } = historyParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0161_S', [empNo]);
      
      // 결과가 배열???�닌 경우 배열�?변??
      let data = result.data;
      if (!Array.isArray(data)) {
        if (data && typeof data === 'object') {
          data = [data];
        } else {
          data = [];
        }
      }
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '기술?�급 ?�력 조회 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�사발령?�역 조회
   */
  async searchAppointmentList(searchParams: SearchAppointmentDto): Promise<PsmResponseDto> {
    const { empNo } = searchParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0131_S', [empNo]);
      
      // 결과가 배열???�닌 경우 배열�?변??
      let data = result.data;
      if (!Array.isArray(data)) {
        if (data && typeof data === 'object') {
          data = [data];
        } else {
          data = [];
        }
      }
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�사발령?�역 조회 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�원 ?�보 ??�� (AS-IS PSM_01_0113_D ?�로?��? ?�출)
   */
  async deleteEmployee(deleteParams: DeleteEmployeeDto): Promise<PsmResponseDto> {
    const { empNo, userId = 'system' } = deleteParams;
    
    console.log('=== AS-IS PSM_01_0113_D ?�로?��? ?�출 ===');
    console.log('?�원번호:', empNo);
    console.log('?�용?�ID:', userId);

    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0113_D', [empNo, userId]);
      
      // AS-IS?� ?�일: 'ok^?�원번호' ?�식???�답 처리
      const responseData = result.result;
      if (typeof responseData === 'string' && responseData.startsWith('ok^')) {
        const empNoFromResponse = responseData.substring(3); // 'ok^' ?�후???�원번호
        
        return {
          success: true,
          data: {
            empNo: empNoFromResponse,
            message: '?�원 ?�보가 ??��?�었?�니??'
          }
        };
      } else {
        return {
          success: false,
          message: responseData || '??�� 처리 �??�류가 발생?�습?�다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '??�� 처리 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�로??리스??조회
   */
  async getProfileList(listParams: ProfileListDto): Promise<PsmResponseDto> {
    const { empNo, userId } = listParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0111_S', [empNo]);
      
      return {
        success: true,
        data: result.data,
        message: '?�로??리스?��? ?�공?�으�?조회?�습?�다.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�로??리스??조회 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�로???�록
   */
  async insertProfile(insertParams: ProfileInsertDto): Promise<PsmResponseDto> {
    console.log('=== ?�로???�록 ?�라미터 ===');
    console.log('?�체 ?�라미터:', insertParams);
    
    const { empNo, strtDate, endDate, prjtNm, mmbrCo, delpEnvr, roleNm, taskNm, rmk, bsnNo, userId } = insertParams;
    
    console.log('taskNm �?', taskNm);
    
    // ?�로?��? ?�라미터 ?�서: O_RTN, I_REG_PATH, I_EMP_NO, I_BSN_NO, I_PRJT_NM, I_STRT_DT, I_END_DT, I_IN_MCNT, I_MMBR_CO, I_CHRG_WRK, I_ROLE_DIV_CD, I_DVLP_ENVR, I_RMK, I_USER_ID

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0112_I', [
        '2', // I_REG_PATH: ?�록경로 (2: ?�작?�등�?
        empNo, // I_EMP_NO: ?�원번호
        bsnNo || '', // I_BSN_NO: ?�업번호
        prjtNm, // I_PRJT_NM: ?�로?�트�?
        strtDate, // I_STRT_DT: ?�작?�자
        endDate, // I_END_DT: 종료?�자
        '', // I_IN_MCNT: ?�입개월??(?�동 계산??
        mmbrCo || '', // I_MMBR_CO: 고객??
        taskNm || '', // I_CHRG_WRK: ?�당?�무
        roleNm || '', // I_ROLE_DIV_CD: ??��구분코드
        delpEnvr || '', // I_DVLP_ENVR: 개발?�경
        rmk || '', // I_RMK: 비고
        userId || 'system' // I_USER_ID: ?�용??ID
      ]);
      
      // AS-IS MXML�??�일?�게 'ok'�??�작?�는지 ?�인
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '?�로?�이 ?�공?�으�??�록?�었?�니??'
        };
      } else {
        return {
          success: false,
          message: result.result || '?�로???�록 �??�류가 발생?�습?�다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�로???�록 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�로???�정
   */
  async updateProfile(updateParams: ProfileUpdateDto): Promise<PsmResponseDto> {
    console.log('=== ?�로???�정 ?�비??===');
    console.log('?�체 ?�라미터:', JSON.stringify(updateParams, null, 2));
    
    const { empNo, seqNo, strtDate, endDate, prjtNm, mmbrCo, delpEnvr, roleNm, taskNm, rmk, bsnNo, userId } = updateParams;

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0113_U', [
        empNo, // I_EMP_NO: ?�원번호
        seqNo, // I_SEQ_NO: ?�련번호
        bsnNo || '', // I_BSN_NO: ?�업번호
        prjtNm, // I_PRJT_NM: ?�로?�트�?
        strtDate, // I_STRT_DT: ?�작?�자
        endDate, // I_END_DT: 종료?�자
        '', // I_IN_MCNT: ?�입개월??(?�동 계산??
        mmbrCo || '', // I_MMBR_CO: 고객??
        taskNm || '', // I_CHRG_WRK: ?�당?�무
        roleNm || '', // I_ROLE_DIV_CD: ??��구분코드
        delpEnvr || '', // I_DVLP_ENVR: 개발?�경
        rmk || '', // I_RMK: 비고
        userId || 'system' // I_USER_ID: ?�용??ID
      ]);
      
      // AS-IS MXML�??�일?�게 'ok'�??�작?�는지 ?�인
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '?�로?�이 ?�공?�으�??�정?�었?�니??'
        };
      } else {
        return {
          success: false,
          message: result.result || '?�로???�정 �??�류가 발생?�습?�다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�로???�정 �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�로????��
   */
  async deleteProfile(deleteParams: ProfileDeleteDto): Promise<PsmResponseDto> {
    console.log('Delete Profile Service - Input params:', JSON.stringify(deleteParams, null, 2));
    const { empNo, seqNo, userId } = deleteParams;

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0114_D', [
        empNo, // I_EMP_NO: ?�원번호
        seqNo || '', // I_SEQ_NO: ?�련번호 (??�� 조건)
        userId || 'system' // I_USER_ID: ?�용??ID
      ]);
      
      // AS-IS MXML�??�일?�게 'ok'�??�작?�는지 ?�인
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '?�로?�이 ?�공?�으�???��?�었?�니??'
        };
      } else {
        return {
          success: false,
          message: result.result || '?�로????�� �??�류가 발생?�습?�다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�로????�� �??�류가 발생?�습?�다.'
      };
    }
  }

  /**
   * ?�로??경력 계산 ?�이??조회 (PSM_03_0131_S)
   * AS-IS fnSelectProfileCarr ?�수???�당
   */
  async getProfileCarrCalc(calcParams: ProfileCarrCalcDto): Promise<PsmResponseDto> {
    const { empNo, userId } = calcParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0131_S', [empNo]);
      
      return {
        success: true,
        data: result.data,
        message: '?�로??경력 계산 ?�이?��? ?�공?�으�?조회?�습?�다.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?�로??경력 계산 ?�이??조회 �??�류가 발생?�습?�다.'
      };
    }
  }



} 

