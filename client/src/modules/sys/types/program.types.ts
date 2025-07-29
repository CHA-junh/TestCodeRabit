export interface Program {
  pgmId: string;
  pgmNm: string;
  pgmDivCd: string;
  scrnDvcd?: string; // 화면 구분 코드 (SEIZE_TO_BIST와 동일)
  bizDivCd: string;
  sortSeq: number;
  useYn: string;
  linkPath?: string;
  pgmHght?: number | null;
  pgmWdth?: number | null;
  pgmPsnTop?: number | null;
  pgmPsnLft?: number | null;
  popupMoni?: string;
  tgtMdiDivCd?: string;
  popupSwtUseYn?: string;
  svcSrvrId?: string;
  linkSvcId?: string;
  upPgmId?: string;
  regDttm?: string;
  chngDttm?: string;
  chngrId?: string;
  pgmDivNm?: string;
  bizDivNm?: string;
}

export interface ProgramCreateDto {
  pgmId: string;
  pgmNm: string;
  pgmDivCd?: string;
  scrnDvcd?: string; // 화면 구분 코드 (SEIZE_TO_BIST와 동일)
  bizDivCd?: string;
  sortSeq?: number;
  useYn?: string;
  linkPath?: string;
  pgmHght?: number | null;
  pgmWdth?: number | null;
  pgmPsnTop?: number | null;
  pgmPsnLft?: number | null;
  popupMoni?: string;
  tgtMdiDivCd?: string;
  popupSwtUseYn?: string;
  svcSrvrId?: string;
  linkSvcId?: string;
  upPgmId?: string;
}

export interface ProgramUpdateDto {
  pgmNm?: string;
  pgmDivCd?: string;
  bizDivCd?: string;
  sortSeq?: number;
  useYn?: string;
  linkPath?: string;
  pgmHght?: number | null;
  pgmWdth?: number | null;
  pgmPsnTop?: number | null;
  pgmPsnLft?: number | null;
  popupMoni?: string;
  tgtMdiDivCd?: string;
  popupSwtUseYn?: string;
  svcSrvrId?: string;
  linkSvcId?: string;
  upPgmId?: string;
}

export interface ProgramSearchParams {
  pgmKwd?: string;
  pgmDivCd?: string;
  useYn?: string;
  bizDivCd?: string;
  page?: number;
  limit?: number;
}

export interface ProgramListResponse {
  data: Program[];
  total: number;
  page: number;
  limit: number;
} 