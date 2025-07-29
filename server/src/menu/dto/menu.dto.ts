export interface MenuDto {
  menuSeq: number;
  menuDspNm: string;
  pgmId: string | null;
  menuShpDvcd: string;
  hgrkMenuSeq: number;
  flag: number;
  menuUseYn: string;
  menuLvl: number;
  mapTitle: string;
  menuPath: string;
  children?: MenuDto[];
}
