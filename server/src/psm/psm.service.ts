/**
 * PSM (Personnel System Management) ?œë¹„??
 * 
 * ?¸ì‚¬ê´€ë¦??œìŠ¤?œì˜ ?µì‹¬ ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§??ì²˜ë¦¬?˜ëŠ” ?œë¹„???´ë˜?¤ì…?ˆë‹¤.
 * Oracle PL/SQL ?„ë¡œ?œì?ë¥??¸ì¶œ?˜ì—¬ ?¬ì› ?•ë³´, ê²½ë ¥, ?¸ì‚¬ë°œë ¹ ?±ì˜ ê¸°ëŠ¥???œê³µ?©ë‹ˆ??
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ì› ?•ë³´ ê´€ë¦?(ê²€?? ì¡°íšŒ, ?±ë¡, ?˜ì •, ?? œ)
 * - ê²½ë ¥ ê³„ì‚° ë°?ê´€ë¦?
 * - ?¸ì‚¬ë°œë ¹ ê´€ë¦?(ê°œë³„/?¼ê´„)
 * - ê³µí†µ ì½”ë“œ ì¡°íšŒ
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
 * PSM ?œë¹„???œì? ?‘ë‹µ DTO
 * 
 * ëª¨ë“  PSM API???‘ë‹µ ?•ì‹???œì??”í•˜ê¸??„í•œ ?œë„¤ë¦??´ë˜?¤ì…?ˆë‹¤.
 * ?±ê³µ/?¤íŒ¨ ?¬ë?, ?°ì´?? ?¤ë¥˜ ë©”ì‹œì§€ë¥??¬í•¨?©ë‹ˆ??
 * 
 * @template T ?‘ë‹µ ?°ì´?°ì˜ ?€??
 */
export class PsmResponseDto<T = any> {
  @ApiProperty({ 
    description: '?±ê³µ ?¬ë?', 
    example: true 
  })
  success: boolean;

  @ApiProperty({ 
    description: '?‘ë‹µ ?°ì´??, 
    required: false 
  })
  data?: T;

  @ApiProperty({ 
    description: '?¤ë¥˜ ë©”ì‹œì§€', 
    example: 'ì²˜ë¦¬ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.',
    required: false 
  })
  message?: string;
}

/**
 * PSM ?œë¹„??êµ¬í˜„ ?´ë˜??
 * 
 * ?¸ì‚¬ê´€ë¦??œìŠ¤?œì˜ ëª¨ë“  ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§??ì²˜ë¦¬?©ë‹ˆ??
 * Oracle PL/SQL ?„ë¡œ?œì?ë¥??µí•´ ?°ì´?°ë² ?´ìŠ¤?€ ?í˜¸?‘ìš©?˜ë©°,
 * ?´ë¼?´ì–¸?¸ì—ê²??œì??”ëœ ?‘ë‹µ???œê³µ?©ë‹ˆ??
 * 
 * ì£¼ìš” ?¹ì§•:
 * - AS-IS MXML ?œìŠ¤?œê³¼ ?™ì¼???„ë¡œ?œì? ?¸ì¶œ
 * - ?€???ˆì „?±ì„ ?„í•œ TypeScript DTO ?œìš©
 * - ?µí•©???ëŸ¬ ì²˜ë¦¬ ë°?ë¡œê¹…
 * - ?œì??”ëœ ?‘ë‹µ ?•ì‹
 */
@Injectable()
export class PsmService {
  constructor(
    private readonly oracleService: OracleService
  ) {}

