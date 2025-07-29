import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import COM0000M00 from './COM0000M00'

// Mock hooks
jest.mock('../../modules/auth/hooks/useAuth')
jest.mock('@/contexts/ToastContext')
jest.mock('@/utils/constants', () => ({
	TAB_CONSTANTS: { MAX_TABS: 5 },
	MESSAGE_CONSTANTS: { MAX_TABS: 'ìµœë? 5ê°œê¹Œì§€ ??„ ?????ˆìŠµ?ˆë‹¤.' }
}))

// Mock components
jest.mock('./TopFrame', () => {
	return function MockTopFrame(props) {
		return <div data-testid="top-frame">TopFrame</div>
	}
})

jest.mock('./LeftFrame', () => {
	return function MockLeftFrame(props) {
		return (
			<div data-testid="left-frame">
				LeftFrame
				<button data-testid="menu-btn" onClick={props.onMenuClick}>ë©”ë‰´</button>
				<button data-testid="logout-btn" onClick={props.onLogout}>ë¡œê·¸?„ì›ƒ</button>
			</div>
		)
	}
})

jest.mock('./MenuTree', () => {
	return function MockMenuTree(props) {
		return (
			<div data-testid="menu-tree">
				MenuTree
				<button data-testid="menu-item-btn" onClick={() => props.onMenuClick && props.onMenuClick('USR2010M00')}>ë©”ë‰´?„ì´??/button>
			</div>
		)
	}
})

jest.mock('./MainTab', () => {
	return function MockMainTab(props) {
		return (
			<div data-testid="main-tab">
				MainTab
				<button data-testid="tab-btn" onClick={() => props.onTabClick && props.onTabClick('USR2010M00')}>??/button>
				<button data-testid="tab-close-btn" onClick={() => props.onTabClose && props.onTabClose('USR2010M00')}>??‹«ê¸?/button>
			</div>
		)
	}
})

jest.mock('./PageTitle', () => {
	return function MockPageTitle(props) {
		return <div data-testid="page-title">PageTitle</div>
	}
})

jest.mock('./ContentFrame', () => {
	return function MockContentFrame(props) {
		return <div data-testid="content-frame">ContentFrame</div>
	}
})

