/**
 * PSM (Personnel System Management) 서비스
 * 
 * 인사관리 시스템의 핵심 비즈니스 로직을 처리하는 서비스 클래스입니다.
 * Oracle PL/SQL 프로시저를 호출하여 사원 정보, 경력, 인사발령 등의 기능을 제공합니다.
 * 
 * 주요 기능:
 * - 사원 정보 관리 (검색, 조회, 등록, 수정, 삭제)
 * - 경력 계산 및 관리
 * - 인사발령 관리 (개별/일괄)
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
 * PSM 서비스 표준 응답 DTO
 * 
 * 모든 PSM API의 응답 형식을 표준화하기 위한 제네릭 클래스입니다.
 * 성공/실패 여부, 데이터, 오류 메시지를 포함합니다.
 * 
 * @template T 응답 데이터의 타입
 */
export class PsmResponseDto<T = any> {
  @ApiProperty({ 
    description: '성공 여부', 
    example: true 
  })
  success: boolean;

  @ApiProperty({ 
    description: '응답 데이터', 
    required: false 
  })
  data?: T;

  @ApiProperty({ 
    description: '오류 메시지', 
    example: '처리 중 오류가 발생했습니다.',
    required: false 
  })
  message?: string;
}

/**
 * PSM 서비스 구현 클래스
 * 
 * 인사관리 시스템의 모든 비즈니스 로직을 처리합니다.
 * Oracle PL/SQL 프로시저를 통해 데이터베이스와 상호작용하며,
 * 클라이언트에게 표준화된 응답을 제공합니다.
 * 
 * 주요 특징:
 * - AS-IS MXML 시스템과 동일한 프로시저 호출
 * - 타입 안전성을 위한 TypeScript DTO 활용
 * - 통합된 에러 처리 및 로깅
 * - 표준화된 응답 형식
 */
@Injectable()
export class PsmService {
  constructor(
    private readonly oracleService: OracleService
  ) {}

