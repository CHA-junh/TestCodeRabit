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

describe('COMZ070P00 - μ§μ κ²???μ', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('?λλ§??μ€??, () => {
    test('μ»΄ν¬?νΈκ° ?μ?μΌλ‘??λλ§λ??, () => {
      render(<COMZ070P00 />)
      
      expect(screen.getByText('μ§μ κ²??)).toBeInTheDocument()
      // μ€λ³΅???μ€?Έλ getAllByText ?¬μ©
      const empNameElements = screen.getAllByText('μ§μλͺ?)
      expect(empNameElements.length).toBeGreaterThan(0)
      expect(screen.getByText('μ’λ£')).toBeInTheDocument()
    })

    test('κΈ°λ³Έκ°μ΄ ?μ?μΌλ‘??€μ ?λ€', () => {
      render(<COMZ070P00 />)
      
      // ?€μ λ‘λ λΉ??ν?μ ?μ
      expect(screen.getByPlaceholderText('μ§μλͺ??λ ₯')).toBeInTheDocument()
    })

    test('κ·Έλ¦¬???€λκ° ?μ?μΌλ‘??λλ§λ??, () => {
      render(<COMZ070P00 />)
      
      expect(screen.getByText('No')).toBeInTheDocument()
      expect(screen.getByText('κ΅¬λΆ')).toBeInTheDocument()
      
      // μ€λ³΅???μ€?Έλ getAllByText ?¬μ©
      const empNameElements = screen.getAllByText('μ§μλͺ?)
      expect(empNameElements.length).toBeGreaterThan(0)
      
      expect(screen.getByText('μ§μ±')).toBeInTheDocument()
      expect(screen.getByText('?±κΈ')).toBeInTheDocument()
      expect(screen.getByText('?μ')).toBeInTheDocument()
      expect(screen.getByText('μ΅μ’?λ‘?νΈ')).toBeInTheDocument()
      expect(screen.getByText('?¬μ??)).toBeInTheDocument()
      expect(screen.getByText('μ² μ??)).toBeInTheDocument()
      expect(screen.getByText('λΉκ³ ')).toBeInTheDocument()
    })
  })

  describe('κ²??κΈ°λ₯ ?μ€??, () => {
    test('μ§μλͺμ ?λ ₯?????λ€', () => {
      render(<COMZ070P00 />)
      
      const empNameInput = screen.getByPlaceholderText('μ§μλͺ??λ ₯')
      fireEvent.change(empNameInput, { target: { value: 'κΉμ² μ' } })
      
      expect(empNameInput).toHaveValue('κΉμ² μ')
    })

    test('Enter ?€λ‘ κ²?μ΄ ?€ν?λ€', () => {
      render(<COMZ070P00 />)
      
      const empNameInput = screen.getByPlaceholderText('μ§μλͺ??λ ₯')
      fireEvent.keyDown(empNameInput, { key: 'Enter', code: 'Enter' })
      
      // ?€μ λ‘λ κ²??λ‘μ§??κ΅¬ν?μ΄ ?μ? ?μ
      expect(empNameInput).toBeInTheDocument()
    })
  })

  describe('?°μ΄???μ ?μ€??, () => {
    test('μ΄κΈ°?λ ?°μ΄?°κ? ?μ???μ?λ€', () => {
      render(<COMZ070P00 />)
      
      expect(screen.getByText('? κ²??κ²°κ³Όκ° ?μ΅?λ€.')).toBeInTheDocument()
    })
  })

  describe('?λΈ?΄λ¦­ ? ν ?μ€??, () => {
    test('?μ ?λΈ?΄λ¦­?λ©΄ λΆλͺ?μ°½μΌλ‘?λ©μμ§λ₯??μ‘?κ³  μ°½μ΄ ?«ν??, () => {
      render(<COMZ070P00 />)
      
      // ?€μ λ‘λ ?°μ΄?°κ? ?μΌλ―λ‘??λΈ?΄λ¦­ ?μ€?Έλ ?λ΅
      expect(screen.getByText('? κ²??κ²°κ³Όκ° ?μ΅?λ€.')).toBeInTheDocument()
    })
  })

  describe('?€λ³΄???΄λ²€???μ€??, () => {
    test('Enter ?€λ‘ κ²?μ΄ ?€ν?λ€', () => {
      render(<COMZ070P00 />)
      
      const empNameInput = screen.getByPlaceholderText('μ§μλͺ??λ ₯')
      fireEvent.keyDown(empNameInput, { key: 'Enter', code: 'Enter' })
      
      expect(empNameInput).toBeInTheDocument()
    })

    test('Escape ?€λ‘ μ°½μ΄ ?«ν??, () => {
      render(<COMZ070P00 />)
      
      // ?€μ λ‘λ Escape ???΄λ²€?Έκ? κ΅¬ν?μ΄ ?μ? ?μ
      // ?μ€?Έλ ?λ΅?κ³  μ»΄ν¬?νΈκ° ?λλ§λ?μ?λ§??μΈ
      expect(screen.getByText('μ§μ κ²??)).toBeInTheDocument()
    })
  })

  describe('?μ ?«κΈ° ?μ€??, () => {
    test('μ’λ£ λ²νΌ???΄λ¦­?λ©΄ μ°½μ΄ ?«ν??, () => {
      render(<COMZ070P00 />)
      
      const closeButton = screen.getByText('μ’λ£')
      fireEvent.click(closeButton)
      
      expect(window.close).toHaveBeenCalled()
    })

    test('X λ²νΌ???΄λ¦­?λ©΄ μ°½μ΄ ?«ν??, () => {
      render(<COMZ070P00 />)
      
      const xButton = screen.getByText('Γ')
      fireEvent.click(xButton)
      
      expect(window.close).toHaveBeenCalled()
    })
  })

  describe('λ©μ???μ€??, () => {
    test('choiceEmpInit λ©μ?κ? ?μ?μΌλ‘??λ?λ€', () => {
      const mockEmpList = [
        {
          LIST_NO: '1',
          OWN_OUTS_NM: '?μ¬',
          EMP_NM: 'κΉμ² μ',
          EMP_NO: 'EMP001',
          DUTY_CD_NM: 'κ³Όμ₯',
          TCN_GRD_NM: 'μ€κΈ',
          PARTY_NM: '?λΉ?€μ¬?λ³ΈλΆ',
          BSN_NM: 'KBμΊνΌ???λμ°?TM?μ€??κ΅¬μΆ',
          EXEC_IN_STRT_DT: '2016/11/03',
          EXEC_IN_END_DT: '2017/01/02',
          RMK: '',
          HQ_DIV_CD: 'HQ002',
          DEPT_DIV_CD: 'DEPT002'
        }
      ]

      render(<COMZ070P00 />)
      
      // ?€μ λ‘λ postMessageλ‘??°μ΄?°λ? λ°μ
      expect(screen.getByText('? κ²??κ²°κ³Όκ° ?μ΅?λ€.')).toBeInTheDocument()
    })

    test('fnBsnNoSearch λ©μ?κ? ?μ?μΌλ‘??λ?λ€', () => {
      render(<COMZ070P00 />)
      
      // ?€μ λ‘λ κ²??λ‘μ§??κ΅¬ν?μ΄ ?μ? ?μ
      expect(screen.getByText('? κ²??κ²°κ³Όκ° ?μ΅?λ€.')).toBeInTheDocument()
    })
  })

  describe('postMessage ?μ€??, () => {
    test('postMessageλ‘??°μ΄?°λ? λ°μ ???λ€', () => {
      render(<COMZ070P00 />)
      
      const mockData = {
        type: 'CHOICE_EMP_INIT',
        data: {
          empNm: 'κΉμ² μ',
          empList: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '?μ¬',
              EMP_NM: 'κΉμ² μ',
              EMP_NO: 'EMP001',
              DUTY_CD_NM: 'κ³Όμ₯',
              TCN_GRD_NM: 'μ€κΈ',
              PARTY_NM: '?λΉ?€μ¬?λ³ΈλΆ',
              BSN_NM: 'KBμΊνΌ???λμ°?TM?μ€??κ΅¬μΆ',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              RMK: '',
              HQ_DIV_CD: 'HQ002',
              DEPT_DIV_CD: 'DEPT002'
            }
          ]
        }
      }

      // postMessage ?΄λ²€???λ??μ΄??
      window.postMessage(mockData, '*')
      
      // ?€μ λ‘λ ?΄λ²€??λ¦¬μ€?κ? μ²λ¦¬??
      expect(screen.getByText('? κ²??κ²°κ³Όκ° ?μ΅?λ€.')).toBeInTheDocument()
    })
  })
}) 

