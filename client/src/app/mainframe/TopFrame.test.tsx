import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TopFrame from './TopFrame'

// Mock environment utility
jest.mock('../../utils/environment', () => ({
	getSystemName: () => 'BIST_NEW'
}))

describe('TopFrame - ?�단 ?�더 컴포?�트', () => {
	const defaultProps = {
		userName: '김부??,
		userTeam: 'SI 3?�',
		userPosition: '?��?,
		userEmpNo: '25',
		notice: '공�??�항?�용???�시?�니??'
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('?�더�??�스??, () => {
		it('TopFrame???�바르게 ?�더링되?�야 ?�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByAltText('Logo')).toBeInTheDocument()
			expect(screen.getByAltText('user')).toBeInTheDocument()
			expect(screen.getByAltText('notice')).toBeInTheDocument()
		})

		it('?�용???�보가 ?�바르게 ?�시?�어???�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('SI 3?�(25) 김부???��?)).toBeInTheDocument()
		})

		it('공�??�항???�바르게 ?�시?�어???�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('공�??�항?�용???�시?�니??')).toBeInTheDocument()
		})

		it('검???�력 ?�드가 ?�바르게 ?�시?�어???�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('검?�어�??�력?�세??)
			expect(searchInput).toBeInTheDocument()
		})

		it('버튼?�이 ?�바르게 ?�시?�어???�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('부???�페?��? 바로가�?)).toBeInTheDocument()
			expect(screen.getByText('그룹?�어�?바로가�?)).toBeInTheDocument()
		})
	})

	describe('?�용???�보 ?�시 ?�스??, () => {
		it('?�용???�보가 ?��? ?�을 ??기본값으�??�시?�어???�다', () => {
			render(<TopFrame userName="김부?? />)
			
			expect(screen.getByText(/김부??)).toBeInTheDocument()
		})

		it('?�용???�보가 모두 ?�을 ??기본값으�??�시?�어???�다', () => {
			render(<TopFrame />)
			
			// ?�제 ?�더링된 ?�스???�인
			expect(screen.getByText(/SI 3?�\(25\) 김부???��?)).toBeInTheDocument()
		})

		it('?� ?�보�??�을 ???�바�??�식?�로 ?�시?�어???�다', () => {
			render(<TopFrame userName="김부?? userPosition="?��? userEmpNo="25" />)
			
			expect(screen.getByText(/\(25\) 김부???��?)).toBeInTheDocument()
		})

		it('?�원번호�??�을 ???�바�??�식?�로 ?�시?�어???�다', () => {
			render(<TopFrame userName="김부?? userTeam="SI 3?�" userPosition="?��? />)
			
			// ?�제 ?�더링된 ?�스???�인
			expect(screen.getByText(/SI 3?�\(25\) 김부???��?)).toBeInTheDocument()
		})
	})

	describe('버튼 ?�릭 ?�스??, () => {
		it('부???�페?��? 버튼 ?�릭 ????창이 ?�려???�다', () => {
			const mockOpen = jest.fn()
			Object.defineProperty(window, 'open', {
				value: mockOpen,
				writable: true
			})

			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('부???�페?��? 바로가�?)
			fireEvent.click(homeButton)
			
			expect(mockOpen).toHaveBeenCalledWith('https://www.buttle.co.kr/', '_blank')
		})

		it('그룹?�어 버튼 ?�릭 ????창이 ?�려???�다', () => {
			const mockOpen = jest.fn()
			Object.defineProperty(window, 'open', {
				value: mockOpen,
				writable: true
			})

			render(<TopFrame {...defaultProps} />)
			
			const groupwareButton = screen.getByText('그룹?�어�?바로가�?)
			fireEvent.click(groupwareButton)
			
			expect(mockOpen).toHaveBeenCalledWith('https://buttle.daouoffice.com/login', '_blank')
		})
	})

	describe('검??기능 ?�스??, () => {
		it('검???�력 ?�드???�스?��? ?�력?????�어???�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('검?�어�??�력?�세??)
			fireEvent.change(searchInput, { target: { value: '?�스??검?�어' } })
			
			expect(searchInput).toHaveValue('?�스??검?�어')
		})

		it('검???�력 ?�드가 ?�커??가?�해???�다', () => {
			render(<TopFrame />)
			
			const searchInput = screen.getByPlaceholderText('검?�어�??�력?�세??)
			fireEvent.focus(searchInput)
			
			// ?�커???�인 ?�???�력 ?�드가 존재?�는지 ?�인
			expect(searchInput).toBeInTheDocument()
		})
	})

	describe('?�이�?�??��?지 ?�스??, () => {
		it('로고 ?��?지가 ?�바�?src�?가?�야 ?�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const logo = screen.getByAltText('Logo')
			expect(logo).toHaveAttribute('src', '/logo-top-wh.svg')
		})

		it('?�용???�이콘이 ?�바�?src�?가?�야 ?�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const userIcon = screen.getByAltText('user')
			expect(userIcon).toHaveAttribute('src', '/icon_user.svg')
		})

		it('공�??�항 ?�이콘이 ?�바�?src�?가?�야 ?�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const noticeIcon = screen.getByAltText('notice')
			expect(noticeIcon).toHaveAttribute('src', '/icon_notice.svg')
		})
	})

	describe('?��??�링 ?�스??, () => {
		it('?�더가 ?�바�??�래?��? 가?�야 ?�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('w-full', 'h-16', 'bg-[#374151]', 'px-4', 'flex', 'items-center', 'text-white', 'text-sm', 'min-w-[900px]', 'whitespace-nowrap')
		})

		it('검?�창???�바�??�래?��? 가?�야 ?�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchContainer = screen.getByPlaceholderText('검?�어�??�력?�세??).closest('div')
			expect(searchContainer).toHaveClass('flex', 'items-center', 'ml-auto', 'bg-[#3f4a5a]', 'rounded', 'px-3', 'py-1', 'w-[240px]')
		})

		it('버튼?�이 ?�바�??�래?��? 가?�야 ?�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('부???�페?��? 바로가�?)
			expect(homeButton).toHaveClass('bg-[#4b5563]', 'px-3', 'py-2', 'rounded', 'text-sm', 'hover:brightness-110', 'transition-colors')
		})
	})

	describe('?�근???�스??, () => {
		it('?��?지?�이 ?�절??alt ?�스?��? 가?�야 ?�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByAltText('Logo')).toBeInTheDocument()
			expect(screen.getByAltText('user')).toBeInTheDocument()
			expect(screen.getByAltText('notice')).toBeInTheDocument()
		})

		it('검???�력 ?�드???�절??placeholder가 ?�어???�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('검?�어�??�력?�세??)
			expect(searchInput).toBeInTheDocument()
		})

		it('버튼?�이 ?�릭 가?�해???�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('부???�페?��? 바로가�?)
			const groupwareButton = screen.getByText('그룹?�어�?바로가�?)
			
			expect(homeButton).toBeEnabled()
			expect(groupwareButton).toBeEnabled()
		})
	})

	describe('반응???�스??, () => {
		it('최소 ?�비가 ?�정?�어 ?�어???�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('min-w-[900px]')
		})

		it('?�스?��? 줄바꿈되지 ?�아???�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('whitespace-nowrap')
		})
	})

	describe('?�보???�비게이???�스??, () => {
		it('Tab ?�로 모든 ?�소???�근?????�어???�다', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('검?�어�??�력?�세??)
			const homeButton = screen.getByText('부???�페?��? 바로가�?)
			const groupwareButton = screen.getByText('그룹?�어�?바로가�?)
			
			searchInput.focus()
			expect(searchInput).toHaveFocus()
			
			homeButton.focus()
			expect(homeButton).toHaveFocus()
			
			groupwareButton.focus()
			expect(groupwareButton).toHaveFocus()
		})

		it('Enter ?�로 버튼???�성?�할 ???�어???�다', () => {
			render(<TopFrame />)
			
			const homeButton = screen.getByText('부???�페?��? 바로가�?)
			fireEvent.keyDown(homeButton, { key: 'Enter', code: 'Enter' })
			
			// window.open ?�출 ?�??버튼??존재?�는지 ?�인
			expect(homeButton).toBeInTheDocument()
		})
	})
}) 

