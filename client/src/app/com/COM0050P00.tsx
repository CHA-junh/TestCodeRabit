'use client'

import React, { useState, useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import '@/app/common/common.css'

/**
 * COM0050P00 - 테스트 로그인 화면
 * 
 * 주요 기능:
 * - 테스트용 사용자 로그인 처리
 * - 팝업 윈도우 형태로 동작
 * - 부모 윈도우 새로고침 연동
 * - 현재 로그인 사용자와 동일한 사용자 로그인 방지
 * 
 * 연관 테이블:
 * - TBL_USER_INF (사용자 정보)
 * - TBL_EMP_INF (직원 정보)
 * - TBL_DEPT (부서 정보)
 * - TBL_LOGIN_LOG (로그인 로그)
 */

export default function TestLoginPopup() {
	const [userId, setUserId] = useState('')
	const [loading, setLoading] = useState(false)
	const { showToast } = useToast()
	const { session } = useAuth()

	// 현재 로그인 사용자 정보
	const currentUser = session.user
	const currentUserId = currentUser?.userId || currentUser?.empNo || ''

	// API URL 환경변수 기반 설정
	const apiUrl =
		typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
			? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/test-login`
			: '/api/auth/test-login'

	// 숫자만 입력되도록 처리
	const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9]/g, '')
		setUserId(value)
	}

	// 테스트 로그인 처리
	const handleTestLogin = async () => {
		if (!userId) {
			showToast('테스트 사용자ID를 입력해주세요.', 'warning')
			return
		}

		// 현재 로그인 사용자와 동일한 사용자인지 체크
		if (currentUserId && userId === currentUserId) {
			showToast('현재 로그인된 사용자와 동일한 사용자로는 테스트 로그인할 수 없습니다.', 'warning')
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
				showToast(data.message || '테스트 로그인에 실패했습니다.', 'error')
			}
		} catch (err) {
			showToast('서버 연결에 실패했습니다.', 'error')
			console.error('Test login error:', err)
		} finally {
			setLoading(false)
		}
	}

	// 엔터키 처리
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleTestLogin()
		}
	}

	// ESC 키로 팝업 닫기
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
			{/* 상단 헤더 */}
			<div className='popup-header'>
				<h3 className='popup-title'>테스트 로그인 화면</h3>
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
							<th className='clear-th w-[110px]'>테스트 사용자ID</th>
							<td className='clear-td min-w-64'>
								<div className='flex items-center gap-2'>
									<input
										id='testUserId'
										type='text'
										value={userId}
										onChange={handleUserIdChange}
										onKeyDown={handleKeyDown}
										className='input-base input-default w-[120px] text-center'
										placeholder='사원번호'
										autoFocus
									/>
									<button
										type='button'
										className='btn-base btn-act'
										onClick={handleTestLogin}
										disabled={loading}
									>
										{loading ? '처리중...' : '확인'}
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				{/* 안내 문구 */}
				<div className='px-3'>
					<p className='text-sm text-blue-600 leading-relaxed'>
						테스트를 위한 화면 입니다.
					</p>
					<p className='text-sm text-blue-600 leading-relaxed'>
						테스트 하고자 하는 사용자 ID를 입력하고 확인 버튼을 클릭하세요.
					</p>
				</div>
			</div>
		</div>
	)
}
