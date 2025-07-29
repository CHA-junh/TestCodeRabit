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
		return '비밀번호는 8~20자여야 합니다.'
	}
	// 영문, 숫자, 특수문자 중 2종류 이상
	const types = [
		/[a-zA-Z]/.test(password),
		/[0-9]/.test(password),
		/[^a-zA-Z0-9]/.test(password), // 특수문자 포함
	].filter(Boolean).length
	if (types < 2) {
		return '영문, 숫자, 특수문자 중 2종류 이상을 조합해야 합니다.'
	}
	if (password.includes(userId)) {
		return '비밀번호에 사번(아이디)을 포함할 수 없습니다.'
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

	// 팝업이 닫힐 때 입력값/에러/로딩 상태 초기화
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
			setError('비밀번호가 일치하지 않습니다.')
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
			setError(err.message || '비밀번호 변경 중 오류가 발생했습니다.')
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
					비밀번호 변경 (임시)
				</h2>
				<p style={{ color: '#666', marginBottom: 16 }}>
					비밀번호는 8~20자, 영문/숫자/특수문자 중 2종류 이상을 조합해야 하며,
					<br />
					사번(아이디)와 동일하게 설정할 수 없습니다.
				</p>
				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: 12 }}>
						<label>새 비밀번호</label>
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
							placeholder='8~20자, 2종류 이상 조합'
						/>
					</div>
					<div style={{ marginBottom: 12 }}>
						<label>비밀번호 확인</label>
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
							placeholder='비밀번호 확인'
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
							{loading ? '변경 중...' : '확인'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
