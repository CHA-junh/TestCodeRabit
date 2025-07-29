'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import COM0020M00 from '../com/COM0020M00'

// ?„ë¦¬?˜ì¹˜ ë°©ì?
export const dynamic = 'force-dynamic'

/**
 * Signin Page - ë¡œê·¸???˜ì´ì§€
 *
 * ì£¼ìš” ê¸°ëŠ¥:
 * - ?¸ì¦ ?íƒœ ?•ì¸
 * - ë¡œê·¸???”ë©´ ?Œë”ë§?
 * - ?¸ì¦???¬ìš©??ë¦¬ë‹¤?´ë ‰??
 *
 * ?°ê? ì»´í¬?ŒíŠ¸:
 * - COM0020M00 (ë¡œê·¸??Main ?”ë©´)
 */

export default function SigninPage() {
	const { isAuthenticated, loading } = useAuth()
	const [isClient, setIsClient] = useState(false)

	// ?´ë¼?´ì–¸???¬ì´???Œë”ë§??•ì¸
	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		// ?´ë¼?´ì–¸?¸ì—?œë§Œ ?¸ì¦ ì²´í¬
		if (!isClient) return

		// ë¡œë”©???„ë£Œ?˜ê³  ?´ë? ?¸ì¦??ê²½ìš° ë©”ì¸?˜ì´ì§€ë¡?ë¦¬ë‹¤?´ë ‰??
		if (!loading && isAuthenticated) {
			console.log('?”’ ?´ë? ?¸ì¦???¬ìš©?? ë©”ì¸?˜ì´ì§€ë¡?ë¦¬ë‹¤?´ë ‰??)
			window.location.href = '/mainframe'
		}
	}, [loading, isAuthenticated, isClient])

	// ?´ë¼?´ì–¸?¸ê? ?„ë‹ˆê±°ë‚˜ ë¡œë”© ì¤‘ì´ê±°ë‚˜ ?´ë? ?¸ì¦??ê²½ìš° ë¡œë”© ?”ë©´ ?œì‹œ
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
					<span className='text-gray-600'>ë¡œë”© ì¤?..</span>
				</div>
			</div>
		)
	}

	return <COM0020M00 />
}


