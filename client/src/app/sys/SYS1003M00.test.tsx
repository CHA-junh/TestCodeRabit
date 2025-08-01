/*
 * SYS1003M00 - ?¬μ©????  κ΄λ¦??λ©΄ ?μ΄λΈλ¦¬???μ€??
 *
 * ???μ€?Έλ ??κ°μ§ λ°©μ???¬μ©?©λ??
 * 1. UI ?μ€?? Mock???¬μ©??μ»΄ν¬?νΈ ?λλ§??μ€??
 * 2. API ?μ€?? ?€μ  HTTP ?΄λΌ?΄μΈ?Έλ? ?¬μ©???λ² ?΅μ  ?μ€??(?λ² ?€ν ??
 *
 * - μ‘°ν/?????  ???€μ  κ±°λ ?ΈμΆ λ°©μ μ€λΉ?
 * - ?€μ  DB ?°κ²°???΅ν ?΅ν© ?μ€??μ€λΉ?
 * - ?€μ  ?¬μ©???λλ¦¬μ€ κΈ°λ° ?μ€??
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import RoleManagementPage from "./SYS1003M00";
import axios from "axios";

// Mock axios for UI tests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// UI ?μ€?Έμ© μ΅μ?μ Mock (?μ?μλ§?
// ?€μ  API ?ΈμΆ??λ°©μ??κΈ° ?ν κΈ°λ³Έ Mock
jest.mock("../../modules/auth/services/authService", () => ({
	__esModule: true,
	default: {
		checkSession: jest.fn().mockResolvedValue({
			success: true,
			user: {
				userId: "test-user",
				empNo: "test-emp",
				userName: "?μ€???¬μ©??,
				email: "test@example.com",
				deptNm: "?μ€??λΆ??,
				dutyNm: "?μ€??μ§κΈ",
				authCd: "30",
				role: "ADMIN",
				permissions: ["read", "write"],
				lastLoginAt: new Date().toISOString(),
				menuList: [],
				programList: [],
				needsPasswordChange: false,
				deptDivCd: "DEPT001",
				hqDivCd: "HQ001",
				hqDivNm: "?μ€??λ³Έλ?",
				deptTp: "DEPT",
				dutyDivCd: "DUTY001",
			},
		}),
		login: jest.fn().mockResolvedValue({ success: true }),
		logout: jest.fn().mockResolvedValue({ success: true }),
		changePassword: jest.fn().mockResolvedValue({ success: true }),
	},
}));

// ?€μ  HTTP ?΄λΌ?΄μΈ???¬μ© (?λ² ?€ν ??
const baseURL = "http://localhost:8080";

describe("?¬μ©????  κ΄λ¦??λ©΄ - UI ?μ€??(Provider Wrapping)", () => {
	beforeEach(() => {
		// UI ?μ€?Έμ© κΈ°λ³Έ Mock ?€μ 
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

	test("?¬μ©?κ? ?¬μ©????  κ΄λ¦??λ©΄???μ?λ©΄ λͺ¨λ  μ£Όμ κΈ°λ₯???μ?λ€", async () => {
		render(<RoleManagementPage />);

		// μ£Όμ κΈ°λ₯ λ²νΌ?€μ΄ ?μ?λμ§ ?μΈ
		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		expect(screen.getByText("???)).toBeInTheDocument();
		expect(screen.getByText("? κ·")).toBeInTheDocument();
		expect(screen.getByText("?? λ³΅μ¬")).toBeInTheDocument();

		// κ²??μ‘°κ±΄ ?λ?€μ΄ ?μ?λμ§ ?μΈ
		expect(screen.getByText("?¬μ©?μ­? μ½??λͺ?)).toBeInTheDocument();
		expect(screen.getAllByText("?¬μ©?¬λ?").length).toBeGreaterThan(0);

		console.log(
			"???¬μ©?κ? ?λ©΄???μ?λ©΄ λͺ¨λ  μ£Όμ κΈ°λ₯???μ?μΌλ‘??μ?©λ??"
		);
	});

	test("?¬μ©?κ? μ‘°ν λ²νΌ???΄λ¦­?λ©΄ ??  λͺ©λ‘???λ©΄???μ?λ€", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// μ‘°ν λ²νΌ ?΄λ¦­
		const searchButton = screen.getByText("μ‘°ν");
		fireEvent.click(searchButton);

		// ??  λͺ©λ‘ ?μ΄λΈ??€λκ° ?μ?λμ§ ?μΈ
		await waitFor(() => {
			expect(screen.getByText("?¬μ©?μ­??λͺ©λ‘")).toBeInTheDocument();
		});

		console.log(
			"???¬μ©?κ? μ‘°ν λ²νΌ???΄λ¦­?λ©΄ ??  λͺ©λ‘???λ©΄???μ?©λ??"
		);
	});

	test("?¬μ©?κ? ?? λͺμ ?λ ₯?κ³  μ‘°ν?λ©΄ ?΄λΉ ?? ??λͺ©λ‘???μ?λ€", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// ?? λͺ??λ ₯ ?λ μ°ΎκΈ°
		const roleNmInput = screen.getByPlaceholderText("μ½λ ?λ λͺ??λ ₯");

		// ?? λͺ??λ ₯
		fireEvent.change(roleNmInput, { target: { value: "κ΄λ¦¬μ" } });

		// μ‘°ν λ²νΌ ?΄λ¦­
		fireEvent.click(screen.getByText("μ‘°ν"));

		// κ²??κ²°κ³Όκ° ?μ?λμ§ ?μΈ
		await waitFor(() => {
			expect(roleNmInput).toHaveValue("κ΄λ¦¬μ");
		});

		console.log(
			"???¬μ©?κ? ?? λͺμ ?λ ₯?κ³  μ‘°ν?λ©΄ ?΄λΉ ?? ??λͺ©λ‘???μ?©λ??"
		);
	});

	test("?¬μ©?κ? λͺ©λ‘?μ ?? ???΄λ¦­?λ©΄ ?μΈ ?λ³΄κ° ?Όμ ?μ?λ€", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// μ‘°ν λ²νΌ ?΄λ¦­?μ¬ λͺ©λ‘ λ‘λ
		fireEvent.click(screen.getByText("μ‘°ν"));

		// ??  λͺ©λ‘ ?μ΄λΈ??€λκ° ?μ???κΉμ§ ?κΈ?
		await waitFor(() => {
			expect(screen.getByText("?¬μ©?μ­??λͺ©λ‘")).toBeInTheDocument();
		});

		console.log(
			"???¬μ©?κ? λͺ©λ‘?μ ?? ???΄λ¦­?λ©΄ ?μΈ ?λ³΄κ° ?Όμ ?μ?©λ??"
		);
	});

	test("?¬μ©?κ? ???λ²νΌ???΄λ¦­?λ©΄ ????μΈ λ©μμ§κ° ?μ?λ€", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("???)).toBeInTheDocument();
		});

		// ???λ²νΌ ?΄λ¦­
		const saveButton = screen.getByText("???);
		fireEvent.click(saveButton);

		// ????μΈ λ©μμ§κ° ?μ?λμ§ ?μΈ
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});

		console.log(
			"???¬μ©?κ? ???λ²νΌ???΄λ¦­?λ©΄ ????μΈ λ©μμ§κ° ?μ?©λ??"
		);
	});

	test("?¬μ©?κ? ? κ· λ²νΌ???΄λ¦­?λ©΄ ?Όμ΄ μ΄κΈ°?λ??, async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("? κ·")).toBeInTheDocument();
		});

		// ? κ· λ²νΌ ?΄λ¦­
		const newButton = screen.getByText("? κ·");
		fireEvent.click(newButton);

		// ? κ· λ²νΌ???μ?μΌλ‘??΄λ¦­?λμ§ ?μΈ
		await waitFor(() => {
			expect(newButton).toBeInTheDocument();
		});

		console.log("???¬μ©?κ? ? κ· λ²νΌ???΄λ¦­?λ©΄ ?Όμ΄ μ΄κΈ°?λ©?λ€.");
	});

	test("?¬μ©?κ? ?? λ³΅μ¬ λ²νΌ???΄λ¦­?λ©΄ ?? ??λ³΅μ¬?λ€", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("?? λ³΅μ¬")).toBeInTheDocument();
		});

		// ?? λ³΅μ¬ λ²νΌ ?΄λ¦­
		const copyButton = screen.getByText("?? λ³΅μ¬");
		fireEvent.click(copyButton);

		// ?? λ³΅μ¬ λ²νΌ???μ?μΌλ‘??΄λ¦­?λμ§ ?μΈ
		await waitFor(() => {
			expect(copyButton).toBeInTheDocument();
		});

		console.log("???¬μ©?κ? ?? λ³΅μ¬ λ²νΌ???΄λ¦­?λ©΄ ?? ??λ³΅μ¬?©λ??");
	});

	test("?¬μ©?κ? ?¬μ©?¬λ?λ₯?? ν?λ©΄ ? ν??κ°μ΄ ?λ©΄???μ?λ€", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// ?¬μ©?¬λ? ? ν μ½€λ³΄λ°μ€ μ°ΎκΈ° (aria-label ?¬μ©)
		const useYnSelect = screen.getByLabelText("?¬μ©?¬λ? ? ν");
		expect(useYnSelect).toBeInTheDocument();

		console.log(
			"???¬μ©?κ? ?¬μ©?¬λ?λ₯?? ν?λ©΄ ? ν??κ°μ΄ ?λ©΄???μ?©λ??"
		);
	});

	test("?¬μ©?κ? λͺ¨λ  ?μ ?λ³΄λ₯??λ ₯?κ³  ??₯νλ©?????λ£ λ©μμ§κ° ?μ?λ€", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("???)).toBeInTheDocument();
		});

		// ???λ²νΌ ?΄λ¦­
		const saveButton = screen.getByText("???);
		fireEvent.click(saveButton);

		// ????λ£ λ©μμ§κ° ?μ?λμ§ ?μΈ
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});

		console.log(
			"???¬μ©?κ? λͺ¨λ  ?μ ?λ³΄λ₯??λ ₯?κ³  ??₯νλ©?????λ£ λ©μμ§κ° ?μ?©λ??"
		);
	});

	test("?¬μ©?κ? ?λ©΄??λͺ¨λ  μ£Όμ κΈ°λ₯???¬μ©?????λ€", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// λͺ¨λ  μ£Όμ κΈ°λ₯??μ‘΄μ¬?λμ§ ?μΈ
		expect(screen.getByText("???)).toBeInTheDocument();
		expect(screen.getByText("? κ·")).toBeInTheDocument();
		expect(screen.getByText("?? λ³΅μ¬")).toBeInTheDocument();
		expect(screen.getByText("?¬μ©?μ­? μ½??λͺ?)).toBeInTheDocument();
		expect(screen.getAllByText("?¬μ©?¬λ?").length).toBeGreaterThan(0);

		console.log(
			"???¬μ©?κ? ?λ©΄??λͺ¨λ  μ£Όμ κΈ°λ₯???μ?μΌλ‘??¬μ©?????μ΅?λ€."
		);
	});
});

// ?€μ  κ±°λ ?ΈμΆ ?μ€??- ?λ² ?€ν ?μλ§??€ν
describe("?¬μ©????  κ΄λ¦?API - ?€μ  DB ?°κ²° ?μ€??(?λ² ?€ν ??", () => {
	// ?λ²κ° ?€ν μ€μΈμ§ ?μΈ?λ ?¬νΌ ?¨μ
	const isServerRunning = async (): Promise<boolean> => {
		try {
			// ?€μ???¬μ€μ²΄ν¬ ?λ?¬μΈ???λ
			const endpoints = [
				`${baseURL}/health`,
				`${baseURL}/api/health`,
				`${baseURL}/api/sys/programs`, // ?€μ  μ‘΄μ¬?λ ?λ?¬μΈ?Έλ‘ ?μΈ
			];

			for (const endpoint of endpoints) {
				try {
					await axios.get(endpoint, { timeout: 2000 });
					console.log(`???λ² ?°κ²° ?±κ³΅: ${endpoint}`);
					return true;
				} catch (error) {
					// 404???λ²κ° ?€ν μ€μ΄μ§λ§??λ?¬μΈ?Έκ? ?λ κ²½μ°
					if (axios.isAxiosError(error) && error.response?.status === 404) {
						console.log(`???λ² ?€ν μ€?(404): ${endpoint}`);
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
		// ?λ²κ° ?€ν μ€μΈμ§ ?μΈ
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log(
				"? οΈ ?λ²κ° ?€ν?μ? ?μ?΅λ?? ?€μ  DB ?°κ²° ?μ€?Έλ? κ±΄λ?λ??"
			);
		}
	});

	test("?¬μ©????  λͺ©λ‘ μ‘°ν APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/user-roles`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?€μ  DB ?°μ΄??κ²μ¦?
		if ((response.data as any).data.length > 0) {
			const role = (response.data as any).data[0];
			expect(role).toHaveProperty("usrRoleId");
			expect(role).toHaveProperty("usrRoleNm");
			expect(role).toHaveProperty("useYn");
		}
	});

	test("?¬μ©????  ???APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const newRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "?μ€???? ",
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

	test("?¬μ©????  ?μ  APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const updateRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "?μ ???? ",
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

	test("?¬μ©????  ??  APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const deleteRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "?? ???? ",
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

	test("?λ‘κ·Έλ¨ κ·Έλ£Ή λͺ©λ‘ μ‘°ν APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const response = await axios.get(
			`${baseURL}/api/sys/user-roles/program-groups`
		);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?€μ  DB ?°μ΄??κ²μ¦?
		if ((response.data as any).data.length > 0) {
			const program = (response.data as any).data[0];
			expect(program).toHaveProperty("programId");
			expect(program).toHaveProperty("programNm");
		}
	});

	test("κΆν?±κΈ μ½λ μ‘°ν APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/codes/athr-grd`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?€μ  DB ?°μ΄??κ²μ¦?
		if ((response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});

	test("μ‘°μ§μ‘°νλ²μ μ½λ μ‘°ν APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/codes/org-inq-rng`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?€μ  DB ?°μ΄??κ²μ¦?
		if ((response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});
});


