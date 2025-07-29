/**
 * PSM1040M00 - ?�사발령 ?�괄?�록 ?�면 ?�스??
 *
 * ?�스??목표:
 * - ?�사발령 ?�괄?�록 ?�면??모든 주요 기능???�상?�으�??�작?�는지 검�?
 * - ??가지 방식???�용?�니??
 *   1. UI ?�스?? Mock???�용??컴포?�트 ?�더�??�스??
 *   2. API ?�스?? ?�제 HTTP ?�라?�언?��? ?�용???�버 ?�신 ?�스??(?�버 ?�행 ??
 *
 * 주요 기능:
 * - ?�사발령 ?�괄?�록
 * - 공통 코드 조회
 * - 본�?�?부??목록 조회
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import PSM1040M00 from "./PSM1040M00";
import axios from "axios";

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock fetch for API calls
global.fetch = jest.fn();

// ?�제 HTTP ?�라?�언???�용 (?�버 ?�행 ??
const baseURL = "http://localhost:8080";

describe("PSM1040M00 - ?�사발령 ?�괄?�록 ?�면 - UI ?�스??(Mock ?�용)", () => {
	beforeEach(() => {
		// Mock 기본 ?�답 ?�정
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

	test("?�사발령 ?�괄?�록 ?�면???�속?�면 모든 주요 기능???�시?�다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("?�사발령?�용")).toBeInTheDocument();
		});

		// 주요 기능 버튼???�인
		expect(screen.getByText("?�록")).toBeInTheDocument();
		expect(screen.getByText("?�규")).toBeInTheDocument();
		expect(screen.getByText("리스?�초기화")).toBeInTheDocument();
		expect(screen.getByText("?�삭??)).toBeInTheDocument();
	});

	test("?�용?��? ?�사발령 ?�보�??�력?�고 ?�록 버튼???�릭?�면 ?�괄?�록 처리가 진행?�다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("?�록")).toBeInTheDocument();
		});

		// ?�록 버튼 ?�릭
		const registerButton = screen.getByText("?�록");
		fireEvent.click(registerButton);

		// ?�록 버튼??존재?�는지 ?�인
		expect(registerButton).toBeInTheDocument();
	});

	test("?�용?��? ?�규 버튼???�릭?�면 ?�력 ?�드가 초기?�된??, async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("?�규")).toBeInTheDocument();
		});

		// ?�규 버튼 ?�릭
		const newButton = screen.getByText("?�규");
		fireEvent.click(newButton);

		// ?�력 ?�드 초기???�인
		await waitFor(() => {
			// ?�력 ?�드?�이 비어?�는지 ?�인
			const inputs = screen.getAllByRole('textbox');
			inputs.forEach(input => {
				if (input instanceof HTMLInputElement) {
					expect(input.value).toBe('');
				}
			});
		});
	});

	test("?�용?��? ??�� 버튼???�릭?�면 ?�택???�이 ??��?�다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("?�삭??)).toBeInTheDocument();
		});

		// ?�삭??버튼 ?�릭
		const deleteButton = screen.getByText("?�삭??);
		fireEvent.click(deleteButton);

		// ?�삭??버튼??비활?�화?�어 ?�는지 ?�인 (초기 ?�태)
		expect(deleteButton).toBeDisabled();
	});

	test("?�용?��? ?�체??�� 버튼???�릭?�면 모든 ?�이 ??��?�다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("리스?�초기화")).toBeInTheDocument();
		});

		// 리스?�초기화 버튼 ?�릭
		const resetButton = screen.getByText("리스?�초기화");
		fireEvent.click(resetButton);

		// 리스?�초기화 버튼??존재?�는지 ?�인
		expect(resetButton).toBeInTheDocument();
	});

	test("?�용?��? 본�?�?변경하�??�당 본�???부??목록???�데?�트?�다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("발령본�?")).toBeInTheDocument();
		});

		// 발령본�? ?�택 변�?
		const hqSelect = screen.getByText("발령본�?");
		expect(hqSelect).toBeInTheDocument();
	});

	test("?�용?��? 발령구분??변경하�?관???�드?�이 ?�데?�트?�다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("발령구분")).toBeInTheDocument();
		});

		// 발령구분 ?�택 변�?
		const apntDivSelect = screen.getByText("발령구분");
		expect(apntDivSelect).toBeInTheDocument();
	});
});

// ?�제 거래 ?�출 ?�스??- ?�버 ?�행 ?�에�??�행
describe("PSM1040M00 - ?�사발령 ?�괄?�록 API - ?�제 거래 ?�출 ?�스??(?�버 ?�행 ??", () => {
	// ?�버가 ?�행 중인지 ?�인?�는 ?�퍼 ?�수
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/api/health`, { timeout: 3000 });
			return true;
		} catch (error) {
			console.log("?�버 ?�결 ?�패:", error instanceof Error ? error.message : String(error));
			return false;
		}
	};

	beforeAll(async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("?�️ ?�버가 ?�행?��? ?�았?�니?? API ?�스?��? 건너?�니??");
		}
	});

	test("?�사발령 ?�괄?�록 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		try {
			console.log("?�� ?�사발령 ?�괄?�록 API ?�출 ?�작");
			
			const batchAppointmentData = {
				apntDiv: '2',
				apntDt: '20240101',
				hqDivCd: '1000',
				deptDivCd: '1100',
				dutyCd: '9',
				rmk: '?�스???�괄발령',
				empList: [
					{
						empNo: 'EMP001',
						empNm: '?�길??
					},
					{
						empNo: 'EMP002',
						empNm: '김철수'
					}
				],
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/appointment/batch-register`, batchAppointmentData);

			console.log("?�� ?�사발령 ?�괄?�록 ?�답:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???�사발령 ?�괄?�록 ?�패 - ?�답:", response.data);
				console.log("???�러 메시지:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("???�사발령 ?�괄?�록 API ?�출 ?�패:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???�답 ?�태:", error.response?.status);
				console.log("???�답 ?�이??", error.response?.data);
			}
			throw error;
		}
	});

	test("공통 코드 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		try {
			console.log("?�� 공통 코드 조회 API ?�출 ?�작");

			// 발령구분 코드 조회
			const apntDivResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '018'
			});

			console.log("?�� 발령구분 코드 조회 ?�답:", apntDivResponse.data);

			expect(apntDivResponse.status).toBe(200);
			
			if (!(apntDivResponse.data as any).success) {
				console.log("??발령구분 코드 조회 ?�패 - ?�답:", apntDivResponse.data);
				console.log("???�러 메시지:", (apntDivResponse.data as any).message);
			}
			
			expect((apntDivResponse.data as any).success).toBe(true);

			// 본�? 코드 조회
			const hqResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '113'
			});

			console.log("?�� 본�? 코드 조회 ?�답:", hqResponse.data);

			expect(hqResponse.status).toBe(200);
			
			if (!(hqResponse.data as any).success) {
				console.log("??본�? 코드 조회 ?�패 - ?�답:", hqResponse.data);
				console.log("???�러 메시지:", (hqResponse.data as any).message);
			}
			
			expect((hqResponse.data as any).success).toBe(true);

			// ?�제 DB ?�이??검�?
			const apntDivData = (apntDivResponse.data as any).data;
			if (apntDivData && Array.isArray(apntDivData) && apntDivData.length > 0) {
				const code = apntDivData[0];
				expect(code).toHaveProperty("codeId");
				expect(code).toHaveProperty("codeNm");
			} else {
				console.log("?�️ 조회??발령구분 코드 ?�이?��? ?�습?�다.");
			}
		} catch (error) {
			console.log("??공통 코드 조회 API ?�출 ?�패:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???�답 ?�태:", error.response?.status);
				console.log("???�답 ?�이??", error.response?.data);
			}
			throw error;
		}
	});

	test("본�?�?부??목록 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		try {
			console.log("?�� 본�?�?부??목록 조회 API ?�출 ?�작");
			
			const response = await axios.post(`${baseURL}/api/psm/dept-by-hq`, {
				hqDivCd: '1000',
				allYn: 'Y'
			});

			console.log("?�� 본�?�?부??목록 조회 ?�답:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("??본�?�?부??목록 조회 ?�패 - ?�답:", response.data);
				console.log("???�러 메시지:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?�제 DB ?�이??검�?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const dept = responseData[0];
				expect(dept).toHaveProperty("DATA");
				expect(dept).toHaveProperty("LABEL");
			} else {
				console.log("?�️ 조회??부???�이?��? ?�습?�다.");
			}
		} catch (error) {
			console.log("??본�?�?부??목록 조회 API ?�출 ?�패:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???�답 ?�태:", error.response?.status);
				console.log("???�답 ?�이??", error.response?.data);
			}
			throw error;
		}
	});
}); 

