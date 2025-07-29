import { TblUserRole, TblUserRolePgmGrp, ProgramGroupData } from "../types";

const API_URL = "/api/sys/user-roles";

// ë©”ë‰´ ëª©ë¡ ì¡°íšŒ
export const fetchMenus = async () => {
	const response = await fetch(`${API_URL}/menus`);
	if (response.status !== 200) {
		throw new Error("Failed to fetch menus");
	}
	return response.json();
};

interface SavePayload {
	createdRows: TblUserRole[];
	updatedRows: TblUserRole[];
	deletedRows: TblUserRole[];
}

/**
 * ?¬ìš©????•  ëª©ë¡??ì¡°íšŒ?˜ëŠ” API
 * @param searchConditions - ì¡°íšŒ ì¡°ê±´ (? íƒ?¬í•­)
 * @returns TblUserRole[]
 */
export const fetchUserRoles = async (searchConditions?: {
	usrRoleId?: string;
	useYn?: string;
}): Promise<TblUserRole[]> => {
	const params = new URLSearchParams();
	if (searchConditions?.usrRoleId) {
		params.append("usrRoleId", searchConditions.usrRoleId);
	}
	if (searchConditions?.useYn) {
		params.append("useYn", searchConditions.useYn);
	}

	const url = params.toString()
		? `${API_URL}/user-roles?${params.toString()}`
		: `${API_URL}/user-roles`;
	const response = await fetch(url);
	if (response.status !== 200) {
		throw new Error("?¬ìš©????•  ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.");
	}
	return response.json();
};

/**
 * ?¬ìš©????•  ?•ë³´ë¥??€???ì„±, ?˜ì •, ?? œ)?˜ëŠ” API
 * @param payload - ?€?¥í•  ?°ì´??
 * @returns ?€?¥ëœ ??•  ?•ë³´
 */
export const saveUserRoles = async (
	payload: SavePayload
): Promise<{ message: string; savedRoles: TblUserRole[] }> => {
	// ?”í‹°?°ì— ?†ëŠ” ?„ë“œ(menuNm ?? ?œê±°
	const cleanRows = (rows: any[] = []) =>
		rows.map(({ menuNm, cnt, ...rest }) => rest);

	const cleanPayload = {
		createdRows: cleanRows(payload.createdRows),
		updatedRows: cleanRows(payload.updatedRows),
		deletedRows: cleanRows(payload.deletedRows),
	};

	const response = await fetch(`${API_URL}/user-roles`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(cleanPayload),
	});

	if (response.status !== 200) {
		const errorData = await response.json();
		throw new Error(errorData.message || "?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.");
	}

	return response.json();
};

/**
 * ?¹ì • ?¬ìš©????• ???í•œ ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡??ì¡°íšŒ?˜ëŠ” API
 * @param usrRoleId - ?¬ìš©????•  ID
 * @returns ProgramGroupData[]
 */
export const fetchProgramGroups = async (
	usrRoleId: string
): Promise<ProgramGroupData[]> => {
	const response = await fetch(
		`${API_URL}/user-roles/${usrRoleId}/program-groups`
	);
	if (response.status !== 200) {
		throw new Error("?„ë¡œê·¸ë¨ ê·¸ë£¹ ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.");
	}
	return response.json();
};

/**
 * ëª¨ë“  ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡??ì¡°íšŒ?˜ëŠ” API (? ê·œ ???¬ìš©)
 * @returns ProgramGroupData[]
 */
export const fetchAllProgramGroups = async (): Promise<ProgramGroupData[]> => {
	const response = await fetch(`${API_URL}/program-groups`);
	if (response.status !== 200) {
		throw new Error("?„ë¡œê·¸ë¨ ê·¸ë£¹ ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤.");
	}
	return response.json();
};

/**
 * ?¹ì • ?¬ìš©????• ???„ë¡œê·¸ë¨ ê·¸ë£¹???€?¥í•˜??API
 * @param usrRoleId - ?¬ìš©????•  ID
 * @param payload - ?€?¥í•  ?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡
 */
export const saveProgramGroups = async (
	usrRoleId: string,
	payload: TblUserRolePgmGrp[]
): Promise<void> => {
	const response = await fetch(
		`${API_URL}/user-roles/${usrRoleId}/program-groups`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}
	);

	if (response.status !== 200) {
		const errorData = await response.json();
		throw new Error(errorData.message || "?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.");
	}
};

/**
 * ?¹ì • ?¬ìš©????• ??ë³µì‚¬?˜ëŠ” API
 * @param originalRoleId - ë³µì‚¬???ë³¸ ??•  ID
 * @returns ?ì„±???ˆë¡œ????•  ?•ë³´
 */
export const copyUserRole = async (
	originalRoleId: string
): Promise<TblUserRole> => {
	const response = await fetch(`${API_URL}/user-roles/${originalRoleId}/copy`, {
		method: "POST",
	});

	if (response.status !== 200) {
		const errorData = await response.json();
		throw new Error(errorData.message || "??•  ë³µì‚¬???¤íŒ¨?ˆìŠµ?ˆë‹¤.");
	}
	return response.json();
};

export const fetchDeptCodesByHq = async (hqDivCd: string) => {
	const response = await fetch(`/api/common/dept-by-hq`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ hqDivCd }),
	});
	if (response.status !== 200) {
		throw new Error("ë¶€??ì½”ë“œ ì¡°íšŒ ?¤íŒ¨");
	}
	const result = await response.json();
	if (!result.success) {
		throw new Error("ë¶€??ì½”ë“œ ì¡°íšŒ ?¤íŒ¨");
	}
	return result.data;
};


