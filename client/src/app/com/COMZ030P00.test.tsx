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

describe('COMZ030P00 - 등급별 단가 조회 팝업', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset window.opener for each test
    Object.defineProperty(window, 'opener', {
      value: null,
      writable: true
    })
  })

  describe('렌더링 테스트', () => {
    test('컴포넌트가 정상적으로 렌더링된다', () => {
      render(<COMZ030P00 />)
      
      expect(screen.getByText('등급별 단가 조회')).toBeInTheDocument()
      expect(screen.getByText('자사/외주 구분')).toBeInTheDocument()
      expect(screen.getByText('년도')).toBeInTheDocument()
      expect(screen.getByText('조회')).toBeInTheDocument()
    })

    test('기본값이 정상적으로 설정된다', () => {
      render(<COMZ030P00 />)
      
      const currentYear = new Date().getFullYear().toString()
      expect(screen.getByDisplayValue(currentYear)).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    })

    test('그리드 헤더가 정상적으로 렌더링된다', () => {
      render(<COMZ030P00 />)
      
      expect(screen.getByText('등급')).toBeInTheDocument()
      expect(screen.getByText('직책')).toBeInTheDocument()
      expect(screen.getByText('단가')).toBeInTheDocument()
    })
  })

  describe('검색 조건 변경 테스트', () => {
    test('자사/외주 구분을 변경할 수 있다', () => {
      render(<COMZ030P00 />)
      
      const outsRadio = screen.getByDisplayValue('2')
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('년도를 변경할 수 있다', () => {
      render(<COMZ030P00 />)
      
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
              TCN_GRD_NM: '초급',
              DUTY_NM: '사원',
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

    test('년도가 없으면 경고 메시지가 표시된다', () => {
      render(<COMZ030P00 />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '' } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('년도를 입력하세요.', 'info')
    })

    test('API 오류 발생 시 에러 메시지가 표시된다', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '서버 오류' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('서버 오류', 'warning')
      })
    })

    test('검색 결과가 없으면 안내 메시지가 표시된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ030P00 />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('조회된 데이터가 없습니다.')).toBeInTheDocument()
      })
    })
  })

  describe('데이터 표시 테스트', () => {
    test('검색 결과가 정상적으로 표시된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              TCN_GRD_NM: '초급',
              DUTY_NM: '사원',
              UPRC: '3000000'
            },
            {
              TCN_GRD_NM: '중급',
              DUTY_NM: '대리',
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
        expect(screen.getByText('사원')).toBeInTheDocument()
        expect(screen.getByText('3,000,000')).toBeInTheDocument()
        expect(screen.getByText('중급')).toBeInTheDocument()
        expect(screen.getByText('대리')).toBeInTheDocument()
        expect(screen.getByText('4,000,000')).toBeInTheDocument()
      })
    })
  })

  describe('행 선택 테스트', () => {
    test('행을 클릭하면 선택 상태가 변경된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              TCN_GRD_NM: '초급',
              DUTY_NM: '사원',
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

  describe('더블클릭 선택 테스트', () => {
    test('행을 더블클릭하면 부모 창으로 메시지를 전송하고 창이 닫힌다', async () => {
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
              DUTY_NM: '사원',
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

  describe('키보드 이벤트 테스트', () => {
    test('Enter 키로 검색이 실행된다', async () => {
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

    test('Escape 키로 창이 닫힌다', () => {
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

  describe('메서드 테스트', () => {
    test('setUntPrcInfo 메서드가 정상적으로 작동한다', () => {
      render(<COMZ030P00 />)
      
      // 컴포넌트 내부 메서드를 직접 호출할 수 없으므로
      // 실제 동작을 통해 테스트
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '2023' } })
      
      expect(screen.getByDisplayValue('2023')).toBeInTheDocument()
    })
  })
}) 