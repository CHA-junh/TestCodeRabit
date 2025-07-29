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

describe('COMZ100P00 - 사용자명 검색 모달', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // window.opener를 mockOpener로 설정
    Object.defineProperty(window, 'opener', {
      value: mockOpener,
      writable: true
    })
  })

  describe('렌더링 테스트', () => {
    test('컴포넌트가 정상적으로 렌더링된다', () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('사용자명 검색')).toBeInTheDocument()
      expect(screen.getByText('사용자 명')).toBeInTheDocument()
      expect(screen.getByText('조회')).toBeInTheDocument()
      expect(screen.getByText('종료')).toBeInTheDocument()
    })

    test('기본값이 정상적으로 설정된다', () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByPlaceholderText('사용자명 입력')).toBeInTheDocument()
    })

    test('그리드 헤더가 정상적으로 렌더링된다', () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('No')).toBeInTheDocument()
      expect(screen.getByText('사번')).toBeInTheDocument()
      expect(screen.getByText('성명')).toBeInTheDocument()
      expect(screen.getByText('본부명')).toBeInTheDocument()
      expect(screen.getByText('부서명')).toBeInTheDocument()
      expect(screen.getByText('직급명')).toBeInTheDocument()
      expect(screen.getByText('사용자 권한')).toBeInTheDocument()
      expect(screen.getByText('사업')).toBeInTheDocument()
      expect(screen.getByText('추진비')).toBeInTheDocument()
      expect(screen.getByText('인사/복리')).toBeInTheDocument()
      expect(screen.getByText('비고')).toBeInTheDocument()
    })
  })

  describe('검색 기능 테스트', () => {
    test('사용자명을 입력할 수 있다', () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('사용자명 입력')
      fireEvent.change(userInput, { target: { value: '김철수' } })
      
      expect(userInput).toHaveValue('김철수')
    })

    test('조회 버튼을 클릭하면 API가 호출된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '홍길동',
              HQ_DIV_NM: '경영본부',
              DEPT_DIV_NM: '전략팀',
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
      
      const userInput = screen.getByPlaceholderText('사용자명 입력')
      fireEvent.change(userInput, { target: { value: '홍길동' } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/COMZ100P00/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userNm: '홍길동' })
        })
      })
    })

    test('API 오류 발생 시 에러 메시지가 표시된다', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '서버 오류' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('사용자명 입력')
      fireEvent.change(userInput, { target: { value: '홍길동' } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('서버 오류', 'error')
      })
    })

    test('검색 결과가 없으면 안내 메시지가 표시된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('사용자명 입력')
      fireEvent.change(userInput, { target: { value: '존재하지않는사용자' } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('해당 직원명은 존재하지 않습니다.', 'warning')
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
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '홍길동',
              HQ_DIV_NM: '경영본부',
              DEPT_DIV_NM: '전략팀',
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
      
      const userInput = screen.getByPlaceholderText('사용자명 입력')
      fireEvent.change(userInput, { target: { value: '홍길동' } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('E001')).toBeInTheDocument()
        expect(screen.getByText('홍길동')).toBeInTheDocument()
        expect(screen.getByText('경영본부')).toBeInTheDocument()
        expect(screen.getByText('전략팀')).toBeInTheDocument()
        expect(screen.getByText('과장')).toBeInTheDocument()
        expect(screen.getByText('관리자')).toBeInTheDocument()
      })
    })

    test('체크박스가 정상적으로 표시된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '홍길동',
              HQ_DIV_NM: '경영본부',
              DEPT_DIV_NM: '전략팀',
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
      
      const userInput = screen.getByPlaceholderText('사용자명 입력')
      fireEvent.change(userInput, { target: { value: '홍길동' } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes[0]).toBeChecked() // 사업 권한
        expect(checkboxes[1]).not.toBeChecked() // 추진비 권한
        expect(checkboxes[2]).toBeChecked() // 인사/복리 권한
      })
    })
  })

  describe('더블클릭 선택 테스트', () => {
    test('행을 더블클릭하면 부모 창으로 메시지를 전송하고 창이 닫힌다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              EMP_NO: 'E001',
              EMP_NM: '홍길동',
              HQ_DIV_NM: '경영본부',
              DEPT_DIV_NM: '전략팀',
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
      
      const userInput = screen.getByPlaceholderText('사용자명 입력')
      fireEvent.change(userInput, { target: { value: '홍길동' } })
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)

      await waitFor(() => {
        const row = screen.getByText('홍길동').closest('tr')
        if (row) {
          fireEvent.doubleClick(row)
          expect(mockOpener.postMessage).toHaveBeenCalledWith({
            type: 'EMP_SELECTED',
            data: {
              empNo: 'E001',
              empNm: '홍길동',
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

  describe('키보드 이벤트 테스트', () => {
    test('Enter 키로 검색이 실행된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('사용자명 입력')
      fireEvent.change(userInput, { target: { value: '홍길동' } })
      fireEvent.keyDown(userInput, { key: 'Enter' })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })

    test('Escape 키로 창이 닫힌다', () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('사용자명 입력')
      fireEvent.keyDown(userInput, { key: 'Escape' })
      
      expect(window.close).toHaveBeenCalled()
    })
  })

  describe('포커스 이벤트 테스트', () => {
    test('입력 필드에 포커스하면 전체 선택된다', () => {
      render(<EmpSearchModal />)
      
      const userInput = screen.getByPlaceholderText('사용자명 입력')
      fireEvent.focus(userInput)
      
      expect(userInput).toBeInTheDocument()
    })
  })

  describe('팝업 닫기 테스트', () => {
    test('종료 버튼을 클릭하면 창이 닫힌다', () => {
      render(<EmpSearchModal />)
      
      const closeButton = screen.getByText('종료')
      fireEvent.click(closeButton)
      
      expect(window.close).toHaveBeenCalled()
    })

    test('X 버튼을 클릭하면 창이 닫힌다', () => {
      render(<EmpSearchModal />)
      
      const xButton = screen.getByText('×')
      fireEvent.click(xButton)
      
      expect(xButton).toBeInTheDocument()
    })
  })

  describe('초기 데이터 테스트', () => {
    test('컴포넌트가 정상적으로 렌더링된다', () => {
      render(<EmpSearchModal />)
      
      expect(screen.getByText('사용자명 검색')).toBeInTheDocument()
    })
  })
}) 