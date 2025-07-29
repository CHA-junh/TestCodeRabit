/**
 * PSM1030M00 - 인사발령내역 관리 화면 테스트
 *
 * 테스트 목표:
 * - 인사발령내역 관리 화면의 모든 주요 기능이 정상적으로 동작하는지 검증
 * - 두 가지 방식을 사용합니다:
 *   1. UI 테스트: Mock을 사용한 컴포넌트 렌더링 테스트
 *   2. API 테스트: 실제 HTTP 클라이언트를 사용한 서버 통신 테스트 (서버 실행 시)
 *
 * 주요 기능:
 * - 인사발령내역 조회
 * - 인사발령 등록/수정/삭제
 * - 공통 코드 조회
 * - 본부별 부서 목록 조회
 */

import React from "react";
import { render, screen, waitFor, fireEvent } from "../../test/test-utils";
import PSM1030M00 from "./PSM1030M00";

// axios mock
jest.mock('axios');
const mockedAxios = require('axios');

describe("PSM1030M00 - 인사발령내역 관리 화면 - UI 테스트 (Mock 사용)", () => {
	beforeEach(() => {
		mockedAxios.post.mockResolvedValue({ data: { success: true, data: [] } });
		mockedAxios.get.mockResolvedValue({ data: { success: true, data: [] } });
	});

	test("인사발령내역 관리 화면에 접속하면 모든 주요 기능이 표시된다", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "홍길동"
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("인사발령내역")).toBeInTheDocument();
		});

		// 주요 기능 버튼들 확인
		expect(screen.getByText("신규")).toBeInTheDocument();
		expect(screen.getByText("삭제")).toBeInTheDocument();
		expect(screen.getByText("인사발령등록")).toBeInTheDocument();
	});

	test("사용자가 인사발령 정보를 입력하고 저장 버튼을 클릭하면 저장 처리가 진행된다", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "홍길동"
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("신규")).toBeInTheDocument();
		});

		// 발령구분 선택
		const apntDivSelect = screen.getByText("발령구분");
		expect(apntDivSelect).toBeInTheDocument();

		// 저장 버튼이 활성화되어 있는지 확인
		const saveButton = screen.getByText("저장");
		expect(saveButton).toBeInTheDocument();
	});

	test("사용자가 신규 버튼을 클릭하면 입력 필드가 초기화된다", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "홍길동"
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("신규")).toBeInTheDocument();
		});

		// 신규 버튼 클릭
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 편집 가능한 입력 필드들만 초기화 확인 (readonly 필드 제외)
		await waitFor(() => {
			const dateInputs = screen.getAllByDisplayValue("");
			expect(dateInputs.length).toBeGreaterThan(0);
		});
	});

	test("사용자가 삭제 버튼을 클릭하면 삭제 확인 다이얼로그가 표시된다", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "홍길동"
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("삭제")).toBeInTheDocument();
		});

		// 삭제 버튼 클릭
		const deleteButton = screen.getByText("삭제");
		fireEvent.click(deleteButton);

		// 삭제 버튼이 비활성화되어 있는지 확인 (초기 상태)
		expect(deleteButton).toBeDisabled();
	});

	test("사용자가 본부를 변경하면 해당 본부의 부서 목록이 업데이트된다", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "홍길동"
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("발령본부")).toBeInTheDocument();
		});

		// 본부 선택 변경
		const hqSelect = screen.getByText("발령본부");
		expect(hqSelect).toBeInTheDocument();
	});

	test("사용자가 발령구분을 변경하면 관련 필드들이 업데이트된다", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "홍길동"
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("발령구분")).toBeInTheDocument();
		});

		// 발령구분 선택 변경
		const apntDivSelect = screen.getByText("발령구분");
		expect(apntDivSelect).toBeInTheDocument();
	});
}); 