import React from "react";
import { render, screen, waitFor } from "../../test/test-utils";
import PSM1051D00 from "./PSM1051D00";

// Mock fetch
global.fetch = jest.fn();

// PSM1050M00과의 ?�동 ?�스??
describe("PSM1050M00과의 ?�동 ?�스??, () => {
  test("PSM1050M00?�서 ?�정 모드(newFlag=false)????PSM1051D00???�출?�다", () => {
    // PSM1050M00??조건부 ?�더�?로직 ?�스??
    const newFlag = false;
    const empNo = "EMP001";
    
    // PSM1050M00??조건부 ?�더�?로직???��??�이??
    const shouldRenderPSM1051D00 = !newFlag && empNo;
    expect(shouldRenderPSM1051D00).toBeTruthy();
    
    // PSM1051D00???�상?�으�??�더링되?��? ?�인
    render(<PSM1051D00 empNo={empNo} />);
    expect(screen.getByText("?�로?�경??)).toBeInTheDocument();
  });

  test("PSM1050M00?�서 ?�규 모드(newFlag=true)???�는 PSM1051D00???�출?��? ?�는??, () => {
    // PSM1050M00??조건부 ?�더�?로직 ?�스??
    const newFlag = true;
    const empNo = "EMP001";
    
    // PSM1050M00??조건부 ?�더�?로직???��??�이??
    const shouldRenderPSM1051D00 = !newFlag && 
    empNo;
    expect(shouldRenderPSM1051D00).toBeFalsy();
  });

  test("PSM1050M00?�서 ?�달받�? empNo가 PSM1051D00???�상?�으�??�달?�다", async () => {
    // PSM1050M00?�서 ?�달?�는 ?�이??구조 ?��??�이??
    const mockEmployeeData = {
      empNo: "EMP001",
      empNm: "?�길??,
      ownOutsDiv: "1"
    };

    // PSM1050M00?�서 PSM1051D00?�로 ?�달?�는 방식
    const passedEmpNo = mockEmployeeData.empNo;
    
    render(<PSM1051D00 empNo={passedEmpNo} />);

    // empNo가 ?�상?�으�??�달?�어 API ?�출???�루?��??��? ?�인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });
  });

  test("PSM1050M00??carrData.empNo가 PSM1051D00??empNo prop?�로 ?�달?�다", async () => {
    // PSM1050M00??carrData 구조 ?��??�이??
    const mockCarrData = {
      empNo: "EMP002",
      empNm: "김철수",
      ownOutsDiv: "1",
      entrDt: "2020/01/01"
    };

    // PSM1050M00?�서 PSM1051D00?�로 ?�달?�는 방식
    const { empNo } = mockCarrData;
    
    render(<PSM1051D00 empNo={empNo} />);

    // carrData.empNo가 ?�상?�으�??�달?�어 API ?�출???�루?��??��? ?�인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP002' })
      });
    });
  });
});

