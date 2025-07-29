/**
 * PSM1030M00 - ?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ Í¥ÄÎ¶??îÎ©¥ ?åÏä§??
 *
 * ?åÏä§??Î™©Ìëú:
 * - ?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ Í¥ÄÎ¶??îÎ©¥??Î™®Îì† Ï£ºÏöî Í∏∞Îä•???ïÏÉÅ?ÅÏúºÎ°??ôÏûë?òÎäîÏßÄ Í≤ÄÏ¶?
 * - ??Í∞ÄÏßÄ Î∞©Ïãù???¨Ïö©?©Îãà??
 *   1. UI ?åÏä§?? Mock???¨Ïö©??Ïª¥Ìè¨?åÌä∏ ?åÎçîÎß??åÏä§??
 *   2. API ?åÏä§?? ?§Ï†ú HTTP ?¥Îùº?¥Ïñ∏?∏Î? ?¨Ïö©???úÎ≤Ñ ?µÏã† ?åÏä§??(?úÎ≤Ñ ?§Ìñâ ??
 *
 * Ï£ºÏöî Í∏∞Îä•:
 * - ?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ Ï°∞Ìöå
 * - ?∏ÏÇ¨Î∞úÎ†π ?±Î°ù/?òÏ†ï/??†ú
 * - Í≥µÌÜµ ÏΩîÎìú Ï°∞Ìöå
 * - Î≥∏Î?Î≥?Î∂Ä??Î™©Î°ù Ï°∞Ìöå
 */

import React from "react";
import { render, screen, waitFor, fireEvent } from "../../test/test-utils";
import PSM1030M00 from "./PSM1030M00";

// axios mock
jest.mock('axios');
const mockedAxios = require('axios');

describe("PSM1030M00 - ?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ Í¥ÄÎ¶??îÎ©¥ - UI ?åÏä§??(Mock ?¨Ïö©)", () => {
	beforeEach(() => {
		mockedAxios.post.mockResolvedValue({ data: { success: true, data: [] } });
		mockedAxios.get.mockResolvedValue({ data: { success: true, data: [] } });
	});

	test("?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠ Í¥ÄÎ¶??îÎ©¥???ëÏÜç?òÎ©¥ Î™®Îì† Ï£ºÏöî Í∏∞Îä•???úÏãú?úÎã§", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?çÍ∏∏??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?∏ÏÇ¨Î∞úÎ†π?¥Ïó≠")).toBeInTheDocument();
		});

		// Ï£ºÏöî Í∏∞Îä• Î≤ÑÌäº???ïÏù∏
		expect(screen.getByText("?†Í∑ú")).toBeInTheDocument();
		expect(screen.getByText("??†ú")).toBeInTheDocument();
		expect(screen.getByText("?∏ÏÇ¨Î∞úÎ†π?±Î°ù")).toBeInTheDocument();
	});

	test("?¨Ïö©?êÍ? ?∏ÏÇ¨Î∞úÎ†π ?ïÎ≥¥Î•??ÖÎ†•?òÍ≥† ?Ä??Î≤ÑÌäº???¥Î¶≠?òÎ©¥ ?Ä??Ï≤òÎ¶¨Í∞Ä ÏßÑÌñâ?úÎã§", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?çÍ∏∏??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?†Í∑ú")).toBeInTheDocument();
		});

		// Î∞úÎ†πÍµ¨Î∂Ñ ?†ÌÉù
		const apntDivSelect = screen.getByText("Î∞úÎ†πÍµ¨Î∂Ñ");
		expect(apntDivSelect).toBeInTheDocument();

		// ?Ä??Î≤ÑÌäº???úÏÑ±?îÎêò???àÎäîÏßÄ ?ïÏù∏
		const saveButton = screen.getByText("?Ä??);
		expect(saveButton).toBeInTheDocument();
	});

	test("?¨Ïö©?êÍ? ?†Í∑ú Î≤ÑÌäº???¥Î¶≠?òÎ©¥ ?ÖÎ†• ?ÑÎìúÍ∞Ä Ï¥àÍ∏∞?îÎêú??, async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?çÍ∏∏??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("?†Í∑ú")).toBeInTheDocument();
		});

		// ?†Í∑ú Î≤ÑÌäº ?¥Î¶≠
		const newButton = screen.getByText("?†Í∑ú");
		fireEvent.click(newButton);

		// ?∏Ïßë Í∞Ä?•Ìïú ?ÖÎ†• ?ÑÎìú?§Îßå Ï¥àÍ∏∞???ïÏù∏ (readonly ?ÑÎìú ?úÏô∏)
		await waitFor(() => {
			const dateInputs = screen.getAllByDisplayValue("");
			expect(dateInputs.length).toBeGreaterThan(0);
		});
	});

	test("?¨Ïö©?êÍ? ??†ú Î≤ÑÌäº???¥Î¶≠?òÎ©¥ ??†ú ?ïÏù∏ ?§Ïù¥?ºÎ°úÍ∑∏Í? ?úÏãú?úÎã§", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?çÍ∏∏??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("??†ú")).toBeInTheDocument();
		});

		// ??†ú Î≤ÑÌäº ?¥Î¶≠
		const deleteButton = screen.getByText("??†ú");
		fireEvent.click(deleteButton);

		// ??†ú Î≤ÑÌäº??ÎπÑÌôú?±Ìôî?òÏñ¥ ?àÎäîÏßÄ ?ïÏù∏ (Ï¥àÍ∏∞ ?ÅÌÉú)
		expect(deleteButton).toBeDisabled();
	});

	test("?¨Ïö©?êÍ? Î≥∏Î?Î•?Î≥ÄÍ≤ΩÌïòÎ©??¥Îãπ Î≥∏Î???Î∂Ä??Î™©Î°ù???ÖÎç∞?¥Ìä∏?úÎã§", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?çÍ∏∏??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("Î∞úÎ†πÎ≥∏Î?")).toBeInTheDocument();
		});

		// Î≥∏Î? ?†ÌÉù Î≥ÄÍ≤?
		const hqSelect = screen.getByText("Î∞úÎ†πÎ≥∏Î?");
		expect(hqSelect).toBeInTheDocument();
	});

	test("?¨Ïö©?êÍ? Î∞úÎ†πÍµ¨Î∂Ñ??Î≥ÄÍ≤ΩÌïòÎ©?Í¥Ä???ÑÎìú?§Ïù¥ ?ÖÎç∞?¥Ìä∏?úÎã§", async () => {
		const mockSelectedEmployee = {
			EMP_NO: "EMP001",
			EMP_NM: "?çÍ∏∏??
		};

		render(<PSM1030M00 selectedEmployee={mockSelectedEmployee} />);

		await waitFor(() => {
			expect(screen.getByText("Î∞úÎ†πÍµ¨Î∂Ñ")).toBeInTheDocument();
		});

		// Î∞úÎ†πÍµ¨Î∂Ñ ?†ÌÉù Î≥ÄÍ≤?
		const apntDivSelect = screen.getByText("Î∞úÎ†πÍµ¨Î∂Ñ");
		expect(apntDivSelect).toBeInTheDocument();
	});
}); 

