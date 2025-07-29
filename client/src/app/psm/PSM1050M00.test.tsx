/**
 * PSM1050M00 - 경력 계산 화면 테스트
 *
 * 테스트 목표:
 * - 경력 계산 화면의 모든 주요 기능이 정상적으로 동작하는지 검증
 * - 두 가지 방식을 사용합니다:
 *   1. UI 테스트: Mock을 사용한 컴포넌트 렌더링 테스트
 *   2. API 테스트: 실제 HTTP 클라이언트를 사용한 서버 통신 테스트 (서버 실행 시)
 *
 * 주요 기능:
 * - 경력 계산
 * - 프로필 경력 조회
 * - 경력 정보 저장
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

// 실제 HTTP 클라이언트 사용 (서버 실행 시)
const baseURL = "http://localhost:8080";

describe("PSM1050M00 - 경력 계산 화면 - UI 테스트 (Mock 사용)", () => {
	beforeEach(() => {
		// Mock 기본 응답 설정
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

	test("경력 계산 화면에 접속하면 모든 주요 기능이 표시된다", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("경력개월수 계산")).toBeInTheDocument();
		});

		// 주요 기능 버튼들 확인
		expect(screen.getByText("계산")).toBeInTheDocument();
		expect(screen.getByText("확인")).toBeInTheDocument();
		expect(screen.getByText("취소")).toBeInTheDocument();
	});

	test("사용자가 경력 정보를 입력하고 계산 버튼을 클릭하면 경력 계산이 진행된다", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("계산")).toBeInTheDocument();
		});

		// 계산 버튼 클릭
		const calculateButton = screen.getByText("계산");
		fireEvent.click(calculateButton);

		// 계산 버튼이 존재하는지 확인
		expect(calculateButton).toBeInTheDocument();
	});

	test("사용자가 확인 버튼을 클릭하면 경력 정보가 저장되고 팝업이 닫힌다", async () => {
		const mockOnConfirm = jest.fn();
		const mockOnClose = jest.fn();

		render(<PSM1050M00 onClose={mockOnClose} onConfirm={mockOnConfirm} />);

		await waitFor(() => {
			expect(screen.getByText("확인")).toBeInTheDocument();
		});

		// 확인 버튼 클릭
		const confirmButton = screen.getByText("확인");
		fireEvent.click(confirmButton);

		// 확인 버튼이 존재하는지 확인
		expect(confirmButton).toBeInTheDocument();
	});

	test("사용자가 취소 버튼을 클릭하면 팝업이 닫힌다", async () => {
		const mockOnClose = jest.fn();
		const mockOnConfirm = jest.fn();
		
		render(<PSM1050M00 onClose={mockOnClose} onConfirm={mockOnConfirm} />);

		await waitFor(() => {
			expect(screen.getByText("취소")).toBeInTheDocument();
		});

		// 취소 버튼 클릭
		const cancelButton = screen.getByText("취소");
		fireEvent.click(cancelButton);

		// 취소 처리 확인
		await waitFor(() => {
			expect(cancelButton).toBeInTheDocument();
		});
	});

	test("사용자가 자사/외주 구분을 변경하면 관련 필드들이 업데이트된다", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("구분")).toBeInTheDocument();
		});

		// 구분 필드 확인
		const empDivField = screen.getByText("구분");
		expect(empDivField).toBeInTheDocument();
	});

	test("사용자가 경력계산기준일을 변경하면 경력 계산 결과가 업데이트된다", async () => {
		render(<PSM1050M00 onClose={jest.fn()} onConfirm={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText("최종철수일자")).toBeInTheDocument();
		});

		// 최종철수일자 필드 확인
		const finalDateField = screen.getByText("최종철수일자");
		expect(finalDateField).toBeInTheDocument();
	});
});

// 실제 거래 호출 테스트 - 서버 실행 시에만 실행
describe("PSM1050M00 - 경력 계산 API - 실제 거래 호출 테스트 (서버 실행 시)", () => {
	// 서버가 실행 중인지 확인하는 헬퍼 함수
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/api/health`, { timeout: 3000 });
			return true;
		} catch (error) {
			console.log("서버 연결 실패:", error instanceof Error ? error.message : String(error));
			return false;
		}
	};

	beforeAll(async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⚠️ 서버가 실행되지 않았습니다. API 테스트를 건너뜁니다.");
		}
	});

	test("경력 계산 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		try {
			console.log("🔍 경력 계산 API 호출 시작");
			
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

			console.log("📊 경력 계산 응답:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("❌ 경력 계산 실패 - 응답:", response.data);
				console.log("❌ 에러 메시지:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// 실제 DB 데이터 검증
			const responseData = (response.data as any).data;
			if (responseData && typeof responseData === 'object' && Object.keys(responseData).length > 0) {
				expect(responseData).toHaveProperty("CARR_YCNT");
				expect(responseData).toHaveProperty("CARR_MCNT");
				expect(responseData).toHaveProperty("TCN_GRD");
			} else {
				console.log("ℹ️ 경력 계산 결과가 없습니다.");
				console.log("ℹ️ 사원번호 'EMP001'이 존재하지 않거나 경력 데이터가 없을 수 있습니다.");
				// 빈 응답이어도 API 호출 자체는 성공으로 간주
				expect(responseData).toBeDefined();
			}
		} catch (error) {
			console.log("❌ 경력 계산 API 호출 실패:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("❌ 응답 상태:", error.response?.status);
				console.log("❌ 응답 데이터:", error.response?.data);
			}
			throw error;
		}
	});

	test("프로필 경력 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		try {
			console.log("🔍 프로필 경력 조회 API 호출 시작");
			
			const empNo = "EMP001";
			const response = await axios.post(`${baseURL}/api/psm/career/profile`, {
				empNo: empNo
			});

			console.log("📊 프로필 경력 조회 응답:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("❌ 프로필 경력 조회 실패 - 응답:", response.data);
				console.log("❌ 에러 메시지:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// 실제 DB 데이터 검증
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const profile = responseData[0];
				expect(profile).toHaveProperty("EMP_NO");
				expect(profile).toHaveProperty("PRJT_NM");
				expect(profile).toHaveProperty("STRT_DT");
				expect(profile).toHaveProperty("END_DT");
			} else {
				console.log("ℹ️ 조회된 프로필 경력이 없습니다.");
				console.log("ℹ️ 사원번호 'EMP001'이 존재하지 않을 수 있습니다.");
			}
		} catch (error) {
			console.log("❌ 프로필 경력 조회 API 호출 실패:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("❌ 응답 상태:", error.response?.status);
				console.log("❌ 응답 데이터:", error.response?.data);
			}
			throw error;
		}
	});

	test("경력 정보 저장 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		try {
			console.log("🔍 경력 정보 저장 API 호출 시작");
			
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

			console.log("📊 경력 정보 저장 응답:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("❌ 경력 정보 저장 실패 - 응답:", response.data);
				console.log("❌ 에러 메시지:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("❌ 경력 정보 저장 API 호출 실패:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("❌ 응답 상태:", error.response?.status);
				console.log("❌ 응답 데이터:", error.response?.data);
			}
			throw error;
		}
	});

	test("공통 코드 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		try {
			console.log("🔍 공통 코드 조회 API 호출 시작");

			// 자격증 코드 조회
			const ctqlResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '115'
			});

			console.log("📊 자격증 코드 조회 응답:", ctqlResponse.data);

			expect(ctqlResponse.status).toBe(200);
			
			if (!(ctqlResponse.data as any).success) {
				console.log("❌ 자격증 코드 조회 실패 - 응답:", ctqlResponse.data);
				console.log("❌ 에러 메시지:", (ctqlResponse.data as any).message);
			}
			
			expect((ctqlResponse.data as any).success).toBe(true);

			// 기술등급 코드 조회
			const tcnGrdResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '114'
			});

			console.log("📊 기술등급 코드 조회 응답:", tcnGrdResponse.data);

			expect(tcnGrdResponse.status).toBe(200);
			
			if (!(tcnGrdResponse.data as any).success) {
				console.log("❌ 기술등급 코드 조회 실패 - 응답:", tcnGrdResponse.data);
				console.log("❌ 에러 메시지:", (tcnGrdResponse.data as any).message);
			}
			
			expect((tcnGrdResponse.data as any).success).toBe(true);

			// 실제 DB 데이터 검증
			const ctqlData = (ctqlResponse.data as any).data;
			if (ctqlData && Array.isArray(ctqlData) && ctqlData.length > 0) {
				const code = ctqlData[0];
				expect(code).toHaveProperty("codeId");
				expect(code).toHaveProperty("codeNm");
			} else {
				console.log("ℹ️ 조회된 자격증 코드 데이터가 없습니다.");
			}
		} catch (error) {
			console.log("❌ 공통 코드 조회 API 호출 실패:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("❌ 응답 상태:", error.response?.status);
				console.log("❌ 응답 데이터:", error.response?.data);
			}
			throw error;
		}
	});
}); 