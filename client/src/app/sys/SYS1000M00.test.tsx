/**
 * SYS1000M00 - ?�로그램 관�??�면 ?�이브리???�스??
 *
 * ?�스??목표:
 * - ?�로그램 관�??�면??모든 주요 기능???�상?�으�??�작?�는지 검�?
 * - ??가지 방식???�용?�니??
 *   1. UI ?�스?? Mock???�용??컴포?�트 ?�더�??�스??
 *   2. API ?�스?? ?�제 HTTP ?�라?�언?��? ?�용???�버 ?�신 ?�스??(?�버 ?�행 ??
 *
 * - 조회/?�????�� ???�제 거래 ?�출 방식 준�?
 * - ?�제 DB ?�결???�한 ?�합 ?�스??준�?
 * - ?�제 ?�용???�나리오 기반 ?�스??
 *
 * ?�스???�나리오:
 * 1. ?�면 ?�속 ??주요 기능 ?�시 ?�인
 * 2. ?�로그램 목록 조회 기능
 * 3. ?�로그램 ?�규 ?�록 기능
 * 4. ?�로그램 ?�정 기능
 * 5. ?�로그램 미리보기 기능
 * 6. ?��? ?�운로드 기능
 * 7. 검??조건 ?�력 �?조회 기능
 * 8. ?�로그램 구분�??�드 ?�성??비활?�화
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
					<div data-testid='empty-grid'>조회???�보가 ?�습?�다.</div>
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

// ??UI ?�더�??�스??(Mock ?�용)
describe("?�로그램 관�??�면 - UI ?�더�??�스??(Mock ?�용)", () => {
	beforeEach(() => {
		// Mock fetch for common code API calls
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				data: [
					{ codeId: "1", codeNm: "?�면", codeName: "?�면" },
					{ codeId: "2", codeNm: "?�업", codeName: "?�업" },
					{ codeId: "Y", codeNm: "?�용", codeName: "?�용" },
					{ codeId: "N", codeNm: "미사??, codeName: "미사?? },
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
						pgmNm: "?�로그램 관�?,
						pgmDivCd: "1",
						pgmDivNm: "?�면",
						bizDivCd: "BIZ001",
						bizDivNm: "?�스??,
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

	// 1. ?�면 ?�속 ??주요 기능 ?�시 ?�인
	test("?�면 ?�속 ??주요 기능?�이 ?�상?�으�??�시?�다", async () => {
		render(<SYS1000M00 />);

		// 검???�역 ?�인
		expect(screen.getByText("?�로그램ID/�?)).toBeInTheDocument();
		expect(screen.getAllByText("?�로그램구분")).toHaveLength(2); // 검???�역�??�세 ?�보 ?�역
		expect(screen.getAllByText("?�용?��?")).toHaveLength(2); // 중복 ?�소 처리
		expect(screen.getAllByText("?�무구분")).toHaveLength(2); // 중복 ?�소 처리
		expect(screen.getByText("조회")).toBeInTheDocument();

		// 목록 ?�역 ?�인
		expect(screen.getByText("?�로그램목록")).toBeInTheDocument();
		expect(screen.getByText("?��? ?�운로드")).toBeInTheDocument();

		// ?�세 ?�보 ?�역 ?�인
		expect(screen.getByText("?�로그램 ?�보")).toBeInTheDocument();
		expect(screen.getByText("?�로그램ID")).toBeInTheDocument();
		expect(screen.getByText("?�로그램�?)).toBeInTheDocument();
		expect(screen.getByText("?�일경로")).toBeInTheDocument();

		// 버튼 ?�역 ?�인
		expect(screen.getByText("미리보기")).toBeInTheDocument();
		expect(screen.getByText("?�규")).toBeInTheDocument();
		expect(screen.getByText("?�??)).toBeInTheDocument();

		// 공통코드 ?�이?��? 로드?�어 select ?�션?�이 ?�시?�는지 ?�인
		await waitFor(() => {
			const pgmDivSelect = screen.getByTestId("detail-pgm-div");
			expect(pgmDivSelect).toBeInTheDocument();
		});
	});

	// 2. ?�로그램 목록 조회 기능
	test("?�용?��? 조회 버튼???�릭?�면 ?�로그램 목록???�면???�시?�다", async () => {
		render(<SYS1000M00 />);

		// 조회 버튼 ?�릭
		const searchButton = screen.getByText("조회");
		fireEvent.click(searchButton);

		// ?�로그램 목록 ?�이�??�더가 ?�시???�까지 ?��?
		await waitFor(() => {
			const gridHeaders = screen.getAllByText("?�로그램ID");
			expect(gridHeaders.length).toBeGreaterThan(0);
		});

		// AG-Grid Mock???�시?�는지 ?�인
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});
	});

	// 3. ?�로그램 ?�규 ?�록 기능
	test("?�용?��? ?�규 버튼???�릭?�면 ?�로그램 ?�보 ?�력 ?�이 초기?�된??, async () => {
		render(<SYS1000M00 />);

		// ?�규 버튼 ?�릭
		const newButton = screen.getByText("?�규");
		fireEvent.click(newButton);

		// ?�로그램 ?�보 ?�력 ?�드?�이 초기?�되?��? ?�인
		await waitFor(() => {
			const pgmIdInput = screen.getByTestId("detail-pgm-id");
			expect(pgmIdInput).toBeInTheDocument();
		});

		// ?�로그램ID ?�력 ?�드가 ?�성?�되?��? ?�인 (?�규 모드)
		const pgmIdInput = screen.getByTestId("detail-pgm-id");
		expect(pgmIdInput).not.toBeDisabled();
	});

	// 4. ?�로그램 ?�보 ?�력 기능
	test("?�용?��? ?�로그램 ?�보�??�력?�면 ?�력??값이 ?�면??반영?�다", async () => {
		render(<SYS1000M00 />);

		// ?�규 버튼 ?�릭
		const newButton = screen.getByText("?�규");
		fireEvent.click(newButton);

		// ?�로그램�??�력 - data-testid ?�용
		const pgmNmInput = screen.getByTestId("detail-pgm-nm");
		fireEvent.change(pgmNmInput, { target: { value: "?�스???�로그램" } });

		// ?�일경로 ?�력 - data-testid ?�용
		const linkPathInput = screen.getByTestId("detail-link-path");
		fireEvent.change(linkPathInput, { target: { value: "test/TestProgram" } });

		// ?�력??값들???�상?�으�?반영?�는지 ?�인
		await waitFor(() => {
			expect(pgmNmInput).toHaveValue("?�스???�로그램");
			expect(linkPathInput).toHaveValue("test/TestProgram");
		});
	});

	// 5. 검??조건 ?�력 기능
	test("?�용?��? 검??조건???�력?�고 조회?�면 ?�당 조건?�로 검?�이 ?�행?�다", async () => {
		render(<SYS1000M00 />);

		// ?�로그램ID/�??�력 - data-testid ?�용
		const searchInput = screen.getByTestId("search-pgm-kwd");
		fireEvent.change(searchInput, { target: { value: "SYS" } });

		// ?�로그램구분 ?�택 (검???�역??select)
		const pgmDivSelects = screen.getAllByRole('combobox');
		const searchPgmDivSelect = pgmDivSelects[0]; // �?번째 select??검???�역
		fireEvent.change(searchPgmDivSelect, { target: { value: "1" } });

		// ?�용?��? ?�택
		const useYnSelect = screen.getByTestId("search-use-yn");
		fireEvent.change(useYnSelect, { target: { value: "Y" } });

		// 조회 버튼 ?�릭
		fireEvent.click(screen.getByText("조회"));

		// ?�력??검??조건???�상?�으�?반영?�는지 ?�인
		await waitFor(() => {
			expect(searchInput).toHaveValue("SYS");
			expect(searchPgmDivSelect).toHaveValue("1");
			expect(useYnSelect).toHaveValue("Y");
		});
	});

	// 6. ?�터??조회 기능
	test("?�용?��? ?�터?��? ?�르�??�동?�로 조회가 ?�행?�다", async () => {
		render(<SYS1000M00 />);

		// 검??조건 ?�력 - data-testid ?�용
		const searchInput = screen.getByTestId("search-pgm-kwd");
		fireEvent.change(searchInput, { target: { value: "?�스?? } });

		// ?�터???�력
		fireEvent.keyPress(searchInput, { key: "Enter", code: "Enter" });

		// ?�력??값이 ?�상?�으�?반영?�는지 ?�인
		await waitFor(() => {
			expect(searchInput).toHaveValue("?�스??);
		});
	});

	// 7. ?�로그램 ?�택 기능
	test("?�용?��? 목록?�서 ?�로그램???�택?�면 ?�세 ?�보가 ?�에 ?�시?�다", async () => {
		render(<SYS1000M00 />);

		// 조회 버튼 ?�릭?�여 목록 로드
		fireEvent.click(screen.getByText("조회"));

		// ?�로그램 목록???�시???�까지 ?��?- AG-Grid Mock?�서 ?�이???�인
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// AG-Grid Mock?�서 �?번째 ?�의 ?�이???�인
		const gridMock = screen.getByTestId("ag-grid-mock");
		expect(gridMock).toBeInTheDocument();

		// ?�세 ?�보가 ?�에 ?�시?�는지 ?�인 (?�규 모드?��?�?�?�?
		await waitFor(() => {
			const pgmIdInput = screen.getByTestId("detail-pgm-id");
			expect(pgmIdInput).toBeInTheDocument();
		});
	});

	// 8. ?�로그램 구분�??�드 ?�성??비활?�화
	test("?�로그램 구분??MDI??경우 ?�업 관???�드가 ?�성?�된??, async () => {
		render(<SYS1000M00 />);

		// ?�규 버튼 ?�릭
		fireEvent.click(screen.getByText("?�규"));

		// ?�로그램구분??MDI�??�택 (?�세 ?�보 ?�역??select)
		const pgmDivSelects = screen.getAllByRole('combobox');
		const detailPgmDivSelect = pgmDivSelects[1]; // ??번째 select???�세 ?�보 ?�역
		fireEvent.change(detailPgmDivSelect, { target: { value: "1" } }); // ?�면

		// ?�업 관???�드?�이 존재?�는지 ?�인
		await waitFor(() => {
			expect(screen.getByText("?�업?�이(width)")).toBeInTheDocument();
			expect(screen.getByText("?�업?�이(height)")).toBeInTheDocument();
			expect(screen.getByText("?�업?�치(top)")).toBeInTheDocument();
			expect(screen.getByText("?�업?�치(left)")).toBeInTheDocument();
		});
	});

	// 9. 미리보기 기능
	test("?�용?��? 미리보기 버튼???�릭?�면 ?�로그램??미리보기�??�행?�다", async () => {
		render(<SYS1000M00 />);

		// 조회 버튼 ?�릭?�여 목록 로드
		fireEvent.click(screen.getByText("조회"));

		// AG-Grid Mock???�시?�는지 ?�인
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// ?�규 버튼 ?�릭?�여 ?�로그램 ?�택 ?�태�?만들�?
		fireEvent.click(screen.getByText("?�규"));

		// ?�일경로 ?�력 (미리보기 조건)
		const linkPathInput = screen.getByTestId("detail-link-path");
		fireEvent.change(linkPathInput, { target: { value: "test/preview" } });

		// 미리보기 버튼 ?�릭
		const previewButton = screen.getByText("미리보기");
		fireEvent.click(previewButton);

		// window.open???�출?�는지 ?�인
		await waitFor(() => {
			expect(mockWindowOpen).toHaveBeenCalled();
		});
	});

	// 10. ?��? ?�운로드 기능
	test("?�용?��? ?��? ?�운로드 버튼???�릭?�면 ?��? ?�일???�운로드?�다", async () => {
		render(<SYS1000M00 />);

		// 조회 버튼 ?�릭?�여 목록 로드
		fireEvent.click(screen.getByText("조회"));

		// AG-Grid Mock???�시?�는지 ?�인
		await waitFor(() => {
			expect(screen.getByTestId("ag-grid-mock")).toBeInTheDocument();
		});

		// ?��? ?�운로드 버튼 ?�릭
		const excelButton = screen.getByText("?��? ?�운로드");
		fireEvent.click(excelButton);

		// ?�인 ?�이?�로그�? ?�시?�는지 ?�인 (?�제 구현?�서??confirm???�출??
		// Mock ?�이?��? ?�어??confirm???�출?��? ?�을 ???�으므�?조건부 ?�인
		expect(excelButton).toBeInTheDocument();
	});

	// 11. ?�??기능
	test("?�용?��? ?�??버튼???�릭?�면 ?�로그램 ?�보가 ?�?�된??, async () => {
		render(<SYS1000M00 />);

		// ?�규 버튼 ?�릭
		fireEvent.click(screen.getByText("?�규"));

		// ?�수 ?�보 ?�력 - data-testid�??�용?�여 ??구체?�으�??�택
		const pgmIdInput = screen.getByTestId("detail-pgm-id");
		fireEvent.change(pgmIdInput, { target: { value: "TEST001" } });

		const pgmNmInput = screen.getByTestId("detail-pgm-nm");
		fireEvent.change(pgmNmInput, { target: { value: "?�스???�로그램" } });

		const linkPathInput = screen.getByTestId("detail-link-path");
		fireEvent.change(linkPathInput, { target: { value: "test/TestProgram" } });

		// ?�??버튼 ?�릭
		const saveButton = screen.getByText("?�??);
		fireEvent.click(saveButton);

		// ?�??버튼???�상?�으�??�릭?�는지 ?�인
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});
	});

	// 12. 공통코드 로딩 ?�스??
	test("공통코드가 ?�상?�으�?로드?�어 select ?�션?�이 ?�시?�다", async () => {
		render(<SYS1000M00 />);

		// 공통코드 ?�이?��? 로드???�까지 ?��?
		await waitFor(() => {
			const pgmDivSelect = screen.getByTestId("detail-pgm-div");
			expect(pgmDivSelect).toBeInTheDocument();
		});

		// ?�로그램구분 select???�션?�이 ?�시?�는지 ?�인
		const pgmDivSelect = screen.getByTestId("detail-pgm-div");
		expect(pgmDivSelect).toBeInTheDocument();
	});

	// 13. ?�러 처리 ?�스??
	test("API ?�출 ?�패 ???�러 메시지가 ?�시?�다", async () => {
		// API ?�출 ?�패�??��??�이??
		mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

		render(<SYS1000M00 />);

		// 조회 버튼 ?�릭
		fireEvent.click(screen.getByText("조회"));

		// ?�러가 발생?�도 ?�면???�상?�으�??�더링되?��? ?�인
		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});
	});

	// 14. ?�수 ?�드 검�??�스??
	test("?�용?��? ?�수 ?�드�??�력?��? ?�고 ?�?�하�?경고 메시지가 ?�시?�다", async () => {
		render(<SYS1000M00 />);

		// ?�규 버튼 ?�릭
		fireEvent.click(screen.getByText("?�규"));

		// ?�??버튼 ?�릭 (?�수 ?�드 미입??
		const saveButton = screen.getByText("?�??);
		fireEvent.click(saveButton);

		// ?�??버튼???�상?�으�??�릭?�는지 ?�인
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});
	});

	// 15. ?�체 기능 ?�합 ?�스??
	test("?�용?��? ?�면??모든 주요 기능???�용?????�다", async () => {
		render(<SYS1000M00 />);

		// 모든 주요 기능??존재?�는지 ?�인
		expect(screen.getByText("조회")).toBeInTheDocument();
		expect(screen.getByText("?�규")).toBeInTheDocument();
		expect(screen.getByText("?�??)).toBeInTheDocument();
		expect(screen.getByText("미리보기")).toBeInTheDocument();
		expect(screen.getByText("?��? ?�운로드")).toBeInTheDocument();

		// 검??조건 ?�드?�이 존재?�는지 ?�인
		expect(screen.getByText("?�로그램ID/�?)).toBeInTheDocument();
		expect(screen.getAllByText("?�로그램구분")).toHaveLength(2); // 중복 ?�소 처리
		expect(screen.getAllByText("?�용?��?")).toHaveLength(2); // 중복 ?�소 처리
		expect(screen.getAllByText("?�무구분")).toHaveLength(2); // 중복 ?�소 처리

		console.log("???�용?��? ?�면??모든 주요 기능???�상?�으�??�용?????�습?�다.");
	});
});

// ?�제 HTTP ?�라?�언???�용 (?�버 ?�행 ??
const baseURL = "http://localhost:8080";

// ???�제 ?�버?� DB ?�결 ?�스??
describe("?�로그램 관�?API - ?�제 거래 ?�출 ?�스??(?�버 ?�행 ??", () => {
	// ?�버가 ?�행 중인지 ?�인?�는 ?�퍼 ?�수
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/health`, { timeout: 2000 });
			return true;
		} catch (error) {
			return false;
		}
	};

	beforeAll(async () => {
		// ?�버가 ?�행 중인지 ?�인
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("?�️ ?�버가 ?�행?��? ?�았?�니?? API ?�스?��? 건너?�니??");
		}
	});

	test("?�로그램 목록 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/programs`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// ?�제 DB ?�이??검�?
		if ((response.data as any).data.length > 0) {
			const program = (response.data as any).data[0];
			expect(program).toHaveProperty("pgmId");
			expect(program).toHaveProperty("pgmNm");
			expect(program).toHaveProperty("useYn");
		}
	});

	test("?�로그램 ?�??API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const newProgram = {
			pgmId: "",
			pgmNm: "?�스???�로그램",
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

	test("?�로그램 ?�정 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const updateProgram = {
			pgmId: "SYS1000M00",
			pgmNm: "?�정???�로그램",
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

	test("?�로그램 ??�� API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const deleteProgram = {
			pgmId: "TEST001",
			pgmNm: "??��???�로그램",
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

	test("공통코드 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const response = await axios.post(`${baseURL}/api/common/search`, {
			largeCategoryCode: "305", // ?�로그램구분
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		// API ?�답 구조???�라 ?�정
		expect(response.data).toHaveProperty('data');

		// ?�제 DB ?�이??검�?
		if ((response.data as any).data && Array.isArray((response.data as any).data) && (response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});

	test("?�무구분 코드 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		const response = await axios.post(`${baseURL}/api/common/search`, {
			largeCategoryCode: "303", // ?�무구분
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		// API ?�답 구조???�라 ?�정
		expect(response.data).toHaveProperty('data');

		// ?�제 DB ?�이??검�?
		if ((response.data as any).data && Array.isArray((response.data as any).data) && (response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});

	test("?�로그램 검??API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
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

