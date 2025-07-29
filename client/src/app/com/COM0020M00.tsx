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
	// infoMsg ?íƒœ ë°?setInfoMsg ?? œ

	// ?«ìë§??…ë ¥?˜ë„ë¡?ì²˜ë¦¬
	const handleEmpNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, '')
		setEmpNo(value)
	}

	// ë¡œê·¸??ì²˜ë¦¬
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		// ë³´ì•ˆ: ë¡œê·¸???œë„ ë¡œê·¸ ?œê±°
		setError(null)

		if (!empNo || !password) {
			setError('?¬ì›ë²ˆí˜¸?€ ë¹„ë?ë²ˆí˜¸ë¥??…ë ¥?´ì£¼?¸ìš”.')
			console.log('?…ë ¥ê°??†ìŒ (2)')
			return
		}

		try {
			const loginData: LoginRequest = {
				empNo,
				password,
			}
			// ë³´ì•ˆ: ë¯¼ê°???•ë³´ ë¡œê·¸ ?œê±°

			const result = await login(empNo, password)

			// 1. ë¹„ë?ë²ˆí˜¸ ë³€ê²??„ìš” ë¶„ê¸°(ìµœìš°??
			if (result.needsPasswordChange) {
				setPwdChangeUserId(empNo)
				setPendingLogin({ empNo, password })
				setPendingNeedsPwdChange(true)
				setShowPwdChange(true) // ?ì—…??ë°˜ë“œ???¨ë„ë¡?ì§ì ‘ ?¸ì¶œ
				setError(
					result.message ||
						'ì´ˆê¸° ë¹„ë?ë²ˆí˜¸?…ë‹ˆ?? ë¹„ë?ë²ˆí˜¸ë¥?ë³€ê²½í•´??ë¡œê·¸?¸í•  ???ˆìŠµ?ˆë‹¤.'
				)
				return // ?„ë˜ ë¶„ê¸°ë¡??´ë ¤ê°€ì§€ ?Šê²Œ!
			}

			// 2. ë¡œê·¸???±ê³µ
			if (result.success) {
				window.location.reload()
				return
			}

			// 3. ë¡œê·¸???¤íŒ¨
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
			// ?¬ìš©??ì¹œí™”???¤ë¥˜ ë©”ì‹œì§€ ì²˜ë¦¬
			const errorMessage =
				(err as any)?.message || 'ë¡œê·¸??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.'
			setError(errorMessage)

			// ë¡œê·¸ ?„ì „ ?œê±° - ë³´ì•ˆ??ë¯¼ê°???•ë³´ ?¸ì¶œ ë°©ì?
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
			// API URL ?˜ê²½ë³€??ê¸°ë°˜ ?¤ì •
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
						'ë¹„ë?ë²ˆí˜¸ê°€ ?±ê³µ?ìœ¼ë¡?ë³€ê²½ë˜?ˆìŠµ?ˆë‹¤. ??ë¹„ë?ë²ˆí˜¸ë¡??¤ì‹œ ë¡œê·¸?¸í•˜?¸ìš”.'
				)
				setShowPwdChange(false) // ?ì—… ?«ê¸°
				setPendingNeedsPwdChange(false) // ?íƒœ ê¼¬ì„ ë°©ì?
				setEmpNo('')
				setPassword('')
				setTimeout(() => {
					window.location.reload() // ë¡œê·¸???”ë©´?¼ë¡œ ?Œì•„ê°€ê¸?
				}, 1500)
			} else {
				showError(data.message || 'ë¹„ë?ë²ˆí˜¸ ë³€ê²½ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.')
			}
		} catch (err) {
			showError('ë¹„ë?ë²ˆí˜¸ ë³€ê²?ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.')
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
			{/* ?ˆë‚´ ë¬¸êµ¬(infoMsg) ?Œë”ë§?ë¶€ë¶??? œ */}
			<div
				className='min-h-screen w-full flex items-center justify-center bg-gray-100 px-4'
				style={{ backgroundImage: `url('/login_bg.png')` }}
			>
				<div className='w-full max-w-5xl bg-gradient-to-b from-sky-50 to-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row'>
					{/* ?´ë?ì§€ ?ì—­ */}
					<div className='relative w-full md:w-1/2 h-[300px] md:h-auto'>
						{/* ë°°ê²½ ?´ë?ì§€ */}
						<img
							src='/login_notebook.png'
							alt='Login'
							className='w-full h-full object-cover md:rounded-l-3xl'
						/>

						{/* ë¡œê³  ?´ë?ì§€ (ì¢Œì¸¡ ?ë‹¨ ê³ ì •) */}
						<img
							src='/logo.svg'
							alt='Logo'
							className='absolute top-4 left-4 max-w-md h-auto'
						/>
						{/* ?œìŠ¤?œëª… (?°ì¸¡ ?ë‹¨ ê³ ì •) */}
						<div className='absolute top-4 right-4'>
							<span className='text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded'>
								{getSystemName()}
							</span>
						</div>
					</div>

					{/* ë¡œê·¸???ì—­ */}
					<div className='w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white'>
						<h2 className='text-3xl md:text-5xl font-extrabold text-gray-800 mb-10'>
							Sign in
						</h2>

						<form onSubmit={handleLogin}>
							{/* ID ?…ë ¥ */}
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

							{/* Password ?…ë ¥ */}
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

							{/* ?ëŸ¬ ë©”ì‹œì§€ */}
							{error && (
								<div className='mb-4 text-red-600 text-sm font-medium'>
									{typeof error === 'string' ? error : JSON.stringify(error)}
								</div>
							)}

							{/* Login ë²„íŠ¼ */}
							<button
								type='submit'
								disabled={loading}
								className='w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold py-3 rounded-full text-lg transition duration-200'
							>
								{loading ? 'ë¡œê·¸??ì¤?..' : 'Login'}
							</button>
						</form>

						{/* ?ˆë‚´ ë¬¸êµ¬ */}
						<p className='text-sm text-gray-600 mt-6'>
							ID???¬ì›ë²ˆí˜¸?´ë©°, ì´ˆê¸°ë¹„ë?ë²ˆí˜¸???¬ì›ë²ˆí˜¸?…ë‹ˆ??
						</p>
					</div>
				</div>

				{/* ?˜ë‹¨ ?ˆë‚´ */}
				<div className='absolute bottom-4 text-center w-full text-gray-700 text-sm'>
					ë³??œìŠ¤?œì? ë¶€?°ì¢…?©ì „?°ì‹œ?¤í…œ?…ë‹ˆ?? ë¬¸ì˜?¬í•­?€ ê²½ì˜ì§€?ë³¸ë¶€ë¥??´ìš©??
					ì£¼ì‹­?œì˜¤.
				</div>
			</div>
		</>
	)
}


