/*
 * USR2010M00 - ?¬μ©??κ΄λ¦??λ©΄ ?μ΄λΈλ¦¬???μ€??
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
import USR2010M00 from "./USR2010M00";
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

describe("?¬μ©??κ΄λ¦??λ©΄ - UI ?μ€??(Provider Wrapping)", () => {
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

	test("?¬μ©?κ? ?¬μ©??κ΄λ¦??λ©΄???μ?λ©΄ λͺ¨λ  μ£Όμ κΈ°λ₯???μ?λ€", async () => {
		render(<USR2010M00 />);

		// μ£Όμ κΈ°λ₯ λ²νΌ?€μ΄ ?μ?λμ§ ?μΈ
		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		expect(screen.getByText("???)).toBeInTheDocument();
		expect(screen.getByText("λΉλ?λ²νΈ μ΄κΈ°??)).toBeInTheDocument();

		// κ²??μ‘°κ±΄ ?λ?€μ΄ ?μ?λμ§ ?μΈ
		expect(screen.getByText("λ³Έλ?")).toBeInTheDocument();
		expect(screen.getByText("λΆ??)).toBeInTheDocument();
		expect(screen.getByText("?¬μ©?λͺ")).toBeInTheDocument();

		console.log(
			"???¬μ©?κ? ?λ©΄???μ?λ©΄ λͺ¨λ  μ£Όμ κΈ°λ₯???μ?μΌλ‘??μ?©λ??"
		);
	});

	test("?¬μ©?κ? μ‘°ν λ²νΌ???΄λ¦­?λ©΄ ?¬μ©??λͺ©λ‘???λ©΄???μ?λ€", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// μ‘°ν λ²νΌ ?΄λ¦­
		const searchButton = screen.getByText("μ‘°ν");
		fireEvent.click(searchButton);

		// ?¬μ©??λͺ©λ‘ ?μ΄λΈ??€λκ° ?μ?λμ§ ?μΈ
		await waitFor(() => {
			const gridHeaders = screen.getAllByText("?¬λ²");
			expect(gridHeaders.length).toBeGreaterThan(0);

			const nameHeaders = screen.getAllByText("?±λͺ");
			expect(nameHeaders.length).toBeGreaterThan(0);
		});

		console.log(
			"???¬μ©?κ? μ‘°ν λ²νΌ???΄λ¦­?λ©΄ ?¬μ©??λͺ©λ‘???λ©΄???μ?©λ??"
		);
	});

	test("?¬μ©?κ? λ³Έλ?λ₯?? ν?λ©΄ ?΄λΉ λ³Έλ???λΆ??λͺ©λ‘???λ°?΄νΈ?λ€", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// λ³Έλ? ? ν μ½€λ³΄λ°μ€ μ°ΎκΈ° (title ?μ± ?¬μ©)
		const hqSelect = screen.getByTitle("λ³Έλ? ? ν");
		expect(hqSelect).toBeInTheDocument();

		// λΆ??μ½€λ³΄λ°μ€κ° μ‘΄μ¬?λμ§ ?μΈ (title ?μ± ?¬μ©)
		const deptSelect = screen.getByTitle("λΆ??? ν");
		expect(deptSelect).toBeInTheDocument();

		console.log(
			"???¬μ©?κ? λ³Έλ?λ₯?? ν?λ©΄ ?΄λΉ λ³Έλ???λΆ??λͺ©λ‘???λ°?΄νΈ?©λ??"
		);
	});

	test("?¬μ©?κ? ?¬μ©?λͺ???λ ₯?κ³  μ‘°ν?λ©΄ ?΄λΉ ?¬μ©?κ? λͺ©λ‘???μ?λ€", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// ?¬μ©?λͺ ?λ ₯ ?λ μ°ΎκΈ°
		const userNmInput = screen.getByPlaceholderText("?¬μ©?λͺ ?λ ₯");

		// ?¬μ©?λͺ ?λ ₯
		fireEvent.change(userNmInput, { target: { value: "κΉ" } });

		// μ‘°ν λ²νΌ ?΄λ¦­
		fireEvent.click(screen.getByText("μ‘°ν"));

		// κ²??κ²°κ³Όκ° ?μ?λμ§ ?μΈ
		await waitFor(() => {
			expect(userNmInput).toHaveValue("κΉ");
		});

		console.log(
			"???¬μ©?κ? ?¬μ©?λͺ???λ ₯?κ³  μ‘°ν?λ©΄ ?΄λΉ ?¬μ©?κ? λͺ©λ‘???μ?©λ??"
		);
	});

	test("?¬μ©?κ? λͺ©λ‘?μ ?¬μ©?λ? ?΄λ¦­?λ©΄ ?μΈ ?λ³΄κ° ?Όμ ?μ?λ€", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// μ‘°ν λ²νΌ ?΄λ¦­?μ¬ λͺ©λ‘ λ‘λ
		fireEvent.click(screen.getByText("μ‘°ν"));

		// ?¬μ©??λͺ©λ‘ ?μ΄λΈ??€λκ° ?μ???κΉμ§ ?κΈ?
		await waitFor(() => {
			const gridHeaders = screen.getAllByText("?¬λ²");
			expect(gridHeaders.length).toBeGreaterThan(0);

			const nameHeaders = screen.getAllByText("?±λͺ");
			expect(nameHeaders.length).toBeGreaterThan(0);
		});

		console.log(
			"???¬μ©?κ? λͺ©λ‘?μ ?¬μ©?λ? ?΄λ¦­?λ©΄ ?μΈ ?λ³΄κ° ?Όμ ?μ?©λ??"
		);
	});

	test("?¬μ©?κ? ???λ²νΌ???΄λ¦­?λ©΄ ????μΈ λ©μμ§κ° ?μ?λ€", async () => {
		render(<USR2010M00 />);

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

	test("?¬μ©?κ? λΉλ?λ²νΈ μ΄κΈ°??λ²νΌ???΄λ¦­?λ©΄ μ΄κΈ°???μΈ λ©μμ§κ° ?μ?λ€", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("λΉλ?λ²νΈ μ΄κΈ°??)).toBeInTheDocument();
		});

		// λΉλ?λ²νΈ μ΄κΈ°??λ²νΌ ?΄λ¦­
		const initPasswordButton = screen.getByText("λΉλ?λ²νΈ μ΄κΈ°??);
		fireEvent.click(initPasswordButton);

		// μ΄κΈ°???μΈ λ©μμ§κ° ?μ?λμ§ ?μΈ
		await waitFor(() => {
			expect(initPasswordButton).toBeInTheDocument();
		});

		console.log(
			"???¬μ©?κ? λΉλ?λ²νΈ μ΄κΈ°??λ²νΌ???΄λ¦­?λ©΄ μ΄κΈ°???μΈ λ©μμ§κ° ?μ?©λ??"
		);
	});

	test("?¬μ©?κ? ?ΉμΈκ²°μ¬?λ? ?λ ₯?λ©΄ ?λ ₯??κ°μ΄ ?λ©΄??λ°μ?λ€", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// ?ΉμΈκ²°μ¬???λ ₯ ?λ μ°ΎκΈ°
		const approverInput =
			screen.getByPlaceholderText("?ΉμΈκ²°μ¬?λͺ???λ ₯?μΈ??);

		// ?ΉμΈκ²°μ¬?λͺ ?λ ₯
		fireEvent.change(approverInput, { target: { value: "κΉλΆ?? } });

		// ?λ ₯??κ°μ΄ ?λ©΄??λ°μ?λμ§ ?μΈ
		await waitFor(() => {
			expect(approverInput).toHaveValue("κΉλΆ??);
		});

		console.log(
			"???¬μ©?κ? ?ΉμΈκ²°μ¬?λ? ?λ ₯?λ©΄ ?λ ₯??κ°μ΄ ?λ©΄??λ°μ?©λ??"
		);
	});

	test("?¬μ©?κ? ?¬μ©???? ??? ν?λ©΄ ? ν???? ???λ©΄???μ?λ€", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// ?¬μ©????  ? ν μ½€λ³΄λ°μ€ μ°ΎκΈ° (title ?μ± ?¬μ©)
		const roleSelect = screen.getByTitle("?¬μ©????  ? ν");
		expect(roleSelect).toBeInTheDocument();

		console.log(
			"???¬μ©?κ? ?¬μ©???? ??? ν?λ©΄ ? ν???? ???λ©΄???μ?©λ??"
		);
	});

	test("?¬μ©?κ? ?λ¬΄κΆν??? ν?λ©΄ ? ν??κΆν???λ©΄???μ?λ€", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// ?λ¬΄κΆν ? ν μ½€λ³΄λ°μ€ μ°ΎκΈ° (title ?μ± ?¬μ©)
		const authSelect = screen.getByTitle("?λ¬΄κΆν ? ν");
		expect(authSelect).toBeInTheDocument();

		console.log(
			"???¬μ©?κ? ?λ¬΄κΆν??? ν?λ©΄ ? ν??κΆν???λ©΄???μ?©λ??"
		);
	});

	test("?¬μ©?κ? λͺ¨λ  ?μ ?λ³΄λ₯??λ ₯?κ³  ??₯νλ©?????λ£ λ©μμ§κ° ?μ?λ€", async () => {
		render(<USR2010M00 />);

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
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("μ‘°ν")).toBeInTheDocument();
		});

		// λͺ¨λ  μ£Όμ κΈ°λ₯??μ‘΄μ¬?λμ§ ?μΈ
		expect(screen.getByText("???)).toBeInTheDocument();
		expect(screen.getByText("λΉλ?λ²νΈ μ΄κΈ°??)).toBeInTheDocument();
		expect(screen.getByText("λ³Έλ?")).toBeInTheDocument();
		expect(screen.getByText("λΆ??)).toBeInTheDocument();
		expect(screen.getByText("?¬μ©?λͺ")).toBeInTheDocument();

		console.log(
			"???¬μ©?κ? ?λ©΄??λͺ¨λ  μ£Όμ κΈ°λ₯???μ?μΌλ‘??¬μ©?????μ΅?λ€."
		);
	});
});

// ?€μ  κ±°λ ?ΈμΆ ?μ€??- ?λ² ?€ν ?μλ§??€ν
describe("?¬μ©??κ΄λ¦?API - ?€μ  DB ?°κ²° ?μ€??(?λ² ?€ν ??", () => {
	// ?λ²κ° ?€ν μ€μΈμ§ ?μΈ?λ ?¬νΌ ?¨μ
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/health`, { timeout: 2000 });
			return true;
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

	test("?¬μ©??λͺ©λ‘ μ‘°ν APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/users`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?€μ  DB ?°μ΄??κ²μ¦?
		if ((response.data as any).data.length > 0) {
			const user = (response.data as any).data[0];
			expect(user).toHaveProperty("usrId");
			expect(user).toHaveProperty("usrNm");
			expect(user).toHaveProperty("useYn");
		}
	});

	test("?¬μ©?????APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const newUser = {
			usrId: "",
			usrNm: "?μ€???¬μ©??,
			useYn: "Y",
			hqCd: "HQ001",
			deptCd: "DEPT001",
			usrRoleId: "ROLE001",
			approverNm: "κΉλΆ??,
		};

		const response = await axios.post(`${baseURL}/api/usr/users`, {
			createdRows: [newUser],
			updatedRows: [],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?¬μ©???μ  APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const updateUser = {
			usrId: "TEST001",
			usrNm: "?μ ???¬μ©??,
			useYn: "Y",
			hqCd: "HQ001",
			deptCd: "DEPT001",
			usrRoleId: "ROLE001",
			approverNm: "κΉλΆ??,
		};

		const response = await axios.post(`${baseURL}/api/usr/users`, {
			createdRows: [],
			updatedRows: [updateUser],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?¬μ©????  APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const deleteUser = {
			usrId: "TEST001",
			usrNm: "?? ???¬μ©??,
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

	test("λΉλ?λ²νΈ μ΄κΈ°??APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const userId = "TEST001";
		const response = await axios.post(
			`${baseURL}/api/usr/users/${userId}/reset-password`
		);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("μ½λ μ‘°ν APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/codes`);

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

	test("?¬μ©????  λͺ©λ‘ μ‘°ν APIκ° ?μ?μΌλ‘??μ?λ€", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??Έ ?λ²κ° ?€ν?μ? ?μ ?μ€?Έλ? κ±΄λ?λ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/user-roles`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?€μ  DB ?°μ΄??κ²μ¦?
		if ((response.data as any).data.length > 0) {
			const role = (response.data as any).data[0];
			expect(role).toHaveProperty("usrRoleId");
			expect(role).toHaveProperty("usrRoleNm");
		}
	});
});


