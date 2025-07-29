'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import COM0000M00 from './COM0000M00'
import { MESSAGE_CONSTANTS, ROUTE_CONSTANTS } from '../../utils/constants'

// ?„ë¦¬?˜ì¹˜ ë°©ì?
export const dynamic = 'force-dynamic'

/**
 * Mainframe Page - ë©”ì¸?„ë ˆ???˜ì´ì§€
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¸ì¦ ?íƒœ ?•ì¸
 * - ë©”ì¸?„ë ˆ???”ë©´ ?Œë”ë§?
 * - ë¯¸ì¸ì¦??¬ìš©??ë¦¬ë‹¤?´ë ‰??
 *
 * ?°ê? ì»´í¬?ŒíŠ¸:
 * - COM0000M00 (ë©”ì¸?„ë ˆ???”ë©´)
 */

export default function MainframePage() {
	const { isAuthenticated, loading } = useAuth()
	const router = useRouter()
	const [isClient, setIsClient] = useState(false)

	// ?´ë¼?´ì–¸???¬ì´???Œë”ë§??•ì¸
	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		// ?´ë¼?´ì–¸?¸ì—?œë§Œ ?¸ì¦ ì²´í¬
		if (!isClient) return

		// ë¡œë”©???„ë£Œ?˜ê³  ?¸ì¦?˜ì? ?Šì? ê²½ìš° ë¡œê·¸???˜ì´ì§€ë¡?ë¦¬ë‹¤?´ë ‰??
		if (!loading && !isAuthenticated) {
			console.log('?”’', MESSAGE_CONSTANTS.UNAUTHORIZED)
			window.location.href = '/signin'
		}
	}, [loading, isAuthenticated, isClient])

	// ?´ë¼?´ì–¸?¸ê? ?„ë‹ˆê±°ë‚˜ ë¡œë”© ì¤‘ì´ê±°ë‚˜ ?¸ì¦?˜ì? ?Šì? ê²½ìš° ë¡œë”© ?”ë©´ ?œì‹œ
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


