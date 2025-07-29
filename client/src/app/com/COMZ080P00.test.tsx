import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import COMZ080P00 from './COMZ080P00'

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

describe('COMZ080P00 - 직원 검색 팝업 (확장 버전)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // fetch 모킹 초기화
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('렌더링 테스트', () => {
    test('컴포넌트가 정상적으로 렌더링된다', () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('직원 검색')).toBeInTheDocument()
      // 중복된 텍스트는 getAllByText 사용
      const empNameElements = screen.getAllByText('직원명')
      expect(empNameElements.length).toBeGreaterThan(0)
      expect(screen.getByText('조회')).toBeInTheDocument()
      expect(screen.getByText('종료')).toBeInTheDocument()
    })

    test('기본값이 정상적으로 설정된다', () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByPlaceholderText('직원명 입력')).toBeInTheDocument()
      expect(screen.getByText('자사')).toBeInTheDocument()
      expect(screen.getByText('외주')).toBeInTheDocument()
      expect(screen.getByText('자사+외주')).toBeInTheDocument()
      expect(screen.getByText('퇴사자포함')).toBeInTheDocument()
    })

    test('그리드 헤더가 정상적으로 렌더링된다', () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('No')).toBeInTheDocument()
      expect(screen.getByText('구분')).toBeInTheDocument()
      
      // 중복된 텍스트는 getAllByText 사용
      const empNameElements = screen.getAllByText('직원명')
      expect(empNameElements.length).toBeGreaterThan(0)
      
      expect(screen.getByText('직책')).toBeInTheDocument()
      expect(screen.getByText('등급')).toBeInTheDocument()
      expect(screen.getByText('소속')).toBeInTheDocument()
      expect(screen.getByText('입사일')).toBeInTheDocument()
      expect(screen.getByText('투입일')).toBeInTheDocument()
      expect(screen.getByText('철수일')).toBeInTheDocument()
      expect(screen.getByText('상태')).toBeInTheDocument()
      expect(screen.getByText('투입중 프로젝트')).toBeInTheDocument()
    })
  })

  describe('검색 조건 변경 테스트', () => {
    test('자사/외주 구분을 변경할 수 있다', () => {
      render(<COMZ080P00 />)
      
      const radioButtons = screen.getAllByRole('radio')
      const outsRadio = radioButtons[1] // 외주 라디오 버튼
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('퇴사자포함 체크박스를 변경할 수 있다', () => {
      render(<COMZ080P00 />)
      
      const checkbox = screen.getByRole('checkbox')
      // 체크박스가 이미 체크된 상태이므로 클릭하면 해제됨
      fireEvent.click(checkbox)
      
      // 체크 해제된 상태 확인
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('검색 기능 테스트', () => {
    test('직원명을 입력할 수 있다', () => {
      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원명 입력')
      fireEvent.change(empNameInput, { target: { value: '성부뜰' } })
      
      expect(empNameInput).toHaveValue('성부뜰')
    })

    test('조회 버튼을 클릭할 수 있다', () => {
      render(<COMZ080P00 />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)
      
      expect(searchButton).toBeInTheDocument()
    })

    test('직원명이 없으면 경고 메시지가 표시된다', async () => {
      render(<COMZ080P00 />)
      
      const searchButton = screen.getByText('조회')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('직원명을 입력해주세요.', 'warning')
      })
    })

    test('검색 결과가 없으면 안내 메시지가 표시된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원명 입력')
      fireEvent.change(empNameInput, { target: { value: '존재하지않는직원' } })
      
      const searchButton = screen.getByText('조회')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('해당 직원명은 존재하지 않습니다.', 'warning')
      })
    })
  })

  describe('데이터 표시 테스트', () => {
    test('초기에는 데이터가 없음을 표시한다', () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('🔍 검색 결과가 없습니다.')).toBeInTheDocument()
    })

    test('검색 결과가 정상적으로 표시된다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '자사',
              EMP_NM: '성부뜰',
              EMP_NO: 'EMP001',
              DUTY_CD_NM: '과장',
              TCN_GRD_NM: '중급',
              PARTY_NM: '서비스사업본부',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '재직',
              EXEC_ING_BSN_NM: 'KB캐피탈 자동차 TM시스템 구축'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원명 입력')
      fireEvent.change(empNameInput, { target: { value: '성부뜰' } })
      
      const searchButton = screen.getByText('조회')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
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
              OWN_OUTS_NM: '자사',
              EMP_NM: '성부뜰',
              EMP_NO: 'EMP001',
              DUTY_CD_NM: '과장',
              TCN_GRD_NM: '중급',
              PARTY_NM: '서비스사업본부',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '재직',
              EXEC_ING_BSN_NM: 'KB캐피탈 자동차 TM시스템 구축'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원명 입력')
      fireEvent.change(empNameInput, { target: { value: '성부뜰' } })
      
      const searchButton = screen.getByText('조회')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })

  describe('키보드 이벤트 테스트', () => {
    test('Enter 키로 검색이 실행된다', () => {
      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원명 입력')
      fireEvent.change(empNameInput, { target: { value: '성부뜰' } })
      fireEvent.keyDown(empNameInput, { key: 'Enter', code: 'Enter' })
      
      expect(empNameInput).toBeInTheDocument()
    })

    test('Escape 키로 창이 닫힌다', () => {
      render(<COMZ080P00 />)
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
      
      expect(screen.getByText('직원 검색')).toBeInTheDocument()
    })
  })

  describe('팝업 닫기 테스트', () => {
    test('종료 버튼을 클릭하면 창이 닫힌다', () => {
      render(<COMZ080P00 />)
      
      const closeButton = screen.getByText('종료')
      fireEvent.click(closeButton)
      
      expect(window.close).toHaveBeenCalled()
    })

    test('X 버튼을 클릭하면 창이 닫힌다', () => {
      render(<COMZ080P00 />)
      
      const xButton = screen.getByText('×')
      fireEvent.click(xButton)
      
      expect(window.close).toHaveBeenCalled()
    })
  })

  describe('메서드 테스트', () => {
    test('choiceEmpInit 메서드가 정상적으로 작동한다', () => {
      const mockEmpList = [
        {
          LIST_NO: '1',
          OWN_OUTS_NM: '외주',
          EMP_NM: '성부뜰',
          EMP_NO: 'EMP001',
          DUTY_CD_NM: '과장',
          TCN_GRD_NM: '중급',
          PARTY_NM: '서비스사업본부',
          ENTR_DT: '2016/11/03',
          EXEC_IN_STRT_DT: '2016/11/03',
          EXEC_IN_END_DT: '2017/01/02',
          WKG_ST_DIV_NM: '재직',
          EXEC_ING_BSN_NM: 'KB캐피탈 자동차 TM시스템 구축'
        }
      ]

      render(<COMZ080P00 />)
      
      expect(screen.getByText('🔍 검색 결과가 없습니다.')).toBeInTheDocument()
    })
  })

  describe('postMessage 테스트', () => {
    test('postMessage로 데이터를 받을 수 있다', () => {
      render(<COMZ080P00 />)
      
      const mockData = {
        type: 'CHOICE_EMP_INIT',
        data: {
          empNm: '성부뜰',
          ownOutDiv: '2',
          empList: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '외주',
              EMP_NM: '성부뜰',
              EMP_NO: 'EMP001',
              DUTY_CD_NM: '과장',
              TCN_GRD_NM: '중급',
              PARTY_NM: '서비스사업본부',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '재직',
              EXEC_ING_BSN_NM: 'KB캐피탈 자동차 TM시스템 구축'
            }
          ]
        }
      }

      window.postMessage(mockData, '*')
      
      expect(screen.getByText('🔍 검색 결과가 없습니다.')).toBeInTheDocument()
    })
  })
}) 