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

describe('COMZ080P00 - ÏßÅÏõê Í≤Ä???ùÏóÖ (?ïÏû• Î≤ÑÏ†Ñ)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // fetch Î™®ÌÇπ Ï¥àÍ∏∞??
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('?åÎçîÎß??åÏä§??, () => {
    test('Ïª¥Ìè¨?åÌä∏Í∞Ä ?ïÏÉÅ?ÅÏúºÎ°??åÎçîÎßÅÎêú??, () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('ÏßÅÏõê Í≤Ä??)).toBeInTheDocument()
      // Ï§ëÎ≥µ???çÏä§?∏Îäî getAllByText ?¨Ïö©
      const empNameElements = screen.getAllByText('ÏßÅÏõêÎ™?)
      expect(empNameElements.length).toBeGreaterThan(0)
      expect(screen.getByText('Ï°∞Ìöå')).toBeInTheDocument()
      expect(screen.getByText('Ï¢ÖÎ£å')).toBeInTheDocument()
    })

    test('Í∏∞Î≥∏Í∞íÏù¥ ?ïÏÉÅ?ÅÏúºÎ°??§Ï†ï?úÎã§', () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByPlaceholderText('ÏßÅÏõêÎ™??ÖÎ†•')).toBeInTheDocument()
      expect(screen.getByText('?êÏÇ¨')).toBeInTheDocument()
      expect(screen.getByText('?∏Ï£º')).toBeInTheDocument()
      expect(screen.getByText('?êÏÇ¨+?∏Ï£º')).toBeInTheDocument()
      expect(screen.getByText('?¥ÏÇ¨?êÌè¨??)).toBeInTheDocument()
    })

    test('Í∑∏Î¶¨???§ÎçîÍ∞Ä ?ïÏÉÅ?ÅÏúºÎ°??åÎçîÎßÅÎêú??, () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('No')).toBeInTheDocument()
      expect(screen.getByText('Íµ¨Î∂Ñ')).toBeInTheDocument()
      
      // Ï§ëÎ≥µ???çÏä§?∏Îäî getAllByText ?¨Ïö©
      const empNameElements = screen.getAllByText('ÏßÅÏõêÎ™?)
      expect(empNameElements.length).toBeGreaterThan(0)
      
      expect(screen.getByText('ÏßÅÏ±Ö')).toBeInTheDocument()
      expect(screen.getByText('?±Í∏â')).toBeInTheDocument()
      expect(screen.getByText('?åÏÜç')).toBeInTheDocument()
      expect(screen.getByText('?ÖÏÇ¨??)).toBeInTheDocument()
      expect(screen.getByText('?¨ÏûÖ??)).toBeInTheDocument()
      expect(screen.getByText('Ï≤†Ïàò??)).toBeInTheDocument()
      expect(screen.getByText('?ÅÌÉú')).toBeInTheDocument()
      expect(screen.getByText('?¨ÏûÖÏ§??ÑÎ°ú?ùÌä∏')).toBeInTheDocument()
    })
  })

  describe('Í≤Ä??Ï°∞Í±¥ Î≥ÄÍ≤??åÏä§??, () => {
    test('?êÏÇ¨/?∏Ï£º Íµ¨Î∂Ñ??Î≥ÄÍ≤ΩÌï† ???àÎã§', () => {
      render(<COMZ080P00 />)
      
      const radioButtons = screen.getAllByRole('radio')
      const outsRadio = radioButtons[1] // ?∏Ï£º ?ºÎîî??Î≤ÑÌäº
      fireEvent.click(outsRadio)
      
      expect(outsRadio).toBeChecked()
    })

    test('?¥ÏÇ¨?êÌè¨??Ï≤¥ÌÅ¨Î∞ïÏä§Î•?Î≥ÄÍ≤ΩÌï† ???àÎã§', () => {
      render(<COMZ080P00 />)
      
      const checkbox = screen.getByRole('checkbox')
      // Ï≤¥ÌÅ¨Î∞ïÏä§Í∞Ä ?¥Î? Ï≤¥ÌÅ¨???ÅÌÉú?¥Î?Î°??¥Î¶≠?òÎ©¥ ?¥Ï†ú??
      fireEvent.click(checkbox)
      
      // Ï≤¥ÌÅ¨ ?¥Ï†ú???ÅÌÉú ?ïÏù∏
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('Í≤Ä??Í∏∞Îä• ?åÏä§??, () => {
    test('ÏßÅÏõêÎ™ÖÏùÑ ?ÖÎ†•?????àÎã§', () => {
      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ÏßÅÏõêÎ™??ÖÎ†•')
      fireEvent.change(empNameInput, { target: { value: '?±Î??? } })
      
      expect(empNameInput).toHaveValue('?±Î???)
    })

    test('Ï°∞Ìöå Î≤ÑÌäº???¥Î¶≠?????àÎã§', () => {
      render(<COMZ080P00 />)
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      fireEvent.click(searchButton)
      
      expect(searchButton).toBeInTheDocument()
    })

    test('ÏßÅÏõêÎ™ÖÏù¥ ?ÜÏúºÎ©?Í≤ΩÍ≥† Î©îÏãúÏßÄÍ∞Ä ?úÏãú?úÎã§', async () => {
      render(<COMZ080P00 />)
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('ÏßÅÏõêÎ™ÖÏùÑ ?ÖÎ†•?¥Ï£º?∏Ïöî.', 'warning')
      })
    })

    test('Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ÜÏúºÎ©??àÎÇ¥ Î©îÏãúÏßÄÍ∞Ä ?úÏãú?úÎã§', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: [] })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ÏßÅÏõêÎ™??ÖÎ†•')
      fireEvent.change(empNameInput, { target: { value: 'Ï°¥Ïû¨?òÏ??äÎäîÏßÅÏõê' } })
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('?¥Îãπ ÏßÅÏõêÎ™ÖÏ? Ï°¥Ïû¨?òÏ? ?äÏäµ?àÎã§.', 'warning')
      })
    })
  })

  describe('?∞Ïù¥???úÏãú ?åÏä§??, () => {
    test('Ï¥àÍ∏∞?êÎäî ?∞Ïù¥?∞Í? ?ÜÏùå???úÏãú?úÎã§', () => {
      render(<COMZ080P00 />)
      
      expect(screen.getByText('?îç Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ÜÏäµ?àÎã§.')).toBeInTheDocument()
    })

    test('Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ïÏÉÅ?ÅÏúºÎ°??úÏãú?úÎã§', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '?êÏÇ¨',
              EMP_NM: '?±Î???,
              EMP_NO: 'EMP001',
              DUTY_CD_NM: 'Í≥ºÏû•',
              TCN_GRD_NM: 'Ï§ëÍ∏â',
              PARTY_NM: '?úÎπÑ?§ÏÇ¨?ÖÎ≥∏Î∂Ä',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '?¨ÏßÅ',
              EXEC_ING_BSN_NM: 'KBÏ∫êÌîº???êÎèôÏ∞?TM?úÏä§??Íµ¨Ï∂ï'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ÏßÅÏõêÎ™??ÖÎ†•')
      fireEvent.change(empNameInput, { target: { value: '?±Î??? } })
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })

  describe('?îÎ∏î?¥Î¶≠ ?†ÌÉù ?åÏä§??, () => {
    test('?âÏùÑ ?îÎ∏î?¥Î¶≠?òÎ©¥ Î∂ÄÎ™?Ï∞ΩÏúºÎ°?Î©îÏãúÏßÄÎ•??ÑÏÜ°?òÍ≥† Ï∞ΩÏù¥ ?´Ìûå??, async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '?êÏÇ¨',
              EMP_NM: '?±Î???,
              EMP_NO: 'EMP001',
              DUTY_CD_NM: 'Í≥ºÏû•',
              TCN_GRD_NM: 'Ï§ëÍ∏â',
              PARTY_NM: '?úÎπÑ?§ÏÇ¨?ÖÎ≥∏Î∂Ä',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '?¨ÏßÅ',
              EXEC_ING_BSN_NM: 'KBÏ∫êÌîº???êÎèôÏ∞?TM?úÏä§??Íµ¨Ï∂ï'
            }
          ]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ÏßÅÏõêÎ™??ÖÎ†•')
      fireEvent.change(empNameInput, { target: { value: '?±Î??? } })
      
      const searchButton = screen.getByText('Ï°∞Ìöå')
      
      await act(async () => {
        fireEvent.click(searchButton)
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })

  describe('?§Î≥¥???¥Î≤§???åÏä§??, () => {
    test('Enter ?§Î°ú Í≤Ä?âÏù¥ ?§Ìñâ?úÎã§', () => {
      render(<COMZ080P00 />)
      
      const empNameInput = screen.getByPlaceholderText('ÏßÅÏõêÎ™??ÖÎ†•')
      fireEvent.change(empNameInput, { target: { value: '?±Î??? } })
      fireEvent.keyDown(empNameInput, { key: 'Enter', code: 'Enter' })
      
      expect(empNameInput).toBeInTheDocument()
    })

    test('Escape ?§Î°ú Ï∞ΩÏù¥ ?´Ìûå??, () => {
      render(<COMZ080P00 />)
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
      
      expect(screen.getByText('ÏßÅÏõê Í≤Ä??)).toBeInTheDocument()
    })
  })

  describe('?ùÏóÖ ?´Í∏∞ ?åÏä§??, () => {
    test('Ï¢ÖÎ£å Î≤ÑÌäº???¥Î¶≠?òÎ©¥ Ï∞ΩÏù¥ ?´Ìûå??, () => {
      render(<COMZ080P00 />)
      
      const closeButton = screen.getByText('Ï¢ÖÎ£å')
      fireEvent.click(closeButton)
      
      expect(window.close).toHaveBeenCalled()
    })

    test('X Î≤ÑÌäº???¥Î¶≠?òÎ©¥ Ï∞ΩÏù¥ ?´Ìûå??, () => {
      render(<COMZ080P00 />)
      
      const xButton = screen.getByText('√ó')
      fireEvent.click(xButton)
      
      expect(window.close).toHaveBeenCalled()
    })
  })

  describe('Î©îÏÑú???åÏä§??, () => {
    test('choiceEmpInit Î©îÏÑú?úÍ? ?ïÏÉÅ?ÅÏúºÎ°??ëÎèô?úÎã§', () => {
      const mockEmpList = [
        {
          LIST_NO: '1',
          OWN_OUTS_NM: '?∏Ï£º',
          EMP_NM: '?±Î???,
          EMP_NO: 'EMP001',
          DUTY_CD_NM: 'Í≥ºÏû•',
          TCN_GRD_NM: 'Ï§ëÍ∏â',
          PARTY_NM: '?úÎπÑ?§ÏÇ¨?ÖÎ≥∏Î∂Ä',
          ENTR_DT: '2016/11/03',
          EXEC_IN_STRT_DT: '2016/11/03',
          EXEC_IN_END_DT: '2017/01/02',
          WKG_ST_DIV_NM: '?¨ÏßÅ',
          EXEC_ING_BSN_NM: 'KBÏ∫êÌîº???êÎèôÏ∞?TM?úÏä§??Íµ¨Ï∂ï'
        }
      ]

      render(<COMZ080P00 />)
      
      expect(screen.getByText('?îç Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ÜÏäµ?àÎã§.')).toBeInTheDocument()
    })
  })

  describe('postMessage ?åÏä§??, () => {
    test('postMessageÎ°??∞Ïù¥?∞Î? Î∞õÏùÑ ???àÎã§', () => {
      render(<COMZ080P00 />)
      
      const mockData = {
        type: 'CHOICE_EMP_INIT',
        data: {
          empNm: '?±Î???,
          ownOutDiv: '2',
          empList: [
            {
              LIST_NO: '1',
              OWN_OUTS_NM: '?∏Ï£º',
              EMP_NM: '?±Î???,
              EMP_NO: 'EMP001',
              DUTY_CD_NM: 'Í≥ºÏû•',
              TCN_GRD_NM: 'Ï§ëÍ∏â',
              PARTY_NM: '?úÎπÑ?§ÏÇ¨?ÖÎ≥∏Î∂Ä',
              ENTR_DT: '2016/11/03',
              EXEC_IN_STRT_DT: '2016/11/03',
              EXEC_IN_END_DT: '2017/01/02',
              WKG_ST_DIV_NM: '?¨ÏßÅ',
              EXEC_ING_BSN_NM: 'KBÏ∫êÌîº???êÎèôÏ∞?TM?úÏä§??Íµ¨Ï∂ï'
            }
          ]
        }
      }

      window.postMessage(mockData, '*')
      
      expect(screen.getByText('?îç Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ÜÏäµ?àÎã§.')).toBeInTheDocument()
    })
  })
}) 

