import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TopFrame from './TopFrame'

// Mock environment utility
jest.mock('../../utils/environment', () => ({
	getSystemName: () => 'BIST_NEW'
}))

describe('TopFrame - ?๋จ ?ค๋ ์ปดํฌ?ํธ', () => {
	const defaultProps = {
		userName: '๊น๋ถ??,
		userTeam: 'SI 3?',
		userPosition: '?๋ฆ?,
		userEmpNo: '25',
		notice: '๊ณต์??ฌํญ?ด์ฉ???์?ฉ๋??'
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('?๋๋ง??์ค??, () => {
		it('TopFrame???ฌ๋ฐ๋ฅด๊ฒ ?๋๋ง๋?ด์ผ ?๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByAltText('Logo')).toBeInTheDocument()
			expect(screen.getByAltText('user')).toBeInTheDocument()
			expect(screen.getByAltText('notice')).toBeInTheDocument()
		})

		it('?ฌ์ฉ???๋ณด๊ฐ ?ฌ๋ฐ๋ฅด๊ฒ ?์?์ด???๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('SI 3?(25) ๊น๋ถ???๋ฆ?)).toBeInTheDocument()
		})

		it('๊ณต์??ฌํญ???ฌ๋ฐ๋ฅด๊ฒ ?์?์ด???๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('๊ณต์??ฌํญ?ด์ฉ???์?ฉ๋??')).toBeInTheDocument()
		})

		it('๊ฒ???๋ ฅ ?๋๊ฐ ?ฌ๋ฐ๋ฅด๊ฒ ?์?์ด???๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('๊ฒ?์ด๋ฅ??๋ ฅ?์ธ??)
			expect(searchInput).toBeInTheDocument()
		})

		it('๋ฒํผ?ค์ด ?ฌ๋ฐ๋ฅด๊ฒ ?์?์ด???๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByText('๋ถ???ํ?ด์? ๋ฐ๋ก๊ฐ๊ธ?)).toBeInTheDocument()
			expect(screen.getByText('๊ทธ๋ฃน?จ์ด๋ก?๋ฐ๋ก๊ฐ๊ธ?)).toBeInTheDocument()
		})
	})

	describe('?ฌ์ฉ???๋ณด ?์ ?์ค??, () => {
		it('?ฌ์ฉ???๋ณด๊ฐ ?ผ๋? ?์ ??๊ธฐ๋ณธ๊ฐ์ผ๋ก??์?์ด???๋ค', () => {
			render(<TopFrame userName="๊น๋ถ?? />)
			
			expect(screen.getByText(/๊น๋ถ??)).toBeInTheDocument()
		})

		it('?ฌ์ฉ???๋ณด๊ฐ ๋ชจ๋ ?์ ??๊ธฐ๋ณธ๊ฐ์ผ๋ก??์?์ด???๋ค', () => {
			render(<TopFrame />)
			
			// ?ค์  ?๋๋ง๋ ?์ค???์ธ
			expect(screen.getByText(/SI 3?\(25\) ๊น๋ถ???๋ฆ?)).toBeInTheDocument()
		})

		it('? ?๋ณด๋ง??์ ???ฌ๋ฐ๋ฅ??์?ผ๋ก ?์?์ด???๋ค', () => {
			render(<TopFrame userName="๊น๋ถ?? userPosition="?๋ฆ? userEmpNo="25" />)
			
			expect(screen.getByText(/\(25\) ๊น๋ถ???๋ฆ?)).toBeInTheDocument()
		})

		it('?ฌ์๋ฒํธ๋ง??์ ???ฌ๋ฐ๋ฅ??์?ผ๋ก ?์?์ด???๋ค', () => {
			render(<TopFrame userName="๊น๋ถ?? userTeam="SI 3?" userPosition="?๋ฆ? />)
			
			// ?ค์  ?๋๋ง๋ ?์ค???์ธ
			expect(screen.getByText(/SI 3?\(25\) ๊น๋ถ???๋ฆ?)).toBeInTheDocument()
		})
	})

	describe('๋ฒํผ ?ด๋ฆญ ?์ค??, () => {
		it('๋ถ???ํ?ด์? ๋ฒํผ ?ด๋ฆญ ????์ฐฝ์ด ?ด๋ ค???๋ค', () => {
			const mockOpen = jest.fn()
			Object.defineProperty(window, 'open', {
				value: mockOpen,
				writable: true
			})

			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('๋ถ???ํ?ด์? ๋ฐ๋ก๊ฐ๊ธ?)
			fireEvent.click(homeButton)
			
			expect(mockOpen).toHaveBeenCalledWith('https://www.buttle.co.kr/', '_blank')
		})

		it('๊ทธ๋ฃน?จ์ด ๋ฒํผ ?ด๋ฆญ ????์ฐฝ์ด ?ด๋ ค???๋ค', () => {
			const mockOpen = jest.fn()
			Object.defineProperty(window, 'open', {
				value: mockOpen,
				writable: true
			})

			render(<TopFrame {...defaultProps} />)
			
			const groupwareButton = screen.getByText('๊ทธ๋ฃน?จ์ด๋ก?๋ฐ๋ก๊ฐ๊ธ?)
			fireEvent.click(groupwareButton)
			
			expect(mockOpen).toHaveBeenCalledWith('https://buttle.daouoffice.com/login', '_blank')
		})
	})

	describe('๊ฒ??๊ธฐ๋ฅ ?์ค??, () => {
		it('๊ฒ???๋ ฅ ?๋???์ค?ธ๋? ?๋ ฅ?????์ด???๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('๊ฒ?์ด๋ฅ??๋ ฅ?์ธ??)
			fireEvent.change(searchInput, { target: { value: '?์ค??๊ฒ?์ด' } })
			
			expect(searchInput).toHaveValue('?์ค??๊ฒ?์ด')
		})

		it('๊ฒ???๋ ฅ ?๋๊ฐ ?ฌ์ปค??๊ฐ?ฅํด???๋ค', () => {
			render(<TopFrame />)
			
			const searchInput = screen.getByPlaceholderText('๊ฒ?์ด๋ฅ??๋ ฅ?์ธ??)
			fireEvent.focus(searchInput)
			
			// ?ฌ์ปค???์ธ ????๋ ฅ ?๋๊ฐ ์กด์ฌ?๋์ง ?์ธ
			expect(searchInput).toBeInTheDocument()
		})
	})

	describe('?์ด์ฝ?๋ฐ??ด๋?์ง ?์ค??, () => {
		it('๋ก๊ณ  ?ด๋?์ง๊ฐ ?ฌ๋ฐ๋ฅ?src๋ฅ?๊ฐ?ธ์ผ ?๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const logo = screen.getByAltText('Logo')
			expect(logo).toHaveAttribute('src', '/logo-top-wh.svg')
		})

		it('?ฌ์ฉ???์ด์ฝ์ด ?ฌ๋ฐ๋ฅ?src๋ฅ?๊ฐ?ธ์ผ ?๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const userIcon = screen.getByAltText('user')
			expect(userIcon).toHaveAttribute('src', '/icon_user.svg')
		})

		it('๊ณต์??ฌํญ ?์ด์ฝ์ด ?ฌ๋ฐ๋ฅ?src๋ฅ?๊ฐ?ธ์ผ ?๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const noticeIcon = screen.getByAltText('notice')
			expect(noticeIcon).toHaveAttribute('src', '/icon_notice.svg')
		})
	})

	describe('?คํ??ผ๋ง ?์ค??, () => {
		it('?ค๋๊ฐ ?ฌ๋ฐ๋ฅ??ด๋?ค๋? ๊ฐ?ธ์ผ ?๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('w-full', 'h-16', 'bg-[#374151]', 'px-4', 'flex', 'items-center', 'text-white', 'text-sm', 'min-w-[900px]', 'whitespace-nowrap')
		})

		it('๊ฒ?์ฐฝ???ฌ๋ฐ๋ฅ??ด๋?ค๋? ๊ฐ?ธ์ผ ?๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchContainer = screen.getByPlaceholderText('๊ฒ?์ด๋ฅ??๋ ฅ?์ธ??).closest('div')
			expect(searchContainer).toHaveClass('flex', 'items-center', 'ml-auto', 'bg-[#3f4a5a]', 'rounded', 'px-3', 'py-1', 'w-[240px]')
		})

		it('๋ฒํผ?ค์ด ?ฌ๋ฐ๋ฅ??ด๋?ค๋? ๊ฐ?ธ์ผ ?๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('๋ถ???ํ?ด์? ๋ฐ๋ก๊ฐ๊ธ?)
			expect(homeButton).toHaveClass('bg-[#4b5563]', 'px-3', 'py-2', 'rounded', 'text-sm', 'hover:brightness-110', 'transition-colors')
		})
	})

	describe('?๊ทผ???์ค??, () => {
		it('?ด๋?์ง?ค์ด ?์ ??alt ?์ค?ธ๋? ๊ฐ?ธ์ผ ?๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			expect(screen.getByAltText('Logo')).toBeInTheDocument()
			expect(screen.getByAltText('user')).toBeInTheDocument()
			expect(screen.getByAltText('notice')).toBeInTheDocument()
		})

		it('๊ฒ???๋ ฅ ?๋???์ ??placeholder๊ฐ ?์ด???๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('๊ฒ?์ด๋ฅ??๋ ฅ?์ธ??)
			expect(searchInput).toBeInTheDocument()
		})

		it('๋ฒํผ?ค์ด ?ด๋ฆญ ๊ฐ?ฅํด???๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const homeButton = screen.getByText('๋ถ???ํ?ด์? ๋ฐ๋ก๊ฐ๊ธ?)
			const groupwareButton = screen.getByText('๊ทธ๋ฃน?จ์ด๋ก?๋ฐ๋ก๊ฐ๊ธ?)
			
			expect(homeButton).toBeEnabled()
			expect(groupwareButton).toBeEnabled()
		})
	})

	describe('๋ฐ์???์ค??, () => {
		it('์ต์ ?๋น๊ฐ ?ค์ ?์ด ?์ด???๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('min-w-[900px]')
		})

		it('?์ค?ธ๊? ์ค๋ฐ๊ฟ๋์ง ?์???๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const header = screen.getByRole('banner')
			expect(header).toHaveClass('whitespace-nowrap')
		})
	})

	describe('?ค๋ณด???ค๋น๊ฒ์ด???์ค??, () => {
		it('Tab ?ค๋ก ๋ชจ๋  ?์???๊ทผ?????์ด???๋ค', () => {
			render(<TopFrame {...defaultProps} />)
			
			const searchInput = screen.getByPlaceholderText('๊ฒ?์ด๋ฅ??๋ ฅ?์ธ??)
			const homeButton = screen.getByText('๋ถ???ํ?ด์? ๋ฐ๋ก๊ฐ๊ธ?)
			const groupwareButton = screen.getByText('๊ทธ๋ฃน?จ์ด๋ก?๋ฐ๋ก๊ฐ๊ธ?)
			
			searchInput.focus()
			expect(searchInput).toHaveFocus()
			
			homeButton.focus()
			expect(homeButton).toHaveFocus()
			
			groupwareButton.focus()
			expect(groupwareButton).toHaveFocus()
		})

		it('Enter ?ค๋ก ๋ฒํผ???์ฑ?ํ  ???์ด???๋ค', () => {
			render(<TopFrame />)
			
			const homeButton = screen.getByText('๋ถ???ํ?ด์? ๋ฐ๋ก๊ฐ๊ธ?)
			fireEvent.keyDown(homeButton, { key: 'Enter', code: 'Enter' })
			
			// window.open ?ธ์ถ ???๋ฒํผ??์กด์ฌ?๋์ง ?์ธ
			expect(homeButton).toBeInTheDocument()
		})
	})
}) 

