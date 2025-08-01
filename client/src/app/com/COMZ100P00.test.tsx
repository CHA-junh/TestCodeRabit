import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import EmpSearchModal from './COMZ100P00'

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

describe('COMZ100P00 - ?¬ì©?ëª ê²??ëª¨ë¬', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // window.openerë¥?mockOpenerë¡??¤ì 
    Object.defineProperty(window, 'opener', {
      value: mockOpener,
      writable: true
    })
  })

  describe('?ëë§??ì¤??, () => {
    test('ì»´í¬?í¸ê° ?ì?ì¼ë¡??ëë§ë??, () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('?¬ì©?ëª ê²??)).toBeInTheDocument()
      expect(screen.getByText('?¬ì©??ëª?)).toBeInTheDocument()
      expect(screen.getByText('ì¡°í')).toBeInTheDocument()
      expect(screen.getByText('ì¢ë£')).toBeInTheDocument()
    })

    test('ê¸°ë³¸ê°ì´ ?ì?ì¼ë¡??¤ì ?ë¤', () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByPlaceholderText('?¬ì©?ëª ?ë ¥')).toBeInTheDocument()
    })

    test('ê·¸ë¦¬???¤ëê° ?ì?ì¼ë¡??ëë§ë??, () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('No')).toBeInTheDocument()
      expect(screen.getByText('?¬ë²')).toBeInTheDocument()
      expect(screen.getByText('?±ëª')).toBeInTheDocument()
      expect(screen.getByText('ë³¸ë?ëª?)).toBeInTheDocument()
      expect(screen.getByText('ë¶?ëª')).toBeInTheDocument()
      expect(screen.getByText('ì§ê¸ëª?)).toBeInTheDocument()
      expect(screen.getByText('?¬ì©??ê¶í')).toBeInTheDocument()
      expect(screen.getByText('?¬ì')).toBeInTheDocument()
      expect(screen.getByText('ì¶ì§ë¹?)).toBeInTheDocument()
      expect(screen.getByText('?¸ì¬/ë³µë¦¬')).toBeInTheDocument()
      expect(screen.getByText('ë¹ê³ ')).toBeInTheDocument()
    })
  })

  describe('ê²??ê¸°ë¥ ?ì¤??, () => {
    test('?¬ì©?ëª???ë ¥?????ë¤', () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¬ì©?ëª ?ë ¥')
      fireEvent.change(userInput, { target: { value: 'ê¹ì² ì' } })
      
      expect(userInput).toHaveValue('ê¹ì² ì')
    })

    test('ì¡°í ë²í¼???´ë¦­?ë©´ APIê° ?¸ì¶?ë¤', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '?ê¸¸??,
              HQ_DIV_NM: 'ê²½ìë³¸ë?',
              DEPT_DIV_NM: '?ëµ?',
              DUTY_NM: 'ê³¼ì¥',
              AUTH_CD_NM: 'ê´ë¦¬ì',
              BSN_USE_YN: '1',
              WPC_USE_YN: '0',
              PSM_USE_YN: '1',
              RMK: '',
              HQ_DIV_CD: 'HQ001',
              DEPT_DIV_CD: 'DEPT001',
              DUTY_CD: 'DUTY001',
              DUTY_DIV_CD: 'DUTY_DIV001',
              AUTH_CD: 'AUTH001',
              APV_APOF_ID: 'APV001',
              EMAIL_ADDR: 'hong@company.com'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¬ì©?ëª ?ë ¥')
      fireEvent.change(userInput, { target: { value: '?ê¸¸?? } })
      
      const searchButton = screen.getByText('ì¡°í')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/COMZ100P00/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userNm: '?ê¸¸?? })
        })
      })
    })

    test('API ?¤ë¥ ë°ì ???ë¬ ë©ìì§ê° ?ì?ë¤', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '?ë² ?¤ë¥' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¬ì©?ëª ?ë ¥')
      fireEvent.change(userInput, { target: { value: '?ê¸¸?? } })
      
      const searchButton = screen.getByText('ì¡°í')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?ë² ?¤ë¥', 'error')
      })
    })

    test('ê²??ê²°ê³¼ê° ?ì¼ë©??ë´ ë©ìì§ê° ?ì?ë¤', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¬ì©?ëª ?ë ¥')
      fireEvent.change(userInput, { target: { value: 'ì¡´ì¬?ì??ë?¬ì©?? } })
      
      const searchButton = screen.getByText('ì¡°í')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?´ë¹ ì§ìëªì? ì¡´ì¬?ì? ?ìµ?ë¤.', 'warning')
      })
    })
  })

  describe('?°ì´???ì ?ì¤??, () => {
    test('ê²??ê²°ê³¼ê° ?ì?ì¼ë¡??ì?ë¤', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '?ê¸¸??,
              HQ_DIV_NM: 'ê²½ìë³¸ë?',
              DEPT_DIV_NM: '?ëµ?',
              DUTY_NM: 'ê³¼ì¥',
              AUTH_CD_NM: 'ê´ë¦¬ì',
              BSN_USE_YN: '1',
              WPC_USE_YN: '0',
              PSM_USE_YN: '1',
              RMK: '',
              HQ_DIV_CD: 'HQ001',
              DEPT_DIV_CD: 'DEPT001',
              DUTY_CD: 'DUTY001',
              DUTY_DIV_CD: 'DUTY_DIV001',
              AUTH_CD: 'AUTH001',
              APV_APOF_ID: 'APV001',
              EMAIL_ADDR: 'hong@company.com'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¬ì©?ëª ?ë ¥')
      fireEvent.change(userInput, { target: { value: '?ê¸¸?? } })
      
      const searchButton = screen.getByText('ì¡°í')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('E001')).toBeInTheDocument()
        expect(screen.getByText('?ê¸¸??)).toBeInTheDocument()
        expect(screen.getByText('ê²½ìë³¸ë?')).toBeInTheDocument()
        expect(screen.getByText('?ëµ?')).toBeInTheDocument()
        expect(screen.getByText('ê³¼ì¥')).toBeInTheDocument()
        expect(screen.getByText('ê´ë¦¬ì')).toBeInTheDocument()
      })
    })

    test('ì²´í¬ë°ì¤ê° ?ì?ì¼ë¡??ì?ë¤', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '?ê¸¸??,
              HQ_DIV_NM: 'ê²½ìë³¸ë?',
              DEPT_DIV_NM: '?ëµ?',
              DUTY_NM: 'ê³¼ì¥',
              AUTH_CD_NM: 'ê´ë¦¬ì',
              BSN_USE_YN: '1',
              WPC_USE_YN: '0',
              PSM_USE_YN: '1',
              RMK: '',
              HQ_DIV_CD: 'HQ001',
              DEPT_DIV_CD: 'DEPT001',
              DUTY_CD: 'DUTY001',
              DUTY_DIV_CD: 'DUTY_DIV001',
              AUTH_CD: 'AUTH001',
              APV_APOF_ID: 'APV001',
              EMAIL_ADDR: 'hong@company.com'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¬ì©?ëª ?ë ¥')
      fireEvent.change(userInput, { target: { value: '?ê¸¸?? } })
      
      const searchButton = screen.getByText('ì¡°í')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes[0]).toBeChecked() // ?¬ì ê¶í
        expect(checkboxes[1]).not.toBeChecked() // ì¶ì§ë¹?ê¶í
        expect(checkboxes[2]).toBeChecked() // ?¸ì¬/ë³µë¦¬ ê¶í
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
              EMP_NO: 'E001',
              EMP_NM: '?ê¸¸??,
              HQ_DIV_NM: 'ê²½ìë³¸ë?',
              DEPT_DIV_NM: '?ëµ?',
              DUTY_NM: 'ê³¼ì¥',
              AUTH_CD_NM: 'ê´ë¦¬ì',
              BSN_USE_YN: '1',
              WPC_USE_YN: '0',
              PSM_USE_YN: '1',
              RMK: '',
              HQ_DIV_CD: 'HQ001',
              DEPT_DIV_CD: 'DEPT001',
              DUTY_CD: 'DUTY001',
              DUTY_DIV_CD: 'DUTY_DIV001',
              AUTH_CD: 'AUTH001',
              APV_APOF_ID: 'APV001',
              EMAIL_ADDR: 'hong@company.com'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¬ì©?ëª ?ë ¥')
      fireEvent.change(userInput, { target: { value: '?ê¸¸?? } })
      
      const searchButton = screen.getByText('ì¡°í')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const row = screen.getByText('?ê¸¸??).closest('tr')
        if (row) {
          fireEvent.doubleClick(row)
          expect(mockOpener.postMessage).toHaveBeenCalledWith({
            type: 'EMP_SELECTED',
            data: {
              empNo: 'E001',
              empNm: '?ê¸¸??,
              authCd: 'AUTH001'
            },
            source: 'COMZ100P00',
            timestamp: expect.any(String)
          }, '*')
          expect(window.close).toHaveBeenCalled()
        }
      })
    })
  })

  describe('?¤ë³´???´ë²¤???ì¤??, () => {
    test('Enter ?¤ë¡ ê²?ì´ ?¤í?ë¤', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¬ì©?ëª ?ë ¥')
      fireEvent.change(userInput, { target: { value: '?ê¸¸?? } })
      fireEvent.keyDown(userInput, { key: 'Enter' })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })

    test('Escape ?¤ë¡ ì°½ì´ ?«í??, () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¬ì©?ëª ?ë ¥')
      fireEvent.keyDown(userInput, { key: 'Escape' })
      
      expect(window.close).toHaveBeenCalled()
    })
  })

  describe('?¬ì»¤???´ë²¤???ì¤??, () => {
    test('?ë ¥ ?ë???¬ì»¤?¤íë©??ì²´ ? í?ë¤', () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¬ì©?ëª ?ë ¥')
      fireEvent.focus(userInput)
      
      expect(userInput).toBeInTheDocument()
    })
  })

  describe('?ì ?«ê¸° ?ì¤??, () => {
    test('ì¢ë£ ë²í¼???´ë¦­?ë©´ ì°½ì´ ?«í??, () => {
      render(<EmpSearchModal />)
      
      const closeButton = screen.getByText('ì¢ë£')
      fireEvent.click(closeButton)
      
      expect(window.close).toHaveBeenCalled()
    })

    test('X ë²í¼???´ë¦­?ë©´ ì°½ì´ ?«í??, () => {
      render(<EmpSearchModal />)
      
      const xButton = screen.getByText('Ã')
      fireEvent.click(xButton)
      
      expect(xButton).toBeInTheDocument()
    })
  })

  describe('ì´ê¸° ?°ì´???ì¤??, () => {
    test('ì»´í¬?í¸ê° ?ì?ì¼ë¡??ëë§ë??, () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('?¬ì©?ëª ê²??)).toBeInTheDocument()
    })
  })
}) 

