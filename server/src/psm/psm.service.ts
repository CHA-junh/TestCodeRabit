/**
 * PSM (Personnel System Management) ?ë¹??
 * 
 * ?¸ì¬ê´ë¦??ì¤?ì ?µì¬ ë¹ì¦?ì¤ ë¡ì§??ì²ë¦¬?ë ?ë¹???´ë?¤ì?ë¤.
 * Oracle PL/SQL ?ë¡?ì?ë¥??¸ì¶?ì¬ ?¬ì ?ë³´, ê²½ë ¥, ?¸ì¬ë°ë ¹ ?±ì ê¸°ë¥???ê³µ?©ë??
 * 
 * ì£¼ì ê¸°ë¥:
 * - ?¬ì ?ë³´ ê´ë¦?(ê²?? ì¡°í, ?±ë¡, ?ì , ?? )
 * - ê²½ë ¥ ê³ì° ë°?ê´ë¦?
 * - ?¸ì¬ë°ë ¹ ê´ë¦?(ê°ë³/?¼ê´)
 * - ê³µíµ ì½ë ì¡°í
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
 * PSM ?ë¹???ì? ?ëµ DTO
 * 
 * ëª¨ë  PSM API???ëµ ?ì???ì??íê¸??í ?ë¤ë¦??´ë?¤ì?ë¤.
 * ?±ê³µ/?¤í¨ ?¬ë?, ?°ì´?? ?¤ë¥ ë©ìì§ë¥??¬í¨?©ë??
 * 
 * @template T ?ëµ ?°ì´?°ì ???
 */
export class PsmResponseDto<T = any> {
  @ApiProperty({ 
    description: '?±ê³µ ?¬ë?', 
    example: true 
  })
  success: boolean;

  @ApiProperty({ 
    description: '?ëµ ?°ì´??, 
    required: false 
  })
  data?: T;

  @ApiProperty({ 
    description: '?¤ë¥ ë©ìì§', 
    example: 'ì²ë¦¬ ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.',
    required: false 
  })
  message?: string;
}

/**
 * PSM ?ë¹??êµ¬í ?´ë??
 * 
 * ?¸ì¬ê´ë¦??ì¤?ì ëª¨ë  ë¹ì¦?ì¤ ë¡ì§??ì²ë¦¬?©ë??
 * Oracle PL/SQL ?ë¡?ì?ë¥??µí´ ?°ì´?°ë² ?´ì¤? ?í¸?ì©?ë©°,
 * ?´ë¼?´ì¸?¸ìê²??ì??ë ?ëµ???ê³µ?©ë??
 * 
 * ì£¼ì ?¹ì§:
 * - AS-IS MXML ?ì¤?ê³¼ ?ì¼???ë¡?ì? ?¸ì¶
 * - ????ì ?±ì ?í TypeScript DTO ?ì©
 * - ?µí©???ë¬ ì²ë¦¬ ë°?ë¡ê¹
 * - ?ì??ë ?ëµ ?ì
 */
@Injectable()
export class PsmService {
  constructor(
    private readonly oracleService: OracleService
  ) {}

