// BIST_NEW/apps/server/src/entities/tbl-user-role.entity.ts 와 동일한 구조
export interface TblUserRole {
	usrRoleId: string;
	menuId: string;
	usrRoleNm: string;
	athrGrdCd: string;
	orgInqRngCd: string;
	baseOutputScrnPgmIdCtt: string;
	useYn: string;
	regDttm?: string;
	chngDttm?: string;
	chngrId?: string;
}

// BIST_NEW/apps/server/src/entities/tbl-user-role-pgm-grp.entity.ts 와 동일
export interface TblUserRolePgmGrp {
	usrRoleId: string;
	pgmGrpId: string;
	useYn: string;
	regDttm?: string;
	chngDttm?: string;
	chngrId?: string;
}

// 백엔드에서 반환하는 프로그램 그룹 데이터 구조
export interface ProgramGroupData {
	pgmGrpId: string;
	pgmGrpNm: string;
	pgmGrpUseYn: string;
	usrRoleId?: string;
	useYn?: string;
	cnt?: number;
}

export interface TblMenuInf {
	menuId: string;
	menuNm: string | null;
	useYn: string | null;
	regDttm: string | null;
	chngDttm: string | null;
	chngrId: string | null;
}
