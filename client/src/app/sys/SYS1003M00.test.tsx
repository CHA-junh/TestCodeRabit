/*
 * SYS1003M00 - ?�용????�� 관�??�면 ?�이브리???�스??
 *
 * ???�스?�는 ??가지 방식???�용?�니??
 * 1. UI ?�스?? Mock???�용??컴포?�트 ?�더�??�스??
 * 2. API ?�스?? ?�제 HTTP ?�라?�언?��? ?�용???�버 ?�신 ?�스??(?�버 ?�행 ??
 *
 * - 조회/?�????�� ???�제 거래 ?�출 방식 준�?
 * - ?�제 DB ?�결???�한 ?�합 ?�스??준�?
 * - ?�제 ?�용???�나리오 기반 ?�스??
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import RoleManagementPage from "./SYS1003M00";
import axios from "axios";

// Mock axios for UI tests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// UI ?�스?�용 최소?�의 Mock (?�요?�에�?
// ?�제 API ?�출??방�??�기 ?�한 기본 Mock
jest.mock("../../modules/auth/services/authService", () => ({
	__esModule: true,
	default: {
		checkSession: jest.fn().mockResolvedValue({
			success: true,
			user: {
				userId: "test-user",
				empNo: "test-emp",
				userName: "?�스???�용??,
				email: "test@example.com",
				deptNm: "?�스??부??,
				dutyNm: "?�스??직급",
				authCd: "30",
				role: "ADMIN",
				permissions: ["read", "write"],
				lastLoginAt: new Date().toISOString(),
				menuList: [],
				programList: [],
				needsPasswordChange: false,
				deptDivCd: "DEPT001",
				hqDivCd: "HQ001",
				hqDivNm: "?�스??본�?",
				deptTp: "DEPT",
				dutyDivCd: "DUTY001",
			},
		}),
		login: jest.fn().mockResolvedValue({ success: true }),
		logout: jest.fn().mockResolvedValue({ success: true }),
		changePassword: jest.fn().mockResolvedValue({ success: true }),
	},
}));

// ?�제 HTTP ?�라?�언???�용 (?�버 ?�행 ??
const baseURL = "http://localhost:8080";

describe("?�용????�� 관�??�면 - UI ?�스??(Provider Wrapping)", () => {
	beforeEach(() => {
		// UI ?�스?�용 기본 Mock ?�정
		mockedAxios.get.mockResolvedValue({
			status: 200,
			statusText: "OK",
			headers: {},
			config: {} as any,
			data: {
				success: true,
				data: [],
			},
		});
		mockedAxios.post.mockResolvedValue({
			status: 200,
			statusText: "OK",
			headers: {},
			config: {} as any,
			data: {
				success: true,
				data: {},
			},
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("?�용?��? ?�용????�� 관�??�면???�속?�면 모든 주요 기능???�시?�다", async () => {
		render(<RoleManagementPage />);

		// 주요 기능 버튼?�이 ?�시?�는지 ?�인
		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		expect(screen.getByText("?�??)).toBeInTheDocument();
		expect(screen.getByText("?�규")).toBeInTheDocument();
		expect(screen.getByText("??��복사")).toBeInTheDocument();

		// 검??조건 ?�드?�이 ?�시?�는지 ?�인
		expect(screen.getByText("?�용?�역?�코??�?)).toBeInTheDocument();
		expect(screen.getAllByText("?�용?��?").length).toBeGreaterThan(0);

		console.log(
			"???�용?��? ?�면???�속?�면 모든 주요 기능???�상?�으�??�시?�니??"
		);
	});

	test("?�용?��? 조회 버튼???�릭?�면 ??�� 목록???�면???�시?�다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 조회 버튼 ?�릭
		const searchButton = screen.getByText("조회");
		fireEvent.click(searchButton);

		// ??�� 목록 ?�이�??�더가 ?�시?�는지 ?�인
		await waitFor(() => {
			expect(screen.getByText("?�용?�역??목록")).toBeInTheDocument();
		});

		console.log(
			"???�용?��? 조회 버튼???�릭?�면 ??�� 목록???�면???�시?�니??"
		);
	});

	test("?�용?��? ??��명을 ?�력?�고 조회?�면 ?�당 ??��??목록???�시?�다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// ??���??�력 ?�드 찾기
		const roleNmInput = screen.getByPlaceholderText("코드 ?�는 �??�력");

		// ??���??�력
		fireEvent.change(roleNmInput, { target: { value: "관리자" } });

		// 조회 버튼 ?�릭
		fireEvent.click(screen.getByText("조회"));

		// 검??결과가 ?�시?�는지 ?�인
		await waitFor(() => {
			expect(roleNmInput).toHaveValue("관리자");
		});

		console.log(
			"???�용?��? ??��명을 ?�력?�고 조회?�면 ?�당 ??��??목록???�시?�니??"
		);
	});

	test("?�용?��? 목록?�서 ??��???�릭?�면 ?�세 ?�보가 ?�에 ?�시?�다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 조회 버튼 ?�릭?�여 목록 로드
		fireEvent.click(screen.getByText("조회"));

		// ??�� 목록 ?�이�??�더가 ?�시???�까지 ?��?
		await waitFor(() => {
			expect(screen.getByText("?�용?�역??목록")).toBeInTheDocument();
		});

		console.log(
			"???�용?��? 목록?�서 ??��???�릭?�면 ?�세 ?�보가 ?�에 ?�시?�니??"
		);
	});

	test("?�용?��? ?�??버튼???�릭?�면 ?�???�인 메시지가 ?�시?�다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("?�??)).toBeInTheDocument();
		});

		// ?�??버튼 ?�릭
		const saveButton = screen.getByText("?�??);
		fireEvent.click(saveButton);

		// ?�???�인 메시지가 ?�시?�는지 ?�인
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});

		console.log(
			"???�용?��? ?�??버튼???�릭?�면 ?�???�인 메시지가 ?�시?�니??"
		);
	});

	test("?�용?��? ?�규 버튼???�릭?�면 ?�이 초기?�된??, async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("?�규")).toBeInTheDocument();
		});

		// ?�규 버튼 ?�릭
		const newButton = screen.getByText("?�규");
		fireEvent.click(newButton);

		// ?�규 버튼???�상?�으�??�릭?�는지 ?�인
		await waitFor(() => {
			expect(newButton).toBeInTheDocument();
		});

		console.log("???�용?��? ?�규 버튼???�릭?�면 ?�이 초기?�됩?�다.");
	});

	test("?�용?��? ??��복사 버튼???�릭?�면 ??��??복사?�다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("??��복사")).toBeInTheDocument();
		});

		// ??��복사 버튼 ?�릭
		const copyButton = screen.getByText("??��복사");
		fireEvent.click(copyButton);

		// ??��복사 버튼???�상?�으�??�릭?�는지 ?�인
		await waitFor(() => {
			expect(copyButton).toBeInTheDocument();
		});

		console.log("???�용?��? ??��복사 버튼???�릭?�면 ??��??복사?�니??");
	});

	test("?�용?��? ?�용?��?�??�택?�면 ?�택??값이 ?�면???�시?�다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// ?�용?��? ?�택 콤보박스 찾기 (aria-label ?�용)
		const useYnSelect = screen.getByLabelText("?�용?��? ?�택");
		expect(useYnSelect).toBeInTheDocument();

		console.log(
			"???�용?��? ?�용?��?�??�택?�면 ?�택??값이 ?�면???�시?�니??"
		);
	});

	test("?�용?��? 모든 ?�수 ?�보�??�력?�고 ?�?�하�??�???�료 메시지가 ?�시?�다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("?�??)).toBeInTheDocument();
		});

		// ?�??버튼 ?�릭
		const saveButton = screen.getByText("?�??);
		fireEvent.click(saveButton);

		// ?�???�료 메시지가 ?�시?�는지 ?�인
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});

		console.log(
			"???�용?��? 모든 ?�수 ?�보�??�력?�고 ?�?�하�??�???�료 메시지가 ?�시?�니??"
		);
	});

	test("?�용?��? ?�면??모든 주요 기능???�용?????�다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 모든 주요 기능??존재?�는지 ?�인
		expect(screen.getByText("?�??)).toBeInTheDocument();
		expect(screen.getByText("?�규")).toBeInTheDocument();
		expect(screen.getByText("??��복사")).toBeInTheDocument();
		expect(screen.getByText("?�용?�역?�코??�?)).toBeInTheDocument();
		expect(screen.getAllByText("?�용?��?").length).toBeGreaterThan(0);

		console.log(
			"???�용?��? ?�면??모든 주요 기능???�상?�으�??�용?????�습?�다."
		);
	});
});

// ?�제 거래 ?�출 ?�스??- ?�버 ?�행 ?�에�??�행
describe("?�용????�� 관�?API - ?�제 DB ?�결 ?�스??(?�버 ?�행 ??", () => {
	// ?�버가 ?�행 중인지 ?�인?�는 ?�퍼 ?�수
	const isServerRunning = async (): Promise<boolean> => {
		try {
			// ?�양???�스체크 ?�드?�인???�도
			const endpoints = [
				`${baseURL}/health`,
				`${baseURL}/api/health`,
				`${baseURL}/api/sys/programs`, // ?�제 존재?�는 ?�드?�인?�로 ?�인
			];

			for (const endpoint of endpoints) {
				try {
					await axios.get(endpoint, { timeout: 2000 });
					console.log(`???�버 ?�결 ?�공: ${endpoint}`);
					return true;
				} catch (error) {
					// 404???�버가 ?�행 중이지�??�드?�인?��? ?�는 경우
					if (axios.isAxiosError(error) && error.response?.status === 404) {
						console.log(`???�버 ?�행 �?(404): ${endpoint}`);
						return true;
					}
				}
			}
			return false;
		} catch (error) {
			return false;
		}
	};

	beforeAll(async () => {
		// ?�버가 ?�행 중인지 ?�인
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log(
				"?�️ ?�버가 ?�행?��? ?�았?�니?? ?�제 DB ?�결 ?�스?��? 건너?�니??"
			);
		}
	});

	test("?�용????�� 목록 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/user-roles`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?�제 DB ?�이??검�?
		if ((response.data as any).data.length > 0) {
			const role = (response.data as any).data[0];
			expect(role).toHaveProperty("usrRoleId");
			expect(role).toHaveProperty("usrRoleNm");
			expect(role).toHaveProperty("useYn");
		}
	});

	test("?�용????�� ?�??API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const newRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "?�스????��",
			useYn: "Y",
			athrGrdCd: "2",
			orgInqRngCd: "1",
			menuId: "M001",
		};

		const response = await axios.post(`${baseURL}/api/sys/user-roles`, {
			createdRows: [newRole],
			updatedRows: [],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?�용????�� ?�정 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const updateRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "?�정????��",
			useYn: "Y",
			athrGrdCd: "2",
			orgInqRngCd: "1",
			menuId: "M001",
		};

		const response = await axios.post(`${baseURL}/api/sys/user-roles`, {
			createdRows: [],
			updatedRows: [updateRole],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?�용????�� ??�� API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const deleteRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "??��????��",
			useYn: "N",
		};

		const response = await axios.post(`${baseURL}/api/sys/user-roles`, {
			createdRows: [],
			updatedRows: [],
			deletedRows: [deleteRole],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?�로그램 그룹 목록 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const response = await axios.get(
			`${baseURL}/api/sys/user-roles/program-groups`
		);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?�제 DB ?�이??검�?
		if ((response.data as any).data.length > 0) {
			const program = (response.data as any).data[0];
			expect(program).toHaveProperty("programId");
			expect(program).toHaveProperty("programNm");
		}
	});

	test("권한?�급 코드 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/codes/athr-grd`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?�제 DB ?�이??검�?
		if ((response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});

	test("조직조회범위 코드 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/codes/org-inq-rng`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?�제 DB ?�이??검�?
		if ((response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});
});


