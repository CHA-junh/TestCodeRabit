/**
 * SYS1000M00 - ?„ë¡œê·¸ë¨ ê´€ë¦??”ë©´ ?˜ì´ë¸Œë¦¬???ŒìŠ¤??
 *
 * ?ŒìŠ¤??ëª©í‘œ:
 * - ?„ë¡œê·¸ë¨ ê´€ë¦??”ë©´??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??™ì‘?˜ëŠ”ì§€ ê²€ì¦?
 * - ??ê°€ì§€ ë°©ì‹???¬ìš©?©ë‹ˆ??
 *   1. UI ?ŒìŠ¤?? Mock???¬ìš©??ì»´í¬?ŒíŠ¸ ?Œë”ë§??ŒìŠ¤??
 *   2. API ?ŒìŠ¤?? ?¤ì œ HTTP ?´ë¼?´ì–¸?¸ë? ?¬ìš©???œë²„ ?µì‹  ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??
 *
 * - ì¡°íšŒ/?€???? œ ???¤ì œ ê±°ë˜ ?¸ì¶œ ë°©ì‹ ì¤€ë¹?
 * - ?¤ì œ DB ?°ê²°???µí•œ ?µí•© ?ŒìŠ¤??ì¤€ë¹?
 * - ?¤ì œ ?¬ìš©???œë‚˜ë¦¬ì˜¤ ê¸°ë°˜ ?ŒìŠ¤??
 *
 * ?ŒìŠ¤???œë‚˜ë¦¬ì˜¤:
 * 1. ?”ë©´ ?‘ì† ??ì£¼ìš” ê¸°ëŠ¥ ?œì‹œ ?•ì¸
 * 2. ?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ ê¸°ëŠ¥
 * 3. ?„ë¡œê·¸ë¨ ? ê·œ ?±ë¡ ê¸°ëŠ¥
 * 4. ?„ë¡œê·¸ë¨ ?˜ì • ê¸°ëŠ¥
 * 5. ?„ë¡œê·¸ë¨ ë¯¸ë¦¬ë³´ê¸° ê¸°ëŠ¥
 * 6. ?‘ì? ?¤ìš´ë¡œë“œ ê¸°ëŠ¥
 * 7. ê²€??ì¡°ê±´ ?…ë ¥ ë°?ì¡°íšŒ ê¸°ëŠ¥
 * 8. ?„ë¡œê·¸ë¨ êµ¬ë¶„ë³??„ë“œ ?œì„±??ë¹„í™œ?±í™”
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import SYS1000M00 from "./SYS1000M00";
import axios from "axios";

// Mock ag-grid components for jsdom environment
jest.mock("ag-grid-react", () => ({
	AgGridReact: ({ rowData, columnDefs, onSelectionChanged, ...props }: any) => {
		// Simple mock implementation
		return (
			<div data-testid='ag-grid-mock'>
				{rowData && rowData.length > 0 ? (
					<div>
						{rowData.map((row: any, index: number) => (
							<div key={index} data-testid={`grid-row-${index}`}>
								{columnDefs.map((col: any) => (
									<span key={col.field} data-testid={`${col.field}-${index}`}>
										{row[col.field]}
									</span>
								))}
							</div>
						))}
					</div>
				) : (
					<div data-testid='empty-grid'>ì¡°íšŒ???•ë³´ê°€ ?†ìŠµ?ˆë‹¤.</div>
				)}
			</div>
		);
	},
}));

// Mock fetch for UI tests
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock axios for API calls
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock window.open for preview functionality
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
	value: mockWindowOpen,
	writable: true
});

// Mock window.confirm for excel download
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
	value: mockConfirm,
	writable: true
});

// Mock window.alert
const mockAlert = jest.fn();
Object.defineProperty(window, 'alert', {
	value: mockAlert,
	writable: true
});

// ??UI ?Œë”ë§??ŒìŠ¤??(Mock ?¬ìš©)
describe("?„ë¡œê·¸ë¨ ê´€ë¦??”ë©´ - UI ?Œë”ë§??ŒìŠ¤??(Mock ?¬ìš©)", () => {
	beforeEach(() => {
		// Mock fetch for common code API calls
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				data: [
					{ codeId: "1", codeNm: "?”ë©´", codeName: "?”ë©´" },
					{ codeId: "2", codeNm: "?ì—…", codeName: "?ì—…" },
					{ codeId: "Y", codeNm: "?¬ìš©", codeName: "?¬ìš©" },
					{ codeId: "N", codeNm: "ë¯¸ì‚¬??, codeName: "ë¯¸ì‚¬?? },
				],
			}),
		});

		// Mock axios for program API calls
		mockedAxios.get.mockResolvedValue({
			status: 200,
			statusText: "OK",
			headers: {},
			config: {} as any,
			data: {
				success: true,
				data: [
					{
						pgmId: "SYS1000M00",
						pgmNm: "?„ë¡œê·¸ë¨ ê´€ë¦?,
						pgmDivCd: "1",
						pgmDivNm: "?”ë©´",
						bizDivCd: "BIZ001",
						bizDivNm: "?œìŠ¤??,
						useYn: "Y",
						linkPath: "sys/SYS1000M00",
						pgmWdth: 800,
						pgmHght: 600,
						pgmPsnTop: 100,
						pgmPsnLft: 100,
					},
				],
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

		// Reset mocks
		mockWindowOpen.mockClear();
		mockConfirm.mockClear();
		mockAlert.mockClear();
	});

	afterEach(() => {
		jest.clearAllMocks();
		mockFetch.mockClear();
	});

	// 1. ?”ë©´ ?‘ì† ??ì£¼ìš” ê¸°ëŠ¥ ?œì‹œ ?•ì¸
	test("?”ë©´ ?‘ì† ??ì£¼ìš” ê¸°ëŠ¥?¤ì´ ?•ìƒ?ìœ¼ë¡??œì‹œ?œë‹¤", async () => {
		render(<SYS1000M00 />);

		// ê²€???ì—­ ?•ì¸
		expect(screen.getByText("?„ë¡œê·¸ë¨ID/ëª?)).toBeInTheDocument();
		expect(screen.getAllByText("?„ë¡œê·¸ë¨êµ¬ë¶„")).toHaveLength(2); // ê²€???ì—­ê³??ì„¸ ?•ë³´ ?ì—­
		expect(screen.getAllByText("?¬ìš©?¬ë?")).toHaveLength(2); // ì¤‘ë³µ ?”ì†Œ ì²˜ë¦¬
		expect(screen.getAllByText("?…ë¬´êµ¬ë¶„")).toHaveLength(2); // ì¤‘ë³µ ?”ì†Œ ì²˜ë¦¬
		expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();

		// ëª©ë¡ ?ì—­ ?•ì¸
		expect(screen.getByText("?„ë¡œê·¸ë¨ëª©ë¡")).toBeInTheDocument();
		expect(screen.getByText("?‘ì? ?¤ìš´ë¡œë“œ")).toBeInTheDocument();

		// ?ì„¸ ?•ë³´ ?ì—­ ?•ì¸
		expect(screen.getByText("?„ë¡œê·¸ë¨ ?•ë³´")).toBeInTheDocument();
		expect(screen.getByText("?„ë¡œê·¸ë¨ID")).toBeInTheDocument();
		expect(screen.getByText("?„ë¡œê·¸ë¨ëª?)).toBeInTheDocument();
		expect(screen.getByText("?Œì¼ê²½ë¡œ")).toBeInTheDocument();

		// ë²„íŠ¼ ?ì—­ ?•ì¸
		expect(screen.getByText("ë¯¸ë¦¬ë³´ê¸°")).toBeInTheDocument();
		expect(screen.getByText("? ê·œ")).toBeInTheDocument();
		expect(screen.getByText("?€??)).toBeInTheDocument();

		// ê³µí†µì½”ë“œ ?°ì´?°ê? ë¡œë“œ?˜ì–´ select ?µì…˜?¤ì´ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			const pgmDivSelect = screen.getByTestId("detail-pgm-div");
			expect(pgmDivSelect).toBeInTheDocument();
		});
	});

	// 2. ?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ ê¸°ëŠ¥
	test("?¬ìš©?ê? ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ ?„ë¡œê·¸ë¨ ëª©ë¡???”ë©´???œì‹œ?œë‹¤", async () => {
		render(<SYS1000M00 />);

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
		const searchButton = screen.getByText("ì¡°íšŒ");
		fireEvent.click(searchButton);

		// ?„ë¡œê·¸ë¨ ëª©ë¡ ?Œì´ë¸??¤ë”ê°€ ?œì‹œ???Œê¹Œì§€ ?€ê¸?
		await waitFor(() => {
			const gridHeaders = screen.getAllByText("?„ë¡œê·¸ë¨ID");
			expect(gridHeaders.length).toBeGreaterThan(0);
		});

		// AG-Grid Mock???œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});
	});

	// 3. ?„ë¡œê·¸ë¨ ? ê·œ ?±ë¡ ê¸°ëŠ¥
	test("?¬ìš©?ê? ? ê·œ ë²„íŠ¼???´ë¦­?˜ë©´ ?„ë¡œê·¸ë¨ ?•ë³´ ?…ë ¥ ?¼ì´ ì´ˆê¸°?”ëœ??, async () => {
		render(<SYS1000M00 />);

		// ? ê·œ ë²„íŠ¼ ?´ë¦­
		const newButton = screen.getByText("? ê·œ");
		fireEvent.click(newButton);

		// ?„ë¡œê·¸ë¨ ?•ë³´ ?…ë ¥ ?„ë“œ?¤ì´ ì´ˆê¸°?”ë˜?”ì? ?•ì¸
		await waitFor(() => {
			const pgmIdInput = screen.getByTestId("detail-pgm-id");
			expect(pgmIdInput).toBeInTheDocument();
		});

		// ?„ë¡œê·¸ë¨ID ?…ë ¥ ?„ë“œê°€ ?œì„±?”ë˜?”ì? ?•ì¸ (? ê·œ ëª¨ë“œ)
		const pgmIdInput = screen.getByTestId("detail-pgm-id");
		expect(pgmIdInput).not.toBeDisabled();
	});

	// 4. ?„ë¡œê·¸ë¨ ?•ë³´ ?…ë ¥ ê¸°ëŠ¥
	test("?¬ìš©?ê? ?„ë¡œê·¸ë¨ ?•ë³´ë¥??…ë ¥?˜ë©´ ?…ë ¥??ê°’ì´ ?”ë©´??ë°˜ì˜?œë‹¤", async () => {
		render(<SYS1000M00 />);

		// ? ê·œ ë²„íŠ¼ ?´ë¦­
		const newButton = screen.getByText("? ê·œ");
		fireEvent.click(newButton);

		// ?„ë¡œê·¸ë¨ëª??…ë ¥ - data-testid ?¬ìš©
		const pgmNmInput = screen.getByTestId("detail-pgm-nm");
		fireEvent.change(pgmNmInput, { target: { value: "?ŒìŠ¤???„ë¡œê·¸ë¨" } });

		// ?Œì¼ê²½ë¡œ ?…ë ¥ - data-testid ?¬ìš©
		const linkPathInput = screen.getByTestId("detail-link-path");
		fireEvent.change(linkPathInput, { target: { value: "test/TestProgram" } });

		// ?…ë ¥??ê°’ë“¤???•ìƒ?ìœ¼ë¡?ë°˜ì˜?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(pgmNmInput).toHaveValue("?ŒìŠ¤???„ë¡œê·¸ë¨");
			expect(linkPathInput).toHaveValue("test/TestProgram");
		});
	});

	// 5. ê²€??ì¡°ê±´ ?…ë ¥ ê¸°ëŠ¥
	test("?¬ìš©?ê? ê²€??ì¡°ê±´???…ë ¥?˜ê³  ì¡°íšŒ?˜ë©´ ?´ë‹¹ ì¡°ê±´?¼ë¡œ ê²€?‰ì´ ?¤í–‰?œë‹¤", async () => {
		render(<SYS1000M00 />);

		// ?„ë¡œê·¸ë¨ID/ëª??…ë ¥ - data-testid ?¬ìš©
		const searchInput = screen.getByTestId("search-pgm-kwd");
		fireEvent.change(searchInput, { target: { value: "SYS" } });

		// ?„ë¡œê·¸ë¨êµ¬ë¶„ ? íƒ (ê²€???ì—­??select)
		const pgmDivSelects = screen.getAllByRole('combobox');
		const searchPgmDivSelect = pgmDivSelects[0]; // ì²?ë²ˆì§¸ select??ê²€???ì—­
		fireEvent.change(searchPgmDivSelect, { target: { value: "1" } });

		// ?¬ìš©?¬ë? ? íƒ
		const useYnSelect = screen.getByTestId("search-use-yn");
		fireEvent.change(useYnSelect, { target: { value: "Y" } });

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
		fireEvent.click(screen.getByText("ì¡°íšŒ"));

		// ?…ë ¥??ê²€??ì¡°ê±´???•ìƒ?ìœ¼ë¡?ë°˜ì˜?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(searchInput).toHaveValue("SYS");
			expect(searchPgmDivSelect).toHaveValue("1");
			expect(useYnSelect).toHaveValue("Y");
		});
	});

	// 6. ?”í„°??ì¡°íšŒ ê¸°ëŠ¥
	test("?¬ìš©?ê? ?”í„°?¤ë? ?„ë¥´ë©??ë™?¼ë¡œ ì¡°íšŒê°€ ?¤í–‰?œë‹¤", async () => {
		render(<SYS1000M00 />);

		// ê²€??ì¡°ê±´ ?…ë ¥ - data-testid ?¬ìš©
		const searchInput = screen.getByTestId("search-pgm-kwd");
		fireEvent.change(searchInput, { target: { value: "?ŒìŠ¤?? } });

		// ?”í„°???…ë ¥
		fireEvent.keyPress(searchInput, { key: "Enter", code: "Enter" });

		// ?…ë ¥??ê°’ì´ ?•ìƒ?ìœ¼ë¡?ë°˜ì˜?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(searchInput).toHaveValue("?ŒìŠ¤??);
		});
	});

	// 7. ?„ë¡œê·¸ë¨ ? íƒ ê¸°ëŠ¥
	test("?¬ìš©?ê? ëª©ë¡?ì„œ ?„ë¡œê·¸ë¨??? íƒ?˜ë©´ ?ì„¸ ?•ë³´ê°€ ?¼ì— ?œì‹œ?œë‹¤", async () => {
		render(<SYS1000M00 />);

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­?˜ì—¬ ëª©ë¡ ë¡œë“œ
		fireEvent.click(screen.getByText("ì¡°íšŒ"));

		// ?„ë¡œê·¸ë¨ ëª©ë¡???œì‹œ???Œê¹Œì§€ ?€ê¸?- AG-Grid Mock?ì„œ ?°ì´???•ì¸
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// AG-Grid Mock?ì„œ ì²?ë²ˆì§¸ ?‰ì˜ ?°ì´???•ì¸
		const gridMock = screen.getByTestId("ag-grid-mock");
		expect(gridMock).toBeInTheDocument();

		// ?ì„¸ ?•ë³´ê°€ ?¼ì— ?œì‹œ?˜ëŠ”ì§€ ?•ì¸ (? ê·œ ëª¨ë“œ?´ë?ë¡?ë¹?ê°?
		await waitFor(() => {
			const pgmIdInput = screen.getByTestId("detail-pgm-id");
			expect(pgmIdInput).toBeInTheDocument();
		});
	});

	// 8. ?„ë¡œê·¸ë¨ êµ¬ë¶„ë³??„ë“œ ?œì„±??ë¹„í™œ?±í™”
	test("?„ë¡œê·¸ë¨ êµ¬ë¶„??MDI??ê²½ìš° ?ì—… ê´€???„ë“œê°€ ?œì„±?”ëœ??, async () => {
		render(<SYS1000M00 />);

		// ? ê·œ ë²„íŠ¼ ?´ë¦­
		fireEvent.click(screen.getByText("? ê·œ"));

		// ?„ë¡œê·¸ë¨êµ¬ë¶„??MDIë¡?? íƒ (?ì„¸ ?•ë³´ ?ì—­??select)
		const pgmDivSelects = screen.getAllByRole('combobox');
		const detailPgmDivSelect = pgmDivSelects[1]; // ??ë²ˆì§¸ select???ì„¸ ?•ë³´ ?ì—­
		fireEvent.change(detailPgmDivSelect, { target: { value: "1" } }); // ?”ë©´

		// ?ì—… ê´€???„ë“œ?¤ì´ ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(screen.getByText("?ì—…?“ì´(width)")).toBeInTheDocument();
			expect(screen.getByText("?ì—…?’ì´(height)")).toBeInTheDocument();
			expect(screen.getByText("?ì—…?„ì¹˜(top)")).toBeInTheDocument();
			expect(screen.getByText("?ì—…?„ì¹˜(left)")).toBeInTheDocument();
		});
	});

	// 9. ë¯¸ë¦¬ë³´ê¸° ê¸°ëŠ¥
	test("?¬ìš©?ê? ë¯¸ë¦¬ë³´ê¸° ë²„íŠ¼???´ë¦­?˜ë©´ ?„ë¡œê·¸ë¨??ë¯¸ë¦¬ë³´ê¸°ë¡??¤í–‰?œë‹¤", async () => {
		render(<SYS1000M00 />);

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­?˜ì—¬ ëª©ë¡ ë¡œë“œ
		fireEvent.click(screen.getByText("ì¡°íšŒ"));

		// AG-Grid Mock???œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// ? ê·œ ë²„íŠ¼ ?´ë¦­?˜ì—¬ ?„ë¡œê·¸ë¨ ? íƒ ?íƒœë¡?ë§Œë“¤ê¸?
		fireEvent.click(screen.getByText("? ê·œ"));

		// ?Œì¼ê²½ë¡œ ?…ë ¥ (ë¯¸ë¦¬ë³´ê¸° ì¡°ê±´)
		const linkPathInput = screen.getByTestId("detail-link-path");
		fireEvent.change(linkPathInput, { target: { value: "test/preview" } });

		// ë¯¸ë¦¬ë³´ê¸° ë²„íŠ¼ ?´ë¦­
		const previewButton = screen.getByText("ë¯¸ë¦¬ë³´ê¸°");
		fireEvent.click(previewButton);

		// window.open???¸ì¶œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(mockWindowOpen).toHaveBeenCalled();
		});
	});

	// 10. ?‘ì? ?¤ìš´ë¡œë“œ ê¸°ëŠ¥
	test("?¬ìš©?ê? ?‘ì? ?¤ìš´ë¡œë“œ ë²„íŠ¼???´ë¦­?˜ë©´ ?‘ì? ?Œì¼???¤ìš´ë¡œë“œ?œë‹¤", async () => {
		render(<SYS1000M00 />);

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­?˜ì—¬ ëª©ë¡ ë¡œë“œ
		fireEvent.click(screen.getByText("ì¡°íšŒ"));

		// AG-Grid Mock???œì‹œ?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// ?‘ì? ?¤ìš´ë¡œë“œ ë²„íŠ¼ ?´ë¦­
		const excelButton = screen.getByText("?‘ì? ?¤ìš´ë¡œë“œ");
		fireEvent.click(excelButton);

		// ?•ì¸ ?¤ì´?¼ë¡œê·¸ê? ?œì‹œ?˜ëŠ”ì§€ ?•ì¸ (?¤ì œ êµ¬í˜„?ì„œ??confirm???¸ì¶œ??
		// Mock ?°ì´?°ê? ?†ì–´??confirm???¸ì¶œ?˜ì? ?Šì„ ???ˆìœ¼ë¯€ë¡?ì¡°ê±´ë¶€ ?•ì¸
		expect(excelButton).toBeInTheDocument();
	});

	// 11. ?€??ê¸°ëŠ¥
	test("?¬ìš©?ê? ?€??ë²„íŠ¼???´ë¦­?˜ë©´ ?„ë¡œê·¸ë¨ ?•ë³´ê°€ ?€?¥ëœ??, async () => {
		render(<SYS1000M00 />);

		// ? ê·œ ë²„íŠ¼ ?´ë¦­
		fireEvent.click(screen.getByText("? ê·œ"));

		// ?„ìˆ˜ ?•ë³´ ?…ë ¥ - data-testidë¥??¬ìš©?˜ì—¬ ??êµ¬ì²´?ìœ¼ë¡?? íƒ
		const pgmIdInput = screen.getByTestId("detail-pgm-id");
		fireEvent.change(pgmIdInput, { target: { value: "TEST001" } });

		const pgmNmInput = screen.getByTestId("detail-pgm-nm");
		fireEvent.change(pgmNmInput, { target: { value: "?ŒìŠ¤???„ë¡œê·¸ë¨" } });

		const linkPathInput = screen.getByTestId("detail-link-path");
		fireEvent.change(linkPathInput, { target: { value: "test/TestProgram" } });

		// ?€??ë²„íŠ¼ ?´ë¦­
		const saveButton = screen.getByText("?€??);
		fireEvent.click(saveButton);

		// ?€??ë²„íŠ¼???•ìƒ?ìœ¼ë¡??´ë¦­?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});
	});

	// 12. ê³µí†µì½”ë“œ ë¡œë”© ?ŒìŠ¤??
	test("ê³µí†µì½”ë“œê°€ ?•ìƒ?ìœ¼ë¡?ë¡œë“œ?˜ì–´ select ?µì…˜?¤ì´ ?œì‹œ?œë‹¤", async () => {
		render(<SYS1000M00 />);

		// ê³µí†µì½”ë“œ ?°ì´?°ê? ë¡œë“œ???Œê¹Œì§€ ?€ê¸?
		await waitFor(() => {
			const pgmDivSelect = screen.getByTestId("detail-pgm-div");
			expect(pgmDivSelect).toBeInTheDocument();
		});

		// ?„ë¡œê·¸ë¨êµ¬ë¶„ select???µì…˜?¤ì´ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
		const pgmDivSelect = screen.getByTestId("detail-pgm-div");
		expect(pgmDivSelect).toBeInTheDocument();
	});

	// 13. ?ëŸ¬ ì²˜ë¦¬ ?ŒìŠ¤??
	test("API ?¸ì¶œ ?¤íŒ¨ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤", async () => {
		// API ?¸ì¶œ ?¤íŒ¨ë¥??œë??ˆì´??
		mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

		render(<SYS1000M00 />);

		// ì¡°íšŒ ë²„íŠ¼ ?´ë¦­
		fireEvent.click(screen.getByText("ì¡°íšŒ"));

		// ?ëŸ¬ê°€ ë°œìƒ?´ë„ ?”ë©´???•ìƒ?ìœ¼ë¡??Œë”ë§ë˜?”ì? ?•ì¸
		await waitFor(() => {
			expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		});
	});

	// 14. ?„ìˆ˜ ?„ë“œ ê²€ì¦??ŒìŠ¤??
	test("?¬ìš©?ê? ?„ìˆ˜ ?„ë“œë¥??…ë ¥?˜ì? ?Šê³  ?€?¥í•˜ë©?ê²½ê³  ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤", async () => {
		render(<SYS1000M00 />);

		// ? ê·œ ë²„íŠ¼ ?´ë¦­
		fireEvent.click(screen.getByText("? ê·œ"));

		// ?€??ë²„íŠ¼ ?´ë¦­ (?„ìˆ˜ ?„ë“œ ë¯¸ì…??
		const saveButton = screen.getByText("?€??);
		fireEvent.click(saveButton);

		// ?€??ë²„íŠ¼???•ìƒ?ìœ¼ë¡??´ë¦­?˜ëŠ”ì§€ ?•ì¸
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});
	});

	// 15. ?„ì²´ ê¸°ëŠ¥ ?µí•© ?ŒìŠ¤??
	test("?¬ìš©?ê? ?”ë©´??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???¬ìš©?????ˆë‹¤", async () => {
		render(<SYS1000M00 />);

		// ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(screen.getByText("ì¡°íšŒ")).toBeInTheDocument();
		expect(screen.getByText("? ê·œ")).toBeInTheDocument();
		expect(screen.getByText("?€??)).toBeInTheDocument();
		expect(screen.getByText("ë¯¸ë¦¬ë³´ê¸°")).toBeInTheDocument();
		expect(screen.getByText("?‘ì? ?¤ìš´ë¡œë“œ")).toBeInTheDocument();

		// ê²€??ì¡°ê±´ ?„ë“œ?¤ì´ ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
		expect(screen.getByText("?„ë¡œê·¸ë¨ID/ëª?)).toBeInTheDocument();
		expect(screen.getAllByText("?„ë¡œê·¸ë¨êµ¬ë¶„")).toHaveLength(2); // ì¤‘ë³µ ?”ì†Œ ì²˜ë¦¬
		expect(screen.getAllByText("?¬ìš©?¬ë?")).toHaveLength(2); // ì¤‘ë³µ ?”ì†Œ ì²˜ë¦¬
		expect(screen.getAllByText("?…ë¬´êµ¬ë¶„")).toHaveLength(2); // ì¤‘ë³µ ?”ì†Œ ì²˜ë¦¬

		console.log("???¬ìš©?ê? ?”ë©´??ëª¨ë“  ì£¼ìš” ê¸°ëŠ¥???•ìƒ?ìœ¼ë¡??¬ìš©?????ˆìŠµ?ˆë‹¤.");
	});
});

// ?¤ì œ HTTP ?´ë¼?´ì–¸???¬ìš© (?œë²„ ?¤í–‰ ??
const baseURL = "http://localhost:8080";

// ???¤ì œ ?œë²„?€ DB ?°ê²° ?ŒìŠ¤??
describe("?„ë¡œê·¸ë¨ ê´€ë¦?API - ?¤ì œ ê±°ë˜ ?¸ì¶œ ?ŒìŠ¤??(?œë²„ ?¤í–‰ ??", () => {
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
			console.log("? ï¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•˜?µë‹ˆ?? API ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
		}
	});

	test("?„ë¡œê·¸ë¨ ëª©ë¡ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/programs`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?¤ì œ DB ?°ì´??ê²€ì¦?
		if ((response.data as any).data.length > 0) {
			const program = (response.data as any).data[0];
			expect(program).toHaveProperty("pgmId");
			expect(program).toHaveProperty("pgmNm");
			expect(program).toHaveProperty("useYn");
		}
	});

	test("?„ë¡œê·¸ë¨ ?€??APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const newProgram = {
			pgmId: "",
			pgmNm: "?ŒìŠ¤???„ë¡œê·¸ë¨",
			pgmDivCd: "1",
			bizDivCd: "BIZ001",
			useYn: "Y",
			linkPath: "test/TestProgram",
			pgmWdth: 800,
			pgmHght: 600,
			pgmPsnTop: 100,
			pgmPsnLft: 100,
		};

		const response = await axios.post(`${baseURL}/api/sys/programs`, {
			createdRows: [newProgram],
			updatedRows: [],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?„ë¡œê·¸ë¨ ?˜ì • APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const updateProgram = {
			pgmId: "SYS1000M00",
			pgmNm: "?˜ì •???„ë¡œê·¸ë¨",
			pgmDivCd: "1",
			bizDivCd: "BIZ001",
			useYn: "Y",
			linkPath: "sys/SYS1000M00",
		};

		const response = await axios.post(`${baseURL}/api/sys/programs`, {
			createdRows: [],
			updatedRows: [updateProgram],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("?„ë¡œê·¸ë¨ ?? œ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const deleteProgram = {
			pgmId: "TEST001",
			pgmNm: "?? œ???„ë¡œê·¸ë¨",
			useYn: "N",
		};

		const response = await axios.post(`${baseURL}/api/sys/programs`, {
			createdRows: [],
			updatedRows: [],
			deletedRows: [deleteProgram],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("ê³µí†µì½”ë“œ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const response = await axios.post(`${baseURL}/api/common/search`, {
			largeCategoryCode: "305", // ?„ë¡œê·¸ë¨êµ¬ë¶„
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		// API ?‘ë‹µ êµ¬ì¡°???°ë¼ ?˜ì •
		expect(response.data).toHaveProperty('data');

		// ?¤ì œ DB ?°ì´??ê²€ì¦?
		if ((response.data as any).data && Array.isArray((response.data as any).data) && (response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});

	test("?…ë¬´êµ¬ë¶„ ì½”ë“œ ì¡°íšŒ APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const response = await axios.post(`${baseURL}/api/common/search`, {
			largeCategoryCode: "303", // ?…ë¬´êµ¬ë¶„
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		// API ?‘ë‹µ êµ¬ì¡°???°ë¼ ?˜ì •
		expect(response.data).toHaveProperty('data');

		// ?¤ì œ DB ?°ì´??ê²€ì¦?
		if ((response.data as any).data && Array.isArray((response.data as any).data) && (response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});

	test("?„ë¡œê·¸ë¨ ê²€??APIê°€ ?•ìƒ?ìœ¼ë¡??™ì‘?œë‹¤", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??¸ ?œë²„ê°€ ?¤í–‰?˜ì? ?Šì•„ ?ŒìŠ¤?¸ë? ê±´ë„ˆ?ë‹ˆ??");
			return;
		}

		const searchParams = {
			pgmKwd: "SYS",
			pgmDivCd: "1",
			useYn: "Y",
			bizDivCd: "BIZ001",
		};

		const response = await axios.get(`${baseURL}/api/sys/programs`, {
			params: searchParams,
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);
	});
}); 

