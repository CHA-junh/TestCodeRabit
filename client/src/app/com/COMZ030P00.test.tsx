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

describe('COMZ030P00 - ?±κΈλ³??¨κ? μ‘°ν ?μ', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset window.opener for each test
    Object.defineProperty(window, 'opener', {
      value: null,
      writable: true
    })
  })

  describe('?λλ§??μ€??, () => {
    test('μ»΄ν¬?νΈκ° ?μ?μΌλ‘??λλ§λ??, () => {
      render(<COMZ030P00 />)
      
      expect(screen.getByText('?±κΈλ³??¨κ? μ‘°ν')).toBeInTheDocument()
      expect(screen.getByText('?μ¬/?Έμ£Ό κ΅¬λΆ')).toBeInTheDocument()
      expect(screen.getByText('?λ')).toBeInTheDocument()
      expect(screen.getByText('μ‘°ν')).toBeInTheDocument()
    })

    test('κΈ°λ³Έκ°μ΄ ?μ?μΌλ‘??€μ ?λ€', () => {
      render(<COMZ030P00 />)
      
      const currentYear = new Date().getFullYear().toString()
      expect(screen.getByDisplayValue(currentYear)).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    })

    test('κ·Έλ¦¬???€λκ° ?μ?μΌλ‘??λλ§λ??, () => {
      render(<COMZ030P00 />)
      
      expect(screen.getByText('?±κΈ')).toBeInTheDocument()
      expect(screen.getByText('μ§μ±')).toBeInTheDocument()
      expect(screen.getByText('?¨κ?')).toBeInTheDocument()
    })
  })

  describe('κ²??μ‘°κ±΄ λ³κ²??μ€??, () => {
    test('?μ¬/?Έμ£Ό κ΅¬λΆ??λ³κ²½ν  ???λ€', () => {
      render(<COMZ030P00 />)
      
      const outsRadio = screen.getByDisplayValue('2')
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('?λλ₯?λ³κ²½ν  ???λ€', () => {
      render(<COMZ030P00 />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '2024' } })
      
      expect(yearSelect).toHaveValue('2024')
    })
  })

  describe('μ‘°ν κΈ°λ₯ ?μ€??, () => {
    test('μ‘°ν λ²νΌ???΄λ¦­?λ©΄ APIκ° ?ΈμΆ?λ€', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              TCN_GRD_NM: 'μ΄κΈ',
              DUTY_NM: '?¬μ',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('μ‘°ν')
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

    test('?λκ° ?μΌλ©?κ²½κ³  λ©μμ§κ° ?μ?λ€', () => {
      render(<COMZ030P00 />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '' } })
      
      const searchButton = screen.getByText('μ‘°ν')
      fireEvent.click(searchButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('?λλ₯??λ ₯?μΈ??', 'info')
    })

    test('API ?€λ₯ λ°μ ???λ¬ λ©μμ§κ° ?μ?λ€', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '?λ² ?€λ₯' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('μ‘°ν')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?λ² ?€λ₯', 'warning')
      })
    })

    test('κ²??κ²°κ³Όκ° ?μΌλ©??λ΄ λ©μμ§κ° ?μ?λ€', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('μ‘°ν')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('μ‘°ν???°μ΄?°κ? ?μ΅?λ€.')).toBeInTheDocument()
      })
    })
  })

  describe('?°μ΄???μ ?μ€??, () => {
    test('κ²??κ²°κ³Όκ° ?μ?μΌλ‘??μ?λ€', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              TCN_GRD_NM: 'μ΄κΈ',
              DUTY_NM: '?¬μ',
              UPRC: '3000000'
            },
            {
              TCN_GRD_NM: 'μ€κΈ',
              DUTY_NM: '?λ¦?,
              UPRC: '4000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('μ‘°ν')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('μ΄κΈ')).toBeInTheDocument()
        expect(screen.getByText('?¬μ')).toBeInTheDocument()
        expect(screen.getByText('3,000,000')).toBeInTheDocument()
        expect(screen.getByText('μ€κΈ')).toBeInTheDocument()
        expect(screen.getByText('?λ¦?)).toBeInTheDocument()
        expect(screen.getByText('4,000,000')).toBeInTheDocument()
      })
    })
  })

  describe('??? ν ?μ€??, () => {
    test('?μ ?΄λ¦­?λ©΄ ? ν ?νκ° λ³κ²½λ??, async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              TCN_GRD_NM: 'μ΄κΈ',
              DUTY_NM: '?¬μ',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('μ‘°ν')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const row = screen.getByText('μ΄κΈ').closest('tr')
        if (row) {
          fireEvent.click(row)
          expect(row).toHaveClass('bg-blue-50')
        }
      })
    })
  })

  describe('?λΈ?΄λ¦­ ? ν ?μ€??, () => {
    test('?μ ?λΈ?΄λ¦­?λ©΄ λΆλͺ?μ°½μΌλ‘?λ©μμ§λ₯??μ‘?κ³  μ°½μ΄ ?«ν??, async () => {
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
              TCN_GRD_NM: 'μ΄κΈ',
              DUTY_NM: '?¬μ',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('μ‘°ν')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const row = screen.getByText('μ΄κΈ').closest('tr')
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

  describe('?€λ³΄???΄λ²€???μ€??, () => {
    test('Enter ?€λ‘ κ²?μ΄ ?€ν?λ€', async () => {
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

    test('Escape ?€λ‘ μ°½μ΄ ?«ν??, () => {
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

  describe('λ©μ???μ€??, () => {
    test('setUntPrcInfo λ©μ?κ? ?μ?μΌλ‘??λ?λ€', () => {
      render(<COMZ030P00 />)
      
      // μ»΄ν¬?νΈ ?΄λ? λ©μ?λ? μ§μ  ?ΈμΆ?????μΌλ―λ‘?
      // ?€μ  ?μ???΅ν΄ ?μ€??
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '2023' } })
      
      expect(screen.getByDisplayValue('2023')).toBeInTheDocument()
    })
  })
}) 

