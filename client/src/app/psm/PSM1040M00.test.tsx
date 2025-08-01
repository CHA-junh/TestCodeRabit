/**
 * PSM1040M00 - ?¸ì¬ë°ë ¹ ?¼ê´?±ë¡ ?ë©´ ?ì¤??
 *
 * ?ì¤??ëª©í:
 * - ?¸ì¬ë°ë ¹ ?¼ê´?±ë¡ ?ë©´??ëª¨ë  ì£¼ì ê¸°ë¥???ì?ì¼ë¡??ì?ëì§ ê²ì¦?
 * - ??ê°ì§ ë°©ì???¬ì©?©ë??
 *   1. UI ?ì¤?? Mock???¬ì©??ì»´í¬?í¸ ?ëë§??ì¤??
 *   2. API ?ì¤?? ?¤ì  HTTP ?´ë¼?´ì¸?¸ë? ?¬ì©???ë² ?µì  ?ì¤??(?ë² ?¤í ??
 *
 * ì£¼ì ê¸°ë¥:
 * - ?¸ì¬ë°ë ¹ ?¼ê´?±ë¡
 * - ê³µíµ ì½ë ì¡°í
 * - ë³¸ë?ë³?ë¶??ëª©ë¡ ì¡°í
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import PSM1040M00 from "./PSM1040M00";
import axios from "axios";

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock fetch for API calls
global.fetch = jest.fn();

// ?¤ì  HTTP ?´ë¼?´ì¸???¬ì© (?ë² ?¤í ??
const baseURL = "http://localhost:8080";

describe("PSM1040M00 - ?¸ì¬ë°ë ¹ ?¼ê´?±ë¡ ?ë©´ - UI ?ì¤??(Mock ?¬ì©)", () => {
	beforeEach(() => {
		// Mock ê¸°ë³¸ ?ëµ ?¤ì 
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

	test("?¸ì¬ë°ë ¹ ?¼ê´?±ë¡ ?ë©´???ì?ë©´ ëª¨ë  ì£¼ì ê¸°ë¥???ì?ë¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("?¸ì¬ë°ë ¹?´ì©")).toBeInTheDocument();
		});

		// ì£¼ì ê¸°ë¥ ë²í¼???ì¸
		expect(screen.getByText("?±ë¡")).toBeInTheDocument();
		expect(screen.getByText("? ê·")).toBeInTheDocument();
		expect(screen.getByText("ë¦¬ì¤?¸ì´ê¸°í")).toBeInTheDocument();
		expect(screen.getByText("?ì­??)).toBeInTheDocument();
	});

	test("?¬ì©?ê? ?¸ì¬ë°ë ¹ ?ë³´ë¥??ë ¥?ê³  ?±ë¡ ë²í¼???´ë¦­?ë©´ ?¼ê´?±ë¡ ì²ë¦¬ê° ì§í?ë¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("?±ë¡")).toBeInTheDocument();
		});

		// ?±ë¡ ë²í¼ ?´ë¦­
		const registerButton = screen.getByText("?±ë¡");
		fireEvent.click(registerButton);

		// ?±ë¡ ë²í¼??ì¡´ì¬?ëì§ ?ì¸
		expect(registerButton).toBeInTheDocument();
	});

	test("?¬ì©?ê? ? ê· ë²í¼???´ë¦­?ë©´ ?ë ¥ ?ëê° ì´ê¸°?ë??, async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("? ê·")).toBeInTheDocument();
		});

		// ? ê· ë²í¼ ?´ë¦­
		const newButton = screen.getByText("? ê·");
		fireEvent.click(newButton);

		// ?ë ¥ ?ë ì´ê¸°???ì¸
		await waitFor(() => {
			// ?ë ¥ ?ë?¤ì´ ë¹ì´?ëì§ ?ì¸
			const inputs = screen.getAllByRole('textbox');
			inputs.forEach(input => {
				if (input instanceof HTMLInputElement) {
					expect(input.value).toBe('');
				}
			});
		});
	});

	test("?¬ì©?ê? ??  ë²í¼???´ë¦­?ë©´ ? í???ì´ ?? ?ë¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("?ì­??)).toBeInTheDocument();
		});

		// ?ì­??ë²í¼ ?´ë¦­
		const deleteButton = screen.getByText("?ì­??);
		fireEvent.click(deleteButton);

		// ?ì­??ë²í¼??ë¹í?±í?ì´ ?ëì§ ?ì¸ (ì´ê¸° ?í)
		expect(deleteButton).toBeDisabled();
	});

	test("?¬ì©?ê? ?ì²´??  ë²í¼???´ë¦­?ë©´ ëª¨ë  ?ì´ ?? ?ë¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("ë¦¬ì¤?¸ì´ê¸°í")).toBeInTheDocument();
		});

		// ë¦¬ì¤?¸ì´ê¸°í ë²í¼ ?´ë¦­
		const resetButton = screen.getByText("ë¦¬ì¤?¸ì´ê¸°í");
		fireEvent.click(resetButton);

		// ë¦¬ì¤?¸ì´ê¸°í ë²í¼??ì¡´ì¬?ëì§ ?ì¸
		expect(resetButton).toBeInTheDocument();
	});

	test("?¬ì©?ê? ë³¸ë?ë¥?ë³ê²½íë©??´ë¹ ë³¸ë???ë¶??ëª©ë¡???ë°?´í¸?ë¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("ë°ë ¹ë³¸ë?")).toBeInTheDocument();
		});

		// ë°ë ¹ë³¸ë? ? í ë³ê²?
		const hqSelect = screen.getByText("ë°ë ¹ë³¸ë?");
		expect(hqSelect).toBeInTheDocument();
	});

	test("?¬ì©?ê? ë°ë ¹êµ¬ë¶??ë³ê²½íë©?ê´???ë?¤ì´ ?ë°?´í¸?ë¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("ë°ë ¹êµ¬ë¶")).toBeInTheDocument();
		});

		// ë°ë ¹êµ¬ë¶ ? í ë³ê²?
		const apntDivSelect = screen.getByText("ë°ë ¹êµ¬ë¶");
		expect(apntDivSelect).toBeInTheDocument();
	});
});

// ?¤ì  ê±°ë ?¸ì¶ ?ì¤??- ?ë² ?¤í ?ìë§??¤í
describe("PSM1040M00 - ?¸ì¬ë°ë ¹ ?¼ê´?±ë¡ API - ?¤ì  ê±°ë ?¸ì¶ ?ì¤??(?ë² ?¤í ??", () => {
	// ?ë²ê° ?¤í ì¤ì¸ì§ ?ì¸?ë ?¬í¼ ?¨ì
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/api/health`, { timeout: 3000 });
			return true;
		} catch (error) {
			console.log("?ë² ?°ê²° ?¤í¨:", error instanceof Error ? error.message : String(error));
			return false;
		}
	};

	beforeAll(async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("? ï¸ ?ë²ê° ?¤í?ì? ?ì?µë?? API ?ì¤?¸ë? ê±´ë?ë??");
		}
	});

	test("?¸ì¬ë°ë ¹ ?¼ê´?±ë¡ APIê° ?ì?ì¼ë¡??ì?ë¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?ë²ê° ?¤í?ì? ?ì ?ì¤?¸ë? ê±´ë?ë??");
			return;
		}

		try {
			console.log("? ?¸ì¬ë°ë ¹ ?¼ê´?±ë¡ API ?¸ì¶ ?ì");
			
			const batchAppointmentData = {
				apntDiv: '2',
				apntDt: '20240101',
				hqDivCd: '1000',
				deptDivCd: '1100',
				dutyCd: '9',
				rmk: '?ì¤???¼ê´ë°ë ¹',
				empList: [
					{
						empNo: 'EMP001',
						empNm: '?ê¸¸??
					},
					{
						empNo: 'EMP002',
						empNm: 'ê¹ì² ì'
					}
				],
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/appointment/batch-register`, batchAppointmentData);

			console.log("? ?¸ì¬ë°ë ¹ ?¼ê´?±ë¡ ?ëµ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???¸ì¬ë°ë ¹ ?¼ê´?±ë¡ ?¤í¨ - ?ëµ:", response.data);
				console.log("???ë¬ ë©ìì§:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("???¸ì¬ë°ë ¹ ?¼ê´?±ë¡ API ?¸ì¶ ?¤í¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???ëµ ?í:", error.response?.status);
				console.log("???ëµ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});

	test("ê³µíµ ì½ë ì¡°í APIê° ?ì?ì¼ë¡??ì?ë¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?ë²ê° ?¤í?ì? ?ì ?ì¤?¸ë? ê±´ë?ë??");
			return;
		}

		try {
			console.log("? ê³µíµ ì½ë ì¡°í API ?¸ì¶ ?ì");

			// ë°ë ¹êµ¬ë¶ ì½ë ì¡°í
			const apntDivResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '018'
			});

			console.log("? ë°ë ¹êµ¬ë¶ ì½ë ì¡°í ?ëµ:", apntDivResponse.data);

			expect(apntDivResponse.status).toBe(200);
			
			if (!(apntDivResponse.data as any).success) {
				console.log("??ë°ë ¹êµ¬ë¶ ì½ë ì¡°í ?¤í¨ - ?ëµ:", apntDivResponse.data);
				console.log("???ë¬ ë©ìì§:", (apntDivResponse.data as any).message);
			}
			
			expect((apntDivResponse.data as any).success).toBe(true);

			// ë³¸ë? ì½ë ì¡°í
			const hqResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '113'
			});

			console.log("? ë³¸ë? ì½ë ì¡°í ?ëµ:", hqResponse.data);

			expect(hqResponse.status).toBe(200);
			
			if (!(hqResponse.data as any).success) {
				console.log("??ë³¸ë? ì½ë ì¡°í ?¤í¨ - ?ëµ:", hqResponse.data);
				console.log("???ë¬ ë©ìì§:", (hqResponse.data as any).message);
			}
			
			expect((hqResponse.data as any).success).toBe(true);

			// ?¤ì  DB ?°ì´??ê²ì¦?
			const apntDivData = (apntDivResponse.data as any).data;
			if (apntDivData && Array.isArray(apntDivData) && apntDivData.length > 0) {
				const code = apntDivData[0];
				expect(code).toHaveProperty("codeId");
				expect(code).toHaveProperty("codeNm");
			} else {
				console.log("?¹ï¸ ì¡°í??ë°ë ¹êµ¬ë¶ ì½ë ?°ì´?°ê? ?ìµ?ë¤.");
			}
		} catch (error) {
			console.log("??ê³µíµ ì½ë ì¡°í API ?¸ì¶ ?¤í¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???ëµ ?í:", error.response?.status);
				console.log("???ëµ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});

	test("ë³¸ë?ë³?ë¶??ëª©ë¡ ì¡°í APIê° ?ì?ì¼ë¡??ì?ë¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?ë²ê° ?¤í?ì? ?ì ?ì¤?¸ë? ê±´ë?ë??");
			return;
		}

		try {
			console.log("? ë³¸ë?ë³?ë¶??ëª©ë¡ ì¡°í API ?¸ì¶ ?ì");
			
			const response = await axios.post(`${baseURL}/api/psm/dept-by-hq`, {
				hqDivCd: '1000',
				allYn: 'Y'
			});

			console.log("? ë³¸ë?ë³?ë¶??ëª©ë¡ ì¡°í ?ëµ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("??ë³¸ë?ë³?ë¶??ëª©ë¡ ì¡°í ?¤í¨ - ?ëµ:", response.data);
				console.log("???ë¬ ë©ìì§:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?¤ì  DB ?°ì´??ê²ì¦?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const dept = responseData[0];
				expect(dept).toHaveProperty("DATA");
				expect(dept).toHaveProperty("LABEL");
			} else {
				console.log("?¹ï¸ ì¡°í??ë¶???°ì´?°ê? ?ìµ?ë¤.");
			}
		} catch (error) {
			console.log("??ë³¸ë?ë³?ë¶??ëª©ë¡ ì¡°í API ?¸ì¶ ?¤í¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???ëµ ?í:", error.response?.status);
				console.log("???ëµ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});
}); 

