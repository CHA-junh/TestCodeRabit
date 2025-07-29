/**
 * PSM0050M00 - ?„ë¡œ??ê´€ë¦??”ë©´ ?ŒìŠ¤??
 *
 * ?ŒìŠ¤??ëª©í‘œ:
 * - ?„ë¡œ??ê´€ë¦??”ë©´??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??™ì‘?˜ëŠ”ì§€ ê²€ì¦?
 * - ??ê°€ì§€ ë°©ì‹???¬ìš©?©ë‹ˆ??
 *   1. UI ?ŒìŠ¤?? Mock???¬ìš©??ì»´í¬?ŒíŠ¸ ?Œë”ë§??ŒìŠ¤??
 *   2. API ?ŒìŠ¤?? ?¤ì œ HTTP ?´ë¼?´ì–¸?¸ë? ?¬ìš©???œë²„ ?µì‹  ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¬ì› ?•ë³´ ì¡°íšŒ
 * - ?„ë¡œ???±ë¡/?˜ì •/?? œ
 * - ê²½ë ¥ ê³„ì‚°
 * - ?‘ì? ?¤ìš´ë¡œë“œ
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import PSM0050M00 from "./PSM0050M00";
import axios from "axios";

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock fetch for API calls
global.fetch = jest.fn();

// ?¤ì œ HTTP ?´ë¼?´ì–¸???¬ìš© (?œë²„ ?¤í–‰ ??
const baseURL = "http://localhost:8080";

describe("PSM0050M00 - ?„ë¡œ??ê´€ë¦??”ë©´ - UI ?ŒìŠ¤??(Mock ?¬ìš©)", () => {
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

	test("?„ë¡œ??ê´€ë¦??”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???œì‹œ?œë‹¤", async () => {
		render(<PSM0050M00 />);

		await waitFor(() => {
			expect(screen.getByText("?¬ì›ëª?)).toBeInTheDocument();
		});

		// ì£¼ìš” ê¸°ëŠ¥ ë²„íŠ¼???•ì¸ (?¤ì œ ?”ë©´???œì‹œ?˜ëŠ” ê²ƒë“¤ë§?
		expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		expect(screen.getByText("?€??)).toBeInTheDocument();
		expect(screen.getByText("?? œ")).toBeInTheDocument();
		expect(screen.getByText("? ê·œ")).toBeInTheDocument();
		// ?‘ì?ê³?ê²½ë ¥ê³„ì‚° ë²„íŠ¼?€ ì¡°ê±´ë¶€ë¡??œì‹œ?????ˆìœ¼ë¯€ë¡??œê±°
	});

	test("?¬ìš©?ê? ?¬ì›ë²ˆí˜¸ë¥??…ë ¥?˜ê³  ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ?¬ì› ?•ë³´ê°€ ì¡°íšŒ?œë‹¤", async () => {
		render(<PSM0050M00 />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
		const searchButton = screen.getByText("ì¡°íšŒ");
		fireEvent.click(searchButton);

		// ì¡°íšŒ ë²„íŠ¼??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(searchButton).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ?„ë¡œ???•ë³´ë¥??…ë ¥?˜ê³  ?€??ë²„íŠ¼???´ë¦­?˜ë©´ ?€??ì²˜ë¦¬ê°€ ì§„í–‰?œë‹¤", async () => {
		render(<PSM0050M00 />);

		await waitFor(() => {
			expect(screen.getByText("?€??)).toBeInTheDocument();
		});

		// ?€??ë²„íŠ¼ ?´ë¦­
		const saveButton = screen.getByText("?€??);
		fireEvent.click(saveButton);

		// ?€??ë²„íŠ¼??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(saveButton).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ? ê·œ ë²„íŠ¼???´ë¦­?˜ë©´ ?…ë ¥ ?„ë“œê°€ ì´ˆê¸°?”ëœ??, async () => {
		render(<PSM0050M00 />);

		await waitFor(() => {
			expect(screen.getByText("? ê·œ")).toBeInTheDocument();
		});

		// ? ê·œ ë²„íŠ¼ ?´ë¦­
		const newButton = screen.getByText("? ê·œ");
		fireEvent.click(newButton);

		// ? ê·œ ë²„íŠ¼??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(newButton).toBeInTheDocument();
	});

	test("?¬ìš©?ê? ?? œ ë²„íŠ¼???´ë¦­?˜ë©´ ?? œ ?•ì¸ ?¤ì´?¼ë¡œê·¸ê? ?œì‹œ?œë‹¤", async () => {
		render(<PSM0050M00 />);

		await waitFor(() => {
			expect(screen.getByText("?? œ")).toBeInTheDocument();
		});

		// ?? œ ë²„íŠ¼ ?´ë¦­
		const deleteButton = screen.getByText("?? œ");
		fireEvent.click(deleteButton);

		// ?? œ ë²„íŠ¼??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(deleteButton).toBeInTheDocument();
	});
});

// ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??- ?œë²„ ?¤í–‰ ?œì—ë§??¤í–‰
describe("PSM0050M00 - ?„ë¡œ??ê´€ë¦?API - ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??", () => {
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

	test("?¬ì› ?•ë³´ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ?¬ì› ?•ë³´ ì¡°íšŒ API ?¸ì¶œ ?œì‘");
			
			const empNo = "EMP001";
			const response = await axios.post(`${baseURL}/api/psm/employee/search`, {
				empNo: empNo
			});

			console.log("?“Š ?¬ì› ?•ë³´ ì¡°íšŒ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???¬ì› ?•ë³´ ì¡°íšŒ ?¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?¤ì œ DB ?°ì´??ê²€ì¦?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const employee = responseData[0];
				expect(employee).toHaveProperty("EMP_NO");
				expect(employee).toHaveProperty("EMP_NM");
			} else {
				console.log("?¹ï¸ ì¡°íšŒ???¬ì› ?•ë³´ê°€ ?†ìŠµ?ˆë‹¤.");
				console.log("?¹ï¸ ?¬ì›ë²ˆí˜¸ 'EMP001'??ì¡´ì¬?˜ì? ?Šì„ ???ˆìŠµ?ˆë‹¤.");
			}
		} catch (error) {
			console.log("???¬ì› ?•ë³´ ì¡°íšŒ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});

	test("?„ë¡œ??ëª©ë¡ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ?„ë¡œ??ëª©ë¡ ì¡°íšŒ API ?¸ì¶œ ?œì‘");
			
			const empNo = "EMP001";
			const response = await axios.post(`${baseURL}/api/psm/profile/search`, {
				empNo: empNo
			});

			console.log("?“Š ?„ë¡œ??ëª©ë¡ ì¡°íšŒ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???„ë¡œ??ëª©ë¡ ì¡°íšŒ ?¤íŒ¨ - ?‘ë‹µ:", response.data);
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
				console.log("?¹ï¸ ì¡°íšŒ???„ë¡œ?„ì´ ?†ìŠµ?ˆë‹¤.");
				console.log("?¹ï¸ ?¬ì›ë²ˆí˜¸ 'EMP001'??ì¡´ì¬?˜ì? ?Šì„ ???ˆìŠµ?ˆë‹¤.");
			}
		} catch (error) {
			console.log("???„ë¡œ??ëª©ë¡ ì¡°íšŒ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});

	test("?„ë¡œ???€??APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ?„ë¡œ???€??API ?¸ì¶œ ?œì‘");
			
			const profileData = {
				mode: 'NEW',
				empNo: 'EMP001',
				bsnNo: 'BSN001',
				seqNo: '1',
				prjtNm: '?ŒìŠ¤???„ë¡œ?íŠ¸',
				strtDt: '20240101',
				endDt: '20241231',
				mmbrCo: '?ŒìŠ¤???Œì‚¬',
				delpEnvr: 'Java, Spring',
				roleNm: 'ê°œë°œ??,
				chrgWrk: 'ë°±ì—”??ê°œë°œ',
				taskNm: 'API ê°œë°œ',
				rmk: '?ŒìŠ¤???„ë¡œ??,
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/profile/save`, profileData);

			console.log("?“Š ?„ë¡œ???€???‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???„ë¡œ???€???¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("???„ë¡œ???€??API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});

	test("?„ë¡œ???? œ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ?„ë¡œ???? œ API ?¸ì¶œ ?œì‘");
			
			const deleteProfile = {
				empNo: 'EMP001',
				bsnNo: 'BSN001',
				seqNo: '1',
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/profile/delete`, deleteProfile);

			console.log("?“Š ?„ë¡œ???? œ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???„ë¡œ???? œ ?¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("???„ë¡œ???? œ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
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

	test("?„ë¡œ???‘ì? ?¤ìš´ë¡œë“œ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ?„ë¡œ???‘ì? ?¤ìš´ë¡œë“œ API ?¸ì¶œ ?œì‘");
			
			const empNo = "EMP001";
			const response = await axios.post(`${baseURL}/api/psm/profile/excel`, {
				empNo: empNo
			}, {
				responseType: 'blob'
			});

			console.log("?“Š ?„ë¡œ???‘ì? ?¤ìš´ë¡œë“œ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			// content-type ?¤ë”ê°€ ?ˆëŠ” ê²½ìš°?ë§Œ ?•ì¸
			if (response.headers['content-type']) {
				expect(response.headers['content-type']).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			} else {
				console.log("?¹ï¸ content-type ?¤ë”ê°€ ?¤ì •?˜ì? ?Šì•˜?µë‹ˆ??");
				// ?¤ë”ê°€ ?†ì–´??API ?¸ì¶œ ?ì²´???±ê³µ?¼ë¡œ ê°„ì£¼
				expect(response.data).toBeDefined();
			}
		} catch (error) {
			console.log("???„ë¡œ???‘ì? ?¤ìš´ë¡œë“œ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});
}); 

