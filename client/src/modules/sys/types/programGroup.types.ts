export interface ProgramGroup {
  pgmGrpId: string;
  pgmGrpNm: string;
  useYn: string;  // 실제 DB 컬럼명 USE_YN에 맞춰 useYn으로 통일
  cnt?: number;
}

export interface ProgramGroupDetail {
  pgmGrpId: string;
  pgmGrpNm: string;
  useYn: string;  // 실제 DB 컬럼명 USE_YN에 맞춰 useYn으로 수정
  regDttm?: string;
  chngDttm?: string;
  chngrId?: string;
}

export interface ProgramGroupProgram {
  pgmGrpId: string;
  pgmId: string;
  pgmNm: string;
  bizDivCd: string;
}

export interface ProgramGroupSearchParams {
  PGM_GRP_KWD?: string;
  PGM_GRP_NM?: string;
  USE_YN?: string;
  page?: number;
  limit?: number;
}

export interface ProgramGroupListResponse {
  success: boolean;
  data: ProgramGroup[];
  message: string;
  error?: string;
}

export interface ProgramGroupCreateDto {
  PGM_GRP_ID: string;
  PGM_GRP_NM: string;
  USE_YN: string;
}

export interface ProgramGroupUpdateDto {
  PGM_GRP_NM?: string;
  USE_YN?: string;
} 