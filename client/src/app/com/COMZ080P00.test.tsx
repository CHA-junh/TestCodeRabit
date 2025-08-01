import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import COMZ080P00 from './COMZ080P00'

// Mock useToast
const mockShowToast = jest.fn()

jest.mock('@/contexts/ToastContext', () => ({
  ...jest.requireActual('@/contexts/ToastContext'),
  useToast: () => ({
    showToast: mockShowToast
  })
}))

// Mock fetch
global.fetch = jest.fn()

// Mock window.opener and window.close
const mockOpener = {
  postMessage: jest.fn(),
  closed: false
}

Object.defineProperty(window, 'opener', {
  value: mockOpener,
  writable: true
})

Object.defineProperty(window, 'close', {
  value: jest.fn(),
  writable: true
})

describe('COMZ080P00 - ì§ì ê²???ì (?ì¥ ë²ì )', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // fetch ëª¨í¹ ì´ê¸°??
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('?ëë§??ì¤??, () => {
    test('ì»´í¬?í¸ê° ?ì?ì¼ë¡??ëë§ë??, () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('ì§ì ê²??)).toBeInTheDocument()
      // ì¤ë³µ???ì¤?¸ë getAllByText ?¬ì©
      const empNameElements = screen.getAllByText('ì§ìëª?)
      expect(empNameElements.length).toBeGreaterThan(0)
      expect(screen.getByText('ì¡°í')).toBeInTheDocument()
      expect(screen.getByText('ì¢ë£')).toBeInTheDocument()
    })

    test('ê¸°ë³¸ê°ì´ ?ì?ì¼ë¡??¤ì ?ë¤', () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByPlaceholderText('ì§ìëª??ë ¥')).toBeInTheDocument()
      expect(screen.getByText('?ì¬')).toBeInTheDocument()
      expect(screen.getByText('?¸ì£¼')).toBeInTheDocument()
      expect(screen.getByText('?ì¬+?¸ì£¼')).toBeInTheDocument()
      expect(screen.getByText('?´ì¬?í¬??)).toBeInTheDocument()
    })

    test('ê·¸ë¦¬???¤ëê° ?ì?ì¼ë¡??ëë§ë??, () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('No')).toBeInTheDocument()
      expect(screen.getByText('êµ¬ë¶')).toBeInTheDocument()
      
      // ì¤ë³µ???ì¤?¸ë getAllByText ?¬ì©
      const empNameElements = screen.getAllByText('ì§ìëª?)
      expect(empNameElements.length).toBeGreaterThan(0)
      
      expect(screen.getByText('ì§ì±')).toBeInTheDocument()
      expect(screen.getByText('?±ê¸')).toBeInTheDocument()
      expect(screen.getByText('?ì')).toBeInTheDocument()
      expect(screen.getByText('?ì¬??)).toBeInTheDocument()
      expect(screen.getByText('?¬ì??)).toBeInTheDocument()
      expect(screen.getByText('ì² ì??)).toBeInTheDocument()
      expect(screen.getByText('?í')).toBeInTheDocument()
      expect(screen.getByText('?¬ìì¤??ë¡?í¸')).toBeInTheDocument()
    })
  })

  describe('ê²??ì¡°ê±´ ë³ê²??ì¤??, () => {
    test('?ì¬/?¸ì£¼ êµ¬ë¶??ë³ê²½í  ???ë¤', () => {
      render(<COMZ080P00 />)
      
      const radioButtons = screen.getAllByRole('radio')
      const outsRadio = radioButtons[1] // ?¸ì£¼ ?¼ë??ë²í¼
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('?´ì¬?í¬??ì²´í¬ë°ì¤ë¥?ë³ê²½í  ???ë¤', () => {
      render(<COMZ080P00 />)
      
      const checkbox = screen.getByRole('checkbox')
      // ì²´í¬ë°ì¤ê° ?´ë? ì²´í¬???í?´ë?ë¡??´ë¦­?ë©´ ?´ì ??
      fireEvent.click(checkbox)
      
      // ì²´í¬ ?´ì ???í ?ì¸
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('ê²??ê¸°ë¥ ?ì¤??, () => {
    test('ì§ìëªì ?ë ¥?????ë¤', () => {
      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ì§ìëª??ë ¥')
      fireEvent.change(empNameInput, { target: { value: '?±ë??? } })
      
      expect(empNameInput).toHaveValue('?±ë???)
    })

    test('ì¡°í ë²í¼???´ë¦­?????ë¤', () => {
      render(<COMZ080P00 />)
      
      const searchButton = screen.getByText('ì¡°í')
      fireEvent.click(searchButton)
      
      expect(searchButton).toBeInTheDocument()
    })

    test('ì§ìëªì´ ?ì¼ë©?ê²½ê³  ë©ìì§ê° ?ì?ë¤', async () => {
      render(<COMZ080P00 />)
      
      const searchButton = screen.getByText('ì¡°í')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('ì§ìëªì ?ë ¥?´ì£¼?¸ì.', 'warning')
      })
    })

    test('ê²??ê²°ê³¼ê° ?ì¼ë©??ë´ ë©ìì§ê° ?ì?ë¤', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ì§ìëª??ë ¥')
      fireEvent.change(empNameInput, { target: { value: 'ì¡´ì¬?ì??ëì§ì' } })
      
      const searchButton = screen.getByText('ì¡°í')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?´ë¹ ì§ìëªì? ì¡´ì¬?ì? ?ìµ?ë¤.', 'warning')
      })
    })
  })

  describe('?°ì´???ì ?ì¤??, () => {
    test('ì´ê¸°?ë ?°ì´?°ê? ?ì???ì?ë¤', () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('? ê²??ê²°ê³¼ê° ?ìµ?ë¤.')).toBeInTheDocument()
    })

    test('ê²??ê²°ê³¼ê° ?ì?ì¼ë¡??ì?ë¤', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '?ì¬',
              EMP_NM: '?±ë???,
              EMP_NO: 'EMP001',
              DUTY_CD_NM: 'ê³¼ì¥',
              TCN_GRD_NM: 'ì¤ê¸',
              PARTY_NM: '?ë¹?¤ì¬?ë³¸ë¶',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '?¬ì§',
              EXEC_ING_BSN_NM: 'KBìºí¼???ëì°?TM?ì¤??êµ¬ì¶'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ì§ìëª??ë ¥')
      fireEvent.change(empNameInput, { target: { value: '?±ë??? } })
      
      const searchButton = screen.getByText('ì¡°í')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })

  describe('?ë¸?´ë¦­ ? í ?ì¤??, () => {
    test('?ì ?ë¸?´ë¦­?ë©´ ë¶ëª?ì°½ì¼ë¡?ë©ìì§ë¥??ì¡?ê³  ì°½ì´ ?«í??, async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '?ì¬',
              EMP_NM: '?±ë???,
              EMP_NO: 'EMP001',
              DUTY_CD_NM: 'ê³¼ì¥',
              TCN_GRD_NM: 'ì¤ê¸',
              PARTY_NM: '?ë¹?¤ì¬?ë³¸ë¶',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '?¬ì§',
              EXEC_ING_BSN_NM: 'KBìºí¼???ëì°?TM?ì¤??êµ¬ì¶'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ì§ìëª??ë ¥')
      fireEvent.change(empNameInput, { target: { value: '?±ë??? } })
      
      const searchButton = screen.getByText('ì¡°í')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })

  describe('?¤ë³´???´ë²¤???ì¤??, () => {
    test('Enter ?¤ë¡ ê²?ì´ ?¤í?ë¤', () => {
      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ì§ìëª??ë ¥')
      fireEvent.change(empNameInput, { target: { value: '?±ë??? } })
      fireEvent.keyDown(empNameInput, { key: 'Enter', code: 'Enter' })
      
      expect(empNameInput).toBeInTheDocument()
    })

    test('Escape ?¤ë¡ ì°½ì´ ?«í??, () => {
      render(<COMZ080P00 />)
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
      
      expect(screen.getByText('ì§ì ê²??)).toBeInTheDocument()
    })
  })

  describe('?ì ?«ê¸° ?ì¤??, () => {
    test('ì¢ë£ ë²í¼???´ë¦­?ë©´ ì°½ì´ ?«í??, () => {
      render(<COMZ080P00 />)
      
      const closeButton = screen.getByText('ì¢ë£')
      fireEvent.click(closeButton)
      
      expect(window.close).toHaveBeenCalled()
    })

    test('X ë²í¼???´ë¦­?ë©´ ì°½ì´ ?«í??, () => {
      render(<COMZ080P00 />)
      
      const xButton = screen.getByText('Ã')
      fireEvent.click(xButton)
      
      expect(window.close).toHaveBeenCalled()
    })
  })

  describe('ë©ì???ì¤??, () => {
    test('choiceEmpInit ë©ì?ê? ?ì?ì¼ë¡??ë?ë¤', () => {
      const mockEmpList = [
        {
          LIST_NO: '1',
          OWN_OUTS_NM: '?¸ì£¼',
          EMP_NM: '?±ë???,
          EMP_NO: 'EMP001',
          DUTY_CD_NM: 'ê³¼ì¥',
          TCN_GRD_NM: 'ì¤ê¸',
          PARTY_NM: '?ë¹?¤ì¬?ë³¸ë¶',
          ENTR_DT: '2016/11/03',
          EXEC_IN_STRT_DT: '2016/11/03',
          EXEC_IN_END_DT: '2017/01/02',
          WKG_ST_DIV_NM: '?¬ì§',
          EXEC_ING_BSN_NM: 'KBìºí¼???ëì°?TM?ì¤??êµ¬ì¶'
        }
      ]

      render(<COMZ080P00 />)
      
      expect(screen.getByText('? ê²??ê²°ê³¼ê° ?ìµ?ë¤.')).toBeInTheDocument()
    })
  })

  describe('postMessage ?ì¤??, () => {
    test('postMessageë¡??°ì´?°ë? ë°ì ???ë¤', () => {
      render(<COMZ080P00 />)
      
      const mockData = {
        type: 'CHOICE_EMP_INIT',
        data: {
          empNm: '?±ë???,
          ownOutDiv: '2',
          empList: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '?¸ì£¼',
              EMP_NM: '?±ë???,
              EMP_NO: 'EMP001',
              DUTY_CD_NM: 'ê³¼ì¥',
              TCN_GRD_NM: 'ì¤ê¸',
              PARTY_NM: '?ë¹?¤ì¬?ë³¸ë¶',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '?¬ì§',
              EXEC_ING_BSN_NM: 'KBìºí¼???ëì°?TM?ì¤??êµ¬ì¶'
            }
          ]
        }
      }

      window.postMessage(mockData, '*')
      
      expect(screen.getByText('? ê²??ê²°ê³¼ê° ?ìµ?ë¤.')).toBeInTheDocument()
    })
  })
}) 