  /**
   * ?¬ì› ê²€??
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
        message: error.message || '?¬ì› ê²€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?¬ì› ê²€??(COM_02_0411_S ?„ë¡œ?œì? ?¬ìš©)
   * AS-IS PSM_03_0110.mxml??fnSearchEmpInfo?ì„œ ?¸ì¶œ?˜ëŠ” ?„ë¡œ?œì?
   */
  async searchEmployeesCom(searchParams: SearchEmployeesDto): Promise<PsmResponseDto> {
    const { empNo, empNm, ownOutsDiv, retirYn } = searchParams;
    
    // AS-IS?ì„œ ?¬ìš©?˜ëŠ” ?Œë¼ë¯¸í„° êµ¬ì¡°
    // I_KB: ì¡°íšŒêµ¬ë¶„ (1:ì§ì›ë²ˆí˜¸, 2:ì§ì›ëª?
    // I_EMP_NO: ì§ì›ë²ˆí˜¸
    // I_EMP_NM: ì§ì›ëª?
    // I_OWN_OUTS_DIV: ?ì‚¬?¸ì£¼êµ¬ë¶„
    // I_RETIR_YN: ?´ì‚¬?í¬?¨ì¡°?Œìœ ë¬?
    
    let kb = '1'; // ê¸°ë³¸ê°? ì§ì›ë²ˆí˜¸ë¡?ê²€??
    if (empNm && empNm.trim() !== '') {
      kb = '2'; // ì§ì›ëª…ìœ¼ë¡?ê²€??
    }
    
    try {
      // OracleService??executeProcedure ?¬ìš©
      const result = await this.oracleService.executeProcedure('COM_02_0411_S', [
        kb,                                    // I_KB: ì¡°íšŒêµ¬ë¶„
        empNo || '',                           // I_EMP_NO: ì§ì›ë²ˆí˜¸
        empNm || '',                           // I_EMP_NM: ì§ì›ëª?
        ownOutsDiv || 'ALL',                   // I_OWN_OUTS_DIV: ?ì‚¬?¸ì£¼êµ¬ë¶„
        retirYn || 'Y'                         // I_RETIR_YN: ?´ì‚¬?í¬?¨ì¡°?Œìœ ë¬?
      ]);
      
      return {
        success: true,
        data: result.data,
        message: '?¬ì› ?•ë³´ ì¡°íšŒê°€ ?±ê³µ?ìœ¼ë¡??„ë£Œ?˜ì—ˆ?µë‹ˆ??'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?¬ì› ?•ë³´ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?¬ì› ?ì„¸ ì¡°íšŒ
   */
  async getEmployeeDetail(detailParams: EmployeeDetailDto): Promise<PsmResponseDto> {
    const { empNo } = detailParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0101_S', [empNo]);
      
      // ê²°ê³¼ê°€ ë°°ì—´??ê²½ìš° ì²?ë²ˆì§¸ ?”ì†Œ ë°˜í™˜
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
        message: error.message || '?¬ì› ?ì„¸ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?¬ì› ê²½ë ¥ ê³„ì‚°
   * 
   * AS-IS MXML??PSM_01_0152_S ?„ë¡œ?œì?ë¥??¸ì¶œ?˜ì—¬ ?¬ì›??ê²½ë ¥??ê³„ì‚°?©ë‹ˆ??
   * ?™ë ¥ê¸°ì? ê²½ë ¥ê³??ê²©ê¸°ì? ê²½ë ¥??ëª¨ë‘ ê³„ì‚°?˜ë©°, ?ì‚¬/?¸ì£¼ êµ¬ë¶„???°ë¼ ?¤ë¥¸ ë¡œì§???ìš©?©ë‹ˆ??
   * 
   * @param careerParams ê²½ë ¥ ê³„ì‚°???„ìš”???Œë¼ë¯¸í„°
   * @returns ê³„ì‚°??ê²½ë ¥ ?•ë³´
   * 
   * @example
   * // ?ì‚¬ ?¬ì›??ê²½ë ¥ ê³„ì‚°
   * const result = await calculateCareer({
   *   empNo: '10005',
   *   entrDt: '20200101',
   *   ownOutsDiv: '1'
   * });
   */
  async calculateCareer(careerParams: CalculateCareerDto): Promise<PsmResponseDto> {
    const { empNo, entrDt, fstInDt, lastEndDt, lastAdbgDivCd, ctqlCd, ctqlPurDt, ownOutsDiv } = careerParams;
    
    try {
      // OracleService??executeProcedure ?¬ìš©
      const result = await this.oracleService.executeProcedure('PSM_01_0152_S', [
        empNo,                    // I_EMP_NO: ?¬ì›ë²ˆí˜¸
        entrDt || '',            // I_ENTR_DT: ?…ì‚¬?¼ì (YYYYMMDD)
        fstInDt || '',           // I_FST_IN_DT: ìµœì´ˆ?¬ì…?¼ì (YYYYMMDD)
        lastEndDt || '',         // I_LAST_END_DT: ìµœì¢…ì² ìˆ˜?¼ì (YYYYMMDD)
        lastAdbgDivCd || '',     // I_LAST_ADBG_DIV: ìµœì¢…?™ë ¥êµ¬ë¶„ì½”ë“œ
        ctqlCd || '',            // I_CTQL_CD: ?ê²©ì¦ì½”??
        ctqlPurDt || '',         // I_CTQL_PUR_DT: ?ê²©ì·¨ë“?¼ì (YYYYMMDD)
        ownOutsDiv || '1',       // I_OWN_OUTS_DIV: ?ì‚¬?¸ì£¼êµ¬ë¶„ (1:?ì‚¬, 2:?¸ì£¼)
        ''                       // I_CARR_CALC_STND_DT: ê²½ë ¥ê³„ì‚°ê¸°ì??¼ì (ê¸°ë³¸ê°? NULL)
      ]);
      
      // ê²°ê³¼ê°€ ë°°ì—´??ê²½ìš° ì²?ë²ˆì§¸ ?”ì†Œ ë°˜í™˜
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
        message: error.message || 'ê²½ë ¥ ê³„ì‚° ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ê²½ë ¥ ?…ë°?´íŠ¸
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
      
      // OUT ?Œë¼ë¯¸í„° ê°??•ì¸ - AS-IS MXMLê³??™ì¼?˜ê²Œ 'ok'ë¡??œì‘?˜ëŠ”ì§€ ?•ì¸
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          message: result.result || '?„ë¡œ?œì? ?¤í–‰ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'ê²½ë ¥ ?…ë°?´íŠ¸ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?¸ì‚¬ë°œë ¹ ?€??
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
        message: error.message || '?¸ì‚¬ë°œë ¹ ?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?¸ì‚¬ë°œë ¹ ?? œ
   */
  async deleteAppointment(deleteParams: DeleteAppointmentDto): Promise<PsmResponseDto> {
    const { empNo, seqNo } = deleteParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0133_D', [
        empNo,
        seqNo ? String(seqNo) : '',
        'USER_ID'
      ]);
      
      // AS-IS MXMLê³??™ì¼?˜ê²Œ 'ok'ë¡??œì‘?˜ëŠ”ì§€ ?•ì¸
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result
        };
      } else {
        return {
          success: false,
          message: result.result || '?¸ì‚¬ë°œë ¹ ?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?¸ì‚¬ë°œë ¹ ?? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡
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
        message: error.message || '?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?¬ì› ?•ë³´ ?…ë°?´íŠ¸
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
        message: error.message || '?¬ì› ?•ë³´ ?…ë°?´íŠ¸ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }



  /**
   * ë³¸ë?ë³?ë¶€??ì¡°íšŒ
   */
  async getDeptByHq(paramString: string): Promise<PsmResponseDto> {
    const [searchType, includeAll, hqDivCd] = paramString.split('|');
    
    try {
      const result = await this.oracleService.executeProcedure('COM_03_0201_S', [
        searchType || '2',
        includeAll || 'N',
        hqDivCd || 'ALL'
      ]);
      
      // ê²°ê³¼ê°€ ë°°ì—´???„ë‹Œ ê²½ìš° ë°°ì—´ë¡?ë³€??
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
        message: error.message || 'ë³¸ë?ë³?ë¶€??ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?„ë¡œ??ê²½ë ¥ ì¡°íšŒ
   */
  async getProfileCareer(profileParams: ProfileCareerDto): Promise<PsmResponseDto> {
    const { empNo } = profileParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0131_S', [empNo]);
      
      // ê²°ê³¼ê°€ ë°°ì—´???„ë‹Œ ê²½ìš° ë°°ì—´ë¡?ë³€??
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
        message: error.message || '?„ë¡œ??ê²½ë ¥ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ê¸°ìˆ ?±ê¸‰ ?´ë ¥ ì¡°íšŒ
   */
  async getTechnicalGradeHistory(historyParams: TechnicalGradeHistoryDto): Promise<PsmResponseDto> {
    const { empNo } = historyParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0161_S', [empNo]);
      
      // ê²°ê³¼ê°€ ë°°ì—´???„ë‹Œ ê²½ìš° ë°°ì—´ë¡?ë³€??
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
        message: error.message || 'ê¸°ìˆ ?±ê¸‰ ?´ë ¥ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?¸ì‚¬ë°œë ¹?´ì—­ ì¡°íšŒ
   */
  async searchAppointmentList(searchParams: SearchAppointmentDto): Promise<PsmResponseDto> {
    const { empNo } = searchParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0131_S', [empNo]);
      
      // ê²°ê³¼ê°€ ë°°ì—´???„ë‹Œ ê²½ìš° ë°°ì—´ë¡?ë³€??
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
        message: error.message || '?¸ì‚¬ë°œë ¹?´ì—­ ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?¬ì› ?•ë³´ ?? œ (AS-IS PSM_01_0113_D ?„ë¡œ?œì? ?¸ì¶œ)
   */
  async deleteEmployee(deleteParams: DeleteEmployeeDto): Promise<PsmResponseDto> {
    const { empNo, userId = 'system' } = deleteParams;
    
    console.log('=== AS-IS PSM_01_0113_D ?„ë¡œ?œì? ?¸ì¶œ ===');
    console.log('?¬ì›ë²ˆí˜¸:', empNo);
    console.log('?¬ìš©?ID:', userId);

    try {
      const result = await this.oracleService.executeProcedure('PSM_01_0113_D', [empNo, userId]);
      
      // AS-IS?€ ?™ì¼: 'ok^?¬ì›ë²ˆí˜¸' ?•ì‹???‘ë‹µ ì²˜ë¦¬
      const responseData = result.result;
      if (typeof responseData === 'string' && responseData.startsWith('ok^')) {
        const empNoFromResponse = responseData.substring(3); // 'ok^' ?´í›„???¬ì›ë²ˆí˜¸
        
        return {
          success: true,
          data: {
            empNo: empNoFromResponse,
            message: '?¬ì› ?•ë³´ê°€ ?? œ?˜ì—ˆ?µë‹ˆ??'
          }
        };
      } else {
        return {
          success: false,
          message: responseData || '?? œ ì²˜ë¦¬ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?? œ ì²˜ë¦¬ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?„ë¡œ??ë¦¬ìŠ¤??ì¡°íšŒ
   */
  async getProfileList(listParams: ProfileListDto): Promise<PsmResponseDto> {
    const { empNo, userId } = listParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0111_S', [empNo]);
      
      return {
        success: true,
        data: result.data,
        message: '?„ë¡œ??ë¦¬ìŠ¤?¸ë? ?±ê³µ?ìœ¼ë¡?ì¡°íšŒ?ˆìŠµ?ˆë‹¤.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?„ë¡œ??ë¦¬ìŠ¤??ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?„ë¡œ???±ë¡
   */
  async insertProfile(insertParams: ProfileInsertDto): Promise<PsmResponseDto> {
    console.log('=== ?„ë¡œ???±ë¡ ?Œë¼ë¯¸í„° ===');
    console.log('?„ì²´ ?Œë¼ë¯¸í„°:', insertParams);
    
    const { empNo, strtDate, endDate, prjtNm, mmbrCo, delpEnvr, roleNm, taskNm, rmk, bsnNo, userId } = insertParams;
    
    console.log('taskNm ê°?', taskNm);
    
    // ?„ë¡œ?œì? ?Œë¼ë¯¸í„° ?œì„œ: O_RTN, I_REG_PATH, I_EMP_NO, I_BSN_NO, I_PRJT_NM, I_STRT_DT, I_END_DT, I_IN_MCNT, I_MMBR_CO, I_CHRG_WRK, I_ROLE_DIV_CD, I_DVLP_ENVR, I_RMK, I_USER_ID

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0112_I', [
        '2', // I_REG_PATH: ?±ë¡ê²½ë¡œ (2: ?˜ì‘?…ë“±ë¡?
        empNo, // I_EMP_NO: ?¬ì›ë²ˆí˜¸
        bsnNo || '', // I_BSN_NO: ?¬ì—…ë²ˆí˜¸
        prjtNm, // I_PRJT_NM: ?„ë¡œ?íŠ¸ëª?
        strtDate, // I_STRT_DT: ?œì‘?¼ì
        endDate, // I_END_DT: ì¢…ë£Œ?¼ì
        '', // I_IN_MCNT: ?¬ì…ê°œì›”??(?ë™ ê³„ì‚°??
        mmbrCo || '', // I_MMBR_CO: ê³ ê°??
        taskNm || '', // I_CHRG_WRK: ?´ë‹¹?…ë¬´
        roleNm || '', // I_ROLE_DIV_CD: ??• êµ¬ë¶„ì½”ë“œ
        delpEnvr || '', // I_DVLP_ENVR: ê°œë°œ?˜ê²½
        rmk || '', // I_RMK: ë¹„ê³ 
        userId || 'system' // I_USER_ID: ?¬ìš©??ID
      ]);
      
      // AS-IS MXMLê³??™ì¼?˜ê²Œ 'ok'ë¡??œì‘?˜ëŠ”ì§€ ?•ì¸
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '?„ë¡œ?„ì´ ?±ê³µ?ìœ¼ë¡??±ë¡?˜ì—ˆ?µë‹ˆ??'
        };
      } else {
        return {
          success: false,
          message: result.result || '?„ë¡œ???±ë¡ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?„ë¡œ???±ë¡ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?„ë¡œ???˜ì •
   */
  async updateProfile(updateParams: ProfileUpdateDto): Promise<PsmResponseDto> {
    console.log('=== ?„ë¡œ???˜ì • ?œë¹„??===');
    console.log('?„ì²´ ?Œë¼ë¯¸í„°:', JSON.stringify(updateParams, null, 2));
    
    const { empNo, seqNo, strtDate, endDate, prjtNm, mmbrCo, delpEnvr, roleNm, taskNm, rmk, bsnNo, userId } = updateParams;

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0113_U', [
        empNo, // I_EMP_NO: ?¬ì›ë²ˆí˜¸
        seqNo, // I_SEQ_NO: ?¼ë ¨ë²ˆí˜¸
        bsnNo || '', // I_BSN_NO: ?¬ì—…ë²ˆí˜¸
        prjtNm, // I_PRJT_NM: ?„ë¡œ?íŠ¸ëª?
        strtDate, // I_STRT_DT: ?œì‘?¼ì
        endDate, // I_END_DT: ì¢…ë£Œ?¼ì
        '', // I_IN_MCNT: ?¬ì…ê°œì›”??(?ë™ ê³„ì‚°??
        mmbrCo || '', // I_MMBR_CO: ê³ ê°??
        taskNm || '', // I_CHRG_WRK: ?´ë‹¹?…ë¬´
        roleNm || '', // I_ROLE_DIV_CD: ??• êµ¬ë¶„ì½”ë“œ
        delpEnvr || '', // I_DVLP_ENVR: ê°œë°œ?˜ê²½
        rmk || '', // I_RMK: ë¹„ê³ 
        userId || 'system' // I_USER_ID: ?¬ìš©??ID
      ]);
      
      // AS-IS MXMLê³??™ì¼?˜ê²Œ 'ok'ë¡??œì‘?˜ëŠ”ì§€ ?•ì¸
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '?„ë¡œ?„ì´ ?±ê³µ?ìœ¼ë¡??˜ì •?˜ì—ˆ?µë‹ˆ??'
        };
      } else {
        return {
          success: false,
          message: result.result || '?„ë¡œ???˜ì • ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?„ë¡œ???˜ì • ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?„ë¡œ???? œ
   */
  async deleteProfile(deleteParams: ProfileDeleteDto): Promise<PsmResponseDto> {
    console.log('Delete Profile Service - Input params:', JSON.stringify(deleteParams, null, 2));
    const { empNo, seqNo, userId } = deleteParams;

    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0114_D', [
        empNo, // I_EMP_NO: ?¬ì›ë²ˆí˜¸
        seqNo || '', // I_SEQ_NO: ?¼ë ¨ë²ˆí˜¸ (?? œ ì¡°ê±´)
        userId || 'system' // I_USER_ID: ?¬ìš©??ID
      ]);
      
      // AS-IS MXMLê³??™ì¼?˜ê²Œ 'ok'ë¡??œì‘?˜ëŠ”ì§€ ?•ì¸
      if (result.result && result.result.startsWith('ok')) {
        return {
          success: true,
          data: result.result,
          message: '?„ë¡œ?„ì´ ?±ê³µ?ìœ¼ë¡??? œ?˜ì—ˆ?µë‹ˆ??'
        };
      } else {
        return {
          success: false,
          message: result.result || '?„ë¡œ???? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '?„ë¡œ???? œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }

  /**
   * ?„ë¡œ??ê²½ë ¥ ê³„ì‚° ?°ì´??ì¡°íšŒ (PSM_03_0131_S)
   * AS-IS fnSelectProfileCarr ?¨ìˆ˜???´ë‹¹
   */
  async getProfileCarrCalc(calcParams: ProfileCarrCalcDto): Promise<PsmResponseDto> {
    const { empNo, userId } = calcParams;
    
    try {
      const result = await this.oracleService.executeProcedure('PSM_03_0131_S', [empNo]);
      
      return {
        success: true,
        data: result.data,
        message: '?„ë¡œ??ê²½ë ¥ ê³„ì‚° ?°ì´?°ë? ?±ê³µ?ìœ¼ë¡?ì¡°íšŒ?ˆìŠµ?ˆë‹¤.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '?„ë¡œ??ê²½ë ¥ ê³„ì‚° ?°ì´??ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
      };
    }
  }



} 

