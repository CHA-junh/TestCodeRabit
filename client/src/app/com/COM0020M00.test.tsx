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

describe('COM0020M00 - 로그인 화면', () => {
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

	describe('렌더링 테스트', () => {
		it('로그인 화면이 올바르게 렌더링되어야 한다', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText('Sign in')).toBeInTheDocument()
			expect(screen.getByLabelText('ID')).toBeInTheDocument()
			expect(screen.getByLabelText('Password')).toBeInTheDocument()
			expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
			expect(screen.getByText('ID는 사원번호이며, 초기비밀번호는 사원번호입니다.')).toBeInTheDocument()
		})

		it('시스템명이 올바르게 표시되어야 한다', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText('BIST_NEW')).toBeInTheDocument()
		})

		it('하단 안내 문구가 올바르게 표시되어야 한다', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText(/본 시스템은 부뜰종합전산시스템입니다/)).toBeInTheDocument()
		})
	})

	describe('입력 필드 테스트', () => {
		it('사원번호 입력 시 숫자만 입력되어야 한다', () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			
			// 숫자 입력
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			expect(empNoInput).toHaveValue('12345')
			
			// 문자 입력 시 필터링
			fireEvent.change(empNoInput, { target: { value: '123abc456' } })
			expect(empNoInput).toHaveValue('123456')
			
			// 특수문자 입력 시 필터링
			fireEvent.change(empNoInput, { target: { value: '123!@#456' } })
			expect(empNoInput).toHaveValue('123456')
		})

		it('비밀번호 입력이 올바르게 동작해야 한다', () => {
			render(<COM0020M00 />)
			
			const passwordInput = screen.getByLabelText('Password')
			
			fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
			expect(passwordInput).toHaveValue('testpassword')
		})
	})

	describe('로그인 기능 테스트', () => {
		it('빈 필드로 로그인 시도 시 에러 메시지가 표시되어야 한다', async () => {
			render(<COM0020M00 />)
			
			const loginButton = screen.getByRole('button', { name: 'Login' })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('사원번호와 비밀번호를 입력해주세요.')).toBeInTheDocument()
			})
		})

		it('사원번호만 입력하고 로그인 시도 시 에러 메시지가 표시되어야 한다', async () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('사원번호와 비밀번호를 입력해주세요.')).toBeInTheDocument()
			})
		})

		it('비밀번호만 입력하고 로그인 시도 시 에러 메시지가 표시되어야 한다', async () => {
			render(<COM0020M00 />)
			
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('사원번호와 비밀번호를 입력해주세요.')).toBeInTheDocument()
			})
		})

		it('올바른 입력으로 로그인 시도 시 login 함수가 호출되어야 한다', async () => {
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

		it('로그인 실패 시 에러 메시지가 표시되어야 한다', async () => {
			mockLogin.mockResolvedValue({ 
				success: false, 
				message: '로그인에 실패했습니다.' 
			})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('로그인에 실패했습니다.')).toBeInTheDocument()
			})
		})

		it('로그인 중 로딩 상태가 표시되어야 한다', () => {
			const { useAuth } = require('../../modules/auth/hooks/useAuth')
			useAuth.mockReturnValue({
				login: mockLogin,
				loading: true,
				session: null,
				logout: jest.fn(),
				checkAuth: jest.fn()
			})
			
			render(<COM0020M00 />)
			
			expect(screen.getByRole('button', { name: '로그인 중...' })).toBeInTheDocument()
			expect(screen.getByRole('button', { name: '로그인 중...' })).toBeDisabled()
		})
	})

	describe('비밀번호 변경 테스트', () => {
		it('비밀번호 변경이 필요한 경우 팝업이 표시되어야 한다', async () => {
			mockLogin.mockResolvedValue({ 
				success: false, 
				needsPasswordChange: true,
				message: '초기 비밀번호입니다. 비밀번호를 변경해야 로그인할 수 있습니다.'
			})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('초기 비밀번호입니다. 비밀번호를 변경해야 로그인할 수 있습니다.')).toBeInTheDocument()
			})
		})
	})

	describe('폼 제출 테스트', () => {
		it('Enter 키로 폼 제출이 가능해야 한다', async () => {
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

	describe('에러 처리 테스트', () => {
		it('로그인 중 예외 발생 시 에러 메시지가 표시되어야 한다', async () => {
			mockLogin.mockRejectedValue(new Error('네트워크 오류'))
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('네트워크 오류')).toBeInTheDocument()
			})
		})

		it('알 수 없는 에러 발생 시 기본 에러 메시지가 표시되어야 한다', async () => {
			mockLogin.mockRejectedValue({})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('로그인 중 오류가 발생했습니다.')).toBeInTheDocument()
			})
		})
	})

	describe('접근성 테스트', () => {
		it('입력 필드에 적절한 label이 연결되어야 한다', () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			
			expect(empNoInput).toBeInTheDocument()
			expect(passwordInput).toBeInTheDocument()
		})

		it('로그인 버튼이 비활성화 상태일 때 접근성 속성이 올바르게 설정되어야 한다', () => {
			const { useAuth } = require('../../modules/auth/hooks/useAuth')
			useAuth.mockReturnValue({
				login: mockLogin,
				loading: true,
				session: null,
				logout: jest.fn(),
				checkAuth: jest.fn()
			})
			
			render(<COM0020M00 />)
			
			const loginButton = screen.getByRole('button', { name: '로그인 중...' })
			expect(loginButton).toBeDisabled()
		})
	})
}) 