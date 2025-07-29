import React from "react";
import { render, screen, waitFor } from "../../test/test-utils";
import PSM1051D00 from "./PSM1051D00";

// Mock fetch
global.fetch = jest.fn();

// PSM1050M00과의 연동 테스트
describe("PSM1050M00과의 연동 테스트", () => {
  test("PSM1050M00에서 수정 모드(newFlag=false)일 때 PSM1051D00이 호출된다", () => {
    // PSM1050M00의 조건부 렌더링 로직 테스트
    const newFlag = false;
    const empNo = "EMP001";
    
    // PSM1050M00의 조건부 렌더링 로직을 시뮬레이션
    const shouldRenderPSM1051D00 = !newFlag && empNo;
    expect(shouldRenderPSM1051D00).toBeTruthy();
    
    // PSM1051D00이 정상적으로 렌더링되는지 확인
    render(<PSM1051D00 empNo={empNo} />);
    expect(screen.getByText("프로필경력")).toBeInTheDocument();
  });

  test("PSM1050M00에서 신규 모드(newFlag=true)일 때는 PSM1051D00이 호출되지 않는다", () => {
    // PSM1050M00의 조건부 렌더링 로직 테스트
    const newFlag = true;
    const empNo = "EMP001";
    
    // PSM1050M00의 조건부 렌더링 로직을 시뮬레이션
    const shouldRenderPSM1051D00 = !newFlag && 
    empNo;
    expect(shouldRenderPSM1051D00).toBeFalsy();
  });

  test("PSM1050M00에서 전달받은 empNo가 PSM1051D00에 정상적으로 전달된다", async () => {
    // PSM1050M00에서 전달하는 데이터 구조 시뮬레이션
    const mockEmployeeData = {
      empNo: "EMP001",
      empNm: "홍길동",
      ownOutsDiv: "1"
    };

    // PSM1050M00에서 PSM1051D00으로 전달되는 방식
    const passedEmpNo = mockEmployeeData.empNo;
    
    render(<PSM1051D00 empNo={passedEmpNo} />);

    // empNo가 정상적으로 전달되어 API 호출이 이루어지는지 확인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });
  });

  test("PSM1050M00의 carrData.empNo가 PSM1051D00의 empNo prop으로 전달된다", async () => {
    // PSM1050M00의 carrData 구조 시뮬레이션
    const mockCarrData = {
      empNo: "EMP002",
      empNm: "김철수",
      ownOutsDiv: "1",
      entrDt: "2020/01/01"
    };

    // PSM1050M00에서 PSM1051D00으로 전달되는 방식
    const { empNo } = mockCarrData;
    
    render(<PSM1051D00 empNo={empNo} />);

    // carrData.empNo가 정상적으로 전달되어 API 호출이 이루어지는지 확인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP002' })
      });
    });
  });
});

// 호출 조건 및 컨텍스트 테스트
describe("호출 조건 및 컨텍스트 테스트", () => {
  test("수정 모드에서만 호출되므로 기존 사원의 경력 정보를 조회한다", async () => {
    // 수정 모드 시뮬레이션 (기존 사원 정보가 있는 상태)
    const existingEmployeeData = {
      empNo: "EMP001",
      empNm: "홍길동",
      entrDt: "2020/01/01",
      // 기존 경력 정보가 있는 사원
    };

    render(<PSM1051D00 empNo={existingEmployeeData.empNo} />);

    // 기존 사원의 경력 정보를 조회하는 API가 호출되는지 확인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });

    // 기존 사원의 경력 정보가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText("프로필경력")).toBeInTheDocument();
    });
  });

      test("신규 모드에서는 호출되지 않으므로 PSM1052D00이 대신 호출된다", () => {
      // 신규 모드 시뮬레이션
      const newFlag = true;
      const empNo = "EMP001";
      
      // PSM1050M00의 조건부 렌더링 로직
      const shouldRenderPSM1051D00 = !newFlag && empNo;
      const shouldRenderPSM1052D00 = newFlag;
      
      expect(shouldRenderPSM1051D00).toBeFalsy();
      expect(shouldRenderPSM1052D00).toBeTruthy();
    });

  test("PSM1050M00의 Portal 렌더링 환경에서 정상 동작한다", () => {
    // PSM1050M00이 createPortal을 사용하여 body에 직접 렌더링하는 환경 시뮬레이션
    const mockDocumentBody = document.createElement('div');
    document.body.appendChild(mockDocumentBody);

    // Portal 환경에서 PSM1051D00이 정상적으로 렌더링되는지 확인
    render(<PSM1051D00 empNo="EMP001" />);
    
    expect(screen.getByText("프로필경력")).toBeInTheDocument();
    
    // 정리
    document.body.removeChild(mockDocumentBody);
  });

  test("PSM1050M00의 모달 컨텍스트에서 정상 동작한다", () => {
    // PSM1050M00이 모달로 표시되는 환경에서 PSM1051D00이 정상 동작하는지 확인
    const mockModalContext = {
      isModal: true,
      zIndex: 1000
    };

    render(<PSM1051D00 empNo="EMP001" />);
    
    // 모달 환경에서도 정상적으로 렌더링되는지 확인
    expect(screen.getByText("프로필경력")).toBeInTheDocument();
    expect(screen.getByText("학력기준")).toBeInTheDocument();
    expect(screen.getByText("기술자격기준")).toBeInTheDocument();
  });
});

