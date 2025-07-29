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

describe('COM0020M00 - 로그???�면', () => {
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

	describe('?�더�??�스??, () => {
		it('로그???�면???�바르게 ?�더링되?�야 ?�다', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText('Sign in')).toBeInTheDocument()
			expect(screen.getByLabelText('ID')).toBeInTheDocument()
			expect(screen.getByLabelText('Password')).toBeInTheDocument()
			expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
			expect(screen.getByText('ID???�원번호?�며, 초기비�?번호???�원번호?�니??')).toBeInTheDocument()
		})

		it('?�스?�명???�바르게 ?�시?�어???�다', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText('BIST_NEW')).toBeInTheDocument()
		})

		it('?�단 ?�내 문구가 ?�바르게 ?�시?�어???�다', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText(/�??�스?��? 부?�종?�전?�시?�템?�니??)).toBeInTheDocument()
		})
	})

	describe('?�력 ?�드 ?�스??, () => {
		it('?�원번호 ?�력 ???�자�??�력?�어???�다', () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			
			// ?�자 ?�력
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			expect(empNoInput).toHaveValue('12345')
			
			// 문자 ?�력 ???�터�?
			fireEvent.change(empNoInput, { target: { value: '123abc456' } })
			expect(empNoInput).toHaveValue('123456')
			
			// ?�수문자 ?�력 ???�터�?
			fireEvent.change(empNoInput, { target: { value: '123!@#456' } })
			expect(empNoInput).toHaveValue('123456')
		})

		it('비�?번호 ?�력???�바르게 ?�작?�야 ?�다', () => {
			render(<COM0020M00 />)
			
			const passwordInput = screen.getByLabelText('Password')
			
			fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
			expect(passwordInput).toHaveValue('testpassword')
		})
	})

	describe('로그??기능 ?�스??, () => {
		it('�??�드�?로그???�도 ???�러 메시지가 ?�시?�어???�다', async () => {
			render(<COM0020M00 />)
			
			const loginButton = screen.getByRole('button', { name: 'Login' })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?�원번호?� 비�?번호�??�력?�주?�요.')).toBeInTheDocument()
			})
		})

		it('?�원번호�??�력?�고 로그???�도 ???�러 메시지가 ?�시?�어???�다', async () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?�원번호?� 비�?번호�??�력?�주?�요.')).toBeInTheDocument()
			})
		})

		it('비�?번호�??�력?�고 로그???�도 ???�러 메시지가 ?�시?�어???�다', async () => {
			render(<COM0020M00 />)
			
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?�원번호?� 비�?번호�??�력?�주?�요.')).toBeInTheDocument()
			})
		})

		it('?�바�??�력?�로 로그???�도 ??login ?�수가 ?�출?�어???�다', async () => {
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

		it('로그???�패 ???�러 메시지가 ?�시?�어???�다', async () => {
			mockLogin.mockResolvedValue({ 
				success: false, 
				message: '로그?�에 ?�패?�습?�다.' 
			})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('로그?�에 ?�패?�습?�다.')).toBeInTheDocument()
			})
		})

		it('로그??�?로딩 ?�태가 ?�시?�어???�다', () => {
			const { useAuth } = require('../../modules/auth/hooks/useAuth')
			useAuth.mockReturnValue({
				login: mockLogin,
				loading: true,
				session: null,
				logout: jest.fn(),
				checkAuth: jest.fn()
			})
			
			render(<COM0020M00 />)
			
			expect(screen.getByRole('button', { name: '로그??�?..' })).toBeInTheDocument()
			expect(screen.getByRole('button', { name: '로그??�?..' })).toBeDisabled()
		})
	})

	describe('비�?번호 변�??�스??, () => {
		it('비�?번호 변경이 ?�요??경우 ?�업???�시?�어???�다', async () => {
			mockLogin.mockResolvedValue({ 
				success: false, 
				needsPasswordChange: true,
				message: '초기 비�?번호?�니?? 비�?번호�?변경해??로그?�할 ???�습?�다.'
			})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('초기 비�?번호?�니?? 비�?번호�?변경해??로그?�할 ???�습?�다.')).toBeInTheDocument()
			})
		})
	})

	describe('???�출 ?�스??, () => {
		it('Enter ?�로 ???�출??가?�해???�다', async () => {
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

	describe('?�러 처리 ?�스??, () => {
		it('로그??�??�외 발생 ???�러 메시지가 ?�시?�어???�다', async () => {
			mockLogin.mockRejectedValue(new Error('?�트?�크 ?�류'))
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?�트?�크 ?�류')).toBeInTheDocument()
			})
		})

		it('?????�는 ?�러 발생 ??기본 ?�러 메시지가 ?�시?�어???�다', async () => {
			mockLogin.mockRejectedValue({})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('로그??�??�류가 발생?�습?�다.')).toBeInTheDocument()
			})
		})
	})

	describe('?�근???�스??, () => {
		it('?�력 ?�드???�절??label???�결?�어???�다', () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			
			expect(empNoInput).toBeInTheDocument()
			expect(passwordInput).toBeInTheDocument()
		})

		it('로그??버튼??비활?�화 ?�태?????�근???�성???�바르게 ?�정?�어???�다', () => {
			const { useAuth } = require('../../modules/auth/hooks/useAuth')
			useAuth.mockReturnValue({
				login: mockLogin,
				loading: true,
				session: null,
				logout: jest.fn(),
				checkAuth: jest.fn()
			})
			
			render(<COM0020M00 />)
			
			const loginButton = screen.getByRole('button', { name: '로그??�?..' })
			expect(loginButton).toBeDisabled()
		})
	})
}) 