  /**
   * 사원 검색
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
        message: error.message || '사원 검색 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 사원 검색 (COM_02_0411_S 프로시저 사용)
   * AS-IS PSM_03_0110.mxml의 fnSearchEmpInfo에서 호출하는 프로시저
   */
  async searchEmployeesCom(searchParams: SearchEmployeesDto): Promise<PsmResponseDto> {
    const { empNo, empNm, ownOutsDiv, retirYn } = searchParams;
    
    // AS-IS에서 사용하는 파라미터 구조
    // I_KB: 조회구분 (1:직원번호, 2:직원명)
    // I_EMP_NO: 직원번호
    // I_EMP_NM: 직원명
    // I_OWN_OUTS_DIV: 자사외주구분
    // I_RETIR_YN: 퇴사자포함조회유무
    
    let kb = '1'; // 기본값: 직원번호로 검색
    if (empNm && empNm.trim() !== '') {
      kb = '2'; // 직원명으로 검색
    }
    
    try {
      // OracleService의 executeProcedure 사용
      const result = await this.oracleService.executeProcedure('COM_02_0411_S', [
        kb,                                    // I_KB: 조회구분
        empNo || '',                           // I_EMP_NO: 직원번호
        empNm || '',                           // I_EMP_NM: 직원명
        ownOutsDiv || 'ALL',                   // I_OWN_OUTS_DIV: 자사외주구분
        retirYn || 'Y'                         // I_RETIR_YN: 퇴사자포함조회유무
      ]);
      
      return {
        success: true,
        data: result.data,
        message: '사원 정보 조회가 성공적으로 완료되었습니다.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '사원 정보 조회 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 사원 상세 조회
   */
  async getEmployeeDetail(detailParams: EmployeeDetailDto): Promise<PsmResponseDto> {
    const { empNo } = detailParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0101_S', [empNo]);
      
      // 결과가 배열인 경우 첫 번째 요소 반환
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
        message: error.message || '사원 상세 조회 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 사원 경력 계산
   * 
   * AS-IS MXML의 PSM_01_0152_S 프로시저를 호출하여 사원의 경력을 계산합니다.
   * 학력기준 경력과 자격기준 경력을 모두 계산하며, 자사/외주 구분에 따라 다른 로직을 적용합니다.
   * 
   * @param careerParams 경력 계산에 필요한 파라미터
   * @returns 계산된 경력 정보
   * 
   * @example
   * // 자사 사원의 경력 계산
   * const result = await calculateCareer({
   *   empNo: '10005',
   *   entrDt: '20200101',
   *   ownOutsDiv: '1'
   * });
   */
  async calculateCareer(careerParams: CalculateCareerDto): Promise<PsmResponseDto> {
    const { empNo, entrDt, fstInDt, lastEndDt, lastAdbgDivCd, ctqlCd, ctqlPurDt, ownOutsDiv } = careerParams;
    
    try {
      // OracleService의 executeProcedure 사용
      const result = await this.oracleService.executeProcedure('PSM_01_0152_S', [
        empNo,                    // I_EMP_NO: 사원번호
        entrDt || '',            // I_ENTR_DT: 입사일자 (YYYYMMDD)
        fstInDt || '',           // I_FST_IN_DT: 최초투입일자 (YYYYMMDD)
        lastEndDt || '',         // I_LAST_END_DT: 최종철수일자 (YYYYMMDD)
        lastAdbgDivCd || '',     // I_LAST_ADBG_DIV: 최종학력구분코드
        ctqlCd || '',            // I_CTQL_CD: 자격증코드
        ctqlPurDt || '',         // I_CTQL_PUR_DT: 자격취득일자 (YYYYMMDD)
        ownOutsDiv || '1',       // I_OWN_OUTS_DIV: 자사외주구분 (1:자사, 2:외주)
        ''                       // I_CARR_CALC_STND_DT: 경력계산기준일자 (기본값: NULL)
      ]);
      
      // 결과가 배열인 경우 첫 번째 요소 반환
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
        message: error.message || '경력 계산 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 경력 업데이트
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
      
      // OUT 파라미터 값 확인 - AS-IS MXML과 동일하게 'ok'로 시작하는지 확인
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          message: result.result || '프로시저 실행 중 오류가 발생했습니다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '경력 업데이트 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 인사발령 저장
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
        message: error.message || '인사발령 저장 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 인사발령 삭제
   */
  async deleteAppointment(deleteParams: DeleteAppointmentDto): Promise<PsmResponseDto> {
    const { empNo, seqNo } = deleteParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0133_D', [
        empNo,
        seqNo ? String(seqNo) : '',
        'USER_ID'
      ]);
      
      // AS-IS MXML과 동일하게 'ok'로 시작하는지 확인
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          message: result.result || '인사발령 삭제 중 오류가 발생했습니다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '인사발령 삭제 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 인사발령 일괄등록
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
        message: error.message || '인사발령 일괄등록 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 사원 정보 업데이트
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
        message: error.message || '사원 정보 업데이트 중 오류가 발생했습니다.'
      };
    }
  }



  /**
   * 본부별 부서 조회
   */
  async getDeptByHq(paramString: string): Promise<PsmResponseDto> {
    const [searchType, includeAll, hqDivCd] = paramString.split('|');
    
    try {
      const result = await this.oracleService.executeProcedure('COM_03_0201_S', [
        searchType || '2',
        includeAll || 'N',
        hqDivCd || 'ALL'
      ]);
      
      // 결과가 배열이 아닌 경우 배열로 변환
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
        message: error.message || '본부별 부서 조회 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 프로필 경력 조회
   */
  async getProfileCareer(profileParams: ProfileCareerDto): Promise<PsmResponseDto> {
    const { empNo } = profileParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0131_S', [empNo]);
      
      // 결과가 배열이 아닌 경우 배열로 변환
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
        message: error.message || '프로필 경력 조회 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 기술등급 이력 조회
   */
  async getTechnicalGradeHistory(historyParams: TechnicalGradeHistoryDto): Promise<PsmResponseDto> {
    const { empNo } = historyParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0161_S', [empNo]);
      
      // 결과가 배열이 아닌 경우 배열로 변환
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
        message: error.message || '기술등급 이력 조회 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 인사발령내역 조회
   */
  async searchAppointmentList(searchParams: SearchAppointmentDto): Promise<PsmResponseDto> {
    const { empNo } = searchParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0131_S', [empNo]);
      
      // 결과가 배열이 아닌 경우 배열로 변환
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
        message: error.message || '인사발령내역 조회 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 사원 정보 삭제 (AS-IS PSM_01_0113_D 프로시저 호출)
   */
  async deleteEmployee(deleteParams: DeleteEmployeeDto): Promise<PsmResponseDto> {
    const { empNo, userId = 'system' } = deleteParams;
    
    console.log('=== AS-IS PSM_01_0113_D 프로시저 호출 ===');
    console.log('사원번호:', empNo);
    console.log('사용자ID:', userId);

    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0113_D', [empNo, userId]);
      
      // AS-IS와 동일: 'ok^사원번호' 형식의 응답 처리
      const responseData = result.result;
      if (typeof responseData === 'string' && responseData.startsWith('ok^')) {
        const empNoFromResponse = responseData.substring(3); // 'ok^' 이후의 사원번호
        
        return {
          success: true,
          data: {
            empNo: empNoFromResponse,
            message: '사원 정보가 삭제되었습니다.'
          }
        };
      } else {
        return {
          success: false,
          message: responseData || '삭제 처리 중 오류가 발생했습니다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '삭제 처리 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 프로필 리스트 조회
   */
  async getProfileList(listParams: ProfileListDto): Promise<PsmResponseDto> {
    const { empNo, userId } = listParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0111_S', [empNo]);
      
      return {
        success: true,
        data: result.data,
        message: '프로필 리스트를 성공적으로 조회했습니다.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '프로필 리스트 조회 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 프로필 등록
   */
  async insertProfile(insertParams: ProfileInsertDto): Promise<PsmResponseDto> {
    console.log('=== 프로필 등록 파라미터 ===');
    console.log('전체 파라미터:', insertParams);
    
    const { empNo, strtDate, endDate, prjtNm, mmbrCo, delpEnvr, roleNm, taskNm, rmk, bsnNo, userId } = insertParams;
    
    console.log('taskNm 값:', taskNm);
    
    // 프로시저 파라미터 순서: O_RTN, I_REG_PATH, I_EMP_NO, I_BSN_NO, I_PRJT_NM, I_STRT_DT, I_END_DT, I_IN_MCNT, I_MMBR_CO, I_CHRG_WRK, I_ROLE_DIV_CD, I_DVLP_ENVR, I_RMK, I_USER_ID

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0112_I', [
        '2', // I_REG_PATH: 등록경로 (2: 수작업등록)
        empNo, // I_EMP_NO: 사원번호
        bsnNo || '', // I_BSN_NO: 사업번호
        prjtNm, // I_PRJT_NM: 프로젝트명
        strtDate, // I_STRT_DT: 시작일자
        endDate, // I_END_DT: 종료일자
        '', // I_IN_MCNT: 투입개월수 (자동 계산됨)
        mmbrCo || '', // I_MMBR_CO: 고객사
        taskNm || '', // I_CHRG_WRK: 담당업무
        roleNm || '', // I_ROLE_DIV_CD: 역할구분코드
        delpEnvr || '', // I_DVLP_ENVR: 개발환경
        rmk || '', // I_RMK: 비고
        userId || 'system' // I_USER_ID: 사용자 ID
      ]);
      
      // AS-IS MXML과 동일하게 'ok'로 시작하는지 확인
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '프로필이 성공적으로 등록되었습니다.'
        };
      } else {
        return {
          success: false,
          message: result.result || '프로필 등록 중 오류가 발생했습니다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '프로필 등록 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 프로필 수정
   */
  async updateProfile(updateParams: ProfileUpdateDto): Promise<PsmResponseDto> {
    console.log('=== 프로필 수정 서비스 ===');
    console.log('전체 파라미터:', JSON.stringify(updateParams, null, 2));
    
    const { empNo, seqNo, strtDate, endDate, prjtNm, mmbrCo, delpEnvr, roleNm, taskNm, rmk, bsnNo, userId } = updateParams;

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0113_U', [
        empNo, // I_EMP_NO: 사원번호
        seqNo, // I_SEQ_NO: 일련번호
        bsnNo || '', // I_BSN_NO: 사업번호
        prjtNm, // I_PRJT_NM: 프로젝트명
        strtDate, // I_STRT_DT: 시작일자
        endDate, // I_END_DT: 종료일자
        '', // I_IN_MCNT: 투입개월수 (자동 계산됨)
        mmbrCo || '', // I_MMBR_CO: 고객사
        taskNm || '', // I_CHRG_WRK: 담당업무
        roleNm || '', // I_ROLE_DIV_CD: 역할구분코드
        delpEnvr || '', // I_DVLP_ENVR: 개발환경
        rmk || '', // I_RMK: 비고
        userId || 'system' // I_USER_ID: 사용자 ID
      ]);
      
      // AS-IS MXML과 동일하게 'ok'로 시작하는지 확인
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '프로필이 성공적으로 수정되었습니다.'
        };
      } else {
        return {
          success: false,
          message: result.result || '프로필 수정 중 오류가 발생했습니다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '프로필 수정 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 프로필 삭제
   */
  async deleteProfile(deleteParams: ProfileDeleteDto): Promise<PsmResponseDto> {
    console.log('Delete Profile Service - Input params:', JSON.stringify(deleteParams, null, 2));
    const { empNo, seqNo, userId } = deleteParams;

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0114_D', [
        empNo, // I_EMP_NO: 사원번호
        seqNo || '', // I_SEQ_NO: 일련번호 (삭제 조건)
        userId || 'system' // I_USER_ID: 사용자 ID
      ]);
      
      // AS-IS MXML과 동일하게 'ok'로 시작하는지 확인
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '프로필이 성공적으로 삭제되었습니다.'
        };
      } else {
        return {
          success: false,
          message: result.result || '프로필 삭제 중 오류가 발생했습니다.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '프로필 삭제 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 프로필 경력 계산 데이터 조회 (PSM_03_0131_S)
   * AS-IS fnSelectProfileCarr 함수에 해당
   */
  async getProfileCarrCalc(calcParams: ProfileCarrCalcDto): Promise<PsmResponseDto> {
    const { empNo, userId } = calcParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0131_S', [empNo]);
      
      return {
        success: true,
        data: result.data,
        message: '프로필 경력 계산 데이터를 성공적으로 조회했습니다.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '프로필 경력 계산 데이터 조회 중 오류가 발생했습니다.'
      };
    }
  }



} 