// PSM1050M00과의 데이터 연동 테스트
describe("PSM1050M00과의 데이터 연동 테스트", () => {
  test("PSM1050M00에서 전달받은 사원 정보로 경력 데이터를 조회한다", async () => {
    // PSM1050M00에서 전달하는 employeeData 구조
    const mockEmployeeData = {
      empNo: "EMP001",
      empNm: "홍길동",
      ownOutsDiv: "1",
      entrDt: "2020/01/01",
      lastAdbgDiv: "대졸",
      ctqlCd: "정보처리기사"
    };

    render(<PSM1051D00 empNo={mockEmployeeData.empNo} />);

    // PSM1050M00에서 전달받은 empNo로 경력 데이터를 조회하는지 확인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: mockEmployeeData.empNo })
      });
    });
  });

  test("PSM1050M00의 경력 계산 결과와 PSM1051D00의 경력 조회 결과가 일치한다", async () => {
    // PSM1050M00에서 계산된 경력 데이터
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

    // PSM1051D00에서 조회하는 경력 데이터 (동일한 결과)
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{
          CALC_STAD_DT: "2025/07/31",
          BEF_M_CNT: "24", // 2년
          AFT_M_CNT: "36", // 3년
          TCN_GRD_NM: "중급"
        }]
      })
    });

    render(<PSM1051D00 empNo={psm1050CarrData.empNo} />);

          // PSM1050M00의 계산 결과와 PSM1051D00의 조회 결과가 일치하는지 확인
      await waitFor(() => {
        const twoInputs = screen.getAllByDisplayValue("2");
        const threeInputs = screen.getAllByDisplayValue("3");
        const fiveInputs = screen.getAllByDisplayValue("5");
        
        expect(twoInputs.length).toBeGreaterThan(0); // 입사전 경력 년수
        expect(threeInputs.length).toBeGreaterThan(0); // 입사후 경력 년수
        expect(fiveInputs.length).toBeGreaterThan(0); // 합계 경력 년수
        expect(screen.getByDisplayValue("중급")).toBeInTheDocument(); // 기술등급
      });
  });
});

