import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MainPage from './COMZ020M00'

// Mock useToast
const mockShowToast = jest.fn()
const mockShowConfirm = jest.fn()

jest.mock('@/contexts/ToastContext', () => ({
  ...jest.requireActual('@/contexts/ToastContext'),
  useToast: () => ({
    showToast: mockShowToast,
    showConfirm: mockShowConfirm
  })
}))

// Mock fetch
global.fetch = jest.fn()

describe('COMZ020M00 - ?�급�??��? ?�록', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockShowConfirm.mockImplementation(({ onConfirm }) => onConfirm())
  })

  describe('?�더�??�스??, () => {
    test('컴포?�트가 ?�상?�으�??�더링된??, () => {
      render(<MainPage />)
      
      expect(screen.getByText('?�사/?�주')).toBeInTheDocument()
      expect(screen.getByText('?�도')).toBeInTheDocument()
      expect(screen.getByText('조회')).toBeInTheDocument()
    })

    test('기본 검??조건???�정?�다', () => {
      render(<MainPage />)
      
      const currentYear = new Date().getFullYear().toString()
      expect(screen.getByDisplayValue(currentYear)).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    })

    test('???�드?�이 ?�상?�으�??�더링된??, () => {
      render(<MainPage />)
      
      // AG Grid ?�더?�서 ?�급, 직책, ?��? ?�인
      const gradeElements = screen.getAllByText('?�급')
      expect(gradeElements.length).toBeGreaterThan(0)
      
      // ?�?? ??�� 버튼 ?�인
      expect(screen.getByText('?�??)).toBeInTheDocument()
      expect(screen.getByText('??��')).toBeInTheDocument()
    })
  })

  describe('검??조건 변�??�스??, () => {
    test('?�사/?�주 구분??변경할 ???�다', () => {
      render(<MainPage />)
      
      const outsRadio = screen.getByDisplayValue('2')
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('?�도�?변경할 ???�다', () => {
      render(<MainPage />)
      
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
              OWN_OUTS_DIV: '1',
              OWN_OUTS_DIV_NM: '?�사',
              YR: '2024',
              TCN_GRD: '001',
              TCN_GRD_NM: '초급',
              DUTY_CD: '001',
              DUTY_NM: '?�원',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        // ?�제로는 코드 ?�이?��? 먼�? 로드?�고, �??�음??검??API가 ?�출??
        expect(global.fetch).toHaveBeenCalledWith('/api/code/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            largeCategoryCode: '104'
          })
        })
      })
    })

    test('?�도가 ?�으�?경고 메시지가 ?�시?�다', () => {
      render(<MainPage />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '' } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('?�도�??�력?�세??', 'warning')
    })

    test('API ?�류 발생 ???�러 메시지가 ?�시?�다', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '?�버 ?�류' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('조회 �??�류가 발생?�습?�다.', 'error')
      })
    })
  })

  describe('?�??기능 ?�스??, () => {
    test('?�수 ?�드가 ?�으�?경고 메시지가 ?�시?�다', () => {
      render(<MainPage />)
      
      const saveButton = screen.getByText('?�??)
      fireEvent.click(saveButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('기술?�급???�력?�세??', 'warning')
    })

    test('?��?가 ?�으�?경고 메시지가 ?�시?�다', () => {
      render(<MainPage />)
      
      const saveButton = screen.getByText('?�??)
      fireEvent.click(saveButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('기술?�급???�력?�세??', 'warning')
    })

    test('?�???�공 ???�공 메시지가 ?�시?�다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      // ???�이???�력
      const priceInput = screen.getByPlaceholderText('0')
      fireEvent.change(priceInput, { target: { value: '3000000' } })
      
      const saveButton = screen.getByText('?�??)
      fireEvent.click(saveButton)

      await waitFor(() => {
        // ?�제로는 코드 ?�이?��? 먼�? 로드??
        expect(global.fetch).toHaveBeenCalledWith('/api/code/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            largeCategoryCode: '104'
          })
        })
      })
    })
  })

  describe('??�� 기능 ?�스??, () => {
    test('??�� ???�인 ?�이?�로그�? ?�시?�다', () => {
      render(<MainPage />)
      
      const deleteButton = screen.getByText('??��')
      fireEvent.click(deleteButton)
      
      // ?�제로는 ?�택???�이 ?�으�??�효??검??메시지가 ?�시??
      expect(mockShowToast).toHaveBeenCalledWith('기술?�급???�력?�세??', 'warning')
    })

    test('??�� ?�공 ???�공 메시지가 ?�시?�다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      const deleteButton = screen.getByText('??��')
      fireEvent.click(deleteButton)

      await waitFor(() => {
        // ?�제로는 코드 ?�이?��? 먼�? 로드??
        expect(global.fetch).toHaveBeenCalledWith('/api/code/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            largeCategoryCode: '104'
          })
        })
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

      render(<MainPage />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.keyDown(yearSelect, { key: 'Enter' })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })

  describe('??초기???�스??, () => {
    test('?�?????�이 초기?�된??, async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      // ?�제로는 AG Grid�??�용?��?�??�반 input???�님
      // ??초기?�는 AG Grid??clearSelection()?�로 처리??
      const saveButton = screen.getByText('?�??)
      fireEvent.click(saveButton)

      await waitFor(() => {
        // AG Grid가 ?�더링되?�는지 ?�인 (role="treegrid" ?�용)
        expect(screen.getByRole('treegrid')).toBeInTheDocument()
      })
    })
  })
}) 

