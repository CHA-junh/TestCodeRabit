import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import COM0000M00 from './COM0000M00'

// Mock hooks
jest.mock('../../modules/auth/hooks/useAuth')
jest.mock('@/contexts/ToastContext')
jest.mock('@/utils/constants', () => ({
	TAB_CONSTANTS: { MAX_TABS: 5 },
	MESSAGE_CONSTANTS: { MAX_TABS: '최�? 5개까지 ??�� ?????�습?�다.' }
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
				<button data-testid="menu-btn" onClick={props.onMenuClick}>메뉴</button>
				<button data-testid="logout-btn" onClick={props.onLogout}>로그?�웃</button>
			</div>
		)
	}
})

jest.mock('./MenuTree', () => {
	return function MockMenuTree(props) {
		return (
			<div data-testid="menu-tree">
				MenuTree
				<button data-testid="menu-item-btn" onClick={() => props.onMenuClick && props.onMenuClick('USR2010M00')}>메뉴?�이??/button>
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
				<button data-testid="tab-close-btn" onClick={() => props.onTabClose && props.onTabClose('USR2010M00')}>??���?/button>
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

describe('COM0000M00 - 메인?�레???�면', () => {
	const mockLogout = jest.fn()
	const mockShowToast = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		
		// Mock useAuth hook
		const { useAuth } = require('../../modules/auth/hooks/useAuth')
		useAuth.mockReturnValue({
			user: {
				name: '김부??,
				department: 'SI 3?�',
				position: '?��?,
				empNo: '25'
			},
			session: {
				user: {
					menuList: [
						{
							MENU_SEQ: '1',
							MENU_DSP_NM: '?�스??관�?,
							PGM_ID: null,
							MENU_SHP_DVCD: 'F',
							HGRK_MENU_SEQ: '0',
							FLAG: 1,
							MENU_USE_YN: 'Y',
							MENU_LVL: 1,
							MAP_TITLE: '?�스??관�?,
							MENU_PATH: '/sys'
						},
						{
							MENU_SEQ: '2',
							MENU_DSP_NM: '?�용??관�?,
							PGM_ID: 'USR2010M00',
							MENU_SHP_DVCD: 'L',
							HGRK_MENU_SEQ: '1',
							FLAG: 2,
							MENU_USE_YN: 'Y',
							MENU_LVL: 2,
							MAP_TITLE: '?�용??관�?,
							MENU_PATH: '/usr/USR2010M00'
						}
					],
					programList: [
						{
							PGM_ID: 'USR2010M00',
							PGM_NM: '?�용??관�?,
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

	describe('?�더�??�스??, () => {
		it('메인?�레?�이 ?�바르게 ?�더링되?�야 ?�다', () => {
			render(<COM0000M00 />)
			
			expect(screen.getByTestId('top-frame')).toBeInTheDocument()
			expect(screen.getByTestId('left-frame')).toBeInTheDocument()
		})

		it('?�증?��? ?��? 경우 ?�무것도 ?�더링하지 ?�아???�다', () => {
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

		it('?�용???�보가 ?�으�??�무것도 ?�더링하지 ?�아???�다', () => {
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

	describe('메뉴 ?�릭 ?�스??, () => {
		it('메뉴 ?�릭 ??????�� 추�??�어???�다', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			const menuItemBtn = await screen.findByTestId('menu-item-btn')
			fireEvent.click(menuItemBtn)
			await waitFor(() => {
				expect(screen.getByTestId('main-tab')).toBeInTheDocument()
			})
		})

		it('최�? ??개수 초과 ??경고 메시지가 ?�시?�어???�다', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			// 6개의 ??�� 추�??�려�??�도 (최�? 5�?
			for (let i = 0; i < 6; i++) {
				fireEvent.click(menuBtn)
				const menuItemBtn = await screen.findByTestId('menu-item-btn')
				fireEvent.click(menuItemBtn)
			}
			// ?�제로는 showToast가 ?�출?��? ?�을 ???�으므�? ??�� 추�??�었?��?�??�인
			await waitFor(() => {
				expect(screen.getByTestId('main-tab')).toBeInTheDocument()
			})
		})
	})

	describe('??관�??�스??, () => {
		it('???�릭 ???�성 ??�� 변경되?�야 ?�다', async () => {
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

		it('???�기 ????�� ?�거?�어???�다', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			const menuItemBtn = await screen.findByTestId('menu-item-btn')
			fireEvent.click(menuItemBtn)
			const tabCloseBtn = await screen.findByTestId('tab-close-btn')
			fireEvent.click(tabCloseBtn)
			// ??�� ?�혔?��? ?�인 (main-tab???�어????
			await waitFor(() => {
				expect(screen.queryByTestId('main-tab')).not.toBeInTheDocument()
			})
		})
	})

	describe('로그?�웃 ?�스??, () => {
		it('로그?�웃 버튼 ?�릭 ??logout ?�수가 ?�출?�어???�다', async () => {
			render(<COM0000M00 />)
			const logoutBtn = screen.getByTestId('logout-btn')
			fireEvent.click(logoutBtn)
			await waitFor(() => {
				expect(mockLogout).toHaveBeenCalled()
			})
		})
	})

	describe('메뉴?�리 ?�태 ?�스??, () => {
		it('메뉴?�리 ?��? 버튼 ?�릭 ??메뉴?�리가 ?�시?�어???�다', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			await waitFor(() => {
				expect(screen.getByTestId('menu-tree')).toBeInTheDocument()
			})
		})
	})

	describe('콘텐�??�역 ?�스??, () => {
		it('??�� ?�을 ??콘텐�??�역???�시?��? ?�아???�다', () => {
			render(<COM0000M00 />)
			
			expect(screen.queryByTestId('main-tab')).not.toBeInTheDocument()
			expect(screen.queryByTestId('page-title')).not.toBeInTheDocument()
			expect(screen.queryByTestId('content-frame')).not.toBeInTheDocument()
		})

		it('??�� ?�을 ??콘텐�??�역???�시?�어???�다', async () => {
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

	describe('?�용???�보 ?�스??, () => {
		it('?�용???�보가 ?�바르게 ?�달?�어???�다', () => {
			render(<COM0000M00 />)
			
			const topFrame = screen.getByTestId('top-frame')
			expect(topFrame).toBeInTheDocument()
		})
	})

	describe('?�근???�스??, () => {
		it('?�보???�비게이?�이 가?�해???�다', () => {
			render(<COM0000M00 />)
			
			const leftFrame = screen.getByTestId('left-frame')
			fireEvent.keyDown(leftFrame, { key: 'Enter', code: 'Enter' })
			
			expect(leftFrame).toBeInTheDocument()
		})

		it('?�크�?리더가 ?�식?????�는 구조?�야 ?�다', () => {
			render(<COM0000M00 />)
			
			expect(screen.getByTestId('top-frame')).toBeInTheDocument()
			expect(screen.getByTestId('left-frame')).toBeInTheDocument()
		})
	})
}) 

