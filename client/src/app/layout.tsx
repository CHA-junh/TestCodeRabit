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

	// 페이지별 타이틀 설정
	useEffect(() => {
		if (!pathname) return

		let pageTitle = ''

		if (pathname.startsWith('/signin')) {
			pageTitle = '로그인'
		} else if (pathname.startsWith('/mainframe')) {
			// 메인프레임은 시스템명만 표시
			document.title = getSystemName()
			return
		} else if (pathname === '/') {
			pageTitle = '홈'
		}

		document.title = getPageTitle(pageTitle)
	}, [pathname])

	// WebSocket 완전 차단
	useEffect(() => {
		// WebSocket 생성자 완전 차단
		const originalWebSocket = (window as any).WebSocket
		;(window as any).WebSocket = function (
			url: string,
			protocols?: string | string[]
		) {
			// webpack-hmr 관련 연결 시도만 차단 (메시지 없이)
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
			// 다른 WebSocket 연결은 정상 처리
			return new originalWebSocket(url, protocols)
		}

		// 컴포넌트 언마운트 시 원래 WebSocket 복원
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
