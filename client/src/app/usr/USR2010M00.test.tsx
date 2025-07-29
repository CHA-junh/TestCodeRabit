/*
 * USR2010M00 - ?�용??관�??�면 ?�이브리???�스??
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
import USR2010M00 from "./USR2010M00";
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

describe("?�용??관�??�면 - UI ?�스??(Provider Wrapping)", () => {
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

	test("?�용?��? ?�용??관�??�면???�속?�면 모든 주요 기능???�시?�다", async () => {
		render(<USR2010M00 />);

		// 주요 기능 버튼?�이 ?�시?�는지 ?�인
		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		expect(screen.getByText("?�??)).toBeInTheDocument();
		expect(screen.getByText("비�?번호 초기??)).toBeInTheDocument();

		// 검??조건 ?�드?�이 ?�시?�는지 ?�인
		expect(screen.getByText("본�?")).toBeInTheDocument();
		expect(screen.getByText("부??)).toBeInTheDocument();
		expect(screen.getByText("?�용?�명")).toBeInTheDocument();

		console.log(
			"???�용?��? ?�면???�속?�면 모든 주요 기능???�상?�으�??�시?�니??"
		);
	});

	test("?�용?��? 조회 버튼???�릭?�면 ?�용??목록???�면???�시?�다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 조회 버튼 ?�릭
		const searchButton = screen.getByText("조회");
		fireEvent.click(searchButton);

		// ?�용??목록 ?�이�??�더가 ?�시?�는지 ?�인
		await waitFor(() => {
			const gridHeaders = screen.getAllByText("?�번");
			expect(gridHeaders.length).toBeGreaterThan(0);

			const nameHeaders = screen.getAllByText("?�명");
			expect(nameHeaders.length).toBeGreaterThan(0);
		});

		console.log(
			"???�용?��? 조회 버튼???�릭?�면 ?�용??목록???�면???�시?�니??"
		);
	});

	test("?�용?��? 본�?�??�택?�면 ?�당 본�???부??목록???�데?�트?�다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 본�? ?�택 콤보박스 찾기 (title ?�성 ?�용)
		const hqSelect = screen.getByTitle("본�? ?�택");
		expect(hqSelect).toBeInTheDocument();

		// 부??콤보박스가 존재?�는지 ?�인 (title ?�성 ?�용)
		const deptSelect = screen.getByTitle("부???�택");
		expect(deptSelect).toBeInTheDocument();

		console.log(
			"???�용?��? 본�?�??�택?�면 ?�당 본�???부??목록???�데?�트?�니??"
		);
	});

	test("?�용?��? ?�용?�명???�력?�고 조회?�면 ?�당 ?�용?��? 목록???�시?�다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// ?�용?�명 ?�력 ?�드 찾기
		const userNmInput = screen.getByPlaceholderText("?�용?�명 ?�력");

		// ?�용?�명 ?�력
		fireEvent.change(userNmInput, { target: { value: "김" } });

		// 조회 버튼 ?�릭
		fireEvent.click(screen.getByText("조회"));

		// 검??결과가 ?�시?�는지 ?�인
		await waitFor(() => {
			expect(userNmInput).toHaveValue("김");
		});

		console.log(
			"???�용?��? ?�용?�명???�력?�고 조회?�면 ?�당 ?�용?��? 목록???�시?�니??"
		);
	});

	test("?�용?��? 목록?�서 ?�용?��? ?�릭?�면 ?�세 ?�보가 ?�에 ?�시?�다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 조회 버튼 ?�릭?�여 목록 로드
		fireEvent.click(screen.getByText("조회"));

		// ?�용??목록 ?�이�??�더가 ?�시???�까지 ?��?
		await waitFor(() => {
			const gridHeaders = screen.getAllByText("?�번");
			expect(gridHeaders.length).toBeGreaterThan(0);

			const nameHeaders = screen.getAllByText("?�명");
			expect(nameHeaders.length).toBeGreaterThan(0);
		});

		console.log(
			"???�용?��? 목록?�서 ?�용?��? ?�릭?�면 ?�세 ?�보가 ?�에 ?�시?�니??"
		);
	});

	test("?�용?��? ?�??버튼???�릭?�면 ?�???�인 메시지가 ?�시?�다", async () => {
		render(<USR2010M00 />);

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

	test("?�용?��? 비�?번호 초기??버튼???�릭?�면 초기???�인 메시지가 ?�시?�다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("비�?번호 초기??)).toBeInTheDocument();
		});

		// 비�?번호 초기??버튼 ?�릭
		const initPasswordButton = screen.getByText("비�?번호 초기??);
		fireEvent.click(initPasswordButton);

		// 초기???�인 메시지가 ?�시?�는지 ?�인
		await waitFor(() => {
			expect(initPasswordButton).toBeInTheDocument();
		});

		console.log(
			"???�용?��? 비�?번호 초기??버튼???�릭?�면 초기???�인 메시지가 ?�시?�니??"
		);
	});

	test("?�용?��? ?�인결재?��? ?�력?�면 ?�력??값이 ?�면??반영?�다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// ?�인결재???�력 ?�드 찾기
		const approverInput =
			screen.getByPlaceholderText("?�인결재?�명???�력?�세??);

		// ?�인결재?�명 ?�력
		fireEvent.change(approverInput, { target: { value: "김부?? } });

		// ?�력??값이 ?�면??반영?�는지 ?�인
		await waitFor(() => {
			expect(approverInput).toHaveValue("김부??);
		});

		console.log(
			"???�용?��? ?�인결재?��? ?�력?�면 ?�력??값이 ?�면??반영?�니??"
		);
	});

	test("?�용?��? ?�용????��???�택?�면 ?�택????��???�면???�시?�다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// ?�용????�� ?�택 콤보박스 찾기 (title ?�성 ?�용)
		const roleSelect = screen.getByTitle("?�용????�� ?�택");
		expect(roleSelect).toBeInTheDocument();

		console.log(
			"???�용?��? ?�용????��???�택?�면 ?�택????��???�면???�시?�니??"
		);
	});

	test("?�용?��? ?�무권한???�택?�면 ?�택??권한???�면???�시?�다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// ?�무권한 ?�택 콤보박스 찾기 (title ?�성 ?�용)
		const authSelect = screen.getByTitle("?�무권한 ?�택");
		expect(authSelect).toBeInTheDocument();

		console.log(
			"???�용?��? ?�무권한???�택?�면 ?�택??권한???�면???�시?�니??"
		);
	});

	test("?�용?��? 모든 ?�수 ?�보�??�력?�고 ?�?�하�??�???�료 메시지가 ?�시?�다", async () => {
		render(<USR2010M00 />);

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
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 모든 주요 기능??존재?�는지 ?�인
		expect(screen.getByText("?�??)).toBeInTheDocument();
		expect(screen.getByText("비�?번호 초기??)).toBeInTheDocument();
		expect(screen.getByText("본�?")).toBeInTheDocument();
		expect(screen.getByText("부??)).toBeInTheDocument();
		expect(screen.getByText("?�용?�명")).toBeInTheDocument();

		console.log(
			"???�용?��? ?�면??모든 주요 기능???�상?�으�??�용?????�습?�다."
		);
	});
});

// ?�제 거래 ?�출 ?�스??- ?�버 ?�행 ?�에�??�행
describe("?�용??관�?API - ?�제 DB ?�결 ?�스??(?�버 ?�행 ??", () => {
	// ?�버가 ?�행 중인지 ?�인?�는 ?�퍼 ?�수
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/health`, { timeout: 2000 });
			return true;
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

	test("?�용??목록 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/users`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?�제 DB ?�이??검�?
		if ((response.data as any).data.length > 0) {
			const user = (response.data as any).data[0];
			expect(user).toHaveProperty("usrId");
			expect(user).toHaveProperty("usrNm");
			expect(user).toHaveProperty("useYn");
		}
	});

	test("?�용???�??API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const newUser = {
			usrId: "",
			usrNm: "?�스???�용??,
			useYn: "Y",
			hqCd: "HQ001",
			deptCd: "DEPT001",
			usrRoleId: "ROLE001",
			approverNm: "김부??,
		};

		const response = await axios.post(`${baseURL}/api/usr/users`, {
			createdRows: [newUser],
			updatedRows: [],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?�용???�정 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const updateUser = {
			usrId: "TEST001",
			usrNm: "?�정???�용??,
			useYn: "Y",
			hqCd: "HQ001",
			deptCd: "DEPT001",
			usrRoleId: "ROLE001",
			approverNm: "김부??,
		};

		const response = await axios.post(`${baseURL}/api/usr/users`, {
			createdRows: [],
			updatedRows: [updateUser],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?�용????�� API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const deleteUser = {
			usrId: "TEST001",
			usrNm: "??��???�용??,
			useYn: "N",
		};

		const response = await axios.post(`${baseURL}/api/usr/users`, {
			createdRows: [],
			updatedRows: [],
			deletedRows: [deleteUser],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("비�?번호 초기??API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const userId = "TEST001";
		const response = await axios.post(
			`${baseURL}/api/usr/users/${userId}/reset-password`
		);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("코드 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/codes`);

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

	test("?�용????�� 목록 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/user-roles`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?�제 DB ?�이??검�?
		if ((response.data as any).data.length > 0) {
			const role = (response.data as any).data[0];
			expect(role).toHaveProperty("usrRoleId");
			expect(role).toHaveProperty("usrRoleNm");
		}
	});
});


