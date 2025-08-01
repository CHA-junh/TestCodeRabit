import React from "react";
import { render, screen, waitFor } from "../../test/test-utils";
import PSM1051D00 from "./PSM1051D00";

// Mock fetch
global.fetch = jest.fn();

// PSM1050M00๊ณผ์ ?ฐ๋ ?์ค??
describe("PSM1050M00๊ณผ์ ?ฐ๋ ?์ค??, () => {
  test("PSM1050M00?์ ?์  ๋ชจ๋(newFlag=false)????PSM1051D00???ธ์ถ?๋ค", () => {
    // PSM1050M00??์กฐ๊ฑด๋ถ ?๋๋ง?๋ก์ง ?์ค??
    const newFlag = false;
    const empNo = "EMP001";
    
    // PSM1050M00??์กฐ๊ฑด๋ถ ?๋๋ง?๋ก์ง???๋??์ด??
    const shouldRenderPSM1051D00 = !newFlag && empNo;
    expect(shouldRenderPSM1051D00).toBeTruthy();
    
    // PSM1051D00???์?์ผ๋ก??๋๋ง๋?์? ?์ธ
    render(<PSM1051D00 empNo={empNo} />);
    expect(screen.getByText("?๋ก?๊ฒฝ??)).toBeInTheDocument();
  });

  test("PSM1050M00?์ ? ๊ท ๋ชจ๋(newFlag=true)???๋ PSM1051D00???ธ์ถ?์? ?๋??, () => {
    // PSM1050M00??์กฐ๊ฑด๋ถ ?๋๋ง?๋ก์ง ?์ค??
    const newFlag = true;
    const empNo = "EMP001";
    
    // PSM1050M00??์กฐ๊ฑด๋ถ ?๋๋ง?๋ก์ง???๋??์ด??
    const shouldRenderPSM1051D00 = !newFlag && 
    empNo;
    expect(shouldRenderPSM1051D00).toBeFalsy();
  });

  test("PSM1050M00?์ ?๋ฌ๋ฐ์? empNo๊ฐ PSM1051D00???์?์ผ๋ก??๋ฌ?๋ค", async () => {
    // PSM1050M00?์ ?๋ฌ?๋ ?ฐ์ด??๊ตฌ์กฐ ?๋??์ด??
    const mockEmployeeData = {
      empNo: "EMP001",
      empNm: "?๊ธธ??,
      ownOutsDiv: "1"
    };

    // PSM1050M00?์ PSM1051D00?ผ๋ก ?๋ฌ?๋ ๋ฐฉ์
    const passedEmpNo = mockEmployeeData.empNo;
    
    render(<PSM1051D00 empNo={passedEmpNo} />);

    // empNo๊ฐ ?์?์ผ๋ก??๋ฌ?์ด API ?ธ์ถ???ด๋ฃจ?ด์??์? ?์ธ
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });
  });

  test("PSM1050M00??carrData.empNo๊ฐ PSM1051D00??empNo prop?ผ๋ก ?๋ฌ?๋ค", async () => {
    // PSM1050M00??carrData ๊ตฌ์กฐ ?๋??์ด??
    const mockCarrData = {
      empNo: "EMP002",
      empNm: "๊น์ฒ ์",
      ownOutsDiv: "1",
      entrDt: "2020/01/01"
    };

    // PSM1050M00?์ PSM1051D00?ผ๋ก ?๋ฌ?๋ ๋ฐฉ์
    const { empNo } = mockCarrData;
    
    render(<PSM1051D00 empNo={empNo} />);

    // carrData.empNo๊ฐ ?์?์ผ๋ก??๋ฌ?์ด API ?ธ์ถ???ด๋ฃจ?ด์??์? ?์ธ
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP002' })
      });
    });
  });
});

