'use client'

import React, { useState } from 'react'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import { LoginRequest } from '../../modules/auth/types'
import { PasswordChangePopup } from '../../modules/auth/components/PasswordChangePopup'
import { getSystemName } from '../../utils/environment'
import { useToast } from '../../contexts/ToastContext'

export default function COM0020M00() {
	const { login, loading } = useAuth()
	const { showSuccess, showError } = useToast()
	const [empNo, setEmpNo] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [showPwdChange, setShowPwdChange] = useState(false)
	const [pwdChangeUserId, setPwdChangeUserId] = useState('')
	const [pendingLogin, setPendingLogin] = useState<{
		empNo: string
		password: string
	} | null>(null)
	const [pendingNeedsPwdChange, setPendingNeedsPwdChange] = useState(false)
	// infoMsg ?�태 �?setInfoMsg ??��

	// ?�자�??�력?�도�?처리
	const handleEmpNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, '')
		setEmpNo(value)
	}

	// 로그??처리
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		// 보안: 로그???�도 로그 ?�거
		setError(null)

		if (!empNo || !password) {
			setError('?�원번호?� 비�?번호�??�력?�주?�요.')
			console.log('?�력�??�음 (2)')
			return
		}

		try {
			const loginData: LoginRequest = {
				empNo,
				password,
			}
			// 보안: 민감???�보 로그 ?�거

			const result = await login(empNo, password)

			// 1. 비�?번호 변�??�요 분기(최우??
			if (result.needsPasswordChange) {
				setPwdChangeUserId(empNo)
				setPendingLogin({ empNo, password })
				setPendingNeedsPwdChange(true)
				setShowPwdChange(true) // ?�업??반드???�도�?직접 ?�출
				setError(
					result.message ||
						'초기 비�?번호?�니?? 비�?번호�?변경해??로그?�할 ???�습?�다.'
				)
				return // ?�래 분기�??�려가지 ?�게!
			}

			// 2. 로그???�공
			if (result.success) {
				window.location.reload()
				return
			}

			// 3. 로그???�패
			setError(
				typeof (result as any)?.message === 'string'
					? (result as any).message
					: (result as any)?.message
						? JSON.stringify((result as any).message)
						: typeof result === 'string'
							? result
							: JSON.stringify(result)
			)
		} catch (err) {
			// ?�용??친화???�류 메시지 처리
			const errorMessage =
				(err as any)?.message || '로그??�??�류가 발생?�습?�다.'
			setError(errorMessage)

			// 로그 ?�전 ?�거 - 보안??민감???�보 ?�출 방�?
		}
	}

	React.useEffect(() => {
		if (pendingNeedsPwdChange && !showPwdChange) {
			setShowPwdChange(true)
			setPendingNeedsPwdChange(false)
		}
	}, [pendingNeedsPwdChange, showPwdChange])

	const handlePwdChangeSubmit = async (newPassword: string) => {
		try {
			// API URL ?�경변??기반 ?�정
			const apiUrl =
				typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
					? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/change-password`
					: '/api/auth/change-password'

			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: pwdChangeUserId, newPassword }),
			})
			const data = await response.json()

			if (data.success) {
				showSuccess(
					data.message ||
						'비�?번호가 ?�공?�으�?변경되?�습?�다. ??비�?번호�??�시 로그?�하?�요.'
				)
				setShowPwdChange(false) // ?�업 ?�기
				setPendingNeedsPwdChange(false) // ?�태 꼬임 방�?
				setEmpNo('')
				setPassword('')
				setTimeout(() => {
					window.location.reload() // 로그???�면?�로 ?�아가�?
				}, 1500)
			} else {
				showError(data.message || '비�?번호 변경에 ?�패?�습?�다.')
			}
		} catch (err) {
			showError('비�?번호 변�?�??�류가 발생?�습?�다.')
		}
	}

	return (
		<>
			<PasswordChangePopup
				isOpen={showPwdChange}
				onClose={() => {
					setShowPwdChange(false)
					setPendingNeedsPwdChange(false)
				}}
				onSubmit={handlePwdChangeSubmit}
				userId={pwdChangeUserId}
			/>
			{/* ?�내 문구(infoMsg) ?�더�?부�???�� */}
			<div
				className='min-h-screen w-full flex items-center justify-center bg-gray-100 px-4'
				style={{ backgroundImage: `url('/login_bg.png')` }}
			>
				<div className='w-full max-w-5xl bg-gradient-to-b from-sky-50 to-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row'>
					{/* ?��?지 ?�역 */}
					<div className='relative w-full md:w-1/2 h-[300px] md:h-auto'>
						{/* 배경 ?��?지 */}
						<img
							src='/login_notebook.png'
							alt='Login'
							className='w-full h-full object-cover md:rounded-l-3xl'
						/>

						{/* 로고 ?��?지 (좌측 ?�단 고정) */}
						<img
							src='/logo.svg'
							alt='Logo'
							className='absolute top-4 left-4 max-w-md h-auto'
						/>
						{/* ?�스?�명 (?�측 ?�단 고정) */}
						<div className='absolute top-4 right-4'>
							<span className='text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded'>
								{getSystemName()}
							</span>
						</div>
					</div>

					{/* 로그???�역 */}
					<div className='w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white'>
						<h2 className='text-3xl md:text-5xl font-extrabold text-gray-800 mb-10'>
							Sign in
						</h2>

						<form onSubmit={handleLogin}>
							{/* ID ?�력 */}
							<div className='mb-6'>
								<label
									htmlFor='empNo'
									className='block text-gray-800 text-lg font-bold mb-2'
								>
									ID
								</label>
								<input
									id='empNo'
									type='text'
									placeholder='Employee number'
									value={empNo}
									onChange={handleEmpNoChange}
									inputMode='numeric'
									pattern='[0-9]*'
									autoComplete='off'
									spellCheck={false}
									className='w-full px-6 py-3 rounded-full bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500'
								/>
							</div>

							{/* Password ?�력 */}
							<div className='mb-4'>
								<label
									htmlFor='password'
									className='block text-gray-800 text-lg font-bold mb-2'
								>
									Password
								</label>
								<input
									id='password'
									type='password'
									placeholder='Password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									spellCheck={false}
									className='w-full px-6 py-3 rounded-full bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500'
								/>
							</div>

							{/* ?�러 메시지 */}
							{error && (
								<div className='mb-4 text-red-600 text-sm font-medium'>
									{typeof error === 'string' ? error : JSON.stringify(error)}
								</div>
							)}

							{/* Login 버튼 */}
							<button
								type='submit'
								disabled={loading}
								className='w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold py-3 rounded-full text-lg transition duration-200'
							>
								{loading ? '로그??�?..' : 'Login'}
							</button>
						</form>

						{/* ?�내 문구 */}
						<p className='text-sm text-gray-600 mt-6'>
							ID???�원번호?�며, 초기비�?번호???�원번호?�니??
						</p>
					</div>
				</div>

				{/* ?�단 ?�내 */}
				<div className='absolute bottom-4 text-center w-full text-gray-700 text-sm'>
					�??�스?��? 부?�종?�전?�시?�템?�니?? 문의?�항?� 경영지?�본부�??�용??
					주십?�오.
				</div>
			</div>
		</>
	)
}


