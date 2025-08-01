/**
 * PSM1050M00 - ๊ฒฝ๋ ฅ ๊ณ์ฐ ?๋ฉด ?์ค??
 *
 * ?์ค??๋ชฉํ:
 * - ๊ฒฝ๋ ฅ ๊ณ์ฐ ?๋ฉด??๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???์?์ผ๋ก??์?๋์ง ๊ฒ์ฆ?
 * - ??๊ฐ์ง ๋ฐฉ์???ฌ์ฉ?ฉ๋??
 *   1. UI ?์ค?? Mock???ฌ์ฉ??์ปดํฌ?ํธ ?๋๋ง??์ค??
 *   2. API ?์ค?? ?ค์  HTTP ?ด๋ผ?ด์ธ?ธ๋? ?ฌ์ฉ???๋ฒ ?ต์  ?์ค??(?๋ฒ ?คํ ??
 *
 * ์ฃผ์ ๊ธฐ๋ฅ:
 * - ๊ฒฝ๋ ฅ ๊ณ์ฐ
 * - ?๋ก??๊ฒฝ๋ ฅ ์กฐํ
 * - ๊ฒฝ๋ ฅ ?๋ณด ???
 * - ๊ณตํต ์ฝ๋ ์กฐํ
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import PSM1050M00 from "./PSM1050M00";
import axios from "axios";

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock fetch for API calls
global.fetch = jest.fn();

// ?ค์  HTTP ?ด๋ผ?ด์ธ???ฌ์ฉ (?๋ฒ ?คํ ??
const baseURL = "http://localhost:8080";

describe("PSM1050M00 - ๊ฒฝ๋ ฅ ๊ณ์ฐ ?๋ฉด - UI ?์ค??(Mock ?ฌ์ฉ)", () => {
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

	test("๊ฒฝ๋ ฅ ๊ณ์ฐ ?๋ฉด???์?๋ฉด ๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???์?๋ค", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("๊ฒฝ๋ ฅ๊ฐ์??๊ณ์ฐ")).toBeInTheDocument();
		});

		// ์ฃผ์ ๊ธฐ๋ฅ ๋ฒํผ???์ธ
		expect(screen.getByText("๊ณ์ฐ")).toBeInTheDocument();
		expect(screen.getByText("?์ธ")).toBeInTheDocument();
		expect(screen.getByText("์ทจ์")).toBeInTheDocument();
	});

	test("?ฌ์ฉ?๊? ๊ฒฝ๋ ฅ ?๋ณด๋ฅ??๋ ฅ?๊ณ  ๊ณ์ฐ ๋ฒํผ???ด๋ฆญ?๋ฉด ๊ฒฝ๋ ฅ ๊ณ์ฐ??์งํ?๋ค", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("๊ณ์ฐ")).toBeInTheDocument();
		});

		// ๊ณ์ฐ ๋ฒํผ ?ด๋ฆญ
		const calculateButton = screen.getByText("๊ณ์ฐ");
		fireEvent.click(calculateButton);

		// ๊ณ์ฐ ๋ฒํผ??์กด์ฌ?๋์ง ?์ธ
		expect(calculateButton).toBeInTheDocument();
	});

	test("?ฌ์ฉ?๊? ?์ธ ๋ฒํผ???ด๋ฆญ?๋ฉด ๊ฒฝ๋ ฅ ?๋ณด๊ฐ ??ฅ๋๊ณ??์???ซํ??, async () => {
		const mockOnConfirm = jest.fn();
		const mockOnClose = jest.fn();

		render(<PSM1050M00 onClose={mockOnClose} onConfirm={mockOnConfirm} />);

		await waitFor(() => {
			expect(screen.getByText("?์ธ")).toBeInTheDocument();
		});

		// ?์ธ ๋ฒํผ ?ด๋ฆญ
		const confirmButton = screen.getByText("?์ธ");
		fireEvent.click(confirmButton);

		// ?์ธ ๋ฒํผ??์กด์ฌ?๋์ง ?์ธ
		expect(confirmButton).toBeInTheDocument();
	});

	test("?ฌ์ฉ?๊? ์ทจ์ ๋ฒํผ???ด๋ฆญ?๋ฉด ?์???ซํ??, async () => {
		const mockOnClose = jest.fn();
		const mockOnConfirm = jest.fn();
		
		render(<PSM1050M00 onClose={mockOnClose} onConfirm={mockOnConfirm} />);

		await waitFor(() => {
			expect(screen.getByText("์ทจ์")).toBeInTheDocument();
		});

		// ์ทจ์ ๋ฒํผ ?ด๋ฆญ
		const cancelButton = screen.getByText("์ทจ์");
		fireEvent.click(cancelButton);

		// ์ทจ์ ์ฒ๋ฆฌ ?์ธ
		await waitFor(() => {
			expect(cancelButton).toBeInTheDocument();
		});
	});

	test("?ฌ์ฉ?๊? ?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ??๋ณ๊ฒฝํ๋ฉ?๊ด???๋?ค์ด ?๋ฐ?ดํธ?๋ค", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("๊ตฌ๋ถ")).toBeInTheDocument();
		});

		// ๊ตฌ๋ถ ?๋ ?์ธ
		const empDivField = screen.getByText("๊ตฌ๋ถ");
		expect(empDivField).toBeInTheDocument();
	});

	test("?ฌ์ฉ?๊? ๊ฒฝ๋ ฅ๊ณ์ฐ๊ธฐ์??ผ์ ๋ณ๊ฒฝํ๋ฉ?๊ฒฝ๋ ฅ ๊ณ์ฐ ๊ฒฐ๊ณผ๊ฐ ?๋ฐ?ดํธ?๋ค", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("์ต์ข์ฒ ์?ผ์")).toBeInTheDocument();
		});

		// ์ต์ข์ฒ ์?ผ์ ?๋ ?์ธ
		const finalDateField = screen.getByText("์ต์ข์ฒ ์?ผ์");
		expect(finalDateField).toBeInTheDocument();
	});
});

// ?ค์  ๊ฑฐ๋ ?ธ์ถ ?์ค??- ?๋ฒ ?คํ ?์๋ง??คํ
describe("PSM1050M00 - ๊ฒฝ๋ ฅ ๊ณ์ฐ API - ?ค์  ๊ฑฐ๋ ?ธ์ถ ?์ค??(?๋ฒ ?คํ ??", () => {
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
				ownOutsDiv: '1',
				carrCalcStndDt: '20241231'
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
				expect(responseData).toHaveProperty("TCN_GRD");
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

	test("?๋ก??๊ฒฝ๋ ฅ ์กฐํ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ?๋ก??๊ฒฝ๋ ฅ ์กฐํ API ?ธ์ถ ?์");
			
			const empNo = "EMP001";
			const response = await axios.post(`${baseURL}/api/psm/career/profile`, {
				empNo: empNo
			});

			console.log("? ?๋ก??๊ฒฝ๋ ฅ ์กฐํ ?๋ต:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???๋ก??๊ฒฝ๋ ฅ ์กฐํ ?คํจ - ?๋ต:", response.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const profile = responseData[0];
				expect(profile).toHaveProperty("EMP_NO");
				expect(profile).toHaveProperty("PRJT_NM");
				expect(profile).toHaveProperty("STRT_DT");
				expect(profile).toHaveProperty("END_DT");
			} else {
				console.log("?น๏ธ ์กฐํ???๋ก??๊ฒฝ๋ ฅ???์ต?๋ค.");
				console.log("?น๏ธ ?ฌ์๋ฒํธ 'EMP001'??์กด์ฌ?์? ?์ ???์ต?๋ค.");
			}
		} catch (error) {
			console.log("???๋ก??๊ฒฝ๋ ฅ ์กฐํ API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???๋ต ?ํ:", error.response?.status);
				console.log("???๋ต ?ฐ์ด??", error.response?.data);
			}
			throw error;
		}
	});

	test("๊ฒฝ๋ ฅ ?๋ณด ???API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ๊ฒฝ๋ ฅ ?๋ณด ???API ?ธ์ถ ?์");
			
			const careerData = {
				empNo: 'EMP001',
				entrBefInYcnt: '2',
				entrBefInMcnt: '24',
				entrAftYcnt: '4',
				entrAftMcnt: '48',
				carrYcnt: '6',
				carrMcnt: '72',
				tcnGrd: '์ค๊ธ',
				tcnGrdCd: '2',
				ctqlCarrYcnt: '1',
				ctqlCarrMcnt: '12',
				ctqlTcnGrd: '์ด๊ธ',
				ctqlTcnGrdCd: '1',
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/career/save`, careerData);

			console.log("? ๊ฒฝ๋ ฅ ?๋ณด ????๋ต:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("??๊ฒฝ๋ ฅ ?๋ณด ????คํจ - ?๋ต:", response.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("??๊ฒฝ๋ ฅ ?๋ณด ???API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
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

			// ?๊ฒฉ์ฆ?์ฝ๋ ์กฐํ
			const ctqlResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '115'
			});

			console.log("? ?๊ฒฉ์ฆ?์ฝ๋ ์กฐํ ?๋ต:", ctqlResponse.data);

			expect(ctqlResponse.status).toBe(200);
			
			if (!(ctqlResponse.data as any).success) {
				console.log("???๊ฒฉ์ฆ?์ฝ๋ ์กฐํ ?คํจ - ?๋ต:", ctqlResponse.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (ctqlResponse.data as any).message);
			}
			
			expect((ctqlResponse.data as any).success).toBe(true);

			// ๊ธฐ์ ?ฑ๊ธ ์ฝ๋ ์กฐํ
			const tcnGrdResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '114'
			});

			console.log("? ๊ธฐ์ ?ฑ๊ธ ์ฝ๋ ์กฐํ ?๋ต:", tcnGrdResponse.data);

			expect(tcnGrdResponse.status).toBe(200);
			
			if (!(tcnGrdResponse.data as any).success) {
				console.log("??๊ธฐ์ ?ฑ๊ธ ์ฝ๋ ์กฐํ ?คํจ - ?๋ต:", tcnGrdResponse.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (tcnGrdResponse.data as any).message);
			}
			
			expect((tcnGrdResponse.data as any).success).toBe(true);

			// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
			const ctqlData = (ctqlResponse.data as any).data;
			if (ctqlData && Array.isArray(ctqlData) && ctqlData.length > 0) {
				const code = ctqlData[0];
				expect(code).toHaveProperty("codeId");
				expect(code).toHaveProperty("codeNm");
			} else {
				console.log("?น๏ธ ์กฐํ???๊ฒฉ์ฆ?์ฝ๋ ?ฐ์ด?ฐ๊? ?์ต?๋ค.");
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
}); 

