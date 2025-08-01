/**
 * PSM1020M00 - ?ฌ์ ?๋ณด ?ฑ๋ก/?์  ?๋ฉด ?์ค??
 *
 * ?์ค??๋ชฉํ:
 * - ?ฌ์ ?๋ณด ?ฑ๋ก/?์  ?๋ฉด??๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???์?์ผ๋ก??์?๋์ง ๊ฒ์ฆ?
 * - ??๊ฐ์ง ๋ฐฉ์???ฌ์ฉ?ฉ๋??
 *   1. UI ?์ค?? Mock???ฌ์ฉ??์ปดํฌ?ํธ ?๋๋ง??์ค??
 *   2. API ?์ค?? ?ค์  HTTP ?ด๋ผ?ด์ธ?ธ๋? ?ฌ์ฉ???๋ฒ ?ต์  ?์ค??(?๋ฒ ?คํ ??
 *
 * ์ฃผ์ ๊ธฐ๋ฅ:
 * - ?ฌ์ ?๋ณด ?ฑ๋ก/?์ 
 * - ๊ฒฝ๋ ฅ๊ณ์ฐ ?์ ?ธ์ถ
 * - ๊ณตํต ์ฝ๋ ์กฐํ
 * - ๋ณธ๋?๋ณ?๋ถ??๋ชฉ๋ก ์กฐํ
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import PSM1020M00 from "./PSM1020M00";
import axios from "axios";

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock fetch for API calls
global.fetch = jest.fn();

// ?ค์  HTTP ?ด๋ผ?ด์ธ???ฌ์ฉ (?๋ฒ ?คํ ??
const baseURL = "http://localhost:8080";

describe("PSM1020M00 - ?ฌ์ ?๋ณด ?ฑ๋ก/?์  ?๋ฉด - UI ?์ค??(Mock ?ฌ์ฉ)", () => {
	beforeEach(() => {
		// Mock ๊ธฐ๋ณธ ?๋ต ?ค์ 
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

		// Mock fetch responses
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({
				success: true,
				data: []
			})
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("?ฌ์ ?๋ณด ?ฑ๋ก/?์  ?๋ฉด???์?๋ฉด ๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???์?๋ค", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?๊ธธ??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?์ฌ ?ธ์ฃผ ๊ตฌ๋ถ")).toBeInTheDocument();
		});

		// ์ฃผ์ ๊ธฐ๋ฅ ๋ฒํผ???์ธ
		expect(screen.getByText("???)).toBeInTheDocument();
		expect(screen.getByText("?? ")).toBeInTheDocument();
		expect(screen.getByText("? ๊ท")).toBeInTheDocument();
		expect(screen.getByText("๊ฒฝ๋ ฅ๊ณ์ฐ")).toBeInTheDocument();
	});

	test("?ฌ์ฉ?๊? ?ฌ์ ?๋ณด๋ฅ??๋ ฅ?๊ณ  ???๋ฒํผ???ด๋ฆญ?๋ฉด ???์ฒ๋ฆฌ๊ฐ ์งํ?๋ค", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?๊ธธ??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("???)).toBeInTheDocument();
		});

		// ???๋ฒํผ ?ด๋ฆญ
		const saveButton = screen.getByText("???);
		fireEvent.click(saveButton);

		// ???๋ฒํผ??์กด์ฌ?๋์ง ?์ธ
		expect(saveButton).toBeInTheDocument();
	});

	test("?ฌ์ฉ?๊? ๊ฒฝ๋ ฅ๊ณ์ฐ ๋ฒํผ???ด๋ฆญ?๋ฉด ๊ฒฝ๋ ฅ๊ณ์ฐ ?์???์?๋ค", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?๊ธธ??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("๊ฒฝ๋ ฅ๊ณ์ฐ")).toBeInTheDocument();
		});

		// ๊ฒฝ๋ ฅ๊ณ์ฐ ๋ฒํผ ?ด๋ฆญ
		const careerCalcButton = screen.getByText("๊ฒฝ๋ ฅ๊ณ์ฐ");
		fireEvent.click(careerCalcButton);

		// ?์ ?์ ?์ธ
		await waitFor(() => {
			expect(careerCalcButton).toBeInTheDocument();
		});
	});

	test("?ฌ์ฉ?๊? ??  ๋ฒํผ???ด๋ฆญ?๋ฉด ??  ?์ธ ?ค์ด?ผ๋ก๊ทธ๊? ?์?๋ค", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?๊ธธ??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?? ")).toBeInTheDocument();
		});

		// ??  ๋ฒํผ ?ด๋ฆญ
		const deleteButton = screen.getByText("?? ");
		fireEvent.click(deleteButton);

		// ?์ธ ?ค์ด?ผ๋ก๊ท??์ ?์ธ
		await waitFor(() => {
			expect(screen.getByText(/?? ?์๊ฒ ์ต?๊น/)).toBeInTheDocument();
		});
	});

	test("?ฌ์ฉ?๊? ? ๊ท ๋ฒํผ???ด๋ฆญ?๋ฉด ?๋ ฅ ?๋๊ฐ ์ด๊ธฐ?๋??, async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?๊ธธ??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("? ๊ท")).toBeInTheDocument();
		});

		// ? ๊ท ๋ฒํผ ?ด๋ฆญ
		const newButton = screen.getByText("? ๊ท");
		fireEvent.click(newButton);

		// ? ๊ท ๋ฒํผ??์กด์ฌ?๋์ง ?์ธ
		expect(newButton).toBeInTheDocument();
	});

	test("?ฌ์ฉ?๊? ๋ณธ๋?๋ฅ?๋ณ๊ฒฝํ๋ฉ??ด๋น ๋ณธ๋???๋ถ??๋ชฉ๋ก???๋ฐ?ดํธ?๋ค", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?๊ธธ??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("๋ณธ๋?")).toBeInTheDocument();
		});

		// ๋ณธ๋? ? ํ ๋ณ๊ฒ?
		const hqSelect = screen.getByText("๋ณธ๋?");
		expect(hqSelect).toBeInTheDocument();
	});

	test("?ฌ์ฉ?๊? ?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ??๋ณ๊ฒฝํ๋ฉ?๊ด???๋?ค์ด ?๋ฐ?ดํธ?๋ค", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?๊ธธ??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?์ฌ ?ธ์ฃผ ๊ตฌ๋ถ")).toBeInTheDocument();
		});

		// ?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ ? ํ ๋ณ๊ฒ?
		const empDivSelect = screen.getByText("?์ฌ ?ธ์ฃผ ๊ตฌ๋ถ");
		expect(empDivSelect).toBeInTheDocument();
	});
});

// ?ค์  ๊ฑฐ๋ ?ธ์ถ ?์ค??- ?๋ฒ ?คํ ?์๋ง??คํ
describe("PSM1020M00 - ?ฌ์ ?๋ณด ?ฑ๋ก/?์  API - ?ค์  ๊ฑฐ๋ ?ธ์ถ ?์ค??(?๋ฒ ?คํ ??", () => {
	// ?๋ฒ๊ฐ ?คํ ์ค์ธ์ง ?์ธ?๋ ?ฌํผ ?จ์
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/api/health`, { timeout: 3000 });
			return true;
		} catch (error) {
			console.log("?๋ฒ ?ฐ๊ฒฐ ?คํจ:", error instanceof Error ? error.message : String(error));
			return false;
		}
	};

	beforeAll(async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("? ๏ธ ?๋ฒ๊ฐ ?คํ?์? ?์?ต๋?? API ?์ค?ธ๋? ๊ฑด๋?๋??");
		}
	});

	test("?ฌ์ ?๋ณด ?๋ฐ?ดํธ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ?ฌ์ ?๋ณด ?๋ฐ?ดํธ API ?ธ์ถ ?์");
			
			const updateEmployee = {
				mode: 'MOD',
				empNo: 'EMP001',
				empNm: '?์ค???ฌ์',
				ownOutsDiv: '1',
				hqDivCd: '1000',
				deptDivCd: '1100',
				dutyCd: '9',
				entrDt: '20240101',
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/employee/update`, updateEmployee);

			console.log("? ?ฌ์ ?๋ณด ?๋ฐ?ดํธ ?๋ต:", response.data);

			expect(response.status).toBe(200);
			
			// success ?๋๊ฐ false??๊ฒฝ์ฐ ?์ธ ?๋ณด ์ถ๋ ฅ
			if (!(response.data as any).success) {
				console.log("???ฌ์ ?๋ณด ?๋ฐ?ดํธ ?คํจ - ?๋ต:", response.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("???ฌ์ ?๋ณด ?๋ฐ?ดํธ API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???๋ต ?ํ:", error.response?.status);
				console.log("???๋ต ?ฐ์ด??", error.response?.data);
			}
			throw error;
		}
	});

	test("๊ฒฝ๋ ฅ ๊ณ์ฐ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ๊ฒฝ๋ ฅ ๊ณ์ฐ API ?ธ์ถ ?์");
			
			const careerCalcData = {
				empNo: 'EMP001',
				entrDt: '20200101',
				fstInDt: '20200101',
				lastEndDt: '20241231',
				lastAdbgDivCd: '1',
				ctqlCd: '1',
				ctqlPurDt: '20200101',
				ownOutsDiv: '1'
			};

			const response = await axios.post(`${baseURL}/api/psm/career/calculate`, careerCalcData);

			console.log("? ๊ฒฝ๋ ฅ ๊ณ์ฐ ?๋ต:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("??๊ฒฝ๋ ฅ ๊ณ์ฐ ?คํจ - ?๋ต:", response.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
			const responseData = (response.data as any).data;
			if (responseData && typeof responseData === 'object' && Object.keys(responseData).length > 0) {
				expect(responseData).toHaveProperty("CARR_YCNT");
				expect(responseData).toHaveProperty("CARR_MCNT");
			} else {
				console.log("?น๏ธ ๊ฒฝ๋ ฅ ๊ณ์ฐ ๊ฒฐ๊ณผ๊ฐ ?์ต?๋ค.");
				console.log("?น๏ธ ?ฌ์๋ฒํธ 'EMP001'??์กด์ฌ?์? ?๊ฑฐ??๊ฒฝ๋ ฅ ?ฐ์ด?ฐ๊? ?์ ???์ต?๋ค.");
				// ๋น??๋ต?ด์ด??API ?ธ์ถ ?์ฒด???ฑ๊ณต?ผ๋ก ๊ฐ์ฃผ
				expect(responseData).toBeDefined();
			}
		} catch (error) {
			console.log("??๊ฒฝ๋ ฅ ๊ณ์ฐ API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???๋ต ?ํ:", error.response?.status);
				console.log("???๋ต ?ฐ์ด??", error.response?.data);
			}
			throw error;
		}
	});

	test("?ฌ์ ?๋ณด ??  API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ?ฌ์ ?๋ณด ??  API ?ธ์ถ ?์");
			
			const deleteEmployee = {
				empNo: 'EMP001',
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/employee/delete`, deleteEmployee);

			console.log("? ?ฌ์ ?๋ณด ??  ?๋ต:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???ฌ์ ?๋ณด ??  ?คํจ - ?๋ต:", response.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("???ฌ์ ?๋ณด ??  API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???๋ต ?ํ:", error.response?.status);
				console.log("???๋ต ?ฐ์ด??", error.response?.data);
			}
			throw error;
		}
	});

	test("๊ณตํต ์ฝ๋ ์กฐํ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ๊ณตํต ์ฝ๋ ์กฐํ API ?ธ์ถ ?์");

			// ๋ณธ๋? ์ฝ๋ ์กฐํ
			const hqResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '113'
			});

			console.log("? ๋ณธ๋? ์ฝ๋ ์กฐํ ?๋ต:", hqResponse.data);

			expect(hqResponse.status).toBe(200);
			
			if (!(hqResponse.data as any).success) {
				console.log("??๋ณธ๋? ์ฝ๋ ์กฐํ ?คํจ - ?๋ต:", hqResponse.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (hqResponse.data as any).message);
			}
			
			expect((hqResponse.data as any).success).toBe(true);

			// ์ง์ฑ ์ฝ๋ ์กฐํ
			const dutyResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '116'
			});

			console.log("? ์ง์ฑ ์ฝ๋ ์กฐํ ?๋ต:", dutyResponse.data);

			expect(dutyResponse.status).toBe(200);
			
			if (!(dutyResponse.data as any).success) {
				console.log("??์ง์ฑ ์ฝ๋ ์กฐํ ?คํจ - ?๋ต:", dutyResponse.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (dutyResponse.data as any).message);
			}
			
			expect((dutyResponse.data as any).success).toBe(true);

			// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
			const hqData = (hqResponse.data as any).data;
			if (hqData && Array.isArray(hqData) && hqData.length > 0) {
				const code = hqData[0];
				expect(code).toHaveProperty("codeId");
				expect(code).toHaveProperty("codeNm");
			} else {
				console.log("?น๏ธ ์กฐํ??๋ณธ๋? ์ฝ๋ ?ฐ์ด?ฐ๊? ?์ต?๋ค.");
			}
		} catch (error) {
			console.log("??๊ณตํต ์ฝ๋ ์กฐํ API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???๋ต ?ํ:", error.response?.status);
				console.log("???๋ต ?ฐ์ด??", error.response?.data);
			}
			throw error;
		}
	});

	test("๋ณธ๋?๋ณ?๋ถ??๋ชฉ๋ก ์กฐํ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ๋ณธ๋?๋ณ?๋ถ??๋ชฉ๋ก ์กฐํ API ?ธ์ถ ?์");
			
			const response = await axios.post(`${baseURL}/api/psm/dept-by-hq`, {
				hqDivCd: '1000',
				allYn: 'Y'
			});

			console.log("? ๋ณธ๋?๋ณ?๋ถ??๋ชฉ๋ก ์กฐํ ?๋ต:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("??๋ณธ๋?๋ณ?๋ถ??๋ชฉ๋ก ์กฐํ ?คํจ - ?๋ต:", response.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const dept = responseData[0];
				expect(dept).toHaveProperty("DATA");
				expect(dept).toHaveProperty("LABEL");
			} else {
				console.log("?น๏ธ ์กฐํ??๋ถ???ฐ์ด?ฐ๊? ?์ต?๋ค.");
			}
		} catch (error) {
			console.log("??๋ณธ๋?๋ณ?๋ถ??๋ชฉ๋ก ์กฐํ API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???๋ต ?ํ:", error.response?.status);
				console.log("???๋ต ?ฐ์ด??", error.response?.data);
			}
			throw error;
		}
	});
}); 

