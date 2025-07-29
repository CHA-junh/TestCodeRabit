'use client'

import React, { useState, useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import '@/app/common/common.css'

/**
 * COM0050P00 - ?�스??로그???�면
 * 
 * 주요 기능:
 * - ?�스?�용 ?�용??로그??처리
 * - ?�업 ?�도???�태�??�작
 * - 부�??�도???�로고침 ?�동
 * - ?�재 로그???�용?��? ?�일???�용??로그??방�?
 * 
 * ?��? ?�이�?
 * - TBL_USER_INF (?�용???�보)
 * - TBL_EMP_INF (직원 ?�보)
 * - TBL_DEPT (부???�보)
 * - TBL_LOGIN_LOG (로그??로그)
 */

export default function TestLoginPopup() {
	const [userId, setUserId] = useState('')
	const [loading, setLoading] = useState(false)
	const { showToast } = useToast()
	const { session } = useAuth()

	// ?�재 로그???�용???�보
	const currentUser = session.user
	const currentUserId = currentUser?.userId || currentUser?.empNo || ''

	// API URL ?�경변??기반 ?�정
	const apiUrl =
		typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
			? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/test-login`
			: '/api/auth/test-login'

	// ?�자�??�력?�도�?처리
	const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, '')
		setUserId(value)
	}

	// ?�스??로그??처리
	const handleTestLogin = async () => {
		if (!userId) {
			showToast('?�스???�용?�ID�??�력?�주?�요.', 'warning')
			return
		}

		// ?�재 로그???�용?��? ?�일???�용?�인지 체크
		if (currentUserId && userId === currentUserId) {
			showToast('?�재 로그?�된 ?�용?��? ?�일???�용?�로???�스??로그?�할 ???�습?�다.', 'warning')
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
				showToast(data.message || '?�스??로그?�에 ?�패?�습?�다.', 'error')
			}
		} catch (err) {
			showToast('?�버 ?�결???�패?�습?�다.', 'error')
			console.error('Test login error:', err)
		} finally {
			setLoading(false)
		}
	}

	// ?�터??처리
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleTestLogin()
		}
	}

	// ESC ?�로 ?�업 ?�기
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
			{/* ?�단 ?�더 */}
			<div className='popup-header'>
				<h3 className='popup-title'>?�스??로그???�면</h3>
				<button
					className='popup-close'
					type='button'
					onClick={() => window.close()}
				>
					×
				</button>
			</div>

			{/* 본문 */}
			<div className='popup-body text-left'>
				<table className='clear-table w-full mb-4'>
					<tbody>
						<tr className='clear-tr'>
							<th className='clear-th w-[110px]'>?�스???�용?�ID</th>
							<td className='clear-td min-w-64'>
								<div className='flex items-center gap-2'>
									<input
										id='testUserId'
										type='text'
										value={userId}
										onChange={handleUserIdChange}
										onKeyDown={handleKeyDown}
										className='input-base input-default w-[120px] text-center'
										placeholder='?�원번호'
										autoFocus
									/>
									<button
										type='button'
										className='btn-base btn-act'
										onClick={handleTestLogin}
										disabled={loading}
									>
										{loading ? '처리�?..' : '?�인'}
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				{/* ?�내 문구 */}
				<div className='px-3'>
					<p className='text-sm text-blue-600 leading-relaxed'>
						?�스?��? ?�한 ?�면 ?�니??
					</p>
					<p className='text-sm text-blue-600 leading-relaxed'>
						?�스???�고???�는 ?�용??ID�??�력?�고 ?�인 버튼???�릭?�세??
					</p>
				</div>
			</div>
		</div>
	)
}


