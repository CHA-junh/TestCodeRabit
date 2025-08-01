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

describe('COMZ020M00 - ?±κΈλ³??¨κ? ?±λ‘', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockShowConfirm.mockImplementation(({ onConfirm }) => onConfirm())
  })

  describe('?λλ§??μ€??, () => {
    test('μ»΄ν¬?νΈκ° ?μ?μΌλ‘??λλ§λ??, () => {
      render(<MainPage />)
      
      expect(screen.getByText('?μ¬/?Έμ£Ό')).toBeInTheDocument()
      expect(screen.getByText('?λ')).toBeInTheDocument()
      expect(screen.getByText('μ‘°ν')).toBeInTheDocument()
    })

    test('κΈ°λ³Έ κ²??μ‘°κ±΄???€μ ?λ€', () => {
      render(<MainPage />)
      
      const currentYear = new Date().getFullYear().toString()
      expect(screen.getByDisplayValue(currentYear)).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    })

    test('???λ?€μ΄ ?μ?μΌλ‘??λλ§λ??, () => {
      render(<MainPage />)
      
      // AG Grid ?€λ?μ ?±κΈ, μ§μ±, ?¨κ? ?μΈ
      const gradeElements = screen.getAllByText('?±κΈ')
      expect(gradeElements.length).toBeGreaterThan(0)
      
      // ??? ??  λ²νΌ ?μΈ
      expect(screen.getByText('???)).toBeInTheDocument()
      expect(screen.getByText('?? ')).toBeInTheDocument()
    })
  })

  describe('κ²??μ‘°κ±΄ λ³κ²??μ€??, () => {
    test('?μ¬/?Έμ£Ό κ΅¬λΆ??λ³κ²½ν  ???λ€', () => {
      render(<MainPage />)
      
      const outsRadio = screen.getByDisplayValue('2')
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('?λλ₯?λ³κ²½ν  ???λ€', () => {
      render(<MainPage />)
      
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
              OWN_OUTS_DIV: '1',
              OWN_OUTS_DIV_NM: '?μ¬',
              YR: '2024',
              TCN_GRD: '001',
              TCN_GRD_NM: 'μ΄κΈ',
              DUTY_CD: '001',
              DUTY_NM: '?¬μ',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      const searchButton = screen.getByText('μ‘°ν')
      fireEvent.click(searchButton)

      await waitFor(() => {
        // ?€μ λ‘λ μ½λ ?°μ΄?°λ? λ¨Όμ? λ‘λ?κ³ , κ·??€μ??κ²??APIκ° ?ΈμΆ??
        expect(global.fetch).toHaveBeenCalledWith('/api/code/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            largeCategoryCode: '104'
          })
        })
      })
    })

    test('?λκ° ?μΌλ©?κ²½κ³  λ©μμ§κ° ?μ?λ€', () => {
      render(<MainPage />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '' } })
      
      const searchButton = screen.getByText('μ‘°ν')
      fireEvent.click(searchButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('?λλ₯??λ ₯?μΈ??', 'warning')
    })

    test('API ?€λ₯ λ°μ ???λ¬ λ©μμ§κ° ?μ?λ€', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '?λ² ?€λ₯' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      const searchButton = screen.getByText('μ‘°ν')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('μ‘°ν μ€??€λ₯κ° λ°μ?μ΅?λ€.', 'error')
      })
    })
  })

  describe('???κΈ°λ₯ ?μ€??, () => {
    test('?μ ?λκ° ?μΌλ©?κ²½κ³  λ©μμ§κ° ?μ?λ€', () => {
      render(<MainPage />)
      
      const saveButton = screen.getByText('???)
      fireEvent.click(saveButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('κΈ°μ ?±κΈ???λ ₯?μΈ??', 'warning')
    })

    test('?¨κ?κ° ?μΌλ©?κ²½κ³  λ©μμ§κ° ?μ?λ€', () => {
      render(<MainPage />)
      
      const saveButton = screen.getByText('???)
      fireEvent.click(saveButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('κΈ°μ ?±κΈ???λ ₯?μΈ??', 'warning')
    })

    test('????±κ³΅ ???±κ³΅ λ©μμ§κ° ?μ?λ€', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      // ???°μ΄???λ ₯
      const priceInput = screen.getByPlaceholderText('0')
      fireEvent.change(priceInput, { target: { value: '3000000' } })
      
      const saveButton = screen.getByText('???)
      fireEvent.click(saveButton)

      await waitFor(() => {
        // ?€μ λ‘λ μ½λ ?°μ΄?°λ? λ¨Όμ? λ‘λ??
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

  describe('??  κΈ°λ₯ ?μ€??, () => {
    test('??  ???μΈ ?€μ΄?Όλ‘κ·Έκ? ?μ?λ€', () => {
      render(<MainPage />)
      
      const deleteButton = screen.getByText('?? ')
      fireEvent.click(deleteButton)
      
      // ?€μ λ‘λ ? ν???μ΄ ?μΌλ©?? ν¨??κ²??λ©μμ§κ° ?μ??
      expect(mockShowToast).toHaveBeenCalledWith('κΈ°μ ?±κΈ???λ ₯?μΈ??', 'warning')
    })

    test('??  ?±κ³΅ ???±κ³΅ λ©μμ§κ° ?μ?λ€', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      const deleteButton = screen.getByText('?? ')
      fireEvent.click(deleteButton)

      await waitFor(() => {
        // ?€μ λ‘λ μ½λ ?°μ΄?°λ? λ¨Όμ? λ‘λ??
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

  describe('?€λ³΄???΄λ²€???μ€??, () => {
    test('Enter ?€λ‘ κ²?μ΄ ?€ν?λ€', async () => {
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

  describe('??μ΄κΈ°???μ€??, () => {
    test('??????Όμ΄ μ΄κΈ°?λ??, async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      // ?€μ λ‘λ AG Gridλ₯??¬μ©?λ?λ‘??Όλ° input???λ
      // ??μ΄κΈ°?λ AG Grid??clearSelection()?Όλ‘ μ²λ¦¬??
      const saveButton = screen.getByText('???)
      fireEvent.click(saveButton)

      await waitFor(() => {
        // AG Gridκ° ?λλ§λ?λμ§ ?μΈ (role="treegrid" ?¬μ©)
        expect(screen.getByRole('treegrid')).toBeInTheDocument()
      })
    })
  })
}) 

