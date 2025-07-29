/**
 * PSM (Personnel System Management) DTO 모음
 * 
 * 인사관리 시스템에서 사용되는 모든 Data Transfer Object를 정의합니다.
 * 각 DTO는 API 요청/응답의 데이터 구조를 정의하며, Swagger 문서화와 유효성 검증을 지원합니다.
 * 
 * 주요 DTO 그룹:
 * - 사원 관리: SearchEmployeesDto, EmployeeDetailDto, UpdateEmployeeDto, DeleteEmployeeDto
 * - 경력 관리: CalculateCareerDto, UpdateCareerDto, ProfileCareerDto
 * - 인사발령: SaveAppointmentDto, DeleteAppointmentDto, BatchRegisterAppointmentDto
 * - 공통 기능: DeptByHqDto, TechnicalGradeHistoryDto
 * - 응답 형식: ApiResponseDto
 * 
 * 모든 DTO는 class-validator를 사용한 유효성 검증과 Swagger 문서화를 포함합니다.
 * 
 * @author BIST Development Team
 * @since 2024
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

// 사원 검색 요청 DTO
export class SearchEmployeesDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: 'ALL',
    required: false 
  })
  @IsOptional()
  @IsString()
  empNo?: string;

  @ApiProperty({ 
    description: '사원성명', 
    example: '조병원',
    required: false 
  })
  @IsOptional()
  @IsString()
  empNm?: string;

  @ApiProperty({ 
    description: '자사/외주 구분 (1: 자사, 2: 외주)', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ownOutsDiv?: string;

  @ApiProperty({ 
    description: '본부 코드', 
    example: 'ALL',
    required: false 
  })
  @IsOptional()
  @IsString()
  hqDivCd?: string;

  @ApiProperty({ 
    description: '부서 코드', 
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
    description: '퇴사자 포함 여부 (Y/N)', 
    example: 'N',
    required: false 
  })
  @IsOptional()
  @IsString()
  retirYn?: string;

  @ApiProperty({ 
    description: '사용자 ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// 사원 상세 조회 요청 DTO
export class EmployeeDetailDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;
}

// 경력 계산 요청 DTO
export class CalculateCareerDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '입사일자 (YYYYMMDD)', 
    example: '19980110',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrDt?: string;

  @ApiProperty({ 
    description: '최초투입일자 (YYYYMMDD)', 
    example: '19980110',
    required: false 
  })
  @IsOptional()
  @IsString()
  fstInDt?: string;

  @ApiProperty({ 
    description: '최종철수일자 (YYYYMMDD)', 
    example: '20241231',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastEndDt?: string;

  @ApiProperty({ 
    description: '최종학력구분코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastAdbgDivCd?: string;

  @ApiProperty({ 
    description: '자격증 코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlCd?: string;

  @ApiProperty({ 
    description: '자격증 취득일자 (YYYYMMDD)', 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlPurDt?: string;

  @ApiProperty({ 
    description: '자사/외주 구분 (1: 자사, 2: 외주)', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ownOutsDiv?: string;
}

// 경력 업데이트 요청 DTO
export class UpdateCareerDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '자사/외주 구분 (1: 자사, 2: 외주)', 
    example: '1',
    required: true 
  })
  @IsString()
  ownOutsDiv: string;

  @ApiProperty({ 
    description: '자격증 코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlCd?: string;

  @ApiProperty({ 
    description: '자격증 취득일자 (YYYYMMDD)', 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlPurDt?: string;

  @ApiProperty({ 
    description: '최초투입일자 (YYYYMMDD)', 
    example: '19980110',
    required: false 
  })
  @IsOptional()
  @IsString()
  fstInDt?: string;

  @ApiProperty({ 
    description: '최종철수일자 (YYYYMMDD)', 
    example: '20241231',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastEndDt?: string;

  @ApiProperty({ 
    description: '경력계산기준일자 (YYYYMMDD)', 
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
    description: '최종기술등급', 
    example: '9',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastTcnGrd?: string;

  @ApiProperty({ 
    description: '경력개월수', 
    example: '300',
    required: false 
  })
  @IsOptional()
  @IsString()
  carrMcnt?: string;

  @ApiProperty({ 
    description: '학력경력개월수', 
    example: '120',
    required: false 
  })
  @IsOptional()
  @IsString()
  adbgCarrMcnt?: string;

  @ApiProperty({ 
    description: '자격경력개월수', 
    example: '60',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlCarrMcnt?: string;

  @ApiProperty({ 
    description: '입사전자격경력개월수', 
    example: '0',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrBefCtqlCarr?: string;

  @ApiProperty({ 
    description: '입사전학력경력개월수', 
    example: '0',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrBefAdbgCarr?: string;

  @ApiProperty({ 
    description: '사용자 ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}





// 인사발령 검색 요청 DTO
export class SearchAppointmentDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;
}

// 인사발령 저장 요청 DTO
export class SaveAppointmentDto {
  @ApiProperty({ 
    description: '모드 (NEW: 신규, MOD: 수정)', 
    example: 'NEW',
    enum: ['NEW', 'MOD'],
    required: true 
  })
  @IsEnum(['NEW', 'MOD'])
  mode: string;

  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '일련번호 (수정 시에만 필요)', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  seqNo?: string;

  @ApiProperty({ 
    description: '발령구분 (1: 입사, 2: 승진, 3: 이동, 4: 퇴사)', 
    example: '2',
    required: true 
  })
  @IsString()
  apntDiv: string;

  @ApiProperty({ 
    description: '발령일자 (YYYYMMDD)', 
    example: '20250721',
    required: true 
  })
  @IsString()
  apntDt: string;

  @ApiProperty({ 
    description: '발령본부 코드', 
    example: '25',
    required: true 
  })
  @IsString()
  hqDivCd: string;

  @ApiProperty({ 
    description: '발령부서 코드', 
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
    example: '정기인사발령',
    required: false 
  })
  @IsOptional()
  @IsString()
  rmk?: string;

  @ApiProperty({ 
    description: '사용자 ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// 인사발령 삭제 요청 DTO
export class DeleteAppointmentDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '일련번호', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  seqNo?: string;

  @ApiProperty({ 
    description: '사용자 ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// 기술등급이력 조회 요청 DTO
export class TechnicalGradeHistoryDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;
}

// 프로필 경력 조회 요청 DTO
export class ProfileCareerDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;
}

// 인사발령 일괄등록 요청 DTO
export class BatchRegisterAppointmentDto {
  @ApiProperty({ 
    description: '인사발령 데이터 (구분^발령일자^사번^본부코드^부서코드^직책코드^비고|)', 
    example: '2^2024/07/21^10005^25^2501^9^정기인사발령|',
    required: true 
  })
  @IsString()
  appointmentData: string;

  @ApiProperty({ 
    description: '사용자 ID', 
    example: 'USER_ID',
    required: true 
  })
  @IsString()
  userId: string;
}

// 사원 정보 업데이트 요청 DTO
export class UpdateEmployeeDto {
  @ApiProperty({ 
    description: '모드 (NEW: 신규, MOD: 수정)', 
    example: 'NEW',
    enum: ['NEW', 'MOD'],
    required: true 
  })
  @IsEnum(['NEW', 'MOD'])
  mode: string;

  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '자사/외주 구분 (1: 자사, 2: 외주)', 
    example: '1',
    required: true 
  })
  @IsString()
  ownOutsDiv: string;

  @ApiProperty({ 
    description: '업체명', 
    example: '비스트정보기술',
    required: false 
  })
  @IsOptional()
  @IsString()
  crpnNm?: string;

  @ApiProperty({ 
    description: '업체번호', 
    example: 'ENTR001',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrNo?: string;

  @ApiProperty({ 
    description: '입사코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrCd?: string;

  @ApiProperty({ 
    description: '사원성명', 
    example: '홍길동',
    required: true 
  })
  @IsString()
  empNm: string;

  @ApiProperty({ 
    description: '영문성명', 
    example: 'Hong Gil Dong',
    required: false 
  })
  @IsOptional()
  @IsString()
  empEngNm?: string;

  @ApiProperty({ 
    description: '주민등록번호', 
    example: '123456-1234567',
    required: false 
  })
  @IsOptional()
  @IsString()
  resRegNo?: string;

  @ApiProperty({ 
    description: '생년월일', 
    example: '19800101',
    required: false 
  })
  @IsOptional()
  @IsString()
  birYrMnDt?: string;

  @ApiProperty({ 
    description: '성별구분코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  sexDivCd?: string;

  @ApiProperty({ 
    description: '국적구분코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ntltDivCd?: string;

  @ApiProperty({ 
    description: '입사일자', 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrDt?: string;

  @ApiProperty({ 
    description: '퇴사일자', 
    example: '20241231',
    required: false 
  })
  @IsOptional()
  @IsString()
  retirDt?: string;

  @ApiProperty({ 
    description: '본부구분코드', 
    example: '25',
    required: false 
  })
  @IsOptional()
  @IsString()
  hqDivCd?: string;

  @ApiProperty({ 
    description: '부서구분코드', 
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
    description: '최종기술등급', 
    example: '9',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastTcnGrd?: string;

  @ApiProperty({ 
    description: '이메일주소', 
    example: 'hong@bist.co.kr',
    required: false 
  })
  @IsOptional()
  @IsString()
  emailAddr?: string;

  @ApiProperty({ 
    description: '휴대폰번호', 
    example: '010-1234-5678',
    required: false 
  })
  @IsOptional()
  @IsString()
  mobPhnNo?: string;

  @ApiProperty({ 
    description: '집전화번호', 
    example: '02-1234-5678',
    required: false 
  })
  @IsOptional()
  @IsString()
  homeTel?: string;

  @ApiProperty({ 
    description: '우편번호', 
    example: '12345',
    required: false 
  })
  @IsOptional()
  @IsString()
  homeZipNo?: string;

  @ApiProperty({ 
    description: '주소', 
    example: '서울시 강남구',
    required: false 
  })
  @IsOptional()
  @IsString()
  homeAddr?: string;

  @ApiProperty({ 
    description: '상세주소', 
    example: '테헤란로 123',
    required: false 
  })
  @IsOptional()
  @IsString()
  homeDetAddr?: string;

  @ApiProperty({ 
    description: '최종투입일자', 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastInDt?: string;

  @ApiProperty({ 
    description: '최종철수일자', 
    example: '20241231',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastEndDt?: string;

  @ApiProperty({ 
    description: '투입횟수', 
    example: '5',
    required: false 
  })
  @IsOptional()
  @IsString()
  inTcnt?: string;

  @ApiProperty({ 
    description: '최종학력구분', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastAdbgDiv?: string;

  @ApiProperty({ 
    description: '최종학교', 
    example: '서울대학교',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastSchl?: string;

  @ApiProperty({ 
    description: '전공', 
    example: '컴퓨터공학',
    required: false 
  })
  @IsOptional()
  @IsString()
  majr?: string;

  @ApiProperty({ 
    description: '최종졸업일자', 
    example: '20100101',
    required: false 
  })
  @IsOptional()
  @IsString()
  lastGradDt?: string;

  @ApiProperty({ 
    description: '자격증코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlCd?: string;

  @ApiProperty({ 
    description: '자격증취득일자', 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlPurDt?: string;

  @ApiProperty({ 
    description: '경력개월수', 
    example: '120',
    required: false 
  })
  @IsOptional()
  @IsString()
  carrMcnt?: string;

  @ApiProperty({ 
    description: '경력년월', 
    example: '10년 0개월',
    required: false 
  })
  @IsOptional()
  @IsString()
  carrYm?: string;

  @ApiProperty({ 
    description: '근무상태구분코드', 
    example: '1',
    required: false 
  })
  @IsOptional()
  @IsString()
  wkgStDivCd?: string;

  @ApiProperty({ 
    description: 'KOSA등록여부', 
    example: 'Y',
    required: false 
  })
  @IsOptional()
  @IsString()
  kosaRegYn?: string;

  @ApiProperty({ 
    description: 'KOSA갱신일자', 
    example: '20240101',
    required: false 
  })
  @IsOptional()
  @IsString()
  kosaRnwDt?: string;

  @ApiProperty({ 
    description: '최초투입일자', 
    example: '20200101',
    required: false 
  })
  @IsOptional()
  @IsString()
  fstInDt?: string;

  @ApiProperty({ 
    description: '입사전경력', 
    example: '60',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrBefCarr?: string;

  @ApiProperty({ 
    description: '입사전학력경력', 
    example: '30',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrBefAdbgCarr?: string;

  @ApiProperty({ 
    description: '입사전자격경력', 
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
    description: '학력경력개월수', 
    example: '60',
    required: false 
  })
  @IsOptional()
  @IsString()
  adbgCarrMcnt?: string;

  @ApiProperty({ 
    description: '자격경력개월수', 
    example: '30',
    required: false 
  })
  @IsOptional()
  @IsString()
  ctqlCarrMcnt?: string;

  @ApiProperty({ 
    description: '경력계산기준일자', 
    example: '20240101',
    required: false 
  })
  @IsOptional()
  @IsString()
  carrCalcStndDt?: string;

  @ApiProperty({ 
    description: '입사후학력경력', 
    example: '120',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrAftAdbgCarr?: string;

  @ApiProperty({ 
    description: '입사후자격경력', 
    example: '60',
    required: false 
  })
  @IsOptional()
  @IsString()
  entrAftCtqlCarr?: string;

  @ApiProperty({ 
    description: '비고', 
    example: '특이사항 없음',
    required: false 
  })
  @IsOptional()
  @IsString()
  rmk?: string;

  @ApiProperty({ 
    description: '사용자 ID', 
    example: 'USER_ID',
    required: true 
  })
  @IsString()
  userId: string;
}

// API 응답 DTO
export class ApiResponseDto<T = any> {
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

// 사원 정보 삭제 요청 DTO
export class DeleteEmployeeDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: 'EMP001',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '로그인 사용자 ID', 
    example: 'USER001',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// 프로필 리스트 조회 요청 DTO
export class ProfileListDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '사용자 ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// 프로필 등록 요청 DTO
export class ProfileInsertDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '사업번호', 
    example: 'BSN001',
    required: false 
  })
  @IsOptional()
  @IsString()
  bsnNo?: string;

  @ApiProperty({ 
    description: '시작일자 (YYYYMMDD)', 
    example: '20250101',
    required: true 
  })
  @IsString()
  strtDate: string;

  @ApiProperty({ 
    description: '종료일자 (YYYYMMDD)', 
    example: '20250731',
    required: true 
  })
  @IsString()
  endDate: string;

  @ApiProperty({ 
    description: '프로젝트명', 
    example: '통신장비 재설정 리뉴얼',
    required: true 
  })
  @IsString()
  prjtNm: string;

  @ApiProperty({ 
    description: '고객사', 
    example: 'KB국민은행',
    required: false 
  })
  @IsOptional()
  @IsString()
  mmbrCo?: string;

  @ApiProperty({ 
    description: '개발환경/DBMS/언어', 
    example: 'Java, Spring, Oracle',
    required: false 
  })
  @IsOptional()
  @IsString()
  delpEnvr?: string;

  @ApiProperty({ 
    description: '역할', 
    example: '개발자',
    required: false 
  })
  @IsOptional()
  @IsString()
  roleNm?: string;

  @ApiProperty({ 
    description: '업무', 
    example: '백엔드 개발',
    required: false 
  })
  @IsOptional()
  @IsString()
  taskNm?: string;

  @ApiProperty({ 
    description: '비고', 
    example: '특이사항 없음',
    required: false 
  })
  @IsOptional()
  @IsString()
  rmk?: string;

  @ApiProperty({ 
    description: '사용자 ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// 프로필 수정 요청 DTO
export class ProfileUpdateDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '일련번호', 
    example: '1',
    required: true 
  })
  @IsString()
  seqNo: string;

  @ApiProperty({ 
    description: '사업번호', 
    example: 'BSN001',
    required: false 
  })
  @IsOptional()
  @IsString()
  bsnNo?: string;

  @ApiProperty({ 
    description: '시작일자 (YYYYMMDD)', 
    example: '20250101',
    required: true 
  })
  @IsString()
  strtDate: string;

  @ApiProperty({ 
    description: '종료일자 (YYYYMMDD)', 
    example: '20250731',
    required: true 
  })
  @IsString()
  endDate: string;

  @ApiProperty({ 
    description: '프로젝트명', 
    example: '통신장비 재설정 리뉴얼',
    required: true 
  })
  @IsString()
  prjtNm: string;

  @ApiProperty({ 
    description: '고객사', 
    example: 'KB국민은행',
    required: false 
  })
  @IsOptional()
  @IsString()
  mmbrCo?: string;

  @ApiProperty({ 
    description: '개발환경/DBMS/언어', 
    example: 'Java, Spring, Oracle',
    required: false 
  })
  @IsOptional()
  @IsString()
  delpEnvr?: string;

  @ApiProperty({ 
    description: '역할', 
    example: '개발자',
    required: false 
  })
  @IsOptional()
  @IsString()
  roleNm?: string;

  @ApiProperty({ 
    description: '업무', 
    example: '백엔드 개발',
    required: false 
  })
  @IsOptional()
  @IsString()
  taskNm?: string;

  @ApiProperty({ 
    description: '비고', 
    example: '특이사항 없음',
    required: false 
  })
  @IsOptional()
  @IsString()
  rmk?: string;

  @ApiProperty({ 
    description: '사용자 ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// 프로필 삭제 요청 DTO
export class ProfileDeleteDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '일련번호', 
    example: '1',
    required: true 
  })
  @IsString()
  seqNo: string;

  @ApiProperty({ 
    description: '사용자 ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

// 프로필 경력 계산 데이터 조회 요청 DTO
export class ProfileCarrCalcDto {
  @ApiProperty({ 
    description: '사원번호', 
    example: '10010',
    required: true 
  })
  @IsString()
  empNo: string;

  @ApiProperty({ 
    description: '사용자 ID', 
    example: 'system',
    required: false 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}


