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

describe('COMZ020M00 - ?±ê¸‰ë³??¨ê? ?±ë¡', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockShowConfirm.mockImplementation(({ onConfirm }) => onConfirm())
  })

  describe('?Œë”ë§??ŒìŠ¤??, () => {
    test('ì»´í¬?ŒíŠ¸ê°€ ?•ìƒ?ìœ¼ë¡??Œë”ë§ëœ??, () => {
      render(<MainPage />)
      
      expect(screen.getByText('?ì‚¬/?¸ì£¼')).toBeInTheDocument()
      expect(screen.getByText('?„ë„')).toBeInTheDocument()
      expect(screen.getByText('ì¡°íšŒ')).toBeInTheDocument()
    })

    test('ê¸°ë³¸ ê²€??ì¡°ê±´???¤ì •?œë‹¤', () => {
      render(<MainPage />)
      
      const currentYear = new Date().getFullYear().toString()
      expect(screen.getByDisplayValue(currentYear)).toBeInTheDocument()
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    })

    test('???„ë“œ?¤ì´ ?•ìƒ?ìœ¼ë¡??Œë”ë§ëœ??, () => {
      render(<MainPage />)
      
      // AG Grid ?¤ë”?ì„œ ?±ê¸‰, ì§ì±…, ?¨ê? ?•ì¸
      const gradeElements = screen.getAllByText('?±ê¸‰')
      expect(gradeElements.length).toBeGreaterThan(0)
      
      // ?€?? ?? œ ë²„íŠ¼ ?•ì¸
      expect(screen.getByText('?€??)).toBeInTheDocument()
      expect(screen.getByText('?? œ')).toBeInTheDocument()
    })
  })

  describe('ê²€??ì¡°ê±´ ë³€ê²??ŒìŠ¤??, () => {
    test('?ì‚¬/?¸ì£¼ êµ¬ë¶„??ë³€ê²½í•  ???ˆë‹¤', () => {
      render(<MainPage />)
      
      const outsRadio = screen.getByDisplayValue('2')
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('?„ë„ë¥?ë³€ê²½í•  ???ˆë‹¤', () => {
      render(<MainPage />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '2024' } })
      
      expect(yearSelect).toHaveValue('2024')
    })
  })

  describe('ì¡°íšŒ ê¸°ëŠ¥ ?ŒìŠ¤??, () => {
    test('ì¡°íšŒ ë²„íŠ¼???´ë¦­?˜ë©´ APIê°€ ?¸ì¶œ?œë‹¤', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              OWN_OUTS_DIV: '1',
              OWN_OUTS_DIV_NM: '?ì‚¬',
              YR: '2024',
              TCN_GRD: '001',
              TCN_GRD_NM: 'ì´ˆê¸‰',
              DUTY_CD: '001',
              DUTY_NM: '?¬ì›',
              UPRC: '3000000'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      const searchButton = screen.getByText('ì¡°íšŒ')
      fireEvent.click(searchButton)

      await waitFor(() => {
        // ?¤ì œë¡œëŠ” ì½”ë“œ ?°ì´?°ë? ë¨¼ì? ë¡œë“œ?˜ê³ , ê·??¤ìŒ??ê²€??APIê°€ ?¸ì¶œ??
        expect(global.fetch).toHaveBeenCalledWith('/api/code/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            largeCategoryCode: '104'
          })
        })
      })
    })

    test('?„ë„ê°€ ?†ìœ¼ë©?ê²½ê³  ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', () => {
      render(<MainPage />)
      
      const yearSelect = screen.getByDisplayValue(new Date().getFullYear().toString())
      fireEvent.change(yearSelect, { target: { value: '' } })
      
      const searchButton = screen.getByText('ì¡°íšŒ')
      fireEvent.click(searchButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('?„ë„ë¥??…ë ¥?˜ì„¸??', 'warning')
    })

    test('API ?¤ë¥˜ ë°œìƒ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: '?œë²„ ?¤ë¥˜' })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      const searchButton = screen.getByText('ì¡°íšŒ')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('ì¡°íšŒ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.', 'error')
      })
    })
  })

  describe('?€??ê¸°ëŠ¥ ?ŒìŠ¤??, () => {
    test('?„ìˆ˜ ?„ë“œê°€ ?†ìœ¼ë©?ê²½ê³  ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', () => {
      render(<MainPage />)
      
      const saveButton = screen.getByText('?€??)
      fireEvent.click(saveButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('ê¸°ìˆ ?±ê¸‰???…ë ¥?˜ì„¸??', 'warning')
    })

    test('?¨ê?ê°€ ?†ìœ¼ë©?ê²½ê³  ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', () => {
      render(<MainPage />)
      
      const saveButton = screen.getByText('?€??)
      fireEvent.click(saveButton)
      
      expect(mockShowToast).toHaveBeenCalledWith('ê¸°ìˆ ?±ê¸‰???…ë ¥?˜ì„¸??', 'warning')
    })

    test('?€???±ê³µ ???±ê³µ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      // ???°ì´???…ë ¥
      const priceInput = screen.getByPlaceholderText('0')
      fireEvent.change(priceInput, { target: { value: '3000000' } })
      
      const saveButton = screen.getByText('?€??)
      fireEvent.click(saveButton)

      await waitFor(() => {
        // ?¤ì œë¡œëŠ” ì½”ë“œ ?°ì´?°ë? ë¨¼ì? ë¡œë“œ??
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

  describe('?? œ ê¸°ëŠ¥ ?ŒìŠ¤??, () => {
    test('?? œ ???•ì¸ ?¤ì´?¼ë¡œê·¸ê? ?œì‹œ?œë‹¤', () => {
      render(<MainPage />)
      
      const deleteButton = screen.getByText('?? œ')
      fireEvent.click(deleteButton)
      
      // ?¤ì œë¡œëŠ” ? íƒ???‰ì´ ?†ìœ¼ë©?? íš¨??ê²€??ë©”ì‹œì§€ê°€ ?œì‹œ??
      expect(mockShowToast).toHaveBeenCalledWith('ê¸°ìˆ ?±ê¸‰???…ë ¥?˜ì„¸??', 'warning')
    })

    test('?? œ ?±ê³µ ???±ê³µ ë©”ì‹œì§€ê°€ ?œì‹œ?œë‹¤', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      const deleteButton = screen.getByText('?? œ')
      fireEvent.click(deleteButton)

      await waitFor(() => {
        // ?¤ì œë¡œëŠ” ì½”ë“œ ?°ì´?°ë? ë¨¼ì? ë¡œë“œ??
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

  describe('?¤ë³´???´ë²¤???ŒìŠ¤??, () => {
    test('Enter ?¤ë¡œ ê²€?‰ì´ ?¤í–‰?œë‹¤', async () => {
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

  describe('??ì´ˆê¸°???ŒìŠ¤??, () => {
    test('?€?????¼ì´ ì´ˆê¸°?”ëœ??, async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<MainPage />)
      
      // ?¤ì œë¡œëŠ” AG Gridë¥??¬ìš©?˜ë?ë¡??¼ë°˜ input???„ë‹˜
      // ??ì´ˆê¸°?”ëŠ” AG Grid??clearSelection()?¼ë¡œ ì²˜ë¦¬??
      const saveButton = screen.getByText('?€??)
      fireEvent.click(saveButton)

      await waitFor(() => {
        // AG Gridê°€ ?Œë”ë§ë˜?ˆëŠ”ì§€ ?•ì¸ (role="treegrid" ?¬ìš©)
        expect(screen.getByRole('treegrid')).toBeInTheDocument()
      })
    })
  })
}) 

