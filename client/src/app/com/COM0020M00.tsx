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
	// infoMsg 상태 및 setInfoMsg 삭제

	// 숫자만 입력되도록 처리
	const handleEmpNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, '')
		setEmpNo(value)
	}

	// 로그인 처리
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		// 보안: 로그인 시도 로그 제거
		setError(null)

		if (!empNo || !password) {
			setError('사원번호와 비밀번호를 입력해주세요.')
			console.log('입력값 없음 (2)')
			return
		}

		try {
			const loginData: LoginRequest = {
				empNo,
				password,
			}
			// 보안: 민감한 정보 로그 제거

			const result = await login(empNo, password)

			// 1. 비밀번호 변경 필요 분기(최우선)
			if (result.needsPasswordChange) {
				setPwdChangeUserId(empNo)
				setPendingLogin({ empNo, password })
				setPendingNeedsPwdChange(true)
				setShowPwdChange(true) // 팝업이 반드시 뜨도록 직접 호출
				setError(
					result.message ||
						'초기 비밀번호입니다. 비밀번호를 변경해야 로그인할 수 있습니다.'
				)
				return // 아래 분기로 내려가지 않게!
			}

			// 2. 로그인 성공
			if (result.success) {
				window.location.reload()
				return
			}

			// 3. 로그인 실패
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
			// 사용자 친화적 오류 메시지 처리
			const errorMessage =
				(err as any)?.message || '로그인 중 오류가 발생했습니다.'
			setError(errorMessage)

			// 로그 완전 제거 - 보안상 민감한 정보 노출 방지
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
			// API URL 환경변수 기반 설정
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
						'비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 다시 로그인하세요.'
				)
				setShowPwdChange(false) // 팝업 닫기
				setPendingNeedsPwdChange(false) // 상태 꼬임 방지
				setEmpNo('')
				setPassword('')
				setTimeout(() => {
					window.location.reload() // 로그인 화면으로 돌아가기
				}, 1500)
			} else {
				showError(data.message || '비밀번호 변경에 실패했습니다.')
			}
		} catch (err) {
			showError('비밀번호 변경 중 오류가 발생했습니다.')
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
			{/* 안내 문구(infoMsg) 렌더링 부분 삭제 */}
			<div
				className='min-h-screen w-full flex items-center justify-center bg-gray-100 px-4'
				style={{ backgroundImage: `url('/login_bg.png')` }}
			>
				<div className='w-full max-w-5xl bg-gradient-to-b from-sky-50 to-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row'>
					{/* 이미지 영역 */}
					<div className='relative w-full md:w-1/2 h-[300px] md:h-auto'>
						{/* 배경 이미지 */}
						<img
							src='/login_notebook.png'
							alt='Login'
							className='w-full h-full object-cover md:rounded-l-3xl'
						/>

						{/* 로고 이미지 (좌측 상단 고정) */}
						<img
							src='/logo.svg'
							alt='Logo'
							className='absolute top-4 left-4 max-w-md h-auto'
						/>
						{/* 시스템명 (우측 상단 고정) */}
						<div className='absolute top-4 right-4'>
							<span className='text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded'>
								{getSystemName()}
							</span>
						</div>
					</div>

					{/* 로그인 영역 */}
					<div className='w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white'>
						<h2 className='text-3xl md:text-5xl font-extrabold text-gray-800 mb-10'>
							Sign in
						</h2>

						<form onSubmit={handleLogin}>
							{/* ID 입력 */}
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

							{/* Password 입력 */}
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

							{/* 에러 메시지 */}
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
								{loading ? '로그인 중...' : 'Login'}
							</button>
						</form>

						{/* 안내 문구 */}
						<p className='text-sm text-gray-600 mt-6'>
							ID는 사원번호이며, 초기비밀번호는 사원번호입니다.
						</p>
					</div>
				</div>

				{/* 하단 안내 */}
				<div className='absolute bottom-4 text-center w-full text-gray-700 text-sm'>
					본 시스템은 부뜰종합전산시스템입니다. 문의사항은 경영지원본부를 이용해
					주십시오.
				</div>
			</div>
		</>
	)
}
