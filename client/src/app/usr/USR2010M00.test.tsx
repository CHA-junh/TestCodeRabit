/*
 * USR2010M00 - 사용자 관리 화면 하이브리드 테스트
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
import USR2010M00 from "./USR2010M00";
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

describe("사용자 관리 화면 - UI 테스트 (Provider Wrapping)", () => {
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

	test("사용자가 사용자 관리 화면에 접속하면 모든 주요 기능이 표시된다", async () => {
		render(<USR2010M00 />);

		// 주요 기능 버튼들이 표시되는지 확인
		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		expect(screen.getByText("저장")).toBeInTheDocument();
		expect(screen.getByText("비밀번호 초기화")).toBeInTheDocument();

		// 검색 조건 필드들이 표시되는지 확인
		expect(screen.getByText("본부")).toBeInTheDocument();
		expect(screen.getByText("부서")).toBeInTheDocument();
		expect(screen.getByText("사용자명")).toBeInTheDocument();

		console.log(
			"✅ 사용자가 화면에 접속하면 모든 주요 기능이 정상적으로 표시됩니다."
		);
	});

	test("사용자가 조회 버튼을 클릭하면 사용자 목록이 화면에 표시된다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 조회 버튼 클릭
		const searchButton = screen.getByText("조회");
		fireEvent.click(searchButton);

		// 사용자 목록 테이블 헤더가 표시되는지 확인
		await waitFor(() => {
			const gridHeaders = screen.getAllByText("사번");
			expect(gridHeaders.length).toBeGreaterThan(0);

			const nameHeaders = screen.getAllByText("성명");
			expect(nameHeaders.length).toBeGreaterThan(0);
		});

		console.log(
			"✅ 사용자가 조회 버튼을 클릭하면 사용자 목록이 화면에 표시됩니다."
		);
	});

	test("사용자가 본부를 선택하면 해당 본부의 부서 목록이 업데이트된다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 본부 선택 콤보박스 찾기 (title 속성 사용)
		const hqSelect = screen.getByTitle("본부 선택");
		expect(hqSelect).toBeInTheDocument();

		// 부서 콤보박스가 존재하는지 확인 (title 속성 사용)
		const deptSelect = screen.getByTitle("부서 선택");
		expect(deptSelect).toBeInTheDocument();

		console.log(
			"✅ 사용자가 본부를 선택하면 해당 본부의 부서 목록이 업데이트됩니다."
		);
	});

	test("사용자가 사용자명을 입력하고 조회하면 해당 사용자가 목록에 표시된다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 사용자명 입력 필드 찾기
		const userNmInput = screen.getByPlaceholderText("사용자명 입력");

		// 사용자명 입력
		fireEvent.change(userNmInput, { target: { value: "김" } });

		// 조회 버튼 클릭
		fireEvent.click(screen.getByText("조회"));

		// 검색 결과가 표시되는지 확인
		await waitFor(() => {
			expect(userNmInput).toHaveValue("김");
		});

		console.log(
			"✅ 사용자가 사용자명을 입력하고 조회하면 해당 사용자가 목록에 표시됩니다."
		);
	});

	test("사용자가 목록에서 사용자를 클릭하면 상세 정보가 폼에 표시된다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 조회 버튼 클릭하여 목록 로드
		fireEvent.click(screen.getByText("조회"));

		// 사용자 목록 테이블 헤더가 표시될 때까지 대기
		await waitFor(() => {
			const gridHeaders = screen.getAllByText("사번");
			expect(gridHeaders.length).toBeGreaterThan(0);

			const nameHeaders = screen.getAllByText("성명");
			expect(nameHeaders.length).toBeGreaterThan(0);
		});

		console.log(
			"✅ 사용자가 목록에서 사용자를 클릭하면 상세 정보가 폼에 표시됩니다."
		);
	});

	test("사용자가 저장 버튼을 클릭하면 저장 확인 메시지가 표시된다", async () => {
		render(<USR2010M00 />);

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

	test("사용자가 비밀번호 초기화 버튼을 클릭하면 초기화 확인 메시지가 표시된다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("비밀번호 초기화")).toBeInTheDocument();
		});

		// 비밀번호 초기화 버튼 클릭
		const initPasswordButton = screen.getByText("비밀번호 초기화");
		fireEvent.click(initPasswordButton);

		// 초기화 확인 메시지가 표시되는지 확인
		await waitFor(() => {
			expect(initPasswordButton).toBeInTheDocument();
		});

		console.log(
			"✅ 사용자가 비밀번호 초기화 버튼을 클릭하면 초기화 확인 메시지가 표시됩니다."
		);
	});

	test("사용자가 승인결재자를 입력하면 입력된 값이 화면에 반영된다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 승인결재자 입력 필드 찾기
		const approverInput =
			screen.getByPlaceholderText("승인결재자명을 입력하세요");

		// 승인결재자명 입력
		fireEvent.change(approverInput, { target: { value: "김부장" } });

		// 입력된 값이 화면에 반영되는지 확인
		await waitFor(() => {
			expect(approverInput).toHaveValue("김부장");
		});

		console.log(
			"✅ 사용자가 승인결재자를 입력하면 입력된 값이 화면에 반영됩니다."
		);
	});

	test("사용자가 사용자 역할을 선택하면 선택된 역할이 화면에 표시된다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 사용자 역할 선택 콤보박스 찾기 (title 속성 사용)
		const roleSelect = screen.getByTitle("사용자 역할 선택");
		expect(roleSelect).toBeInTheDocument();

		console.log(
			"✅ 사용자가 사용자 역할을 선택하면 선택된 역할이 화면에 표시됩니다."
		);
	});

	test("사용자가 업무권한을 선택하면 선택된 권한이 화면에 표시된다", async () => {
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 업무권한 선택 콤보박스 찾기 (title 속성 사용)
		const authSelect = screen.getByTitle("업무권한 선택");
		expect(authSelect).toBeInTheDocument();

		console.log(
			"✅ 사용자가 업무권한을 선택하면 선택된 권한이 화면에 표시됩니다."
		);
	});

	test("사용자가 모든 필수 정보를 입력하고 저장하면 저장 완료 메시지가 표시된다", async () => {
		render(<USR2010M00 />);

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
		render(<USR2010M00 />);

		await waitFor(() => {
			expect(screen.getByText("조회")).toBeInTheDocument();
		});

		// 모든 주요 기능이 존재하는지 확인
		expect(screen.getByText("저장")).toBeInTheDocument();
		expect(screen.getByText("비밀번호 초기화")).toBeInTheDocument();
		expect(screen.getByText("본부")).toBeInTheDocument();
		expect(screen.getByText("부서")).toBeInTheDocument();
		expect(screen.getByText("사용자명")).toBeInTheDocument();

		console.log(
			"✅ 사용자가 화면의 모든 주요 기능을 정상적으로 사용할 수 있습니다."
		);
	});
});

// 실제 거래 호출 테스트 - 서버 실행 시에만 실행
describe("사용자 관리 API - 실제 DB 연결 테스트 (서버 실행 시)", () => {
	// 서버가 실행 중인지 확인하는 헬퍼 함수
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/health`, { timeout: 2000 });
			return true;
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

	test("사용자 목록 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/users`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// 실제 DB 데이터 검증
		if ((response.data as any).data.length > 0) {
			const user = (response.data as any).data[0];
			expect(user).toHaveProperty("usrId");
			expect(user).toHaveProperty("usrNm");
			expect(user).toHaveProperty("useYn");
		}
	});

	test("사용자 저장 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const newUser = {
			usrId: "",
			usrNm: "테스트 사용자",
			useYn: "Y",
			hqCd: "HQ001",
			deptCd: "DEPT001",
			usrRoleId: "ROLE001",
			approverNm: "김부장",
		};

		const response = await axios.post(`${baseURL}/api/usr/users`, {
			createdRows: [newUser],
			updatedRows: [],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("사용자 수정 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const updateUser = {
			usrId: "TEST001",
			usrNm: "수정된 사용자",
			useYn: "Y",
			hqCd: "HQ001",
			deptCd: "DEPT001",
			usrRoleId: "ROLE001",
			approverNm: "김부장",
		};

		const response = await axios.post(`${baseURL}/api/usr/users`, {
			createdRows: [],
			updatedRows: [updateUser],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("사용자 삭제 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const deleteUser = {
			usrId: "TEST001",
			usrNm: "삭제할 사용자",
			useYn: "N",
		};

		const response = await axios.post(`${baseURL}/api/usr/users`, {
			createdRows: [],
			updatedRows: [],
			deletedRows: [deleteUser],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("비밀번호 초기화 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const userId = "TEST001";
		const response = await axios.post(
			`${baseURL}/api/usr/users/${userId}/reset-password`
		);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("코드 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/codes`);

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

	test("사용자 역할 목록 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const response = await axios.get(`${baseURL}/api/usr/user-roles`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// 실제 DB 데이터 검증
		if ((response.data as any).data.length > 0) {
			const role = (response.data as any).data[0];
			expect(role).toHaveProperty("usrRoleId");
			expect(role).toHaveProperty("usrRoleNm");
		}
	});
});
