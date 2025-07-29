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
 * 사용자 역할 목록을 조회하는 API
 * @param searchConditions - 조회 조건 (선택사항)
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
		throw new Error("사용자 역할 조회에 실패했습니다.");
	}
	return response.json();
};

/**
 * 사용자 역할 정보를 저장(생성, 수정, 삭제)하는 API
 * @param payload - 저장할 데이터
 * @returns 저장된 역할 정보
 */
export const saveUserRoles = async (
	payload: SavePayload
): Promise<{ message: string; savedRoles: TblUserRole[] }> => {
	// 엔티티에 없는 필드(menuNm 등) 제거
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
		throw new Error(errorData.message || "저장에 실패했습니다.");
	}

	return response.json();
};

/**
 * 특정 사용자 역할에 속한 프로그램 그룹 목록을 조회하는 API
 * @param usrRoleId - 사용자 역할 ID
 * @returns ProgramGroupData[]
 */
export const fetchProgramGroups = async (
	usrRoleId: string
): Promise<ProgramGroupData[]> => {
	const response = await fetch(
		`${API_URL}/user-roles/${usrRoleId}/program-groups`
	);
	if (response.status !== 200) {
		throw new Error("프로그램 그룹 조회에 실패했습니다.");
	}
	return response.json();
};

/**
 * 모든 프로그램 그룹 목록을 조회하는 API (신규 시 사용)
 * @returns ProgramGroupData[]
 */
export const fetchAllProgramGroups = async (): Promise<ProgramGroupData[]> => {
	const response = await fetch(`${API_URL}/program-groups`);
	if (response.status !== 200) {
		throw new Error("프로그램 그룹 조회에 실패했습니다.");
	}
	return response.json();
};

/**
 * 특정 사용자 역할의 프로그램 그룹을 저장하는 API
 * @param usrRoleId - 사용자 역할 ID
 * @param payload - 저장할 프로그램 그룹 목록
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
		throw new Error(errorData.message || "저장에 실패했습니다.");
	}
};

/**
 * 특정 사용자 역할을 복사하는 API
 * @param originalRoleId - 복사할 원본 역할 ID
 * @returns 생성된 새로운 역할 정보
 */
export const copyUserRole = async (
	originalRoleId: string
): Promise<TblUserRole> => {
	const response = await fetch(`${API_URL}/user-roles/${originalRoleId}/copy`, {
		method: "POST",
	});

	if (response.status !== 200) {
		const errorData = await response.json();
		throw new Error(errorData.message || "역할 복사에 실패했습니다.");
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
		throw new Error("부서 코드 조회 실패");
	}
	const result = await response.json();
	if (!result.success) {
		throw new Error("부서 코드 조회 실패");
	}
	return result.data;
};
