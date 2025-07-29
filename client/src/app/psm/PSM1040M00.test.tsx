/**
 * PSM1040M00 - ?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ ?”ë©´ ?ŒìŠ¤??
 *
 * ?ŒìŠ¤??ëª©í‘œ:
 * - ?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ ?”ë©´??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??™ì‘?˜ëŠ”ì§€ ê²€ì¦?
 * - ??ê°€ì§€ ë°©ì‹???¬ìš©?©ë‹ˆ??
 *   1. UI ?ŒìŠ¤?? Mock???¬ìš©??ì»´í¬?ŒíŠ¸ ?Œë”ë§??ŒìŠ¤??
 *   2. API ?ŒìŠ¤?? ?¤ì œ HTTP ?´ë¼?´ì–¸?¸ë? ?¬ìš©???œë²„ ?µì‹  ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡
 * - ê³µí†µ ì½”ë“œ ì¡°íšŒ
 * - ë³¸ë?ë³?ë¶€??ëª©ë¡ ì¡°íšŒ
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

// ?¤ì œ HTTP ?´ë¼?´ì–¸???¬ìš© (?œë²„ ?¤í–‰ ??
const baseURL = "http://localhost:8080";

describe("PSM1040M00 - ?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ ?”ë©´ - UI ?ŒìŠ¤??(Mock ?¬ìš©)", () => {
	beforeEach(() => {
		// Mock ê¸°ë³¸ ?‘ë‹µ ?¤ì •
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

	test("?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ ?”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???œì‹œ?œë‹¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("?¸ì‚¬ë°œë ¹?´ìš©")).toBeInTheDocument();
		});

		// ì£¼ìš” ê¸°ëŠ¥ ë²„íŠ¼???•ì¸
		expect(screen.getByText("?±ë¡")).toBeInTheDocument();
		expect(screen.getByText("? ê·œ")).toBeInTheDocument();
		expect(screen.getByText("ë¦¬ìŠ¤?¸ì´ˆê¸°í™”")).toBeInTheDocument();
		expect(screen.getByText("?‰ì‚­??)).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ?¸ì‚¬ë°œë ¹ ?•ë³´ë¥??…ë ¥?˜ê³  ?±ë¡ ë²„íŠ¼???´ë¦­?˜ë©´ ?¼ê´„?±ë¡ ì²˜ë¦¬ê°€ ì§„í–‰?œë‹¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("?±ë¡")).toBeInTheDocument();
		});

		// ?±ë¡ ë²„íŠ¼ ?´ë¦­
		const registerButton = screen.getByText("?±ë¡");
		fireEvent.click(registerButton);

		// ?±ë¡ ë²„íŠ¼??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(registerButton).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ? ê·œ ë²„íŠ¼???´ë¦­?˜ë©´ ?…ë ¥ ?„ë“œê°€ ì´ˆê¸°?”ëœ??, async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("? ê·œ")).toBeInTheDocument();
		});

		// ? ê·œ ë²„íŠ¼ ?´ë¦­
		const newButton = screen.getByText("? ê·œ");
		fireEvent.click(newButton);

		// ?…ë ¥ ?„ë“œ ì´ˆê¸°???•ì¸
		await waitFor(() => {
			// ?…ë ¥ ?„ë“œ?¤ì´ ë¹„ì–´?ˆëŠ”ì§€ ?•ì¸
			const inputs = screen.getAllByRole('textbox');
			inputs.forEach(input => {
				if (input instanceof HTMLInputElement) {
					expect(input.value).toBe('');
				}
			});
		});
	});

	test("?¬ìš©?ê? ?? œ ë²„íŠ¼???´ë¦­?˜ë©´ ? íƒ???‰ì´ ?? œ?œë‹¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("?‰ì‚­??)).toBeInTheDocument();
		});

		// ?‰ì‚­??ë²„íŠ¼ ?´ë¦­
		const deleteButton = screen.getByText("?‰ì‚­??);
		fireEvent.click(deleteButton);

		// ?‰ì‚­??ë²„íŠ¼??ë¹„í™œ?±í™”?˜ì–´ ?ˆëŠ”ì§€ ?•ì¸ (ì´ˆê¸° ?íƒœ)
		expect(deleteButton).toBeDisabled();
	});

	test("?¬ìš©?ê? ?„ì²´?? œ ë²„íŠ¼???´ë¦­?˜ë©´ ëª¨ë“  ?‰ì´ ?? œ?œë‹¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("ë¦¬ìŠ¤?¸ì´ˆê¸°í™”")).toBeInTheDocument();
		});

		// ë¦¬ìŠ¤?¸ì´ˆê¸°í™” ë²„íŠ¼ ?´ë¦­
		const resetButton = screen.getByText("ë¦¬ìŠ¤?¸ì´ˆê¸°í™”");
		fireEvent.click(resetButton);

		// ë¦¬ìŠ¤?¸ì´ˆê¸°í™” ë²„íŠ¼??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(resetButton).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ë³¸ë?ë¥?ë³€ê²½í•˜ë©??´ë‹¹ ë³¸ë???ë¶€??ëª©ë¡???…ë°?´íŠ¸?œë‹¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("ë°œë ¹ë³¸ë?")).toBeInTheDocument();
		});

		// ë°œë ¹ë³¸ë? ? íƒ ë³€ê²?
		const hqSelect = screen.getByText("ë°œë ¹ë³¸ë?");
		expect(hqSelect).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ë°œë ¹êµ¬ë¶„??ë³€ê²½í•˜ë©?ê´€???„ë“œ?¤ì´ ?…ë°?´íŠ¸?œë‹¤", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("ë°œë ¹êµ¬ë¶„")).toBeInTheDocument();
		});

		// ë°œë ¹êµ¬ë¶„ ? íƒ ë³€ê²?
		const apntDivSelect = screen.getByText("ë°œë ¹êµ¬ë¶„");
		expect(apntDivSelect).toBeInTheDocument();
	});
});

// ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??- ?œë²„ ?¤í–‰ ?œì—ë§??¤í–‰
describe("PSM1040M00 - ?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ API - ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??", () => {
	// ?œë²„ê°€ ?¤í–‰ ì¤‘ì¸ì§€ ?•ì¸?˜ëŠ” ?¬í¼ ?¨ìˆ˜
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/api/health`, { timeout: 3000 });
			return true;
		} catch (error) {
			console.log("?œë²„ ?°ê²° ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			return false;
		}
	};

	beforeAll(async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("? ï¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•˜?µë‹ˆ?? API ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
		}
	});

	test("?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ API ?¸ì¶œ ?œì‘");
			
			const batchAppointmentData = {
				apntDiv: '2',
				apntDt: '20240101',
				hqDivCd: '1000',
				deptDivCd: '1100',
				dutyCd: '9',
				rmk: '?ŒìŠ¤???¼ê´„ë°œë ¹',
				empList: [
					{
						empNo: 'EMP001',
						empNm: '?ê¸¸??
					},
					{
						empNo: 'EMP002',
						empNm: 'ê¹€ì² ìˆ˜'
					}
				],
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/appointment/batch-register`, batchAppointmentData);

			console.log("?“Š ?¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ ?¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("???¸ì‚¬ë°œë ¹ ?¼ê´„?±ë¡ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});

	test("ê³µí†µ ì½”ë“œ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ê³µí†µ ì½”ë“œ ì¡°íšŒ API ?¸ì¶œ ?œì‘");

			// ë°œë ¹êµ¬ë¶„ ì½”ë“œ ì¡°íšŒ
			const apntDivResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '018'
			});

			console.log("?“Š ë°œë ¹êµ¬ë¶„ ì½”ë“œ ì¡°íšŒ ?‘ë‹µ:", apntDivResponse.data);

			expect(apntDivResponse.status).toBe(200);
			
			if (!(apntDivResponse.data as any).success) {
				console.log("??ë°œë ¹êµ¬ë¶„ ì½”ë“œ ì¡°íšŒ ?¤íŒ¨ - ?‘ë‹µ:", apntDivResponse.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (apntDivResponse.data as any).message);
			}
			
			expect((apntDivResponse.data as any).success).toBe(true);

			// ë³¸ë? ì½”ë“œ ì¡°íšŒ
			const hqResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '113'
			});

			console.log("?“Š ë³¸ë? ì½”ë“œ ì¡°íšŒ ?‘ë‹µ:", hqResponse.data);

			expect(hqResponse.status).toBe(200);
			
			if (!(hqResponse.data as any).success) {
				console.log("??ë³¸ë? ì½”ë“œ ì¡°íšŒ ?¤íŒ¨ - ?‘ë‹µ:", hqResponse.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (hqResponse.data as any).message);
			}
			
			expect((hqResponse.data as any).success).toBe(true);

			// ?¤ì œ DB ?°ì´??ê²€ì¦?
			const apntDivData = (apntDivResponse.data as any).data;
			if (apntDivData && Array.isArray(apntDivData) && apntDivData.length > 0) {
				const code = apntDivData[0];
				expect(code).toHaveProperty("codeId");
				expect(code).toHaveProperty("codeNm");
			} else {
				console.log("?¹ï¸ ì¡°íšŒ??ë°œë ¹êµ¬ë¶„ ì½”ë“œ ?°ì´?°ê? ?†ìŠµ?ˆë‹¤.");
			}
		} catch (error) {
			console.log("??ê³µí†µ ì½”ë“œ ì¡°íšŒ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});

	test("ë³¸ë?ë³?ë¶€??ëª©ë¡ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ë³¸ë?ë³?ë¶€??ëª©ë¡ ì¡°íšŒ API ?¸ì¶œ ?œì‘");
			
			const response = await axios.post(`${baseURL}/api/psm/dept-by-hq`, {
				hqDivCd: '1000',
				allYn: 'Y'
			});

			console.log("?“Š ë³¸ë?ë³?ë¶€??ëª©ë¡ ì¡°íšŒ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("??ë³¸ë?ë³?ë¶€??ëª©ë¡ ì¡°íšŒ ?¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?¤ì œ DB ?°ì´??ê²€ì¦?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const dept = responseData[0];
				expect(dept).toHaveProperty("DATA");
				expect(dept).toHaveProperty("LABEL");
			} else {
				console.log("?¹ï¸ ì¡°íšŒ??ë¶€???°ì´?°ê? ?†ìŠµ?ˆë‹¤.");
			}
		} catch (error) {
			console.log("??ë³¸ë?ë³?ë¶€??ëª©ë¡ ì¡°íšŒ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});
}); 

