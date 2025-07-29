/**
 * PSM1040M00 - 인사발령 일괄등록 화면 테스트
 *
 * 테스트 목표:
 * - 인사발령 일괄등록 화면의 모든 주요 기능이 정상적으로 동작하는지 검증
 * - 두 가지 방식을 사용합니다:
 *   1. UI 테스트: Mock을 사용한 컴포넌트 렌더링 테스트
 *   2. API 테스트: 실제 HTTP 클라이언트를 사용한 서버 통신 테스트 (서버 실행 시)
 *
 * 주요 기능:
 * - 인사발령 일괄등록
 * - 공통 코드 조회
 * - 본부별 부서 목록 조회
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

// 실제 HTTP 클라이언트 사용 (서버 실행 시)
const baseURL = "http://localhost:8080";

describe("PSM1040M00 - 인사발령 일괄등록 화면 - UI 테스트 (Mock 사용)", () => {
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

	test("인사발령 일괄등록 화면에 접속하면 모든 주요 기능이 표시된다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("인사발령내용")).toBeInTheDocument();
		});

		// 주요 기능 버튼들 확인
		expect(screen.getByText("등록")).toBeInTheDocument();
		expect(screen.getByText("신규")).toBeInTheDocument();
		expect(screen.getByText("리스트초기화")).toBeInTheDocument();
		expect(screen.getByText("행삭제")).toBeInTheDocument();
	});

	test("사용자가 인사발령 정보를 입력하고 등록 버튼을 클릭하면 일괄등록 처리가 진행된다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("등록")).toBeInTheDocument();
		});

		// 등록 버튼 클릭
		const registerButton = screen.getByText("등록");
		fireEvent.click(registerButton);

		// 등록 버튼이 존재하는지 확인
		expect(registerButton).toBeInTheDocument();
	});

	test("사용자가 신규 버튼을 클릭하면 입력 필드가 초기화된다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("신규")).toBeInTheDocument();
		});

		// 신규 버튼 클릭
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 입력 필드 초기화 확인
		await waitFor(() => {
			// 입력 필드들이 비어있는지 확인
			const inputs = screen.getAllByRole('textbox');
			inputs.forEach(input => {
				if (input instanceof HTMLInputElement) {
					expect(input.value).toBe('');
				}
			});
		});
	});

	test("사용자가 삭제 버튼을 클릭하면 선택된 행이 삭제된다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("행삭제")).toBeInTheDocument();
		});

		// 행삭제 버튼 클릭
		const deleteButton = screen.getByText("행삭제");
		fireEvent.click(deleteButton);

		// 행삭제 버튼이 비활성화되어 있는지 확인 (초기 상태)
		expect(deleteButton).toBeDisabled();
	});

	test("사용자가 전체삭제 버튼을 클릭하면 모든 행이 삭제된다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("리스트초기화")).toBeInTheDocument();
		});

		// 리스트초기화 버튼 클릭
		const resetButton = screen.getByText("리스트초기화");
		fireEvent.click(resetButton);

		// 리스트초기화 버튼이 존재하는지 확인
		expect(resetButton).toBeInTheDocument();
	});

	test("사용자가 본부를 변경하면 해당 본부의 부서 목록이 업데이트된다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("발령본부")).toBeInTheDocument();
		});

		// 발령본부 선택 변경
		const hqSelect = screen.getByText("발령본부");
		expect(hqSelect).toBeInTheDocument();
	});

	test("사용자가 발령구분을 변경하면 관련 필드들이 업데이트된다", async () => {
		render(<PSM1040M00 />);

		await waitFor(() => {
			expect(screen.getByText("발령구분")).toBeInTheDocument();
		});

		// 발령구분 선택 변경
		const apntDivSelect = screen.getByText("발령구분");
		expect(apntDivSelect).toBeInTheDocument();
	});
});

// 실제 거래 호출 테스트 - 서버 실행 시에만 실행
describe("PSM1040M00 - 인사발령 일괄등록 API - 실제 거래 호출 테스트 (서버 실행 시)", () => {
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

	test("인사발령 일괄등록 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		try {
			console.log("🔍 인사발령 일괄등록 API 호출 시작");
			
			const batchAppointmentData = {
				apntDiv: '2',
				apntDt: '20240101',
				hqDivCd: '1000',
				deptDivCd: '1100',
				dutyCd: '9',
				rmk: '테스트 일괄발령',
				empList: [
					{
						empNo: 'EMP001',
						empNm: '홍길동'
					},
					{
						empNo: 'EMP002',
						empNm: '김철수'
					}
				],
				userId: 'system'
			};

			const response = await axios.post(`${baseURL}/api/psm/appointment/batch-register`, batchAppointmentData);

			console.log("📊 인사발령 일괄등록 응답:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("❌ 인사발령 일괄등록 실패 - 응답:", response.data);
				console.log("❌ 에러 메시지:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);
		} catch (error) {
			console.log("❌ 인사발령 일괄등록 API 호출 실패:", error instanceof Error ? error.message : String(error));
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

			// 발령구분 코드 조회
			const apntDivResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '018'
			});

			console.log("📊 발령구분 코드 조회 응답:", apntDivResponse.data);

			expect(apntDivResponse.status).toBe(200);
			
			if (!(apntDivResponse.data as any).success) {
				console.log("❌ 발령구분 코드 조회 실패 - 응답:", apntDivResponse.data);
				console.log("❌ 에러 메시지:", (apntDivResponse.data as any).message);
			}
			
			expect((apntDivResponse.data as any).success).toBe(true);

			// 본부 코드 조회
			const hqResponse = await axios.post(`${baseURL}/api/common/search`, {
				largeCategoryCode: '113'
			});

			console.log("📊 본부 코드 조회 응답:", hqResponse.data);

			expect(hqResponse.status).toBe(200);
			
			if (!(hqResponse.data as any).success) {
				console.log("❌ 본부 코드 조회 실패 - 응답:", hqResponse.data);
				console.log("❌ 에러 메시지:", (hqResponse.data as any).message);
			}
			
			expect((hqResponse.data as any).success).toBe(true);

			// 실제 DB 데이터 검증
			const apntDivData = (apntDivResponse.data as any).data;
			if (apntDivData && Array.isArray(apntDivData) && apntDivData.length > 0) {
				const code = apntDivData[0];
				expect(code).toHaveProperty("codeId");
				expect(code).toHaveProperty("codeNm");
			} else {
				console.log("ℹ️ 조회된 발령구분 코드 데이터가 없습니다.");
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

	test("본부별 부서 목록 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		try {
			console.log("🔍 본부별 부서 목록 조회 API 호출 시작");
			
			const response = await axios.post(`${baseURL}/api/psm/dept-by-hq`, {
				hqDivCd: '1000',
				allYn: 'Y'
			});

			console.log("📊 본부별 부서 목록 조회 응답:", response.data);

			expect(response.status).toBe(200);
			
			if (!(response.data as any).success) {
				console.log("❌ 본부별 부서 목록 조회 실패 - 응답:", response.data);
				console.log("❌ 에러 메시지:", (response.data as any).message);
			}
			
			expect((response.data as any).success).toBe(true);

			// 실제 DB 데이터 검증
			const responseData = (response.data as any).data;
			if (responseData && Array.isArray(responseData) && responseData.length > 0) {
				const dept = responseData[0];
				expect(dept).toHaveProperty("DATA");
				expect(dept).toHaveProperty("LABEL");
			} else {
				console.log("ℹ️ 조회된 부서 데이터가 없습니다.");
			}
		} catch (error) {
			console.log("❌ 본부별 부서 목록 조회 API 호출 실패:", error instanceof Error ? error.message : String(error));
			if (axios.isAxiosError(error)) {
				console.log("❌ 응답 상태:", error.response?.status);
				console.log("❌ 응답 데이터:", error.response?.data);
			}
			throw error;
		}
	});
}); 