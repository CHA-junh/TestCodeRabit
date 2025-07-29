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
		return 'ë¹„ë?ë²ˆí˜¸??8~20?ì—¬???©ë‹ˆ??'
	}
	// ?ë¬¸, ?«ì, ?¹ìˆ˜ë¬¸ì ì¤?2ì¢…ë¥˜ ?´ìƒ
	const types = [
		/[a-zA-Z]/.test(password),
		/[0-9]/.test(password),
		/[^a-zA-Z0-9]/.test(password), // ?¹ìˆ˜ë¬¸ì ?¬í•¨
	].filter(Boolean).length
	if (types < 2) {
		return '?ë¬¸, ?«ì, ?¹ìˆ˜ë¬¸ì ì¤?2ì¢…ë¥˜ ?´ìƒ??ì¡°í•©?´ì•¼ ?©ë‹ˆ??'
	}
	if (password.includes(userId)) {
		return 'ë¹„ë?ë²ˆí˜¸???¬ë²ˆ(?„ì´?????¬í•¨?????†ìŠµ?ˆë‹¤.'
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

	// ?ì—…???«í ???…ë ¥ê°??ëŸ¬/ë¡œë”© ?íƒœ ì´ˆê¸°??
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
			setError('ë¹„ë?ë²ˆí˜¸ê°€ ?¼ì¹˜?˜ì? ?ŠìŠµ?ˆë‹¤.')
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
			setError(err.message || 'ë¹„ë?ë²ˆí˜¸ ë³€ê²?ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.')
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
					ë¹„ë?ë²ˆí˜¸ ë³€ê²?(?„ì‹œ)
				</h2>
				<p style={{ color: '#666', marginBottom: 16 }}>
					ë¹„ë?ë²ˆí˜¸??8~20?? ?ë¬¸/?«ì/?¹ìˆ˜ë¬¸ì ì¤?2ì¢…ë¥˜ ?´ìƒ??ì¡°í•©?´ì•¼ ?˜ë©°,
					<br />
					?¬ë²ˆ(?„ì´???€ ?™ì¼?˜ê²Œ ?¤ì •?????†ìŠµ?ˆë‹¤.
				</p>
				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: 12 }}>
						<label>??ë¹„ë?ë²ˆí˜¸</label>
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
							placeholder='8~20?? 2ì¢…ë¥˜ ?´ìƒ ì¡°í•©'
						/>
					</div>
					<div style={{ marginBottom: 12 }}>
						<label>ë¹„ë?ë²ˆí˜¸ ?•ì¸</label>
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
							placeholder='ë¹„ë?ë²ˆí˜¸ ?•ì¸'
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
							ì·¨ì†Œ
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
							{loading ? 'ë³€ê²?ì¤?..' : '?•ì¸'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}



