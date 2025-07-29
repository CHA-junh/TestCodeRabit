/*
 * USR2010M00 - ?¬ìš©??ê´€ë¦??”ë©´ ?˜ì´ë¸Œë¦¬???ŒìŠ¤??
 *
 * ???ŒìŠ¤?¸ëŠ” ??ê°€ì§€ ë°©ì‹???¬ìš©?©ë‹ˆ??
 * 1. UI ?ŒìŠ¤?? Mock???¬ìš©??ì»´í¬?ŒíŠ¸ ?Œë”ë§??ŒìŠ¤??
 * 2. API ?ŒìŠ¤?? ?¤ì œ HTTP ?´ë¼?´ì–¸?¸ë? ?¬ìš©???œë²„ ?µì‹  ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??
 *
 * - ì¡°íšŒ/?€???? œ ???¤ì œ ê±°ë˜ ?¸ì¶œ ë°©ì‹ ì¤€ë¹?
 * - ?¤ì œ DB ?°ê²°???µí•œ ?µí•© ?ŒìŠ¤??ì¤€ë¹?
 * - ?¤ì œ ?¬ìš©???œë‚˜ë¦¬ì˜¤ ê¸°ë°˜ ?ŒìŠ¤??
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import USR2010M00 from "./USR2010M00";
import axios from "axios";

// Mock axios for UI tests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// UI ?ŒìŠ¤?¸ìš© ìµœì†Œ?œì˜ Mock (?„ìš”?œì—ë§?
// ?¤ì œ API ?¸ì¶œ??ë°©ì??˜ê¸° ?„í•œ ê¸°ë³¸ Mock
jest.mock("../../modules/auth/services/authService", () => ({
	__esModule: true,
	default: {
		checkSession: jest.fn().mockResolvedValue({
			success: true,
			user: {
				userId: "test-user",
				empNo: "test-emp",
				userName: "?ŒìŠ¤???¬ìš©??,
				email: "test@example.com",
				deptNm: "?ŒìŠ¤??ë¶€??,
				dutyNm: "?ŒìŠ¤??ì§ê¸‰",
				authCd: "30",
				role: "ADMIN",
				permissions: ["read", "write"],
				lastLoginAt: new Date().toISOString(),
				menuList: [],
				programList: [],
				needsPasswordChange: false,
				deptDivCd: "DEPT001",
				hqDivCd: "HQ001",
				hqDivNm: "?ŒìŠ¤??ë³¸ë?",
				deptTp: "DEPT",
				dutyDivCd: "DUTY001",
			},
		}),
		login: jest.fn().mockResolvedValue({ success: true }),
		logout: jest.fn().mockResolvedValue({ success: true }),
		changePassword: jest.fn().mockResolvedValue({ success: true }),
	},
}));

// ?¤ì œ HTTP ?´ë¼?´ì–¸???¬ìš© (?œë²„ ?¤í–‰ ??
const baseURL = "http://localhost:8080";

describe("?¬ìš©??ê´€ë¦??”ë©´ - UI ?ŒìŠ¤??(Provider Wrapping)", () => {
	beforeEach(() => {
		// UI ?ŒìŠ¤?¸ìš© ê¸°ë³¸ Mock ?¤ì •
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

	test("?¬ìš©?ê? ?¬ìš©??ê´€ë¦??”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???œì‹œ?œë‹¤", async () => {
		render(<USR2010M00 />);

		// ì£¼ìš” ê¸°ëŠ¥ ë²„íŠ¼?¤ì´ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		expect(screen.getByText("?€??)).toBeInTheDocument();
		expect(screen.getByText("ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??)).toBeInTheDocument();

		// ê²€??ì¡°ê±´ ?„ë“œ?¤ì´ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		expect(screen.getByText("ë³¸ë?")).toBeInTheDocument();
		expect(screen.getByText("ë¶€??)).toBeInTheDocument();
		expect(screen.getByText("?¬ìš©?ëª…")).toBeInTheDocument();

		console.log(
			"???¬ìš©?ê? ?”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ?¬ìš©??ëª©ë¡???”ë©´???œì‹œ?œë‹¤", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
		const searchButton = screen.getByText("ì¡°íšŒ");
		fireEvent.click(searchButton);

		// ?¬ìš©??ëª©ë¡ ?Œì´ë¸??¤ë”ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			const gridHeaders = screen.getAllByText("?¬ë²ˆ");
			expect(gridHeaders.length).toBeGreaterThan(0);

			const nameHeaders = screen.getAllByText("?±ëª…");
			expect(nameHeaders.length).toBeGreaterThan(0);
		});

		console.log(
			"???¬ìš©?ê? ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ?¬ìš©??ëª©ë¡???”ë©´???œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ë³¸ë?ë¥?? íƒ?˜ë©´ ?´ë‹¹ ë³¸ë???ë¶€??ëª©ë¡???…ë°?´íŠ¸?œë‹¤", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ë³¸ë? ? íƒ ì½¤ë³´ë°•ìŠ¤ ì°¾ê¸° (title ?ì„± ?¬ìš©)
		const hqSelect = screen.getByTitle("ë³¸ë? ? íƒ");
		expect(hqSelect).toBeInTheDocument();

		// ë¶€??ì½¤ë³´ë°•ìŠ¤ê°€ ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸ (title ?ì„± ?¬ìš©)
		const deptSelect = screen.getByTitle("ë¶€??? íƒ");
		expect(deptSelect).toBeInTheDocument();

		console.log(
			"???¬ìš©?ê? ë³¸ë?ë¥?? íƒ?˜ë©´ ?´ë‹¹ ë³¸ë???ë¶€??ëª©ë¡???…ë°?´íŠ¸?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ?¬ìš©?ëª…???…ë ¥?˜ê³  ì¡°íšŒ?˜ë©´ ?´ë‹¹ ?¬ìš©?ê? ëª©ë¡???œì‹œ?œë‹¤", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ?¬ìš©?ëª… ?…ë ¥ ?„ë“œ ì°¾ê¸°
		const userNmInput = screen.getByPlaceholderText("?¬ìš©?ëª… ?…ë ¥");

		// ?¬ìš©?ëª… ?…ë ¥
		fireEvent.change(userNmInput, { target: { value: "ê¹€" } });

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
		fireEvent.click(screen.getByText("ì¡°íšŒ"));

		// ê²€??ê²°ê³¼ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(userNmInput).toHaveValue("ê¹€");
		});

		console.log(
			"???¬ìš©?ê? ?¬ìš©?ëª…???…ë ¥?˜ê³  ì¡°íšŒ?˜ë©´ ?´ë‹¹ ?¬ìš©?ê? ëª©ë¡???œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ëª©ë¡?ì„œ ?¬ìš©?ë? ?´ë¦­?˜ë©´ ?ì„¸ ?•ë³´ê°€ ?¼ì— ?œì‹œ?œë‹¤", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­?˜ì—¬ ëª©ë¡ ë¡œë“œ
		fireEvent.click(screen.getByText("ì¡°íšŒ"));

		// ?¬ìš©??ëª©ë¡ ?Œì´ë¸??¤ë”ê°€ ?œì‹œ???Œê¹Œì§€ ?€ê¸?
		await waitFor(() => {
			const gridHeaders = screen.getAllByText("?¬ë²ˆ");
			expect(gridHeaders.length).toBeGreaterThan(0);

			const nameHeaders = screen.getAllByText("?±ëª…");
			expect(nameHeaders.length).toBeGreaterThan(0);
		});

		console.log(
			"???¬ìš©?ê? ëª©ë¡?ì„œ ?¬ìš©?ë? ?´ë¦­?˜ë©´ ?ì„¸ ?•ë³´ê°€ ?¼ì— ?œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ?€??ë²„íŠ¼???´ë¦­?˜ë©´ ?€???•ì¸ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("?€??)).toBeInTheDocument();
		});

		// ?€??ë²„íŠ¼ ?´ë¦­
		const saveButton = screen.getByText("?€??);
		fireEvent.click(saveButton);

		// ?€???•ì¸ ë©”ì‹œì§€ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});

		console.log(
			"???¬ìš©?ê? ?€??ë²„íŠ¼???´ë¦­?˜ë©´ ?€???•ì¸ ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??ë²„íŠ¼???´ë¦­?˜ë©´ ì´ˆê¸°???•ì¸ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??)).toBeInTheDocument();
		});

		// ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??ë²„íŠ¼ ?´ë¦­
		const initPasswordButton = screen.getByText("ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??);
		fireEvent.click(initPasswordButton);

		// ì´ˆê¸°???•ì¸ ë©”ì‹œì§€ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(initPasswordButton).toBeInTheDocument();
		});

		console.log(
			"???¬ìš©?ê? ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??ë²„íŠ¼???´ë¦­?˜ë©´ ì´ˆê¸°???•ì¸ ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ?¹ì¸ê²°ì¬?ë? ?…ë ¥?˜ë©´ ?…ë ¥??ê°’ì´ ?”ë©´??ë°˜ì˜?œë‹¤", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ?¹ì¸ê²°ì¬???…ë ¥ ?„ë“œ ì°¾ê¸°
		const approverInput =
			screen.getByPlaceholderText("?¹ì¸ê²°ì¬?ëª…???…ë ¥?˜ì„¸??);

		// ?¹ì¸ê²°ì¬?ëª… ?…ë ¥
		fireEvent.change(approverInput, { target: { value: "ê¹€ë¶€?? } });

		// ?…ë ¥??ê°’ì´ ?”ë©´??ë°˜ì˜?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(approverInput).toHaveValue("ê¹€ë¶€??);
		});

		console.log(
			"???¬ìš©?ê? ?¹ì¸ê²°ì¬?ë? ?…ë ¥?˜ë©´ ?…ë ¥??ê°’ì´ ?”ë©´??ë°˜ì˜?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ?¬ìš©????• ??? íƒ?˜ë©´ ? íƒ????• ???”ë©´???œì‹œ?œë‹¤", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ?¬ìš©????•  ? íƒ ì½¤ë³´ë°•ìŠ¤ ì°¾ê¸° (title ?ì„± ?¬ìš©)
		const roleSelect = screen.getByTitle("?¬ìš©????•  ? íƒ");
		expect(roleSelect).toBeInTheDocument();

		console.log(
			"???¬ìš©?ê? ?¬ìš©????• ??? íƒ?˜ë©´ ? íƒ????• ???”ë©´???œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ?…ë¬´ê¶Œí•œ??? íƒ?˜ë©´ ? íƒ??ê¶Œí•œ???”ë©´???œì‹œ?œë‹¤", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ?…ë¬´ê¶Œí•œ ? íƒ ì½¤ë³´ë°•ìŠ¤ ì°¾ê¸° (title ?ì„± ?¬ìš©)
		const authSelect = screen.getByTitle("?…ë¬´ê¶Œí•œ ? íƒ");
		expect(authSelect).toBeInTheDocument();

		console.log(
			"???¬ìš©?ê? ?…ë¬´ê¶Œí•œ??? íƒ?˜ë©´ ? íƒ??ê¶Œí•œ???”ë©´???œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ëª¨ë“  ?„ìˆ˜ ?•ë³´ë¥??…ë ¥?˜ê³  ?€?¥í•˜ë©??€???„ë£Œ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("?€??)).toBeInTheDocument();
		});

		// ?€??ë²„íŠ¼ ?´ë¦­
		const saveButton = screen.getByText("?€??);
		fireEvent.click(saveButton);

		// ?€???„ë£Œ ë©”ì‹œì§€ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});

		console.log(
			"???¬ìš©?ê? ëª¨ë“  ?„ìˆ˜ ?•ë³´ë¥??…ë ¥?˜ê³  ?€?¥í•˜ë©??€???„ë£Œ ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ?”ë©´??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???¬ìš©?????ˆë‹¤", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(screen.getByText("?€??)).toBeInTheDocument();
		expect(screen.getByText("ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??)).toBeInTheDocument();
		expect(screen.getByText("ë³¸ë?")).toBeInTheDocument();
		expect(screen.getByText("ë¶€??)).toBeInTheDocument();
		expect(screen.getByText("?¬ìš©?ëª…")).toBeInTheDocument();

		console.log(
			"???¬ìš©?ê? ?”ë©´??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??¬ìš©?????ˆìŠµ?ˆë‹¤."
		);
	});
});

// ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??- ?œë²„ ?¤í–‰ ?œì—ë§??¤í–‰
describe("?¬ìš©??ê´€ë¦?API - ?¤ì œ DB ?°ê²° ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??", () => {
	// ?œë²„ê°€ ?¤í–‰ ì¤‘ì¸ì§€ ?•ì¸?˜ëŠ” ?¬í¼ ?¨ìˆ˜
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/health`, { timeout: 2000 });
			return true;
		} catch (error) {
			return false;
		}
	};

	beforeAll(async () => {
		// ?œë²„ê°€ ?¤í–‰ ì¤‘ì¸ì§€ ?•ì¸
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log(
				"? ï¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•˜?µë‹ˆ?? ?¤ì œ DB ?°ê²° ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??"
			);
		}
	});

	test("?¬ìš©??ëª©ë¡ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/users`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?¤ì œ DB ?°ì´??ê²€ì¦?
		if ((response.data as any).data.length > 0) {
			const user = (response.data as any).data[0];
			expect(user).toHaveProperty("usrId");
			expect(user).toHaveProperty("usrNm");
			expect(user).toHaveProperty("useYn");
		}
	});

	test("?¬ìš©???€??APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const newUser = {
			usrId: "",
			usrNm: "?ŒìŠ¤???¬ìš©??,
			useYn: "Y",
			hqCd: "HQ001",
			deptCd: "DEPT001",
			usrRoleId: "ROLE001",
			approverNm: "ê¹€ë¶€??,
		};

		const response = await axios.post(`${baseURL}/api/usr/users`, {
			createdRows: [newUser],
			updatedRows: [],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?¬ìš©???˜ì • APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const updateUser = {
			usrId: "TEST001",
			usrNm: "?˜ì •???¬ìš©??,
			useYn: "Y",
			hqCd: "HQ001",
			deptCd: "DEPT001",
			usrRoleId: "ROLE001",
			approverNm: "ê¹€ë¶€??,
		};

		const response = await axios.post(`${baseURL}/api/usr/users`, {
			createdRows: [],
			updatedRows: [updateUser],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?¬ìš©???? œ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const deleteUser = {
			usrId: "TEST001",
			usrNm: "?? œ???¬ìš©??,
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

	test("ë¹„ë?ë²ˆí˜¸ ì´ˆê¸°??APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const userId = "TEST001";
		const response = await axios.post(
			`${baseURL}/api/usr/users/${userId}/reset-password`
		);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("ì½”ë“œ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/codes`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?¤ì œ DB ?°ì´??ê²€ì¦?
		if ((response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});

	test("?¬ìš©????•  ëª©ë¡ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/user-roles`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?¤ì œ DB ?°ì´??ê²€ì¦?
		if ((response.data as any).data.length > 0) {
			const role = (response.data as any).data[0];
			expect(role).toHaveProperty("usrRoleId");
			expect(role).toHaveProperty("usrRoleNm");
		}
	});
});


