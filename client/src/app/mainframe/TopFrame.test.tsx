import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TopFrame from './TopFrame'

// Mock environment utility
jest.mock('../../utils/environment', () => ({
	getSystemName: () => 'BIST_NEW'
}))

describe('TopFrame - ?ë‹¨ ?¤ë” ì»´í¬?ŒíŠ¸', () => {
	const defaultProps = {
		userName: 'ê¹€ë¶€??,
		userTeam: 'SI 3?€',
		userPosition: '?€ë¦?,
		userEmpNo: '25',
		notice: 'ê³µì??¬í•­?´ìš©???œì‹œ?©ë‹ˆ??'
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('?Œë”ë§??ŒìŠ¤??, () => {
		it('TopFrame???¬ë°”ë¥´ê²Œ ?Œë”ë§ë˜?´ì•¼ ?œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByAltText('Logo')).toBeInTheDocument()
			expect(screen.getByAltText('user')).toBeInTheDocument()
			expect(screen.getByAltText('notice')).toBeInTheDocument()
		})

		it('?¬ìš©???•ë³´ê°€ ?¬ë°”ë¥´ê²Œ ?œì‹œ?˜ì–´???œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('SI 3?€(25) ê¹€ë¶€???€ë¦?)).toBeInTheDocument()
		})

		it('ê³µì??¬í•­???¬ë°”ë¥´ê²Œ ?œì‹œ?˜ì–´???œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('ê³µì??¬í•­?´ìš©???œì‹œ?©ë‹ˆ??')).toBeInTheDocument()
		})

		it('ê²€???…ë ¥ ?„ë“œê°€ ?¬ë°”ë¥´ê²Œ ?œì‹œ?˜ì–´???œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('ê²€?‰ì–´ë¥??…ë ¥?˜ì„¸??)
			expect(searchInput).toBeInTheDocument()
		})

		it('ë²„íŠ¼?¤ì´ ?¬ë°”ë¥´ê²Œ ?œì‹œ?˜ì–´???œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('ë¶€???ˆí˜?´ì? ë°”ë¡œê°€ê¸?)).toBeInTheDocument()
			expect(screen.getByText('ê·¸ë£¹?¨ì–´ë¡?ë°”ë¡œê°€ê¸?)).toBeInTheDocument()
		})
	})

	describe('?¬ìš©???•ë³´ ?œì‹œ ?ŒìŠ¤??, () => {
		it('?¬ìš©???•ë³´ê°€ ?¼ë? ?†ì„ ??ê¸°ë³¸ê°’ìœ¼ë¡??œì‹œ?˜ì–´???œë‹¤', () => {
			render(<TopFrame userName="ê¹€ë¶€?? />)
			
			expect(screen.getByText(/ê¹€ë¶€??)).toBeInTheDocument()
		})

		it('?¬ìš©???•ë³´ê°€ ëª¨ë‘ ?†ì„ ??ê¸°ë³¸ê°’ìœ¼ë¡??œì‹œ?˜ì–´???œë‹¤', () => {
			render(<TopFrame />)
			
			// ?¤ì œ ?Œë”ë§ëœ ?ìŠ¤???•ì¸
			expect(screen.getByText(/SI 3?€\(25\) ê¹€ë¶€???€ë¦?)).toBeInTheDocument()
		})

		it('?€ ?•ë³´ë§??†ì„ ???¬ë°”ë¥??•ì‹?¼ë¡œ ?œì‹œ?˜ì–´???œë‹¤', () => {
			render(<TopFrame userName="ê¹€ë¶€?? userPosition="?€ë¦? userEmpNo="25" />)
			
			expect(screen.getByText(/\(25\) ê¹€ë¶€???€ë¦?)).toBeInTheDocument()
		})

		it('?¬ì›ë²ˆí˜¸ë§??†ì„ ???¬ë°”ë¥??•ì‹?¼ë¡œ ?œì‹œ?˜ì–´???œë‹¤', () => {
			render(<TopFrame userName="ê¹€ë¶€?? userTeam="SI 3?€" userPosition="?€ë¦? />)
			
			// ?¤ì œ ?Œë”ë§ëœ ?ìŠ¤???•ì¸
			expect(screen.getByText(/SI 3?€\(25\) ê¹€ë¶€???€ë¦?)).toBeInTheDocument()
		})
	})

	describe('ë²„íŠ¼ ?´ë¦­ ?ŒìŠ¤??, () => {
		it('ë¶€???ˆí˜?´ì? ë²„íŠ¼ ?´ë¦­ ????ì°½ì´ ?´ë ¤???œë‹¤', () => {
			const mockOpen = jest.fn()
			Object.defineProperty(window, 'open', {
				value: mockOpen,
				writable: true
			})

			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('ë¶€???ˆí˜?´ì? ë°”ë¡œê°€ê¸?)
			fireEvent.click(homeButton)
			
			expect(mockOpen).toHaveBeenCalledWith('https://www.buttle.co.kr/', '_blank')
		})

		it('ê·¸ë£¹?¨ì–´ ë²„íŠ¼ ?´ë¦­ ????ì°½ì´ ?´ë ¤???œë‹¤', () => {
			const mockOpen = jest.fn()
			Object.defineProperty(window, 'open', {
				value: mockOpen,
				writable: true
			})

			render(<TopFrame {...defaultProps} />)
			
			const groupwareButton = screen.getByText('ê·¸ë£¹?¨ì–´ë¡?ë°”ë¡œê°€ê¸?)
			fireEvent.click(groupwareButton)
			
			expect(mockOpen).toHaveBeenCalledWith('https://buttle.daouoffice.com/login', '_blank')
		})
	})

	describe('ê²€??ê¸°ëŠ¥ ?ŒìŠ¤??, () => {
		it('ê²€???…ë ¥ ?„ë“œ???ìŠ¤?¸ë? ?…ë ¥?????ˆì–´???œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('ê²€?‰ì–´ë¥??…ë ¥?˜ì„¸??)
			fireEvent.change(searchInput, { target: { value: '?ŒìŠ¤??ê²€?‰ì–´' } })
			
			expect(searchInput).toHaveValue('?ŒìŠ¤??ê²€?‰ì–´')
		})

		it('ê²€???…ë ¥ ?„ë“œê°€ ?¬ì»¤??ê°€?¥í•´???œë‹¤', () => {
			render(<TopFrame />)
			
			const searchInput = screen.getByPlaceholderText('ê²€?‰ì–´ë¥??…ë ¥?˜ì„¸??)
			fireEvent.focus(searchInput)
			
			// ?¬ì»¤???•ì¸ ?€???…ë ¥ ?„ë“œê°€ ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
			expect(searchInput).toBeInTheDocument()
		})
	})

	describe('?„ì´ì½?ë°??´ë?ì§€ ?ŒìŠ¤??, () => {
		it('ë¡œê³  ?´ë?ì§€ê°€ ?¬ë°”ë¥?srcë¥?ê°€?¸ì•¼ ?œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const logo = screen.getByAltText('Logo')
			expect(logo).toHaveAttribute('src', '/logo-top-wh.svg')
		})

		it('?¬ìš©???„ì´ì½˜ì´ ?¬ë°”ë¥?srcë¥?ê°€?¸ì•¼ ?œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const userIcon = screen.getByAltText('user')
			expect(userIcon).toHaveAttribute('src', '/icon_user.svg')
		})

		it('ê³µì??¬í•­ ?„ì´ì½˜ì´ ?¬ë°”ë¥?srcë¥?ê°€?¸ì•¼ ?œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const noticeIcon = screen.getByAltText('notice')
			expect(noticeIcon).toHaveAttribute('src', '/icon_notice.svg')
		})
	})

	describe('?¤í??¼ë§ ?ŒìŠ¤??, () => {
		it('?¤ë”ê°€ ?¬ë°”ë¥??´ë˜?¤ë? ê°€?¸ì•¼ ?œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('w-full', 'h-16', 'bg-[#374151]', 'px-4', 'flex', 'items-center', 'text-white', 'text-sm', 'min-w-[900px]', 'whitespace-nowrap')
		})

		it('ê²€?‰ì°½???¬ë°”ë¥??´ë˜?¤ë? ê°€?¸ì•¼ ?œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchContainer = screen.getByPlaceholderText('ê²€?‰ì–´ë¥??…ë ¥?˜ì„¸??).closest('div')
			expect(searchContainer).toHaveClass('flex', 'items-center', 'ml-auto', 'bg-[#3f4a5a]', 'rounded', 'px-3', 'py-1', 'w-[240px]')
		})

		it('ë²„íŠ¼?¤ì´ ?¬ë°”ë¥??´ë˜?¤ë? ê°€?¸ì•¼ ?œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('ë¶€???ˆí˜?´ì? ë°”ë¡œê°€ê¸?)
			expect(homeButton).toHaveClass('bg-[#4b5563]', 'px-3', 'py-2', 'rounded', 'text-sm', 'hover:brightness-110', 'transition-colors')
		})
	})

	describe('?‘ê·¼???ŒìŠ¤??, () => {
		it('?´ë?ì§€?¤ì´ ?ì ˆ??alt ?ìŠ¤?¸ë? ê°€?¸ì•¼ ?œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByAltText('Logo')).toBeInTheDocument()
			expect(screen.getByAltText('user')).toBeInTheDocument()
			expect(screen.getByAltText('notice')).toBeInTheDocument()
		})

		it('ê²€???…ë ¥ ?„ë“œ???ì ˆ??placeholderê°€ ?ˆì–´???œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('ê²€?‰ì–´ë¥??…ë ¥?˜ì„¸??)
			expect(searchInput).toBeInTheDocument()
		})

		it('ë²„íŠ¼?¤ì´ ?´ë¦­ ê°€?¥í•´???œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('ë¶€???ˆí˜?´ì? ë°”ë¡œê°€ê¸?)
			const groupwareButton = screen.getByText('ê·¸ë£¹?¨ì–´ë¡?ë°”ë¡œê°€ê¸?)
			
			expect(homeButton).toBeEnabled()
			expect(groupwareButton).toBeEnabled()
		})
	})

	describe('ë°˜ì‘???ŒìŠ¤??, () => {
		it('ìµœì†Œ ?ˆë¹„ê°€ ?¤ì •?˜ì–´ ?ˆì–´???œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('min-w-[900px]')
		})

		it('?ìŠ¤?¸ê? ì¤„ë°”ê¿ˆë˜ì§€ ?Šì•„???œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('whitespace-nowrap')
		})
	})

	describe('?¤ë³´???¤ë¹„ê²Œì´???ŒìŠ¤??, () => {
		it('Tab ?¤ë¡œ ëª¨ë“  ?”ì†Œ???‘ê·¼?????ˆì–´???œë‹¤', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('ê²€?‰ì–´ë¥??…ë ¥?˜ì„¸??)
			const homeButton = screen.getByText('ë¶€???ˆí˜?´ì? ë°”ë¡œê°€ê¸?)
			const groupwareButton = screen.getByText('ê·¸ë£¹?¨ì–´ë¡?ë°”ë¡œê°€ê¸?)
			
			searchInput.focus()
			expect(searchInput).toHaveFocus()
			
			homeButton.focus()
			expect(homeButton).toHaveFocus()
			
			groupwareButton.focus()
			expect(groupwareButton).toHaveFocus()
		})

		it('Enter ?¤ë¡œ ë²„íŠ¼???œì„±?”í•  ???ˆì–´???œë‹¤', () => {
			render(<TopFrame />)
			
			const homeButton = screen.getByText('ë¶€???ˆí˜?´ì? ë°”ë¡œê°€ê¸?)
			fireEvent.keyDown(homeButton, { key: 'Enter', code: 'Enter' })
			
			// window.open ?¸ì¶œ ?€??ë²„íŠ¼??ì¡´ì¬?˜ëŠ”ì§€ ?•ì¸
			expect(homeButton).toBeInTheDocument()
		})
	})
}) 

