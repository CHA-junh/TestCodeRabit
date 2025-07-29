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

describe('COMZ030P00 - ?�급�??��? 조회 ?�업', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset window.opener for each test
    Object.defineProperty(window, 'opener', {
      value: null,
      writable: true
    })
  })

  describe('?�더�??�스??, () => {
    test('컴포?�트가 ?�상?�으�??�더링된??, () => {
      render(<COMZ030P00 />)
      
      expect(screen.getByText('?�급�??��? 조회')).toBeInTheDocument()
      expect(screen.getByText('?�사/?�주 구분')).toBeInTheDocument()
      expect(screen.getByText('?�도')).toBeInTheDocument()
      expect(screen.getByText('조회')).toBeInTheDocument()
    })

    test('기본값이 ?�상?�으�??�정?�다', () => {
      render(<COMZ030P00 />)
      
      const currentYear = new Date().getFullYear().toString()
      expect(screen.getByDisplayValue(currentYear)).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    })

    test('그리???�더가 ?�상?�으�??�더링된??, () => {
      render(<COMZ030P00 />)
      
      expect(screen.getByText('?�급')).toBeInTheDocument()
      expect(screen.getByText('직책')).toBeInTheDocument()
      expect(screen.getByText('?��?')).toBeInTheDocument()
    })
  })

  describe('검??조건 변�??�스??, () => {
    test('?�사/?�주 구분??변경할 ???�다', () => {
      render(<COMZ030P00 />)
      
      const outsRadio = screen.getByDisplayValue('2')
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('?�도�?변경할 ???�다', () => {
      render(<COMZ030P00 />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '2024' } })
      
      expect(yearSelect).toHaveValue('2024')
    })
  })

  describe('조회 기능 ?�스??, () => {
    test('조회 버튼???�릭?�면 API가 ?�출?�다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              TCN_GRD_NM: '초급',
              DUTY_NM: '?�원',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('조회')
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

    test('?�도가 ?�으�?경고 메시지가 ?�시?�다', () => {
      render(<COMZ030P00 />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '' } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('?�도�??�력?�세??', 'info')
    })

    test('API ?�류 발생 ???�러 메시지가 ?�시?�다', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '?�버 ?�류' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?�버 ?�류', 'warning')
      })
    })

    test('검??결과가 ?�으�??�내 메시지가 ?�시?�다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('조회???�이?��? ?�습?�다.')).toBeInTheDocument()
      })
    })
  })

  describe('?�이???�시 ?�스??, () => {
    test('검??결과가 ?�상?�으�??�시?�다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              TCN_GRD_NM: '초급',
              DUTY_NM: '?�원',
              UPRC: '3000000'
            },
            {
              TCN_GRD_NM: '중급',
              DUTY_NM: '?��?,
              UPRC: '4000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('초급')).toBeInTheDocument()
        expect(screen.getByText('?�원')).toBeInTheDocument()
        expect(screen.getByText('3,000,000')).toBeInTheDocument()
        expect(screen.getByText('중급')).toBeInTheDocument()
        expect(screen.getByText('?��?)).toBeInTheDocument()
        expect(screen.getByText('4,000,000')).toBeInTheDocument()
      })
    })
  })

  describe('???�택 ?�스??, () => {
    test('?�을 ?�릭?�면 ?�택 ?�태가 변경된??, async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              TCN_GRD_NM: '초급',
              DUTY_NM: '?�원',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const row = screen.getByText('초급').closest('tr')
        if (row) {
          fireEvent.click(row)
          expect(row).toHaveClass('bg-blue-50')
        }
      })
    })
  })

  describe('?�블?�릭 ?�택 ?�스??, () => {
    test('?�을 ?�블?�릭?�면 부�?창으�?메시지�??�송?�고 창이 ?�힌??, async () => {
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
              TCN_GRD_NM: '초급',
              DUTY_NM: '?�원',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const row = screen.getByText('초급').closest('tr')
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

  describe('?�보???�벤???�스??, () => {
    test('Enter ?�로 검?�이 ?�행?�다', async () => {
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

    test('Escape ?�로 창이 ?�힌??, () => {
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

  describe('메서???�스??, () => {
    test('setUntPrcInfo 메서?��? ?�상?�으�??�동?�다', () => {
      render(<COMZ030P00 />)
      
      // 컴포?�트 ?��? 메서?��? 직접 ?�출?????�으므�?
      // ?�제 ?�작???�해 ?�스??
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '2023' } })
      
      expect(screen.getByDisplayValue('2023')).toBeInTheDocument()
    })
  })
}) 

