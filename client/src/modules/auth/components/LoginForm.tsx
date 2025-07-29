'use client'

import React, { useRef, useState, useEffect } from 'react'
import styles from './LoginForm.module.css'
import { PasswordChangePopup } from './PasswordChangePopup'
import { useAuth } from '../hooks/useAuth'

export default function LoginForm() {
	// 보안: 민감???�보 로그 ?�거
	const [rightPanelActive, setRightPanelActive] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const [signUpId, setSignUpId] = useState('')
	const [signInId, setSignInId] = useState('')
	const [signInPw, setSignInPw] = useState('')
	const [loginError, setLoginError] = useState<string | null>(null)
	const [showPwdChange, setShowPwdChange] = useState(false)
	const [pwdChangeUserId, setPwdChangeUserId] = useState('')
	const [pwdChangeLoading, setPwdChangeLoading] = useState(false)
	const [pwdChangeMsg, setPwdChangeMsg] = useState<string | null>(null)
	const [pendingLogin, setPendingLogin] = useState<{
		empNo: string
		password: string
	} | null>(null)
	const [pendingNeedsPwdChange, setPendingNeedsPwdChange] = useState(false)

	const { login } = useAuth()

	const handleSignUpClick = () => {
		setRightPanelActive(true)
	}
	const handleSignInClick = () => {
		setRightPanelActive(false)
	}

	// ?�자�??�력?�도�?처리
	const handleIdInput =
		(setter: (v: string) => void) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value.replace(/[^0-9]/g, '')
			setter(value)
		}

	// 로그????onSubmit ?�들??
	const handleSignInSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoginError(null)
		try {
			const result = await login(signInId, signInPw)
			// 보안: 민감???�보 로그 ?�거
			if (result.success) {
				window.location.reload()
			} else if (result.needsPasswordChange) {
				setPwdChangeUserId(signInId)
				setPendingLogin({ empNo: signInId, password: signInPw })
				setPendingNeedsPwdChange(true)
				setLoginError(
					result.message ||
						'초기 비�?번호?�니?? 비�?번호�?변경해??로그?�할 ???�습?�다.'
				)
			} else {
				setLoginError(result.message || '로그???�패')
			}
		} catch (err) {
			// ?�용??친화???�류 메시지 처리
			const errorMessage =
				(err as any)?.message || '로그??�??�류가 발생?�습?�다.'
			setLoginError(errorMessage)
		}
	}

	useEffect(() => {
		// 보안: 민감???�보 로그 ?�거
		if (pendingNeedsPwdChange && !showPwdChange) {
			setShowPwdChange(true)
			setPendingNeedsPwdChange(false)
		}
	}, [pendingNeedsPwdChange, showPwdChange])

	const handlePwdChangeSubmit = async (newPassword: string) => {
		setPwdChangeLoading(true)
		setPwdChangeMsg(null)
		try {
			// API URL ?�경변??기반 ?�정
			const apiUrl =
				typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
					? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/change-password`
					: '/api/auth/change-password'

			const res = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: pwdChangeUserId, newPassword }),
			})
			const data = await res.json()
			if (data.success) {
				setPwdChangeMsg(
					'비�?번호가 ?�공?�으�?변경되?�습?�다. ?�시 로그?�해주세??'
				)
				setTimeout(() => {
					setShowPwdChange(false)
					setPwdChangeMsg(null)
					setPendingLogin(null)
					// 로그???�면?�로 ?�아가�?
					window.location.reload()
				}, 1200)
			} else {
				setPwdChangeMsg(data.message || '비�?번호 변�??�패')
			}
		} catch (err) {
			setPwdChangeMsg('?�버 ?�류')
		} finally {
			setPwdChangeLoading(false)
		}
	}

	const handlePwdChangeClose = () => {
		setShowPwdChange(false)
		setPwdChangeMsg(null)
	}

	return (
		<>
			{/* 보안: 민감???�보 로그 ?�거 */}
			<PasswordChangePopup
				isOpen={showPwdChange}
				onClose={handlePwdChangeClose}
				onSubmit={handlePwdChangeSubmit}
				userId={pwdChangeUserId}
			/>
			{pwdChangeMsg && (
				<div style={{ color: 'green', textAlign: 'center', marginTop: 16 }}>
					{pwdChangeMsg}
				</div>
			)}
			<div className={styles.wrapper}>
				<div
					className={
						rightPanelActive
							? `${styles.container} right-panel-active`
							: styles.container
					}
					ref={containerRef}
				>
					<div className={styles['sign-up-container']}>
						<form className={styles.form}>
							<h1>Create Account</h1>
							{/* ?�셜 ?�이�???�� */}
							{/* <div className={styles['social-links']}>
								<div>
									<a href='#'>
										<FaFacebook />
									</a>
								</div>
								<div>
									<a href='#'>
										<FaTwitter />
									</a>
								</div>
								<div>
									<a href='#'>
										<FaLinkedin />
									</a>
								</div>
							</div> */}
							<span>or use your email for registration</span>
							<input type='text' placeholder='Name' className={styles.input} />
							<input
								type='text'
								placeholder='ID'
								className={styles.input}
								value={signUpId}
								onChange={handleIdInput(setSignUpId)}
								inputMode='numeric'
								pattern='[0-9]*'
								autoComplete='off'
							/>
							<input
								type='password'
								placeholder='Password'
								className={styles.input}
							/>
							{/* SIGN UP 버튼 ??�� */}
							{/* <button className={styles.form_btn}>Sign Up</button> */}
						</form>
					</div>
					<div className={styles['sign-in-container']}>
						<form className={styles.form} onSubmit={handleSignInSubmit}>
							<h1>Sign In</h1>
							{/* ?�셜 ?�이�???�� */}
							{/* <div className={styles['social-links']}>
								<div>
									<a href='#'>
										<FaFacebook />
									</a>
								</div>
								<div>
									<a href='#'>
										<FaTwitter />
									</a>
								</div>
								<div>
									<a href='#'>
										<FaLinkedin />
									</a>
								</div>
							</div> */}
							{/* 'or use your account' 문구 ??�� */}
							<input
								type='text'
								placeholder='ID'
								className={styles.input}
								value={signInId}
								onChange={handleIdInput(setSignInId)}
								inputMode='numeric'
								pattern='[0-9]*'
								autoComplete='off'
							/>
							<input
								type='password'
								placeholder='Password'
								className={styles.input}
								value={signInPw}
								onChange={(e) => setSignInPw(e.target.value)}
							/>
							<button
								className={styles.form_btn}
								type='submit'
								onClick={() => alert('로그??버튼 ?�릭??)}
							>
								Sign In
							</button>
							{loginError && (
								<div style={{ color: 'red', marginTop: 8 }}>{loginError}</div>
							)}
						</form>
					</div>
					<div className={styles['overlay-container']}>
						<div className={styles['overlay-left']}>
							<h1>Welcome Back</h1>
							<p>
								To keep connected with us please login with your personal info
							</p>
							<button
								id='signIn'
								className={styles.overlay_btn}
								onClick={handleSignInClick}
								type='button'
							>
								Sign In
							</button>
						</div>
						<div className={styles['overlay-right']}>
							<img
								src='/logo_bist.png'
								alt='Buttle Information Systems Logo'
								style={{ width: 180, marginBottom: 16 }}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}



