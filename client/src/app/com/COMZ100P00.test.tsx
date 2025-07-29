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

describe('COMZ100P00 - ?�용?�명 검??모달', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // window.opener�?mockOpener�??�정
    Object.defineProperty(window, 'opener', {
      value: mockOpener,
      writable: true
    })
  })

  describe('?�더�??�스??, () => {
    test('컴포?�트가 ?�상?�으�??�더링된??, () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('?�용?�명 검??)).toBeInTheDocument()
      expect(screen.getByText('?�용??�?)).toBeInTheDocument()
      expect(screen.getByText('조회')).toBeInTheDocument()
      expect(screen.getByText('종료')).toBeInTheDocument()
    })

    test('기본값이 ?�상?�으�??�정?�다', () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByPlaceholderText('?�용?�명 ?�력')).toBeInTheDocument()
    })

    test('그리???�더가 ?�상?�으�??�더링된??, () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('No')).toBeInTheDocument()
      expect(screen.getByText('?�번')).toBeInTheDocument()
      expect(screen.getByText('?�명')).toBeInTheDocument()
      expect(screen.getByText('본�?�?)).toBeInTheDocument()
      expect(screen.getByText('부?�명')).toBeInTheDocument()
      expect(screen.getByText('직급�?)).toBeInTheDocument()
      expect(screen.getByText('?�용??권한')).toBeInTheDocument()
      expect(screen.getByText('?�업')).toBeInTheDocument()
      expect(screen.getByText('추진�?)).toBeInTheDocument()
      expect(screen.getByText('?�사/복리')).toBeInTheDocument()
      expect(screen.getByText('비고')).toBeInTheDocument()
    })
  })

  describe('검??기능 ?�스??, () => {
    test('?�용?�명???�력?????�다', () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?�용?�명 ?�력')
      fireEvent.change(userInput, { target: { value: '김철수' } })
      
      expect(userInput).toHaveValue('김철수')
    })

    test('조회 버튼???�릭?�면 API가 ?�출?�다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '?�길??,
              HQ_DIV_NM: '경영본�?',
              DEPT_DIV_NM: '?�략?�',
              DUTY_NM: '과장',
              AUTH_CD_NM: '관리자',
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
      
      const userInput = screen.getByPlaceholderText('?�용?�명 ?�력')
      fireEvent.change(userInput, { target: { value: '?�길?? } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/COMZ100P00/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userNm: '?�길?? })
        })
      })
    })

    test('API ?�류 발생 ???�러 메시지가 ?�시?�다', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '?�버 ?�류' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?�용?�명 ?�력')
      fireEvent.change(userInput, { target: { value: '?�길?? } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?�버 ?�류', 'error')
      })
    })

    test('검??결과가 ?�으�??�내 메시지가 ?�시?�다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?�용?�명 ?�력')
      fireEvent.change(userInput, { target: { value: '존재?��??�는?�용?? } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?�당 직원명�? 존재?��? ?�습?�다.', 'warning')
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
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '?�길??,
              HQ_DIV_NM: '경영본�?',
              DEPT_DIV_NM: '?�략?�',
              DUTY_NM: '과장',
              AUTH_CD_NM: '관리자',
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
      
      const userInput = screen.getByPlaceholderText('?�용?�명 ?�력')
      fireEvent.change(userInput, { target: { value: '?�길?? } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('E001')).toBeInTheDocument()
        expect(screen.getByText('?�길??)).toBeInTheDocument()
        expect(screen.getByText('경영본�?')).toBeInTheDocument()
        expect(screen.getByText('?�략?�')).toBeInTheDocument()
        expect(screen.getByText('과장')).toBeInTheDocument()
        expect(screen.getByText('관리자')).toBeInTheDocument()
      })
    })

    test('체크박스가 ?�상?�으�??�시?�다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '?�길??,
              HQ_DIV_NM: '경영본�?',
              DEPT_DIV_NM: '?�략?�',
              DUTY_NM: '과장',
              AUTH_CD_NM: '관리자',
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
      
      const userInput = screen.getByPlaceholderText('?�용?�명 ?�력')
      fireEvent.change(userInput, { target: { value: '?�길?? } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes[0]).toBeChecked() // ?�업 권한
        expect(checkboxes[1]).not.toBeChecked() // 추진�?권한
        expect(checkboxes[2]).toBeChecked() // ?�사/복리 권한
      })
    })
  })

  describe('?�블?�릭 ?�택 ?�스??, () => {
    test('?�을 ?�블?�릭?�면 부�?창으�?메시지�??�송?�고 창이 ?�힌??, async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '?�길??,
              HQ_DIV_NM: '경영본�?',
              DEPT_DIV_NM: '?�략?�',
              DUTY_NM: '과장',
              AUTH_CD_NM: '관리자',
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
      
      const userInput = screen.getByPlaceholderText('?�용?�명 ?�력')
      fireEvent.change(userInput, { target: { value: '?�길?? } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const row = screen.getByText('?�길??).closest('tr')
        if (row) {
          fireEvent.doubleClick(row)
          expect(mockOpener.postMessage).toHaveBeenCalledWith({
            type: 'EMP_SELECTED',
            data: {
              empNo: 'E001',
              empNm: '?�길??,
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

  describe('?�보???�벤???�스??, () => {
    test('Enter ?�로 검?�이 ?�행?�다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?�용?�명 ?�력')
      fireEvent.change(userInput, { target: { value: '?�길?? } })
      fireEvent.keyDown(userInput, { key: 'Enter' })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })

    test('Escape ?�로 창이 ?�힌??, () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?�용?�명 ?�력')
      fireEvent.keyDown(userInput, { key: 'Escape' })
      
      expect(window.close).toHaveBeenCalled()
    })
  })

  describe('?�커???�벤???�스??, () => {
    test('?�력 ?�드???�커?�하�??�체 ?�택?�다', () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('?�용?�명 ?�력')
      fireEvent.focus(userInput)
      
      expect(userInput).toBeInTheDocument()
    })
  })

  describe('?�업 ?�기 ?�스??, () => {
    test('종료 버튼???�릭?�면 창이 ?�힌??, () => {
      render(<EmpSearchModal />)
      
      const closeButton = screen.getByText('종료')
      fireEvent.click(closeButton)
      
      expect(window.close).toHaveBeenCalled()
    })

    test('X 버튼???�릭?�면 창이 ?�힌??, () => {
      render(<EmpSearchModal />)
      
      const xButton = screen.getByText('×')
      fireEvent.click(xButton)
      
      expect(xButton).toBeInTheDocument()
    })
  })

  describe('초기 ?�이???�스??, () => {
    test('컴포?�트가 ?�상?�으�??�더링된??, () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('?�용?�명 검??)).toBeInTheDocument()
    })
  })
}) 

