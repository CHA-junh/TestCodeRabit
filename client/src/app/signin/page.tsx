'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import COM0020M00 from '../com/COM0020M00'

// 프리페치 방지
export const dynamic = 'force-dynamic'

/**
 * Signin Page - 로그인 페이지
 *
 * 주요 기능:
 * - 인증 상태 확인
 * - 로그인 화면 렌더링
 * - 인증된 사용자 리다이렉트
 *
 * 연관 컴포넌트:
 * - COM0020M00 (로그인 Main 화면)
 */

export default function SigninPage() {
	const { isAuthenticated, loading } = useAuth()
	const [isClient, setIsClient] = useState(false)

	// 클라이언트 사이드 렌더링 확인
	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		// 클라이언트에서만 인증 체크
		if (!isClient) return

		// 로딩이 완료되고 이미 인증된 경우 메인페이지로 리다이렉트
		if (!loading && isAuthenticated) {
			console.log('🔒 이미 인증된 사용자, 메인페이지로 리다이렉트')
			window.location.href = '/mainframe'
		}
	}, [loading, isAuthenticated, isClient])

	// 클라이언트가 아니거나 로딩 중이거나 이미 인증된 경우 로딩 화면 표시
	if (!isClient || loading || isAuthenticated) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='flex items-center space-x-2'>
					<svg
						className='animate-spin h-8 w-8 text-blue-600'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
					>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'
						></circle>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
						></path>
					</svg>
					<span className='text-gray-600'>로딩 중...</span>
				</div>
			</div>
		)
	}

	return <COM0020M00 />
}