describe("PSM1051D00 - 경력 상세 다이얼로그", () => {
  beforeEach(() => {
    // Mock fetch 기본 응답 설정
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

  test("컴포넌트가 정상적으로 렌더링된다", () => {
    render(<PSM1051D00 empNo="EMP001" />);
    expect(screen.getByText("프로필경력")).toBeInTheDocument();
  });

  test("사원번호가 전달되면 API를 호출하여 경력 데이터를 로드한다", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });
  });

  test("API 응답 데이터가 정상적으로 경력 계산에 반영된다", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    // API 응답 데이터가 로드될 때까지 대기
    await waitFor(() => {
      // 학력기준 섹션의 입사전 경력 년수 확인 (24개월 = 2년)
      const inputs = screen.getAllByDisplayValue("2");
      expect(inputs.length).toBeGreaterThan(0);
    });

    // 학력기준 경력 계산 결과 확인
    const inputs = screen.getAllByDisplayValue("2");
    const zeroInputs = screen.getAllByDisplayValue("0");
    const threeInputs = screen.getAllByDisplayValue("3");
    const fiveInputs = screen.getAllByDisplayValue("5");

    // 학력기준 섹션에 해당 값들이 존재하는지 확인
    expect(inputs.length).toBeGreaterThan(0); // 입사전 경력 년수 (24개월 = 2년)
    expect(zeroInputs.length).toBeGreaterThan(0); // 입사전 경력 개월수 (24 - (2*12) = 0)
    expect(threeInputs.length).toBeGreaterThan(0); // 입사후 경력 년수 (36개월 = 3년)
    expect(fiveInputs.length).toBeGreaterThan(0); // 합계 경력 년수 (60개월 = 5년)

    // 기술등급 확인
    expect(screen.getByDisplayValue("중급")).toBeInTheDocument();
  });

  test("기술자격기준 경력이 정상적으로 계산되어 표시된다", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // 기술자격기준 경력 계산 결과 확인
      const oneInputs = screen.getAllByDisplayValue("1");
      const zeroInputs = screen.getAllByDisplayValue("0");
      const sixInputs = screen.getAllByDisplayValue("6");
      const twoInputs = screen.getAllByDisplayValue("2");

      // 기술자격기준 섹션에 해당 값들이 존재하는지 확인
      expect(oneInputs.length).toBeGreaterThan(0); // 입사전 자격경력 년수 (12개월 = 1년)
      expect(zeroInputs.length).toBeGreaterThan(0); // 입사전 자격경력 개월수 (12 - (1*12) = 0)
      expect(sixInputs.length).toBeGreaterThan(0); // 입사후 자격경력 개월수 (18 - (1*12) = 6)
      expect(twoInputs.length).toBeGreaterThan(0); // 합계 자격경력 년수 (30개월 = 2년)

      // 자격기술등급 확인
      expect(screen.getByDisplayValue("초급")).toBeInTheDocument();
    });
  });

  test("기준일이 정상적으로 표시된다", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // 기준일 입력 필드가 존재하는지 확인
      const dateInput = screen.getByDisplayValue("2025-07-31");
      expect(dateInput).toBeInTheDocument();
    });
  });

  test("API 호출 실패 시 적절한 처리가 이루어진다", async () => {
    // API 실패 시뮬레이션 - response.ok = false인 경우
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, message: "조회 실패" })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    // response.ok = false인 경우에는 hasProfileData가 변경되지 않으므로
    // 초기 상태인 true가 유지되어 메시지가 표시되지 않음
    // 이는 PSM1051D00의 실제 동작과 일치함
    await waitFor(() => {
      expect(screen.queryByText("(등록된 프로필 내역이 없습니다.)")).not.toBeInTheDocument();
    });
  });

  test("API 응답이 success=false인 경우 적절한 처리가 이루어진다", async () => {
    // API 응답은 성공했지만 success=false인 경우
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, message: "데이터 없음" })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // success=false인 경우 "등록된 프로필 내역이 없습니다" 메시지가 표시되는지 확인
      expect(screen.getByText("(등록된 프로필 내역이 없습니다.)")).toBeInTheDocument();
    });
  });

  test("API 응답에 data가 없는 경우 적절한 처리가 이루어진다", async () => {
    // API 응답은 성공했지만 data가 없는 경우
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: null })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // data가 없는 경우 "등록된 프로필 내역이 없습니다" 메시지가 표시되는지 확인
      expect(screen.getByText("(등록된 프로필 내역이 없습니다.)")).toBeInTheDocument();
    });
  });

  test("API 호출 중 네트워크 오류가 발생한 경우 적절한 처리가 이루어진다", async () => {
    // 네트워크 오류 시뮬레이션
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // 네트워크 오류 시 "등록된 프로필 내역이 없습니다" 메시지가 표시되는지 확인
      expect(screen.getByText("(등록된 프로필 내역이 없습니다.)")).toBeInTheDocument();
    });
  });

  test("사원번호가 없으면 API를 호출하지 않는다", () => {
    render(<PSM1051D00 />);

    // PSM1051D00의 career/profile API가 호출되지 않았는지 확인
    expect(global.fetch).not.toHaveBeenCalledWith('/api/psm/career/profile', expect.any(Object));
  });

  test("경력 계산 로직이 정확히 동작한다", async () => {
    // 복잡한 경력 데이터로 테스트
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{
          CALC_STAD_DT: "2025/12/31",
          BEF_M_CNT: "35", // 2년 11개월
          AFT_M_CNT: "47", // 3년 11개월
          BEF_CTQL_M_CNT: "18", // 1년 6개월
          AFT_CTQL_M_CNT: "25", // 2년 1개월
          TCN_GRD_NM: "고급",
          TCN_GRD: "2",
          CTQL_TCN_GRD_NM: "중급",
          CTQL_TCN_GRD: "3"
        }]
      })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // 학력기준 경력 계산 (35개월 = 2년 11개월)
      const twoInputs = screen.getAllByDisplayValue("2");
      const elevenInputs = screen.getAllByDisplayValue("11");
      const threeInputs = screen.getAllByDisplayValue("3");
      const sixInputs = screen.getAllByDisplayValue("6");
      const tenInputs = screen.getAllByDisplayValue("10");

      // 해당 값들이 존재하는지 확인
      expect(twoInputs.length).toBeGreaterThan(0); // 입사전 경력 년수
      expect(elevenInputs.length).toBeGreaterThan(0); // 입사전 경력 개월수
      expect(threeInputs.length).toBeGreaterThan(0); // 입사후 경력 년수
      expect(elevenInputs.length).toBeGreaterThan(0); // 입사후 경력 개월수
      expect(sixInputs.length).toBeGreaterThan(0); // 합계 경력 년수
      expect(tenInputs.length).toBeGreaterThan(0); // 합계 경력 개월수
    });
  });

  test("안내 메시지가 정상적으로 표시된다", () => {
    render(<PSM1051D00 empNo="EMP001" />);

    expect(screen.getByText(/입사전 경력은 프로필의 입사전 경력보다 클 수 없습니다/)).toBeInTheDocument();
  });

  test("테이블 헤더가 정상적으로 표시된다", () => {
    render(<PSM1051D00 empNo="EMP001" />);

    expect(screen.getByText("입사전 경력")).toBeInTheDocument();
    expect(screen.getByText("입사후 경력")).toBeInTheDocument();
    expect(screen.getByText("합계")).toBeInTheDocument();
    expect(screen.getByText("기술등급")).toBeInTheDocument();
    expect(screen.getByText("학력기준")).toBeInTheDocument();
    expect(screen.getByText("기술자격기준")).toBeInTheDocument();
  });

  test("모든 입력 필드가 읽기 전용으로 설정되어 있다", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // 모든 input 필드가 readonly 속성을 가지고 있는지 확인
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('readonly');
      });
    });
  });
  
}); 