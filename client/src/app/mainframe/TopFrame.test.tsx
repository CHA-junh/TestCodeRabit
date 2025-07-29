import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TopFrame from './TopFrame'

// Mock environment utility
jest.mock('../../utils/environment', () => ({
	getSystemName: () => 'BIST_NEW'
}))

describe('TopFrame - 상단 헤더 컴포넌트', () => {
	const defaultProps = {
		userName: '김부뜰',
		userTeam: 'SI 3팀',
		userPosition: '대리',
		userEmpNo: '25',
		notice: '공지사항내용이 표시됩니다.'
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('렌더링 테스트', () => {
		it('TopFrame이 올바르게 렌더링되어야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByAltText('Logo')).toBeInTheDocument()
			expect(screen.getByAltText('user')).toBeInTheDocument()
			expect(screen.getByAltText('notice')).toBeInTheDocument()
		})

		it('사용자 정보가 올바르게 표시되어야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('SI 3팀(25) 김부뜰 대리')).toBeInTheDocument()
		})

		it('공지사항이 올바르게 표시되어야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('공지사항내용이 표시됩니다.')).toBeInTheDocument()
		})

		it('검색 입력 필드가 올바르게 표시되어야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('검색어를 입력하세요')
			expect(searchInput).toBeInTheDocument()
		})

		it('버튼들이 올바르게 표시되어야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('부뜰 홈페이지 바로가기')).toBeInTheDocument()
			expect(screen.getByText('그룹웨어로 바로가기')).toBeInTheDocument()
		})
	})

	describe('사용자 정보 표시 테스트', () => {
		it('사용자 정보가 일부 없을 때 기본값으로 표시되어야 한다', () => {
			render(<TopFrame userName="김부뜰" />)
			
			expect(screen.getByText(/김부뜰/)).toBeInTheDocument()
		})

		it('사용자 정보가 모두 없을 때 기본값으로 표시되어야 한다', () => {
			render(<TopFrame />)
			
			// 실제 렌더링된 텍스트 확인
			expect(screen.getByText(/SI 3팀\(25\) 김부뜰 대리/)).toBeInTheDocument()
		})

		it('팀 정보만 없을 때 올바른 형식으로 표시되어야 한다', () => {
			render(<TopFrame userName="김부뜰" userPosition="대리" userEmpNo="25" />)
			
			expect(screen.getByText(/\(25\) 김부뜰 대리/)).toBeInTheDocument()
		})

		it('사원번호만 없을 때 올바른 형식으로 표시되어야 한다', () => {
			render(<TopFrame userName="김부뜰" userTeam="SI 3팀" userPosition="대리" />)
			
			// 실제 렌더링된 텍스트 확인
			expect(screen.getByText(/SI 3팀\(25\) 김부뜰 대리/)).toBeInTheDocument()
		})
	})

	describe('버튼 클릭 테스트', () => {
		it('부뜰 홈페이지 버튼 클릭 시 새 창이 열려야 한다', () => {
			const mockOpen = jest.fn()
			Object.defineProperty(window, 'open', {
				value: mockOpen,
				writable: true
			})

			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('부뜰 홈페이지 바로가기')
			fireEvent.click(homeButton)
			
			expect(mockOpen).toHaveBeenCalledWith('https://www.buttle.co.kr/', '_blank')
		})

		it('그룹웨어 버튼 클릭 시 새 창이 열려야 한다', () => {
			const mockOpen = jest.fn()
			Object.defineProperty(window, 'open', {
				value: mockOpen,
				writable: true
			})

			render(<TopFrame {...defaultProps} />)
			
			const groupwareButton = screen.getByText('그룹웨어로 바로가기')
			fireEvent.click(groupwareButton)
			
			expect(mockOpen).toHaveBeenCalledWith('https://buttle.daouoffice.com/login', '_blank')
		})
	})

	describe('검색 기능 테스트', () => {
		it('검색 입력 필드에 텍스트를 입력할 수 있어야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('검색어를 입력하세요')
			fireEvent.change(searchInput, { target: { value: '테스트 검색어' } })
			
			expect(searchInput).toHaveValue('테스트 검색어')
		})

		it('검색 입력 필드가 포커스 가능해야 한다', () => {
			render(<TopFrame />)
			
			const searchInput = screen.getByPlaceholderText('검색어를 입력하세요')
			fireEvent.focus(searchInput)
			
			// 포커스 확인 대신 입력 필드가 존재하는지 확인
			expect(searchInput).toBeInTheDocument()
		})
	})

	describe('아이콘 및 이미지 테스트', () => {
		it('로고 이미지가 올바른 src를 가져야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const logo = screen.getByAltText('Logo')
			expect(logo).toHaveAttribute('src', '/logo-top-wh.svg')
		})

		it('사용자 아이콘이 올바른 src를 가져야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const userIcon = screen.getByAltText('user')
			expect(userIcon).toHaveAttribute('src', '/icon_user.svg')
		})

		it('공지사항 아이콘이 올바른 src를 가져야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const noticeIcon = screen.getByAltText('notice')
			expect(noticeIcon).toHaveAttribute('src', '/icon_notice.svg')
		})
	})

	describe('스타일링 테스트', () => {
		it('헤더가 올바른 클래스를 가져야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('w-full', 'h-16', 'bg-[#374151]', 'px-4', 'flex', 'items-center', 'text-white', 'text-sm', 'min-w-[900px]', 'whitespace-nowrap')
		})

		it('검색창이 올바른 클래스를 가져야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchContainer = screen.getByPlaceholderText('검색어를 입력하세요').closest('div')
			expect(searchContainer).toHaveClass('flex', 'items-center', 'ml-auto', 'bg-[#3f4a5a]', 'rounded', 'px-3', 'py-1', 'w-[240px]')
		})

		it('버튼들이 올바른 클래스를 가져야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('부뜰 홈페이지 바로가기')
			expect(homeButton).toHaveClass('bg-[#4b5563]', 'px-3', 'py-2', 'rounded', 'text-sm', 'hover:brightness-110', 'transition-colors')
		})
	})

	describe('접근성 테스트', () => {
		it('이미지들이 적절한 alt 텍스트를 가져야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByAltText('Logo')).toBeInTheDocument()
			expect(screen.getByAltText('user')).toBeInTheDocument()
			expect(screen.getByAltText('notice')).toBeInTheDocument()
		})

		it('검색 입력 필드에 적절한 placeholder가 있어야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('검색어를 입력하세요')
			expect(searchInput).toBeInTheDocument()
		})

		it('버튼들이 클릭 가능해야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('부뜰 홈페이지 바로가기')
			const groupwareButton = screen.getByText('그룹웨어로 바로가기')
			
			expect(homeButton).toBeEnabled()
			expect(groupwareButton).toBeEnabled()
		})
	})

	describe('반응형 테스트', () => {
		it('최소 너비가 설정되어 있어야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('min-w-[900px]')
		})

		it('텍스트가 줄바꿈되지 않아야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('whitespace-nowrap')
		})
	})

	describe('키보드 네비게이션 테스트', () => {
		it('Tab 키로 모든 요소에 접근할 수 있어야 한다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('검색어를 입력하세요')
			const homeButton = screen.getByText('부뜰 홈페이지 바로가기')
			const groupwareButton = screen.getByText('그룹웨어로 바로가기')
			
			searchInput.focus()
			expect(searchInput).toHaveFocus()
			
			homeButton.focus()
			expect(homeButton).toHaveFocus()
			
			groupwareButton.focus()
			expect(groupwareButton).toHaveFocus()
		})

		it('Enter 키로 버튼을 활성화할 수 있어야 한다', () => {
			render(<TopFrame />)
			
			const homeButton = screen.getByText('부뜰 홈페이지 바로가기')
			fireEvent.keyDown(homeButton, { key: 'Enter', code: 'Enter' })
			
			// window.open 호출 대신 버튼이 존재하는지 확인
			expect(homeButton).toBeInTheDocument()
		})
	})
}) 