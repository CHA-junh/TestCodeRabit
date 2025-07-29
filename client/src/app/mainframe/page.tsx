'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import COM0000M00 from './COM0000M00'
import { MESSAGE_CONSTANTS, ROUTE_CONSTANTS } from '../../utils/constants'

// ?�리?�치 방�?
export const dynamic = 'force-dynamic'

/**
 * Mainframe Page - 메인?�레???�이지
 *
 * 주요 기능:
 * - ?�증 ?�태 ?�인
 * - 메인?�레???�면 ?�더�?
 * - 미인�??�용??리다?�렉??
 *
 * ?��? 컴포?�트:
 * - COM0000M00 (메인?�레???�면)
 */

export default function MainframePage() {
	const { isAuthenticated, loading } = useAuth()
	const router = useRouter()
	const [isClient, setIsClient] = useState(false)

	// ?�라?�언???�이???�더�??�인
	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		// ?�라?�언?�에?�만 ?�증 체크
		if (!isClient) return

		// 로딩???�료?�고 ?�증?��? ?��? 경우 로그???�이지�?리다?�렉??
		if (!loading && !isAuthenticated) {
			console.log('?��', MESSAGE_CONSTANTS.UNAUTHORIZED)
			window.location.href = '/signin'
		}
	}, [loading, isAuthenticated, isClient])

	// ?�라?�언?��? ?�니거나 로딩 중이거나 ?�증?��? ?��? 경우 로딩 ?�면 ?�시
	if (!isClient || loading || !isAuthenticated) {
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
					<span className='text-gray-600'>{MESSAGE_CONSTANTS.LOADING}</span>
				</div>
			</div>
		)
	}

	return <COM0000M00 />
}


