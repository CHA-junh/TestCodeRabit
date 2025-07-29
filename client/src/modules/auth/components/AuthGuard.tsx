'use client'

import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePathname } from 'next/navigation'

interface AuthGuardProps {
	children: React.ReactNode
	fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
	const { isAuthenticated, loading } = useAuth()
	const pathname = usePathname()

	// ë¡œê·¸??ê´€???˜ì´ì§€??
	const isAuthPage =
		pathname === '/signin' ||
		pathname === '/login' ||
		pathname.startsWith('/signin') ||
		pathname.startsWith('/login')

	useEffect(() => {
		// ë¡œë”©???„ë£Œ?˜ê³ , ?¸ì¦?˜ì? ?Šì•˜ê³? ë¡œê·¸???˜ì´ì§€ê°€ ?„ë‹Œ ê²½ìš°?ë§Œ ë¦¬ë‹¤?´ë ‰??
		if (!loading && !isAuthenticated && !isAuthPage) {
			window.location.href = '/signin'
		}
	}, [loading, isAuthenticated, isAuthPage])

	if (loading) {
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
					<span className='text-gray-600'>?¸ì¦ ?•ì¸ ì¤?..</span>
				</div>
			</div>
		)
	}

	// ë¡œê·¸???˜ì´ì§€?ì„œ???¸ì¦ ?íƒœ?€ ê´€ê³„ì—†???Œë”ë§?
	if (isAuthPage) {
		return <>{children}</>
	}

	// ?¸ì¦?˜ì? ?Šì? ê²½ìš° fallback ?ëŠ” null ë°˜í™˜
	if (!isAuthenticated) {
		if (fallback) {
			return <>{fallback}</>
		}
		return null
	}

	return <>{children}</>
}