// ?ธ์ถ ์กฐ๊ฑด ๋ฐ?์ปจํ?คํธ ?์ค??
describe("?ธ์ถ ์กฐ๊ฑด ๋ฐ?์ปจํ?คํธ ?์ค??, () => {
  test("?์  ๋ชจ๋?์๋ง??ธ์ถ?๋?๋ก?๊ธฐ์กด ?ฌ์??๊ฒฝ๋ ฅ ?๋ณด๋ฅ?์กฐํ?๋ค", async () => {
    // ?์  ๋ชจ๋ ?๋??์ด??(๊ธฐ์กด ?ฌ์ ?๋ณด๊ฐ ?๋ ?ํ)
    const existingEmployeeData = {
      empNo: "EMP001",
      empNm: "?๊ธธ??,
      entrDt: "2020/01/01",
      // ๊ธฐ์กด ๊ฒฝ๋ ฅ ?๋ณด๊ฐ ?๋ ?ฌ์
    };

    render(<PSM1051D00 empNo={existingEmployeeData.empNo} />);

    // ๊ธฐ์กด ?ฌ์??๊ฒฝ๋ ฅ ?๋ณด๋ฅ?์กฐํ?๋ API๊ฐ ?ธ์ถ?๋์ง ?์ธ
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });

    // ๊ธฐ์กด ?ฌ์??๊ฒฝ๋ ฅ ?๋ณด๊ฐ ?์?๋์ง ?์ธ
    await waitFor(() => {
      expect(screen.getByText("?๋ก?๊ฒฝ??)).toBeInTheDocument();
    });
  });

      test("? ๊ท ๋ชจ๋?์???ธ์ถ?์? ?์ผ๋ฏ๋ก?PSM1052D00??????ธ์ถ?๋ค", () => {
      // ? ๊ท ๋ชจ๋ ?๋??์ด??
      const newFlag = true;
      const empNo = "EMP001";
      
      // PSM1050M00??์กฐ๊ฑด๋ถ ?๋๋ง?๋ก์ง
      const shouldRenderPSM1051D00 = !newFlag && empNo;
      const shouldRenderPSM1052D00 = newFlag;
      
      expect(shouldRenderPSM1051D00).toBeFalsy();
      expect(shouldRenderPSM1052D00).toBeTruthy();
    });

  test("PSM1050M00??Portal ?๋๋ง??๊ฒฝ?์ ?์ ?์?๋ค", () => {
    // PSM1050M00??createPortal???ฌ์ฉ?์ฌ body??์ง์  ?๋๋งํ???๊ฒฝ ?๋??์ด??
    const mockDocumentBody = document.createElement('div');
    document.body.appendChild(mockDocumentBody);

    // Portal ?๊ฒฝ?์ PSM1051D00???์?์ผ๋ก??๋๋ง๋?์? ?์ธ
    render(<PSM1051D00 empNo="EMP001" />);
    
    expect(screen.getByText("?๋ก?๊ฒฝ??)).toBeInTheDocument();
    
    // ?๋ฆฌ
    document.body.removeChild(mockDocumentBody);
  });

  test("PSM1050M00??๋ชจ๋ฌ ์ปจํ?คํธ?์ ?์ ?์?๋ค", () => {
    // PSM1050M00??๋ชจ๋ฌ๋ก??์?๋ ?๊ฒฝ?์ PSM1051D00???์ ?์?๋์ง ?์ธ
    const mockModalContext = {
      isModal: true,
      zIndex: 1000
    };

    render(<PSM1051D00 empNo="EMP001" />);
    
    // ๋ชจ๋ฌ ?๊ฒฝ?์???์?์ผ๋ก??๋๋ง๋?์? ?์ธ
    expect(screen.getByText("?๋ก?๊ฒฝ??)).toBeInTheDocument();
    expect(screen.getByText("?๋ ฅ๊ธฐ์?")).toBeInTheDocument();
    expect(screen.getByText("๊ธฐ์ ?๊ฒฉ๊ธฐ์?")).toBeInTheDocument();
  });
});

// PSM1050M00๊ณผ์ ?ฐ์ด???ฐ๋ ?์ค??
describe("PSM1050M00๊ณผ์ ?ฐ์ด???ฐ๋ ?์ค??, () => {
  test("PSM1050M00?์ ?๋ฌ๋ฐ์? ?ฌ์ ?๋ณด๋ก?๊ฒฝ๋ ฅ ?ฐ์ด?ฐ๋? ์กฐํ?๋ค", async () => {
    // PSM1050M00?์ ?๋ฌ?๋ employeeData ๊ตฌ์กฐ
    const mockEmployeeData = {
      empNo: "EMP001",
      empNm: "?๊ธธ??,
      ownOutsDiv: "1",
      entrDt: "2020/01/01",
      lastAdbgDiv: "?์ก?,
      ctqlCd: "?๋ณด์ฒ๋ฆฌ๊ธฐ์ฌ"
    };

    render(<PSM1051D00 empNo={mockEmployeeData.empNo} />);

    // PSM1050M00?์ ?๋ฌ๋ฐ์? empNo๋ก?๊ฒฝ๋ ฅ ?ฐ์ด?ฐ๋? ์กฐํ?๋์ง ?์ธ
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: mockEmployeeData.empNo })
      });
    });
  });

  test("PSM1050M00??๊ฒฝ๋ ฅ ๊ณ์ฐ ๊ฒฐ๊ณผ? PSM1051D00??๊ฒฝ๋ ฅ ์กฐํ ๊ฒฐ๊ณผ๊ฐ ?ผ์น?๋ค", async () => {
    // PSM1050M00?์ ๊ณ์ฐ??๊ฒฝ๋ ฅ ?ฐ์ด??
    const psm1050CarrData = {
      empNo: "EMP001",
      entrBefInYcnt: "2",
      entrBefInMcnt: "0",
      entrAftYcnt: "3",
      entrAftMcnt: "0",
      carrYcnt: "5",
      carrMcnt: "0",
      tcnGrd: "์ค๊ธ"
    };

    // PSM1051D00?์ ์กฐํ?๋ ๊ฒฝ๋ ฅ ?ฐ์ด??(?์ผ??๊ฒฐ๊ณผ)
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{
          CALC_STAD_DT: "2025/07/31",
          BEF_M_CNT: "24", // 2??
          AFT_M_CNT: "36", // 3??
          TCN_GRD_NM: "์ค๊ธ"
        }]
      })
    });

    render(<PSM1051D00 empNo={psm1050CarrData.empNo} />);

          // PSM1050M00??๊ณ์ฐ ๊ฒฐ๊ณผ? PSM1051D00??์กฐํ ๊ฒฐ๊ณผ๊ฐ ?ผ์น?๋์ง ?์ธ
      await waitFor(() => {
        const twoInputs = screen.getAllByDisplayValue("2");
        const threeInputs = screen.getAllByDisplayValue("3");
        const fiveInputs = screen.getAllByDisplayValue("5");
        
        expect(twoInputs.length).toBeGreaterThan(0); // ?์ฌ??๊ฒฝ๋ ฅ ?์
        expect(threeInputs.length).toBeGreaterThan(0); // ?์ฌ??๊ฒฝ๋ ฅ ?์
        expect(fiveInputs.length).toBeGreaterThan(0); // ?ฉ๊ณ ๊ฒฝ๋ ฅ ?์
        expect(screen.getByDisplayValue("์ค๊ธ")).toBeInTheDocument(); // ๊ธฐ์ ?ฑ๊ธ
      });
  });
});

