import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import COM0020M00 from './COM0020M00'

// Mock hooks
jest.mock('../../modules/auth/hooks/useAuth')
jest.mock('../../contexts/ToastContext')
jest.mock('../../utils/environment', () => ({
	getSystemName: () => 'BIST_NEW'
}))

// Mock fetch
global.fetch = jest.fn()

describe('COM0020M00 - ๋ก๊ทธ???๋ฉด', () => {
	const mockLogin = jest.fn()
	const mockShowSuccess = jest.fn()
	const mockShowError = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		
		// Mock useAuth hook
		const { useAuth } = require('../../modules/auth/hooks/useAuth')
		useAuth.mockReturnValue({
			login: mockLogin,
			loading: false,
			session: null,
			logout: jest.fn(),
			checkAuth: jest.fn()
		})

		// Mock useToast hook
		const { useToast } = require('../../contexts/ToastContext')
		useToast.mockReturnValue({
			showToast: jest.fn(),
			showSuccess: mockShowSuccess,
			showError: mockShowError,
			showConfirm: jest.fn(),
			showInfo: jest.fn(),
			showWarning: jest.fn()
		})
	})

	describe('?๋๋ง??์ค??, () => {
		it('๋ก๊ทธ???๋ฉด???ฌ๋ฐ๋ฅด๊ฒ ?๋๋ง๋?ด์ผ ?๋ค', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText('Sign in')).toBeInTheDocument()
			expect(screen.getByLabelText('ID')).toBeInTheDocument()
			expect(screen.getByLabelText('Password')).toBeInTheDocument()
			expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
			expect(screen.getByText('ID???ฌ์๋ฒํธ?ด๋ฉฐ, ์ด๊ธฐ๋น๋?๋ฒํธ???ฌ์๋ฒํธ?๋??')).toBeInTheDocument()
		})

		it('?์ค?๋ช???ฌ๋ฐ๋ฅด๊ฒ ?์?์ด???๋ค', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText('BIST_NEW')).toBeInTheDocument()
		})

		it('?๋จ ?๋ด ๋ฌธ๊ตฌ๊ฐ ?ฌ๋ฐ๋ฅด๊ฒ ?์?์ด???๋ค', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText(/๋ณ??์ค?์? ๋ถ?ฐ์ข?ฉ์ ?ฐ์?คํ?๋??)).toBeInTheDocument()
		})
	})

	describe('?๋ ฅ ?๋ ?์ค??, () => {
		it('?ฌ์๋ฒํธ ?๋ ฅ ???ซ์๋ง??๋ ฅ?์ด???๋ค', () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			
			// ?ซ์ ?๋ ฅ
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			expect(empNoInput).toHaveValue('12345')
			
			// ๋ฌธ์ ?๋ ฅ ???ํฐ๋ง?
			fireEvent.change(empNoInput, { target: { value: '123abc456' } })
			expect(empNoInput).toHaveValue('123456')
			
			// ?น์๋ฌธ์ ?๋ ฅ ???ํฐ๋ง?
			fireEvent.change(empNoInput, { target: { value: '123!@#456' } })
			expect(empNoInput).toHaveValue('123456')
		})

		it('๋น๋?๋ฒํธ ?๋ ฅ???ฌ๋ฐ๋ฅด๊ฒ ?์?ด์ผ ?๋ค', () => {
			render(<COM0020M00 />)
			
			const passwordInput = screen.getByLabelText('Password')
			
			fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
			expect(passwordInput).toHaveValue('testpassword')
		})
	})

	describe('๋ก๊ทธ??๊ธฐ๋ฅ ?์ค??, () => {
		it('๋น??๋๋ก?๋ก๊ทธ???๋ ???๋ฌ ๋ฉ์์ง๊ฐ ?์?์ด???๋ค', async () => {
			render(<COM0020M00 />)
			
			const loginButton = screen.getByRole('button', { name: 'Login' })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?ฌ์๋ฒํธ? ๋น๋?๋ฒํธ๋ฅ??๋ ฅ?ด์ฃผ?ธ์.')).toBeInTheDocument()
			})
		})

		it('?ฌ์๋ฒํธ๋ง??๋ ฅ?๊ณ  ๋ก๊ทธ???๋ ???๋ฌ ๋ฉ์์ง๊ฐ ?์?์ด???๋ค', async () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?ฌ์๋ฒํธ? ๋น๋?๋ฒํธ๋ฅ??๋ ฅ?ด์ฃผ?ธ์.')).toBeInTheDocument()
			})
		})

		it('๋น๋?๋ฒํธ๋ง??๋ ฅ?๊ณ  ๋ก๊ทธ???๋ ???๋ฌ ๋ฉ์์ง๊ฐ ?์?์ด???๋ค', async () => {
			render(<COM0020M00 />)
			
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?ฌ์๋ฒํธ? ๋น๋?๋ฒํธ๋ฅ??๋ ฅ?ด์ฃผ?ธ์.')).toBeInTheDocument()
			})
		})

		it('?ฌ๋ฐ๋ฅ??๋ ฅ?ผ๋ก ๋ก๊ทธ???๋ ??login ?จ์๊ฐ ?ธ์ถ?์ด???๋ค', async () => {
			mockLogin.mockResolvedValue({ success: true })
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(mockLogin).toHaveBeenCalledWith('12345', 'password')
			})
		})

		it('๋ก๊ทธ???คํจ ???๋ฌ ๋ฉ์์ง๊ฐ ?์?์ด???๋ค', async () => {
			mockLogin.mockResolvedValue({ 
				success: false, 
				message: '๋ก๊ทธ?ธ์ ?คํจ?์ต?๋ค.' 
			})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('๋ก๊ทธ?ธ์ ?คํจ?์ต?๋ค.')).toBeInTheDocument()
			})
		})

		it('๋ก๊ทธ??์ค?๋ก๋ฉ ?ํ๊ฐ ?์?์ด???๋ค', () => {
			const { useAuth } = require('../../modules/auth/hooks/useAuth')
			useAuth.mockReturnValue({
				login: mockLogin,
				loading: true,
				session: null,
				logout: jest.fn(),
				checkAuth: jest.fn()
			})
			
			render(<COM0020M00 />)
			
			expect(screen.getByRole('button', { name: '๋ก๊ทธ??์ค?..' })).toBeInTheDocument()
			expect(screen.getByRole('button', { name: '๋ก๊ทธ??์ค?..' })).toBeDisabled()
		})
	})

	describe('๋น๋?๋ฒํธ ๋ณ๊ฒ??์ค??, () => {
		it('๋น๋?๋ฒํธ ๋ณ๊ฒฝ์ด ?์??๊ฒฝ์ฐ ?์???์?์ด???๋ค', async () => {
			mockLogin.mockResolvedValue({ 
				success: false, 
				needsPasswordChange: true,
				message: '์ด๊ธฐ ๋น๋?๋ฒํธ?๋?? ๋น๋?๋ฒํธ๋ฅ?๋ณ๊ฒฝํด??๋ก๊ทธ?ธํ  ???์ต?๋ค.'
			})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('์ด๊ธฐ ๋น๋?๋ฒํธ?๋?? ๋น๋?๋ฒํธ๋ฅ?๋ณ๊ฒฝํด??๋ก๊ทธ?ธํ  ???์ต?๋ค.')).toBeInTheDocument()
			})
		})
	})

	describe('???์ถ ?์ค??, () => {
		it('Enter ?ค๋ก ???์ถ??๊ฐ?ฅํด???๋ค', async () => {
			mockLogin.mockResolvedValue({ success: true })
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const form = document.querySelector('form') as HTMLFormElement
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.submit(form)
			
			await waitFor(() => {
				expect(mockLogin).toHaveBeenCalledWith('12345', 'password')
			})
		})
	})

	describe('?๋ฌ ์ฒ๋ฆฌ ?์ค??, () => {
		it('๋ก๊ทธ??์ค??์ธ ๋ฐ์ ???๋ฌ ๋ฉ์์ง๊ฐ ?์?์ด???๋ค', async () => {
			mockLogin.mockRejectedValue(new Error('?คํธ?ํฌ ?ค๋ฅ'))
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?คํธ?ํฌ ?ค๋ฅ')).toBeInTheDocument()
			})
		})

		it('?????๋ ?๋ฌ ๋ฐ์ ??๊ธฐ๋ณธ ?๋ฌ ๋ฉ์์ง๊ฐ ?์?์ด???๋ค', async () => {
			mockLogin.mockRejectedValue({})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('๋ก๊ทธ??์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.')).toBeInTheDocument()
			})
		})
	})

	describe('?๊ทผ???์ค??, () => {
		it('?๋ ฅ ?๋???์ ??label???ฐ๊ฒฐ?์ด???๋ค', () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			
			expect(empNoInput).toBeInTheDocument()
			expect(passwordInput).toBeInTheDocument()
		})

		it('๋ก๊ทธ??๋ฒํผ??๋นํ?ฑํ ?ํ?????๊ทผ???์ฑ???ฌ๋ฐ๋ฅด๊ฒ ?ค์ ?์ด???๋ค', () => {
			const { useAuth } = require('../../modules/auth/hooks/useAuth')
			useAuth.mockReturnValue({
				login: mockLogin,
				loading: true,
				session: null,
				logout: jest.fn(),
				checkAuth: jest.fn()
			})
			
			render(<COM0020M00 />)
			
			const loginButton = screen.getByRole('button', { name: '๋ก๊ทธ??์ค?..' })
			expect(loginButton).toBeDisabled()
		})
	})
}) 

