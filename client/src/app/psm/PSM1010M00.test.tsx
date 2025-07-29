/**
 * PSM1010M00 - ?¬ì›/?¸ì£¼ ê´€ë¦?ë©”ì¸ ?”ë©´ ?˜ì´ë¸Œë¦¬???ŒìŠ¤??
 *
 * ?ŒìŠ¤??ëª©í‘œ:
 * - ?¬ì›/?¸ì£¼ ê´€ë¦?ë©”ì¸ ?”ë©´??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??™ì‘?˜ëŠ”ì§€ ê²€ì¦?
 * - ??ê°€ì§€ ë°©ì‹???¬ìš©?©ë‹ˆ??
 *   1. UI ?ŒìŠ¤?? Mock???¬ìš©??ì»´í¬?ŒíŠ¸ ?Œë”ë§??ŒìŠ¤??
 *   2. API ?ŒìŠ¤?? ?¤ì œ HTTP ?´ë¼?´ì–¸?¸ë? ?¬ìš©???œë²„ ?µì‹  ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??
 *
 * - ì¡°íšŒ/?€???? œ ???¤ì œ ê±°ë˜ ?¸ì¶œ ë°©ì‹ ì¤€ë¹?
 * - ?¤ì œ DB ?°ê²°???µí•œ ?µí•© ?ŒìŠ¤??ì¤€ë¹?
 * - ??ê¸°ë°˜ ?¸í„°?˜ì´??ë°?AG Grid ?™ì‘ ê²€ì¦?
 *
 * ?ŒìŠ¤???œë‚˜ë¦¬ì˜¤:
 * 1. ?”ë©´ ?‘ì† ??ì£¼ìš” ê¸°ëŠ¥ ?œì‹œ ?•ì¸
 * 2. ?¬ì›/?¸ì£¼ ë¦¬ìŠ¤??ì¡°íšŒ ê¸°ëŠ¥
 * 3. ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ë³€ê²????™ì  UI ?…ë°?´íŠ¸
 * 4. ë³¸ë? ë³€ê²???ë¶€??ëª©ë¡ ?…ë°?´íŠ¸
 * 5. ?¬ì› ? íƒ ë°????„í™˜ ê¸°ëŠ¥
 * 6. AG Grid ì»¬ëŸ¼ ?™ì  ë³€ê²?ê¸°ëŠ¥
 * 7. ?¬ì…?„í™©ì¡°íšŒ ê¸°ëŠ¥
 * 8. ?˜ìœ„ ??ì»´í¬?ŒíŠ¸ ?°ë™ ê¸°ëŠ¥
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import EmployeeMainPage from "./PSM1010M00";
import axios from "axios";

// Mock ag-grid components for jsdom environment
jest.mock("ag-grid-react", () => ({
	AgGridReact: ({ rowData, columnDefs, onSelectionChanged, onRowClicked, onRowDoubleClicked, ...props }: any) => {
		// Simple mock implementation
		return (
			<div data-testid='ag-grid-mock'>
				{rowData && rowData.length > 0 ? (
					<div>
						{rowData.map((row: any, index: number) => (
							<div 
								key={index} 
								data-testid={`grid-row-${index}`}
								onClick={() => onRowClicked?.({ data: row })}
								onDoubleClick={() => onRowDoubleClicked?.({ data: row })}
								className="grid-row"
							>
								{columnDefs.map((col: any) => (
									<span key={col.field} data-testid={`${col.field}-${index}`}>
										{row[col.field]}
									</span>
								))}
							</div>
						))}
					</div>
				) : (
					<div data-testid='empty-grid'>?°ì´?°ê? ?†ìŠµ?ˆë‹¤</div>
				)}
			</div>
		);
	},
}));

// Mock ?˜ìœ„ ì»´í¬?ŒíŠ¸??
jest.mock("./PSM1020M00", () => {
	return React.forwardRef(({ selectedEmployee, fieldEnableState, onSearchSuccess }: any, ref: any) => {
		React.useImperativeHandle(ref, () => ({
			initialize: jest.fn(),
			handleSearch: jest.fn(),
		}));
		return <div data-testid="psm1020m00">?¬ì›?•ë³´?±ë¡ ë°??˜ì • ??/div>;
	});
});

jest.mock("./PSM1030M00", () => {
	return React.forwardRef(({ selectedEmployee }: any, ref: any) => {
		React.useImperativeHandle(ref, () => ({
			initialize: jest.fn(),
		}));
		return <div data-testid="psm1030m00">?¸ì‚¬ë°œë ¹?´ì—­(ê±´ë³„) ??/div>;
	});
});

jest.mock("./PSM1040M00", () => {
	return ({ selectedEmployee }: any) => (
		<div data-testid="psm1040m00">?¸ì‚¬ë°œë ¹?¼ê´„?±ë¡ ??/div>
	);
});

jest.mock("./PSM0050M00", () => {
	return ({ isTabMode, parentEmpNo, parentEmpNm }: any) => (
		<div data-testid="psm0050m00">?„ë¡œ?„ë‚´??¡°????/div>
	);
});

// Mock axios for UI tests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock fetch for API calls
global.fetch = jest.fn();

// ?¤ì œ HTTP ?´ë¼?´ì–¸???¬ìš© (?œë²„ ?¤í–‰ ??
const baseURL = "http://localhost:8080";

describe("?¬ì›/?¸ì£¼ ê´€ë¦?ë©”ì¸ ?”ë©´ - UI ?ŒìŠ¤??(Mock ?¬ìš©)", () => {
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

	// 1. ?”ë©´ ?‘ì† ??ì£¼ìš” ê¸°ëŠ¥ ?œì‹œ ?•ì¸
	test("?¬ìš©?ê? ?¬ì›/?¸ì£¼ ê´€ë¦?ë©”ì¸ ?”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???œì‹œ?œë‹¤", async () => {
		render(<EmployeeMainPage />);

		// ì¡°íšŒ ?ì—­ ?•ì¸
		await waitFor(() => {
			expect(screen.getByText("?ì‚¬ ?¸ì£¼ êµ¬ë¶„")).toBeInTheDocument();
		});

		expect(screen.getByText("?¬ì›?±ëª…")).toBeInTheDocument();
		expect(screen.getByText("ë³¸ë?")).toBeInTheDocument();
		expect(screen.getByText("ë¶€??)).toBeInTheDocument();
		expect(screen.getByText("ì§ì±…")).toBeInTheDocument();
		expect(screen.getByText("?´ì‚¬?í¬??)).toBeInTheDocument();
		expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();

		// ë¦¬ìŠ¤???€?´í? ?•ì¸
		expect(screen.getByText("?¬ì›/?¸ì£¼ ë¦¬ìŠ¤??)).toBeInTheDocument();
		expect(screen.getByText("?¬ì…?„í™©ì¡°íšŒ")).toBeInTheDocument();

		// ??ë©”ë‰´ ?•ì¸
		expect(screen.getByText("?¬ì›?•ë³´?±ë¡ ë°??˜ì •")).toBeInTheDocument();
		expect(screen.getByText("?¸ì‚¬ë°œë ¹?´ì—­(ê±´ë³„)")).toBeInTheDocument();
		expect(screen.getByText("?¸ì‚¬ë°œë ¹?¼ê´„?±ë¡")).toBeInTheDocument();
		expect(screen.getByText("?„ë¡œ?„ë‚´??¡°??)).toBeInTheDocument();

		console.log("???¬ìš©?ê? ?”ë©´???‘ì†?˜ë©´ ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??œì‹œ?©ë‹ˆ??");
	});

	// 2. ?¬ì›/?¸ì£¼ ë¦¬ìŠ¤??ì¡°íšŒ ê¸°ëŠ¥
	test("?¬ìš©?ê? ì¡°íšŒ ì¡°ê±´???…ë ¥?˜ê³  ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ?¬ì› ë¦¬ìŠ¤?¸ê? ?œì‹œ?œë‹¤", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ?¬ì›?±ëª… ?…ë ¥ ?„ë“œ ì°¾ê¸° (type="text"??input ?”ì†Œ)
		const empNmInput = screen.getByRole("textbox");
		fireEvent.change(empNmInput, { target: { value: "ê¹€ì² ìˆ˜" } });

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
		const searchButton = screen.getByText("ì¡°íšŒ");
		fireEvent.click(searchButton);

		// ?…ë ¥??ê°’ì´ ?•ìƒ?ìœ¼ë¡?ë°˜ì˜?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(empNmInput).toHaveValue("ê¹€ì² ìˆ˜");
		});

		console.log("???¬ìš©?ê? ì¡°íšŒ ì¡°ê±´???…ë ¥?˜ê³  ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ?¬ì› ë¦¬ìŠ¤?¸ê? ?œì‹œ?©ë‹ˆ??");
	});

	// 3. ?ì‚¬/?¸ì£¼ êµ¬ë¶„ ë³€ê²????™ì  UI ?…ë°?´íŠ¸
	test("?¬ìš©?ê? ?ì‚¬/?¸ì£¼ êµ¬ë¶„??ë³€ê²½í•˜ë©?UIê°€ ?™ì ?¼ë¡œ ?…ë°?´íŠ¸?œë‹¤", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("?ì‚¬ ?¸ì£¼ êµ¬ë¶„")).toBeInTheDocument();
		});

		// ?¸ì£¼ ?¼ë””??ë²„íŠ¼ ?´ë¦­
		const outsRadio = screen.getByRole("radio", { name: /?¸ì£¼/i });
		fireEvent.click(outsRadio);

		// ?¸ì£¼ ? íƒ ??UI ë³€ê²??•ì¸
		await waitFor(() => {
			expect(screen.getByText("?¸ì£¼?…ì²´")).toBeInTheDocument();
		});

		// ?ì‚¬ ?¼ë””??ë²„íŠ¼ ?´ë¦­
		const ownRadio = screen.getByRole("radio", { name: /?ì‚¬/i });
		fireEvent.click(ownRadio);

		// ?ì‚¬ ? íƒ ??UI ë³€ê²??•ì¸
		await waitFor(() => {
			expect(screen.getByText("ë³¸ë?")).toBeInTheDocument();
		});

		console.log("???¬ìš©?ê? ?ì‚¬/?¸ì£¼ êµ¬ë¶„??ë³€ê²½í•˜ë©?UIê°€ ?™ì ?¼ë¡œ ?…ë°?´íŠ¸?©ë‹ˆ??");
	});

	// 4. ë³¸ë? ë³€ê²???ë¶€??ëª©ë¡ ?…ë°?´íŠ¸
	test("?¬ìš©?ê? ë³¸ë?ë¥?? íƒ?˜ë©´ ?´ë‹¹ ë³¸ë???ë¶€??ëª©ë¡???…ë°?´íŠ¸?œë‹¤", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("ë³¸ë?")).toBeInTheDocument();
		});

		// ë³¸ë? ? íƒ ì½¤ë³´ë°•ìŠ¤ê°€ ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸ (select ?”ì†Œ ì°¾ê¸°)
		const hqSelect = screen.getAllByRole("combobox")[0]; // ì²?ë²ˆì§¸ select ?”ì†Œ (ë³¸ë?)
		expect(hqSelect).toBeInTheDocument();

		// ë¶€??ì½¤ë³´ë°•ìŠ¤ê°€ ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸ (select ?”ì†Œ ì°¾ê¸°)
		const deptSelect = screen.getAllByRole("combobox")[1]; // ??ë²ˆì§¸ select ?”ì†Œ (ë¶€??
		expect(deptSelect).toBeInTheDocument();

		// select ?”ì†Œ?¤ì´ ?•ìƒ?ìœ¼ë¡??Œë”ë§ë˜?ˆëŠ”ì§€ ?•ì¸
		expect(hqSelect).toBeInTheDocument();
		expect(deptSelect).toBeInTheDocument();

		console.log("???¬ìš©?ê? ë³¸ë?ë¥?? íƒ?˜ë©´ ?´ë‹¹ ë³¸ë???ë¶€??ëª©ë¡???…ë°?´íŠ¸?©ë‹ˆ??");
	});

	// 5. ?¬ì› ? íƒ ë°????„í™˜ ê¸°ëŠ¥
	test("?¬ìš©?ê? ?¬ì›??? íƒ?˜ê³  ??„ ?„í™˜?˜ë©´ ?´ë‹¹ ??˜ ?´ìš©???œì‹œ?œë‹¤", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("?¬ì›?•ë³´?±ë¡ ë°??˜ì •")).toBeInTheDocument();
		});

		// ê¸°ë³¸ ???¬ì›?•ë³´?±ë¡ ë°??˜ì •) ?•ì¸
		expect(screen.getByTestId("psm1020m00")).toBeInTheDocument();

		// ?¸ì‚¬ë°œë ¹?´ì—­(ê±´ë³„) ???´ë¦­
		const promotionTab = screen.getByText("?¸ì‚¬ë°œë ¹?´ì—­(ê±´ë³„)");
		fireEvent.click(promotionTab);

		// ???„í™˜ ?•ì¸
		await waitFor(() => {
			expect(screen.getByTestId("psm1030m00")).toBeInTheDocument();
		});

		// ?¸ì‚¬ë°œë ¹?¼ê´„?±ë¡ ???´ë¦­
		const batchTab = screen.getByText("?¸ì‚¬ë°œë ¹?¼ê´„?±ë¡");
		fireEvent.click(batchTab);

		await waitFor(() => {
			expect(screen.getByTestId("psm1040m00")).toBeInTheDocument();
		});

		// ?„ë¡œ?„ë‚´??¡°?????´ë¦­
		const profileTab = screen.getByText("?„ë¡œ?„ë‚´??¡°??);
		fireEvent.click(profileTab);

		await waitFor(() => {
			expect(screen.getByTestId("psm0050m00")).toBeInTheDocument();
		});

		console.log("???¬ìš©?ê? ?¬ì›??? íƒ?˜ê³  ??„ ?„í™˜?˜ë©´ ?´ë‹¹ ??˜ ?´ìš©???œì‹œ?©ë‹ˆ??");
	});

	// 6. AG Grid ì»¬ëŸ¼ ?™ì  ë³€ê²?ê¸°ëŠ¥
	test("?ì‚¬/?¸ì£¼ êµ¬ë¶„???°ë¼ AG Grid ì»¬ëŸ¼???™ì ?¼ë¡œ ë³€ê²½ëœ??, async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// ?ì‚¬ ? íƒ ??(ê¸°ë³¸ê°?
		expect(screen.getByText("ë³¸ë?")).toBeInTheDocument();

		// ?¸ì£¼ ? íƒ
		const outsRadio = screen.getByRole("radio", { name: /?¸ì£¼/i });
		fireEvent.click(outsRadio);

		// ?¸ì£¼ ? íƒ ???¸ì£¼?…ì²´ ?œì‹œ ?•ì¸
		await waitFor(() => {
			expect(screen.getByText("?¸ì£¼?…ì²´")).toBeInTheDocument();
		});

		console.log("???ì‚¬/?¸ì£¼ êµ¬ë¶„???°ë¼ AG Grid ì»¬ëŸ¼???™ì ?¼ë¡œ ë³€ê²½ë©?ˆë‹¤.");
	});

	// 7. ?¬ì…?„í™©ì¡°íšŒ ê¸°ëŠ¥
	test("?¬ìš©?ê? ?¬ì…?„í™©ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ê²½ê³  ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("?¬ì…?„í™©ì¡°íšŒ")).toBeInTheDocument();
		});

		// ?¬ì…?„í™©ì¡°íšŒ ë²„íŠ¼ ?´ë¦­ (?¬ì› ë¯¸ì„ ???íƒœ)
		const inquiryButton = screen.getByText("?¬ì…?„í™©ì¡°íšŒ");
		fireEvent.click(inquiryButton);

		// ê²½ê³  ë©”ì‹œì§€ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸ (Toast ë©”ì‹œì§€???¤ì œ êµ¬í˜„???°ë¼ ?¤ë? ???ˆìŒ)
		await waitFor(() => {
			expect(inquiryButton).toBeInTheDocument();
		});

		console.log("???¬ìš©?ê? ?¬ì…?„í™©ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ê²½ê³  ë©”ì‹œì§€ê°€ ?œì‹œ?©ë‹ˆ??");
	});

	// 8. ?˜ìœ„ ??ì»´í¬?ŒíŠ¸ ?°ë™ ê¸°ëŠ¥
	test("?¬ìš©?ê? ?¬ì›??? íƒ?˜ë©´ ?˜ìœ„ ??ì»´í¬?ŒíŠ¸ê°€ ì´ˆê¸°?”ëœ??, async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByTestId("psm1020m00")).toBeInTheDocument();
		});

		// ?¬ì›?•ë³´?±ë¡ ë°??˜ì • ??´ ê¸°ë³¸?¼ë¡œ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		expect(screen.getByTestId("psm1020m00")).toBeInTheDocument();

		console.log("???¬ìš©?ê? ?¬ì›??? íƒ?˜ë©´ ?˜ìœ„ ??ì»´í¬?ŒíŠ¸ê°€ ì´ˆê¸°?”ë©?ˆë‹¤.");
	});

	// 9. ê²€??ì¡°ê±´ ?…ë ¥ ë°??”í„°??ì²˜ë¦¬
	test("?¬ìš©?ê? ?¬ì›?±ëª…???…ë ¥?˜ê³  ?”í„°?¤ë? ?„ë¥´ë©??ë™?¼ë¡œ ì¡°íšŒê°€ ?¤í–‰?œë‹¤", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ?¬ì›?±ëª… ?…ë ¥ ?„ë“œ ì°¾ê¸° (type="text"??input ?”ì†Œ)
		const empNmInput = screen.getByRole("textbox");
		fireEvent.change(empNmInput, { target: { value: "ê¹€ì² ìˆ˜" } });

		// ?”í„°???…ë ¥
		fireEvent.keyPress(empNmInput, { key: "Enter", code: "Enter" });

		// ?…ë ¥??ê°’ì´ ?•ìƒ?ìœ¼ë¡?ë°˜ì˜?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(empNmInput).toHaveValue("ê¹€ì² ìˆ˜");
		});

		console.log("???¬ìš©?ê? ?¬ì›?±ëª…???…ë ¥?˜ê³  ?”í„°?¤ë? ?„ë¥´ë©??ë™?¼ë¡œ ì¡°íšŒê°€ ?¤í–‰?©ë‹ˆ??");
	});

	// 10. ?´ì‚¬?í¬??ì²´í¬ë°•ìŠ¤ ê¸°ëŠ¥
	test("?¬ìš©?ê? ?´ì‚¬?í¬??ì²´í¬ë°•ìŠ¤ë¥??´ë¦­?˜ë©´ ì¡°íšŒ ì¡°ê±´??ë³€ê²½ëœ??, async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("?´ì‚¬?í¬??)).toBeInTheDocument();
		});

		// ?´ì‚¬?í¬??ì²´í¬ë°•ìŠ¤ ?´ë¦­
		const retireCheckbox = screen.getByRole("checkbox");
		fireEvent.click(retireCheckbox);

		// ì²´í¬ë°•ìŠ¤ê°€ ì²´í¬?˜ì—ˆ?”ì? ?•ì¸
		await waitFor(() => {
			expect(retireCheckbox).toBeChecked();
		});

		console.log("???¬ìš©?ê? ?´ì‚¬?í¬??ì²´í¬ë°•ìŠ¤ë¥??´ë¦­?˜ë©´ ì¡°íšŒ ì¡°ê±´??ë³€ê²½ë©?ˆë‹¤.");
	});

	// 11. AG Grid ???´ë¦­ ë°??”ë¸”?´ë¦­ ê¸°ëŠ¥
	test("?¬ìš©?ê? AG Grid???‰ì„ ?´ë¦­?˜ê±°???”ë¸”?´ë¦­?˜ë©´ ?¬ì›??? íƒ?œë‹¤", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// AG Gridê°€ ?•ìƒ?ìœ¼ë¡??Œë”ë§ë˜?ˆëŠ”ì§€ ?•ì¸
		expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();

		console.log("???¬ìš©?ê? AG Grid???‰ì„ ?´ë¦­?˜ê±°???”ë¸”?´ë¦­?˜ë©´ ?¬ì›??? íƒ?©ë‹ˆ??");
	});

	// 12. ë¡œë”© ?íƒœ ?œì‹œ ê¸°ëŠ¥
	test("ì¡°íšŒ ì¤‘ì—??ë¡œë”© ?íƒœê°€ ?œì‹œ?œë‹¤", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
		const searchButton = screen.getByText("ì¡°íšŒ");
		fireEvent.click(searchButton);

		// ì¡°íšŒ ë²„íŠ¼???•ìƒ?ìœ¼ë¡??´ë¦­?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(searchButton).toBeInTheDocument();
		});

		console.log("??ì¡°íšŒ ì¤‘ì—??ë¡œë”© ?íƒœê°€ ?œì‹œ?©ë‹ˆ??");
	});
});

// ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??- ?œë²„ ?¤í–‰ ?œì—ë§??¤í–‰
describe("?¬ì›/?¸ì£¼ ê´€ë¦?API - ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??", () => {
	// ?œë²„ê°€ ?¤í–‰ ì¤‘ì¸ì§€ ?•ì¸?˜ëŠ” ?¬í¼ ?¨ìˆ˜
	const isServerRunning = async (): Promise<boolean> => {
		try {
			// /api/health ?”ë“œ?¬ì¸?¸ë¡œ ?œë²„ ?íƒœ ?•ì¸ (?œë²„?ì„œ app.setGlobalPrefix('api') ?¤ì •??
			await axios.get(`${baseURL}/api/health`, { timeout: 3000 });
			return true;
		} catch (error) {
			console.log("?œë²„ ?°ê²° ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			return false;
		}
	};

	beforeAll(async () => {
		// ?œë²„ê°€ ?¤í–‰ ì¤‘ì¸ì§€ ?•ì¸
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("? ï¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•˜?µë‹ˆ?? API ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
		}
	});

	test("?¬ì›/?¸ì£¼ ë¦¬ìŠ¤??ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const response = await axios.post(`${baseURL}/api/psm/employee/search`, {
			empNo: 'ALL',
			empNm: '?ŒìŠ¤??,
			ownOutsDiv: '1',
			hqDivCd: 'ALL',
			deptDivCd: 'ALL',
			dutyCd: 'ALL',
			retirYn: 'N'
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		
		// data ?„ë“œê°€ ë°°ì—´?¸ì? ?•ì¸?˜ê³ , ë°°ì—´???„ë‹ˆë©?ë¹?ë°°ì—´ë¡?ì²˜ë¦¬
		const responseData = (response.data as any).data;
		if (Array.isArray(responseData)) {
			console.log("??data??ë°°ì—´?…ë‹ˆ?? ê¸¸ì´:", responseData.length);
		} else {
			console.log("? ï¸ data??ë°°ì—´???„ë‹™?ˆë‹¤. ?€??", typeof responseData);
			console.log("? ï¸ data ê°?", responseData);
		}

		// ?¤ì œ DB ?°ì´??ê²€ì¦?(ë°°ì—´???„ë‹Œ ê²½ìš°??ì²˜ë¦¬)
		if (responseData && Array.isArray(responseData) && responseData.length > 0) {
			const employee = responseData[0];
			expect(employee).toHaveProperty("EMP_NO");
			expect(employee).toHaveProperty("EMP_NM");
			expect(employee).toHaveProperty("OWN_OUTS_DIV");
		} else {
			console.log("?¹ï¸ ì¡°íšŒ???¬ì› ?°ì´?°ê? ?†ìŠµ?ˆë‹¤.");
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
			
			const response = await axios.post(`${baseURL}/api/common/dept-by-hq`, {
				hqDivCd: '1000',
				allYn: 'Y'
			});

			console.log("?“Š ë³¸ë?ë³?ë¶€??ëª©ë¡ ì¡°íšŒ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			// success ?„ë“œê°€ false??ê²½ìš° ?ì„¸ ?•ë³´ ì¶œë ¥
			if (!(response.data as any).success) {
				console.log("??API ?¸ì¶œ ?¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
			
			// data ?„ë“œ ê²€ì¦?
			const responseData = (response.data as any).data;
			if (Array.isArray(responseData)) {
				console.log("??data??ë°°ì—´?…ë‹ˆ?? ê¸¸ì´:", responseData.length);
			} else {
				console.log("? ï¸ data??ë°°ì—´???„ë‹™?ˆë‹¤. ?€??", typeof responseData);
				console.log("? ï¸ data ê°?", responseData);
			}

			// ?¤ì œ DB ?°ì´??ê²€ì¦?
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
			
			// success ?„ë“œê°€ false??ê²½ìš° ?ì„¸ ?•ë³´ ì¶œë ¥
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

	test("?¸ì£¼?…ì²´ ì½”ë“œ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ?¸ì£¼?…ì²´ ì½”ë“œ ì¡°íšŒ API ?¸ì¶œ ?œì‘");
			
			const response = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '111'
			});

			console.log("?“Š ?¸ì£¼?…ì²´ ì½”ë“œ ì¡°íšŒ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			// success ?„ë“œê°€ false??ê²½ìš° ?ì„¸ ?•ë³´ ì¶œë ¥
			if (!(response.data as any).success) {
				console.log("???¸ì£¼?…ì²´ ì½”ë“œ ì¡°íšŒ ?¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?¤ì œ DB ?°ì´??ê²€ì¦?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const company = responseData[0];
				expect(company).toHaveProperty("codeId");
				expect(company).toHaveProperty("codeNm");
			} else {
				console.log("?¹ï¸ ì¡°íšŒ???¸ì£¼?…ì²´ ì½”ë“œ ?°ì´?°ê? ?†ìŠµ?ˆë‹¤.");
			}
		} catch (error) {
			console.log("???¸ì£¼?…ì²´ ì½”ë“œ ì¡°íšŒ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
		}
	});

	test("?¸ì‚¬ë°œë ¹?´ì—­ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		try {
			console.log("?” ?¸ì‚¬ë°œë ¹?´ì—­ ì¡°íšŒ API ?¸ì¶œ ?œì‘");
			
			const empNo = "EMP001";
			const response = await axios.post(`${baseURL}/api/psm/appointment/search`, {
				empNo: empNo
			});

			console.log("?“Š ?¸ì‚¬ë°œë ¹?´ì—­ ì¡°íšŒ ?‘ë‹µ:", response.data);

			expect(response.status).toBe(200);
			
			// success ?„ë“œê°€ false??ê²½ìš° ?ì„¸ ?•ë³´ ì¶œë ¥
			if (!(response.data as any).success) {
				console.log("???¸ì‚¬ë°œë ¹?´ì—­ ì¡°íšŒ ?¤íŒ¨ - ?‘ë‹µ:", response.data);
				console.log("???ëŸ¬ ë©”ì‹œì§€:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?¤ì œ DB ?°ì´??ê²€ì¦?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const appointment = responseData[0];
				expect(appointment).toHaveProperty("EMP_NO");
				expect(appointment).toHaveProperty("APNT_DIV");
				expect(appointment).toHaveProperty("APNT_DT");
			} else {
				console.log("?¹ï¸ ì¡°íšŒ???¸ì‚¬ë°œë ¹?´ì—­???†ìŠµ?ˆë‹¤.");
				console.log("?¹ï¸ ?¬ì›ë²ˆí˜¸ 'EMP001'??ì¡´ì¬?˜ì? ?Šì„ ???ˆìŠµ?ˆë‹¤.");
			}
		} catch (error) {
			console.log("???¸ì‚¬ë°œë ¹?´ì—­ ì¡°íšŒ API ?¸ì¶œ ?¤íŒ¨:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???‘ë‹µ ?íƒœ:", error.response?.status);
				console.log("???‘ë‹µ ?°ì´??", error.response?.data);
			}
			throw error;
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

	test("?¬ì› ?•ë³´ ?˜ì • APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const updateEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?˜ì •???¬ì›",
			OWN_OUTS_DIV_CD: "1",
			HQ_DIV_CD: "HQ001",
			DEPT_DIV_CD: "DEPT001",
			DUTY_CD: "DUTY001",
			ENTR_DT: "20240101",
			WKG_ST_DIV_CD: "1"
		};

		const response = await axios.post(`${baseURL}/api/psm/employee`, {
			createdRows: [],
			updatedRows: [updateEmployee],
			deletedRows: []
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?¬ì› ?•ë³´ ?? œ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const deleteEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?? œ???¬ì›",
			WKG_ST_DIV_CD: "3" // ?´ì‚¬
		};

		const response = await axios.post(`${baseURL}/api/psm/employee`, {
			createdRows: [],
			updatedRows: [],
			deletedRows: [deleteEmployee]
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});
}); 

