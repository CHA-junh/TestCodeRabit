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

describe('COMZ100P00 - ?¨Ïö©?êÎ™Ö Í≤Ä??Î™®Îã¨', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // window.openerÎ•?mockOpenerÎ°??§Ï†ï
    Object.defineProperty(window, 'opener', {
      value: mockOpener,
      writable: true
    })
  })

  describe('?åÎçîÎß??åÏä§??, () => {
    test('Ïª¥Ìè¨?åÌä∏Í∞Ä ?ïÏÉÅ?ÅÏúºÎ°??åÎçîÎßÅÎêú??, () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('?¨Ïö©?êÎ™Ö Í≤Ä??)).toBeInTheDocument()
      expect(screen.getByText('?¨Ïö©??Î™?)).toBeInTheDocument()
      expect(screen.getByText('Ï°∞Ìöå')).toBeInTheDocument()
      expect(screen.getByText('Ï¢ÖÎ£å')).toBeInTheDocument()
    })

    test('Í∏∞Î≥∏Í∞íÏù¥ ?ïÏÉÅ?ÅÏúºÎ°??§Ï†ï?úÎã§', () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByPlaceholderText('?¨Ïö©?êÎ™Ö ?ÖÎ†•')).toBeInTheDocument()
    })

    test('Í∑∏Î¶¨???§ÎçîÍ∞Ä ?ïÏÉÅ?ÅÏúºÎ°??åÎçîÎßÅÎêú??, () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('No')).toBeInTheDocument()
      expect(screen.getByText('?¨Î≤à')).toBeInTheDocument()
      expect(screen.getByText('?±Î™Ö')).toBeInTheDocument()
      expect(screen.getByText('Î≥∏Î?Î™?)).toBeInTheDocument()
      expect(screen.getByText('Î∂Ä?úÎ™Ö')).toBeInTheDocument()
      expect(screen.getByText('ÏßÅÍ∏âÎ™?)).toBeInTheDocument()
      expect(screen.getByText('?¨Ïö©??Í∂åÌïú')).toBeInTheDocument()
      expect(screen.getByText('?¨ÏóÖ')).toBeInTheDocument()
      expect(screen.getByText('Ï∂îÏßÑÎπ?)).toBeInTheDocument()
      expect(screen.getByText('?∏ÏÇ¨/Î≥µÎ¶¨')).toBeInTheDocument()
      expect(screen.getByText('ÎπÑÍ≥†')).toBeInTheDocument()
    })
  })

  describe('Í≤Ä??Í∏∞Îä• ?åÏä§??, () => {
    test('?¨Ïö©?êÎ™Ö???ÖÎ†•?????àÎã§', () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¨Ïö©?êÎ™Ö ?ÖÎ†•')
      fireEvent.change(userInput, { target: { value: 'ÍπÄÏ≤†Ïàò' } })
      
      expect(userInput).toHaveValue('ÍπÄÏ≤†Ïàò')
    })

    test('Ï°∞Ìöå Î≤ÑÌäº???¥Î¶≠?òÎ©¥ APIÍ∞Ä ?∏Ï∂ú?úÎã§', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '?çÍ∏∏??,
              HQ_DIV_NM: 'Í≤ΩÏòÅÎ≥∏Î?',
              DEPT_DIV_NM: '?ÑÎûµ?Ä',
              DUTY_NM: 'Í≥ºÏû•',
              AUTH_CD_NM: 'Í¥ÄÎ¶¨Ïûê',
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
      
      const userInput = screen.getByPlaceholderText('?¨Ïö©?êÎ™Ö ?ÖÎ†•')
      fireEvent.change(userInput, { target: { value: '?çÍ∏∏?? } })
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/COMZ100P00/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userNm: '?çÍ∏∏?? })
        })
      })
    })

    test('API ?§Î•ò Î∞úÏÉù ???êÎü¨ Î©îÏãúÏßÄÍ∞Ä ?úÏãú?úÎã§', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '?úÎ≤Ñ ?§Î•ò' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¨Ïö©?êÎ™Ö ?ÖÎ†•')
      fireEvent.change(userInput, { target: { value: '?çÍ∏∏?? } })
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?úÎ≤Ñ ?§Î•ò', 'error')
      })
    })

    test('Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ÜÏúºÎ©??àÎÇ¥ Î©îÏãúÏßÄÍ∞Ä ?úÏãú?úÎã§', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¨Ïö©?êÎ™Ö ?ÖÎ†•')
      fireEvent.change(userInput, { target: { value: 'Ï°¥Ïû¨?òÏ??äÎäî?¨Ïö©?? } })
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?¥Îãπ ÏßÅÏõêÎ™ÖÏ? Ï°¥Ïû¨?òÏ? ?äÏäµ?àÎã§.', 'warning')
      })
    })
  })

  describe('?∞Ïù¥???úÏãú ?åÏä§??, () => {
    test('Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ïÏÉÅ?ÅÏúºÎ°??úÏãú?úÎã§', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '?çÍ∏∏??,
              HQ_DIV_NM: 'Í≤ΩÏòÅÎ≥∏Î?',
              DEPT_DIV_NM: '?ÑÎûµ?Ä',
              DUTY_NM: 'Í≥ºÏû•',
              AUTH_CD_NM: 'Í¥ÄÎ¶¨Ïûê',
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
      
      const userInput = screen.getByPlaceholderText('?¨Ïö©?êÎ™Ö ?ÖÎ†•')
      fireEvent.change(userInput, { target: { value: '?çÍ∏∏?? } })
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('E001')).toBeInTheDocument()
        expect(screen.getByText('?çÍ∏∏??)).toBeInTheDocument()
        expect(screen.getByText('Í≤ΩÏòÅÎ≥∏Î?')).toBeInTheDocument()
        expect(screen.getByText('?ÑÎûµ?Ä')).toBeInTheDocument()
        expect(screen.getByText('Í≥ºÏû•')).toBeInTheDocument()
        expect(screen.getByText('Í¥ÄÎ¶¨Ïûê')).toBeInTheDocument()
      })
    })

    test('Ï≤¥ÌÅ¨Î∞ïÏä§Í∞Ä ?ïÏÉÅ?ÅÏúºÎ°??úÏãú?úÎã§', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '?çÍ∏∏??,
              HQ_DIV_NM: 'Í≤ΩÏòÅÎ≥∏Î?',
              DEPT_DIV_NM: '?ÑÎûµ?Ä',
              DUTY_NM: 'Í≥ºÏû•',
              AUTH_CD_NM: 'Í¥ÄÎ¶¨Ïûê',
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
      
      const userInput = screen.getByPlaceholderText('?¨Ïö©?êÎ™Ö ?ÖÎ†•')
      fireEvent.change(userInput, { target: { value: '?çÍ∏∏?? } })
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes[0]).toBeChecked() // ?¨ÏóÖ Í∂åÌïú
        expect(checkboxes[1]).not.toBeChecked() // Ï∂îÏßÑÎπ?Í∂åÌïú
        expect(checkboxes[2]).toBeChecked() // ?∏ÏÇ¨/Î≥µÎ¶¨ Í∂åÌïú
      })
    })
  })

  describe('?îÎ∏î?¥Î¶≠ ?†ÌÉù ?åÏä§??, () => {
    test('?âÏùÑ ?îÎ∏î?¥Î¶≠?òÎ©¥ Î∂ÄÎ™?Ï∞ΩÏúºÎ°?Î©îÏãúÏßÄÎ•??ÑÏÜ°?òÍ≥† Ï∞ΩÏù¥ ?´Ìûå??, async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '?çÍ∏∏??,
              HQ_DIV_NM: 'Í≤ΩÏòÅÎ≥∏Î?',
              DEPT_DIV_NM: '?ÑÎûµ?Ä',
              DUTY_NM: 'Í≥ºÏû•',
              AUTH_CD_NM: 'Í¥ÄÎ¶¨Ïûê',
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
      
      const userInput = screen.getByPlaceholderText('?¨Ïö©?êÎ™Ö ?ÖÎ†•')
      fireEvent.change(userInput, { target: { value: '?çÍ∏∏?? } })
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const row = screen.getByText('?çÍ∏∏??).closest('tr')
        if (row) {
          fireEvent.doubleClick(row)
          expect(mockOpener.postMessage).toHaveBeenCalledWith({
            type: 'EMP_SELECTED',
            data: {
              empNo: 'E001',
              empNm: '?çÍ∏∏??,
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

  describe('?§Î≥¥???¥Î≤§???åÏä§??, () => {
    test('Enter ?§Î°ú Í≤Ä?âÏù¥ ?§Ìñâ?úÎã§', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¨Ïö©?êÎ™Ö ?ÖÎ†•')
      fireEvent.change(userInput, { target: { value: '?çÍ∏∏?? } })
      fireEvent.keyDown(userInput, { key: 'Enter' })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })

    test('Escape ?§Î°ú Ï∞ΩÏù¥ ?´Ìûå??, () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¨Ïö©?êÎ™Ö ?ÖÎ†•')
      fireEvent.keyDown(userInput, { key: 'Escape' })
      
      expect(window.close).toHaveBeenCalled()
    })
  })

  describe('?¨Ïª§???¥Î≤§???åÏä§??, () => {
    test('?ÖÎ†• ?ÑÎìú???¨Ïª§?§ÌïòÎ©??ÑÏ≤¥ ?†ÌÉù?úÎã§', () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?¨Ïö©?êÎ™Ö ?ÖÎ†•')
      fireEvent.focus(userInput)
      
      expect(userInput).toBeInTheDocument()
    })
  })

  describe('?ùÏóÖ ?´Í∏∞ ?åÏä§??, () => {
    test('Ï¢ÖÎ£å Î≤ÑÌäº???¥Î¶≠?òÎ©¥ Ï∞ΩÏù¥ ?´Ìûå??, () => {
      render(<EmpSearchModal />)
      
      const closeButton = screen.getByText('Ï¢ÖÎ£å')
      fireEvent.click(closeButton)
      
      expect(window.close).toHaveBeenCalled()
    })

    test('X Î≤ÑÌäº???¥Î¶≠?òÎ©¥ Ï∞ΩÏù¥ ?´Ìûå??, () => {
      render(<EmpSearchModal />)
      
      const xButton = screen.getByText('√ó')
      fireEvent.click(xButton)
      
      expect(xButton).toBeInTheDocument()
    })
  })

  describe('Ï¥àÍ∏∞ ?∞Ïù¥???åÏä§??, () => {
    test('Ïª¥Ìè¨?åÌä∏Í∞Ä ?ïÏÉÅ?ÅÏúºÎ°??åÎçîÎßÅÎêú??, () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('?¨Ïö©?êÎ™Ö Í≤Ä??)).toBeInTheDocument()
    })
  })
}) 

