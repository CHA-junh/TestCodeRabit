/**
 * PSM (Personnel System Management) DTO 모음
 * 
 * ?�사관�??�스?�에???�용?�는 모든 Data Transfer Object�??�의?�니??
 * �?DTO??API ?�청/?�답???�이??구조�??�의?�며, Swagger 문서?��? ?�효??검증을 지?�합?�다.
 * 
 * 주요 DTO 그룹:
 * - ?�원 관�? SearchEmployeesDto, EmployeeDetailDto, UpdateEmployeeDto, DeleteEmployeeDto
 * - 경력 관�? CalculateCareerDto, UpdateCareerDto, ProfileCareerDto
 * - ?�사발령: SaveAppointmentDto, DeleteAppointmentDto, BatchRegisterAppointmentDto
 * - 공통 기능: DeptByHqDto, TechnicalGradeHistoryDto
 * - ?�답 ?�식: ApiResponseDto
 * 
 * 모든 DTO??class-validator�??�용???�효??검증과 Swagger 문서?��? ?�함?�니??
 * 
 * @author BIST Development Team
 * @since 2024
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

// ?�원 검???�청 DTO
export class SearchEmployeesDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: 'ALL',
    required: false 
  })
  @IsOptional()
  @IsString()
  empNo?: string;

  @ApiProperty({ 
    description: '?�원?�명', 
    example: '조병??,
    required: false 
  })
  @IsOptional()
  @IsString()
  empNm?: string;

  @ApiProperty({ 
    description: '?�사/?�주 구분 (1: ?�사, 2: ?�주)', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ownOutsDiv?: string;

  @ApiProperty({ 
    description: '본�? 코드', 
    example: 'ALL',
    required: false 
  })
  @IsOptional()
  @IsString()
  hqDivCd?: string;

  @ApiProperty({ 
    description: '부??코드', 
    example: 'ALL',
    required: false 
  })
  @IsOptional()
  @IsString()
  deptDivCd?: string;

  @ApiProperty({ 
    description: '직책 코드', 
    example: 'ALL',
    required: false 
  })
  @IsOptional()
  @IsString()
  dutyCd?: string;

  @ApiProperty({ 
    description: '?�사???�함 ?��? (Y/N)', 
    example: 'N',
    required: false 
  })
  @IsOptional()
  @IsString()
  retirYn?: string;

  @ApiProperty({ 
    description: '?�용??ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// ?�원 ?�세 조회 ?�청 DTO
export class EmployeeDetailDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;
}

// 경력 계산 ?�청 DTO
export class CalculateCareerDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '?�사?�자 (YYYYMMDD)', 
    example: '19980110',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrDt?: string;

  @ApiProperty({ 
    description: '최초?�입?�자 (YYYYMMDD)', 
    example: '19980110',
    required: false 
  })
  @IsOptional()
  @IsString()
  fstInDt?: string;

  @ApiProperty({ 
    description: '최종철수?�자 (YYYYMMDD)', 
    example: '20241231',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastEndDt?: string;

  @ApiProperty({ 
    description: '최종?�력구분코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastAdbgDivCd?: string;

  @ApiProperty({ 
    description: '?�격�?코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlCd?: string;

  @ApiProperty({ 
    description: '?�격�?취득?�자 (YYYYMMDD)', 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlPurDt?: string;

  @ApiProperty({ 
    description: '?�사/?�주 구분 (1: ?�사, 2: ?�주)', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ownOutsDiv?: string;
}

// 경력 ?�데?�트 ?�청 DTO
export class UpdateCareerDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '?�사/?�주 구분 (1: ?�사, 2: ?�주)', 
    example: '1',
    required: true 
  })
  @IsString()
  ownOutsDiv: string;

  @ApiProperty({ 
    description: '?�격�?코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlCd?: string;

  @ApiProperty({ 
    description: '?�격�?취득?�자 (YYYYMMDD)', 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlPurDt?: string;

  @ApiProperty({ 
    description: '최초?�입?�자 (YYYYMMDD)', 
    example: '19980110',
    required: false 
  })
  @IsOptional()
  @IsString()
  fstInDt?: string;

  @ApiProperty({ 
    description: '최종철수?�자 (YYYYMMDD)', 
    example: '20241231',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastEndDt?: string;

  @ApiProperty({ 
    description: '경력계산기�??�자 (YYYYMMDD)', 
    example: '20240101',
    required: false 
  })
  @IsOptional()
  @IsString()
  carrCalcStndDt?: string;

  @ApiProperty({ 
    description: '경력구분코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  carrDivCd?: string;

  @ApiProperty({ 
    description: '최종기술?�급', 
    example: '9',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastTcnGrd?: string;

  @ApiProperty({ 
    description: '경력개월??, 
    example: '300',
    required: false 
  })
  @IsOptional()
  @IsString()
  carrMcnt?: string;

  @ApiProperty({ 
    description: '?�력경력개월??, 
    example: '120',
    required: false 
  })
  @IsOptional()
  @IsString()
  adbgCarrMcnt?: string;

  @ApiProperty({ 
    description: '?�격경력개월??, 
    example: '60',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlCarrMcnt?: string;

  @ApiProperty({ 
    description: '?�사?�자격경?�개?�수', 
    example: '0',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrBefCtqlCarr?: string;

  @ApiProperty({ 
    description: '?�사?�학?�경?�개?�수', 
    example: '0',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrBefAdbgCarr?: string;

  @ApiProperty({ 
    description: '?�용??ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}





// ?�사발령 검???�청 DTO
export class SearchAppointmentDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;
}

// ?�사발령 ?�???�청 DTO
export class SaveAppointmentDto {
  @ApiProperty({ 
    description: '모드 (NEW: ?�규, MOD: ?�정)', 
    example: 'NEW',
    enum: ['NEW', 'MOD'],
    required: true 
  })
  @IsEnum(['NEW', 'MOD'])
  mode: string;

  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '?�련번호 (?�정 ?�에�??�요)', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  seqNo?: string;

  @ApiProperty({ 
    description: '발령구분 (1: ?�사, 2: ?�진, 3: ?�동, 4: ?�사)', 
    example: '2',
    required: true 
  })
  @IsString()
  apntDiv: string;

  @ApiProperty({ 
    description: '발령?�자 (YYYYMMDD)', 
    example: '20250721',
    required: true 
  })
  @IsString()
  apntDt: string;

  @ApiProperty({ 
    description: '발령본�? 코드', 
    example: '25',
    required: true 
  })
  @IsString()
  hqDivCd: string;

  @ApiProperty({ 
    description: '발령부??코드', 
    example: '2501',
    required: true 
  })
  @IsString()
  deptDivCd: string;

  @ApiProperty({ 
    description: '발령직책 코드', 
    example: '9',
    required: true 
  })
  @IsString()
  dutyCd: string;

  @ApiProperty({ 
    description: '비고', 
    example: '?�기?�사발령',
    required: false 
  })
  @IsOptional()
  @IsString()
  rmk?: string;

  @ApiProperty({ 
    description: '?�용??ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// ?�사발령 ??�� ?�청 DTO
export class DeleteAppointmentDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '?�련번호', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  seqNo?: string;

  @ApiProperty({ 
    description: '?�용??ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// 기술?�급?�력 조회 ?�청 DTO
export class TechnicalGradeHistoryDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;
}

// ?�로??경력 조회 ?�청 DTO
export class ProfileCareerDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;
}

// ?�사발령 ?�괄?�록 ?�청 DTO
export class BatchRegisterAppointmentDto {
  @ApiProperty({ 
    description: '?�사발령 ?�이??(구분^발령?�자^?�번^본�?코드^부?�코??직책코드^비고|)', 
    example: '2^2024/07/21^10005^25^2501^9^?�기?�사발령|',
    required: true 
  })
  @IsString()
  appointmentData: string;

  @ApiProperty({ 
    description: '?�용??ID', 
    example: 'USER_ID',
    required: true 
  })
  @IsString()
  userId: string;
}

// ?�원 ?�보 ?�데?�트 ?�청 DTO
export class UpdateEmployeeDto {
  @ApiProperty({ 
    description: '모드 (NEW: ?�규, MOD: ?�정)', 
    example: 'NEW',
    enum: ['NEW', 'MOD'],
    required: true 
  })
  @IsEnum(['NEW', 'MOD'])
  mode: string;

  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '?�사/?�주 구분 (1: ?�사, 2: ?�주)', 
    example: '1',
    required: true 
  })
  @IsString()
  ownOutsDiv: string;

  @ApiProperty({ 
    description: '?�체�?, 
    example: '비스?�정보기??,
    required: false 
  })
  @IsOptional()
  @IsString()
  crpnNm?: string;

  @ApiProperty({ 
    description: '?�체번호', 
    example: 'ENTR001',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrNo?: string;

  @ApiProperty({ 
    description: '?�사코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrCd?: string;

  @ApiProperty({ 
    description: '?�원?�명', 
    example: '?�길??,
    required: true 
  })
  @IsString()
  empNm: string;

  @ApiProperty({ 
    description: '?�문?�명', 
    example: 'Hong Gil Dong',
    required: false 
  })
  @IsOptional()
  @IsString()
  empEngNm?: string;

  @ApiProperty({ 
    description: '주�??�록번호', 
    example: '123456-1234567',
    required: false 
  })
  @IsOptional()
  @IsString()
  resRegNo?: string;

  @ApiProperty({ 
    description: '?�년?�일', 
    example: '19800101',
    required: false 
  })
  @IsOptional()
  @IsString()
  birYrMnDt?: string;

  @ApiProperty({ 
    description: '?�별구분코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  sexDivCd?: string;

  @ApiProperty({ 
    description: '�?��구분코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ntltDivCd?: string;

  @ApiProperty({ 
    description: '?�사?�자', 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrDt?: string;

  @ApiProperty({ 
    description: '?�사?�자', 
    example: '20241231',
    required: false 
  })
  @IsOptional()
  @IsString()
  retirDt?: string;

  @ApiProperty({ 
    description: '본�?구분코드', 
    example: '25',
    required: false 
  })
  @IsOptional()
  @IsString()
  hqDivCd?: string;

  @ApiProperty({ 
    description: '부?�구분코??, 
    example: '2501',
    required: false 
  })
  @IsOptional()
  @IsString()
  deptDivCd?: string;

  @ApiProperty({ 
    description: '직책코드', 
    example: '9',
    required: false 
  })
  @IsOptional()
  @IsString()
  dutyCd?: string;

  @ApiProperty({ 
    description: '최종기술?�급', 
    example: '9',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastTcnGrd?: string;

  @ApiProperty({ 
    description: '?�메?�주??, 
    example: 'hong@bist.co.kr',
    required: false 
  })
  @IsOptional()
  @IsString()
  emailAddr?: string;

  @ApiProperty({ 
    description: '?��??�번??, 
    example: '010-1234-5678',
    required: false 
  })
  @IsOptional()
  @IsString()
  mobPhnNo?: string;

  @ApiProperty({ 
    description: '집전?�번??, 
    example: '02-1234-5678',
    required: false 
  })
  @IsOptional()
  @IsString()
  homeTel?: string;

  @ApiProperty({ 
    description: '?�편번호', 
    example: '12345',
    required: false 
  })
  @IsOptional()
  @IsString()
  homeZipNo?: string;

  @ApiProperty({ 
    description: '주소', 
    example: '?�울??강남�?,
    required: false 
  })
  @IsOptional()
  @IsString()
  homeAddr?: string;

  @ApiProperty({ 
    description: '?�세주소', 
    example: '?�헤?��?123',
    required: false 
  })
  @IsOptional()
  @IsString()
  homeDetAddr?: string;

  @ApiProperty({ 
    description: '최종?�입?�자', 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastInDt?: string;

  @ApiProperty({ 
    description: '최종철수?�자', 
    example: '20241231',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastEndDt?: string;

  @ApiProperty({ 
    description: '?�입?�수', 
    example: '5',
    required: false 
  })
  @IsOptional()
  @IsString()
  inTcnt?: string;

  @ApiProperty({ 
    description: '최종?�력구분', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastAdbgDiv?: string;

  @ApiProperty({ 
    description: '최종?�교', 
    example: '?�울?�?�교',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastSchl?: string;

  @ApiProperty({ 
    description: '?�공', 
    example: '컴퓨?�공??,
    required: false 
  })
  @IsOptional()
  @IsString()
  majr?: string;

  @ApiProperty({ 
    description: '최종졸업?�자', 
    example: '20100101',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastGradDt?: string;

  @ApiProperty({ 
    description: '?�격증코??, 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlCd?: string;

  @ApiProperty({ 
    description: '?�격증취?�일??, 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlPurDt?: string;

  @ApiProperty({ 
    description: '경력개월??, 
    example: '120',
    required: false 
  })
  @IsOptional()
  @IsString()
  carrMcnt?: string;

  @ApiProperty({ 
    description: '경력?�월', 
    example: '10??0개월',
    required: false 
  })
  @IsOptional()
  @IsString()
  carrYm?: string;

  @ApiProperty({ 
    description: '근무?�태구분코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  wkgStDivCd?: string;

  @ApiProperty({ 
    description: 'KOSA?�록?��?', 
    example: 'Y',
    required: false 
  })
  @IsOptional()
  @IsString()
  kosaRegYn?: string;

  @ApiProperty({ 
    description: 'KOSA갱신?�자', 
    example: '20240101',
    required: false 
  })
  @IsOptional()
  @IsString()
  kosaRnwDt?: string;

  @ApiProperty({ 
    description: '최초?�입?�자', 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  fstInDt?: string;

  @ApiProperty({ 
    description: '?�사?�경??, 
    example: '60',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrBefCarr?: string;

  @ApiProperty({ 
    description: '?�사?�학?�경??, 
    example: '30',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrBefAdbgCarr?: string;

  @ApiProperty({ 
    description: '?�사?�자격경??, 
    example: '30',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrBefCtqlCarr?: string;

  @ApiProperty({ 
    description: '경력구분코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  carrDivCd?: string;

  @ApiProperty({ 
    description: '?�력경력개월??, 
    example: '60',
    required: false 
  })
  @IsOptional()
  @IsString()
  adbgCarrMcnt?: string;

  @ApiProperty({ 
    description: '?�격경력개월??, 
    example: '30',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlCarrMcnt?: string;

  @ApiProperty({ 
    description: '경력계산기�??�자', 
    example: '20240101',
    required: false 
  })
  @IsOptional()
  @IsString()
  carrCalcStndDt?: string;

  @ApiProperty({ 
    description: '?�사?�학?�경??, 
    example: '120',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrAftAdbgCarr?: string;

  @ApiProperty({ 
    description: '?�사?�자격경??, 
    example: '60',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrAftCtqlCarr?: string;

  @ApiProperty({ 
    description: '비고', 
    example: '?�이?�항 ?�음',
    required: false 
  })
  @IsOptional()
  @IsString()
  rmk?: string;

  @ApiProperty({ 
    description: '?�용??ID', 
    example: 'USER_ID',
    required: true 
  })
  @IsString()
  userId: string;
}

// API ?�답 DTO
export class ApiResponseDto<T = any> {
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

// ?�원 ?�보 ??�� ?�청 DTO
export class DeleteEmployeeDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: 'EMP001',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '로그???�용??ID', 
    example: 'USER001',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// ?�로??리스??조회 ?�청 DTO
export class ProfileListDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '?�용??ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// ?�로???�록 ?�청 DTO
export class ProfileInsertDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '?�업번호', 
    example: 'BSN001',
    required: false 
  })
  @IsOptional()
  @IsString()
  bsnNo?: string;

  @ApiProperty({ 
    description: '?�작?�자 (YYYYMMDD)', 
    example: '20250101',
    required: true 
  })
  @IsString()
  strtDate: string;

  @ApiProperty({ 
    description: '종료?�자 (YYYYMMDD)', 
    example: '20250731',
    required: true 
  })
  @IsString()
  endDate: string;

  @ApiProperty({ 
    description: '?�로?�트�?, 
    example: '?�신?�비 ?�설??리뉴??,
    required: true 
  })
  @IsString()
  prjtNm: string;

  @ApiProperty({ 
    description: '고객??, 
    example: 'KB�???�??,
    required: false 
  })
  @IsOptional()
  @IsString()
  mmbrCo?: string;

  @ApiProperty({ 
    description: '개발?�경/DBMS/?�어', 
    example: 'Java, Spring, Oracle',
    required: false 
  })
  @IsOptional()
  @IsString()
  delpEnvr?: string;

  @ApiProperty({ 
    description: '??��', 
    example: '개발??,
    required: false 
  })
  @IsOptional()
  @IsString()
  roleNm?: string;

  @ApiProperty({ 
    description: '?�무', 
    example: '백엔??개발',
    required: false 
  })
  @IsOptional()
  @IsString()
  taskNm?: string;

  @ApiProperty({ 
    description: '비고', 
    example: '?�이?�항 ?�음',
    required: false 
  })
  @IsOptional()
  @IsString()
  rmk?: string;

  @ApiProperty({ 
    description: '?�용??ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// ?�로???�정 ?�청 DTO
export class ProfileUpdateDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '?�련번호', 
    example: '1',
    required: true 
  })
  @IsString()
  seqNo: string;

  @ApiProperty({ 
    description: '?�업번호', 
    example: 'BSN001',
    required: false 
  })
  @IsOptional()
  @IsString()
  bsnNo?: string;

  @ApiProperty({ 
    description: '?�작?�자 (YYYYMMDD)', 
    example: '20250101',
    required: true 
  })
  @IsString()
  strtDate: string;

  @ApiProperty({ 
    description: '종료?�자 (YYYYMMDD)', 
    example: '20250731',
    required: true 
  })
  @IsString()
  endDate: string;

  @ApiProperty({ 
    description: '?�로?�트�?, 
    example: '?�신?�비 ?�설??리뉴??,
    required: true 
  })
  @IsString()
  prjtNm: string;

  @ApiProperty({ 
    description: '고객??, 
    example: 'KB�???�??,
    required: false 
  })
  @IsOptional()
  @IsString()
  mmbrCo?: string;

  @ApiProperty({ 
    description: '개발?�경/DBMS/?�어', 
    example: 'Java, Spring, Oracle',
    required: false 
  })
  @IsOptional()
  @IsString()
  delpEnvr?: string;

  @ApiProperty({ 
    description: '??��', 
    example: '개발??,
    required: false 
  })
  @IsOptional()
  @IsString()
  roleNm?: string;

  @ApiProperty({ 
    description: '?�무', 
    example: '백엔??개발',
    required: false 
  })
  @IsOptional()
  @IsString()
  taskNm?: string;

  @ApiProperty({ 
    description: '비고', 
    example: '?�이?�항 ?�음',
    required: false 
  })
  @IsOptional()
  @IsString()
  rmk?: string;

  @ApiProperty({ 
    description: '?�용??ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// ?�로????�� ?�청 DTO
export class ProfileDeleteDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '?�련번호', 
    example: '1',
    required: true 
  })
  @IsString()
  seqNo: string;

  @ApiProperty({ 
    description: '?�용??ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// ?�로??경력 계산 ?�이??조회 ?�청 DTO
export class ProfileCarrCalcDto {
  @ApiProperty({ 
    description: '?�원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '?�용??ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}




