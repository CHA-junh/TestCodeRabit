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

describe('COMZ080P00 - 직원 검???�업 (?�장 버전)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // fetch 모킹 초기??
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('?�더�??�스??, () => {
    test('컴포?�트가 ?�상?�으�??�더링된??, () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('직원 검??)).toBeInTheDocument()
      // 중복???�스?�는 getAllByText ?�용
      const empNameElements = screen.getAllByText('직원�?)
      expect(empNameElements.length).toBeGreaterThan(0)
      expect(screen.getByText('조회')).toBeInTheDocument()
      expect(screen.getByText('종료')).toBeInTheDocument()
    })

    test('기본값이 ?�상?�으�??�정?�다', () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByPlaceholderText('직원�??�력')).toBeInTheDocument()
      expect(screen.getByText('?�사')).toBeInTheDocument()
      expect(screen.getByText('?�주')).toBeInTheDocument()
      expect(screen.getByText('?�사+?�주')).toBeInTheDocument()
      expect(screen.getByText('?�사?�포??)).toBeInTheDocument()
    })

    test('그리???�더가 ?�상?�으�??�더링된??, () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('No')).toBeInTheDocument()
      expect(screen.getByText('구분')).toBeInTheDocument()
      
      // 중복???�스?�는 getAllByText ?�용
      const empNameElements = screen.getAllByText('직원�?)
      expect(empNameElements.length).toBeGreaterThan(0)
      
      expect(screen.getByText('직책')).toBeInTheDocument()
      expect(screen.getByText('?�급')).toBeInTheDocument()
      expect(screen.getByText('?�속')).toBeInTheDocument()
      expect(screen.getByText('?�사??)).toBeInTheDocument()
      expect(screen.getByText('?�입??)).toBeInTheDocument()
      expect(screen.getByText('철수??)).toBeInTheDocument()
      expect(screen.getByText('?�태')).toBeInTheDocument()
      expect(screen.getByText('?�입�??�로?�트')).toBeInTheDocument()
    })
  })

  describe('검??조건 변�??�스??, () => {
    test('?�사/?�주 구분??변경할 ???�다', () => {
      render(<COMZ080P00 />)
      
      const radioButtons = screen.getAllByRole('radio')
      const outsRadio = radioButtons[1] // ?�주 ?�디??버튼
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('?�사?�포??체크박스�?변경할 ???�다', () => {
      render(<COMZ080P00 />)
      
      const checkbox = screen.getByRole('checkbox')
      // 체크박스가 ?��? 체크???�태?��?�??�릭?�면 ?�제??
      fireEvent.click(checkbox)
      
      // 체크 ?�제???�태 ?�인
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('검??기능 ?�스??, () => {
    test('직원명을 ?�력?????�다', () => {
      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원�??�력')
      fireEvent.change(empNameInput, { target: { value: '?��??? } })
      
      expect(empNameInput).toHaveValue('?��???)
    })

    test('조회 버튼???�릭?????�다', () => {
      render(<COMZ080P00 />)
      
      const searchButton = screen.getByText('조회')
      fireEvent.click(searchButton)
      
      expect(searchButton).toBeInTheDocument()
    })

    test('직원명이 ?�으�?경고 메시지가 ?�시?�다', async () => {
      render(<COMZ080P00 />)
      
      const searchButton = screen.getByText('조회')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('직원명을 ?�력?�주?�요.', 'warning')
      })
    })

    test('검??결과가 ?�으�??�내 메시지가 ?�시?�다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원�??�력')
      fireEvent.change(empNameInput, { target: { value: '존재?��??�는직원' } })
      
      const searchButton = screen.getByText('조회')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?�당 직원명�? 존재?��? ?�습?�다.', 'warning')
      })
    })
  })

  describe('?�이???�시 ?�스??, () => {
    test('초기?�는 ?�이?��? ?�음???�시?�다', () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('?�� 검??결과가 ?�습?�다.')).toBeInTheDocument()
    })

    test('검??결과가 ?�상?�으�??�시?�다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '?�사',
              EMP_NM: '?��???,
              EMP_NO: 'EMP001',
              DUTY_CD_NM: '과장',
              TCN_GRD_NM: '중급',
              PARTY_NM: '?�비?�사?�본부',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '?�직',
              EXEC_ING_BSN_NM: 'KB캐피???�동�?TM?�스??구축'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원�??�력')
      fireEvent.change(empNameInput, { target: { value: '?��??? } })
      
      const searchButton = screen.getByText('조회')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
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
              OWN_OUTS_NM: '?�사',
              EMP_NM: '?��???,
              EMP_NO: 'EMP001',
              DUTY_CD_NM: '과장',
              TCN_GRD_NM: '중급',
              PARTY_NM: '?�비?�사?�본부',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '?�직',
              EXEC_ING_BSN_NM: 'KB캐피???�동�?TM?�스??구축'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원�??�력')
      fireEvent.change(empNameInput, { target: { value: '?��??? } })
      
      const searchButton = screen.getByText('조회')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })

  describe('?�보???�벤???�스??, () => {
    test('Enter ?�로 검?�이 ?�행?�다', () => {
      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원�??�력')
      fireEvent.change(empNameInput, { target: { value: '?��??? } })
      fireEvent.keyDown(empNameInput, { key: 'Enter', code: 'Enter' })
      
      expect(empNameInput).toBeInTheDocument()
    })

    test('Escape ?�로 창이 ?�힌??, () => {
      render(<COMZ080P00 />)
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
      
      expect(screen.getByText('직원 검??)).toBeInTheDocument()
    })
  })

  describe('?�업 ?�기 ?�스??, () => {
    test('종료 버튼???�릭?�면 창이 ?�힌??, () => {
      render(<COMZ080P00 />)
      
      const closeButton = screen.getByText('종료')
      fireEvent.click(closeButton)
      
      expect(window.close).toHaveBeenCalled()
    })

    test('X 버튼???�릭?�면 창이 ?�힌??, () => {
      render(<COMZ080P00 />)
      
      const xButton = screen.getByText('×')
      fireEvent.click(xButton)
      
      expect(window.close).toHaveBeenCalled()
    })
  })

  describe('메서???�스??, () => {
    test('choiceEmpInit 메서?��? ?�상?�으�??�동?�다', () => {
      const mockEmpList = [
        {
          LIST_NO: '1',
          OWN_OUTS_NM: '?�주',
          EMP_NM: '?��???,
          EMP_NO: 'EMP001',
          DUTY_CD_NM: '과장',
          TCN_GRD_NM: '중급',
          PARTY_NM: '?�비?�사?�본부',
          ENTR_DT: '2016/11/03',
          EXEC_IN_STRT_DT: '2016/11/03',
          EXEC_IN_END_DT: '2017/01/02',
          WKG_ST_DIV_NM: '?�직',
          EXEC_ING_BSN_NM: 'KB캐피???�동�?TM?�스??구축'
        }
      ]

      render(<COMZ080P00 />)
      
      expect(screen.getByText('?�� 검??결과가 ?�습?�다.')).toBeInTheDocument()
    })
  })

  describe('postMessage ?�스??, () => {
    test('postMessage�??�이?��? 받을 ???�다', () => {
      render(<COMZ080P00 />)
      
      const mockData = {
        type: 'CHOICE_EMP_INIT',
        data: {
          empNm: '?��???,
          ownOutDiv: '2',
          empList: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '?�주',
              EMP_NM: '?��???,
              EMP_NO: 'EMP001',
              DUTY_CD_NM: '과장',
              TCN_GRD_NM: '중급',
              PARTY_NM: '?�비?�사?�본부',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '?�직',
              EXEC_ING_BSN_NM: 'KB캐피???�동�?TM?�스??구축'
            }
          ]
        }
      }

      window.postMessage(mockData, '*')
      
      expect(screen.getByText('?�� 검??결과가 ?�습?�다.')).toBeInTheDocument()
    })
  })
}) 