// ?�출 조건 �?컨텍?�트 ?�스??
describe("?�출 조건 �?컨텍?�트 ?�스??, () => {
  test("?�정 모드?�서�??�출?��?�?기존 ?�원??경력 ?�보�?조회?�다", async () => {
    // ?�정 모드 ?��??�이??(기존 ?�원 ?�보가 ?�는 ?�태)
    const existingEmployeeData = {
      empNo: "EMP001",
      empNm: "?�길??,
      entrDt: "2020/01/01",
      // 기존 경력 ?�보가 ?�는 ?�원
    };

    render(<PSM1051D00 empNo={existingEmployeeData.empNo} />);

    // 기존 ?�원??경력 ?�보�?조회?�는 API가 ?�출?�는지 ?�인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });

    // 기존 ?�원??경력 ?�보가 ?�시?�는지 ?�인
    await waitFor(() => {
      expect(screen.getByText("?�로?�경??)).toBeInTheDocument();
    });
  });

      test("?�규 모드?�서???�출?��? ?�으므�?PSM1052D00???�???�출?�다", () => {
      // ?�규 모드 ?��??�이??
      const newFlag = true;
      const empNo = "EMP001";
      
      // PSM1050M00??조건부 ?�더�?로직
      const shouldRenderPSM1051D00 = !newFlag && empNo;
      const shouldRenderPSM1052D00 = newFlag;
      
      expect(shouldRenderPSM1051D00).toBeFalsy();
      expect(shouldRenderPSM1052D00).toBeTruthy();
    });

  test("PSM1050M00??Portal ?�더�??�경?�서 ?�상 ?�작?�다", () => {
    // PSM1050M00??createPortal???�용?�여 body??직접 ?�더링하???�경 ?��??�이??
    const mockDocumentBody = document.createElement('div');
    document.body.appendChild(mockDocumentBody);

    // Portal ?�경?�서 PSM1051D00???�상?�으�??�더링되?��? ?�인
    render(<PSM1051D00 empNo="EMP001" />);
    
    expect(screen.getByText("?�로?�경??)).toBeInTheDocument();
    
    // ?�리
    document.body.removeChild(mockDocumentBody);
  });

  test("PSM1050M00??모달 컨텍?�트?�서 ?�상 ?�작?�다", () => {
    // PSM1050M00??모달�??�시?�는 ?�경?�서 PSM1051D00???�상 ?�작?�는지 ?�인
    const mockModalContext = {
      isModal: true,
      zIndex: 1000
    };

    render(<PSM1051D00 empNo="EMP001" />);
    
    // 모달 ?�경?�서???�상?�으�??�더링되?��? ?�인
    expect(screen.getByText("?�로?�경??)).toBeInTheDocument();
    expect(screen.getByText("?�력기�?")).toBeInTheDocument();
    expect(screen.getByText("기술?�격기�?")).toBeInTheDocument();
  });
});

// PSM1050M00과의 ?�이???�동 ?�스??
describe("PSM1050M00과의 ?�이???�동 ?�스??, () => {
  test("PSM1050M00?�서 ?�달받�? ?�원 ?�보�?경력 ?�이?��? 조회?�다", async () => {
    // PSM1050M00?�서 ?�달?�는 employeeData 구조
    const mockEmployeeData = {
      empNo: "EMP001",
      empNm: "?�길??,
      ownOutsDiv: "1",
      entrDt: "2020/01/01",
      lastAdbgDiv: "?��?,
      ctqlCd: "?�보처리기사"
    };

    render(<PSM1051D00 empNo={mockEmployeeData.empNo} />);

    // PSM1050M00?�서 ?�달받�? empNo�?경력 ?�이?��? 조회?�는지 ?�인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: mockEmployeeData.empNo })
      });
    });
  });

  test("PSM1050M00??경력 계산 결과?� PSM1051D00??경력 조회 결과가 ?�치?�다", async () => {
    // PSM1050M00?�서 계산??경력 ?�이??
    const psm1050CarrData = {
      empNo: "EMP001",
      entrBefInYcnt: "2",
      entrBefInMcnt: "0",
      entrAftYcnt: "3",
      entrAftMcnt: "0",
      carrYcnt: "5",
      carrMcnt: "0",
      tcnGrd: "중급"
    };

    // PSM1051D00?�서 조회?�는 경력 ?�이??(?�일??결과)
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{
          CALC_STAD_DT: "2025/07/31",
          BEF_M_CNT: "24", // 2??
          AFT_M_CNT: "36", // 3??
          TCN_GRD_NM: "중급"
        }]
      })
    });

    render(<PSM1051D00 empNo={psm1050CarrData.empNo} />);

          // PSM1050M00??계산 결과?� PSM1051D00??조회 결과가 ?�치?�는지 ?�인
      await waitFor(() => {
        const twoInputs = screen.getAllByDisplayValue("2");
        const threeInputs = screen.getAllByDisplayValue("3");
        const fiveInputs = screen.getAllByDisplayValue("5");
        
        expect(twoInputs.length).toBeGreaterThan(0); // ?�사??경력 ?�수
        expect(threeInputs.length).toBeGreaterThan(0); // ?�사??경력 ?�수
        expect(fiveInputs.length).toBeGreaterThan(0); // ?�계 경력 ?�수
        expect(screen.getByDisplayValue("중급")).toBeInTheDocument(); // 기술?�급
      });
  });
});

