import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import COMZ030P00 from './COMZ030P00'

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

describe('COMZ030P00 - ?±Í∏âÎ≥??®Í? Ï°∞Ìöå ?ùÏóÖ', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset window.opener for each test
    Object.defineProperty(window, 'opener', {
      value: null,
      writable: true
    })
  })

  describe('?åÎçîÎß??åÏä§??, () => {
    test('Ïª¥Ìè¨?åÌä∏Í∞Ä ?ïÏÉÅ?ÅÏúºÎ°??åÎçîÎßÅÎêú??, () => {
      render(<COMZ030P00 />)
      
      expect(screen.getByText('?±Í∏âÎ≥??®Í? Ï°∞Ìöå')).toBeInTheDocument()
      expect(screen.getByText('?êÏÇ¨/?∏Ï£º Íµ¨Î∂Ñ')).toBeInTheDocument()
      expect(screen.getByText('?ÑÎèÑ')).toBeInTheDocument()
      expect(screen.getByText('Ï°∞Ìöå')).toBeInTheDocument()
    })

    test('Í∏∞Î≥∏Í∞íÏù¥ ?ïÏÉÅ?ÅÏúºÎ°??§Ï†ï?úÎã§', () => {
      render(<COMZ030P00 />)
      
      const currentYear = new Date().getFullYear().toString()
      expect(screen.getByDisplayValue(currentYear)).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    })

    test('Í∑∏Î¶¨???§ÎçîÍ∞Ä ?ïÏÉÅ?ÅÏúºÎ°??åÎçîÎßÅÎêú??, () => {
      render(<COMZ030P00 />)
      
      expect(screen.getByText('?±Í∏â')).toBeInTheDocument()
      expect(screen.getByText('ÏßÅÏ±Ö')).toBeInTheDocument()
      expect(screen.getByText('?®Í?')).toBeInTheDocument()
    })
  })

  describe('Í≤Ä??Ï°∞Í±¥ Î≥ÄÍ≤??åÏä§??, () => {
    test('?êÏÇ¨/?∏Ï£º Íµ¨Î∂Ñ??Î≥ÄÍ≤ΩÌï† ???àÎã§', () => {
      render(<COMZ030P00 />)
      
      const outsRadio = screen.getByDisplayValue('2')
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('?ÑÎèÑÎ•?Î≥ÄÍ≤ΩÌï† ???àÎã§', () => {
      render(<COMZ030P00 />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '2024' } })
      
      expect(yearSelect).toHaveValue('2024')
    })
  })

  describe('Ï°∞Ìöå Í∏∞Îä• ?åÏä§??, () => {
    test('Ï°∞Ìöå Î≤ÑÌäº???¥Î¶≠?òÎ©¥ APIÍ∞Ä ?∏Ï∂ú?úÎã§', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              TCN_GRD_NM: 'Ï¥àÍ∏â',
              DUTY_NM: '?¨Ïõê',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/COMZ030P00/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ownOutsDiv: '1',
            year: new Date().getFullYear().toString(),
            bsnNo: null
          })
        })
      })
    })

    test('?ÑÎèÑÍ∞Ä ?ÜÏúºÎ©?Í≤ΩÍ≥† Î©îÏãúÏßÄÍ∞Ä ?úÏãú?úÎã§', () => {
      render(<COMZ030P00 />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '' } })
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('?ÑÎèÑÎ•??ÖÎ†•?òÏÑ∏??', 'info')
    })

    test('API ?§Î•ò Î∞úÏÉù ???êÎü¨ Î©îÏãúÏßÄÍ∞Ä ?úÏãú?úÎã§', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '?úÎ≤Ñ ?§Î•ò' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?úÎ≤Ñ ?§Î•ò', 'warning')
      })
    })

    test('Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ÜÏúºÎ©??àÎÇ¥ Î©îÏãúÏßÄÍ∞Ä ?úÏãú?úÎã§', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('Ï°∞Ìöå???∞Ïù¥?∞Í? ?ÜÏäµ?àÎã§.')).toBeInTheDocument()
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
              TCN_GRD_NM: 'Ï¥àÍ∏â',
              DUTY_NM: '?¨Ïõê',
              UPRC: '3000000'
            },
            {
              TCN_GRD_NM: 'Ï§ëÍ∏â',
              DUTY_NM: '?ÄÎ¶?,
              UPRC: '4000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('Ï¥àÍ∏â')).toBeInTheDocument()
        expect(screen.getByText('?¨Ïõê')).toBeInTheDocument()
        expect(screen.getByText('3,000,000')).toBeInTheDocument()
        expect(screen.getByText('Ï§ëÍ∏â')).toBeInTheDocument()
        expect(screen.getByText('?ÄÎ¶?)).toBeInTheDocument()
        expect(screen.getByText('4,000,000')).toBeInTheDocument()
      })
    })
  })

  describe('???†ÌÉù ?åÏä§??, () => {
    test('?âÏùÑ ?¥Î¶≠?òÎ©¥ ?†ÌÉù ?ÅÌÉúÍ∞Ä Î≥ÄÍ≤ΩÎêú??, async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              TCN_GRD_NM: 'Ï¥àÍ∏â',
              DUTY_NM: '?¨Ïõê',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const row = screen.getByText('Ï¥àÍ∏â').closest('tr')
        if (row) {
          fireEvent.click(row)
          expect(row).toHaveClass('bg-blue-50')
        }
      })
    })
  })

  describe('?îÎ∏î?¥Î¶≠ ?†ÌÉù ?åÏä§??, () => {
    test('?âÏùÑ ?îÎ∏î?¥Î¶≠?òÎ©¥ Î∂ÄÎ™?Ï∞ΩÏúºÎ°?Î©îÏãúÏßÄÎ•??ÑÏÜ°?òÍ≥† Ï∞ΩÏù¥ ?´Ìûå??, async () => {
      // Mock window.opener
      Object.defineProperty(window, 'opener', {
        value: mockOpener,
        writable: true
      })

      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              TCN_GRD_NM: 'Ï¥àÍ∏â',
              DUTY_NM: '?¨Ïõê',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const row = screen.getByText('Ï¥àÍ∏â').closest('tr')
        if (row) {
          fireEvent.doubleClick(row)
          expect(mockOpener.postMessage).toHaveBeenCalledWith({
            type: 'PRICE_SELECTED',
            data: { price: '3000000' },
            source: 'COMZ030P00',
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

      render(<COMZ030P00 />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.keyDown(yearSelect, { key: 'Enter' })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })

    test('Escape ?§Î°ú Ï∞ΩÏù¥ ?´Ìûå??, () => {
      // Mock window.opener
      Object.defineProperty(window, 'opener', {
        value: mockOpener,
        writable: true
      })

      render(<COMZ030P00 />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.keyDown(yearSelect, { key: 'Escape' })
      
      expect(window.close).toHaveBeenCalled()
    })
  })

  describe('Î©îÏÑú???åÏä§??, () => {
    test('setUntPrcInfo Î©îÏÑú?úÍ? ?ïÏÉÅ?ÅÏúºÎ°??ëÎèô?úÎã§', () => {
      render(<COMZ030P00 />)
      
      // Ïª¥Ìè¨?åÌä∏ ?¥Î? Î©îÏÑú?úÎ? ÏßÅÏ†ë ?∏Ï∂ú?????ÜÏúºÎØÄÎ°?
      // ?§Ï†ú ?ôÏûë???µÌï¥ ?åÏä§??
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '2023' } })
      
      expect(screen.getByDisplayValue('2023')).toBeInTheDocument()
    })
  })
}) 

