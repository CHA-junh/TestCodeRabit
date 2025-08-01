'use client'

import React, { useState, useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import '@/app/common/common.css'

/**
 * COM0050P00 - ?ì¤??ë¡ê·¸???ë©´
 * 
 * ì£¼ì ê¸°ë¥:
 * - ?ì¤?¸ì© ?¬ì©??ë¡ê·¸??ì²ë¦¬
 * - ?ì ?ë???íë¡??ì
 * - ë¶ëª??ë???ë¡ê³ ì¹¨ ?°ë
 * - ?ì¬ ë¡ê·¸???¬ì©?ì? ?ì¼???¬ì©??ë¡ê·¸??ë°©ì?
 * 
 * ?°ê? ?ì´ë¸?
 * - TBL_USER_INF (?¬ì©???ë³´)
 * - TBL_EMP_INF (ì§ì ?ë³´)
 * - TBL_DEPT (ë¶???ë³´)
 * - TBL_LOGIN_LOG (ë¡ê·¸??ë¡ê·¸)
 */

export default function TestLoginPopup() {
	const [userId, setUserId] = useState('')
	const [loading, setLoading] = useState(false)
	const { showToast } = useToast()
	const { session } = useAuth()

	// ?ì¬ ë¡ê·¸???¬ì©???ë³´
	const currentUser = session.user
	const currentUserId = currentUser?.userId || currentUser?.empNo || ''

	// API URL ?ê²½ë³??ê¸°ë° ?¤ì 
	const apiUrl =
		typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
			? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/test-login`
			: '/api/auth/test-login'

	// ?«ìë§??ë ¥?ëë¡?ì²ë¦¬
	const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, '')
		setUserId(value)
	}

	// ?ì¤??ë¡ê·¸??ì²ë¦¬
	const handleTestLogin = async () => {
		if (!userId) {
			showToast('?ì¤???¬ì©?IDë¥??ë ¥?´ì£¼?¸ì.', 'warning')
			return
		}

		// ?ì¬ ë¡ê·¸???¬ì©?ì? ?ì¼???¬ì©?ì¸ì§ ì²´í¬
		if (currentUserId && userId === currentUserId) {
			showToast('?ì¬ ë¡ê·¸?¸ë ?¬ì©?ì? ?ì¼???¬ì©?ë¡???ì¤??ë¡ê·¸?¸í  ???ìµ?ë¤.', 'warning')
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
				showToast(data.message || '?ì¤??ë¡ê·¸?¸ì ?¤í¨?ìµ?ë¤.', 'error')
			}
		} catch (err) {
			showToast('?ë² ?°ê²°???¤í¨?ìµ?ë¤.', 'error')
			console.error('Test login error:', err)
		} finally {
			setLoading(false)
		}
	}

	// ?í°??ì²ë¦¬
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleTestLogin()
		}
	}

	// ESC ?¤ë¡ ?ì ?«ê¸°
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
			{/* ?ë¨ ?¤ë */}
			<div className='popup-header'>
				<h3 className='popup-title'>?ì¤??ë¡ê·¸???ë©´</h3>
				<button
					className='popup-close'
					type='button'
					onClick={() => window.close()}
				>
					Ã
				</button>
			</div>

			{/* ë³¸ë¬¸ */}
			<div className='popup-body text-left'>
				<table className='clear-table w-full mb-4'>
					<tbody>
						<tr className='clear-tr'>
							<th className='clear-th w-[110px]'>?ì¤???¬ì©?ID</th>
							<td className='clear-td min-w-64'>
								<div className='flex items-center gap-2'>
									<input
										id='testUserId'
										type='text'
										value={userId}
										onChange={handleUserIdChange}
										onKeyDown={handleKeyDown}
										className='input-base input-default w-[120px] text-center'
										placeholder='?¬ìë²í¸'
										autoFocus
									/>
									<button
										type='button'
										className='btn-base btn-act'
										onClick={handleTestLogin}
										disabled={loading}
									>
										{loading ? 'ì²ë¦¬ì¤?..' : '?ì¸'}
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				{/* ?ë´ ë¬¸êµ¬ */}
				<div className='px-3'>
					<p className='text-sm text-blue-600 leading-relaxed'>
						?ì¤?¸ë? ?í ?ë©´ ?ë??
					</p>
					<p className='text-sm text-blue-600 leading-relaxed'>
						?ì¤???ê³ ???ë ?¬ì©??IDë¥??ë ¥?ê³  ?ì¸ ë²í¼???´ë¦­?ì¸??
					</p>
				</div>
			</div>
		</div>
	)
}


