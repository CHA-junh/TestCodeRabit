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

	// 로그??관???�이지??
	const isAuthPage =
		pathname === '/signin' ||
		pathname === '/login' ||
		pathname.startsWith('/signin') ||
		pathname.startsWith('/login')

	useEffect(() => {
		// 로딩???�료?�고, ?�증?��? ?�았�? 로그???�이지가 ?�닌 경우?�만 리다?�렉??
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
					<span className='text-gray-600'>?�증 ?�인 �?..</span>
				</div>
			</div>
		)
	}

	// 로그???�이지?�서???�증 ?�태?� 관계없???�더�?
	if (isAuthPage) {
		return <>{children}</>
	}

	// ?�증?��? ?��? 경우 fallback ?�는 null 반환
	if (!isAuthenticated) {
		if (fallback) {
			return <>{fallback}</>
		}
		return null
	}

	return <>{children}</>
}



