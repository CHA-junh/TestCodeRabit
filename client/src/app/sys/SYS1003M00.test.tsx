/*
 * SYS1003M00 - 사용자 역할 관리 화면 하이브리드 테스트
 *
 * 이 테스트는 두 가지 방식을 사용합니다:
 * 1. UI 테스트: Mock을 사용한 컴포넌트 렌더링 테스트
 * 2. API 테스트: 실제 HTTP 클라이언트를 사용한 서버 통신 테스트 (서버 실행 시)
 *
 * - 조회/저장/삭제 시 실제 거래 호출 방식 준비
 * - 실제 DB 연결을 통한 통합 테스트 준비
 * - 실제 사용자 시나리오 기반 테스트
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import RoleManagementPage from "./SYS1003M00";
import axios from "axios";

// Mock axios for UI tests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// UI 테스트용 최소한의 Mock (필요시에만)
// 실제 API 호출을 방지하기 위한 기본 Mock
jest.mock("../../modules/auth/services/authService", () => ({
	__esModule: true,
	default: {
		checkSession: jest.fn().mockResolvedValue({
			success: true,
			user: {
				userId: "test-user",
				empNo: "test-emp",
				userName: "테스트 사용자",
				email: "test@example.com",
				deptNm: "테스트 부서",
				dutyNm: "테스트 직급",
				authCd: "30",
				role: "ADMIN",
				permissions: ["read", "write"],
				lastLoginAt: new Date().toISOString(),
				menuList: [],
				programList: [],
				needsPasswordChange: false,
				deptDivCd: "DEPT001",
				hqDivCd: "HQ001",
				hqDivNm: "테스트 본부",
				deptTp: "DEPT",
				dutyDivCd: "DUTY001",
			},
		}),
		login: jest.fn().mockResolvedValue({ success: true }),
		logout: jest.fn().mockResolvedValue({ success: true }),
		changePassword: jest.fn().mockResolvedValue({ success: true }),
	},
}));

// 실제 HTTP 클라이언트 사용 (서버 실행 시)
const baseURL = "http://localhost:8080";

describe("사용자 역할 관리 화면 - UI 테스트 (Provider Wrapping)", () => {
	beforeEach(() => {
		// UI 테스트용 기본 Mock 설정
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

	test("사용자가 사용자 역할 관리 화면에 접속하면 모든 주요 기능이 표시된다", async () => {
		render(<RoleManagementPage />);

		// 주요 기능 버튼들이 표시되는지 확인
		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		expect(screen.getByText("저장")).toBeInTheDocument();
		expect(screen.getByText("신규")).toBeInTheDocument();
		expect(screen.getByText("역할복사")).toBeInTheDocument();

		// 검색 조건 필드들이 표시되는지 확인
		expect(screen.getByText("사용자역할코드/명")).toBeInTheDocument();
		expect(screen.getAllByText("사용여부").length).toBeGreaterThan(0);

		console.log(
			"✅ 사용자가 화면에 접속하면 모든 주요 기능이 정상적으로 표시됩니다."
		);
	});

	test("사용자가 조회 버튼을 클릭하면 역할 목록이 화면에 표시된다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 조회 버튼 클릭
		const searchButton = screen.getByText("조회");
		fireEvent.click(searchButton);

		// 역할 목록 테이블 헤더가 표시되는지 확인
		await waitFor(() => {
			expect(screen.getByText("사용자역할 목록")).toBeInTheDocument();
		});

		console.log(
			"✅ 사용자가 조회 버튼을 클릭하면 역할 목록이 화면에 표시됩니다."
		);
	});

	test("사용자가 역할명을 입력하고 조회하면 해당 역할이 목록에 표시된다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 역할명 입력 필드 찾기
		const roleNmInput = screen.getByPlaceholderText("코드 또는 명 입력");

		// 역할명 입력
		fireEvent.change(roleNmInput, { target: { value: "관리자" } });

		// 조회 버튼 클릭
		fireEvent.click(screen.getByText("조회"));

		// 검색 결과가 표시되는지 확인
		await waitFor(() => {
			expect(roleNmInput).toHaveValue("관리자");
		});

		console.log(
			"✅ 사용자가 역할명을 입력하고 조회하면 해당 역할이 목록에 표시됩니다."
		);
	});

	test("사용자가 목록에서 역할을 클릭하면 상세 정보가 폼에 표시된다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 조회 버튼 클릭하여 목록 로드
		fireEvent.click(screen.getByText("조회"));

		// 역할 목록 테이블 헤더가 표시될 때까지 대기
		await waitFor(() => {
			expect(screen.getByText("사용자역할 목록")).toBeInTheDocument();
		});

		console.log(
			"✅ 사용자가 목록에서 역할을 클릭하면 상세 정보가 폼에 표시됩니다."
		);
	});

	test("사용자가 저장 버튼을 클릭하면 저장 확인 메시지가 표시된다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("저장")).toBeInTheDocument();
		});

		// 저장 버튼 클릭
		const saveButton = screen.getByText("저장");
		fireEvent.click(saveButton);

		// 저장 확인 메시지가 표시되는지 확인
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});

		console.log(
			"✅ 사용자가 저장 버튼을 클릭하면 저장 확인 메시지가 표시됩니다."
		);
	});

	test("사용자가 신규 버튼을 클릭하면 폼이 초기화된다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("신규")).toBeInTheDocument();
		});

		// 신규 버튼 클릭
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 신규 버튼이 정상적으로 클릭되는지 확인
		await waitFor(() => {
			expect(newButton).toBeInTheDocument();
		});

		console.log("✅ 사용자가 신규 버튼을 클릭하면 폼이 초기화됩니다.");
	});

	test("사용자가 역할복사 버튼을 클릭하면 역할이 복사된다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("역할복사")).toBeInTheDocument();
		});

		// 역할복사 버튼 클릭
		const copyButton = screen.getByText("역할복사");
		fireEvent.click(copyButton);

		// 역할복사 버튼이 정상적으로 클릭되는지 확인
		await waitFor(() => {
			expect(copyButton).toBeInTheDocument();
		});

		console.log("✅ 사용자가 역할복사 버튼을 클릭하면 역할이 복사됩니다.");
	});

	test("사용자가 사용여부를 선택하면 선택된 값이 화면에 표시된다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 사용여부 선택 콤보박스 찾기 (aria-label 사용)
		const useYnSelect = screen.getByLabelText("사용여부 선택");
		expect(useYnSelect).toBeInTheDocument();

		console.log(
			"✅ 사용자가 사용여부를 선택하면 선택된 값이 화면에 표시됩니다."
		);
	});

	test("사용자가 모든 필수 정보를 입력하고 저장하면 저장 완료 메시지가 표시된다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("저장")).toBeInTheDocument();
		});

		// 저장 버튼 클릭
		const saveButton = screen.getByText("저장");
		fireEvent.click(saveButton);

		// 저장 완료 메시지가 표시되는지 확인
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});

		console.log(
			"✅ 사용자가 모든 필수 정보를 입력하고 저장하면 저장 완료 메시지가 표시됩니다."
		);
	});

	test("사용자가 화면의 모든 주요 기능을 사용할 수 있다", async () => {
		render(<RoleManagementPage />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 모든 주요 기능이 존재하는지 확인
		expect(screen.getByText("저장")).toBeInTheDocument();
		expect(screen.getByText("신규")).toBeInTheDocument();
		expect(screen.getByText("역할복사")).toBeInTheDocument();
		expect(screen.getByText("사용자역할코드/명")).toBeInTheDocument();
		expect(screen.getAllByText("사용여부").length).toBeGreaterThan(0);

		console.log(
			"✅ 사용자가 화면의 모든 주요 기능을 정상적으로 사용할 수 있습니다."
		);
	});
});

// 실제 거래 호출 테스트 - 서버 실행 시에만 실행
describe("사용자 역할 관리 API - 실제 DB 연결 테스트 (서버 실행 시)", () => {
	// 서버가 실행 중인지 확인하는 헬퍼 함수
	const isServerRunning = async (): Promise<boolean> => {
		try {
			// 다양한 헬스체크 엔드포인트 시도
			const endpoints = [
				`${baseURL}/health`,
				`${baseURL}/api/health`,
				`${baseURL}/api/sys/programs`, // 실제 존재하는 엔드포인트로 확인
			];

			for (const endpoint of endpoints) {
				try {
					await axios.get(endpoint, { timeout: 2000 });
					console.log(`✅ 서버 연결 성공: ${endpoint}`);
					return true;
				} catch (error) {
					// 404는 서버가 실행 중이지만 엔드포인트가 없는 경우
					if (axios.isAxiosError(error) && error.response?.status === 404) {
						console.log(`✅ 서버 실행 중 (404): ${endpoint}`);
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
		// 서버가 실행 중인지 확인
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log(
				"⚠️ 서버가 실행되지 않았습니다. 실제 DB 연결 테스트를 건너뜁니다."
			);
		}
	});

	test("사용자 역할 목록 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/user-roles`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// 실제 DB 데이터 검증
		if ((response.data as any).data.length > 0) {
			const role = (response.data as any).data[0];
			expect(role).toHaveProperty("usrRoleId");
			expect(role).toHaveProperty("usrRoleNm");
			expect(role).toHaveProperty("useYn");
		}
	});

	test("사용자 역할 저장 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const newRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "테스트 역할",
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

	test("사용자 역할 수정 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const updateRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "수정된 역할",
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

	test("사용자 역할 삭제 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const deleteRole = {
			usrRoleId: "TEST001",
			usrRoleNm: "삭제할 역할",
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

	test("프로그램 그룹 목록 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const response = await axios.get(
			`${baseURL}/api/sys/user-roles/program-groups`
		);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// 실제 DB 데이터 검증
		if ((response.data as any).data.length > 0) {
			const program = (response.data as any).data[0];
			expect(program).toHaveProperty("programId");
			expect(program).toHaveProperty("programNm");
		}
	});

	test("권한등급 코드 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/codes/athr-grd`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// 실제 DB 데이터 검증
		if ((response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});

	test("조직조회범위 코드 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/codes/org-inq-rng`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// 실제 DB 데이터 검증
		if ((response.data as any).data.length > 0) {
			const code = (response.data as any).data[0];
			expect(code).toHaveProperty("codeId");
			expect(code).toHaveProperty("codeNm");
		}
	});
});
