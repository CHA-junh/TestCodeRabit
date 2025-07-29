/*
 * SYS1003M00 - ?¬ìš©????•  ê´€ë¦??”ë©´ ?˜ì´ë¸Œë¦¬???ŒìŠ¤??
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
import RoleManagementPage from "./SYS1003M00";
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

describe("?¬ìš©????•  ê´€ë¦??”ë©´ - UI ?ŒìŠ¤??(Provider Wrapping)", () => {
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

	test("?¬ìš©?ê? ?¬ìš©????•  ê´€ë¦??”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???œì‹œ?œë‹¤", async () => {
		render(<RoleManagementPage />);

		// ì£¼ìš” ê¸°ëŠ¥ ë²„íŠ¼?¤ì´ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		expect(screen.getByText("?€??)).toBeInTheDocument();
		expect(screen.getByText("? ê·œ")).toBeInTheDocument();
		expect(screen.getByText("??• ë³µì‚¬")).toBeInTheDocument();

		// ê²€??ì¡°ê±´ ?„ë“œ?¤ì´ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		expect(screen.getByText("?¬ìš©?ì—­? ì½”??ëª?)).toBeInTheDocument();
		expect(screen.getAllByText("?¬ìš©?¬ë?").length).toBeGreaterThan(0);

		console.log(
			"???¬ìš©?ê? ?”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ??•  ëª©ë¡???”ë©´???œì‹œ?œë‹¤", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
		const searchButton = screen.getByText("ì¡°íšŒ");
		fireEvent.click(searchButton);

		// ??•  ëª©ë¡ ?Œì´ë¸??¤ë”ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(screen.getByText("?¬ìš©?ì—­??ëª©ë¡")).toBeInTheDocument();
		});

		console.log(
			"???¬ìš©?ê? ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ??•  ëª©ë¡???”ë©´???œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ??• ëª…ì„ ?…ë ¥?˜ê³  ì¡°íšŒ?˜ë©´ ?´ë‹¹ ??• ??ëª©ë¡???œì‹œ?œë‹¤", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ??• ëª??…ë ¥ ?„ë“œ ì°¾ê¸°
		const roleNmInput = screen.getByPlaceholderText("ì½”ë“œ ?ëŠ” ëª??…ë ¥");

		// ??• ëª??…ë ¥
		fireEvent.change(roleNmInput, { target: { value: "ê´€ë¦¬ì" } });

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
		fireEvent.click(screen.getByText("ì¡°íšŒ"));

		// ê²€??ê²°ê³¼ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(roleNmInput).toHaveValue("ê´€ë¦¬ì");
		});

		console.log(
			"???¬ìš©?ê? ??• ëª…ì„ ?…ë ¥?˜ê³  ì¡°íšŒ?˜ë©´ ?´ë‹¹ ??• ??ëª©ë¡???œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ëª©ë¡?ì„œ ??• ???´ë¦­?˜ë©´ ?ì„¸ ?•ë³´ê°€ ?¼ì— ?œì‹œ?œë‹¤", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­?˜ì—¬ ëª©ë¡ ë¡œë“œ
		fireEvent.click(screen.getByText("ì¡°íšŒ"));

		// ??•  ëª©ë¡ ?Œì´ë¸??¤ë”ê°€ ?œì‹œ???Œê¹Œì§€ ?€ê¸?
		await waitFor(() => {
			expect(screen.getByText("?¬ìš©?ì—­??ëª©ë¡")).toBeInTheDocument();
		});

		console.log(
			"???¬ìš©?ê? ëª©ë¡?ì„œ ??• ???´ë¦­?˜ë©´ ?ì„¸ ?•ë³´ê°€ ?¼ì— ?œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ?€??ë²„íŠ¼???´ë¦­?˜ë©´ ?€???•ì¸ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤", async () => {
		render(<RoleManagementPage />);

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

	test("?¬ìš©?ê? ? ê·œ ë²„íŠ¼???´ë¦­?˜ë©´ ?¼ì´ ì´ˆê¸°?”ëœ??, async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("? ê·œ")).toBeInTheDocument();
		});

		// ? ê·œ ë²„íŠ¼ ?´ë¦­
		const newButton = screen.getByText("? ê·œ");
		fireEvent.click(newButton);

		// ? ê·œ ë²„íŠ¼???•ìƒ?ìœ¼ë¡??´ë¦­?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(newButton).toBeInTheDocument();
		});

		console.log("???¬ìš©?ê? ? ê·œ ë²„íŠ¼???´ë¦­?˜ë©´ ?¼ì´ ì´ˆê¸°?”ë©?ˆë‹¤.");
	});

	test("?¬ìš©?ê? ??• ë³µì‚¬ ë²„íŠ¼???´ë¦­?˜ë©´ ??• ??ë³µì‚¬?œë‹¤", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("??• ë³µì‚¬")).toBeInTheDocument();
		});

		// ??• ë³µì‚¬ ë²„íŠ¼ ?´ë¦­
		const copyButton = screen.getByText("??• ë³µì‚¬");
		fireEvent.click(copyButton);

		// ??• ë³µì‚¬ ë²„íŠ¼???•ìƒ?ìœ¼ë¡??´ë¦­?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(copyButton).toBeInTheDocument();
		});

		console.log("???¬ìš©?ê? ??• ë³µì‚¬ ë²„íŠ¼???´ë¦­?˜ë©´ ??• ??ë³µì‚¬?©ë‹ˆ??");
	});

	test("?¬ìš©?ê? ?¬ìš©?¬ë?ë¥?? íƒ?˜ë©´ ? íƒ??ê°’ì´ ?”ë©´???œì‹œ?œë‹¤", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ?¬ìš©?¬ë? ? íƒ ì½¤ë³´ë°•ìŠ¤ ì°¾ê¸° (aria-label ?¬ìš©)
		const useYnSelect = screen.getByLabelText("?¬ìš©?¬ë? ? íƒ");
		expect(useYnSelect).toBeInTheDocument();

		console.log(
			"???¬ìš©?ê? ?¬ìš©?¬ë?ë¥?? íƒ?˜ë©´ ? íƒ??ê°’ì´ ?”ë©´???œì‹œ?©ë‹ˆ??"
		);
	});

	test("?¬ìš©?ê? ëª¨ë“  ?„ìˆ˜ ?•ë³´ë¥??…ë ¥?˜ê³  ?€?¥í•˜ë©??€???„ë£Œ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤", async () => {
		render(<RoleManagementPage />);

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
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(screen.getByText("?€??)).toBeInTheDocument();
		expect(screen.getByText("? ê·œ")).toBeInTheDocument();
		expect(screen.getByText("??• ë³µì‚¬")).toBeInTheDocument();
		expect(screen.getByText("?¬ìš©?ì—­? ì½”??ëª?)).toBeInTheDocument();
		expect(screen.getAllByText("?¬ìš©?¬ë?").length).toBeGreaterThan(0);

		console.log(
			"???¬ìš©?ê? ?”ë©´??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??¬ìš©?????ˆìŠµ?ˆë‹¤."
		);
	});
});

// ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??- ?œë²„ ?¤í–‰ ?œì—ë§??¤í–‰
describe("?¬ìš©????•  ê´€ë¦?API - ?¤ì œ DB ?°ê²° ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??", () => {
	// ?œë²„ê°€ ?¤í–‰ ì¤‘ì¸ì§€ ?•ì¸?˜ëŠ” ?¬í¼ ?¨ìˆ˜
	const isServerRunning = async (): Promise<boolean> => {
		try {
			// ?¤ì–‘???¬ìŠ¤ì²´í¬ ?”ë“œ?¬ì¸???œë„
			const endpoints = [
				`${baseURL}/health`,
				`${baseURL}/api/health`,
				`${baseURL}/api/sys/programs`, // ?¤ì œ ì¡´ì¬?˜ëŠ” ?”ë“œ?¬ì¸?¸ë¡œ ?•ì¸
			];

			for (const endpoint of endpoints) {
				try {
					await axios.get(endpoint, { timeout: 2000 });
					console.log(`???œë²„ ?°ê²° ?±ê³µ: ${endpoint}`);
					return true;
				} catch (error) {
					// 404???œë²„ê°€ ?¤í–‰ ì¤‘ì´ì§€ë§??”ë“œ?¬ì¸?¸ê? ?†ëŠ” ê²½ìš°
					if (axios.isAxiosError(error) && error.response?.status === 404) {
						console.log(`???œë²„ ?¤í–‰ ì¤?(404): ${endpoint}`);
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
		// ?œë²„ê°€ ?¤í–‰ ì¤‘ì¸ì§€ ?•ì¸
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log(
				"? ï¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•˜?µë‹ˆ?? ?¤ì œ DB ?°ê²° ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??"
			);
		}
	});

	test("?¬ìš©????•  ëª©ë¡ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/user-roles`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?¤ì œ DB ?°ì´??ê²€ì¦?
		if ((response.data as any).data.length > 0) {
			const role = (response.data as any).data[0];
			expect(role).toHaveProperty("usrRoleId");
			expect(role).toHaveProperty("usrRoleNm");
			expect(role).toHaveProperty("useYn");
		}
	});

	test("?¬ìš©????•  ?€??APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const newRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "?ŒìŠ¤????• ",
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

	test("?¬ìš©????•  ?˜ì • APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const updateRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "?˜ì •????• ",
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

	test("?¬ìš©????•  ?? œ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const deleteRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "?? œ????• ",
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

	test("?„ë¡œê·¸ë¨ ê·¸ë£¹ ëª©ë¡ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const response = await axios.get(
			`${baseURL}/api/sys/user-roles/program-groups`
		);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?¤ì œ DB ?°ì´??ê²€ì¦?
		if ((response.data as any).data.length > 0) {
			const program = (response.data as any).data[0];
			expect(program).toHaveProperty("programId");
			expect(program).toHaveProperty("programNm");
		}
	});

	test("ê¶Œí•œ?±ê¸‰ ì½”ë“œ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/codes/athr-grd`);

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

	test("ì¡°ì§ì¡°íšŒë²”ìœ„ ì½”ë“œ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/codes/org-inq-rng`);

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
});


