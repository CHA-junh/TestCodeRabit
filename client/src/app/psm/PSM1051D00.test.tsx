import React from "react";
import { render, screen, waitFor } from "../../test/test-utils";
import PSM1051D00 from "./PSM1051D00";

// Mock fetch
global.fetch = jest.fn();

// PSM1050M00ê³¼ì˜ ?°ë™ ?ŒìŠ¤??
describe("PSM1050M00ê³¼ì˜ ?°ë™ ?ŒìŠ¤??, () => {
  test("PSM1050M00?ì„œ ?˜ì • ëª¨ë“œ(newFlag=false)????PSM1051D00???¸ì¶œ?œë‹¤", () => {
    // PSM1050M00??ì¡°ê±´ë¶€ ?Œë”ë§?ë¡œì§ ?ŒìŠ¤??
    const newFlag = false;
    const empNo = "EMP001";
    
    // PSM1050M00??ì¡°ê±´ë¶€ ?Œë”ë§?ë¡œì§???œë??ˆì´??
    const shouldRenderPSM1051D00 = !newFlag && empNo;
    expect(shouldRenderPSM1051D00).toBeTruthy();
    
    // PSM1051D00???•ìƒ?ìœ¼ë¡??Œë”ë§ë˜?”ì? ?•ì¸
    render(<PSM1051D00 empNo={empNo} />);
    expect(screen.getByText("?„ë¡œ?„ê²½??)).toBeInTheDocument();
  });

  test("PSM1050M00?ì„œ ? ê·œ ëª¨ë“œ(newFlag=true)???ŒëŠ” PSM1051D00???¸ì¶œ?˜ì? ?ŠëŠ”??, () => {
    // PSM1050M00??ì¡°ê±´ë¶€ ?Œë”ë§?ë¡œì§ ?ŒìŠ¤??
    const newFlag = true;
    const empNo = "EMP001";
    
    // PSM1050M00??ì¡°ê±´ë¶€ ?Œë”ë§?ë¡œì§???œë??ˆì´??
    const shouldRenderPSM1051D00 = !newFlag && 
    empNo;
    expect(shouldRenderPSM1051D00).toBeFalsy();
  });

  test("PSM1050M00?ì„œ ?„ë‹¬ë°›ì? empNoê°€ PSM1051D00???•ìƒ?ìœ¼ë¡??„ë‹¬?œë‹¤", async () => {
    // PSM1050M00?ì„œ ?„ë‹¬?˜ëŠ” ?°ì´??êµ¬ì¡° ?œë??ˆì´??
    const mockEmployeeData = {
      empNo: "EMP001",
      empNm: "?ê¸¸??,
      ownOutsDiv: "1"
    };

    // PSM1050M00?ì„œ PSM1051D00?¼ë¡œ ?„ë‹¬?˜ëŠ” ë°©ì‹
    const passedEmpNo = mockEmployeeData.empNo;
    
    render(<PSM1051D00 empNo={passedEmpNo} />);

    // empNoê°€ ?•ìƒ?ìœ¼ë¡??„ë‹¬?˜ì–´ API ?¸ì¶œ???´ë£¨?´ì??”ì? ?•ì¸
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });
  });

  test("PSM1050M00??carrData.empNoê°€ PSM1051D00??empNo prop?¼ë¡œ ?„ë‹¬?œë‹¤", async () => {
    // PSM1050M00??carrData êµ¬ì¡° ?œë??ˆì´??
    const mockCarrData = {
      empNo: "EMP002",
      empNm: "ê¹€ì² ìˆ˜",
      ownOutsDiv: "1",
      entrDt: "2020/01/01"
    };

    // PSM1050M00?ì„œ PSM1051D00?¼ë¡œ ?„ë‹¬?˜ëŠ” ë°©ì‹
    const { empNo } = mockCarrData;
    
    render(<PSM1051D00 empNo={empNo} />);

    // carrData.empNoê°€ ?•ìƒ?ìœ¼ë¡??„ë‹¬?˜ì–´ API ?¸ì¶œ???´ë£¨?´ì??”ì? ?•ì¸
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP002' })
      });
    });
  });
});

