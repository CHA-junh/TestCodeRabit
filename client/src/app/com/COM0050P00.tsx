'use client'

import React, { useState, useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import '@/app/common/common.css'

/**
 * COM0050P00 - ?ŒìŠ¤??ë¡œê·¸???”ë©´
 * 
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?ŒìŠ¤?¸ìš© ?¬ìš©??ë¡œê·¸??ì²˜ë¦¬
 * - ?ì—… ?ˆë„???•íƒœë¡??™ì‘
 * - ë¶€ëª??ˆë„???ˆë¡œê³ ì¹¨ ?°ë™
 * - ?„ì¬ ë¡œê·¸???¬ìš©?ì? ?™ì¼???¬ìš©??ë¡œê·¸??ë°©ì?
 * 
 * ?°ê? ?Œì´ë¸?
 * - TBL_USER_INF (?¬ìš©???•ë³´)
 * - TBL_EMP_INF (ì§ì› ?•ë³´)
 * - TBL_DEPT (ë¶€???•ë³´)
 * - TBL_LOGIN_LOG (ë¡œê·¸??ë¡œê·¸)
 */

export default function TestLoginPopup() {
	const [userId, setUserId] = useState('')
	const [loading, setLoading] = useState(false)
	const { showToast } = useToast()
	const { session } = useAuth()

	// ?„ì¬ ë¡œê·¸???¬ìš©???•ë³´
	const currentUser = session.user
	const currentUserId = currentUser?.userId || currentUser?.empNo || ''

	// API URL ?˜ê²½ë³€??ê¸°ë°˜ ?¤ì •
	const apiUrl =
		typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
			? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/test-login`
			: '/api/auth/test-login'

	// ?«ìë§??…ë ¥?˜ë„ë¡?ì²˜ë¦¬
	const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, '')
		setUserId(value)
	}

	// ?ŒìŠ¤??ë¡œê·¸??ì²˜ë¦¬
	const handleTestLogin = async () => {
		if (!userId) {
			showToast('?ŒìŠ¤???¬ìš©?IDë¥??…ë ¥?´ì£¼?¸ìš”.', 'warning')
			return
		}

		// ?„ì¬ ë¡œê·¸???¬ìš©?ì? ?™ì¼???¬ìš©?ì¸ì§€ ì²´í¬
		if (currentUserId && userId === currentUserId) {
			showToast('?„ì¬ ë¡œê·¸?¸ëœ ?¬ìš©?ì? ?™ì¼???¬ìš©?ë¡œ???ŒìŠ¤??ë¡œê·¸?¸í•  ???†ìŠµ?ˆë‹¤.', 'warning')
			return
		}

		setLoading(true)

		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ empNo: userId }),
			})

			const data = await response.json()

			if (data.success) {
				if (window.opener) {
					window.opener.location.reload()
				}
				window.close()
			} else {
				showToast(data.message || '?ŒìŠ¤??ë¡œê·¸?¸ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.', 'error')
			}
		} catch (err) {
			showToast('?œë²„ ?°ê²°???¤íŒ¨?ˆìŠµ?ˆë‹¤.', 'error')
			console.error('Test login error:', err)
		} finally {
			setLoading(false)
		}
	}

	// ?”í„°??ì²˜ë¦¬
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleTestLogin()
		}
	}

	// ESC ?¤ë¡œ ?ì—… ?«ê¸°
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				window.close()
			}
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [])

	return (
		<div className='popup-wrapper'>
			{/* ?ë‹¨ ?¤ë” */}
			<div className='popup-header'>
				<h3 className='popup-title'>?ŒìŠ¤??ë¡œê·¸???”ë©´</h3>
				<button
					className='popup-close'
					type='button'
					onClick={() => window.close()}
				>
					Ã—
				</button>
			</div>

			{/* ë³¸ë¬¸ */}
			<div className='popup-body text-left'>
				<table className='clear-table w-full mb-4'>
					<tbody>
						<tr className='clear-tr'>
							<th className='clear-th w-[110px]'>?ŒìŠ¤???¬ìš©?ID</th>
							<td className='clear-td min-w-64'>
								<div className='flex items-center gap-2'>
									<input
										id='testUserId'
										type='text'
										value={userId}
										onChange={handleUserIdChange}
										onKeyDown={handleKeyDown}
										className='input-base input-default w-[120px] text-center'
										placeholder='?¬ì›ë²ˆí˜¸'
										autoFocus
									/>
									<button
										type='button'
										className='btn-base btn-act'
										onClick={handleTestLogin}
										disabled={loading}
									>
										{loading ? 'ì²˜ë¦¬ì¤?..' : '?•ì¸'}
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				{/* ?ˆë‚´ ë¬¸êµ¬ */}
				<div className='px-3'>
					<p className='text-sm text-blue-600 leading-relaxed'>
						?ŒìŠ¤?¸ë? ?„í•œ ?”ë©´ ?…ë‹ˆ??
					</p>
					<p className='text-sm text-blue-600 leading-relaxed'>
						?ŒìŠ¤???˜ê³ ???˜ëŠ” ?¬ìš©??IDë¥??…ë ¥?˜ê³  ?•ì¸ ë²„íŠ¼???´ë¦­?˜ì„¸??
					</p>
				</div>
			</div>
		</div>
	)
}