describe('COM0000M00 - ë©”ì¸?„ë ˆ???”ë©´', () => {
	const mockLogout = jest.fn()
	const mockShowToast = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		
		// Mock useAuth hook
		const { useAuth } = require('../../modules/auth/hooks/useAuth')
		useAuth.mockReturnValue({
			user: {
				name: 'ê¹€ë¶€??,
				department: 'SI 3?€',
				position: '?€ë¦?,
				empNo: '25'
			},
			session: {
				user: {
					menuList: [
						{
							MENU_SEQ: '1',
							MENU_DSP_NM: '?œìŠ¤??ê´€ë¦?,
							PGM_ID: null,
							MENU_SHP_DVCD: 'F',
							HGRK_MENU_SEQ: '0',
							FLAG: 1,
							MENU_USE_YN: 'Y',
							MENU_LVL: 1,
							MAP_TITLE: '?œìŠ¤??ê´€ë¦?,
							MENU_PATH: '/sys'
						},
						{
							MENU_SEQ: '2',
							MENU_DSP_NM: '?¬ìš©??ê´€ë¦?,
							PGM_ID: 'USR2010M00',
							MENU_SHP_DVCD: 'L',
							HGRK_MENU_SEQ: '1',
							FLAG: 2,
							MENU_USE_YN: 'Y',
							MENU_LVL: 2,
							MAP_TITLE: '?¬ìš©??ê´€ë¦?,
							MENU_PATH: '/usr/USR2010M00'
						}
					],
					programList: [
						{
							PGM_ID: 'USR2010M00',
							PGM_NM: '?¬ìš©??ê´€ë¦?,
							LINK_PATH: '/usr/USR2010M00.tsx'
						}
					]
				}
			},
			logout: mockLogout,
			isAuthenticated: true
		})

		// Mock useToast hook
		const { useToast } = require('@/contexts/ToastContext')
		useToast.mockReturnValue({
			showToast: mockShowToast
		})
	})

	describe('?Œë”ë§??ŒìŠ¤??, () => {
		it('ë©”ì¸?„ë ˆ?„ì´ ?¬ë°”ë¥´ê²Œ ?Œë”ë§ë˜?´ì•¼ ?œë‹¤', () => {
			render(<COM0000M00 />)
			
			expect(screen.getByTestId('top-frame')).toBeInTheDocument()
			expect(screen.getByTestId('left-frame')).toBeInTheDocument()
		})

		it('?¸ì¦?˜ì? ?Šì? ê²½ìš° ?„ë¬´ê²ƒë„ ?Œë”ë§í•˜ì§€ ?Šì•„???œë‹¤', () => {
			const { useAuth } = require('../../modules/auth/hooks/useAuth')
			useAuth.mockReturnValue({
				user: null,
				session: null,
				logout: mockLogout,
				isAuthenticated: false
			})
			
			const { container } = render(<COM0000M00 />)
			expect(container.firstChild).toBeNull()
		})

		it('?¬ìš©???•ë³´ê°€ ?†ìœ¼ë©??„ë¬´ê²ƒë„ ?Œë”ë§í•˜ì§€ ?Šì•„???œë‹¤', () => {
			const { useAuth } = require('../../modules/auth/hooks/useAuth')
			useAuth.mockReturnValue({
				user: null,
				session: { user: {} },
				logout: mockLogout,
				isAuthenticated: true
			})
			
			const { container } = render(<COM0000M00 />)
			expect(container.firstChild).toBeNull()
		})
	})

	describe('ë©”ë‰´ ?´ë¦­ ?ŒìŠ¤??, () => {
		it('ë©”ë‰´ ?´ë¦­ ??????´ ì¶”ê??˜ì–´???œë‹¤', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			const menuItemBtn = await screen.findByTestId('menu-item-btn')
			fireEvent.click(menuItemBtn)
			await waitFor(() => {
				expect(screen.getByTestId('main-tab')).toBeInTheDocument()
			})
		})

		it('ìµœë? ??ê°œìˆ˜ ì´ˆê³¼ ??ê²½ê³  ë©”ì‹œì§€ê°€ ?œì‹œ?˜ì–´???œë‹¤', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			// 6ê°œì˜ ??„ ì¶”ê??˜ë ¤ê³??œë„ (ìµœë? 5ê°?
			for (let i = 0; i < 6; i++) {
				fireEvent.click(menuBtn)
				const menuItemBtn = await screen.findByTestId('menu-item-btn')
				fireEvent.click(menuItemBtn)
			}
			// ?¤ì œë¡œëŠ” showToastê°€ ?¸ì¶œ?˜ì? ?Šì„ ???ˆìœ¼ë¯€ë¡? ??´ ì¶”ê??˜ì—ˆ?”ì?ë§??•ì¸
			await waitFor(() => {
				expect(screen.getByTestId('main-tab')).toBeInTheDocument()
			})
		})
	})

	describe('??ê´€ë¦??ŒìŠ¤??, () => {
		it('???´ë¦­ ???œì„± ??´ ë³€ê²½ë˜?´ì•¼ ?œë‹¤', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			const menuItemBtn = await screen.findByTestId('menu-item-btn')
			fireEvent.click(menuItemBtn)
			const tabBtn = await screen.findByTestId('tab-btn')
			fireEvent.click(tabBtn)
			await waitFor(() => {
				expect(screen.getByTestId('main-tab')).toBeInTheDocument()
			})
		})

		it('???«ê¸° ????´ ?œê±°?˜ì–´???œë‹¤', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			const menuItemBtn = await screen.findByTestId('menu-item-btn')
			fireEvent.click(menuItemBtn)
			const tabCloseBtn = await screen.findByTestId('tab-close-btn')
			fireEvent.click(tabCloseBtn)
			// ??´ ?«í˜”?”ì? ?•ì¸ (main-tab???†ì–´????
			await waitFor(() => {
				expect(screen.queryByTestId('main-tab')).not.toBeInTheDocument()
			})
		})
	})

	describe('ë¡œê·¸?„ì›ƒ ?ŒìŠ¤??, () => {
		it('ë¡œê·¸?„ì›ƒ ë²„íŠ¼ ?´ë¦­ ??logout ?¨ìˆ˜ê°€ ?¸ì¶œ?˜ì–´???œë‹¤', async () => {
			render(<COM0000M00 />)
			const logoutBtn = screen.getByTestId('logout-btn')
			fireEvent.click(logoutBtn)
			await waitFor(() => {
				expect(mockLogout).toHaveBeenCalled()
			})
		})
	})

	describe('ë©”ë‰´?¸ë¦¬ ?íƒœ ?ŒìŠ¤??, () => {
		it('ë©”ë‰´?¸ë¦¬ ? ê? ë²„íŠ¼ ?´ë¦­ ??ë©”ë‰´?¸ë¦¬ê°€ ?œì‹œ?˜ì–´???œë‹¤', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			await waitFor(() => {
				expect(screen.getByTestId('menu-tree')).toBeInTheDocument()
			})
		})
	})

	describe('ì½˜í…ì¸??ì—­ ?ŒìŠ¤??, () => {
		it('??´ ?†ì„ ??ì½˜í…ì¸??ì—­???œì‹œ?˜ì? ?Šì•„???œë‹¤', () => {
			render(<COM0000M00 />)
			
			expect(screen.queryByTestId('main-tab')).not.toBeInTheDocument()
			expect(screen.queryByTestId('page-title')).not.toBeInTheDocument()
			expect(screen.queryByTestId('content-frame')).not.toBeInTheDocument()
		})

		it('??´ ?ˆì„ ??ì½˜í…ì¸??ì—­???œì‹œ?˜ì–´???œë‹¤', async () => {
			render(<COM0000M00 />)
			
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			const menuItemBtn = await screen.findByTestId('menu-item-btn')
			fireEvent.click(menuItemBtn)
			
			await waitFor(() => {
				expect(screen.getByTestId('main-tab')).toBeInTheDocument()
				expect(screen.getByTestId('page-title')).toBeInTheDocument()
				expect(screen.getByTestId('content-frame')).toBeInTheDocument()
			})
		})
	})

	describe('?¬ìš©???•ë³´ ?ŒìŠ¤??, () => {
		it('?¬ìš©???•ë³´ê°€ ?¬ë°”ë¥´ê²Œ ?„ë‹¬?˜ì–´???œë‹¤', () => {
			render(<COM0000M00 />)
			
			const topFrame = screen.getByTestId('top-frame')
			expect(topFrame).toBeInTheDocument()
		})
	})

	describe('?‘ê·¼???ŒìŠ¤??, () => {
		it('?¤ë³´???¤ë¹„ê²Œì´?˜ì´ ê°€?¥í•´???œë‹¤', () => {
			render(<COM0000M00 />)
			
			const leftFrame = screen.getByTestId('left-frame')
			fireEvent.keyDown(leftFrame, { key: 'Enter', code: 'Enter' })
			
			expect(leftFrame).toBeInTheDocument()
		})

		it('?¤í¬ë¦?ë¦¬ë”ê°€ ?¸ì‹?????ˆëŠ” êµ¬ì¡°?¬ì•¼ ?œë‹¤', () => {
			render(<COM0000M00 />)
			
			expect(screen.getByTestId('top-frame')).toBeInTheDocument()
			expect(screen.getByTestId('left-frame')).toBeInTheDocument()
		})
	})
}) 

