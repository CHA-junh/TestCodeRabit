export interface Menu {
  MENU_ID: string;
  MENU_NM: string;
  USE_YN: string;
  SORT_SEQ: number;
  UP_MENU_ID?: string;
  MENU_LEVEL: number;
  MENU_PATH?: string;
  PGM_ID?: string;
  REG_DTTM?: string;
  CHNG_DTTM?: string;
  CHNGR_ID?: string;
  MENU_SEQ?: number;
  USER_CNT?: number;
  CHNGR_NM?: string;
}

export interface MenuCreateDto {
  MENU_NM: string;
  USE_YN: string;
  SORT_SEQ?: number;
  UP_MENU_ID?: string;
  MENU_LEVEL?: number;
  MENU_PATH?: string;
  PGM_ID?: string;
}

export interface MenuUpdateDto {
  MENU_NM?: string;
  USE_YN?: string;
  SORT_SEQ?: number;
  UP_MENU_ID?: string;
  MENU_LEVEL?: number;
  MENU_PATH?: string;
  PGM_ID?: string;
}

export interface MenuSearchParams {
  MENU_KWD?: string;
  USE_YN?: string;
  page?: number;
  limit?: number;
}

export interface MenuListResponse {
  data: Menu[];
  total: number;
  page: number;
  limit: number;
} 