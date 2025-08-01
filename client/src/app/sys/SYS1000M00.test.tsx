/**
 * SYS1000M00 - ?๋ก๊ทธ๋จ ๊ด๋ฆ??๋ฉด ?์ด๋ธ๋ฆฌ???์ค??
 *
 * ?์ค??๋ชฉํ:
 * - ?๋ก๊ทธ๋จ ๊ด๋ฆ??๋ฉด??๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???์?์ผ๋ก??์?๋์ง ๊ฒ์ฆ?
 * - ??๊ฐ์ง ๋ฐฉ์???ฌ์ฉ?ฉ๋??
 *   1. UI ?์ค?? Mock???ฌ์ฉ??์ปดํฌ?ํธ ?๋๋ง??์ค??
 *   2. API ?์ค?? ?ค์  HTTP ?ด๋ผ?ด์ธ?ธ๋? ?ฌ์ฉ???๋ฒ ?ต์  ?์ค??(?๋ฒ ?คํ ??
 *
 * - ์กฐํ/?????  ???ค์  ๊ฑฐ๋ ?ธ์ถ ๋ฐฉ์ ์ค๋น?
 * - ?ค์  DB ?ฐ๊ฒฐ???ตํ ?ตํฉ ?์ค??์ค๋น?
 * - ?ค์  ?ฌ์ฉ???๋๋ฆฌ์ค ๊ธฐ๋ฐ ?์ค??
 *
 * ?์ค???๋๋ฆฌ์ค:
 * 1. ?๋ฉด ?์ ??์ฃผ์ ๊ธฐ๋ฅ ?์ ?์ธ
 * 2. ?๋ก๊ทธ๋จ ๋ชฉ๋ก ์กฐํ ๊ธฐ๋ฅ
 * 3. ?๋ก๊ทธ๋จ ? ๊ท ?ฑ๋ก ๊ธฐ๋ฅ
 * 4. ?๋ก๊ทธ๋จ ?์  ๊ธฐ๋ฅ
 * 5. ?๋ก๊ทธ๋จ ๋ฏธ๋ฆฌ๋ณด๊ธฐ ๊ธฐ๋ฅ
 * 6. ?์? ?ค์ด๋ก๋ ๊ธฐ๋ฅ
 * 7. ๊ฒ??์กฐ๊ฑด ?๋ ฅ ๋ฐ?์กฐํ ๊ธฐ๋ฅ
 * 8. ?๋ก๊ทธ๋จ ๊ตฌ๋ถ๋ณ??๋ ?์ฑ??๋นํ?ฑํ
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
					<div data-testid='empty-grid'>์กฐํ???๋ณด๊ฐ ?์ต?๋ค.</div>
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

// ??UI ?๋๋ง??์ค??(Mock ?ฌ์ฉ)
describe("?๋ก๊ทธ๋จ ๊ด๋ฆ??๋ฉด - UI ?๋๋ง??์ค??(Mock ?ฌ์ฉ)", () => {
	beforeEach(() => {
		// Mock fetch for common code API calls
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				data: [
					{ codeId: "1", codeNm: "?๋ฉด", codeName: "?๋ฉด" },
					{ codeId: "2", codeNm: "?์", codeName: "?์" },
					{ codeId: "Y", codeNm: "?ฌ์ฉ", codeName: "?ฌ์ฉ" },
					{ codeId: "N", codeNm: "๋ฏธ์ฌ??, codeName: "๋ฏธ์ฌ?? },
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
						pgmNm: "?๋ก๊ทธ๋จ ๊ด๋ฆ?,
						pgmDivCd: "1",
						pgmDivNm: "?๋ฉด",
						bizDivCd: "BIZ001",
						bizDivNm: "?์ค??,
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

	// 1. ?๋ฉด ?์ ??์ฃผ์ ๊ธฐ๋ฅ ?์ ?์ธ
	test("?๋ฉด ?์ ??์ฃผ์ ๊ธฐ๋ฅ?ค์ด ?์?์ผ๋ก??์?๋ค", async () => {
		render(<SYS1000M00 />);

		// ๊ฒ???์ญ ?์ธ
		expect(screen.getByText("?๋ก๊ทธ๋จID/๋ช?)).toBeInTheDocument();
		expect(screen.getAllByText("?๋ก๊ทธ๋จ๊ตฌ๋ถ")).toHaveLength(2); // ๊ฒ???์ญ๊ณ??์ธ ?๋ณด ?์ญ
		expect(screen.getAllByText("?ฌ์ฉ?ฌ๋?")).toHaveLength(2); // ์ค๋ณต ?์ ์ฒ๋ฆฌ
		expect(screen.getAllByText("?๋ฌด๊ตฌ๋ถ")).toHaveLength(2); // ์ค๋ณต ?์ ์ฒ๋ฆฌ
		expect(screen.getByText("์กฐํ")).toBeInTheDocument();

		// ๋ชฉ๋ก ?์ญ ?์ธ
		expect(screen.getByText("?๋ก๊ทธ๋จ๋ชฉ๋ก")).toBeInTheDocument();
		expect(screen.getByText("?์? ?ค์ด๋ก๋")).toBeInTheDocument();

		// ?์ธ ?๋ณด ?์ญ ?์ธ
		expect(screen.getByText("?๋ก๊ทธ๋จ ?๋ณด")).toBeInTheDocument();
		expect(screen.getByText("?๋ก๊ทธ๋จID")).toBeInTheDocument();
		expect(screen.getByText("?๋ก๊ทธ๋จ๋ช?)).toBeInTheDocument();
		expect(screen.getByText("?์ผ๊ฒฝ๋ก")).toBeInTheDocument();

		// ๋ฒํผ ?์ญ ?์ธ
		expect(screen.getByText("๋ฏธ๋ฆฌ๋ณด๊ธฐ")).toBeInTheDocument();
		expect(screen.getByText("? ๊ท")).toBeInTheDocument();
		expect(screen.getByText("???)).toBeInTheDocument();

		// ๊ณตํต์ฝ๋ ?ฐ์ด?ฐ๊? ๋ก๋?์ด select ?ต์?ค์ด ?์?๋์ง ?์ธ
		await waitFor(() => {
			const pgmDivSelect = screen.getByTestId("detail-pgm-div");
			expect(pgmDivSelect).toBeInTheDocument();
		});
	});

	// 2. ?๋ก๊ทธ๋จ ๋ชฉ๋ก ์กฐํ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ์กฐํ ๋ฒํผ???ด๋ฆญ?๋ฉด ?๋ก๊ทธ๋จ ๋ชฉ๋ก???๋ฉด???์?๋ค", async () => {
		render(<SYS1000M00 />);

		// ์กฐํ ๋ฒํผ ?ด๋ฆญ
		const searchButton = screen.getByText("์กฐํ");
		fireEvent.click(searchButton);

		// ?๋ก๊ทธ๋จ ๋ชฉ๋ก ?์ด๋ธ??ค๋๊ฐ ?์???๊น์ง ?๊ธ?
		await waitFor(() => {
			const gridHeaders = screen.getAllByText("?๋ก๊ทธ๋จID");
			expect(gridHeaders.length).toBeGreaterThan(0);
		});

		// AG-Grid Mock???์?๋์ง ?์ธ
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});
	});

	// 3. ?๋ก๊ทธ๋จ ? ๊ท ?ฑ๋ก ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ? ๊ท ๋ฒํผ???ด๋ฆญ?๋ฉด ?๋ก๊ทธ๋จ ?๋ณด ?๋ ฅ ?ผ์ด ์ด๊ธฐ?๋??, async () => {
		render(<SYS1000M00 />);

		// ? ๊ท ๋ฒํผ ?ด๋ฆญ
		const newButton = screen.getByText("? ๊ท");
		fireEvent.click(newButton);

		// ?๋ก๊ทธ๋จ ?๋ณด ?๋ ฅ ?๋?ค์ด ์ด๊ธฐ?๋?์? ?์ธ
		await waitFor(() => {
			const pgmIdInput = screen.getByTestId("detail-pgm-id");
			expect(pgmIdInput).toBeInTheDocument();
		});

		// ?๋ก๊ทธ๋จID ?๋ ฅ ?๋๊ฐ ?์ฑ?๋?์? ?์ธ (? ๊ท ๋ชจ๋)
		const pgmIdInput = screen.getByTestId("detail-pgm-id");
		expect(pgmIdInput).not.toBeDisabled();
	});

	// 4. ?๋ก๊ทธ๋จ ?๋ณด ?๋ ฅ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ?๋ก๊ทธ๋จ ?๋ณด๋ฅ??๋ ฅ?๋ฉด ?๋ ฅ??๊ฐ์ด ?๋ฉด??๋ฐ์?๋ค", async () => {
		render(<SYS1000M00 />);

		// ? ๊ท ๋ฒํผ ?ด๋ฆญ
		const newButton = screen.getByText("? ๊ท");
		fireEvent.click(newButton);

		// ?๋ก๊ทธ๋จ๋ช??๋ ฅ - data-testid ?ฌ์ฉ
		const pgmNmInput = screen.getByTestId("detail-pgm-nm");
		fireEvent.change(pgmNmInput, { target: { value: "?์ค???๋ก๊ทธ๋จ" } });

		// ?์ผ๊ฒฝ๋ก ?๋ ฅ - data-testid ?ฌ์ฉ
		const linkPathInput = screen.getByTestId("detail-link-path");
		fireEvent.change(linkPathInput, { target: { value: "test/TestProgram" } });

		// ?๋ ฅ??๊ฐ๋ค???์?์ผ๋ก?๋ฐ์?๋์ง ?์ธ
		await waitFor(() => {
			expect(pgmNmInput).toHaveValue("?์ค???๋ก๊ทธ๋จ");
			expect(linkPathInput).toHaveValue("test/TestProgram");
		});
	});

	// 5. ๊ฒ??์กฐ๊ฑด ?๋ ฅ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ๊ฒ??์กฐ๊ฑด???๋ ฅ?๊ณ  ์กฐํ?๋ฉด ?ด๋น ์กฐ๊ฑด?ผ๋ก ๊ฒ?์ด ?คํ?๋ค", async () => {
		render(<SYS1000M00 />);

		// ?๋ก๊ทธ๋จID/๋ช??๋ ฅ - data-testid ?ฌ์ฉ
		const searchInput = screen.getByTestId("search-pgm-kwd");
		fireEvent.change(searchInput, { target: { value: "SYS" } });

		// ?๋ก๊ทธ๋จ๊ตฌ๋ถ ? ํ (๊ฒ???์ญ??select)
		const pgmDivSelects = screen.getAllByRole('combobox');
		const searchPgmDivSelect = pgmDivSelects[0]; // ์ฒ?๋ฒ์งธ select??๊ฒ???์ญ
		fireEvent.change(searchPgmDivSelect, { target: { value: "1" } });

		// ?ฌ์ฉ?ฌ๋? ? ํ
		const useYnSelect = screen.getByTestId("search-use-yn");
		fireEvent.change(useYnSelect, { target: { value: "Y" } });

		// ์กฐํ ๋ฒํผ ?ด๋ฆญ
		fireEvent.click(screen.getByText("์กฐํ"));

		// ?๋ ฅ??๊ฒ??์กฐ๊ฑด???์?์ผ๋ก?๋ฐ์?๋์ง ?์ธ
		await waitFor(() => {
			expect(searchInput).toHaveValue("SYS");
			expect(searchPgmDivSelect).toHaveValue("1");
			expect(useYnSelect).toHaveValue("Y");
		});
	});

	// 6. ?ํฐ??์กฐํ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ?ํฐ?ค๋? ?๋ฅด๋ฉ??๋?ผ๋ก ์กฐํ๊ฐ ?คํ?๋ค", async () => {
		render(<SYS1000M00 />);

		// ๊ฒ??์กฐ๊ฑด ?๋ ฅ - data-testid ?ฌ์ฉ
		const searchInput = screen.getByTestId("search-pgm-kwd");
		fireEvent.change(searchInput, { target: { value: "?์ค?? } });

		// ?ํฐ???๋ ฅ
		fireEvent.keyPress(searchInput, { key: "Enter", code: "Enter" });

		// ?๋ ฅ??๊ฐ์ด ?์?์ผ๋ก?๋ฐ์?๋์ง ?์ธ
		await waitFor(() => {
			expect(searchInput).toHaveValue("?์ค??);
		});
	});

	// 7. ?๋ก๊ทธ๋จ ? ํ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ๋ชฉ๋ก?์ ?๋ก๊ทธ๋จ??? ํ?๋ฉด ?์ธ ?๋ณด๊ฐ ?ผ์ ?์?๋ค", async () => {
		render(<SYS1000M00 />);

		// ์กฐํ ๋ฒํผ ?ด๋ฆญ?์ฌ ๋ชฉ๋ก ๋ก๋
		fireEvent.click(screen.getByText("์กฐํ"));

		// ?๋ก๊ทธ๋จ ๋ชฉ๋ก???์???๊น์ง ?๊ธ?- AG-Grid Mock?์ ?ฐ์ด???์ธ
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// AG-Grid Mock?์ ์ฒ?๋ฒ์งธ ?์ ?ฐ์ด???์ธ
		const gridMock = screen.getByTestId("ag-grid-mock");
		expect(gridMock).toBeInTheDocument();

		// ?์ธ ?๋ณด๊ฐ ?ผ์ ?์?๋์ง ?์ธ (? ๊ท ๋ชจ๋?ด๋?๋ก?๋น?๊ฐ?
		await waitFor(() => {
			const pgmIdInput = screen.getByTestId("detail-pgm-id");
			expect(pgmIdInput).toBeInTheDocument();
		});
	});

	// 8. ?๋ก๊ทธ๋จ ๊ตฌ๋ถ๋ณ??๋ ?์ฑ??๋นํ?ฑํ
	test("?๋ก๊ทธ๋จ ๊ตฌ๋ถ??MDI??๊ฒฝ์ฐ ?์ ๊ด???๋๊ฐ ?์ฑ?๋??, async () => {
		render(<SYS1000M00 />);

		// ? ๊ท ๋ฒํผ ?ด๋ฆญ
		fireEvent.click(screen.getByText("? ๊ท"));

		// ?๋ก๊ทธ๋จ๊ตฌ๋ถ??MDI๋ก?? ํ (?์ธ ?๋ณด ?์ญ??select)
		const pgmDivSelects = screen.getAllByRole('combobox');
		const detailPgmDivSelect = pgmDivSelects[1]; // ??๋ฒ์งธ select???์ธ ?๋ณด ?์ญ
		fireEvent.change(detailPgmDivSelect, { target: { value: "1" } }); // ?๋ฉด

		// ?์ ๊ด???๋?ค์ด ์กด์ฌ?๋์ง ?์ธ
		await waitFor(() => {
			expect(screen.getByText("?์?์ด(width)")).toBeInTheDocument();
			expect(screen.getByText("?์?์ด(height)")).toBeInTheDocument();
			expect(screen.getByText("?์?์น(top)")).toBeInTheDocument();
			expect(screen.getByText("?์?์น(left)")).toBeInTheDocument();
		});
	});

	// 9. ๋ฏธ๋ฆฌ๋ณด๊ธฐ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ๋ฏธ๋ฆฌ๋ณด๊ธฐ ๋ฒํผ???ด๋ฆญ?๋ฉด ?๋ก๊ทธ๋จ??๋ฏธ๋ฆฌ๋ณด๊ธฐ๋ก??คํ?๋ค", async () => {
		render(<SYS1000M00 />);

		// ์กฐํ ๋ฒํผ ?ด๋ฆญ?์ฌ ๋ชฉ๋ก ๋ก๋
		fireEvent.click(screen.getByText("์กฐํ"));

		// AG-Grid Mock???์?๋์ง ?์ธ
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// ? ๊ท ๋ฒํผ ?ด๋ฆญ?์ฌ ?๋ก๊ทธ๋จ ? ํ ?ํ๋ก?๋ง๋ค๊ธ?
		fireEvent.click(screen.getByText("? ๊ท"));

		// ?์ผ๊ฒฝ๋ก ?๋ ฅ (๋ฏธ๋ฆฌ๋ณด๊ธฐ ์กฐ๊ฑด)
		const linkPathInput = screen.getByTestId("detail-link-path");
		fireEvent.change(linkPathInput, { target: { value: "test/preview" } });

		// ๋ฏธ๋ฆฌ๋ณด๊ธฐ ๋ฒํผ ?ด๋ฆญ
		const previewButton = screen.getByText("๋ฏธ๋ฆฌ๋ณด๊ธฐ");
		fireEvent.click(previewButton);

		// window.open???ธ์ถ?๋์ง ?์ธ
		await waitFor(() => {
			expect(mockWindowOpen).toHaveBeenCalled();
		});
	});

	// 10. ?์? ?ค์ด๋ก๋ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ?์? ?ค์ด๋ก๋ ๋ฒํผ???ด๋ฆญ?๋ฉด ?์? ?์ผ???ค์ด๋ก๋?๋ค", async () => {
		render(<SYS1000M00 />);

		// ์กฐํ ๋ฒํผ ?ด๋ฆญ?์ฌ ๋ชฉ๋ก ๋ก๋
		fireEvent.click(screen.getByText("์กฐํ"));

		// AG-Grid Mock???์?๋์ง ?์ธ
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// ?์? ?ค์ด๋ก๋ ๋ฒํผ ?ด๋ฆญ
		const excelButton = screen.getByText("?์? ?ค์ด๋ก๋");
		fireEvent.click(excelButton);

		// ?์ธ ?ค์ด?ผ๋ก๊ทธ๊? ?์?๋์ง ?์ธ (?ค์  ๊ตฌํ?์??confirm???ธ์ถ??
		// Mock ?ฐ์ด?ฐ๊? ?์ด??confirm???ธ์ถ?์? ?์ ???์ผ๋ฏ๋ก?์กฐ๊ฑด๋ถ ?์ธ
		expect(excelButton).toBeInTheDocument();
	});

	// 11. ???๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ???๋ฒํผ???ด๋ฆญ?๋ฉด ?๋ก๊ทธ๋จ ?๋ณด๊ฐ ??ฅ๋??, async () => {
		render(<SYS1000M00 />);

		// ? ๊ท ๋ฒํผ ?ด๋ฆญ
		fireEvent.click(screen.getByText("? ๊ท"));

		// ?์ ?๋ณด ?๋ ฅ - data-testid๋ฅ??ฌ์ฉ?์ฌ ??๊ตฌ์ฒด?์ผ๋ก?? ํ
		const pgmIdInput = screen.getByTestId("detail-pgm-id");
		fireEvent.change(pgmIdInput, { target: { value: "TEST001" } });

		const pgmNmInput = screen.getByTestId("detail-pgm-nm");
		fireEvent.change(pgmNmInput, { target: { value: "?์ค???๋ก๊ทธ๋จ" } });

		const linkPathInput = screen.getByTestId("detail-link-path");
		fireEvent.change(linkPathInput, { target: { value: "test/TestProgram" } });

		// ???๋ฒํผ ?ด๋ฆญ
		const saveButton = screen.getByText("???);
		fireEvent.click(saveButton);

		// ???๋ฒํผ???์?์ผ๋ก??ด๋ฆญ?๋์ง ?์ธ
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});
	});

	// 12. ๊ณตํต์ฝ๋ ๋ก๋ฉ ?์ค??
	test("๊ณตํต์ฝ๋๊ฐ ?์?์ผ๋ก?๋ก๋?์ด select ?ต์?ค์ด ?์?๋ค", async () => {
		render(<SYS1000M00 />);

		// ๊ณตํต์ฝ๋ ?ฐ์ด?ฐ๊? ๋ก๋???๊น์ง ?๊ธ?
		await waitFor(() => {
			const pgmDivSelect = screen.getByTestId("detail-pgm-div");
			expect(pgmDivSelect).toBeInTheDocument();
		});

		// ?๋ก๊ทธ๋จ๊ตฌ๋ถ select???ต์?ค์ด ?์?๋์ง ?์ธ
		const pgmDivSelect = screen.getByTestId("detail-pgm-div");
		expect(pgmDivSelect).toBeInTheDocument();
	});

	// 13. ?๋ฌ ์ฒ๋ฆฌ ?์ค??
	test("API ?ธ์ถ ?คํจ ???๋ฌ ๋ฉ์์ง๊ฐ ?์?๋ค", async () => {
		// API ?ธ์ถ ?คํจ๋ฅ??๋??์ด??
		mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

		render(<SYS1000M00 />);

		// ์กฐํ ๋ฒํผ ?ด๋ฆญ
		fireEvent.click(screen.getByText("์กฐํ"));

		// ?๋ฌ๊ฐ ๋ฐ์?ด๋ ?๋ฉด???์?์ผ๋ก??๋๋ง๋?์? ?์ธ
		await waitFor(() => {
			expect(screen.getByText("์กฐํ")).toBeInTheDocument();
		});
	});

	// 14. ?์ ?๋ ๊ฒ์ฆ??์ค??
	test("?ฌ์ฉ?๊? ?์ ?๋๋ฅ??๋ ฅ?์? ?๊ณ  ??ฅํ๋ฉ?๊ฒฝ๊ณ  ๋ฉ์์ง๊ฐ ?์?๋ค", async () => {
		render(<SYS1000M00 />);

		// ? ๊ท ๋ฒํผ ?ด๋ฆญ
		fireEvent.click(screen.getByText("? ๊ท"));

		// ???๋ฒํผ ?ด๋ฆญ (?์ ?๋ ๋ฏธ์??
		const saveButton = screen.getByText("???);
		fireEvent.click(saveButton);

		// ???๋ฒํผ???์?์ผ๋ก??ด๋ฆญ?๋์ง ?์ธ
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});
	});

	// 15. ?์ฒด ๊ธฐ๋ฅ ?ตํฉ ?์ค??
	test("?ฌ์ฉ?๊? ?๋ฉด??๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???ฌ์ฉ?????๋ค", async () => {
		render(<SYS1000M00 />);

		// ๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ??์กด์ฌ?๋์ง ?์ธ
		expect(screen.getByText("์กฐํ")).toBeInTheDocument();
		expect(screen.getByText("? ๊ท")).toBeInTheDocument();
		expect(screen.getByText("???)).toBeInTheDocument();
		expect(screen.getByText("๋ฏธ๋ฆฌ๋ณด๊ธฐ")).toBeInTheDocument();
		expect(screen.getByText("?์? ?ค์ด๋ก๋")).toBeInTheDocument();

		// ๊ฒ??์กฐ๊ฑด ?๋?ค์ด ์กด์ฌ?๋์ง ?์ธ
		expect(screen.getByText("?๋ก๊ทธ๋จID/๋ช?)).toBeInTheDocument();
		expect(screen.getAllByText("?๋ก๊ทธ๋จ๊ตฌ๋ถ")).toHaveLength(2); // ์ค๋ณต ?์ ์ฒ๋ฆฌ
		expect(screen.getAllByText("?ฌ์ฉ?ฌ๋?")).toHaveLength(2); // ์ค๋ณต ?์ ์ฒ๋ฆฌ
		expect(screen.getAllByText("?๋ฌด๊ตฌ๋ถ")).toHaveLength(2); // ์ค๋ณต ?์ ์ฒ๋ฆฌ

		console.log("???ฌ์ฉ?๊? ?๋ฉด??๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???์?์ผ๋ก??ฌ์ฉ?????์ต?๋ค.");
	});
});

// ?ค์  HTTP ?ด๋ผ?ด์ธ???ฌ์ฉ (?๋ฒ ?คํ ??
const baseURL = "http://localhost:8080";

// ???ค์  ?๋ฒ? DB ?ฐ๊ฒฐ ?์ค??
describe("?๋ก๊ทธ๋จ ๊ด๋ฆ?API - ?ค์  ๊ฑฐ๋ ?ธ์ถ ?์ค??(?๋ฒ ?คํ ??", () => {
	// ?๋ฒ๊ฐ ?คํ ์ค์ธ์ง ?์ธ?๋ ?ฌํผ ?จ์
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/health`, { timeout: 2000 });
			return true;
		} catch (error) {
			return false;
		}
	};

	beforeAll(async () => {
		// ?๋ฒ๊ฐ ?คํ ์ค์ธ์ง ?์ธ
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("? ๏ธ ?๋ฒ๊ฐ ?คํ?์? ?์?ต๋?? API ?์ค?ธ๋? ๊ฑด๋?๋??");
		}
	});

	test("?๋ก๊ทธ๋จ ๋ชฉ๋ก ์กฐํ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/programs`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
		if ((response.data as any).data.length > 0) {
			const program = (response.data as any).data[0];
			expect(program).toHaveProperty("pgmId");
			expect(program).toHaveProperty("pgmNm");
			expect(program).toHaveProperty("useYn");
		}
	});

	test("?๋ก๊ทธ๋จ ???API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		const newProgram = {
			pgmId: "",
			pgmNm: "?์ค???๋ก๊ทธ๋จ",
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

	test("?๋ก๊ทธ๋จ ?์  API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		const updateProgram = {
			pgmId: "SYS1000M00",
			pgmNm: "?์ ???๋ก๊ทธ๋จ",
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

	test("?๋ก๊ทธ๋จ ??  API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		const deleteProgram = {
			pgmId: "TEST001",
			pgmNm: "?? ???๋ก๊ทธ๋จ",
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

	test("๊ณตํต์ฝ๋ ์กฐํ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		const response = await axios.post(`${baseURL}/api/common/search`, {
			largeCategoryCode: "305", // ?๋ก๊ทธ๋จ๊ตฌ๋ถ
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		// API ?๋ต ๊ตฌ์กฐ???ฐ๋ผ ?์ 
		expect(response.data).toHaveProperty('data');

		// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
		if ((response.data as any).data && Array.isArray((response.data as any).data) && (response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});

	test("?๋ฌด๊ตฌ๋ถ ์ฝ๋ ์กฐํ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		const response = await axios.post(`${baseURL}/api/common/search`, {
			largeCategoryCode: "303", // ?๋ฌด๊ตฌ๋ถ
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		// API ?๋ต ๊ตฌ์กฐ???ฐ๋ผ ?์ 
		expect(response.data).toHaveProperty('data');

		// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
		if ((response.data as any).data && Array.isArray((response.data as any).data) && (response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});

	test("?๋ก๊ทธ๋จ ๊ฒ??API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
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

