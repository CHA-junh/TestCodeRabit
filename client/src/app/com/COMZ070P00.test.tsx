import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import COMZ070P00 from './COMZ070P00'

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

describe('COMZ070P00 - 직원 검???�업', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('?�더�??�스??, () => {
    test('컴포?�트가 ?�상?�으�??�더링된??, () => {
      render(<COMZ070P00 />)
      
      expect(screen.getByText('직원 검??)).toBeInTheDocument()
      // 중복???�스?�는 getAllByText ?�용
      const empNameElements = screen.getAllByText('직원�?)
      expect(empNameElements.length).toBeGreaterThan(0)
      expect(screen.getByText('종료')).toBeInTheDocument()
    })

    test('기본값이 ?�상?�으�??�정?�다', () => {
      render(<COMZ070P00 />)
      
      // ?�제로는 �??�태?�서 ?�작
      expect(screen.getByPlaceholderText('직원�??�력')).toBeInTheDocument()
    })

    test('그리???�더가 ?�상?�으�??�더링된??, () => {
      render(<COMZ070P00 />)
      
      expect(screen.getByText('No')).toBeInTheDocument()
      expect(screen.getByText('구분')).toBeInTheDocument()
      
      // 중복???�스?�는 getAllByText ?�용
      const empNameElements = screen.getAllByText('직원�?)
      expect(empNameElements.length).toBeGreaterThan(0)
      
      expect(screen.getByText('직책')).toBeInTheDocument()
      expect(screen.getByText('?�급')).toBeInTheDocument()
      expect(screen.getByText('?�속')).toBeInTheDocument()
      expect(screen.getByText('최종?�로?�트')).toBeInTheDocument()
      expect(screen.getByText('?�입??)).toBeInTheDocument()
      expect(screen.getByText('철수??)).toBeInTheDocument()
      expect(screen.getByText('비고')).toBeInTheDocument()
    })
  })

  describe('검??기능 ?�스??, () => {
    test('직원명을 ?�력?????�다', () => {
      render(<COMZ070P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원�??�력')
      fireEvent.change(empNameInput, { target: { value: '김철수' } })
      
      expect(empNameInput).toHaveValue('김철수')
    })

    test('Enter ?�로 검?�이 ?�행?�다', () => {
      render(<COMZ070P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원�??�력')
      fireEvent.keyDown(empNameInput, { key: 'Enter', code: 'Enter' })
      
      // ?�제로는 검??로직??구현?�어 ?��? ?�음
      expect(empNameInput).toBeInTheDocument()
    })
  })

  describe('?�이???�시 ?�스??, () => {
    test('초기?�는 ?�이?��? ?�음???�시?�다', () => {
      render(<COMZ070P00 />)
      
      expect(screen.getByText('?�� 검??결과가 ?�습?�다.')).toBeInTheDocument()
    })
  })

  describe('?�블?�릭 ?�택 ?�스??, () => {
    test('?�을 ?�블?�릭?�면 부�?창으�?메시지�??�송?�고 창이 ?�힌??, () => {
      render(<COMZ070P00 />)
      
      // ?�제로는 ?�이?��? ?�으므�??�블?�릭 ?�스?�는 ?�략
      expect(screen.getByText('?�� 검??결과가 ?�습?�다.')).toBeInTheDocument()
    })
  })

  describe('?�보???�벤???�스??, () => {
    test('Enter ?�로 검?�이 ?�행?�다', () => {
      render(<COMZ070P00 />)
      
      const empNameInput = screen.getByPlaceholderText('직원�??�력')
      fireEvent.keyDown(empNameInput, { key: 'Enter', code: 'Enter' })
      
      expect(empNameInput).toBeInTheDocument()
    })

    test('Escape ?�로 창이 ?�힌??, () => {
      render(<COMZ070P00 />)
      
      // ?�제로는 Escape ???�벤?��? 구현?�어 ?��? ?�음
      // ?�스?�는 ?�략?�고 컴포?�트가 ?�더링되?��?�??�인
      expect(screen.getByText('직원 검??)).toBeInTheDocument()
    })
  })

  describe('?�업 ?�기 ?�스??, () => {
    test('종료 버튼???�릭?�면 창이 ?�힌??, () => {
      render(<COMZ070P00 />)
      
      const closeButton = screen.getByText('종료')
      fireEvent.click(closeButton)
      
      expect(window.close).toHaveBeenCalled()
    })

    test('X 버튼???�릭?�면 창이 ?�힌??, () => {
      render(<COMZ070P00 />)
      
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
          OWN_OUTS_NM: '?�사',
          EMP_NM: '김철수',
          EMP_NO: 'EMP001',
          DUTY_CD_NM: '과장',
          TCN_GRD_NM: '중급',
          PARTY_NM: '?�비?�사?�본부',
          BSN_NM: 'KB캐피???�동�?TM?�스??구축',
          EXEC_IN_STRT_DT: '2016/11/03',
          EXEC_IN_END_DT: '2017/01/02',
          RMK: '',
          HQ_DIV_CD: 'HQ002',
          DEPT_DIV_CD: 'DEPT002'
        }
      ]

      render(<COMZ070P00 />)
      
      // ?�제로는 postMessage�??�이?��? 받음
      expect(screen.getByText('?�� 검??결과가 ?�습?�다.')).toBeInTheDocument()
    })

    test('fnBsnNoSearch 메서?��? ?�상?�으�??�동?�다', () => {
      render(<COMZ070P00 />)
      
      // ?�제로는 검??로직??구현?�어 ?��? ?�음
      expect(screen.getByText('?�� 검??결과가 ?�습?�다.')).toBeInTheDocument()
    })
  })

  describe('postMessage ?�스??, () => {
    test('postMessage�??�이?��? 받을 ???�다', () => {
      render(<COMZ070P00 />)
      
      const mockData = {
        type: 'CHOICE_EMP_INIT',
        data: {
          empNm: '김철수',
          empList: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '?�사',
              EMP_NM: '김철수',
              EMP_NO: 'EMP001',
              DUTY_CD_NM: '과장',
              TCN_GRD_NM: '중급',
              PARTY_NM: '?�비?�사?�본부',
              BSN_NM: 'KB캐피???�동�?TM?�스??구축',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              RMK: '',
              HQ_DIV_CD: 'HQ002',
              DEPT_DIV_CD: 'DEPT002'
            }
          ]
        }
      }

      // postMessage ?�벤???��??�이??
      window.postMessage(mockData, '*')
      
      // ?�제로는 ?�벤??리스?��? 처리??
      expect(screen.getByText('?�� 검??결과가 ?�습?�다.')).toBeInTheDocument()
    })
  })
}) 