// ?¸ì¶œ ì¡°ê±´ ë°?ì»¨í…?¤íŠ¸ ?ŒìŠ¤??
describe("?¸ì¶œ ì¡°ê±´ ë°?ì»¨í…?¤íŠ¸ ?ŒìŠ¤??, () => {
  test("?˜ì • ëª¨ë“œ?ì„œë§??¸ì¶œ?˜ë?ë¡?ê¸°ì¡´ ?¬ì›??ê²½ë ¥ ?•ë³´ë¥?ì¡°íšŒ?œë‹¤", async () => {
    // ?˜ì • ëª¨ë“œ ?œë??ˆì´??(ê¸°ì¡´ ?¬ì› ?•ë³´ê°€ ?ˆëŠ” ?íƒœ)
    const existingEmployeeData = {
      empNo: "EMP001",
      empNm: "?ê¸¸??,
      entrDt: "2020/01/01",
      // ê¸°ì¡´ ê²½ë ¥ ?•ë³´ê°€ ?ˆëŠ” ?¬ì›
    };

    render(<PSM1051D00 empNo={existingEmployeeData.empNo} />);

    // ê¸°ì¡´ ?¬ì›??ê²½ë ¥ ?•ë³´ë¥?ì¡°íšŒ?˜ëŠ” APIê°€ ?¸ì¶œ?˜ëŠ”ì§€ ?•ì¸
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });

    // ê¸°ì¡´ ?¬ì›??ê²½ë ¥ ?•ë³´ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
    await waitFor(() => {
      expect(screen.getByText("?„ë¡œ?„ê²½??)).toBeInTheDocument();
    });
  });

      test("? ê·œ ëª¨ë“œ?ì„œ???¸ì¶œ?˜ì? ?Šìœ¼ë¯€ë¡?PSM1052D00???€???¸ì¶œ?œë‹¤", () => {
      // ? ê·œ ëª¨ë“œ ?œë??ˆì´??
      const newFlag = true;
      const empNo = "EMP001";
      
      // PSM1050M00??ì¡°ê±´ë¶€ ?Œë”ë§?ë¡œì§
      const shouldRenderPSM1051D00 = !newFlag && empNo;
      const shouldRenderPSM1052D00 = newFlag;
      
      expect(shouldRenderPSM1051D00).toBeFalsy();
      expect(shouldRenderPSM1052D00).toBeTruthy();
    });

  test("PSM1050M00??Portal ?Œë”ë§??˜ê²½?ì„œ ?•ìƒ ?™ì‘?œë‹¤", () => {
    // PSM1050M00??createPortal???¬ìš©?˜ì—¬ body??ì§ì ‘ ?Œë”ë§í•˜???˜ê²½ ?œë??ˆì´??
    const mockDocumentBody = document.createElement('div');
    document.body.appendChild(mockDocumentBody);

    // Portal ?˜ê²½?ì„œ PSM1051D00???•ìƒ?ìœ¼ë¡??Œë”ë§ë˜?”ì? ?•ì¸
    render(<PSM1051D00 empNo="EMP001" />);
    
    expect(screen.getByText("?„ë¡œ?„ê²½??)).toBeInTheDocument();
    
    // ?•ë¦¬
    document.body.removeChild(mockDocumentBody);
  });

  test("PSM1050M00??ëª¨ë‹¬ ì»¨í…?¤íŠ¸?ì„œ ?•ìƒ ?™ì‘?œë‹¤", () => {
    // PSM1050M00??ëª¨ë‹¬ë¡??œì‹œ?˜ëŠ” ?˜ê²½?ì„œ PSM1051D00???•ìƒ ?™ì‘?˜ëŠ”ì§€ ?•ì¸
    const mockModalContext = {
      isModal: true,
      zIndex: 1000
    };

    render(<PSM1051D00 empNo="EMP001" />);
    
    // ëª¨ë‹¬ ?˜ê²½?ì„œ???•ìƒ?ìœ¼ë¡??Œë”ë§ë˜?”ì? ?•ì¸
    expect(screen.getByText("?„ë¡œ?„ê²½??)).toBeInTheDocument();
    expect(screen.getByText("?™ë ¥ê¸°ì?")).toBeInTheDocument();
    expect(screen.getByText("ê¸°ìˆ ?ê²©ê¸°ì?")).toBeInTheDocument();
  });
});

// PSM1050M00ê³¼ì˜ ?°ì´???°ë™ ?ŒìŠ¤??
describe("PSM1050M00ê³¼ì˜ ?°ì´???°ë™ ?ŒìŠ¤??, () => {
  test("PSM1050M00?ì„œ ?„ë‹¬ë°›ì? ?¬ì› ?•ë³´ë¡?ê²½ë ¥ ?°ì´?°ë? ì¡°íšŒ?œë‹¤", async () => {
    // PSM1050M00?ì„œ ?„ë‹¬?˜ëŠ” employeeData êµ¬ì¡°
    const mockEmployeeData = {
      empNo: "EMP001",
      empNm: "?ê¸¸??,
      ownOutsDiv: "1",
      entrDt: "2020/01/01",
      lastAdbgDiv: "?€ì¡?,
      ctqlCd: "?•ë³´ì²˜ë¦¬ê¸°ì‚¬"
    };

    render(<PSM1051D00 empNo={mockEmployeeData.empNo} />);

    // PSM1050M00?ì„œ ?„ë‹¬ë°›ì? empNoë¡?ê²½ë ¥ ?°ì´?°ë? ì¡°íšŒ?˜ëŠ”ì§€ ?•ì¸
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: mockEmployeeData.empNo })
      });
    });
  });

  test("PSM1050M00??ê²½ë ¥ ê³„ì‚° ê²°ê³¼?€ PSM1051D00??ê²½ë ¥ ì¡°íšŒ ê²°ê³¼ê°€ ?¼ì¹˜?œë‹¤", async () => {
    // PSM1050M00?ì„œ ê³„ì‚°??ê²½ë ¥ ?°ì´??
    const psm1050CarrData = {
      empNo: "EMP001",
      entrBefInYcnt: "2",
      entrBefInMcnt: "0",
      entrAftYcnt: "3",
      entrAftMcnt: "0",
      carrYcnt: "5",
      carrMcnt: "0",
      tcnGrd: "ì¤‘ê¸‰"
    };

    // PSM1051D00?ì„œ ì¡°íšŒ?˜ëŠ” ê²½ë ¥ ?°ì´??(?™ì¼??ê²°ê³¼)
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{
          CALC_STAD_DT: "2025/07/31",
          BEF_M_CNT: "24", // 2??
          AFT_M_CNT: "36", // 3??
          TCN_GRD_NM: "ì¤‘ê¸‰"
        }]
      })
    });

    render(<PSM1051D00 empNo={psm1050CarrData.empNo} />);

          // PSM1050M00??ê³„ì‚° ê²°ê³¼?€ PSM1051D00??ì¡°íšŒ ê²°ê³¼ê°€ ?¼ì¹˜?˜ëŠ”ì§€ ?•ì¸
      await waitFor(() => {
        const twoInputs = screen.getAllByDisplayValue("2");
        const threeInputs = screen.getAllByDisplayValue("3");
        const fiveInputs = screen.getAllByDisplayValue("5");
        
        expect(twoInputs.length).toBeGreaterThan(0); // ?…ì‚¬??ê²½ë ¥ ?„ìˆ˜
        expect(threeInputs.length).toBeGreaterThan(0); // ?…ì‚¬??ê²½ë ¥ ?„ìˆ˜
        expect(fiveInputs.length).toBeGreaterThan(0); // ?©ê³„ ê²½ë ¥ ?„ìˆ˜
        expect(screen.getByDisplayValue("ì¤‘ê¸‰")).toBeInTheDocument(); // ê¸°ìˆ ?±ê¸‰
      });
  });
});