  /**
   * ?¬ì ê²??
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
        message: error.message || '?¬ì ê²??ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?¬ì ê²??(COM_02_0411_S ?ë¡?ì? ?¬ì©)
   * AS-IS PSM_03_0110.mxml??fnSearchEmpInfo?ì ?¸ì¶?ë ?ë¡?ì?
   */
  async searchEmployeesCom(searchParams: SearchEmployeesDto): Promise<PsmResponseDto> {
    const { empNo, empNm, ownOutsDiv, retirYn } = searchParams;
    
    // AS-IS?ì ?¬ì©?ë ?ë¼ë¯¸í° êµ¬ì¡°
    // I_KB: ì¡°íêµ¬ë¶ (1:ì§ìë²í¸, 2:ì§ìëª?
    // I_EMP_NO: ì§ìë²í¸
    // I_EMP_NM: ì§ìëª?
    // I_OWN_OUTS_DIV: ?ì¬?¸ì£¼êµ¬ë¶
    // I_RETIR_YN: ?´ì¬?í¬?¨ì¡°?ì ë¬?
    
    let kb = '1'; // ê¸°ë³¸ê°? ì§ìë²í¸ë¡?ê²??
    if (empNm && empNm.trim() !== '') {
      kb = '2'; // ì§ìëªì¼ë¡?ê²??
    }
    
    try {
      // OracleService??executeProcedure ?¬ì©
      const result = await this.oracleService.executeProcedure('COM_02_0411_S', [
        kb,                                    // I_KB: ì¡°íêµ¬ë¶
        empNo || '',                           // I_EMP_NO: ì§ìë²í¸
        empNm || '',                           // I_EMP_NM: ì§ìëª?
        ownOutsDiv || 'ALL',                   // I_OWN_OUTS_DIV: ?ì¬?¸ì£¼êµ¬ë¶
        retirYn || 'Y'                         // I_RETIR_YN: ?´ì¬?í¬?¨ì¡°?ì ë¬?
      ]);
      
      return {
        success: true,
        data: result.data,
        message: '?¬ì ?ë³´ ì¡°íê° ?±ê³µ?ì¼ë¡??ë£?ì?µë??'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?¬ì ?ë³´ ì¡°í ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?¬ì ?ì¸ ì¡°í
   */
  async getEmployeeDetail(detailParams: EmployeeDetailDto): Promise<PsmResponseDto> {
    const { empNo } = detailParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0101_S', [empNo]);
      
      // ê²°ê³¼ê° ë°°ì´??ê²½ì° ì²?ë²ì§¸ ?ì ë°í
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
        message: error.message || '?¬ì ?ì¸ ì¡°í ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?¬ì ê²½ë ¥ ê³ì°
   * 
   * AS-IS MXML??PSM_01_0152_S ?ë¡?ì?ë¥??¸ì¶?ì¬ ?¬ì??ê²½ë ¥??ê³ì°?©ë??
   * ?ë ¥ê¸°ì? ê²½ë ¥ê³??ê²©ê¸°ì? ê²½ë ¥??ëª¨ë ê³ì°?ë©°, ?ì¬/?¸ì£¼ êµ¬ë¶???°ë¼ ?¤ë¥¸ ë¡ì§???ì©?©ë??
   * 
   * @param careerParams ê²½ë ¥ ê³ì°???ì???ë¼ë¯¸í°
   * @returns ê³ì°??ê²½ë ¥ ?ë³´
   * 
   * @example
   * // ?ì¬ ?¬ì??ê²½ë ¥ ê³ì°
   * const result = await calculateCareer({
   *   empNo: '10005',
   *   entrDt: '20200101',
   *   ownOutsDiv: '1'
   * });
   */
  async calculateCareer(careerParams: CalculateCareerDto): Promise<PsmResponseDto> {
    const { empNo, entrDt, fstInDt, lastEndDt, lastAdbgDivCd, ctqlCd, ctqlPurDt, ownOutsDiv } = careerParams;
    
    try {
      // OracleService??executeProcedure ?¬ì©
      const result = await this.oracleService.executeProcedure('PSM_01_0152_S', [
        empNo,                    // I_EMP_NO: ?¬ìë²í¸
        entrDt || '',            // I_ENTR_DT: ?ì¬?¼ì (YYYYMMDD)
        fstInDt || '',           // I_FST_IN_DT: ìµì´?¬ì?¼ì (YYYYMMDD)
        lastEndDt || '',         // I_LAST_END_DT: ìµì¢ì² ì?¼ì (YYYYMMDD)
        lastAdbgDivCd || '',     // I_LAST_ADBG_DIV: ìµì¢?ë ¥êµ¬ë¶ì½ë
        ctqlCd || '',            // I_CTQL_CD: ?ê²©ì¦ì½??
        ctqlPurDt || '',         // I_CTQL_PUR_DT: ?ê²©ì·¨ë?¼ì (YYYYMMDD)
        ownOutsDiv || '1',       // I_OWN_OUTS_DIV: ?ì¬?¸ì£¼êµ¬ë¶ (1:?ì¬, 2:?¸ì£¼)
        ''                       // I_CARR_CALC_STND_DT: ê²½ë ¥ê³ì°ê¸°ì??¼ì (ê¸°ë³¸ê°? NULL)
      ]);
      
      // ê²°ê³¼ê° ë°°ì´??ê²½ì° ì²?ë²ì§¸ ?ì ë°í
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
        message: error.message || 'ê²½ë ¥ ê³ì° ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ê²½ë ¥ ?ë°?´í¸
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
      
      // OUT ?ë¼ë¯¸í° ê°??ì¸ - AS-IS MXMLê³??ì¼?ê² 'ok'ë¡??ì?ëì§ ?ì¸
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          message: result.result || '?ë¡?ì? ?¤í ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'ê²½ë ¥ ?ë°?´í¸ ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?¸ì¬ë°ë ¹ ???
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
        message: error.message || '?¸ì¬ë°ë ¹ ???ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?¸ì¬ë°ë ¹ ?? 
   */
  async deleteAppointment(deleteParams: DeleteAppointmentDto): Promise<PsmResponseDto> {
    const { empNo, seqNo } = deleteParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0133_D', [
        empNo,
        seqNo ? String(seqNo) : '',
        'USER_ID'
      ]);
      
      // AS-IS MXMLê³??ì¼?ê² 'ok'ë¡??ì?ëì§ ?ì¸
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          message: result.result || '?¸ì¬ë°ë ¹ ??  ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?¸ì¬ë°ë ¹ ??  ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?¸ì¬ë°ë ¹ ?¼ê´?±ë¡
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
        message: error.message || '?¸ì¬ë°ë ¹ ?¼ê´?±ë¡ ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?¬ì ?ë³´ ?ë°?´í¸
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
        message: error.message || '?¬ì ?ë³´ ?ë°?´í¸ ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }



  /**
   * ë³¸ë?ë³?ë¶??ì¡°í
   */
  async getDeptByHq(paramString: string): Promise<PsmResponseDto> {
    const [searchType, includeAll, hqDivCd] = paramString.split('|');
    
    try {
      const result = await this.oracleService.executeProcedure('COM_03_0201_S', [
        searchType || '2',
        includeAll || 'N',
        hqDivCd || 'ALL'
      ]);
      
      // ê²°ê³¼ê° ë°°ì´???ë ê²½ì° ë°°ì´ë¡?ë³??
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
        message: error.message || 'ë³¸ë?ë³?ë¶??ì¡°í ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?ë¡??ê²½ë ¥ ì¡°í
   */
  async getProfileCareer(profileParams: ProfileCareerDto): Promise<PsmResponseDto> {
    const { empNo } = profileParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0131_S', [empNo]);
      
      // ê²°ê³¼ê° ë°°ì´???ë ê²½ì° ë°°ì´ë¡?ë³??
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
        message: error.message || '?ë¡??ê²½ë ¥ ì¡°í ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ê¸°ì ?±ê¸ ?´ë ¥ ì¡°í
   */
  async getTechnicalGradeHistory(historyParams: TechnicalGradeHistoryDto): Promise<PsmResponseDto> {
    const { empNo } = historyParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0161_S', [empNo]);
      
      // ê²°ê³¼ê° ë°°ì´???ë ê²½ì° ë°°ì´ë¡?ë³??
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
        message: error.message || 'ê¸°ì ?±ê¸ ?´ë ¥ ì¡°í ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?¸ì¬ë°ë ¹?´ì­ ì¡°í
   */
  async searchAppointmentList(searchParams: SearchAppointmentDto): Promise<PsmResponseDto> {
    const { empNo } = searchParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0131_S', [empNo]);
      
      // ê²°ê³¼ê° ë°°ì´???ë ê²½ì° ë°°ì´ë¡?ë³??
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
        message: error.message || '?¸ì¬ë°ë ¹?´ì­ ì¡°í ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?¬ì ?ë³´ ??  (AS-IS PSM_01_0113_D ?ë¡?ì? ?¸ì¶)
   */
  async deleteEmployee(deleteParams: DeleteEmployeeDto): Promise<PsmResponseDto> {
    const { empNo, userId = 'system' } = deleteParams;
    
    console.log('=== AS-IS PSM_01_0113_D ?ë¡?ì? ?¸ì¶ ===');
    console.log('?¬ìë²í¸:', empNo);
    console.log('?¬ì©?ID:', userId);

    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0113_D', [empNo, userId]);
      
      // AS-IS? ?ì¼: 'ok^?¬ìë²í¸' ?ì???ëµ ì²ë¦¬
      const responseData = result.result;
      if (typeof responseData === 'string' && responseData.startsWith('ok^')) {
        const empNoFromResponse = responseData.substring(3); // 'ok^' ?´í???¬ìë²í¸
        
        return {
          success: true,
          data: {
            empNo: empNoFromResponse,
            message: '?¬ì ?ë³´ê° ?? ?ì?µë??'
          }
        };
      } else {
        return {
          success: false,
          message: responseData || '??  ì²ë¦¬ ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '??  ì²ë¦¬ ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?ë¡??ë¦¬ì¤??ì¡°í
   */
  async getProfileList(listParams: ProfileListDto): Promise<PsmResponseDto> {
    const { empNo, userId } = listParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0111_S', [empNo]);
      
      return {
        success: true,
        data: result.data,
        message: '?ë¡??ë¦¬ì¤?¸ë? ?±ê³µ?ì¼ë¡?ì¡°í?ìµ?ë¤.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?ë¡??ë¦¬ì¤??ì¡°í ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?ë¡???±ë¡
   */
  async insertProfile(insertParams: ProfileInsertDto): Promise<PsmResponseDto> {
    console.log('=== ?ë¡???±ë¡ ?ë¼ë¯¸í° ===');
    console.log('?ì²´ ?ë¼ë¯¸í°:', insertParams);
    
    const { empNo, strtDate, endDate, prjtNm, mmbrCo, delpEnvr, roleNm, taskNm, rmk, bsnNo, userId } = insertParams;
    
    console.log('taskNm ê°?', taskNm);
    
    // ?ë¡?ì? ?ë¼ë¯¸í° ?ì: O_RTN, I_REG_PATH, I_EMP_NO, I_BSN_NO, I_PRJT_NM, I_STRT_DT, I_END_DT, I_IN_MCNT, I_MMBR_CO, I_CHRG_WRK, I_ROLE_DIV_CD, I_DVLP_ENVR, I_RMK, I_USER_ID

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0112_I', [
        '2', // I_REG_PATH: ?±ë¡ê²½ë¡ (2: ?ì?ë±ë¡?
        empNo, // I_EMP_NO: ?¬ìë²í¸
        bsnNo || '', // I_BSN_NO: ?¬ìë²í¸
        prjtNm, // I_PRJT_NM: ?ë¡?í¸ëª?
        strtDate, // I_STRT_DT: ?ì?¼ì
        endDate, // I_END_DT: ì¢ë£?¼ì
        '', // I_IN_MCNT: ?¬ìê°ì??(?ë ê³ì°??
        mmbrCo || '', // I_MMBR_CO: ê³ ê°??
        taskNm || '', // I_CHRG_WRK: ?´ë¹?ë¬´
        roleNm || '', // I_ROLE_DIV_CD: ?? êµ¬ë¶ì½ë
        delpEnvr || '', // I_DVLP_ENVR: ê°ë°?ê²½
        rmk || '', // I_RMK: ë¹ê³ 
        userId || 'system' // I_USER_ID: ?¬ì©??ID
      ]);
      
      // AS-IS MXMLê³??ì¼?ê² 'ok'ë¡??ì?ëì§ ?ì¸
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '?ë¡?ì´ ?±ê³µ?ì¼ë¡??±ë¡?ì?µë??'
        };
      } else {
        return {
          success: false,
          message: result.result || '?ë¡???±ë¡ ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?ë¡???±ë¡ ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?ë¡???ì 
   */
  async updateProfile(updateParams: ProfileUpdateDto): Promise<PsmResponseDto> {
    console.log('=== ?ë¡???ì  ?ë¹??===');
    console.log('?ì²´ ?ë¼ë¯¸í°:', JSON.stringify(updateParams, null, 2));
    
    const { empNo, seqNo, strtDate, endDate, prjtNm, mmbrCo, delpEnvr, roleNm, taskNm, rmk, bsnNo, userId } = updateParams;

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0113_U', [
        empNo, // I_EMP_NO: ?¬ìë²í¸
        seqNo, // I_SEQ_NO: ?¼ë ¨ë²í¸
        bsnNo || '', // I_BSN_NO: ?¬ìë²í¸
        prjtNm, // I_PRJT_NM: ?ë¡?í¸ëª?
        strtDate, // I_STRT_DT: ?ì?¼ì
        endDate, // I_END_DT: ì¢ë£?¼ì
        '', // I_IN_MCNT: ?¬ìê°ì??(?ë ê³ì°??
        mmbrCo || '', // I_MMBR_CO: ê³ ê°??
        taskNm || '', // I_CHRG_WRK: ?´ë¹?ë¬´
        roleNm || '', // I_ROLE_DIV_CD: ?? êµ¬ë¶ì½ë
        delpEnvr || '', // I_DVLP_ENVR: ê°ë°?ê²½
        rmk || '', // I_RMK: ë¹ê³ 
        userId || 'system' // I_USER_ID: ?¬ì©??ID
      ]);
      
      // AS-IS MXMLê³??ì¼?ê² 'ok'ë¡??ì?ëì§ ?ì¸
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '?ë¡?ì´ ?±ê³µ?ì¼ë¡??ì ?ì?µë??'
        };
      } else {
        return {
          success: false,
          message: result.result || '?ë¡???ì  ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?ë¡???ì  ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?ë¡???? 
   */
  async deleteProfile(deleteParams: ProfileDeleteDto): Promise<PsmResponseDto> {
    console.log('Delete Profile Service - Input params:', JSON.stringify(deleteParams, null, 2));
    const { empNo, seqNo, userId } = deleteParams;

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0114_D', [
        empNo, // I_EMP_NO: ?¬ìë²í¸
        seqNo || '', // I_SEQ_NO: ?¼ë ¨ë²í¸ (??  ì¡°ê±´)
        userId || 'system' // I_USER_ID: ?¬ì©??ID
      ]);
      
      // AS-IS MXMLê³??ì¼?ê² 'ok'ë¡??ì?ëì§ ?ì¸
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '?ë¡?ì´ ?±ê³µ?ì¼ë¡??? ?ì?µë??'
        };
      } else {
        return {
          success: false,
          message: result.result || '?ë¡????  ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?ë¡????  ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }

  /**
   * ?ë¡??ê²½ë ¥ ê³ì° ?°ì´??ì¡°í (PSM_03_0131_S)
   * AS-IS fnSelectProfileCarr ?¨ì???´ë¹
   */
  async getProfileCarrCalc(calcParams: ProfileCarrCalcDto): Promise<PsmResponseDto> {
    const { empNo, userId } = calcParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0131_S', [empNo]);
      
      return {
        success: true,
        data: result.data,
        message: '?ë¡??ê²½ë ¥ ê³ì° ?°ì´?°ë? ?±ê³µ?ì¼ë¡?ì¡°í?ìµ?ë¤.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?ë¡??ê²½ë ¥ ê³ì° ?°ì´??ì¡°í ì¤??¤ë¥ê° ë°ì?ìµ?ë¤.'
      };
    }
  }



} 