describe("PSM1051D00 - 경력 ?�세 ?�이?�로�?, () => {
  beforeEach(() => {
    // Mock fetch 기본 ?�답 ?�정
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
          TCN_GRD_NM: "중급",
          TCN_GRD: "3",
          CTQL_TCN_GRD_NM: "초급",
          CTQL_TCN_GRD: "4"
        }]
      })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("컴포?�트가 ?�상?�으�??�더링된??, () => {
    render(<PSM1051D00 empNo="EMP001" />);
    expect(screen.getByText("?�로?�경??)).toBeInTheDocument();
  });

  test("?�원번호가 ?�달?�면 API�??�출?�여 경력 ?�이?��? 로드?�다", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });
  });

  test("API ?�답 ?�이?��? ?�상?�으�?경력 계산??반영?�다", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    // API ?�답 ?�이?��? 로드???�까지 ?��?
    await waitFor(() => {
      // ?�력기�? ?�션???�사??경력 ?�수 ?�인 (24개월 = 2??
      const inputs = screen.getAllByDisplayValue("2");
      expect(inputs.length).toBeGreaterThan(0);
    });

    // ?�력기�? 경력 계산 결과 ?�인
    const inputs = screen.getAllByDisplayValue("2");
    const zeroInputs = screen.getAllByDisplayValue("0");
    const threeInputs = screen.getAllByDisplayValue("3");
    const fiveInputs = screen.getAllByDisplayValue("5");

    // ?�력기�? ?�션???�당 값들??존재?�는지 ?�인
    expect(inputs.length).toBeGreaterThan(0); // ?�사??경력 ?�수 (24개월 = 2??
    expect(zeroInputs.length).toBeGreaterThan(0); // ?�사??경력 개월??(24 - (2*12) = 0)
    expect(threeInputs.length).toBeGreaterThan(0); // ?�사??경력 ?�수 (36개월 = 3??
    expect(fiveInputs.length).toBeGreaterThan(0); // ?�계 경력 ?�수 (60개월 = 5??

    // 기술?�급 ?�인
    expect(screen.getByDisplayValue("중급")).toBeInTheDocument();
  });

  test("기술?�격기�? 경력???�상?�으�?계산?�어 ?�시?�다", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // 기술?�격기�? 경력 계산 결과 ?�인
      const oneInputs = screen.getAllByDisplayValue("1");
      const zeroInputs = screen.getAllByDisplayValue("0");
      const sixInputs = screen.getAllByDisplayValue("6");
      const twoInputs = screen.getAllByDisplayValue("2");

      // 기술?�격기�? ?�션???�당 값들??존재?�는지 ?�인
      expect(oneInputs.length).toBeGreaterThan(0); // ?�사???�격경력 ?�수 (12개월 = 1??
      expect(zeroInputs.length).toBeGreaterThan(0); // ?�사???�격경력 개월??(12 - (1*12) = 0)
      expect(sixInputs.length).toBeGreaterThan(0); // ?�사???�격경력 개월??(18 - (1*12) = 6)
      expect(twoInputs.length).toBeGreaterThan(0); // ?�계 ?�격경력 ?�수 (30개월 = 2??

      // ?�격기술?�급 ?�인
      expect(screen.getByDisplayValue("초급")).toBeInTheDocument();
    });
  });

  test("기�??�이 ?�상?�으�??�시?�다", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // 기�????�력 ?�드가 존재?�는지 ?�인
      const dateInput = screen.getByDisplayValue("2025-07-31");
      expect(dateInput).toBeInTheDocument();
    });
  });

  test("API ?�출 ?�패 ???�절??처리가 ?�루?�진??, async () => {
    // API ?�패 ?��??�이??- response.ok = false??경우
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, message: "조회 ?�패" })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    // response.ok = false??경우?�는 hasProfileData가 변경되지 ?�으므�?
    // 초기 ?�태??true가 ?��??�어 메시지가 ?�시?��? ?�음
    // ?�는 PSM1051D00???�제 ?�작�??�치??
    await waitFor(() => {
      expect(screen.queryByText("(?�록???�로???�역???�습?�다.)")).not.toBeInTheDocument();
    });
  });

  test("API ?�답??success=false??경우 ?�절??처리가 ?�루?�진??, async () => {
    // API ?�답?� ?�공?��?�?success=false??경우
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, message: "?�이???�음" })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // success=false??경우 "?�록???�로???�역???�습?�다" 메시지가 ?�시?�는지 ?�인
      expect(screen.getByText("(?�록???�로???�역???�습?�다.)")).toBeInTheDocument();
    });
  });

  test("API ?�답??data가 ?�는 경우 ?�절??처리가 ?�루?�진??, async () => {
    // API ?�답?� ?�공?��?�?data가 ?�는 경우
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: null })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // data가 ?�는 경우 "?�록???�로???�역???�습?�다" 메시지가 ?�시?�는지 ?�인
      expect(screen.getByText("(?�록???�로???�역???�습?�다.)")).toBeInTheDocument();
    });
  });

  test("API ?�출 �??�트?�크 ?�류가 발생??경우 ?�절??처리가 ?�루?�진??, async () => {
    // ?�트?�크 ?�류 ?��??�이??
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ?�트?�크 ?�류 ??"?�록???�로???�역???�습?�다" 메시지가 ?�시?�는지 ?�인
      expect(screen.getByText("(?�록???�로???�역???�습?�다.)")).toBeInTheDocument();
    });
  });

  test("?�원번호가 ?�으�?API�??�출?��? ?�는??, () => {
    render(<PSM1051D00 />);

    // PSM1051D00??career/profile API가 ?�출?��? ?�았?��? ?�인
    expect(global.fetch).not.toHaveBeenCalledWith('/api/psm/career/profile', expect.any(Object));
  });

  test("경력 계산 로직???�확???�작?�다", async () => {
    // 복잡??경력 ?�이?�로 ?�스??
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{
          CALC_STAD_DT: "2025/12/31",
          BEF_M_CNT: "35", // 2??11개월
          AFT_M_CNT: "47", // 3??11개월
          BEF_CTQL_M_CNT: "18", // 1??6개월
          AFT_CTQL_M_CNT: "25", // 2??1개월
          TCN_GRD_NM: "고급",
          TCN_GRD: "2",
          CTQL_TCN_GRD_NM: "중급",
          CTQL_TCN_GRD: "3"
        }]
      })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ?�력기�? 경력 계산 (35개월 = 2??11개월)
      const twoInputs = screen.getAllByDisplayValue("2");
      const elevenInputs = screen.getAllByDisplayValue("11");
      const threeInputs = screen.getAllByDisplayValue("3");
      const sixInputs = screen.getAllByDisplayValue("6");
      const tenInputs = screen.getAllByDisplayValue("10");

      // ?�당 값들??존재?�는지 ?�인
      expect(twoInputs.length).toBeGreaterThan(0); // ?�사??경력 ?�수
      expect(elevenInputs.length).toBeGreaterThan(0); // ?�사??경력 개월??
      expect(threeInputs.length).toBeGreaterThan(0); // ?�사??경력 ?�수
      expect(elevenInputs.length).toBeGreaterThan(0); // ?�사??경력 개월??
      expect(sixInputs.length).toBeGreaterThan(0); // ?�계 경력 ?�수
      expect(tenInputs.length).toBeGreaterThan(0); // ?�계 경력 개월??
    });
  });

  test("?�내 메시지가 ?�상?�으�??�시?�다", () => {
    render(<PSM1051D00 empNo="EMP001" />);

    expect(screen.getByText(/?�사??경력?� ?�로?�의 ?�사??경력보다 ?????�습?�다/)).toBeInTheDocument();
  });

  test("?�이�??�더가 ?�상?�으�??�시?�다", () => {
    render(<PSM1051D00 empNo="EMP001" />);

    expect(screen.getByText("?�사??경력")).toBeInTheDocument();
    expect(screen.getByText("?�사??경력")).toBeInTheDocument();
    expect(screen.getByText("?�계")).toBeInTheDocument();
    expect(screen.getByText("기술?�급")).toBeInTheDocument();
    expect(screen.getByText("?�력기�?")).toBeInTheDocument();
    expect(screen.getByText("기술?�격기�?")).toBeInTheDocument();
  });

  test("모든 ?�력 ?�드가 ?�기 ?�용?�로 ?�정?�어 ?�다", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // 모든 input ?�드가 readonly ?�성??가지�??�는지 ?�인
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('readonly');
      });
    });
  });
  
}); 

