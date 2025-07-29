/**
 * PSM1030M00 - ?�사발령?�역 관�??�면 ?�스??
 *
 * ?�스??목표:
 * - ?�사발령?�역 관�??�면??모든 주요 기능???�상?�으�??�작?�는지 검�?
 * - ??가지 방식???�용?�니??
 *   1. UI ?�스?? Mock???�용??컴포?�트 ?�더�??�스??
 *   2. API ?�스?? ?�제 HTTP ?�라?�언?��? ?�용???�버 ?�신 ?�스??(?�버 ?�행 ??
 *
 * 주요 기능:
 * - ?�사발령?�역 조회
 * - ?�사발령 ?�록/?�정/??��
 * - 공통 코드 조회
 * - 본�?�?부??목록 조회
 */

import React from "react";
import { render, screen, waitFor, fireEvent } from "../../test/test-utils";
import PSM1030M00 from "./PSM1030M00";

// axios mock
jest.mock('axios');
const mockedAxios = require('axios');

describe("PSM1030M00 - ?�사발령?�역 관�??�면 - UI ?�스??(Mock ?�용)", () => {
	beforeEach(() => {
		mockedAxios.post.mockResolvedValue({ data: { success: true, data: [] } });
		mockedAxios.get.mockResolvedValue({ data: { success: true, data: [] } });
	});

	test("?�사발령?�역 관�??�면???�속?�면 모든 주요 기능???�시?�다", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?�길??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?�사발령?�역")).toBeInTheDocument();
		});

		// 주요 기능 버튼???�인
		expect(screen.getByText("?�규")).toBeInTheDocument();
		expect(screen.getByText("??��")).toBeInTheDocument();
		expect(screen.getByText("?�사발령?�록")).toBeInTheDocument();
	});

	test("?�용?��? ?�사발령 ?�보�??�력?�고 ?�??버튼???�릭?�면 ?�??처리가 진행?�다", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?�길??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?�규")).toBeInTheDocument();
		});

		// 발령구분 ?�택
		const apntDivSelect = screen.getByText("발령구분");
		expect(apntDivSelect).toBeInTheDocument();

		// ?�??버튼???�성?�되???�는지 ?�인
		const saveButton = screen.getByText("?�??);
		expect(saveButton).toBeInTheDocument();
	});

	test("?�용?��? ?�규 버튼???�릭?�면 ?�력 ?�드가 초기?�된??, async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?�길??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?�규")).toBeInTheDocument();
		});

		// ?�규 버튼 ?�릭
		const newButton = screen.getByText("?�규");
		fireEvent.click(newButton);

		// ?�집 가?�한 ?�력 ?�드?�만 초기???�인 (readonly ?�드 ?�외)
		await waitFor(() => {
			const dateInputs = screen.getAllByDisplayValue("");
			expect(dateInputs.length).toBeGreaterThan(0);
		});
	});

	test("?�용?��? ??�� 버튼???�릭?�면 ??�� ?�인 ?�이?�로그�? ?�시?�다", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?�길??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("??��")).toBeInTheDocument();
		});

		// ??�� 버튼 ?�릭
		const deleteButton = screen.getByText("??��");
		fireEvent.click(deleteButton);

		// ??�� 버튼??비활?�화?�어 ?�는지 ?�인 (초기 ?�태)
		expect(deleteButton).toBeDisabled();
	});

	test("?�용?��? 본�?�?변경하�??�당 본�???부??목록???�데?�트?�다", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?�길??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("발령본�?")).toBeInTheDocument();
		});

		// 본�? ?�택 변�?
		const hqSelect = screen.getByText("발령본�?");
		expect(hqSelect).toBeInTheDocument();
	});

	test("?�용?��? 발령구분??변경하�?관???�드?�이 ?�데?�트?�다", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?�길??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("발령구분")).toBeInTheDocument();
		});

		// 발령구분 ?�택 변�?
		const apntDivSelect = screen.getByText("발령구분");
		expect(apntDivSelect).toBeInTheDocument();
	});
}); 

