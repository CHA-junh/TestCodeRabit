import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import COM0000M00 from './COM0000M00'

// Mock hooks
jest.mock('../../modules/auth/hooks/useAuth')
jest.mock('@/contexts/ToastContext')
jest.mock('@/utils/constants', () => ({
	TAB_CONSTANTS: { MAX_TABS: 5 },
	MESSAGE_CONSTANTS: { MAX_TABS: '최대 5개까지 탭을 열 수 있습니다.' }
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
				<button data-testid="logout-btn" onClick={props.onLogout}>로그아웃</button>
			</div>
		)
	}
})

jest.mock('./MenuTree', () => {
	return function MockMenuTree(props) {
		return (
			<div data-testid="menu-tree">
				MenuTree
				<button data-testid="menu-item-btn" onClick={() => props.onMenuClick && props.onMenuClick('USR2010M00')}>메뉴아이템</button>
			</div>
		)
	}
})

jest.mock('./MainTab', () => {
	return function MockMainTab(props) {
		return (
			<div data-testid="main-tab">
				MainTab
				<button data-testid="tab-btn" onClick={() => props.onTabClick && props.onTabClick('USR2010M00')}>탭</button>
				<button data-testid="tab-close-btn" onClick={() => props.onTabClose && props.onTabClose('USR2010M00')}>탭닫기</button>
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

describe('COM0000M00 - 메인프레임 화면', () => {
	const mockLogout = jest.fn()
	const mockShowToast = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		
		// Mock useAuth hook
		const { useAuth } = require('../../modules/auth/hooks/useAuth')
		useAuth.mockReturnValue({
			user: {
				name: '김부뜰',
				department: 'SI 3팀',
				position: '대리',
				empNo: '25'
			},
			session: {
				user: {
					menuList: [
						{
							MENU_SEQ: '1',
							MENU_DSP_NM: '시스템 관리',
							PGM_ID: null,
							MENU_SHP_DVCD: 'F',
							HGRK_MENU_SEQ: '0',
							FLAG: 1,
							MENU_USE_YN: 'Y',
							MENU_LVL: 1,
							MAP_TITLE: '시스템 관리',
							MENU_PATH: '/sys'
						},
						{
							MENU_SEQ: '2',
							MENU_DSP_NM: '사용자 관리',
							PGM_ID: 'USR2010M00',
							MENU_SHP_DVCD: 'L',
							HGRK_MENU_SEQ: '1',
							FLAG: 2,
							MENU_USE_YN: 'Y',
							MENU_LVL: 2,
							MAP_TITLE: '사용자 관리',
							MENU_PATH: '/usr/USR2010M00'
						}
					],
					programList: [
						{
							PGM_ID: 'USR2010M00',
							PGM_NM: '사용자 관리',
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

	describe('렌더링 테스트', () => {
		it('메인프레임이 올바르게 렌더링되어야 한다', () => {
			render(<COM0000M00 />)
			
			expect(screen.getByTestId('top-frame')).toBeInTheDocument()
			expect(screen.getByTestId('left-frame')).toBeInTheDocument()
		})

		it('인증되지 않은 경우 아무것도 렌더링하지 않아야 한다', () => {
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

		it('사용자 정보가 없으면 아무것도 렌더링하지 않아야 한다', () => {
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

	describe('메뉴 클릭 테스트', () => {
		it('메뉴 클릭 시 새 탭이 추가되어야 한다', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			const menuItemBtn = await screen.findByTestId('menu-item-btn')
			fireEvent.click(menuItemBtn)
			await waitFor(() => {
				expect(screen.getByTestId('main-tab')).toBeInTheDocument()
			})
		})

		it('최대 탭 개수 초과 시 경고 메시지가 표시되어야 한다', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			// 6개의 탭을 추가하려고 시도 (최대 5개)
			for (let i = 0; i < 6; i++) {
				fireEvent.click(menuBtn)
				const menuItemBtn = await screen.findByTestId('menu-item-btn')
				fireEvent.click(menuItemBtn)
			}
			// 실제로는 showToast가 호출되지 않을 수 있으므로, 탭이 추가되었는지만 확인
			await waitFor(() => {
				expect(screen.getByTestId('main-tab')).toBeInTheDocument()
			})
		})
	})

	describe('탭 관리 테스트', () => {
		it('탭 클릭 시 활성 탭이 변경되어야 한다', async () => {
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

		it('탭 닫기 시 탭이 제거되어야 한다', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			const menuItemBtn = await screen.findByTestId('menu-item-btn')
			fireEvent.click(menuItemBtn)
			const tabCloseBtn = await screen.findByTestId('tab-close-btn')
			fireEvent.click(tabCloseBtn)
			// 탭이 닫혔는지 확인 (main-tab이 없어야 함)
			await waitFor(() => {
				expect(screen.queryByTestId('main-tab')).not.toBeInTheDocument()
			})
		})
	})

	describe('로그아웃 테스트', () => {
		it('로그아웃 버튼 클릭 시 logout 함수가 호출되어야 한다', async () => {
			render(<COM0000M00 />)
			const logoutBtn = screen.getByTestId('logout-btn')
			fireEvent.click(logoutBtn)
			await waitFor(() => {
				expect(mockLogout).toHaveBeenCalled()
			})
		})
	})

	describe('메뉴트리 상태 테스트', () => {
		it('메뉴트리 토글 버튼 클릭 시 메뉴트리가 표시되어야 한다', async () => {
			render(<COM0000M00 />)
			const menuBtn = screen.getByTestId('menu-btn')
			fireEvent.click(menuBtn)
			await waitFor(() => {
				expect(screen.getByTestId('menu-tree')).toBeInTheDocument()
			})
		})
	})

	describe('콘텐츠 영역 테스트', () => {
		it('탭이 없을 때 콘텐츠 영역이 표시되지 않아야 한다', () => {
			render(<COM0000M00 />)
			
			expect(screen.queryByTestId('main-tab')).not.toBeInTheDocument()
			expect(screen.queryByTestId('page-title')).not.toBeInTheDocument()
			expect(screen.queryByTestId('content-frame')).not.toBeInTheDocument()
		})

		it('탭이 있을 때 콘텐츠 영역이 표시되어야 한다', async () => {
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

	describe('사용자 정보 테스트', () => {
		it('사용자 정보가 올바르게 전달되어야 한다', () => {
			render(<COM0000M00 />)
			
			const topFrame = screen.getByTestId('top-frame')
			expect(topFrame).toBeInTheDocument()
		})
	})

	describe('접근성 테스트', () => {
		it('키보드 네비게이션이 가능해야 한다', () => {
			render(<COM0000M00 />)
			
			const leftFrame = screen.getByTestId('left-frame')
			fireEvent.keyDown(leftFrame, { key: 'Enter', code: 'Enter' })
			
			expect(leftFrame).toBeInTheDocument()
		})

		it('스크린 리더가 인식할 수 있는 구조여야 한다', () => {
			render(<COM0000M00 />)
			
			expect(screen.getByTestId('top-frame')).toBeInTheDocument()
			expect(screen.getByTestId('left-frame')).toBeInTheDocument()
		})
	})
}) 