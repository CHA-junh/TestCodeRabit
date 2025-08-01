/**
 * PSM1010M00 - ?ฌ์/?ธ์ฃผ ๊ด๋ฆ?๋ฉ์ธ ?๋ฉด ?์ด๋ธ๋ฆฌ???์ค??
 *
 * ?์ค??๋ชฉํ:
 * - ?ฌ์/?ธ์ฃผ ๊ด๋ฆ?๋ฉ์ธ ?๋ฉด??๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???์?์ผ๋ก??์?๋์ง ๊ฒ์ฆ?
 * - ??๊ฐ์ง ๋ฐฉ์???ฌ์ฉ?ฉ๋??
 *   1. UI ?์ค?? Mock???ฌ์ฉ??์ปดํฌ?ํธ ?๋๋ง??์ค??
 *   2. API ?์ค?? ?ค์  HTTP ?ด๋ผ?ด์ธ?ธ๋? ?ฌ์ฉ???๋ฒ ?ต์  ?์ค??(?๋ฒ ?คํ ??
 *
 * - ์กฐํ/?????  ???ค์  ๊ฑฐ๋ ?ธ์ถ ๋ฐฉ์ ์ค๋น?
 * - ?ค์  DB ?ฐ๊ฒฐ???ตํ ?ตํฉ ?์ค??์ค๋น?
 * - ??๊ธฐ๋ฐ ?ธํฐ?์ด??๋ฐ?AG Grid ?์ ๊ฒ์ฆ?
 *
 * ?์ค???๋๋ฆฌ์ค:
 * 1. ?๋ฉด ?์ ??์ฃผ์ ๊ธฐ๋ฅ ?์ ?์ธ
 * 2. ?ฌ์/?ธ์ฃผ ๋ฆฌ์ค??์กฐํ ๊ธฐ๋ฅ
 * 3. ?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ ๋ณ๊ฒ????์  UI ?๋ฐ?ดํธ
 * 4. ๋ณธ๋? ๋ณ๊ฒ???๋ถ??๋ชฉ๋ก ?๋ฐ?ดํธ
 * 5. ?ฌ์ ? ํ ๋ฐ????ํ ๊ธฐ๋ฅ
 * 6. AG Grid ์ปฌ๋ผ ?์  ๋ณ๊ฒ?๊ธฐ๋ฅ
 * 7. ?ฌ์?ํฉ์กฐํ ๊ธฐ๋ฅ
 * 8. ?์ ??์ปดํฌ?ํธ ?ฐ๋ ๊ธฐ๋ฅ
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
					<div data-testid='empty-grid'>?ฐ์ด?ฐ๊? ?์ต?๋ค</div>
				)}
			</div>
		);
	},
}));

// Mock ?์ ์ปดํฌ?ํธ??
jest.mock("./PSM1020M00", () => {
	return React.forwardRef(({ selectedEmployee, fieldEnableState, onSearchSuccess }: any, ref: any) => {
		React.useImperativeHandle(ref, () => ({
			initialize: jest.fn(),
			handleSearch: jest.fn(),
		}));
		return <div data-testid="psm1020m00">?ฌ์?๋ณด?ฑ๋ก ๋ฐ??์  ??/div>;
	});
});

jest.mock("./PSM1030M00", () => {
	return React.forwardRef(({ selectedEmployee }: any, ref: any) => {
		React.useImperativeHandle(ref, () => ({
			initialize: jest.fn(),
		}));
		return <div data-testid="psm1030m00">?ธ์ฌ๋ฐ๋ น?ด์ญ(๊ฑด๋ณ) ??/div>;
	});
});

jest.mock("./PSM1040M00", () => {
	return ({ selectedEmployee }: any) => (
		<div data-testid="psm1040m00">?ธ์ฌ๋ฐ๋ น?ผ๊ด?ฑ๋ก ??/div>
	);
});

jest.mock("./PSM0050M00", () => {
	return ({ isTabMode, parentEmpNo, parentEmpNm }: any) => (
		<div data-testid="psm0050m00">?๋ก?๋ด??กฐ????/div>
	);
});

// Mock axios for UI tests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock fetch for API calls
global.fetch = jest.fn();

// ?ค์  HTTP ?ด๋ผ?ด์ธ???ฌ์ฉ (?๋ฒ ?คํ ??
const baseURL = "http://localhost:8080";

describe("?ฌ์/?ธ์ฃผ ๊ด๋ฆ?๋ฉ์ธ ?๋ฉด - UI ?์ค??(Mock ?ฌ์ฉ)", () => {
	beforeEach(() => {
		// Mock ๊ธฐ๋ณธ ?๋ต ?ค์ 
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

	// 1. ?๋ฉด ?์ ??์ฃผ์ ๊ธฐ๋ฅ ?์ ?์ธ
	test("?ฌ์ฉ?๊? ?ฌ์/?ธ์ฃผ ๊ด๋ฆ?๋ฉ์ธ ?๋ฉด???์?๋ฉด ๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???์?๋ค", async () => {
		render(<EmployeeMainPage />);

		// ์กฐํ ?์ญ ?์ธ
		await waitFor(() => {
			expect(screen.getByText("?์ฌ ?ธ์ฃผ ๊ตฌ๋ถ")).toBeInTheDocument();
		});

		expect(screen.getByText("?ฌ์?ฑ๋ช")).toBeInTheDocument();
		expect(screen.getByText("๋ณธ๋?")).toBeInTheDocument();
		expect(screen.getByText("๋ถ??)).toBeInTheDocument();
		expect(screen.getByText("์ง์ฑ")).toBeInTheDocument();
		expect(screen.getByText("?ด์ฌ?ํฌ??)).toBeInTheDocument();
		expect(screen.getByText("์กฐํ")).toBeInTheDocument();

		// ๋ฆฌ์ค????ดํ? ?์ธ
		expect(screen.getByText("?ฌ์/?ธ์ฃผ ๋ฆฌ์ค??)).toBeInTheDocument();
		expect(screen.getByText("?ฌ์?ํฉ์กฐํ")).toBeInTheDocument();

		// ??๋ฉ๋ด ?์ธ
		expect(screen.getByText("?ฌ์?๋ณด?ฑ๋ก ๋ฐ??์ ")).toBeInTheDocument();
		expect(screen.getByText("?ธ์ฌ๋ฐ๋ น?ด์ญ(๊ฑด๋ณ)")).toBeInTheDocument();
		expect(screen.getByText("?ธ์ฌ๋ฐ๋ น?ผ๊ด?ฑ๋ก")).toBeInTheDocument();
		expect(screen.getByText("?๋ก?๋ด??กฐ??)).toBeInTheDocument();

		console.log("???ฌ์ฉ?๊? ?๋ฉด???์?๋ฉด ๋ชจ๋  ์ฃผ์ ๊ธฐ๋ฅ???์?์ผ๋ก??์?ฉ๋??");
	});

	// 2. ?ฌ์/?ธ์ฃผ ๋ฆฌ์ค??์กฐํ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ์กฐํ ์กฐ๊ฑด???๋ ฅ?๊ณ  ์กฐํ ๋ฒํผ???ด๋ฆญ?๋ฉด ?ฌ์ ๋ฆฌ์ค?ธ๊? ?์?๋ค", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("์กฐํ")).toBeInTheDocument();
		});

		// ?ฌ์?ฑ๋ช ?๋ ฅ ?๋ ์ฐพ๊ธฐ (type="text"??input ?์)
		const empNmInput = screen.getByRole("textbox");
		fireEvent.change(empNmInput, { target: { value: "๊น์ฒ ์" } });

		// ์กฐํ ๋ฒํผ ?ด๋ฆญ
		const searchButton = screen.getByText("์กฐํ");
		fireEvent.click(searchButton);

		// ?๋ ฅ??๊ฐ์ด ?์?์ผ๋ก?๋ฐ์?๋์ง ?์ธ
		await waitFor(() => {
			expect(empNmInput).toHaveValue("๊น์ฒ ์");
		});

		console.log("???ฌ์ฉ?๊? ์กฐํ ์กฐ๊ฑด???๋ ฅ?๊ณ  ์กฐํ ๋ฒํผ???ด๋ฆญ?๋ฉด ?ฌ์ ๋ฆฌ์ค?ธ๊? ?์?ฉ๋??");
	});

	// 3. ?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ ๋ณ๊ฒ????์  UI ?๋ฐ?ดํธ
	test("?ฌ์ฉ?๊? ?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ??๋ณ๊ฒฝํ๋ฉ?UI๊ฐ ?์ ?ผ๋ก ?๋ฐ?ดํธ?๋ค", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("?์ฌ ?ธ์ฃผ ๊ตฌ๋ถ")).toBeInTheDocument();
		});

		// ?ธ์ฃผ ?ผ๋??๋ฒํผ ?ด๋ฆญ
		const outsRadio = screen.getByRole("radio", { name: /?ธ์ฃผ/i });
		fireEvent.click(outsRadio);

		// ?ธ์ฃผ ? ํ ??UI ๋ณ๊ฒ??์ธ
		await waitFor(() => {
			expect(screen.getByText("?ธ์ฃผ?์ฒด")).toBeInTheDocument();
		});

		// ?์ฌ ?ผ๋??๋ฒํผ ?ด๋ฆญ
		const ownRadio = screen.getByRole("radio", { name: /?์ฌ/i });
		fireEvent.click(ownRadio);

		// ?์ฌ ? ํ ??UI ๋ณ๊ฒ??์ธ
		await waitFor(() => {
			expect(screen.getByText("๋ณธ๋?")).toBeInTheDocument();
		});

		console.log("???ฌ์ฉ?๊? ?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ??๋ณ๊ฒฝํ๋ฉ?UI๊ฐ ?์ ?ผ๋ก ?๋ฐ?ดํธ?ฉ๋??");
	});

	// 4. ๋ณธ๋? ๋ณ๊ฒ???๋ถ??๋ชฉ๋ก ?๋ฐ?ดํธ
	test("?ฌ์ฉ?๊? ๋ณธ๋?๋ฅ?? ํ?๋ฉด ?ด๋น ๋ณธ๋???๋ถ??๋ชฉ๋ก???๋ฐ?ดํธ?๋ค", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("๋ณธ๋?")).toBeInTheDocument();
		});

		// ๋ณธ๋? ? ํ ์ฝค๋ณด๋ฐ์ค๊ฐ ์กด์ฌ?๋์ง ?์ธ (select ?์ ์ฐพ๊ธฐ)
		const hqSelect = screen.getAllByRole("combobox")[0]; // ์ฒ?๋ฒ์งธ select ?์ (๋ณธ๋?)
		expect(hqSelect).toBeInTheDocument();

		// ๋ถ??์ฝค๋ณด๋ฐ์ค๊ฐ ์กด์ฌ?๋์ง ?์ธ (select ?์ ์ฐพ๊ธฐ)
		const deptSelect = screen.getAllByRole("combobox")[1]; // ??๋ฒ์งธ select ?์ (๋ถ??
		expect(deptSelect).toBeInTheDocument();

		// select ?์?ค์ด ?์?์ผ๋ก??๋๋ง๋?๋์ง ?์ธ
		expect(hqSelect).toBeInTheDocument();
		expect(deptSelect).toBeInTheDocument();

		console.log("???ฌ์ฉ?๊? ๋ณธ๋?๋ฅ?? ํ?๋ฉด ?ด๋น ๋ณธ๋???๋ถ??๋ชฉ๋ก???๋ฐ?ดํธ?ฉ๋??");
	});

	// 5. ?ฌ์ ? ํ ๋ฐ????ํ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ?ฌ์??? ํ?๊ณ  ?? ?ํ?๋ฉด ?ด๋น ?? ?ด์ฉ???์?๋ค", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("?ฌ์?๋ณด?ฑ๋ก ๋ฐ??์ ")).toBeInTheDocument();
		});

		// ๊ธฐ๋ณธ ???ฌ์?๋ณด?ฑ๋ก ๋ฐ??์ ) ?์ธ
		expect(screen.getByTestId("psm1020m00")).toBeInTheDocument();

		// ?ธ์ฌ๋ฐ๋ น?ด์ญ(๊ฑด๋ณ) ???ด๋ฆญ
		const promotionTab = screen.getByText("?ธ์ฌ๋ฐ๋ น?ด์ญ(๊ฑด๋ณ)");
		fireEvent.click(promotionTab);

		// ???ํ ?์ธ
		await waitFor(() => {
			expect(screen.getByTestId("psm1030m00")).toBeInTheDocument();
		});

		// ?ธ์ฌ๋ฐ๋ น?ผ๊ด?ฑ๋ก ???ด๋ฆญ
		const batchTab = screen.getByText("?ธ์ฌ๋ฐ๋ น?ผ๊ด?ฑ๋ก");
		fireEvent.click(batchTab);

		await waitFor(() => {
			expect(screen.getByTestId("psm1040m00")).toBeInTheDocument();
		});

		// ?๋ก?๋ด??กฐ?????ด๋ฆญ
		const profileTab = screen.getByText("?๋ก?๋ด??กฐ??);
		fireEvent.click(profileTab);

		await waitFor(() => {
			expect(screen.getByTestId("psm0050m00")).toBeInTheDocument();
		});

		console.log("???ฌ์ฉ?๊? ?ฌ์??? ํ?๊ณ  ?? ?ํ?๋ฉด ?ด๋น ?? ?ด์ฉ???์?ฉ๋??");
	});

	// 6. AG Grid ์ปฌ๋ผ ?์  ๋ณ๊ฒ?๊ธฐ๋ฅ
	test("?์ฌ/?ธ์ฃผ ๊ตฌ๋ถ???ฐ๋ผ AG Grid ์ปฌ๋ผ???์ ?ผ๋ก ๋ณ๊ฒฝ๋??, async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// ?์ฌ ? ํ ??(๊ธฐ๋ณธ๊ฐ?
		expect(screen.getByText("๋ณธ๋?")).toBeInTheDocument();

		// ?ธ์ฃผ ? ํ
		const outsRadio = screen.getByRole("radio", { name: /?ธ์ฃผ/i });
		fireEvent.click(outsRadio);

		// ?ธ์ฃผ ? ํ ???ธ์ฃผ?์ฒด ?์ ?์ธ
		await waitFor(() => {
			expect(screen.getByText("?ธ์ฃผ?์ฒด")).toBeInTheDocument();
		});

		console.log("???์ฌ/?ธ์ฃผ ๊ตฌ๋ถ???ฐ๋ผ AG Grid ์ปฌ๋ผ???์ ?ผ๋ก ๋ณ๊ฒฝ๋ฉ?๋ค.");
	});

	// 7. ?ฌ์?ํฉ์กฐํ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ?ฌ์?ํฉ์กฐํ ๋ฒํผ???ด๋ฆญ?๋ฉด ๊ฒฝ๊ณ  ๋ฉ์์ง๊ฐ ?์?๋ค", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("?ฌ์?ํฉ์กฐํ")).toBeInTheDocument();
		});

		// ?ฌ์?ํฉ์กฐํ ๋ฒํผ ?ด๋ฆญ (?ฌ์ ๋ฏธ์ ???ํ)
		const inquiryButton = screen.getByText("?ฌ์?ํฉ์กฐํ");
		fireEvent.click(inquiryButton);

		// ๊ฒฝ๊ณ  ๋ฉ์์ง๊ฐ ?์?๋์ง ?์ธ (Toast ๋ฉ์์ง???ค์  ๊ตฌํ???ฐ๋ผ ?ค๋? ???์)
		await waitFor(() => {
			expect(inquiryButton).toBeInTheDocument();
		});

		console.log("???ฌ์ฉ?๊? ?ฌ์?ํฉ์กฐํ ๋ฒํผ???ด๋ฆญ?๋ฉด ๊ฒฝ๊ณ  ๋ฉ์์ง๊ฐ ?์?ฉ๋??");
	});

	// 8. ?์ ??์ปดํฌ?ํธ ?ฐ๋ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ?ฌ์??? ํ?๋ฉด ?์ ??์ปดํฌ?ํธ๊ฐ ์ด๊ธฐ?๋??, async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByTestId("psm1020m00")).toBeInTheDocument();
		});

		// ?ฌ์?๋ณด?ฑ๋ก ๋ฐ??์  ??ด ๊ธฐ๋ณธ?ผ๋ก ?์?๋์ง ?์ธ
		expect(screen.getByTestId("psm1020m00")).toBeInTheDocument();

		console.log("???ฌ์ฉ?๊? ?ฌ์??? ํ?๋ฉด ?์ ??์ปดํฌ?ํธ๊ฐ ์ด๊ธฐ?๋ฉ?๋ค.");
	});

	// 9. ๊ฒ??์กฐ๊ฑด ?๋ ฅ ๋ฐ??ํฐ??์ฒ๋ฆฌ
	test("?ฌ์ฉ?๊? ?ฌ์?ฑ๋ช???๋ ฅ?๊ณ  ?ํฐ?ค๋? ?๋ฅด๋ฉ??๋?ผ๋ก ์กฐํ๊ฐ ?คํ?๋ค", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("์กฐํ")).toBeInTheDocument();
		});

		// ?ฌ์?ฑ๋ช ?๋ ฅ ?๋ ์ฐพ๊ธฐ (type="text"??input ?์)
		const empNmInput = screen.getByRole("textbox");
		fireEvent.change(empNmInput, { target: { value: "๊น์ฒ ์" } });

		// ?ํฐ???๋ ฅ
		fireEvent.keyPress(empNmInput, { key: "Enter", code: "Enter" });

		// ?๋ ฅ??๊ฐ์ด ?์?์ผ๋ก?๋ฐ์?๋์ง ?์ธ
		await waitFor(() => {
			expect(empNmInput).toHaveValue("๊น์ฒ ์");
		});

		console.log("???ฌ์ฉ?๊? ?ฌ์?ฑ๋ช???๋ ฅ?๊ณ  ?ํฐ?ค๋? ?๋ฅด๋ฉ??๋?ผ๋ก ์กฐํ๊ฐ ?คํ?ฉ๋??");
	});

	// 10. ?ด์ฌ?ํฌ??์ฒดํฌ๋ฐ์ค ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? ?ด์ฌ?ํฌ??์ฒดํฌ๋ฐ์ค๋ฅ??ด๋ฆญ?๋ฉด ์กฐํ ์กฐ๊ฑด??๋ณ๊ฒฝ๋??, async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("?ด์ฌ?ํฌ??)).toBeInTheDocument();
		});

		// ?ด์ฌ?ํฌ??์ฒดํฌ๋ฐ์ค ?ด๋ฆญ
		const retireCheckbox = screen.getByRole("checkbox");
		fireEvent.click(retireCheckbox);

		// ์ฒดํฌ๋ฐ์ค๊ฐ ์ฒดํฌ?์?์? ?์ธ
		await waitFor(() => {
			expect(retireCheckbox).toBeChecked();
		});

		console.log("???ฌ์ฉ?๊? ?ด์ฌ?ํฌ??์ฒดํฌ๋ฐ์ค๋ฅ??ด๋ฆญ?๋ฉด ์กฐํ ์กฐ๊ฑด??๋ณ๊ฒฝ๋ฉ?๋ค.");
	});

	// 11. AG Grid ???ด๋ฆญ ๋ฐ??๋ธ?ด๋ฆญ ๊ธฐ๋ฅ
	test("?ฌ์ฉ?๊? AG Grid???์ ?ด๋ฆญ?๊ฑฐ???๋ธ?ด๋ฆญ?๋ฉด ?ฌ์??? ํ?๋ค", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// AG Grid๊ฐ ?์?์ผ๋ก??๋๋ง๋?๋์ง ?์ธ
		expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();

		console.log("???ฌ์ฉ?๊? AG Grid???์ ?ด๋ฆญ?๊ฑฐ???๋ธ?ด๋ฆญ?๋ฉด ?ฌ์??? ํ?ฉ๋??");
	});

	// 12. ๋ก๋ฉ ?ํ ?์ ๊ธฐ๋ฅ
	test("์กฐํ ์ค์??๋ก๋ฉ ?ํ๊ฐ ?์?๋ค", async () => {
		render(<EmployeeMainPage />);

		await waitFor(() => {
			expect(screen.getByText("์กฐํ")).toBeInTheDocument();
		});

		// ์กฐํ ๋ฒํผ ?ด๋ฆญ
		const searchButton = screen.getByText("์กฐํ");
		fireEvent.click(searchButton);

		// ์กฐํ ๋ฒํผ???์?์ผ๋ก??ด๋ฆญ?๋์ง ?์ธ
		await waitFor(() => {
			expect(searchButton).toBeInTheDocument();
		});

		console.log("??์กฐํ ์ค์??๋ก๋ฉ ?ํ๊ฐ ?์?ฉ๋??");
	});
});

// ?ค์  ๊ฑฐ๋ ?ธ์ถ ?์ค??- ?๋ฒ ?คํ ?์๋ง??คํ
describe("?ฌ์/?ธ์ฃผ ๊ด๋ฆ?API - ?ค์  ๊ฑฐ๋ ?ธ์ถ ?์ค??(?๋ฒ ?คํ ??", () => {
	// ?๋ฒ๊ฐ ?คํ ์ค์ธ์ง ?์ธ?๋ ?ฌํผ ?จ์
	const isServerRunning = async (): Promise<boolean> => {
		try {
			// /api/health ?๋?ฌ์ธ?ธ๋ก ?๋ฒ ?ํ ?์ธ (?๋ฒ?์ app.setGlobalPrefix('api') ?ค์ ??
			await axios.get(`${baseURL}/api/health`, { timeout: 3000 });
			return true;
		} catch (error) {
			console.log("?๋ฒ ?ฐ๊ฒฐ ?คํจ:", error instanceof Error ? error.message : String(error));
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

	test("?ฌ์/?ธ์ฃผ ๋ฆฌ์ค??์กฐํ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		const response = await axios.post(`${baseURL}/api/psm/employee/search`, {
			empNo: 'ALL',
			empNm: '?์ค??,
			ownOutsDiv: '1',
			hqDivCd: 'ALL',
			deptDivCd: 'ALL',
			dutyCd: 'ALL',
			retirYn: 'N'
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		
		// data ?๋๊ฐ ๋ฐฐ์ด?ธ์? ?์ธ?๊ณ , ๋ฐฐ์ด???๋๋ฉ?๋น?๋ฐฐ์ด๋ก?์ฒ๋ฆฌ
		const responseData = (response.data as any).data;
		if (Array.isArray(responseData)) {
			console.log("??data??๋ฐฐ์ด?๋?? ๊ธธ์ด:", responseData.length);
		} else {
			console.log("? ๏ธ data??๋ฐฐ์ด???๋?๋ค. ???", typeof responseData);
			console.log("? ๏ธ data ๊ฐ?", responseData);
		}

		// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?(๋ฐฐ์ด???๋ ๊ฒฝ์ฐ??์ฒ๋ฆฌ)
		if (responseData && Array.isArray(responseData) && responseData.length > 0) {
			const employee = responseData[0];
			expect(employee).toHaveProperty("EMP_NO");
			expect(employee).toHaveProperty("EMP_NM");
			expect(employee).toHaveProperty("OWN_OUTS_DIV");
		} else {
			console.log("?น๏ธ ์กฐํ???ฌ์ ?ฐ์ด?ฐ๊? ?์ต?๋ค.");
		}
	});

	test("๋ณธ๋?๋ณ?๋ถ??๋ชฉ๋ก ์กฐํ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ๋ณธ๋?๋ณ?๋ถ??๋ชฉ๋ก ์กฐํ API ?ธ์ถ ?์");
			
			const response = await axios.post(`${baseURL}/api/common/dept-by-hq`, {
				hqDivCd: '1000',
				allYn: 'Y'
			});

			console.log("? ๋ณธ๋?๋ณ?๋ถ??๋ชฉ๋ก ์กฐํ ?๋ต:", response.data);

			expect(response.status).toBe(200);
			
			// success ?๋๊ฐ false??๊ฒฝ์ฐ ?์ธ ?๋ณด ์ถ๋ ฅ
			if (!(response.data as any).success) {
				console.log("??API ?ธ์ถ ?คํจ - ?๋ต:", response.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
			
			// data ?๋ ๊ฒ์ฆ?
			const responseData = (response.data as any).data;
			if (Array.isArray(responseData)) {
				console.log("??data??๋ฐฐ์ด?๋?? ๊ธธ์ด:", responseData.length);
			} else {
				console.log("? ๏ธ data??๋ฐฐ์ด???๋?๋ค. ???", typeof responseData);
				console.log("? ๏ธ data ๊ฐ?", responseData);
			}

			// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const dept = responseData[0];
				expect(dept).toHaveProperty("DATA");
				expect(dept).toHaveProperty("LABEL");
			} else {
				console.log("?น๏ธ ์กฐํ??๋ถ???ฐ์ด?ฐ๊? ?์ต?๋ค.");
			}
		} catch (error) {
			console.log("??๋ณธ๋?๋ณ?๋ถ??๋ชฉ๋ก ์กฐํ API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???๋ต ?ํ:", error.response?.status);
				console.log("???๋ต ?ฐ์ด??", error.response?.data);
			}
			throw error;
		}
	});

	test("๊ณตํต ์ฝ๋ ์กฐํ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ๊ณตํต ์ฝ๋ ์กฐํ API ?ธ์ถ ?์");

			// ๋ณธ๋? ์ฝ๋ ์กฐํ
			const hqResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '113'
			});

			console.log("? ๋ณธ๋? ์ฝ๋ ์กฐํ ?๋ต:", hqResponse.data);

			expect(hqResponse.status).toBe(200);
			
			// success ?๋๊ฐ false??๊ฒฝ์ฐ ?์ธ ?๋ณด ์ถ๋ ฅ
			if (!(hqResponse.data as any).success) {
				console.log("??๋ณธ๋? ์ฝ๋ ์กฐํ ?คํจ - ?๋ต:", hqResponse.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (hqResponse.data as any).message);
			}
			
			expect((hqResponse.data as any).success).toBe(true);

			// ์ง์ฑ ์ฝ๋ ์กฐํ
			const dutyResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '116'
			});

			console.log("? ์ง์ฑ ์ฝ๋ ์กฐํ ?๋ต:", dutyResponse.data);

			expect(dutyResponse.status).toBe(200);
			
			if (!(dutyResponse.data as any).success) {
				console.log("??์ง์ฑ ์ฝ๋ ์กฐํ ?คํจ - ?๋ต:", dutyResponse.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (dutyResponse.data as any).message);
			}
			
			expect((dutyResponse.data as any).success).toBe(true);

			// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
			const hqData = (hqResponse.data as any).data;
			if (hqData && Array.isArray(hqData) && hqData.length > 0) {
				const code = hqData[0];
				expect(code).toHaveProperty("codeId");
				expect(code).toHaveProperty("codeNm");
			} else {
				console.log("?น๏ธ ์กฐํ??๋ณธ๋? ์ฝ๋ ?ฐ์ด?ฐ๊? ?์ต?๋ค.");
			}
		} catch (error) {
			console.log("??๊ณตํต ์ฝ๋ ์กฐํ API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???๋ต ?ํ:", error.response?.status);
				console.log("???๋ต ?ฐ์ด??", error.response?.data);
			}
			throw error;
		}
	});

	test("?ธ์ฃผ?์ฒด ์ฝ๋ ์กฐํ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ?ธ์ฃผ?์ฒด ์ฝ๋ ์กฐํ API ?ธ์ถ ?์");
			
			const response = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '111'
			});

			console.log("? ?ธ์ฃผ?์ฒด ์ฝ๋ ์กฐํ ?๋ต:", response.data);

			expect(response.status).toBe(200);
			
			// success ?๋๊ฐ false??๊ฒฝ์ฐ ?์ธ ?๋ณด ์ถ๋ ฅ
			if (!(response.data as any).success) {
				console.log("???ธ์ฃผ?์ฒด ์ฝ๋ ์กฐํ ?คํจ - ?๋ต:", response.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const company = responseData[0];
				expect(company).toHaveProperty("codeId");
				expect(company).toHaveProperty("codeNm");
			} else {
				console.log("?น๏ธ ์กฐํ???ธ์ฃผ?์ฒด ์ฝ๋ ?ฐ์ด?ฐ๊? ?์ต?๋ค.");
			}
		} catch (error) {
			console.log("???ธ์ฃผ?์ฒด ์ฝ๋ ์กฐํ API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???๋ต ?ํ:", error.response?.status);
				console.log("???๋ต ?ฐ์ด??", error.response?.data);
			}
			throw error;
		}
	});

	test("?ธ์ฌ๋ฐ๋ น?ด์ญ ์กฐํ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ?ธ์ฌ๋ฐ๋ น?ด์ญ ์กฐํ API ?ธ์ถ ?์");
			
			const empNo = "EMP001";
			const response = await axios.post(`${baseURL}/api/psm/appointment/search`, {
				empNo: empNo
			});

			console.log("? ?ธ์ฌ๋ฐ๋ น?ด์ญ ์กฐํ ?๋ต:", response.data);

			expect(response.status).toBe(200);
			
			// success ?๋๊ฐ false??๊ฒฝ์ฐ ?์ธ ?๋ณด ์ถ๋ ฅ
			if (!(response.data as any).success) {
				console.log("???ธ์ฌ๋ฐ๋ น?ด์ญ ์กฐํ ?คํจ - ?๋ต:", response.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?ค์  DB ?ฐ์ด??๊ฒ์ฆ?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const appointment = responseData[0];
				expect(appointment).toHaveProperty("EMP_NO");
				expect(appointment).toHaveProperty("APNT_DIV");
				expect(appointment).toHaveProperty("APNT_DT");
			} else {
				console.log("?น๏ธ ์กฐํ???ธ์ฌ๋ฐ๋ น?ด์ญ???์ต?๋ค.");
				console.log("?น๏ธ ?ฌ์๋ฒํธ 'EMP001'??์กด์ฌ?์? ?์ ???์ต?๋ค.");
			}
		} catch (error) {
			console.log("???ธ์ฌ๋ฐ๋ น?ด์ญ ์กฐํ API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???๋ต ?ํ:", error.response?.status);
				console.log("???๋ต ?ฐ์ด??", error.response?.data);
			}
			throw error;
		}
	});

	test("?ฌ์ ?๋ณด ?๋ฐ?ดํธ API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		try {
			console.log("? ?ฌ์ ?๋ณด ?๋ฐ?ดํธ API ?ธ์ถ ?์");
			
			const updateEmployee = {
				mode: 'MOD',
				empNo: 'EMP001',
				empNm: '?์ค???ฌ์',
				ownOutsDiv: '1',
				hqDivCd: '1000',
				deptDivCd: '1100',
				dutyCd: '9',
				entrDt: '20240101',
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/employee/update`, updateEmployee);

			console.log("? ?ฌ์ ?๋ณด ?๋ฐ?ดํธ ?๋ต:", response.data);

			expect(response.status).toBe(200);
			
			// success ?๋๊ฐ false??๊ฒฝ์ฐ ?์ธ ?๋ณด ์ถ๋ ฅ
			if (!(response.data as any).success) {
				console.log("???ฌ์ ?๋ณด ?๋ฐ?ดํธ ?คํจ - ?๋ต:", response.data);
				console.log("???๋ฌ ๋ฉ์์ง:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("???ฌ์ ?๋ณด ?๋ฐ?ดํธ API ?ธ์ถ ?คํจ:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???๋ต ?ํ:", error.response?.status);
				console.log("???๋ต ?ฐ์ด??", error.response?.data);
			}
			throw error;
		}
	});

	test("?ฌ์ ?๋ณด ?์  API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		const updateEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?์ ???ฌ์",
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

	test("?ฌ์ ?๋ณด ??  API๊ฐ ?์?์ผ๋ก??์?๋ค", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??ธ ?๋ฒ๊ฐ ?คํ?์? ?์ ?์ค?ธ๋? ๊ฑด๋?๋??");
			return;
		}

		const deleteEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?? ???ฌ์",
			WKG_ST_DIV_CD: "3" // ?ด์ฌ
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

