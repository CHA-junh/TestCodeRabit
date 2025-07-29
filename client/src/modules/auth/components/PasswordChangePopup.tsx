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
		return '비�?번호??8~20?�여???�니??'
	}
	// ?�문, ?�자, ?�수문자 �?2종류 ?�상
	const types = [
		/[a-zA-Z]/.test(password),
		/[0-9]/.test(password),
		/[^a-zA-Z0-9]/.test(password), // ?�수문자 ?�함
	].filter(Boolean).length
	if (types < 2) {
		return '?�문, ?�자, ?�수문자 �?2종류 ?�상??조합?�야 ?�니??'
	}
	if (password.includes(userId)) {
		return '비�?번호???�번(?�이?????�함?????�습?�다.'
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

	// ?�업???�힐 ???�력�??�러/로딩 ?�태 초기??
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
			setError('비�?번호가 ?�치?��? ?�습?�다.')
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
			setError(err.message || '비�?번호 변�?�??�류가 발생?�습?�다.')
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
					비�?번호 변�?(?�시)
				</h2>
				<p style={{ color: '#666', marginBottom: 16 }}>
					비�?번호??8~20?? ?�문/?�자/?�수문자 �?2종류 ?�상??조합?�야 ?�며,
					<br />
					?�번(?�이???� ?�일?�게 ?�정?????�습?�다.
				</p>
				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: 12 }}>
						<label>??비�?번호</label>
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
							placeholder='8~20?? 2종류 ?�상 조합'
						/>
					</div>
					<div style={{ marginBottom: 12 }}>
						<label>비�?번호 ?�인</label>
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
							placeholder='비�?번호 ?�인'
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
							취소
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
							{loading ? '변�?�?..' : '?�인'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}



