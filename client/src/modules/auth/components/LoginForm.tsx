'use client'

import React, { useRef, useState, useEffect } from 'react'
import styles from './LoginForm.module.css'
import { PasswordChangePopup } from './PasswordChangePopup'
import { useAuth } from '../hooks/useAuth'

export default function LoginForm() {
	// 보안: 민감한 정보 로그 제거
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

	// 숫자만 입력되도록 처리
	const handleIdInput =
		(setter: (v: string) => void) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value.replace(/[^0-9]/g, '')
			setter(value)
		}

	// 로그인 폼 onSubmit 핸들러
	const handleSignInSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoginError(null)
		try {
			const result = await login(signInId, signInPw)
			// 보안: 민감한 정보 로그 제거
			if (result.success) {
				window.location.reload()
			} else if (result.needsPasswordChange) {
				setPwdChangeUserId(signInId)
				setPendingLogin({ empNo: signInId, password: signInPw })
				setPendingNeedsPwdChange(true)
				setLoginError(
					result.message ||
						'초기 비밀번호입니다. 비밀번호를 변경해야 로그인할 수 있습니다.'
				)
			} else {
				setLoginError(result.message || '로그인 실패')
			}
		} catch (err) {
			// 사용자 친화적 오류 메시지 처리
			const errorMessage =
				(err as any)?.message || '로그인 중 오류가 발생했습니다.'
			setLoginError(errorMessage)
		}
	}

	useEffect(() => {
		// 보안: 민감한 정보 로그 제거
		if (pendingNeedsPwdChange && !showPwdChange) {
			setShowPwdChange(true)
			setPendingNeedsPwdChange(false)
		}
	}, [pendingNeedsPwdChange, showPwdChange])

	const handlePwdChangeSubmit = async (newPassword: string) => {
		setPwdChangeLoading(true)
		setPwdChangeMsg(null)
		try {
			// API URL 환경변수 기반 설정
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
					'비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.'
				)
				setTimeout(() => {
					setShowPwdChange(false)
					setPwdChangeMsg(null)
					setPendingLogin(null)
					// 로그인 화면으로 돌아가기
					window.location.reload()
				}, 1200)
			} else {
				setPwdChangeMsg(data.message || '비밀번호 변경 실패')
			}
		} catch (err) {
			setPwdChangeMsg('서버 오류')
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
			{/* 보안: 민감한 정보 로그 제거 */}
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
							{/* 소셜 아이콘 삭제 */}
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
							{/* SIGN UP 버튼 삭제 */}
							{/* <button className={styles.form_btn}>Sign Up</button> */}
						</form>
					</div>
					<div className={styles['sign-in-container']}>
						<form className={styles.form} onSubmit={handleSignInSubmit}>
							<h1>Sign In</h1>
							{/* 소셜 아이콘 삭제 */}
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
							{/* 'or use your account' 문구 삭제 */}
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
								onClick={() => alert('로그인 버튼 클릭됨')}
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
