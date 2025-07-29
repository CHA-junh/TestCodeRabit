import { TblUserRole, TblUserRolePgmGrp, ProgramGroupData } from "../types";

const API_URL = "/api/sys/user-roles";

// 메뉴 목록 조회
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
 * ?�용????�� 목록??조회?�는 API
 * @param searchConditions - 조회 조건 (?�택?�항)
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
		throw new Error("?�용????�� 조회???�패?�습?�다.");
	}
	return response.json();
};

/**
 * ?�용????�� ?�보�??�???�성, ?�정, ??��)?�는 API
 * @param payload - ?�?�할 ?�이??
 * @returns ?�?�된 ??�� ?�보
 */
export const saveUserRoles = async (
	payload: SavePayload
): Promise<{ message: string; savedRoles: TblUserRole[] }> => {
	// ?�티?�에 ?�는 ?�드(menuNm ?? ?�거
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
		throw new Error(errorData.message || "?�?�에 ?�패?�습?�다.");
	}

	return response.json();
};

/**
 * ?�정 ?�용????��???�한 ?�로그램 그룹 목록??조회?�는 API
 * @param usrRoleId - ?�용????�� ID
 * @returns ProgramGroupData[]
 */
export const fetchProgramGroups = async (
	usrRoleId: string
): Promise<ProgramGroupData[]> => {
	const response = await fetch(
		`${API_URL}/user-roles/${usrRoleId}/program-groups`
	);
	if (response.status !== 200) {
		throw new Error("?�로그램 그룹 조회???�패?�습?�다.");
	}
	return response.json();
};

/**
 * 모든 ?�로그램 그룹 목록??조회?�는 API (?�규 ???�용)
 * @returns ProgramGroupData[]
 */
export const fetchAllProgramGroups = async (): Promise<ProgramGroupData[]> => {
	const response = await fetch(`${API_URL}/program-groups`);
	if (response.status !== 200) {
		throw new Error("?�로그램 그룹 조회???�패?�습?�다.");
	}
	return response.json();
};

/**
 * ?�정 ?�용????��???�로그램 그룹???�?�하??API
 * @param usrRoleId - ?�용????�� ID
 * @param payload - ?�?�할 ?�로그램 그룹 목록
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
		throw new Error(errorData.message || "?�?�에 ?�패?�습?�다.");
	}
};

/**
 * ?�정 ?�용????��??복사?�는 API
 * @param originalRoleId - 복사???�본 ??�� ID
 * @returns ?�성???�로????�� ?�보
 */
export const copyUserRole = async (
	originalRoleId: string
): Promise<TblUserRole> => {
	const response = await fetch(`${API_URL}/user-roles/${originalRoleId}/copy`, {
		method: "POST",
	});

	if (response.status !== 200) {
		const errorData = await response.json();
		throw new Error(errorData.message || "??�� 복사???�패?�습?�다.");
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
		throw new Error("부??코드 조회 ?�패");
	}
	const result = await response.json();
	if (!result.success) {
		throw new Error("부??코드 조회 ?�패");
	}
	return result.data;
};