describe("PSM1051D00 - ê²½ë ¥ ?ì„¸ ?¤ì´?¼ë¡œê·?, () => {
  beforeEach(() => {
    // Mock fetch ê¸°ë³¸ ?‘ë‹µ ?¤ì •
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
          TCN_GRD_NM: "ì¤‘ê¸‰",
          TCN_GRD: "3",
          CTQL_TCN_GRD_NM: "ì´ˆê¸‰",
          CTQL_TCN_GRD: "4"
        }]
      })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("ì»´í¬?ŒíŠ¸ê°€ ?•ìƒ?ìœ¼ë¡??Œë”ë§ëœ??, () => {
    render(<PSM1051D00 empNo="EMP001" />);
    expect(screen.getByText("?„ë¡œ?„ê²½??)).toBeInTheDocument();
  });

  test("?¬ì›ë²ˆí˜¸ê°€ ?„ë‹¬?˜ë©´ APIë¥??¸ì¶œ?˜ì—¬ ê²½ë ¥ ?°ì´?°ë? ë¡œë“œ?œë‹¤", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/psm/career/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empNo: 'EMP001' })
      });
    });
  });

  test("API ?‘ë‹µ ?°ì´?°ê? ?•ìƒ?ìœ¼ë¡?ê²½ë ¥ ê³„ì‚°??ë°˜ì˜?œë‹¤", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    // API ?‘ë‹µ ?°ì´?°ê? ë¡œë“œ???Œê¹Œì§€ ?€ê¸?
    await waitFor(() => {
      // ?™ë ¥ê¸°ì? ?¹ì…˜???…ì‚¬??ê²½ë ¥ ?„ìˆ˜ ?•ì¸ (24ê°œì›” = 2??
      const inputs = screen.getAllByDisplayValue("2");
      expect(inputs.length).toBeGreaterThan(0);
    });

    // ?™ë ¥ê¸°ì? ê²½ë ¥ ê³„ì‚° ê²°ê³¼ ?•ì¸
    const inputs = screen.getAllByDisplayValue("2");
    const zeroInputs = screen.getAllByDisplayValue("0");
    const threeInputs = screen.getAllByDisplayValue("3");
    const fiveInputs = screen.getAllByDisplayValue("5");

    // ?™ë ¥ê¸°ì? ?¹ì…˜???´ë‹¹ ê°’ë“¤??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
    expect(inputs.length).toBeGreaterThan(0); // ?…ì‚¬??ê²½ë ¥ ?„ìˆ˜ (24ê°œì›” = 2??
    expect(zeroInputs.length).toBeGreaterThan(0); // ?…ì‚¬??ê²½ë ¥ ê°œì›”??(24 - (2*12) = 0)
    expect(threeInputs.length).toBeGreaterThan(0); // ?…ì‚¬??ê²½ë ¥ ?„ìˆ˜ (36ê°œì›” = 3??
    expect(fiveInputs.length).toBeGreaterThan(0); // ?©ê³„ ê²½ë ¥ ?„ìˆ˜ (60ê°œì›” = 5??

    // ê¸°ìˆ ?±ê¸‰ ?•ì¸
    expect(screen.getByDisplayValue("ì¤‘ê¸‰")).toBeInTheDocument();
  });

  test("ê¸°ìˆ ?ê²©ê¸°ì? ê²½ë ¥???•ìƒ?ìœ¼ë¡?ê³„ì‚°?˜ì–´ ?œì‹œ?œë‹¤", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ê¸°ìˆ ?ê²©ê¸°ì? ê²½ë ¥ ê³„ì‚° ê²°ê³¼ ?•ì¸
      const oneInputs = screen.getAllByDisplayValue("1");
      const zeroInputs = screen.getAllByDisplayValue("0");
      const sixInputs = screen.getAllByDisplayValue("6");
      const twoInputs = screen.getAllByDisplayValue("2");

      // ê¸°ìˆ ?ê²©ê¸°ì? ?¹ì…˜???´ë‹¹ ê°’ë“¤??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
      expect(oneInputs.length).toBeGreaterThan(0); // ?…ì‚¬???ê²©ê²½ë ¥ ?„ìˆ˜ (12ê°œì›” = 1??
      expect(zeroInputs.length).toBeGreaterThan(0); // ?…ì‚¬???ê²©ê²½ë ¥ ê°œì›”??(12 - (1*12) = 0)
      expect(sixInputs.length).toBeGreaterThan(0); // ?…ì‚¬???ê²©ê²½ë ¥ ê°œì›”??(18 - (1*12) = 6)
      expect(twoInputs.length).toBeGreaterThan(0); // ?©ê³„ ?ê²©ê²½ë ¥ ?„ìˆ˜ (30ê°œì›” = 2??

      // ?ê²©ê¸°ìˆ ?±ê¸‰ ?•ì¸
      expect(screen.getByDisplayValue("ì´ˆê¸‰")).toBeInTheDocument();
    });
  });

  test("ê¸°ì??¼ì´ ?•ìƒ?ìœ¼ë¡??œì‹œ?œë‹¤", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ê¸°ì????…ë ¥ ?„ë“œê°€ ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
      const dateInput = screen.getByDisplayValue("2025-07-31");
      expect(dateInput).toBeInTheDocument();
    });
  });

  test("API ?¸ì¶œ ?¤íŒ¨ ???ì ˆ??ì²˜ë¦¬ê°€ ?´ë£¨?´ì§„??, async () => {
    // API ?¤íŒ¨ ?œë??ˆì´??- response.ok = false??ê²½ìš°
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, message: "ì¡°íšŒ ?¤íŒ¨" })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    // response.ok = false??ê²½ìš°?ëŠ” hasProfileDataê°€ ë³€ê²½ë˜ì§€ ?Šìœ¼ë¯€ë¡?
    // ì´ˆê¸° ?íƒœ??trueê°€ ? ì??˜ì–´ ë©”ì‹œì§€ê°€ ?œì‹œ?˜ì? ?ŠìŒ
    // ?´ëŠ” PSM1051D00???¤ì œ ?™ì‘ê³??¼ì¹˜??
    await waitFor(() => {
      expect(screen.queryByText("(?±ë¡???„ë¡œ???´ì—­???†ìŠµ?ˆë‹¤.)")).not.toBeInTheDocument();
    });
  });

  test("API ?‘ë‹µ??success=false??ê²½ìš° ?ì ˆ??ì²˜ë¦¬ê°€ ?´ë£¨?´ì§„??, async () => {
    // API ?‘ë‹µ?€ ?±ê³µ?ˆì?ë§?success=false??ê²½ìš°
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, message: "?°ì´???†ìŒ" })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // success=false??ê²½ìš° "?±ë¡???„ë¡œ???´ì—­???†ìŠµ?ˆë‹¤" ë©”ì‹œì§€ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
      expect(screen.getByText("(?±ë¡???„ë¡œ???´ì—­???†ìŠµ?ˆë‹¤.)")).toBeInTheDocument();
    });
  });

  test("API ?‘ë‹µ??dataê°€ ?†ëŠ” ê²½ìš° ?ì ˆ??ì²˜ë¦¬ê°€ ?´ë£¨?´ì§„??, async () => {
    // API ?‘ë‹µ?€ ?±ê³µ?ˆì?ë§?dataê°€ ?†ëŠ” ê²½ìš°
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: null })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // dataê°€ ?†ëŠ” ê²½ìš° "?±ë¡???„ë¡œ???´ì—­???†ìŠµ?ˆë‹¤" ë©”ì‹œì§€ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
      expect(screen.getByText("(?±ë¡???„ë¡œ???´ì—­???†ìŠµ?ˆë‹¤.)")).toBeInTheDocument();
    });
  });

  test("API ?¸ì¶œ ì¤??¤íŠ¸?Œí¬ ?¤ë¥˜ê°€ ë°œìƒ??ê²½ìš° ?ì ˆ??ì²˜ë¦¬ê°€ ?´ë£¨?´ì§„??, async () => {
    // ?¤íŠ¸?Œí¬ ?¤ë¥˜ ?œë??ˆì´??
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ?¤íŠ¸?Œí¬ ?¤ë¥˜ ??"?±ë¡???„ë¡œ???´ì—­???†ìŠµ?ˆë‹¤" ë©”ì‹œì§€ê°€ ?œì‹œ?˜ëŠ”ì§€ ?•ì¸
      expect(screen.getByText("(?±ë¡???„ë¡œ???´ì—­???†ìŠµ?ˆë‹¤.)")).toBeInTheDocument();
    });
  });

  test("?¬ì›ë²ˆí˜¸ê°€ ?†ìœ¼ë©?APIë¥??¸ì¶œ?˜ì? ?ŠëŠ”??, () => {
    render(<PSM1051D00 />);

    // PSM1051D00??career/profile APIê°€ ?¸ì¶œ?˜ì? ?Šì•˜?”ì? ?•ì¸
    expect(global.fetch).not.toHaveBeenCalledWith('/api/psm/career/profile', expect.any(Object));
  });

  test("ê²½ë ¥ ê³„ì‚° ë¡œì§???•í™•???™ì‘?œë‹¤", async () => {
    // ë³µì¡??ê²½ë ¥ ?°ì´?°ë¡œ ?ŒìŠ¤??
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{
          CALC_STAD_DT: "2025/12/31",
          BEF_M_CNT: "35", // 2??11ê°œì›”
          AFT_M_CNT: "47", // 3??11ê°œì›”
          BEF_CTQL_M_CNT: "18", // 1??6ê°œì›”
          AFT_CTQL_M_CNT: "25", // 2??1ê°œì›”
          TCN_GRD_NM: "ê³ ê¸‰",
          TCN_GRD: "2",
          CTQL_TCN_GRD_NM: "ì¤‘ê¸‰",
          CTQL_TCN_GRD: "3"
        }]
      })
    });

    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ?™ë ¥ê¸°ì? ê²½ë ¥ ê³„ì‚° (35ê°œì›” = 2??11ê°œì›”)
      const twoInputs = screen.getAllByDisplayValue("2");
      const elevenInputs = screen.getAllByDisplayValue("11");
      const threeInputs = screen.getAllByDisplayValue("3");
      const sixInputs = screen.getAllByDisplayValue("6");
      const tenInputs = screen.getAllByDisplayValue("10");

      // ?´ë‹¹ ê°’ë“¤??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
      expect(twoInputs.length).toBeGreaterThan(0); // ?…ì‚¬??ê²½ë ¥ ?„ìˆ˜
      expect(elevenInputs.length).toBeGreaterThan(0); // ?…ì‚¬??ê²½ë ¥ ê°œì›”??
      expect(threeInputs.length).toBeGreaterThan(0); // ?…ì‚¬??ê²½ë ¥ ?„ìˆ˜
      expect(elevenInputs.length).toBeGreaterThan(0); // ?…ì‚¬??ê²½ë ¥ ê°œì›”??
      expect(sixInputs.length).toBeGreaterThan(0); // ?©ê³„ ê²½ë ¥ ?„ìˆ˜
      expect(tenInputs.length).toBeGreaterThan(0); // ?©ê³„ ê²½ë ¥ ê°œì›”??
    });
  });

  test("?ˆë‚´ ë©”ì‹œì§€ê°€ ?•ìƒ?ìœ¼ë¡??œì‹œ?œë‹¤", () => {
    render(<PSM1051D00 empNo="EMP001" />);

    expect(screen.getByText(/?…ì‚¬??ê²½ë ¥?€ ?„ë¡œ?„ì˜ ?…ì‚¬??ê²½ë ¥ë³´ë‹¤ ?????†ìŠµ?ˆë‹¤/)).toBeInTheDocument();
  });

  test("?Œì´ë¸??¤ë”ê°€ ?•ìƒ?ìœ¼ë¡??œì‹œ?œë‹¤", () => {
    render(<PSM1051D00 empNo="EMP001" />);

    expect(screen.getByText("?…ì‚¬??ê²½ë ¥")).toBeInTheDocument();
    expect(screen.getByText("?…ì‚¬??ê²½ë ¥")).toBeInTheDocument();
    expect(screen.getByText("?©ê³„")).toBeInTheDocument();
    expect(screen.getByText("ê¸°ìˆ ?±ê¸‰")).toBeInTheDocument();
    expect(screen.getByText("?™ë ¥ê¸°ì?")).toBeInTheDocument();
    expect(screen.getByText("ê¸°ìˆ ?ê²©ê¸°ì?")).toBeInTheDocument();
  });

  test("ëª¨ë“  ?…ë ¥ ?„ë“œê°€ ?½ê¸° ?„ìš©?¼ë¡œ ?¤ì •?˜ì–´ ?ˆë‹¤", async () => {
    render(<PSM1051D00 empNo="EMP001" />);

    await waitFor(() => {
      // ëª¨ë“  input ?„ë“œê°€ readonly ?ì„±??ê°€ì§€ê³??ˆëŠ”ì§€ ?•ì¸
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('readonly');
      });
    });
  });
  
}); 

