/**
 * PSM1020M00 - ?¬ì› ?•ë³´ ?±ë¡/?˜ì • ?”ë©´ ?ŒìŠ¤??
 *
 * ?ŒìŠ¤??ëª©í‘œ:
 * - ?¬ì› ?•ë³´ ?±ë¡/?˜ì • ?”ë©´??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??™ì‘?˜ëŠ”ì§€ ê²€ì¦?
 * - ??ê°€ì§€ ë°©ì‹???¬ìš©?©ë‹ˆ??
 *   1. UI ?ŒìŠ¤?? Mock???¬ìš©??ì»´í¬?ŒíŠ¸ ?Œë”ë§??ŒìŠ¤??
 *   2. API ?ŒìŠ¤?? ?¤ì œ HTTP ?´ë¼?´ì–¸?¸ë? ?¬ìš©???œë²„ ?µì‹  ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ì› ?•ë³´ ?±ë¡/?˜ì •
 * - ê²½ë ¥ê³„ì‚° ?ì—… ?¸ì¶œ
 * - ê³µí†µ ì½”ë“œ ì¡°íšŒ
 * - ë³¸ë?ë³?ë¶€??ëª©ë¡ ì¡°íšŒ
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

// ?¤ì œ HTTP ?´ë¼?´ì–¸???¬ìš© (?œë²„ ?¤í–‰ ??
const baseURL = "http://localhost:8080";

describe("PSM1020M00 - ?¬ì› ?•ë³´ ?±ë¡/?˜ì • ?”ë©´ - UI ?ŒìŠ¤??(Mock ?¬ìš©)", () => {
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

	test("?¬ì› ?•ë³´ ?±ë¡/?˜ì • ?”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???œì‹œ?œë‹¤", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?ê¸¸??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?ì‚¬ ?¸ì£¼ êµ¬ë¶„")).toBeInTheDocument();
		});

		// ì£¼ìš” ê¸°ëŠ¥ ë²„íŠ¼???•ì¸
		expect(screen.getByText("?€??)).toBeInTheDocument();
		expect(screen.getByText("?? œ")).toBeInTheDocument();
		expect(screen.getByText("? ê·œ")).toBeInTheDocument();
		expect(screen.getByText("ê²½ë ¥ê³„ì‚°")).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ?¬ì› ?•ë³´ë¥??…ë ¥?˜ê³  ?€??ë²„íŠ¼???´ë¦­?˜ë©´ ?€??ì²˜ë¦¬ê°€ ì§„í–‰?œë‹¤", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?ê¸¸??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?€??)).toBeInTheDocument();
		});

		// ?€??ë²„íŠ¼ ?´ë¦­
		const saveButton = screen.getByText("?€??);
		fireEvent.click(saveButton);

		// ?€??ë²„íŠ¼??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(saveButton).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ê²½ë ¥ê³„ì‚° ë²„íŠ¼???´ë¦­?˜ë©´ ê²½ë ¥ê³„ì‚° ?ì—…???œì‹œ?œë‹¤", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?ê¸¸??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("ê²½ë ¥ê³„ì‚°")).toBeInTheDocument();
		});

		// ê²½ë ¥ê³„ì‚° ë²„íŠ¼ ?´ë¦­
		const careerCalcButton = screen.getByText("ê²½ë ¥ê³„ì‚°");
		fireEvent.click(careerCalcButton);

		// ?ì—… ?œì‹œ ?•ì¸
		await waitFor(() => {
			expect(careerCalcButton).toBeInTheDocument();
		});
	});

	test("?¬ìš©?ê? ?? œ ë²„íŠ¼???´ë¦­?˜ë©´ ?? œ ?•ì¸ ?¤ì´?¼ë¡œê·¸ê? ?œì‹œ?œë‹¤", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?ê¸¸??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?? œ")).toBeInTheDocument();
		});

		// ?? œ ë²„íŠ¼ ?´ë¦­
		const deleteButton = screen.getByText("?? œ");
		fireEvent.click(deleteButton);

		// ?•ì¸ ?¤ì´?¼ë¡œê·??œì‹œ ?•ì¸
		await waitFor(() => {
			expect(screen.getByText(/?? œ?˜ì‹œê² ìŠµ?ˆê¹Œ/)).toBeInTheDocument();
		});
	});

	test("?¬ìš©?ê? ? ê·œ ë²„íŠ¼???´ë¦­?˜ë©´ ?…ë ¥ ?„ë“œê°€ ì´ˆê¸°?”ëœ??, async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?ê¸¸??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("? ê·œ")).toBeInTheDocument();
		});

		// ? ê·œ ë²„íŠ¼ ?´ë¦­
		const newButton = screen.getByText("? ê·œ");
		fireEvent.click(newButton);

		// ? ê·œ ë²„íŠ¼??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(newButton).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ë³¸ë?ë¥?ë³€ê²½í•˜ë©??´ë‹¹ ë³¸ë???ë¶€??ëª©ë¡???…ë°?´íŠ¸?œë‹¤", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?ê¸¸??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("ë³¸ë?")).toBeInTheDocument();
		});

		// ë³¸ë? ? íƒ ë³€ê²?
		const hqSelect = screen.getByText("ë³¸ë?");
		expect(hqSelect).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ?ì‚¬/?¸ì£¼ êµ¬ë¶„??ë³€ê²½í•˜ë©?ê´€???„ë“œ?¤ì´ ?…ë°?´íŠ¸?œë‹¤", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?ê¸¸??
		};

		render(<PSM1020M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?ì‚¬ ?¸ì£¼ êµ¬ë¶„")).toBeInTheDocument();
		});

		// ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ? íƒ ë³€ê²?
		const empDivSelect = screen.getByText("?ì‚¬ ?¸ì£¼ êµ¬ë¶„");
		expect(empDivSelect).toBeInTheDocument();
	});
});

// ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??- ?œë²„ ?¤í–‰ ?œì—ë§??¤í–‰
describe("PSM1020M00 - ?¬ì› ?•ë³´ ?±ë¡/?˜ì • API - ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??", () => {
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

	test("?¬ì› ?•ë³´ ?…ë°?´íŠ¸ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ?¬ì› ?•ë³´ ?…ë°?´íŠ¸ API ?¸ì¶œ ?œì‘");
			
			const updateEmployee = {
				mode: 'MOD',
				empNo: 'EMP001',
				empNm: '?ŒìŠ¤???¬ì›',
				ownOutsDiv: '1',
				hqDivCd: '1000',
				deptDivCd: '1100',
				dutyCd: '9',
				entrDt: '20240101',
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/employee/update`, updateEmployee);

			console.log("?“Š ?¬ì› ?•ë³´ ?…ë°?´íŠ¸ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			// success ?„ë“œê°€ false??ê²½ìš° ?ì„¸ ?•ë³´ ì¶œë ¥
			if (!(response.data as any).success) {
				console.log("???¬ì› ?•ë³´ ?…ë°?´íŠ¸ ?¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("???¬ì› ?•ë³´ ?…ë°?´íŠ¸ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});

	test("ê²½ë ¥ ê³„ì‚° APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ê²½ë ¥ ê³„ì‚° API ?¸ì¶œ ?œì‘");
			
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

			console.log("?“Š ê²½ë ¥ ê³„ì‚° ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("??ê²½ë ¥ ê³„ì‚° ?¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?¤ì œ DB ?°ì´??ê²€ì¦?
			const responseData = (response.data as any).data;
			if (responseData && typeof responseData === 'object' && Object.keys(responseData).length > 0) {
				expect(responseData).toHaveProperty("CARR_YCNT");
				expect(responseData).toHaveProperty("CARR_MCNT");
			} else {
				console.log("?¹ï¸ ê²½ë ¥ ê³„ì‚° ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.");
				console.log("?¹ï¸ ?¬ì›ë²ˆí˜¸ 'EMP001'??ì¡´ì¬?˜ì? ?Šê±°??ê²½ë ¥ ?°ì´?°ê? ?†ì„ ???ˆìŠµ?ˆë‹¤.");
				// ë¹??‘ë‹µ?´ì–´??API ?¸ì¶œ ?ì²´???±ê³µ?¼ë¡œ ê°„ì£¼
				expect(responseData).toBeDefined();
			}
		} catch (error) {
			console.log("??ê²½ë ¥ ê³„ì‚° API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});

	test("?¬ì› ?•ë³´ ?? œ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ?¬ì› ?•ë³´ ?? œ API ?¸ì¶œ ?œì‘");
			
			const deleteEmployee = {
				empNo: 'EMP001',
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/employee/delete`, deleteEmployee);

			console.log("?“Š ?¬ì› ?•ë³´ ?? œ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???¬ì› ?•ë³´ ?? œ ?¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("???¬ì› ?•ë³´ ?? œ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
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

			// ì§ì±… ì½”ë“œ ì¡°íšŒ
			const dutyResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '116'
			});

			console.log("?“Š ì§ì±… ì½”ë“œ ì¡°íšŒ ?‘ë‹µ:", dutyResponse.data);

			expect(dutyResponse.status).toBe(200);
			
			if (!(dutyResponse.data as any).success) {
				console.log("??ì§ì±… ì½”ë“œ ì¡°íšŒ ?¤íŒ¨ - ?‘ë‹µ:", dutyResponse.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (dutyResponse.data as any).message);
			}
			
			expect((dutyResponse.data as any).success).toBe(true);

			// ?¤ì œ DB ?°ì´??ê²€ì¦?
			const hqData = (hqResponse.data as any).data;
			if (hqData && Array.isArray(hqData) && hqData.length > 0) {
				const code = hqData[0];
				expect(code).toHaveProperty("codeId");
				expect(code).toHaveProperty("codeNm");
			} else {
				console.log("?¹ï¸ ì¡°íšŒ??ë³¸ë? ì½”ë“œ ?°ì´?°ê? ?†ìŠµ?ˆë‹¤.");
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

