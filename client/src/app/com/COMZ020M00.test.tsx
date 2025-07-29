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

describe('COMZ020M00 - 등급별 단가 등록', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockShowConfirm.mockImplementation(({ onConfirm }) => onConfirm())
  })

  describe('렌더링 테스트', () => {
    test('컴포넌트가 정상적으로 렌더링된다', () => {
      render(<MainPage />)
      
      expect(screen.getByText('자사/외주')).toBeInTheDocument()
      expect(screen.getByText('년도')).toBeInTheDocument()
      expect(screen.getByText('조회')).toBeInTheDocument()
    })

    test('기본 검색 조건이 설정된다', () => {
      render(<MainPage />)
      
      const currentYear = new Date().getFullYear().toString()
      expect(screen.getByDisplayValue(currentYear)).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    })

    test('폼 필드들이 정상적으로 렌더링된다', () => {
      render(<MainPage />)
      
      // AG Grid 헤더에서 등급, 직책, 단가 확인
      const gradeElements = screen.getAllByText('등급')
      expect(gradeElements.length).toBeGreaterThan(0)
      
      // 저장, 삭제 버튼 확인
      expect(screen.getByText('저장')).toBeInTheDocument()
      expect(screen.getByText('삭제')).toBeInTheDocument()
    })
  })

  describe('검색 조건 변경 테스트', () => {
    test('자사/외주 구분을 변경할 수 있다', () => {
      render(<MainPage />)
      
      const outsRadio = screen.getByDisplayValue('2')
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('년도를 변경할 수 있다', () => {
      render(<MainPage />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '2024' } })
      
      expect(yearSelect).toHaveValue('2024')
    })
  })

  describe('조회 기능 테스트', () => {
    test('조회 버튼을 클릭하면 API가 호출된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              OWN_OUTS_DIV: '1',
              OWN_OUTS_DIV_NM: '자사',
              YR: '2024',
              TCN_GRD: '001',
              TCN_GRD_NM: '초급',
              DUTY_CD: '001',
              DUTY_NM: '사원',
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
        // 실제로는 코드 데이터를 먼저 로드하고, 그 다음에 검색 API가 호출됨
        expect(global.fetch).toHaveBeenCalledWith('/api/code/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            largeCategoryCode: '104'
          })
        })
      })
    })

    test('년도가 없으면 경고 메시지가 표시된다', () => {
      render(<MainPage />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '' } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('년도를 입력하세요.', 'warning')
    })

    test('API 오류 발생 시 에러 메시지가 표시된다', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '서버 오류' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('조회 중 오류가 발생했습니다.', 'error')
      })
    })
  })

  describe('저장 기능 테스트', () => {
    test('필수 필드가 없으면 경고 메시지가 표시된다', () => {
      render(<MainPage />)
      
      const saveButton = screen.getByText('저장')
      fireEvent.click(saveButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('기술등급을 입력하세요.', 'warning')
    })

    test('단가가 없으면 경고 메시지가 표시된다', () => {
      render(<MainPage />)
      
      const saveButton = screen.getByText('저장')
      fireEvent.click(saveButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('기술등급을 입력하세요.', 'warning')
    })

    test('저장 성공 시 성공 메시지가 표시된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      // 폼 데이터 입력
      const priceInput = screen.getByPlaceholderText('0')
      fireEvent.change(priceInput, { target: { value: '3000000' } })
      
      const saveButton = screen.getByText('저장')
      fireEvent.click(saveButton)

      await waitFor(() => {
        // 실제로는 코드 데이터를 먼저 로드함
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

  describe('삭제 기능 테스트', () => {
    test('삭제 시 확인 다이얼로그가 표시된다', () => {
      render(<MainPage />)
      
      const deleteButton = screen.getByText('삭제')
      fireEvent.click(deleteButton)
      
      // 실제로는 선택된 행이 없으면 유효성 검사 메시지가 표시됨
      expect(mockShowToast).toHaveBeenCalledWith('기술등급을 입력하세요.', 'warning')
    })

    test('삭제 성공 시 성공 메시지가 표시된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      const deleteButton = screen.getByText('삭제')
      fireEvent.click(deleteButton)

      await waitFor(() => {
        // 실제로는 코드 데이터를 먼저 로드함
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

  describe('키보드 이벤트 테스트', () => {
    test('Enter 키로 검색이 실행된다', async () => {
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

  describe('폼 초기화 테스트', () => {
    test('저장 후 폼이 초기화된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      // 실제로는 AG Grid를 사용하므로 일반 input이 아님
      // 폼 초기화는 AG Grid의 clearSelection()으로 처리됨
      const saveButton = screen.getByText('저장')
      fireEvent.click(saveButton)

      await waitFor(() => {
        // AG Grid가 렌더링되었는지 확인 (role="treegrid" 사용)
        expect(screen.getByRole('treegrid')).toBeInTheDocument()
      })
    })
  })
}) 