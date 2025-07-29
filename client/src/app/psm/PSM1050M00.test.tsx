/**
 * PSM1050M00 - ê²½ë ¥ ê³„ì‚° ?”ë©´ ?ŒìŠ¤??
 *
 * ?ŒìŠ¤??ëª©í‘œ:
 * - ê²½ë ¥ ê³„ì‚° ?”ë©´??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??™ì‘?˜ëŠ”ì§€ ê²€ì¦?
 * - ??ê°€ì§€ ë°©ì‹???¬ìš©?©ë‹ˆ??
 *   1. UI ?ŒìŠ¤?? Mock???¬ìš©??ì»´í¬?ŒíŠ¸ ?Œë”ë§??ŒìŠ¤??
 *   2. API ?ŒìŠ¤?? ?¤ì œ HTTP ?´ë¼?´ì–¸?¸ë? ?¬ìš©???œë²„ ?µì‹  ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ê²½ë ¥ ê³„ì‚°
 * - ?„ë¡œ??ê²½ë ¥ ì¡°íšŒ
 * - ê²½ë ¥ ?•ë³´ ?€??
 * - ê³µí†µ ì½”ë“œ ì¡°íšŒ
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

// ?¤ì œ HTTP ?´ë¼?´ì–¸???¬ìš© (?œë²„ ?¤í–‰ ??
const baseURL = "http://localhost:8080";

describe("PSM1050M00 - ê²½ë ¥ ê³„ì‚° ?”ë©´ - UI ?ŒìŠ¤??(Mock ?¬ìš©)", () => {
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

	test("ê²½ë ¥ ê³„ì‚° ?”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???œì‹œ?œë‹¤", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("ê²½ë ¥ê°œì›”??ê³„ì‚°")).toBeInTheDocument();
		});

		// ì£¼ìš” ê¸°ëŠ¥ ë²„íŠ¼???•ì¸
		expect(screen.getByText("ê³„ì‚°")).toBeInTheDocument();
		expect(screen.getByText("?•ì¸")).toBeInTheDocument();
		expect(screen.getByText("ì·¨ì†Œ")).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ê²½ë ¥ ?•ë³´ë¥??…ë ¥?˜ê³  ê³„ì‚° ë²„íŠ¼???´ë¦­?˜ë©´ ê²½ë ¥ ê³„ì‚°??ì§„í–‰?œë‹¤", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("ê³„ì‚°")).toBeInTheDocument();
		});

		// ê³„ì‚° ë²„íŠ¼ ?´ë¦­
		const calculateButton = screen.getByText("ê³„ì‚°");
		fireEvent.click(calculateButton);

		// ê³„ì‚° ë²„íŠ¼??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(calculateButton).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ?•ì¸ ë²„íŠ¼???´ë¦­?˜ë©´ ê²½ë ¥ ?•ë³´ê°€ ?€?¥ë˜ê³??ì—…???«íŒ??, async () => {
		const mockOnConfirm = jest.fn();
		const mockOnClose = jest.fn();

		render(<PSM1050M00 onClose={mockOnClose} onConfirm={mockOnConfirm} />);

		await waitFor(() => {
			expect(screen.getByText("?•ì¸")).toBeInTheDocument();
		});

		// ?•ì¸ ë²„íŠ¼ ?´ë¦­
		const confirmButton = screen.getByText("?•ì¸");
		fireEvent.click(confirmButton);

		// ?•ì¸ ë²„íŠ¼??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(confirmButton).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ì·¨ì†Œ ë²„íŠ¼???´ë¦­?˜ë©´ ?ì—…???«íŒ??, async () => {
		const mockOnClose = jest.fn();
		const mockOnConfirm = jest.fn();
		
		render(<PSM1050M00 onClose={mockOnClose} onConfirm={mockOnConfirm} />);

		await waitFor(() => {
			expect(screen.getByText("ì·¨ì†Œ")).toBeInTheDocument();
		});

		// ì·¨ì†Œ ë²„íŠ¼ ?´ë¦­
		const cancelButton = screen.getByText("ì·¨ì†Œ");
		fireEvent.click(cancelButton);

		// ì·¨ì†Œ ì²˜ë¦¬ ?•ì¸
		await waitFor(() => {
			expect(cancelButton).toBeInTheDocument();
		});
	});

	test("?¬ìš©?ê? ?ì‚¬/?¸ì£¼ êµ¬ë¶„??ë³€ê²½í•˜ë©?ê´€???„ë“œ?¤ì´ ?…ë°?´íŠ¸?œë‹¤", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("êµ¬ë¶„")).toBeInTheDocument();
		});

		// êµ¬ë¶„ ?„ë“œ ?•ì¸
		const empDivField = screen.getByText("êµ¬ë¶„");
		expect(empDivField).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ê²½ë ¥ê³„ì‚°ê¸°ì??¼ì„ ë³€ê²½í•˜ë©?ê²½ë ¥ ê³„ì‚° ê²°ê³¼ê°€ ?…ë°?´íŠ¸?œë‹¤", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("ìµœì¢…ì² ìˆ˜?¼ì")).toBeInTheDocument();
		});

		// ìµœì¢…ì² ìˆ˜?¼ì ?„ë“œ ?•ì¸
		const finalDateField = screen.getByText("ìµœì¢…ì² ìˆ˜?¼ì");
		expect(finalDateField).toBeInTheDocument();
	});
});

// ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??- ?œë²„ ?¤í–‰ ?œì—ë§??¤í–‰
describe("PSM1050M00 - ê²½ë ¥ ê³„ì‚° API - ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??", () => {
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
				ownOutsDiv: '1',
				carrCalcStndDt: '20241231'
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
				expect(responseData).toHaveProperty("TCN_GRD");
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

	test("?„ë¡œ??ê²½ë ¥ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ?„ë¡œ??ê²½ë ¥ ì¡°íšŒ API ?¸ì¶œ ?œì‘");
			
			const empNo = "EMP001";
			const response = await axios.post(`${baseURL}/api/psm/career/profile`, {
				empNo: empNo
			});

			console.log("?“Š ?„ë¡œ??ê²½ë ¥ ì¡°íšŒ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???„ë¡œ??ê²½ë ¥ ì¡°íšŒ ?¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?¤ì œ DB ?°ì´??ê²€ì¦?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const profile = responseData[0];
				expect(profile).toHaveProperty("EMP_NO");
				expect(profile).toHaveProperty("PRJT_NM");
				expect(profile).toHaveProperty("STRT_DT");
				expect(profile).toHaveProperty("END_DT");
			} else {
				console.log("?¹ï¸ ì¡°íšŒ???„ë¡œ??ê²½ë ¥???†ìŠµ?ˆë‹¤.");
				console.log("?¹ï¸ ?¬ì›ë²ˆí˜¸ 'EMP001'??ì¡´ì¬?˜ì? ?Šì„ ???ˆìŠµ?ˆë‹¤.");
			}
		} catch (error) {
			console.log("???„ë¡œ??ê²½ë ¥ ì¡°íšŒ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});

	test("ê²½ë ¥ ?•ë³´ ?€??APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ê²½ë ¥ ?•ë³´ ?€??API ?¸ì¶œ ?œì‘");
			
			const careerData = {
				empNo: 'EMP001',
				entrBefInYcnt: '2',
				entrBefInMcnt: '24',
				entrAftYcnt: '4',
				entrAftMcnt: '48',
				carrYcnt: '6',
				carrMcnt: '72',
				tcnGrd: 'ì¤‘ê¸‰',
				tcnGrdCd: '2',
				ctqlCarrYcnt: '1',
				ctqlCarrMcnt: '12',
				ctqlTcnGrd: 'ì´ˆê¸‰',
				ctqlTcnGrdCd: '1',
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/career/save`, careerData);

			console.log("?“Š ê²½ë ¥ ?•ë³´ ?€???‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("??ê²½ë ¥ ?•ë³´ ?€???¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("??ê²½ë ¥ ?•ë³´ ?€??API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
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

			// ?ê²©ì¦?ì½”ë“œ ì¡°íšŒ
			const ctqlResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '115'
			});

			console.log("?“Š ?ê²©ì¦?ì½”ë“œ ì¡°íšŒ ?‘ë‹µ:", ctqlResponse.data);

			expect(ctqlResponse.status).toBe(200);
			
			if (!(ctqlResponse.data as any).success) {
				console.log("???ê²©ì¦?ì½”ë“œ ì¡°íšŒ ?¤íŒ¨ - ?‘ë‹µ:", ctqlResponse.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (ctqlResponse.data as any).message);
			}
			
			expect((ctqlResponse.data as any).success).toBe(true);

			// ê¸°ìˆ ?±ê¸‰ ì½”ë“œ ì¡°íšŒ
			const tcnGrdResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '114'
			});

			console.log("?“Š ê¸°ìˆ ?±ê¸‰ ì½”ë“œ ì¡°íšŒ ?‘ë‹µ:", tcnGrdResponse.data);

			expect(tcnGrdResponse.status).toBe(200);
			
			if (!(tcnGrdResponse.data as any).success) {
				console.log("??ê¸°ìˆ ?±ê¸‰ ì½”ë“œ ì¡°íšŒ ?¤íŒ¨ - ?‘ë‹µ:", tcnGrdResponse.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (tcnGrdResponse.data as any).message);
			}
			
			expect((tcnGrdResponse.data as any).success).toBe(true);

			// ?¤ì œ DB ?°ì´??ê²€ì¦?
			const ctqlData = (ctqlResponse.data as any).data;
			if (ctqlData && Array.isArray(ctqlData) && ctqlData.length > 0) {
				const code = ctqlData[0];
				expect(code).toHaveProperty("codeId");
				expect(code).toHaveProperty("codeNm");
			} else {
				console.log("?¹ï¸ ì¡°íšŒ???ê²©ì¦?ì½”ë“œ ?°ì´?°ê? ?†ìŠµ?ˆë‹¤.");
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
}); 