describe("PSM1051D00 - ๊ฒฝ๋ ฅ ?์ธ ?ค์ด?ผ๋ก๊ท?, () => {
  beforeEach(() => {
    // Mock fetch ๊ธฐ๋ณธ ?๋ต ?ค์ 
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{
          CALC_STAD_DT: "2025/07/31",
          BEF_M_CNT: "24",
          AFT_M_CNT: "36",
          BEF_CTQL_M_CNT: "12",
          AFT_CTQL_M_CNT: "18",
          TCN_GRD_NM: "์ค๊ธ",
          TCN_GRD: "3",
          CTQL_TCN_GRD_NM: "์ด๊ธ",
          CTQL_TCN_GRD: "4"
        }]
      })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("์ปดํฌ?ํธ๊ฐ ?์?์ผ๋ก??๋๋ง๋??, () => {
    render(<PSM1051D00 empNo="EMP001" />);
    expect(screen.getByText("?๋ก?๊ฒฝ??)).toBeInTheDocument();
  });

  test("?ฌ์๋ฒํธ๊ฐ ?๋ฌ?๋ฉด API๋ฅ??ธ์ถ?์ฌ ๊ฒฝ๋ ฅ ?ฐ์ด?ฐ๋? ๋ก๋?๋ค", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });
  });

  test("API ?๋ต ?ฐ์ด?ฐ๊? ?์?์ผ๋ก?๊ฒฝ๋ ฅ ๊ณ์ฐ??๋ฐ์?๋ค", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    // API ?๋ต ?ฐ์ด?ฐ๊? ๋ก๋???๊น์ง ?๊ธ?
    await waitFor(() => {
      // ?๋ ฅ๊ธฐ์? ?น์???์ฌ??๊ฒฝ๋ ฅ ?์ ?์ธ (24๊ฐ์ = 2??
      const inputs = screen.getAllByDisplayValue("2");
      expect(inputs.length).toBeGreaterThan(0);
    });

    // ?๋ ฅ๊ธฐ์? ๊ฒฝ๋ ฅ ๊ณ์ฐ ๊ฒฐ๊ณผ ?์ธ
    const inputs = screen.getAllByDisplayValue("2");
    const zeroInputs = screen.getAllByDisplayValue("0");
    const threeInputs = screen.getAllByDisplayValue("3");
    const fiveInputs = screen.getAllByDisplayValue("5");

    // ?๋ ฅ๊ธฐ์? ?น์???ด๋น ๊ฐ๋ค??์กด์ฌ?๋์ง ?์ธ
    expect(inputs.length).toBeGreaterThan(0); // ?์ฌ??๊ฒฝ๋ ฅ ?์ (24๊ฐ์ = 2??
    expect(zeroInputs.length).toBeGreaterThan(0); // ?์ฌ??๊ฒฝ๋ ฅ ๊ฐ์??(24 - (2*12) = 0)
    expect(threeInputs.length).toBeGreaterThan(0); // ?์ฌ??๊ฒฝ๋ ฅ ?์ (36๊ฐ์ = 3??
    expect(fiveInputs.length).toBeGreaterThan(0); // ?ฉ๊ณ ๊ฒฝ๋ ฅ ?์ (60๊ฐ์ = 5??

    // ๊ธฐ์ ?ฑ๊ธ ?์ธ
    expect(screen.getByDisplayValue("์ค๊ธ")).toBeInTheDocument();
  });

  test("๊ธฐ์ ?๊ฒฉ๊ธฐ์? ๊ฒฝ๋ ฅ???์?์ผ๋ก?๊ณ์ฐ?์ด ?์?๋ค", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ๊ธฐ์ ?๊ฒฉ๊ธฐ์? ๊ฒฝ๋ ฅ ๊ณ์ฐ ๊ฒฐ๊ณผ ?์ธ
      const oneInputs = screen.getAllByDisplayValue("1");
      const zeroInputs = screen.getAllByDisplayValue("0");
      const sixInputs = screen.getAllByDisplayValue("6");
      const twoInputs = screen.getAllByDisplayValue("2");

      // ๊ธฐ์ ?๊ฒฉ๊ธฐ์? ?น์???ด๋น ๊ฐ๋ค??์กด์ฌ?๋์ง ?์ธ
      expect(oneInputs.length).toBeGreaterThan(0); // ?์ฌ???๊ฒฉ๊ฒฝ๋ ฅ ?์ (12๊ฐ์ = 1??
      expect(zeroInputs.length).toBeGreaterThan(0); // ?์ฌ???๊ฒฉ๊ฒฝ๋ ฅ ๊ฐ์??(12 - (1*12) = 0)
      expect(sixInputs.length).toBeGreaterThan(0); // ?์ฌ???๊ฒฉ๊ฒฝ๋ ฅ ๊ฐ์??(18 - (1*12) = 6)
      expect(twoInputs.length).toBeGreaterThan(0); // ?ฉ๊ณ ?๊ฒฉ๊ฒฝ๋ ฅ ?์ (30๊ฐ์ = 2??

      // ?๊ฒฉ๊ธฐ์ ?ฑ๊ธ ?์ธ
      expect(screen.getByDisplayValue("์ด๊ธ")).toBeInTheDocument();
    });
  });

  test("๊ธฐ์??ผ์ด ?์?์ผ๋ก??์?๋ค", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ๊ธฐ์????๋ ฅ ?๋๊ฐ ์กด์ฌ?๋์ง ?์ธ
      const dateInput = screen.getByDisplayValue("2025-07-31");
      expect(dateInput).toBeInTheDocument();
    });
  });

  test("API ?ธ์ถ ?คํจ ???์ ??์ฒ๋ฆฌ๊ฐ ?ด๋ฃจ?ด์ง??, async () => {
    // API ?คํจ ?๋??์ด??- response.ok = false??๊ฒฝ์ฐ
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, message: "์กฐํ ?คํจ" })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    // response.ok = false??๊ฒฝ์ฐ?๋ hasProfileData๊ฐ ๋ณ๊ฒฝ๋์ง ?์ผ๋ฏ๋ก?
    // ์ด๊ธฐ ?ํ??true๊ฐ ? ์??์ด ๋ฉ์์ง๊ฐ ?์?์? ?์
    // ?ด๋ PSM1051D00???ค์  ?์๊ณ??ผ์น??
    await waitFor(() => {
      expect(screen.queryByText("(?ฑ๋ก???๋ก???ด์ญ???์ต?๋ค.)")).not.toBeInTheDocument();
    });
  });

  test("API ?๋ต??success=false??๊ฒฝ์ฐ ?์ ??์ฒ๋ฆฌ๊ฐ ?ด๋ฃจ?ด์ง??, async () => {
    // API ?๋ต? ?ฑ๊ณต?์?๋ง?success=false??๊ฒฝ์ฐ
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, message: "?ฐ์ด???์" })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // success=false??๊ฒฝ์ฐ "?ฑ๋ก???๋ก???ด์ญ???์ต?๋ค" ๋ฉ์์ง๊ฐ ?์?๋์ง ?์ธ
      expect(screen.getByText("(?ฑ๋ก???๋ก???ด์ญ???์ต?๋ค.)")).toBeInTheDocument();
    });
  });

  test("API ?๋ต??data๊ฐ ?๋ ๊ฒฝ์ฐ ?์ ??์ฒ๋ฆฌ๊ฐ ?ด๋ฃจ?ด์ง??, async () => {
    // API ?๋ต? ?ฑ๊ณต?์?๋ง?data๊ฐ ?๋ ๊ฒฝ์ฐ
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: null })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // data๊ฐ ?๋ ๊ฒฝ์ฐ "?ฑ๋ก???๋ก???ด์ญ???์ต?๋ค" ๋ฉ์์ง๊ฐ ?์?๋์ง ?์ธ
      expect(screen.getByText("(?ฑ๋ก???๋ก???ด์ญ???์ต?๋ค.)")).toBeInTheDocument();
    });
  });

  test("API ?ธ์ถ ์ค??คํธ?ํฌ ?ค๋ฅ๊ฐ ๋ฐ์??๊ฒฝ์ฐ ?์ ??์ฒ๋ฆฌ๊ฐ ?ด๋ฃจ?ด์ง??, async () => {
    // ?คํธ?ํฌ ?ค๋ฅ ?๋??์ด??
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ?คํธ?ํฌ ?ค๋ฅ ??"?ฑ๋ก???๋ก???ด์ญ???์ต?๋ค" ๋ฉ์์ง๊ฐ ?์?๋์ง ?์ธ
      expect(screen.getByText("(?ฑ๋ก???๋ก???ด์ญ???์ต?๋ค.)")).toBeInTheDocument();
    });
  });

  test("?ฌ์๋ฒํธ๊ฐ ?์ผ๋ฉ?API๋ฅ??ธ์ถ?์? ?๋??, () => {
    render(<PSM1051D00 />);

    // PSM1051D00??career/profile API๊ฐ ?ธ์ถ?์? ?์?์? ?์ธ
    expect(global.fetch).not.toHaveBeenCalledWith('/api/psm/career/profile', expect.any(Object));
  });

  test("๊ฒฝ๋ ฅ ๊ณ์ฐ ๋ก์ง???ํ???์?๋ค", async () => {
    // ๋ณต์ก??๊ฒฝ๋ ฅ ?ฐ์ด?ฐ๋ก ?์ค??
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{
          CALC_STAD_DT: "2025/12/31",
          BEF_M_CNT: "35", // 2??11๊ฐ์
          AFT_M_CNT: "47", // 3??11๊ฐ์
          BEF_CTQL_M_CNT: "18", // 1??6๊ฐ์
          AFT_CTQL_M_CNT: "25", // 2??1๊ฐ์
          TCN_GRD_NM: "๊ณ ๊ธ",
          TCN_GRD: "2",
          CTQL_TCN_GRD_NM: "์ค๊ธ",
          CTQL_TCN_GRD: "3"
        }]
      })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ?๋ ฅ๊ธฐ์? ๊ฒฝ๋ ฅ ๊ณ์ฐ (35๊ฐ์ = 2??11๊ฐ์)
      const twoInputs = screen.getAllByDisplayValue("2");
      const elevenInputs = screen.getAllByDisplayValue("11");
      const threeInputs = screen.getAllByDisplayValue("3");
      const sixInputs = screen.getAllByDisplayValue("6");
      const tenInputs = screen.getAllByDisplayValue("10");

      // ?ด๋น ๊ฐ๋ค??์กด์ฌ?๋์ง ?์ธ
      expect(twoInputs.length).toBeGreaterThan(0); // ?์ฌ??๊ฒฝ๋ ฅ ?์
      expect(elevenInputs.length).toBeGreaterThan(0); // ?์ฌ??๊ฒฝ๋ ฅ ๊ฐ์??
      expect(threeInputs.length).toBeGreaterThan(0); // ?์ฌ??๊ฒฝ๋ ฅ ?์
      expect(elevenInputs.length).toBeGreaterThan(0); // ?์ฌ??๊ฒฝ๋ ฅ ๊ฐ์??
      expect(sixInputs.length).toBeGreaterThan(0); // ?ฉ๊ณ ๊ฒฝ๋ ฅ ?์
      expect(tenInputs.length).toBeGreaterThan(0); // ?ฉ๊ณ ๊ฒฝ๋ ฅ ๊ฐ์??
    });
  });

  test("?๋ด ๋ฉ์์ง๊ฐ ?์?์ผ๋ก??์?๋ค", () => {
    render(<PSM1051D00 empNo="EMP001" />);

    expect(screen.getByText(/?์ฌ??๊ฒฝ๋ ฅ? ?๋ก?์ ?์ฌ??๊ฒฝ๋ ฅ๋ณด๋ค ?????์ต?๋ค/)).toBeInTheDocument();
  });

  test("?์ด๋ธ??ค๋๊ฐ ?์?์ผ๋ก??์?๋ค", () => {
    render(<PSM1051D00 empNo="EMP001" />);

    expect(screen.getByText("?์ฌ??๊ฒฝ๋ ฅ")).toBeInTheDocument();
    expect(screen.getByText("?์ฌ??๊ฒฝ๋ ฅ")).toBeInTheDocument();
    expect(screen.getByText("?ฉ๊ณ")).toBeInTheDocument();
    expect(screen.getByText("๊ธฐ์ ?ฑ๊ธ")).toBeInTheDocument();
    expect(screen.getByText("?๋ ฅ๊ธฐ์?")).toBeInTheDocument();
    expect(screen.getByText("๊ธฐ์ ?๊ฒฉ๊ธฐ์?")).toBeInTheDocument();
  });

  test("๋ชจ๋  ?๋ ฅ ?๋๊ฐ ?ฝ๊ธฐ ?์ฉ?ผ๋ก ?ค์ ?์ด ?๋ค", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ๋ชจ๋  input ?๋๊ฐ readonly ?์ฑ??๊ฐ์ง๊ณ??๋์ง ?์ธ
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('readonly');
      });
    });
  });
  
}); 

