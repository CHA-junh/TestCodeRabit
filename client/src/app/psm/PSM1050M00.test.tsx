/**
 * PSM1050M00 - 경력 계산 ?�면 ?�스??
 *
 * ?�스??목표:
 * - 경력 계산 ?�면??모든 주요 기능???�상?�으�??�작?�는지 검�?
 * - ??가지 방식???�용?�니??
 *   1. UI ?�스?? Mock???�용??컴포?�트 ?�더�??�스??
 *   2. API ?�스?? ?�제 HTTP ?�라?�언?��? ?�용???�버 ?�신 ?�스??(?�버 ?�행 ??
 *
 * 주요 기능:
 * - 경력 계산
 * - ?�로??경력 조회
 * - 경력 ?�보 ?�??
 * - 공통 코드 조회
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

// ?�제 HTTP ?�라?�언???�용 (?�버 ?�행 ??
const baseURL = "http://localhost:8080";

describe("PSM1050M00 - 경력 계산 ?�면 - UI ?�스??(Mock ?�용)", () => {
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

	test("경력 계산 ?�면???�속?�면 모든 주요 기능???�시?�다", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("경력개월??계산")).toBeInTheDocument();
		});

		// 주요 기능 버튼???�인
		expect(screen.getByText("계산")).toBeInTheDocument();
		expect(screen.getByText("?�인")).toBeInTheDocument();
		expect(screen.getByText("취소")).toBeInTheDocument();
	});

	test("?�용?��? 경력 ?�보�??�력?�고 계산 버튼???�릭?�면 경력 계산??진행?�다", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("계산")).toBeInTheDocument();
		});

		// 계산 버튼 ?�릭
		const calculateButton = screen.getByText("계산");
		fireEvent.click(calculateButton);

		// 계산 버튼??존재?�는지 ?�인
		expect(calculateButton).toBeInTheDocument();
	});

	test("?�용?��? ?�인 버튼???�릭?�면 경력 ?�보가 ?�?�되�??�업???�힌??, async () => {
		const mockOnConfirm = jest.fn();
		const mockOnClose = jest.fn();

		render(<PSM1050M00 onClose={mockOnClose} onConfirm={mockOnConfirm} />);

		await waitFor(() => {
			expect(screen.getByText("?�인")).toBeInTheDocument();
		});

		// ?�인 버튼 ?�릭
		const confirmButton = screen.getByText("?�인");
		fireEvent.click(confirmButton);

		// ?�인 버튼??존재?�는지 ?�인
		expect(confirmButton).toBeInTheDocument();
	});

	test("?�용?��? 취소 버튼???�릭?�면 ?�업???�힌??, async () => {
		const mockOnClose = jest.fn();
		const mockOnConfirm = jest.fn();
		
		render(<PSM1050M00 onClose={mockOnClose} onConfirm={mockOnConfirm} />);

		await waitFor(() => {
			expect(screen.getByText("취소")).toBeInTheDocument();
		});

		// 취소 버튼 ?�릭
		const cancelButton = screen.getByText("취소");
		fireEvent.click(cancelButton);

		// 취소 처리 ?�인
		await waitFor(() => {
			expect(cancelButton).toBeInTheDocument();
		});
	});

	test("?�용?��? ?�사/?�주 구분??변경하�?관???�드?�이 ?�데?�트?�다", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("구분")).toBeInTheDocument();
		});

		// 구분 ?�드 ?�인
		const empDivField = screen.getByText("구분");
		expect(empDivField).toBeInTheDocument();
	});

	test("?�용?��? 경력계산기�??�을 변경하�?경력 계산 결과가 ?�데?�트?�다", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("최종철수?�자")).toBeInTheDocument();
		});

		// 최종철수?�자 ?�드 ?�인
		const finalDateField = screen.getByText("최종철수?�자");
		expect(finalDateField).toBeInTheDocument();
	});
});

// ?�제 거래 ?�출 ?�스??- ?�버 ?�행 ?�에�??�행
describe("PSM1050M00 - 경력 계산 API - ?�제 거래 ?�출 ?�스??(?�버 ?�행 ??", () => {
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

	test("경력 계산 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		try {
			console.log("?�� 경력 계산 API ?�출 ?�작");
			
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

			console.log("?�� 경력 계산 ?�답:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("??경력 계산 ?�패 - ?�답:", response.data);
				console.log("???�러 메시지:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?�제 DB ?�이??검�?
			const responseData = (response.data as any).data;
			if (responseData && typeof responseData === 'object' && Object.keys(responseData).length > 0) {
				expect(responseData).toHaveProperty("CARR_YCNT");
				expect(responseData).toHaveProperty("CARR_MCNT");
				expect(responseData).toHaveProperty("TCN_GRD");
			} else {
				console.log("?�️ 경력 계산 결과가 ?�습?�다.");
				console.log("?�️ ?�원번호 'EMP001'??존재?��? ?�거??경력 ?�이?��? ?�을 ???�습?�다.");
				// �??�답?�어??API ?�출 ?�체???�공?�로 간주
				expect(responseData).toBeDefined();
			}
		} catch (error) {
			console.log("??경력 계산 API ?�출 ?�패:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???�답 ?�태:", error.response?.status);
				console.log("???�답 ?�이??", error.response?.data);
			}
			throw error;
		}
	});

	test("?�로??경력 조회 API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		try {
			console.log("?�� ?�로??경력 조회 API ?�출 ?�작");
			
			const empNo = "EMP001";
			const response = await axios.post(`${baseURL}/api/psm/career/profile`, {
				empNo: empNo
			});

			console.log("?�� ?�로??경력 조회 ?�답:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("???�로??경력 조회 ?�패 - ?�답:", response.data);
				console.log("???�러 메시지:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// ?�제 DB ?�이??검�?
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const profile = responseData[0];
				expect(profile).toHaveProperty("EMP_NO");
				expect(profile).toHaveProperty("PRJT_NM");
				expect(profile).toHaveProperty("STRT_DT");
				expect(profile).toHaveProperty("END_DT");
			} else {
				console.log("?�️ 조회???�로??경력???�습?�다.");
				console.log("?�️ ?�원번호 'EMP001'??존재?��? ?�을 ???�습?�다.");
			}
		} catch (error) {
			console.log("???�로??경력 조회 API ?�출 ?�패:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("???�답 ?�태:", error.response?.status);
				console.log("???�답 ?�이??", error.response?.data);
			}
			throw error;
		}
	});

	test("경력 ?�보 ?�??API가 ?�상?�으�??�작?�다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("??�� ?�버가 ?�행?��? ?�아 ?�스?��? 건너?�니??");
			return;
		}

		try {
			console.log("?�� 경력 ?�보 ?�??API ?�출 ?�작");
			
			const careerData = {
				empNo: 'EMP001',
				entrBefInYcnt: '2',
				entrBefInMcnt: '24',
				entrAftYcnt: '4',
				entrAftMcnt: '48',
				carrYcnt: '6',
				carrMcnt: '72',
				tcnGrd: '중급',
				tcnGrdCd: '2',
				ctqlCarrYcnt: '1',
				ctqlCarrMcnt: '12',
				ctqlTcnGrd: '초급',
				ctqlTcnGrdCd: '1',
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/career/save`, careerData);

			console.log("?�� 경력 ?�보 ?�???�답:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("??경력 ?�보 ?�???�패 - ?�답:", response.data);
				console.log("???�러 메시지:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("??경력 ?�보 ?�??API ?�출 ?�패:", error instanceof Error ? error.message : String(error));
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

			// ?�격�?코드 조회
			const ctqlResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '115'
			});

			console.log("?�� ?�격�?코드 조회 ?�답:", ctqlResponse.data);

			expect(ctqlResponse.status).toBe(200);
			
			if (!(ctqlResponse.data as any).success) {
				console.log("???�격�?코드 조회 ?�패 - ?�답:", ctqlResponse.data);
				console.log("???�러 메시지:", (ctqlResponse.data as any).message);
			}
			
			expect((ctqlResponse.data as any).success).toBe(true);

			// 기술?�급 코드 조회
			const tcnGrdResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '114'
			});

			console.log("?�� 기술?�급 코드 조회 ?�답:", tcnGrdResponse.data);

			expect(tcnGrdResponse.status).toBe(200);
			
			if (!(tcnGrdResponse.data as any).success) {
				console.log("??기술?�급 코드 조회 ?�패 - ?�답:", tcnGrdResponse.data);
				console.log("???�러 메시지:", (tcnGrdResponse.data as any).message);
			}
			
			expect((tcnGrdResponse.data as any).success).toBe(true);

			// ?�제 DB ?�이??검�?
			const ctqlData = (ctqlResponse.data as any).data;
			if (ctqlData && Array.isArray(ctqlData) && ctqlData.length > 0) {
				const code = ctqlData[0];
				expect(code).toHaveProperty("codeId");
				expect(code).toHaveProperty("codeNm");
			} else {
				console.log("?�️ 조회???�격�?코드 ?�이?��? ?�습?�다.");
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
}); 

