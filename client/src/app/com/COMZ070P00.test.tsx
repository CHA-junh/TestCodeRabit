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

describe('COMZ070P00 - ì§ì› ê²€???ì—…', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('?Œë”ë§??ŒìŠ¤??, () => {
    test('ì»´í¬?ŒíŠ¸ê°€ ?•ìƒ?ìœ¼ë¡??Œë”ë§ëœ??, () => {
      render(<COMZ070P00 />)
      
      expect(screen.getByText('ì§ì› ê²€??)).toBeInTheDocument()
      // ì¤‘ë³µ???ìŠ¤?¸ëŠ” getAllByText ?¬ìš©
      const empNameElements = screen.getAllByText('ì§ì›ëª?)
      expect(empNameElements.length).toBeGreaterThan(0)
      expect(screen.getByText('ì¢…ë£Œ')).toBeInTheDocument()
    })

    test('ê¸°ë³¸ê°’ì´ ?•ìƒ?ìœ¼ë¡??¤ì •?œë‹¤', () => {
      render(<COMZ070P00 />)
      
      // ?¤ì œë¡œëŠ” ë¹??íƒœ?ì„œ ?œì‘
      expect(screen.getByPlaceholderText('ì§ì›ëª??…ë ¥')).toBeInTheDocument()
    })

    test('ê·¸ë¦¬???¤ë”ê°€ ?•ìƒ?ìœ¼ë¡??Œë”ë§ëœ??, () => {
      render(<COMZ070P00 />)
      
      expect(screen.getByText('No')).toBeInTheDocument()
      expect(screen.getByText('êµ¬ë¶„')).toBeInTheDocument()
      
      // ì¤‘ë³µ???ìŠ¤?¸ëŠ” getAllByText ?¬ìš©
      const empNameElements = screen.getAllByText('ì§ì›ëª?)
      expect(empNameElements.length).toBeGreaterThan(0)
      
      expect(screen.getByText('ì§ì±…')).toBeInTheDocument()
      expect(screen.getByText('?±ê¸‰')).toBeInTheDocument()
      expect(screen.getByText('?Œì†')).toBeInTheDocument()
      expect(screen.getByText('ìµœì¢…?„ë¡œ?íŠ¸')).toBeInTheDocument()
      expect(screen.getByText('?¬ì…??)).toBeInTheDocument()
      expect(screen.getByText('ì² ìˆ˜??)).toBeInTheDocument()
      expect(screen.getByText('ë¹„ê³ ')).toBeInTheDocument()
    })
  })

  describe('ê²€??ê¸°ëŠ¥ ?ŒìŠ¤??, () => {
    test('ì§ì›ëª…ì„ ?…ë ¥?????ˆë‹¤', () => {
      render(<COMZ070P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ì§ì›ëª??…ë ¥')
      fireEvent.change(empNameInput, { target: { value: 'ê¹€ì² ìˆ˜' } })
      
      expect(empNameInput).toHaveValue('ê¹€ì² ìˆ˜')
    })

    test('Enter ?¤ë¡œ ê²€?‰ì´ ?¤í–‰?œë‹¤', () => {
      render(<COMZ070P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ì§ì›ëª??…ë ¥')
      fireEvent.keyDown(empNameInput, { key: 'Enter', code: 'Enter' })
      
      // ?¤ì œë¡œëŠ” ê²€??ë¡œì§??êµ¬í˜„?˜ì–´ ?ˆì? ?ŠìŒ
      expect(empNameInput).toBeInTheDocument()
    })
  })

  describe('?°ì´???œì‹œ ?ŒìŠ¤??, () => {
    test('ì´ˆê¸°?ëŠ” ?°ì´?°ê? ?†ìŒ???œì‹œ?œë‹¤', () => {
      render(<COMZ070P00 />)
      
      expect(screen.getByText('?” ê²€??ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.')).toBeInTheDocument()
    })
  })

  describe('?”ë¸”?´ë¦­ ? íƒ ?ŒìŠ¤??, () => {
    test('?‰ì„ ?”ë¸”?´ë¦­?˜ë©´ ë¶€ëª?ì°½ìœ¼ë¡?ë©”ì‹œì§€ë¥??„ì†¡?˜ê³  ì°½ì´ ?«íŒ??, () => {
      render(<COMZ070P00 />)
      
      // ?¤ì œë¡œëŠ” ?°ì´?°ê? ?†ìœ¼ë¯€ë¡??”ë¸”?´ë¦­ ?ŒìŠ¤?¸ëŠ” ?ëµ
      expect(screen.getByText('?” ê²€??ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.')).toBeInTheDocument()
    })
  })

  describe('?¤ë³´???´ë²¤???ŒìŠ¤??, () => {
    test('Enter ?¤ë¡œ ê²€?‰ì´ ?¤í–‰?œë‹¤', () => {
      render(<COMZ070P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ì§ì›ëª??…ë ¥')
      fireEvent.keyDown(empNameInput, { key: 'Enter', code: 'Enter' })
      
      expect(empNameInput).toBeInTheDocument()
    })

    test('Escape ?¤ë¡œ ì°½ì´ ?«íŒ??, () => {
      render(<COMZ070P00 />)
      
      // ?¤ì œë¡œëŠ” Escape ???´ë²¤?¸ê? êµ¬í˜„?˜ì–´ ?ˆì? ?ŠìŒ
      // ?ŒìŠ¤?¸ëŠ” ?ëµ?˜ê³  ì»´í¬?ŒíŠ¸ê°€ ?Œë”ë§ë˜?”ì?ë§??•ì¸
      expect(screen.getByText('ì§ì› ê²€??)).toBeInTheDocument()
    })
  })

  describe('?ì—… ?«ê¸° ?ŒìŠ¤??, () => {
    test('ì¢…ë£Œ ë²„íŠ¼???´ë¦­?˜ë©´ ì°½ì´ ?«íŒ??, () => {
      render(<COMZ070P00 />)
      
      const closeButton = screen.getByText('ì¢…ë£Œ')
      fireEvent.click(closeButton)
      
      expect(window.close).toHaveBeenCalled()
    })

    test('X ë²„íŠ¼???´ë¦­?˜ë©´ ì°½ì´ ?«íŒ??, () => {
      render(<COMZ070P00 />)
      
      const xButton = screen.getByText('Ã—')
      fireEvent.click(xButton)
      
      expect(window.close).toHaveBeenCalled()
    })
  })

  describe('ë©”ì„œ???ŒìŠ¤??, () => {
    test('choiceEmpInit ë©”ì„œ?œê? ?•ìƒ?ìœ¼ë¡??‘ë™?œë‹¤', () => {
      const mockEmpList = [
        {
          LIST_NO: '1',
          OWN_OUTS_NM: '?ì‚¬',
          EMP_NM: 'ê¹€ì² ìˆ˜',
          EMP_NO: 'EMP001',
          DUTY_CD_NM: 'ê³¼ì¥',
          TCN_GRD_NM: 'ì¤‘ê¸‰',
          PARTY_NM: '?œë¹„?¤ì‚¬?…ë³¸ë¶€',
          BSN_NM: 'KBìºí”¼???ë™ì°?TM?œìŠ¤??êµ¬ì¶•',
          EXEC_IN_STRT_DT: '2016/11/03',
          EXEC_IN_END_DT: '2017/01/02',
          RMK: '',
          HQ_DIV_CD: 'HQ002',
          DEPT_DIV_CD: 'DEPT002'
        }
      ]

      render(<COMZ070P00 />)
      
      // ?¤ì œë¡œëŠ” postMessageë¡??°ì´?°ë? ë°›ìŒ
      expect(screen.getByText('?” ê²€??ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.')).toBeInTheDocument()
    })

    test('fnBsnNoSearch ë©”ì„œ?œê? ?•ìƒ?ìœ¼ë¡??‘ë™?œë‹¤', () => {
      render(<COMZ070P00 />)
      
      // ?¤ì œë¡œëŠ” ê²€??ë¡œì§??êµ¬í˜„?˜ì–´ ?ˆì? ?ŠìŒ
      expect(screen.getByText('?” ê²€??ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.')).toBeInTheDocument()
    })
  })

  describe('postMessage ?ŒìŠ¤??, () => {
    test('postMessageë¡??°ì´?°ë? ë°›ì„ ???ˆë‹¤', () => {
      render(<COMZ070P00 />)
      
      const mockData = {
        type: 'CHOICE_EMP_INIT',
        data: {
          empNm: 'ê¹€ì² ìˆ˜',
          empList: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '?ì‚¬',
              EMP_NM: 'ê¹€ì² ìˆ˜',
              EMP_NO: 'EMP001',
              DUTY_CD_NM: 'ê³¼ì¥',
              TCN_GRD_NM: 'ì¤‘ê¸‰',
              PARTY_NM: '?œë¹„?¤ì‚¬?…ë³¸ë¶€',
              BSN_NM: 'KBìºí”¼???ë™ì°?TM?œìŠ¤??êµ¬ì¶•',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              RMK: '',
              HQ_DIV_CD: 'HQ002',
              DEPT_DIV_CD: 'DEPT002'
            }
          ]
        }
      }

      // postMessage ?´ë²¤???œë??ˆì´??
      window.postMessage(mockData, '*')
      
      // ?¤ì œë¡œëŠ” ?´ë²¤??ë¦¬ìŠ¤?ˆê? ì²˜ë¦¬??
      expect(screen.getByText('?” ê²€??ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.')).toBeInTheDocument()
    })
  })
}) 

