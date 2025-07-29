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

describe('COM0020M00 - ë¡œê·¸???”ë©´', () => {
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

	describe('?Œë”ë§??ŒìŠ¤??, () => {
		it('ë¡œê·¸???”ë©´???¬ë°”ë¥´ê²Œ ?Œë”ë§ë˜?´ì•¼ ?œë‹¤', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText('Sign in')).toBeInTheDocument()
			expect(screen.getByLabelText('ID')).toBeInTheDocument()
			expect(screen.getByLabelText('Password')).toBeInTheDocument()
			expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
			expect(screen.getByText('ID???¬ì›ë²ˆí˜¸?´ë©°, ì´ˆê¸°ë¹„ë?ë²ˆí˜¸???¬ì›ë²ˆí˜¸?…ë‹ˆ??')).toBeInTheDocument()
		})

		it('?œìŠ¤?œëª…???¬ë°”ë¥´ê²Œ ?œì‹œ?˜ì–´???œë‹¤', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText('BIST_NEW')).toBeInTheDocument()
		})

		it('?˜ë‹¨ ?ˆë‚´ ë¬¸êµ¬ê°€ ?¬ë°”ë¥´ê²Œ ?œì‹œ?˜ì–´???œë‹¤', () => {
			render(<COM0020M00 />)
			
			expect(screen.getByText(/ë³??œìŠ¤?œì? ë¶€?°ì¢…?©ì „?°ì‹œ?¤í…œ?…ë‹ˆ??)).toBeInTheDocument()
		})
	})

	describe('?…ë ¥ ?„ë“œ ?ŒìŠ¤??, () => {
		it('?¬ì›ë²ˆí˜¸ ?…ë ¥ ???«ìë§??…ë ¥?˜ì–´???œë‹¤', () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			
			// ?«ì ?…ë ¥
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			expect(empNoInput).toHaveValue('12345')
			
			// ë¬¸ì ?…ë ¥ ???„í„°ë§?
			fireEvent.change(empNoInput, { target: { value: '123abc456' } })
			expect(empNoInput).toHaveValue('123456')
			
			// ?¹ìˆ˜ë¬¸ì ?…ë ¥ ???„í„°ë§?
			fireEvent.change(empNoInput, { target: { value: '123!@#456' } })
			expect(empNoInput).toHaveValue('123456')
		})

		it('ë¹„ë?ë²ˆí˜¸ ?…ë ¥???¬ë°”ë¥´ê²Œ ?™ì‘?´ì•¼ ?œë‹¤', () => {
			render(<COM0020M00 />)
			
			const passwordInput = screen.getByLabelText('Password')
			
			fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
			expect(passwordInput).toHaveValue('testpassword')
		})
	})

	describe('ë¡œê·¸??ê¸°ëŠ¥ ?ŒìŠ¤??, () => {
		it('ë¹??„ë“œë¡?ë¡œê·¸???œë„ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?˜ì–´???œë‹¤', async () => {
			render(<COM0020M00 />)
			
			const loginButton = screen.getByRole('button', { name: 'Login' })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?¬ì›ë²ˆí˜¸?€ ë¹„ë?ë²ˆí˜¸ë¥??…ë ¥?´ì£¼?¸ìš”.')).toBeInTheDocument()
			})
		})

		it('?¬ì›ë²ˆí˜¸ë§??…ë ¥?˜ê³  ë¡œê·¸???œë„ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?˜ì–´???œë‹¤', async () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?¬ì›ë²ˆí˜¸?€ ë¹„ë?ë²ˆí˜¸ë¥??…ë ¥?´ì£¼?¸ìš”.')).toBeInTheDocument()
			})
		})

		it('ë¹„ë?ë²ˆí˜¸ë§??…ë ¥?˜ê³  ë¡œê·¸???œë„ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?˜ì–´???œë‹¤', async () => {
			render(<COM0020M00 />)
			
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?¬ì›ë²ˆí˜¸?€ ë¹„ë?ë²ˆí˜¸ë¥??…ë ¥?´ì£¼?¸ìš”.')).toBeInTheDocument()
			})
		})

		it('?¬ë°”ë¥??…ë ¥?¼ë¡œ ë¡œê·¸???œë„ ??login ?¨ìˆ˜ê°€ ?¸ì¶œ?˜ì–´???œë‹¤', async () => {
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

		it('ë¡œê·¸???¤íŒ¨ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?˜ì–´???œë‹¤', async () => {
			mockLogin.mockResolvedValue({ 
				success: false, 
				message: 'ë¡œê·¸?¸ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.' 
			})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('ë¡œê·¸?¸ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.')).toBeInTheDocument()
			})
		})

		it('ë¡œê·¸??ì¤?ë¡œë”© ?íƒœê°€ ?œì‹œ?˜ì–´???œë‹¤', () => {
			const { useAuth } = require('../../modules/auth/hooks/useAuth')
			useAuth.mockReturnValue({
				login: mockLogin,
				loading: true,
				session: null,
				logout: jest.fn(),
				checkAuth: jest.fn()
			})
			
			render(<COM0020M00 />)
			
			expect(screen.getByRole('button', { name: 'ë¡œê·¸??ì¤?..' })).toBeInTheDocument()
			expect(screen.getByRole('button', { name: 'ë¡œê·¸??ì¤?..' })).toBeDisabled()
		})
	})

	describe('ë¹„ë?ë²ˆí˜¸ ë³€ê²??ŒìŠ¤??, () => {
		it('ë¹„ë?ë²ˆí˜¸ ë³€ê²½ì´ ?„ìš”??ê²½ìš° ?ì—…???œì‹œ?˜ì–´???œë‹¤', async () => {
			mockLogin.mockResolvedValue({ 
				success: false, 
				needsPasswordChange: true,
				message: 'ì´ˆê¸° ë¹„ë?ë²ˆí˜¸?…ë‹ˆ?? ë¹„ë?ë²ˆí˜¸ë¥?ë³€ê²½í•´??ë¡œê·¸?¸í•  ???ˆìŠµ?ˆë‹¤.'
			})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('ì´ˆê¸° ë¹„ë?ë²ˆí˜¸?…ë‹ˆ?? ë¹„ë?ë²ˆí˜¸ë¥?ë³€ê²½í•´??ë¡œê·¸?¸í•  ???ˆìŠµ?ˆë‹¤.')).toBeInTheDocument()
			})
		})
	})

	describe('???œì¶œ ?ŒìŠ¤??, () => {
		it('Enter ?¤ë¡œ ???œì¶œ??ê°€?¥í•´???œë‹¤', async () => {
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

	describe('?ëŸ¬ ì²˜ë¦¬ ?ŒìŠ¤??, () => {
		it('ë¡œê·¸??ì¤??ˆì™¸ ë°œìƒ ???ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?˜ì–´???œë‹¤', async () => {
			mockLogin.mockRejectedValue(new Error('?¤íŠ¸?Œí¬ ?¤ë¥˜'))
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('?¤íŠ¸?Œí¬ ?¤ë¥˜')).toBeInTheDocument()
			})
		})

		it('?????†ëŠ” ?ëŸ¬ ë°œìƒ ??ê¸°ë³¸ ?ëŸ¬ ë©”ì‹œì§€ê°€ ?œì‹œ?˜ì–´???œë‹¤', async () => {
			mockLogin.mockRejectedValue({})
			
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			const loginButton = screen.getByRole('button', { name: 'Login' })
			
			fireEvent.change(empNoInput, { target: { value: '12345' } })
			fireEvent.change(passwordInput, { target: { value: 'password' } })
			fireEvent.click(loginButton)
			
			await waitFor(() => {
				expect(screen.getByText('ë¡œê·¸??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.')).toBeInTheDocument()
			})
		})
	})

	describe('?‘ê·¼???ŒìŠ¤??, () => {
		it('?…ë ¥ ?„ë“œ???ì ˆ??label???°ê²°?˜ì–´???œë‹¤', () => {
			render(<COM0020M00 />)
			
			const empNoInput = screen.getByLabelText('ID')
			const passwordInput = screen.getByLabelText('Password')
			
			expect(empNoInput).toBeInTheDocument()
			expect(passwordInput).toBeInTheDocument()
		})

		it('ë¡œê·¸??ë²„íŠ¼??ë¹„í™œ?±í™” ?íƒœ?????‘ê·¼???ì„±???¬ë°”ë¥´ê²Œ ?¤ì •?˜ì–´???œë‹¤', () => {
			const { useAuth } = require('../../modules/auth/hooks/useAuth')
			useAuth.mockReturnValue({
				login: mockLogin,
				loading: true,
				session: null,
				logout: jest.fn(),
				checkAuth: jest.fn()
			})
			
			render(<COM0020M00 />)
			
			const loginButton = screen.getByRole('button', { name: 'ë¡œê·¸??ì¤?..' })
			expect(loginButton).toBeDisabled()
		})
	})
}) 

