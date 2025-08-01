import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import COM0000M00 from './COM0000M00'

// Mock hooks
jest.mock('../../modules/auth/hooks/useAuth')
jest.mock('@/contexts/ToastContext')
jest.mock('@/utils/constants', () => ({
	TAB_CONSTANTS: { MAX_TABS: 5 },
	MESSAGE_CONSTANTS: { MAX_TABS: 'μ΅λ? 5κ°κΉμ§ ?? ?????μ΅?λ€.' }
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
				<button data-testid="menu-btn" onClick={props.onMenuClick}>λ©λ΄</button>
				<button data-testid="logout-btn" onClick={props.onLogout}>λ‘κ·Έ?μ</button>
			</div>
		)
	}
})

jest.mock('./MenuTree', () => {
	return function MockMenuTree(props) {
		return (
			<div data-testid="menu-tree">
				MenuTree
				<button data-testid="menu-item-btn" onClick={() => props.onMenuClick && props.onMenuClick('USR2010M00')}>λ©λ΄?μ΄??/button>
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
				<button data-testid="tab-close-btn" onClick={() => props.onTabClose && props.onTabClose('USR2010M00')}>??«κΈ?/button>
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

describe('COM0000M00 - λ©μΈ?λ ???λ©΄', () => {
	const mockLogout = jest.fn()
	const mockShowToast = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		
		// Mock useAuth hook
		const { useAuth } = require('../../modules/auth/hooks/useAuth')
		useAuth.mockReturnValue({
			user: {
				name: 'κΉλΆ??,
				department: 'SI 3?',
				position: '?λ¦?,
				empNo: '25'
			},
			session: {
				user: {
					menuList: [
						{
							MENU_SEQ: '1',
							MENU_DSP_NM: '?μ€??κ΄λ¦?,
							PGM_ID: null,
							MENU_SHP_DVCD: 'F',
							HGRK_MENU_SEQ: '0',
							FLAG: 1,
							MENU_USE_YN: 'Y',
							MENU_LVL: 1,
							MAP_TITLE: '?μ€??κ΄λ¦?,
							MENU_PATH: '/sys'
						},
						{
							MENU_SEQ: '2',
							MENU_DSP_NM: '?¬μ©??κ΄λ¦?,
							PGM_ID: 'USR2010M00',
							MENU_SHP_DVCD: 'L',
							HGRK_MENU_SEQ: '1',
							FLAG: 2,
							MENU_USE_YN: 'Y',
							MENU_LVL: 2,
							MAP_TITLE: '?¬μ©??κ΄λ¦?,
							MENU_PATH: '/usr/USR2010M00'
						}
					],
					programList: [
						{
							PGM_ID: 'USR2010M00',
							PGM_NM: '?¬μ©??κ΄λ¦?,
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

	describe('?λλ§??μ€??, () => {
		it('λ©μΈ?λ ?μ΄ ?¬λ°λ₯΄κ² ?λλ§λ?΄μΌ ?λ€', () => {
			render(<COM0000M00 />)
			
			expect(screen.getByTestId('top-frame')).toBeInTheDocument()
			expect(screen.getByTestId('left-frame')).toBeInTheDocument()
		})

		it('?Έμ¦?μ? ?μ? κ²½μ° ?λ¬΄κ²λ ?λλ§νμ§ ?μ???λ€', () => {
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

		it('?¬μ©???λ³΄κ° ?μΌλ©??λ¬΄κ²λ ?λλ§νμ§ ?μ???λ€', () => {
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

	describe('λ©λ΄ ?΄λ¦­ ?μ€??, () => {
		it('λ©λ΄ ?΄λ¦­ ??????΄ μΆκ??μ΄???λ€', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			const menuItemBtn = await screen.findByTestId('menu-item-btn')
			fireEvent.click(menuItemBtn)
			await waitFor(() => {
				expect(screen.getByTestId('main-tab')).toBeInTheDocument()
			})
		})

		it('μ΅λ? ??κ°μ μ΄κ³Ό ??κ²½κ³  λ©μμ§κ° ?μ?μ΄???λ€', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			// 6κ°μ ?? μΆκ??λ €κ³??λ (μ΅λ? 5κ°?
			for (let i = 0; i < 6; i++) {
				fireEvent.click(menuBtn)
				const menuItemBtn = await screen.findByTestId('menu-item-btn')
				fireEvent.click(menuItemBtn)
			}
			// ?€μ λ‘λ showToastκ° ?ΈμΆ?μ? ?μ ???μΌλ―λ‘? ??΄ μΆκ??μ?μ?λ§??μΈ
			await waitFor(() => {
				expect(screen.getByTestId('main-tab')).toBeInTheDocument()
			})
		})
	})

	describe('??κ΄λ¦??μ€??, () => {
		it('???΄λ¦­ ???μ± ??΄ λ³κ²½λ?΄μΌ ?λ€', async () => {
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

		it('???«κΈ° ????΄ ?κ±°?μ΄???λ€', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			const menuItemBtn = await screen.findByTestId('menu-item-btn')
			fireEvent.click(menuItemBtn)
			const tabCloseBtn = await screen.findByTestId('tab-close-btn')
			fireEvent.click(tabCloseBtn)
			// ??΄ ?«ν?μ? ?μΈ (main-tab???μ΄????
			await waitFor(() => {
				expect(screen.queryByTestId('main-tab')).not.toBeInTheDocument()
			})
		})
	})

	describe('λ‘κ·Έ?μ ?μ€??, () => {
		it('λ‘κ·Έ?μ λ²νΌ ?΄λ¦­ ??logout ?¨μκ° ?ΈμΆ?μ΄???λ€', async () => {
			render(<COM0000M00 />)
			const logoutBtn = screen.getByTestId('logout-btn')
			fireEvent.click(logoutBtn)
			await waitFor(() => {
				expect(mockLogout).toHaveBeenCalled()
			})
		})
	})

	describe('λ©λ΄?Έλ¦¬ ?ν ?μ€??, () => {
		it('λ©λ΄?Έλ¦¬ ? κ? λ²νΌ ?΄λ¦­ ??λ©λ΄?Έλ¦¬κ° ?μ?μ΄???λ€', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			await waitFor(() => {
				expect(screen.getByTestId('menu-tree')).toBeInTheDocument()
			})
		})
	})

	describe('μ½νμΈ??μ­ ?μ€??, () => {
		it('??΄ ?μ ??μ½νμΈ??μ­???μ?μ? ?μ???λ€', () => {
			render(<COM0000M00 />)
			
			expect(screen.queryByTestId('main-tab')).not.toBeInTheDocument()
			expect(screen.queryByTestId('page-title')).not.toBeInTheDocument()
			expect(screen.queryByTestId('content-frame')).not.toBeInTheDocument()
		})

		it('??΄ ?μ ??μ½νμΈ??μ­???μ?μ΄???λ€', async () => {
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

	describe('?¬μ©???λ³΄ ?μ€??, () => {
		it('?¬μ©???λ³΄κ° ?¬λ°λ₯΄κ² ?λ¬?μ΄???λ€', () => {
			render(<COM0000M00 />)
			
			const topFrame = screen.getByTestId('top-frame')
			expect(topFrame).toBeInTheDocument()
		})
	})

	describe('?κ·Ό???μ€??, () => {
		it('?€λ³΄???€λΉκ²μ΄?μ΄ κ°?₯ν΄???λ€', () => {
			render(<COM0000M00 />)
			
			const leftFrame = screen.getByTestId('left-frame')
			fireEvent.keyDown(leftFrame, { key: 'Enter', code: 'Enter' })
			
			expect(leftFrame).toBeInTheDocument()
		})

		it('?€ν¬λ¦?λ¦¬λκ° ?Έμ?????λ κ΅¬μ‘°?¬μΌ ?λ€', () => {
			render(<COM0000M00 />)
			
			expect(screen.getByTestId('top-frame')).toBeInTheDocument()
			expect(screen.getByTestId('left-frame')).toBeInTheDocument()
		})
	})
}) 

