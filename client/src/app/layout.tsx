'use client'
import './globals.css'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { AuthProvider } from '../modules/auth/hooks/useAuth'
import { ToastProvider } from '../contexts/ToastContext'
import { getPageTitle, getSystemName } from '../utils/environment'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Script from 'next/script'

const queryClient = new QueryClient()

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const isAuthPage =
		pathname?.startsWith('/signin') || pathname?.startsWith('/signup')

	// ?�이지�??�?��? ?�정
	useEffect(() => {
		if (!pathname) return

		let pageTitle = ''

		if (pathname.startsWith('/signin')) {
			pageTitle = '로그??
		} else if (pathname.startsWith('/mainframe')) {
			// 메인?�레?��? ?�스?�명�??�시
			document.title = getSystemName()
			return
		} else if (pathname === '/') {
			pageTitle = '??
		}

		document.title = getPageTitle(pageTitle)
	}, [pathname])

	// WebSocket ?�전 차단
	useEffect(() => {
		// WebSocket ?�성???�전 차단
		const originalWebSocket = (window as any).WebSocket
		;(window as any).WebSocket = function (
			url: string,
			protocols?: string | string[]
		) {
			// webpack-hmr 관???�결 ?�도�?차단 (메시지 ?�이)
			if (
				url &&
				(url.includes('webpack-hmr') || url.includes('_next/webpack-hmr'))
			) {
				return {
					readyState: 3,
					url: url,
					protocol: protocols || '',
					extensions: '',
					bufferedAmount: 0,
					onopen: null,
					onclose: null,
					onmessage: null,
					onerror: null,
					close: () => {},
					send: () => {},
					addEventListener: () => {},
					removeEventListener: () => {},
					dispatchEvent: () => false,
				}
			}
			// ?�른 WebSocket ?�결?� ?�상 처리
			return new originalWebSocket(url, protocols)
		}

		// 컴포?�트 ?�마?�트 ???�래 WebSocket 복원
		return () => {
			;(window as any).WebSocket = originalWebSocket
		}
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<html lang='ko'>
				<body
					className={isAuthPage ? '' : 'min-h-screen h-screen overflow-hidden'}
				>
					<AuthProvider>
						<ToastProvider>{children}</ToastProvider>
					</AuthProvider>
				</body>
			</html>
		</QueryClientProvider>
	)
}




