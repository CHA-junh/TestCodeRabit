'use client'

import React, { useState } from 'react'

interface PasswordChangePopupProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (newPassword: string) => Promise<void>
	userId: string
}

const validatePassword = (password: string, userId: string) => {
	if (password.length < 8 || password.length > 20) {
		return '๋น๋?๋ฒํธ??8~20?์ฌ???ฉ๋??'
	}
	// ?๋ฌธ, ?ซ์, ?น์๋ฌธ์ ์ค?2์ข๋ฅ ?ด์
	const types = [
		/[a-zA-Z]/.test(password),
		/[0-9]/.test(password),
		/[^a-zA-Z0-9]/.test(password), // ?น์๋ฌธ์ ?ฌํจ
	].filter(Boolean).length
	if (types < 2) {
		return '?๋ฌธ, ?ซ์, ?น์๋ฌธ์ ์ค?2์ข๋ฅ ?ด์??์กฐํฉ?ด์ผ ?ฉ๋??'
	}
	if (password.includes(userId)) {
		return '๋น๋?๋ฒํธ???ฌ๋ฒ(?์ด?????ฌํจ?????์ต?๋ค.'
	}
	return null
}

export const PasswordChangePopup: React.FC<PasswordChangePopupProps> = ({
	isOpen,
	onClose,
	onSubmit,
	userId,
}) => {
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	// ?์???ซํ ???๋ ฅ๊ฐ??๋ฌ/๋ก๋ฉ ?ํ ์ด๊ธฐ??
	React.useEffect(() => {
		if (!isOpen) {
			setNewPassword('')
			setConfirmPassword('')
			setError(null)
			setLoading(false)
		}
	}, [isOpen])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (newPassword !== confirmPassword) {
			setError('๋น๋?๋ฒํธ๊ฐ ?ผ์น?์? ?์ต?๋ค.')
			return
		}
		const patternError = validatePassword(newPassword, userId)
		if (patternError) {
			setError(patternError)
			return
		}
		setError(null)
		setLoading(true)
		try {
			await onSubmit(newPassword)
		} catch (err: any) {
			setError(err.message || '๋น๋?๋ฒํธ ๋ณ๊ฒ?์ค??ค๋ฅ๊ฐ ๋ฐ์?์ต?๋ค.')
		} finally {
			setLoading(false)
		}
	}

	if (!isOpen) return null

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				background: 'rgba(0,0,0,0.4)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 9999,
			}}
		>
			<div
				style={{
					background: 'white',
					borderRadius: 8,
					padding: 32,
					minWidth: 320,
				}}
			>
				<h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>
					๋น๋?๋ฒํธ ๋ณ๊ฒ?(?์)
				</h2>
				<p style={{ color: '#666', marginBottom: 16 }}>
					๋น๋?๋ฒํธ??8~20?? ?๋ฌธ/?ซ์/?น์๋ฌธ์ ์ค?2์ข๋ฅ ?ด์??์กฐํฉ?ด์ผ ?๋ฉฐ,
					<br />
					?ฌ๋ฒ(?์ด??? ?์ผ?๊ฒ ?ค์ ?????์ต?๋ค.
				</p>
				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: 12 }}>
						<label>??๋น๋?๋ฒํธ</label>
						<input
							type='password'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							style={{
								width: '100%',
								padding: 8,
								borderRadius: 4,
								border: '1px solid #ccc',
							}}
							placeholder='8~20?? 2์ข๋ฅ ?ด์ ์กฐํฉ'
						/>
					</div>
					<div style={{ marginBottom: 12 }}>
						<label>๋น๋?๋ฒํธ ?์ธ</label>
						<input
							type='password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							style={{
								width: '100%',
								padding: 8,
								borderRadius: 4,
								border: '1px solid #ccc',
							}}
							placeholder='๋น๋?๋ฒํธ ?์ธ'
						/>
					</div>
					{error && (
						<div style={{ color: 'red', marginBottom: 8 }}>{error}</div>
					)}
					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
						<button
							type='button'
							onClick={onClose}
							disabled={loading}
							style={{
								padding: '8px 16px',
								borderRadius: 4,
								background: '#eee',
							}}
						>
							์ทจ์
						</button>
						<button
							type='submit'
							disabled={loading}
							style={{
								padding: '8px 16px',
								borderRadius: 4,
								background: '#0070f3',
								color: 'white',
							}}
						>
							{loading ? '๋ณ๊ฒ?์ค?..' : '?์ธ'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}


